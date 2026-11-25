import * as Account from './endpoints/account';
import * as Addresses from './endpoints/addresses';
import * as Autocomplete from './endpoints/autocomplete';
import * as IntlVerifications from './endpoints/intl-verifications';
import * as UsVerifications from './endpoints/us-verifications';
import * as Zip from './endpoints/zip';
import type { LobContext } from './index';

/**
 * Live smoke tests against the real API. Gated on `LOB_API_KEY`.
 *
 * These call the endpoint functions, so the output schemas parse every real
 * payload. Every call is a read: verifications, autocomplete, ZIP lookup and
 * the address book list. Nothing here mails anything.
 *
 * A `test_` key (dashboard.lob.com/settings/api-keys) exercises all of it
 * without spending mail credits; a `live_` key bills each US and
 * international verification, so run it against a funded account only.
 *
 * CI ignores this file by name (`api.test.ts`), so it only runs through
 * `pnpm --filter @corsair-dev/lob test:live`.
 */
const API_KEY = process.env.LOB_API_KEY;

const describeIfKey = API_KEY ? describe : describe.skip;

if (!API_KEY) {
	// Say so out loud: a skipped run must not read as a green one.
	console.warn(
		'LOB_API_KEY is not set, so the Lob live smoke tests are skipped. Create a key at dashboard.lob.com/settings/api-keys and export it to run them.',
	);
}

// unknown: only ctx.key is read; the full CorsairPluginContext needs a
// database handle the live reads never touch.
const ctx = { key: API_KEY } as unknown as LobContext;

describeIfKey('Lob live API', () => {
	it('reads the Lob Credits balance through the output schema', async () => {
		const result = await Account.getBalance(ctx, {});
		expect(typeof result.balance).toBe('number');
	});

	it('looks up a ZIP code through the output schema', async () => {
		const result = await Zip.usZipLookup(ctx, { zip_code: '94107' });
		expect(result.cities.length).toBeGreaterThan(0);
		expect(result.cities.some((city) => city.preferred)).toBe(true);
	});

	it('autocompletes a partial address through the output schema', async () => {
		const result = await Autocomplete.usAutocomplete(ctx, {
			address_prefix: '185 Industrial P',
			valid_addresses: true,
		});
		expect(result.suggestions.length).toBeGreaterThan(0);
	});

	it('verifies one US address through the output schema', async () => {
		const result = await UsVerifications.verify(ctx, {
			primary_line: '210 King Street',
			city: 'San Francisco',
			state: 'CA',
			zip_code: '94107',
		});
		expect(result.deliverability).toBeDefined();
		expect(result.components).toMatchObject({ street_name: 'KING' });
	});

	it('verifies one international address through the output schema', async () => {
		const result = await IntlVerifications.verify(ctx, {
			primary_line: '123 Paramount Rd',
			city: 'Toronto',
			state: 'ON',
			postal_code: 'M5V 2T6',
			country: 'CA',
		});
		expect(result.deliverability).toBeDefined();
	});

	it('lists the address book through the output schema', async () => {
		const result = await Addresses.list(ctx, { limit: 1 });
		expect(result.data.length).toBeLessThanOrEqual(1);
		expect(
			result.next_url === null || typeof result.next_url === 'string',
		).toBe(true);
	});
});
