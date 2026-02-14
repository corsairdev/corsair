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
import IntroductionDoc from '@/content/getting-started/introduction.mdx';
// Guides
import CreateYourOwnPlugin from '@/content/guides/create-your-own-plugin.mdx';
import PluginCredentialsGuide from '@/content/guides/plugin-credentials.mdx';
import GithubApiEndpointsDoc from '@/content/plugins/github/api-endpoints.mdx';
import GithubDatabaseDoc from '@/content/plugins/github/database.mdx';
import GithubErrorHandlersDoc from '@/content/plugins/github/error-handlers.mdx';
import GithubGetCredentialsDoc from '@/content/plugins/github/get-credentials.mdx';
import GithubDoc from '@/content/plugins/github/main.mdx';
import GithubWebhooksDoc from '@/content/plugins/github/webhooks.mdx';
import GmailApiEndpointsDoc from '@/content/plugins/gmail/api-endpoints.mdx';
import GmailDatabaseDoc from '@/content/plugins/gmail/database.mdx';
import GmailErrorHandlersDoc from '@/content/plugins/gmail/error-handlers.mdx';
import GmailGetCredentialsDoc from '@/content/plugins/gmail/get-credentials.mdx';
import GmailDoc from '@/content/plugins/gmail/main.mdx';
import GmailWebhooksDoc from '@/content/plugins/gmail/webhooks.mdx';
import GoogleCalendarApiEndpointsDoc from '@/content/plugins/googlecalendar/api-endpoints.mdx';
import GoogleCalendarDatabaseDoc from '@/content/plugins/googlecalendar/database.mdx';
import GoogleCalendarErrorHandlersDoc from '@/content/plugins/googlecalendar/error-handlers.mdx';
import GoogleCalendarGetCredentialsDoc from '@/content/plugins/googlecalendar/get-credentials.mdx';
import GoogleCalendarDoc from '@/content/plugins/googlecalendar/main.mdx';
import GoogleCalendarWebhooksDoc from '@/content/plugins/googlecalendar/webhooks.mdx';
import GoogleDriveApiEndpointsDoc from '@/content/plugins/googledrive/api-endpoints.mdx';
import GoogleDriveDatabaseDoc from '@/content/plugins/googledrive/database.mdx';
import GoogleDriveErrorHandlersDoc from '@/content/plugins/googledrive/error-handlers.mdx';
import GoogleDriveGetCredentialsDoc from '@/content/plugins/googledrive/get-credentials.mdx';
import GoogleDriveDoc from '@/content/plugins/googledrive/main.mdx';
import GoogleDriveWebhooksDoc from '@/content/plugins/googledrive/webhooks.mdx';
import GoogleSheetsApiEndpointsDoc from '@/content/plugins/googlesheets/api-endpoints.mdx';
import GoogleSheetsDatabaseDoc from '@/content/plugins/googlesheets/database.mdx';
import GoogleSheetsErrorHandlersDoc from '@/content/plugins/googlesheets/error-handlers.mdx';
import GoogleSheetsGetCredentialsDoc from '@/content/plugins/googlesheets/get-credentials.mdx';
import GoogleSheetsDoc from '@/content/plugins/googlesheets/main.mdx';
import GoogleSheetsWebhooksDoc from '@/content/plugins/googlesheets/webhooks.mdx';
import HubSpotApiEndpointsDoc from '@/content/plugins/hubspot/api-endpoints.mdx';
import HubSpotDatabaseDoc from '@/content/plugins/hubspot/database.mdx';
import HubSpotErrorHandlersDoc from '@/content/plugins/hubspot/error-handlers.mdx';
import HubSpotGetCredentialsDoc from '@/content/plugins/hubspot/get-credentials.mdx';
import HubSpotDoc from '@/content/plugins/hubspot/main.mdx';
import HubSpotWebhooksDoc from '@/content/plugins/hubspot/webhooks.mdx';
import LinearApiEndpointsDoc from '@/content/plugins/linear/api-endpoints.mdx';
import LinearDatabaseDoc from '@/content/plugins/linear/database.mdx';
import LinearErrorHandlersDoc from '@/content/plugins/linear/error-handlers.mdx';
import LinearGetCredentialsDoc from '@/content/plugins/linear/get-credentials.mdx';
import LinearDoc from '@/content/plugins/linear/main.mdx';
import LinearWebhooksDoc from '@/content/plugins/linear/webhooks.mdx';
import PostHogApiEndpointsDoc from '@/content/plugins/posthog/api-endpoints.mdx';
import PostHogDatabaseDoc from '@/content/plugins/posthog/database.mdx';
import PostHogErrorHandlersDoc from '@/content/plugins/posthog/error-handlers.mdx';
import PostHogGetCredentialsDoc from '@/content/plugins/posthog/get-credentials.mdx';
import PostHogDoc from '@/content/plugins/posthog/main.mdx';
import PostHogWebhooksDoc from '@/content/plugins/posthog/webhooks.mdx';
import ResendApiEndpointsDoc from '@/content/plugins/resend/api-endpoints.mdx';
import ResendDatabaseDoc from '@/content/plugins/resend/database.mdx';
import ResendErrorHandlersDoc from '@/content/plugins/resend/error-handlers.mdx';
import ResendGetCredentialsDoc from '@/content/plugins/resend/get-credentials.mdx';
import ResendDoc from '@/content/plugins/resend/main.mdx';
import ResendWebhooksDoc from '@/content/plugins/resend/webhooks.mdx';
import SlackApiEndpointsDoc from '@/content/plugins/slack/api-endpoints.mdx';
import SlackDatabaseDoc from '@/content/plugins/slack/database.mdx';
import SlackErrorHandlersDoc from '@/content/plugins/slack/error-handlers.mdx';
import SlackGetCredentialsDoc from '@/content/plugins/slack/get-credentials.mdx';
// Plugins
import SlackDoc from '@/content/plugins/slack/main.mdx';
import SlackWebhooksDoc from '@/content/plugins/slack/webhooks.mdx';
import { extractTOC } from '@/lib/toc';
import { useMDXComponents } from '@/mdx-components';

interface PageProps {
	params: Promise<{ slug?: string[] }>;
}

const pages = {
	index: {
		Component: IntroductionDoc,
		title: 'Introduction',
		description:
			'The Vibe Coding SDK - Build type-safe full-stack TypeScript apps with natural language',
	},
	comparison: {
		Component: ComparisonDoc,
		title: 'Comparison',
		description: 'How Corsair compares to other solutions',
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
		title: 'Slack',
		description: 'Extend Corsair to Slack Integrations',
	},
	'plugins/slack/api-endpoints': {
		Component: SlackApiEndpointsDoc,
		title: 'Slack API Endpoints',
		description: 'Complete reference for all Slack API endpoints',
	},
	'plugins/slack/webhooks': {
		Component: SlackWebhooksDoc,
		title: 'Slack Webhooks',
		description: 'All available Slack webhook events',
	},
	'plugins/slack/database': {
		Component: SlackDatabaseDoc,
		title: 'Slack Database Schema',
		description: 'Database entities and querying synced Slack data',
	},
	'plugins/slack/error-handlers': {
		Component: SlackErrorHandlersDoc,
		title: 'Slack Error Handlers',
		description: 'Built-in and custom error handling for Slack',
	},
	'plugins/slack/get-credentials': {
		Component: SlackGetCredentialsDoc,
		title: 'Get Credentials',
		description: 'Step-by-step instructions for obtaining Slack credentials',
	},
	'plugins/linear': {
		Component: LinearDoc,
		title: 'Linear',
		description: 'Integrate Linear with Corsair',
	},
	'plugins/linear/api-endpoints': {
		Component: LinearApiEndpointsDoc,
		title: 'Linear API Endpoints',
		description: 'Complete reference for all Linear API endpoints',
	},
	'plugins/linear/webhooks': {
		Component: LinearWebhooksDoc,
		title: 'Linear Webhooks',
		description: 'All available Linear webhook events',
	},
	'plugins/linear/database': {
		Component: LinearDatabaseDoc,
		title: 'Linear Database Schema',
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
		title: 'GitHub',
		description:
			'Integrate GitHub repositories, issues, pull requests, and releases',
	},
	'plugins/github/get-credentials': {
		Component: GithubGetCredentialsDoc,
		title: 'Get Credentials',
		description: 'Step-by-step instructions for obtaining GitHub credentials',
	},
	'plugins/github/api-endpoints': {
		Component: GithubApiEndpointsDoc,
		title: 'GitHub API Endpoints',
		description: 'Complete reference for all GitHub API endpoints',
	},
	'plugins/github/webhooks': {
		Component: GithubWebhooksDoc,
		title: 'GitHub Webhooks',
		description: 'All available GitHub webhook events',
	},
	'plugins/github/database': {
		Component: GithubDatabaseDoc,
		title: 'GitHub Database Schema',
		description: 'Database entities and querying synced GitHub data',
	},
	'plugins/github/error-handlers': {
		Component: GithubErrorHandlersDoc,
		title: 'GitHub Error Handlers',
		description: 'Built-in and custom error handling for GitHub',
	},
	'plugins/gmail': {
		Component: GmailDoc,
		title: 'Gmail',
		description: 'Integrate Gmail messaging, labels, drafts, and threads',
	},
	'plugins/gmail/get-credentials': {
		Component: GmailGetCredentialsDoc,
		title: 'Get Credentials',
		description: 'Step-by-step instructions for obtaining Gmail credentials',
	},
	'plugins/gmail/api-endpoints': {
		Component: GmailApiEndpointsDoc,
		title: 'Gmail API Endpoints',
		description: 'Complete reference for all Gmail API endpoints',
	},
	'plugins/gmail/webhooks': {
		Component: GmailWebhooksDoc,
		title: 'Gmail Webhooks',
		description: 'All available Gmail webhook events',
	},
	'plugins/gmail/database': {
		Component: GmailDatabaseDoc,
		title: 'Gmail Database Schema',
		description: 'Database entities and querying synced Gmail data',
	},
	'plugins/gmail/error-handlers': {
		Component: GmailErrorHandlersDoc,
		title: 'Gmail Error Handlers',
		description: 'Built-in and custom error handling for Gmail',
	},
	'plugins/googlesheets': {
		Component: GoogleSheetsDoc,
		title: 'Google Sheets',
		description: 'Integrate Google Sheets spreadsheets and data management',
	},
	'plugins/googlesheets/get-credentials': {
		Component: GoogleSheetsGetCredentialsDoc,
		title: 'Get Credentials',
		description:
			'Step-by-step instructions for obtaining Google Sheets credentials',
	},
	'plugins/googlesheets/api-endpoints': {
		Component: GoogleSheetsApiEndpointsDoc,
		title: 'Google Sheets API Endpoints',
		description: 'Complete reference for all Google Sheets API endpoints',
	},
	'plugins/googlesheets/webhooks': {
		Component: GoogleSheetsWebhooksDoc,
		title: 'Google Sheets Webhooks',
		description: 'All available Google Sheets webhook events',
	},
	'plugins/googlesheets/database': {
		Component: GoogleSheetsDatabaseDoc,
		title: 'Google Sheets Database Schema',
		description: 'Database entities and querying synced Google Sheets data',
	},
	'plugins/googlesheets/error-handlers': {
		Component: GoogleSheetsErrorHandlersDoc,
		title: 'Google Sheets Error Handlers',
		description: 'Built-in and custom error handling for Google Sheets',
	},
	'plugins/googledrive': {
		Component: GoogleDriveDoc,
		title: 'Google Drive',
		description: 'Integrate Google Drive files, folders, and shared drives',
	},
	'plugins/googledrive/get-credentials': {
		Component: GoogleDriveGetCredentialsDoc,
		title: 'Get Credentials',
		description:
			'Step-by-step instructions for obtaining Google Drive credentials',
	},
	'plugins/googledrive/api-endpoints': {
		Component: GoogleDriveApiEndpointsDoc,
		title: 'Google Drive API Endpoints',
		description: 'Complete reference for all Google Drive API endpoints',
	},
	'plugins/googledrive/webhooks': {
		Component: GoogleDriveWebhooksDoc,
		title: 'Google Drive Webhooks',
		description: 'All available Google Drive webhook events',
	},
	'plugins/googledrive/database': {
		Component: GoogleDriveDatabaseDoc,
		title: 'Google Drive Database Schema',
		description: 'Database entities and querying synced Google Drive data',
	},
	'plugins/googledrive/error-handlers': {
		Component: GoogleDriveErrorHandlersDoc,
		title: 'Google Drive Error Handlers',
		description: 'Built-in and custom error handling for Google Drive',
	},
	'plugins/googlecalendar': {
		Component: GoogleCalendarDoc,
		title: 'Google Calendar',
		description: 'Integrate Google Calendar events and availability',
	},
	'plugins/googlecalendar/get-credentials': {
		Component: GoogleCalendarGetCredentialsDoc,
		title: 'Get Credentials',
		description:
			'Step-by-step instructions for obtaining Google Calendar credentials',
	},
	'plugins/googlecalendar/api-endpoints': {
		Component: GoogleCalendarApiEndpointsDoc,
		title: 'Google Calendar API Endpoints',
		description: 'Complete reference for all Google Calendar API endpoints',
	},
	'plugins/googlecalendar/webhooks': {
		Component: GoogleCalendarWebhooksDoc,
		title: 'Google Calendar Webhooks',
		description: 'All available Google Calendar webhook events',
	},
	'plugins/googlecalendar/database': {
		Component: GoogleCalendarDatabaseDoc,
		title: 'Google Calendar Database Schema',
		description: 'Database entities and querying synced Google Calendar data',
	},
	'plugins/googlecalendar/error-handlers': {
		Component: GoogleCalendarErrorHandlersDoc,
		title: 'Google Calendar Error Handlers',
		description: 'Built-in and custom error handling for Google Calendar',
	},
	'plugins/hubspot': {
		Component: HubSpotDoc,
		title: 'HubSpot',
		description:
			'Integrate HubSpot CRM contacts, companies, deals, and tickets',
	},
	'plugins/hubspot/get-credentials': {
		Component: HubSpotGetCredentialsDoc,
		title: 'Get Credentials',
		description: 'Step-by-step instructions for obtaining HubSpot credentials',
	},
	'plugins/hubspot/api-endpoints': {
		Component: HubSpotApiEndpointsDoc,
		title: 'HubSpot API Endpoints',
		description: 'Complete reference for all HubSpot API endpoints',
	},
	'plugins/hubspot/webhooks': {
		Component: HubSpotWebhooksDoc,
		title: 'HubSpot Webhooks',
		description: 'All available HubSpot webhook events',
	},
	'plugins/hubspot/database': {
		Component: HubSpotDatabaseDoc,
		title: 'HubSpot Database Schema',
		description: 'Database entities and querying synced HubSpot data',
	},
	'plugins/hubspot/error-handlers': {
		Component: HubSpotErrorHandlersDoc,
		title: 'HubSpot Error Handlers',
		description: 'Built-in and custom error handling for HubSpot',
	},
	'plugins/posthog': {
		Component: PostHogDoc,
		title: 'PostHog',
		description: 'Integrate PostHog analytics and event tracking',
	},
	'plugins/posthog/get-credentials': {
		Component: PostHogGetCredentialsDoc,
		title: 'Get Credentials',
		description: 'Step-by-step instructions for obtaining PostHog credentials',
	},
	'plugins/posthog/api-endpoints': {
		Component: PostHogApiEndpointsDoc,
		title: 'PostHog API Endpoints',
		description: 'Complete reference for all PostHog API endpoints',
	},
	'plugins/posthog/webhooks': {
		Component: PostHogWebhooksDoc,
		title: 'PostHog Webhooks',
		description: 'All available PostHog webhook events',
	},
	'plugins/posthog/database': {
		Component: PostHogDatabaseDoc,
		title: 'PostHog Database Schema',
		description: 'Database entities and querying synced PostHog data',
	},
	'plugins/posthog/error-handlers': {
		Component: PostHogErrorHandlersDoc,
		title: 'PostHog Error Handlers',
		description: 'Built-in and custom error handling for PostHog',
	},
	'plugins/resend': {
		Component: ResendDoc,
		title: 'Resend',
		description: 'Integrate Resend email sending and domain management',
	},
	'plugins/resend/get-credentials': {
		Component: ResendGetCredentialsDoc,
		title: 'Get Credentials',
		description: 'Step-by-step instructions for obtaining Resend credentials',
	},
	'plugins/resend/api-endpoints': {
		Component: ResendApiEndpointsDoc,
		title: 'Resend API Endpoints',
		description: 'Complete reference for all Resend API endpoints',
	},
	'plugins/resend/webhooks': {
		Component: ResendWebhooksDoc,
		title: 'Resend Webhooks',
		description: 'All available Resend webhook events',
	},
	'plugins/resend/database': {
		Component: ResendDatabaseDoc,
		title: 'Resend Database Schema',
		description: 'Database entities and querying synced Resend data',
	},
	'plugins/resend/error-handlers': {
		Component: ResendErrorHandlersDoc,
		title: 'Resend Error Handlers',
		description: 'Built-in and custom error handling for Resend',
	},
	'guides/create-your-own-plugin': {
		Component: CreateYourOwnPlugin,
		title: 'Create Your Own Plugin',
		description: 'Create your own plugin for Corsair',
	},
	'guides/plugin-credentials': {
		Component: PluginCredentialsGuide,
		title: 'Plugin Credentials Guide',
		description:
			'Step-by-step instructions for obtaining credentials for all plugins',
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
			{/* @ts-expect-error - React types version mismatch */}
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
