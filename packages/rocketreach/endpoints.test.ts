import { logEventFromContext } from 'corsair/core';
import { Account, Company, Email, Person } from './endpoints';
import {
	ACCOUNT,
	COMPANY,
	COMPANY_SEARCH,
	COMPLETE_PROFILE,
	EMAIL_CATCHALL,
	EMAIL_MALFORMED,
	EMAIL_UNKNOWN,
	EMAIL_VERIFIED,
	MALFORMED,
	NO_LOOKUP_CREDITS,
	NO_VERIFICATION_CREDITS,
	PERSON_SEARCH,
	PROGRESS_PROFILE,
	UNIVERSAL_ACCOUNT,
} from './test-fixtures';
import { invoke, lastRequest, respond, respondEmpty } from './test-support';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);

let fetchMock: jest.SpyInstance;

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('account.get', () => {
	it('reads the account with its credit usage and rate limits', async () => {
		respond(fetchMock, ACCOUNT);

		const result = (await invoke(Account.get, {})) as {
			state?: string;
			credit_usage?: { credit_type?: string; remaining?: number }[];
			rate_limits?: { action?: string }[];
		};

		expect(lastRequest(fetchMock).path).toBe('/api/v2/account/');
		expect(result.state).toBe('registered');
		expect(result.credit_usage?.[0]?.credit_type).toBe('person_lookup');
		expect(result.credit_usage?.[0]?.remaining).toBe(958);
		expect(result.rate_limits?.[0]?.action).toBe('person_lookup');
	});

	it('logs the state and the number of pools', async () => {
		respond(fetchMock, ACCOUNT);

		await invoke(Account.get, {});

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'rocketreach.account.get',
			{ state: 'registered', credits: 2, limits: 1 },
			'completed',
		);
	});
});

describe('account.universal', () => {
	it('reads the universal-credits account', async () => {
		respond(fetchMock, UNIVERSAL_ACCOUNT);

		const result = (await invoke(Account.universal, {})) as {
			plan?: { name?: string };
			daily_api_limit?: string;
		};

		expect(lastRequest(fetchMock).path).toBe('/api/v2/universal/account/');
		expect(result.plan?.name).toBe('Pro');
		// RocketReach sends the daily limit as a numeric string.
		expect(result.daily_api_limit).toBe('10000');
	});

	it('strips the api_key RocketReach echoes back', async () => {
		respond(fetchMock, UNIVERSAL_ACCOUNT);

		const result = (await invoke(Account.universal, {})) as {
			api_key?: string;
		};

		// A credential must not be copied into a caller's records or logs.
		expect(result.api_key).toBeUndefined();
		expect(JSON.stringify(result)).not.toContain(
			'live-secret-key-that-must-not-leak',
		);
	});

	it('logs the plan and the day’s usage, never the key', async () => {
		respond(fetchMock, UNIVERSAL_ACCOUNT);

		await invoke(Account.universal, {});

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'rocketreach.account.universal',
			{ plan: 'Pro', callsToday: 42, dailyLimit: '10000' },
			'completed',
		);
		expect(JSON.stringify(mockLog.mock.calls)).not.toContain(
			'live-secret-key-that-must-not-leak',
		);
	});
});

describe('person.lookup', () => {
	it('looks a person up by email', async () => {
		respond(fetchMock, COMPLETE_PROFILE);

		const result = (await invoke(Person.lookup, {
			email: 'john.doe@google.com',
		})) as {
			status?: string;
			name?: string;
			current_employer?: string;
		};

		const request = lastRequest(fetchMock);
		expect(request.path).toBe('/api/v2/person/lookup');
		expect(request.query.email).toBe('john.doe@google.com');
		expect(result.status).toBe('complete');
		expect(result.name).toBe('John Doe');
		expect(result.current_employer).toBe('Google');
	});

	it('carries the recommended and current emails', async () => {
		respond(fetchMock, COMPLETE_PROFILE);

		const result = (await invoke(Person.lookup, { email: 'a@b.com' })) as {
			recommended_email?: string;
			current_work_email?: string;
			emails?: { email?: string; grade?: string }[];
		};

		expect(result.recommended_email).toBe('johndoe@google.com');
		expect(result.current_work_email).toBe('johndoe@google.com');
		expect(result.emails?.[0]?.grade).toBe('A');
	});

	it('keeps the job history and education', async () => {
		respond(fetchMock, COMPLETE_PROFILE);

		const result = (await invoke(Person.lookup, { email: 'a@b.com' })) as {
			job_history?: { company?: string; is_current?: boolean }[];
			education?: { school?: string }[];
		};

		expect(result.job_history?.[0]?.company).toBe('Google');
		expect(result.job_history?.[0]?.is_current).toBe(true);
		expect(result.education?.[0]?.school).toBe('Stanford University');
	});

	it('reports a lookup that is still running', async () => {
		respond(fetchMock, PROGRESS_PROFILE);

		const result = (await invoke(Person.lookup, { email: 'a@b.com' })) as {
			status?: string;
			recommended_email?: string | null;
		};

		// Anything but complete means the contact fields are not final.
		expect(result.status).toBe('progress');
		expect(result.recommended_email).toBeNull();
	});

	it('passes the lookup identifiers through', async () => {
		respond(fetchMock, COMPLETE_PROFILE);

		await invoke(Person.lookup, {
			linkedin_url: 'www.linkedin.com/in/jamesgullbrand',
			title: 'Product Manager',
			lookup_type: 'premium',
			return_cached_emails: false,
		});

		expect(lastRequest(fetchMock).query).toMatchObject({
			linkedin_url: 'www.linkedin.com/in/jamesgullbrand',
			title: 'Product Manager',
			lookup_type: 'premium',
			return_cached_emails: 'false',
		});
	});

	it('accepts a numeric ID and sends it as a string', async () => {
		respond(fetchMock, COMPLETE_PROFILE);

		await invoke(Person.lookup, { id: 123456 });

		expect(lastRequest(fetchMock).query.id).toBe('123456');
	});

	it('rejects a lookup_type RocketReach does not document', async () => {
		await expect(
			invoke(Person.lookup, { email: 'a@b.com', lookup_type: 'gold' }),
		).rejects.toThrow();
	});

	it('rejects an empty lookup', async () => {
		await expect(invoke(Person.lookup, {})).rejects.toThrow();
	});

	it('logs the profile ID and status, never the email', async () => {
		respond(fetchMock, COMPLETE_PROFILE);

		await invoke(Person.lookup, { email: 'john.doe@google.com' });

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'rocketreach.person.lookup',
			{ profileId: 5244, status: 'complete', emails: 1, phones: 1 },
			'completed',
		);
		expect(JSON.stringify(mockLog.mock.calls)).not.toContain(
			'john.doe@google.com',
		);
	});
});

describe('person.bulkLookup', () => {
	it('returns the RR-Request-ID header, since the body is empty', async () => {
		respondEmpty(fetchMock, 200, {
			'RR-Request-ID': '3f2504e0-4f89-11d3-9a0c-0305e82c3301',
		});

		const result = (await invoke(Person.bulkLookup, {
			queries: [{ email: 'a@b.com' }, { linkedin_url: 'linkedin.com/in/x' }],
		})) as { requestId?: string | null };

		const request = lastRequest(fetchMock);
		expect(request.path).toBe('/api/v2/bulkLookup');
		expect(request.method).toBe('POST');
		expect(result.requestId).toBe('3f2504e0-4f89-11d3-9a0c-0305e82c3301');
	});

	it('sends the profile list name and webhook id when set', async () => {
		respondEmpty(fetchMock);

		await invoke(Person.bulkLookup, {
			queries: [{ email: 'a@b.com' }],
			profile_list: 'Q1 prospects',
			webhook_id: 12345,
		});

		expect(lastRequest(fetchMock).bodyRecord).toMatchObject({
			profile_list: 'Q1 prospects',
			webhook_id: 12345,
		});
	});

	it('returns a null requestId when RocketReach sends no header', async () => {
		respondEmpty(fetchMock);

		const result = (await invoke(Person.bulkLookup, {
			queries: [{ email: 'a@b.com' }],
		})) as { requestId?: string | null };

		expect(result.requestId).toBeNull();
	});

	it('rejects an empty batch', async () => {
		await expect(invoke(Person.bulkLookup, { queries: [] })).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects more than the documented 100 people', async () => {
		const queries = Array.from({ length: 101 }, (_, index) => ({
			email: `person${index}@example.com`,
		}));

		await expect(invoke(Person.bulkLookup, { queries })).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('logs the batch size and whether a request ID came back', async () => {
		respondEmpty(fetchMock, 200, { 'RR-Request-ID': 'abc' });

		await invoke(Person.bulkLookup, {
			queries: [{ email: 'a@b.com' }, { email: 'c@d.com' }],
		});

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'rocketreach.person.bulkLookup',
			{ requested: 2, hasRequestId: true },
			'completed',
		);
	});
});

describe('person.checkStatus', () => {
	it('checks by profile IDs', async () => {
		respond(fetchMock, [COMPLETE_PROFILE, PROGRESS_PROFILE]);

		const result = (await invoke(Person.checkStatus, {
			ids: [5244, 5245],
		})) as { id?: number; status?: string }[];

		const request = lastRequest(fetchMock);
		expect(request.path).toBe('/api/v2/person/checkStatus');
		expect(request.query.ids).toBe('5244,5245');
		expect(result).toHaveLength(2);
	});

	it('checks by RR-Request-ID', async () => {
		respond(fetchMock, [COMPLETE_PROFILE]);

		await invoke(Person.checkStatus, {
			rr_request_id: '3f2504e0-4f89-11d3-9a0c-0305e82c3301',
		});

		expect(lastRequest(fetchMock).query.rr_request_id).toBe(
			'3f2504e0-4f89-11d3-9a0c-0305e82c3301',
		);
	});

	it('logs how many are complete', async () => {
		respond(fetchMock, [COMPLETE_PROFILE, PROGRESS_PROFILE]);

		await invoke(Person.checkStatus, { ids: [5244, 5245] });

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'rocketreach.person.checkStatus',
			{ profiles: 2, complete: 1 },
			'completed',
		);
	});

	it('rejects a call with neither identifier', async () => {
		await expect(invoke(Person.checkStatus, {})).rejects.toThrow();
	});
});

describe('person.search', () => {
	it('posts the query and returns summaries', async () => {
		respond(fetchMock, PERSON_SEARCH, 201);

		const result = (await invoke(Person.search, {
			query: { current_title: ['CTO'], company_domain: ['stripe.com'] },
			page_size: 20,
			order_by: 'relevance',
		})) as { id?: number; name?: string; current_title?: string }[];

		const request = lastRequest(fetchMock);
		expect(request.path).toBe('/api/v2/person/search');
		expect(request.method).toBe('POST');
		expect(request.bodyRecord).toMatchObject({
			query: { current_title: ['CTO'], company_domain: ['stripe.com'] },
			page_size: 20,
			order_by: 'relevance',
		});
		expect(result).toHaveLength(2);
		expect(result[0]?.current_title).toBe('Software Engineer');
	});

	it('keeps the teaser and the suppressed flag', async () => {
		respond(fetchMock, PERSON_SEARCH, 201);

		const result = (await invoke(Person.search, {
			query: { current_title: ['CTO'] },
		})) as { teaser?: unknown; suppressed?: string }[];

		expect(result[0]?.teaser).toBeDefined();
		// suppressed is a string, as RocketReach sends it.
		expect(result[0]?.suppressed).toBeUndefined();
	});

	it('rejects a page size over the documented 100', async () => {
		await expect(
			invoke(Person.search, { query: { name: ['x'] }, page_size: 101 }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects an order_by RocketReach does not document', async () => {
		await expect(
			invoke(Person.search, { query: { name: ['x'] }, order_by: 'newest' }),
		).rejects.toThrow();
	});

	it('logs the result count', async () => {
		respond(fetchMock, PERSON_SEARCH, 201);

		await invoke(Person.search, { query: { name: ['John'] } });

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'rocketreach.person.search',
			{ results: 2 },
			'completed',
		);
	});
});

describe('company.lookup', () => {
	it('looks a company up by domain', async () => {
		respond(fetchMock, COMPANY);

		const result = (await invoke(Company.lookup, {
			domain: 'google.com',
		})) as {
			name?: string;
			num_employees?: number;
			techstack?: string[];
		};

		const request = lastRequest(fetchMock);
		expect(request.path).toBe('/api/v2/company/lookup/');
		expect(request.query.domain).toBe('google.com');
		expect(result.name).toBe('Google');
		expect(result.techstack).toContain('Go');
	});

	it('keeps the address and the industry codes', async () => {
		respond(fetchMock, COMPANY);

		const result = (await invoke(Company.lookup, { domain: 'google.com' })) as {
			address?: { city?: string };
			sic_codes?: string[];
			naics_codes?: string[];
		};

		expect(result.address?.city).toBe('Mountain View');
		expect(result.sic_codes).toEqual(['7370']);
		expect(result.naics_codes).toEqual(['519130']);
	});

	it('accepts a ticker', async () => {
		respond(fetchMock, COMPANY);

		await invoke(Company.lookup, { ticker: 'GOOGL' });

		expect(lastRequest(fetchMock).query.ticker).toBe('GOOGL');
	});

	it('rejects a lookup with no identifier', async () => {
		await expect(invoke(Company.lookup, {})).rejects.toThrow();
	});
});

describe('company.search', () => {
	it('posts the company query', async () => {
		respond(fetchMock, COMPANY_SEARCH, 201);

		const result = (await invoke(Company.search, {
			query: { industry: ['Internet'], employees: ['1001-5000'] },
		})) as { name?: string; logo_url?: string }[];

		const request = lastRequest(fetchMock);
		expect(request.path).toBe('/api/v2/searchCompany');
		expect(request.bodyRecord).toMatchObject({
			query: { industry: ['Internet'], employees: ['1001-5000'] },
		});
		expect(result[0]?.name).toBe('Google');
		expect(result[0]?.logo_url).toContain('google.com');
	});
});

describe('email.verify', () => {
	it('posts the address and reads a valid result', async () => {
		respond(fetchMock, EMAIL_VERIFIED);

		const result = (await invoke(Email.verify, {
			email: 'johndoe@google.com',
		})) as {
			status?: string;
			credits_charged?: number;
			checks?: { catchall?: boolean };
		};

		const request = lastRequest(fetchMock);
		expect(request.path).toBe('/api/v2/email/verify/');
		expect(request.method).toBe('POST');
		expect(request.bodyRecord).toEqual({ email: 'johndoe@google.com' });
		expect(result.status).toBe('valid');
		expect(result.credits_charged).toBe(1);
	});

	it('keeps a catchall answer distinct from valid', async () => {
		respond(fetchMock, EMAIL_CATCHALL);

		const result = (await invoke(Email.verify, {
			email: 'someone@example.com',
		})) as { status?: string; checks?: { catchall?: boolean } };

		// status and checks.catchall answer different questions.
		expect(result.status).toBe('catchall');
		expect(result.checks?.catchall).toBe(true);
	});

	it('reports a refunded unknown result', async () => {
		respond(fetchMock, EMAIL_UNKNOWN);

		const result = (await invoke(Email.verify, {
			email: 'nobody@nowhere.invalid',
		})) as { status?: string; credits_charged?: number };

		expect(result.status).toBe('unknown');
		// The credit is refunded, so nothing was charged.
		expect(result.credits_charged).toBe(0);
	});

	it('reports a malformed address as invalid with no charge', async () => {
		respond(fetchMock, EMAIL_MALFORMED);

		const result = (await invoke(Email.verify, {
			email: 'not-an-address',
		})) as {
			status?: string;
			credits_charged?: number;
			checks?: { format_valid?: boolean };
		};

		expect(result.status).toBe('invalid');
		expect(result.checks?.format_valid).toBe(false);
		expect(result.credits_charged).toBe(0);
	});

	it('rejects a missing address before calling the API', async () => {
		await expect(invoke(Email.verify, {})).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('logs the status and the credits charged', async () => {
		respond(fetchMock, EMAIL_VERIFIED);

		await invoke(Email.verify, { email: 'johndoe@google.com' });

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'rocketreach.email.verify',
			{ status: 'valid', credits: 1 },
			'completed',
		);
	});
});

describe('error propagation', () => {
	it('surfaces a 400 with its error_code', async () => {
		respond(fetchMock, MALFORMED, 400);

		await expect(invoke(Email.verify, { email: 'x' })).rejects.toThrow(
			'Enter a valid email address',
		);
	});

	it('reports a spent lookup balance from a 403', async () => {
		respond(fetchMock, NO_LOOKUP_CREDITS, 403);

		// unknown: the rejection is narrowed by the assertions below.
		const error = (await invoke(Person.lookup, { email: 'a@b.com' }).catch(
			(e: unknown) => e,
		)) as { status?: number; message?: string };

		expect(error.status).toBe(403);
		expect(error.message).toContain('run out of lookup credits');
	});

	it('reports the verification pool from a 402', async () => {
		respond(fetchMock, NO_VERIFICATION_CREDITS, 402);

		const error = (await invoke(Email.verify, { email: 'a@b.com' }).catch(
			(e: unknown) => e,
		)) as { status?: number; creditType?: string };

		expect(error.status).toBe(402);
		expect(error.creditType).toBe('email_verification');
	});
});
