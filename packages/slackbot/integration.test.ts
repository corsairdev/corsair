/**
 * Behavioural coverage for the operations that are more than a single mapped
 * Slack call: the multi-step upload, the authenticated download, the two
 * paginating search helpers, and the array-to-CSV conversion the Slack Web API
 * requires. Also covers the `ok: false` envelope, which arrives as HTTP 200 and
 * would otherwise pass for success.
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

import { makeSlackbotRequest, SlackbotAPIError } from './client';
import { Conversations, Files, Users } from './endpoints';

function makeCtx() {
	return { key: 'xoxb-test-token', db: {}, options: {} } as never;
}

interface RequestOptions {
	url: string;
	method: string;
	body?: Record<string, unknown>;
	query?: Record<string, unknown>;
}

function callAt(i: number): RequestOptions {
	return requestMock.mock.calls[i][1] as RequestOptions;
}

beforeEach(() => {
	requestMock.mockReset();
	requestMock.mockResolvedValue({ ok: true });
});

describe('Slack error envelope', () => {
	it('raises when Slack answers HTTP 200 with ok:false', async () => {
		requestMock.mockResolvedValue({ ok: false, error: 'channel_not_found' });

		await expect(
			makeSlackbotRequest('chat.postMessage', 'token', { method: 'POST' }),
		).rejects.toThrow(SlackbotAPIError);
	});

	it('carries the Slack error code through as the error code', async () => {
		requestMock.mockResolvedValue({ ok: false, error: 'not_in_channel' });

		await expect(
			makeSlackbotRequest('chat.postMessage', 'token', { method: 'POST' }),
		).rejects.toMatchObject({ code: 'not_in_channel' });
	});

	it('passes through a successful envelope untouched', async () => {
		requestMock.mockResolvedValue({ ok: true, ts: '1700000000.1' });

		const result = await makeSlackbotRequest<{ ts: string }>(
			'chat.postMessage',
			'token',
			{ method: 'POST' },
		);
		expect(result.ts).toBe('1700000000.1');
	});
});

describe('array inputs are sent as comma-delimited strings', () => {
	it('joins conversation invite users', async () => {
		await Conversations.invite(makeCtx(), {
			channel: 'C1',
			users: ['U1', 'U2', 'U3'],
		});
		expect(callAt(0).body?.users).toBe('U1,U2,U3');
	});

	it('joins conversation type filters', async () => {
		await Conversations.list(makeCtx(), {
			types: ['public_channel', 'private_channel'],
		});
		expect(callAt(0).query?.types).toBe('public_channel,private_channel');
	});

	it('omits the parameter entirely when the array is empty', async () => {
		await Conversations.list(makeCtx(), { types: [] });
		expect(callAt(0).query?.types).toBeUndefined();
	});
});

describe('conversations.find', () => {
	it('filters channels by substring and reports an exhausted crawl', async () => {
		requestMock.mockResolvedValueOnce({
			ok: true,
			channels: [
				{ id: 'C1', name: 'engineering' },
				{ id: 'C2', name: 'design' },
				{ id: 'C3', name: 'eng-leads' },
			],
			response_metadata: { next_cursor: '' },
		});

		const result = await Conversations.find(makeCtx(), { query: 'eng' });

		expect(result.channels.map((c) => c.id)).toEqual(['C1', 'C3']);
		expect(result.truncated).toBe(false);
		expect(result.pages_scanned).toBe(1);
	});

	it('follows the cursor across pages', async () => {
		requestMock
			.mockResolvedValueOnce({
				ok: true,
				channels: [{ id: 'C1', name: 'alpha' }],
				response_metadata: { next_cursor: 'page2' },
			})
			.mockResolvedValueOnce({
				ok: true,
				channels: [{ id: 'C2', name: 'alpha-two' }],
				response_metadata: { next_cursor: '' },
			});

		const result = await Conversations.find(makeCtx(), { query: 'alpha' });

		expect(result.pages_scanned).toBe(2);
		expect(result.channels).toHaveLength(2);
		expect(callAt(1).query?.cursor).toBe('page2');
	});

	it('stops at max_pages and flags the result as truncated', async () => {
		requestMock.mockResolvedValue({
			ok: true,
			channels: [{ id: 'C1', name: 'alpha' }],
			response_metadata: { next_cursor: 'more' },
		});

		const result = await Conversations.find(makeCtx(), {
			query: 'alpha',
			max_pages: 2,
		});

		expect(result.truncated).toBe(true);
		expect(result.pages_scanned).toBe(2);
	});

	it('honours exact matching', async () => {
		requestMock.mockResolvedValueOnce({
			ok: true,
			channels: [
				{ id: 'C1', name: 'eng' },
				{ id: 'C2', name: 'engineering' },
			],
			response_metadata: { next_cursor: '' },
		});

		const result = await Conversations.find(makeCtx(), {
			query: 'eng',
			match: 'exact',
		});
		expect(result.channels.map((c) => c.id)).toEqual(['C1']);
	});
});

describe('users.find', () => {
	it('matches on display name and email, excluding bots by default', async () => {
		requestMock.mockResolvedValueOnce({
			ok: true,
			members: [
				{ id: 'U1', name: 'ada', profile: { email: 'ada@corp.test' } },
				{ id: 'U2', name: 'buildbot', is_bot: true, profile: {} },
				{ id: 'U3', name: 'zed', profile: { display_name: 'Ada Z' } },
			],
			response_metadata: { next_cursor: '' },
		});

		const result = await Users.find(makeCtx(), { query: 'ada' });

		expect(result.members.map((m) => m.id)).toEqual(['U1', 'U3']);
	});

	it('includes bots when asked', async () => {
		requestMock.mockResolvedValueOnce({
			ok: true,
			members: [{ id: 'U2', name: 'adabot', is_bot: true, profile: {} }],
			response_metadata: { next_cursor: '' },
		});

		const result = await Users.find(makeCtx(), {
			query: 'ada',
			include_bots: true,
		});
		expect(result.members).toHaveLength(1);
	});

	it('excludes deactivated accounts by default', async () => {
		requestMock.mockResolvedValueOnce({
			ok: true,
			members: [{ id: 'U9', name: 'ada', deleted: true, profile: {} }],
			response_metadata: { next_cursor: '' },
		});

		const result = await Users.find(makeCtx(), { query: 'ada' });
		expect(result.members).toHaveLength(0);
	});
});

describe('files.upload', () => {
	const originalFetch = globalThis.fetch;
	afterEach(() => {
		globalThis.fetch = originalFetch;
	});

	it('reserves a URL, PUTs the bytes, then completes the upload', async () => {
		const fetchMock = jest.fn().mockResolvedValue({ ok: true, status: 200 });
		globalThis.fetch = fetchMock as unknown as typeof fetch;

		requestMock
			.mockResolvedValueOnce({
				ok: true,
				upload_url: 'https://files.slack.test/upload/abc',
				file_id: 'F123',
			})
			.mockResolvedValueOnce({ ok: true, files: [{ id: 'F123' }] });

		const result = await Files.upload(makeCtx(), {
			filename: 'notes.txt',
			content: Buffer.from('hello slack').toString('base64'),
		});

		// Step 1 reserves an upload slot sized to the decoded payload.
		expect(callAt(0).url).toBe('files.getUploadURLExternal');
		expect(callAt(0).query?.length).toBe('hello slack'.length);

		// Step 2 sends the bytes to the returned storage URL, not the Slack API.
		expect(fetchMock).toHaveBeenCalledWith(
			'https://files.slack.test/upload/abc',
			expect.objectContaining({ method: 'POST' }),
		);

		// Step 3 finalises against the reserved file id.
		expect(callAt(1).url).toBe('files.completeUploadExternal');
		expect(result.files?.[0]?.id).toBe('F123');
	});

	it('raises when Slack returns no upload target', async () => {
		requestMock.mockResolvedValueOnce({ ok: true });

		await expect(
			Files.upload(makeCtx(), { filename: 'a.txt', content: 'eA==' }),
		).rejects.toThrow(SlackbotAPIError);
	});

	it('raises when the storage PUT fails', async () => {
		globalThis.fetch = jest
			.fn()
			.mockResolvedValue({ ok: false, status: 500 }) as unknown as typeof fetch;

		requestMock.mockResolvedValueOnce({
			ok: true,
			upload_url: 'https://files.slack.test/upload/abc',
			file_id: 'F123',
		});

		await expect(
			Files.upload(makeCtx(), { filename: 'a.txt', content: 'eA==' }),
		).rejects.toMatchObject({ code: 'upload_failed' });
	});
});

describe('files.download', () => {
	const originalFetch = globalThis.fetch;
	afterEach(() => {
		globalThis.fetch = originalFetch;
	});

	it('resolves the private URL and fetches it with the bot token', async () => {
		const body = Buffer.from('file contents');
		const fetchMock = jest.fn().mockResolvedValue({
			ok: true,
			status: 200,
			headers: new Map([['content-type', 'text/plain']]),
			arrayBuffer: async () => body,
		});
		// `headers.get` is the only Headers API the endpoint uses.
		globalThis.fetch = fetchMock as unknown as typeof fetch;

		requestMock.mockResolvedValueOnce({
			ok: true,
			file: { id: 'F1', url_private_download: 'https://files.slack.test/f/F1' },
		});

		const result = await Files.download(makeCtx(), { file: 'F1' });

		expect(fetchMock).toHaveBeenCalledWith(
			'https://files.slack.test/f/F1',
			expect.objectContaining({
				headers: { Authorization: 'Bearer xoxb-test-token' },
			}),
		);
		expect(Buffer.from(result.content, 'base64').toString()).toBe(
			'file contents',
		);
		expect(result.byte_size).toBe(body.byteLength);
	});

	it('raises when the file exposes no private URL', async () => {
		requestMock.mockResolvedValueOnce({ ok: true, file: { id: 'F1' } });

		await expect(
			Files.download(makeCtx(), { file: 'F1' }),
		).rejects.toMatchObject({ code: 'no_download_url' });
	});

	it('rejects an oversized file before transferring it', async () => {
		const fetchMock = jest.fn();
		globalThis.fetch = fetchMock as unknown as typeof fetch;

		requestMock.mockResolvedValueOnce({
			ok: true,
			file: {
				id: 'F1',
				size: 50_000,
				url_private: 'https://files.slack.test/f/F1',
			},
		});

		await expect(
			Files.download(makeCtx(), { file: 'F1', max_bytes: 1000 }),
		).rejects.toMatchObject({ code: 'file_too_large' });
		// The guard must fire before any bytes move.
		expect(fetchMock).not.toHaveBeenCalled();
	});
});
