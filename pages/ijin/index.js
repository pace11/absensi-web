import dynamic from 'next/dynamic'
import { getToken } from 'next-auth/jwt'

const Employee = dynamic(() => import('@/pages/ijin/employee'))
const Admin = dynamic(() => import('@/pages/ijin/admin'))

export default function Ijin({ session }) {
  const mapping = {
    admin: <Admin />,
    employee: <Employee />,
  }

  const render = mapping?.[session.role] ?? <Employee />
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
