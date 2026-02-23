import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcryptjs";
import {PrismaService} from "prisma/prisma.service";

@Injectable()
export class AuthService {
    constructor(private readonly prisma: PrismaService) {}

    async login(email: string, password: string) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user?.passwordHash) return null;

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return null;

        const { passwordHash, ...safe } = user;
        return safe;
    }
}