import {
  Body,
  Controller,
  Post,
} from '@nestjs/common';

import { AiService } from './ai.service';

import { GenerateLayoutDto } from './dto/generate-layout.dto';
import { PlanEditDto } from './dto/plan-edit.dto';
import { UpdateLayoutDto } from './dto/update-layout.dto';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('generate')
  generate(@Body() dto: GenerateLayoutDto) {
    return this.aiService.generateLayout(dto);
  }

  @Post('plan')
  plan(@Body() dto: PlanEditDto) {
    return this.aiService.planModification(
      dto.message,
      dto.currentLayout,
    );
  }

  @Post('update')
  update(@Body() dto: UpdateLayoutDto) {
    return this.aiService.updateLayout(
      dto.message,
      dto.currentLayout,
    );
  }
}