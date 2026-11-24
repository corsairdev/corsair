// The homepage as markdown: served at /index.md and shown by the
// human/machine switch. Built from the same data the page renders.

import { AGENT_ROLES } from '@/lib/agent-roles';
import { GATEWAY_PLANS } from '@/lib/gateway-plans';
import {
	AGENT_SETUP_PROMPT,
	BUILT_INS,
	CONNECT_APPS,
	DEVELOPER_POINTS,
	HERO_CLIENTS,
	HERO_SUBTITLE,
	HERO_TITLE,
	LINK_MODES,
	PILLARS,
	ROUTINE_EXAMPLE,
} from '@/lib/home-content';
import { FAQ_ITEMS } from '@/lib/home-faq';
import {
	MANAGED_TOOLS,
	MONTHLY_FREE_CREDITS,
	priceText,
} from '@/lib/managed-tools';
import {
	AGENT_SIGNUP_URL,
	APP_URL,
	DOCS_URL,
	GITHUB_URL,
	MCP_URL,
} from '@/lib/site-links';

const SITE = 'https://corsair.dev';

/** Collapse the indentation template strings carry, keep paragraph breaks. */
function prose(text: string): string {
	return text
		.split(/\n\s*\n/)
		.map((para) => para.replace(/\s+/g, ' ').trim())
		.filter(Boolean)
		.join('\n\n');
}

function pillarExtra(id: (typeof PILLARS)[number]['id']): string[] {
	if (id === 'connect') {
		return [
			`Some of the apps: ${CONNECT_APPS.map((app) => app.name).join(', ')}, and 700+ more.`,
		];
	}
	if (id === 'control') {
		return LINK_MODES.map(
			(mode) =>
				`- ${mode.name}${'isDefault' in mode ? ' (default)' : ''}: ${mode.note}`,
		);
	}
	return [`Example: "${ROUTINE_EXAMPLE}"`];
}

export function buildHomeMarkdown(): string {
	const lines: string[] = [
		'---',
		'title: Corsair',
		`description: ${HERO_SUBTITLE}`,
		`canonical: ${SITE}/`,
		`agent_signup: ${AGENT_SIGNUP_URL}`,
		'---',
		'',
		`# ${HERO_TITLE}`,
		'',
		HERO_SUBTITLE,
		'',
		`Works in ${HERO_CLIENTS.join(', ')}, and any MCP client.`,
		'',
		'## For agents',
		'',
		`Read ${AGENT_SIGNUP_URL} and follow it: one POST with your person's email returns an MCP URL and a key that work right away with the built-in apps, and your person gets an email to claim the account. Or add Corsair's MCP server (${MCP_URL}) to your client and have your person sign in. A user can hand you this line: "${AGENT_SETUP_PROMPT}".`,
		'',
		'## For people',
		'',
		`Claim yourname.lug.dev at ${SITE}/start, connect your apps once, and add that one URL to every AI tool you use. Manage paths, modes and apps at ${APP_URL}/me. Setup for every client: ${SITE}/connect.`,
		'',
		'## One URL. Every app. Your rules.',
		'',
	];

	for (const pillar of PILLARS) {
		lines.push(
			`### ${pillar.eyebrow}: ${pillar.title}`,
			'',
			pillar.body,
			'',
			...pillarExtra(pillar.id),
			'',
			`${pillar.cta}: ${SITE}${pillar.href}`,
			'',
		);
	}

	lines.push('## Turn Claude into a teammate', '');
	for (const role of AGENT_ROLES) {
		lines.push(
			`### ${role.title.replace(/^an? /, '').replace(/^./, (c) => c.toUpperCase())}`,
			'',
			`Apps: ${role.apps.map((app) => app.name).join(', ')}`,
			'',
			`> ${role.prompt}`,
			'',
		);
		if (role.useCase) {
			lines.push(`More: ${SITE}/use-cases/${role.useCase}`, '');
		}
	}

	lines.push('## Built in', '');
	for (const item of BUILT_INS) {
		lines.push(`- ${item.name}: ${item.body}`);
	}
	lines.push('');

	lines.push(
		'## Tools with no API key, paid per call',
		'',
		`These run on Corsair's own key and bill each call to your credits. ${MONTHLY_FREE_CREDITS} credits are free every month, and a call that fails is refunded.`,
		'',
	);
	for (const tool of MANAGED_TOOLS.filter((t) => t.live)) {
		const calls = tool.calls
			.filter((call) => call.price)
			.map((call) => {
				const price = call.price ? priceText(call.price) : null;
				return `${call.label} (${price?.credits}, ${price?.usd})`;
			});
		lines.push(`- ${tool.name}: ${calls.join('; ')}`);
	}

	lines.push(
		'',
		'## For developers',
		'',
		'Building your own product? Put the same layer inside it.',
		'',
		...DEVELOPER_POINTS.map((point) => `- ${point}`),
		'',
		'```bash',
		'npm install corsair',
		'npx skills add corsairdev/corsair',
		'```',
		'',
		`Docs: ${DOCS_URL} · Source: ${GITHUB_URL} · More: ${SITE}/developers`,
		'',
		'## Pricing',
		'',
		...GATEWAY_PLANS.map(
			(plan) =>
				`- ${plan.name}: ${plan.price}${plan.per ?? ''}${plan.yearNote ? ` (or ${plan.yearPrice}/month, ${plan.yearNote.toLowerCase()})` : ''}. ${plan.features.join(', ')}.`,
		),
		'',
		`Plans and questions: ${SITE}/pricing. SDK plans: ${SITE}/developers#pricing.`,
		'',
		'## FAQ',
		'',
	);
	for (const item of FAQ_ITEMS) {
		lines.push(`### ${item.question}`, '', prose(item.answer), '');
	}

	lines.push(
		'## Links',
		'',
		`- Agent signup: ${AGENT_SIGNUP_URL}`,
		`- Agent index: ${SITE}/llms.txt`,
		`- MCP gateway: ${SITE}/mcp-gateway`,
		`- Connect a client: ${SITE}/connect`,
		`- Skills: ${SITE}/skills`,
		`- Pricing: ${SITE}/pricing`,
		`- Integrations: ${SITE}/integrations`,
		`- Use cases: ${SITE}/use-cases`,
		`- Security: ${SITE}/security`,
		`- Docs: ${DOCS_URL}`,
		'',
	);

	return lines.join('\n');
}
