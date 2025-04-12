/* eslint-disable react-hooks/exhaustive-deps */
import {
  Form,
  Card,
  Input,
  Typography,
  Button,
  notification,
  Row,
  Col,
  Alert,
} from 'antd'
import { SaveOutlined } from '@ant-design/icons'
import Axios from 'axios'
import { useEffect, useState } from 'react'
import { getToken } from 'next-auth/jwt'
import { signOut } from 'next-auth/react'

export default function Profile({ session }) {
  const [loadingSubmit, setLoadingSubmit] = useState(false)
  const [form] = Form.useForm()

  const onFinish = async (values) => {
    const payload = {
      name: values?.name || '',
      email: values?.email || '',
      ...(values?.password && { password: values?.password }),
    }

    setLoadingSubmit(true)
    try {
      const response = await Axios({
        method: 'PATCH',
        url: `/api/users/${session.id}/edit`,
        data: payload,
      })
      if (response.status === 200) {
        notification.success({
          message: 'Info',
          description:
            'Berhasil menyimpan data, akan akan logout secara otomatis dalam 3 detik',
          duration: 3,
          showProgress: true,
        })
        setTimeout(() => {
          signOut({
            callbackUrl:
              process.env.NEXT_PUBLIC_LOGOUT_REDIRECT_URL || '/',
          })
        }, 3000)
      }
    } catch (error) {
      notification.error({
        message: 'Error',
        description: `${error.message}`,
        duration: 5,
      })
    } finally {
      setLoadingSubmit(false)
    }
  }

  useEffect(() => {
    if (Object.keys(session).length > 0) {
      form.setFieldsValue({
        name: session.name,
        email: session.email,
      })
    }
  }, [session, form])

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Alert
          message="Informasi"
          description="Jika anda melakukan perubahan data profile, setelah berhasil menyimpan anda akan diarahkan untuk logout dari sistem. Selanjutnya anda cukup melakukan login kembali"
          type="info"
          showIcon
        />
      </Col>
      <Col span={24}>
        <Card title="Profile">
          <Form
            form={form}
            name="basic"
            labelCol={{
              span: 4,
            }}
            wrapperCol={{
              span: 12,
            }}
            initialValues={{
              remember: true,
            }}
            autoComplete="off"
            onFinish={onFinish}
            labelAlign="left"
          >
            <Form.Item
              label="Nama"
              name="name"
              rules={[
                {
                  required: true,
                  message: 'Harap isikan nama!',
                },
              ]}
            >
              <Input size="large" placeholder="Nama ..." />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  type: 'email',
                  required: true,
                  message: 'Harap isikan format email valid!',
                },
              ]}
            >
              <Input size="large" placeholder="Email ..." />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              extra={
                <Typography.Text mark>
                  Jika ingin merubah password saat ini, silahkan isi
                  field password
                </Typography.Text>
              }
            >
              <Input.Password
                placeholder="Password ..."
                size="large"
                allowClear
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                loading={loadingSubmit}
              >
                Simpan
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  )
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
