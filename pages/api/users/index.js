import { usersTable } from '@/lib/db/schema'
import { db } from '@/lib/db'
import { ne, isNull, and } from 'drizzle-orm'
import { withAuth } from '@/lib/middleware'

async function handler(req, res) {
  try {
    const data = await db
      .select({
        id: usersTable.id,
        name: usersTable.name,
        email: usersTable.email,
      })
      .from(usersTable)
      .where(
        and(
          ne(usersTable.role, 'admin'),
          isNull(usersTable.deleted_at),
        ),
      )

    res.status(200).json({ data })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export default withAuth(handler)
