// Read-only live smoke tests. Run with FRESHDESK_API_KEY and FRESHDESK_DOMAIN
// set locally; neither credential is printed by this suite.

import { makeFreshdeskRequest } from './client';
import { FRESHDESK_OPERATIONS } from './endpoints/operations';
import type { FreshdeskContext } from './index';

const apiKey = process.env.FRESHDESK_API_KEY ?? '';
const domain = process.env.FRESHDESK_DOMAIN ?? '';
const describeLive = apiKey && domain ? describe : describe.skip;

function buildContext(): FreshdeskContext {
	return {
		endpoints: {},
		$getAccountId: () => Promise.resolve('live-smoke'),
		key: apiKey,
		options: { domain },
		keys: {
			get_dek: () => Promise.resolve(''),
			issue_new_dek: () => Promise.resolve(''),
			get_api_key: () => Promise.resolve(apiKey),
			set_api_key: () => Promise.resolve(),
			get_webhook_signature: () => Promise.resolve(null),
			set_webhook_signature: () => Promise.resolve(),
		},
		db: {},
	};
}

describeLive('Freshdesk v2 live API (read-only)', () => {
	it('lists one ticket with the documented first-page size', async () => {
		const result = await makeFreshdeskRequest(
			buildContext(),
			apiKey,
			FRESHDESK_OPERATIONS.listAllTicketsGetTickets,
			{ query: { page: 1, per_page: 1 } },
		);
		expect(Array.isArray(result)).toBe(true);
		if (!Array.isArray(result))
			throw new Error('Expected the ticket list response to be an array');
		expect(result.length).toBeLessThanOrEqual(1);
	});

	it('reads the account profile without modifying remote data', async () => {
		const result = await makeFreshdeskRequest(
			buildContext(),
			apiKey,
			FRESHDESK_OPERATIONS.viewAccountGetAccount,
			{},
		);
		expect(result).toBeDefined();
	});
});
