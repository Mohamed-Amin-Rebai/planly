import {
  IsObject,
  IsString,
} from 'class-validator';

export class UpdateLayoutDto {
  @IsString()
  message!: string;

  @IsObject()
  currentLayout!: any;
}