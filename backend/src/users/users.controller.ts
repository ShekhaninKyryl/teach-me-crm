import { Controller, Get, Param, Query, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { AuthGuard } from "../auth/auth.guard";

@Controller("users")
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @UseGuards(AuthGuard)
  @Get("by-email")
  getByEmail(@Query("email") email: string) {
    return this.users.getUserByEmail(email);
  }

  @UseGuards(AuthGuard)
  @Get(":id")
  getById(@Param("id") id: string) {
    return this.users.getUserById(id);
  }
}
