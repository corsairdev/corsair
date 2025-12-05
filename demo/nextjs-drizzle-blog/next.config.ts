import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	transpilePackages: ["corsair"],
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "i.scdn.co",
			},
			{
				protocol: "https",
				hostname: "**",
			},
		],
	},
};

export default nextConfig;
