/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
      CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
      MONGODB_URI: process.env.MONGODB_URI,
      SIGNING_SECRET: process.env.SIGNING_SECRET,
      GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  },
  experimental: {
      serverActions: {
          allowedOrigins: ['localhost:3000'],
          bodySizeLimit: '2mb'
      }
  }
}

export default nextConfig