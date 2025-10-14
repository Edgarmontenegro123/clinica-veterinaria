import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, ParseIntPipe } from '@nestjs/common';
import { PetsService } from './pets.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { Client } from 'src/auth/entities/client.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter } from './helpers/fileFilter.helpers';
import { diskStorage } from 'multer';
import { fileNamer } from './helpers/fileNamer.helpers';
import { join } from 'path';
import * as fs from 'fs';
import { ValidRoles } from 'src/auth/interfaces/valid-roles';

@Controller('pets')
export class PetsController {
  constructor(private readonly petsService: PetsService) { }

  @Post()
  @Auth()
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: fileFilter,
    storage: diskStorage({
      destination: (req, file, cb) => {
        const uploadPath = join(process.cwd(), 'uploads', 'pets');
        if (!fs.existsSync(uploadPath)) {
          fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
      },
      filename: fileNamer
    })
  }))
  create(
    @UploadedFile() file: Express.Multer.File,
    @GetUser() client: Client,
    @Body() createPetDto: CreatePetDto) {

    if (file) {
      createPetDto.image = `/uploads/pets/${file.filename}`;
    }

    return this.petsService.create(createPetDto, client);
  }

  @Get()
  @Auth()
  findAll(
    @GetUser() client: Client
  ) {
    return this.petsService.findAll(client);
  }


  @Get(':id')
  @Auth()
  findOne(
    @Param('id') id: string,
    @GetUser() client: Client
  ) {
    return this.petsService.findOne(+id, client);
  }

  @Patch(':id')
  @Auth()
  update(
    @Param('id') id: string, 
    @Body() updatePetDto: UpdatePetDto,
    @GetUser() client: Client
  ) {
    return this.petsService.update(+id, updatePetDto, client);
  }

  @Delete(':id')
  @Auth()
  remove(
    @Param('id') id: string,
    @GetUser() client: Client
  ) {
    return this.petsService.remove(+id, client);
  }
}
