import { attendancesTable } from '@/lib/db/schema'
import { eq, sql } from 'drizzle-orm'
import { db } from '@/lib/db'
import { withAuth } from '@/lib/middleware'
import dayjs from 'dayjs'

async function handler(req, res, session) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { type } = req.query
    const payload = { ...req.body, user_id: session.id }

    // Ambil semua absen user hari ini
    const today = dayjs(payload.current_time_local).format(
      'YYYY-MM-DD',
    )

    const isAttended = await db
      .select()
      .from(attendancesTable)
      .where(
        sql`DATE(${attendancesTable.created_at_local}) = ${today} AND ${attendancesTable.user_id} = ${session.id}`,
      )
      .limit(1)
      .then((res) => res[0])

    // ✅ Absensi masuk
    if (type === 'check_in') {
      if (!isAttended) {
        const result = await db.insert(attendancesTable).values({
          ...payload,
          is_accepted: true,
        })
        return res.status(200).json(result)
      }

      return res
        .status(400)
        .json({ message: 'Anda sudah absen masuk hari ini' })
    }

    // ✅ Absensi keluar
    if (type === 'check_out') {
      if (!isAttended) {
        return res
          .status(400)
          .json({ message: 'Anda harus absen masuk terlebih dahulu' })
      }

      if (isAttended.check_out) {
        return res
          .status(400)
          .json({ message: 'Anda sudah absen pulang hari ini' })
      }

      const result = await db
        .update(attendancesTable)
        .set({
          ...payload,
          status: 'present',
          updated_at: sql`NOW()`,
        })
        .where(eq(attendancesTable.id, isAttended.id))

      return res.status(200).json(result)
    }

    // Jika type tidak dikenal
    return res.status(400).json({ message: 'Tipe absen tidak valid' })
  } catch (error) {
    console.error(error)
    return res
      .status(500)
      .json({ message: 'Terjadi kesalahan server', error })
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
