import { msGraphSubscribe } from 'corsair/core';

/**
 * BYO subscribe for Teams — resolves the connected user's id, then arms the
 * shared MS Graph subscribe on their chat messages (no resource data, so no
 * encryption certificate is required).
 * ponytail: getAllMessages-class subscriptions carry Microsoft licensing
 * ("model") and permission requirements — expect live failures on unlicensed
 * tenants; the subscribe is best-effort and never fails the connect.
 */
export async function teamsSubscribe(
	ctx: Parameters<typeof msGraphSubscribe>[0],
	input: { webhookUrl: string },
) {
	const accessToken = await ctx.keys.get_access_token();
	if (!accessToken) return null;

	const meResp = await fetch('https://graph.microsoft.com/v1.0/me', {
		headers: { authorization: `Bearer ${accessToken}` },
	});
	if (!meResp.ok) return null;
	const { id } = (await meResp.json()) as { id?: string };
	if (!id) return null;

	return msGraphSubscribe(ctx, {
		webhookUrl: input.webhookUrl,
		resource: `users/${id}/chats/getAllMessages`,
		changeType: 'created',
	});
}
