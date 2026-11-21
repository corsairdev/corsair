import { logEventFromContext } from 'corsair/core';
import { Account, Email, Google, LinkedIn, Web } from './endpoints';
import { shapeScreenshotFile } from './endpoints/types';
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
	screenshotBytes,
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

// unknown: a rejection can be any value until the message check narrows it.
async function rejects(
	endpoint: AnyEndpoint,
	input: unknown,
	match: string,
): Promise<void> {
	await expect(invoke(endpoint, input)).rejects.toThrow(match);
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

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('output parsing', () => {
	it('parses a crawled HTML string', async () => {
		respond(crawledHtml);
		const html = await invoke(Web.crawler, { query: 'https://example.com' });
		expect(html).toContain('<h1>Hello</h1>');
	});

	it('parses a Google search page', async () => {
		respond(googleSearch);
		const page = (await invoke(Google.search, {
			query: 'best electric cars 2024',
		})) as {
			organic_results?: Array<{ title?: string }>;
			pagination?: { has_next_page?: boolean };
		};
		expect(page.organic_results?.[0]?.title).toBe('Best electric cars of 2024');
		expect(page.pagination?.has_next_page).toBe(true);
	});

	it('parses autocomplete suggestions', async () => {
		respond(autocomplete);
		const result = (await invoke(Google.searchAutocomplete, {
			query: 'coff',
		})) as { suggestions?: Array<{ value?: string }> };
		expect(result.suggestions?.[0]?.value).toBe('coffee near me');
	});

	it('parses a news page with dates', async () => {
		respond(googleNews);
		const page = (await invoke(Google.news, {
			query: 'artificial intelligence',
		})) as { organic_results?: Array<{ date?: string }> };
		expect(page.organic_results?.[0]?.date).toBe('3 hours ago');
	});

	it('parses a LinkedIn company', async () => {
		respond(linkedinCompany);
		const company = (await invoke(LinkedIn.companyInfo, {
			domain: 'ferrari.com',
		})) as { company_name?: string; headquarter?: { city?: string } };
		expect(company.company_name).toBe('Ferrari');
		expect(company.headquarter?.city).toBe('Maranello');
	});

	it('parses a LinkedIn profile', async () => {
		respond(linkedinProfile);
		const profile = (await invoke(LinkedIn.profileInfo, {
			query: 'example-user',
			// unknown: provider-shaped or untyped until a schema narrows it; no stricter type fits.
		})) as { full_name?: string; experiences?: unknown[] };
		expect(profile.full_name).toBe('Alex Martin');
		expect(profile.experiences).toHaveLength(1);
	});

	it('parses a LinkedIn job and job search', async () => {
		respond(linkedinJob);
		const job = (await invoke(LinkedIn.jobInfo, {
			query: '4390885746',
		})) as { seniority_level?: string };
		expect(job.seniority_level).toBe('Mid-Senior level');

		respond(linkedinJobSearch);
		const page = (await invoke(LinkedIn.jobSearch, {
			keyword: 'engineer',
		})) as { results?: Array<{ id?: number }> };
		expect(page.results?.[0]?.id).toBe(4390885746);
	});

	it('parses a LinkedIn post', async () => {
		respond(linkedinPost);
		const post = (await invoke(LinkedIn.postInfo, {
			query: '7027826235833520128',
			// unknown: provider-shaped or untyped until a schema narrows it; no stricter type fits.
		})) as { comments?: unknown[] };
		expect(post.comments).toHaveLength(1);
	});

	it('parses email finder, verify and analyzes answers', async () => {
		respond(emailFound);
		const found = (await invoke(Email.finder, {
			query: 'Alex Martin',
			companyDomain: 'example.com',
		})) as { email?: string; status?: string };
		expect(found.email).toBe('alex.martin@example.com');

		respond(emailVerified);
		const verified = (await invoke(Email.verify, {
			query: 'alex.martin@example.com',
		})) as { status?: string };
		expect(verified.status).toBe('valid');

		respond(emailAnalyzed);
		const analyzed = (await invoke(Email.analyzes, {
			query: 'example.com',
		})) as { is_microsoft_365?: boolean };
		expect(analyzed.is_microsoft_365).toBe(true);
	});

	it('parses the usage answer', async () => {
		respond(usage);
		const result = (await invoke(Account.usage, {})) as {
			remaining?: number;
			credits?: { remaining?: number };
		};
		expect(result.remaining).toBe(450);
		expect(result.credits?.remaining).toBe(500);
	});

	it('parses a completed job', async () => {
		respond(jobCompleted);
		const job = (await invoke(Account.getJob, { id: 'abc123' })) as {
			status?: string;
			// unknown: provider-shaped or untyped until a schema narrows it; no stricter type fits.
			result?: unknown;
		};
		expect(job.status).toBe('CompletedJob');
		expect(job.result).toContain('done');
	});

	it('shapes a binary screenshot into the file contract', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response(new Uint8Array(screenshotBytes().bytes), {
				status: 200,
				headers: { 'Content-Type': 'image/png' },
			}),
		);
		const file = (await invoke(Web.screenshot, {
			url: 'https://example.com',
		})) as { contentType?: string; fileContent?: string };
		expect(file.contentType).toBe('image/png');
		expect(file.fileContent).toBe(
			Buffer.from(screenshotBytes().bytes).toString('base64'),
		);
	});
});

describe('shapeScreenshotFile', () => {
	it('passes plain-text answers through for the schema to reject', () => {
		expect(shapeScreenshotFile('not a screenshot')).toBe('not a screenshot');
		// An empty body or an HTML error page is not turned into a file.
		const empty = { bytes: new Uint8Array(), contentType: 'image/png' };
		expect(shapeScreenshotFile(empty)).toBe(empty);
		const page = {
			bytes: new TextEncoder().encode('<html>error</html>'),
			contentType: 'text/html; charset=utf-8',
		};
		expect(shapeScreenshotFile(page)).toBe(page);
	});

	it('encodes binary bytes as base64', () => {
		const shaped = shapeScreenshotFile(screenshotBytes()) as {
			fileContent: string;
			contentType: string;
		};
		expect(shaped.contentType).toBe('image/png');
		expect(shaped.fileContent).toBe(
			Buffer.from(screenshotBytes().bytes).toString('base64'),
		);
	});
});

describe('input validation', () => {
	it('rejects blank company identifiers', async () => {
		await rejects(LinkedIn.companyInfo, { domain: '  ' }, 'Too small');
		await rejects(
			Email.finder,
			{ query: 'Alex Martin', companyName: '' },
			'Too small',
		);
	});

	it('rejects a crawler call without a query', async () => {
		await rejects(Web.crawler, {}, 'query');
	});

	it('rejects a Google search without a query', async () => {
		await rejects(Google.search, {}, 'query');
	});

	it('rejects a company info call with neither query nor domain', async () => {
		await rejects(LinkedIn.companyInfo, {}, 'Exactly one');
	});

	it('rejects a company info call with both query and domain', async () => {
		await rejects(
			LinkedIn.companyInfo,
			{ query: 'ferrari', domain: 'ferrari.com' },
			'Exactly one',
		);
	});

	it('rejects an email finder without company context', async () => {
		await rejects(Email.finder, { query: 'Alex Martin' }, 'At least one');
	});

	it('rejects a job search distance the docs do not list', async () => {
		await rejects(LinkedIn.jobSearch, { distance: 15 }, 'distance');
	});

	it('rejects a job search flexibility the docs do not list', async () => {
		await rejects(
			LinkedIn.jobSearch,
			{ flexibility: 'hybrid_remote' },
			'flexibility',
		);
	});

	it('rejects a screenshot format the docs do not list', async () => {
		await rejects(
			Web.screenshot,
			{ url: 'https://example.com', format: 'gif' },
			'format',
		);
	});

	it('rejects a job poll without an id', async () => {
		await rejects(Account.getJob, {}, 'id');
	});

	it('rejects a technology mode the docs do not list', async () => {
		await rejects(
			Web.technology,
			{ query: 'https://example.com', mode: 'debug' },
			'mode',
		);
	});
});
