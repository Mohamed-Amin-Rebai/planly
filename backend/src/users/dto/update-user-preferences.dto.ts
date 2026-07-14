import { IsObject } from 'class-validator';

export class UpdateUserPreferencesDto {
  @IsObject()
  preferences!: Record<string, any>;
}