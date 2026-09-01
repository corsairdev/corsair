import { z } from 'zod';

/**
 * Locally mirrored Parseur entities.
 *
 * Field names match official JSON keys from https://api.parseur.com/openapi.json
 * (developer.parseur.com). Each field is labeled from that spec. Keys this
 * account returned on 2026-09-01 that the spec example omits are marked
 * live-observed. Only the primary key is required: Parseur omits most fields
 * on list/diet payloads.
 *
 * Docs: https://developer.parseur.com/
 */

const S = z.string().nullable().optional();
const N = z.number().nullable().optional();
const B = z.boolean().nullable().optional();

/**
 * Mailbox (parser).
 * Official: GET /parser/{id} Parser
 * https://developer.parseur.com/parser-8574587d0
 */
export const ParseurParser = z
	.object({
		/** Internal parser id. Official. */
		id: z.number(),
		/** Mailbox display name. Official. */
		name: S,
		/** Account UUID. Official. */
		account_uuid: S,
		/** AI engine. Official AIEngineEnum. */
		ai_engine: S,
		/** General AI instruction for this parser. Official. */
		ai_instructions: S,
		/** Email prefix for the mailbox. Official. */
		email_prefix: S,
		/** Document count. Official. */
		document_count: N,
		/** Template count. Official. */
		template_count: N,
		/** Webhook count. Official. */
		webhook_count: N,
		/** Skip email body; attachments only. Official. */
		attachments_only: B,
		/** Master parser flag. Official. */
		is_master: B,
		/** Last activity timestamp. Official. */
		last_activity: S,
		/** Documents by DocumentStatusEnum. Official. */
		document_per_status_count: z.record(z.string(), z.number()).optional(),
		/** Decimal separator. Official DecimalSeparatorEnum. */
		decimal_separator: S,
		/** Default timezone. Official. */
		default_timezone: S,
		/** Authenticated CSV download URL. Official. */
		csv_download: S,
		/** Authenticated JSON download URL. Official. */
		json_download: S,
		/** Authenticated XLS download URL. Official. */
		xls_download: S,
		/** Mailbox secret. Official. */
		secret: S,
		/** Active webhooks. Official. */
		webhook_set: z.array(z.unknown()).optional(),
		/** Paused webhooks. Official. */
		available_webhook_set: z.array(z.unknown()).optional(),
		/** Split-instruction text. Live-observed 2026-09-01. */
		ai_split_instructions: S,
		/** Workflow flag. Live-observed 2026-09-01. */
		workflow_enabled: B,
	})
	.loose();
export type ParseurParser = z.infer<typeof ParseurParser>;

/**
 * Document in a mailbox.
 * Official: GET /document/{id} Document
 * https://developer.parseur.com/document-8573539d0
 */
export const ParseurDocument = z
	.object({
		/** Internal document id. Official. */
		id: z.number(),
		/** Document name. Official. */
		name: S,
		/** Parent parser id. Official. */
		parser: N,
		/** Status. Official DocumentStatusEnum. */
		status: S,
		/** Received timestamp. Official. */
		received: S,
		/** Processed timestamp. Official. */
		processed: S,
		/** Extracted result as JSON string. Official. */
		result: S,
		/** JSON export URL. Official. */
		json_download_url: S,
		/** CSV export URL. Official. */
		csv_download_url: S,
		/** XLS export URL. Official. */
		xls_download_url: S,
		/** Original file URL. Official. */
		original_document_url: S,
	})
	.loose();
export type ParseurDocument = z.infer<typeof ParseurDocument>;

/**
 * Parsing template.
 * Official: GET /template/{id} Template
 */
export const ParseurTemplate = z
	.object({
		/** Template id. Official. */
		id: z.number(),
		/** Template name. Official. */
		name: S,
		/** Parent parser id. Official. */
		parser: N,
		/** TXT or OCR. Official TemplateEngineEnum. */
		engine: S,
		/** PROCESS, SKIP, DELETE, PROCESS_THEN_DELETE. Official. */
		action: S,
		/** DRAFT or PROD. Official TemplateStatusEnum. */
		status: S,
		/** Document count. Official. */
		document_count: N,
		/** Last activity. Official. */
		last_activity: S,
	})
	.loose();
export type ParseurTemplate = z.infer<typeof ParseurTemplate>;

/**
 * Custom download / export configuration.
 * Official: ExportConfig
 * https://developer.parseur.com/exportconfig-8657329d0
 */
export const ParseurExportConfig = z
	.object({
		/** Export config id. Official. */
		id: z.number(),
		/** Download name. Official. */
		name: S,
		/** PARSER or PARSER_FIELD. Official. */
		type: S,
		/** Field names included in the export. Official. */
		items: z.array(z.string()).optional(),
		/** Table field id (PF…). Official when type is PARSER_FIELD. */
		parser_field_id: S,
		/** Table field name. Official. */
		parser_field_name: S,
		/** CSV download URL. Official. */
		csv_download: S,
		/** XLS download URL. Official. */
		xls_download: S,
	})
	.loose();
export type ParseurExportConfig = z.infer<typeof ParseurExportConfig>;

/**
 * Webhook destination.
 * Official: Webhook. Wire field is `target`.
 */
export const ParseurWebhook = z
	.object({
		/** Webhook id. Official. */
		id: z.number(),
		/** Event. Official WebhookEventEnum. */
		event: S,
		/** Destination URL. Official. */
		target: S,
		/** Display name. Official. */
		name: S,
		/** Optional custom headers. Official. */
		headers: z.record(z.string(), z.unknown()).nullable().optional(),
		/** CUSTOM, ZAPIER, MAKE, FLOW, N8N. Official. */
		category: S,
		/** Table field ids for table.processed. Official. */
		parser_field_set: z.array(z.string()).optional(),
	})
	.loose();
export type ParseurWebhook = z.infer<typeof ParseurWebhook>;

/**
 * Document processing log row.
 * Official: GET /document/{id}/log_set Log
 */
export const ParseurLog = z
	.object({
		/** Log id. Official. */
		id: z.number(),
		/** Created timestamp. Official. */
		created: S,
		/** Log code. Official. */
		code: S,
		/** Document id. Official. */
		document: N,
		/** Document name. Official. */
		document_name: S,
		/** Parser id. Official. */
		parser: N,
		/** Parser name. Official. */
		parser_name: S,
		/** Template id. Official. */
		template: N,
		/** Template name. Official. */
		template_name: S,
		/** Log status. Official. */
		status: S,
		/** Log source. Official. */
		source: S,
		/** Message. Official. */
		message: S,
	})
	.loose();
export type ParseurLog = z.infer<typeof ParseurLog>;
