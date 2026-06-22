import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PlansModule } from './plans/plans.module';

@Module({
  imports: [PrismaModule, AuthModule, UsersModule, PlansModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
