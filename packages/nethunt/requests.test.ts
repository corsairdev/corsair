import type { CorsairEndpoint } from 'corsair/core';
import { asRecord, createCorsair } from 'corsair/core';
import type { NethuntPluginOptions } from './index';
import { nethunt, nethuntEndpointsNested } from './index';
import {
	authTest,
	badCredentials,
	createdCallLog,
	createdComment,
	createdRecord,
	emptyObject,
	folderFields,
	folders,
	recordChanges,
	records,
	updatedRecord,
} from './test-fixtures';

const EMAIL = 'john.doe@example.com';
const API_KEY = 'c3e07232-05d3-40c6-a18b';

function makeContext() {
	return {
		key: API_KEY,
		authType: 'api_key' as const,
		options: { email: EMAIL } as NethuntPluginOptions,
		tenantId: 'default',
		log: async () => undefined,
		db: {},
		keys: { get_email: async () => EMAIL },
		_http: {},
	};
}

// unknown: each operation has its own input and output, and every call site
// passes a concrete value that the operation's schema validates.
type Endpoint = CorsairEndpoint<never, unknown, unknown>;

const endpoints = nethuntEndpointsNested;

/** Runs one endpoint and returns the response and the request that made it. */
async function capture(
	endpoint: Endpoint,
	input: unknown,
	body: unknown,
	{ status = 200, contentType = 'application/json' } = {},
): Promise<{ result: unknown; url: string; init: RequestInit }> {
	const original = globalThis.fetch;
	let url = '';
	let init: RequestInit = {};
	globalThis.fetch = (async (called: string, options: RequestInit) => {
		url = called;
		init = options;
		return new Response(
			typeof body === 'string' ? body : JSON.stringify(body),
			{ status, headers: { 'Content-Type': contentType } },
		);
	}) as typeof fetch;

	try {
		const result = await endpoint(makeContext() as never, input);
		if (!url) throw new Error('no request was made');
		return { result, url, init };
	} finally {
		globalThis.fetch = original;
	}
}

function sentBody(init: RequestInit): Record<string, unknown> {
	// unknown: the body is the JSON the endpoint built; read as a record.
	const parsed = JSON.parse(String(init.body)) as unknown;
	const record = asRecord(parsed);
	if (!record) throw new Error('request body was not an object');
	return record;
}

describe('Nethunt basic auth', () => {
	it('sends the email as the username and the key as the password', async () => {
		const { init } = await capture(endpoints.folders.list, {}, folders);

		const header = new Headers(init.headers).get('authorization');
		expect(header).toMatch(/^Basic /);
		const decoded = Buffer.from(String(header).slice(6), 'base64').toString();
		expect(decoded).toBe(`${EMAIL}:${API_KEY}`);
	});

	it('falls back to the stored email when no option is set', async () => {
		const original = globalThis.fetch;
		let header: string | null = null;
		globalThis.fetch = (async (_url: string, options: RequestInit) => {
			header = new Headers(options.headers).get('authorization');
			return new Response(JSON.stringify(folders), {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			});
		}) as typeof fetch;

		try {
			const ctx = { ...makeContext(), options: {} as NethuntPluginOptions };
			await endpoints.folders.list(ctx as never, {});
			const decoded = Buffer.from(String(header).slice(6), 'base64').toString();
			expect(decoded).toBe(`${EMAIL}:${API_KEY}`);
		} finally {
			globalThis.fetch = original;
		}
	});
});

describe('folders', () => {
	it('lists readable folders from the documented route', async () => {
		const { result, url } = await capture(endpoints.folders.list, {}, folders);

		expect(url).toBe(
			'https://nethunt.com/api/v1/zapier/triggers/readable-folder',
		);
		const list = asRecord(result)?.folders;
		expect(Array.isArray(list) ? list.length : 0).toBe(2);
		expect(asRecord(Array.isArray(list) ? list[0] : null)?.name).toBe('Leads');
	});

	it('switches to the writable route when asked', async () => {
		const { url } = await capture(
			endpoints.folders.list,
			{ writable: true },
			folders,
		);

		expect(url).toContain('/writable-folder');
	});

	it('lists the field names a folder accepts', async () => {
		const { result, url } = await capture(
			endpoints.folders.fields,
			{ folderId: '596f644b8f6d05e16c24b810' },
			folderFields,
		);

		expect(url).toBe(
			'https://nethunt.com/api/v1/zapier/triggers/folder-field/596f644b8f6d05e16c24b810',
		);
		const list = asRecord(result)?.fields;
		expect(Array.isArray(list) ? list.length : 0).toBe(3);
	});
});

describe('records.find', () => {
	it('sends the query and limit', async () => {
		const { result, url } = await capture(
			endpoints.records.find,
			{ folderId: '596f644b8f6d05e16c24b810', query: 'Name:Doe', limit: 10 },
			records,
		);

		const parsed = new URL(url);
		expect(parsed.pathname).toBe(
			'/api/v1/zapier/searches/find-record/596f644b8f6d05e16c24b810',
		);
		expect(parsed.searchParams.get('query')).toBe('Name:Doe');
		expect(parsed.searchParams.get('limit')).toBe('10');
		expect(asRecord(result)?.records).toHaveLength(2);
	});

	it('keeps field values as the folder stored them', async () => {
		const { result } = await capture(
			endpoints.records.find,
			{ folderId: 'f', recordId: '596f644b8f6d05e16c24b830' },
			records,
		);

		const list = asRecord(result)?.records;
		const first = asRecord(Array.isArray(list) ? list[0] : null);
		const fields = asRecord(first?.fields);
		// A number, a boolean and an array all survive the parse.
		expect(fields?.Salary).toBe(100000);
		expect(fields?.Employed).toBe(true);
		expect(fields?.Keywords).toEqual(['Java', 'Big Data']);
	});

	it('rejects a search with neither an id nor a query', async () => {
		await expect(
			endpoints.records.find(makeContext() as never, { folderId: 'f' }),
		).rejects.toThrow(/recordId or query/);
	});
});

describe('records.recent and updated', () => {
	it('sends since and limit for new records', async () => {
		const { url } = await capture(
			endpoints.records.recent,
			{
				folderId: 'f1',
				since: '2026-01-01T00:00:00.000Z',
				limit: 2,
			},
			records,
		);

		const parsed = new URL(url);
		expect(parsed.pathname).toBe('/api/v1/zapier/triggers/new-record/f1');
		expect(parsed.searchParams.get('since')).toBe('2026-01-01T00:00:00.000Z');
	});

	it('repeats fieldName once per field, which NetHunt takes as a list', async () => {
		const { url } = await capture(
			endpoints.records.updated,
			{
				folderId: 'f1',
				fieldNames: ['Primary Email Address', 'Other Email Addresses'],
				since: '2026-01-01T00:00:00.000Z',
			},
			records,
		);

		const parsed = new URL(url);
		expect(parsed.pathname).toBe('/api/v1/zapier/triggers/updated-record/f1');
		expect(parsed.searchParams.getAll('fieldName')).toEqual([
			'Primary Email Address',
			'Other Email Addresses',
		]);
	});

	it('rejects a since that is not an ISO instant', async () => {
		await expect(
			endpoints.records.recent(makeContext() as never, {
				folderId: 'f1',
				since: 'yesterday',
			}),
		).rejects.toThrow();
	});
});

describe('records.changes', () => {
	it('reports the reason for each change, including a delete', async () => {
		const { result, url } = await capture(
			endpoints.records.changes,
			{ folderId: 'f1' },
			recordChanges,
		);

		expect(new URL(url).pathname).toBe(
			'/api/v1/zapier/triggers/record-change/f1',
		);
		const list = asRecord(result)?.changes;
		expect(Array.isArray(list) ? list.length : 0).toBe(2);
		const deletion = asRecord(Array.isArray(list) ? list[1] : null);
		expect(deletion?.recordAction).toBe('DELETE');
	});
});

describe('records.create', () => {
	it('posts a flat field map and the required time zone', async () => {
		const { result, url, init } = await capture(
			endpoints.records.create,
			{
				folderId: '596f644b8f6d05e16c24b810',
				timeZone: 'Europe/London',
				fields: { Name: 'John Doe', Country: 'GB' },
			},
			createdRecord,
		);

		expect(url).toBe(
			'https://nethunt.com/api/v1/zapier/actions/create-record/596f644b8f6d05e16c24b810',
		);
		expect(init.method).toBe('POST');
		const body = sentBody(init);
		expect(body.timeZone).toBe('Europe/London');
		expect(asRecord(body.fields)?.Name).toBe('John Doe');
		expect(asRecord(result)?.recordId).toBe(createdRecord.recordId);
	});

	it('rejects a create without a time zone, which NetHunt requires', async () => {
		await expect(
			// Cast past the type: the point is that the schema refuses a missing
			// timeZone at runtime for a caller passing untyped input.
			endpoints.records.create(
				makeContext() as never,
				{
					folderId: 'f1',
					fields: { Name: 'John Doe' },
				} as never,
			),
		).rejects.toThrow();
	});

	it('rejects a field value that is an object', async () => {
		await expect(
			endpoints.records.create(makeContext() as never, {
				folderId: 'f1',
				timeZone: 'Europe/London',
				fields: { Name: { nested: true } } as never,
			}),
		).rejects.toThrow();
	});
});

describe('records.update', () => {
	it('posts per-field actions, not a flat map', async () => {
		const { result, url, init } = await capture(
			endpoints.records.update,
			{
				recordId: '596f644b8f6d05e16c24b830',
				fieldActions: {
					Salary: { remove: 100000, add: 200000 },
					Keywords: { remove: ['Java'], add: ['JavaScript'] },
				},
			},
			updatedRecord,
		);

		expect(url).toBe(
			'https://nethunt.com/api/v1/zapier/actions/update-record/596f644b8f6d05e16c24b830',
		);
		const body = sentBody(init);
		const actions = asRecord(body.fieldActions);
		expect(asRecord(actions?.Salary)).toEqual({
			remove: 100000,
			add: 200000,
		});
		expect(asRecord(result)?.updatedAt).toBe(updatedRecord.updatedAt);
	});

	it('passes the default overwrite as a query parameter', async () => {
		const { url } = await capture(
			endpoints.records.update,
			{
				recordId: 'r1',
				overwrite: true,
				fieldActions: { Name: { add: 'New Name' } },
			},
			updatedRecord,
		);

		expect(new URL(url).searchParams.get('overwrite')).toBe('true');
	});

	it('rejects overwrite combined with remove, which NetHunt forbids', async () => {
		await expect(
			endpoints.records.update(makeContext() as never, {
				recordId: 'r1',
				fieldActions: {
					Name: { overwrite: true, remove: 'Old', add: 'New' },
				},
			}),
		).rejects.toThrow(/Do not combine/);
	});
});

describe('records.delete', () => {
	it('deletes over POST and reports success from the call that succeeded', async () => {
		const { result, url, init } = await capture(
			endpoints.records.delete,
			{ recordId: '596f644b8f6d05e16c24b830' },
			emptyObject,
		);

		expect(url).toBe(
			'https://nethunt.com/api/v1/zapier/actions/delete-record/596f644b8f6d05e16c24b830',
		);
		expect(init.method).toBe('POST');
		// The body is `{}`, so a parsed flag would be meaningless.
		expect(asRecord(result)?.deleted).toBe(true);
		expect(asRecord(result)?.recordId).toBe('596f644b8f6d05e16c24b830');
	});
});

describe('records.comment and callLog', () => {
	it('posts a comment text', async () => {
		const { result, init } = await capture(
			endpoints.records.comment,
			{ recordId: 'r1', text: "It's a comment" },
			createdComment,
		);

		expect(sentBody(init)).toEqual({ text: "It's a comment" });
		expect(asRecord(result)?.commentId).toBe(createdComment.commentId);
	});

	it('posts a call log with its start time and duration', async () => {
		const { result, init } = await capture(
			endpoints.records.callLog,
			{
				recordId: 'r1',
				text: "It's a call log",
				time: '2026-01-01T12:35:00Z',
				duration: 2.5,
			},
			createdCallLog,
		);

		const body = sentBody(init);
		expect(body.time).toBe('2026-01-01T12:35:00Z');
		expect(body.duration).toBe(2.5);
		expect(asRecord(result)?.callLogId).toBe(createdCallLog.callLogId);
	});

	it('rejects a negative call duration', async () => {
		await expect(
			endpoints.records.callLog(makeContext() as never, {
				recordId: 'r1',
				text: 'call',
				duration: -1,
			}),
		).rejects.toThrow();
	});
});

describe('records.linkThread', () => {
	it('posts the Gmail thread id and reports what was linked', async () => {
		const { result, init } = await capture(
			endpoints.records.linkThread,
			{ recordId: 'r1', gmailThreadId: '1234567890abcdef' },
			emptyObject,
		);

		expect(sentBody(init)).toEqual({ gmailThreadId: '1234567890abcdef' });
		expect(asRecord(result)?.linked).toBe(true);
		expect(asRecord(result)?.gmailThreadId).toBe('1234567890abcdef');
	});
});

describe('account.verify', () => {
	it('lifts the user out of the one-element array', async () => {
		const { result, url } = await capture(
			endpoints.account.verify,
			{},
			authTest,
		);

		expect(url).toBe('https://nethunt.com/api/v1/zapier/triggers/auth-test');
		const user = asRecord(asRecord(result)?.user);
		expect(user?.emailAddress).toBe('john.doe@example.com');
	});

	it('fails loudly on an empty array rather than returning a blank user', async () => {
		await expect(capture(endpoints.account.verify, {}, [])).rejects.toThrow(
			/one-element/,
		);
	});
});

describe('nethunt error reporting', () => {
	it('reads the plain-text 401 body, which is not JSON', async () => {
		const error = await capture(endpoints.folders.list, {}, badCredentials, {
			status: 401,
			contentType: 'text/plain;charset=UTF-8',
		}).catch((caught: unknown) => caught);

		expect(String(error)).toContain(
			'Your email address or API key does not appear to be valid',
		);
		expect(String(error)).toContain('401');
	});

	it('reports a 404 for a folder that does not exist', async () => {
		const error = await capture(
			endpoints.folders.fields,
			{ folderId: 'x' },
			'',
			{
				status: 404,
				contentType: 'text/plain',
			},
		).catch((caught: unknown) => caught);

		expect(String(error)).toContain('404');
	});

	it('does not leak the API key into the error message', async () => {
		const error = await capture(endpoints.folders.list, {}, badCredentials, {
			status: 401,
			contentType: 'text/plain',
		}).catch((caught: unknown) => caught);

		expect(String(error)).not.toContain(API_KEY);
		expect(String(error)).not.toContain(EMAIL);
	});
});

describe('nethunt plugin definition', () => {
	it('registers as nethunt with api_key auth and no webhooks', () => {
		const plugin = nethunt();
		expect(plugin.id).toBe('nethunt');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
	});

	it('declares the email as an account field alongside the key', () => {
		const plugin = nethunt();
		expect(plugin.authConfig).toEqual({ api_key: { account: ['email'] } });
	});

	it('exposes exactly the 13 catalog operations', () => {
		const nested = Object.entries(nethuntEndpointsNested).flatMap(
			([group, fns]) => Object.keys(fns).map((name) => `${group}.${name}`),
		);
		expect(nested.sort()).toEqual([
			'account.verify',
			'folders.fields',
			'folders.list',
			'records.callLog',
			'records.changes',
			'records.comment',
			'records.create',
			'records.delete',
			'records.find',
			'records.linkThread',
			'records.recent',
			'records.update',
			'records.updated',
		]);
	});

	it('marks the delete destructive and irreversible', () => {
		const meta = nethunt().endpointMeta ?? {};
		expect(meta['records.delete']?.riskLevel).toBe('destructive');
		expect(meta['records.delete']?.irreversible).toBe(true);
	});

	it('builds a key from the option, then the stored key, then throws', async () => {
		const plugin = nethunt();
		await expect(
			plugin.keyBuilder?.(
				{
					authType: 'api_key',
					options: {},
					keys: { get_api_key: () => Promise.resolve('stored') },
				} as never,
				'endpoint',
			),
		).resolves.toBe('stored');

		await expect(
			plugin.keyBuilder?.(
				{
					authType: 'api_key',
					options: {},
					keys: { get_api_key: () => Promise.resolve(undefined) },
				} as never,
				'endpoint',
			),
		).rejects.toThrow();
	});

	it('is creatable through createCorsair', () => {
		const corsair = createCorsair({
			plugins: [nethunt({ key: 'k', email: EMAIL })],
		});
		expect(corsair.nethunt).toBeDefined();
	});
});
