/* eslint-disable react-hooks/exhaustive-deps */
import {
  Form,
  Card,
  Input,
  TimePicker,
  Button,
  notification,
  InputNumber,
} from 'antd'
import { SaveOutlined } from '@ant-design/icons'
import Axios from 'axios'
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { useFetching } from '@/hooks/useFetching'

export default function Users() {
  const { data: setting, reloadData } = useFetching({
    path: '/api/setting',
  })
  const [loadingSubmit, setLoadingSubmit] = useState(false)
  const [form] = Form.useForm()
  const settingExist = setting?.data?.length > 0

  const onFinish = async (values) => {
    setLoadingSubmit(true)
    try {
      const response = await Axios({
        method: 'POST',
        url: '/api/setting/update',
        data: values,
      })
      if (response.status === 200) {
        notification.success({
          message: 'Info',
          description: 'Berhasil menyimpan data',
          duration: 5,
        })
        reloadData()
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
    form.setFieldsValue({
      name: setting?.[0]?.name,
      address: setting?.[0]?.address,
      coordinates: setting?.[0]?.coordinates,
      radius: setting?.[0]?.radius || 0,
      clock_in: dayjs(
        setting?.[0]?.clock_in || new Date().toLocaleDateString(),
        'HH:mm:ss',
      ),
      clock_out: dayjs(
        setting?.[0]?.clock_out || new Date().toLocaleDateString(),
        'HH:mm:ss',
      ),
    })
  }, [settingExist])

  return (
    <Card title="Setting">
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
          label="Alamat"
          name="address"
          rules={[
            {
              required: true,
              message: 'Harap isikan alamat!',
            },
          ]}
        >
          <Input.TextArea size="large" placeholder="Alamat ..." />
        </Form.Item>
        <Form.Item
          label="Koordinat"
          name="coordinates"
          rules={[
            {
              required: true,
              message: 'Harap isikan koordinat!',
            },
          ]}
        >
          <Input
            size="large"
            placeholder="Contoh: -2.5912033947738675,140.66899812206955"
          />
        </Form.Item>
        <Form.Item
          label="Radius"
          name="radius"
          rules={[
            {
              required: true,
              message: 'Harap isikan radius!',
            },
          ]}
        >
          <InputNumber
            size="large"
            placeholder="100"
            min={0}
            max={1000000}
            addonAfter="Meter"
          />
        </Form.Item>
        <Form.Item
          label="Jam Masuk"
          name="clock_in"
          rules={[
            {
              required: true,
              message: 'Harap isikan jam masuk!',
            },
          ]}
        >
          <TimePicker />
        </Form.Item>
        <Form.Item
          label="Jam Pulang"
          name="clock_out"
          rules={[
            {
              required: true,
              message: 'Harap isikan jam pulang!',
            },
          ]}
        >
          <TimePicker />
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
  )
}
