import { Module } from '@nestjs/common';
import { PlansService } from './plans.service';
import { PlansController } from './plans.controller';
import { AiService } from 'src/ai/ai.service';

@Module({
  controllers: [PlansController],
  providers: [PlansService, AiService],
})
export class PlansModule {}
