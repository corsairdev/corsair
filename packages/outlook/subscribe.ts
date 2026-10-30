import { msGraphSubscribe } from 'corsair/core';

// Incoming mail lands in the Inbox; the demo "send an email → webhook fires"
// only needs new-message events there. Widen to "me/messages" for all folders.
const MAIL_RESOURCE = "me/mailFolders('Inbox')/messages";

/**
 * BYO subscribe for Outlook mail — thin wrapper over the shared MS Graph
 * subscribe (see corsair/core/webhooks/ms-graph-subscribe.ts for the flow:
 * stale-sub cleanup → POST /subscriptions → persist clientState → link).
 */
export const outlookSubscribe = (
	ctx: Parameters<typeof msGraphSubscribe>[0],
	input: { webhookUrl: string },
) =>
	msGraphSubscribe(ctx, {
		webhookUrl: input.webhookUrl,
		resource: MAIL_RESOURCE,
		changeType: 'created',
	});
