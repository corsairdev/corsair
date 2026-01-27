import 'fumadocs-ui/style.css';
import './globals.css';
import { NextProvider } from 'fumadocs-core/framework/next';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { RootProvider } from 'fumadocs-ui/provider';
import {
	Ban,
	BicepsFlexed,
	BookOpen,
	Code2,
	Database,
	Download,
	Layers,
	MessageSquare,
	PhoneIncoming,
	Plug,
	Puzzle,
	RefreshCcwDot,
	Rocket,
	ScanFace,
	Users,
	Zap,
} from 'lucide-react';
import type { ReactNode } from 'react';

const tree = {
	name: 'Documentation',
	children: [
		{
			type: 'folder' as const,
			name: 'Getting Started',
			icon: <Rocket className="size-4" />,
			defaultOpen: true,
			children: [
				{
					type: 'page' as const,
					name: 'Introduction',
					url: '/',
					icon: <BookOpen className="size-4" />,
				},
				{
					type: 'page' as const,
					name: 'Installation',
					url: '/installation',
					icon: <Download className="size-4" />,
				},
				{
					type: 'page' as const,
					name: 'Basic Usage',
					url: '/basic-usage',
					icon: <Zap className="size-4" />,
				},
			],
		},
		{
			type: 'folder' as const,
			name: 'Concepts',
			icon: <Layers className="size-4" />,
			defaultOpen: false,
			children: [
				{
					type: 'page' as const,
					name: 'API',
					url: '/api',
					icon: <Code2 className="size-4" />,
				},
				{
					type: 'page' as const,
					name: 'Authentication',
					url: '/auth',
					icon: <ScanFace className="size-4" />,
				},
				{
					type: 'page' as const,
					name: 'Database',
					url: '/database',
					icon: <Database className="size-4" />,
				},
				{
					type: 'page' as const,
					name: 'Error Handling',
					url: '/error-handling',
					icon: <Ban className="size-4" />,
				},
				{
					type: 'page' as const,
					name: 'Hooks',
					url: '/hooks',
					icon: <RefreshCcwDot className="size-4" />,
				},
				{
					type: 'page' as const,
					name: 'Integrations',
					url: '/integrations',
					icon: <Plug className="size-4" />,
				},
				{
					type: 'page' as const,
					name: 'Multi-Tenancy',
					url: '/multi-tenancy',
					icon: <Users className="size-4" />,
				},
				{
					type: 'page' as const,
					name: 'Typescript',
					url: '/typescript',
					icon: <BicepsFlexed className="size-4" />,
				},
				{
					type: 'page' as const,
					name: 'Webhooks',
					url: '/webhooks',
					icon: <PhoneIncoming className="size-4" />,
				},
			],
		},
		{
			type: 'folder' as const,
			name: 'Plugins',
			icon: <Puzzle className="size-4" />,
			defaultOpen: false,
			children: [
				{
					type: 'folder' as const,
					name: 'Slack',
					icon: <MessageSquare className="size-4" />,
					children: [
						{
							type: 'page' as const,
							name: 'Webhooks',
							url: '/webhooks',
							icon: <PhoneIncoming className="size-4" />,
						},
					],
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
					<RootProvider theme={{ defaultTheme: 'dark', enableSystem: false }}>
						<DocsLayout
							tree={tree}
							nav={{ title: 'Corsair' }}
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
