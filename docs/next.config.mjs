import { createMDX } from 'fumadocs-mdx/next'

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: __dirname,
}

const withMDX = createMDX()

export default withMDX(nextConfig)
