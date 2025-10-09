import { Module } from '@nestjs/common';
import { PetsService } from './pets.service';
import { PetsController } from './pets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pet } from './entities/pet.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [PetsController],
  providers: [PetsService],
  imports: [
    AuthModule,

    TypeOrmModule.forFeature([Pet])
  ],
})
export class PetsModule {}
