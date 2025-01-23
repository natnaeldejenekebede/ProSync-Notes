import { Controller, Get, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticatedRequest } from '../types/authenticated-request';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async getMyProfile(@Request() req: AuthenticatedRequest) {
    return this.profileService.getUserProfileById(req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('userId/:id')
  async getProfileById(@Param('id') id: string) {
    return this.profileService.getUserProfileById(+id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('search')
  async searchProfile(@Query('username') username: string) {
    if (!username) return [];
    return this.profileService.getUserProfileByUsername(username);
  }
}
