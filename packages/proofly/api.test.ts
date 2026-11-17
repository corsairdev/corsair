import type { ProoflyContext } from './context';
import { listCampaigns } from './endpoints/campaigns';
import { listNotifications } from './endpoints/notifications';

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

live('lists the notifications of the first campaign', async () => {
	// unknown: the endpoints read only `key`; event logging needs no db.
	const ctx = { key: apiKey } as unknown as ProoflyContext;
	const campaigns = await listCampaigns(ctx, {});
	const first = campaigns.data[0];
	if (!first) return;
	const result = await listNotifications(ctx, {
		campaign_id: String(first.id),
	});
	expect(result.ok).toBe(true);
});
