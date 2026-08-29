import { DreamstudioAPIError, makeDreamstudioRequest } from './client';
import {
	DreamstudioAccount,
	DreamstudioBalance,
	DreamstudioEngine,
} from './schema';

const LIVE_KEY = process.env.STABILITY_API_KEY;
const describeIfKey = LIVE_KEY ? describe : describe.skip;

describe('DreamStudio live REST v1', () => {
	it('rejects an invalid API key on GET /v1/user/account', async () => {
		const err = await makeDreamstudioRequest(
			'/user/account',
			'sk-invalid-live-check',
		).catch((error: unknown) => error);
		expect(err).toBeInstanceOf(DreamstudioAPIError);
		expect((err as DreamstudioAPIError).status).toBe(401);
	});
});

describeIfKey('DreamStudio live REST v1 (authenticated)', () => {
	it('returns AccountResponseBody', async () => {
		const raw = await makeDreamstudioRequest(
			'/user/account',
			LIVE_KEY as string,
		);
		const account = DreamstudioAccount.parse(raw);
		expect(account.id.length).toBeGreaterThan(0);
		expect(account.email.length).toBeGreaterThan(0);
	});

	it('returns BalanceResponseBody', async () => {
		const raw = await makeDreamstudioRequest(
			'/user/balance',
			LIVE_KEY as string,
		);
		expect(typeof DreamstudioBalance.parse(raw).credits).toBe('number');
	});

	it('returns Engine[] from /v1/engines/list', async () => {
		const raw = await makeDreamstudioRequest(
			'/engines/list',
			LIVE_KEY as string,
		);
		const engines = DreamstudioEngine.array().parse(raw);
		expect(engines.length).toBeGreaterThan(0);
		expect(engines[0]?.id.length).toBeGreaterThan(0);
	});
});
