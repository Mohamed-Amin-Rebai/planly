import {
  IsObject,
  IsString,
} from 'class-validator';

export class PlanEditDto {
  @IsString()
  message!: string;

  @IsObject()
  currentLayout!: any;
}