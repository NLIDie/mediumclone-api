import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { isEmpty } from 'lodash'

import { DeleteResult, getRepository, Repository } from 'typeorm'
import { UserEntity } from '../user/entities/user.entity'
import { CreateArticleDto } from './dto/create-article.dto'
import { UpdateArticleDto } from './dto/update-article.dto'
import { ArticleEntity } from './entities/article.entity'
import { ArticleResponseInterface } from './types/article-response.interface'
import { ArticlesResponseInterface } from './types/articles-response.interface'
import { FindAllQueryInterface } from './types/find-all.interface'

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity) private readonly articleRepository: Repository<ArticleEntity>,
    @InjectRepository(UserEntity) private readonly userRespository: Repository<UserEntity>
  ) {}

  async findAll(
    query: FindAllQueryInterface,
    userId: UserEntity['id']
  ): Promise<ArticlesResponseInterface> {
    const queryBuilder = getRepository(ArticleEntity)
      .createQueryBuilder('articles')
      .leftJoinAndSelect('articles.author', 'author')
      .orderBy('articles.createdAt', 'DESC')

    const articlesCount = await queryBuilder.getCount()

    if (query.author) {
      const author = await this.userRespository.findOne({ username: query.author })
      queryBuilder.andWhere('articles.authorId = :id', { id: author.id })
    }

    if (query.limit) {
      queryBuilder.limit(query.limit)
    }

    if (query.offset) {
      queryBuilder.offset(query.offset)
    }

    if (query.tag) {
      queryBuilder.andWhere('articles.tagList LIKE :tag', { tag: `%${query.tag}%` })
    }

    if (query.favorited) {
      const author = await this.userRespository.findOne(
        { username: query.favorited },
        { relations: ['favorites'] }
      )

      const articleIds = author.favorites.map(({ id }) => id)
      queryBuilder.andWhere('articles.id IN (:...ids)', {
        ids: isEmpty(articleIds) ? [-1] : articleIds,
      })
    }

    const articles = await queryBuilder.getMany()

    if (userId) {
      const user = await this.userRespository.findOne(userId, { relations: ['favorites'] })

      const favoriteIds = user.favorites.map(({ id }) => id)
      const articlesWithFavorites = articles.map((article) => {
        const favorited = favoriteIds.includes(article.id)
        return { ...article, favorited }
      })

      return {
        articles: articlesWithFavorites,
        articlesCount,
      }
    }

    return {
      articles: articles.map((article) => {
        return { ...article, favorited: false }
      }),
      articlesCount,
    }
  }

  async findOne(slug: ArticleEntity['slug']): Promise<ArticleEntity> {
    return this.articleRepository.findOne({ slug })
  }

  async create(
    createArticleDto: CreateArticleDto,
    currentUser: UserEntity
  ): Promise<ArticleEntity> {
    const article = this.articleRepository.create({
      ...createArticleDto,
      tagList: createArticleDto.tagList ?? [],
      author: currentUser,
    })

    return this.articleRepository.save(article)
  }

  async remove(slug: ArticleEntity['slug'], userId: UserEntity['id']): Promise<DeleteResult> {
    const article = await this.findOne(slug)

    if (isEmpty(article)) {
      throw new NotFoundException('Article does not exist')
    }

    const hasRightToRemove = article.author.id === userId
    if (!hasRightToRemove) {
      throw new ForbiddenException('You are not an author')
    }

    return this.articleRepository.delete({ slug })
  }

  async update(
    slug: ArticleEntity['slug'],
    updateArticleDto: UpdateArticleDto,
    userId: UserEntity['id']
  ): Promise<ArticleEntity> {
    const article = await this.findOne(slug)

    if (isEmpty(article)) {
      throw new NotFoundException('Article does not exist')
    }

    const hasRightToRemove = article.author.id === userId
    if (!hasRightToRemove) {
      throw new ForbiddenException('You are not an author')
    }

    const updatedArticle = await this.articleRepository.save({
      ...article,
      ...updateArticleDto,
      updatedAt: new Date(),
    })

    return updatedArticle
  }

  async addArticleToFavorites(
    slug: ArticleEntity['slug'],
    userId: UserEntity['id']
  ): Promise<ArticleEntity> {
    const promiseFindArticle = this.findOne(slug)
    const promiseFindUser = this.userRespository.findOne(userId, {
      relations: ['favorites'],
    })
    const [article, user] = await Promise.all([promiseFindArticle, promiseFindUser])

    const isFavorite = user.favorites.some(({ id }) => article.id === id)
    if (isFavorite) {
      return article
    }

    user.favorites.push(article)
    article.favoritesCount += 1

    const [updatedArticle] = await Promise.all([
      this.articleRepository.save(article),
      this.userRespository.save(user),
    ])

    return updatedArticle
  }

  async removeArticleToFavorites(
    slug: ArticleEntity['slug'],
    userId: UserEntity['id']
  ): Promise<ArticleEntity> {
    const promiseFindArticle = this.findOne(slug)
    const promiseFindUser = this.userRespository.findOne(userId, {
      relations: ['favorites'],
    })
    const [article, user] = await Promise.all([promiseFindArticle, promiseFindUser])

    const isFavorite = user.favorites.some(({ id }) => article.id === id)
    if (!isFavorite) {
      return article
    }

    user.favorites = user.favorites.filter(({ id }) => article.id !== id)
    article.favoritesCount = article.favoritesCount < 0 ? article.favoritesCount - 1 : 0

    const [updatedArticle] = await Promise.all([
      this.articleRepository.save(article),
      this.userRespository.save(user),
    ])

    return updatedArticle
  }

  async findFeeds(
    query: Pick<FindAllQueryInterface, 'offset' | 'limit'>,
    currentUserId: UserEntity['id']
  ): Promise<ArticlesResponseInterface> {
    const currentUser = await this.userRespository.findOne(currentUserId, {
      relations: ['followers'],
    })

    const followerIds = currentUser.followers.map(({ id }) => id)

    const queryBuilder = getRepository(ArticleEntity)
      .createQueryBuilder('articles')
      .leftJoinAndSelect('articles.author', 'author')
      .where('articles.authorId IN (:...ids)', {
        ids: isEmpty(followerIds) ? [-1] : followerIds,
      })
      .orderBy('articles.createdAt', 'DESC')

    const articlesCount = await queryBuilder.getCount()

    if (query.limit) {
      queryBuilder.limit(query.limit)
    }

    if (query.offset) {
      queryBuilder.offset(query.offset)
    }

    const articles = await queryBuilder.getMany()

    return {
      articles,
      articlesCount,
    }
  }

  buildArticleResponse(article: ArticleEntity): ArticleResponseInterface {
    return {
      article,
    }
  }
}
