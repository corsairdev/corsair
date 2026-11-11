import { request } from 'corsair/http';
import { PresentationsEndpoints } from './endpoints';
import type { GoogleSlidesContext } from './index';
import { makeContext, makeStore } from './test-helpers';

jest.mock('corsair/http', () => {
	const original = jest.requireActual('corsair/http');
	return {
		...original,
		request: jest.fn(),
	};
});

const mockRequest = request as jest.Mock;

/** The URL corsair/http actually builds, from the config and options it was given. */
function calledUrl(index = 0): string {
	const [config, options] = mockRequest.mock.calls[index];
	return `${config.BASE}${options.url}`;
}

function calledOptions(index = 0) {
	return mockRequest.mock.calls[index][1];
}

function calledQuery(index = 0) {
	return mockRequest.mock.calls[index][1].query ?? {};
}

function calledBody(index = 0) {
	return mockRequest.mock.calls[index][1].body;
}

const presentationReply = {
	presentationId: 'deck-1',
	title: 'Quarterly review',
	locale: 'en-US',
	revisionId: 'rev-3',
	pageSize: {
		width: { magnitude: 9144000, unit: 'EMU' },
		height: { magnitude: 5143500, unit: 'EMU' },
	},
	slides: [{ objectId: 'slide-a' }, { objectId: 'slide-b' }],
	layouts: [{ objectId: 'layout-1' }],
	masters: [{ objectId: 'master-1' }],
};

let ctx: GoogleSlidesContext;

beforeEach(() => {
	mockRequest.mockReset();
	ctx = makeContext();
});

// global.fetch is spied in the export tests. Without this the spy is reused
// across tests, so a queued mockResolvedValueOnce lands on an earlier call and
// the call history starts at the first test's first request.
afterEach(() => {
	jest.restoreAllMocks();
});

describe('presentations.create', () => {
	it('posts to /presentations with only the fields create reads', async () => {
		mockRequest.mockResolvedValue(presentationReply);

		const result = await PresentationsEndpoints.create(ctx, {
			title: 'Quarterly review',
		});

		expect(calledUrl()).toBe('https://slides.googleapis.com/v1/presentations');
		expect(calledOptions().method).toBe('POST');
		// Create ignores every field but title and presentationId, so a caller
		// setting anything else would be told a setting it does not have.
		expect(calledBody()).toEqual({ title: 'Quarterly review' });
		expect(result.presentationId).toBe('deck-1');
		expect(result.slideCount).toBe(2);
	});

	it('sends a caller-chosen presentationId and counts the deck', async () => {
		mockRequest.mockResolvedValue({
			...presentationReply,
			presentationId: 'my-deck',
		});

		const result = await PresentationsEndpoints.create(ctx, {
			title: 'Named',
			presentationId: 'my-deck',
		});

		expect(calledBody()).toEqual({
			title: 'Named',
			presentationId: 'my-deck',
		});
		expect(result.presentationId).toBe('my-deck');
		expect(result.layoutCount).toBe(1);
		expect(result.masterCount).toBe(1);
		expect(result.pageWidthEmu).toBe(9144000);
	});

	it('rejects an empty title before sending anything', async () => {
		await expect(
			PresentationsEndpoints.create(ctx, { title: '' }),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});
});

describe('presentations.get', () => {
	it('reads the deck and derives the url and counts', async () => {
		mockRequest.mockResolvedValue(presentationReply);

		const result = await PresentationsEndpoints.get(ctx, {
			presentationId: 'deck-1',
		});

		expect(calledUrl()).toBe(
			'https://slides.googleapis.com/v1/presentations/deck-1',
		);
		expect(calledOptions().method).toBe('GET');
		expect(result.url).toBe(
			'https://docs.google.com/presentation/d/deck-1/edit',
		);
		expect(result.slideCount).toBe(2);
	});

	it('encodes a presentation id so a slash cannot escape the path', async () => {
		mockRequest.mockResolvedValue(presentationReply);

		await PresentationsEndpoints.get(ctx, { presentationId: 'a/b' });

		expect(calledUrl()).toBe(
			'https://slides.googleapis.com/v1/presentations/a%2Fb',
		);
	});

	it('passes commentsViewMode as a query parameter and omits it when unset', async () => {
		mockRequest.mockResolvedValue(presentationReply);

		await PresentationsEndpoints.get(ctx, { presentationId: 'deck-1' });
		expect(calledQuery()).toEqual({});

		await PresentationsEndpoints.get(ctx, {
			presentationId: 'deck-1',
			commentsViewMode: 'COMMENTS_VIEW_MODE_INCLUDED',
		});
		expect(calledQuery(1)).toEqual({
			commentsViewMode: 'COMMENTS_VIEW_MODE_INCLUDED',
		});
	});

	it('fails loudly when the reply is not a presentation', async () => {
		mockRequest.mockResolvedValue({ title: 'no id here' });

		await expect(
			PresentationsEndpoints.get(ctx, { presentationId: 'deck-1' }),
		).rejects.toThrow(/no presentationId/);
	});
});

describe('presentations.list', () => {
	it('queries Drive for presentations only and excludes trashed files', async () => {
		mockRequest.mockResolvedValue({
			files: [
				{ id: 'deck-1', name: 'Alpha', mimeType: 'application/pdf' },
				{ id: 'deck-2', name: 'Beta' },
			],
			nextPageToken: 'next-1',
		});

		const result = await PresentationsEndpoints.list(ctx, {});

		expect(calledUrl()).toBe('https://www.googleapis.com/drive/v3/files');
		const query = calledQuery();
		expect(query.q).toBe(
			"mimeType = 'application/vnd.google-apps.presentation' and trashed = false",
		);
		expect(result.files.map((file) => file.presentationId)).toEqual([
			'deck-1',
			'deck-2',
		]);
		expect(result.nextPageToken).toBe('next-1');
	});

	it('wraps a caller filter in parentheses so an or filter cannot widen the result', async () => {
		mockRequest.mockResolvedValue({ files: [] });

		await PresentationsEndpoints.list(ctx, {
			query: "name contains 'a' or name contains 'b'",
		});

		expect(calledQuery().q).toBe(
			"(name contains 'a' or name contains 'b') and mimeType = 'application/vnd.google-apps.presentation' and trashed = false",
		);
	});

	it('forwards paging and paging limits are enforced', async () => {
		mockRequest.mockResolvedValue({ files: [] });

		await PresentationsEndpoints.list(ctx, {
			pageSize: 25,
			pageToken: 'token-1',
			orderBy: 'modifiedTime desc',
		});

		const query = calledQuery();
		expect(query.pageSize).toBe(25);
		expect(query.pageToken).toBe('token-1');
		expect(query.orderBy).toBe('modifiedTime desc');

		await expect(
			PresentationsEndpoints.list(ctx, { pageSize: 1001 }),
		).rejects.toThrow();
	});

	it('throws rather than returning a row the caller cannot open', async () => {
		mockRequest.mockResolvedValue({ files: [{ name: 'no id' }] });

		await expect(PresentationsEndpoints.list(ctx, {})).rejects.toThrow(
			/without an id/,
		);
	});
});

describe('presentations.copy', () => {
	it('copies through Drive then reads the copy for its counts', async () => {
		mockRequest
			.mockResolvedValueOnce({ id: 'deck-copy' })
			.mockResolvedValueOnce({
				...presentationReply,
				presentationId: 'deck-copy',
			});

		const result = await PresentationsEndpoints.copy(ctx, {
			presentationId: 'deck-1',
			name: 'Copy of deck',
		});

		expect(calledUrl(0)).toBe(
			'https://www.googleapis.com/drive/v3/files/deck-1/copy',
		);
		expect(calledOptions(0).method).toBe('POST');
		expect(calledBody(0)).toEqual({ name: 'Copy of deck' });
		expect(calledUrl(1)).toBe(
			'https://slides.googleapis.com/v1/presentations/deck-copy',
		);
		expect(result.presentationId).toBe('deck-copy');
	});

	it('refuses a copy reply with no file id', async () => {
		mockRequest.mockResolvedValue({});

		await expect(
			PresentationsEndpoints.copy(ctx, { presentationId: 'deck-1' }),
		).rejects.toThrow(/no file id/);
	});
});

describe('presentations.exportPdf', () => {
	it('exports PDF bytes as base64 through the Drive export route', async () => {
		const fetchMock = jest.spyOn(global, 'fetch').mockResolvedValue(
			new Response(Buffer.from('%PDF-1.4 test'), {
				status: 200,
				headers: { 'content-type': 'application/pdf' },
			}),
		);

		const result = await PresentationsEndpoints.exportPdf(ctx, {
			presentationId: 'deck-1',
		});

		expect(fetchMock).toHaveBeenCalledTimes(1);
		const [url, init] = fetchMock.mock.calls[0] ?? [];
		expect(String(url)).toBe(
			'https://www.googleapis.com/drive/v3/files/deck-1/export?mimeType=application%2Fpdf',
		);
		expect((init?.headers as Record<string, string>).Authorization).toBe(
			'Bearer test-access-token',
		);
		expect(result.mimeType).toBe('application/pdf');
		expect(Buffer.from(result.data, 'base64').toString()).toBe('%PDF-1.4 test');
		expect(result.byteLength).toBe(Buffer.byteLength('%PDF-1.4 test'));
	});

	it('defaults to PDF and honours pptx', async () => {
		const fetchMock = jest.spyOn(global, 'fetch').mockResolvedValue(
			new Response('x', {
				status: 200,
				headers: { 'content-type': 'application/pdf' },
			}),
		);

		const result = await PresentationsEndpoints.exportPdf(ctx, {
			presentationId: 'deck-1',
			format: 'pptx',
		});

		expect(result.format).toBe('pptx');
		expect(String(fetchMock.mock.calls[0]?.[0])).toContain(
			'presentationml.presentation',
		);
	});

	it('names a failed export instead of returning an empty file', async () => {
		jest.spyOn(global, 'fetch').mockResolvedValue(
			new Response('{"error":{"message":"not found"}}', {
				status: 404,
				headers: { 'content-type': 'application/json' },
			}),
		);

		await expect(
			PresentationsEndpoints.exportPdf(ctx, { presentationId: 'missing' }),
		).rejects.toThrow(/404/);
	});

	it('refreshes the token once on a 401', async () => {
		const refreshAuth = jest.fn(async () => 'fresh-token');
		ctx = makeContext({ refreshAuth });
		const fetchMock = jest
			.spyOn(global, 'fetch')
			.mockResolvedValueOnce(new Response('', { status: 401 }))
			.mockResolvedValueOnce(
				new Response('ok', {
					status: 200,
					headers: { 'content-type': 'application/pdf' },
				}),
			);

		await PresentationsEndpoints.exportPdf(ctx, { presentationId: 'deck-1' });

		expect(refreshAuth).toHaveBeenCalledTimes(1);
		expect(
			(fetchMock.mock.calls[1]?.[1]?.headers as Record<string, string>)
				.Authorization,
		).toBe('Bearer fresh-token');
	});
});

describe('presentations.delete', () => {
	it('deletes the Drive file and reports it', async () => {
		mockRequest.mockResolvedValue(undefined);

		const result = await PresentationsEndpoints.delete(ctx, {
			presentationId: 'deck-1',
		});

		expect(calledUrl()).toBe(
			'https://www.googleapis.com/drive/v3/files/deck-1',
		);
		expect(calledOptions().method).toBe('DELETE');
		expect(result).toEqual({ presentationId: 'deck-1', deleted: true });
	});
});

describe('presentation persistence', () => {
	it('stores the summary so db.presentations has rows to search', async () => {
		const presentations = makeStore();
		const storeCtx = makeContext({ db: { presentations } });
		mockRequest.mockResolvedValue(presentationReply);

		await PresentationsEndpoints.get(storeCtx, { presentationId: 'deck-1' });

		expect(presentations.upsertByEntityId).toHaveBeenCalledWith(
			'deck-1',
			expect.objectContaining({
				presentationId: 'deck-1',
				title: 'Quarterly review',
				slideCount: 2,
				layoutCount: 1,
				lastSyncedAt: expect.any(Date),
			}),
		);
	});

	it('still returns the presentation when the database write fails', async () => {
		const presentations = makeStore();
		presentations.upsertByEntityId.mockRejectedValue(new Error('disk full'));
		const storeCtx = makeContext({ db: { presentations } });
		mockRequest.mockResolvedValue(presentationReply);
		const warn = jest
			.spyOn(console, 'warn')
			.mockImplementation(() => undefined);

		const result = await PresentationsEndpoints.get(storeCtx, {
			presentationId: 'deck-1',
		});

		// The caller asked for the deck, not for a row; a storage failure must not
		// turn a successful read into an error.
		expect(result.presentationId).toBe('deck-1');
		expect(warn).toHaveBeenCalled();
	});

	it('works when no database entity is bound', async () => {
		const storeCtx = makeContext();
		mockRequest.mockResolvedValue(presentationReply);

		const result = await PresentationsEndpoints.get(storeCtx, {
			presentationId: 'deck-1',
		});
		expect(result.presentationId).toBe('deck-1');
	});
});
