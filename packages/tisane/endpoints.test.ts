import { tisane } from './index';
import * as clientModule from './client';

jest.mock('./client', () => {
	const actual = jest.requireActual('./client');
	return {
		...actual,
		makeTisaneRequest: jest.fn(),
	};
});

describe('Tisane Plugin Endpoints', () => {
	const mockMakeTisaneRequest = clientModule.makeTisaneRequest as jest.MockedFunction<
		typeof clientModule.makeTisaneRequest
	>;
	const plugin = tisane({ key: 'test-api-key' });
	const endpoints = plugin.endpoints!;

	const mockContext = {
		key: 'test-api-key',
		authType: 'api_key' as const,
		options: { key: 'test-api-key' },
		schema: plugin.schema,
		$getAccountId: async () => 'test-account-id',
	} as any;

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('text.parse calls Tisane parse endpoint and returns parsed result', async () => {
		const mockResponse = {
			text: 'I love this product',
			language: 'en',
			sentiment: [{ aspect: 'product', polarity: 'positive' as const, score: 0.95 }],
		};
		mockMakeTisaneRequest.mockResolvedValueOnce(mockResponse);

		const result = await endpoints.text.parse(mockContext, {
			content: 'I love this product',
			language: 'en',
		});

		expect(result).toEqual(mockResponse);
		expect(mockMakeTisaneRequest).toHaveBeenCalledWith(
			'parse',
			'test-api-key',
			{
				method: 'POST',
				body: {
					content: 'I love this product',
					language: 'en',
					settings: {},
				},
			},
		);
	});

	it('text.sentiment performs aspect-based sentiment analysis', async () => {
		const mockResponse = {
			text: 'Great camera, awful battery',
			sentiment: [
				{ aspect: 'camera', polarity: 'positive' as const, score: 0.9 },
				{ aspect: 'battery', polarity: 'negative' as const, score: -0.8 },
			],
		};
		mockMakeTisaneRequest.mockResolvedValueOnce(mockResponse);

		const result = await endpoints.text.sentiment(mockContext, {
			content: 'Great camera, awful battery',
		});

		expect(result.sentiment).toBeDefined();
		expect(result.sentiment[0]?.aspect).toBe('camera');
		expect(result.sentiment[1]?.aspect).toBe('battery');
		expect(mockMakeTisaneRequest).toHaveBeenCalledWith(
			'parse',
			'test-api-key',
			{
				method: 'POST',
				body: {
					content: 'Great camera, awful battery',
					language: undefined,
					settings: { fetch_sentiment: true },
				},
			},
		);
	});

	it('text.moderate detects abusive language and returns flagged boolean', async () => {
		const mockResponse = {
			text: 'some text',
			abuse: [{ type: 'profanity', severity: 'low', text: 'darn' }],
		};
		mockMakeTisaneRequest.mockResolvedValueOnce(mockResponse);

		const result = await endpoints.text.moderate(mockContext, {
			content: 'some text',
		});

		expect(result.flagged).toBe(true);
		expect(result.abuse).toBeDefined();
		expect(result.abuse[0]?.type).toBe('profanity');
	});

	it('text.extractEntities extracts entities and topics', async () => {
		const mockResponse = {
			entities: [{ name: 'Google', type: 'Organization', score: 0.99 }],
			topics: [{ topic: 'artificial intelligence', score: 0.9 }],
		};
		mockMakeTisaneRequest.mockResolvedValueOnce(mockResponse);

		const result = await endpoints.text.extractEntities(mockContext, {
			content: 'Google is working on AI',
		});

		expect(result.entities).toBeDefined();
		expect(result.entities[0]?.name).toBe('Google');
		expect(result.topics[0]?.topic).toBe('artificial intelligence');
	});
});
