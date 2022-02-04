import { UserEntity } from '@app/modules/user/entities/user.entity'

export interface FindAllQueryInterface {
  tag: string
  author: UserEntity['username']
  favorited: UserEntity['username']
  limit: number
  offset: number
}
