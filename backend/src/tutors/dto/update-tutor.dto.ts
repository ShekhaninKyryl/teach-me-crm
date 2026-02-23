import { IsArray, IsInt, IsOptional, IsString, Min } from "class-validator";

export class UpdateTutorDto {
    @IsOptional()
    @IsInt()
    @Min(0)
    price?: number;

    @IsOptional()
    @IsString()
    location?: string;

    @IsOptional()
    @IsString()
    bio?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    availability?: string[];

    @IsOptional()
    @IsInt()
    @Min(3)
    maxStudents?: number;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    subjects?: string[];

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    formats?: ("ONLINE" | "OFFLINE")[];

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsString()
    viber?: string;

    @IsOptional()
    @IsString()
    telegram?: string;

    @IsOptional()
    @IsString()
    whatsapp?: string;
}