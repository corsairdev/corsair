/**
 * Live checks against api.campaigncleaner.com.
 *
 *   CAMPAIGN_CLEANER_API_KEY=... pnpm --filter @corsair-dev/campaigncleaner exec tsx live-verify.ts
 *
 * Delete is skipped unless CAMPAIGN_CLEANER_DELETE_ID is set.
 */
import { makeCampaignCleanerRequest } from './client';
import { CampaignCleanerEndpointOutputSchemas } from './endpoints/types';

const key = process.env.CAMPAIGN_CLEANER_API_KEY;
if (!key) {
	console.error('Set CAMPAIGN_CLEANER_API_KEY to run live verification.');
	process.exit(2);
}

type Check = { name: string; run: () => Promise<string> };

const checks: Check[] = [
	{
		name: 'GET /v1/get_credits',
		run: async () => {
			const raw = await makeCampaignCleanerRequest('/v1/get_credits', key, {
				method: 'GET',
			});
			const parsed = CampaignCleanerEndpointOutputSchemas.getCredits.parse(raw);
			return `credits=${parsed.credits}`;
		},
	},
	{
		name: 'GET /v1/get_campaign_list',
		run: async () => {
			const raw = await makeCampaignCleanerRequest(
				'/v1/get_campaign_list',
				key,
				{ method: 'GET' },
			);
			const parsed =
				CampaignCleanerEndpointOutputSchemas.getCampaignList.parse(raw);
			return `campaigns=${parsed.campaign_list.length}`;
		},
	},
	{
		name: 'POST /v1/get_campaign_status',
		run: async () => {
			const list = CampaignCleanerEndpointOutputSchemas.getCampaignList.parse(
				await makeCampaignCleanerRequest('/v1/get_campaign_list', key, {
					method: 'GET',
				}),
			);
			const id = list.campaign_list[0]?.id;
			if (!id) return 'skipped (empty list)';
			const parsed =
				CampaignCleanerEndpointOutputSchemas.getCampaignStatus.parse(
					await makeCampaignCleanerRequest('/v1/get_campaign_status', key, {
						method: 'POST',
						body: { campaign: { id } },
					}),
				);
			return `status=${parsed.campaign_status.status}`;
		},
	},
	{
		name: 'POST /v1/get_campaign_pdf_analysis',
		run: async () => {
			const list = CampaignCleanerEndpointOutputSchemas.getCampaignList.parse(
				await makeCampaignCleanerRequest('/v1/get_campaign_list', key, {
					method: 'GET',
				}),
			);
			const completed = list.campaign_list.find(
				(c) => c.status === 'completed',
			);
			if (!completed) return 'skipped (no completed campaign)';
			const parsed =
				CampaignCleanerEndpointOutputSchemas.getCampaignPdfAnalysis.parse(
					await makeCampaignCleanerRequest(
						'/v1/get_campaign_pdf_analysis',
						key,
						{
							method: 'POST',
							binary: true,
							body: { campaign: { id: completed.id } },
						},
					),
				);
			return `pdf_bytes=${Buffer.from(parsed.content_base64, 'base64').length}`;
		},
	},
];

const deleteId = process.env.CAMPAIGN_CLEANER_DELETE_ID;
if (deleteId) {
	checks.push({
		name: 'POST /v1/delete_campaign',
		run: async () => {
			const parsed = CampaignCleanerEndpointOutputSchemas.deleteCampaign.parse(
				await makeCampaignCleanerRequest('/v1/delete_campaign', key, {
					method: 'POST',
					body: { campaign: { id: deleteId } },
				}),
			);
			return `status=${parsed.status}`;
		},
	});
}

let failed = 0;
for (const check of checks) {
	try {
		const detail = await check.run();
		console.log(`ok  ${check.name} (${detail})`);
	} catch (error) {
		failed += 1;
		console.error(`fail ${check.name}:`, error);
	}
}

if (failed > 0) process.exit(1);
