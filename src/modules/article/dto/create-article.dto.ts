import { IsNotEmpty, IsString, IsArray, IsOptional } from 'class-validator'

export class CreateArticleDto {
  @IsNotEmpty()
  @IsString()
  readonly title: string

  @IsNotEmpty()
  @IsString()
  readonly description: string

  @IsNotEmpty()
  @IsString()
  readonly body: string

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  readonly tagList?: string[]
}
