import type { Change, ChangeList } from '../types';
import { driveChanged } from './changes';

const FOLDER_MIME_TYPE = 'application/vnd.google-apps.folder';

function encodePushNotification(pageToken: string): string {
	return Buffer.from(
		JSON.stringify({
			resourceId: 'res-1',
			resourceUri: `https://www.googleapis.com/drive/v3/changes?pageToken=${pageToken}`,
		}),
	).toString('base64');
}

function makeRequest(pageToken = '77') {
	return {
		payload: { message: { data: encodePushNotification(pageToken) } },
	} as any;
}

function makeChange(
	fileId: string,
	ageMs = 0,
	overrides: Partial<Change> = {},
): Change {
	return {
		fileId,
		time: new Date(Date.now() - ageMs).toISOString(),
		removed: false,
		...overrides,
	};
}

function makeKeys(stored: { token?: string | null } = {}) {
	return {
		get_changes_page_token: async () => stored.token ?? null,
		set_changes_page_token: async (value: string | null) => {
			stored.token = value;
		},
	};
}

function jsonResponse(body: unknown) {
	return {
		ok: true,
		status: 200,
		headers: new Headers({ 'Content-Type': 'application/json' }),
		json: async () => body,
		text: async () => JSON.stringify(body),
	};
}

function stubFile(fileId: string, mimeType = 'text/plain') {
	return {
		id: fileId,
		name: fileId,
		mimeType,
		parents: [],
		trashed: false,
	};
}

/**
 * Serves the changes feed one page at a time and returns a stub file for any
 * /files/<id> lookup, so the handler can walk a change through to an event.
 */
function mockDriveFetch(
	pages: ChangeList[],
	mimeTypeFor: (fileId: string) => string = () => 'text/plain',
	options: {
		missingFileIds?: ReadonlySet<string>;
		errorFileIds?: ReadonlyMap<string, number>;
	} = {},
) {
	const changeRequests: string[] = [];

	global.fetch = (async (url: unknown) => {
		const href = String(url);

		if (href.includes('/changes')) {
			const pageToken = new URL(href).searchParams.get('pageToken') ?? '';
			changeRequests.push(pageToken);
			return jsonResponse(pages[changeRequests.length - 1] ?? { changes: [] });
		}

		if (href.includes('alt=media')) {
			return { ok: false, status: 404, text: async () => 'no binary' };
		}

		const fileId = href.split('/files/')[1]?.split('?')[0] ?? 'unknown';
		const errorStatus =
			options.errorFileIds?.get(fileId) ??
			(options.missingFileIds?.has(fileId) ? 404 : undefined);
		if (errorStatus !== undefined) {
			return {
				ok: false,
				status: errorStatus,
				text: async () => 'drive error',
				json: async () => ({ error: { code: errorStatus } }),
			};
		}
		return jsonResponse(stubFile(fileId, mimeTypeFor(fileId)));
	}) as unknown as typeof fetch;

	return changeRequests;
}

function mockDriveByToken(pagesByToken: Record<string, ChangeList>) {
	const changeRequests: string[] = [];

	global.fetch = (async (url: unknown) => {
		const href = String(url);

		if (href.includes('/changes')) {
			const pageToken = new URL(href).searchParams.get('pageToken') ?? '';
			changeRequests.push(pageToken);
			return jsonResponse(pagesByToken[pageToken] ?? { changes: [] });
		}

		if (href.includes('alt=media')) {
			return { ok: false, status: 404, text: async () => 'no binary' };
		}

		const fileId = href.split('/files/')[1]?.split('?')[0] ?? 'unknown';
		return jsonResponse(stubFile(fileId));
	}) as unknown as typeof fetch;

	return changeRequests;
}

describe('driveChanged pagination', () => {
	const originalFetch = global.fetch;
	const ctx = {
		key: 'tok',
		$getAccountId: async () => 'account-1',
	} as any;

	afterEach(() => {
		global.fetch = originalFetch;
	});

	it('follows nextPageToken until the feed is exhausted', async () => {
		const changeRequests = mockDriveFetch([
			{ changes: [makeChange('file-1')], nextPageToken: '78' },
			{ changes: [makeChange('file-2')], nextPageToken: '79' },
			{ changes: [makeChange('file-3')], newStartPageToken: '80' },
		]);

		const result = await driveChanged.handler(ctx, makeRequest('77'));

		expect(result.success).toBe(true);
		expect(changeRequests).toEqual(['77', '78', '79']);
		expect(result.data?.allFiles).toHaveLength(3);
		expect(result.data?.allFiles.map((f: any) => f.file.id)).toEqual([
			'file-1',
			'file-2',
			'file-3',
		]);
	});

	it('keeps later-page changes even when page 1 is older than 60s', async () => {
		mockDriveFetch([
			{ changes: [makeChange('old-file', 600000)], nextPageToken: '78' },
			{ changes: [makeChange('fresh-file')], newStartPageToken: '79' },
		]);

		const result = await driveChanged.handler(ctx, makeRequest('77'));

		expect(result.success).toBe(true);
		expect(result.data?.allFiles.map((f: any) => f.file.id)).toEqual([
			'old-file',
			'fresh-file',
		]);
	});

	it('stops after a single page when no nextPageToken is returned', async () => {
		const changeRequests = mockDriveFetch([
			{ changes: [makeChange('only-file')], newStartPageToken: '78' },
		]);

		const result = await driveChanged.handler(ctx, makeRequest('77'));

		expect(changeRequests).toEqual(['77']);
		expect(result.data?.allFiles).toHaveLength(1);
	});

	it('caps runaway feeds at MAX_CHANGE_PAGES', async () => {
		const pages: ChangeList[] = Array.from({ length: 20 }, (_, i) => ({
			changes: [makeChange(`file-${i}`)],
			nextPageToken: String(100 + i),
		}));
		const changeRequests = mockDriveFetch(pages);

		const result = await driveChanged.handler(ctx, makeRequest('77'));

		expect(changeRequests).toHaveLength(10);
		expect(result.success).toBe(false);
	});

	it('breaks when nextPageToken points back at the current page', async () => {
		const changeRequests = mockDriveFetch([
			{ changes: [makeChange('file-1')], nextPageToken: '77' },
			{ changes: [makeChange('file-2')], nextPageToken: '77' },
		]);

		const result = await driveChanged.handler(ctx, makeRequest('77'));

		expect(changeRequests).toEqual(['77']);
		expect(result.data?.allFiles).toHaveLength(1);
	});

	it('breaks on a multi-step cycle without refetching pages', async () => {
		// 77 → 78 → 77: each token advances, so a same-token check alone would
		// keep looping and duplicate file-1/file-2 until the page cap.
		const changeRequests: string[] = [];
		global.fetch = (async (url: unknown) => {
			const href = String(url);

			if (href.includes('/changes')) {
				const pageToken = new URL(href).searchParams.get('pageToken') ?? '';
				changeRequests.push(pageToken);
				return jsonResponse(
					pageToken === '77'
						? { changes: [makeChange('file-1')], nextPageToken: '78' }
						: { changes: [makeChange('file-2')], nextPageToken: '77' },
				);
			}

			if (href.includes('alt=media')) {
				return { ok: false, status: 404, text: async () => 'no binary' };
			}

			const fileId = href.split('/files/')[1]?.split('?')[0] ?? 'unknown';
			return jsonResponse(stubFile(fileId));
		}) as unknown as typeof fetch;

		const result = await driveChanged.handler(ctx, makeRequest('77'));

		expect(changeRequests).toEqual(['77', '78']);
		expect(result.data?.allFiles).toHaveLength(2);
	});

	it('does not drop old changes that the Drive cursor has not advanced past', async () => {
		mockDriveFetch([
			{ changes: [makeChange('old-1', 600000)], nextPageToken: '78' },
			{ changes: [makeChange('old-2', 600000)], newStartPageToken: '79' },
		]);

		const result = await driveChanged.handler(ctx, makeRequest('77'));

		expect(result.success).toBe(true);
		expect(result.data?.allFiles.map((f: any) => f.file.id)).toEqual([
			'old-1',
			'old-2',
		]);
	});

	it('separates folders from files across pages', async () => {
		mockDriveFetch(
			[
				{ changes: [makeChange('doc-1')], nextPageToken: '78' },
				{ changes: [makeChange('dir-1')], newStartPageToken: '79' },
			],
			(fileId) => (fileId === 'dir-1' ? FOLDER_MIME_TYPE : 'text/plain'),
		);

		const result = await driveChanged.handler(ctx, makeRequest('77'));

		expect(result.data?.allFiles).toHaveLength(1);
		expect(result.data?.allFolders).toHaveLength(1);
		expect(result.data?.allFolders[0]?.folder.id).toBe('dir-1');
	});

	it('keeps changes older than 60s because the Drive cursor defines what is new', async () => {
		mockDriveFetch([
			{ changes: [makeChange('old-file', 600000)], newStartPageToken: '78' },
		]);

		const result = await driveChanged.handler(ctx, makeRequest('77'));

		expect(result.success).toBe(true);
		expect(result.data?.allFiles).toHaveLength(1);
		expect(result.data?.allFiles[0]?.file.id).toBe('old-file');
	});

	it('deletes removed files without fetching them first', async () => {
		const deleted: string[] = [];
		mockDriveFetch(
			[
				{
					changes: [makeChange('gone-file', 0, { removed: true })],
					newStartPageToken: '78',
				},
			],
			() => 'text/plain',
			{ missingFileIds: new Set(['gone-file']) },
		);

		const result = await driveChanged.handler(
			{
				...ctx,
				db: {
					files: {
						deleteByEntityId: async (id: string) => {
							deleted.push(id);
						},
					},
					folders: {
						deleteByEntityId: async (id: string) => {
							deleted.push(`folder:${id}`);
						},
					},
				},
			},
			makeRequest('77'),
		);

		expect(result.success).toBe(true);
		expect(deleted).toContain('gone-file');
		expect(result.data?.allFiles[0]?.changeType).toBe('deleted');
		expect(result.data?.allFiles[0]?.file.id).toBe('gone-file');
	});

	it('persists a continuation cursor and resumes there on the next notification', async () => {
		const stored: { token?: string | null } = {};
		const pagesByToken: Record<string, ChangeList> = {};
		for (let i = 0; i < 12; i++) {
			const token = String(77 + i);
			const next = String(77 + i + 1);
			pagesByToken[token] = {
				changes: [makeChange(`file-${i}`)],
				nextPageToken: next,
			};
		}
		pagesByToken['87'] = {
			changes: [makeChange('file-10')],
			newStartPageToken: '88',
		};
		pagesByToken['88'] = {
			changes: [makeChange('file-11')],
			newStartPageToken: '89',
		};

		const changeRequests = mockDriveByToken(pagesByToken);
		const keyedCtx = { ...ctx, keys: makeKeys(stored) };

		const first = await driveChanged.handler(keyedCtx, makeRequest('77'));
		expect(first.success).toBe(true);
		expect(changeRequests).toEqual([
			'77',
			'78',
			'79',
			'80',
			'81',
			'82',
			'83',
			'84',
			'85',
			'86',
		]);
		expect(stored.token).toBe('87');

		changeRequests.length = 0;
		const second = await driveChanged.handler(keyedCtx, makeRequest('77'));
		expect(second.success).toBe(true);
		expect(changeRequests[0]).toBe('87');
		expect(second.data?.allFiles.map((f: any) => f.file.id)).toContain(
			'file-10',
		);
	});

	it('persists newStartPageToken after the feed is exhausted', async () => {
		const stored: { token?: string | null } = {};
		mockDriveFetch([
			{ changes: [makeChange('only-file')], newStartPageToken: '80' },
		]);

		await driveChanged.handler(
			{ ...ctx, keys: makeKeys(stored) },
			makeRequest('77'),
		);

		expect(stored.token).toBe('80');
	});

	it('does not warn about event logging when $getAccountId is on the context', async () => {
		const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
		mockDriveFetch([
			{ changes: [makeChange('file-1')], newStartPageToken: '78' },
		]);

		await driveChanged.handler(ctx, makeRequest('77'));

		expect(
			warn.mock.calls.filter((call) =>
				String(call[0]).includes('Failed to log event'),
			),
		).toEqual([]);
		warn.mockRestore();
	});

	it('does not persist the cursor when a file fetch fails with 500', async () => {
		const stored: { token?: string | null } = { token: '77' };
		mockDriveFetch(
			[{ changes: [makeChange('flaky-file')], newStartPageToken: '80' }],
			() => 'text/plain',
			{ errorFileIds: new Map([['flaky-file', 500]]) },
		);

		const result = await driveChanged.handler(
			{ ...ctx, keys: makeKeys(stored) },
			makeRequest('77'),
		);

		expect(result.success).toBe(false);
		expect(stored.token).toBe('77');
	});

	it('returns failure when the feed is truncated and the cursor cannot be stored', async () => {
		const pages: ChangeList[] = Array.from({ length: 12 }, (_, i) => ({
			changes: [makeChange(`file-${i}`)],
			nextPageToken: String(100 + i),
		}));
		mockDriveFetch(pages);

		const result = await driveChanged.handler(ctx, makeRequest('77'));

		expect(result.success).toBe(false);
		expect(result.error).toMatch(/persist/i);
	});

	it('falls back to the URI page token when the stored cursor is rejected', async () => {
		const stored: { token?: string | null } = { token: 'bad' };
		const changeRequests: string[] = [];
		global.fetch = (async (url: unknown) => {
			const href = String(url);

			if (href.includes('/changes')) {
				const pageToken = new URL(href).searchParams.get('pageToken') ?? '';
				changeRequests.push(pageToken);
				if (pageToken === 'bad') {
					return {
						ok: false,
						status: 400,
						statusText: 'Bad Request',
						headers: new Headers({ 'Content-Type': 'application/json' }),
						json: async () => ({
							error: {
								code: 400,
								message: 'Invalid Value',
								errors: [{ reason: 'invalid', location: 'pageToken' }],
							},
						}),
						text: async () => 'invalidStartPageToken',
					};
				}
				return jsonResponse({
					changes: [makeChange('file-1')],
					newStartPageToken: '80',
				});
			}

			if (href.includes('alt=media')) {
				return { ok: false, status: 404, text: async () => 'no binary' };
			}

			const fileId = href.split('/files/')[1]?.split('?')[0] ?? 'unknown';
			return jsonResponse(stubFile(fileId));
		}) as unknown as typeof fetch;

		const result = await driveChanged.handler(
			{ ...ctx, keys: makeKeys(stored) },
			makeRequest('77'),
		);

		expect(result.success).toBe(true);
		expect(changeRequests).toEqual(['bad', '77']);
		expect(result.data?.allFiles[0]?.file.id).toBe('file-1');
		expect(stored.token).toBe('80');
	});
});
