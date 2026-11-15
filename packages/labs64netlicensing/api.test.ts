import type { NetLicensingContext } from './context';
import { listLicenses } from './endpoints/list';

const apiKey = process.env.NETLICENSING_API_KEY;
if (!apiKey) {
	console.warn(
		'NETLICENSING_API_KEY is not set. Skipping live NetLicensing calls.',
	);
}

const live = apiKey ? it : it.skip;

live('lists licenses', async () => {
	const result = await listLicenses({ key: apiKey } as NetLicensingContext, {});
	expect(Array.isArray(result.licenses)).toBe(true);
});
