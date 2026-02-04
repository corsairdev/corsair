import { DocsBody, DocsPage } from 'fumadocs-ui/page';
import { notFound } from 'next/navigation';
// Adapters
import DrizzleAdapterDoc from '@/content/adapters/drizzle.mdx';
import KyselyAdapterDoc from '@/content/adapters/kysely.mdx';
import PostgresqlAdapterDoc from '@/content/adapters/postgresql.mdx';
import PrismaAdapterDoc from '@/content/adapters/prisma.mdx';
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
// Plugins
import SlackDoc from '@/content/plugins/slack/main.mdx';
import SlackApiEndpointsDoc from '@/content/plugins/slack/api-endpoints.mdx';
import SlackWebhooksDoc from '@/content/plugins/slack/webhooks.mdx';
import SlackDatabaseDoc from '@/content/plugins/slack/database.mdx';
import SlackErrorHandlersDoc from '@/content/plugins/slack/error-handlers.mdx';
import LinearDoc from '@/content/plugins/linear/main.mdx';
import LinearApiEndpointsDoc from '@/content/plugins/linear/api-endpoints.mdx';
import LinearWebhooksDoc from '@/content/plugins/linear/webhooks.mdx';
import LinearDatabaseDoc from '@/content/plugins/linear/database.mdx';
import LinearErrorHandlersDoc from '@/content/plugins/linear/error-handlers.mdx';
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
	'adapters/drizzle': {
		Component: DrizzleAdapterDoc,
		title: 'Drizzle Adapter',
		description:
			'Use Corsair with Drizzle ORM for type-safe database operations',
	},
	'adapters/kysely': {
		Component: KyselyAdapterDoc,
		title: 'Kysely Adapter',
		description: 'Use Corsair with Kysely for type-safe database operations',
	},
	'adapters/postgresql': {
		Component: PostgresqlAdapterDoc,
		title: 'PostgreSQL Adapter',
		description: 'Use Corsair with raw PostgreSQL',
	},
	'adapters/prisma': {
		Component: PrismaAdapterDoc,
		title: 'Prisma Adapter',
		description: 'Use Corsair with Prisma for type-safe database operations',
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
	'guides/create-your-own-plugin': {
		Component: CreateYourOwnPlugin,
		title: 'Create Your Own Plugin',
		description: 'Create your own plugin for Corsair',
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
