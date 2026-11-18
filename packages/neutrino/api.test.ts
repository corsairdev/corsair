import { createCorsair } from 'corsair/core';
import { NeutrinoEndpointOutputSchemas as Outputs } from './endpoints/types';
import { neutrino } from './index';

/**
 * Live smoke test. Every answer goes through its output schema before an
 * assertion touches it, so a field typed wrongly fails here as well as for a
 * caller.
 *
 * Read-only and cheap: no HLR lookups, no SMS sends. Neutrino counts a credit
 * per successful call, so this suite stays to the five lookups below.
 *
 * Skipped unless both NEUTRINO_USER_ID and NEUTRINO_API_KEY are set, and each
 * missing variable is logged so a skip cannot read as a pass.
 */
const userId = process.env.NEUTRINO_USER_ID;
const apiKey = process.env.NEUTRINO_API_KEY;
const describeIfKey = userId && apiKey ? describe : describe.skip;

if (!userId) console.warn('NEUTRINO_USER_ID is not set: live tests skipped');
if (!apiKey) console.warn('NEUTRINO_API_KEY is not set: live tests skipped');

describeIfKey('Neutrino live API', () => {
	const corsair = createCorsair({
		plugins: [neutrino({ key: apiKey, userId })],
	});

	it('geolocates a public address through the output schema', async () => {
		const parsed = Outputs.ipInfo.parse(
			await corsair.neutrino.api.ip.info({ ip: '1.1.1.1' }),
		);

		expect(parsed.valid).toBe(true);
		expect(parsed.ip).toBe('1.1.1.1');
		// The time zone is an object, not a string, in this API.
		expect(typeof parsed.timezone?.id).toBe('string');
	}, 30_000);

	it('reports the blocklist flags through the output schema', async () => {
		const parsed = Outputs.ipBlocklist.parse(
			await corsair.neutrino.api.ip.blocklist({ ip: '1.1.1.1' }),
		);

		expect(typeof parsed['is-listed']).toBe('boolean');
		expect(Array.isArray(parsed.sensors)).toBe(true);
	}, 30_000);

	it('validates an address through the output schema', async () => {
		const parsed = Outputs.emailValidate.parse(
			await corsair.neutrino.api.email.validate({
				email: 'tech@neutrinoapi.com',
			}),
		);

		expect(parsed.valid).toBe(true);
		expect(parsed.domain).toBe('neutrinoapi.com');
	}, 30_000);

	it('parses a user agent through the output schema', async () => {
		const parsed = Outputs.uaLookup.parse(
			await corsair.neutrino.api.web.uaLookup({
				ua: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/130.0 Safari/537.36',
			}),
		);

		expect(parsed.name).toBeTruthy();
		expect(typeof parsed['is-mobile']).toBe('boolean');
	}, 30_000);

	it('converts a currency through the output schema', async () => {
		const parsed = Outputs.convert.parse(
			await corsair.neutrino.api.commerce.convert({
				fromValue: 100,
				fromType: 'USD',
				toType: 'EUR',
			}),
		);

		expect(parsed.valid).toBe(true);
		// The result is a string and a float side by side.
		expect(typeof parsed.result).toBe('string');
		expect(typeof parsed['result-float']).toBe('number');
	}, 30_000);
});
