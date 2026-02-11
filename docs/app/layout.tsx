import 'fumadocs-ui/style.css';
import './globals.css';
import { NextProvider } from 'fumadocs-core/framework/next';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { RootProvider } from 'fumadocs-ui/provider';
import {
	AlertTriangle,
	Ban,
	BarChart3,
	BicepsFlexed,
	BookOpen,
	Building2,
	Calendar,
	CheckSquare,
	Code2,
	Database,
	Download,
	FileSpreadsheet,
	Folder,
	GitBranch,
	Key,
	Layers,
	Mail,
	MessageSquare,
	PhoneIncoming,
	Plug,
	Puzzle,
	RefreshCcwDot,
	Rocket,
	ScanFace,
	Send,
	Table2,
	Users,
	Webhook,
	Zap,
} from 'lucide-react';

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
			name: 'Guides',
			icon: <BookOpen className="size-4" />,
			defaultOpen: false,
			children: [
				{
					type: 'page' as const,
					name: 'Create Your Own Plugin',
					url: '/guides/create-your-own-plugin',
					icon: <Plug className="size-4" />,
				},
				{
					type: 'page' as const,
					name: 'Plugin Credentials Guide',
					url: '/guides/plugin-credentials',
					icon: <Key className="size-4" />,
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
							name: 'Basics',
							url: '/plugins/slack',
							icon: <BookOpen className="size-4" />,
						},
						{
							type: 'page' as const,
							name: 'Get Credentials',
							url: '/plugins/slack/get-credentials',
							icon: <Key className="size-4" />,
						},
						{
							type: 'page' as const,
							name: 'API Endpoints',
							url: '/plugins/slack/api-endpoints',
							icon: <Code2 className="size-4" />,
						},
						{
							type: 'page' as const,
							name: 'Webhooks',
							url: '/plugins/slack/webhooks',
							icon: <Webhook className="size-4" />,
						},
						{
							type: 'page' as const,
							name: 'Database',
							url: '/plugins/slack/database',
							icon: <Table2 className="size-4" />,
						},
						{
							type: 'page' as const,
							name: 'Error Handlers',
							url: '/plugins/slack/error-handlers',
							icon: <AlertTriangle className="size-4" />,
						},
					],
				},
				{
					type: 'folder' as const,
					name: 'GitHub',
					icon: <GitBranch className="size-4" />,
					children: [
						{
							type: 'page' as const,
							name: 'Basics',
							url: '/plugins/github',
							icon: <BookOpen className="size-4" />,
						},
						{
							type: 'page' as const,
							name: 'Get Credentials',
							url: '/plugins/github/get-credentials',
							icon: <Key className="size-4" />,
						},
					],
				},
				{
					type: 'folder' as const,
					name: 'Gmail',
					icon: <Mail className="size-4" />,
					children: [
						{
							type: 'page' as const,
							name: 'Basics',
							url: '/plugins/gmail',
							icon: <BookOpen className="size-4" />,
						},
						{
							type: 'page' as const,
							name: 'Get Credentials',
							url: '/plugins/gmail/get-credentials',
							icon: <Key className="size-4" />,
						},
					],
				},
				{
					type: 'folder' as const,
					name: 'Google Sheets',
					icon: <FileSpreadsheet className="size-4" />,
					children: [
						{
							type: 'page' as const,
							name: 'Basics',
							url: '/plugins/googlesheets',
							icon: <BookOpen className="size-4" />,
						},
						{
							type: 'page' as const,
							name: 'Get Credentials',
							url: '/plugins/googlesheets/get-credentials',
							icon: <Key className="size-4" />,
						},
					],
				},
				{
					type: 'folder' as const,
					name: 'Google Drive',
					icon: <Folder className="size-4" />,
					children: [
						{
							type: 'page' as const,
							name: 'Basics',
							url: '/plugins/googledrive',
							icon: <BookOpen className="size-4" />,
						},
						{
							type: 'page' as const,
							name: 'Get Credentials',
							url: '/plugins/googledrive/get-credentials',
							icon: <Key className="size-4" />,
						},
					],
				},
				{
					type: 'folder' as const,
					name: 'Google Calendar',
					icon: <Calendar className="size-4" />,
					children: [
						{
							type: 'page' as const,
							name: 'Basics',
							url: '/plugins/googlecalendar',
							icon: <BookOpen className="size-4" />,
						},
						{
							type: 'page' as const,
							name: 'Get Credentials',
							url: '/plugins/googlecalendar/get-credentials',
							icon: <Key className="size-4" />,
						},
					],
				},
				{
					type: 'folder' as const,
					name: 'HubSpot',
					icon: <Building2 className="size-4" />,
					children: [
						{
							type: 'page' as const,
							name: 'Basics',
							url: '/plugins/hubspot',
							icon: <BookOpen className="size-4" />,
						},
						{
							type: 'page' as const,
							name: 'Get Credentials',
							url: '/plugins/hubspot/get-credentials',
							icon: <Key className="size-4" />,
						},
					],
				},
				{
					type: 'folder' as const,
					name: 'Linear',
					icon: <CheckSquare className="size-4" />,
					children: [
						{
							type: 'page' as const,
							name: 'Basics',
							url: '/plugins/linear',
							icon: <BookOpen className="size-4" />,
						},
						{
							type: 'page' as const,
							name: 'Get Credentials',
							url: '/plugins/linear/get-credentials',
							icon: <Key className="size-4" />,
						},
						{
							type: 'page' as const,
							name: 'API Endpoints',
							url: '/plugins/linear/api-endpoints',
							icon: <Code2 className="size-4" />,
						},
						{
							type: 'page' as const,
							name: 'Webhooks',
							url: '/plugins/linear/webhooks',
							icon: <Webhook className="size-4" />,
						},
						{
							type: 'page' as const,
							name: 'Database',
							url: '/plugins/linear/database',
							icon: <Table2 className="size-4" />,
						},
						{
							type: 'page' as const,
							name: 'Error Handlers',
							url: '/plugins/linear/error-handlers',
							icon: <AlertTriangle className="size-4" />,
						},
					],
				},
				{
					type: 'folder' as const,
					name: 'PostHog',
					icon: <BarChart3 className="size-4" />,
					children: [
						{
							type: 'page' as const,
							name: 'Basics',
							url: '/plugins/posthog',
							icon: <BookOpen className="size-4" />,
						},
						{
							type: 'page' as const,
							name: 'Get Credentials',
							url: '/plugins/posthog/get-credentials',
							icon: <Key className="size-4" />,
						},
					],
				},
				{
					type: 'folder' as const,
					name: 'Resend',
					icon: <Send className="size-4" />,
					children: [
						{
							type: 'page' as const,
							name: 'Basics',
							url: '/plugins/resend',
							icon: <BookOpen className="size-4" />,
						},
						{
							type: 'page' as const,
							name: 'Get Credentials',
							url: '/plugins/resend/get-credentials',
							icon: <Key className="size-4" />,
						},
					],
				},
			],
		},
	],
};

export default function RootLayout({ children }) {
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
							{children}
						</DocsLayout>
					</RootProvider>
				</NextProvider>
			</body>
		</html>
	);
}
