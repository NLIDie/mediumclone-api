import { ExpressRequestInterface } from '@app/types/express-request.interface'
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<ExpressRequestInterface>()

    if (request.user) {
      return true
    }

    throw new UnauthorizedException()
  }
}
