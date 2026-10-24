import { isOssTeamAssociation } from '@/lib/oss-team';

export type ShippedPullRequest = {
	number: number;
	title: string;
	html_url: string;
	merged_at: string | null;
	user: { login: string; avatar_url: string; html_url: string; type?: string };
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

export type ShippedMessage = { content?: string; embeds: ShippedEmbed[] };

const COMMUNITY_COLOR = 0x1f7a99;
const TEAM_COLOR = 0x4a38f5;
const X_HANDLE = '@corsairdotdev';
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

function shareLine(sentence: ShareSentence, url: string) {
	const tail = ', the open-source integration layer for AI agents 🚢';
	const x = `https://x.com/intent/post?text=${encode(`${sentence(X_HANDLE)}${tail}`)}&url=${encode(url)}`;
	const linkedin = `https://www.linkedin.com/feed/?shareActive=true&text=${encode(`${sentence('Corsair')}${tail}\n\n${url}`)}`;
	return `Share it: [Post on X](${x}) · [Post on LinkedIn](${linkedin}) and tag Corsair`;
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
	const integration = pr.title
		.match(/\badd(?:s|ed)?\s+(?:the\s+)?(.+?)\s+(?:integration|plugin)\b/i)?.[1]
		?.trim();
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
		return {
			...(credit.discordUserId
				? {
						content: `<@${credit.discordUserId}> shipped **${credit.integrationName}** 🎉`,
					}
				: {}),
			embeds: [
				{
					...base,
					title: `🚢 ${credit.integrationName} integration shipped`,
					description: `${prLine}\n${points}\n\n${shareLine(shippedIntegration(credit.integrationName), pr.html_url)}`,
					footer: {
						text: `corsair.dev/oss/${credit.integrationSlug} · Build one, earn AI credits`,
					},
				},
			],
		};
	}

	if (integration) {
		return {
			embeds: [
				{
					...base,
					title: isTeam
						? `🧩 New integration: ${integration}`
						: `🚢 ${integration} integration shipped`,
					description: `${prLine}\n\n${shareLine(shippedIntegration(integration), pr.html_url)}`,
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
					title: `${type === 'fix' ? '🔧' : '✨'} ${pr.title}`,
					description: `PR #${pr.number}`,
				},
			],
		};
	}

	const scope = pr.title.match(/^\w+\(([^)]+)\)/)?.[1];
	const what =
		type === 'fix' ? 'fix' : type === 'docs' ? 'docs update' : 'contribution';
	return {
		embeds: [
			{
				...base,
				title: `${type === 'fix' ? '🔧' : '🚢'} ${scope ? `${capitalize(scope)} ${what}` : capitalize(what)} merged`,
				description: `${prLine}\n\n${shareLine(mergedChange(scope ? `${capitalize(scope)} ${what}` : what), pr.html_url)}`,
				footer: { text: 'Contribute → corsair.dev/oss' },
			},
		],
	};
}
