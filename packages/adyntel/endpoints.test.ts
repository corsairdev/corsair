import { logEventFromContext } from 'corsair/core';
import { AdyntelAPIError } from './client';
import { Google, Keywords, LinkedIn, Meta, TikTok } from './endpoints';
import { liveMetaAds, liveMetaAdsNested } from './live-fixtures';
import {
	errorBody,
	googleAdsResponse,
	googleShoppingAds,
	googleShoppingPending,
	googleShoppingQueued,
	jobStarted,
	jobsStarted,
	linkedinAdsResponse,
	linkedinEuTransparency,
	linkedinKeywordSearchResponse,
	metaAdSearchResponse,
	metaAdsResponse,
	paidVsOrganicResponse,
	tiktokAdDetailsResponse,
	tiktokAdsResponse,
	tiktokKeywordSearchResponse,
	tiktokNonZeroCode,
} from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const API_KEY = 'hd-test-api-key';
const EMAIL = 'mike@tyson.com';

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant. Each endpoint returns its own output type, so
// the shared return is unknown: it is the endpoint's own output, not this
// helper's.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>;

/**
 * The fake context carries the API key on `key` and the account email through
 * `options`, which is the pair `resolveEmail` reads.
 */
// The key builder joins the API key and the email with a NUL, so the context's
// `key` carries both by the time an endpoint runs.
const CREDENTIAL_KEY = `${API_KEY}\u0000${EMAIL}`;

function invoke(
	endpoint: AnyEndpoint,
	// unknown: negative cases pass values no schema accepts.
	input: unknown,
) {
	return endpoint({ key: CREDENTIAL_KEY } as never, input as never);
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

function respondEmpty(status: number) {
	fetchMock.mockResolvedValueOnce(new Response(null, { status }));
}

function lastRequest() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	// unknown: the request body is whatever the endpoint serialized.
	const body = init.body
		? (JSON.parse(String(init.body)) as unknown)
		: undefined;
	return {
		url,
		method: init.method,
		body,
		bodyRecord: body as Record<string, unknown>,
	};
}

const SCRAPE_CREDENTIALS = { api_key: API_KEY, email: EMAIL };

beforeEach(() => {
	// Any call a test did not queue a response for throws, so no test can reach
	// the real API.
	fetchMock = jest.spyOn(globalThis, 'fetch').mockImplementation(() => {
		throw new Error('unmocked fetch in a unit test');
	});
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

// ── meta ──────────────────────────────────────────────────────────────────

describe('meta.ads', () => {
	it('POSTs the domain to /facebook and keeps every ad', async () => {
		respond(metaAdsResponse);

		const result = await invoke(Meta.ads, { company_domain: 'zappos.com' });

		const sent = lastRequest();
		expect(sent.url).toBe('https://api.adyntel.com/facebook');
		expect(sent.method).toBe('POST');
		expect(sent.bodyRecord).toEqual({
			company_domain: 'zappos.com',
			...SCRAPE_CREDENTIALS,
		});
		const parsed = result as typeof metaAdsResponse;
		expect(parsed.number_of_ads).toBe(32);
		// The endpoint flattens, so a result page is not a nested array.
		expect(parsed.results?.[0]).toHaveProperty('snapshot');
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'adyntel.meta.ads',
			{ pageId: '7172307686', adCount: 32, jobId: undefined },
			'completed',
		);
	});

	it('accepts a Facebook page URL instead of a domain', async () => {
		respond(metaAdsResponse);

		await invoke(Meta.ads, { facebook_url: 'https://facebook.com/zoom' });

		expect(lastRequest().bodyRecord).toMatchObject({
			facebook_url: 'https://facebook.com/zoom',
		});
	});

	it('rejects a call with both a domain and a page URL', async () => {
		await expect(
			invoke(Meta.ads, {
				company_domain: 'zoom.com',
				facebook_url: 'https://facebook.com/zoom',
			}),
		).rejects.toThrow(/exactly one/);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a call with neither a domain nor a page URL', async () => {
		await expect(invoke(Meta.ads, { country_code: 'US' })).rejects.toThrow(
			/exactly one/,
		);
	});

	it('maps a 204 to an empty result, because nothing was charged', async () => {
		respondEmpty(204);

		await expect(
			invoke(Meta.ads, { company_domain: 'dead-domain.example' }),
		).resolves.toEqual({});
	});

	it('passes a multi-country array through and surfaces the job IDs', async () => {
		respond(jobsStarted);

		const result = (await invoke(Meta.ads, {
			company_domain: 'zoom.com',
			country_code: ['FR', 'ES', 'DE'],
			webhook_url: 'https://example.com/hook',
		})) as typeof jobsStarted;

		expect(lastRequest().bodyRecord.country_code).toEqual(['FR', 'ES', 'DE']);
		expect(result.jobIds).toHaveLength(1);
		expect(result.failedCountries).toEqual(['ES']);
	});

	it('rejects more than 20 countries', async () => {
		await expect(
			invoke(Meta.ads, {
				company_domain: 'zoom.com',
				country_code: Array.from(
					{ length: 21 },
					(_, i) => `C${String(i).padStart(2, '0')}`,
				),
			}),
		).rejects.toThrow();
	});

	it('rejects a misspelled field rather than silently ignoring it', async () => {
		await expect(
			invoke(Meta.ads, { companyDomain: 'zoom.com' }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('meta.ads flattens the two shapes the endpoint returns', () => {
	it('flattens a nested body to a flat list of ads', async () => {
		respond(liveMetaAdsNested);

		const result = (await invoke(Meta.ads, {
			company_domain: 'zappos.com',
		})) as { results?: { ad_archive_id?: string }[] };

		// One array per page arrived; the caller still reads a flat list.
		expect(Array.isArray(result.results?.[0])).toBe(false);
		expect(result.results?.length).toBe(
			liveMetaAdsNested.results.flat().length,
		);
		expect(result.results?.[0]?.ad_archive_id).toBeDefined();
	});

	it('leaves an already-flat body alone', async () => {
		respond(liveMetaAds);

		const result = (await invoke(Meta.ads, {
			company_domain: 'zappos.com',
		})) as { results?: { ad_archive_id?: string }[] };

		expect(result.results?.length).toBe(liveMetaAds.results.length);
		expect(result.results?.[0]?.ad_archive_id).toBeDefined();
	});
});

describe('meta.adSearch', () => {
	it('POSTs the keyword to /facebook_ad_search', async () => {
		respond(metaAdSearchResponse);

		const result = await invoke(Meta.adSearch, {
			keyword: 'webinar',
			country_code: 'US',
		});

		expect(lastRequest().url).toBe(
			'https://api.adyntel.com/facebook_ad_search',
		);
		expect(lastRequest().bodyRecord).toEqual({
			keyword: 'webinar',
			country_code: 'US',
			...SCRAPE_CREDENTIALS,
		});
		const parsed = result as typeof metaAdSearchResponse;
		expect(parsed.query).toBe('webinar');
		expect(parsed.results?.[0]?.[0]?.adArchiveID).toBe('540995951781259');
	});

	it('keeps numeric categories, which this endpoint sends instead of names', async () => {
		respond(metaAdSearchResponse);

		const result = (await invoke(Meta.adSearch, { keyword: 'x' })) as {
			// unknown: the test only asserts the value, not its type.
			results?: { categories?: unknown }[][];
		};

		expect(result.results?.[0]?.[0]?.categories).toEqual([0]);
	});

	it('rejects a missing keyword', async () => {
		await expect(invoke(Meta.adSearch, {})).rejects.toThrow();
	});
});

// ── google ────────────────────────────────────────────────────────────────

describe('google.ads', () => {
	it('POSTs the domain to /google and keeps the variants', async () => {
		respond(googleAdsResponse);

		const result = await invoke(Google.ads, { company_domain: 'clay.com' });

		expect(lastRequest().url).toBe('https://api.adyntel.com/google');
		expect(lastRequest().bodyRecord).toEqual({
			company_domain: 'clay.com',
			...SCRAPE_CREDENTIALS,
		});
		const parsed = result as typeof googleAdsResponse;
		expect(parsed.total_ad_count).toBe(200);
		expect(parsed.ads?.[0]?.variants?.[0]?.height).toBe(133);
	});

	it('accepts null variant dimensions on a video ad', async () => {
		respond(googleAdsResponse);

		const result = (await invoke(Google.ads, {
			company_domain: 'clay.com',
		})) as typeof googleAdsResponse;

		expect(result.ads?.[1]?.variants?.[0]).toMatchObject({
			height: null,
			width: null,
		});
	});

	it('sends an echoable country code with the continuation token', async () => {
		respond(googleAdsResponse);

		await invoke(Google.ads, {
			company_domain: 'clay.com',
			country_code: 'FR',
			continuation_token:
				'CgoAP7zmzWyVepVfEhCcFXFmJGX7XoQegAEAAAAAGgn8+HwJ+GfueB4=',
		});

		expect(lastRequest().bodyRecord).toMatchObject({
			country_code: 'FR',
			continuation_token:
				'CgoAP7zmzWyVepVfEhCcFXFmJGX7XoQegAEAAAAAGgn8+HwJ+GfueB4=',
		});
	});

	it('maps a 204 to an empty result', async () => {
		respondEmpty(204);

		await expect(
			invoke(Google.ads, { company_domain: 'clay.com' }),
		).resolves.toEqual({});
	});

	it('reads extracted_text, which extract_text pays a credit for', async () => {
		respond({
			...googleAdsResponse,
			ads: [
				{ creative_id: '1', extracted_text: 'Buy one, get one free' },
				{ creative_id: '2', extracted_text: null },
			],
		});

		const result = (await invoke(Google.ads, {
			company_domain: 'clay.com',
			extract_text: true,
		})) as { ads?: { extracted_text?: string | null }[] };

		expect(result.ads?.[0]?.extracted_text).toBe('Buy one, get one free');
		expect(result.ads?.[1]?.extracted_text).toBeNull();
	});
});

describe('google.shopping', () => {
	it('returns a task id when the async parser is used', async () => {
		respond(googleShoppingQueued, 202);

		const result = (await invoke(Google.shopping, {
			company_domain: 'tesla.com',
		})) as typeof googleShoppingQueued;

		expect(lastRequest().url).toBe('https://api.adyntel.com/google_shopping');
		expect(result.id).toBe('12172142-7717-0066-0000-f1e50ca3d579');
	});

	it('returns ads inline when shopping is true', async () => {
		respond(googleShoppingAds);

		const result = (await invoke(Google.shopping, {
			company_domain: 'tesla.com',
			shopping: true,
		})) as typeof googleShoppingAds;

		expect(lastRequest().bodyRecord.shopping).toBe(true);
		expect(result.ads?.[0]?.title).toBe('iHerb, LLC');
	});
});

describe('google.shoppingStatus', () => {
	it('POSTs the task id to /google_shopping_status', async () => {
		respond(googleShoppingAds);

		const result = (await invoke(Google.shoppingStatus, {
			id: '12172142-7717-0066-0000-f1e50ca3d579',
		})) as typeof googleShoppingAds;

		expect(lastRequest().url).toBe(
			'https://api.adyntel.com/google_shopping_status',
		);
		expect(lastRequest().bodyRecord).toEqual({
			id: '12172142-7717-0066-0000-f1e50ca3d579',
			...SCRAPE_CREDENTIALS,
		});
		expect(result.ads).toHaveLength(1);
	});

	it('reports the shopping ad shape, which differs from the /google ad', async () => {
		respond(googleShoppingAds);

		const result = (await invoke(Google.shoppingStatus, {
			id: '12172142-7717-0066-0000-f1e50ca3d579',
		})) as typeof googleShoppingAds;

		// DataForSEO fields: a preview image and a rank, not `/google`'s
		// `variants` and `last_seen`.
		expect(result.ads?.[0]?.preview_image?.width).toBe(380);
		expect(result.ads?.[0]?.rank_absolute).toBe(1);
		expect(result.ads?.[0]?.verified).toBe(true);
		expect(result.ads?.[0]?.first_shown).toBe('2024-02-27 01:02:34 +00:00');
	});

	it('reports a still-running task without failing', async () => {
		respond(googleShoppingPending, 202);

		const result = (await invoke(Google.shoppingStatus, { id: 'x' })) as {
			status?: string;
		};

		expect(result.status).toBe('processing');
	});
});

// ── linkedin ──────────────────────────────────────────────────────────────

describe('linkedin.ads', () => {
	it('POSTs the domain to /linkedin', async () => {
		respond(linkedinAdsResponse);

		const result = await invoke(LinkedIn.ads, { company_domain: 'clay.com' });

		expect(lastRequest().url).toBe('https://api.adyntel.com/linkedin');
		expect(lastRequest().bodyRecord).toEqual({
			company_domain: 'clay.com',
			...SCRAPE_CREDENTIALS,
		});
		const parsed = result as typeof linkedinAdsResponse;
		expect(parsed.total_ads).toBe(834);
		expect(parsed.ads?.[0]?.ad_id).toBe('1362645846');
	});

	it('accepts a page ID instead of a domain', async () => {
		respond(linkedinAdsResponse);

		await invoke(LinkedIn.ads, { linkedin_page_id: '15564' });

		expect(lastRequest().bodyRecord).toMatchObject({
			linkedin_page_id: '15564',
		});
	});

	it('accepts a numeric page ID, which the docs type as a number', async () => {
		respond(linkedinAdsResponse);

		await invoke(LinkedIn.ads, { linkedin_page_id: 15564 });

		expect(lastRequest().bodyRecord).toMatchObject({
			linkedin_page_id: 15564,
		});
	});

	it('rejects a call with no company identifier', async () => {
		await expect(invoke(LinkedIn.ads, { live_ads: true })).rejects.toThrow(
			/Send one of/,
		);
	});

	it('sends a preset date filter as a bare string', async () => {
		respond(linkedinAdsResponse);

		await invoke(LinkedIn.ads, {
			company_domain: 'clay.com',
			date_filter: { preset: 'last30d' },
		});

		expect(lastRequest().bodyRecord.date_filter).toBe('last30d');
	});

	it('sends a custom range as the object the API reads', async () => {
		respond(linkedinAdsResponse);

		await invoke(LinkedIn.ads, {
			company_domain: 'clay.com',
			date_filter: { startdate: '2026-01-01', enddate: '2026-02-01' },
		});

		expect(lastRequest().bodyRecord.date_filter).toEqual({
			startdate: '2026-01-01',
			enddate: '2026-02-01',
		});
	});

	it('rejects a date filter with only one end of the range', async () => {
		await expect(
			invoke(LinkedIn.ads, {
				company_domain: 'clay.com',
				date_filter: { startdate: '2026-01-01' },
			}),
		).rejects.toThrow(/preset/);
	});

	it('keeps the empty EU transparency block a non-EU ad returns', async () => {
		respond({
			...linkedinAdsResponse,
			ads: [{ ad_id: '1', eu_transparency: { targeting: {} } }],
		});

		const result = (await invoke(LinkedIn.ads, {
			company_domain: 'clay.com',
			impression_data: true,
		})) as {
			// unknown: an empty object when the ad is outside the EU.
			ads?: { eu_transparency?: { targeting?: unknown } }[];
		};

		expect(result.ads?.[0]?.eu_transparency?.targeting).toEqual({});
	});

	it('keeps the EU impression split when present', async () => {
		respond({
			...linkedinAdsResponse,
			ads: [{ ad_id: '1', eu_transparency: linkedinEuTransparency }],
		});

		const result = (await invoke(LinkedIn.ads, {
			company_domain: 'clay.com',
			impression_data: true,
		})) as {
			ads?: { eu_transparency?: typeof linkedinEuTransparency }[];
		};

		expect(result.ads?.[0]?.eu_transparency?.totalImpressions).toBe('< 1k');
		expect(result.ads?.[0]?.eu_transparency?.impressionsByCountry).toHaveLength(
			2,
		);
	});

	it('keeps extracted_text, including null when the read failed', async () => {
		respond({
			...linkedinAdsResponse,
			ads: [
				{ ad_id: '1', extracted_text: 'Text on the creative' },
				{ ad_id: '2', extracted_text: null },
			],
		});

		const result = (await invoke(LinkedIn.ads, {
			company_domain: 'clay.com',
			extract_text: true,
		})) as { ads?: { extracted_text?: string | null }[] };

		expect(result.ads?.[0]?.extracted_text).toBe('Text on the creative');
		expect(result.ads?.[1]?.extracted_text).toBeNull();
	});

	it('reports the ad count when extract is number_of_ads', async () => {
		respond({ total_ads: 834, ads: null, is_last_page: true });

		const result = (await invoke(LinkedIn.ads, {
			company_domain: 'clay.com',
			extract: 'number_of_ads',
		})) as {
			// unknown: null when the endpoint returns only a count.
			total_ads?: number;
			ads?: unknown;
		};

		expect(lastRequest().bodyRecord.extract).toBe('number_of_ads');
		expect(result.total_ads).toBe(834);
		expect(result.ads).toBeNull();
	});

	it('maps a 204 to an empty result', async () => {
		respondEmpty(204);

		await expect(
			invoke(LinkedIn.ads, { company_domain: 'clay.com' }),
		).resolves.toEqual({});
	});
});

describe('linkedin.keywordSearch', () => {
	it('POSTs the keyword to /linkedin-keyword-search', async () => {
		respond(linkedinKeywordSearchResponse);

		const result = (await invoke(LinkedIn.keywordSearch, {
			keyword: 'webinar',
			country: 'US',
			dateOption: 'last-30-days',
		})) as typeof linkedinKeywordSearchResponse;

		expect(lastRequest().url).toBe(
			'https://api.adyntel.com/linkedin-keyword-search',
		);
		expect(lastRequest().bodyRecord).toEqual({
			keyword: 'webinar',
			country: 'US',
			dateOption: 'last-30-days',
			...SCRAPE_CREDENTIALS,
		});
		expect(result.total_ads).toBe(834);
	});

	it('requires both dates for a custom range', async () => {
		await expect(
			invoke(LinkedIn.keywordSearch, {
				keyword: 'webinar',
				dateOption: 'custom-date-range',
				startDate: '2026-01-01',
			}),
		).rejects.toThrow(/custom-date-range/);
	});

	it('accepts a custom range with both dates', async () => {
		respond(linkedinKeywordSearchResponse);

		await invoke(LinkedIn.keywordSearch, {
			keyword: 'webinar',
			dateOption: 'custom-date-range',
			startDate: '2026-01-01',
			endDate: '2026-02-01',
		});

		expect(lastRequest().bodyRecord).toMatchObject({
			startDate: '2026-01-01',
			endDate: '2026-02-01',
		});
	});
});

// ── tiktok ────────────────────────────────────────────────────────────────

describe('tiktok.ads', () => {
	it('POSTs the domain to /tiktok and keeps brand ads and influencers', async () => {
		respond(tiktokAdsResponse);

		const result = (await invoke(TikTok.ads, {
			company_domain: 'gymshark.com',
			influencer_ads: true,
		})) as typeof tiktokAdsResponse;

		expect(lastRequest().url).toBe('https://api.adyntel.com/tiktok');
		expect(lastRequest().bodyRecord).toEqual({
			company_domain: 'gymshark.com',
			influencer_ads: true,
			...SCRAPE_CREDENTIALS,
		});
		expect(result.handle).toBe('gymshark');
		expect(result.brand_ads?.[0]?.stats?.play_count).toBe(1577611);
		expect(result.influencers?.[0]?.sample_ad?.aweme_id).toBe(
			'7683197142659271950',
		);
	});

	it('maps a 204 to an empty result, meaning the brand runs no ads', async () => {
		respondEmpty(204);

		await expect(
			invoke(TikTok.ads, { company_domain: 'no-ads.example' }),
		).resolves.toEqual({});
	});

	it('returns a job reference when a webhook is used', async () => {
		respond(jobStarted);

		const result = (await invoke(TikTok.ads, {
			company_domain: 'gymshark.com',
			webhook_url: 'https://example.com/hook',
		})) as typeof jobStarted;

		expect(result.jobId).toBe('0b0f2b8c-6f4f-45bf-aeae-4903501193hd');
	});
});

describe('tiktok.keywordSearch', () => {
	it('POSTs the keyword to /tiktok_search', async () => {
		respond(tiktokKeywordSearchResponse);

		const result = (await invoke(TikTok.keywordSearch, {
			keyword: 'toys',
			country_code: 'DE',
		})) as typeof tiktokKeywordSearchResponse;

		expect(lastRequest().url).toBe('https://api.adyntel.com/tiktok_search');
		expect(lastRequest().bodyRecord).toEqual({
			keyword: 'toys',
			country_code: 'DE',
			...SCRAPE_CREDENTIALS,
		});
		expect(result.total).toBe(1000);
		expect(result.data?.[0]?.name).toBe('Moose Toys');
	});

	it('throws on a non-zero code that arrives with a 200', async () => {
		respond(tiktokNonZeroCode, 200);

		// unknown: a rejection can be any value until toBeInstanceOf narrows it.
		const error = await invoke(TikTok.keywordSearch, {
			keyword: 'toys',
		}).catch((e: unknown) => e);

		expect(error).toBeInstanceOf(AdyntelAPIError);
		expect((error as AdyntelAPIError).message).toContain('code 40001');
		// The operationId, not the dotted event name: retries classify on it.
		expect((error as AdyntelAPIError).operation).toBe('tiktokSearch');
	});

	it('accepts code 0 as success', async () => {
		respond(tiktokKeywordSearchResponse);

		await expect(
			invoke(TikTok.keywordSearch, { keyword: 'toys' }),
		).resolves.toMatchObject({ code: 0 });
	});
});

describe('tiktok.adDetails', () => {
	it('POSTs the ad id to /tiktok_ad_details', async () => {
		respond(tiktokAdDetailsResponse);

		const result = (await invoke(TikTok.adDetails, {
			id: '1816440843906114',
		})) as typeof tiktokAdDetailsResponse;

		expect(lastRequest().url).toBe('https://api.adyntel.com/tiktok_ad_details');
		expect(lastRequest().bodyRecord).toEqual({
			id: '1816440843906114',
			...SCRAPE_CREDENTIALS,
		});
		expect(result.data?.advertiser?.registry_location).toBe('Germany');
	});

	it('keeps the targeting block without modelling it', async () => {
		respond(tiktokAdDetailsResponse);

		const result = (await invoke(TikTok.adDetails, { id: '1' })) as {
			data?: { targeting?: Record<string, unknown> };
		};

		expect(result.data?.targeting?.target_audience_size).toBe('21.9M-26.8M');
	});

	it('rejects an empty id', async () => {
		await expect(invoke(TikTok.adDetails, { id: '' })).rejects.toThrow();
	});
});

describe('tiktok keyword country support', () => {
	it('rejects US, which only the European ad library covers', async () => {
		await expect(
			invoke(TikTok.keywordSearch, { keyword: 'toys', country_code: 'US' }),
		).rejects.toThrow(/European/);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('accepts a European code', async () => {
		respond(tiktokKeywordSearchResponse);

		await invoke(TikTok.keywordSearch, { keyword: 'toys', country_code: 'de' });

		expect(lastRequest().bodyRecord.country_code).toBe('de');
	});
});

describe('TikTok provider codes', () => {
	it('marks a non-zero code as a provider rejection, not a transport failure', async () => {
		respond(tiktokNonZeroCode, 200);

		const error = (await invoke(TikTok.keywordSearch, {
			keyword: 'toys',
		}).catch((e: unknown) => e)) as AdyntelAPIError;

		expect(error.isProviderRejection).toBe(true);
		// A transport failure has no status either, so this flag is what keeps a
		// billed call from being retried as if the network had dropped.
		expect(error.status).toBeUndefined();
		expect(error.providerCode).toBe(40001);
	});

	it('names the operation the same way the client does, so retries classify', async () => {
		respond(tiktokNonZeroCode, 200);

		const error = (await invoke(TikTok.keywordSearch, {
			keyword: 'toys',
		}).catch((e: unknown) => e)) as AdyntelAPIError;

		// error-handlers.ts classifies reads by operationId, so a dotted event
		// name here would silently mark this read unretriable.
		expect(error.operation).toBe('tiktokSearch');
	});
});

// ── keywords ──────────────────────────────────────────────────────────────

describe('keywords.paidVsOrganic', () => {
	it('POSTs the domain to /domain-keywords', async () => {
		respond(paidVsOrganicResponse);

		const result = (await invoke(Keywords.paidVsOrganic, {
			company_domain: 'lokalise.com',
		})) as typeof paidVsOrganicResponse;

		expect(lastRequest().url).toBe('https://api.adyntel.com/domain-keywords');
		expect(lastRequest().bodyRecord).toEqual({
			company_domain: 'lokalise.com',
			...SCRAPE_CREDENTIALS,
		});
		expect(result.organic?.count).toBe(31721);
		expect(result.paid?.estimated_avg_cpc).toBe(5.37);
		expect(result.organic_percentages?.pos_1).toBe(1.19);
	});

	it('sends the optional language and limit', async () => {
		respond(paidVsOrganicResponse);

		await invoke(Keywords.paidVsOrganic, {
			company_domain: 'lokalise.com',
			language: 'German',
			limit: 10,
		});

		expect(lastRequest().bodyRecord).toMatchObject({
			language: 'German',
			limit: 10,
		});
	});
});

// ── shared behaviour ──────────────────────────────────────────────────────

describe('error propagation', () => {
	it('surfaces a 401 instead of parsing an empty result', async () => {
		respond(errorBody, 401);

		// unknown: a rejection can be any value until toBeInstanceOf narrows it.
		const error = await invoke(Meta.ads, {
			company_domain: 'zoom.com',
		}).catch((e: unknown) => e);

		expect(error).toBeInstanceOf(AdyntelAPIError);
		expect((error as AdyntelAPIError).status).toBe(401);
	});

	it('surfaces a 402 when the account is out of credits', async () => {
		respond({ message: 'Insufficient credits' }, 402);

		// unknown: a rejection can be any value until toBeInstanceOf narrows it.
		const error = await invoke(Google.ads, {
			company_domain: 'clay.com',
		}).catch((e: unknown) => e);

		expect((error as AdyntelAPIError).status).toBe(402);
	});
});
