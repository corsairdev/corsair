import { z } from 'zod';

/**
 * Locally persisted Botpress entities.
 *
 * Only slow-changing structural records are mirrored: workspaces, bots and
 * integrations. Conversations, messages, events and table rows are
 * high-volume and continuously appended, so per the playbook they are
 * deliberately NOT stored — they are always wanted as a live view.
 *
 * Field lists for `workspace` and `bot` come from live responses captured
 * 2026-08-16 against a real Botpress account (`GET /v1/admin/workspaces`,
 * `POST /v1/admin/bots`). `integration` was not created live in this pass
 * (creating one requires a full manifest with configuration/actions/events
 * schemas); its shape comes from `CreateIntegrationResponse` in
 * `@botpress/client` v2.2.0's bundled type declarations, so only the fields
 * used to identify and list an integration are typed strictly — the rest of
 * the manifest is opaque and unknown to this mirror.
 */

const S = z.string().nullable().optional();
const B = z.boolean().nullable().optional();
const N = z.number().nullable().optional();

export const BotpressWorkspaceEntity = z
	.object({
		id: z.string(),
		name: z.string(),
		ownerId: S,
		createdAt: z.coerce.date().nullable().optional(),
		updatedAt: z.coerce.date().nullable().optional(),
		blocked: B,
		plan: S,
		billingVersion: S,
		spendingLimit: N,
		botCount: N,
		about: S,
		profilePicture: S,
		contactEmail: S,
		website: S,
		isPublic: B,
		handle: S,
		activeTrialId: S,
	})
	.loose();
export type BotpressWorkspaceEntity = z.infer<typeof BotpressWorkspaceEntity>;

export const BotpressBotEntity = z
	.object({
		id: z.string(),
		name: S,
		createdAt: z.coerce.date().nullable().optional(),
		updatedAt: z.coerce.date().nullable().optional(),
		createdBy: S,
		dev: B,
		alwaysAlive: B,
		status: S,
		type: S,
		/**
		 * Deeply nested provider-defined manifest sections (states, message,
		 * user, conversation, events, actions, integrations, plugins,
		 * configuration, tags). Never observed as a stable, enumerable field
		 * list across bots — kept as opaque records rather than modeled
		 * field-by-field.
		 */
		tags: z.record(z.string(), z.string()).nullable().optional(),
	})
	.loose();
export type BotpressBotEntity = z.infer<typeof BotpressBotEntity>;

export const BotpressIntegrationEntity = z
	.object({
		id: z.string(),
		name: z.string(),
		version: z.string(),
		title: S,
		description: S,
		createdAt: z.coerce.date().nullable().optional(),
		updatedAt: z.coerce.date().nullable().optional(),
		visibility: S,
		dev: B,
		url: S,
		iconUrl: S,
		readmeUrl: S,
	})
	.loose();
export type BotpressIntegrationEntity = z.infer<
	typeof BotpressIntegrationEntity
>;
