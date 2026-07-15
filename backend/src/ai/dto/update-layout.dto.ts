import {
  IsObject,
  IsString,
  IsArray
} from 'class-validator';

export class UpdateLayoutDto {
  @IsString()
  message!: string;

  @IsObject()
  currentLayout!: any;

  @IsArray()
  boundary!: any;
}