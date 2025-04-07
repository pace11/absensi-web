import { usersTable } from '@/lib/db/schema'
import { sql, eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { withAuth } from '@/lib/middleware'

async function handler(req, res) {
  if (req.method !== 'GET') {
    res
      .status(405)
      .json({ data: [{ message: 'Method not allowed' }] })
  }

  try {
    const user = await db
      .select({ count: sql`COUNT(*)` })
      .from(usersTable)
      .where(eq(usersTable.role, 'employee'))
    res.status(200).json({ userCount: user[0].count })
  } catch (error) {
    res.status(500).json({ error })
  }
}

export default withAuth(handler)
