import { ApiError, request } from 'corsair/http';
import type { LinkupContext } from './context';
import { fetchPage, getCredits, search } from './endpoints/read';

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

function context(key?: string): LinkupContext {
	return { key } as unknown as LinkupContext;
}

describe('linkup', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('stores the balance and sends a Bearer token', async () => {
		mockRequest.mockResolvedValue({ balance: 12.5 });
		const result = await getCredits(context('sekrit'), {});
		expect(result.credit).toEqual({ id: 'balance', balance: 12.5 });
		expect(mockRequest.mock.calls[0]?.[0]?.HEADERS).toEqual({
			Accept: 'application/json',
			Authorization: 'Bearer sekrit',
		});
		expect(mockRequest.mock.calls[0]?.[0]?.TOKEN).toBeUndefined();
		expect(mockRequest.mock.calls[0]?.[1]).toMatchObject({
			method: 'GET',
			url: '/v1/credits/balance',
		});
	});

	it('stores a search result and drops the page text', async () => {
		mockRequest.mockResolvedValue({
			results: [
				{
					name: 'Example',
					url: 'https://example.com',
					content: 'secret page text',
					type: 'text',
				},
			],
		});
		const result = await search(context(), { q: 'weather' });
		expect(result.results).toEqual([
			{ id: 'https://example.com', name: 'Example', type: 'text' },
		]);
		expect(JSON.stringify(result)).not.toContain('secret page text');
	});

	it('returns markdown and drops raw html', async () => {
		mockRequest.mockResolvedValue({
			markdown: '# Hello',
			rawHtml: '<html>secret</html>',
			favicon: 'https://example.com/favicon.ico',
		});
		const result = await fetchPage(context(), { url: 'https://example.com' });
		expect(result).toEqual({ markdown: '# Hello' });
		expect(JSON.stringify(result)).not.toContain('secret');
	});

	it('lets an HTTP 401 through unchanged', async () => {
		const error = new ApiError(
			{ method: 'GET', url: '/v1/credits/balance' },
			{
				url: 'https://api.linkup.so/v1/credits/balance',
				ok: false,
				status: 401,
				statusText: 'Unauthorized',
				body: { statusCode: 401 },
			},
			'Unauthorized',
		);
		mockRequest.mockRejectedValue(error);
		await expect(getCredits(context(), {})).rejects.toBe(error);
	});
});
