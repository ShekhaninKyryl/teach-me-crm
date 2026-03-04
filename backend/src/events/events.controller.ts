import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { EventsService } from "./events.service";
import { UpsertEventDto } from "./dto/events.dto";
import { AuthGuard } from "src/auth/auth.guard";

@UseGuards(AuthGuard)
@Controller("events")
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get(":userId")
  async getEvents(@Param("userId") userId: string) {
    return this.eventsService.getTutorEvents(userId);
  }

  @Post()
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  )
  async setEvents(@Body() events: UpsertEventDto[]) {
    await this.eventsService.upsertMany(events);
  }
}
