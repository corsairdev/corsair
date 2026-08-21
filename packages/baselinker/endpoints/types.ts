import { z } from 'zod';

/** BaseLinker calls JSON objects "arrays" when their keys are entity IDs. */
export const BaseLinkerInputCollectionSchema = z.union([
	z.array(z.unknown()),
	z.record(z.string(), z.unknown()),
]);

export const BaseLinkerOutputCollectionSchema = z.union([
	z.array(z.unknown()),
	z.record(z.string(), z.unknown()),
]);

export const BaseLinkerEndpointInputSchemas = {
	addInventory: z
		.object({
			inventory_id: z.number().int(),
			name: z.string().max(100).optional(),
			description: z.string().optional(),
			languages: BaseLinkerInputCollectionSchema.optional(),
			default_language: z.string().length(2).optional(),
			price_groups: BaseLinkerInputCollectionSchema.optional(),
			default_price_group: z.number().int().optional(),
			warehouses: BaseLinkerInputCollectionSchema.optional(),
			default_warehouse: z.string().max(30).optional(),
			reservations: z.boolean().optional(),
		})
		.loose(),
	addInventoryCategory: z
		.object({
			inventory_id: z.number().int(),
			category_id: z.number().int().optional(),
			name: z.string().max(200).optional(),
			parent_id: z.number().int().optional(),
		})
		.loose(),
	addInventoryDocument: z
		.object({
			warehouse_id: z.number().int(),
			document_type: z.number().int().optional(),
			target_warehouse_id: z.number().int().optional(),
			date_add: z.number().int().optional(),
			date_execute: z.number().int().optional(),
			contractor: z.string().max(500).optional(),
			invoice_no: z.string().max(50).optional(),
			notes: z.string().max(500).optional(),
		})
		.loose(),
	addInventoryManufacturer: z
		.object({
			manufacturer_id: z.number().int(),
			name: z.string().max(200).optional(),
			manufacturer_name: z.string().max(200).optional(),
			manufacturer_photo: z.string().optional(),
			manufacturer_url: z.string().max(200).optional(),
			manufacturer_street: z.string().max(200).optional(),
			manufacturer_postcode: z.string().max(20).optional(),
			manufacturer_city: z.string().max(80).optional(),
			manufacturer_state: z.string().max(35).optional(),
			manufacturer_country_code: z.string().max(2).optional(),
			manufacturer_email: z.string().max(100).optional(),
			manufacturer_phone: z.string().max(40).optional(),
		})
		.loose(),
	addInventoryPayer: z
		.object({
			payer_id: z.number().int().optional(),
			name: z.string().max(40),
			address: z.string().max(200).optional(),
			postcode: z.string().max(20).optional(),
			city: z.string().max(80).optional(),
			tax_no: z.string().max(40).optional(),
		})
		.loose(),
	addInventoryPriceGroup: z
		.object({
			price_group_id: z.number().int().optional(),
			name: z.string().max(100).optional(),
			description: z.string().optional(),
			currency: z.string().length(3).optional(),
			price_group_type: z.string().optional(),
			source_price_group_id: z.number().int().optional(),
			price_multiplier: z.number().optional(),
			price_addition: z.number().optional(),
			is_bundle_price_calculated: z.boolean().optional(),
			bundle_price_multiplier: z.number().optional(),
			bundle_price_addition: z.number().optional(),
		})
		.loose(),
	addInventoryProduct: z
		.object({
			inventory_id: z.number().int(),
			product_id: z.number().int().optional(),
			parent_id: z.number().int().optional(),
			is_bundle: z.boolean().optional(),
			sku: z.string().max(50).optional(),
			ean: z.string().max(32).optional(),
			ean_additional: BaseLinkerInputCollectionSchema.optional(),
			asin: z.string().max(50).optional(),
			tags: BaseLinkerInputCollectionSchema.optional(),
			tax_rate: z.number().optional(),
			weight: z.number().optional(),
			height: z.number().optional(),
			width: z.number().optional(),
			length: z.number().optional(),
			average_cost: z.number().optional(),
			star: z.number().int().optional(),
			manufacturer_id: z.number().int().optional(),
			category_id: z.number().int().optional(),
			prices: BaseLinkerInputCollectionSchema.optional(),
			stock: BaseLinkerInputCollectionSchema.optional(),
			locations: BaseLinkerInputCollectionSchema.optional(),
			text_fields: BaseLinkerInputCollectionSchema.optional(),
			images: BaseLinkerInputCollectionSchema.optional(),
			videos: BaseLinkerInputCollectionSchema.optional(),
			media_options: BaseLinkerInputCollectionSchema.optional(),
			links: BaseLinkerInputCollectionSchema.optional(),
			bundle_products: BaseLinkerInputCollectionSchema.optional(),
			suppliers: BaseLinkerInputCollectionSchema.optional(),
		})
		.loose(),
	addInventoryPurchaseOrder: z
		.object({
			warehouse_id: z.number().int(),
			supplier_id: z.number().int().optional(),
			payer_id: z.number().int().optional(),
			currency: z.string().max(3).optional(),
			name: z.string().max(80).optional(),
			notes: z.string().optional(),
			invoice_no: z.string().max(50).optional(),
			date_delivery_expected: z.number().int().optional(),
			additional_costs: BaseLinkerInputCollectionSchema.optional(),
			packages: BaseLinkerInputCollectionSchema.optional(),
		})
		.loose(),
	addInventoryPurchaseOrderItems: z
		.object({
			order_id: z.number().int(),
			items: BaseLinkerInputCollectionSchema.optional(),
		})
		.loose(),
	addInventorySupplier: z
		.object({
			supplier_id: z.number().int().optional(),
			name: z.string().max(40),
			take_product_cost_from: z.string().max(20).optional(),
			take_product_code_from: z.string().max(20).optional(),
			address: z.string().max(200).optional(),
			postcode: z.string().max(20).optional(),
			city: z.string().max(80).optional(),
			phone: z.string().max(40).optional(),
			email: z.string().max(200).optional(),
			email_copy_to: z.string().max(200).optional(),
			currency: z.string().max(3).optional(),
			tax_no: z.string().max(16).optional(),
		})
		.loose(),
	addInventoryWarehouse: z
		.object({
			warehouse_id: z.number().int(),
			name: z.string().max(100).optional(),
			description: z.string().optional(),
			stock_edition: z.boolean().optional(),
			country: z.string().length(2).optional(),
			address: z.string().max(200).optional(),
			postcode: z.string().max(20).optional(),
			city: z.string().max(80).optional(),
		})
		.loose(),
	addInvoice: z
		.object({
			order_id: z.number().int(),
			series_id: z.number().int().optional(),
			vat_rate: z.string().optional(),
		})
		.loose(),
	addInvoiceCorrection: z
		.object({
			original_invoice_id: z.number().int(),
			return_order_id: z.number().int().optional(),
			series_id: z.number().int().optional(),
			date_sell: z.number().int().optional(),
			correcting_reason: z.number().int().optional(),
			correcting_items: z.boolean().optional(),
			correcting_data: z.boolean().optional(),
			invoice_fullname: z.string().max(100).optional(),
			invoice_company: z.string().max(100).optional(),
			invoice_address: z.string().max(100).optional(),
			invoice_postcode: z.string().max(100).optional(),
			invoice_city: z.string().max(100).optional(),
			invoice_state: z.string().max(100).optional(),
			invoice_country_code: z.string().max(100).optional(),
			invoice_nip: z.string().max(100).optional(),
			items: BaseLinkerInputCollectionSchema.optional(),
			fv_payment: z.string().max(100).optional(),
			fv_person: z.string().max(100).optional(),
		})
		.loose(),
	addOrder: z
		.object({
			order_status_id: z.number().int(),
			custom_source_id: z.number().int().optional(),
			date_add: z.number().int().optional(),
			currency: z.string().length(3).optional(),
			payment_method: z.string().max(30).optional(),
			payment_method_cod: z.boolean().optional(),
			paid: z.boolean().optional(),
			user_comments: z.string().max(510).optional(),
			admin_comments: z.string().max(200).optional(),
			email: z.string().max(150).optional(),
			phone: z.string().max(100).optional(),
			user_login: z.string().max(30).optional(),
			delivery_method: z.string().max(30).optional(),
			delivery_price: z.number().optional(),
			delivery_fullname: z.string().max(156).optional(),
			delivery_company: z.string().max(156).optional(),
			delivery_address: z.string().max(156).optional(),
			delivery_postcode: z.string().max(100).optional(),
			delivery_city: z.string().max(100).optional(),
			delivery_state: z.string().max(35).optional(),
			delivery_country_code: z.string().length(2).optional(),
			delivery_point_id: z.string().max(40).optional(),
			delivery_point_name: z.string().max(100).optional(),
			delivery_point_address: z.string().max(100).optional(),
			delivery_point_postcode: z.string().max(100).optional(),
			delivery_point_city: z.string().max(100).optional(),
			invoice_fullname: z.string().max(500).optional(),
			invoice_company: z.string().max(500).optional(),
			invoice_nip: z.string().max(100).optional(),
			invoice_address: z.string().max(500).optional(),
			invoice_postcode: z.string().max(20).optional(),
			invoice_city: z.string().max(100).optional(),
			invoice_state: z.string().max(35).optional(),
			invoice_country_code: z.string().length(2).optional(),
			want_invoice: z.boolean().optional(),
			extra_field_1: z.string().max(50).optional(),
			extra_field_2: z.string().max(50).optional(),
			custom_extra_fields: BaseLinkerInputCollectionSchema.optional(),
			products: BaseLinkerInputCollectionSchema.optional(),
		})
		.loose(),
	addOrderBySplit: z
		.object({
			order_id: z.number().int(),
			items_to_split: BaseLinkerInputCollectionSchema.optional(),
			delivery_cost_to_split: z.number().optional(),
		})
		.loose(),
	addOrderDuplicate: z
		.object({
			order_id: z.number().int(),
		})
		.loose(),
	addOrderReturn: z
		.object({
			order_id: z.number().int().optional(),
			status_id: z.number().int().optional(),
			custom_source_id: z.number().int().optional(),
			reference_number: z.string().max(100).optional(),
			date_add: z.number().int().optional(),
			currency: z.string().length(3).optional(),
			refunded: z.boolean().optional(),
			admin_comments: z.string().max(200).optional(),
			email: z.string().max(150).optional(),
			phone: z.string().max(100).optional(),
			user_login: z.string().max(30).optional(),
			delivery_price: z.number().optional(),
			delivery_fullname: z.string().max(100).optional(),
			delivery_company: z.string().max(100).optional(),
			delivery_address: z.string().max(100).optional(),
			delivery_postcode: z.string().max(100).optional(),
			delivery_city: z.string().max(100).optional(),
			delivery_state: z.string().max(20).optional(),
			delivery_country_code: z.string().length(2).optional(),
			extra_field_1: z.string().max(50).optional(),
			extra_field_2: z.string().max(50).optional(),
			custom_extra_fields: BaseLinkerInputCollectionSchema.optional(),
			products: BaseLinkerInputCollectionSchema.optional(),
			refund_account_number: z.string().max(50).optional(),
			refund_iban: z.string().max(34).optional(),
			refund_swift: z.string().max(11).optional(),
		})
		.loose(),
	addOrderReturnProduct: z
		.object({
			return_id: z.number().int().optional(),
			order_product_id: z.number().int().optional(),
			storage: z.string().max(9).optional(),
			storage_id: z.string().max(50).optional(),
			product_id: z.string().max(50).optional(),
			variant_id: z.string().max(30).optional(),
			auction_id: z.string().max(20).optional(),
			name: z.string().max(200).optional(),
			sku: z.string().max(50).optional(),
			ean: z.string().max(32).optional(),
			location: z.string().max(50).optional(),
			warehouse_id: z.number().int().optional(),
			attributes: z.string().max(350).optional(),
			price_brutto: z.number().optional(),
			tax_rate: z.number().optional(),
			quantity: z.number().int().optional(),
			weight: z.number().optional(),
			status_id: z.number().int().optional(),
			return_reason_id: z.number().int().optional(),
		})
		.loose(),
	addCategory: z
		.object({
			storage_id: z.string().max(30),
			category_id: z.number().int().optional(),
			name: z.string().max(200).optional(),
			parent_id: z.number().int().optional(),
		})
		.loose(),
	createPackageManual: z
		.object({
			order_id: z.number().int(),
			courier_code: z.string().max(20).optional(),
			package_number: z.string().max(40).optional(),
			pickup_date: z.number().int().optional(),
			return_shipment: z.boolean().optional(),
		})
		.loose(),
	deleteInventory: z
		.object({
			inventory_id: z.number().int(),
		})
		.loose(),
	deleteInventoryCategory: z
		.object({
			category_id: z.number().int(),
		})
		.loose(),
	deleteInventoryManufacturer: z
		.object({
			manufacturer_id: z.number().int(),
		})
		.loose(),
	deleteInventoryPayer: z
		.object({
			payer_id: z.number().int(),
		})
		.loose(),
	deleteInventoryPriceGroup: z
		.object({
			price_group_id: z.number().int(),
		})
		.loose(),
	deleteInventoryProduct: z
		.object({
			product_id: z.number().int(),
		})
		.loose(),
	deleteInventoryWarehouse: z
		.object({
			warehouse_id: z.number().int(),
		})
		.loose(),
	deleteOrderProduct: z
		.object({
			order_id: z.number().int(),
			order_product_id: z.number().int(),
		})
		.loose(),
	deleteOrderReturnProduct: z
		.object({
			return_id: z.number().int(),
			order_return_product_id: z.number().int(),
		})
		.loose(),
	deleteOrders: z
		.object({
			order_ids: BaseLinkerInputCollectionSchema,
		})
		.loose(),
	getConnectIntegrationContractors: z
		.object({
			connect_integration_id: z.number().int(),
		})
		.loose(),
	getConnectIntegrations: z.object({}).loose(),
	getCourierAccounts: z
		.object({
			courier_code: z.string().max(20),
		})
		.loose(),
	getCourierFields: z
		.object({
			courier_code: z.string().max(20),
		})
		.loose(),
	getCourierPackagesStatusHistory: z
		.object({
			package_ids: BaseLinkerInputCollectionSchema,
		})
		.loose(),
	getCouriersList: z.object({}).loose(),
	getExternalStorageProductsQuantity: z
		.object({
			storage_id: z.string().max(30),
			page: z.number().int().optional(),
		})
		.loose(),
	getExternalStoragesList: z.object({}).loose(),
	getInventories: z.object({}).loose(),
	getInventoryAvailableTextFieldKeys: z
		.object({
			inventory_id: z.number().int(),
		})
		.loose(),
	getInventoryCategories: z
		.object({
			inventory_id: z.number().int(),
		})
		.loose(),
	getInventoryDocumentItems: z
		.object({
			document_id: z.number().int(),
			page: z.number().int().optional(),
		})
		.loose(),
	getInventoryDocumentSeries: z
		.object({
			warehouse_id: z.number().int().optional(),
		})
		.loose(),
	getInventoryDocuments: z
		.object({
			filter_source_object_type: z.number().int().optional(),
			filter_source_object_id: z.number().int().optional(),
			filter_document_id: z.number().int().optional(),
			filter_document_type: z.number().int().optional(),
			filter_document_status: z.number().int().optional(),
			filter_date_from: z.number().int().optional(),
			filter_date_to: z.number().int().optional(),
			filter_warehouse_id: z.number().int().optional(),
			page: z.number().int().optional(),
		})
		.loose(),
	getInventoryExtraFields: z.object({}).loose(),
	getInventoryIntegrations: z
		.object({
			inventory_id: z.number().int(),
		})
		.loose(),
	getInventoryManufacturers: z
		.object({
			page: z.number().int().optional(),
		})
		.loose(),
	getInventoryPayers: z
		.object({
			filter_id: z.number().int().optional(),
			filter_name: z.string().max(40).optional(),
		})
		.loose(),
	getInventoryPriceGroups: z.object({}).loose(),
	getInventoryPrintoutTemplates: z.object({}).loose(),
	getInventoryProductLogs: z
		.object({
			product_id: z.number().int(),
			date_from: z.number().int().optional(),
			date_to: z.number().int().optional(),
			log_type: z.number().int().optional(),
			sort: z.string().max(4).optional(),
			page: z.number().int().optional(),
		})
		.loose(),
	getInventoryProductsData: z
		.object({
			inventory_id: z.number().int(),
			products: BaseLinkerInputCollectionSchema.optional(),
			include_erp_units: z.boolean().optional(),
			include_wms_units: z.boolean().optional(),
			include_additional_eans: z.boolean().optional(),
			include_suppliers: z.boolean().optional(),
			include_relations: z.boolean().optional(),
			include_marketplace_categories: z.boolean().optional(),
			include_channels_media: z.boolean().optional(),
		})
		.loose(),
	getInventoryProductsList: z
		.object({
			inventory_id: z.number().int(),
			filter_id: z.number().int().optional(),
			filter_category_id: z.number().int().optional(),
			filter_ean: z.string().max(32).optional(),
			filter_sku: z.string().max(50).optional(),
			filter_name: z.string().max(200).optional(),
			filter_price_from: z.number().optional(),
			filter_price_to: z.number().optional(),
			filter_stock_from: z.number().int().optional(),
			filter_stock_to: z.number().int().optional(),
			page: z.number().int().optional(),
			filter_sort: z.string().max(30).optional(),
			filter_locations: z.string().max(20).optional(),
			include_variants: z.boolean().optional(),
		})
		.loose(),
	getInventoryProductsPrices: z
		.object({
			inventory_id: z.number().int(),
			page: z.number().int().optional(),
		})
		.loose(),
	getInventoryProductsStock: z
		.object({
			inventory_id: z.number().int(),
			filter_id: z.number().int().optional(),
			filter_category_id: z.number().int().optional(),
			filter_ean: z.string().max(32).optional(),
			filter_sku: z.string().max(50).optional(),
			filter_name: z.string().max(200).optional(),
			filter_asin: z.string().max(50).optional(),
			filter_stock_from: z.number().int().optional(),
			filter_stock_to: z.number().int().optional(),
			page: z.number().int().optional(),
			filter_sort: z.string().max(30).optional(),
			filter_locations: z.string().max(20).optional(),
		})
		.loose(),
	getInventoryPurchaseOrderItems: z
		.object({
			order_id: z.number().int(),
			page: z.number().int().optional(),
		})
		.loose(),
	getInventoryPurchaseOrderSeries: z
		.object({
			warehouse_id: z.number().int().optional(),
		})
		.loose(),
	getInventoryPurchaseOrders: z
		.object({
			warehouse_id: z.number().int().optional(),
			supplier_id: z.number().int().optional(),
			series_id: z.number().int().optional(),
			date_from: z.number().int().optional(),
			date_to: z.number().int().optional(),
			filter_document_number: z.string().max(50).optional(),
			filter_product_id: z.number().int().optional(),
			page: z.number().int().optional(),
		})
		.loose(),
	getInventorySuppliers: z
		.object({
			filter_id: z.number().int().optional(),
			filter_name: z.string().max(40).optional(),
		})
		.loose(),
	getInventoryTags: z.object({}).loose(),
	getInventoryWarehouses: z.object({}).loose(),
	getInvoiceFile: z
		.object({
			invoice_id: z.number().int(),
			get_external: z.boolean().optional(),
		})
		.loose(),
	getInvoices: z
		.object({
			invoice_id: z.number().int().optional(),
			order_id: z.number().int().optional(),
			date_from: z.number().int().optional(),
			id_from: z.number().int().optional(),
			series_id: z.number().int().optional(),
			get_external_invoices: z.boolean().optional(),
			get_government_data: z.boolean().optional(),
		})
		.loose(),
	getJournalList: z
		.object({
			last_log_id: z.number().int(),
			logs_types: BaseLinkerInputCollectionSchema.optional(),
			order_id: z.number().int().optional(),
		})
		.loose(),
	getNewReceipts: z
		.object({
			series_id: z.number().int().optional(),
			id_from: z.number().int().optional(),
		})
		.loose(),
	getOrderExtraFields: z.object({}).loose(),
	getOrderPackages: z
		.object({
			order_id: z.number().int(),
		})
		.loose(),
	getOrderPaymentsHistory: z
		.object({
			order_id: z.number().int(),
			show_full_history: z.boolean().optional(),
		})
		.loose(),
	getOrderPickPackHistory: z
		.object({
			order_id: z.number().int(),
			action_type: z.number().int().optional(),
		})
		.loose(),
	getOrderPrintoutTemplates: z.object({}).loose(),
	getOrderReturnExtraFields: z.object({}).loose(),
	getOrderReturnJournalList: z
		.object({
			last_log_id: z.number().int(),
			logs_types: BaseLinkerInputCollectionSchema.optional(),
			return_id: z.number().int().optional(),
		})
		.loose(),
	getOrderReturnPaymentsHistory: z
		.object({
			return_id: z.number().int(),
			show_full_history: z.boolean().optional(),
		})
		.loose(),
	getOrderReturnProductStatuses: z.object({}).loose(),
	getOrderReturnReasonsList: z.object({}).loose(),
	getOrderReturnStatusList: z.object({}).loose(),
	getOrderReturns: z
		.object({
			order_id: z.number().int().optional(),
			return_id: z.number().int().optional(),
			date_from: z.number().int().optional(),
			id_from: z.number().int().optional(),
			status_id: z.number().int().optional(),
			filter_order_return_source: z.string().max(20).optional(),
			filter_order_return_source_id: z.number().int().optional(),
			include_custom_extra_fields: z.boolean().optional(),
			include_connect_data: z.boolean().optional(),
		})
		.loose(),
	getOrderSources: z.object({}).loose(),
	getOrderStatusList: z.object({}).loose(),
	getOrderTransactionData: z
		.object({
			order_id: z.number().int(),
			include_complex_taxes: z.boolean().optional(),
			include_amazon_data: z.boolean().optional(),
		})
		.loose(),
	getOrders: z
		.object({
			order_id: z.number().int().optional(),
			date_confirmed_from: z.number().int().optional(),
			date_from: z.number().int().optional(),
			id_from: z.number().int().optional(),
			get_unconfirmed_orders: z.boolean().optional(),
			status_id: z.number().int().optional(),
			filter_email: z.string().max(50).optional(),
			filter_order_source: z.string().max(20).optional(),
			filter_order_source_id: z.number().int().optional(),
			filter_shop_order_id: z.number().int().optional(),
			filter_external_order_id: z.string().max(50).optional(),
			include_custom_extra_fields: z.boolean().optional(),
			include_commissions: z.boolean().optional(),
			include_connect_data: z.boolean().optional(),
			include_discounts_data: z.boolean().optional(),
		})
		.loose(),
	getOrdersByPhone: z
		.object({
			phone: z.string().max(50),
		})
		.loose(),
	getPackageDetails: z
		.object({
			package_id: z.number().int(),
		})
		.loose(),
	getPickPackCarts: z.object({}).loose(),
	getProtocol: z
		.object({
			courier_code: z.string().max(20),
			package_ids: BaseLinkerInputCollectionSchema.optional(),
			package_numbers: BaseLinkerInputCollectionSchema.optional(),
			account_id: z.number().int().optional(),
		})
		.loose(),
	getReceipts: z
		.object({
			series_id: z.number().int().optional(),
			id_from: z.number().int().optional(),
			date_from: z.number().int().optional(),
			date_to: z.number().int().optional(),
		})
		.loose(),
	getRequestParcelPickupFields: z
		.object({
			courier_code: z.string().max(20),
		})
		.loose(),
	getSeries: z.object({}).loose(),
	getStoragesList: z.object({}).loose(),
	runOrderMacroTrigger: z
		.object({
			order_id: z.number().int(),
			trigger_id: z.number().int(),
		})
		.loose(),
	runProductMacroTrigger: z
		.object({
			product_id: z.number().int(),
			trigger_id: z.number().int(),
		})
		.loose(),
	runRequestParcelPickup: z
		.object({
			courier_code: z.string().max(20),
			package_ids: BaseLinkerInputCollectionSchema.optional(),
			package_numbers: BaseLinkerInputCollectionSchema.optional(),
			account_id: z.number().int(),
			fields: BaseLinkerInputCollectionSchema,
		})
		.loose(),
	setInventoryPurchaseOrderStatus: z
		.object({
			order_id: z.number().int(),
			status: z.number().int(),
			completed_items: BaseLinkerInputCollectionSchema.optional(),
		})
		.loose(),
	setOrderFields: z
		.object({
			order_id: z.number().int(),
			admin_comments: z.string().max(200).optional(),
			user_comments: z.string().max(510).optional(),
			payment_method: z.string().max(30).optional(),
			payment_method_cod: z.boolean().optional(),
			email: z.string().max(150).optional(),
			phone: z.string().max(100).optional(),
			user_login: z.string().max(30).optional(),
			delivery_method: z.string().max(30).optional(),
			delivery_price: z.number().optional(),
			delivery_fullname: z.string().max(156).optional(),
			delivery_company: z.string().max(156).optional(),
			delivery_address: z.string().max(156).optional(),
			delivery_postcode: z.string().max(100).optional(),
			delivery_city: z.string().max(100).optional(),
			delivery_state: z.string().max(35).optional(),
			delivery_country_code: z.string().length(2).optional(),
			delivery_point_id: z.string().max(40).optional(),
			delivery_point_name: z.string().max(100).optional(),
			delivery_point_address: z.string().max(100).optional(),
			delivery_point_postcode: z.string().max(100).optional(),
			delivery_point_city: z.string().max(100).optional(),
			invoice_fullname: z.string().max(500).optional(),
			invoice_company: z.string().max(500).optional(),
			invoice_nip: z.string().max(100).optional(),
			invoice_address: z.string().max(500).optional(),
			invoice_postcode: z.string().max(20).optional(),
			invoice_city: z.string().max(100).optional(),
			invoice_state: z.string().max(35).optional(),
			invoice_country_code: z.string().length(2).optional(),
			want_invoice: z.boolean().optional(),
			extra_field_1: z.string().max(50).optional(),
			extra_field_2: z.string().max(50).optional(),
			custom_extra_fields: BaseLinkerInputCollectionSchema.optional(),
			pick_state: z.number().int().optional(),
			pack_state: z.number().int().optional(),
			star: z.number().int().optional(),
		})
		.loose(),
	setOrderPayment: z
		.object({
			order_id: z.number().int(),
			payment_done: z.number(),
			payment_date: z.number().int(),
			payment_comment: z.string().max(30),
			external_payment_id: z.string().max(30).optional(),
		})
		.loose(),
	setOrderProductFields: z
		.object({
			order_id: z.number().int(),
			order_product_id: z.number().int(),
			storage: z.string().max(9).optional(),
			storage_id: z.string().max(50).optional(),
			product_id: z.string().max(50).optional(),
			variant_id: z.string().max(30).optional(),
			auction_id: z.string().max(20).optional(),
			name: z.string().max(200).optional(),
			sku: z.string().max(50).optional(),
			ean: z.string().max(32).optional(),
			location: z.string().max(50).optional(),
			warehouse_id: z.number().int().optional(),
			attributes: z.string().max(350).optional(),
			price_brutto: z.number().optional(),
			tax_rate: z.number().optional(),
			quantity: z.number().int().optional(),
			weight: z.number().optional(),
		})
		.loose(),
	setOrderReceipt: z
		.object({
			receipt_id: z.number().int(),
			receipt_nr: z.string().max(20),
			date: z.number().int(),
			printer_error: z.boolean(),
			printer_name: z.string().max(50).optional(),
		})
		.loose(),
	setOrderReturnFields: z
		.object({
			return_id: z.number().int().optional(),
			admin_comments: z.string().max(200).optional(),
			email: z.string().max(150).optional(),
			phone: z.string().max(100).optional(),
			user_login: z.string().max(30).optional(),
			delivery_price: z.number().optional(),
			delivery_fullname: z.string().max(100).optional(),
			delivery_company: z.string().max(100).optional(),
			delivery_address: z.string().max(100).optional(),
			delivery_postcode: z.string().max(100).optional(),
			delivery_city: z.string().max(100).optional(),
			delivery_state: z.string().max(100).optional(),
			delivery_country_code: z.string().length(2).optional(),
			extra_field_1: z.string().max(50).optional(),
			extra_field_2: z.string().max(50).optional(),
			custom_extra_fields: BaseLinkerInputCollectionSchema.optional(),
		})
		.loose(),
	setOrderReturnProductFields: z
		.object({
			return_id: z.number().int(),
			order_return_product_id: z.number().int(),
			storage: z.string().max(9).optional(),
			storage_id: z.string().max(50).optional(),
			product_id: z.string().max(50).optional(),
			variant_id: z.string().max(30).optional(),
			auction_id: z.string().max(20).optional(),
			name: z.string().max(200).optional(),
			sku: z.string().max(50).optional(),
			ean: z.string().max(32).optional(),
			location: z.string().max(50).optional(),
			warehouse_id: z.number().int().optional(),
			attributes: z.string().max(350).optional(),
			price_brutto: z.number().optional(),
			tax_rate: z.number().optional(),
			quantity: z.number().int().optional(),
			weight: z.number().optional(),
			status_id: z.number().int().optional(),
			return_reason_id: z.number().int().optional(),
		})
		.loose(),
	setOrderReturnRefund: z
		.object({
			return_id: z.number().int(),
			order_refund_done: z.number(),
			refund_date: z.number().int(),
			refund_comment: z.string().max(50),
			external_refund_id: z.string().max(50).optional(),
		})
		.loose(),
	setOrderReturnStatus: z
		.object({
			return_id: z.number().int(),
			status_id: z.number().int(),
		})
		.loose(),
	setOrderReturnStatuses: z
		.object({
			return_ids: BaseLinkerInputCollectionSchema,
			status_id: z.number().int(),
		})
		.loose(),
	setOrderStatus: z
		.object({
			order_id: z.number().int(),
			status_id: z.number().int(),
		})
		.loose(),
	setOrderStatuses: z
		.object({
			order_ids: BaseLinkerInputCollectionSchema,
			status_id: z.number().int(),
		})
		.loose(),
	setOrdersMerge: z
		.object({
			main_order_id: z.number().int(),
			order_ids_to_merge: BaseLinkerInputCollectionSchema,
			merge_mode: z.string(),
			sum_delivery_costs: z.boolean(),
		})
		.loose(),
	updateInventoryProductsStock: z
		.object({
			inventory_id: z.number().int(),
			products: BaseLinkerInputCollectionSchema,
		})
		.loose(),
} as const;

export const BaseLinkerEndpointOutputSchemas = {
	addInventory: z
		.object({
			status: z.literal('SUCCESS'),
			inventory_id: z.number().int().optional(),
		})
		.loose(),
	addInventoryCategory: z
		.object({
			status: z.literal('SUCCESS'),
			category_id: z.number().int().optional(),
		})
		.loose(),
	addInventoryDocument: z
		.object({
			status: z.literal('SUCCESS'),
			document_id: z.number().int().optional(),
			document_number: z.string().max(30).optional(),
		})
		.loose(),
	addInventoryManufacturer: z
		.object({
			status: z.literal('SUCCESS'),
			manufacturer_id: z.number().int().optional(),
		})
		.loose(),
	addInventoryPayer: z
		.object({
			status: z.literal('SUCCESS'),
			payer_id: z.number().int().optional(),
		})
		.loose(),
	addInventoryPriceGroup: z
		.object({
			status: z.literal('SUCCESS'),
			price_group_id: z.number().int().optional(),
		})
		.loose(),
	addInventoryProduct: z
		.object({
			status: z.literal('SUCCESS'),
			product_id: z.number().int().optional(),
			warnings: BaseLinkerOutputCollectionSchema.optional(),
		})
		.loose(),
	addInventoryPurchaseOrder: z
		.object({
			status: z.literal('SUCCESS'),
			order_id: z.number().int().optional(),
			document_number: z.string().max(50).optional(),
		})
		.loose(),
	addInventoryPurchaseOrderItems: z
		.object({
			status: z.literal('SUCCESS'),
			items: BaseLinkerOutputCollectionSchema.optional(),
		})
		.loose(),
	addInventorySupplier: z
		.object({
			status: z.literal('SUCCESS'),
			supplier_id: z.number().int().optional(),
		})
		.loose(),
	addInventoryWarehouse: z
		.object({
			status: z.literal('SUCCESS'),
			warehouse_id: z.number().int().optional(),
		})
		.loose(),
	addInvoice: z
		.object({
			status: z.literal('SUCCESS'),
			invoice_id: z.number().int().optional(),
		})
		.loose(),
	addInvoiceCorrection: z
		.object({
			status: z.literal('SUCCESS'),
			invoice_id: z.number().int().optional(),
		})
		.loose(),
	addOrder: z
		.object({
			status: z.literal('SUCCESS'),
			order_id: z.number().int().optional(),
		})
		.loose(),
	addOrderBySplit: z
		.object({
			status: z.literal('SUCCESS'),
			new_order_id: z.number().int().optional(),
		})
		.loose(),
	addOrderDuplicate: z
		.object({
			status: z.literal('SUCCESS'),
			order_id: z.number().int().optional(),
		})
		.loose(),
	addOrderReturn: z
		.object({
			status: z.literal('SUCCESS'),
			return_id: z.number().int().optional(),
		})
		.loose(),
	addOrderReturnProduct: z
		.object({
			status: z.literal('SUCCESS'),
			order_return_product_id: z.number().int().optional(),
		})
		.loose(),
	addCategory: z
		.object({
			status: z.literal('SUCCESS'),
			storage_id: z.string().max(30).optional(),
			category_id: z.number().int().optional(),
		})
		.loose(),
	createPackageManual: z
		.object({
			status: z.literal('SUCCESS'),
			package_id: z.number().int().optional(),
			package_number: z.string().max(40).optional(),
		})
		.loose(),
	deleteInventory: z
		.object({
			status: z.literal('SUCCESS'),
		})
		.loose(),
	deleteInventoryCategory: z
		.object({
			status: z.literal('SUCCESS'),
		})
		.loose(),
	deleteInventoryManufacturer: z
		.object({
			status: z.literal('SUCCESS'),
		})
		.loose(),
	deleteInventoryPayer: z
		.object({
			status: z.literal('SUCCESS'),
		})
		.loose(),
	deleteInventoryPriceGroup: z
		.object({
			status: z.literal('SUCCESS'),
		})
		.loose(),
	deleteInventoryProduct: z
		.object({
			status: z.literal('SUCCESS'),
		})
		.loose(),
	deleteInventoryWarehouse: z
		.object({
			status: z.literal('SUCCESS'),
		})
		.loose(),
	deleteOrderProduct: z
		.object({
			status: z.literal('SUCCESS'),
		})
		.loose(),
	deleteOrderReturnProduct: z
		.object({
			status: z.literal('SUCCESS'),
		})
		.loose(),
	deleteOrders: z
		.object({
			status: z.literal('SUCCESS'),
			deleted_order_ids: BaseLinkerOutputCollectionSchema.optional(),
		})
		.loose(),
	getConnectIntegrationContractors: z
		.object({
			status: z.literal('SUCCESS'),
			contractors: BaseLinkerOutputCollectionSchema.optional(),
		})
		.loose(),
	getConnectIntegrations: z
		.object({
			status: z.literal('SUCCESS'),
			integrations: BaseLinkerOutputCollectionSchema.optional(),
		})
		.loose(),
	getCourierAccounts: z
		.object({
			status: z.literal('SUCCESS'),
			accounts: BaseLinkerOutputCollectionSchema.optional(),
		})
		.loose(),
	getCourierFields: z
		.object({
			status: z.literal('SUCCESS'),
			multi_packages: z.boolean().optional(),
			fields: BaseLinkerOutputCollectionSchema.optional(),
			package_fields: BaseLinkerOutputCollectionSchema.optional(),
		})
		.loose(),
	getCourierPackagesStatusHistory: z
		.object({
			status: z.literal('SUCCESS'),
			packages_history: BaseLinkerOutputCollectionSchema.optional(),
		})
		.loose(),
	getCouriersList: z
		.object({
			status: z.literal('SUCCESS'),
			couriers: BaseLinkerOutputCollectionSchema.optional(),
		})
		.loose(),
	getExternalStorageProductsQuantity: z
		.object({
			status: z.literal('SUCCESS'),
			storage_id: z.string().max(30).optional(),
			products: BaseLinkerOutputCollectionSchema.optional(),
		})
		.loose(),
	getExternalStoragesList: z
		.object({
			status: z.literal('SUCCESS'),
			storages: BaseLinkerOutputCollectionSchema.optional(),
		})
		.loose(),
	getInventories: z
		.object({
			status: z.literal('SUCCESS'),
			inventories: BaseLinkerOutputCollectionSchema.optional(),
		})
		.loose(),
	getInventoryAvailableTextFieldKeys: z
		.object({
			status: z.literal('SUCCESS'),
			text_field_keys: BaseLinkerOutputCollectionSchema.optional(),
		})
		.loose(),
	getInventoryCategories: z
		.object({
			status: z.literal('SUCCESS'),
			categories: BaseLinkerOutputCollectionSchema.optional(),
		})
		.loose(),
	getInventoryDocumentItems: z
		.object({
			status: z.literal('SUCCESS'),
			items: BaseLinkerOutputCollectionSchema.optional(),
		})
		.loose(),
	getInventoryDocumentSeries: z
		.object({
			status: z.literal('SUCCESS'),
			document_series: BaseLinkerOutputCollectionSchema.optional(),
		})
		.loose(),
	getInventoryDocuments: z
		.object({
			status: z.literal('SUCCESS'),
			documents: BaseLinkerOutputCollectionSchema.optional(),
		})
		.loose(),
	getInventoryExtraFields: z
		.object({
			status: z.literal('SUCCESS'),
			extra_fields: BaseLinkerOutputCollectionSchema.optional(),
		})
		.loose(),
	getInventoryIntegrations: z
		.object({
			status: z.literal('SUCCESS'),
			integrations: BaseLinkerOutputCollectionSchema.optional(),
		})
		.loose(),
	getInventoryManufacturers: z
		.object({
			status: z.literal('SUCCESS'),
			manufacturers: BaseLinkerOutputCollectionSchema.optional(),
		})
		.loose(),
	getInventoryPayers: z
		.object({
			status: z.literal('SUCCESS'),
			payers: BaseLinkerOutputCollectionSchema.optional(),
		})
		.loose(),
	getInventoryPriceGroups: z
		.object({
			status: z.literal('SUCCESS'),
			price_groups: BaseLinkerOutputCollectionSchema.optional(),
		})
		.loose(),
	getInventoryPrintoutTemplates: z
		.object({
			status: z.literal('SUCCESS'),
			printouts: BaseLinkerOutputCollectionSchema.optional(),
		})
		.loose(),
	getInventoryProductLogs: z
		.object({
			status: z.literal('SUCCESS'),
			logs: BaseLinkerOutputCollectionSchema.optional(),
		})
		.loose(),
	getInventoryProductsData: z
		.object({
			status: z.literal('SUCCESS'),
			products: BaseLinkerOutputCollectionSchema.optional(),
		})
		.loose(),
	getInventoryProductsList: z
		.object({
			status: z.literal('SUCCESS'),
			products: BaseLinkerOutputCollectionSchema.optional(),
		})
		.loose(),
	getInventoryProductsPrices: z
		.object({
			status: z.literal('SUCCESS'),
			products: BaseLinkerOutputCollectionSchema.optional(),
		})
		.loose(),
	getInventoryProductsStock: z
		.object({
			status: z.literal('SUCCESS'),
			products: BaseLinkerOutputCollectionSchema.optional(),
		})
		.loose(),
	getInventoryPurchaseOrderItems: z
		.object({
			status: z.literal('SUCCESS'),
			items: BaseLinkerOutputCollectionSchema.optional(),
		})
		.loose(),
	getInventoryPurchaseOrderSeries: z
		.object({
			status: z.literal('SUCCESS'),
			series: BaseLinkerOutputCollectionSchema.optional(),
		})
		.loose(),
	getInventoryPurchaseOrders: z
		.object({
			status: z.literal('SUCCESS'),
			purchase_orders: BaseLinkerOutputCollectionSchema.optional(),
		})
		.loose(),
	getInventorySuppliers: z
		.object({
			status: z.literal('SUCCESS'),
			suppliers: BaseLinkerOutputCollectionSchema.optional(),
		})
		.loose(),
	getInventoryTags: z
		.object({
			status: z.literal('SUCCESS'),
			tags: BaseLinkerOutputCollectionSchema.optional(),
		})
		.loose(),
	getInventoryWarehouses: z
		.object({
			status: z.literal('SUCCESS'),
			warehouses: BaseLinkerOutputCollectionSchema.optional(),
		})
		.loose(),
	getInvoiceFile: z
		.object({
			status: z.literal('SUCCESS'),
			invoice: z.string().optional(),
			invoice_number: z.string().max(30).optional(),
		})
		.loose(),
	getInvoices: z
		.object({
			status: z.literal('SUCCESS'),
			invoices: BaseLinkerOutputCollectionSchema.optional(),
		})
		.loose(),
	getJournalList: z
		.object({
			status: z.literal('SUCCESS'),
			logs: BaseLinkerOutputCollectionSchema.optional(),
		})
		.loose(),
	getNewReceipts: z
		.object({
			status: z.literal('SUCCESS'),
			orders: BaseLinkerOutputCollectionSchema.optional(),
			receipt_id: z.number().int().optional(),
			series_id: z.number().int().optional(),
			receipt_full_nr: z.string().max(30).optional(),
			order_id: z.number().int().optional(),
			date_add: z.number().int().optional(),
			payment_method: z.string().max(30).optional(),
			nip: z.string().max(30).optional(),
			products: BaseLinkerOutputCollectionSchema.optional(),
		})
		.loose(),
	getOrderExtraFields: z
		.object({
			status: z.literal('SUCCESS'),
			extra_fields: BaseLinkerOutputCollectionSchema.optional(),
		})
		.loose(),
	getOrderPackages: z
		.object({
			status: z.literal('SUCCESS'),
			packages: BaseLinkerOutputCollectionSchema.optional(),
		})
		.loose(),
	getOrderPaymentsHistory: z
		.object({
			status: z.literal('SUCCESS'),
			payments: BaseLinkerOutputCollectionSchema.optional(),
		})
		.loose(),
	getOrderPickPackHistory: z
		.object({
			status: z.literal('SUCCESS'),
			history: BaseLinkerOutputCollectionSchema.optional(),
		})
		.loose(),
	getOrderPrintoutTemplates: z
		.object({
			status: z.literal('SUCCESS'),
			printouts: BaseLinkerOutputCollectionSchema.optional(),
		})
		.loose(),
	getOrderReturnExtraFields: z
		.object({
			status: z.literal('SUCCESS'),
			extra_fields: BaseLinkerOutputCollectionSchema.optional(),
		})
		.loose(),
	getOrderReturnJournalList: z
		.object({
			status: z.literal('SUCCESS'),
			logs: BaseLinkerOutputCollectionSchema.optional(),
		})
		.loose(),
	getOrderReturnPaymentsHistory: z
		.object({
			status: z.literal('SUCCESS'),
			payments: BaseLinkerOutputCollectionSchema.optional(),
		})
		.loose(),
	getOrderReturnProductStatuses: z
		.object({
			status: z.literal('SUCCESS'),
			order_return_product_statuses:
				BaseLinkerOutputCollectionSchema.optional(),
		})
		.loose(),
	getOrderReturnReasonsList: z
		.object({
			status: z.literal('SUCCESS'),
			return_reasons: BaseLinkerOutputCollectionSchema.optional(),
		})
		.loose(),
	getOrderReturnStatusList: z
		.object({
			status: z.literal('SUCCESS'),
			statuses: BaseLinkerOutputCollectionSchema.optional(),
		})
		.loose(),
	getOrderReturns: z
		.object({
			status: z.literal('SUCCESS'),
			returns: BaseLinkerOutputCollectionSchema.optional(),
		})
		.loose(),
	getOrderSources: z
		.object({
			status: z.literal('SUCCESS'),
			sources: BaseLinkerOutputCollectionSchema.optional(),
		})
		.loose(),
	getOrderStatusList: z
		.object({
			status: z.literal('SUCCESS'),
			statuses: BaseLinkerOutputCollectionSchema.optional(),
		})
		.loose(),
	getOrderTransactionData: z
		.object({
			status: z.literal('SUCCESS'),
			currency: z.string().length(3).optional(),
			fulfillment_shipments: BaseLinkerOutputCollectionSchema.optional(),
			fulfillment_center_id: z.string().max(10).optional(),
			ship_date_from: z.number().int().optional(),
			ship_date_to: z.number().int().optional(),
			delivery_date_from: z.number().int().optional(),
			delivery_date_to: z.number().int().optional(),
			marketplace_transaction_id: z.string().max(60).optional(),
			account_id: z.number().int().optional(),
			transaction_date: z.number().int().optional(),
			order_items: BaseLinkerOutputCollectionSchema.optional(),
		})
		.loose(),
	getOrders: z
		.object({
			status: z.literal('SUCCESS'),
			orders: BaseLinkerOutputCollectionSchema.optional(),
		})
		.loose(),
	getOrdersByPhone: z
		.object({
			status: z.literal('SUCCESS'),
			orders: BaseLinkerOutputCollectionSchema.optional(),
		})
		.loose(),
	getPackageDetails: z
		.object({
			status: z.literal('SUCCESS'),
			package_details: BaseLinkerOutputCollectionSchema.optional(),
		})
		.loose(),
	getPickPackCarts: z
		.object({
			status: z.literal('SUCCESS'),
			carts: BaseLinkerOutputCollectionSchema.optional(),
		})
		.loose(),
	getProtocol: z
		.object({
			status: z.literal('SUCCESS'),
			extension: z.string().max(4).optional(),
			protocol: z.string().optional(),
		})
		.loose(),
	getReceipts: z
		.object({
			status: z.literal('SUCCESS'),
			receipts: BaseLinkerOutputCollectionSchema.optional(),
		})
		.loose(),
	getRequestParcelPickupFields: z
		.object({
			status: z.literal('SUCCESS'),
			fields: BaseLinkerOutputCollectionSchema.optional(),
		})
		.loose(),
	getSeries: z
		.object({
			status: z.literal('SUCCESS'),
			series: BaseLinkerOutputCollectionSchema.optional(),
		})
		.loose(),
	getStoragesList: z
		.object({
			status: z.literal('SUCCESS'),
			storages: BaseLinkerOutputCollectionSchema.optional(),
		})
		.loose(),
	runOrderMacroTrigger: z
		.object({
			status: z.literal('SUCCESS'),
		})
		.loose(),
	runProductMacroTrigger: z
		.object({
			status: z.literal('SUCCESS'),
		})
		.loose(),
	runRequestParcelPickup: z
		.object({
			status: z.literal('SUCCESS'),
			pickup_number: z.string().max(50).optional(),
		})
		.loose(),
	setInventoryPurchaseOrderStatus: z
		.object({
			status: z.literal('SUCCESS'),
		})
		.loose(),
	setOrderFields: z
		.object({
			status: z.literal('SUCCESS'),
		})
		.loose(),
	setOrderPayment: z
		.object({
			status: z.literal('SUCCESS'),
		})
		.loose(),
	setOrderProductFields: z
		.object({
			status: z.literal('SUCCESS'),
		})
		.loose(),
	setOrderReceipt: z
		.object({
			status: z.literal('SUCCESS'),
		})
		.loose(),
	setOrderReturnFields: z
		.object({
			status: z.literal('SUCCESS'),
		})
		.loose(),
	setOrderReturnProductFields: z
		.object({
			status: z.literal('SUCCESS'),
		})
		.loose(),
	setOrderReturnRefund: z
		.object({
			status: z.literal('SUCCESS'),
		})
		.loose(),
	setOrderReturnStatus: z
		.object({
			status: z.literal('SUCCESS'),
		})
		.loose(),
	setOrderReturnStatuses: z
		.object({
			status: z.literal('SUCCESS'),
		})
		.loose(),
	setOrderStatus: z
		.object({
			status: z.literal('SUCCESS'),
		})
		.loose(),
	setOrderStatuses: z
		.object({
			status: z.literal('SUCCESS'),
		})
		.loose(),
	setOrdersMerge: z
		.object({
			status: z.literal('SUCCESS'),
			merged_order_id: z.number().int().optional(),
		})
		.loose(),
	updateInventoryProductsStock: z
		.object({
			status: z.literal('SUCCESS'),
			counter: z.number().int().optional(),
			warnings: BaseLinkerOutputCollectionSchema.optional(),
		})
		.loose(),
} as const;

export type BaseLinkerEndpointInputs = {
	[K in keyof typeof BaseLinkerEndpointInputSchemas]: z.infer<
		(typeof BaseLinkerEndpointInputSchemas)[K]
	>;
};

export type BaseLinkerEndpointOutputs = {
	[K in keyof typeof BaseLinkerEndpointOutputSchemas]: z.infer<
		(typeof BaseLinkerEndpointOutputSchemas)[K]
	>;
};
