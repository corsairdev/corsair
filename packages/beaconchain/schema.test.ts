import { beaconchainEndpointSchemas } from './index';
import { BeaconchainSchema } from './schema';

describe('Beaconchain schema', () => {
	it('declares a semver version', () => {
		expect(BeaconchainSchema.version).toBeDefined();
		expect(BeaconchainSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof BeaconchainSchema.entities).toBe('object');
		expect(BeaconchainSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(BeaconchainSchema.entities))).toBe(true);
		for (const entity of Object.values(BeaconchainSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});

	it('defines input and output schemas for all 37 endpoints', () => {
		const endpointKeys = Object.keys(beaconchainEndpointSchemas);
		expect(endpointKeys.length).toBe(37);

		for (const key of endpointKeys) {
			const entry =
				beaconchainEndpointSchemas[
					key as keyof typeof beaconchainEndpointSchemas
				];
			expect(entry.input).toBeDefined();
			expect(entry.output).toBeDefined();
		}
	});

	it('validates endpoint input schemas correctly', () => {
		expect(
			beaconchainEndpointSchemas['chart.get'].input.safeParse({
				chartName: 'validator_stats',
			}).success,
		).toBe(true);
		expect(
			beaconchainEndpointSchemas['chart.get'].input.safeParse({ chartName: '' })
				.success,
		).toBe(false);

		expect(
			beaconchainEndpointSchemas['epoch.get'].input.safeParse({ epochId: 1000 })
				.success,
		).toBe(true);
		expect(
			beaconchainEndpointSchemas['slot.get'].input.safeParse({ slotId: 'head' })
				.success,
		).toBe(true);

		expect(
			beaconchainEndpointSchemas['validator.get'].input.safeParse({
				indexOrPubkey: '1',
			}).success,
		).toBe(true);
		expect(
			beaconchainEndpointSchemas['validator.get'].input.safeParse({
				indexOrPubkey: '',
			}).success,
		).toBe(false);

		expect(
			beaconchainEndpointSchemas['validators.post'].input.safeParse({
				indicesOrPubkeys: ['1', '2'],
			}).success,
		).toBe(true);
		expect(
			beaconchainEndpointSchemas['validators.post'].input.safeParse({
				indicesOrPubkeys: [],
			}).success,
		).toBe(false);
	});
});
