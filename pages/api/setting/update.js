import { settingTable } from '@/lib/db/schema'
import { db } from '@/lib/db'
import { eq } from 'drizzle-orm'
import dayjs from 'dayjs'
import { withAuth } from '@/lib/middleware'

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res
      .status(405)
      .json({ data: [{ message: 'Method not allowed' }] })
  }

  try {
    const { clock_in, clock_out, ...rest } = req.body

    const formattedData = {
      ...rest,
      clock_in: dayjs(clock_in).format('HH:mm:ss'),
      clock_out: dayjs(clock_out).format('HH:mm:ss'),
    }

    const existingSetting = await db
      .select()
      .from(settingTable)
      .limit(1)

    if (existingSetting.length === 0) {
      const newSetting = await db
        .insert(settingTable)
        .values(formattedData)
      return res.status(200).json(newSetting)
    }

    const updatedSetting = await db
      .update(settingTable)
      .set(formattedData)
      .where(eq(settingTable.id, Number(existingSetting[0].id)))

    return res.status(200).json(updatedSetting)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

export default withAuth(handler)
