import {
	TrustpilotEndpointInputSchemas,
	TrustpilotEndpointOutputSchemas,
} from './endpoints/types';
import { trustpilot } from './index';
import { TrustpilotSchema } from './schema';

describe('Trustpilot plugin and endpoint schemas', () => {
	it('declares a semver schema and no local entities', () => {
		expect(TrustpilotSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
		expect(TrustpilotSchema.entities).toEqual({});
	});

	it('keeps strict input and output schema registries aligned', () => {
		expect(Object.keys(TrustpilotEndpointInputSchemas).sort()).toEqual(
			Object.keys(TrustpilotEndpointOutputSchemas).sort(),
		);
		expect(Object.keys(TrustpilotEndpointInputSchemas)).toHaveLength(53);
	});

	it('rejects undocumented fields for every endpoint input', () => {
		for (const schema of Object.values(TrustpilotEndpointInputSchemas)) {
			expect(
				schema.safeParse({ undocumentedCallback: 'https://example.invalid' })
					.success,
			).toBe(false);
		}
	});

	it('rejects invalid scalar output data for every endpoint output', () => {
		for (const schema of Object.values(TrustpilotEndpointOutputSchemas)) {
			expect(schema.safeParse(42).success).toBe(false);
		}
	});

	it('rejects undocumented fields and invalid cross-field combinations', () => {
		expect(
			TrustpilotEndpointInputSchemas['businessUnits.find'].safeParse({
				name: 'shop.example',
				callbackUrl: 'https://example.invalid',
			}).success,
		).toBe(false);
		expect(
			TrustpilotEndpointInputSchemas['productReviews.summary'].safeParse({
				businessUnitId: 'unit-1',
			}).success,
		).toBe(false);
		expect(
			TrustpilotEndpointInputSchemas['productReviews.summary'].safeParse({
				businessUnitId: 'unit-1',
				sku: ['SKU-1'],
				customerProductId: 'product-1',
			}).success,
		).toBe(false);
		expect(
			TrustpilotEndpointInputSchemas['businessUnits.privateReviews'].safeParse({
				businessUnitId: 'unit-1',
				noLocation: true,
				internalLocationId: 'location-1',
			}).success,
		).toBe(false);
	});

	it('enforces Data Solutions pagination bounds and latest-review limit', () => {
		expect(
			TrustpilotEndpointInputSchemas[
				'dataSolutions.searchBusinessUnits'
			].safeParse({ query: 'shop', perPage: 101 }).success,
		).toBe(false);
		expect(
			TrustpilotEndpointInputSchemas['dataSolutions.latestReviews'].safeParse({
				businessUnitId: 'unit-1',
				limit: 6,
			}).success,
		).toBe(false);
		expect(
			TrustpilotEndpointInputSchemas['dataSolutions.latestReviews'].safeParse({
				businessUnitId: 'unit-1',
				limit: 5,
			}).success,
		).toBe(true);
	});
});

describe('Trustpilot response edge cases', () => {
	it('accepts the documented null entry in notFoundConsumerIds', () => {
		expect(
			TrustpilotEndpointOutputSchemas['consumerProfiles.bulk'].safeParse({
				consumers: {},
				notFoundConsumerIds: [null],
			}).success,
		).toBe(true);
	});

	it('keeps a page of private reviews when a consumer typed a malformed email or a product URL is relative', () => {
		expect(
			TrustpilotEndpointOutputSchemas['businessUnits.privateReviews'].safeParse(
				{
					reviews: [
						{
							id: 'review-1',
							referralEmail: 'not an email',
							findReviewer: {
								isEligible: true,
								requests: [
									{ consumerResponse: { email: 'name at example dot com' } },
								],
							},
						},
					],
				},
			).success,
		).toBe(true);
		expect(
			TrustpilotEndpointOutputSchemas['productReviews.privateGet'].safeParse({
				id: 'review-1',
				product: {
					productUrl: '/products/item-1',
					productImages: [{ type: 'main', url: '//cdn.example/item.png' }],
				},
				consumer: { email: '' },
				redirectUri: '',
			}).success,
		).toBe(true);
	});

	it('marks publishing and replacing a public product review comment as destructive', () => {
		const meta = trustpilot().endpointMeta;
		expect(meta?.['productReviews.createComment']?.riskLevel).toBe(
			'destructive',
		);
		expect(meta?.['productReviews.updateComment']?.riskLevel).toBe(
			'destructive',
		);
		expect(meta?.['productReviews.createConversation']?.riskLevel).toBe(
			'write',
		);
	});
});
