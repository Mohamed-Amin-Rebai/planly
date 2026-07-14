import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { SyncUserDto } from './dto/sync-user.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { UpdateUserPreferencesDto } from './dto/update-user-preferences.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('sync')
  syncUser(@Body() dto: SyncUserDto) {
    return this.usersService.upsertUser(dto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':clerkId')
  findOne(@Param('clerkId') clerkId: string) {
    return this.usersService.findByClerkId(
      clerkId,
    );
  }

  @Patch(':clerkId/role')
  updateRole(@Param('clerkId') clerkId: string,@Body() dto: UpdateUserRoleDto) {
    return this.usersService.updateRole(
      clerkId,
      dto.role,
    );
  }

  @Patch(':clerkId/preferences')
  updatePreferences(@Param('clerkId') clerkId: string,@Body() dto: UpdateUserPreferencesDto) {
    return this.usersService.updatePreferences(
      clerkId,
      dto.preferences,
    );
  }


}