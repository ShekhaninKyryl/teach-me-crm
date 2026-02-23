import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import {UsersModule} from "src/users/users.module";
import {AuthModule} from "src/auth/auth.module";
import {TutorsModule} from "src/tutors/tutors.module";
import {PrismaModule} from "prisma/prisma.module";

ConfigModule.forRoot({
  isGlobal: true,
  envFilePath: [".env"],
});

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule, UsersModule, AuthModule, TutorsModule],
})
export class AppModule {}
