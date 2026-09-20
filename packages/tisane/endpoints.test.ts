import { AuthMissingError, logEventFromContext } from 'corsair/core';
import * as clientModule from './client';
import {
	TisaneEndpointInputSchemas,
	TisaneEndpointOutputSchemas,
} from './endpoints/types';
import { tisane } from './index';

jest.mock('corsair/core', () => {
	const original = jest.requireActual('corsair/core');
	return {
		...original,
		logEventFromContext: jest.fn().mockResolvedValue(undefined),
	};
});

jest.mock('./client', () => {
	const actual = jest.requireActual('./client');
	return {
		...actual,
		makeTisaneRequest: jest.fn(),
	};
});

const mockMakeTisaneRequest =
	clientModule.makeTisaneRequest as jest.MockedFunction<
		typeof clientModule.makeTisaneRequest
	>;
const mockLog = jest.mocked(logEventFromContext);

function createCtx() {
	return { key: 'test-api-key' } as never;
}

const documentedParsePayload = {
	text: 'OpenAI makes excellent cameras.',
	language: 'en',
	sentiment_expressions: [
		{
			polarity: 'positive' as const,
			offset: 18,
			length: 9,
			sentence_index: 0,
			targets: ['cameras'],
			text: 'excellent',
		},
	],
	entities_summary: [
		{
			name: 'OpenAI',
			type: 'organization',
			mentions: [{ sentence_index: 0, offset: 0, length: 6 }],
		},
	],
	topics: ['artificial intelligence', { topic: 'photography', coverage: 0.4 }],
	abuse: [],
};

describe('Tisane Plugin Endpoints', () => {
	const plugin = tisane({ key: 'test-api-key' });
	const endpoints = plugin.endpoints!;

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('text.parse posts language, content, and documented settings', async () => {
		mockMakeTisaneRequest.mockResolvedValueOnce(documentedParsePayload);

		const result = await endpoints.text.parse(createCtx(), {
			content: 'OpenAI makes excellent cameras.',
			language: 'en',
			settings: { sentiment: true, entities: true },
		});

		expect(result.entities_summary?.[0]?.name).toBe('OpenAI');
		expect(result.sentiment_expressions?.[0]?.polarity).toBe('positive');
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'tisane.text.parse',
			expect.objectContaining({ language: 'en' }),
			'completed',
		);
		expect(mockMakeTisaneRequest).toHaveBeenCalledWith(
			'parse',
			'test-api-key',
			{
				method: 'POST',
				body: {
					content: 'OpenAI makes excellent cameras.',
					language: 'en',
					settings: { sentiment: true, entities: true },
				},
			},
		);
	});

	it('text.sentiment maps sentiment_expressions and sends settings.sentiment', async () => {
		mockMakeTisaneRequest.mockResolvedValueOnce(documentedParsePayload);

		const result = await endpoints.text.sentiment(createCtx(), {
			content: 'OpenAI makes excellent cameras.',
			language: 'en',
		});

		expect(result.sentiment[0]?.polarity).toBe('positive');
		expect(result.sentiment[0]?.text).toBe('excellent');
		expect(result.text).toBe('OpenAI makes excellent cameras.');
		expect(mockMakeTisaneRequest).toHaveBeenCalledWith(
			'parse',
			'test-api-key',
			{
				method: 'POST',
				body: {
					content: 'OpenAI makes excellent cameras.',
					language: 'en',
					settings: { sentiment: true, snippets: true },
				},
			},
		);
	});

	it('text.moderate maps abuse and sends settings.abuse', async () => {
		mockMakeTisaneRequest.mockResolvedValueOnce({
			text: 'You are a complete idiot.',
			abuse: [
				{
					type: 'personal_attack',
					severity: 'high',
					text: 'You are a complete idiot.',
					offset: 0,
					length: 24,
					sentence_index: 0,
				},
			],
		});

		const result = await endpoints.text.moderate(createCtx(), {
			content: 'You are a complete idiot.',
			language: 'en',
		});

		expect(result.flagged).toBe(true);
		expect(result.abuse[0]?.type).toBe('personal_attack');
		expect(mockMakeTisaneRequest).toHaveBeenCalledWith(
			'parse',
			'test-api-key',
			{
				method: 'POST',
				body: {
					content: 'You are a complete idiot.',
					language: 'en',
					settings: { abuse: true, snippets: true },
				},
			},
		);
	});

	it('text.extractEntities maps entities_summary and string topics', async () => {
		mockMakeTisaneRequest.mockResolvedValueOnce(documentedParsePayload);

		const result = await endpoints.text.extractEntities(createCtx(), {
			content: 'OpenAI makes excellent cameras.',
			language: 'en',
		});

		expect(result.entities[0]?.name).toBe('OpenAI');
		expect(result.topics).toEqual([
			{ topic: 'artificial intelligence' },
			{ topic: 'photography', coverage: 0.4 },
		]);
		expect(mockMakeTisaneRequest).toHaveBeenCalledWith(
			'parse',
			'test-api-key',
			{
				method: 'POST',
				body: {
					content: 'OpenAI makes excellent cameras.',
					language: 'en',
					settings: { entities: true, topics: true, snippets: true },
				},
			},
		);
	});

	it('rejects a parse payload missing text', async () => {
		mockMakeTisaneRequest.mockResolvedValueOnce({ language: 'en' });

		await expect(
			endpoints.text.parse(createCtx(), {
				content: 'hello',
				language: 'en',
			}),
		).rejects.toThrow();
	});
});

describe('Tisane input schemas', () => {
	it('requires language on every text operation', () => {
		expect(
			TisaneEndpointInputSchemas.textParse.safeParse({ content: 'hi' }).success,
		).toBe(false);
		expect(
			TisaneEndpointInputSchemas.textSentiment.safeParse({ content: 'hi' })
				.success,
		).toBe(false);
		expect(
			TisaneEndpointInputSchemas.textModerate.safeParse({ content: 'hi' })
				.success,
		).toBe(false);
		expect(
			TisaneEndpointInputSchemas.textExtractEntities.safeParse({
				content: 'hi',
			}).success,
		).toBe(false);
	});

	it('parses a documented /parse payload', () => {
		const parsed = TisaneEndpointOutputSchemas.textParse.safeParse(
			documentedParsePayload,
		);
		expect(parsed.success).toBe(true);
	});
});

describe('keyBuilder resolution', () => {
	it('throws AuthMissingError when no key is available', async () => {
		const oldEnv = process.env.TISANE_API_KEY;
		Reflect.deleteProperty(process.env, 'TISANE_API_KEY');

		try {
			const plugin = tisane({});
			const mockCtx = {
				authType: 'api_key',
				keys: { get_api_key: jest.fn().mockResolvedValue(undefined) },
			};

			await expect(
				plugin.keyBuilder!(mockCtx as never, 'endpoint'),
			).rejects.toBeInstanceOf(AuthMissingError);
		} finally {
			if (oldEnv === undefined) {
				Reflect.deleteProperty(process.env, 'TISANE_API_KEY');
			} else {
				process.env.TISANE_API_KEY = oldEnv;
			}
		}
	});

	it('resolves explicit options.key', async () => {
		const plugin = tisane({ key: 'explicit-key' });
		const key = await plugin.keyBuilder!(
			{ authType: 'api_key' } as never,
			'endpoint',
		);
		expect(key).toBe('explicit-key');
	});
});
