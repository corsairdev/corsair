import { googleChannelSubscribe } from 'corsair/core';

const DRIVE_API = 'https://www.googleapis.com/drive/v3';

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

	const tokenResp = await fetch(`${DRIVE_API}/changes/startPageToken`, {
		headers: { authorization: `Bearer ${accessToken}` },
	});
	if (!tokenResp.ok) return null;
	const { startPageToken } = (await tokenResp.json()) as {
		startPageToken?: string;
	};
	if (!startPageToken) return null;

	return googleChannelSubscribe(ctx, {
		webhookUrl: input.webhookUrl,
		watchUrl: `${DRIVE_API}/changes/watch?pageToken=${encodeURIComponent(startPageToken)}`,
	});
}
