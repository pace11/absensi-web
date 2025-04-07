import { Col, Row, Table, Typography } from 'antd'
import dayjs from 'dayjs'

const DownloadPegawai = ({ data }) => {
  const columns = [
    {
      title: 'No',
      key: 'number',
      dataIndex: 'number',
    },
    {
      title: 'Nama',
      key: 'nama',
      dataIndex: 'nama',
      sorter: (a, b) => a.nama - b.nama,
    },
    {
      title: 'Tanggal Lahir',
      key: 'tanggal_lahir',
      dataIndex: 'tanggal_lahir',
      render: (tanggal_lahir) =>
        tanggal_lahir
          ? dayjs(tanggal_lahir).locale('id').format('DD MMMM YYYY')
          : '-',
    },
    {
      title: 'Nip Baru',
      key: 'nip_baru',
      dataIndex: 'nip_baru',
      render: (nip_baru) => nip_baru || '-',
    },
    {
      title: 'Pendidikan Terakhir',
      render: ({ pendidikan_terakhir, jurusan }) =>
        `${pendidikan_terakhir?.title || '-'} ${jurusan || ''}`,
    },
    {
      title: 'Golongan',
      key: 'golongan',
      dataIndex: 'golongan',
      render: (golongan) => golongan?.title || '-',
    },
    {
      title: 'Jabatan',
      key: 'jabatan',
      dataIndex: 'jabatan',
      render: (jabatan) => jabatan?.title || '-',
    },
  ]

  return (
    <Row>
      <Col span={24}>
        <Typography.Title level={3}>List Pegawai</Typography.Title>
      </Col>
      <Col span={24}>
        <Table
          size="small"
          columns={columns}
          dataSource={data?.map((item, idx) => ({
            number: idx + 1,
            ...item,
          }))}
          pagination={false}
        />
      </Col>
    </Row>
  )
}

export default DownloadPegawai
