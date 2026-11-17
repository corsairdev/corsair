import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import { signViewerPolicy } from './client';
import {
	createComparison,
	deleteComparison,
	getComparison,
	getViewerUrl,
	listComparisons,
} from './endpoints/comparisons';
import { createExport, getExport } from './endpoints/exports';
import type { DraftableContext } from './index';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return {
		...actual,
		logEventFromContext: jest.fn().mockResolvedValue(undefined),
	};
});

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return {
		...actual,
		request: jest.fn(),
	};
});

const mockRequest = jest.mocked(request);
const mockLog = jest.mocked(logEventFromContext);

function context(
	key: string,
	db?: { upsert?: jest.Mock; find?: jest.Mock; remove?: jest.Mock },
): DraftableContext {
	return {
		key,
		db: db
			? {
					comparisons: {
						upsertByEntityId: db.upsert ?? jest.fn(),
						findByEntityId: db.find ?? jest.fn().mockResolvedValue(null),
						deleteByEntityId: db.remove ?? jest.fn(),
					},
				}
			: undefined,
		// unknown: a partial test double of the plugin context.
	} as unknown as DraftableContext;
}

function lastCall() {
	return {
		config: mockRequest.mock.calls.at(-1)?.[0],
		options: mockRequest.mock.calls.at(-1)?.[1],
	};
}

// Trimmed from a live reply (11-17, testing credentials).
const COMPARISON = {
	identifier: 'cmp-1',
	comparison_type: 'side_by_side',
	viewer_url: 'https://api.draftable.com/v1/comparisons/viewer/acct-test/cmp-1',
	left: {
		source_url: 'https://example.com/left.pdf',
		display_name: 'left.pdf',
		file_type: 'pdf',
		page_count: 4,
	},
	right: {
		source_url: 'https://example.com/right.pdf',
		file_type: 'pdf',
		page_count: 4,
	},
	creation_time: '2026-11-17T06:07:33.836424Z',
	ready: true,
	ready_time: '2026-11-17T06:07:34.522924Z',
	failed: false,
};
const EXPORT = {
	identifier: 'LDwVznhV',
	comparison: 'cmp-1',
	kind: 'combined',
	ready: false,
	url: null,
	failed: false,
	error_message: null,
	include_cover_page: false,
};
const SIDES = {
	left: {
		source_url: 'https://example.com/left.pdf',
		file_type: 'pdf' as const,
	},
	right: {
		source_url: 'https://example.com/right.pdf',
		file_type: 'docx' as const,
		display_name: 'v2.docx',
	},
};

beforeEach(() => {
	jest.clearAllMocks();
	mockRequest.mockReset();
});

describe('wire format of every operation', () => {
	// unknown: one table holds every operation, each with its own input and reply shape.
	type Case = {
		name: string;
		run: (ctx: DraftableContext) => Promise<unknown>;
		reply: unknown;
		expected?: unknown;
		method: string;
		url: string;
		query?: Record<string, unknown>;
		body?: unknown;
		event: string;
		payload: Record<string, unknown>;
	};

	const cases: Case[] = [
		{
			name: 'comparisons.list',
			run: (ctx) => listComparisons(ctx, { limit: 5, offset: 10 }),
			reply: { count: 11, limit: 5, offset: 10, results: [COMPARISON] },
			method: 'GET',
			url: '/v1/comparisons',
			query: { limit: 5, offset: 10 },
			event: 'draftable.comparisons.list',
			payload: { offset: 10 },
		},
		{
			name: 'comparisons.get',
			run: (ctx) => getComparison(ctx, { identifier: 'cmp-1' }),
			reply: COMPARISON,
			method: 'GET',
			url: '/v1/comparisons/cmp-1',
			event: 'draftable.comparisons.get',
			payload: { identifier: 'cmp-1' },
		},
		{
			name: 'comparisons.create',
			run: (ctx) =>
				createComparison(ctx, {
					...SIDES,
					identifier: 'my-cmp',
					public: false,
					expiry_time: '2026-12-01T00:00:00Z',
				}),
			reply: { ...COMPARISON, identifier: 'my-cmp', ready: false },
			method: 'POST',
			url: '/v1/comparisons',
			body: {
				...SIDES,
				identifier: 'my-cmp',
				public: false,
				expiry_time: '2026-12-01T00:00:00Z',
			},
			event: 'draftable.comparisons.create',
			payload: {},
		},
		{
			name: 'comparisons.delete',
			run: (ctx) => deleteComparison(ctx, { identifier: 'cmp-1' }),
			reply: undefined,
			expected: { identifier: 'cmp-1', deleted: true },
			method: 'DELETE',
			url: '/v1/comparisons/cmp-1',
			event: 'draftable.comparisons.delete',
			payload: { identifier: 'cmp-1' },
		},
		{
			name: 'exports.create',
			run: (ctx) =>
				createExport(ctx, {
					comparison: 'cmp-1',
					kind: 'combined',
					include_cover_page: false,
				}),
			reply: EXPORT,
			method: 'POST',
			url: '/v1/exports',
			body: {
				comparison: 'cmp-1',
				kind: 'combined',
				include_cover_page: false,
			},
			event: 'draftable.exports.create',
			payload: { comparison: 'cmp-1' },
		},
		{
			name: 'exports.get',
			run: (ctx) => getExport(ctx, { identifier: 'LDwVznhV' }),
			reply: { ...EXPORT, ready: true, url: 'https://files.example.com/x.pdf' },
			method: 'GET',
			url: '/v1/exports/LDwVznhV',
			event: 'draftable.exports.get',
			payload: { identifier: 'LDwVznhV' },
		},
	];

	it.each(cases)('$name sends $method $url', async (c) => {
		mockRequest.mockResolvedValue(c.reply as never);
		const result = await c.run(context('test-key'));
		expect(result).toEqual(c.expected ?? c.reply);
		const { config, options } = lastCall();
		expect(config?.BASE).toBe('https://api.draftable.com');
		expect(config?.TOKEN).toBeUndefined();
		expect(config?.HEADERS).toMatchObject({ Authorization: 'Token test-key' });
		expect(options?.method).toBe(c.method);
		expect(options?.url).toBe(c.url);
		if (c.query) expect(options?.query).toEqual(c.query);
		if (c.body === undefined) {
			expect(options?.body).toBeUndefined();
		} else {
			expect(options?.body).toEqual(c.body);
			expect(options?.mediaType).toBe('application/json');
		}
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			c.event,
			c.payload,
			'completed',
		);
		expect(
			JSON.stringify(mockLog.mock.calls.map((call) => call[2])),
		).not.toContain('test-key');
		// Core's own 429 retries stay on: no rate-limit override is passed.
		expect(mockRequest.mock.calls.at(-1)?.[2]).toBeUndefined();
	});

	it.each(cases)('$name throws AuthMissingError without a key', async (c) => {
		await expect(c.run(context(''))).rejects.toBeInstanceOf(AuthMissingError);
		expect(mockRequest).not.toHaveBeenCalled();
	});
});

describe('comparisons.getViewerUrl', () => {
	it('signs a private comparison link like the official clients', async () => {
		mockRequest.mockResolvedValue(COMPARISON as never);
		jest.spyOn(Date, 'now').mockReturnValue(1_800_000_000_000);
		const result = await getViewerUrl(context('test-key'), {
			identifier: 'cmp-1',
			valid_for_minutes: 10,
			wait: true,
		});
		const validUntil = 1_800_000_000 + 600;
		// Fixed vector from Draftable's Python client algorithm (signing.py:
		// OrderedDict account_id, identifier, valid_until; json.dumps with
		// separators (',', ':'); hex HMAC-SHA256 keyed with the token).
		const signature =
			'18a47a0cf327b207fa581223551bfe139189ee9bdcd908280c43b50dec020b0e';
		expect(result).toEqual({
			identifier: 'cmp-1',
			url: `${COMPARISON.viewer_url}?valid_until=${validUntil}&signature=${signature}&wait`,
			signed: true,
			valid_until: new Date(validUntil * 1000).toISOString(),
		});
		expect(lastCall().options?.url).toBe('/v1/comparisons/cmp-1');
		jest.restoreAllMocks();
	});

	it('matches a known HMAC-SHA256 of the JSON policy', async () => {
		// Node crypto: createHmac('sha256','k').update('{"account_id":"a","identifier":"i","valid_until":1}').digest('hex')
		const { createHmac } = await import('node:crypto');
		const expected = createHmac('sha256', 'k')
			.update('{"account_id":"a","identifier":"i","valid_until":1}')
			.digest('hex');
		await expect(
			signViewerPolicy('k', {
				account_id: 'a',
				identifier: 'i',
				valid_until: 1,
			}),
		).resolves.toBe(expected);
	});

	it('returns the plain link for a public comparison', async () => {
		mockRequest.mockResolvedValue({ ...COMPARISON, public: true } as never);
		const result = await getViewerUrl(context('k'), { identifier: 'cmp-1' });
		expect(result).toEqual({
			identifier: 'cmp-1',
			url: COMPARISON.viewer_url,
			signed: false,
			valid_until: null,
		});
	});

	it('refuses a viewer_url on another host', async () => {
		mockRequest.mockResolvedValue({
			...COMPARISON,
			viewer_url: 'https://evil.example.com/v1/comparisons/viewer/a/cmp-1',
		} as never);
		await expect(
			getViewerUrl(context('k'), { identifier: 'cmp-1' }),
		).rejects.toThrow(/viewer_url/);
	});
});

describe('inputs and responses', () => {
	it('encodes ids so they cannot add path segments', async () => {
		mockRequest.mockResolvedValue(COMPARISON as never);
		await getComparison(context('k'), { identifier: '../exports?x' });
		expect(lastCall().options?.url).toBe('/v1/comparisons/..%2Fexports%3Fx');
	});

	it('rejects an unknown file type and a non-URL source before calling the API', async () => {
		await expect(
			createComparison(context('k'), {
				left: { source_url: 'https://e.com/a.xyz', file_type: 'xyz' as never },
				right: SIDES.right,
			}),
		).rejects.toThrow();
		await expect(
			createComparison(context('k'), {
				left: { source_url: 'not a url', file_type: 'pdf' },
				right: SIDES.right,
			}),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('rejects a comparison whose identifier has the wrong type', async () => {
		mockRequest.mockResolvedValue({
			count: 1,
			results: [{ identifier: 5 }],
		} as never);
		await expect(listComparisons(context('k'), {})).rejects.toThrow();
		expect(mockLog).not.toHaveBeenCalled();
	});

	it('does not report a delete that came back with a body', async () => {
		mockRequest.mockResolvedValue({ detail: 'something else' } as never);
		const remove = jest.fn();
		await expect(
			deleteComparison(context('k', { remove }), { identifier: 'cmp-1' }),
		).rejects.toThrow();
		expect(remove).not.toHaveBeenCalled();
		expect(mockLog).not.toHaveBeenCalled();
	});

	it('lets an HTTP 404 ApiError through unchanged', async () => {
		const error = new ApiError(
			{ method: 'GET', url: '/v1/comparisons/nope' },
			{
				url: 'https://api.draftable.com/v1/comparisons/nope',
				ok: false,
				status: 404,
				statusText: 'Not Found',
				body: { detail: 'Not found.' },
			},
			'Not Found',
		);
		mockRequest.mockRejectedValue(error);
		await expect(
			getComparison(context('k'), { identifier: 'nope' }),
		).rejects.toBe(error);
		expect(mockLog).not.toHaveBeenCalled();
	});
});

describe('stored comparisons', () => {
	it('stores comparisons from list, create and get', async () => {
		const upsert = jest.fn().mockResolvedValue(undefined);
		mockRequest.mockResolvedValue({ count: 1, results: [COMPARISON] } as never);
		await listComparisons(context('test-key', { upsert }), {});
		expect(upsert).toHaveBeenCalledWith('cmp-1', {
			identifier: 'cmp-1',
			ready: true,
			creation_time: COMPARISON.creation_time,
		});
		expect(JSON.stringify(upsert.mock.calls)).not.toContain('test-key');
	});

	it('keeps stored fields a reply leaves out', async () => {
		const upsert = jest.fn().mockResolvedValue(undefined);
		const find = jest.fn().mockResolvedValue({
			data: { identifier: 'cmp-1', public: true, creation_time: 'then' },
		});
		mockRequest.mockResolvedValue({
			identifier: 'cmp-1',
			ready: true,
		} as never);
		await getComparison(context('k', { upsert, find }), {
			identifier: 'cmp-1',
		});
		expect(upsert).toHaveBeenCalledWith('cmp-1', {
			identifier: 'cmp-1',
			public: true,
			creation_time: 'then',
			ready: true,
		});
	});

	it('removes the stored row after a confirmed delete', async () => {
		const remove = jest.fn().mockResolvedValue(true);
		mockRequest.mockResolvedValue(undefined as never);
		await deleteComparison(context('k', { remove }), { identifier: 'cmp-1' });
		expect(remove).toHaveBeenCalledWith('cmp-1');
	});

	it('returns the list when the database write fails', async () => {
		const upsert = jest.fn().mockRejectedValue(new Error('disk full'));
		const reply = { count: 1, results: [COMPARISON] };
		mockRequest.mockResolvedValue(reply as never);
		const warn = jest
			.spyOn(console, 'warn')
			.mockImplementation(() => undefined);
		await expect(
			listComparisons(context('k', { upsert }), {}),
		).resolves.toEqual(reply);
		warn.mockRestore();
	});
});
