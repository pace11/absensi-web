import dynamic from 'next/dynamic'
import { getToken } from 'next-auth/jwt'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

const AdminPage = dynamic(() => import('@/pages/beranda'))
const EmployeePage = dynamic(() => import('@/pages/absensi'))

export default function Index({ session, holiday }) {
  const mapping = {
    admin: <AdminPage />,
    employee: <EmployeePage holiday={holiday} />,
  }

  const render = mapping?.[session.role] ?? <EmployeePage />
  return render
}

export async function getServerSideProps(context) {
  const session = await getToken({
    req: context.req,
    secret: process.env.NEXTAUTH_SECRET,
  })

  const holiday = [0, 6].includes(
    dayjs().tz(process.env.LOCAL_TIMEZONE).day(),
  )

  return {
    props: {
      session,
      holiday,
    },
  }
}
