import { CloseOutlined, SaveOutlined } from '@ant-design/icons'
import {
  Button,
  Drawer,
  Form,
  Input,
  Space,
  Typography,
  notification,
} from 'antd'
import { useEffect, useRef, useState } from 'react'
import Axios from 'axios'

export default function Popup({ onClose, isOpen }) {
  const refButton = useRef(null)
  const [form] = Form.useForm()
  const [isLoading, setLoading] = useState(false)

  const onSubmitClick = () => {
    refButton.current.click()
  }

  const onFinish = async (values) => {
    setLoading(true)
    const method =
      Object.keys(isOpen || {}).length > 0 ? 'PATCH' : 'POST'
    const url = {
      PATCH: `/api/users/${isOpen.id}/edit`,
      POST: `/api/users/create`,
    }
    try {
      const response = await Axios({
        method,
        url: url[method],
        data: values,
      })
      if (response.status === 200) {
        form.resetFields()
        notification.success({
          message: 'Info',
          description: 'Berhasil menyimpan data',
          duration: 2,
        })
        onClose()
      }
    } catch (error) {
      notification.error({
        message: 'Error',
        description: `${error.message}`,
        duration: 2,
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (Object.keys(isOpen || {}).length > 0) {
      form.setFieldsValue({
        name: isOpen.name,
        email: isOpen.email,
      })
    }
  }, [isOpen, form])

  return (
    <Drawer
      title="Form"
      width={480}
      placement="right"
      onClose={() => {
        onClose()
        form.resetFields()
      }}
      open={isOpen}
      extra={
        <Space>
          <Button
            onClick={() => {
              onClose()
              form.resetFields()
            }}
            icon={<CloseOutlined />}
            disabled={isLoading}
          >
            Batal
          </Button>
          <Button
            onClick={() => onSubmitClick()}
            icon={<SaveOutlined />}
            type="primary"
            loading={isLoading}
          >
            Simpan
          </Button>
        </Space>
      }
    >
      <Form
        form={form}
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
            Object.keys(isOpen || {}).length > 0 ? (
              <Typography.Text mark>
                Jika ingin merubah password saat ini, silahkan isi
                field password
              </Typography.Text>
            ) : null
          }
          rules={
            !Object.keys(isOpen || {}).length > 0
              ? [
                  {
                    required: true,
                    message: 'Harap isikan password!',
                  },
                ]
              : []
          }
        >
          <Input.Password placeholder="Password ..." size="large" />
        </Form.Item>
        <Form.Item hidden>
          <Button ref={refButton} type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  )
}
