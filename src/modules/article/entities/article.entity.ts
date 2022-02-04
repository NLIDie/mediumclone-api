import { BeforeInsert, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import slugify from 'slugify'
import { UserEntity } from '@app/modules/user/entities/user.entity'
import { nanoid } from 'nanoid'

@Entity({ name: 'articles' })
export class ArticleEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  slug: string

  @Column()
  title: string

  @Column({ default: '' })
  description: string

  @Column({ default: '' })
  body: string

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date

  @Column({ type: 'simple-array' })
  tagList: string[]

  @Column({ default: 0 })
  favoritesCount: number

  @ManyToOne(() => UserEntity, (user) => user.articles, { eager: true })
  author: UserEntity

  @BeforeInsert()
  generateSlug() {
    const slugedTitle = slugify(this.title, {
      replacement: '-',
      lower: true,
      remove: /[*+~.()'"!:@]/g,
    })
    const uniqId = nanoid(8)

    this.slug = `${slugedTitle}-${uniqId}`
  }
}
