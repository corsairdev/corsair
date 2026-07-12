import { z } from 'zod';

const ConfluenceLinksSchema = z.record(z.string(), z.string()).optional();
const ConfluenceExpandableSchema = z.record(z.string(), z.string()).optional();

export const ConfluenceSpaceSchema = z.object({
	id: z.number().optional(),
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
	parentId: z.string().optional(),
	parentType: z.string().optional(),
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
	start: z
		.number()
		.int()
		.min(0)
		.optional()
		.describe('Pagination offset for the first result'),
	limit: z
		.number()
		.int()
		.min(1)
		.max(250)
		.optional()
		.describe('Maximum number of spaces to return'),
	expand: z
		.string()
		.optional()
		.describe(
			'Comma-separated Confluence expansions, such as description.plain',
		),
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

export const PagesListInputSchema = z.object({
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
export type PagesListInput = z.infer<typeof PagesListInputSchema>;

export const PagesListResponseSchema = z.object({
	results: z.array(ConfluencePageSchema),
	_links: z
		.object({
			next: z.string().optional(),
			base: z.string().optional(),
			self: z.string().optional(),
		})
		.optional(),
});
export type PagesListResponse = z.infer<typeof PagesListResponseSchema>;

export type ConfluenceEndpointInputs = {
	pagesList: PagesListInput;
	spacesList: SpacesListInput;
};

export type ConfluenceEndpointOutputs = {
	pagesList: PagesListResponse;
	spacesList: SpacesListResponse;
};

export const ConfluenceEndpointInputSchemas = {
	pagesList: PagesListInputSchema,
	spacesList: SpacesListInputSchema,
};

export const ConfluenceEndpointOutputSchemas = {
	pagesList: PagesListResponseSchema,
	spacesList: SpacesListResponseSchema,
};
