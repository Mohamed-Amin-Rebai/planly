import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HealthService {
    constructor(
        private prisma: PrismaService,
    ) {}

    async check() {
        let database = "offline";

        try {
            await this.prisma.$runCommandRaw({
            ping: 1,
            });

            database = "online";
        } catch {}

        return {
            status: "ok",
            api: "online",
            database,
            ai: process.env.GEMINI_API_KEY
            ? "online"
            : "offline",
        };
    }
}
