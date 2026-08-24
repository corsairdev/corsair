import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';
import {
	BASECAMP_API_BASE,
	BASECAMP_AUTH_BASE,
	BasecampAccountIdMissingError,
	compactObject,
	discoverBasecampAccountId,
	makeBasecampRequest,
	validateAccountId,
} from './client';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});
const mockRequest = request as jest.MockedFunction<typeof request>;

function lastCall(): [
	OpenAPIConfig,
	ApiRequestOptions,
	{ rateLimitConfig?: { maxRetries?: number } },
] {
	const call = mockRequest.mock.calls.at(-1);
	if (!call) throw new Error('request was not called');
	return call as unknown as [
		OpenAPIConfig,
		ApiRequestOptions,
		{ rateLimitConfig?: { maxRetries?: number } },
	];
}

beforeEach(() => mockRequest.mockReset());

describe('Basecamp client', () => {
	it('sends bearer auth and the required identifying User-Agent', async () => {
		mockRequest.mockResolvedValue({ id: 1 });
		await makeBasecampRequest(
			'/42/projects.json',
			'token',
			'Corsair Test (test@example.com)',
			{
				method: 'GET',
				retrySafe: true,
			},
		);
		const [config, options, transport] = lastCall();
		expect(config.BASE).toBe(BASECAMP_API_BASE);
		expect(config.TOKEN).toBeUndefined();
		expect(config.HEADERS).toMatchObject({
			Authorization: 'Bearer token',
			'User-Agent': 'Corsair Test (test@example.com)',
		});
		expect(options.url).toBe('/42/projects.json');
		expect(transport.rateLimitConfig?.maxRetries).toBe(3);
	});

	it('omits OAuth auth for keyed chatbot posting and disables retries', async () => {
		mockRequest.mockResolvedValue(undefined);
		await makeBasecampRequest(
			'/42/integrations/secret/lines.json',
			'token',
			'UA',
			{
				method: 'POST',
				body: { content: 'hello' },
				authenticated: false,
				retrySafe: false,
			},
		);
		const [config, , transport] = lastCall();
		expect(config.HEADERS).not.toHaveProperty('Authorization');
		expect(transport.rateLimitConfig?.maxRetries).toBe(0);
	});

	it('discovers exactly one current Basecamp account', async () => {
		mockRequest.mockResolvedValue({
			accounts: [
				{ id: 42, product: 'bc3', href: 'https://3.basecampapi.com/42' },
			],
		});
		await expect(discoverBasecampAccountId('token')).resolves.toBe('42');
		expect(lastCall()[0].BASE).toBe(BASECAMP_AUTH_BASE);
		expect(lastCall()[1].url).toBe('/authorization.json');
	});

	it('requires explicit selection when discovery is ambiguous', async () => {
		mockRequest.mockResolvedValue({
			accounts: [
				{ id: 1, product: 'bc3', href: 'https://3.basecampapi.com/1' },
				{ id: 2, product: 'bc3', href: 'https://3.basecampapi.com/2' },
			],
		});
		await expect(discoverBasecampAccountId('token')).rejects.toBeInstanceOf(
			BasecampAccountIdMissingError,
		);
	});

	it('validates account ids and compacts undefined recursively', () => {
		expect(validateAccountId('123')).toBe('123');
		expect(() => validateAccountId('../secret')).toThrow(
			BasecampAccountIdMissingError,
		);
		expect(
			compactObject({ a: 0, b: false, c: undefined, d: { e: undefined } }),
		).toEqual({
			a: 0,
			b: false,
			d: {},
		});
	});
});
