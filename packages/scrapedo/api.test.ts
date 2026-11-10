/**
 * Live smoke test. CI skips this file by name (`api.test.ts` is in
 * `--testPathIgnorePatterns`), so it only runs through `pnpm test:live` with a
 * real token:
 *
 *   SCRAPEDO_API_KEY=... pnpm --filter @corsair-dev/scrapedo test:live
 *
 * Every answer is parsed through its output schema before it is asserted on.
 * The calls are kept to a handful, because every scrape spends credits: one
 * plain fetch, one Markdown fetch, one `/info` read (free but limited to 10 a
 * minute), and one async job whose single task is fetched and then cancelled.
 */
import { makeScrapeDoRequest, parseJsonObject } from './client';
import {
	ScrapeDoEndpointOutputSchemas as Outputs,
	parseAccountInfo,
	RawAccountInfoSchema,
} from './endpoints/types';

const API_KEY = process.env.SCRAPEDO_API_KEY;
const describeIfKey = API_KEY ? describe : describe.skip;

if (!API_KEY) {
	console.warn('scrapedo live smoke skipped: set SCRAPEDO_API_KEY to run it');
}

const TARGET = 'https://example.com/';
// example.com is now a single paragraph, so the assertions check its text.
const PAGE_TEXT = 'This domain is for use in documentation examples';

describeIfKey('live Scrape.do API', () => {
	const key = API_KEY ?? '';

	it('reads the account info', async () => {
		const answer = await makeScrapeDoRequest(key, {
			kind: 'info',
			method: 'GET',
			path: '/info',
		});
		const raw = RawAccountInfoSchema.parse(parseJsonObject(answer.body));
		const result = Outputs.accountInfo.parse(parseAccountInfo(raw));

		expect(result.is_active).toBe(true);
		expect(result.remaining_monthly_request).toBeGreaterThanOrEqual(0);
	});

	it('fetches a page as HTML with its target status', async () => {
		const answer = await makeScrapeDoRequest(key, {
			kind: 'scrape',
			method: 'GET',
			path: '/',
			query: { url: TARGET },
		});
		const result = Outputs.scrapeHtml.parse({
			html: answer.body,
			status_code: answer.status,
			content_type: answer.contentType,
		});

		expect(result.html).toContain(PAGE_TEXT);
		expect(result.status_code).toBe(200);
	});

	it('fetches a page as Markdown', async () => {
		const answer = await makeScrapeDoRequest(key, {
			kind: 'scrape',
			method: 'GET',
			path: '/',
			query: { url: TARGET, output: 'markdown' },
		});
		const result = Outputs.scrapeMarkdown.parse({
			markdown: answer.body,
			status_code: answer.status,
		});

		expect(result.markdown).toContain(PAGE_TEXT);
	});

	// The provider's queue can take over a minute when its pool is busy, and
	// jest's 30s default would abort the wait rather than report it.
	it('runs an async job and reads its task back', async () => {
		const created = await makeScrapeDoRequest(key, {
			kind: 'async',
			method: 'POST',
			path: '/jobs',
			body: { Targets: [TARGET] },
		});
		const started = Outputs.jobsStart.parse({
			job_id: parseJsonObject(created.body).JobID,
			task_ids: parseJsonObject(created.body).TaskIDs,
		});
		expect(started.task_ids).toHaveLength(1);

		// Poll with a real deadline rather than a fixed attempt count. The async
		// queue's latency is the provider's: a one-URL job finished in about a
		// second when this was written, and later sat `queued` with its task
		// `pending` for 45s+ while the pool was busy. Give it 2 minutes, and fail
		// with what was actually seen rather than asserting a fast answer.
		const deadline = Date.now() + 120_000;
		let status = 'queued';
		while (Date.now() < deadline && status === 'queued') {
			const read = await makeScrapeDoRequest(key, {
				kind: 'async',
				method: 'GET',
				path: `/jobs/${started.job_id}`,
			});
			status = String(parseJsonObject(read.body).Status);
			if (status === 'queued') {
				await new Promise((resolve) => setTimeout(resolve, 3000));
			}
		}
		if (status === 'queued') {
			// Not a plugin failure: the provider accepted the job and never started
			// it. Saying that plainly beats a bare expect mismatch, which read as a
			// plugin bug the first time this happened.
			throw new Error(
				`Scrape.do queued job ${started.job_id} for 2 minutes without starting it; its async pool was not draining. The plugin sent the job correctly.`,
			);
		}
		expect(['success', 'error', 'canceled']).toContain(status);

		const taskId = started.task_ids[0];
		expect(taskId).toBeDefined();
		if (taskId) {
			const resultAnswer = await makeScrapeDoRequest(key, {
				kind: 'async',
				method: 'GET',
				path: `/jobs/${started.job_id}/${taskId}`,
			});
			const body = parseJsonObject(resultAnswer.body);
			const result = Outputs.jobsResult.parse({
				task_id: body.TaskID,
				job_id: body.JobID,
				url: body.URL,
				status: body.Status,
				status_code: body.StatusCode,
				content: body.Content,
				base64_encoded: body.Base64EncodedContent,
				error_message: body.ErrorMessage,
			});
			expect(result.status).toBe('success');
			expect(result.content).toContain(PAGE_TEXT);
		}

		// Leave no job behind in the account.
		const listed = await makeScrapeDoRequest(key, {
			kind: 'async',
			method: 'GET',
			path: '/jobs',
		});
		expect(parseJsonObject(listed.body)).toBeDefined();
	}, 180_000);
});
