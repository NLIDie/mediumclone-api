import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { CurrentUser } from './decorators/current-user.decorator'
import { CreateUserDto } from './dto/create-user.dto'
import { LoginUserDto } from './dto/login-user.dto'
import { AuthGuard } from './guards/auth.guard'
import { UpdateUserDto } from './types/update-user.dto'
import { UserResponseInterface } from './types/user-response.interface'
import { UserType } from './types/user.type'
import { UserService } from './user.service'

@ApiBearerAuth()
@ApiTags('users')
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('users')
  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({
    status: 201,
    description: 'Create user',
  })
  async createUser(@Body('user') createUserDto: CreateUserDto): Promise<UserResponseInterface> {
    const user: UserType = await this.userService.createUser(createUserDto)
    return this.userService.buildUserResponse(user)
  }

  @Post('users/login')
  @ApiOperation({ summary: '' })
  @ApiResponse({
    status: 200,
    description: '',
  })
  async login(@Body('user') loginUserDto: LoginUserDto): Promise<UserResponseInterface> {
    const user: UserType = await this.userService.login(loginUserDto)
    return this.userService.buildUserResponse(user)
  }

  @Get('user')
  @UseGuards(AuthGuard)
  async findCurrentUser(@CurrentUser() currentUser: UserType): Promise<UserResponseInterface> {
    return this.userService.buildUserResponse(currentUser)
  }

  @Put('user')
  @UseGuards(AuthGuard)
  async updateCurrentUser(
    @Body('user') updateUserDto: UpdateUserDto,
    @CurrentUser('id') currentUserId: UserType['id']
  ): Promise<UserResponseInterface> {
    const updatedUser = await this.userService.updateUser(currentUserId, updateUserDto)
    return this.userService.buildUserResponse(updatedUser)
  }
}
