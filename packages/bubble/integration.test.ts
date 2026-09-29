/**
 * Live checks against a real Bubble app.
 *
 * Skipped unless BUBBLE_APP_NAME and BUBBLE_API_KEY are set. Default `jest`
 * also ignores this file (see jest.config.cjs), so CI never reaches the
 * network. Run with:
 *   BUBBLE_APP_NAME=… BUBBLE_API_KEY=… pnpm test:live
 *
 * The configured data type (BUBBLE_TYPE_NAME, default `corsairlive`) must
 * exist on the app and have Create/Search/Modify/Delete-via-API permissions
 * enabled for admin tokens. Writes: one thing is created, fetched, listed,
 * and deleted - no permanent state is left behind.
 */
import { Things } from './endpoints';
import { BubbleThingEntity } from './schema/database';

const appName = process.env.BUBBLE_APP_NAME;
const apiKey = process.env.BUBBLE_API_KEY;
const typeName = process.env.BUBBLE_TYPE_NAME ?? 'corsairlive';
const describeLive = appName && apiKey ? describe : describe.skip;

type Ctx = Parameters<typeof Things.create>[0];

function makeStore() {
	return {
		upsertByEntityId: async (_id: string, _data: unknown) => undefined,
		deleteByEntityId: async (_id: string) => true,
	};
}

function makeCtx(): Ctx {
	return {
		key: apiKey ?? '',
		options: { appName: appName ?? '' },
		db: { things: makeStore() },
		keys: {
			get_appName: async () => appName ?? '',
		},
		$getAccountId: async () => 'live-account',
	} as unknown as Ctx;
}

describeLive('Bubble live API', () => {
	const ctx = makeCtx();

	it('creates, gets, lists, and deletes a thing', async () => {
		const created = await Things.create(ctx, { typeName, fields: {} });
		expect(created.status).toBe('success');
		expect(typeof created.id).toBe('string');
		const thingId = created.id;

		try {
			const fetched = await Things.get(ctx, { typeName, thingId });
			expect(fetched._id).toBe(thingId);
			expect(BubbleThingEntity.safeParse(fetched).success).toBe(true);
		} finally {
			await Things.delete(ctx, { typeName, thingId });
		}

		await expect(Things.get(ctx, { typeName, thingId })).rejects.toMatchObject({
			status: 404,
		});
	});

	it('lists things of the configured data type', async () => {
		const result = await Things.list(ctx, { typeName, limit: 5 });
		expect(Array.isArray(result.response.results)).toBe(true);
		if (result.response.results[0]) {
			expect(
				BubbleThingEntity.safeParse(result.response.results[0]).success,
			).toBe(true);
		}
	});
});
