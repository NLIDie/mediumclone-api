import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { CurrentUser } from '../user/decorators/current-user.decorator'
import { UserEntity } from '../user/entities/user.entity'
import { AuthGuard } from '../user/guards/auth.guard'
import { ArticleService } from './article.service'
import { CreateArticleDto } from './dto/create-article.dto'
import { UpdateArticleDto } from './dto/update-article.dto'
import { ArticleEntity } from './entities/article.entity'
import { ArticleResponseInterface } from './types/article-response.interface'
import { ArticlesResponseInterface } from './types/articles-response.interface'
import { FindAllQueryInterface } from './types/find-all.interface'

@ApiTags('articles')
@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get()
  async findAll(
    @Query() query: FindAllQueryInterface,
    @CurrentUser('id') currentUserId: ArticleEntity['id']
  ): Promise<ArticlesResponseInterface> {
    const articlesResponse = this.articleService.findAll(query, currentUserId)
    return articlesResponse
  }

  @Get('feed')
  @UseGuards(AuthGuard)
  async findFeeds(
    @Query() query: Pick<FindAllQueryInterface, 'limit' | 'offset'>,
    @CurrentUser('id') currentUserId: UserEntity['id']
  ) {
    return await this.articleService.findFeeds(query, currentUserId)
  }

  @Get(':slug')
  async findOne(@Param('slug') slug: ArticleEntity['slug']): Promise<ArticleResponseInterface> {
    const article = await this.articleService.findOne(slug)
    return this.articleService.buildArticleResponse(article)
  }

  @Delete(':slug')
  @UseGuards(AuthGuard)
  async remove(
    @Param('slug') slug: ArticleEntity['slug'],
    @CurrentUser('id') currentUserId: UserEntity['id']
  ): Promise<any> {
    return this.articleService.remove(slug, currentUserId)
  }

  @Post()
  @UseGuards(AuthGuard)
  async create(
    @Body('article') createArticleDto: CreateArticleDto,
    @CurrentUser() currentUser: UserEntity
  ): Promise<ArticleResponseInterface> {
    const article = await this.articleService.create(createArticleDto, currentUser)
    return this.articleService.buildArticleResponse(article)
  }

  @Put(':slug')
  @UseGuards(AuthGuard)
  async update(
    @Param('slug') slug: ArticleEntity['slug'],
    @Body('article') updateArticleDto: UpdateArticleDto,
    @CurrentUser('id') currentUserId: UserEntity['id']
  ) {
    const article = await this.articleService.update(slug, updateArticleDto, currentUserId)
    return this.articleService.buildArticleResponse(article)
  }

  @Post(':slug/favorites')
  @UseGuards(AuthGuard)
  async addArticleToFavorites(
    @Param('slug') slug: ArticleEntity['slug'],
    @CurrentUser('id') currentUserId: UserEntity['id']
  ): Promise<ArticleResponseInterface> {
    const article = await this.articleService.addArticleToFavorites(slug, currentUserId)
    return this.articleService.buildArticleResponse(article)
  }

  @Delete(':slug/favorites')
  @UseGuards(AuthGuard)
  async removeArticleToFavorites(
    @Param('slug') slug: ArticleEntity['slug'],
    @CurrentUser('id') currentUserId: UserEntity['id']
  ): Promise<ArticleResponseInterface> {
    const article = await this.articleService.removeArticleToFavorites(slug, currentUserId)
    return this.articleService.buildArticleResponse(article)
  }
}
