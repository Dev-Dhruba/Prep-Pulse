/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['three'],
  images: {
    domains: ['lh3.googleusercontent.com', 'avatars.githubusercontent.com',"bxippjptmeobymrbwpah.supabase.co"],
  },
  webpack: (config) => {
    config.externals = [...(config.externals || []), {
      'utf-8-validate': 'commonjs utf-8-validate',
      'bufferutil': 'commonjs bufferutil',
    }];
    return config;
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    serverExternalPackages: ['microsoft-cognitiveservices-speech-sdk'],
  }
};

export default nextConfig;