import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

const tokenSecret: string = process.env.TOKEN_SECRET!

export const verifyAuthToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authorizationHeader = req.headers.authorization!
    const token = authorizationHeader.split(' ')[1]
    jwt.verify(token, tokenSecret)

    next()
  } catch (error) {
    res.status(401)
  }
}
