import { attendancesTable } from '@/lib/db/schema'
import { sql } from 'drizzle-orm'
import { db } from '@/lib/db'
import dayjs from 'dayjs'
import { withAuth } from '@/lib/middleware'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

async function handler(req, res, session) {
  if (req.method !== 'GET') {
    res
      .status(405)
      .json({ data: [{ message: 'Method not allowed' }] })
  }

  try {
    const today = dayjs()
      .tz(process.env.LOCAL_TIMEZONE)
      .format('YYYY-MM-DD')

    const data = await db
      .execute(
        sql`SELECT * FROM ${attendancesTable} WHERE DATE(${attendancesTable.created_at_local})=${today} AND ${attendancesTable.user_id}=${session.id} LIMIT 1`,
      )
      .then((res) => res[0])

    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({ error })
  }
}

export default withAuth(handler)
