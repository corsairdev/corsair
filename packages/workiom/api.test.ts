import { AuthMissingError, logEventFromContext } from 'corsair/core';
import {
	makeWorkiomRequest,
	WorkiomAPIError,
	WorkiomRateLimitError,
} from './client';
import { getAll as appsGetAll } from './endpoints/apps';
import { get as listsGet, getAll as listsGetAll } from './endpoints/lists';
import {
	create as recordsCreate,
	getAll as recordsGetAll,
	update as recordsUpdate,
} from './endpoints/records';
import {
	WorkiomEndpointInputSchemas,
	WorkiomEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { workiom } from './index';

jest.mock('corsair/core', () => {
	class AuthMissingError extends Error {
		constructor(plugin: string, authType: string) {
			super(`Missing ${authType} for ${plugin}`);
			this.name = 'AuthMissingError';
		}
	}
	return {
		AuthMissingError,
		logEventFromContext: jest.fn(),
	};
});

const mockFetch = jest.fn();
const originalFetch = globalThis.fetch;

beforeAll(() => {
	globalThis.fetch = mockFetch as typeof fetch;
});

afterAll(() => {
	globalThis.fetch = originalFetch;
});

beforeEach(() => {
	mockFetch.mockReset();
	jest.mocked(logEventFromContext).mockReset();
});

function jsonResponse(body: unknown, init?: ResponseInit): Response {
	return new Response(JSON.stringify(body), {
		status: 200,
		...init,
		headers: {
			'Content-Type': 'application/json',
			...(init?.headers as Record<string, string>),
		},
	});
}

function lastCall(): { url: string; method: string; apiKey: string | null } {
	expect(mockFetch).toHaveBeenCalled();
	const [input, init] = mockFetch.mock.calls[0] as [
		string,
		RequestInit | undefined,
	];
	const headers = new Headers(init?.headers);
	return {
		url: input,
		method: init?.method ?? 'GET',
		apiKey: headers.get('X-Api-Key'),
	};
}

const ctx = {
	key: 'test-key',
	$getAccountId: async () => 'test-account',
} as never;

const officialList = {
	appId: 'app-1',
	id: 'list-1',
	name: 'Tasks',
	description: 'Work items',
	fields: [{ id: 1425, name: 'Title', dataType: 0 }],
};

const officialRecordPage = {
	summary: { additionalProp1: 0 },
	totalCount: 1,
	items: [
		{
			_id: 'rec-1',
			'1425': 'Ahmad Masa',
		},
	],
};

describe('Workiom plugin', () => {
	it('exposes apps, lists, and records ops with api_key auth', () => {
		const plugin = workiom({ key: 'test-key' });
		expect(plugin.id).toBe('workiom');
		expect(plugin.authConfig?.api_key?.account).toEqual(['one']);
		expect(plugin.endpoints?.apps.getAll).toBeDefined();
		expect(plugin.endpoints?.lists.get).toBeDefined();
		expect(plugin.endpoints?.lists.getAll).toBeDefined();
		expect(plugin.endpoints?.records.getAll).toBeDefined();
		expect(plugin.endpoints?.records.create).toBeDefined();
		expect(plugin.endpoints?.records.update).toBeDefined();
	});

	it('throws AuthMissingError when no API key is stored', async () => {
		const plugin = workiom();
		await expect(
			plugin.keyBuilder?.(
				{
					authType: 'api_key',
					keys: { get_api_key: async () => undefined },
				} as never,
				'endpoint',
			),
		).rejects.toThrow(AuthMissingError);
	});

	it('lists apps from GET Apps/GetAll and unwraps ABP result.items', async () => {
		mockFetch.mockResolvedValue(
			jsonResponse({
				result: { items: [{ id: 'app-1', name: 'CRM' }] },
				success: true,
				__abp: true,
			}),
		);

		const result = await appsGetAll(ctx, {});
		expect(result.items[0]?.id).toBe('app-1');
		WorkiomEndpointOutputSchemas.appsGetAll.parse(result);
		expect(lastCall().url).toBe(
			'https://api.workiom.com/api/services/app/Apps/GetAll',
		);
	});

	it('gets list metadata from GET Lists/Get with Fields,Views,Filters', async () => {
		mockFetch.mockResolvedValue(
			jsonResponse({
				result: officialList,
				success: true,
				__abp: true,
			}),
		);

		const input = WorkiomEndpointInputSchemas.listsGet.parse({ id: 'list-1' });
		const result = await listsGet(ctx, input);
		expect(result.fields?.[0]?.id).toBe(1425);
		WorkiomEndpointOutputSchemas.listsGet.parse(result);
		expect(lastCall().url).toBe(
			'https://api.workiom.com/api/services/app/Lists/Get?id=list-1&expand=Fields%2CViews%2CFilters',
		);
	});

	it('lists lists from GET Lists/GetAll and unwraps ABP result.items', async () => {
		mockFetch.mockResolvedValue(
			jsonResponse({
				result: { items: [officialList] },
				success: true,
				__abp: true,
			}),
		);

		const input = WorkiomEndpointInputSchemas.listsGetAll.parse({
			appId: 'app-1',
		});
		const result = await listsGetAll(ctx, input);
		expect(result.items[0]?.id).toBe('list-1');
		WorkiomEndpointOutputSchemas.listsGetAll.parse(result);

		const req = lastCall();
		expect(req.method).toBe('GET');
		expect(req.url).toBe(
			'https://api.workiom.com/api/services/app/Lists/GetAll?appId=app-1',
		);
		expect(req.apiKey).toBe('test-key');
	});

	it('gets records from POST Data/All with pagination and filters', async () => {
		mockFetch.mockResolvedValue(
			jsonResponse({
				result: officialRecordPage,
				success: true,
				__abp: true,
			}),
		);

		const input = WorkiomEndpointInputSchemas.recordsGetAll.parse({
			listId: 'list-1',
			sorting: '1425 ASC',
			maxResultCount: 10,
			skipCount: 0,
			filters: [{ fieldId: 1425, operator: 1, value: 'Ahmad Masa' }],
		});
		const result = await recordsGetAll(ctx, input);
		expect(result.totalCount).toBe(1);
		expect(result.items[0]?.['1425']).toBe('Ahmad Masa');
		WorkiomEndpointOutputSchemas.recordsGetAll.parse(result);

		const req = lastCall();
		expect(req.method).toBe('POST');
		expect(req.url).toBe('https://api.workiom.com/api/services/app/Data/All');
		const [, init] = mockFetch.mock.calls[0] as [string, RequestInit];
		expect(JSON.parse(String(init.body))).toEqual({
			listId: 'list-1',
			sorting: '1425 ASC',
			maxResultCount: 10,
			skipCount: 0,
			filters: [{ fieldId: 1425, operator: 1, value: 'Ahmad Masa' }],
		});
		expect(jest.mocked(logEventFromContext).mock.calls[0]?.[2]).toEqual({
			listId: 'list-1',
			filterCount: 1,
			filterFieldIds: [1425],
			sorting: '1425 ASC',
			maxResultCount: 10,
			skipCount: 0,
		});
	});

	it('creates a record via POST Data/Create?listId=', async () => {
		mockFetch.mockResolvedValue(
			jsonResponse({
				result: { _id: 'rec-2', '1425': 'Ahmad Lam', '1532': 132 },
				success: true,
				__abp: true,
			}),
		);

		const input = WorkiomEndpointInputSchemas.recordsCreate.parse({
			listId: 'list-1',
			record: { '1425': 'Ahmad Lam', '1532': 132 },
		});
		const result = await recordsCreate(ctx, input);
		expect(result._id).toBe('rec-2');
		WorkiomEndpointOutputSchemas.recordsCreate.parse(result);

		const req = lastCall();
		expect(req.method).toBe('POST');
		expect(req.url).toBe(
			'https://api.workiom.com/api/services/app/Data/Create?listId=list-1',
		);
	});

	it('updates a record via PUT Data/Update?listId=&id=', async () => {
		mockFetch.mockResolvedValue(
			jsonResponse({
				result: { _id: 'rec-2', '1425': 'Ahmad Lam' },
				success: true,
				__abp: true,
			}),
		);

		const input = WorkiomEndpointInputSchemas.recordsUpdate.parse({
			listId: 'list-1',
			id: 'rec-2',
			record: { '1425': 'Ahmad Lam' },
		});
		const result = await recordsUpdate(ctx, input);
		expect(result._id).toBe('rec-2');
		WorkiomEndpointOutputSchemas.recordsUpdate.parse(result);

		const req = lastCall();
		expect(req.method).toBe('PUT');
		expect(req.url).toBe(
			'https://api.workiom.com/api/services/app/Data/Update?listId=list-1&id=rec-2',
		);
	});

	it('maps body-read timeouts to WorkiomAPIError', async () => {
		mockFetch.mockResolvedValue({
			ok: true,
			status: 200,
			headers: new Headers(),
			text: async () => {
				const error = new Error('The operation was aborted');
				error.name = 'TimeoutError';
				throw error;
			},
		});
		await expect(
			makeWorkiomRequest('/api/services/app/Apps/GetAll', 'k'),
		).rejects.toMatchObject({
			name: 'WorkiomAPIError',
			message: 'Workiom request timed out',
		});
	});

	it('maps 429 to WorkiomRateLimitError', async () => {
		mockFetch.mockResolvedValue(
			new Response('', { status: 429, headers: { 'Retry-After': '2' } }),
		);
		await expect(
			makeWorkiomRequest('/api/services/app/Apps/GetAll', 'k'),
		).rejects.toBeInstanceOf(WorkiomRateLimitError);
		expect(
			errorHandlers.RATE_LIMIT_ERROR.match(new WorkiomRateLimitError()),
		).toBe(true);
	});

	it('maps ABP success:false and HTTP errors', async () => {
		mockFetch.mockResolvedValue(
			jsonResponse(
				{
					success: false,
					result: null,
					error: { message: 'List not found' },
					__abp: true,
				},
				{ status: 200 },
			),
		);
		await expect(
			makeWorkiomRequest('/api/services/app/Lists/GetAll', 'k'),
		).rejects.toMatchObject({ message: 'List not found' });

		mockFetch.mockResolvedValueOnce(
			jsonResponse({ error: { message: 'bad key' } }, { status: 401 }),
		);
		const err = await makeWorkiomRequest(
			'/api/services/app/Lists/GetAll',
			'k',
		).catch((error: unknown) => error);
		expect(err).toBeInstanceOf(WorkiomAPIError);
		expect((err as WorkiomAPIError).status).toBe(401);
		expect(errorHandlers.AUTH_ERROR.match(err as Error)).toBe(true);
	});
});
