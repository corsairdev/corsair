import { makeSlackRequest } from '../client';
import type { SlackContext } from '../index';
import { getHistory, getReplies, listMine } from './channels';
import { search } from './messages';

jest.mock('../client', () => ({
	...jest.requireActual('../client'),
	makeSlackRequest: jest.fn().mockResolvedValue({ ok: true }),
}));

const mocked = makeSlackRequest as jest.Mock;

type Keys = {
	get_access_token?: () => Promise<string | null>;
	get_user_token?: () => Promise<string | null>;
};

// The endpoints read only key, keys, db and endpoints; a full SlackContext
// carries the whole plugin runtime, so the stand-in is cast once, here.
const ctxOf = (key: string, keys?: Keys): SlackContext =>
	({ key, keys, db: {}, endpoints: {} }) as unknown as SlackContext;

const connected = (user: string | null) =>
	ctxOf('xoxb-bot', {
		get_access_token: async () => 'xoxb-bot',
		get_user_token: async () => user,
	});

const tokenUsed = () => mocked.mock.calls.at(-1)?.[1];

describe('slack user token', () => {
	beforeEach(() => mocked.mockClear());

	it.each([
		['search', () => search(connected('xoxp-u'), { query: 'x' })],
		['history', () => getHistory(connected('xoxp-u'), { channel: 'D1' })],
		[
			'replies',
			() => getReplies(connected('xoxp-u'), { channel: 'D1', ts: '1' }),
		],
		['users.conversations', () => listMine(connected('xoxp-u'), {})],
	])('%s uses the user token when present', async (_n, run) => {
		await run();
		expect(tokenUsed()).toBe('xoxp-u');
	});

	it('keeps the bot token when the connection has no user token', async () => {
		await search(connected(null), { query: 'x' });
		expect(tokenUsed()).toBe('xoxb-bot');
	});

	it('keeps the bot token without a key manager', async () => {
		await search(ctxOf('xoxb-bot'), { query: 'x' });
		expect(tokenUsed()).toBe('xoxb-bot');
	});

	it('keeps a key the caller chose over the stored user token', async () => {
		const ctx = ctxOf('xoxb-other', {
			get_access_token: async () => 'xoxb-bot',
			get_user_token: async () => 'xoxp-u',
		});
		await search(ctx, { query: 'x' });
		expect(tokenUsed()).toBe('xoxb-other');
	});

	it('falls back when the keystore throws', async () => {
		const ctx = ctxOf('xoxb-bot', {
			get_access_token: async () => 'xoxb-bot',
			get_user_token: async () => {
				throw new Error('boom');
			},
		});
		await getHistory(ctx, { channel: 'C1' });
		expect(tokenUsed()).toBe('xoxb-bot');
	});

	it('rejects listMine input its schema does not allow', async () => {
		// A wrong type on purpose: the schema, not TypeScript, must refuse it at runtime.
		await expect(
			listMine(connected('xoxp-u'), { limit: 'many' as unknown as number }),
		).rejects.toThrow();
	});
});
