import { z } from 'zod';

/**
 * SurveyMonkey delivers webhooks with a body that names the event and carries
 * the survey or collector, plus the respondent and collector ids. This plugin
 * has no signature scheme to verify, so the body is all it can read.
 */
const WebhookBodySchema = z
	.object({
		event_type: z.string(),
		event_id: z.string().nullish(),
		object_type: z.string().nullish(),
		object_id: z.string().nullish(),
		resources: z
			.array(
				z
					.object({
						id: z.string().nullish(),
						type: z.string().nullish(),
						href: z.string().nullish(),
					})
					.loose(),
			)
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
