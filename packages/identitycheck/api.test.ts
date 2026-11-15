import { ApiError, request } from 'corsair/http';
import { identityCheckEndpointSchemas, identitycheck } from './index';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});
const mockedRequest = jest.mocked(request);
const plugin = identitycheck({ key: 'key-test' });
if (!plugin.endpoints) throw new Error('Missing endpoints');
const endpoints = plugin.endpoints;
const context = { key: 'key-test' } as never;

beforeEach(() => mockedRequest.mockReset());

describe('IdentityCheck public endpoint seam', () => {
	it.each([
		['create', '/api/v1/verification/create'],
		['sms', '/api/v1/verification/sms'],
		['kyb', '/api/v1/verification/namescan/kyb'],
		['tranche2', '/api/v1/verification/tranche2'],
	] as const)(
		'%s sends the documented POST and preserves opaque JSON',
		async (operation, url) => {
			mockedRequest.mockResolvedValue({
				reference: 'abc',
				nested: { value: null },
			});
			const input = { body: { custom: 'value', nested: { present: true } } };
			const validated =
				identityCheckEndpointSchemas[`verification.${operation}`].input.parse(
					input,
				);
			await expect(
				endpoints.verification[operation](context, validated),
			).resolves.toEqual({ reference: 'abc', nested: { value: null } });
			expect(mockedRequest).toHaveBeenCalledWith(
				expect.objectContaining({
					BASE: 'https://identity.stackgo.io',
					HEADERS: { Authorization: 'Basic key-test' },
				}),
				expect.objectContaining({
					method: 'POST',
					url,
					body: input.body,
					mediaType: 'application/json',
				}),
				expect.objectContaining({
					rateLimitConfig: expect.objectContaining({ maxRetries: 0 }),
				}),
			);
		},
	);

	it('retrieves a verification using an encoded ID and no body', async () => {
		mockedRequest.mockResolvedValue({ result: 'positive' });
		const input = identityCheckEndpointSchemas['verification.get'].input.parse({
			id: 'id #1',
		});
		await expect(endpoints.verification.get(context, input)).resolves.toEqual({
			result: 'positive',
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			expect.anything(),
			{ method: 'GET', url: '/api/v1/verification/info/id%20%231' },
			expect.anything(),
		);
	});

	it.each(['', '.', '..', 'a/b', 'a\\b', '"', "'"])(
		'rejects unsafe path ID %s',
		async (id) => {
			await expect(
				endpoints.verification.get(context, { id }),
			).rejects.toThrow();
			expect(mockedRequest).not.toHaveBeenCalled();
		},
	);

	it('rejects missing credentials and non-object responses', async () => {
		await expect(
			endpoints.verification.get({ key: '' } as never, { id: 'id' }),
		).rejects.toThrow();
		mockedRequest.mockResolvedValue('not an object');
		await expect(
			endpoints.verification.get(context, { id: 'id' }),
		).rejects.toThrow();
	});

	it('surfaces rate limits without retrying a write', async () => {
		const error = new ApiError(
			{ method: 'POST', url: '/api/v1/verification/create' },
			{
				url: 'https://identity.stackgo.io/api/v1/verification/create',
				ok: false,
				status: 429,
				statusText: 'Too Many Requests',
				body: {},
			},
			'Rate limited',
			{ retryAfter: 3000 },
		);
		mockedRequest.mockRejectedValue(error);
		await expect(
			endpoints.verification.create(context, { body: {} }),
		).rejects.toBe(error);
		expect(mockedRequest).toHaveBeenCalledTimes(1);
		const handler = plugin.errorHandlers?.RATE_LIMIT_ERROR;
		const errorContext = {
			pluginId: 'identitycheck',
			operation: 'verification.create',
			input: {},
			originalError: error,
		};
		expect(handler?.match(error, errorContext)).toBe(true);
		await expect(handler?.handler(error, errorContext)).resolves.toMatchObject({
			maxRetries: 0,
			headersRetryAfterMs: 3000,
		});
	});
});
