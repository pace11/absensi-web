import { Card, Table, Space, Button, notification, Modal } from 'antd'
import { useFetching } from '@/hooks/useFetching'
import {
  DeleteOutlined,
  EditOutlined,
  UserAddOutlined,
  ReloadOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons'
import { useState } from 'react'
import dynamic from 'next/dynamic'
import Axios from 'axios'

const Drawer = dynamic(() => import('@/pages/users/drawer'))

export default function Users() {
  const { data, isLoading, reloadData } = useFetching({
    path: '/api/users',
  })
  const [open, setOpen] = useState(false)
  const [isDelete, setDelete] = useState(false)

  const showConfirmDelete = (params) => {
    setDelete(true)
    Modal.confirm({
      title: 'Hapus data',
      content: (
        <p>
          Kamu yakin ingin menghapus data <b>{params.name}</b> ?
        </p>
      ),
      icon: <ExclamationCircleOutlined />,
      okText: 'Ya, Hapus',
      cancelText: 'Tidak',
      onOk: async () => {
        try {
          const response = await Axios({
            method: 'DELETE',
            url: `/api/users/${params.id}/delete`,
          })
          if (response.status === 200) {
            notification.success({
              message: 'Info',
              description: 'Berhasil menghapus data',
              duration: 5,
            })
            setDelete(false)
            reloadData()
          }
        } catch (error) {
          notification.error({
            message: 'Error',
            description: `${error.message}`,
            duration: 5,
          })
        } finally {
          setDelete(false)
        }
      },
      onCancel: () => {},
    })
  }

  const columns = [
    {
      title: 'ID',
      key: 'id',
      dataIndex: 'id',
    },
    {
      title: 'Nama',
      key: 'name',
      dataIndex: 'name',
    },
    {
      title: 'Email',
      key: 'email',
      dataIndex: 'email',
    },
    {
      title: 'Aksi',
      render: (item) => (
        <Space direction="horizontal">
          <Button
            type="dashed"
            icon={<EditOutlined />}
            onClick={() => setOpen(item)}
          >
            Ubah
          </Button>
          <Button
            danger
            type="primary"
            icon={<DeleteOutlined />}
            onClick={() => showConfirmDelete(item)}
          >
            Hapus
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <>
      <Card
        title="Pengguna"
        extra={[
          <Space key="action-pengguna">
            <Button
              type="default"
              icon={<ReloadOutlined />}
              onClick={() => reloadData()}
            >
              Refresh data
            </Button>
            <Button
              type="primary"
              icon={<UserAddOutlined />}
              onClick={() => setOpen(true)}
            >
              Tambah pengguna
            </Button>
          </Space>,
        ]}
      >
        <Table
          size="large"
          rowKey="users"
          columns={columns}
          loading={isLoading}
          dataSource={data?.data ?? null}
        />
      </Card>
      <Drawer
        isOpen={open}
        onClose={() => {
          setOpen(false)
          reloadData()
        }}
      />
    </>
  )
}
