import { ProfileContextProvider } from '@/context/profileContextProvider'
import { ConfigProvider } from 'antd'
import '@/styles/globals.css'
import 'dayjs/locale/id'
import Layout from '@/layout'
import { SessionProvider } from 'next-auth/react'

export default function App({ Component, pageProps }) {
  return (
    <ConfigProvider>
      <SessionProvider>
        <ProfileContextProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ProfileContextProvider>
      </SessionProvider>
    </ConfigProvider>
  )
}
