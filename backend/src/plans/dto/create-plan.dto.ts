import { IsString, IsObject, IsArray } from 'class-validator';

export class CreatePlanDto {
  @IsString()
  clerkId!: string;

  @IsString()
  name!: string;

  @IsArray()
  boundary!: number[][];

  @IsObject()
  constraints!: {
    roomSetup: Record<string, number>;
    desiredBuiltArea: number,
    userPrompt?: string;
  };
}