import { MS_GRAPH_API_BASE, msGraphSubscribe } from 'corsair/core';

/**
 * BYO subscribe for SharePoint — resolves the tenant's root site, then arms
 * the shared MS Graph subscribe on its default drive. driveItem subscriptions
 * only support changeType 'updated'.
 * Root site only: at connect time there is no site to pick. Site-scoped
 * subscriptions need a per-resource subscribe API rather than this
 * connect-time default.
 */
export async function sharepointSubscribe(
	ctx: Parameters<typeof msGraphSubscribe>[0],
	input: { webhookUrl: string },
) {
	const accessToken = await ctx.keys.get_access_token();
	if (!accessToken) return null;

	const siteResp = await fetch(`${MS_GRAPH_API_BASE}/sites/root`, {
		headers: { authorization: `Bearer ${accessToken}` },
		signal: AbortSignal.timeout(20_000),
	});
	if (!siteResp.ok) return null;
	const { id } = (await siteResp.json()) as { id?: string };
	if (!id) return null;

	return msGraphSubscribe(ctx, {
		webhookUrl: input.webhookUrl,
		resource: `sites/${id}/drive/root`,
		changeType: 'updated',
	});
}
