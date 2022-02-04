import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TagModule } from './modules/tag/tag.module'
import { UserModule } from './modules/user/user.module'
import ormConfig from './orm.config'
import { AuthMiddleware } from './modules/user/middleware/auth.middleware'
import { ArticleModule } from './modules/article/article.module'
import { ProfileModule } from './modules/profile/profile.module'

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...ormConfig,
      autoLoadEntities: true,
    }),
    TagModule,
    UserModule,
    ArticleModule,
    ProfileModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    })
  }
}
