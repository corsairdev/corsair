import { createHmac } from 'node:crypto';
import { AuthMissingError } from 'corsair/core';
import {
	checkGhostStoredPairing,
	ghostAdminToken,
	normalizeGhostSiteUrl,
	resolveGhostTarget,
} from './auth';
import { ghostEndpointMeta, ghostEndpointsNested } from './endpoints/catalog';
import type { GhostContext } from './index';
import { ghost } from './index';
import {
	ghostWebhooksNested,
	matchGhostWebhook,
	verifyGhostSignature,
} from './webhooks';

// Ghost specifics on top of the generic suites: the Admin JWT, the Content API
// key, the site URL, the { resource: [object] } body format, uploads, and
// webhooks checked against two real deliveries from Ghost 6 (11-28).

const fixtures = require('./__fixtures__/ghost-deliveries.json') as {
	secret: string;
	deliveries: Array<{
		path: string;
		headers: Record<string, string>;
		rawBody: string;
	}>;
};

type Captured = {
	url: string;
	method: string;
	headers: Headers;
	body: unknown;
};
let calls: Captured[] = [];

function reply(status: number, body: unknown) {
	jest.spyOn(globalThis, 'fetch').mockImplementation(async (input, init) => {
		calls.push({
			url: String(input),
			method: init?.method ?? 'GET',
			headers: new Headers(init?.headers),
			body: init?.body,
		});
		return new Response(body === undefined ? null : JSON.stringify(body), {
			status,
			headers: body === undefined ? {} : { 'content-type': 'application/json' },
		});
	});
}

const ID = '6b0a3e9ebfdd6d00010042ae';
const SECRET =
	'8a9c3b4f0e1d2c3b4a5f6e7d8c9b0a1f2e3d4c5b6a7f8e9d0c1b2a3f4e5d6c7b';
const KEY = `${ID}:${SECRET}`;

function ctx(options: Record<string, string> = {}): GhostContext {
	return {
		endpoints: {},
		$getAccountId: () => Promise.resolve('test-account'),
		key: KEY,
		options: { siteUrl: 'https://blog.example.com', ...options },
		keys: { get_api_key: () => Promise.resolve(KEY) },
		db: {},
		// `unknown` because a test context fills only the fields the endpoints read.
	} as unknown as GhostContext;
}

beforeEach(() => {
	calls = [];
});
afterEach(() => {
	jest.restoreAllMocks();
});

describe('admin token', () => {
	it('signs an HS256 JWT with the key id, a 5-minute expiry and the /admin/ audience', () => {
		const token = ghostAdminToken(KEY, 1_700_000_000_000);
		const [h, p, s] = token.split('.');
		expect(
			JSON.parse(Buffer.from(h as string, 'base64url').toString()),
		).toEqual({
			alg: 'HS256',
			typ: 'JWT',
			kid: ID,
		});
		expect(
			JSON.parse(Buffer.from(p as string, 'base64url').toString()),
		).toEqual({
			iat: 1_700_000_000,
			exp: 1_700_000_300,
			aud: '/admin/',
		});
		const expected = createHmac('sha256', Buffer.from(SECRET, 'hex'))
			.update(`${h}.${p}`)
			.digest('base64url');
		expect(s).toBe(expected);
	});

	it('refuses a key that is not <id>:<hex secret>', () => {
		expect(() => ghostAdminToken('just-a-key')).toThrow(/<id>:<secret>/);
		expect(() => ghostAdminToken(`${ID}:not-hex`)).toThrow(/<id>:<secret>/);
		expect(() => ghostAdminToken(`${ID}:${SECRET}:extra`)).toThrow(
			/<id>:<secret>/,
		);
	});
});

describe('site URL', () => {
	it('lands every form on <site>/ghost/api', () => {
		for (const raw of [
			'https://blog.example.com',
			'https://blog.example.com/',
			'https://blog.example.com/ghost',
			'https://blog.example.com/ghost/api/admin/',
		]) {
			expect(normalizeGhostSiteUrl(raw)).toBe(
				'https://blog.example.com/ghost/api',
			);
		}
		expect(normalizeGhostSiteUrl('https://example.com/blog')).toBe(
			'https://example.com/blog/ghost/api',
		);
		expect(normalizeGhostSiteUrl('http://localhost:2368')).toBe(
			'http://localhost:2368/ghost/api',
		);
	});

	it('refuses plain http to another host, credentials and queries', () => {
		expect(() => normalizeGhostSiteUrl('http://blog.example.com')).toThrow(
			/https/,
		);
		expect(() => normalizeGhostSiteUrl('https://u:p@blog.example.com')).toThrow(
			/credentials/,
		);
		expect(() =>
			normalizeGhostSiteUrl('https://blog.example.com/?a=1'),
		).toThrow(/query/);
	});

	it('asks to connect without a site, and keeps a stored key on its own site', async () => {
		await expect(
			resolveGhostTarget({ key: KEY, options: {}, keys: {} }),
		).rejects.toBeInstanceOf(AuthMissingError);
		const keys = {
			get_site_url: () => Promise.resolve('https://a.example.com'),
		};
		await expect(
			checkGhostStoredPairing({ siteUrl: 'https://a.example.com/ghost' }, keys),
		).resolves.toBeUndefined();
		await expect(
			checkGhostStoredPairing({ siteUrl: 'https://b.example.com' }, keys),
		).rejects.toBeInstanceOf(AuthMissingError);
		const plugin = ghost({ siteUrl: 'https://b.example.com' });
		await expect(
			(
				plugin.keyBuilder as unknown as (
					c: unknown,
					s: string,
				) => Promise<string>
			)(
				{ keys: { ...keys, get_api_key: () => Promise.resolve(KEY) } },
				'endpoint',
			),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});

describe('requests', () => {
	it('sends a fresh Admin JWT and the API version on admin routes', async () => {
		reply(200, { posts: [], meta: { pagination: { page: 1 } } });
		await ghostEndpointsNested.posts.list(ctx(), {
			limit: 5,
			filter: 'status:draft',
		});
		const url = new URL(calls[0]?.url ?? '');
		expect(url.origin + url.pathname).toBe(
			'https://blog.example.com/ghost/api/admin/posts/',
		);
		expect(url.searchParams.get('filter')).toBe('status:draft');
		expect(calls[0]?.headers.get('authorization')).toMatch(
			/^Ghost eyJ[\w-]+\.[\w-]+\.[\w-]+$/,
		);
		expect(calls[0]?.headers.get('accept-version')).toBe('v6.0');
		expect(url.searchParams.get('key')).toBeNull();
	});

	it('sends the Content API key as ?key= and no Authorization on content routes', async () => {
		reply(200, { posts: [] });
		await ghostEndpointsNested.content.posts.list(
			ctx({ contentApiKey: 'ck_test' }),
			{},
		);
		const url = new URL(calls[0]?.url ?? '');
		expect(url.pathname).toBe('/ghost/api/content/posts/');
		expect(url.searchParams.get('key')).toBe('ck_test');
		expect(calls[0]?.headers.get('authorization')).toBeNull();
	});

	it('asks for the Content API key when it is missing', async () => {
		reply(200, { posts: [] });
		await expect(
			ghostEndpointsNested.content.posts.list(ctx(), {}),
		).rejects.toBeInstanceOf(AuthMissingError);
		expect(calls).toHaveLength(0);
	});

	it("wraps one object in Ghost's { posts: [object] } body and keeps query fields out of it", async () => {
		reply(201, { posts: [{ id: 'p1', title: 'Hi' }] });
		await ghostEndpointsNested.posts.create(ctx(), {
			title: 'Hi',
			html: '<p>Hello</p>',
			source: 'html',
			status: 'draft',
		});
		expect(new URL(calls[0]?.url ?? '').searchParams.get('source')).toBe(
			'html',
		);
		expect(JSON.parse(String(calls[0]?.body))).toEqual({
			posts: [{ title: 'Hi', html: '<p>Hello</p>', status: 'draft' }],
		});
	});

	it('uploads an image as multipart form data', async () => {
		reply(201, {
			images: [
				{ url: 'https://blog.example.com/content/images/a.png', ref: 'a.png' },
			],
		});
		await ghostEndpointsNested.images.upload(ctx(), {
			file: {
				base64: 'iVBORw0KGgo=',
				filename: 'a.png',
				contentType: 'image/png',
			},
			ref: 'a.png',
		});
		const form = calls[0]?.body as FormData;
		expect(form).toBeInstanceOf(FormData);
		expect(form.get('ref')).toBe('a.png');
		expect(form.get('file')).toBeInstanceOf(Blob);
	});

	it('keeps the key and token out of an error', async () => {
		reply(401, {
			errors: [{ message: `Invalid token ${KEY}`, type: 'UnauthorizedError' }],
		});
		const error = await ghostEndpointsNested.tags
			.list(ctx(), {})
			.catch((e: unknown) => e as Error);
		expect(String(error)).toMatch(/Ghost 401/);
		expect(String(error)).not.toContain(SECRET);
	});
});

describe('webhooks (real Ghost 6 deliveries)', () => {
	const [postAdded, siteChanged] = fixtures.deliveries as [
		(typeof fixtures.deliveries)[number],
		(typeof fixtures.deliveries)[number],
	];
	const at = (d: (typeof fixtures.deliveries)[number]) =>
		Number(/t=(\d+)/.exec(d.headers['x-ghost-signature'] ?? '')?.[1]);
	const request = (
		d: (typeof fixtures.deliveries)[number],
		rawBody = d.rawBody,
	) => ({
		headers: d.headers,
		body: rawBody,
		rawBody,
		payload: JSON.parse(rawBody),
	});

	it('verifies the signature of real deliveries', () => {
		expect(
			verifyGhostSignature(request(postAdded), fixtures.secret, at(postAdded)),
		).toBe(true);
		expect(
			verifyGhostSignature(
				request(siteChanged),
				fixtures.secret,
				at(siteChanged),
			),
		).toBe(true);
	});

	it('refuses a wrong secret, a changed body and an old timestamp', () => {
		expect(
			verifyGhostSignature(request(postAdded), 'wrong', at(postAdded)),
		).toBe(false);
		expect(
			verifyGhostSignature(
				request(
					postAdded,
					postAdded.rawBody.replace('Webhook check', 'Webhook chuck'),
				),
				fixtures.secret,
				at(postAdded),
			),
		).toBe(false);
		expect(
			verifyGhostSignature(
				request(postAdded),
				fixtures.secret,
				at(postAdded) + 600_000,
			),
		).toBe(false);
	});

	it("routes by the body's event and parses the change", async () => {
		expect(matchGhostWebhook(request(postAdded))).toBe(true);
		expect(ghostWebhooksNested.posts.added.match(request(postAdded))).toBe(
			true,
		);
		expect(ghostWebhooksNested.posts.published.match(request(postAdded))).toBe(
			false,
		);
		expect(ghostWebhooksNested.site.changed.match(request(siteChanged))).toBe(
			true,
		);
		expect(matchGhostWebhook({ headers: {}, body: postAdded.rawBody })).toBe(
			false,
		);
		jest.spyOn(Date, 'now').mockReturnValue(at(postAdded));
		const result = await ghostWebhooksNested.posts.added.handler(
			{ key: fixtures.secret } as never,
			request(postAdded) as never,
		);
		expect(result).toMatchObject({
			success: true,
			data: {
				event: 'post.added',
				post: { current: { title: 'Webhook check' } },
			},
		});
		const bad = await ghostWebhooksNested.posts.added.handler(
			{ key: 'wrong' } as never,
			request(postAdded) as never,
		);
		expect(bad).toMatchObject({ success: false, statusCode: 401 });
	});
});

describe('risk levels', () => {
	it('marks emailing, publishing, theme changes and deletes destructive', () => {
		for (const id of [
			'posts.update',
			'posts.create',
			'members.create',
			'invites.create',
			'themes.activate',
			'posts.delete',
			'members.delete',
		] as const) {
			expect([id, ghostEndpointMeta[id].riskLevel]).toEqual([
				id,
				'destructive',
			]);
		}
		expect(ghostEndpointMeta['posts.list'].riskLevel).toBe('read');
		expect(ghostEndpointMeta['tags.create'].riskLevel).toBe('write');
	});
});
