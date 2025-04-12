import { Layout, Menu, Row, Col, Dropdown, Space } from 'antd'
import React from 'react'
import { menu } from './menu'
import { useSession, signOut, signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import {
  DownOutlined,
  LogoutOutlined,
  UserOutlined,
} from '@ant-design/icons'

const { Header, Content, Footer } = Layout

const LayoutApp = ({ children }) => {
  const router = useRouter()
  const user = useSession()

  const handleDropdownClick = (value) => {
    if (value.key === 'logout') {
      signOut({
        callbackUrl:
          process.env.NEXT_PUBLIC_LOGOUT_REDIRECT_URL || '/',
      })
    }

    if (value.key === 'profile') {
      router.push(`/${value.key}`)
    }
  }

  const itemsDropdown = [
    {
      key: 'profile',
      label: 'Profile',
      icon: <UserOutlined />,
    },
    {
      key: 'logout',
      danger: true,
      label: 'Logout',
      icon: <LogoutOutlined />,
    },
  ]

  return (
    <Layout style={{ height: '100vh' }}>
      <Header>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={router.pathname.split()}
          items={menu(user.data?.user?.role)}
          onSelect={(value) => router.push(value.key)}
        />
      </Header>
      <Content
        style={{
          padding: '20px 30px',
          overflowY: 'scroll',
        }}
      >
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Row align="middle" justify="end">
              {user.status !== 'unauthenticated' && (
                <Space wrap>
                  <Dropdown.Button
                    menu={{
                      items: itemsDropdown,
                      onClick: handleDropdownClick,
                    }}
                    icon={<DownOutlined />}
                  >
                    {`Hi, ${user.data?.user.name}`}
                  </Dropdown.Button>
                </Space>
              )}
            </Row>
          </Col>
          <Col span={24}>{children}</Col>
        </Row>
      </Content>
      <Footer
        style={{
          textAlign: 'center',
        }}
      >
        {`SABHARA POLRES KEEROM ©${new Date().getFullYear()}`}
      </Footer>
    </Layout>
  )
}

export default LayoutApp
