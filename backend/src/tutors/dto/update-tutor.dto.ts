import { IsOptional, IsString } from "class-validator";
import { CreateTutorDto } from "src/tutors/dto/create-tutor.dto";

export class UpdateTutorDto extends CreateTutorDto {
  @IsOptional()
  @IsString()
  currentPassword?: string;
}
