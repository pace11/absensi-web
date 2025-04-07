import { messageGolongan } from '@/helpers/utils'
import { toMappingDetailPegawai } from '@/mapping'
import { Card, Col, Descriptions, Row } from 'antd'

const DownloadPegawaiDetail = ({ detail }) => {
  // const { data: dataPekerjaan, isLoading: isLoadingPekerjaan } =
  //   HookSwr({
  //     path: detail?.id ? `/pekerjaan?pegawai_id=${detail?.id}` : '',
  //   })
  // const { data: dataKeluarga, isLoading: isLoadingKeluarga } =
  //   HookSwr({
  //     path: detail?.id ? `/keluarga?pegawai_id=${detail?.id}` : '',
  //   })
  // const { data: dataPendidikan, isLoading: isLoadingPendidikan } =
  //   HookSwr({
  //     path: detail?.id ? `/pendidikan?pegawai_id=${detail?.id}` : '',
  //   })

  // const columnsPekerjaan = [
  //   {
  //     title: 'Nomor SK',
  //     key: 'nomor_sk',
  //     dataIndex: 'nomor_sk',
  //     render: (nomor_sk) => nomor_sk || '-',
  //   },
  //   {
  //     title: 'Tanggal SK',
  //     key: 'tanggal_sk',
  //     dataIndex: 'tanggal_sk',
  //     render: (tanggal_sk) =>
  //       tanggal_sk
  //         ? dayjs(tanggal_sk).locale('id').format('DD MMMM YYYY')
  //         : '-',
  //   },
  //   {
  //     title: 'TTD SK',
  //     key: 'ttd_sk',
  //     dataIndex: 'ttd_sk',
  //     render: (ttd_sk) => ttd_sk || '-',
  //   },
  //   {
  //     title: 'Keterangan',
  //     key: 'keterangan',
  //     dataIndex: 'keterangan',
  //     render: (keterangan) => keterangan || '-',
  //   },
  // ]

  // const columnsKeluarga = [
  //   {
  //     title: 'NIK',
  //     key: 'nik',
  //     dataIndex: 'nik',
  //   },
  //   {
  //     title: 'Nama Lengkap',
  //     key: 'nama_lengkap',
  //     dataIndex: 'nama_lengkap',
  //   },
  //   {
  //     title: 'Jenis Kelamin',
  //     key: 'jenis_kelamin',
  //     dataIndex: 'jenis_kelamin',
  //     render: (jenis_kelamin) => jenis_kelamin || '-',
  //   },
  //   {
  //     title: 'TTL',
  //     render: ({ tempat_lahir, tanggal_lahir }) =>
  //       `${tempat_lahir ? `${tempat_lahir}, ` : ''}${
  //         tanggal_lahir
  //           ? dayjs(tanggal_lahir).locale('id').format('DD MMMM YYYY')
  //           : ''
  //       }`,
  //   },
  //   {
  //     title: 'Golongan Darah',
  //     key: 'golongan_darah',
  //     dataIndex: 'golongan_darah',
  //     render: (golongan_darah) => golongan_darah || '-',
  //   },
  //   {
  //     title: 'Kewarganegaraan',
  //     key: 'kewarganegaraan',
  //     dataIndex: 'kewarganegaraan',
  //     render: (kewarganegaraan) => kewarganegaraan || '-',
  //   },
  //   {
  //     title: 'Agama',
  //     key: 'agama',
  //     dataIndex: 'agama',
  //     render: (agama) => agama?.title || '-',
  //   },
  //   {
  //     title: 'Pendidikan',
  //     key: 'pendidikan_kk',
  //     dataIndex: 'pendidikan_kk',
  //     render: (pendidikan_kk) => pendidikan_kk?.title || '-',
  //   },
  //   {
  //     title: 'Status Perkawinan',
  //     key: 'status_perkawinan_kk',
  //     dataIndex: 'status_perkawinan_kk',
  //     render: (status_perkawinan_kk) =>
  //       status_perkawinan_kk?.title || '-',
  //   },
  //   {
  //     title: 'Tanggal Perkawinan',
  //     key: 'tanggal_perkawinan',
  //     dataIndex: 'tanggal_perkawinan',
  //     render: (tanggal_perkawinan) =>
  //       tanggal_perkawinan
  //         ? dayjs(tanggal_perkawinan)
  //             .locale('id')
  //             .format('DD MMMM YYYY')
  //         : '-',
  //   },
  //   {
  //     title: 'Status Hubungan',
  //     key: 'status_hubungan_kk',
  //     dataIndex: 'status_hubungan_kk',
  //     render: (status_hubungan_kk) =>
  //       status_hubungan_kk?.title || '-',
  //   },
  //   {
  //     title: 'Jenis Pekerjaan',
  //     key: 'jenis_pekerjaan_kk',
  //     dataIndex: 'jenis_pekerjaan_kk',
  //     render: (jenis_pekerjaan_kk) =>
  //       jenis_pekerjaan_kk?.title || '-',
  //   },
  // ]

  // const columnsPendidikan = [
  //   {
  //     title: 'Nomor Ijazah',
  //     key: 'nomor_ijazah',
  //     dataIndex: 'nomor_ijazah',
  //     render: (nomor_ijazah) => nomor_ijazah || '-',
  //   },
  //   {
  //     title: 'Nama Instansi Pendidikan',
  //     key: 'nama_instansi',
  //     dataIndex: 'nama_instansi',
  //     render: (nama_instansi) => nama_instansi || '-',
  //   },
  //   {
  //     title: 'Pendidikan',
  //     key: 'pendidikan_terakhir',
  //     dataIndex: 'pendidikan_terakhir',
  //     render: (pendidikan_terakhir) =>
  //       pendidikan_terakhir?.title || '-',
  //   },
  //   {
  //     title: 'Jurusan',
  //     key: 'jurusan',
  //     dataIndex: 'jurusan',
  //     render: (jurusan) => jurusan || '-',
  //   },
  //   {
  //     title: 'Tanggal Lulus',
  //     key: 'tanggal_lulus',
  //     dataIndex: 'tanggal_lulus',
  //     render: (tanggal_lulus) =>
  //       tanggal_lulus
  //         ? dayjs(tanggal_lulus).locale('id').format('DD MMMM YYYY')
  //         : '-',
  //   },
  // ]

  return (
    <Card title="Detail Pegawai" bordered={false}>
      <Row gutter={[24, 24]}>
        <Col span={24}>{messageGolongan({ data: detail ?? {} })}</Col>
        <Col span={24}>
          <Descriptions
            bordered
            size="small"
            column={2}
            layout="vertical"
            items={toMappingDetailPegawai({
              data: detail || {},
            })?.map((item, idx) => ({
              key: `${idx}`,
              label: item?.label,
              children: item?.value,
            }))}
          />
        </Col>
      </Row>
    </Card>
  )
}

export default DownloadPegawaiDetail
