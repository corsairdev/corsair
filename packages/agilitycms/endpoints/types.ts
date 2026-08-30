import { z } from 'zod';

export const ContentItemPropertiesSchema = z.object({
	state: z.number().int().optional().describe('Publish state code of the item'),
	modified: z.string().optional().describe('Last modified ISO timestamp'),
	versionID: z.number().int().optional().describe('Version identifier'),
	referenceName: z.string().optional().describe('Content list reference name'),
	definitionName: z
		.string()
		.optional()
		.describe('Name of the content model definition'),
	itemOrder: z.number().int().optional().describe('Sorting order index'),
});
export type ContentItemProperties = z.infer<typeof ContentItemPropertiesSchema>;

export const ContentItemSchema = z.object({
	contentID: z
		.number()
		.int()
		.describe('Unique identifier for the content item'),
	properties: ContentItemPropertiesSchema.optional().describe(
		'System metadata properties',
	),
	fields: z
		.record(z.string(), z.unknown())
		.describe('Dynamic content fields key-value dictionary'),
});
export type ContentItem = z.infer<typeof ContentItemSchema>;

export const PageZoneComponentSchema = z.object({
	module: z.string().optional().describe('Name of the UI component module'),
	item: z
		.record(z.string(), z.unknown())
		.optional()
		.describe('Content item details embedded in zone'),
});

export const PageSchema = z.object({
	pageID: z.number().int().describe('Unique identifier for the page'),
	name: z.string().describe('Page name'),
	path: z.string().nullable().optional().describe('URL path of the page'),
	title: z.string().describe('Browser title of the page'),
	menuText: z.string().optional().describe('Menu label text'),
	pageType: z.string().optional().describe('Page type (e.g. static, dynamic)'),
	templateName: z.string().describe('Page template layout name'),
	redirectUrl: z
		.string()
		.nullable()
		.optional()
		.describe('Redirect URL if configured'),
	securePage: z
		.boolean()
		.optional()
		.describe('Whether the page requires authentication'),
	seo: z
		.object({
			metaDescription: z.string().optional(),
			metaKeywords: z.string().optional(),
			metaHTML: z.string().optional(),
			menuVisible: z.boolean().optional(),
			sitemapVisible: z.boolean().optional(),
		})
		.optional()
		.describe('SEO and visibility configuration'),
	zones: z
		.record(z.string(), z.array(PageZoneComponentSchema))
		.optional()
		.describe('Content zones dictionary mapping zone name to components'),
	properties: ContentItemPropertiesSchema.optional().describe(
		'Page system metadata properties',
	),
});
export type Page = z.infer<typeof PageSchema>;

export const ContentModelSchema = z.object({
	id: z.number().int().describe('Unique model identifier'),
	referenceName: z
		.string()
		.nullable()
		.optional()
		.describe('Content reference name'),
	displayName: z.string().describe('Human readable display name'),
	description: z.string().nullable().optional().describe('Model description'),
	fields: z
		.array(z.record(z.string(), z.unknown()))
		.optional()
		.describe('Field definitions for this model'),
});
export type ContentModel = z.infer<typeof ContentModelSchema>;

export const PageModuleSchema = z.object({
	id: z.number().int().describe('Unique module identifier'),
	referenceName: z
		.string()
		.nullable()
		.optional()
		.describe('Reference name if applicable'),
	displayName: z.string().describe('Human readable module name'),
	description: z.string().nullable().optional().describe('Module description'),
	fields: z
		.array(z.record(z.string(), z.unknown()))
		.optional()
		.describe('Field schema definitions for the page module'),
});
export type PageModule = z.infer<typeof PageModuleSchema>;

export const SitemapNodeSchema = z.object({
	pageID: z.number().int().describe('Page identifier'),
	title: z.string().describe('Page title'),
	menuText: z.string().describe('Menu navigation title'),
	path: z.string().describe('URL path for the page'),
	isFolder: z
		.boolean()
		.optional()
		.describe('Whether the node is a navigation folder'),
	redirectUrl: z
		.string()
		.nullable()
		.optional()
		.describe('Redirect destination if configured'),
	visible: z
		.object({
			menu: z.boolean().optional(),
			sitemap: z.boolean().optional(),
		})
		.optional()
		.describe('Visibility flags'),
});
export type SitemapNode = z.infer<typeof SitemapNodeSchema>;

export const SyncItemSchema = z.object({
	contentID: z.number().int().describe('Content item ID'),
	properties: ContentItemPropertiesSchema.optional().describe(
		'System properties and change status',
	),
	fields: z
		.record(z.string(), z.unknown())
		.optional()
		.describe('Item content fields'),
});
export type SyncItem = z.infer<typeof SyncItemSchema>;

export const SyncPageSchema = z.object({
	pageID: z.number().int().describe('Page ID'),
	name: z.string().optional().describe('Page name'),
	path: z.string().nullable().optional().describe('Page path'),
	title: z.string().optional().describe('Page title'),
	templateName: z.string().optional().describe('Template name'),
	properties: ContentItemPropertiesSchema.optional().describe(
		'System metadata and state',
	),
});
export type SyncPage = z.infer<typeof SyncPageSchema>;

export const GetPageInputSchema = z.object({
	instanceGuid: z.string().min(1).describe('Agility CMS instance GUID'),
	locale: z.string().min(1).describe('Language locale code (e.g. en-us)'),
	pageId: z.number().int().positive().describe('Page ID to retrieve'),
	apiType: z
		.enum(['fetch', 'preview'])
		.default('fetch')
		.describe('API access mode: fetch for live, preview for staging'),
	contentLinkDepth: z
		.number()
		.int()
		.min(0)
		.max(5)
		.optional()
		.describe('Depth of linked content items to expand (0-5)'),
	expandAllContentLinks: z
		.boolean()
		.optional()
		.describe('Whether to automatically expand all nested content links'),
});
export type GetPageInput = z.infer<typeof GetPageInputSchema>;

export const GetPageResponseSchema = PageSchema;
export type GetPageResponse = z.infer<typeof GetPageResponseSchema>;

export const GetItemInputSchema = z.object({
	instanceGuid: z.string().min(1).describe('Agility CMS instance GUID'),
	locale: z.string().min(1).describe('Language locale code (e.g. en-us)'),
	contentId: z
		.number()
		.int()
		.positive()
		.describe('Content item ID to retrieve'),
	apiType: z
		.enum(['fetch', 'preview'])
		.default('fetch')
		.describe('API access mode: fetch for live, preview for staging'),
	contentLinkDepth: z
		.number()
		.int()
		.min(0)
		.max(5)
		.optional()
		.describe('Depth of linked content items to expand (0-5)'),
	expandAllContentLinks: z
		.boolean()
		.optional()
		.describe('Whether to automatically expand all nested content links'),
});
export type GetItemInput = z.infer<typeof GetItemInputSchema>;

export const GetItemResponseSchema = ContentItemSchema;
export type GetItemResponse = z.infer<typeof GetItemResponseSchema>;

export const GetListInputSchema = z.object({
	instanceGuid: z.string().min(1).describe('Agility CMS instance GUID'),
	locale: z.string().min(1).describe('Language locale code (e.g. en-us)'),
	referenceName: z
		.string()
		.min(1)
		.describe('Content list reference name (e.g. posts, authors)'),
	apiType: z
		.enum(['fetch', 'preview'])
		.default('fetch')
		.describe('API access mode: fetch for live, preview for staging'),
	contentLinkDepth: z
		.number()
		.int()
		.min(0)
		.max(5)
		.optional()
		.describe('Depth of linked content items to expand (0-5)'),
	expandAllContentLinks: z
		.boolean()
		.optional()
		.describe('Whether to automatically expand all nested content links'),
	take: z
		.number()
		.int()
		.positive()
		.max(500)
		.optional()
		.describe('Maximum number of items to return (page size)'),
	skip: z
		.number()
		.int()
		.min(0)
		.optional()
		.describe('Number of items to skip for pagination'),
	sort: z
		.string()
		.optional()
		.describe('Field name to sort items by (e.g. properties.modified)'),
	direction: z
		.enum(['asc', 'desc'])
		.optional()
		.describe('Sort direction: asc or desc'),
	filter: z
		.string()
		.optional()
		.describe('OData filter expression (e.g. fields.Title[like]MyPost)'),
});
export type GetListInput = z.infer<typeof GetListInputSchema>;

export const GetListResponseSchema = z.object({
	totalCount: z
		.number()
		.int()
		.optional()
		.describe('Total number of matching content items'),
	items: z
		.array(ContentItemSchema)
		.describe('Array of retrieved content items'),
});
export type GetListResponse = z.infer<typeof GetListResponseSchema>;

export const GetContentModelsInputSchema = z.object({
	instanceGuid: z.string().min(1).describe('Agility CMS instance GUID'),
	locale: z.string().min(1).describe('Language locale code (e.g. en-us)'),
	apiType: z
		.enum(['fetch', 'preview'])
		.default('fetch')
		.describe('API access mode: fetch for live, preview for staging'),
});
export type GetContentModelsInput = z.infer<typeof GetContentModelsInputSchema>;

export const GetContentModelsResponseSchema = z.array(ContentModelSchema);
export type GetContentModelsResponse = z.infer<
	typeof GetContentModelsResponseSchema
>;

export const GetPageModulesInputSchema = z.object({
	instanceGuid: z.string().min(1).describe('Agility CMS instance GUID'),
	locale: z.string().min(1).describe('Language locale code (e.g. en-us)'),
	apiType: z
		.enum(['fetch', 'preview'])
		.default('fetch')
		.describe('API access mode: fetch for live, preview for staging'),
});
export type GetPageModulesInput = z.infer<typeof GetPageModulesInputSchema>;

export const GetPageModulesResponseSchema = z.array(PageModuleSchema);
export type GetPageModulesResponse = z.infer<
	typeof GetPageModulesResponseSchema
>;

export const GetSitemapFlatInputSchema = z.object({
	instanceGuid: z.string().min(1).describe('Agility CMS instance GUID'),
	locale: z.string().min(1).describe('Language locale code (e.g. en-us)'),
	channelName: z
		.string()
		.min(1)
		.describe('Digital channel name (e.g. website)'),
	apiType: z
		.enum(['fetch', 'preview'])
		.default('fetch')
		.describe('API access mode: fetch for live, preview for staging'),
});
export type GetSitemapFlatInput = z.infer<typeof GetSitemapFlatInputSchema>;

export const GetSitemapFlatResponseSchema = z.record(
	z.string(),
	SitemapNodeSchema,
);
export type GetSitemapFlatResponse = z.infer<
	typeof GetSitemapFlatResponseSchema
>;

export const GetLogsInputSchema = z.object({
	instanceGuid: z.string().min(1).describe('Agility CMS instance GUID'),
	locale: z.string().min(1).describe('Language locale code (e.g. en-us)'),
	syncToken: z
		.string()
		.optional()
		.default('0')
		.describe(
			"Sync token for incremental change sync; use '0' for initial sync",
		),
	pageSize: z
		.number()
		.int()
		.positive()
		.max(500)
		.optional()
		.describe('Number of sync items to return per page (max 500)'),
	apiType: z
		.enum(['fetch', 'preview'])
		.default('fetch')
		.describe('API access mode'),
});
export type GetLogsInput = z.infer<typeof GetLogsInputSchema>;

export const GetLogsResponseSchema = z.object({
	syncToken: z
		.string()
		.describe(
			"Next sync token to persist; returns '0' when sync is up to date",
		),
	items: z
		.array(SyncItemSchema)
		.describe('List of content items created or updated since last sync'),
});
export type GetLogsResponse = z.infer<typeof GetLogsResponseSchema>;

export const SyncPagesInputSchema = z.object({
	instanceGuid: z.string().min(1).describe('Agility CMS instance GUID'),
	locale: z.string().min(1).describe('Language locale code (e.g. en-us)'),
	syncToken: z
		.string()
		.optional()
		.default('0')
		.describe("Sync token for incremental page sync; use '0' for initial sync"),
	pageSize: z
		.number()
		.int()
		.positive()
		.max(500)
		.optional()
		.describe('Number of sync pages to return per page (max 500)'),
	apiType: z
		.enum(['fetch', 'preview'])
		.default('fetch')
		.describe('API access mode'),
});
export type SyncPagesInput = z.infer<typeof SyncPagesInputSchema>;

export const SyncPagesResponseSchema = z.object({
	syncToken: z
		.string()
		.describe(
			"Next sync token to persist; returns '0' when page sync is up to date",
		),
	items: z
		.array(SyncPageSchema)
		.describe('List of page items created or updated since last sync'),
});
export type SyncPagesResponse = z.infer<typeof SyncPagesResponseSchema>;

export const GetApiTypesInputSchema = z.object({
	instanceGuid: z.string().min(1).describe('Agility CMS instance GUID'),
	locale: z
		.string()
		.optional()
		.default('en-us')
		.describe('Language locale code'),
	apiType: z
		.enum(['fetch', 'preview'])
		.default('fetch')
		.describe('API access mode'),
});
export type GetApiTypesInput = z.infer<typeof GetApiTypesInputSchema>;

export const GetApiTypesResponseSchema = z.record(
	z.string(),
	z.array(z.string()).or(z.record(z.string(), z.unknown())),
);
export type GetApiTypesResponse = z.infer<typeof GetApiTypesResponseSchema>;

export type AgilityCmsEndpointInputs = {
	getPage: GetPageInput;
	getItem: GetItemInput;
	getList: GetListInput;
	getContentModels: GetContentModelsInput;
	getPageModules: GetPageModulesInput;
	getSitemapFlat: GetSitemapFlatInput;
	getLogs: GetLogsInput;
	syncPages: SyncPagesInput;
	getApiTypes: GetApiTypesInput;
};

export type AgilityCmsEndpointOutputs = {
	getPage: GetPageResponse;
	getItem: GetItemResponse;
	getList: GetListResponse;
	getContentModels: GetContentModelsResponse;
	getPageModules: GetPageModulesResponse;
	getSitemapFlat: GetSitemapFlatResponse;
	getLogs: GetLogsResponse;
	syncPages: SyncPagesResponse;
	getApiTypes: GetApiTypesResponse;
};

export const AgilityCmsEndpointInputSchemas = {
	getPage: GetPageInputSchema,
	getItem: GetItemInputSchema,
	getList: GetListInputSchema,
	getContentModels: GetContentModelsInputSchema,
	getPageModules: GetPageModulesInputSchema,
	getSitemapFlat: GetSitemapFlatInputSchema,
	getLogs: GetLogsInputSchema,
	syncPages: SyncPagesInputSchema,
	getApiTypes: GetApiTypesInputSchema,
} as const;

export const AgilityCmsEndpointOutputSchemas = {
	getPage: GetPageResponseSchema,
	getItem: GetItemResponseSchema,
	getList: GetListResponseSchema,
	getContentModels: GetContentModelsResponseSchema,
	getPageModules: GetPageModulesResponseSchema,
	getSitemapFlat: GetSitemapFlatResponseSchema,
	getLogs: GetLogsResponseSchema,
	syncPages: SyncPagesResponseSchema,
	getApiTypes: GetApiTypesResponseSchema,
} as const;
