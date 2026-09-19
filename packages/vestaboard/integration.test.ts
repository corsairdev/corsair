import { makeVestaboardRequest, VestaboardAPIError } from './client';
import { VestaboardSubscription } from './schema';

const LIVE_KEY = process.env.VESTABOARD_API_KEY;
const LIVE_SECRET = process.env.VESTABOARD_API_SECRET;
const describeIfCreds = LIVE_KEY && LIVE_SECRET ? describe : describe.skip;

describe('Vestaboard live Subscription API', () => {
	it('rejects invalid credentials on GET /subscriptions', async () => {
		const packed = `${'invalid-key'}\x1e${'invalid-secret'}`;
		const err = await makeVestaboardRequest('/subscriptions', packed).catch(
			(error: unknown) => error,
		);
		expect(err).toBeInstanceOf(VestaboardAPIError);
		expect([400, 401]).toContain((err as VestaboardAPIError).status);
	});
});

describeIfCreds('Vestaboard live Subscription API (authenticated)', () => {
	it('returns official subscription rows', async () => {
		const packed = `${LIVE_KEY as string}\x1e${LIVE_SECRET as string}`;
		const raw = await makeVestaboardRequest('/subscriptions', packed);
		const rows = Array.isArray(raw)
			? raw
			: (raw as { subscriptions: unknown }).subscriptions;
		const subscriptions = VestaboardSubscription.array().parse(rows);
		expect(subscriptions.length).toBeGreaterThan(0);
		expect(subscriptions[0]?.id.length).toBeGreaterThan(0);
		expect(subscriptions[0]?.boardId.length).toBeGreaterThan(0);
	});
});
