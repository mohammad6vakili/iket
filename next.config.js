const withPwa = require('next-pwa');

module.exports = withPwa({
  experimental: {
    images: {
      layoutRaw: true,
    },
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  pwa:{
    dest:'public',
    disable:process.env.NODE_ENV === 'development'
  },
  // typescript: {
  //   ignoreBuildErrors: true,
  // },
  reactStrictMode: true,
  images: {
    domains: ['https://iketpanel.com/'],
  },
  async redirects() {
    return [
      {
        source: '/restaurant',
        destination: '/',
        permanent: true,
      },
    ]
  },
})
