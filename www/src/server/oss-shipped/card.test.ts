import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { ShippedPullRequest } from './card';
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

	it('pre-fills the post text on X and LinkedIn', () => {
		const shareText = (description: string, site: 'X' | 'LinkedIn') => {
			const link = description.match(
				new RegExp(`\\[Post on ${site}\\]\\(([^)]+)\\)`),
			)?.[1];
			assert.ok(link, `no ${site} link`);
			return new URL(link).searchParams.get('text') ?? '';
		};

		const plugin =
			buildShippedMessage(
				pr('Srinidhi444', 'feat(coassemble): add Coassemble integration'),
				credit,
			)?.embeds[0]?.description ?? '';
		assert.equal(
			shareText(plugin, 'X'),
			'I just shipped the Coassemble integration for @corsairdotdev, the open-source integration layer for AI agents 🚢',
		);
		assert.equal(
			shareText(plugin, 'LinkedIn'),
			'I just shipped the Coassemble integration for Corsair, the open-source integration layer for AI agents 🚢\n\nhttps://github.com/corsairdev/corsair/pull/1831',
		);

		const fix =
			buildShippedMessage(
				pr('Apageoflove', 'fix(ambee): treat a zoneless ISO timestamp as UTC'),
				null,
			)?.embeds[0]?.description ?? '';
		assert.match(
			shareText(fix, 'X'),
			/^My Ambee fix just got merged into @corsairdotdev, /,
		);
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
	});
});
