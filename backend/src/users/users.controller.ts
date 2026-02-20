import { Controller, Get, Param, Query } from "@nestjs/common";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
    constructor(private readonly users: UsersService) {}

    @Get("by-email")
    getByEmail(@Query("email") email: string) {
        return this.users.getUserByEmail(email);
    }

    @Get(":id")
    getById(@Param("id") id: string) {
        return this.users.getUserById(id);
    }
}