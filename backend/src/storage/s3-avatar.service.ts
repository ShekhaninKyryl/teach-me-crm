import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const AVATAR_UPLOAD_EXPIRES_IN_SECONDS = 300;

@Injectable()
export class S3AvatarService {
  private readonly bucket: string;
  private readonly region: string;
  private readonly publicBaseUrl?: string;
  private readonly client: S3Client;

  constructor(private readonly configService: ConfigService) {
    this.bucket = this.configService.get<string>("S3_AVATARS_BUCKET") ?? "";
    this.region = this.configService.get<string>("AWS_REGION") ?? "";
    this.publicBaseUrl = this.configService.get<string>("S3_PUBLIC_BASE_URL");

    if (!this.bucket) {
      throw new InternalServerErrorException("S3_AVATARS_BUCKET is not configured");
    }

    if (!this.region) {
      throw new InternalServerErrorException("AWS_REGION is not configured");
    }

    const s3AccessKeyId = this.configService.get<string>("S3_ACCESS_KEY_ID");
    const s3SecretAccessKey = this.configService.get<string>("S3_SECRET_ACCESS_KEY");
    const s3SessionToken = this.configService.get<string>("S3_SESSION_TOKEN");

    if ((s3AccessKeyId && !s3SecretAccessKey) || (!s3AccessKeyId && s3SecretAccessKey)) {
      throw new InternalServerErrorException(
        "S3_ACCESS_KEY_ID and S3_SECRET_ACCESS_KEY must be provided together",
      );
    }

    this.client = new S3Client({
      region: this.region,
      ...(s3AccessKeyId && s3SecretAccessKey
        ? {
            credentials: {
              accessKeyId: s3AccessKeyId,
              secretAccessKey: s3SecretAccessKey,
              ...(s3SessionToken ? { sessionToken: s3SessionToken } : {}),
            },
          }
        : {}),
    });
  }

  async createAvatarUploadUrl(userId: string, contentType: string) {
    const key = this.buildAvatarKey(userId);
    const version = Date.now();

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(this.client, command, {
      expiresIn: AVATAR_UPLOAD_EXPIRES_IN_SECONDS,
    });

    return {
      uploadUrl,
      key,
      avatarUrl: this.withVersion(this.resolvePublicUrl(key), version),
      expiresIn: AVATAR_UPLOAD_EXPIRES_IN_SECONDS,
      headers: {
        "Content-Type": contentType,
      },
    };
  }

  private buildAvatarKey(userId: string): string {
    return `avatars/${userId}.jpg`;
  }

  private resolvePublicUrl(key: string): string {
    if (this.publicBaseUrl) {
      const normalized = this.publicBaseUrl.replace(/\/$/, "");
      return `${normalized}/${key}`;
    }

    return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`;
  }

  private withVersion(url: string, version: number): string {
    const separator = url.includes("?") ? "&" : "?";
    return `${url}${separator}v=${version}`;
  }
}

