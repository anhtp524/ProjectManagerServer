import { IsArray, IsDate, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateEmployeeDto {
    @IsNotEmpty()
    @IsString()
    name: string

    @IsNotEmpty()
    @IsDate()
    birthday: Date

    @IsNotEmpty()
    @IsString()
    address: string

    @IsNotEmpty()
    @IsString()
    idCard: string

    @IsString()
    phoneNumber: string

    @IsArray()
    technology: string[]

    @IsNumber()
    experience: number

    @IsArray()
    language: string[]

    @IsArray()
    certificate: string[]
    
}

export class UpdateEmployeeDto {
    @IsString()
    address: string;

    @IsNumber()
    phoneNumber: string;

    @IsArray()
    technology: string[]

    @IsArray()
    language: string[]

    @IsArray()
    certificate: string[]
}