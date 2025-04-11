import { attendancesTable } from '@/lib/db/schema'
import { sql } from 'drizzle-orm'
import { db } from '@/lib/db'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

export default async function handler(req, res) {
  try {
    const currentDate = dayjs()
      .tz(process.env.LOCAL_TIMEZONE)
      .format('YYYY-MM-DD HH:mm:ss')
    const endOfDay = dayjs()
      .tz(process.env.LOCAL_TIMEZONE)
      .format('YYYY-MM-DD')

    const data = await db
      .execute(
        sql`
        INSERT INTO attendances (user_id, status, is_accepted, created_at_local)
          SELECT u.id, 'absent', true, ${currentDate}
          FROM users u
          WHERE u.role = 'employee'
          AND u.id NOT IN (
            SELECT user_id
            FROM attendances
            WHERE DATE(created_at_local) = ${endOfDay}
          );
        `,
      )
      .then((res) => res[0])

    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({ error })
  }
}
