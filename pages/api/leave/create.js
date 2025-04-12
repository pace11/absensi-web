import { attendancesTable } from '@/lib/db/schema'
import { db } from '@/lib/db'
import { getDateRange } from '@/helpers/utils'
import { withAuth } from '@/lib/middleware'
import dayjs from 'dayjs'
import { sql } from 'drizzle-orm'

async function handler(req, res, session) {
  if (req.method !== 'POST') {
    res
      .status(405)
      .json({ data: [{ message: 'Method not allowed' }] })
  }

  try {
    const payload = req.body
    const range = getDateRange(payload.date[0], payload.date[1])
    const dateFirst = dayjs(range[0]).format('YYYY-MM-DD')

    const isAttended = await db
      .select()
      .from(attendancesTable)
      .where(
        sql`DATE(${attendancesTable.created_at_local}) = ${dateFirst} AND ${attendancesTable.user_id} = ${session.id}`,
      )
      .limit(1)
      .then((res) => res[0])

    if (!isAttended?.check_in) {
      const insertValues = range.map((date) => ({
        user_id: session.id,
        check_in: null,
        check_out: null,
        coordinates: 'lat,lng',
        status: 'leave',
        description: payload.description || null,
        is_accepted: false,
        created_at_local: date,
      }))

      const data = await db
        .insert(attendancesTable)
        .values(insertValues)
      return res.status(200).json(data)
    }

    return res.status(400).json({
      message:
        'Pengajuan ijin di tanggal hari ini tidak bisa diproses karena anda sudah absen masuk',
    })
  } catch (error) {
    console.log('error ->', error)
    res.status(500).json({ error })
  }
}

export default withAuth(handler)
