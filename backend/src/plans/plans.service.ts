import { Injectable , NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';
import { CreatePlanDto } from './dto/create-plan.dto';

@Injectable()
export class PlansService {
  constructor(
    private prisma: PrismaService,
    private aiService: AiService,
  ) {}

  create(dto: CreatePlanDto) {
    return this.prisma.plan.create({
      data: {
        clerkId: dto.clerkId,
        name: dto.name,
        boundary: dto.boundary,
        constraints: dto.constraints,
      },
    });
  }

  findAll(clerkId: string) {
    return this.prisma.plan.findMany({
      where: { clerkId },
    });
  }

  async findOne(id: string) {
    const plan = await this.prisma.plan.findUnique({
      where: { id },
    });

    if (!plan) {
      throw new NotFoundException('Plan not found');
    }

    return plan;
  }

  async generate(id: string) {
    const plan = await this.findOne(id);

    const layout = await this.aiService.generateLayout({
      boundary: plan.boundary,
      roomSetup: (plan.constraints as any).roomSetup,
      desiredBuiltArea: (plan.constraints as any).desiredBuiltArea,
      userPrompt: (plan.constraints as any).userPrompt,
    });

    return this.saveLayout(id, layout);
  }

  async saveLayout(id: string, layout: any) {
    return this.prisma.plan.update({
      where: { id },
      data: {
        layout,
        status: 'generated',
      },
    });
  }

  async updateLayout(id: string,message: string) {
    const plan = await this.findOne(id);

    if (!plan.layout) {
      throw new Error(
        'Generate a layout before editing it',
      );
    }

    const updatedLayout =
      await this.aiService.updateLayout(
        message,
        plan.layout,
      );

    return this.prisma.plan.update({
      where: { id },
      data: {
        layout: updatedLayout,
        status: 'editing',
      },
    });
  }

  async planModification(id: string,message: string) {
    const plan = await this.findOne(id);

    if (!plan.layout) {
      throw new Error(
        'Generate a layout before editing it',
      );
    }

    return this.aiService.planModification(
      message,
      plan.layout,
    );
  }

  async finalize(id: string) {
    return this.prisma.plan.update({
      where: { id },
      data: {
        status: 'finalized',
      },
    });
  }

  async rename(id: string,name?: string) {
    return this.prisma.plan.update({
      where: { id },
      data: { name },
    });
  }

  delete(id: string) {
    return this.prisma.plan.delete({
      where: { id },
    });
  }

}