import { z } from 'zod';
import { WixContact, WixOrder, WixProduct } from '../schema/database';

// ── shared primitives ──────────────────────────────────────────────────────

const SiteScopeFields = {
	siteId: z.string().optional(),
	accountId: z.string().optional(),
} as const;

const PagingSchema = z
	.object({
		limit: z.number().int().min(0).max(1000).optional(),
		offset: z.number().int().min(0).optional(),
	})
	.loose();

const SortItemSchema = z
	.object({
		fieldName: z.string(),
		order: z.enum(['ASC', 'DESC']).optional(),
	})
	.loose();

/**
 * Any JSON-encodable value. Wix request bodies are JSON, so nested patch and
 * filter operands are validated recursively as JSON — garbage such as
 * `undefined` values, functions, or class instances fails locally with a
 * deterministic error instead of reaching Wix.
 */
export type WixJson =
	| string
	| number
	| boolean
	| null
	| WixJson[]
	| { [key: string]: WixJson };
const WixJsonValueSchema: z.ZodType<WixJson> = z.lazy(() =>
	z.union([
		z.string(),
		z.number(),
		z.boolean(),
		z.null(),
		z.array(WixJsonValueSchema),
		z.record(z.string(), WixJsonValueSchema),
	]),
) as z.ZodType<WixJson>;

/**
 * Wix query-language filter. The Wix API Query Language supports two forms
 * per field path: scalar equality shorthand (`{ "status": "DONE" }`) and
 * explicit operator objects (`{ "status": { "$eq": "DONE" } }`). Logical
 * operators hold arrays (`$and`/`$or`) or a nested filter (`$not`). Only the
 * operators documented by the Wix API Query Language are accepted, and each
 * operator's operand is shape-checked (e.g. `$in` requires a non-empty array
 * of scalars, `$exists` requires a boolean) so JSON-valid but semantically
 * malformed filters fail local validation before reaching Wix.
 */
export type WixFilter = {
	[fieldPath: string]:
		| string
		| number
		| boolean
		| null
		| { [operator: string]: WixJson }
		| WixFilter;
};

function isWixFilterScalar(value: unknown): boolean {
	return (
		typeof value === 'string' ||
		typeof value === 'number' ||
		typeof value === 'boolean' ||
		value === null
	);
}

function isWixFilterOperand(operator: string, value: unknown): boolean {
	switch (operator) {
		case '$eq':
		case '$ne':
		case '$gt':
		case '$gte':
		case '$lt':
		case '$lte':
			return isWixFilterScalar(value);
		case '$in':
		case '$nin':
		case '$hasSome':
		case '$hasAll':
			return (
				Array.isArray(value) &&
				value.length > 0 &&
				value.every(isWixFilterScalar)
			);
		case '$startsWith':
		case '$endsWith':
		case '$contains':
			return typeof value === 'string';
		case '$urlized':
			// Documented operand: a single string that Wix URLizes before
			// comparing (e.g. 'ada-lovelace').
			return typeof value === 'string' && value.length > 0;
		case '$exists':
			return typeof value === 'boolean';
		default:
			return false;
	}
}

const WixLogicalArrayOperators = new Set(['$and', '$or']);
const WixLogicalSingleOperators = new Set(['$not']);

function isWixFilter(value: unknown): boolean {
	if (isWixFilterScalar(value)) {
		return true;
	}
	if (typeof value !== 'object' || value === null || Array.isArray(value)) {
		return false;
	}
	const entries = Object.entries(value as Record<string, unknown>);
	if (entries.length === 0) {
		return true;
	}
	for (const [key, operand] of entries) {
		if (key.startsWith('$')) {
			if (WixLogicalArrayOperators.has(key)) {
				if (
					!Array.isArray(operand) ||
					operand.length === 0 ||
					// Logical operands must be nested filter objects — a bare
					// scalar is not a filter expression.
					!operand.every(
						(el) =>
							typeof el === 'object' &&
							el !== null &&
							!Array.isArray(el) &&
							isWixFilter(el),
					)
				) {
					return false;
				}
			} else if (WixLogicalSingleOperators.has(key)) {
				if (
					typeof operand !== 'object' ||
					operand === null ||
					Array.isArray(operand) ||
					!isWixFilter(operand)
				) {
					return false;
				}
			} else if (isWixFilterOperand(key, operand)) {
				// Documented comparison/string/list operator — valid operand shape.
				continue;
			} else {
				// Unknown `$` operator or shape-invalid operand.
				return false;
			}
		} else if (!isWixFilter(operand)) {
			return false;
		}
	}
	return true;
}

const WixFilterSchema: z.ZodType<WixFilter> = z.lazy(() =>
	z.record(z.string(), WixJsonValueSchema).refine(isWixFilter, {
		message:
			'Not a valid Wix query-language filter: field paths must map to scalar equality shorthands or documented operators ($eq, $ne, $gt, $gte, $lt, $lte, $in, $nin, $hasSome, $hasAll, $startsWith, $endsWith, $contains, $urlized, $exists) with shape-valid operands; logical operators ($and, $or, $not) nest filters.',
	}),
) as z.ZodType<WixFilter>;

/**
 * Entity patch bodies (bulk `update` etc.) are objects keyed by field path
 * whose values must be JSON-encodable; Wix validates the actual fields
 * server-side.
 */
const WixEntityPatchSchema = z.record(z.string(), WixJsonValueSchema);

/**
 * Proto-style field mask used by Wix update endpoints.
 */
const FieldMaskSchema = z.looseObject({
	fields: z.array(z.string()).optional(),
});

const QueryOptionFields = {
	filter: WixFilterSchema.optional(),
	sort: z.array(SortItemSchema).optional(),
	paging: PagingSchema.optional(),
	limit: z.number().int().min(0).max(1000).optional(),
	offset: z.number().int().min(0).optional(),
	fields: z.array(z.string()).optional(),
	fieldsets: z.array(z.string()).optional(),
	search: z.string().optional(),
} as const;

const PagingMetadataSchema = z
	.object({
		count: z.number().optional(),
		offset: z.number().optional(),
		total: z.number().optional(),
		tooManyToCount: z.boolean().optional(),
	})
	.loose();

const BulkActionMetadataSchema = z
	.object({
		totalSuccesses: z.number().optional(),
		totalFailures: z.number().optional(),
		undetailedFailures: z.number().optional(),
	})
	.loose();

/**
 * Wix resources returned in query and bulk-action responses are objects
 * carrying string `id` and, when versioned, string `revision` fields
 * (int64 encoded). Typing them rejects malformed resource payloads while
 * tolerating resources that legitimately omit them. Wix response bodies are
 * JSON, so every item value is additionally validated recursively as JSON —
 * non-JSON garbage (functions, class instances, `undefined`) in nested
 * fields fails loudly instead of reaching consumers.
 */
const WixItemSchema = z
	.looseObject({
		id: z.string().optional(),
		revision: z.string().optional(),
	})
	.refine((item) => Object.values(item).every(isWixJson), {
		message: 'Wix item contains a non-JSON value',
	});

function isWixJson(value: unknown): boolean {
	if (
		value === null ||
		typeof value === 'string' ||
		typeof value === 'number' ||
		typeof value === 'boolean'
	) {
		return true;
	}
	if (Array.isArray(value)) {
		return value.every(isWixJson);
	}
	if (typeof value === 'object' && value !== null) {
		return Object.values(value).every(isWixJson);
	}
	return false;
}

/**
 * Typed entity schemas keep their field-level checks (e.g. `order.status`
 * must be a string) while retaining the recursive JSON-encodability
 * guarantee every item array provides.
 */
function typedItemSchema(schema: z.ZodTypeAny): z.ZodTypeAny {
	return schema.refine(
		(item) => Object.values(item as Record<string, unknown>).every(isWixJson),
		{
			message: 'Wix item contains a non-JSON value',
		},
	);
}

const WixContactItemSchema = typedItemSchema(WixContact);
const WixProductItemSchema = typedItemSchema(WixProduct);
const WixOrderItemSchema = typedItemSchema(WixOrder);

type WixQueryResponse<ItemsField extends string> = {
	[field in ItemsField]?: z.infer<typeof WixItemSchema>[];
} & {
	pagingMetadata?: z.infer<typeof PagingMetadataSchema>;
} & Record<string, unknown>;

/**
 * A computed `[itemsField]` key makes TypeScript widen the zod shape to a
 * string index signature, so consumers could not see e.g. `contacts` as an
 * array. The narrow assertion restores the literal-key output type; the
 * runtime loose-object parse behavior is unchanged.
 *
 * Endpoints whose resource type has a hand-written entity schema pass it as
 * `itemSchema` so known fields (e.g. `product.name`, `order.status`) are
 * type-checked, not just JSON-encodability-checked.
 */
function queryResponse<ItemsField extends string>(
	itemsField: ItemsField,
	itemSchema: z.ZodTypeAny = WixItemSchema,
): z.ZodType<WixQueryResponse<ItemsField>> {
	return z.looseObject({
		[itemsField]: z.array(itemSchema).optional(),
		pagingMetadata: PagingMetadataSchema.optional(),
	}) as unknown as z.ZodType<WixQueryResponse<ItemsField>>;
}

// ── contacts ───────────────────────────────────────────────────────────────

const QueryContactsInputSchema = z.looseObject({
	...SiteScopeFields,
	...QueryOptionFields,
});
export type QueryContactsInput = z.infer<typeof QueryContactsInputSchema>;
const QueryContactsResponseSchema = queryResponse(
	'contacts',
	WixContactItemSchema,
);
export type QueryContactsResponse = z.infer<typeof QueryContactsResponseSchema>;

const ListContactsInputSchema = z.looseObject({
	...SiteScopeFields,
	limit: z.number().int().min(0).max(1000).optional(),
	offset: z.number().int().min(0).optional(),
	fieldsets: z.array(z.string()).optional(),
	fields: z.array(z.string()).optional(),
});
export type ListContactsInput = z.infer<typeof ListContactsInputSchema>;
const ListContactsResponseSchema = queryResponse(
	'contacts',
	WixContactItemSchema,
);
export type ListContactsResponse = z.infer<typeof ListContactsResponseSchema>;

const BulkUpdateContactsInputSchema = z.looseObject({
	...SiteScopeFields,
	items: z.array(WixItemSchema).optional(),
	filter: WixFilterSchema.optional(),
	search: z.string().optional(),
	fieldMask: FieldMaskSchema.optional(),
});
export type BulkUpdateContactsInput = z.infer<
	typeof BulkUpdateContactsInputSchema
>;
const BulkUpdateContactsResponseSchema = z.looseObject({
	results: z.array(WixItemSchema).optional(),
	bulkActionMetadata: BulkActionMetadataSchema.optional(),
});
export type BulkUpdateContactsResponse = z.infer<
	typeof BulkUpdateContactsResponseSchema
>;

const AddContactLabelsInputSchema = z.looseObject({
	...SiteScopeFields,
	contactId: z.string(),
	labelKeys: z.array(z.string()).min(1),
});
export type AddContactLabelsInput = z.infer<typeof AddContactLabelsInputSchema>;
const AddContactLabelsResponseSchema = z.looseObject({
	id: z.string().optional(),
	revision: z.string().optional(),
});
export type AddContactLabelsResponse = z.infer<
	typeof AddContactLabelsResponseSchema
>;

const UnlabelContactInputSchema = z.looseObject({
	...SiteScopeFields,
	contactId: z.string(),
	labelKeys: z.array(z.string()).min(1),
});
export type UnlabelContactInput = z.infer<typeof UnlabelContactInputSchema>;
const UnlabelContactResponseSchema = z.looseObject({
	id: z.string().optional(),
	revision: z.string().optional(),
});
export type UnlabelContactResponse = z.infer<
	typeof UnlabelContactResponseSchema
>;

const ListContactsFacetsInputSchema = z.looseObject({ ...SiteScopeFields });
export type ListContactsFacetsInput = z.infer<
	typeof ListContactsFacetsInputSchema
>;
const ListContactsFacetsResponseSchema = z.looseObject({
	facets: z.array(WixItemSchema).optional(),
});
export type ListContactsFacetsResponse = z.infer<
	typeof ListContactsFacetsResponseSchema
>;

const QueryContactsFacetsInputSchema = z.looseObject({
	...SiteScopeFields,
	...QueryOptionFields,
});
export type QueryContactsFacetsInput = z.infer<
	typeof QueryContactsFacetsInputSchema
>;
const QueryContactsFacetsResponseSchema = z.looseObject({
	facets: z.array(WixItemSchema).optional(),
});
export type QueryContactsFacetsResponse = z.infer<
	typeof QueryContactsFacetsResponseSchema
>;

// ── stores ─────────────────────────────────────────────────────────────────

const SearchProductsInputSchema = z.looseObject({
	...SiteScopeFields,
	...QueryOptionFields,
});
export type SearchProductsInput = z.infer<typeof SearchProductsInputSchema>;
const SearchProductsResponseSchema = queryResponse(
	'products',
	WixProductItemSchema,
);
export type SearchProductsResponse = z.infer<
	typeof SearchProductsResponseSchema
>;

const QueryInventoryItemsInputSchema = z.looseObject({
	...SiteScopeFields,
	...QueryOptionFields,
});
export type QueryInventoryItemsInput = z.infer<
	typeof QueryInventoryItemsInputSchema
>;
const QueryInventoryItemsResponseSchema = queryResponse('inventoryItems');
export type QueryInventoryItemsResponse = z.infer<
	typeof QueryInventoryItemsResponseSchema
>;

const BulkDeleteProductsInputSchema = z.looseObject({
	...SiteScopeFields,
	ids: z.array(z.string()).min(1),
});
export type BulkDeleteProductsInput = z.infer<
	typeof BulkDeleteProductsInputSchema
>;
const BulkDeleteProductsResponseSchema = z.looseObject({
	results: z.array(WixItemSchema).optional(),
	bulkActionMetadata: BulkActionMetadataSchema.optional(),
});
export type BulkDeleteProductsResponse = z.infer<
	typeof BulkDeleteProductsResponseSchema
>;

const BulkDeleteInventoryItemsInputSchema = z.looseObject({
	...SiteScopeFields,
	ids: z.array(z.string()).min(1),
});
export type BulkDeleteInventoryItemsInput = z.infer<
	typeof BulkDeleteInventoryItemsInputSchema
>;
const BulkDeleteInventoryItemsResponseSchema = z.looseObject({
	results: z.array(WixItemSchema).optional(),
	bulkActionMetadata: BulkActionMetadataSchema.optional(),
});
export type BulkDeleteInventoryItemsResponse = z.infer<
	typeof BulkDeleteInventoryItemsResponseSchema
>;

const BulkDeleteBrandsInputSchema = z.looseObject({
	...SiteScopeFields,
	ids: z.array(z.string()).min(1),
});
export type BulkDeleteBrandsInput = z.infer<typeof BulkDeleteBrandsInputSchema>;
const BulkDeleteBrandsResponseSchema = z.looseObject({
	results: z.array(WixItemSchema).optional(),
	bulkActionMetadata: BulkActionMetadataSchema.optional(),
});
export type BulkDeleteBrandsResponse = z.infer<
	typeof BulkDeleteBrandsResponseSchema
>;

const BulkGetOrCreateBrandsInputSchema = z.looseObject({
	...SiteScopeFields,
	names: z.array(z.string()).min(1),
});
export type BulkGetOrCreateBrandsInput = z.infer<
	typeof BulkGetOrCreateBrandsInputSchema
>;
const BulkGetOrCreateBrandsResponseSchema = z.looseObject({
	brands: z.array(WixItemSchema).optional(),
});
export type BulkGetOrCreateBrandsResponse = z.infer<
	typeof BulkGetOrCreateBrandsResponseSchema
>;

const BulkUpdateProductsByFilterInputSchema = z.looseObject({
	...SiteScopeFields,
	filter: WixFilterSchema,
	update: WixEntityPatchSchema.optional(),
	fields: z.array(z.string()).optional(),
});
export type BulkUpdateProductsByFilterInput = z.infer<
	typeof BulkUpdateProductsByFilterInputSchema
>;
const BulkUpdateProductsByFilterResponseSchema = z.looseObject({
	results: z.array(WixItemSchema).optional(),
	bulkActionMetadata: BulkActionMetadataSchema.optional(),
});
export type BulkUpdateProductsByFilterResponse = z.infer<
	typeof BulkUpdateProductsByFilterResponseSchema
>;

const BulkUpdateInventoryItemsByFilterInputSchema = z.looseObject({
	...SiteScopeFields,
	filter: WixFilterSchema,
	update: WixEntityPatchSchema.optional(),
});
export type BulkUpdateInventoryItemsByFilterInput = z.infer<
	typeof BulkUpdateInventoryItemsByFilterInputSchema
>;
const BulkUpdateInventoryItemsByFilterResponseSchema = z.looseObject({
	results: z.array(WixItemSchema).optional(),
	bulkActionMetadata: BulkActionMetadataSchema.optional(),
});
export type BulkUpdateInventoryItemsByFilterResponse = z.infer<
	typeof BulkUpdateInventoryItemsByFilterResponseSchema
>;

const BulkUpdateCustomizationsInputSchema = z.looseObject({
	...SiteScopeFields,
	updates: z.array(WixItemSchema).min(1),
});
export type BulkUpdateCustomizationsInput = z.infer<
	typeof BulkUpdateCustomizationsInputSchema
>;
const BulkUpdateCustomizationsResponseSchema = z.looseObject({
	results: z.array(WixItemSchema).optional(),
	bulkActionMetadata: BulkActionMetadataSchema.optional(),
});
export type BulkUpdateCustomizationsResponse = z.infer<
	typeof BulkUpdateCustomizationsResponseSchema
>;

const BulkCreateProductsWithInventoryInputSchema = z.looseObject({
	...SiteScopeFields,
	products: z.array(WixProductItemSchema).min(1).max(100),
});
export type BulkCreateProductsWithInventoryInput = z.infer<
	typeof BulkCreateProductsWithInventoryInputSchema
>;
const BulkCreateProductsWithInventoryResponseSchema = z.looseObject({
	results: z.array(WixItemSchema).optional(),
	bulkActionMetadata: BulkActionMetadataSchema.optional(),
});
export type BulkCreateProductsWithInventoryResponse = z.infer<
	typeof BulkCreateProductsWithInventoryResponseSchema
>;

const BulkRemoveInfoSectionsByFilterInputSchema = z.looseObject({
	...SiteScopeFields,
	filter: WixFilterSchema,
	infoSectionIds: z.array(z.string()).min(1),
});
export type BulkRemoveInfoSectionsByFilterInput = z.infer<
	typeof BulkRemoveInfoSectionsByFilterInputSchema
>;
const BulkRemoveInfoSectionsByFilterResponseSchema = z.looseObject({
	results: z.array(WixItemSchema).optional(),
	bulkActionMetadata: BulkActionMetadataSchema.optional(),
});
export type BulkRemoveInfoSectionsByFilterResponse = z.infer<
	typeof BulkRemoveInfoSectionsByFilterResponseSchema
>;

const DeleteCustomizationInputSchema = z.looseObject({
	...SiteScopeFields,
	customizationId: z.string(),
});
export type DeleteCustomizationInput = z.infer<
	typeof DeleteCustomizationInputSchema
>;
const DeleteCustomizationResponseSchema = z.looseObject({});
export type DeleteCustomizationResponse = z.infer<
	typeof DeleteCustomizationResponseSchema
>;

const DeleteInfoSectionInputSchema = z.looseObject({
	...SiteScopeFields,
	infoSectionId: z.string(),
});
export type DeleteInfoSectionInput = z.infer<
	typeof DeleteInfoSectionInputSchema
>;
const DeleteInfoSectionResponseSchema = z.looseObject({});
export type DeleteInfoSectionResponse = z.infer<
	typeof DeleteInfoSectionResponseSchema
>;

const DeleteProductOptionsInputSchema = z.looseObject({
	...SiteScopeFields,
	productId: z.string(),
});
export type DeleteProductOptionsInput = z.infer<
	typeof DeleteProductOptionsInputSchema
>;
const DeleteProductOptionsResponseSchema = z.looseObject({
	id: z.string().optional(),
	revision: z.string().optional(),
});
export type DeleteProductOptionsResponse = z.infer<
	typeof DeleteProductOptionsResponseSchema
>;

const SetCustomizationChoicesInputSchema = z.looseObject({
	...SiteScopeFields,
	customizationId: z.string(),
	choices: z.array(WixItemSchema).min(1),
});
export type SetCustomizationChoicesInput = z.infer<
	typeof SetCustomizationChoicesInputSchema
>;
const SetCustomizationChoicesResponseSchema = z.looseObject({
	id: z.string().optional(),
	revision: z.string().optional(),
});
export type SetCustomizationChoicesResponse = z.infer<
	typeof SetCustomizationChoicesResponseSchema
>;

const UpdateInventoryVariantsInputSchema = z.looseObject({
	...SiteScopeFields,
	updates: z.array(WixItemSchema).min(1),
});
export type UpdateInventoryVariantsInput = z.infer<
	typeof UpdateInventoryVariantsInputSchema
>;
const UpdateInventoryVariantsResponseSchema = z.looseObject({
	results: z.array(WixItemSchema).optional(),
	bulkActionMetadata: BulkActionMetadataSchema.optional(),
});
export type UpdateInventoryVariantsResponse = z.infer<
	typeof UpdateInventoryVariantsResponseSchema
>;

const GetCollectionBySlugInputSchema = z.looseObject({
	...SiteScopeFields,
	slug: z.string(),
});
export type GetCollectionBySlugInput = z.infer<
	typeof GetCollectionBySlugInputSchema
>;
const GetCollectionBySlugResponseSchema = z.looseObject({
	id: z.string().optional(),
	slug: z.string().optional(),
	name: z.string().optional(),
});
export type GetCollectionBySlugResponse = z.infer<
	typeof GetCollectionBySlugResponseSchema
>;

const ListCurrenciesInputSchema = z.looseObject({ ...SiteScopeFields });
export type ListCurrenciesInput = z.infer<typeof ListCurrenciesInputSchema>;
const ListCurrenciesResponseSchema = z.looseObject({
	currencies: z.array(WixItemSchema).optional(),
});
export type ListCurrenciesResponse = z.infer<
	typeof ListCurrenciesResponseSchema
>;

const QueryCouponsInputSchema = z.looseObject({
	...SiteScopeFields,
	...QueryOptionFields,
});
export type QueryCouponsInput = z.infer<typeof QueryCouponsInputSchema>;
const QueryCouponsResponseSchema = queryResponse('coupons');
export type QueryCouponsResponse = z.infer<typeof QueryCouponsResponseSchema>;

const DeleteBackInStockNotificationInputSchema = z.looseObject({
	...SiteScopeFields,
	notificationId: z.string(),
});
export type DeleteBackInStockNotificationInput = z.infer<
	typeof DeleteBackInStockNotificationInputSchema
>;
const DeleteBackInStockNotificationResponseSchema = z.looseObject({});
export type DeleteBackInStockNotificationResponse = z.infer<
	typeof DeleteBackInStockNotificationResponseSchema
>;

// ── orders ─────────────────────────────────────────────────────────────────

const QueryEcomOrdersInputSchema = z.looseObject({
	...SiteScopeFields,
	...QueryOptionFields,
});
export type QueryEcomOrdersInput = z.infer<typeof QueryEcomOrdersInputSchema>;
const QueryEcomOrdersResponseSchema = queryResponse(
	'orders',
	WixOrderItemSchema,
);
export type QueryEcomOrdersResponse = z.infer<
	typeof QueryEcomOrdersResponseSchema
>;

const BulkUpdateOrdersInputSchema = z.looseObject({
	...SiteScopeFields,
	updates: z.array(WixItemSchema).min(1).max(100),
});
export type BulkUpdateOrdersInput = z.infer<typeof BulkUpdateOrdersInputSchema>;
const BulkUpdateOrdersResponseSchema = z.looseObject({
	results: z.array(WixItemSchema).optional(),
	bulkActionMetadata: BulkActionMetadataSchema.optional(),
});
export type BulkUpdateOrdersResponse = z.infer<
	typeof BulkUpdateOrdersResponseSchema
>;

const BulkUpdateOrderTagsInputSchema = z.looseObject({
	...SiteScopeFields,
	orderIds: z.array(z.string()).min(1),
	assignTags: z.array(z.string()).optional(),
	unassignTags: z.array(z.string()).optional(),
});
export type BulkUpdateOrderTagsInput = z.infer<
	typeof BulkUpdateOrderTagsInputSchema
>;
const BulkUpdateOrderTagsResponseSchema = z.looseObject({
	results: z.array(WixItemSchema).optional(),
});
export type BulkUpdateOrderTagsResponse = z.infer<
	typeof BulkUpdateOrderTagsResponseSchema
>;

const RemoveTipFromOrderInputSchema = z.looseObject({
	...SiteScopeFields,
	orderId: z.string(),
});
export type RemoveTipFromOrderInput = z.infer<
	typeof RemoveTipFromOrderInputSchema
>;
const RemoveTipFromOrderResponseSchema = z.looseObject({
	id: z.string().optional(),
	revision: z.string().optional(),
});
export type RemoveTipFromOrderResponse = z.infer<
	typeof RemoveTipFromOrderResponseSchema
>;

const BulkDeleteAbandonedCheckoutsInputSchema = z.looseObject({
	...SiteScopeFields,
	ids: z.array(z.string()).min(1),
});
export type BulkDeleteAbandonedCheckoutsInput = z.infer<
	typeof BulkDeleteAbandonedCheckoutsInputSchema
>;
const BulkDeleteAbandonedCheckoutsResponseSchema = z.looseObject({
	results: z.array(WixItemSchema).optional(),
	bulkActionMetadata: BulkActionMetadataSchema.optional(),
});
export type BulkDeleteAbandonedCheckoutsResponse = z.infer<
	typeof BulkDeleteAbandonedCheckoutsResponseSchema
>;

const ListInvoicesByOrderIdsInputSchema = z.looseObject({
	...SiteScopeFields,
	orderIds: z.array(z.string()).min(1),
});
export type ListInvoicesByOrderIdsInput = z.infer<
	typeof ListInvoicesByOrderIdsInputSchema
>;
const ListInvoicesByOrderIdsResponseSchema = z.looseObject({
	invoices: z.array(WixItemSchema).optional(),
});
export type ListInvoicesByOrderIdsResponse = z.infer<
	typeof ListInvoicesByOrderIdsResponseSchema
>;

// ── bookings ───────────────────────────────────────────────────────────────

const QueryBookingsCategoriesInputSchema = z.looseObject({
	...SiteScopeFields,
	...QueryOptionFields,
});
export type QueryBookingsCategoriesInput = z.infer<
	typeof QueryBookingsCategoriesInputSchema
>;
const QueryBookingsCategoriesResponseSchema = queryResponse('categories');
export type QueryBookingsCategoriesResponse = z.infer<
	typeof QueryBookingsCategoriesResponseSchema
>;

const DeleteBookingsServiceInputSchema = z.looseObject({
	...SiteScopeFields,
	serviceId: z.string(),
});
export type DeleteBookingsServiceInput = z.infer<
	typeof DeleteBookingsServiceInputSchema
>;
const DeleteBookingsServiceResponseSchema = z.looseObject({});
export type DeleteBookingsServiceResponse = z.infer<
	typeof DeleteBookingsServiceResponseSchema
>;

const BulkDeleteBookingsServicesInputSchema = z.looseObject({
	...SiteScopeFields,
	ids: z.array(z.string()).min(1),
});
export type BulkDeleteBookingsServicesInput = z.infer<
	typeof BulkDeleteBookingsServicesInputSchema
>;
const BulkDeleteBookingsServicesResponseSchema = z.looseObject({
	results: z.array(WixItemSchema).optional(),
	bulkActionMetadata: BulkActionMetadataSchema.optional(),
});
export type BulkDeleteBookingsServicesResponse = z.infer<
	typeof BulkDeleteBookingsServicesResponseSchema
>;

const BulkDeleteBookingsServicesByFilterInputSchema = z.looseObject({
	...SiteScopeFields,
	filter: WixFilterSchema,
});
export type BulkDeleteBookingsServicesByFilterInput = z.infer<
	typeof BulkDeleteBookingsServicesByFilterInputSchema
>;
const BulkDeleteBookingsServicesByFilterResponseSchema = z.looseObject({
	results: z.array(WixItemSchema).optional(),
	bulkActionMetadata: BulkActionMetadataSchema.optional(),
});
export type BulkDeleteBookingsServicesByFilterResponse = z.infer<
	typeof BulkDeleteBookingsServicesByFilterResponseSchema
>;

const DeleteBookingsAddOnGroupInputSchema = z.looseObject({
	...SiteScopeFields,
	serviceId: z.string(),
	addOnGroupId: z.string(),
});
export type DeleteBookingsAddOnGroupInput = z.infer<
	typeof DeleteBookingsAddOnGroupInputSchema
>;
const DeleteBookingsAddOnGroupResponseSchema = z.looseObject({});
export type DeleteBookingsAddOnGroupResponse = z.infer<
	typeof DeleteBookingsAddOnGroupResponseSchema
>;

const QueryExtendedBookingsInputSchema = z.looseObject({
	...SiteScopeFields,
	...QueryOptionFields,
});
export type QueryExtendedBookingsInput = z.infer<
	typeof QueryExtendedBookingsInputSchema
>;
const QueryExtendedBookingsResponseSchema = queryResponse('bookings');
export type QueryExtendedBookingsResponse = z.infer<
	typeof QueryExtendedBookingsResponseSchema
>;

const CountExtendedBookingsInputSchema = z.looseObject({
	...SiteScopeFields,
	// Documented request body: `{ "filter": {...} }` at the top level —
	// this count endpoint does not use the `{ query: {...} }` envelope.
	filter: WixFilterSchema.optional(),
});
export type CountExtendedBookingsInput = z.infer<
	typeof CountExtendedBookingsInputSchema
>;
const CountExtendedBookingsResponseSchema = z.looseObject({
	count: z.number().optional(),
});
export type CountExtendedBookingsResponse = z.infer<
	typeof CountExtendedBookingsResponseSchema
>;

const ListBookingsSessionsInputSchema = z.looseObject({
	...SiteScopeFields,
	limit: z.number().int().min(0).optional(),
	offset: z.number().int().min(0).optional(),
});
export type ListBookingsSessionsInput = z.infer<
	typeof ListBookingsSessionsInputSchema
>;
const ListBookingsSessionsResponseSchema = queryResponse('sessions');
export type ListBookingsSessionsResponse = z.infer<
	typeof ListBookingsSessionsResponseSchema
>;

const UpdateStaffMemberTagsByFilterInputSchema = z.looseObject({
	...SiteScopeFields,
	filter: WixFilterSchema,
	assignTags: z.array(z.string()).optional(),
	unassignTags: z.array(z.string()).optional(),
});
export type UpdateStaffMemberTagsByFilterInput = z.infer<
	typeof UpdateStaffMemberTagsByFilterInputSchema
>;
const UpdateStaffMemberTagsByFilterResponseSchema = z.looseObject({
	results: z.array(WixItemSchema).optional(),
	bulkActionMetadata: BulkActionMetadataSchema.optional(),
});
export type UpdateStaffMemberTagsByFilterResponse = z.infer<
	typeof UpdateStaffMemberTagsByFilterResponseSchema
>;

// ── members ────────────────────────────────────────────────────────────────

const GetMemberInputSchema = z.looseObject({
	...SiteScopeFields,
	memberId: z.string(),
});
export type GetMemberInput = z.infer<typeof GetMemberInputSchema>;
const GetMemberResponseSchema = z.looseObject({
	id: z.string().optional(),
	contactId: z.string().optional(),
	status: z.string().optional(),
});
export type GetMemberResponse = z.infer<typeof GetMemberResponseSchema>;

const GetMemberPrivacySettingsInputSchema = z.looseObject({
	...SiteScopeFields,
});
export type GetMemberPrivacySettingsInput = z.infer<
	typeof GetMemberPrivacySettingsInputSchema
>;
const GetMemberPrivacySettingsResponseSchema = z.looseObject({
	publicProfile: z.boolean().optional(),
});
export type GetMemberPrivacySettingsResponse = z.infer<
	typeof GetMemberPrivacySettingsResponseSchema
>;

const GetMembersCustomFieldApplicationsInputSchema = z.looseObject({
	...SiteScopeFields,
	memberIds: z.array(z.string()).min(1),
});
export type GetMembersCustomFieldApplicationsInput = z.infer<
	typeof GetMembersCustomFieldApplicationsInputSchema
>;
const GetMembersCustomFieldApplicationsResponseSchema = z.looseObject({
	applications: z.array(WixItemSchema).optional(),
});
export type GetMembersCustomFieldApplicationsResponse = z.infer<
	typeof GetMembersCustomFieldApplicationsResponseSchema
>;

const GetRolesCustomFieldApplicationsInputSchema = z.looseObject({
	...SiteScopeFields,
	roleIds: z.array(z.string()).min(1),
});
export type GetRolesCustomFieldApplicationsInput = z.infer<
	typeof GetRolesCustomFieldApplicationsInputSchema
>;
const GetRolesCustomFieldApplicationsResponseSchema = z.looseObject({
	applications: z.array(WixItemSchema).optional(),
});
export type GetRolesCustomFieldApplicationsResponse = z.infer<
	typeof GetRolesCustomFieldApplicationsResponseSchema
>;

const GetRolesInfoInputSchema = z.looseObject({ ...SiteScopeFields });
export type GetRolesInfoInput = z.infer<typeof GetRolesInfoInputSchema>;
const GetRolesInfoResponseSchema = z.looseObject({
	roles: z.array(WixItemSchema).optional(),
});
export type GetRolesInfoResponse = z.infer<typeof GetRolesInfoResponseSchema>;

const ListMembersCustomFieldsInputSchema = z.looseObject({
	...SiteScopeFields,
	limit: z.number().int().min(0).optional(),
	offset: z.number().int().min(0).optional(),
});
export type ListMembersCustomFieldsInput = z.infer<
	typeof ListMembersCustomFieldsInputSchema
>;
const ListMembersCustomFieldsResponseSchema = queryResponse('customFields');
export type ListMembersCustomFieldsResponse = z.infer<
	typeof ListMembersCustomFieldsResponseSchema
>;

const ListMemberFollowingInputSchema = z.looseObject({
	...SiteScopeFields,
	memberId: z.string(),
	limit: z.number().int().min(0).optional(),
	offset: z.number().int().min(0).optional(),
});
export type ListMemberFollowingInput = z.infer<
	typeof ListMemberFollowingInputSchema
>;
const ListMemberFollowingResponseSchema = queryResponse('members');
export type ListMemberFollowingResponse = z.infer<
	typeof ListMemberFollowingResponseSchema
>;

const ListMyMemberFollowersInputSchema = z.looseObject({
	...SiteScopeFields,
	limit: z.number().int().min(0).optional(),
	offset: z.number().int().min(0).optional(),
});
export type ListMyMemberFollowersInput = z.infer<
	typeof ListMyMemberFollowersInputSchema
>;
const ListMyMemberFollowersResponseSchema = queryResponse('members');
export type ListMyMemberFollowersResponse = z.infer<
	typeof ListMyMemberFollowersResponseSchema
>;

const RegisterMemberV2InputSchema = z.looseObject({
	...SiteScopeFields,
	email: z.string(),
	password: z.string(),
});
export type RegisterMemberV2Input = z.infer<typeof RegisterMemberV2InputSchema>;
const RegisterMemberV2ResponseSchema = z.looseObject({
	sessionToken: z.string().optional(),
	member: z.looseObject({}).optional(),
});
export type RegisterMemberV2Response = z.infer<
	typeof RegisterMemberV2ResponseSchema
>;

const LogoutMemberInputSchema = z.looseObject({
	...SiteScopeFields,
	postLogoutRedirectUri: z.string().optional(),
});
export type LogoutMemberInput = z.infer<typeof LogoutMemberInputSchema>;
const LogoutMemberResponseSchema = z.looseObject({});
export type LogoutMemberResponse = z.infer<typeof LogoutMemberResponseSchema>;

const SendMemberRecoveryEmailInputSchema = z.looseObject({
	...SiteScopeFields,
	email: z.string(),
});
export type SendMemberRecoveryEmailInput = z.infer<
	typeof SendMemberRecoveryEmailInputSchema
>;
const SendMemberRecoveryEmailResponseSchema = z.looseObject({});
export type SendMemberRecoveryEmailResponse = z.infer<
	typeof SendMemberRecoveryEmailResponseSchema
>;

// ── sites ──────────────────────────────────────────────────────────────────

const GetSitePropertiesInputSchema = z.looseObject({ ...SiteScopeFields });
export type GetSitePropertiesInput = z.infer<
	typeof GetSitePropertiesInputSchema
>;
const GetSitePropertiesResponseSchema = z.looseObject({
	siteId: z.string().optional(),
	businessProfile: z.looseObject({}).optional(),
	businessContact: z.looseObject({}).optional(),
	businessSchedule: z.looseObject({}).optional(),
});
export type GetSitePropertiesResponse = z.infer<
	typeof GetSitePropertiesResponseSchema
>;

const UpdateBusinessContactInputSchema = z.looseObject({
	...SiteScopeFields,
	businessContact: z.looseObject({}).optional(),
});
export type UpdateBusinessContactInput = z.infer<
	typeof UpdateBusinessContactInputSchema
>;
const UpdateBusinessContactResponseSchema = z.looseObject({
	businessContact: z.looseObject({}).optional(),
});
export type UpdateBusinessContactResponse = z.infer<
	typeof UpdateBusinessContactResponseSchema
>;

const UpdateBusinessProfileInputSchema = z.looseObject({
	...SiteScopeFields,
	businessProfile: z.looseObject({}).optional(),
	fields: z.looseObject({}).optional(),
});
export type UpdateBusinessProfileInput = z.infer<
	typeof UpdateBusinessProfileInputSchema
>;
const UpdateBusinessProfileResponseSchema = z.looseObject({
	businessProfile: z.looseObject({}).optional(),
});
export type UpdateBusinessProfileResponse = z.infer<
	typeof UpdateBusinessProfileResponseSchema
>;

const UpdateBusinessScheduleInputSchema = z.looseObject({
	...SiteScopeFields,
	businessSchedule: z.looseObject({}).optional(),
});
export type UpdateBusinessScheduleInput = z.infer<
	typeof UpdateBusinessScheduleInputSchema
>;
const UpdateBusinessScheduleResponseSchema = z.looseObject({
	businessSchedule: z.looseObject({}).optional(),
});
export type UpdateBusinessScheduleResponse = z.infer<
	typeof UpdateBusinessScheduleResponseSchema
>;

const UpdateLocaleSettingsInputSchema = z.looseObject({
	...SiteScopeFields,
	localeSettings: z.looseObject({}).optional(),
});
export type UpdateLocaleSettingsInput = z.infer<
	typeof UpdateLocaleSettingsInputSchema
>;
const UpdateLocaleSettingsResponseSchema = z.looseObject({
	localeSettings: z.looseObject({}).optional(),
});
export type UpdateLocaleSettingsResponse = z.infer<
	typeof UpdateLocaleSettingsResponseSchema
>;

const CheckDomainAvailabilityInputSchema = z.looseObject({
	...SiteScopeFields,
	domainName: z.string(),
});
export type CheckDomainAvailabilityInput = z.infer<
	typeof CheckDomainAvailabilityInputSchema
>;
const CheckDomainAvailabilityResponseSchema = z.looseObject({
	available: z.boolean().optional(),
	domainName: z.string().optional(),
});
export type CheckDomainAvailabilityResponse = z.infer<
	typeof CheckDomainAvailabilityResponseSchema
>;

const GetFolderBySiteInputSchema = z.looseObject({
	...SiteScopeFields,
	// Path parameter for /site-folders/v2/folders/sites/{targetSiteId}.
	// Named distinctly from the `siteId` scope field so the site whose
	// folder is fetched is independent of the request's scope headers:
	// the same input drives both a path segment and a scope header when
	// they share a name, which blocks account-scoped calls.
	targetSiteId: z.string(),
});
export type GetFolderBySiteInput = z.infer<typeof GetFolderBySiteInputSchema>;
const GetFolderBySiteResponseSchema = z.looseObject({
	folder: z.looseObject({}).optional(),
});
export type GetFolderBySiteResponse = z.infer<
	typeof GetFolderBySiteResponseSchema
>;

const QuerySiteFoldersInputSchema = z.looseObject({
	...SiteScopeFields,
	...QueryOptionFields,
});
export type QuerySiteFoldersInput = z.infer<typeof QuerySiteFoldersInputSchema>;
const QuerySiteFoldersResponseSchema = queryResponse('folders');
export type QuerySiteFoldersResponse = z.infer<
	typeof QuerySiteFoldersResponseSchema
>;

const QueryLocationsInputSchema = z.looseObject({
	...SiteScopeFields,
	...QueryOptionFields,
});
export type QueryLocationsInput = z.infer<typeof QueryLocationsInputSchema>;
const QueryLocationsResponseSchema = queryResponse('locations');
export type QueryLocationsResponse = z.infer<
	typeof QueryLocationsResponseSchema
>;

const GetSitePluginsPlacementStatusInputSchema = z.looseObject({
	...SiteScopeFields,
});
export type GetSitePluginsPlacementStatusInput = z.infer<
	typeof GetSitePluginsPlacementStatusInputSchema
>;
const GetSitePluginsPlacementStatusResponseSchema = z.looseObject({
	placements: z.array(WixItemSchema).optional(),
});
export type GetSitePluginsPlacementStatusResponse = z.infer<
	typeof GetSitePluginsPlacementStatusResponseSchema
>;

// ── marketing ──────────────────────────────────────────────────────────────

const ListEmailCampaignsInputSchema = z.looseObject({
	...SiteScopeFields,
	status: z.string().optional(),
	limit: z.number().int().min(0).optional(),
	offset: z.number().int().min(0).optional(),
});
export type ListEmailCampaignsInput = z.infer<
	typeof ListEmailCampaignsInputSchema
>;
const ListEmailCampaignsResponseSchema = queryResponse('campaigns');
export type ListEmailCampaignsResponse = z.infer<
	typeof ListEmailCampaignsResponseSchema
>;

const GetSenderDetailsInputSchema = z.looseObject({ ...SiteScopeFields });
export type GetSenderDetailsInput = z.infer<typeof GetSenderDetailsInputSchema>;
const GetSenderDetailsResponseSchema = z.looseObject({
	name: z.string().optional(),
	email: z.string().optional(),
});
export type GetSenderDetailsResponse = z.infer<
	typeof GetSenderDetailsResponseSchema
>;

const DeleteSenderDetailsInputSchema = z.looseObject({
	...SiteScopeFields,
	senderId: z.string(),
});
export type DeleteSenderDetailsInput = z.infer<
	typeof DeleteSenderDetailsInputSchema
>;
const DeleteSenderDetailsResponseSchema = z.looseObject({});
export type DeleteSenderDetailsResponse = z.infer<
	typeof DeleteSenderDetailsResponseSchema
>;

const DeleteSenderEmailInputSchema = z.looseObject({
	...SiteScopeFields,
	emailId: z.string(),
});
export type DeleteSenderEmailInput = z.infer<
	typeof DeleteSenderEmailInputSchema
>;
const DeleteSenderEmailResponseSchema = z.looseObject({});
export type DeleteSenderEmailResponse = z.infer<
	typeof DeleteSenderEmailResponseSchema
>;

const UpdateReferralProgramInputSchema = z.looseObject({
	...SiteScopeFields,
	revision: z.string().optional(),
	program: z.looseObject({}).optional(),
});
export type UpdateReferralProgramInput = z.infer<
	typeof UpdateReferralProgramInputSchema
>;
const UpdateReferralProgramResponseSchema = z.looseObject({
	program: z.looseObject({}).optional(),
});
export type UpdateReferralProgramResponse = z.infer<
	typeof UpdateReferralProgramResponseSchema
>;

const GetCurrentMemberCouponsInputSchema = z.looseObject({
	...SiteScopeFields,
});
export type GetCurrentMemberCouponsInput = z.infer<
	typeof GetCurrentMemberCouponsInputSchema
>;
const GetCurrentMemberCouponsResponseSchema = z.looseObject({
	coupons: z.array(WixItemSchema).optional(),
});
export type GetCurrentMemberCouponsResponse = z.infer<
	typeof GetCurrentMemberCouponsResponseSchema
>;

const DeleteLoyaltyCouponInputSchema = z.looseObject({
	...SiteScopeFields,
	couponId: z.string(),
});
export type DeleteLoyaltyCouponInput = z.infer<
	typeof DeleteLoyaltyCouponInputSchema
>;
const DeleteLoyaltyCouponResponseSchema = z.looseObject({});
export type DeleteLoyaltyCouponResponse = z.infer<
	typeof DeleteLoyaltyCouponResponseSchema
>;

const EnablePointsExpirationInputSchema = z.looseObject({
	...SiteScopeFields,
	programId: z.string().optional(),
});
export type EnablePointsExpirationInput = z.infer<
	typeof EnablePointsExpirationInputSchema
>;
const EnablePointsExpirationResponseSchema = z.looseObject({
	pointsExpiration: z.string().optional(),
});
export type EnablePointsExpirationResponse = z.infer<
	typeof EnablePointsExpirationResponseSchema
>;

const QueryLoyaltyCheckoutDiscountsInputSchema = z.looseObject({
	...SiteScopeFields,
	...QueryOptionFields,
});
export type QueryLoyaltyCheckoutDiscountsInput = z.infer<
	typeof QueryLoyaltyCheckoutDiscountsInputSchema
>;
const QueryLoyaltyCheckoutDiscountsResponseSchema = queryResponse('discounts');
export type QueryLoyaltyCheckoutDiscountsResponse = z.infer<
	typeof QueryLoyaltyCheckoutDiscountsResponseSchema
>;

// ── forms ──────────────────────────────────────────────────────────────────

const BulkDeleteFormSchemasInputSchema = z.looseObject({
	...SiteScopeFields,
	ids: z.array(z.string()).min(1),
});
export type BulkDeleteFormSchemasInput = z.infer<
	typeof BulkDeleteFormSchemasInputSchema
>;
const BulkDeleteFormSchemasResponseSchema = z.looseObject({
	results: z.array(WixItemSchema).optional(),
	bulkActionMetadata: BulkActionMetadataSchema.optional(),
});
export type BulkDeleteFormSchemasResponse = z.infer<
	typeof BulkDeleteFormSchemasResponseSchema
>;

const QueryDeletedFormsInputSchema = z.looseObject({
	...SiteScopeFields,
	...QueryOptionFields,
	// Wix requires a namespace filter for deleted-form queries.
	filter: WixFilterSchema,
});
export type QueryDeletedFormsInput = z.infer<
	typeof QueryDeletedFormsInputSchema
>;
const QueryDeletedFormsResponseSchema = queryResponse('forms');
export type QueryDeletedFormsResponse = z.infer<
	typeof QueryDeletedFormsResponseSchema
>;

const QueryFormSubmissionsByNamespaceInputSchema = z.looseObject({
	...SiteScopeFields,
	...QueryOptionFields,
	// Wix requires a namespace filter (`$eq`) for submissions-by-namespace.
	filter: WixFilterSchema,
});
export type QueryFormSubmissionsByNamespaceInput = z.infer<
	typeof QueryFormSubmissionsByNamespaceInputSchema
>;
const QueryFormSubmissionsByNamespaceResponseSchema =
	queryResponse('submissions');
export type QueryFormSubmissionsByNamespaceResponse = z.infer<
	typeof QueryFormSubmissionsByNamespaceResponseSchema
>;

const QueryFormsFormSubmissionsInputSchema = z.looseObject({
	...SiteScopeFields,
	...QueryOptionFields,
	// Wix requires a namespace filter for form-submissions queries.
	filter: WixFilterSchema,
});
export type QueryFormsFormSubmissionsInput = z.infer<
	typeof QueryFormsFormSubmissionsInputSchema
>;
const QueryFormsFormSubmissionsResponseSchema = queryResponse('submissions');
export type QueryFormsFormSubmissionsResponse = z.infer<
	typeof QueryFormsFormSubmissionsResponseSchema
>;

const RemoveDeletedFieldsInputSchema = z.looseObject({
	...SiteScopeFields,
	schemaId: z.string(),
});
export type RemoveDeletedFieldsInput = z.infer<
	typeof RemoveDeletedFieldsInputSchema
>;
const RemoveDeletedFieldsResponseSchema = z.looseObject({
	id: z.string().optional(),
	revision: z.string().optional(),
});
export type RemoveDeletedFieldsResponse = z.infer<
	typeof RemoveDeletedFieldsResponseSchema
>;

// ── events ─────────────────────────────────────────────────────────────────

const FindEventInputSchema = z.looseObject({
	...SiteScopeFields,
	eventId: z.string(),
});
export type FindEventInput = z.infer<typeof FindEventInputSchema>;
const FindEventResponseSchema = z.looseObject({
	id: z.string().optional(),
	slug: z.string().optional(),
	title: z.string().optional(),
});
export type FindEventResponse = z.infer<typeof FindEventResponseSchema>;

const QueryEventsGraphqlInputSchema = z.looseObject({
	...SiteScopeFields,
	// GraphQL body contract: a non-empty GraphQL document is required —
	// filter-only inputs are invalid because they carry no query document.
	// Optional variables; a legacy `filter` is forwarded as `variables.filter`.
	query: z.string().min(1),
	variables: z.record(z.string(), WixJsonValueSchema).optional(),
	filter: WixFilterSchema.optional(),
});
export type QueryEventsGraphqlInput = z.infer<
	typeof QueryEventsGraphqlInputSchema
>;
const QueryEventsGraphqlResponseSchema = z.looseObject({
	// GraphQL responses arrive as a `{ data, errors }` envelope.
	data: z.record(z.string(), WixJsonValueSchema).optional(),
	errors: z.array(z.record(z.string(), WixJsonValueSchema)).optional(),
});
export type QueryEventsGraphqlResponse = z.infer<
	typeof QueryEventsGraphqlResponseSchema
>;

const BulkDeleteRsvpsByFilterInputSchema = z.looseObject({
	...SiteScopeFields,
	filter: WixFilterSchema,
});
export type BulkDeleteRsvpsByFilterInput = z.infer<
	typeof BulkDeleteRsvpsByFilterInputSchema
>;
const BulkDeleteRsvpsByFilterResponseSchema = z.looseObject({
	results: z.array(WixItemSchema).optional(),
	bulkActionMetadata: BulkActionMetadataSchema.optional(),
});
export type BulkDeleteRsvpsByFilterResponse = z.infer<
	typeof BulkDeleteRsvpsByFilterResponseSchema
>;

const BulkDeleteTicketDefinitionsInputSchema = z.looseObject({
	...SiteScopeFields,
	filter: WixFilterSchema,
});
export type BulkDeleteTicketDefinitionsInput = z.infer<
	typeof BulkDeleteTicketDefinitionsInputSchema
>;
const BulkDeleteTicketDefinitionsResponseSchema = z.looseObject({
	results: z.array(WixItemSchema).optional(),
	bulkActionMetadata: BulkActionMetadataSchema.optional(),
});
export type BulkDeleteTicketDefinitionsResponse = z.infer<
	typeof BulkDeleteTicketDefinitionsResponseSchema
>;

const DeleteTicketCheckInInputSchema = z.looseObject({
	...SiteScopeFields,
	eventId: z.string().optional(),
	ticketIds: z.array(z.string()).optional(),
});
export type DeleteTicketCheckInInput = z.infer<
	typeof DeleteTicketCheckInInputSchema
>;
const DeleteTicketCheckInResponseSchema = z.looseObject({});
export type DeleteTicketCheckInResponse = z.infer<
	typeof DeleteTicketCheckInResponseSchema
>;

const DeleteTicketReservationInputSchema = z.looseObject({
	...SiteScopeFields,
	reservationId: z.string(),
});
export type DeleteTicketReservationInput = z.infer<
	typeof DeleteTicketReservationInputSchema
>;
const DeleteTicketReservationResponseSchema = z.looseObject({});
export type DeleteTicketReservationResponse = z.infer<
	typeof DeleteTicketReservationResponseSchema
>;

const DeleteScheduleItemInputSchema = z.looseObject({
	...SiteScopeFields,
	eventId: z.string(),
	scheduleItemIds: z.array(z.string()).optional(),
});
export type DeleteScheduleItemInput = z.infer<
	typeof DeleteScheduleItemInputSchema
>;
const DeleteScheduleItemResponseSchema = z.looseObject({});
export type DeleteScheduleItemResponse = z.infer<
	typeof DeleteScheduleItemResponseSchema
>;

const DeleteScheduleBookmarkInputSchema = z.looseObject({
	...SiteScopeFields,
	scheduleId: z.string(),
	bookmarkId: z.string(),
});
export type DeleteScheduleBookmarkInput = z.infer<
	typeof DeleteScheduleBookmarkInputSchema
>;
const DeleteScheduleBookmarkResponseSchema = z.looseObject({});
export type DeleteScheduleBookmarkResponse = z.infer<
	typeof DeleteScheduleBookmarkResponseSchema
>;

const DiscardDraftScheduleInputSchema = z.looseObject({
	...SiteScopeFields,
	eventId: z.string(),
});
export type DiscardDraftScheduleInput = z.infer<
	typeof DiscardDraftScheduleInputSchema
>;
const DiscardDraftScheduleResponseSchema = z.looseObject({});
export type DiscardDraftScheduleResponse = z.infer<
	typeof DiscardDraftScheduleResponseSchema
>;

const PublishDraftScheduleInputSchema = z.looseObject({
	...SiteScopeFields,
	eventId: z.string(),
});
export type PublishDraftScheduleInput = z.infer<
	typeof PublishDraftScheduleInputSchema
>;
const PublishDraftScheduleResponseSchema = z.looseObject({});
export type PublishDraftScheduleResponse = z.infer<
	typeof PublishDraftScheduleResponseSchema
>;

const RescheduleDraftScheduleInputSchema = z.looseObject({
	...SiteScopeFields,
	eventId: z.string(),
	timeZone: z.string().optional(),
});
export type RescheduleDraftScheduleInput = z.infer<
	typeof RescheduleDraftScheduleInputSchema
>;
const RescheduleDraftScheduleResponseSchema = z.looseObject({});
export type RescheduleDraftScheduleResponse = z.infer<
	typeof RescheduleDraftScheduleResponseSchema
>;

const BulkUnassignEventsFromCategoriesInputSchema = z.looseObject({
	...SiteScopeFields,
	eventId: z.string(),
	categoryIds: z.array(z.string()).min(1),
});
export type BulkUnassignEventsFromCategoriesInput = z.infer<
	typeof BulkUnassignEventsFromCategoriesInputSchema
>;
const BulkUnassignEventsFromCategoriesResponseSchema = z.looseObject({});
export type BulkUnassignEventsFromCategoriesResponse = z.infer<
	typeof BulkUnassignEventsFromCategoriesResponseSchema
>;

// ── restaurants ────────────────────────────────────────────────────────────

const DeleteRestaurantMenuInputSchema = z.looseObject({
	...SiteScopeFields,
	menuId: z.string(),
});
export type DeleteRestaurantMenuInput = z.infer<
	typeof DeleteRestaurantMenuInputSchema
>;
const DeleteRestaurantMenuResponseSchema = z.looseObject({});
export type DeleteRestaurantMenuResponse = z.infer<
	typeof DeleteRestaurantMenuResponseSchema
>;

const BulkDeleteMenuModifiersInputSchema = z.looseObject({
	...SiteScopeFields,
	ids: z.array(z.string()).min(1),
});
export type BulkDeleteMenuModifiersInput = z.infer<
	typeof BulkDeleteMenuModifiersInputSchema
>;
const BulkDeleteMenuModifiersResponseSchema = z.looseObject({
	results: z.array(WixItemSchema).optional(),
	bulkActionMetadata: BulkActionMetadataSchema.optional(),
});
export type BulkDeleteMenuModifiersResponse = z.infer<
	typeof BulkDeleteMenuModifiersResponseSchema
>;

const BulkDeleteMenuVariantsInputSchema = z.looseObject({
	...SiteScopeFields,
	ids: z.array(z.string()).min(1),
});
export type BulkDeleteMenuVariantsInput = z.infer<
	typeof BulkDeleteMenuVariantsInputSchema
>;
const BulkDeleteMenuVariantsResponseSchema = z.looseObject({
	results: z.array(WixItemSchema).optional(),
	bulkActionMetadata: BulkActionMetadataSchema.optional(),
});
export type BulkDeleteMenuVariantsResponse = z.infer<
	typeof BulkDeleteMenuVariantsResponseSchema
>;

const ListRestaurantCatalogsInputSchema = z.looseObject({
	...SiteScopeFields,
	limit: z.number().int().min(0).optional(),
	offset: z.number().int().min(0).optional(),
});
export type ListRestaurantCatalogsInput = z.infer<
	typeof ListRestaurantCatalogsInputSchema
>;
const ListRestaurantCatalogsResponseSchema = queryResponse('catalogs');
export type ListRestaurantCatalogsResponse = z.infer<
	typeof ListRestaurantCatalogsResponseSchema
>;

const BulkDeleteNotificationRecipientsInputSchema = z.looseObject({
	...SiteScopeFields,
	ids: z.array(z.string()).min(1),
});
export type BulkDeleteNotificationRecipientsInput = z.infer<
	typeof BulkDeleteNotificationRecipientsInputSchema
>;
const BulkDeleteNotificationRecipientsResponseSchema = z.looseObject({
	results: z.array(WixItemSchema).optional(),
	bulkActionMetadata: BulkActionMetadataSchema.optional(),
});
export type BulkDeleteNotificationRecipientsResponse = z.infer<
	typeof BulkDeleteNotificationRecipientsResponseSchema
>;

const DeleteServiceFeeRuleInputSchema = z.looseObject({
	...SiteScopeFields,
	ruleId: z.string(),
});
export type DeleteServiceFeeRuleInput = z.infer<
	typeof DeleteServiceFeeRuleInputSchema
>;
const DeleteServiceFeeRuleResponseSchema = z.looseObject({});
export type DeleteServiceFeeRuleResponse = z.infer<
	typeof DeleteServiceFeeRuleResponseSchema
>;

const CalculateFirstAvailableSlotsInputSchema = z.looseObject({
	...SiteScopeFields,
	menuIds: z.array(z.string()).min(1),
});
export type CalculateFirstAvailableSlotsInput = z.infer<
	typeof CalculateFirstAvailableSlotsInputSchema
>;
const CalculateFirstAvailableSlotsResponseSchema = z.looseObject({
	slots: z.array(WixItemSchema).optional(),
});
export type CalculateFirstAvailableSlotsResponse = z.infer<
	typeof CalculateFirstAvailableSlotsResponseSchema
>;

// ── billing ────────────────────────────────────────────────────────────────

const BulkDeleteBillableItemsInputSchema = z.looseObject({
	...SiteScopeFields,
	ids: z.array(z.string()).min(1),
});
export type BulkDeleteBillableItemsInput = z.infer<
	typeof BulkDeleteBillableItemsInputSchema
>;
const BulkDeleteBillableItemsResponseSchema = z.looseObject({
	results: z.array(WixItemSchema).optional(),
	bulkActionMetadata: BulkActionMetadataSchema.optional(),
});
export type BulkDeleteBillableItemsResponse = z.infer<
	typeof BulkDeleteBillableItemsResponseSchema
>;

const BulkUpdateBillableItemsInputSchema = z.looseObject({
	...SiteScopeFields,
	updates: z.array(WixItemSchema).min(1),
});
export type BulkUpdateBillableItemsInput = z.infer<
	typeof BulkUpdateBillableItemsInputSchema
>;
const BulkUpdateBillableItemsResponseSchema = z.looseObject({
	results: z.array(WixItemSchema).optional(),
	bulkActionMetadata: BulkActionMetadataSchema.optional(),
});
export type BulkUpdateBillableItemsResponse = z.infer<
	typeof BulkUpdateBillableItemsResponseSchema
>;

const CreateTaxRegionInputSchema = z.looseObject({
	...SiteScopeFields,
	country: z.string(),
	subdivision: z.string().optional(),
	taxCalculator: z.looseObject({}).optional(),
});
export type CreateTaxRegionInput = z.infer<typeof CreateTaxRegionInputSchema>;
const CreateTaxRegionResponseSchema = z.looseObject({
	id: z.string().optional(),
});
export type CreateTaxRegionResponse = z.infer<
	typeof CreateTaxRegionResponseSchema
>;

const ListDefaultTaxGroupsInputSchema = z.looseObject({ ...SiteScopeFields });
export type ListDefaultTaxGroupsInput = z.infer<
	typeof ListDefaultTaxGroupsInputSchema
>;
const ListDefaultTaxGroupsResponseSchema = z.looseObject({
	taxGroups: z.array(WixItemSchema).optional(),
});
export type ListDefaultTaxGroupsResponse = z.infer<
	typeof ListDefaultTaxGroupsResponseSchema
>;

const ListDefaultTaxGroupsByAppIdsInputSchema = z.looseObject({
	...SiteScopeFields,
	appIds: z.array(z.string()).min(1),
});
export type ListDefaultTaxGroupsByAppIdsInput = z.infer<
	typeof ListDefaultTaxGroupsByAppIdsInputSchema
>;
const ListDefaultTaxGroupsByAppIdsResponseSchema = z.looseObject({
	taxGroups: z.array(WixItemSchema).optional(),
});
export type ListDefaultTaxGroupsByAppIdsResponse = z.infer<
	typeof ListDefaultTaxGroupsByAppIdsResponseSchema
>;

const ListManualTaxMappingsInputSchema = z.looseObject({
	...SiteScopeFields,
	limit: z.number().int().min(0).optional(),
	offset: z.number().int().min(0).optional(),
});
export type ListManualTaxMappingsInput = z.infer<
	typeof ListManualTaxMappingsInputSchema
>;
const ListManualTaxMappingsResponseSchema = queryResponse('mappings');
export type ListManualTaxMappingsResponse = z.infer<
	typeof ListManualTaxMappingsResponseSchema
>;

const QueryManualTaxMappingsInputSchema = z.looseObject({
	...SiteScopeFields,
	...QueryOptionFields,
});
export type QueryManualTaxMappingsInput = z.infer<
	typeof QueryManualTaxMappingsInputSchema
>;
const QueryManualTaxMappingsResponseSchema = queryResponse('mappings');
export type QueryManualTaxMappingsResponse = z.infer<
	typeof QueryManualTaxMappingsResponseSchema
>;

const QueryTaxGroupsInputSchema = z.looseObject({
	...SiteScopeFields,
	...QueryOptionFields,
});
export type QueryTaxGroupsInput = z.infer<typeof QueryTaxGroupsInputSchema>;
const QueryTaxGroupsResponseSchema = queryResponse('taxGroups');
export type QueryTaxGroupsResponse = z.infer<
	typeof QueryTaxGroupsResponseSchema
>;

const DeleteReceiptPresetInputSchema = z.looseObject({
	...SiteScopeFields,
	presetId: z.string(),
});
export type DeleteReceiptPresetInput = z.infer<
	typeof DeleteReceiptPresetInputSchema
>;
const DeleteReceiptPresetResponseSchema = z.looseObject({});
export type DeleteReceiptPresetResponse = z.infer<
	typeof DeleteReceiptPresetResponseSchema
>;

const SetDefaultReceiptPresetInputSchema = z.looseObject({
	...SiteScopeFields,
	presetId: z.string(),
});
export type SetDefaultReceiptPresetInput = z.infer<
	typeof SetDefaultReceiptPresetInputSchema
>;
const SetDefaultReceiptPresetResponseSchema = z.looseObject({
	id: z.string().optional(),
});
export type SetDefaultReceiptPresetResponse = z.infer<
	typeof SetDefaultReceiptPresetResponseSchema
>;

const UpdateReceiptPresetInputSchema = z.looseObject({
	...SiteScopeFields,
	presetId: z.string(),
	revision: z.string().optional(),
	preset: z.looseObject({}).optional(),
});
export type UpdateReceiptPresetInput = z.infer<
	typeof UpdateReceiptPresetInputSchema
>;
const UpdateReceiptPresetResponseSchema = z.looseObject({
	id: z.string().optional(),
	revision: z.string().optional(),
});
export type UpdateReceiptPresetResponse = z.infer<
	typeof UpdateReceiptPresetResponseSchema
>;

// ── cms ────────────────────────────────────────────────────────────────────

const AddSpecialPermissionsInputSchema = z.looseObject({
	...SiteScopeFields,
	collectionId: z.string(),
	permissions: z.array(WixItemSchema).optional(),
});
export type AddSpecialPermissionsInput = z.infer<
	typeof AddSpecialPermissionsInputSchema
>;
const AddSpecialPermissionsResponseSchema = z.looseObject({});
export type AddSpecialPermissionsResponse = z.infer<
	typeof AddSpecialPermissionsResponseSchema
>;

const CancelBackgroundTaskInputSchema = z.looseObject({
	...SiteScopeFields,
	taskId: z.string(),
});
export type CancelBackgroundTaskInput = z.infer<
	typeof CancelBackgroundTaskInputSchema
>;
const CancelBackgroundTaskResponseSchema = z.looseObject({});
export type CancelBackgroundTaskResponse = z.infer<
	typeof CancelBackgroundTaskResponseSchema
>;

const DeleteDataCollectionFieldInputSchema = z.looseObject({
	...SiteScopeFields,
	collectionId: z.string(),
	fieldId: z.string(),
});
export type DeleteDataCollectionFieldInput = z.infer<
	typeof DeleteDataCollectionFieldInputSchema
>;
const DeleteDataCollectionFieldResponseSchema = z.looseObject({});
export type DeleteDataCollectionFieldResponse = z.infer<
	typeof DeleteDataCollectionFieldResponseSchema
>;

const DeleteUserDefinedFieldsInputSchema = z.looseObject({
	...SiteScopeFields,
	schemaId: z.string(),
	fieldKeys: z.array(z.string()).min(1),
});
export type DeleteUserDefinedFieldsInput = z.infer<
	typeof DeleteUserDefinedFieldsInputSchema
>;
const DeleteUserDefinedFieldsResponseSchema = z.looseObject({});
export type DeleteUserDefinedFieldsResponse = z.infer<
	typeof DeleteUserDefinedFieldsResponseSchema
>;

// ── media ──────────────────────────────────────────────────────────────────

const GenerateFileUploadUrlInputSchema = z.looseObject({
	...SiteScopeFields,
	fileName: z.string().optional(),
	// Wix requires `mimeType` on generate-file-upload-url.
	mimeType: z.string().min(1),
});
export type GenerateFileUploadUrlInput = z.infer<
	typeof GenerateFileUploadUrlInputSchema
>;
const GenerateFileUploadUrlResponseSchema = z.looseObject({
	uploadUrl: z.string().optional(),
});
export type GenerateFileUploadUrlResponse = z.infer<
	typeof GenerateFileUploadUrlResponseSchema
>;

const GenerateFilesDownloadUrlInputSchema = z.looseObject({
	...SiteScopeFields,
	fileIds: z.array(z.string()).min(1).max(1000),
});
export type GenerateFilesDownloadUrlInput = z.infer<
	typeof GenerateFilesDownloadUrlInputSchema
>;
const GenerateFilesDownloadUrlResponseSchema = z.looseObject({
	downloadUrl: z.string().optional(),
});
export type GenerateFilesDownloadUrlResponse = z.infer<
	typeof GenerateFilesDownloadUrlResponseSchema
>;

const ImportFileToMediaInputSchema = z.looseObject({
	...SiteScopeFields,
	url: z.string(),
	fileName: z.string().optional(),
});
export type ImportFileToMediaInput = z.infer<
	typeof ImportFileToMediaInputSchema
>;
const ImportFileToMediaResponseSchema = z.looseObject({
	id: z.string().optional(),
	state: z.string().optional(),
});
export type ImportFileToMediaResponse = z.infer<
	typeof ImportFileToMediaResponseSchema
>;

// ── automations ────────────────────────────────────────────────────────────

const CancelAutomationEventInputSchema = z.looseObject({
	...SiteScopeFields,
	triggerId: z.string().optional(),
	externalEntityId: z.string().optional(),
});
export type CancelAutomationEventInput = z.infer<
	typeof CancelAutomationEventInputSchema
>;
const CancelAutomationEventResponseSchema = z.looseObject({});
export type CancelAutomationEventResponse = z.infer<
	typeof CancelAutomationEventResponseSchema
>;

const BulkUpdateStorageItemTagsInputSchema = z.looseObject({
	...SiteScopeFields,
	itemIds: z.array(z.string()).min(1),
	assignTags: z.array(z.string()).optional(),
	unassignTags: z.array(z.string()).optional(),
});
export type BulkUpdateStorageItemTagsInput = z.infer<
	typeof BulkUpdateStorageItemTagsInputSchema
>;
const BulkUpdateStorageItemTagsResponseSchema = z.looseObject({
	results: z.array(WixItemSchema).optional(),
});
export type BulkUpdateStorageItemTagsResponse = z.infer<
	typeof BulkUpdateStorageItemTagsResponseSchema
>;

const BulkUpdateStorageItemTagsByFilterInputSchema = z.looseObject({
	...SiteScopeFields,
	filter: WixFilterSchema,
	assignTags: z.array(z.string()).optional(),
	unassignTags: z.array(z.string()).optional(),
});
export type BulkUpdateStorageItemTagsByFilterInput = z.infer<
	typeof BulkUpdateStorageItemTagsByFilterInputSchema
>;
const BulkUpdateStorageItemTagsByFilterResponseSchema = z.looseObject({
	jobId: z.string().optional(),
});
export type BulkUpdateStorageItemTagsByFilterResponse = z.infer<
	typeof BulkUpdateStorageItemTagsByFilterResponseSchema
>;

// ── community ──────────────────────────────────────────────────────────────

const CheckContentInputSchema = z.looseObject({
	...SiteScopeFields,
	text: z.string(),
});
export type CheckContentInput = z.infer<typeof CheckContentInputSchema>;
const CheckContentResponseSchema = z.looseObject({
	verdict: z.string().optional(),
});
export type CheckContentResponse = z.infer<typeof CheckContentResponseSchema>;

const QueryModerationRulesInputSchema = z.looseObject({
	...SiteScopeFields,
	...QueryOptionFields,
});
export type QueryModerationRulesInput = z.infer<
	typeof QueryModerationRulesInputSchema
>;
const QueryModerationRulesResponseSchema = queryResponse('rules');
export type QueryModerationRulesResponse = z.infer<
	typeof QueryModerationRulesResponseSchema
>;

const UpdateModerationRuleInputSchema = z.looseObject({
	...SiteScopeFields,
	ruleId: z.string(),
	revision: z.string().optional(),
	rule: z.looseObject({}).optional(),
});
export type UpdateModerationRuleInput = z.infer<
	typeof UpdateModerationRuleInputSchema
>;
const UpdateModerationRuleResponseSchema = z.looseObject({
	id: z.string().optional(),
	revision: z.string().optional(),
});
export type UpdateModerationRuleResponse = z.infer<
	typeof UpdateModerationRuleResponseSchema
>;

const ListGroupRequestsInputSchema = z.looseObject({
	...SiteScopeFields,
	limit: z.number().int().min(0).optional(),
	offset: z.number().int().min(0).optional(),
});
export type ListGroupRequestsInput = z.infer<
	typeof ListGroupRequestsInputSchema
>;
const ListGroupRequestsResponseSchema = queryResponse('requests');
export type ListGroupRequestsResponse = z.infer<
	typeof ListGroupRequestsResponseSchema
>;

const QueryGroupRequestsInputSchema = z.looseObject({
	...SiteScopeFields,
	...QueryOptionFields,
});
export type QueryGroupRequestsInput = z.infer<
	typeof QueryGroupRequestsInputSchema
>;
const QueryGroupRequestsResponseSchema = queryResponse('requests');
export type QueryGroupRequestsResponse = z.infer<
	typeof QueryGroupRequestsResponseSchema
>;

const DeleteFaqCategoryInputSchema = z.looseObject({
	...SiteScopeFields,
	categoryId: z.string(),
});
export type DeleteFaqCategoryInput = z.infer<
	typeof DeleteFaqCategoryInputSchema
>;
const DeleteFaqCategoryResponseSchema = z.looseObject({});
export type DeleteFaqCategoryResponse = z.infer<
	typeof DeleteFaqCategoryResponseSchema
>;

const DeleteQuestionEntryInputSchema = z.looseObject({
	...SiteScopeFields,
	questionId: z.string(),
});
export type DeleteQuestionEntryInput = z.infer<
	typeof DeleteQuestionEntryInputSchema
>;
const DeleteQuestionEntryResponseSchema = z.looseObject({});
export type DeleteQuestionEntryResponse = z.infer<
	typeof DeleteQuestionEntryResponseSchema
>;

const UpdateQuestionEntryLabelsInputSchema = z.looseObject({
	...SiteScopeFields,
	questionId: z.string(),
	labels: z.array(z.string()),
});
export type UpdateQuestionEntryLabelsInput = z.infer<
	typeof UpdateQuestionEntryLabelsInputSchema
>;
const UpdateQuestionEntryLabelsResponseSchema = z.looseObject({
	id: z.string().optional(),
});
export type UpdateQuestionEntryLabelsResponse = z.infer<
	typeof UpdateQuestionEntryLabelsResponseSchema
>;

const UpdateReviewModerationStatusInputSchema = z.looseObject({
	...SiteScopeFields,
	reviewId: z.string(),
	moderationStatus: z.string(),
});
export type UpdateReviewModerationStatusInput = z.infer<
	typeof UpdateReviewModerationStatusInputSchema
>;
const UpdateReviewModerationStatusResponseSchema = z.looseObject({
	id: z.string().optional(),
});
export type UpdateReviewModerationStatusResponse = z.infer<
	typeof UpdateReviewModerationStatusResponseSchema
>;

const BulkUpdateReviewModerationStatusInputSchema = z.looseObject({
	...SiteScopeFields,
	filter: WixFilterSchema.optional(),
	moderationStatus: z.string(),
});
export type BulkUpdateReviewModerationStatusInput = z.infer<
	typeof BulkUpdateReviewModerationStatusInputSchema
>;
const BulkUpdateReviewModerationStatusResponseSchema = z.looseObject({
	results: z.array(WixItemSchema).optional(),
	bulkActionMetadata: BulkActionMetadataSchema.optional(),
});
export type BulkUpdateReviewModerationStatusResponse = z.infer<
	typeof BulkUpdateReviewModerationStatusResponseSchema
>;

// ── portfolio ──────────────────────────────────────────────────────────────

const DeleteProjectInputSchema = z.looseObject({
	...SiteScopeFields,
	projectId: z.string(),
});
export type DeleteProjectInput = z.infer<typeof DeleteProjectInputSchema>;
const DeleteProjectResponseSchema = z.looseObject({});
export type DeleteProjectResponse = z.infer<typeof DeleteProjectResponseSchema>;

const DeleteProjectItemInputSchema = z.looseObject({
	...SiteScopeFields,
	itemId: z.string(),
});
export type DeleteProjectItemInput = z.infer<
	typeof DeleteProjectItemInputSchema
>;
const DeleteProjectItemResponseSchema = z.looseObject({});
export type DeleteProjectItemResponse = z.infer<
	typeof DeleteProjectItemResponseSchema
>;

// ── benefits ───────────────────────────────────────────────────────────────

const BulkDeleteBenefitItemsInputSchema = z.looseObject({
	...SiteScopeFields,
	ids: z.array(z.string()).min(1),
});
export type BulkDeleteBenefitItemsInput = z.infer<
	typeof BulkDeleteBenefitItemsInputSchema
>;
const BulkDeleteBenefitItemsResponseSchema = z.looseObject({
	results: z.array(WixItemSchema).optional(),
	bulkActionMetadata: BulkActionMetadataSchema.optional(),
});
export type BulkDeleteBenefitItemsResponse = z.infer<
	typeof BulkDeleteBenefitItemsResponseSchema
>;

const BulkDeleteBenefitItemsByFilterInputSchema = z.looseObject({
	...SiteScopeFields,
	namespace: z.string().optional(),
	filter: WixFilterSchema.optional(),
});
export type BulkDeleteBenefitItemsByFilterInput = z.infer<
	typeof BulkDeleteBenefitItemsByFilterInputSchema
>;
const BulkDeleteBenefitItemsByFilterResponseSchema = z.looseObject({
	results: z.array(WixItemSchema).optional(),
	bulkActionMetadata: BulkActionMetadataSchema.optional(),
});
export type BulkDeleteBenefitItemsByFilterResponse = z.infer<
	typeof BulkDeleteBenefitItemsByFilterResponseSchema
>;

const BulkDeletePoolDefinitionsInputSchema = z.looseObject({
	...SiteScopeFields,
	ids: z.array(z.string()).min(1),
});
export type BulkDeletePoolDefinitionsInput = z.infer<
	typeof BulkDeletePoolDefinitionsInputSchema
>;
const BulkDeletePoolDefinitionsResponseSchema = z.looseObject({
	results: z.array(WixItemSchema).optional(),
	bulkActionMetadata: BulkActionMetadataSchema.optional(),
});
export type BulkDeletePoolDefinitionsResponse = z.infer<
	typeof BulkDeletePoolDefinitionsResponseSchema
>;

const DeleteProgramDefinitionInputSchema = z.looseObject({
	...SiteScopeFields,
	definitionId: z.string(),
});
export type DeleteProgramDefinitionInput = z.infer<
	typeof DeleteProgramDefinitionInputSchema
>;
const DeleteProgramDefinitionResponseSchema = z.looseObject({});
export type DeleteProgramDefinitionResponse = z.infer<
	typeof DeleteProgramDefinitionResponseSchema
>;

// ── multilingual ───────────────────────────────────────────────────────────

const BulkDeleteTranslationContentInputSchema = z.looseObject({
	...SiteScopeFields,
	ids: z.array(z.string()).min(1),
});
export type BulkDeleteTranslationContentInput = z.infer<
	typeof BulkDeleteTranslationContentInputSchema
>;
const BulkDeleteTranslationContentResponseSchema = z.looseObject({
	results: z.array(WixItemSchema).optional(),
	bulkActionMetadata: BulkActionMetadataSchema.optional(),
});
export type BulkDeleteTranslationContentResponse = z.infer<
	typeof BulkDeleteTranslationContentResponseSchema
>;

const BulkUpdateTranslationContentByKeyInputSchema = z.looseObject({
	...SiteScopeFields,
	items: z.array(WixItemSchema).min(1),
});
export type BulkUpdateTranslationContentByKeyInput = z.infer<
	typeof BulkUpdateTranslationContentByKeyInputSchema
>;
const BulkUpdateTranslationContentByKeyResponseSchema = z.looseObject({
	results: z.array(WixItemSchema).optional(),
	bulkActionMetadata: BulkActionMetadataSchema.optional(),
});
export type BulkUpdateTranslationContentByKeyResponse = z.infer<
	typeof BulkUpdateTranslationContentByKeyResponseSchema
>;

// ── system ─────────────────────────────────────────────────────────────────

const GetAppInstanceInputSchema = z.looseObject({ ...SiteScopeFields });
export type GetAppInstanceInput = z.infer<typeof GetAppInstanceInputSchema>;
const GetAppInstanceResponseSchema = z.looseObject({
	instanceId: z.string().optional(),
	appId: z.string().optional(),
	siteId: z.string().optional(),
});
export type GetAppInstanceResponse = z.infer<
	typeof GetAppInstanceResponseSchema
>;

const ListAppPermissionsInputSchema = z.looseObject({
	...SiteScopeFields,
	appId: z.string().optional(),
});
export type ListAppPermissionsInput = z.infer<
	typeof ListAppPermissionsInputSchema
>;
const ListAppPermissionsResponseSchema = z.looseObject({
	permissions: z.array(WixItemSchema).optional(),
});
export type ListAppPermissionsResponse = z.infer<
	typeof ListAppPermissionsResponseSchema
>;

const ListAppPlansByAppIdInputSchema = z.looseObject({
	...SiteScopeFields,
	appId: z.string(),
});
export type ListAppPlansByAppIdInput = z.infer<
	typeof ListAppPlansByAppIdInputSchema
>;
const ListAppPlansByAppIdResponseSchema = z.looseObject({
	plans: z.array(WixItemSchema).optional(),
});
export type ListAppPlansByAppIdResponse = z.infer<
	typeof ListAppPlansByAppIdResponseSchema
>;

const GetPurchaseHistoryInputSchema = z.looseObject({ ...SiteScopeFields });
export type GetPurchaseHistoryInput = z.infer<
	typeof GetPurchaseHistoryInputSchema
>;
const GetPurchaseHistoryResponseSchema = z.looseObject({
	purchases: z.array(WixItemSchema).optional(),
});
export type GetPurchaseHistoryResponse = z.infer<
	typeof GetPurchaseHistoryResponseSchema
>;

const DeleteSecretInputSchema = z.looseObject({
	...SiteScopeFields,
	secretId: z.string(),
});
export type DeleteSecretInput = z.infer<typeof DeleteSecretInputSchema>;
const DeleteSecretResponseSchema = z.looseObject({});
export type DeleteSecretResponse = z.infer<typeof DeleteSecretResponseSchema>;

const DeleteUserFavoriteInputSchema = z.looseObject({
	...SiteScopeFields,
	pageId: z.string(),
});
export type DeleteUserFavoriteInput = z.infer<
	typeof DeleteUserFavoriteInputSchema
>;
const DeleteUserFavoriteResponseSchema = z.looseObject({});
export type DeleteUserFavoriteResponse = z.infer<
	typeof DeleteUserFavoriteResponseSchema
>;

const BulkDeleteReportsByFilterInputSchema = z.looseObject({
	...SiteScopeFields,
	filter: WixFilterSchema,
});
export type BulkDeleteReportsByFilterInput = z.infer<
	typeof BulkDeleteReportsByFilterInputSchema
>;
const BulkDeleteReportsByFilterResponseSchema = z.looseObject({
	results: z.array(WixItemSchema).optional(),
	bulkActionMetadata: BulkActionMetadataSchema.optional(),
});
export type BulkDeleteReportsByFilterResponse = z.infer<
	typeof BulkDeleteReportsByFilterResponseSchema
>;

const UpdateOperationGroupTagsByFilterInputSchema = z.looseObject({
	...SiteScopeFields,
	filter: WixFilterSchema,
	assignTags: z.array(z.string()).optional(),
	unassignTags: z.array(z.string()).optional(),
});
export type UpdateOperationGroupTagsByFilterInput = z.infer<
	typeof UpdateOperationGroupTagsByFilterInputSchema
>;
const UpdateOperationGroupTagsByFilterResponseSchema = z.looseObject({
	results: z.array(WixItemSchema).optional(),
	bulkActionMetadata: BulkActionMetadataSchema.optional(),
});
export type UpdateOperationGroupTagsByFilterResponse = z.infer<
	typeof UpdateOperationGroupTagsByFilterResponseSchema
>;

// ── maps ───────────────────────────────────────────────────────────────────

export const WixEndpointInputSchemas = {
	queryContacts: QueryContactsInputSchema,
	listContacts: ListContactsInputSchema,
	bulkUpdateContacts: BulkUpdateContactsInputSchema,
	addContactLabels: AddContactLabelsInputSchema,
	unlabelContact: UnlabelContactInputSchema,
	listContactsFacets: ListContactsFacetsInputSchema,
	queryContactsFacets: QueryContactsFacetsInputSchema,
	searchProducts: SearchProductsInputSchema,
	queryInventoryItems: QueryInventoryItemsInputSchema,
	bulkDeleteProducts: BulkDeleteProductsInputSchema,
	bulkDeleteInventoryItems: BulkDeleteInventoryItemsInputSchema,
	bulkDeleteBrands: BulkDeleteBrandsInputSchema,
	bulkGetOrCreateBrands: BulkGetOrCreateBrandsInputSchema,
	bulkUpdateProductsByFilter: BulkUpdateProductsByFilterInputSchema,
	bulkUpdateInventoryItemsByFilter: BulkUpdateInventoryItemsByFilterInputSchema,
	bulkUpdateCustomizations: BulkUpdateCustomizationsInputSchema,
	bulkCreateProductsWithInventory: BulkCreateProductsWithInventoryInputSchema,
	bulkRemoveInfoSectionsByFilter: BulkRemoveInfoSectionsByFilterInputSchema,
	deleteCustomization: DeleteCustomizationInputSchema,
	deleteInfoSection: DeleteInfoSectionInputSchema,
	deleteProductOptions: DeleteProductOptionsInputSchema,
	setCustomizationChoices: SetCustomizationChoicesInputSchema,
	updateInventoryVariants: UpdateInventoryVariantsInputSchema,
	getCollectionBySlug: GetCollectionBySlugInputSchema,
	listCurrencies: ListCurrenciesInputSchema,
	queryCoupons: QueryCouponsInputSchema,
	deleteBackInStockNotification: DeleteBackInStockNotificationInputSchema,
	queryEcomOrders: QueryEcomOrdersInputSchema,
	bulkUpdateOrders: BulkUpdateOrdersInputSchema,
	bulkUpdateOrderTags: BulkUpdateOrderTagsInputSchema,
	removeTipFromOrder: RemoveTipFromOrderInputSchema,
	bulkDeleteAbandonedCheckouts: BulkDeleteAbandonedCheckoutsInputSchema,
	listInvoicesByOrderIds: ListInvoicesByOrderIdsInputSchema,
	queryBookingsCategories: QueryBookingsCategoriesInputSchema,
	deleteBookingsService: DeleteBookingsServiceInputSchema,
	bulkDeleteBookingsServices: BulkDeleteBookingsServicesInputSchema,
	bulkDeleteBookingsServicesByFilter:
		BulkDeleteBookingsServicesByFilterInputSchema,
	deleteBookingsAddOnGroup: DeleteBookingsAddOnGroupInputSchema,
	queryExtendedBookings: QueryExtendedBookingsInputSchema,
	countExtendedBookings: CountExtendedBookingsInputSchema,
	listBookingsSessions: ListBookingsSessionsInputSchema,
	updateStaffMemberTagsByFilter: UpdateStaffMemberTagsByFilterInputSchema,
	getMember: GetMemberInputSchema,
	getMemberPrivacySettings: GetMemberPrivacySettingsInputSchema,
	getMembersCustomFieldApplications:
		GetMembersCustomFieldApplicationsInputSchema,
	getRolesCustomFieldApplications: GetRolesCustomFieldApplicationsInputSchema,
	getRolesInfo: GetRolesInfoInputSchema,
	listMembersCustomFields: ListMembersCustomFieldsInputSchema,
	listMemberFollowing: ListMemberFollowingInputSchema,
	listMyMemberFollowers: ListMyMemberFollowersInputSchema,
	registerMemberV2: RegisterMemberV2InputSchema,
	logoutMember: LogoutMemberInputSchema,
	sendMemberRecoveryEmail: SendMemberRecoveryEmailInputSchema,
	getSiteProperties: GetSitePropertiesInputSchema,
	updateBusinessContact: UpdateBusinessContactInputSchema,
	updateBusinessProfile: UpdateBusinessProfileInputSchema,
	updateBusinessSchedule: UpdateBusinessScheduleInputSchema,
	updateLocaleSettings: UpdateLocaleSettingsInputSchema,
	checkDomainAvailability: CheckDomainAvailabilityInputSchema,
	getFolderBySite: GetFolderBySiteInputSchema,
	querySiteFolders: QuerySiteFoldersInputSchema,
	queryLocations: QueryLocationsInputSchema,
	getSitePluginsPlacementStatus: GetSitePluginsPlacementStatusInputSchema,
	listEmailCampaigns: ListEmailCampaignsInputSchema,
	getSenderDetails: GetSenderDetailsInputSchema,
	deleteSenderDetails: DeleteSenderDetailsInputSchema,
	deleteSenderEmail: DeleteSenderEmailInputSchema,
	updateReferralProgram: UpdateReferralProgramInputSchema,
	getCurrentMemberCoupons: GetCurrentMemberCouponsInputSchema,
	deleteLoyaltyCoupon: DeleteLoyaltyCouponInputSchema,
	enablePointsExpiration: EnablePointsExpirationInputSchema,
	queryLoyaltyCheckoutDiscounts: QueryLoyaltyCheckoutDiscountsInputSchema,
	bulkDeleteFormSchemas: BulkDeleteFormSchemasInputSchema,
	queryDeletedForms: QueryDeletedFormsInputSchema,
	queryFormSubmissionsByNamespace: QueryFormSubmissionsByNamespaceInputSchema,
	queryFormsFormSubmissions: QueryFormsFormSubmissionsInputSchema,
	removeDeletedFields: RemoveDeletedFieldsInputSchema,
	findEvent: FindEventInputSchema,
	queryEventsGraphql: QueryEventsGraphqlInputSchema,
	bulkDeleteRsvpsByFilter: BulkDeleteRsvpsByFilterInputSchema,
	bulkDeleteTicketDefinitions: BulkDeleteTicketDefinitionsInputSchema,
	deleteTicketCheckIn: DeleteTicketCheckInInputSchema,
	deleteTicketReservation: DeleteTicketReservationInputSchema,
	deleteScheduleItem: DeleteScheduleItemInputSchema,
	deleteScheduleBookmark: DeleteScheduleBookmarkInputSchema,
	discardDraftSchedule: DiscardDraftScheduleInputSchema,
	publishDraftSchedule: PublishDraftScheduleInputSchema,
	rescheduleDraftSchedule: RescheduleDraftScheduleInputSchema,
	bulkUnassignEventsFromCategories: BulkUnassignEventsFromCategoriesInputSchema,
	deleteRestaurantMenu: DeleteRestaurantMenuInputSchema,
	bulkDeleteMenuModifiers: BulkDeleteMenuModifiersInputSchema,
	bulkDeleteMenuVariants: BulkDeleteMenuVariantsInputSchema,
	listRestaurantCatalogs: ListRestaurantCatalogsInputSchema,
	bulkDeleteNotificationRecipients: BulkDeleteNotificationRecipientsInputSchema,
	deleteServiceFeeRule: DeleteServiceFeeRuleInputSchema,
	calculateFirstAvailableSlots: CalculateFirstAvailableSlotsInputSchema,
	bulkDeleteBillableItems: BulkDeleteBillableItemsInputSchema,
	bulkUpdateBillableItems: BulkUpdateBillableItemsInputSchema,
	createTaxRegion: CreateTaxRegionInputSchema,
	listDefaultTaxGroups: ListDefaultTaxGroupsInputSchema,
	listDefaultTaxGroupsByAppIds: ListDefaultTaxGroupsByAppIdsInputSchema,
	listManualTaxMappings: ListManualTaxMappingsInputSchema,
	queryManualTaxMappings: QueryManualTaxMappingsInputSchema,
	queryTaxGroups: QueryTaxGroupsInputSchema,
	deleteReceiptPreset: DeleteReceiptPresetInputSchema,
	setDefaultReceiptPreset: SetDefaultReceiptPresetInputSchema,
	updateReceiptPreset: UpdateReceiptPresetInputSchema,
	addSpecialPermissions: AddSpecialPermissionsInputSchema,
	cancelBackgroundTask: CancelBackgroundTaskInputSchema,
	deleteDataCollectionField: DeleteDataCollectionFieldInputSchema,
	deleteUserDefinedFields: DeleteUserDefinedFieldsInputSchema,
	generateFileUploadUrl: GenerateFileUploadUrlInputSchema,
	generateFilesDownloadUrl: GenerateFilesDownloadUrlInputSchema,
	importFileToMedia: ImportFileToMediaInputSchema,
	cancelAutomationEvent: CancelAutomationEventInputSchema,
	bulkUpdateStorageItemTags: BulkUpdateStorageItemTagsInputSchema,
	bulkUpdateStorageItemTagsByFilter:
		BulkUpdateStorageItemTagsByFilterInputSchema,
	checkContent: CheckContentInputSchema,
	queryModerationRules: QueryModerationRulesInputSchema,
	updateModerationRule: UpdateModerationRuleInputSchema,
	listGroupRequests: ListGroupRequestsInputSchema,
	queryGroupRequests: QueryGroupRequestsInputSchema,
	deleteFaqCategory: DeleteFaqCategoryInputSchema,
	deleteQuestionEntry: DeleteQuestionEntryInputSchema,
	updateQuestionEntryLabels: UpdateQuestionEntryLabelsInputSchema,
	updateReviewModerationStatus: UpdateReviewModerationStatusInputSchema,
	bulkUpdateReviewModerationStatus: BulkUpdateReviewModerationStatusInputSchema,
	deleteProject: DeleteProjectInputSchema,
	deleteProjectItem: DeleteProjectItemInputSchema,
	bulkDeleteBenefitItems: BulkDeleteBenefitItemsInputSchema,
	bulkDeleteBenefitItemsByFilter: BulkDeleteBenefitItemsByFilterInputSchema,
	bulkDeletePoolDefinitions: BulkDeletePoolDefinitionsInputSchema,
	deleteProgramDefinition: DeleteProgramDefinitionInputSchema,
	bulkDeleteTranslationContent: BulkDeleteTranslationContentInputSchema,
	bulkUpdateTranslationContentByKey:
		BulkUpdateTranslationContentByKeyInputSchema,
	getAppInstance: GetAppInstanceInputSchema,
	listAppPermissions: ListAppPermissionsInputSchema,
	listAppPlansByAppId: ListAppPlansByAppIdInputSchema,
	getPurchaseHistory: GetPurchaseHistoryInputSchema,
	deleteSecret: DeleteSecretInputSchema,
	deleteUserFavorite: DeleteUserFavoriteInputSchema,
	bulkDeleteReportsByFilter: BulkDeleteReportsByFilterInputSchema,
	updateOperationGroupTagsByFilter: UpdateOperationGroupTagsByFilterInputSchema,
} as const;

export const WixEndpointOutputSchemas = {
	queryContacts: QueryContactsResponseSchema,
	listContacts: ListContactsResponseSchema,
	bulkUpdateContacts: BulkUpdateContactsResponseSchema,
	addContactLabels: AddContactLabelsResponseSchema,
	unlabelContact: UnlabelContactResponseSchema,
	listContactsFacets: ListContactsFacetsResponseSchema,
	queryContactsFacets: QueryContactsFacetsResponseSchema,
	searchProducts: SearchProductsResponseSchema,
	queryInventoryItems: QueryInventoryItemsResponseSchema,
	bulkDeleteProducts: BulkDeleteProductsResponseSchema,
	bulkDeleteInventoryItems: BulkDeleteInventoryItemsResponseSchema,
	bulkDeleteBrands: BulkDeleteBrandsResponseSchema,
	bulkGetOrCreateBrands: BulkGetOrCreateBrandsResponseSchema,
	bulkUpdateProductsByFilter: BulkUpdateProductsByFilterResponseSchema,
	bulkUpdateInventoryItemsByFilter:
		BulkUpdateInventoryItemsByFilterResponseSchema,
	bulkUpdateCustomizations: BulkUpdateCustomizationsResponseSchema,
	bulkCreateProductsWithInventory:
		BulkCreateProductsWithInventoryResponseSchema,
	bulkRemoveInfoSectionsByFilter: BulkRemoveInfoSectionsByFilterResponseSchema,
	deleteCustomization: DeleteCustomizationResponseSchema,
	deleteInfoSection: DeleteInfoSectionResponseSchema,
	deleteProductOptions: DeleteProductOptionsResponseSchema,
	setCustomizationChoices: SetCustomizationChoicesResponseSchema,
	updateInventoryVariants: UpdateInventoryVariantsResponseSchema,
	getCollectionBySlug: GetCollectionBySlugResponseSchema,
	listCurrencies: ListCurrenciesResponseSchema,
	queryCoupons: QueryCouponsResponseSchema,
	deleteBackInStockNotification: DeleteBackInStockNotificationResponseSchema,
	queryEcomOrders: QueryEcomOrdersResponseSchema,
	bulkUpdateOrders: BulkUpdateOrdersResponseSchema,
	bulkUpdateOrderTags: BulkUpdateOrderTagsResponseSchema,
	removeTipFromOrder: RemoveTipFromOrderResponseSchema,
	bulkDeleteAbandonedCheckouts: BulkDeleteAbandonedCheckoutsResponseSchema,
	listInvoicesByOrderIds: ListInvoicesByOrderIdsResponseSchema,
	queryBookingsCategories: QueryBookingsCategoriesResponseSchema,
	deleteBookingsService: DeleteBookingsServiceResponseSchema,
	bulkDeleteBookingsServices: BulkDeleteBookingsServicesResponseSchema,
	bulkDeleteBookingsServicesByFilter:
		BulkDeleteBookingsServicesByFilterResponseSchema,
	deleteBookingsAddOnGroup: DeleteBookingsAddOnGroupResponseSchema,
	queryExtendedBookings: QueryExtendedBookingsResponseSchema,
	countExtendedBookings: CountExtendedBookingsResponseSchema,
	listBookingsSessions: ListBookingsSessionsResponseSchema,
	updateStaffMemberTagsByFilter: UpdateStaffMemberTagsByFilterResponseSchema,
	getMember: GetMemberResponseSchema,
	getMemberPrivacySettings: GetMemberPrivacySettingsResponseSchema,
	getMembersCustomFieldApplications:
		GetMembersCustomFieldApplicationsResponseSchema,
	getRolesCustomFieldApplications:
		GetRolesCustomFieldApplicationsResponseSchema,
	getRolesInfo: GetRolesInfoResponseSchema,
	listMembersCustomFields: ListMembersCustomFieldsResponseSchema,
	listMemberFollowing: ListMemberFollowingResponseSchema,
	listMyMemberFollowers: ListMyMemberFollowersResponseSchema,
	registerMemberV2: RegisterMemberV2ResponseSchema,
	logoutMember: LogoutMemberResponseSchema,
	sendMemberRecoveryEmail: SendMemberRecoveryEmailResponseSchema,
	getSiteProperties: GetSitePropertiesResponseSchema,
	updateBusinessContact: UpdateBusinessContactResponseSchema,
	updateBusinessProfile: UpdateBusinessProfileResponseSchema,
	updateBusinessSchedule: UpdateBusinessScheduleResponseSchema,
	updateLocaleSettings: UpdateLocaleSettingsResponseSchema,
	checkDomainAvailability: CheckDomainAvailabilityResponseSchema,
	getFolderBySite: GetFolderBySiteResponseSchema,
	querySiteFolders: QuerySiteFoldersResponseSchema,
	queryLocations: QueryLocationsResponseSchema,
	getSitePluginsPlacementStatus: GetSitePluginsPlacementStatusResponseSchema,
	listEmailCampaigns: ListEmailCampaignsResponseSchema,
	getSenderDetails: GetSenderDetailsResponseSchema,
	deleteSenderDetails: DeleteSenderDetailsResponseSchema,
	deleteSenderEmail: DeleteSenderEmailResponseSchema,
	updateReferralProgram: UpdateReferralProgramResponseSchema,
	getCurrentMemberCoupons: GetCurrentMemberCouponsResponseSchema,
	deleteLoyaltyCoupon: DeleteLoyaltyCouponResponseSchema,
	enablePointsExpiration: EnablePointsExpirationResponseSchema,
	queryLoyaltyCheckoutDiscounts: QueryLoyaltyCheckoutDiscountsResponseSchema,
	bulkDeleteFormSchemas: BulkDeleteFormSchemasResponseSchema,
	queryDeletedForms: QueryDeletedFormsResponseSchema,
	queryFormSubmissionsByNamespace:
		QueryFormSubmissionsByNamespaceResponseSchema,
	queryFormsFormSubmissions: QueryFormsFormSubmissionsResponseSchema,
	removeDeletedFields: RemoveDeletedFieldsResponseSchema,
	findEvent: FindEventResponseSchema,
	queryEventsGraphql: QueryEventsGraphqlResponseSchema,
	bulkDeleteRsvpsByFilter: BulkDeleteRsvpsByFilterResponseSchema,
	bulkDeleteTicketDefinitions: BulkDeleteTicketDefinitionsResponseSchema,
	deleteTicketCheckIn: DeleteTicketCheckInResponseSchema,
	deleteTicketReservation: DeleteTicketReservationResponseSchema,
	deleteScheduleItem: DeleteScheduleItemResponseSchema,
	deleteScheduleBookmark: DeleteScheduleBookmarkResponseSchema,
	discardDraftSchedule: DiscardDraftScheduleResponseSchema,
	publishDraftSchedule: PublishDraftScheduleResponseSchema,
	rescheduleDraftSchedule: RescheduleDraftScheduleResponseSchema,
	bulkUnassignEventsFromCategories:
		BulkUnassignEventsFromCategoriesResponseSchema,
	deleteRestaurantMenu: DeleteRestaurantMenuResponseSchema,
	bulkDeleteMenuModifiers: BulkDeleteMenuModifiersResponseSchema,
	bulkDeleteMenuVariants: BulkDeleteMenuVariantsResponseSchema,
	listRestaurantCatalogs: ListRestaurantCatalogsResponseSchema,
	bulkDeleteNotificationRecipients:
		BulkDeleteNotificationRecipientsResponseSchema,
	deleteServiceFeeRule: DeleteServiceFeeRuleResponseSchema,
	calculateFirstAvailableSlots: CalculateFirstAvailableSlotsResponseSchema,
	bulkDeleteBillableItems: BulkDeleteBillableItemsResponseSchema,
	bulkUpdateBillableItems: BulkUpdateBillableItemsResponseSchema,
	createTaxRegion: CreateTaxRegionResponseSchema,
	listDefaultTaxGroups: ListDefaultTaxGroupsResponseSchema,
	listDefaultTaxGroupsByAppIds: ListDefaultTaxGroupsByAppIdsResponseSchema,
	listManualTaxMappings: ListManualTaxMappingsResponseSchema,
	queryManualTaxMappings: QueryManualTaxMappingsResponseSchema,
	queryTaxGroups: QueryTaxGroupsResponseSchema,
	deleteReceiptPreset: DeleteReceiptPresetResponseSchema,
	setDefaultReceiptPreset: SetDefaultReceiptPresetResponseSchema,
	updateReceiptPreset: UpdateReceiptPresetResponseSchema,
	addSpecialPermissions: AddSpecialPermissionsResponseSchema,
	cancelBackgroundTask: CancelBackgroundTaskResponseSchema,
	deleteDataCollectionField: DeleteDataCollectionFieldResponseSchema,
	deleteUserDefinedFields: DeleteUserDefinedFieldsResponseSchema,
	generateFileUploadUrl: GenerateFileUploadUrlResponseSchema,
	generateFilesDownloadUrl: GenerateFilesDownloadUrlResponseSchema,
	importFileToMedia: ImportFileToMediaResponseSchema,
	cancelAutomationEvent: CancelAutomationEventResponseSchema,
	bulkUpdateStorageItemTags: BulkUpdateStorageItemTagsResponseSchema,
	bulkUpdateStorageItemTagsByFilter:
		BulkUpdateStorageItemTagsByFilterResponseSchema,
	checkContent: CheckContentResponseSchema,
	queryModerationRules: QueryModerationRulesResponseSchema,
	updateModerationRule: UpdateModerationRuleResponseSchema,
	listGroupRequests: ListGroupRequestsResponseSchema,
	queryGroupRequests: QueryGroupRequestsResponseSchema,
	deleteFaqCategory: DeleteFaqCategoryResponseSchema,
	deleteQuestionEntry: DeleteQuestionEntryResponseSchema,
	updateQuestionEntryLabels: UpdateQuestionEntryLabelsResponseSchema,
	updateReviewModerationStatus: UpdateReviewModerationStatusResponseSchema,
	bulkUpdateReviewModerationStatus:
		BulkUpdateReviewModerationStatusResponseSchema,
	deleteProject: DeleteProjectResponseSchema,
	deleteProjectItem: DeleteProjectItemResponseSchema,
	bulkDeleteBenefitItems: BulkDeleteBenefitItemsResponseSchema,
	bulkDeleteBenefitItemsByFilter: BulkDeleteBenefitItemsByFilterResponseSchema,
	bulkDeletePoolDefinitions: BulkDeletePoolDefinitionsResponseSchema,
	deleteProgramDefinition: DeleteProgramDefinitionResponseSchema,
	bulkDeleteTranslationContent: BulkDeleteTranslationContentResponseSchema,
	bulkUpdateTranslationContentByKey:
		BulkUpdateTranslationContentByKeyResponseSchema,
	getAppInstance: GetAppInstanceResponseSchema,
	listAppPermissions: ListAppPermissionsResponseSchema,
	listAppPlansByAppId: ListAppPlansByAppIdResponseSchema,
	getPurchaseHistory: GetPurchaseHistoryResponseSchema,
	deleteSecret: DeleteSecretResponseSchema,
	deleteUserFavorite: DeleteUserFavoriteResponseSchema,
	bulkDeleteReportsByFilter: BulkDeleteReportsByFilterResponseSchema,
	updateOperationGroupTagsByFilter:
		UpdateOperationGroupTagsByFilterResponseSchema,
} as const;

export type WixEndpointInputs = {
	[K in keyof typeof WixEndpointInputSchemas]: z.infer<
		(typeof WixEndpointInputSchemas)[K]
	>;
};

export type WixEndpointOutputs = {
	[K in keyof typeof WixEndpointOutputSchemas]: z.infer<
		(typeof WixEndpointOutputSchemas)[K]
	>;
};
