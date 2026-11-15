import type { CorsairEndpoint } from 'corsair/core';
import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { isProoflyFailure, prooflyFailure, prooflyGet } from '../client';
import type { ProoflyContext } from '../context';
import { ProoflyCampaignEntity } from '../schema/database';
import type { ListCampaignsInput, ListCampaignsResponse } from './types';
import { ListCampaignsInputSchema, ListCampaignsResponseSchema } from './types';

export const listCampaigns: CorsairEndpoint<
	ProoflyContext,
	ListCampaignsInput,
	ListCampaignsResponse
> = async (ctx, input) => {
	if (!ctx.key) {
		throw new AuthMissingError('proofly', 'api_key');
	}
	ListCampaignsInputSchema.parse(input);
	const body = await prooflyGet<unknown>(ctx.key, '/campaigns');
	if (isProoflyFailure(body)) throw prooflyFailure('/campaigns', body);
	const result = ListCampaignsResponseSchema.parse(body);
	await storeCampaigns(ctx, result.data);
	await logEventFromContext(
		ctx,
		'proofly.campaigns.list',
		{ count: result.data.length },
		'completed',
	);
	return result;
};

async function storeCampaigns(
	ctx: ProoflyContext,
	campaigns: ListCampaignsResponse['data'],
): Promise<void> {
	if (!ctx.db?.campaigns) return;
	for (const item of campaigns) {
		const row = ProoflyCampaignEntity.safeParse({
			id: String(item.id),
			name: item.name,
			domain: item.domain?.domain,
			subdomains: item.domain?.subdomains,
			enabled: item.enabled,
			created: item.created,
		});
		if (!row.success) continue;
		try {
			await ctx.db.campaigns.upsertByEntityId(row.data.id, row.data);
		} catch {
			console.warn('Failed to save Proofly campaign');
		}
	}
}
