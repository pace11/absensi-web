import withTM from 'next-transpile-modules'
const withTranspile = withTM([
  'rc-util',
  'rc-picker',
  'rc-tree',
  'rc-table',
  'rc-field-form',
  'rc-dialog',
  'rc-motion',
  'rc-virtual-list',
  'antd',
])

const nextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: false,
  images: {
    domains: ['res.cloudinary.com'],
  },
}

export default withTranspile(nextConfig)
