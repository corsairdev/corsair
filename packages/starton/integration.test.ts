import { ApiError } from 'corsair/http';
import { makeStartonRequest } from './client';
import { StartonWallet } from './schema';

const LIVE_ENABLED = process.env.STARTON_LIVE === '1';
const LIVE_KEY = process.env.STARTON_API_KEY;
const describeIfLive = LIVE_ENABLED ? describe : describe.skip;
const describeIfKey = LIVE_ENABLED && LIVE_KEY ? describe : describe.skip;

describeIfLive('Starton live REST v3', () => {
	it('rejects an invalid API key on GET /v3/kms/wallet', async () => {
		// Safe: the caught value is only passed through; toBeInstanceOf below checks it.
		// A narrower type is not practical because a rejection can be any value.
		const err = await makeStartonRequest(
			'v3/kms/wallet',
			'invalid_starton_key',
		).catch((error: unknown) => error);
		expect(err).toBeInstanceOf(ApiError);
		expect(err).toMatchObject({ status: 401 });
	});
});

describeIfKey('Starton live REST v3 (authenticated)', () => {
	it('lists wallets', async () => {
		// Safe: elements are parsed with StartonWallet below, so the shape is validated at runtime.
		// A narrower type is not practical because a static element type would duplicate that schema.
		const raw = await makeStartonRequest<{ items: unknown[] }>(
			'v3/kms/wallet',
			LIVE_KEY ?? '',
			{ query: { limit: 1 } },
		);
		expect(Array.isArray(raw.items)).toBe(true);
		if (raw.items[0] !== undefined) {
			expect(StartonWallet.parse(raw.items[0]).address.length).toBeGreaterThan(
				0,
			);
		}
	});
});
