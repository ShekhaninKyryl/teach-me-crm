import { IsIn, IsInt, Max, Min } from "class-validator";

const MAX_AVATAR_SIZE_BYTES = 2 * 1024 * 1024;

export class CreateAvatarPresignDto {
  @IsIn(["image/jpeg", "image/png"])
  contentType!: "image/jpeg" | "image/png";

  @IsInt()
  @Min(1)
  @Max(MAX_AVATAR_SIZE_BYTES)
  sizeBytes!: number;
}

