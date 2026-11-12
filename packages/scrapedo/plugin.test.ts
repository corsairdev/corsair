import { AuthMissingError } from 'corsair/core';
import { ScrapeDoAPIError } from './client';
import type {
	AccountInfoResponse,
	AsyncAccountResponse,
	JobsGetResponse,
	JobsListResponse,
	JobsResultResponse,
	ScrapeHtmlResponse,
	ScrapeJsonResponse,
	ScrapeScreenshotResponse,
} from './endpoints/types';
import {
	ScrapeDoEndpointOutputSchemas as Outputs,
	parseAccountInfo,
	RawAccountInfoSchema,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import type { ScrapeDoKeyBuilderContext } from './index';
import { scrapeDoEndpointSchemas, scrapedo } from './index';
import {
	ACCOUNT_INFO_BODY,
	ACCOUNT_INFO_INACTIVE_BODY,
	ASYNC_ACCOUNT_BODY,
	HTML_BODY,
	JOB_CANCELED_BODY,
	JOB_FAILED_BODY,
	JOB_QUEUED_BODY,
	JOB_SUCCESS_BODY,
	JOBS_LIST_BODY,
	JSON_BODY,
	SCREENSHOT_BODY,
	TASK_RESULT_BODY,
} from './test-fixtures';

const OPERATIONS = [
	'account.asyncInfo',
	'account.info',
	'jobs.cancel',
	'jobs.get',
	'jobs.list',
	'jobs.result',
	'jobs.start',
	'scrape.html',
	'scrape.json',
	'scrape.markdown',
	'scrape.screenshot',
] as const;

type EndpointMeta = {
	riskLevel: string;
	description?: string;
	irreversible?: boolean;
	// unknown: the job entry is only checked for presence here; its shape is
	// asserted field by field in the dedicated vocabulary test below.
	job?: unknown;
};
type KeyBuilder = (
	ctx: ScrapeDoKeyBuilderContext,
	source: 'endpoint' | 'webhook',
) => Promise<string>;

function flatten(endpoints: object): string[] {
	const paths: string[] = [];
	for (const [group, members] of Object.entries(endpoints)) {
		for (const name of Object.keys(members)) {
			paths.push(`${group}.${name}`);
		}
	}
	return paths.sort();
}

function keyBuilderOf(plugin: object): KeyBuilder {
	return (plugin as { keyBuilder?: KeyBuilder }).keyBuilder as KeyBuilder;
}

describe('scrapedo plugin', () => {
	const plugin = scrapedo();
	const meta = plugin.endpointMeta as Record<string, EndpointMeta>;

	it('registers every operation', () => {
		expect(flatten(plugin.endpoints ?? {})).toEqual([...OPERATIONS]);
	});

	it('advertises api_key as its only auth type', () => {
		expect(plugin.options?.authType).toBe('api_key');
	});

	it('has no webhooks, because Scrape.do sends none', () => {
		expect(plugin.webhooks).toEqual({});
		expect(plugin.pluginWebhookMatcher?.({ headers: {} } as never)).toBe(false);
	});

	it('registers an input and output schema for every operation', () => {
		expect(Object.keys(scrapeDoEndpointSchemas).sort()).toEqual([
			...OPERATIONS,
		]);
	});

	it('classifies the scrape and account operations as reads', () => {
		const reads = OPERATIONS.filter(
			(operation) => meta[operation]?.riskLevel === 'read',
		);
		expect(reads).toEqual([
			'account.asyncInfo',
			'account.info',
			'jobs.get',
			'jobs.list',
			'jobs.result',
			'scrape.html',
			'scrape.json',
			'scrape.markdown',
			'scrape.screenshot',
		]);
	});

	it('classifies job start and cancel as writes', () => {
		expect(meta['jobs.start']?.riskLevel).toBe('write');
		expect(meta['jobs.cancel']?.riskLevel).toBe('write');
	});

	it('marks nothing irreversible, because no operation destroys data', () => {
		for (const operation of OPERATIONS) {
			expect({
				operation,
				irreversible: meta[operation]?.irreversible,
			}).toEqual({ operation, irreversible: undefined });
		}
	});

	it('declares an EndpointJob on jobs.start only', () => {
		expect(meta['jobs.start']?.job).toBeDefined();
		for (const operation of OPERATIONS.filter((o) => o !== 'jobs.start')) {
			expect({ operation, job: meta[operation]?.job }).toEqual({
				operation,
				job: undefined,
			});
		}
	});

	it('declares the job vocabulary captured live', () => {
		const job = meta['jobs.start']?.job as {
			idPath: string;
			status: {
				op: string;
				idArg: string;
				statusPath: string;
				done: string[];
				failed: string[];
			};
			cancel: { op: string; idArg: string };
		};
		expect(job.idPath).toBe('job_id');
		expect(job.status.op).toBe('jobs.get');
		expect(job.status.idArg).toBe('jobId');
		expect(job.status.statusPath).toBe('status');
		expect(job.status.done).toEqual(['success']);
		expect(job.status.failed).toEqual(['error', 'canceled']);
		expect(job.cancel).toEqual({ op: 'jobs.cancel', idArg: 'jobId' });
	});

	it('describes every operation without placeholder text', () => {
		for (const operation of OPERATIONS) {
			const description = meta[operation]?.description ?? '';
			expect({ operation, long: description.length > 20 }).toEqual({
				operation,
				long: true,
			});
			expect(description).not.toMatch(/example resource/i);
		}
	});
});

describe('keyBuilder', () => {
	function contextWith(storedKey: string | undefined) {
		const get_api_key = jest.fn().mockResolvedValue(storedKey);
		// unknown: a fixture cannot be a full AccountKeyManager (it would need
		// get_dek, issue_new_dek and the rest), so this implements the one
		// accessor the builder reads and casts the rest.
		return {
			ctx: {
				authType: 'api_key',
				keys: { get_api_key },
				// unknown: a fixture cannot be a full AccountKeyManager (it would need
				// get_dek, issue_new_dek and the rest), so this implements the one
				// accessor the builder reads and casts the rest.
			} as unknown as ScrapeDoKeyBuilderContext,
			get_api_key,
		};
	}

	it('prefers an inline token', async () => {
		const { ctx } = contextWith('stored');
		await expect(
			keyBuilderOf(scrapedo({ key: 'inline' }))(ctx, 'endpoint'),
		).resolves.toBe('inline');
	});

	it('falls back to the stored token', async () => {
		const { ctx } = contextWith('stored');
		await expect(keyBuilderOf(scrapedo())(ctx, 'endpoint')).resolves.toBe(
			'stored',
		);
	});

	it('throws AuthMissingError when neither exists', async () => {
		const { ctx } = contextWith(undefined);
		await expect(
			keyBuilderOf(scrapedo())(ctx, 'endpoint'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});

describe('account info', () => {
	it('accepts a live account', () => {
		const raw = RawAccountInfoSchema.parse(ACCOUNT_INFO_BODY);
		const result = Outputs.accountInfo.parse(
			parseAccountInfo(raw),
		) as AccountInfoResponse;
		expect(result.is_active).toBe(true);
		expect(result.remaining_monthly_request).toBe(998);
	});

	it('rejects the HTTP 200 with IsActive false, which is how a bad token answers', () => {
		// This is the trap: the status was 200, so only IsActive says the token is
		// dead. A client checking status alone would report a dead account as fine.
		const raw = RawAccountInfoSchema.parse(ACCOUNT_INFO_INACTIVE_BODY);
		expect(() => parseAccountInfo(raw)).toThrow(/IsActive false/);
	});

	it('reports the IsActive false answer as an auth error, like the async API 401', () => {
		const raw = RawAccountInfoSchema.parse(ACCOUNT_INFO_INACTIVE_BODY);
		let caught: unknown;
		try {
			parseAccountInfo(raw);
		} catch (error) {
			caught = error;
		}
		expect(caught).toBeInstanceOf(ScrapeDoAPIError);
		expect((caught as ScrapeDoAPIError).isAuthError).toBe(true);
		expect(errorHandlers.AUTH_ERROR.match(caught as Error)).toBe(true);
	});

	it('translates the async answer, including the provider typo', () => {
		const result = Outputs.asyncAccount.parse({
			total_concurrency: ASYNC_ACCOUNT_BODY.TotalConcurrency,
			free_concurrency: ASYNC_ACCOUNT_BODY.FreeConcurrency,
			active_jobs: ASYNC_ACCOUNT_BODY.ActiveJobs,
			available_credits: ASYNC_ACCOUNT_BODY.AvaliableCredits,
		}) as AsyncAccountResponse;
		expect(result.available_credits).toBe(991);
	});
});

describe('output schemas', () => {
	it('parses a page with its target status', () => {
		const result = Outputs.scrapeHtml.parse({
			html: HTML_BODY,
			status_code: 200,
			content_type: 'text/html',
		}) as ScrapeHtmlResponse;
		expect(result.status_code).toBe(200);
	});

	it('rejects a page with no status', () => {
		expect(() => Outputs.scrapeHtml.parse({ html: HTML_BODY })).toThrow();
	});

	it('parses the JSON report', () => {
		const result = Outputs.scrapeJson.parse({
			status_code: JSON_BODY.statusCode,
			content: JSON_BODY.content,
			network_requests: JSON_BODY.networkRequests,
			websocket_requests: JSON_BODY.websocketRequests,
		}) as ScrapeJsonResponse;
		expect(result.network_requests).toHaveLength(1);
	});

	it('rejects network requests that are not an array', () => {
		expect(() =>
			Outputs.scrapeJson.parse({
				status_code: 200,
				content: '',
				network_requests: {},
			}),
		).toThrow();
	});

	it('parses screenshots', () => {
		const result = Outputs.scrapeScreenshot.parse({
			screenshots: SCREENSHOT_BODY.screenShots.map((shot) => shot.image),
			status_code: SCREENSHOT_BODY.statusCode,
		}) as ScrapeScreenshotResponse;
		expect(result.screenshots).toHaveLength(1);
	});

	it('parses a queued job with rotating tasks', () => {
		const result = Outputs.jobsGet.parse({
			job_id: JOB_QUEUED_BODY.JobID,
			status: JOB_QUEUED_BODY.Status,
			tasks: JOB_QUEUED_BODY.Tasks.map((t) => ({
				task_id: t.TaskID,
				url: t.URL,
				status: t.Status,
			})),
			job: {
				job_id: JOB_QUEUED_BODY.JobID,
				status: JOB_QUEUED_BODY.Status,
				tasks: [],
			},
		}) as JobsGetResponse;
		expect(result.status).toBe('queued');
	});

	it('parses a finished and a failed job', () => {
		for (const body of [JOB_SUCCESS_BODY, JOB_FAILED_BODY]) {
			const result = Outputs.jobsGet.parse({
				job_id: body.JobID,
				status: body.Status,
				tasks: body.Tasks.map((t) => ({
					task_id: t.TaskID,
					url: t.URL,
					status: t.Status,
				})),
				job: { job_id: body.JobID, status: body.Status, tasks: [] },
			}) as JobsGetResponse;
			expect(result.job_id).toBe(body.JobID);
		}
	});

	it('parses a canceled job', () => {
		const result = Outputs.jobsCancel.parse({
			job_id: JOB_CANCELED_BODY.JobID,
			status: JOB_CANCELED_BODY.Status,
		});
		expect(result.status).toBe('canceled');
	});

	it('parses a task result with its content', () => {
		const result = Outputs.jobsResult.parse({
			task_id: TASK_RESULT_BODY.TaskID,
			job_id: TASK_RESULT_BODY.JobID,
			url: TASK_RESULT_BODY.URL,
			status: TASK_RESULT_BODY.Status,
			status_code: TASK_RESULT_BODY.StatusCode,
			content: TASK_RESULT_BODY.Content,
			base64_encoded: TASK_RESULT_BODY.Base64EncodedContent,
			error_message: TASK_RESULT_BODY.ErrorMessage,
		}) as JobsResultResponse;
		expect(result.content).toBe(HTML_BODY);
	});

	it('accepts a task result that failed, with no content', () => {
		const result = Outputs.jobsResult.parse({
			task_id: 't',
			job_id: 'j',
			status: 'error',
			error_message: 'This site can not be reached',
		}) as JobsResultResponse;
		expect(result.content).toBeUndefined();
		expect(result.error_message).toContain('can not be reached');
	});

	it('parses a job list', () => {
		const result = Outputs.jobsList.parse({
			jobs: JOBS_LIST_BODY.Jobs.map((j) => ({
				job_id: j.JobID,
				status: j.Status,
				tasks: [],
			})),
			total_count: JOBS_LIST_BODY.TotalCount,
			page_size: JOBS_LIST_BODY.PageSize,
			page_number: JOBS_LIST_BODY.PageNumber,
			total_pages: JOBS_LIST_BODY.TotalPages,
		}) as JobsListResponse;
		expect(result.total_count).toBe(1);
	});
});
