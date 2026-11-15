import {
	AccountEndpoints,
	CombinedEndpoints,
	CompanyEndpoints,
	DomainEndpoints,
	FinderEndpoints,
	PersonEndpoints,
	VerifierEndpoints,
} from './endpoints';
import {
	account,
	company,
	domainSearchLive,
	domainStatusLive,
	emailCount,
	emailFormatLive,
	emailSourcesLive,
	locationLive,
	person,
	phoneValidation,
	rateLimitsLive,
	revealLive,
	similarLive,
	suggestion,
	technologyLive,
	verification,
} from './test-fixtures';
import { captureError, invoke } from './test-helpers';

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON; each test passes its own.
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
	};
}

function expectAuthenticated() {
	const sent = lastRequest();
	expect(sent.origin).toBe('https://api.tomba.io');
	expect(sent.headers.get('x-tomba-key')).toBe('tb-test-key');
	expect(sent.headers.get('x-tomba-secret')).toBe('tb-test-secret');
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('account', () => {
	it('account.get GETs v1/me', async () => {
		respond({ data: account });

		const result = (await invoke(AccountEndpoints.get, {})) as {
			data: { confirmed?: boolean | null };
		};

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({ path: '/v1/me', method: 'GET' });
		expect(result.data.confirmed).toBe(true);
	});

	it('account.get drops the secret_token and intercom_user_jwt the body carries', async () => {
		respond({
			data: {
				...account,
				secret_token: 'must-not-be-returned',
				intercom_user_jwt: 'must-not-be-returned',
			},
		});

		const result = (await invoke(AccountEndpoints.get, {})) as {
			data: Record<string, unknown>;
		};

		expect(JSON.stringify(result)).not.toContain('must-not-be-returned');
		expect(result.data.first_name).toBe('Ada');
	});

	it('account.rateLimits GETs v1/rate-limits', async () => {
		respond(rateLimitsLive);

		await invoke(AccountEndpoints.rateLimits, {});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			path: '/v1/rate-limits',
			method: 'GET',
		});
	});
});

describe('finder', () => {
	it('finder.domainSearch GETs v1/domain-search with paging', async () => {
		respond({
			data: { organization: domainSearchLive.organization, emails: [person] },
			meta: { ...domainSearchLive.meta, total: 681 },
		});

		const result = (await invoke(FinderEndpoints.domainSearch, {
			domain: 'stripe.com',
			page: 1,
			limit: 50,
			department: 'engineering',
			country: 'US',
		})) as { data: { emails: unknown[] }; meta?: { total?: number | null } };

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			path: '/v1/domain-search',
			method: 'GET',
		});
		expect(lastRequest().query).toEqual({
			domain: 'stripe.com',
			page: '1',
			limit: '50',
			department: 'engineering',
			country: 'US',
		});
		expect(result.data.emails).toHaveLength(1);
		expect(result.meta?.total).toBe(681);
	});

	it('finder.email GETs v1/email-finder with a domain and name', async () => {
		respond({ data: person });

		const result = (await invoke(FinderEndpoints.email, {
			domain: 'stripe.com',
			first_name: 'Jane',
			last_name: 'Doe',
		})) as { data: { email: string | null } };

		expectAuthenticated();
		expect(lastRequest().path).toBe('/v1/email-finder');
		expect(lastRequest().query).toEqual({
			domain: 'stripe.com',
			first_name: 'Jane',
			last_name: 'Doe',
		});
		expect(result.data.email).toBe('jane.doe@stripe.com');
	});

	it('finder.email accepts a company name instead of a domain', async () => {
		respond({ data: person });

		await invoke(FinderEndpoints.email, {
			company: 'Stripe',
			full_name: 'Jane Doe',
		});

		expect(lastRequest().query).toEqual({
			company: 'Stripe',
			full_name: 'Jane Doe',
		});
	});

	it('finder.email rejects a call with no domain or company', async () => {
		const error = await captureError(
			invoke(FinderEndpoints.email, { first_name: 'Jane' }),
		);

		expect((error as Error).name).toBe('ZodError');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('finder.email rejects a call with no name', async () => {
		const error = await captureError(
			invoke(FinderEndpoints.email, { domain: 'stripe.com' }),
		);

		expect((error as Error).name).toBe('ZodError');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('finder.linkedin GETs v1/linkedin with the profile URL', async () => {
		respond({ data: person });

		await invoke(FinderEndpoints.linkedin, {
			url: 'https://www.linkedin.com/in/jane-doe',
			enrich_mobile: true,
		});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			path: '/v1/linkedin',
			method: 'GET',
		});
		expect(lastRequest().query).toEqual({
			url: 'https://www.linkedin.com/in/jane-doe',
			enrich_mobile: 'true',
		});
	});

	it('finder.author GETs v1/author-finder with the article URL', async () => {
		respond({ data: person });

		await invoke(FinderEndpoints.author, {
			url: 'https://stripe.com/blog/engineering',
		});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			path: '/v1/author-finder',
			method: 'GET',
		});
		expect(lastRequest().query).toEqual({
			url: 'https://stripe.com/blog/engineering',
		});
	});

	it('finder.enrich GETs v1/enrich with the email', async () => {
		respond({ data: person });

		await invoke(FinderEndpoints.enrich, { email: 'jane.doe@stripe.com' });

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({ path: '/v1/enrich', method: 'GET' });
		expect(lastRequest().query).toEqual({ email: 'jane.doe@stripe.com' });
	});

	it('finder.phone GETs v1/phone-finder from an email', async () => {
		respond({ data: { phone_data: [] } });

		await invoke(FinderEndpoints.phone, { email: 'jane.doe@stripe.com' });

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			path: '/v1/phone-finder',
			method: 'GET',
		});
	});

	it('finder.phone accepts a domain instead of an email', async () => {
		respond({ data: {} });

		await invoke(FinderEndpoints.phone, { domain: 'stripe.com' });

		expect(lastRequest().query).toEqual({ domain: 'stripe.com' });
	});

	it('finder.phone rejects a call that names no person', async () => {
		const error = await captureError(invoke(FinderEndpoints.phone, {}));

		expect((error as Error).name).toBe('ZodError');
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('verifier', () => {
	it('verifier.email GETs v1/email-verifier', async () => {
		respond({ data: verification });

		const result = (await invoke(VerifierEndpoints.email, {
			email: 'jane.doe@stripe.com',
		})) as { data: { email: { status: string; score: number } } };

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			path: '/v1/email-verifier',
			method: 'GET',
		});
		expect(result.data.email.status).toBe('valid');
		expect(result.data.email.score).toBe(99);
	});

	it('verifier.email rejects an address the schema refuses', async () => {
		const error = await captureError(
			invoke(VerifierEndpoints.email, { email: 'not-an-email' }),
		);

		expect((error as Error).name).toBe('ZodError');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('verifier.phone GETs v1/phone-validator with the country code', async () => {
		respond({ data: phoneValidation });

		const result = (await invoke(VerifierEndpoints.phone, {
			phone: '4155550132',
			country_code: 'US',
		})) as { data: { valid?: boolean | null; line_type?: string | null } };

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			path: '/v1/phone-validator',
			method: 'GET',
		});
		expect(lastRequest().query).toEqual({
			phone: '4155550132',
			country_code: 'US',
		});
		expect(result.data.valid).toBe(true);
		expect(result.data.line_type).toBe('MOBILE');
	});
});

describe('company, person and combined', () => {
	it('company.find GETs v1/companies/find', async () => {
		respond({ data: company });

		const result = (await invoke(CompanyEndpoints.find, {
			domain: 'stripe.com',
		})) as { data: { name?: string | null } };

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			path: '/v1/companies/find',
			method: 'GET',
		});
		expect(result.data.name).toBe('Stripe');
	});

	it('company.search POSTs a plain-language query to v1/reveal/search', async () => {
		respond(revealLive);

		const result = (await invoke(CompanyEndpoints.search, {
			query: 'Fintech companies in France',
		})) as { data: { companies: unknown[] } };

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			path: '/v1/reveal/search',
			method: 'POST',
		});
		expect(result.data.companies).toHaveLength(1);
	});

	it('company.search sends structured filters and the page', async () => {
		respond(revealLive);

		await invoke(CompanyEndpoints.search, {
			filters: { industry: { include: ['financial services'] } },
			page: 2,
		});

		expect(lastRequest().method).toBe('POST');
	});

	it('company.search rejects a call with neither query nor filters', async () => {
		const error = await captureError(invoke(CompanyEndpoints.search, {}));

		expect((error as Error).name).toBe('ZodError');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('person.find GETs v1/people/find', async () => {
		respond({ data: person });

		await invoke(PersonEndpoints.find, { email: 'jane.doe@stripe.com' });

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			path: '/v1/people/find',
			method: 'GET',
		});
	});

	it('combined.find GETs v1/combined/find', async () => {
		respond({ data: { person, company } });

		const result = (await invoke(CombinedEndpoints.find, {
			email: 'jane.doe@stripe.com',
		})) as { data: { person?: unknown; company?: unknown } };

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			path: '/v1/combined/find',
			method: 'GET',
		});
		expect(result.data.person).toBeDefined();
		expect(result.data.company).toBeDefined();
	});
});

describe('domain data', () => {
	it('domain.emailCount GETs v1/email-count with the type filter', async () => {
		respond({ data: emailCount });

		const result = (await invoke(DomainEndpoints.emailCount, {
			domain: 'stripe.com',
			type: 'personal',
		})) as { data: { total?: number | null } };

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			path: '/v1/email-count',
			method: 'GET',
		});
		expect(lastRequest().query).toEqual({
			domain: 'stripe.com',
			type: 'personal',
		});
		expect(result.data.total).toBe(681);
	});

	it('domain.emailCount rejects a type outside the documented enum', async () => {
		const error = await captureError(
			invoke(DomainEndpoints.emailCount, { domain: 'x.com', type: 'role' }),
		);

		expect((error as Error).name).toBe('ZodError');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('domain.emailFormat GETs v1/email-format', async () => {
		respond(emailFormatLive);

		await invoke(DomainEndpoints.emailFormat, { domain: 'stripe.com' });

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			path: '/v1/email-format',
			method: 'GET',
		});
	});

	it('domain.location GETs v1/location', async () => {
		respond(locationLive);

		await invoke(DomainEndpoints.location, { domain: 'stripe.com' });

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			path: '/v1/location',
			method: 'GET',
		});
	});

	it('domain.technology GETs v1/technology', async () => {
		respond(technologyLive);

		await invoke(DomainEndpoints.technology, { domain: 'stripe.com' });

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			path: '/v1/technology',
			method: 'GET',
		});
	});

	it('domain.similar GETs v1/similar', async () => {
		respond(similarLive);

		await invoke(DomainEndpoints.similar, {
			domain: 'stripe.com',
			page: 2,
			limit: 20,
		});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({ path: '/v1/similar', method: 'GET' });
		expect(lastRequest().query).toEqual({
			domain: 'stripe.com',
			page: '2',
			limit: '20',
		});
	});

	it('domain.status GETs v1/domain-status', async () => {
		respond(domainStatusLive);

		const result = (await invoke(DomainEndpoints.status, {
			domain: 'stripe.com',
		})) as { webmail?: boolean | null; disposable?: boolean | null };

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			path: '/v1/domain-status',
			method: 'GET',
		});
		// No data envelope on this route.
		expect(result).toMatchObject({ webmail: false, disposable: false });
	});

	it('domain.suggestions GETs v1/domain-suggestions', async () => {
		respond({ data: [suggestion] });

		const result = (await invoke(DomainEndpoints.suggestions, {
			query: 'stripe',
		})) as { data: unknown[] };

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			path: '/v1/domain-suggestions',
			method: 'GET',
		});
		// The reference names the parameter `query`; `domain` is ignored.
		expect(lastRequest().query).toEqual({ query: 'stripe' });
		expect(result.data).toHaveLength(1);
	});

	it('domain.emailSources GETs v1/email-sources', async () => {
		respond(emailSourcesLive);

		const result = (await invoke(DomainEndpoints.emailSources, {
			email: 'jane.doe@stripe.com',
		})) as { data: unknown[] };

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			path: '/v1/email-sources',
			method: 'GET',
		});
		// The route looks up one address; it has no domain parameter.
		expect(lastRequest().query).toEqual({ email: 'jane.doe@stripe.com' });
		expect(result.data).toHaveLength(1);
	});
});

describe('credential handling', () => {
	function ctxWithKey(key: string) {
		return {
			key,
			authType: 'api_key',
			options: {},
			tenantId: 'default',
			keys: {
				get_api_key: async () => 'tb-test-key',
				get_api_secret: async () => 'tb-test-secret',
			},
		} as never;
	}

	it('refuses a key without the packed secret before sending anything', async () => {
		const error = await captureError(
			AccountEndpoints.get(ctxWithKey('tb-test-key'), {} as never),
		);

		expect((error as Error).message).toContain('incomplete');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('reads both credentials from ctx.key, never from options', async () => {
		respond({ data: account });

		await AccountEndpoints.get(
			{
				...(ctxWithKey(
					JSON.stringify({ apiKey: 'from-key', apiSecret: 'from-key-secret' }),
				) as object),
				options: { apiSecret: 'from-options' },
			} as never,
			{} as never,
		);

		expect(lastRequest().headers.get('x-tomba-key')).toBe('from-key');
		expect(lastRequest().headers.get('x-tomba-secret')).toBe('from-key-secret');
	});
});
