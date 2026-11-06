import type { NetSuiteSpecKey } from './specs';

/**
 * Operations grouped by the NetSuite resource they act on. The plugin exposes
 * them as `netsuite.<group>.<operation>`, for example
 * `netsuite.salesOrders.createSalesOrder`.
 */
export const netSuiteOperationGroups = {
	customers: [
		'createCustomer',
		'getCustomer',
		'updateCustomer',
		'deleteCustomer',
	],
	customerPayments: [
		'listCustomerPayments',
		'createCustomerPayment',
		'getCustomerPayment',
		'updateCustomerPayment',
		'deleteCustomerPayment',
	],
	employees: [
		'listEmployees',
		'createEmployee',
		'getEmployee',
		'updateEmployee',
		'deleteEmployee',
	],
	invoices: [
		'listInvoices',
		'createInvoice',
		'getInvoice',
		'updateInvoice',
		'deleteInvoice',
	],
	items: ['createItem', 'getItem', 'updateItem', 'deleteItem'],
	itemFulfillments: [
		'listItemFulfillments',
		'getItemFulfillment',
		'updateItemFulfillment',
		'deleteItemFulfillment',
	],
	itemReceipts: [
		'listItemReceipts',
		'getItemReceipt',
		'updateItemReceipt',
		'deleteItemReceipt',
	],
	journalEntries: [
		'listJournalEntries',
		'createJournalEntry',
		'getJournalEntry',
		'updateJournalEntry',
		'deleteJournalEntry',
	],
	purchaseOrders: [
		'listPurchaseOrders',
		'createPurchaseOrder',
		'getPurchaseOrder',
		'updatePurchaseOrder',
		'deletePurchaseOrder',
	],
	salesOrders: [
		'listSalesOrders',
		'createSalesOrder',
		'getSalesOrder',
		'updateSalesOrder',
		'deleteSalesOrder',
	],
	vendors: ['createVendor', 'getVendor', 'updateVendor'],
	vendorBills: ['createVendorBill', 'getVendorBill', 'updateVendorBill'],
	vendorPayments: [
		'listVendorPayments',
		'getVendorPayment',
		'updateVendorPayment',
		'deleteVendorPayment',
	],
	records: [
		'listRecords',
		'createRecord',
		'upsertRecordByExternalId',
		'transformRecord',
		'getReferenceSelectField',
		'getSublistCollection',
		'getSublistLine',
		'getSubrecord',
	],
	metadata: ['listMetadataCatalog', 'getRecordMetadata'],
	query: ['runSuiteqlQuery', 'listDatasets', 'executeDataset'],
	asyncJobs: ['asyncGetJobStatus', 'asyncGetJobTask', 'asyncGetJobTaskResult'],
	system: ['getServerTime', 'getGovernanceLimits', 'getDatacenterUrls'],
	oauth: [
		'oauth2AuthorizeAccountDomain',
		'oauth2AuthorizeSystemDomain',
		'oauth2TokenAuthorizationCode',
		'oauth2TokenRefresh',
		'oauth2TokenClientCredentials',
		'createJwtClientAssertion',
		'oauth2RevokeRefreshToken',
		'oauth2Logout',
		'oauth2GetJwksKeys',
	],
} as const satisfies Record<string, readonly NetSuiteSpecKey[]>;

export type NetSuiteOperationGroups = typeof netSuiteOperationGroups;

export type NetSuiteGroupedSpecKey =
	NetSuiteOperationGroups[keyof NetSuiteOperationGroups][number];

// Compile-time check: every spec belongs to a group.
type UngroupedSpecKeys = Exclude<NetSuiteSpecKey, NetSuiteGroupedSpecKey>;
export const allSpecsGrouped: [UngroupedSpecKeys] extends [never]
	? true
	: UngroupedSpecKeys = true;

/** `[group.operation path, spec key]` for every operation. */
export const netSuiteOperationPaths = Object.entries(
	netSuiteOperationGroups,
).flatMap(([group, keys]) =>
	keys.map((key) => [`${group}.${key}`, key as NetSuiteSpecKey] as const),
);
