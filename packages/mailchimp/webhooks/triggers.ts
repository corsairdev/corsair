import type { WebhookRequest } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { MailchimpContext, MailchimpWebhooks } from '../index';
import {
	CampaignEventSchema,
	createMailchimpMatch,
	ProfileEventSchema,
	parseMailchimpWebhookBody,
	SubscribeEventSchema,
	UnsubscribeEventSchema,
	verifyMailchimpWebhookSecret,
} from './types';

/**
 * Builds a Mailchimp trigger webhook: secret validation (unsigned webhooks),
 * defensive form-encoded parsing, schema validation, and event logging.
 */
function createTrigger<K extends keyof MailchimpWebhooks>(
	type: K,
	schema:
		| typeof SubscribeEventSchema
		| typeof UnsubscribeEventSchema
		| typeof ProfileEventSchema
		| typeof CampaignEventSchema,
): MailchimpWebhooks[K] {
	return {
		match: createMailchimpMatch(type),
		handler: async (
			ctx: MailchimpContext,
			request: WebhookRequest<unknown>,
		) => {
			// Phase 1 limitation: inbound webhook DELIVERY (the part where
			// Mailchimp POSTs to corsair and a trigger fires) is not yet
			// wired end-to-end. The framework's account-level routing key
			// (tenant_external_id, set to Mailchimp account_id at OAuth)
			// cannot be reconciled with the list-scoped list_id that
			// Mailchimp puts in webhook bodies. Webhook MANAGEMENT endpoints
			// (CRUD against /lists/{id}/webhooks) work normally; routing
			// inbound events to a specific corsair account is Phase 2 work
			// (URL-embedded hints or a list→account lookup cache).
			//
			// The handlers below still run if a tenant is matched (e.g. via
			// manual tenant_external_id configuration), so the schema
			// validation + event logging path is exercised for callers that
			// set up their own routing.
			const verification = verifyMailchimpWebhookSecret(request, ctx.key);
			if (!verification.valid) {
				return {
					success: false,
					statusCode: 401,
					error: verification.error ?? 'Webhook secret verification failed',
				};
			}

			const body =
				parseMailchimpWebhookBody(request.rawBody) ?? request.payload;
			const parsed = schema.safeParse(body);
			if (!parsed.success) {
				return {
					success: false,
					statusCode: 400,
					error: `Invalid Mailchimp ${type} payload`,
				};
			}

			// Type assertion is required because createTrigger is generic over
			// four schemas; the parsed data is guaranteed to match the trigger's
			// event shape but TypeScript cannot narrow across the union.
			const event = parsed.data as z.infer<typeof schema>;
			await logEventFromContext(
				ctx,
				`mailchimp.webhook.${type}`,
				{ ...event },
				'completed',
			);
			return { success: true, data: event };
		},
		// Cast is required because MailchimpWebhooks[K] is a strict per-key
		// type and createTrigger builds the handler generically; runtime
		// behavior matches the schema-validated shape for each K.
	} as MailchimpWebhooks[K];
}

export const MailchimpTriggerWebhooks = {
	subscribe: createTrigger('subscribe', SubscribeEventSchema),
	unsubscribe: createTrigger('unsubscribe', UnsubscribeEventSchema),
	profile: createTrigger('profile', ProfileEventSchema),
	campaign: createTrigger('campaign', CampaignEventSchema),
};
