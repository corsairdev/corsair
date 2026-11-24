import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { appCatalog, toClaimApps } from './claim-apps';

const entry = (id: string, displayName: string, api = 1) => ({
	id,
	displayName,
	counts: { api },
});

describe('toClaimApps', () => {
	it('keeps id, name and API count, sorted by name', () => {
		assert.deepEqual(
			toClaimApps([entry('slack', 'Slack', 40), entry('gmail', 'Gmail', 23)]),
			[
				{ id: 'gmail', name: 'Gmail', actions: 23 },
				{ id: 'slack', name: 'Slack', actions: 40 },
			],
		);
	});

	it("leaves out ids Hub can't take in a comma list, and nameless entries", () => {
		assert.deepEqual(
			toClaimApps([
				entry('google-ads', 'Google Ads'),
				entry('x', ''),
				entry('ok', 'OK'),
			]).map((a) => a.id),
			['ok'],
		);
	});
});

describe('appCatalog', () => {
	const catalog = appCatalog(
		toClaimApps([
			entry('slack', 'Slack', 40),
			entry('gmail', 'Gmail', 23),
			entry('github', 'GitHub', 100),
			entry('stripe', 'Stripe', 300),
			entry('fireflies', 'Fireflies', 5),
		]),
	);

	it('counts actions, ignoring unknown ids', () => {
		assert.equal(catalog.actionsOf(['gmail', 'slack', 'nope']), 63);
	});

	it('searches names and ids', () => {
		assert.deepEqual(
			catalog.search('git', 5).map((a) => a.id),
			['github'],
		);
		assert.deepEqual(
			catalog.search('S', 2).map((a) => a.id),
			['fireflies', 'slack'],
		);
		assert.deepEqual(catalog.search('  ', 5), []);
	});

	it('shows the popular apps first, led by a skill’s apps', () => {
		assert.deepEqual(catalog.shelf(), ['slack', 'github', 'gmail', 'stripe']);
		assert.deepEqual(catalog.shelf(['fireflies', 'gmail', 'nope']), [
			'fireflies',
			'gmail',
			'slack',
			'github',
			'stripe',
		]);
	});

	it('rounds the count down to the hundred', () => {
		assert.equal(catalog.countLabel, '0+');
		assert.equal(
			appCatalog(
				Array.from({ length: 779 }, (_, i) => ({
					id: `a${i}`,
					name: `A${i}`,
					actions: 1,
				})),
			).countLabel,
			'700+',
		);
	});
});
