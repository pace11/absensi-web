import { settingTable } from '@/lib/db/schema'
import { db } from '@/lib/db'
import { eq } from 'drizzle-orm'
import dayjs from 'dayjs'
import { withAuth } from '@/lib/middleware'

async function handler(req, res) {
  if (req.method !== 'POST') {
    res
      .status(405)
      .json({ data: [{ message: 'Method not allowed' }] })
  }

  try {
    const payload = req.body
    payload.clock_in = dayjs(payload.clock_in).format('HH:mm:ss')
    payload.clock_out = dayjs(payload.clock_out).format('HH:mm:ss')

    const settingExist = await db.select().from(settingTable).limit(1)

    if (settingExist.length === 0) {
      const data = await db
        .insert(settingTable)
        .values({ ...payload })
      res.status(200).json({ data })
    } else {
      const data = await db
        .update(settingTable)
        .set({ ...payload })
        .where(eq(settingTable.id, Number(settingExist[0].id)))
      res.status(200).json({ data })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export default withAuth(handler)
