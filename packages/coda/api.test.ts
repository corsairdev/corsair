import { logEventFromContext } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import { CodaAPIError, makeCodaRequest } from './client';
import { insertRows, listDocs, listTables, whoami } from './endpoints/handlers';
import { CodaEndpointOutputSchemas } from './endpoints/types';
import { errorHandlers } from './error-handlers';

jest.mock('corsair/core', () => ({
	logEventFromContext: jest.fn(),
}));

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return {
		...actual,
		request: jest.fn(),
	};
});

const mockRequest = request as jest.MockedFunction<typeof request>;

const ctx = {
	key: 'test-api-key',
} as never;

describe('Coda endpoint handlers', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		jest.mocked(logEventFromContext).mockReset();
	});

	it('maps whoami to GET /whoami and logs completion', async () => {
		mockRequest.mockResolvedValueOnce({
			name: 'Ada Lovelace',
			loginId: 'ada@coda.io',
		} as never);

		await whoami(ctx, {});

		const [config, options] = mockRequest.mock.calls[0] ?? [];
		expect(config?.BASE).toBe('https://coda.io/apis/v1');
		expect(config?.HEADERS).toMatchObject({
			Authorization: 'Bearer test-api-key',
		});
		expect(options?.method).toBe('GET');
		expect(options?.url).toBe('whoami');
		expect(logEventFromContext).toHaveBeenCalledWith(
			ctx,
			'coda.whoami',
			{},
			'completed',
		);
	});

	it('maps docs.list query params', async () => {
		mockRequest.mockResolvedValueOnce({ items: [] } as never);

		await listDocs(ctx, { limit: 25, pageToken: 'next' });

		const [_config, options] = mockRequest.mock.calls[0] ?? [];
		expect(options?.method).toBe('GET');
		expect(options?.url).toBe('docs');
		expect(options?.query).toEqual({ limit: 25, pageToken: 'next' });
	});

	it('maps tables.list path and preserves encoded docId', async () => {
		mockRequest.mockResolvedValueOnce({ items: [] } as never);

		await listTables(ctx, {
			docId: 'doc with/slash',
			limit: 10,
			pageToken: 'p2',
		});

		const [_config, options] = mockRequest.mock.calls[0] ?? [];
		expect(options?.method).toBe('GET');
		expect(options?.url).toBe('docs/doc%20with%2Fslash/tables');
		expect(options?.query).toEqual({ limit: 10, pageToken: 'p2' });
	});

	it('maps tables.insertRows body and encodes ids', async () => {
		mockRequest.mockResolvedValueOnce({
			requestId: 'req_123',
			addedRowIds: ['i-abc'],
		} as never);

		await insertRows(ctx, {
			docId: 'doc/1',
			tableId: 'table 2',
			rows: [{ cells: [{ column: 'Name', value: 'Ada' }] }],
		});

		const [_config, options] = mockRequest.mock.calls[0] ?? [];
		expect(options?.method).toBe('POST');
		expect(options?.url).toBe('docs/doc%2F1/tables/table%202/rows');
		expect(options?.body).toEqual({
			rows: [{ cells: [{ column: 'Name', value: 'Ada' }] }],
		});
	});
});

describe('Coda schemas and error handling', () => {
	it('validates whoami response with loginId and insertRows response fields', () => {
		expect(() =>
			CodaEndpointOutputSchemas.whoami.parse({
				name: 'Ada Lovelace',
				loginId: 'ada@coda.io',
			}),
		).not.toThrow();
		expect(() =>
			CodaEndpointOutputSchemas.insertRows.parse({
				requestId: 'req_123',
				addedRowIds: ['i-abc'],
			}),
		).not.toThrow();
		expect(() =>
			CodaEndpointOutputSchemas.insertRows.parse({ requestId: 'req_123' }),
		).toThrow();
	});

	it('preserves ApiError metadata for rate-limit handlers', async () => {
		mockRequest.mockRejectedValueOnce(
			new ApiError(
				{ method: 'GET', url: '/whoami' },
				{
					url: '/whoami',
					ok: false,
					status: 429,
					statusText: 'Too Many Requests',
					body: undefined,
				},
				'Too Many Requests',
				{ retryAfter: 2000 },
			),
		);

		const err = await makeCodaRequest('/whoami', 'test-api-key').catch(
			(e) => e,
		);
		expect(err).toBeInstanceOf(ApiError);
		expect((err as ApiError).status).toBe(429);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(err as Error)).toBe(true);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(err as Error),
		).resolves.toEqual({ maxRetries: 5, headersRetryAfterMs: 2000 });
	});

	it('wraps non-ApiError failures', async () => {
		mockRequest.mockRejectedValueOnce(new Error('network down'));

		const err = await makeCodaRequest('/whoami', 'test-api-key').catch(
			(e) => e,
		);
		expect(err).toBeInstanceOf(CodaAPIError);
		expect((err as CodaAPIError).message).toBe('network down');
	});
});
