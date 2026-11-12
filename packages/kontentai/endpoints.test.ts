import { logEventFromContext } from 'corsair/core';
import { KontentAPIError } from './client';
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
function invoke(endpoint: AnyEndpoint, input: unknown) {
	// The fake context only carries what the endpoints read: the environment ID
	// is the key, since the Delivery API has no other credential.
	return endpoint({ key: ENVIRONMENT_ID } as never, input as never);
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
		expect(sent.query.type).toBe('about_us');
		expect(sent.query.language).toBe('en-US');
		expect(sent.query.collection).toBe('default');
		// The filter parameter is `in_filter`, not `filter`.
		expect(sent.query.in_filter).toBe('elements.price[gt]=10');
		expect(sent.allElements).toEqual(['facts', 'url_pattern']);
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

	it('sends a preview token only when a preview read asks for it', async () => {
		respond(itemDetail);

		await invoke(Items.get, { codename: 'about_us', preview: 'preview-token' });

		expect(lastRequest().headers.get('authorization')).toBe(
			'Bearer preview-token',
		);
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
				status: 404,
				errorCode: 100,
				isNotFound: true,
				message:
					"Kontent 404 100: The requested content item 'nope' was not found. (request fc4c2800fa381362)",
			},
		);
	});

	it('surfaces an unknown environment as a configuration error', async () => {
		respond(environmentNotFound, 404);

		await expect(
			invoke(Items.get, { codename: 'about_us' }),
		).rejects.toMatchObject({
			status: 404,
			errorCode: 105,
			isEnvironmentNotFound: true,
		});
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
		).rejects.toMatchObject({ status: 404, errorCode: 101 });
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

describe('the environment ID', () => {
	it('fails before a request when none is configured', async () => {
		const ctx = { key: '', options: {} };

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
	it('reads a refused preview token as an auth error', async () => {
		respond(unauthorized, 401);

		await expect(
			invoke(Items.get, { codename: 'about_us', preview: 'bad' }),
		).rejects.toMatchObject({ status: 401, isAuthError: true });
	});

	it('keeps no body on the error', async () => {
		respond(itemNotFound, 404);

		const error = await caught(invoke(Items.list, {}));

		expect(error).not.toHaveProperty('body');
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

		await expect(invoke(Items.get, { codename: 'nope' })).rejects.toMatchObject(
			{
				requestId: 'fc4c2800fa381362',
			},
		);
	});
});
