import { ApiError } from 'corsair/http';
import {
	encodeWordpressPathValue,
	normalizeSiteUrl,
	routeUrl,
	wordpressErrorMessage,
} from './client';
import { wordpressEndpointsNested } from './endpoints/catalog';
import {
	contentDisposition,
	nextPageOf,
	phpQueryValue,
} from './endpoints/operations';
import type { WordpressContext } from './index';

// Every call goes through the real client and core transport; only fetch is fake.

type Captured = {
	url: string;
	method: string;
	headers: Record<string, string>;
	// `unknown` because the sent body is a JSON string or a Blob.
	body: unknown;
};

let calls: Captured[] = [];

function reply(
	status: number,
	// `unknown` because each case answers its own body.
	body: unknown,
	contentType = 'application/json',
) {
	jest.spyOn(globalThis, 'fetch').mockImplementation(async (input, init) => {
		const headers: Record<string, string> = {};
		new Headers(init?.headers).forEach((value, key) => {
			headers[key] = value;
		});
		calls.push({
			url: String(input),
			method: init?.method ?? 'GET',
			headers,
			body: init?.body,
		});
		const payload =
			body instanceof Uint8Array
				? body
				: typeof body === 'string' && contentType !== 'application/json'
					? body
					: JSON.stringify(body);
		return new Response(payload, {
			status,
			headers: { 'content-type': contentType },
		});
	});
}

const SITE = 'https://example.com';
const BASE = `${SITE}/wp-json`;
const PASSWORD = 'abcd EFGH ijkl MNOP qrst UVWX';

function ctx(): WordpressContext {
	return {
		endpoints: {},
		$getAccountId: () => Promise.resolve('test-account'),
		key: PASSWORD,
		options: { siteUrl: SITE, username: 'ada' },
		keys: {
			get_api_key: () => Promise.resolve(PASSWORD),
			get_site_url: () => Promise.resolve(null),
			get_username: () => Promise.resolve(null),
		},
		db: {},
		// `unknown` because a test context fills only the fields the endpoints read.
	} as unknown as WordpressContext;
}

// `unknown` because the endpoint tree holds functions of many input types.
type AnyEndpoint = (ctx: WordpressContext, input: unknown) => Promise<unknown>;

function endpointFor(id: string): AnyEndpoint {
	// `unknown` because the walk goes through nested groups of endpoints.
	let node: unknown = wordpressEndpointsNested;
	for (const part of id.split('.')) {
		node = (node as Record<string, unknown>)[part];
	}
	if (typeof node !== 'function') throw new Error(`no endpoint ${id}`);
	return node as AnyEndpoint;
}

const call = (id: string, input: unknown) => endpointFor(id)(ctx(), input);
const url = (n = 0) => new URL(calls[n]?.url ?? '');
const path = (n = 0) => decodeURIComponent(url(n).pathname);
const sentJson = (n = 0) => JSON.parse(String(calls[n]?.body));

beforeEach(() => {
	calls = [];
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('site URL', () => {
	it('lands the site address and the REST root on <site>/wp-json', () => {
		expect(normalizeSiteUrl('https://example.com')).toBe(BASE);
		expect(normalizeSiteUrl(' https://example.com/wp-json/ ')).toBe(BASE);
		expect(normalizeSiteUrl('https://example.com/blog/')).toBe(
			'https://example.com/blog/wp-json',
		);
		expect(normalizeSiteUrl('http://localhost:8093')).toBe(
			'http://localhost:8093/wp-json',
		);
		expect(normalizeSiteUrl('http://127.0.0.1:8080')).toBe(
			'http://127.0.0.1:8080/wp-json',
		);
	});

	it('refuses URLs that are not a plain http(s) site', () => {
		for (const bad of [
			'',
			'example.com',
			'ftp://example.com',
			'https://user:pw@example.com',
			'https://example.com/?rest_route=/',
			'https://example.com/#x',
			// The password would cross the network in the clear.
			'http://example.com',
			'http://10.0.0.5',
			// These names can resolve to another machine (mDNS, local DNS).
			'http://shop.local',
			'http://shop.test',
			'http://wp.localhost',
		]) {
			expect(() => normalizeSiteUrl(bad)).toThrow();
		}
	});
});

describe('requests', () => {
	it('lists posts with Basic auth, PHP-style list values and the next page', async () => {
		reply(200, [{ id: 1 }, { id: 2 }]);
		const page = await call('posts.list', {
			per_page: 2,
			page: 3,
			categories: [4, 5],
			status: ['publish', 'draft'],
			search: 'launch',
		});
		expect(calls[0]?.method).toBe('GET');
		expect(path()).toBe('/wp-json/wp/v2/posts');
		const q = url().searchParams;
		expect(q.get('per_page')).toBe('2');
		expect(q.get('page')).toBe('3');
		expect(q.get('categories[0]')).toBe('4');
		expect(q.get('categories[1]')).toBe('5');
		expect(q.get('status[1]')).toBe('draft');
		expect(q.get('search')).toBe('launch');
		expect(calls[0]?.headers.authorization).toBe(
			`Basic ${Buffer.from('ada:abcdEFGHijklMNOPqrstUVWX').toString('base64')}`,
		);
		expect(page).toEqual({ items: [{ id: 1 }, { id: 2 }], next_page: 4 });
	});

	it('ends paging on a short page, with the route default size', async () => {
		reply(200, [{ id: 1 }]);
		await expect(call('posts.list', {})).resolves.toEqual({
			items: [{ id: 1 }],
			next_page: null,
		});
		expect(nextPageOf({}, 10, 10)).toBe(2);
		expect(nextPageOf({ page: 2, per_page: 5 }, 5, 10)).toBe(3);
		expect(nextPageOf({ per_page: 5 }, 0, 10)).toBeNull();
	});

	it('pages by offset without a next page, and ends on an empty page past the end', async () => {
		reply(200, [{ id: 1 }, { id: 2 }]);
		await expect(
			call('posts.list', { per_page: 2, offset: 4 }),
		).resolves.toEqual({ items: [{ id: 1 }, { id: 2 }], next_page: null });
		calls = [];
		reply(400, {
			code: 'rest_post_invalid_page_number',
			message:
				'The page number requested is larger than the number of pages available.',
			data: { status: 400 },
		});
		await expect(call('posts.list', { page: 2 })).resolves.toEqual({
			items: [],
			next_page: null,
		});
		// Any other 400 still throws.
		reply(400, {
			code: 'rest_invalid_param',
			message: 'Bad',
			data: { status: 400 },
		});
		await expect(call('posts.list', { page: 2 })).rejects.toThrow(
			'rest_invalid_param',
		);
	});

	it('keeps an explicit null in the body (it resets the field)', async () => {
		reply(200, { id: 12 });
		await call('posts.update', { id: 12, date: null });
		expect(sentJson()).toEqual({ date: null });
	});

	it('sends a post as JSON and the id in the path', async () => {
		reply(200, { id: 12, status: 'publish' });
		await call('posts.update', { id: 12, status: 'publish', title: 'New' });
		expect(calls[0]?.method).toBe('POST');
		expect(path()).toBe('/wp-json/wp/v2/posts/12');
		expect(calls[0]?.headers['content-type']).toBe('application/json');
		expect(sentJson()).toEqual({ status: 'publish', title: 'New' });
	});

	it('deletes with force in the query and parses both delete shapes', async () => {
		reply(200, { deleted: true, previous: { id: 12 } });
		await expect(
			call('posts.delete', { id: 12, force: true }),
		).resolves.toEqual({ deleted: true, previous: { id: 12 } });
		expect(calls[0]?.method).toBe('DELETE');
		expect(url().searchParams.get('force')).toBe('true');
		expect(calls[0]?.body).toBeUndefined();
		reply(200, { id: 12, status: 'trash' });
		await expect(call('posts.delete', { id: 12 })).resolves.toMatchObject({
			status: 'trash',
		});
	});

	it('keeps slashes in a plugin file and a template id', async () => {
		reply(200, { plugin: 'akismet/akismet', status: 'active' });
		await call('plugins.update', {
			plugin: 'akismet/akismet',
			status: 'active',
		});
		expect(url().pathname).toBe('/wp-json/wp/v2/plugins/akismet/akismet');
		reply(200, { id: 'twentytwentyfive//home' });
		await call('templates.get', { id: 'twentytwentyfive//home' });
		expect(url(1).pathname).toBe(
			'/wp-json/wp/v2/templates/twentytwentyfive//home',
		);
		expect(() => encodeWordpressPathValue('a/../b', true)).toThrow();
		expect(() => encodeWordpressPathValue('/a', true)).toThrow();
		expect(encodeWordpressPathValue('a b/c', true)).toBe('a%20b/c');
	});

	it('takes `me` or an id for application password routes', async () => {
		reply(200, []);
		await call('users.applicationPasswords.list', { user_id: 'me' });
		expect(path()).toBe('/wp-json/wp/v2/users/me/application-passwords');
		await call('users.applicationPasswords.list', { user_id: 3 });
		expect(path(1)).toBe('/wp-json/wp/v2/users/3/application-passwords');
	});

	it('uploads media as the raw body with its name, fields in the query', async () => {
		reply(201, { id: 40, media_type: 'image' });
		await call('media.create', {
			file: {
				base64: Buffer.from('png-bytes').toString('base64'),
				filename: 'team photo.png',
				contentType: 'image/png',
			},
			title: 'Team photo',
			alt_text: 'The team',
			post: 12,
		});
		const sent = calls[0];
		expect(sent?.method).toBe('POST');
		expect(path()).toBe('/wp-json/wp/v2/media');
		expect(sent?.headers['content-type']).toBe('image/png');
		expect(sent?.headers['content-disposition']).toBe(
			`attachment; filename="team photo.png"; filename*=UTF-8''team%20photo.png`,
		);
		expect(sent?.body).toBeInstanceOf(Blob);
		expect(await (sent?.body as Blob).text()).toBe('png-bytes');
		expect(url().searchParams.get('title')).toBe('Team photo');
		expect(url().searchParams.get('alt_text')).toBe('The team');
		expect(url().searchParams.get('post')).toBe('12');
	});

	it('sideloads media from a url without a file', async () => {
		reply(201, { id: 41 });
		await call('media.create', { url: 'https://example.org/a.png' });
		expect(url().searchParams.get('url')).toBe('https://example.org/a.png');
		expect(sentJson()).toEqual({});
	});

	it('returns the theme export as a file', async () => {
		reply(200, new Uint8Array([80, 75, 3, 4]), 'application/zip');
		const file = (await call('blockEditor.export', {})) as {
			filename?: string;
			contentType?: string;
		};
		expect(file.filename).toBe('wordpress-blockEditor-export.zip');
		expect(file.contentType).toBe('application/zip');
	});

	it('reaches any route through rest.get and rest.send', async () => {
		reply(200, [{ id: 5 }]);
		await call('rest.get', {
			route: 'wp/v2/book',
			query: { per_page: 5, genre: [1, 2] },
		});
		expect(path()).toBe('/wp-json/wp/v2/book');
		expect(url().searchParams.get('per_page')).toBe('5');
		expect(url().searchParams.get('genre[1]')).toBe('2');
		reply(200, { id: 6 });
		await call('rest.send', {
			route: 'wp/v2/book/6',
			method: 'PATCH',
			body: { title: 'Dune' },
		});
		expect(calls[1]?.method).toBe('PATCH');
		expect(path(1)).toBe('/wp-json/wp/v2/book/6');
		expect(sentJson(1)).toEqual({ title: 'Dune' });
		await expect(call('rest.get', { route: '../wp-admin' })).rejects.toThrow(
			'Invalid WordPress path value',
		);
		// `_method` would turn the GET into a write on WordPress's side.
		calls = [];
		for (const key of [
			'_method',
			'_METHOD',
			'_method[0]',
			'.method',
			' .method',
			'_method.x',
			'  _method',
			'[method',
		]) {
			await expect(
				call('rest.get', {
					route: 'wp/v2/posts/1',
					query: { [key]: 'DELETE' },
				}),
			).rejects.toThrow(/_method is not allowed/);
		}
		expect(calls).toHaveLength(0);
	});

	it('refuses invalid input before any call, naming fields not values', async () => {
		reply(200, {});
		await expect(call('posts.get', { id: 'abc' })).rejects.toThrow(
			/Invalid input for wordpress posts\.get: id/,
		);
		await expect(
			call('posts.get', { id: 1, 'secret-value': 1 }),
		).rejects.toThrow(/unknown field \(<key>\); this operation takes id/);
		expect(calls).toHaveLength(0);
	});

	it('refuses a response that does not match the route schema', async () => {
		reply(200, { id: 'not-a-number' });
		await expect(call('posts.get', { id: 1 })).rejects.toThrow(
			/did not match its documented schema: id/,
		);
	});
});

describe('errors', () => {
	it('rebuilds WP_Error bodies with the code, without the sent values or password', async () => {
		reply(400, {
			code: 'rest_invalid_param',
			message: 'Invalid parameter(s): status',
			data: {
				status: 400,
				params: { status: 'status is not one of publish, draft.' },
				details: { echo: 'Secret launch plan for ada' },
			},
		});
		const error = (await call('posts.create', {
			title: 'Secret launch plan',
			status: 'future',
		}).catch((e) => e)) as ApiError;
		expect(error).toBeInstanceOf(ApiError);
		expect(error.status).toBe(400);
		expect(error.message).toBe(
			'WordPress 400: rest_invalid_param: Invalid parameter(s): status; status is not one of publish, draft.',
		);
		const text = JSON.stringify({ body: error.body, request: error.request });
		expect(text).not.toContain('Secret launch plan');
		expect(text).not.toContain('abcd');
		expect(error.request.body).toBe('[REDACTED]');
		expect(error.request.headers).toBeUndefined();
	});

	it('drops a sensitive number the call sent when the error echoes it', async () => {
		reply(400, {
			code: 'invalid_phone',
			message: 'Bad phone',
			data: { status: 400, phone: 15551234567, retry: 3 },
		});
		const error = (await call('rest.send', {
			route: 'acme/v1/contacts',
			body: { phone: 15551234567 },
		}).catch((e) => e)) as ApiError;
		expect(error.body).toMatchObject({
			data: { status: 400, phone: '[REDACTED]', retry: 3 },
		});
	});

	it('keeps the route, not the values, in the error URL', () => {
		expect(
			routeUrl(
				'https://example.com/wp-json/wp/v2/posts/12?context=edit',
				'/wp/v2/posts/{id}',
			),
		).toBe('https://example.com/wp-json/wp/v2/posts/{id}?[REDACTED]');
	});

	it('says nothing from an HTML error page', () => {
		expect(
			wordpressErrorMessage(503, 'Service Unavailable', '<html>busy</html>'),
		).toBe('WordPress 503: Service Unavailable');
		expect(wordpressErrorMessage(401, '', { code: 'rest_not_logged_in' })).toBe(
			'WordPress 401: rest_not_logged_in',
		);
	});
});

describe('helpers', () => {
	it('writes lists and objects the way PHP reads them', () => {
		expect(phpQueryValue([1, 2])).toEqual({ 0: 1, 1: 2 });
		expect(phpQueryValue({ a: [true] })).toEqual({ a: { 0: true } });
		expect(phpQueryValue('x')).toBe('x');
	});

	it('names an upload safely in Content-Disposition', () => {
		expect(contentDisposition('ré"sumé.pdf')).toBe(
			`attachment; filename="r__sum_.pdf"; filename*=UTF-8''r%C3%A9%22sum%C3%A9.pdf`,
		);
	});
});
