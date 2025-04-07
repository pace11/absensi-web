import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { db } from '@/lib/db'
import { usersTable } from '@/lib/db/schema'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { eq } from 'drizzle-orm'

const MAX_AGE = 60 * 60 * 24

export default NextAuth({
  session: {
    strategy: 'jwt',
    maxAge: MAX_AGE,
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const user = await db
          .select()
          .from(usersTable)
          .where(eq(usersTable.email, credentials.email))
          .limit(1)
          .then((res) => res[0])
        if (!user) {
          throw new Error('User tidak ditemukan')
        }

        const isValidPassword = await bcrypt.compare(
          credentials.password,
          user.password,
        )
        if (!isValidPassword) {
          throw new Error('Email dan Password tidak valid')
        }

        // Generate JWT Token
        const token = jwt.sign(
          {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          process.env.JWT_SECRET,
          { expiresIn: '1d' },
        )

        return { ...user, token }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        // token.name = user.name
        token.role = user.role
        token.email = user.email
        token.token = user.token
        token.expires = Math.floor(Date.now() / 1000) + MAX_AGE
      }

      if (token.expires && Date.now() / 1000 > token.expires) {
        return {}
      }

      return token
    },
    async session({ session, token }) {
      if (!token.id) {
        return null
      }

      session.user.id = token.id
      session.user.role = token.role
      session.user.token = token.token
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
})
