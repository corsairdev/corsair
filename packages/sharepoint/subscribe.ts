import { msGraphSubscribe } from 'corsair/core';

/**
 * BYO subscribe for SharePoint — resolves the tenant's root site, then arms
 * the shared MS Graph subscribe on its default drive. driveItem subscriptions
 * only support changeType 'updated'.
 * ponytail: root site only — connect time gives us no site to pick. A
 * site-scoped subscribe needs a per-resource API, not connect-time auto.
 */
export async function sharepointSubscribe(
	ctx: Parameters<typeof msGraphSubscribe>[0],
	input: { webhookUrl: string },
) {
	const accessToken = await ctx.keys.get_access_token();
	if (!accessToken) return null;

	const siteResp = await fetch('https://graph.microsoft.com/v1.0/sites/root', {
		headers: { authorization: `Bearer ${accessToken}` },
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
