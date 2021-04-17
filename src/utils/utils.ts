import jwt from 'jsonwebtoken'

const tokenSecret: string = process.env.TOKEN_SECRET!

type Token = {
  user: { id: number; firstname: string; lastname: string; username: string }
}

export const getDecodedToken = (authorizationHeader: string): Token => {
  const token = authorizationHeader.split(' ')[1]
  const decodedToken = (jwt.verify(token, tokenSecret) as unknown) as Token

  return decodedToken
}
