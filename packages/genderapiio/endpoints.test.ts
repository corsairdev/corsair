import { logEventFromContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { GenderApiIoAPIError, genderApiIoErrorInfo } from './client';
import {
	capabilities,
	errorCatalog,
	gender,
	genderBatch,
	phoneValidate,
	usage,
} from './endpoints';
import {
	aiResponse,
	batch,
	batchWithFailure,
	billingProblem,
	capabilities as capabilitiesFixture,
	emailResponse,
	errorCatalog as errorCatalogFixture,
	insufficientCreditsProblem,
	keyedMeta,
	phone,
	rateLimitProblem,
	sophiaResponse,
	unknownResponse,
	usage as usageFixture,
	validationProblem,
} from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const API_KEY = 'abcdefghijklmnopqrstuvwx';

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant. Each endpoint returns its own output type, so
// the shared return is unknown.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>;

// unknown: negative cases pass values no schema accepts.
function invoke(
	endpoint: AnyEndpoint,
	input: unknown,
	apiKey: string | null = API_KEY,
) {
	// The fake context carries what the endpoints read: the option key, and the
	// stored key behind it.
	const ctx = {
		key: apiKey ?? undefined,
		options: {},
		keys: { get_api_key: jest.fn().mockResolvedValue(apiKey) },
	};
	return endpoint(ctx as never, input as never);
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON.
function respond(
	body: unknown,
	status = 200,
	headers: Record<string, string> = {},
) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/problem+json', ...headers },
		}),
	);
}

function lastRequest() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	const parsed = new URL(url);
	return {
		origin: parsed.origin,
		path: parsed.pathname,
		query: Object.fromEntries(parsed.searchParams),
		method: init.method,
		headers: new Headers(init.headers),
		// unknown: the request body is whatever the endpoint serialized.
		body: init.body ? (JSON.parse(String(init.body)) as unknown) : undefined,
	};
}

/**
 * Runs a call that must fail and returns what it threw.
 */
// unknown: the rejection value is untyped by definition.
async function thrown(run: Promise<unknown>): Promise<Error> {
	try {
		await run;
	} catch (error) {
		return error as Error;
	}
	throw new Error('expected the call to fail, but it resolved');
}

/**
 * Runs a call that must fail and returns the GenderAPI.io fields of what it
 * threw: the problem document of core's ApiError, or the transport error.
 */
// unknown: the rejection value is untyped by definition.
async function failure(
	run: Promise<unknown>,
): Promise<GenderApiIoAPIError & Error> {
	const error = await thrown(run);
	return (genderApiIoErrorInfo(error) ?? error) as GenderApiIoAPIError & Error;
}

beforeEach(() => {
	jest.clearAllMocks();
	fetchMock = jest.spyOn(globalThis, 'fetch');
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('GenderAPI.io client', () => {
	it('sends the key as a bearer token against the documented base', async () => {
		respond(sophiaResponse);
		await invoke(gender, { type: 'name', value: 'Sophia' });

		const sent = lastRequest();
		expect(sent.origin).toBe('https://api.genderapi.io');
		expect(sent.path).toBe('/api/v2/gender');
		expect(sent.method).toBe('POST');
		expect(sent.headers.get('authorization')).toBe(`Bearer ${API_KEY}`);
	});

	it('omits the Authorization header when there is no key, which asks for the trial', async () => {
		respond(sophiaResponse);
		await invoke(gender, { type: 'name', value: 'Sophia' }, null);

		// An empty `Bearer ` would be an invalid key rather than a missing one.
		expect(lastRequest().headers.get('authorization')).toBeNull();
	});

	it('sends the key the key builder resolved, not a second lookup of the stored key', async () => {
		respond(sophiaResponse);
		const ctx = {
			// What the key builder or a before hook put on the context.
			key: 'hookkeyhookkeyhookkeyxx',
			options: { key: 'optionkeyoptionkeyoption' },
			keys: {
				get_api_key: jest.fn().mockResolvedValue('storedkeystoredkeystored'),
			},
		};
		await gender(ctx as never, { type: 'name', value: 'Sophia' } as never);

		expect(lastRequest().headers.get('authorization')).toBe(
			'Bearer hookkeyhookkeyhookkeyxx',
		);
		expect(ctx.keys.get_api_key).not.toHaveBeenCalled();
	});

	it('reads the code, action and field errors from a problem document', async () => {
		respond(validationProblem, 422);
		const error = await failure(
			invoke(gender, { type: 'name', value: 'Sophia' }),
		);

		expect(error).toBeInstanceOf(GenderApiIoAPIError);
		expect(error.status).toBe(422);
		expect(error.method).toBe('POST');
		expect(error.code).toBe('validation_error');
		expect(error.action).toBe('correct_request');
		expect(error.fieldErrors).toEqual([
			{
				pointer: '/type',
				message: 'must be equal to one of the allowed values',
			},
		]);
		expect(error.isValidationError).toBe(true);
	});

	it('passes core ApiError through without the names or emails it sent', async () => {
		respond(validationProblem, 422);
		const error = await thrown(
			invoke(gender, { type: 'email', value: 'jane.doe@example.com' }),
		);

		expect(error).toBeInstanceOf(ApiError);
		if (error instanceof ApiError) {
			expect(error.status).toBe(422);
			expect(error.request.method).toBe('POST');
			expect(JSON.stringify(error.request)).not.toContain('jane.doe');
			expect(error.message).not.toContain('jane.doe');
			expect(error.body).toMatchObject({ code: 'validation_error' });
		}
	});

	it('tells an insufficient balance apart from a generic 403', async () => {
		respond(insufficientCreditsProblem, 403);
		const error = await failure(
			invoke(gender, { type: 'name', value: 'Sophia' }),
		);

		expect(error.isPermissionError).toBe(true);
		expect(error.isCreditError).toBe(true);
		expect(error.action).toBe('add_credits_or_wait_for_reset');
	});

	it('reads Retry-After off a 429', async () => {
		respond(rateLimitProblem, 429, { 'Retry-After': '5' });
		const error = await failure(
			invoke(gender, { type: 'name', value: 'Sophia' }),
		);

		expect(error.isRateLimit).toBe(true);
		expect(error.retryAfter).toBe(5_000);
	});

	it('flags a billing problem as needing a check rather than a retry', async () => {
		respond(billingProblem, 503);
		const error = await failure(
			invoke(gender, { type: 'name', value: 'Sophia' }),
		);

		expect(error.needsBillingCheck).toBe(true);
	});

	it('exposes billing_status from the problem document', async () => {
		respond(
			{
				...billingProblem,
				code: 'prediction_timeout',
				status: 504,
				meta: {
					request_id: 'req-1',
					duration_ms: 30000,
					usage: {
						charged_credits: null,
						remaining_credits: null,
						billing_status: 'unconfirmed',
					},
				},
			},
			504,
		);
		const error = await failure(
			invoke(gender, { type: 'name', value: 'Sophia' }),
		);

		expect(error.billingStatus).toBe('unconfirmed');
		expect(error.needsBillingCheck).toBe(true);
	});

	it('marks a dropped connection as a transport failure', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));
		const error = await failure(
			invoke(gender, { type: 'name', value: 'Sophia' }),
		);

		expect(error.transport).toBe(true);
		expect(error.status).toBeUndefined();
	});
});

describe('genderapiio.gender.infer', () => {
	it('posts the documented body and returns the prediction', async () => {
		respond(sophiaResponse);
		const result = (await invoke(gender, {
			type: 'name',
			value: 'Sophia',
			country: 'US',
		})) as typeof sophiaResponse;

		expect(lastRequest().body).toEqual({
			type: 'name',
			value: 'Sophia',
			country: 'US',
		});
		expect(result.data.gender).toBe('female');
		expect(result.data.source).toBe('dataset');
	});

	it('returns a null gender as a result rather than throwing', async () => {
		respond(unknownResponse);
		const result = (await invoke(gender, {
			type: 'name',
			value: 'Xyzzyplugh',
		})) as typeof unknownResponse;

		expect(result.data.gender).toBeNull();
		expect(result.data.result_status).toBe('unknown');
		expect(result.data.reason).toBe('not_found');
	});

	it('accepts an email and a username as the value type', async () => {
		respond(emailResponse);
		await invoke(gender, { type: 'email', value: 'sophia.lee@example.com' });
		expect((lastRequest().body as { type: string }).type).toBe('email');

		respond(aiResponse);
		await invoke(gender, { type: 'username', value: 'xX_darklord_Xx' });
		expect((lastRequest().body as { type: string }).type).toBe('username');
	});

	it('passes ai_mode and forceToGenderize through', async () => {
		respond(aiResponse);
		await invoke(gender, {
			type: 'username',
			value: 'xX_darklord_Xx',
			// forceToGenderize only combines with fallback; the API refuses off or always.
			ai_mode: 'fallback',
			forceToGenderize: true,
		});

		// The v2 POST schema refuses a top-level ai_mode with a 422.
		// unknown: the sent JSON body is only inspected for a few keys here.
		const body = lastRequest().body as Record<string, unknown>;
		expect(body).toMatchObject({
			options: { ai_mode: 'fallback' },
			forceToGenderize: true,
		});
		expect(body).not.toHaveProperty('ai_mode');
	});

	it('sends no options object when ai_mode is not set', async () => {
		respond(sophiaResponse);
		await invoke(gender, { type: 'name', value: 'Sophia' });

		expect(lastRequest().body).not.toHaveProperty('options');
	});

	it('rejects an unknown type before making a request', async () => {
		const error = await failure(invoke(gender, { type: 'phone', value: 'x' }));

		expect(error.name).toBe('ZodError');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects an empty value before making a request', async () => {
		const error = await failure(invoke(gender, { type: 'name', value: '' }));

		expect(error.name).toBe('ZodError');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a country that is not two letters', async () => {
		const error = await failure(
			invoke(gender, { type: 'name', value: 'Kim', country: 'Denmark' }),
		);

		expect(error.name).toBe('ZodError');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('logs the outcome and cost without the value', async () => {
		respond(sophiaResponse);
		await invoke(gender, { type: 'name', value: 'Sophia' });

		const payload = mockLog.mock.calls.at(-1)?.[2];
		expect(payload).toMatchObject({
			gender: 'female',
			source: 'dataset',
			charged_credits: 1,
			access_mode: 'ip_trial',
		});
		expect(JSON.stringify(payload)).not.toContain('Sophia');
	});

	it('logs an unknown gender as unknown rather than null', async () => {
		respond(unknownResponse);
		await invoke(gender, { type: 'name', value: 'Xyzzyplugh' });

		expect(mockLog.mock.calls.at(-1)?.[2]).toMatchObject({ gender: 'unknown' });
	});
});

// The parsed batch result, typed from the plugin's own output.
async function genderBatchResult() {
	return (await invoke(genderBatch, {
		items: [{ type: 'name', value: 'Sophia' }],
	})) as Awaited<ReturnType<typeof genderBatch>>;
}

describe('genderapiio.gender.batch', () => {
	it('posts the items and returns one entry per item', async () => {
		respond(batch);
		const result = (await invoke(genderBatch, {
			items: [
				{ type: 'name', value: 'Sophia' },
				{ type: 'name', value: 'Michael', country: 'US' },
			],
		})) as typeof batch;

		expect(result.data).toHaveLength(2);
		expect(result.data[0]?.index).toBe(0);
		expect(result.data[1]?.index).toBe(1);
	});

	it("sends ai_mode under each item, an item's own mode wins", async () => {
		respond(batch);
		await invoke(genderBatch, {
			ai_mode: 'fallback',
			items: [
				{ type: 'name', value: 'Sophia' },
				{ type: 'username', value: 'xX_darklord_Xx', ai_mode: 'always' },
			],
		});

		// The batch schema has no top-level ai_mode; each item takes options.ai_mode.
		// unknown: each sent item is only inspected for a few keys here.
		const body = lastRequest().body as {
			items: Array<Record<string, unknown>>;
		};
		expect(body).not.toHaveProperty('ai_mode');
		expect(body.items[0]).toEqual({
			type: 'name',
			value: 'Sophia',
			options: { ai_mode: 'fallback' },
		});
		expect(body.items[1]).toMatchObject({ options: { ai_mode: 'always' } });
		expect(body.items[1]).not.toHaveProperty('ai_mode');
	});

	it('sends batch items without options when no ai_mode is set', async () => {
		respond(batch);
		await invoke(genderBatch, { items: [{ type: 'name', value: 'Sophia' }] });

		// unknown: each sent item is only inspected for a few keys here.
		const body = lastRequest().body as {
			items: Array<Record<string, unknown>>;
		};
		expect(body.items[0]).toEqual({ type: 'name', value: 'Sophia' });
	});

	it('keeps a per-item ID so a response can be matched to a row', async () => {
		respond(batch);
		await invoke(genderBatch, {
			items: [{ id: 'row-1', type: 'name', value: 'Sophia' }],
		});

		expect(
			(lastRequest().body as { items: Array<{ id: string }> }).items[0]?.id,
		).toBe('row-1');
	});

	it('reports the summary counts, which is what billing is based on', async () => {
		respond(batch);
		const result = (await invoke(genderBatch, {
			items: [{ type: 'name', value: 'Sophia' }],
		})) as typeof batch;

		expect(result.meta.summary).toEqual({
			total: 2,
			succeeded: 2,
			identified: 2,
			unknown: 0,
			failed: 0,
		});
	});

	it('allows an item to fail without failing the batch', async () => {
		respond(batchWithFailure);
		const result = (await invoke(genderBatch, {
			items: [{ type: 'name', value: 'Sophia' }],
		})) as typeof batchWithFailure;

		expect(result.data[1]?.error?.code).toBe('validation_error');
		expect(result.meta.summary?.failed).toBe(1);
	});

	it("keeps a failed item's detail and field errors, which is the reason it failed", async () => {
		respond(batchWithFailure);
		const result = await genderBatchResult();

		expect(result.data[1]?.error).toMatchObject({
			status: 422,
			detail: 'The request does not match the schema.',
			action: 'correct_request',
			errors: [{ pointer: '/value' }],
		});
	});

	it('caps a batch at 50 items', async () => {
		const error = await failure(
			invoke(genderBatch, {
				items: Array.from({ length: 51 }, () => ({
					type: 'name',
					value: 'x',
				})),
			}),
		);

		expect(error.name).toBe('ZodError');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects an empty batch before making a request', async () => {
		const error = await failure(invoke(genderBatch, { items: [] }));

		expect(error.name).toBe('ZodError');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('logs the summary, not the items', async () => {
		respond(batch);
		await invoke(genderBatch, {
			items: [{ type: 'name', value: 'Sophia' }],
		});

		const payload = mockLog.mock.calls.at(-1)?.[2];
		expect(payload).toMatchObject({
			total: 2,
			succeeded: 2,
			charged_credits: 2,
		});
		expect(JSON.stringify(payload)).not.toContain('Sophia');
	});
});

describe('genderapiio.phone.validate', () => {
	it('returns the E.164 form and the calling code', async () => {
		respond(phone);
		const result = (await invoke(phoneValidate, {
			number: '+14155552671',
			country: 'US',
		})) as typeof phone;

		expect(result.data).toMatchObject({
			valid: true,
			e164: '+14155552671',
			country_calling_code: 1,
		});
	});

	it('posts the number and the country', async () => {
		respond(phone);
		await invoke(phoneValidate, { number: '+14155552671', country: 'US' });

		expect(lastRequest().path).toBe('/api/v2/phone/validate');
		expect(lastRequest().body).toEqual({
			number: '+14155552671',
			country: 'US',
		});
	});

	it('rejects a number that is too short before making a request', async () => {
		const error = await failure(invoke(phoneValidate, { number: '12' }));

		expect(error.name).toBe('ZodError');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('logs the verdict without the number', async () => {
		respond(phone);
		await invoke(phoneValidate, { number: '+14155552671' });

		const payload = mockLog.mock.calls.at(-1)?.[2];
		expect(payload).toMatchObject({ valid: true, country: 'US' });
		expect(JSON.stringify(payload)).not.toContain('4155552671');
	});
});

describe('genderapiio.account.usage', () => {
	it('reads the free balance route with a GET', async () => {
		respond(usageFixture);
		await invoke(usage, {});

		expect(lastRequest().path).toBe('/api/v2/usage');
		expect(lastRequest().method).toBe('GET');
	});

	it('returns the balance and the trial reset', async () => {
		respond(usageFixture);
		const result = (await invoke(usage, {})) as typeof usageFixture;

		expect(result.data.remaining_credits).toBe(8);
		expect(result.data.limit).toBe(10);
	});

	it('says which mode answered, so a keyless setup is visible', async () => {
		respond(usageFixture);
		await invoke(usage, {}, null);

		expect(mockLog.mock.calls.at(-1)?.[2]).toMatchObject({
			access_mode: 'ip_trial',
		});
	});

	it('reports a keyed call as api_key', async () => {
		respond({ ...usageFixture, meta: keyedMeta });
		await invoke(usage, {});

		expect(mockLog.mock.calls.at(-1)?.[2]).toMatchObject({
			access_mode: 'api_key',
		});
	});
});

describe('genderapiio.account.capabilities', () => {
	it('returns the version, the AI flag and the batch limit', async () => {
		respond(capabilitiesFixture);
		const result = (await invoke(
			capabilities,
			{},
		)) as typeof capabilitiesFixture;

		expect(result.version).toBe('2.0.0');
		expect(result.capabilities?.max_batch_items).toBe(50);
		expect(lastRequest().path).toBe('/api/v2');
	});

	it('shows the default ai_mode differs between a single call and a batch', async () => {
		respond(capabilitiesFixture);
		const result = (await invoke(
			capabilities,
			{},
		)) as typeof capabilitiesFixture;

		expect(result.capabilities?.default_ai_mode).toEqual({
			single: 'fallback',
			batch: 'off',
		});
	});

	it('logs the limit that matters for a batch', async () => {
		respond(capabilitiesFixture);
		await invoke(capabilities, {});

		expect(mockLog.mock.calls.at(-1)?.[2]).toMatchObject({
			version: '2.0.0',
			ai: true,
			max_batch_items: 50,
		});
	});
});

describe('genderapiio.account.errorCatalog', () => {
	it('returns every code with its statuses and action', async () => {
		respond(errorCatalogFixture);
		const result = (await invoke(
			errorCatalog,
			{},
		)) as typeof errorCatalogFixture;

		expect(Object.keys(result.errors)).toEqual([
			'validation_error',
			'insufficient_credits',
		]);
		expect(result.errors.validation_error?.action).toBe('correct_request');
		expect(lastRequest().path).toBe('/api/v2/errors');
	});

	it('logs the number of codes', async () => {
		respond(errorCatalogFixture);
		await invoke(errorCatalog, {});

		expect(mockLog.mock.calls.at(-1)?.[2]).toMatchObject({ codes: 2 });
	});
});

describe('genderapiio event names', () => {
	// The event name must be the path a caller writes, so telemetry and the
	// catalog cannot drift apart. A flat name here was invisible to every
	// other test because none of them asserted this argument.
	it.each([
		[
			'genderapiio.gender.infer',
			gender,
			{ type: 'name', value: 'x' },
			sophiaResponse,
		] as const,
		[
			'genderapiio.gender.batch',
			genderBatch,
			{ items: [{ type: 'name', value: 'x' }] },
			batch,
		] as const,
		[
			'genderapiio.phone.validate',
			phoneValidate,
			{ number: '+14155552671' },
			phone,
		] as const,
		['genderapiio.account.usage', usage, {}, usageFixture] as const,
		[
			'genderapiio.account.capabilities',
			capabilities,
			{},
			capabilitiesFixture,
		] as const,
		[
			'genderapiio.account.errorCatalog',
			errorCatalog,
			{},
			errorCatalogFixture,
		] as const,
	])('emits %s', async (expected, endpoint, args, fixture) => {
		respond(fixture);
		await invoke(endpoint as never, args as never);
		expect(mockLog.mock.calls.at(-1)?.[1]).toBe(expected);
	});
});
