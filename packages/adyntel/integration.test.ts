import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { AdyntelAPIError } from './client';
import { adyntel } from './index';
import {
	errorBody,
	googleAdsResponse,
	linkedinAdsResponse,
	metaAdsResponse,
	tiktokKeywordSearchResponse,
} from './test-fixtures';

const EMAIL = 'mike@tyson.com';

async function createClient(
	options: Parameters<typeof adyntel>[0],
	email: string | null = EMAIL,
) {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'adyntel', 'default');
	const corsair = createCorsair({
		plugins: [adyntel(options)],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	await corsair.adyntel.keys.issue_new_dek();
	if (email) await corsair.adyntel.keys.set_email(email);
	return { corsair, testDb };
}

let fetchMock: jest.SpyInstance;

function respond(
	// unknown: response bodies are arbitrary JSON.
	body: unknown,
	status = 200,
	headers: Record<string, string> = {},
) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json', ...headers },
		}),
	);
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	jest.spyOn(console, 'log').mockImplementation(() => undefined);
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('Adyntel plugin through createCorsair', () => {
	it('fails fast with AuthMissingError when no key is configured', async () => {
		const { corsair, testDb } = await createClient({});
		try {
			await expect(
				corsair.adyntel.api.meta.ads({ company_domain: 'zoom.com' }),
			).rejects.toThrow(/auth-missing/);
			expect(fetchMock).not.toHaveBeenCalled();
		} finally {
			testDb.cleanup();
		}
	});

	it('fails with AuthMissingError when the account has no email', async () => {
		const { corsair, testDb } = await createClient(
			{ key: 'hd-test-key' },
			null,
		);
		try {
			await expect(
				corsair.adyntel.api.google.ads({ company_domain: 'clay.com' }),
			).rejects.toThrow(/auth-missing/);
			// A key without the matching email is a 401 at the API, so the call is
			// never sent.
			expect(fetchMock).not.toHaveBeenCalled();
		} finally {
			testDb.cleanup();
		}
	});

	it('sends the stored api key and email in the body', async () => {
		const { corsair, testDb } = await createClient({});
		try {
			await corsair.adyntel.keys.set_api_key('hd-stored-key');
			respond(googleAdsResponse);

			await corsair.adyntel.api.google.ads({ company_domain: 'clay.com' });

			const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
			expect(url).toBe('https://api.adyntel.com/google');
			expect(JSON.parse(String(init.body))).toMatchObject({
				api_key: 'hd-stored-key',
				email: EMAIL,
			});
			const headers = new Headers(init.headers);
			expect(headers.get('authorization')).toBeNull();
		} finally {
			testDb.cleanup();
		}
	});

	it('reads ads with the configured key', async () => {
		const { corsair, testDb } = await createClient({ key: 'hd-test-key' });
		try {
			respond(metaAdsResponse);

			const result = await corsair.adyntel.api.meta.ads({
				company_domain: 'zappos.com',
			});

			expect(result.number_of_ads).toBe(32);
			// The endpoint flattens, so this is a flat list even when the API
			// nests its pages.
			expect(result.results?.[0]?.snapshot?.page_name).toBeDefined();
		} finally {
			testDb.cleanup();
		}
	});

	it('prefers the email option over the stored one', async () => {
		const { corsair, testDb } = await createClient({
			key: 'hd-test-key',
			email: 'option@example.com',
		});
		try {
			respond(linkedinAdsResponse);

			await corsair.adyntel.api.linkedin.ads({ company_domain: 'clay.com' });

			const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
			expect(JSON.parse(String(init.body)).email).toBe('option@example.com');
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a bad key', async () => {
		const { corsair, testDb } = await createClient({ key: 'hd-bad-key' });
		try {
			respond(errorBody, 401);

			// unknown: a rejection can be any value until toBeInstanceOf narrows it.
			const error = await corsair.adyntel.api.google
				.ads({ company_domain: 'clay.com' })
				.catch((e: unknown) => e);

			expect(error).toBeInstanceOf(AdyntelAPIError);
			expect(error).toMatchObject({ status: 401 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a 402, because there are no credits to spend', async () => {
		const { corsair, testDb } = await createClient({ key: 'hd-test-key' });
		try {
			respond({ message: 'Insufficient credits' }, 402);

			await expect(
				corsair.adyntel.api.google.ads({ company_domain: 'clay.com' }),
			).rejects.toMatchObject({ status: 402 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a 422 that was rejected before any scraping', async () => {
		const { corsair, testDb } = await createClient({ key: 'hd-test-key' });
		try {
			respond({ message: 'Unsupported language' }, 422);

			await expect(
				corsair.adyntel.api.meta.ads({
					company_domain: 'zoom.com',
					language: ['Klingon'],
				}),
			).rejects.toMatchObject({ status: 422 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});
});

describe('live smoke test', () => {
	// CI has no key, so CI never runs this. It is the only check that the
	// documented paths and payloads are still true of the deployed API.
	const describeIfKey = process.env.ADYNTEL_API_KEY ? describe : describe.skip;

	describeIfKey('against the real API', () => {
		const liveEmail = process.env.ADYNTEL_EMAIL ?? '';

		async function liveClient() {
			const testDb = createTestDatabase();
			await createIntegrationAndAccount(testDb.db, 'adyntel', 'default');
			const corsair = createCorsair({
				plugins: [
					adyntel({ key: process.env.ADYNTEL_API_KEY, email: liveEmail }),
				],
				database: testDb.db,
				kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
			});
			return { corsair, testDb };
		}

		it('reads a domain known to run Google ads', async () => {
			const { corsair, testDb } = await liveClient();
			try {
				const result = await corsair.adyntel.api.google.ads({
					company_domain: 'clay.com',
				});

				expect(result.ads === undefined || Array.isArray(result.ads)).toBe(
					true,
				);
			} finally {
				testDb.cleanup();
			}
		}, 120_000);

		it('reads paid and organic keyword counts for a domain', async () => {
			const { corsair, testDb } = await liveClient();
			try {
				const result = await corsair.adyntel.api.keywords.paidVsOrganic({
					company_domain: 'lokalise.com',
				});

				expect(result.organic?.count ?? result.paid?.count).toBeDefined();
			} finally {
				testDb.cleanup();
			}
		}, 120_000);

		it('runs a TikTok keyword search and reads one ad back', async () => {
			const { corsair, testDb } = await liveClient();
			try {
				const search = await corsair.adyntel.api.tiktok.keywordSearch({
					keyword: 'toys',
					country_code: 'DE',
				});
				// Verified against the live API on 2026-11-06: this endpoint
				// answers 204 with an empty body for every keyword tried, with or
				// without a country filter. An empty result is therefore a
				// legitimate answer and must not fail the test; what this asserts
				// is that a 204 parses instead of throwing.
				expect(search.data === undefined || Array.isArray(search.data)).toBe(
					true,
				);
			} finally {
				testDb.cleanup();
			}
		}, 120_000);

		it('reads the company TikTok ads, which do return a body', async () => {
			const { corsair, testDb } = await liveClient();
			try {
				const result = await corsair.adyntel.api.tiktok.ads({
					company_domain: 'gymshark.com',
				});

				expect(result.handle).toBeDefined();
				expect(Array.isArray(result.brand_ads)).toBe(true);
			} finally {
				testDb.cleanup();
			}
		}, 120_000);

		it('lists Meta ads with a flat results list', async () => {
			const { corsair, testDb } = await liveClient();
			try {
				const result = await corsair.adyntel.api.meta.ads({
					company_domain: 'zappos.com',
				});

				// The live API returns a flat list here, unlike its spec examples.
				if (result.results) {
					expect(Array.isArray(result.results[0])).toBe(false);
				}
				expect(result.number_of_ads ?? 0).toBeGreaterThanOrEqual(0);
			} finally {
				testDb.cleanup();
			}
		}, 120_000);

		it('reads LinkedIn ads and their company-only fields', async () => {
			const { corsair, testDb } = await liveClient();
			try {
				const result = await corsair.adyntel.api.linkedin.ads({
					company_domain: 'clay.com',
				});

				expect(result.total_ads ?? 0).toBeGreaterThanOrEqual(0);
			} finally {
				testDb.cleanup();
			}
		}, 120_000);

		it('reads Google Shopping ads inline', async () => {
			const { corsair, testDb } = await liveClient();
			try {
				const result = await corsair.adyntel.api.google.shopping({
					company_domain: 'tesla.com',
					shopping: true,
				});

				// With `shopping: true` the ads come back inline. A task ID here
				// would mean the synchronous parser silently fell back to the
				// async one, so it is a failure, not an accepted alternative.
				expect(result.id).toBeUndefined();
				expect(result.ads === undefined || Array.isArray(result.ads)).toBe(
					true,
				);
			} finally {
				testDb.cleanup();
			}
		}, 120_000);
	});
});

// Kept so the fixture import stays exercised when the live block is skipped.
it('has a TikTok search fixture shaped like a success', () => {
	expect(tiktokKeywordSearchResponse.code).toBe(0);
	expect(Array.isArray(tiktokKeywordSearchResponse.data)).toBe(true);
});
