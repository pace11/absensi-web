import { PlusOutlined, UploadOutlined } from '@ant-design/icons'
import { Button, Image, Upload } from 'antd'
import { useState } from 'react'

const UploadFile = ({
  fileList,
  onChange,
  onBeforeUpload,
  isLoading,
  maxLength = 1,
  disabled = false,
  accept = '',
}) => {
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState('')

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = (error) => reject(error)
    })

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj)
    }
    setPreviewImage(file.url || file.preview)
    setPreviewOpen(true)
  }

  return (
    <>
      <Upload
        listType="text"
        fileList={fileList}
        onPreview={false}
        onChange={onChange}
        beforeUpload={onBeforeUpload}
        disabled={disabled}
        showUploadList
        accept={accept}
      >
        {fileList.length >= maxLength ? null : (
          <Button
            type="default"
            icon={<UploadOutlined />}
            loading={isLoading}
            hidden={disabled}
          >
            Upload file
          </Button>
        )}
      </Upload>
      {previewImage && (
        <Image
          wrapperStyle={{
            display: 'none',
          }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) =>
              !visible && setPreviewImage(''),
          }}
          src={previewImage}
          alt={previewImage}
        />
      )}
    </>
  )
}

export default UploadFile
