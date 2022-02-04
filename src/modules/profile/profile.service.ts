import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UserEntity } from '@app/modules/user/entities/user.entity'
import { ProfileType } from './types/profile.type'
import { ProfileResponseInterface } from './types/profile-response.interface'
import { omit } from 'lodash'

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {}

  async getProfile(currentUserId: number, profileUsername: string): Promise<ProfileType> {
    const user = await this.userRepository.findOne(
      {
        username: profileUsername,
      },
      { relations: ['followers'] }
    )

    if (!user) {
      throw new HttpException('Profile does not exist', HttpStatus.NOT_FOUND)
    }

    const following = user.followers.some(({ id }) => id === currentUserId)

    return { ...user, following }
  }

  async followProfile(currentUserId: number, profileUsername: string): Promise<ProfileType> {
    const [currentUser, user] = await Promise.all([
      this.userRepository.findOne(currentUserId),
      this.userRepository.findOne(
        {
          username: profileUsername,
        },
        { relations: ['followers'] }
      ),
    ])

    if (!user) {
      throw new HttpException('Profile does not exist', HttpStatus.NOT_FOUND)
    }

    if (currentUserId === user.id) {
      throw new HttpException('Follower and Following cant be equal', HttpStatus.BAD_REQUEST)
    }

    user.followers.push(currentUser)
    const updatedUser = await this.userRepository.save(user)

    return { ...updatedUser, following: true }
  }

  async unfollowProfile(currentUserId: number, profileUsername: string): Promise<ProfileType> {
    const user = await this.userRepository.findOne(
      {
        username: profileUsername,
      },
      { relations: ['followers'] }
    )

    if (!user) {
      throw new HttpException('Profile does not exist', HttpStatus.NOT_FOUND)
    }

    if (currentUserId === user.id) {
      throw new HttpException('Follower and Following cant be equal', HttpStatus.BAD_REQUEST)
    }

    user.followers = user.followers.filter(({ id }) => currentUserId !== id)
    const updatedUser = await this.userRepository.save(user)

    return { ...updatedUser, following: false }
  }

  buildProfileResponse(profile: ProfileType): ProfileResponseInterface {
    const profileResponse = omit(profile, ['email', 'articles', 'favorites', 'followers'])
    return { profile: profileResponse }
  }
}
