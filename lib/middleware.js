import { getToken } from 'next-auth/jwt'

export const withAuth = (handler) => {
  return async (req, res) => {
    const session = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    })

    if (!session) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    return handler(req, res, session)
  }
}
