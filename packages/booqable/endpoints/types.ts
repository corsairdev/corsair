import { z } from 'zod';

const BooqableResponseSchema = z.unknown();
const BooqableOptionalBodySchema = z.unknown().optional();

const BooqableBaseInputFields = {
	companySlug: z.string().optional(),
	body: BooqableOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
};

const createCustomerInputSchema = z.object({
	companySlug: z.string().optional(),
	body: BooqableOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type createCustomerInput = z.infer<typeof createCustomerInputSchema>;
const createCustomerResponseSchema = BooqableResponseSchema;
export type createCustomerResponse = z.infer<
	typeof createCustomerResponseSchema
>;

const deleteCustomerInputSchema = z.object({
	id: z.string(),
	companySlug: z.string().optional(),
	body: BooqableOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type deleteCustomerInput = z.infer<typeof deleteCustomerInputSchema>;
const deleteCustomerResponseSchema = BooqableResponseSchema;
export type deleteCustomerResponse = z.infer<
	typeof deleteCustomerResponseSchema
>;

const getCustomerInputSchema = z.object({
	id: z.string(),
	companySlug: z.string().optional(),
	body: BooqableOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type getCustomerInput = z.infer<typeof getCustomerInputSchema>;
const getCustomerResponseSchema = BooqableResponseSchema;
export type getCustomerResponse = z.infer<typeof getCustomerResponseSchema>;

const getCustomersInputSchema = z.object({
	companySlug: z.string().optional(),
	body: BooqableOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type getCustomersInput = z.infer<typeof getCustomersInputSchema>;
const getCustomersResponseSchema = BooqableResponseSchema;
export type getCustomersResponse = z.infer<typeof getCustomersResponseSchema>;

const searchCustomersInputSchema = z.object({
	companySlug: z.string().optional(),
	body: BooqableOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type searchCustomersInput = z.infer<typeof searchCustomersInputSchema>;
const searchCustomersResponseSchema = BooqableResponseSchema;
export type searchCustomersResponse = z.infer<
	typeof searchCustomersResponseSchema
>;

const createOrderInputSchema = z.object({
	companySlug: z.string().optional(),
	body: BooqableOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type createOrderInput = z.infer<typeof createOrderInputSchema>;
const createOrderResponseSchema = BooqableResponseSchema;
export type createOrderResponse = z.infer<typeof createOrderResponseSchema>;

const deleteOrderInputSchema = z.object({
	id: z.string(),
	companySlug: z.string().optional(),
	body: BooqableOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type deleteOrderInput = z.infer<typeof deleteOrderInputSchema>;
const deleteOrderResponseSchema = BooqableResponseSchema;
export type deleteOrderResponse = z.infer<typeof deleteOrderResponseSchema>;

const getNewOrderInputSchema = z.object({
	companySlug: z.string().optional(),
	body: BooqableOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type getNewOrderInput = z.infer<typeof getNewOrderInputSchema>;
const getNewOrderResponseSchema = BooqableResponseSchema;
export type getNewOrderResponse = z.infer<typeof getNewOrderResponseSchema>;

const getOrderInputSchema = z.object({
	id: z.string(),
	companySlug: z.string().optional(),
	body: BooqableOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type getOrderInput = z.infer<typeof getOrderInputSchema>;
const getOrderResponseSchema = BooqableResponseSchema;
export type getOrderResponse = z.infer<typeof getOrderResponseSchema>;

const listOrdersInputSchema = z.object({
	companySlug: z.string().optional(),
	body: BooqableOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type listOrdersInput = z.infer<typeof listOrdersInputSchema>;
const listOrdersResponseSchema = BooqableResponseSchema;
export type listOrdersResponse = z.infer<typeof listOrdersResponseSchema>;

const searchOrdersInputSchema = z.object({
	companySlug: z.string().optional(),
	body: BooqableOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type searchOrdersInput = z.infer<typeof searchOrdersInputSchema>;
const searchOrdersResponseSchema = BooqableResponseSchema;
export type searchOrdersResponse = z.infer<typeof searchOrdersResponseSchema>;

const createProductGroupInputSchema = z.object({
	companySlug: z.string().optional(),
	body: BooqableOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type createProductGroupInput = z.infer<
	typeof createProductGroupInputSchema
>;
const createProductGroupResponseSchema = BooqableResponseSchema;
export type createProductGroupResponse = z.infer<
	typeof createProductGroupResponseSchema
>;

const deleteProductGroupInputSchema = z.object({
	id: z.string(),
	companySlug: z.string().optional(),
	body: BooqableOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type deleteProductGroupInput = z.infer<
	typeof deleteProductGroupInputSchema
>;
const deleteProductGroupResponseSchema = BooqableResponseSchema;
export type deleteProductGroupResponse = z.infer<
	typeof deleteProductGroupResponseSchema
>;

const getProductGroupInputSchema = z.object({
	id: z.string(),
	companySlug: z.string().optional(),
	body: BooqableOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type getProductGroupInput = z.infer<typeof getProductGroupInputSchema>;
const getProductGroupResponseSchema = BooqableResponseSchema;
export type getProductGroupResponse = z.infer<
	typeof getProductGroupResponseSchema
>;

const listProductGroupsInputSchema = z.object({
	companySlug: z.string().optional(),
	body: BooqableOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type listProductGroupsInput = z.infer<
	typeof listProductGroupsInputSchema
>;
const listProductGroupsResponseSchema = BooqableResponseSchema;
export type listProductGroupsResponse = z.infer<
	typeof listProductGroupsResponseSchema
>;

const getProductInputSchema = z.object({
	id: z.string(),
	companySlug: z.string().optional(),
	body: BooqableOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type getProductInput = z.infer<typeof getProductInputSchema>;
const getProductResponseSchema = BooqableResponseSchema;
export type getProductResponse = z.infer<typeof getProductResponseSchema>;

const listProductsInputSchema = z.object({
	companySlug: z.string().optional(),
	body: BooqableOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type listProductsInput = z.infer<typeof listProductsInputSchema>;
const listProductsResponseSchema = BooqableResponseSchema;
export type listProductsResponse = z.infer<typeof listProductsResponseSchema>;

const updateCompanyInputSchema = z.object({
	companySlug: z.string().optional(),
	body: BooqableOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type updateCompanyInput = z.infer<typeof updateCompanyInputSchema>;
const updateCompanyResponseSchema = BooqableResponseSchema;
export type updateCompanyResponse = z.infer<typeof updateCompanyResponseSchema>;

const getInventoryLevelsInputSchema = z.object({
	companySlug: z.string().optional(),
	body: BooqableOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type getInventoryLevelsInput = z.infer<
	typeof getInventoryLevelsInputSchema
>;
const getInventoryLevelsResponseSchema = BooqableResponseSchema;
export type getInventoryLevelsResponse = z.infer<
	typeof getInventoryLevelsResponseSchema
>;

const listBarcodesInputSchema = z.object({
	companySlug: z.string().optional(),
	body: BooqableOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type listBarcodesInput = z.infer<typeof listBarcodesInputSchema>;
const listBarcodesResponseSchema = BooqableResponseSchema;
export type listBarcodesResponse = z.infer<typeof listBarcodesResponseSchema>;

const listBundleItemsInputSchema = z.object({
	companySlug: z.string().optional(),
	body: BooqableOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type listBundleItemsInput = z.infer<typeof listBundleItemsInputSchema>;
const listBundleItemsResponseSchema = BooqableResponseSchema;
export type listBundleItemsResponse = z.infer<
	typeof listBundleItemsResponseSchema
>;

const searchBundlesInputSchema = z.object({
	companySlug: z.string().optional(),
	body: BooqableOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type searchBundlesInput = z.infer<typeof searchBundlesInputSchema>;
const searchBundlesResponseSchema = BooqableResponseSchema;
export type searchBundlesResponse = z.infer<typeof searchBundlesResponseSchema>;

const listClustersInputSchema = z.object({
	companySlug: z.string().optional(),
	body: BooqableOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type listClustersInput = z.infer<typeof listClustersInputSchema>;
const listClustersResponseSchema = BooqableResponseSchema;
export type listClustersResponse = z.infer<typeof listClustersResponseSchema>;

const listCouponsInputSchema = z.object({
	companySlug: z.string().optional(),
	body: BooqableOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type listCouponsInput = z.infer<typeof listCouponsInputSchema>;
const listCouponsResponseSchema = BooqableResponseSchema;
export type listCouponsResponse = z.infer<typeof listCouponsResponseSchema>;

const listDefaultPropertiesInputSchema = z.object({
	companySlug: z.string().optional(),
	body: BooqableOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type listDefaultPropertiesInput = z.infer<
	typeof listDefaultPropertiesInputSchema
>;
const listDefaultPropertiesResponseSchema = BooqableResponseSchema;
export type listDefaultPropertiesResponse = z.infer<
	typeof listDefaultPropertiesResponseSchema
>;

const listDocumentsInputSchema = z.object({
	companySlug: z.string().optional(),
	body: BooqableOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type listDocumentsInput = z.infer<typeof listDocumentsInputSchema>;
const listDocumentsResponseSchema = BooqableResponseSchema;
export type listDocumentsResponse = z.infer<typeof listDocumentsResponseSchema>;

const searchDocumentsInputSchema = z.object({
	companySlug: z.string().optional(),
	body: BooqableOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type searchDocumentsInput = z.infer<typeof searchDocumentsInputSchema>;
const searchDocumentsResponseSchema = BooqableResponseSchema;
export type searchDocumentsResponse = z.infer<
	typeof searchDocumentsResponseSchema
>;

const listEmailTemplatesInputSchema = z.object({
	companySlug: z.string().optional(),
	body: BooqableOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type listEmailTemplatesInput = z.infer<
	typeof listEmailTemplatesInputSchema
>;
const listEmailTemplatesResponseSchema = BooqableResponseSchema;
export type listEmailTemplatesResponse = z.infer<
	typeof listEmailTemplatesResponseSchema
>;

const listEmployeesInputSchema = z.object({
	companySlug: z.string().optional(),
	body: BooqableOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type listEmployeesInput = z.infer<typeof listEmployeesInputSchema>;
const listEmployeesResponseSchema = BooqableResponseSchema;
export type listEmployeesResponse = z.infer<typeof listEmployeesResponseSchema>;

const listInventoryBreakdownsInputSchema = z.object({
	companySlug: z.string().optional(),
	body: BooqableOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type listInventoryBreakdownsInput = z.infer<
	typeof listInventoryBreakdownsInputSchema
>;
const listInventoryBreakdownsResponseSchema = BooqableResponseSchema;
export type listInventoryBreakdownsResponse = z.infer<
	typeof listInventoryBreakdownsResponseSchema
>;

const listItemsInputSchema = z.object({
	companySlug: z.string().optional(),
	body: BooqableOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type listItemsInput = z.infer<typeof listItemsInputSchema>;
const listItemsResponseSchema = BooqableResponseSchema;
export type listItemsResponse = z.infer<typeof listItemsResponseSchema>;

const searchItemsInputSchema = z.object({
	companySlug: z.string().optional(),
	body: BooqableOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type searchItemsInput = z.infer<typeof searchItemsInputSchema>;
const searchItemsResponseSchema = BooqableResponseSchema;
export type searchItemsResponse = z.infer<typeof searchItemsResponseSchema>;

const listLinesInputSchema = z.object({
	companySlug: z.string().optional(),
	body: BooqableOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type listLinesInput = z.infer<typeof listLinesInputSchema>;
const listLinesResponseSchema = BooqableResponseSchema;
export type listLinesResponse = z.infer<typeof listLinesResponseSchema>;

const listLocationsInputSchema = z.object({
	companySlug: z.string().optional(),
	body: BooqableOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type listLocationsInput = z.infer<typeof listLocationsInputSchema>;
const listLocationsResponseSchema = BooqableResponseSchema;
export type listLocationsResponse = z.infer<typeof listLocationsResponseSchema>;

const listNotesInputSchema = z.object({
	companySlug: z.string().optional(),
	body: BooqableOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type listNotesInput = z.infer<typeof listNotesInputSchema>;
const listNotesResponseSchema = BooqableResponseSchema;
export type listNotesResponse = z.infer<typeof listNotesResponseSchema>;

const listPaymentMethodsInputSchema = z.object({
	companySlug: z.string().optional(),
	body: BooqableOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type listPaymentMethodsInput = z.infer<
	typeof listPaymentMethodsInputSchema
>;
const listPaymentMethodsResponseSchema = BooqableResponseSchema;
export type listPaymentMethodsResponse = z.infer<
	typeof listPaymentMethodsResponseSchema
>;

const listPaymentsInputSchema = z.object({
	companySlug: z.string().optional(),
	body: BooqableOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type listPaymentsInput = z.infer<typeof listPaymentsInputSchema>;
const listPaymentsResponseSchema = BooqableResponseSchema;
export type listPaymentsResponse = z.infer<typeof listPaymentsResponseSchema>;

const listPhotosInputSchema = z.object({
	companySlug: z.string().optional(),
	body: BooqableOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type listPhotosInput = z.infer<typeof listPhotosInputSchema>;
const listPhotosResponseSchema = BooqableResponseSchema;
export type listPhotosResponse = z.infer<typeof listPhotosResponseSchema>;

const listPlanningsInputSchema = z.object({
	companySlug: z.string().optional(),
	body: BooqableOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type listPlanningsInput = z.infer<typeof listPlanningsInputSchema>;
const listPlanningsResponseSchema = BooqableResponseSchema;
export type listPlanningsResponse = z.infer<typeof listPlanningsResponseSchema>;

const searchPlanningsInputSchema = z.object({
	companySlug: z.string().optional(),
	body: BooqableOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type searchPlanningsInput = z.infer<typeof searchPlanningsInputSchema>;
const searchPlanningsResponseSchema = BooqableResponseSchema;
export type searchPlanningsResponse = z.infer<
	typeof searchPlanningsResponseSchema
>;

const listPriceRulesetsInputSchema = z.object({
	companySlug: z.string().optional(),
	body: BooqableOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type listPriceRulesetsInput = z.infer<
	typeof listPriceRulesetsInputSchema
>;
const listPriceRulesetsResponseSchema = BooqableResponseSchema;
export type listPriceRulesetsResponse = z.infer<
	typeof listPriceRulesetsResponseSchema
>;

const listPriceStructuresInputSchema = z.object({
	companySlug: z.string().optional(),
	body: BooqableOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type listPriceStructuresInput = z.infer<
	typeof listPriceStructuresInputSchema
>;
const listPriceStructuresResponseSchema = BooqableResponseSchema;
export type listPriceStructuresResponse = z.infer<
	typeof listPriceStructuresResponseSchema
>;

const listPropertiesInputSchema = z.object({
	companySlug: z.string().optional(),
	body: BooqableOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type listPropertiesInput = z.infer<typeof listPropertiesInputSchema>;
const listPropertiesResponseSchema = BooqableResponseSchema;
export type listPropertiesResponse = z.infer<
	typeof listPropertiesResponseSchema
>;

const listProvincesInputSchema = z.object({
	companySlug: z.string().optional(),
	body: BooqableOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type listProvincesInput = z.infer<typeof listProvincesInputSchema>;
const listProvincesResponseSchema = BooqableResponseSchema;
export type listProvincesResponse = z.infer<typeof listProvincesResponseSchema>;

const listStockItemPlanningsInputSchema = z.object({
	companySlug: z.string().optional(),
	body: BooqableOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type listStockItemPlanningsInput = z.infer<
	typeof listStockItemPlanningsInputSchema
>;
const listStockItemPlanningsResponseSchema = BooqableResponseSchema;
export type listStockItemPlanningsResponse = z.infer<
	typeof listStockItemPlanningsResponseSchema
>;

const listStockItemsInputSchema = z.object({
	companySlug: z.string().optional(),
	body: BooqableOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type listStockItemsInput = z.infer<typeof listStockItemsInputSchema>;
const listStockItemsResponseSchema = BooqableResponseSchema;
export type listStockItemsResponse = z.infer<
	typeof listStockItemsResponseSchema
>;

const listTaxRatesInputSchema = z.object({
	companySlug: z.string().optional(),
	body: BooqableOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type listTaxRatesInput = z.infer<typeof listTaxRatesInputSchema>;
const listTaxRatesResponseSchema = BooqableResponseSchema;
export type listTaxRatesResponse = z.infer<typeof listTaxRatesResponseSchema>;

const listTaxValuesInputSchema = z.object({
	companySlug: z.string().optional(),
	body: BooqableOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type listTaxValuesInput = z.infer<typeof listTaxValuesInputSchema>;
const listTaxValuesResponseSchema = BooqableResponseSchema;
export type listTaxValuesResponse = z.infer<typeof listTaxValuesResponseSchema>;

const listUsersInputSchema = z.object({
	companySlug: z.string().optional(),
	body: BooqableOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type listUsersInput = z.infer<typeof listUsersInputSchema>;
const listUsersResponseSchema = BooqableResponseSchema;
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
		[key: string]: unknown;
	};
