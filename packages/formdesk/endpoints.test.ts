import { logEventFromContext } from 'corsair/core';
import type { FormdeskHTTPResult, FormdeskRequestOptions } from './client';
import { makeFormdeskRequest } from './client';
import { Connect, Files, Forms, Results, Users, Visitors } from './endpoints';
import type { FormdeskContext } from './index';
import { formdesk, formdeskEndpointSchemas } from './index';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(),
}));

jest.mock('./client', () => ({
	FORMDESK_API_HOST: 'www.formdesk.com',
	makeFormdeskRequest: jest.fn(),
}));

const mockedRequest = jest.mocked(makeFormdeskRequest);
const mockedLogEvent = jest.mocked(logEventFromContext);
const HOST = 'fd7.formdesk.com';
const DOMAIN = 'apitest';
const API_KEY = 'test-api-key';
const TENANT = { host: HOST, domain: DOMAIN };

type Context = Parameters<typeof Forms.list>[0];
type OperationCase = {
	name: string;
	run: () => Promise<void>;
	host: string;
	options: Partial<FormdeskRequestOptions>;
	payload: FormdeskHTTPResult['payload'];
};

function buildContext(): Context {
	const context: FormdeskContext = {
		endpoints: {},
		$getAccountId: () => Promise.resolve('test-account'),
		key: API_KEY,
		options: {},
		keys: {
			get_dek: () => Promise.resolve('test-dek'),
			issue_new_dek: () => Promise.resolve('test-dek'),
			get_api_key: () => Promise.resolve(API_KEY),
			set_api_key: () => Promise.resolve(),
			get_webhook_signature: () => Promise.resolve(null),
			set_webhook_signature: () => Promise.resolve(),
		},
		db: {},
	};
	return context;
}

const context = buildContext();
const fileContent = {
	kind: 'binary',
	contentType: 'image/png',
	base64: 'AA==',
	byteLength: 1,
} as const;
const formResult = { result: { _fd_id: 17 } };

function operationCase(
	name: string,
	run: () => Promise<void>,
	host: string,
	options: Partial<FormdeskRequestOptions>,
	payload: FormdeskHTTPResult['payload'],
): OperationCase {
	return { name, run, host, options, payload };
}

const operations: OperationCase[] = [
	operationCase(
		'connect.apiKey',
		async () => {
			await Connect.apiKey(context, { domain: DOMAIN });
		},
		'www.formdesk.com',
		{
			method: 'GET',
			path: '/connect',
			domain: DOMAIN,
			apiKey: API_KEY,
			retryable: true,
		},
		{ apikey: 'masked-key', host: HOST },
	),
	operationCase(
		'connect.credentials',
		async () => {
			await Connect.credentials(context, {
				domain: DOMAIN,
				username: 'operator',
				password: 'not-a-real-password',
			});
		},
		'www.formdesk.com',
		{
			method: 'POST',
			path: '/connect',
			apiKey: undefined,
			body: {
				domain: DOMAIN,
				username: 'operator',
				password: 'not-a-real-password',
			},
			retryable: false,
		},
		{ apikey: 'new-api-key', host: HOST },
	),
	operationCase(
		'forms.list',
		async () => {
			await Forms.list(context, TENANT);
		},
		HOST,
		{
			method: 'GET',
			path: '/forms',
			domain: DOMAIN,
			apiKey: API_KEY,
			retryable: true,
		},
		[],
	),
	operationCase(
		'forms.park',
		async () => {
			await Forms.park(context, {
				...TENANT,
				data: { name: 'Ada' },
				expires: 3600,
			});
		},
		HOST,
		{
			method: 'POST',
			path: '/park',
			domain: DOMAIN,
			apiKey: API_KEY,
			body: { data: { name: 'Ada' }, expires: 3600 },
			retryable: false,
		},
		{ ticket: '12345678901234567890123456789012', expires: '2030-01-01' },
	),
	operationCase(
		'forms.items',
		async () => {
			await Forms.items(context, { ...TENANT, form: 'people' });
		},
		HOST,
		{
			method: 'GET',
			path: '/forms/people/items',
			domain: DOMAIN,
			apiKey: API_KEY,
			retryable: true,
		},
		[],
	),
	operationCase(
		'forms.filters',
		async () => {
			await Forms.filters(context, { ...TENANT, form: 'people' });
		},
		HOST,
		{
			method: 'GET',
			path: '/forms/people/filters',
			domain: DOMAIN,
			apiKey: API_KEY,
			retryable: true,
		},
		[],
	),
	operationCase(
		'results.export',
		async () => {
			await Results.export(context, {
				...TENANT,
				form: 'people',
				format: 'csv',
			});
		},
		HOST,
		{
			method: 'POST',
			path: '/forms/people/results/export',
			domain: DOMAIN,
			apiKey: API_KEY,
			body: { format: 'csv' },
			retryable: false,
		},
		{
			files: [
				{
					name: 'people.csv',
					contenttype: 'application/octet-stream',
					content: 'Y29sdW1u',
				},
			],
		},
	),
	operationCase(
		'results.list',
		async () => {
			await Results.list(context, {
				...TENANT,
				form: 'people',
				query: { status: 'DONE', sync_status: 'N,C' },
			});
		},
		HOST,
		{
			method: 'GET',
			path: '/forms/people/results',
			domain: DOMAIN,
			apiKey: API_KEY,
			query: { status: 'DONE', sync_status: 'N,C' },
			retryable: true,
		},
		[],
	),
	operationCase(
		'results.get',
		async () => {
			await Results.get(context, { ...TENANT, entryId: 17 });
		},
		HOST,
		{
			method: 'GET',
			path: '/formresults/17',
			domain: DOMAIN,
			apiKey: API_KEY,
			retryable: true,
		},
		formResult,
	),
	operationCase(
		'results.add',
		async () => {
			await Results.add(context, {
				...TENANT,
				form: 'people',
				data: { name: 'Ada' },
			});
		},
		HOST,
		{
			method: 'POST',
			path: '/forms/people/results/',
			domain: DOMAIN,
			apiKey: API_KEY,
			body: { name: 'Ada' },
			query: { process_messages: undefined },
			retryable: false,
		},
		{ results: [{ _fd_id: 17 }] },
	),
	operationCase(
		'results.update',
		async () => {
			await Results.update(context, {
				...TENANT,
				entryId: 17,
				data: { name: 'Ada' },
			});
		},
		HOST,
		{
			method: 'PUT',
			path: '/formresults/17',
			domain: DOMAIN,
			apiKey: API_KEY,
			body: { name: 'Ada' },
			query: { process_messages: undefined },
			retryable: false,
		},
		{ results: [{ _fd_id: 17 }] },
	),
	operationCase(
		'results.remove',
		async () => {
			await Results.remove(context, { ...TENANT, entryId: 17 });
		},
		HOST,
		{
			method: 'DELETE',
			path: '/formresults/17',
			domain: DOMAIN,
			apiKey: API_KEY,
			retryable: false,
		},
		null,
	),
	operationCase(
		'results.increment',
		async () => {
			await Results.increment(context, {
				...TENANT,
				entryId: 17,
				identifier: 'counter',
				count: 2,
			});
		},
		HOST,
		{
			method: 'PUT',
			path: '/formresults/17/increment',
			domain: DOMAIN,
			apiKey: API_KEY,
			body: { identifier: 'counter', count: 2 },
			retryable: false,
		},
		{ count: 2 },
	),
	operationCase(
		'results.markProcessed',
		async () => {
			await Results.markProcessed(context, { ...TENANT, entryId: 17 });
		},
		HOST,
		{
			method: 'PUT',
			path: '/formresults/17/processed',
			domain: DOMAIN,
			apiKey: API_KEY,
			retryable: false,
		},
		null,
	),
	operationCase(
		'results.pdf',
		async () => {
			await Results.pdf(context, {
				...TENANT,
				entryId: 17,
				settings: { papersize: 'A4' },
			});
		},
		HOST,
		{
			method: 'POST',
			path: '/formresults/17/pdf',
			domain: DOMAIN,
			apiKey: API_KEY,
			body: { papersize: 'A4' },
			binary: true,
			retryable: false,
		},
		fileContent,
	),
	operationCase(
		'results.workflows',
		async () => {
			await Results.workflows(context, { ...TENANT, entryId: 17 });
		},
		HOST,
		{
			method: 'GET',
			path: '/formresults/17/workflow',
			domain: DOMAIN,
			apiKey: API_KEY,
			retryable: true,
		},
		[],
	),
	operationCase(
		'results.files',
		async () => {
			await Results.files(context, { ...TENANT, entryId: 17 });
		},
		HOST,
		{
			method: 'GET',
			path: '/formresults/17/files',
			domain: DOMAIN,
			apiKey: API_KEY,
			retryable: true,
		},
		[],
	),
	operationCase(
		'results.allFiles',
		async () => {
			await Results.allFiles(context, { ...TENANT, form: 'people' });
		},
		HOST,
		{
			method: 'GET',
			path: '/forms/people/files',
			domain: DOMAIN,
			apiKey: API_KEY,
			retryable: true,
		},
		[],
	),
	operationCase(
		'results.deleteFiles',
		async () => {
			await Results.deleteFiles(context, { ...TENANT, entryId: 17 });
		},
		HOST,
		{
			method: 'DELETE',
			path: '/formresults/17/files',
			domain: DOMAIN,
			apiKey: API_KEY,
			retryable: false,
		},
		null,
	),
	operationCase(
		'results.deleteAllFiles',
		async () => {
			await Results.deleteAllFiles(context, { ...TENANT, form: 'people' });
		},
		HOST,
		{
			method: 'DELETE',
			path: '/forms/people/files',
			domain: DOMAIN,
			apiKey: API_KEY,
			retryable: false,
		},
		null,
	),
	operationCase(
		'users.list',
		async () => {
			await Users.list(context, TENANT);
		},
		HOST,
		{
			method: 'GET',
			path: '/users',
			domain: DOMAIN,
			apiKey: API_KEY,
			retryable: true,
		},
		[],
	),
	operationCase(
		'users.get',
		async () => {
			await Users.get(context, { ...TENANT, userId: 17 });
		},
		HOST,
		{
			method: 'GET',
			path: '/users/17',
			domain: DOMAIN,
			apiKey: API_KEY,
			retryable: true,
		},
		{ id: 17 },
	),
	operationCase(
		'users.getExternal',
		async () => {
			await Users.getExternal(context, {
				...TENANT,
				externalUserId: 'external-1',
			});
		},
		HOST,
		{
			method: 'GET',
			path: '/users/external/external-1',
			domain: DOMAIN,
			apiKey: API_KEY,
			retryable: true,
		},
		{ id: 17 },
	),
	operationCase(
		'users.add',
		async () => {
			await Users.add(context, {
				...TENANT,
				user: {
					name: 'Ada',
					email: 'ada@formdesk.invalid',
					username: 'ada',
					password: 'safe-test',
				},
			});
		},
		HOST,
		{
			method: 'POST',
			path: '/users',
			domain: DOMAIN,
			apiKey: API_KEY,
			body: {
				name: 'Ada',
				email: 'ada@formdesk.invalid',
				username: 'ada',
				password: 'safe-test',
			},
			retryable: false,
		},
		{ id: 17 },
	),
	operationCase(
		'users.update',
		async () => {
			await Users.update(context, {
				...TENANT,
				userId: 17,
				user: { name: 'Ada' },
			});
		},
		HOST,
		{
			method: 'PUT',
			path: '/users/17',
			domain: DOMAIN,
			apiKey: API_KEY,
			body: { name: 'Ada' },
			retryable: false,
		},
		{ id: 17 },
	),
	operationCase(
		'users.remove',
		async () => {
			await Users.remove(context, { ...TENANT, userId: 17 });
		},
		HOST,
		{
			method: 'DELETE',
			path: '/users/17',
			domain: DOMAIN,
			apiKey: API_KEY,
			retryable: false,
		},
		null,
	),
	operationCase(
		'users.signOn',
		async () => {
			await Users.signOn(context, {
				...TENANT,
				credentials: { username: 'ada' },
			});
		},
		HOST,
		{
			method: 'POST',
			path: '/signon',
			domain: DOMAIN,
			apiKey: API_KEY,
			body: { username: 'ada' },
			retryable: false,
		},
		{
			id: 'opaque-token',
			url: 'https://www.formdesk.com/tenant/?signon=opaque-token',
		},
	),
	operationCase(
		'visitors.list',
		async () => {
			await Visitors.list(context, TENANT);
		},
		HOST,
		{
			method: 'GET',
			path: '/visitors',
			domain: DOMAIN,
			apiKey: API_KEY,
			retryable: true,
		},
		[],
	),
	operationCase(
		'visitors.get',
		async () => {
			await Visitors.get(context, { ...TENANT, visitorId: 27 });
		},
		HOST,
		{
			method: 'GET',
			path: '/visitors/27',
			domain: DOMAIN,
			apiKey: API_KEY,
			retryable: true,
		},
		{ id: 27 },
	),
	operationCase(
		'visitors.getExternal',
		async () => {
			await Visitors.getExternal(context, {
				...TENANT,
				externalUserId: 'visitor-ext-1',
			});
		},
		HOST,
		{
			method: 'GET',
			path: '/visitors/external/visitor-ext-1',
			domain: DOMAIN,
			apiKey: API_KEY,
			retryable: true,
		},
		{ id: 27 },
	),
	operationCase(
		'visitors.results',
		async () => {
			await Visitors.results(context, { ...TENANT, visitorId: 27 });
		},
		HOST,
		{
			method: 'GET',
			path: '/visitors/27/formresults',
			domain: DOMAIN,
			apiKey: API_KEY,
			retryable: true,
		},
		[{ id: 9, name: 'people', results: [{ id: 19 }] }],
	),
	operationCase(
		'visitors.add',
		async () => {
			await Visitors.add(context, {
				...TENANT,
				visitor: {
					name: 'Ada',
					email: 'ada@formdesk.invalid',
					username: 'ada',
				},
			});
		},
		HOST,
		{
			method: 'POST',
			path: '/visitors',
			domain: DOMAIN,
			apiKey: API_KEY,
			body: { name: 'Ada', email: 'ada@formdesk.invalid', username: 'ada' },
			retryable: false,
		},
		{ id: 27 },
	),
	operationCase(
		'visitors.update',
		async () => {
			await Visitors.update(context, {
				...TENANT,
				visitorId: 27,
				visitor: { name: 'Ada' },
			});
		},
		HOST,
		{
			method: 'PUT',
			path: '/visitors/27',
			domain: DOMAIN,
			apiKey: API_KEY,
			body: { name: 'Ada' },
			retryable: false,
		},
		{ id: 27 },
	),
	operationCase(
		'visitors.remove',
		async () => {
			await Visitors.remove(context, { ...TENANT, visitorId: 27 });
		},
		HOST,
		{
			method: 'DELETE',
			path: '/visitors/27',
			domain: DOMAIN,
			apiKey: API_KEY,
			retryable: false,
		},
		null,
	),
	operationCase(
		'visitors.signOn',
		async () => {
			await Visitors.signOn(context, {
				...TENANT,
				form: 'people',
				credentials: { username: 'ada' },
			});
		},
		HOST,
		{
			method: 'POST',
			path: '/forms/people/signon',
			domain: DOMAIN,
			apiKey: API_KEY,
			body: { username: 'ada' },
			retryable: false,
		},
		{
			id: 'opaque-token',
			url: 'https://www.formdesk.com/tenant/people/?signon=opaque-token',
		},
	),
	operationCase(
		'files.list',
		async () => {
			await Files.list(context, { ...TENANT, type: 'all' });
		},
		HOST,
		{
			method: 'GET',
			path: '/files',
			domain: DOMAIN,
			apiKey: API_KEY,
			query: { type: 'all' },
			retryable: true,
		},
		[],
	),
	operationCase(
		'files.get',
		async () => {
			await Files.get(context, { ...TENANT, fileId: 42 });
		},
		HOST,
		{
			method: 'GET',
			path: '/files/42',
			domain: DOMAIN,
			apiKey: API_KEY,
			retryable: true,
		},
		{ id: 42 },
	),
	operationCase(
		'files.content',
		async () => {
			await Files.content(context, { ...TENANT, fileId: 42 });
		},
		HOST,
		{
			method: 'GET',
			path: '/files/42/content',
			domain: DOMAIN,
			apiKey: API_KEY,
			binary: true,
			retryable: true,
		},
		fileContent,
	),
	operationCase(
		'files.remove',
		async () => {
			await Files.remove(context, { ...TENANT, fileId: 42 });
		},
		HOST,
		{
			method: 'DELETE',
			path: '/files/42',
			domain: DOMAIN,
			apiKey: API_KEY,
			retryable: false,
		},
		null,
	),
];

beforeEach(() => {
	mockedRequest.mockReset();
	mockedLogEvent.mockReset();
});

describe('REST v1 operation matrix', () => {
	it.each(operations)(
		'$name sends the documented request and parses its response',
		async (testCase) => {
			mockedRequest.mockResolvedValue({
				payload: testCase.payload,
				creditsRemaining: 4999,
			});

			await testCase.run();

			expect(mockedRequest).toHaveBeenCalledTimes(1);
			expect(mockedRequest).toHaveBeenCalledWith(
				testCase.host,
				expect.objectContaining(testCase.options),
			);
			expect(mockedLogEvent).toHaveBeenCalledTimes(1);
			expect(mockedLogEvent.mock.calls[0]?.[2]).toEqual({
				creditsRemaining: 4999,
			});
		},
	);

	it('validates input before I/O and rejects undocumented top-level fields', async () => {
		const inputWithUndocumentedField = {
			...TENANT,
			webhookUrl: 'https://bad.invalid',
		};
		await expect(
			Forms.list(context, inputWithUndocumentedField),
		).rejects.toThrow();
		await expect(
			Results.add(context, {
				...TENANT,
				form: 'people',
				data: Array.from({ length: 11 }, (_, index) => ({ value: index })),
			}),
		).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('drops optional fields passed as undefined instead of rejecting the body', async () => {
		mockedRequest.mockResolvedValue({
			payload: { id: 7, name: 'Ada' },
			creditsRemaining: 5,
		});
		await Users.update(context, {
			...TENANT,
			userId: 7,
			user: { name: 'Ada', email: undefined },
		});
		await Visitors.update(context, {
			...TENANT,
			visitorId: 7,
			visitor: { name: 'Ada', email: undefined },
		});
		mockedRequest.mockResolvedValue({
			payload: { id: 'abc', url: 'https://www.formdesk.com/apitest/' },
			creditsRemaining: 5,
		});
		await Users.signOn(context, {
			...TENANT,
			credentials: { username: 'ada', password: undefined },
		});
		mockedRequest.mockResolvedValue({
			payload: fileContent,
			creditsRemaining: 5,
		});
		await Results.pdf(context, {
			...TENANT,
			entryId: 17,
			settings: { papersize: 'A4', scaling: undefined },
		});
		expect(mockedRequest.mock.calls.map(([, options]) => options.body)).toEqual(
			[
				{ name: 'Ada' },
				{ name: 'Ada' },
				{ username: 'ada' },
				{ papersize: 'A4' },
			],
		);
	});

	it('parses the live users.add response, which has a null lastlogin', async () => {
		mockedRequest.mockResolvedValue({
			payload: {
				meta: {
					resourceType: 'User',
					created: null,
					createdUtc: 'NULL',
					lastModified: null,
					lastModifiedUtc: 'NULL',
					location: 'https://fd7.formdesk.com/api/rest/v1/apitest/users/',
				},
				id: 0,
				uuid: '',
				active: true,
				type: 'api',
				firstname: '',
				name: 'corsair-plugin-test',
				email: '',
				username: '',
				allow_createform: false,
				template: 0,
				apikey: '',
				external_userid: '',
				external_force: false,
				external_provider: '',
				lastlogin: null,
			},
			creditsRemaining: 60,
		});
		const user = await Users.add(context, {
			...TENANT,
			user: { type: 'API', name: 'corsair-plugin-test' },
		});
		expect(user.lastlogin).toBeNull();
	});

	it('rejects invalid provider output before logging completion', async () => {
		mockedRequest.mockResolvedValue({
			payload: [{ id: 1 }],
			creditsRemaining: 10,
		});
		await expect(Forms.list(context, TENANT)).rejects.toThrow();
		expect(mockedLogEvent).not.toHaveBeenCalled();
	});

	it('does not log form values, passwords, API keys, or credentials', async () => {
		mockedRequest.mockResolvedValue({
			payload: { results: [{ _fd_id: 17, name: 'SENSITIVE-NAME' }] },
			creditsRemaining: 3,
		});
		await Results.add(context, {
			...TENANT,
			form: 'people',
			data: { name: 'SENSITIVE-NAME', password: 'SENSITIVE-PASSWORD' },
		});
		const loggedPayload = mockedLogEvent.mock.calls[0]?.[2];
		expect(loggedPayload).toEqual({ creditsRemaining: 3 });
		expect(JSON.stringify(loggedPayload)).not.toContain('SENSITIVE');
	});

	it('keeps endpoint registrations, schemas, and metadata synchronized', () => {
		const plugin = formdesk();
		expect(Object.keys(formdeskEndpointSchemas)).toHaveLength(39);
		expect(Object.keys(plugin.endpointMeta ?? {}).sort()).toEqual(
			Object.keys(formdeskEndpointSchemas).sort(),
		);
		expect(plugin.webhooks).toEqual({});
		expect(plugin.endpoints?.results.deleteAllFiles).toBeDefined();
	});
});
