import { z } from 'zod';

/**
 * Locally persisted AMcards resources.
 *
 * Field names follow the official API v1 JSON (Django REST / Tastypie
 * snake_case). Extra keys from live payloads are kept via `.loose()`.
 *
 * Documented resource fields (AMcards API v1 + published tool contract):
 *   Contact: id, first_name, last_name, email, created_at, updated_at
 *   Category: title, hierarchy, priority, parent (readonly)
 *   Gift: name, description, price, shipping_cost, availability
 *   Public template: name, configuration, panels, metadata, category
 */

const Id = z.union([z.number(), z.string()]);

export const AmcardsCard = z
	.object({
		id: Id,
	})
	.loose();
export type AmcardsCard = z.infer<typeof AmcardsCard>;

export const AmcardsContact = z
	.object({
		id: Id,
		first_name: z.string().nullable().optional(),
		last_name: z.string().nullable().optional(),
		email: z.string().nullable().optional(),
		created_at: z.string().nullable().optional(),
		updated_at: z.string().nullable().optional(),
	})
	.loose();
export type AmcardsContact = z.infer<typeof AmcardsContact>;

export const AmcardsCategory = z
	.object({
		id: Id,
		title: z.string().nullable().optional(),
		priority: z.number().nullable().optional(),
		parent: z.unknown().optional(),
		hierarchy: z.unknown().optional(),
	})
	.loose();
export type AmcardsCategory = z.infer<typeof AmcardsCategory>;

export const AmcardsGift = z
	.object({
		id: Id,
		name: z.string().nullable().optional(),
		description: z.string().nullable().optional(),
		price: z.union([z.string(), z.number()]).nullable().optional(),
		shipping_cost: z.union([z.string(), z.number()]).nullable().optional(),
		available: z.boolean().optional(),
		availability: z.union([z.string(), z.boolean()]).optional(),
	})
	.loose();
export type AmcardsGift = z.infer<typeof AmcardsGift>;

export const AmcardsPublicTemplate = z
	.object({
		id: Id,
		name: z.string().nullable().optional(),
		category: z.unknown().optional(),
		configuration: z.unknown().optional(),
		panels: z.unknown().optional(),
		metadata: z.unknown().optional(),
	})
	.loose();
export type AmcardsPublicTemplate = z.infer<typeof AmcardsPublicTemplate>;
