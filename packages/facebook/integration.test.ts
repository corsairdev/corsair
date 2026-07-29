import 'dotenv/config';

import { makeFacebookRequest, makePageFacebookRequest } from './client';
import * as CommentsEndpoints from './endpoints/comments';
import * as ConversationsEndpoints from './endpoints/conversations';
import * as MessagesEndpoints from './endpoints/messages';
import * as PagesEndpoints from './endpoints/pages';
import * as PhotosEndpoints from './endpoints/photos';
import * as PostsEndpoints from './endpoints/posts';
import * as UsersEndpoints from './endpoints/users';
import type { FacebookContext } from './index';

/**
 * Live Graph smoke tests — no better-sqlite3 / Corsair DB required.
 *
 *   FB_ACCESS_TOKEN=... \
 *   FB_PAGE_ID=... \          # optional; auto-detected from /me/accounts
 *   pnpm --filter @corsair-dev/facebook test -- integration.test.ts
 *
 * Optional: FB_RECIPIENT_ID, FB_TEST_IMAGE_URL
 */

const FB_ACCESS_TOKEN = process.env.FB_ACCESS_TOKEN;
const FB_RECIPIENT_ID = process.env.FB_RECIPIENT_ID;
const FB_TEST_IMAGE_URL =
	process.env.FB_TEST_IMAGE_URL ??
	'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/PNG_transparency_demonstration_1.png/240px-PNG_transparency_demonstration_1.png';

function entityStore() {
	const rows = new Map<string, { data: Record<string, unknown> }>();
	return {
		async findByEntityId(entityId: string) {
			return rows.get(entityId) ?? null;
		},
		async upsertByEntityId(entityId: string, data: Record<string, unknown>) {
			rows.set(entityId, {
				data: { ...(rows.get(entityId)?.data ?? {}), ...data },
			});
			return { data };
		},
		async deleteByEntityId(entityId: string) {
			rows.delete(entityId);
		},
	};
}

function createLiveCtx(token: string): FacebookContext {
	return {
		key: token,
		$getAccountId: async () => 'live-facebook-test',
		database: undefined,
		db: {
			users: entityStore(),
			pages: entityStore(),
			posts: entityStore(),
			comments: entityStore(),
			conversations: entityStore(),
			messages: entityStore(),
			albums: entityStore(),
			photos: entityStore(),
			videos: entityStore(),
			insights: entityStore(),
			reactions: entityStore(),
			pageRoles: entityStore(),
		},
		logger: {
			debug: () => {},
			info: () => {},
			warn: () => {},
			error: () => {},
		},
		events: {
			create: async () => undefined,
		},
	} as unknown as FacebookContext;
}

async function resolvePageId(token: string): Promise<string | null> {
	const fromEnv = process.env.FB_PAGE_ID?.trim();
	if (fromEnv && fromEnv !== 'missing-page' && /^\d+$/.test(fromEnv)) {
		return fromEnv;
	}
	const accounts = await makeFacebookRequest<{
		data?: Array<{ id?: string }>;
	}>('/me/accounts', token, {
		query: { fields: 'id,name', limit: 10 },
	});
	return accounts.data?.[0]?.id ?? null;
}

const hasToken = Boolean(FB_ACCESS_TOKEN);

(hasToken ? describe : describe.skip)('Facebook live integration', () => {
	const token = FB_ACCESS_TOKEN!;
	let ctx: FacebookContext;
	let pageId: string | null = null;

	beforeAll(async () => {
		ctx = createLiveCtx(token);
		pageId = await resolvePageId(token);
	});

	it('reads the authenticated user', async () => {
		const me = await UsersEndpoints.getCurrentUser(ctx, {});
		expect(me.id).toBeDefined();
		expect(me.name).toBeDefined();
	});

	it('lists managed pages via /me/accounts', async () => {
		const pages = await UsersEndpoints.listManagedPages(ctx, {});
		expect(Array.isArray(pages.data)).toBe(true);
		if ((pages.data?.length ?? 0) === 0) {
			console.warn(
				'[facebook live] No Pages on this token. Create a Facebook Page and re-run with pages_manage_posts granted.',
			);
		}
	});

	it('reads page details / feed / creates unpublished post when a Page exists', async () => {
		if (!pageId) return;

		const details = await PagesEndpoints.getDetails(ctx, { page_id: pageId });
		expect(details.id).toBe(pageId);

		const feed = await PostsEndpoints.list(ctx, { page_id: pageId, limit: 5 });
		expect(Array.isArray(feed.data)).toBe(true);

		let createdId: string | undefined;
		try {
			const created = await PostsEndpoints.create(ctx, {
				page_id: pageId,
				message: `corsair fb smoke ${Date.now()}`,
				published: false,
			});
			createdId = created.id;
			expect(createdId).toBeDefined();
		} finally {
			if (createdId) {
				await PostsEndpoints.remove(ctx, {
					post_id: createdId,
					page_id: pageId,
				}).catch(() => undefined);
			}
		}
	});

	it('schedules a post with published=false when a Page exists', async () => {
		if (!pageId) return;

		let scheduledId: string | undefined;
		try {
			const scheduled = await PostsEndpoints.create(ctx, {
				page_id: pageId,
				message: `corsair scheduled smoke ${Date.now()}`,
				scheduled_publish_time: Math.floor(Date.now() / 1000) + 3600,
			});
			scheduledId = scheduled.id;
			expect(scheduledId).toBeDefined();
		} finally {
			if (scheduledId) {
				await PostsEndpoints.remove(ctx, {
					post_id: scheduledId,
					page_id: pageId,
				}).catch(() => undefined);
			}
		}
	});

	it('lists uploaded photos when a Page exists', async () => {
		if (!pageId) return;

		const photos = await PhotosEndpoints.list(ctx, {
			page_id: pageId,
			limit: 5,
		});
		expect(Array.isArray(photos.data)).toBe(true);
	});

	it('uploads an unpublished photo when a Page exists', async () => {
		if (!pageId) return;

		let uploadedId: string | undefined;
		try {
			const uploaded = await PhotosEndpoints.upload(ctx, {
				page_id: pageId,
				url: FB_TEST_IMAGE_URL,
			});
			uploadedId = uploaded.id;
			expect(uploadedId).toBeDefined();
		} finally {
			// Always delete the Graph photo node so smoke runs don't leave orphans.
			if (uploadedId) {
				await makePageFacebookRequest<{ success?: boolean }>(
					`/${uploadedId}`,
					ctx,
					pageId,
					{ method: 'DELETE' },
				).catch(() => undefined);
			}
		}
	});

	it('lists conversations when a Page exists', async () => {
		if (!pageId) return;

		const conversations = await ConversationsEndpoints.list(ctx, {
			page_id: pageId,
			limit: 5,
		});
		expect(Array.isArray(conversations.data)).toBe(true);
	});

	it('sends a Messenger text when FB_RECIPIENT_ID and Page exist', async () => {
		if (!pageId || !FB_RECIPIENT_ID) return;

		const sent = await MessagesEndpoints.send(ctx, {
			page_id: pageId,
			recipient_id: FB_RECIPIENT_ID,
			message: `corsair messenger smoke ${Date.now()}`,
		});
		expect(sent.recipient_id || sent.message_id).toBeDefined();
	});

	it('creates a comment when a Page and post exist', async () => {
		if (!pageId) return;

		const created = await PostsEndpoints.create(ctx, {
			page_id: pageId,
			message: `corsair comment parent ${Date.now()}`,
			published: false,
		});
		if (!created.id) return;

		try {
			const comment = await CommentsEndpoints.create(ctx, {
				object_id: created.id,
				page_id: pageId,
				message: 'corsair smoke comment',
			});
			expect(comment.id).toBeDefined();
		} finally {
			await PostsEndpoints.remove(ctx, {
				post_id: created.id,
				page_id: pageId,
			});
		}
	});
});
