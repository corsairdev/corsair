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

import {
	makeSlackbotRequest,
	SLACKBOT_RATE_LIMIT_CONFIG,
	SlackbotAPIError,
} from './client';
import { Conversations, Files, Messages, Users } from './endpoints';
import { errorHandlers } from './error-handlers';

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

	it('reserves a URL, POSTs the bytes, then completes the upload', async () => {
		const fetchMock = jest.fn().mockResolvedValue({ ok: true, status: 200 });
		globalThis.fetch = fetchMock as unknown as typeof fetch;

		requestMock
			.mockResolvedValueOnce({
				ok: true,
				upload_url: 'https://files.slack.com/upload/abc',
				file_id: 'F123',
			})
			.mockResolvedValueOnce({ ok: true, files: [{ id: 'F123' }] });

		const result = await Files.upload(makeCtx(), {
			filename: 'notes.txt',
			content: Buffer.from('hello slack').toString('base64'),
		});

		expect(callAt(0).url).toBe('files.getUploadURLExternal');
		expect(callAt(0).query?.length).toBe('hello slack'.length);

		expect(fetchMock).toHaveBeenCalledWith(
			'https://files.slack.com/upload/abc',
			expect.objectContaining({ method: 'POST' }),
		);

		expect(callAt(1).url).toBe('files.completeUploadExternal');
		expect(result.files?.[0]?.id).toBe('F123');
	});

	it('raises when Slack returns no upload target', async () => {
		requestMock.mockResolvedValueOnce({ ok: true });

		await expect(
			Files.upload(makeCtx(), { filename: 'a.txt', content: 'eA==' }),
		).rejects.toThrow(SlackbotAPIError);
	});

	it('raises when the storage POST fails', async () => {
		globalThis.fetch = jest
			.fn()
			.mockResolvedValue({ ok: false, status: 500 }) as unknown as typeof fetch;

		requestMock.mockResolvedValueOnce({
			ok: true,
			upload_url: 'https://files.slack.com/upload/abc',
			file_id: 'F123',
		});

		await expect(
			Files.upload(makeCtx(), { filename: 'a.txt', content: 'eA==' }),
		).rejects.toMatchObject({ code: 'upload_failed' });
	});

	it('refuses to POST bytes to a non-Slack upload host', async () => {
		const fetchMock = jest.fn();
		globalThis.fetch = fetchMock as unknown as typeof fetch;
		requestMock.mockResolvedValueOnce({
			ok: true,
			upload_url: 'https://evil.example.com/upload',
			file_id: 'F123',
		});

		await expect(
			Files.upload(makeCtx(), { filename: 'a.txt', content: 'eA==' }),
		).rejects.toMatchObject({ code: 'external_file_url' });
		expect(fetchMock).not.toHaveBeenCalled();
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
			file: { id: 'F1', url_private_download: 'https://files.slack.com/f/F1' },
		});

		const result = await Files.download(makeCtx(), { file: 'F1' });

		expect(fetchMock).toHaveBeenCalledWith(
			'https://files.slack.com/f/F1',
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
				url_private: 'https://files.slack.com/f/F1',
			},
		});

		await expect(
			Files.download(makeCtx(), { file: 'F1', max_bytes: 1000 }),
		).rejects.toMatchObject({ code: 'file_too_large' });
		// The guard must fire before any bytes move.
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

// ─────────────────────────────────────────────────────────────────────────────
// Regressions from review round 1.
// ─────────────────────────────────────────────────────────────────────────────

describe('retry ownership', () => {
	it('leaves retrying entirely to the error policy', () => {
		// Both layers retrying would compound: the transport's attempts multiply
		// by the policy's re-runs, turning one operation into dozens of requests
		// with two stacked backoffs.
		expect(SLACKBOT_RATE_LIMIT_CONFIG.maxRetries).toBe(0);
	});

	it('still parses Retry-After so the policy can honour it', () => {
		expect(SLACKBOT_RATE_LIMIT_CONFIG.headerNames?.retryAfter).toBe(
			'Retry-After',
		);
	});

	it('has a policy that does retry rate limits', async () => {
		const err = Object.assign(new Error('ratelimited'), { status: 429 });
		expect(errorHandlers.RATE_LIMIT_ERROR.match(err)).toBe(true);
		const result = await errorHandlers.RATE_LIMIT_ERROR.handler(err);
		expect(result.maxRetries).toBeGreaterThan(0);
	});

	it('does not treat an arbitrary 429 substring as a rate limit', () => {
		expect(
			errorHandlers.RATE_LIMIT_ERROR.match(new Error('missing file F429')),
		).toBe(false);
	});
});

describe('files.upload reservation contract', () => {
	const originalFetch = globalThis.fetch;
	afterEach(() => {
		globalThis.fetch = originalFetch;
	});

	function mockUploadFlow() {
		globalThis.fetch = jest
			.fn()
			.mockResolvedValue({ ok: true, status: 200 }) as unknown as typeof fetch;
		requestMock
			.mockResolvedValueOnce({
				ok: true,
				upload_url: 'https://files.slack.com/upload/abc',
				file_id: 'F123',
			})
			.mockResolvedValueOnce({ ok: true, files: [{ id: 'F123' }] });
	}

	it('sends alt_txt and snippet_type on the reservation', async () => {
		mockUploadFlow();
		await Files.upload(makeCtx(), {
			filename: 'a.py',
			content: 'eA==',
			alt_txt: 'a script',
			snippet_type: 'python',
		});
		expect(callAt(0).url).toBe('files.getUploadURLExternal');
		expect(callAt(0).query).toMatchObject({
			alt_txt: 'a script',
			snippet_type: 'python',
		});
	});

	it('sends only id and title to completeUploadExternal', async () => {
		// Slack ignores alt_txt/snippet_type here, so including them would
		// silently drop both rather than erroring.
		mockUploadFlow();
		await Files.upload(makeCtx(), {
			filename: 'a.py',
			content: 'eA==',
			alt_txt: 'a script',
			snippet_type: 'python',
		});
		const files = callAt(1).body?.files as Record<string, unknown>[];
		expect(Object.keys(files[0] ?? {}).sort()).toEqual(['id', 'title']);
	});
});

describe('files.download credential safety', () => {
	const originalFetch = globalThis.fetch;
	afterEach(() => {
		globalThis.fetch = originalFetch;
	});

	function withFileUrl(url: string) {
		requestMock.mockResolvedValueOnce({
			ok: true,
			file: { id: 'F1', url_private: url },
		});
	}

	it('refuses to send the bot token to a non-Slack host', async () => {
		// A remote file (is_external) carries a third-party url_private; sending
		// the workspace token there would leak it to that host.
		const fetchMock = jest.fn();
		globalThis.fetch = fetchMock as unknown as typeof fetch;
		withFileUrl('https://evil.example.com/steal/F1');

		await expect(
			Files.download(makeCtx(), { file: 'F1' }),
		).rejects.toMatchObject({ code: 'external_file_url' });
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a lookalike domain', async () => {
		const fetchMock = jest.fn();
		globalThis.fetch = fetchMock as unknown as typeof fetch;
		withFileUrl('https://evil-slack.com/files/F1');

		await expect(
			Files.download(makeCtx(), { file: 'F1' }),
		).rejects.toMatchObject({ code: 'external_file_url' });
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a plaintext http URL', async () => {
		const fetchMock = jest.fn();
		globalThis.fetch = fetchMock as unknown as typeof fetch;
		withFileUrl('http://files.slack.com/files/F1');

		await expect(
			Files.download(makeCtx(), { file: 'F1' }),
		).rejects.toMatchObject({ code: 'external_file_url' });
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('allows a Slack subdomain and attaches the token there', async () => {
		const body = Buffer.from('ok');
		const fetchMock = jest.fn().mockResolvedValue({
			ok: true,
			status: 200,
			headers: new Map([['content-type', 'text/plain']]),
			body: null,
			arrayBuffer: async () => body,
		});
		globalThis.fetch = fetchMock as unknown as typeof fetch;
		withFileUrl('https://files.slack.com/files-pri/T1-F1/x.txt');

		const result = await Files.download(makeCtx(), { file: 'F1' });

		expect(fetchMock).toHaveBeenCalledWith(
			'https://files.slack.com/files-pri/T1-F1/x.txt',
			expect.objectContaining({
				headers: { Authorization: 'Bearer xoxb-test-token' },
				redirect: 'manual',
			}),
		);
		expect(Buffer.from(result.content, 'base64').toString()).toBe('ok');
	});

	it('does not follow a redirect off Slack with the bot token', async () => {
		const fetchMock = jest.fn().mockResolvedValue({
			ok: false,
			status: 302,
			headers: new Map([['location', 'https://evil.example.com/steal']]),
			body: null,
		});
		globalThis.fetch = fetchMock as unknown as typeof fetch;
		withFileUrl('https://files.slack.com/files-pri/T1-F1/x.txt');

		await expect(
			Files.download(makeCtx(), { file: 'F1' }),
		).rejects.toMatchObject({ code: 'external_file_url' });
		expect(fetchMock).toHaveBeenCalledTimes(1);
		expect(fetchMock.mock.calls[0]?.[0]).toBe(
			'https://files.slack.com/files-pri/T1-F1/x.txt',
		);
	});

	it('follows a redirect that stays on a Slack host', async () => {
		const body = Buffer.from('ok');
		const fetchMock = jest
			.fn()
			.mockResolvedValueOnce({
				ok: false,
				status: 302,
				headers: new Map([
					['location', 'https://files.slack.com/files-pri/T1-F1/real.txt'],
				]),
				body: null,
			})
			.mockResolvedValueOnce({
				ok: true,
				status: 200,
				headers: new Map([['content-type', 'text/plain']]),
				body: null,
				arrayBuffer: async () => body,
			});
		globalThis.fetch = fetchMock as unknown as typeof fetch;
		withFileUrl('https://files.slack.com/files-pri/T1-F1/x.txt');

		const result = await Files.download(makeCtx(), { file: 'F1' });

		expect(fetchMock).toHaveBeenCalledTimes(2);
		expect(fetchMock.mock.calls[1]?.[0]).toBe(
			'https://files.slack.com/files-pri/T1-F1/real.txt',
		);
		expect(Buffer.from(result.content, 'base64').toString()).toBe('ok');
	});
});

describe('files.download size bounding', () => {
	const originalFetch = globalThis.fetch;
	afterEach(() => {
		globalThis.fetch = originalFetch;
	});

	/** A response whose size Slack did not declare, streamed in chunks. */
	function streamingResponse(chunks: Buffer[]) {
		let i = 0;
		const cancel = jest.fn().mockResolvedValue(undefined);
		const reader = {
			read: async () =>
				i < chunks.length
					? { done: false, value: new Uint8Array(chunks[i++] as Buffer) }
					: { done: true, value: undefined },
			cancel,
			releaseLock: () => undefined,
		};
		return {
			response: {
				ok: true,
				status: 200,
				headers: new Map([['content-type', 'application/octet-stream']]),
				body: { getReader: () => reader },
			},
			cancel,
		};
	}

	it('aborts mid-stream once max_bytes is exceeded', async () => {
		// Slack omitted `size`, so the declared-size guard cannot fire and the
		// stream itself has to be bounded.
		const { response, cancel } = streamingResponse([
			Buffer.alloc(600),
			Buffer.alloc(600),
		]);
		globalThis.fetch = jest
			.fn()
			.mockResolvedValue(response) as unknown as typeof fetch;
		requestMock.mockResolvedValueOnce({
			ok: true,
			file: { id: 'F1', url_private: 'https://files.slack.com/f/F1' },
		});

		await expect(
			Files.download(makeCtx(), { file: 'F1', max_bytes: 1000 }),
		).rejects.toMatchObject({ code: 'file_too_large' });
		expect(cancel).toHaveBeenCalled();
	});

	it('returns a stream that stays within the limit', async () => {
		const { response } = streamingResponse([
			Buffer.from('he'),
			Buffer.from('llo'),
		]);
		globalThis.fetch = jest
			.fn()
			.mockResolvedValue(response) as unknown as typeof fetch;
		requestMock.mockResolvedValueOnce({
			ok: true,
			file: { id: 'F1', url_private: 'https://files.slack.com/f/F1' },
		});

		const result = await Files.download(makeCtx(), {
			file: 'F1',
			max_bytes: 1000,
		});
		expect(Buffer.from(result.content, 'base64').toString()).toBe('hello');
		expect(result.byte_size).toBe(5);
	});
});

describe('message cache key', () => {
	// The webhook handlers key `db.messages` on `${channel}:${ts}` (pinned by
	// the matching suite in webhooks.test.ts). The `chat.*` endpoints write to
	// that same table, so they have to use the same scheme. Keying on a bare
	// `ts` here would store one Slack message as two rows, leave an update
	// invisible to the row the webhook wrote, and let a delete miss it
	// entirely. The literal keys below are deliberate: they pin both writers
	// to one scheme, so changing either side alone fails a test.
	const TS = '1700000000.000100';

	function makeCachingCtx() {
		const upserts: { key: string; id: unknown }[] = [];
		const deletes: string[] = [];
		const ctx = {
			key: 'xoxb-test-token',
			options: {},
			db: {
				messages: {
					upsertByEntityId: async (
						key: string,
						row: Record<string, unknown>,
					) => {
						upserts.push({ key, id: row.id });
						return { id: key };
					},
					deleteByEntityId: async (key: string) => {
						deletes.push(key);
					},
				},
			},
		} as never;
		return { ctx, upserts, deletes };
	}

	it('caches a posted message under channel:ts', async () => {
		requestMock.mockResolvedValueOnce({
			ok: true,
			channel: 'C1',
			ts: TS,
			message: { text: 'hi' },
		});
		const { ctx, upserts } = makeCachingCtx();

		await Messages.post(ctx, { channel: 'C1', text: 'hi' });

		expect(upserts).toEqual([{ key: `C1:${TS}`, id: `C1:${TS}` }]);
	});

	it('falls back to the requested channel when the response omits it', async () => {
		requestMock.mockResolvedValueOnce({ ok: true, ts: TS });
		const { ctx, upserts } = makeCachingCtx();

		await Messages.post(ctx, { channel: 'C1', text: 'hi' });

		expect(upserts.map((u) => u.key)).toEqual([`C1:${TS}`]);
	});

	it('updates the row the webhook wrote rather than a second one', async () => {
		requestMock.mockResolvedValueOnce({
			ok: true,
			channel: 'C1',
			ts: TS,
			text: 'edited',
		});
		const { ctx, upserts } = makeCachingCtx();

		await Messages.update(ctx, { channel: 'C1', ts: TS, text: 'edited' });

		expect(upserts).toEqual([{ key: `C1:${TS}`, id: `C1:${TS}` }]);
	});

	it('evicts the row the webhook wrote when a message is deleted', async () => {
		requestMock.mockResolvedValueOnce({ ok: true });
		const { ctx, deletes } = makeCachingCtx();

		await Messages.delete(ctx, { channel: 'C1', ts: TS });

		expect(deletes).toEqual([`C1:${TS}`]);
	});

	it('keeps identical timestamps in different channels distinct', async () => {
		requestMock
			.mockResolvedValueOnce({ ok: true, channel: 'C1', ts: TS })
			.mockResolvedValueOnce({ ok: true, channel: 'C2', ts: TS });
		const { ctx, upserts } = makeCachingCtx();

		await Messages.post(ctx, { channel: 'C1', text: 'hi' });
		await Messages.post(ctx, { channel: 'C2', text: 'hi' });

		expect(new Set(upserts.map((u) => u.key)).size).toBe(2);
	});
});
