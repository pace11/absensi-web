import {
  Card,
  Table,
  Space,
  Button,
  notification,
  Modal,
  Row,
  Col,
  Input,
  Form,
} from 'antd'
import { useFetching } from '@/hooks/useFetching'
import {
  ReloadOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  LinkOutlined,
} from '@ant-design/icons'
import { useState } from 'react'
import Axios from 'axios'
import { convertDateRange, badgeStatusLeave } from '@/helpers/utils'
import dayjs from 'dayjs'

export default function IjinAdmin() {
  const { data, isLoading, reloadData } = useFetching({
    path: '/api/leave/admin',
  })
  const [isAcc, setAcc] = useState(false)
  const [form] = Form.useForm()

  const showConfirmAcc = (params) => {
    Modal.confirm({
      title: 'Konfirmasi',
      content: <p>ACC request ijin ini ?</p>,
      icon: <ExclamationCircleOutlined />,
      okText: 'Ya',
      cancelText: 'Tidak',
      onOk: async () => {
        setAcc(params.ids)
        try {
          const response = await Axios({
            method: 'POST',
            url: `/api/leave/acc?ids=${params.ids}`,
          })
          if (response.status === 200) {
            notification.success({
              message: 'Info',
              description: 'Berhasil ACC Ijin',
              duration: 5,
            })
            setAcc(false)
            reloadData()
          }
        } catch (error) {
          notification.error({
            message: 'Error',
            description: `${error.message}`,
            duration: 5,
          })
        } finally {
          setAcc(false)
        }
      },
      onCancel: () => {},
    })
  }

  const showConfirmDecline = (params) => {
    Modal.confirm({
      title: 'Konfirmasi',
      content: (
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Form
              form={form}
              labelCol={{
                span: 24,
              }}
              wrapperCol={{
                span: 24,
              }}
              initialValues={{
                description: 'Ditolak',
              }}
              autoComplete="off"
              labelAlign="left"
            >
              <Form.Item label="Keterangan" name="description">
                <Input.TextArea
                  size="Large"
                  defaultValue="Ditolak"
                  placeholder="Keterangan ..."
                />
              </Form.Item>
            </Form>
          </Col>
        </Row>
      ),
      icon: <ExclamationCircleOutlined />,
      okText: 'Ya',
      cancelText: 'Tidak',
      onOk: async () => {
        try {
          const response = await Axios({
            method: 'POST',
            url: `/api/leave/acc?ids=${params.ids}&type=decline`,
            data: { ...form.getFieldsValue() },
          })
          if (response.status === 200) {
            notification.success({
              message: 'Info',
              description: 'Berhasil Tolak Ijin',
              duration: 5,
            })
            form.setFieldsValue({
              description: 'Ditolak',
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
          form.setFieldsValue({
            description: 'Ditolak',
          })
        }
      },
      onCancel: () => {},
    })
  }

  const columns = [
    {
      title: 'Tanggal',
      key: 'date_range',
      width: 400,
      render: ({ date_range }) => `${convertDateRange(date_range)}`,
    },
    {
      title: 'Durasi',
      key: 'duration',
      render: ({ duration }) => `${duration} Hari`,
    },
    {
      title: 'File Pendukung',
      key: 'file',
      render: ({ file }) =>
        file ? (
          <a
            href={`${process.env.NEXT_PUBLIC_PREVIEW_URL}/${file}`}
            target="_blank"
          >
            File <LinkOutlined />
          </a>
        ) : (
          ''
        ),
    },
    {
      title: 'Keterangan',
      key: 'description',
      dataIndex: 'description',
    },
    {
      title: 'Status',
      key: 'accepted',
      render: ({ accepted }) => badgeStatusLeave(accepted),
    },
    {
      title: 'Tanggal dibuat',
      key: 'created_at',
      render: ({ created_at }) =>
        dayjs(created_at)
          .locale('id')
          .format('dddd, DD MMMM YYYY HH:mm'),
    },
    {
      title: 'Aksi',
      render: (item) =>
        !['declined', 'accepted'].includes(item.accepted) ? (
          <Space direction="vertical">
            <Button
              type="primary"
              icon={<CheckCircleOutlined />}
              onClick={() => showConfirmAcc(item)}
              loading={item.ids === isAcc}
            >
              ACC Ijin
            </Button>
            <Button
              type="primary"
              danger
              icon={<CloseCircleOutlined />}
              onClick={() => showConfirmDecline(item)}
              loading={item.ids === isAcc}
            >
              Tolak Ijin
            </Button>
          </Space>
        ) : null,
    },
  ]

  return (
    <>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card
            title="Ijin"
            extra={[
              <Space key="action-pengguna">
                <Button
                  type="default"
                  icon={<ReloadOutlined />}
                  onClick={() => reloadData()}
                >
                  Refresh data
                </Button>
              </Space>,
            ]}
          >
            <Table
              size="large"
              rowKey="users"
              columns={columns}
              loading={isLoading}
              dataSource={data}
            />
          </Card>
        </Col>
      </Row>
    </>
  )
}
