/**
 * Live checks against a real BigMailer account.
 *
 * Skipped unless `BIGMAILER_API_KEY` is set, so CI and contributors without
 * credentials are unaffected. Phase 1 only covers the read-only `auth.me`
 * and `brands.list` calls - no API key was available to this session to
 * verify write/delete behaviour live. Phase 2/3 should extend this file with
 * a create/update/delete cycle (brand -> property/field/list -> cleanup)
 * once a test account is available, following the same `try`/`finally`
 * cleanup pattern other plugins in this repo use for live write tests.
 */
import { Auth, Brands } from './endpoints';

const apiKey = process.env.BIGMAILER_API_KEY;

const describeLive = apiKey ? describe : describe.skip;

type Ctx = Parameters<typeof Brands.list>[0];

function makeStore() {
	return {
		upsertByEntityId: async (_id: string, _data: unknown) => undefined,
		deleteByEntityId: async (_id: string) => true,
	};
}

function makeCtx(): Ctx {
	return {
		key: apiKey ?? '',
		db: {
			brands: makeStore(),
			brandProperties: makeStore(),
			fields: makeStore(),
			lists: makeStore(),
			connections: makeStore(),
			messageTypes: makeStore(),
			senders: makeStore(),
			contacts: makeStore(),
			segments: makeStore(),
			suppressionLists: makeStore(),
			templates: makeStore(),
			bulkCampaigns: makeStore(),
			transactionalCampaigns: makeStore(),
		},
		database: undefined,
		$getAccountId: async () => 'live-account',
	} as unknown as Ctx;
}

describeLive('BigMailer live API', () => {
	it('authenticates and lists brands', async () => {
		const ctx = makeCtx();

		const me = await Auth.me(ctx, {});
		expect(me).toBeDefined();

		const brands = await Brands.list(ctx, {});
		expect(Array.isArray(brands.data)).toBe(true);
	});
});
