/**
 * Guards the persisted entity schemas and the endpoint schemas against the
 * ways they go wrong: dropping a field PostOnce returns, requiring a field
 * PostOnce sometimes omits or nulls, and accepting an input the API rejects.
 *
 * Key lists are the properties of `Account`, `Post`, `PostTarget` and
 * `MediaInput` in https://postonce.to/api/openapi.json.
 */

import {
	PostOnceEndpointInputSchemas as Inputs,
	PostOnceEndpointOutputSchemas as Outputs,
} from './endpoints/types';
import { PostOnceSchema } from './schema';
import {
	PostOnceAccount,
	PostOnceMedia,
	PostOncePost,
	PostOncePostTarget,
} from './schema/database';

const OFFICIAL_ACCOUNT_KEYS = [
	'id',
	'platform',
	'username',
	'avatar_url',
	'status',
	'capabilities',
	'media_requirements',
	'created_at',
	'updated_at',
] as const;

const OFFICIAL_POST_KEYS = [
	'id',
	'content',
	'external_id',
	'media',
	'origin',
	'publish_at',
	'status',
	'created_at',
	'targets',
] as const;

const OFFICIAL_TARGET_KEYS = [
	'target_post_id',
	'account_id',
	'platform',
	'target_variant',
	'username',
	'status',
	'error',
	'platform_post_id',
	'platform_post_url',
	'scheduled_time',
] as const;

const OFFICIAL_MEDIA_KEYS = [
	'url',
	'type',
	'width',
	'height',
	'size',
	'duration',
	'thumbnail_url',
] as const;

describe('PostOnce schema', () => {
	it('declares a semver version', () => {
		expect(PostOnceSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares accounts and posts', () => {
		expect(Object.keys(PostOnceSchema.entities).sort()).toEqual([
			'accounts',
			'posts',
		]);
	});
});

describe('entity schemas declare every official attribute', () => {
	it.each([
		['Account', PostOnceAccount.shape, OFFICIAL_ACCOUNT_KEYS],
		['Post', PostOncePost.shape, OFFICIAL_POST_KEYS],
		['PostTarget', PostOncePostTarget.shape, OFFICIAL_TARGET_KEYS],
		['MediaInput', PostOnceMedia.shape, OFFICIAL_MEDIA_KEYS],
	] as const)('%s', (_name, declared, keys) => {
		for (const key of keys) {
			expect(declared).toHaveProperty(key);
		}
	});
});

describe('entity schemas require only the primary key', () => {
	it('accounts parse a record carrying only id', () => {
		expect(PostOnceAccount.safeParse({ id: 'a1' }).success).toBe(true);
	});

	it('posts parse a record carrying only id', () => {
		expect(PostOncePost.safeParse({ id: 'p1' }).success).toBe(true);
	});

	it('documented nulls parse', () => {
		expect(
			PostOnceAccount.safeParse({
				id: 'a1',
				avatar_url: null,
				capabilities: null,
				media_requirements: null,
			}).success,
		).toBe(true);
		expect(
			PostOncePost.safeParse({
				id: 'p1',
				external_id: null,
				origin: null,
				publish_at: null,
				created_at: null,
				targets: [{ account_id: null, error: null, platform_post_url: null }],
			}).success,
		).toBe(true);
	});
});

describe('entity schemas reject a record with no key', () => {
	it('rejects an account with no id', () => {
		expect(PostOnceAccount.safeParse({ platform: 'x' }).success).toBe(false);
	});

	it('rejects a post with no id', () => {
		expect(PostOncePost.safeParse({ status: 'scheduled' }).success).toBe(false);
	});
});

describe('entity schemas keep unknown fields', () => {
	it('preserves a field PostOnce adds later rather than dropping it', () => {
		const parsed = PostOncePost.parse({ id: 'p1', some_future_field: 'kept' });
		expect(parsed).toHaveProperty('some_future_field', 'kept');
	});
});

describe('createPost input', () => {
	it('requires targets', () => {
		expect(Inputs.createPost.safeParse({ content: 'hi' }).success).toBe(false);
	});

	it('requires an account_id on each target and a url on each media item', () => {
		expect(
			Inputs.createPost.safeParse({ content: 'hi', targets: [{}] }).success,
		).toBe(false);
		expect(
			Inputs.createPost.safeParse({
				targets: [{ account_id: 'a1' }],
				media: [{ type: 'image' }],
			}).success,
		).toBe(false);
	});

	it('rejects a media type outside image and video', () => {
		expect(
			Inputs.createPost.safeParse({
				targets: [{ account_id: 'a1' }],
				media: [{ url: 'https://example.com/a.gif', type: 'gif' }],
			}).success,
		).toBe(false);
	});

	it('caps the idempotency key at 200 characters', () => {
		expect(
			Inputs.createPost.safeParse({
				targets: [{ account_id: 'a1' }],
				idempotencyKey: 'k'.repeat(201),
			}).success,
		).toBe(false);
	});

	it('accepts a scheduled post with media and per-target options', () => {
		expect(
			Inputs.createPost.safeParse({
				content: 'Launching today',
				targets: [
					{
						account_id: 'a1',
						content_override: null,
						platform_options: { ai_generated: true },
					},
				],
				media: [
					{
						url: 'https://example.com/clip.mp4',
						type: 'video',
						thumbnail_url: 'https://example.com/cover.jpg',
					},
				],
				publish_at: '2026-12-01T15:00:00Z',
				idempotencyKey: 'launch-1',
			}).success,
		).toBe(true);
	});
});

describe('listPosts input', () => {
	it('keeps limit within 1-100', () => {
		expect(Inputs.listPosts.safeParse({ limit: 0 }).success).toBe(false);
		expect(Inputs.listPosts.safeParse({ limit: 101 }).success).toBe(false);
		expect(Inputs.listPosts.safeParse({ limit: 100 }).success).toBe(true);
	});
});

describe('documented responses satisfy the output schemas', () => {
	const post = {
		id: '2f1c7a4e-4d3b-4f5e-9a8b-1c2d3e4f5a6b',
		content: 'Launching today',
		external_id: null,
		media: [{ url: 'https://example.com/launch.png', type: 'image' }],
		origin: 'api',
		publish_at: '2026-12-01T15:00:00.000Z',
		status: 'scheduled',
		created_at: '2026-11-17T09:00:00.000Z',
		targets: [
			{
				target_post_id: 'tp_1',
				account_id: 'a1',
				platform: 'linkedin',
				target_variant: null,
				username: 'corsair-test',
				status: 'scheduled',
				error: null,
				platform_post_id: null,
				platform_post_url: null,
				scheduled_time: '2026-12-01T15:00:00.000Z',
			},
		],
	};

	it('list accounts', () => {
		expect(
			Outputs.listAccounts.parse({
				data: [
					{
						id: 'a1',
						platform: 'twitter',
						username: 'corsair',
						avatar_url: null,
						status: 'active',
						capabilities: null,
						media_requirements: null,
						created_at: '2026-11-01T10:00:00.000Z',
						updated_at: '2026-11-01T10:00:00.000Z',
					},
				],
			}),
		).toBeTruthy();
	});

	it('create, get and cancel post', () => {
		expect(Outputs.createPost.parse({ data: post })).toBeTruthy();
		expect(Outputs.getPost.parse({ data: post })).toBeTruthy();
		expect(
			Outputs.cancelPost.parse({ data: { ...post, status: 'cancelled' } }),
		).toBeTruthy();
	});

	it('list posts, first and last page', () => {
		expect(
			Outputs.listPosts.parse({
				data: [post],
				meta: { next_cursor: post.id },
			}),
		).toBeTruthy();
		expect(
			Outputs.listPosts.parse({ data: [], meta: { next_cursor: null } }),
		).toBeTruthy();
	});
});
