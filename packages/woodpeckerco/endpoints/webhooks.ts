import { logEventFromContext } from 'corsair/core';
import type { WoodpeckerCoEndpoints } from '..';
import type { WoodpeckerCoWebhookEvent } from './types';
import {
	WoodpeckerCoEndpointInputSchemas as Inputs,
	WoodpeckerCoEndpointOutputSchemas as Outputs,
} from './types';

const DOCS = 'https://developers.woodpecker.co/docs/webhooks';

// Copied from "Available events" in
// https://developers.woodpecker.co/docs/webhooks.md. Woodpecker has no endpoint
// that lists them, so this needs updating when that page changes.
export const WOODPECKERCO_WEBHOOK_EVENTS: readonly WoodpeckerCoWebhookEvent[] =
	[
		{
			event: 'campaign_completed',
			description: 'A campaign status is changed to COMPLETED',
			docs_url: `${DOCS}/campaign-completed.md`,
		},
		{
			event: 'campaign_paused_by_bounce_shield',
			description:
				'Bounce Shield automatically pauses a campaign because its bounce rate exceeded the configured threshold',
			docs_url: `${DOCS}/campaign-paused-by-bounce-shield.md`,
		},
		{
			event: 'campaign_sent',
			description: 'A campaign email is sent to a prospect',
			docs_url: `${DOCS}/campaign-sent.md`,
		},
		{
			event: 'email_opened',
			description: 'A prospect opens your email',
			docs_url: `${DOCS}/email-opened.md`,
		},
		{
			event: 'followup_after_autoreply',
			description: 'You schedule a follow-up after receiving an autoresponse',
			docs_url: `${DOCS}/followup-after-autoreply.md`,
		},
		{
			event: 'link_clicked',
			description: 'A prospect clicks on a tracked link within your email',
			docs_url: `${DOCS}/link-clicked.md`,
		},
		{
			event: 'linkedin_automation_account_connected',
			description: 'A LinkedIn account is successfully connected to Woodpecker',
			docs_url: `${DOCS}/linkedin-account-connected.md`,
		},
		{
			event: 'linkedin_automation_account_disconnected',
			description: 'A LinkedIn account is disconnected from Woodpecker',
			docs_url: `${DOCS}/linkedin-account-disconnected.md`,
		},
		{
			event: 'linkedin_automation_connection_request_accepted',
			description:
				'A prospect accepts a LinkedIn connection request sent through Woodpecker LinkedIn automation',
			docs_url: `${DOCS}/prospect-li-cr-accepted.md`,
		},
		{
			event: 'linkedin_automation_direct_message_sent',
			description:
				'A LinkedIn direct message is sent through Woodpecker LinkedIn automation',
			docs_url: `${DOCS}/prospect-li-dm-sent.md`,
		},
		{
			event: 'linkedin_automation_prospect_replied',
			description:
				'A prospect replies in a conversation tracked by LinkedIn automation, including direct message, InMail and message responses to connection requests',
			docs_url: `${DOCS}/prospect-li-replied.md`,
		},
		{
			event: 'prospect_autoreplied',
			description:
				"An autoreply is detected or a prospect's status is manually changed to AUTOREPLIED",
			docs_url: `${DOCS}/prospect-autoreplied.md`,
		},
		{
			event: 'prospect_blacklisted',
			description: "A prospect's status is updated to BLACKLISTED",
			docs_url: `${DOCS}/prospect-blacklisted.md`,
		},
		{
			event: 'prospect_bounced',
			description:
				"A bounce is detected or a prospect's status is manually changed to BOUNCED",
			docs_url: `${DOCS}/prospect-bounced.md`,
		},
		{
			event: 'prospect_interested',
			description: "A prospect's interest level is updated to INTERESTED",
			docs_url: `${DOCS}/prospect-interested.md`,
		},
		{
			event: 'prospect_invalid',
			description:
				"A prospect's email address is marked as INVALID during the built-in email validation, or manually",
			docs_url: `${DOCS}/prospect-invalid.md`,
		},
		{
			event: 'prospect_maybe_later',
			description: "A prospect's interest level is updated to MAYBE_LATER",
			docs_url: `${DOCS}/prospect-maybe-later.md`,
		},
		{
			event: 'prospect_non_responsive',
			description: "A prospect's campaign status is changed to NON_RESPONSIVE",
			docs_url: `${DOCS}/prospect-non-responsive.md`,
		},
		{
			event: 'prospect_not_interested',
			description: "A prospect's interest level is updated to NOT_INTERESTED",
			docs_url: `${DOCS}/prospect-not-interested.md`,
		},
		{
			event: 'prospect_opt_out',
			description:
				'A prospect unsubscribes or their status is manually changed to OPT_OUT',
			docs_url: `${DOCS}/prospect-opt-out.md`,
		},
		{
			event: 'prospect_replied',
			description:
				"A prospect's reply is detected or their status is manually updated to RESPONDED",
			docs_url: `${DOCS}/prospect-replied.md`,
		},
		{
			event: 'prospect_saved',
			description:
				"A new prospect is added to your database or there's an update of an existing one",
			docs_url: `${DOCS}/prospect-saved.md`,
		},
		{
			event: 'secondary_replied',
			description: 'A secondary response is detected',
			docs_url: `${DOCS}/secondary-replied.md`,
		},
		{
			event: 'smtp_mailbox_send_error',
			description:
				'A mailbox encounters an error during campaign sending that temporarily pauses campaign sending',
			docs_url: `${DOCS}/smtp-mailbox-send-error.md`,
		},
		{
			event: 'task_created',
			description: 'A manual task is created for a prospect',
			docs_url: `${DOCS}/task-created.md`,
		},
		{
			event: 'task_done',
			description: 'A manual task is marked as done',
			docs_url: `${DOCS}/task-done.md`,
		},
		{
			event: 'task_ignored',
			description: 'A manual task is marked as ignored',
			docs_url: `${DOCS}/task_ignored.md`,
		},
	];

/** Answers from the catalog above, so it never calls Woodpecker. */
export const listEvents: WoodpeckerCoEndpoints['webhooksListEvents'] = async (
	ctx,
	input,
) => {
	Inputs.webhooksListEvents.parse(input ?? {});
	const result = Outputs.webhooksListEvents.parse({
		events: WOODPECKERCO_WEBHOOK_EVENTS,
	});
	await logEventFromContext(
		ctx,
		'woodpeckerco.webhooks.listEvents',
		{ count: result.events.length },
		'completed',
	);
	return result;
};
