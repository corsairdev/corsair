import { z } from 'zod';

/**
 * Local cache of Webvizio projects.
 *
 * Official MCP: GET https://app.webvizio.com/api/mcp/v1/projects
 * Source: https://github.com/Webvizio/mcp/blob/main/src/types.ts (`WebvizioProject`)
 *
 * Optional fields come from the documented outgoing webhook project payload:
 * https://webvizio.com/help-center/outgoing-webhooks/
 */
export const WebvizioProject = z
	.object({
		/** Project UUID. Official MCP: `uuid`. */
		uuid: z.string(),
		/** Project name. Official MCP: `name`. */
		name: z.string(),
		/** Numeric project id. Official webhook payload: `id`. */
		id: z.number().optional(),
		/** External project id. Official webhook payload: `externalId`. */
		externalId: z.string().nullable().optional(),
		/** Project screenshot URL. Official webhook payload: `screenshot`. */
		screenshot: z.string().nullable().optional(),
		/** Project URL. Official webhook payload: `url`. */
		url: z.string().nullable().optional(),
		/** ISO-8601 create time. Official webhook payload: `createdAt`. */
		createdAt: z.coerce.date().nullable().optional(),
		/** ISO-8601 update time. Official webhook payload: `updatedAt`. */
		updatedAt: z.coerce.date().nullable().optional(),
	})
	.loose();

export type WebvizioProject = z.infer<typeof WebvizioProject>;

/**
 * Local cache of REST Hook subscriptions.
 *
 * Official: POST/DELETE https://app.webvizio.com/api/v1/webhook
 * https://webvizio.com/help-center/rest-hooks/
 *
 * Subscribe body: `url`, `event`. Subscribe response: `id`.
 * Documented events: project.created|updated|deleted, task.created|updated|deleted,
 * comment.created|deleted.
 */
export const WebvizioWebhook = z
	.object({
		/** Webhook id. Official REST Hooks response: `id`. */
		id: z.number(),
		/** Callback URL. Official REST Hooks request: `url`. */
		url: z.string(),
		/** Event type. Official REST Hooks request: `event`. */
		event: z.string(),
	})
	.loose();

export type WebvizioWebhook = z.infer<typeof WebvizioWebhook>;
