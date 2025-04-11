/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import { LockTwoTone, MailTwoTone } from '@ant-design/icons'
import { Button, Card, Form, Input, Row, notification } from 'antd'
import Image from 'next/image'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/router'

const Login = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const onFinish = async (values) => {
    setIsLoading(true)
    const res = await signIn('credentials', {
      redirect: false,
      email: values?.email || '',
      password: values?.password || '',
    })

    if (res.error) {
      setIsLoading(false)
      notification.error({
        message: 'Error',
        description: res.error,
        duration: 2,
      })
    } else {
      setIsLoading(false)
      notification.success({
        message: 'Info',
        description: 'Login Berhasil',
        duration: 2,
      })
      router.push('/')
    }
  }

  return (
    <Row
      justify="center"
      align="middle"
      style={{
        background: '#f5f5f5',
        flexDirection: 'column',
      }}
    >
      <Card variant="borderless" style={{ width: '350px' }}>
        <h2
          style={{
            textAlign: 'center',
            margin: 0,
            padding: 0,
            fontWeight: 'bold',
          }}
        >
          LOGIN
        </h2>
        <p
          style={{
            textAlign: 'center',
            margin: '0 0 25px 0',
            padding: 0,
          }}
        >
          Sistem Absensi
        </p>
        <p style={{ textAlign: 'center' }}>
          <Image
            src="https://res.cloudinary.com/dby4ywiss/image/upload/v1744330997/app/absensi/logo_l15opu.png"
            alt="logo"
            width={100}
            height={120}
          />
        </p>
        <Form
          name="basic"
          labelCol={{
            span: 24,
          }}
          wrapperCol={{
            span: 24,
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          autoComplete="off"
          labelAlign="left"
        >
          <Form.Item
            name="email"
            rules={[
              {
                type: 'email',
                required: true,
                message: 'Harap isikan format email valid!',
              },
            ]}
          >
            <Input
              prefix={<MailTwoTone twoToneColor="#1890FF" />}
              placeholder="Email ..."
              size="large"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: 'Harap isikan password!',
              },
            ]}
          >
            <Input.Password
              prefix={<LockTwoTone twoToneColor="#1890FF" />}
              placeholder="Password ..."
              size="large"
            />
          </Form.Item>
          <Form.Item>
            <Button
              loading={isLoading}
              type="primary"
              htmlType="submit"
              block
              size="large"
            >
              LOGIN
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Row>
  )
}

export default Login
