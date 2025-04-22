/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: ['three'],
  webpack: (config) => {
    config.externals = [...(config.externals || []), {
      'utf-8-validate': 'commonjs utf-8-validate',
      'bufferutil': 'commonjs bufferutil',
    }];
    return config;
  },
  // Disable conflicting experimental features that might cause semver errors
  experimental: {
    // Empty serverComponentsExternalPackages to avoid semver issues
    serverComponentsExternalPackages: [],
    // Turn off any other experimental features that might be causing issues
    instrumentationHook: false,
    serverActions: { allowedOrigins: [] }
  }
};

export default nextConfig;