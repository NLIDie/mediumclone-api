import { Module } from '@nestjs/common'
import { ArticleService } from './article.service'
import { ArticleController } from './article.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ArticleEntity } from './entities/article.entity'
import { UserModule } from '../user/user.module'
import { UserEntity } from '../user/entities/user.entity'

@Module({
  imports: [TypeOrmModule.forFeature([ArticleEntity, UserEntity]), UserModule],
  providers: [ArticleService],
  controllers: [ArticleController],
})
export class ArticleModule {}
