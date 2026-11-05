import { z } from 'zod';

/**
 * Field sets follow the official Basecamp 3 API docs (basecamp/bc3-api).
 *
 * Every non-key field is optional: Basecamp trims payloads per endpoint, so the
 * same entity arrives fuller from a `GET /projects/1.json` than from a list or
 * from a nested `creator`/`bucket` reference. Objects stay `.loose()` so fields
 * Basecamp adds later survive the round trip into the mirror store rather than
 * being stripped on the way through.
 */

/** Basecamp returns integer ids; path inputs carry them as strings. */
const BasecampEntityId = z.union([z.string(), z.number()]);

/** Nested `company` on a person, and the `sample` entries under project people. */
const BasecampCompanyRef = z
	.object({
		id: BasecampEntityId,
		name: z.string().nullable().optional(),
	})
	.loose();

/** One tool in a project's or template's `dock`. */
const BasecampDockEntry = z
	.object({
		id: BasecampEntityId,
		title: z.string().optional(),
		name: z.string().optional(),
		enabled: z.boolean().optional(),
		position: z.number().nullable().optional(),
		url: z.string().optional(),
		app_url: z.string().optional(),
	})
	.loose();

/** `people` summary block on a project: a count plus a truncated sample. */
const BasecampPeopleSummary = z
	.object({
		count: z.number().optional(),
		sample: z
			.array(
				z
					.object({
						id: BasecampEntityId,
						name: z.string().optional(),
						avatar_url: z.string().optional(),
					})
					.loose(),
			)
			.optional(),
	})
	.loose();

export const BasecampProject = z
	.object({
		id: BasecampEntityId,
		status: z.string().optional(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
		name: z.string().optional(),
		description: z.string().nullable().optional(),
		purpose: z.string().optional(),
		clients_enabled: z.boolean().optional(),
		timesheet_enabled: z.boolean().optional(),
		color: z.string().nullable().optional(),
		last_needle_color: z.string().nullable().optional(),
		last_needle_position: z.number().nullable().optional(),
		previous_needle_position: z.number().nullable().optional(),
		bookmark_url: z.string().optional(),
		star_url: z.string().optional(),
		url: z.string().optional(),
		app_url: z.string().optional(),
		dock: z.array(BasecampDockEntry).optional(),
		people: BasecampPeopleSummary.optional(),
		all_access: z.boolean().optional(),
		bookmarked: z.boolean().optional(),
		client_company: BasecampCompanyRef.nullable().optional(),
	})
	.loose();

export const BasecampTemplate = z
	.object({
		id: BasecampEntityId,
		status: z.string().optional(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
		name: z.string().optional(),
		description: z.string().nullable().optional(),
		url: z.string().optional(),
		app_url: z.string().optional(),
		dock: z.array(BasecampDockEntry).optional(),
	})
	.loose();

export const BasecampPerson = z
	.object({
		id: BasecampEntityId,
		attachable_sgid: z.string().optional(),
		name: z.string().optional(),
		email_address: z.string().optional(),
		personable_type: z.string().optional(),
		title: z.string().nullable().optional(),
		bio: z.string().nullable().optional(),
		location: z.string().nullable().optional(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
		admin: z.boolean().optional(),
		owner: z.boolean().optional(),
		client: z.boolean().optional(),
		employee: z.boolean().optional(),
		time_zone: z.string().optional(),
		avatar_url: z.string().optional(),
		company: BasecampCompanyRef.nullable().optional(),
		can_ping: z.boolean().optional(),
		can_manage_projects: z.boolean().optional(),
		can_manage_people: z.boolean().optional(),
	})
	.loose();

export const BasecampMessageType = z
	.object({
		id: BasecampEntityId,
		name: z.string().optional(),
		icon: z.string().optional(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
	})
	.loose();

/** A Campfire is labelled by `title`; it has no `name` field. */
export const BasecampCampfire = z
	.object({
		id: BasecampEntityId,
		title: z.string().optional(),
		status: z.string().optional(),
		type: z.string().optional(),
		topic: z.string().nullable().optional(),
		visible_to_clients: z.boolean().optional(),
		inherits_status: z.boolean().optional(),
		position: z.number().nullable().optional(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
		url: z.string().optional(),
		app_url: z.string().optional(),
		bookmark_url: z.string().optional(),
		subscription_url: z.string().optional(),
		lines_url: z.string().optional(),
		bucket: BasecampCompanyRef.optional(),
		creator: BasecampCompanyRef.optional(),
	})
	.loose();

/**
 * A chatbot is labelled by `service_name`; it has no `name` field.
 *
 * `lines_url` and `command_url` embed the chatbot key, which is a bearer
 * credential on its own — see the note in the chatbots docs. They are modelled
 * here because Basecamp returns them, but persist.ts strips both before a
 * chatbot row reaches the mirror store.
 */
export const BasecampChatbot = z
	.object({
		id: BasecampEntityId,
		service_name: z.string().optional(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
		url: z.string().optional(),
		app_url: z.string().optional(),
		command_url: z.string().nullable().optional(),
		lines_url: z.string().optional(),
	})
	.loose();

export type BasecampProject = z.infer<typeof BasecampProject>;
export type BasecampTemplate = z.infer<typeof BasecampTemplate>;
export type BasecampPerson = z.infer<typeof BasecampPerson>;
export type BasecampMessageType = z.infer<typeof BasecampMessageType>;
export type BasecampCampfire = z.infer<typeof BasecampCampfire>;
export type BasecampChatbot = z.infer<typeof BasecampChatbot>;
