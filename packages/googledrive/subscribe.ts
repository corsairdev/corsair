import { googleChannelSubscribe } from 'corsair/core';

import { GOOGLE_DRIVE_API_BASE } from './client';

/**
 * BYO subscribe for Google Drive — resolves the changes start page token, then
 * opens a shared Google watch channel on the changes feed (covers the whole
 * drive; individual files would need per-file channels).
 */
export async function googledriveSubscribe(
	ctx: Parameters<typeof googleChannelSubscribe>[0],
	input: { webhookUrl: string },
) {
	const accessToken = await ctx.keys.get_access_token();
	if (!accessToken) return null;

	const tokenResp = await fetch(
		`${GOOGLE_DRIVE_API_BASE}/changes/startPageToken`,
		{
			headers: { authorization: `Bearer ${accessToken}` },
			signal: AbortSignal.timeout(20_000),
		},
	);
	if (!tokenResp.ok) return null;
	const { startPageToken } = (await tokenResp.json()) as {
		startPageToken?: string;
	};
	if (!startPageToken) return null;

	return googleChannelSubscribe(ctx, {
		webhookUrl: input.webhookUrl,
		watchUrl: `${GOOGLE_DRIVE_API_BASE}/changes/watch?pageToken=${encodeURIComponent(startPageToken)}`,
	});
}
