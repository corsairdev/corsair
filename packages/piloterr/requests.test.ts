import { logEventFromContext } from 'corsair/core';
import { Account, Email, Google, LinkedIn, Web } from './endpoints';
import {
	autocomplete,
	crawledHtml,
	emailAnalyzed,
	emailFound,
	emailVerified,
	googleNews,
	googleSearch,
	jobCompleted,
	linkedinCompany,
	linkedinJob,
	linkedinJobSearch,
	linkedinPost,
	linkedinProfile,
	usage,
} from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const KEY = 'pt-test-key';

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant.
// unknown: each endpoint returns its own output type, so the shared return
// has no narrower type.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>;

// unknown: negative cases pass values no schema accepts.
function invoke(endpoint: AnyEndpoint, input: unknown) {
	return endpoint({ key: KEY, options: {} } as never, input as never);
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON.
function respond(body: unknown, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(typeof body === 'string' ? body : JSON.stringify(body), {
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

function expectCall(expected: Partial<ReturnType<typeof lastRequest>>) {
	const sent = lastRequest();
	for (const [key, value] of Object.entries(expected)) {
		expect(sent[key as keyof typeof sent]).toEqual(value);
	}
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('web', () => {
	it('crawler unwraps the { return } object returnPageSource answers (live)', async () => {
		respond({ return: '<html>source</html>' });
		const html = await invoke(Web.crawler, {
			query: 'https://example.com',
			returnPageSource: true,
		});
		expect(html).toBe('<html>source</html>');
	});

	it('crawler sends the query and toggles', async () => {
		respond(crawledHtml);
		await invoke(Web.crawler, {
			query: 'https://example.com',
			allowRedirects: false,
			returnPageSource: true,
			fields: 'result',
		});
		expectCall({
			origin: 'https://api.piloterr.com',
			path: '/v2/website/crawler',
			query: {
				query: 'https://example.com',
				allow_redirects: 'false',
				return_page_source: 'true',
				fields: 'result',
			},
			method: 'GET',
		});
		expect(lastRequest().headers.get('x-api-key')).toBe(KEY);
	});

	it('rendering sends the wait selector', async () => {
		respond(crawledHtml);
		await invoke(Web.rendering, {
			query: 'https://example.com',
			waitFor: '#content',
			waitInSeconds: 3,
			blockAds: true,
			timeout: 30,
		});
		expectCall({
			path: '/v2/website/rendering',
			query: {
				query: 'https://example.com',
				wait_for: '#content',
				wait_in_seconds: '3',
				block_ads: 'true',
				timeout: '30',
			},
		});
	});

	it('screenshot sends the capture options', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response(new Uint8Array([1, 2, 3]), {
				status: 200,
				headers: { 'Content-Type': 'image/webp' },
			}),
		);
		await invoke(Web.screenshot, {
			url: 'https://example.com',
			format: 'webp',
			fullPage: true,
			viewportWidth: 1440,
			viewportHeight: 900,
			removeCookieBanners: true,
			delay: 2,
		});
		expectCall({
			path: '/v2/website/screenshot',
			query: {
				url: 'https://example.com',
				format: 'webp',
				full_page: 'true',
				viewport_width: '1440',
				viewport_height: '900',
				remove_cookie_banners: 'true',
				delay: '2',
			},
		});
	});

	it('technology sends the mode', async () => {
		respond({ cms: 'WordPress', technologies: ['React'], urls: {} });
		await invoke(Web.technology, {
			query: 'https://example.com',
			mode: 'simple',
		});
		expectCall({
			path: '/v2/website/technology',
			query: { query: 'https://example.com', mode: 'simple' },
		});
	});

	it('email phone extractor sends the country code', async () => {
		respond({ emails: ['a@example.com'] });
		const extracted = (await invoke(Web.emailPhoneExtractor, {
			query: 'https://example.com',
			countryCode: 'FR',
		})) as { emails?: string[] };
		expect(extracted.emails).toEqual(['a@example.com']);
		expectCall({
			path: '/v2/website/email_phone_extractor',
			query: { query: 'https://example.com', country_code: 'FR' },
		});
	});

	it('webunlocker hits the unlocker route', async () => {
		respond(crawledHtml);
		await invoke(Web.webunlocker, { query: 'https://www.example-blocked.com' });
		expectCall({ path: '/v2/website/webunlocker' });
	});
});

describe('google', () => {
	it('search sends the query with location and paging', async () => {
		respond(googleSearch);
		await invoke(Google.search, {
			query: 'best electric cars 2024',
			tbs: 'qdr:w',
			location: 'New York, NY',
			googleDomain: 'google.com',
			gl: 'us',
			hl: 'en',
			page: 2,
		});
		expectCall({
			path: '/v2/google/search',
			query: {
				query: 'best electric cars 2024',
				tbs: 'qdr:w',
				location: 'New York, NY',
				google_domain: 'google.com',
				gl: 'us',
				hl: 'en',
				page: '2',
			},
		});
	});

	it('autocomplete sends the cursor position', async () => {
		respond(autocomplete);
		await invoke(Google.searchAutocomplete, { query: 'coff', cp: 4 });
		expectCall({
			path: '/v2/google/search/autocomplete',
			query: { query: 'coff', cp: '4' },
		});
	});

	it('news hits the news route', async () => {
		respond(googleNews);
		await invoke(Google.news, { query: 'artificial intelligence' });
		expectCall({
			path: '/v2/google/news',
			query: { query: 'artificial intelligence' },
		});
	});
});

describe('linkedin', () => {
	it('company info sends the domain for reverse lookup', async () => {
		respond(linkedinCompany);
		await invoke(LinkedIn.companyInfo, { domain: 'guideflow.com' });
		expectCall({
			path: '/v2/linkedin/company/info',
			query: { domain: 'guideflow.com' },
		});
	});

	it('job search sends the filters', async () => {
		respond(linkedinJobSearch);
		await invoke(LinkedIn.jobSearch, {
			keyword: 'engineer',
			experienceLevel: 'mid_senior',
			jobType: 'full_time',
			when: 'week',
			flexibility: 'remote',
			geoId: '105073465',
			page: 1,
		});
		expectCall({
			path: '/v2/linkedin/job/search',
			query: {
				keyword: 'engineer',
				experience_level: 'mid_senior',
				job_type: 'full_time',
				when: 'week',
				flexibility: 'remote',
				geo_id: '105073465',
				page: '1',
			},
		});
	});

	it('job search tolerates fields filtering the results away', async () => {
		respond({ pagination: { current: 1 } });
		const page = (await invoke(LinkedIn.jobSearch, {
			keyword: 'engineer',
			fields: 'pagination',
		})) as { results?: unknown[] }; // unknown: only the missing results matter here
		expect(page.results).toBeUndefined();
	});

	it('job search accepts the bare array the live API answers', async () => {
		respond([
			{
				id: 4464364707,
				url: 'https://www.linkedin.com/jobs/view/4464364707',
				title: 'Software Engineer - DevRel',
				location: 'London Area, United Kingdom',
			},
		]);
		const page = (await invoke(LinkedIn.jobSearch, {
			keyword: 'developer relations',
		})) as { results: { id?: number }[] };
		expect(page.results).toHaveLength(1);
		expect(page.results[0]?.id).toBe(4464364707);
	});

	it('email verify accepts catch_all, which the live API answers', async () => {
		respond({ email: 'alex.martin@example.com', status: 'catch_all' });
		const result = (await invoke(Email.verify, {
			query: 'alex.martin@example.com',
		})) as { status?: string };
		expect(result.status).toBe('catch_all');
	});

	it('profile info keeps the person out of the event log (R8)', async () => {
		respond(linkedinProfile);
		await invoke(LinkedIn.profileInfo, {
			query: 'https://www.linkedin.com/in/example-user',
		});
		const logged = JSON.stringify(mockLog.mock.calls.at(-1)?.[2]);
		expect(logged).toBe('{"found":true}');
	});

	it('profile, job and post info send the query', async () => {
		respond(linkedinProfile);
		await invoke(LinkedIn.profileInfo, {
			query: 'https://www.linkedin.com/in/example-user',
		});
		expectCall({
			path: '/v2/linkedin/profile/info',
			query: { query: 'https://www.linkedin.com/in/example-user' },
		});

		respond(linkedinJob);
		await invoke(LinkedIn.jobInfo, {
			query: 'https://www.linkedin.com/jobs/view/4390885746',
		});
		expectCall({ path: '/v2/linkedin/job/info' });

		respond(linkedinPost);
		await invoke(LinkedIn.postInfo, { query: '7027826235833520128' });
		expectCall({
			path: '/v2/linkedin/post/info',
			query: { query: '7027826235833520128' },
		});
	});
});

describe('email', () => {
	it('finder sends name and domain', async () => {
		respond(emailFound);
		await invoke(Email.finder, {
			query: 'Alex Martin',
			companyDomain: 'example.com',
		});
		expectCall({
			path: '/v2/email/finder',
			query: { query: 'Alex Martin', company_domain: 'example.com' },
		});
		// R8: the found address never reaches the event log.
		const logged = JSON.stringify(mockLog.mock.calls.at(-1));
		expect(logged).not.toContain('@');
		expect(logged).toContain('"found":true');
	});

	it('verify and analyzes hit their routes', async () => {
		respond(emailVerified);
		await invoke(Email.verify, { query: 'alex.martin@example.com' });
		expectCall({
			path: '/v2/email/verify',
			query: { query: 'alex.martin@example.com' },
		});

		respond(emailAnalyzed);
		await invoke(Email.analyzes, { query: 'example.com' });
		expectCall({
			path: '/v2/email/analyzes',
			query: { query: 'example.com' },
		});
	});
});

describe('account', () => {
	it('usage hits the free usage route', async () => {
		respond(usage);
		await invoke(Account.usage, {});
		expectCall({ path: '/v2/usage', method: 'GET' });
	});

	it('getJob polls the job route by id', async () => {
		respond(jobCompleted);
		const job = (await invoke(Account.getJob, { id: 'abc123' })) as {
			status?: string;
		};
		expect(job.status).toBe('CompletedJob');
		expectCall({
			path: '/v1/jobs/abc123',
			method: 'GET',
		});
	});
});
