import { logEventFromContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { GenderizeAPIError, genderizeErrorInfo } from './client';
import { batch, predict } from './endpoints';
import { GenderizeEndpointInputSchemas } from './endpoints/types';
import {
	batch as batchFixture,
	invalidKey,
	invalidName,
	localizedPrediction,
	missingName,
	prediction,
	quotaReached,
	requestTooLow,
	subscriptionInactive,
	unknownPrediction,
} from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const API_KEY = 'genderize-api-key';

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant. Each endpoint returns its own output type, so
// the shared return is unknown.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>;

// unknown: negative cases pass values no schema accepts.
function invoke(endpoint: AnyEndpoint, input: unknown) {
	// The fake context carries what the endpoints read: the option key, and the
	// stored key behind it.
	const ctx = {
		key: API_KEY,
		options: {},
		keys: {
			get_api_key: jest.fn().mockResolvedValue(API_KEY),
		},
	};
	return endpoint(ctx as never, input as never);
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON.
function respond(body: unknown, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json' },
		}),
	);
}

function lastRequest() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	const parsed = new URL(url);
	return {
		origin: parsed.origin,
		path: parsed.pathname,
		// Repeated keys such as `name[]` are kept as a list, so a batch is visible.
		params: parsed.searchParams.getAll.bind(parsed.searchParams),
		query: Object.fromEntries(parsed.searchParams),
		method: init.method,
		headers: new Headers(init.headers),
	};
}

/**
 * Runs a call that must fail and returns what it threw. A Zod failure is an
 * Error too, so the caller narrows with `instanceof` when it needs the API
 * error's own fields.
 */
// unknown: the rejection value is untyped by definition.
async function failure(
	run: Promise<unknown>,
): Promise<Error & Partial<ApiError> & Partial<GenderizeAPIError>> {
	try {
		await run;
	} catch (error) {
		return error as Error & Partial<ApiError> & Partial<GenderizeAPIError>;
	}
	throw new Error('expected the call to fail, but it resolved');
}

beforeEach(() => {
	jest.clearAllMocks();
	fetchMock = jest.spyOn(globalThis, 'fetch');
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('Genderize client', () => {
	it('sends the key as an apikey query parameter, not a header', async () => {
		respond(prediction);
		await invoke(predict, { name: 'Alice' });

		const sent = lastRequest();
		expect(sent.origin).toBe('https://api.genderize.io');
		expect(sent.method).toBe('GET');
		expect(sent.query.apikey).toBe(API_KEY);
		expect(sent.headers.get('authorization')).toBeNull();
	});

	it('sends no apikey at all when none is configured, so the IP allowance is used', async () => {
		respond(prediction);
		const ctx = {
			key: undefined,
			options: {},
			keys: { get_api_key: jest.fn().mockResolvedValue(null) },
		};
		await predict(ctx as never, { name: 'Alice' } as never);

		expect(lastRequest().query.apikey).toBeUndefined();
	});

	it('sends the key the key builder resolved, which a before hook may replace', async () => {
		respond(prediction);
		respond(batchFixture);
		const getStored = jest.fn().mockResolvedValue('stored-key');
		const ctx = {
			key: 'hook-key',
			options: { key: 'option-key' },
			keys: { get_api_key: getStored },
		};
		await predict(ctx as never, { name: 'Alice' } as never);
		expect(lastRequest().query.apikey).toBe('hook-key');

		await batch(ctx as never, { names: ['Alice', 'Bob'] } as never);
		expect(lastRequest().query.apikey).toBe('hook-key');
		expect(getStored).not.toHaveBeenCalled();
	});

	it('has no per-call key field, so a key never travels in tool input', async () => {
		for (const schema of [
			GenderizeEndpointInputSchemas.predict,
			GenderizeEndpointInputSchemas.batch,
		]) {
			expect(Object.keys(schema.shape)).not.toContain('apikey');
		}
		const parsed = GenderizeEndpointInputSchemas.predict.parse({
			name: 'Alice',
			apikey: 'call-key',
		});
		expect(parsed).not.toHaveProperty('apikey');

		respond(prediction);
		await invoke(predict, { name: 'Alice', apikey: 'call-key' });
		expect(lastRequest().query.apikey).toBe(API_KEY);
	});

	it('keeps a refused key core ApiError, with its reason', async () => {
		respond(invalidKey, 401);
		const error = await failure(invoke(predict, { name: 'Alice' }));

		expect(error).toBeInstanceOf(ApiError);
		expect(error.status).toBe(401);
		expect(genderizeErrorInfo(error).reason).toBe('Invalid API key');
		expect(genderizeErrorInfo(error).isAuthError).toBe(true);
		expect(error.message).toContain('Genderize 401: Invalid API key');
	});

	it('treats 402 as a subscription problem, not an auth problem', async () => {
		respond(subscriptionInactive, 402);
		const error = await failure(invoke(predict, { name: 'Alice' }));

		expect(genderizeErrorInfo(error).isSubscriptionError).toBe(true);
		expect(genderizeErrorInfo(error).isAuthError).toBe(false);
	});

	it('reads Retry-After off a 429', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response(JSON.stringify(quotaReached), {
				status: 429,
				headers: { 'Content-Type': 'application/json', 'Retry-After': '30' },
			}),
		);
		const error = await failure(invoke(predict, { name: 'Alice' }));

		expect(genderizeErrorInfo(error).isRateLimit).toBe(true);
		// corsair/http normalises Retry-After to milliseconds.
		expect(error.retryAfter).toBe(30_000);
	});

	it('reads X-Rate-Limit-Remaining off a 429', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response(JSON.stringify(requestTooLow), {
				status: 429,
				headers: {
					'Content-Type': 'application/json',
					'X-Rate-Limit-Limit': '10',
					'X-Rate-Limit-Remaining': '3',
				},
			}),
		);
		const error = await failure(invoke(predict, { name: 'Alice' }));

		expect(genderizeErrorInfo(error).remaining).toBe(3);
	});

	it('keeps the names and the key off the error', async () => {
		respond(invalidKey, 401);
		const error = await failure(
			invoke(batch, { names: ['Zelophehad', 'Quirinus'] }),
		);

		expect(error).toBeInstanceOf(ApiError);
		const text = `${String(error)} ${JSON.stringify(error)}`;
		expect(text).not.toContain('Zelophehad');
		expect(text).not.toContain('Quirinus');
		expect(text).not.toContain(API_KEY);
		expect(error.request?.query).toBeUndefined();
		expect(error.url).not.toContain('?');
		expect(error.body).toEqual({ error: 'Invalid API key' });
	});

	it('marks a dropped connection as a transport failure', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));
		const error = await failure(invoke(predict, { name: 'Alice' }));

		expect(error).toBeInstanceOf(GenderizeAPIError);
		expect(error.transport).toBe(true);
		expect(error.status).toBeUndefined();
	});
});

describe('genderize.name.predict', () => {
	it('sends the name and returns the prediction', async () => {
		respond(prediction);
		const result = await invoke(predict, { name: 'Alice' });

		expect(lastRequest().query.name).toBe('Alice');
		expect(result).toMatchObject(prediction);
	});

	it('scopes the prediction with country_id, which the response echoes', async () => {
		respond(localizedPrediction);
		const result = (await invoke(predict, {
			name: 'Kim',
			country_id: 'DK',
		})) as typeof localizedPrediction;

		expect(lastRequest().query.country_id).toBe('DK');
		expect(result.gender).toBe('male');
		expect(result.country_id).toBe('DK');
	});

	it('returns a null gender rather than throwing when the name is unknown', async () => {
		respond(unknownPrediction);
		const result = await invoke(predict, { name: 'Xyzzyplugh' });

		expect(result).toMatchObject({ gender: null, probability: 0, count: 0 });
	});

	it('rejects an empty name before making a request', async () => {
		const error = await failure(invoke(predict, { name: '' }));

		expect(error.name).toBe('ZodError');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a country_id that is not two letters', async () => {
		const error = await failure(
			invoke(predict, { name: 'Kim', country_id: 'Denmark' }),
		);

		expect(error.name).toBe('ZodError');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('surfaces a missing name as a validation error', async () => {
		respond(missingName, 422);
		const error = await failure(invoke(predict, { name: 'Alice' }));

		expect(genderizeErrorInfo(error).isValidationError).toBe(true);
		expect(genderizeErrorInfo(error).reason).toBe("Missing 'name' parameter");
	});

	it('logs the prediction without the name', async () => {
		respond(prediction);
		await invoke(predict, { name: 'Alice' });

		const payload = mockLog.mock.calls.at(-1)?.[2];
		expect(payload).toMatchObject({ gender: 'female', probability: 0.99 });
		expect(JSON.stringify(payload)).not.toContain('Alice');
	});

	it('logs an unknown name as unknown rather than null', async () => {
		respond(unknownPrediction);
		await invoke(predict, { name: 'Xyzzyplugh' });

		expect(mockLog.mock.calls.at(-1)?.[2]).toMatchObject({ gender: 'unknown' });
	});
});

describe('genderize.batch.names', () => {
	it('repeats name[] for every name, which a joined list would not do', async () => {
		respond(batchFixture);
		await invoke(batch, { names: ['Alice', 'Bob', 'Stewie'] });

		const sent = lastRequest();
		expect(sent.params('name[]')).toEqual(['Alice', 'Bob', 'Stewie']);
		expect(sent.query.name).toBeUndefined();
	});

	it('returns one prediction per name, in order', async () => {
		respond(batchFixture);
		const result = (await invoke(batch, {
			names: ['Alice', 'Bob', 'Stewie'],
		})) as typeof batchFixture;

		expect(result).toHaveLength(3);
		expect(result[0]?.name).toBe('Alice');
		expect(result[2]?.name).toBe('Stewie');
	});

	it('applies country_id to the whole batch', async () => {
		respond(batchFixture);
		await invoke(batch, { names: ['Alice', 'Bob'], country_id: 'DK' });

		expect(lastRequest().query.country_id).toBe('DK');
	});

	it('rejects an empty list before making a request', async () => {
		const error = await failure(invoke(batch, { names: [] }));

		expect(error.name).toBe('ZodError');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects an empty name inside the list', async () => {
		const error = await failure(invoke(batch, { names: ['Alice', ''] }));

		expect(error.name).toBe('ZodError');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('surfaces a batch that is larger than the window as a rate limit', async () => {
		respond(requestTooLow, 429);
		const error = await failure(invoke(batch, { names: ['Alice', 'Bob'] }));

		expect(genderizeErrorInfo(error).isRateLimit).toBe(true);
		expect(genderizeErrorInfo(error).reason).toBe(
			'Request limit too low to process request',
		);
	});

	it('counts the unmatched names, because each name in a batch counts against the quota', async () => {
		respond([prediction, unknownPrediction]);
		await invoke(batch, { names: ['Alice', 'Xyzzyplugh'] });

		expect(mockLog.mock.calls.at(-1)?.[2]).toMatchObject({
			count: 2,
			unknown: 1,
		});
	});

	it('logs no name, only the counts', async () => {
		respond(batchFixture);
		await invoke(batch, { names: ['Alice', 'Bob', 'Stewie'] });

		const payload = mockLog.mock.calls.at(-1)?.[2];
		expect(payload).toMatchObject({ count: 3, unknown: 0 });
		expect(JSON.stringify(payload)).not.toContain('Alice');
	});

	it('surfaces an invalid name in a batch as a validation error', async () => {
		respond(invalidName, 422);
		const error = await failure(invoke(batch, { names: ['Alice'] }));

		expect(genderizeErrorInfo(error).isValidationError).toBe(true);
	});
});

describe('genderize event names', () => {
	// The event name must be the path a caller writes, so telemetry and the
	// catalog cannot drift apart. A flat name here was invisible to every
	// other test because none of them asserted this argument.
	it.each([
		['genderize.name.predict', predict, { name: 'Alice' }, prediction] as const,
		[
			'genderize.batch.names',
			batch,
			{ names: ['Alice'] },
			batchFixture,
		] as const,
	])('emits %s', async (expected, endpoint, args, fixture) => {
		respond(fixture);
		await invoke(endpoint as never, args as never);
		expect(mockLog.mock.calls.at(-1)?.[1]).toBe(expected);
	});
});
