import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PetsModule } from './pets/pets.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [

    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'clinica_ramvet',
      autoLoadEntities: true,
      synchronize: true,
    }),

    PetsModule,

    AuthModule,

  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
