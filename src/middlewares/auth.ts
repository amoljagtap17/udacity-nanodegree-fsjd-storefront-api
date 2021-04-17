import { Request, Response, NextFunction } from 'express'
import { getDecodedToken } from '../utils/utils'

const tokenSecret: string = process.env.TOKEN_SECRET!

export const verifyAuthToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const decodedToken = getDecodedToken(req.headers.authorization!)

    if (
      req.method === 'PUT' &&
      req.url.includes('/users') &&
      decodedToken.user.id !== parseInt(req.params.id)
    ) {
      res.status(401)
      res.json('User id does not match!')
      return
    }

    next()
  } catch (error) {
    res.status(401)
    res.json('Access denied, invalid token')
    return
  }
}
