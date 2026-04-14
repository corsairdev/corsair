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
	'plugins/github/api-endpoints': 'plugins/github/api-endpoints.mdx',
	'plugins/github/webhooks': 'plugins/github/webhooks.mdx',
	'plugins/github/database': 'plugins/github/database.mdx',
	'plugins/github/error-handlers': 'plugins/github/error-handlers.mdx',
	'plugins/gmail': 'plugins/gmail/main.mdx',
	'plugins/gmail/get-credentials': 'plugins/gmail/get-credentials.mdx',
	'plugins/gmail/api-endpoints': 'plugins/gmail/api-endpoints.mdx',
	'plugins/gmail/webhooks': 'plugins/gmail/webhooks.mdx',
	'plugins/gmail/database': 'plugins/gmail/database.mdx',
	'plugins/gmail/error-handlers': 'plugins/gmail/error-handlers.mdx',
	'plugins/googlesheets': 'plugins/googlesheets/main.mdx',
	'plugins/googlesheets/get-credentials':
		'plugins/googlesheets/get-credentials.mdx',
	'plugins/googlesheets/api-endpoints':
		'plugins/googlesheets/api-endpoints.mdx',
	'plugins/googlesheets/webhooks': 'plugins/googlesheets/webhooks.mdx',
	'plugins/googlesheets/database': 'plugins/googlesheets/database.mdx',
	'plugins/googlesheets/error-handlers':
		'plugins/googlesheets/error-handlers.mdx',
	'plugins/googledrive': 'plugins/googledrive/main.mdx',
	'plugins/googledrive/get-credentials':
		'plugins/googledrive/get-credentials.mdx',
	'plugins/googledrive/api-endpoints': 'plugins/googledrive/api-endpoints.mdx',
	'plugins/googledrive/webhooks': 'plugins/googledrive/webhooks.mdx',
	'plugins/googledrive/database': 'plugins/googledrive/database.mdx',
	'plugins/googledrive/error-handlers':
		'plugins/googledrive/error-handlers.mdx',
	'plugins/googlecalendar': 'plugins/googlecalendar/main.mdx',
	'plugins/googlecalendar/get-credentials':
		'plugins/googlecalendar/get-credentials.mdx',
	'plugins/googlecalendar/api-endpoints':
		'plugins/googlecalendar/api-endpoints.mdx',
	'plugins/googlecalendar/webhooks': 'plugins/googlecalendar/webhooks.mdx',
	'plugins/googlecalendar/database': 'plugins/googlecalendar/database.mdx',
	'plugins/googlecalendar/error-handlers':
		'plugins/googlecalendar/error-handlers.mdx',
	'plugins/hubspot': 'plugins/hubspot/main.mdx',
	'plugins/hubspot/get-credentials': 'plugins/hubspot/get-credentials.mdx',
	'plugins/hubspot/api-endpoints': 'plugins/hubspot/api-endpoints.mdx',
	'plugins/hubspot/webhooks': 'plugins/hubspot/webhooks.mdx',
	'plugins/hubspot/database': 'plugins/hubspot/database.mdx',
	'plugins/hubspot/error-handlers': 'plugins/hubspot/error-handlers.mdx',
	'plugins/posthog': 'plugins/posthog/main.mdx',
	'plugins/posthog/get-credentials': 'plugins/posthog/get-credentials.mdx',
	'plugins/posthog/api-endpoints': 'plugins/posthog/api-endpoints.mdx',
	'plugins/posthog/webhooks': 'plugins/posthog/webhooks.mdx',
	'plugins/posthog/database': 'plugins/posthog/database.mdx',
	'plugins/posthog/error-handlers': 'plugins/posthog/error-handlers.mdx',
	'plugins/resend': 'plugins/resend/main.mdx',
	'plugins/resend/get-credentials': 'plugins/resend/get-credentials.mdx',
	'plugins/resend/api-endpoints': 'plugins/resend/api-endpoints.mdx',
	'plugins/resend/webhooks': 'plugins/resend/webhooks.mdx',
	'plugins/resend/database': 'plugins/resend/database.mdx',
	'plugins/resend/error-handlers': 'plugins/resend/error-handlers.mdx',
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
	'plugins/twitterapiio/api-endpoints':
		'plugins/twitterapiio/api-endpoints.mdx',
	'plugins/twitterapiio/webhooks': 'plugins/twitterapiio/webhooks.mdx',
	'plugins/twitterapiio/database': 'plugins/twitterapiio/database.mdx',
	'plugins/twitterapiio/error-handlers':
		'plugins/twitterapiio/error-handlers.mdx',
	'plugins/sentry': 'plugins/sentry/main.mdx',
	'plugins/sentry/api-endpoints': 'plugins/sentry/api-endpoints.mdx',
	'plugins/sentry/webhooks': 'plugins/sentry/webhooks.mdx',
	'plugins/sentry/database': 'plugins/sentry/database.mdx',
	'plugins/sentry/error-handlers': 'plugins/sentry/error-handlers.mdx',
	'plugins/stripe': 'plugins/stripe/main.mdx',
	'plugins/stripe/get-credentials': 'plugins/stripe/get-credentials.mdx',
	'plugins/stripe/database': 'plugins/stripe/database.mdx',
	'plugins/twitter': 'plugins/twitter/main.mdx',
	'plugins/twitter/get-credentials': 'plugins/twitter/get-credentials.mdx',
	'plugins/twitter/database': 'plugins/twitter/database.mdx',
	'plugins/monday': 'plugins/monday/main.mdx',
	'plugins/monday/get-credentials': 'plugins/monday/get-credentials.mdx',
	'plugins/monday/database': 'plugins/monday/database.mdx',
	'plugins/hackernews': 'plugins/hackernews/main.mdx',
	'plugins/hackernews/get-credentials': 'plugins/hackernews/get-credentials.mdx',
	'plugins/hackernews/database': 'plugins/hackernews/database.mdx',
	'plugins/box': 'plugins/box/main.mdx',
	'plugins/box/get-credentials': 'plugins/box/get-credentials.mdx',
	'plugins/box/database': 'plugins/box/database.mdx',
	'plugins/exa': 'plugins/exa/main.mdx',
	'plugins/exa/get-credentials': 'plugins/exa/get-credentials.mdx',
	'plugins/exa/database': 'plugins/exa/database.mdx',
	'plugins/intercom': 'plugins/intercom/main.mdx',
	'plugins/intercom/get-credentials': 'plugins/intercom/get-credentials.mdx',
	'plugins/intercom/database': 'plugins/intercom/database.mdx',
	'plugins/typeform': 'plugins/typeform/main.mdx',
	'plugins/typeform/get-credentials': 'plugins/typeform/get-credentials.mdx',
	'plugins/typeform/database': 'plugins/typeform/database.mdx',
	'plugins/fireflies': 'plugins/fireflies/main.mdx',
	'plugins/fireflies/get-credentials': 'plugins/fireflies/get-credentials.mdx',
	'plugins/fireflies/database': 'plugins/fireflies/database.mdx',
	'plugins/jira': 'plugins/jira/main.mdx',
	'plugins/jira/get-credentials': 'plugins/jira/get-credentials.mdx',
	'plugins/jira/database': 'plugins/jira/database.mdx',
	'plugins/figma': 'plugins/figma/main.mdx',
	'plugins/figma/get-credentials': 'plugins/figma/get-credentials.mdx',
	'plugins/figma/database': 'plugins/figma/database.mdx',
	'plugins/telegram': 'plugins/telegram/main.mdx',
	'plugins/telegram/get-credentials': 'plugins/telegram/get-credentials.mdx',
	'plugins/telegram/database': 'plugins/telegram/database.mdx',
	'plugins/zoom': 'plugins/zoom/main.mdx',
	'plugins/zoom/get-credentials': 'plugins/zoom/get-credentials.mdx',
	'plugins/zoom/database': 'plugins/zoom/database.mdx',
	'plugins/dropbox': 'plugins/dropbox/main.mdx',
	'plugins/dropbox/get-credentials': 'plugins/dropbox/get-credentials.mdx',
	'plugins/dropbox/database': 'plugins/dropbox/database.mdx',
	'plugins/trello': 'plugins/trello/main.mdx',
	'plugins/trello/get-credentials': 'plugins/trello/get-credentials.mdx',
	'plugins/trello/database': 'plugins/trello/database.mdx',
	'plugins/calendly': 'plugins/calendly/main.mdx',
	'plugins/calendly/get-credentials': 'plugins/calendly/get-credentials.mdx',
	'plugins/calendly/database': 'plugins/calendly/database.mdx',
	'plugins/asana': 'plugins/asana/main.mdx',
	'plugins/asana/get-credentials': 'plugins/asana/get-credentials.mdx',
	'plugins/asana/database': 'plugins/asana/database.mdx',
	'plugins/ahrefs': 'plugins/ahrefs/main.mdx',
	'plugins/ahrefs/get-credentials': 'plugins/ahrefs/get-credentials.mdx',
	'plugins/ahrefs/database': 'plugins/ahrefs/database.mdx',
	'plugins/cursor': 'plugins/cursor/main.mdx',
	'plugins/cursor/get-credentials': 'plugins/cursor/get-credentials.mdx',
	'plugins/cursor/database': 'plugins/cursor/database.mdx',
	'plugins/onedrive': 'plugins/onedrive/main.mdx',
	'plugins/onedrive/get-credentials': 'plugins/onedrive/get-credentials.mdx',
	'plugins/onedrive/database': 'plugins/onedrive/database.mdx',
	'plugins/outlook': 'plugins/outlook/main.mdx',
	'plugins/outlook/get-credentials': 'plugins/outlook/get-credentials.mdx',
	'plugins/outlook/database': 'plugins/outlook/database.mdx',
	'plugins/strava': 'plugins/strava/main.mdx',
	'plugins/strava/get-credentials': 'plugins/strava/get-credentials.mdx',
	'plugins/strava/database': 'plugins/strava/database.mdx',
	// guides
	'guides/create-your-own-plugin': 'guides/create-your-own-plugin.mdx',
	'guides/plugin-credentials': 'guides/plugin-credentials.mdx',
	'guides/dashboard': 'guides/dashboard.mdx',
	'guides/workflows': 'guides/workflows.mdx',
	'guides/webhooks': 'guides/webhooks.mdx',
	'guides/inngest': 'guides/inngest.mdx',
	'guides/temporal': 'guides/temporal.mdx',
	'guides/trigger-dev': 'guides/trigger-dev.mdx',
	'guides/hatchet': 'guides/hatchet.mdx',
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

	const cleanedContent = content.replace(/```[\s\S]*?```/g, '');
	const lines = cleanedContent.split('\n');

	const toc: TOCItem[] = [];
	const slugCounts: Record<string, number> = {};

	for (const line of lines) {
		const trimmedLine = line.replace(/\r$/, '');
		const match = trimmedLine.match(/^(#{2,6})\s+(.+)$/);
		if (match) {
			const depth = match[1].length;
			const title = match[2].trim();
			let urlSlug = title
				.toLowerCase()
				.replace(/[^a-z0-9]+/g, '-')
				.replace(/^-|-$/g, '');

			const originalSlug = urlSlug;
			while (slugCounts[urlSlug] !== undefined) {
				slugCounts[originalSlug]++;
				urlSlug = `${originalSlug}-${slugCounts[originalSlug]}`;
			}
			slugCounts[urlSlug] = 0;
			const url = `#${urlSlug}`;
			toc.push({
				title,
				url,
				depth,
			});
		}
	}

	return toc;
}
