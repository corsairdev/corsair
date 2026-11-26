/**
 * Live checks against a real Publora account.
 *
 * Skipped unless `PUBLORA_API_KEY` is set. Only read routes are called
 * (accounts.list, accounts.getContext, posts.list, posts.get,
 * webhooks.list), so the suite never creates, publishes or deletes
 * anything. An unknown post group id must come back as an HTTP 404 that the
 * NOT_FOUND handler matches.
 */
import { ApiError } from 'corsair/http';
import {
	getContext,
	getPost,
	listAccounts,
	listPosts,
	listWebhooks,
} from './endpoints/handlers';
import { PubloraEndpointOutputSchemas as Outputs } from './endpoints/types';
import { errorHandlers } from './error-handlers';

const apiKey = process.env.PUBLORA_API_KEY;
const describeLive = apiKey ? describe : describe.skip;

if (!apiKey) {
	console.warn(
		'[publora] PUBLORA_API_KEY is not set; skipping the live API suite.',
	);
}

type Ctx = Parameters<typeof listAccounts>[0];

const upserts: { id: string; data: unknown }[] = [];

function makeStore() {
	return {
		upsertByEntityId: async (id: string, data: unknown) => {
			upserts.push({ id, data });
		},
		deleteByEntityId: async () => true,
	};
}

function makeCtx(): Ctx {
	return {
		key: apiKey ?? '',
		options: {},
		db: { accounts: makeStore(), posts: makeStore() },
		database: undefined,
		$getAccountId: async () => 'integration-test',
	} as unknown as Ctx;
}

describeLive('Publora live API', () => {
	beforeEach(() => {
		upserts.length = 0;
	});

	it('lists connections matching the declared schema and caches them', async () => {
		const result = await listAccounts(makeCtx(), {});

		expect(() => Outputs.listAccounts.parse(result)).not.toThrow();
		expect(upserts).toHaveLength(result.connections.length);
		for (const connection of result.connections) {
			expect(connection.platformId).toMatch(/^[a-z]+-/);
		}
	});

	it('reads the account context with plan and quotas', async () => {
		const result = await getContext(makeCtx(), {});

		expect(result.context.plan?.key).toEqual(expect.any(String));
		expect(result.context.quotas).toBeDefined();
	});

	it('lists posts, and reads the newest one', async () => {
		const page = await listPosts(makeCtx(), { limit: 5 });
		expect(() => Outputs.listPosts.parse(page)).not.toThrow();
		expect(page.pagination?.limit).toBe(5);

		const first = page.posts[0];
		if (!first) return;
		const post = await getPost(makeCtx(), { postGroupId: first.postGroupId });
		expect(post.postGroupId).toBe(first.postGroupId);
		expect(post.status).toEqual(expect.any(String));
	});

	it('lists webhook subscriptions without secrets', async () => {
		const result = await listWebhooks(makeCtx(), {});

		for (const webhook of result.webhooks) {
			expect((webhook as Record<string, unknown>).secret).toBeUndefined();
		}
	});

	it('answers 404 for an unknown post group, matched by NOT_FOUND_ERROR', async () => {
		const error = await getPost(makeCtx(), {
			postGroupId: '000000000000000000000000',
		}).catch((e: unknown) => e);

		expect(error).toBeInstanceOf(ApiError);
		expect((error as ApiError).status).toBe(404);
		expect(errorHandlers.NOT_FOUND_ERROR.match(error as Error)).toBe(true);
	});
});
