import { CurrentUser } from '@app/modules/user/decorators/current-user.decorator'
import { AuthGuard } from '@app/modules/user/guards/auth.guard'
import { Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common'
import { ProfileService } from './profile.service'
import { ProfileResponseInterface } from './types/profile-response.interface'

@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get(':username')
  async getProfile(
    @CurrentUser('id') currentUserId: number,
    @Param('username') profileUsername: string
  ): Promise<ProfileResponseInterface> {
    const profile = await this.profileService.getProfile(currentUserId, profileUsername)
    return this.profileService.buildProfileResponse(profile)
  }

  @Post(':username/follow')
  @UseGuards(AuthGuard)
  async followProfile(
    @CurrentUser('id') currentUserId: number,
    @Param('username') profileUsername: string
  ): Promise<ProfileResponseInterface> {
    const profile = await this.profileService.followProfile(currentUserId, profileUsername)
    return this.profileService.buildProfileResponse(profile)
  }

  @Delete(':username/follow')
  @UseGuards(AuthGuard)
  async unfollowProfile(
    @CurrentUser('id') currentUserId: number,
    @Param('username') profileUsername: string
  ): Promise<ProfileResponseInterface> {
    const profile = await this.profileService.unfollowProfile(currentUserId, profileUsername)
    return this.profileService.buildProfileResponse(profile)
  }
}
