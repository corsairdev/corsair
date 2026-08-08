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

function makeChange(fileId: string, ageMs = 0): Change {
	return {
		fileId,
		time: new Date(Date.now() - ageMs).toISOString(),
		removed: false,
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
		return jsonResponse(stubFile(fileId, mimeTypeFor(fileId)));
	}) as unknown as typeof fetch;

	return changeRequests;
}

describe('driveChanged pagination', () => {
	const originalFetch = global.fetch;
	const ctx = { key: 'tok' } as any;

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

	it('keeps fresh changes on later pages when page 1 is entirely stale', async () => {
		// The recent-changes window is 60s; page 1 is older than that.
		mockDriveFetch([
			{ changes: [makeChange('old-file', 600000)], nextPageToken: '78' },
			{ changes: [makeChange('fresh-file')], newStartPageToken: '79' },
		]);

		const result = await driveChanged.handler(ctx, makeRequest('77'));

		expect(result.success).toBe(true);
		expect(result.data?.allFiles).toHaveLength(1);
		expect(result.data?.allFiles[0]?.file.id).toBe('fresh-file');
		expect(result.data?.fileId).toBe('fresh-file');
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
		expect(result.data?.allFiles).toHaveLength(10);
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

	it('reports no changes when every page is stale', async () => {
		mockDriveFetch([
			{ changes: [makeChange('old-1', 600000)], nextPageToken: '78' },
			{ changes: [makeChange('old-2', 600000)], newStartPageToken: '79' },
		]);

		const result = await driveChanged.handler(ctx, makeRequest('77'));

		expect(result.success).toBe(true);
		expect(result.data?.allFiles).toEqual([]);
		expect(result.data?.allFolders).toEqual([]);
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
});
