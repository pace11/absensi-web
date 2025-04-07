import { usersTable } from '@/lib/db/schema'
import { db } from '@/lib/db'
import { hashPassword } from '@/helpers/utils'
import { withAuth } from '@/lib/middleware'

async function handler(req, res) {
  if (req.method !== 'POST') {
    res
      .status(405)
      .json({ data: [{ message: 'Method not allowed' }] })
  }

  try {
    const payload = req.body
    payload.password = await hashPassword(payload.password)

    const data = await db.insert(usersTable).values({ ...payload })

    res.status(200).json({ data })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export default withAuth(handler)
