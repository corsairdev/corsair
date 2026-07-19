import { msGraphSubscribe } from 'corsair/core';

/**
 * BYO subscribe for OneDrive — thin wrapper over the shared MS Graph
 * subscribe. OneDrive for Business only allows subscribing to the drive root;
 * notifications cover the whole hierarchy. driveItem subscriptions only
 * support changeType 'updated'.
 */
export const onedriveSubscribe = (
	ctx: Parameters<typeof msGraphSubscribe>[0],
	input: { webhookUrl: string },
) =>
	msGraphSubscribe(ctx, {
		webhookUrl: input.webhookUrl,
		resource: 'me/drive/root',
		changeType: 'updated',
	});
