import { Injectable, UnprocessableEntityException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as jwt from 'jsonwebtoken'
import * as bcrypt from 'bcryptjs'
import { isEmpty, omit } from 'lodash'
import { CreateUserDto } from './dto/create-user.dto'
import { UserEntity } from './entities/user.entity'
import { UserResponseInterface } from './types/user-response.interface'
import { LoginUserDto } from './dto/login-user.dto'
import { UserType } from './types/user.type'
import { UpdateUserDto } from './types/update-user.dto'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserType> {
    const errorResponse = {
      errors: {},
    }

    const [userByEmail, userByUsername] = await Promise.all([
      this.userRepository.findOne({ email: createUserDto.email }),
      this.userRepository.findOne({ username: createUserDto.username }),
    ])

    if (userByEmail) {
      errorResponse['email'] = 'has already been taken'
    }

    if (userByUsername) {
      errorResponse['username'] = 'has already been taken'
    }

    const isUserExists = userByEmail || userByUsername
    if (isUserExists) {
      throw new UnprocessableEntityException(errorResponse)
    }

    const user: UserEntity = Object.assign(new UserEntity(), createUserDto)
    return this.userRepository.save(user)
  }

  async login(loginUserDto: LoginUserDto): Promise<UserType> {
    const findedUser = await this.userRepository.findOne(
      { email: loginUserDto.email },
      { select: ['id', 'username', 'password', 'email', 'bio', 'image'] }
    )
    if (isEmpty(findedUser)) {
      throw new UnprocessableEntityException({
        errors: {
          'email or password': 'Credentials are not valid',
        },
      })
    }

    const isCorrectPassword = await bcrypt.compare(loginUserDto.password, findedUser.password)
    if (!isCorrectPassword) {
      throw new UnprocessableEntityException({
        errors: {
          password: 'Password are not correct',
        },
      })
    }

    const clearedUser = omit(findedUser, ['password'])
    return clearedUser
  }

  /** TODO: Нужна валидация email и username по примеру как в методе createUser  */
  async updateUser(id: UserEntity['id'], updateUserDto: UpdateUserDto): Promise<UserType> {
    await this.userRepository.update({ id }, updateUserDto)

    const updatedUser = await this.findOneById(id)

    return updatedUser
  }

  findOneById(id: number): Promise<UserEntity> {
    return this.userRepository.findOne({ id })
  }

  buildUserResponse(user: UserType): UserResponseInterface {
    const token: string = this.generateJwt(user)

    return {
      user: {
        ...user,
        token,
      },
    }
  }

  private generateJwt(user: UserType): string {
    const token: string = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      'super-secret-password'
    )

    return token
  }
}
