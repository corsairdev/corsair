import { z } from 'zod';

/**
 * Mirrored entities are UniOne's *reference* data: the configuration a caller
 * reads repeatedly. Individual emails and events are deliberately not mirrored
 * - UniOne exposes them only through asynchronous CSV event dumps, so there is
 * no row to keep fresh.
 *
 * Field sets follow the official Web API reference (docs.unione.io/en/web-api-ref)
 * and were confirmed against live responses on 2026-08-22. Only the key is
 * required; UniOne omits fields by method and by plan.
 */

export const UnioneTemplate = z.object({
	id: z.string(),
	name: z.string().nullable().optional(),
	subject: z.string().nullable().optional(),
	from_email: z.string().nullable().optional(),
	from_name: z.string().nullable().optional(),
	editor_type: z.string().nullable().optional(),
	template_engine: z.string().nullable().optional(),
});

/**
 * Keyed by `url`: UniOne addresses webhooks by URL, not by a numeric id.
 * `webhook/get` rejects a call without one ("URL is not passed") and reports a
 * miss as "Webhook with URL '...' not found".
 */
export const UnioneWebhook = z.object({
	url: z.string(),
	status: z.string().nullable().optional(),
	event_format: z.string().nullable().optional(),
	delivery_info: z.number().nullable().optional(),
	single_event: z.number().nullable().optional(),
	max_parallel: z.number().nullable().optional(),
	events: z
		.object({
			email_status: z.array(z.string()).nullable().optional(),
			spam_block: z.array(z.string()).nullable().optional(),
		})
		.nullable()
		.optional(),
	updated_at: z.string().nullable().optional(),
});

/** `created` is UniOne's own suppression timestamp; `created_at` mirrors it. */
export const UnioneSuppression = z.object({
	email: z.string(),
	project_id: z.string().nullable().optional(),
	cause: z.string().nullable().optional(),
	source: z.string().nullable().optional(),
	is_deletable: z.boolean().nullable().optional(),
	created: z.string().nullable().optional(),
	created_at: z.coerce.date().nullable().optional(),
});

export const UnioneEventDump = z.object({
	dump_id: z.string(),
	dump_status: z.string().nullable().optional(),
});

export const UnioneDomain = z.object({
	domain: z.string(),
	verification_status: z.string().nullable().optional(),
	verification_value: z.string().nullable().optional(),
	dkim_status: z.string().nullable().optional(),
	dkim_key: z.string().nullable().optional(),
});

export const UnioneTag = z.object({
	tag_id: z.number(),
	tag: z.string(),
});

/** From `system/info.json`. `project_id` appears only for project-scoped keys. */
export const UnioneAccount = z.object({
	user_id: z.union([z.string(), z.number()]),
	email: z.string().nullable().optional(),
	project_id: z.string().nullable().optional(),
	project_name: z.string().nullable().optional(),
	emails_included: z.number().nullable().optional(),
	emails_sent: z.number().nullable().optional(),
	validations_included: z.number().nullable().optional(),
	validations_used: z.number().nullable().optional(),
	period_start: z.string().nullable().optional(),
	period_end: z.string().nullable().optional(),
});

export type UnioneTemplate = z.infer<typeof UnioneTemplate>;
export type UnioneWebhook = z.infer<typeof UnioneWebhook>;
export type UnioneSuppression = z.infer<typeof UnioneSuppression>;
export type UnioneEventDump = z.infer<typeof UnioneEventDump>;
export type UnioneDomain = z.infer<typeof UnioneDomain>;
export type UnioneTag = z.infer<typeof UnioneTag>;
export type UnioneAccount = z.infer<typeof UnioneAccount>;
