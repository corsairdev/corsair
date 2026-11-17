import { BusinessUnits } from './endpoints';

const apiKey = process.env.TRUSTPILOT_API_KEY;
const businessUnitId = process.env.TRUSTPILOT_BUSINESS_UNIT_ID;

if (!apiKey || !businessUnitId) {
	console.warn(
		'Skipping Trustpilot live smoke test: set TRUSTPILOT_API_KEY and TRUSTPILOT_BUSINESS_UNIT_ID to enable it.',
	);
	describe.skip('Trustpilot live API smoke', () => {
		it('retrieves a public business unit using read-only credentials', async () =>
			undefined);
	});
} else {
	describe('Trustpilot live API smoke', () => {
		it('retrieves a public business unit using read-only credentials', async () => {
			const businessUnit = await BusinessUnits.get(
				{ key: apiKey },
				{ businessUnitId },
			);
			expect(businessUnit.id).toBe(businessUnitId);
		});
	});
}
