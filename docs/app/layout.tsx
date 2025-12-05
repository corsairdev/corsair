import "fumadocs-ui/style.css";
import "./globals.css";
import { NextProvider } from "fumadocs-core/framework/next";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { RootProvider } from "fumadocs-ui/provider";
import {
	Blocks,
	BookOpen,
	Code2,
	Database,
	Download,
	Droplets,
	FileCode,
	Flame,
	Hexagon,
	Layers,
	MessageSquare,
	Puzzle,
	Rocket,
	Terminal,
	Zap,
} from "lucide-react";
import type { ReactNode } from "react";

const tree = {
	name: "Documentation",
	children: [
		{
			type: "folder" as const,
			name: "Getting Started",
			icon: <Rocket className="size-4" />,
			defaultOpen: true,
			children: [
				{
					type: "page" as const,
					name: "Introduction",
					url: "/",
					icon: <BookOpen className="size-4" />,
				},
				{
					type: "page" as const,
					name: "Installation",
					url: "/installation",
					icon: <Download className="size-4" />,
				},
				{
					type: "page" as const,
					name: "Basic Usage",
					url: "/basic-usage",
					icon: <Zap className="size-4" />,
				},
			],
		},
		{
			type: "folder" as const,
			name: "Concepts",
			icon: <Layers className="size-4" />,
			defaultOpen: false,
			children: [
				{
					type: "page" as const,
					name: "API",
					url: "/api",
					icon: <Code2 className="size-4" />,
				},
				{
					type: "page" as const,
					name: "Client",
					url: "/client",
					icon: <Blocks className="size-4" />,
				},
				{
					type: "page" as const,
					name: "CLI",
					url: "/cli",
					icon: <Terminal className="size-4" />,
				},
				{
					type: "page" as const,
					name: "Plugins",
					url: "/plugins",
					icon: <Puzzle className="size-4" />,
				},
				{
					type: "page" as const,
					name: "Database",
					url: "/database",
					icon: <Database className="size-4" />,
				},
				{
					type: "page" as const,
					name: "TypeScript",
					url: "/typescript",
					icon: <FileCode className="size-4" />,
				},
			],
		},
		{
			type: "folder" as const,
			name: "Integrations",
			icon: <Blocks className="size-4" />,
			defaultOpen: false,
			children: [
				{
					type: "separator" as const,
					name: "Fullstack",
				},
				{
					type: "page" as const,
					name: "Next.js",
					url: "/integrations/next",
					icon: (
						<svg className="size-4" viewBox="0 0 180 180" fill="none">
							<mask
								id="a"
								width="180"
								height="180"
								x="0"
								y="0"
								maskUnits="userSpaceOnUse"
								style={{ maskType: "alpha" }}
							>
								<circle cx="90" cy="90" r="90" fill="#000" />
							</mask>
							<g mask="url(#a)">
								<circle
									cx="90"
									cy="90"
									r="87"
									fill="#000"
									stroke="#fff"
									strokeWidth="6"
								/>
								<path
									fill="url(#b)"
									d="M149.508 157.52L69.142 54H54v71.97h12.114V69.384l73.885 95.461a90.304 90.304 0 009.509-7.325z"
								/>
								<path fill="url(#c)" d="M115 54h12v72h-12z" />
							</g>
							<defs>
								<linearGradient
									id="b"
									x1="109"
									x2="144.5"
									y1="116.5"
									y2="160.5"
									gradientUnits="userSpaceOnUse"
								>
									<stop stopColor="#fff" />
									<stop offset="1" stopColor="#fff" stopOpacity="0" />
								</linearGradient>
								<linearGradient
									id="c"
									x1="121"
									x2="120.799"
									y1="54"
									y2="106.875"
									gradientUnits="userSpaceOnUse"
								>
									<stop stopColor="#fff" />
									<stop offset="1" stopColor="#fff" stopOpacity="0" />
								</linearGradient>
							</defs>
						</svg>
					),
				},
				{
					type: "separator" as const,
					name: "Frontend",
				},
				{
					type: "page" as const,
					name: "Vite",
					url: "/integrations/vite",
					icon: (
						<svg className="size-4" viewBox="0 0 410 404" fill="none">
							<path
								fill="url(#a-vite)"
								d="M399.641 59.525l-183.998 327.82c-4.486 7.987-16.025 8.042-20.587.1L3.373 59.412C-1.535 51.168 5.19 41.2 14.49 43.1l181.98 37.125c1.664.34 3.378.325 5.035-.043L379.986 43.04c9.336-1.828 15.99 8.21 10.956 16.321l8.699.164z"
							/>
							<path
								fill="url(#b-vite)"
								d="M292.965 1.577l-133.799 26.2c-2.932.575-5.08 3.093-5.21 6.103l-8.526 197.5c-.19 4.376 3.928 7.665 8.11 6.481l39.108-11.073c4.665-1.321 8.958 2.733 7.922 7.476l-13.14 60.135c-1.09 4.989 3.664 9.217 8.46 7.522l31.103-10.996c4.805-1.698 9.565 2.551 8.46 7.552l-20.88 94.47c-1.541 6.967 7.502 10.507 11.34 4.44l2.566-4.055 141.65-268.814c2.378-4.514-1.391-9.736-6.431-8.908l-40.686 6.69c-4.89.804-8.924-3.746-7.577-8.554l22.236-79.37c1.353-4.831-2.73-9.387-7.638-8.526l.932-.273z"
							/>
							<defs>
								<linearGradient
									id="a-vite"
									x1="6.003"
									x2="235.078"
									y1="32.94"
									y2="344.081"
									gradientUnits="userSpaceOnUse"
								>
									<stop stopColor="#41D1FF" />
									<stop offset="1" stopColor="#BD34FE" />
								</linearGradient>
								<linearGradient
									id="b-vite"
									x1="194.651"
									x2="236.076"
									y1="8.818"
									y2="292.989"
									gradientUnits="userSpaceOnUse"
								>
									<stop stopColor="#FFBD4F" />
									<stop offset="1" stopColor="#FF980E" />
								</linearGradient>
							</defs>
						</svg>
					),
				},
				{
					type: "separator" as const,
					name: "Backend",
				},
				{
					type: "page" as const,
					name: "Hono",
					url: "/integrations/hono",
					icon: <Flame className="size-4" />,
				},
				{
					type: "separator" as const,
					name: "ORM",
				},
				{
					type: "page" as const,
					name: "Prisma",
					url: "/integrations/prisma",
					icon: <Hexagon className="size-4" />,
				},
				{
					type: "page" as const,
					name: "Drizzle",
					url: "/integrations/drizzle",
					icon: <Droplets className="size-4" />,
				},
			],
		},
		{
			type: "folder" as const,
			name: "Plugins",
			icon: <Puzzle className="size-4" />,
			defaultOpen: false,
			children: [
				{
					type: "page" as const,
					name: "Slack",
					url: "/plugins/slack",
					icon: <MessageSquare className="size-4" />,
				},
			],
		},
	],
};

export default function RootLayout(props: { children: ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body>
				<NextProvider>
					<RootProvider theme={{ defaultTheme: "dark", enableSystem: false }}>
						<DocsLayout
							tree={tree}
							nav={{ title: "Corsair" }}
							sidebar={{
								defaultOpenLevel: 0,
							}}
						>
							{props.children}
						</DocsLayout>
					</RootProvider>
				</NextProvider>
			</body>
		</html>
	);
}
