import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';
import { CreatePlanDto } from './dto/create-plan.dto';

@Injectable()
export class PlansService {
  constructor(
    private prisma: PrismaService,
    private aiService: AiService,
  ) {}

  create(userId: string, dto: CreatePlanDto) {
    return this.prisma.plan.create({
      data: {
        userId,
        name: dto.name,
        boundary: dto.boundary,
        constraints: dto.constraints,
      },
    });
  }

  findAll(userId: string) {
    return this.prisma.plan.findMany({
      where: { userId },
    });
  }

  findOne(id: string) {
    return this.prisma.plan.findUnique({
      where: { id },
    });
  }

  async saveLayout(id: string, layout: any) {
    return this.prisma.plan.update({
      where: { id },
      data: {
        layout,
        status: "generated",
      },
    });
  }

  delete(id: string) {
    return this.prisma.plan.delete({
      where: { id },
    });
  }

  update(id: string, data: any) {
    return this.prisma.plan.update({
      where: { id },
      data,
    });
  }

  async generatePlan(plan: any) {
    const aiResult = await this.aiService.generateWithGemini({
      boundary: plan.boundary,
      constraints: plan.constraints,
    });

    return this.prisma.plan.update({
      where: { id: plan.id },
      data: {
        layout: aiResult,
      },
    });
  }

}