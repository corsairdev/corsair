import type {
	IntegrationCapabilityGroup,
	IntegrationFaqItem,
} from '@/lib/integration-page.types';
import type { IntegrationAuthType } from '@/lib/integrations-catalog.types';
import { MCP_URL } from '@/lib/site-links';

const SITE_URL = 'https://corsair.dev';

// The root layout appends " | Corsair" (10 characters), and Google shows about
// 60, so the page's own part of the title stays at 50 or fewer.
const MAX_TITLE_LENGTH = 50;
const MAX_DESCRIPTION_LENGTH = 160;

export type RiskCounts = { read: number; write: number; destructive: number };

// A few catalog names already end in "MCP" (Tavily MCP, Devin MCP), so they
// don't get it twice.
export function withMcp(displayName: string) {
	return /\bmcp$/i.test(displayName.trim())
		? displayName
		: `${displayName} MCP`;
}

export function integrationMetaTitle(displayName: string) {
	const candidates = [
		`${withMcp(displayName)} Server for Claude, ChatGPT & Cursor`,
		`${withMcp(displayName)} Server for AI Agents`,
	];
	return (
		candidates.find((title) => title.length <= MAX_TITLE_LENGTH) ??
		`${withMcp(displayName)} Server`
	);
}

export function integrationMetaDescription(
	displayName: string,
	toolCount: number,
) {
	const tools = `${toolCount} ${displayName} ${toolCount === 1 ? 'operation' : 'operations'}`;
	const candidates = [
		`Connect ${displayName} to Claude, ChatGPT, Cursor and other AI agents with Corsair's MCP server: ${tools}, sign-in handled, and approval before risky actions.`,
		`Connect ${displayName} to Claude, ChatGPT and Cursor with Corsair's MCP server: ${tools} and approval before risky actions.`,
	];
	return (
		candidates.find((text) => text.length <= MAX_DESCRIPTION_LENGTH) ??
		`Connect ${displayName} to Claude, ChatGPT and Cursor with Corsair's MCP server.`
	);
}

export function countToolsByRisk(
	operations: IntegrationCapabilityGroup[],
): RiskCounts {
	const counts: RiskCounts = { read: 0, write: 0, destructive: 0 };
	for (const group of operations) {
		for (const action of group.actions) {
			// The runtime treats an action with no risk level as a write.
			counts[action.riskLevel ?? 'write'] += 1;
		}
	}
	return counts;
}

function plural(count: number, one: string, many: string) {
	return `${count} ${count === 1 ? one : many}`;
}

// authTypes lists the app's default auth type first.
export function integrationAuthSummary(
	displayName: string,
	authTypes: IntegrationAuthType[],
) {
	const primary = authTypes[0] ?? 'api_key';
	const how =
		primary === 'oauth_2'
			? authTypes.includes('api_key')
				? `Sign in to ${displayName} or add an API key once in Corsair.`
				: `Sign in to ${displayName} once in Corsair.`
			: primary === 'bot_token'
				? `Add your ${displayName} bot token once in Corsair.`
				: authTypes.includes('oauth_2')
					? `Add your ${displayName} API key or sign in with OAuth once in Corsair.`
					: `Add your ${displayName} API key once in Corsair.`;

	return `${how} Corsair stores the credential encrypted and makes the ${displayName} API calls for your agent, so it never goes into a prompt or a config file.`;
}

// Mirrors the link modes in docs/cloud/mcp.mdx: Cautious (the default) lets
// writes through and asks before destructive actions; Strict asks before every
// write and refuses destructive actions; Read refuses writes.
export function integrationApprovalSummary(
	displayName: string,
	risk: RiskCounts,
) {
	if (risk.destructive > 0) {
		return `In the default Cautious mode, ${displayName}'s read and write operations run right away and its ${plural(risk.destructive, 'destructive operation waits', 'destructive operations wait')} for your approval. Strict mode asks before every write, and Read mode allows reads only.`;
	}
	if (risk.write === 0) {
		return `Every ${displayName} operation only reads data, so it runs right away in every mode.`;
	}
	return `None of ${displayName}'s operations are destructive, so in the default Cautious mode they all run right away. Strict mode asks before each of its ${plural(risk.write, 'write', 'writes')}, and Read mode allows reads only.`;
}

export function integrationMcpFaqs(
	displayName: string,
	risk: RiskCounts,
): IntegrationFaqItem[] {
	const destructive =
		risk.destructive > 0
			? `The default Cautious mode asks only before the ${plural(risk.destructive, `destructive ${displayName} operation`, `destructive ${displayName} operations`)}.`
			: risk.write > 0
				? `None of the ${displayName} operations are destructive, so the default Cautious mode runs them all without asking.`
				: `Every ${displayName} operation only reads data, so there are no changes to approve today.`;

	return [
		{
			id: 'mcp-clients',
			question: `Does the ${withMcp(displayName)} server work with Claude, ChatGPT and Cursor?`,
			answer: `Yes. Add \`${MCP_URL}\` as a custom connector or MCP server in Claude, ChatGPT, Cursor, VS Code, Claude Code, Codex or any client that supports remote MCP servers with OAuth sign-in, then sign in to Corsair. On ChatGPT personal plans, custom servers currently get read tools only.`,
		},
		{
			id: 'mcp-approval',
			question: `Can I make the agent ask before it changes anything in ${displayName}?`,
			answer: `Yes. Put ${displayName} on a link in Strict mode and every write waits for your approval, while destructive actions are refused. ${destructive} You can change a link's mode at hub.corsair.dev/me.`,
		},
	];
}

function plainText(value: string) {
	return value.replace(/`/g, '');
}

export function buildIntegrationJsonLd(integration: {
	id: string;
	displayName: string;
	faqs: IntegrationFaqItem[];
}) {
	const url = `${SITE_URL}/integrations/${integration.id}`;
	// Each schema.org node has its own fields per @type; unknown keeps the
	// graph a plain JSON array without one type per node kind.
	const graph: Record<string, unknown>[] = [
		{
			'@type': 'BreadcrumbList',
			itemListElement: [
				{
					'@type': 'ListItem',
					position: 1,
					name: 'Integrations',
					item: `${SITE_URL}/integrations`,
				},
				{
					'@type': 'ListItem',
					position: 2,
					name: `${withMcp(integration.displayName)} server`,
					item: url,
				},
			],
		},
	];

	if (integration.faqs.length > 0) {
		graph.push({
			'@type': 'FAQPage',
			mainEntity: integration.faqs.map((faq) => ({
				'@type': 'Question',
				name: plainText(faq.question),
				acceptedAnswer: { '@type': 'Answer', text: plainText(faq.answer) },
			})),
		});
	}

	return { '@context': 'https://schema.org', '@graph': graph };
}

export function escapeJsonLd(json: string) {
	return json
		.replace(/&/g, '\\u0026')
		.replace(/</g, '\\u003c')
		.replace(/>/g, '\\u003e');
}
