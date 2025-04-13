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
    const { user_id } = req.query
    const currentYear = dayjs(req.query.date).format('YYYY')
    const currentMonth = dayjs(req.query.date).format('M')
    const userId = user_id ? Number(user_id) : session.id

    const data = await db
      .execute(
        sql`SELECT * FROM ${attendancesTable} WHERE 
        YEAR(${attendancesTable.created_at_local})=${currentYear} 
        AND MONTH(${attendancesTable.created_at_local})=${currentMonth} 
        AND ${attendancesTable.user_id}=${userId}
        AND ${attendancesTable.is_accepted}=1`,
      )
      .then((res) => res[0])

    const count = await db
      .execute(
        sql`
        SELECT s.status, COUNT(t.status) AS total
          FROM (
            SELECT 'checked_in' AS status
            UNION ALL
            SELECT 'present'
            UNION ALL
            SELECT 'absent'
            UNION ALL
            SELECT 'leave'
          ) AS s
        LEFT JOIN ${attendancesTable} t ON t.status = s.status AND t.user_id = ${userId} AND YEAR(t.created_at_local)=${currentYear}
        GROUP BY s.status`,
      )
      .then((res) =>
        res[0].reduce((acc, count) => {
          return { ...acc, [count.status]: count.total }
        }, {}),
      )

    const response = data?.map((item) => ({
      ...item,
      created_at_local: dayjs(item.created_at_local).format(
        'YYYY-MM-DD',
      ),
    }))

    res.status(200).json({ count, attendances: response })
  } catch (error) {
    res.status(500).json({ error })
  }
}

export default withAuth(handler)
