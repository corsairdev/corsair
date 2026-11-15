import { logEventFromContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { KontentAPIError, kontentErrorFields } from './client';
import { Items, Taxonomy } from './endpoints';
import {
	contentType,
	contentTypes,
	ENVIRONMENT_ID,
	environmentNotFound,
	itemDetail,
	itemNotFound,
	items,
	itemsWithNext,
	languages,
	taxonomies,
	typeNotFound,
	unauthorized,
} from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant. Each endpoint returns its own output type, so
// the shared return is unknown.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>;

// unknown: negative cases pass values no schema accepts.
function invoke(
	endpoint: AnyEndpoint,
	input: unknown,
	deliveryApiKey: string | null = null,
) {
	// The fake context only carries what the endpoints read: the environment ID
	// is the key, and the account may store a Delivery API key.
	return endpoint(
		{
			key: ENVIRONMENT_ID,
			options: {},
			keys: { get_delivery_api_key: async () => deliveryApiKey },
		} as never,
		input as never,
	);
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON.
function respond(body: unknown, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json' },
		}),
	);
}

function lastRequest() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	const parsed = new URL(url);
	return {
		origin: parsed.origin,
		path: parsed.pathname,
		query: Object.fromEntries(parsed.searchParams),
		allElements: parsed.searchParams.getAll('elements'),
		method: init.method,
		headers: new Headers(init.headers),
	};
}

function expectAddressed() {
	const sent = lastRequest();
	expect(sent.origin).toBe('https://deliver.kontent.ai');
	expect(sent.path.startsWith(`/${ENVIRONMENT_ID}/`)).toBe(true);
	expect(sent.method).toBe('GET');
}

/** The caught rejection, without a cast at each call site. */
// unknown: a promise can reject with any value, so the rejection reason has no
// static type; each caller asserts only on the fields it checks.
async function caught(promise: Promise<unknown>): Promise<unknown> {
	return promise.catch((error: unknown) => error);
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('items.list', () => {
	it('GETs a page under the environment ID', async () => {
		respond(items);

		const result = (await invoke(Items.list, {})) as typeof items & {
			next_skip: number | null;
		};

		expectAddressed();
		expect(lastRequest()).toMatchObject({
			path: `/${ENVIRONMENT_ID}/items`,
			query: {},
		});
		expect(result.items).toHaveLength(2);
		expect(result.next_skip).toBeNull();
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'kontentai.items.list',
			{ count: 2, total: 2 },
			'completed',
		);
	});

	it('sends every filter the caller asked for', async () => {
		respond(items);

		await invoke(Items.list, {
			skip: 10,
			limit: 20,
			depth: 2,
			order: 'system.last_modified',
			type: 'about_us',
			language: 'en-US',
			collection: 'default',
			in_filter: 'elements.price[gt]=10',
			elements: ['facts', 'url_pattern'],
		});

		const sent = lastRequest();
		expect(sent.query.skip).toBe('10');
		expect(sent.query.limit).toBe('20');
		expect(sent.query.depth).toBe('2');
		expect(sent.query.order).toBe('system.last_modified');
		expect(sent.query.language).toBe('en-US');
		// Kontent ignores bare `type`, `collection` and `in_filter` parameters
		// and answers every item (live probe of the sample environment).
		expect(sent.query['system.type']).toBe('about_us');
		expect(sent.query['system.collection']).toBe('default');
		expect(sent.query['elements.price[gt]']).toBe('10');
		expect(sent.query).not.toHaveProperty('type');
		expect(sent.query).not.toHaveProperty('collection');
		expect(sent.query).not.toHaveProperty('in_filter');
		// Repeated `elements` keys get a 400; Kontent wants one list.
		expect(sent.allElements).toEqual(['facts,url_pattern']);
	});

	it('sends each &-joined filter as its own parameter', async () => {
		respond(items);

		await invoke(Items.list, {
			in_filter: 'system.type[in]=article,coffee&elements.title[nempty]',
		});

		const sent = lastRequest();
		expect(sent.query['system.type[in]']).toBe('article,coffee');
		expect(sent.query['elements.title[nempty]']).toBe('');
	});

	it.each([
		['price>10'],
		['elements.price[gt]=10&'],
		['filter=elements.price'],
	])('rejects the filter %j before calling Kontent', async (in_filter) => {
		await expect(invoke(Items.list, { in_filter })).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a filter repeated in in_filter instead of dropping one', async () => {
		await expect(
			invoke(Items.list, {
				in_filter:
					'elements.category[contains]=nature&elements.category[contains]=technology',
			}),
		).rejects.toThrow('Each filter may appear once');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it.each([
		[{ type: 'article', in_filter: 'system.type=coffee' }, 'system.type'],
		[
			{ collection: 'default', in_filter: 'system.collection=blog' },
			'system.collection',
		],
	])(
		'rejects %j, where in_filter would replace the field',
		async (input, name) => {
			await expect(invoke(Items.list, input)).rejects.toThrow(name);
			expect(fetchMock).not.toHaveBeenCalled();
		},
	);

	it('keeps type beside a system.type operator filter, which Kontent ANDs', async () => {
		respond(items);

		await invoke(Items.list, {
			type: 'article',
			in_filter: 'system.type[neq]=coffee',
		});

		const sent = lastRequest();
		expect(sent.query['system.type']).toBe('article');
		expect(sent.query['system.type[neq]']).toBe('coffee');
	});

	it('reads the next skip out of the full next_page URL', async () => {
		respond(itemsWithNext);

		await expect(invoke(Items.list, { limit: 1 })).resolves.toMatchObject({
			next_skip: 1,
		});
	});

	it('treats an empty next_page as the last page', async () => {
		respond(items);

		await expect(invoke(Items.list, { limit: 1 })).resolves.toMatchObject({
			next_skip: null,
		});
	});

	it('keeps an element value exactly as Kontent typed it', async () => {
		respond(items);

		const result = (await invoke(Items.list, {})) as typeof items;
		const facts = result.items[0]?.elements?.facts;

		// A modular_content value is an array of codenames, not an object.
		expect(facts?.type).toBe('modular_content');
		expect(Array.isArray(facts?.value)).toBe(true);
		expect(facts?.value).toEqual([
			'our_philosophy',
			'how_we_source_our_coffees',
			'how_we_roast_our_coffees',
		]);
	});

	it.each([
		[{ depth: 3 }],
		[{ depth: -1 }],
		[{ limit: 0 }],
		[{ limit: 2001 }],
		[{ skip: -1 }],
		[{ elements: [] }],
	])('rejects %j before calling Kontent', async (input) => {
		await expect(invoke(Items.list, input)).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a body that is not an item list', async () => {
		respond({ unexpected: true });

		await expect(invoke(Items.list, {})).rejects.toMatchObject({
			name: 'ZodError',
		});
		expect(mockLog).not.toHaveBeenCalled();
	});
});

describe('items.get', () => {
	it('GETs one item by codename', async () => {
		respond(itemDetail);

		await expect(
			invoke(Items.get, { codename: 'about_us' }),
		).resolves.toMatchObject({
			item: { system: { codename: 'about_us', language: 'en-US' } },
		});
		expectAddressed();
		expect(lastRequest()).toMatchObject({
			path: `/${ENVIRONMENT_ID}/items/about_us`,
		});
	});

	it('encodes the codename into one path segment', async () => {
		respond(itemDetail);

		await invoke(Items.get, { codename: '../../types/x' });

		const [url] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
		expect(url).toBe(
			`https://deliver.kontent.ai/${ENVIRONMENT_ID}/items/..%2F..%2Ftypes%2Fx`,
		);
	});

	it('sends a preview read to the Preview API with the stored key', async () => {
		respond(itemDetail);

		await invoke(Items.get, { codename: 'about_us', preview: true }, 'dk');

		const sent = lastRequest();
		// A token on deliver.kontent.ai is ignored and published content comes
		// back, so preview has to change the host.
		expect(sent.origin).toBe('https://preview-deliver.kontent.ai');
		expect(sent.path).toBe(`/${ENVIRONMENT_ID}/items/about_us`);
		expect(sent.headers.get('authorization')).toBe('Bearer dk');
	});

	it('refuses a preview read without a stored key before calling Kontent', async () => {
		await expect(
			invoke(Items.get, { codename: 'about_us', preview: true }),
		).rejects.toMatchObject({
			name: 'KontentAPIError',
			message: expect.stringContaining('delivery_api_key'),
		});
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('takes no API key as a call argument', async () => {
		await expect(
			invoke(Items.get, { codename: 'about_us', preview: 'a-token' }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('sends the stored key on published reads, for secure access', async () => {
		respond(itemDetail);

		await invoke(Items.get, { codename: 'about_us' }, 'dk');

		const sent = lastRequest();
		expect(sent.origin).toBe('https://deliver.kontent.ai');
		expect(sent.headers.get('authorization')).toBe('Bearer dk');
	});

	it('sends no authorization header on a published read', async () => {
		respond(itemDetail);

		await invoke(Items.get, { codename: 'about_us' });

		expect(lastRequest().headers.get('authorization')).toBeNull();
	});

	it('surfaces a missing item with its error code', async () => {
		respond(itemNotFound, 404);

		await expect(invoke(Items.get, { codename: 'nope' })).rejects.toMatchObject(
			{
				name: 'ApiError',
				status: 404,
				body: { error_code: 100 },
				message:
					"Kontent 404 100: The requested content item 'nope' was not found. (request fc4c2800fa381362)",
			},
		);
	});

	it('surfaces an unknown environment as a configuration error', async () => {
		respond(environmentNotFound, 404);

		const error = await caught(invoke(Items.get, { codename: 'about_us' }));

		expect(error).toBeInstanceOf(ApiError);
		expect(error).toMatchObject({ status: 404, body: { error_code: 105 } });
		expect(kontentErrorFields(error).isEnvironmentNotFound).toBe(true);
	});

	it.each([[{}], [{ codename: '' }], [{ codename: 'about_us', depth: 5 }]])(
		'rejects %j before calling Kontent',
		async (input) => {
			await expect(invoke(Items.get, input)).rejects.toThrow();
			expect(fetchMock).not.toHaveBeenCalled();
		},
	);
});

describe('types.list', () => {
	it('GETs the content types with their element definitions', async () => {
		respond(contentTypes);

		const result = (await invoke(Taxonomy.list, {})) as typeof contentTypes;

		expect(result.types).toHaveLength(1);
		expect(result.types[0]?.elements?.sitemap).toMatchObject({
			type: 'taxonomy',
			taxonomy_group: 'sitemap_538125f',
		});
		expect(lastRequest()).toMatchObject({
			path: `/${ENVIRONMENT_ID}/types`,
		});
	});
});

describe('types.get', () => {
	it('GETs one content type', async () => {
		respond(contentType);

		await expect(
			invoke(Taxonomy.get, { codename: 'about_us' }),
		).resolves.toMatchObject({
			type: { system: { codename: 'about_us' } },
		});
		expect(lastRequest()).toMatchObject({
			path: `/${ENVIRONMENT_ID}/types/about_us`,
		});
	});

	it('surfaces an unknown type with its own code', async () => {
		respond(typeNotFound, 404);

		await expect(
			invoke(Taxonomy.get, { codename: 'nope' }),
		).rejects.toMatchObject({ status: 404, body: { error_code: 101 } });
	});
});

describe('taxonomies.list', () => {
	it('GETs the taxonomy groups with nested terms', async () => {
		respond(taxonomies);

		const result = (await invoke(Taxonomy.taxonomies, {})) as typeof taxonomies;
		const group = result.taxonomies[0];

		expect(group?.system.codename).toBe('manufacturer');
		// A term nests its children.
		expect(group?.terms?.[1]?.terms?.[0]?.codename).toBe('v60');
		expect(lastRequest()).toMatchObject({
			path: `/${ENVIRONMENT_ID}/taxonomies`,
		});
	});
});

describe('languages.list', () => {
	it('GETs the environment languages', async () => {
		respond(languages);

		const result = (await invoke(Taxonomy.languages, {})) as typeof languages;

		expect(result.languages).toHaveLength(2);
		expect(result.languages[0]?.system.codename).toBe('en-US');
		expect(lastRequest()).toMatchObject({
			path: `/${ENVIRONMENT_ID}/languages`,
		});
	});
});

describe('the stored Delivery API key', () => {
	it('is optional when Corsair has no key manager (no database or kek)', async () => {
		respond(items);
		const ctx = { key: ENVIRONMENT_ID, options: {} };

		await expect(
			(Items.list as never as AnyEndpoint)(ctx as never, {} as never),
		).resolves.toMatchObject({ items: expect.any(Array) });
		expect(lastRequest().headers.get('authorization')).toBeNull();
	});

	it('is read only from the account, never from plugin options', async () => {
		respond(items);
		respond(itemDetail);
		const ctx = {
			key: ENVIRONMENT_ID,
			options: { deliveryApiKey: 'option-key' },
			keys: { get_delivery_api_key: async (): Promise<string | null> => null },
		};

		await (Items.list as never as AnyEndpoint)(ctx as never, {} as never);
		expect(lastRequest().headers.get('authorization')).toBeNull();

		ctx.keys.get_delivery_api_key = async () => 'stored-key';
		await (Items.get as never as AnyEndpoint)(
			ctx as never,
			{ codename: 'about_us', preview: true } as never,
		);
		expect(lastRequest().origin).toBe('https://preview-deliver.kontent.ai');
		expect(lastRequest().headers.get('authorization')).toBe(
			'Bearer stored-key',
		);
	});
});

describe('the environment ID', () => {
	it('fails before a request when none is configured', async () => {
		const ctx = {
			key: '',
			options: {},
			keys: { get_delivery_api_key: async () => null },
		};

		const error = await caught(
			(Items.list as never as AnyEndpoint)(ctx as never, {} as never),
		);

		expect(error).toBeInstanceOf(KontentAPIError);
		expect((error as Error).message).toContain('environment ID');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('never reaches a log payload', async () => {
		respond(items);

		await invoke(Items.list, {});

		// The first argument is the context, which holds the key by definition;
		// what matters is the payload the plugin chooses to log.
		for (const call of mockLog.mock.calls) {
			expect(JSON.stringify(call[2])).not.toContain(ENVIRONMENT_ID);
		}
	});
});

describe('error envelopes', () => {
	it('reads a refused Delivery API key as an auth error', async () => {
		respond(unauthorized, 401);

		await expect(
			invoke(Items.get, { codename: 'about_us', preview: true }, 'bad'),
		).rejects.toMatchObject({ status: 401, name: 'ApiError' });
	});

	it('passes an HTTP failure on as core ApiError with the request it made', async () => {
		respond(itemNotFound, 404);

		const error = await caught(invoke(Items.list, {}));

		expect(error).toBeInstanceOf(ApiError);
		expect(error).not.toBeInstanceOf(KontentAPIError);
		expect(error).toMatchObject({ request: { method: 'GET' } });
	});

	it('keeps the Delivery API key off the error', async () => {
		respond(unauthorized, 401);

		const error = await caught(
			invoke(Items.get, { codename: 'about_us' }, 'secret-delivery-key'),
		);

		expect(JSON.stringify(error)).not.toContain('secret-delivery-key');
		expect((error as Error).message).not.toContain('secret-delivery-key');
	});

	it('marks a transport failure and keeps the method', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

		await expect(invoke(Items.list, {})).rejects.toMatchObject({
			transport: true,
			method: 'GET',
			message: 'fetch failed',
		});
	});

	it('keeps the request id, which Kontent support asks for', async () => {
		respond(itemNotFound, 404);

		const error = await caught(invoke(Items.get, { codename: 'nope' }));

		expect((error as Error).message).toContain('fc4c2800fa381362');
		expect(kontentErrorFields(error)).toEqual({
			errorCode: 100,
			requestId: 'fc4c2800fa381362',
			isEnvironmentNotFound: false,
		});
	});
});
