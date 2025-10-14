import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

export class CreatePetDto {

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    species: string;

    @IsNumber()
    @IsPositive()
    @Type(() => Number)
    age: number;

    @IsString()
    @IsNotEmpty()
    sex: string;
    
    
    @IsString()
    @IsNotEmpty()
    breed: string;
    
    @IsString()
    @IsOptional()
    image?: string;
    
  
    @IsDate()
    @IsOptional()
    birth_date?: Date;

    @IsString({ each: true })
    @IsOptional()
    vaccines?: string[];

    @IsString()
    @IsOptional()
    history?: string;
    
    @IsOptional()
    has_owner?: boolean;
    
    @IsOptional()
    id_client?: number
}

