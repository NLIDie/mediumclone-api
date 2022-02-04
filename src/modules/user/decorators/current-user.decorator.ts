import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { isEmpty } from 'lodash'
import { UserType } from '../types/user.type'

export const CurrentUser = createParamDecorator((data: keyof UserType, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest()

  if (isEmpty(request.user)) {
    return null
  }

  if (typeof data === 'string') {
    return request.user[data]
  }

  return request.user
})
