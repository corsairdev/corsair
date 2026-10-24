import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { discordEndpointSchemas } from '@corsair-dev/discord';
import type { ShippedMessage, ShippedPullRequest } from './card';
import { buildShippedMessage } from './card';

function pr(
	login: string,
	title: string,
	extra: Partial<ShippedPullRequest> = {},
): ShippedPullRequest {
	return {
		number: 1831,
		title,
		html_url: 'https://github.com/corsairdev/corsair/pull/1831',
		merged_at: '2026-10-05T10:00:00Z',
		user: {
			login,
			avatar_url: 'https://avatars/x',
			html_url: `https://github.com/${login}`,
		},
		merged_by: { login: 'devjain32' },
		...extra,
	};
}

const credit = {
	integrationName: 'Coassemble',
	integrationSlug: 'coassemble',
	points: 19,
	discordUserId: null,
	firstMerge: false,
};

describe('buildShippedMessage', () => {
	it('credits a finished claim with points and no ping when Discord is not linked', () => {
		const message = buildShippedMessage(
			pr('Srinidhi444', 'feat(coassemble): add Coassemble integration'),
			credit,
		);
		assert.ok(message);
		assert.equal(message.content, undefined);
		const embed = message.embeds[0];
		assert.equal(embed?.title, '🚢 Coassemble integration shipped');
		assert.match(embed?.description ?? '', /\*\*\+19 pts\*\*/);
		assert.match(embed?.footer?.text ?? '', /corsair\.dev\/oss\/coassemble/);
	});

	it('mentions the contributor and flags a first merge once Discord is linked', () => {
		const message = buildShippedMessage(
			pr('Srinidhi444', 'feat(coassemble): add Coassemble integration'),
			{
				...credit,
				discordUserId: '1420731498834694164',
				firstMerge: true,
			},
		);
		assert.equal(
			message?.content,
			'<@1420731498834694164> shipped **Coassemble** 🎉',
		);
		assert.deepEqual(message?.allowed_mentions, {
			users: ['1420731498834694164'],
		});
		assert.match(message?.embeds[0]?.description ?? '', /first merged plugin/);
	});

	it('labels team integrations without points', () => {
		const message = buildShippedMessage(
			pr(
				'Mayank-saraswal',
				'feat(mrscraper): add MrScraper integration plugin',
				{ author_association: 'COLLABORATOR' },
			),
			null,
		);
		assert.equal(message?.embeds[0]?.title, '🧩 New integration: MrScraper');
		assert.match(message?.embeds[0]?.author.name ?? '', /Corsair team/);
		assert.doesNotMatch(message?.embeds[0]?.description ?? '', /pts/);
	});

	it('names community fixes by their scope', () => {
		const message = buildShippedMessage(
			pr('Apageoflove', 'fix(ambee): treat a zoneless ISO timestamp as UTC'),
			null,
		);
		assert.equal(message?.embeds[0]?.title, '🔧 Ambee fix merged');
	});

	it('puts Post on X, Post on LinkedIn and View PR in link buttons', () => {
		const message = buildShippedMessage(
			pr('Srinidhi444', 'feat(coassemble): add Coassemble integration'),
			credit,
		);
		const buttons = message?.components?.[0]?.components ?? [];
		assert.deepEqual(
			buttons.map((button) => 'label' in button && button.label),
			['Post on X', 'Post on LinkedIn', 'View PR'],
		);
		for (const button of buttons) {
			assert.equal(button.type, 2);
			assert.ok('style' in button && button.style === 5, 'link style');
			assert.ok('url' in button && button.url && button.url.length <= 512);
		}
		assert.equal(
			'url' in buttons[2]! && buttons[2].url,
			'https://github.com/corsairdev/corsair/pull/1831',
		);
		assert.doesNotMatch(message?.embeds[0]?.description ?? '', /\]\(https/);
	});

	it('builds cards the Discord plugin accepts for messages.send', () => {
		const send = discordEndpointSchemas['messages.send'].input;
		const cards = [
			buildShippedMessage(
				pr('Srinidhi444', 'feat(ga): add Google Ads (Beta) integration'),
				{
					...credit,
					integrationName: 'Google Ads (Beta)',
					discordUserId: '1420731498834694164',
				},
			),
			buildShippedMessage(
				pr('Mayank-saraswal', 'feat(mrscraper): add MrScraper integration', {
					author_association: 'COLLABORATOR',
				}),
				null,
			),
			buildShippedMessage(pr('Apageoflove', 'fix(ambee): parse UTC'), null),
			buildShippedMessage(
				pr('devjain32', 'feat(hub): retry webhooks', {
					author_association: 'OWNER',
				}),
				null,
			),
		];
		for (const card of cards) {
			assert.ok(card);
			const parsed = send.safeParse({ channel_id: '1', ...card });
			assert.ok(parsed.success, parsed.error?.message);
		}
	});

	it('pre-fills the post text on X and LinkedIn', () => {
		const shareText = (
			message: ShippedMessage | null,
			site: 'X' | 'LinkedIn',
		) => {
			const button = message?.components?.[0]?.components.find(
				(c) => 'label' in c && c.label === `Post on ${site}`,
			);
			const link = button && 'url' in button ? button.url : undefined;
			assert.ok(link, `no ${site} button`);
			return new URL(link).searchParams.get('text') ?? '';
		};

		const plugin = buildShippedMessage(
			pr('Srinidhi444', 'feat(coassemble): add Coassemble integration'),
			credit,
		);
		assert.equal(
			shareText(plugin, 'X'),
			'I just shipped the Coassemble integration for @corsairdotdev, the open-source integration layer for AI agents 🚢',
		);
		assert.equal(
			shareText(plugin, 'LinkedIn'),
			'I just shipped the Coassemble integration for Corsair, the open-source integration layer for AI agents 🚢\n\nhttps://github.com/corsairdev/corsair/pull/1831',
		);

		const parens = buildShippedMessage(
			pr('Srinidhi444', 'feat(ga): add Google Ads (Beta) integration'),
			{ ...credit, integrationName: 'Google Ads (Beta)' },
		);
		assert.equal(
			shareText(parens, 'X'),
			'I just shipped the Google Ads (Beta) integration for @corsairdotdev, the open-source integration layer for AI agents 🚢',
		);

		const fix = buildShippedMessage(
			pr('Apageoflove', 'fix(ambee): treat a zoneless ISO timestamp as UTC'),
			null,
		);
		assert.match(
			shareText(fix, 'X'),
			/^My Ambee fix just got merged into @corsairdotdev, /,
		);
	});

	it('falls back to links in the text when a share url is too long for a button', () => {
		const name = 'A'.repeat(300);
		const message = buildShippedMessage(
			pr('Srinidhi444', `feat(long): add ${name} integration`),
			{ ...credit, integrationName: name },
		);
		assert.equal(message?.components, undefined);
		// A ) in the name would end the markdown link early, so ( and ) are encoded.
		const parens = buildShippedMessage(
			pr('Srinidhi444', `feat(long): add ${name} (Beta) integration`),
			{ ...credit, integrationName: `${name} (Beta)` },
		)?.embeds[0]?.description;
		const link = parens?.match(/\[Post on X\]\(([^)]+)\)/)?.[1];
		assert.ok(link);
		assert.match(
			new URL(link).searchParams.get('text') ?? '',
			/A \(Beta\) integration for @corsairdotdev/,
		);
	});

	it('announces an integration only from a feature or an unprefixed title', () => {
		const fix = buildShippedMessage(
			pr('Srinidhi444', 'fix(slack): add retry to Slack plugin'),
			null,
		);
		assert.equal(fix?.embeds[0]?.title, '🔧 Slack fix merged');

		const unprefixed = buildShippedMessage(
			pr('Srinidhi444', 'Add Customer.io integration'),
			null,
		);
		assert.equal(
			unprefixed?.embeds[0]?.title,
			'🚢 Customer.io integration shipped',
		);
	});

	it("keeps embed titles within Discord's 256-character limit", () => {
		const longTitle = `feat(hub): ${'retry webhooks '.repeat(20)}`.trim();
		const team = buildShippedMessage(
			pr('devjain32', longTitle, { author_association: 'OWNER' }),
			null,
		)?.embeds[0]?.title;
		assert.ok(team && team.length <= 256, `${team?.length}`);
		assert.ok(team.endsWith('…'));

		const name = 'A'.repeat(300);
		const credited = buildShippedMessage(
			pr('Srinidhi444', `feat(long): add ${name} integration`),
			{ ...credit, integrationName: name },
		)?.embeds[0]?.title;
		assert.ok(credited && credited.length <= 256, `${credited?.length}`);

		const short = buildShippedMessage(
			pr('devjain32', 'fix(hub): retry webhooks', {
				author_association: 'OWNER',
			}),
			null,
		)?.embeds[0]?.title;
		assert.equal(short, '🔧 fix(hub): retry webhooks');
	});

	it('skips bots, release PRs and team chores', () => {
		assert.equal(
			buildShippedMessage(pr('dependabot[bot]', 'chore(deps): bump x'), null),
			null,
		);
		assert.equal(
			buildShippedMessage(pr('github-actions', 'Version Packages'), null),
			null,
		);
		assert.equal(
			buildShippedMessage(
				pr('PranayHaldiya', 'docs(www): clarify privacy policy', {
					author_association: 'MEMBER',
				}),
				null,
			),
			null,
		);
	});

	it('reads the team from GitHub access, not a list of logins', () => {
		const intern = buildShippedMessage(
			pr('ambikeesshh', 'feat(surf): add Surf integration', {
				author_association: 'COLLABORATOR',
			}),
			credit,
		);
		assert.match(intern?.embeds[0]?.author.name ?? '', /Corsair team/);
		assert.doesNotMatch(intern?.embeds[0]?.description ?? '', /pts/);

		const community = buildShippedMessage(
			pr('Srinidhi444', 'feat(coassemble): add Coassemble integration', {
				author_association: 'CONTRIBUTOR',
			}),
			null,
		);
		assert.equal(community?.embeds[0]?.author.name, 'Srinidhi444');
		assert.equal(
			community?.embeds[0]?.title,
			'🚢 Coassemble integration shipped',
		);
	});

	it('posts team feat and fix PRs as one line', () => {
		const message = buildShippedMessage(
			pr('devjain32', 'fix(hub): retry webhooks', {
				author_association: 'OWNER',
			}),
			null,
		);
		assert.equal(message?.embeds[0]?.title, '🔧 fix(hub): retry webhooks');
		assert.equal(message?.embeds[0]?.description, 'PR #1831');
		assert.equal(message?.components, undefined);
	});
});
