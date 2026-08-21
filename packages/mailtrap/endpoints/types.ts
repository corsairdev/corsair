import { z } from 'zod';

/**
 * Shared entity and operation shapes for the Mailtrap account/contacts/
 * templates/sending-domains/stats/projects/sandbox-inbox surface.
 *
 * Ground truth for routes (method, path, request body/query fields) comes
 * from the official `mailtrap` npm package (v4.8.0, current major) source —
 * not from Mailtrap's public OpenAPI spec repo, which disagrees with the SDK
 * twice (see `MAILTRAP-PLAN.md`, "Ground truth source"). Response shapes are
 * a mix of that same package's TypeScript declarations and live captures
 * against a real account on 2026-08-17 (noted per schema below); where the
 * two disagree, the live capture wins, same precedent as Botpress's
 * `.loose()` entities.
 *
 * Field names are snake_case throughout, matching Mailtrap's wire format —
 * same convention as Harvest, which likewise never translates to camelCase.
 *
 * @see https://api-docs.mailtrap.io/
 */

const S = z.string().nullable().optional();
const N = z.number().nullable().optional();
const B = z.boolean().nullable().optional();

/* -------------------------------------------------------------------------- */
/* entities                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Live-captured 2026-08-17 from `POST /api/accounts/{id}/contacts` and
 * `GET .../contacts/{id}`. `id` is a UUID-shaped string (unlike every other
 * resource's numeric id) and `created_at`/`updated_at` are epoch
 * milliseconds (unlike the ISO 8601 strings templates/domains/projects use)
 * — `z.coerce.date()` accepts either form.
 */
export const MailtrapContactSchema = z
	.object({
		id: z.string(),
		email: z.string(),
		created_at: z.number().nullable().optional(),
		updated_at: z.number().nullable().optional(),
		list_ids: z.array(z.number()).nullable().optional(),
		status: z.enum(['subscribed', 'unsubscribed']).nullable().optional(),
		fields: z
			.record(z.string(), z.union([z.string(), z.number(), z.boolean()]))
			.nullable()
			.optional(),
	})
	.loose();
export type MailtrapContact = z.infer<typeof MailtrapContactSchema>;

/** Live-captured 2026-08-17 from `GET /api/accounts/{id}/contacts/lists`. */
export const MailtrapContactListSchema = z
	.object({
		id: z.number(),
		name: z.string(),
	})
	.loose();
export type MailtrapContactList = z.infer<typeof MailtrapContactListSchema>;

/**
 * Live-captured 2026-08-17 from `GET /api/accounts/{id}/contacts/fields`.
 * `created_at`/`updated_at` are declared on `ContactField` in
 * `mailtrap@4.8.0`'s type declarations but were not present on this
 * account's fields (all pre-existing defaults) — kept optional rather than
 * assumed absent.
 */
export const MailtrapContactFieldSchema = z
	.object({
		id: z.number(),
		name: z.string(),
		merge_tag: S,
		data_type: z
			.enum(['text', 'number', 'boolean', 'date'])
			.nullable()
			.optional(),
		created_at: N,
		updated_at: N,
	})
	.loose();
export type MailtrapContactField = z.infer<typeof MailtrapContactFieldSchema>;

/** Live-captured 2026-08-17 from `POST /api/accounts/{id}/email_templates`. */
export const MailtrapEmailTemplateSchema = z
	.object({
		id: z.number(),
		uuid: S,
		name: z.string(),
		subject: S,
		category: S,
		body_html: S,
		body_text: S,
		created_at: S,
		updated_at: S,
	})
	.loose();
export type MailtrapEmailTemplate = z.infer<typeof MailtrapEmailTemplateSchema>;

/** A single DNS record Mailtrap expects for sending-domain verification. */
export const MailtrapDnsRecordSchema = z
	.object({
		key: S,
		domain: S,
		name: S,
		type: S,
		value: S,
		status: S,
		actual: S,
	})
	.loose();
export type MailtrapDnsRecord = z.infer<typeof MailtrapDnsRecordSchema>;

/**
 * Live-captured 2026-08-17 from `POST /api/accounts/{id}/sending_domains`
 * and the pre-existing `demomailtrap.co` demo domain. `compliance_status`/
 * `dns_verified`/`dns_verified_at` are declared in `mailtrap@4.8.0`'s type
 * declarations but were not present on either live response — the SDK's
 * `.d.ts` looks stale here, so only observed fields are asserted and the
 * rest is left to `.loose()`.
 */
export const MailtrapSendingDomainSchema = z
	.object({
		id: z.number(),
		domain_name: z.string(),
		demo: B,
		inbound_enabled: B,
		inbound_verified: B,
		open_tracking_enabled: B,
		click_tracking_enabled: B,
		auto_unsubscribe_link_enabled: B,
		custom_domain_tracking_enabled: B,
		health_alerts_enabled: B,
		critical_alerts_enabled: B,
		alert_recipient_email: S,
		dns_records: z.array(MailtrapDnsRecordSchema).nullable().optional(),
	})
	.loose();
export type MailtrapSendingDomain = z.infer<typeof MailtrapSendingDomainSchema>;

const MailtrapResourcePermissionsSchema = z
	.object({
		can_read: B,
		can_update: B,
		can_destroy: B,
		can_leave: B,
	})
	.loose();

/**
 * Live-captured 2026-08-17 from `GET /api/accounts/{id}/inboxes/{id}`.
 * Includes SMTP `username`/`password` — real per-inbox credentials the API
 * hands back on every read, kept on this type for a caller to use directly.
 * They are deliberately NOT persisted — see `schema/database.ts`.
 */
export const MailtrapInboxSchema = z
	.object({
		id: z.number(),
		name: z.string(),
		username: S,
		password: S,
		max_size: N,
		status: S,
		email_username: S,
		email_username_enabled: B,
		sent_messages_count: N,
		forwarded_messages_count: N,
		used: B,
		forward_from_email_address: S,
		project_id: N,
		domain: S,
		pop3_domain: S,
		email_domain: S,
		api_domain: S,
		smtp_ports: z.array(z.number()).nullable().optional(),
		pop3_ports: z.array(z.number()).nullable().optional(),
		emails_count: N,
		emails_unread_count: N,
		last_message_sent_at: S,
		max_message_size: N,
		permissions: MailtrapResourcePermissionsSchema.nullable().optional(),
	})
	.loose();
export type MailtrapInbox = z.infer<typeof MailtrapInboxSchema>;

/** Live-captured 2026-08-17 from `GET /api/accounts/{id}/projects`. */
export const MailtrapProjectSchema = z
	.object({
		id: z.number(),
		name: z.string(),
		share_links: z
			.object({ admin: S, viewer: S })
			.loose()
			.nullable()
			.optional(),
		inboxes: z.array(MailtrapInboxSchema).nullable().optional(),
		permissions: MailtrapResourcePermissionsSchema.nullable().optional(),
	})
	.loose();
export type MailtrapProject = z.infer<typeof MailtrapProjectSchema>;

/**
 * The OSS catalog documents `DELETE_PROJECT` as returning the deleted
 * project's id, unlike every other delete in this catalog (confirmed
 * empty-body 204 for contacts, contact lists, contact fields, email
 * templates and sending domains). Not independently live-verified: this
 * account's free tier caps projects at one, and that one owns the
 * account's only sandbox inbox, so deleting it to observe the response
 * would be irreversibly destructive rather than a safe recon probe.
 * Trusting the catalog description here rather than guessing an empty body.
 */
export const MailtrapProjectDeleteResultSchema = z
	.object({ id: z.number() })
	.loose();
export type MailtrapProjectDeleteResult = z.infer<
	typeof MailtrapProjectDeleteResultSchema
>;

/**
 * From `Message` in `mailtrap@4.8.0`'s type declarations — this account's
 * sandbox inbox had no messages during recon, so the shape is SDK-derived
 * rather than live-captured. `.loose()` absorbs anything it misses.
 */
export const MailtrapMessageSchema = z
	.object({
		id: z.number(),
		inbox_id: N,
		subject: S,
		sent_at: S,
		from_email: S,
		from_name: S,
		to_email: S,
		to_name: S,
		email_size: N,
		is_read: B,
		created_at: S,
		updated_at: S,
		html_body_size: N,
		text_body_size: N,
		human_size: S,
		html_path: S,
		txt_path: S,
		raw_path: S,
		download_path: S,
		html_source_path: S,
	})
	.loose();
export type MailtrapMessage = z.infer<typeof MailtrapMessageSchema>;

/** From `Suppression` in `mailtrap@4.8.0`'s type declarations. */
export const MailtrapSuppressionSchema = z
	.object({
		id: z.string(),
		type: z
			.enum([
				'hard bounce',
				'spam complaint',
				'unsubscription',
				'manual import',
			])
			.nullable()
			.optional(),
		created_at: S,
		email: z.string(),
		sending_stream: z.enum(['transactional', 'bulk']).nullable().optional(),
		domain_name: S,
		message_bounce_category: S,
		message_category: S,
		message_client_ip: S,
		message_created_at: S,
		message_outgoing_ip: S,
		message_recipient_mx_name: S,
		message_sender_email: S,
		message_subject: S,
	})
	.loose();
export type MailtrapSuppression = z.infer<typeof MailtrapSuppressionSchema>;

/** Live-captured 2026-08-17 from `GET /api/accounts`. */
export const MailtrapUserSchema = z
	.object({
		id: z.number(),
		name: S,
		access_levels: z.array(z.number()).nullable().optional(),
	})
	.loose();
export type MailtrapUser = z.infer<typeof MailtrapUserSchema>;

/** Live-captured 2026-08-17 from `GET /api/accounts/{id}/billing/usage`. */
export const MailtrapBillingUsageSchema = z
	.object({
		billing: z
			.object({ cycle_start: S, cycle_end: S })
			.loose()
			.nullable()
			.optional(),
		testing: z
			.object({
				plan: z.object({ name: S }).loose().nullable().optional(),
				usage: z
					.object({
						sent_messages_count: z
							.object({ current: N, limit: N })
							.loose()
							.nullable()
							.optional(),
						forwarded_messages_count: z
							.object({ current: N, limit: N })
							.loose()
							.nullable()
							.optional(),
					})
					.loose()
					.nullable()
					.optional(),
			})
			.loose()
			.nullable()
			.optional(),
		sending: z
			.object({
				plan: z.object({ name: S }).loose().nullable().optional(),
				usage: z
					.object({
						sent_messages_count: z
							.object({ current: N, limit: N })
							.loose()
							.nullable()
							.optional(),
					})
					.loose()
					.nullable()
					.optional(),
			})
			.loose()
			.nullable()
			.optional(),
		/**
		 * Not in `mailtrap@4.8.0`'s `BillingCycleUsage` type declaration (which
		 * only lists `billing`/`sending`/`testing`) but present on every live
		 * response — the SDK's `.d.ts` looks stale here, same as the sending
		 * domain fields above.
		 */
		marketing: z
			.object({
				plan: z.object({ name: S }).loose().nullable().optional(),
				usage: z
					.object({
						sent_messages_count: z
							.object({ current: N, limit: N })
							.loose()
							.nullable()
							.optional(),
					})
					.loose()
					.nullable()
					.optional(),
			})
			.loose()
			.nullable()
			.optional(),
	})
	.loose();
export type MailtrapBillingUsage = z.infer<typeof MailtrapBillingUsageSchema>;

/**
 * `account_accesses` nests resources under other resources (account under it
 * has billing/projects/inboxes/domains). From `Resource` in
 * `mailtrap@4.8.0`'s type declarations — 403 "Unavailable on your plan" on
 * this account's free tier (see `MAILTRAP-PLAN.md`), so this is SDK-derived
 * rather than live-captured past the auth/routing layer.
 */
/**
 * Named and self-referential so `resources` below stays typed as nested
 * `MailtrapPermissionResourceShape[]` rather than `unknown[]` - the
 * recursive `z.lazy()` schema needs an explicit type annotation to avoid a
 * circular-inference error, and an inline `unknown[]` annotation type-checks
 * but silently drops type safety on every nested resource a caller reads.
 */
export interface MailtrapPermissionResourceShape {
	id?: number | null;
	name?: string | null;
	type?: string | null;
	access_level?: number | null;
	resources?: MailtrapPermissionResourceShape[] | null;
}

export const MailtrapPermissionResourceSchema: z.ZodType<MailtrapPermissionResourceShape> =
	z.lazy(() =>
		z
			.object({
				id: N,
				name: S,
				type: S,
				access_level: N,
				resources: z
					.array(MailtrapPermissionResourceSchema)
					.nullable()
					.optional(),
			})
			.loose(),
	);
export type MailtrapPermissionResource = z.infer<
	typeof MailtrapPermissionResourceSchema
>;

/** Live-captured 2026-08-17 from `POST .../contacts/{id}/events`. */
export const MailtrapContactEventResultSchema = z
	.object({
		contact_id: S,
		contact_email: S,
		name: S,
		params: z
			.record(z.string(), z.union([z.string(), z.number(), z.boolean()]))
			.nullable()
			.optional(),
	})
	.loose();
export type MailtrapContactEventResult = z.infer<
	typeof MailtrapContactEventResultSchema
>;

/**
 * Live-captured 2026-08-17 from `POST`/`GET .../contacts/exports`. The
 * filters that succeeded were `subscription_status` and `list_id` — the
 * OSS catalog's own operation description names both; earlier attempts in
 * this session using an unrelated field name (`email`) had 422'd, which
 * had looked like the whole endpoint was broken rather than one invalid
 * filter name.
 */
export const MailtrapContactExportSchema = z
	.object({
		id: z.number(),
		status: z.enum(['started', 'created', 'finished']).nullable().optional(),
		created_at: S,
		updated_at: S,
		url: S,
	})
	.loose();
export type MailtrapContactExport = z.infer<typeof MailtrapContactExportSchema>;

/** Live-captured 2026-08-17 from `POST`/`GET .../contacts/imports`. */
export const MailtrapContactImportSchema = z
	.object({
		id: z.number(),
		status: z
			.enum(['created', 'started', 'finished', 'failed'])
			.nullable()
			.optional(),
		created_at: S,
		updated_at: S,
		created_contacts_count: N,
		updated_contacts_count: N,
		contacts_over_limit_count: N,
	})
	.loose();
export type MailtrapContactImport = z.infer<typeof MailtrapContactImportSchema>;

/** Live-captured 2026-08-17 from `GET /api/accounts/{id}/stats`. */
export const MailtrapSendingStatsSchema = z
	.object({
		delivery_count: N,
		delivery_rate: N,
		bounce_count: N,
		bounce_rate: N,
		open_count: N,
		open_rate: N,
		click_count: N,
		click_rate: N,
		spam_count: N,
		spam_rate: N,
	})
	.loose();
export type MailtrapSendingStats = z.infer<typeof MailtrapSendingStatsSchema>;

/**
 * The grouped stats endpoints returned `[]` on this account (no send
 * history to group), so the per-item key names below are inferred from
 * `mailtrap@4.8.0`'s `StatsApi.groupedStats` — which reads
 * `item[groupKey]` off each raw array element before remapping it to a
 * `{name, value, stats}` convenience shape client-side. This plugin calls
 * the raw endpoint directly, so it models the pre-remap provider shape
 * (the group's own key name + `stats`) rather than the SDK's wrapper, per
 * the playbook's "mirror the provider's real response key" convention.
 */
export const MailtrapStatsByDateItemSchema = z
	.object({ date: S, stats: MailtrapSendingStatsSchema })
	.loose();
export type MailtrapStatsByDateItem = z.infer<
	typeof MailtrapStatsByDateItemSchema
>;

export const MailtrapStatsByDomainItemSchema = z
	.object({ sending_domain_id: N, stats: MailtrapSendingStatsSchema })
	.loose();
export type MailtrapStatsByDomainItem = z.infer<
	typeof MailtrapStatsByDomainItemSchema
>;

export const MailtrapStatsByCategoryItemSchema = z
	.object({ category: S, stats: MailtrapSendingStatsSchema })
	.loose();
export type MailtrapStatsByCategoryItem = z.infer<
	typeof MailtrapStatsByCategoryItemSchema
>;

export const MailtrapStatsByEspItemSchema = z
	.object({
		email_service_provider: S,
		stats: MailtrapSendingStatsSchema,
	})
	.loose();
export type MailtrapStatsByEspItem = z.infer<
	typeof MailtrapStatsByEspItemSchema
>;

/** Empty-body 2xx responses (delete, mark-as-read). */
export const EmptyResultSchema = z.object({}).loose();
export type EmptyResult = z.infer<typeof EmptyResultSchema>;

/* -------------------------------------------------------------------------- */
/* account (accountId itself needs no accountId; the other two do)           */
/* -------------------------------------------------------------------------- */

const AccountListAccountsInputSchema = z.object({});
export type AccountListAccountsInput = z.infer<
	typeof AccountListAccountsInputSchema
>;

const AccountGetPermissionResourcesInputSchema = z.object({});
export type AccountGetPermissionResourcesInput = z.infer<
	typeof AccountGetPermissionResourcesInputSchema
>;

const AccountGetBillingUsageInputSchema = z.object({});
export type AccountGetBillingUsageInput = z.infer<
	typeof AccountGetBillingUsageInputSchema
>;

/* -------------------------------------------------------------------------- */
/* contacts                                                                    */
/* -------------------------------------------------------------------------- */

const ContactsCreateInputSchema = z.object({
	email: z.string().min(1),
	fields: z
		.record(z.string(), z.union([z.string(), z.number(), z.boolean()]))
		.optional(),
	list_ids: z.array(z.number()).optional(),
	unsubscribed: z.boolean().optional(),
});
export type ContactsCreateInput = z.infer<typeof ContactsCreateInputSchema>;

const ContactsGetInputSchema = z.object({
	/** A contact id (UUID) or email — the API accepts either as `{identifier}`. */
	identifier: z.string().min(1),
});
export type ContactsGetInput = z.infer<typeof ContactsGetInputSchema>;

const ContactsUpdateInputSchema = z.object({
	identifier: z.string().min(1),
	email: z.string().optional(),
	fields: z
		.record(z.string(), z.union([z.string(), z.number(), z.boolean()]))
		.optional(),
	list_ids: z.array(z.number()).optional(),
	unsubscribed: z.boolean().optional(),
	/** Adds the contact to these lists without touching its other memberships. */
	list_ids_included: z.array(z.number()).optional(),
	/** Removes the contact from these lists without touching its other memberships. */
	list_ids_excluded: z.array(z.number()).optional(),
});
export type ContactsUpdateInput = z.infer<typeof ContactsUpdateInputSchema>;

const ContactsDeleteInputSchema = z.object({
	identifier: z.string().min(1),
});
export type ContactsDeleteInput = z.infer<typeof ContactsDeleteInputSchema>;

const ContactsCreateEventInputSchema = z.object({
	identifier: z.string().min(1),
	name: z.string().min(1),
	params: z
		.record(z.string(), z.union([z.string(), z.number(), z.boolean()]))
		.optional(),
});
export type ContactsCreateEventInput = z.infer<
	typeof ContactsCreateEventInputSchema
>;

const ContactExportFilterSchema = z.object({
	/**
	 * Confirmed live 2026-08-17: `subscription_status` (with `value:
	 * "subscribed"` or `"unsubscribed"`) and `list_id` (with `value` an
	 * array of list ids) both succeed. Left as a free string rather than an
	 * enum since custom contact fields are very likely also valid filter
	 * names and were not enumerated.
	 */
	name: z.string().min(1),
	operator: z.enum([
		'equal',
		'not_equal',
		'contains',
		'not_contains',
		'is_empty',
		'is_not_empty',
	]),
	value: z.union([
		z.string(),
		z.number(),
		z.boolean(),
		z.array(z.string()),
		z.array(z.number()),
	]),
});

const ContactsCreateExportInputSchema = z.object({
	filters: z.array(ContactExportFilterSchema).min(1),
});
export type ContactsCreateExportInput = z.infer<
	typeof ContactsCreateExportInputSchema
>;

const ContactsGetExportInputSchema = z.object({
	export_id: z.number(),
});
export type ContactsGetExportInput = z.infer<
	typeof ContactsGetExportInputSchema
>;

const ImportContactSchema = z.object({
	email: z.string().min(1),
	fields: z.record(z.string(), z.union([z.string(), z.number()])).optional(),
	list_ids_included: z.array(z.number()).optional(),
	list_ids_excluded: z.array(z.number()).optional(),
});

const ContactsImportInputSchema = z.object({
	contacts: z.array(ImportContactSchema).min(1),
});
export type ContactsImportInput = z.infer<typeof ContactsImportInputSchema>;

const ContactsGetImportInputSchema = z.object({
	import_id: z.number(),
});
export type ContactsGetImportInput = z.infer<
	typeof ContactsGetImportInputSchema
>;

/* -------------------------------------------------------------------------- */
/* contactLists                                                               */
/* -------------------------------------------------------------------------- */

const ContactListsListInputSchema = z.object({
	/** Case-insensitive prefix match on list name. */
	search: z.string().optional(),
});
export type ContactListsListInput = z.infer<typeof ContactListsListInputSchema>;

const ContactListsCreateInputSchema = z.object({
	name: z.string().min(1),
});
export type ContactListsCreateInput = z.infer<
	typeof ContactListsCreateInputSchema
>;

const ContactListsGetInputSchema = z.object({
	list_id: z.number(),
});
export type ContactListsGetInput = z.infer<typeof ContactListsGetInputSchema>;

const ContactListsUpdateInputSchema = z.object({
	list_id: z.number(),
	name: z.string().min(1),
});
export type ContactListsUpdateInput = z.infer<
	typeof ContactListsUpdateInputSchema
>;

const ContactListsDeleteInputSchema = z.object({
	list_id: z.number(),
});
export type ContactListsDeleteInput = z.infer<
	typeof ContactListsDeleteInputSchema
>;

/* -------------------------------------------------------------------------- */
/* contactFields                                                              */
/* -------------------------------------------------------------------------- */

const ContactFieldsListInputSchema = z.object({});
export type ContactFieldsListInput = z.infer<
	typeof ContactFieldsListInputSchema
>;

const ContactFieldsCreateInputSchema = z.object({
	name: z.string().min(1),
	merge_tag: z.string().min(1),
	data_type: z.enum(['text', 'number', 'boolean', 'date']),
});
export type ContactFieldsCreateInput = z.infer<
	typeof ContactFieldsCreateInputSchema
>;

const ContactFieldsGetInputSchema = z.object({
	field_id: z.number(),
});
export type ContactFieldsGetInput = z.infer<typeof ContactFieldsGetInputSchema>;

/**
 * `data_type` is deliberately not settable here. Confirmed live: `PATCH
 * .../contacts/fields/{id}` with `{ data_type: "number" }` on a `"text"`
 * field answers 200 but the stored `data_type` does not change - the API
 * silently ignores it rather than rejecting the request, matching the
 * catalog's own description ("modify the name or merge tag"). Exposing the
 * field here would let a caller believe a type change took effect when it
 * did not.
 */
const ContactFieldsUpdateInputSchema = z.object({
	field_id: z.number(),
	name: z.string().optional(),
	merge_tag: z.string().optional(),
});
export type ContactFieldsUpdateInput = z.infer<
	typeof ContactFieldsUpdateInputSchema
>;

const ContactFieldsDeleteInputSchema = z.object({
	field_id: z.number(),
});
export type ContactFieldsDeleteInput = z.infer<
	typeof ContactFieldsDeleteInputSchema
>;

/* -------------------------------------------------------------------------- */
/* suppressions                                                               */
/* -------------------------------------------------------------------------- */

const SuppressionsListInputSchema = z.object({
	email: z.string().optional(),
});
export type SuppressionsListInput = z.infer<typeof SuppressionsListInputSchema>;

/* -------------------------------------------------------------------------- */
/* emailTemplates                                                             */
/* -------------------------------------------------------------------------- */

const EmailTemplatesListInputSchema = z.object({});
export type EmailTemplatesListInput = z.infer<
	typeof EmailTemplatesListInputSchema
>;

const EmailTemplatesCreateInputSchema = z.object({
	name: z.string().min(1),
	subject: z.string().min(1),
	category: z.string().min(1),
	body_html: z.string().min(1),
	body_text: z.string().optional(),
});
export type EmailTemplatesCreateInput = z.infer<
	typeof EmailTemplatesCreateInputSchema
>;

const EmailTemplatesGetInputSchema = z.object({
	template_id: z.number(),
});
export type EmailTemplatesGetInput = z.infer<
	typeof EmailTemplatesGetInputSchema
>;

const EmailTemplatesUpdateInputSchema = z.object({
	template_id: z.number(),
	name: z.string().optional(),
	subject: z.string().optional(),
	category: z.string().optional(),
	body_html: z.string().optional(),
	body_text: z.string().optional(),
});
export type EmailTemplatesUpdateInput = z.infer<
	typeof EmailTemplatesUpdateInputSchema
>;

const EmailTemplatesDeleteInputSchema = z.object({
	template_id: z.number(),
});
export type EmailTemplatesDeleteInput = z.infer<
	typeof EmailTemplatesDeleteInputSchema
>;

/* -------------------------------------------------------------------------- */
/* sendingDomains                                                             */
/* -------------------------------------------------------------------------- */

const SendingDomainsListInputSchema = z.object({});
export type SendingDomainsListInput = z.infer<
	typeof SendingDomainsListInputSchema
>;

const SendingDomainsCreateInputSchema = z.object({
	domain_name: z.string().min(1),
});
export type SendingDomainsCreateInput = z.infer<
	typeof SendingDomainsCreateInputSchema
>;

const SendingDomainsGetInputSchema = z.object({
	domain_id: z.number(),
});
export type SendingDomainsGetInput = z.infer<
	typeof SendingDomainsGetInputSchema
>;

const SendingDomainsDeleteInputSchema = z.object({
	domain_id: z.number(),
});
export type SendingDomainsDeleteInput = z.infer<
	typeof SendingDomainsDeleteInputSchema
>;

/* -------------------------------------------------------------------------- */
/* stats (one filter shape shared by all five reads)                         */
/* -------------------------------------------------------------------------- */

const StatsFilterInputSchema = z.object({
	start_date: z.string().min(1),
	end_date: z.string().min(1),
	sending_domain_ids: z.array(z.number()).optional(),
	sending_streams: z.array(z.string()).optional(),
	categories: z.array(z.string()).optional(),
	email_service_providers: z.array(z.string()).optional(),
});
export type StatsFilterInput = z.infer<typeof StatsFilterInputSchema>;

/* -------------------------------------------------------------------------- */
/* projects                                                                    */
/* -------------------------------------------------------------------------- */

const ProjectsListInputSchema = z.object({});
export type ProjectsListInput = z.infer<typeof ProjectsListInputSchema>;

const ProjectsGetInputSchema = z.object({
	project_id: z.number(),
});
export type ProjectsGetInput = z.infer<typeof ProjectsGetInputSchema>;

const ProjectsUpdateInputSchema = z.object({
	project_id: z.number(),
	/** 2-100 characters (confirmed from `mailtrap@4.8.0`'s `ProjectsApi.update` doc comment). */
	name: z.string().min(2).max(100),
});
export type ProjectsUpdateInput = z.infer<typeof ProjectsUpdateInputSchema>;

const ProjectsDeleteInputSchema = z.object({
	project_id: z.number(),
});
export type ProjectsDeleteInput = z.infer<typeof ProjectsDeleteInputSchema>;

/* -------------------------------------------------------------------------- */
/* inboxes                                                                     */
/* -------------------------------------------------------------------------- */

const InboxesListInputSchema = z.object({});
export type InboxesListInput = z.infer<typeof InboxesListInputSchema>;

const InboxesGetInputSchema = z.object({
	inbox_id: z.number(),
});
export type InboxesGetInput = z.infer<typeof InboxesGetInputSchema>;

const InboxesUpdateInputSchema = z.object({
	inbox_id: z.number(),
	name: z.string().optional(),
	email_username: z.string().optional(),
});
export type InboxesUpdateInput = z.infer<typeof InboxesUpdateInputSchema>;

const InboxesCleanInputSchema = z.object({
	inbox_id: z.number(),
});
export type InboxesCleanInput = z.infer<typeof InboxesCleanInputSchema>;

const InboxesMarkAsReadInputSchema = z.object({
	inbox_id: z.number(),
});
export type InboxesMarkAsReadInput = z.infer<
	typeof InboxesMarkAsReadInputSchema
>;

const InboxesResetCredentialsInputSchema = z.object({
	inbox_id: z.number(),
});
export type InboxesResetCredentialsInput = z.infer<
	typeof InboxesResetCredentialsInputSchema
>;

/* -------------------------------------------------------------------------- */
/* messages                                                                    */
/* -------------------------------------------------------------------------- */

const MessagesListInputSchema = z.object({
	inbox_id: z.number(),
	last_id: z.number().optional(),
	page: z.number().int().positive().optional(),
	search: z.string().optional(),
});
export type MessagesListInput = z.infer<typeof MessagesListInputSchema>;

const MessagesGetHtmlInputSchema = z.object({
	inbox_id: z.number(),
	message_id: z.number(),
});
export type MessagesGetHtmlInput = z.infer<typeof MessagesGetHtmlInputSchema>;

/* -------------------------------------------------------------------------- */
/* input/output maps                                                          */
/* -------------------------------------------------------------------------- */

export type MailtrapEndpointInputs = {
	accountListAccounts: AccountListAccountsInput;
	accountGetPermissionResources: AccountGetPermissionResourcesInput;
	accountGetBillingUsage: AccountGetBillingUsageInput;
	contactsCreate: ContactsCreateInput;
	contactsGet: ContactsGetInput;
	contactsUpdate: ContactsUpdateInput;
	contactsDelete: ContactsDeleteInput;
	contactsCreateEvent: ContactsCreateEventInput;
	contactsCreateExport: ContactsCreateExportInput;
	contactsGetExport: ContactsGetExportInput;
	contactsImport: ContactsImportInput;
	contactsGetImport: ContactsGetImportInput;
	contactListsList: ContactListsListInput;
	contactListsCreate: ContactListsCreateInput;
	contactListsGet: ContactListsGetInput;
	contactListsUpdate: ContactListsUpdateInput;
	contactListsDelete: ContactListsDeleteInput;
	contactFieldsList: ContactFieldsListInput;
	contactFieldsCreate: ContactFieldsCreateInput;
	contactFieldsGet: ContactFieldsGetInput;
	contactFieldsUpdate: ContactFieldsUpdateInput;
	contactFieldsDelete: ContactFieldsDeleteInput;
	suppressionsList: SuppressionsListInput;
	emailTemplatesList: EmailTemplatesListInput;
	emailTemplatesCreate: EmailTemplatesCreateInput;
	emailTemplatesGet: EmailTemplatesGetInput;
	emailTemplatesUpdate: EmailTemplatesUpdateInput;
	emailTemplatesDelete: EmailTemplatesDeleteInput;
	sendingDomainsList: SendingDomainsListInput;
	sendingDomainsCreate: SendingDomainsCreateInput;
	sendingDomainsGet: SendingDomainsGetInput;
	sendingDomainsDelete: SendingDomainsDeleteInput;
	statsGet: StatsFilterInput;
	statsByDate: StatsFilterInput;
	statsByDomains: StatsFilterInput;
	statsByCategories: StatsFilterInput;
	statsByEsp: StatsFilterInput;
	projectsList: ProjectsListInput;
	projectsGet: ProjectsGetInput;
	projectsUpdate: ProjectsUpdateInput;
	projectsDelete: ProjectsDeleteInput;
	inboxesList: InboxesListInput;
	inboxesGet: InboxesGetInput;
	inboxesUpdate: InboxesUpdateInput;
	inboxesClean: InboxesCleanInput;
	inboxesMarkAsRead: InboxesMarkAsReadInput;
	inboxesResetCredentials: InboxesResetCredentialsInput;
	messagesList: MessagesListInput;
	messagesGetHtml: MessagesGetHtmlInput;
};

export type MailtrapEndpointOutputs = {
	accountListAccounts: MailtrapUser[];
	accountGetPermissionResources: MailtrapPermissionResource[];
	accountGetBillingUsage: MailtrapBillingUsage;
	contactsCreate: MailtrapContact;
	contactsGet: MailtrapContact;
	contactsUpdate: MailtrapContact;
	contactsDelete: EmptyResult;
	contactsCreateEvent: MailtrapContactEventResult;
	contactsCreateExport: MailtrapContactExport;
	contactsGetExport: MailtrapContactExport;
	contactsImport: MailtrapContactImport;
	contactsGetImport: MailtrapContactImport;
	contactListsList: MailtrapContactList[];
	contactListsCreate: MailtrapContactList;
	contactListsGet: MailtrapContactList;
	contactListsUpdate: MailtrapContactList;
	contactListsDelete: EmptyResult;
	contactFieldsList: MailtrapContactField[];
	contactFieldsCreate: MailtrapContactField;
	contactFieldsGet: MailtrapContactField;
	contactFieldsUpdate: MailtrapContactField;
	contactFieldsDelete: EmptyResult;
	suppressionsList: MailtrapSuppression[];
	emailTemplatesList: MailtrapEmailTemplate[];
	emailTemplatesCreate: MailtrapEmailTemplate;
	emailTemplatesGet: MailtrapEmailTemplate;
	emailTemplatesUpdate: MailtrapEmailTemplate;
	emailTemplatesDelete: EmptyResult;
	sendingDomainsList: MailtrapSendingDomain[];
	sendingDomainsCreate: MailtrapSendingDomain;
	sendingDomainsGet: MailtrapSendingDomain;
	sendingDomainsDelete: EmptyResult;
	statsGet: MailtrapSendingStats;
	statsByDate: MailtrapStatsByDateItem[];
	statsByDomains: MailtrapStatsByDomainItem[];
	statsByCategories: MailtrapStatsByCategoryItem[];
	statsByEsp: MailtrapStatsByEspItem[];
	projectsList: MailtrapProject[];
	projectsGet: MailtrapProject;
	projectsUpdate: MailtrapProject;
	projectsDelete: MailtrapProjectDeleteResult;
	inboxesList: MailtrapInbox[];
	inboxesGet: MailtrapInbox;
	inboxesUpdate: MailtrapInbox;
	inboxesClean: MailtrapInbox;
	inboxesMarkAsRead: MailtrapInbox;
	inboxesResetCredentials: MailtrapInbox;
	messagesList: MailtrapMessage[];
	messagesGetHtml: { html: string };
};

export const MailtrapEndpointInputSchemas = {
	accountListAccounts: AccountListAccountsInputSchema,
	accountGetPermissionResources: AccountGetPermissionResourcesInputSchema,
	accountGetBillingUsage: AccountGetBillingUsageInputSchema,
	contactsCreate: ContactsCreateInputSchema,
	contactsGet: ContactsGetInputSchema,
	contactsUpdate: ContactsUpdateInputSchema,
	contactsDelete: ContactsDeleteInputSchema,
	contactsCreateEvent: ContactsCreateEventInputSchema,
	contactsCreateExport: ContactsCreateExportInputSchema,
	contactsGetExport: ContactsGetExportInputSchema,
	contactsImport: ContactsImportInputSchema,
	contactsGetImport: ContactsGetImportInputSchema,
	contactListsList: ContactListsListInputSchema,
	contactListsCreate: ContactListsCreateInputSchema,
	contactListsGet: ContactListsGetInputSchema,
	contactListsUpdate: ContactListsUpdateInputSchema,
	contactListsDelete: ContactListsDeleteInputSchema,
	contactFieldsList: ContactFieldsListInputSchema,
	contactFieldsCreate: ContactFieldsCreateInputSchema,
	contactFieldsGet: ContactFieldsGetInputSchema,
	contactFieldsUpdate: ContactFieldsUpdateInputSchema,
	contactFieldsDelete: ContactFieldsDeleteInputSchema,
	suppressionsList: SuppressionsListInputSchema,
	emailTemplatesList: EmailTemplatesListInputSchema,
	emailTemplatesCreate: EmailTemplatesCreateInputSchema,
	emailTemplatesGet: EmailTemplatesGetInputSchema,
	emailTemplatesUpdate: EmailTemplatesUpdateInputSchema,
	emailTemplatesDelete: EmailTemplatesDeleteInputSchema,
	sendingDomainsList: SendingDomainsListInputSchema,
	sendingDomainsCreate: SendingDomainsCreateInputSchema,
	sendingDomainsGet: SendingDomainsGetInputSchema,
	sendingDomainsDelete: SendingDomainsDeleteInputSchema,
	statsGet: StatsFilterInputSchema,
	statsByDate: StatsFilterInputSchema,
	statsByDomains: StatsFilterInputSchema,
	statsByCategories: StatsFilterInputSchema,
	statsByEsp: StatsFilterInputSchema,
	projectsList: ProjectsListInputSchema,
	projectsGet: ProjectsGetInputSchema,
	projectsUpdate: ProjectsUpdateInputSchema,
	projectsDelete: ProjectsDeleteInputSchema,
	inboxesList: InboxesListInputSchema,
	inboxesGet: InboxesGetInputSchema,
	inboxesUpdate: InboxesUpdateInputSchema,
	inboxesClean: InboxesCleanInputSchema,
	inboxesMarkAsRead: InboxesMarkAsReadInputSchema,
	inboxesResetCredentials: InboxesResetCredentialsInputSchema,
	messagesList: MessagesListInputSchema,
	messagesGetHtml: MessagesGetHtmlInputSchema,
} as const;

export const MailtrapEndpointOutputSchemas = {
	accountListAccounts: z.array(MailtrapUserSchema),
	accountGetPermissionResources: z.array(MailtrapPermissionResourceSchema),
	accountGetBillingUsage: MailtrapBillingUsageSchema,
	contactsCreate: MailtrapContactSchema,
	contactsGet: MailtrapContactSchema,
	contactsUpdate: MailtrapContactSchema,
	contactsDelete: EmptyResultSchema,
	contactsCreateEvent: MailtrapContactEventResultSchema,
	contactsCreateExport: MailtrapContactExportSchema,
	contactsGetExport: MailtrapContactExportSchema,
	contactsImport: MailtrapContactImportSchema,
	contactsGetImport: MailtrapContactImportSchema,
	contactListsList: z.array(MailtrapContactListSchema),
	contactListsCreate: MailtrapContactListSchema,
	contactListsGet: MailtrapContactListSchema,
	contactListsUpdate: MailtrapContactListSchema,
	contactListsDelete: EmptyResultSchema,
	contactFieldsList: z.array(MailtrapContactFieldSchema),
	contactFieldsCreate: MailtrapContactFieldSchema,
	contactFieldsGet: MailtrapContactFieldSchema,
	contactFieldsUpdate: MailtrapContactFieldSchema,
	contactFieldsDelete: EmptyResultSchema,
	suppressionsList: z.array(MailtrapSuppressionSchema),
	emailTemplatesList: z.array(MailtrapEmailTemplateSchema),
	emailTemplatesCreate: MailtrapEmailTemplateSchema,
	emailTemplatesGet: MailtrapEmailTemplateSchema,
	emailTemplatesUpdate: MailtrapEmailTemplateSchema,
	emailTemplatesDelete: EmptyResultSchema,
	sendingDomainsList: z.array(MailtrapSendingDomainSchema),
	sendingDomainsCreate: MailtrapSendingDomainSchema,
	sendingDomainsGet: MailtrapSendingDomainSchema,
	sendingDomainsDelete: EmptyResultSchema,
	statsGet: MailtrapSendingStatsSchema,
	statsByDate: z.array(MailtrapStatsByDateItemSchema),
	statsByDomains: z.array(MailtrapStatsByDomainItemSchema),
	statsByCategories: z.array(MailtrapStatsByCategoryItemSchema),
	statsByEsp: z.array(MailtrapStatsByEspItemSchema),
	projectsList: z.array(MailtrapProjectSchema),
	projectsGet: MailtrapProjectSchema,
	projectsUpdate: MailtrapProjectSchema,
	projectsDelete: MailtrapProjectDeleteResultSchema,
	inboxesList: z.array(MailtrapInboxSchema),
	inboxesGet: MailtrapInboxSchema,
	inboxesUpdate: MailtrapInboxSchema,
	inboxesClean: MailtrapInboxSchema,
	inboxesMarkAsRead: MailtrapInboxSchema,
	inboxesResetCredentials: MailtrapInboxSchema,
	messagesList: z.array(MailtrapMessageSchema),
	messagesGetHtml: z.object({ html: z.string() }),
} as const;
