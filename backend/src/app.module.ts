import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { PlansModule } from './plans/plans.module';
import { AiModule } from './ai/ai.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [PrismaModule, UsersModule, PlansModule, AiModule, HealthModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
