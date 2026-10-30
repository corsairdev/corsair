import { createHmac } from 'node:crypto';
import { ApiError } from 'corsair/http';
import {
	makeWorkdayRequest,
	normalizeWorkdayHost,
	workdayOAuthUrls,
	workdayServiceBase,
} from './client.js';
import { syncWorkdayOperationCache } from './endpoints/cache-sync.js';
import { buildQuery, requestBody, resolvePath } from './endpoints/factory.js';
import { workdayRoutes } from './endpoints/routes.js';
import { WorkdayEndpointInputSchemas } from './endpoints/types.js';
import { errorHandlers } from './error-handlers.js';
import { workday } from './index.js';
import {
	WorkdayAbsenceBalance,
	WorkdayInterview,
	WorkdayJob,
	WorkdayJobPosting,
	WorkdayJobRequisition,
	WorkdayPayrollInput,
	WorkdayProspect,
	WorkdaySchema,
	WorkdayWorker,
} from './schema/index.js';
import { verifyWorkdayWebhookSignature } from './webhooks/types.js';

function mockJsonResponse(body: unknown, status = 200) {
	return {
		ok: status >= 200 && status < 300,
		status,
		headers: {
			get: (name: string) =>
				name.toLowerCase() === 'content-type' ? 'application/json' : null,
		},
		json: async () => body,
		text: async () => JSON.stringify(body),
	};
}

describe('Workday Plugin', () => {
	const mockFetch = jest.fn();
	// Justification: jest requires injecting fetch into global scope for tests.
	(globalThis as { fetch?: typeof fetch }).fetch = mockFetch;

	beforeEach(() => {
		mockFetch.mockReset();
	});

	const pluginOpts = {
		key: 'test-token',
		tenant: 'acme',
		host: 'wd2-impl-services1.workday.com',
		webhookSecret: 'secret',
	};

	it('initializes with workday id', () => {
		const plugin = workday(pluginOpts);
		expect(plugin.id).toBe('workday');
	});

	it('registers all 85 routes as nested endpoints', () => {
		const plugin = workday(pluginOpts);
		expect(workdayRoutes).toHaveLength(85);
		for (const route of workdayRoutes) {
			const group = (
				plugin.endpoints as Record<string, Record<string, unknown>>
			)?.[route.group];
			expect(group).toBeDefined();
			expect(group?.[route.name]).toBeDefined();
		}
	});

	it('registers 13 Workday triggers', () => {
		const plugin = workday(pluginOpts);
		const hooks = plugin.webhooks as Record<string, unknown> | undefined;
		expect(Object.keys(hooks ?? {}).sort()).toEqual(
			[
				'absenceBalance.changed',
				'absenceBalance.created',
				'balanceDetails.changed',
				'interview.scheduled',
				'interviewFeedback.submitted',
				'jobPosting.changed',
				'jobPosting.created',
				'jobPostingQuestionnaire.changed',
				'prospectProfile.changed',
				'prospectResumeAttachment.added',
				'workerEligibleAbsenceType.changed',
				'workerLeaveOfAbsence.changed',
				'workerLeaveOfAbsence.created',
			].sort(),
		);
	});

	it('requires tenant and host for oauth_2 and builds Workday OAuth URLs', () => {
		expect(() => workday({ key: 'x' })).toThrow(/tenant is required/);
		expect(() => workday({ key: 'x', tenant: 'acme' })).toThrow(
			/host is required/,
		);
		const plugin = workday(pluginOpts);
		expect(plugin.oauthConfig?.authUrl).toBe(
			'https://wd2-impl-services1.workday.com/ccx/oauth2/acme/authorize',
		);
		expect(plugin.oauthConfig?.tokenUrl).toBe(
			'https://wd2-impl-services1.workday.com/ccx/oauth2/acme/token',
		);
	});

	it('interpolates path params and never leaves literal {ID}', () => {
		const path = resolvePath(
			'/workers/{ID}/jobChanges',
			{ ID: 'abc/def' },
			{ pathParams: ['ID'] },
		);
		expect(path).toBe('/workers/abc%2Fdef/jobChanges');
		expect(path).not.toContain('{ID}');
	});

	it('accepts id/workerId aliases for ID path params', () => {
		expect(
			resolvePath(
				'/workers/{ID}/requestTimeOff',
				{ workerId: 'w1' },
				{ pathParams: ['ID'] },
			),
		).toBe('/workers/w1/requestTimeOff');
		expect(
			resolvePath('/jobs/{ID}', { id: 'job-9' }, { pathParams: ['ID'] }),
		).toBe('/jobs/job-9');
	});

	it('maps createJobChange to Staffing v6 POST /workers/{ID}/jobChanges', async () => {
		const plugin = workday(pluginOpts);
		mockFetch.mockResolvedValueOnce(
			mockJsonResponse({ id: 'jc-1', descriptor: 'Job Change' }, 201),
		);

		const result = await plugin.endpoints?.job.createJobChange(
			// Justification: minimal endpoint context for unit test
			{ key: 'test-token', options: pluginOpts } as never,
			{
				ID: 'worker-1',
				date: '2026-08-01',
				reason: { id: 'reason-1' },
			},
		);

		expect(mockFetch).toHaveBeenCalled();
		const [url, init] = mockFetch.mock.calls[0] as [string, RequestInit];
		expect(url).toContain(
			'/ccx/api/staffing/v6/acme/workers/worker-1/jobChanges',
		);
		expect(init.method).toBe('POST');
		expect(result).toEqual({ id: 'jc-1', descriptor: 'Job Change' });
	});

	it('maps getJobById to GET staffing /jobs/{ID} with encoded id', async () => {
		const plugin = workday(pluginOpts);
		mockFetch.mockResolvedValueOnce(mockJsonResponse({ id: 'job-1' }));

		await plugin.endpoints?.job.getJobById(
			{ key: 'test-token', options: pluginOpts } as never,
			{ ID: 'a b' },
		);

		const [url, init] = mockFetch.mock.calls[0] as [string, RequestInit];
		expect(url).toContain('/ccx/api/staffing/v6/acme/jobs/a%20b');
		expect(init.method).toBe('GET');
	});

	it('maps listBalances to Absence Management v5 GET /balances', async () => {
		const plugin = workday(pluginOpts);
		mockFetch.mockResolvedValueOnce(mockJsonResponse({ data: [], total: 0 }));

		await plugin.endpoints?.balances.listBalances(
			{ key: 'test-token', options: pluginOpts } as never,
			{ worker: 'w1', limit: 20, offset: 0 },
		);

		const [url, init] = mockFetch.mock.calls[0] as [string, RequestInit];
		expect(url).toContain('/ccx/api/absenceManagement/v5/acme/balances');
		expect(url).toContain('worker=w1');
		expect(init.method).toBe('GET');
	});

	it('maps retrieveWorkerLeaveOfAbsenceSubresource as GET read', async () => {
		const plugin = workday(pluginOpts);
		const meta =
			plugin.endpointMeta?.['worker.retrieveWorkerLeaveOfAbsenceSubresource'];
		expect(meta?.riskLevel).toBe('read');

		mockFetch.mockResolvedValueOnce(mockJsonResponse({ id: 'loa-1' }));

		await plugin.endpoints?.worker.retrieveWorkerLeaveOfAbsenceSubresource(
			{ key: 'test-token', options: pluginOpts } as never,
			{ ID: 'w1', subresourceID: 'loa-1' },
		);

		const [url, init] = mockFetch.mock.calls[0] as [string, RequestInit];
		expect(url).toContain(
			'/ccx/api/absenceManagement/v5/acme/workers/w1/leavesOfAbsence/loa-1',
		);
		expect(init.method).toBe('GET');
	});

	it('maps updateMessageTemplateById with interpolated ID (no literal braces)', async () => {
		const plugin = workday(pluginOpts);
		mockFetch.mockResolvedValueOnce(mockJsonResponse({ id: 'mt-1' }));

		await plugin.endpoints?.message.updateMessageTemplateById(
			{ key: 'test-token', options: pluginOpts } as never,
			{ ID: 'mt-1', name: 'Interview Invite' },
		);

		const [url, init] = mockFetch.mock.calls[0] as [string, RequestInit];
		expect(url).toContain('/ccx/api/recruiting/v4/acme/messageTemplates/mt-1');
		expect(url).not.toContain('{ID}');
		expect(init.method).toBe('PUT');
	});

	it('assigns read riskLevel to GET ops and write to mutating ops', () => {
		const plugin = workday(pluginOpts);
		expect(plugin.endpointMeta?.['current.getCurrentUser']?.riskLevel).toBe(
			'read',
		);
		expect(plugin.endpointMeta?.['job.createJobChange']?.riskLevel).toBe(
			'write',
		);
		expect(
			plugin.endpointMeta?.['payroll.updateAnExistingPayroll']?.riskLevel,
		).toBe('write');
	});

	it('builds query from route queryParams and body excluding path params', () => {
		const route = workdayRoutes.find((r) => r.name === 'createJobChange');
		expect(route).toBeDefined();
		if (!route) return;
		expect(buildQuery(route, { ID: 'w1', limit: 5 })).toBeUndefined();
		expect(requestBody(route, { ID: 'w1', date: '2026-01-01' })).toEqual({
			date: '2026-01-01',
		});
		// Pagination + path aliases must never leak into write bodies.
		expect(
			requestBody(route, {
				ID: 'w1',
				id: 'alias',
				workerId: 'alias2',
				limit: 10,
				offset: 2,
				date: '2026-01-01',
			}),
		).toEqual({ date: '2026-01-01' });
	});

	it('builds service base URLs and normalizes host', () => {
		expect(normalizeWorkdayHost('https://example.workday.com/')).toBe(
			'example.workday.com',
		);
		expect(() => normalizeWorkdayHost('evil.com@attacker.com')).toThrow(
			/bare hostname/,
		);
		expect(() => normalizeWorkdayHost('tenant.workday.com/extra/path')).toThrow(
			/bare hostname/,
		);
		expect(
			workdayServiceBase(
				{ host: 'example.workday.com', tenant: 'acme' },
				'staffing',
				'v6',
			),
		).toBe('https://example.workday.com/ccx/api/staffing/v6/acme');
		expect(
			workdayOAuthUrls({ host: 'example.workday.com', tenant: 'acme' }).authUrl,
		).toContain('/ccx/oauth2/acme/authorize');
	});

	it('matches trigger events by type and verifies HMAC signature wiring', async () => {
		const plugin = workday(pluginOpts);
		const trigger = plugin.webhooks?.['jobPosting.created'];
		expect(trigger).toBeDefined();
		const matched = trigger?.match?.({
			headers: { 'X-Workday-Event': ['jobPosting.created'] },
			body: JSON.stringify({ type: 'jobPosting.created', data: {} }),
		} as never);
		expect(matched).toBe(true);

		const rawBody = '{"type":"jobPosting.created","data":{}}';
		const secret = 'secret';
		const validSig = createHmac('sha256', secret).update(rawBody).digest('hex');
		const payload = { type: 'jobPosting.created' as const, data: {} };

		expect(
			verifyWorkdayWebhookSignature(
				{
					headers: { 'x-workday-signature': validSig },
					payload,
					rawBody,
				} as never,
				secret,
			).valid,
		).toBe(true);
		expect(
			verifyWorkdayWebhookSignature(
				{
					headers: { 'x-workday-signature': 'deadbeef' },
					payload,
					rawBody,
				} as never,
				secret,
			).valid,
		).toBe(false);
		expect(
			verifyWorkdayWebhookSignature(
				{
					headers: { 'x-workday-signature': validSig },
					payload,
				} as never,
				secret,
			),
		).toMatchObject({
			valid: false,
			error: 'Raw request body is required for signature verification',
		});

		const ctx = {
			options: pluginOpts,
			key: secret,
		} as never;
		await expect(
			trigger?.handler?.(ctx, {
				headers: { 'x-workday-signature': validSig },
				payload,
				rawBody,
			} as never),
		).resolves.toMatchObject({ success: true });
		await expect(
			trigger?.handler?.(ctx, {
				headers: { 'x-workday-signature': 'deadbeef' },
				payload,
				rawBody,
			} as never),
		).resolves.toMatchObject({ success: false, statusCode: 401 });
	});

	it('coerces pagination query strings on list inputs', () => {
		const parsed = WorkdayEndpointInputSchemas.listBalances.parse({
			limit: '20',
			offset: '0',
			worker: 'w1',
		});
		expect(parsed).toMatchObject({ limit: 20, offset: 0, worker: 'w1' });
	});

	it('rethrows ApiError so rate-limit handler keeps retryAfter', async () => {
		// Use 503 (not 429) so corsair/http does not enter its retry/sleep loop.
		const apiError = new ApiError(
			{ method: 'GET', url: '/jobs' },
			{
				url: 'https://example.workday.com/jobs',
				ok: false,
				status: 503,
				statusText: 'Service Unavailable',
				body: {},
			},
			'upstream unavailable',
		);
		mockFetch.mockRejectedValue(apiError);

		await expect(
			makeWorkdayRequest('jobs', 'tok', {
				method: 'GET',
				connection: { host: 'example.workday.com', tenant: 'acme' },
				service: 'staffing',
				version: 'v6',
			}),
		).rejects.toBe(apiError);

		const rateLimited = new ApiError(
			{ method: 'GET', url: '/jobs' },
			{
				url: 'https://example.workday.com/jobs',
				ok: false,
				status: 429,
				statusText: 'Too Many Requests',
				body: {},
			},
			'Rate limited',
			{ retryAfter: 5000 },
		);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(rateLimited)).toBe(true);
		const result = await errorHandlers.RATE_LIMIT_ERROR.handler(rateLimited);
		expect(result.headersRetryAfterMs).toBe(5000);
		// Do not treat ids like worker-4291 as rate limits.
		expect(
			errorHandlers.RATE_LIMIT_ERROR.match(new Error('worker-4291 missing')),
		).toBe(false);
	});

	it('maps worker/job ops to documented Workday REST surfaces', () => {
		const byName = Object.fromEntries(workdayRoutes.map((r) => [r.name, r]));

		expect(byName.getWorkerStaffingInformation).toMatchObject({
			service: 'staffing',
			version: 'v6',
			path: '/workers/{ID}',
			method: 'GET',
		});
		// Alias of WorkersApi.getStaffingInformation (Staffing docs).
		expect(byName.getWorkerInfo).toMatchObject({
			service: 'staffing',
			version: 'v6',
			path: '/workers/{ID}',
			method: 'GET',
		});
		expect(byName.getJobById?.queryParams).toEqual([]);
		// JobsApi.getCollection — two aliases, same docs path/params.
		expect(byName.getCollectionOfJobs).toMatchObject({
			service: 'staffing',
			path: '/jobs',
			queryParams: ['limit', 'offset'],
		});
		expect(byName.listJobs).toMatchObject({
			service: 'staffing',
			path: '/jobs',
			queryParams: ['limit', 'offset'],
		});
		expect(byName.getWorkersCollectionStaffing?.queryParams).toEqual(
			expect.arrayContaining([
				'includeTerminatedWorkers',
				'search',
				'limit',
				'offset',
			]),
		);
		expect(byName.listJobPostings?.path).toBe('/jobPostings');
		expect(byName.getMyJobPostings?.path).toBe('/jobRequisitions');
		expect(byName.getCurrentUser?.path).toBe('/workers/me');
	});

	it('declares db schema entities aligned to Workday REST resources', () => {
		expect(WorkdaySchema.version).toMatch(/^\d+\.\d+\.\d+$/);
		expect(Object.keys(WorkdaySchema.entities).sort()).toEqual(
			[
				'absenceBalances',
				'interviews',
				'jobPostings',
				'jobRequisitions',
				'jobs',
				'payrollInputs',
				'prospects',
				'workers',
			].sort(),
		);
		expect(
			WorkdayWorker.parse({
				id: 'w1',
				descriptor: 'Ada Lovelace',
				businessTitle: 'Engineer',
				primaryWorkEmail: 'ada@example.com',
				primaryJob: { id: 'j1', descriptor: 'Eng' },
			}),
		).toMatchObject({
			id: 'w1',
			businessTitle: 'Engineer',
			primaryJob: { id: 'j1' },
		});
		expect(
			WorkdayJob.parse({
				id: 'j1',
				businessTitle: 'Engineer',
				jobProfile: { id: 'jp', descriptor: 'Profile' },
			}),
		).toMatchObject({ id: 'j1', businessTitle: 'Engineer' });
		expect(
			WorkdayJobPosting.parse({
				id: 'jp1',
				title: 'SWE',
				jobRequisition: { id: 'jr1' },
			}),
		).toMatchObject({ id: 'jp1', title: 'SWE' });
		expect(
			WorkdayJobRequisition.parse({
				id: 'jr1',
				status: 'Open',
				hiringManager: { id: 'w1' },
			}),
		).toMatchObject({ id: 'jr1', status: 'Open' });
		expect(
			WorkdayPayrollInput.parse({
				id: 'p1',
				amount: 100,
				worker: { id: 'w1' },
			}),
		).toMatchObject({ id: 'p1', amount: 100 });
		expect(
			WorkdayProspect.parse({ id: 'pr1', email: 'a@b.com' }),
		).toMatchObject({ id: 'pr1', email: 'a@b.com' });
		expect(
			WorkdayInterview.parse({ id: 'i1', status: 'Scheduled' }),
		).toMatchObject({ id: 'i1', status: 'Scheduled' });
		expect(
			WorkdayAbsenceBalance.parse({
				id: 'b1',
				quantity: 8,
				unitOfTime: 'Hours',
			}),
		).toMatchObject({ id: 'b1', quantity: 8 });
	});

	it('upserts worker cache after getWorkerStaffingInformation responses', async () => {
		const upsertByEntityId = jest.fn().mockResolvedValue(undefined);
		const route = workdayRoutes.find(
			(r) => r.name === 'getWorkerStaffingInformation',
		);
		expect(route).toBeDefined();

		await syncWorkdayOperationCache(
			{
				key: 'tok',
				db: { workers: { upsertByEntityId } },
			} as never,
			route!,
			{ ID: 'w1' },
			{ id: 'w1', descriptor: 'Ada' },
		);

		expect(upsertByEntityId).toHaveBeenCalledWith('w1', {
			id: 'w1',
			descriptor: 'Ada',
		});
	});

	it('does not cache worker subresources into workers entity', async () => {
		const upsertByEntityId = jest.fn().mockResolvedValue(undefined);
		const route = workdayRoutes.find(
			(r) => r.name === 'getWorkerLeavesOfAbsence',
		);
		expect(route).toBeDefined();

		await syncWorkdayOperationCache(
			{
				key: 'tok',
				db: { workers: { upsertByEntityId } },
			} as never,
			route!,
			{ ID: 'w1' },
			{ data: [{ id: 'loa-1' }] },
		);

		expect(upsertByEntityId).not.toHaveBeenCalled();
	});

	it('upserts job collection items into jobs cache', async () => {
		const upsertByEntityId = jest.fn().mockResolvedValue(undefined);
		const route = workdayRoutes.find((r) => r.name === 'getCollectionOfJobs');
		expect(route).toBeDefined();

		await syncWorkdayOperationCache(
			{
				key: 'tok',
				db: { jobs: { upsertByEntityId } },
			} as never,
			route!,
			{ limit: 2 },
			{ data: [{ id: 'j1' }, { id: 'j2' }], total: 2 },
		);

		expect(upsertByEntityId).toHaveBeenCalledWith('j1', { id: 'j1' });
		expect(upsertByEntityId).toHaveBeenCalledWith('j2', { id: 'j2' });
	});

	it('caches getMyJobPostings into jobRequisitions (Recruiting v4)', async () => {
		const upsertByEntityId = jest.fn().mockResolvedValue(undefined);
		const route = workdayRoutes.find((r) => r.name === 'getMyJobPostings');
		expect(route).toBeDefined();

		await syncWorkdayOperationCache(
			{
				key: 'tok',
				db: { jobRequisitions: { upsertByEntityId } },
			} as never,
			route!,
			{ limit: 1 },
			{ data: [{ id: 'jr-1', descriptor: 'Eng Req' }] },
		);

		expect(upsertByEntityId).toHaveBeenCalledWith('jr-1', {
			id: 'jr-1',
			descriptor: 'Eng Req',
		});
	});
});
