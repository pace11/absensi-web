import {
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons'
import { Tag } from 'antd'
import dayjs from 'dayjs'

export const toMappingDetailPegawai = ({ data }) => [
  {
    label: 'Nama',
    value: data?.nama || '-',
  },
  {
    label: 'Tempat & Tanggal Lahir',
    value: `${data?.tempat_lahir ? `${data?.tempat_lahir}, ` : ''}${
      data?.tanggal_lahir
        ? dayjs(data?.tanggal_lahir)
            .locale('id')
            .format('DD MMMM YYYY')
        : ''
    }`,
  },
  {
    label: 'NIP Lama',
    value: data?.nip_lama || '-',
  },
  {
    label: 'NIP Baru',
    value: data?.nip_baru || '-',
  },
  {
    label: 'Golongan',
    value: data?.golongan?.title || '-',
  },
  {
    label: 'Tamat Golongan',
    value: data?.tmt_golongan
      ? dayjs(data?.tmt_golongan).locale('id').format('DD MMMM YYYY')
      : '-',
  },
  {
    label: 'Jabatan',
    value: data?.jabatan?.title || '-',
  },
  {
    label: 'Agama',
    value: data?.agama?.title || '-',
  },
  {
    label: 'Tamat Jabatan',
    value: data?.tmt_jabatan
      ? dayjs(data?.tmt_jabatan).locale('id').format('DD MMMM YYYY')
      : '-',
  },
  {
    label: 'Kepala Sekolah',
    value: (
      <Tag
        color={data?.kepala_sekolah ? 'green' : 'magenta'}
        icon={
          data?.kepala_sekolah ? (
            <CheckCircleOutlined />
          ) : (
            <CloseCircleOutlined />
          )
        }
      >
        {data?.kepala_sekolah ? 'Ya' : 'Tidak'}
      </Tag>
    ),
  },
  {
    label: 'Jurusan',
    value: data?.jurusan || '-',
  },
  {
    label: 'Tahun Lulus',
    value: data?.tahun_lulus || '-',
  },
  {
    label: 'Pendidikan Terakhir',
    value: data?.pendidikan_terakhir?.title || '-',
  },
  {
    label: 'Keturunan',
    value: `${data?.keturunan?.title} - ${data?.keturunan?.description}`,
  },
]
