import { Injectable } from '@nestjs/common';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { Client } from 'src/auth/entities/client.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Pet } from './entities/pet.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PetsService {

  constructor(

    @InjectRepository(Pet)
    private readonly petRepository: Repository<Pet>,

  ) { }

  async create(createPetDto: CreatePetDto, client: Client) {

    const pet = this.petRepository.create({
      ...createPetDto,
      id_client: client.id,
    });


    return await this.petRepository.save(pet);

  }

  async findAll() {
    return await this.petRepository.find({
      relations: ['client'],
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} pet`;
  }

  update(id: number, updatePetDto: UpdatePetDto) {
    return `This action updates a #${id} pet`;
  }

  remove(id: number) {
    return `This action removes a #${id} pet`;
  }
}
