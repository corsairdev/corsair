import { logEventFromContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { GenderApiAPIError, genderApiErrorInfo } from './client';
import {
	countryOfOrigin,
	email,
	fullName,
	multi,
	name,
	stats,
} from './endpoints';
import {
	alice,
	andreaGermany,
	andreaItaly,
	countryOfOrigin as countryOfOriginFixture,
	countryOfOriginLive,
	emailLookup,
	internalError,
	invalidCountry,
	invalidKeyOn200,
	invalidKeyOnStats,
	limitReached,
	multi as multiFixture,
	nameNotSet,
	splitName,
	splitNameStrict,
	splitNameStrictLive,
	stats as statsFixture,
	tooManyNames,
	unknownGender,
} from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const API_KEY = 'gender-api-server-key';

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
		keys: { get_api_key: jest.fn().mockResolvedValue(API_KEY) },
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
		query: Object.fromEntries(parsed.searchParams),
		method: init.method,
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
): Promise<Error & Partial<GenderApiAPIError> & Partial<ApiError>> {
	try {
		await run;
	} catch (error) {
		return error as Error & Partial<GenderApiAPIError> & Partial<ApiError>;
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

describe('Gender API client', () => {
	it('sends the key as a query parameter against the documented base', async () => {
		respond(alice);
		await invoke(name, { name: 'Alice' });

		const sent = lastRequest();
		expect(sent.origin).toBe('https://gender-api.com');
		expect(sent.path).toBe('/get');
		expect(sent.method).toBe('GET');
		expect(sent.query.key).toBe(API_KEY);
	});

	it('sends the key Corsair resolved for the call, not a fresh store read', async () => {
		respond(alice);
		const getStored = jest.fn().mockResolvedValue('stored-key');
		const ctx = {
			key: 'key-set-by-a-before-hook',
			options: {},
			keys: { get_api_key: getStored },
		};
		await name(ctx as never, { name: 'Alice' } as never);

		expect(lastRequest().query.key).toBe('key-set-by-a-before-hook');
		expect(getStored).not.toHaveBeenCalled();
	});

	it('raises AuthMissingError before any request when no key was resolved', async () => {
		const ctx = { key: '', options: {}, keys: {} };
		const error = await failure(name(ctx as never, { name: 'Alice' } as never));

		expect(error.name).toBe('AuthMissingError');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('throws on a refused key even though the status was 200', async () => {
		respond(invalidKeyOn200);
		const error = await failure(invoke(name, { name: 'Alice' }));

		expect(error).toBeInstanceOf(GenderApiAPIError);
		expect(error.errno).toBe(40);
		expect(error.bodyError).toBe(true);
		expect(error.isAuthError).toBe(true);
		expect(error.message).toContain('invalid or missing key');
	});

	it('reads a refusal from the stats route, which has its own shape', async () => {
		respond(invalidKeyOnStats);
		const error = await failure(invoke(stats, {}));

		expect(error.errno).toBe(40);
		expect(error.isAuthError).toBe(true);
	});

	it('marks a used-up quota as its own case, with the upgrade link', async () => {
		respond(limitReached);
		const error = await failure(invoke(countryOfOrigin, { name: 'Markus' }));

		expect(error.isLimitReached).toBe(true);
		expect(error.isAuthError).toBe(false);
		expect(error.upgradeUrl).toBe(
			'https://gender-api.com/en/pricing?from=api-limit',
		);
	});

	it('classifies the documented validation codes', async () => {
		respond(invalidCountry);
		const error = await failure(invoke(name, { name: 'kim' }));

		expect(error.isValidationError).toBe(true);
	});

	it('keeps an HTTP failure core ApiError, without the name, email or key', async () => {
		respond({ errno: 500, errmsg: 'internal error' }, 502);
		const error = await failure(
			invoke(email, { email: 'zelophehad.quirinus@example.com' }),
		);

		expect(error).toBeInstanceOf(ApiError);
		expect(error.status).toBe(502);
		const text = `${String(error)} ${JSON.stringify(error)}`;
		expect(text).not.toContain('zelophehad');
		expect(text).not.toContain(API_KEY);
		expect(error.request?.query).toBeUndefined();
		expect(error.url).not.toContain('?');
		expect(error.body).toEqual({ errno: 500, errmsg: 'internal error' });
		expect(genderApiErrorInfo(error)).toMatchObject({
			status: 502,
			errno: 500,
			isServerError: true,
		});
	});

	it('keeps an unmapped status body out of the message when it has no errmsg', async () => {
		respond(
			{
				message: `lookup failed for zelophehad.quirinus@example.com key ${API_KEY}`,
			},
			504,
		);
		const error = await failure(
			invoke(email, { email: 'zelophehad.quirinus@example.com' }),
		);

		expect(error).toBeInstanceOf(ApiError);
		expect(error.status).toBe(504);
		const text = `${error.message} ${String(error.stack)} ${JSON.stringify(error)}`;
		expect(text).not.toContain('zelophehad');
		expect(text).not.toContain(API_KEY);
		expect(error.message).toContain('504');
	});

	it('marks a dropped connection as a transport failure', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));
		const error = await failure(invoke(name, { name: 'Alice' }));

		expect(error.transport).toBe(true);
		expect(error.status).toBeUndefined();
	});
});

describe('genderapi.lookup.name', () => {
	it('rejects an ip that is not an address, which Gender API would silently ignore', async () => {
		const error = await failure(
			invoke(name, { name: 'Anna', ip: 'not-an-ip' }),
		);

		expect(error.name).toBe('ZodError');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('accepts an IPv4 and an IPv6 address', async () => {
		respond(alice);
		await invoke(name, { name: 'Anna', ip: '178.27.177.23' });
		respond(alice);
		await invoke(name, { name: 'Anna', ip: '2001:db8::1' });

		expect(fetchMock).toHaveBeenCalledTimes(2);
	});

	it('returns the gender with its sample count and accuracy', async () => {
		respond(alice);
		const result = await invoke(name, { name: 'Alice' });

		expect(result).toMatchObject({
			gender: 'female',
			samples: 523,
			accuracy: 93,
		});
	});

	it('localizes by country, which changes the answer', async () => {
		respond(andreaItaly);
		const italy = (await invoke(name, {
			name: 'Andrea',
			country: 'IT',
		})) as typeof andreaItaly;
		expect(lastRequest().query.country).toBe('IT');
		expect(italy.gender).toBe('male');

		respond(andreaGermany);
		const germany = (await invoke(name, {
			name: 'Andrea',
			country: 'DE',
		})) as typeof andreaGermany;
		expect(germany.gender).toBe('female');
	});

	it('localizes by locale and by IP', async () => {
		respond(alice);
		await invoke(name, { name: 'John', locale: 'en_US' });
		expect(lastRequest().query.locale).toBe('en_US');

		respond(alice);
		await invoke(name, { name: 'John', ip: '54.201.16.177' });
		expect(lastRequest().query.ip).toBe('54.201.16.177');
	});

	it('returns an unknown gender rather than throwing', async () => {
		respond(unknownGender);
		const result = await invoke(name, { name: 'Xyzzyplugh' });

		expect(result).toMatchObject({ gender: 'unknown', samples: 0 });
	});

	it('rejects an empty name before making a request', async () => {
		const error = await failure(invoke(name, { name: '' }));

		expect(error.name).toBe('ZodError');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a country that is not two letters', async () => {
		const error = await failure(
			invoke(name, { name: 'Kim', country: 'Italy' }),
		);

		expect(error.name).toBe('ZodError');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('surfaces a missing name the server refused', async () => {
		respond(nameNotSet);
		const error = await failure(invoke(name, { name: 'Alice' }));

		expect(error.errno).toBe(20);
		expect(error.isValidationError).toBe(true);
	});

	it('logs the answer without the name', async () => {
		respond(alice);
		await invoke(name, { name: 'Alice' });

		const payload = mockLog.mock.calls.at(-1)?.[2];
		expect(payload).toMatchObject({ gender: 'female', samples: 523 });
		expect(JSON.stringify(payload)).not.toContain('Alice');
	});
});

describe('genderapi.lookup.multi', () => {
	it('rejects a name holding a semicolon, which Gender API would split into two rows', async () => {
		const error = await failure(invoke(multi, { names: ['Alice;Bob', 'Kim'] }));

		expect(error.name).toBe('ZodError');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('joins the names with semicolons and asks for multi', async () => {
		respond(multiFixture);
		await invoke(multi, { names: ['lisa', 'jess', 'thomas'] });

		const sent = lastRequest();
		expect(sent.query.name).toBe('lisa;jess;thomas');
		expect(sent.query.multi).toBe('true');
	});

	it('returns one result per name, in order', async () => {
		respond(multiFixture);
		const result = (await invoke(multi, {
			names: ['lisa', 'jess', 'thomas'],
		})) as typeof multiFixture;

		expect(result.result).toHaveLength(3);
		expect(result.result.map((row) => row.name)).toEqual([
			'lisa',
			'jess',
			'thomas',
		]);
	});

	it('joins one country per name in the same order', async () => {
		respond(multiFixture);
		await invoke(multi, { names: ['lisa', 'jess'], countries: ['IT', 'DE'] });

		expect(lastRequest().query.country).toBe('IT;DE');
	});

	it('accepts a single country for the whole batch', async () => {
		respond(multiFixture);
		await invoke(multi, { names: ['lisa', 'jess'], countries: ['DE'] });

		expect(lastRequest().query.country).toBe('DE');
	});

	it('rejects more than 100 names before making a request', async () => {
		const error = await failure(
			invoke(multi, { names: Array.from({ length: 101 }, (_, i) => `n${i}`) }),
		);

		expect(error.name).toBe('ZodError');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects an empty list before making a request', async () => {
		const error = await failure(invoke(multi, { names: [] }));

		expect(error.name).toBe('ZodError');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('surfaces too many names as a validation error', async () => {
		respond(tooManyNames);
		const error = await failure(invoke(multi, { names: ['a'] }));

		expect(error.errno).toBe(21);
		expect(error.isValidationError).toBe(true);
	});

	it('logs the counts, not the names', async () => {
		respond(multiFixture);
		await invoke(multi, { names: ['lisa', 'jess', 'thomas'] });

		const payload = mockLog.mock.calls.at(-1)?.[2];
		expect(payload).toMatchObject({ count: 3, unknown: 0, credits_used: 3 });
		expect(JSON.stringify(payload)).not.toContain('lisa');
	});
});

describe('genderapi.email.lookup', () => {
	it('returns the extracted names and the gender', async () => {
		respond(emailLookup);
		const result = (await invoke(email, {
			email: 'markus.johnson@gmail.com',
		})) as typeof emailLookup;

		expect(result).toMatchObject({
			first_name: 'Markus',
			last_name: 'Johnson',
			gender: 'male',
		});
	});

	it('sends the email as the query', async () => {
		respond(emailLookup);
		await invoke(email, { email: 'markus.johnson@gmail.com' });

		expect(lastRequest().query.email).toBe('markus.johnson@gmail.com');
	});

	it('logs the mail provider, never the address', async () => {
		respond(emailLookup);
		await invoke(email, { email: 'markus.johnson@gmail.com' });

		const payload = mockLog.mock.calls.at(-1)?.[2];
		expect(payload).toMatchObject({ mail_provider: 'gmail', gender: 'male' });
		expect(JSON.stringify(payload)).not.toContain('markus.johnson');
	});
});

describe('genderapi.fullName.split', () => {
	it('sends the full name as `split` and returns both parts', async () => {
		respond(splitName);
		const result = (await invoke(fullName, {
			split: 'theresa miller',
		})) as typeof splitName;

		expect(lastRequest().query.split).toBe('theresa miller');
		expect(result).toMatchObject({
			first_name: 'Theresa',
			last_name: 'Miller',
		});
	});

	it('returns a null last name when strict mode finds none', async () => {
		respond(splitNameStrict);
		const result = (await invoke(fullName, {
			split: 'Markus Stefan',
			strict: true,
		})) as typeof splitNameStrict;

		expect(result.last_name).toBeNull();
		expect(lastRequest().query.strict).toBe('true');
	});

	it('turns the empty last name strict mode really returns into null', async () => {
		respond(splitNameStrictLive);
		const result = (await invoke(fullName, {
			split: 'Markus Zzqxvarn',
			strict: true,
		})) as { last_name: string | null };

		expect(result.last_name).toBeNull();
	});

	it('logs strict mode without the name', async () => {
		respond(splitName);
		await invoke(fullName, { split: 'theresa miller', strict: true });

		const payload = mockLog.mock.calls.at(-1)?.[2];
		expect(payload).toMatchObject({ strict: true, gender: 'female' });
		expect(JSON.stringify(payload)).not.toContain('theresa');
	});
});

describe('genderapi.countryOfOrigin.get', () => {
	it('parses the snake_case entries the live route returns', async () => {
		respond(countryOfOriginLive);
		const result = (await invoke(countryOfOrigin, {
			name: 'Markus',
		})) as typeof countryOfOriginLive;

		expect(result.country_of_origin[0]).toEqual({
			country_name: 'Germany',
			country: 'DE',
			probability: 0.32,
			continental_region: 'Europe',
			statistical_region: 'Western Europe',
		});
	});

	it('returns the ranked countries', async () => {
		respond(countryOfOriginFixture);
		const result = (await invoke(countryOfOrigin, {
			name: 'Markus',
		})) as typeof countryOfOriginFixture;

		expect(result.country_of_origin).toHaveLength(3);
		expect(result.country_of_origin[0]?.country).toBe('FI');
	});

	it('keeps the catch-all entry, which uses the code `--`', async () => {
		respond(countryOfOriginFixture);
		const result = (await invoke(countryOfOrigin, {
			name: 'Markus',
		})) as typeof countryOfOriginFixture;

		expect(result.country_of_origin[2]?.country).toBe('--');
	});

	it('logs the top country and the count', async () => {
		respond(countryOfOriginFixture);
		await invoke(countryOfOrigin, { name: 'Markus' });

		expect(mockLog.mock.calls.at(-1)?.[2]).toMatchObject({
			top_country: 'FI',
			countries: 3,
		});
	});

	it('requires a name', async () => {
		const error = await failure(invoke(countryOfOrigin, { name: '' }));

		expect(error.name).toBe('ZodError');
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('genderapi.account.stats', () => {
	it('does not hand the account key back to the caller', async () => {
		respond(statsFixture);
		// unknown: invoke returns every endpoint's shape; this test only checks
		// that no `key` field comes back.
		const result = (await invoke(stats, {})) as Record<string, unknown>;

		expect(result).not.toHaveProperty('key');
		expect(JSON.stringify(result)).not.toContain(statsFixture.key);
	});

	it('reads the remaining count from the documented route', async () => {
		respond(statsFixture);
		await invoke(stats, {});

		expect(lastRequest().path).toBe('/get-stats');
	});

	it('returns the remaining requests and the limit flag', async () => {
		respond(statsFixture);
		const result = (await invoke(stats, {})) as typeof statsFixture;

		expect(result).toMatchObject({
			remaining_requests: 43566,
			is_limit_reached: false,
		});
	});

	it('takes no input', async () => {
		respond(statsFixture);
		await invoke(stats, undefined);

		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it('logs the remaining count', async () => {
		respond(statsFixture);
		await invoke(stats, {});

		expect(mockLog.mock.calls.at(-1)?.[2]).toMatchObject({
			remaining_requests: 43566,
		});
	});
});

describe('genderapi failures that the body reports', () => {
	it('does not retry an internal errno 500 as if it were a status', async () => {
		respond(internalError);
		const error = await failure(invoke(name, { name: 'Alice' }));

		expect(error.isServerError).toBe(true);
		expect(error.status).toBeUndefined();
	});
});

describe('genderapi event names', () => {
	// The event name must be the path a caller writes, so telemetry and the
	// catalog cannot drift apart. A flat name here was invisible to every
	// other test because none of them asserted this argument.
	it.each([
		['genderapi.lookup.name', name, { name: 'Alice' }, alice] as const,
		[
			'genderapi.lookup.multi',
			multi,
			{ names: ['lisa'] },
			multiFixture,
		] as const,
		[
			'genderapi.email.lookup',
			email,
			{ email: 'a@b.com' },
			emailLookup,
		] as const,
		[
			'genderapi.fullName.split',
			fullName,
			{ split: 'a b' },
			splitName,
		] as const,
		[
			'genderapi.countryOfOrigin.get',
			countryOfOrigin,
			{ name: 'Alice' },
			countryOfOriginFixture,
		] as const,
		['genderapi.account.stats', stats, {}, statsFixture] as const,
	])('emits %s', async (expected, endpoint, args, fixture) => {
		respond(fixture);
		await invoke(endpoint as never, args as never);
		expect(mockLog.mock.calls.at(-1)?.[1]).toBe(expected);
	});
});
