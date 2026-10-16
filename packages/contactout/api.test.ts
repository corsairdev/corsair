import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { ContactOutAPIError } from './client';
import { Account, Company, Email, Linkedin, People } from './endpoints';
import { errorHandlers } from './error-handlers';
import { contactout } from './index';
import { samples } from './test-samples';

jest.mock('corsair/core', () => ({
	logEventFromContext: jest.fn().mockResolvedValue(undefined),
	AuthMissingError: class AuthMissingError extends Error {},
}));

// unknown: tests call endpoints with a stub context, not the full plugin context.
type AnyEndpoint = (ctx: unknown, input: unknown) => Promise<unknown>;

const fetchMock = jest.fn<Promise<Response>, [string, RequestInit]>();

function respond(
	status: number,
	body: object,
	headers: Record<string, string> = {},
) {
	fetchMock.mockImplementation(
		async () =>
			new Response(JSON.stringify(body), {
				status,
				headers: { 'Content-Type': 'application/json', ...headers },
			}),
	);
}

function createContext(
	options: { personalKey?: string } = {},
	storedPersonalKey: string | null = null,
	key = 'work-key',
) {
	return {
		key,
		options,
		keys: {
			get_personal_api_key: jest.fn().mockResolvedValue(storedPersonalKey),
		},
		db: {
			profiles: {
				findByEntityId: jest.fn().mockResolvedValue(null),
				upsertByEntityId: jest.fn().mockResolvedValue(undefined),
			},
			companies: {
				findByEntityId: jest.fn().mockResolvedValue(null),
				upsertByEntityId: jest.fn().mockResolvedValue(undefined),
			},
		},
	};
}

function lastCall() {
	const [url, init] = fetchMock.mock.calls[fetchMock.mock.calls.length - 1]!;
	return {
		url: new URL(url),
		method: init.method,
		headers: new Headers(init.headers),
		body: init.body ? JSON.parse(String(init.body)) : undefined,
	};
}

const linkedin = 'https://www.linkedin.com/in/example-person';

const cases: [string, AnyEndpoint, object, 'GET' | 'POST', string, string][] = [
	[
		'linkedin.enrich',
		Linkedin.enrich as AnyEndpoint,
		{ profile: linkedin },
		'GET',
		'/v1/linkedin/enrich',
		'linkedin_enrich',
	],
	[
		'linkedin.contactInfo',
		Linkedin.contactInfo as AnyEndpoint,
		{ profile: linkedin, include_phone: true },
		'GET',
		'/v1/people/linkedin',
		'contact_info',
	],
	[
		'linkedin.phoneStatus',
		Linkedin.phoneStatus as AnyEndpoint,
		{ profile: linkedin },
		'GET',
		'/v1/people/linkedin/phone_status',
		'phone_status',
	],
	[
		'email.enrich',
		Email.enrich as AnyEndpoint,
		{ email: 'jane@example.com', include: 'work_email' },
		'GET',
		'/v1/email/enrich',
		'email_enrich',
	],
	[
		'email.toLinkedin',
		Email.toLinkedin as AnyEndpoint,
		{ email: 'jane@example.com' },
		'GET',
		'/v1/people/person',
		'person',
	],
	[
		'people.enrich',
		People.enrich as AnyEndpoint,
		{ linkedin_url: linkedin, include: ['work_email'] },
		'POST',
		'/v1/people/enrich',
		'people_enrich',
	],
	[
		'people.search',
		People.search as AnyEndpoint,
		{ company: ['Stripe'], job_title: ['CEO'], page: 2, page_size: 1 },
		'POST',
		'/v1/people/search',
		'people_search',
	],
	[
		'people.count',
		People.count as AnyEndpoint,
		{ company: ['Stripe'] },
		'POST',
		'/v1/people/count',
		'people_count',
	],
	[
		'people.decisionMakers',
		People.decisionMakers as AnyEndpoint,
		{ domain: 'stripe.com', reveal_info: true },
		'GET',
		'/v1/people/decision-makers',
		'decision_makers',
	],
	[
		'company.search',
		Company.search as AnyEndpoint,
		{ name: ['ContactOut'], page: 1 },
		'POST',
		'/v1/company/search',
		'company_search',
	],
	[
		'company.enrichDomains',
		Company.enrichDomains as AnyEndpoint,
		{ domains: ['contactout.com'] },
		'POST',
		'/v1/domain/enrich',
		'domain_enrich',
	],
	[
		'account.stats',
		Account.stats as AnyEndpoint,
		{ period: '2026-10' },
		'GET',
		'/v1/stats',
		'stats',
	],
];

beforeAll(() => {
	// unknown: the jest mock lacks fetch's static members, so it needs a two-step cast.
	global.fetch = fetchMock as unknown as typeof fetch;
});

beforeEach(() => {
	fetchMock.mockReset();
	jest.mocked(logEventFromContext).mockClear();
});

describe.each(cases)('%s', (name, endpoint, input, method, path, sample) => {
	it(`${method} ${path} with the token header and parses the documented response`, async () => {
		respond(200, samples[sample as keyof typeof samples]);
		const ctx = createContext();

		const result = await endpoint(ctx, input);

		const call = lastCall();
		expect(call.method).toBe(method);
		expect(call.url.pathname).toBe(path);
		expect(call.headers.get('token')).toBe('work-key');
		expect(call.headers.get('authorization')).toBeNull();
		if (method === 'POST') expect(call.body).toEqual(input);
		else
			for (const [key, value] of Object.entries(input)) {
				expect(call.url.searchParams.get(key)).toBe(String(value));
			}
		expect(result).toMatchObject({ status_code: 200 });
		expect(logEventFromContext).toHaveBeenCalledWith(
			ctx,
			`contactout.${name}`,
			{ emailType: 'work' },
			'completed',
		);
	});
});

describe('contact checkers', () => {
	it('work email status accepts a null status', async () => {
		respond(200, {
			status_code: 200,
			profile: { email: false, email_status: null },
		});

		await expect(
			(Linkedin.workEmailStatus as AnyEndpoint)(createContext(), {
				profile: linkedin,
			}),
		).resolves.toEqual({
			status_code: 200,
			profile: { email: false, email_status: null },
		});
		expect(lastCall().url.pathname).toBe(
			'/v1/people/linkedin/work_email_status',
		);
	});

	it('personal email status', async () => {
		respond(200, { status_code: 200, profile: { email: true } });

		await (Linkedin.personalEmailStatus as AnyEndpoint)(createContext(), {
			profile: linkedin,
		});
		expect(lastCall().url.pathname).toBe(
			'/v1/people/linkedin/personal_email_status',
		);
	});

	it('rejects a Sales Navigator URL', async () => {
		await expect(
			(Linkedin.phoneStatus as AnyEndpoint)(createContext(), {
				profile: 'https://www.linkedin.com/sales/lead/123',
			}),
		).rejects.toThrow('linkedin.com/in/');
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('email.verify', () => {
	it('parses the documented statuses', async () => {
		respond(200, { status_code: 200, data: { status: 'accept_all' } });

		await expect(
			(Email.verify as AnyEndpoint)(createContext(), {
				email: 'jane@example.com',
			}),
		).resolves.toEqual({ status_code: 200, data: { status: 'accept_all' } });
		expect(lastCall().url.pathname).toBe('/v1/email/verify');
	});
});

describe('work and personal keys', () => {
	it('sends the personalKey option when emailType is personal', async () => {
		respond(200, samples.linkedin_enrich);

		await (Linkedin.enrich as AnyEndpoint)(
			createContext({ personalKey: 'personal-key' }),
			{
				profile: linkedin,
				emailType: 'personal',
			},
		);

		const { url, headers } = lastCall();
		expect(headers.get('token')).toBe('personal-key');
		expect(url.searchParams.has('emailType')).toBe(false);
	});

	it('falls back to the stored personal_api_key', async () => {
		respond(200, samples.people_search);
		const ctx = createContext({}, 'stored-personal-key');

		await (People.search as AnyEndpoint)(ctx, {
			company: ['Stripe'],
			emailType: 'personal',
		});

		expect(ctx.keys.get_personal_api_key).toHaveBeenCalled();
		expect(lastCall().headers.get('token')).toBe('stored-personal-key');
		expect(lastCall().body).toEqual({ company: ['Stripe'] });
	});

	it('throws AuthMissingError when no personal key is configured', async () => {
		await expect(
			(Email.enrich as AnyEndpoint)(createContext(), {
				email: 'jane@example.com',
				emailType: 'personal',
			}),
		).rejects.toBeInstanceOf(AuthMissingError);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('builds an empty work key without a key store, so personal-only setups work', async () => {
		const plugin = contactout({ personalKey: 'personal-key' });

		// The key-builder context only matters when a key store is configured.
		await expect(plugin.keyBuilder!({} as never, 'endpoint')).resolves.toBe('');
	});

	it('throws AuthMissingError when no work key is configured', async () => {
		await expect(
			(Email.verify as AnyEndpoint)(createContext({}, null, ''), {
				email: 'jane@example.com',
			}),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});

describe('caching', () => {
	it('saves an enriched LinkedIn profile', async () => {
		respond(200, samples.linkedin_enrich);
		const ctx = createContext();

		await (Linkedin.enrich as AnyEndpoint)(ctx, { profile: linkedin });

		expect(ctx.db.profiles.upsertByEntityId).toHaveBeenCalledWith(
			linkedin,
			expect.objectContaining({
				fullName: 'Example Person',
				companyDomain: 'legros.com',
				hasWorkEmail: true,
				hasPhone: true,
			}),
		);
	});

	it('returns an empty profile without caching it', async () => {
		respond(200, { status_code: 200, profile: [] });
		const ctx = createContext();

		await expect(
			(Linkedin.enrich as AnyEndpoint)(ctx, { profile: linkedin }),
		).resolves.toEqual({ status_code: 200, profile: [] });
		expect(ctx.db.profiles.upsertByEntityId).not.toHaveBeenCalled();
	});

	it('saves search results keyed by profile URL', async () => {
		respond(200, samples.people_search);
		const ctx = createContext();

		await (People.search as AnyEndpoint)(ctx, { company: ['Stripe'] });

		expect(ctx.db.profiles.upsertByEntityId).toHaveBeenCalledWith(
			'https://linkedin.com/in/at-JqjtXv',
			expect.objectContaining({
				fullName: 'Llewellyn Ruecker',
				hasPhone: true,
			}),
		);
	});

	it('keeps saved fields that a sparse search does not return', async () => {
		respond(200, {
			status_code: 200,
			metadata: { page: 1, page_size: 25, total_results: 1 },
			profiles: {
				[linkedin]: { full_name: 'Example Person', headline: 'CTO at Legros' },
			},
		});
		const ctx = createContext();
		const saved = {
			linkedinUrl: linkedin,
			fullName: 'Example Person',
			headline: 'VP Engineering',
			companyDomain: 'legros.com',
			seniority: 'Director',
			hasWorkEmail: true,
			hasPhone: true,
			updatedAt: new Date('2026-10-01'),
		};
		ctx.db.profiles.findByEntityId.mockResolvedValue({ data: saved });

		await (People.search as AnyEndpoint)(ctx, {
			company: ['Legros'],
			output_fields: ['full_name', 'headline'],
		});

		expect(ctx.db.profiles.upsertByEntityId).toHaveBeenCalledWith(linkedin, {
			...saved,
			headline: 'CTO at Legros',
			updatedAt: expect.any(Date),
		});
	});

	it('handles a search with no results', async () => {
		respond(200, {
			status_code: 200,
			metadata: { page: 1, page_size: 25, total_results: 0 },
			profiles: [],
		});

		await expect(
			(People.search as AnyEndpoint)(createContext(), {
				company: ['Nobody Inc'],
			}),
		).resolves.toMatchObject({ profiles: [] });
	});

	it('saves companies from domain enrich, including the documented keyed object', async () => {
		respond(200, {
			status_code: 200,
			companies: {
				'stripe.com': { name: 'Stripe', domain: 'stripe.com', size: 8000 },
				'unknown.example': {},
			},
		});
		const ctx = createContext();

		await (Company.enrichDomains as AnyEndpoint)(ctx, {
			domains: ['stripe.com', 'unknown.example'],
		});

		expect(ctx.db.companies.upsertByEntityId).toHaveBeenCalledTimes(1);
		expect(ctx.db.companies.upsertByEntityId).toHaveBeenCalledWith(
			'stripe.com',
			expect.objectContaining({ name: 'Stripe', size: 8000 }),
		);
	});
});

describe('input rules', () => {
	it('people.enrich needs an identifier or a name with a secondary field', async () => {
		await expect(
			(People.enrich as AnyEndpoint)(createContext(), {
				full_name: 'Jane Doe',
			}),
		).rejects.toThrow('Provide linkedin_url, email, or phone');
		respond(200, samples.people_enrich);
		await expect(
			(People.enrich as AnyEndpoint)(createContext(), {
				full_name: 'Jane Doe',
				company: ['Stripe'],
			}),
		).resolves.toMatchObject({ status_code: 200 });
	});

	it('people.search caps page_size at 25', async () => {
		await expect(
			(People.search as AnyEndpoint)(createContext(), { page_size: 26 }),
		).rejects.toThrow();
	});

	it('people.search rejects recently_changed_jobs with years_in_current_role', async () => {
		await expect(
			(People.search as AnyEndpoint)(createContext(), {
				recently_changed_jobs: true,
				years_in_current_role: ['1_3'],
			}),
		).rejects.toThrow('recently_changed_jobs cannot be used');
	});

	it('decision makers needs a company identifier', async () => {
		await expect(
			(People.decisionMakers as AnyEndpoint)(createContext(), {
				reveal_info: true,
			}),
		).rejects.toThrow('Provide linkedin_url, domain, or name');
	});

	it('company.search rejects linkedin_url with other filters', async () => {
		await expect(
			(Company.search as AnyEndpoint)(createContext(), {
				linkedin_url: ['contactout'],
				name: ['ContactOut'],
			}),
		).rejects.toThrow('linkedin_url cannot be combined');
	});

	it('company.enrichDomains caps domains at 30', async () => {
		await expect(
			(Company.enrichDomains as AnyEndpoint)(createContext(), {
				domains: Array.from({ length: 31 }, (_, i) => `d${i}.com`),
			}),
		).rejects.toThrow();
	});
});

describe('errors', () => {
	it('maps 404 Not Found to the not-found handler', async () => {
		respond(404, { status_code: 404, message: 'Not Found' });

		const error = (await (Email.enrich as AnyEndpoint)(createContext(), {
			email: 'nobody@example.com',
		}).catch((e: Error) => e)) as ContactOutAPIError;

		expect(error).toBeInstanceOf(ContactOutAPIError);
		expect(error.message).toBe('404 Not Found');
		expect(errorHandlers.NOT_FOUND_ERROR.match(error)).toBe(true);
	});

	it('maps 403 out of credits to the permission handler', async () => {
		respond(403, {
			status_code: 403,
			message: "You're out of credits, please email your sales manager",
		});

		const error = (await (People.search as AnyEndpoint)(createContext(), {
			company: ['Stripe'],
		}).catch((e: Error) => e)) as ContactOutAPIError;

		expect(errorHandlers.PERMISSION_ERROR.match(error)).toBe(true);
		expect(await errorHandlers.PERMISSION_ERROR.handler()).toEqual({
			maxRetries: 0,
		});
	});

	it('maps 401 to the auth handler', async () => {
		respond(401, { status_code: 401, message: 'Unauthorized' });

		const error = (await (Account.stats as AnyEndpoint)(
			createContext(),
			{},
		).catch((e: Error) => e)) as ContactOutAPIError;

		expect(errorHandlers.AUTH_ERROR.match(error)).toBe(true);
	});

	it('hands a 429 to the handler after one request, with retry-after', async () => {
		respond(
			429,
			{ status_code: 429, message: 'Rate limit reached' },
			{ 'Retry-After': '4' },
		);

		const error = (await (People.search as AnyEndpoint)(createContext(), {
			company: ['Stripe'],
		}).catch((e: Error) => e)) as ContactOutAPIError;

		expect(fetchMock).toHaveBeenCalledTimes(1);
		expect(error.status).toBe(429);
		expect(error.retryAfter).toBe(4000);
		expect(await errorHandlers.RATE_LIMIT_ERROR.handler(error)).toMatchObject({
			maxRetries: 3,
			headersRetryAfterMs: 4000,
		});
	});

	it('does not replay 5xx', async () => {
		respond(502, { status_code: 502, message: 'Bad gateway' });

		const error = (await (Account.stats as AnyEndpoint)(
			createContext(),
			{},
		).catch((e: Error) => e)) as ContactOutAPIError;

		expect(errorHandlers.SERVER_ERROR.match(error)).toBe(true);
		expect(await errorHandlers.SERVER_ERROR.handler()).toEqual({
			maxRetries: 0,
		});
	});

	it('fails zod validation on a malformed response', async () => {
		respond(200, { status_code: 200, data: { status: 'maybe' } });

		const error = (await (Email.verify as AnyEndpoint)(createContext(), {
			email: 'jane@example.com',
		}).catch((e: Error) => e)) as Error;

		expect(error.name).toBe('ZodError');
		expect(errorHandlers.VALIDATION_ERROR.match(error)).toBe(true);
	});
});
