import { makeSlackRequest } from '../client';
import { getHistory, getReplies, listMine } from './channels';
import { search } from './messages';

jest.mock('../client', () => ({
	...jest.requireActual('../client'),
	makeSlackRequest: jest.fn().mockResolvedValue({ ok: true }),
}));

const mocked = makeSlackRequest as jest.Mock;

const ctxWith = (userToken: string | null | undefined) =>
	({
		key: 'xoxb-bot',
		keys:
			userToken === undefined
				? undefined
				: { get_user_token: async () => userToken },
		db: {},
		endpoints: {},
	}) as never;

const tokenUsed = () => mocked.mock.calls.at(-1)?.[1];

describe('slack user token', () => {
	beforeEach(() => mocked.mockClear());

	it.each([
		['search', () => search(ctxWith('xoxp-u'), { query: 'x' } as never)],
		['history', () => getHistory(ctxWith('xoxp-u'), { channel: 'D1' })],
		[
			'replies',
			() => getReplies(ctxWith('xoxp-u'), { channel: 'D1', ts: '1' }),
		],
		['users.conversations', () => listMine(ctxWith('xoxp-u'), {})],
	])('%s uses the user token when present', async (_n, run) => {
		await run();
		expect(tokenUsed()).toBe('xoxp-u');
	});

	it.each([null, undefined])('falls back to the bot token (%s)', async (t) => {
		await search(ctxWith(t), { query: 'x' } as never);
		expect(tokenUsed()).toBe('xoxb-bot');
	});

	it('falls back when the keystore throws', async () => {
		const ctx = {
			key: 'xoxb-bot',
			keys: {
				get_user_token: async () => {
					throw new Error('boom');
				},
			},
			db: {},
		} as never;
		await getHistory(ctx, { channel: 'C1' });
		expect(tokenUsed()).toBe('xoxb-bot');
	});
});
