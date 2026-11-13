/**
 * Live smoke tests. CI skips this file by name, and it skips itself without
 * credentials. Every read goes through its operation's output schema, so a
 * field the schema gets wrong fails here rather than in a caller's hands.
 *
 * Run with a token, or with an app's client ID and secret (the suite mints a
 * Client Credentials token itself):
 *
 *   RAMP_API_TOKEN=... pnpm --filter @corsair-dev/ramp test:live
 *   RAMP_CLIENT_ID=... RAMP_CLIENT_SECRET=... RAMP_ENVIRONMENT=sandbox pnpm --filter @corsair-dev/ramp test:live
 */

import type { RampEnvironment } from './client';
import { requestRampClientCredentialsToken } from './client';
import * as Org from './endpoints/org';
import * as Spend from './endpoints/spend';
import * as Transactions from './endpoints/transactions';
import type { RampContext } from './index';
import { RAMP_DEFAULT_SCOPES } from './index';

const environment: RampEnvironment =
	process.env.RAMP_ENVIRONMENT === 'sandbox' ? 'sandbox' : 'production';
const clientId = process.env.RAMP_CLIENT_ID;
const clientSecret = process.env.RAMP_CLIENT_SECRET;
let token = process.env.RAMP_API_TOKEN;

const hasCredentials = Boolean(token || (clientId && clientSecret));
const describeIfToken = hasCredentials ? describe : describe.skip;

if (!hasCredentials) {
	// A skipped run must not read as a green one.
	console.warn(
		'Neither RAMP_API_TOKEN nor RAMP_CLIENT_ID + RAMP_CLIENT_SECRET is set: the live Ramp suite is skipped, not passing.',
	);
}

beforeAll(async () => {
	if (token || !clientId || !clientSecret) return;
	token = (
		await requestRampClientCredentialsToken({
			clientId,
			clientSecret,
			scopes: RAMP_DEFAULT_SCOPES,
			environment,
		})
	).access_token;
});

function liveContext(): RampContext {
	// unknown: a real context also carries the database, hooks and key manager;
	// the endpoints read only `key` and `options.environment`, so the fixture is
	// cast at this boundary.
	return { key: token, options: { environment } } as unknown as RampContext;
}

describeIfToken('live Ramp API', () => {
	it('reads the business profile', async () => {
		const result = await Org.businessGet(liveContext() as never, {} as never);

		expect(result.business.id).toBeTruthy();
		expect(typeof result.business.business_name_legal).toBe('string');
	});

	it('lists transactions through the output schema', async () => {
		const result = await Transactions.list(
			liveContext() as never,
			{
				page_size: 2,
			} as never,
		);

		expect(Array.isArray(result.transactions)).toBe(true);
		// The cursor is null or a real id, never an empty string.
		expect(result.next_cursor).not.toBe('');
	});

	it('lists users through the output schema', async () => {
		const result = await Org.usersList(
			liveContext() as never,
			{
				page_size: 2,
			} as never,
		);

		expect(Array.isArray(result.users)).toBe(true);
	});

	it('lists departments through the output schema', async () => {
		const page = await Org.departmentsList(
			liveContext() as never,
			{
				page_size: 2,
			} as never,
		);

		expect(Array.isArray(page.departments)).toBe(true);
	});

	it('lists bills and reimbursements', async () => {
		const bills = await Spend.billsList(
			liveContext() as never,
			{
				page_size: 2,
			} as never,
		);
		expect(Array.isArray(bills.bills)).toBe(true);

		const reimbursements = await Org.list(
			liveContext() as never,
			{
				page_size: 2,
			} as never,
		);
		expect(Array.isArray(reimbursements.reimbursements)).toBe(true);
	});
});
