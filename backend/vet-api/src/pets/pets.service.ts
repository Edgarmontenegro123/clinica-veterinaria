import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pet } from './entities/pet.entity';
import { Client } from 'src/auth/entities/client.entity';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';

@Injectable()
export class PetsService {

  private readonly logger = new Logger('PetsService');


  constructor(

    @InjectRepository(Pet)
    private readonly petRepository: Repository<Pet>,

  ) { }

  async create(createPetDto: CreatePetDto, client: Client) {
    try {

      const pet = this.petRepository.create({
        ...createPetDto,
        id_client: client.id,
      });

      return await this.petRepository.save(pet);
    } catch (error) {
      this.handleExceptions(error)
    }
  }

  async findAll(client: Client) {
    try {
      if (client.roles.includes('admin')) {
        return await this.petRepository.find({
          relations: ['client'],
        });
      }

      return await this.petRepository.find({
        where: { id_client: client.id },
        relations: ['client'],
      });
    } catch (error) {
      this.handleExceptions(error)
    }
  }


  async findOne(id: number, client: Client) {
    try {

      const pet = await this.petRepository.findOne({
        where: { id },
        relations: ['client'],
      });

      if (!pet) {
        throw new NotFoundException(`Pet with ID ${id} not found`);
      }

      if (pet.id_client !== client.id && !client.roles.includes('admin')) {
        throw new ForbiddenException(`You don't have access to this pet`);
      }

      return pet;
    } catch (error) {
      this.handleExceptions(error)
    }
  }

  async update(id: number, updatePetDto: UpdatePetDto, client: Client) {
    try {
      const pet = await this.petRepository.preload({
        id,
        ...updatePetDto,
      });

      if (!pet) {
        throw new NotFoundException(`Pet with ID ${id} not found`);
      }

      if (pet.id_client !== client.id && !client.roles.includes('admin')) {
        throw new ForbiddenException(`You don't have access to this pet`);
      }

      return await this.petRepository.save(pet);
    } catch (error) {
      this.handleExceptions(error)
    }
  }

  async remove(id: number, client: Client) {
    try {
      const pet = await this.findOne(id, client);
      await this.petRepository.remove(pet);

      return { message: `Pet with ID ${id} has been removed` };
    } catch (error) {
      this.handleExceptions(error)
    }
  }

  private handleExceptions(error: any) {
    if (error.code === '1062')
      throw new BadRequestException(error.detail)

    this.logger.error(error)
    throw new InternalServerErrorException('Unexpected error, check server log')
  }
}
