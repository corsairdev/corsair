import { AuthMissingError } from 'corsair/core';
import {
	checkDiscourseStoredPairing,
	normalizeDiscourseSiteUrl,
	resolveDiscourseTarget,
} from './auth';
import {
	discourseEndpointMeta,
	discourseEndpointsNested,
} from './endpoints/catalog';
import type { DiscourseContext } from './index';
import { discourse } from './index';
import {
	canonicalEvent,
	discourseWebhooksNested,
	matchDiscourseWebhook,
	verifyDiscourseSignature,
} from './webhooks';

// Discourse specifics on top of the generic suites: the forum URL, the
// Api-Key + Api-Username headers, numeric path ids, the live spec fixes, and
// webhooks checked against two real deliveries from Discourse 2026.12 (11-28).

const fixtures = require('./__fixtures__/discourse-deliveries.json') as {
	secret: string;
	deliveries: Array<{ headers: Record<string, string>; rawBody: string }>;
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
		return new Response(JSON.stringify(body), {
			status,
			headers: { 'content-type': 'application/json' },
		});
	});
}

const KEY = 'discourse_live_like_key';

function ctx(options: Record<string, string> = {}): DiscourseContext {
	return {
		endpoints: {},
		$getAccountId: () => Promise.resolve('test-account'),
		key: KEY,
		options: {
			siteUrl: 'https://forum.example.com',
			username: 'system',
			...options,
		},
		keys: { get_api_key: () => Promise.resolve(KEY) },
		db: {},
		// `unknown` because a test context fills only the fields the endpoints read.
	} as unknown as DiscourseContext;
}

beforeEach(() => {
	calls = [];
});
afterEach(() => {
	jest.restoreAllMocks();
});

describe('forum URL and user', () => {
	it('keeps a subfolder and drops trailing slashes', () => {
		expect(normalizeDiscourseSiteUrl('https://forum.example.com/')).toBe(
			'https://forum.example.com',
		);
		expect(normalizeDiscourseSiteUrl('https://example.com/forum//')).toBe(
			'https://example.com/forum',
		);
		expect(normalizeDiscourseSiteUrl('http://localhost:3000')).toBe(
			'http://localhost:3000',
		);
	});

	it('refuses plain http to another host, credentials and queries', () => {
		expect(() => normalizeDiscourseSiteUrl('http://forum.example.com')).toThrow(
			/https/,
		);
		expect(() =>
			normalizeDiscourseSiteUrl('https://u:p@forum.example.com'),
		).toThrow(/credentials/);
		expect(() =>
			normalizeDiscourseSiteUrl('https://forum.example.com/?a=1'),
		).toThrow(/query/);
	});

	it('asks to connect without a forum URL or a username', async () => {
		await expect(
			resolveDiscourseTarget({
				key: KEY,
				options: { username: 'system' },
				keys: {},
			}),
		).rejects.toBeInstanceOf(AuthMissingError);
		await expect(
			resolveDiscourseTarget({
				key: KEY,
				options: { siteUrl: 'https://forum.example.com' },
				keys: {},
			}),
		).rejects.toBeInstanceOf(AuthMissingError);
		await expect(
			resolveDiscourseTarget({
				key: KEY,
				options: {},
				keys: {
					get_site_url: () => Promise.resolve('https://forum.example.com'),
					get_username: () => Promise.resolve('admin'),
				},
			}),
		).resolves.toMatchObject({
			base: 'https://forum.example.com',
			headers: { 'Api-Key': KEY, 'Api-Username': 'admin' },
		});
	});

	it('keeps a stored key on its own forum', async () => {
		const keys = {
			get_site_url: () => Promise.resolve('https://a.example.com'),
			get_username: () => Promise.resolve('admin'),
		};
		await expect(
			checkDiscourseStoredPairing({ siteUrl: 'https://a.example.com/' }, keys),
		).resolves.toBeUndefined();
		await expect(
			checkDiscourseStoredPairing({ siteUrl: 'https://b.example.com' }, keys),
		).rejects.toBeInstanceOf(AuthMissingError);
		const plugin = discourse({ siteUrl: 'https://b.example.com' });
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
	it('sends Api-Key and Api-Username, and takes numeric ids in the path', async () => {
		reply(200, { id: 42, title: 'Hello', post_stream: { posts: [] } });
		await discourseEndpointsNested.topics.get(ctx(), { id: 42 });
		expect(new URL(calls[0]?.url ?? '').pathname).toBe('/t/42.json');
		expect(calls[0]?.headers.get('api-key')).toBe(KEY);
		expect(calls[0]?.headers.get('api-username')).toBe('system');
	});

	it('sends post_ids[] of topics.getPosts as query values, not a GET body', async () => {
		reply(200, { post_stream: { posts: [] } });
		await discourseEndpointsNested.topics.getPosts(ctx(), {
			id: 7,
			'post_ids[]': [11, 12],
		});
		const url = new URL(calls[0]?.url ?? '');
		expect(url.searchParams.getAll('post_ids[]')).toEqual(['11', '12']);
		expect(calls[0]?.body).toBeUndefined();
	});

	it('sends a list of emails to invites.createMultiple', async () => {
		reply(200, { num_successfully_created_invitations: 2 });
		await discourseEndpointsNested.invites.createMultiple(ctx(), {
			email: ['a@example.com', 'b@example.com'],
			skip_email: true,
		});
		expect(JSON.parse(String(calls[0]?.body)).email).toEqual([
			'a@example.com',
			'b@example.com',
		]);
	});

	it('reads the booleans Discourse sends in topic lists', async () => {
		reply(200, {
			topic_list: {
				topics: [{ id: 1, title: 'x', bookmarked: true, liked: false }],
			},
		});
		await expect(
			discourseEndpointsNested.categories.listTopics(ctx(), {
				slug: 'general',
				id: 4,
			}),
		).resolves.toMatchObject({
			topic_list: { topics: [{ bookmarked: true, liked: false }] },
		});
	});

	it('sends with_uploads as the text Discourse compares, and pages group members', async () => {
		reply(200, { success: 'OK' });
		await discourseEndpointsNested.backups.create(ctx(), {
			with_uploads: 'true',
		});
		expect(JSON.parse(String(calls[0]?.body))).toEqual({
			with_uploads: 'true',
		});
		calls = [];
		reply(200, {
			members: [],
			owners: [],
			meta: { total: 0, limit: 10, offset: 50 },
		});
		await discourseEndpointsNested.groups.listMembers(ctx(), {
			name: 'staff',
			offset: 50,
			limit: 10,
		});
		const url = new URL(calls[0]?.url ?? '');
		expect([
			url.searchParams.get('offset'),
			url.searchParams.get('limit'),
		]).toEqual(['50', '10']);
	});

	it('returns a backup download as a file', async () => {
		jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response(new Uint8Array([31, 139, 8, 0]), {
				status: 200,
				headers: { 'content-type': 'application/gzip' },
			}),
		);
		const file = await discourseEndpointsNested.backups.download(ctx(), {
			filename: 'forum-2026.tar.gz',
			token: 't',
		});
		expect(file).toMatchObject({
			contentType: 'application/gzip',
			byteLength: 4,
		});
	});

	it('returns the topic an external id redirects to, with its timer object', async () => {
		reply(200, {
			id: 9,
			title: 'Imported',
			topic_timer: {
				id: 3,
				status_type: 'close',
				execute_at: '2099-01-01T00:00:00Z',
			},
		});
		await expect(
			discourseEndpointsNested.topics.getByExternalId(ctx(), {
				external_id: 'ext-9',
			}),
		).resolves.toMatchObject({
			id: 9,
			title: 'Imported',
			topic_timer: { status_type: 'close' },
		});
	});

	it('sends an invite once on a 429 (the daily allowance)', async () => {
		reply(429, { errors: ['You have performed this action too many times.'] });
		await expect(
			discourseEndpointsNested.invites.create(ctx(), {
				email: 'a@example.com',
				skip_email: true,
			}),
		).rejects.toThrow(/Discourse 429/);
		expect(calls).toHaveLength(1);
	});

	it('keeps the key out of an error', async () => {
		reply(403, {
			errors: [`invalid api key ${KEY}`],
			error_type: 'invalid_access',
		});
		const error = await discourseEndpointsNested.site
			.get(ctx(), {})
			.catch((e: unknown) => e as Error);
		expect(String(error)).toMatch(/Discourse 403/);
		expect(String(error)).not.toContain(KEY);
	});
});

describe('webhooks (real Discourse 2026.12 deliveries)', () => {
	const [topicCreated, postCreated] = fixtures.deliveries as [
		(typeof fixtures.deliveries)[number],
		(typeof fixtures.deliveries)[number],
	];
	const request = (
		d: (typeof fixtures.deliveries)[number],
		rawBody = d.rawBody,
	) => ({
		headers: d.headers,
		body: rawBody,
		rawBody,
		payload: JSON.parse(rawBody),
	});

	it('verifies the signature of real deliveries and refuses a changed one', () => {
		expect(
			verifyDiscourseSignature(request(topicCreated), fixtures.secret),
		).toBe(true);
		expect(
			verifyDiscourseSignature(request(postCreated), fixtures.secret),
		).toBe(true);
		expect(verifyDiscourseSignature(request(topicCreated), 'wrong')).toBe(
			false,
		);
		expect(
			verifyDiscourseSignature(
				request(
					topicCreated,
					topicCreated.rawBody.replace('"topic"', '"topik"'),
				),
				fixtures.secret,
			),
		).toBe(false);
	});

	it('maps the event names Discourse groups together', () => {
		expect(canonicalEvent('topic_closed_status_updated')).toBe(
			'topic_status_updated',
		);
		expect(canonicalEvent('topic_pinned_globally_status_updated')).toBe(
			'topic_status_updated',
		);
		expect(canonicalEvent('reviewable_score_updated')).toBe(
			'reviewable_updated',
		);
		expect(canonicalEvent('reviewable_transitioned_to')).toBe(
			'reviewable_updated',
		);
		expect(canonicalEvent('topic_edited')).toBe('topic_edited');
		const closed = {
			...topicCreated,
			headers: {
				...topicCreated.headers,
				'x-discourse-event': 'topic_closed_status_updated',
			},
		};
		expect(
			discourseWebhooksNested.topics.statusUpdated.match(request(closed)),
		).toBe(true);
		expect(discourseWebhooksNested.topics.edited.match(request(closed))).toBe(
			false,
		);
	});

	it('routes by X-Discourse-Event and parses the record', async () => {
		expect(matchDiscourseWebhook(request(topicCreated))).toBe(true);
		expect(
			discourseWebhooksNested.topics.created.match(request(topicCreated)),
		).toBe(true);
		expect(
			discourseWebhooksNested.posts.created.match(request(topicCreated)),
		).toBe(false);
		expect(
			discourseWebhooksNested.posts.created.match(request(postCreated)),
		).toBe(true);
		expect(
			matchDiscourseWebhook({
				headers: { 'x-discourse-event': 'topic_created' },
				body: '{}',
			}),
		).toBe(false);
		const ok = await discourseWebhooksNested.topics.created.handler(
			{ key: fixtures.secret } as never,
			request(topicCreated) as never,
		);
		expect(ok).toMatchObject({
			success: true,
			data: { topic: { title: expect.any(String) } },
		});
		const bad = await discourseWebhooksNested.topics.created.handler(
			{ key: 'wrong' } as never,
			request(topicCreated) as never,
		);
		expect(bad).toMatchObject({ success: false, statusCode: 401 });
	});
});

describe('risk levels', () => {
	it('marks public posting, emails, moderation and deletes destructive', () => {
		for (const id of [
			'posts.create',
			'invites.create',
			'users.suspend',
			'users.anonymize',
			'users.sendPasswordResetEmail',
			'backups.create',
			'topics.delete',
			'users.delete',
		] as const) {
			expect([id, discourseEndpointMeta[id].riskLevel]).toEqual([
				id,
				'destructive',
			]);
		}
		expect(discourseEndpointMeta['topics.listLatest'].riskLevel).toBe('read');
		expect(discourseEndpointMeta['categories.create'].riskLevel).toBe('write');
	});
});
