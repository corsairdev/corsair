import { endpoint } from './call';

/** Reads the account's credit balance. */
export const balance = endpoint('accountBalance', {
	event: 'account.balance',
	request: () => ({
		family: 'query',
		method: 'GET',
		path: '/rest/2/account/balance',
		query: { 'mocean-resp-format': 'json' },
	}),
});

/** Lists per-destination prices for SMS, number lookup or verify. */
export const pricing = endpoint('accountPricing', {
	event: 'account.pricing',
	request: ({ mocean_mcc, mocean_mnc, mocean_type }) => ({
		family: 'query',
		method: 'GET',
		path: '/rest/2/account/pricing',
		query: {
			'mocean-mcc': mocean_mcc,
			'mocean-mnc': mocean_mnc,
			'mocean-type': mocean_type,
			'mocean-resp-format': 'json',
		},
	}),
	log: (_, result) => ({ destinations: result.destinations.length }),
});
