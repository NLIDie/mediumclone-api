import { ExpressRequestInterface } from '@app/types/express-request.interface'
import { Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction, Response } from 'express'
import * as jwt from 'jsonwebtoken'
import { last } from 'lodash'
import { UserService } from '../user.service'

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  async use(req: ExpressRequestInterface, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      req.user = null
      return next()
    }

    const token = last(req.headers.authorization.split(' '))

    try {
      const decode = jwt.verify(token, 'super-secret-password')
      const user = await this.userService.findOneById(decode.id)
      req.user = user
    } catch (error) {
      req.user = null
    }

    next()
  }
}
