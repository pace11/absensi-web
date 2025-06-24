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
import UploadFile from '@/components/upload-file'

export default function Popup({ onClose, isOpen }) {
  const refButton = useRef(null)
  const [form] = Form.useForm()
  const [isLoading, setLoading] = useState(false)
  const [fileList, setFileList] = useState([])

  const onSubmitClick = () => {
    refButton.current.click()
  }

  const onFinish = async (values) => {
    setLoading(true)
    const payload = { ...values }
    payload.file = fileList?.[0]?.['name']
    try {
      const response = await Axios({
        method: 'POST',
        url: '/api/leave/create',
        data: payload,
      })
      if (response.status === 200) {
        form.resetFields()
        notification.success({
          message: 'Info',
          description: 'Berhasil menyimpan data',
          duration: 5,
        })
        onClose()
      }
    } catch (error) {
      notification.error({
        message: 'Error',
        description: `${
          error.response.data.message || error.message
        }`,
        duration: 5,
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

  const HandleChangeUpload = (event) => {
    if (event?.file?.status === 'removed') {
      setFileList(event?.fileList)
    }
  }

  const HandleBeforeUpload = async (file) => {
    notification.info({
      message: 'Info',
      description: 'Upload file ...',
      duration: 1,
    })
    const formData = new FormData()
    formData.append('file', file)
    const response = await Axios({
      url: process.env.NEXT_PUBLIC_UPLOAD_URL,
      method: 'POST',
      headers: {
        'x-api-key': `${process.env.NEXT_PUBLIC_API_KEY}`,
      },
      data: formData,
    })
    if (response?.status === 201) {
      setFileList((oldArray) => [
        ...oldArray,
        {
          uid: oldArray.length + 1,
          name: `${response?.data?.data?.name}`,
          status: 'done',
          url: `${response?.data?.data?.url}`,
        },
      ])
      notification.success({
        message: 'Info',
        description: 'Upload berhasil',
        duration: 2,
      })
    } else {
      notification.error({
        message: 'Info',
        description: 'Upload gagal',
        duration: 2,
      })
    }
  }

  console.log('value => ', form.getFieldValue())

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
          label="File pendukung (Gambar/Surat Keterangan)"
          name="file"
        >
          <UploadFile
            fileList={fileList}
            onChange={HandleChangeUpload}
            onBeforeUpload={HandleBeforeUpload}
            maxLength={1}
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
