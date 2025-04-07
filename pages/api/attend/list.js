import { attendancesTable } from '@/lib/db/schema'
import { sql } from 'drizzle-orm'
import { db } from '@/lib/db'
import dayjs from 'dayjs'
import { withAuth } from '@/lib/middleware'

async function handler(req, res, session) {
  if (req.method !== 'GET') {
    res
      .status(405)
      .json({ data: [{ message: 'Method not allowed' }] })
  }

  try {
    const currentYear = dayjs(req.query.date).format('YYYY')
    const currentMonth = dayjs(req.query.date).format('M')

    const data = await db
      .execute(
        sql`SELECT * FROM ${attendancesTable} WHERE 
        YEAR(${attendancesTable.created_at_local})=${currentYear} 
        AND MONTH(${attendancesTable.created_at_local})=${currentMonth} 
        AND ${attendancesTable.user_id}=${session.id}
        AND ${attendancesTable.is_accepted}=1`,
      )
      .then((res) => res[0])
    const response = data?.map((item) => ({
      ...item,
      created_at_local: dayjs(item.created_at_local).format(
        'YYYY-MM-DD',
      ),
    }))

    res.status(200).json(response)
  } catch (error) {
    res.status(500).json({ error })
  }
}

export default withAuth(handler)
