import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as cookieParser from "cookie-parser";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableShutdownHooks();

  const cp = (cookieParser as any).default ?? cookieParser;
  app.use(cp());

  app.enableCors({
    origin: [process.env.CORS_ORIGIN],
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
