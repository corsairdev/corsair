import { createCorsair, runWithMode } from 'corsair/core';
import {
	FindymailEndpointInputSchemas,
	FindymailEndpointOutputSchemas,
} from './endpoints/types';
import { findymail, findymailEndpointSchemas } from './index';

const corsair = createCorsair({ plugins: [findymail({ key: 'test-token' })] });
const api = corsair.findymail.api;
const monitor = {
	id: 1,
	name: 'Hiring monitor',
	signal_type: 'keyword_mention',
	keywords: ['hiring'],
	icp_filters: null,
	webhook_url: null,
	webhook_paused_at: null,
	post_url: null,
	profile_url: null,
	engagement_types: null,
	enrichment_level: null,
	lead_list_id: null,
	ai_relevance_prompt: null,
	target_companies: null,
	max_matches: null,
};

// This table combines 36 different endpoint shapes; no single narrower response
// or body type represents all provider fixtures before their schemas parse them.
type Operation = {
	name: keyof typeof findymailEndpointSchemas;
	call: () => Promise<unknown>;
	method: string;
	path: string;
	response: unknown;
	body?: unknown;
	status?: number;
};

// Fixtures use the provider's documented request and response examples.
const cases: Operation[] = [
	{
		name: 'verification.verify',
		call: () => api.verification.verify({ email: 'john@example.com' }),
		method: 'POST',
		path: '/api/verify',
		body: { email: 'john@example.com' },
		response: { email: 'john@example.com', verified: true, provider: 'Google' },
	},
	{
		name: 'lists.list',
		call: () => api.lists.list({}),
		method: 'GET',
		path: '/api/lists',
		response: { lists: [{ id: 1, name: 'my list' }] },
	},
	{
		name: 'lists.create',
		call: () => api.lists.create({ name: 'new list' }),
		method: 'POST',
		path: '/api/lists',
		body: { name: 'new list' },
		response: { list: { id: 1, name: 'new list' } },
	},
	{
		name: 'lists.replace',
		call: () => api.lists.replace({ id: 1, name: 'updated', isShared: true }),
		method: 'PUT',
		path: '/api/lists/1',
		body: { name: 'updated', isShared: true },
		response: { id: 1, name: 'updated', shared_with_team: true },
	},
	{
		name: 'lists.update',
		call: () => api.lists.update({ id: 1, name: 'updated', isShared: false }),
		method: 'PATCH',
		path: '/api/lists/1',
		body: { name: 'updated', isShared: false },
		response: { id: 1, name: 'updated' },
	},
	{
		name: 'lists.delete',
		call: () => api.lists.delete({ id: 1 }),
		method: 'DELETE',
		path: '/api/lists/1',
		response: {},
	},
	{
		name: 'contacts.list',
		call: () => api.contacts.list({ id: 0 }),
		method: 'GET',
		path: '/api/contacts/get/0',
		response: {
			draw: 0,
			recordsTotal: 1,
			recordsFiltered: 1,
			data: [{ id: 1, name: 'John Doe', email: null }],
		},
	},
	{
		name: 'search.name',
		call: () =>
			api.search.name({
				name: 'John Doe',
				domain: 'example.com',
				webhook_url: 'https://example.com/hook',
			}),
		method: 'POST',
		path: '/api/search/name',
		body: {
			name: 'John Doe',
			domain: 'example.com',
			webhook_url: 'https://example.com/hook',
		},
		response: {
			contact: {
				name: 'John Doe',
				domain: 'example.com',
				email: 'john@example.com',
			},
		},
	},
	{
		name: 'search.businessProfile',
		call: () => api.search.businessProfile({ linkedin_url: 'johndoe' }),
		method: 'POST',
		path: '/api/search/business-profile',
		body: { linkedin_url: 'johndoe' },
		response: { contact: { name: 'John Doe', email: 'john@example.com' } },
	},
	{
		name: 'exclusionLists.list',
		call: () => api.exclusionLists.list({}),
		method: 'GET',
		path: '/api/intellimatch/exclusion-lists',
		response: { lists: [{ id: 1, name: 'Competitors', is_shared: true }] },
	},
	{
		name: 'exclusionLists.create',
		call: () =>
			api.exclusionLists.create({ name: 'Competitors', is_shared: true }),
		method: 'POST',
		path: '/api/intellimatch/exclusion-lists',
		body: { name: 'Competitors', is_shared: true },
		response: { id: 1, name: 'Competitors', is_shared: true },
	},
	{
		name: 'exclusionLists.get',
		call: () => api.exclusionLists.get({ excludedDomainList_id: 1 }),
		method: 'GET',
		path: '/api/intellimatch/exclusion-lists/1',
		response: { id: 1, name: 'Competitors' },
	},
	{
		name: 'exclusionLists.update',
		call: () =>
			api.exclusionLists.update({ excludedDomainList_id: 1, name: 'Updated' }),
		method: 'PUT',
		path: '/api/intellimatch/exclusion-lists/1',
		body: { name: 'Updated' },
		response: { success: true, list: { id: 1, name: 'Updated' } },
	},
	{
		name: 'exclusionLists.delete',
		call: () => api.exclusionLists.delete({ excludedDomainList_id: 1 }),
		method: 'DELETE',
		path: '/api/intellimatch/exclusion-lists/1',
		response: { success: true },
	},
	{
		name: 'excludedDomains.list',
		call: () => api.excludedDomains.list({ page: 2, per_page: 10, list_id: 1 }),
		method: 'GET',
		path: '/api/intellimatch/domains?list_id=1&per_page=10&page=2',
		response: {
			data: [{ id: 2, domain: 'example.com', excluded_domain_list_id: null }],
			current_page: 2,
			per_page: 10,
			total: 11,
		},
	},
	{
		name: 'excludedDomains.add',
		call: () =>
			api.excludedDomains.add({ domains: ['example.com'], list_id: 1 }),
		method: 'POST',
		path: '/api/intellimatch/domains',
		body: { domains: ['example.com'], list_id: 1 },
		response: {
			success: true,
			total: 1,
			processed_immediately: 1,
			queued: 0,
			list_id: 1,
		},
	},
	{
		name: 'excludedDomains.remove',
		call: () => api.excludedDomains.remove({ ids: [1, 2] }),
		method: 'DELETE',
		path: '/api/intellimatch/domains',
		body: { ids: [1, 2] },
		response: { success: true, deleted_count: 2 },
	},
	{
		name: 'intellimatch.search',
		call: () =>
			api.intellimatch.search({
				query: 'SaaS companies in US',
				config: { target_job_titles: ['CEO', 'CTO'] },
			}),
		method: 'POST',
		path: '/api/intellimatch/search',
		body: {
			query: 'SaaS companies in US',
			config: { target_job_titles: ['CEO', 'CTO'] },
		},
		response: { hash: 'abc123' },
	},
	{
		name: 'intellimatch.status',
		call: () => api.intellimatch.status({ hash: 'abc123' }),
		method: 'GET',
		path: '/api/intellimatch/status?hash=abc123',
		response: { status: 'processing', progress: 50 },
	},
	{
		name: 'intellimatch.results',
		call: () =>
			api.intellimatch.results({ hash: 'abc123', page: 2, per_page: 10 }),
		method: 'GET',
		path: '/api/intellimatch/data?hash=abc123&page=2&per_page=10',
		response: {
			data: [{ id: 1, name: 'Acme', domain: 'acme.com' }],
			meta: { current_page: 2, per_page: 10, total: 12 },
		},
	},
	{
		name: 'intellimatch.lookalikes',
		call: () => api.intellimatch.lookalikes({ seed: 'acme.com' }),
		method: 'POST',
		path: '/api/lookalike/search',
		body: { seed: 'acme.com' },
		response: {
			companies: [{ domain: 'example.com', name: 'Example' }],
			total: 1,
			credits_used: 1,
		},
	},
	{
		name: 'search.reverseEmail',
		call: () =>
			api.search.reverseEmail({
				email: 'john@example.com',
				with_profile: false,
			}),
		method: 'POST',
		path: '/api/search/reverse-email',
		body: { email: 'john@example.com', with_profile: false },
		response: { linkedin_url: null },
	},
	{
		name: 'search.company',
		call: () => api.search.company({ domain: 'example.com' }),
		method: 'POST',
		path: '/api/search/company',
		body: { domain: 'example.com' },
		response: {
			name: 'Example',
			domain: 'example.com',
			industry: 'Technology',
		},
	},
	{
		name: 'search.employees',
		call: () =>
			api.search.employees({ website: 'example.com', job_titles: ['CEO'] }),
		method: 'POST',
		path: '/api/search/employees',
		body: { website: 'example.com', job_titles: ['CEO'] },
		response: [{ name: 'John Doe', jobTitle: 'CEO' }],
	},
	{
		name: 'search.phone',
		call: () => api.search.phone({ linkedin_url: 'johndoe' }),
		method: 'POST',
		path: '/api/search/phone',
		body: { linkedin_url: 'johndoe' },
		response: { phone: null, line_type: null },
	},
	{
		name: 'signals.list',
		call: () => api.signals.list({ page: 2, per_page: 10 }),
		method: 'GET',
		path: '/api/signals?page=2&per_page=10',
		response: {
			data: [{ id: 1, type: 'keyword_mention' }],
			meta: { current_page: 2, per_page: 10, total: 11 },
		},
	},
	{
		name: 'monitors.list',
		call: () => api.monitors.list({ ownership: 'my' }),
		method: 'GET',
		path: '/api/signals/monitors?ownership=my',
		response: [monitor],
	},
	{
		name: 'monitors.create',
		call: () =>
			api.monitors.create({
				name: 'Hiring monitor',
				signal_type: 'keyword_mention',
				keywords: ['hiring'],
				max_matches: null,
			}),
		method: 'POST',
		path: '/api/signals/monitors',
		body: {
			name: 'Hiring monitor',
			signal_type: 'keyword_mention',
			keywords: ['hiring'],
			max_matches: null,
		},
		status: 201,
		response: monitor,
	},
	{
		name: 'monitors.update',
		call: () =>
			api.monitors.update({ id: 1, name: 'Hiring monitor', max_matches: null }),
		method: 'PATCH',
		path: '/api/signals/monitors/1',
		body: { name: 'Hiring monitor', max_matches: null },
		response: monitor,
	},
	{
		name: 'monitors.delete',
		call: () => api.monitors.delete({ id: 1 }),
		method: 'DELETE',
		path: '/api/signals/monitors/1',
		status: 204,
		response: undefined,
	},
	{
		name: 'signals.get',
		call: () => api.signals.get({ id: 1 }),
		method: 'GET',
		path: '/api/signals/1',
		response: { id: 1, type: 'keyword_mention', category: 'contact' },
	},
	{
		name: 'technologies.search',
		call: () => api.technologies.search({ q: 'sales' }),
		method: 'GET',
		path: '/api/technologies/search?q=sales',
		response: { data: [{ name: 'Salesforce', category: 'CRM' }] },
	},
	{
		name: 'technologies.lookup',
		call: () =>
			api.technologies.lookup({
				domain: 'example.com',
				technologies: ['Salesforce'],
			}),
		method: 'POST',
		path: '/api/technologies',
		body: { domain: 'example.com', technologies: ['Salesforce'] },
		response: {
			domain: 'example.com',
			technologies: [{ name: 'Salesforce', category: 'CRM' }],
		},
	},
	{
		name: 'usage.credits',
		call: () => api.usage.credits({ type: 'finder' }),
		method: 'GET',
		path: '/api/credits?type=finder',
		response: { credits: 100, email: 'john@example.com', has_capacity: null },
	},
	{
		name: 'usage.summary',
		call: () => api.usage.summary({ from: '2026-01-01', to: '2026-01-31' }),
		method: 'GET',
		path: '/api/credits/report/summary?from=2026-01-01&to=2026-01-31',
		response: {
			from: '2026-01-01',
			to: '2026-01-31',
			total: { finder: 10, verifier: 5 },
			items: [],
		},
	},
	{
		name: 'usage.teamSummary',
		call: () => api.usage.teamSummary({ from: '2026-01-01', to: '2026-01-31' }),
		method: 'GET',
		path: '/api/credits/report/team-summary?from=2026-01-01&to=2026-01-31',
		response: {
			from: '2026-01-01',
			to: '2026-01-31',
			total: { finder: 10, verifier: 5 },
			members: [],
		},
	},
];

let fetchMock: jest.SpyInstance;
beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch').mockImplementation(() => {
		throw new Error('Unexpected network request');
	});
});
afterEach(() => jest.restoreAllMocks());

it('covers every registered operation', () => {
	expect(cases.map((item) => item.name).sort()).toEqual(
		Object.keys(findymailEndpointSchemas).sort(),
	);
	expect(cases).toHaveLength(36);
	const keys = Object.keys(FindymailEndpointInputSchemas).sort();
	expect(keys).toEqual(Object.keys(FindymailEndpointOutputSchemas).sort());
	expect(keys.map((key) => key.replace('_', '.')).sort()).toEqual(
		Object.keys(findymailEndpointSchemas).sort(),
	);
});

it.each(['cautious', 'strict'] as const)(
	'blocks every deletion before sending a request in %s mode',
	async (mode) => {
		const deletes = [
			() => api.lists.delete({ id: 1 }),
			() => api.exclusionLists.delete({ excludedDomainList_id: 1 }),
			() => api.excludedDomains.remove({ ids: [1] }),
			() => api.monitors.delete({ id: 1 }),
		];
		await runWithMode(mode, async () => {
			for (const remove of deletes) {
				await expect(remove()).rejects.toMatchObject({
					name: 'PermissionRequiredError',
				});
			}
		});
		expect(fetchMock).not.toHaveBeenCalled();
	},
);

it.each([
	{
		name: 'direct contact',
		call: () => api.search.name({ name: 'A', domain: 'a.com' }),
		response: { contact: { email: 123 } },
	},
	{
		name: 'callback contact',
		call: () => api.search.name({ name: 'A', domain: 'a.com' }),
		response: { payload: { contact: { email: 123 } } },
	},
	{
		name: 'business callback',
		call: () => api.search.businessProfile({ linkedin_url: 'a' }),
		response: { payload: { contact: { email: 123 } } },
	},
	{
		name: 'reverse profile',
		call: () => api.search.reverseEmail({ email: 'a@b.com' }),
		response: { fullName: 123 },
	},
	{
		name: 'reverse url',
		call: () => api.search.reverseEmail({ email: 'a@b.com' }),
		response: { linkedin_url: 42 },
	},
	{
		name: 'lookalike company',
		call: () => api.intellimatch.lookalikes({ seed: 'a.com' }),
		response: { companies: [{ name: 123 }] },
	},
	{
		name: 'technology',
		call: () => api.technologies.lookup({ domain: 'a.com' }),
		response: { technologies: [{ name: 123 }] },
	},
])(
	'rejects malformed $name response fields at the public seam',
	async ({ call, response }) => {
		fetchMock.mockResolvedValueOnce(
			new Response(JSON.stringify(response), {
				headers: { 'Content-Type': 'application/json' },
			}),
		);
		await expect(call()).rejects.toBeDefined();
	},
);

it('accepts documented synchronous and callback name search responses', async () => {
	for (const response of [
		{ contact: { name: 'A', email: 'a@example.com', domain: 'example.com' } },
		{
			payload: {
				contact: { name: 'A', email: 'a@example.com', domain: 'example.com' },
			},
		},
	]) {
		fetchMock.mockResolvedValueOnce(
			new Response(JSON.stringify(response), {
				headers: { 'Content-Type': 'application/json' },
			}),
		);
		await expect(
			api.search.name({ name: 'A', domain: 'example.com' }),
		).resolves.toEqual(response);
	}
});

it.each(cases)(
	'$name sends the documented request and parses the response',
	async ({ call, method, path, body, status = 200, response }) => {
		fetchMock.mockResolvedValueOnce(
			new Response(status === 204 ? null : JSON.stringify(response), {
				status,
				headers: { 'Content-Type': 'application/json' },
			}),
		);
		expect(await call()).toEqual(response);
		expect(fetchMock).toHaveBeenCalledTimes(1);
		// The transport always calls fetch(url, options); Jest's untyped spy loses that tuple.
		const [url, request] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).toBe(`https://app.findymail.com${path}`);
		expect(request.method).toBe(method);
		expect(new Headers(request.headers).get('Authorization')).toBe(
			'Bearer test-token',
		);
		if (body === undefined) expect(request.body).toBeUndefined();
		else {
			expect(new Headers(request.headers).get('Content-Type')).toBe(
				'application/json',
			);
			if (typeof request.body !== 'string')
				throw new Error('Expected JSON body');
			expect(JSON.parse(request.body)).toEqual(body);
		}
	},
);

it('rejects unsafe path IDs before making a request', async () => {
	for (const id of ['', '.', '..', '1/2', '1\\2', '"1"', -1]) {
		// Intentionally bypass the static number type to exercise runtime rejection
		// of untyped callers; valid TypeScript inputs cannot express these values.
		await expect(api.lists.delete({ id: id as number })).rejects.toBeDefined();
	}
	expect(fetchMock).not.toHaveBeenCalled();
});

it('accepts documented tiered job titles and rejects more than three tiers', async () => {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify({ hash: 'abc123' }), {
			headers: { 'Content-Type': 'application/json' },
		}),
	);
	await api.intellimatch.search({
		query: 'SaaS',
		config: { target_job_titles: [['RevOps'], ['CEO', 'CTO']] },
	});
	// The spy erases fetch's argument types; the transport sends a RequestInit here.
	const request = fetchMock.mock.calls[0][1] as RequestInit;
	if (typeof request.body !== 'string') throw new Error('Expected JSON body');
	expect(JSON.parse(request.body).config.target_job_titles).toEqual([
		['RevOps'],
		['CEO', 'CTO'],
	]);
	await expect(
		api.intellimatch.search({
			query: 'SaaS',
			config: { target_job_titles: [['A'], ['B'], ['C'], ['D']] },
		}),
	).rejects.toBeDefined();
	expect(fetchMock).toHaveBeenCalledTimes(1);
});

it('does not replay a rate-limited write and preserves the provider error', async () => {
	fetchMock.mockResolvedValueOnce(
		new Response(
			JSON.stringify({ error: 'Too many requests', retry_after: 5 }),
			{
				status: 429,
				headers: { 'Content-Type': 'application/json', 'Retry-After': '5' },
			},
		),
	);
	await expect(
		api.search.name({ name: 'John Doe', domain: 'example.com' }),
	).rejects.toMatchObject({
		status: 429,
		retryAfter: 5000,
		body: { error: 'Too many requests', retry_after: 5 },
	});
	expect(fetchMock).toHaveBeenCalledTimes(1);
});

it('rejects missing credentials before sending a request', async () => {
	const previous = process.env.FINDYMAIL_API_KEY;
	Reflect.deleteProperty(process.env, 'FINDYMAIL_API_KEY');
	try {
		const noKey = createCorsair({ plugins: [findymail()] });
		await expect(noKey.findymail.api.lists.list({})).rejects.toBeDefined();
		expect(fetchMock).not.toHaveBeenCalled();
	} finally {
		if (previous !== undefined) process.env.FINDYMAIL_API_KEY = previous;
	}
});
