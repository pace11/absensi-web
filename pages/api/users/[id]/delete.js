import { usersTable } from '@/lib/db/schema'
import { db } from '@/lib/db'
import { eq, sql } from 'drizzle-orm'
import { withAuth } from '@/lib/middleware'

async function handler(req, res) {
  if (req.method !== 'DELETE') {
    res
      .status(405)
      .json({ data: [{ message: 'Method not allowed' }] })
  }

  try {
    const data = await db
      .update(usersTable)
      .set({ deleted_at: sql`NOW()` })
      .where(eq(usersTable.id, Number(req.query.id)))

    res.status(200).json({ data })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export default withAuth(handler)
