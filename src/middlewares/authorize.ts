import { Response, NextFunction } from 'express'
import { JwtPayload, verify } from 'jsonwebtoken'

import { User } from '@/models/User'
import { RequestExtended } from '@/types/Request'

export const authorize = async (req: RequestExtended, res: Response, next: NextFunction) => {
  try {
    let token = null
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      token = req.headers.authorization.split(' ')[1]
    } else if (req.query && req.query.token) {
      token = req.query.token
    }
    if (!token) throw new Error('JWT Error')
    if (!process.env.JWT_SECRET) throw new Error('JWT server error')
    const signature = process.env.JWT_SECRET
    const decoded = verify(token as string, signature) as JwtPayload
    const user = await User.findById(decoded.id)
    if (!user) throw new Error('User is not found or have no access')
    req.user = user
    next()
  } catch (exception) {
    console.log({ exception })
    res.status(401).json({ message: 'Authorization Error', type: 'error' })
  }
}
