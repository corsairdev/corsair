import { scrapedo } from './index';
import {
	ACCOUNT_INFO_BODY,
	ASYNC_ACCOUNT_BODY,
	HTML_BODY,
	JOB_CANCELED_BODY,
	JOB_CREATED_BODY,
	JOB_QUEUED_BODY,
	JOB_SUCCESS_BODY,
	JOBS_LIST_BODY,
	JSON_BODY,
	MARKDOWN_BODY,
	SCREENSHOT_BODY,
	TASK_RESULT_BODY,
} from './test-fixtures';
import {
	fetchCallCount,
	installFetchMock,
	makeCtx,
	respond,
	restoreFetchMock,
	sentBody,
	sentHeaders,
	sentMethod,
	sentQuery,
	sentUrl,
} from './test-helpers';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn().mockResolvedValue('evt') };
});

function endpoints() {
	const tree = scrapedo({ key: 'sd-test-token' }).endpoints;
	if (!tree) throw new Error('the plugin registers no endpoints');
	return tree;
}

beforeEach(installFetchMock);
afterEach(restoreFetchMock);

describe('scrape.html', () => {
	it('sends the token and url to the scrape host and returns the page', async () => {
		respond(HTML_BODY);

		const result = await endpoints().scrape.html(makeCtx(), {
			url: 'https://example.com/',
		});

		expect(sentUrl().origin + sentUrl().pathname).toBe(
			'https://api.scrape.do/',
		);
		expect(sentQuery().get('token')).toBe('sd-test-token');
		expect(sentQuery().get('url')).toBe('https://example.com/');
		expect(sentMethod()).toBe('GET');
		expect(result.html).toBe(HTML_BODY);
		expect(result.status_code).toBe(200);
	});

	it('sends only the url and no option it was not given', async () => {
		respond(HTML_BODY);

		await endpoints().scrape.html(makeCtx(), { url: 'https://example.com/' });

		// token and url only: the provider's own defaults apply to everything else.
		expect([...sentQuery().keys()].sort()).toEqual(['token', 'url']);
	});

	it('sends every proxy and browser option it was given', async () => {
		respond(HTML_BODY);

		await endpoints().scrape.html(makeCtx(), {
			url: 'https://example.com/',
			super: true,
			geoCode: 'de',
			regionalGeoCode: 'europe',
			sessionId: 42,
			setCookies: 'a=1; b=2',
			disableRedirection: true,
			timeout: 30_000,
			disableRetry: true,
			render: true,
			device: 'mobile',
			width: 1280,
			height: 720,
			blockResources: false,
			transparentResponse: true,
			waitUntil: 'networkidle',
			customWait: 1500,
			waitSelector: '#app',
			output: 'raw',
		});

		expect(sentQuery().get('super')).toBe('true');
		expect(sentQuery().get('geoCode')).toBe('de');
		expect(sentQuery().get('regionalGeoCode')).toBe('europe');
		expect(sentQuery().get('sessionId')).toBe('42');
		expect(sentQuery().get('setCookies')).toBe('a=1; b=2');
		expect(sentQuery().get('disableRedirection')).toBe('true');
		expect(sentQuery().get('timeout')).toBe('30000');
		expect(sentQuery().get('disableRetry')).toBe('true');
		expect(sentQuery().get('render')).toBe('true');
		expect(sentQuery().get('device')).toBe('mobile');
		expect(sentQuery().get('width')).toBe('1280');
		expect(sentQuery().get('height')).toBe('720');
		expect(sentQuery().get('blockResources')).toBe('false');
		expect(sentQuery().get('transparentResponse')).toBe('true');
		expect(sentQuery().get('waitUntil')).toBe('networkidle');
		expect(sentQuery().get('customWait')).toBe('1500');
		expect(sentQuery().get('waitSelector')).toBe('#app');
		expect(sentQuery().get('output')).toBe('raw');
	});

	it('reports a target 404 as a result, since the page comes back and is charged', async () => {
		respond(HTML_BODY, 404);

		const result = await endpoints().scrape.html(makeCtx(), {
			url: 'https://example.com/missing',
		});

		expect(result.status_code).toBe(404);
		expect(result.html).toBe(HTML_BODY);
	});
});

describe('scrape.markdown', () => {
	it('asks for markdown output and returns it', async () => {
		respond(MARKDOWN_BODY);

		const result = await endpoints().scrape.markdown(makeCtx(), {
			url: 'https://example.com/',
		});

		expect(sentQuery().get('output')).toBe('markdown');
		expect(result.markdown).toContain('- Title: Example Domain');
		expect(result.status_code).toBe(200);
	});
});

describe('scrape.json', () => {
	it('asks for the JSON answer and renames its fields', async () => {
		respond(JSON_BODY);

		const result = await endpoints().scrape.json(makeCtx(), {
			url: 'https://example.com/',
			render: true,
			showFrames: true,
		});

		expect(sentQuery().get('returnJSON')).toBe('true');
		expect(sentQuery().get('showFrames')).toBe('true');
		expect(result.status_code).toBe(200);
		expect(result.content).toBe(HTML_BODY);
		expect(result.network_requests[0]?.url).toBe(
			'https://example.com/api/items',
		);
	});

	it('returns the iframe content when showFrames is set', async () => {
		respond({
			...JSON_BODY,
			frames: [{ url: 'https://example.com/frame', content: '<p>in frame</p>' }],
		});

		const result = await endpoints().scrape.json(makeCtx(), {
			url: 'https://example.com/',
			render: true,
			showFrames: true,
		});

		expect(result.frames).toEqual([
			{ url: 'https://example.com/frame', content: '<p>in frame</p>' },
		]);
	});
});

describe('scrape.screenshot', () => {
	it('always sets returnJSON, which the API requires for a screenshot', async () => {
		respond(SCREENSHOT_BODY);

		const result = await endpoints().scrape.screenshot(makeCtx(), {
			url: 'https://example.com/',
			render: true,
		});

		// The live API answers 400 for screenShot without returnJSON.
		expect(sentQuery().get('returnJSON')).toBe('true');
		expect(sentQuery().get('screenShot')).toBe('true');
		expect(result.screenshots).toEqual([SCREENSHOT_BODY.screenShots[0]?.image]);
	});

	it('reports a screenshot the provider could not take', async () => {
		respond({
			...SCREENSHOT_BODY,
			screenShots: [{ type: 'ScreenShot', image: '', error: 'capture failed' }],
		});

		await expect(
			endpoints().scrape.screenshot(makeCtx(), {
				url: 'https://example.com/',
				render: true,
			}),
		).rejects.toThrow(/capture failed/);
	});

	it('fails when the answer holds no image and no per-shot error', async () => {
		for (const screenShots of [undefined, [], [{ type: 'ScreenShot' }]]) {
			respond({ ...SCREENSHOT_BODY, screenShots });

			await expect(
				endpoints().scrape.screenshot(makeCtx(), {
					url: 'https://example.com/',
					render: true,
				}),
			).rejects.toThrow(/no image/);
		}
	});

	it('asks for the full page when fullPage is set', async () => {
		respond(SCREENSHOT_BODY);

		await endpoints().scrape.screenshot(makeCtx(), {
			url: 'https://example.com/',
			render: true,
			fullPage: true,
		});

		expect(sentQuery().get('fullScreenShot')).toBe('true');
		expect(sentQuery().has('screenShot')).toBe(false);
	});

	it('sends the element selector as particularScreenShot', async () => {
		respond(SCREENSHOT_BODY);

		await endpoints().scrape.screenshot(makeCtx(), {
			url: 'https://example.com/',
			render: true,
			selector: '#price-table',
		});

		// Scrape.do takes a CSS selector here, not pixel coordinates.
		expect(sentQuery().get('particularScreenShot')).toBe('#price-table');
		expect(sentQuery().has('screenShot')).toBe(false);
	});
});

describe('account.info', () => {
	it('reads the subscription state', async () => {
		respond(ACCOUNT_INFO_BODY);

		const result = await endpoints().account.info(makeCtx(), {});

		expect(sentUrl().pathname).toBe('/info');
		expect(result.is_active).toBe(true);
		expect(result.remaining_monthly_request).toBe(998);
	});
});

describe('account.asyncInfo', () => {
	it('reads the async pool and translates the provider typo', async () => {
		respond(ASYNC_ACCOUNT_BODY);

		const result = await endpoints().account.asyncInfo(makeCtx(), {});

		expect(sentUrl().origin).toBe('https://q.scrape.do');
		expect(sentUrl().pathname).toBe('/api/v1/me');
		// The async API authenticates with a header, not the query.
		expect(sentHeaders().get('X-Token')).toBe('sd-test-token');
		expect(sentQuery().has('token')).toBe(false);
		// `AvaliableCredits` in the answer, `available_credits` in the result.
		expect(result.available_credits).toBe(991);
		expect(result.free_concurrency).toBe(2);
	});
});

describe('jobs.start', () => {
	it('posts the targets and returns the job and task ids', async () => {
		respond(JOB_CREATED_BODY);

		const result = await endpoints().jobs.start(makeCtx(), {
			targets: ['https://example.com'],
		});

		expect(sentUrl().origin + sentUrl().pathname).toBe(
			'https://q.scrape.do/api/v1/jobs',
		);
		expect(sentMethod()).toBe('POST');
		expect(sentBody()).toMatchObject({ Targets: ['https://example.com'] });
		expect(result.job_id).toBe(JOB_CREATED_BODY.JobID);
		expect(result.task_ids).toEqual(JOB_CREATED_BODY.TaskIDs);
	});

	it('sends the proxy and render options under the provider names', async () => {
		respond(JOB_CREATED_BODY);

		await endpoints().jobs.start(makeCtx(), {
			targets: ['https://a.example', 'https://b.example'],
			super: true,
			geoCode: 'us',
			render: true,
			webhookUrl: 'https://hook.example/cb',
		});

		expect(sentBody()).toMatchObject({
			Targets: ['https://a.example', 'https://b.example'],
			Super: true,
			GeoCode: 'us',
			Render: true,
			WebhookURL: 'https://hook.example/cb',
		});
	});
});

describe('jobs.get', () => {
	it('reports a queued job with rotating tasks', async () => {
		respond(JOB_QUEUED_BODY);

		const result = await endpoints().jobs.get(makeCtx(), {
			jobId: 'fd25d2c8-0761-4d36-9ce8-904b6aed98e5',
		});

		expect(sentUrl().pathname).toBe(
			'/api/v1/jobs/fd25d2c8-0761-4d36-9ce8-904b6aed98e5',
		);
		expect(result.status).toBe('queued');
		expect(result.tasks.map((t) => t.status)).toEqual(['rotating', 'rotating']);
	});

	it('reports a finished job', async () => {
		respond(JOB_SUCCESS_BODY);

		const result = await endpoints().jobs.get(makeCtx(), { jobId: 'abc' });

		expect(result.status).toBe('success');
		expect(result.tasks[0]?.status).toBe('success');
	});
});

describe('jobs.result', () => {
	it('returns the task content and its status', async () => {
		respond(TASK_RESULT_BODY);

		const result = await endpoints().jobs.result(makeCtx(), {
			jobId: TASK_RESULT_BODY.JobID,
			taskId: TASK_RESULT_BODY.TaskID,
		});

		expect(sentUrl().pathname).toBe(
			`/api/v1/jobs/${TASK_RESULT_BODY.JobID}/${TASK_RESULT_BODY.TaskID}`,
		);
		expect(result.status).toBe('success');
		expect(result.status_code).toBe(200);
		expect(result.content).toBe(HTML_BODY);
		expect(result.base64_encoded).toBe(false);
	});
});

describe('jobs.cancel', () => {
	it('deletes the job and reports canceled', async () => {
		respond(JOB_CANCELED_BODY);

		const result = await endpoints().jobs.cancel(makeCtx(), { jobId: 'abc' });

		expect(sentMethod()).toBe('DELETE');
		expect(sentUrl().pathname).toBe('/api/v1/jobs/abc');
		expect(result.status).toBe('canceled');
	});
});

describe('jobs.list', () => {
	it('lists jobs with their paging', async () => {
		respond(JOBS_LIST_BODY);

		const result = await endpoints().jobs.list(makeCtx(), {
			pageSize: 10,
			pageNumber: 2,
		});

		expect(sentUrl().pathname).toBe('/api/v1/jobs');
		// The live API ignores `pageSize`/`pageNumber` and answers 10 per page;
		// it reads the documented `page_size` and `page`.
		expect(sentQuery().get('page_size')).toBe('10');
		expect(sentQuery().get('page')).toBe('2');
		expect(sentQuery().has('pageSize')).toBe(false);
		expect(result.jobs).toHaveLength(1);
		expect(result.total_count).toBe(1);
	});

	it('accepts an empty list', async () => {
		respond({
			Jobs: [],
			TotalCount: 0,
			PageSize: 10,
			PageNumber: 1,
			TotalPages: 0,
		});

		const result = await endpoints().jobs.list(makeCtx(), {});

		expect(result.jobs).toEqual([]);
		expect(result.total_pages).toBe(0);
	});
});

describe('one request per call', () => {
	it('does not retry inside the client', async () => {
		respond(HTML_BODY);

		await endpoints().scrape.html(makeCtx(), { url: 'https://example.com/' });

		expect(fetchCallCount()).toBe(1);
	});
});

describe('browser wait options on the Markdown route', () => {
	it('sends waitUntil, which the schema now accepts on every scrape route', async () => {
		respond(MARKDOWN_BODY);

		// The published example uses this, and Greptile caught that the schema
		// did not accept it: TypeScript rejected the example and JavaScript
		// silently dropped the field.
		await endpoints().scrape.markdown(makeCtx(), {
			url: 'https://example.com/',
			render: true,
			waitUntil: 'networkidle',
		});

		expect(sentQuery().get('waitUntil')).toBe('networkidle');
	});

	it('sends the wait options on the JSON and screenshot routes too', async () => {
		respond(JSON_BODY);
		await endpoints().scrape.json(makeCtx(), {
			url: 'https://example.com/',
			render: true,
			customWait: 750,
			waitSelector: '#main',
		});
		expect(sentQuery().get('customWait')).toBe('750');
		expect(sentQuery().get('waitSelector')).toBe('#main');

		respond(SCREENSHOT_BODY);
		await endpoints().scrape.screenshot(makeCtx(), {
			url: 'https://example.com/',
			render: true,
			waitUntil: 'load',
		});
		expect(sentQuery().get('waitUntil')).toBe('load');
	});
});
