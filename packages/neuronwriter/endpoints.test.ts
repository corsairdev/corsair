import { ApiError, request } from 'corsair/http';
import type { NeuronwriterContext } from './context';
import { importContent } from './endpoints/read';

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

function context(key?: string): NeuronwriterContext {
	return { key } as unknown as NeuronwriterContext;
}

describe('neuronwriter', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('stores the status and sends X-API-KEY', async () => {
		mockRequest.mockResolvedValue({ status: 'ok', content_score: 25 });
		const result = await importContent(context('sekrit'), {
			query: 'abc123',
			html: '<p>Hello</p>',
		});
		expect(result.imported).toEqual({
			id: 'abc123',
			status: 'ok',
			contentScore: 25,
		});
		expect(JSON.stringify(result)).not.toContain('Hello');
		expect(mockRequest.mock.calls[0]?.[0]?.HEADERS).toEqual({
			Accept: 'application/json',
			'Content-Type': 'application/json',
			'X-API-KEY': 'sekrit',
		});
		expect(mockRequest.mock.calls[0]?.[0]?.TOKEN).toBeUndefined();
		expect(mockRequest.mock.calls[0]?.[1]).toMatchObject({
			method: 'POST',
			url: '/neuron-api/0.5/writer/import-content',
		});
	});

	it('rejects a call with no html and no url', async () => {
		await expect(
			importContent(context(), { query: 'abc123' }),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('lets an HTTP 401 through unchanged', async () => {
		const error = new ApiError(
			{ method: 'POST', url: '/neuron-api/0.5/writer/import-content' },
			{
				url: 'https://app.neuronwriter.com/neuron-api/0.5/writer/import-content',
				ok: false,
				status: 401,
				statusText: 'Unauthorized',
				body: { error: 'Invalid or inactive API key.' },
			},
			'Unauthorized',
		);
		mockRequest.mockRejectedValue(error);
		await expect(
			importContent(context(), { query: 'abc123', html: '<p>x</p>' }),
		).rejects.toBe(error);
	});
});
