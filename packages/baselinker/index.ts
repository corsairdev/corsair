import type {
	AuthTypes,
	BindEndpoints,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import { BaseLinkerEndpoints } from './endpoints';
import {
	BaseLinkerEndpointInputSchemas,
	BaseLinkerEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { BaseLinkerSchema } from './schema';

const baseLinkerEndpointsNested = BaseLinkerEndpoints;

export type BaseLinkerPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalBaseLinkerPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof baseLinkerEndpointsNested>;
};

export type BaseLinkerContext = CorsairPluginContext<
	typeof BaseLinkerSchema,
	BaseLinkerPluginOptions
>;
export type BaseLinkerKeyBuilderContext =
	KeyBuilderContext<BaseLinkerPluginOptions>;
export type BaseLinkerBoundEndpoints = BindEndpoints<
	typeof baseLinkerEndpointsNested
>;

export const baseLinkerEndpointSchemas = {
	'inventory.addInventory': {
		input: BaseLinkerEndpointInputSchemas.addInventory,
		output: BaseLinkerEndpointOutputSchemas.addInventory,
	},
	'inventory.addInventoryCategory': {
		input: BaseLinkerEndpointInputSchemas.addInventoryCategory,
		output: BaseLinkerEndpointOutputSchemas.addInventoryCategory,
	},
	'inventoryDocuments.addInventoryDocument': {
		input: BaseLinkerEndpointInputSchemas.addInventoryDocument,
		output: BaseLinkerEndpointOutputSchemas.addInventoryDocument,
	},
	'inventory.addInventoryManufacturer': {
		input: BaseLinkerEndpointInputSchemas.addInventoryManufacturer,
		output: BaseLinkerEndpointOutputSchemas.addInventoryManufacturer,
	},
	'inventory.addInventoryPayer': {
		input: BaseLinkerEndpointInputSchemas.addInventoryPayer,
		output: BaseLinkerEndpointOutputSchemas.addInventoryPayer,
	},
	'inventory.addInventoryPriceGroup': {
		input: BaseLinkerEndpointInputSchemas.addInventoryPriceGroup,
		output: BaseLinkerEndpointOutputSchemas.addInventoryPriceGroup,
	},
	'inventory.addInventoryProduct': {
		input: BaseLinkerEndpointInputSchemas.addInventoryProduct,
		output: BaseLinkerEndpointOutputSchemas.addInventoryProduct,
	},
	'purchaseOrders.addInventoryPurchaseOrder': {
		input: BaseLinkerEndpointInputSchemas.addInventoryPurchaseOrder,
		output: BaseLinkerEndpointOutputSchemas.addInventoryPurchaseOrder,
	},
	'purchaseOrders.addInventoryPurchaseOrderItems': {
		input: BaseLinkerEndpointInputSchemas.addInventoryPurchaseOrderItems,
		output: BaseLinkerEndpointOutputSchemas.addInventoryPurchaseOrderItems,
	},
	'inventory.addInventorySupplier': {
		input: BaseLinkerEndpointInputSchemas.addInventorySupplier,
		output: BaseLinkerEndpointOutputSchemas.addInventorySupplier,
	},
	'inventory.addInventoryWarehouse': {
		input: BaseLinkerEndpointInputSchemas.addInventoryWarehouse,
		output: BaseLinkerEndpointOutputSchemas.addInventoryWarehouse,
	},
	'documents.addInvoice': {
		input: BaseLinkerEndpointInputSchemas.addInvoice,
		output: BaseLinkerEndpointOutputSchemas.addInvoice,
	},
	'documents.addInvoiceCorrection': {
		input: BaseLinkerEndpointInputSchemas.addInvoiceCorrection,
		output: BaseLinkerEndpointOutputSchemas.addInvoiceCorrection,
	},
	'orders.addOrder': {
		input: BaseLinkerEndpointInputSchemas.addOrder,
		output: BaseLinkerEndpointOutputSchemas.addOrder,
	},
	'orders.addOrderBySplit': {
		input: BaseLinkerEndpointInputSchemas.addOrderBySplit,
		output: BaseLinkerEndpointOutputSchemas.addOrderBySplit,
	},
	'orders.addOrderDuplicate': {
		input: BaseLinkerEndpointInputSchemas.addOrderDuplicate,
		output: BaseLinkerEndpointOutputSchemas.addOrderDuplicate,
	},
	'returns.addOrderReturn': {
		input: BaseLinkerEndpointInputSchemas.addOrderReturn,
		output: BaseLinkerEndpointOutputSchemas.addOrderReturn,
	},
	'returns.addOrderReturnProduct': {
		input: BaseLinkerEndpointInputSchemas.addOrderReturnProduct,
		output: BaseLinkerEndpointOutputSchemas.addOrderReturnProduct,
	},
	'externalStorages.addCategory': {
		input: BaseLinkerEndpointInputSchemas.addCategory,
		output: BaseLinkerEndpointOutputSchemas.addCategory,
	},
	'couriers.createPackageManual': {
		input: BaseLinkerEndpointInputSchemas.createPackageManual,
		output: BaseLinkerEndpointOutputSchemas.createPackageManual,
	},
	'inventory.deleteInventory': {
		input: BaseLinkerEndpointInputSchemas.deleteInventory,
		output: BaseLinkerEndpointOutputSchemas.deleteInventory,
	},
	'inventory.deleteInventoryCategory': {
		input: BaseLinkerEndpointInputSchemas.deleteInventoryCategory,
		output: BaseLinkerEndpointOutputSchemas.deleteInventoryCategory,
	},
	'inventory.deleteInventoryManufacturer': {
		input: BaseLinkerEndpointInputSchemas.deleteInventoryManufacturer,
		output: BaseLinkerEndpointOutputSchemas.deleteInventoryManufacturer,
	},
	'inventory.deleteInventoryPayer': {
		input: BaseLinkerEndpointInputSchemas.deleteInventoryPayer,
		output: BaseLinkerEndpointOutputSchemas.deleteInventoryPayer,
	},
	'inventory.deleteInventoryPriceGroup': {
		input: BaseLinkerEndpointInputSchemas.deleteInventoryPriceGroup,
		output: BaseLinkerEndpointOutputSchemas.deleteInventoryPriceGroup,
	},
	'inventory.deleteInventoryProduct': {
		input: BaseLinkerEndpointInputSchemas.deleteInventoryProduct,
		output: BaseLinkerEndpointOutputSchemas.deleteInventoryProduct,
	},
	'inventory.deleteInventoryWarehouse': {
		input: BaseLinkerEndpointInputSchemas.deleteInventoryWarehouse,
		output: BaseLinkerEndpointOutputSchemas.deleteInventoryWarehouse,
	},
	'orders.deleteOrderProduct': {
		input: BaseLinkerEndpointInputSchemas.deleteOrderProduct,
		output: BaseLinkerEndpointOutputSchemas.deleteOrderProduct,
	},
	'returns.deleteOrderReturnProduct': {
		input: BaseLinkerEndpointInputSchemas.deleteOrderReturnProduct,
		output: BaseLinkerEndpointOutputSchemas.deleteOrderReturnProduct,
	},
	'orders.deleteOrders': {
		input: BaseLinkerEndpointInputSchemas.deleteOrders,
		output: BaseLinkerEndpointOutputSchemas.deleteOrders,
	},
	'connect.getConnectIntegrationContractors': {
		input: BaseLinkerEndpointInputSchemas.getConnectIntegrationContractors,
		output: BaseLinkerEndpointOutputSchemas.getConnectIntegrationContractors,
	},
	'connect.getConnectIntegrations': {
		input: BaseLinkerEndpointInputSchemas.getConnectIntegrations,
		output: BaseLinkerEndpointOutputSchemas.getConnectIntegrations,
	},
	'couriers.getCourierAccounts': {
		input: BaseLinkerEndpointInputSchemas.getCourierAccounts,
		output: BaseLinkerEndpointOutputSchemas.getCourierAccounts,
	},
	'couriers.getCourierFields': {
		input: BaseLinkerEndpointInputSchemas.getCourierFields,
		output: BaseLinkerEndpointOutputSchemas.getCourierFields,
	},
	'couriers.getCourierPackagesStatusHistory': {
		input: BaseLinkerEndpointInputSchemas.getCourierPackagesStatusHistory,
		output: BaseLinkerEndpointOutputSchemas.getCourierPackagesStatusHistory,
	},
	'couriers.getCouriersList': {
		input: BaseLinkerEndpointInputSchemas.getCouriersList,
		output: BaseLinkerEndpointOutputSchemas.getCouriersList,
	},
	'externalStorages.getExternalStorageProductsQuantity': {
		input: BaseLinkerEndpointInputSchemas.getExternalStorageProductsQuantity,
		output: BaseLinkerEndpointOutputSchemas.getExternalStorageProductsQuantity,
	},
	'externalStorages.getExternalStoragesList': {
		input: BaseLinkerEndpointInputSchemas.getExternalStoragesList,
		output: BaseLinkerEndpointOutputSchemas.getExternalStoragesList,
	},
	'inventory.getInventories': {
		input: BaseLinkerEndpointInputSchemas.getInventories,
		output: BaseLinkerEndpointOutputSchemas.getInventories,
	},
	'inventory.getInventoryAvailableTextFieldKeys': {
		input: BaseLinkerEndpointInputSchemas.getInventoryAvailableTextFieldKeys,
		output: BaseLinkerEndpointOutputSchemas.getInventoryAvailableTextFieldKeys,
	},
	'inventory.getInventoryCategories': {
		input: BaseLinkerEndpointInputSchemas.getInventoryCategories,
		output: BaseLinkerEndpointOutputSchemas.getInventoryCategories,
	},
	'inventoryDocuments.getInventoryDocumentItems': {
		input: BaseLinkerEndpointInputSchemas.getInventoryDocumentItems,
		output: BaseLinkerEndpointOutputSchemas.getInventoryDocumentItems,
	},
	'inventoryDocuments.getInventoryDocumentSeries': {
		input: BaseLinkerEndpointInputSchemas.getInventoryDocumentSeries,
		output: BaseLinkerEndpointOutputSchemas.getInventoryDocumentSeries,
	},
	'inventoryDocuments.getInventoryDocuments': {
		input: BaseLinkerEndpointInputSchemas.getInventoryDocuments,
		output: BaseLinkerEndpointOutputSchemas.getInventoryDocuments,
	},
	'inventory.getInventoryExtraFields': {
		input: BaseLinkerEndpointInputSchemas.getInventoryExtraFields,
		output: BaseLinkerEndpointOutputSchemas.getInventoryExtraFields,
	},
	'inventory.getInventoryIntegrations': {
		input: BaseLinkerEndpointInputSchemas.getInventoryIntegrations,
		output: BaseLinkerEndpointOutputSchemas.getInventoryIntegrations,
	},
	'inventory.getInventoryManufacturers': {
		input: BaseLinkerEndpointInputSchemas.getInventoryManufacturers,
		output: BaseLinkerEndpointOutputSchemas.getInventoryManufacturers,
	},
	'inventory.getInventoryPayers': {
		input: BaseLinkerEndpointInputSchemas.getInventoryPayers,
		output: BaseLinkerEndpointOutputSchemas.getInventoryPayers,
	},
	'inventory.getInventoryPriceGroups': {
		input: BaseLinkerEndpointInputSchemas.getInventoryPriceGroups,
		output: BaseLinkerEndpointOutputSchemas.getInventoryPriceGroups,
	},
	'inventory.getInventoryPrintoutTemplates': {
		input: BaseLinkerEndpointInputSchemas.getInventoryPrintoutTemplates,
		output: BaseLinkerEndpointOutputSchemas.getInventoryPrintoutTemplates,
	},
	'inventory.getInventoryProductLogs': {
		input: BaseLinkerEndpointInputSchemas.getInventoryProductLogs,
		output: BaseLinkerEndpointOutputSchemas.getInventoryProductLogs,
	},
	'inventory.getInventoryProductsData': {
		input: BaseLinkerEndpointInputSchemas.getInventoryProductsData,
		output: BaseLinkerEndpointOutputSchemas.getInventoryProductsData,
	},
	'inventory.getInventoryProductsList': {
		input: BaseLinkerEndpointInputSchemas.getInventoryProductsList,
		output: BaseLinkerEndpointOutputSchemas.getInventoryProductsList,
	},
	'inventory.getInventoryProductsPrices': {
		input: BaseLinkerEndpointInputSchemas.getInventoryProductsPrices,
		output: BaseLinkerEndpointOutputSchemas.getInventoryProductsPrices,
	},
	'inventory.getInventoryProductsStock': {
		input: BaseLinkerEndpointInputSchemas.getInventoryProductsStock,
		output: BaseLinkerEndpointOutputSchemas.getInventoryProductsStock,
	},
	'purchaseOrders.getInventoryPurchaseOrderItems': {
		input: BaseLinkerEndpointInputSchemas.getInventoryPurchaseOrderItems,
		output: BaseLinkerEndpointOutputSchemas.getInventoryPurchaseOrderItems,
	},
	'purchaseOrders.getInventoryPurchaseOrderSeries': {
		input: BaseLinkerEndpointInputSchemas.getInventoryPurchaseOrderSeries,
		output: BaseLinkerEndpointOutputSchemas.getInventoryPurchaseOrderSeries,
	},
	'purchaseOrders.getInventoryPurchaseOrders': {
		input: BaseLinkerEndpointInputSchemas.getInventoryPurchaseOrders,
		output: BaseLinkerEndpointOutputSchemas.getInventoryPurchaseOrders,
	},
	'inventory.getInventorySuppliers': {
		input: BaseLinkerEndpointInputSchemas.getInventorySuppliers,
		output: BaseLinkerEndpointOutputSchemas.getInventorySuppliers,
	},
	'inventory.getInventoryTags': {
		input: BaseLinkerEndpointInputSchemas.getInventoryTags,
		output: BaseLinkerEndpointOutputSchemas.getInventoryTags,
	},
	'inventory.getInventoryWarehouses': {
		input: BaseLinkerEndpointInputSchemas.getInventoryWarehouses,
		output: BaseLinkerEndpointOutputSchemas.getInventoryWarehouses,
	},
	'documents.getInvoiceFile': {
		input: BaseLinkerEndpointInputSchemas.getInvoiceFile,
		output: BaseLinkerEndpointOutputSchemas.getInvoiceFile,
	},
	'documents.getInvoices': {
		input: BaseLinkerEndpointInputSchemas.getInvoices,
		output: BaseLinkerEndpointOutputSchemas.getInvoices,
	},
	'orders.getJournalList': {
		input: BaseLinkerEndpointInputSchemas.getJournalList,
		output: BaseLinkerEndpointOutputSchemas.getJournalList,
	},
	'documents.getNewReceipts': {
		input: BaseLinkerEndpointInputSchemas.getNewReceipts,
		output: BaseLinkerEndpointOutputSchemas.getNewReceipts,
	},
	'orders.getOrderExtraFields': {
		input: BaseLinkerEndpointInputSchemas.getOrderExtraFields,
		output: BaseLinkerEndpointOutputSchemas.getOrderExtraFields,
	},
	'couriers.getOrderPackages': {
		input: BaseLinkerEndpointInputSchemas.getOrderPackages,
		output: BaseLinkerEndpointOutputSchemas.getOrderPackages,
	},
	'orders.getOrderPaymentsHistory': {
		input: BaseLinkerEndpointInputSchemas.getOrderPaymentsHistory,
		output: BaseLinkerEndpointOutputSchemas.getOrderPaymentsHistory,
	},
	'orders.getOrderPickPackHistory': {
		input: BaseLinkerEndpointInputSchemas.getOrderPickPackHistory,
		output: BaseLinkerEndpointOutputSchemas.getOrderPickPackHistory,
	},
	'orders.getOrderPrintoutTemplates': {
		input: BaseLinkerEndpointInputSchemas.getOrderPrintoutTemplates,
		output: BaseLinkerEndpointOutputSchemas.getOrderPrintoutTemplates,
	},
	'returns.getOrderReturnExtraFields': {
		input: BaseLinkerEndpointInputSchemas.getOrderReturnExtraFields,
		output: BaseLinkerEndpointOutputSchemas.getOrderReturnExtraFields,
	},
	'returns.getOrderReturnJournalList': {
		input: BaseLinkerEndpointInputSchemas.getOrderReturnJournalList,
		output: BaseLinkerEndpointOutputSchemas.getOrderReturnJournalList,
	},
	'returns.getOrderReturnPaymentsHistory': {
		input: BaseLinkerEndpointInputSchemas.getOrderReturnPaymentsHistory,
		output: BaseLinkerEndpointOutputSchemas.getOrderReturnPaymentsHistory,
	},
	'returns.getOrderReturnProductStatuses': {
		input: BaseLinkerEndpointInputSchemas.getOrderReturnProductStatuses,
		output: BaseLinkerEndpointOutputSchemas.getOrderReturnProductStatuses,
	},
	'returns.getOrderReturnReasonsList': {
		input: BaseLinkerEndpointInputSchemas.getOrderReturnReasonsList,
		output: BaseLinkerEndpointOutputSchemas.getOrderReturnReasonsList,
	},
	'returns.getOrderReturnStatusList': {
		input: BaseLinkerEndpointInputSchemas.getOrderReturnStatusList,
		output: BaseLinkerEndpointOutputSchemas.getOrderReturnStatusList,
	},
	'returns.getOrderReturns': {
		input: BaseLinkerEndpointInputSchemas.getOrderReturns,
		output: BaseLinkerEndpointOutputSchemas.getOrderReturns,
	},
	'orders.getOrderSources': {
		input: BaseLinkerEndpointInputSchemas.getOrderSources,
		output: BaseLinkerEndpointOutputSchemas.getOrderSources,
	},
	'orders.getOrderStatusList': {
		input: BaseLinkerEndpointInputSchemas.getOrderStatusList,
		output: BaseLinkerEndpointOutputSchemas.getOrderStatusList,
	},
	'orders.getOrderTransactionData': {
		input: BaseLinkerEndpointInputSchemas.getOrderTransactionData,
		output: BaseLinkerEndpointOutputSchemas.getOrderTransactionData,
	},
	'orders.getOrders': {
		input: BaseLinkerEndpointInputSchemas.getOrders,
		output: BaseLinkerEndpointOutputSchemas.getOrders,
	},
	'orders.getOrdersByPhone': {
		input: BaseLinkerEndpointInputSchemas.getOrdersByPhone,
		output: BaseLinkerEndpointOutputSchemas.getOrdersByPhone,
	},
	'couriers.getPackageDetails': {
		input: BaseLinkerEndpointInputSchemas.getPackageDetails,
		output: BaseLinkerEndpointOutputSchemas.getPackageDetails,
	},
	'orders.getPickPackCarts': {
		input: BaseLinkerEndpointInputSchemas.getPickPackCarts,
		output: BaseLinkerEndpointOutputSchemas.getPickPackCarts,
	},
	'couriers.getProtocol': {
		input: BaseLinkerEndpointInputSchemas.getProtocol,
		output: BaseLinkerEndpointOutputSchemas.getProtocol,
	},
	'documents.getReceipts': {
		input: BaseLinkerEndpointInputSchemas.getReceipts,
		output: BaseLinkerEndpointOutputSchemas.getReceipts,
	},
	'couriers.getRequestParcelPickupFields': {
		input: BaseLinkerEndpointInputSchemas.getRequestParcelPickupFields,
		output: BaseLinkerEndpointOutputSchemas.getRequestParcelPickupFields,
	},
	'documents.getSeries': {
		input: BaseLinkerEndpointInputSchemas.getSeries,
		output: BaseLinkerEndpointOutputSchemas.getSeries,
	},
	'externalStorages.getStoragesList': {
		input: BaseLinkerEndpointInputSchemas.getStoragesList,
		output: BaseLinkerEndpointOutputSchemas.getStoragesList,
	},
	'orders.runOrderMacroTrigger': {
		input: BaseLinkerEndpointInputSchemas.runOrderMacroTrigger,
		output: BaseLinkerEndpointOutputSchemas.runOrderMacroTrigger,
	},
	'inventory.runProductMacroTrigger': {
		input: BaseLinkerEndpointInputSchemas.runProductMacroTrigger,
		output: BaseLinkerEndpointOutputSchemas.runProductMacroTrigger,
	},
	'couriers.runRequestParcelPickup': {
		input: BaseLinkerEndpointInputSchemas.runRequestParcelPickup,
		output: BaseLinkerEndpointOutputSchemas.runRequestParcelPickup,
	},
	'purchaseOrders.setInventoryPurchaseOrderStatus': {
		input: BaseLinkerEndpointInputSchemas.setInventoryPurchaseOrderStatus,
		output: BaseLinkerEndpointOutputSchemas.setInventoryPurchaseOrderStatus,
	},
	'orders.setOrderFields': {
		input: BaseLinkerEndpointInputSchemas.setOrderFields,
		output: BaseLinkerEndpointOutputSchemas.setOrderFields,
	},
	'orders.setOrderPayment': {
		input: BaseLinkerEndpointInputSchemas.setOrderPayment,
		output: BaseLinkerEndpointOutputSchemas.setOrderPayment,
	},
	'orders.setOrderProductFields': {
		input: BaseLinkerEndpointInputSchemas.setOrderProductFields,
		output: BaseLinkerEndpointOutputSchemas.setOrderProductFields,
	},
	'documents.setOrderReceipt': {
		input: BaseLinkerEndpointInputSchemas.setOrderReceipt,
		output: BaseLinkerEndpointOutputSchemas.setOrderReceipt,
	},
	'returns.setOrderReturnFields': {
		input: BaseLinkerEndpointInputSchemas.setOrderReturnFields,
		output: BaseLinkerEndpointOutputSchemas.setOrderReturnFields,
	},
	'returns.setOrderReturnProductFields': {
		input: BaseLinkerEndpointInputSchemas.setOrderReturnProductFields,
		output: BaseLinkerEndpointOutputSchemas.setOrderReturnProductFields,
	},
	'returns.setOrderReturnRefund': {
		input: BaseLinkerEndpointInputSchemas.setOrderReturnRefund,
		output: BaseLinkerEndpointOutputSchemas.setOrderReturnRefund,
	},
	'returns.setOrderReturnStatus': {
		input: BaseLinkerEndpointInputSchemas.setOrderReturnStatus,
		output: BaseLinkerEndpointOutputSchemas.setOrderReturnStatus,
	},
	'returns.setOrderReturnStatuses': {
		input: BaseLinkerEndpointInputSchemas.setOrderReturnStatuses,
		output: BaseLinkerEndpointOutputSchemas.setOrderReturnStatuses,
	},
	'orders.setOrderStatus': {
		input: BaseLinkerEndpointInputSchemas.setOrderStatus,
		output: BaseLinkerEndpointOutputSchemas.setOrderStatus,
	},
	'orders.setOrderStatuses': {
		input: BaseLinkerEndpointInputSchemas.setOrderStatuses,
		output: BaseLinkerEndpointOutputSchemas.setOrderStatuses,
	},
	'orders.setOrdersMerge': {
		input: BaseLinkerEndpointInputSchemas.setOrdersMerge,
		output: BaseLinkerEndpointOutputSchemas.setOrdersMerge,
	},
	'inventory.updateInventoryProductsStock': {
		input: BaseLinkerEndpointInputSchemas.updateInventoryProductsStock,
		output: BaseLinkerEndpointOutputSchemas.updateInventoryProductsStock,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof baseLinkerEndpointsNested
>;

export const baseLinkerEndpointMeta = {
	'inventory.addInventory': {
		riskLevel: 'write',
		description:
			'Tool to add or update a BaseLinker catalog (inventory). Use when you need to create a new catalog or update an existing one with the same identifier.',
	},
	'inventory.addInventoryCategory': {
		riskLevel: 'write',
		description:
			'Tool to add or update a category in the BaseLinker catalog. Use when you need to create a new category or update an existing one. Adding a category with the same identifier again updates the previously saved category.',
	},
	'inventoryDocuments.addInventoryDocument': {
		riskLevel: 'write',
		description:
			'Tool to create a new inventory document in BaseLinker storage. Use when you need to create goods receipts, issues, or transfers. Documents are created as drafts and require confirmation via user action or setInventoryDocumentStatusConfirmed API method.',
	},
	'inventory.addInventoryManufacturer': {
		riskLevel: 'write',
		description:
			'Tool to add or update a manufacturer in the BaseLinker catalog. Use when you need to create a new manufacturer or update an existing one. Adding a manufacturer with the same identifier again updates the previously saved manufacturer.',
	},
	'inventory.addInventoryPayer': {
		riskLevel: 'write',
		description:
			"Tool to add a new payer or update an existing one in BaseLinker storage. Use when you need to create a new payer with contact details or update an existing payer's information.",
	},
	'inventory.addInventoryPriceGroup': {
		riskLevel: 'write',
		description:
			'Tool to create or update a price group in BaseLinker storage. Use when you need to define pricing tiers (e.g., wholesale, retail, VIP) that can be later assigned to inventory items via addInventory method.',
	},
	'inventory.addInventoryProduct': {
		riskLevel: 'write',
		description:
			'Add a new product to BaseLinker catalog or update an existing product. Use when creating inventory items or modifying product details like SKU, price, stock, dimensions, and text fields. Provide product_id to update existing products, omit it to create new ones.',
	},
	'purchaseOrders.addInventoryPurchaseOrder': {
		riskLevel: 'write',
		description:
			'Tool to create a new purchase order in BaseLinker storage. Orders are created as drafts by default. Use when you need to create a new purchase order for inventory management.',
	},
	'purchaseOrders.addInventoryPurchaseOrderItems': {
		riskLevel: 'write',
		description:
			'Tool to add items to an existing purchase order in BaseLinker. Use when you need to add products to a purchase order that has already been created.',
	},
	'inventory.addInventorySupplier': {
		riskLevel: 'write',
		description:
			'Tool to add a new supplier or update an existing one in BaseLinker storage. Use when you need to manage supplier information for inventory management. If supplier_id is provided, the existing supplier will be updated; otherwise, a new supplier will be created.',
	},
	'inventory.addInventoryWarehouse': {
		riskLevel: 'write',
		description:
			'Tool to add a new warehouse or update an existing warehouse in BaseLinker inventories. Use when you need to create new warehouse locations for inventory management or update warehouse details. Adding a warehouse with the same identifier again will update the previously saved warehouse. The method does not allow editing warehouses created automatically for external stocks.',
	},
	'documents.addInvoice': {
		riskLevel: 'write',
		description:
			'Tool to issue an order invoice in BaseLinker. Use when you need to generate an invoice for an existing order using a specific numbering series.',
	},
	'documents.addInvoiceCorrection': {
		riskLevel: 'write',
		description:
			'Tool to issue an order invoice correction. Use when correcting pricing errors, handling returns, or updating invoice data. Either original_invoice_id or return_order_id must be provided.',
	},
	'orders.addOrder': {
		riskLevel: 'write',
		description:
			'Tool to add a new order to the BaseLinker order manager. Use when you need to create a new order with customer details, products, and delivery information.',
	},
	'orders.addOrderBySplit': {
		riskLevel: 'write',
		description:
			'Tool to create a new order by splitting selected products from an existing order. Use when you need to split an order into multiple shipments or separate deliveries. The new order inherits all customer details, addresses, and settings from the original order, with only the specified products and optional delivery costs moved to it.',
	},
	'orders.addOrderDuplicate': {
		riskLevel: 'write',
		description:
			'Tool to add a new order by duplicating an existing order in BaseLinker. The new order will have the same data as the original order but with a different ID.',
	},
	'returns.addOrderReturn': {
		riskLevel: 'write',
		description:
			'Tool to add a new order return to BaseLinker. Use when creating a return for an order. Requires status_id (get from getOrderReturnStatusList), date_add (Unix timestamp), currency (3-letter code), and refunded status.',
	},
	'returns.addOrderReturnProduct': {
		riskLevel: 'write',
		description:
			'Tool to add a new product to an existing order return in BaseLinker. Use when a customer is returning items and you need to register the returned products.',
	},
	'externalStorages.addCategory': {
		riskLevel: 'write',
		description:
			"Tool to add a new category to BaseLinker storage (shops, warehouses, or BaseLinker inventory). Use when you need to create a new category in a connected storage's category structure. Requires a storage_id which can be obtained from GetExternalStoragesList or use 'bl_1' for BaseLinker inventory.",
	},
	'couriers.createPackageManual': {
		riskLevel: 'write',
		description:
			'Tool to register shipping details for orders when shipments are created outside BaseLinker. Use when you need to add tracking numbers and courier information for manually created shipments. Supports marking packages as return shipments.',
	},
	'inventory.deleteInventory': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Tool to delete a catalog from BaseLinker storage. Use when you need to permanently remove an inventory/catalog.',
	},
	'inventory.deleteInventoryCategory': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Tool to remove categories from BaseLinker warehouse. Along with the category, the products contained therein are removed (however, this does not apply to products in subcategories). The subcategories will be changed to the highest level categories.',
	},
	'inventory.deleteInventoryManufacturer': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Tool to remove a manufacturer from the BaseLinker catalog. Use when you need to delete a manufacturer that is no longer needed or was added by mistake.',
	},
	'inventory.deleteInventoryPayer': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Tool to remove a payer from BaseLinker storage. Use when you need to delete an existing payer entry by its ID.',
	},
	'inventory.deleteInventoryPriceGroup': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Tool to remove a price group from BaseLinker storage. Use when you need to delete an existing price group by its identifier.',
	},
	'inventory.deleteInventoryProduct': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Tool to remove a product from the BaseLinker catalog. Use when you need to permanently delete an inventory product by its ID.',
	},
	'inventory.deleteInventoryWarehouse': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Tool to remove a warehouse from BaseLinker inventories. Use when you need to delete a warehouse that is no longer needed. Note: This method does not allow removal of warehouses created automatically for external stock management (shops, wholesalers, etc.).',
	},
	'orders.deleteOrderProduct': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Tool to remove a specific product from an order in BaseLinker. Use when you need to delete an order item without canceling the entire order.',
	},
	'returns.deleteOrderReturnProduct': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Tool to remove a specific product from an order return in BaseLinker. Use when you need to delete a product item from an existing return request.',
	},
	'orders.deleteOrders': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Tool to delete multiple orders from BaseLinker order manager. Use when you need to permanently remove orders from the system.',
	},
	'connect.getConnectIntegrationContractors': {
		riskLevel: 'read',
		description:
			'Tool to retrieve a list of contractors connected to a selected Base Connect integration. Use when you need to discover available contractors for a specific integration before performing contractor-specific operations.',
	},
	'connect.getConnectIntegrations': {
		riskLevel: 'read',
		description:
			'Tool to retrieve a list of all Base Connect integrations on this account. Returns both integrations created on the account and integrations to which the account has connected.',
	},
	'couriers.getCourierAccounts': {
		riskLevel: 'read',
		description:
			'Tool to retrieve the list of accounts connected to a given courier. Use when you need to identify available courier accounts before performing shipping operations.',
	},
	'couriers.getCourierFields': {
		riskLevel: 'read',
		description:
			'Tool to retrieve the form fields required for creating shipments with a specific courier. Use when you need to discover which fields are required or optional for shipment creation.',
	},
	'couriers.getCourierPackagesStatusHistory': {
		riskLevel: 'read',
		description:
			'Tool to retrieve the history of status changes for courier packages. Use when you need to track the delivery progress of shipments through their complete status timeline. Returns chronological status updates for up to 100 packages per request.',
	},
	'couriers.getCouriersList': {
		riskLevel: 'read',
		description:
			'Tool to retrieve a list of available couriers from BaseLinker. Use when you need to discover which shipping carriers are configured before creating packages or querying courier-specific fields.',
	},
	'externalStorages.getExternalStorageProductsQuantity': {
		riskLevel: 'read',
		description:
			'Retrieve stock quantities from an external storage (shop/wholesaler) connected to BaseLinker. Use this tool to check current inventory levels for products in external integrations. Returns product IDs with their quantities, including variant-level stock if applicable.',
	},
	'externalStorages.getExternalStoragesList': {
		riskLevel: 'read',
		description:
			"Retrieve a list of external storages (shops, warehouses, wholesalers) connected to BaseLinker that can be referenced via API. Returns storage IDs (e.g., 'shop_2444', 'warehouse_1334'), names, and supported API methods for each storage. Use this to discover available integrations before calling storage-specific methods like getExternalStorageProductsList.",
	},
	'inventory.getInventories': {
		riskLevel: 'read',
		description:
			'Tool to retrieve a list of catalogs (inventories) available in the BaseLinker storage. Use when you need to discover available catalogs and their configurations before performing inventory-specific operations.',
	},
	'inventory.getInventoryAvailableTextFieldKeys': {
		riskLevel: 'read',
		description:
			'Tool to retrieve a list of product text fields that can be overwritten for a specific integration. Use when you need to discover which text fields are available for modification within a given inventory catalog.',
	},
	'inventory.getInventoryCategories': {
		riskLevel: 'read',
		description:
			'Tool to retrieve a list of categories for a BaseLinker catalog. Use when you need to fetch category hierarchies for inventory management or product organization.',
	},
	'inventoryDocuments.getInventoryDocumentItems': {
		riskLevel: 'read',
		description:
			'Tool to retrieve items from inventory documents in BaseLinker. Use when you need to fetch product details from a specific document with support for pagination (100 items per page).',
	},
	'inventoryDocuments.getInventoryDocumentSeries': {
		riskLevel: 'read',
		description:
			'Tool to retrieve available inventory document series. Use when you need to assign a numbering series to a new inventory document.',
	},
	'inventoryDocuments.getInventoryDocuments': {
		riskLevel: 'read',
		description:
			'Tool to retrieve a list of inventory documents. Use when you need to fetch inventory records with optional filters for ID, type, status, date range, warehouse, or pagination.',
	},
	'inventory.getInventoryExtraFields': {
		riskLevel: 'read',
		description:
			'Tool to retrieve extra fields defined for BaseLinker catalog inventory items. Use before fetching or updating inventory products to list available custom fields.',
	},
	'inventory.getInventoryIntegrations': {
		riskLevel: 'read',
		description:
			'Tool to retrieve a list of integrations where text values in the catalog can be overwritten. Use when you need to discover which sales channels support text customization and what languages are available for each integration.',
	},
	'inventory.getInventoryManufacturers': {
		riskLevel: 'read',
		description:
			'Tool to retrieve a list of manufacturers from the BaseLinker catalog. Use when you need to view all manufacturers available in the system before adding or modifying manufacturer information.',
	},
	'inventory.getInventoryPayers': {
		riskLevel: 'read',
		description:
			'Tool to retrieve a list of payers available in BaseLinker storage. Use when you need to list payers, optionally filtered by ID or name.',
	},
	'inventory.getInventoryPriceGroups': {
		riskLevel: 'read',
		description:
			'Tool to retrieve price groups existing in BaseLinker storage. Use when you need to discover available pricing tiers before assigning them to inventory items or performing price-related operations.',
	},
	'inventory.getInventoryPrintoutTemplates': {
		riskLevel: 'read',
		description:
			'Tool to retrieve a list of all configured printout templates available for inventory (products). Use when you need to discover available printout templates before generating product documents.',
	},
	'inventory.getInventoryProductLogs': {
		riskLevel: 'read',
		description:
			'Tool to retrieve a list of events related to product changes in the BaseLinker catalog. Use when tracking product modification history, auditing changes, or monitoring inventory updates.',
	},
	'inventory.getInventoryProductsData': {
		riskLevel: 'read',
		description:
			'Tool to retrieve detailed data for selected products from the BaseLinker inventory. Use when you need comprehensive product information including SKU, prices, stock, dimensions, descriptions, images, variants, and bundle details.',
	},
	'inventory.getInventoryProductsList': {
		riskLevel: 'read',
		description:
			'Tool to retrieve basic data of chosen products from BaseLinker catalogs. Use when you need to list products with optional filtering by ID, category, EAN, SKU, name, price range, or stock levels. Supports pagination for large catalogs (1000 products per page).',
	},
	'inventory.getInventoryProductsPrices': {
		riskLevel: 'read',
		description:
			'Retrieve gross prices of products from BaseLinker inventories. Use when you need to get pricing information for products and their variants across different price groups. Supports pagination for large product catalogs.',
	},
	'inventory.getInventoryProductsStock': {
		riskLevel: 'read',
		description:
			'Tool to retrieve stock data of products from BaseLinker catalogs. Use when you need to check current inventory levels, reservations, or variant stock across warehouses. Results are paginated at 1000 products per page.',
	},
	'purchaseOrders.getInventoryPurchaseOrderItems': {
		riskLevel: 'read',
		description:
			'Tool to retrieve items from a specific purchase order in BaseLinker. Use when you need to fetch product details from a purchase order with support for pagination (100 items per page).',
	},
	'purchaseOrders.getInventoryPurchaseOrderSeries': {
		riskLevel: 'read',
		description:
			'Tool to retrieve a list of purchase order document series. Use when you need to select a numbering series for a new purchase order.',
	},
	'purchaseOrders.getInventoryPurchaseOrders': {
		riskLevel: 'read',
		description:
			'Tool to retrieve a list of purchase orders from BaseLinker storage. Use when you need to fetch purchase orders with optional filters like date range, supplier or pagination.',
	},
	'inventory.getInventorySuppliers': {
		riskLevel: 'read',
		description:
			'Tool to retrieve a list of suppliers available in BaseLinker storage. Use when you need to list suppliers, optionally filtered by ID or name.',
	},
	'inventory.getInventoryTags': {
		riskLevel: 'read',
		description:
			'Tool to retrieve a list of tags for a BaseLinker catalog. Use when you need to view all tags available in the system before categorizing or filtering inventory items.',
	},
	'inventory.getInventoryWarehouses': {
		riskLevel: 'read',
		description:
			'Tool to retrieve a list of warehouses available in BaseLinker inventories. Use when you need to discover available warehouse locations before performing inventory or stock operations. Returns warehouses created manually as well as those created automatically for external stocks (shops, wholesalers).',
	},
	'documents.getInvoiceFile': {
		riskLevel: 'read',
		description:
			'Tool to retrieve an invoice file from BaseLinker in base64-encoded format. Use when you need to download an invoice document generated by BaseLinker or from an external accounting system.',
	},
	'documents.getInvoices': {
		riskLevel: 'read',
		description:
			'Download invoices from BaseLinker order manager with optional filtering. Use this tool to: - Fetch all invoices from a specific date onwards - Retrieve a single invoice by ID or order ID - Filter invoices by numbering series - Paginate through invoices using id_from parameter Returns up to 100 invoices per request. Use getSeries to get available series IDs for filtering.',
	},
	'orders.getJournalList': {
		riskLevel: 'read',
		description:
			'Tool to download order event logs from the last 3 days. Use when you need to track order activities, changes, or events. IMPORTANT: This method must be activated by BaseLinker support on your account. If not activated, it returns an empty response. Events include order creation, status changes, payments, invoices, receipts, product modifications, and package operations. Use last_log_id to paginate through results incrementally.',
	},
	'documents.getNewReceipts': {
		riskLevel: 'read',
		description:
			'Tool to retrieve receipts waiting to be issued. Use after confirming fiscal printer availability; fetch pending receipts and mark them with setOrderReceipt.',
	},
	'orders.getOrderExtraFields': {
		riskLevel: 'read',
		description:
			'Tool to retrieve extra fields defined for orders. Use before fetching orders with include_custom_extra_fields to list available custom order fields.',
	},
	'couriers.getOrderPackages': {
		riskLevel: 'read',
		description:
			'Tool to download shipments previously created for a selected order. Use when you need to retrieve tracking numbers, courier information, and delivery status for order packages.',
	},
	'orders.getOrderPaymentsHistory': {
		riskLevel: 'read',
		description:
			'Tool to retrieve payment history for a selected order, including external payment identifiers from payment gateways. Use when you need to track payment events for an order. One order can have multiple payment history entries due to surcharges, order value changes, or manual payment editing.',
	},
	'orders.getOrderPickPackHistory': {
		riskLevel: 'read',
		description:
			'Tool to retrieve pick and pack history for a selected order. Use when you need to track the fulfillment timeline and events for an order (reservations, picking, packing, photography). Returns chronological list of pick/pack events with timestamps and responsible profiles.',
	},
	'orders.getOrderPrintoutTemplates': {
		riskLevel: 'read',
		description:
			'Tool to retrieve a list of all configured printout templates available for orders. Use when you need to discover available printout templates before generating order documents.',
	},
	'returns.getOrderReturnExtraFields': {
		riskLevel: 'read',
		description:
			'Tool to retrieve extra fields defined for order returns. Use before calling getOrderReturns with include_custom_extra_fields to list available custom fields. Field values can be set via setOrderReturnFields.',
	},
	'returns.getOrderReturnJournalList': {
		riskLevel: 'read',
		description:
			'Tool to download return event logs from the last 3 days in BaseLinker. Use when tracking return order history, monitoring return status changes, or auditing return-related activities. Returns events like return creation, status changes, product modifications, and refund creation.',
	},
	'returns.getOrderReturnPaymentsHistory': {
		riskLevel: 'read',
		description:
			'Tool to retrieve payment history for a selected order return, including external payment identifiers from the payment gateway. Use when you need to track payment events, surcharges, order value changes, or manual payment edits for a return.',
	},
	'returns.getOrderReturnProductStatuses': {
		riskLevel: 'read',
		description:
			'Tool to retrieve a list of order return product statuses from BaseLinker. Use when you need to identify valid status IDs for return items, or to map status IDs to human-readable names.',
	},
	'returns.getOrderReturnReasonsList': {
		riskLevel: 'read',
		description:
			'Tool to retrieve a list of order return reasons. Use when you need to discover available return reasons before setting return fields with setOrderReturnFields.',
	},
	'returns.getOrderReturnStatusList': {
		riskLevel: 'read',
		description:
			'Tool to retrieve order return statuses created in the BaseLinker order manager. Use when you need to map return status IDs to human-readable names.',
	},
	'returns.getOrderReturns': {
		riskLevel: 'read',
		description:
			'Download order returns from BaseLinker return manager with optional filtering. Use this tool to: - Fetch returns from a specific date onwards using date_from parameter - Retrieve a single return by return_id - Filter returns by source order, status, or marketplace source - Paginate through returns using id_from parameter Returns up to 100 order returns per request. For complete return data including custom fields, set include_custom_extra_fields=true. Use include_connect_data=true for Base Connect integration info.',
	},
	'orders.getOrderSources': {
		riskLevel: 'read',
		description:
			'Tool to retrieve types of order sources along with their IDs from BaseLinker. Use when you need to understand available order sources for filtering orders or mapping order_source field values from getOrders method.',
	},
	'orders.getOrderStatusList': {
		riskLevel: 'read',
		description:
			'Tool to retrieve a list of order statuses created in the BaseLinker order manager. Use when you need to map status IDs to human-readable names.',
	},
	'orders.getOrderTransactionData': {
		riskLevel: 'read',
		description:
			'Tool to retrieve transaction details for a selected order. Use when you need marketplace transaction IDs, fulfillment data, or detailed tax breakdowns for an order.',
	},
	'orders.getOrders': {
		riskLevel: 'read',
		description:
			'Download orders from BaseLinker order manager with optional filtering. Use this tool to: - Fetch all orders from a specific date onwards - Retrieve a single order by ID - Filter orders by status, email, or marketplace source - Paginate through orders using id_from parameter Returns up to 100 orders per request. For confirmed orders only, omit get_unconfirmed_orders. Tip: Use getOrderStatusList to get status IDs for filtering.',
	},
	'orders.getOrdersByPhone': {
		riskLevel: 'read',
		description:
			'Search for orders associated with a specific phone number in BaseLinker. Use when identifying callers in phone recognition systems or finding order history by phone. Returns basic order information including status, recipient names, and timestamps.',
	},
	'couriers.getPackageDetails': {
		riskLevel: 'read',
		description:
			'Tool to get detailed information about a package. If the package contains multiple subpackages, information about all of them is included in the response. Use when you need comprehensive package dimensions, weight, COD, insurance, and shipping cost details.',
	},
	'orders.getPickPackCarts': {
		riskLevel: 'read',
		description:
			'Tool to retrieve a list of all PickPack carts belonging to the authenticated user. Use when you need to discover available carts and their details (ID, name, color) before performing cart-specific operations.',
	},
	'couriers.getProtocol': {
		riskLevel: 'read',
		description:
			'Tool to download a parcel protocol for selected shipments. Use when you need to retrieve shipping protocol documents (PDF or HTML) for packages sent via a courier. The protocol is available only if supported by the chosen courier.',
	},
	'documents.getReceipts': {
		riskLevel: 'read',
		description:
			'Tool to retrieve issued receipts from BaseLinker. Use when you need to fetch historical receipt data. Max 100 receipts returned per request.',
	},
	'couriers.getRequestParcelPickupFields': {
		riskLevel: 'read',
		description:
			'Tool to retrieve additional fields for a parcel pickup request from a specific courier. Use when preparing to request a parcel pickup and need to know which additional information the courier requires (e.g., pickup time, contact details, special instructions).',
	},
	'documents.getSeries': {
		riskLevel: 'read',
		description:
			'Tool to download invoice/receipt numbering series. Use when you need to retrieve all series configurations before issuing documents.',
	},
	'externalStorages.getStoragesList': {
		riskLevel: 'read',
		description:
			'Tool to download a list of available storages accessible via API. Use when you need to discover storage endpoints and capabilities before performing storage-specific operations.',
	},
	'orders.runOrderMacroTrigger': {
		riskLevel: 'write',
		description:
			'Tool to run personal trigger for orders automatic actions. Use when you need to execute a specific automation trigger on an order.',
	},
	'inventory.runProductMacroTrigger': {
		riskLevel: 'write',
		description:
			'Tool to execute a personal trigger for products automatic actions. Use when you need to manually run a custom event trigger for a specific product in BaseLinker inventory.',
	},
	'couriers.runRequestParcelPickup': {
		riskLevel: 'write',
		description:
			'Tool to request a parcel pickup for previously created shipments. Use when you need to schedule a courier pickup for packages that have been created. The method sends a pickup request to the courier API if the courier supports it. Use getRequestParcelPickupFields first to check if the courier requires additional fields.',
	},
	'purchaseOrders.setInventoryPurchaseOrderStatus': {
		riskLevel: 'write',
		description:
			"Tool to change the status of a purchase order in BaseLinker inventory. Use when you need to update a purchase order's status (e.g., mark as sent, received, completed, or canceled).",
	},
	'orders.setOrderFields': {
		riskLevel: 'write',
		description:
			'Tool to edit selected fields of a specific order in BaseLinker. Use when you need to update order details such as address data, notes, payment method, delivery information, or invoice details. Only provide the fields you want to change; other fields can be omitted.',
	},
	'orders.setOrderPayment': {
		riskLevel: 'write',
		description:
			'Tool to add a payment to an order in BaseLinker. Use when recording a payment for an order. The payment amount replaces (not adds to) the current payment value; if it matches the order total, the order is marked as paid.',
	},
	'orders.setOrderProductFields': {
		riskLevel: 'write',
		description:
			'Tool to edit data of selected items in a specific BaseLinker order. Use when you need to update product fields like prices, quantities, SKU, or other item details. Only provide the fields you want to edit; other fields can be omitted.',
	},
	'documents.setOrderReceipt': {
		riskLevel: 'write',
		description:
			'Tool to mark orders with a receipt already issued. Use after printing receipts retrieved from getNewReceipts to confirm receipt issuance.',
	},
	'returns.setOrderReturnFields': {
		riskLevel: 'write',
		description:
			'Tool to edit selected fields of a specific order return. Use when updating return information such as buyer contact details, delivery address, or custom fields. Only the fields that need to be changed should be provided; other fields can be omitted.',
	},
	'returns.setOrderReturnProductFields': {
		riskLevel: 'write',
		description:
			'Tool to edit data of selected items (e.g., prices, quantities, attributes) of a specific order return product. Use when you need to update fields of a returned product in an order return.',
	},
	'returns.setOrderReturnRefund': {
		riskLevel: 'write',
		description:
			"Tool to mark an order return as refunded in BaseLinker. Use when recording that a refund has been issued for a return. Note: This method doesn't issue an actual money refund - it only updates the refund status in BaseLinker.",
	},
	'returns.setOrderReturnStatus': {
		riskLevel: 'write',
		description:
			'Tool to change order return status in BaseLinker. Use when you need to update the status of a single order return.',
	},
	'returns.setOrderReturnStatuses': {
		riskLevel: 'write',
		description:
			'Tool to batch set order return statuses in BaseLinker. Use when you need to update the status of multiple order returns at once.',
	},
	'orders.setOrderStatus': {
		riskLevel: 'write',
		description:
			"Tool to change the status of an existing order in BaseLinker. Use when you need to update an order's status to a different value.",
	},
	'orders.setOrderStatuses': {
		riskLevel: 'write',
		description:
			'Tool to batch update order statuses in BaseLinker. Use when you need to set the same status for multiple orders at once.',
	},
	'orders.setOrdersMerge': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Tool to merge multiple orders into one, based on the selected merge mode. Use when you need to combine orders together with either technical merge or into main order mode.',
	},
	'inventory.updateInventoryProductsStock': {
		riskLevel: 'write',
		description:
			'Tool to update stocks of products and their variants in BaseLinker catalog. Use when you need to modify inventory levels for products across warehouses. Maximum 1000 products per request.',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof baseLinkerEndpointsNested
>;

export const baseLinkerAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

const defaultAuthType: AuthTypes = 'api_key' as const;

export type BaseBaseLinkerPlugin<T extends BaseLinkerPluginOptions> =
	CorsairPlugin<
		'baselinker',
		typeof BaseLinkerSchema,
		typeof baseLinkerEndpointsNested,
		{},
		T,
		typeof defaultAuthType
	>;
export type InternalBaseLinkerPlugin =
	BaseBaseLinkerPlugin<BaseLinkerPluginOptions>;
export type ExternalBaseLinkerPlugin<T extends BaseLinkerPluginOptions> =
	BaseBaseLinkerPlugin<T>;

export function baselinker<const T extends BaseLinkerPluginOptions>(
	incomingOptions: BaseLinkerPluginOptions & T = {} as BaseLinkerPluginOptions &
		T,
): ExternalBaseLinkerPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'baselinker',
		schema: BaseLinkerSchema,
		options,
		authConfig: baseLinkerAuthConfig,
		hooks: options.hooks,
		endpoints: baseLinkerEndpointsNested,
		webhooks: {},
		endpointMeta: baseLinkerEndpointMeta,
		endpointSchemas: baseLinkerEndpointSchemas,
		pluginWebhookMatcher: undefined,
		errorHandlers: { ...errorHandlers, ...options.errorHandlers },
		keyBuilder: async (ctx: BaseLinkerKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) return options.key;
			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();
				if (key) return key;
			}
			throw new AuthMissingError('baselinker', 'api_key');
		},
	} satisfies InternalBaseLinkerPlugin;
}

export { baseLinkerEndpointsNested };
export type {
	BaseLinkerEndpointInputs,
	BaseLinkerEndpointOutputs,
} from './endpoints/types';
