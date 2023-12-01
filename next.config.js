/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['three'],
  async rewrites() {
    return {
      beforeFiles: [
        // These rewrites are checked after headers/redirects
        // and before all files including _next/public files which
        // allows overriding page files
        {
          source: '/',
          destination: '/white',
        },
      ]
    }
  }
}

module.exports = nextConfig
