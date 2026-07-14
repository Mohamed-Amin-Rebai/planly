import {
  IsObject,
  IsArray,
  IsOptional,
  IsString,
  IsNumber,
} from 'class-validator';

export class GenerateLayoutDto {
  @IsArray()
  boundary!: any;

  @IsObject()
  roomSetup!: Record<string, number>;

  @IsNumber()
  desiredBuiltArea!: number;

  @IsOptional()
  @IsString()
  userPrompt?: string;
}