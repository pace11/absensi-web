import { settingTable } from '@/lib/db/schema'
import { db } from '@/lib/db'
import { withAuth } from '@/lib/middleware'

async function handler(req, res) {
  try {
    const data = await db.select().from(settingTable).limit(1)

    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export default withAuth(handler)
