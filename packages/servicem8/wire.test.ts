import { createCorsair } from 'corsair/core';
import { operations } from './endpoints';
import { EndpointInputSchemas, EndpointOutputSchemas } from './endpoints/types';
import { ServiceM8Error, serviceM8EndpointSchemas, servicem8 } from './index';

const api = createCorsair({ plugins: [servicem8({ key: 'private-key' })] })
	.servicem8.api;
const oauthApi = createCorsair({
	plugins: [servicem8({ key: 'oauth-token', authType: 'oauth_2' })],
}).servicem8.api;
const uuid = '550e8400-e29b-41d4-a716-446655440000';
const cursor = '550e8400-e29b-41d4-a716-446655440001';
const result = { errorCode: 0, message: 'OK' };
type Case = {
	name: string;
	method: string;
	path: string;
	// The table combines all resource-specific JSON shapes and endpoint return
	// types; a single narrower shape cannot represent every operation fixture.
	response: unknown;
	expected: unknown;
	call: () => Promise<unknown>;
	body?: unknown;
	query?: Record<string, string>;
	oauth?: boolean;
};
const cases: Case[] = [
	{
		name: 'jobs.list',
		method: 'GET',
		path: '/api_1.0/job.json',
		query: { cursor, $filter: 'active eq 1' },
		response: [{ status: 'Quote', company_uuid: null }],
		expected: {
			data: [{ status: 'Quote', company_uuid: null }],
			nextCursor: cursor,
		},
		call: () => api.jobs.list({ cursor, $filter: 'active eq 1' }),
	},
	{
		name: 'jobs.retrieve',
		method: 'GET',
		path: `/api_1.0/job/${uuid}.json`,
		response: { status: 'Quote' },
		expected: { status: 'Quote' },
		call: () => api.jobs.retrieve({ uuid }),
	},
	{
		name: 'jobs.create',
		method: 'POST',
		path: '/api_1.0/job.json',
		body: { status: 'Quote' },
		response: result,
		expected: { result, recordUuid: uuid },
		call: () => api.jobs.create({ status: 'Quote' }),
	},
	{
		name: 'clients.list',
		method: 'GET',
		path: '/api_1.0/company.json',
		response: [{ name: 'Client' }],
		expected: { data: [{ name: 'Client' }], nextCursor: cursor },
		call: () => api.clients.list({}),
	},
	{
		name: 'clients.retrieve',
		method: 'GET',
		path: `/api_1.0/company/${uuid}.json`,
		response: { name: 'Client' },
		expected: { name: 'Client' },
		call: () => api.clients.retrieve({ uuid }),
	},
	{
		name: 'assets.list',
		method: 'GET',
		path: '/api_1.0/asset.json',
		response: [{ name: 'Asset' }],
		expected: { data: [{ name: 'Asset' }], nextCursor: cursor },
		call: () => api.assets.list({}),
	},
	{
		name: 'documentTemplates.list',
		method: 'GET',
		path: '/api_1.0/documenttemplate.json',
		response: [{ name: 'Template' }],
		expected: { data: [{ name: 'Template' }], nextCursor: cursor },
		call: () => api.documentTemplates.list({}),
	},
	{
		name: 'forms.list',
		method: 'GET',
		path: '/api_1.0/form.json',
		response: [{ name: 'Form' }],
		expected: { data: [{ name: 'Form' }], nextCursor: cursor },
		call: () => api.forms.list({}),
	},
	{
		name: 'forms.retrieve',
		method: 'GET',
		path: `/api_1.0/form/${uuid}.json`,
		response: { name: 'Form' },
		expected: { name: 'Form' },
		call: () => api.forms.retrieve({ uuid }),
	},
	{
		name: 'notes.list',
		method: 'GET',
		path: '/api_1.0/note.json',
		response: [{ note: 'hello' }],
		expected: { data: [{ note: 'hello' }], nextCursor: cursor },
		call: () => api.notes.list({}),
	},
	{
		name: 'notes.retrieve',
		method: 'GET',
		path: `/api_1.0/dbonote/${uuid}.json`,
		response: { note: 'hello' },
		expected: { note: 'hello' },
		call: () => api.notes.retrieve({ uuid }),
	},
	{
		name: 'notes.create',
		method: 'POST',
		path: '/api_1.0/note.json',
		body: { note: 'hello' },
		response: result,
		expected: { result, recordUuid: uuid },
		call: () => api.notes.create({ note: 'hello' }),
	},
	{
		name: 'notes.update',
		method: 'POST',
		path: `/api_1.0/dbonote/${uuid}.json`,
		body: { note: 'updated' },
		response: result,
		expected: result,
		call: () => api.notes.update({ uuid, body: { note: 'updated' } }),
	},
	{
		name: 'notes.delete',
		method: 'DELETE',
		path: `/api_1.0/dbonote/${uuid}.json`,
		response: result,
		expected: result,
		call: () => api.notes.delete({ uuid }),
	},
	{
		name: 'queues.list',
		method: 'GET',
		path: '/api_1.0/queue.json',
		response: [{ name: 'Queue' }],
		expected: { data: [{ name: 'Queue' }], nextCursor: cursor },
		call: () => api.queues.list({}),
	},
	{
		name: 'queues.retrieve',
		method: 'GET',
		path: `/api_1.0/queue/${uuid}.json`,
		response: { name: 'Queue' },
		expected: { name: 'Queue' },
		call: () => api.queues.retrieve({ uuid }),
	},
	{
		name: 'locations.list',
		method: 'GET',
		path: '/api_1.0/location.json',
		response: [{ name: 'Place', state: 'NSW' }],
		expected: { data: [{ name: 'Place', state: 'NSW' }], nextCursor: cursor },
		call: () => api.locations.list({}),
	},
	{
		name: 'locations.retrieve',
		method: 'GET',
		path: `/api_1.0/location/${uuid}.json`,
		response: { name: 'Place', state: 'NSW' },
		expected: { name: 'Place', state: 'NSW' },
		call: () => api.locations.retrieve({ uuid }),
	},
	{
		name: 'materials.list',
		method: 'GET',
		path: '/api_1.0/material.json',
		response: [{ name: 'Material' }],
		expected: { data: [{ name: 'Material' }], nextCursor: cursor },
		call: () => api.materials.list({}),
	},
	{
		name: 'materials.retrieve',
		method: 'GET',
		path: `/api_1.0/material/${uuid}.json`,
		response: { name: 'Material' },
		expected: { name: 'Material' },
		call: () => api.materials.retrieve({ uuid }),
	},
	{
		name: 'tasks.list',
		method: 'GET',
		path: '/api_1.0/task.json',
		response: [{ name: 'Task' }],
		expected: { data: [{ name: 'Task' }], nextCursor: cursor },
		call: () => api.tasks.list({}),
	},
	{
		name: 'jobActivities.retrieve',
		method: 'GET',
		path: `/api_1.0/jobactivity/${uuid}.json`,
		response: { job_uuid: uuid },
		expected: { job_uuid: uuid },
		call: () => api.jobActivities.retrieve({ uuid }),
	},
	{
		name: 'jobPayments.retrieve',
		method: 'GET',
		path: `/api_1.0/jobpayment/${uuid}.json`,
		response: { amount: '12.00' },
		expected: { amount: '12.00' },
		call: () => api.jobPayments.retrieve({ uuid }),
	},
	{
		name: 'jobPayments.create',
		method: 'POST',
		path: '/api_1.0/jobpayment.json',
		body: { amount: '12.00' },
		response: result,
		expected: { result, recordUuid: uuid },
		call: () => api.jobPayments.create({ amount: '12.00' }),
	},
	{
		name: 'jobPayments.update',
		method: 'POST',
		path: `/api_1.0/jobpayment/${uuid}.json`,
		body: { amount: '13.00' },
		response: result,
		expected: result,
		call: () => api.jobPayments.update({ uuid, body: { amount: '13.00' } }),
	},
	{
		name: 'jobPayments.delete',
		method: 'DELETE',
		path: `/api_1.0/jobpayment/${uuid}.json`,
		response: result,
		expected: result,
		call: () => api.jobPayments.delete({ uuid }),
	},
	{
		name: 'staff.retrieve',
		method: 'GET',
		path: `/api_1.0/staff/${uuid}.json`,
		response: { first: 'A', last: 'B' },
		expected: { first: 'A', last: 'B' },
		call: () => api.staff.retrieve({ uuid }),
	},
	{
		name: 'customFields.delete',
		method: 'DELETE',
		path: '/custom_fields_1.0',
		body: `UUID=${uuid}`,
		response: result,
		expected: result,
		oauth: true,
		call: () => oauthApi.customFields.delete({ UUID: uuid }),
	},
];

describe('ServiceM8 public request seam', () => {
	afterEach(() => jest.restoreAllMocks());
	it('covers each registered operation exactly once', () => {
		expect(cases).toHaveLength(28);
		expect(cases.map((test) => test.name).sort()).toEqual(
			Object.keys(serviceM8EndpointSchemas).sort(),
		);
	});
	it('uses the exported schema maps for every operation', () => {
		const keys = Object.keys(serviceM8EndpointSchemas).sort();
		expect(Object.keys(EndpointInputSchemas).sort()).toEqual(keys);
		expect(Object.keys(EndpointOutputSchemas).sort()).toEqual(keys);
		for (const [group, methods] of Object.entries(operations)) {
			for (const [method, op] of Object.entries(methods)) {
				const key = `${group}.${method}` as keyof typeof EndpointInputSchemas;
				expect(op.input).toBe(EndpointInputSchemas[key]);
				expect(op.output).toBe(EndpointOutputSchemas[key]);
			}
		}
	});
	it.each(cases)('$name', async (test) => {
		const request = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response(JSON.stringify(test.response), {
				status: 200,
				headers: { 'x-next-cursor': cursor, 'x-record-uuid': uuid },
			}),
		);
		expect(await test.call()).toEqual(test.expected);
		expect(request).toHaveBeenCalledTimes(1);
		const call = request.mock.calls[0];
		if (!call) throw new Error('Expected a ServiceM8 request');
		const [url, options] = call;
		const parsed = new URL(String(url));
		expect(parsed.origin + parsed.pathname).toBe(
			`https://api.servicem8.com${test.path}`,
		);
		expect(Object.fromEntries(parsed.searchParams)).toEqual(test.query ?? {});
		expect(options?.method).toBe(test.method);
		expect(options?.headers).toMatchObject(
			test.oauth
				? { Authorization: 'Bearer oauth-token' }
				: { 'X-API-Key': 'private-key' },
		);
		if (test.body === undefined) expect(options?.body).toBeUndefined();
		else if (test.oauth) {
			expect(options?.headers).toMatchObject({
				'Content-Type': 'application/x-www-form-urlencoded',
			});
			expect(options?.body).toBe(test.body);
		} else {
			expect(options?.headers).toMatchObject({
				'Content-Type': 'application/json',
			});
			expect(JSON.parse(String(options?.body))).toEqual(test.body);
		}
	});
	it('rejects unsafe route identifiers before HTTP', async () => {
		const request = jest.spyOn(globalThis, 'fetch');
		for (const uuid of ['', '.', '..', 'x/y', 'x\\y', "x'", 'x"']) {
			await expect(api.jobs.retrieve({ uuid })).rejects.toThrow();
		}
		expect(request).not.toHaveBeenCalled();
	});
	it('rejects API-key custom-field deletion before HTTP', async () => {
		const request = jest.spyOn(globalThis, 'fetch');
		await expect(api.customFields.delete({ UUID: uuid })).rejects.toThrow(
			'require OAuth',
		);
		expect(request).not.toHaveBeenCalled();
	});
	it('rejects missing credentials', async () => {
		const noKey = createCorsair({ plugins: [servicem8()] }).servicem8.api;
		await expect(noKey.jobs.list({})).rejects.toMatchObject({
			name: 'AuthMissingError',
			pluginId: 'servicem8',
			authType: 'api_key',
		});
	});
	it('uses a bearer token for ordinary OAuth requests', async () => {
		const request = jest
			.spyOn(globalThis, 'fetch')
			.mockResolvedValue(new Response('[]', { status: 200 }));
		await oauthApi.jobs.list({ cursor: '-1' });
		expect(request.mock.calls[0]?.[1]?.headers).toMatchObject({
			Authorization: 'Bearer oauth-token',
		});
	});
	it('rejects malformed JSON without leaking its content', async () => {
		jest
			.spyOn(globalThis, 'fetch')
			.mockResolvedValue(new Response('private-key', { status: 200 }));
		await expect(api.jobs.list({})).rejects.toThrow(
			'ServiceM8 returned invalid JSON',
		);
	});
	it('propagates rate limits without retrying writes', async () => {
		const request = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response('too many', {
				status: 429,
				headers: { 'retry-after': '3' },
			}),
		);
		await expect(api.jobs.create({ status: 'Quote' })).rejects.toMatchObject({
			status: 429,
			retryAfter: 3000,
		});
		expect(request).toHaveBeenCalledTimes(1);
	});
	it('rejects provider-level errors and malformed outputs', async () => {
		jest
			.spyOn(globalThis, 'fetch')
			.mockResolvedValueOnce(
				new Response(JSON.stringify({ errorCode: 100, message: 'Invalid' }), {
					status: 200,
				}),
			)
			.mockResolvedValueOnce(
				new Response(JSON.stringify({ status: 'unknown' }), { status: 200 }),
			);
		await expect(api.notes.delete({ uuid })).rejects.toBeInstanceOf(
			ServiceM8Error,
		);
		await expect(api.jobs.retrieve({ uuid })).rejects.toThrow(
			'invalid response',
		);
	});
	it('preserves provider error codes from HTTP errors', async () => {
		jest
			.spyOn(globalThis, 'fetch')
			.mockResolvedValue(
				new Response(
					JSON.stringify({ errorCode: 100, message: 'Invalid UUID' }),
					{ status: 400 },
				),
			);
		await expect(
			oauthApi.customFields.delete({ UUID: uuid }),
		).rejects.toMatchObject({ status: 400, providerCode: 100 });
	});
	it('reports the final page without a next cursor', async () => {
		jest
			.spyOn(globalThis, 'fetch')
			.mockResolvedValue(new Response('[]', { status: 200 }));
		await expect(api.jobs.list({ cursor })).resolves.toEqual({
			data: [],
			nextCursor: undefined,
		});
	});
});
