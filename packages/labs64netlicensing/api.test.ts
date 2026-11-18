import type { NetLicensingContext } from './context';
import { Licensees, ProductModules, Products } from './endpoints';
import { listLicenses } from './endpoints/list';

const apiKey = process.env.NETLICENSING_API_KEY;
if (!apiKey) {
	console.warn(
		'NETLICENSING_API_KEY is not set. Skipping live NetLicensing calls.',
	);
}

const live = apiKey ? it : it.skip;

// unknown: the endpoints read only `key` here; event logging needs no db.
const ctx = {
	key: apiKey,
	$getAccountId: async () => 'live',
} as unknown as NetLicensingContext;

live('lists licenses', async () => {
	const result = await listLicenses(ctx, {});
	expect(Array.isArray(result.licenses)).toBe(true);
});

live('creates, reads and deletes a product and a licensee', async () => {
	const tag = `CPT${Date.now().toString(36).toUpperCase()}`;
	try {
		const product = await Products.create(ctx, {
			number: `${tag}P`,
			name: 'corsair-plugin-test',
		});
		expect(product.item.number).toBe(`${tag}P`);
		// Validation needs at least one active product module.
		await ProductModules.create(ctx, {
			number: `${tag}M`,
			productNumber: `${tag}P`,
			name: 'corsair-plugin-test',
			licensingModel: 'TryAndBuy',
		});
		const licensee = await Licensees.create(ctx, {
			number: `${tag}I`,
			productNumber: `${tag}P`,
		});
		expect(licensee.item.number).toBe(`${tag}I`);
		const validation = await Licensees.validate(ctx, {
			licenseeNumber: `${tag}I`,
			dryRun: true,
		});
		expect(Array.isArray(validation.validations)).toBe(true);
	} finally {
		await Products.delete(ctx, {
			productNumber: `${tag}P`,
			forceCascade: true,
		});
	}
});
