import { getAccount } from './endpoints/account';
import { lookupBrand } from './endpoints/brands';
import { fetchLogo } from './endpoints/logos';
import { searchBrands } from './endpoints/search';

const key = process.env.LOGODEV_API_KEY;
if (!key) {
	console.warn('LOGODEV_API_KEY is not set. Skipping the live Logo.dev calls.');
}

const live = key ? it : it.skip;
const ctx = { key: key ?? '' } as never;

describe('Logo.dev live', () => {
	live('reads the account and its credit balance', async () => {
		const result = await getAccount(ctx, {});
		expect(typeof result.data.plan).toBe('string');
	});

	live(
		'searches shopify and returns a logo URL without the token',
		async () => {
			const result = await searchBrands(ctx, { q: 'shopify', limit: 1 });
			expect(result.data[0]?.name).toBe('Shopify');
			expect(result.data[0]?.logo_url ?? '').not.toContain('token=');
		},
	);

	live('looks up stripe.com and gets its logo', async () => {
		const brand = await lookupBrand(ctx, {
			domain: 'stripe.com',
			noSubscribe: true,
		});
		expect(brand.data.domain).toBe('stripe.com');
		const logo = await fetchLogo(ctx, { domain: 'stripe.com' });
		expect(logo.data.url).toMatch(/^https:\/\//);
	});
});
