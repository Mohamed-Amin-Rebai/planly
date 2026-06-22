import { IsString, IsObject } from 'class-validator';

export class CreatePlanDto {
  @IsString()
  name: string;

  @IsObject()
  boundary: any;

  @IsObject()
  constraints: any;
}