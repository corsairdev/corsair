import { z } from 'zod';

// OpenAPI leaves some success response payloads untyped or explicitly open; validate those as JSON.
const ElorusUndocumentedJsonSchema = z.json();
const ElorusBinaryResponseSchema = z
	.object({
		kind: z.literal('binary'),
		contentType: z.string(),
		base64: z.string(),
		sizeBytes: z.number().int().nonnegative(),
	})
	.strict();

// Elorus documents dynamic tracking filters such as tc_12345, not a literal tc_<trackingcategory_id> key.
function withTrackingCategoryFilters<S extends z.ZodObject>(schema: S) {
	const documentedQueryFields = new Set(Object.keys(schema.shape));
	// Unknown catchall values keep the inferred index signature from widening typed fields like numeric pagination.
	return schema.catchall(z.unknown()).superRefine((query, context) => {
		for (const key of Object.keys(query)) {
			if (documentedQueryFields.has(key)) {
				continue;
			}
			if (/^tc_[0-9]+$/.test(key) && typeof query[key] === 'string') {
				continue;
			}
			context.addIssue({
				code: 'custom',
				path: [key],
				message: 'Use a documented query field or tc_<numeric category ID>.',
			});
		}
	});
}

const v11Def_PUV11PurchaseList = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		representation: z.string().min(1).optional(),
		status: z.string().optional(),
		draft: z.boolean().optional(),
		documenttype: z.string().nullable().optional(),
		self_billed: z.boolean().optional(),
		sequence: z.string().optional(),
		reference: z.string().max(150).optional(),
		date: z.string().optional(),
		due_date: z.string().nullable().optional(),
		branch: z.string().nullable().optional(),
		supplier: z.string().optional(),
		currency_code: z.string().optional(),
		exchange_rate: z.string().optional(),
		calculator_mode: z.string().optional(),
		initial: z.string().optional(),
		net: z.string().optional(),
		total: z.string().optional(),
		payable: z.string().optional(),
		paid: z.string().optional(),
		permalink: z.string().nullable().optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v11Def_BillingAddress = z
	.object({
		address_line: z.string().max(200),
		city: z.string().max(100),
		state: z.string().max(100).optional(),
		zip: z.string().max(20),
		country: z.string(),
	})
	.strict();
const v11Def_ShippingAddress = z
	.object({
		address_line: z.string().max(200),
		city: z.string().max(100),
		state: z.string().max(100).optional(),
		zip: z.string().max(20),
		country: z.string(),
		branch_code: z.number().int().max(2147483647).nullable().optional(),
	})
	.strict();
const v11Def_LoadingAddress = z
	.object({
		address_line: z.string().max(200),
		city: z.string().max(100),
		state: z.string().max(100).optional(),
		zip: z.string().max(20),
		country: z.string(),
		branch_code: z.number().int().max(2147483647).nullable().optional(),
	})
	.strict();
const v11Def_PurchaseRelatedEntities = z
	.object({
		id: z.string().min(1).optional(),
		contact: z.string(),
		contact_display_name: z.string().min(1).max(203),
		contact_vat_number: z.string().max(20).optional(),
		type: z.number().int(),
		billing_address: v11Def_BillingAddress.optional(),
	})
	.strict();
const v11Def_PurchasePackageNested = z
	.object({
		id: z.string().min(1).optional(),
		packaging_type: z.number().int(),
		quantity: z.number().int().min(1).max(32767),
		other_packaging_type_title: z.string().max(150).optional(),
	})
	.strict();
const v11Def_V11PurchaseItemNestedCreate = z
	.object({
		id: z.string().min(1).optional(),
		product: z.string().nullable().optional(),
		description: z.string().optional(),
		quantity: z.string().optional(),
		unit_measure: z.number().int().nullable().optional(),
		unit_value: z.string().optional(),
		unit_value_gross: z.string().optional(),
		unit_discount: z.string().optional(),
		unit_discount_gross: z.string().optional(),
		unit_discount_percentage: z.string().optional(),
		unit_discount_mode: z.string().optional(),
		taxes: z.array(z.string()).optional(),
		unit_total: z.string().optional(),
		item_net: z.string().optional(),
		project: z.string().nullable().optional(),
		billable: z.boolean().optional(),
		expense_category: z.string(),
		taric_code: z.string().min(10).max(10).optional(),
		warehouse: z.string().nullable().optional(),
		skip_stock_update: z.boolean().optional(),
	})
	.strict();
const v11Def_RecordTrackingCategoryNested = z
	.object({
		trackingcategory: z.string(),
		option: z.string().min(1).max(225),
	})
	.strict();
const v11Def_V11PurchaseCreate = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		representation: z.string().min(1).optional(),
		status: z.string().optional(),
		draft: z.boolean().optional(),
		documenttype: z.string().nullable().optional(),
		self_billed: z.boolean().optional(),
		sequence: z.string().nullable().optional(),
		reference: z.string().max(150).optional(),
		date: z.string().optional(),
		due_days: z.number().int().min(0).max(2147483647).nullable().optional(),
		branch: z.string().nullable().optional(),
		supplier: z.string(),
		supplier_display_name: z.string().max(203).optional(),
		supplier_profession: z.string().max(100).optional(),
		supplier_vat_number: z.string().max(20).optional(),
		billing_address: v11Def_BillingAddress.optional(),
		shipping_address: v11Def_ShippingAddress.optional(),
		supplier_contact_person: z.string().max(101).optional(),
		supplier_phone_number: z.string().max(30).optional(),
		supplier_email: z.string().max(100).optional(),
		loading_address: v11Def_LoadingAddress.optional(),
		dispatch_date: z.string().nullable().optional(),
		dispatch_time: z.string().nullable().optional(),
		vehicle_number: z.string().max(150).optional(),
		move_purpose: z.number().int().nullable().optional(),
		related_entities: z
			.array(v11Def_PurchaseRelatedEntities)
			.nullable()
			.optional(),
		packages: z.array(v11Def_PurchasePackageNested).nullable().optional(),
		delivery_notes: z.array(z.string()).optional(),
		currency_code: z.string().optional(),
		exchange_rate: z.string().optional(),
		calculator_mode: z.string().optional(),
		items: z.array(v11Def_V11PurchaseItemNestedCreate),
		initial: z.string().optional(),
		net: z.string().optional(),
		total: z.string().optional(),
		withholding_taxes: z.array(z.string()).optional(),
		payable: z.string().optional(),
		paid: z.string().optional(),
		template: z.string().nullable().optional(),
		public_notes: z.string().optional(),
		trackingcategories: z.array(v11Def_RecordTrackingCategoryNested).optional(),
		permalink: z.string().nullable().optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v11Def_PUV11PurchaseCreate = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		representation: z.string().min(1).optional(),
		status: z.string().optional(),
		draft: z.boolean().optional(),
		documenttype: z.string().nullable().optional(),
		self_billed: z.boolean().optional(),
		sequence: z.string().nullable().optional(),
		reference: z.string().max(150).optional(),
		date: z.string().optional(),
		due_days: z.number().int().min(0).max(2147483647).nullable().optional(),
		branch: z.string().nullable().optional(),
		supplier: z.string().optional(),
		supplier_display_name: z.string().max(203).optional(),
		supplier_profession: z.string().max(100).optional(),
		supplier_vat_number: z.string().max(20).optional(),
		billing_address: v11Def_BillingAddress.optional(),
		shipping_address: v11Def_ShippingAddress.optional(),
		supplier_contact_person: z.string().max(101).optional(),
		supplier_phone_number: z.string().max(30).optional(),
		supplier_email: z.string().max(100).optional(),
		loading_address: v11Def_LoadingAddress.optional(),
		dispatch_date: z.string().nullable().optional(),
		dispatch_time: z.string().nullable().optional(),
		vehicle_number: z.string().max(150).optional(),
		move_purpose: z.number().int().nullable().optional(),
		related_entities: z
			.array(v11Def_PurchaseRelatedEntities)
			.nullable()
			.optional(),
		packages: z.array(v11Def_PurchasePackageNested).nullable().optional(),
		delivery_notes: z.array(z.string()).optional(),
		currency_code: z.string().optional(),
		exchange_rate: z.string().optional(),
		calculator_mode: z.string().optional(),
		items: z.array(v11Def_V11PurchaseItemNestedCreate).optional(),
		initial: z.string().optional(),
		net: z.string().optional(),
		total: z.string().optional(),
		withholding_taxes: z.array(z.string()).optional(),
		payable: z.string().optional(),
		paid: z.string().optional(),
		template: z.string().nullable().optional(),
		public_notes: z.string().optional(),
		trackingcategories: z.array(v11Def_RecordTrackingCategoryNested).optional(),
		permalink: z.string().nullable().optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v11Def_V11PurchaseItemNestedRetrieveUpdate = z
	.object({
		id: z.string().min(1).optional(),
		product: z.string().nullable().optional(),
		description: z.string().optional(),
		quantity: z.string().optional(),
		unit_measure: z.number().int().nullable().optional(),
		unit_value: z.string().optional(),
		unit_value_gross: z.string().optional(),
		unit_discount: z.string().optional(),
		unit_discount_gross: z.string().optional(),
		unit_discount_percentage: z.string().optional(),
		unit_discount_mode: z.string().optional(),
		taxes: z.array(z.string()).optional(),
		unit_total: z.string().optional(),
		item_net: z.string().optional(),
		project: z.string().nullable().optional(),
		billable: z.boolean().optional(),
		expense_category: z.string(),
		taric_code: z.string().min(10).max(10).optional(),
		warehouse: z.string().nullable().optional(),
		skip_stock_update: z.boolean().optional(),
	})
	.strict();
const v11Def_PUV11PurchaseRetrieveUpdate = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		representation: z.string().min(1).optional(),
		status: z.string().optional(),
		draft: z.boolean().optional(),
		documenttype: z.string().nullable().optional(),
		self_billed: z.boolean().optional(),
		sequence: z.string().nullable().optional(),
		reference: z.string().max(150).optional(),
		date: z.string().optional(),
		due_days: z.number().int().min(0).max(2147483647).nullable().optional(),
		branch: z.string().nullable().optional(),
		supplier: z.string().optional(),
		supplier_display_name: z.string().max(203).optional(),
		supplier_profession: z.string().max(100).optional(),
		supplier_vat_number: z.string().max(20).optional(),
		billing_address: v11Def_BillingAddress.optional(),
		shipping_address: v11Def_ShippingAddress.optional(),
		supplier_contact_person: z.string().max(101).optional(),
		supplier_phone_number: z.string().max(30).optional(),
		supplier_email: z.string().max(100).optional(),
		loading_address: v11Def_LoadingAddress.optional(),
		dispatch_date: z.string().nullable().optional(),
		dispatch_time: z.string().nullable().optional(),
		vehicle_number: z.string().max(150).optional(),
		move_purpose: z.number().int().nullable().optional(),
		related_entities: z
			.array(v11Def_PurchaseRelatedEntities)
			.nullable()
			.optional(),
		packages: z.array(v11Def_PurchasePackageNested).nullable().optional(),
		delivery_notes: z.array(z.string()).optional(),
		currency_code: z.string().optional(),
		exchange_rate: z.string().optional(),
		calculator_mode: z.string().optional(),
		items: z.array(v11Def_V11PurchaseItemNestedRetrieveUpdate).optional(),
		initial: z.string().optional(),
		net: z.string().optional(),
		total: z.string().optional(),
		withholding_taxes: z.array(z.string()).optional(),
		payable: z.string().optional(),
		paid: z.string().optional(),
		template: z.string().nullable().optional(),
		public_notes: z.string().optional(),
		trackingcategories: z.array(v11Def_RecordTrackingCategoryNested).optional(),
		permalink: z.string().nullable().optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v11Def_V11PurchaseRetrieveUpdate = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		representation: z.string().min(1).optional(),
		status: z.string().optional(),
		draft: z.boolean().optional(),
		documenttype: z.string().nullable().optional(),
		self_billed: z.boolean().optional(),
		sequence: z.string().nullable().optional(),
		reference: z.string().max(150).optional(),
		date: z.string().optional(),
		due_days: z.number().int().min(0).max(2147483647).nullable().optional(),
		branch: z.string().nullable().optional(),
		supplier: z.string(),
		supplier_display_name: z.string().max(203).optional(),
		supplier_profession: z.string().max(100).optional(),
		supplier_vat_number: z.string().max(20).optional(),
		billing_address: v11Def_BillingAddress.optional(),
		shipping_address: v11Def_ShippingAddress.optional(),
		supplier_contact_person: z.string().max(101).optional(),
		supplier_phone_number: z.string().max(30).optional(),
		supplier_email: z.string().max(100).optional(),
		loading_address: v11Def_LoadingAddress.optional(),
		dispatch_date: z.string().nullable().optional(),
		dispatch_time: z.string().nullable().optional(),
		vehicle_number: z.string().max(150).optional(),
		move_purpose: z.number().int().nullable().optional(),
		related_entities: z
			.array(v11Def_PurchaseRelatedEntities)
			.nullable()
			.optional(),
		packages: z.array(v11Def_PurchasePackageNested).nullable().optional(),
		delivery_notes: z.array(z.string()).optional(),
		currency_code: z.string().optional(),
		exchange_rate: z.string().optional(),
		calculator_mode: z.string().optional(),
		items: z.array(v11Def_V11PurchaseItemNestedRetrieveUpdate),
		initial: z.string().optional(),
		net: z.string().optional(),
		total: z.string().optional(),
		withholding_taxes: z.array(z.string()).optional(),
		payable: z.string().optional(),
		paid: z.string().optional(),
		template: z.string().nullable().optional(),
		public_notes: z.string().optional(),
		trackingcategories: z.array(v11Def_RecordTrackingCategoryNested).optional(),
		permalink: z.string().nullable().optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v11Def_PUV11PurchasePartialUpdate = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		representation: z.string().min(1).optional(),
		status: z.string().optional(),
		draft: z.boolean().optional(),
		exchange_rate: z.string().optional(),
		trackingcategories: z.array(v11Def_RecordTrackingCategoryNested).optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v11Def_PrivatePurchaseEmailFromTemplate = z
	.object({
		to: z.string().min(1),
		store_to: z.boolean().optional(),
		cc: z.array(z.string().min(1)).optional(),
		bcc: z.array(z.string().min(1)).optional(),
		reply_to: z.string().optional(),
		attach_pdf: z.boolean().optional(),
		attachments: z.array(z.string()).optional(),
	})
	.strict();
const v11Def_TrackedEmailMessage = z
	.object({
		id: z.string().min(1).optional(),
		from_email: z.string().min(1).max(255),
		to: z.string().min(1).max(255),
		cc: z.string().optional(),
		bcc: z.string().optional(),
		reply_to: z.string().min(1).max(255),
		subject: z.string().min(1).max(255),
		message: z.string().optional(),
		attachments: z.string().optional(),
		attach_pdf: z.boolean().optional(),
		status: z.string().optional(),
		status_updated: z.string().nullable().optional(),
		sent_via_smtp: z.boolean().optional(),
		smtp_error: z.string(),
		smtp_error_code: z
			.number()
			.int()
			.min(-32768)
			.max(32767)
			.nullable()
			.optional(),
		metadata: z.record(z.string(), z.string()).optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v11Def_PUEmailRetrieveSerializer = z
	.object({
		to: z.string().min(1).optional(),
		cc: z.string().optional(),
		bcc: z.string().optional(),
		reply_to: z.string().min(1).optional(),
		subject: z.string().min(1).max(255).optional(),
		message: z.string().min(1).optional(),
		sender_name: z.string().min(1).max(70).optional(),
	})
	.strict();
const v11Def_PrivatePurchaseEmail = z
	.object({
		to: z.string().min(1),
		store_to: z.boolean().optional(),
		cc: z.array(z.string().min(1)),
		bcc: z.array(z.string().min(1)),
		reply_to: z.string().optional(),
		subject: z.string().min(1).max(255),
		message: z.string().min(1),
		attach_pdf: z.boolean(),
		sender_name: z.string().min(1).max(70).optional(),
		attachments: z.array(z.string()).optional(),
	})
	.strict();
const v11Def_VoidDocument = z
	.object({
		void: z.boolean().optional(),
	})
	.strict();
const v11Def_PUPurchaseMarkVoidResponse = z
	.object({
		status: z.string().optional(),
	})
	.strict();
const v11Def_PurchaseCashPaymentNested = z
	.object({
		purchase: z.string(),
		amount: z.string(),
	})
	.strict();
const v11Def_CreditNoteCashPaymentNested = z
	.object({
		creditnote: z.string(),
		amount: z.string(),
	})
	.strict();
const v11Def_PUV11CashPaymentList = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		transaction_type: z.string().optional(),
		title: z.string().max(255).optional(),
		amount: z.string().optional(),
		exchange_rate: z.string().optional(),
		currency_code: z.string().optional(),
		date: z.string().optional(),
		branch: z.string().nullable().optional(),
		contact: z.string().optional(),
		purchase_payments: z.array(v11Def_PurchaseCashPaymentNested).optional(),
		creditnote_payments: z.array(v11Def_CreditNoteCashPaymentNested).optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v11Def_V11CashPaymentCreate = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		transaction_type: z.string(),
		title: z.string().max(255).optional(),
		amount: z.string(),
		exchange_rate: z.string().optional(),
		currency_code: z.string().optional(),
		date: z.string().optional(),
		branch: z.string().nullable().optional(),
		contact: z.string(),
		purchase_payments: z.array(v11Def_PurchaseCashPaymentNested).optional(),
		creditnote_payments: z.array(v11Def_CreditNoteCashPaymentNested).optional(),
		trackingcategories: z.array(v11Def_RecordTrackingCategoryNested).optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v11Def_PUV11CashPaymentCreate = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		transaction_type: z.string().optional(),
		title: z.string().max(255).optional(),
		amount: z.string().optional(),
		exchange_rate: z.string().optional(),
		currency_code: z.string().optional(),
		date: z.string().optional(),
		branch: z.string().nullable().optional(),
		contact: z.string().optional(),
		purchase_payments: z.array(v11Def_PurchaseCashPaymentNested).optional(),
		creditnote_payments: z.array(v11Def_CreditNoteCashPaymentNested).optional(),
		trackingcategories: z.array(v11Def_RecordTrackingCategoryNested).optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v11Def_PUV11CashPaymentRetrieve = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		transaction_type: z.string().optional(),
		title: z.string().max(255).optional(),
		amount: z.string().optional(),
		exchange_rate: z.string().optional(),
		currency_code: z.string().optional(),
		date: z.string().optional(),
		branch: z.string().nullable().optional(),
		contact: z.string().optional(),
		purchase_payments: z.array(v11Def_PurchaseCashPaymentNested).optional(),
		creditnote_payments: z.array(v11Def_CreditNoteCashPaymentNested).optional(),
		trackingcategories: z.array(v11Def_RecordTrackingCategoryNested).optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v11Def_V11CashPaymentUpdate = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		transaction_type: z.string().optional(),
		title: z.string().max(255).optional(),
		amount: z.string().optional(),
		exchange_rate: z.string().optional(),
		currency_code: z.string().optional(),
		date: z.string().optional(),
		branch: z.string().nullable().optional(),
		contact: z.string().optional(),
		purchase_payments: z.array(v11Def_PurchaseCashPaymentNested).optional(),
		creditnote_payments: z.array(v11Def_CreditNoteCashPaymentNested).optional(),
		trackingcategories: z.array(v11Def_RecordTrackingCategoryNested).optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v11Def_PUV11CashPaymentUpdate = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		transaction_type: z.string().optional(),
		title: z.string().max(255).optional(),
		amount: z.string().optional(),
		exchange_rate: z.string().optional(),
		currency_code: z.string().optional(),
		date: z.string().optional(),
		branch: z.string().nullable().optional(),
		contact: z.string().optional(),
		purchase_payments: z.array(v11Def_PurchaseCashPaymentNested).optional(),
		creditnote_payments: z.array(v11Def_CreditNoteCashPaymentNested).optional(),
		trackingcategories: z.array(v11Def_RecordTrackingCategoryNested).optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v11Def_InvoiceCashReceiptNested = z
	.object({
		invoice: z.string(),
		amount: z.string(),
	})
	.strict();
const v11Def_PurchaseCreditNoteCashReceiptNested = z
	.object({
		purchasecreditnote: z.string(),
		amount: z.string(),
	})
	.strict();
const v11Def_PUV11CashReceiptList = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		transaction_type: z.string().optional(),
		income_type: z.string().optional(),
		title: z.string().max(255).optional(),
		date: z.string().optional(),
		branch: z.string().nullable().optional(),
		contact: z.string().optional(),
		currency_code: z.string().optional(),
		exchange_rate: z.string().optional(),
		amount: z.string().optional(),
		invoice_payments: z.array(v11Def_InvoiceCashReceiptNested).optional(),
		purchasecreditnote_payments: z
			.array(v11Def_PurchaseCreditNoteCashReceiptNested)
			.optional(),
		status: z.string().optional(),
		payment_gateway: z.string().nullable().optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v11Def_V11CashReceiptCreate = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		transaction_type: z.string(),
		income_type: z.string().optional(),
		title: z.string().max(255).optional(),
		date: z.string().optional(),
		branch: z.string().nullable().optional(),
		contact: z.string(),
		currency_code: z.string().optional(),
		exchange_rate: z.string().optional(),
		calculator_mode: z.string().optional(),
		net: z.string().optional(),
		taxes: z.array(z.string()).optional(),
		amount: z.string(),
		status: z.string().optional(),
		invoice_payments: z.array(v11Def_InvoiceCashReceiptNested).optional(),
		purchasecreditnote_payments: z
			.array(v11Def_PurchaseCreditNoteCashReceiptNested)
			.optional(),
		trackingcategories: z.array(v11Def_RecordTrackingCategoryNested).optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v11Def_PUV11CashReceiptCreate = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		transaction_type: z.string().optional(),
		income_type: z.string().optional(),
		title: z.string().max(255).optional(),
		date: z.string().optional(),
		branch: z.string().nullable().optional(),
		contact: z.string().optional(),
		currency_code: z.string().optional(),
		exchange_rate: z.string().optional(),
		calculator_mode: z.string().optional(),
		net: z.string().optional(),
		taxes: z.array(z.string()).optional(),
		amount: z.string().optional(),
		status: z.string().optional(),
		invoice_payments: z.array(v11Def_InvoiceCashReceiptNested).optional(),
		purchasecreditnote_payments: z
			.array(v11Def_PurchaseCreditNoteCashReceiptNested)
			.optional(),
		trackingcategories: z.array(v11Def_RecordTrackingCategoryNested).optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v11Def_V11CashReceiptCashedTaxNested = z
	.object({
		tax: z.string(),
		amount: z.string().optional(),
	})
	.strict();
const v11Def_PUV11CashReceiptRetrieve = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		transaction_type: z.string().optional(),
		income_type: z.string().optional(),
		title: z.string().max(255).optional(),
		date: z.string().optional(),
		branch: z.string().nullable().optional(),
		contact: z.string().optional(),
		currency_code: z.string().optional(),
		exchange_rate: z.string().optional(),
		net: z.string().nullable().optional(),
		taxes: z.array(v11Def_V11CashReceiptCashedTaxNested).optional(),
		amount: z.string().optional(),
		invoice_payments: z.array(v11Def_InvoiceCashReceiptNested).optional(),
		purchasecreditnote_payments: z
			.array(v11Def_PurchaseCreditNoteCashReceiptNested)
			.optional(),
		status: z.string().optional(),
		payment_gateway: z.string().nullable().optional(),
		trackingcategories: z.array(v11Def_RecordTrackingCategoryNested).optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v11Def_V11CashReceiptUpdate = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		transaction_type: z.string().optional(),
		income_type: z.string().optional(),
		title: z.string().max(255).optional(),
		date: z.string().optional(),
		branch: z.string().nullable().optional(),
		contact: z.string(),
		currency_code: z.string().optional(),
		exchange_rate: z.string().optional(),
		calculator_mode: z.string().optional(),
		net: z.string().optional(),
		taxes: z.array(z.string()).optional(),
		amount: z.string().optional(),
		invoice_payments: z.array(v11Def_InvoiceCashReceiptNested).optional(),
		purchasecreditnote_payments: z
			.array(v11Def_PurchaseCreditNoteCashReceiptNested)
			.optional(),
		trackingcategories: z.array(v11Def_RecordTrackingCategoryNested).optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v11Def_PUV11CashReceiptUpdate = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		transaction_type: z.string().optional(),
		income_type: z.string().optional(),
		title: z.string().max(255).optional(),
		date: z.string().optional(),
		branch: z.string().nullable().optional(),
		contact: z.string().optional(),
		currency_code: z.string().optional(),
		exchange_rate: z.string().optional(),
		calculator_mode: z.string().optional(),
		net: z.string().optional(),
		taxes: z.array(z.string()).optional(),
		amount: z.string().optional(),
		invoice_payments: z.array(v11Def_InvoiceCashReceiptNested).optional(),
		purchasecreditnote_payments: z
			.array(v11Def_PurchaseCreditNoteCashReceiptNested)
			.optional(),
		trackingcategories: z.array(v11Def_RecordTrackingCategoryNested).optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v11Def_V11AddressNested = z
	.object({
		id: z.string().min(1).optional(),
		address: z.string().min(1).max(200),
		city: z.string().min(1).max(100),
		state: z.string().max(100).optional(),
		zip: z.string().min(1).max(20),
		country: z.string(),
		ad_type: z.string().optional(),
		branch_code: z
			.number()
			.int()
			.min(-2147483648)
			.max(2147483647)
			.nullable()
			.optional(),
	})
	.strict();
const v11Def_V11EmailNested = z
	.object({
		id: z.string().min(1).optional(),
		email: z.string().min(1).max(100),
		primary: z.boolean(),
	})
	.strict();
const v11Def_V11PhoneNested = z
	.object({
		id: z.string().min(1).optional(),
		number: z.string().min(1).max(30),
		primary: z.boolean(),
	})
	.strict();
const v11Def_PUV11ContactList = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		active: z.boolean().optional(),
		first_name: z.string().max(50).optional(),
		last_name: z.string().max(50).optional(),
		company: z.string().max(100).optional(),
		display_name: z.string().min(1).optional(),
		profession: z.string().max(100).optional(),
		vat_number: z.string().max(20).optional(),
		is_client: z.boolean().optional(),
		is_supplier: z.boolean().optional(),
		default_language: z.string().optional(),
		default_theme: z.string().nullable().optional(),
		default_taxes: z.array(z.string()).optional(),
		default_currency_code: z.string().optional(),
		addresses: z.array(v11Def_V11AddressNested).optional(),
		email: z.array(v11Def_V11EmailNested).optional(),
		phones: z.array(v11Def_V11PhoneNested).optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v11Def_V11ContactRetrieveCreateUpdate = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		active: z.boolean().optional(),
		first_name: z.string().max(50).optional(),
		last_name: z.string().max(50).optional(),
		company: z.string().max(100).optional(),
		display_name: z.string().min(1).optional(),
		profession: z.string().max(100).optional(),
		vat_number: z.string().max(20).optional(),
		is_client: z.boolean().optional(),
		is_supplier: z.boolean().optional(),
		default_language: z.string().optional(),
		default_theme: z.string().nullable().optional(),
		default_taxes: z.array(z.string()).optional(),
		default_currency_code: z.string().optional(),
		addresses: z.array(v11Def_V11AddressNested).optional(),
		email: z.array(v11Def_V11EmailNested).optional(),
		phones: z.array(v11Def_V11PhoneNested).optional(),
		trackingcategories: z.array(v11Def_RecordTrackingCategoryNested).optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v11Def_PUV11ContactRetrieveCreateUpdate = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		active: z.boolean().optional(),
		first_name: z.string().max(50).optional(),
		last_name: z.string().max(50).optional(),
		company: z.string().max(100).optional(),
		display_name: z.string().min(1).optional(),
		profession: z.string().max(100).optional(),
		vat_number: z.string().max(20).optional(),
		is_client: z.boolean().optional(),
		is_supplier: z.boolean().optional(),
		default_language: z.string().optional(),
		default_theme: z.string().nullable().optional(),
		default_taxes: z.array(z.string()).optional(),
		default_currency_code: z.string().optional(),
		addresses: z.array(v11Def_V11AddressNested).optional(),
		email: z.array(v11Def_V11EmailNested).optional(),
		phones: z.array(v11Def_V11PhoneNested).optional(),
		trackingcategories: z.array(v11Def_RecordTrackingCategoryNested).optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v11Def_PUV11CreditNoteList = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		representation: z.string().min(1).optional(),
		status: z.string().optional(),
		draft: z.boolean().optional(),
		documenttype: z.string().optional(),
		sequence: z.string().optional(),
		number: z.string().max(100).optional(),
		date: z.string().optional(),
		branch: z.string().nullable().optional(),
		client: z.string().optional(),
		client_display_name: z.string().min(1).max(203).optional(),
		client_profession: z.string().max(100).optional(),
		client_vat_number: z.string().max(20).optional(),
		billing_address: v11Def_BillingAddress.optional(),
		shipping_address: v11Def_ShippingAddress.optional(),
		client_contact_person: z.string().max(101).optional(),
		client_phone_number: z.string().max(30).optional(),
		client_email: z.string().max(100).optional(),
		loading_address: v11Def_LoadingAddress.optional(),
		dispatch_date: z.string().nullable().optional(),
		dispatch_time: z.string().nullable().optional(),
		vehicle_number: z.string().max(150).optional(),
		move_purpose: z.number().int().nullable().optional(),
		currency_code: z.string().optional(),
		exchange_rate: z.string().optional(),
		calculator_mode: z.string().optional(),
		initial: z.string().optional(),
		net: z.string().optional(),
		total: z.string().optional(),
		payable: z.string().optional(),
		paid: z.string().optional(),
		permalink: z.string().min(1).optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v11Def_CreditNoteRelatedEntities = z
	.object({
		id: z.string().min(1).optional(),
		contact: z.string(),
		contact_display_name: z.string().min(1).max(203),
		contact_vat_number: z.string().max(20).optional(),
		type: z.number().int(),
		billing_address: v11Def_BillingAddress.optional(),
	})
	.strict();
const v11Def_CreditNotePackageNested = z
	.object({
		id: z.string().min(1).optional(),
		packaging_type: z.number().int(),
		quantity: z.number().int().min(1).max(32767),
		other_packaging_type_title: z.string().max(150).optional(),
	})
	.strict();
const v11Def_V11CreditNoteItemNestedCreate = z
	.object({
		id: z.string().min(1).optional(),
		product: z.string().nullable().optional(),
		title: z.string().min(1).max(200).optional(),
		description: z.string().optional(),
		quantity: z.string().optional(),
		unit_measure: z.number().int().nullable().optional(),
		unit_value: z.string().optional(),
		unit_value_gross: z.string().optional(),
		unit_discount: z.string().optional(),
		unit_discount_gross: z.string().optional(),
		unit_discount_percentage: z.string().optional(),
		unit_discount_mode: z.string().optional(),
		taxes: z.array(z.string()).optional(),
		unit_total: z.string().optional(),
		item_net: z.string().optional(),
		project: z.string().nullable().optional(),
		taric_code: z.string().min(10).max(10).optional(),
		warehouse: z.string().nullable().optional(),
		skip_stock_update: z.boolean().optional(),
	})
	.strict();
const v11Def_V11CreditNoteCreate = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		representation: z.string().min(1).optional(),
		status: z.string().optional(),
		draft: z.boolean().optional(),
		documenttype: z.string().optional(),
		sequence: z.string().nullable().optional(),
		number: z.string().max(100).optional(),
		date: z.string(),
		branch: z.string().nullable().optional(),
		client: z.string(),
		client_display_name: z.string().min(1).max(203).optional(),
		client_profession: z.string().max(100).optional(),
		client_vat_number: z.string().max(20).optional(),
		billing_address: v11Def_BillingAddress.optional(),
		shipping_address: v11Def_ShippingAddress.optional(),
		client_contact_person: z.string().max(101).optional(),
		client_phone_number: z.string().max(30).optional(),
		client_email: z.string().max(100).optional(),
		loading_address: v11Def_LoadingAddress.optional(),
		dispatch_date: z.string().nullable().optional(),
		dispatch_time: z.string().nullable().optional(),
		vehicle_number: z.string().max(150).optional(),
		move_purpose: z.number().int().nullable().optional(),
		related_entities: z
			.array(v11Def_CreditNoteRelatedEntities)
			.nullable()
			.optional(),
		packages: z.array(v11Def_CreditNotePackageNested).nullable().optional(),
		currency_code: z.string().optional(),
		exchange_rate: z.string().optional(),
		calculator_mode: z.string().optional(),
		items: z.array(v11Def_V11CreditNoteItemNestedCreate),
		initial: z.string().optional(),
		net: z.string().optional(),
		total: z.string().optional(),
		withholding_taxes: z.array(z.string()).optional(),
		paid: z.string().optional(),
		payable: z.string().optional(),
		template: z.string().optional(),
		terms: z.string().optional(),
		public_notes: z.string().optional(),
		related_documents: z.array(z.string()).optional(),
		trackingcategories: z.array(v11Def_RecordTrackingCategoryNested).optional(),
		permalink: z.string().min(1).optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v11Def_PUV11CreditNoteCreate = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		representation: z.string().min(1).optional(),
		status: z.string().optional(),
		draft: z.boolean().optional(),
		documenttype: z.string().optional(),
		sequence: z.string().nullable().optional(),
		number: z.string().max(100).optional(),
		date: z.string().optional(),
		branch: z.string().nullable().optional(),
		client: z.string().optional(),
		client_display_name: z.string().min(1).max(203).optional(),
		client_profession: z.string().max(100).optional(),
		client_vat_number: z.string().max(20).optional(),
		billing_address: v11Def_BillingAddress.optional(),
		shipping_address: v11Def_ShippingAddress.optional(),
		client_contact_person: z.string().max(101).optional(),
		client_phone_number: z.string().max(30).optional(),
		client_email: z.string().max(100).optional(),
		loading_address: v11Def_LoadingAddress.optional(),
		dispatch_date: z.string().nullable().optional(),
		dispatch_time: z.string().nullable().optional(),
		vehicle_number: z.string().max(150).optional(),
		move_purpose: z.number().int().nullable().optional(),
		related_entities: z
			.array(v11Def_CreditNoteRelatedEntities)
			.nullable()
			.optional(),
		packages: z.array(v11Def_CreditNotePackageNested).nullable().optional(),
		currency_code: z.string().optional(),
		exchange_rate: z.string().optional(),
		calculator_mode: z.string().optional(),
		items: z.array(v11Def_V11CreditNoteItemNestedCreate).optional(),
		initial: z.string().optional(),
		net: z.string().optional(),
		total: z.string().optional(),
		withholding_taxes: z.array(z.string()).optional(),
		paid: z.string().optional(),
		payable: z.string().optional(),
		template: z.string().optional(),
		terms: z.string().optional(),
		public_notes: z.string().optional(),
		related_documents: z.array(z.string()).optional(),
		trackingcategories: z.array(v11Def_RecordTrackingCategoryNested).optional(),
		permalink: z.string().min(1).optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v11Def_V11CreditNoteItemNestedRetrieveUpdate = z
	.object({
		id: z.string().min(1).optional(),
		product: z.string().nullable().optional(),
		title: z.string().min(1).max(200).optional(),
		description: z.string().optional(),
		quantity: z.string().optional(),
		unit_measure: z.number().int().nullable().optional(),
		unit_value: z.string().optional(),
		unit_value_gross: z.string().optional(),
		unit_discount: z.string().optional(),
		unit_discount_gross: z.string().optional(),
		unit_discount_percentage: z.string().optional(),
		unit_discount_mode: z.string().optional(),
		taxes: z.array(z.string()).optional(),
		unit_total: z.string().optional(),
		item_net: z.string().optional(),
		project: z.string().nullable().optional(),
		taric_code: z.string().min(10).max(10).optional(),
		warehouse: z.string().nullable().optional(),
		skip_stock_update: z.boolean().optional(),
	})
	.strict();
const v11Def_PUV11CreditNoteRetrieve = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		representation: z.string().min(1).optional(),
		status: z.string().optional(),
		draft: z.boolean().optional(),
		documenttype: z.string().optional(),
		sequence: z.string().nullable().optional(),
		number: z.string().max(100).optional(),
		date: z.string().optional(),
		branch: z.string().nullable().optional(),
		client: z.string().optional(),
		client_display_name: z.string().min(1).max(203).optional(),
		client_profession: z.string().max(100).optional(),
		client_vat_number: z.string().max(20).optional(),
		billing_address: v11Def_BillingAddress.optional(),
		shipping_address: v11Def_ShippingAddress.optional(),
		client_contact_person: z.string().max(101).optional(),
		client_phone_number: z.string().max(30).optional(),
		client_email: z.string().max(100).optional(),
		loading_address: v11Def_LoadingAddress.optional(),
		dispatch_date: z.string().nullable().optional(),
		dispatch_time: z.string().nullable().optional(),
		vehicle_number: z.string().max(150).optional(),
		move_purpose: z.number().int().nullable().optional(),
		related_entities: z
			.array(v11Def_CreditNoteRelatedEntities)
			.nullable()
			.optional(),
		packages: z.array(v11Def_CreditNotePackageNested).nullable().optional(),
		currency_code: z.string().optional(),
		exchange_rate: z.string().optional(),
		calculator_mode: z.string().optional(),
		items: z.array(v11Def_V11CreditNoteItemNestedRetrieveUpdate).optional(),
		initial: z.string().optional(),
		net: z.string().optional(),
		total: z.string().optional(),
		withholding_taxes: z.array(z.string()).optional(),
		payable: z.string().optional(),
		paid: z.string().optional(),
		template: z.string().optional(),
		terms: z.string().optional(),
		public_notes: z.string().optional(),
		related_documents: z.array(z.string()).optional(),
		trackingcategories: z.array(v11Def_RecordTrackingCategoryNested).optional(),
		permalink: z.string().min(1).optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v11Def_V11CreditNoteUpdate = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		representation: z.string().min(1).optional(),
		status: z.string().optional(),
		draft: z.boolean().optional(),
		documenttype: z.string().optional(),
		sequence: z.string().nullable().optional(),
		number: z.string().max(100).optional(),
		date: z.string().optional(),
		branch: z.string().nullable().optional(),
		client: z.string(),
		client_display_name: z.string().min(1).max(203).optional(),
		client_profession: z.string().max(100).optional(),
		client_vat_number: z.string().max(20).optional(),
		billing_address: v11Def_BillingAddress.optional(),
		shipping_address: v11Def_ShippingAddress.optional(),
		client_contact_person: z.string().max(101).optional(),
		client_phone_number: z.string().max(30).optional(),
		client_email: z.string().max(100).optional(),
		loading_address: v11Def_LoadingAddress.optional(),
		dispatch_date: z.string().nullable().optional(),
		dispatch_time: z.string().nullable().optional(),
		vehicle_number: z.string().max(150).optional(),
		move_purpose: z.number().int().nullable().optional(),
		related_entities: z
			.array(v11Def_CreditNoteRelatedEntities)
			.nullable()
			.optional(),
		packages: z.array(v11Def_CreditNotePackageNested).nullable().optional(),
		currency_code: z.string().optional(),
		exchange_rate: z.string().optional(),
		calculator_mode: z.string().optional(),
		items: z.array(v11Def_V11CreditNoteItemNestedRetrieveUpdate),
		initial: z.string().optional(),
		net: z.string().optional(),
		total: z.string().optional(),
		withholding_taxes: z.array(z.string()).optional(),
		payable: z.string().optional(),
		paid: z.string().optional(),
		template: z.string().optional(),
		terms: z.string().optional(),
		public_notes: z.string().optional(),
		related_documents: z.array(z.string()).optional(),
		trackingcategories: z.array(v11Def_RecordTrackingCategoryNested).optional(),
		permalink: z.string().min(1).optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v11Def_PUV11CreditNoteUpdate = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		representation: z.string().min(1).optional(),
		status: z.string().optional(),
		draft: z.boolean().optional(),
		documenttype: z.string().optional(),
		sequence: z.string().nullable().optional(),
		number: z.string().max(100).optional(),
		date: z.string().optional(),
		branch: z.string().nullable().optional(),
		client: z.string().optional(),
		client_display_name: z.string().min(1).max(203).optional(),
		client_profession: z.string().max(100).optional(),
		client_vat_number: z.string().max(20).optional(),
		billing_address: v11Def_BillingAddress.optional(),
		shipping_address: v11Def_ShippingAddress.optional(),
		client_contact_person: z.string().max(101).optional(),
		client_phone_number: z.string().max(30).optional(),
		client_email: z.string().max(100).optional(),
		loading_address: v11Def_LoadingAddress.optional(),
		dispatch_date: z.string().nullable().optional(),
		dispatch_time: z.string().nullable().optional(),
		vehicle_number: z.string().max(150).optional(),
		move_purpose: z.number().int().nullable().optional(),
		related_entities: z
			.array(v11Def_CreditNoteRelatedEntities)
			.nullable()
			.optional(),
		packages: z.array(v11Def_CreditNotePackageNested).nullable().optional(),
		currency_code: z.string().optional(),
		exchange_rate: z.string().optional(),
		calculator_mode: z.string().optional(),
		items: z.array(v11Def_V11CreditNoteItemNestedRetrieveUpdate).optional(),
		initial: z.string().optional(),
		net: z.string().optional(),
		total: z.string().optional(),
		withholding_taxes: z.array(z.string()).optional(),
		payable: z.string().optional(),
		paid: z.string().optional(),
		template: z.string().optional(),
		terms: z.string().optional(),
		public_notes: z.string().optional(),
		related_documents: z.array(z.string()).optional(),
		trackingcategories: z.array(v11Def_RecordTrackingCategoryNested).optional(),
		permalink: z.string().min(1).optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v11Def_PUV11CreditNotePartialUpdate = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		representation: z.string().min(1).optional(),
		status: z.string().optional(),
		draft: z.boolean().optional(),
		exchange_rate: z.string().optional(),
		trackingcategories: z.array(v11Def_RecordTrackingCategoryNested).optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v11Def_CreditNoteEmailFromTemplate = z
	.object({
		to: z.string().min(1),
		store_to: z.boolean().optional(),
		cc: z.array(z.string().min(1)).optional(),
		bcc: z.array(z.string().min(1)).optional(),
		reply_to: z.string().optional(),
		attach_pdf: z.boolean().optional(),
		attachments: z.array(z.string()).optional(),
	})
	.strict();
const v11Def_CreditNoteEmail = z
	.object({
		to: z.string().min(1),
		store_to: z.boolean().optional(),
		cc: z.array(z.string().min(1)),
		bcc: z.array(z.string().min(1)),
		reply_to: z.string().optional(),
		subject: z.string().min(1).max(255),
		message: z.string().min(1),
		attach_pdf: z.boolean(),
		sender_name: z.string().min(1).max(70).optional(),
		attachments: z.array(z.string()).optional(),
	})
	.strict();
const v11Def_PUCreditNoteMarkVoidResponse = z
	.object({
		status: z.string().optional(),
	})
	.strict();
const v11Def_PUInvoiceCreditTransactionCNSerializer = z
	.object({
		id: z.string().min(1).optional(),
		representation: z.string().optional(),
		invoice: z.string().optional(),
		amount: z.string().optional(),
		currency_code: z.string().optional(),
		date: z.string().optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v11Def_InvoiceCreditTransactionCN = z
	.object({
		id: z.string().min(1).optional(),
		representation: z.string().optional(),
		invoice: z.string(),
		amount: z.string(),
		currency_code: z.string().optional(),
		date: z.string().optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v11Def_PUV11DocumentTypeList = z
	.object({
		id: z.string().min(1).optional(),
		title: z.string().min(1).max(60).optional(),
		active: z.boolean().optional(),
		application: z.number().int().optional(),
		default: z.boolean().optional(),
		always_self_billed: z.boolean().optional(),
		is_delivery_note: z.boolean().optional(),
		is_reverse_delivery_note: z.boolean().optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v11Def_PUV11DocumentTypeRetrieve = z
	.object({
		id: z.string().min(1).optional(),
		title: z.string().min(1).max(60).optional(),
		title_translations: z
			.object({
				bg: z.string().optional(),
				de: z.string().optional(),
				el: z.string().optional(),
				en: z.string().optional(),
				'en-gb': z.string().optional(),
				es: z.string().optional(),
				fr: z.string().optional(),
				it: z.string().optional(),
			})
			.strict()
			.optional(),
		active: z.boolean().optional(),
		application: z.number().int().optional(),
		default: z.boolean().optional(),
		always_self_billed: z.boolean().optional(),
		is_delivery_note: z.boolean().optional(),
		is_reverse_delivery_note: z.boolean().optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v11Def_PUV11EmailTemplate = z
	.object({
		id: z.string().min(1).optional(),
		email_type: z.string().optional(),
		subject: z.string().optional(),
		message: z.string().optional(),
		sender_type: z.string().optional(),
		sender_name: z.string().max(70).optional(),
		default: z.boolean().optional(),
		default_for_language: z.string().optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v11Def_V11EmailTemplate = z
	.object({
		id: z.string().min(1).optional(),
		email_type: z.string(),
		subject: z.string(),
		message: z.string(),
		sender_type: z.string().optional(),
		sender_name: z.string().max(70).optional(),
		default: z.boolean().optional(),
		default_for_language: z.string().optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v11Def_V11EmailTemplateUpdate = z
	.object({
		id: z.string().min(1).optional(),
		email_type: z.string().optional(),
		subject: z.string(),
		message: z.string(),
		sender_type: z.string().optional(),
		sender_name: z.string().max(70).optional(),
		default: z.boolean().optional(),
		default_for_language: z.string().optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v11Def_PUV11EmailTemplateUpdate = z
	.object({
		id: z.string().min(1).optional(),
		email_type: z.string().optional(),
		subject: z.string().optional(),
		message: z.string().optional(),
		sender_type: z.string().optional(),
		sender_name: z.string().max(70).optional(),
		default: z.boolean().optional(),
		default_for_language: z.string().optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v11Def_PUV11EstimateList = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		representation: z.string().min(1).optional(),
		status: z.string().optional(),
		draft: z.boolean().optional(),
		documenttype: z.string().optional(),
		sequence: z.string().optional(),
		number: z.string().max(100).optional(),
		date: z.string().optional(),
		branch: z.string().nullable().optional(),
		client: z.string().optional(),
		client_display_name: z.string().min(1).max(203).optional(),
		client_profession: z.string().max(100).optional(),
		client_vat_number: z.string().max(20).optional(),
		billing_address: v11Def_BillingAddress.optional(),
		shipping_address: v11Def_ShippingAddress.optional(),
		client_contact_person: z.string().max(101).optional(),
		client_phone_number: z.string().max(30).optional(),
		client_email: z.string().max(100).optional(),
		currency_code: z.string().optional(),
		exchange_rate: z.string().optional(),
		calculator_mode: z.string().optional(),
		initial: z.string().optional(),
		net: z.string().optional(),
		total: z.string().optional(),
		permalink: z.string().min(1).optional(),
		converted_invoice: z.string().optional(),
		active: z.boolean().optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v11Def_V11EstimateItemNestedCreate = z
	.object({
		id: z.string().min(1).optional(),
		product: z.string().nullable().optional(),
		title: z.string().min(1).max(200).optional(),
		description: z.string().optional(),
		quantity: z.string().optional(),
		unit_measure: z.number().int().nullable().optional(),
		unit_value: z.string().optional(),
		unit_value_gross: z.string().optional(),
		unit_discount: z.string().optional(),
		unit_discount_gross: z.string().optional(),
		unit_discount_percentage: z.string().optional(),
		unit_discount_mode: z.string().optional(),
		taxes: z.array(z.string()).optional(),
		unit_total: z.string().optional(),
		item_net: z.string().optional(),
	})
	.strict();
const v11Def_V11EstimateCreate = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		representation: z.string().min(1).optional(),
		status: z.string().optional(),
		draft: z.boolean().optional(),
		accept_status: z.string().optional(),
		documenttype: z.string().optional(),
		sequence: z.string().nullable().optional(),
		number: z.string().max(100).optional(),
		date: z.string().optional(),
		branch: z.string().nullable().optional(),
		client: z.string(),
		client_display_name: z.string().min(1).max(203).optional(),
		client_profession: z.string().max(100).optional(),
		client_vat_number: z.string().max(20).optional(),
		billing_address: v11Def_BillingAddress.optional(),
		shipping_address: v11Def_ShippingAddress.optional(),
		client_contact_person: z.string().max(101).optional(),
		client_phone_number: z.string().max(30).optional(),
		client_email: z.string().max(100).optional(),
		currency_code: z.string().optional(),
		exchange_rate: z.string().optional(),
		calculator_mode: z.string().optional(),
		items: z.array(v11Def_V11EstimateItemNestedCreate),
		initial: z.string().optional(),
		net: z.string().optional(),
		total: z.string().optional(),
		template: z.string().optional(),
		terms: z.string().optional(),
		public_notes: z.string().optional(),
		permalink: z.string().min(1).optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v11Def_PUV11EstimateCreate = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		representation: z.string().min(1).optional(),
		status: z.string().optional(),
		draft: z.boolean().optional(),
		accept_status: z.string().optional(),
		documenttype: z.string().optional(),
		sequence: z.string().nullable().optional(),
		number: z.string().max(100).optional(),
		date: z.string().optional(),
		branch: z.string().nullable().optional(),
		client: z.string().optional(),
		client_display_name: z.string().min(1).max(203).optional(),
		client_profession: z.string().max(100).optional(),
		client_vat_number: z.string().max(20).optional(),
		billing_address: v11Def_BillingAddress.optional(),
		shipping_address: v11Def_ShippingAddress.optional(),
		client_contact_person: z.string().max(101).optional(),
		client_phone_number: z.string().max(30).optional(),
		client_email: z.string().max(100).optional(),
		currency_code: z.string().optional(),
		exchange_rate: z.string().optional(),
		calculator_mode: z.string().optional(),
		items: z.array(v11Def_V11EstimateItemNestedCreate).optional(),
		initial: z.string().optional(),
		net: z.string().optional(),
		total: z.string().optional(),
		template: z.string().optional(),
		terms: z.string().optional(),
		public_notes: z.string().optional(),
		permalink: z.string().min(1).optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v11Def_V11EstimateItemNested = z
	.object({
		id: z.string().min(1).optional(),
		product: z.string().nullable().optional(),
		title: z.string().min(1).max(200).optional(),
		description: z.string().optional(),
		quantity: z.string().optional(),
		unit_measure: z.number().int().nullable().optional(),
		unit_value: z.string().optional(),
		unit_value_gross: z.string().optional(),
		unit_discount: z.string().optional(),
		unit_discount_gross: z.string().optional(),
		unit_discount_percentage: z.string().optional(),
		unit_discount_mode: z.string().optional(),
		taxes: z.array(z.string()).optional(),
		unit_total: z.string().optional(),
		item_net: z.string().optional(),
	})
	.strict();
const v11Def_PUV11EstimateRetrieveUpdate = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		representation: z.string().min(1).optional(),
		status: z.string().optional(),
		draft: z.boolean().optional(),
		accept_status: z.string().optional(),
		documenttype: z.string().optional(),
		sequence: z.string().nullable().optional(),
		number: z.string().max(100).optional(),
		date: z.string().optional(),
		branch: z.string().nullable().optional(),
		client: z.string().optional(),
		client_display_name: z.string().min(1).max(203).optional(),
		client_profession: z.string().max(100).optional(),
		client_vat_number: z.string().max(20).optional(),
		billing_address: v11Def_BillingAddress.optional(),
		shipping_address: v11Def_ShippingAddress.optional(),
		currency_code: z.string().optional(),
		exchange_rate: z.string().optional(),
		client_contact_person: z.string().max(101).optional(),
		client_phone_number: z.string().max(30).optional(),
		client_email: z.string().max(100).optional(),
		calculator_mode: z.string().optional(),
		items: z.array(v11Def_V11EstimateItemNested).optional(),
		initial: z.string().optional(),
		net: z.string().optional(),
		total: z.string().optional(),
		template: z.string().optional(),
		public_notes: z.string().optional(),
		converted_invoice: z.string().optional(),
		permalink: z.string().min(1).optional(),
		active: z.boolean().optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v11Def_V11EstimateRetrieveUpdate = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		representation: z.string().min(1).optional(),
		status: z.string().optional(),
		draft: z.boolean().optional(),
		accept_status: z.string().optional(),
		documenttype: z.string().optional(),
		sequence: z.string().nullable().optional(),
		number: z.string().max(100).optional(),
		date: z.string().optional(),
		branch: z.string().nullable().optional(),
		client: z.string(),
		client_display_name: z.string().min(1).max(203).optional(),
		client_profession: z.string().max(100).optional(),
		client_vat_number: z.string().max(20).optional(),
		billing_address: v11Def_BillingAddress.optional(),
		shipping_address: v11Def_ShippingAddress.optional(),
		currency_code: z.string().optional(),
		exchange_rate: z.string().optional(),
		client_contact_person: z.string().max(101).optional(),
		client_phone_number: z.string().max(30).optional(),
		client_email: z.string().max(100).optional(),
		calculator_mode: z.string().optional(),
		items: z.array(v11Def_V11EstimateItemNested),
		initial: z.string().optional(),
		net: z.string().optional(),
		total: z.string().optional(),
		template: z.string().optional(),
		public_notes: z.string().optional(),
		converted_invoice: z.string().optional(),
		permalink: z.string().min(1).optional(),
		active: z.boolean().optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v11Def_PUV11EstimatePartialUpdate = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		draft: z.boolean().optional(),
		status: z.string().optional(),
		template: z.string().optional(),
		representation: z.string().min(1).optional(),
		converted_invoice: z.string().optional(),
		accept_status: z.string().optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v11Def_EstimateEmailFromTemplate = z
	.object({
		to: z.string().min(1),
		store_to: z.boolean().optional(),
		cc: z.array(z.string().min(1)).optional(),
		bcc: z.array(z.string().min(1)).optional(),
		reply_to: z.string().optional(),
		attach_pdf: z.boolean().optional(),
		attachments: z.array(z.string()).optional(),
	})
	.strict();
const v11Def_EstimateEmail = z
	.object({
		to: z.string().min(1),
		store_to: z.boolean().optional(),
		cc: z.array(z.string().min(1)),
		bcc: z.array(z.string().min(1)),
		reply_to: z.string().optional(),
		subject: z.string().min(1).max(255),
		message: z.string().min(1),
		attach_pdf: z.boolean(),
		sender_name: z.string().min(1).max(70).optional(),
		attachments: z.array(z.string()).optional(),
	})
	.strict();
const v11Def_PUV11ExpenseCategoryListRetrieve = z
	.object({
		id: z.string().min(1).optional(),
		title: z.string().min(1).max(60).optional(),
		color: z
			.string()
			.min(1)
			.max(6)
			.regex(new RegExp('^[a-fA-F0-9]{6}$'))
			.optional(),
		protected: z.boolean().optional(),
		active: z.boolean().optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v11Def_PUV11ExpenseList = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		representation: z.string().min(1).optional(),
		date: z.string().optional(),
		reference: z.string().max(150).optional(),
		branch: z.string().nullable().optional(),
		supplier: z.string().nullable().optional(),
		currency_code: z.string().optional(),
		exchange_rate: z.string().optional(),
		calculator_mode: z.string().optional(),
		net: z.string().optional(),
		total: z.string().optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v11Def_V11ExpenseItemNestedCreate = z
	.object({
		id: z.string().min(1).optional(),
		expense_category: z.string(),
		description: z.string().optional(),
		amount: z.string().optional(),
		item_net: z.string().optional(),
		taxes: z.array(z.string()).optional(),
		project: z.string().nullable().optional(),
		billable: z.boolean().optional(),
	})
	.strict();
const v11Def_V11ExpenseCreate = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		representation: z.string().min(1).optional(),
		date: z.string().optional(),
		reference: z.string().max(150).optional(),
		branch: z.string().nullable().optional(),
		supplier: z.string().nullable().optional(),
		currency_code: z.string().optional(),
		exchange_rate: z.string().optional(),
		calculator_mode: z.string().optional(),
		items: z.array(v11Def_V11ExpenseItemNestedCreate),
		net: z.string().optional(),
		total: z.string().optional(),
		trackingcategories: z.array(v11Def_RecordTrackingCategoryNested).optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v11Def_PUV11ExpenseCreate = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		representation: z.string().min(1).optional(),
		date: z.string().optional(),
		reference: z.string().max(150).optional(),
		branch: z.string().nullable().optional(),
		supplier: z.string().nullable().optional(),
		currency_code: z.string().optional(),
		exchange_rate: z.string().optional(),
		calculator_mode: z.string().optional(),
		items: z.array(v11Def_V11ExpenseItemNestedCreate).optional(),
		net: z.string().optional(),
		total: z.string().optional(),
		trackingcategories: z.array(v11Def_RecordTrackingCategoryNested).optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v11Def_V11ExpenseItemNestedRetrieve = z
	.object({
		id: z.string().min(1).optional(),
		expense_category: z.string(),
		description: z.string().optional(),
		amount: z.string().optional(),
		item_net: z.string().optional(),
		taxes: z.array(z.string()).optional(),
		project: z.string().nullable().optional(),
		billable: z.boolean().optional(),
	})
	.strict();
const v11Def_PUV11ExpenseRetrieveUpdate = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		representation: z.string().min(1).optional(),
		date: z.string().optional(),
		reference: z.string().max(150).optional(),
		branch: z.string().nullable().optional(),
		supplier: z.string().nullable().optional(),
		currency_code: z.string().optional(),
		exchange_rate: z.string().optional(),
		calculator_mode: z.string().optional(),
		items: z.array(v11Def_V11ExpenseItemNestedRetrieve).optional(),
		net: z.string().optional(),
		total: z.string().optional(),
		trackingcategories: z.array(v11Def_RecordTrackingCategoryNested).optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v11Def_V11ExpenseRetrieveUpdate = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		representation: z.string().min(1).optional(),
		date: z.string().optional(),
		reference: z.string().max(150).optional(),
		branch: z.string().nullable().optional(),
		supplier: z.string().nullable().optional(),
		currency_code: z.string().optional(),
		exchange_rate: z.string().optional(),
		calculator_mode: z.string().optional(),
		items: z.array(v11Def_V11ExpenseItemNestedRetrieve),
		net: z.string().optional(),
		total: z.string().optional(),
		trackingcategories: z.array(v11Def_RecordTrackingCategoryNested).optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v11Def_PUV11InvoiceList = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		representation: z.string().min(1).optional(),
		status: z.string().optional(),
		draft: z.boolean().optional(),
		documenttype: z.string().optional(),
		sequence: z.string().optional(),
		number: z.string().max(100).optional(),
		date: z.string().optional(),
		due_date: z.string().nullable().optional(),
		branch: z.string().nullable().optional(),
		client: z.string().optional(),
		client_display_name: z.string().min(1).max(203).optional(),
		client_profession: z.string().max(100).optional(),
		client_vat_number: z.string().max(20).optional(),
		billing_address: v11Def_BillingAddress.optional(),
		shipping_address: v11Def_ShippingAddress.optional(),
		client_contact_person: z.string().max(101).optional(),
		client_phone_number: z.string().max(30).optional(),
		client_email: z.string().max(100).optional(),
		loading_address: v11Def_LoadingAddress.optional(),
		dispatch_date: z.string().nullable().optional(),
		dispatch_time: z.string().nullable().optional(),
		vehicle_number: z.string().max(150).optional(),
		move_purpose: z.number().int().nullable().optional(),
		currency_code: z.string().optional(),
		exchange_rate: z.string().optional(),
		calculator_mode: z.string().optional(),
		initial: z.string().optional(),
		net: z.string().optional(),
		total: z.string().optional(),
		payable: z.string().optional(),
		paid: z.string().optional(),
		permalink: z.string().min(1).optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v11Def_InvoiceRelatedEntities = z
	.object({
		id: z.string().min(1).optional(),
		contact: z.string(),
		contact_display_name: z.string().min(1).max(203),
		contact_vat_number: z.string().max(20).optional(),
		type: z.number().int(),
		billing_address: v11Def_BillingAddress.optional(),
	})
	.strict();
const v11Def_InvoicePackageNested = z
	.object({
		id: z.string().min(1).optional(),
		packaging_type: z.number().int(),
		quantity: z.number().int().min(1).max(32767),
		other_packaging_type_title: z.string().max(150).optional(),
	})
	.strict();
const v11Def_V11InvoiceItemNestedCreate = z
	.object({
		id: z.string().min(1).optional(),
		product: z.string().nullable().optional(),
		title: z.string().min(1).max(200).optional(),
		description: z.string().optional(),
		quantity: z.string().optional(),
		unit_measure: z.number().int().nullable().optional(),
		unit_value: z.string().optional(),
		unit_value_gross: z.string().optional(),
		unit_discount: z.string().optional(),
		unit_discount_gross: z.string().optional(),
		unit_discount_percentage: z.string().optional(),
		unit_discount_mode: z.string().optional(),
		taxes: z.array(z.string()).optional(),
		unit_total: z.string().optional(),
		item_net: z.string().optional(),
		project: z.string().nullable().optional(),
		taric_code: z.string().min(10).max(10).optional(),
		warehouse: z.string().nullable().optional(),
		skip_stock_update: z.boolean().optional(),
	})
	.strict();
const v11Def_V11InvoiceCreate = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		representation: z.string().min(1).optional(),
		status: z.string().optional(),
		draft: z.boolean().optional(),
		documenttype: z.string().optional(),
		sequence: z.string().nullable().optional(),
		number: z.string().max(100).optional(),
		date: z.string(),
		due_days: z.number().int().min(0).max(2147483647).nullable().optional(),
		branch: z.string().nullable().optional(),
		client: z.string(),
		client_display_name: z.string().min(1).max(203).optional(),
		client_profession: z.string().max(100).optional(),
		client_vat_number: z.string().max(20).optional(),
		billing_address: v11Def_BillingAddress.optional(),
		shipping_address: v11Def_ShippingAddress.optional(),
		client_contact_person: z.string().max(101).optional(),
		client_phone_number: z.string().max(30).optional(),
		client_email: z.string().max(100).optional(),
		loading_address: v11Def_LoadingAddress.optional(),
		dispatch_date: z.string().nullable().optional(),
		dispatch_time: z.string().nullable().optional(),
		vehicle_number: z.string().max(150).optional(),
		move_purpose: z.number().int().nullable().optional(),
		related_entities: z
			.array(v11Def_InvoiceRelatedEntities)
			.nullable()
			.optional(),
		packages: z.array(v11Def_InvoicePackageNested).nullable().optional(),
		currency_code: z.string().optional(),
		exchange_rate: z.string().optional(),
		calculator_mode: z.string().optional(),
		items: z.array(v11Def_V11InvoiceItemNestedCreate),
		initial: z.string().optional(),
		net: z.string().optional(),
		total: z.string().optional(),
		withholding_taxes: z.array(z.string()).optional(),
		payable: z.string().optional(),
		paid: z.string().optional(),
		template: z.string().optional(),
		terms: z.string().optional(),
		public_notes: z.string().optional(),
		payment_gateways: z.array(z.string()).optional(),
		trackingcategories: z.array(v11Def_RecordTrackingCategoryNested).optional(),
		permalink: z.string().min(1).optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v11Def_PUV11InvoiceCreate = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		representation: z.string().min(1).optional(),
		status: z.string().optional(),
		draft: z.boolean().optional(),
		documenttype: z.string().optional(),
		sequence: z.string().nullable().optional(),
		number: z.string().max(100).optional(),
		date: z.string().optional(),
		due_days: z.number().int().min(0).max(2147483647).nullable().optional(),
		branch: z.string().nullable().optional(),
		client: z.string().optional(),
		client_display_name: z.string().min(1).max(203).optional(),
		client_profession: z.string().max(100).optional(),
		client_vat_number: z.string().max(20).optional(),
		billing_address: v11Def_BillingAddress.optional(),
		shipping_address: v11Def_ShippingAddress.optional(),
		client_contact_person: z.string().max(101).optional(),
		client_phone_number: z.string().max(30).optional(),
		client_email: z.string().max(100).optional(),
		loading_address: v11Def_LoadingAddress.optional(),
		dispatch_date: z.string().nullable().optional(),
		dispatch_time: z.string().nullable().optional(),
		vehicle_number: z.string().max(150).optional(),
		move_purpose: z.number().int().nullable().optional(),
		related_entities: z
			.array(v11Def_InvoiceRelatedEntities)
			.nullable()
			.optional(),
		packages: z.array(v11Def_InvoicePackageNested).nullable().optional(),
		currency_code: z.string().optional(),
		exchange_rate: z.string().optional(),
		calculator_mode: z.string().optional(),
		items: z.array(v11Def_V11InvoiceItemNestedCreate).optional(),
		initial: z.string().optional(),
		net: z.string().optional(),
		total: z.string().optional(),
		withholding_taxes: z.array(z.string()).optional(),
		payable: z.string().optional(),
		paid: z.string().optional(),
		template: z.string().optional(),
		terms: z.string().optional(),
		public_notes: z.string().optional(),
		payment_gateways: z.array(z.string()).optional(),
		trackingcategories: z.array(v11Def_RecordTrackingCategoryNested).optional(),
		permalink: z.string().min(1).optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v11Def_V11InvoiceItemNestedRetrieveUpdate = z
	.object({
		id: z.string().min(1).optional(),
		product: z.string().nullable().optional(),
		title: z.string().min(1).max(200).optional(),
		description: z.string().optional(),
		quantity: z.string().optional(),
		unit_measure: z.number().int().nullable().optional(),
		unit_value: z.string().optional(),
		unit_value_gross: z.string().optional(),
		unit_discount: z.string().optional(),
		unit_discount_gross: z.string().optional(),
		unit_discount_percentage: z.string().optional(),
		unit_discount_mode: z.string().optional(),
		taxes: z.array(z.string()).optional(),
		unit_total: z.string().optional(),
		item_net: z.string().optional(),
		project: z.string().nullable().optional(),
		taric_code: z.string().min(10).max(10).optional(),
		warehouse: z.string().nullable().optional(),
		skip_stock_update: z.boolean().optional(),
	})
	.strict();
const v11Def_PUV11InvoiceRetrieve = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		representation: z.string().min(1).optional(),
		status: z.string().optional(),
		draft: z.boolean().optional(),
		documenttype: z.string().optional(),
		sequence: z.string().nullable().optional(),
		number: z.string().max(100).optional(),
		date: z.string().optional(),
		due_days: z.number().int().min(0).max(2147483647).nullable().optional(),
		branch: z.string().nullable().optional(),
		client: z.string().optional(),
		client_display_name: z.string().min(1).max(203).optional(),
		client_profession: z.string().max(100).optional(),
		client_vat_number: z.string().max(20).optional(),
		billing_address: v11Def_BillingAddress.optional(),
		shipping_address: v11Def_ShippingAddress.optional(),
		client_contact_person: z.string().max(101).optional(),
		client_phone_number: z.string().max(30).optional(),
		client_email: z.string().max(100).optional(),
		loading_address: v11Def_LoadingAddress.optional(),
		dispatch_date: z.string().nullable().optional(),
		dispatch_time: z.string().nullable().optional(),
		vehicle_number: z.string().max(150).optional(),
		move_purpose: z.number().int().nullable().optional(),
		related_entities: z
			.array(v11Def_InvoiceRelatedEntities)
			.nullable()
			.optional(),
		packages: z.array(v11Def_InvoicePackageNested).nullable().optional(),
		currency_code: z.string().optional(),
		exchange_rate: z.string().optional(),
		calculator_mode: z.string().optional(),
		items: z.array(v11Def_V11InvoiceItemNestedRetrieveUpdate).optional(),
		initial: z.string().optional(),
		net: z.string().optional(),
		total: z.string().optional(),
		withholding_taxes: z.array(z.string()).optional(),
		payable: z.string().optional(),
		paid: z.string().optional(),
		template: z.string().optional(),
		terms: z.string().optional(),
		public_notes: z.string().optional(),
		payment_gateways: z.array(z.string()).optional(),
		trackingcategories: z.array(v11Def_RecordTrackingCategoryNested).optional(),
		permalink: z.string().min(1).optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v11Def_V11InvoiceUpdate = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		representation: z.string().min(1).optional(),
		status: z.string().optional(),
		draft: z.boolean().optional(),
		documenttype: z.string().optional(),
		sequence: z.string().nullable().optional(),
		number: z.string().max(100).optional(),
		date: z.string().optional(),
		due_days: z.number().int().min(0).max(2147483647).nullable().optional(),
		branch: z.string().nullable().optional(),
		client: z.string(),
		client_display_name: z.string().min(1).max(203).optional(),
		client_profession: z.string().max(100).optional(),
		client_vat_number: z.string().max(20).optional(),
		billing_address: v11Def_BillingAddress.optional(),
		shipping_address: v11Def_ShippingAddress.optional(),
		client_contact_person: z.string().max(101).optional(),
		client_phone_number: z.string().max(30).optional(),
		client_email: z.string().max(100).optional(),
		loading_address: v11Def_LoadingAddress.optional(),
		dispatch_date: z.string().nullable().optional(),
		dispatch_time: z.string().nullable().optional(),
		vehicle_number: z.string().max(150).optional(),
		move_purpose: z.number().int().nullable().optional(),
		related_entities: z
			.array(v11Def_InvoiceRelatedEntities)
			.nullable()
			.optional(),
		packages: z.array(v11Def_InvoicePackageNested).nullable().optional(),
		currency_code: z.string().optional(),
		exchange_rate: z.string().optional(),
		calculator_mode: z.string().optional(),
		items: z.array(v11Def_V11InvoiceItemNestedRetrieveUpdate),
		initial: z.string().optional(),
		net: z.string().optional(),
		total: z.string().optional(),
		withholding_taxes: z.array(z.string()).optional(),
		payable: z.string().optional(),
		paid: z.string().optional(),
		template: z.string().optional(),
		terms: z.string().optional(),
		public_notes: z.string().optional(),
		payment_gateways: z.array(z.string()).optional(),
		trackingcategories: z.array(v11Def_RecordTrackingCategoryNested).optional(),
		permalink: z.string().min(1).optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v11Def_PUV11InvoiceUpdate = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		representation: z.string().min(1).optional(),
		status: z.string().optional(),
		draft: z.boolean().optional(),
		documenttype: z.string().optional(),
		sequence: z.string().nullable().optional(),
		number: z.string().max(100).optional(),
		date: z.string().optional(),
		due_days: z.number().int().min(0).max(2147483647).nullable().optional(),
		branch: z.string().nullable().optional(),
		client: z.string().optional(),
		client_display_name: z.string().min(1).max(203).optional(),
		client_profession: z.string().max(100).optional(),
		client_vat_number: z.string().max(20).optional(),
		billing_address: v11Def_BillingAddress.optional(),
		shipping_address: v11Def_ShippingAddress.optional(),
		client_contact_person: z.string().max(101).optional(),
		client_phone_number: z.string().max(30).optional(),
		client_email: z.string().max(100).optional(),
		loading_address: v11Def_LoadingAddress.optional(),
		dispatch_date: z.string().nullable().optional(),
		dispatch_time: z.string().nullable().optional(),
		vehicle_number: z.string().max(150).optional(),
		move_purpose: z.number().int().nullable().optional(),
		related_entities: z
			.array(v11Def_InvoiceRelatedEntities)
			.nullable()
			.optional(),
		packages: z.array(v11Def_InvoicePackageNested).nullable().optional(),
		currency_code: z.string().optional(),
		exchange_rate: z.string().optional(),
		calculator_mode: z.string().optional(),
		items: z.array(v11Def_V11InvoiceItemNestedRetrieveUpdate).optional(),
		initial: z.string().optional(),
		net: z.string().optional(),
		total: z.string().optional(),
		withholding_taxes: z.array(z.string()).optional(),
		payable: z.string().optional(),
		paid: z.string().optional(),
		template: z.string().optional(),
		terms: z.string().optional(),
		public_notes: z.string().optional(),
		payment_gateways: z.array(z.string()).optional(),
		trackingcategories: z.array(v11Def_RecordTrackingCategoryNested).optional(),
		permalink: z.string().min(1).optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v11Def_PUV11InvoicePartialUpdate = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		representation: z.string().min(1).optional(),
		status: z.string().optional(),
		draft: z.boolean().optional(),
		exchange_rate: z.string().optional(),
		payment_gateways: z.array(z.string()).optional(),
		trackingcategories: z.array(v11Def_RecordTrackingCategoryNested).optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v11Def_InvoiceEmailFromTemplate = z
	.object({
		to: z.string().min(1),
		store_to: z.boolean().optional(),
		cc: z.array(z.string().min(1)).optional(),
		bcc: z.array(z.string().min(1)).optional(),
		reply_to: z.string().optional(),
		attach_pdf: z.boolean().optional(),
		attachments: z.array(z.string()).optional(),
	})
	.strict();
const v11Def_InvoiceEmail = z
	.object({
		to: z.string().min(1),
		store_to: z.boolean().optional(),
		cc: z.array(z.string().min(1)),
		bcc: z.array(z.string().min(1)),
		reply_to: z.string().optional(),
		subject: z.string().min(1).max(255),
		message: z.string().min(1),
		attach_pdf: z.boolean(),
		sender_name: z.string().min(1).max(70).optional(),
		attachments: z.array(z.string()).optional(),
	})
	.strict();
const v11Def_PUInvoiceMarkVoidResponse = z
	.object({
		status: z.string().optional(),
	})
	.strict();
const v11Def_PUInvoiceCreditTransactionInvSerializer = z
	.object({
		id: z.string().min(1).optional(),
		representation: z.string().optional(),
		creditnote: z.string().optional(),
		amount: z.string().optional(),
		currency_code: z.string().optional(),
		date: z.string().optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v11Def_InvoiceCreditTransactionInv = z
	.object({
		id: z.string().min(1).optional(),
		representation: z.string().optional(),
		creditnote: z.string(),
		amount: z.string(),
		currency_code: z.string().optional(),
		date: z.string().optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v11Def_PUV11NumberingSequence = z
	.object({
		id: z.string().min(1).optional(),
		name: z.string().min(1).max(10).optional(),
		documenttype: z.string().min(1).optional(),
		organization: z.string().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v11Def_V11NumberingSequence = z
	.object({
		id: z.string().min(1).optional(),
		name: z.string().min(1).max(10),
		documenttype: z.string().min(1),
		organization: z.string().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v11Def_V11NumberingSequenceUpdate = z
	.object({
		id: z.string().min(1).optional(),
		name: z.string().min(1).max(10),
		documenttype: z.string().min(1).optional(),
		organization: z.string().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v11Def_PUV11NumberingSequenceUpdate = z
	.object({
		id: z.string().min(1).optional(),
		name: z.string().min(1).max(10).optional(),
		documenttype: z.string().min(1).optional(),
		organization: z.string().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v11Def_PUV11PaymentGatewayList = z
	.object({
		id: z.string().min(1).optional(),
		title: z.string().min(1).max(30).optional(),
		backend: z.string().optional(),
		active: z.boolean().optional(),
		default: z.boolean().optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v11Def_PUV11ProductOrServiceList = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		title: z.string().min(1).max(150).optional(),
		code: z.string().max(40).optional(),
		description: z.string().optional(),
		sales: z.boolean().optional(),
		sale_value: z.string().optional(),
		sale_taxes: z.array(z.string()).optional(),
		purchases: z.boolean().optional(),
		purchase_value: z.string().optional(),
		purchase_taxes: z.array(z.string()).optional(),
		manage: z.boolean().optional(),
		stock: z.string().optional(),
		unit_measure: z.number().int().nullable().optional(),
		active: z.boolean().optional(),
		taric_code: z.string().min(10).max(10).optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v11Def_V11ProductOrServiceCreate = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		title: z.string().min(1).max(150),
		code: z.string().max(40).optional(),
		description: z.string().optional(),
		sales: z.boolean().optional(),
		sale_value: z.string().optional(),
		sale_taxes: z.array(z.string()).optional(),
		purchases: z.boolean().optional(),
		purchase_value: z.string().optional(),
		purchase_taxes: z.array(z.string()).optional(),
		manage: z.boolean().optional(),
		stock: z.string().optional(),
		unit_measure: z.number().int().nullable().optional(),
		trackingcategories: z.array(v11Def_RecordTrackingCategoryNested).optional(),
		active: z.boolean().optional(),
		taric_code: z.string().min(10).max(10).optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v11Def_PUV11ProductOrServiceCreate = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		title: z.string().min(1).max(150).optional(),
		code: z.string().max(40).optional(),
		description: z.string().optional(),
		sales: z.boolean().optional(),
		sale_value: z.string().optional(),
		sale_taxes: z.array(z.string()).optional(),
		purchases: z.boolean().optional(),
		purchase_value: z.string().optional(),
		purchase_taxes: z.array(z.string()).optional(),
		manage: z.boolean().optional(),
		stock: z.string().optional(),
		unit_measure: z.number().int().nullable().optional(),
		trackingcategories: z.array(v11Def_RecordTrackingCategoryNested).optional(),
		active: z.boolean().optional(),
		taric_code: z.string().min(10).max(10).optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v11Def_PUV11ProductOrServiceRetrieveUpdate = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		title: z.string().min(1).max(150).optional(),
		code: z.string().max(40).optional(),
		description: z.string().optional(),
		sales: z.boolean().optional(),
		sale_value: z.string().optional(),
		sale_taxes: z.array(z.string()).optional(),
		purchases: z.boolean().optional(),
		purchase_value: z.string().optional(),
		purchase_taxes: z.array(z.string()).optional(),
		manage: z.boolean().optional(),
		stock: z.string().optional(),
		unit_measure: z.number().int().nullable().optional(),
		trackingcategories: z.array(v11Def_RecordTrackingCategoryNested).optional(),
		active: z.boolean().optional(),
		taric_code: z.string().min(10).max(10).optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v11Def_V11ProductOrServiceRetrieveUpdate = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		title: z.string().min(1).max(150),
		code: z.string().max(40).optional(),
		description: z.string().optional(),
		sales: z.boolean().optional(),
		sale_value: z.string().optional(),
		sale_taxes: z.array(z.string()).optional(),
		purchases: z.boolean().optional(),
		purchase_value: z.string().optional(),
		purchase_taxes: z.array(z.string()).optional(),
		manage: z.boolean().optional(),
		stock: z.string().optional(),
		unit_measure: z.number().int().nullable().optional(),
		trackingcategories: z.array(v11Def_RecordTrackingCategoryNested).optional(),
		active: z.boolean().optional(),
		taric_code: z.string().min(10).max(10).optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v11Def_PUV11ProjectList = z
	.object({
		id: z.string().min(1).optional(),
		name: z.string().min(1).max(100).optional(),
		description: z.string().optional(),
		client: z.string().optional(),
		billing_method: z.string().optional(),
		fixed_cost: z.string().optional(),
		hourly_rate: z.string().optional(),
		active: z.boolean().optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v11Def_V11ProjectMemberNestedRetrieve = z
	.object({
		id: z.string().min(1).optional(),
		member: z.number().int(),
		manager: z.string().optional(),
		hourly_rate: z.string().optional(),
		cost_per_hour: z.string().optional(),
	})
	.strict();
const v11Def_PUV11ProjectRetrieve = z
	.object({
		id: z.string().min(1).optional(),
		name: z.string().min(1).max(100).optional(),
		description: z.string().optional(),
		client: z.string().optional(),
		billing_method: z.string().optional(),
		fixed_cost: z.string().optional(),
		hourly_rate: z.string().optional(),
		members: z.array(v11Def_V11ProjectMemberNestedRetrieve).optional(),
		active: z.boolean().optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v11Def_PUV11RecurringInvoiceList = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		start_datetime: z.string().optional(),
		interval: z.number().int().min(0).max(2147483647).optional(),
		period: z.string().optional(),
		end_datetime: z.string().optional(),
		last_execution: z.string().optional(),
		next_execution: z.string().optional(),
		paused: z.boolean().optional(),
		representation: z.string().min(1).optional(),
		documenttype: z.string().optional(),
		sequence: z.string().optional(),
		draft: z.boolean().optional(),
		auto_email: z.boolean().optional(),
		due_days: z.number().int().min(0).max(2147483647).nullable().optional(),
		template: z.string().optional(),
		branch: z.string().nullable().optional(),
		client: z.string().optional(),
		client_profession: z.string().max(100).optional(),
		client_vat_number: z.string().max(20).optional(),
		billing_address: v11Def_BillingAddress.optional(),
		shipping_address: v11Def_ShippingAddress.optional(),
		client_contact_person: z.string().max(101).optional(),
		client_phone_number: z.string().max(30).optional(),
		client_email: z.string().max(100).optional(),
		currency_code: z.string().optional(),
		exchange_rate: z.string().optional(),
		calculator_mode: z.string().optional(),
		initial: z.string().optional(),
		net: z.string().optional(),
		total: z.string().optional(),
		payable: z.string().optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v11Def_V11RecurringInvoiceItemNestedRetrieveCreate = z
	.object({
		id: z.string().min(1).optional(),
		product: z.string().nullable().optional(),
		title: z.string().min(1).max(200).optional(),
		description: z.string().optional(),
		quantity: z.string().optional(),
		unit_measure: z.number().int().nullable().optional(),
		unit_value: z.string().optional(),
		unit_value_gross: z.string().optional(),
		unit_discount: z.string().optional(),
		unit_discount_gross: z.string().optional(),
		unit_discount_percentage: z.string().optional(),
		unit_discount_mode: z.string().optional(),
		taxes: z.array(z.string()).optional(),
		unit_total: z.string().optional(),
		item_net: z.string().optional(),
		project: z.string().nullable().optional(),
		warehouse: z.string().nullable().optional(),
		skip_stock_update: z.boolean().optional(),
	})
	.strict();
const v11Def_V11RecurringInvoiceCreate = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		start_datetime: z.string().optional(),
		interval: z.number().int().min(0).max(2147483647).optional(),
		period: z.string().optional(),
		end_datetime: z.string(),
		last_execution: z.string().optional(),
		next_execution: z.string().optional(),
		paused: z.boolean().optional(),
		representation: z.string().min(1).optional(),
		documenttype: z.string().optional(),
		sequence: z.string().nullable().optional(),
		draft: z.boolean().optional(),
		auto_email: z.boolean().optional(),
		due_days: z.number().int().min(0).max(2147483647).nullable().optional(),
		template: z.string().optional(),
		branch: z.string().nullable().optional(),
		client: z.string(),
		client_display_name: z.string().min(1).max(203).optional(),
		client_profession: z.string().max(100).optional(),
		client_vat_number: z.string().max(20).optional(),
		billing_address: v11Def_BillingAddress.optional(),
		shipping_address: v11Def_ShippingAddress.optional(),
		client_contact_person: z.string().max(101).optional(),
		client_phone_number: z.string().max(30).optional(),
		client_email: z.string().max(100).optional(),
		currency_code: z.string().optional(),
		exchange_rate: z.string().optional(),
		calculator_mode: z.string().optional(),
		items: z.array(v11Def_V11RecurringInvoiceItemNestedRetrieveCreate),
		initial: z.string().optional(),
		net: z.string().optional(),
		total: z.string().optional(),
		withholding_taxes: z.array(z.string()).optional(),
		payable: z.string().optional(),
		trackingcategories: z.array(v11Def_RecordTrackingCategoryNested).optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v11Def_PUV11RecurringInvoiceCreate = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		start_datetime: z.string().optional(),
		interval: z.number().int().min(0).max(2147483647).optional(),
		period: z.string().optional(),
		end_datetime: z.string().optional(),
		last_execution: z.string().optional(),
		next_execution: z.string().optional(),
		paused: z.boolean().optional(),
		representation: z.string().min(1).optional(),
		documenttype: z.string().optional(),
		sequence: z.string().nullable().optional(),
		draft: z.boolean().optional(),
		auto_email: z.boolean().optional(),
		due_days: z.number().int().min(0).max(2147483647).nullable().optional(),
		template: z.string().optional(),
		branch: z.string().nullable().optional(),
		client: z.string().optional(),
		client_display_name: z.string().min(1).max(203).optional(),
		client_profession: z.string().max(100).optional(),
		client_vat_number: z.string().max(20).optional(),
		billing_address: v11Def_BillingAddress.optional(),
		shipping_address: v11Def_ShippingAddress.optional(),
		client_contact_person: z.string().max(101).optional(),
		client_phone_number: z.string().max(30).optional(),
		client_email: z.string().max(100).optional(),
		currency_code: z.string().optional(),
		exchange_rate: z.string().optional(),
		calculator_mode: z.string().optional(),
		items: z
			.array(v11Def_V11RecurringInvoiceItemNestedRetrieveCreate)
			.optional(),
		initial: z.string().optional(),
		net: z.string().optional(),
		total: z.string().optional(),
		withholding_taxes: z.array(z.string()).optional(),
		payable: z.string().optional(),
		trackingcategories: z.array(v11Def_RecordTrackingCategoryNested).optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v11Def_PUV11RecurringInvoiceRetrieve = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		start_datetime: z.string().optional(),
		interval: z.number().int().min(0).max(2147483647).optional(),
		period: z.string().optional(),
		end_datetime: z.string().optional(),
		last_execution: z.string().optional(),
		next_execution: z.string().optional(),
		paused: z.boolean().optional(),
		representation: z.string().min(1).optional(),
		documenttype: z.string().optional(),
		sequence: z.string().nullable().optional(),
		draft: z.boolean().optional(),
		auto_email: z.boolean().optional(),
		due_days: z.number().int().min(0).max(2147483647).nullable().optional(),
		template: z.string().optional(),
		branch: z.string().nullable().optional(),
		client: z.string().optional(),
		client_display_name: z.string().min(1).max(203).optional(),
		client_profession: z.string().max(100).optional(),
		client_vat_number: z.string().max(20).optional(),
		billing_address: v11Def_BillingAddress.optional(),
		shipping_address: v11Def_ShippingAddress.optional(),
		client_contact_person: z.string().max(101).optional(),
		client_phone_number: z.string().max(30).optional(),
		client_email: z.string().max(100).optional(),
		currency_code: z.string().optional(),
		exchange_rate: z.string().optional(),
		calculator_mode: z.string().optional(),
		items: z
			.array(v11Def_V11RecurringInvoiceItemNestedRetrieveCreate)
			.optional(),
		initial: z.string().optional(),
		net: z.string().optional(),
		total: z.string().optional(),
		withholding_taxes: z.array(z.string()).optional(),
		payable: z.string().optional(),
		trackingcategories: z.array(v11Def_RecordTrackingCategoryNested).optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v11Def_V11RecurringInvoiceItemNestedUpdate = z
	.object({
		id: z.string().min(1).optional(),
		product: z.string().nullable().optional(),
		title: z.string().min(1).max(200).optional(),
		description: z.string().optional(),
		quantity: z.string().optional(),
		unit_measure: z.number().int().nullable().optional(),
		unit_value: z.string().optional(),
		unit_value_gross: z.string().optional(),
		unit_discount: z.string().optional(),
		unit_discount_gross: z.string().optional(),
		unit_discount_percentage: z.string().optional(),
		unit_discount_mode: z.string().optional(),
		taxes: z.array(z.string()).optional(),
		unit_total: z.string().optional(),
		item_net: z.string().optional(),
		project: z.string().nullable().optional(),
		warehouse: z.string().nullable().optional(),
		skip_stock_update: z.boolean().optional(),
	})
	.strict();
const v11Def_V11RecurringInvoiceUpdate = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		start_datetime: z.string().optional(),
		interval: z.number().int().min(0).max(2147483647).optional(),
		period: z.string().optional(),
		end_datetime: z.string(),
		last_execution: z.string().optional(),
		next_execution: z.string().optional(),
		paused: z.boolean().optional(),
		representation: z.string().min(1).optional(),
		documenttype: z.string().optional(),
		sequence: z.string().nullable().optional(),
		draft: z.boolean().optional(),
		auto_email: z.boolean().optional(),
		due_days: z.number().int().min(0).max(2147483647).nullable().optional(),
		template: z.string().optional(),
		branch: z.string().nullable().optional(),
		client: z.string(),
		client_display_name: z.string().min(1).max(203).optional(),
		client_profession: z.string().max(100).optional(),
		client_vat_number: z.string().max(20).optional(),
		billing_address: v11Def_BillingAddress.optional(),
		shipping_address: v11Def_ShippingAddress.optional(),
		client_contact_person: z.string().max(101).optional(),
		client_phone_number: z.string().max(30).optional(),
		client_email: z.string().max(100).optional(),
		currency_code: z.string().optional(),
		exchange_rate: z.string().optional(),
		calculator_mode: z.string().optional(),
		items: z.array(v11Def_V11RecurringInvoiceItemNestedUpdate),
		initial: z.string().optional(),
		net: z.string().optional(),
		total: z.string().optional(),
		withholding_taxes: z.array(z.string()).optional(),
		payable: z.string().optional(),
		trackingcategories: z.array(v11Def_RecordTrackingCategoryNested).optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v11Def_PUV11RecurringInvoiceUpdate = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		start_datetime: z.string().optional(),
		interval: z.number().int().min(0).max(2147483647).optional(),
		period: z.string().optional(),
		end_datetime: z.string().optional(),
		last_execution: z.string().optional(),
		next_execution: z.string().optional(),
		paused: z.boolean().optional(),
		representation: z.string().min(1).optional(),
		documenttype: z.string().optional(),
		sequence: z.string().nullable().optional(),
		draft: z.boolean().optional(),
		auto_email: z.boolean().optional(),
		due_days: z.number().int().min(0).max(2147483647).nullable().optional(),
		template: z.string().optional(),
		branch: z.string().nullable().optional(),
		client: z.string().optional(),
		client_display_name: z.string().min(1).max(203).optional(),
		client_profession: z.string().max(100).optional(),
		client_vat_number: z.string().max(20).optional(),
		billing_address: v11Def_BillingAddress.optional(),
		shipping_address: v11Def_ShippingAddress.optional(),
		client_contact_person: z.string().max(101).optional(),
		client_phone_number: z.string().max(30).optional(),
		client_email: z.string().max(100).optional(),
		currency_code: z.string().optional(),
		exchange_rate: z.string().optional(),
		calculator_mode: z.string().optional(),
		items: z.array(v11Def_V11RecurringInvoiceItemNestedUpdate).optional(),
		initial: z.string().optional(),
		net: z.string().optional(),
		total: z.string().optional(),
		withholding_taxes: z.array(z.string()).optional(),
		payable: z.string().optional(),
		trackingcategories: z.array(v11Def_RecordTrackingCategoryNested).optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v11Def_PUV11PurchaseCreditNoteList = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		representation: z.string().min(1).optional(),
		status: z.string().optional(),
		draft: z.boolean().optional(),
		documenttype: z.string().nullable().optional(),
		self_billed: z.boolean().optional(),
		sequence: z.string().optional(),
		reference: z.string().max(150).optional(),
		date: z.string().optional(),
		branch: z.string().nullable().optional(),
		supplier: z.string().optional(),
		currency_code: z.string().optional(),
		exchange_rate: z.string().optional(),
		calculator_mode: z.string().optional(),
		initial: z.string().optional(),
		net: z.string().optional(),
		total: z.string().optional(),
		payable: z.string().optional(),
		paid: z.string().optional(),
		permalink: z.string().nullable().optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v11Def_PurchaseCreditNoteRelatedEntities = z
	.object({
		id: z.string().min(1).optional(),
		contact: z.string(),
		contact_display_name: z.string().min(1).max(203),
		contact_vat_number: z.string().max(20).optional(),
		type: z.number().int(),
		billing_address: v11Def_BillingAddress.optional(),
	})
	.strict();
const v11Def_PurchaseCreditNotePackageNested = z
	.object({
		id: z.string().min(1).optional(),
		packaging_type: z.number().int(),
		quantity: z.number().int().min(1).max(32767),
		other_packaging_type_title: z.string().max(150).optional(),
	})
	.strict();
const v11Def_V11PurchaseCreditNoteItemNestedCreate = z
	.object({
		id: z.string().min(1).optional(),
		product: z.string().nullable().optional(),
		description: z.string().optional(),
		quantity: z.string().optional(),
		unit_measure: z.number().int().nullable().optional(),
		unit_value: z.string().optional(),
		unit_value_gross: z.string().optional(),
		unit_discount: z.string().optional(),
		unit_discount_gross: z.string().optional(),
		unit_discount_percentage: z.string().optional(),
		unit_discount_mode: z.string().optional(),
		taxes: z.array(z.string()).optional(),
		unit_total: z.string().optional(),
		item_net: z.string().optional(),
		project: z.string().nullable().optional(),
		billable: z.boolean().optional(),
		expense_category: z.string(),
		taric_code: z.string().min(10).max(10).optional(),
		warehouse: z.string().nullable().optional(),
		skip_stock_update: z.boolean().optional(),
	})
	.strict();
const v11Def_V11PurchaseCreditNoteCreate = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		representation: z.string().min(1).optional(),
		status: z.string().optional(),
		draft: z.boolean().optional(),
		documenttype: z.string().nullable().optional(),
		self_billed: z.boolean().optional(),
		sequence: z.string().nullable().optional(),
		reference: z.string().max(150).optional(),
		date: z.string().optional(),
		branch: z.string().nullable().optional(),
		supplier: z.string(),
		supplier_display_name: z.string().max(203).optional(),
		supplier_profession: z.string().max(100).optional(),
		supplier_vat_number: z.string().max(20).optional(),
		billing_address: v11Def_BillingAddress.optional(),
		shipping_address: v11Def_ShippingAddress.optional(),
		supplier_contact_person: z.string().max(101).optional(),
		supplier_phone_number: z.string().max(30).optional(),
		supplier_email: z.string().max(100).optional(),
		loading_address: v11Def_LoadingAddress.optional(),
		dispatch_date: z.string().nullable().optional(),
		dispatch_time: z.string().nullable().optional(),
		vehicle_number: z.string().max(150).optional(),
		move_purpose: z.number().int().nullable().optional(),
		related_entities: z
			.array(v11Def_PurchaseCreditNoteRelatedEntities)
			.nullable()
			.optional(),
		packages: z
			.array(v11Def_PurchaseCreditNotePackageNested)
			.nullable()
			.optional(),
		currency_code: z.string().optional(),
		exchange_rate: z.string().optional(),
		calculator_mode: z.string().optional(),
		items: z.array(v11Def_V11PurchaseCreditNoteItemNestedCreate),
		initial: z.string().optional(),
		net: z.string().optional(),
		total: z.string().optional(),
		withholding_taxes: z.array(z.string()).optional(),
		payable: z.string().optional(),
		paid: z.string().optional(),
		template: z.string().nullable().optional(),
		public_notes: z.string().optional(),
		trackingcategories: z.array(v11Def_RecordTrackingCategoryNested).optional(),
		related_documents: z.array(z.string()).optional(),
		permalink: z.string().nullable().optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v11Def_PUV11PurchaseCreditNoteCreate = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		representation: z.string().min(1).optional(),
		status: z.string().optional(),
		draft: z.boolean().optional(),
		documenttype: z.string().nullable().optional(),
		self_billed: z.boolean().optional(),
		sequence: z.string().nullable().optional(),
		reference: z.string().max(150).optional(),
		date: z.string().optional(),
		branch: z.string().nullable().optional(),
		supplier: z.string().optional(),
		supplier_display_name: z.string().max(203).optional(),
		supplier_profession: z.string().max(100).optional(),
		supplier_vat_number: z.string().max(20).optional(),
		billing_address: v11Def_BillingAddress.optional(),
		shipping_address: v11Def_ShippingAddress.optional(),
		supplier_contact_person: z.string().max(101).optional(),
		supplier_phone_number: z.string().max(30).optional(),
		supplier_email: z.string().max(100).optional(),
		loading_address: v11Def_LoadingAddress.optional(),
		dispatch_date: z.string().nullable().optional(),
		dispatch_time: z.string().nullable().optional(),
		vehicle_number: z.string().max(150).optional(),
		move_purpose: z.number().int().nullable().optional(),
		related_entities: z
			.array(v11Def_PurchaseCreditNoteRelatedEntities)
			.nullable()
			.optional(),
		packages: z
			.array(v11Def_PurchaseCreditNotePackageNested)
			.nullable()
			.optional(),
		currency_code: z.string().optional(),
		exchange_rate: z.string().optional(),
		calculator_mode: z.string().optional(),
		items: z.array(v11Def_V11PurchaseCreditNoteItemNestedCreate).optional(),
		initial: z.string().optional(),
		net: z.string().optional(),
		total: z.string().optional(),
		withholding_taxes: z.array(z.string()).optional(),
		payable: z.string().optional(),
		paid: z.string().optional(),
		template: z.string().nullable().optional(),
		public_notes: z.string().optional(),
		trackingcategories: z.array(v11Def_RecordTrackingCategoryNested).optional(),
		related_documents: z.array(z.string()).optional(),
		permalink: z.string().nullable().optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v11Def_V11PurchaseCreditNoteItemNestedRetrieveUpdate = z
	.object({
		id: z.string().min(1).optional(),
		product: z.string().nullable().optional(),
		description: z.string().optional(),
		quantity: z.string().optional(),
		unit_measure: z.number().int().nullable().optional(),
		unit_value: z.string().optional(),
		unit_value_gross: z.string().optional(),
		unit_discount: z.string().optional(),
		unit_discount_gross: z.string().optional(),
		unit_discount_percentage: z.string().optional(),
		unit_discount_mode: z.string().optional(),
		taxes: z.array(z.string()).optional(),
		unit_total: z.string().optional(),
		item_net: z.string().optional(),
		project: z.string().nullable().optional(),
		billable: z.boolean().optional(),
		expense_category: z.string(),
		taric_code: z.string().min(10).max(10).optional(),
		warehouse: z.string().nullable().optional(),
		skip_stock_update: z.boolean().optional(),
	})
	.strict();
const v11Def_PUV11PurchaseCreditNoteRetrieveUpdate = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		representation: z.string().min(1).optional(),
		status: z.string().optional(),
		draft: z.boolean().optional(),
		documenttype: z.string().nullable().optional(),
		self_billed: z.boolean().optional(),
		sequence: z.string().nullable().optional(),
		reference: z.string().max(150).optional(),
		date: z.string().optional(),
		branch: z.string().nullable().optional(),
		supplier: z.string().optional(),
		supplier_display_name: z.string().max(203).optional(),
		supplier_profession: z.string().max(100).optional(),
		supplier_vat_number: z.string().max(20).optional(),
		billing_address: v11Def_BillingAddress.optional(),
		shipping_address: v11Def_ShippingAddress.optional(),
		supplier_contact_person: z.string().max(101).optional(),
		supplier_phone_number: z.string().max(30).optional(),
		supplier_email: z.string().max(100).optional(),
		loading_address: v11Def_LoadingAddress.optional(),
		dispatch_date: z.string().nullable().optional(),
		dispatch_time: z.string().nullable().optional(),
		vehicle_number: z.string().max(150).optional(),
		move_purpose: z.number().int().nullable().optional(),
		related_entities: z
			.array(v11Def_PurchaseCreditNoteRelatedEntities)
			.nullable()
			.optional(),
		packages: z
			.array(v11Def_PurchaseCreditNotePackageNested)
			.nullable()
			.optional(),
		currency_code: z.string().optional(),
		exchange_rate: z.string().optional(),
		calculator_mode: z.string().optional(),
		items: z
			.array(v11Def_V11PurchaseCreditNoteItemNestedRetrieveUpdate)
			.optional(),
		initial: z.string().optional(),
		net: z.string().optional(),
		total: z.string().optional(),
		withholding_taxes: z.array(z.string()).optional(),
		payable: z.string().optional(),
		paid: z.string().optional(),
		template: z.string().nullable().optional(),
		public_notes: z.string().optional(),
		trackingcategories: z.array(v11Def_RecordTrackingCategoryNested).optional(),
		related_documents: z.array(z.string()).optional(),
		permalink: z.string().nullable().optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v11Def_V11PurchaseCreditNoteRetrieveUpdate = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		representation: z.string().min(1).optional(),
		status: z.string().optional(),
		draft: z.boolean().optional(),
		documenttype: z.string().nullable().optional(),
		self_billed: z.boolean().optional(),
		sequence: z.string().nullable().optional(),
		reference: z.string().max(150).optional(),
		date: z.string().optional(),
		branch: z.string().nullable().optional(),
		supplier: z.string(),
		supplier_display_name: z.string().max(203).optional(),
		supplier_profession: z.string().max(100).optional(),
		supplier_vat_number: z.string().max(20).optional(),
		billing_address: v11Def_BillingAddress.optional(),
		shipping_address: v11Def_ShippingAddress.optional(),
		supplier_contact_person: z.string().max(101).optional(),
		supplier_phone_number: z.string().max(30).optional(),
		supplier_email: z.string().max(100).optional(),
		loading_address: v11Def_LoadingAddress.optional(),
		dispatch_date: z.string().nullable().optional(),
		dispatch_time: z.string().nullable().optional(),
		vehicle_number: z.string().max(150).optional(),
		move_purpose: z.number().int().nullable().optional(),
		related_entities: z
			.array(v11Def_PurchaseCreditNoteRelatedEntities)
			.nullable()
			.optional(),
		packages: z
			.array(v11Def_PurchaseCreditNotePackageNested)
			.nullable()
			.optional(),
		currency_code: z.string().optional(),
		exchange_rate: z.string().optional(),
		calculator_mode: z.string().optional(),
		items: z.array(v11Def_V11PurchaseCreditNoteItemNestedRetrieveUpdate),
		initial: z.string().optional(),
		net: z.string().optional(),
		total: z.string().optional(),
		withholding_taxes: z.array(z.string()).optional(),
		payable: z.string().optional(),
		paid: z.string().optional(),
		template: z.string().nullable().optional(),
		public_notes: z.string().optional(),
		trackingcategories: z.array(v11Def_RecordTrackingCategoryNested).optional(),
		related_documents: z.array(z.string()).optional(),
		permalink: z.string().nullable().optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v11Def_PUV11PurchaseCreditNotePartialUpdate = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		representation: z.string().min(1).optional(),
		status: z.string().optional(),
		draft: z.boolean().optional(),
		exchange_rate: z.string().optional(),
		trackingcategories: z.array(v11Def_RecordTrackingCategoryNested).optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v11Def_PrivatePurchaseCreditNoteEmailFromTemplate = z
	.object({
		to: z.string().min(1),
		store_to: z.boolean().optional(),
		cc: z.array(z.string().min(1)).optional(),
		bcc: z.array(z.string().min(1)).optional(),
		reply_to: z.string().optional(),
		attach_pdf: z.boolean().optional(),
		attachments: z.array(z.string()).optional(),
	})
	.strict();
const v11Def_PrivatePurchaseCreditNoteEmail = z
	.object({
		to: z.string().min(1),
		store_to: z.boolean().optional(),
		cc: z.array(z.string().min(1)),
		bcc: z.array(z.string().min(1)),
		reply_to: z.string().optional(),
		subject: z.string().min(1).max(255),
		message: z.string().min(1),
		attach_pdf: z.boolean(),
		sender_name: z.string().min(1).max(70).optional(),
		attachments: z.array(z.string()).optional(),
	})
	.strict();
const v11Def_PUPurchaseCreditNoteMarkVoidResponse = z
	.object({
		status: z.string().optional(),
	})
	.strict();
const v11Def_PUV11PurchaseCreditTransactionPCNListCreate = z
	.object({
		id: z.string().min(1).optional(),
		representation: z.string().optional(),
		purchase: z.string().optional(),
		date: z.string().optional(),
		currency_code: z.string().optional(),
		amount: z.string().optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v11Def_V11PurchaseCreditTransactionPCNListCreate = z
	.object({
		id: z.string().min(1).optional(),
		representation: z.string().optional(),
		purchase: z.string(),
		date: z.string().optional(),
		currency_code: z.string().optional(),
		amount: z.string(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v11Def_PUV11TaxList = z
	.object({
		id: z.string().min(1).optional(),
		title: z.string().min(1).max(150).optional(),
		tax_type: z.string().optional(),
		value_mode: z.string().optional(),
		operand: z.string().optional(),
		percentage: z.string().optional(),
		amount: z.string().optional(),
		per_unit: z.boolean().optional(),
		subject_to_vat: z.boolean().optional(),
		apply_on_document_lines: z.boolean().optional(),
		for_information_purposes: z.boolean().optional(),
		active: z.boolean().optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v11Def_PUV11TaxRetrieve = z
	.object({
		id: z.string().min(1).optional(),
		title: z.string().min(1).max(150).optional(),
		title_translations: z
			.object({
				bg: z.string().optional(),
				de: z.string().optional(),
				el: z.string().optional(),
				en: z.string().optional(),
				'en-gb': z.string().optional(),
				es: z.string().optional(),
				fr: z.string().optional(),
				it: z.string().optional(),
			})
			.strict()
			.optional(),
		tax_type: z.string().optional(),
		value_mode: z.string().optional(),
		operand: z.string().optional(),
		percentage: z.string().optional(),
		amount: z.string().optional(),
		per_unit: z.boolean().optional(),
		subject_to_vat: z.boolean().optional(),
		apply_on_document_lines: z.boolean().optional(),
		for_information_purposes: z.boolean().optional(),
		active: z.boolean().optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v11Def_PUV11ThemeListRetrieve = z
	.object({
		id: z.string().min(1).optional(),
		active: z.boolean().optional(),
		default: z.boolean().optional(),
		title: z.string().min(1).max(30).optional(),
		template: z.string().optional(),
		language: z.string().optional(),
		company_name: z.string().max(70).optional(),
		company_info: z.string().optional(),
		invoice_terms: z.string().optional(),
		creditnote_terms: z.string().optional(),
		estimate_terms: z.string().optional(),
		invoice_public_notes: z.string().optional(),
		creditnote_public_notes: z.string().optional(),
		estimate_public_notes: z.string().optional(),
		self_billed_public_notes: z.string().optional(),
		self_billed_supplier_credit_public_notes: z.string().optional(),
		slogan: z.string().max(200).optional(),
		invoice_email_message: z.string().optional(),
		estimate_email_message: z.string().optional(),
		purchase_email_message: z.string().optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v11Def_PUV11TrackingCategoryListRetrieve = z
	.object({
		id: z.string().min(1).optional(),
		title: z.string().min(1).max(255).optional(),
		active: z.boolean().optional(),
		options: z.array(z.string()).optional(),
		application: z.array(z.string()).optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v11Def_WarehouseAddress = z
	.object({
		address_line: z.string().max(200),
		city: z.string().max(100),
		state: z.string().max(100).optional(),
		zip: z.string().max(20),
		country: z.string(),
	})
	.strict();
const v11Def_PUV11WarehouseSerializer = z
	.object({
		id: z.string().min(1).optional(),
		name: z.string().min(1).max(100).optional(),
		warehouse_address: v11Def_WarehouseAddress.optional(),
		default: z.boolean().optional(),
		active: z.boolean().optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v11Def_V11Warehouse = z
	.object({
		id: z.string().min(1).optional(),
		name: z.string().min(1).max(100),
		warehouse_address: v11Def_WarehouseAddress,
		default: z.boolean().optional(),
		active: z.boolean().optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();

const v12Def_PUV12PurchaseList = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		representation: z.string().min(1).optional(),
		status: z.string().optional(),
		draft: z.boolean().optional(),
		documenttype: z.string().nullable().optional(),
		self_billed: z.boolean().optional(),
		sequence_flat: z.string().max(10).optional(),
		reference: z.string().max(150).optional(),
		date: z.string().optional(),
		due_date: z.string().nullable().optional(),
		branch: z.string().nullable().optional(),
		supplier: z.string().optional(),
		currency_code: z.string().optional(),
		exchange_rate: z.string().optional(),
		calculator_mode: z.string().optional(),
		initial: z.string().optional(),
		net: z.string().optional(),
		total: z.string().optional(),
		payable: z.string().optional(),
		paid: z.string().optional(),
		permalink: z.string().nullable().optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_BillingAddress = z
	.object({
		address_line: z.string().max(200),
		city: z.string().max(100),
		state: z.string().max(100).optional(),
		zip: z.string().max(20),
		country: z.string(),
	})
	.strict();
const v12Def_ShippingAddress = z
	.object({
		address_line: z.string().max(200),
		city: z.string().max(100),
		state: z.string().max(100).optional(),
		zip: z.string().max(20),
		country: z.string(),
		branch_code: z.number().int().max(2147483647).nullable().optional(),
	})
	.strict();
const v12Def_LoadingAddress = z
	.object({
		address_line: z.string().max(200),
		city: z.string().max(100),
		state: z.string().max(100).optional(),
		zip: z.string().max(20),
		country: z.string(),
		branch_code: z.number().int().max(2147483647).nullable().optional(),
	})
	.strict();
const v12Def_PurchaseRelatedEntities = z
	.object({
		id: z.string().min(1).optional(),
		contact: z.string(),
		contact_display_name: z.string().min(1).max(203),
		contact_vat_number: z.string().max(20).optional(),
		type: z.number().int(),
		billing_address: v12Def_BillingAddress.optional(),
	})
	.strict();
const v12Def_PurchasePackageNested = z
	.object({
		id: z.string().min(1).optional(),
		packaging_type: z.number().int(),
		quantity: z.number().int().min(1).max(32767),
		other_packaging_type_title: z.string().max(150).optional(),
	})
	.strict();
const v12Def_PurchaseItemTaxNested = z
	.object({
		tax: z.string(),
		auto_calculate: z.boolean().optional(),
		amount: z.string().optional(),
		vat_amount: z.string().optional(),
		auto_calculate_vat: z.boolean().optional(),
	})
	.strict();
const v12Def_V12PurchaseItemNestedCreate = z
	.object({
		id: z.string().min(1).optional(),
		product: z.string().nullable().optional(),
		description: z.string().optional(),
		quantity: z.string().optional(),
		unit_measure: z.string().nullable().optional(),
		unit_value: z.string().optional(),
		unit_value_gross: z.string().optional(),
		unit_discount: z.string().optional(),
		unit_discount_gross: z.string().optional(),
		unit_discount_percentage: z.string().optional(),
		unit_discount_mode: z.string().optional(),
		taxes: z.array(v12Def_PurchaseItemTaxNested).optional(),
		unit_total: z.string().optional(),
		item_net: z.string().optional(),
		project: z.string().nullable().optional(),
		billable: z.boolean().optional(),
		expense_category: z.string().nullable().optional(),
		taric_code: z.string().min(10).max(10).optional(),
		warehouse: z.string().nullable().optional(),
		line_type: z.number().int().nullable().optional(),
		skip_stock_update: z.boolean().optional(),
	})
	.strict();
const v12Def_PurchaseStandardTaxNested = z
	.object({
		tax: z.string(),
		auto_calculate: z.boolean().optional(),
		amount: z.string().optional(),
	})
	.strict();
const v12Def_PurchaseWithholdingTaxNested = z
	.object({
		tax: z.string(),
		amount: z.string().optional(),
		subtotal: z.number().int().optional(),
		auto_calculate: z.boolean().optional(),
	})
	.strict();
const v12Def_RecordTrackingCategoryNested = z
	.object({
		trackingcategory: z.string(),
		option: z.string().min(1).max(225),
	})
	.strict();
const v12Def_V12PurchaseCreate = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		representation: z.string().min(1).optional(),
		status: z.string().optional(),
		draft: z.boolean().optional(),
		documenttype: z.string().nullable().optional(),
		self_billed: z.boolean().optional(),
		sequence_flat: z.string().max(10).optional(),
		reference: z.string().max(150).optional(),
		date: z.string().optional(),
		due_days: z.number().int().min(0).max(2147483647).nullable().optional(),
		branch: z.string().nullable().optional(),
		supplier: z.string(),
		supplier_display_name: z.string().max(203).optional(),
		supplier_profession: z.string().max(100).optional(),
		supplier_vat_number: z.string().max(20).optional(),
		billing_address: v12Def_BillingAddress.optional(),
		shipping_address: v12Def_ShippingAddress.optional(),
		supplier_contact_person: z.string().max(101).optional(),
		supplier_phone_number: z.string().max(30).optional(),
		supplier_email: z.string().max(100).optional(),
		loading_address: v12Def_LoadingAddress.optional(),
		dispatch_date: z.string().nullable().optional(),
		dispatch_time: z.string().nullable().optional(),
		vehicle_number: z.string().max(150).optional(),
		move_purpose: z.number().int().nullable().optional(),
		related_entities: z
			.array(v12Def_PurchaseRelatedEntities)
			.nullable()
			.optional(),
		packages: z.array(v12Def_PurchasePackageNested).nullable().optional(),
		related_documents: z.array(z.string()).optional(),
		delivery_notes: z.array(z.string()).optional(),
		currency_code: z.string().optional(),
		exchange_rate: z.string().optional(),
		calculator_mode: z.string().optional(),
		items: z.array(v12Def_V12PurchaseItemNestedCreate),
		initial: z.string().optional(),
		net: z.string().optional(),
		taxes: z.array(v12Def_PurchaseStandardTaxNested).optional(),
		total: z.string().optional(),
		withholding_taxes: z.array(v12Def_PurchaseWithholdingTaxNested).optional(),
		payable: z.string().optional(),
		paid: z.string().optional(),
		template: z.string().nullable().optional(),
		public_notes: z.string().optional(),
		trackingcategories: z.array(v12Def_RecordTrackingCategoryNested).optional(),
		permalink: z.string().nullable().optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_PUV12PurchaseCreate = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		representation: z.string().min(1).optional(),
		status: z.string().optional(),
		draft: z.boolean().optional(),
		documenttype: z.string().nullable().optional(),
		self_billed: z.boolean().optional(),
		sequence_flat: z.string().max(10).optional(),
		reference: z.string().max(150).optional(),
		date: z.string().optional(),
		due_days: z.number().int().min(0).max(2147483647).nullable().optional(),
		branch: z.string().nullable().optional(),
		supplier: z.string().optional(),
		supplier_display_name: z.string().max(203).optional(),
		supplier_profession: z.string().max(100).optional(),
		supplier_vat_number: z.string().max(20).optional(),
		billing_address: v12Def_BillingAddress.optional(),
		shipping_address: v12Def_ShippingAddress.optional(),
		supplier_contact_person: z.string().max(101).optional(),
		supplier_phone_number: z.string().max(30).optional(),
		supplier_email: z.string().max(100).optional(),
		loading_address: v12Def_LoadingAddress.optional(),
		dispatch_date: z.string().nullable().optional(),
		dispatch_time: z.string().nullable().optional(),
		vehicle_number: z.string().max(150).optional(),
		move_purpose: z.number().int().nullable().optional(),
		related_entities: z
			.array(v12Def_PurchaseRelatedEntities)
			.nullable()
			.optional(),
		packages: z.array(v12Def_PurchasePackageNested).nullable().optional(),
		related_documents: z.array(z.string()).optional(),
		delivery_notes: z.array(z.string()).optional(),
		currency_code: z.string().optional(),
		exchange_rate: z.string().optional(),
		calculator_mode: z.string().optional(),
		items: z.array(v12Def_V12PurchaseItemNestedCreate).optional(),
		initial: z.string().optional(),
		net: z.string().optional(),
		taxes: z.array(v12Def_PurchaseStandardTaxNested).optional(),
		total: z.string().optional(),
		withholding_taxes: z.array(v12Def_PurchaseWithholdingTaxNested).optional(),
		payable: z.string().optional(),
		paid: z.string().optional(),
		template: z.string().nullable().optional(),
		public_notes: z.string().optional(),
		trackingcategories: z.array(v12Def_RecordTrackingCategoryNested).optional(),
		permalink: z.string().nullable().optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_V12PurchaseItemNestedRetrieveUpdate = z
	.object({
		id: z.string().min(1).optional(),
		product: z.string().nullable().optional(),
		description: z.string().optional(),
		quantity: z.string().optional(),
		unit_measure: z.string().nullable().optional(),
		unit_value: z.string().optional(),
		unit_value_gross: z.string().optional(),
		unit_discount: z.string().optional(),
		unit_discount_gross: z.string().optional(),
		unit_discount_percentage: z.string().optional(),
		unit_discount_mode: z.string().optional(),
		taxes: z.array(v12Def_PurchaseItemTaxNested).optional(),
		unit_total: z.string().optional(),
		item_net: z.string().optional(),
		project: z.string().nullable().optional(),
		billable: z.boolean().optional(),
		expense_category: z.string().nullable().optional(),
		taric_code: z.string().min(10).max(10).optional(),
		warehouse: z.string().nullable().optional(),
		line_type: z.number().int().nullable().optional(),
		skip_stock_update: z.boolean().optional(),
	})
	.strict();
const v12Def_PUV12PurchaseRetrieve = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		representation: z.string().min(1).optional(),
		status: z.string().optional(),
		draft: z.boolean().optional(),
		documenttype: z.string().nullable().optional(),
		self_billed: z.boolean().optional(),
		sequence_flat: z.string().max(10).optional(),
		reference: z.string().max(150).optional(),
		date: z.string().optional(),
		due_days: z.number().int().min(0).max(2147483647).nullable().optional(),
		branch: z.string().nullable().optional(),
		supplier: z.string().optional(),
		supplier_display_name: z.string().max(203).optional(),
		supplier_profession: z.string().max(100).optional(),
		supplier_vat_number: z.string().max(20).optional(),
		billing_address: v12Def_BillingAddress.optional(),
		shipping_address: v12Def_ShippingAddress.optional(),
		supplier_contact_person: z.string().max(101).optional(),
		supplier_phone_number: z.string().max(30).optional(),
		supplier_email: z.string().max(100).optional(),
		loading_address: v12Def_LoadingAddress.optional(),
		dispatch_date: z.string().nullable().optional(),
		dispatch_time: z.string().nullable().optional(),
		vehicle_number: z.string().max(150).optional(),
		move_purpose: z.number().int().nullable().optional(),
		related_entities: z
			.array(v12Def_PurchaseRelatedEntities)
			.nullable()
			.optional(),
		packages: z.array(v12Def_PurchasePackageNested).nullable().optional(),
		related_documents: z.array(z.string()).optional(),
		delivery_notes: z.array(z.string()).optional(),
		currency_code: z.string().optional(),
		exchange_rate: z.string().optional(),
		calculator_mode: z.string().optional(),
		items: z.array(v12Def_V12PurchaseItemNestedRetrieveUpdate).optional(),
		initial: z.string().optional(),
		net: z.string().optional(),
		taxes: z.array(v12Def_PurchaseStandardTaxNested).optional(),
		total: z.string().optional(),
		withholding_taxes: z.array(v12Def_PurchaseWithholdingTaxNested).optional(),
		payable: z.string().optional(),
		paid: z.string().optional(),
		template: z.string().nullable().optional(),
		public_notes: z.string().optional(),
		trackingcategories: z.array(v12Def_RecordTrackingCategoryNested).optional(),
		permalink: z.string().nullable().optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_V12PurchaseUpdate = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		representation: z.string().min(1).optional(),
		status: z.string().optional(),
		draft: z.boolean().optional(),
		documenttype: z.string().nullable().optional(),
		self_billed: z.boolean().optional(),
		sequence_flat: z.string().max(10).optional(),
		reference: z.string().max(150).optional(),
		date: z.string().optional(),
		due_days: z.number().int().min(0).max(2147483647).nullable().optional(),
		branch: z.string().nullable().optional(),
		supplier: z.string(),
		supplier_display_name: z.string().max(203).optional(),
		supplier_profession: z.string().max(100).optional(),
		supplier_vat_number: z.string().max(20).optional(),
		billing_address: v12Def_BillingAddress.optional(),
		shipping_address: v12Def_ShippingAddress.optional(),
		supplier_contact_person: z.string().max(101).optional(),
		supplier_phone_number: z.string().max(30).optional(),
		supplier_email: z.string().max(100).optional(),
		loading_address: v12Def_LoadingAddress.optional(),
		dispatch_date: z.string().nullable().optional(),
		dispatch_time: z.string().nullable().optional(),
		vehicle_number: z.string().max(150).optional(),
		move_purpose: z.number().int().nullable().optional(),
		related_entities: z
			.array(v12Def_PurchaseRelatedEntities)
			.nullable()
			.optional(),
		packages: z.array(v12Def_PurchasePackageNested).nullable().optional(),
		related_documents: z.array(z.string()).optional(),
		delivery_notes: z.array(z.string()).optional(),
		currency_code: z.string().optional(),
		exchange_rate: z.string().optional(),
		calculator_mode: z.string().optional(),
		items: z.array(v12Def_V12PurchaseItemNestedRetrieveUpdate),
		initial: z.string().optional(),
		net: z.string().optional(),
		taxes: z.array(v12Def_PurchaseStandardTaxNested).optional(),
		total: z.string().optional(),
		withholding_taxes: z.array(v12Def_PurchaseWithholdingTaxNested).optional(),
		payable: z.string().optional(),
		paid: z.string().optional(),
		template: z.string().nullable().optional(),
		public_notes: z.string().optional(),
		trackingcategories: z.array(v12Def_RecordTrackingCategoryNested).optional(),
		permalink: z.string().nullable().optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_PUV12PurchaseUpdate = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		representation: z.string().min(1).optional(),
		status: z.string().optional(),
		draft: z.boolean().optional(),
		documenttype: z.string().nullable().optional(),
		self_billed: z.boolean().optional(),
		sequence_flat: z.string().max(10).optional(),
		reference: z.string().max(150).optional(),
		date: z.string().optional(),
		due_days: z.number().int().min(0).max(2147483647).nullable().optional(),
		branch: z.string().nullable().optional(),
		supplier: z.string().optional(),
		supplier_display_name: z.string().max(203).optional(),
		supplier_profession: z.string().max(100).optional(),
		supplier_vat_number: z.string().max(20).optional(),
		billing_address: v12Def_BillingAddress.optional(),
		shipping_address: v12Def_ShippingAddress.optional(),
		supplier_contact_person: z.string().max(101).optional(),
		supplier_phone_number: z.string().max(30).optional(),
		supplier_email: z.string().max(100).optional(),
		loading_address: v12Def_LoadingAddress.optional(),
		dispatch_date: z.string().nullable().optional(),
		dispatch_time: z.string().nullable().optional(),
		vehicle_number: z.string().max(150).optional(),
		move_purpose: z.number().int().nullable().optional(),
		related_entities: z
			.array(v12Def_PurchaseRelatedEntities)
			.nullable()
			.optional(),
		packages: z.array(v12Def_PurchasePackageNested).nullable().optional(),
		related_documents: z.array(z.string()).optional(),
		delivery_notes: z.array(z.string()).optional(),
		currency_code: z.string().optional(),
		exchange_rate: z.string().optional(),
		calculator_mode: z.string().optional(),
		items: z.array(v12Def_V12PurchaseItemNestedRetrieveUpdate).optional(),
		initial: z.string().optional(),
		net: z.string().optional(),
		taxes: z.array(v12Def_PurchaseStandardTaxNested).optional(),
		total: z.string().optional(),
		withholding_taxes: z.array(v12Def_PurchaseWithholdingTaxNested).optional(),
		payable: z.string().optional(),
		paid: z.string().optional(),
		template: z.string().nullable().optional(),
		public_notes: z.string().optional(),
		trackingcategories: z.array(v12Def_RecordTrackingCategoryNested).optional(),
		permalink: z.string().nullable().optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_PUV12PurchasePartialUpdate = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		representation: z.string().min(1).optional(),
		status: z.string().optional(),
		draft: z.boolean().optional(),
		exchange_rate: z.string().optional(),
		trackingcategories: z.array(v12Def_RecordTrackingCategoryNested).optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_PrivatePurchaseEmailFromTemplate = z
	.object({
		to: z.string().min(1),
		store_to: z.boolean().optional(),
		cc: z.array(z.string().min(1)).optional(),
		bcc: z.array(z.string().min(1)).optional(),
		reply_to: z.string().optional(),
		attach_pdf: z.boolean().optional(),
		attachments: z.array(z.string()).optional(),
	})
	.strict();
const v12Def_TrackedEmailMessage = z
	.object({
		id: z.string().min(1).optional(),
		from_email: z.string().min(1).max(255),
		to: z.string().min(1).max(255),
		cc: z.string().optional(),
		bcc: z.string().optional(),
		reply_to: z.string().min(1).max(255),
		subject: z.string().min(1).max(255),
		message: z.string().optional(),
		attachments: z.string().optional(),
		attach_pdf: z.boolean().optional(),
		status: z.string().optional(),
		status_updated: z.string().nullable().optional(),
		sent_via_smtp: z.boolean().optional(),
		smtp_error: z.string(),
		smtp_error_code: z
			.number()
			.int()
			.min(-32768)
			.max(32767)
			.nullable()
			.optional(),
		metadata: z.record(z.string(), z.string()).optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_PUEmailRetrieveSerializer = z
	.object({
		to: z.string().min(1).optional(),
		cc: z.string().optional(),
		bcc: z.string().optional(),
		reply_to: z.string().min(1).optional(),
		subject: z.string().min(1).max(255).optional(),
		message: z.string().min(1).optional(),
		sender_name: z.string().min(1).max(70).optional(),
	})
	.strict();
const v12Def_PrivatePurchaseEmail = z
	.object({
		to: z.string().min(1),
		store_to: z.boolean().optional(),
		cc: z.array(z.string().min(1)),
		bcc: z.array(z.string().min(1)),
		reply_to: z.string().optional(),
		subject: z.string().min(1).max(255),
		message: z.string().min(1),
		attach_pdf: z.boolean(),
		sender_name: z.string().min(1).max(70).optional(),
		attachments: z.array(z.string()).optional(),
	})
	.strict();
const v12Def_VoidDocument = z
	.object({
		void: z.boolean().optional(),
	})
	.strict();
const v12Def_PUPurchaseMarkVoidResponse = z
	.object({
		status: z.string().optional(),
	})
	.strict();
const v12Def_PUV12PurchaseAttachmentListRetrieve = z
	.object({
		id: z.string().min(1).optional(),
		title: z.string().min(1).max(120).optional(),
		primary: z.boolean().optional(),
		file_url: z.string().optional(),
		file_size: z.string().optional(),
		created: z.string().optional(),
	})
	.strict();
const v12Def_ApiDocumentationAttachmentListRetrieve = z
	.object({
		id: z.string().min(1).optional(),
		title: z.string().min(1).max(120),
		file_url: z.string().optional(),
		file_size: z.string().optional(),
		created: z.string().optional(),
	})
	.strict();
const v12Def_PUV12NoteSerializer = z
	.object({
		id: z.string().min(1).optional(),
		notes: z.string().min(1).optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_V12Note = z
	.object({
		id: z.string().min(1).optional(),
		notes: z.string().min(1),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_PUTrackedEmailMessageSerializer = z
	.object({
		id: z.string().min(1).optional(),
		from_email: z.string().min(1).max(255).optional(),
		to: z.string().min(1).max(255).optional(),
		cc: z.string().optional(),
		bcc: z.string().optional(),
		reply_to: z.string().min(1).max(255).optional(),
		subject: z.string().min(1).max(255).optional(),
		message: z.string().optional(),
		attachments: z.string().optional(),
		attach_pdf: z.boolean().optional(),
		status: z.string().optional(),
		status_updated: z.string().nullable().optional(),
		sent_via_smtp: z.boolean().optional(),
		smtp_error: z.string().optional(),
		smtp_error_code: z
			.number()
			.int()
			.min(-32768)
			.max(32767)
			.nullable()
			.optional(),
		metadata: z.record(z.string(), z.string()).optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_PurchaseCashPaymentNested = z
	.object({
		purchase: z.string(),
		amount: z.string(),
	})
	.strict();
const v12Def_CreditNoteCashPaymentNested = z
	.object({
		creditnote: z.string(),
		amount: z.string(),
	})
	.strict();
const v12Def_PUV12CashPaymentList = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		transaction_type: z.string().optional(),
		title: z.string().max(255).optional(),
		amount: z.string().optional(),
		exchange_rate: z.string().optional(),
		currency_code: z.string().optional(),
		date: z.string().optional(),
		branch: z.string().nullable().optional(),
		contact: z.string().optional(),
		purchase_payments: z.array(v12Def_PurchaseCashPaymentNested).optional(),
		creditnote_payments: z.array(v12Def_CreditNoteCashPaymentNested).optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_V12CashPaymentCreate = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		transaction_type: z.string(),
		title: z.string().max(255).optional(),
		amount: z.string(),
		exchange_rate: z.string().optional(),
		currency_code: z.string().optional(),
		date: z.string().optional(),
		branch: z.string().nullable().optional(),
		contact: z.string(),
		purchase_payments: z.array(v12Def_PurchaseCashPaymentNested).optional(),
		creditnote_payments: z.array(v12Def_CreditNoteCashPaymentNested).optional(),
		trackingcategories: z.array(v12Def_RecordTrackingCategoryNested).optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_PUV12CashPaymentCreate = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		transaction_type: z.string().optional(),
		title: z.string().max(255).optional(),
		amount: z.string().optional(),
		exchange_rate: z.string().optional(),
		currency_code: z.string().optional(),
		date: z.string().optional(),
		branch: z.string().nullable().optional(),
		contact: z.string().optional(),
		purchase_payments: z.array(v12Def_PurchaseCashPaymentNested).optional(),
		creditnote_payments: z.array(v12Def_CreditNoteCashPaymentNested).optional(),
		trackingcategories: z.array(v12Def_RecordTrackingCategoryNested).optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_PUV12CashPaymentRetrieve = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		transaction_type: z.string().optional(),
		title: z.string().max(255).optional(),
		amount: z.string().optional(),
		exchange_rate: z.string().optional(),
		currency_code: z.string().optional(),
		date: z.string().optional(),
		branch: z.string().nullable().optional(),
		contact: z.string().optional(),
		purchase_payments: z.array(v12Def_PurchaseCashPaymentNested).optional(),
		creditnote_payments: z.array(v12Def_CreditNoteCashPaymentNested).optional(),
		trackingcategories: z.array(v12Def_RecordTrackingCategoryNested).optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_V12CashPaymentUpdate = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		transaction_type: z.string().optional(),
		title: z.string().max(255).optional(),
		amount: z.string().optional(),
		exchange_rate: z.string().optional(),
		currency_code: z.string().optional(),
		date: z.string().optional(),
		branch: z.string().nullable().optional(),
		contact: z.string().optional(),
		purchase_payments: z.array(v12Def_PurchaseCashPaymentNested).optional(),
		creditnote_payments: z.array(v12Def_CreditNoteCashPaymentNested).optional(),
		trackingcategories: z.array(v12Def_RecordTrackingCategoryNested).optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_PUV12CashPaymentUpdate = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		transaction_type: z.string().optional(),
		title: z.string().max(255).optional(),
		amount: z.string().optional(),
		exchange_rate: z.string().optional(),
		currency_code: z.string().optional(),
		date: z.string().optional(),
		branch: z.string().nullable().optional(),
		contact: z.string().optional(),
		purchase_payments: z.array(v12Def_PurchaseCashPaymentNested).optional(),
		creditnote_payments: z.array(v12Def_CreditNoteCashPaymentNested).optional(),
		trackingcategories: z.array(v12Def_RecordTrackingCategoryNested).optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_PUV12CashPaymentAttachmentListRetrieve = z
	.object({
		id: z.string().min(1).optional(),
		title: z.string().min(1).max(120).optional(),
		file_url: z.string().optional(),
		file_size: z.string().optional(),
		created: z.string().optional(),
	})
	.strict();
const v12Def_InvoiceCashReceiptNested = z
	.object({
		invoice: z.string(),
		amount: z.string(),
	})
	.strict();
const v12Def_PurchaseCreditNoteCashReceiptNested = z
	.object({
		purchasecreditnote: z.string(),
		amount: z.string(),
	})
	.strict();
const v12Def_PUV12CashReceiptList = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		transaction_type: z.string().optional(),
		income_type: z.string().optional(),
		title: z.string().max(255).optional(),
		date: z.string().optional(),
		branch: z.string().nullable().optional(),
		contact: z.string().optional(),
		currency_code: z.string().optional(),
		exchange_rate: z.string().optional(),
		amount: z.string().optional(),
		invoice_payments: z.array(v12Def_InvoiceCashReceiptNested).optional(),
		purchasecreditnote_payments: z
			.array(v12Def_PurchaseCreditNoteCashReceiptNested)
			.optional(),
		status: z.string().optional(),
		payment_gateway: z.string().nullable().optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_V12CashReceiptCreate = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		transaction_type: z.string(),
		income_type: z.string().optional(),
		title: z.string().max(255).optional(),
		date: z.string().optional(),
		branch: z.string().nullable().optional(),
		contact: z.string(),
		currency_code: z.string().optional(),
		exchange_rate: z.string().optional(),
		calculator_mode: z.string().optional(),
		net: z.string().optional(),
		taxes: z.array(z.string()).optional(),
		amount: z.string(),
		status: z.string().optional(),
		invoice_payments: z.array(v12Def_InvoiceCashReceiptNested).optional(),
		purchasecreditnote_payments: z
			.array(v12Def_PurchaseCreditNoteCashReceiptNested)
			.optional(),
		trackingcategories: z.array(v12Def_RecordTrackingCategoryNested).optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_PUV12CashReceiptCreate = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		transaction_type: z.string().optional(),
		income_type: z.string().optional(),
		title: z.string().max(255).optional(),
		date: z.string().optional(),
		branch: z.string().nullable().optional(),
		contact: z.string().optional(),
		currency_code: z.string().optional(),
		exchange_rate: z.string().optional(),
		calculator_mode: z.string().optional(),
		net: z.string().optional(),
		taxes: z.array(z.string()).optional(),
		amount: z.string().optional(),
		status: z.string().optional(),
		invoice_payments: z.array(v12Def_InvoiceCashReceiptNested).optional(),
		purchasecreditnote_payments: z
			.array(v12Def_PurchaseCreditNoteCashReceiptNested)
			.optional(),
		trackingcategories: z.array(v12Def_RecordTrackingCategoryNested).optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_V12CashReceiptCashedTaxNested = z
	.object({
		tax: z.string(),
		amount: z.string().optional(),
	})
	.strict();
const v12Def_PUV12CashReceiptRetrieve = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		transaction_type: z.string().optional(),
		income_type: z.string().optional(),
		title: z.string().max(255).optional(),
		date: z.string().optional(),
		branch: z.string().nullable().optional(),
		contact: z.string().optional(),
		currency_code: z.string().optional(),
		exchange_rate: z.string().optional(),
		net: z.string().nullable().optional(),
		taxes: z.array(v12Def_V12CashReceiptCashedTaxNested).optional(),
		amount: z.string().optional(),
		invoice_payments: z.array(v12Def_InvoiceCashReceiptNested).optional(),
		purchasecreditnote_payments: z
			.array(v12Def_PurchaseCreditNoteCashReceiptNested)
			.optional(),
		status: z.string().optional(),
		payment_gateway: z.string().nullable().optional(),
		trackingcategories: z.array(v12Def_RecordTrackingCategoryNested).optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_V12CashReceiptUpdate = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		transaction_type: z.string().optional(),
		income_type: z.string().optional(),
		title: z.string().max(255).optional(),
		date: z.string().optional(),
		branch: z.string().nullable().optional(),
		contact: z.string(),
		currency_code: z.string().optional(),
		exchange_rate: z.string().optional(),
		calculator_mode: z.string().optional(),
		net: z.string().optional(),
		taxes: z.array(z.string()).optional(),
		amount: z.string().optional(),
		invoice_payments: z.array(v12Def_InvoiceCashReceiptNested).optional(),
		purchasecreditnote_payments: z
			.array(v12Def_PurchaseCreditNoteCashReceiptNested)
			.optional(),
		trackingcategories: z.array(v12Def_RecordTrackingCategoryNested).optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_PUV12CashReceiptUpdate = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		transaction_type: z.string().optional(),
		income_type: z.string().optional(),
		title: z.string().max(255).optional(),
		date: z.string().optional(),
		branch: z.string().nullable().optional(),
		contact: z.string().optional(),
		currency_code: z.string().optional(),
		exchange_rate: z.string().optional(),
		calculator_mode: z.string().optional(),
		net: z.string().optional(),
		taxes: z.array(z.string()).optional(),
		amount: z.string().optional(),
		invoice_payments: z.array(v12Def_InvoiceCashReceiptNested).optional(),
		purchasecreditnote_payments: z
			.array(v12Def_PurchaseCreditNoteCashReceiptNested)
			.optional(),
		trackingcategories: z.array(v12Def_RecordTrackingCategoryNested).optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_PUV12CashReceiptAttachmentListRetrieve = z
	.object({
		id: z.string().min(1).optional(),
		title: z.string().min(1).max(120).optional(),
		file_url: z.string().optional(),
		file_size: z.string().optional(),
		created: z.string().optional(),
	})
	.strict();
const v12Def_V12AddressNested = z
	.object({
		id: z.string().min(1).optional(),
		address: z.string().min(1).max(200),
		city: z.string().min(1).max(100),
		state: z.string().max(100).optional(),
		zip: z.string().min(1).max(20),
		country: z.string(),
		ad_type: z.string().optional(),
		branch_code: z
			.number()
			.int()
			.min(-2147483648)
			.max(2147483647)
			.nullable()
			.optional(),
	})
	.strict();
const v12Def_V12EmailNested = z
	.object({
		id: z.string().min(1).optional(),
		email: z.string().min(1).max(100),
		primary: z.boolean(),
	})
	.strict();
const v12Def_V12PhoneNested = z
	.object({
		id: z.string().min(1).optional(),
		number: z.string().min(1).max(30),
		primary: z.boolean(),
	})
	.strict();
const v12Def_PUV12ContactList = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		active: z.boolean().optional(),
		first_name: z.string().max(50).optional(),
		last_name: z.string().max(50).optional(),
		company: z.string().max(100).optional(),
		display_name: z.string().min(1).optional(),
		profession: z.string().max(100).optional(),
		vat_number: z.string().max(20).optional(),
		is_client: z.boolean().optional(),
		is_supplier: z.boolean().optional(),
		default_language: z.string().optional(),
		default_template: z.string().min(1).optional(),
		default_taxes: z.array(z.string()).optional(),
		default_currency_code: z.string().optional(),
		addresses: z.array(v12Def_V12AddressNested).optional(),
		email: z.array(v12Def_V12EmailNested).optional(),
		phones: z.array(v12Def_V12PhoneNested).optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_V12ContactRetrieveCreateUpdate = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		active: z.boolean().optional(),
		first_name: z.string().max(50).optional(),
		last_name: z.string().max(50).optional(),
		company: z.string().max(100).optional(),
		display_name: z.string().min(1).optional(),
		profession: z.string().max(100).optional(),
		vat_number: z.string().max(20).optional(),
		is_client: z.boolean().optional(),
		is_supplier: z.boolean().optional(),
		default_language: z.string().optional(),
		default_template: z.string().min(1).optional(),
		default_taxes: z.array(z.string()).optional(),
		default_currency_code: z.string().optional(),
		addresses: z.array(v12Def_V12AddressNested).optional(),
		email: z.array(v12Def_V12EmailNested).optional(),
		phones: z.array(v12Def_V12PhoneNested).optional(),
		trackingcategories: z.array(v12Def_RecordTrackingCategoryNested).optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_PUV12ContactRetrieveCreateUpdate = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		active: z.boolean().optional(),
		first_name: z.string().max(50).optional(),
		last_name: z.string().max(50).optional(),
		company: z.string().max(100).optional(),
		display_name: z.string().min(1).optional(),
		profession: z.string().max(100).optional(),
		vat_number: z.string().max(20).optional(),
		is_client: z.boolean().optional(),
		is_supplier: z.boolean().optional(),
		default_language: z.string().optional(),
		default_template: z.string().min(1).optional(),
		default_taxes: z.array(z.string()).optional(),
		default_currency_code: z.string().optional(),
		addresses: z.array(v12Def_V12AddressNested).optional(),
		email: z.array(v12Def_V12EmailNested).optional(),
		phones: z.array(v12Def_V12PhoneNested).optional(),
		trackingcategories: z.array(v12Def_RecordTrackingCategoryNested).optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_PUV12ContactAttachmentListRetrieve = z
	.object({
		id: z.string().min(1).optional(),
		title: z.string().min(1).max(120).optional(),
		file_url: z.string().optional(),
		file_size: z.string().optional(),
		created: z.string().optional(),
	})
	.strict();
const v12Def_PUV12CreditNoteList = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		representation: z.string().min(1).optional(),
		status: z.string().optional(),
		draft: z.boolean().optional(),
		documenttype: z.string().optional(),
		sequence_flat: z.string().max(10).optional(),
		number: z.string().max(100).optional(),
		date: z.string().optional(),
		branch: z.string().nullable().optional(),
		client: z.string().optional(),
		client_display_name: z.string().min(1).max(203).optional(),
		client_profession: z.string().max(100).optional(),
		client_vat_number: z.string().max(20).optional(),
		billing_address: v12Def_BillingAddress.optional(),
		shipping_address: v12Def_ShippingAddress.optional(),
		client_contact_person: z.string().max(101).optional(),
		client_phone_number: z.string().max(30).optional(),
		client_email: z.string().max(100).optional(),
		loading_address: v12Def_LoadingAddress.optional(),
		dispatch_date: z.string().nullable().optional(),
		dispatch_time: z.string().nullable().optional(),
		vehicle_number: z.string().max(150).optional(),
		move_purpose: z.number().int().nullable().optional(),
		currency_code: z.string().optional(),
		exchange_rate: z.string().optional(),
		calculator_mode: z.string().optional(),
		initial: z.string().optional(),
		net: z.string().optional(),
		total: z.string().optional(),
		payable: z.string().optional(),
		paid: z.string().optional(),
		permalink: z.string().min(1).optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_CreditNoteRelatedEntities = z
	.object({
		id: z.string().min(1).optional(),
		contact: z.string(),
		contact_display_name: z.string().min(1).max(203),
		contact_vat_number: z.string().max(20).optional(),
		type: z.number().int(),
		billing_address: v12Def_BillingAddress.optional(),
	})
	.strict();
const v12Def_CreditNotePackageNested = z
	.object({
		id: z.string().min(1).optional(),
		packaging_type: z.number().int(),
		quantity: z.number().int().min(1).max(32767),
		other_packaging_type_title: z.string().max(150).optional(),
	})
	.strict();
const v12Def_CreditNoteItemTaxNested = z
	.object({
		tax: z.string(),
		auto_calculate: z.boolean().optional(),
		amount: z.string().optional(),
		vat_amount: z.string().optional(),
		auto_calculate_vat: z.boolean().optional(),
	})
	.strict();
const v12Def_V12CreditNoteItemNestedCreate = z
	.object({
		id: z.string().min(1).optional(),
		product: z.string().nullable().optional(),
		title: z.string().min(1).max(200).optional(),
		description: z.string().optional(),
		quantity: z.string().optional(),
		unit_measure: z.string().nullable().optional(),
		unit_value: z.string().optional(),
		unit_value_gross: z.string().optional(),
		unit_discount: z.string().optional(),
		unit_discount_gross: z.string().optional(),
		unit_discount_percentage: z.string().optional(),
		unit_discount_mode: z.string().optional(),
		taxes: z.array(v12Def_CreditNoteItemTaxNested).optional(),
		unit_total: z.string().optional(),
		item_net: z.string().optional(),
		project: z.string().nullable().optional(),
		taric_code: z.string().min(10).max(10).optional(),
		warehouse: z.string().nullable().optional(),
		line_type: z.number().int().nullable().optional(),
		skip_stock_update: z.boolean().optional(),
	})
	.strict();
const v12Def_CreditNoteStandardTaxNested = z
	.object({
		tax: z.string(),
		auto_calculate: z.boolean().optional(),
		amount: z.string().optional(),
	})
	.strict();
const v12Def_CreditNoteWithholdingTaxNested = z
	.object({
		tax: z.string(),
		amount: z.string().optional(),
		subtotal: z.number().int().optional(),
		auto_calculate: z.boolean().optional(),
	})
	.strict();
const v12Def_V12CreditNoteCreate = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		representation: z.string().min(1).optional(),
		status: z.string().optional(),
		draft: z.boolean().optional(),
		documenttype: z.string().optional(),
		sequence_flat: z.string().max(10).optional(),
		number: z.string().max(100).optional(),
		date: z.string(),
		branch: z.string().nullable().optional(),
		client: z.string(),
		client_display_name: z.string().min(1).max(203).optional(),
		client_profession: z.string().max(100).optional(),
		client_vat_number: z.string().max(20).optional(),
		billing_address: v12Def_BillingAddress.optional(),
		shipping_address: v12Def_ShippingAddress.optional(),
		client_contact_person: z.string().max(101).optional(),
		client_phone_number: z.string().max(30).optional(),
		client_email: z.string().max(100).optional(),
		loading_address: v12Def_LoadingAddress.optional(),
		dispatch_date: z.string().nullable().optional(),
		dispatch_time: z.string().nullable().optional(),
		vehicle_number: z.string().max(150).optional(),
		move_purpose: z.number().int().nullable().optional(),
		related_entities: z
			.array(v12Def_CreditNoteRelatedEntities)
			.nullable()
			.optional(),
		packages: z.array(v12Def_CreditNotePackageNested).nullable().optional(),
		currency_code: z.string().optional(),
		exchange_rate: z.string().optional(),
		calculator_mode: z.string().optional(),
		items: z.array(v12Def_V12CreditNoteItemNestedCreate),
		initial: z.string().optional(),
		net: z.string().optional(),
		taxes: z.array(v12Def_CreditNoteStandardTaxNested).optional(),
		total: z.string().optional(),
		withholding_taxes: z
			.array(v12Def_CreditNoteWithholdingTaxNested)
			.optional(),
		paid: z.string().optional(),
		payable: z.string().optional(),
		template: z.string().optional(),
		terms: z.string().optional(),
		public_notes: z.string().optional(),
		related_documents: z.array(z.string()).optional(),
		trackingcategories: z.array(v12Def_RecordTrackingCategoryNested).optional(),
		permalink: z.string().min(1).optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_PUV12CreditNoteCreate = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		representation: z.string().min(1).optional(),
		status: z.string().optional(),
		draft: z.boolean().optional(),
		documenttype: z.string().optional(),
		sequence_flat: z.string().max(10).optional(),
		number: z.string().max(100).optional(),
		date: z.string().optional(),
		branch: z.string().nullable().optional(),
		client: z.string().optional(),
		client_display_name: z.string().min(1).max(203).optional(),
		client_profession: z.string().max(100).optional(),
		client_vat_number: z.string().max(20).optional(),
		billing_address: v12Def_BillingAddress.optional(),
		shipping_address: v12Def_ShippingAddress.optional(),
		client_contact_person: z.string().max(101).optional(),
		client_phone_number: z.string().max(30).optional(),
		client_email: z.string().max(100).optional(),
		loading_address: v12Def_LoadingAddress.optional(),
		dispatch_date: z.string().nullable().optional(),
		dispatch_time: z.string().nullable().optional(),
		vehicle_number: z.string().max(150).optional(),
		move_purpose: z.number().int().nullable().optional(),
		related_entities: z
			.array(v12Def_CreditNoteRelatedEntities)
			.nullable()
			.optional(),
		packages: z.array(v12Def_CreditNotePackageNested).nullable().optional(),
		currency_code: z.string().optional(),
		exchange_rate: z.string().optional(),
		calculator_mode: z.string().optional(),
		items: z.array(v12Def_V12CreditNoteItemNestedCreate).optional(),
		initial: z.string().optional(),
		net: z.string().optional(),
		taxes: z.array(v12Def_CreditNoteStandardTaxNested).optional(),
		total: z.string().optional(),
		withholding_taxes: z
			.array(v12Def_CreditNoteWithholdingTaxNested)
			.optional(),
		paid: z.string().optional(),
		payable: z.string().optional(),
		template: z.string().optional(),
		terms: z.string().optional(),
		public_notes: z.string().optional(),
		related_documents: z.array(z.string()).optional(),
		trackingcategories: z.array(v12Def_RecordTrackingCategoryNested).optional(),
		permalink: z.string().min(1).optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_V12CreditNoteItemNestedRetrieveUpdate = z
	.object({
		id: z.string().min(1).optional(),
		product: z.string().nullable().optional(),
		title: z.string().min(1).max(200).optional(),
		description: z.string().optional(),
		quantity: z.string().optional(),
		unit_measure: z.string().nullable().optional(),
		unit_value: z.string().optional(),
		unit_value_gross: z.string().optional(),
		unit_discount: z.string().optional(),
		unit_discount_gross: z.string().optional(),
		unit_discount_percentage: z.string().optional(),
		unit_discount_mode: z.string().optional(),
		taxes: z.array(v12Def_CreditNoteItemTaxNested).optional(),
		unit_total: z.string().optional(),
		item_net: z.string().optional(),
		project: z.string().nullable().optional(),
		taric_code: z.string().min(10).max(10).optional(),
		warehouse: z.string().nullable().optional(),
		line_type: z.number().int().nullable().optional(),
		skip_stock_update: z.boolean().optional(),
	})
	.strict();
const v12Def_PUV12CreditNoteRetrieve = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		representation: z.string().min(1).optional(),
		status: z.string().optional(),
		draft: z.boolean().optional(),
		documenttype: z.string().optional(),
		sequence_flat: z.string().max(10).optional(),
		number: z.string().max(100).optional(),
		date: z.string().optional(),
		branch: z.string().nullable().optional(),
		client: z.string().optional(),
		client_display_name: z.string().min(1).max(203).optional(),
		client_profession: z.string().max(100).optional(),
		client_vat_number: z.string().max(20).optional(),
		billing_address: v12Def_BillingAddress.optional(),
		shipping_address: v12Def_ShippingAddress.optional(),
		client_contact_person: z.string().max(101).optional(),
		client_phone_number: z.string().max(30).optional(),
		client_email: z.string().max(100).optional(),
		loading_address: v12Def_LoadingAddress.optional(),
		dispatch_date: z.string().nullable().optional(),
		dispatch_time: z.string().nullable().optional(),
		vehicle_number: z.string().max(150).optional(),
		move_purpose: z.number().int().nullable().optional(),
		related_entities: z
			.array(v12Def_CreditNoteRelatedEntities)
			.nullable()
			.optional(),
		packages: z.array(v12Def_CreditNotePackageNested).nullable().optional(),
		currency_code: z.string().optional(),
		exchange_rate: z.string().optional(),
		calculator_mode: z.string().optional(),
		items: z.array(v12Def_V12CreditNoteItemNestedRetrieveUpdate).optional(),
		initial: z.string().optional(),
		net: z.string().optional(),
		taxes: z.array(v12Def_CreditNoteStandardTaxNested).optional(),
		total: z.string().optional(),
		withholding_taxes: z
			.array(v12Def_CreditNoteWithholdingTaxNested)
			.optional(),
		payable: z.string().optional(),
		paid: z.string().optional(),
		template: z.string().optional(),
		terms: z.string().optional(),
		public_notes: z.string().optional(),
		related_documents: z.array(z.string()).optional(),
		trackingcategories: z.array(v12Def_RecordTrackingCategoryNested).optional(),
		permalink: z.string().min(1).optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_V12CreditNoteUpdate = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		representation: z.string().min(1).optional(),
		status: z.string().optional(),
		draft: z.boolean().optional(),
		documenttype: z.string().optional(),
		sequence_flat: z.string().max(10).optional(),
		number: z.string().max(100).optional(),
		date: z.string().optional(),
		branch: z.string().nullable().optional(),
		client: z.string(),
		client_display_name: z.string().min(1).max(203).optional(),
		client_profession: z.string().max(100).optional(),
		client_vat_number: z.string().max(20).optional(),
		billing_address: v12Def_BillingAddress.optional(),
		shipping_address: v12Def_ShippingAddress.optional(),
		client_contact_person: z.string().max(101).optional(),
		client_phone_number: z.string().max(30).optional(),
		client_email: z.string().max(100).optional(),
		loading_address: v12Def_LoadingAddress.optional(),
		dispatch_date: z.string().nullable().optional(),
		dispatch_time: z.string().nullable().optional(),
		vehicle_number: z.string().max(150).optional(),
		move_purpose: z.number().int().nullable().optional(),
		related_entities: z
			.array(v12Def_CreditNoteRelatedEntities)
			.nullable()
			.optional(),
		packages: z.array(v12Def_CreditNotePackageNested).nullable().optional(),
		currency_code: z.string().optional(),
		exchange_rate: z.string().optional(),
		calculator_mode: z.string().optional(),
		items: z.array(v12Def_V12CreditNoteItemNestedRetrieveUpdate),
		initial: z.string().optional(),
		net: z.string().optional(),
		taxes: z.array(v12Def_CreditNoteStandardTaxNested).optional(),
		total: z.string().optional(),
		withholding_taxes: z
			.array(v12Def_CreditNoteWithholdingTaxNested)
			.optional(),
		payable: z.string().optional(),
		paid: z.string().optional(),
		template: z.string().optional(),
		terms: z.string().optional(),
		public_notes: z.string().optional(),
		related_documents: z.array(z.string()).optional(),
		trackingcategories: z.array(v12Def_RecordTrackingCategoryNested).optional(),
		permalink: z.string().min(1).optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_PUV12CreditNoteUpdate = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		representation: z.string().min(1).optional(),
		status: z.string().optional(),
		draft: z.boolean().optional(),
		documenttype: z.string().optional(),
		sequence_flat: z.string().max(10).optional(),
		number: z.string().max(100).optional(),
		date: z.string().optional(),
		branch: z.string().nullable().optional(),
		client: z.string().optional(),
		client_display_name: z.string().min(1).max(203).optional(),
		client_profession: z.string().max(100).optional(),
		client_vat_number: z.string().max(20).optional(),
		billing_address: v12Def_BillingAddress.optional(),
		shipping_address: v12Def_ShippingAddress.optional(),
		client_contact_person: z.string().max(101).optional(),
		client_phone_number: z.string().max(30).optional(),
		client_email: z.string().max(100).optional(),
		loading_address: v12Def_LoadingAddress.optional(),
		dispatch_date: z.string().nullable().optional(),
		dispatch_time: z.string().nullable().optional(),
		vehicle_number: z.string().max(150).optional(),
		move_purpose: z.number().int().nullable().optional(),
		related_entities: z
			.array(v12Def_CreditNoteRelatedEntities)
			.nullable()
			.optional(),
		packages: z.array(v12Def_CreditNotePackageNested).nullable().optional(),
		currency_code: z.string().optional(),
		exchange_rate: z.string().optional(),
		calculator_mode: z.string().optional(),
		items: z.array(v12Def_V12CreditNoteItemNestedRetrieveUpdate).optional(),
		initial: z.string().optional(),
		net: z.string().optional(),
		taxes: z.array(v12Def_CreditNoteStandardTaxNested).optional(),
		total: z.string().optional(),
		withholding_taxes: z
			.array(v12Def_CreditNoteWithholdingTaxNested)
			.optional(),
		payable: z.string().optional(),
		paid: z.string().optional(),
		template: z.string().optional(),
		terms: z.string().optional(),
		public_notes: z.string().optional(),
		related_documents: z.array(z.string()).optional(),
		trackingcategories: z.array(v12Def_RecordTrackingCategoryNested).optional(),
		permalink: z.string().min(1).optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_PUV12CreditNotePartialUpdate = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		representation: z.string().min(1).optional(),
		status: z.string().optional(),
		draft: z.boolean().optional(),
		exchange_rate: z.string().optional(),
		trackingcategories: z.array(v12Def_RecordTrackingCategoryNested).optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_CreditNoteEmailFromTemplate = z
	.object({
		to: z.string().min(1),
		store_to: z.boolean().optional(),
		cc: z.array(z.string().min(1)).optional(),
		bcc: z.array(z.string().min(1)).optional(),
		reply_to: z.string().optional(),
		attach_pdf: z.boolean().optional(),
		attachments: z.array(z.string()).optional(),
	})
	.strict();
const v12Def_CreditNoteEmail = z
	.object({
		to: z.string().min(1),
		store_to: z.boolean().optional(),
		cc: z.array(z.string().min(1)),
		bcc: z.array(z.string().min(1)),
		reply_to: z.string().optional(),
		subject: z.string().min(1).max(255),
		message: z.string().min(1),
		attach_pdf: z.boolean(),
		sender_name: z.string().min(1).max(70).optional(),
		attachments: z.array(z.string()).optional(),
	})
	.strict();
const v12Def_PUCreditNoteMarkVoidResponse = z
	.object({
		status: z.string().optional(),
	})
	.strict();
const v12Def_PUInvoiceCreditTransactionCNSerializer = z
	.object({
		id: z.string().min(1).optional(),
		representation: z.string().optional(),
		invoice: z.string().optional(),
		amount: z.string().optional(),
		currency_code: z.string().optional(),
		date: z.string().optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_InvoiceCreditTransactionCN = z
	.object({
		id: z.string().min(1).optional(),
		representation: z.string().optional(),
		invoice: z.string(),
		amount: z.string(),
		currency_code: z.string().optional(),
		date: z.string().optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_PUV12CreditNoteAttachmentListRetrieve = z
	.object({
		id: z.string().min(1).optional(),
		title: z.string().min(1).max(120).optional(),
		file_url: z.string().optional(),
		file_size: z.string().optional(),
		created: z.string().optional(),
	})
	.strict();
const v12Def_PUV12DiscussionSerializer = z
	.object({
		id: z.string().min(1).optional(),
		message: z.string().min(1).optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_V12Discussion = z
	.object({
		id: z.string().min(1).optional(),
		message: z.string().min(1),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
		send_email_to_client: z.boolean().optional(),
	})
	.strict();
const v12Def_PUV12DeliveryNoteList = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		representation: z.string().min(1).optional(),
		status: z.string().optional(),
		draft: z.boolean().optional(),
		documenttype: z.string().optional(),
		sequence_flat: z.string().max(10).optional(),
		number: z.string().max(100).optional(),
		date: z.string().optional(),
		is_reverse_delivery_note: z.boolean().optional(),
		reverse_delivery_note_purpose: z.number().int().nullable().optional(),
		branch: z.string().nullable().optional(),
		contact: z.string().nullable().optional(),
		contact_display_name: z.string().max(203).optional(),
		contact_profession: z.string().max(100).optional(),
		contact_vat_number: z.string().max(20).optional(),
		billing_address: v12Def_BillingAddress.optional(),
		shipping_address: v12Def_ShippingAddress.optional(),
		loading_address: v12Def_LoadingAddress.optional(),
		contact_person: z.string().max(101).optional(),
		contact_phone_number: z.string().max(30).optional(),
		contact_email: z.string().max(100).optional(),
		dispatch_date: z.string().nullable().optional(),
		dispatch_time: z.string().nullable().optional(),
		vehicle_number: z.string().max(150).optional(),
		move_purpose: z.number().int().optional(),
		to_weigh: z.boolean().optional(),
		currency_code: z.string().optional(),
		exchange_rate: z.string().optional(),
		calculator_mode: z.string().optional(),
		initial: z.string().optional(),
		net: z.string().optional(),
		total: z.string().optional(),
		permalink: z.string().min(1).optional(),
		converted_invoice: z.string().optional(),
		purchase: z.string().optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_DeliveryNoteItemTaxNested = z
	.object({
		tax: z.string(),
		auto_calculate: z.boolean().optional(),
		amount: z.string().optional(),
		vat_amount: z.string().optional(),
		auto_calculate_vat: z.boolean().optional(),
	})
	.strict();
const v12Def_V12DeliveryNoteItemNestedCreate = z
	.object({
		id: z.string().min(1).optional(),
		product: z.string().nullable().optional(),
		title: z.string().min(1).max(200).optional(),
		description: z.string().optional(),
		quantity: z.string().optional(),
		unit_measure: z.string(),
		unit_value: z.string().optional(),
		unit_value_gross: z.string().optional(),
		unit_discount: z.string().optional(),
		unit_discount_gross: z.string().optional(),
		unit_discount_mode: z.string().optional(),
		unit_discount_percentage: z.string().optional(),
		taxes: z.array(v12Def_DeliveryNoteItemTaxNested).optional(),
		taric_code: z.string().min(10).max(10).optional(),
		unit_total: z.string().optional(),
		item_net: z.string().optional(),
		warehouse: z.string().nullable().optional(),
		skip_stock_update: z.boolean().optional(),
		target_warehouse: z.string().nullable().optional(),
		move_purpose: z.number().int().nullable().optional(),
		other_move_purpose_title: z.string().max(150).optional(),
	})
	.strict();
const v12Def_DeliveryNoteStandardTaxNested = z
	.object({
		tax: z.string(),
		auto_calculate: z.boolean().optional(),
		amount: z.string().optional(),
	})
	.strict();
const v12Def_DeliveryNoteRelatedEntities = z
	.object({
		id: z.string().min(1).optional(),
		contact: z.string(),
		contact_display_name: z.string().min(1).max(203),
		contact_vat_number: z.string().max(20).optional(),
		type: z.number().int(),
		billing_address: v12Def_BillingAddress.optional(),
	})
	.strict();
const v12Def_DeliveryNotePackageNested = z
	.object({
		id: z.string().min(1).optional(),
		packaging_type: z.number().int(),
		quantity: z.number().int().min(1).max(32767),
		other_packaging_type_title: z.string().max(150).optional(),
	})
	.strict();
const v12Def_V12DeliveryNoteCreate = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		representation: z.string().min(1).optional(),
		status: z.string().optional(),
		draft: z.boolean().optional(),
		documenttype: z.string().optional(),
		sequence_flat: z.string().max(10).optional(),
		number: z.string().max(100).optional(),
		date: z.string().optional(),
		intra_transfer: z.boolean().optional(),
		is_reverse_delivery_note: z.boolean().optional(),
		reverse_delivery_note_purpose: z.number().int().nullable().optional(),
		branch: z.string().nullable().optional(),
		contact: z.string().nullable().optional(),
		contact_display_name: z.string().max(203).optional(),
		contact_profession: z.string().max(100).optional(),
		contact_vat_number: z.string().max(20).optional(),
		billing_address: v12Def_BillingAddress.optional(),
		shipping_address: v12Def_ShippingAddress.optional(),
		loading_address: v12Def_LoadingAddress.optional(),
		contact_person: z.string().max(101).optional(),
		contact_phone_number: z.string().max(30).optional(),
		contact_email: z.string().max(100).optional(),
		dispatch_date: z.string().nullable().optional(),
		dispatch_time: z.string().nullable().optional(),
		vehicle_number: z.string().max(150).optional(),
		move_purpose: z.number().int(),
		other_move_purpose_title: z.string().max(150).optional(),
		to_weigh: z.boolean().optional(),
		currency_code: z.string().optional(),
		exchange_rate: z.string().optional(),
		calculator_mode: z.string().optional(),
		items: z.array(v12Def_V12DeliveryNoteItemNestedCreate),
		initial: z.string().optional(),
		net: z.string().optional(),
		taxes: z.array(v12Def_DeliveryNoteStandardTaxNested).optional(),
		total: z.string().optional(),
		template: z.string().nullable().optional(),
		public_notes: z.string().optional(),
		related_entities: z
			.array(v12Def_DeliveryNoteRelatedEntities)
			.nullable()
			.optional(),
		packages: z.array(v12Def_DeliveryNotePackageNested).nullable().optional(),
		permalink: z.string().min(1).optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_PUV12DeliveryNoteCreate = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		representation: z.string().min(1).optional(),
		status: z.string().optional(),
		draft: z.boolean().optional(),
		documenttype: z.string().optional(),
		sequence_flat: z.string().max(10).optional(),
		number: z.string().max(100).optional(),
		date: z.string().optional(),
		intra_transfer: z.boolean().optional(),
		is_reverse_delivery_note: z.boolean().optional(),
		reverse_delivery_note_purpose: z.number().int().nullable().optional(),
		branch: z.string().nullable().optional(),
		contact: z.string().nullable().optional(),
		contact_display_name: z.string().max(203).optional(),
		contact_profession: z.string().max(100).optional(),
		contact_vat_number: z.string().max(20).optional(),
		billing_address: v12Def_BillingAddress.optional(),
		shipping_address: v12Def_ShippingAddress.optional(),
		loading_address: v12Def_LoadingAddress.optional(),
		contact_person: z.string().max(101).optional(),
		contact_phone_number: z.string().max(30).optional(),
		contact_email: z.string().max(100).optional(),
		dispatch_date: z.string().nullable().optional(),
		dispatch_time: z.string().nullable().optional(),
		vehicle_number: z.string().max(150).optional(),
		move_purpose: z.number().int().optional(),
		other_move_purpose_title: z.string().max(150).optional(),
		to_weigh: z.boolean().optional(),
		currency_code: z.string().optional(),
		exchange_rate: z.string().optional(),
		calculator_mode: z.string().optional(),
		items: z.array(v12Def_V12DeliveryNoteItemNestedCreate).optional(),
		initial: z.string().optional(),
		net: z.string().optional(),
		taxes: z.array(v12Def_DeliveryNoteStandardTaxNested).optional(),
		total: z.string().optional(),
		template: z.string().nullable().optional(),
		public_notes: z.string().optional(),
		related_entities: z
			.array(v12Def_DeliveryNoteRelatedEntities)
			.nullable()
			.optional(),
		packages: z.array(v12Def_DeliveryNotePackageNested).nullable().optional(),
		permalink: z.string().min(1).optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_V12DeliveryNoteItemNestedRetrieveUpdate = z
	.object({
		id: z.string().min(1).optional(),
		product: z.string().nullable().optional(),
		title: z.string().min(1).max(200).optional(),
		description: z.string().optional(),
		quantity: z.string().optional(),
		unit_measure: z.string(),
		unit_value: z.string().optional(),
		unit_value_gross: z.string().optional(),
		unit_discount: z.string().optional(),
		unit_discount_gross: z.string().optional(),
		unit_discount_mode: z.string().optional(),
		unit_discount_percentage: z.string().optional(),
		taxes: z.array(v12Def_DeliveryNoteItemTaxNested).optional(),
		taric_code: z.string().min(10).max(10).optional(),
		unit_total: z.string().optional(),
		item_net: z.string().optional(),
		warehouse: z.string().nullable().optional(),
		skip_stock_update: z.boolean().optional(),
		target_warehouse: z.string().nullable().optional(),
		move_purpose: z.number().int().nullable().optional(),
		other_move_purpose_title: z.string().max(150).optional(),
	})
	.strict();
const v12Def_PUV12DeliveryNoteRetrieve = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		representation: z.string().min(1).optional(),
		status: z.string().optional(),
		draft: z.boolean().optional(),
		documenttype: z.string().optional(),
		sequence_flat: z.string().max(10).optional(),
		number: z.string().max(100).optional(),
		date: z.string().optional(),
		intra_transfer: z.boolean().optional(),
		is_reverse_delivery_note: z.boolean().optional(),
		reverse_delivery_note_purpose: z.number().int().nullable().optional(),
		branch: z.string().nullable().optional(),
		contact: z.string().nullable().optional(),
		contact_display_name: z.string().max(203).optional(),
		contact_profession: z.string().max(100).optional(),
		contact_vat_number: z.string().max(20).optional(),
		billing_address: v12Def_BillingAddress.optional(),
		shipping_address: v12Def_ShippingAddress.optional(),
		loading_address: v12Def_LoadingAddress.optional(),
		contact_person: z.string().max(101).optional(),
		contact_phone_number: z.string().max(30).optional(),
		contact_email: z.string().max(100).optional(),
		dispatch_date: z.string().nullable().optional(),
		dispatch_time: z.string().nullable().optional(),
		vehicle_number: z.string().max(150).optional(),
		move_purpose: z.number().int().optional(),
		other_move_purpose_title: z.string().max(150).optional(),
		to_weigh: z.boolean().optional(),
		currency_code: z.string().optional(),
		exchange_rate: z.string().optional(),
		calculator_mode: z.string().optional(),
		items: z.array(v12Def_V12DeliveryNoteItemNestedRetrieveUpdate).optional(),
		initial: z.string().optional(),
		net: z.string().optional(),
		taxes: z.array(v12Def_DeliveryNoteStandardTaxNested).optional(),
		total: z.string().optional(),
		template: z.string().nullable().optional(),
		public_notes: z.string().optional(),
		related_entities: z
			.array(v12Def_DeliveryNoteRelatedEntities)
			.nullable()
			.optional(),
		packages: z.array(v12Def_DeliveryNotePackageNested).nullable().optional(),
		converted_invoice: z.string().optional(),
		purchase: z.string().optional(),
		permalink: z.string().min(1).optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_V12DeliveryNoteUpdate = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		representation: z.string().min(1).optional(),
		status: z.string().optional(),
		draft: z.boolean().optional(),
		documenttype: z.string().optional(),
		sequence_flat: z.string().max(10).optional(),
		number: z.string().max(100).optional(),
		date: z.string().optional(),
		intra_transfer: z.boolean().optional(),
		is_reverse_delivery_note: z.boolean().optional(),
		reverse_delivery_note_purpose: z.number().int().nullable().optional(),
		branch: z.string().nullable().optional(),
		contact: z.string().nullable().optional(),
		contact_display_name: z.string().max(203).optional(),
		contact_profession: z.string().max(100).optional(),
		contact_vat_number: z.string().max(20).optional(),
		billing_address: v12Def_BillingAddress.optional(),
		shipping_address: v12Def_ShippingAddress.optional(),
		loading_address: v12Def_LoadingAddress.optional(),
		contact_person: z.string().max(101).optional(),
		contact_phone_number: z.string().max(30).optional(),
		contact_email: z.string().max(100).optional(),
		dispatch_date: z.string().nullable().optional(),
		dispatch_time: z.string().nullable().optional(),
		vehicle_number: z.string().max(150).optional(),
		move_purpose: z.number().int(),
		other_move_purpose_title: z.string().max(150).optional(),
		to_weigh: z.boolean().optional(),
		currency_code: z.string().optional(),
		exchange_rate: z.string().optional(),
		calculator_mode: z.string().optional(),
		items: z.array(v12Def_V12DeliveryNoteItemNestedRetrieveUpdate),
		initial: z.string().optional(),
		net: z.string().optional(),
		taxes: z.array(v12Def_DeliveryNoteStandardTaxNested).optional(),
		total: z.string().optional(),
		template: z.string().nullable().optional(),
		public_notes: z.string().optional(),
		related_entities: z
			.array(v12Def_DeliveryNoteRelatedEntities)
			.nullable()
			.optional(),
		packages: z.array(v12Def_DeliveryNotePackageNested).nullable().optional(),
		converted_invoice: z.string().optional(),
		purchase: z.string().optional(),
		permalink: z.string().min(1).optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_PUV12DeliveryNoteUpdate = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		representation: z.string().min(1).optional(),
		status: z.string().optional(),
		draft: z.boolean().optional(),
		documenttype: z.string().optional(),
		sequence_flat: z.string().max(10).optional(),
		number: z.string().max(100).optional(),
		date: z.string().optional(),
		intra_transfer: z.boolean().optional(),
		is_reverse_delivery_note: z.boolean().optional(),
		reverse_delivery_note_purpose: z.number().int().nullable().optional(),
		branch: z.string().nullable().optional(),
		contact: z.string().nullable().optional(),
		contact_display_name: z.string().max(203).optional(),
		contact_profession: z.string().max(100).optional(),
		contact_vat_number: z.string().max(20).optional(),
		billing_address: v12Def_BillingAddress.optional(),
		shipping_address: v12Def_ShippingAddress.optional(),
		loading_address: v12Def_LoadingAddress.optional(),
		contact_person: z.string().max(101).optional(),
		contact_phone_number: z.string().max(30).optional(),
		contact_email: z.string().max(100).optional(),
		dispatch_date: z.string().nullable().optional(),
		dispatch_time: z.string().nullable().optional(),
		vehicle_number: z.string().max(150).optional(),
		move_purpose: z.number().int().optional(),
		other_move_purpose_title: z.string().max(150).optional(),
		to_weigh: z.boolean().optional(),
		currency_code: z.string().optional(),
		exchange_rate: z.string().optional(),
		calculator_mode: z.string().optional(),
		items: z.array(v12Def_V12DeliveryNoteItemNestedRetrieveUpdate).optional(),
		initial: z.string().optional(),
		net: z.string().optional(),
		taxes: z.array(v12Def_DeliveryNoteStandardTaxNested).optional(),
		total: z.string().optional(),
		template: z.string().nullable().optional(),
		public_notes: z.string().optional(),
		related_entities: z
			.array(v12Def_DeliveryNoteRelatedEntities)
			.nullable()
			.optional(),
		packages: z.array(v12Def_DeliveryNotePackageNested).nullable().optional(),
		converted_invoice: z.string().optional(),
		purchase: z.string().optional(),
		permalink: z.string().min(1).optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_PUV12DeliveryNotePartialUpdate = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		draft: z.boolean().optional(),
		status: z.string().optional(),
		template: z.string().nullable().optional(),
		representation: z.string().min(1).optional(),
		converted_invoice: z.string().optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_DeliveryNoteEmailFromTemplate = z
	.object({
		to: z.string().min(1),
		store_to: z.boolean().optional(),
		cc: z.array(z.string().min(1)).optional(),
		bcc: z.array(z.string().min(1)).optional(),
		reply_to: z.string().optional(),
		attach_pdf: z.boolean().optional(),
		attachments: z.array(z.string()).optional(),
	})
	.strict();
const v12Def_DeliveryNoteEmail = z
	.object({
		to: z.string().min(1),
		store_to: z.boolean().optional(),
		cc: z.array(z.string().min(1)),
		bcc: z.array(z.string().min(1)),
		reply_to: z.string().optional(),
		subject: z.string().min(1).max(255),
		message: z.string().min(1),
		attach_pdf: z.boolean(),
		sender_name: z.string().min(1).max(70).optional(),
		attachments: z.array(z.string()).optional(),
	})
	.strict();
const v12Def_PUDeliveryNoteMarkVoidResponse = z
	.object({
		status: z.string().optional(),
	})
	.strict();
const v12Def_PUV12DeliveryNoteAttachmentListRetrieve = z
	.object({
		id: z.string().min(1).optional(),
		title: z.string().min(1).max(120).optional(),
		file_url: z.string().optional(),
		file_size: z.string().optional(),
		created: z.string().optional(),
	})
	.strict();
const v12Def_PUV12DocumentTypeList = z
	.object({
		id: z.string().min(1).optional(),
		title: z.string().min(1).max(60).optional(),
		active: z.boolean().optional(),
		application: z.number().int().optional(),
		default: z.boolean().optional(),
		default_sequence: z.string().max(10).optional(),
		always_self_billed: z.boolean().optional(),
		is_delivery_note: z.boolean().optional(),
		is_reverse_delivery_note: z.boolean().optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_PUV12DocumentTypeRetrieve = z
	.object({
		id: z.string().min(1).optional(),
		title: z.string().min(1).max(60).optional(),
		title_translations: z
			.object({
				bg: z.string().optional(),
				de: z.string().optional(),
				el: z.string().optional(),
				en: z.string().optional(),
				'en-gb': z.string().optional(),
				es: z.string().optional(),
				fr: z.string().optional(),
				it: z.string().optional(),
			})
			.strict()
			.optional(),
		active: z.boolean().optional(),
		application: z.number().int().optional(),
		default: z.boolean().optional(),
		default_sequence: z.string().max(10).optional(),
		always_self_billed: z.boolean().optional(),
		is_delivery_note: z.boolean().optional(),
		is_reverse_delivery_note: z.boolean().optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_FlatSequenceNested = z
	.object({
		name: z.string().optional(),
		in_use: z.string().optional(),
		active: z.boolean().optional(),
	})
	.strict();
const v12Def_PUFlatSequenceList = z
	.object({
		count: z.number().int().optional(),
		results: z.array(v12Def_FlatSequenceNested).optional(),
	})
	.strict();
const v12Def_FlatSequence = z
	.object({
		name: z.string().min(1).max(10),
	})
	.strict();
const v12Def_PUFlatSequenceSerializer = z
	.object({
		name: z.string().min(1).max(10).optional(),
	})
	.strict();
const v12Def_FlatSequenceRename = z
	.object({
		old_name: z.string().min(1).max(10),
		new_name: z.string().min(1).max(10),
	})
	.strict();
const v12Def_PUFlatSequenceRename = z
	.object({
		old_name: z.string().min(1).max(10).optional(),
		new_name: z.string().min(1).max(10).optional(),
	})
	.strict();
const v12Def_PUV12EmailTemplate = z
	.object({
		id: z.string().min(1).optional(),
		email_type: z.string().optional(),
		subject: z.string().optional(),
		message: z.string().optional(),
		sender_type: z.string().optional(),
		sender_name: z.string().max(70).optional(),
		default: z.boolean().optional(),
		default_for_language: z.string().optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_V12EmailTemplate = z
	.object({
		id: z.string().min(1).optional(),
		email_type: z.string(),
		subject: z.string(),
		message: z.string(),
		sender_type: z.string().optional(),
		sender_name: z.string().max(70).optional(),
		default: z.boolean().optional(),
		default_for_language: z.string().optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_V12EmailTemplateUpdate = z
	.object({
		id: z.string().min(1).optional(),
		email_type: z.string().optional(),
		subject: z.string(),
		message: z.string(),
		sender_type: z.string().optional(),
		sender_name: z.string().max(70).optional(),
		default: z.boolean().optional(),
		default_for_language: z.string().optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_PUV12EmailTemplateUpdate = z
	.object({
		id: z.string().min(1).optional(),
		email_type: z.string().optional(),
		subject: z.string().optional(),
		message: z.string().optional(),
		sender_type: z.string().optional(),
		sender_name: z.string().max(70).optional(),
		default: z.boolean().optional(),
		default_for_language: z.string().optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_PUV12EstimateList = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		representation: z.string().min(1).optional(),
		status: z.string().optional(),
		draft: z.boolean().optional(),
		documenttype: z.string().optional(),
		sequence_flat: z.string().max(10).optional(),
		number: z.string().max(100).optional(),
		date: z.string().optional(),
		branch: z.string().nullable().optional(),
		client: z.string().optional(),
		client_display_name: z.string().min(1).max(203).optional(),
		client_profession: z.string().max(100).optional(),
		client_vat_number: z.string().max(20).optional(),
		billing_address: v12Def_BillingAddress.optional(),
		shipping_address: v12Def_ShippingAddress.optional(),
		client_contact_person: z.string().max(101).optional(),
		client_phone_number: z.string().max(30).optional(),
		client_email: z.string().max(100).optional(),
		currency_code: z.string().optional(),
		exchange_rate: z.string().optional(),
		calculator_mode: z.string().optional(),
		initial: z.string().optional(),
		net: z.string().optional(),
		total: z.string().optional(),
		permalink: z.string().min(1).optional(),
		converted_invoice: z.string().optional(),
		active: z.boolean().optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_EstimateItemTaxNested = z
	.object({
		tax: z.string(),
		auto_calculate: z.boolean().optional(),
		amount: z.string().optional(),
		vat_amount: z.string().optional(),
		auto_calculate_vat: z.boolean().optional(),
	})
	.strict();
const v12Def_V12EstimateItemNestedCreate = z
	.object({
		id: z.string().min(1).optional(),
		product: z.string().nullable().optional(),
		title: z.string().min(1).max(200).optional(),
		description: z.string().optional(),
		quantity: z.string().optional(),
		unit_measure: z.string().nullable().optional(),
		unit_value: z.string().optional(),
		unit_value_gross: z.string().optional(),
		unit_discount: z.string().optional(),
		unit_discount_gross: z.string().optional(),
		unit_discount_percentage: z.string().optional(),
		unit_discount_mode: z.string().optional(),
		taxes: z.array(v12Def_EstimateItemTaxNested).optional(),
		unit_total: z.string().optional(),
		item_net: z.string().optional(),
		line_type: z.number().int().nullable().optional(),
	})
	.strict();
const v12Def_EstimateStandardTaxNested = z
	.object({
		tax: z.string(),
		auto_calculate: z.boolean().optional(),
		amount: z.string().optional(),
	})
	.strict();
const v12Def_V12EstimateCreate = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		representation: z.string().min(1).optional(),
		status: z.string().optional(),
		draft: z.boolean().optional(),
		accept_status: z.string().optional(),
		documenttype: z.string().optional(),
		sequence_flat: z.string().max(10).optional(),
		number: z.string().max(100).optional(),
		date: z.string().optional(),
		branch: z.string().nullable().optional(),
		client: z.string(),
		client_display_name: z.string().min(1).max(203).optional(),
		client_profession: z.string().max(100).optional(),
		client_vat_number: z.string().max(20).optional(),
		billing_address: v12Def_BillingAddress.optional(),
		shipping_address: v12Def_ShippingAddress.optional(),
		client_contact_person: z.string().max(101).optional(),
		client_phone_number: z.string().max(30).optional(),
		client_email: z.string().max(100).optional(),
		currency_code: z.string().optional(),
		exchange_rate: z.string().optional(),
		calculator_mode: z.string().optional(),
		items: z.array(v12Def_V12EstimateItemNestedCreate),
		initial: z.string().optional(),
		net: z.string().optional(),
		taxes: z.array(v12Def_EstimateStandardTaxNested).optional(),
		total: z.string().optional(),
		template: z.string().optional(),
		terms: z.string().optional(),
		public_notes: z.string().optional(),
		permalink: z.string().min(1).optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_PUV12EstimateCreate = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		representation: z.string().min(1).optional(),
		status: z.string().optional(),
		draft: z.boolean().optional(),
		accept_status: z.string().optional(),
		documenttype: z.string().optional(),
		sequence_flat: z.string().max(10).optional(),
		number: z.string().max(100).optional(),
		date: z.string().optional(),
		branch: z.string().nullable().optional(),
		client: z.string().optional(),
		client_display_name: z.string().min(1).max(203).optional(),
		client_profession: z.string().max(100).optional(),
		client_vat_number: z.string().max(20).optional(),
		billing_address: v12Def_BillingAddress.optional(),
		shipping_address: v12Def_ShippingAddress.optional(),
		client_contact_person: z.string().max(101).optional(),
		client_phone_number: z.string().max(30).optional(),
		client_email: z.string().max(100).optional(),
		currency_code: z.string().optional(),
		exchange_rate: z.string().optional(),
		calculator_mode: z.string().optional(),
		items: z.array(v12Def_V12EstimateItemNestedCreate).optional(),
		initial: z.string().optional(),
		net: z.string().optional(),
		taxes: z.array(v12Def_EstimateStandardTaxNested).optional(),
		total: z.string().optional(),
		template: z.string().optional(),
		terms: z.string().optional(),
		public_notes: z.string().optional(),
		permalink: z.string().min(1).optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_V12EstimateItemNestedURetrieveUpdate = z
	.object({
		id: z.string().min(1).optional(),
		product: z.string().nullable().optional(),
		title: z.string().min(1).max(200).optional(),
		description: z.string().optional(),
		quantity: z.string().optional(),
		unit_measure: z.string().nullable().optional(),
		unit_value: z.string().optional(),
		unit_value_gross: z.string().optional(),
		unit_discount: z.string().optional(),
		unit_discount_gross: z.string().optional(),
		unit_discount_percentage: z.string().optional(),
		unit_discount_mode: z.string().optional(),
		taxes: z.array(v12Def_EstimateItemTaxNested).optional(),
		unit_total: z.string().optional(),
		item_net: z.string().optional(),
		line_type: z.number().int().nullable().optional(),
	})
	.strict();
const v12Def_PUV12EstimateRetrieve = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		representation: z.string().min(1).optional(),
		status: z.string().optional(),
		draft: z.boolean().optional(),
		accept_status: z.string().optional(),
		documenttype: z.string().optional(),
		sequence_flat: z.string().max(10).optional(),
		number: z.string().max(100).optional(),
		date: z.string().optional(),
		branch: z.string().nullable().optional(),
		client: z.string().optional(),
		client_display_name: z.string().min(1).max(203).optional(),
		client_profession: z.string().max(100).optional(),
		client_vat_number: z.string().max(20).optional(),
		billing_address: v12Def_BillingAddress.optional(),
		shipping_address: v12Def_ShippingAddress.optional(),
		currency_code: z.string().optional(),
		exchange_rate: z.string().optional(),
		client_contact_person: z.string().max(101).optional(),
		client_phone_number: z.string().max(30).optional(),
		client_email: z.string().max(100).optional(),
		calculator_mode: z.string().optional(),
		items: z.array(v12Def_V12EstimateItemNestedURetrieveUpdate).optional(),
		initial: z.string().optional(),
		net: z.string().optional(),
		taxes: z.array(v12Def_EstimateStandardTaxNested).optional(),
		total: z.string().optional(),
		template: z.string().optional(),
		public_notes: z.string().optional(),
		converted_invoice: z.string().optional(),
		permalink: z.string().min(1).optional(),
		active: z.boolean().optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_V12EstimateUpdate = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		representation: z.string().min(1).optional(),
		status: z.string().optional(),
		draft: z.boolean().optional(),
		accept_status: z.string().optional(),
		documenttype: z.string().optional(),
		sequence_flat: z.string().max(10).optional(),
		number: z.string().max(100).optional(),
		date: z.string().optional(),
		branch: z.string().nullable().optional(),
		client: z.string(),
		client_display_name: z.string().min(1).max(203).optional(),
		client_profession: z.string().max(100).optional(),
		client_vat_number: z.string().max(20).optional(),
		billing_address: v12Def_BillingAddress.optional(),
		shipping_address: v12Def_ShippingAddress.optional(),
		currency_code: z.string().optional(),
		exchange_rate: z.string().optional(),
		client_contact_person: z.string().max(101).optional(),
		client_phone_number: z.string().max(30).optional(),
		client_email: z.string().max(100).optional(),
		calculator_mode: z.string().optional(),
		items: z.array(v12Def_V12EstimateItemNestedURetrieveUpdate),
		initial: z.string().optional(),
		net: z.string().optional(),
		taxes: z.array(v12Def_EstimateStandardTaxNested).optional(),
		total: z.string().optional(),
		template: z.string().optional(),
		public_notes: z.string().optional(),
		converted_invoice: z.string().optional(),
		permalink: z.string().min(1).optional(),
		active: z.boolean().optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_PUV12EstimateUpdate = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		representation: z.string().min(1).optional(),
		status: z.string().optional(),
		draft: z.boolean().optional(),
		accept_status: z.string().optional(),
		documenttype: z.string().optional(),
		sequence_flat: z.string().max(10).optional(),
		number: z.string().max(100).optional(),
		date: z.string().optional(),
		branch: z.string().nullable().optional(),
		client: z.string().optional(),
		client_display_name: z.string().min(1).max(203).optional(),
		client_profession: z.string().max(100).optional(),
		client_vat_number: z.string().max(20).optional(),
		billing_address: v12Def_BillingAddress.optional(),
		shipping_address: v12Def_ShippingAddress.optional(),
		currency_code: z.string().optional(),
		exchange_rate: z.string().optional(),
		client_contact_person: z.string().max(101).optional(),
		client_phone_number: z.string().max(30).optional(),
		client_email: z.string().max(100).optional(),
		calculator_mode: z.string().optional(),
		items: z.array(v12Def_V12EstimateItemNestedURetrieveUpdate).optional(),
		initial: z.string().optional(),
		net: z.string().optional(),
		taxes: z.array(v12Def_EstimateStandardTaxNested).optional(),
		total: z.string().optional(),
		template: z.string().optional(),
		public_notes: z.string().optional(),
		converted_invoice: z.string().optional(),
		permalink: z.string().min(1).optional(),
		active: z.boolean().optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_PUV12EstimatePartialUpdate = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		draft: z.boolean().optional(),
		status: z.string().optional(),
		template: z.string().optional(),
		representation: z.string().min(1).optional(),
		converted_invoice: z.string().optional(),
		accept_status: z.string().optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_EstimateEmailFromTemplate = z
	.object({
		to: z.string().min(1),
		store_to: z.boolean().optional(),
		cc: z.array(z.string().min(1)).optional(),
		bcc: z.array(z.string().min(1)).optional(),
		reply_to: z.string().optional(),
		attach_pdf: z.boolean().optional(),
		attachments: z.array(z.string()).optional(),
	})
	.strict();
const v12Def_EstimateEmail = z
	.object({
		to: z.string().min(1),
		store_to: z.boolean().optional(),
		cc: z.array(z.string().min(1)),
		bcc: z.array(z.string().min(1)),
		reply_to: z.string().optional(),
		subject: z.string().min(1).max(255),
		message: z.string().min(1),
		attach_pdf: z.boolean(),
		sender_name: z.string().min(1).max(70).optional(),
		attachments: z.array(z.string()).optional(),
	})
	.strict();
const v12Def_PUV12EstimateAttachmentListRetrieve = z
	.object({
		id: z.string().min(1).optional(),
		title: z.string().min(1).max(120).optional(),
		file_url: z.string().optional(),
		file_size: z.string().optional(),
		created: z.string().optional(),
	})
	.strict();
const v12Def_PUV12ExpenseCategoryListRetrieve = z
	.object({
		id: z.string().min(1).optional(),
		title: z.string().min(1).max(60).optional(),
		color: z
			.string()
			.min(1)
			.max(6)
			.regex(new RegExp('^[a-fA-F0-9]{6}$'))
			.optional(),
		protected: z.boolean().optional(),
		active: z.boolean().optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_PUV12ExpenseList = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		representation: z.string().min(1).optional(),
		date: z.string().optional(),
		reference: z.string().max(150).optional(),
		branch: z.string().nullable().optional(),
		supplier: z.string().nullable().optional(),
		currency_code: z.string().optional(),
		exchange_rate: z.string().optional(),
		calculator_mode: z.string().optional(),
		net: z.string().optional(),
		total: z.string().optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_ExpenseItemTaxNested = z
	.object({
		tax: z.string(),
		auto_calculate: z.boolean().optional(),
		amount: z.string().optional(),
		vat_amount: z.string().optional(),
		auto_calculate_vat: z.boolean().optional(),
	})
	.strict();
const v12Def_V12ExpenseItemNestedCreate = z
	.object({
		id: z.string().min(1).optional(),
		expense_category: z.string().nullable().optional(),
		description: z.string().optional(),
		amount: z.string().optional(),
		item_net: z.string().optional(),
		taxes: z.array(v12Def_ExpenseItemTaxNested).optional(),
		project: z.string().nullable().optional(),
		billable: z.boolean().optional(),
		line_type: z.number().int().nullable().optional(),
	})
	.strict();
const v12Def_ExpenseStandardTaxNested = z
	.object({
		tax: z.string(),
		auto_calculate: z.boolean().optional(),
		amount: z.string().optional(),
	})
	.strict();
const v12Def_V12ExpenseCreate = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		representation: z.string().min(1).optional(),
		date: z.string().optional(),
		reference: z.string().max(150).optional(),
		branch: z.string().nullable().optional(),
		supplier: z.string().nullable().optional(),
		currency_code: z.string().optional(),
		exchange_rate: z.string().optional(),
		calculator_mode: z.string().optional(),
		items: z.array(v12Def_V12ExpenseItemNestedCreate),
		net: z.string().optional(),
		taxes: z.array(v12Def_ExpenseStandardTaxNested).optional(),
		total: z.string().optional(),
		trackingcategories: z.array(v12Def_RecordTrackingCategoryNested).optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_PUV12ExpenseCreate = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		representation: z.string().min(1).optional(),
		date: z.string().optional(),
		reference: z.string().max(150).optional(),
		branch: z.string().nullable().optional(),
		supplier: z.string().nullable().optional(),
		currency_code: z.string().optional(),
		exchange_rate: z.string().optional(),
		calculator_mode: z.string().optional(),
		items: z.array(v12Def_V12ExpenseItemNestedCreate).optional(),
		net: z.string().optional(),
		taxes: z.array(v12Def_ExpenseStandardTaxNested).optional(),
		total: z.string().optional(),
		trackingcategories: z.array(v12Def_RecordTrackingCategoryNested).optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_ExpenseItemNestedRetrieve = z
	.object({
		id: z.string().min(1).optional(),
		expense_category: z.string().nullable().optional(),
		description: z.string().optional(),
		amount: z.string().optional(),
		item_net: z.string().optional(),
		taxes: z.array(v12Def_ExpenseItemTaxNested).optional(),
		project: z.string().nullable().optional(),
		billable: z.boolean().optional(),
		line_type: z.number().int().nullable().optional(),
	})
	.strict();
const v12Def_PUV12ExpenseRetrieve = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		representation: z.string().min(1).optional(),
		date: z.string().optional(),
		reference: z.string().max(150).optional(),
		branch: z.string().nullable().optional(),
		supplier: z.string().nullable().optional(),
		currency_code: z.string().optional(),
		exchange_rate: z.string().optional(),
		calculator_mode: z.string().optional(),
		items: z.array(v12Def_ExpenseItemNestedRetrieve).optional(),
		net: z.string().optional(),
		taxes: z.array(v12Def_ExpenseStandardTaxNested).optional(),
		total: z.string().optional(),
		trackingcategories: z.array(v12Def_RecordTrackingCategoryNested).optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_V12ExpenseUpdate = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		representation: z.string().min(1).optional(),
		date: z.string().optional(),
		reference: z.string().max(150).optional(),
		branch: z.string().nullable().optional(),
		supplier: z.string().nullable().optional(),
		currency_code: z.string().optional(),
		exchange_rate: z.string().optional(),
		calculator_mode: z.string().optional(),
		items: z.array(v12Def_ExpenseItemNestedRetrieve),
		net: z.string().optional(),
		taxes: z.array(v12Def_ExpenseStandardTaxNested).optional(),
		total: z.string().optional(),
		trackingcategories: z.array(v12Def_RecordTrackingCategoryNested).optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_PUV12ExpenseUpdate = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		representation: z.string().min(1).optional(),
		date: z.string().optional(),
		reference: z.string().max(150).optional(),
		branch: z.string().nullable().optional(),
		supplier: z.string().nullable().optional(),
		currency_code: z.string().optional(),
		exchange_rate: z.string().optional(),
		calculator_mode: z.string().optional(),
		items: z.array(v12Def_ExpenseItemNestedRetrieve).optional(),
		net: z.string().optional(),
		taxes: z.array(v12Def_ExpenseStandardTaxNested).optional(),
		total: z.string().optional(),
		trackingcategories: z.array(v12Def_RecordTrackingCategoryNested).optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_PUV12ExpenseAttachmentListRetrieve = z
	.object({
		id: z.string().min(1).optional(),
		title: z.string().min(1).max(120).optional(),
		primary: z.boolean().optional(),
		file_url: z.string().optional(),
		file_size: z.string().optional(),
		created: z.string().optional(),
	})
	.strict();
const v12Def_PUV12GoodsReceiptList = z
	.object({
		id: z.string().min(1).optional(),
		representation: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		status: z.string().optional(),
		draft: z.boolean().optional(),
		is_void: z.boolean().optional(),
		sequence_flat: z.string().max(10).optional(),
		number: z.string().max(100).optional(),
		branch: z.string().nullable().optional(),
		billing_address: z.string().optional(),
		supplier: z.string().optional(),
		supplier_display_name: z.string().max(203).optional(),
		date: z.string().optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_V12GoodsReceiptItemNestedCreate = z
	.object({
		id: z.string().min(1).optional(),
		product: z.string().nullable().optional(),
		title: z.string().min(1).max(200).optional(),
		description: z.string().optional(),
		quantity: z.string().optional(),
		unit_measure: z.string().nullable().optional(),
		warehouse: z.string().nullable().optional(),
		skip_stock_update: z.boolean().optional(),
	})
	.strict();
const v12Def_V12GoodsReceiptCreate = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		representation: z.string().min(1).optional(),
		status: z.string().optional(),
		draft: z.boolean().optional(),
		sequence_flat: z.string().max(10).optional(),
		number: z.string().max(100).optional(),
		date: z.string().optional(),
		branch: z.string().nullable().optional(),
		supplier: z.string(),
		supplier_display_name: z.string().max(203).optional(),
		supplier_profession: z.string().max(100).optional(),
		supplier_vat_number: z.string().max(20).optional(),
		supplier_contact_person: z.string().max(101).optional(),
		supplier_phone_number: z.string().max(30).optional(),
		supplier_email: z.string().max(100).optional(),
		billing_address: v12Def_BillingAddress.optional(),
		items: z.array(v12Def_V12GoodsReceiptItemNestedCreate),
		template: z.string().nullable().optional(),
		public_notes: z.string().optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_PUV12GoodsReceiptCreate = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		representation: z.string().min(1).optional(),
		status: z.string().optional(),
		draft: z.boolean().optional(),
		sequence_flat: z.string().max(10).optional(),
		number: z.string().max(100).optional(),
		date: z.string().optional(),
		branch: z.string().nullable().optional(),
		supplier: z.string().optional(),
		supplier_display_name: z.string().max(203).optional(),
		supplier_profession: z.string().max(100).optional(),
		supplier_vat_number: z.string().max(20).optional(),
		supplier_contact_person: z.string().max(101).optional(),
		supplier_phone_number: z.string().max(30).optional(),
		supplier_email: z.string().max(100).optional(),
		billing_address: v12Def_BillingAddress.optional(),
		items: z.array(v12Def_V12GoodsReceiptItemNestedCreate).optional(),
		template: z.string().nullable().optional(),
		public_notes: z.string().optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_GoodsReceiptItemNested = z
	.object({
		id: z.string().min(1).optional(),
		product: z.string().nullable().optional(),
		title: z.string().min(1).max(200).optional(),
		description: z.string().optional(),
		quantity: z.string().optional(),
		unit_measure: z.string().nullable().optional(),
		warehouse: z.string().nullable().optional(),
		skip_stock_update: z.boolean().optional(),
	})
	.strict();
const v12Def_PUV12GoodsReceiptRetrieve = z
	.object({
		id: z.string().min(1).optional(),
		representation: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		status: z.string().optional(),
		draft: z.boolean().optional(),
		is_void: z.boolean().optional(),
		sequence_flat: z.string().max(10).optional(),
		number: z.string().max(100).optional(),
		branch: z.string().nullable().optional(),
		billing_address: z.string().optional(),
		supplier: z.string().optional(),
		supplier_display_name: z.string().max(203).optional(),
		supplier_profession: z.string().max(100).optional(),
		supplier_vat_number: z.string().max(20).optional(),
		supplier_contact_person: z.string().max(101).optional(),
		supplier_phone_number: z.string().max(30).optional(),
		supplier_email: z.string().max(100).optional(),
		items: z.array(v12Def_GoodsReceiptItemNested).optional(),
		template: z.string().nullable().optional(),
		public_notes: z.string().optional(),
		date: z.string().optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_V12GoodsReceiptItemNestedRetrieveUpdate = z
	.object({
		id: z.string().min(1).optional(),
		product: z.string().nullable().optional(),
		title: z.string().min(1).max(200).optional(),
		description: z.string().optional(),
		quantity: z.string().optional(),
		unit_measure: z.string().nullable().optional(),
		warehouse: z.string().nullable().optional(),
		skip_stock_update: z.boolean().optional(),
	})
	.strict();
const v12Def_V12GoodsReceiptUpdate = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		representation: z.string().min(1).optional(),
		status: z.string().optional(),
		draft: z.boolean().optional(),
		sequence_flat: z.string().max(10).optional(),
		number: z.string().max(100).optional(),
		date: z.string().optional(),
		branch: z.string().nullable().optional(),
		supplier: z.string(),
		supplier_display_name: z.string().max(203).optional(),
		supplier_profession: z.string().max(100).optional(),
		supplier_vat_number: z.string().max(20).optional(),
		supplier_contact_person: z.string().max(101).optional(),
		supplier_phone_number: z.string().max(30).optional(),
		supplier_email: z.string().max(100).optional(),
		billing_address: v12Def_BillingAddress.optional(),
		items: z.array(v12Def_V12GoodsReceiptItemNestedRetrieveUpdate),
		template: z.string().nullable().optional(),
		public_notes: z.string().optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_PUV12GoodsReceiptUpdate = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		representation: z.string().min(1).optional(),
		status: z.string().optional(),
		draft: z.boolean().optional(),
		sequence_flat: z.string().max(10).optional(),
		number: z.string().max(100).optional(),
		date: z.string().optional(),
		branch: z.string().nullable().optional(),
		supplier: z.string().optional(),
		supplier_display_name: z.string().max(203).optional(),
		supplier_profession: z.string().max(100).optional(),
		supplier_vat_number: z.string().max(20).optional(),
		supplier_contact_person: z.string().max(101).optional(),
		supplier_phone_number: z.string().max(30).optional(),
		supplier_email: z.string().max(100).optional(),
		billing_address: v12Def_BillingAddress.optional(),
		items: z.array(v12Def_V12GoodsReceiptItemNestedRetrieveUpdate).optional(),
		template: z.string().nullable().optional(),
		public_notes: z.string().optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_PUV12GoodsReceiptPartialUpdate = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		draft: z.boolean().optional(),
		status: z.string().optional(),
		template: z.string().nullable().optional(),
		representation: z.string().min(1).optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_DocumentEmailFromTemplate = z
	.object({
		to: z.string().min(1),
		store_to: z.boolean().optional(),
		cc: z.array(z.string().min(1)).optional(),
		bcc: z.array(z.string().min(1)).optional(),
		reply_to: z.string().optional(),
		attach_pdf: z.boolean().optional(),
	})
	.strict();
const v12Def_DocumentEmail = z
	.object({
		to: z.string().min(1),
		store_to: z.boolean().optional(),
		cc: z.array(z.string().min(1)),
		bcc: z.array(z.string().min(1)),
		reply_to: z.string().optional(),
		subject: z.string().min(1).max(255),
		message: z.string().min(1),
		attach_pdf: z.boolean(),
		sender_name: z.string().min(1).max(70).optional(),
	})
	.strict();
const v12Def_PUGoodsReceiptMarkVoidResponse = z
	.object({
		status: z.string().optional(),
	})
	.strict();
const v12Def_PUV12InvoiceList = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		representation: z.string().min(1).optional(),
		status: z.string().optional(),
		draft: z.boolean().optional(),
		documenttype: z.string().optional(),
		sequence_flat: z.string().max(10).optional(),
		number: z.string().max(100).optional(),
		date: z.string().optional(),
		due_date: z.string().nullable().optional(),
		branch: z.string().nullable().optional(),
		client: z.string().optional(),
		client_display_name: z.string().min(1).max(203).optional(),
		client_profession: z.string().max(100).optional(),
		client_vat_number: z.string().max(20).optional(),
		billing_address: v12Def_BillingAddress.optional(),
		shipping_address: v12Def_ShippingAddress.optional(),
		client_contact_person: z.string().max(101).optional(),
		client_phone_number: z.string().max(30).optional(),
		client_email: z.string().max(100).optional(),
		loading_address: v12Def_LoadingAddress.optional(),
		dispatch_date: z.string().nullable().optional(),
		dispatch_time: z.string().nullable().optional(),
		vehicle_number: z.string().max(150).optional(),
		move_purpose: z.number().int().nullable().optional(),
		currency_code: z.string().optional(),
		exchange_rate: z.string().optional(),
		calculator_mode: z.string().optional(),
		initial: z.string().optional(),
		net: z.string().optional(),
		total: z.string().optional(),
		payable: z.string().optional(),
		paid: z.string().optional(),
		permalink: z.string().min(1).optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_InvoiceRelatedEntities = z
	.object({
		id: z.string().min(1).optional(),
		contact: z.string(),
		contact_display_name: z.string().min(1).max(203),
		contact_vat_number: z.string().max(20).optional(),
		type: z.number().int(),
		billing_address: v12Def_BillingAddress.optional(),
	})
	.strict();
const v12Def_InvoicePackageNested = z
	.object({
		id: z.string().min(1).optional(),
		packaging_type: z.number().int(),
		quantity: z.number().int().min(1).max(32767),
		other_packaging_type_title: z.string().max(150).optional(),
	})
	.strict();
const v12Def_InvoiceItemTaxNested = z
	.object({
		tax: z.string(),
		auto_calculate: z.boolean().optional(),
		amount: z.string().optional(),
		vat_amount: z.string().optional(),
		auto_calculate_vat: z.boolean().optional(),
	})
	.strict();
const v12Def_V12InvoiceItemNestedCreate = z
	.object({
		id: z.string().min(1).optional(),
		product: z.string().nullable().optional(),
		title: z.string().min(1).max(200).optional(),
		description: z.string().optional(),
		quantity: z.string().optional(),
		unit_measure: z.string().nullable().optional(),
		unit_value: z.string().optional(),
		unit_value_gross: z.string().optional(),
		unit_discount: z.string().optional(),
		unit_discount_gross: z.string().optional(),
		unit_discount_percentage: z.string().optional(),
		unit_discount_mode: z.string().optional(),
		taxes: z.array(v12Def_InvoiceItemTaxNested).optional(),
		unit_total: z.string().optional(),
		item_net: z.string().optional(),
		project: z.string().nullable().optional(),
		taric_code: z.string().min(10).max(10).optional(),
		warehouse: z.string().nullable().optional(),
		line_type: z.number().int().nullable().optional(),
		skip_stock_update: z.boolean().optional(),
	})
	.strict();
const v12Def_InvoiceStandardTaxNested = z
	.object({
		tax: z.string(),
		auto_calculate: z.boolean().optional(),
		amount: z.string().optional(),
	})
	.strict();
const v12Def_InvoiceWithholdingTaxNested = z
	.object({
		tax: z.string(),
		amount: z.string().optional(),
		subtotal: z.number().int().optional(),
		auto_calculate: z.boolean().optional(),
	})
	.strict();
const v12Def_V12InvoiceCreate = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		representation: z.string().min(1).optional(),
		status: z.string().optional(),
		draft: z.boolean().optional(),
		documenttype: z.string().optional(),
		sequence_flat: z.string().max(10).optional(),
		number: z.string().max(100).optional(),
		date: z.string(),
		due_days: z.number().int().min(0).max(2147483647).nullable().optional(),
		branch: z.string().nullable().optional(),
		client: z.string(),
		client_display_name: z.string().min(1).max(203).optional(),
		client_profession: z.string().max(100).optional(),
		client_vat_number: z.string().max(20).optional(),
		billing_address: v12Def_BillingAddress.optional(),
		shipping_address: v12Def_ShippingAddress.optional(),
		client_contact_person: z.string().max(101).optional(),
		client_phone_number: z.string().max(30).optional(),
		client_email: z.string().max(100).optional(),
		loading_address: v12Def_LoadingAddress.optional(),
		dispatch_date: z.string().nullable().optional(),
		dispatch_time: z.string().nullable().optional(),
		vehicle_number: z.string().max(150).optional(),
		move_purpose: z.number().int().nullable().optional(),
		related_entities: z
			.array(v12Def_InvoiceRelatedEntities)
			.nullable()
			.optional(),
		packages: z.array(v12Def_InvoicePackageNested).nullable().optional(),
		currency_code: z.string().optional(),
		exchange_rate: z.string().optional(),
		calculator_mode: z.string().optional(),
		items: z.array(v12Def_V12InvoiceItemNestedCreate),
		initial: z.string().optional(),
		net: z.string().optional(),
		taxes: z.array(v12Def_InvoiceStandardTaxNested).optional(),
		total: z.string().optional(),
		withholding_taxes: z.array(v12Def_InvoiceWithholdingTaxNested).optional(),
		payable: z.string().optional(),
		paid: z.string().optional(),
		template: z.string().optional(),
		terms: z.string().optional(),
		public_notes: z.string().optional(),
		payment_gateways: z.array(z.string()).optional(),
		related_documents: z.array(z.string()).optional(),
		delivery_notes: z.array(z.string()).optional(),
		trackingcategories: z.array(v12Def_RecordTrackingCategoryNested).optional(),
		permalink: z.string().min(1).optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_PUV12InvoiceCreate = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		representation: z.string().min(1).optional(),
		status: z.string().optional(),
		draft: z.boolean().optional(),
		documenttype: z.string().optional(),
		sequence_flat: z.string().max(10).optional(),
		number: z.string().max(100).optional(),
		date: z.string().optional(),
		due_days: z.number().int().min(0).max(2147483647).nullable().optional(),
		branch: z.string().nullable().optional(),
		client: z.string().optional(),
		client_display_name: z.string().min(1).max(203).optional(),
		client_profession: z.string().max(100).optional(),
		client_vat_number: z.string().max(20).optional(),
		billing_address: v12Def_BillingAddress.optional(),
		shipping_address: v12Def_ShippingAddress.optional(),
		client_contact_person: z.string().max(101).optional(),
		client_phone_number: z.string().max(30).optional(),
		client_email: z.string().max(100).optional(),
		loading_address: v12Def_LoadingAddress.optional(),
		dispatch_date: z.string().nullable().optional(),
		dispatch_time: z.string().nullable().optional(),
		vehicle_number: z.string().max(150).optional(),
		move_purpose: z.number().int().nullable().optional(),
		related_entities: z
			.array(v12Def_InvoiceRelatedEntities)
			.nullable()
			.optional(),
		packages: z.array(v12Def_InvoicePackageNested).nullable().optional(),
		currency_code: z.string().optional(),
		exchange_rate: z.string().optional(),
		calculator_mode: z.string().optional(),
		items: z.array(v12Def_V12InvoiceItemNestedCreate).optional(),
		initial: z.string().optional(),
		net: z.string().optional(),
		taxes: z.array(v12Def_InvoiceStandardTaxNested).optional(),
		total: z.string().optional(),
		withholding_taxes: z.array(v12Def_InvoiceWithholdingTaxNested).optional(),
		payable: z.string().optional(),
		paid: z.string().optional(),
		template: z.string().optional(),
		terms: z.string().optional(),
		public_notes: z.string().optional(),
		payment_gateways: z.array(z.string()).optional(),
		related_documents: z.array(z.string()).optional(),
		delivery_notes: z.array(z.string()).optional(),
		trackingcategories: z.array(v12Def_RecordTrackingCategoryNested).optional(),
		permalink: z.string().min(1).optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_V12InvoiceItemNestedRetrieveUpdate = z
	.object({
		id: z.string().min(1).optional(),
		product: z.string().nullable().optional(),
		title: z.string().min(1).max(200).optional(),
		description: z.string().optional(),
		quantity: z.string().optional(),
		unit_measure: z.string().nullable().optional(),
		unit_value: z.string().optional(),
		unit_value_gross: z.string().optional(),
		unit_discount: z.string().optional(),
		unit_discount_gross: z.string().optional(),
		unit_discount_percentage: z.string().optional(),
		unit_discount_mode: z.string().optional(),
		taxes: z.array(v12Def_InvoiceItemTaxNested).optional(),
		unit_total: z.string().optional(),
		item_net: z.string().optional(),
		project: z.string().nullable().optional(),
		taric_code: z.string().min(10).max(10).optional(),
		warehouse: z.string().nullable().optional(),
		line_type: z.number().int().nullable().optional(),
		skip_stock_update: z.boolean().optional(),
	})
	.strict();
const v12Def_PUV12InvoiceRetrieve = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		representation: z.string().min(1).optional(),
		status: z.string().optional(),
		draft: z.boolean().optional(),
		documenttype: z.string().optional(),
		sequence_flat: z.string().max(10).optional(),
		number: z.string().max(100).optional(),
		date: z.string().optional(),
		due_days: z.number().int().min(0).max(2147483647).nullable().optional(),
		branch: z.string().nullable().optional(),
		client: z.string().optional(),
		client_display_name: z.string().min(1).max(203).optional(),
		client_profession: z.string().max(100).optional(),
		client_vat_number: z.string().max(20).optional(),
		billing_address: v12Def_BillingAddress.optional(),
		shipping_address: v12Def_ShippingAddress.optional(),
		client_contact_person: z.string().max(101).optional(),
		client_phone_number: z.string().max(30).optional(),
		client_email: z.string().max(100).optional(),
		loading_address: v12Def_LoadingAddress.optional(),
		dispatch_date: z.string().nullable().optional(),
		dispatch_time: z.string().nullable().optional(),
		vehicle_number: z.string().max(150).optional(),
		move_purpose: z.number().int().nullable().optional(),
		related_entities: z
			.array(v12Def_InvoiceRelatedEntities)
			.nullable()
			.optional(),
		packages: z.array(v12Def_InvoicePackageNested).nullable().optional(),
		currency_code: z.string().optional(),
		exchange_rate: z.string().optional(),
		calculator_mode: z.string().optional(),
		items: z.array(v12Def_V12InvoiceItemNestedRetrieveUpdate).optional(),
		initial: z.string().optional(),
		net: z.string().optional(),
		taxes: z.array(v12Def_InvoiceStandardTaxNested).optional(),
		total: z.string().optional(),
		withholding_taxes: z.array(v12Def_InvoiceWithholdingTaxNested).optional(),
		payable: z.string().optional(),
		paid: z.string().optional(),
		template: z.string().optional(),
		terms: z.string().optional(),
		public_notes: z.string().optional(),
		payment_gateways: z.array(z.string()).optional(),
		related_documents: z.array(z.string()).optional(),
		delivery_notes: z.array(z.string()).optional(),
		trackingcategories: z.array(v12Def_RecordTrackingCategoryNested).optional(),
		permalink: z.string().min(1).optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_V12InvoiceUpdate = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		representation: z.string().min(1).optional(),
		status: z.string().optional(),
		draft: z.boolean().optional(),
		documenttype: z.string().optional(),
		sequence_flat: z.string().max(10).optional(),
		number: z.string().max(100).optional(),
		date: z.string().optional(),
		due_days: z.number().int().min(0).max(2147483647).nullable().optional(),
		branch: z.string().nullable().optional(),
		client: z.string(),
		client_display_name: z.string().min(1).max(203).optional(),
		client_profession: z.string().max(100).optional(),
		client_vat_number: z.string().max(20).optional(),
		billing_address: v12Def_BillingAddress.optional(),
		shipping_address: v12Def_ShippingAddress.optional(),
		client_contact_person: z.string().max(101).optional(),
		client_phone_number: z.string().max(30).optional(),
		client_email: z.string().max(100).optional(),
		loading_address: v12Def_LoadingAddress.optional(),
		dispatch_date: z.string().nullable().optional(),
		dispatch_time: z.string().nullable().optional(),
		vehicle_number: z.string().max(150).optional(),
		move_purpose: z.number().int().nullable().optional(),
		related_entities: z
			.array(v12Def_InvoiceRelatedEntities)
			.nullable()
			.optional(),
		packages: z.array(v12Def_InvoicePackageNested).nullable().optional(),
		currency_code: z.string().optional(),
		exchange_rate: z.string().optional(),
		calculator_mode: z.string().optional(),
		items: z.array(v12Def_V12InvoiceItemNestedRetrieveUpdate),
		initial: z.string().optional(),
		net: z.string().optional(),
		taxes: z.array(v12Def_InvoiceStandardTaxNested).optional(),
		total: z.string().optional(),
		withholding_taxes: z.array(v12Def_InvoiceWithholdingTaxNested).optional(),
		payable: z.string().optional(),
		paid: z.string().optional(),
		template: z.string().optional(),
		terms: z.string().optional(),
		public_notes: z.string().optional(),
		payment_gateways: z.array(z.string()).optional(),
		related_documents: z.array(z.string()).optional(),
		delivery_notes: z.array(z.string()).optional(),
		trackingcategories: z.array(v12Def_RecordTrackingCategoryNested).optional(),
		permalink: z.string().min(1).optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_PUV12InvoiceUpdate = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		representation: z.string().min(1).optional(),
		status: z.string().optional(),
		draft: z.boolean().optional(),
		documenttype: z.string().optional(),
		sequence_flat: z.string().max(10).optional(),
		number: z.string().max(100).optional(),
		date: z.string().optional(),
		due_days: z.number().int().min(0).max(2147483647).nullable().optional(),
		branch: z.string().nullable().optional(),
		client: z.string().optional(),
		client_display_name: z.string().min(1).max(203).optional(),
		client_profession: z.string().max(100).optional(),
		client_vat_number: z.string().max(20).optional(),
		billing_address: v12Def_BillingAddress.optional(),
		shipping_address: v12Def_ShippingAddress.optional(),
		client_contact_person: z.string().max(101).optional(),
		client_phone_number: z.string().max(30).optional(),
		client_email: z.string().max(100).optional(),
		loading_address: v12Def_LoadingAddress.optional(),
		dispatch_date: z.string().nullable().optional(),
		dispatch_time: z.string().nullable().optional(),
		vehicle_number: z.string().max(150).optional(),
		move_purpose: z.number().int().nullable().optional(),
		related_entities: z
			.array(v12Def_InvoiceRelatedEntities)
			.nullable()
			.optional(),
		packages: z.array(v12Def_InvoicePackageNested).nullable().optional(),
		currency_code: z.string().optional(),
		exchange_rate: z.string().optional(),
		calculator_mode: z.string().optional(),
		items: z.array(v12Def_V12InvoiceItemNestedRetrieveUpdate).optional(),
		initial: z.string().optional(),
		net: z.string().optional(),
		taxes: z.array(v12Def_InvoiceStandardTaxNested).optional(),
		total: z.string().optional(),
		withholding_taxes: z.array(v12Def_InvoiceWithholdingTaxNested).optional(),
		payable: z.string().optional(),
		paid: z.string().optional(),
		template: z.string().optional(),
		terms: z.string().optional(),
		public_notes: z.string().optional(),
		payment_gateways: z.array(z.string()).optional(),
		related_documents: z.array(z.string()).optional(),
		delivery_notes: z.array(z.string()).optional(),
		trackingcategories: z.array(v12Def_RecordTrackingCategoryNested).optional(),
		permalink: z.string().min(1).optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_PUV12InvoicePartialUpdate = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		representation: z.string().min(1).optional(),
		status: z.string().optional(),
		draft: z.boolean().optional(),
		exchange_rate: z.string().optional(),
		payment_gateways: z.array(z.string()).optional(),
		trackingcategories: z.array(v12Def_RecordTrackingCategoryNested).optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_InvoiceEmailFromTemplate = z
	.object({
		to: z.string().min(1),
		store_to: z.boolean().optional(),
		cc: z.array(z.string().min(1)).optional(),
		bcc: z.array(z.string().min(1)).optional(),
		reply_to: z.string().optional(),
		attach_pdf: z.boolean().optional(),
		attachments: z.array(z.string()).optional(),
	})
	.strict();
const v12Def_InvoiceEmail = z
	.object({
		to: z.string().min(1),
		store_to: z.boolean().optional(),
		cc: z.array(z.string().min(1)),
		bcc: z.array(z.string().min(1)),
		reply_to: z.string().optional(),
		subject: z.string().min(1).max(255),
		message: z.string().min(1),
		attach_pdf: z.boolean(),
		sender_name: z.string().min(1).max(70).optional(),
		attachments: z.array(z.string()).optional(),
	})
	.strict();
const v12Def_PUInvoiceMarkVoidResponse = z
	.object({
		status: z.string().optional(),
	})
	.strict();
const v12Def_PUInvoiceCreditTransactionInvSerializer = z
	.object({
		id: z.string().min(1).optional(),
		representation: z.string().optional(),
		creditnote: z.string().optional(),
		amount: z.string().optional(),
		currency_code: z.string().optional(),
		date: z.string().optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_InvoiceCreditTransactionInv = z
	.object({
		id: z.string().min(1).optional(),
		representation: z.string().optional(),
		creditnote: z.string(),
		amount: z.string(),
		currency_code: z.string().optional(),
		date: z.string().optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_PUV12InvoiceAttachmentListRetrieve = z
	.object({
		id: z.string().min(1).optional(),
		title: z.string().min(1).max(120).optional(),
		file_url: z.string().optional(),
		file_size: z.string().optional(),
		created: z.string().optional(),
	})
	.strict();
const v12Def_BranchAddress = z
	.object({
		address_line: z.string().max(200),
		city: z.string().max(100),
		state: z.string().max(100).optional(),
		zip: z.string().max(20),
		country: z.string(),
	})
	.strict();
const v12Def_PUV12OrganizationBranchSerializer = z
	.object({
		id: z.string().min(1).optional(),
		branch_name: z.string().min(1).max(70).optional(),
		branch_code: z.number().int().min(-2147483648).max(2147483647).optional(),
		branch_address: v12Def_BranchAddress.optional(),
		phone: z.string().max(30).optional(),
		active: z.boolean().optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_V12OrganizationBranch = z
	.object({
		id: z.string().min(1).optional(),
		branch_name: z.string().min(1).max(70),
		branch_code: z.number().int().min(-2147483648).max(2147483647),
		branch_address: v12Def_BranchAddress,
		phone: z.string().max(30).optional(),
		active: z.boolean().optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_PUV12PaymentGatewayList = z
	.object({
		id: z.string().min(1).optional(),
		title: z.string().min(1).max(30).optional(),
		backend: z.string().optional(),
		active: z.boolean().optional(),
		default: z.boolean().optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_PUV12ProductOrServiceList = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		title: z.string().min(1).max(150).optional(),
		code: z.string().max(40).optional(),
		description: z.string().optional(),
		sales: z.boolean().optional(),
		sale_value: z.string().optional(),
		sale_taxes: z.array(z.string()).optional(),
		purchases: z.boolean().optional(),
		purchase_value: z.string().optional(),
		purchase_taxes: z.array(z.string()).optional(),
		manage: z.boolean().optional(),
		stock: z.string().optional(),
		unit_measure: z.string().nullable().optional(),
		active: z.boolean().optional(),
		taric_code: z.string().min(10).max(10).optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_StockAdjustmentNestedCreate = z
	.object({
		warehouse: z.string(),
		stock: z.string(),
	})
	.strict();
const v12Def_ProductBarcodeNested = z
	.object({
		barcode: z.string().min(1).max(128),
	})
	.strict();
const v12Def_V12ProductOrServiceCreate = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		title: z.string().min(1).max(150),
		code: z.string().max(40).optional(),
		description: z.string().optional(),
		sales: z.boolean().optional(),
		sale_value: z.string().optional(),
		sale_taxes: z.array(z.string()).optional(),
		purchases: z.boolean().optional(),
		purchase_value: z.string().optional(),
		purchase_taxes: z.array(z.string()).optional(),
		manage: z.boolean().optional(),
		initial_stock: z.array(v12Def_StockAdjustmentNestedCreate).optional(),
		stock: z.string().optional(),
		unit_measure: z.string().nullable().optional(),
		trackingcategories: z.array(v12Def_RecordTrackingCategoryNested).optional(),
		active: z.boolean().optional(),
		taric_code: z.string().min(10).max(10).optional(),
		barcodes: z.array(v12Def_ProductBarcodeNested).optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_PUV12ProductOrServiceCreate = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		title: z.string().min(1).max(150).optional(),
		code: z.string().max(40).optional(),
		description: z.string().optional(),
		sales: z.boolean().optional(),
		sale_value: z.string().optional(),
		sale_taxes: z.array(z.string()).optional(),
		purchases: z.boolean().optional(),
		purchase_value: z.string().optional(),
		purchase_taxes: z.array(z.string()).optional(),
		manage: z.boolean().optional(),
		stock: z.string().optional(),
		unit_measure: z.string().nullable().optional(),
		trackingcategories: z.array(v12Def_RecordTrackingCategoryNested).optional(),
		active: z.boolean().optional(),
		taric_code: z.string().min(10).max(10).optional(),
		barcodes: z.array(v12Def_ProductBarcodeNested).optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_ProductStockNested = z
	.object({
		warehouse: z.string(),
		stock: z.string(),
	})
	.strict();
const v12Def_PUV12ProductOrServiceRetrieveUpdate = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		title: z.string().min(1).max(150).optional(),
		code: z.string().max(40).optional(),
		description: z.string().optional(),
		sales: z.boolean().optional(),
		sale_value: z.string().optional(),
		sale_taxes: z.array(z.string()).optional(),
		purchases: z.boolean().optional(),
		purchase_value: z.string().optional(),
		purchase_taxes: z.array(z.string()).optional(),
		manage: z.boolean().optional(),
		stock: z.string().optional(),
		warehouses_stock: z.array(v12Def_ProductStockNested).optional(),
		unit_measure: z.string().nullable().optional(),
		trackingcategories: z.array(v12Def_RecordTrackingCategoryNested).optional(),
		active: z.boolean().optional(),
		taric_code: z.string().min(10).max(10).optional(),
		barcodes: z.array(v12Def_ProductBarcodeNested).optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_V12ProductOrServiceRetrieveUpdate = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		title: z.string().min(1).max(150),
		code: z.string().max(40).optional(),
		description: z.string().optional(),
		sales: z.boolean().optional(),
		sale_value: z.string().optional(),
		sale_taxes: z.array(z.string()).optional(),
		purchases: z.boolean().optional(),
		purchase_value: z.string().optional(),
		purchase_taxes: z.array(z.string()).optional(),
		manage: z.boolean().optional(),
		stock: z.string().optional(),
		warehouses_stock: z.array(v12Def_ProductStockNested).optional(),
		unit_measure: z.string().nullable().optional(),
		trackingcategories: z.array(v12Def_RecordTrackingCategoryNested).optional(),
		active: z.boolean().optional(),
		taric_code: z.string().min(10).max(10).optional(),
		barcodes: z.array(v12Def_ProductBarcodeNested).optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_PUStockAdjustmentSerializer = z
	.object({
		id: z.string().min(1).optional(),
		operand: z.string().optional(),
		quantity: z.string().optional(),
		date: z.string().optional(),
		notes: z.string().max(255).optional(),
		warehouse: z.string().optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_StockAdjustment = z
	.object({
		id: z.string().min(1).optional(),
		operand: z.string().optional(),
		quantity: z.string().optional(),
		date: z.string().optional(),
		notes: z.string().max(255).optional(),
		warehouse: z.string(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_V12ProjectMemberNestedList = z
	.object({
		member: z.number().int(),
		member_repr: z.string().optional(),
		hourly_rate: z.string().optional(),
		cost_per_hour: z.string().optional(),
	})
	.strict();
const v12Def_PUV12ProjectList = z
	.object({
		id: z.string().min(1).optional(),
		name: z.string().min(1).max(100).optional(),
		description: z.string().optional(),
		client: z.string().optional(),
		billing_method: z.string().optional(),
		fixed_cost: z.string().optional(),
		hourly_rate: z.string().optional(),
		active: z.boolean().optional(),
		organization: z.number().int().optional(),
		members: z.array(v12Def_V12ProjectMemberNestedList).optional(),
		client_portal: z.string().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_ProjectMemberNestedCreateUpdate = z
	.object({
		member: z.number().int(),
		manager: z.boolean().optional(),
		hourly_rate: z.string(),
		cost_per_hour: z.string().optional(),
	})
	.strict();
const v12Def_ProjectTaskNestedCreateUpdate = z
	.object({
		id: z.string().min(1).optional(),
		name: z.string().min(1).max(150),
		description: z.string().optional(),
		hourly_rate: z.string().optional(),
	})
	.strict();
const v12Def_V12ProjectCreateUpdate = z
	.object({
		id: z.string().min(1).optional(),
		name: z.string().min(1).max(100),
		description: z.string().optional(),
		client: z.string(),
		billing_method: z.string().optional(),
		fixed_cost: z.string().optional(),
		hourly_rate: z.string().optional(),
		members: z.array(v12Def_ProjectMemberNestedCreateUpdate),
		tasks: z.array(v12Def_ProjectTaskNestedCreateUpdate),
		client_portal: z.string().optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_PUV12ProjectCreateUpdate = z
	.object({
		id: z.string().min(1).optional(),
		name: z.string().min(1).max(100).optional(),
		description: z.string().optional(),
		client: z.string().optional(),
		billing_method: z.string().optional(),
		fixed_cost: z.string().optional(),
		hourly_rate: z.string().optional(),
		members: z.array(v12Def_ProjectMemberNestedCreateUpdate).optional(),
		tasks: z.array(v12Def_ProjectTaskNestedCreateUpdate).optional(),
		client_portal: z.string().optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_V12ProjectMemberNestedRetrieve = z
	.object({
		member: z.number().int(),
		member_repr: z.string().optional(),
		manager: z.string().optional(),
		hourly_rate: z.string().optional(),
		cost_per_hour: z.string().optional(),
	})
	.strict();
const v12Def_PUV12ProjectRetrieve = z
	.object({
		id: z.string().min(1).optional(),
		name: z.string().min(1).max(100).optional(),
		description: z.string().optional(),
		client: z.string().optional(),
		billing_method: z.string().optional(),
		fixed_cost: z.string().optional(),
		hourly_rate: z.string().optional(),
		billed_amount: z.string().optional(),
		expenses_amount: z.string().optional(),
		unbilled_expenses_amount: z.string().optional(),
		unbilled_hours_amount: z.string().optional(),
		costs: z.string().optional(),
		billable_hours: z.string().optional(),
		total_hours: z.string().optional(),
		unbilled_hours: z.string().optional(),
		unbilled_extra_fees_amount: z.string().optional(),
		members: z.array(v12Def_V12ProjectMemberNestedRetrieve).optional(),
		client_portal: z.string().optional(),
		active: z.boolean().optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_PUV12ProjectAttachmentListRetrieve = z
	.object({
		id: z.string().min(1).optional(),
		title: z.string().min(1).max(120).optional(),
		file_url: z.string().optional(),
		client_portal: z.boolean().optional(),
		created: z.string().optional(),
		file_size: z.string().optional(),
	})
	.strict();
const v12Def_PUV12ProjectExtraFeesSerializer = z
	.object({
		id: z.string().min(1).optional(),
		date: z.string().optional(),
		title: z.string().min(1).max(200).optional(),
		description: z.string().optional(),
		quantity: z.string().optional(),
		amount: z.string().optional(),
		unit_measure: z.string().nullable().optional(),
		product: z.string().nullable().optional(),
		organization: z.number().int().optional(),
	})
	.strict();
const v12Def_V12ProjectExtraFees = z
	.object({
		id: z.string().min(1).optional(),
		date: z.string(),
		title: z.string().min(1).max(200),
		description: z.string().optional(),
		quantity: z.string().optional(),
		amount: z.string().optional(),
		unit_measure: z.string().nullable().optional(),
		product: z.string().nullable().optional(),
		organization: z.number().int().optional(),
	})
	.strict();
const v12Def_PUV12RecurringInvoiceList = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		start_datetime: z.string().optional(),
		interval: z.number().int().min(0).max(2147483647).optional(),
		period: z.string().optional(),
		end_datetime: z.string().optional(),
		last_execution: z.string().optional(),
		next_execution: z.string().optional(),
		paused: z.boolean().optional(),
		representation: z.string().min(1).optional(),
		documenttype: z.string().optional(),
		sequence_flat: z.string().max(10).optional(),
		draft: z.boolean().optional(),
		auto_email: z.boolean().optional(),
		auto_email_attach_pdf: z.boolean().optional(),
		due_days: z.number().int().min(0).max(2147483647).nullable().optional(),
		template: z.string().optional(),
		branch: z.string().nullable().optional(),
		client: z.string().optional(),
		client_profession: z.string().max(100).optional(),
		client_vat_number: z.string().max(20).optional(),
		billing_address: v12Def_BillingAddress.optional(),
		shipping_address: v12Def_ShippingAddress.optional(),
		client_contact_person: z.string().max(101).optional(),
		client_phone_number: z.string().max(30).optional(),
		client_email: z.string().max(100).optional(),
		currency_code: z.string().optional(),
		exchange_rate: z.string().optional(),
		calculator_mode: z.string().optional(),
		initial: z.string().optional(),
		net: z.string().optional(),
		total: z.string().optional(),
		payable: z.string().optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_RecurringInvoiceItemTaxNested = z
	.object({
		tax: z.string(),
		auto_calculate: z.boolean().optional(),
		amount: z.string().optional(),
		vat_amount: z.string().optional(),
		auto_calculate_vat: z.boolean().optional(),
	})
	.strict();
const v12Def_V12RecurringInvoiceItemNestedRetrieveCreate = z
	.object({
		id: z.string().min(1).optional(),
		product: z.string().nullable().optional(),
		title: z.string().min(1).max(200).optional(),
		description: z.string().optional(),
		quantity: z.string().optional(),
		unit_measure: z.string().nullable().optional(),
		unit_value: z.string().optional(),
		unit_value_gross: z.string().optional(),
		unit_discount: z.string().optional(),
		unit_discount_gross: z.string().optional(),
		unit_discount_percentage: z.string().optional(),
		unit_discount_mode: z.string().optional(),
		taxes: z.array(v12Def_RecurringInvoiceItemTaxNested).optional(),
		unit_total: z.string().optional(),
		item_net: z.string().optional(),
		project: z.string().nullable().optional(),
		warehouse: z.string().nullable().optional(),
		line_type: z.number().int().nullable().optional(),
		skip_stock_update: z.boolean().optional(),
	})
	.strict();
const v12Def_RecurringInvoiceStandardTaxNested = z
	.object({
		tax: z.string(),
		auto_calculate: z.boolean().optional(),
		amount: z.string().optional(),
	})
	.strict();
const v12Def_RecurringInvoiceWithholdingTaxNested = z
	.object({
		tax: z.string(),
		amount: z.string().optional(),
		subtotal: z.number().int().optional(),
		auto_calculate: z.boolean().optional(),
	})
	.strict();
const v12Def_V12RecurringInvoiceCreate = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		start_datetime: z.string().optional(),
		interval: z.number().int().min(0).max(2147483647).optional(),
		period: z.string().optional(),
		end_datetime: z.string(),
		last_execution: z.string().optional(),
		next_execution: z.string().optional(),
		paused: z.boolean().optional(),
		representation: z.string().min(1).optional(),
		documenttype: z.string().optional(),
		sequence_flat: z.string().max(10).optional(),
		draft: z.boolean().optional(),
		auto_email: z.boolean().optional(),
		auto_email_attach_pdf: z.boolean().optional(),
		due_days: z.number().int().min(0).max(2147483647).nullable().optional(),
		template: z.string().optional(),
		branch: z.string().nullable().optional(),
		client: z.string(),
		client_display_name: z.string().min(1).max(203).optional(),
		client_profession: z.string().max(100).optional(),
		client_vat_number: z.string().max(20).optional(),
		billing_address: v12Def_BillingAddress.optional(),
		shipping_address: v12Def_ShippingAddress.optional(),
		client_contact_person: z.string().max(101).optional(),
		client_phone_number: z.string().max(30).optional(),
		client_email: z.string().max(100).optional(),
		currency_code: z.string().optional(),
		exchange_rate: z.string().optional(),
		calculator_mode: z.string().optional(),
		items: z.array(v12Def_V12RecurringInvoiceItemNestedRetrieveCreate),
		initial: z.string().optional(),
		net: z.string().optional(),
		taxes: z.array(v12Def_RecurringInvoiceStandardTaxNested).optional(),
		total: z.string().optional(),
		withholding_taxes: z
			.array(v12Def_RecurringInvoiceWithholdingTaxNested)
			.optional(),
		payable: z.string().optional(),
		trackingcategories: z.array(v12Def_RecordTrackingCategoryNested).optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_PUV12RecurringInvoiceCreate = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		start_datetime: z.string().optional(),
		interval: z.number().int().min(0).max(2147483647).optional(),
		period: z.string().optional(),
		end_datetime: z.string().optional(),
		last_execution: z.string().optional(),
		next_execution: z.string().optional(),
		paused: z.boolean().optional(),
		representation: z.string().min(1).optional(),
		documenttype: z.string().optional(),
		sequence_flat: z.string().max(10).optional(),
		draft: z.boolean().optional(),
		auto_email: z.boolean().optional(),
		auto_email_attach_pdf: z.boolean().optional(),
		due_days: z.number().int().min(0).max(2147483647).nullable().optional(),
		template: z.string().optional(),
		branch: z.string().nullable().optional(),
		client: z.string().optional(),
		client_display_name: z.string().min(1).max(203).optional(),
		client_profession: z.string().max(100).optional(),
		client_vat_number: z.string().max(20).optional(),
		billing_address: v12Def_BillingAddress.optional(),
		shipping_address: v12Def_ShippingAddress.optional(),
		client_contact_person: z.string().max(101).optional(),
		client_phone_number: z.string().max(30).optional(),
		client_email: z.string().max(100).optional(),
		currency_code: z.string().optional(),
		exchange_rate: z.string().optional(),
		calculator_mode: z.string().optional(),
		items: z
			.array(v12Def_V12RecurringInvoiceItemNestedRetrieveCreate)
			.optional(),
		initial: z.string().optional(),
		net: z.string().optional(),
		taxes: z.array(v12Def_RecurringInvoiceStandardTaxNested).optional(),
		total: z.string().optional(),
		withholding_taxes: z
			.array(v12Def_RecurringInvoiceWithholdingTaxNested)
			.optional(),
		payable: z.string().optional(),
		trackingcategories: z.array(v12Def_RecordTrackingCategoryNested).optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_PUV12RecurringInvoiceRetrieve = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		start_datetime: z.string().optional(),
		interval: z.number().int().min(0).max(2147483647).optional(),
		period: z.string().optional(),
		end_datetime: z.string().optional(),
		last_execution: z.string().optional(),
		next_execution: z.string().optional(),
		paused: z.boolean().optional(),
		representation: z.string().min(1).optional(),
		documenttype: z.string().optional(),
		sequence_flat: z.string().max(10).optional(),
		draft: z.boolean().optional(),
		auto_email: z.boolean().optional(),
		auto_email_attach_pdf: z.boolean().optional(),
		due_days: z.number().int().min(0).max(2147483647).nullable().optional(),
		template: z.string().optional(),
		branch: z.string().nullable().optional(),
		client: z.string().optional(),
		client_display_name: z.string().min(1).max(203).optional(),
		client_profession: z.string().max(100).optional(),
		client_vat_number: z.string().max(20).optional(),
		billing_address: v12Def_BillingAddress.optional(),
		shipping_address: v12Def_ShippingAddress.optional(),
		client_contact_person: z.string().max(101).optional(),
		client_phone_number: z.string().max(30).optional(),
		client_email: z.string().max(100).optional(),
		currency_code: z.string().optional(),
		exchange_rate: z.string().optional(),
		calculator_mode: z.string().optional(),
		items: z
			.array(v12Def_V12RecurringInvoiceItemNestedRetrieveCreate)
			.optional(),
		initial: z.string().optional(),
		net: z.string().optional(),
		taxes: z.array(v12Def_RecurringInvoiceStandardTaxNested).optional(),
		total: z.string().optional(),
		withholding_taxes: z
			.array(v12Def_RecurringInvoiceWithholdingTaxNested)
			.optional(),
		payable: z.string().optional(),
		trackingcategories: z.array(v12Def_RecordTrackingCategoryNested).optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_V12RecurringInvoiceItemNestedUpdate = z
	.object({
		id: z.string().min(1).optional(),
		product: z.string().nullable().optional(),
		title: z.string().min(1).max(200).optional(),
		description: z.string().optional(),
		quantity: z.string().optional(),
		unit_measure: z.string().nullable().optional(),
		unit_value: z.string().optional(),
		unit_value_gross: z.string().optional(),
		unit_discount: z.string().optional(),
		unit_discount_gross: z.string().optional(),
		unit_discount_percentage: z.string().optional(),
		unit_discount_mode: z.string().optional(),
		taxes: z.array(v12Def_RecurringInvoiceItemTaxNested).optional(),
		unit_total: z.string().optional(),
		item_net: z.string().optional(),
		project: z.string().nullable().optional(),
		warehouse: z.string().nullable().optional(),
		line_type: z.number().int().nullable().optional(),
		skip_stock_update: z.boolean().optional(),
	})
	.strict();
const v12Def_V12RecurringInvoiceUpdate = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		start_datetime: z.string().optional(),
		interval: z.number().int().min(0).max(2147483647).optional(),
		period: z.string().optional(),
		end_datetime: z.string(),
		last_execution: z.string().optional(),
		next_execution: z.string().optional(),
		paused: z.boolean().optional(),
		representation: z.string().min(1).optional(),
		documenttype: z.string().optional(),
		sequence_flat: z.string().max(10).optional(),
		draft: z.boolean().optional(),
		auto_email: z.boolean().optional(),
		auto_email_attach_pdf: z.boolean().optional(),
		due_days: z.number().int().min(0).max(2147483647).nullable().optional(),
		template: z.string().optional(),
		branch: z.string().nullable().optional(),
		client: z.string(),
		client_display_name: z.string().min(1).max(203).optional(),
		client_profession: z.string().max(100).optional(),
		client_vat_number: z.string().max(20).optional(),
		billing_address: v12Def_BillingAddress.optional(),
		shipping_address: v12Def_ShippingAddress.optional(),
		client_contact_person: z.string().max(101).optional(),
		client_phone_number: z.string().max(30).optional(),
		client_email: z.string().max(100).optional(),
		currency_code: z.string().optional(),
		exchange_rate: z.string().optional(),
		calculator_mode: z.string().optional(),
		items: z.array(v12Def_V12RecurringInvoiceItemNestedUpdate),
		initial: z.string().optional(),
		net: z.string().optional(),
		taxes: z.array(v12Def_RecurringInvoiceStandardTaxNested).optional(),
		total: z.string().optional(),
		withholding_taxes: z
			.array(v12Def_RecurringInvoiceWithholdingTaxNested)
			.optional(),
		payable: z.string().optional(),
		trackingcategories: z.array(v12Def_RecordTrackingCategoryNested).optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_PUV12RecurringInvoiceUpdate = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		start_datetime: z.string().optional(),
		interval: z.number().int().min(0).max(2147483647).optional(),
		period: z.string().optional(),
		end_datetime: z.string().optional(),
		last_execution: z.string().optional(),
		next_execution: z.string().optional(),
		paused: z.boolean().optional(),
		representation: z.string().min(1).optional(),
		documenttype: z.string().optional(),
		sequence_flat: z.string().max(10).optional(),
		draft: z.boolean().optional(),
		auto_email: z.boolean().optional(),
		auto_email_attach_pdf: z.boolean().optional(),
		due_days: z.number().int().min(0).max(2147483647).nullable().optional(),
		template: z.string().optional(),
		branch: z.string().nullable().optional(),
		client: z.string().optional(),
		client_display_name: z.string().min(1).max(203).optional(),
		client_profession: z.string().max(100).optional(),
		client_vat_number: z.string().max(20).optional(),
		billing_address: v12Def_BillingAddress.optional(),
		shipping_address: v12Def_ShippingAddress.optional(),
		client_contact_person: z.string().max(101).optional(),
		client_phone_number: z.string().max(30).optional(),
		client_email: z.string().max(100).optional(),
		currency_code: z.string().optional(),
		exchange_rate: z.string().optional(),
		calculator_mode: z.string().optional(),
		items: z.array(v12Def_V12RecurringInvoiceItemNestedUpdate).optional(),
		initial: z.string().optional(),
		net: z.string().optional(),
		taxes: z.array(v12Def_RecurringInvoiceStandardTaxNested).optional(),
		total: z.string().optional(),
		withholding_taxes: z
			.array(v12Def_RecurringInvoiceWithholdingTaxNested)
			.optional(),
		payable: z.string().optional(),
		trackingcategories: z.array(v12Def_RecordTrackingCategoryNested).optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_PUV12PurchaseCreditNoteList = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		representation: z.string().min(1).optional(),
		status: z.string().optional(),
		draft: z.boolean().optional(),
		documenttype: z.string().nullable().optional(),
		self_billed: z.boolean().optional(),
		sequence_flat: z.string().max(10).optional(),
		reference: z.string().max(150).optional(),
		date: z.string().optional(),
		branch: z.string().nullable().optional(),
		supplier: z.string().optional(),
		currency_code: z.string().optional(),
		exchange_rate: z.string().optional(),
		calculator_mode: z.string().optional(),
		initial: z.string().optional(),
		net: z.string().optional(),
		total: z.string().optional(),
		payable: z.string().optional(),
		paid: z.string().optional(),
		permalink: z.string().nullable().optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_PurchaseCreditNoteRelatedEntities = z
	.object({
		id: z.string().min(1).optional(),
		contact: z.string(),
		contact_display_name: z.string().min(1).max(203),
		contact_vat_number: z.string().max(20).optional(),
		type: z.number().int(),
		billing_address: v12Def_BillingAddress.optional(),
	})
	.strict();
const v12Def_PurchaseCreditNotePackageNested = z
	.object({
		id: z.string().min(1).optional(),
		packaging_type: z.number().int(),
		quantity: z.number().int().min(1).max(32767),
		other_packaging_type_title: z.string().max(150).optional(),
	})
	.strict();
const v12Def_PurchaseCreditNoteItemTaxNested = z
	.object({
		tax: z.string(),
		auto_calculate: z.boolean().optional(),
		amount: z.string().optional(),
		vat_amount: z.string().optional(),
		auto_calculate_vat: z.boolean().optional(),
	})
	.strict();
const v12Def_V12PurchaseCreditNoteItemNestedCreate = z
	.object({
		id: z.string().min(1).optional(),
		product: z.string().nullable().optional(),
		description: z.string().optional(),
		quantity: z.string().optional(),
		unit_measure: z.string().nullable().optional(),
		unit_value: z.string().optional(),
		unit_value_gross: z.string().optional(),
		unit_discount: z.string().optional(),
		unit_discount_gross: z.string().optional(),
		unit_discount_percentage: z.string().optional(),
		unit_discount_mode: z.string().optional(),
		taxes: z.array(v12Def_PurchaseCreditNoteItemTaxNested).optional(),
		unit_total: z.string().optional(),
		item_net: z.string().optional(),
		project: z.string().nullable().optional(),
		billable: z.boolean().optional(),
		expense_category: z.string().nullable().optional(),
		taric_code: z.string().min(10).max(10).optional(),
		warehouse: z.string().nullable().optional(),
		line_type: z.number().int().nullable().optional(),
		skip_stock_update: z.boolean().optional(),
	})
	.strict();
const v12Def_PurchaseCreditNoteStandardTaxNested = z
	.object({
		tax: z.string(),
		auto_calculate: z.boolean().optional(),
		amount: z.string().optional(),
	})
	.strict();
const v12Def_PurchaseCreditNoteWithholdingTaxNested = z
	.object({
		tax: z.string(),
		amount: z.string().optional(),
		subtotal: z.number().int().optional(),
		auto_calculate: z.boolean().optional(),
	})
	.strict();
const v12Def_V12PurchaseCreditNoteCreate = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		representation: z.string().min(1).optional(),
		status: z.string().optional(),
		draft: z.boolean().optional(),
		documenttype: z.string().nullable().optional(),
		self_billed: z.boolean().optional(),
		sequence_flat: z.string().max(10).optional(),
		reference: z.string().max(150).optional(),
		date: z.string().optional(),
		branch: z.string().nullable().optional(),
		supplier: z.string(),
		supplier_display_name: z.string().max(203).optional(),
		supplier_profession: z.string().max(100).optional(),
		supplier_vat_number: z.string().max(20).optional(),
		billing_address: v12Def_BillingAddress.optional(),
		shipping_address: v12Def_ShippingAddress.optional(),
		supplier_contact_person: z.string().max(101).optional(),
		supplier_phone_number: z.string().max(30).optional(),
		supplier_email: z.string().max(100).optional(),
		loading_address: v12Def_LoadingAddress.optional(),
		dispatch_date: z.string().nullable().optional(),
		dispatch_time: z.string().nullable().optional(),
		vehicle_number: z.string().max(150).optional(),
		move_purpose: z.number().int().nullable().optional(),
		related_entities: z
			.array(v12Def_PurchaseCreditNoteRelatedEntities)
			.nullable()
			.optional(),
		packages: z
			.array(v12Def_PurchaseCreditNotePackageNested)
			.nullable()
			.optional(),
		currency_code: z.string().optional(),
		exchange_rate: z.string().optional(),
		calculator_mode: z.string().optional(),
		items: z.array(v12Def_V12PurchaseCreditNoteItemNestedCreate),
		initial: z.string().optional(),
		net: z.string().optional(),
		taxes: z.array(v12Def_PurchaseCreditNoteStandardTaxNested).optional(),
		total: z.string().optional(),
		withholding_taxes: z
			.array(v12Def_PurchaseCreditNoteWithholdingTaxNested)
			.optional(),
		payable: z.string().optional(),
		paid: z.string().optional(),
		template: z.string().nullable().optional(),
		public_notes: z.string().optional(),
		trackingcategories: z.array(v12Def_RecordTrackingCategoryNested).optional(),
		related_documents: z.array(z.string()).optional(),
		permalink: z.string().nullable().optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_PUV12PurchaseCreditNoteCreate = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		representation: z.string().min(1).optional(),
		status: z.string().optional(),
		draft: z.boolean().optional(),
		documenttype: z.string().nullable().optional(),
		self_billed: z.boolean().optional(),
		sequence_flat: z.string().max(10).optional(),
		reference: z.string().max(150).optional(),
		date: z.string().optional(),
		branch: z.string().nullable().optional(),
		supplier: z.string().optional(),
		supplier_display_name: z.string().max(203).optional(),
		supplier_profession: z.string().max(100).optional(),
		supplier_vat_number: z.string().max(20).optional(),
		billing_address: v12Def_BillingAddress.optional(),
		shipping_address: v12Def_ShippingAddress.optional(),
		supplier_contact_person: z.string().max(101).optional(),
		supplier_phone_number: z.string().max(30).optional(),
		supplier_email: z.string().max(100).optional(),
		loading_address: v12Def_LoadingAddress.optional(),
		dispatch_date: z.string().nullable().optional(),
		dispatch_time: z.string().nullable().optional(),
		vehicle_number: z.string().max(150).optional(),
		move_purpose: z.number().int().nullable().optional(),
		related_entities: z
			.array(v12Def_PurchaseCreditNoteRelatedEntities)
			.nullable()
			.optional(),
		packages: z
			.array(v12Def_PurchaseCreditNotePackageNested)
			.nullable()
			.optional(),
		currency_code: z.string().optional(),
		exchange_rate: z.string().optional(),
		calculator_mode: z.string().optional(),
		items: z.array(v12Def_V12PurchaseCreditNoteItemNestedCreate).optional(),
		initial: z.string().optional(),
		net: z.string().optional(),
		taxes: z.array(v12Def_PurchaseCreditNoteStandardTaxNested).optional(),
		total: z.string().optional(),
		withholding_taxes: z
			.array(v12Def_PurchaseCreditNoteWithholdingTaxNested)
			.optional(),
		payable: z.string().optional(),
		paid: z.string().optional(),
		template: z.string().nullable().optional(),
		public_notes: z.string().optional(),
		trackingcategories: z.array(v12Def_RecordTrackingCategoryNested).optional(),
		related_documents: z.array(z.string()).optional(),
		permalink: z.string().nullable().optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_V12PurchaseCreditNoteItemNestedRetrieveUpdate = z
	.object({
		id: z.string().min(1).optional(),
		product: z.string().nullable().optional(),
		description: z.string().optional(),
		quantity: z.string().optional(),
		unit_measure: z.string().nullable().optional(),
		unit_value: z.string().optional(),
		unit_value_gross: z.string().optional(),
		unit_discount: z.string().optional(),
		unit_discount_gross: z.string().optional(),
		unit_discount_percentage: z.string().optional(),
		unit_discount_mode: z.string().optional(),
		taxes: z.array(v12Def_PurchaseCreditNoteItemTaxNested).optional(),
		unit_total: z.string().optional(),
		item_net: z.string().optional(),
		project: z.string().nullable().optional(),
		billable: z.boolean().optional(),
		expense_category: z.string().nullable().optional(),
		taric_code: z.string().min(10).max(10).optional(),
		warehouse: z.string().nullable().optional(),
		line_type: z.number().int().nullable().optional(),
		skip_stock_update: z.boolean().optional(),
	})
	.strict();
const v12Def_PUV12PurchaseCreditNoteRetrieve = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		representation: z.string().min(1).optional(),
		status: z.string().optional(),
		draft: z.boolean().optional(),
		documenttype: z.string().nullable().optional(),
		self_billed: z.boolean().optional(),
		sequence_flat: z.string().max(10).optional(),
		reference: z.string().max(150).optional(),
		date: z.string().optional(),
		branch: z.string().nullable().optional(),
		supplier: z.string().optional(),
		supplier_display_name: z.string().max(203).optional(),
		supplier_profession: z.string().max(100).optional(),
		supplier_vat_number: z.string().max(20).optional(),
		billing_address: v12Def_BillingAddress.optional(),
		shipping_address: v12Def_ShippingAddress.optional(),
		supplier_contact_person: z.string().max(101).optional(),
		supplier_phone_number: z.string().max(30).optional(),
		supplier_email: z.string().max(100).optional(),
		loading_address: v12Def_LoadingAddress.optional(),
		dispatch_date: z.string().nullable().optional(),
		dispatch_time: z.string().nullable().optional(),
		vehicle_number: z.string().max(150).optional(),
		move_purpose: z.number().int().nullable().optional(),
		related_entities: z
			.array(v12Def_PurchaseCreditNoteRelatedEntities)
			.nullable()
			.optional(),
		packages: z
			.array(v12Def_PurchaseCreditNotePackageNested)
			.nullable()
			.optional(),
		currency_code: z.string().optional(),
		exchange_rate: z.string().optional(),
		calculator_mode: z.string().optional(),
		items: z
			.array(v12Def_V12PurchaseCreditNoteItemNestedRetrieveUpdate)
			.optional(),
		initial: z.string().optional(),
		net: z.string().optional(),
		taxes: z.array(v12Def_PurchaseCreditNoteStandardTaxNested).optional(),
		total: z.string().optional(),
		withholding_taxes: z
			.array(v12Def_PurchaseCreditNoteWithholdingTaxNested)
			.optional(),
		payable: z.string().optional(),
		paid: z.string().optional(),
		template: z.string().nullable().optional(),
		public_notes: z.string().optional(),
		trackingcategories: z.array(v12Def_RecordTrackingCategoryNested).optional(),
		related_documents: z.array(z.string()).optional(),
		permalink: z.string().nullable().optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_V12PurchaseCreditNoteUpdate = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		representation: z.string().min(1).optional(),
		status: z.string().optional(),
		draft: z.boolean().optional(),
		documenttype: z.string().nullable().optional(),
		self_billed: z.boolean().optional(),
		sequence_flat: z.string().max(10).optional(),
		reference: z.string().max(150).optional(),
		date: z.string().optional(),
		branch: z.string().nullable().optional(),
		supplier: z.string(),
		supplier_display_name: z.string().max(203).optional(),
		supplier_profession: z.string().max(100).optional(),
		supplier_vat_number: z.string().max(20).optional(),
		billing_address: v12Def_BillingAddress.optional(),
		shipping_address: v12Def_ShippingAddress.optional(),
		supplier_contact_person: z.string().max(101).optional(),
		supplier_phone_number: z.string().max(30).optional(),
		supplier_email: z.string().max(100).optional(),
		loading_address: v12Def_LoadingAddress.optional(),
		dispatch_date: z.string().nullable().optional(),
		dispatch_time: z.string().nullable().optional(),
		vehicle_number: z.string().max(150).optional(),
		move_purpose: z.number().int().nullable().optional(),
		related_entities: z
			.array(v12Def_PurchaseCreditNoteRelatedEntities)
			.nullable()
			.optional(),
		packages: z
			.array(v12Def_PurchaseCreditNotePackageNested)
			.nullable()
			.optional(),
		currency_code: z.string().optional(),
		exchange_rate: z.string().optional(),
		calculator_mode: z.string().optional(),
		items: z.array(v12Def_V12PurchaseCreditNoteItemNestedRetrieveUpdate),
		initial: z.string().optional(),
		net: z.string().optional(),
		taxes: z.array(v12Def_PurchaseCreditNoteStandardTaxNested).optional(),
		total: z.string().optional(),
		withholding_taxes: z
			.array(v12Def_PurchaseCreditNoteWithholdingTaxNested)
			.optional(),
		payable: z.string().optional(),
		paid: z.string().optional(),
		template: z.string().nullable().optional(),
		public_notes: z.string().optional(),
		trackingcategories: z.array(v12Def_RecordTrackingCategoryNested).optional(),
		related_documents: z.array(z.string()).optional(),
		permalink: z.string().nullable().optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_PUV12PurchaseCreditNoteUpdate = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		representation: z.string().min(1).optional(),
		status: z.string().optional(),
		draft: z.boolean().optional(),
		documenttype: z.string().nullable().optional(),
		self_billed: z.boolean().optional(),
		sequence_flat: z.string().max(10).optional(),
		reference: z.string().max(150).optional(),
		date: z.string().optional(),
		branch: z.string().nullable().optional(),
		supplier: z.string().optional(),
		supplier_display_name: z.string().max(203).optional(),
		supplier_profession: z.string().max(100).optional(),
		supplier_vat_number: z.string().max(20).optional(),
		billing_address: v12Def_BillingAddress.optional(),
		shipping_address: v12Def_ShippingAddress.optional(),
		supplier_contact_person: z.string().max(101).optional(),
		supplier_phone_number: z.string().max(30).optional(),
		supplier_email: z.string().max(100).optional(),
		loading_address: v12Def_LoadingAddress.optional(),
		dispatch_date: z.string().nullable().optional(),
		dispatch_time: z.string().nullable().optional(),
		vehicle_number: z.string().max(150).optional(),
		move_purpose: z.number().int().nullable().optional(),
		related_entities: z
			.array(v12Def_PurchaseCreditNoteRelatedEntities)
			.nullable()
			.optional(),
		packages: z
			.array(v12Def_PurchaseCreditNotePackageNested)
			.nullable()
			.optional(),
		currency_code: z.string().optional(),
		exchange_rate: z.string().optional(),
		calculator_mode: z.string().optional(),
		items: z
			.array(v12Def_V12PurchaseCreditNoteItemNestedRetrieveUpdate)
			.optional(),
		initial: z.string().optional(),
		net: z.string().optional(),
		taxes: z.array(v12Def_PurchaseCreditNoteStandardTaxNested).optional(),
		total: z.string().optional(),
		withholding_taxes: z
			.array(v12Def_PurchaseCreditNoteWithholdingTaxNested)
			.optional(),
		payable: z.string().optional(),
		paid: z.string().optional(),
		template: z.string().nullable().optional(),
		public_notes: z.string().optional(),
		trackingcategories: z.array(v12Def_RecordTrackingCategoryNested).optional(),
		related_documents: z.array(z.string()).optional(),
		permalink: z.string().nullable().optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_PUV12PurchaseCreditNotePartialUpdate = z
	.object({
		id: z.string().min(1).optional(),
		custom_id: z.string().max(256).optional(),
		representation: z.string().min(1).optional(),
		status: z.string().optional(),
		draft: z.boolean().optional(),
		exchange_rate: z.string().optional(),
		trackingcategories: z.array(v12Def_RecordTrackingCategoryNested).optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_PrivatePurchaseCreditNoteEmailFromTemplate = z
	.object({
		to: z.string().min(1),
		store_to: z.boolean().optional(),
		cc: z.array(z.string().min(1)).optional(),
		bcc: z.array(z.string().min(1)).optional(),
		reply_to: z.string().optional(),
		attach_pdf: z.boolean().optional(),
		attachments: z.array(z.string()).optional(),
	})
	.strict();
const v12Def_PrivatePurchaseCreditNoteEmail = z
	.object({
		to: z.string().min(1),
		store_to: z.boolean().optional(),
		cc: z.array(z.string().min(1)),
		bcc: z.array(z.string().min(1)),
		reply_to: z.string().optional(),
		subject: z.string().min(1).max(255),
		message: z.string().min(1),
		attach_pdf: z.boolean(),
		sender_name: z.string().min(1).max(70).optional(),
		attachments: z.array(z.string()).optional(),
	})
	.strict();
const v12Def_PUPurchaseCreditNoteMarkVoidResponse = z
	.object({
		status: z.string().optional(),
	})
	.strict();
const v12Def_PUV12PurchaseCreditTransactionPCNListCreate = z
	.object({
		id: z.string().min(1).optional(),
		representation: z.string().optional(),
		purchase: z.string().optional(),
		date: z.string().optional(),
		currency_code: z.string().optional(),
		amount: z.string().optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_V12PurchaseCreditTransactionPCNListCreate = z
	.object({
		id: z.string().min(1).optional(),
		representation: z.string().optional(),
		purchase: z.string(),
		date: z.string().optional(),
		currency_code: z.string().optional(),
		amount: z.string(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_PUV12PurchaseCreditNoteAttachmentListRetrieve = z
	.object({
		id: z.string().min(1).optional(),
		title: z.string().min(1).max(120).optional(),
		primary: z.boolean().optional(),
		file_url: z.string().optional(),
		file_size: z.string().optional(),
		created: z.string().optional(),
	})
	.strict();
const v12Def_PUV12TaskSerializer = z
	.object({
		id: z.string().min(1).optional(),
		name: z.string().min(1).max(150).optional(),
		description: z.string().optional(),
		hourly_rate: z.string().optional(),
		project: z.string().nullable().optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
		active: z.boolean().optional(),
	})
	.strict();
const v12Def_V12Task = z
	.object({
		id: z.string().min(1).optional(),
		name: z.string().min(1).max(150),
		description: z.string().optional(),
		hourly_rate: z.string().optional(),
		project: z.string().nullable().optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
		active: z.boolean().optional(),
	})
	.strict();
const v12Def_V12TaskUpdate = z
	.object({
		id: z.string().min(1).optional(),
		name: z.string().min(1).max(150),
		description: z.string().optional(),
		hourly_rate: z.string().optional(),
		project: z.string().optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
		active: z.boolean().optional(),
	})
	.strict();
const v12Def_PUV12TaskUpdate = z
	.object({
		id: z.string().min(1).optional(),
		name: z.string().min(1).max(150).optional(),
		description: z.string().optional(),
		hourly_rate: z.string().optional(),
		project: z.string().optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
		active: z.boolean().optional(),
	})
	.strict();
const v12Def_PUV12TaxList = z
	.object({
		id: z.string().min(1).optional(),
		title: z.string().min(1).max(150).optional(),
		tax_type: z.string().optional(),
		value_mode: z.string().optional(),
		operand: z.string().optional(),
		percentage: z.string().optional(),
		amount: z.string().optional(),
		per_unit: z.boolean().optional(),
		subject_to_vat: z.boolean().optional(),
		apply_on_document_lines: z.boolean().optional(),
		for_information_purposes: z.boolean().optional(),
		active: z.boolean().optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_PUV12TaxRetrieve = z
	.object({
		id: z.string().min(1).optional(),
		title: z.string().min(1).max(150).optional(),
		title_translations: z
			.object({
				bg: z.string().optional(),
				de: z.string().optional(),
				el: z.string().optional(),
				en: z.string().optional(),
				'en-gb': z.string().optional(),
				es: z.string().optional(),
				fr: z.string().optional(),
				it: z.string().optional(),
			})
			.strict()
			.optional(),
		tax_type: z.string().optional(),
		value_mode: z.string().optional(),
		operand: z.string().optional(),
		percentage: z.string().optional(),
		amount: z.string().optional(),
		per_unit: z.boolean().optional(),
		subject_to_vat: z.boolean().optional(),
		apply_on_document_lines: z.boolean().optional(),
		for_information_purposes: z.boolean().optional(),
		active: z.boolean().optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_PUV12ThemeListRetrieve = z
	.object({
		id: z.string().min(1).optional(),
		active: z.boolean().optional(),
		default: z.boolean().optional(),
		title: z.string().min(1).max(30).optional(),
		template: z.string().optional(),
		language: z.string().optional(),
		company_name: z.string().max(70).optional(),
		company_info: z.string().optional(),
		invoice_terms: z.string().optional(),
		creditnote_terms: z.string().optional(),
		estimate_terms: z.string().optional(),
		invoice_public_notes: z.string().optional(),
		creditnote_public_notes: z.string().optional(),
		estimate_public_notes: z.string().optional(),
		self_billed_public_notes: z.string().optional(),
		self_billed_supplier_credit_public_notes: z.string().optional(),
		deliverynote_public_notes: z.string().optional(),
		goodsreceipt_public_notes: z.string().optional(),
		slogan: z.string().max(200).optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_PUV12TimeEntryListRetrieve = z
	.object({
		id: z.string().min(1).optional(),
		start_datetime: z.string().optional(),
		end_datetime: z.string().optional(),
		duration: z.number().int().optional(),
		project: z.string().nullable().optional(),
		task: z.string().nullable().optional(),
		description: z.string().optional(),
		assignee: z.number().int().optional(),
		user_team: z.string().nullable().optional(),
		assignee_email: z.string().optional(),
		billable: z.boolean().optional(),
		invoiceitem: z.string().optional(),
		forcibly_billed: z.boolean().optional(),
		is_billed: z.string().optional(),
		project_billing_method: z.string().optional(),
		project_active: z.string().optional(),
		task_active: z.string().optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_V12TimeEntryCreateUpdate = z
	.object({
		id: z.string().min(1).optional(),
		start_datetime: z.string(),
		end_datetime: z.string(),
		project: z.string().nullable().optional(),
		task: z.string().nullable().optional(),
		description: z.string().optional(),
		assignee: z.number().int(),
		user_team: z.string().nullable().optional(),
		billable: z.boolean().optional(),
		invoiceitem: z.string().optional(),
		forcibly_billed: z.boolean().optional(),
		is_billed: z.string().optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_PUV12TimeEntryCreateUpdate = z
	.object({
		id: z.string().min(1).optional(),
		start_datetime: z.string().optional(),
		end_datetime: z.string().optional(),
		project: z.string().nullable().optional(),
		task: z.string().nullable().optional(),
		description: z.string().optional(),
		assignee: z.number().int().optional(),
		user_team: z.string().nullable().optional(),
		billable: z.boolean().optional(),
		invoiceitem: z.string().optional(),
		forcibly_billed: z.boolean().optional(),
		is_billed: z.string().optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_PUV12TrackingCategoryListRetrieve = z
	.object({
		id: z.string().min(1).optional(),
		title: z.string().min(1).max(255).optional(),
		active: z.boolean().optional(),
		options: z.array(z.string()).optional(),
		application: z.array(z.string()).optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_PUV12UnitOfMeasurementListSerializer = z
	.object({
		id: z.string().min(1).optional(),
		title: z.string().min(1).max(150).optional(),
		symbol: z.string().min(1).max(150).optional(),
		symbol_translations: z
			.object({
				bg: z.string().optional(),
				de: z.string().optional(),
				el: z.string().optional(),
				en: z.string().optional(),
				'en-gb': z.string().optional(),
				es: z.string().optional(),
				fr: z.string().optional(),
				it: z.string().optional(),
			})
			.strict()
			.optional(),
		group_id: z.string().optional(),
		active: z.boolean().optional(),
		protected: z.boolean().optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_V12UnitOfMeasurementList = z
	.object({
		id: z.string().min(1).optional(),
		title: z.string().min(1).max(150),
		symbol: z.string().min(1).max(150),
		symbol_translations: z
			.object({
				bg: z.string().optional(),
				de: z.string().optional(),
				el: z.string().optional(),
				en: z.string().optional(),
				'en-gb': z.string().optional(),
				es: z.string().optional(),
				fr: z.string().optional(),
				it: z.string().optional(),
			})
			.strict()
			.optional(),
		group_id: z.string(),
		active: z.boolean().optional(),
		protected: z.boolean().optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_PUV12RoleList = z
	.object({
		user_id: z.string().optional(),
		first_name: z.string().optional(),
		last_name: z.string().optional(),
		email: z.string().optional(),
		active: z.boolean().optional(),
		created: z.string().optional(),
	})
	.strict();
const v12Def_PUV12UserTeam = z
	.object({
		id: z.string().min(1).optional(),
		team_name: z.string().min(1).max(255).optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_WarehouseAddress = z
	.object({
		address_line: z.string().max(200),
		city: z.string().max(100),
		state: z.string().max(100).optional(),
		zip: z.string().max(20),
		country: z.string(),
	})
	.strict();
const v12Def_PUV12WarehouseSerializer = z
	.object({
		id: z.string().min(1).optional(),
		name: z.string().min(1).max(100).optional(),
		warehouse_address: v12Def_WarehouseAddress.optional(),
		default: z.boolean().optional(),
		active: z.boolean().optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();
const v12Def_V12Warehouse = z
	.object({
		id: z.string().min(1).optional(),
		name: z.string().min(1).max(100),
		warehouse_address: v12Def_WarehouseAddress,
		default: z.boolean().optional(),
		active: z.boolean().optional(),
		organization: z.number().int().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.strict();

const input_v11_bills_list = z
	.object({
		query: withTrackingCategoryFilters(
			z.object({
				ordering: z.string().optional(),
				search: z.string().optional(),
				search_fields: z.string().optional(),
				period_from: z.string().optional(),
				period_to: z.string().optional(),
				period: z.string().optional(),
				status: z.string().optional(),
				draft: z.string().optional(),
				pending_approval: z.string().optional(),
				fpaid: z.string().optional(),
				is_void: z.string().optional(),
				overdue: z.string().optional(),
				supplier: z.string().optional(),
				currency_code: z.string().optional(),
				documenttype: z.string().optional(),
				self_billed: z.string().optional(),
				sequence: z.string().optional(),
				custom_id: z.string().optional(),
				created_after: z.string().optional(),
				created_before: z.string().optional(),
				modified_after: z.string().optional(),
				modified_before: z.string().optional(),
				modified_period: z.string().optional(),
				created_period: z.string().optional(),
				page: z.number().int().optional(),
				page_size: z.number().int().optional(),
			}),
		).optional(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_bills_list = z
	.object({
		count: z.number().int(),
		next: z.string().nullable().optional(),
		previous: z.string().nullable().optional(),
		results: z.array(v11Def_PUV11PurchaseList),
	})
	.strict();
const input_v11_bills_create = z
	.object({
		body: v11Def_V11PurchaseCreate,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_bills_create = v11Def_PUV11PurchaseCreate;
const input_v11_bills_read = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_bills_read = v11Def_PUV11PurchaseRetrieveUpdate;
const input_v11_bills_update = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		body: v11Def_V11PurchaseRetrieveUpdate,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_bills_update = v11Def_PUV11PurchaseRetrieveUpdate;
const input_v11_bills_partial_update = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		body: v11Def_PUV11PurchasePartialUpdate,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_bills_partial_update = v11Def_PUV11PurchasePartialUpdate;
const input_v11_bills_delete = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_bills_delete = z.undefined();
const input_v11_bills_email_from_template = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		query: z.object({ template_id: z.string().optional() }).strict().optional(),
		body: v11Def_PrivatePurchaseEmailFromTemplate,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_bills_email_from_template = v11Def_TrackedEmailMessage;
const input_v11_bills_email_read = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_bills_email_read = v11Def_PUEmailRetrieveSerializer;
const input_v11_bills_email_create = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		body: v11Def_PrivatePurchaseEmail,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_bills_email_create = v11Def_TrackedEmailMessage;
const input_v11_bills_pdf = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_bills_pdf = ElorusBinaryResponseSchema;
const input_v11_bills_mark_void = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		body: v11Def_VoidDocument,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_bills_mark_void = v11Def_PUPurchaseMarkVoidResponse;
const input_v11_cashpayments_list = z
	.object({
		query: withTrackingCategoryFilters(
			z.object({
				ordering: z.string().optional(),
				search: z.string().optional(),
				search_fields: z.string().optional(),
				period_from: z.string().optional(),
				period_to: z.string().optional(),
				period: z.string().optional(),
				contact: z.string().optional(),
				currency_code: z.string().optional(),
				transaction_type: z.string().optional(),
				purchase: z.string().optional(),
				creditnote: z.string().optional(),
				custom_id: z.string().optional(),
				created_after: z.string().optional(),
				created_before: z.string().optional(),
				modified_after: z.string().optional(),
				modified_before: z.string().optional(),
				modified_period: z.string().optional(),
				created_period: z.string().optional(),
				page: z.number().int().optional(),
				page_size: z.number().int().optional(),
			}),
		).optional(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_cashpayments_list = z
	.object({
		count: z.number().int(),
		next: z.string().nullable().optional(),
		previous: z.string().nullable().optional(),
		results: z.array(v11Def_PUV11CashPaymentList),
	})
	.strict();
const input_v11_cashpayments_create = z
	.object({
		body: v11Def_V11CashPaymentCreate,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_cashpayments_create = v11Def_PUV11CashPaymentCreate;
const input_v11_cashpayments_read = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_cashpayments_read = v11Def_PUV11CashPaymentRetrieve;
const input_v11_cashpayments_update = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		body: v11Def_V11CashPaymentUpdate,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_cashpayments_update = v11Def_PUV11CashPaymentUpdate;
const input_v11_cashpayments_delete = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_cashpayments_delete = z.undefined();
const input_v11_cashpayments_pdf = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_cashpayments_pdf = ElorusBinaryResponseSchema;
const input_v11_cashreceipts_list = z
	.object({
		query: withTrackingCategoryFilters(
			z.object({
				ordering: z.string().optional(),
				search: z.string().optional(),
				search_fields: z.string().optional(),
				period_from: z.string().optional(),
				period_to: z.string().optional(),
				period: z.string().optional(),
				contact: z.string().optional(),
				currency_code: z.string().optional(),
				pending_approval: z.string().optional(),
				is_void: z.string().optional(),
				transaction_type: z.string().optional(),
				invoice: z.string().optional(),
				purchasecreditnote: z.string().optional(),
				custom_id: z.string().optional(),
				created_after: z.string().optional(),
				created_before: z.string().optional(),
				modified_after: z.string().optional(),
				modified_before: z.string().optional(),
				modified_period: z.string().optional(),
				created_period: z.string().optional(),
				page: z.number().int().optional(),
				page_size: z.number().int().optional(),
			}),
		).optional(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_cashreceipts_list = z
	.object({
		count: z.number().int(),
		next: z.string().nullable().optional(),
		previous: z.string().nullable().optional(),
		results: z.array(v11Def_PUV11CashReceiptList),
	})
	.strict();
const input_v11_cashreceipts_create = z
	.object({
		body: v11Def_V11CashReceiptCreate,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_cashreceipts_create = v11Def_PUV11CashReceiptCreate;
const input_v11_cashreceipts_read = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_cashreceipts_read = v11Def_PUV11CashReceiptRetrieve;
const input_v11_cashreceipts_update = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		body: v11Def_V11CashReceiptUpdate,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_cashreceipts_update = v11Def_PUV11CashReceiptUpdate;
const input_v11_cashreceipts_delete = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_cashreceipts_delete = z.undefined();
const input_v11_cashreceipts_pdf = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_cashreceipts_pdf = ElorusBinaryResponseSchema;
const input_v11_contacts_list = z
	.object({
		query: withTrackingCategoryFilters(
			z.object({
				ordering: z.string().optional(),
				search: z.string().optional(),
				search_fields: z.string().optional(),
				letter: z.string().optional(),
				ctype: z.string().optional(),
				profession: z.string().optional(),
				company: z.string().optional(),
				active: z.string().optional(),
				custom_id: z.string().optional(),
				created_after: z.string().optional(),
				created_before: z.string().optional(),
				modified_after: z.string().optional(),
				modified_before: z.string().optional(),
				modified_period: z.string().optional(),
				created_period: z.string().optional(),
				page: z.number().int().optional(),
				page_size: z.number().int().optional(),
			}),
		).optional(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_contacts_list = z
	.object({
		count: z.number().int(),
		next: z.string().nullable().optional(),
		previous: z.string().nullable().optional(),
		results: z.array(v11Def_PUV11ContactList),
	})
	.strict();
const input_v11_contacts_create = z
	.object({
		body: v11Def_V11ContactRetrieveCreateUpdate,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_contacts_create = v11Def_PUV11ContactRetrieveCreateUpdate;
const input_v11_contacts_read = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_contacts_read = v11Def_PUV11ContactRetrieveCreateUpdate;
const input_v11_contacts_update = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		body: v11Def_V11ContactRetrieveCreateUpdate,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_contacts_update = v11Def_PUV11ContactRetrieveCreateUpdate;
const input_v11_contacts_delete = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_contacts_delete = z.undefined();
const input_v11_creditnotes_list = z
	.object({
		query: withTrackingCategoryFilters(
			z.object({
				ordering: z.string().optional(),
				search: z.string().optional(),
				search_fields: z.string().optional(),
				period_from: z.string().optional(),
				period_to: z.string().optional(),
				period: z.string().optional(),
				status: z.string().optional(),
				draft: z.string().optional(),
				pending_approval: z.string().optional(),
				fpaid: z.string().optional(),
				is_void: z.string().optional(),
				client: z.string().optional(),
				currency_code: z.string().optional(),
				documenttype: z.string().optional(),
				sequence: z.string().optional(),
				custom_id: z.string().optional(),
				created_after: z.string().optional(),
				created_before: z.string().optional(),
				modified_after: z.string().optional(),
				modified_before: z.string().optional(),
				modified_period: z.string().optional(),
				created_period: z.string().optional(),
				page: z.number().int().optional(),
				page_size: z.number().int().optional(),
			}),
		).optional(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_creditnotes_list = z
	.object({
		count: z.number().int(),
		next: z.string().nullable().optional(),
		previous: z.string().nullable().optional(),
		results: z.array(v11Def_PUV11CreditNoteList),
	})
	.strict();
const input_v11_creditnotes_create = z
	.object({
		body: v11Def_V11CreditNoteCreate,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_creditnotes_create = v11Def_PUV11CreditNoteCreate;
const input_v11_creditnotes_read = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_creditnotes_read = v11Def_PUV11CreditNoteRetrieve;
const input_v11_creditnotes_update = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		body: v11Def_V11CreditNoteUpdate,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_creditnotes_update = v11Def_PUV11CreditNoteUpdate;
const input_v11_creditnotes_partial_update = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		body: v11Def_PUV11CreditNotePartialUpdate,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_creditnotes_partial_update =
	v11Def_PUV11CreditNotePartialUpdate;
const input_v11_creditnotes_delete = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_creditnotes_delete = z.undefined();
const input_v11_creditnotes_email_from_template = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		query: z.object({ template_id: z.string().optional() }).strict().optional(),
		body: v11Def_CreditNoteEmailFromTemplate,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_creditnotes_email_from_template = v11Def_TrackedEmailMessage;
const input_v11_creditnotes_email_read = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_creditnotes_email_read = v11Def_PUEmailRetrieveSerializer;
const input_v11_creditnotes_email_create = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		body: v11Def_CreditNoteEmail,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_creditnotes_email_create = v11Def_TrackedEmailMessage;
const input_v11_creditnotes_pdf = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_creditnotes_pdf = ElorusBinaryResponseSchema;
const input_v11_creditnotes_mark_void = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		body: v11Def_VoidDocument,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_creditnotes_mark_void = v11Def_PUCreditNoteMarkVoidResponse;
const input_v11_creditnotes_applied_credit_list = z
	.object({
		path: z.object({ parent_pk: z.string() }).strict(),
		query: z
			.object({
				page: z.number().int().optional(),
				page_size: z.number().int().optional(),
			})
			.strict()
			.optional(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_creditnotes_applied_credit_list = z
	.object({
		count: z.number().int(),
		next: z.string().nullable().optional(),
		previous: z.string().nullable().optional(),
		results: z.array(v11Def_PUInvoiceCreditTransactionCNSerializer),
	})
	.strict();
const input_v11_creditnotes_applied_credit_create = z
	.object({
		path: z.object({ parent_pk: z.string() }).strict(),
		body: z.array(v11Def_InvoiceCreditTransactionCN),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_creditnotes_applied_credit_create = z.array(
	v11Def_InvoiceCreditTransactionCN,
);
const input_v11_creditnotes_applied_credit_delete = z
	.object({
		path: z.object({ id: z.string(), parent_pk: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_creditnotes_applied_credit_delete = z.undefined();
const input_v11_documenttypes_list = z
	.object({
		query: z
			.object({
				ordering: z.string().optional(),
				search: z.string().optional(),
				search_fields: z.string().optional(),
				application: z.string().optional(),
				active: z.string().optional(),
				is_delivery_note: z.string().optional(),
				always_self_billed: z.string().optional(),
				is_reverse_delivery_note: z.string().optional(),
				page: z.number().int().optional(),
				page_size: z.number().int().optional(),
			})
			.strict()
			.optional(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_documenttypes_list = z
	.object({
		count: z.number().int(),
		next: z.string().nullable().optional(),
		previous: z.string().nullable().optional(),
		results: z.array(v11Def_PUV11DocumentTypeList),
	})
	.strict();
const input_v11_documenttypes_read = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_documenttypes_read = v11Def_PUV11DocumentTypeRetrieve;
const input_v11_emailtemplates_list = z
	.object({
		query: z
			.object({
				search: z.string().optional(),
				search_fields: z.string().optional(),
				email_type: z.string().optional(),
				ordering: z.string().optional(),
				created_after: z.string().optional(),
				created_before: z.string().optional(),
				modified_after: z.string().optional(),
				modified_before: z.string().optional(),
				modified_period: z.string().optional(),
				created_period: z.string().optional(),
				page: z.number().int().optional(),
				page_size: z.number().int().optional(),
			})
			.strict()
			.optional(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_emailtemplates_list = z
	.object({
		count: z.number().int(),
		next: z.string().nullable().optional(),
		previous: z.string().nullable().optional(),
		results: z.array(v11Def_PUV11EmailTemplate),
	})
	.strict();
const input_v11_emailtemplates_create = z
	.object({
		body: v11Def_V11EmailTemplate,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_emailtemplates_create = v11Def_PUV11EmailTemplate;
const input_v11_emailtemplates_read = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_emailtemplates_read = v11Def_PUV11EmailTemplate;
const input_v11_emailtemplates_update = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		body: v11Def_V11EmailTemplateUpdate,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_emailtemplates_update = v11Def_PUV11EmailTemplateUpdate;
const input_v11_emailtemplates_delete = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_emailtemplates_delete = z.undefined();
const input_v11_estimates_list = z
	.object({
		query: z
			.object({
				ordering: z.string().optional(),
				search: z.string().optional(),
				search_fields: z.string().optional(),
				period_from: z.string().optional(),
				period_to: z.string().optional(),
				period: z.string().optional(),
				active: z.string().optional(),
				status: z.string().optional(),
				draft: z.string().optional(),
				accept_status: z.string().optional(),
				client: z.string().optional(),
				currency_code: z.string().optional(),
				documenttype: z.string().optional(),
				sequence: z.string().optional(),
				custom_id: z.string().optional(),
				created_after: z.string().optional(),
				created_before: z.string().optional(),
				modified_after: z.string().optional(),
				modified_before: z.string().optional(),
				modified_period: z.string().optional(),
				created_period: z.string().optional(),
				page: z.number().int().optional(),
				page_size: z.number().int().optional(),
			})
			.strict()
			.optional(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_estimates_list = z
	.object({
		count: z.number().int(),
		next: z.string().nullable().optional(),
		previous: z.string().nullable().optional(),
		results: z.array(v11Def_PUV11EstimateList),
	})
	.strict();
const input_v11_estimates_create = z
	.object({
		body: v11Def_V11EstimateCreate,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_estimates_create = v11Def_PUV11EstimateCreate;
const input_v11_estimates_read = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_estimates_read = v11Def_PUV11EstimateRetrieveUpdate;
const input_v11_estimates_update = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		body: v11Def_V11EstimateRetrieveUpdate,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_estimates_update = v11Def_PUV11EstimateRetrieveUpdate;
const input_v11_estimates_partial_update = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		body: v11Def_PUV11EstimatePartialUpdate,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_estimates_partial_update = v11Def_PUV11EstimatePartialUpdate;
const input_v11_estimates_delete = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_estimates_delete = z.undefined();
const input_v11_estimates_email_from_template = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		query: z.object({ template_id: z.string().optional() }).strict().optional(),
		body: v11Def_EstimateEmailFromTemplate,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_estimates_email_from_template = v11Def_TrackedEmailMessage;
const input_v11_estimates_email_read = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_estimates_email_read = v11Def_PUEmailRetrieveSerializer;
const input_v11_estimates_email_create = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		body: v11Def_EstimateEmail,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_estimates_email_create = v11Def_TrackedEmailMessage;
const input_v11_estimates_pdf = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_estimates_pdf = ElorusBinaryResponseSchema;
const input_v11_expensecategories_list = z
	.object({
		query: z
			.object({
				ordering: z.string().optional(),
				search: z.string().optional(),
				search_fields: z.string().optional(),
				active: z.string().optional(),
				page: z.number().int().optional(),
				page_size: z.number().int().optional(),
			})
			.strict()
			.optional(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_expensecategories_list = z
	.object({
		count: z.number().int(),
		next: z.string().nullable().optional(),
		previous: z.string().nullable().optional(),
		results: z.array(v11Def_PUV11ExpenseCategoryListRetrieve),
	})
	.strict();
const input_v11_expensecategories_read = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_expensecategories_read =
	v11Def_PUV11ExpenseCategoryListRetrieve;
const input_v11_expenses_list = z
	.object({
		query: withTrackingCategoryFilters(
			z.object({
				ordering: z.string().optional(),
				search: z.string().optional(),
				search_fields: z.string().optional(),
				period_from: z.string().optional(),
				period_to: z.string().optional(),
				period: z.string().optional(),
				supplier: z.string().optional(),
				currency_code: z.string().optional(),
				branch_id: z.string().optional(),
				custom_id: z.string().optional(),
				created_after: z.string().optional(),
				created_before: z.string().optional(),
				modified_after: z.string().optional(),
				modified_before: z.string().optional(),
				modified_period: z.string().optional(),
				created_period: z.string().optional(),
				page: z.number().int().optional(),
				page_size: z.number().int().optional(),
			}),
		).optional(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_expenses_list = z
	.object({
		count: z.number().int(),
		next: z.string().nullable().optional(),
		previous: z.string().nullable().optional(),
		results: z.array(v11Def_PUV11ExpenseList),
	})
	.strict();
const input_v11_expenses_create = z
	.object({
		body: v11Def_V11ExpenseCreate,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_expenses_create = v11Def_PUV11ExpenseCreate;
const input_v11_expenses_read = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_expenses_read = v11Def_PUV11ExpenseRetrieveUpdate;
const input_v11_expenses_update = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		body: v11Def_V11ExpenseRetrieveUpdate,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_expenses_update = v11Def_PUV11ExpenseRetrieveUpdate;
const input_v11_expenses_delete = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_expenses_delete = z.undefined();
const input_v11_invoices_list = z
	.object({
		query: withTrackingCategoryFilters(
			z.object({
				ordering: z.string().optional(),
				search: z.string().optional(),
				search_fields: z.string().optional(),
				period_from: z.string().optional(),
				period_to: z.string().optional(),
				period: z.string().optional(),
				status: z.string().optional(),
				draft: z.string().optional(),
				pending_approval: z.string().optional(),
				fpaid: z.string().optional(),
				is_void: z.string().optional(),
				overdue: z.string().optional(),
				client: z.string().optional(),
				currency_code: z.string().optional(),
				documenttype: z.string().optional(),
				sequence: z.string().optional(),
				custom_id: z.string().optional(),
				created_after: z.string().optional(),
				created_before: z.string().optional(),
				modified_after: z.string().optional(),
				modified_before: z.string().optional(),
				modified_period: z.string().optional(),
				created_period: z.string().optional(),
				page: z.number().int().optional(),
				page_size: z.number().int().optional(),
			}),
		).optional(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_invoices_list = z
	.object({
		count: z.number().int(),
		next: z.string().nullable().optional(),
		previous: z.string().nullable().optional(),
		results: z.array(v11Def_PUV11InvoiceList),
	})
	.strict();
const input_v11_invoices_create = z
	.object({
		body: v11Def_V11InvoiceCreate,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_invoices_create = v11Def_PUV11InvoiceCreate;
const input_v11_invoices_read = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_invoices_read = v11Def_PUV11InvoiceRetrieve;
const input_v11_invoices_update = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		body: v11Def_V11InvoiceUpdate,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_invoices_update = v11Def_PUV11InvoiceUpdate;
const input_v11_invoices_partial_update = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		body: v11Def_PUV11InvoicePartialUpdate,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_invoices_partial_update = v11Def_PUV11InvoicePartialUpdate;
const input_v11_invoices_delete = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_invoices_delete = z.undefined();
const input_v11_invoices_email_from_template = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		query: z.object({ template_id: z.string().optional() }).strict().optional(),
		body: v11Def_InvoiceEmailFromTemplate,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_invoices_email_from_template = v11Def_TrackedEmailMessage;
const input_v11_invoices_email_read = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_invoices_email_read = v11Def_PUEmailRetrieveSerializer;
const input_v11_invoices_email_create = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		body: v11Def_InvoiceEmail,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_invoices_email_create = v11Def_TrackedEmailMessage;
const input_v11_invoices_pdf = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_invoices_pdf = ElorusBinaryResponseSchema;
const input_v11_invoices_mark_void = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		body: v11Def_VoidDocument,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_invoices_mark_void = v11Def_PUInvoiceMarkVoidResponse;
const input_v11_invoices_applied_credit_list = z
	.object({
		path: z.object({ parent_pk: z.string() }).strict(),
		query: z
			.object({
				page: z.number().int().optional(),
				page_size: z.number().int().optional(),
			})
			.strict()
			.optional(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_invoices_applied_credit_list = z
	.object({
		count: z.number().int(),
		next: z.string().nullable().optional(),
		previous: z.string().nullable().optional(),
		results: z.array(v11Def_PUInvoiceCreditTransactionInvSerializer),
	})
	.strict();
const input_v11_invoices_applied_credit_create = z
	.object({
		path: z.object({ parent_pk: z.string() }).strict(),
		body: z.array(v11Def_InvoiceCreditTransactionInv),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_invoices_applied_credit_create = z.array(
	v11Def_InvoiceCreditTransactionInv,
);
const input_v11_invoices_applied_credit_delete = z
	.object({
		path: z.object({ id: z.string(), parent_pk: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_invoices_applied_credit_delete = z.undefined();
const input_v11_numberingsequence_list = z
	.object({
		query: z
			.object({
				documenttype: z.string().optional(),
				page: z.number().int().optional(),
				page_size: z.number().int().optional(),
			})
			.strict()
			.optional(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_numberingsequence_list = z
	.object({
		count: z.number().int(),
		next: z.string().nullable().optional(),
		previous: z.string().nullable().optional(),
		results: z.array(v11Def_PUV11NumberingSequence),
	})
	.strict();
const input_v11_numberingsequence_create = z
	.object({
		body: v11Def_V11NumberingSequence,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_numberingsequence_create = v11Def_PUV11NumberingSequence;
const input_v11_numberingsequence_read = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_numberingsequence_read = v11Def_PUV11NumberingSequence;
const input_v11_numberingsequence_update = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		body: v11Def_V11NumberingSequenceUpdate,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_numberingsequence_update = v11Def_PUV11NumberingSequenceUpdate;
const input_v11_numberingsequence_delete = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_numberingsequence_delete = z.undefined();
const input_v11_paymentgateways_list = z
	.object({
		query: z
			.object({
				ordering: z.string().optional(),
				search: z.string().optional(),
				search_fields: z.string().optional(),
				backend: z.string().optional(),
				active: z.string().optional(),
				default: z.string().optional(),
				page: z.number().int().optional(),
				page_size: z.number().int().optional(),
			})
			.strict()
			.optional(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_paymentgateways_list = z
	.object({
		count: z.number().int(),
		next: z.string().nullable().optional(),
		previous: z.string().nullable().optional(),
		results: z.array(v11Def_PUV11PaymentGatewayList),
	})
	.strict();
const input_v11_products_list = z
	.object({
		query: withTrackingCategoryFilters(
			z.object({
				search: z.string().optional(),
				search_fields: z.string().optional(),
				sales: z.string().optional(),
				purchases: z.string().optional(),
				active: z.string().optional(),
				custom_id: z.string().optional(),
				ordering: z.string().optional(),
				created_after: z.string().optional(),
				created_before: z.string().optional(),
				modified_after: z.string().optional(),
				modified_before: z.string().optional(),
				modified_period: z.string().optional(),
				created_period: z.string().optional(),
				page: z.number().int().optional(),
				page_size: z.number().int().optional(),
			}),
		).optional(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_products_list = z
	.object({
		count: z.number().int(),
		next: z.string().nullable().optional(),
		previous: z.string().nullable().optional(),
		results: z.array(v11Def_PUV11ProductOrServiceList),
	})
	.strict();
const input_v11_products_create = z
	.object({
		body: v11Def_V11ProductOrServiceCreate,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_products_create = v11Def_PUV11ProductOrServiceCreate;
const input_v11_products_read = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_products_read = v11Def_PUV11ProductOrServiceRetrieveUpdate;
const input_v11_products_update = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		body: v11Def_V11ProductOrServiceRetrieveUpdate,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_products_update = v11Def_PUV11ProductOrServiceRetrieveUpdate;
const input_v11_products_delete = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_products_delete = z.undefined();
const input_v11_projects_list = z
	.object({
		query: withTrackingCategoryFilters(
			z.object({
				ordering: z.string().optional(),
				search: z.string().optional(),
				search_fields: z.string().optional(),
				active: z.string().optional(),
				client: z.string().optional(),
				billing_method: z.string().optional(),
				page: z.number().int().optional(),
				page_size: z.number().int().optional(),
			}),
		).optional(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_projects_list = z
	.object({
		count: z.number().int(),
		next: z.string().nullable().optional(),
		previous: z.string().nullable().optional(),
		results: z.array(v11Def_PUV11ProjectList),
	})
	.strict();
const input_v11_projects_read = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_projects_read = v11Def_PUV11ProjectRetrieve;
const input_v11_recurringinvoices_list = z
	.object({
		query: withTrackingCategoryFilters(
			z.object({
				ordering: z.string().optional(),
				search: z.string().optional(),
				search_fields: z.string().optional(),
				documenttype: z.string().optional(),
				sequence: z.string().optional(),
				draft: z.string().optional(),
				client: z.string().optional(),
				currency_code: z.string().optional(),
				recurring_status: z.string().optional(),
				custom_id: z.string().optional(),
				created_after: z.string().optional(),
				created_before: z.string().optional(),
				modified_after: z.string().optional(),
				modified_before: z.string().optional(),
				modified_period: z.string().optional(),
				created_period: z.string().optional(),
				page: z.number().int().optional(),
				page_size: z.number().int().optional(),
			}),
		).optional(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_recurringinvoices_list = z
	.object({
		count: z.number().int(),
		next: z.string().nullable().optional(),
		previous: z.string().nullable().optional(),
		results: z.array(v11Def_PUV11RecurringInvoiceList),
	})
	.strict();
const input_v11_recurringinvoices_create = z
	.object({
		body: v11Def_V11RecurringInvoiceCreate,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_recurringinvoices_create = v11Def_PUV11RecurringInvoiceCreate;
const input_v11_recurringinvoices_read = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_recurringinvoices_read = v11Def_PUV11RecurringInvoiceRetrieve;
const input_v11_recurringinvoices_update = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		body: v11Def_V11RecurringInvoiceUpdate,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_recurringinvoices_update = v11Def_PUV11RecurringInvoiceUpdate;
const input_v11_recurringinvoices_delete = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_recurringinvoices_delete = z.undefined();
const input_v11_suppliercredits_list = z
	.object({
		query: withTrackingCategoryFilters(
			z.object({
				ordering: z.string().optional(),
				search: z.string().optional(),
				search_fields: z.string().optional(),
				period_from: z.string().optional(),
				period_to: z.string().optional(),
				period: z.string().optional(),
				status: z.string().optional(),
				draft: z.string().optional(),
				pending_approval: z.string().optional(),
				fpaid: z.string().optional(),
				is_void: z.string().optional(),
				supplier: z.string().optional(),
				currency_code: z.string().optional(),
				documenttype: z.string().optional(),
				self_billed: z.string().optional(),
				sequence: z.string().optional(),
				custom_id: z.string().optional(),
				created_after: z.string().optional(),
				created_before: z.string().optional(),
				modified_after: z.string().optional(),
				modified_before: z.string().optional(),
				modified_period: z.string().optional(),
				created_period: z.string().optional(),
				page: z.number().int().optional(),
				page_size: z.number().int().optional(),
			}),
		).optional(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_suppliercredits_list = z
	.object({
		count: z.number().int(),
		next: z.string().nullable().optional(),
		previous: z.string().nullable().optional(),
		results: z.array(v11Def_PUV11PurchaseCreditNoteList),
	})
	.strict();
const input_v11_suppliercredits_create = z
	.object({
		body: v11Def_V11PurchaseCreditNoteCreate,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_suppliercredits_create = v11Def_PUV11PurchaseCreditNoteCreate;
const input_v11_suppliercredits_read = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_suppliercredits_read =
	v11Def_PUV11PurchaseCreditNoteRetrieveUpdate;
const input_v11_suppliercredits_update = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		body: v11Def_V11PurchaseCreditNoteRetrieveUpdate,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_suppliercredits_update =
	v11Def_PUV11PurchaseCreditNoteRetrieveUpdate;
const input_v11_suppliercredits_partial_update = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		body: v11Def_PUV11PurchaseCreditNotePartialUpdate,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_suppliercredits_partial_update =
	v11Def_PUV11PurchaseCreditNotePartialUpdate;
const input_v11_suppliercredits_delete = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_suppliercredits_delete = z.undefined();
const input_v11_suppliercredits_email_from_template = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		query: z.object({ template_id: z.string().optional() }).strict().optional(),
		body: v11Def_PrivatePurchaseCreditNoteEmailFromTemplate,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_suppliercredits_email_from_template =
	v11Def_TrackedEmailMessage;
const input_v11_suppliercredits_email_read = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_suppliercredits_email_read = v11Def_PUEmailRetrieveSerializer;
const input_v11_suppliercredits_email_create = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		body: v11Def_PrivatePurchaseCreditNoteEmail,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_suppliercredits_email_create = v11Def_TrackedEmailMessage;
const input_v11_suppliercredits_pdf = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_suppliercredits_pdf = ElorusBinaryResponseSchema;
const input_v11_suppliercredits_mark_void = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		body: v11Def_VoidDocument,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_suppliercredits_mark_void =
	v11Def_PUPurchaseCreditNoteMarkVoidResponse;
const input_v11_suppliercredits_applied_credit_list = z
	.object({
		path: z.object({ parent_pk: z.string() }).strict(),
		query: z
			.object({
				page: z.number().int().optional(),
				page_size: z.number().int().optional(),
			})
			.strict()
			.optional(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_suppliercredits_applied_credit_list = z
	.object({
		count: z.number().int(),
		next: z.string().nullable().optional(),
		previous: z.string().nullable().optional(),
		results: z.array(v11Def_PUV11PurchaseCreditTransactionPCNListCreate),
	})
	.strict();
const input_v11_suppliercredits_applied_credit_create = z
	.object({
		path: z.object({ parent_pk: z.string() }).strict(),
		body: z.array(v11Def_V11PurchaseCreditTransactionPCNListCreate),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_suppliercredits_applied_credit_create = z.array(
	v11Def_V11PurchaseCreditTransactionPCNListCreate,
);
const input_v11_suppliercredits_applied_credit_delete = z
	.object({
		path: z.object({ id: z.string(), parent_pk: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_suppliercredits_applied_credit_delete = z.undefined();
const input_v11_taxes_list = z
	.object({
		query: z
			.object({
				ordering: z.string().optional(),
				search: z.string().optional(),
				search_fields: z.string().optional(),
				active: z.string().optional(),
				operand: z.string().optional(),
				tax_type: z.string().optional(),
				created_after: z.string().optional(),
				created_before: z.string().optional(),
				modified_after: z.string().optional(),
				modified_before: z.string().optional(),
				modified_period: z.string().optional(),
				created_period: z.string().optional(),
				page: z.number().int().optional(),
				page_size: z.number().int().optional(),
			})
			.strict()
			.optional(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_taxes_list = z
	.object({
		count: z.number().int(),
		next: z.string().nullable().optional(),
		previous: z.string().nullable().optional(),
		results: z.array(v11Def_PUV11TaxList),
	})
	.strict();
const input_v11_taxes_read = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_taxes_read = v11Def_PUV11TaxRetrieve;
const input_v11_templates_list = z
	.object({
		query: z
			.object({
				ordering: z.string().optional(),
				search: z.string().optional(),
				search_fields: z.string().optional(),
				active: z.string().optional(),
				template: z.string().optional(),
				language: z.string().optional(),
				page: z.number().int().optional(),
				page_size: z.number().int().optional(),
			})
			.strict()
			.optional(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_templates_list = z
	.object({
		count: z.number().int(),
		next: z.string().nullable().optional(),
		previous: z.string().nullable().optional(),
		results: z.array(v11Def_PUV11ThemeListRetrieve),
	})
	.strict();
const input_v11_templates_read = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_templates_read = v11Def_PUV11ThemeListRetrieve;
const input_v11_trackingcategories_list = z
	.object({
		query: z
			.object({
				ordering: z.string().optional(),
				search: z.string().optional(),
				search_fields: z.string().optional(),
				active: z.string().optional(),
				application: z.string().optional(),
				page: z.number().int().optional(),
				page_size: z.number().int().optional(),
			})
			.strict()
			.optional(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_trackingcategories_list = z
	.object({
		count: z.number().int(),
		next: z.string().nullable().optional(),
		previous: z.string().nullable().optional(),
		results: z.array(v11Def_PUV11TrackingCategoryListRetrieve),
	})
	.strict();
const input_v11_trackingcategories_read = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_trackingcategories_read =
	v11Def_PUV11TrackingCategoryListRetrieve;
const input_v11_warehouse_list = z
	.object({
		query: z
			.object({
				ordering: z.string().optional(),
				search: z.string().optional(),
				search_fields: z.string().optional(),
				active: z.string().optional(),
				created_after: z.string().optional(),
				created_before: z.string().optional(),
				modified_after: z.string().optional(),
				modified_before: z.string().optional(),
				modified_period: z.string().optional(),
				created_period: z.string().optional(),
				page: z.number().int().optional(),
				page_size: z.number().int().optional(),
			})
			.strict()
			.optional(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_warehouse_list = z
	.object({
		count: z.number().int(),
		next: z.string().nullable().optional(),
		previous: z.string().nullable().optional(),
		results: z.array(v11Def_PUV11WarehouseSerializer),
	})
	.strict();
const input_v11_warehouse_create = z
	.object({
		body: v11Def_V11Warehouse,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_warehouse_create = v11Def_PUV11WarehouseSerializer;
const input_v11_warehouse_read = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_warehouse_read = v11Def_PUV11WarehouseSerializer;
const input_v11_warehouse_update = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		body: v11Def_V11Warehouse,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_warehouse_update = v11Def_PUV11WarehouseSerializer;
const input_v11_warehouse_partial_update = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		body: v11Def_PUV11WarehouseSerializer,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_warehouse_partial_update = v11Def_PUV11WarehouseSerializer;
const input_v11_warehouse_delete = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v11_warehouse_delete = z.undefined();
const input_v12_bills_list = z
	.object({
		query: withTrackingCategoryFilters(
			z.object({
				ordering: z.string().optional(),
				search: z.string().optional(),
				search_fields: z.string().optional(),
				period_from: z.string().optional(),
				period_to: z.string().optional(),
				period: z.string().optional(),
				status: z.string().optional(),
				draft: z.string().optional(),
				pending_approval: z.string().optional(),
				fpaid: z.string().optional(),
				is_void: z.string().optional(),
				overdue: z.string().optional(),
				supplier: z.string().optional(),
				currency_code: z.string().optional(),
				documenttype: z.string().optional(),
				self_billed: z.string().optional(),
				custom_id: z.string().optional(),
				created_after: z.string().optional(),
				created_before: z.string().optional(),
				modified_after: z.string().optional(),
				modified_before: z.string().optional(),
				modified_period: z.string().optional(),
				created_period: z.string().optional(),
				page: z.number().int().optional(),
				page_size: z.number().int().optional(),
			}),
		).optional(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_bills_list = z
	.object({
		count: z.number().int(),
		next: z.string().nullable().optional(),
		previous: z.string().nullable().optional(),
		results: z.array(v12Def_PUV12PurchaseList),
	})
	.strict();
const input_v12_bills_create = z
	.object({
		body: v12Def_V12PurchaseCreate,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_bills_create = v12Def_PUV12PurchaseCreate;
const input_v12_bills_read = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_bills_read = v12Def_PUV12PurchaseRetrieve;
const input_v12_bills_update = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		body: v12Def_V12PurchaseUpdate,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_bills_update = v12Def_PUV12PurchaseUpdate;
const input_v12_bills_partial_update = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		body: v12Def_PUV12PurchasePartialUpdate,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_bills_partial_update = v12Def_PUV12PurchasePartialUpdate;
const input_v12_bills_delete = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_bills_delete = z.undefined();
const input_v12_bills_email_from_template = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		query: z.object({ template_id: z.string().optional() }).strict().optional(),
		body: v12Def_PrivatePurchaseEmailFromTemplate,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_bills_email_from_template = v12Def_TrackedEmailMessage;
const input_v12_bills_email_read = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_bills_email_read = v12Def_PUEmailRetrieveSerializer;
const input_v12_bills_email_create = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		body: v12Def_PrivatePurchaseEmail,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_bills_email_create = v12Def_TrackedEmailMessage;
const input_v12_bills_pdf = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_bills_pdf = ElorusBinaryResponseSchema;
const input_v12_bills_mark_void = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		body: v12Def_VoidDocument,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_bills_mark_void = v12Def_PUPurchaseMarkVoidResponse;
const input_v12_bills_attachments_list = z
	.object({
		path: z.object({ parent_pk: z.string() }).strict(),
		query: z
			.object({
				page: z.number().int().optional(),
				page_size: z.number().int().optional(),
			})
			.strict()
			.optional(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_bills_attachments_list = z
	.object({
		count: z.number().int(),
		next: z.string().nullable().optional(),
		previous: z.string().nullable().optional(),
		results: z.array(v12Def_PUV12PurchaseAttachmentListRetrieve),
	})
	.strict();
const input_v12_bills_attachments_create = z
	.object({
		path: z.object({ parent_pk: z.string() }).strict(),
		form: z
			.object({
				title: z.string().min(1).max(120).optional(),
				file: z.instanceof(Blob),
				primary: z.boolean().optional(),
			})
			.strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_bills_attachments_create =
	v12Def_ApiDocumentationAttachmentListRetrieve;
const input_v12_bills_attachments_read = z
	.object({
		path: z.object({ id: z.string(), parent_pk: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_bills_attachments_read =
	v12Def_PUV12PurchaseAttachmentListRetrieve;
const input_v12_bills_attachments_partial_update = z
	.object({
		path: z.object({ id: z.string(), parent_pk: z.string() }).strict(),
		body: v12Def_PUV12PurchaseAttachmentListRetrieve,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_bills_attachments_partial_update =
	v12Def_PUV12PurchaseAttachmentListRetrieve;
const input_v12_bills_attachments_delete = z
	.object({
		path: z.object({ id: z.string(), parent_pk: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_bills_attachments_delete = z.undefined();
const input_v12_bills_attachments_file = z
	.object({
		path: z.object({ id: z.string(), parent_pk: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_bills_attachments_file = ElorusBinaryResponseSchema;
const input_v12_bills_notes_list = z
	.object({
		path: z.object({ parent_pk: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_bills_notes_list = z.array(v12Def_PUV12NoteSerializer);
const input_v12_bills_notes_create = z
	.object({
		path: z.object({ parent_pk: z.string() }).strict(),
		body: v12Def_V12Note,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_bills_notes_create = v12Def_PUV12NoteSerializer;
const input_v12_bills_notes_update = z
	.object({
		path: z.object({ id: z.string(), parent_pk: z.string() }).strict(),
		body: v12Def_V12Note,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_bills_notes_update = v12Def_PUV12NoteSerializer;
const input_v12_bills_notes_delete = z
	.object({
		path: z.object({ id: z.string(), parent_pk: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_bills_notes_delete = z.undefined();
const input_v12_bills_sent_email_messages_list = z
	.object({
		path: z.object({ parent_pk: z.string() }).strict(),
		query: z
			.object({
				search: z.string().optional(),
				search_fields: z.string().optional(),
				page: z.number().int().optional(),
				page_size: z.number().int().optional(),
			})
			.strict()
			.optional(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_bills_sent_email_messages_list = z
	.object({
		count: z.number().int(),
		next: z.string().nullable().optional(),
		previous: z.string().nullable().optional(),
		results: z.array(v12Def_PUTrackedEmailMessageSerializer),
	})
	.strict();
const input_v12_cashpayments_list = z
	.object({
		query: withTrackingCategoryFilters(
			z.object({
				ordering: z.string().optional(),
				search: z.string().optional(),
				search_fields: z.string().optional(),
				period_from: z.string().optional(),
				period_to: z.string().optional(),
				period: z.string().optional(),
				contact: z.string().optional(),
				currency_code: z.string().optional(),
				transaction_type: z.string().optional(),
				purchase: z.string().optional(),
				creditnote: z.string().optional(),
				custom_id: z.string().optional(),
				created_after: z.string().optional(),
				created_before: z.string().optional(),
				modified_after: z.string().optional(),
				modified_before: z.string().optional(),
				modified_period: z.string().optional(),
				created_period: z.string().optional(),
				page: z.number().int().optional(),
				page_size: z.number().int().optional(),
			}),
		).optional(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_cashpayments_list = z
	.object({
		count: z.number().int(),
		next: z.string().nullable().optional(),
		previous: z.string().nullable().optional(),
		results: z.array(v12Def_PUV12CashPaymentList),
	})
	.strict();
const input_v12_cashpayments_create = z
	.object({
		body: v12Def_V12CashPaymentCreate,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_cashpayments_create = v12Def_PUV12CashPaymentCreate;
const input_v12_cashpayments_read = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_cashpayments_read = v12Def_PUV12CashPaymentRetrieve;
const input_v12_cashpayments_update = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		body: v12Def_V12CashPaymentUpdate,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_cashpayments_update = v12Def_PUV12CashPaymentUpdate;
const input_v12_cashpayments_delete = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_cashpayments_delete = z.undefined();
const input_v12_cashpayments_pdf = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_cashpayments_pdf = ElorusBinaryResponseSchema;
const input_v12_cashpayments_attachments_list = z
	.object({
		path: z.object({ parent_pk: z.string() }).strict(),
		query: z
			.object({
				page: z.number().int().optional(),
				page_size: z.number().int().optional(),
			})
			.strict()
			.optional(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_cashpayments_attachments_list = z
	.object({
		count: z.number().int(),
		next: z.string().nullable().optional(),
		previous: z.string().nullable().optional(),
		results: z.array(v12Def_PUV12CashPaymentAttachmentListRetrieve),
	})
	.strict();
const input_v12_cashpayments_attachments_create = z
	.object({
		path: z.object({ parent_pk: z.string() }).strict(),
		form: z
			.object({
				title: z.string().min(1).max(120).optional(),
				file: z.instanceof(Blob),
			})
			.strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_cashpayments_attachments_create =
	v12Def_ApiDocumentationAttachmentListRetrieve;
const input_v12_cashpayments_attachments_read = z
	.object({
		path: z.object({ id: z.string(), parent_pk: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_cashpayments_attachments_read =
	v12Def_PUV12CashPaymentAttachmentListRetrieve;
const input_v12_cashpayments_attachments_partial_update = z
	.object({
		path: z.object({ id: z.string(), parent_pk: z.string() }).strict(),
		body: v12Def_PUV12CashPaymentAttachmentListRetrieve,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_cashpayments_attachments_partial_update =
	v12Def_PUV12CashPaymentAttachmentListRetrieve;
const input_v12_cashpayments_attachments_delete = z
	.object({
		path: z.object({ id: z.string(), parent_pk: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_cashpayments_attachments_delete = z.undefined();
const input_v12_cashpayments_attachments_file = z
	.object({
		path: z.object({ id: z.string(), parent_pk: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_cashpayments_attachments_file = ElorusBinaryResponseSchema;
const input_v12_cashpayments_notes_list = z
	.object({
		path: z.object({ parent_pk: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_cashpayments_notes_list = z.array(v12Def_PUV12NoteSerializer);
const input_v12_cashpayments_notes_create = z
	.object({
		path: z.object({ parent_pk: z.string() }).strict(),
		body: v12Def_V12Note,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_cashpayments_notes_create = v12Def_PUV12NoteSerializer;
const input_v12_cashpayments_notes_update = z
	.object({
		path: z.object({ id: z.string(), parent_pk: z.string() }).strict(),
		body: v12Def_V12Note,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_cashpayments_notes_update = v12Def_PUV12NoteSerializer;
const input_v12_cashpayments_notes_delete = z
	.object({
		path: z.object({ id: z.string(), parent_pk: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_cashpayments_notes_delete = z.undefined();
const input_v12_cashreceipts_list = z
	.object({
		query: withTrackingCategoryFilters(
			z.object({
				ordering: z.string().optional(),
				search: z.string().optional(),
				search_fields: z.string().optional(),
				period_from: z.string().optional(),
				period_to: z.string().optional(),
				period: z.string().optional(),
				contact: z.string().optional(),
				currency_code: z.string().optional(),
				pending_approval: z.string().optional(),
				is_void: z.string().optional(),
				transaction_type: z.string().optional(),
				invoice: z.string().optional(),
				purchasecreditnote: z.string().optional(),
				custom_id: z.string().optional(),
				created_after: z.string().optional(),
				created_before: z.string().optional(),
				modified_after: z.string().optional(),
				modified_before: z.string().optional(),
				modified_period: z.string().optional(),
				created_period: z.string().optional(),
				page: z.number().int().optional(),
				page_size: z.number().int().optional(),
			}),
		).optional(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_cashreceipts_list = z
	.object({
		count: z.number().int(),
		next: z.string().nullable().optional(),
		previous: z.string().nullable().optional(),
		results: z.array(v12Def_PUV12CashReceiptList),
	})
	.strict();
const input_v12_cashreceipts_create = z
	.object({
		body: v12Def_V12CashReceiptCreate,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_cashreceipts_create = v12Def_PUV12CashReceiptCreate;
const input_v12_cashreceipts_read = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_cashreceipts_read = v12Def_PUV12CashReceiptRetrieve;
const input_v12_cashreceipts_update = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		body: v12Def_V12CashReceiptUpdate,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_cashreceipts_update = v12Def_PUV12CashReceiptUpdate;
const input_v12_cashreceipts_delete = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_cashreceipts_delete = z.undefined();
const input_v12_cashreceipts_pdf = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_cashreceipts_pdf = ElorusBinaryResponseSchema;
const input_v12_cashreceipts_attachments_list = z
	.object({
		path: z.object({ parent_pk: z.string() }).strict(),
		query: z
			.object({
				page: z.number().int().optional(),
				page_size: z.number().int().optional(),
			})
			.strict()
			.optional(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_cashreceipts_attachments_list = z
	.object({
		count: z.number().int(),
		next: z.string().nullable().optional(),
		previous: z.string().nullable().optional(),
		results: z.array(v12Def_PUV12CashReceiptAttachmentListRetrieve),
	})
	.strict();
const input_v12_cashreceipts_attachments_create = z
	.object({
		path: z.object({ parent_pk: z.string() }).strict(),
		form: z
			.object({
				title: z.string().min(1).max(120).optional(),
				file: z.instanceof(Blob),
			})
			.strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_cashreceipts_attachments_create =
	v12Def_ApiDocumentationAttachmentListRetrieve;
const input_v12_cashreceipts_attachments_read = z
	.object({
		path: z.object({ id: z.string(), parent_pk: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_cashreceipts_attachments_read =
	v12Def_PUV12CashReceiptAttachmentListRetrieve;
const input_v12_cashreceipts_attachments_partial_update = z
	.object({
		path: z.object({ id: z.string(), parent_pk: z.string() }).strict(),
		body: v12Def_PUV12CashReceiptAttachmentListRetrieve,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_cashreceipts_attachments_partial_update =
	v12Def_PUV12CashReceiptAttachmentListRetrieve;
const input_v12_cashreceipts_attachments_delete = z
	.object({
		path: z.object({ id: z.string(), parent_pk: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_cashreceipts_attachments_delete = z.undefined();
const input_v12_cashreceipts_attachments_file = z
	.object({
		path: z.object({ id: z.string(), parent_pk: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_cashreceipts_attachments_file = ElorusBinaryResponseSchema;
const input_v12_cashreceipts_notes_list = z
	.object({
		path: z.object({ parent_pk: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_cashreceipts_notes_list = z.array(v12Def_PUV12NoteSerializer);
const input_v12_cashreceipts_notes_create = z
	.object({
		path: z.object({ parent_pk: z.string() }).strict(),
		body: v12Def_V12Note,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_cashreceipts_notes_create = v12Def_PUV12NoteSerializer;
const input_v12_cashreceipts_notes_update = z
	.object({
		path: z.object({ id: z.string(), parent_pk: z.string() }).strict(),
		body: v12Def_V12Note,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_cashreceipts_notes_update = v12Def_PUV12NoteSerializer;
const input_v12_cashreceipts_notes_delete = z
	.object({
		path: z.object({ id: z.string(), parent_pk: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_cashreceipts_notes_delete = z.undefined();
const input_v12_contacts_list = z
	.object({
		query: withTrackingCategoryFilters(
			z.object({
				ordering: z.string().optional(),
				search: z.string().optional(),
				search_fields: z.string().optional(),
				letter: z.string().optional(),
				ctype: z.string().optional(),
				profession: z.string().optional(),
				company: z.string().optional(),
				active: z.string().optional(),
				custom_id: z.string().optional(),
				created_after: z.string().optional(),
				created_before: z.string().optional(),
				modified_after: z.string().optional(),
				modified_before: z.string().optional(),
				modified_period: z.string().optional(),
				created_period: z.string().optional(),
				page: z.number().int().optional(),
				page_size: z.number().int().optional(),
			}),
		).optional(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_contacts_list = z
	.object({
		count: z.number().int(),
		next: z.string().nullable().optional(),
		previous: z.string().nullable().optional(),
		results: z.array(v12Def_PUV12ContactList),
	})
	.strict();
const input_v12_contacts_create = z
	.object({
		body: v12Def_V12ContactRetrieveCreateUpdate,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_contacts_create = v12Def_PUV12ContactRetrieveCreateUpdate;
const input_v12_contacts_read = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_contacts_read = v12Def_PUV12ContactRetrieveCreateUpdate;
const input_v12_contacts_update = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		body: v12Def_V12ContactRetrieveCreateUpdate,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_contacts_update = v12Def_PUV12ContactRetrieveCreateUpdate;
const input_v12_contacts_delete = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_contacts_delete = z.undefined();
const input_v12_contacts_attachments_list = z
	.object({
		path: z.object({ parent_pk: z.string() }).strict(),
		query: z
			.object({
				page: z.number().int().optional(),
				page_size: z.number().int().optional(),
			})
			.strict()
			.optional(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_contacts_attachments_list = z
	.object({
		count: z.number().int(),
		next: z.string().nullable().optional(),
		previous: z.string().nullable().optional(),
		results: z.array(v12Def_PUV12ContactAttachmentListRetrieve),
	})
	.strict();
const input_v12_contacts_attachments_create = z
	.object({
		path: z.object({ parent_pk: z.string() }).strict(),
		form: z
			.object({
				title: z.string().min(1).max(120).optional(),
				file: z.instanceof(Blob),
			})
			.strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_contacts_attachments_create =
	v12Def_ApiDocumentationAttachmentListRetrieve;
const input_v12_contacts_attachments_read = z
	.object({
		path: z.object({ id: z.string(), parent_pk: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_contacts_attachments_read =
	v12Def_PUV12ContactAttachmentListRetrieve;
const input_v12_contacts_attachments_partial_update = z
	.object({
		path: z.object({ id: z.string(), parent_pk: z.string() }).strict(),
		body: v12Def_PUV12ContactAttachmentListRetrieve,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_contacts_attachments_partial_update =
	v12Def_PUV12ContactAttachmentListRetrieve;
const input_v12_contacts_attachments_delete = z
	.object({
		path: z.object({ id: z.string(), parent_pk: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_contacts_attachments_delete = z.undefined();
const input_v12_contacts_attachments_file = z
	.object({
		path: z.object({ id: z.string(), parent_pk: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_contacts_attachments_file = ElorusBinaryResponseSchema;
const input_v12_contacts_notes_list = z
	.object({
		path: z.object({ parent_pk: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_contacts_notes_list = z.array(v12Def_PUV12NoteSerializer);
const input_v12_contacts_notes_create = z
	.object({
		path: z.object({ parent_pk: z.string() }).strict(),
		body: v12Def_V12Note,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_contacts_notes_create = v12Def_PUV12NoteSerializer;
const input_v12_contacts_notes_update = z
	.object({
		path: z.object({ id: z.string(), parent_pk: z.string() }).strict(),
		body: v12Def_V12Note,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_contacts_notes_update = v12Def_PUV12NoteSerializer;
const input_v12_contacts_notes_delete = z
	.object({
		path: z.object({ id: z.string(), parent_pk: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_contacts_notes_delete = z.undefined();
const input_v12_creditnotes_list = z
	.object({
		query: withTrackingCategoryFilters(
			z.object({
				ordering: z.string().optional(),
				search: z.string().optional(),
				search_fields: z.string().optional(),
				period_from: z.string().optional(),
				period_to: z.string().optional(),
				period: z.string().optional(),
				status: z.string().optional(),
				draft: z.string().optional(),
				pending_approval: z.string().optional(),
				fpaid: z.string().optional(),
				is_void: z.string().optional(),
				client: z.string().optional(),
				currency_code: z.string().optional(),
				documenttype: z.string().optional(),
				sequence: z.string().optional(),
				custom_id: z.string().optional(),
				created_after: z.string().optional(),
				created_before: z.string().optional(),
				modified_after: z.string().optional(),
				modified_before: z.string().optional(),
				modified_period: z.string().optional(),
				created_period: z.string().optional(),
				page: z.number().int().optional(),
				page_size: z.number().int().optional(),
			}),
		).optional(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_creditnotes_list = z
	.object({
		count: z.number().int(),
		next: z.string().nullable().optional(),
		previous: z.string().nullable().optional(),
		results: z.array(v12Def_PUV12CreditNoteList),
	})
	.strict();
const input_v12_creditnotes_create = z
	.object({
		body: v12Def_V12CreditNoteCreate,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_creditnotes_create = v12Def_PUV12CreditNoteCreate;
const input_v12_creditnotes_read = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_creditnotes_read = v12Def_PUV12CreditNoteRetrieve;
const input_v12_creditnotes_update = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		body: v12Def_V12CreditNoteUpdate,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_creditnotes_update = v12Def_PUV12CreditNoteUpdate;
const input_v12_creditnotes_partial_update = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		body: v12Def_PUV12CreditNotePartialUpdate,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_creditnotes_partial_update =
	v12Def_PUV12CreditNotePartialUpdate;
const input_v12_creditnotes_delete = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_creditnotes_delete = z.undefined();
const input_v12_creditnotes_email_from_template = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		query: z.object({ template_id: z.string().optional() }).strict().optional(),
		body: v12Def_CreditNoteEmailFromTemplate,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_creditnotes_email_from_template = v12Def_TrackedEmailMessage;
const input_v12_creditnotes_email_read = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_creditnotes_email_read = v12Def_PUEmailRetrieveSerializer;
const input_v12_creditnotes_email_create = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		body: v12Def_CreditNoteEmail,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_creditnotes_email_create = v12Def_TrackedEmailMessage;
const input_v12_creditnotes_pdf = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_creditnotes_pdf = ElorusBinaryResponseSchema;
const input_v12_creditnotes_mark_void = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		body: v12Def_VoidDocument,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_creditnotes_mark_void = v12Def_PUCreditNoteMarkVoidResponse;
const input_v12_creditnotes_applied_credit_list = z
	.object({
		path: z.object({ parent_pk: z.string() }).strict(),
		query: z
			.object({
				page: z.number().int().optional(),
				page_size: z.number().int().optional(),
			})
			.strict()
			.optional(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_creditnotes_applied_credit_list = z
	.object({
		count: z.number().int(),
		next: z.string().nullable().optional(),
		previous: z.string().nullable().optional(),
		results: z.array(v12Def_PUInvoiceCreditTransactionCNSerializer),
	})
	.strict();
const input_v12_creditnotes_applied_credit_create = z
	.object({
		path: z.object({ parent_pk: z.string() }).strict(),
		body: z.array(v12Def_InvoiceCreditTransactionCN),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_creditnotes_applied_credit_create = z.array(
	v12Def_InvoiceCreditTransactionCN,
);
const input_v12_creditnotes_applied_credit_delete = z
	.object({
		path: z.object({ id: z.string(), parent_pk: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_creditnotes_applied_credit_delete = z.undefined();
const input_v12_creditnotes_attachments_list = z
	.object({
		path: z.object({ parent_pk: z.string() }).strict(),
		query: z
			.object({
				page: z.number().int().optional(),
				page_size: z.number().int().optional(),
			})
			.strict()
			.optional(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_creditnotes_attachments_list = z
	.object({
		count: z.number().int(),
		next: z.string().nullable().optional(),
		previous: z.string().nullable().optional(),
		results: z.array(v12Def_PUV12CreditNoteAttachmentListRetrieve),
	})
	.strict();
const input_v12_creditnotes_attachments_create = z
	.object({
		path: z.object({ parent_pk: z.string() }).strict(),
		form: z
			.object({
				title: z.string().min(1).max(120).optional(),
				file: z.instanceof(Blob),
			})
			.strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_creditnotes_attachments_create =
	v12Def_ApiDocumentationAttachmentListRetrieve;
const input_v12_creditnotes_attachments_read = z
	.object({
		path: z.object({ id: z.string(), parent_pk: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_creditnotes_attachments_read =
	v12Def_PUV12CreditNoteAttachmentListRetrieve;
const input_v12_creditnotes_attachments_partial_update = z
	.object({
		path: z.object({ id: z.string(), parent_pk: z.string() }).strict(),
		body: v12Def_PUV12CreditNoteAttachmentListRetrieve,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_creditnotes_attachments_partial_update =
	v12Def_PUV12CreditNoteAttachmentListRetrieve;
const input_v12_creditnotes_attachments_delete = z
	.object({
		path: z.object({ id: z.string(), parent_pk: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_creditnotes_attachments_delete = z.undefined();
const input_v12_creditnotes_attachments_file = z
	.object({
		path: z.object({ id: z.string(), parent_pk: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_creditnotes_attachments_file = ElorusBinaryResponseSchema;
const input_v12_creditnotes_discussions_list = z
	.object({
		path: z.object({ parent_pk: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_creditnotes_discussions_list = z.array(
	v12Def_PUV12DiscussionSerializer,
);
const input_v12_creditnotes_discussions_create = z
	.object({
		path: z.object({ parent_pk: z.string() }).strict(),
		body: v12Def_V12Discussion,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_creditnotes_discussions_create =
	v12Def_PUV12DiscussionSerializer;
const input_v12_creditnotes_discussions_update = z
	.object({
		path: z.object({ id: z.string(), parent_pk: z.string() }).strict(),
		body: v12Def_V12Discussion,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_creditnotes_discussions_update =
	v12Def_PUV12DiscussionSerializer;
const input_v12_creditnotes_discussions_delete = z
	.object({
		path: z.object({ id: z.string(), parent_pk: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_creditnotes_discussions_delete = z.undefined();
const input_v12_creditnotes_notes_list = z
	.object({
		path: z.object({ parent_pk: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_creditnotes_notes_list = z.array(v12Def_PUV12NoteSerializer);
const input_v12_creditnotes_notes_create = z
	.object({
		path: z.object({ parent_pk: z.string() }).strict(),
		body: v12Def_V12Note,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_creditnotes_notes_create = v12Def_PUV12NoteSerializer;
const input_v12_creditnotes_notes_update = z
	.object({
		path: z.object({ id: z.string(), parent_pk: z.string() }).strict(),
		body: v12Def_V12Note,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_creditnotes_notes_update = v12Def_PUV12NoteSerializer;
const input_v12_creditnotes_notes_delete = z
	.object({
		path: z.object({ id: z.string(), parent_pk: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_creditnotes_notes_delete = z.undefined();
const input_v12_creditnotes_sent_email_messages_list = z
	.object({
		path: z.object({ parent_pk: z.string() }).strict(),
		query: z
			.object({
				search: z.string().optional(),
				search_fields: z.string().optional(),
				page: z.number().int().optional(),
				page_size: z.number().int().optional(),
			})
			.strict()
			.optional(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_creditnotes_sent_email_messages_list = z
	.object({
		count: z.number().int(),
		next: z.string().nullable().optional(),
		previous: z.string().nullable().optional(),
		results: z.array(v12Def_PUTrackedEmailMessageSerializer),
	})
	.strict();
const input_v12_deliverynotes_list = z
	.object({
		query: z
			.object({
				ordering: z.string().optional(),
				search: z.string().optional(),
				search_fields: z.string().optional(),
				period_from: z.string().optional(),
				period_to: z.string().optional(),
				period: z.string().optional(),
				status: z.string().optional(),
				draft: z.string().optional(),
				contact: z.string().optional(),
				currency_code: z.string().optional(),
				documenttype: z.string().optional(),
				sequence: z.string().optional(),
				custom_id: z.string().optional(),
				created_after: z.string().optional(),
				created_before: z.string().optional(),
				modified_after: z.string().optional(),
				modified_before: z.string().optional(),
				modified_period: z.string().optional(),
				created_period: z.string().optional(),
				page: z.number().int().optional(),
				page_size: z.number().int().optional(),
			})
			.strict()
			.optional(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_deliverynotes_list = z
	.object({
		count: z.number().int(),
		next: z.string().nullable().optional(),
		previous: z.string().nullable().optional(),
		results: z.array(v12Def_PUV12DeliveryNoteList),
	})
	.strict();
const input_v12_deliverynotes_create = z
	.object({
		body: v12Def_V12DeliveryNoteCreate,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_deliverynotes_create = v12Def_PUV12DeliveryNoteCreate;
const input_v12_deliverynotes_read = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_deliverynotes_read = v12Def_PUV12DeliveryNoteRetrieve;
const input_v12_deliverynotes_update = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		body: v12Def_V12DeliveryNoteUpdate,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_deliverynotes_update = v12Def_PUV12DeliveryNoteUpdate;
const input_v12_deliverynotes_partial_update = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		body: v12Def_PUV12DeliveryNotePartialUpdate,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_deliverynotes_partial_update =
	v12Def_PUV12DeliveryNotePartialUpdate;
const input_v12_deliverynotes_delete = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_deliverynotes_delete = z.undefined();
const input_v12_deliverynotes_email_from_template = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		query: z.object({ template_id: z.string().optional() }).strict().optional(),
		body: v12Def_DeliveryNoteEmailFromTemplate,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_deliverynotes_email_from_template = v12Def_TrackedEmailMessage;
const input_v12_deliverynotes_email_read = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_deliverynotes_email_read = v12Def_PUEmailRetrieveSerializer;
const input_v12_deliverynotes_email_create = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		body: v12Def_DeliveryNoteEmail,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_deliverynotes_email_create = v12Def_TrackedEmailMessage;
const input_v12_deliverynotes_pdf = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_deliverynotes_pdf = ElorusBinaryResponseSchema;
const input_v12_deliverynotes_mark_void = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		body: v12Def_VoidDocument,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_deliverynotes_mark_void =
	v12Def_PUDeliveryNoteMarkVoidResponse;
const input_v12_deliverynotes_attachments_list = z
	.object({
		path: z.object({ parent_pk: z.string() }).strict(),
		query: z
			.object({
				page: z.number().int().optional(),
				page_size: z.number().int().optional(),
			})
			.strict()
			.optional(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_deliverynotes_attachments_list = z
	.object({
		count: z.number().int(),
		next: z.string().nullable().optional(),
		previous: z.string().nullable().optional(),
		results: z.array(v12Def_PUV12DeliveryNoteAttachmentListRetrieve),
	})
	.strict();
const input_v12_deliverynotes_attachments_create = z
	.object({
		path: z.object({ parent_pk: z.string() }).strict(),
		form: z
			.object({
				title: z.string().min(1).max(120).optional(),
				file: z.instanceof(Blob),
			})
			.strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_deliverynotes_attachments_create =
	v12Def_ApiDocumentationAttachmentListRetrieve;
const input_v12_deliverynotes_attachments_read = z
	.object({
		path: z.object({ id: z.string(), parent_pk: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_deliverynotes_attachments_read =
	v12Def_PUV12DeliveryNoteAttachmentListRetrieve;
const input_v12_deliverynotes_attachments_partial_update = z
	.object({
		path: z.object({ id: z.string(), parent_pk: z.string() }).strict(),
		body: v12Def_PUV12DeliveryNoteAttachmentListRetrieve,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_deliverynotes_attachments_partial_update =
	v12Def_PUV12DeliveryNoteAttachmentListRetrieve;
const input_v12_deliverynotes_attachments_delete = z
	.object({
		path: z.object({ id: z.string(), parent_pk: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_deliverynotes_attachments_delete = z.undefined();
const input_v12_deliverynotes_attachments_file = z
	.object({
		path: z.object({ id: z.string(), parent_pk: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_deliverynotes_attachments_file = ElorusBinaryResponseSchema;
const input_v12_deliverynotes_notes_list = z
	.object({
		path: z.object({ parent_pk: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_deliverynotes_notes_list = z.array(v12Def_PUV12NoteSerializer);
const input_v12_deliverynotes_notes_create = z
	.object({
		path: z.object({ parent_pk: z.string() }).strict(),
		body: v12Def_V12Note,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_deliverynotes_notes_create = v12Def_PUV12NoteSerializer;
const input_v12_deliverynotes_notes_update = z
	.object({
		path: z.object({ id: z.string(), parent_pk: z.string() }).strict(),
		body: v12Def_V12Note,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_deliverynotes_notes_update = v12Def_PUV12NoteSerializer;
const input_v12_deliverynotes_notes_delete = z
	.object({
		path: z.object({ id: z.string(), parent_pk: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_deliverynotes_notes_delete = z.undefined();
const input_v12_deliverynotes_sent_email_messages_list = z
	.object({
		path: z.object({ parent_pk: z.string() }).strict(),
		query: z
			.object({
				search: z.string().optional(),
				search_fields: z.string().optional(),
				page: z.number().int().optional(),
				page_size: z.number().int().optional(),
			})
			.strict()
			.optional(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_deliverynotes_sent_email_messages_list = z
	.object({
		count: z.number().int(),
		next: z.string().nullable().optional(),
		previous: z.string().nullable().optional(),
		results: z.array(v12Def_PUTrackedEmailMessageSerializer),
	})
	.strict();
const input_v12_documenttypes_list = z
	.object({
		query: z
			.object({
				ordering: z.string().optional(),
				search: z.string().optional(),
				search_fields: z.string().optional(),
				application: z.string().optional(),
				active: z.string().optional(),
				is_delivery_note: z.string().optional(),
				always_self_billed: z.string().optional(),
				is_reverse_delivery_note: z.string().optional(),
				page: z.number().int().optional(),
				page_size: z.number().int().optional(),
			})
			.strict()
			.optional(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_documenttypes_list = z
	.object({
		count: z.number().int(),
		next: z.string().nullable().optional(),
		previous: z.string().nullable().optional(),
		results: z.array(v12Def_PUV12DocumentTypeList),
	})
	.strict();
const input_v12_documenttypes_read = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_documenttypes_read = v12Def_PUV12DocumentTypeRetrieve;
const input_v12_documenttypes_sequences_list = z
	.object({
		path: z.object({ parent_pk: z.string() }).strict(),
		query: z.object({ active: z.boolean().optional() }).strict().optional(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_documenttypes_sequences_list = z.array(
	v12Def_PUFlatSequenceList,
);
const input_v12_documenttypes_sequences_create = z
	.object({
		path: z.object({ parent_pk: z.string() }).strict(),
		body: v12Def_FlatSequence,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_documenttypes_sequences_create =
	v12Def_PUFlatSequenceSerializer;
const input_v12_documenttypes_sequences_delete_sequence = z
	.object({
		path: z.object({ parent_pk: z.string() }).strict(),
		body: v12Def_FlatSequence,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_documenttypes_sequences_delete_sequence = z.undefined();
const input_v12_documenttypes_sequences_rename_sequence = z
	.object({
		path: z.object({ parent_pk: z.string() }).strict(),
		body: v12Def_FlatSequenceRename,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_documenttypes_sequences_rename_sequence =
	v12Def_PUFlatSequenceRename;
const input_v12_emailtemplates_list = z
	.object({
		query: z
			.object({
				search: z.string().optional(),
				search_fields: z.string().optional(),
				email_type: z.string().optional(),
				ordering: z.string().optional(),
				created_after: z.string().optional(),
				created_before: z.string().optional(),
				modified_after: z.string().optional(),
				modified_before: z.string().optional(),
				modified_period: z.string().optional(),
				created_period: z.string().optional(),
				page: z.number().int().optional(),
				page_size: z.number().int().optional(),
			})
			.strict()
			.optional(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_emailtemplates_list = z
	.object({
		count: z.number().int(),
		next: z.string().nullable().optional(),
		previous: z.string().nullable().optional(),
		results: z.array(v12Def_PUV12EmailTemplate),
	})
	.strict();
const input_v12_emailtemplates_create = z
	.object({
		body: v12Def_V12EmailTemplate,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_emailtemplates_create = v12Def_PUV12EmailTemplate;
const input_v12_emailtemplates_read = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_emailtemplates_read = v12Def_PUV12EmailTemplate;
const input_v12_emailtemplates_update = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		body: v12Def_V12EmailTemplateUpdate,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_emailtemplates_update = v12Def_PUV12EmailTemplateUpdate;
const input_v12_emailtemplates_delete = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_emailtemplates_delete = z.undefined();
const input_v12_estimates_list = z
	.object({
		query: z
			.object({
				ordering: z.string().optional(),
				search: z.string().optional(),
				search_fields: z.string().optional(),
				period_from: z.string().optional(),
				period_to: z.string().optional(),
				period: z.string().optional(),
				active: z.string().optional(),
				status: z.string().optional(),
				draft: z.string().optional(),
				accept_status: z.string().optional(),
				client: z.string().optional(),
				currency_code: z.string().optional(),
				documenttype: z.string().optional(),
				sequence: z.string().optional(),
				custom_id: z.string().optional(),
				created_after: z.string().optional(),
				created_before: z.string().optional(),
				modified_after: z.string().optional(),
				modified_before: z.string().optional(),
				modified_period: z.string().optional(),
				created_period: z.string().optional(),
				page: z.number().int().optional(),
				page_size: z.number().int().optional(),
			})
			.strict()
			.optional(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_estimates_list = z
	.object({
		count: z.number().int(),
		next: z.string().nullable().optional(),
		previous: z.string().nullable().optional(),
		results: z.array(v12Def_PUV12EstimateList),
	})
	.strict();
const input_v12_estimates_create = z
	.object({
		body: v12Def_V12EstimateCreate,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_estimates_create = v12Def_PUV12EstimateCreate;
const input_v12_estimates_read = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_estimates_read = v12Def_PUV12EstimateRetrieve;
const input_v12_estimates_update = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		body: v12Def_V12EstimateUpdate,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_estimates_update = v12Def_PUV12EstimateUpdate;
const input_v12_estimates_partial_update = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		body: v12Def_PUV12EstimatePartialUpdate,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_estimates_partial_update = v12Def_PUV12EstimatePartialUpdate;
const input_v12_estimates_delete = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_estimates_delete = z.undefined();
const input_v12_estimates_email_from_template = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		query: z.object({ template_id: z.string().optional() }).strict().optional(),
		body: v12Def_EstimateEmailFromTemplate,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_estimates_email_from_template = v12Def_TrackedEmailMessage;
const input_v12_estimates_email_read = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_estimates_email_read = v12Def_PUEmailRetrieveSerializer;
const input_v12_estimates_email_create = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		body: v12Def_EstimateEmail,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_estimates_email_create = v12Def_TrackedEmailMessage;
const input_v12_estimates_pdf = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_estimates_pdf = ElorusBinaryResponseSchema;
const input_v12_estimates_attachments_list = z
	.object({
		path: z.object({ parent_pk: z.string() }).strict(),
		query: z
			.object({
				page: z.number().int().optional(),
				page_size: z.number().int().optional(),
			})
			.strict()
			.optional(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_estimates_attachments_list = z
	.object({
		count: z.number().int(),
		next: z.string().nullable().optional(),
		previous: z.string().nullable().optional(),
		results: z.array(v12Def_PUV12EstimateAttachmentListRetrieve),
	})
	.strict();
const input_v12_estimates_attachments_create = z
	.object({
		path: z.object({ parent_pk: z.string() }).strict(),
		form: z
			.object({
				title: z.string().min(1).max(120).optional(),
				file: z.instanceof(Blob),
			})
			.strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_estimates_attachments_create =
	v12Def_ApiDocumentationAttachmentListRetrieve;
const input_v12_estimates_attachments_read = z
	.object({
		path: z.object({ id: z.string(), parent_pk: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_estimates_attachments_read =
	v12Def_PUV12EstimateAttachmentListRetrieve;
const input_v12_estimates_attachments_partial_update = z
	.object({
		path: z.object({ id: z.string(), parent_pk: z.string() }).strict(),
		body: v12Def_PUV12EstimateAttachmentListRetrieve,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_estimates_attachments_partial_update =
	v12Def_PUV12EstimateAttachmentListRetrieve;
const input_v12_estimates_attachments_delete = z
	.object({
		path: z.object({ id: z.string(), parent_pk: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_estimates_attachments_delete = z.undefined();
const input_v12_estimates_attachments_file = z
	.object({
		path: z.object({ id: z.string(), parent_pk: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_estimates_attachments_file = ElorusBinaryResponseSchema;
const input_v12_estimates_discussions_list = z
	.object({
		path: z.object({ parent_pk: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_estimates_discussions_list = z.array(
	v12Def_PUV12DiscussionSerializer,
);
const input_v12_estimates_discussions_create = z
	.object({
		path: z.object({ parent_pk: z.string() }).strict(),
		body: v12Def_V12Discussion,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_estimates_discussions_create =
	v12Def_PUV12DiscussionSerializer;
const input_v12_estimates_discussions_update = z
	.object({
		path: z.object({ id: z.string(), parent_pk: z.string() }).strict(),
		body: v12Def_V12Discussion,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_estimates_discussions_update =
	v12Def_PUV12DiscussionSerializer;
const input_v12_estimates_discussions_delete = z
	.object({
		path: z.object({ id: z.string(), parent_pk: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_estimates_discussions_delete = z.undefined();
const input_v12_estimates_notes_list = z
	.object({
		path: z.object({ parent_pk: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_estimates_notes_list = z.array(v12Def_PUV12NoteSerializer);
const input_v12_estimates_notes_create = z
	.object({
		path: z.object({ parent_pk: z.string() }).strict(),
		body: v12Def_V12Note,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_estimates_notes_create = v12Def_PUV12NoteSerializer;
const input_v12_estimates_notes_update = z
	.object({
		path: z.object({ id: z.string(), parent_pk: z.string() }).strict(),
		body: v12Def_V12Note,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_estimates_notes_update = v12Def_PUV12NoteSerializer;
const input_v12_estimates_notes_delete = z
	.object({
		path: z.object({ id: z.string(), parent_pk: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_estimates_notes_delete = z.undefined();
const input_v12_estimates_sent_email_messages_list = z
	.object({
		path: z.object({ parent_pk: z.string() }).strict(),
		query: z
			.object({
				search: z.string().optional(),
				search_fields: z.string().optional(),
				page: z.number().int().optional(),
				page_size: z.number().int().optional(),
			})
			.strict()
			.optional(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_estimates_sent_email_messages_list = z
	.object({
		count: z.number().int(),
		next: z.string().nullable().optional(),
		previous: z.string().nullable().optional(),
		results: z.array(v12Def_PUTrackedEmailMessageSerializer),
	})
	.strict();
const input_v12_expensecategories_list = z
	.object({
		query: z
			.object({
				ordering: z.string().optional(),
				search: z.string().optional(),
				search_fields: z.string().optional(),
				active: z.string().optional(),
				page: z.number().int().optional(),
				page_size: z.number().int().optional(),
			})
			.strict()
			.optional(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_expensecategories_list = z
	.object({
		count: z.number().int(),
		next: z.string().nullable().optional(),
		previous: z.string().nullable().optional(),
		results: z.array(v12Def_PUV12ExpenseCategoryListRetrieve),
	})
	.strict();
const input_v12_expensecategories_read = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_expensecategories_read =
	v12Def_PUV12ExpenseCategoryListRetrieve;
const input_v12_expenses_list = z
	.object({
		query: withTrackingCategoryFilters(
			z.object({
				ordering: z.string().optional(),
				search: z.string().optional(),
				search_fields: z.string().optional(),
				period_from: z.string().optional(),
				period_to: z.string().optional(),
				period: z.string().optional(),
				supplier: z.string().optional(),
				currency_code: z.string().optional(),
				branch_id: z.string().optional(),
				custom_id: z.string().optional(),
				created_after: z.string().optional(),
				created_before: z.string().optional(),
				modified_after: z.string().optional(),
				modified_before: z.string().optional(),
				modified_period: z.string().optional(),
				created_period: z.string().optional(),
				page: z.number().int().optional(),
				page_size: z.number().int().optional(),
			}),
		).optional(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_expenses_list = z
	.object({
		count: z.number().int(),
		next: z.string().nullable().optional(),
		previous: z.string().nullable().optional(),
		results: z.array(v12Def_PUV12ExpenseList),
	})
	.strict();
const input_v12_expenses_create = z
	.object({
		body: v12Def_V12ExpenseCreate,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_expenses_create = v12Def_PUV12ExpenseCreate;
const input_v12_expenses_read = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_expenses_read = v12Def_PUV12ExpenseRetrieve;
const input_v12_expenses_update = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		body: v12Def_V12ExpenseUpdate,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_expenses_update = v12Def_PUV12ExpenseUpdate;
const input_v12_expenses_delete = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_expenses_delete = z.undefined();
const input_v12_expenses_attachments_list = z
	.object({
		path: z.object({ parent_pk: z.string() }).strict(),
		query: z
			.object({
				page: z.number().int().optional(),
				page_size: z.number().int().optional(),
			})
			.strict()
			.optional(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_expenses_attachments_list = z
	.object({
		count: z.number().int(),
		next: z.string().nullable().optional(),
		previous: z.string().nullable().optional(),
		results: z.array(v12Def_PUV12ExpenseAttachmentListRetrieve),
	})
	.strict();
const input_v12_expenses_attachments_create = z
	.object({
		path: z.object({ parent_pk: z.string() }).strict(),
		form: z
			.object({
				title: z.string().min(1).max(120).optional(),
				file: z.instanceof(Blob),
				primary: z.boolean().optional(),
			})
			.strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_expenses_attachments_create =
	v12Def_ApiDocumentationAttachmentListRetrieve;
const input_v12_expenses_attachments_read = z
	.object({
		path: z.object({ id: z.string(), parent_pk: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_expenses_attachments_read =
	v12Def_PUV12ExpenseAttachmentListRetrieve;
const input_v12_expenses_attachments_partial_update = z
	.object({
		path: z.object({ id: z.string(), parent_pk: z.string() }).strict(),
		body: v12Def_PUV12ExpenseAttachmentListRetrieve,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_expenses_attachments_partial_update =
	v12Def_PUV12ExpenseAttachmentListRetrieve;
const input_v12_expenses_attachments_delete = z
	.object({
		path: z.object({ id: z.string(), parent_pk: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_expenses_attachments_delete = z.undefined();
const input_v12_expenses_attachments_file = z
	.object({
		path: z.object({ id: z.string(), parent_pk: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_expenses_attachments_file = ElorusBinaryResponseSchema;
const input_v12_expenses_notes_list = z
	.object({
		path: z.object({ parent_pk: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_expenses_notes_list = z.array(v12Def_PUV12NoteSerializer);
const input_v12_expenses_notes_create = z
	.object({
		path: z.object({ parent_pk: z.string() }).strict(),
		body: v12Def_V12Note,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_expenses_notes_create = v12Def_PUV12NoteSerializer;
const input_v12_expenses_notes_update = z
	.object({
		path: z.object({ id: z.string(), parent_pk: z.string() }).strict(),
		body: v12Def_V12Note,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_expenses_notes_update = v12Def_PUV12NoteSerializer;
const input_v12_expenses_notes_delete = z
	.object({
		path: z.object({ id: z.string(), parent_pk: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_expenses_notes_delete = z.undefined();
const input_v12_goodsreceipts_list = z
	.object({
		query: z
			.object({
				ordering: z.string().optional(),
				search: z.string().optional(),
				search_fields: z.string().optional(),
				period_from: z.string().optional(),
				period_to: z.string().optional(),
				period: z.string().optional(),
				status: z.string().optional(),
				draft: z.string().optional(),
				supplier: z.string().optional(),
				sequence: z.string().optional(),
				branch_id: z.string().optional(),
				custom_id: z.string().optional(),
				created_after: z.string().optional(),
				created_before: z.string().optional(),
				modified_after: z.string().optional(),
				modified_before: z.string().optional(),
				modified_period: z.string().optional(),
				created_period: z.string().optional(),
				page: z.number().int().optional(),
				page_size: z.number().int().optional(),
			})
			.strict()
			.optional(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_goodsreceipts_list = z
	.object({
		count: z.number().int(),
		next: z.string().nullable().optional(),
		previous: z.string().nullable().optional(),
		results: z.array(v12Def_PUV12GoodsReceiptList),
	})
	.strict();
const input_v12_goodsreceipts_create = z
	.object({
		body: v12Def_V12GoodsReceiptCreate,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_goodsreceipts_create = v12Def_PUV12GoodsReceiptCreate;
const input_v12_goodsreceipts_read = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_goodsreceipts_read = v12Def_PUV12GoodsReceiptRetrieve;
const input_v12_goodsreceipts_update = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		body: v12Def_V12GoodsReceiptUpdate,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_goodsreceipts_update = v12Def_PUV12GoodsReceiptUpdate;
const input_v12_goodsreceipts_partial_update = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		body: v12Def_PUV12GoodsReceiptPartialUpdate,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_goodsreceipts_partial_update =
	v12Def_PUV12GoodsReceiptPartialUpdate;
const input_v12_goodsreceipts_delete = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_goodsreceipts_delete = z.undefined();
const input_v12_goodsreceipts_email_from_template = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		query: z.object({ template_id: z.string().optional() }).strict().optional(),
		body: v12Def_DocumentEmailFromTemplate,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_goodsreceipts_email_from_template = v12Def_TrackedEmailMessage;
const input_v12_goodsreceipts_email_read = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_goodsreceipts_email_read = v12Def_PUEmailRetrieveSerializer;
const input_v12_goodsreceipts_email_create = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		body: v12Def_DocumentEmail,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_goodsreceipts_email_create = v12Def_TrackedEmailMessage;
const input_v12_goodsreceipts_pdf = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_goodsreceipts_pdf = ElorusBinaryResponseSchema;
const input_v12_goodsreceipts_mark_void = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		body: v12Def_VoidDocument,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_goodsreceipts_mark_void =
	v12Def_PUGoodsReceiptMarkVoidResponse;
const input_v12_goodsreceipts_notes_list = z
	.object({
		path: z.object({ parent_pk: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_goodsreceipts_notes_list = z.array(v12Def_PUV12NoteSerializer);
const input_v12_goodsreceipts_notes_create = z
	.object({
		path: z.object({ parent_pk: z.string() }).strict(),
		body: v12Def_V12Note,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_goodsreceipts_notes_create = v12Def_PUV12NoteSerializer;
const input_v12_goodsreceipts_notes_update = z
	.object({
		path: z.object({ id: z.string(), parent_pk: z.string() }).strict(),
		body: v12Def_V12Note,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_goodsreceipts_notes_update = v12Def_PUV12NoteSerializer;
const input_v12_goodsreceipts_notes_delete = z
	.object({
		path: z.object({ id: z.string(), parent_pk: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_goodsreceipts_notes_delete = z.undefined();
const input_v12_goodsreceipts_sent_email_messages_list = z
	.object({
		path: z.object({ parent_pk: z.string() }).strict(),
		query: z
			.object({
				search: z.string().optional(),
				search_fields: z.string().optional(),
				page: z.number().int().optional(),
				page_size: z.number().int().optional(),
			})
			.strict()
			.optional(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_goodsreceipts_sent_email_messages_list = z
	.object({
		count: z.number().int(),
		next: z.string().nullable().optional(),
		previous: z.string().nullable().optional(),
		results: z.array(v12Def_PUTrackedEmailMessageSerializer),
	})
	.strict();
const input_v12_goodsreceiptsequences_list = z
	.object({
		query: z.object({ active: z.boolean().optional() }).strict().optional(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_goodsreceiptsequences_list = z.array(
	v12Def_PUFlatSequenceList,
);
const input_v12_goodsreceiptsequences_create = z
	.object({
		body: v12Def_FlatSequence,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_goodsreceiptsequences_create = v12Def_PUFlatSequenceSerializer;
const input_v12_goodsreceiptsequences_delete_sequence = z
	.object({
		body: v12Def_FlatSequence,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_goodsreceiptsequences_delete_sequence = z.undefined();
const input_v12_goodsreceiptsequences_rename_sequence = z
	.object({
		body: v12Def_FlatSequenceRename,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_goodsreceiptsequences_rename_sequence =
	v12Def_PUFlatSequenceRename;
const input_v12_invoices_list = z
	.object({
		query: withTrackingCategoryFilters(
			z.object({
				ordering: z.string().optional(),
				search: z.string().optional(),
				search_fields: z.string().optional(),
				period_from: z.string().optional(),
				period_to: z.string().optional(),
				period: z.string().optional(),
				status: z.string().optional(),
				draft: z.string().optional(),
				pending_approval: z.string().optional(),
				fpaid: z.string().optional(),
				is_void: z.string().optional(),
				overdue: z.string().optional(),
				client: z.string().optional(),
				currency_code: z.string().optional(),
				documenttype: z.string().optional(),
				sequence: z.string().optional(),
				custom_id: z.string().optional(),
				created_after: z.string().optional(),
				created_before: z.string().optional(),
				modified_after: z.string().optional(),
				modified_before: z.string().optional(),
				modified_period: z.string().optional(),
				created_period: z.string().optional(),
				page: z.number().int().optional(),
				page_size: z.number().int().optional(),
			}),
		).optional(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_invoices_list = z
	.object({
		count: z.number().int(),
		next: z.string().nullable().optional(),
		previous: z.string().nullable().optional(),
		results: z.array(v12Def_PUV12InvoiceList),
	})
	.strict();
const input_v12_invoices_create = z
	.object({
		body: v12Def_V12InvoiceCreate,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_invoices_create = v12Def_PUV12InvoiceCreate;
const input_v12_invoices_read = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_invoices_read = v12Def_PUV12InvoiceRetrieve;
const input_v12_invoices_update = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		body: v12Def_V12InvoiceUpdate,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_invoices_update = v12Def_PUV12InvoiceUpdate;
const input_v12_invoices_partial_update = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		body: v12Def_PUV12InvoicePartialUpdate,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_invoices_partial_update = v12Def_PUV12InvoicePartialUpdate;
const input_v12_invoices_delete = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_invoices_delete = z.undefined();
const input_v12_invoices_email_from_template = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		query: z.object({ template_id: z.string().optional() }).strict().optional(),
		body: v12Def_InvoiceEmailFromTemplate,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_invoices_email_from_template = v12Def_TrackedEmailMessage;
const input_v12_invoices_email_read = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_invoices_email_read = v12Def_PUEmailRetrieveSerializer;
const input_v12_invoices_email_create = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		body: v12Def_InvoiceEmail,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_invoices_email_create = v12Def_TrackedEmailMessage;
const input_v12_invoices_pdf = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_invoices_pdf = ElorusBinaryResponseSchema;
const input_v12_invoices_mark_void = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		body: v12Def_VoidDocument,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_invoices_mark_void = v12Def_PUInvoiceMarkVoidResponse;
const input_v12_invoices_applied_credit_list = z
	.object({
		path: z.object({ parent_pk: z.string() }).strict(),
		query: z
			.object({
				page: z.number().int().optional(),
				page_size: z.number().int().optional(),
			})
			.strict()
			.optional(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_invoices_applied_credit_list = z
	.object({
		count: z.number().int(),
		next: z.string().nullable().optional(),
		previous: z.string().nullable().optional(),
		results: z.array(v12Def_PUInvoiceCreditTransactionInvSerializer),
	})
	.strict();
const input_v12_invoices_applied_credit_create = z
	.object({
		path: z.object({ parent_pk: z.string() }).strict(),
		body: z.array(v12Def_InvoiceCreditTransactionInv),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_invoices_applied_credit_create = z.array(
	v12Def_InvoiceCreditTransactionInv,
);
const input_v12_invoices_applied_credit_delete = z
	.object({
		path: z.object({ id: z.string(), parent_pk: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_invoices_applied_credit_delete = z.undefined();
const input_v12_invoices_attachments_list = z
	.object({
		path: z.object({ parent_pk: z.string() }).strict(),
		query: z
			.object({
				page: z.number().int().optional(),
				page_size: z.number().int().optional(),
			})
			.strict()
			.optional(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_invoices_attachments_list = z
	.object({
		count: z.number().int(),
		next: z.string().nullable().optional(),
		previous: z.string().nullable().optional(),
		results: z.array(v12Def_PUV12InvoiceAttachmentListRetrieve),
	})
	.strict();
const input_v12_invoices_attachments_create = z
	.object({
		path: z.object({ parent_pk: z.string() }).strict(),
		form: z
			.object({
				title: z.string().min(1).max(120).optional(),
				file: z.instanceof(Blob),
			})
			.strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_invoices_attachments_create =
	v12Def_ApiDocumentationAttachmentListRetrieve;
const input_v12_invoices_attachments_read = z
	.object({
		path: z.object({ id: z.string(), parent_pk: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_invoices_attachments_read =
	v12Def_PUV12InvoiceAttachmentListRetrieve;
const input_v12_invoices_attachments_partial_update = z
	.object({
		path: z.object({ id: z.string(), parent_pk: z.string() }).strict(),
		body: v12Def_PUV12InvoiceAttachmentListRetrieve,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_invoices_attachments_partial_update =
	v12Def_PUV12InvoiceAttachmentListRetrieve;
const input_v12_invoices_attachments_delete = z
	.object({
		path: z.object({ id: z.string(), parent_pk: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_invoices_attachments_delete = z.undefined();
const input_v12_invoices_attachments_file = z
	.object({
		path: z.object({ id: z.string(), parent_pk: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_invoices_attachments_file = ElorusBinaryResponseSchema;
const input_v12_invoices_discussions_list = z
	.object({
		path: z.object({ parent_pk: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_invoices_discussions_list = z.array(
	v12Def_PUV12DiscussionSerializer,
);
const input_v12_invoices_discussions_create = z
	.object({
		path: z.object({ parent_pk: z.string() }).strict(),
		body: v12Def_V12Discussion,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_invoices_discussions_create = v12Def_PUV12DiscussionSerializer;
const input_v12_invoices_discussions_update = z
	.object({
		path: z.object({ id: z.string(), parent_pk: z.string() }).strict(),
		body: v12Def_V12Discussion,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_invoices_discussions_update = v12Def_PUV12DiscussionSerializer;
const input_v12_invoices_discussions_delete = z
	.object({
		path: z.object({ id: z.string(), parent_pk: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_invoices_discussions_delete = z.undefined();
const input_v12_invoices_notes_list = z
	.object({
		path: z.object({ parent_pk: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_invoices_notes_list = z.array(v12Def_PUV12NoteSerializer);
const input_v12_invoices_notes_create = z
	.object({
		path: z.object({ parent_pk: z.string() }).strict(),
		body: v12Def_V12Note,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_invoices_notes_create = v12Def_PUV12NoteSerializer;
const input_v12_invoices_notes_update = z
	.object({
		path: z.object({ id: z.string(), parent_pk: z.string() }).strict(),
		body: v12Def_V12Note,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_invoices_notes_update = v12Def_PUV12NoteSerializer;
const input_v12_invoices_notes_delete = z
	.object({
		path: z.object({ id: z.string(), parent_pk: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_invoices_notes_delete = z.undefined();
const input_v12_invoices_sent_email_messages_list = z
	.object({
		path: z.object({ parent_pk: z.string() }).strict(),
		query: z
			.object({
				search: z.string().optional(),
				search_fields: z.string().optional(),
				page: z.number().int().optional(),
				page_size: z.number().int().optional(),
			})
			.strict()
			.optional(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_invoices_sent_email_messages_list = z
	.object({
		count: z.number().int(),
		next: z.string().nullable().optional(),
		previous: z.string().nullable().optional(),
		results: z.array(v12Def_PUTrackedEmailMessageSerializer),
	})
	.strict();
const input_v12_organizationbranch_list = z
	.object({
		query: z
			.object({
				ordering: z.string().optional(),
				search: z.string().optional(),
				search_fields: z.string().optional(),
				active: z.string().optional(),
				created_after: z.string().optional(),
				created_before: z.string().optional(),
				modified_after: z.string().optional(),
				modified_before: z.string().optional(),
				modified_period: z.string().optional(),
				created_period: z.string().optional(),
				page: z.number().int().optional(),
				page_size: z.number().int().optional(),
			})
			.strict()
			.optional(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_organizationbranch_list = z
	.object({
		count: z.number().int(),
		next: z.string().nullable().optional(),
		previous: z.string().nullable().optional(),
		results: z.array(v12Def_PUV12OrganizationBranchSerializer),
	})
	.strict();
const input_v12_organizationbranch_create = z
	.object({
		body: v12Def_V12OrganizationBranch,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_organizationbranch_create =
	v12Def_PUV12OrganizationBranchSerializer;
const input_v12_organizationbranch_read = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_organizationbranch_read =
	v12Def_PUV12OrganizationBranchSerializer;
const input_v12_organizationbranch_update = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		body: v12Def_V12OrganizationBranch,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_organizationbranch_update =
	v12Def_PUV12OrganizationBranchSerializer;
const input_v12_organizationbranch_partial_update = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		body: v12Def_PUV12OrganizationBranchSerializer,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_organizationbranch_partial_update =
	v12Def_PUV12OrganizationBranchSerializer;
const input_v12_organizationbranch_delete = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_organizationbranch_delete = z.undefined();
const input_v12_paymentgateways_list = z
	.object({
		query: z
			.object({
				ordering: z.string().optional(),
				search: z.string().optional(),
				search_fields: z.string().optional(),
				backend: z.string().optional(),
				active: z.string().optional(),
				default: z.string().optional(),
				page: z.number().int().optional(),
				page_size: z.number().int().optional(),
			})
			.strict()
			.optional(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_paymentgateways_list = z
	.object({
		count: z.number().int(),
		next: z.string().nullable().optional(),
		previous: z.string().nullable().optional(),
		results: z.array(v12Def_PUV12PaymentGatewayList),
	})
	.strict();
const input_v12_products_list = z
	.object({
		query: withTrackingCategoryFilters(
			z.object({
				search: z.string().optional(),
				search_fields: z.string().optional(),
				sales: z.string().optional(),
				purchases: z.string().optional(),
				active: z.string().optional(),
				custom_id: z.string().optional(),
				ordering: z.string().optional(),
				created_after: z.string().optional(),
				created_before: z.string().optional(),
				modified_after: z.string().optional(),
				modified_before: z.string().optional(),
				modified_period: z.string().optional(),
				created_period: z.string().optional(),
				page: z.number().int().optional(),
				page_size: z.number().int().optional(),
			}),
		).optional(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_products_list = z
	.object({
		count: z.number().int(),
		next: z.string().nullable().optional(),
		previous: z.string().nullable().optional(),
		results: z.array(v12Def_PUV12ProductOrServiceList),
	})
	.strict();
const input_v12_products_create = z
	.object({
		body: v12Def_V12ProductOrServiceCreate,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_products_create = v12Def_PUV12ProductOrServiceCreate;
const input_v12_products_read = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_products_read = v12Def_PUV12ProductOrServiceRetrieveUpdate;
const input_v12_products_update = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		body: v12Def_V12ProductOrServiceRetrieveUpdate,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_products_update = v12Def_PUV12ProductOrServiceRetrieveUpdate;
const input_v12_products_delete = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_products_delete = z.undefined();
const input_v12_products_notes_list = z
	.object({
		path: z.object({ parent_pk: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_products_notes_list = z.array(v12Def_PUV12NoteSerializer);
const input_v12_products_notes_create = z
	.object({
		path: z.object({ parent_pk: z.string() }).strict(),
		body: v12Def_V12Note,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_products_notes_create = v12Def_PUV12NoteSerializer;
const input_v12_products_notes_update = z
	.object({
		path: z.object({ id: z.string(), parent_pk: z.string() }).strict(),
		body: v12Def_V12Note,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_products_notes_update = v12Def_PUV12NoteSerializer;
const input_v12_products_notes_delete = z
	.object({
		path: z.object({ id: z.string(), parent_pk: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_products_notes_delete = z.undefined();
const input_v12_products_stockadjustments_list = z
	.object({
		path: z.object({ parent_pk: z.string() }).strict(),
		query: z
			.object({
				ordering: z.string().optional(),
				search: z.string().optional(),
				search_fields: z.string().optional(),
				created_after: z.string().optional(),
				created_before: z.string().optional(),
				modified_after: z.string().optional(),
				modified_before: z.string().optional(),
				modified_period: z.string().optional(),
				created_period: z.string().optional(),
				page: z.number().int().optional(),
				page_size: z.number().int().optional(),
			})
			.strict()
			.optional(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_products_stockadjustments_list = z
	.object({
		count: z.number().int(),
		next: z.string().nullable().optional(),
		previous: z.string().nullable().optional(),
		results: z.array(v12Def_PUStockAdjustmentSerializer),
	})
	.strict();
const input_v12_products_stockadjustments_create = z
	.object({
		path: z.object({ parent_pk: z.string() }).strict(),
		body: v12Def_StockAdjustment,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_products_stockadjustments_create =
	v12Def_PUStockAdjustmentSerializer;
const input_v12_products_stockadjustments_read = z
	.object({
		path: z.object({ id: z.string(), parent_pk: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_products_stockadjustments_read =
	v12Def_PUStockAdjustmentSerializer;
const input_v12_products_stockadjustments_delete = z
	.object({
		path: z.object({ id: z.string(), parent_pk: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_products_stockadjustments_delete = z.undefined();
const input_v12_projects_list = z
	.object({
		query: withTrackingCategoryFilters(
			z.object({
				ordering: z.string().optional(),
				search: z.string().optional(),
				search_fields: z.string().optional(),
				active: z.string().optional(),
				client: z.string().optional(),
				billing_method: z.string().optional(),
				page: z.number().int().optional(),
				page_size: z.number().int().optional(),
			}),
		).optional(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_projects_list = z
	.object({
		count: z.number().int(),
		next: z.string().nullable().optional(),
		previous: z.string().nullable().optional(),
		results: z.array(v12Def_PUV12ProjectList),
	})
	.strict();
const input_v12_projects_create = z
	.object({
		body: v12Def_V12ProjectCreateUpdate,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_projects_create = v12Def_PUV12ProjectCreateUpdate;
const input_v12_projects_read = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_projects_read = v12Def_PUV12ProjectRetrieve;
const input_v12_projects_update = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		body: v12Def_V12ProjectCreateUpdate,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_projects_update = v12Def_PUV12ProjectCreateUpdate;
const input_v12_projects_delete = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_projects_delete = z.undefined();
const input_v12_projects_attachments_list = z
	.object({
		path: z.object({ parent_pk: z.string() }).strict(),
		query: z
			.object({
				page: z.number().int().optional(),
				page_size: z.number().int().optional(),
			})
			.strict()
			.optional(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_projects_attachments_list = z
	.object({
		count: z.number().int(),
		next: z.string().nullable().optional(),
		previous: z.string().nullable().optional(),
		results: z.array(v12Def_PUV12ProjectAttachmentListRetrieve),
	})
	.strict();
const input_v12_projects_attachments_create = z
	.object({
		path: z.object({ parent_pk: z.string() }).strict(),
		form: z
			.object({
				title: z.string().min(1).max(120).optional(),
				file: z.instanceof(Blob),
			})
			.strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_projects_attachments_create =
	v12Def_ApiDocumentationAttachmentListRetrieve;
const input_v12_projects_attachments_read = z
	.object({
		path: z.object({ id: z.string(), parent_pk: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_projects_attachments_read =
	v12Def_PUV12ProjectAttachmentListRetrieve;
const input_v12_projects_attachments_partial_update = z
	.object({
		path: z.object({ id: z.string(), parent_pk: z.string() }).strict(),
		body: v12Def_PUV12ProjectAttachmentListRetrieve,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_projects_attachments_partial_update =
	v12Def_PUV12ProjectAttachmentListRetrieve;
const input_v12_projects_attachments_delete = z
	.object({
		path: z.object({ id: z.string(), parent_pk: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_projects_attachments_delete = z.undefined();
const input_v12_projects_attachments_file = z
	.object({
		path: z.object({ id: z.string(), parent_pk: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_projects_attachments_file = ElorusBinaryResponseSchema;
const input_v12_projects_discussions_list = z
	.object({
		path: z.object({ parent_pk: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_projects_discussions_list = z.array(
	v12Def_PUV12DiscussionSerializer,
);
const input_v12_projects_discussions_create = z
	.object({
		path: z.object({ parent_pk: z.string() }).strict(),
		body: v12Def_V12Discussion,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_projects_discussions_create = v12Def_PUV12DiscussionSerializer;
const input_v12_projects_discussions_update = z
	.object({
		path: z.object({ id: z.string(), parent_pk: z.string() }).strict(),
		body: v12Def_V12Discussion,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_projects_discussions_update = v12Def_PUV12DiscussionSerializer;
const input_v12_projects_discussions_delete = z
	.object({
		path: z.object({ id: z.string(), parent_pk: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_projects_discussions_delete = z.undefined();
const input_v12_projects_notes_list = z
	.object({
		path: z.object({ parent_pk: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_projects_notes_list = z.array(v12Def_PUV12NoteSerializer);
const input_v12_projects_notes_create = z
	.object({
		path: z.object({ parent_pk: z.string() }).strict(),
		body: v12Def_V12Note,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_projects_notes_create = v12Def_PUV12NoteSerializer;
const input_v12_projects_notes_update = z
	.object({
		path: z.object({ id: z.string(), parent_pk: z.string() }).strict(),
		body: v12Def_V12Note,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_projects_notes_update = v12Def_PUV12NoteSerializer;
const input_v12_projects_notes_delete = z
	.object({
		path: z.object({ id: z.string(), parent_pk: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_projects_notes_delete = z.undefined();
const input_v12_projects_projectextrafees_list = z
	.object({
		path: z.object({ parent_pk: z.string() }).strict(),
		query: z
			.object({
				ordering: z.string().optional(),
				search: z.string().optional(),
				search_fields: z.string().optional(),
				period_from: z.string().optional(),
				period_to: z.string().optional(),
				period: z.string().optional(),
				invoiced: z.string().optional(),
				created_after: z.string().optional(),
				created_before: z.string().optional(),
				modified_after: z.string().optional(),
				modified_before: z.string().optional(),
				modified_period: z.string().optional(),
				created_period: z.string().optional(),
				page: z.number().int().optional(),
				page_size: z.number().int().optional(),
			})
			.strict()
			.optional(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_projects_projectextrafees_list = z
	.object({
		count: z.number().int(),
		next: z.string().nullable().optional(),
		previous: z.string().nullable().optional(),
		results: z.array(v12Def_PUV12ProjectExtraFeesSerializer),
	})
	.strict();
const input_v12_projects_projectextrafees_create = z
	.object({
		path: z.object({ parent_pk: z.string() }).strict(),
		body: v12Def_V12ProjectExtraFees,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_projects_projectextrafees_create =
	v12Def_PUV12ProjectExtraFeesSerializer;
const input_v12_projects_projectextrafees_read = z
	.object({
		path: z.object({ id: z.string(), parent_pk: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_projects_projectextrafees_read =
	v12Def_PUV12ProjectExtraFeesSerializer;
const input_v12_projects_projectextrafees_update = z
	.object({
		path: z.object({ id: z.string(), parent_pk: z.string() }).strict(),
		body: v12Def_V12ProjectExtraFees,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_projects_projectextrafees_update =
	v12Def_PUV12ProjectExtraFeesSerializer;
const input_v12_projects_projectextrafees_partial_update = z
	.object({
		path: z.object({ id: z.string(), parent_pk: z.string() }).strict(),
		body: v12Def_PUV12ProjectExtraFeesSerializer,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_projects_projectextrafees_partial_update =
	v12Def_PUV12ProjectExtraFeesSerializer;
const input_v12_projects_projectextrafees_delete = z
	.object({
		path: z.object({ id: z.string(), parent_pk: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_projects_projectextrafees_delete = z.undefined();
const input_v12_recurringinvoices_list = z
	.object({
		query: withTrackingCategoryFilters(
			z.object({
				ordering: z.string().optional(),
				search: z.string().optional(),
				search_fields: z.string().optional(),
				documenttype: z.string().optional(),
				sequence: z.string().optional(),
				draft: z.string().optional(),
				client: z.string().optional(),
				currency_code: z.string().optional(),
				recurring_status: z.string().optional(),
				custom_id: z.string().optional(),
				created_after: z.string().optional(),
				created_before: z.string().optional(),
				modified_after: z.string().optional(),
				modified_before: z.string().optional(),
				modified_period: z.string().optional(),
				created_period: z.string().optional(),
				page: z.number().int().optional(),
				page_size: z.number().int().optional(),
			}),
		).optional(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_recurringinvoices_list = z
	.object({
		count: z.number().int(),
		next: z.string().nullable().optional(),
		previous: z.string().nullable().optional(),
		results: z.array(v12Def_PUV12RecurringInvoiceList),
	})
	.strict();
const input_v12_recurringinvoices_create = z
	.object({
		body: v12Def_V12RecurringInvoiceCreate,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_recurringinvoices_create = v12Def_PUV12RecurringInvoiceCreate;
const input_v12_recurringinvoices_read = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_recurringinvoices_read = v12Def_PUV12RecurringInvoiceRetrieve;
const input_v12_recurringinvoices_update = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		body: v12Def_V12RecurringInvoiceUpdate,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_recurringinvoices_update = v12Def_PUV12RecurringInvoiceUpdate;
const input_v12_recurringinvoices_delete = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_recurringinvoices_delete = z.undefined();
const input_v12_recurringinvoices_notes_list = z
	.object({
		path: z.object({ parent_pk: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_recurringinvoices_notes_list = z.array(
	v12Def_PUV12NoteSerializer,
);
const input_v12_recurringinvoices_notes_create = z
	.object({
		path: z.object({ parent_pk: z.string() }).strict(),
		body: v12Def_V12Note,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_recurringinvoices_notes_create = v12Def_PUV12NoteSerializer;
const input_v12_recurringinvoices_notes_update = z
	.object({
		path: z.object({ id: z.string(), parent_pk: z.string() }).strict(),
		body: v12Def_V12Note,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_recurringinvoices_notes_update = v12Def_PUV12NoteSerializer;
const input_v12_recurringinvoices_notes_delete = z
	.object({
		path: z.object({ id: z.string(), parent_pk: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_recurringinvoices_notes_delete = z.undefined();
const input_v12_suppliercredits_list = z
	.object({
		query: withTrackingCategoryFilters(
			z.object({
				ordering: z.string().optional(),
				search: z.string().optional(),
				search_fields: z.string().optional(),
				period_from: z.string().optional(),
				period_to: z.string().optional(),
				period: z.string().optional(),
				status: z.string().optional(),
				draft: z.string().optional(),
				pending_approval: z.string().optional(),
				fpaid: z.string().optional(),
				is_void: z.string().optional(),
				supplier: z.string().optional(),
				currency_code: z.string().optional(),
				documenttype: z.string().optional(),
				self_billed: z.string().optional(),
				custom_id: z.string().optional(),
				created_after: z.string().optional(),
				created_before: z.string().optional(),
				modified_after: z.string().optional(),
				modified_before: z.string().optional(),
				modified_period: z.string().optional(),
				created_period: z.string().optional(),
				page: z.number().int().optional(),
				page_size: z.number().int().optional(),
			}),
		).optional(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_suppliercredits_list = z
	.object({
		count: z.number().int(),
		next: z.string().nullable().optional(),
		previous: z.string().nullable().optional(),
		results: z.array(v12Def_PUV12PurchaseCreditNoteList),
	})
	.strict();
const input_v12_suppliercredits_create = z
	.object({
		body: v12Def_V12PurchaseCreditNoteCreate,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_suppliercredits_create = v12Def_PUV12PurchaseCreditNoteCreate;
const input_v12_suppliercredits_read = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_suppliercredits_read = v12Def_PUV12PurchaseCreditNoteRetrieve;
const input_v12_suppliercredits_update = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		body: v12Def_V12PurchaseCreditNoteUpdate,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_suppliercredits_update = v12Def_PUV12PurchaseCreditNoteUpdate;
const input_v12_suppliercredits_partial_update = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		body: v12Def_PUV12PurchaseCreditNotePartialUpdate,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_suppliercredits_partial_update =
	v12Def_PUV12PurchaseCreditNotePartialUpdate;
const input_v12_suppliercredits_delete = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_suppliercredits_delete = z.undefined();
const input_v12_suppliercredits_email_from_template = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		query: z.object({ template_id: z.string().optional() }).strict().optional(),
		body: v12Def_PrivatePurchaseCreditNoteEmailFromTemplate,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_suppliercredits_email_from_template =
	v12Def_TrackedEmailMessage;
const input_v12_suppliercredits_email_read = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_suppliercredits_email_read = v12Def_PUEmailRetrieveSerializer;
const input_v12_suppliercredits_email_create = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		body: v12Def_PrivatePurchaseCreditNoteEmail,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_suppliercredits_email_create = v12Def_TrackedEmailMessage;
const input_v12_suppliercredits_pdf = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_suppliercredits_pdf = ElorusBinaryResponseSchema;
const input_v12_suppliercredits_mark_void = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		body: v12Def_VoidDocument,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_suppliercredits_mark_void =
	v12Def_PUPurchaseCreditNoteMarkVoidResponse;
const input_v12_suppliercredits_applied_credit_list = z
	.object({
		path: z.object({ parent_pk: z.string() }).strict(),
		query: z
			.object({
				page: z.number().int().optional(),
				page_size: z.number().int().optional(),
			})
			.strict()
			.optional(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_suppliercredits_applied_credit_list = z
	.object({
		count: z.number().int(),
		next: z.string().nullable().optional(),
		previous: z.string().nullable().optional(),
		results: z.array(v12Def_PUV12PurchaseCreditTransactionPCNListCreate),
	})
	.strict();
const input_v12_suppliercredits_applied_credit_create = z
	.object({
		path: z.object({ parent_pk: z.string() }).strict(),
		body: z.array(v12Def_V12PurchaseCreditTransactionPCNListCreate),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_suppliercredits_applied_credit_create = z.array(
	v12Def_V12PurchaseCreditTransactionPCNListCreate,
);
const input_v12_suppliercredits_applied_credit_delete = z
	.object({
		path: z.object({ id: z.string(), parent_pk: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_suppliercredits_applied_credit_delete = z.undefined();
const input_v12_suppliercredits_attachments_list = z
	.object({
		path: z.object({ parent_pk: z.string() }).strict(),
		query: z
			.object({
				page: z.number().int().optional(),
				page_size: z.number().int().optional(),
			})
			.strict()
			.optional(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_suppliercredits_attachments_list = z
	.object({
		count: z.number().int(),
		next: z.string().nullable().optional(),
		previous: z.string().nullable().optional(),
		results: z.array(v12Def_PUV12PurchaseCreditNoteAttachmentListRetrieve),
	})
	.strict();
const input_v12_suppliercredits_attachments_create = z
	.object({
		path: z.object({ parent_pk: z.string() }).strict(),
		form: z
			.object({
				title: z.string().min(1).max(120).optional(),
				file: z.instanceof(Blob),
				primary: z.boolean().optional(),
			})
			.strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_suppliercredits_attachments_create =
	v12Def_ApiDocumentationAttachmentListRetrieve;
const input_v12_suppliercredits_attachments_read = z
	.object({
		path: z.object({ id: z.string(), parent_pk: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_suppliercredits_attachments_read =
	v12Def_PUV12PurchaseCreditNoteAttachmentListRetrieve;
const input_v12_suppliercredits_attachments_partial_update = z
	.object({
		path: z.object({ id: z.string(), parent_pk: z.string() }).strict(),
		body: v12Def_PUV12PurchaseCreditNoteAttachmentListRetrieve,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_suppliercredits_attachments_partial_update =
	v12Def_PUV12PurchaseCreditNoteAttachmentListRetrieve;
const input_v12_suppliercredits_attachments_delete = z
	.object({
		path: z.object({ id: z.string(), parent_pk: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_suppliercredits_attachments_delete = z.undefined();
const input_v12_suppliercredits_attachments_file = z
	.object({
		path: z.object({ id: z.string(), parent_pk: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_suppliercredits_attachments_file = ElorusBinaryResponseSchema;
const input_v12_suppliercredits_notes_list = z
	.object({
		path: z.object({ parent_pk: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_suppliercredits_notes_list = z.array(
	v12Def_PUV12NoteSerializer,
);
const input_v12_suppliercredits_notes_create = z
	.object({
		path: z.object({ parent_pk: z.string() }).strict(),
		body: v12Def_V12Note,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_suppliercredits_notes_create = v12Def_PUV12NoteSerializer;
const input_v12_suppliercredits_notes_update = z
	.object({
		path: z.object({ id: z.string(), parent_pk: z.string() }).strict(),
		body: v12Def_V12Note,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_suppliercredits_notes_update = v12Def_PUV12NoteSerializer;
const input_v12_suppliercredits_notes_delete = z
	.object({
		path: z.object({ id: z.string(), parent_pk: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_suppliercredits_notes_delete = z.undefined();
const input_v12_suppliercredits_sent_email_messages_list = z
	.object({
		path: z.object({ parent_pk: z.string() }).strict(),
		query: z
			.object({
				search: z.string().optional(),
				search_fields: z.string().optional(),
				page: z.number().int().optional(),
				page_size: z.number().int().optional(),
			})
			.strict()
			.optional(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_suppliercredits_sent_email_messages_list = z
	.object({
		count: z.number().int(),
		next: z.string().nullable().optional(),
		previous: z.string().nullable().optional(),
		results: z.array(v12Def_PUTrackedEmailMessageSerializer),
	})
	.strict();
const input_v12_tasks_list = z
	.object({
		query: z
			.object({
				ordering: z.string().optional(),
				search: z.string().optional(),
				search_fields: z.string().optional(),
				active: z.string().optional(),
				project: z.string().optional(),
				page: z.number().int().optional(),
				page_size: z.number().int().optional(),
			})
			.strict()
			.optional(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_tasks_list = z
	.object({
		count: z.number().int(),
		next: z.string().nullable().optional(),
		previous: z.string().nullable().optional(),
		results: z.array(v12Def_PUV12TaskSerializer),
	})
	.strict();
const input_v12_tasks_create = z
	.object({
		body: v12Def_V12Task,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_tasks_create = v12Def_PUV12TaskSerializer;
const input_v12_tasks_read = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_tasks_read = v12Def_PUV12TaskSerializer;
const input_v12_tasks_update = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		body: v12Def_V12TaskUpdate,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_tasks_update = v12Def_PUV12TaskUpdate;
const input_v12_tasks_delete = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_tasks_delete = z.undefined();
const input_v12_taxes_list = z
	.object({
		query: z
			.object({
				ordering: z.string().optional(),
				search: z.string().optional(),
				search_fields: z.string().optional(),
				active: z.string().optional(),
				operand: z.string().optional(),
				tax_type: z.string().optional(),
				created_after: z.string().optional(),
				created_before: z.string().optional(),
				modified_after: z.string().optional(),
				modified_before: z.string().optional(),
				modified_period: z.string().optional(),
				created_period: z.string().optional(),
				page: z.number().int().optional(),
				page_size: z.number().int().optional(),
			})
			.strict()
			.optional(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_taxes_list = z
	.object({
		count: z.number().int(),
		next: z.string().nullable().optional(),
		previous: z.string().nullable().optional(),
		results: z.array(v12Def_PUV12TaxList),
	})
	.strict();
const input_v12_taxes_read = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_taxes_read = v12Def_PUV12TaxRetrieve;
const input_v12_templates_list = z
	.object({
		query: z
			.object({
				ordering: z.string().optional(),
				search: z.string().optional(),
				search_fields: z.string().optional(),
				active: z.string().optional(),
				template: z.string().optional(),
				language: z.string().optional(),
				page: z.number().int().optional(),
				page_size: z.number().int().optional(),
			})
			.strict()
			.optional(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_templates_list = z
	.object({
		count: z.number().int(),
		next: z.string().nullable().optional(),
		previous: z.string().nullable().optional(),
		results: z.array(v12Def_PUV12ThemeListRetrieve),
	})
	.strict();
const input_v12_templates_read = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_templates_read = v12Def_PUV12ThemeListRetrieve;
const input_v12_timeentries_list = z
	.object({
		query: z
			.object({
				ordering: z.string().optional(),
				search: z.string().optional(),
				search_fields: z.string().optional(),
				project: z.string().optional(),
				task: z.string().optional(),
				billing_status: z.string().optional(),
				assignee: z.string().optional(),
				client: z.string().optional(),
				user_team: z.string().optional(),
				period_from: z.string().optional(),
				period_to: z.string().optional(),
				period: z.string().optional(),
				page: z.number().int().optional(),
				page_size: z.number().int().optional(),
			})
			.strict()
			.optional(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_timeentries_list = z
	.object({
		count: z.number().int(),
		next: z.string().nullable().optional(),
		previous: z.string().nullable().optional(),
		results: z.array(v12Def_PUV12TimeEntryListRetrieve),
	})
	.strict();
const input_v12_timeentries_create = z
	.object({
		body: v12Def_V12TimeEntryCreateUpdate,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_timeentries_create = v12Def_PUV12TimeEntryCreateUpdate;
const input_v12_timeentries_read = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_timeentries_read = v12Def_PUV12TimeEntryListRetrieve;
const input_v12_timeentries_update = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		body: v12Def_V12TimeEntryCreateUpdate,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_timeentries_update = v12Def_PUV12TimeEntryCreateUpdate;
const input_v12_timeentries_delete = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_timeentries_delete = z.undefined();
const input_v12_timeentries_mark_billed = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_timeentries_mark_billed = z.undefined();
const input_v12_timeentries_mark_unbilled = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_timeentries_mark_unbilled = z.undefined();
const input_v12_trackingcategories_list = z
	.object({
		query: z
			.object({
				ordering: z.string().optional(),
				search: z.string().optional(),
				search_fields: z.string().optional(),
				active: z.string().optional(),
				application: z.string().optional(),
				page: z.number().int().optional(),
				page_size: z.number().int().optional(),
			})
			.strict()
			.optional(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_trackingcategories_list = z
	.object({
		count: z.number().int(),
		next: z.string().nullable().optional(),
		previous: z.string().nullable().optional(),
		results: z.array(v12Def_PUV12TrackingCategoryListRetrieve),
	})
	.strict();
const input_v12_trackingcategories_read = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_trackingcategories_read =
	v12Def_PUV12TrackingCategoryListRetrieve;
const input_v12_unitofmeasurement_list = z
	.object({
		query: z
			.object({
				ordering: z.string().optional(),
				search: z.string().optional(),
				search_fields: z.string().optional(),
				active: z.string().optional(),
				group_id: z.string().optional(),
				created_after: z.string().optional(),
				created_before: z.string().optional(),
				modified_after: z.string().optional(),
				modified_before: z.string().optional(),
				modified_period: z.string().optional(),
				created_period: z.string().optional(),
				page: z.number().int().optional(),
				page_size: z.number().int().optional(),
			})
			.strict()
			.optional(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_unitofmeasurement_list = z
	.object({
		count: z.number().int(),
		next: z.string().nullable().optional(),
		previous: z.string().nullable().optional(),
		results: z.array(v12Def_PUV12UnitOfMeasurementListSerializer),
	})
	.strict();
const input_v12_unitofmeasurement_create = z
	.object({
		body: v12Def_V12UnitOfMeasurementList,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_unitofmeasurement_create =
	v12Def_PUV12UnitOfMeasurementListSerializer;
const input_v12_unitofmeasurement_read = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_unitofmeasurement_read =
	v12Def_PUV12UnitOfMeasurementListSerializer;
const input_v12_unitofmeasurement_update = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		body: v12Def_V12UnitOfMeasurementList,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_unitofmeasurement_update =
	v12Def_PUV12UnitOfMeasurementListSerializer;
const input_v12_unitofmeasurement_partial_update = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		body: v12Def_PUV12UnitOfMeasurementListSerializer,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_unitofmeasurement_partial_update =
	v12Def_PUV12UnitOfMeasurementListSerializer;
const input_v12_unitofmeasurement_delete = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_unitofmeasurement_delete = z.undefined();
const input_v12_users_list = z
	.object({
		query: z
			.object({
				ordering: z.string().optional(),
				search: z.string().optional(),
				search_fields: z.string().optional(),
				active: z.string().optional(),
				page: z.number().int().optional(),
				page_size: z.number().int().optional(),
			})
			.strict()
			.optional(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_users_list = z
	.object({
		count: z.number().int(),
		next: z.string().nullable().optional(),
		previous: z.string().nullable().optional(),
		results: z.array(v12Def_PUV12RoleList),
	})
	.strict();
const input_v12_userteams_list = z
	.object({
		query: z
			.object({
				ordering: z.string().optional(),
				search: z.string().optional(),
				search_fields: z.string().optional(),
				page: z.number().int().optional(),
				page_size: z.number().int().optional(),
			})
			.strict()
			.optional(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_userteams_list = z
	.object({
		count: z.number().int(),
		next: z.string().nullable().optional(),
		previous: z.string().nullable().optional(),
		results: z.array(v12Def_PUV12UserTeam),
	})
	.strict();
const input_v12_warehouse_list = z
	.object({
		query: z
			.object({
				ordering: z.string().optional(),
				search: z.string().optional(),
				search_fields: z.string().optional(),
				active: z.string().optional(),
				created_after: z.string().optional(),
				created_before: z.string().optional(),
				modified_after: z.string().optional(),
				modified_before: z.string().optional(),
				modified_period: z.string().optional(),
				created_period: z.string().optional(),
				page: z.number().int().optional(),
				page_size: z.number().int().optional(),
			})
			.strict()
			.optional(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_warehouse_list = z
	.object({
		count: z.number().int(),
		next: z.string().nullable().optional(),
		previous: z.string().nullable().optional(),
		results: z.array(v12Def_PUV12WarehouseSerializer),
	})
	.strict();
const input_v12_warehouse_create = z
	.object({
		body: v12Def_V12Warehouse,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_warehouse_create = v12Def_PUV12WarehouseSerializer;
const input_v12_warehouse_read = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_warehouse_read = v12Def_PUV12WarehouseSerializer;
const input_v12_warehouse_update = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		body: v12Def_V12Warehouse,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_warehouse_update = v12Def_PUV12WarehouseSerializer;
const input_v12_warehouse_partial_update = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		body: v12Def_PUV12WarehouseSerializer,
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_warehouse_partial_update = v12Def_PUV12WarehouseSerializer;
const input_v12_warehouse_delete = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		demo: z.boolean().optional(),
	})
	.strict();
const output_v12_warehouse_delete = z.undefined();

export const elorusOperationSchemas = {
	'v11.bills_list': {
		input: input_v11_bills_list,
		output: output_v11_bills_list,
	},
	'v11.bills_create': {
		input: input_v11_bills_create,
		output: output_v11_bills_create,
	},
	'v11.bills_read': {
		input: input_v11_bills_read,
		output: output_v11_bills_read,
	},
	'v11.bills_update': {
		input: input_v11_bills_update,
		output: output_v11_bills_update,
	},
	'v11.bills_partial_update': {
		input: input_v11_bills_partial_update,
		output: output_v11_bills_partial_update,
	},
	'v11.bills_delete': {
		input: input_v11_bills_delete,
		output: output_v11_bills_delete,
	},
	'v11.bills_email_from_template': {
		input: input_v11_bills_email_from_template,
		output: output_v11_bills_email_from_template,
	},
	'v11.bills_email_read': {
		input: input_v11_bills_email_read,
		output: output_v11_bills_email_read,
	},
	'v11.bills_email_create': {
		input: input_v11_bills_email_create,
		output: output_v11_bills_email_create,
	},
	'v11.bills_pdf': { input: input_v11_bills_pdf, output: output_v11_bills_pdf },
	'v11.bills_mark_void': {
		input: input_v11_bills_mark_void,
		output: output_v11_bills_mark_void,
	},
	'v11.cashpayments_list': {
		input: input_v11_cashpayments_list,
		output: output_v11_cashpayments_list,
	},
	'v11.cashpayments_create': {
		input: input_v11_cashpayments_create,
		output: output_v11_cashpayments_create,
	},
	'v11.cashpayments_read': {
		input: input_v11_cashpayments_read,
		output: output_v11_cashpayments_read,
	},
	'v11.cashpayments_update': {
		input: input_v11_cashpayments_update,
		output: output_v11_cashpayments_update,
	},
	'v11.cashpayments_delete': {
		input: input_v11_cashpayments_delete,
		output: output_v11_cashpayments_delete,
	},
	'v11.cashpayments_pdf': {
		input: input_v11_cashpayments_pdf,
		output: output_v11_cashpayments_pdf,
	},
	'v11.cashreceipts_list': {
		input: input_v11_cashreceipts_list,
		output: output_v11_cashreceipts_list,
	},
	'v11.cashreceipts_create': {
		input: input_v11_cashreceipts_create,
		output: output_v11_cashreceipts_create,
	},
	'v11.cashreceipts_read': {
		input: input_v11_cashreceipts_read,
		output: output_v11_cashreceipts_read,
	},
	'v11.cashreceipts_update': {
		input: input_v11_cashreceipts_update,
		output: output_v11_cashreceipts_update,
	},
	'v11.cashreceipts_delete': {
		input: input_v11_cashreceipts_delete,
		output: output_v11_cashreceipts_delete,
	},
	'v11.cashreceipts_pdf': {
		input: input_v11_cashreceipts_pdf,
		output: output_v11_cashreceipts_pdf,
	},
	'v11.contacts_list': {
		input: input_v11_contacts_list,
		output: output_v11_contacts_list,
	},
	'v11.contacts_create': {
		input: input_v11_contacts_create,
		output: output_v11_contacts_create,
	},
	'v11.contacts_read': {
		input: input_v11_contacts_read,
		output: output_v11_contacts_read,
	},
	'v11.contacts_update': {
		input: input_v11_contacts_update,
		output: output_v11_contacts_update,
	},
	'v11.contacts_delete': {
		input: input_v11_contacts_delete,
		output: output_v11_contacts_delete,
	},
	'v11.creditnotes_list': {
		input: input_v11_creditnotes_list,
		output: output_v11_creditnotes_list,
	},
	'v11.creditnotes_create': {
		input: input_v11_creditnotes_create,
		output: output_v11_creditnotes_create,
	},
	'v11.creditnotes_read': {
		input: input_v11_creditnotes_read,
		output: output_v11_creditnotes_read,
	},
	'v11.creditnotes_update': {
		input: input_v11_creditnotes_update,
		output: output_v11_creditnotes_update,
	},
	'v11.creditnotes_partial_update': {
		input: input_v11_creditnotes_partial_update,
		output: output_v11_creditnotes_partial_update,
	},
	'v11.creditnotes_delete': {
		input: input_v11_creditnotes_delete,
		output: output_v11_creditnotes_delete,
	},
	'v11.creditnotes_email_from_template': {
		input: input_v11_creditnotes_email_from_template,
		output: output_v11_creditnotes_email_from_template,
	},
	'v11.creditnotes_email_read': {
		input: input_v11_creditnotes_email_read,
		output: output_v11_creditnotes_email_read,
	},
	'v11.creditnotes_email_create': {
		input: input_v11_creditnotes_email_create,
		output: output_v11_creditnotes_email_create,
	},
	'v11.creditnotes_pdf': {
		input: input_v11_creditnotes_pdf,
		output: output_v11_creditnotes_pdf,
	},
	'v11.creditnotes_mark_void': {
		input: input_v11_creditnotes_mark_void,
		output: output_v11_creditnotes_mark_void,
	},
	'v11.creditnotes_applied-credit_list': {
		input: input_v11_creditnotes_applied_credit_list,
		output: output_v11_creditnotes_applied_credit_list,
	},
	'v11.creditnotes_applied-credit_create': {
		input: input_v11_creditnotes_applied_credit_create,
		output: output_v11_creditnotes_applied_credit_create,
	},
	'v11.creditnotes_applied-credit_delete': {
		input: input_v11_creditnotes_applied_credit_delete,
		output: output_v11_creditnotes_applied_credit_delete,
	},
	'v11.documenttypes_list': {
		input: input_v11_documenttypes_list,
		output: output_v11_documenttypes_list,
	},
	'v11.documenttypes_read': {
		input: input_v11_documenttypes_read,
		output: output_v11_documenttypes_read,
	},
	'v11.emailtemplates_list': {
		input: input_v11_emailtemplates_list,
		output: output_v11_emailtemplates_list,
	},
	'v11.emailtemplates_create': {
		input: input_v11_emailtemplates_create,
		output: output_v11_emailtemplates_create,
	},
	'v11.emailtemplates_read': {
		input: input_v11_emailtemplates_read,
		output: output_v11_emailtemplates_read,
	},
	'v11.emailtemplates_update': {
		input: input_v11_emailtemplates_update,
		output: output_v11_emailtemplates_update,
	},
	'v11.emailtemplates_delete': {
		input: input_v11_emailtemplates_delete,
		output: output_v11_emailtemplates_delete,
	},
	'v11.estimates_list': {
		input: input_v11_estimates_list,
		output: output_v11_estimates_list,
	},
	'v11.estimates_create': {
		input: input_v11_estimates_create,
		output: output_v11_estimates_create,
	},
	'v11.estimates_read': {
		input: input_v11_estimates_read,
		output: output_v11_estimates_read,
	},
	'v11.estimates_update': {
		input: input_v11_estimates_update,
		output: output_v11_estimates_update,
	},
	'v11.estimates_partial_update': {
		input: input_v11_estimates_partial_update,
		output: output_v11_estimates_partial_update,
	},
	'v11.estimates_delete': {
		input: input_v11_estimates_delete,
		output: output_v11_estimates_delete,
	},
	'v11.estimates_email_from_template': {
		input: input_v11_estimates_email_from_template,
		output: output_v11_estimates_email_from_template,
	},
	'v11.estimates_email_read': {
		input: input_v11_estimates_email_read,
		output: output_v11_estimates_email_read,
	},
	'v11.estimates_email_create': {
		input: input_v11_estimates_email_create,
		output: output_v11_estimates_email_create,
	},
	'v11.estimates_pdf': {
		input: input_v11_estimates_pdf,
		output: output_v11_estimates_pdf,
	},
	'v11.expensecategories_list': {
		input: input_v11_expensecategories_list,
		output: output_v11_expensecategories_list,
	},
	'v11.expensecategories_read': {
		input: input_v11_expensecategories_read,
		output: output_v11_expensecategories_read,
	},
	'v11.expenses_list': {
		input: input_v11_expenses_list,
		output: output_v11_expenses_list,
	},
	'v11.expenses_create': {
		input: input_v11_expenses_create,
		output: output_v11_expenses_create,
	},
	'v11.expenses_read': {
		input: input_v11_expenses_read,
		output: output_v11_expenses_read,
	},
	'v11.expenses_update': {
		input: input_v11_expenses_update,
		output: output_v11_expenses_update,
	},
	'v11.expenses_delete': {
		input: input_v11_expenses_delete,
		output: output_v11_expenses_delete,
	},
	'v11.invoices_list': {
		input: input_v11_invoices_list,
		output: output_v11_invoices_list,
	},
	'v11.invoices_create': {
		input: input_v11_invoices_create,
		output: output_v11_invoices_create,
	},
	'v11.invoices_read': {
		input: input_v11_invoices_read,
		output: output_v11_invoices_read,
	},
	'v11.invoices_update': {
		input: input_v11_invoices_update,
		output: output_v11_invoices_update,
	},
	'v11.invoices_partial_update': {
		input: input_v11_invoices_partial_update,
		output: output_v11_invoices_partial_update,
	},
	'v11.invoices_delete': {
		input: input_v11_invoices_delete,
		output: output_v11_invoices_delete,
	},
	'v11.invoices_email_from_template': {
		input: input_v11_invoices_email_from_template,
		output: output_v11_invoices_email_from_template,
	},
	'v11.invoices_email_read': {
		input: input_v11_invoices_email_read,
		output: output_v11_invoices_email_read,
	},
	'v11.invoices_email_create': {
		input: input_v11_invoices_email_create,
		output: output_v11_invoices_email_create,
	},
	'v11.invoices_pdf': {
		input: input_v11_invoices_pdf,
		output: output_v11_invoices_pdf,
	},
	'v11.invoices_mark_void': {
		input: input_v11_invoices_mark_void,
		output: output_v11_invoices_mark_void,
	},
	'v11.invoices_applied-credit_list': {
		input: input_v11_invoices_applied_credit_list,
		output: output_v11_invoices_applied_credit_list,
	},
	'v11.invoices_applied-credit_create': {
		input: input_v11_invoices_applied_credit_create,
		output: output_v11_invoices_applied_credit_create,
	},
	'v11.invoices_applied-credit_delete': {
		input: input_v11_invoices_applied_credit_delete,
		output: output_v11_invoices_applied_credit_delete,
	},
	'v11.numberingsequence_list': {
		input: input_v11_numberingsequence_list,
		output: output_v11_numberingsequence_list,
	},
	'v11.numberingsequence_create': {
		input: input_v11_numberingsequence_create,
		output: output_v11_numberingsequence_create,
	},
	'v11.numberingsequence_read': {
		input: input_v11_numberingsequence_read,
		output: output_v11_numberingsequence_read,
	},
	'v11.numberingsequence_update': {
		input: input_v11_numberingsequence_update,
		output: output_v11_numberingsequence_update,
	},
	'v11.numberingsequence_delete': {
		input: input_v11_numberingsequence_delete,
		output: output_v11_numberingsequence_delete,
	},
	'v11.paymentgateways_list': {
		input: input_v11_paymentgateways_list,
		output: output_v11_paymentgateways_list,
	},
	'v11.products_list': {
		input: input_v11_products_list,
		output: output_v11_products_list,
	},
	'v11.products_create': {
		input: input_v11_products_create,
		output: output_v11_products_create,
	},
	'v11.products_read': {
		input: input_v11_products_read,
		output: output_v11_products_read,
	},
	'v11.products_update': {
		input: input_v11_products_update,
		output: output_v11_products_update,
	},
	'v11.products_delete': {
		input: input_v11_products_delete,
		output: output_v11_products_delete,
	},
	'v11.projects_list': {
		input: input_v11_projects_list,
		output: output_v11_projects_list,
	},
	'v11.projects_read': {
		input: input_v11_projects_read,
		output: output_v11_projects_read,
	},
	'v11.recurringinvoices_list': {
		input: input_v11_recurringinvoices_list,
		output: output_v11_recurringinvoices_list,
	},
	'v11.recurringinvoices_create': {
		input: input_v11_recurringinvoices_create,
		output: output_v11_recurringinvoices_create,
	},
	'v11.recurringinvoices_read': {
		input: input_v11_recurringinvoices_read,
		output: output_v11_recurringinvoices_read,
	},
	'v11.recurringinvoices_update': {
		input: input_v11_recurringinvoices_update,
		output: output_v11_recurringinvoices_update,
	},
	'v11.recurringinvoices_delete': {
		input: input_v11_recurringinvoices_delete,
		output: output_v11_recurringinvoices_delete,
	},
	'v11.suppliercredits_list': {
		input: input_v11_suppliercredits_list,
		output: output_v11_suppliercredits_list,
	},
	'v11.suppliercredits_create': {
		input: input_v11_suppliercredits_create,
		output: output_v11_suppliercredits_create,
	},
	'v11.suppliercredits_read': {
		input: input_v11_suppliercredits_read,
		output: output_v11_suppliercredits_read,
	},
	'v11.suppliercredits_update': {
		input: input_v11_suppliercredits_update,
		output: output_v11_suppliercredits_update,
	},
	'v11.suppliercredits_partial_update': {
		input: input_v11_suppliercredits_partial_update,
		output: output_v11_suppliercredits_partial_update,
	},
	'v11.suppliercredits_delete': {
		input: input_v11_suppliercredits_delete,
		output: output_v11_suppliercredits_delete,
	},
	'v11.suppliercredits_email_from_template': {
		input: input_v11_suppliercredits_email_from_template,
		output: output_v11_suppliercredits_email_from_template,
	},
	'v11.suppliercredits_email_read': {
		input: input_v11_suppliercredits_email_read,
		output: output_v11_suppliercredits_email_read,
	},
	'v11.suppliercredits_email_create': {
		input: input_v11_suppliercredits_email_create,
		output: output_v11_suppliercredits_email_create,
	},
	'v11.suppliercredits_pdf': {
		input: input_v11_suppliercredits_pdf,
		output: output_v11_suppliercredits_pdf,
	},
	'v11.suppliercredits_mark_void': {
		input: input_v11_suppliercredits_mark_void,
		output: output_v11_suppliercredits_mark_void,
	},
	'v11.suppliercredits_applied-credit_list': {
		input: input_v11_suppliercredits_applied_credit_list,
		output: output_v11_suppliercredits_applied_credit_list,
	},
	'v11.suppliercredits_applied-credit_create': {
		input: input_v11_suppliercredits_applied_credit_create,
		output: output_v11_suppliercredits_applied_credit_create,
	},
	'v11.suppliercredits_applied-credit_delete': {
		input: input_v11_suppliercredits_applied_credit_delete,
		output: output_v11_suppliercredits_applied_credit_delete,
	},
	'v11.taxes_list': {
		input: input_v11_taxes_list,
		output: output_v11_taxes_list,
	},
	'v11.taxes_read': {
		input: input_v11_taxes_read,
		output: output_v11_taxes_read,
	},
	'v11.templates_list': {
		input: input_v11_templates_list,
		output: output_v11_templates_list,
	},
	'v11.templates_read': {
		input: input_v11_templates_read,
		output: output_v11_templates_read,
	},
	'v11.trackingcategories_list': {
		input: input_v11_trackingcategories_list,
		output: output_v11_trackingcategories_list,
	},
	'v11.trackingcategories_read': {
		input: input_v11_trackingcategories_read,
		output: output_v11_trackingcategories_read,
	},
	'v11.warehouse_list': {
		input: input_v11_warehouse_list,
		output: output_v11_warehouse_list,
	},
	'v11.warehouse_create': {
		input: input_v11_warehouse_create,
		output: output_v11_warehouse_create,
	},
	'v11.warehouse_read': {
		input: input_v11_warehouse_read,
		output: output_v11_warehouse_read,
	},
	'v11.warehouse_update': {
		input: input_v11_warehouse_update,
		output: output_v11_warehouse_update,
	},
	'v11.warehouse_partial_update': {
		input: input_v11_warehouse_partial_update,
		output: output_v11_warehouse_partial_update,
	},
	'v11.warehouse_delete': {
		input: input_v11_warehouse_delete,
		output: output_v11_warehouse_delete,
	},
	'v12.bills_list': {
		input: input_v12_bills_list,
		output: output_v12_bills_list,
	},
	'v12.bills_create': {
		input: input_v12_bills_create,
		output: output_v12_bills_create,
	},
	'v12.bills_read': {
		input: input_v12_bills_read,
		output: output_v12_bills_read,
	},
	'v12.bills_update': {
		input: input_v12_bills_update,
		output: output_v12_bills_update,
	},
	'v12.bills_partial_update': {
		input: input_v12_bills_partial_update,
		output: output_v12_bills_partial_update,
	},
	'v12.bills_delete': {
		input: input_v12_bills_delete,
		output: output_v12_bills_delete,
	},
	'v12.bills_email_from_template': {
		input: input_v12_bills_email_from_template,
		output: output_v12_bills_email_from_template,
	},
	'v12.bills_email_read': {
		input: input_v12_bills_email_read,
		output: output_v12_bills_email_read,
	},
	'v12.bills_email_create': {
		input: input_v12_bills_email_create,
		output: output_v12_bills_email_create,
	},
	'v12.bills_pdf': { input: input_v12_bills_pdf, output: output_v12_bills_pdf },
	'v12.bills_mark_void': {
		input: input_v12_bills_mark_void,
		output: output_v12_bills_mark_void,
	},
	'v12.bills_attachments_list': {
		input: input_v12_bills_attachments_list,
		output: output_v12_bills_attachments_list,
	},
	'v12.bills_attachments_create': {
		input: input_v12_bills_attachments_create,
		output: output_v12_bills_attachments_create,
	},
	'v12.bills_attachments_read': {
		input: input_v12_bills_attachments_read,
		output: output_v12_bills_attachments_read,
	},
	'v12.bills_attachments_partial_update': {
		input: input_v12_bills_attachments_partial_update,
		output: output_v12_bills_attachments_partial_update,
	},
	'v12.bills_attachments_delete': {
		input: input_v12_bills_attachments_delete,
		output: output_v12_bills_attachments_delete,
	},
	'v12.bills_attachments_file': {
		input: input_v12_bills_attachments_file,
		output: output_v12_bills_attachments_file,
	},
	'v12.bills_notes_list': {
		input: input_v12_bills_notes_list,
		output: output_v12_bills_notes_list,
	},
	'v12.bills_notes_create': {
		input: input_v12_bills_notes_create,
		output: output_v12_bills_notes_create,
	},
	'v12.bills_notes_update': {
		input: input_v12_bills_notes_update,
		output: output_v12_bills_notes_update,
	},
	'v12.bills_notes_delete': {
		input: input_v12_bills_notes_delete,
		output: output_v12_bills_notes_delete,
	},
	'v12.bills_sent-email-messages_list': {
		input: input_v12_bills_sent_email_messages_list,
		output: output_v12_bills_sent_email_messages_list,
	},
	'v12.cashpayments_list': {
		input: input_v12_cashpayments_list,
		output: output_v12_cashpayments_list,
	},
	'v12.cashpayments_create': {
		input: input_v12_cashpayments_create,
		output: output_v12_cashpayments_create,
	},
	'v12.cashpayments_read': {
		input: input_v12_cashpayments_read,
		output: output_v12_cashpayments_read,
	},
	'v12.cashpayments_update': {
		input: input_v12_cashpayments_update,
		output: output_v12_cashpayments_update,
	},
	'v12.cashpayments_delete': {
		input: input_v12_cashpayments_delete,
		output: output_v12_cashpayments_delete,
	},
	'v12.cashpayments_pdf': {
		input: input_v12_cashpayments_pdf,
		output: output_v12_cashpayments_pdf,
	},
	'v12.cashpayments_attachments_list': {
		input: input_v12_cashpayments_attachments_list,
		output: output_v12_cashpayments_attachments_list,
	},
	'v12.cashpayments_attachments_create': {
		input: input_v12_cashpayments_attachments_create,
		output: output_v12_cashpayments_attachments_create,
	},
	'v12.cashpayments_attachments_read': {
		input: input_v12_cashpayments_attachments_read,
		output: output_v12_cashpayments_attachments_read,
	},
	'v12.cashpayments_attachments_partial_update': {
		input: input_v12_cashpayments_attachments_partial_update,
		output: output_v12_cashpayments_attachments_partial_update,
	},
	'v12.cashpayments_attachments_delete': {
		input: input_v12_cashpayments_attachments_delete,
		output: output_v12_cashpayments_attachments_delete,
	},
	'v12.cashpayments_attachments_file': {
		input: input_v12_cashpayments_attachments_file,
		output: output_v12_cashpayments_attachments_file,
	},
	'v12.cashpayments_notes_list': {
		input: input_v12_cashpayments_notes_list,
		output: output_v12_cashpayments_notes_list,
	},
	'v12.cashpayments_notes_create': {
		input: input_v12_cashpayments_notes_create,
		output: output_v12_cashpayments_notes_create,
	},
	'v12.cashpayments_notes_update': {
		input: input_v12_cashpayments_notes_update,
		output: output_v12_cashpayments_notes_update,
	},
	'v12.cashpayments_notes_delete': {
		input: input_v12_cashpayments_notes_delete,
		output: output_v12_cashpayments_notes_delete,
	},
	'v12.cashreceipts_list': {
		input: input_v12_cashreceipts_list,
		output: output_v12_cashreceipts_list,
	},
	'v12.cashreceipts_create': {
		input: input_v12_cashreceipts_create,
		output: output_v12_cashreceipts_create,
	},
	'v12.cashreceipts_read': {
		input: input_v12_cashreceipts_read,
		output: output_v12_cashreceipts_read,
	},
	'v12.cashreceipts_update': {
		input: input_v12_cashreceipts_update,
		output: output_v12_cashreceipts_update,
	},
	'v12.cashreceipts_delete': {
		input: input_v12_cashreceipts_delete,
		output: output_v12_cashreceipts_delete,
	},
	'v12.cashreceipts_pdf': {
		input: input_v12_cashreceipts_pdf,
		output: output_v12_cashreceipts_pdf,
	},
	'v12.cashreceipts_attachments_list': {
		input: input_v12_cashreceipts_attachments_list,
		output: output_v12_cashreceipts_attachments_list,
	},
	'v12.cashreceipts_attachments_create': {
		input: input_v12_cashreceipts_attachments_create,
		output: output_v12_cashreceipts_attachments_create,
	},
	'v12.cashreceipts_attachments_read': {
		input: input_v12_cashreceipts_attachments_read,
		output: output_v12_cashreceipts_attachments_read,
	},
	'v12.cashreceipts_attachments_partial_update': {
		input: input_v12_cashreceipts_attachments_partial_update,
		output: output_v12_cashreceipts_attachments_partial_update,
	},
	'v12.cashreceipts_attachments_delete': {
		input: input_v12_cashreceipts_attachments_delete,
		output: output_v12_cashreceipts_attachments_delete,
	},
	'v12.cashreceipts_attachments_file': {
		input: input_v12_cashreceipts_attachments_file,
		output: output_v12_cashreceipts_attachments_file,
	},
	'v12.cashreceipts_notes_list': {
		input: input_v12_cashreceipts_notes_list,
		output: output_v12_cashreceipts_notes_list,
	},
	'v12.cashreceipts_notes_create': {
		input: input_v12_cashreceipts_notes_create,
		output: output_v12_cashreceipts_notes_create,
	},
	'v12.cashreceipts_notes_update': {
		input: input_v12_cashreceipts_notes_update,
		output: output_v12_cashreceipts_notes_update,
	},
	'v12.cashreceipts_notes_delete': {
		input: input_v12_cashreceipts_notes_delete,
		output: output_v12_cashreceipts_notes_delete,
	},
	'v12.contacts_list': {
		input: input_v12_contacts_list,
		output: output_v12_contacts_list,
	},
	'v12.contacts_create': {
		input: input_v12_contacts_create,
		output: output_v12_contacts_create,
	},
	'v12.contacts_read': {
		input: input_v12_contacts_read,
		output: output_v12_contacts_read,
	},
	'v12.contacts_update': {
		input: input_v12_contacts_update,
		output: output_v12_contacts_update,
	},
	'v12.contacts_delete': {
		input: input_v12_contacts_delete,
		output: output_v12_contacts_delete,
	},
	'v12.contacts_attachments_list': {
		input: input_v12_contacts_attachments_list,
		output: output_v12_contacts_attachments_list,
	},
	'v12.contacts_attachments_create': {
		input: input_v12_contacts_attachments_create,
		output: output_v12_contacts_attachments_create,
	},
	'v12.contacts_attachments_read': {
		input: input_v12_contacts_attachments_read,
		output: output_v12_contacts_attachments_read,
	},
	'v12.contacts_attachments_partial_update': {
		input: input_v12_contacts_attachments_partial_update,
		output: output_v12_contacts_attachments_partial_update,
	},
	'v12.contacts_attachments_delete': {
		input: input_v12_contacts_attachments_delete,
		output: output_v12_contacts_attachments_delete,
	},
	'v12.contacts_attachments_file': {
		input: input_v12_contacts_attachments_file,
		output: output_v12_contacts_attachments_file,
	},
	'v12.contacts_notes_list': {
		input: input_v12_contacts_notes_list,
		output: output_v12_contacts_notes_list,
	},
	'v12.contacts_notes_create': {
		input: input_v12_contacts_notes_create,
		output: output_v12_contacts_notes_create,
	},
	'v12.contacts_notes_update': {
		input: input_v12_contacts_notes_update,
		output: output_v12_contacts_notes_update,
	},
	'v12.contacts_notes_delete': {
		input: input_v12_contacts_notes_delete,
		output: output_v12_contacts_notes_delete,
	},
	'v12.creditnotes_list': {
		input: input_v12_creditnotes_list,
		output: output_v12_creditnotes_list,
	},
	'v12.creditnotes_create': {
		input: input_v12_creditnotes_create,
		output: output_v12_creditnotes_create,
	},
	'v12.creditnotes_read': {
		input: input_v12_creditnotes_read,
		output: output_v12_creditnotes_read,
	},
	'v12.creditnotes_update': {
		input: input_v12_creditnotes_update,
		output: output_v12_creditnotes_update,
	},
	'v12.creditnotes_partial_update': {
		input: input_v12_creditnotes_partial_update,
		output: output_v12_creditnotes_partial_update,
	},
	'v12.creditnotes_delete': {
		input: input_v12_creditnotes_delete,
		output: output_v12_creditnotes_delete,
	},
	'v12.creditnotes_email_from_template': {
		input: input_v12_creditnotes_email_from_template,
		output: output_v12_creditnotes_email_from_template,
	},
	'v12.creditnotes_email_read': {
		input: input_v12_creditnotes_email_read,
		output: output_v12_creditnotes_email_read,
	},
	'v12.creditnotes_email_create': {
		input: input_v12_creditnotes_email_create,
		output: output_v12_creditnotes_email_create,
	},
	'v12.creditnotes_pdf': {
		input: input_v12_creditnotes_pdf,
		output: output_v12_creditnotes_pdf,
	},
	'v12.creditnotes_mark_void': {
		input: input_v12_creditnotes_mark_void,
		output: output_v12_creditnotes_mark_void,
	},
	'v12.creditnotes_applied-credit_list': {
		input: input_v12_creditnotes_applied_credit_list,
		output: output_v12_creditnotes_applied_credit_list,
	},
	'v12.creditnotes_applied-credit_create': {
		input: input_v12_creditnotes_applied_credit_create,
		output: output_v12_creditnotes_applied_credit_create,
	},
	'v12.creditnotes_applied-credit_delete': {
		input: input_v12_creditnotes_applied_credit_delete,
		output: output_v12_creditnotes_applied_credit_delete,
	},
	'v12.creditnotes_attachments_list': {
		input: input_v12_creditnotes_attachments_list,
		output: output_v12_creditnotes_attachments_list,
	},
	'v12.creditnotes_attachments_create': {
		input: input_v12_creditnotes_attachments_create,
		output: output_v12_creditnotes_attachments_create,
	},
	'v12.creditnotes_attachments_read': {
		input: input_v12_creditnotes_attachments_read,
		output: output_v12_creditnotes_attachments_read,
	},
	'v12.creditnotes_attachments_partial_update': {
		input: input_v12_creditnotes_attachments_partial_update,
		output: output_v12_creditnotes_attachments_partial_update,
	},
	'v12.creditnotes_attachments_delete': {
		input: input_v12_creditnotes_attachments_delete,
		output: output_v12_creditnotes_attachments_delete,
	},
	'v12.creditnotes_attachments_file': {
		input: input_v12_creditnotes_attachments_file,
		output: output_v12_creditnotes_attachments_file,
	},
	'v12.creditnotes_discussions_list': {
		input: input_v12_creditnotes_discussions_list,
		output: output_v12_creditnotes_discussions_list,
	},
	'v12.creditnotes_discussions_create': {
		input: input_v12_creditnotes_discussions_create,
		output: output_v12_creditnotes_discussions_create,
	},
	'v12.creditnotes_discussions_update': {
		input: input_v12_creditnotes_discussions_update,
		output: output_v12_creditnotes_discussions_update,
	},
	'v12.creditnotes_discussions_delete': {
		input: input_v12_creditnotes_discussions_delete,
		output: output_v12_creditnotes_discussions_delete,
	},
	'v12.creditnotes_notes_list': {
		input: input_v12_creditnotes_notes_list,
		output: output_v12_creditnotes_notes_list,
	},
	'v12.creditnotes_notes_create': {
		input: input_v12_creditnotes_notes_create,
		output: output_v12_creditnotes_notes_create,
	},
	'v12.creditnotes_notes_update': {
		input: input_v12_creditnotes_notes_update,
		output: output_v12_creditnotes_notes_update,
	},
	'v12.creditnotes_notes_delete': {
		input: input_v12_creditnotes_notes_delete,
		output: output_v12_creditnotes_notes_delete,
	},
	'v12.creditnotes_sent-email-messages_list': {
		input: input_v12_creditnotes_sent_email_messages_list,
		output: output_v12_creditnotes_sent_email_messages_list,
	},
	'v12.deliverynotes_list': {
		input: input_v12_deliverynotes_list,
		output: output_v12_deliverynotes_list,
	},
	'v12.deliverynotes_create': {
		input: input_v12_deliverynotes_create,
		output: output_v12_deliverynotes_create,
	},
	'v12.deliverynotes_read': {
		input: input_v12_deliverynotes_read,
		output: output_v12_deliverynotes_read,
	},
	'v12.deliverynotes_update': {
		input: input_v12_deliverynotes_update,
		output: output_v12_deliverynotes_update,
	},
	'v12.deliverynotes_partial_update': {
		input: input_v12_deliverynotes_partial_update,
		output: output_v12_deliverynotes_partial_update,
	},
	'v12.deliverynotes_delete': {
		input: input_v12_deliverynotes_delete,
		output: output_v12_deliverynotes_delete,
	},
	'v12.deliverynotes_email_from_template': {
		input: input_v12_deliverynotes_email_from_template,
		output: output_v12_deliverynotes_email_from_template,
	},
	'v12.deliverynotes_email_read': {
		input: input_v12_deliverynotes_email_read,
		output: output_v12_deliverynotes_email_read,
	},
	'v12.deliverynotes_email_create': {
		input: input_v12_deliverynotes_email_create,
		output: output_v12_deliverynotes_email_create,
	},
	'v12.deliverynotes_pdf': {
		input: input_v12_deliverynotes_pdf,
		output: output_v12_deliverynotes_pdf,
	},
	'v12.deliverynotes_mark_void': {
		input: input_v12_deliverynotes_mark_void,
		output: output_v12_deliverynotes_mark_void,
	},
	'v12.deliverynotes_attachments_list': {
		input: input_v12_deliverynotes_attachments_list,
		output: output_v12_deliverynotes_attachments_list,
	},
	'v12.deliverynotes_attachments_create': {
		input: input_v12_deliverynotes_attachments_create,
		output: output_v12_deliverynotes_attachments_create,
	},
	'v12.deliverynotes_attachments_read': {
		input: input_v12_deliverynotes_attachments_read,
		output: output_v12_deliverynotes_attachments_read,
	},
	'v12.deliverynotes_attachments_partial_update': {
		input: input_v12_deliverynotes_attachments_partial_update,
		output: output_v12_deliverynotes_attachments_partial_update,
	},
	'v12.deliverynotes_attachments_delete': {
		input: input_v12_deliverynotes_attachments_delete,
		output: output_v12_deliverynotes_attachments_delete,
	},
	'v12.deliverynotes_attachments_file': {
		input: input_v12_deliverynotes_attachments_file,
		output: output_v12_deliverynotes_attachments_file,
	},
	'v12.deliverynotes_notes_list': {
		input: input_v12_deliverynotes_notes_list,
		output: output_v12_deliverynotes_notes_list,
	},
	'v12.deliverynotes_notes_create': {
		input: input_v12_deliverynotes_notes_create,
		output: output_v12_deliverynotes_notes_create,
	},
	'v12.deliverynotes_notes_update': {
		input: input_v12_deliverynotes_notes_update,
		output: output_v12_deliverynotes_notes_update,
	},
	'v12.deliverynotes_notes_delete': {
		input: input_v12_deliverynotes_notes_delete,
		output: output_v12_deliverynotes_notes_delete,
	},
	'v12.deliverynotes_sent-email-messages_list': {
		input: input_v12_deliverynotes_sent_email_messages_list,
		output: output_v12_deliverynotes_sent_email_messages_list,
	},
	'v12.documenttypes_list': {
		input: input_v12_documenttypes_list,
		output: output_v12_documenttypes_list,
	},
	'v12.documenttypes_read': {
		input: input_v12_documenttypes_read,
		output: output_v12_documenttypes_read,
	},
	'v12.documenttypes_sequences_list': {
		input: input_v12_documenttypes_sequences_list,
		output: output_v12_documenttypes_sequences_list,
	},
	'v12.documenttypes_sequences_create': {
		input: input_v12_documenttypes_sequences_create,
		output: output_v12_documenttypes_sequences_create,
	},
	'v12.documenttypes_sequences_delete_sequence': {
		input: input_v12_documenttypes_sequences_delete_sequence,
		output: output_v12_documenttypes_sequences_delete_sequence,
	},
	'v12.documenttypes_sequences_rename_sequence': {
		input: input_v12_documenttypes_sequences_rename_sequence,
		output: output_v12_documenttypes_sequences_rename_sequence,
	},
	'v12.emailtemplates_list': {
		input: input_v12_emailtemplates_list,
		output: output_v12_emailtemplates_list,
	},
	'v12.emailtemplates_create': {
		input: input_v12_emailtemplates_create,
		output: output_v12_emailtemplates_create,
	},
	'v12.emailtemplates_read': {
		input: input_v12_emailtemplates_read,
		output: output_v12_emailtemplates_read,
	},
	'v12.emailtemplates_update': {
		input: input_v12_emailtemplates_update,
		output: output_v12_emailtemplates_update,
	},
	'v12.emailtemplates_delete': {
		input: input_v12_emailtemplates_delete,
		output: output_v12_emailtemplates_delete,
	},
	'v12.estimates_list': {
		input: input_v12_estimates_list,
		output: output_v12_estimates_list,
	},
	'v12.estimates_create': {
		input: input_v12_estimates_create,
		output: output_v12_estimates_create,
	},
	'v12.estimates_read': {
		input: input_v12_estimates_read,
		output: output_v12_estimates_read,
	},
	'v12.estimates_update': {
		input: input_v12_estimates_update,
		output: output_v12_estimates_update,
	},
	'v12.estimates_partial_update': {
		input: input_v12_estimates_partial_update,
		output: output_v12_estimates_partial_update,
	},
	'v12.estimates_delete': {
		input: input_v12_estimates_delete,
		output: output_v12_estimates_delete,
	},
	'v12.estimates_email_from_template': {
		input: input_v12_estimates_email_from_template,
		output: output_v12_estimates_email_from_template,
	},
	'v12.estimates_email_read': {
		input: input_v12_estimates_email_read,
		output: output_v12_estimates_email_read,
	},
	'v12.estimates_email_create': {
		input: input_v12_estimates_email_create,
		output: output_v12_estimates_email_create,
	},
	'v12.estimates_pdf': {
		input: input_v12_estimates_pdf,
		output: output_v12_estimates_pdf,
	},
	'v12.estimates_attachments_list': {
		input: input_v12_estimates_attachments_list,
		output: output_v12_estimates_attachments_list,
	},
	'v12.estimates_attachments_create': {
		input: input_v12_estimates_attachments_create,
		output: output_v12_estimates_attachments_create,
	},
	'v12.estimates_attachments_read': {
		input: input_v12_estimates_attachments_read,
		output: output_v12_estimates_attachments_read,
	},
	'v12.estimates_attachments_partial_update': {
		input: input_v12_estimates_attachments_partial_update,
		output: output_v12_estimates_attachments_partial_update,
	},
	'v12.estimates_attachments_delete': {
		input: input_v12_estimates_attachments_delete,
		output: output_v12_estimates_attachments_delete,
	},
	'v12.estimates_attachments_file': {
		input: input_v12_estimates_attachments_file,
		output: output_v12_estimates_attachments_file,
	},
	'v12.estimates_discussions_list': {
		input: input_v12_estimates_discussions_list,
		output: output_v12_estimates_discussions_list,
	},
	'v12.estimates_discussions_create': {
		input: input_v12_estimates_discussions_create,
		output: output_v12_estimates_discussions_create,
	},
	'v12.estimates_discussions_update': {
		input: input_v12_estimates_discussions_update,
		output: output_v12_estimates_discussions_update,
	},
	'v12.estimates_discussions_delete': {
		input: input_v12_estimates_discussions_delete,
		output: output_v12_estimates_discussions_delete,
	},
	'v12.estimates_notes_list': {
		input: input_v12_estimates_notes_list,
		output: output_v12_estimates_notes_list,
	},
	'v12.estimates_notes_create': {
		input: input_v12_estimates_notes_create,
		output: output_v12_estimates_notes_create,
	},
	'v12.estimates_notes_update': {
		input: input_v12_estimates_notes_update,
		output: output_v12_estimates_notes_update,
	},
	'v12.estimates_notes_delete': {
		input: input_v12_estimates_notes_delete,
		output: output_v12_estimates_notes_delete,
	},
	'v12.estimates_sent-email-messages_list': {
		input: input_v12_estimates_sent_email_messages_list,
		output: output_v12_estimates_sent_email_messages_list,
	},
	'v12.expensecategories_list': {
		input: input_v12_expensecategories_list,
		output: output_v12_expensecategories_list,
	},
	'v12.expensecategories_read': {
		input: input_v12_expensecategories_read,
		output: output_v12_expensecategories_read,
	},
	'v12.expenses_list': {
		input: input_v12_expenses_list,
		output: output_v12_expenses_list,
	},
	'v12.expenses_create': {
		input: input_v12_expenses_create,
		output: output_v12_expenses_create,
	},
	'v12.expenses_read': {
		input: input_v12_expenses_read,
		output: output_v12_expenses_read,
	},
	'v12.expenses_update': {
		input: input_v12_expenses_update,
		output: output_v12_expenses_update,
	},
	'v12.expenses_delete': {
		input: input_v12_expenses_delete,
		output: output_v12_expenses_delete,
	},
	'v12.expenses_attachments_list': {
		input: input_v12_expenses_attachments_list,
		output: output_v12_expenses_attachments_list,
	},
	'v12.expenses_attachments_create': {
		input: input_v12_expenses_attachments_create,
		output: output_v12_expenses_attachments_create,
	},
	'v12.expenses_attachments_read': {
		input: input_v12_expenses_attachments_read,
		output: output_v12_expenses_attachments_read,
	},
	'v12.expenses_attachments_partial_update': {
		input: input_v12_expenses_attachments_partial_update,
		output: output_v12_expenses_attachments_partial_update,
	},
	'v12.expenses_attachments_delete': {
		input: input_v12_expenses_attachments_delete,
		output: output_v12_expenses_attachments_delete,
	},
	'v12.expenses_attachments_file': {
		input: input_v12_expenses_attachments_file,
		output: output_v12_expenses_attachments_file,
	},
	'v12.expenses_notes_list': {
		input: input_v12_expenses_notes_list,
		output: output_v12_expenses_notes_list,
	},
	'v12.expenses_notes_create': {
		input: input_v12_expenses_notes_create,
		output: output_v12_expenses_notes_create,
	},
	'v12.expenses_notes_update': {
		input: input_v12_expenses_notes_update,
		output: output_v12_expenses_notes_update,
	},
	'v12.expenses_notes_delete': {
		input: input_v12_expenses_notes_delete,
		output: output_v12_expenses_notes_delete,
	},
	'v12.goodsreceipts_list': {
		input: input_v12_goodsreceipts_list,
		output: output_v12_goodsreceipts_list,
	},
	'v12.goodsreceipts_create': {
		input: input_v12_goodsreceipts_create,
		output: output_v12_goodsreceipts_create,
	},
	'v12.goodsreceipts_read': {
		input: input_v12_goodsreceipts_read,
		output: output_v12_goodsreceipts_read,
	},
	'v12.goodsreceipts_update': {
		input: input_v12_goodsreceipts_update,
		output: output_v12_goodsreceipts_update,
	},
	'v12.goodsreceipts_partial_update': {
		input: input_v12_goodsreceipts_partial_update,
		output: output_v12_goodsreceipts_partial_update,
	},
	'v12.goodsreceipts_delete': {
		input: input_v12_goodsreceipts_delete,
		output: output_v12_goodsreceipts_delete,
	},
	'v12.goodsreceipts_email_from_template': {
		input: input_v12_goodsreceipts_email_from_template,
		output: output_v12_goodsreceipts_email_from_template,
	},
	'v12.goodsreceipts_email_read': {
		input: input_v12_goodsreceipts_email_read,
		output: output_v12_goodsreceipts_email_read,
	},
	'v12.goodsreceipts_email_create': {
		input: input_v12_goodsreceipts_email_create,
		output: output_v12_goodsreceipts_email_create,
	},
	'v12.goodsreceipts_pdf': {
		input: input_v12_goodsreceipts_pdf,
		output: output_v12_goodsreceipts_pdf,
	},
	'v12.goodsreceipts_mark_void': {
		input: input_v12_goodsreceipts_mark_void,
		output: output_v12_goodsreceipts_mark_void,
	},
	'v12.goodsreceipts_notes_list': {
		input: input_v12_goodsreceipts_notes_list,
		output: output_v12_goodsreceipts_notes_list,
	},
	'v12.goodsreceipts_notes_create': {
		input: input_v12_goodsreceipts_notes_create,
		output: output_v12_goodsreceipts_notes_create,
	},
	'v12.goodsreceipts_notes_update': {
		input: input_v12_goodsreceipts_notes_update,
		output: output_v12_goodsreceipts_notes_update,
	},
	'v12.goodsreceipts_notes_delete': {
		input: input_v12_goodsreceipts_notes_delete,
		output: output_v12_goodsreceipts_notes_delete,
	},
	'v12.goodsreceipts_sent-email-messages_list': {
		input: input_v12_goodsreceipts_sent_email_messages_list,
		output: output_v12_goodsreceipts_sent_email_messages_list,
	},
	'v12.goodsreceiptsequences_list': {
		input: input_v12_goodsreceiptsequences_list,
		output: output_v12_goodsreceiptsequences_list,
	},
	'v12.goodsreceiptsequences_create': {
		input: input_v12_goodsreceiptsequences_create,
		output: output_v12_goodsreceiptsequences_create,
	},
	'v12.goodsreceiptsequences_delete_sequence': {
		input: input_v12_goodsreceiptsequences_delete_sequence,
		output: output_v12_goodsreceiptsequences_delete_sequence,
	},
	'v12.goodsreceiptsequences_rename_sequence': {
		input: input_v12_goodsreceiptsequences_rename_sequence,
		output: output_v12_goodsreceiptsequences_rename_sequence,
	},
	'v12.invoices_list': {
		input: input_v12_invoices_list,
		output: output_v12_invoices_list,
	},
	'v12.invoices_create': {
		input: input_v12_invoices_create,
		output: output_v12_invoices_create,
	},
	'v12.invoices_read': {
		input: input_v12_invoices_read,
		output: output_v12_invoices_read,
	},
	'v12.invoices_update': {
		input: input_v12_invoices_update,
		output: output_v12_invoices_update,
	},
	'v12.invoices_partial_update': {
		input: input_v12_invoices_partial_update,
		output: output_v12_invoices_partial_update,
	},
	'v12.invoices_delete': {
		input: input_v12_invoices_delete,
		output: output_v12_invoices_delete,
	},
	'v12.invoices_email_from_template': {
		input: input_v12_invoices_email_from_template,
		output: output_v12_invoices_email_from_template,
	},
	'v12.invoices_email_read': {
		input: input_v12_invoices_email_read,
		output: output_v12_invoices_email_read,
	},
	'v12.invoices_email_create': {
		input: input_v12_invoices_email_create,
		output: output_v12_invoices_email_create,
	},
	'v12.invoices_pdf': {
		input: input_v12_invoices_pdf,
		output: output_v12_invoices_pdf,
	},
	'v12.invoices_mark_void': {
		input: input_v12_invoices_mark_void,
		output: output_v12_invoices_mark_void,
	},
	'v12.invoices_applied-credit_list': {
		input: input_v12_invoices_applied_credit_list,
		output: output_v12_invoices_applied_credit_list,
	},
	'v12.invoices_applied-credit_create': {
		input: input_v12_invoices_applied_credit_create,
		output: output_v12_invoices_applied_credit_create,
	},
	'v12.invoices_applied-credit_delete': {
		input: input_v12_invoices_applied_credit_delete,
		output: output_v12_invoices_applied_credit_delete,
	},
	'v12.invoices_attachments_list': {
		input: input_v12_invoices_attachments_list,
		output: output_v12_invoices_attachments_list,
	},
	'v12.invoices_attachments_create': {
		input: input_v12_invoices_attachments_create,
		output: output_v12_invoices_attachments_create,
	},
	'v12.invoices_attachments_read': {
		input: input_v12_invoices_attachments_read,
		output: output_v12_invoices_attachments_read,
	},
	'v12.invoices_attachments_partial_update': {
		input: input_v12_invoices_attachments_partial_update,
		output: output_v12_invoices_attachments_partial_update,
	},
	'v12.invoices_attachments_delete': {
		input: input_v12_invoices_attachments_delete,
		output: output_v12_invoices_attachments_delete,
	},
	'v12.invoices_attachments_file': {
		input: input_v12_invoices_attachments_file,
		output: output_v12_invoices_attachments_file,
	},
	'v12.invoices_discussions_list': {
		input: input_v12_invoices_discussions_list,
		output: output_v12_invoices_discussions_list,
	},
	'v12.invoices_discussions_create': {
		input: input_v12_invoices_discussions_create,
		output: output_v12_invoices_discussions_create,
	},
	'v12.invoices_discussions_update': {
		input: input_v12_invoices_discussions_update,
		output: output_v12_invoices_discussions_update,
	},
	'v12.invoices_discussions_delete': {
		input: input_v12_invoices_discussions_delete,
		output: output_v12_invoices_discussions_delete,
	},
	'v12.invoices_notes_list': {
		input: input_v12_invoices_notes_list,
		output: output_v12_invoices_notes_list,
	},
	'v12.invoices_notes_create': {
		input: input_v12_invoices_notes_create,
		output: output_v12_invoices_notes_create,
	},
	'v12.invoices_notes_update': {
		input: input_v12_invoices_notes_update,
		output: output_v12_invoices_notes_update,
	},
	'v12.invoices_notes_delete': {
		input: input_v12_invoices_notes_delete,
		output: output_v12_invoices_notes_delete,
	},
	'v12.invoices_sent-email-messages_list': {
		input: input_v12_invoices_sent_email_messages_list,
		output: output_v12_invoices_sent_email_messages_list,
	},
	'v12.organizationbranch_list': {
		input: input_v12_organizationbranch_list,
		output: output_v12_organizationbranch_list,
	},
	'v12.organizationbranch_create': {
		input: input_v12_organizationbranch_create,
		output: output_v12_organizationbranch_create,
	},
	'v12.organizationbranch_read': {
		input: input_v12_organizationbranch_read,
		output: output_v12_organizationbranch_read,
	},
	'v12.organizationbranch_update': {
		input: input_v12_organizationbranch_update,
		output: output_v12_organizationbranch_update,
	},
	'v12.organizationbranch_partial_update': {
		input: input_v12_organizationbranch_partial_update,
		output: output_v12_organizationbranch_partial_update,
	},
	'v12.organizationbranch_delete': {
		input: input_v12_organizationbranch_delete,
		output: output_v12_organizationbranch_delete,
	},
	'v12.paymentgateways_list': {
		input: input_v12_paymentgateways_list,
		output: output_v12_paymentgateways_list,
	},
	'v12.products_list': {
		input: input_v12_products_list,
		output: output_v12_products_list,
	},
	'v12.products_create': {
		input: input_v12_products_create,
		output: output_v12_products_create,
	},
	'v12.products_read': {
		input: input_v12_products_read,
		output: output_v12_products_read,
	},
	'v12.products_update': {
		input: input_v12_products_update,
		output: output_v12_products_update,
	},
	'v12.products_delete': {
		input: input_v12_products_delete,
		output: output_v12_products_delete,
	},
	'v12.products_notes_list': {
		input: input_v12_products_notes_list,
		output: output_v12_products_notes_list,
	},
	'v12.products_notes_create': {
		input: input_v12_products_notes_create,
		output: output_v12_products_notes_create,
	},
	'v12.products_notes_update': {
		input: input_v12_products_notes_update,
		output: output_v12_products_notes_update,
	},
	'v12.products_notes_delete': {
		input: input_v12_products_notes_delete,
		output: output_v12_products_notes_delete,
	},
	'v12.products_stockadjustments_list': {
		input: input_v12_products_stockadjustments_list,
		output: output_v12_products_stockadjustments_list,
	},
	'v12.products_stockadjustments_create': {
		input: input_v12_products_stockadjustments_create,
		output: output_v12_products_stockadjustments_create,
	},
	'v12.products_stockadjustments_read': {
		input: input_v12_products_stockadjustments_read,
		output: output_v12_products_stockadjustments_read,
	},
	'v12.products_stockadjustments_delete': {
		input: input_v12_products_stockadjustments_delete,
		output: output_v12_products_stockadjustments_delete,
	},
	'v12.projects_list': {
		input: input_v12_projects_list,
		output: output_v12_projects_list,
	},
	'v12.projects_create': {
		input: input_v12_projects_create,
		output: output_v12_projects_create,
	},
	'v12.projects_read': {
		input: input_v12_projects_read,
		output: output_v12_projects_read,
	},
	'v12.projects_update': {
		input: input_v12_projects_update,
		output: output_v12_projects_update,
	},
	'v12.projects_delete': {
		input: input_v12_projects_delete,
		output: output_v12_projects_delete,
	},
	'v12.projects_attachments_list': {
		input: input_v12_projects_attachments_list,
		output: output_v12_projects_attachments_list,
	},
	'v12.projects_attachments_create': {
		input: input_v12_projects_attachments_create,
		output: output_v12_projects_attachments_create,
	},
	'v12.projects_attachments_read': {
		input: input_v12_projects_attachments_read,
		output: output_v12_projects_attachments_read,
	},
	'v12.projects_attachments_partial_update': {
		input: input_v12_projects_attachments_partial_update,
		output: output_v12_projects_attachments_partial_update,
	},
	'v12.projects_attachments_delete': {
		input: input_v12_projects_attachments_delete,
		output: output_v12_projects_attachments_delete,
	},
	'v12.projects_attachments_file': {
		input: input_v12_projects_attachments_file,
		output: output_v12_projects_attachments_file,
	},
	'v12.projects_discussions_list': {
		input: input_v12_projects_discussions_list,
		output: output_v12_projects_discussions_list,
	},
	'v12.projects_discussions_create': {
		input: input_v12_projects_discussions_create,
		output: output_v12_projects_discussions_create,
	},
	'v12.projects_discussions_update': {
		input: input_v12_projects_discussions_update,
		output: output_v12_projects_discussions_update,
	},
	'v12.projects_discussions_delete': {
		input: input_v12_projects_discussions_delete,
		output: output_v12_projects_discussions_delete,
	},
	'v12.projects_notes_list': {
		input: input_v12_projects_notes_list,
		output: output_v12_projects_notes_list,
	},
	'v12.projects_notes_create': {
		input: input_v12_projects_notes_create,
		output: output_v12_projects_notes_create,
	},
	'v12.projects_notes_update': {
		input: input_v12_projects_notes_update,
		output: output_v12_projects_notes_update,
	},
	'v12.projects_notes_delete': {
		input: input_v12_projects_notes_delete,
		output: output_v12_projects_notes_delete,
	},
	'v12.projects_projectextrafees_list': {
		input: input_v12_projects_projectextrafees_list,
		output: output_v12_projects_projectextrafees_list,
	},
	'v12.projects_projectextrafees_create': {
		input: input_v12_projects_projectextrafees_create,
		output: output_v12_projects_projectextrafees_create,
	},
	'v12.projects_projectextrafees_read': {
		input: input_v12_projects_projectextrafees_read,
		output: output_v12_projects_projectextrafees_read,
	},
	'v12.projects_projectextrafees_update': {
		input: input_v12_projects_projectextrafees_update,
		output: output_v12_projects_projectextrafees_update,
	},
	'v12.projects_projectextrafees_partial_update': {
		input: input_v12_projects_projectextrafees_partial_update,
		output: output_v12_projects_projectextrafees_partial_update,
	},
	'v12.projects_projectextrafees_delete': {
		input: input_v12_projects_projectextrafees_delete,
		output: output_v12_projects_projectextrafees_delete,
	},
	'v12.recurringinvoices_list': {
		input: input_v12_recurringinvoices_list,
		output: output_v12_recurringinvoices_list,
	},
	'v12.recurringinvoices_create': {
		input: input_v12_recurringinvoices_create,
		output: output_v12_recurringinvoices_create,
	},
	'v12.recurringinvoices_read': {
		input: input_v12_recurringinvoices_read,
		output: output_v12_recurringinvoices_read,
	},
	'v12.recurringinvoices_update': {
		input: input_v12_recurringinvoices_update,
		output: output_v12_recurringinvoices_update,
	},
	'v12.recurringinvoices_delete': {
		input: input_v12_recurringinvoices_delete,
		output: output_v12_recurringinvoices_delete,
	},
	'v12.recurringinvoices_notes_list': {
		input: input_v12_recurringinvoices_notes_list,
		output: output_v12_recurringinvoices_notes_list,
	},
	'v12.recurringinvoices_notes_create': {
		input: input_v12_recurringinvoices_notes_create,
		output: output_v12_recurringinvoices_notes_create,
	},
	'v12.recurringinvoices_notes_update': {
		input: input_v12_recurringinvoices_notes_update,
		output: output_v12_recurringinvoices_notes_update,
	},
	'v12.recurringinvoices_notes_delete': {
		input: input_v12_recurringinvoices_notes_delete,
		output: output_v12_recurringinvoices_notes_delete,
	},
	'v12.suppliercredits_list': {
		input: input_v12_suppliercredits_list,
		output: output_v12_suppliercredits_list,
	},
	'v12.suppliercredits_create': {
		input: input_v12_suppliercredits_create,
		output: output_v12_suppliercredits_create,
	},
	'v12.suppliercredits_read': {
		input: input_v12_suppliercredits_read,
		output: output_v12_suppliercredits_read,
	},
	'v12.suppliercredits_update': {
		input: input_v12_suppliercredits_update,
		output: output_v12_suppliercredits_update,
	},
	'v12.suppliercredits_partial_update': {
		input: input_v12_suppliercredits_partial_update,
		output: output_v12_suppliercredits_partial_update,
	},
	'v12.suppliercredits_delete': {
		input: input_v12_suppliercredits_delete,
		output: output_v12_suppliercredits_delete,
	},
	'v12.suppliercredits_email_from_template': {
		input: input_v12_suppliercredits_email_from_template,
		output: output_v12_suppliercredits_email_from_template,
	},
	'v12.suppliercredits_email_read': {
		input: input_v12_suppliercredits_email_read,
		output: output_v12_suppliercredits_email_read,
	},
	'v12.suppliercredits_email_create': {
		input: input_v12_suppliercredits_email_create,
		output: output_v12_suppliercredits_email_create,
	},
	'v12.suppliercredits_pdf': {
		input: input_v12_suppliercredits_pdf,
		output: output_v12_suppliercredits_pdf,
	},
	'v12.suppliercredits_mark_void': {
		input: input_v12_suppliercredits_mark_void,
		output: output_v12_suppliercredits_mark_void,
	},
	'v12.suppliercredits_applied-credit_list': {
		input: input_v12_suppliercredits_applied_credit_list,
		output: output_v12_suppliercredits_applied_credit_list,
	},
	'v12.suppliercredits_applied-credit_create': {
		input: input_v12_suppliercredits_applied_credit_create,
		output: output_v12_suppliercredits_applied_credit_create,
	},
	'v12.suppliercredits_applied-credit_delete': {
		input: input_v12_suppliercredits_applied_credit_delete,
		output: output_v12_suppliercredits_applied_credit_delete,
	},
	'v12.suppliercredits_attachments_list': {
		input: input_v12_suppliercredits_attachments_list,
		output: output_v12_suppliercredits_attachments_list,
	},
	'v12.suppliercredits_attachments_create': {
		input: input_v12_suppliercredits_attachments_create,
		output: output_v12_suppliercredits_attachments_create,
	},
	'v12.suppliercredits_attachments_read': {
		input: input_v12_suppliercredits_attachments_read,
		output: output_v12_suppliercredits_attachments_read,
	},
	'v12.suppliercredits_attachments_partial_update': {
		input: input_v12_suppliercredits_attachments_partial_update,
		output: output_v12_suppliercredits_attachments_partial_update,
	},
	'v12.suppliercredits_attachments_delete': {
		input: input_v12_suppliercredits_attachments_delete,
		output: output_v12_suppliercredits_attachments_delete,
	},
	'v12.suppliercredits_attachments_file': {
		input: input_v12_suppliercredits_attachments_file,
		output: output_v12_suppliercredits_attachments_file,
	},
	'v12.suppliercredits_notes_list': {
		input: input_v12_suppliercredits_notes_list,
		output: output_v12_suppliercredits_notes_list,
	},
	'v12.suppliercredits_notes_create': {
		input: input_v12_suppliercredits_notes_create,
		output: output_v12_suppliercredits_notes_create,
	},
	'v12.suppliercredits_notes_update': {
		input: input_v12_suppliercredits_notes_update,
		output: output_v12_suppliercredits_notes_update,
	},
	'v12.suppliercredits_notes_delete': {
		input: input_v12_suppliercredits_notes_delete,
		output: output_v12_suppliercredits_notes_delete,
	},
	'v12.suppliercredits_sent-email-messages_list': {
		input: input_v12_suppliercredits_sent_email_messages_list,
		output: output_v12_suppliercredits_sent_email_messages_list,
	},
	'v12.tasks_list': {
		input: input_v12_tasks_list,
		output: output_v12_tasks_list,
	},
	'v12.tasks_create': {
		input: input_v12_tasks_create,
		output: output_v12_tasks_create,
	},
	'v12.tasks_read': {
		input: input_v12_tasks_read,
		output: output_v12_tasks_read,
	},
	'v12.tasks_update': {
		input: input_v12_tasks_update,
		output: output_v12_tasks_update,
	},
	'v12.tasks_delete': {
		input: input_v12_tasks_delete,
		output: output_v12_tasks_delete,
	},
	'v12.taxes_list': {
		input: input_v12_taxes_list,
		output: output_v12_taxes_list,
	},
	'v12.taxes_read': {
		input: input_v12_taxes_read,
		output: output_v12_taxes_read,
	},
	'v12.templates_list': {
		input: input_v12_templates_list,
		output: output_v12_templates_list,
	},
	'v12.templates_read': {
		input: input_v12_templates_read,
		output: output_v12_templates_read,
	},
	'v12.timeentries_list': {
		input: input_v12_timeentries_list,
		output: output_v12_timeentries_list,
	},
	'v12.timeentries_create': {
		input: input_v12_timeentries_create,
		output: output_v12_timeentries_create,
	},
	'v12.timeentries_read': {
		input: input_v12_timeentries_read,
		output: output_v12_timeentries_read,
	},
	'v12.timeentries_update': {
		input: input_v12_timeentries_update,
		output: output_v12_timeentries_update,
	},
	'v12.timeentries_delete': {
		input: input_v12_timeentries_delete,
		output: output_v12_timeentries_delete,
	},
	'v12.timeentries_mark_billed': {
		input: input_v12_timeentries_mark_billed,
		output: output_v12_timeentries_mark_billed,
	},
	'v12.timeentries_mark_unbilled': {
		input: input_v12_timeentries_mark_unbilled,
		output: output_v12_timeentries_mark_unbilled,
	},
	'v12.trackingcategories_list': {
		input: input_v12_trackingcategories_list,
		output: output_v12_trackingcategories_list,
	},
	'v12.trackingcategories_read': {
		input: input_v12_trackingcategories_read,
		output: output_v12_trackingcategories_read,
	},
	'v12.unitofmeasurement_list': {
		input: input_v12_unitofmeasurement_list,
		output: output_v12_unitofmeasurement_list,
	},
	'v12.unitofmeasurement_create': {
		input: input_v12_unitofmeasurement_create,
		output: output_v12_unitofmeasurement_create,
	},
	'v12.unitofmeasurement_read': {
		input: input_v12_unitofmeasurement_read,
		output: output_v12_unitofmeasurement_read,
	},
	'v12.unitofmeasurement_update': {
		input: input_v12_unitofmeasurement_update,
		output: output_v12_unitofmeasurement_update,
	},
	'v12.unitofmeasurement_partial_update': {
		input: input_v12_unitofmeasurement_partial_update,
		output: output_v12_unitofmeasurement_partial_update,
	},
	'v12.unitofmeasurement_delete': {
		input: input_v12_unitofmeasurement_delete,
		output: output_v12_unitofmeasurement_delete,
	},
	'v12.users_list': {
		input: input_v12_users_list,
		output: output_v12_users_list,
	},
	'v12.userteams_list': {
		input: input_v12_userteams_list,
		output: output_v12_userteams_list,
	},
	'v12.warehouse_list': {
		input: input_v12_warehouse_list,
		output: output_v12_warehouse_list,
	},
	'v12.warehouse_create': {
		input: input_v12_warehouse_create,
		output: output_v12_warehouse_create,
	},
	'v12.warehouse_read': {
		input: input_v12_warehouse_read,
		output: output_v12_warehouse_read,
	},
	'v12.warehouse_update': {
		input: input_v12_warehouse_update,
		output: output_v12_warehouse_update,
	},
	'v12.warehouse_partial_update': {
		input: input_v12_warehouse_partial_update,
		output: output_v12_warehouse_partial_update,
	},
	'v12.warehouse_delete': {
		input: input_v12_warehouse_delete,
		output: output_v12_warehouse_delete,
	},
} as const;

export type ElorusOperationKey = keyof typeof elorusOperationSchemas;

export const ElorusEndpointInputSchemas: Record<string, z.ZodType> =
	Object.fromEntries(
		Object.entries(elorusOperationSchemas).map(([key, schemas]) => [
			key,
			schemas.input,
		]),
	);

export const ElorusEndpointOutputSchemas: Record<string, z.ZodType> =
	Object.fromEntries(
		Object.entries(elorusOperationSchemas).map(([key, schemas]) => [
			key,
			schemas.output,
		]),
	);
