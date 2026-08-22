import { z } from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// AgilityCmsContentItem
// Verified against official Agility CMS Fetch API: GET /{locale}/item/{contentId}
// ─────────────────────────────────────────────────────────────────────────────

export const AgilityCmsContentItem = z.object({
	/** Unique numeric identifier for the content item. */
	contentID: z.number().int(),
	/** System metadata properties including state and modified timestamp. */
	properties: z
		.object({
			state: z.number().int().optional(),
			modified: z.coerce.date().nullable().optional(),
			versionID: z.number().int().optional(),
			referenceName: z.string().optional(),
			definitionName: z.string().optional(),
			itemOrder: z.number().int().optional(),
		})
		.optional(),
	/** Dynamic content fields key-value dictionary. */
	fields: z.record(z.string(), z.unknown()),
});
export type AgilityCmsContentItem = z.infer<typeof AgilityCmsContentItem>;

// ─────────────────────────────────────────────────────────────────────────────
// AgilityCmsPage
// Verified against official Agility CMS Fetch API: GET /{locale}/page/{pageId}
// ─────────────────────────────────────────────────────────────────────────────

export const AgilityCmsPage = z.object({
	/** Unique numeric identifier for the page. */
	pageID: z.number().int(),
	/** Page code name. */
	name: z.string(),
	/** URL route path for the page. */
	path: z.string().nullable().optional(),
	/** Browser title of the page. */
	title: z.string(),
	/** Navigation menu title text. */
	menuText: z.string().optional(),
	/** Page classification type (e.g. static, dynamic). */
	pageType: z.string().optional(),
	/** Page template layout name. */
	templateName: z.string(),
	/** Redirect URL if configured. */
	redirectUrl: z.string().nullable().optional(),
	/** Whether the page requires authentication. */
	securePage: z.boolean().optional(),
	/** Search engine optimization settings. */
	seo: z
		.object({
			metaDescription: z.string().optional(),
			metaKeywords: z.string().optional(),
			metaHTML: z.string().optional(),
			menuVisible: z.boolean().optional(),
			sitemapVisible: z.boolean().optional(),
		})
		.optional(),
	/** Content zones mapping to UI component modules. */
	zones: z
		.record(
			z.string(),
			z.array(
				z.object({
					module: z.string().optional(),
					item: z.record(z.string(), z.unknown()).optional(),
				}),
			),
		)
		.optional(),
	/** Page system metadata properties. */
	properties: z
		.object({
			state: z.number().int().optional(),
			modified: z.coerce.date().nullable().optional(),
			versionID: z.number().int().optional(),
		})
		.optional(),
});
export type AgilityCmsPage = z.infer<typeof AgilityCmsPage>;

// ─────────────────────────────────────────────────────────────────────────────
// AgilityCmsContentModel
// Verified against official Agility CMS Fetch API: GET /{locale}/models
// ─────────────────────────────────────────────────────────────────────────────

export const AgilityCmsContentModel = z.object({
	/** Unique model identifier. */
	id: z.number().int(),
	/** Content reference name. */
	referenceName: z.string().nullable().optional(),
	/** Human-readable display name. */
	displayName: z.string(),
	/** Description of the content model. */
	description: z.string().nullable().optional(),
	/** Array of field schema definitions. */
	fields: z.array(z.record(z.string(), z.unknown())).optional(),
});
export type AgilityCmsContentModel = z.infer<typeof AgilityCmsContentModel>;

// ─────────────────────────────────────────────────────────────────────────────
// AgilityCmsPageModule
// Verified against official Agility CMS Fetch API: GET /{locale}/models
// ─────────────────────────────────────────────────────────────────────────────

export const AgilityCmsPageModule = z.object({
	/** Unique module identifier. */
	id: z.number().int(),
	/** Reference name if applicable. */
	referenceName: z.string().nullable().optional(),
	/** Human-readable module name. */
	displayName: z.string(),
	/** Description of the page module. */
	description: z.string().nullable().optional(),
	/** Array of field schema definitions for the page module. */
	fields: z.array(z.record(z.string(), z.unknown())).optional(),
});
export type AgilityCmsPageModule = z.infer<typeof AgilityCmsPageModule>;

// ─────────────────────────────────────────────────────────────────────────────
// AgilityCmsSitemapNode
// Verified against official Agility CMS Fetch API: GET /{locale}/sitemap/flat/{channel}
// ─────────────────────────────────────────────────────────────────────────────

export const AgilityCmsSitemapNode = z.object({
	/** Page numeric identifier. */
	pageID: z.number().int(),
	/** Page title. */
	title: z.string(),
	/** Menu navigation label text. */
	menuText: z.string(),
	/** Absolute URL path for the page. */
	path: z.string(),
	/** Whether this node is a navigation folder. */
	isFolder: z.boolean().optional(),
	/** Redirect target URL if configured. */
	redirectUrl: z.string().nullable().optional(),
	/** Navigation visibility flags. */
	visible: z
		.object({
			menu: z.boolean().optional(),
			sitemap: z.boolean().optional(),
		})
		.optional(),
});
export type AgilityCmsSitemapNode = z.infer<typeof AgilityCmsSitemapNode>;

// ─────────────────────────────────────────────────────────────────────────────
// AgilityCmsSyncItem
// Verified against official Agility CMS Fetch API: GET /{locale}/sync/items
// ─────────────────────────────────────────────────────────────────────────────

export const AgilityCmsSyncItem = z.object({
	/** Content item ID. */
	contentID: z.number().int(),
	/** System properties and change status. */
	properties: z
		.object({
			state: z.number().int().optional(),
			modified: z.coerce.date().nullable().optional(),
			versionID: z.number().int().optional(),
			referenceName: z.string().optional(),
			definitionName: z.string().optional(),
			itemOrder: z.number().int().optional(),
		})
		.optional(),
	/** Content fields dictionary. */
	fields: z.record(z.string(), z.unknown()).optional(),
});
export type AgilityCmsSyncItem = z.infer<typeof AgilityCmsSyncItem>;

// ─────────────────────────────────────────────────────────────────────────────
// AgilityCmsSyncPage
// Verified against official Agility CMS Fetch API: GET /{locale}/sync/pages
// ─────────────────────────────────────────────────────────────────────────────

export const AgilityCmsSyncPage = z.object({
	/** Page numeric ID. */
	pageID: z.number().int(),
	/** Page name. */
	name: z.string().optional(),
	/** Page path. */
	path: z.string().nullable().optional(),
	/** Page title. */
	title: z.string().optional(),
	/** Page template layout name. */
	templateName: z.string().optional(),
	/** System properties and state. */
	properties: z
		.object({
			state: z.number().int().optional(),
			modified: z.coerce.date().nullable().optional(),
			versionID: z.number().int().optional(),
		})
		.optional(),
});
export type AgilityCmsSyncPage = z.infer<typeof AgilityCmsSyncPage>;
