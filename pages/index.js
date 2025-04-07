import dynamic from 'next/dynamic'
import { getToken } from 'next-auth/jwt'

const AdminPage = dynamic(() => import('@/pages/beranda'))
const EmployeePage = dynamic(() => import('@/pages/absensi'))

export default function Index({ session }) {
  const mapping = {
    admin: <AdminPage />,
    employee: <EmployeePage />,
  }

  const render = mapping?.[session.role] ?? <EmployeePage />
  return render
}

export async function getServerSideProps(context) {
  const session = await getToken({
    req: context.req,
    secret: process.env.NEXTAUTH_SECRET,
  })

  return {
    props: { session },
  }
}
