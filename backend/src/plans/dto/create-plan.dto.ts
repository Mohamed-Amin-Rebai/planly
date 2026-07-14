import { IsString, IsObject } from 'class-validator';

export class CreatePlanDto {
  @IsString()
  clerkId!: string;

  @IsString()
  name!: string;

  @IsObject()
  boundary!: any;

  @IsObject()
  constraints!: {
    roomSetup: Record<string, number>;
    desiredBuiltArea: number,
    userPrompt?: string;
  };
}