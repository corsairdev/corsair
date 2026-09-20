import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';

import {
	comboCountsFor,
	comboDataSchema,
	worksWithFor,
} from './combo-types';

const slackLinear: unknown = JSON.parse(
	readFileSync(
		join(
			dirname(fileURLToPath(import.meta.url)),
			'../data/combos/slack-linear.json',
		),
		'utf8',
	),
);

describe('comboDataSchema', () => {
	it('accepts slack-linear.json', () => {
		const combo = comboDataSchema.parse(slackLinear);
		assert.equal(combo.slugA, 'slack');
		assert.equal(combo.slugB, 'linear');
		assert.deepEqual(comboCountsFor({ combo, appId: 'slack' }), {
			api: 45,
			webhooks: 8,
		});
		assert.deepEqual(comboCountsFor({ combo, appId: 'linear' }), {
			api: 18,
			webhooks: 9,
		});
	});

	it('rejects counts that omit a slug', () => {
		const combo = comboDataSchema.parse(slackLinear);
		assert.throws(() =>
			comboDataSchema.parse({
				...combo,
				counts: [{ id: 'slack', ops: 1, triggers: 1 }],
			}),
		);
	});

	it('builds works-with cards from the pair', () => {
		const combo = comboDataSchema.parse(slackLinear);
		assert.deepEqual(
			worksWithFor({ combos: [combo], integrationId: 'slack' }),
			[
				{
					id: 'linear',
					displayName: 'Linear',
					href: '/integrations/slack/and/linear',
					blurb: combo.worksWith.a,
				},
			],
		);
		assert.deepEqual(
			worksWithFor({ combos: [combo], integrationId: 'linear' }),
			[
				{
					id: 'slack',
					displayName: 'Slack',
					href: '/integrations/slack/and/linear',
					blurb: combo.worksWith.b,
				},
			],
		);
	});
});
