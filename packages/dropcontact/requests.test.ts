import { logEventFromContext } from 'corsair/core';
import { DropcontactAPIError } from './client';
import {
	credits,
	enrich,
	getWebhook,
	removeWebhook,
	results,
	setWebhook,
} from './endpoints';
import {
	creditsResponse,
	enrichAccepted,
	enrichWithHashedInputs,
	enrichWithRecordWarnings,
	resultsForcedInProgress,
	resultsNotReady,
	resultsOnlyContactData,
	resultsOnlyOrganizationData,
	resultsReady,
	tooManyRecords,
	webhookConfigured,
	webhookDeleted,
	webhookNotConfigured,
	webhookNothingToDelete,
	webhookSetResponse,
} from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const API_KEY = 'dc-test-key';

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant. Each endpoint returns its own output type, so
// the shared return is unknown.
// unknown: each endpoint returns its own output type, so the shared return is unknown.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>;

// Safe: the fake context carries only what the endpoints read (ctx.key).
function invoke(endpoint: AnyEndpoint, input: unknown) {
	// unknown: negative cases pass values no schema accepts.
	return endpoint({ key: API_KEY, db: undefined } as never, input as never);
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
		headers: new Headers(init.headers),
		// unknown: the request body is whatever the endpoint serialized.
		body: init.body ? (JSON.parse(String(init.body)) as unknown) : undefined,
	};
}

function expectAuthenticated(path: string, method: string) {
	const sent = lastRequest();
	expect(sent.origin).toBe('https://api.dropcontact.com');
	expect(sent.path).toBe(path);
	expect(sent.method).toBe(method);
	expect(sent.headers.get('x-access-token')).toBe(API_KEY);
	expect(sent.headers.get('authorization')).toBeNull();
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('enrichment.enrich', () => {
	it('POSTs the batch and returns the request_id', async () => {
		respond(enrichAccepted);

		const result = (await invoke(enrich, {
			data: [
				{
					first_name: 'Denis',
					last_name: 'Cohen',
					company: 'Dropcontact',
					website: 'dropcontact.com',
				},
			],
		})) as { request_id: string; creditsLeft?: number | null };

		expectAuthenticated('/v1/enrich/all', 'POST');
		// The id comes back, not results.
		expect(result.request_id).toBe('qzmxkpvlrtdnhwa');
		expect(result.creditsLeft).toBe(15276);
	});

	it('sends the documented body fields with their provider names', async () => {
		respond(enrichAccepted);

		await invoke(enrich, {
			data: [{ email: 'dc@dropcontact.io' }],
			siren: true,
			language: 'en',
			custom_callback_url: 'https://example.com/cb',
		});

		expect(lastRequest().body).toEqual({
			data: [{ email: 'dc@dropcontact.io' }],
			siren: true,
			language: 'en',
			custom_callback_url: 'https://example.com/cb',
		});
	});

	it('sends hashed_inputs as the hashedInputs query parameter', async () => {
		// The spec reads this one option from the query string, not the body.
		respond(enrichWithHashedInputs);

		const result = (await invoke(enrich, {
			data: [{ email: 'dc@dropcontact.io' }],
			hashed_inputs: true,
		})) as { hashed_inputs?: string[] | null };

		expect(lastRequest().query).toEqual({ hashedInputs: 'true' });
		expect(lastRequest().body).not.toHaveProperty('hashed_inputs');
		expect(result.hashed_inputs).toEqual(['a3f5c1e0b7d24f19a6c8e2d5b9f04173']);
	});

	it('keeps the per-record notes from the data array', async () => {
		respond(enrichWithRecordWarnings);

		const result = (await invoke(enrich, {
			data: [{ company: 'Dropcontact', job: '' }],
		})) as {
			records?: {
				index: number;
				errors?: { unexpected_field?: string[] | null } | null;
				warnings?: { empty_field?: string[] | null } | null;
			}[];
		};

		// A warning or an error on a record does not mean the submission failed.
		expect(result.records).toHaveLength(1);
		expect(result.records?.[0]?.errors?.unexpected_field).toEqual(['jobb']);
		expect(result.records?.[0]?.warnings?.empty_field).toEqual(['job']);
	});

	it('rejects more than 250 records before sending anything', async () => {
		const data = Array.from({ length: 251 }, () => ({ email: 'a@b.co' }));
		await expect(invoke(enrich, { data })).rejects.toThrow(/250/);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('accepts exactly 250 records', async () => {
		const data = Array.from({ length: 250 }, () => ({ email: 'a@b.co' }));
		respond(enrichAccepted);

		await invoke(enrich, { data });

		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it('rejects an empty batch', async () => {
		await expect(invoke(enrich, { data: [] })).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a record with no company, email or LinkedIn URL', async () => {
		// The docs: a record needs one of those, or Dropcontact answers with
		// only_contact_data and no email is found.
		await expect(
			invoke(enrich, { data: [{ first_name: 'Denis', last_name: 'Cohen' }] }),
		).rejects.toThrow(/needs one of/);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('accepts a record whose only identifier is a LinkedIn URL', async () => {
		respond(enrichAccepted);

		await invoke(enrich, {
			data: [{ linkedin: 'www.linkedin.com/in/cohendenis' }],
		});

		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it('accepts a record whose only identifier is the email', async () => {
		respond(enrichAccepted);

		await invoke(enrich, { data: [{ email: 'dc@dropcontact.io' }] });

		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it('lets an undocumented key through instead of rejecting it', async () => {
		// The provider ignores unknown keys and reports them per record, so the
		// schema keeps them rather than failing before the call.
		respond(enrichWithRecordWarnings);

		await invoke(enrich, {
			data: [{ company: 'Dropcontact', jobb: 'typo' }],
		});

		expect(lastRequest().body).toMatchObject({
			data: [{ company: 'Dropcontact', jobb: 'typo' }],
		});
	});

	it('rejects a custom_callback_url that is not a URL', async () => {
		await expect(
			invoke(enrich, {
				data: [{ email: 'a@b.co' }],
				custom_callback_url: 'not-a-url',
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a callback URL longer than 2083 characters', async () => {
		await expect(
			invoke(enrich, {
				data: [{ email: 'a@b.co' }],
				custom_callback_url: `https://example.com/${'a'.repeat(2100)}`,
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('throws when the provider answers 200 with success false', async () => {
		// On the submission itself that is a real failure, unlike a not-ready
		// result, so it must not look like a queued batch.
		respond(tooManyRecords);

		await expect(
			invoke(enrich, { data: [{ email: 'a@b.co' }] }),
		).rejects.toBeInstanceOf(DropcontactAPIError);
		expect(mockLog).not.toHaveBeenCalled();
	});
});

describe('enrichment.results', () => {
	it('returns the enriched records', async () => {
		respond(resultsReady);

		const result = (await invoke(results, {
			request_id: 'qzmxkpvlrtdnhwa',
		})) as {
			records: {
				email?: { email: string; qualification: string }[] | null;
				siren?: string | null;
			}[];
			status: string;
			success: boolean;
		};

		expectAuthenticated('/v1/enrich/all/qzmxkpvlrtdnhwa', 'GET');
		expect(result.records[0]?.email?.[0]).toEqual({
			email: 'dc@dropcontact.io',
			qualification: 'nominative@pro',
		});
		// The input num_siren comes back as siren.
		expect(result.records[0]?.siren).toBe('823752647');
		expect(result.status).toBe('ready');
		expect(result.success).toBe(true);
	});

	it('percent-encodes the request_id in the path', async () => {
		respond(resultsReady);

		await invoke(results, { request_id: 'a b/c' });

		expect(lastRequest().path).toBe('/v1/enrich/all/a%20b%2Fc');
	});

	it('returns a not-ready batch instead of throwing', async () => {
		// HTTP 200 with success false is the normal answer while the batch runs,
		// so it is a state the caller polls on, not an error.
		respond(resultsNotReady);

		const result = (await invoke(results, {
			request_id: 'qzmxkpvlrtdnhwa',
		})) as {
			success: boolean;
			reason?: string | null;
			status: string;
			records: unknown[];
		}; // unknown: not-ready bodies carry no typed records.

		expect(result.success).toBe(false);
		expect(result.reason).toContain('not ready');
		// Derived, because the provider only sets it under force_results.
		expect(result.status).toBe('in_progress');
		expect(result.records).toEqual([]);
	});

	it('sends force_results as forceResults', async () => {
		respond(resultsForcedInProgress);

		const result = (await invoke(results, {
			request_id: 'qzmxkpvlrtdnhwa',
			force_results: true,
		})) as { status: string; records: { status?: string | null }[] };

		expect(lastRequest().query).toEqual({ forceResults: 'true' });
		// The provider's own status wins when it sends one.
		expect(result.status).toBe('in_progress');
		expect(result.records[0]?.status).toBe('in_progress');
	});

	it('reports ready once the forced batch has finished', async () => {
		respond(resultsReady);

		const result = (await invoke(results, {
			request_id: 'qzmxkpvlrtdnhwa',
			force_results: true,
		})) as { status: string };

		expect(result.status).toBe('ready');
	});

	it('keeps the per-record errors a successful request can carry', async () => {
		respond(resultsOnlyContactData);

		const result = (await invoke(results, {
			request_id: 'qzmxkpvlrtdnhwa',
		})) as {
			records: { errors?: { only_contact_data?: boolean | null } | null }[];
		};

		expect(result.records[0]?.errors?.only_contact_data).toBe(true);
	});

	it('keeps the per-record warnings', async () => {
		respond(resultsOnlyOrganizationData);

		const result = (await invoke(results, {
			request_id: 'qzmxkpvlrtdnhwa',
		})) as {
			records: {
				warnings?: { only_organization_data?: boolean | null } | null;
			}[];
		};

		expect(result.records[0]?.warnings?.only_organization_data).toBe(true);
	});

	it('requires a request_id', async () => {
		await expect(invoke(results, {})).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('account.credits', () => {
	it('reads the balance and sends no query', async () => {
		respond(creditsResponse);

		const result = (await invoke(credits, {})) as { credits: number };

		expectAuthenticated('/v1/account/credits', 'GET');
		expect(result.credits).toBe(15277);
		expect(lastRequest().query).toEqual({});
	});
});

describe('webhook.get', () => {
	it('returns the configured callback URL', async () => {
		respond(webhookConfigured);

		const result = (await invoke(getWebhook, {})) as {
			callback_url?: string | null;
		};

		expectAuthenticated('/v1/enrich/webhook', 'GET');
		expect(result.callback_url).toBe('https://example.com/dropcontact/results');
	});

	it('returns null when none is configured', async () => {
		respond(webhookNotConfigured);

		const result = (await invoke(getWebhook, {})) as {
			callback_url?: string | null;
		};

		expect(result.callback_url).toBeNull();
	});
});

describe('webhook.set', () => {
	it('PUTs the callback_url', async () => {
		respond(webhookSetResponse);

		const result = (await invoke(setWebhook, {
			callback_url: 'https://example.com/dropcontact/results',
		})) as { callback_url: string };

		expectAuthenticated('/v1/enrich/webhook', 'PUT');
		expect(lastRequest().body).toEqual({
			callback_url: 'https://example.com/dropcontact/results',
		});
		expect(result.callback_url).toBe('https://example.com/dropcontact/results');
	});

	it('rejects a value that is not a URL', async () => {
		await expect(
			invoke(setWebhook, { callback_url: 'not-a-url' }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('webhook.remove', () => {
	it('DELETEs and returns the detail message', async () => {
		respond(webhookDeleted);

		const result = (await invoke(removeWebhook, {})) as { detail: string };

		expectAuthenticated('/v1/enrich/webhook', 'DELETE');
		expect(result.detail).toBe('Webhook callback URL deleted');
	});

	it('surfaces nothing-to-delete as a DropcontactAPIError', async () => {
		respond(webhookNothingToDelete, 404);

		const error = (await invoke(removeWebhook, {}).catch(
			// unknown: a rejection can be any value until the instanceof narrows it.
			(caught: unknown) => caught,
		)) as DropcontactAPIError;

		expect(error).toBeInstanceOf(DropcontactAPIError);
		expect(error.status).toBe(404);
		expect(error.reason).toBe('No webhook callback found');
	});
});

describe('logging', () => {
	it('logs the operation with the request id and no contact data', async () => {
		respond(enrichAccepted);

		await invoke(enrich, {
			data: [{ email: 'someone@example.com' }],
		});

		const [, event, fields] = mockLog.mock.calls.at(-1) ?? [];
		expect(event).toBe('dropcontact.enrichment.enrich');
		// Personal data must not reach the event log.
		expect(JSON.stringify(fields)).not.toContain('example.com');
		expect(fields).toMatchObject({ requestId: 'qzmxkpvlrtdnhwa' });
	});
});
