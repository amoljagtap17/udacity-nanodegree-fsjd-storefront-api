import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { User } from '../models/user'

const tokenSecret: string = process.env.TOKEN_SECRET!

export const verifyAuthToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authorizationHeader = req.headers.authorization!
    const token = authorizationHeader.split(' ')[1]
    const decoded = jwt.verify(token, tokenSecret)

    // @ts-ignore
    if (req.method === 'PUT' && decoded.user.id !== parseInt(req.params.id)) {
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
