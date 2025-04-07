import { attendancesTable, usersTable } from '@/lib/db/schema'
import { sql, j } from 'drizzle-orm'
import { db } from '@/lib/db'
import { withAuth } from '@/lib/middleware'

async function handler(req, res, session) {
  if (req.method !== 'GET') {
    res
      .status(405)
      .json({ data: [{ message: 'Method not allowed' }] })
  }

  try {
    const data = await db
      .execute(
        sql`SELECT
        GROUP_CONCAT(${attendancesTable.created_at_local} SEPARATOR ',') as date_range,
        GROUP_CONCAT(${attendancesTable.id} SEPARATOR ',') as ids,
        ANY_VALUE(COUNT(*)) as duration,
        ANY_VALUE(${usersTable.id}) as user_id,
        ANY_VALUE(${usersTable.name}) as user_name,
        ANY_VALUE(${usersTable.email}) as user_email,
        ANY_VALUE(${attendancesTable.status}) as status,
        ANY_VALUE(${attendancesTable.description}) as description,
        ANY_VALUE(${attendancesTable.is_accepted}) as is_accepted,
        ANY_VALUE(${attendancesTable.created_at}) as created_at,
        ANY_VALUE(${attendancesTable.updated_at}) as updated_at
      FROM ${attendancesTable}
      JOIN ${usersTable} ON ${usersTable.id}=${attendancesTable.user_id}
      WHERE ${attendancesTable.user_id}=${session.id} AND ${attendancesTable.status}='leave'
      GROUP BY ${attendancesTable.created_at}
      ORDER BY ${attendancesTable.created_at} DESC`,
      )
      .then((res) => res[0])

    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({ error })
  }
}

export default withAuth(handler)
