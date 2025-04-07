import { attendancesTable } from '@/lib/db/schema'
import { sql, eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import dayjs from 'dayjs'
import { withAuth } from '@/lib/middleware'

async function handler(req, res, session) {
  if (req.method !== 'POST') {
    res
      .status(405)
      .json({ data: [{ message: 'Method not allowed' }] })
  }

  try {
    const payload = req.body
    payload.user_id = session.id
    const currentTimeLocal = dayjs().format('YYYY-MM-DD')

    // checking if current date is exist
    const isAttended = await db
      .execute(
        sql`SELECT * FROM ${attendancesTable} WHERE DATE(${attendancesTable.created_at_local})=${currentTimeLocal} LIMIT 1`,
      )
      .then((res) => res[0])

    if (req.query.type === 'check_in') {
      payload.check_in = dayjs().format('HH:mm:ss')
      payload.created_at_local = dayjs().format('YYYY-MM-DD HH:mm:ss')
      payload.is_accepted = true

      if (!isAttended.length) {
        const data = await db
          .insert(attendancesTable)
          .values({ ...payload })
        res.status(200).json({ data })
      } else {
        res
          .status(400)
          .json({ message: 'Anda sudah absen masuk hari ini' })
      }
    }

    if (req.query.type === 'check_out') {
      payload.check_out = dayjs().format('HH:mm:ss')
      payload.status = 'present'

      if (!!isAttended.length && !isAttended[0].check_out) {
        const data = await db
          .update(attendancesTable)
          .set({ ...payload, updated_at: sql`NOW()` })
          .where(eq(attendancesTable.id, Number(isAttended[0].id)))
        res.status(200).json({ data })
      } else if (!!isAttended.length && isAttended[0].check_out) {
        res
          .status(400)
          .json({ message: 'Anda sudah absen pulang hari ini' })
      } else {
        res.status(400).json({
          message: 'Anda harus absen masuk terlebih dahulu',
        })
      }
    }
  } catch (error) {
    res.status(500).json({ error })
  }
}

export default withAuth(handler)

// console.log('data => ', convertLatLng(payload.coordinates)?.[0])
// const result = getPreciseDistance(
//   {
//     latitude: convertLatLng(payload.coordinates)?.[0],
//     longitude: convertLatLng(payload.coordinates)?.[1],
//   },
//   {
//     latitude: -2.564944743055905,
//     longitude: 140.51843175345988,
//   },
// )
// -2.564944743055905, 140.51843175345988
