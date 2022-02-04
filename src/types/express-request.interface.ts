import { UserType } from '@app/modules/user/types/user.type'
import { Request } from 'express'

export interface ExpressRequestInterface extends Request {
  user?: UserType
}
