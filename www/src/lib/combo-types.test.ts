import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { comboCountsFor, comboDataSchema, worksWithFor } from './combo-types';

const slackLinearFixture = {
	slugA: 'slack',
	slugB: 'linear',
	displayA: 'Slack',
	displayB: 'Linear',
	title: 'Slack and Linear integration',
	description: 'File Linear issues from Slack threads and sync status back.',
	counts: [
		{ id: 'slack', ops: 45, triggers: 8 },
		{ id: 'linear', ops: 18, triggers: 9 },
	],
	worksWith: {
		a: 'Turn threads into issues and sync status back to Slack.',
		b: 'File issues from Slack and post updates to channels.',
	},
	triggers: [
		{
			id: 'messages.message',
			app: 'slack',
			appLabel: 'Slack',
			label: 'New message posted',
			description: 'A message was posted or updated in a channel',
		},
	],
	actions: [
		{
			id: 'issues.create',
			app: 'linear',
			appLabel: 'Linear',
			label: 'Create issue',
			description: 'Create a new Linear issue',
		},
	],
	workflows: [
		{
			id: 'slack-bug-to-linear',
			title: 'Turn #bugs threads into Linear issues',
			description: 'When a message lands in #bugs, create a Linear issue.',
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
	],
	kb: {
		query: "What's the latest on updating the login page?",
		answer: 'Sample answer.',
		tools: [
			{
				apps: [{ appId: 'slack', appLabel: 'Slack' }],
				op: 'messages.search',
				label: 'Searching Slack',
				result: '12-reply thread',
			},
		],
		sources: [
			{
				label: '#product-design',
				href: '/integrations/slack',
				appId: 'slack',
				appLabel: 'Slack',
			},
		],
	},
	faqs: [
		{
			id: 'beyond-workflows',
			question: 'Does Corsair build more than workflows?',
			answer: 'Yes.',
		},
	],
};

describe('comboDataSchema', () => {
	it('accepts a minimal slack-linear-shaped combo', () => {
		const combo = comboDataSchema.parse(slackLinearFixture);
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
		const combo = comboDataSchema.parse(slackLinearFixture);
		assert.throws(() =>
			comboDataSchema.parse({
				...combo,
				counts: [{ id: 'slack', ops: 1, triggers: 1 }],
			}),
		);
	});

	it('rejects a workflow whose trigger is not in triggers', () => {
		const combo = comboDataSchema.parse(slackLinearFixture);
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
		const combo = comboDataSchema.parse(slackLinearFixture);
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
