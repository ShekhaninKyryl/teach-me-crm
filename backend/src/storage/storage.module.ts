import { Module } from "@nestjs/common";
import { S3AvatarService } from "src/storage/s3-avatar.service";

@Module({
  providers: [S3AvatarService],
  exports: [S3AvatarService],
})
export class StorageModule {}

