import { z } from 'zod';

/**
 * SurveyMonkey's callback body names the event and carries the ids involved in
 * `resources`, an object such as `{ respondent_id, recipient_id, collector_id,
 * survey_id, user_id }` (which keys appear depends on the webhook).
 */
const WebhookBodySchema = z
	.object({
		name: z.string().nullish(),
		filter_type: z.string().nullish(),
		filter_id: z.string().nullish(),
		event_type: z.string(),
		event_id: z.string().nullish(),
		event_datetime: z.string().nullish(),
		object_type: z.string().nullish(),
		object_id: z.string().nullish(),
		resources: z
			.object({
				respondent_id: z.string().nullish(),
				recipient_id: z.string().nullish(),
				collector_id: z.string().nullish(),
				survey_id: z.string().nullish(),
				user_id: z.string().nullish(),
			})
			.loose()
			.nullish(),
	})
	.loose();

export const SurveymonkeySchema = {
	version: '1.0.0',
	entities: {},
	webhooks: {
		response_completed: WebhookBodySchema,
		response_updated: WebhookBodySchema,
		response_created: WebhookBodySchema,
		response_deleted: WebhookBodySchema,
		response_disqualified: WebhookBodySchema,
		response_overquota: WebhookBodySchema,
		survey_created: WebhookBodySchema,
		survey_updated: WebhookBodySchema,
		survey_deleted: WebhookBodySchema,
		collector_created: WebhookBodySchema,
		collector_updated: WebhookBodySchema,
		collector_deleted: WebhookBodySchema,
	},
} as const;
