import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { EventsService } from "./events.service";
import { EventDto } from "./dto/events.dto";
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
  async setEvents(@Body() events: EventDto[]) {
    await this.eventsService.createEvents(events);
  }

  @Patch()
  async updateEvents(@Body() events: EventDto[]) {
    await this.eventsService.updateEvents(events);
  }

  @Delete(":eventId")
  async deleteEvent(@Param("eventId") eventId: string) {
    await this.eventsService.deleteEvent(eventId);
  }
}
