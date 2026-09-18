import { ApiError } from 'corsair/http';
import { AshbyAPIError } from './client';
import {
	ApiKey,
	Application,
	Candidate,
	CustomField,
	Department,
	Interview,
	Job,
	JobPosting,
	Location,
	Offer,
	User,
	Webhook,
} from './endpoints';
import { SCHEDULE_INFO_MAX_PAGES } from './endpoints/interviews';
import { errorHandlers } from './error-handlers';
import type { AshbyContext } from './index';
import { ashby } from './index';

type Captured = {
	url: string;
	method: string;
	body?: string;
};

let captured: Captured | undefined;

function mockFetchResponse(payload: unknown) {
	captured = undefined;
	global.fetch = (async (url: unknown, init?: RequestInit) => {
		captured = {
			url: String(url),
			method: init?.method ?? 'GET',
			body: typeof init?.body === 'string' ? init.body : undefined,
		};
		return {
			ok: true,
			status: 200,
			statusText: 'OK',
			url: String(url),
			headers: new Headers({ 'Content-Type': 'application/json' }),
			json: async () => payload,
			text: async () => JSON.stringify(payload),
		};
	}) as unknown as typeof global.fetch;
}

function makeCtx(key = 'test-api-key'): AshbyContext {
	return {
		key,
		options: { key },
		keys: {
			get_api_key: async () => key,
			get_webhook_signature: async () => 'test-webhook-secret',
		},
		$getAccountId: async () => 'test_account',
		db: {
			candidates: { upsertByEntityId: jest.fn() },
			applications: { upsertByEntityId: jest.fn() },
			jobs: { upsertByEntityId: jest.fn() },
			jobPostings: { upsertByEntityId: jest.fn() },
			offers: { upsertByEntityId: jest.fn() },
			departments: { upsertByEntityId: jest.fn() },
			locations: { upsertByEntityId: jest.fn() },
			users: { upsertByEntityId: jest.fn() },
		},
	} as unknown as AshbyContext;
}

describe('Ashby Endpoints', () => {
	const ctx = makeCtx();

	it('marks anonymize and webhook.delete as irreversible', () => {
		const plugin = ashby({ key: 'test-api-key' });
		expect(plugin.endpointMeta?.['candidate.anonymize']?.irreversible).toBe(
			true,
		);
		expect(plugin.endpointMeta?.['webhook.delete']?.irreversible).toBe(true);
	});

	describe('Candidate Endpoints', () => {
		it('calls candidate.info', async () => {
			mockFetchResponse({
				success: true,
				results: { id: 'cand_1', name: 'John' },
			});
			const res = await Candidate.info(ctx, { candidateId: 'cand_1' });
			expect(captured?.url).toContain('/candidate.info');
			expect(JSON.parse(captured?.body ?? '{}')).toEqual({
				candidateId: 'cand_1',
			});
			expect(res.results.id).toBe('cand_1');
			expect(ctx.db.candidates.upsertByEntityId).toHaveBeenCalledWith(
				'cand_1',
				expect.objectContaining({ id: 'cand_1', name: 'John' }),
			);
		});

		it('keeps persisting remaining list rows after one upsert fails', async () => {
			const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
			(ctx.db.candidates.upsertByEntityId as jest.Mock).mockClear();
			(ctx.db.candidates.upsertByEntityId as jest.Mock)
				.mockRejectedValueOnce(new Error('row 1'))
				.mockResolvedValueOnce(undefined);
			mockFetchResponse({
				success: true,
				results: [
					{ id: 'cand_a', name: 'A' },
					{ id: 'cand_b', name: 'B' },
				],
			});
			await Candidate.list(ctx, { limit: 10 });
			expect(ctx.db.candidates.upsertByEntityId).toHaveBeenCalledTimes(2);
			expect(ctx.db.candidates.upsertByEntityId).toHaveBeenNthCalledWith(
				2,
				'cand_b',
				expect.objectContaining({ id: 'cand_b', name: 'B' }),
			);
			warn.mockRestore();
		});

		it('calls candidate.list with pagination', async () => {
			mockFetchResponse({
				success: true,
				results: [{ id: 'cand_1', name: 'John' }],
				moreDataAvailable: false,
			});
			const res = await Candidate.list(ctx, { limit: 10, cursor: 'c_1' });
			expect(captured?.url).toContain('/candidate.list');
			expect(JSON.parse(captured?.body ?? '{}')).toEqual({
				limit: 10,
				cursor: 'c_1',
			});
			expect(res.results).toHaveLength(1);
		});

		it('calls candidate.search', async () => {
			mockFetchResponse({
				success: true,
				results: [{ id: 'cand_1', name: 'John' }],
			});
			const res = await Candidate.search(ctx, { name: 'John' });
			expect(captured?.url).toContain('/candidate.search');
			expect(res.results[0]?.name).toBe('John');
		});

		it('calls candidate.create', async () => {
			mockFetchResponse({
				success: true,
				results: { id: 'cand_1', name: 'Alice' },
			});
			const res = await Candidate.create(ctx, {
				name: 'Alice',
				email: 'alice@example.com',
			});
			expect(captured?.url).toContain('/candidate.create');
			expect(res.results.name).toBe('Alice');
		});

		it('calls candidate.update', async () => {
			mockFetchResponse({
				success: true,
				results: { id: 'cand_1', name: 'Alice Smith' },
			});
			const res = await Candidate.update(ctx, {
				candidateId: 'cand_1',
				name: 'Alice Smith',
			});
			expect(captured?.url).toContain('/candidate.update');
			expect(res.results.name).toBe('Alice Smith');
		});

		it('calls candidate.addTag and candidate.removeTag', async () => {
			mockFetchResponse({
				success: true,
				results: { id: 'cand_1', name: 'Alice', tags: ['Eng'] },
			});
			await Candidate.addTag(ctx, { candidateId: 'cand_1', tag: 'Eng' });
			expect(captured?.url).toContain('/candidate.addTag');

			mockFetchResponse({
				success: true,
				results: { id: 'cand_1', name: 'Alice', tags: [] },
			});
			await Candidate.removeTag(ctx, { candidateId: 'cand_1', tag: 'Eng' });
			expect(captured?.url).toContain('/candidate.removeTag');
		});

		it('calls candidate.createNote and candidate.listNotes', async () => {
			mockFetchResponse({
				success: true,
				results: {
					id: 'n_1',
					candidateId: 'cand_1',
					note: 'Great candidate',
				},
			});
			await Candidate.createNote(ctx, {
				candidateId: 'cand_1',
				note: 'Great candidate',
			});
			expect(captured?.url).toContain('/candidate.createNote');

			mockFetchResponse({
				success: true,
				results: [
					{
						id: 'n_1',
						candidateId: 'cand_1',
						note: 'Great candidate',
					},
				],
			});
			const list = await Candidate.listNotes(ctx, { candidateId: 'cand_1' });
			expect(captured?.url).toContain('/candidate.listNotes');
			expect(list.results).toHaveLength(1);
		});

		it('calls candidate.anonymize', async () => {
			mockFetchResponse({
				success: true,
				results: { candidateId: 'cand_1' },
			});
			const res = await Candidate.anonymize(ctx, { candidateId: 'cand_1' });
			expect(captured?.url).toContain('/candidate.anonymize');
			expect(res.results.candidateId).toBe('cand_1');
		});
	});

	describe('Application Endpoints', () => {
		it('calls application.info, list, and create', async () => {
			mockFetchResponse({
				success: true,
				results: { id: 'app_1', candidateId: 'c_1', jobId: 'j_1' },
			});
			await Application.info(ctx, { applicationId: 'app_1' });
			expect(captured?.url).toContain('/application.info');

			mockFetchResponse({
				success: true,
				results: [{ id: 'app_1', candidateId: 'c_1', jobId: 'j_1' }],
			});
			await Application.list(ctx, { candidateId: 'c_1' });
			expect(captured?.url).toContain('/application.list');

			mockFetchResponse({
				success: true,
				results: { id: 'app_1', candidateId: 'c_1', jobId: 'j_1' },
			});
			await Application.create(ctx, { candidateId: 'c_1', jobId: 'j_1' });
			expect(captured?.url).toContain('/application.create');
		});

		it('calls application.changeStage, update, and transfer', async () => {
			mockFetchResponse({
				success: true,
				results: {
					id: 'app_1',
					candidateId: 'c_1',
					jobId: 'j_1',
					currentInterviewStageId: 'stg_2',
				},
			});
			await Application.changeStage(ctx, {
				applicationId: 'app_1',
				interviewStageId: 'stg_2',
			});
			expect(captured?.url).toContain('/application.changeStage');

			mockFetchResponse({
				success: true,
				results: { id: 'app_1', candidateId: 'c_1', jobId: 'j_1' },
			});
			await Application.update(ctx, {
				applicationId: 'app_1',
				archiveReasonId: 'reason_1',
			});
			expect(captured?.url).toContain('/application.update');

			mockFetchResponse({
				success: true,
				results: { id: 'app_1', candidateId: 'c_1', jobId: 'j_2' },
			});
			await Application.transfer(ctx, {
				applicationId: 'app_1',
				jobId: 'j_2',
			});
			expect(captured?.url).toContain('/application.transfer');
		});
	});

	describe('Job & Job Posting Endpoints', () => {
		it('calls job.info, list, create, update, and search', async () => {
			mockFetchResponse({
				success: true,
				results: { id: 'job_1', title: 'SWE' },
			});
			await Job.info(ctx, { jobId: 'job_1' });
			expect(captured?.url).toContain('/job.info');

			mockFetchResponse({
				success: true,
				results: [{ id: 'job_1', title: 'SWE' }],
			});
			await Job.list(ctx, { status: 'Open' });
			expect(captured?.url).toContain('/job.list');

			mockFetchResponse({
				success: true,
				results: { id: 'job_1', title: 'PM' },
			});
			await Job.create(ctx, { title: 'PM' });
			expect(captured?.url).toContain('/job.create');

			mockFetchResponse({
				success: true,
				results: { id: 'job_1', title: 'Senior PM' },
			});
			await Job.update(ctx, { jobId: 'job_1', title: 'Senior PM' });
			expect(captured?.url).toContain('/job.update');

			mockFetchResponse({
				success: true,
				results: [{ id: 'job_1', title: 'Senior PM' }],
			});
			await Job.search(ctx, { title: 'Senior PM' });
			expect(captured?.url).toContain('/job.search');
		});

		it('calls jobPosting.info and jobPosting.list', async () => {
			mockFetchResponse({
				success: true,
				results: { id: 'jp_1', title: 'SWE', jobId: 'job_1' },
			});
			await JobPosting.info(ctx, { jobPostingId: 'jp_1' });
			expect(captured?.url).toContain('/jobPosting.info');

			mockFetchResponse({
				success: true,
				results: [{ id: 'jp_1', title: 'SWE', jobId: 'job_1' }],
			});
			await JobPosting.list(ctx, { listedOnly: true });
			expect(captured?.url).toContain('/jobPosting.list');
		});
	});

	describe('Interview, Offer, Department, Location, User, CustomField, ApiKey, Webhook Endpoints', () => {
		it('calls interview endpoints', async () => {
			mockFetchResponse({
				success: true,
				results: { id: 'int_1', title: 'Technical Screen' },
			});
			await Interview.info(ctx, { interviewId: 'int_1' });
			expect(captured?.url).toContain('/interview.info');

			mockFetchResponse({
				success: true,
				results: [{ id: 'int_1', title: 'Technical Screen' }],
			});
			await Interview.list(ctx, {});
			expect(captured?.url).toContain('/interview.list');

			mockFetchResponse({
				success: true,
				results: [{ id: 'sched_1', applicationId: 'app_1' }],
			});
			const schedule = await Interview.scheduleInfo(ctx, {
				interviewScheduleId: 'sched_1',
			});
			expect(captured?.url).toContain('/interviewSchedule.list');
			expect(schedule.results.id).toBe('sched_1');

			mockFetchResponse({
				success: true,
				results: [{ id: 'sched_other', applicationId: 'app_1' }],
				moreDataAvailable: false,
			});
			await expect(
				Interview.scheduleInfo(ctx, { interviewScheduleId: 'sched_missing' }),
			).rejects.toMatchObject({
				name: 'AshbyAPIError',
				status: 404,
				code: 'resource_not_found',
			});

			let listPages = 0;
			global.fetch = (async () => {
				listPages += 1;
				return {
					ok: true,
					status: 200,
					statusText: 'OK',
					url: 'https://api.ashbyhq.com/interviewSchedule.list',
					headers: new Headers({ 'Content-Type': 'application/json' }),
					json: async () => ({
						success: true,
						results: [{ id: 'sched_other', applicationId: 'app_1' }],
						moreDataAvailable: true,
						nextCursor: `c_${listPages}`,
					}),
					text: async () => '',
				};
			}) as unknown as typeof global.fetch;
			await expect(
				Interview.scheduleInfo(ctx, { interviewScheduleId: 'sched_missing' }),
			).rejects.toMatchObject({
				name: 'AshbyAPIError',
				status: 504,
				code: 'page_budget_exceeded',
			});
			expect(listPages).toBe(SCHEDULE_INFO_MAX_PAGES);

			mockFetchResponse({
				success: true,
				results: [{ id: 'sched_1', applicationId: 'app_1' }],
			});
			await Interview.scheduleList(ctx, { applicationId: 'app_1' });
			expect(captured?.url).toContain('/interviewSchedule.list');

			mockFetchResponse({
				success: true,
				results: [{ id: 'stg_1', title: 'Screen' }],
			});
			await Interview.stageList(ctx, { jobId: 'job_1' });
			expect(captured?.url).toContain('/interviewStage.list');
		});

		it('calls offer endpoints', async () => {
			mockFetchResponse({
				success: true,
				results: { id: 'off_1', applicationId: 'app_1', salary: 150000 },
			});
			await Offer.info(ctx, { offerId: 'off_1' });
			expect(captured?.url).toContain('/offer.info');

			mockFetchResponse({
				success: true,
				results: [{ id: 'off_1', applicationId: 'app_1' }],
			});
			await Offer.list(ctx, { applicationId: 'app_1' });
			expect(captured?.url).toContain('/offer.list');

			mockFetchResponse({
				success: true,
				results: { id: 'off_1', applicationId: 'app_1', salary: 160000 },
			});
			await Offer.create(ctx, { applicationId: 'app_1', salary: 160000 });
			expect(captured?.url).toContain('/offer.create');

			mockFetchResponse({
				success: true,
				results: {
					id: 'off_1',
					applicationId: 'app_1',
					status: 'Accepted',
				},
			});
			await Offer.update(ctx, { offerId: 'off_1', status: 'Accepted' });
			expect(captured?.url).toContain('/offer.update');
		});

		it('calls department and location endpoints', async () => {
			mockFetchResponse({
				success: true,
				results: { id: 'dept_1', name: 'Engineering' },
			});
			await Department.info(ctx, { departmentId: 'dept_1' });
			expect(captured?.url).toContain('/department.info');

			mockFetchResponse({
				success: true,
				results: [{ id: 'dept_1', name: 'Engineering' }],
			});
			await Department.list(ctx, {});
			expect(captured?.url).toContain('/department.list');

			mockFetchResponse({
				success: true,
				results: { id: 'dept_1', name: 'Eng' },
			});
			await Department.create(ctx, { name: 'Eng' });
			expect(captured?.url).toContain('/department.create');

			await Department.update(ctx, {
				departmentId: 'dept_1',
				name: 'Engineering',
			});
			expect(captured?.url).toContain('/department.update');

			await Department.archive(ctx, { departmentId: 'dept_1' });
			expect(captured?.url).toContain('/department.archive');

			mockFetchResponse({
				success: true,
				results: { id: 'loc_1', name: 'NYC' },
			});
			await Location.info(ctx, { locationId: 'loc_1' });
			expect(captured?.url).toContain('/location.info');

			mockFetchResponse({
				success: true,
				results: [{ id: 'loc_1', name: 'NYC' }],
			});
			await Location.list(ctx, {});
			expect(captured?.url).toContain('/location.list');

			mockFetchResponse({
				success: true,
				results: { id: 'loc_1', name: 'NYC' },
			});
			await Location.create(ctx, { name: 'NYC' });
			expect(captured?.url).toContain('/location.create');

			mockFetchResponse({
				success: true,
				results: { id: 'loc_1', name: 'New York' },
			});
			await Location.update(ctx, { locationId: 'loc_1', name: 'New York' });
			expect(captured?.url).toContain('/location.update');

			mockFetchResponse({
				success: true,
				results: { id: 'loc_1', name: 'New York' },
			});
			await Location.archive(ctx, { locationId: 'loc_1' });
			expect(captured?.url).toContain('/location.archive');
		});

		it('calls user endpoints', async () => {
			mockFetchResponse({
				success: true,
				results: {
					id: 'usr_1',
					name: 'User One',
					email: 'u@example.com',
				},
			});
			await User.info(ctx, { userId: 'usr_1' });
			expect(captured?.url).toContain('/user.info');

			mockFetchResponse({
				success: true,
				results: [
					{
						id: 'usr_1',
						name: 'User One',
						email: 'u@example.com',
					},
				],
			});
			await User.list(ctx, { isEnabled: true });
			expect(captured?.url).toContain('/user.list');

			mockFetchResponse({
				success: true,
				results: [
					{
						id: 'usr_1',
						name: 'User One',
						email: 'u@example.com',
					},
				],
			});
			await User.search(ctx, { email: 'u@example.com' });
			expect(captured?.url).toContain('/user.search');
		});

		it('calls customField, apiKey, and webhook endpoints', async () => {
			mockFetchResponse({
				success: true,
				results: {
					id: 'cf_1',
					title: 'Clearance',
					objectType: 'Candidate',
					fieldType: 'String',
				},
			});
			await CustomField.info(ctx, { customFieldDefinitionId: 'cf_1' });
			expect(captured?.url).toContain('/customField.info');

			mockFetchResponse({
				success: true,
				results: [
					{
						id: 'cf_1',
						title: 'Clearance',
						objectType: 'Candidate',
						fieldType: 'String',
					},
				],
			});
			await CustomField.list(ctx, { objectType: 'Candidate' });
			expect(captured?.url).toContain('/customField.list');

			mockFetchResponse({ success: true, results: {} });
			await CustomField.setValue(ctx, {
				objectType: 'Candidate',
				objectId: 'c_1',
				customFieldDefinitionId: 'cf_1',
				value: 'Secret',
			});
			expect(captured?.url).toContain('/customField.setValue');

			mockFetchResponse({
				success: true,
				results: { scopes: ['candidatesRead'] },
			});
			await ApiKey.info(ctx, {});
			expect(captured?.url).toContain('/apiKey.info');

			mockFetchResponse({
				success: true,
				results: { id: 'wh_1', url: 'https://example.com' },
			});
			await Webhook.info(ctx, { webhookId: 'wh_1' });
			expect(captured?.url).toContain('/webhook.info');

			await Webhook.create(ctx, {
				url: 'https://example.com/webhook',
				requestActionNames: ['candidateStageChange'],
			});
			expect(captured?.url).toContain('/webhook.create');

			await Webhook.delete(ctx, { webhookId: 'wh_1' });
			expect(captured?.url).toContain('/webhook.delete');
		});
	});

	describe('Schema Validation in Shared Call', () => {
		it('validates input schema before making request', async () => {
			// @ts-expect-error test invalid candidateId input
			await expect(Candidate.info(ctx, { candidateId: 123 })).rejects.toThrow();
		});

		it('validates output response schema after request completes', async () => {
			mockFetchResponse({
				success: true,
				results: { id: 'cand_1' }, // Missing required 'name' field
			});
			await expect(
				Candidate.info(ctx, { candidateId: 'cand_1' }),
			).rejects.toThrow();
		});
	});

	describe('Error Handlers', () => {
		it('handles RATE_LIMIT_ERROR with Corsair retries and headersRetryAfterMs', async () => {
			const apiErr = new ApiError(
				{ method: 'POST', url: 'https://api.ashbyhq.com/candidate.info' },
				{
					url: 'https://api.ashbyhq.com/candidate.info',
					ok: false,
					status: 429,
					statusText: 'Too Many Requests',
					body: undefined,
				},
				'Rate limit exceeded',
				{ retryAfter: 2500 },
			);

			const match = errorHandlers.RATE_LIMIT_ERROR.match(apiErr);
			expect(match).toBe(true);

			const res = await errorHandlers.RATE_LIMIT_ERROR.handler(apiErr, {
				pluginId: 'ashby',
				operation: 'candidate.info',
				input: {},
				originalError: apiErr,
			});
			expect(res).toEqual({
				maxRetries: 3,
				retryStrategy: 'exponential_backoff',
				headersRetryAfterMs: 2500,
			});
			expect(res).not.toHaveProperty('backoffMs');
		});

		it('does not retry rate limits on writes', async () => {
			const apiErr = new ApiError(
				{ method: 'POST', url: 'https://api.ashbyhq.com/candidate.create' },
				{
					url: 'https://api.ashbyhq.com/candidate.create',
					ok: false,
					status: 429,
					statusText: 'Too Many Requests',
					body: undefined,
				},
				'Rate limit exceeded',
				{ retryAfter: 2500 },
			);
			const res = await errorHandlers.RATE_LIMIT_ERROR.handler(apiErr, {
				pluginId: 'ashby',
				operation: 'candidate.create',
				input: {},
				originalError: apiErr,
			});
			expect(res.maxRetries).toBe(0);
		});

		it('reads retryAfter from AshbyAPIError on RATE_LIMIT_ERROR', async () => {
			const err = new AshbyAPIError(
				'Too many requests',
				429,
				'rate_limit_exceeded',
				undefined,
				4000,
			);
			const res = await errorHandlers.RATE_LIMIT_ERROR.handler(err, {
				pluginId: 'ashby',
				operation: 'candidate.info',
				input: {},
				originalError: err,
			});
			expect(res).toEqual({
				maxRetries: 3,
				retryStrategy: 'exponential_backoff',
				headersRetryAfterMs: 4000,
			});
		});

		it('uses retryStrategy for SERVER_ERROR', async () => {
			const err = new Error('Internal server error');
			const res = await errorHandlers.SERVER_ERROR.handler(err, {
				pluginId: 'ashby',
				operation: 'candidate.info',
				input: {},
				originalError: err,
			});
			expect(errorHandlers.SERVER_ERROR.match(err)).toBe(true);
			expect(res).toEqual({
				maxRetries: 2,
				retryStrategy: 'exponential_backoff',
			});
			expect(res).not.toHaveProperty('backoffMs');
		});

		it('does not retry SERVER_ERROR on writes', async () => {
			const err = new Error('Internal server error');
			const res = await errorHandlers.SERVER_ERROR.handler(err, {
				pluginId: 'ashby',
				operation: 'candidate.create',
				input: {},
				originalError: err,
			});
			expect(res.maxRetries).toBe(0);
		});

		it('handles DEFAULT error without logging context.input', async () => {
			const errorSpy = jest
				.spyOn(console, 'error')
				.mockImplementation(() => {});
			const err = new Error('Unexpected database failure');
			const context = {
				pluginId: 'ashby',
				operation: 'candidate.create',
				input: { secretToken: 'do-not-log-me', name: 'Secret Candidate' },
				originalError: err,
			};

			const match = errorHandlers.DEFAULT.match();
			expect(match).toBe(true);

			const res = await errorHandlers.DEFAULT.handler(err, context);
			expect(res).toEqual({ maxRetries: 0 });

			expect(errorSpy).toHaveBeenCalledWith(
				'[corsair:ashby:candidate.create]',
				{
					error: 'Unexpected database failure',
				},
			);
			errorSpy.mockRestore();
		});
	});
});
