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
		expect(inputKeys).toHaveLength(133);
		expect(outputKeys).toEqual(inputKeys);
		expect(registeredKeys).toHaveLength(133);
		expect(registeredKeys).toEqual(inputKeys);
	});

	it('rejects unknown keys after parsing a valid strict input', () => {
		const validInput = { campaignId: 'campaign-1' };
		expect(
			MetaAdsEndpointInputSchemas.campaignsGet.safeParse(validInput).success,
		).toBe(true);
		expect(
			MetaAdsEndpointInputSchemas.campaignsGet.safeParse({
				...validInput,
				undocumented: true,
			}).success,
		).toBe(false);
	});

	it('accepts numeric provider IDs for async and Insights follow-up calls', () => {
		expect(
			MetaAdsEndpointOutputSchemas.asyncRequestSetsCreate.parse({ id: 123 }),
		).toEqual({ id: 123 });
		expect(
			MetaAdsEndpointOutputSchemas.asyncRequestSetsList.parse({
				data: [{ id: 123 }],
			}),
		).toMatchObject({ data: [{ id: 123 }] });
		expect(
			MetaAdsEndpointOutputSchemas.asyncRequestsListForSet.parse({
				data: [{ id: 456, scope_object_id: 789 }],
			}),
		).toMatchObject({ data: [{ id: 456, scope_object_id: 789 }] });
		expect(
			MetaAdsEndpointOutputSchemas.insightsCreateAsync.parse({
				report_run_id: 6023920149050,
			}),
		).toEqual({ report_run_id: 6023920149050 });
		expect(
			MetaAdsEndpointInputSchemas.asyncRequestSetsGet.safeParse({
				requestSetId: 123,
			}).success,
		).toBe(true);
		expect(
			MetaAdsEndpointInputSchemas.asyncRequestsCancel.safeParse({
				requestId: 456,
			}).success,
		).toBe(true);
		expect(
			MetaAdsEndpointInputSchemas.insightsGetAsyncReport.safeParse({
				reportRunId: 6023920149050,
			}).success,
		).toBe(true);
	});

	it('rejects undefined-only updates while preserving false and zero values', () => {
		expect(
			MetaAdsEndpointInputSchemas.campaignsUpdate.safeParse({
				campaignId: 'campaign-1',
				dailyBudget: undefined,
			}).success,
		).toBe(false);
		expect(
			MetaAdsEndpointInputSchemas.campaignsUpdate.safeParse({
				campaignId: 'campaign-1',
				dailyBudget: 0,
			}).success,
		).toBe(true);
		expect(
			MetaAdsEndpointInputSchemas.adSetsUpdate.safeParse({
				adSetId: 'adset-1',
				status: undefined,
			}).success,
		).toBe(false);
		expect(
			MetaAdsEndpointInputSchemas.adSetsUpdate.safeParse({
				adSetId: 'adset-1',
				dailyBudget: 0,
			}).success,
		).toBe(true);
		expect(
			MetaAdsEndpointInputSchemas.pixelsUpdate.safeParse({
				pixelId: 'pixel-1',
				name: undefined,
			}).success,
		).toBe(false);
		expect(
			MetaAdsEndpointInputSchemas.pixelsUpdate.safeParse({
				pixelId: 'pixel-1',
				enableAutomaticMatching: false,
			}).success,
		).toBe(true);
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
		expect(
			MetaAdsEndpointInputSchemas.adsCreate.safeParse({
				accountId: '123',
				adSetId: 'adset-1',
				name: 'Pixel-sharing ad',
				creativeId: 'creative-1',
				conversionDomain: 'shop.example',
			}).success,
		).toBe(true);
		expect(
			MetaAdsEndpointInputSchemas.adsCreate.safeParse({
				accountId: '123',
				adSetId: 'adset-1',
				name: 'Pixel-sharing ad',
				creativeId: 'creative-1',
				conversionDomain: 'https://shop.example/path',
			}).success,
		).toBe(false);
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

	it('bounds split-test creation to documented ad-set cells and treatment shares', () => {
		const study = {
			businessId: 'business-1',
			name: 'Simple split test',
			startTime: 1_800_000_000,
			endTime: 1_800_086_400,
			type: 'SPLIT_TEST',
			cells: [
				{ name: 'Control', treatmentPercentage: 50, adSetIds: ['adset-1'] },
				{ name: 'Variant', treatmentPercentage: 50, adSetIds: ['adset-2'] },
			],
		};
		expect(
			MetaAdsEndpointInputSchemas.studiesCreate.safeParse(study).success,
		).toBe(true);
		expect(
			MetaAdsEndpointInputSchemas.studiesCreate.safeParse({
				...study,
				cells: [
					{ name: 'Control', treatmentPercentage: 60, adSetIds: ['adset-1'] },
					{ name: 'Variant', treatmentPercentage: 50, adSetIds: ['adset-2'] },
				],
			}).success,
		).toBe(false);
		expect(
			MetaAdsEndpointInputSchemas.studiesCreate.safeParse({
				...study,
				cells: [{ name: 'Only cell', treatmentPercentage: 100, adSetIds: [] }],
			}).success,
		).toBe(false);
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
				paging: { cursors: { after: 'cursor' }, hasNextPage: true },
			}),
		).toEqual({
			data: [{ id: '123', name: 'Campaign' }],
			paging: { cursors: { after: 'cursor' }, hasNextPage: true },
		});
		expect(
			MetaAdsListSchema.parse({
				data: [{ id: '123' }],
				paging: { hasNextPage: false },
			}),
		).toEqual({ data: [{ id: '123' }], paging: { hasNextPage: false } });
		expect(
			MetaAdsListSchema.safeParse({ data: [{ name: 'missing ID' }] }).success,
		).toBe(false);
		expect(MetaAdsListSchema.safeParse({ data: {} }).success).toBe(false);
	});

	it('keeps creative mutation output schemas aligned with the public operation types', () => {
		expect(
			MetaAdsEndpointOutputSchemas.creativesUpdate.parse({ success: true }),
		).toEqual({ success: true });
		expect(
			MetaAdsEndpointOutputSchemas.creativesDelete.parse({ success: true }),
		).toEqual({ success: true });
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
