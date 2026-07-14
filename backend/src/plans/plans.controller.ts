import { Body, Controller, Get, Param, Post, Patch, Delete } from '@nestjs/common';
import { PlansService } from './plans.service';
import { UpdateLayoutDto } from '../ai/dto/update-layout.dto';
import { PlanEditDto } from '../ai/dto/plan-edit.dto';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';


@Controller('plans')
export class PlansController {
  constructor(private plansService: PlansService) {}

  @Post()
  create(@Body() dto: CreatePlanDto) {
    return this.plansService.create(dto);
  }

  @Get('user/:clerkId')
  findAll(@Param('clerkId') clerkId: string) {
    return this.plansService.findAll(clerkId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.plansService.findOne(id);
  }

  @Post(':id/generate')
  generate(@Param('id') id: string) {
    return this.plansService.generate(id);
  }

  @Post(':id/plan')
  planModification(@Param('id') id: string,@Body() dto: PlanEditDto) {
    return this.plansService.planModification(
      id,
      dto.message,
    );
  }

  @Post(':id/update')
  updateLayout(@Param('id') id: string,@Body() dto: UpdateLayoutDto) {
    return this.plansService.updateLayout(
      id,
      dto.message,
    );
  }

  @Post(':id/finalize')
  finalize(@Param('id') id: string) {
    return this.plansService.finalize(id);
  }

  @Patch(':id')
  rename(@Param('id') id: string,@Body() dto: UpdatePlanDto) {
    return this.plansService.rename(
      id,
      dto.name,
    );
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.plansService.delete(id);
  }

}