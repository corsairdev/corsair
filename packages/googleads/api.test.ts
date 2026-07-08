import 'dotenv/config';
import { makeGoogleAdsRequest } from './client';
import type { GoogleAdsEndpointOutputs } from './endpoints/types';
import { GoogleAdsEndpointOutputSchemas } from './endpoints/types';

const TEST_TOKEN = process.env.GOOGLE_ADS_ACCESS_TOKEN || '';
const TEST_DEVELOPER_TOKEN = process.env.GOOGLE_ADS_DEVELOPER_TOKEN || '';
const TEST_CUSTOMER_ID =
	process.env.GOOGLE_ADS_CUSTOMER_ID || '1234567890';

const runIntegrationTests = !!TEST_TOKEN;
const describeIf = runIntegrationTests ? describe : describe.skip;

describeIf('Google Ads API Type Tests', () => {
	describe('campaigns', () => {
		it('campaignsGetById returns correct type shape', async () => {
			const query = `SELECT
				campaign.resource_name,
				campaign.id,
				campaign.name,
				campaign.status
			FROM campaign
			LIMIT 1`;

			const response = await makeGoogleAdsRequest<
				GoogleAdsEndpointOutputs['campaignsGetById']
			>(
				`/customers/${TEST_CUSTOMER_ID}/googleAds:search`,
				TEST_TOKEN,
				{
					method: 'POST',
					body: { query },
					developerToken: TEST_DEVELOPER_TOKEN,
				},
			);

			GoogleAdsEndpointOutputSchemas.campaignsGetById.parse(response);
		});

		it('campaignsGetByName returns correct type shape', async () => {
			const query = `SELECT
				campaign.resource_name,
				campaign.id,
				campaign.name,
				campaign.status
			FROM campaign
			WHERE campaign.name = 'Test Campaign'`;

			const response = await makeGoogleAdsRequest<
				GoogleAdsEndpointOutputs['campaignsGetByName']
			>(
				`/customers/${TEST_CUSTOMER_ID}/googleAds:search`,
				TEST_TOKEN,
				{
					method: 'POST',
					body: { query },
					developerToken: TEST_DEVELOPER_TOKEN,
				},
			);

			GoogleAdsEndpointOutputSchemas.campaignsGetByName.parse(response);
		});
	});

	describe('customer lists', () => {
		it('customerListsGetMany returns correct type shape', async () => {
			const query = `SELECT
				user_list.resource_name,
				user_list.id,
				user_list.name,
				user_list.type,
				user_list.membership_status
			FROM user_list`;

			const response = await makeGoogleAdsRequest<
				GoogleAdsEndpointOutputs['customerListsGetMany']
			>(
				`/customers/${TEST_CUSTOMER_ID}/googleAds:search`,
				TEST_TOKEN,
				{
					method: 'POST',
					body: { query },
					developerToken: TEST_DEVELOPER_TOKEN,
				},
			);

			GoogleAdsEndpointOutputSchemas.customerListsGetMany.parse(
				response,
			);
		});
	});
});

describe('Google Ads Schema Validation', () => {
	it('campaignsGetById output schema validates empty response', () => {
		const emptyResponse = { results: [], fieldMask: '' };
		const result =
			GoogleAdsEndpointOutputSchemas.campaignsGetById.parse(
				emptyResponse,
			);
		expect(result.results).toEqual([]);
	});

	it('campaignsGetById output schema validates populated response', () => {
		const response = {
			results: [
				{
					campaign: {
						resourceName: 'customers/123/campaigns/456',
						id: '456',
						name: 'Test Campaign',
						status: 'ENABLED',
					},
					campaignBudget: {
						resourceName:
							'customers/123/campaignBudgets/789',
						id: '789',
						amountMicros: '50000000',
					},
				},
			],
			fieldMask:
				'campaign.resourceName,campaign.id,campaign.name,campaign.status',
			totalResultsCount: '1',
		};
		const result =
			GoogleAdsEndpointOutputSchemas.campaignsGetById.parse(response);
		expect(result.results).toHaveLength(1);
		expect(result.results![0]!.campaign?.name).toBe('Test Campaign');
	});

	it('customerListsGetMany output schema validates populated response', () => {
		const response = {
			results: [
				{
					userList: {
						resourceName: 'customers/123/userLists/456',
						id: '456',
						name: 'My Customer List',
						type: 'CRM_BASED',
						membershipStatus: 'OPEN',
						sizeForDisplay: '1000',
						sizeForSearch: '900',
					},
				},
			],
			totalResultsCount: '1',
		};
		const result =
			GoogleAdsEndpointOutputSchemas.customerListsGetMany.parse(
				response,
			);
		expect(result.results).toHaveLength(1);
		expect(result.results![0]!.userList?.name).toBe(
			'My Customer List',
		);
	});

	it('customerListsCreate output schema validates response', () => {
		const response = {
			results: [
				{
					resourceName: 'customers/123/userLists/789',
				},
			],
		};
		const result =
			GoogleAdsEndpointOutputSchemas.customerListsCreate.parse(
				response,
			);
		expect(result.results).toHaveLength(1);
		expect(result.results![0]!.resourceName).toBe(
			'customers/123/userLists/789',
		);
	});

	it('customerListsAddOrRemove output schema validates response', () => {
		const response = {
			job: {
				resourceName:
					'customers/123/offlineUserDataJobs/456',
				type: 'CUSTOMER_MATCH_USER_LIST',
				status: 'RUNNING',
			},
			message:
				'Offline user data job created and started. Changes may take 6-12 hours to be reflected.',
		};
		const result =
			GoogleAdsEndpointOutputSchemas.customerListsAddOrRemove.parse(
				response,
			);
		expect(result.job?.status).toBe('RUNNING');
		expect(result.message).toContain('6-12 hours');
	});
});
