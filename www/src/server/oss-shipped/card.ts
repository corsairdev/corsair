import type { MessagesSendInput } from '@corsair-dev/discord';

import { isOssTeamAssociation } from '@/lib/oss-team';

export type ShippedPullRequest = {
	number: number;
	title: string;
	html_url: string;
	merged_at: string | null;
	user: {
		id: number;
		login: string;
		avatar_url: string;
		html_url: string;
		type?: string;
	};
	merged_by?: { login: string } | null;
	author_association?: string;
};

export type ShippedCredit = {
	integrationName: string;
	integrationSlug: string;
	points: number;
	discordUserId: string | null;
	firstMerge: boolean;
};

export type ShippedEmbed = {
	title: string;
	url: string;
	description: string;
	color: number;
	author: { name: string; icon_url: string; url: string };
	footer?: { text: string };
	timestamp?: string;
};

export type ShippedMessage = {
	content?: string;
	embeds: ShippedEmbed[];
	components?: MessagesSendInput['components'];
	allowed_mentions?: MessagesSendInput['allowed_mentions'];
};

const COMMUNITY_COLOR = 0x1f7a99;
const TEAM_COLOR = 0x4a38f5;
const X_HANDLE = '@corsairdotdev';
const LINK_BUTTON = 5;
// Discord refuses a link button whose url is longer than this.
const MAX_BUTTON_URL = 512;
// Discord refuses the whole message when an embed title is longer than this.
const MAX_TITLE = 256;
const SKIP_TYPES = new Set([
	'docs',
	'chore',
	'ci',
	'test',
	'tests',
	'refactor',
	'build',
	'style',
	'perf',
	'revert',
]);

type ShareSentence = (corsair: string) => string;

const shippedIntegration =
	(name: string): ShareSentence =>
	(corsair) =>
		`I just shipped the ${name} integration for ${corsair}`;

const mergedChange =
	(label: string): ShareSentence =>
	(corsair) =>
		`My ${label} just got merged into ${corsair}`;

// X tags the handle and builds the preview from `url`. LinkedIn's share-offsite page
// ignores any text, so the post opens from the feed composer, which takes the text
// with the link in it; a typed @handle isn't a LinkedIn mention, so it names Corsair.
// encodeURIComponent leaves ( and ) alone, and a ) ends a Discord markdown link early.
const encode = (value: string) =>
	encodeURIComponent(value).replace(/\(/g, '%28').replace(/\)/g, '%29');

/**
 * Post on X / Post on LinkedIn / View PR as link buttons under the card. If a share
 * url is too long for a button (a very long integration name), the links go in the
 * description instead.
 */
function share(sentence: ShareSentence, url: string) {
	const tail = ', the open-source integration layer for AI agents 🚢';
	const x = `https://x.com/intent/post?text=${encode(`${sentence(X_HANDLE)}${tail}`)}&url=${encode(url)}`;
	const linkedin = `https://www.linkedin.com/feed/?shareActive=true&text=${encode(`${sentence('Corsair')}${tail}\n\n${url}`)}`;
	if (x.length > MAX_BUTTON_URL || linkedin.length > MAX_BUTTON_URL) {
		return {
			line: `Share it: [Post on X](${x}) · [Post on LinkedIn](${linkedin}) and tag Corsair`,
		};
	}
	const button = (label: string, href: string) => ({
		type: 2 as const,
		style: LINK_BUTTON,
		label,
		url: href,
	});
	return {
		line: 'Share it with the buttons below, and tag Corsair on LinkedIn.',
		components: [
			{
				type: 1 as const,
				components: [
					button('Post on X', x),
					button('Post on LinkedIn', linkedin),
					button('View PR', url),
				],
			},
		],
	};
}

function clipTitle(title: string) {
	if (title.length <= MAX_TITLE) return title;
	let clipped = '';
	for (const char of title) {
		if (clipped.length + char.length > MAX_TITLE - 1) break;
		clipped += char;
	}
	return `${clipped}…`;
}

function capitalize(value: string) {
	return value ? `${value[0]?.toUpperCase()}${value.slice(1)}` : value;
}

/**
 * The #shipped message for a merged PR, or null when it shouldn't be posted
 * (bots, release PRs, team chores). `credit` is set when the PR finished a claim.
 */
export function buildShippedMessage(
	pr: ShippedPullRequest,
	credit: ShippedCredit | null,
): ShippedMessage | null {
	const author = pr.user;
	if (
		author.type === 'Bot' ||
		author.login.endsWith('[bot]') ||
		/^version packages/i.test(pr.title)
	) {
		return null;
	}

	const type = (pr.title.match(/^(\w+)(\(|:|!)/)?.[1] ?? '').toLowerCase();
	// Only a feature, or an unprefixed "Add X integration", announces an integration:
	// `fix(slack): add retry to Slack plugin` is a fix.
	const integration =
		type === 'feat' || type === ''
			? pr.title
					.match(
						/\badd(?:s|ed)?\s+(?:the\s+)?(.+?)\s+(?:integration|plugin)\b/i,
					)?.[1]
					?.trim()
			: undefined;
	const isTeam = isOssTeamAssociation(pr.author_association);
	const prLine = `\`${pr.title}\`\nPR #${pr.number}${pr.merged_by ? ` · merged by ${pr.merged_by.login}` : ''}`;
	const base = {
		url: pr.html_url,
		color: isTeam ? TEAM_COLOR : COMMUNITY_COLOR,
		author: {
			name: isTeam ? `${author.login} · Corsair team` : author.login,
			icon_url: author.avatar_url,
			url: author.html_url,
		},
		...(pr.merged_at ? { timestamp: pr.merged_at } : {}),
	};

	if (credit && !isTeam) {
		const points = `**+${credit.points} pts**${credit.firstMerge ? ' · first merged plugin 🎉' : ''}`;
		const { line, components } = share(
			shippedIntegration(credit.integrationName),
			pr.html_url,
		);
		return {
			...(credit.discordUserId
				? {
						content: `<@${credit.discordUserId}> shipped **${credit.integrationName}** 🎉`,
						// Ping the contributor and nobody else.
						allowed_mentions: { users: [credit.discordUserId] },
					}
				: {}),
			...(components ? { components } : {}),
			embeds: [
				{
					...base,
					title: clipTitle(`🚢 ${credit.integrationName} integration shipped`),
					description: `${prLine}\n${points}\n\n${line}`,
					footer: {
						text: `corsair.dev/oss/${credit.integrationSlug} · Build one, earn AI credits`,
					},
				},
			],
		};
	}

	if (integration) {
		const { line, components } = share(
			shippedIntegration(integration),
			pr.html_url,
		);
		return {
			...(components ? { components } : {}),
			embeds: [
				{
					...base,
					title: clipTitle(
						isTeam
							? `🧩 New integration: ${integration}`
							: `🚢 ${integration} integration shipped`,
					),
					description: `${prLine}\n\n${line}`,
					footer: {
						text: isTeam
							? 'corsair.dev/integrations'
							: 'Build one, earn AI credits → corsair.dev/oss',
					},
				},
			],
		};
	}

	if (isTeam) {
		if (SKIP_TYPES.has(type) || (type !== 'feat' && type !== 'fix'))
			return null;
		return {
			embeds: [
				{
					...base,
					title: clipTitle(`${type === 'fix' ? '🔧' : '✨'} ${pr.title}`),
					description: `PR #${pr.number}`,
				},
			],
		};
	}

	const scope = pr.title.match(/^\w+\(([^)]+)\)/)?.[1];
	const what =
		type === 'fix' ? 'fix' : type === 'docs' ? 'docs update' : 'contribution';
	const { line, components } = share(
		mergedChange(scope ? `${capitalize(scope)} ${what}` : what),
		pr.html_url,
	);
	return {
		...(components ? { components } : {}),
		embeds: [
			{
				...base,
				title: clipTitle(
					`${type === 'fix' ? '🔧' : '🚢'} ${scope ? `${capitalize(scope)} ${what}` : capitalize(what)} merged`,
				),
				description: `${prLine}\n\n${line}`,
				footer: { text: 'Contribute → corsair.dev/oss' },
			},
		],
	};
}
