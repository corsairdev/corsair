import { DocsBody, DocsPage } from 'fumadocs-ui/page';
import { notFound } from 'next/navigation';
// Concepts
import ApiDoc from '@/content/concepts/api.mdx';
import AuthDoc from '@/content/concepts/auth.mdx';
import DatabaseDoc from '@/content/concepts/database.mdx';
import ErrorHandlingDoc from '@/content/concepts/error-handling.mdx';
import HooksDoc from '@/content/concepts/hooks.mdx';
import IntegrationsDoc from '@/content/concepts/integrations.mdx';
import MultiTenancyDoc from '@/content/concepts/multi-tenancy.mdx';
import TypescriptDoc from '@/content/concepts/typescript.mdx';
import WebhooksDoc from '@/content/concepts/webhooks.mdx';
import ComparisonDoc from '@/content/getting-started/comparison.mdx';
// Getting Started
import InstallationDoc from '@/content/getting-started/installation.mdx';
import IntroductionDoc from '@/content/getting-started/introduction.mdx';
import QuickStartDoc from '@/content/getting-started/quick-start.mdx';
// Guides
import CreateYourOwnPlugin from '@/content/guides/create-your-own-plugin.mdx';
import DashboardGuide from '@/content/guides/dashboard.mdx';
import HatchetGuide from '@/content/guides/hatchet.mdx';
import InngestGuide from '@/content/guides/inngest.mdx';
import PluginCredentialsGuide from '@/content/guides/plugin-credentials.mdx';
import TemporalGuide from '@/content/guides/temporal.mdx';
import TriggerDevGuide from '@/content/guides/trigger-dev.mdx';
import WebhooksGuide from '@/content/guides/webhooks.mdx';
import WorkflowsGuide from '@/content/guides/workflows.mdx';
// MCP Adapters
import McpAnthropicSdkDoc from '@/content/mcp-adapters/anthropic-sdk.mdx';
import McpClaudeCodeDoc from '@/content/mcp-adapters/claude-code.mdx';
import McpClaudeSdkDoc from '@/content/mcp-adapters/claude-sdk.mdx';
import McpCursorDoc from '@/content/mcp-adapters/cursor.mdx';
import McpMastraDoc from '@/content/mcp-adapters/mastra.mdx';
import McpOpenAIDoc from '@/content/mcp-adapters/openai.mdx';
import McpOpenAIAgentsDoc from '@/content/mcp-adapters/openai-agents.mdx';
import McpVercelAiDoc from '@/content/mcp-adapters/vercel-ai.mdx';
import AhrefsDatabaseDoc from '@/content/plugins/ahrefs/database.mdx';
import AhrefsGetCredentialsDoc from '@/content/plugins/ahrefs/get-credentials.mdx';
import AhrefsDoc from '@/content/plugins/ahrefs/overview.mdx';
import AirtableApiEndpointsDoc from '@/content/plugins/airtable/api.mdx';
import AirtableDatabaseDoc from '@/content/plugins/airtable/database.mdx';
import AirtableErrorHandlersDoc from '@/content/plugins/airtable/error-handlers.mdx';
import AirtableDoc from '@/content/plugins/airtable/overview.mdx';
import AirtableWebhooksDoc from '@/content/plugins/airtable/webhooks.mdx';
import AmplitudeApiEndpointsDoc from '@/content/plugins/amplitude/api.mdx';
import AmplitudeDatabaseDoc from '@/content/plugins/amplitude/database.mdx';
import AmplitudeErrorHandlersDoc from '@/content/plugins/amplitude/error-handlers.mdx';
import AmplitudeDoc from '@/content/plugins/amplitude/overview.mdx';
import AmplitudeWebhooksDoc from '@/content/plugins/amplitude/webhooks.mdx';
import AsanaDatabaseDoc from '@/content/plugins/asana/database.mdx';
import AsanaGetCredentialsDoc from '@/content/plugins/asana/get-credentials.mdx';
import AsanaDoc from '@/content/plugins/asana/overview.mdx';
import BoxDatabaseDoc from '@/content/plugins/box/database.mdx';
import BoxGetCredentialsDoc from '@/content/plugins/box/get-credentials.mdx';
import BoxDoc from '@/content/plugins/box/overview.mdx';
import CalApiEndpointsDoc from '@/content/plugins/cal/api.mdx';
import CalDatabaseDoc from '@/content/plugins/cal/database.mdx';
import CalErrorHandlersDoc from '@/content/plugins/cal/error-handlers.mdx';
import CalDoc from '@/content/plugins/cal/overview.mdx';
import CalWebhooksDoc from '@/content/plugins/cal/webhooks.mdx';
import CalendlyDatabaseDoc from '@/content/plugins/calendly/database.mdx';
import CalendlyGetCredentialsDoc from '@/content/plugins/calendly/get-credentials.mdx';
import CalendlyDoc from '@/content/plugins/calendly/overview.mdx';
import CursorDatabaseDoc from '@/content/plugins/cursor/database.mdx';
import CursorGetCredentialsDoc from '@/content/plugins/cursor/get-credentials.mdx';
import CursorDoc from '@/content/plugins/cursor/overview.mdx';
import DiscordApiEndpointsDoc from '@/content/plugins/discord/api.mdx';
import DiscordDatabaseDoc from '@/content/plugins/discord/database.mdx';
import DiscordErrorHandlersDoc from '@/content/plugins/discord/error-handlers.mdx';
import DiscordDoc from '@/content/plugins/discord/overview.mdx';
import DiscordWebhooksDoc from '@/content/plugins/discord/webhooks.mdx';
import DropboxDatabaseDoc from '@/content/plugins/dropbox/database.mdx';
import DropboxGetCredentialsDoc from '@/content/plugins/dropbox/get-credentials.mdx';
import DropboxDoc from '@/content/plugins/dropbox/overview.mdx';
import ExaDatabaseDoc from '@/content/plugins/exa/database.mdx';
import ExaGetCredentialsDoc from '@/content/plugins/exa/get-credentials.mdx';
import ExaDoc from '@/content/plugins/exa/overview.mdx';
import FigmaDatabaseDoc from '@/content/plugins/figma/database.mdx';
import FigmaGetCredentialsDoc from '@/content/plugins/figma/get-credentials.mdx';
import FigmaDoc from '@/content/plugins/figma/overview.mdx';
import FirefliesDatabaseDoc from '@/content/plugins/fireflies/database.mdx';
import FirefliesGetCredentialsDoc from '@/content/plugins/fireflies/get-credentials.mdx';
import FirefliesDoc from '@/content/plugins/fireflies/overview.mdx';
import GithubApiEndpointsDoc from '@/content/plugins/github/api.mdx';
import GithubDatabaseDoc from '@/content/plugins/github/database.mdx';
import GithubErrorHandlersDoc from '@/content/plugins/github/error-handlers.mdx';
import GithubGetCredentialsDoc from '@/content/plugins/github/get-credentials.mdx';
import GithubDoc from '@/content/plugins/github/overview.mdx';
import GithubWebhooksDoc from '@/content/plugins/github/webhooks.mdx';
import GmailApiEndpointsDoc from '@/content/plugins/gmail/api.mdx';
import GmailDatabaseDoc from '@/content/plugins/gmail/database.mdx';
import GmailErrorHandlersDoc from '@/content/plugins/gmail/error-handlers.mdx';
import GmailGetCredentialsDoc from '@/content/plugins/gmail/get-credentials.mdx';
import GmailDoc from '@/content/plugins/gmail/overview.mdx';
import GmailWebhooksDoc from '@/content/plugins/gmail/webhooks.mdx';
import GoogleCalendarApiEndpointsDoc from '@/content/plugins/googlecalendar/api.mdx';
import GoogleCalendarDatabaseDoc from '@/content/plugins/googlecalendar/database.mdx';
import GoogleCalendarErrorHandlersDoc from '@/content/plugins/googlecalendar/error-handlers.mdx';
import GoogleCalendarGetCredentialsDoc from '@/content/plugins/googlecalendar/get-credentials.mdx';
import GoogleCalendarDoc from '@/content/plugins/googlecalendar/overview.mdx';
import GoogleCalendarWebhooksDoc from '@/content/plugins/googlecalendar/webhooks.mdx';
import GoogleDriveApiEndpointsDoc from '@/content/plugins/googledrive/api.mdx';
import GoogleDriveDatabaseDoc from '@/content/plugins/googledrive/database.mdx';
import GoogleDriveErrorHandlersDoc from '@/content/plugins/googledrive/error-handlers.mdx';
import GoogleDriveGetCredentialsDoc from '@/content/plugins/googledrive/get-credentials.mdx';
import GoogleDriveDoc from '@/content/plugins/googledrive/overview.mdx';
import GoogleDriveWebhooksDoc from '@/content/plugins/googledrive/webhooks.mdx';
import GoogleSheetsApiEndpointsDoc from '@/content/plugins/googlesheets/api.mdx';
import GoogleSheetsDatabaseDoc from '@/content/plugins/googlesheets/database.mdx';
import GoogleSheetsErrorHandlersDoc from '@/content/plugins/googlesheets/error-handlers.mdx';
import GoogleSheetsGetCredentialsDoc from '@/content/plugins/googlesheets/get-credentials.mdx';
import GoogleSheetsDoc from '@/content/plugins/googlesheets/overview.mdx';
import GoogleSheetsWebhooksDoc from '@/content/plugins/googlesheets/webhooks.mdx';
import HackerNewsDatabaseDoc from '@/content/plugins/hackernews/database.mdx';
import HackerNewsGetCredentialsDoc from '@/content/plugins/hackernews/get-credentials.mdx';
import HackerNewsDoc from '@/content/plugins/hackernews/overview.mdx';
import HubSpotApiEndpointsDoc from '@/content/plugins/hubspot/api.mdx';
import HubSpotDatabaseDoc from '@/content/plugins/hubspot/database.mdx';
import HubSpotErrorHandlersDoc from '@/content/plugins/hubspot/error-handlers.mdx';
import HubSpotGetCredentialsDoc from '@/content/plugins/hubspot/get-credentials.mdx';
import HubSpotDoc from '@/content/plugins/hubspot/overview.mdx';
import HubSpotWebhooksDoc from '@/content/plugins/hubspot/webhooks.mdx';
import IntercomDatabaseDoc from '@/content/plugins/intercom/database.mdx';
import IntercomGetCredentialsDoc from '@/content/plugins/intercom/get-credentials.mdx';
import IntercomDoc from '@/content/plugins/intercom/overview.mdx';
import JiraDatabaseDoc from '@/content/plugins/jira/database.mdx';
import JiraGetCredentialsDoc from '@/content/plugins/jira/get-credentials.mdx';
import JiraDoc from '@/content/plugins/jira/overview.mdx';
import LinearApiEndpointsDoc from '@/content/plugins/linear/api.mdx';
import LinearDatabaseDoc from '@/content/plugins/linear/database.mdx';
import LinearErrorHandlersDoc from '@/content/plugins/linear/error-handlers.mdx';
import LinearGetCredentialsDoc from '@/content/plugins/linear/get-credentials.mdx';
import LinearDoc from '@/content/plugins/linear/overview.mdx';
import LinearWebhooksDoc from '@/content/plugins/linear/webhooks.mdx';
import MondayDatabaseDoc from '@/content/plugins/monday/database.mdx';
import MondayGetCredentialsDoc from '@/content/plugins/monday/get-credentials.mdx';
import MondayDoc from '@/content/plugins/monday/overview.mdx';
import NotionApiEndpointsDoc from '@/content/plugins/notion/api.mdx';
import NotionDatabaseDoc from '@/content/plugins/notion/database.mdx';
import NotionErrorHandlersDoc from '@/content/plugins/notion/error-handlers.mdx';
import NotionDoc from '@/content/plugins/notion/overview.mdx';
import NotionWebhooksDoc from '@/content/plugins/notion/webhooks.mdx';
import OnedriveDatabaseDoc from '@/content/plugins/onedrive/database.mdx';
import OnedriveGetCredentialsDoc from '@/content/plugins/onedrive/get-credentials.mdx';
import OnedriveDoc from '@/content/plugins/onedrive/overview.mdx';
import OuraApiEndpointsDoc from '@/content/plugins/oura/api.mdx';
import OuraDatabaseDoc from '@/content/plugins/oura/database.mdx';
import OuraErrorHandlersDoc from '@/content/plugins/oura/error-handlers.mdx';
import OuraDoc from '@/content/plugins/oura/overview.mdx';
import OuraWebhooksDoc from '@/content/plugins/oura/webhooks.mdx';
import OutlookDatabaseDoc from '@/content/plugins/outlook/database.mdx';
import OutlookGetCredentialsDoc from '@/content/plugins/outlook/get-credentials.mdx';
import OutlookDoc from '@/content/plugins/outlook/overview.mdx';
import PagerDutyApiEndpointsDoc from '@/content/plugins/pagerduty/api.mdx';
import PagerDutyDatabaseDoc from '@/content/plugins/pagerduty/database.mdx';
import PagerDutyErrorHandlersDoc from '@/content/plugins/pagerduty/error-handlers.mdx';
import PagerDutyDoc from '@/content/plugins/pagerduty/overview.mdx';
import PagerDutyWebhooksDoc from '@/content/plugins/pagerduty/webhooks.mdx';
import PostHogApiEndpointsDoc from '@/content/plugins/posthog/api.mdx';
import PostHogDatabaseDoc from '@/content/plugins/posthog/database.mdx';
import PostHogErrorHandlersDoc from '@/content/plugins/posthog/error-handlers.mdx';
import PostHogGetCredentialsDoc from '@/content/plugins/posthog/get-credentials.mdx';
import PostHogDoc from '@/content/plugins/posthog/overview.mdx';
import PostHogWebhooksDoc from '@/content/plugins/posthog/webhooks.mdx';
import ResendApiEndpointsDoc from '@/content/plugins/resend/api.mdx';
import ResendDatabaseDoc from '@/content/plugins/resend/database.mdx';
import ResendErrorHandlersDoc from '@/content/plugins/resend/error-handlers.mdx';
import ResendGetCredentialsDoc from '@/content/plugins/resend/get-credentials.mdx';
import ResendDoc from '@/content/plugins/resend/overview.mdx';
import ResendWebhooksDoc from '@/content/plugins/resend/webhooks.mdx';
import SentryApiEndpointsDoc from '@/content/plugins/sentry/api.mdx';
import SentryDatabaseDoc from '@/content/plugins/sentry/database.mdx';
import SentryErrorHandlersDoc from '@/content/plugins/sentry/error-handlers.mdx';
import SentryDoc from '@/content/plugins/sentry/overview.mdx';
import SentryWebhooksDoc from '@/content/plugins/sentry/webhooks.mdx';
import SlackApiEndpointsDoc from '@/content/plugins/slack/api.mdx';
import SlackDatabaseDoc from '@/content/plugins/slack/database.mdx';
import SlackGetCredentialsDoc from '@/content/plugins/slack/get-credentials.mdx';
// Plugins
import SlackDoc from '@/content/plugins/slack/overview.mdx';
import SlackWebhooksDoc from '@/content/plugins/slack/webhooks.mdx';
import SpotifyApiEndpointsDoc from '@/content/plugins/spotify/api.mdx';
import SpotifyDatabaseDoc from '@/content/plugins/spotify/database.mdx';
import SpotifyErrorHandlersDoc from '@/content/plugins/spotify/error-handlers.mdx';
import SpotifyDoc from '@/content/plugins/spotify/overview.mdx';
import StravaDatabaseDoc from '@/content/plugins/strava/database.mdx';
import StravaGetCredentialsDoc from '@/content/plugins/strava/get-credentials.mdx';
import StravaDoc from '@/content/plugins/strava/overview.mdx';
import StripeDatabaseDoc from '@/content/plugins/stripe/database.mdx';
import StripeGetCredentialsDoc from '@/content/plugins/stripe/get-credentials.mdx';
import StripeDoc from '@/content/plugins/stripe/overview.mdx';
import TavilyApiEndpointsDoc from '@/content/plugins/tavily/api.mdx';
import TavilyDatabaseDoc from '@/content/plugins/tavily/database.mdx';
import TavilyErrorHandlersDoc from '@/content/plugins/tavily/error-handlers.mdx';
import TavilyDoc from '@/content/plugins/tavily/overview.mdx';
import TavilyWebhooksDoc from '@/content/plugins/tavily/webhooks.mdx';
import TelegramDatabaseDoc from '@/content/plugins/telegram/database.mdx';
import TelegramGetCredentialsDoc from '@/content/plugins/telegram/get-credentials.mdx';
import TelegramDoc from '@/content/plugins/telegram/overview.mdx';
import TodoistApiEndpointsDoc from '@/content/plugins/todoist/api.mdx';
import TodoistDatabaseDoc from '@/content/plugins/todoist/database.mdx';
import TodoistErrorHandlersDoc from '@/content/plugins/todoist/error-handlers.mdx';
import TodoistDoc from '@/content/plugins/todoist/overview.mdx';
import TodoistWebhooksDoc from '@/content/plugins/todoist/webhooks.mdx';
import TrelloDatabaseDoc from '@/content/plugins/trello/database.mdx';
import TrelloGetCredentialsDoc from '@/content/plugins/trello/get-credentials.mdx';
import TrelloDoc from '@/content/plugins/trello/overview.mdx';
import TwitterDatabaseDoc from '@/content/plugins/twitter/database.mdx';
import TwitterGetCredentialsDoc from '@/content/plugins/twitter/get-credentials.mdx';
import TwitterDoc from '@/content/plugins/twitter/overview.mdx';
import TwitterApiIOApiEndpointsDoc from '@/content/plugins/twitterapiio/api.mdx';
import TwitterApiIODatabaseDoc from '@/content/plugins/twitterapiio/database.mdx';
import TwitterApiIOErrorHandlersDoc from '@/content/plugins/twitterapiio/error-handlers.mdx';
import TwitterApiIODoc from '@/content/plugins/twitterapiio/overview.mdx';
import TwitterApiIOWebhooksDoc from '@/content/plugins/twitterapiio/webhooks.mdx';
import TypeformDatabaseDoc from '@/content/plugins/typeform/database.mdx';
import TypeformGetCredentialsDoc from '@/content/plugins/typeform/get-credentials.mdx';
import TypeformDoc from '@/content/plugins/typeform/overview.mdx';
import ZoomDatabaseDoc from '@/content/plugins/zoom/database.mdx';
import ZoomGetCredentialsDoc from '@/content/plugins/zoom/get-credentials.mdx';
import ZoomDoc from '@/content/plugins/zoom/overview.mdx';
import { extractTOC } from '@/lib/toc';
import { useMDXComponents } from '@/mdx-components';

interface PageProps {
	params: Promise<{ slug?: string[] }>;
}

const pages = {
	index: {
		Component: IntroductionDoc,
		title: 'Introduction',
		description: 'The Integration Layer for AI Agents',
	},
	'quick-start': {
		Component: QuickStartDoc,
		title: 'Quick Start',
		description: 'Go from zero to a working GitHub integration in five minutes',
	},
	installation: {
		Component: InstallationDoc,
		title: 'Installation',
		description:
			'Install Corsair, migrate your database, and run your first prompt',
	},
	comparison: {
		Component: ComparisonDoc,
		title: 'Comparison',
		description: 'How Corsair compares to other solutions',
	},
	'mcp-adapters/claude-sdk': {
		Component: McpClaudeSdkDoc,
		title: 'Claude Agent SDK',
		description: 'Connect Corsair to the Anthropic Claude Agent SDK',
	},
	'mcp-adapters/anthropic-sdk': {
		Component: McpAnthropicSdkDoc,
		title: 'Anthropic SDK',
		description: 'Connect Corsair to the Anthropic SDK using tool use',
	},
	'mcp-adapters/openai-agents': {
		Component: McpOpenAIAgentsDoc,
		title: 'OpenAI Agents',
		description: 'Connect Corsair to the OpenAI Agents SDK',
	},
	'mcp-adapters/vercel-ai': {
		Component: McpVercelAiDoc,
		title: 'Vercel AI SDK',
		description: 'Connect Corsair to the Vercel AI SDK over HTTP',
	},
	'mcp-adapters/openai': {
		Component: McpOpenAIDoc,
		title: 'OpenAI',
		description: 'Connect Corsair to the OpenAI API over HTTP',
	},
	'mcp-adapters/mastra': {
		Component: McpMastraDoc,
		title: 'Mastra',
		description: 'Connect Corsair to the Mastra agent framework',
	},
	'mcp-adapters/claude-code': {
		Component: McpClaudeCodeDoc,
		title: 'Claude Code',
		description: 'Connect Corsair to Claude Code as a stdio MCP server',
	},
	'mcp-adapters/cursor': {
		Component: McpCursorDoc,
		title: 'Cursor',
		description: 'Connect Corsair to Cursor as a stdio MCP server',
	},
	api: {
		Component: ApiDoc,
		title: 'API Concepts',
		description: 'Understanding the Corsair approach to natural language APIs',
	},
	auth: {
		Component: AuthDoc,
		title: 'Authentication',
		description: 'Authentication and authorization in Corsair',
	},
	database: {
		Component: DatabaseDoc,
		title: 'Database Concepts',
		description: 'Supported databases, ORMs, and schema detection',
	},
	'error-handling': {
		Component: ErrorHandlingDoc,
		title: 'Error Handling',
		description: 'Handling errors gracefully in Corsair',
	},
	hooks: {
		Component: HooksDoc,
		title: 'Hooks',
		description: 'React hooks for Corsair',
	},
	integrations: {
		Component: IntegrationsDoc,
		title: 'Integrations',
		description: 'Integrating Corsair with your stack',
	},
	'multi-tenancy': {
		Component: MultiTenancyDoc,
		title: 'Multi-Tenancy',
		description: 'Building multi-tenant applications with Corsair',
	},
	typescript: {
		Component: TypescriptDoc,
		title: 'TypeScript Concepts',
		description: 'Full end-to-end type safety from database to UI',
	},
	webhooks: {
		Component: WebhooksDoc,
		title: 'Webhooks',
		description: 'Handling webhooks in Corsair',
	},
	'plugins/slack': {
		Component: SlackDoc,
		title: 'Overview',
		description: 'Extend Corsair to Slack Integrations',
	},
	'plugins/slack/api': {
		Component: SlackApiEndpointsDoc,
		title: 'API',
		description: 'Complete reference for all Slack API endpoints',
	},
	'plugins/slack/webhooks': {
		Component: SlackWebhooksDoc,
		title: 'Webhooks',
		description: 'All available Slack webhook events',
	},
	'plugins/slack/database': {
		Component: SlackDatabaseDoc,
		title: 'Database',
		description: 'Database entities and querying synced Slack data',
	},
	'plugins/slack/get-credentials': {
		Component: SlackGetCredentialsDoc,
		title: 'Get Credentials',
		description: 'Step-by-step instructions for obtaining Slack credentials',
	},
	'plugins/linear': {
		Component: LinearDoc,
		title: 'Overview',
		description: 'Integrate Linear with Corsair',
	},
	'plugins/linear/api': {
		Component: LinearApiEndpointsDoc,
		title: 'API',
		description: 'Complete reference for all Linear API endpoints',
	},
	'plugins/linear/webhooks': {
		Component: LinearWebhooksDoc,
		title: 'Webhooks',
		description: 'All available Linear webhook events',
	},
	'plugins/linear/database': {
		Component: LinearDatabaseDoc,
		title: 'Database',
		description: 'Database entities and querying synced data',
	},
	'plugins/linear/error-handlers': {
		Component: LinearErrorHandlersDoc,
		title: 'Linear Error Handlers',
		description: 'Built-in and custom error handling',
	},
	'plugins/linear/get-credentials': {
		Component: LinearGetCredentialsDoc,
		title: 'Get Credentials',
		description: 'Step-by-step instructions for obtaining Linear credentials',
	},
	'plugins/github': {
		Component: GithubDoc,
		title: 'Overview',
		description:
			'Integrate GitHub repositories, issues, pull requests, and releases',
	},
	'plugins/github/get-credentials': {
		Component: GithubGetCredentialsDoc,
		title: 'Get Credentials',
		description: 'Step-by-step instructions for obtaining GitHub credentials',
	},
	'plugins/github/api': {
		Component: GithubApiEndpointsDoc,
		title: 'API',
		description: 'Complete reference for all GitHub API endpoints',
	},
	'plugins/github/webhooks': {
		Component: GithubWebhooksDoc,
		title: 'Webhooks',
		description: 'All available GitHub webhook events',
	},
	'plugins/github/database': {
		Component: GithubDatabaseDoc,
		title: 'Database',
		description: 'Database entities and querying synced GitHub data',
	},
	'plugins/github/error-handlers': {
		Component: GithubErrorHandlersDoc,
		title: 'GitHub Error Handlers',
		description: 'Built-in and custom error handling for GitHub',
	},
	'plugins/gmail': {
		Component: GmailDoc,
		title: 'Overview',
		description: 'Integrate Gmail messaging, labels, drafts, and threads',
	},
	'plugins/gmail/get-credentials': {
		Component: GmailGetCredentialsDoc,
		title: 'Get Credentials',
		description: 'Step-by-step instructions for obtaining Gmail credentials',
	},
	'plugins/gmail/api': {
		Component: GmailApiEndpointsDoc,
		title: 'API',
		description: 'Complete reference for all Gmail API endpoints',
	},
	'plugins/gmail/webhooks': {
		Component: GmailWebhooksDoc,
		title: 'Webhooks',
		description: 'All available Gmail webhook events',
	},
	'plugins/gmail/database': {
		Component: GmailDatabaseDoc,
		title: 'Database',
		description: 'Database entities and querying synced Gmail data',
	},
	'plugins/gmail/error-handlers': {
		Component: GmailErrorHandlersDoc,
		title: 'Gmail Error Handlers',
		description: 'Built-in and custom error handling for Gmail',
	},
	'plugins/googlesheets': {
		Component: GoogleSheetsDoc,
		title: 'Overview',
		description: 'Integrate Google Sheets spreadsheets and data management',
	},
	'plugins/googlesheets/get-credentials': {
		Component: GoogleSheetsGetCredentialsDoc,
		title: 'Get Credentials',
		description:
			'Step-by-step instructions for obtaining Google Sheets credentials',
	},
	'plugins/googlesheets/api': {
		Component: GoogleSheetsApiEndpointsDoc,
		title: 'API',
		description: 'Complete reference for all Google Sheets API endpoints',
	},
	'plugins/googlesheets/webhooks': {
		Component: GoogleSheetsWebhooksDoc,
		title: 'Webhooks',
		description: 'All available Google Sheets webhook events',
	},
	'plugins/googlesheets/database': {
		Component: GoogleSheetsDatabaseDoc,
		title: 'Database',
		description: 'Database entities and querying synced Google Sheets data',
	},
	'plugins/googlesheets/error-handlers': {
		Component: GoogleSheetsErrorHandlersDoc,
		title: 'Google Sheets Error Handlers',
		description: 'Built-in and custom error handling for Google Sheets',
	},
	'plugins/googledrive': {
		Component: GoogleDriveDoc,
		title: 'Overview',
		description: 'Integrate Google Drive files, folders, and shared drives',
	},
	'plugins/googledrive/get-credentials': {
		Component: GoogleDriveGetCredentialsDoc,
		title: 'Get Credentials',
		description:
			'Step-by-step instructions for obtaining Google Drive credentials',
	},
	'plugins/googledrive/api': {
		Component: GoogleDriveApiEndpointsDoc,
		title: 'API',
		description: 'Complete reference for all Google Drive API endpoints',
	},
	'plugins/googledrive/webhooks': {
		Component: GoogleDriveWebhooksDoc,
		title: 'Webhooks',
		description: 'All available Google Drive webhook events',
	},
	'plugins/googledrive/database': {
		Component: GoogleDriveDatabaseDoc,
		title: 'Database',
		description: 'Database entities and querying synced Google Drive data',
	},
	'plugins/googledrive/error-handlers': {
		Component: GoogleDriveErrorHandlersDoc,
		title: 'Google Drive Error Handlers',
		description: 'Built-in and custom error handling for Google Drive',
	},
	'plugins/googlecalendar': {
		Component: GoogleCalendarDoc,
		title: 'Overview',
		description: 'Integrate Google Calendar events and availability',
	},
	'plugins/googlecalendar/get-credentials': {
		Component: GoogleCalendarGetCredentialsDoc,
		title: 'Get Credentials',
		description:
			'Step-by-step instructions for obtaining Google Calendar credentials',
	},
	'plugins/googlecalendar/api': {
		Component: GoogleCalendarApiEndpointsDoc,
		title: 'API',
		description: 'Complete reference for all Google Calendar API endpoints',
	},
	'plugins/googlecalendar/webhooks': {
		Component: GoogleCalendarWebhooksDoc,
		title: 'Webhooks',
		description: 'All available Google Calendar webhook events',
	},
	'plugins/googlecalendar/database': {
		Component: GoogleCalendarDatabaseDoc,
		title: 'Database',
		description: 'Database entities and querying synced Google Calendar data',
	},
	'plugins/googlecalendar/error-handlers': {
		Component: GoogleCalendarErrorHandlersDoc,
		title: 'Google Calendar Error Handlers',
		description: 'Built-in and custom error handling for Google Calendar',
	},
	'plugins/hubspot': {
		Component: HubSpotDoc,
		title: 'Overview',
		description:
			'Integrate HubSpot CRM contacts, companies, deals, and tickets',
	},
	'plugins/hubspot/get-credentials': {
		Component: HubSpotGetCredentialsDoc,
		title: 'Get Credentials',
		description: 'Step-by-step instructions for obtaining HubSpot credentials',
	},
	'plugins/hubspot/api': {
		Component: HubSpotApiEndpointsDoc,
		title: 'API',
		description: 'Complete reference for all HubSpot API endpoints',
	},
	'plugins/hubspot/webhooks': {
		Component: HubSpotWebhooksDoc,
		title: 'Webhooks',
		description: 'All available HubSpot webhook events',
	},
	'plugins/hubspot/database': {
		Component: HubSpotDatabaseDoc,
		title: 'Database',
		description: 'Database entities and querying synced HubSpot data',
	},
	'plugins/hubspot/error-handlers': {
		Component: HubSpotErrorHandlersDoc,
		title: 'HubSpot Error Handlers',
		description: 'Built-in and custom error handling for HubSpot',
	},
	'plugins/posthog': {
		Component: PostHogDoc,
		title: 'Overview',
		description: 'Integrate PostHog analytics and event tracking',
	},
	'plugins/posthog/get-credentials': {
		Component: PostHogGetCredentialsDoc,
		title: 'Get Credentials',
		description: 'Step-by-step instructions for obtaining PostHog credentials',
	},
	'plugins/posthog/api': {
		Component: PostHogApiEndpointsDoc,
		title: 'API',
		description: 'Complete reference for all PostHog API endpoints',
	},
	'plugins/posthog/webhooks': {
		Component: PostHogWebhooksDoc,
		title: 'Webhooks',
		description: 'All available PostHog webhook events',
	},
	'plugins/posthog/database': {
		Component: PostHogDatabaseDoc,
		title: 'Database',
		description: 'Database entities and querying synced PostHog data',
	},
	'plugins/posthog/error-handlers': {
		Component: PostHogErrorHandlersDoc,
		title: 'PostHog Error Handlers',
		description: 'Built-in and custom error handling for PostHog',
	},
	'plugins/resend': {
		Component: ResendDoc,
		title: 'Overview',
		description: 'Integrate Resend email sending and domain management',
	},
	'plugins/resend/get-credentials': {
		Component: ResendGetCredentialsDoc,
		title: 'Get Credentials',
		description: 'Step-by-step instructions for obtaining Resend credentials',
	},
	'plugins/resend/api': {
		Component: ResendApiEndpointsDoc,
		title: 'API',
		description: 'Complete reference for all Resend API endpoints',
	},
	'plugins/resend/webhooks': {
		Component: ResendWebhooksDoc,
		title: 'Webhooks',
		description: 'All available Resend webhook events',
	},
	'plugins/resend/database': {
		Component: ResendDatabaseDoc,
		title: 'Database',
		description: 'Database entities and querying synced Resend data',
	},
	'plugins/resend/error-handlers': {
		Component: ResendErrorHandlersDoc,
		title: 'Resend Error Handlers',
		description: 'Built-in and custom error handling for Resend',
	},
	'plugins/discord': {
		Component: DiscordDoc,
		title: 'Overview',
		description:
			'Integrate Discord messages, threads, reactions, and interactions',
	},
	'plugins/discord/api': {
		Component: DiscordApiEndpointsDoc,
		title: 'API',
		description: 'Complete reference for all Discord API endpoints',
	},
	'plugins/discord/webhooks': {
		Component: DiscordWebhooksDoc,
		title: 'Webhooks',
		description: 'All available Discord webhook events',
	},
	'plugins/discord/database': {
		Component: DiscordDatabaseDoc,
		title: 'Database',
		description: 'Database entities and querying synced Discord data',
	},
	'plugins/discord/error-handlers': {
		Component: DiscordErrorHandlersDoc,
		title: 'Discord Error Handlers',
		description: 'Built-in and custom error handling for Discord',
	},
	'plugins/pagerduty': {
		Component: PagerDutyDoc,
		title: 'Overview',
		description:
			'Integrate PagerDuty incidents, alerts, and on-call management',
	},
	'plugins/pagerduty/api': {
		Component: PagerDutyApiEndpointsDoc,
		title: 'API',
		description: 'Complete reference for all PagerDuty API endpoints',
	},
	'plugins/pagerduty/webhooks': {
		Component: PagerDutyWebhooksDoc,
		title: 'Webhooks',
		description: 'All available PagerDuty webhook events',
	},
	'plugins/pagerduty/database': {
		Component: PagerDutyDatabaseDoc,
		title: 'Database',
		description: 'Database entities and querying synced PagerDuty data',
	},
	'plugins/pagerduty/error-handlers': {
		Component: PagerDutyErrorHandlersDoc,
		title: 'PagerDuty Error Handlers',
		description: 'Built-in and custom error handling for PagerDuty',
	},
	'plugins/oura': {
		Component: OuraDoc,
		title: 'Overview',
		description: 'Integrate Oura Ring health and sleep tracking data',
	},
	'plugins/oura/api': {
		Component: OuraApiEndpointsDoc,
		title: 'API',
		description: 'Complete reference for all Oura API endpoints',
	},
	'plugins/oura/webhooks': {
		Component: OuraWebhooksDoc,
		title: 'Webhooks',
		description: 'All available Oura webhook events',
	},
	'plugins/oura/database': {
		Component: OuraDatabaseDoc,
		title: 'Database',
		description: 'Database entities and querying synced Oura data',
	},
	'plugins/oura/error-handlers': {
		Component: OuraErrorHandlersDoc,
		title: 'Oura Error Handlers',
		description: 'Built-in and custom error handling for Oura',
	},
	'plugins/tavily': {
		Component: TavilyDoc,
		title: 'Overview',
		description: 'Integrate Tavily AI-powered web search',
	},
	'plugins/tavily/api': {
		Component: TavilyApiEndpointsDoc,
		title: 'API',
		description: 'Complete reference for all Tavily API endpoints',
	},
	'plugins/tavily/webhooks': {
		Component: TavilyWebhooksDoc,
		title: 'Webhooks',
		description: 'Webhooks for the Tavily plugin',
	},
	'plugins/tavily/database': {
		Component: TavilyDatabaseDoc,
		title: 'Database',
		description: 'Database schema for the Tavily plugin',
	},
	'plugins/tavily/error-handlers': {
		Component: TavilyErrorHandlersDoc,
		title: 'Tavily Error Handlers',
		description: 'Built-in and custom error handling for Tavily',
	},
	'plugins/spotify': {
		Component: SpotifyDoc,
		title: 'Overview',
		description: 'Integrate Spotify music playback, library, and playlists',
	},
	'plugins/spotify/api': {
		Component: SpotifyApiEndpointsDoc,
		title: 'API',
		description: 'Complete reference for all Spotify API endpoints',
	},
	'plugins/spotify/database': {
		Component: SpotifyDatabaseDoc,
		title: 'Database',
		description: 'Database entities and querying synced Spotify data',
	},
	'plugins/spotify/error-handlers': {
		Component: SpotifyErrorHandlersDoc,
		title: 'Spotify Error Handlers',
		description: 'Built-in and custom error handling for Spotify',
	},
	'plugins/amplitude': {
		Component: AmplitudeDoc,
		title: 'Overview',
		description: 'Integrate Amplitude analytics, events, and cohorts',
	},
	'plugins/amplitude/api': {
		Component: AmplitudeApiEndpointsDoc,
		title: 'API',
		description: 'Complete reference for all Amplitude API endpoints',
	},
	'plugins/amplitude/webhooks': {
		Component: AmplitudeWebhooksDoc,
		title: 'Webhooks',
		description: 'All available Amplitude webhook events',
	},
	'plugins/amplitude/database': {
		Component: AmplitudeDatabaseDoc,
		title: 'Database',
		description: 'Database entities and querying synced Amplitude data',
	},
	'plugins/amplitude/error-handlers': {
		Component: AmplitudeErrorHandlersDoc,
		title: 'Amplitude Error Handlers',
		description: 'Built-in and custom error handling for Amplitude',
	},
	'plugins/cal': {
		Component: CalDoc,
		title: 'Overview',
		description: 'Integrate Cal.com scheduling and booking management',
	},
	'plugins/cal/api': {
		Component: CalApiEndpointsDoc,
		title: 'API',
		description: 'Complete reference for all Cal.com API endpoints',
	},
	'plugins/cal/webhooks': {
		Component: CalWebhooksDoc,
		title: 'Webhooks',
		description: 'All available Cal.com webhook events',
	},
	'plugins/cal/database': {
		Component: CalDatabaseDoc,
		title: 'Database',
		description: 'Database entities and querying synced Cal.com data',
	},
	'plugins/cal/error-handlers': {
		Component: CalErrorHandlersDoc,
		title: 'Cal.com Error Handlers',
		description: 'Built-in and custom error handling for Cal.com',
	},
	'plugins/notion': {
		Component: NotionDoc,
		title: 'Overview',
		description: 'Integrate Notion pages, databases, and workspace content',
	},
	'plugins/notion/api': {
		Component: NotionApiEndpointsDoc,
		title: 'API',
		description: 'Complete reference for all Notion API endpoints',
	},
	'plugins/notion/webhooks': {
		Component: NotionWebhooksDoc,
		title: 'Webhooks',
		description: 'All available Notion webhook events',
	},
	'plugins/notion/database': {
		Component: NotionDatabaseDoc,
		title: 'Database',
		description: 'Database entities and querying synced Notion data',
	},
	'plugins/notion/error-handlers': {
		Component: NotionErrorHandlersDoc,
		title: 'Notion Error Handlers',
		description: 'Built-in and custom error handling for Notion',
	},
	'plugins/airtable': {
		Component: AirtableDoc,
		title: 'Overview',
		description: 'Integrate Airtable bases, tables, and records',
	},
	'plugins/airtable/api': {
		Component: AirtableApiEndpointsDoc,
		title: 'API',
		description: 'Complete reference for all Airtable API endpoints',
	},
	'plugins/airtable/webhooks': {
		Component: AirtableWebhooksDoc,
		title: 'Webhooks',
		description: 'All available Airtable webhook events',
	},
	'plugins/airtable/database': {
		Component: AirtableDatabaseDoc,
		title: 'Database',
		description: 'Database entities and querying synced Airtable data',
	},
	'plugins/airtable/error-handlers': {
		Component: AirtableErrorHandlersDoc,
		title: 'Airtable Error Handlers',
		description: 'Built-in and custom error handling for Airtable',
	},
	'plugins/todoist': {
		Component: TodoistDoc,
		title: 'Overview',
		description:
			'Integrate Todoist tasks, projects, and productivity workflows',
	},
	'plugins/todoist/api': {
		Component: TodoistApiEndpointsDoc,
		title: 'API',
		description: 'Complete reference for all Todoist API endpoints',
	},
	'plugins/todoist/webhooks': {
		Component: TodoistWebhooksDoc,
		title: 'Webhooks',
		description: 'All available Todoist webhook events',
	},
	'plugins/todoist/database': {
		Component: TodoistDatabaseDoc,
		title: 'Database',
		description: 'Database entities and querying synced Todoist data',
	},
	'plugins/todoist/error-handlers': {
		Component: TodoistErrorHandlersDoc,
		title: 'Todoist Error Handlers',
		description: 'Built-in and custom error handling for Todoist',
	},
	'plugins/twitterapiio': {
		Component: TwitterApiIODoc,
		title: 'Overview',
		description:
			'Integrate Twitter via twitterapi.io for tweets, users, and communities',
	},
	'plugins/twitterapiio/api': {
		Component: TwitterApiIOApiEndpointsDoc,
		title: 'Twitter API IO Endpoints',
		description: 'Complete reference for all Twitter API IO endpoints',
	},
	'plugins/twitterapiio/webhooks': {
		Component: TwitterApiIOWebhooksDoc,
		title: 'Webhooks',
		description: 'All available Twitter API IO webhook events',
	},
	'plugins/twitterapiio/database': {
		Component: TwitterApiIODatabaseDoc,
		title: 'Database',
		description: 'Database entities and querying synced Twitter data',
	},
	'plugins/twitterapiio/error-handlers': {
		Component: TwitterApiIOErrorHandlersDoc,
		title: 'Twitter API IO Error Handlers',
		description: 'Built-in and custom error handling for Twitter API IO',
	},
	'plugins/sentry': {
		Component: SentryDoc,
		title: 'Overview',
		description: 'Integrate Sentry error monitoring, issues, and releases',
	},
	'plugins/sentry/api': {
		Component: SentryApiEndpointsDoc,
		title: 'API',
		description: 'Complete reference for all Sentry API endpoints',
	},
	'plugins/sentry/webhooks': {
		Component: SentryWebhooksDoc,
		title: 'Webhooks',
		description: 'All available Sentry webhook events',
	},
	'plugins/sentry/database': {
		Component: SentryDatabaseDoc,
		title: 'Database',
		description: 'Database entities and querying synced Sentry data',
	},
	'plugins/sentry/error-handlers': {
		Component: SentryErrorHandlersDoc,
		title: 'Sentry Error Handlers',
		description: 'Built-in and custom error handling for Sentry',
	},
	'plugins/twitter': {
		Component: TwitterDoc,
		title: 'Overview',
		description: 'Manage Twitter tweets, users, and timelines',
	},
	'plugins/twitter/get-credentials': {
		Component: TwitterGetCredentialsDoc,
		title: 'Get Credentials',
		description: 'Step-by-step instructions for obtaining Twitter credentials',
	},
	'plugins/twitter/database': {
		Component: TwitterDatabaseDoc,
		title: 'Database',
		description: 'Database entities and querying synced Twitter data',
	},
	'plugins/monday': {
		Component: MondayDoc,
		title: 'Overview',
		description: 'Manage Monday.com boards, items, groups, and updates',
	},
	'plugins/monday/get-credentials': {
		Component: MondayGetCredentialsDoc,
		title: 'Get Credentials',
		description:
			'Step-by-step instructions for obtaining Monday.com credentials',
	},
	'plugins/monday/database': {
		Component: MondayDatabaseDoc,
		title: 'Database',
		description: 'Database entities and querying synced Monday.com data',
	},
	'plugins/hackernews': {
		Component: HackerNewsDoc,
		title: 'Overview',
		description: 'Access Hacker News stories, comments, and user data',
	},
	'plugins/hackernews/get-credentials': {
		Component: HackerNewsGetCredentialsDoc,
		title: 'Get Credentials',
		description: 'Hacker News is a public API — no credentials required',
	},
	'plugins/hackernews/database': {
		Component: HackerNewsDatabaseDoc,
		title: 'Database',
		description: 'Database entities and querying synced Hacker News data',
	},
	'plugins/box': {
		Component: BoxDoc,
		title: 'Overview',
		description: 'Manage Box files, folders, and collaborations',
	},
	'plugins/box/get-credentials': {
		Component: BoxGetCredentialsDoc,
		title: 'Get Credentials',
		description: 'Step-by-step instructions for obtaining Box credentials',
	},
	'plugins/box/database': {
		Component: BoxDatabaseDoc,
		title: 'Database',
		description: 'Database entities and querying synced Box data',
	},
	'plugins/exa': {
		Component: ExaDoc,
		title: 'Overview',
		description: 'AI-powered web search, content extraction, and websets',
	},
	'plugins/exa/get-credentials': {
		Component: ExaGetCredentialsDoc,
		title: 'Get Credentials',
		description: 'Step-by-step instructions for obtaining Exa credentials',
	},
	'plugins/exa/database': {
		Component: ExaDatabaseDoc,
		title: 'Database',
		description: 'Database entities and querying synced Exa data',
	},
	'plugins/intercom': {
		Component: IntercomDoc,
		title: 'Overview',
		description: 'Manage Intercom contacts, conversations, and companies',
	},
	'plugins/intercom/get-credentials': {
		Component: IntercomGetCredentialsDoc,
		title: 'Get Credentials',
		description: 'Step-by-step instructions for obtaining Intercom credentials',
	},
	'plugins/intercom/database': {
		Component: IntercomDatabaseDoc,
		title: 'Database',
		description: 'Database entities and querying synced Intercom data',
	},
	'plugins/typeform': {
		Component: TypeformDoc,
		title: 'Overview',
		description: 'Manage Typeform forms, responses, and workspaces',
	},
	'plugins/typeform/get-credentials': {
		Component: TypeformGetCredentialsDoc,
		title: 'Get Credentials',
		description: 'Step-by-step instructions for obtaining Typeform credentials',
	},
	'plugins/typeform/database': {
		Component: TypeformDatabaseDoc,
		title: 'Database',
		description: 'Database entities and querying synced Typeform data',
	},
	'plugins/fireflies': {
		Component: FirefliesDoc,
		title: 'Overview',
		description: 'Access Fireflies meeting transcripts and summaries',
	},
	'plugins/fireflies/get-credentials': {
		Component: FirefliesGetCredentialsDoc,
		title: 'Get Credentials',
		description:
			'Step-by-step instructions for obtaining Fireflies credentials',
	},
	'plugins/fireflies/database': {
		Component: FirefliesDatabaseDoc,
		title: 'Database',
		description: 'Database entities and querying synced Fireflies data',
	},
	'plugins/jira': {
		Component: JiraDoc,
		title: 'Overview',
		description: 'Manage Jira issues, projects, sprints, and comments',
	},
	'plugins/jira/get-credentials': {
		Component: JiraGetCredentialsDoc,
		title: 'Get Credentials',
		description: 'Step-by-step instructions for obtaining Jira credentials',
	},
	'plugins/jira/database': {
		Component: JiraDatabaseDoc,
		title: 'Database',
		description: 'Database entities and querying synced Jira data',
	},
	'plugins/figma': {
		Component: FigmaDoc,
		title: 'Overview',
		description: 'Manage Figma files, comments, components, and variables',
	},
	'plugins/figma/get-credentials': {
		Component: FigmaGetCredentialsDoc,
		title: 'Get Credentials',
		description: 'Step-by-step instructions for obtaining Figma credentials',
	},
	'plugins/figma/database': {
		Component: FigmaDatabaseDoc,
		title: 'Database',
		description: 'Database entities and querying synced Figma data',
	},
	'plugins/telegram': {
		Component: TelegramDoc,
		title: 'Overview',
		description: 'Send messages and manage Telegram bot interactions',
	},
	'plugins/telegram/get-credentials': {
		Component: TelegramGetCredentialsDoc,
		title: 'Get Credentials',
		description:
			'Step-by-step instructions for obtaining Telegram bot credentials',
	},
	'plugins/telegram/database': {
		Component: TelegramDatabaseDoc,
		title: 'Database',
		description: 'Database entities and querying synced Telegram data',
	},
	'plugins/zoom': {
		Component: ZoomDoc,
		title: 'Overview',
		description: 'Manage Zoom meetings, recordings, and webinars',
	},
	'plugins/zoom/get-credentials': {
		Component: ZoomGetCredentialsDoc,
		title: 'Get Credentials',
		description: 'Step-by-step instructions for obtaining Zoom credentials',
	},
	'plugins/zoom/database': {
		Component: ZoomDatabaseDoc,
		title: 'Database',
		description: 'Database entities and querying synced Zoom data',
	},
	'plugins/dropbox': {
		Component: DropboxDoc,
		title: 'Overview',
		description: 'Manage Dropbox files, folders, and file search',
	},
	'plugins/dropbox/get-credentials': {
		Component: DropboxGetCredentialsDoc,
		title: 'Get Credentials',
		description: 'Step-by-step instructions for obtaining Dropbox credentials',
	},
	'plugins/dropbox/database': {
		Component: DropboxDatabaseDoc,
		title: 'Database',
		description: 'Database entities and querying synced Dropbox data',
	},
	'plugins/trello': {
		Component: TrelloDoc,
		title: 'Overview',
		description: 'Manage Trello boards, lists, cards, and checklists',
	},
	'plugins/trello/get-credentials': {
		Component: TrelloGetCredentialsDoc,
		title: 'Get Credentials',
		description: 'Step-by-step instructions for obtaining Trello credentials',
	},
	'plugins/trello/database': {
		Component: TrelloDatabaseDoc,
		title: 'Database',
		description: 'Database entities and querying synced Trello data',
	},
	'plugins/calendly': {
		Component: CalendlyDoc,
		title: 'Overview',
		description: 'Manage Calendly events, event types, and invitees',
	},
	'plugins/calendly/get-credentials': {
		Component: CalendlyGetCredentialsDoc,
		title: 'Get Credentials',
		description: 'Step-by-step instructions for obtaining Calendly credentials',
	},
	'plugins/calendly/database': {
		Component: CalendlyDatabaseDoc,
		title: 'Database',
		description: 'Database entities and querying synced Calendly data',
	},
	'plugins/asana': {
		Component: AsanaDoc,
		title: 'Overview',
		description: 'Manage Asana tasks, projects, sections, and teams',
	},
	'plugins/asana/get-credentials': {
		Component: AsanaGetCredentialsDoc,
		title: 'Get Credentials',
		description: 'Step-by-step instructions for obtaining Asana credentials',
	},
	'plugins/asana/database': {
		Component: AsanaDatabaseDoc,
		title: 'Database',
		description: 'Database entities and querying synced Asana data',
	},
	'plugins/stripe': {
		Component: StripeDoc,
		title: 'Overview',
		description:
			'Manage Stripe payments, customers, charges, and subscriptions',
	},
	'plugins/stripe/get-credentials': {
		Component: StripeGetCredentialsDoc,
		title: 'Get Credentials',
		description: 'Step-by-step instructions for obtaining Stripe credentials',
	},
	'plugins/stripe/database': {
		Component: StripeDatabaseDoc,
		title: 'Database',
		description: 'Database entities and querying synced Stripe data',
	},
	'plugins/ahrefs': {
		Component: AhrefsDoc,
		title: 'Overview',
		description: 'Access Ahrefs SEO data, backlinks, and keyword rankings',
	},
	'plugins/ahrefs/get-credentials': {
		Component: AhrefsGetCredentialsDoc,
		title: 'Get Credentials',
		description: 'Step-by-step instructions for obtaining Ahrefs credentials',
	},
	'plugins/ahrefs/database': {
		Component: AhrefsDatabaseDoc,
		title: 'Database',
		description: 'Database entities and querying synced Ahrefs data',
	},
	'plugins/cursor': {
		Component: CursorDoc,
		title: 'Overview',
		description: 'Access Cursor AI agent data, models, and repositories',
	},
	'plugins/cursor/get-credentials': {
		Component: CursorGetCredentialsDoc,
		title: 'Get Credentials',
		description: 'Step-by-step instructions for obtaining Cursor credentials',
	},
	'plugins/cursor/database': {
		Component: CursorDatabaseDoc,
		title: 'Database',
		description: 'Database entities and querying synced Cursor data',
	},
	'plugins/onedrive': {
		Component: OnedriveDoc,
		title: 'Overview',
		description: 'Manage OneDrive files, folders, permissions, and SharePoint',
	},
	'plugins/onedrive/get-credentials': {
		Component: OnedriveGetCredentialsDoc,
		title: 'Get Credentials',
		description: 'Step-by-step instructions for obtaining OneDrive credentials',
	},
	'plugins/onedrive/database': {
		Component: OnedriveDatabaseDoc,
		title: 'Database',
		description: 'Database entities and querying synced OneDrive data',
	},
	'plugins/outlook': {
		Component: OutlookDoc,
		title: 'Overview',
		description: 'Manage Outlook messages, calendars, contacts, and folders',
	},
	'plugins/outlook/get-credentials': {
		Component: OutlookGetCredentialsDoc,
		title: 'Get Credentials',
		description: 'Step-by-step instructions for obtaining Outlook credentials',
	},
	'plugins/outlook/database': {
		Component: OutlookDatabaseDoc,
		title: 'Database',
		description: 'Database entities and querying synced Outlook data',
	},
	'plugins/strava': {
		Component: StravaDoc,
		title: 'Overview',
		description: 'Access Strava activities, athlete data, segments, and routes',
	},
	'plugins/strava/get-credentials': {
		Component: StravaGetCredentialsDoc,
		title: 'Get Credentials',
		description: 'Step-by-step instructions for obtaining Strava credentials',
	},
	'plugins/strava/database': {
		Component: StravaDatabaseDoc,
		title: 'Database',
		description: 'Database entities and querying synced Strava data',
	},
	'guides/create-your-own-plugin': {
		Component: CreateYourOwnPlugin,
		title: 'Build a Plugin',
		description: 'Create your own plugin for Corsair',
	},
	'guides/plugin-credentials': {
		Component: PluginCredentialsGuide,
		title: 'Plugin Credentials Guide',
		description:
			'Step-by-step instructions for obtaining credentials for all plugins',
	},
	'guides/dashboard': {
		Component: DashboardGuide,
		title: 'Vibe Code Your Dashboard',
		description:
			'Scaffold a Next.js + tRPC + SQLite project and build a live GitHub dashboard',
	},
	'guides/workflows': {
		Component: WorkflowsGuide,
		title: 'Workflows',
		description:
			'Chain webhook events into multi-step automations across any plugin',
	},
	'guides/webhooks': {
		Component: WebhooksGuide,
		title: 'Webhooks',
		description: 'Handling webhooks in Corsair',
	},
	'guides/inngest': {
		Component: InngestGuide,
		title: 'Inngest',
		description:
			'Trigger durable Inngest functions from Corsair webhook events.',
	},
	'guides/temporal': {
		Component: TemporalGuide,
		title: 'Temporal',
		description: 'Start Temporal workflows from Corsair webhook events.',
	},
	'guides/trigger-dev': {
		Component: TriggerDevGuide,
		title: 'Trigger.dev',
		description:
			'Run Trigger.dev background tasks from Corsair webhook events.',
	},
	'guides/hatchet': {
		Component: HatchetGuide,
		title: 'Hatchet',
		description: 'Push Hatchet workflow events from Corsair webhook hooks.',
	},
} as const;

const mdxComponents = useMDXComponents();

export default async function Page(props: PageProps) {
	const params = await props.params;
	const slugKey = (params.slug?.join('/') || 'index') as keyof typeof pages;
	const page = pages[slugKey];

	if (!page) {
		notFound();
	}

	const MDX = page.Component;
	const toc = extractTOC(slugKey);

	return (
		<DocsPage
			toc={toc}
			tableOfContent={{
				enabled: true,
				style: 'clerk',
				single: false,
			}}
		>
			<h1 className="text-3xl font-bold mb-2">{page.title}</h1>
			{page.description && (
				<p className="text-lg text-muted-foreground mb-8">{page.description}</p>
			)}
			<DocsBody>
				<MDX components={mdxComponents} />
			</DocsBody>
		</DocsPage>
	);
}

export async function generateStaticParams() {
	return Object.keys(pages).map((slug) => ({
		slug: slug === 'index' ? undefined : slug.split('/'),
	}));
}

export async function generateMetadata(props: PageProps) {
	const params = await props.params;
	const slugKey = (params.slug?.join('/') || 'index') as keyof typeof pages;
	const page = pages[slugKey];

	if (!page) notFound();

	return {
		title: page.title,
		description: page.description,
	};
}
