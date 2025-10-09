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
    age: number;

    @IsDate()
    @IsOptional()
    birth_date?: Date;

    @IsString({ each: true })
    @IsOptional()
    vaccines?: string[];

    @IsString()
    @IsOptional()
    history?: string;

    @IsString()
    @IsOptional()
    image?: string;

    @IsString()
    @IsNotEmpty()
    sex: string;

    @IsOptional()
    has_owner?: boolean;

    @IsOptional()
    id_client?: number
    
    @IsString()
    @IsNotEmpty()
    breed: string;
}

