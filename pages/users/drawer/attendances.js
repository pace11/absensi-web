import { Drawer } from 'antd'
import dynamic from 'next/dynamic'

const Kalender = dynamic(() => import('@/pages/kalender'))

export default function Popup({ onClose, isOpen }) {
  return (
    <Drawer
      title="Absensi"
      placement="bottom"
      height={640}
      onClose={() => {
        onClose()
      }}
      open={isOpen}
    >
      <Kalender user_id={isOpen} />
    </Drawer>
  )
}
