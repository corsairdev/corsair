import { z } from 'zod';

/**
 * Booqable API v4 returns JSON:API documents by default
 * (see https://developers.booqable.com/v4.html — "Response types"):
 * `{ data, included?, links?, meta? }` where `data` is a single resource
 * or an array of resources, and every resource carries
 * `{ id, type, attributes?, relationships? }` with `type` equal to the
 * plural path segment (e.g. `"orders"`, `"customers"`).
 *
 * Attributes/relationships stay loose records: the API is still in beta and
 * may add fields, so per-field attribute contracts would be brittle and are
 * intentionally not pinned here. The endpoint-specific part of each contract
 * is the envelope shape (single vs collection) plus the `type` literal.
 */
// `unknown` values below are intentional: JSON:API attributes/relationships/
// links/meta are provider-defined open objects, so keys are validated while
// values stay provider-defined instead of being forced through `any`.
const BooqableAttributesSchema = z.record(z.string(), z.unknown());
const BooqableRelationshipsSchema = z.record(z.string(), z.unknown());
const BooqableLinksSchema = z.record(z.string(), z.unknown());
const BooqableMetaSchema = z.record(z.string(), z.unknown());

const BooqableIncludedResourceSchema = z
	.object({
		id: z.string(),
		type: z.string(),
		attributes: BooqableAttributesSchema.optional(),
		relationships: BooqableRelationshipsSchema.optional(),
	})
	.loose();

function booqableResourceSchema<TType extends string>(type: TType) {
	return z
		.object({
			id: z.string(),
			type: z.literal(type),
			attributes: BooqableAttributesSchema.optional(),
			relationships: BooqableRelationshipsSchema.optional(),
		})
		.loose();
}

function booqableSingleResponseSchema<TType extends string>(type: TType) {
	return z
		.object({
			data: booqableResourceSchema(type),
			included: z.array(BooqableIncludedResourceSchema).optional(),
			links: BooqableLinksSchema.optional(),
			meta: BooqableMetaSchema.optional(),
		})
		.loose();
}

function booqableCollectionResponseSchema<TType extends string>(type: TType) {
	return z
		.object({
			data: z.array(booqableResourceSchema(type)),
			included: z.array(BooqableIncludedResourceSchema).optional(),
			links: BooqableLinksSchema.optional(),
			meta: BooqableMetaSchema.optional(),
		})
		.loose();
}

/**
 * Archive (DELETE) endpoints return the archived resource as a single
 * JSON:API document. `data: null` is additionally accepted per JSON:API
 * single-resource nullability so a tombstone response still validates.
 */
function booqableArchivedResponseSchema<TType extends string>(type: TType) {
	return z.union([
		booqableSingleResponseSchema(type),
		z
			.object({
				data: z.null(),
				links: BooqableLinksSchema.optional(),
				meta: BooqableMetaSchema.optional(),
			})
			.loose(),
	]);
}

// `unknown` is intentional here: request bodies are provider-defined
// JSON:API payloads (resource objects, search filter groups), so the shape
// cannot be pinned per endpoint without blocking valid provider fields.
const BooqableOptionalBodySchema = z.unknown().optional();

// `unknown` values are intentional here: `query` carries provider-defined
// filter/sort/field/phenotype params such as `page[number]`, `page[size]`
// and `filter[...]` operators, so values stay provider-defined.
const BooqableQuerySchema = z.record(z.string(), z.unknown()).optional();

const BooqableBaseInputFields = {
	companySlug: z.string().optional(),
	body: BooqableOptionalBodySchema,
	query: BooqableQuerySchema,
	headers: z.record(z.string(), z.string()).optional(),
};

const createCustomerInputSchema = z.object({
	companySlug: z.string().optional(),
	body: BooqableOptionalBodySchema,
	query: BooqableQuerySchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type createCustomerInput = z.infer<typeof createCustomerInputSchema>;
const createCustomerResponseSchema = booqableSingleResponseSchema('customers');
export type createCustomerResponse = z.infer<
	typeof createCustomerResponseSchema
>;

const deleteCustomerInputSchema = z.object({
	id: z.string(),
	companySlug: z.string().optional(),
	body: BooqableOptionalBodySchema,
	query: BooqableQuerySchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type deleteCustomerInput = z.infer<typeof deleteCustomerInputSchema>;
const deleteCustomerResponseSchema =
	booqableArchivedResponseSchema('customers');
export type deleteCustomerResponse = z.infer<
	typeof deleteCustomerResponseSchema
>;

const getCustomerInputSchema = z.object({
	id: z.string(),
	companySlug: z.string().optional(),
	body: BooqableOptionalBodySchema,
	query: BooqableQuerySchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type getCustomerInput = z.infer<typeof getCustomerInputSchema>;
const getCustomerResponseSchema = booqableSingleResponseSchema('customers');
export type getCustomerResponse = z.infer<typeof getCustomerResponseSchema>;

const getCustomersInputSchema = z.object({
	companySlug: z.string().optional(),
	body: BooqableOptionalBodySchema,
	query: BooqableQuerySchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type getCustomersInput = z.infer<typeof getCustomersInputSchema>;
const getCustomersResponseSchema =
	booqableCollectionResponseSchema('customers');
export type getCustomersResponse = z.infer<typeof getCustomersResponseSchema>;

const searchCustomersInputSchema = z.object({
	companySlug: z.string().optional(),
	body: BooqableOptionalBodySchema,
	query: BooqableQuerySchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type searchCustomersInput = z.infer<typeof searchCustomersInputSchema>;
const searchCustomersResponseSchema =
	booqableCollectionResponseSchema('customers');
export type searchCustomersResponse = z.infer<
	typeof searchCustomersResponseSchema
>;

const createOrderInputSchema = z.object({
	companySlug: z.string().optional(),
	body: BooqableOptionalBodySchema,
	query: BooqableQuerySchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type createOrderInput = z.infer<typeof createOrderInputSchema>;
const createOrderResponseSchema = booqableSingleResponseSchema('orders');
export type createOrderResponse = z.infer<typeof createOrderResponseSchema>;

const deleteOrderInputSchema = z.object({
	id: z.string(),
	companySlug: z.string().optional(),
	body: BooqableOptionalBodySchema,
	query: BooqableQuerySchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type deleteOrderInput = z.infer<typeof deleteOrderInputSchema>;
const deleteOrderResponseSchema = booqableArchivedResponseSchema('orders');
export type deleteOrderResponse = z.infer<typeof deleteOrderResponseSchema>;

const getNewOrderInputSchema = z.object({
	companySlug: z.string().optional(),
	body: BooqableOptionalBodySchema,
	query: BooqableQuerySchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type getNewOrderInput = z.infer<typeof getNewOrderInputSchema>;
const getNewOrderResponseSchema = booqableSingleResponseSchema('orders');
export type getNewOrderResponse = z.infer<typeof getNewOrderResponseSchema>;

const getOrderInputSchema = z.object({
	id: z.string(),
	companySlug: z.string().optional(),
	body: BooqableOptionalBodySchema,
	query: BooqableQuerySchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type getOrderInput = z.infer<typeof getOrderInputSchema>;
const getOrderResponseSchema = booqableSingleResponseSchema('orders');
export type getOrderResponse = z.infer<typeof getOrderResponseSchema>;

const listOrdersInputSchema = z.object({
	companySlug: z.string().optional(),
	body: BooqableOptionalBodySchema,
	query: BooqableQuerySchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type listOrdersInput = z.infer<typeof listOrdersInputSchema>;
const listOrdersResponseSchema = booqableCollectionResponseSchema('orders');
export type listOrdersResponse = z.infer<typeof listOrdersResponseSchema>;

const searchOrdersInputSchema = z.object({
	companySlug: z.string().optional(),
	body: BooqableOptionalBodySchema,
	query: BooqableQuerySchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type searchOrdersInput = z.infer<typeof searchOrdersInputSchema>;
const searchOrdersResponseSchema = booqableCollectionResponseSchema('orders');
export type searchOrdersResponse = z.infer<typeof searchOrdersResponseSchema>;

const createProductGroupInputSchema = z.object({
	companySlug: z.string().optional(),
	body: BooqableOptionalBodySchema,
	query: BooqableQuerySchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type createProductGroupInput = z.infer<
	typeof createProductGroupInputSchema
>;
const createProductGroupResponseSchema =
	booqableSingleResponseSchema('product_groups');
export type createProductGroupResponse = z.infer<
	typeof createProductGroupResponseSchema
>;

const deleteProductGroupInputSchema = z.object({
	id: z.string(),
	companySlug: z.string().optional(),
	body: BooqableOptionalBodySchema,
	query: BooqableQuerySchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type deleteProductGroupInput = z.infer<
	typeof deleteProductGroupInputSchema
>;
const deleteProductGroupResponseSchema =
	booqableArchivedResponseSchema('product_groups');
export type deleteProductGroupResponse = z.infer<
	typeof deleteProductGroupResponseSchema
>;

const getProductGroupInputSchema = z.object({
	id: z.string(),
	companySlug: z.string().optional(),
	body: BooqableOptionalBodySchema,
	query: BooqableQuerySchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type getProductGroupInput = z.infer<typeof getProductGroupInputSchema>;
const getProductGroupResponseSchema =
	booqableSingleResponseSchema('product_groups');
export type getProductGroupResponse = z.infer<
	typeof getProductGroupResponseSchema
>;

const listProductGroupsInputSchema = z.object({
	companySlug: z.string().optional(),
	body: BooqableOptionalBodySchema,
	query: BooqableQuerySchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type listProductGroupsInput = z.infer<
	typeof listProductGroupsInputSchema
>;
const listProductGroupsResponseSchema =
	booqableCollectionResponseSchema('product_groups');
export type listProductGroupsResponse = z.infer<
	typeof listProductGroupsResponseSchema
>;

const getProductInputSchema = z.object({
	id: z.string(),
	companySlug: z.string().optional(),
	body: BooqableOptionalBodySchema,
	query: BooqableQuerySchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type getProductInput = z.infer<typeof getProductInputSchema>;
const getProductResponseSchema = booqableSingleResponseSchema('products');
export type getProductResponse = z.infer<typeof getProductResponseSchema>;

const listProductsInputSchema = z.object({
	companySlug: z.string().optional(),
	body: BooqableOptionalBodySchema,
	query: BooqableQuerySchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type listProductsInput = z.infer<typeof listProductsInputSchema>;
const listProductsResponseSchema = booqableCollectionResponseSchema('products');
export type listProductsResponse = z.infer<typeof listProductsResponseSchema>;

const updateCompanyInputSchema = z.object({
	companySlug: z.string().optional(),
	body: BooqableOptionalBodySchema,
	query: BooqableQuerySchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type updateCompanyInput = z.infer<typeof updateCompanyInputSchema>;
const updateCompanyResponseSchema = booqableSingleResponseSchema('companies');
export type updateCompanyResponse = z.infer<typeof updateCompanyResponseSchema>;

const getInventoryLevelsInputSchema = z.object({
	companySlug: z.string().optional(),
	body: BooqableOptionalBodySchema,
	query: BooqableQuerySchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type getInventoryLevelsInput = z.infer<
	typeof getInventoryLevelsInputSchema
>;
const getInventoryLevelsResponseSchema =
	booqableCollectionResponseSchema('inventory_levels');
export type getInventoryLevelsResponse = z.infer<
	typeof getInventoryLevelsResponseSchema
>;

const listBarcodesInputSchema = z.object({
	companySlug: z.string().optional(),
	body: BooqableOptionalBodySchema,
	query: BooqableQuerySchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type listBarcodesInput = z.infer<typeof listBarcodesInputSchema>;
const listBarcodesResponseSchema = booqableCollectionResponseSchema('barcodes');
export type listBarcodesResponse = z.infer<typeof listBarcodesResponseSchema>;

const listBundleItemsInputSchema = z.object({
	companySlug: z.string().optional(),
	body: BooqableOptionalBodySchema,
	query: BooqableQuerySchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type listBundleItemsInput = z.infer<typeof listBundleItemsInputSchema>;
const listBundleItemsResponseSchema =
	booqableCollectionResponseSchema('bundle_items');
export type listBundleItemsResponse = z.infer<
	typeof listBundleItemsResponseSchema
>;

const searchBundlesInputSchema = z.object({
	companySlug: z.string().optional(),
	body: BooqableOptionalBodySchema,
	query: BooqableQuerySchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type searchBundlesInput = z.infer<typeof searchBundlesInputSchema>;
const searchBundlesResponseSchema = booqableCollectionResponseSchema('bundles');
export type searchBundlesResponse = z.infer<typeof searchBundlesResponseSchema>;

const listClustersInputSchema = z.object({
	companySlug: z.string().optional(),
	body: BooqableOptionalBodySchema,
	query: BooqableQuerySchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type listClustersInput = z.infer<typeof listClustersInputSchema>;
const listClustersResponseSchema = booqableCollectionResponseSchema('clusters');
export type listClustersResponse = z.infer<typeof listClustersResponseSchema>;

const listCouponsInputSchema = z.object({
	companySlug: z.string().optional(),
	body: BooqableOptionalBodySchema,
	query: BooqableQuerySchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type listCouponsInput = z.infer<typeof listCouponsInputSchema>;
const listCouponsResponseSchema = booqableCollectionResponseSchema('coupons');
export type listCouponsResponse = z.infer<typeof listCouponsResponseSchema>;

const listDefaultPropertiesInputSchema = z.object({
	companySlug: z.string().optional(),
	body: BooqableOptionalBodySchema,
	query: BooqableQuerySchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type listDefaultPropertiesInput = z.infer<
	typeof listDefaultPropertiesInputSchema
>;
const listDefaultPropertiesResponseSchema =
	booqableCollectionResponseSchema('default_properties');
export type listDefaultPropertiesResponse = z.infer<
	typeof listDefaultPropertiesResponseSchema
>;

const listDocumentsInputSchema = z.object({
	companySlug: z.string().optional(),
	body: BooqableOptionalBodySchema,
	query: BooqableQuerySchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type listDocumentsInput = z.infer<typeof listDocumentsInputSchema>;
const listDocumentsResponseSchema =
	booqableCollectionResponseSchema('documents');
export type listDocumentsResponse = z.infer<typeof listDocumentsResponseSchema>;

const searchDocumentsInputSchema = z.object({
	companySlug: z.string().optional(),
	body: BooqableOptionalBodySchema,
	query: BooqableQuerySchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type searchDocumentsInput = z.infer<typeof searchDocumentsInputSchema>;
const searchDocumentsResponseSchema =
	booqableCollectionResponseSchema('documents');
export type searchDocumentsResponse = z.infer<
	typeof searchDocumentsResponseSchema
>;

const listEmailTemplatesInputSchema = z.object({
	companySlug: z.string().optional(),
	body: BooqableOptionalBodySchema,
	query: BooqableQuerySchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type listEmailTemplatesInput = z.infer<
	typeof listEmailTemplatesInputSchema
>;
const listEmailTemplatesResponseSchema =
	booqableCollectionResponseSchema('email_templates');
export type listEmailTemplatesResponse = z.infer<
	typeof listEmailTemplatesResponseSchema
>;

const listEmployeesInputSchema = z.object({
	companySlug: z.string().optional(),
	body: BooqableOptionalBodySchema,
	query: BooqableQuerySchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type listEmployeesInput = z.infer<typeof listEmployeesInputSchema>;
const listEmployeesResponseSchema =
	booqableCollectionResponseSchema('employees');
export type listEmployeesResponse = z.infer<typeof listEmployeesResponseSchema>;

const listInventoryBreakdownsInputSchema = z.object({
	companySlug: z.string().optional(),
	body: BooqableOptionalBodySchema,
	query: BooqableQuerySchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type listInventoryBreakdownsInput = z.infer<
	typeof listInventoryBreakdownsInputSchema
>;
const listInventoryBreakdownsResponseSchema = booqableCollectionResponseSchema(
	'inventory_breakdowns',
);
export type listInventoryBreakdownsResponse = z.infer<
	typeof listInventoryBreakdownsResponseSchema
>;

const listItemsInputSchema = z.object({
	companySlug: z.string().optional(),
	body: BooqableOptionalBodySchema,
	query: BooqableQuerySchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type listItemsInput = z.infer<typeof listItemsInputSchema>;
const listItemsResponseSchema = booqableCollectionResponseSchema('items');
export type listItemsResponse = z.infer<typeof listItemsResponseSchema>;

const searchItemsInputSchema = z.object({
	companySlug: z.string().optional(),
	body: BooqableOptionalBodySchema,
	query: BooqableQuerySchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type searchItemsInput = z.infer<typeof searchItemsInputSchema>;
const searchItemsResponseSchema = booqableCollectionResponseSchema('items');
export type searchItemsResponse = z.infer<typeof searchItemsResponseSchema>;

const listLinesInputSchema = z.object({
	companySlug: z.string().optional(),
	body: BooqableOptionalBodySchema,
	query: BooqableQuerySchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type listLinesInput = z.infer<typeof listLinesInputSchema>;
const listLinesResponseSchema = booqableCollectionResponseSchema('lines');
export type listLinesResponse = z.infer<typeof listLinesResponseSchema>;

const listLocationsInputSchema = z.object({
	companySlug: z.string().optional(),
	body: BooqableOptionalBodySchema,
	query: BooqableQuerySchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type listLocationsInput = z.infer<typeof listLocationsInputSchema>;
const listLocationsResponseSchema =
	booqableCollectionResponseSchema('locations');
export type listLocationsResponse = z.infer<typeof listLocationsResponseSchema>;

const listNotesInputSchema = z.object({
	companySlug: z.string().optional(),
	body: BooqableOptionalBodySchema,
	query: BooqableQuerySchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type listNotesInput = z.infer<typeof listNotesInputSchema>;
const listNotesResponseSchema = booqableCollectionResponseSchema('notes');
export type listNotesResponse = z.infer<typeof listNotesResponseSchema>;

const listPaymentMethodsInputSchema = z.object({
	companySlug: z.string().optional(),
	body: BooqableOptionalBodySchema,
	query: BooqableQuerySchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type listPaymentMethodsInput = z.infer<
	typeof listPaymentMethodsInputSchema
>;
const listPaymentMethodsResponseSchema =
	booqableCollectionResponseSchema('payment_methods');
export type listPaymentMethodsResponse = z.infer<
	typeof listPaymentMethodsResponseSchema
>;

const listPaymentsInputSchema = z.object({
	companySlug: z.string().optional(),
	body: BooqableOptionalBodySchema,
	query: BooqableQuerySchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type listPaymentsInput = z.infer<typeof listPaymentsInputSchema>;
const listPaymentsResponseSchema = booqableCollectionResponseSchema('payments');
export type listPaymentsResponse = z.infer<typeof listPaymentsResponseSchema>;

const listPhotosInputSchema = z.object({
	companySlug: z.string().optional(),
	body: BooqableOptionalBodySchema,
	query: BooqableQuerySchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type listPhotosInput = z.infer<typeof listPhotosInputSchema>;
const listPhotosResponseSchema = booqableCollectionResponseSchema('photos');
export type listPhotosResponse = z.infer<typeof listPhotosResponseSchema>;

const listPlanningsInputSchema = z.object({
	companySlug: z.string().optional(),
	body: BooqableOptionalBodySchema,
	query: BooqableQuerySchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type listPlanningsInput = z.infer<typeof listPlanningsInputSchema>;
const listPlanningsResponseSchema =
	booqableCollectionResponseSchema('plannings');
export type listPlanningsResponse = z.infer<typeof listPlanningsResponseSchema>;

const searchPlanningsInputSchema = z.object({
	companySlug: z.string().optional(),
	body: BooqableOptionalBodySchema,
	query: BooqableQuerySchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type searchPlanningsInput = z.infer<typeof searchPlanningsInputSchema>;
const searchPlanningsResponseSchema =
	booqableCollectionResponseSchema('plannings');
export type searchPlanningsResponse = z.infer<
	typeof searchPlanningsResponseSchema
>;

const listPriceRulesetsInputSchema = z.object({
	companySlug: z.string().optional(),
	body: BooqableOptionalBodySchema,
	query: BooqableQuerySchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type listPriceRulesetsInput = z.infer<
	typeof listPriceRulesetsInputSchema
>;
const listPriceRulesetsResponseSchema =
	booqableCollectionResponseSchema('price_rulesets');
export type listPriceRulesetsResponse = z.infer<
	typeof listPriceRulesetsResponseSchema
>;

const listPriceStructuresInputSchema = z.object({
	companySlug: z.string().optional(),
	body: BooqableOptionalBodySchema,
	query: BooqableQuerySchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type listPriceStructuresInput = z.infer<
	typeof listPriceStructuresInputSchema
>;
const listPriceStructuresResponseSchema =
	booqableCollectionResponseSchema('price_structures');
export type listPriceStructuresResponse = z.infer<
	typeof listPriceStructuresResponseSchema
>;

const listPropertiesInputSchema = z.object({
	companySlug: z.string().optional(),
	body: BooqableOptionalBodySchema,
	query: BooqableQuerySchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type listPropertiesInput = z.infer<typeof listPropertiesInputSchema>;
const listPropertiesResponseSchema =
	booqableCollectionResponseSchema('properties');
export type listPropertiesResponse = z.infer<
	typeof listPropertiesResponseSchema
>;

const listProvincesInputSchema = z.object({
	companySlug: z.string().optional(),
	body: BooqableOptionalBodySchema,
	query: BooqableQuerySchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type listProvincesInput = z.infer<typeof listProvincesInputSchema>;
const listProvincesResponseSchema =
	booqableCollectionResponseSchema('provinces');
export type listProvincesResponse = z.infer<typeof listProvincesResponseSchema>;

const listStockItemPlanningsInputSchema = z.object({
	companySlug: z.string().optional(),
	body: BooqableOptionalBodySchema,
	query: BooqableQuerySchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type listStockItemPlanningsInput = z.infer<
	typeof listStockItemPlanningsInputSchema
>;
const listStockItemPlanningsResponseSchema = booqableCollectionResponseSchema(
	'stock_item_plannings',
);
export type listStockItemPlanningsResponse = z.infer<
	typeof listStockItemPlanningsResponseSchema
>;

const listStockItemsInputSchema = z.object({
	companySlug: z.string().optional(),
	body: BooqableOptionalBodySchema,
	query: BooqableQuerySchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type listStockItemsInput = z.infer<typeof listStockItemsInputSchema>;
const listStockItemsResponseSchema =
	booqableCollectionResponseSchema('stock_items');
export type listStockItemsResponse = z.infer<
	typeof listStockItemsResponseSchema
>;

const listTaxRatesInputSchema = z.object({
	companySlug: z.string().optional(),
	body: BooqableOptionalBodySchema,
	query: BooqableQuerySchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type listTaxRatesInput = z.infer<typeof listTaxRatesInputSchema>;
const listTaxRatesResponseSchema =
	booqableCollectionResponseSchema('tax_rates');
export type listTaxRatesResponse = z.infer<typeof listTaxRatesResponseSchema>;

const listTaxValuesInputSchema = z.object({
	companySlug: z.string().optional(),
	body: BooqableOptionalBodySchema,
	query: BooqableQuerySchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type listTaxValuesInput = z.infer<typeof listTaxValuesInputSchema>;
const listTaxValuesResponseSchema =
	booqableCollectionResponseSchema('tax_values');
export type listTaxValuesResponse = z.infer<typeof listTaxValuesResponseSchema>;

const listUsersInputSchema = z.object({
	companySlug: z.string().optional(),
	body: BooqableOptionalBodySchema,
	query: BooqableQuerySchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type listUsersInput = z.infer<typeof listUsersInputSchema>;
const listUsersResponseSchema = booqableCollectionResponseSchema('users');
export type listUsersResponse = z.infer<typeof listUsersResponseSchema>;

export type BooqableEndpointInputs = {
	createCustomer: createCustomerInput;
	deleteCustomer: deleteCustomerInput;
	getCustomer: getCustomerInput;
	getCustomers: getCustomersInput;
	searchCustomers: searchCustomersInput;
	createOrder: createOrderInput;
	deleteOrder: deleteOrderInput;
	getNewOrder: getNewOrderInput;
	getOrder: getOrderInput;
	listOrders: listOrdersInput;
	searchOrders: searchOrdersInput;
	createProductGroup: createProductGroupInput;
	deleteProductGroup: deleteProductGroupInput;
	getProductGroup: getProductGroupInput;
	listProductGroups: listProductGroupsInput;
	getProduct: getProductInput;
	listProducts: listProductsInput;
	updateCompany: updateCompanyInput;
	getInventoryLevels: getInventoryLevelsInput;
	listBarcodes: listBarcodesInput;
	listBundleItems: listBundleItemsInput;
	searchBundles: searchBundlesInput;
	listClusters: listClustersInput;
	listCoupons: listCouponsInput;
	listDefaultProperties: listDefaultPropertiesInput;
	listDocuments: listDocumentsInput;
	searchDocuments: searchDocumentsInput;
	listEmailTemplates: listEmailTemplatesInput;
	listEmployees: listEmployeesInput;
	listInventoryBreakdowns: listInventoryBreakdownsInput;
	listItems: listItemsInput;
	searchItems: searchItemsInput;
	listLines: listLinesInput;
	listLocations: listLocationsInput;
	listNotes: listNotesInput;
	listPaymentMethods: listPaymentMethodsInput;
	listPayments: listPaymentsInput;
	listPhotos: listPhotosInput;
	listPlannings: listPlanningsInput;
	searchPlannings: searchPlanningsInput;
	listPriceRulesets: listPriceRulesetsInput;
	listPriceStructures: listPriceStructuresInput;
	listProperties: listPropertiesInput;
	listProvinces: listProvincesInput;
	listStockItemPlannings: listStockItemPlanningsInput;
	listStockItems: listStockItemsInput;
	listTaxRates: listTaxRatesInput;
	listTaxValues: listTaxValuesInput;
	listUsers: listUsersInput;
};

export type BooqableEndpointOutputs = {
	createCustomer: createCustomerResponse;
	deleteCustomer: deleteCustomerResponse;
	getCustomer: getCustomerResponse;
	getCustomers: getCustomersResponse;
	searchCustomers: searchCustomersResponse;
	createOrder: createOrderResponse;
	deleteOrder: deleteOrderResponse;
	getNewOrder: getNewOrderResponse;
	getOrder: getOrderResponse;
	listOrders: listOrdersResponse;
	searchOrders: searchOrdersResponse;
	createProductGroup: createProductGroupResponse;
	deleteProductGroup: deleteProductGroupResponse;
	getProductGroup: getProductGroupResponse;
	listProductGroups: listProductGroupsResponse;
	getProduct: getProductResponse;
	listProducts: listProductsResponse;
	updateCompany: updateCompanyResponse;
	getInventoryLevels: getInventoryLevelsResponse;
	listBarcodes: listBarcodesResponse;
	listBundleItems: listBundleItemsResponse;
	searchBundles: searchBundlesResponse;
	listClusters: listClustersResponse;
	listCoupons: listCouponsResponse;
	listDefaultProperties: listDefaultPropertiesResponse;
	listDocuments: listDocumentsResponse;
	searchDocuments: searchDocumentsResponse;
	listEmailTemplates: listEmailTemplatesResponse;
	listEmployees: listEmployeesResponse;
	listInventoryBreakdowns: listInventoryBreakdownsResponse;
	listItems: listItemsResponse;
	searchItems: searchItemsResponse;
	listLines: listLinesResponse;
	listLocations: listLocationsResponse;
	listNotes: listNotesResponse;
	listPaymentMethods: listPaymentMethodsResponse;
	listPayments: listPaymentsResponse;
	listPhotos: listPhotosResponse;
	listPlannings: listPlanningsResponse;
	searchPlannings: searchPlanningsResponse;
	listPriceRulesets: listPriceRulesetsResponse;
	listPriceStructures: listPriceStructuresResponse;
	listProperties: listPropertiesResponse;
	listProvinces: listProvincesResponse;
	listStockItemPlannings: listStockItemPlanningsResponse;
	listStockItems: listStockItemsResponse;
	listTaxRates: listTaxRatesResponse;
	listTaxValues: listTaxValuesResponse;
	listUsers: listUsersResponse;
};

export const BooqableEndpointInputSchemas = {
	createCustomer: createCustomerInputSchema,
	deleteCustomer: deleteCustomerInputSchema,
	getCustomer: getCustomerInputSchema,
	getCustomers: getCustomersInputSchema,
	searchCustomers: searchCustomersInputSchema,
	createOrder: createOrderInputSchema,
	deleteOrder: deleteOrderInputSchema,
	getNewOrder: getNewOrderInputSchema,
	getOrder: getOrderInputSchema,
	listOrders: listOrdersInputSchema,
	searchOrders: searchOrdersInputSchema,
	createProductGroup: createProductGroupInputSchema,
	deleteProductGroup: deleteProductGroupInputSchema,
	getProductGroup: getProductGroupInputSchema,
	listProductGroups: listProductGroupsInputSchema,
	getProduct: getProductInputSchema,
	listProducts: listProductsInputSchema,
	updateCompany: updateCompanyInputSchema,
	getInventoryLevels: getInventoryLevelsInputSchema,
	listBarcodes: listBarcodesInputSchema,
	listBundleItems: listBundleItemsInputSchema,
	searchBundles: searchBundlesInputSchema,
	listClusters: listClustersInputSchema,
	listCoupons: listCouponsInputSchema,
	listDefaultProperties: listDefaultPropertiesInputSchema,
	listDocuments: listDocumentsInputSchema,
	searchDocuments: searchDocumentsInputSchema,
	listEmailTemplates: listEmailTemplatesInputSchema,
	listEmployees: listEmployeesInputSchema,
	listInventoryBreakdowns: listInventoryBreakdownsInputSchema,
	listItems: listItemsInputSchema,
	searchItems: searchItemsInputSchema,
	listLines: listLinesInputSchema,
	listLocations: listLocationsInputSchema,
	listNotes: listNotesInputSchema,
	listPaymentMethods: listPaymentMethodsInputSchema,
	listPayments: listPaymentsInputSchema,
	listPhotos: listPhotosInputSchema,
	listPlannings: listPlanningsInputSchema,
	searchPlannings: searchPlanningsInputSchema,
	listPriceRulesets: listPriceRulesetsInputSchema,
	listPriceStructures: listPriceStructuresInputSchema,
	listProperties: listPropertiesInputSchema,
	listProvinces: listProvincesInputSchema,
	listStockItemPlannings: listStockItemPlanningsInputSchema,
	listStockItems: listStockItemsInputSchema,
	listTaxRates: listTaxRatesInputSchema,
	listTaxValues: listTaxValuesInputSchema,
	listUsers: listUsersInputSchema,
} as const;

export const BooqableEndpointOutputSchemas = {
	createCustomer: createCustomerResponseSchema,
	deleteCustomer: deleteCustomerResponseSchema,
	getCustomer: getCustomerResponseSchema,
	getCustomers: getCustomersResponseSchema,
	searchCustomers: searchCustomersResponseSchema,
	createOrder: createOrderResponseSchema,
	deleteOrder: deleteOrderResponseSchema,
	getNewOrder: getNewOrderResponseSchema,
	getOrder: getOrderResponseSchema,
	listOrders: listOrdersResponseSchema,
	searchOrders: searchOrdersResponseSchema,
	createProductGroup: createProductGroupResponseSchema,
	deleteProductGroup: deleteProductGroupResponseSchema,
	getProductGroup: getProductGroupResponseSchema,
	listProductGroups: listProductGroupsResponseSchema,
	getProduct: getProductResponseSchema,
	listProducts: listProductsResponseSchema,
	updateCompany: updateCompanyResponseSchema,
	getInventoryLevels: getInventoryLevelsResponseSchema,
	listBarcodes: listBarcodesResponseSchema,
	listBundleItems: listBundleItemsResponseSchema,
	searchBundles: searchBundlesResponseSchema,
	listClusters: listClustersResponseSchema,
	listCoupons: listCouponsResponseSchema,
	listDefaultProperties: listDefaultPropertiesResponseSchema,
	listDocuments: listDocumentsResponseSchema,
	searchDocuments: searchDocumentsResponseSchema,
	listEmailTemplates: listEmailTemplatesResponseSchema,
	listEmployees: listEmployeesResponseSchema,
	listInventoryBreakdowns: listInventoryBreakdownsResponseSchema,
	listItems: listItemsResponseSchema,
	searchItems: searchItemsResponseSchema,
	listLines: listLinesResponseSchema,
	listLocations: listLocationsResponseSchema,
	listNotes: listNotesResponseSchema,
	listPaymentMethods: listPaymentMethodsResponseSchema,
	listPayments: listPaymentsResponseSchema,
	listPhotos: listPhotosResponseSchema,
	listPlannings: listPlanningsResponseSchema,
	searchPlannings: searchPlanningsResponseSchema,
	listPriceRulesets: listPriceRulesetsResponseSchema,
	listPriceStructures: listPriceStructuresResponseSchema,
	listProperties: listPropertiesResponseSchema,
	listProvinces: listProvincesResponseSchema,
	listStockItemPlannings: listStockItemPlanningsResponseSchema,
	listStockItems: listStockItemsResponseSchema,
	listTaxRates: listTaxRatesResponseSchema,
	listTaxValues: listTaxValuesResponseSchema,
	listUsers: listUsersResponseSchema,
} as const;

export type BooqableEndpointInput =
	BooqableEndpointInputs[keyof BooqableEndpointInputs] & {
		// `unknown` is intentional here: the factory reads camelCase/snake_case
		// aliases and provider filter params off this index at runtime, so the
		// value type stays open and is narrowed per use-site instead.
		[key: string]: unknown;
	};
