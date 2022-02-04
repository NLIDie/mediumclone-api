import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class CreateUserDto {
  @ApiProperty({
    type: 'string',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  readonly username: string

  @ApiProperty({
    type: 'string',
    required: true,
  })
  @IsNotEmpty()
  @IsEmail()
  readonly email: string

  @ApiProperty({
    type: 'string',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  readonly password: string
}
