import { searchBrands } from './endpoints/search';

const key = process.env.LOGODEV_API_KEY;
if (!key) {
	console.warn('LOGODEV_API_KEY is not set. Skipping the live Logo.dev call.');
}

(key ? it : it.skip)(
	'searches shopify and returns a logo URL without the token',
	async () => {
		const result = await searchBrands({ key: key ?? '' } as never, {
			q: 'shopify',
			limit: 1,
		});
		expect(result.data[0]?.name).toBe('Shopify');
		expect(result.data[0]?.logo_url ?? '').not.toContain('token=');
	},
);
