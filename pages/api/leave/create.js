import { attendancesTable } from '@/lib/db/schema'
import { db } from '@/lib/db'
import { getDateRange } from '@/helpers/utils'
import { withAuth } from '@/lib/middleware'

async function handler(req, res, session) {
  if (req.method !== 'POST') {
    res
      .status(405)
      .json({ data: [{ message: 'Method not allowed' }] })
  }

  try {
    const payload = req.body
    const range = getDateRange(payload.date[0], payload.date[1])
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
    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({ error })
  }
}

export default withAuth(handler)
