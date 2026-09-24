import { ApiError } from 'corsair/http';
import { DictionaryApiAPIError, getEntry } from './client';
import { Entries } from './endpoints';
import { GetEntryInputSchema, GetEntryOutputSchema } from './endpoints/types';
import { errorHandlers } from './error-handlers';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return {
		...actual,
		request: jest.fn(),
	};
});

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return {
		...actual,
		logEventFromContext: jest.fn().mockResolvedValue(undefined),
	};
});

import { request } from 'corsair/http';

const mockedRequest = request as jest.MockedFunction<typeof request>;

describe('DictionaryApi Input Schema', () => {
	it('accepts valid words', () => {
		const parsed = GetEntryInputSchema.parse({ word: 'computer' });
		expect(parsed.word).toBe('computer');
	});

	it('trims leading and trailing whitespace', () => {
		const parsed = GetEntryInputSchema.parse({ word: '  hello  ' });
		expect(parsed.word).toBe('hello');
	});

	it('rejects empty words', () => {
		expect(() => GetEntryInputSchema.parse({ word: '' })).toThrow();
		expect(() => GetEntryInputSchema.parse({ word: '   ' })).toThrow();
	});

	it('rejects missing word property', () => {
		expect(() => GetEntryInputSchema.parse({})).toThrow();
	});
});

describe('DictionaryApi Output Schema', () => {
	it('parses valid Merriam-Webster dictionary entry objects', () => {
		const fixture = [
			{
				meta: {
					id: 'computer',
					uuid: '1234-abcd',
					src: 'collegiate',
					stems: ['computer', 'computers'],
					offensive: false,
				},
				hwi: {
					hw: 'com*put*er',
					prs: [
						{
							mw: 'kəm-ˈpyü-tər',
							sound: { audio: 'comput01' },
						},
					],
				},
				fl: 'noun',
				shortdef: [
					'one that computes',
					'a programmable electronic device designed to process data',
				],
			},
		];

		const result = GetEntryOutputSchema.parse(fixture);
		expect(result).toHaveLength(1);
		const first = result[0];
		expect(typeof first).toBe('object');
		if (typeof first === 'object' && first !== null && 'meta' in first) {
			expect(first.meta?.id).toBe('computer');
			expect(first.fl).toBe('noun');
			expect(first.shortdef).toContain('one that computes');
			expect(first.hwi?.hw).toBe('com*put*er');
		}
	});

	it('parses spelling suggestions when a word is not found', () => {
		const suggestionsFixture = [
			'computr',
			'computer',
			'computers',
			'compute',
			'commuter',
		];

		const result = GetEntryOutputSchema.parse(suggestionsFixture);
		expect(result).toHaveLength(5);
		expect(typeof result[0]).toBe('string');
		expect(result[0]).toBe('computr');
		expect(result).toContain('computer');
	});
});

describe('DictionaryApi Client', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('throws error when API key is missing', async () => {
		await expect(getEntry('hello', '')).rejects.toThrow(DictionaryApiAPIError);
		await expect(getEntry('hello', '')).rejects.toThrow(
			'Merriam-Webster API key is required',
		);
	});

	it('calls request with correct endpoint and key query parameter', async () => {
		const mockResponse = [{ meta: { id: 'hello' } }];
		mockedRequest.mockResolvedValueOnce(mockResponse);

		const data = await getEntry('hello', 'test-api-key');

		expect(mockedRequest).toHaveBeenCalledTimes(1);
		const callConfig = mockedRequest.mock.calls[0]![0];
		const callOptions = mockedRequest.mock.calls[0]![1];

		expect(callConfig.BASE).toBe(
			'https://www.dictionaryapi.com/api/v3/references/collegiate/json',
		);
		expect(callOptions.method).toBe('GET');
		expect(callOptions.url).toBe('/hello');
		expect(callOptions.query).toEqual({ key: 'test-api-key' });
		expect(data).toEqual(mockResponse);
	});

	it('throws DictionaryApiAPIError when Merriam-Webster returns plain text error string', async () => {
		mockedRequest.mockResolvedValueOnce(
			'Invalid API key or not subscribed to this database.',
		);

		await expect(getEntry('hello', 'invalid-key')).rejects.toThrow(
			'Invalid API key or not subscribed to this database.',
		);
	});

	it('wraps generic errors into DictionaryApiAPIError', async () => {
		mockedRequest.mockRejectedValueOnce(new Error('Network offline'));

		await expect(getEntry('hello', 'test-key')).rejects.toThrow(
			'Network offline',
		);
	});
});

describe('DictionaryApi Error Handlers', () => {
	it('identifies 429 rate limit errors and returns retry config', async () => {
		const rateLimitError = new ApiError(
			{ method: 'GET', url: '/test' },
			{
				body: { message: 'Too Many Requests' },
				ok: false,
				status: 429,
				statusText: 'Too Many Requests',
				url: '/test',
			},
			'rate_limited',
		);

		expect(errorHandlers.RATE_LIMIT_ERROR.match(rateLimitError)).toBe(true);
		const handlerResult =
			await errorHandlers.RATE_LIMIT_ERROR.handler(rateLimitError);
		expect(handlerResult.maxRetries).toBe(5);
	});

	it('identifies 401 and invalid API key errors as auth errors', async () => {
		const authError = new Error('Invalid API key or not subscribed');
		expect(errorHandlers.AUTH_ERROR.match(authError)).toBe(true);
		const handlerResult = await errorHandlers.AUTH_ERROR.handler(authError);
		expect(handlerResult.maxRetries).toBe(0);
	});

	it('identifies 404 not found errors', async () => {
		const notFoundError = new Error('Resource not found: 404');
		expect(errorHandlers.NOT_FOUND_ERROR.match(notFoundError)).toBe(true);
	});
});

describe('DictionaryApi entries.get Endpoint', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('executes entries.get successfully and returns validated output', async () => {
		const mockEntries = [
			{
				meta: { id: 'test' },
				shortdef: ['a procedure for critical evaluation'],
			},
		];
		mockedRequest.mockResolvedValueOnce(mockEntries);

		const fakeContext = {
			key: 'valid-api-key',
		};

		const result = await Entries.get(fakeContext as never, { word: 'test' });
		expect(result).toHaveLength(1);
		expect((result[0] as { meta: { id: string } }).meta.id).toBe('test');
	});
});
