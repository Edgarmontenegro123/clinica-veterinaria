import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateClientDto {
    
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    phone: string;

    @IsString()
    @IsOptional()
    address?: string;

    @IsString()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString({ each: true })
    @IsOptional()
    roles?: string[]
}
