/**
 * Endpoint coverage.
 *
 * The Slack transport is mocked so these run deterministically in CI with no
 * workspace or token. Each case asserts the operation targets the correct Slack
 * Web API method with the correct HTTP verb, which is the part of an endpoint
 * that is easy to get wrong and invisible at the type level.
 */
const requestMock = jest.fn();

jest.mock('corsair/http', () => ({
	...jest.requireActual('corsair/http'),
	request: (...args: unknown[]) => requestMock(...args),
}));

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: async () => undefined,
}));

import {
	Calls,
	Canvases,
	Conversations,
	Files,
	Messages,
	Reminders,
	Team,
	UserGroups,
	Users,
} from './endpoints';

/** Minimal context: an empty `db` disables the caching branches. */
function makeCtx() {
	return { key: 'xoxb-test-token', db: {}, options: {} } as never;
}

interface RequestOptions {
	url: string;
	method: string;
	body?: Record<string, unknown>;
	query?: Record<string, unknown>;
}

function lastCall(): RequestOptions {
	const calls = requestMock.mock.calls;
	return calls[calls.length - 1][1] as RequestOptions;
}

beforeEach(() => {
	requestMock.mockReset();
	requestMock.mockResolvedValue({ ok: true });
});

// [group object, operation, expected Slack method, expected verb, input]
type Case = [
	Record<string, unknown>,
	string,
	string,
	'GET' | 'POST',
	Record<string, unknown>,
];

const FILE_CASES: Case[] = [
	[Files, 'info', 'files.info', 'GET', { file: 'F1' }],
	[Files, 'list', 'files.list', 'GET', {}],
	[Files, 'delete', 'files.delete', 'POST', { file: 'F1' }],
	[
		Files,
		'commentsDelete',
		'files.comments.delete',
		'POST',
		{ file: 'F1', id: 'C1' },
	],
	[Files, 'sharePublicUrl', 'files.sharedPublicURL', 'POST', { file: 'F1' }],
	[Files, 'revokePublicUrl', 'files.revokePublicURL', 'POST', { file: 'F1' }],
	[
		Files,
		'remoteAdd',
		'files.remote.add',
		'POST',
		{ external_id: 'e1', external_url: 'https://x.test/f', title: 't' },
	],
	[Files, 'remoteInfo', 'files.remote.info', 'GET', { file: 'F1' }],
	[Files, 'remoteList', 'files.remote.list', 'GET', {}],
	[
		Files,
		'remoteUpdate',
		'files.remote.update',
		'POST',
		{ file: 'F1', title: 't2' },
	],
	[Files, 'remoteRemove', 'files.remote.remove', 'POST', { file: 'F1' }],
	[
		Files,
		'remoteShare',
		'files.remote.share',
		'GET',
		{ file: 'F1', channels: 'C1' },
	],
];

const MESSAGE_CASES: Case[] = [
	[Messages, 'post', 'chat.postMessage', 'POST', { channel: 'C1', text: 'hi' }],
	[
		Messages,
		'postEphemeral',
		'chat.postEphemeral',
		'POST',
		{ channel: 'C1', user: 'U1', text: 'hi' },
	],
	[
		Messages,
		'postMe',
		'chat.meMessage',
		'POST',
		{ channel: 'C1', text: 'waves' },
	],
	[
		Messages,
		'schedule',
		'chat.scheduleMessage',
		'POST',
		{ channel: 'C1', post_at: 1893456000, text: 'later' },
	],
	[
		Messages,
		'deleteScheduled',
		'chat.deleteScheduledMessage',
		'POST',
		{ channel: 'C1', scheduled_message_id: 'Q1' },
	],
	[
		Messages,
		'update',
		'chat.update',
		'POST',
		{ channel: 'C1', ts: '1.1', text: 'edited' },
	],
	[Messages, 'delete', 'chat.delete', 'POST', { channel: 'C1', ts: '1.1' }],
	[Messages, 'history', 'conversations.history', 'GET', { channel: 'C1' }],
	[
		Messages,
		'replies',
		'conversations.replies',
		'GET',
		{ channel: 'C1', ts: '1.1' },
	],
	[
		Messages,
		'reactionAdd',
		'reactions.add',
		'POST',
		{ name: 'tada', channel: 'C1', timestamp: '1.1' },
	],
	[
		Messages,
		'reactionRemove',
		'reactions.remove',
		'POST',
		{ name: 'tada', channel: 'C1', timestamp: '1.1' },
	],
	[
		Messages,
		'reactionsGet',
		'reactions.get',
		'GET',
		{ channel: 'C1', timestamp: '1.1' },
	],
	[Messages, 'reactionsList', 'reactions.list', 'GET', {}],
	[Messages, 'pinAdd', 'pins.add', 'POST', { channel: 'C1', timestamp: '1.1' }],
	[
		Messages,
		'pinRemove',
		'pins.remove',
		'POST',
		{ channel: 'C1', timestamp: '1.1' },
	],
	[Messages, 'pinsList', 'pins.list', 'GET', { channel: 'C1' }],
];

const CONVERSATION_CASES: Case[] = [
	[
		Conversations,
		'create',
		'conversations.create',
		'POST',
		{ name: 'general-2' },
	],
	[Conversations, 'info', 'conversations.info', 'GET', { channel: 'C1' }],
	[Conversations, 'list', 'conversations.list', 'GET', {}],
	[Conversations, 'listForUser', 'users.conversations', 'GET', {}],
	[Conversations, 'members', 'conversations.members', 'GET', { channel: 'C1' }],
	[
		Conversations,
		'invite',
		'conversations.invite',
		'POST',
		{ channel: 'C1', users: ['U1'] },
	],
	[
		Conversations,
		'kick',
		'conversations.kick',
		'POST',
		{ channel: 'C1', user: 'U1' },
	],
	[Conversations, 'join', 'conversations.join', 'POST', { channel: 'C1' }],
	[Conversations, 'leave', 'conversations.leave', 'POST', { channel: 'C1' }],
	[
		Conversations,
		'rename',
		'conversations.rename',
		'POST',
		{ channel: 'C1', name: 'renamed' },
	],
	[
		Conversations,
		'setPurpose',
		'conversations.setPurpose',
		'POST',
		{ channel: 'C1', purpose: 'p' },
	],
	[
		Conversations,
		'setTopic',
		'conversations.setTopic',
		'POST',
		{ channel: 'C1', topic: 't' },
	],
	[
		Conversations,
		'mark',
		'conversations.mark',
		'POST',
		{ channel: 'C1', ts: '1.1' },
	],
	[
		Conversations,
		'archive',
		'conversations.archive',
		'POST',
		{ channel: 'C1' },
	],
	[
		Conversations,
		'unarchive',
		'conversations.unarchive',
		'POST',
		{ channel: 'C1' },
	],
	[Conversations, 'close', 'conversations.close', 'POST', { channel: 'C1' }],
];

const USER_CASES: Case[] = [
	[Users, 'list', 'users.list', 'GET', {}],
	[Users, 'info', 'users.info', 'GET', { user: 'U1' }],
	[Users, 'getProfile', 'users.profile.get', 'GET', { user: 'U1' }],
	[Users, 'getPresence', 'users.getPresence', 'GET', { user: 'U1' }],
	[Users, 'setPresence', 'users.setPresence', 'POST', { presence: 'auto' }],
	[Users, 'setActive', 'users.setActive', 'POST', {}],
	[Users, 'lookupByEmail', 'users.lookupByEmail', 'GET', { email: 'a@b.test' }],
	[Users, 'botsInfo', 'bots.info', 'GET', { bot: 'B1' }],
	[Users, 'dndInfo', 'dnd.info', 'GET', { user: 'U1' }],
	[Users, 'dndTeamInfo', 'dnd.teamInfo', 'GET', { users: ['U1', 'U2'] }],
];

const REMINDER_CASES: Case[] = [
	[
		Reminders,
		'add',
		'reminders.add',
		'POST',
		{ text: 'standup', time: 1893456000 },
	],
	[Reminders, 'info', 'reminders.info', 'GET', { reminder: 'R1' }],
	[Reminders, 'list', 'reminders.list', 'GET', {}],
	[Reminders, 'delete', 'reminders.delete', 'POST', { reminder: 'R1' }],
	[Reminders, 'complete', 'reminders.complete', 'POST', { reminder: 'R1' }],
];

const USERGROUP_CASES: Case[] = [
	[UserGroups, 'create', 'usergroups.create', 'POST', { name: 'eng' }],
	[
		UserGroups,
		'update',
		'usergroups.update',
		'POST',
		{ usergroup: 'S1', name: 'eng2' },
	],
	[UserGroups, 'list', 'usergroups.list', 'GET', {}],
	[UserGroups, 'disable', 'usergroups.disable', 'POST', { usergroup: 'S1' }],
	[UserGroups, 'enable', 'usergroups.enable', 'POST', { usergroup: 'S1' }],
	[
		UserGroups,
		'usersList',
		'usergroups.users.list',
		'GET',
		{ usergroup: 'S1' },
	],
	[
		UserGroups,
		'usersUpdate',
		'usergroups.users.update',
		'POST',
		{ usergroup: 'S1', users: ['U1'] },
	],
];

const CANVAS_CASES: Case[] = [
	[Canvases, 'create', 'canvases.create', 'POST', { title: 'doc' }],
	[
		Canvases,
		'edit',
		'canvases.edit',
		'POST',
		{ canvas_id: 'F1', changes: [{ operation: 'insert_at_end' }] },
	],
	[Canvases, 'delete', 'canvases.delete', 'POST', { canvas_id: 'F1' }],
	[Canvases, 'get', 'files.info', 'GET', { canvas_id: 'F1' }],
	[Canvases, 'list', 'files.list', 'GET', {}],
	[
		Canvases,
		'sectionsLookup',
		'canvases.sections.lookup',
		'POST',
		{ canvas_id: 'F1', criteria: { contains_text: 'x' } },
	],
];

const CALL_CASES: Case[] = [
	[
		Calls,
		'add',
		'calls.add',
		'POST',
		{ external_unique_id: 'c1', join_url: 'https://x.test/c' },
	],
	[Calls, 'info', 'calls.info', 'GET', { id: 'R1' }],
	[Calls, 'update', 'calls.update', 'POST', { id: 'R1', title: 'sync' }],
	[Calls, 'end', 'calls.end', 'POST', { id: 'R1' }],
	[
		Calls,
		'participantsAdd',
		'calls.participants.add',
		'POST',
		{ id: 'R1', users: [{ slack_id: 'U1' }] },
	],
	[
		Calls,
		'participantsRemove',
		'calls.participants.remove',
		'POST',
		{ id: 'R1', users: [{ slack_id: 'U1' }] },
	],
];

const TEAM_CASES: Case[] = [
	[Team, 'info', 'team.info', 'GET', {}],
	[Team, 'profileGet', 'team.profile.get', 'GET', {}],
	[Team, 'emojiList', 'emoji.list', 'GET', {}],
	[
		Team,
		'unfurl',
		'chat.unfurl',
		'POST',
		{ channel: 'C1', ts: '1.1', unfurls: {} },
	],
	[Team, 'openDm', 'conversations.open', 'POST', { users: ['U1'] }],
];

const ALL_CASES: Case[] = [
	...FILE_CASES,
	...MESSAGE_CASES,
	...CONVERSATION_CASES,
	...USER_CASES,
	...REMINDER_CASES,
	...USERGROUP_CASES,
	...CANVAS_CASES,
	...CALL_CASES,
	...TEAM_CASES,
];

const NAMED_CASES = ALL_CASES.map(([group, op, slackMethod, verb, input]) => ({
	group,
	op,
	slackMethod,
	verb,
	input,
}));

describe('endpoints target the correct Slack Web API method', () => {
	it.each(NAMED_CASES)(
		'$op -> $slackMethod',
		async ({ group, op, slackMethod, verb, input }) => {
			const fn = group[op] as (c: unknown, i: unknown) => Promise<unknown>;
			await fn(makeCtx(), input);

			expect(requestMock).toHaveBeenCalled();
			const call = lastCall();
			expect(call.url).toBe(slackMethod);
			expect(call.method).toBe(verb);
		},
	);

	it('covers every operation the plugin exposes', () => {
		// Guards against an operation being added without a matching case here.
		expect(ALL_CASES).toHaveLength(83);
	});
});
