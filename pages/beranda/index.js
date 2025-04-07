import { Row, Col, Card, Statistic } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { useFetching } from '@/hooks/useFetching'

export default function Beranda() {
  const { data, isLoading } = useFetching({ path: '/api/grafik' })

  return (
    <>
      <Row gutter={[14, 14]}>
        <Col span={8}>
          <Card loading={isLoading}>
            <Statistic
              title="Pengguna"
              value={data?.userCount || 0}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
      </Row>
    </>
  )
}
