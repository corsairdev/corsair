import { z } from 'zod';

/**
 * Locally persisted Mailtrap entities.
 *
 * Only slow-changing structural records are mirrored: contacts, contact
 * lists, contact fields, email templates, sending domains, projects and
 * sandbox inboxes. Messages, stats, export/import jobs and contact events are
 * high-volume or continuously appended, so per the playbook they are
 * deliberately NOT stored — they are always wanted as a live view.
 *
 * Field names match the official JSON keys (snake_case), same convention as
 * Harvest's entities — Mailtrap's wire format is snake_case throughout, so
 * there is no camelCase translation layer to keep in sync. Fields come from
 * live responses captured 2026-08-17 against a real Mailtrap account (see
 * `endpoints/types.ts` for per-field provenance).
 *
 * The inbox entity deliberately excludes `password`/`username` (the SMTP
 * credentials Mailtrap returns on every inbox read) — those stay on the API
 * output type for a caller to use directly, but are not worth mirroring into
 * a local cache. Same rationale as Botpress's bot/integration
 * `signingSecret`, which is likewise API-visible but never persisted.
 */

const S = z.string().nullable().optional();
const B = z.boolean().nullable().optional();
const N = z.number().nullable().optional();

export const MailtrapContactEntity = z
	.object({
		id: z.string(),
		email: z.string(),
		created_at: z.coerce.date().nullable().optional(),
		updated_at: z.coerce.date().nullable().optional(),
		list_ids: z.array(z.number()).nullable().optional(),
		status: z.enum(['subscribed', 'unsubscribed']).nullable().optional(),
		fields: z
			.record(z.string(), z.union([z.string(), z.number(), z.boolean()]))
			.nullable()
			.optional(),
	})
	.loose();
export type MailtrapContactEntity = z.infer<typeof MailtrapContactEntity>;

export const MailtrapContactListEntity = z
	.object({
		id: z.number(),
		name: z.string(),
	})
	.loose();
export type MailtrapContactListEntity = z.infer<
	typeof MailtrapContactListEntity
>;

export const MailtrapContactFieldEntity = z
	.object({
		id: z.number(),
		name: z.string(),
		merge_tag: S,
		data_type: z
			.enum(['text', 'number', 'boolean', 'date'])
			.nullable()
			.optional(),
	})
	.loose();
export type MailtrapContactFieldEntity = z.infer<
	typeof MailtrapContactFieldEntity
>;

export const MailtrapEmailTemplateEntity = z
	.object({
		id: z.number(),
		uuid: S,
		name: z.string(),
		subject: S,
		category: S,
		body_html: S,
		body_text: S,
		created_at: z.coerce.date().nullable().optional(),
		updated_at: z.coerce.date().nullable().optional(),
	})
	.loose();
export type MailtrapEmailTemplateEntity = z.infer<
	typeof MailtrapEmailTemplateEntity
>;

export const MailtrapSendingDomainEntity = z
	.object({
		id: z.number(),
		domain_name: z.string(),
		demo: B,
		inbound_enabled: B,
		inbound_verified: B,
		open_tracking_enabled: B,
		click_tracking_enabled: B,
	})
	.loose();
export type MailtrapSendingDomainEntity = z.infer<
	typeof MailtrapSendingDomainEntity
>;

export const MailtrapProjectEntity = z
	.object({
		id: z.number(),
		name: z.string(),
	})
	.loose();
export type MailtrapProjectEntity = z.infer<typeof MailtrapProjectEntity>;

export const MailtrapInboxEntity = z
	.object({
		id: z.number(),
		name: z.string(),
		status: S,
		email_username: S,
		project_id: N,
		domain: S,
		sent_messages_count: N,
		emails_count: N,
		emails_unread_count: N,
	})
	.loose();
export type MailtrapInboxEntity = z.infer<typeof MailtrapInboxEntity>;
