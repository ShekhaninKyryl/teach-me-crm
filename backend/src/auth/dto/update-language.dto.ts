import { IsIn, IsString } from "class-validator";

export class UpdateLanguageDto {
  @IsString()
  @IsIn(["ua", "en"])
  language!: string;
}
