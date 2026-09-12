import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
	decideAssign,
	decideOneIssueCap,
	decidePrGate,
	INTEGRATION_MARKER,
	isAssignCommand,
	isFirstTimeContributor,
	isIntegrationIssue,
	parseLinkedIssueNumbers,
} from './policy.ts';

test('isAssignCommand accepts /assign and /assign me', () => {
	assert.equal(isAssignCommand('/assign'), true);
	assert.equal(isAssignCommand('  /assign me  '), true);
	assert.equal(isAssignCommand('/assign please'), false);
	assert.equal(isAssignCommand('please /assign'), false);
});

test('parseLinkedIssueNumbers finds Fixes/Closes/Resolves', () => {
	assert.deepEqual(
		parseLinkedIssueNumbers('Fixes #12 and closes #4. Resolves: #12.'),
		[4, 12],
	);
	assert.deepEqual(parseLinkedIssueNumbers('See #9'), []);
});

test('merged PR count beats GitHub association', () => {
	assert.equal(isFirstTimeContributor('FIRST_TIME_CONTRIBUTOR', 1), false);
	assert.equal(isFirstTimeContributor('NONE', 0), true);
	assert.equal(isFirstTimeContributor('CONTRIBUTOR', 0), false);
});

const assignBase = {
	isPullRequest: false,
	commentBody: '/assign',
	issueOpen: true,
	issueLabels: ['good first issue'],
	assignees: [] as string[],
	commenter: 'newbie',
	commenterAssociation: 'FIRST_TIME_CONTRIBUTOR',
	commenterMergedPrs: 0,
	otherAssignedIssue: null as number | null,
};

test('isIntegrationIssue only matches the integration template marker', () => {
	assert.equal(isIntegrationIssue(INTEGRATION_MARKER), true);
	assert.equal(
		isIntegrationIssue(
			'### What API or service would you like integrated?\n\nStripe',
		),
		true,
	);
	assert.equal(isIntegrationIssue('Just a bug'), false);
});

test('auto-assign grants an integration issue to the opener', () => {
	const d = decideAssign({
		...assignBase,
		issueLabels: ['enhancement'],
		commentBody: '',
		auto: true,
	});
	assert.equal(d.action, 'assign');
});

test('auto-assign still enforces one issue at a time', () => {
	const d = decideAssign({
		...assignBase,
		issueLabels: ['enhancement'],
		commentBody: '',
		auto: true,
		otherAssignedIssue: 88,
	});
	assert.equal(d.action, 'reject');
});

test('auto-assign ignores non-command comments without auto', () => {
	assert.equal(
		decideAssign({ ...assignBase, commentBody: '', auto: false }).action,
		'ignore',
	);
});

test('assign grants a free first-issue to a first-timer', () => {
	const d = decideAssign(assignBase);
	assert.equal(d.action, 'assign');
});

test('assign rejects a regular who already merged here', () => {
	const d = decideAssign({
		...assignBase,
		commenter: 'regular',
		commenterAssociation: 'CONTRIBUTOR',
		commenterMergedPrs: 2,
	});
	assert.equal(d.action, 'reject');
	assert.match((d as { reply: string }).reply, /first-time contributors/);
});

test('assign rejects a second open issue of any type', () => {
	const d = decideAssign({
		...assignBase,
		issueLabels: ['enhancement'],
		otherAssignedIssue: 88,
	});
	assert.equal(d.action, 'reject');
	assert.match((d as { reply: string }).reply, /#88/);
	assert.match((d as { reply: string }).reply, /anything else/);
});

test('one-issue cap is shared across issue types', () => {
	assert.equal(
		decideOneIssueCap({
			login: 'dev',
			maintainer: false,
			otherAssignedIssue: 12,
		}).action,
		'revert',
	);
	assert.equal(
		decideOneIssueCap({
			login: 'dev',
			maintainer: false,
			otherAssignedIssue: null,
		}).action,
		'ok',
	);
	assert.equal(
		decideOneIssueCap({
			login: 'maintainer',
			maintainer: true,
			otherAssignedIssue: 12,
		}).action,
		'ok',
	);
});

test('assign rejects an already claimed issue', () => {
	const d = decideAssign({ ...assignBase, assignees: ['other'] });
	assert.equal(d.action, 'reject');
	assert.match((d as { reply: string }).reply, /@other/);
});

test('assign is idempotent for the current assignee', () => {
	const d = decideAssign({ ...assignBase, assignees: ['newbie'] });
	assert.equal(d.action, 'assign');
});

test('assign ignores PR review comments and non-commands', () => {
	assert.equal(
		decideAssign({ ...assignBase, isPullRequest: true }).action,
		'ignore',
	);
	assert.equal(
		decideAssign({ ...assignBase, commentBody: 'I can take this' }).action,
		'ignore',
	);
});

test('assign allows maintainers on first-issues and past the one-issue cap', () => {
	const d = decideAssign({
		...assignBase,
		commenter: 'maintainer',
		commenterAssociation: 'MEMBER',
		commenterMergedPrs: 40,
		otherAssignedIssue: 3,
	});
	assert.equal(d.action, 'assign');
});

const prBase = {
	isDraft: false,
	author: 'newbie',
	authorAssociation: 'FIRST_TIME_CONTRIBUTOR',
	authorMergedPrs: 0,
	prLabels: [] as string[],
	linkedIssues: [
		{
			number: 10,
			open: true,
			labels: ['good first issue'],
			assignees: ['newbie'],
		},
	],
};

test('PR gate allows an assigned first-timer', () => {
	assert.equal(decidePrGate(prBase).action, 'ok');
});

test('PR gate allows an assigned regular enhancement', () => {
	assert.equal(
		decidePrGate({
			...prBase,
			author: 'regular',
			authorAssociation: 'CONTRIBUTOR',
			authorMergedPrs: 3,
			linkedIssues: [
				{
					number: 40,
					open: true,
					labels: ['enhancement'],
					assignees: ['regular'],
				},
			],
		}).action,
		'ok',
	);
});

test('PR gate closes an unassigned first-issue PR', () => {
	const d = decidePrGate({
		...prBase,
		linkedIssues: [
			{
				number: 10,
				open: true,
				labels: ['good first issue'],
				assignees: [],
			},
		],
	});
	assert.equal(d.action, 'close');
	assert.match((d as { reason: string }).reason, /\/assign/);
});

test('PR gate closes a first-issue PR from a returning contributor', () => {
	const d = decidePrGate({
		...prBase,
		author: 'regular',
		authorAssociation: 'CONTRIBUTOR',
		authorMergedPrs: 1,
	});
	assert.equal(d.action, 'close');
	assert.match((d as { reason: string }).reason, /first-time/);
});

test('PR gate closes an unassigned linked issue', () => {
	const d = decidePrGate({
		...prBase,
		linkedIssues: [
			{
				number: 22,
				open: true,
				labels: ['enhancement'],
				assignees: [],
			},
		],
	});
	assert.equal(d.action, 'close');
	assert.match((d as { reason: string }).reason, /\/assign/);
});

test('PR gate closes a sniped assigned issue', () => {
	const d = decidePrGate({
		...prBase,
		author: 'sniper',
		linkedIssues: [
			{
				number: 10,
				open: true,
				labels: ['enhancement'],
				assignees: ['newbie'],
			},
		],
	});
	assert.equal(d.action, 'close');
	assert.match((d as { reason: string }).reason, /already assigned/);
});

test('PR gate skips drafts and maintainers', () => {
	assert.equal(decidePrGate({ ...prBase, isDraft: true }).action, 'ok');
	assert.equal(
		decidePrGate({
			...prBase,
			author: 'djain',
			authorAssociation: 'MEMBER',
			authorMergedPrs: 50,
			linkedIssues: [
				{
					number: 10,
					open: true,
					labels: ['good first issue'],
					assignees: [],
				},
			],
		}).action,
		'ok',
	);
});
