import fs from 'fs';
import path from 'path';

export interface TOCItem {
	title: string;
	url: string;
	depth: number;
}

const slugToFilePath: Record<string, string> = {
	// getting-started
	index: 'getting-started/introduction.mdx',
	installation: 'getting-started/installation.mdx',
	comparison: 'getting-started/comparison.mdx',
	// mcp-adapters
	'mcp-adapters/claude-sdk': 'mcp-adapters/claude-sdk.mdx',
	'mcp-adapters/anthropic-sdk': 'mcp-adapters/anthropic-sdk.mdx',
	'mcp-adapters/openai-agents': 'mcp-adapters/openai-agents.mdx',
	'mcp-adapters/vercel-ai': 'mcp-adapters/vercel-ai.mdx',
	'mcp-adapters/openai': 'mcp-adapters/openai.mdx',
	'mcp-adapters/mastra': 'mcp-adapters/mastra.mdx',
	// concepts
	api: 'concepts/api.mdx',
	auth: 'concepts/auth.mdx',
	database: 'concepts/database.mdx',
	'error-handling': 'concepts/error-handling.mdx',
	hooks: 'concepts/hooks.mdx',
	integrations: 'concepts/integrations.mdx',
	'multi-tenancy': 'concepts/multi-tenancy.mdx',
	typescript: 'concepts/typescript.mdx',
	webhooks: 'concepts/webhooks.mdx',
	// plugins
	'plugins/slack': 'plugins/slack/main.mdx',
	'plugins/slack/api-endpoints': 'plugins/slack/api-endpoints.mdx',
	'plugins/slack/webhooks': 'plugins/slack/webhooks.mdx',
	'plugins/slack/database': 'plugins/slack/database.mdx',
	'plugins/slack/error-handlers': 'plugins/slack/error-handlers.mdx',
	'plugins/slack/get-credentials': 'plugins/slack/get-credentials.mdx',
	'plugins/linear': 'plugins/linear/main.mdx',
	'plugins/linear/api-endpoints': 'plugins/linear/api-endpoints.mdx',
	'plugins/linear/webhooks': 'plugins/linear/webhooks.mdx',
	'plugins/linear/database': 'plugins/linear/database.mdx',
	'plugins/linear/error-handlers': 'plugins/linear/error-handlers.mdx',
	'plugins/linear/get-credentials': 'plugins/linear/get-credentials.mdx',
	'plugins/github': 'plugins/github/main.mdx',
	'plugins/github/get-credentials': 'plugins/github/get-credentials.mdx',
	'plugins/gmail': 'plugins/gmail/main.mdx',
	'plugins/gmail/get-credentials': 'plugins/gmail/get-credentials.mdx',
	'plugins/googlesheets': 'plugins/googlesheets/main.mdx',
	'plugins/googlesheets/get-credentials':
		'plugins/googlesheets/get-credentials.mdx',
	'plugins/googledrive': 'plugins/googledrive/main.mdx',
	'plugins/googledrive/get-credentials':
		'plugins/googledrive/get-credentials.mdx',
	'plugins/googlecalendar': 'plugins/googlecalendar/main.mdx',
	'plugins/googlecalendar/get-credentials':
		'plugins/googlecalendar/get-credentials.mdx',
	'plugins/hubspot': 'plugins/hubspot/main.mdx',
	'plugins/hubspot/get-credentials': 'plugins/hubspot/get-credentials.mdx',
	'plugins/posthog': 'plugins/posthog/main.mdx',
	'plugins/posthog/get-credentials': 'plugins/posthog/get-credentials.mdx',
	'plugins/resend': 'plugins/resend/main.mdx',
	'plugins/resend/get-credentials': 'plugins/resend/get-credentials.mdx',
	// new plugins
	'plugins/discord': 'plugins/discord/main.mdx',
	'plugins/discord/api-endpoints': 'plugins/discord/api-endpoints.mdx',
	'plugins/discord/webhooks': 'plugins/discord/webhooks.mdx',
	'plugins/discord/database': 'plugins/discord/database.mdx',
	'plugins/discord/error-handlers': 'plugins/discord/error-handlers.mdx',
	'plugins/pagerduty': 'plugins/pagerduty/main.mdx',
	'plugins/pagerduty/api-endpoints': 'plugins/pagerduty/api-endpoints.mdx',
	'plugins/pagerduty/webhooks': 'plugins/pagerduty/webhooks.mdx',
	'plugins/pagerduty/database': 'plugins/pagerduty/database.mdx',
	'plugins/pagerduty/error-handlers': 'plugins/pagerduty/error-handlers.mdx',
	'plugins/oura': 'plugins/oura/main.mdx',
	'plugins/oura/api-endpoints': 'plugins/oura/api-endpoints.mdx',
	'plugins/oura/webhooks': 'plugins/oura/webhooks.mdx',
	'plugins/oura/database': 'plugins/oura/database.mdx',
	'plugins/oura/error-handlers': 'plugins/oura/error-handlers.mdx',
	'plugins/tavily': 'plugins/tavily/main.mdx',
	'plugins/tavily/api-endpoints': 'plugins/tavily/api-endpoints.mdx',
	'plugins/tavily/webhooks': 'plugins/tavily/webhooks.mdx',
	'plugins/tavily/database': 'plugins/tavily/database.mdx',
	'plugins/tavily/error-handlers': 'plugins/tavily/error-handlers.mdx',
	'plugins/spotify': 'plugins/spotify/main.mdx',
	'plugins/spotify/api-endpoints': 'plugins/spotify/api-endpoints.mdx',
	'plugins/spotify/webhooks': 'plugins/spotify/webhooks.mdx',
	'plugins/spotify/database': 'plugins/spotify/database.mdx',
	'plugins/spotify/error-handlers': 'plugins/spotify/error-handlers.mdx',
	'plugins/amplitude': 'plugins/amplitude/main.mdx',
	'plugins/amplitude/api-endpoints': 'plugins/amplitude/api-endpoints.mdx',
	'plugins/amplitude/webhooks': 'plugins/amplitude/webhooks.mdx',
	'plugins/amplitude/database': 'plugins/amplitude/database.mdx',
	'plugins/amplitude/error-handlers': 'plugins/amplitude/error-handlers.mdx',
	'plugins/cal': 'plugins/cal/main.mdx',
	'plugins/cal/api-endpoints': 'plugins/cal/api-endpoints.mdx',
	'plugins/cal/webhooks': 'plugins/cal/webhooks.mdx',
	'plugins/cal/database': 'plugins/cal/database.mdx',
	'plugins/cal/error-handlers': 'plugins/cal/error-handlers.mdx',
	'plugins/notion': 'plugins/notion/main.mdx',
	'plugins/notion/api-endpoints': 'plugins/notion/api-endpoints.mdx',
	'plugins/notion/webhooks': 'plugins/notion/webhooks.mdx',
	'plugins/notion/database': 'plugins/notion/database.mdx',
	'plugins/notion/error-handlers': 'plugins/notion/error-handlers.mdx',
	'plugins/airtable': 'plugins/airtable/main.mdx',
	'plugins/airtable/api-endpoints': 'plugins/airtable/api-endpoints.mdx',
	'plugins/airtable/webhooks': 'plugins/airtable/webhooks.mdx',
	'plugins/airtable/database': 'plugins/airtable/database.mdx',
	'plugins/airtable/error-handlers': 'plugins/airtable/error-handlers.mdx',
	'plugins/todoist': 'plugins/todoist/main.mdx',
	'plugins/todoist/api-endpoints': 'plugins/todoist/api-endpoints.mdx',
	'plugins/todoist/webhooks': 'plugins/todoist/webhooks.mdx',
	'plugins/todoist/database': 'plugins/todoist/database.mdx',
	'plugins/todoist/error-handlers': 'plugins/todoist/error-handlers.mdx',
	'plugins/twitterapiio': 'plugins/twitterapiio/main.mdx',
	'plugins/twitterapiio/api-endpoints': 'plugins/twitterapiio/api-endpoints.mdx',
	'plugins/twitterapiio/webhooks': 'plugins/twitterapiio/webhooks.mdx',
	'plugins/twitterapiio/database': 'plugins/twitterapiio/database.mdx',
	'plugins/twitterapiio/error-handlers': 'plugins/twitterapiio/error-handlers.mdx',
	'plugins/sentry': 'plugins/sentry/main.mdx',
	'plugins/sentry/api-endpoints': 'plugins/sentry/api-endpoints.mdx',
	'plugins/sentry/webhooks': 'plugins/sentry/webhooks.mdx',
	'plugins/sentry/database': 'plugins/sentry/database.mdx',
	'plugins/sentry/error-handlers': 'plugins/sentry/error-handlers.mdx',
	// guides
	'guides/create-your-own-plugin': 'guides/create-your-own-plugin.mdx',
	'guides/plugin-credentials': 'guides/plugin-credentials.mdx',
	'guides/dashboard': 'guides/dashboard.mdx',
	'guides/workflows': 'guides/workflows.mdx',
	// getting-started (additional)
	'quick-start': 'getting-started/quick-start.mdx',
};

export function extractTOC(mdxPath: string): TOCItem[] {
	const filePath = slugToFilePath[mdxPath];
	if (!filePath) {
		return [];
	}

	const fullPath = path.join(process.cwd(), 'content', filePath);
	const content = fs.readFileSync(fullPath, 'utf-8');

	const lines = content.split('\n');
	const toc: TOCItem[] = [];

	let inFrontmatter = false;
	let frontmatterDone = false;
	let inCodeBlock = false;

	for (const line of lines) {
		if (!frontmatterDone && line.trim() === '---') {
			if (!inFrontmatter) {
				inFrontmatter = true;
			} else {
				inFrontmatter = false;
				frontmatterDone = true;
			}
			continue;
		}

		if (inFrontmatter) continue;

		if (line.trim().startsWith('```')) {
			inCodeBlock = !inCodeBlock;
			continue;
		}

		if (inCodeBlock) continue;

		const match = line.match(/^(#{2,6})\s+(.+)$/);
		if (match) {
			const depth = match[1].length;
			const title = match[2].trim();
			const url = `#${title
				.toLowerCase()
				.replace(/[^a-z0-9]+/g, '-')
				.replace(/^-|-$/g, '')}`;

			toc.push({
				title,
				url,
				depth,
			});
		}
	}

	return toc;
}
