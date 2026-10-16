import { logEventFromContext } from 'corsair/core';
import { AktaAPIError } from './client';
import { Company, Industry, News } from './endpoints';
import { errorHandlers } from './error-handlers';
import { enrichmentAllSections } from './test-samples';

jest.mock('corsair/core', () => ({
	logEventFromContext: jest.fn().mockResolvedValue(undefined),
	AuthMissingError: class AuthMissingError extends Error {},
}));

// unknown: tests call endpoints with a stub context, not the full plugin context.
type AnyEndpoint = (ctx: unknown, input: unknown) => Promise<unknown>;

const fetchMock = jest.fn<Promise<Response>, [string, RequestInit]>();

function jsonResponse(
	status: number,
	body?: object,
	headers: Record<string, string> = {},
): Response {
	return new Response(body === undefined ? null : JSON.stringify(body), {
		status,
		headers:
			body === undefined
				? headers
				: { 'Content-Type': 'application/json', ...headers },
	});
}

function createContext() {
	return {
		key: 'test-key',
		options: {},
		db: {
			companies: {
				findByEntityId: jest.fn().mockResolvedValue(null),
				upsertByEntityId: jest.fn().mockResolvedValue(undefined),
			},
			newsArticles: {
				upsertByEntityId: jest.fn().mockResolvedValue(undefined),
			},
		},
	};
}

function lastCall() {
	const [url, init] = fetchMock.mock.calls[fetchMock.mock.calls.length - 1]!;
	const headers = new Headers(init.headers);
	return { url: new URL(url), method: init.method, headers };
}

const stripe = {
	uuid: '0000031',
	name: 'Stripe',
	website: 'https://stripe.com',
	product_category: 'Online Payment Processing',
	company_status: 'private',
	akta_rank: 41,
};

const stripeCapital = {
	uuid: '0008i39',
	name: 'Stripe Capital',
	website: 'https://stripe.com/capital',
	parent_company: { name: 'Stripe', uuid: '0000031' },
	product_category: 'Business Financing Services',
	company_status: 'private',
	akta_rank: 25425,
};

const article = {
	id: 40893469,
	title: 'Symphony by Wix Integrates Link’s Wallet for Agents',
	url: 'https://globalfintechseries.com/digital-wallet/symphony-by-wix/',
	publisher: 'Globalfintechseries',
	published_date: '2026-10-16T08:45:06',
	sentiment: 'Positive',
	sentiment_score: 1,
	ai_summary: 'Wix announced that Symphony now integrates Link.',
	word_count: 674,
	original_language: 'EN',
	author: 'Globenewswire',
	countries: [],
	industries: [
		{
			name: 'Embedded Payments (Pay-ins, Pay-outs, Wallets)',
			code: 'FSAGALAB',
			is_primary: true,
		},
	],
	tags: [
		{ name: 'Product Launches & Enhancements', code: 'SD01', is_primary: true },
	],
	company_mentions: [
		{
			uuid: '0000eb4',
			name: 'Wix',
			website: 'http://www.wix.com/',
			is_primary: true,
		},
		{
			uuid: '0000031',
			name: 'Stripe',
			website: 'https://stripe.com',
			is_primary: true,
		},
	],
	article_type: { code: 'explainer', label: 'Explainer' },
	is_press_release: true,
	is_opinion: false,
	is_breaking: false,
	iptc_codes: [{ code: '20001164', name: 'payment service' }],
	iab_categories: [{ code: '597', name: 'Technology & Computing' }],
	naics_codes: [{ code: '522320', name: 'Finance and Insurance' }],
	sic_codes: [{ code: '7370', name: 'SERVICES-COMPUTER PROGRAMMING' }],
	entities: {
		person: ['jay shah'],
		location: ['us'],
		product: ['link'],
		event: [],
	},
	newsworthiness_score: 0.8555,
	group_id: 14295280,
	full_text: 'Symphony by Wix Integrates Link’s Wallet for Agents...',
};

beforeAll(() => {
	// unknown: the jest mock lacks fetch's static members, so it needs a two-step cast.
	global.fetch = fetchMock as unknown as typeof fetch;
});

beforeEach(() => {
	fetchMock.mockReset();
	jest.mocked(logEventFromContext).mockClear();
});

describe('company.search', () => {
	it('sends the query to /v1/company/search/ with x-api-key', async () => {
		fetchMock.mockImplementation(async () =>
			jsonResponse(200, { data: [stripe, stripeCapital], credits_consumed: 0 }),
		);
		const ctx = createContext();

		const result = await (Company.search as AnyEndpoint)(ctx, {
			query: 'stripe.com',
		});

		const { url, method, headers } = lastCall();
		expect(method).toBe('GET');
		expect(url.origin + url.pathname).toBe(
			'https://api.akta.pro/api/v1/company/search/',
		);
		expect(url.searchParams.get('query')).toBe('stripe.com');
		expect(headers.get('x-api-key')).toBe('test-key');
		expect(headers.get('authorization')).toBeNull();
		expect(result).toEqual({
			data: [stripe, stripeCapital],
			credits_consumed: 0,
		});
		expect(ctx.db.companies.upsertByEntityId).toHaveBeenCalledWith(
			'0008i39',
			expect.objectContaining({
				name: 'Stripe Capital',
				parentCompanyUuid: '0000031',
			}),
		);
		expect(logEventFromContext).toHaveBeenCalledWith(
			ctx,
			'akta.company.search',
			{ resultCount: 2 },
			'completed',
		);
	});

	it('returns an empty list on 204 No Content', async () => {
		fetchMock.mockImplementation(async () => jsonResponse(204));

		const result = await (Company.search as AnyEndpoint)(createContext(), {
			query: 'no-such-company-xyz',
		});

		expect(result).toEqual({ data: [], credits_consumed: 0 });
	});

	it('rejects an empty query before calling the API', async () => {
		await expect(
			(Company.search as AnyEndpoint)(createContext(), { query: '' }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('company.enrich', () => {
	const enrichment = {
		data: {
			uuid: '0000031',
			firmographic: {
				name: 'Stripe',
				legal_name: 'Stripe, LLC',
				website: 'stripe.com',
				company_type: { code: 'private', label: 'Private' },
				founded_year: 2010,
				company_description_short: 'Payments infrastructure.',
				operating_status: { code: 'operating', label: 'Operating' },
				headcount_range: '5001-10000',
			},
			location: {
				hq: {
					city: 'South San Francisco',
					country: 'USA',
					region: 'North America',
				},
				market_served: { is_global: true },
				offices: [
					{
						city: 'Singapore',
						country: 'SGP',
						description: 'Regional HQ',
						source: ['https://www.businesstimes.com.sg/'],
						type: { code: 'regional_hq', label: 'Regional Hq' },
					},
				],
			},
			trust_signal: {
				compliance: [
					{
						class: { code: 'payment_financial', label: 'Payment Financial' },
						name: { code: 'pci_dss', label: 'Pci Dss' },
						description: 'PCI compliant.',
						source: ['https://stripe.com/pricing'],
					},
				],
				awards: [
					{
						title: 'Most Valuable Unicorns 2026 ranking - #7',
						body: 'Business Model Analyst',
						type: { code: 'best_in_class_list', label: 'Best-in-class list' },
						source: ['https://businessmodelanalyst.com/'],
					},
				],
			},
		},
		credits_consumed: 3,
	};

	it('joins sections with commas and caches the firmographic', async () => {
		fetchMock.mockImplementation(async () => jsonResponse(200, enrichment));
		const ctx = createContext();

		const result = await (Company.enrich as AnyEndpoint)(ctx, {
			company: '0000031',
			sections: ['firmographic', 'location', 'trust_signal'],
		});

		const { url } = lastCall();
		expect(url.pathname).toBe('/api/v1/company/enrichment/');
		expect(url.searchParams.get('company')).toBe('0000031');
		expect(url.searchParams.get('sections')).toBe(
			'firmographic,location,trust_signal',
		);
		expect(result).toEqual(enrichment);
		expect(ctx.db.companies.upsertByEntityId).toHaveBeenCalledWith(
			'0000031',
			expect.objectContaining({ name: 'Stripe', foundedYear: 2010 }),
		);
	});

	it('parses all 16 sections without dropping fields', async () => {
		fetchMock.mockImplementation(async () =>
			jsonResponse(200, enrichmentAllSections),
		);

		const result = await (Company.enrich as AnyEndpoint)(createContext(), {
			company: 'https://canva.com',
			sections: Object.keys(enrichmentAllSections.data).filter(
				(key) => key !== 'uuid',
			),
		});

		expect(Object.keys(enrichmentAllSections.data)).toHaveLength(17);
		expect(result).toEqual(enrichmentAllSections);
	});

	it('requires sections, since the API rejects a request without them', async () => {
		await expect(
			(Company.enrich as AnyEndpoint)(createContext(), {
				company: 'https://stripe.com',
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('keeps saved firmographic fields that a later search does not return', async () => {
		const ctx = createContext();
		const saved = {
			uuid: '0000031',
			name: 'Stripe',
			website: 'stripe.com',
			foundedYear: 2010,
			headcountRange: '5001-10000',
			descriptionShort: 'Payments infrastructure.',
		};
		ctx.db.companies.findByEntityId.mockResolvedValue({ data: saved });
		fetchMock.mockImplementation(async () =>
			jsonResponse(200, {
				data: [{ uuid: '0000031', name: 'Stripe', company_status: 'private' }],
				credits_consumed: 0,
			}),
		);

		await (Company.search as AnyEndpoint)(ctx, { query: 'stripe' });

		expect(ctx.db.companies.upsertByEntityId).toHaveBeenCalledWith('0000031', {
			...saved,
			companyStatus: 'private',
			productCategory: undefined,
			parentCompanyUuid: undefined,
		});
	});

	it('rejects an unknown section', async () => {
		await expect(
			(Company.enrich as AnyEndpoint)(createContext(), {
				company: '0000031',
				sections: ['revenue'],
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('company.employeeReviews', () => {
	it('paginates with limit and offset', async () => {
		const body = {
			data: {
				uuid: '00000jw-canva',
				employee_reviews: {
					overall_rating: { glassdoor: 3.9 },
					other_ratings: [{ type: 'ceo', provider: 'glassdoor', value: 0.84 }],
					reviews: {
						data: [
							{
								id: 104093537,
								summary: 'Great benefits',
								rating: 4,
								ceo_rating: null,
								provider: 'glassdoor',
							},
						],
						total: 1068,
						total_by_provider: { glassdoor: 1068 },
					},
				},
			},
			limit: 1,
			offset: 5,
			credits_consumed: 1.5,
		};
		fetchMock.mockImplementation(async () => jsonResponse(200, body));

		const result = await (Company.employeeReviews as AnyEndpoint)(
			createContext(),
			{ company: 'https://canva.com', limit: 1, offset: 5 },
		);

		const { url } = lastCall();
		expect(url.pathname).toBe('/api/v1/company/employee-reviews/');
		expect(url.searchParams.get('limit')).toBe('1');
		expect(url.searchParams.get('offset')).toBe('5');
		expect(result).toEqual(body);
	});

	it('rejects a limit above the documented max of 100', async () => {
		await expect(
			(Company.employeeReviews as AnyEndpoint)(createContext(), {
				company: '0000031',
				limit: 101,
			}),
		).rejects.toThrow();
	});
});

describe('company.productReviews', () => {
	it('joins product ids and parses the catalog', async () => {
		const body = {
			data: {
				uuid: '00000l1',
				product_reviews: [
					{
						id: '89224',
						product_name: 'Canva',
						main_category: 'Display Ad Design Software',
						categories: ['Presentation'],
						rating: { g2: 4.7 },
						star_distribution: { g2: { '5': 120, '4': 30 } },
						pricing: [
							{
								price: '$15.00',
								package: 'Canva Pro',
								price_info: '1 person Per Month',
							},
						],
						reviews: {
							data: [
								{
									review_id: 1,
									review_title: 'Great tool',
									review_question_answers: [
										{ question: 'What do you like best?', answer: 'Templates' },
									],
									review_rating: 5,
									provider: 'g2',
								},
							],
							total: 1,
							total_by_provider: { g2: 1 },
						},
					},
				],
			},
			limit: 1,
			offset: 0,
			credits_consumed: 1.5,
		};
		fetchMock.mockImplementation(async () => jsonResponse(200, body));

		const result = await (Company.productReviews as AnyEndpoint)(
			createContext(),
			{ company: 'https://canva.com', products: ['89224', '40370'], limit: 1 },
		);

		const { url } = lastCall();
		expect(url.pathname).toBe('/api/v1/company/product-reviews/');
		expect(url.searchParams.get('products')).toBe('89224,40370');
		expect(result).toEqual(body);
	});

	it('accepts the documented example key `product` with { text, count } pros', async () => {
		const body = {
			data: {
				uuid: '00000l1',
				product: [
					{
						id: '89224',
						product_name: 'Canva',
						pros_list: [{ text: 'Ease of Use', count: '1564' }],
						cons_list: [{ text: 'Limited Features', count: '515' }],
					},
				],
			},
			limit: 0,
			offset: 0,
			credits_consumed: 1.5,
		};
		fetchMock.mockImplementation(async () => jsonResponse(200, body));

		await expect(
			(Company.productReviews as AnyEndpoint)(createContext(), {
				company: '00000l1',
			}),
		).resolves.toEqual(body);
	});
});

describe('industry.search', () => {
	it('sends query and level', async () => {
		const body = {
			data: [
				{
					code: 'FSAGAAAF',
					industry_name: 'Digital Payments & Money Movement',
					similarity: 0.5075,
				},
			],
			count: 1,
			credits_consumed: 0,
		};
		fetchMock.mockImplementation(async () => jsonResponse(200, body));

		const result = await (Industry.search as AnyEndpoint)(createContext(), {
			query: 'fintech',
			level: '3',
		});

		const { url } = lastCall();
		expect(url.pathname).toBe('/api/v1/industry/search/');
		expect(url.searchParams.get('query')).toBe('fintech');
		expect(url.searchParams.get('level')).toBe('3');
		expect(result).toEqual(body);
	});
});

describe('news.list', () => {
	it('encodes list filters as comma-separated values and caches articles', async () => {
		const body = {
			total: 2219,
			limit: 2,
			offset: 0,
			count: 1,
			data: [article],
			credits_consumed: 0.11,
		};
		fetchMock.mockImplementation(async () => jsonResponse(200, body));
		const ctx = createContext();

		const result = await (News.list as AnyEndpoint)(ctx, {
			company: '0000031',
			sentiment_list: ['positive', 'negative'],
			countries: ['USA', 'GBR'],
			start_date: '2026-09-01',
			limit: 2,
		});

		const { url } = lastCall();
		expect(url.pathname).toBe('/api/v1/news/');
		expect(url.searchParams.get('sentiment_list')).toBe('positive,negative');
		expect(url.searchParams.get('countries')).toBe('USA,GBR');
		expect(url.searchParams.get('start_date')).toBe('2026-09-01');
		expect(url.searchParams.has('industry')).toBe(false);
		expect(result).toEqual(body);
		expect(ctx.db.newsArticles.upsertByEntityId).toHaveBeenCalledWith(
			'40893469',
			expect.objectContaining({ companyUuids: ['0000eb4', '0000031'] }),
		);
	});

	it('rejects a malformed start_date', async () => {
		await expect(
			(News.list as AnyEndpoint)(createContext(), { start_date: '09/01/2026' }),
		).rejects.toThrow();
	});
});

describe('errors', () => {
	it('maps 401 to AktaAPIError and the auth handler', async () => {
		fetchMock.mockImplementation(async () =>
			jsonResponse(401, {
				error: 'invalid_api_key',
				detail: 'Invalid API key.',
			}),
		);

		const error = await (Company.search as AnyEndpoint)(createContext(), {
			query: 'stripe',
		}).catch((e: Error) => e);

		expect(error).toBeInstanceOf(AktaAPIError);
		expect((error as AktaAPIError).status).toBe(401);
		expect((error as AktaAPIError).message).toBe('401 Invalid API key.');
		expect(errorHandlers.AUTH_ERROR.match(error as Error)).toBe(true);
	});

	it('maps 403 endpoint_not_in_plan to the permission handler', async () => {
		fetchMock.mockImplementation(async () =>
			jsonResponse(403, {
				error: 'endpoint_not_in_plan',
				detail:
					"Your current plan does not include access to 'company/employee-reviews'.",
				retry_after_seconds: null,
			}),
		);

		const error = (await (Company.employeeReviews as AnyEndpoint)(
			createContext(),
			{ company: '0000031' },
		).catch((e: Error) => e)) as AktaAPIError;

		expect(error.code).toBe('endpoint_not_in_plan');
		expect(errorHandlers.PERMISSION_ERROR.match(error)).toBe(true);
		expect(await errorHandlers.PERMISSION_ERROR.handler()).toEqual({
			maxRetries: 0,
		});
	});

	it('hands a 429 to the rate-limit handler after one request, with retry_after_seconds', async () => {
		fetchMock.mockImplementation(async () =>
			jsonResponse(429, { error: 'rate_limited', retry_after_seconds: 30 }),
		);

		const error = (await (Industry.search as AnyEndpoint)(createContext(), {
			query: 'fintech',
		}).catch((e: Error) => e)) as AktaAPIError;

		expect(fetchMock).toHaveBeenCalledTimes(1);
		expect(error.status).toBe(429);
		expect(error.retryAfter).toBe(30_000);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		expect(await errorHandlers.RATE_LIMIT_ERROR.handler(error)).toMatchObject({
			maxRetries: 3,
			headersRetryAfterMs: 30_000,
		});
	});

	it('prefers the Retry-After header over the body', async () => {
		fetchMock.mockImplementation(async () =>
			jsonResponse(
				429,
				{ error: 'rate_limited', retry_after_seconds: 30 },
				{
					'Retry-After': '2',
				},
			),
		);

		const error = (await (Industry.search as AnyEndpoint)(createContext(), {
			query: 'fintech',
		}).catch((e: Error) => e)) as AktaAPIError;

		expect(fetchMock).toHaveBeenCalledTimes(1);
		expect(error.retryAfter).toBe(2000);
	});

	it('routes 5xx to the server handler with retries', async () => {
		fetchMock.mockImplementation(async () =>
			jsonResponse(503, { error: 'unavailable' }),
		);

		const error = (await (Industry.search as AnyEndpoint)(createContext(), {
			query: 'fintech',
		}).catch((e: Error) => e)) as AktaAPIError;

		expect(errorHandlers.SERVER_ERROR.match(error)).toBe(true);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(false);
	});

	it('fails zod validation on a malformed response', async () => {
		fetchMock.mockImplementation(async () =>
			jsonResponse(200, { data: [{ name: 'Stripe' }], credits_consumed: 0 }),
		);

		const error = (await (Company.search as AnyEndpoint)(createContext(), {
			query: 'stripe',
		}).catch((e: Error) => e)) as Error;

		expect(error.name).toBe('ZodError');
		expect(errorHandlers.VALIDATION_ERROR.match(error)).toBe(true);
	});
});
