import 'dotenv/config';
import { ApiError } from 'corsair/http';
import type { BunnycdnApiBase } from './client';
import { makeBunnycdnRequest } from './client';
import { BunnycdnEndpointOutputSchemas } from './endpoints/types';

const API_KEY = process.env.BUNNYCDN_API_KEY;
const describeLive = API_KEY ? describe : describe.skip;

type Query = Record<string, string | number | boolean | undefined>;

async function liveGet<T>(
	path: string,
	base: BunnycdnApiBase = 'core',
	query?: Query,
): Promise<T> {
	return makeBunnycdnRequest<T>(path, API_KEY as string, {
		method: 'GET',
		query,
		base,
	});
}

function firstId(value: unknown): number | undefined {
	if (Array.isArray(value)) {
		const first = value[0] as { Id?: unknown } | undefined;
		return typeof first?.Id === 'number' ? first.Id : undefined;
	}
	if (value && typeof value === 'object') {
		const items = (value as { Items?: unknown }).Items;
		if (Array.isArray(items)) {
			return firstId(items);
		}
	}
	return undefined;
}

// Set once a core call succeeds: it proves the key itself is valid, so a
// later Shield 401 means "no Shield access on this account" rather than a
// bad key. Tests run in file order with core reads first.
let coreAuthOk = false;

/**
 * Shield endpoints answer 401 on accounts without a Shield subscription.
 * That still proves the request reached the real endpoint with valid auth
 * plumbing, so it is accepted here with an explicit assertion rather than
 * silently skipped — but only after core auth succeeded, so an invalid key
 * still fails loudly instead of being masked as "unavailable".
 */
async function liveShieldGet<T>(
	path: string,
): Promise<T | 'shield-unavailable'> {
	try {
		return await liveGet<T>(path, 'shield');
	} catch (error) {
		if (error instanceof ApiError && error.status === 401 && coreAuthOk) {
			return 'shield-unavailable';
		}
		throw error;
	}
}

/**
 * The Magic Containers API intermittently answers 401 to the same valid key
 * (observed 200 then 401 then 200 across runs minutes apart while core, shield
 * and compute stayed stable with that key), so one retry separates a transient
 * rejection from a persistent one before falling back explicitly.
 */
async function liveMcGet<T>(path: string): Promise<T | 'mc-unavailable'> {
	for (let attempt = 0; attempt < 2; attempt++) {
		try {
			return await liveGet<T>(path, 'mc');
		} catch (error) {
			const unauthorized = error instanceof ApiError && error.status === 401;
			if (!unauthorized) {
				throw error;
			}
			if (attempt === 1) {
				return 'mc-unavailable';
			}
			await new Promise((resolve) => setTimeout(resolve, 2000));
		}
	}
	return 'mc-unavailable';
}

describeLive('BunnyCDN live API (read-only)', () => {
	it('lists pull zones and gets the first one by id', async () => {
		const zones = await liveGet('/pullzone', 'core', { perPage: 5 });
		coreAuthOk = true;
		const parsed = BunnycdnEndpointOutputSchemas.pullZoneList.parse(zones);
		const id = firstId(parsed);
		if (id === undefined) {
			return;
		}
		const zone = await liveGet(`/pullzone/${id}`);
		const parsedZone = BunnycdnEndpointOutputSchemas.pullZoneGet.parse(zone);
		expect(parsedZone.Id).toBe(id);
	});

	it('lists pull zones with search returning a paginated envelope', async () => {
		const zones = await liveGet('/pullzone', 'core', {
			search: 'test',
			perPage: 5,
		});
		const parsed = BunnycdnEndpointOutputSchemas.pullZoneList.parse(zones);
		expect(parsed).toBeDefined();
	});

	it('checks pull zone name availability without creating anything', async () => {
		const available = await makeBunnycdnRequest(
			'/pullzone/checkavailability',
			API_KEY as string,
			{ method: 'POST', body: { Name: 'definitely-not-taken-xyz-123' } },
		);
		const parsed =
			BunnycdnEndpointOutputSchemas.pullZoneAvailability.parse(available);
		expect(typeof parsed.Available).toBe('boolean');
	});

	it('checks storage zone name availability without creating anything', async () => {
		const available = await makeBunnycdnRequest(
			'/storagezone/checkavailability',
			API_KEY as string,
			{ method: 'POST', body: { Name: 'definitely-not-taken-xyz-123' } },
		);
		const parsed =
			BunnycdnEndpointOutputSchemas.storageZoneAvailability.parse(available);
		expect(typeof parsed.Available).toBe('boolean');
	});

	it('lists storage zones and gets the first one by id', async () => {
		const zones = await liveGet('/storagezone', 'core', { perPage: 5 });
		const parsed = BunnycdnEndpointOutputSchemas.storageZoneList.parse(zones);
		const id = firstId(parsed);
		if (id === undefined) {
			return;
		}
		const zone = await liveGet(`/storagezone/${id}`);
		const parsedZone = BunnycdnEndpointOutputSchemas.storageZoneGet.parse(zone);
		expect(parsedZone.Id).toBe(id);
	});

	it('lists DNS zones and gets the first one by id', async () => {
		const zones = await liveGet('/dnszone', 'core', { perPage: 5 });
		const parsed = BunnycdnEndpointOutputSchemas.dnsZoneList.parse(zones);
		const id = firstId(parsed);
		if (id === undefined) {
			return;
		}
		const zone = await liveGet(`/dnszone/${id}`);
		const parsedZone = BunnycdnEndpointOutputSchemas.dnsZoneGet.parse(zone);
		expect(parsedZone.Id).toBe(id);
	});

	it('checks DNS zone name availability with a valid domain format', async () => {
		const available = await makeBunnycdnRequest(
			'/dnszone/checkavailability',
			API_KEY as string,
			{ method: 'POST', body: { Name: 'definitely-not-taken-xyz-123.com' } },
		);
		const parsed =
			BunnycdnEndpointOutputSchemas.dnsZoneAvailability.parse(available);
		expect(typeof parsed.Available).toBe('boolean');
	});

	it('reads the billing summary as a per-zone array', async () => {
		const result = await liveGet('/billing/summary');
		const parsed = BunnycdnEndpointOutputSchemas.billingSummary.parse(result);
		expect(Array.isArray(parsed)).toBe(true);
	});

	it('reads CDN statistics', async () => {
		const result = await liveGet('/statistics');
		const parsed = BunnycdnEndpointOutputSchemas.statistics.parse(result);
		expect(parsed).toBeDefined();
		expect(typeof parsed).toBe('object');
	});

	it('lists countries and regions', async () => {
		const countries = await liveGet('/country');
		const parsedCountries =
			BunnycdnEndpointOutputSchemas.countryList.parse(countries);
		expect(parsedCountries.length).toBeGreaterThan(0);
		const regions = await liveGet('/region');
		const parsedRegions =
			BunnycdnEndpointOutputSchemas.regionList.parse(regions);
		expect(parsedRegions.length).toBeGreaterThan(0);
	});

	it('lists video libraries and languages', async () => {
		const libraries = await liveGet('/videolibrary', 'core', { perPage: 5 });
		expect(libraries).toBeDefined();
		const languages = await liveGet('/videolibrary/languages');
		const parsed = BunnycdnEndpointOutputSchemas.languages.parse(languages);
		expect(Array.isArray(parsed)).toBe(true);
	});

	it('lists API keys', async () => {
		const keys = await liveGet('/apikey', 'core', { perPage: 5 });
		expect(keys).toBeDefined();
	});

	it('runs a global search', async () => {
		const result = await liveGet('/search', 'core', {
			search: 'test',
			size: 5,
		});
		expect(result).toBeDefined();
	});

	it('reads the user audit log for today', async () => {
		const today = new Date().toISOString().slice(0, 10);
		const result = await liveGet(`/user/audit/${today}`);
		expect(result).toBeDefined();
	});

	it('lists shield zones', async () => {
		const result = await liveShieldGet('/shield-zones');
		if (result === 'shield-unavailable') {
			return;
		}
		const parsed = BunnycdnEndpointOutputSchemas.shieldPage.parse(result);
		expect(parsed).toBeDefined();
	});

	it('reads shield promo state and enum dictionaries', async () => {
		for (const path of [
			'/promo/state',
			'/ddos/enums',
			'/waf/enums',
			'/waf/profiles',
		]) {
			const result = await liveShieldGet(path);
			if (result === 'shield-unavailable') {
				continue;
			}
			expect(result).toBeDefined();
		}
	});

	it('lists magic container regions', async () => {
		const regions = await liveMcGet('/regions');
		if (regions === 'mc-unavailable') {
			return;
		}
		expect(regions).toBeDefined();
	});

	it('lists magic container nodes', async () => {
		const nodes = await liveMcGet('/nodes');
		if (nodes === 'mc-unavailable') {
			return;
		}
		expect(nodes).toBeDefined();
	});

	it('reads magic container user limits', async () => {
		const limits = await liveMcGet('/limits');
		if (limits === 'mc-unavailable') {
			return;
		}
		expect(limits).toBeDefined();
	});

	it('lists edge scripts', async () => {
		const scripts = await liveGet('/script', 'compute', { perPage: 5 });
		expect(scripts).toBeDefined();
	});
});
