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
		expect(inputKeys).toHaveLength(41);
		expect(outputKeys).toEqual(inputKeys);
		expect(registeredKeys).toHaveLength(41);
		expect(registeredKeys).toEqual(inputKeys);
		for (const schema of Object.values(MetaAdsEndpointInputSchemas)) {
			expect(schema.safeParse({ undocumented: true }).success).toBe(false);
		}
	});

	it('validates base64 image upload and documented image response shapes', () => {
		expect(
			MetaAdsEndpointInputSchemas.imagesUpload.safeParse({
				accountId: '123',
				bytes: 'aGVsbG8=',
			}).success,
		).toBe(true);
		expect(
			MetaAdsEndpointInputSchemas.imagesUpload.safeParse({
				accountId: '123',
				bytes: 'not-base64',
			}).success,
		).toBe(false);
		expect(
			MetaAdsEndpointOutputSchemas.imagesUpload.parse({
				images: { hash: { hash: 'hash', width: 10, height: 10 } },
			}),
		).toMatchObject({ images: { hash: { hash: 'hash' } } });
	});

	it('accepts documented nested creative specifications with exactly one content type', () => {
		const objectStorySpec = {
			page_id: 'page-1',
			link_data: { link: 'https://shop.test/landing', message: 'Hello' },
		};
		expect(
			MetaAdsEndpointInputSchemas.creativesCreate.safeParse({
				accountId: '123',
				name: 'Link creative',
				objectStorySpec,
			}).success,
		).toBe(true);
		expect(
			MetaAdsEndpointInputSchemas.creativesCreate.safeParse({
				accountId: '123',
				name: 'Invalid creative',
				objectStorySpec: { page_id: 'page-1' },
			}).success,
		).toBe(false);
		expect(
			MetaAdsEndpointInputSchemas.adsCreate.safeParse({
				accountId: '123',
				adSetId: 'adset-1',
				name: 'Inline ad',
				creativeSpec: { name: 'Link creative', objectStorySpec },
			}).success,
		).toBe(true);
	});

	it('accepts only documented SHA-256 member batches and omits provider samples', () => {
		expect(
			MetaAdsEndpointInputSchemas.audiencesUsersAdd.safeParse({
				audienceId: 'audience-1',
				schema: 'EMAIL_SHA256',
				hashes: ['a'.repeat(64)],
				sessionId: 123,
				batchSequence: 1,
				lastBatch: true,
			}).success,
		).toBe(true);
		expect(
			MetaAdsEndpointInputSchemas.audiencesUsersAdd.safeParse({
				audienceId: 'audience-1',
				schema: 'EMAIL_SHA256',
				hashes: ['person@example.com'],
				sessionId: 123,
				batchSequence: 1,
				lastBatch: true,
			}).success,
		).toBe(false);
		expect(
			MetaAdsEndpointOutputSchemas.audiencesUsersAdd.parse({
				audience_id: 'audience-1',
				session_id: 123,
				num_received: 1,
				num_invalid_entries: 0,
				invalid_entry_samples: ['hashed-or-raw-provider-sample'],
			}),
		).not.toHaveProperty('invalid_entry_samples');
	});

	it('validates documented Insights filters, breakdowns, and report inputs', () => {
		expect(
			MetaAdsEndpointInputSchemas.insightsList.safeParse({
				accountId: '123',
				fields: ['impressions', 'actions'],
				breakdowns: ['age', 'gender'],
				filtering: [
					{ field: 'campaign.id', operator: 'IN', value: ['1', '2'] },
				],
				actionBreakdowns: ['action_type'],
			}).success,
		).toBe(true);
		expect(
			MetaAdsEndpointInputSchemas.insightsList.safeParse({
				accountId: '123',
				fields: ['impressions'],
				breakdowns: ['undocumented_breakdown'],
			}).success,
		).toBe(false);
		expect(
			MetaAdsEndpointInputSchemas.insightsList.safeParse({
				accountId: '123',
				fields: ['impressions'],
				actionBreakdowns: ['action_type'],
			}).success,
		).toBe(false);
		expect(
			MetaAdsEndpointInputSchemas.insightsCreateAsync.safeParse({
				accountId: '123',
				fields: ['impressions'],
				level: 'campaign',
			}).success,
		).toBe(true);
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
