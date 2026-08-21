import { z } from 'zod';
import {
	AmcardsCard,
	AmcardsCategory,
	AmcardsContact,
	AmcardsGift,
	AmcardsPublicTemplate,
} from '../schema/database';

const PaginationInput = {
	skip: z
		.number()
		.int()
		.nonnegative()
		.optional()
		.describe('Rows to skip (sent as Tastypie/DRF `offset`)'),
	limit: z.number().int().positive().optional().describe('Page size'),
};

/**
 * AMcards list responses are Django REST (`results`) or Tastypie (`objects`).
 * A bare array is also accepted.
 */
function listResponse<T extends z.ZodType>(item: T) {
	return z.union([
		z.array(item),
		z
			.object({
				count: z.number().optional(),
				next: z.string().nullable().optional(),
				previous: z.string().nullable().optional(),
				results: z.array(item).optional(),
				meta: z
					.object({
						limit: z.number().optional(),
						next: z.string().nullable().optional(),
						offset: z.number().optional(),
						previous: z.string().nullable().optional(),
						total_count: z.number().optional(),
					})
					.loose()
					.optional(),
				objects: z.array(item).optional(),
			})
			.loose(),
	]);
}

const EmptyInputSchema = z.object({});

const GetApiSchemaInputSchema = EmptyInputSchema;
const GetCategorySchemaInputSchema = EmptyInputSchema;

const GetCardsInputSchema = z.object(PaginationInput);

const GetContactsInputSchema = z.object({
	...PaginationInput,
	email: z.string().optional().describe('Filter by email'),
	first_name: z.string().optional().describe('Filter by first name'),
	last_name: z.string().optional().describe('Filter by last name'),
});

const GetCategoryInputSchema = z.object({
	category_id: z.number().int().positive(),
});

const ListCategoriesInputSchema = z.object({
	parent__id: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('Filter sub-categories by parent id'),
	title__icontains: z
		.string()
		.optional()
		.describe('Case-insensitive title search'),
	parent__title__icontains: z
		.string()
		.optional()
		.describe('Case-insensitive parent title search'),
});

const GetGiftInputSchema = z.object({
	id: z.number().int().positive(),
});

const ListGiftsInputSchema = EmptyInputSchema;

const GetPublicTemplateInputSchema = z.object({
	id: z.number().int().positive(),
});

const ListPublicTemplatesInputSchema = z.object({
	category__id: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('Filter templates by category id'),
	name__icontains: z
		.string()
		.optional()
		.describe('Case-insensitive template name search'),
});

/** DRF API root or Tastypie/OpenAPI schema document. */
const GetApiSchemaResponseSchema = z.union([
	z.record(z.string(), z.unknown()),
	z.array(z.unknown()),
]);

/** Tastypie `{resource}/schema/` document. */
const GetCategorySchemaResponseSchema = z.record(z.string(), z.unknown());

export const AmcardsEndpointInputSchemas = {
	getApiSchema: GetApiSchemaInputSchema,
	getCategorySchema: GetCategorySchemaInputSchema,
	getCards: GetCardsInputSchema,
	getContacts: GetContactsInputSchema,
	getCategory: GetCategoryInputSchema,
	listCategories: ListCategoriesInputSchema,
	getGift: GetGiftInputSchema,
	listGifts: ListGiftsInputSchema,
	getPublicTemplate: GetPublicTemplateInputSchema,
	listPublicTemplates: ListPublicTemplatesInputSchema,
} as const;

export const AmcardsEndpointOutputSchemas = {
	getApiSchema: GetApiSchemaResponseSchema,
	getCategorySchema: GetCategorySchemaResponseSchema,
	getCards: listResponse(AmcardsCard),
	getContacts: listResponse(AmcardsContact),
	getCategory: AmcardsCategory,
	listCategories: listResponse(AmcardsCategory),
	getGift: AmcardsGift,
	listGifts: listResponse(AmcardsGift),
	getPublicTemplate: AmcardsPublicTemplate,
	listPublicTemplates: listResponse(AmcardsPublicTemplate),
} as const;

export type AmcardsEndpointInputs = {
	getApiSchema: z.infer<typeof GetApiSchemaInputSchema>;
	getCategorySchema: z.infer<typeof GetCategorySchemaInputSchema>;
	getCards: z.infer<typeof GetCardsInputSchema>;
	getContacts: z.infer<typeof GetContactsInputSchema>;
	getCategory: z.infer<typeof GetCategoryInputSchema>;
	listCategories: z.infer<typeof ListCategoriesInputSchema>;
	getGift: z.infer<typeof GetGiftInputSchema>;
	listGifts: z.infer<typeof ListGiftsInputSchema>;
	getPublicTemplate: z.infer<typeof GetPublicTemplateInputSchema>;
	listPublicTemplates: z.infer<typeof ListPublicTemplatesInputSchema>;
};

export type AmcardsEndpointOutputs = {
	getApiSchema: z.infer<typeof GetApiSchemaResponseSchema>;
	getCategorySchema: z.infer<typeof GetCategorySchemaResponseSchema>;
	getCards: z.infer<(typeof AmcardsEndpointOutputSchemas)['getCards']>;
	getContacts: z.infer<(typeof AmcardsEndpointOutputSchemas)['getContacts']>;
	getCategory: z.infer<typeof AmcardsCategory>;
	listCategories: z.infer<
		(typeof AmcardsEndpointOutputSchemas)['listCategories']
	>;
	getGift: z.infer<typeof AmcardsGift>;
	listGifts: z.infer<(typeof AmcardsEndpointOutputSchemas)['listGifts']>;
	getPublicTemplate: z.infer<typeof AmcardsPublicTemplate>;
	listPublicTemplates: z.infer<
		(typeof AmcardsEndpointOutputSchemas)['listPublicTemplates']
	>;
};
