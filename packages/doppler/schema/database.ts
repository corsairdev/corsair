import { z } from 'zod';
import { B, Id, S, UnknownArray } from './primitives';

/**
 * Field names match official JSON keys.
 * https://docs.doppler.com/reference/projects-object
 * https://docs.doppler.com/reference/projects-list
 * https://docs.doppler.com/reference/environments-object
 * https://docs.doppler.com/reference/environments-create
 * https://docs.doppler.com/reference/environments-rename
 * https://docs.doppler.com/reference/configs-object
 * https://docs.doppler.com/reference/configs-inheritable
 * https://docs.doppler.com/reference/workplace-get
 * https://docs.doppler.com/reference/webhooks-add
 *
 * Webhook add/get/list response schemas are official `{}`. Response field
 * names below are the live record; request labels on `url`/`name` come from
 * the add body schema.
 *
 * Secrets, service-token `key`, and Share `password` are never persisted.
 */

/** GET /v3/projects — OpenAPI `projects[]`. `slug` is on list, not the object page. */
export const DopplerProjectEntity = z
	.object({
		/** Unique identifier for the object. */
		id: Id,
		/** Project slug from GET /v3/projects. Addressing key for `project=` on other routes. */
		slug: S,
		/** Name of the project. */
		name: S,
		/** Description of the project. */
		description: S,
		/** Date and time of the object's creation. */
		created_at: S,
	})
	.loose();
export type DopplerProjectEntity = z.infer<typeof DopplerProjectEntity>;

/**
 * GET /v3/environments — OpenAPI environment object.
 * `slug` and `personal_configs` are on create/rename, not the object page.
 */
export const DopplerEnvironmentEntity = z
	.object({
		/** An identifier for the object. */
		id: Id,
		/** Desired slug. GET uses `id` for the same value. */
		slug: S,
		/** Name of the environment. */
		name: S,
		/** Identifier of the project the environment belongs to. */
		project: S,
		/** Date and time of the first secrets fetch from a config in the environment. */
		initial_fetch_at: S,
		/** Date and time of the object's creation. */
		created_at: S,
		/** Whether or not to enable personal configs for the environment. */
		personal_configs: B,
	})
	.loose();
export type DopplerEnvironmentEntity = z.infer<typeof DopplerEnvironmentEntity>;

/**
 * GET /v3/configs — OpenAPI config object.
 * Inheritance fields and `slug` are on POST /v3/configs/config/inheritable.
 */
export const DopplerConfigEntity = z
	.object({
		/** Name of the config. */
		name: Id,
		/** Config slug from the inheritable response (UUID in official examples). */
		slug: S,
		/** Identifier of the project that the config belongs to. */
		project: S,
		/** Identifier of the environment that the config belongs to. */
		environment: S,
		/** Whether the config is the root of the environment. */
		root: B,
		/** Boolean determining if the config is inheritable or not. */
		inheritable: B,
		/** Whether this config currently inherits from another. */
		inheriting: B,
		/** Configs this one inherits from. */
		inherits: UnknownArray,
		/** Configs that inherit from this one. camelCase in the official schema. */
		inheritedBy: UnknownArray,
		/** Whether the config can be renamed and/or deleted. */
		locked: B,
		/** Date and time of the first secrets fetch. */
		initial_fetch_at: S,
		/** Date and time of the last secrets fetch. */
		last_fetch_at: S,
		/** Date and time of the object's creation. */
		created_at: S,
	})
	.loose();
export type DopplerConfigEntity = z.infer<typeof DopplerConfigEntity>;

/**
 * Project webhook. Official add/get/list response schemas are empty;
 * field names match the live record. camelCase, unlike the rest of v3.
 * `authentication` and `secret` are stripped before cache (see webhooks.ts).
 */
export const DopplerWebhookEntity = z
	.object({
		/** Webhook identifier; the same value the path calls `{slug}`. */
		id: Id,
		/** The name of the webhook. */
		name: S,
		/** The webhook URL. Must be https. */
		url: S,
		/** Whether the webhook currently receives events. */
		enabled: B,
		/** Whether a signing secret is configured. Doppler never echoes `secret`. */
		hasSecret: B,
		/** Auth echo. Live: `{type}` only, never token/password. */
		authentication: z.unknown().nullable().optional(),
		/** Config slugs that the webhook should be enabled for. */
		enabledConfigs: UnknownArray,
		/** Whether the caller can manage this webhook. */
		canManage: B,
	})
	.loose();
export type DopplerWebhookEntity = z.infer<typeof DopplerWebhookEntity>;

/** GET /v3/workplace — OpenAPI `workplace`. */
export const DopplerWorkplaceEntity = z
	.object({
		/** Unique identifier for the workplace. */
		id: Id,
		/** Name of the workplace. */
		name: S,
		/** Email to send billing invoices to. */
		billing_email: S,
		/** Email to send security notices to. */
		security_email: S,
	})
	.loose();
export type DopplerWorkplaceEntity = z.infer<typeof DopplerWorkplaceEntity>;
