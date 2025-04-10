import { CloseOutlined, SaveOutlined } from '@ant-design/icons'
import {
  Button,
  Drawer,
  Form,
  Input,
  Space,
  DatePicker,
  notification,
} from 'antd'
import { useRef, useState } from 'react'
import Axios from 'axios'
import dayjs from 'dayjs'

export default function Popup({ onClose, isOpen }) {
  const refButton = useRef(null)
  const [form] = Form.useForm()
  const [isLoading, setLoading] = useState(false)

  const onSubmitClick = () => {
    refButton.current.click()
  }

  const onFinish = async (values) => {
    setLoading(true)
    try {
      const response = await Axios({
        method: 'POST',
        url: '/api/leave/create',
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
        description: `${
          error.response.data.message || error.message
        }`,
        duration: 2,
      })
    } finally {
      setLoading(false)
    }
  }

  const disableWeekend = (current) => {
    const day = dayjs(current).day()
    return (
      (current && current < dayjs().startOf('day')) ||
      [0, 6].includes(day)
    )
  }

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
          label="Tanggal"
          name="date"
          rules={[
            {
              required: true,
              message: 'Harap isikan tanggal!',
            },
          ]}
        >
          <DatePicker.RangePicker
            disabledDate={disableWeekend}
            size="large"
          />
        </Form.Item>
        <Form.Item
          label="Keterangan"
          name="description"
          rules={[
            {
              required: true,
              message: 'Harap isikan keterangan!',
            },
          ]}
        >
          <Input.TextArea
            size="large"
            placeholder="Isikan keterangan ..."
          />
        </Form.Item>
        <Form.Item hidden>
          <Button ref={refButton} type="primary" htmlType="submit">
            Simpan
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  )
}
