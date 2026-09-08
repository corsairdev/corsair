import { MS_GRAPH_API_BASE, msGraphSubscribe } from 'corsair/core';

export type TeamsChannelSubscription = {
	teamId: string;
	channelId: string;
};

/**
 * BYO subscribe for Teams. Channel apps pass a team/channel pair; otherwise we
 * keep the existing chat-message subscription behavior.
 * getAllMessages-class subscriptions carry Microsoft licensing ("model") and
 * permission requirements — expect live failures on unlicensed tenants; the
 * subscribe is best-effort and never fails the connect.
 */
export async function teamsSubscribe(
	ctx: Parameters<typeof msGraphSubscribe>[0],
	input: {
		webhookUrl: string;
		clientState?: string;
		channelSubscription?: TeamsChannelSubscription;
	},
) {
	const accessToken = await ctx.keys.get_access_token();
	if (!accessToken) return null;

	if (input.channelSubscription) {
		const { teamId, channelId } = input.channelSubscription;
		return msGraphSubscribe(ctx, {
			webhookUrl: input.webhookUrl,
			clientState: input.clientState,
			resource: `teams/${teamId}/channels/${channelId}/messages`,
			changeType: 'created',
		});
	}

	const meResp = await fetch(`${MS_GRAPH_API_BASE}/me`, {
		headers: { authorization: `Bearer ${accessToken}` },
		signal: AbortSignal.timeout(20_000),
	});
	if (!meResp.ok) return null;
	const { id } = (await meResp.json()) as { id?: string };
	if (!id) return null;

	return msGraphSubscribe(ctx, {
		webhookUrl: input.webhookUrl,
		clientState: input.clientState,
		resource: `users/${id}/chats/getAllMessages`,
		changeType: 'created',
	});
}
