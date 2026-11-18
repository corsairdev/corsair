/**
 * Live checks against a real PostOnce account.
 *
 * Skipped unless `POSTONCE_API_KEY` is set. Only read routes are called
 * (accounts.list, posts.list, posts.get), so the suite never publishes or
 * cancels anything. An unknown post id must come back as an HTTP 404 that the
 * NOT_FOUND handler matches.
 */
import { ApiError } from 'corsair/http';
import { getPost, listAccounts, listPosts } from './endpoints/handlers';
import { PostOnceEndpointOutputSchemas as Outputs } from './endpoints/types';
import { errorHandlers } from './error-handlers';

const apiKey = process.env.POSTONCE_API_KEY;
const describeLive = apiKey ? describe : describe.skip;

if (!apiKey) {
	console.warn(
		'[postonce] POSTONCE_API_KEY is not set; skipping the live API suite.',
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
		db: {
			accounts: makeStore(),
			posts: makeStore(),
		},
		database: undefined,
		$getAccountId: async () => 'integration-test',
	} as unknown as Ctx;
}

describeLive('PostOnce live API', () => {
	beforeEach(() => {
		upserts.length = 0;
	});

	it('lists accounts matching the declared schema and caches them', async () => {
		const result = await listAccounts(makeCtx(), {});

		expect(() => Outputs.listAccounts.parse(result)).not.toThrow();
		expect(upserts).toHaveLength(result.data.length);
	});

	it('lists posts and reads the first one back', async () => {
		const ctx = makeCtx();
		const listed = await listPosts(ctx, { limit: 5 });
		expect(() => Outputs.listPosts.parse(listed)).not.toThrow();

		const first = listed.data[0];
		if (!first) return;
		const fetched = await getPost(ctx, { id: first.id });
		expect(() => Outputs.getPost.parse(fetched)).not.toThrow();
		expect(fetched.data.id).toBe(first.id);
	});

	it('answers an unknown post id with a 404', async () => {
		const error = await getPost(makeCtx(), {
			id: '00000000-0000-4000-8000-000000000000',
		}).catch((e) => e);

		expect(error).toBeInstanceOf(ApiError);
		expect((error as ApiError).status).toBe(404);
		expect(errorHandlers.NOT_FOUND_ERROR.match(error)).toBe(true);
	});
});
