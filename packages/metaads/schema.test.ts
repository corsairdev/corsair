import {
	MetaAdsEndpointInputSchemas,
	MetaAdsEndpointOutputSchemas,
	MetaAdsListSchema,
	MetaAdsMutationSchema,
} from './endpoints/types';
import { metaAdsEndpointSchemas } from './index';
import { MetaAdsSchema } from './schema';

describe('Meta Ads schemas and registry', () => {
	it('has a valid empty persistence schema', () => {
		expect(MetaAdsSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
		expect(MetaAdsSchema.entities).toEqual({});
	});

	it('keeps endpoint inputs, outputs, and registered schema keys aligned', () => {
		const inputKeys = Object.keys(MetaAdsEndpointInputSchemas).sort();
		const outputKeys = Object.keys(MetaAdsEndpointOutputSchemas).sort();
		const registeredKeys = Object.keys(metaAdsEndpointSchemas)
			.map((key) => {
				const [group, action] = key.split('.');
				return `${group}${action?.[0]?.toUpperCase()}${action?.slice(1)}`;
			})
			.sort();
		expect(inputKeys).toHaveLength(28);
		expect(outputKeys).toEqual(inputKeys);
		expect(registeredKeys).toHaveLength(28);
		expect(registeredKeys).toEqual(inputKeys);
		for (const schema of Object.values(MetaAdsEndpointInputSchemas)) {
			expect(schema.safeParse({ undocumented: true }).success).toBe(false);
		}
	});

	it('validates Graph list envelopes, cursor paging, and object IDs', () => {
		expect(
			MetaAdsListSchema.parse({
				data: [{ id: '123', name: 'Campaign' }],
				paging: { cursors: { after: 'cursor' } },
			}),
		).toMatchObject({ data: [{ id: '123' }] });
		expect(
			MetaAdsListSchema.safeParse({ data: [{ name: 'missing ID' }] }).success,
		).toBe(false);
		expect(MetaAdsListSchema.safeParse({ data: {} }).success).toBe(false);
	});

	it('requires a documented identifier or success flag for create responses', () => {
		expect(MetaAdsMutationSchema.parse({ id: 'created-id' })).toEqual({
			id: 'created-id',
		});
		expect(MetaAdsMutationSchema.parse({ success: true })).toEqual({
			success: true,
		});
		expect(MetaAdsMutationSchema.safeParse({}).success).toBe(false);
	});
});
