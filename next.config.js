/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['three'],

  // Add reactStrictMode setting
  reactStrictMode: true,

  // Extend your webpack configuration
  webpack: (config, options) => {
    // Add the GLSL loader configuration
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      use: ['raw-loader', 'glslify-loader'],
    });

    // Make sure to return the updated config
    return config;
  },
}

module.exports = nextConfig;