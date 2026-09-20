import assert from 'node:assert/strict';
import { dirname, join } from 'node:path';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';

import { readComboFile } from './combo-paths';
import { comboCountsFor, comboDataSchema, worksWithFor } from './combo-types';

const slackLinear = readComboFile(
	join(
		dirname(fileURLToPath(import.meta.url)),
		'../data/combos/slack-linear.json',
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

	it('rejects appDetails that repeat one slug', () => {
		const combo = comboDataSchema.parse(slackLinear);
		const [first] = combo.appDetails;
		assert.ok(first);
		assert.throws(() =>
			comboDataSchema.parse({
				...combo,
				appDetails: [first, first],
			}),
		);
	});

	it('rejects a workflow whose trigger is not in triggers', () => {
		const combo = comboDataSchema.parse(slackLinear);
		const [workflow] = combo.workflows;
		assert.ok(workflow);
		assert.throws(() =>
			comboDataSchema.parse({
				...combo,
				workflows: [
					{
						...workflow,
						trigger: {
							...workflow.trigger,
							id: 'not.a.real.trigger',
						},
					},
				],
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
