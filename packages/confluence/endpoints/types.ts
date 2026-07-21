import { z } from 'zod';

const ConfluenceLinksSchema = z.record(z.string(), z.string()).optional();
const ConfluenceExpandableSchema = z.record(z.string(), z.string()).optional();

export const ConfluenceSpaceSchema = z.object({
	id: z.string().optional(),
	ari: z.string().optional(),
	key: z.string(),
	alias: z.string().optional(),
	name: z.string(),
	type: z.string().optional(),
	status: z.string().optional(),
	description: z.unknown().optional(),
	homepage: z.unknown().optional(),
	_expandable: ConfluenceExpandableSchema,
	_links: ConfluenceLinksSchema,
});

export const ConfluencePageSchema = z.object({
	id: z.string(),
	status: z.string().optional(),
	title: z.string(),
	spaceId: z.string().optional(),
	parentId: z.string().nullable().optional(),
	parentType: z.string().nullable().optional(),
	authorId: z.string().optional(),
	createdAt: z.string().optional(),
	version: z
		.object({
			createdAt: z.string().optional(),
			message: z.string().optional(),
			number: z.number().optional(),
			minorEdit: z.boolean().optional(),
			authorId: z.string().optional(),
		})
		.optional(),
	body: z
		.object({
			storage: z
				.object({
					value: z.string().optional(),
					representation: z.string().optional(),
				})
				.optional(),
			atlas_doc_format: z
				.object({
					value: z.string().optional(),
					representation: z.string().optional(),
				})
				.optional(),
		})
		.optional(),
	_links: z
		.object({
			webui: z.string().optional(),
			editui: z.string().optional(),
			tinyui: z.string().optional(),
			self: z.string().optional(),
		})
		.optional(),
});

export const SpacesListInputSchema = z.object({
	key: z.string().optional().describe('Filter by space key'),
	type: z
		.enum(['global', 'personal'])
		.optional()
		.describe('Filter by space type'),
	status: z
		.enum(['current', 'archived'])
		.optional()
		.describe('Filter by space status'),
	label: z.string().optional().describe('Filter by space label'),
	cursor: z.string().optional().describe('Pagination cursor'),
	limit: z
		.number()
		.int()
		.min(1)
		.max(250)
		.optional()
		.describe('Maximum number of spaces to return'),
});
export type SpacesListInput = z.infer<typeof SpacesListInputSchema>;

export const SpacesListResponseSchema = z.object({
	results: z.array(ConfluenceSpaceSchema),
	start: z.number().optional(),
	limit: z.number().optional(),
	size: z.number().optional(),
	_links: ConfluenceLinksSchema,
});
export type SpacesListResponse = z.infer<typeof SpacesListResponseSchema>;

export const PagesGetInputSchema = z.object({
	space_id: z.string().optional().describe('Filter by space ID'),
	title: z.string().optional().describe('Filter pages by title'),
	status: z
		.enum(['current', 'trashed', 'draft'])
		.optional()
		.describe('Filter pages by content status'),
	cursor: z.string().optional().describe('Pagination cursor'),
	limit: z
		.number()
		.int()
		.min(1)
		.max(250)
		.optional()
		.describe('Maximum number of pages to return'),
});
export type PagesGetInput = z.infer<typeof PagesGetInputSchema>;

export const PagesGetResponseSchema = z.object({
	results: z.array(ConfluencePageSchema),
	_links: z
		.object({
			next: z.string().optional(),
			base: z.string().optional(),
			self: z.string().optional(),
		})
		.optional(),
});
export type PagesGetResponse = z.infer<typeof PagesGetResponseSchema>;

export const ConfluenceSearchContentSchema = z.object({
	id: z.string(),
	type: z.string(),
	status: z.string().optional(),
	title: z.string(),
	childTypes: z.record(z.string(), z.unknown()).optional(),
	macroRenderedOutput: z.record(z.string(), z.unknown()).optional(),
	restrictions: z.record(z.string(), z.unknown()).optional(),
	_expandable: ConfluenceExpandableSchema,
	_links: z
		.object({
			webui: z.string().optional(),
			self: z.string().optional(),
			tinyui: z.string().optional(),
		})
		.optional(),
});

export const ConfluenceSearchResultSchema = z.object({
	content: ConfluenceSearchContentSchema,
	title: z.string(),
	excerpt: z.string().optional(),
	url: z.string().optional(),
	resultGlobalContainer: z
		.object({
			title: z.string(),
			displayUrl: z.string(),
		})
		.optional(),
	breadcrumbs: z.array(z.unknown()).optional(),
	entityType: z.string().optional(),
	iconCssClass: z.string().optional(),
	lastModified: z.string().optional(),
	friendlyLastModified: z.string().optional(),
	score: z.number().optional(),
});

export const PagesSearchInputSchema = z.object({
	cql: z.string().describe('Confluence Query Language (CQL) query string'),
	cqlcontext: z.string().optional().describe('Context for the CQL query'),
	includeArchivedSpaces: z
		.boolean()
		.optional()
		.describe('Include archived spaces in results'),
	limit: z
		.number()
		.int()
		.min(1)
		.max(250)
		.optional()
		.describe('Maximum results'),
	start: z
		.number()
		.int()
		.min(0)
		.optional()
		.describe('Pagination offset for the first result'),
});
export type PagesSearchInput = z.infer<typeof PagesSearchInputSchema>;

export const PagesSearchResponseSchema = z.object({
	results: z.array(ConfluenceSearchResultSchema),
	start: z.number(),
	limit: z.number(),
	size: z.number(),
	totalSize: z.number().optional(),
	cqlQuery: z.string().optional(),
	searchDuration: z.number().optional(),
	archivedResultCount: z.number().optional(),
	_links: z
		.object({
			base: z.string().optional(),
			context: z.string().optional(),
			self: z.string().optional(),
		})
		.optional(),
});
export type PagesSearchResponse = z.infer<typeof PagesSearchResponseSchema>;

export type ConfluenceEndpointInputs = {
	pagesGet: PagesGetInput;
	spacesList: SpacesListInput;
	pagesSearch: PagesSearchInput;
};

export type ConfluenceEndpointOutputs = {
	pagesGet: PagesGetResponse;
	spacesList: SpacesListResponse;
	pagesSearch: PagesSearchResponse;
};

export const ConfluenceEndpointInputSchemas = {
	pagesGet: PagesGetInputSchema,
	spacesList: SpacesListInputSchema,
	pagesSearch: PagesSearchInputSchema,
};

export const ConfluenceEndpointOutputSchemas = {
	pagesGet: PagesGetResponseSchema,
	spacesList: SpacesListResponseSchema,
	pagesSearch: PagesSearchResponseSchema,
};
