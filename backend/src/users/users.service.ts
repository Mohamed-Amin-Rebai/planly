import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findByClerkId(clerkId: string) {
    return this.prisma.user.findUnique({
      where: {
        clerkId,
      },
    });
  }

  async upsertUser(user: {
    clerkId: string;
    email: string;
    name?: string;
  }) {
    return this.prisma.user.upsert({
      where: {
        clerkId: user.clerkId,
      },
      update: {
        email: user.email,
        name: user.name,
      },
      create: {
        clerkId: user.clerkId,
        email: user.email,
        name: user.name,
      },
    });
  }

  async updateRole(
    clerkId: string,
    role: string,
  ) {
    return this.prisma.user.update({
      where: {
        clerkId,
      },
      data: {
        role,
      },
    });
  }

  async updatePreferences(
    clerkId: string,
    preferences: Record<string, any>,
  ) {
    return this.prisma.user.update({
      where: {
        clerkId,
      },
      data: {
        preferences,
      },
    });
  }

}