import { attendancesTable } from '@/lib/db/schema'
import { eq, and, inArray } from 'drizzle-orm'
import { db } from '@/lib/db'
import { withAuth } from '@/lib/middleware'

async function handler(req, res, session) {
  if (req.method !== 'DELETE') {
    res
      .status(405)
      .json({ data: [{ message: 'Method not allowed' }] })
  }

  try {
    const ids = req.query.ids?.split(',').map(Number)

    const data = await db
      .delete(attendancesTable)
      .where(
        and(
          inArray(attendancesTable.id, ids),
          eq(attendancesTable.user_id, session.id),
        ),
      )

    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({ error })
  }
}

export default withAuth(handler)
