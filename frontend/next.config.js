module.exports = {
    async rewrites() {
      return [
        {
          source: '/api/:path*', // Ini adalah path yang akan dikelola oleh proxy
          destination: 'http://localhost:8000/api/:path*', // Arahkan ke backend FastAPI di localhost:8000
        },
      ]
    },
  }