import { ProfileContextProvider } from '@/context/profileContextProvider'
import 'antd/dist/antd.css'
import '@/styles/globals.css'
import 'dayjs/locale/id'
import Layout from '@/layout'
import { SessionProvider } from 'next-auth/react'

export default function App({ Component, pageProps }) {
  return (
    <SessionProvider>
      <ProfileContextProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ProfileContextProvider>
    </SessionProvider>
  )
}
