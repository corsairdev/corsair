import { createBaseLinkerEndpoint } from './factory';

export const BaseLinkerEndpoints = {
	inventory: {
		addInventory: createBaseLinkerEndpoint('addInventory'),
		addInventoryCategory: createBaseLinkerEndpoint('addInventoryCategory'),
		addInventoryManufacturer: createBaseLinkerEndpoint(
			'addInventoryManufacturer',
		),
		addInventoryPayer: createBaseLinkerEndpoint('addInventoryPayer'),
		addInventoryPriceGroup: createBaseLinkerEndpoint('addInventoryPriceGroup'),
		addInventoryProduct: createBaseLinkerEndpoint('addInventoryProduct'),
		addInventorySupplier: createBaseLinkerEndpoint('addInventorySupplier'),
		addInventoryWarehouse: createBaseLinkerEndpoint('addInventoryWarehouse'),
		deleteInventory: createBaseLinkerEndpoint('deleteInventory'),
		deleteInventoryCategory: createBaseLinkerEndpoint(
			'deleteInventoryCategory',
		),
		deleteInventoryManufacturer: createBaseLinkerEndpoint(
			'deleteInventoryManufacturer',
		),
		deleteInventoryPayer: createBaseLinkerEndpoint('deleteInventoryPayer'),
		deleteInventoryPriceGroup: createBaseLinkerEndpoint(
			'deleteInventoryPriceGroup',
		),
		deleteInventoryProduct: createBaseLinkerEndpoint('deleteInventoryProduct'),
		deleteInventoryWarehouse: createBaseLinkerEndpoint(
			'deleteInventoryWarehouse',
		),
		getInventories: createBaseLinkerEndpoint('getInventories'),
		getInventoryAvailableTextFieldKeys: createBaseLinkerEndpoint(
			'getInventoryAvailableTextFieldKeys',
		),
		getInventoryCategories: createBaseLinkerEndpoint('getInventoryCategories'),
		getInventoryExtraFields: createBaseLinkerEndpoint(
			'getInventoryExtraFields',
		),
		getInventoryIntegrations: createBaseLinkerEndpoint(
			'getInventoryIntegrations',
		),
		getInventoryManufacturers: createBaseLinkerEndpoint(
			'getInventoryManufacturers',
		),
		getInventoryPayers: createBaseLinkerEndpoint('getInventoryPayers'),
		getInventoryPriceGroups: createBaseLinkerEndpoint(
			'getInventoryPriceGroups',
		),
		getInventoryPrintoutTemplates: createBaseLinkerEndpoint(
			'getInventoryPrintoutTemplates',
		),
		getInventoryProductLogs: createBaseLinkerEndpoint(
			'getInventoryProductLogs',
		),
		getInventoryProductsData: createBaseLinkerEndpoint(
			'getInventoryProductsData',
		),
		getInventoryProductsList: createBaseLinkerEndpoint(
			'getInventoryProductsList',
		),
		getInventoryProductsPrices: createBaseLinkerEndpoint(
			'getInventoryProductsPrices',
		),
		getInventoryProductsStock: createBaseLinkerEndpoint(
			'getInventoryProductsStock',
		),
		getInventorySuppliers: createBaseLinkerEndpoint('getInventorySuppliers'),
		getInventoryTags: createBaseLinkerEndpoint('getInventoryTags'),
		getInventoryWarehouses: createBaseLinkerEndpoint('getInventoryWarehouses'),
		runProductMacroTrigger: createBaseLinkerEndpoint('runProductMacroTrigger'),
		updateInventoryProductsStock: createBaseLinkerEndpoint(
			'updateInventoryProductsStock',
		),
	},
	inventoryDocuments: {
		addInventoryDocument: createBaseLinkerEndpoint('addInventoryDocument'),
		getInventoryDocumentItems: createBaseLinkerEndpoint(
			'getInventoryDocumentItems',
		),
		getInventoryDocumentSeries: createBaseLinkerEndpoint(
			'getInventoryDocumentSeries',
		),
		getInventoryDocuments: createBaseLinkerEndpoint('getInventoryDocuments'),
	},
	purchaseOrders: {
		addInventoryPurchaseOrder: createBaseLinkerEndpoint(
			'addInventoryPurchaseOrder',
		),
		addInventoryPurchaseOrderItems: createBaseLinkerEndpoint(
			'addInventoryPurchaseOrderItems',
		),
		getInventoryPurchaseOrderItems: createBaseLinkerEndpoint(
			'getInventoryPurchaseOrderItems',
		),
		getInventoryPurchaseOrderSeries: createBaseLinkerEndpoint(
			'getInventoryPurchaseOrderSeries',
		),
		getInventoryPurchaseOrders: createBaseLinkerEndpoint(
			'getInventoryPurchaseOrders',
		),
		setInventoryPurchaseOrderStatus: createBaseLinkerEndpoint(
			'setInventoryPurchaseOrderStatus',
		),
	},
	documents: {
		addInvoice: createBaseLinkerEndpoint('addInvoice'),
		addInvoiceCorrection: createBaseLinkerEndpoint('addInvoiceCorrection'),
		getInvoiceFile: createBaseLinkerEndpoint('getInvoiceFile'),
		getInvoices: createBaseLinkerEndpoint('getInvoices'),
		getNewReceipts: createBaseLinkerEndpoint('getNewReceipts'),
		getReceipts: createBaseLinkerEndpoint('getReceipts'),
		getSeries: createBaseLinkerEndpoint('getSeries'),
		setOrderReceipt: createBaseLinkerEndpoint('setOrderReceipt'),
	},
	orders: {
		addOrder: createBaseLinkerEndpoint('addOrder'),
		addOrderBySplit: createBaseLinkerEndpoint('addOrderBySplit'),
		addOrderDuplicate: createBaseLinkerEndpoint('addOrderDuplicate'),
		deleteOrderProduct: createBaseLinkerEndpoint('deleteOrderProduct'),
		deleteOrders: createBaseLinkerEndpoint('deleteOrders'),
		getJournalList: createBaseLinkerEndpoint('getJournalList'),
		getOrderExtraFields: createBaseLinkerEndpoint('getOrderExtraFields'),
		getOrderPaymentsHistory: createBaseLinkerEndpoint(
			'getOrderPaymentsHistory',
		),
		getOrderPickPackHistory: createBaseLinkerEndpoint(
			'getOrderPickPackHistory',
		),
		getOrderPrintoutTemplates: createBaseLinkerEndpoint(
			'getOrderPrintoutTemplates',
		),
		getOrderSources: createBaseLinkerEndpoint('getOrderSources'),
		getOrderStatusList: createBaseLinkerEndpoint('getOrderStatusList'),
		getOrderTransactionData: createBaseLinkerEndpoint(
			'getOrderTransactionData',
		),
		getOrders: createBaseLinkerEndpoint('getOrders'),
		getOrdersByPhone: createBaseLinkerEndpoint('getOrdersByPhone'),
		getPickPackCarts: createBaseLinkerEndpoint('getPickPackCarts'),
		runOrderMacroTrigger: createBaseLinkerEndpoint('runOrderMacroTrigger'),
		setOrderFields: createBaseLinkerEndpoint('setOrderFields'),
		setOrderPayment: createBaseLinkerEndpoint('setOrderPayment'),
		setOrderProductFields: createBaseLinkerEndpoint('setOrderProductFields'),
		setOrderStatus: createBaseLinkerEndpoint('setOrderStatus'),
		setOrderStatuses: createBaseLinkerEndpoint('setOrderStatuses'),
		setOrdersMerge: createBaseLinkerEndpoint('setOrdersMerge'),
	},
	returns: {
		addOrderReturn: createBaseLinkerEndpoint('addOrderReturn'),
		addOrderReturnProduct: createBaseLinkerEndpoint('addOrderReturnProduct'),
		deleteOrderReturnProduct: createBaseLinkerEndpoint(
			'deleteOrderReturnProduct',
		),
		getOrderReturnExtraFields: createBaseLinkerEndpoint(
			'getOrderReturnExtraFields',
		),
		getOrderReturnJournalList: createBaseLinkerEndpoint(
			'getOrderReturnJournalList',
		),
		getOrderReturnPaymentsHistory: createBaseLinkerEndpoint(
			'getOrderReturnPaymentsHistory',
		),
		getOrderReturnProductStatuses: createBaseLinkerEndpoint(
			'getOrderReturnProductStatuses',
		),
		getOrderReturnReasonsList: createBaseLinkerEndpoint(
			'getOrderReturnReasonsList',
		),
		getOrderReturnStatusList: createBaseLinkerEndpoint(
			'getOrderReturnStatusList',
		),
		getOrderReturns: createBaseLinkerEndpoint('getOrderReturns'),
		setOrderReturnFields: createBaseLinkerEndpoint('setOrderReturnFields'),
		setOrderReturnProductFields: createBaseLinkerEndpoint(
			'setOrderReturnProductFields',
		),
		setOrderReturnRefund: createBaseLinkerEndpoint('setOrderReturnRefund'),
		setOrderReturnStatus: createBaseLinkerEndpoint('setOrderReturnStatus'),
		setOrderReturnStatuses: createBaseLinkerEndpoint('setOrderReturnStatuses'),
	},
	externalStorages: {
		addCategory: createBaseLinkerEndpoint('addCategory'),
		getExternalStorageProductsQuantity: createBaseLinkerEndpoint(
			'getExternalStorageProductsQuantity',
		),
		getExternalStoragesList: createBaseLinkerEndpoint(
			'getExternalStoragesList',
		),
		getStoragesList: createBaseLinkerEndpoint('getStoragesList'),
	},
	couriers: {
		createPackageManual: createBaseLinkerEndpoint('createPackageManual'),
		getCourierAccounts: createBaseLinkerEndpoint('getCourierAccounts'),
		getCourierFields: createBaseLinkerEndpoint('getCourierFields'),
		getCourierPackagesStatusHistory: createBaseLinkerEndpoint(
			'getCourierPackagesStatusHistory',
		),
		getCouriersList: createBaseLinkerEndpoint('getCouriersList'),
		getOrderPackages: createBaseLinkerEndpoint('getOrderPackages'),
		getPackageDetails: createBaseLinkerEndpoint('getPackageDetails'),
		getProtocol: createBaseLinkerEndpoint('getProtocol'),
		getRequestParcelPickupFields: createBaseLinkerEndpoint(
			'getRequestParcelPickupFields',
		),
		runRequestParcelPickup: createBaseLinkerEndpoint('runRequestParcelPickup'),
	},
	connect: {
		getConnectIntegrationContractors: createBaseLinkerEndpoint(
			'getConnectIntegrationContractors',
		),
		getConnectIntegrations: createBaseLinkerEndpoint('getConnectIntegrations'),
	},
} as const;

export * from './operations';
export * from './types';
