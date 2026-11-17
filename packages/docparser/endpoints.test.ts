import { ApiError, request } from 'corsair/http';
import type { DocparserContext } from './context';
import { listParsers, listResults, ping } from './endpoints/read';

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

function context(key?: string): DocparserContext {
	return { key } as unknown as DocparserContext;
}

describe('docparser', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('stores a ping and sends HTTP Basic', async () => {
		mockRequest.mockResolvedValue({ msg: 'pong' });
		const result = await ping(context('sekrit'), {});
		expect(result.ping).toEqual({ id: 'ping', msg: 'pong' });
		expect(mockRequest.mock.calls[0]?.[0]?.HEADERS).toEqual({
			Accept: 'application/json',
			Authorization: `Basic ${btoa('sekrit:')}`,
		});
		expect(mockRequest.mock.calls[0]?.[0]?.TOKEN).toBeUndefined();
		expect(mockRequest.mock.calls[0]?.[1]).toMatchObject({
			method: 'GET',
			url: '/v1/ping',
		});
	});

	it('stores parsers', async () => {
		mockRequest.mockResolvedValue([{ id: 'abc123', label: 'Invoices' }]);
		const result = await listParsers(context(), {});
		expect(result.parsers).toEqual([{ id: 'abc123', label: 'Invoices' }]);
	});

	it('stores a result and drops parsed fields', async () => {
		mockRequest.mockResolvedValue([
			{
				id: 'result1',
				document_id: 'doc1',
				file_name: 'invoice.pdf',
				page_count: 2,
				uploaded_at: '2016-07-27T14:57:05+00:00',
				processed_at: '2016-07-27T14:57:10+00:00',
				media_link: 'https://api.docparser.com/secret',
				customer: { last_name: 'Doe' },
			},
		]);
		const result = await listResults(context(), { id: 'abc123' });
		expect(result.results[0]).toEqual({
			id: 'result1',
			documentId: 'doc1',
			fileName: 'invoice.pdf',
			pageCount: 2,
			uploadedAt: '2016-07-27T14:57:05+00:00',
			processedAt: '2016-07-27T14:57:10+00:00',
		});
		expect(JSON.stringify(result.results)).not.toContain('secret');
		expect(JSON.stringify(result.results)).not.toContain('Doe');
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
