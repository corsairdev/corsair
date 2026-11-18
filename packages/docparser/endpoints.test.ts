import { logEventFromContext } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import type { DocparserContext } from './context';
import {
	getDocumentStatus,
	getResult,
	listModels,
	listParsers,
	listResults,
	ping,
} from './endpoints/read';
import {
	fetchDocument,
	reintegrateDocuments,
	reparseDocuments,
	uploadDocument,
} from './endpoints/write';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return {
		...actual,
		logEventFromContext: jest.fn().mockResolvedValue(undefined),
	};
});
jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockRequest = jest.mocked(request);
const mockLog = jest.mocked(logEventFromContext);

function context(key?: string, db?: Record<string, unknown>): DocparserContext {
	// A real database is present whenever tables are passed in.
	return {
		key,
		db,
		database: db ? {} : undefined,
	} as unknown as DocparserContext;
}

function table() {
	return { upsertByEntityId: jest.fn().mockResolvedValue(undefined) };
}

function call(n = 0) {
	return mockRequest.mock.calls[n]?.[1];
}

// Trimmed from the live API (11-17), throwaway trial account.
const RESULT = {
	id: '2c5f0e7b9a',
	document_id: '8cb0a36831b2140707e11a4beb07cb36',
	remote_id: 'corsair-plugin-test',
	file_name: 'dummy.pdf',
	media_link: 'https://api.docparser.com/v1/document/media/abc',
	page_count: 1,
	uploaded_at: '2026-11-17T11:52:10+00:00',
	processed_at: '2026-11-17T11:52:31+00:00',
	invoice_number: 'INV-1',
	customer: { last_name: 'Doe' },
};

describe('docparser', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('pings with HTTP Basic', async () => {
		mockRequest.mockResolvedValue({ msg: 'pong' });
		const result = await ping(context('sekrit'), {});
		expect(result.ping).toEqual({ id: 'ping', msg: 'pong' });
		expect(mockRequest.mock.calls[0]?.[0]?.HEADERS).toEqual({
			Accept: 'application/json',
			Authorization: `Basic ${btoa('sekrit:')}`,
		});
		expect(call()).toMatchObject({ method: 'GET', url: '/v1/ping' });
	});

	it('rejects a ping without msg', async () => {
		mockRequest.mockResolvedValue('<html>ok</html>');
		await expect(ping(context(), {})).rejects.toThrow('missing msg');
	});

	it('leaves 429 retries to core', async () => {
		mockRequest.mockResolvedValue({ msg: 'pong' });
		await ping(context('sekrit'), {});
		expect(mockRequest.mock.calls[0]?.[2]).toBeUndefined();
	});

	it('lists parsers and stores them', async () => {
		mockRequest.mockResolvedValue([{ id: 'abc123', label: 'Invoices' }]);
		const parsers = table();
		const result = await listParsers(context(undefined, { parsers }), {});
		expect(result.parsers).toEqual([{ id: 'abc123', label: 'Invoices' }]);
		expect(parsers.upsertByEntityId).toHaveBeenCalledWith('abc123', {
			id: 'abc123',
			label: 'Invoices',
		});
	});

	it('skips saves when core has no database', async () => {
		const upsert = jest
			.fn()
			.mockRejectedValue(new Error('Database not configured'));
		const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
		mockRequest.mockResolvedValue([{ id: 'abc123', label: 'Invoices' }]);
		const ctx = {
			db: { parsers: { upsertByEntityId: upsert } },
			database: undefined,
		} as unknown as DocparserContext;
		await listParsers(ctx, {});
		expect(upsert).not.toHaveBeenCalled();
		expect(warn).not.toHaveBeenCalled();
		warn.mockRestore();
	});

	it('lists model layouts under parser:layout ids', async () => {
		mockRequest.mockResolvedValue([{ id: '1', label: 'Layout #1' }]);
		const result = await listModels(context(), { parserId: 'abc123' });
		expect(call()?.url).toBe('/v1/parser/models/abc123');
		expect(result.models).toEqual([
			{ id: 'abc123:1', label: 'Layout #1', parserId: 'abc123' },
		]);
	});

	it('returns parsed fields and stores only metadata', async () => {
		mockRequest.mockResolvedValue([RESULT]);
		const results = table();
		const result = await listResults(context(undefined, { results }), {
			parserId: 'abc123',
			format: 'flat',
			list: 'processed_after',
			date: '2026-11-01T00:00:00+00:00',
			limit: 10,
			offset: 20,
			remoteId: 'corsair-plugin-test',
			includeProcessingQueue: true,
			sortBy: 'processed_at',
			sortOrder: 'ASC',
		});
		expect(call()).toMatchObject({
			method: 'GET',
			url: '/v1/results/abc123',
			query: {
				format: 'flat',
				list: 'processed_after',
				date: '2026-11-01T00:00:00+00:00',
				limit: 10,
				offset: 20,
				remote_id: 'corsair-plugin-test',
				include_processing_queue: true,
				sort_by: 'processed_at',
				sort_order: 'ASC',
			},
		});
		expect(result.results[0]?.invoice_number).toBe('INV-1');
		expect(results.upsertByEntityId).toHaveBeenCalledWith(RESULT.id, {
			id: RESULT.id,
			documentId: RESULT.document_id,
			fileName: 'dummy.pdf',
			pageCount: 1,
			uploadedAt: RESULT.uploaded_at,
			processedAt: RESULT.processed_at,
		});
		expect(JSON.stringify(mockLog.mock.calls[0]?.[2])).not.toContain('Doe');
	});

	it('needs a date for uploaded_after and processed_after', async () => {
		await expect(
			listResults(context(), { parserId: 'abc123', list: 'uploaded_after' }),
		).rejects.toThrow('needs date');
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('gets the parsed data of one document', async () => {
		mockRequest.mockResolvedValue([RESULT]);
		const result = await getResult(context(), {
			parserId: 'abc123',
			documentId: RESULT.document_id,
			includeChildren: true,
		});
		expect(call()).toMatchObject({
			url: `/v1/results/abc123/${RESULT.document_id}`,
			query: { include_children: true },
		});
		expect(result.results).toHaveLength(1);
	});

	it('reports document status and drops the internal token', async () => {
		mockRequest.mockResolvedValue({
			token: 'internal-token',
			remote_id: '',
			filename: 'dummy.pdf',
			pages: 1,
			supported: true,
			importing_in_progress: false,
			processing_in_progress: false,
			uploaded_at: 1763380330,
			processed_at: 1763380351,
			failed_jobs: [],
		});
		const result = await getDocumentStatus(context(), {
			parserId: 'abc123',
			documentId: RESULT.document_id,
		});
		expect(call()?.url).toBe(
			`/v2/document/status/abc123/${RESULT.document_id}`,
		);
		expect(result.done).toBe(true);
		expect(JSON.stringify(result)).not.toContain('internal-token');
	});

	it('is not done while processing', async () => {
		mockRequest.mockResolvedValue({
			importing_in_progress: false,
			processing_in_progress: true,
			processed_at: 0,
		});
		const result = await getDocumentStatus(context(), {
			parserId: 'abc123',
			documentId: RESULT.document_id,
		});
		expect(result.done).toBe(false);
	});

	it('imports a document from a URL as form data', async () => {
		mockRequest.mockResolvedValue({
			document_id: 'c53e1c0000',
			parser_id: 'abc123',
			remote_id: 'r1',
			message: 'scheduled',
		});
		const result = await fetchDocument(context(), {
			parserId: 'abc123',
			url: 'https://example.com/invoice.pdf',
			remoteId: 'r1',
		});
		expect(call()).toMatchObject({
			method: 'POST',
			url: '/v2/document/fetch/abc123',
			formData: { url: 'https://example.com/invoice.pdf', remote_id: 'r1' },
		});
		expect(result).toEqual({ documentId: 'c53e1c0000' });
		expect(JSON.stringify(mockLog.mock.calls[0]?.[2])).not.toContain(
			'example.com',
		);
	});

	it('uploads a base64 document and returns the quota', async () => {
		mockRequest.mockResolvedValue({
			id: 'b4afb90000',
			file_size: 13264,
			quota_used: 1,
			quota_left: 49,
			quota_refill: '2026-12-17T11:52:10+00:00',
		});
		const result = await uploadDocument(context(), {
			parserId: 'abc123',
			fileContent: 'JVBERi0x',
			fileName: 'invoice.pdf',
		});
		expect(call()).toMatchObject({
			method: 'POST',
			url: '/v1/document/upload/abc123',
			formData: { file_content: 'JVBERi0x', file_name: 'invoice.pdf' },
		});
		expect(result).toEqual({
			documentId: 'b4afb90000',
			quotaUsed: 1,
			quotaLeft: 49,
			quotaRefill: '2026-12-17T11:52:10+00:00',
		});
	});

	it('keeps the document out of a propagated error', async () => {
		mockRequest.mockRejectedValue(
			new ApiError(
				{
					method: 'POST',
					url: '/v1/document/upload/abc123',
					formData: {
						file_content: 'JVBERi0xSECRET',
						file_name: 'alice@example.com.pdf',
						remote_id: 'alice@example.com',
					},
				},
				{
					url: 'https://api.docparser.com/v1/document/upload/abc123',
					ok: false,
					status: 403,
					statusText: 'Forbidden',
					body: { error: 'Forbidden' },
				},
				'Forbidden',
			),
		);
		const error = await uploadDocument(context(), {
			parserId: 'abc123',
			fileContent: 'JVBERi0xSECRET',
		}).catch((e: unknown) => e);
		expect(error).toBeInstanceOf(ApiError);
		expect((error as ApiError).status).toBe(403);
		expect(JSON.stringify((error as ApiError).request)).not.toContain('SECRET');
		expect(JSON.stringify((error as ApiError).request)).not.toContain('alice');
	});

	it('schedules a reparse with document_ids[]', async () => {
		mockRequest.mockResolvedValue({ total_reparsed: 2, msg: '' });
		const result = await reparseDocuments(context(), {
			parserId: 'abc123',
			documentIds: ['d1', 'd2'],
		});
		expect(call()).toMatchObject({
			method: 'POST',
			url: '/v1/document/reparse/abc123',
			formData: { 'document_ids[]': ['d1', 'd2'] },
		});
		expect(result).toEqual({ scheduled: 2 });
	});

	it('schedules a reintegration', async () => {
		mockRequest.mockResolvedValue({ total_reintegrate: 1, msg: '' });
		const result = await reintegrateDocuments(context(), {
			parserId: 'abc123',
			documentIds: ['d1'],
		});
		expect(call()?.url).toBe('/v1/document/reintegrate/abc123');
		expect(result).toEqual({ scheduled: 1 });
	});

	it('rejects a parser id with a slash', async () => {
		await expect(
			getResult(context(), { parserId: '../x', documentId: 'd1' }),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('lets an HTTP 403 through unchanged', async () => {
		const error = new ApiError(
			{ method: 'GET', url: '/v1/ping' },
			{
				url: 'https://api.docparser.com/v1/ping',
				ok: false,
				status: 403,
				statusText: 'Forbidden',
				body: { error: 'no API key found' },
			},
			'Forbidden',
		);
		mockRequest.mockRejectedValue(error);
		await expect(ping(context(), {})).rejects.toBe(error);
	});
});
