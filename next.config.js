module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['https://iketpanel.com/'],
  },
  async redirects() {
    return [
      {
        source: '/restaurant',
        destination: '',
        permanent: true,
      },
    ]
  },
}
