import type { ProoflyContext } from './context';
import { listCampaigns } from './endpoints/campaigns';

const apiKey = process.env.PROOFLY_API_KEY;
if (!apiKey) {
	console.warn('PROOFLY_API_KEY is not set. Skipping live Proofly calls.');
}

const live = apiKey ? it : it.skip;

live('lists campaigns from GET /api/campaigns', async () => {
	const result = await listCampaigns({ key: apiKey } as ProoflyContext, {});
	expect(result.ok).toBe(true);
	expect(Array.isArray(result.data)).toBe(true);
});
