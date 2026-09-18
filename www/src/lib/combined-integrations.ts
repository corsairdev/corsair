/**
 * Hand-written combo data for v1 SEO pages.
 *
 * Per Djain: v1 is manual (no DB tables yet). When we agree on format,
 * we'll add `_integration_combos` tables and mass-generate the top 50.
 * This file is the format reference: keep it small and explicit.
 *
 * ID convention: trigger/action `id`s are the raw plugin schema keys
 * (e.g. `messages.post`, `issues.create`), exactly as they appear in
 * `packages/slack` (`slackEndpointSchemas` / `slackWebhookSchemas`) and
 * `packages/linear` (`linearEndpointSchemas` / `linearWebhookSchemas`).
 * The owning app travels in `app`; never prefix it into the id.
 */

export type ComboAppId = 'slack' | 'linear';

export type ComboTrigger = {
	id: string;
	app: ComboAppId;
	appLabel: string;
	label: string;
	description: string;
};

export type ComboAction = {
	id: string;
	app: ComboAppId;
	appLabel: string;
	label: string;
	description: string;
};

export type ComboWorkflow = {
	id: string;
	title: string;
	description: string;
	trigger: ComboTrigger;
	action: ComboAction;
};

export type ConnectStep = {
	title: string;
	description: string;
};

export type AppDetail = {
	id: string;
	displayName: string;
	description: string;
	pageHref: string;
	docsHref: string;
};

export type ComboFaq = {
	id: string;
	question: string;
	answer: string;
};

export type ComboKbApp = {
	appId: string;
	appLabel: string;
};

export type ComboKbTool = {
	apps: [ComboKbApp, ...ComboKbApp[]];
	op: string;
	label: string;
	result: string;
};

export type ComboData = {
	slugA: string;
	slugB: string;
	displayA: string;
	displayB: string;
	title: string;
	introA: string;
	introB: string;
	counts: {
		slackOps: number;
		slackTriggers: number;
		linearOps: number;
		linearTriggers: number;
	};
	triggers: ComboTrigger[];
	actions: ComboAction[];
	workflows: ComboWorkflow[];
	connectSteps: ConnectStep[];
	appDetails: AppDetail[];
	kb: {
		asker: string;
		query: string;
		answer: string;
		tools: ComboKbTool[];
		sources: { label: string; href: string; appId: string; appLabel: string }[];
	};
	faqs: ComboFaq[];
};

export const SLACK_LINEAR_COMBO: ComboData = {
	slugA: 'slack',
	slugB: 'linear',
	displayA: 'Slack',
	displayB: 'Linear',
	title: 'Slack and Linear integration',
	introA:
		'Save yourself the work of writing custom integrations for Slack and Linear. Connect both in Corsair and turn Slack threads into Linear issues, then post Linear updates back to Slack.',
	introB:
		'The same connection is typed code. Agents can subscribe to every Slack and Linear trigger and call every action, with OAuth, webhooks, and MCP.',
	counts: {
		slackOps: 45,
		// 9th webhook key is challenge.challenge (URL verification handshake),
		// not a subscribable trigger. README's "9 webhook events" counts it.
		slackTriggers: 8,
		linearOps: 18,
		linearTriggers: 9,
	},
	triggers: [
		{
			id: 'messages.message',
			app: 'slack',
			appLabel: 'Slack',
			label: 'New message posted',
			description: 'A message was posted or updated in a channel',
		},
		{
			id: 'reactions.added',
			app: 'slack',
			appLabel: 'Slack',
			label: 'Reaction added',
			description: 'A reaction emoji was added to a message',
		},
		{
			id: 'channels.created',
			app: 'slack',
			appLabel: 'Slack',
			label: 'Channel created',
			description: 'A new channel was created in the workspace',
		},
		{
			id: 'issues.create',
			app: 'linear',
			appLabel: 'Linear',
			label: 'Issue created',
			description: 'A new Linear issue was created',
		},
		{
			id: 'issues.update',
			app: 'linear',
			appLabel: 'Linear',
			label: 'Issue updated',
			description: 'A Linear issue was updated',
		},
		{
			id: 'comments.create',
			app: 'linear',
			appLabel: 'Linear',
			label: 'Comment added',
			description: 'A comment was added to a Linear issue',
		},
	],
	actions: [
		{
			id: 'messages.post',
			app: 'slack',
			appLabel: 'Slack',
			label: 'Post message',
			description: 'Post a message to a Slack channel',
		},
		{
			id: 'messages.search',
			app: 'slack',
			appLabel: 'Slack',
			label: 'Search messages',
			description: 'Search messages across the workspace',
		},
		{
			id: 'issues.create',
			app: 'linear',
			appLabel: 'Linear',
			label: 'Create issue',
			description: 'Create a new Linear issue',
		},
		{
			id: 'issues.update',
			app: 'linear',
			appLabel: 'Linear',
			label: 'Update issue',
			description: 'Update an existing Linear issue',
		},
		{
			id: 'comments.create',
			app: 'linear',
			appLabel: 'Linear',
			label: 'Post issue comment',
			description: 'Post a comment on a Linear issue',
		},
		{
			id: 'projects.create',
			app: 'linear',
			appLabel: 'Linear',
			label: 'Create project',
			description: 'Create a new Linear project',
		},
	],
	workflows: [
		{
			id: 'slack-bug-to-linear',
			title: 'Turn #bugs threads into Linear issues',
			description:
				'When a message lands in #bugs, create a Linear issue with the thread link attached, ready for triage.',
			trigger: {
				id: 'messages.message',
				app: 'slack',
				appLabel: 'Slack',
				label: 'New message posted',
				description: 'A message was posted or updated in a channel',
			},
			action: {
				id: 'issues.create',
				app: 'linear',
				appLabel: 'Linear',
				label: 'Create issue',
				description: 'Create a new Linear issue',
			},
		},
		{
			id: 'linear-to-slack-eng',
			title: 'Post new Linear issues to #eng',
			description:
				'When a Linear issue is created, post its title, priority, and link to #eng.',
			trigger: {
				id: 'issues.create',
				app: 'linear',
				appLabel: 'Linear',
				label: 'Issue created',
				description: 'A new Linear issue was created',
			},
			action: {
				id: 'messages.post',
				app: 'slack',
				appLabel: 'Slack',
				label: 'Post message',
				description: 'Post a message to a Slack channel',
			},
		},
		{
			id: 'reaction-to-ticket',
			title: 'File tickets with a reaction',
			description:
				'When someone reacts with `:ticket:` in Slack, create a Linear issue from the message thread.',
			trigger: {
				id: 'reactions.added',
				app: 'slack',
				appLabel: 'Slack',
				label: 'Reaction added',
				description: 'A reaction emoji was added to a message',
			},
			action: {
				id: 'issues.create',
				app: 'linear',
				appLabel: 'Linear',
				label: 'Create issue',
				description: 'Create a new Linear issue',
			},
		},
		{
			id: 'linear-status-to-thread',
			title: 'Sync Linear status back to the Slack thread',
			description:
				'When a Linear issue is updated, reply in the original Slack thread and post the status update.',
			trigger: {
				id: 'issues.update',
				app: 'linear',
				appLabel: 'Linear',
				label: 'Issue updated',
				description: 'A Linear issue was updated',
			},
			action: {
				id: 'messages.post',
				app: 'slack',
				appLabel: 'Slack',
				label: 'Post message',
				description: 'Post a message to a Slack channel',
			},
		},
		{
			id: 'linear-comment-sync',
			title: 'Mirror Linear comments into Slack',
			description:
				'When a Linear comment is added, forward it to the linked Slack channel for visibility.',
			trigger: {
				id: 'comments.create',
				app: 'linear',
				appLabel: 'Linear',
				label: 'Comment added',
				description: 'A comment was added to a Linear issue',
			},
			action: {
				id: 'messages.post',
				app: 'slack',
				appLabel: 'Slack',
				label: 'Post message',
				description: 'Post a message to a Slack channel',
			},
		},
		{
			id: 'channel-to-project',
			title: 'Spin up a Linear project per channel',
			description:
				'When a project channel is created in Slack, create the matching Linear project automatically.',
			trigger: {
				id: 'channels.created',
				app: 'slack',
				appLabel: 'Slack',
				label: 'Channel created',
				description: 'A new channel was created in the workspace',
			},
			action: {
				id: 'projects.create',
				app: 'linear',
				appLabel: 'Linear',
				label: 'Create project',
				description: 'Create a new Linear project',
			},
		},
	],
	connectSteps: [
		{
			title: 'Install the Slack and Linear plugins',
			description:
				'Add `@corsair-dev/slack` and `@corsair-dev/linear` to your project and register both plugins on one Corsair client.',
		},
		{
			title: 'Add credentials for each app',
			description:
				'Use a bot token for Slack and a personal API key or OAuth token for Linear. OAuth refresh is handled for you.',
		},
		{
			title: 'Pick a trigger',
			description:
				'Choose a trigger, for example a new Slack message or a Linear issue update, and handle it in your app.',
		},
		{
			title: 'Pick an action',
			description:
				'Call the typed operation for the action, like creating a Linear issue or posting a Slack message, from the same client.',
		},
		{
			title: 'Send a test event and go live',
			description:
				'Send a test event, confirm the round trip in both apps, then go live.',
		},
	],
	appDetails: [
		{
			id: 'slack',
			displayName: 'Slack',
			description:
				'Slack is the team chat where engineering work shows up first: bug reports, deploy notices, and customer escalations. Corsair exposes its channels, messages, files, reactions, and user groups as typed calls with webhooks for messages, reactions, channels, and files.',
			pageHref: '/integrations/slack',
			docsHref: 'https://docs.corsair.dev/plugins/slack/overview',
		},
		{
			id: 'linear',
			displayName: 'Linear',
			description:
				'Linear is the issue tracker for software teams: issues, projects, and triage. Corsair exposes its issues, comments, projects, teams, and users as typed calls with webhooks for issues, comments, and projects.',
			pageHref: '/integrations/linear',
			docsHref: 'https://docs.corsair.dev/plugins/linear/overview',
		},
	],
	kb: {
		asker: 'ambi',
		query: 'Why is ENG-412 blocked?',
		answer:
			'ENG-412 (Fix onboarding email delay) is blocked on a missing SMTP credential. In #eng yesterday djain flagged it, 14 replies in that thread.\n\nLinear has 3 comments, the latest from djain 2 hours ago. ENG-413 is the retry fix and it is already in progress.',
		tools: [
			{
				apps: [{ appId: 'slack', appLabel: 'Slack' }],
				op: 'messages.search',
				label: 'Searching Slack for ENG-412',
				result: '14 matches in #eng',
			},
			{
				apps: [{ appId: 'linear', appLabel: 'Linear' }],
				op: 'issues.get',
				label: 'Fetching Linear issue ENG-412',
				result: 'Blocked · missing SMTP credential',
			},
			{
				apps: [{ appId: 'slack', appLabel: 'Slack' }],
				op: 'conversations.history',
				label: 'Reading the #eng thread',
				result: 'djain: deploy is waiting on SMTP',
			},
			{
				apps: [{ appId: 'linear', appLabel: 'Linear' }],
				op: 'comments.list',
				label: 'Reading comments on ENG-412',
				result: '3 comments · latest from djain 2h ago',
			},
			{
				apps: [{ appId: 'linear', appLabel: 'Linear' }],
				op: 'issues.list',
				label: 'Finding related Linear issues',
				result: 'ENG-413 · retry the onboarding send',
			},
			{
				apps: [
					{ appId: 'linear', appLabel: 'Linear' },
					{ appId: 'slack', appLabel: 'Slack' },
				],
				op: 'issues.get',
				label: 'Matching the #eng thread to ENG-412',
				result: '#eng linked on ENG-412',
			},
		],
		sources: [
			{
				label: 'Slack · #eng',
				href: '/integrations/slack',
				appId: 'slack',
				appLabel: 'Slack',
			},
			{
				label: 'Linear · ENG-412',
				href: '/integrations/linear',
				appId: 'linear',
				appLabel: 'Linear',
			},
			{
				label: 'Linear · ENG-413',
				href: '/integrations/linear',
				appId: 'linear',
				appLabel: 'Linear',
			},
		],
	},
	faqs: [
		{
			id: 'can-connect',
			question: 'Can Slack connect with Linear?',
			answer:
				'Yes. With Corsair you connect both apps once, then automate in either direction: Slack threads become Linear issues, and Linear updates post back to Slack channels or threads.',
		},
		{
			id: 'slack-api',
			question: "Can I use Slack's API with Corsair?",
			answer:
				'Yes. Every Slack operation (`channels.list`, `messages.post`, `messages.search`, `reactions.add`) is a typed call with webhooks for messages, reactions, channels, files, and users.',
		},
		{
			id: 'linear-api',
			question: "Can I use Linear's API with Corsair?",
			answer:
				'Yes. Every Linear operation (`issues.list`, `issues.create`, `issues.update`, `comments.create`, `projects.create`) is a typed call with webhooks for issues, comments, and projects.',
		},
		{
			id: 'secure',
			question: 'Is Corsair secure for connecting Slack and Linear?',
			answer:
				'Yes. Each operation carries a risk level (read, write, destructive) enforced by the permission system. Secrets stay in your own key store or Corsair-managed auth, and webhooks verify signatures per tenant.',
		},
		{
			id: 'how-to-connect',
			question: 'How do I connect Slack and Linear with Corsair?',
			answer:
				'Install the `@corsair-dev/slack` and `@corsair-dev/linear` plugins, add API keys or OAuth, then call typed operations like `messages.post` and `issues.create` from one client. Webhooks for both apps arrive on the same handler.',
		},
		{
			id: 'what-automate',
			question: 'What can I automate between Slack and Linear?',
			answer:
				'File Linear issues from Slack threads, post Linear updates to Slack channels, sync comments both ways, and create projects per channel. The workflows above are the most common starting points.',
		},
		{
			id: 'webhooks',
			question: 'Does Corsair support real-time triggers?',
			answer:
				'Yes. Slack message, reaction, channel, and file events plus Linear issue, comment, and project events are all available as typed webhooks with tenant matching built in.',
		},
		{
			id: 'beyond-workflows',
			question: 'Can I build more than workflows?',
			answer:
				'Yes. The same connection powers an agent that searches Slack and Linear together, plus typed calls you can use from code.',
		},
		{
			id: 'vs-zapier',
			question: 'How is this different from Zapier or n8n?',
			answer:
				'Zapier and n8n are workflow builders. Corsair is the same Slack and Linear connection in typed code, so agents can subscribe to every trigger and call every action, with OAuth, webhooks, MCP, and local DB sync.',
		},
	],
};

export const COMBO_INDEX: Record<string, ComboData> = {
	'slack/and/linear': SLACK_LINEAR_COMBO,
};

export function getComboData(slug: string, other: string): ComboData | null {
	const a = slug.toLowerCase().trim();
	const b = other.toLowerCase().trim();
	if (!a || !b || a === b) return null;
	return COMBO_INDEX[`${a}/and/${b}`] ?? COMBO_INDEX[`${b}/and/${a}`] ?? null;
}

/** Primary URL for a combo. Reversed routes canonicalize here. */
export function getComboCanonical(slug: string, other: string): string {
	const combo = getComboData(slug, other);
	if (!combo) {
		const a = slug.toLowerCase().trim();
		const b = other.toLowerCase().trim();
		return `/integrations/${a}/and/${b}`;
	}
	return `/integrations/${combo.slugA}/and/${combo.slugB}`;
}

/** Canonical combo URLs only, used by the sitemap (no reversed duplicates). */
export function getComboCanonicalUrls(): string[] {
	return Object.keys(COMBO_INDEX).map((key) => `/integrations/${key}`);
}

/** v1: only combos with hand-written copy. Grows to 50 after format sign-off. */
export function getWorksWith(integrationId: string): {
	id: string;
	displayName: string;
	href: string;
	blurb: string;
}[] {
	if (integrationId === 'slack') {
		return [
			{
				id: 'linear',
				displayName: 'Linear',
				href: '/integrations/slack/and/linear',
				blurb: 'Turn threads into issues and sync status back to Slack.',
			},
		];
	}
	if (integrationId === 'linear') {
		return [
			{
				id: 'slack',
				displayName: 'Slack',
				href: '/integrations/slack/and/linear',
				blurb: 'File issues from Slack and post updates to channels.',
			},
		];
	}
	return [];
}
