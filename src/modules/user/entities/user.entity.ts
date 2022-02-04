import {
  BeforeInsert,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { hash } from 'bcryptjs'
import { ApiProperty } from '@nestjs/swagger'
import { ArticleEntity } from '@app/modules/article/entities/article.entity'

@Entity({ name: 'users' })
export class UserEntity {
  @ApiProperty({ example: 1, description: 'Уникальный индентификатор пользователя' })
  @PrimaryGeneratedColumn()
  id: number

  @ApiProperty({ example: 'Kirill', description: 'Имя пользователя' })
  @Column()
  username: string

  @ApiProperty({ example: 'kk@gmail.com', description: 'Email пользователя' })
  @Column()
  email: string

  @ApiProperty({
    example: 'My name is Kirill',
    description: 'Описание пользователя',
    required: false,
  })
  @Column({ default: '' })
  bio: string

  @ApiProperty({
    example: 'http://path.jpg',
    description: 'Ссылка на картинку пользователя',
    required: false,
  })
  @Column({ default: '' })
  image: string

  @Column({ select: false })
  password: string

  @BeforeInsert()
  async hashPassword() {
    this.password = await hash(this.password, 10)
  }

  @OneToMany(() => ArticleEntity, (article) => article.author)
  articles: ArticleEntity[]

  @ManyToMany(() => ArticleEntity)
  @JoinTable()
  favorites: ArticleEntity[]

  @ManyToMany(() => UserEntity)
  @JoinTable()
  followers: UserEntity[]
}
