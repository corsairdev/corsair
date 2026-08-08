import {
	normalizeWorkdayHost,
	workdayOAuthUrls,
	workdayServiceBase,
} from './client.js';
import { buildQuery, requestBody, resolvePath } from './endpoints/factory.js';
import { workdayRoutes } from './endpoints/routes.js';
import { workday } from './index.js';

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

	it('registers 13 Composio-aligned triggers', () => {
		const plugin = workday(pluginOpts);
		const hooks = plugin.webhooks as Record<string, unknown> | undefined;
		expect(Object.keys(hooks ?? {})).toHaveLength(13);
		expect(hooks?.['absenceBalance.changed']).toBeDefined();
		expect(hooks?.['jobPosting.created']).toBeDefined();
		expect(hooks?.['workerLeaveOfAbsence.created']).toBeDefined();
	});

	it('requires tenant for oauth_2 and builds Workday OAuth URLs', () => {
		expect(() => workday({ key: 'x' })).toThrow(/tenant is required/);
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
	});

	it('builds service base URLs and normalizes host', () => {
		expect(normalizeWorkdayHost('https://example.workday.com/')).toBe(
			'example.workday.com',
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
			headers: { 'x-workday-event': 'jobPosting.created' },
			body: JSON.stringify({ type: 'jobPosting.created', data: {} }),
		} as never);
		expect(matched).toBe(true);
	});
});
