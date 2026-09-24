import { ApiError } from 'corsair/http';
import { makeStartonRequest } from './client';
import { StartonWallet } from './schema';

const LIVE_ENABLED = process.env.STARTON_LIVE === '1';
const LIVE_KEY = process.env.STARTON_API_KEY;
const describeIfLive = LIVE_ENABLED ? describe : describe.skip;
const describeIfKey = LIVE_ENABLED && LIVE_KEY ? describe : describe.skip;

describeIfLive('Starton live REST v3', () => {
	it('rejects an invalid API key on GET /v3/kms/wallet', async () => {
		const err = await makeStartonRequest(
			'v3/kms/wallet',
			'invalid_starton_key',
		).catch((error: unknown) => error);
		expect(err).toBeInstanceOf(ApiError);
		expect((err as ApiError).status).toBe(401);
	});
});

describeIfKey('Starton live REST v3 (authenticated)', () => {
	it('lists wallets', async () => {
		const raw = await makeStartonRequest<{ items: unknown[] }>(
			'v3/kms/wallet',
			LIVE_KEY as string,
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
