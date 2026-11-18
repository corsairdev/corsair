import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import type { JsonValue } from './client';
import {
	describeFailure,
	HONEYBADGER_HOSTS,
	HoneybadgerAPIError,
	makeHoneybadgerRequest,
	readErrorBody,
	segment,
} from './client';
import { rejection } from './test-helpers';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockRequest = jest.mocked(request);

function apiError(
	status: number,
	body: JsonValue,
	options: { retryAfter?: number; requestBody?: JsonValue } = {},
): ApiError {
	const requestOptions: ApiRequestOptions = {
		method: 'POST',
		url: '/projects',
		body: options.requestBody,
	};
	return new ApiError(
		requestOptions,
		{
			url: 'https://app.honeybadger.io/v3/projects',
			ok: false,
			status,
			statusText: 'error',
			body,
		},
		'error',
		options.retryAfter === undefined
			? undefined
			: { retryAfter: options.retryAfter },
	);
}

beforeEach(() => {
	mockRequest.mockReset();
});

describe('makeHoneybadgerRequest', () => {
	it('sends the token as a Bearer header and nothing in the query', async () => {
		mockRequest.mockResolvedValueOnce({ data: [] });

		await makeHoneybadgerRequest('hbu_x', {
			method: 'GET',
			path: '/projects',
			query: { per_page: 10, name: undefined },
		});

		const [config, options] = mockRequest.mock.calls[0] as [
			OpenAPIConfig,
			ApiRequestOptions,
		];
		expect(config.BASE).toBe(HONEYBADGER_HOSTS.us);
		expect(config.TOKEN).toBe('hbu_x');
		// The header the config adds is `Authorization`, and it is added from
		// `TOKEN` by core, so the plugin does not set it itself.
		expect(Object.keys(config.HEADERS ?? {})).toEqual(['Accept']);
		expect(options.query).toEqual({ per_page: 10, name: undefined });
		expect(options.url).toBe('/projects');
	});

	it('uses the EU host when asked', async () => {
		mockRequest.mockResolvedValueOnce({ data: [] });

		await makeHoneybadgerRequest(
			'hbu_x',
			{ method: 'GET', path: '/projects' },
			'eu',
		);

		const [config] = mockRequest.mock.calls[0] as [
			OpenAPIConfig,
			ApiRequestOptions,
		];
		expect(config.BASE).toBe(HONEYBADGER_HOSTS.eu);
	});

	it('sends a JSON body on a write and none on a read', async () => {
		mockRequest.mockResolvedValue({ data: {} });

		await makeHoneybadgerRequest('hbu_x', {
			method: 'POST',
			path: '/projects',
			body: { name: 'Billing' },
		});
		await makeHoneybadgerRequest('hbu_x', { method: 'GET', path: '/projects' });

		const [writeConfig, write] = mockRequest.mock.calls[0] as [
			OpenAPIConfig,
			ApiRequestOptions,
		];
		const [readConfig, read] = mockRequest.mock.calls[1] as [
			OpenAPIConfig,
			ApiRequestOptions,
		];
		expect(write.body).toEqual({ name: 'Billing' });
		expect(write.mediaType).toBe('application/json');
		expect(read.body).toBeUndefined();
		expect(read.mediaType).toBeUndefined();
		// The config is the same shape either way; only the request differs.
		expect(writeConfig).toEqual(readConfig);
	});

	it('leaves only one attempt to the transport', async () => {
		mockRequest.mockResolvedValueOnce({ data: [] });

		await makeHoneybadgerRequest('hbu_x', { method: 'GET', path: '/projects' });

		// The third argument is core's request options. `enabled: true` is what
		// makes the client read Retry-After onto the error for the handlers.
		const requestOptions = mockRequest.mock.calls[0]?.[2] as
			| {
					rateLimitConfig: {
						enabled: boolean;
						maxRetries: number;
						headerNames: Record<string, string>;
					};
			  }
			| undefined;
		// The second call argument is where the transport options live; the test
		// asserts on the object the client actually built.
		const rateLimit = requestOptions?.rateLimitConfig;
		expect(rateLimit?.enabled).toBe(true);
		expect(rateLimit?.maxRetries).toBe(0);
		expect(rateLimit?.headerNames).toEqual({ retryAfter: 'retry-after' });
	});

	it('turns an ApiError into a typed failure with the code and wait', async () => {
		mockRequest.mockRejectedValueOnce(
			apiError(
				429,
				{ error: { code: 'rate_limit_exceeded', message: 'Slow down.' } },
				{ retryAfter: 5000 },
			),
		);

		const error = (await rejection(
			makeHoneybadgerRequest('hbu_x', { method: 'GET', path: '/projects' }),
		)) as HoneybadgerAPIError;

		expect(error).toBeInstanceOf(HoneybadgerAPIError);
		expect([error.status, error.code, error.retryAfter]).toEqual([
			429,
			'rate_limit_exceeded',
			5000,
		]);
		expect(error.message).toBe(
			'Honeybadger 429 rate_limit_exceeded: Slow down.',
		);
	});

	it('never puts the token in the error, whatever the request carried', async () => {
		mockRequest.mockRejectedValueOnce(
			apiError(
				422,
				{ error: { code: 'validation_error', message: 'Bad.' } },
				{
					requestBody: { name: 'Billing', api_key: 'hbu_secret' },
				},
			),
		);

		const error = (await rejection(
			makeHoneybadgerRequest('hbu_secret', {
				method: 'POST',
				path: '/projects',
				body: { name: 'Billing', api_key: 'hbu_secret' },
			}),
		)) as HoneybadgerAPIError;

		const inspect = require('node:util').inspect(error) as string;
		expect(error.message).not.toContain('hbu_secret');
		expect(inspect).not.toContain('hbu_secret');
		expect(JSON.stringify(error)).not.toContain('hbu_secret');
	});

	it('marks a transport failure with no status, so it reads as a network error', async () => {
		mockRequest.mockRejectedValueOnce(new TypeError('fetch failed'));

		const error = (await rejection(
			makeHoneybadgerRequest('hbu_x', {
				method: 'POST',
				path: '/projects',
				body: {},
			}),
		)) as HoneybadgerAPIError;

		expect(error.status).toBeUndefined();
		expect(error.method).toBe('POST');
		expect(error.replayable).toBe(false);
		expect(error.message).toBe('fetch failed');
	});

	it('keeps the token out of a transport error that quotes it', async () => {
		// Headers rejects a value with a newline and quotes the value.
		mockRequest.mockRejectedValueOnce(
			new TypeError(
				'Headers.append: "Bearer hbu_bad\n" is an invalid header value.',
			),
		);

		const error = (await rejection(
			makeHoneybadgerRequest('hbu_bad\n', { method: 'GET', path: '/projects' }),
		)) as HoneybadgerAPIError;

		expect(error.message).not.toContain('hbu_bad');
		expect(error.message).toContain('[redacted]');
	});

	it('treats a GET as replayable and a POST as not, unless told otherwise', async () => {
		mockRequest.mockRejectedValue(new TypeError('fetch failed'));

		const read = (await rejection(
			makeHoneybadgerRequest('k', { method: 'GET', path: '/projects' }),
		)) as HoneybadgerAPIError;
		const write = (await rejection(
			makeHoneybadgerRequest('k', { method: 'POST', path: '/projects' }),
		)) as HoneybadgerAPIError;
		const readOnlyPost = (await rejection(
			makeHoneybadgerRequest('k', {
				method: 'POST',
				path: '/projects/x/insights/queries',
				replayable: true,
			}),
		)) as HoneybadgerAPIError;

		expect([
			read.replayable,
			write.replayable,
			readOnlyPost.replayable,
		]).toEqual([true, false, true]);
	});
});

describe('readErrorBody', () => {
	it('reads the documented envelope', () => {
		expect(
			readErrorBody({
				error: { code: 'not_found', message: 'Nope.', details: [] },
			}),
		).toEqual({ code: 'not_found', message: 'Nope.', details: [] });
	});

	it('returns nothing for a body that is not the envelope', () => {
		// A proxy can answer with HTML or plain text.
		expect(readErrorBody('<html>502</html>')).toEqual({});
		expect(readErrorBody(undefined)).toEqual({});
		expect(readErrorBody({ error: 'Access denied' })).toEqual({});
	});
});

describe('describeFailure', () => {
	it('renders the status and code before the message', () => {
		expect(
			describeFailure(404, { code: 'not_found', message: 'Nope.' }, 'fallback'),
		).toBe('Honeybadger 404 not_found: Nope.');
	});

	it('falls back when the body carries no message', () => {
		expect(describeFailure(503, {}, 'Service Unavailable')).toBe(
			'Honeybadger 503: Service Unavailable',
		);
	});

	it('names each field a validation error is about', () => {
		expect(
			describeFailure(
				422,
				{
					code: 'validation_error',
					message: 'The body is invalid.',
					details: [
						{ field: 'name', message: "can't be blank" },
						{ field: 'check_ins.nightly.report_period', message: 'is invalid' },
					],
				},
				'fallback',
			),
		).toBe(
			"Honeybadger 422 validation_error: The body is invalid. (name: can't be blank; check_ins.nightly.report_period: is invalid)",
		);
	});

	it('names the scope a 403 needs and the scopes the token holds', () => {
		expect(
			describeFailure(
				403,
				{
					code: 'insufficient_scope',
					message: 'Missing scope.',
					details: {
						required_scope: 'faults:write',
						token_scopes: ['faults:read'],
					},
				},
				'fallback',
			),
		).toBe(
			'Honeybadger 403 insufficient_scope: Missing scope. (needs scope faults:write; token has faults:read)',
		);
	});

	it('names the fault a 409 was merged into', () => {
		expect(
			describeFailure(
				409,
				{
					code: 'fault_merged',
					message: 'Merged.',
					details: { merged_into: '67890', location: '/v3/x' },
				},
				'fallback',
			),
		).toBe('Honeybadger 409 fault_merged: Merged. (merged into fault 67890)');
	});
});

describe('segment', () => {
	it('encodes a path segment', () => {
		expect(segment('a/b c')).toBe('a%2Fb%20c');
	});
});
