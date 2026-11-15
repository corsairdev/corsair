import {
	IntegrationSchema,
	NotificationSchema,
	POSTIZ_POST_STATES,
	POSTIZ_POST_TYPES,
	PostizMediaSchema,
	PostizPostItemSchema,
	PostSchema,
	PostsCreateInputSchema,
	PostsListInputSchema,
} from './endpoints/types';
import { PostizSchema } from './schema';

const integrationId = 'cm4ean69r0003w8w1cdomox9n';

describe('Postiz plugin schema', () => {
	it('declares a semver version', () => {
		expect(PostizSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares no entities, because the plugin stores nothing', () => {
		expect(PostizSchema.entities).toEqual({});
		// Object.keys is always an array, so the value itself is what proves it.
		expect(Array.isArray(PostizSchema.entities)).toBe(false);
	});
});

describe('documented vocabularies', () => {
	it('pins the three post types', () => {
		expect(POSTIZ_POST_TYPES).toEqual(['draft', 'schedule', 'now']);
	});

	it('pins the four post states', () => {
		expect(POSTIZ_POST_STATES).toEqual([
			'QUEUE',
			'PUBLISHED',
			'ERROR',
			'DRAFT',
		]);
	});
});

describe('integration schema', () => {
	it('parses an integration with its customer group', () => {
		expect(
			IntegrationSchema.safeParse({
				id: integrationId,
				name: 'Nevo David',
				identifier: 'x',
				picture: 'https://uploads.postiz.com/avatar.jpg',
				disabled: false,
				profile: 'nevodavid',
				customer: { id: 'customer-id', name: 'My Company' },
			}).success,
		).toBe(true);
	});

	it('accepts an integration with no customer group', () => {
		expect(
			IntegrationSchema.safeParse({ id: integrationId, identifier: 'x' })
				.success,
		).toBe(true);
	});
});

describe('post schemas', () => {
	it('parses a post with its release URL and no error', () => {
		expect(
			PostSchema.safeParse({
				id: 'p1',
				content: 'Hello world!',
				state: 'PUBLISHED',
				publishDate: '2024-12-14T10:00:00.000Z',
				releaseURL: 'https://x.com/i/status/1',
				error: null,
				settings: { content_posting_method: 'DIRECT_POST' },
				integration: { id: integrationId, providerIdentifier: 'x' },
			}).success,
		).toBe(true);
	});

	it('keeps the provider settings as an open object, because each platform differs', () => {
		const parsed = PostSchema.parse({
			id: 'p1',
			settings: {
				__type: 'x',
				who_can_reply_post: 'everyone',
				nested: { list: [1, 2] },
			},
		});

		expect(parsed.settings).toMatchObject({
			__type: 'x',
			who_can_reply_post: 'everyone',
			nested: { list: [1, 2] },
		});
	});

	it('requires at least one part in a post item', () => {
		expect(
			PostizPostItemSchema.safeParse({
				integration: { id: integrationId },
				value: [{ content: 'Hello' }],
			}).success,
		).toBe(true);
		expect(
			PostizPostItemSchema.safeParse({
				integration: { id: integrationId },
				value: [],
			}).success,
		).toBe(false);
	});

	it('requires an integration id on every post item', () => {
		expect(
			PostizPostItemSchema.safeParse({ value: [{ content: 'Hello' }] }).success,
		).toBe(false);
	});

	it('parses a media reference with a thumbnail timestamp', () => {
		expect(
			PostizMediaSchema.safeParse({
				id: 'img-123',
				path: 'https://uploads.postiz.com/photo.jpg',
				thumbnailTimestamp: 5000,
			}).success,
		).toBe(true);
	});

	it('requires id and path on a media reference', () => {
		expect(PostizMediaSchema.safeParse({ id: 'img-1' }).success).toBe(false);
		expect(
			PostizMediaSchema.safeParse({ path: 'https://x/y.jpg' }).success,
		).toBe(false);
	});
});

describe('create input rules', () => {
	const base = {
		type: 'now' as const,
		date: '2024-12-14T10:00:00.000Z',
		shortLink: false,
		tags: [],
		posts: [
			{
				integration: { id: integrationId },
				value: [{ content: 'Hello' }],
			},
		],
	};

	it('accepts an immediate post with content', () => {
		expect(PostsCreateInputSchema.safeParse(base).success).toBe(true);
	});

	it('accepts a draft with no posts and a schedule with posts', () => {
		expect(
			PostsCreateInputSchema.safeParse({
				type: 'draft',
				date: base.date,
				shortLink: false,
				tags: [],
			}).success,
		).toBe(true);
		expect(
			PostsCreateInputSchema.safeParse({ ...base, type: 'schedule' }).success,
		).toBe(true);
	});

	it('rejects a schedule or immediate post with no posts', () => {
		for (const type of ['schedule', 'now'] as const) {
			expect(
				PostsCreateInputSchema.safeParse({
					type,
					date: base.date,
					shortLink: false,
					tags: [],
				}).success,
			).toBe(false);
		}
	});

	it('requires the three fields the API marks required, including shortLink', () => {
		// `shortLink` is required even when false, so omitting it must fail here.
		const { shortLink: _omitted, ...withoutShortLink } = base;
		expect(PostsCreateInputSchema.safeParse(withoutShortLink).success).toBe(
			false,
		);
	});

	it('accepts tags as value and label pairs', () => {
		expect(
			PostsCreateInputSchema.safeParse({
				...base,
				tags: [{ value: 'launch', label: 'Launch' }],
			}).success,
		).toBe(true);
		expect(
			PostsCreateInputSchema.safeParse({
				...base,
				tags: [{ value: 'launch' }],
			}).success,
		).toBe(false);
	});
});

describe('list input rules', () => {
	it('requires both ends of the window', () => {
		expect(
			PostsListInputSchema.safeParse({
				startDate: '2024-12-01T00:00:00.000Z',
			}).success,
		).toBe(false);
		expect(
			PostsListInputSchema.safeParse({
				startDate: '2024-12-01T00:00:00.000Z',
				endDate: '2024-12-31T00:00:00.000Z',
			}).success,
		).toBe(true);
	});

	it('rejects a window whose start is after its end', () => {
		expect(
			PostsListInputSchema.safeParse({
				startDate: '2024-12-31T00:00:00.000Z',
				endDate: '2024-12-01T00:00:00.000Z',
			}).success,
		).toBe(false);
	});

	it('allows a non-date string through rather than guessing its format', () => {
		// The API accepts its own date syntax; rejecting anything else here would
		// refuse a value the provider accepts.
		expect(
			PostsListInputSchema.safeParse({
				startDate: 'last_30_days',
				endDate: 'last_30_days',
			}).success,
		).toBe(true);
	});
});

describe('notification schema', () => {
	it('parses a notification with a null link', () => {
		expect(
			NotificationSchema.safeParse({
				id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
				content: 'Your post to X was published successfully',
				link: null,
				createdAt: '2025-01-15T10:30:00.000Z',
			}).success,
		).toBe(true);
	});
});
