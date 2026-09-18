import { zohobigin } from './index';

const fileBlob = new Blob(['hello'], { type: 'text/plain' });

type Case = {
	key: string;
	method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	path: string;
	input: unknown;
	response: unknown;
};

const actionResponse = {
	data: [
		{
			code: 'SUCCESS',
			details: { id: '1' },
			message: 'ok',
			status: 'success',
		},
	],
};

const recordListResponse = {
	data: [{ id: '1' }],
	info: { page: 1, per_page: 1, count: 1, more_records: false },
};

const cases: Case[] = [
	{
		key: 'records.add',
		method: 'POST',
		path: '/Contacts',
		input: { module: 'Contacts', data: [{ Last_Name: 'A' }] },
		response: actionResponse,
	},
	{
		key: 'records.get',
		method: 'GET',
		path: '/Contacts',
		input: { module: 'Contacts', page: 1 },
		response: recordListResponse,
	},
	{
		key: 'records.getRecord',
		method: 'GET',
		path: '/Contacts/1',
		input: { module: 'Contacts', id: '1' },
		response: { data: [{ id: '1' }] },
	},
	{
		key: 'records.update',
		method: 'PUT',
		path: '/Contacts',
		input: { module: 'Contacts', data: [{ id: '1', Last_Name: 'B' }] },
		response: actionResponse,
	},
	{
		key: 'records.updateRecord',
		method: 'PUT',
		path: '/Contacts/1',
		input: { module: 'Contacts', id: '1', data: { Last_Name: 'B' } },
		response: actionResponse,
	},
	{
		key: 'records.delete',
		method: 'DELETE',
		path: '/Contacts',
		input: { module: 'Contacts', ids: ['1'] },
		response: actionResponse,
	},
	{
		key: 'records.deleteRecord',
		method: 'DELETE',
		path: '/Contacts/1',
		input: { module: 'Contacts', id: '1' },
		response: actionResponse,
	},
	{
		key: 'records.deletePhoto',
		method: 'DELETE',
		path: '/Contacts/1/photo',
		input: { module: 'Contacts', id: '1' },
		response: { code: 'SUCCESS', message: 'ok', status: 'success' },
	},
	{
		key: 'records.downloadPhoto',
		method: 'GET',
		path: '/Contacts/1/photo',
		input: { module: 'Contacts', id: '1' },
		response: { bytes: 'aGVsbG8=' },
	},
	{
		key: 'records.uploadPhoto',
		method: 'POST',
		path: '/Contacts/1/photo',
		input: { module: 'Contacts', id: '1', file: fileBlob },
		response: { code: 'SUCCESS', message: 'ok', status: 'success' },
	},
	{
		key: 'records.getDeleted',
		method: 'GET',
		path: '/Contacts/deleted',
		input: { module: 'Contacts', page: 1 },
		response: { data: [{ id: '1' }], info: {} },
	},
	{
		key: 'records.count',
		method: 'GET',
		path: '/Contacts/actions/count',
		input: { module: 'Contacts' },
		response: { count: 1 },
	},
	{
		key: 'records.search',
		method: 'GET',
		path: '/Contacts/search',
		input: { module: 'Contacts', word: 'alice' },
		response: recordListResponse,
	},
	{
		key: 'records.upsert',
		method: 'POST',
		path: '/Contacts/upsert',
		input: { module: 'Contacts', data: [{ Last_Name: 'A' }] },
		response: actionResponse,
	},
	{
		key: 'records.getRelated',
		method: 'GET',
		path: '/Contacts/1/Notes',
		input: { module: 'Contacts', recordId: '1', relatedList: 'Notes' },
		response: recordListResponse,
	},
	{
		key: 'records.updateRelated',
		method: 'PUT',
		path: '/Contacts/1/Notes',
		input: {
			module: 'Contacts',
			recordId: '1',
			relatedList: 'Notes',
			data: [{ id: '2' }],
		},
		response: actionResponse,
	},
	{
		key: 'records.getPipelines',
		method: 'GET',
		path: '/Pipelines',
		input: { page: 1 },
		response: recordListResponse,
	},
	{
		key: 'notes.create',
		method: 'POST',
		path: '/Notes',
		input: { data: [{ Note_Content: 'note body' }] },
		response: actionResponse,
	},
	{
		key: 'notes.createRecordNotes',
		method: 'POST',
		path: '/Contacts/1/Notes',
		input: {
			module: 'Contacts',
			recordId: '1',
			data: { Note_Content: 'note body' },
		},
		response: actionResponse,
	},
	{
		key: 'notes.delete',
		method: 'DELETE',
		path: '/Notes',
		input: { ids: ['n1'] },
		response: actionResponse,
	},
	{
		key: 'notes.deleteRecordNote',
		method: 'DELETE',
		path: '/Contacts/1/Notes/n1',
		input: { module: 'Contacts', recordId: '1', noteId: 'n1' },
		response: actionResponse,
	},
	{
		key: 'notes.getAll',
		method: 'GET',
		path: '/Notes',
		input: { page: 1 },
		response: { data: [{ id: 'n1' }], info: {} },
	},
	{
		key: 'notes.getRecordNotes',
		method: 'GET',
		path: '/Contacts/1/Notes',
		input: { module: 'Contacts', recordId: '1' },
		response: { data: [{ id: 'n1' }], info: {} },
	},
	{
		key: 'notes.update',
		method: 'PUT',
		path: '/Contacts/1/Notes/n1',
		input: {
			module: 'Contacts',
			recordId: '1',
			noteId: 'n1',
			data: { Note_Content: 'updated' },
		},
		response: actionResponse,
	},
	{
		key: 'tags.create',
		method: 'POST',
		path: '/settings/tags',
		input: { module: 'Contacts', tags: [{ name: 'vip' }] },
		response: {
			tags: [
				{
					code: 'SUCCESS',
					details: { id: 't1' },
					message: 'ok',
					status: 'success',
				},
			],
		},
	},
	{
		key: 'tags.addToRecords',
		method: 'POST',
		path: '/Contacts/1/actions/add_tags',
		input: {
			module: 'Contacts',
			recordId: '1',
			tags: [{ name: 'vip' }],
			overWrite: true,
		},
		response: actionResponse,
	},
	{
		key: 'tags.delinkRelated',
		method: 'DELETE',
		path: '/Contacts/1/Products/2',
		input: {
			module: 'Contacts',
			recordId: '1',
			relatedList: 'Products',
			relatedRecordId: '2',
		},
		response: actionResponse,
	},
	{
		key: 'attachments.get',
		method: 'GET',
		path: '/Contacts/1/Attachments',
		input: { module: 'Contacts', recordId: '1' },
		response: { data: [{ id: 'a1' }], info: {} },
	},
	{
		key: 'attachments.delete',
		method: 'DELETE',
		path: '/Contacts/1/Attachments/a1',
		input: { module: 'Contacts', recordId: '1', attachmentId: 'a1' },
		response: actionResponse,
	},
	{
		key: 'attachments.download',
		method: 'GET',
		path: '/Contacts/1/Attachments/a1',
		input: { module: 'Contacts', recordId: '1', attachmentId: 'a1' },
		response: { bytes: 'aGVsbG8=' },
	},
	{
		key: 'attachments.upload',
		method: 'POST',
		path: '/Contacts/1/Attachments',
		input: { module: 'Contacts', recordId: '1', file: fileBlob },
		response: actionResponse,
	},
	{
		key: 'bulk.createReadJob',
		method: 'POST',
		path: '/read',
		input: { module: 'Contacts' },
		response: actionResponse,
	},
	{
		key: 'bulk.downloadReadResult',
		method: 'GET',
		path: '/read/job-1/result',
		input: { job_id: 'job-1' },
		response: { download_url: 'https://example.com/file.zip' },
	},
	{
		key: 'bulk.getReadJobStatus',
		method: 'GET',
		path: '/read/job-1',
		input: { job_id: 'job-1' },
		response: actionResponse,
	},
	{
		key: 'notifications.enable',
		method: 'POST',
		path: '/actions/watch',
		input: {
			watch: [
				{
					channel_id: 'c1',
					events: ['Contacts.create'],
					notify_url: 'https://example.com/webhook',
					channel_expiry: '2028-01-01T00:00:00+00:00',
				},
			],
		},
		response: actionResponse,
	},
	{
		key: 'notifications.disable',
		method: 'DELETE',
		path: '/actions/watch',
		input: { channel_ids: ['c1'] },
		response: actionResponse,
	},
	{
		key: 'notifications.getDetails',
		method: 'GET',
		path: '/actions/watch',
		input: { module: 'Contacts' },
		response: { watch: [{ channel_id: 'c1' }], info: {} },
	},
	{
		key: 'notifications.updateDetails',
		method: 'PUT',
		path: '/actions/watch',
		input: {
			watch: [
				{
					channel_id: 'c1',
					events: ['Contacts.edit'],
					notify_url: 'https://example.com/webhook',
				},
			],
		},
		response: actionResponse,
	},
	{
		key: 'notifications.updateInfo',
		method: 'PATCH',
		path: '/actions/watch',
		input: {
			watch: [
				{
					channel_id: 'c1',
					events: ['Contacts.delete'],
					notify_url: 'https://example.com/webhook',
				},
			],
		},
		response: actionResponse,
	},
	{
		key: 'metadata.getModules',
		method: 'GET',
		path: '/settings/modules',
		input: undefined,
		response: { modules: [{ api_name: 'Contacts' }] },
	},
	{
		key: 'metadata.getModule',
		method: 'GET',
		path: '/settings/modules/Contacts',
		input: { module: 'Contacts' },
		response: { modules: [{ api_name: 'Contacts' }] },
	},
	{
		key: 'metadata.getFields',
		method: 'GET',
		path: '/settings/fields',
		input: { module: 'Contacts' },
		response: { fields: [{ api_name: 'Last_Name' }] },
	},
	{
		key: 'metadata.getLayouts',
		method: 'GET',
		path: '/settings/layouts',
		input: { module: 'Contacts' },
		response: { layouts: [{ id: 'l1' }] },
	},
	{
		key: 'metadata.getLayout',
		method: 'GET',
		path: '/settings/layouts/l1',
		input: { module: 'Contacts', layoutId: 'l1' },
		response: { layouts: [{ id: 'l1' }] },
	},
	{
		key: 'metadata.getCustomViews',
		method: 'GET',
		path: '/settings/custom_views',
		input: { module: 'Contacts' },
		response: { custom_views: [{ id: 'v1' }] },
	},
	{
		key: 'metadata.getCustomView',
		method: 'GET',
		path: '/settings/custom_views/v1',
		input: { module: 'Contacts', viewId: 'v1' },
		response: { custom_views: [{ id: 'v1' }] },
	},
	{
		key: 'metadata.getRelatedLists',
		method: 'GET',
		path: '/settings/related_lists',
		input: { module: 'Contacts' },
		response: { related_lists: [{ api_name: 'Notes' }] },
	},
	{
		key: 'users.getUsers',
		method: 'GET',
		path: '/users',
		input: { type: 'ActiveUsers' },
		response: { users: [{ id: 'u1' }], info: {} },
	},
	{
		key: 'users.getUser',
		method: 'GET',
		path: '/users/u1',
		input: { id: 'u1' },
		response: { users: [{ id: 'u1' }] },
	},
	{
		key: 'users.updateUser',
		method: 'PUT',
		path: '/users/u1',
		input: { id: 'u1', data: { last_name: 'A' } },
		response: { users: [{ id: 'u1' }] },
	},
	{
		key: 'users.updateUsers',
		method: 'PUT',
		path: '/users',
		input: { users: [{ id: 'u1', last_name: 'A' }] },
		response: { users: [{ id: 'u1' }] },
	},
	{
		key: 'users.getRoles',
		method: 'GET',
		path: '/settings/roles',
		input: undefined,
		response: { roles: [{ id: 'r1' }] },
	},
	{
		key: 'users.getProfiles',
		method: 'GET',
		path: '/settings/profiles',
		input: undefined,
		response: { profiles: [{ id: 'p1' }] },
	},
	{
		key: 'users.getOrganization',
		method: 'GET',
		path: '/org',
		input: undefined,
		response: { org: [{ id: 'o1' }] },
	},
	{
		key: 'users.uploadOrgPhoto',
		method: 'POST',
		path: '/org/photo',
		input: { file: fileBlob },
		response: { code: 'SUCCESS', message: 'ok', status: 'success' },
	},
];

function endpoint(
	plugin: ReturnType<typeof zohobigin>,
	key: string,
): (ctx: unknown, input: unknown) => Promise<unknown> {
	const [group, name] = key.split('.');
	const node = (plugin.endpoints as Record<string, Record<string, unknown>>)[
		group ?? ''
	];
	const fn = node?.[name ?? ''];
	if (typeof fn !== 'function') throw new Error(`missing endpoint: ${key}`);
	return fn as (ctx: unknown, input: unknown) => Promise<unknown>;
}

function jsonResponse(payload: unknown) {
	return {
		ok: true,
		status: 200,
		statusText: 'OK',
		headers: new Headers({ 'content-type': 'application/json' }),
		text: async () => JSON.stringify(payload),
		json: async () => payload,
		arrayBuffer: async () => Buffer.from(JSON.stringify(payload)),
	} as unknown as Response;
}

describe('zohobigin endpoints', () => {
	const originalFetch = globalThis.fetch;
	const plugin = zohobigin();
	const ctx = {
		key: 'token',
		db: {},
		$getAccountId: async () => 'acct-1',
		database: {
			db: {
				insertInto: jest.fn(() => ({
					values: jest.fn(() => ({ execute: jest.fn().mockResolvedValue({}) })),
				})),
			},
		},
	};

	beforeEach(() => {
		globalThis.fetch = jest.fn();
	});

	afterEach(() => {
		globalThis.fetch = originalFetch;
	});

	it('covers all 54 operations from claim of record', () => {
		expect(Object.keys(plugin.endpointMeta ?? {}).sort()).toEqual(
			cases.map((item) => item.key).sort(),
		);
		expect(cases).toHaveLength(Object.keys(plugin.endpointMeta ?? {}).length);
	});

	it.each(cases)('$key calls $method $path', async (testCase) => {
		jest
			.mocked(globalThis.fetch)
			.mockResolvedValueOnce(jsonResponse(testCase.response));

		await endpoint(plugin, testCase.key)(ctx, testCase.input);

		const [url, init] = jest.mocked(globalThis.fetch).mock.calls[0] ?? [];
		expect(String(url)).toContain(testCase.path);
		expect((init as RequestInit | undefined)?.method ?? 'GET').toBe(
			testCase.method,
		);
	});

	it('sends upload operations as multipart form-data', async () => {
		jest.mocked(globalThis.fetch).mockResolvedValueOnce(
			jsonResponse({
				data: [
					{ code: 'SUCCESS', details: {}, message: 'ok', status: 'success' },
				],
			}),
		);
		jest
			.mocked(globalThis.fetch)
			.mockResolvedValueOnce(
				jsonResponse({ code: 'SUCCESS', message: 'ok', status: 'success' }),
			);
		jest
			.mocked(globalThis.fetch)
			.mockResolvedValueOnce(
				jsonResponse({ code: 'SUCCESS', message: 'ok', status: 'success' }),
			);

		await endpoint(plugin, 'attachments.upload')(ctx, {
			module: 'Contacts',
			recordId: '1',
			file: fileBlob,
		});
		await endpoint(plugin, 'records.uploadPhoto')(ctx, {
			module: 'Contacts',
			id: '1',
			file: fileBlob,
		});
		await endpoint(plugin, 'users.uploadOrgPhoto')(ctx, { file: fileBlob });

		for (const [, init] of jest.mocked(globalThis.fetch).mock.calls) {
			const body = (init as RequestInit | undefined)?.body;
			expect(body instanceof FormData).toBe(true);
		}
	});

	it('accepts attachment URL upload with canonical multipart key', async () => {
		jest
			.mocked(globalThis.fetch)
			.mockResolvedValueOnce(jsonResponse(actionResponse));

		await endpoint(plugin, 'attachments.upload')(ctx, {
			module: 'Contacts',
			recordId: '1',
			attachment_url: 'https://example.com/a.pdf',
		});

		const [, init] = jest.mocked(globalThis.fetch).mock.calls[0] ?? [];
		const body = (init as RequestInit | undefined)?.body as FormData;
		expect(body.get('attachmentUrl')).toBe('https://example.com/a.pdf');
	});

	it('validates endpoint input before calling provider', async () => {
		await expect(endpoint(plugin, 'records.get')(ctx, {})).rejects.toThrow();
		await expect(
			endpoint(plugin, 'records.search')(ctx, { module: 'Contacts' }),
		).rejects.toThrow('Provide a search filter');
		expect(globalThis.fetch).not.toHaveBeenCalled();
	});

	it('validates endpoint output from provider responses', async () => {
		jest
			.mocked(globalThis.fetch)
			.mockResolvedValueOnce(jsonResponse({ foo: 'bar' }));
		await expect(
			endpoint(plugin, 'users.getRoles')(ctx, undefined),
		).rejects.toThrow();
	});

	it('accepts binder empty-object input for void endpoints', async () => {
		jest
			.mocked(globalThis.fetch)
			.mockResolvedValueOnce(jsonResponse({ roles: [] }))
			.mockResolvedValueOnce(jsonResponse({ profiles: [] }))
			.mockResolvedValueOnce(jsonResponse({ org: [] }))
			.mockResolvedValueOnce(jsonResponse({ modules: [] }));

		await expect(endpoint(plugin, 'users.getRoles')(ctx, {})).resolves.toEqual({
			roles: [],
		});
		await expect(
			endpoint(plugin, 'users.getProfiles')(ctx, {}),
		).resolves.toEqual({ profiles: [] });
		await expect(
			endpoint(plugin, 'users.getOrganization')(ctx, {}),
		).resolves.toEqual({ org: [] });
		await expect(
			endpoint(plugin, 'metadata.getModules')(ctx, {}),
		).resolves.toEqual({ modules: [] });
	});

	it('merges custom error handlers from plugin options', async () => {
		const customPlugin = zohobigin({
			errorHandlers: {
				DEFAULT: {
					match: () => true,
					handler: async () => ({ maxRetries: 99 }),
				},
			},
		});

		const retry = await customPlugin.errorHandlers?.DEFAULT?.handler(
			new Error('x'),
			{
				pluginId: 'zohobigin',
				operation: 'records.get',
				input: {},
				originalError: new Error('x'),
			},
		);
		expect(retry).toEqual({ maxRetries: 99 });
		expect(customPlugin.authConfig?.api_key).toBeUndefined();
	});
});
