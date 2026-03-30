import 'fumadocs-ui/style.css';
import './globals.css';
import { NextProvider } from 'fumadocs-core/framework/next';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { RootProvider } from 'fumadocs-ui/provider';
import {
	Activity,
	AlertTriangle,
	Ban,
	BarChart3,
	Bell,
	BicepsFlexed,
	BookOpen,
	Bot,
	Bug,
	Building2,
	Calendar,
	CalendarDays,
	CheckSquare,
	Code2,
	Database,
	Download,
	FileSpreadsheet,
	FileText,
	Folder,
	GitBranch,
	Grid3x3,
	Heart,
	Key,
	Layers,
	ListTodo,
	Mail,
	MessageCircle,
	MessageSquare,
	Music,
	PhoneIncoming,
	Plug,
	Puzzle,
	RefreshCcwDot,
	Rocket,
	ScanFace,
	Search,
	Send,
	Table2,
	TrendingUp,
	Twitter,
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
					name: 'Quick Start',
					url: '/quick-start',
					icon: <Rocket className="size-4" />,
				},
				{
					type: 'page' as const,
					name: 'Installation',
					url: '/installation',
					icon: <Download className="size-4" />,
				},
				{
					type: 'page' as const,
					name: 'Comparison',
					url: '/comparison',
					icon: <Zap className="size-4" />,
				},
			],
		},
		{
			type: 'folder' as const,
			name: 'MCP Adapters',
			icon: <Bot className="size-4" />,
			defaultOpen: false,
			children: [
				{
					type: 'page' as const,
					name: 'Claude Agent SDK',
					url: '/mcp-adapters/claude-sdk',
					icon: <Code2 className="size-4" />,
				},
				{
					type: 'page' as const,
					name: 'Anthropic SDK',
					url: '/mcp-adapters/anthropic-sdk',
					icon: <Code2 className="size-4" />,
				},
				{
					type: 'page' as const,
					name: 'OpenAI Agents',
					url: '/mcp-adapters/openai-agents',
					icon: <Code2 className="size-4" />,
				},
				{
					type: 'page' as const,
					name: 'Vercel AI SDK',
					url: '/mcp-adapters/vercel-ai',
					icon: <Code2 className="size-4" />,
				},
				{
					type: 'page' as const,
					name: 'OpenAI',
					url: '/mcp-adapters/openai',
					icon: <Code2 className="size-4" />,
				},
				{
					type: 'page' as const,
					name: 'Mastra',
					url: '/mcp-adapters/mastra',
					icon: <Code2 className="size-4" />,
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
				{
					type: 'page' as const,
					name: 'Vibe Code Your Dashboard',
					url: '/guides/dashboard',
					icon: <Grid3x3 className="size-4" />,
				},
				{
					type: 'page' as const,
					name: 'Workflows',
					url: '/guides/workflows',
					icon: <Zap className="size-4" />,
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
						{
							type: 'page' as const,
							name: 'API Endpoints',
							url: '/plugins/github/api-endpoints',
							icon: <Code2 className="size-4" />,
						},
						{
							type: 'page' as const,
							name: 'Webhooks',
							url: '/plugins/github/webhooks',
							icon: <Webhook className="size-4" />,
						},
						{
							type: 'page' as const,
							name: 'Database',
							url: '/plugins/github/database',
							icon: <Table2 className="size-4" />,
						},
						{
							type: 'page' as const,
							name: 'Error Handlers',
							url: '/plugins/github/error-handlers',
							icon: <AlertTriangle className="size-4" />,
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
						{
							type: 'page' as const,
							name: 'API Endpoints',
							url: '/plugins/gmail/api-endpoints',
							icon: <Code2 className="size-4" />,
						},
						{
							type: 'page' as const,
							name: 'Webhooks',
							url: '/plugins/gmail/webhooks',
							icon: <Webhook className="size-4" />,
						},
						{
							type: 'page' as const,
							name: 'Database',
							url: '/plugins/gmail/database',
							icon: <Table2 className="size-4" />,
						},
						{
							type: 'page' as const,
							name: 'Error Handlers',
							url: '/plugins/gmail/error-handlers',
							icon: <AlertTriangle className="size-4" />,
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
						{
							type: 'page' as const,
							name: 'API Endpoints',
							url: '/plugins/googlesheets/api-endpoints',
							icon: <Code2 className="size-4" />,
						},
						{
							type: 'page' as const,
							name: 'Webhooks',
							url: '/plugins/googlesheets/webhooks',
							icon: <Webhook className="size-4" />,
						},
						{
							type: 'page' as const,
							name: 'Database',
							url: '/plugins/googlesheets/database',
							icon: <Table2 className="size-4" />,
						},
						{
							type: 'page' as const,
							name: 'Error Handlers',
							url: '/plugins/googlesheets/error-handlers',
							icon: <AlertTriangle className="size-4" />,
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
						{
							type: 'page' as const,
							name: 'API Endpoints',
							url: '/plugins/googledrive/api-endpoints',
							icon: <Code2 className="size-4" />,
						},
						{
							type: 'page' as const,
							name: 'Webhooks',
							url: '/plugins/googledrive/webhooks',
							icon: <Webhook className="size-4" />,
						},
						{
							type: 'page' as const,
							name: 'Database',
							url: '/plugins/googledrive/database',
							icon: <Table2 className="size-4" />,
						},
						{
							type: 'page' as const,
							name: 'Error Handlers',
							url: '/plugins/googledrive/error-handlers',
							icon: <AlertTriangle className="size-4" />,
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
						{
							type: 'page' as const,
							name: 'API Endpoints',
							url: '/plugins/googlecalendar/api-endpoints',
							icon: <Code2 className="size-4" />,
						},
						{
							type: 'page' as const,
							name: 'Webhooks',
							url: '/plugins/googlecalendar/webhooks',
							icon: <Webhook className="size-4" />,
						},
						{
							type: 'page' as const,
							name: 'Database',
							url: '/plugins/googlecalendar/database',
							icon: <Table2 className="size-4" />,
						},
						{
							type: 'page' as const,
							name: 'Error Handlers',
							url: '/plugins/googlecalendar/error-handlers',
							icon: <AlertTriangle className="size-4" />,
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
						{
							type: 'page' as const,
							name: 'API Endpoints',
							url: '/plugins/hubspot/api-endpoints',
							icon: <Code2 className="size-4" />,
						},
						{
							type: 'page' as const,
							name: 'Webhooks',
							url: '/plugins/hubspot/webhooks',
							icon: <Webhook className="size-4" />,
						},
						{
							type: 'page' as const,
							name: 'Database',
							url: '/plugins/hubspot/database',
							icon: <Table2 className="size-4" />,
						},
						{
							type: 'page' as const,
							name: 'Error Handlers',
							url: '/plugins/hubspot/error-handlers',
							icon: <AlertTriangle className="size-4" />,
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
						{
							type: 'page' as const,
							name: 'API Endpoints',
							url: '/plugins/posthog/api-endpoints',
							icon: <Code2 className="size-4" />,
						},
						{
							type: 'page' as const,
							name: 'Webhooks',
							url: '/plugins/posthog/webhooks',
							icon: <Webhook className="size-4" />,
						},
						{
							type: 'page' as const,
							name: 'Database',
							url: '/plugins/posthog/database',
							icon: <Table2 className="size-4" />,
						},
						{
							type: 'page' as const,
							name: 'Error Handlers',
							url: '/plugins/posthog/error-handlers',
							icon: <AlertTriangle className="size-4" />,
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
						{
							type: 'page' as const,
							name: 'API Endpoints',
							url: '/plugins/resend/api-endpoints',
							icon: <Code2 className="size-4" />,
						},
						{
							type: 'page' as const,
							name: 'Webhooks',
							url: '/plugins/resend/webhooks',
							icon: <Webhook className="size-4" />,
						},
						{
							type: 'page' as const,
							name: 'Database',
							url: '/plugins/resend/database',
							icon: <Table2 className="size-4" />,
						},
						{
							type: 'page' as const,
							name: 'Error Handlers',
							url: '/plugins/resend/error-handlers',
							icon: <AlertTriangle className="size-4" />,
						},
					],
				},
				{
					type: 'folder' as const,
					name: 'Discord',
					icon: <MessageCircle className="size-4" />,
					children: [
						{ type: 'page' as const, name: 'Basics', url: '/plugins/discord', icon: <BookOpen className="size-4" /> },
						{ type: 'page' as const, name: 'API Endpoints', url: '/plugins/discord/api-endpoints', icon: <Code2 className="size-4" /> },
						{ type: 'page' as const, name: 'Webhooks', url: '/plugins/discord/webhooks', icon: <Webhook className="size-4" /> },
						{ type: 'page' as const, name: 'Database', url: '/plugins/discord/database', icon: <Table2 className="size-4" /> },
						{ type: 'page' as const, name: 'Error Handlers', url: '/plugins/discord/error-handlers', icon: <AlertTriangle className="size-4" /> },
					],
				},
				{
					type: 'folder' as const,
					name: 'PagerDuty',
					icon: <Bell className="size-4" />,
					children: [
						{ type: 'page' as const, name: 'Basics', url: '/plugins/pagerduty', icon: <BookOpen className="size-4" /> },
						{ type: 'page' as const, name: 'API Endpoints', url: '/plugins/pagerduty/api-endpoints', icon: <Code2 className="size-4" /> },
						{ type: 'page' as const, name: 'Webhooks', url: '/plugins/pagerduty/webhooks', icon: <Webhook className="size-4" /> },
						{ type: 'page' as const, name: 'Database', url: '/plugins/pagerduty/database', icon: <Table2 className="size-4" /> },
						{ type: 'page' as const, name: 'Error Handlers', url: '/plugins/pagerduty/error-handlers', icon: <AlertTriangle className="size-4" /> },
					],
				},
				{
					type: 'folder' as const,
					name: 'Oura Ring',
					icon: <Heart className="size-4" />,
					children: [
						{ type: 'page' as const, name: 'Basics', url: '/plugins/oura', icon: <BookOpen className="size-4" /> },
						{ type: 'page' as const, name: 'API Endpoints', url: '/plugins/oura/api-endpoints', icon: <Code2 className="size-4" /> },
						{ type: 'page' as const, name: 'Webhooks', url: '/plugins/oura/webhooks', icon: <Webhook className="size-4" /> },
						{ type: 'page' as const, name: 'Database', url: '/plugins/oura/database', icon: <Table2 className="size-4" /> },
						{ type: 'page' as const, name: 'Error Handlers', url: '/plugins/oura/error-handlers', icon: <AlertTriangle className="size-4" /> },
					],
				},
				{
					type: 'folder' as const,
					name: 'Tavily',
					icon: <Search className="size-4" />,
					children: [
						{ type: 'page' as const, name: 'Basics', url: '/plugins/tavily', icon: <BookOpen className="size-4" /> },
						{ type: 'page' as const, name: 'API Endpoints', url: '/plugins/tavily/api-endpoints', icon: <Code2 className="size-4" /> },
						{ type: 'page' as const, name: 'Webhooks', url: '/plugins/tavily/webhooks', icon: <Webhook className="size-4" /> },
						{ type: 'page' as const, name: 'Database', url: '/plugins/tavily/database', icon: <Table2 className="size-4" /> },
						{ type: 'page' as const, name: 'Error Handlers', url: '/plugins/tavily/error-handlers', icon: <AlertTriangle className="size-4" /> },
					],
				},
				{
					type: 'folder' as const,
					name: 'Spotify',
					icon: <Music className="size-4" />,
					children: [
						{ type: 'page' as const, name: 'Basics', url: '/plugins/spotify', icon: <BookOpen className="size-4" /> },
						{ type: 'page' as const, name: 'API Endpoints', url: '/plugins/spotify/api-endpoints', icon: <Code2 className="size-4" /> },
						{ type: 'page' as const, name: 'Webhooks', url: '/plugins/spotify/webhooks', icon: <Webhook className="size-4" /> },
						{ type: 'page' as const, name: 'Database', url: '/plugins/spotify/database', icon: <Table2 className="size-4" /> },
						{ type: 'page' as const, name: 'Error Handlers', url: '/plugins/spotify/error-handlers', icon: <AlertTriangle className="size-4" /> },
					],
				},
				{
					type: 'folder' as const,
					name: 'Amplitude',
					icon: <TrendingUp className="size-4" />,
					children: [
						{ type: 'page' as const, name: 'Basics', url: '/plugins/amplitude', icon: <BookOpen className="size-4" /> },
						{ type: 'page' as const, name: 'API Endpoints', url: '/plugins/amplitude/api-endpoints', icon: <Code2 className="size-4" /> },
						{ type: 'page' as const, name: 'Webhooks', url: '/plugins/amplitude/webhooks', icon: <Webhook className="size-4" /> },
						{ type: 'page' as const, name: 'Database', url: '/plugins/amplitude/database', icon: <Table2 className="size-4" /> },
						{ type: 'page' as const, name: 'Error Handlers', url: '/plugins/amplitude/error-handlers', icon: <AlertTriangle className="size-4" /> },
					],
				},
				{
					type: 'folder' as const,
					name: 'Cal.com',
					icon: <CalendarDays className="size-4" />,
					children: [
						{ type: 'page' as const, name: 'Basics', url: '/plugins/cal', icon: <BookOpen className="size-4" /> },
						{ type: 'page' as const, name: 'API Endpoints', url: '/plugins/cal/api-endpoints', icon: <Code2 className="size-4" /> },
						{ type: 'page' as const, name: 'Webhooks', url: '/plugins/cal/webhooks', icon: <Webhook className="size-4" /> },
						{ type: 'page' as const, name: 'Database', url: '/plugins/cal/database', icon: <Table2 className="size-4" /> },
						{ type: 'page' as const, name: 'Error Handlers', url: '/plugins/cal/error-handlers', icon: <AlertTriangle className="size-4" /> },
					],
				},
				{
					type: 'folder' as const,
					name: 'Notion',
					icon: <FileText className="size-4" />,
					children: [
						{ type: 'page' as const, name: 'Basics', url: '/plugins/notion', icon: <BookOpen className="size-4" /> },
						{ type: 'page' as const, name: 'API Endpoints', url: '/plugins/notion/api-endpoints', icon: <Code2 className="size-4" /> },
						{ type: 'page' as const, name: 'Webhooks', url: '/plugins/notion/webhooks', icon: <Webhook className="size-4" /> },
						{ type: 'page' as const, name: 'Database', url: '/plugins/notion/database', icon: <Table2 className="size-4" /> },
						{ type: 'page' as const, name: 'Error Handlers', url: '/plugins/notion/error-handlers', icon: <AlertTriangle className="size-4" /> },
					],
				},
				{
					type: 'folder' as const,
					name: 'Airtable',
					icon: <Grid3x3 className="size-4" />,
					children: [
						{ type: 'page' as const, name: 'Basics', url: '/plugins/airtable', icon: <BookOpen className="size-4" /> },
						{ type: 'page' as const, name: 'API Endpoints', url: '/plugins/airtable/api-endpoints', icon: <Code2 className="size-4" /> },
						{ type: 'page' as const, name: 'Webhooks', url: '/plugins/airtable/webhooks', icon: <Webhook className="size-4" /> },
						{ type: 'page' as const, name: 'Database', url: '/plugins/airtable/database', icon: <Table2 className="size-4" /> },
						{ type: 'page' as const, name: 'Error Handlers', url: '/plugins/airtable/error-handlers', icon: <AlertTriangle className="size-4" /> },
					],
				},
				{
					type: 'folder' as const,
					name: 'Todoist',
					icon: <ListTodo className="size-4" />,
					children: [
						{ type: 'page' as const, name: 'Basics', url: '/plugins/todoist', icon: <BookOpen className="size-4" /> },
						{ type: 'page' as const, name: 'API Endpoints', url: '/plugins/todoist/api-endpoints', icon: <Code2 className="size-4" /> },
						{ type: 'page' as const, name: 'Webhooks', url: '/plugins/todoist/webhooks', icon: <Webhook className="size-4" /> },
						{ type: 'page' as const, name: 'Database', url: '/plugins/todoist/database', icon: <Table2 className="size-4" /> },
						{ type: 'page' as const, name: 'Error Handlers', url: '/plugins/todoist/error-handlers', icon: <AlertTriangle className="size-4" /> },
					],
				},
				{
					type: 'folder' as const,
					name: 'Twitter API IO',
					icon: <Twitter className="size-4" />,
					children: [
						{ type: 'page' as const, name: 'Basics', url: '/plugins/twitterapiio', icon: <BookOpen className="size-4" /> },
						{ type: 'page' as const, name: 'API Endpoints', url: '/plugins/twitterapiio/api-endpoints', icon: <Code2 className="size-4" /> },
						{ type: 'page' as const, name: 'Webhooks', url: '/plugins/twitterapiio/webhooks', icon: <Webhook className="size-4" /> },
						{ type: 'page' as const, name: 'Database', url: '/plugins/twitterapiio/database', icon: <Table2 className="size-4" /> },
						{ type: 'page' as const, name: 'Error Handlers', url: '/plugins/twitterapiio/error-handlers', icon: <AlertTriangle className="size-4" /> },
					],
				},
				{
					type: 'folder' as const,
					name: 'Sentry',
					icon: <Bug className="size-4" />,
					children: [
						{ type: 'page' as const, name: 'Basics', url: '/plugins/sentry', icon: <BookOpen className="size-4" /> },
						{ type: 'page' as const, name: 'API Endpoints', url: '/plugins/sentry/api-endpoints', icon: <Code2 className="size-4" /> },
						{ type: 'page' as const, name: 'Webhooks', url: '/plugins/sentry/webhooks', icon: <Webhook className="size-4" /> },
						{ type: 'page' as const, name: 'Database', url: '/plugins/sentry/database', icon: <Table2 className="size-4" /> },
						{ type: 'page' as const, name: 'Error Handlers', url: '/plugins/sentry/error-handlers', icon: <AlertTriangle className="size-4" /> },
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
