import { z } from 'zod';
import {
	BestBuyCategoryEntity,
	BestBuyProductEntity,
	BestBuyReviewEntity,
	BestBuyStoreEntity,
} from '../schema/database';

const Page = z.number().int().min(1).optional();
const PageSize = z.number().int().min(1).max(100).optional();

/** Remix SKU is a long; accept the integer or string form and send a string. */
export const BestBuySku = z
	.union([z.string().regex(/^\d+$/), z.number().int().nonnegative()])
	.transform((value) => String(value));

const CollectionMeta = {
	from: z.number().optional(),
	to: z.number().optional(),
	total: z.number().optional(),
	currentPage: z.number().optional(),
	totalPages: z.number().optional(),
	queryTime: z.string().optional(),
	totalTime: z.string().optional(),
	partial: z.boolean().optional(),
	canonicalUrl: z.string().optional(),
};

export const GetProductsInputSchema = z.object({
	sku: BestBuySku.optional().describe('Filter for a specific SKU'),
	upc: z.string().optional().describe('Filter for a specific UPC'),
	name: z
		.string()
		.optional()
		.describe('Filter by product name with wildcard, e.g. iPad*'),
	salePrice: z
		.string()
		.optional()
		.describe("Filter by sale price, e.g. 'salePrice>100' or '>100'"),
	categoryPathId: z
		.string()
		.optional()
		.describe('Filter products by categoryPath.id'),
	page: Page.describe('Page number to retrieve (1-based)'),
	pageSize: PageSize.describe('Number of products per page (1-100)'),
	show: z
		.string()
		.optional()
		.describe('Comma-separated attributes to include, or all'),
	sort: z
		.string()
		.optional()
		.describe("Sort format, e.g. 'name.asc' or 'salePrice.dsc'"),
});

export const GetProductDetailsInputSchema = z.object({
	sku: BestBuySku.describe('The SKU of the product to retrieve'),
	show: z
		.string()
		.optional()
		.describe('Comma-separated attributes to include, or all'),
});

export const GetCategoriesInputSchema = z.object({
	id: z
		.string()
		.optional()
		.describe('Filter by category ID(s), pipe- or comma-separated'),
	name: z
		.string()
		.optional()
		.describe('Filter by category name(s), pipe- or comma-separated'),
	page: Page.describe('Page number to retrieve (1-based)'),
	pageSize: PageSize.describe('Number of categories per page (1-100)'),
	show: z
		.string()
		.optional()
		.describe('Comma-separated fields to include in each category'),
	sort: z
		.string()
		.optional()
		.describe("Sort order, e.g. 'name.asc' or 'id.dsc'"),
});

export const GetCategoryDetailsInputSchema = z.object({
	id: z.string().describe('The ID of the category to retrieve'),
	show: z
		.string()
		.optional()
		.describe('Comma-delimited list of fields to include'),
});

export const GetStoresInputSchema = z.object({
	geo: z
		.object({
			postalCode: z.string().trim().min(1).optional(),
			lat: z.number().optional(),
			lng: z.number().optional(),
			distance: z.number().positive().optional(),
		})
		.refine(
			(geo) =>
				Boolean(geo.postalCode) ||
				(geo.lat !== undefined && geo.lng !== undefined),
			{ message: 'geo requires postalCode or lat+lng' },
		)
		.optional()
		.describe(
			'Remix area(location,distance): postalCode or lat+lng; distance defaults to 10 miles',
		),
	city: z.string().optional().describe('Filter stores by city name'),
	state: z
		.string()
		.optional()
		.describe('Two-letter state code (maps to region)'),
	region: z.string().optional().describe('Filter stores by region / state'),
	storeId: z.number().int().optional().describe('Specific store ID'),
	postalCode: z.string().optional().describe('Filter stores by postal code'),
	storeType: z.string().optional().describe('Filter stores by store type'),
	services: z
		.string()
		.optional()
		.describe('Filter by services.service, comma-separated'),
	page: Page.describe('Page number to retrieve (must be > 0)'),
	pageSize: PageSize.describe('Number of results per page (1-100)'),
	show: z
		.string()
		.optional()
		.describe('Comma-separated store fields to include'),
	sort: z
		.string()
		.optional()
		.describe("Sort directive, e.g. 'city.asc' or 'name.dsc'"),
});

export const GetStoreDetailsInputSchema = z.object({
	storeId: z.string().describe('Unique identifier for the Best Buy store'),
	show: z
		.string()
		.optional()
		.describe('Comma-separated fields to include, or all for detailedHours'),
});

export const GetReviewsInputSchema = z.object({
	sku: BestBuySku.optional().describe('Filter reviews by product SKU'),
	reviewer: z.string().optional().describe('Filter reviews by reviewer name'),
	minScore: z
		.number()
		.int()
		.min(1)
		.max(5)
		.optional()
		.describe('Minimum rating score (1-5)'),
	maxScore: z
		.number()
		.int()
		.min(1)
		.max(5)
		.optional()
		.describe('Maximum rating score (1-5)'),
	page: Page.describe('Page number for pagination'),
	pageSize: PageSize.describe('Number of reviews per page (1-100)'),
	show: z.string().optional().describe('Comma-separated fields to include'),
	sort: z
		.string()
		.optional()
		.describe("Sort expression, e.g. 'submissionTime.dsc'"),
});

export const GetReviewDetailsInputSchema = z.object({
	id: z.string().describe('The unique identifier of the review to retrieve'),
	show: z.string().optional().describe('Comma-separated fields to include'),
});

export const GetProductsOutputSchema = z
	.object({
		...CollectionMeta,
		products: z.array(BestBuyProductEntity),
	})
	.loose();

export const GetCategoriesOutputSchema = z
	.object({
		...CollectionMeta,
		categories: z.array(BestBuyCategoryEntity),
	})
	.loose();

export const GetStoresOutputSchema = z
	.object({
		...CollectionMeta,
		stores: z.array(BestBuyStoreEntity),
	})
	.loose();

export const GetReviewsOutputSchema = z
	.object({
		...CollectionMeta,
		reviews: z.array(BestBuyReviewEntity),
	})
	.loose();

export type BestBuyEndpointInputs = {
	getProducts: z.input<typeof GetProductsInputSchema>;
	getProductDetails: z.input<typeof GetProductDetailsInputSchema>;
	getCategories: z.input<typeof GetCategoriesInputSchema>;
	getCategoryDetails: z.input<typeof GetCategoryDetailsInputSchema>;
	getStores: z.input<typeof GetStoresInputSchema>;
	getStoreDetails: z.input<typeof GetStoreDetailsInputSchema>;
	getReviews: z.input<typeof GetReviewsInputSchema>;
	getReviewDetails: z.input<typeof GetReviewDetailsInputSchema>;
};

export type BestBuyEndpointOutputs = {
	getProducts: z.infer<typeof GetProductsOutputSchema>;
	getProductDetails: z.infer<typeof BestBuyProductEntity>;
	getCategories: z.infer<typeof GetCategoriesOutputSchema>;
	getCategoryDetails: z.infer<typeof BestBuyCategoryEntity>;
	getStores: z.infer<typeof GetStoresOutputSchema>;
	getStoreDetails: z.infer<typeof BestBuyStoreEntity>;
	getReviews: z.infer<typeof GetReviewsOutputSchema>;
	getReviewDetails: z.infer<typeof BestBuyReviewEntity>;
};

export const BestBuyEndpointInputSchemas = {
	getProducts: GetProductsInputSchema,
	getProductDetails: GetProductDetailsInputSchema,
	getCategories: GetCategoriesInputSchema,
	getCategoryDetails: GetCategoryDetailsInputSchema,
	getStores: GetStoresInputSchema,
	getStoreDetails: GetStoreDetailsInputSchema,
	getReviews: GetReviewsInputSchema,
	getReviewDetails: GetReviewDetailsInputSchema,
} as const;

export const BestBuyEndpointOutputSchemas = {
	getProducts: GetProductsOutputSchema,
	getProductDetails: BestBuyProductEntity,
	getCategories: GetCategoriesOutputSchema,
	getCategoryDetails: BestBuyCategoryEntity,
	getStores: GetStoresOutputSchema,
	getStoreDetails: BestBuyStoreEntity,
	getReviews: GetReviewsOutputSchema,
	getReviewDetails: BestBuyReviewEntity,
} as const;
