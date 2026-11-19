import { StoreganiseEndpointOutputSchemas as Outputs } from './endpoints/types';
import { storeganise } from './index';

/**
 * Live smoke test against the documented admin reads. Storeganise serves
 * each operator from its own subdomain, so both the API key and the
 * business code must be set: STOREGANISE_API_KEY and
 * STOREGANISE_BUSINESS_CODE. Without both, the whole suite skips (a
 * skipped run is not a pass); every read goes through its output schema so
 * a wrongly typed field fails here rather than for a caller.
 */
const describeIfKey =
	process.env.STOREGANISE_API_KEY && process.env.STOREGANISE_BUSINESS_CODE
		? describe
		: describe.skip;

if (
	!process.env.STOREGANISE_API_KEY ||
	!process.env.STOREGANISE_BUSINESS_CODE
) {
	console.warn(
		'Storeganise live smoke skipped: set STOREGANISE_API_KEY and STOREGANISE_BUSINESS_CODE to run it.',
	);
}

describeIfKey('storeganise live smoke', () => {
	const plugin = storeganise({
		key: process.env.STOREGANISE_API_KEY as string,
		businessCode: process.env.STOREGANISE_BUSINESS_CODE as string,
	});

	// The endpoints read the key and the business code off the context; a
	// direct call supplies both rather than going through the runtime.
	const ctx = {
		key: process.env.STOREGANISE_API_KEY as string,
		options: { businessCode: process.env.STOREGANISE_BUSINESS_CODE as string },
	} as never;

	it('reads settings through its output schema', async () => {
		const settings = await plugin.endpoints!.settings.get(ctx, {});
		Outputs.settingsGet.parse(settings);
	});

	it('lists sites through its output schema', async () => {
		const sites = await plugin.endpoints!.sites.list(ctx, {});
		expect(sites.length).toBeGreaterThan(0);
		Outputs.sitesList.parse(sites);
	});

	it('lists units through its output schema', async () => {
		const units = await plugin.endpoints!.units.list(ctx, {});
		Outputs.unitsList.parse(units);
	});

	it('lists users through its output schema', async () => {
		const users = await plugin.endpoints!.users.list(ctx, {});
		Outputs.usersList.parse(users);
	});
});
