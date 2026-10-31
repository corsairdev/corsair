import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
	flattenCapabilityGroups,
	matchesCapabilityQuery,
	orderCapabilityGroups,
	triggerLabel,
	visibleTriggerGroups,
} from './integration-capabilities';
import type { IntegrationCapabilityGroup } from './integration-page.types';

const group = (
	resource: string,
	ids: string[],
	resourceLabel = resource,
): IntegrationCapabilityGroup => ({
	resource,
	resourceLabel,
	actions: ids.map((id) => ({ id, label: id.split('.')[1] ?? id })),
});

// Slack's real shape: alphabetical order put the Enterprise admin calls first.
const slack = [
	group('admin', ['admin.listTeams', 'admin.conversationsSearch'], 'Admin'),
	group(
		'channels',
		['channels.list', 'channels.archive', 'channels.getHistory'],
		'Channels',
	),
	group('messages', ['messages.delete', 'messages.post'], 'Messages'),
	group('stars', ['stars.add'], 'Stars'),
];

describe('orderCapabilityGroups', () => {
	it('puts admin last even with no featured tools', () => {
		const order = orderCapabilityGroups(slack).map((g) => g.resource);
		assert.equal(order.at(-1), 'admin');
		assert.equal(order[0], 'channels'); // biggest group first
	});

	it('leads with the groups and tools the use cases rely on', () => {
		const ordered = orderCapabilityGroups(slack, [
			'messages.post',
			'channels.getHistory',
		]);
		assert.deepEqual(
			ordered.map((g) => g.resource),
			['messages', 'channels', 'stars', 'admin'],
		);
		assert.equal(ordered[0].actions[0].id, 'messages.post');
		assert.equal(ordered[1].actions[0].id, 'channels.getHistory');
		// The rest of a group stays alphabetical.
		assert.deepEqual(
			ordered[1].actions.slice(1).map((a) => a.label),
			['archive', 'list'],
		);
	});

	it('does not change the groups it was given', () => {
		const before = JSON.stringify(slack);
		orderCapabilityGroups(slack, ['messages.post']);
		assert.equal(JSON.stringify(slack), before);
	});
});

describe('visibleTriggerGroups', () => {
	it("hides Slack's URL verification challenge", () => {
		const triggers = [
			group('challenge', ['challenge.challenge']),
			group('messages', ['messages.message']),
		];
		assert.deepEqual(
			visibleTriggerGroups(triggers).map((g) => g.resource),
			['messages'],
		);
	});
});

describe('triggerLabel', () => {
	it('names the resource with the verb', () => {
		assert.equal(triggerLabel('Issue', 'Opened'), 'Issue opened');
		assert.equal(
			triggerLabel('Pull Request', 'Ready For Review'),
			'Pull request ready for review',
		);
	});

	it('uses the singular of a plural resource', () => {
		assert.equal(triggerLabel('Files', 'Created'), 'File created');
		assert.equal(triggerLabel('Activities', 'Logged'), 'Activity logged');
		assert.equal(
			triggerLabel('Deployment Status', 'Created'),
			'Deployment status created',
		);
		assert.equal(triggerLabel('Users', 'Team Join'), 'User team join');
	});

	it('does not repeat a resource the name already has', () => {
		assert.equal(triggerLabel('Messages', 'Message'), 'Message');
		assert.equal(triggerLabel('Users', 'User Change'), 'User change');
		assert.equal(triggerLabel('Push', 'Push'), 'Push');
		assert.equal(
			triggerLabel('Message Changed', 'Message Changed'),
			'Message changed',
		);
	});
});

describe('flattenCapabilityGroups and search', () => {
	it('keeps each card’s group and labels triggers', () => {
		const cards = flattenCapabilityGroups(
			[group('issue', ['issue.opened'], 'Issue')],
			'triggers',
		);
		assert.equal(cards[0].label, 'Issue opened');
		assert.equal(cards[0].resource, 'issue');
	});

	it('matches every word against label, description, id and group', () => {
		const [card] = flattenCapabilityGroups(
			[
				{
					resource: 'messages',
					resourceLabel: 'Messages',
					actions: [
						{
							id: 'messages.post',
							label: 'Post',
							description: 'Send a message to a channel',
						},
					],
				},
			],
			'tools',
		);
		assert.ok(matchesCapabilityQuery(card, ''));
		assert.ok(matchesCapabilityQuery(card, 'send channel'));
		assert.ok(matchesCapabilityQuery(card, 'MESSAGES.POST'));
		assert.ok(!matchesCapabilityQuery(card, 'send email'));
	});
});
