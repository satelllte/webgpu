/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  webpack: (config) => {
    config.module.rules.push({test: /\.wgsl/, type: 'asset/source'});
    return config;
  },
};

module.exports = nextConfig;
