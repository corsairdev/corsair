import { z } from 'zod';

const GetPageInputSchema = z.object({
	instanceGuid: z.string().min(1),
	locale: z.string().min(1),
	pageId: z.number().int().positive(),
	apiType: z.enum(['fetch', 'preview']).default('fetch'),
});

const GetItemInputSchema = z.object({
	instanceGuid: z.string().min(1),
	locale: z.string().min(1),
	contentId: z.number().int().positive(),
	apiType: z.enum(['fetch', 'preview']).default('fetch'),
});

const GetListInputSchema = z.object({
	instanceGuid: z.string().min(1),
	locale: z.string().min(1),
	referenceName: z.string().min(1),
	apiType: z.enum(['fetch', 'preview']).default('fetch'),
	contentLinkDepth: z.number().int().min(0).optional(),
	expandAllContentLinks: z.boolean().optional(),
	take: z.number().int().positive().optional(),
	skip: z.number().int().min(0).optional(),
	sort: z.string().optional(),
	filter: z.string().optional(),
});

const GetSitemapInputSchema = z.object({
	instanceGuid: z.string().min(1),
	locale: z.string().min(1),
	channelName: z.string().min(1),
	apiType: z.enum(['fetch', 'preview']).default('fetch'),
});

const GetContentModelsInputSchema = z.object({
	instanceGuid: z.string().min(1),
	locale: z.string().min(1),
	apiType: z.enum(['fetch', 'preview']).default('fetch'),
});

export type GetPageInput = z.infer<typeof GetPageInputSchema>;
export type GetItemInput = z.infer<typeof GetItemInputSchema>;
export type GetListInput = z.infer<typeof GetListInputSchema>;
export type GetSitemapInput = z.infer<typeof GetSitemapInputSchema>;
export type GetContentModelsInput = z.infer<typeof GetContentModelsInputSchema>;

export type AgilityCmsEndpointInputs = {
	getPage: GetPageInput;
	getItem: GetItemInput;
	getList: GetListInput;
	getSitemap: GetSitemapInput;
	getContentModels: GetContentModelsInput;
};

export type AgilityCmsEndpointOutputs = {
	getPage: Record<string, unknown>;
	getItem: Record<string, unknown>;
	getList: Record<string, unknown>;
	getSitemap: Record<string, unknown>;
	getContentModels: Record<string, unknown>;
};

export const AgilityCmsEndpointInputSchemas = {
	getPage: GetPageInputSchema,
	getItem: GetItemInputSchema,
	getList: GetListInputSchema,
	getSitemap: GetSitemapInputSchema,
	getContentModels: GetContentModelsInputSchema,
} as const;

export const AgilityCmsEndpointOutputSchemas = {
	getPage: z.record(z.string(), z.unknown()),
	getItem: z.record(z.string(), z.unknown()),
	getList: z.record(z.string(), z.unknown()),
	getSitemap: z.record(z.string(), z.unknown()),
	getContentModels: z.record(z.string(), z.unknown()),
} as const;
