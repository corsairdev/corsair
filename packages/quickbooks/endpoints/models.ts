import { z } from 'zod';

// Static QuickBooks Online model schemas generated from Intuit CodesModelsJsonObjects_v2.json and the v75 XSD.
// Primitive enums use values from the official v75 XSD; API payloads remain runtime-validated.
// unknown because Intuit marks these extension payloads as provider-defined and publishes no field contract.
const providerDefinedObjectSchema = z.record(z.string(), z.unknown());
const namevalueSchema = z
	.object({ Name: z.string().optional(), Value: z.string().optional() })
	.strict();
const reportCellSchema = z
	.object({
		id: z.string().optional(),
		value: z.string().optional(),
		href: z.string().optional(),
	})
	.strict();
export type ReportRow = {
	type?: 'Section' | 'Data';
	group?: string;
	ColData?: z.infer<typeof reportCellSchema>[];
	Summary?: ReportRow;
	Rows?: { Row?: ReportRow[] };
	Header?: ReportRow;
};
const reportRowSchema: z.ZodType<ReportRow> = z.lazy(() =>
	z
		.object({
			type: z.enum(['Section', 'Data']).optional(),
			group: z.string().optional(),
			ColData: z.array(reportCellSchema).optional(),
			Summary: reportRowSchema.optional(),
			Rows: z
				.object({ Row: z.array(reportRowSchema).optional() })
				.strict()
				.optional(),
			Header: reportRowSchema.optional(),
		})
		.strict(),
);
const reportRowsSchema = z
	.object({ Row: z.array(reportRowSchema).optional() })
	.strict();
const reportrowSchema = reportRowSchema;
const reportrowsSchema = reportRowsSchema;

const reportoptionSchema = z
	.object({
		name: z.string().optional(),
		value: z.string().optional(),
	})
	.strict();

const datetimeSchema = z
	.object({
		dateTime: z.string().optional(),
	})
	.strict();

const reportheaderSchema = z
	.object({
		Customer: z.string().optional(),
		ReportName: z.string().optional(),
		Vendor: z.string().optional(),
		Option: reportoptionSchema.optional(),
		Item: z.string().optional(),
		Employee: z.string().optional(),
		ReportBasis: z.enum(['Accrual', 'Cash']).optional(),
		StartPeriod: z.string().optional(),
		Class: z.string().optional(),
		Currency: z.string().optional(),
		EndPeriod: z.string().optional(),
		Time: z.string().optional(),
		Department: z.string().optional(),
		SummarizeColumnsBy: z
			.enum([
				'Total',
				'Year',
				'Quarter',
				'FiscalYear',
				'FiscalQuarter',
				'Month',
				'Week',
				'Days',
				'Customers',
				'Vendors',
				'Employees',
				'Departments',
				'Classes',
				'ProductsAndServices',
			])
			.optional(),
	})
	.strict();

const profitandlossreportrowsSchema = z
	.object({
		Row: z.array(reportRowSchema).optional(),
	})
	.strict();

const reportcolumnSchema = z
	.object({
		ColType: z
			.enum([
				'Account',
				'Money',
				'Rate',
				'Customer',
				'Vendor',
				'Employee',
				'ProductsAndService',
				'Department',
				'Class',
				'String',
			])
			.optional(),
		ColTitle: z.string().optional(),
	})
	.strict();

const reportcolumnsSchema = z
	.object({
		Column: z.array(reportcolumnSchema).optional(),
	})
	.strict();

const balancesheetreporttoplevelSchema = z
	.object({
		Header: reportheaderSchema.optional(),
		Rows: profitandlossreportrowsSchema.optional(),
		Columns: reportcolumnsSchema.optional(),
	})
	.strict();

const referencetypeSchema = z
	.object({
		name: z.string().optional(),
		value: z.string(),
	})
	.strict();

const modificationmetadataSchema = z
	.object({
		CreateTime: z.string().optional(),
		LastUpdatedTime: z.string().optional(),
	})
	.strict();

const classresponseSchema = z
	.object({
		SyncToken: z.string().optional(),
		Name: z.string(),
		FullyQualifiedName: z.string().optional(),
		SubClass: z.boolean().optional(),
		ParentRef: referencetypeSchema.optional(),
		Active: z.boolean().optional(),
		Id: z.string(),
		MetaData: modificationmetadataSchema.optional(),
	})
	.strict();

const cashflowquerySchema = z
	.object({
		customer: z.string().optional(),
		vendor: z.string().optional(),
		end_date: z.string().optional(),
		date_macro: z.string().optional(),
		class: z.string().optional(),
		item: z.string().optional(),
		sort_order: z.string().optional(),
		summarize_column_by: z.string().optional(),
		department: z.string().optional(),
		start_date: z.string().optional(),
	})
	.strict();

const transactionlistwithsplitsquerySchema = z
	.object({
		docnum: z.string().optional(),
		name: z.string().optional(),
		end_date: z.string().optional(),
		date_macro: z.string().optional(),
		payment_method: z.string().optional(),
		source_account_type: z.string().optional(),
		transaction_type: z.string().optional(),
		group_by: z.string().optional(),
		sort_by: z.string().optional(),
		sort_order: z.string().optional(),
		start_date: z.string().optional(),
		columns: z.string().optional(),
	})
	.strict();

const cashbackinfoSchema = z
	.object({
		AccountRef: referencetypeSchema,
		Amount: z.string(),
		Memo: z.string().optional(),
	})
	.strict();

const itemadjustmentlinedetailSchema = z
	.object({
		QtyDiff: z.number(),
		ItemRef: referencetypeSchema.optional(),
	})
	.strict();

const customfieldSchema = z
	.object({
		DefinitionId: z.string(),
		StringValue: z.string().optional(),
		Type: z
			.enum(['StringType', 'BooleanType', 'NumberType', 'DateType'])
			.optional(),
		Name: z.string().optional(),
	})
	.strict();

const attachablerefSchema = z
	.object({
		IncludeOnSend: z.boolean().optional(),
		LineInfo: z.string().optional(),
		NoRefOnly: z.boolean().optional(),
		CustomField: z.array(customfieldSchema).optional(),
		Inactive: z.boolean().optional(),
		EntityRef: referencetypeSchema.optional(),
	})
	.strict();

const attachablerequestSchema = z
	.object({
		Note: z.string().optional(),
		AttachableRef: attachablerefSchema.optional(),
		FileName: z.string().optional(),
	})
	.strict();

const emailmessagetypeSchema = z
	.object({
		Message: z.string().optional(),
		Subject: z.string().optional(),
	})
	.strict();

const emailmessagesprefsSchema = z
	.object({
		InvoiceMessage: emailmessagetypeSchema.optional(),
		EstimateMessage: emailmessagetypeSchema.optional(),
		SalesReceiptMessage: emailmessagetypeSchema.optional(),
		StatementMessage: emailmessagetypeSchema.optional(),
	})
	.strict();

const productandservicesprefsSchema = z
	.object({
		RevenueRecognitionEnabled: z.boolean().optional(),
		RecognitionFrequencyType: z.string().optional(),
		ForSales: z.boolean().optional(),
		QuantityOnHand: z.boolean().optional(),
		QuantityWithPriceAndRate: z.boolean().optional(),
		ForPurchase: z.boolean().optional(),
	})
	.strict();

const reportprefsSchema = z
	.object({
		ReportBasis: z.enum(['Accrual', 'Cash']).optional(),
		CalcAgingReportFromTxnDate: z.boolean().optional(),
	})
	.strict();

const dateSchema = z
	.object({
		date: z.string().optional(),
	})
	.strict();

const accountinginfoprefsSchema = z
	.object({
		FirstMonthOfFiscalYear: z
			.enum([
				'January',
				'February',
				'March',
				'April',
				'May',
				'June',
				'July',
				'August',
				'September',
				'October',
				'November',
				'December',
			])
			.optional(),
		UseAccountNumbers: z.boolean().optional(),
		TaxYearMonth: z.string().optional(),
		ClassTrackingPerTxn: z.boolean().optional(),
		TrackDepartments: z.boolean().optional(),
		TaxForm: z.string().optional(),
		CustomerTerminology: z.string().optional(),
		BookCloseDate: z.string().optional(),
		DepartmentTerminology: z.string().optional(),
		ClassTrackingPerTxnLine: z.boolean().optional(),
	})
	.strict();

const emailaddressSchema = z
	.object({
		Address: z.string().optional(),
	})
	.strict();

const salesformsprefSchema = z
	.object({
		SalesEmailBcc: emailaddressSchema.optional(),
		AllowServiceDate: z.boolean().optional(),
		EstimateMessage: z.string().optional(),
		EmailCopyToCompany: z.boolean().optional(),
		DefaultCustomerMessage: z.string().optional(),
		AllowShipping: z.boolean().optional(),
		SalesEmailCc: emailaddressSchema.optional(),
		DefaultDiscountAccount: z.boolean().optional(),
		IPNSupportEnabled: z.boolean().optional(),
		ETransactionPaymentEnabled: z.boolean().optional(),
		DefaultTerms: referencetypeSchema.optional(),
		UsingProgressInvoicing: z.boolean().optional(),
		AllowDeposit: z.boolean().optional(),
		UsingPriceLevels: z.boolean().optional(),
		DefaultShippingAccount: z.boolean().optional(),
		ETransactionAttachPDF: z.boolean().optional(),
		CustomTxnNumbers: z.boolean().optional(),
		ETransactionEnabledStatus: z.string().optional(),
		AllowEstimates: z.boolean().optional(),
		AllowDiscount: z.boolean().optional(),
		CustomField: customfieldSchema.optional(),
		AutoApplyCredit: z.boolean().optional(),
	})
	.strict();

const vendorandpurchaseprefsSchema = z
	.object({
		DefaultMarkupAccount: referencetypeSchema.optional(),
		TrackingByCustomer: z.boolean().optional(),
		POCustomField: customfieldSchema.optional(),
		DefaultTerms: referencetypeSchema.optional(),
		BillableExpenseTracking: z.boolean().optional(),
		DefaultMarkup: z.number().optional(),
		TPAREnabled: z.boolean().optional(),
	})
	.strict();

const taxprefsSchema = z
	.object({
		PartnerTaxEnabled: z.boolean().optional(),
		TaxGroupCodeRef: z.string().optional(),
		UsingSalesTax: z.boolean().optional(),
	})
	.strict();

const timetrackingprefsSchema = z
	.object({
		WorkWeekStartDate: z
			.enum([
				'Sunday',
				'Monday',
				'Tuesday',
				'Wednesday',
				'Thursday',
				'Friday',
				'Saturday',
			])
			.optional(),
		MarkTimeEntriesBillable: z.boolean().optional(),
		ShowBillRateToAll: z.boolean().optional(),
		UsingSalesTax: z.boolean().optional(),
		BillCustomers: z.boolean().optional(),
	})
	.strict();

const currencyprefsSchema = z
	.object({
		HomeCurrency: z.string().optional(),
		MultiCurrencyEnabled: z.boolean().optional(),
	})
	.strict();

const preferencesresponseSchema = z
	.object({
		EmailMessagesPrefs: emailmessagesprefsSchema.optional(),
		SyncToken: z.string().optional(),
		ProductAndServicesPrefs: productandservicesprefsSchema.optional(),
		ReportPrefs: reportprefsSchema.optional(),
		AccountingInfoPrefs: accountinginfoprefsSchema.optional(),
		SalesFormsPrefs: salesformsprefSchema.optional(),
		VendorAndPurchasesPrefs: vendorandpurchaseprefsSchema.optional(),
		TaxPrefs: taxprefsSchema.optional(),
		OtherPrefs: z
			.object({ NameValue: z.array(namevalueSchema).optional() })
			.strict()
			.optional(),
		TimeTrackingPrefs: timetrackingprefsSchema.optional(),
		CurrencyPrefs: currencyprefsSchema.optional(),
		Id: z.string(),
		MetaData: modificationmetadataSchema.optional(),
	})
	.strict();

const markupinfoSchema = z
	.object({
		PriceLevelRef: referencetypeSchema.optional(),
		Percent: z.number().optional(),
		MarkUpIncomeAccountRef: referencetypeSchema.optional(),
	})
	.strict();

const reimburselinedetailSchema = z
	.object({
		ClassRef: referencetypeSchema.optional(),
		TaxCodeRef: referencetypeSchema.optional(),
		MarkupInfo: markupinfoSchema.optional(),
		ItemAccountRef: referencetypeSchema.optional(),
		ItemRef: referencetypeSchema.optional(),
	})
	.strict();

const discountlinedetailSchema = z
	.object({
		ClassRef: referencetypeSchema.optional(),
		TaxCodeRef: referencetypeSchema.optional(),
		DiscountAccountRef: referencetypeSchema.optional(),
		PercentBased: z.boolean().optional(),
		DiscountPercent: z.number().optional(),
	})
	.strict();

const profitandlossreporttoplevelSchema = z
	.object({
		Header: reportheaderSchema.optional(),
		Rows: profitandlossreportrowsSchema.optional(),
		Columns: reportcolumnsSchema.optional(),
	})
	.strict();

const currencyrefSchema = z
	.object({
		name: z.string().optional(),
		value: z.string(),
	})
	.strict();

const associatedvaluesSchema = z
	.object({
		Value: z.string(),
		Key: z.string(),
	})
	.strict();

const customextensionsSchema = z
	.object({
		AssociatedValues: associatedvaluesSchema,
		ExtensionType: z.string(),
	})
	.strict();

const accountbasedexpenselinedetailSchema = z
	.object({
		TaxAmount: z.number().optional(),
		TaxInclusiveAmt: z.number().optional(),
		ClassRef: referencetypeSchema.optional(),
		TaxCodeRef: referencetypeSchema.optional(),
		MarkupInfo: markupinfoSchema.optional(),
		BillableStatus: z
			.enum(['Billable', 'NotBillable', 'HasBeenBilled'])
			.optional(),
		AccountRef: referencetypeSchema,
		CustomerRef: referencetypeSchema.optional(),
	})
	.strict();

const accountbasedexpenselineSchema = z
	.object({
		Description: z.string().optional(),
		DetailType: z.literal('AccountBasedExpenseLineDetail'),
		CustomExtensions: customextensionsSchema.optional(),
		LineNum: z.number().optional(),
		Amount: z.number(),
		Id: z.string(),
		AccountBasedExpenseLineDetail: accountbasedexpenselinedetailSchema,
	})
	.strict();

const linkedtxnSchema = z
	.object({
		TxnLineId: z.string().optional(),
		TxnId: z.string(),
		TxnType: z.string(),
	})
	.strict();

const linkedtxnBillSchema = z
	.object({
		TxnLineId: z.string(),
		TxnId: z.string(),
		TxnType: z.string(),
	})
	.strict();

const lineSchema = z
	.object({
		Received: z.string().optional(),
		LinkedTxn: z.array(linkedtxnSchema).optional(),
		Description: z.string().optional(),
		ProjectRef: referencetypeSchema.optional(),
		LineNum: z.number().optional(),
		Amount: z.number(),
		Id: z.string(),
	})
	.strict();

const purchaserequestSchema = z
	.object({
		PaymentType: z.string(),
		AccountRef: referencetypeSchema,
		CurrencyRef: currencyrefSchema.optional(),
		Line: z.array(accountbasedexpenselineSchema),
	})
	.strict();

const billrequestSchema = z
	.object({
		CurrencyRef: currencyrefSchema.optional(),
		VendorRef: referencetypeSchema,
		Line: z.array(accountbasedexpenselineSchema),
	})
	.strict();

const thresholdSchema = z
	.object({
		currentCount: z.string().optional(),
		aboveThreshold: z.string().optional(),
		enforced: z.string().optional(),
		limit: z.string().optional(),
		name: z.string().optional(),
	})
	.strict();

const itemadjustmentlineSchema = z
	.object({
		DetailType: z
			.enum([
				'PaymentLineDetail',
				'DiscountLineDetail',
				'TaxLineDetail',
				'SalesItemLineDetail',
				'ItemBasedExpenseLineDetail',
				'AccountBasedExpenseLineDetail',
				'DepositLineDetail',
				'PurchaseOrderItemLineDetail',
				'ItemReceiptLineDetail',
				'JournalEntryLineDetail',
				'GroupLineDetail',
				'DescriptionOnly',
				'SubTotalLineDetail',
				'SalesOrderItemLineDetail',
				'TDSLineDetail',
				'ReimburseLineDetail',
				'ItemAdjustmentLineDetail',
			])
			.optional(),
		CustomExtensions: customextensionsSchema.optional(),
		ItemAdjustmentLineDetail: itemadjustmentlinedetailSchema,
		Id: z.number(),
	})
	.strict();

const inventoryadjustmentrequestSchema = z
	.object({
		DocNumber: z.string().optional(),
		AdjustAccountRef: referencetypeSchema,
		PrivateNote: z.string().optional(),
		Line: z.array(itemadjustmentlineSchema),
		TxnDate: z.string(),
	})
	.strict();

const checkpaymentSchema = z
	.object({
		CheckNum: z.string().optional(),
		Status: z.string().optional(),
		NameOnAcct: z.string().optional(),
		AcctNum: z.string().optional(),
		BankName: z.string().optional(),
	})
	.strict();

const itembasedexpenselinedetailSchema = z
	.object({
		TaxInclusiveAmt: z.number().optional(),
		ItemRef: referencetypeSchema.optional(),
		CustomerRef: referencetypeSchema.optional(),
		PriceLevelRef: referencetypeSchema.optional(),
		ClassRef: referencetypeSchema.optional(),
		TaxCodeRef: referencetypeSchema.optional(),
		MarkupInfo: markupinfoSchema.optional(),
		BillableStatus: z
			.enum(['Billable', 'NotBillable', 'HasBeenBilled'])
			.optional(),
		Qty: z.number().optional(),
		UnitPrice: z.number().optional(),
	})
	.strict();

const itembasedexpenselinebillSchema = z
	.object({
		LinkedTxn: z.array(linkedtxnBillSchema).optional(),
		Description: z.string().optional(),
		ItemBasedExpenseLineDetail: itembasedexpenselinedetailSchema,
		CustomExtensions: customextensionsSchema.optional(),
		LineNum: z.number().optional(),
		Amount: z.number(),
		DetailType: z.literal('ItemBasedExpenseLineDetail'),
		Id: z.string(),
	})
	.strict();

const accountbasedexpenselinebillSchema = z
	.object({
		LinkedTxn: z.array(linkedtxnBillSchema).optional(),
		Description: z.string().optional(),
		DetailType: z.literal('AccountBasedExpenseLineDetail'),
		CustomExtensions: customextensionsSchema.optional(),
		LineNum: z.number().optional(),
		Amount: z.number(),
		Id: z.string(),
		AccountBasedExpenseLineDetail: accountbasedexpenselinedetailSchema,
	})
	.strict();

const deliveryinfoSchema = z
	.object({
		DeliveryType: z.enum(['Email', 'Tradeshift']).optional(),
		DeliveryTime: z.string().optional(),
	})
	.strict();

const discountoverrideSchema = z
	.object({
		DiscountAccountRef: referencetypeSchema.optional(),
		DiscountRef: referencetypeSchema.optional(),
		PercentBased: z.boolean().optional(),
		DiscountPercent: z.number().optional(),
	})
	.strict();

const salesitemlinedetailSchema = z
	.object({
		TaxInclusiveAmt: z.number().optional(),
		ItemRef: referencetypeSchema.optional(),
		ClassRef: referencetypeSchema.optional(),
		TaxCodeRef: referencetypeSchema.optional(),
		MarkupInfo: markupinfoSchema.optional(),
		ItemAccountRef: referencetypeSchema.optional(),
		ServiceDate: z.string().optional(),
		Qty: z.number().optional(),
		UnitPrice: z.number().optional(),
		TaxClassificationRef: referencetypeSchema.optional(),
	})
	.strict();

const salesitemlineSchema = z
	.object({
		Description: z.string().optional(),
		DetailType: z.enum([
			'PaymentLineDetail',
			'DiscountLineDetail',
			'TaxLineDetail',
			'SalesItemLineDetail',
			'ItemBasedExpenseLineDetail',
			'AccountBasedExpenseLineDetail',
			'DepositLineDetail',
			'PurchaseOrderItemLineDetail',
			'ItemReceiptLineDetail',
			'JournalEntryLineDetail',
			'GroupLineDetail',
			'DescriptionOnly',
			'SubTotalLineDetail',
			'SalesOrderItemLineDetail',
			'TDSLineDetail',
			'ReimburseLineDetail',
			'ItemAdjustmentLineDetail',
		]),
		SalesItemLineDetail: salesitemlinedetailSchema,
		LineNum: z.number().optional(),
		Amount: z.number(),
		CustomExtensions: customextensionsSchema.optional(),
		Id: z.string(),
	})
	.strict();

const grouplinedetailSchema = z
	.object({
		Quantity: z.number().optional(),
		Line: z.array(salesitemlineSchema).optional(),
		GroupItemRef: referencetypeSchema.optional(),
	})
	.strict();

const grouplineSchema = z
	.object({
		Description: z.string().optional(),
		GroupLineDetail: grouplinedetailSchema,
		DetailType: z.enum([
			'PaymentLineDetail',
			'DiscountLineDetail',
			'TaxLineDetail',
			'SalesItemLineDetail',
			'ItemBasedExpenseLineDetail',
			'AccountBasedExpenseLineDetail',
			'DepositLineDetail',
			'PurchaseOrderItemLineDetail',
			'ItemReceiptLineDetail',
			'JournalEntryLineDetail',
			'GroupLineDetail',
			'DescriptionOnly',
			'SubTotalLineDetail',
			'SalesOrderItemLineDetail',
			'TDSLineDetail',
			'ReimburseLineDetail',
			'ItemAdjustmentLineDetail',
		]),
		CustomExtensions: customextensionsSchema.optional(),
		LineNum: z.number().optional(),
		Id: z.string(),
	})
	.strict();

const descriptiononlySchema = z
	.object({
		TaxCodeRef: referencetypeSchema.optional(),
		ServiceDate: z.string().optional(),
	})
	.strict();

const descriptiononlylineSchema = z
	.object({
		Description: z.string().optional(),
		DetailType: z.enum([
			'PaymentLineDetail',
			'DiscountLineDetail',
			'TaxLineDetail',
			'SalesItemLineDetail',
			'ItemBasedExpenseLineDetail',
			'AccountBasedExpenseLineDetail',
			'DepositLineDetail',
			'PurchaseOrderItemLineDetail',
			'ItemReceiptLineDetail',
			'JournalEntryLineDetail',
			'GroupLineDetail',
			'DescriptionOnly',
			'SubTotalLineDetail',
			'SalesOrderItemLineDetail',
			'TDSLineDetail',
			'ReimburseLineDetail',
			'ItemAdjustmentLineDetail',
		]),
		LineNum: z.number().optional(),
		Amount: z.number().optional(),
		DescriptionLineDetail: descriptiononlySchema,
		Id: z.string(),
	})
	.strict();

const discountlineSchema = z
	.object({
		DiscountLineDetail: discountlinedetailSchema,
		Description: z.string().optional(),
		DetailType: z.enum([
			'PaymentLineDetail',
			'DiscountLineDetail',
			'TaxLineDetail',
			'SalesItemLineDetail',
			'ItemBasedExpenseLineDetail',
			'AccountBasedExpenseLineDetail',
			'DepositLineDetail',
			'PurchaseOrderItemLineDetail',
			'ItemReceiptLineDetail',
			'JournalEntryLineDetail',
			'GroupLineDetail',
			'DescriptionOnly',
			'SubTotalLineDetail',
			'SalesOrderItemLineDetail',
			'TDSLineDetail',
			'ReimburseLineDetail',
			'ItemAdjustmentLineDetail',
		]),
		LineNum: z.number().optional(),
		Amount: z.number(),
		Id: z.string(),
	})
	.strict();

const subtotallinedetailSchema = z
	.object({
		ItemRef: referencetypeSchema.optional(),
	})
	.strict();

const subtotallineSchema = z
	.object({
		Description: z.string().optional(),
		SubTotalLineDetail: subtotallinedetailSchema,
		DetailType: z.enum([
			'PaymentLineDetail',
			'DiscountLineDetail',
			'TaxLineDetail',
			'SalesItemLineDetail',
			'ItemBasedExpenseLineDetail',
			'AccountBasedExpenseLineDetail',
			'DepositLineDetail',
			'PurchaseOrderItemLineDetail',
			'ItemReceiptLineDetail',
			'JournalEntryLineDetail',
			'GroupLineDetail',
			'DescriptionOnly',
			'SubTotalLineDetail',
			'SalesOrderItemLineDetail',
			'TDSLineDetail',
			'ReimburseLineDetail',
			'ItemAdjustmentLineDetail',
		]),
		LineNum: z.number().optional(),
		Amount: z.number(),
		Id: z.string(),
	})
	.strict();

const memorefSchema = z
	.object({
		value: z.string(),
	})
	.strict();

const taxlinedetailSchema = z
	.object({
		NetAmountTaxable: z.number().optional(),
		PercentBased: z.boolean().optional(),
		TaxInclusiveAmount: z.number().optional(),
		OverrideDeltaAmount: z.number().optional(),
		TaxRateRef: referencetypeSchema,
		TaxPercent: z.number().optional(),
	})
	.strict();

const taxlineSchema = z
	.object({
		DetailType: z.enum([
			'PaymentLineDetail',
			'DiscountLineDetail',
			'TaxLineDetail',
			'SalesItemLineDetail',
			'ItemBasedExpenseLineDetail',
			'AccountBasedExpenseLineDetail',
			'DepositLineDetail',
			'PurchaseOrderItemLineDetail',
			'ItemReceiptLineDetail',
			'JournalEntryLineDetail',
			'GroupLineDetail',
			'DescriptionOnly',
			'SubTotalLineDetail',
			'SalesOrderItemLineDetail',
			'TDSLineDetail',
			'ReimburseLineDetail',
			'ItemAdjustmentLineDetail',
		]),
		Amount: z.number().optional(),
		TaxLineDetail: taxlinedetailSchema,
	})
	.strict();

const txntaxdetailSchema = z
	.object({
		TxnTaxCodeRef: referencetypeSchema.optional(),
		TotalTax: z.number().optional(),
		TaxLine: z.array(taxlineSchema).optional(),
	})
	.strict();

const physicaladdressSchema = z
	.object({
		City: z.string().optional(),
		Country: z.string().optional(),
		Line5: z.string().optional(),
		Line4: z.string().optional(),
		Line3: z.string().optional(),
		Line2: z.string().optional(),
		Line1: z.string().optional(),
		PostalCode: z.string().optional(),
		CountrySubDivisionCode: z.string().optional(),
		Id: z.string(),
	})
	.strict();

const creditmemoresponseSchema = z
	.object({
		TxnDate: z.string().optional(),
		CurrencyRef: currencyrefSchema.optional(),
		CustomField: customfieldSchema.optional(),
		HomeBalance: z.number().optional(),
		ClassRef: referencetypeSchema.optional(),
		PrintStatus: z.string().optional(),
		SalesTermRef: referencetypeSchema.optional(),
		GlobalTaxCalculation: z
			.enum(['TaxInclusive', 'TaxExcluded', 'NotApplicable'])
			.optional(),
		TotalAmt: z.number().optional(),
		RemainingCredit: z.number().optional(),
		ApplyTaxAfterDiscount: z.boolean().optional(),
		DocNumber: z.string().optional(),
		PrivateNote: z.string().optional(),
		RecurDataRef: referencetypeSchema.optional(),
		Line: z.array(salesitemlineSchema),
		CustomerMemo: memorefSchema.optional(),
		ProjectRef: referencetypeSchema.optional(),
		TaxExemptionRef: referencetypeSchema.optional(),
		Balance: z.number().optional(),
		CustomerRef: referencetypeSchema,
		TxnTaxDetail: txntaxdetailSchema.optional(),
		SyncToken: z.string().optional(),
		PaymentMethodRef: referencetypeSchema.optional(),
		ExchangeRate: z.number().optional(),
		ShipAddr: physicaladdressSchema.optional(),
		HomeTotalAmt: z.number().optional(),
		DepartmentRef: referencetypeSchema.optional(),
		EmailStatus: z.string().optional(),
		BillAddr: physicaladdressSchema.optional(),
		MetaData: modificationmetadataSchema.optional(),
		BillEmail: emailaddressSchema.optional(),
		Id: z.string(),
	})
	.strict();

const trialbalancequerySchema = z
	.object({
		accounting_method: z.string().optional(),
		end_date: z.string().optional(),
		date_macro: z.string().optional(),
		sort_order: z.string().optional(),
		summarize_column_by: z.string().optional(),
		start_date: z.string().optional(),
	})
	.strict();

const inventoryadjustmentcreaterequestSchema = z
	.object({
		DocNumber: z.string(),
		AdjustAccountRef: referencetypeSchema,
		PrivateNote: z.string().optional(),
		Line: z.array(itemadjustmentlineSchema),
		TxnDate: z.string(),
	})
	.strict();

const billpaymentcreditcardSchema = z
	.object({
		CCAccountRef: referencetypeSchema,
	})
	.strict();

const entitySchema = z
	.object({
		Type: z.enum(['Customer', 'Employee', 'Job', 'Other', 'Vendor']).optional(),
		EntityRef: referencetypeSchema,
	})
	.strict();

const journalentrylinedetailSchema = z
	.object({
		TaxAmount: z.number().optional(),
		TaxInclusiveAmt: z.number().optional(),
		ClassRef: referencetypeSchema.optional(),
		DepartmentRef: referencetypeSchema.optional(),
		TaxCodeRef: referencetypeSchema.optional(),
		BillableStatus: z
			.enum(['Billable', 'NotBillable', 'HasBeenBilled'])
			.optional(),
		TaxApplicableOn: z.enum(['Purchase', 'Sales']).optional(),
		PostingType: z.enum(['Credit', 'Debit']),
		AccountRef: referencetypeSchema,
		Entity: entitySchema.optional(),
	})
	.strict();

const creditchargeinfoSchema = z
	.object({
		CcExpiryMonth: z.number().int().optional(),
		ProcessPayment: z.boolean().optional(),
		PostalCode: z.string().optional(),
		Amount: z.number().optional(),
		NameOnAcct: z.string().optional(),
		CcExpiryYear: z.number().int().optional(),
		Type: z.string().optional(),
		BillAddrStreet: z.string().optional(),
	})
	.strict();

const taxpaymentresponseSchema = z
	.object({
		Refund: z.boolean().optional(),
		TxnDate: z.string().optional(),
		PaymentAccountRef: referencetypeSchema.optional(),
		Description: z.string().optional(),
		SyncToken: z.string().optional(),
		PaymentAmount: z.number().optional(),
		Id: z.string(),
		MetaData: modificationmetadataSchema.optional(),
	})
	.strict();

const frenchpcgaccountlistSchema = z.object({}).strict();

const websiteaddressSchema = z
	.object({
		URI: z.string().optional(),
	})
	.strict();

const jobinfoSchema = z
	.object({
		Status: z.string().optional(),
		StartDate: z.string().optional(),
		EndDate: z.string().optional(),
		Description: z.string().optional(),
		JobTypeRef: referencetypeSchema.optional(),
		ProjectedEndDate: z.string().optional(),
	})
	.strict();

const telephonenumberSchema = z
	.object({
		FreeFormNumber: z.string().optional(),
	})
	.strict();

const contactinfoSchema = z
	.object({
		Type: z.string().optional(),
		Telephone: telephonenumberSchema.optional(),
	})
	.strict();

const journalentrylineSchema = z
	.object({
		Description: z.string().optional(),
		JournalEntryLineDetail: journalentrylinedetailSchema,
		DetailType: z.enum([
			'PaymentLineDetail',
			'DiscountLineDetail',
			'TaxLineDetail',
			'SalesItemLineDetail',
			'ItemBasedExpenseLineDetail',
			'AccountBasedExpenseLineDetail',
			'DepositLineDetail',
			'PurchaseOrderItemLineDetail',
			'ItemReceiptLineDetail',
			'JournalEntryLineDetail',
			'GroupLineDetail',
			'DescriptionOnly',
			'SubTotalLineDetail',
			'SalesOrderItemLineDetail',
			'TDSLineDetail',
			'ReimburseLineDetail',
			'ItemAdjustmentLineDetail',
		]),
		ProjectRef: referencetypeSchema.optional(),
		CustomExtensions: customextensionsSchema.optional(),
		LineNum: z.number().optional(),
		Amount: z.number(),
		Id: z.string(),
	})
	.strict();

const journalentryresponseSchema = z
	.object({
		DocNumber: z.string().optional(),
		SyncToken: z.string().optional(),
		PrivateNote: z.string().optional(),
		RecurDataRef: referencetypeSchema.optional(),
		TxnDate: z.string().optional(),
		TotalAmt: z.number().optional(),
		ExchangeRate: z.number().optional(),
		CurrencyRef: currencyrefSchema.optional(),
		TaxRateRef: referencetypeSchema.optional(),
		HomeTotalAmt: z.number().optional(),
		TxnTaxDetail: txntaxdetailSchema.optional(),
		GlobalTaxCalculation: z
			.enum(['TaxInclusive', 'TaxExcluded', 'NotApplicable'])
			.optional(),
		Adjustment: z.boolean().optional(),
		Id: z.string(),
		Line: z.array(journalentrylineSchema),
		MetaData: modificationmetadataSchema.optional(),
	})
	.strict();

const departmentresponseSchema = z
	.object({
		SyncToken: z.string().optional(),
		Name: z.string(),
		FullyQualifiedName: z.string().optional(),
		SubDepartment: z.boolean().optional(),
		ParentRef: referencetypeSchema.optional(),
		Active: z.boolean().optional(),
		Id: z.string(),
		MetaData: modificationmetadataSchema.optional(),
	})
	.strict();

const customerbalancedetailquerySchema = z
	.object({
		customer: z.string().optional(),
		shipvia: z.string().optional(),
		term: z.string().optional(),
		end_duedate: z.string().optional(),
		start_duedate: z.string().optional(),
		custom1: z.string().optional(),
		sort_by: z.string().optional(),
		arpaid: z.string().optional(),
		report_date: z.string().optional(),
		sort_order: z.string().optional(),
		aging_method: z.string().optional(),
		department: z.string().optional(),
		columns: z.string().optional(),
	})
	.strict();

const customfieldstringpoSchema = z
	.object({
		StringValue: z.string().optional(),
		Type: z
			.enum(['StringType', 'BooleanType', 'NumberType', 'DateType'])
			.optional(),
		Name: z.string().optional(),
	})
	.strict();

const paymentlinedetailSchema = z
	.object({
		ClassRef: referencetypeSchema.optional(),
		Discount: discountoverrideSchema.optional(),
		Balance: z.number().optional(),
		ItemRef: referencetypeSchema.optional(),
	})
	.strict();

const transactionlistreportheaderSchema = z
	.object({
		Customer: z.string().optional(),
		ReportName: z.string().optional(),
		Vendor: z.string().optional(),
		Option: reportoptionSchema.optional(),
		Item: z.string().optional(),
		Employee: z.string().optional(),
		ReportBasis: z.enum(['Accrual', 'Cash']).optional(),
		StartPeriod: z.string().optional(),
		Currency: z.string().optional(),
		EndPeriod: z.string().optional(),
		Time: z.string().optional(),
		Department: z.string().optional(),
		SummarizeColumnsBy: z
			.enum([
				'Total',
				'Year',
				'Quarter',
				'FiscalYear',
				'FiscalQuarter',
				'Month',
				'Week',
				'Days',
				'Customers',
				'Vendors',
				'Employees',
				'Departments',
				'Classes',
				'ProductsAndServices',
			])
			.optional(),
	})
	.strict();

const transactionlistreporttoplevelSchema = z
	.object({
		Header: transactionlistreportheaderSchema.optional(),
		Rows: reportRowsSchema.optional(),
		Columns: reportcolumnsSchema.optional(),
	})
	.strict();

const trialbalancereportrowsSchema = z
	.object({
		Row: z.array(reportRowSchema).optional(),
	})
	.strict();

const categoryresponseSchema = z
	.object({
		SyncToken: z.string().optional(),
		Name: z.string().optional(),
		Level: z.number().int().optional(),
		FullyQualifiedName: z.string().optional(),
		SubItem: z.boolean().optional(),
		ParentRef: referencetypeSchema.optional(),
		Active: z.boolean().optional(),
		Type: z.string().optional(),
		Id: z.string(),
		MetaData: modificationmetadataSchema.optional(),
	})
	.strict();

const trialbalancereporttoplevelSchema = z
	.object({
		Header: reportheaderSchema.optional(),
		Rows: profitandlossreportrowsSchema.optional(),
		Columns: reportcolumnsSchema.optional(),
	})
	.strict();

const transactionlistbyvendorquerySchema = z
	.object({
		date_macro: z.string().optional(),
		payment_method: z.string().optional(),
		duedate_macro: z.string().optional(),
		arpaid: z.string().optional(),
		bothamount: z.string().optional(),
		transaction_type: z.string().optional(),
		docnum: z.string().optional(),
		start_moddate: z.string().optional(),
		source_account_type: z.string().optional(),
		group_by: z.string().optional(),
		start_date: z.string().optional(),
		department: z.string().optional(),
		start_duedate: z.string().optional(),
		columns: z.string().optional(),
		end_duedate: z.string().optional(),
		vendor: z.string().optional(),
		end_date: z.string().optional(),
		memo: z.string().optional(),
		appaid: z.string().optional(),
		moddate_macro: z.string().optional(),
		printed: z.string().optional(),
		createdate_macro: z.string().optional(),
		cleared: z.string().optional(),
		qzurl: z.string().optional(),
		term: z.string().optional(),
		end_createdate: z.string().optional(),
		name: z.string().optional(),
		sort_by: z.string().optional(),
		sort_order: z.string().optional(),
		start_createdate: z.string().optional(),
		end_moddate: z.string().optional(),
	})
	.strict();

const creditchargeresponseSchema = z
	.object({
		Status: z.enum(['Completed', 'Voided', 'Unknown']).optional(),
		AuthCode: z.string().optional(),
		TxnAuthorizationTime: z.string().optional(),
		CCTransId: z.string().optional(),
	})
	.strict();

const creditcardpaymentSchema = z
	.object({
		CreditChargeResponse: creditchargeresponseSchema.optional(),
		CreditChargeInfo: creditchargeinfoSchema.optional(),
	})
	.strict();

const refundreceiptresponseSchema = z
	.object({
		TxnDate: z.string().optional(),
		CurrencyRef: currencyrefSchema.optional(),
		CustomField: customfieldSchema.optional(),
		HomeBalance: z.number().optional(),
		ClassRef: referencetypeSchema.optional(),
		PrintStatus: z.string().optional(),
		PaymentRefNum: z.string().optional(),
		CheckPayment: checkpaymentSchema.optional(),
		TxnSource: z.string().optional(),
		RecurDataRef: referencetypeSchema.optional(),
		GlobalTaxCalculation: z
			.enum(['TaxInclusive', 'TaxExcluded', 'NotApplicable'])
			.optional(),
		TotalAmt: z.number().optional(),
		MetaData: modificationmetadataSchema.optional(),
		DocNumber: z.string().optional(),
		PrivateNote: z.string().optional(),
		DepositToAccountRef: referencetypeSchema,
		Line: z.array(salesitemlineSchema),
		CustomerMemo: memorefSchema.optional(),
		ProjectRef: referencetypeSchema.optional(),
		TaxExemptionRef: referencetypeSchema.optional(),
		CreditCardPayment: creditcardpaymentSchema.optional(),
		Balance: z.number().optional(),
		CustomerRef: referencetypeSchema.optional(),
		TxnTaxDetail: txntaxdetailSchema.optional(),
		SyncToken: z.string().optional(),
		PaymentMethodRef: referencetypeSchema.optional(),
		ExchangeRate: z.number().optional(),
		ShipAddr: physicaladdressSchema.optional(),
		Id: z.string(),
		DepartmentRef: referencetypeSchema.optional(),
		PaymentType: z
			.enum(['Cash', 'Check', 'CreditCard', 'Expense', 'Other'])
			.optional(),
		BillAddr: physicaladdressSchema.optional(),
		ApplyTaxAfterDiscount: z.boolean().optional(),
		BillEmail: emailaddressSchema.optional(),
		HomeTotalAmt: z.number().optional(),
	})
	.strict();

const paymentmethodrequestSchema = z
	.object({
		Name: z.string(),
	})
	.strict();

const dataservicesextensionsSchema = z.object({}).strict();

const cashflowreportrowsSchema = z
	.object({
		Row: z.array(reportRowSchema).optional(),
	})
	.strict();

const cashflowtoplevelSchema = z
	.object({
		Header: reportheaderSchema.optional(),
		Rows: cashflowreportrowsSchema.optional(),
		Columns: reportcolumnsSchema.optional(),
	})
	.strict();

const telephonenumber30Schema = z
	.object({
		FreeFormNumber: z.string().optional(),
	})
	.strict();

const vendorpaymentbankdetailSchema = z
	.object({
		BankAccountName: z.string().optional(),
		BankBranchIdentifier: z.string().optional(),
		BankAccountNumber: z.string().optional(),
		StatementText: z.string().optional(),
	})
	.strict();

const vendorresponseSchema = z
	.object({
		PrimaryEmailAddr: emailaddressSchema.optional(),
		DisplayName: z.string().optional(),
		OtherContactInfo: contactinfoSchema.optional(),
		Title: z.string().optional(),
		TermRef: referencetypeSchema.optional(),
		Source: z.string().optional(),
		GivenName: z.string().optional(),
		T4AEligible: z.boolean().optional(),
		Fax: telephonenumber30Schema.optional(),
		CurrencyRef: currencyrefSchema.optional(),
		Mobile: telephonenumber30Schema.optional(),
		PrimaryPhone: telephonenumber30Schema.optional(),
		Active: z.boolean().optional(),
		AlternatePhone: telephonenumber30Schema.optional(),
		MetaData: modificationmetadataSchema.optional(),
		Vendor1099: z.boolean().optional(),
		CostRate: z.number().optional(),
		MiddleName: z.string().optional(),
		BillRate: z.number().optional(),
		WebAddr: websiteaddressSchema.optional(),
		T5018Eligible: z.boolean().optional(),
		Balance: z.number().optional(),
		SyncToken: z.string().optional(),
		Suffix: z.string().optional(),
		CompanyName: z.string().optional(),
		FamilyName: z.string().optional(),
		VendorPaymentBankDetail: vendorpaymentbankdetailSchema.optional(),
		TaxIdentifier: z.string().optional(),
		AcctNum: z.string().optional(),
		HasTPAR: z.boolean().optional(),
		PrintOnCheckName: z.string().optional(),
		BillAddr: physicaladdressSchema.optional(),
		Id: z.string(),
	})
	.strict();

const accountrequestSchema = z
	.object({
		AcctNum: z.string().optional(),
		TaxCodeRef: referencetypeSchema.optional(),
		Name: z.string(),
		AccountType: z
			.enum([
				'Bank',
				'Accounts Receivable',
				'Other Current Asset',
				'Fixed Asset',
				'Other Asset',
				'Accounts Payable',
				'Credit Card',
				'Other Current Liability',
				'Long Term Liability',
				'Equity',
				'Income',
				'Cost of Goods Sold',
				'Expense',
				'Other Income',
				'Other Expense',
				'Non-Posting',
			])
			.optional(),
		AccountSubType: z.string().optional(),
	})
	.strict();

const servicetypeenumSchema = z.object({}).strict();

const taxratedetailsSchema = z
	.object({
		RateValue: z.string(),
		TaxRateId: z.string(),
		TaxApplicableOn: z.enum(['Purchase', 'Sales']).optional(),
		TaxAgencyId: z.string().optional(),
		TaxRateName: z.string().optional(),
	})
	.strict();

const effectivetaxratedataSchema = z
	.object({
		RateValue: z.number().optional(),
		EndDate: z.string().optional(),
		EffectiveDate: z.string().optional(),
	})
	.strict();

const taxrateresponseSchema = z
	.object({
		RateValue: z.number().optional(),
		SyncToken: z.string().optional(),
		Name: z.string().optional(),
		AgencyRef: referencetypeSchema.optional(),
		SpecialTaxType: z.string().optional(),
		EffectiveTaxRate: effectivetaxratedataSchema.optional(),
		DisplayType: z.string().optional(),
		TaxReturnLineRef: referencetypeSchema.optional(),
		Active: z.boolean().optional(),
		MetaData: modificationmetadataSchema.optional(),
		Id: z.string(),
		OriginalTaxRate: z.string().optional(),
		Description: z.string().optional(),
	})
	.strict();

const invoicevoidresponseSchema = z
	.object({
		TxnDate: z.string().optional(),
		ShipFromAddr: physicaladdressSchema.optional(),
		CurrencyRef: currencyrefSchema.optional(),
		HomeBalance: z.number().optional(),
		ShipDate: z.string().optional(),
		TrackingNum: z.string().optional(),
		ClassRef: referencetypeSchema.optional(),
		PrintStatus: z.string().optional(),
		EmailStatus: z.string().optional(),
		SalesTermRef: referencetypeSchema.optional(),
		DeliveryInfo: deliveryinfoSchema.optional(),
		TxnSource: z.string().optional(),
		LinkedTxn: z.array(linkedtxnSchema).optional(),
		GlobalTaxCalculation: z
			.enum(['TaxInclusive', 'TaxExcluded', 'NotApplicable'])
			.optional(),
		TotalAmt: z.number().optional(),
		AllowOnlineAffirmPayment: z.boolean().optional(),
		InvoiceLink: z.string().optional(),
		AllowOnlineACHPayment: z.boolean().optional(),
		DueDate: z.string().optional(),
		MetaData: modificationmetadataSchema.optional(),
		DocNumber: z.string().optional(),
		PrivateNote: z.string().optional(),
		DepositToAccountRef: referencetypeSchema.optional(),
		Line: z.array(salesitemlineSchema).optional(),
		BillEmailCc: emailaddressSchema.optional(),
		CustomerMemo: memorefSchema.optional(),
		AllowOnlinePayPalPayment: z.boolean().optional(),
		ProjectRef: referencetypeSchema.optional(),
		ExchangeRate: z.number().optional(),
		TaxExemptionRef: referencetypeSchema.optional(),
		Deposit: z.number().optional(),
		Balance: z.number().optional(),
		CustomerRef: referencetypeSchema.optional(),
		TxnTaxDetail: txntaxdetailSchema.optional(),
		AllowOnlineCreditCardPayment: z.boolean().optional(),
		SyncToken: z.string().optional(),
		CustomField: customfieldSchema.optional(),
		ShipAddr: physicaladdressSchema.optional(),
		HomeTotalAmt: z.number().optional(),
		DepartmentRef: referencetypeSchema.optional(),
		BillEmailBcc: emailaddressSchema.optional(),
		ShipMethodRef: referencetypeSchema.optional(),
		BillAddr: physicaladdressSchema.optional(),
		FreeFormAddress: z.boolean().optional(),
		ApplyTaxAfterDiscount: z.boolean().optional(),
		BillEmail: emailaddressSchema.optional(),
		Id: z.string(),
		AllowOnlinePayment: z.boolean().optional(),
		AllowIPNPayment: z.boolean().optional(),
	})
	.strict();

const creditcardpaymentrequestSchema = z
	.object({
		PrivateNote: z.string().optional(),
		TxnDate: z.string(),
		Amount: z.number(),
		BankAccountRef: referencetypeSchema,
		CreditCardAccountRef: referencetypeSchema,
	})
	.strict();

const pcesalesitemlinedetailSchema = z
	.object({
		ItemAccountRef: referencetypeSchema.optional(),
		ItemRef: referencetypeSchema.optional(),
		ClassRef: referencetypeSchema.optional(),
		TaxCodeRef: referencetypeSchema.optional(),
		MarkupInfo: markupinfoSchema.optional(),
		UnitCostPrice: z.number().optional(),
		ServiceDate: z.string().optional(),
		Qty: z.number().optional(),
		UnitPrice: z.number().optional(),
	})
	.strict();

const itembasedexpenselineSchema = z
	.object({
		LinkedTxn: z.array(linkedtxnSchema).optional(),
		Description: z.string().optional(),
		ItemBasedExpenseLineDetail: itembasedexpenselinedetailSchema,
		CustomExtensions: customextensionsSchema.optional(),
		LineNum: z.number().optional(),
		Amount: z.number(),
		DetailType: z.literal('ItemBasedExpenseLineDetail'),
		Id: z.string(),
	})
	.strict();

const vendorcreditresponseSchema = z
	.object({
		DocNumber: z.string().optional(),
		SyncToken: z.string().optional(),
		PrivateNote: z.string().optional(),
		LinkedTxn: z.array(linkedtxnSchema).optional(),
		VendorRef: referencetypeSchema,
		RecurDataRef: referencetypeSchema.optional(),
		GlobalTaxCalculation: z
			.enum(['TaxInclusive', 'TaxExcluded', 'NotApplicable'])
			.optional(),
		TotalAmt: z.number().optional(),
		ExchangeRate: z.number().optional(),
		APAccountRef: referencetypeSchema.optional(),
		DepartmentRef: referencetypeSchema.optional(),
		TxnDate: z.string().optional(),
		IncludeInAnnualTPAR: z.boolean().optional(),
		Line: z.array(itembasedexpenselineSchema),
		Balance: z.number().optional(),
		Id: z.string(),
		CurrencyRef: currencyrefSchema.optional(),
		MetaData: modificationmetadataSchema.optional(),
	})
	.strict();

const budgetdetailSchema = z
	.object({
		ClassRef: referencetypeSchema.optional(),
		DepartmentRef: referencetypeSchema.optional(),
		Amount: z.number().optional(),
		BudgetDate: z.string().optional(),
		AccountRef: referencetypeSchema.optional(),
		CustomerRef: referencetypeSchema.optional(),
	})
	.strict();

const budgetrequestSchema = z
	.object({
		BudgetDetail: z.array(budgetdetailSchema).optional(),
		BudgetEntryType: z.enum(['Yearly', 'Quarterly', 'Monthly']).optional(),
		EndDate: z.string(),
		Name: z.string().optional(),
		StartDate: z.string(),
		BudgetType: z.enum(['ProfitAndLoss', 'BalanceSheet']).optional(),
		CustomExtensions: customextensionsSchema.optional(),
	})
	.strict();

const recurringscheduleinfoSchema = z
	.object({
		DayOfWeek: z.string().optional(),
		StartDate: z.string().optional(),
		MaxOccurrences: z.string().optional(),
		RemindDays: z.string().optional(),
		IntervalType: z.string().optional(),
		WeekOfMonth: z.string().optional(),
		MonthOfYear: z.string().optional(),
		DaysBefore: z.string().optional(),
		NextDate: z.string().optional(),
		NumInterval: z.string().optional(),
		EndDate: z.string().optional(),
		PreviousDate: z.string().optional(),
		DayOfMonth: z.string().optional(),
	})
	.strict();

const recurringinfoSchema = z
	.object({
		Active: z.boolean().optional(),
		RecurType: z.string().optional(),
		ScheduleInfo: recurringscheduleinfoSchema.optional(),
		Name: z.string().optional(),
	})
	.strict();

const departmentrequestSchema = z
	.object({
		Name: z.string(),
		ParentRef: referencetypeSchema.optional(),
	})
	.strict();

const linelinkedtxnSchema = z
	.object({
		Amount: z.number(),
		LinkedTxn: z.array(linkedtxnSchema),
	})
	.strict();

const billpaymentcheckSchema = z
	.object({
		PrintStatus: z.enum(['NotSet', 'NeedToPrint', 'PrintComplete']).optional(),
		BankAccountRef: referencetypeSchema,
	})
	.strict();

const billpaymentresponseSchema = z
	.object({
		DocNumber: z.string().optional(),
		SyncToken: z.string().optional(),
		PrivateNote: z.string().optional(),
		VendorRef: referencetypeSchema,
		Line: z.array(linelinkedtxnSchema),
		TxnDate: z.string().optional(),
		TotalAmt: z.number(),
		ExchangeRate: z.number().optional(),
		APAccountRef: referencetypeSchema.optional(),
		PayType: z.enum(['Check', 'CreditCard']),
		DepartmentRef: referencetypeSchema.optional(),
		CheckPayment: billpaymentcheckSchema.optional(),
		CreditCardPayment: billpaymentcreditcardSchema.optional(),
		ProcessBillPayment: z.boolean().optional(),
		Id: z.string(),
		CurrencyRef: currencyrefSchema.optional(),
		MetaData: modificationmetadataSchema.optional(),
	})
	.strict();

const taxratedetailSchema = z
	.object({
		TaxTypeApplicable: z.string().optional(),
		TaxRateRef: referencetypeSchema,
		TaxOrder: z.number().int().optional(),
	})
	.strict();

const taxratelistSchema = z
	.object({
		TaxRateDetail: z.array(taxratedetailSchema).optional(),
	})
	.strict();

const taxcoderesponseSchema = z
	.object({
		SyncToken: z.string().optional(),
		TaxGroup: z.boolean().optional(),
		PurchaseTaxRateList: taxratelistSchema.optional(),
		TaxCodeConfigType: z.string().optional(),
		Taxable: z.boolean().optional(),
		Name: z.string(),
		Active: z.boolean().optional(),
		Description: z.string().optional(),
		Hidden: z.boolean().optional(),
		MetaData: modificationmetadataSchema.optional(),
		Id: z.string(),
		SalesTaxRateList: taxratelistSchema.optional(),
	})
	.strict();

const transactionlistquerySchema = z
	.object({
		date_macro: z.string().optional(),
		payment_method: z.string().optional(),
		duedate_macro: z.string().optional(),
		arpaid: z.string().optional(),
		bothamount: z.string().optional(),
		transaction_type: z.string().optional(),
		docnum: z.string().optional(),
		start_moddate: z.string().optional(),
		source_account_type: z.string().optional(),
		group_by: z.string().optional(),
		start_date: z.string().optional(),
		department: z.string().optional(),
		start_duedate: z.string().optional(),
		columns: z.string().optional(),
		end_duedate: z.string().optional(),
		vendor: z.string().optional(),
		end_date: z.string().optional(),
		memo: z.string().optional(),
		appaid: z.string().optional(),
		moddate_macro: z.string().optional(),
		printed: z.string().optional(),
		createdate_macro: z.string().optional(),
		cleared: z.string().optional(),
		customer: z.string().optional(),
		qzurl: z.string().optional(),
		term: z.string().optional(),
		end_createdate: z.string().optional(),
		name: z.string().optional(),
		sort_by: z.string().optional(),
		sort_order: z.string().optional(),
		start_createdate: z.string().optional(),
		end_moddate: z.string().optional(),
	})
	.strict();

const vendorbalancequerySchema = z
	.object({
		qzurl: z.string().optional(),
		accounting_method: z.string().optional(),
		date_macro: z.string().optional(),
		appaid: z.string().optional(),
		report_date: z.string().optional(),
		sort_order: z.string().optional(),
		summarize_column_by: z.string().optional(),
		department: z.string().optional(),
		vendor: z.string().optional(),
	})
	.strict();

const purchaseorderrequestSchema = z
	.object({
		CurrencyRef: currencyrefSchema.optional(),
		APAccountRef: referencetypeSchema,
		VendorRef: referencetypeSchema,
		Line: z.array(itembasedexpenselineSchema),
	})
	.strict();

const profitandlossdetailstoplevelSchema = z
	.object({
		Header: reportheaderSchema.optional(),
		Rows: reportRowsSchema.optional(),
		Columns: reportcolumnsSchema.optional(),
	})
	.strict();

const companycurrencyrequestSchema = z
	.object({
		Code: z.string(),
	})
	.strict();

const customfieldstringsalesSchema = z
	.object({
		StringValue: z.string().optional(),
		Type: z
			.enum(['StringType', 'BooleanType', 'NumberType', 'DateType'])
			.optional(),
		Name: z.string().optional(),
	})
	.strict();

const inventoryvaluationdetailquerySchema = z
	.object({
		end_date: z.string().optional(),
		end_svcdate: z.string().optional(),
		date_macro: z.string().optional(),
		svcdate_macro: z.string().optional(),
		start_svcdate: z.string().optional(),
		group_by: z.string().optional(),
		start_date: z.string().optional(),
		columns: z.string().optional(),
	})
	.strict();

const departmentsalesquerySchema = z
	.object({
		customer: z.string().optional(),
		accounting_method: z.string().optional(),
		end_date: z.string().optional(),
		date_macro: z.string().optional(),
		class: z.string().optional(),
		item: z.string().optional(),
		sort_order: z.string().optional(),
		summarize_column_by: z.string().optional(),
		department: z.string().optional(),
		start_date: z.string().optional(),
	})
	.strict();

const projectestimateresponseSchema = z
	.object({
		TxnDate: z.string().optional(),
		ShipFromAddr: physicaladdressSchema.optional(),
		CurrencyRef: currencyrefSchema.optional(),
		ShipDate: z.string().optional(),
		ClassRef: referencetypeSchema.optional(),
		PrintStatus: z.string().optional(),
		HomeTotalCostAmount: z.number().optional(),
		CustomField: customfieldSchema.optional(),
		SalesTermRef: referencetypeSchema.optional(),
		TxnStatus: z.string().optional(),
		LinkedTxn: z.array(linkedtxnSchema).optional(),
		TotalAmt: z.number().optional(),
		AcceptedDate: z.string().optional(),
		ExpirationDate: z.string().optional(),
		DueDate: z.string().optional(),
		MetaData: modificationmetadataSchema.optional(),
		DocNumber: z.string().optional(),
		PrivateNote: z.string().optional(),
		RecurDataRef: referencetypeSchema.optional(),
		Line: z.array(salesitemlineSchema).optional(),
		CustomerMemo: memorefSchema.optional(),
		EmailStatus: z.string().optional(),
		ProjectRef: referencetypeSchema.optional(),
		TaxExemptionRef: referencetypeSchema.optional(),
		CustomerRef: referencetypeSchema,
		TxnTaxDetail: txntaxdetailSchema.optional(),
		SyncToken: z.string().optional(),
		AcceptedBy: z.string().optional(),
		ExchangeRate: z.number().optional(),
		TotalCostAmount: z.number().optional(),
		ShipAddr: physicaladdressSchema.optional(),
		HomeTotalAmt: z.number().optional(),
		DepartmentRef: referencetypeSchema.optional(),
		ShipMethodRef: referencetypeSchema.optional(),
		BillAddr: physicaladdressSchema.optional(),
		FreeFormAddress: z.boolean().optional(),
		ApplyTaxAfterDiscount: z.boolean().optional(),
		BillEmail: emailaddressSchema.optional(),
		Id: z.string(),
	})
	.strict();

const taxagencyrequestSchema = z
	.object({
		DisplayName: z.string(),
	})
	.strict();

const companycurrencyresponseSchema = z
	.object({
		SyncToken: z.string().optional(),
		Code: z.string(),
		Name: z.string().optional(),
		CustomField: customfieldSchema.optional(),
		Active: z.boolean().optional(),
		Id: z.string(),
		MetaData: modificationmetadataSchema.optional(),
	})
	.strict();

const reportsqueryallSchema = z
	.object({
		date_macro: z.string().optional(),
		payment_method: z.string().optional(),
		duedate_macro: z.string().optional(),
		arpaid: z.string().optional(),
		report_date: z.string().optional(),
		sort_order: z.string().optional(),
		summarize_column_by: z.string().optional(),
		account_status: z.string().optional(),
		vendor: z.string().optional(),
		accounting_method: z.string().optional(),
		'item<': z.string().optional(),
		employee: z.string().optional(),
		columns: z.string().optional(),
		account_type: z.string().optional(),
		shipvia: z.string().optional(),
		'start_createdate end_createdate': z.string().optional(),
		department: z.string().optional(),
		num_periods: z.number().int().optional(),
		createdate_macro: z.string().optional(),
		past_due: z.number().int().optional(),
		class: z.string().optional(),
		customer: z.string().optional(),
		qzurl: z.string().optional(),
		term: z.string().optional(),
		sort_by: z.string().optional(),
		appaid: z.string().optional(),
		aging_method: z.string().optional(),
		moddate_macro: z.string().optional(),
		aging_period: z.number().optional(),
	})
	.strict();

const vendorexpensesquerySchema = z
	.object({
		customer: z.string().optional(),
		vendor: z.string().optional(),
		end_date: z.string().optional(),
		date_macro: z.string().optional(),
		class: z.string().optional(),
		sort_order: z.string().optional(),
		summarize_column_by: z.string().optional(),
		department: z.string().optional(),
		accounting_method: z.string().optional(),
		start_date: z.string().optional(),
	})
	.strict();

const itemreceiptlineSchema = z
	.object({
		LineNum: z.number().optional(),
		Amount: z.number(),
		Description: z.string().optional(),
		DetailType: z.enum([
			'PaymentLineDetail',
			'DiscountLineDetail',
			'TaxLineDetail',
			'SalesItemLineDetail',
			'ItemBasedExpenseLineDetail',
			'AccountBasedExpenseLineDetail',
			'DepositLineDetail',
			'PurchaseOrderItemLineDetail',
			'ItemReceiptLineDetail',
			'JournalEntryLineDetail',
			'GroupLineDetail',
			'DescriptionOnly',
			'SubTotalLineDetail',
			'SalesOrderItemLineDetail',
			'TDSLineDetail',
			'ReimburseLineDetail',
			'ItemAdjustmentLineDetail',
		]),
		Id: z.string(),
	})
	.strict();

const customfieldboolpoSchema = z
	.object({
		BooleanValue: z.boolean().optional(),
		Type: z
			.enum(['StringType', 'BooleanType', 'NumberType', 'DateType'])
			.optional(),
		Name: z.string().optional(),
	})
	.strict();

const agedpayablesquerySchema = z
	.object({
		customer: z.string().optional(),
		qzurl: z.string().optional(),
		vendor: z.string().optional(),
		date_macro: z.string().optional(),
		department: z.string().optional(),
		report_date: z.string().optional(),
		sort_order: z.string().optional(),
		aging_method: z.string().optional(),
	})
	.strict();

const attachableresponseSchema = z
	.object({
		Category: z.string().optional(),
		SyncToken: z.string().optional(),
		FileAccessUri: z.string().optional(),
		ContentType: z.string().optional(),
		PlaceName: z.string().optional(),
		Size: z.number().optional(),
		AttachableRef: attachablerefSchema.optional(),
		Long: z.string().optional(),
		FileName: z.string().optional(),
		Note: z.string().optional(),
		Tag: z.string().optional(),
		Lat: z.string().optional(),
		ThumbnailFileAccessUri: z.string().optional(),
		TempDownloadUri: z.string().optional(),
		ThumbnailTempDownloadUri: z.string().optional(),
		Id: z.string(),
		MetaData: modificationmetadataSchema.optional(),
	})
	.strict();

const agedpayablesreportrowsSchema = z
	.object({
		Row: z.array(reportRowSchema).optional(),
	})
	.strict();

const agedpayablestoplevelSchema = z
	.object({
		Header: reportheaderSchema.optional(),
		Rows: agedpayablesreportrowsSchema.optional(),
		Columns: reportcolumnsSchema.optional(),
	})
	.strict();

const purchaseorderitemlinedetailSchema = z
	.object({
		OpenQty: z.number().optional(),
		ItemRef: referencetypeSchema.optional(),
		ManuallyClosed: z.boolean().optional(),
		PriceLevelRef: referencetypeSchema.optional(),
		ClassRef: referencetypeSchema.optional(),
		TaxCodeRef: referencetypeSchema.optional(),
		MarkupInfo: markupinfoSchema.optional(),
		ServiceDate: dateSchema.optional(),
		Qty: z.number().optional(),
		UnitPrice: z.number().optional(),
	})
	.strict();

const purchaseorderitemlineSchema = z
	.object({
		Description: z.string().optional(),
		DetailType: z.enum([
			'PaymentLineDetail',
			'DiscountLineDetail',
			'TaxLineDetail',
			'SalesItemLineDetail',
			'ItemBasedExpenseLineDetail',
			'AccountBasedExpenseLineDetail',
			'DepositLineDetail',
			'PurchaseOrderItemLineDetail',
			'ItemReceiptLineDetail',
			'JournalEntryLineDetail',
			'GroupLineDetail',
			'DescriptionOnly',
			'SubTotalLineDetail',
			'SalesOrderItemLineDetail',
			'TDSLineDetail',
			'ReimburseLineDetail',
			'ItemAdjustmentLineDetail',
		]),
		LineNum: z.number().optional(),
		Amount: z.number(),
		CustomField: customfieldSchema.optional(),
		PurchaseOrderItemLineDetail: purchaseorderitemlinedetailSchema,
		Id: z.string(),
	})
	.strict();

const agedreceivablesquerySchema = z
	.object({
		customer: z.string().optional(),
		qzurl: z.string().optional(),
		date_macro: z.string().optional(),
		aging_method: z.string().optional(),
		report_date: z.string().optional(),
		sort_order: z.string().optional(),
		department: z.string().optional(),
	})
	.strict();

const termrequestSchema = z
	.object({
		DayOfMonthDue: z.number().int().optional(),
		DueDays: z.number().int().optional(),
		Name: z.string(),
	})
	.strict();

const depositlinedetailSchema = z
	.object({
		PaymentMethodRef: referencetypeSchema.optional(),
		ClassRef: referencetypeSchema.optional(),
		CheckNum: z.string().optional(),
		TaxCodeRef: referencetypeSchema.optional(),
		TaxApplicableOn: z.enum(['Purchase', 'Sales']).optional(),
		TxnType: z
			.enum([
				'APCreditCard',
				'ARRefundCreditCard',
				'Bill',
				'BillPaymentCheck',
				'BuildAssembly',
				'CarryOver',
				'CashPurchase',
				'Charge',
				'Check',
				'CreditCardPayment',
				'CreditMemo',
				'Deposit',
				'EFPLiabilityCheck',
				'EFTBillPayment',
				'EFTRefund',
				'Estimate',
				'InventoryAdjustment',
				'InventoryTransfer',
				'Invoice',
				'ItemReceipt',
				'JournalEntry',
				'LiabilityAdjustment',
				'Paycheck',
				'PayrollLiabilityCheck',
				'PurchaseOrder',
				'PriorPayment',
				'ReceivePayment',
				'RefundCheck',
				'ReimburseCharge',
				'SalesOrder',
				'SalesReceipt',
				'SalesTaxPaymentCheck',
				'Transfer',
				'TimeActivity',
				'VendorCredit',
				'YTDAdjustment',
			])
			.optional(),
		AccountRef: referencetypeSchema,
		Entity: referencetypeSchema.optional(),
	})
	.strict();

const depositlineSchema = z
	.object({
		Description: z.string().optional(),
		DetailType: z.literal('DepositLineDetail'),
		ProjectRef: referencetypeSchema.optional(),
		CustomExtensions: customextensionsSchema.optional(),
		LineNum: z.number().optional(),
		Amount: z.number(),
		CustomField: customfieldSchema.optional(),
		Id: z.string(),
		DepositLineDetail: depositlinedetailSchema,
	})
	.strict();

const timeactivityrequestSchema = z
	.object({
		TxnDate: z.string().optional(),
		EmployeeRef: referencetypeSchema.optional(),
		ProjectRef: referencetypeSchema.optional(),
		Hours: z.number().int().optional(),
		StartTime: z.string().optional(),
		HourlyRate: z.number().optional(),
		VendorRef: referencetypeSchema.optional(),
		EndTime: z.string().optional(),
		CustomerRef: referencetypeSchema.optional(),
		NameOf: z.string(),
	})
	.strict();

const creditcardpaymentresponseSchema = z
	.object({
		SyncToken: z.string().optional(),
		PrivateNote: z.string().optional(),
		VendorRef: referencetypeSchema.optional(),
		CreditCardAccountRef: referencetypeSchema,
		TxnDate: z.string().optional(),
		Memo: z.string().optional(),
		PrintStatus: z.string().optional(),
		CheckNum: z.string().optional(),
		Amount: z.number(),
		BankAccountRef: referencetypeSchema,
		Id: z.string(),
		MetaData: modificationmetadataSchema.optional(),
	})
	.strict();

const termresponseSchema = z
	.object({
		SyncToken: z.string().optional(),
		DayOfMonthDue: z.number().int().optional(),
		Name: z.string(),
		DiscountDayOfMonth: z.number().int().positive().optional(),
		DiscountPercent: z.number().optional(),
		DiscountDays: z.number().int().optional(),
		DueNextMonthDays: z.number().int().positive().optional(),
		DueDays: z.number().int().optional(),
		Active: z.boolean().optional(),
		Type: z.string().optional(),
		Id: z.string(),
		MetaData: modificationmetadataSchema.optional(),
	})
	.strict();

const inventoryvaluationquerySchema = z
	.object({
		qzurl: z.string().optional(),
		date_macro: z.string().optional(),
		item: z.string().optional(),
		report_date: z.string().optional(),
		sort_order: z.string().optional(),
		summarize_column_by: z.string().optional(),
	})
	.strict();

const paymentlineSchema = z
	.object({
		Description: z.string().optional(),
		DetailType: z.enum([
			'PaymentLineDetail',
			'DiscountLineDetail',
			'TaxLineDetail',
			'SalesItemLineDetail',
			'ItemBasedExpenseLineDetail',
			'AccountBasedExpenseLineDetail',
			'DepositLineDetail',
			'PurchaseOrderItemLineDetail',
			'ItemReceiptLineDetail',
			'JournalEntryLineDetail',
			'GroupLineDetail',
			'DescriptionOnly',
			'SubTotalLineDetail',
			'SalesOrderItemLineDetail',
			'TDSLineDetail',
			'ReimburseLineDetail',
			'ItemAdjustmentLineDetail',
		]),
		LineNum: z.number().optional(),
		Amount: z.number(),
		PaymentLineDetail: paymentlinedetailSchema,
		Id: z.string(),
	})
	.strict();

const customerrequestSchema = z
	.object({
		DisplayName: z.string().optional(),
		Suffix: z.string().optional(),
		Title: z.string().optional(),
		MiddleName: z.string().optional(),
		FamilyName: z.string().optional(),
		GivenName: z.string().optional(),
	})
	.strict();

const taxagencyresponseSchema = z
	.object({
		SyncToken: z.string().optional(),
		TaxAgencyConfig: z.string().optional(),
		DisplayName: z.string(),
		TaxTrackedOnSales: z.boolean().optional(),
		TaxTrackedOnPurchases: z.boolean().optional(),
		LastFileDate: z.string().optional(),
		Id: z.string(),
		TaxRegistrationNumber: z.string().optional(),
		MetaData: modificationmetadataSchema.optional(),
	})
	.strict();

const batchrequestSchema = z
	.object({
		BatchItemRequest: z.string(),
	})
	.strict();

const customertyperesponseSchema = z
	.object({
		Active: z.boolean().optional(),
		SyncToken: z.string().optional(),
		MetaData: modificationmetadataSchema.optional(),
		Name: z.string().optional(),
		Id: z.string(),
	})
	.strict();

const itemreftypeSchema = z
	.object({
		type: z.string().optional(),
		name: z.string().optional(),
		value: z.string(),
	})
	.strict();

const generalledgerquerySchema = z
	.object({
		customer: z.string().optional(),
		account: z.string().optional(),
		accounting_method: z.string().optional(),
		source_account: z.string().optional(),
		end_date: z.string().optional(),
		date_macro: z.string().optional(),
		account_type: z.string().optional(),
		sort_by: z.string().optional(),
		sort_order: z.string().optional(),
		start_date: z.string().optional(),
		summarize_column_by: z.string().optional(),
		department: z.string().optional(),
		vendor: z.string().optional(),
		class: z.string().optional(),
		columns: z.string().optional(),
	})
	.strict();

const agedreceivabledetailquerySchema = z
	.object({
		customer: z.string().optional(),
		shipvia: z.string().optional(),
		term: z.string().optional(),
		end_duedate: z.string().optional(),
		start_duedate: z.string().optional(),
		custom1: z.string().optional(),
		custom2: z.string().optional(),
		custom3: z.string().optional(),
		report_date: z.string().optional(),
		num_periods: z.number().int().optional(),
		aging_method: z.string().optional(),
		past_due: z.number().int().optional(),
		aging_period: z.number().optional(),
		columns: z.string().optional(),
	})
	.strict();

const reimbursechargelineSchema = z
	.object({
		LinkedTxn: z.array(linkedtxnSchema).optional(),
		LineNum: z.number().optional(),
		ReimburseLineDetail: discountlinedetailSchema,
		LineId: z.string().optional(),
		DetailType: z.enum([
			'PaymentLineDetail',
			'DiscountLineDetail',
			'TaxLineDetail',
			'SalesItemLineDetail',
			'ItemBasedExpenseLineDetail',
			'AccountBasedExpenseLineDetail',
			'DepositLineDetail',
			'PurchaseOrderItemLineDetail',
			'ItemReceiptLineDetail',
			'JournalEntryLineDetail',
			'GroupLineDetail',
			'DescriptionOnly',
			'SubTotalLineDetail',
			'SalesOrderItemLineDetail',
			'TDSLineDetail',
			'ReimburseLineDetail',
			'ItemAdjustmentLineDetail',
		]),
	})
	.strict();

const projectestimaterequestSchema = z
	.object({
		ProjectRef: referencetypeSchema.optional(),
		Line: salesitemlineSchema,
		CustomerRef: referencetypeSchema,
		CurrencyRef: currencyrefSchema.optional(),
	})
	.strict();

const agedreceivablesreportrowsSchema = z
	.object({
		Row: z.array(reportRowSchema).optional(),
	})
	.strict();

const agedreceivablestoplevelSchema = z
	.object({
		Header: reportheaderSchema.optional(),
		Rows: agedreceivablesreportrowsSchema.optional(),
		Columns: reportcolumnsSchema.optional(),
	})
	.strict();

const taxserviceresponseSchema = z
	.object({
		TaxCodeId: z.string().optional(),
		TaxCode: z.string(),
		TaxRateDetails: z.array(taxratedetailsSchema),
	})
	.strict();

const taxservicerequestSchema = z
	.object({
		TaxCode: z.string(),
		TaxRateDetails: z.array(taxratedetailsSchema),
	})
	.strict();

const categoryrequestSchema = z
	.object({
		SubItem: z.boolean().optional(),
		Type: z.string(),
		Name: z.string(),
		ParentRef: referencetypeSchema.optional(),
	})
	.strict();

const transferrequestSchema = z
	.object({
		Amount: z.number(),
		ToAccountRef: referencetypeSchema,
		FromAccountRef: referencetypeSchema,
	})
	.strict();

const customertyperefSchema = z
	.object({
		value: z.string(),
	})
	.strict();

const customerresponseSchema = z
	.object({
		PrimaryEmailAddr: emailaddressSchema.optional(),
		DisplayName: z.string().optional(),
		Title: z.string().optional(),
		ResaleNum: z.string().optional(),
		SecondaryTaxIdentifier: z.string().optional(),
		DefaultTaxCodeRef: referencetypeSchema.optional(),
		PreferredDeliveryMethod: z.string().optional(),
		GivenName: z.string().optional(),
		SalesTermRef: referencetypeSchema.optional(),
		CustomerTypeRef: customertyperefSchema.optional(),
		FullyQualifiedName: z.string().optional(),
		Fax: telephonenumber30Schema.optional(),
		BillWithParent: z.boolean().optional(),
		CurrencyRef: referencetypeSchema.optional(),
		Mobile: telephonenumber30Schema.optional(),
		Job: z.boolean().optional(),
		BalanceWithJobs: z.number().optional(),
		PrimaryPhone: telephonenumber30Schema.optional(),
		OpenBalanceDate: z.string().optional(),
		Taxable: z.boolean().optional(),
		AlternatePhone: telephonenumber30Schema.optional(),
		MetaData: modificationmetadataSchema.optional(),
		ParentRef: referencetypeSchema.optional(),
		Level: z.number().int().optional(),
		MiddleName: z.string().optional(),
		Notes: z.string().optional(),
		TaxExemptionReasonId: z.string().optional(),
		WebAddr: websiteaddressSchema.optional(),
		Active: z.boolean().optional(),
		CompanyName: z.string().optional(),
		Balance: z.number().optional(),
		SyncToken: z.string().optional(),
		ShipAddr: physicaladdressSchema.optional(),
		PaymentMethodRef: referencetypeSchema.optional(),
		Suffix: z.string().optional(),
		IsProject: z.boolean().optional(),
		Source: z.string().optional(),
		FamilyName: z.string().optional(),
		PrimaryTaxIdentifier: z.string().optional(),
		PrintOnCheckName: z.string().optional(),
		BillAddr: physicaladdressSchema.optional(),
		Id: z.string(),
	})
	.strict();

const batchresponseSchema = z
	.object({
		BatchItemResponse: z.string(),
	})
	.strict();

const customfieldboolsalesSchema = z
	.object({
		BooleanValue: z.boolean().optional(),
		Type: z
			.enum(['StringType', 'BooleanType', 'NumberType', 'DateType'])
			.optional(),
		Name: z.string().optional(),
	})
	.strict();

const creditmemorequestSchema = z
	.object({
		ProjectRef: referencetypeSchema.optional(),
		Line: salesitemlineSchema,
		CustomerRef: referencetypeSchema,
		CurrencyRef: currencyrefSchema.optional(),
	})
	.strict();

const inventoryadjustmentdeleterequestSchema = z
	.object({
		SyncToken: z.string(),
		id: z.string(),
	})
	.strict();

const deleterequestSchema = z
	.object({
		SyncToken: z.string(),
		id: z.string(),
	})
	.strict();

const voidrequestSchema = z
	.object({
		SyncToken: z.string(),
		id: z.string(),
		sparse: z.string(),
	})
	.strict();

const transferresponseSchema = z
	.object({
		SyncToken: z.string().optional(),
		PrivateNote: z.string().optional(),
		RecurDataRef: referencetypeSchema.optional(),
		TxnDate: z.string().optional(),
		ToAccountRef: referencetypeSchema,
		Amount: z.number(),
		Id: z.string(),
		FromAccountRef: referencetypeSchema,
		MetaData: modificationmetadataSchema.optional(),
	})
	.strict();

const refundreceiptrequestSchema = z
	.object({
		CurrencyRef: currencyrefSchema.optional(),
		ProjectRef: referencetypeSchema.optional(),
		DepositToAccountRef: referencetypeSchema,
		Line: z.array(salesitemlineSchema),
	})
	.strict();

const creditmemoSchema = z
	.object({
		TxnDate: z.string().optional(),
		CurrencyRef: z.string().optional(),
		HomeBalance: z.number().optional(),
		ShipDate: z.string().optional(),
		TrackingNum: z.string().optional(),
		PrintStatus: z.string().optional(),
		CustomField: customfieldSchema.optional(),
		SalesTermRef: referencetypeSchema.optional(),
		GlobalTaxCalculation: z
			.enum(['TaxInclusive', 'TaxExcluded', 'NotApplicable'])
			.optional(),
		TotalAmt: z.number().optional(),
		DueDate: z.string().optional(),
		MetaData: modificationmetadataSchema.optional(),
		DocNumber: z.string().optional(),
		PrivateNote: z.string().optional(),
		DepositToAccountRef: referencetypeSchema.optional(),
		Line: z.array(salesitemlineSchema).optional(),
		CustomerMemo: memorefSchema.optional(),
		EmailStatus: z.string().optional(),
		ProjectRef: referencetypeSchema.optional(),
		TaxExemptionRef: referencetypeSchema.optional(),
		Deposit: z.number().optional(),
		Balance: z.number().optional(),
		CustomerRef: referencetypeSchema,
		TxnTaxDetail: txntaxdetailSchema.optional(),
		SyncToken: z.string().optional(),
		ExchangeRate: z.number().optional(),
		ShipAddr: physicaladdressSchema.optional(),
		HomeTotalAmt: z.number().optional(),
		DepartmentRef: referencetypeSchema.optional(),
		ShipMethodRef: referencetypeSchema.optional(),
		BillAddr: physicaladdressSchema.optional(),
		ApplyTaxAfterDiscount: z.boolean().optional(),
		BillEmail: emailaddressSchema.optional(),
		Id: z.string(),
	})
	.strict();

const customerbalancequerySchema = z
	.object({
		customer: z.string().optional(),
		accounting_method: z.string().optional(),
		date_macro: z.string().optional(),
		arpaid: z.string().optional(),
		report_date: z.string().optional(),
		sort_order: z.string().optional(),
		summarize_column_by: z.string().optional(),
		department: z.string().optional(),
	})
	.strict();

const generalledgerqueryFRSchema = z
	.object({
		customer: z.string().optional(),
		account: z.string().optional(),
		accounting_method: z.string().optional(),
		source_account: z.string().optional(),
		end_date: z.string().optional(),
		date_macro: z.string().optional(),
		account_type: z.string().optional(),
		sort_by: z.string().optional(),
		sort_order: z.string().optional(),
		start_date: z.string().optional(),
		summarize_column_by: z.string().optional(),
		department: z.string().optional(),
		vendor: z.string().optional(),
		class: z.string().optional(),
	})
	.strict();

const paymentrequestSchema = z
	.object({
		TotalAmt: z.number(),
		ProjectRef: referencetypeSchema.optional(),
		CustomerRef: referencetypeSchema,
		CurrencyRef: currencyrefSchema.optional(),
		// Payment inherits Transaction.Line; the v75 XSD permits LinkedTxn allocations.
		Line: z.array(linelinkedtxnSchema).optional(),
	})
	.strict();

const itemgrouplineSchema = z
	.object({
		Qty: z.string().optional(),
		ItemRef: itemreftypeSchema.optional(),
	})
	.strict();

const itemgroupdetailSchema = z
	.object({
		ItemGroupLine: z.array(itemgrouplineSchema).optional(),
	})
	.strict();

const companyinforesponseSchema = z
	.object({
		SyncToken: z.string().optional(),
		LegalAddr: physicaladdressSchema.optional(),
		SupportedLanguages: z.string().optional(),
		CompanyName: z.string().optional(),
		Country: z.string().optional(),
		CompanyAddr: physicaladdressSchema.optional(),
		Email: emailaddressSchema.optional(),
		WebAddr: websiteaddressSchema.optional(),
		NameValue: z.array(namevalueSchema).optional(),
		FiscalYearStartMonth: z
			.enum([
				'January',
				'February',
				'March',
				'April',
				'May',
				'June',
				'July',
				'August',
				'September',
				'October',
				'November',
				'December',
			])
			.optional(),
		CustomerCommunicationAddr: physicaladdressSchema.optional(),
		PrimaryPhone: telephonenumberSchema.optional(),
		LegalName: z.string().optional(),
		CompanyStartDate: z.string().optional(),
		EmployerId: z.string().optional(),
		Id: z.string(),
		MetaData: modificationmetadataSchema.optional(),
	})
	.strict();

const billpaymentrequestSchema = z
	.object({
		VendorRef: referencetypeSchema,
		CurrencyRef: currencyrefSchema.optional(),
		TotalAmt: z.number(),
		Line: z.array(linelinkedtxnSchema),
		PayType: z.enum(['Check', 'CreditCard']),
		CreditCardPayment: billpaymentcreditcardSchema.optional(),
		CheckPayment: billpaymentcheckSchema.optional(),
	})
	.strict();

const timeactivityresponseSchema = z
	.object({
		TxnDate: z.string().optional(),
		NameOf: z.string(),
		ClassRef: referencetypeSchema.optional(),
		'BreakHours BreakMinutes': z.number().int().optional(),
		EndTime: z.string().optional(),
		Description: z.string().optional(),
		Hours: z.number().int().optional(),
		Taxable: z.boolean().optional(),
		MetaData: modificationmetadataSchema.optional(),
		VendorRef: referencetypeSchema.optional(),
		CostRate: z.number().optional(),
		ItemRef: referencetypeSchema.optional(),
		ProjectRef: referencetypeSchema.optional(),
		PayrollItemRef: referencetypeSchema.optional(),
		BillableStatus: z
			.enum(['Billable', 'NotBillable', 'HasBeenBilled'])
			.optional(),
		HourlyRate: z.number().optional(),
		CustomerRef: referencetypeSchema.optional(),
		SyncToken: z.string().optional(),
		EmployeeRef: referencetypeSchema.optional(),
		DepartmentRef: referencetypeSchema.optional(),
		StartTime: z.string().optional(),
		Id: z.string(),
	})
	.strict();

const itemrequestSchema = z
	.object({
		QtyOnHand: z.number().optional(),
		Name: z.string(),
		Type: z.string().optional(),
		IncomeAccountRef: referencetypeSchema.optional(),
		AssetAccountRef: referencetypeSchema.optional(),
		InvStartDate: z.string().optional(),
		CustomExtensions: customextensionsSchema.optional(),
		ExpenseAccountRef: referencetypeSchema.optional(),
	})
	.strict();

const accountlistquerySchema = z
	.object({
		account_type: z.string().optional(),
		end_date: z.string().optional(),
		start_moddate: z.string().optional(),
		sort_by: z.string().optional(),
		sort_order: z.string().optional(),
		moddate_macro: z.string().optional(),
		end_moddate: z.string().optional(),
		account_status: z.string().optional(),
		createdate_macro: z.string().optional(),
		start_date: z.string().optional(),
		columns: z.string().optional(),
	})
	.strict();

const budgetresponseSchema = z
	.object({
		SyncToken: z.string().optional(),
		BudgetEntryType: z.enum(['Yearly', 'Quarterly', 'Monthly']).optional(),
		EndDate: z.string(),
		Name: z.string().optional(),
		BudgetDetail: z.array(budgetdetailSchema).optional(),
		StartDate: z.string(),
		BudgetType: z.enum(['ProfitAndLoss', 'BalanceSheet']).optional(),
		CustomExtensions: customextensionsSchema.optional(),
		Active: z.boolean().optional(),
		Id: z.string(),
		MetaData: modificationmetadataSchema.optional(),
	})
	.strict();

const depositrequestSchema = z
	.object({
		ExchangeRate: z.number().optional(),
		CurrencyRef: currencyrefSchema.optional(),
		DepositToAccountRef: referencetypeSchema.optional(),
		Line: z.array(depositlineSchema).optional(),
	})
	.strict();

const profitandlossquerySchema = z
	.object({
		customer: z.string().optional(),
		qzurl: z.string().optional(),
		accounting_method: z.string().optional(),
		end_date: z.string().optional(),
		date_macro: z.string().optional(),
		adjusted_gain_loss: z.string().optional(),
		class: z.string().optional(),
		item: z.string().optional(),
		sort_order: z.string().optional(),
		summarize_column_by: z.string().optional(),
		department: z.string().optional(),
		vendor: z.string().optional(),
		start_date: z.string().optional(),
	})
	.strict();

const employeerequestSchema = z
	.object({
		GivenName: z.string().optional(),
		PrimaryAddr: physicaladdressSchema.optional(),
		FamilyName: z.string().optional(),
	})
	.strict();

const inventoryadjustmentresponseSchema = z
	.object({
		DocNumber: z.string().optional(),
		TxnDate: z.string(),
		PrivateNote: z.string().optional(),
		SyncToken: z.string().optional(),
		Line: z.array(itemadjustmentlineSchema),
		AdjustAccountRef: referencetypeSchema,
		Id: z.string(),
		MetaData: modificationmetadataSchema.optional(),
	})
	.strict();

const classrequestSchema = z
	.object({
		Name: z.string(),
		ParentRef: referencetypeSchema.optional(),
	})
	.strict();

const profitandlossdetailquerySchema = z
	.object({
		customer: z.string().optional(),
		account: z.string().optional(),
		accounting_method: z.string().optional(),
		end_date: z.string().optional(),
		date_macro: z.string().optional(),
		adjusted_gain_loss: z.string().optional(),
		class: z.string().optional(),
		sort_by: z.string().optional(),
		payment_method: z.string().optional(),
		sort_order: z.string().optional(),
		employee: z.string().optional(),
		department: z.string().optional(),
		vendor: z.string().optional(),
		account_type: z.string().optional(),
		start_date: z.string().optional(),
		columns: z.string().optional(),
	})
	.strict();

const estimateresponseSchema = z
	.object({
		TxnDate: z.string().optional(),
		ShipFromAddr: physicaladdressSchema.optional(),
		CurrencyRef: currencyrefSchema.optional(),
		ShipDate: z.string().optional(),
		ClassRef: referencetypeSchema.optional(),
		PrintStatus: z.string().optional(),
		CustomField: customfieldSchema.optional(),
		SalesTermRef: referencetypeSchema.optional(),
		TxnStatus: z.string().optional(),
		LinkedTxn: z.array(linkedtxnSchema).optional(),
		GlobalTaxCalculation: z
			.enum(['TaxInclusive', 'TaxExcluded', 'NotApplicable'])
			.optional(),
		TotalAmt: z.number().optional(),
		AcceptedDate: z.string().optional(),
		ExpirationDate: z.string().optional(),
		DueDate: z.string().optional(),
		MetaData: modificationmetadataSchema.optional(),
		DocNumber: z.string().optional(),
		PrivateNote: z.string().optional(),
		RecurDataRef: referencetypeSchema.optional(),
		Line: z.array(salesitemlineSchema).optional(),
		CustomerMemo: memorefSchema.optional(),
		EmailStatus: z.string().optional(),
		ProjectRef: referencetypeSchema.optional(),
		TaxExemptionRef: referencetypeSchema.optional(),
		CustomerRef: referencetypeSchema,
		TxnTaxDetail: txntaxdetailSchema.optional(),
		SyncToken: z.string().optional(),
		AcceptedBy: z.string().optional(),
		ExchangeRate: z.number().optional(),
		ShipAddr: physicaladdressSchema.optional(),
		HomeTotalAmt: z.number().optional(),
		DepartmentRef: referencetypeSchema.optional(),
		ShipMethodRef: referencetypeSchema.optional(),
		BillAddr: physicaladdressSchema.optional(),
		FreeFormAddress: z.boolean().optional(),
		ApplyTaxAfterDiscount: z.boolean().optional(),
		BillEmail: emailaddressSchema.optional(),
		Id: z.string(),
	})
	.strict();

const purchaseresponseSchema = z
	.object({
		TxnDate: z.string().optional(),
		CurrencyRef: currencyrefSchema.optional(),
		PrintStatus: z.string().optional(),
		RemitToAddr: physicaladdressSchema.optional(),
		TxnSource: z.string().optional(),
		LinkedTxn: z.array(linkedtxnSchema).optional(),
		GlobalTaxCalculation: z
			.enum(['TaxInclusive', 'TaxExcluded', 'NotApplicable'])
			.optional(),
		TotalAmt: z.number().optional(),
		MetaData: modificationmetadataSchema.optional(),
		DocNumber: z.string().optional(),
		PrivateNote: z.string().optional(),
		RecurDataRef: referencetypeSchema.optional(),
		Line: z.array(
			z.union([itembasedexpenselineSchema, accountbasedexpenselineSchema]),
		),
		Credit: z.boolean().optional(),
		TxnTaxDetail: txntaxdetailSchema.optional(),
		SyncToken: z.string().optional(),
		PaymentMethodRef: referencetypeSchema.optional(),
		PurchaseEx: providerDefinedObjectSchema.optional(),
		ExchangeRate: z.number().optional(),
		DepartmentRef: referencetypeSchema.optional(),
		PaymentType: z.string(),
		EntityRef: referencetypeSchema.optional(),
		IncludeInAnnualTPAR: z.boolean().optional(),
		AccountRef: referencetypeSchema,
		Id: z.string(),
	})
	.strict();

const agedpayabledetailquerySchema = z
	.object({
		shipvia: z.string().optional(),
		term: z.string().optional(),
		end_duedate: z.string().optional(),
		accounting_method: z.string().optional(),
		start_duedate: z.string().optional(),
		custom1: z.string().optional(),
		custom2: z.string().optional(),
		custom3: z.string().optional(),
		report_date: z.string().optional(),
		num_periods: z.number().int().optional(),
		vendor: z.string().optional(),
		past_due: z.number().int().optional(),
		aging_period: z.number().optional(),
		columns: z.string().optional(),
	})
	.strict();

const itemsalesquerySchema = z
	.object({
		customer: z.string().optional(),
		end_duedate: z.string().optional(),
		accounting_method: z.string().optional(),
		end_date: z.string().optional(),
		date_macro: z.string().optional(),
		start_duedate: z.string().optional(),
		class: z.string().optional(),
		item: z.string().optional(),
		sort_order: z.string().optional(),
		summarize_column_by: z.string().optional(),
		department: z.string().optional(),
		start_date: z.string().optional(),
	})
	.strict();

const bundleresponseSchema = z
	.object({
		Sku: z.string().optional(),
		SyncToken: z.string().optional(),
		Name: z.string(),
		FullyQualifiedName: z.string().optional(),
		Type: z.string().optional(),
		PurchaseCost: z.number().optional(),
		Active: z.boolean().optional(),
		ItemGroupDetail: itemgroupdetailSchema.optional(),
		Taxable: z.boolean().optional(),
		Description: z.string().optional(),
		PrintGroupedItems: z.boolean().optional(),
		UnitPrice: z.number().optional(),
		Id: z.string(),
		MetaData: modificationmetadataSchema.optional(),
	})
	.strict();

const paymentresponseSchema = z
	.object({
		SyncToken: z.string().optional(),
		PrivateNote: z.string().optional(),
		PaymentMethodRef: referencetypeSchema.optional(),
		UnappliedAmt: z.number().optional(),
		DepositToAccountRef: referencetypeSchema.optional(),
		CurrencyRef: currencyrefSchema.optional(),
		TotalAmt: z.number(),
		ExchangeRate: z.number().optional(),
		Line: z.array(linelinkedtxnSchema).optional(),
		ProjectRef: referencetypeSchema.optional(),
		TxnSource: z.string().optional(),
		PaymentRefNum: z.string().optional(),
		TxnDate: z.string().optional(),
		CreditCardPayment: creditcardpaymentSchema.optional(),
		TaxExemptionRef: referencetypeSchema.optional(),
		CustomerRef: referencetypeSchema,
		Id: z.string(),
		MetaData: modificationmetadataSchema.optional(),
	})
	.strict();

const reimbursechargeresponseSchema = z
	.object({
		SyncToken: z.string().optional(),
		PrivateNote: z.string().optional(),
		LinkedTxn: z.array(linkedtxnSchema).optional(),
		HasBeenInvoiced: z.boolean().optional(),
		CurrencyRef: currencyrefSchema.optional(),
		ExchangeRate: z.number().optional(),
		Line: z.array(reimbursechargelineSchema),
		HomeTotalAmt: z.number().optional(),
		Amount: z.number(),
		CustomerRef: referencetypeSchema,
		Id: z.string(),
		MetaData: modificationmetadataSchema.optional(),
	})
	.strict();

const reporttoplevelSchema = z
	.object({
		Header: reportheaderSchema.optional(),
		Rows: reportRowsSchema.optional(),
		Columns: reportcolumnsSchema.optional(),
	})
	.strict();

const accountresponseSchema = z
	.object({
		SyncToken: z.string().optional(),
		SubAccount: z.boolean().optional(),
		Classification: z.string().optional(),
		FullyQualifiedName: z.string().optional(),
		AccountType: z
			.enum([
				'Bank',
				'Accounts Receivable',
				'Other Current Asset',
				'Fixed Asset',
				'Other Asset',
				'Accounts Payable',
				'Credit Card',
				'Other Current Liability',
				'Long Term Liability',
				'Equity',
				'Income',
				'Cost of Goods Sold',
				'Expense',
				'Other Income',
				'Other Expense',
				'Non-Posting',
			])
			.optional(),
		CurrencyRef: currencyrefSchema.optional(),
		CurrentBalanceWithSubAccounts: z.number().optional(),
		AcctNum: z.string().optional(),
		TaxCodeRef: referencetypeSchema.optional(),
		ParentRef: referencetypeSchema.optional(),
		AccountSubType: z.string().optional(),
		CurrentBalance: z.number().optional(),
		Description: z.string().optional(),
		Active: z.boolean().optional(),
		MetaData: modificationmetadataSchema.optional(),
		Id: z.string(),
		Name: z.string(),
	})
	.strict();

const balancesheetquerySchema = z
	.object({
		customer: z.string().optional(),
		qzurl: z.string().optional(),
		accounting_method: z.string().optional(),
		end_date: z.string().optional(),
		date_macro: z.string().optional(),
		adjusted_gain_loss: z.string().optional(),
		class: z.string().optional(),
		item: z.string().optional(),
		sort_order: z.string().optional(),
		summarize_column_by: z.string().optional(),
		department: z.string().optional(),
		vendor: z.string().optional(),
		start_date: z.string().optional(),
	})
	.strict();

const employeeresponseSchema = z
	.object({
		PrimaryEmailAddr: emailaddressSchema.optional(),
		DisplayName: z.string().optional(),
		Title: z.string().optional(),
		BillableTime: z.boolean().optional(),
		GivenName: z.string().optional(),
		V4IDPseudonym: z.string().optional(),
		BirthDate: z.string().optional(),
		MiddleName: z.string().optional(),
		SSN: z.string().optional(),
		PrimaryAddr: physicaladdressSchema.optional(),
		PrimaryPhone: telephonenumberSchema.optional(),
		Active: z.boolean().optional(),
		ReleasedDate: z.string().optional(),
		MetaData: modificationmetadataSchema.optional(),
		CostRate: z.number().optional(),
		Mobile: telephonenumberSchema.optional(),
		Gender: z.string().optional(),
		HiredDate: z.string().optional(),
		BillRate: z.number().optional(),
		Organization: z.boolean().optional(),
		SyncToken: z.string().optional(),
		Suffix: z.string().optional(),
		FamilyName: z.string().optional(),
		PrintOnCheckName: z.string().optional(),
		EmployeeNumber: z.string().optional(),
		Id: z.string(),
	})
	.strict();

const customerincomequerySchema = z
	.object({
		customer: z.string().optional(),
		term: z.string().optional(),
		accounting_method: z.string().optional(),
		end_date: z.string().optional(),
		date_macro: z.string().optional(),
		class: z.string().optional(),
		sort_order: z.string().optional(),
		summarize_column_by: z.string().optional(),
		department: z.string().optional(),
		vendor: z.string().optional(),
		start_date: z.string().optional(),
	})
	.strict();

const recurringtransactionresponseSchema = z
	.object({
		SyncToken: z.string().optional(),
		RecurringInfo: recurringinfoSchema,
		RecurDataRef: referencetypeSchema.optional(),
		Type: z.string().optional(),
		Id: z.string(),
		MetaData: modificationmetadataSchema.optional(),
	})
	.strict();

const journalentryrequestSchema = z
	.object({
		CurrencyRef: currencyrefSchema.optional(),
		Line: z.array(journalentrylineSchema),
	})
	.strict();

const itemresponseSchema = z
	.object({
		Sku: z.string().optional(),
		SalesTaxIncluded: z.boolean().optional(),
		TrackQtyOnHand: z.boolean().optional(),
		SalesTaxCodeRef: referencetypeSchema.optional(),
		CustomExtensions: customextensionsSchema.optional(),
		Source: z.string().optional(),
		InvStartDate: z.string().optional(),
		Type: z.string().optional(),
		PurchaseTaxIncluded: z.boolean().optional(),
		FullyQualifiedName: z.string().optional(),
		Description: z.string().optional(),
		SubItem: z.boolean().optional(),
		Taxable: z.boolean().optional(),
		ReorderPoint: z.number().optional(),
		PurchaseDesc: z.string().optional(),
		MetaData: modificationmetadataSchema.optional(),
		PrefVendorRef: referencetypeSchema.optional(),
		Name: z.string(),
		Level: z.number().int().optional(),
		IncomeAccountRef: referencetypeSchema.optional(),
		Active: z.boolean().optional(),
		ClassRef: referencetypeSchema.optional(),
		ExpenseAccountRef: referencetypeSchema.optional(),
		TaxClassificationRef: referencetypeSchema.optional(),
		PurchaseTaxCodeRef: referencetypeSchema.optional(),
		SyncToken: z.string().optional(),
		PurchaseCost: z.number().optional(),
		QtyOnHand: z.number().optional(),
		AssetAccountRef: referencetypeSchema.optional(),
		ParentRef: referencetypeSchema.optional(),
		UnitPrice: z.number().optional(),
		Id: z.string(),
	})
	.strict();

const billresponseSchema = z
	.object({
		TxnDate: z.string().optional(),
		CurrencyRef: currencyrefSchema.optional(),
		APAccountRef: referencetypeSchema.optional(),
		HomeBalance: z.number().optional(),
		SalesTermRef: referencetypeSchema.optional(),
		LinkedTxn: z.array(linkedtxnSchema).optional(),
		GlobalTaxCalculation: z
			.enum(['TaxInclusive', 'TaxExcluded', 'NotApplicable'])
			.optional(),
		TotalAmt: z.number().optional(),
		DueDate: z.string().optional(),
		MetaData: modificationmetadataSchema.optional(),
		DocNumber: z.string().optional(),
		PrivateNote: z.string().optional(),
		VendorRef: referencetypeSchema,
		RecurDataRef: referencetypeSchema.optional(),
		Line: z.array(
			z.union([
				itembasedexpenselinebillSchema,
				accountbasedexpenselinebillSchema,
			]),
		),
		Balance: z.number().optional(),
		TxnTaxDetail: txntaxdetailSchema.optional(),
		SyncToken: z.string().optional(),
		ExchangeRate: z.number().optional(),
		DepartmentRef: referencetypeSchema.optional(),
		IncludeInAnnualTPAR: z.boolean().optional(),
		Id: z.string(),
	})
	.strict();

const categoryupdaterequestSchema = z
	.object({
		SyncToken: z.string().optional(),
		Name: z.string(),
		Level: z.number().int().optional(),
		FullyQualifiedName: z.string().optional(),
		SubItem: z.boolean().optional(),
		ParentRef: referencetypeSchema.optional(),
		Active: z.boolean().optional(),
		Type: z.string(),
		Id: z.string(),
		MetaData: modificationmetadataSchema.optional(),
	})
	.strict();

const vendorrequestSchema = z
	.object({
		DisplayName: z.string().optional(),
		Suffix: z.string().optional(),
		Title: z.string().optional(),
		MiddleName: z.string().optional(),
		FamilyName: z.string().optional(),
		GivenName: z.string().optional(),
	})
	.strict();

const journalreportquerySchema = z
	.object({
		journal_code: z.string().optional(),
		end_date: z.string().optional(),
		date_macro: z.string().optional(),
		sort_by: z.string().optional(),
		sort_order: z.string().optional(),
		start_date: z.string().optional(),
		columns: z.string().optional(),
	})
	.strict();

const salesreceiptrequestSchema = z
	.object({
		CurrencyRef: currencyrefSchema.optional(),
		ProjectRef: referencetypeSchema.optional(),
		Line: z.array(salesitemlineSchema),
	})
	.strict();

const invoiceresponseSchema = z
	.object({
		TxnDate: z.string().optional(),
		ShipFromAddr: physicaladdressSchema.optional(),
		CurrencyRef: currencyrefSchema.optional(),
		HomeBalance: z.number().optional(),
		ShipDate: z.string().optional(),
		TrackingNum: z.string().optional(),
		ClassRef: referencetypeSchema.optional(),
		PrintStatus: z.string().optional(),
		EmailStatus: z.string().optional(),
		SalesTermRef: referencetypeSchema.optional(),
		DeliveryInfo: deliveryinfoSchema.optional(),
		TxnSource: z.string().optional(),
		LinkedTxn: z.array(linkedtxnSchema).optional(),
		DepositToAccountRef: referencetypeSchema.optional(),
		GlobalTaxCalculation: z
			.enum(['TaxInclusive', 'TaxExcluded', 'NotApplicable'])
			.optional(),
		TotalAmt: z.number().optional(),
		AllowOnlineAffirmPayment: z.boolean().optional(),
		InvoiceLink: z.string().optional(),
		AllowOnlineACHPayment: z.boolean().optional(),
		TransactionLocationType: z.string().optional(),
		DueDate: z.string().optional(),
		MetaData: modificationmetadataSchema.optional(),
		DocNumber: z.string().optional(),
		PrivateNote: z.string().optional(),
		RecurDataRef: referencetypeSchema.optional(),
		Line: z.array(salesitemlineSchema),
		BillEmailCc: emailaddressSchema.optional(),
		CustomerMemo: memorefSchema.optional(),
		AllowOnlinePayPalPayment: z.boolean().optional(),
		ProjectRef: referencetypeSchema.optional(),
		ExchangeRate: z.number().optional(),
		TaxExemptionRef: referencetypeSchema.optional(),
		Deposit: z.number().optional(),
		Balance: z.number().optional(),
		CustomerRef: referencetypeSchema,
		TxnTaxDetail: txntaxdetailSchema.optional(),
		AllowOnlineCreditCardPayment: z.boolean().optional(),
		SyncToken: z.string().optional(),
		CustomField: customfieldSchema.optional(),
		ShipAddr: physicaladdressSchema.optional(),
		HomeTotalAmt: z.number().optional(),
		DepartmentRef: referencetypeSchema.optional(),
		BillEmailBcc: emailaddressSchema.optional(),
		ShipMethodRef: referencetypeSchema.optional(),
		BillAddr: physicaladdressSchema.optional(),
		FreeFormAddress: z.boolean().optional(),
		ApplyTaxAfterDiscount: z.boolean().optional(),
		BillEmail: emailaddressSchema.optional(),
		Id: z.string(),
		AllowOnlinePayment: z.boolean().optional(),
		AllowIPNPayment: z.boolean().optional(),
	})
	.strict();

const depositresponseSchema = z
	.object({
		SyncToken: z.string().optional(),
		PrivateNote: z.string().optional(),
		RecurDataRef: referencetypeSchema.optional(),
		DepositToAccountRef: referencetypeSchema,
		GlobalTaxCalculation: z
			.enum(['TaxInclusive', 'TaxExcluded', 'NotApplicable'])
			.optional(),
		TotalAmt: z.number().optional(),
		ExchangeRate: z.number().optional(),
		CurrencyRef: currencyrefSchema.optional(),
		HomeTotalAmt: z.number().optional(),
		DepartmentRef: referencetypeSchema.optional(),
		TxnSource: z.string().optional(),
		TxnDate: z.string().optional(),
		Line: z.array(z.union([linelinkedtxnSchema, depositlineSchema])),
		CashBack: cashbackinfoSchema.optional(),
		Id: z.string(),
		TxnTaxDetail: txntaxdetailSchema.optional(),
		MetaData: modificationmetadataSchema.optional(),
	})
	.strict();

const exchangerateresponseSchema = z
	.object({
		SyncToken: z.string().optional(),
		AsOfDate: z.string().optional(),
		CustomField: customfieldSchema.optional(),
		SourceCurrencyCode: z.string().optional(),
		Rate: z.number().optional(),
		TargetCurrencyCode: z.string().optional(),
		MetaData: modificationmetadataSchema.optional(),
	})
	.strict();

const pcesalesitemlineSchema = z
	.object({
		Description: z.string().optional(),
		DetailType: z.enum([
			'PaymentLineDetail',
			'DiscountLineDetail',
			'TaxLineDetail',
			'SalesItemLineDetail',
			'ItemBasedExpenseLineDetail',
			'AccountBasedExpenseLineDetail',
			'DepositLineDetail',
			'PurchaseOrderItemLineDetail',
			'ItemReceiptLineDetail',
			'JournalEntryLineDetail',
			'GroupLineDetail',
			'DescriptionOnly',
			'SubTotalLineDetail',
			'SalesOrderItemLineDetail',
			'TDSLineDetail',
			'ReimburseLineDetail',
			'ItemAdjustmentLineDetail',
		]),
		SalesItemLineDetail: salesitemlinedetailSchema,
		LineNum: z.number().optional(),
		Amount: z.number(),
		CostAmount: z.number(),
		HomeCostAmount: z.number(),
		Id: z.string(),
	})
	.strict();

const purchaseorderresponseSchema = z
	.object({
		TxnDate: z.string().optional(),
		CurrencyRef: currencyrefSchema.optional(),
		CustomField: customfieldSchema.optional(),
		APAccountRef: referencetypeSchema,
		POEmail: emailaddressSchema.optional(),
		ClassRef: referencetypeSchema.optional(),
		SalesTermRef: referencetypeSchema.optional(),
		LinkedTxn: z.array(linkedtxnSchema).optional(),
		GlobalTaxCalculation: z
			.enum(['TaxInclusive', 'TaxExcluded', 'NotApplicable'])
			.optional(),
		TotalAmt: z.number().optional(),
		Memo: z.string().optional(),
		POStatus: z.string().optional(),
		DueDate: z.string().optional(),
		MetaData: modificationmetadataSchema.optional(),
		DocNumber: z.string().optional(),
		PrivateNote: z.string().optional(),
		VendorRef: referencetypeSchema,
		ShipMethodRef: referencetypeSchema.optional(),
		RecurDataRef: referencetypeSchema.optional(),
		Line: z.array(itembasedexpenselineSchema),
		TxnTaxDetail: txntaxdetailSchema.optional(),
		SyncToken: z.string().optional(),
		ShipTo: referencetypeSchema.optional(),
		ExchangeRate: z.number().optional(),
		ShipAddr: physicaladdressSchema.optional(),
		VendorAddr: physicaladdressSchema.optional(),
		EmailStatus: z.string().optional(),
		Id: z.string(),
	})
	.strict();

const vendorbalancedetailquerySchema = z
	.object({
		term: z.string().optional(),
		end_duedate: z.string().optional(),
		accounting_method: z.string().optional(),
		date_macro: z.string().optional(),
		start_duedate: z.string().optional(),
		duedate_macro: z.string().optional(),
		sort_by: z.string().optional(),
		report_date: z.string().optional(),
		sort_order: z.string().optional(),
		appaid: z.string().optional(),
		department: z.string().optional(),
		vendor: z.string().optional(),
		columns: z.string().optional(),
	})
	.strict();

const vendorcreditrequestSchema = z
	.object({
		CurrencyRef: currencyrefSchema.optional(),
		VendorRef: referencetypeSchema,
		Line: z.array(itembasedexpenselineSchema),
	})
	.strict();

const transactionlistbycustomerquerySchema = z
	.object({
		date_macro: z.string().optional(),
		payment_method: z.string().optional(),
		duedate_macro: z.string().optional(),
		arpaid: z.string().optional(),
		bothamount: z.string().optional(),
		transaction_type: z.string().optional(),
		docnum: z.string().optional(),
		start_moddate: z.string().optional(),
		source_account_type: z.string().optional(),
		group_by: z.string().optional(),
		start_date: z.string().optional(),
		department: z.string().optional(),
		start_duedate: z.string().optional(),
		columns: z.string().optional(),
		end_duedate: z.string().optional(),
		end_date: z.string().optional(),
		memo: z.string().optional(),
		appaid: z.string().optional(),
		moddate_macro: z.string().optional(),
		printed: z.string().optional(),
		createdate_macro: z.string().optional(),
		cleared: z.string().optional(),
		customer: z.string().optional(),
		qzurl: z.string().optional(),
		term: z.string().optional(),
		end_createdate: z.string().optional(),
		name: z.string().optional(),
		sort_by: z.string().optional(),
		sort_order: z.string().optional(),
		start_createdate: z.string().optional(),
		end_moddate: z.string().optional(),
	})
	.strict();

const balancesheetreportrowsSchema = z
	.object({
		Row: z.array(reportRowSchema).optional(),
	})
	.strict();

const classsalesquerySchema = z
	.object({
		customer: z.string().optional(),
		accounting_method: z.string().optional(),
		end_date: z.string().optional(),
		date_macro: z.string().optional(),
		class: z.string().optional(),
		item: z.string().optional(),
		summarize_column_by: z.string().optional(),
		department: z.string().optional(),
		start_date: z.string().optional(),
	})
	.strict();

const paymentmethodresponseSchema = z
	.object({
		SyncToken: z.string().optional(),
		Name: z.string(),
		Active: z.boolean().optional(),
		Type: z.string().optional(),
		Id: z.string(),
		MetaData: modificationmetadataSchema.optional(),
	})
	.strict();

const changeorderresponseSchema = z
	.object({
		TxnDate: z.string().optional(),
		PrintStatus: z.string().optional(),
		TxnStatus: z.string().optional(),
		LinkedTxn: z.array(linkedtxnSchema),
		TotalAmt: z.number().optional(),
		AcceptedDate: z.string().optional(),
		ExpirationDate: z.string().optional(),
		ApplyTaxAfterDiscount: z.boolean().optional(),
		DocNumber: z.string().optional(),
		PrivateNote: z.string().optional(),
		Line: z.array(salesitemlineSchema),
		CustomerMemo: memorefSchema.optional(),
		ProjectRef: referencetypeSchema,
		CustomerRef: referencetypeSchema,
		TxnTaxDetail: txntaxdetailSchema.optional(),
		SyncToken: z.string().optional(),
		AcceptedBy: z.string().optional(),
		TotalCostAmount: z.number().optional(),
		EmailStatus: z.string().optional(),
		MetaData: modificationmetadataSchema.optional(),
		BillEmail: emailaddressSchema.optional(),
		Id: z.string(),
	})
	.strict();

const invoicerequestSchema = z
	.object({
		ProjectRef: referencetypeSchema.optional(),
		CurrencyRef: currencyrefSchema.optional(),
		CustomerRef: referencetypeSchema,
		Line: z.array(salesitemlineSchema),
	})
	.strict();

const recurringtransactionrequestSchema = z
	.object({
		RecurringInfo: recurringinfoSchema,
	})
	.strict();

const taxsummaryquerySchema = z
	.object({
		accounting_method: z.string().optional(),
		end_date: z.string().optional(),
		date_macro: z.string().optional(),
		agency_id: z.string(),
		sort_order: z.string().optional(),
		start_date: z.string().optional(),
	})
	.strict();

const taxclassificationSchema = z
	.object({
		ApplicableTo: z
			.enum([
				'Assembly',
				'Category',
				'Fixed Asset',
				'Group',
				'Inventory',
				'NonInventory',
				'Other Charge',
				'Payment',
				'Service',
				'Subtotal',
				'Discount',
				'Tax',
				'Tax Group',
				'Bundle',
			])
			.optional(),
		Code: z.string().optional(),
		Name: z.string().optional(),
		Level: z.string().optional(),
		ParentRef: referencetypeSchema,
		Description: z.string().optional(),
	})
	.strict();

const journalreportqueryUSSchema = z
	.object({
		end_date: z.string().optional(),
		date_macro: z.string().optional(),
		sort_by: z.string().optional(),
		sort_order: z.string().optional(),
		start_date: z.string().optional(),
		columns: z.string().optional(),
	})
	.strict();

const salesreceiptresponseSchema = z
	.object({
		TxnDate: z.string().optional(),
		ShipFromAddr: physicaladdressSchema.optional(),
		CurrencyRef: currencyrefSchema.optional(),
		CustomField: customfieldSchema.optional(),
		HomeBalance: z.number().optional(),
		ShipDate: z.string().optional(),
		TrackingNum: z.string().optional(),
		ClassRef: referencetypeSchema.optional(),
		PrintStatus: z.string().optional(),
		PaymentRefNum: z.string().optional(),
		DeliveryInfo: deliveryinfoSchema.optional(),
		TxnSource: z.string().optional(),
		LinkedTxn: z.array(linkedtxnSchema).optional(),
		RecurDataRef: referencetypeSchema.optional(),
		GlobalTaxCalculation: z
			.enum(['TaxInclusive', 'TaxExcluded', 'NotApplicable'])
			.optional(),
		TotalAmt: z.number().optional(),
		ApplyTaxAfterDiscount: z.boolean().optional(),
		DocNumber: z.string().optional(),
		PrivateNote: z.string().optional(),
		DepositToAccountRef: referencetypeSchema.optional(),
		Line: z.array(salesitemlineSchema),
		CustomerMemo: memorefSchema.optional(),
		EmailStatus: z.string().optional(),
		ProjectRef: referencetypeSchema.optional(),
		CreditCardPayment: creditcardpaymentSchema.optional(),
		Balance: z.number().optional(),
		CustomerRef: referencetypeSchema,
		TxnTaxDetail: txntaxdetailSchema.optional(),
		SyncToken: z.string().optional(),
		PaymentMethodRef: referencetypeSchema.optional(),
		ExchangeRate: z.number().optional(),
		ShipAddr: physicaladdressSchema.optional(),
		HomeTotalAmt: z.number().optional(),
		DepartmentRef: referencetypeSchema.optional(),
		ShipMethodRef: referencetypeSchema.optional(),
		BillAddr: physicaladdressSchema.optional(),
		FreeFormAddress: z.boolean().optional(),
		MetaData: modificationmetadataSchema.optional(),
		BillEmail: emailaddressSchema.optional(),
		Id: z.string(),
	})
	.strict();

const customersalesquerySchema = z
	.object({
		customer: z.string().optional(),
		qzurl: z.string().optional(),
		accounting_method: z.string().optional(),
		end_date: z.string().optional(),
		date_macro: z.string().optional(),
		class: z.string().optional(),
		item: z.string().optional(),
		sort_order: z.string().optional(),
		summarize_column_by: z.string().optional(),
		department: z.string().optional(),
		start_date: z.string().optional(),
	})
	.strict();

const estimaterequestSchema = z
	.object({
		ProjectRef: referencetypeSchema.optional(),
		Line: salesitemlineSchema,
		CustomerRef: referencetypeSchema,
		CurrencyRef: currencyrefSchema.optional(),
	})
	.strict();

const changeorderrequestSchema = z
	.object({
		DocNumber: z.string().optional(),
		TxnStatus: z.string().optional(),
		PrivateNote: z.string().optional(),
		TxnDate: z.string().optional(),
		BillEmail: emailaddressSchema.optional(),
		CustomerMemo: memorefSchema.optional(),
		ProjectRef: referencetypeSchema,
		PrintStatus: z.string().optional(),
		ExpirationDate: z.string().optional(),
		Line: salesitemlineSchema,
		CustomerRef: referencetypeSchema,
		EmailStatus: z.string().optional(),
	})
	.strict();

export const QuickBooksModelSchemas = {
	balancesheetreporttoplevel: balancesheetreporttoplevelSchema,
	classresponse: classresponseSchema,
	cashflowquery: cashflowquerySchema,
	transactionlistwithsplitsquery: transactionlistwithsplitsquerySchema,
	cashbackinfo: cashbackinfoSchema,
	itemadjustmentlinedetail: itemadjustmentlinedetailSchema,
	attachablerequest: attachablerequestSchema,
	preferencesresponse: preferencesresponseSchema,
	reimburselinedetail: reimburselinedetailSchema,
	discountlinedetail: discountlinedetailSchema,
	datetime: datetimeSchema,
	profitandlossreporttoplevel: profitandlossreporttoplevelSchema,
	purchaserequest: purchaserequestSchema,
	billrequest: billrequestSchema,
	threshold: thresholdSchema,
	inventoryadjustmentrequest: inventoryadjustmentrequestSchema,
	checkpayment: checkpaymentSchema,
	itembasedexpenselinebill: itembasedexpenselinebillSchema,
	deliveryinfo: deliveryinfoSchema,
	discountoverride: discountoverrideSchema,
	creditmemoresponse: creditmemoresponseSchema,
	trialbalancequery: trialbalancequerySchema,
	inventoryadjustmentcreaterequest: inventoryadjustmentcreaterequestSchema,
	modificationmetadata: modificationmetadataSchema,
	billpaymentcreditcard: billpaymentcreditcardSchema,
	journalentrylinedetail: journalentrylinedetailSchema,
	creditchargeinfo: creditchargeinfoSchema,
	taxpaymentresponse: taxpaymentresponseSchema,
	frenchpcgaccountlist: frenchpcgaccountlistSchema,
	websiteaddress: websiteaddressSchema,
	jobinfo: jobinfoSchema,
	contactinfo: contactinfoSchema,
	journalentryresponse: journalentryresponseSchema,
	associatedvalues: associatedvaluesSchema,
	departmentresponse: departmentresponseSchema,
	customerbalancedetailquery: customerbalancedetailquerySchema,
	customfieldstringpo: customfieldstringpoSchema,
	paymentlinedetail: paymentlinedetailSchema,
	taxlinedetail: taxlinedetailSchema,
	transactionlistreporttoplevel: transactionlistreporttoplevelSchema,
	trialbalancereportrows: trialbalancereportrowsSchema,
	categoryresponse: categoryresponseSchema,
	trialbalancereporttoplevel: trialbalancereporttoplevelSchema,
	transactionlistbyvendorquery: transactionlistbyvendorquerySchema,
	reportprefs: reportprefsSchema,
	reportoption: reportoptionSchema,
	refundreceiptresponse: refundreceiptresponseSchema,
	entity: entitySchema,
	reportheader: reportheaderSchema,
	transactionlistreportheader: transactionlistreportheaderSchema,
	accountbasedexpenselinedetail: accountbasedexpenselinedetailSchema,
	paymentmethodrequest: paymentmethodrequestSchema,
	dataservicesextensions: dataservicesextensionsSchema,
	cashflowtoplevel: cashflowtoplevelSchema,
	vendorresponse: vendorresponseSchema,
	accountrequest: accountrequestSchema,
	accountbasedexpenseline: accountbasedexpenselineSchema,
	servicetypeenum: servicetypeenumSchema,
	taxratedetails: taxratedetailsSchema,
	reportcolumns: reportcolumnsSchema,
	itembasedexpenselinedetail: itembasedexpenselinedetailSchema,
	taxrateresponse: taxrateresponseSchema,
	txntaxdetail: txntaxdetailSchema,
	memoref: memorefSchema,
	telephonenumber: telephonenumberSchema,
	invoicevoidresponse: invoicevoidresponseSchema,
	creditcardpaymentrequest: creditcardpaymentrequestSchema,
	pcesalesitemlinedetail: pcesalesitemlinedetailSchema,
	salesformspref: salesformsprefSchema,
	vendorcreditresponse: vendorcreditresponseSchema,
	budgetrequest: budgetrequestSchema,
	recurringinfo: recurringinfoSchema,
	departmentrequest: departmentrequestSchema,
	billpaymentresponse: billpaymentresponseSchema,
	taxcoderesponse: taxcoderesponseSchema,
	transactionlistquery: transactionlistquerySchema,
	vendorbalancequery: vendorbalancequerySchema,
	purchaseorderrequest: purchaseorderrequestSchema,
	profitandlossdetailstoplevel: profitandlossdetailstoplevelSchema,
	companycurrencyrequest: companycurrencyrequestSchema,
	subtotalline: subtotallineSchema,
	customfieldstringsales: customfieldstringsalesSchema,
	vendorandpurchaseprefs: vendorandpurchaseprefsSchema,
	attachableref: attachablerefSchema,
	effectivetaxratedata: effectivetaxratedataSchema,
	inventoryvaluationdetailquery: inventoryvaluationdetailquerySchema,
	markupinfo: markupinfoSchema,
	linelinkedtxn: linelinkedtxnSchema,
	departmentsalesquery: departmentsalesquerySchema,
	billpaymentcheck: billpaymentcheckSchema,
	creditchargeresponse: creditchargeresponseSchema,
	projectestimateresponse: projectestimateresponseSchema,
	taxagencyrequest: taxagencyrequestSchema,
	companycurrencyresponse: companycurrencyresponseSchema,
	reportsqueryall: reportsqueryallSchema,
	vendorexpensesquery: vendorexpensesquerySchema,
	itemreceiptline: itemreceiptlineSchema,
	customfieldboolpo: customfieldboolpoSchema,
	timetrackingprefs: timetrackingprefsSchema,
	agedpayablesquery: agedpayablesquerySchema,
	attachableresponse: attachableresponseSchema,
	cashflowreportrows: cashflowreportrowsSchema,
	agedpayablestoplevel: agedpayablestoplevelSchema,
	purchaseorderitemline: purchaseorderitemlineSchema,
	descriptiononly: descriptiononlySchema,
	agedreceivablesquery: agedreceivablesquerySchema,
	termrequest: termrequestSchema,
	depositline: depositlineSchema,
	timeactivityrequest: timeactivityrequestSchema,
	creditcardpaymentresponse: creditcardpaymentresponseSchema,
	termresponse: termresponseSchema,
	inventoryvaluationquery: inventoryvaluationquerySchema,
	paymentline: paymentlineSchema,
	customerrequest: customerrequestSchema,
	taxagencyresponse: taxagencyresponseSchema,
	batchrequest: batchrequestSchema,
	customertyperesponse: customertyperesponseSchema,
	itemreftype: itemreftypeSchema,
	generalledgerquery: generalledgerquerySchema,
	depositlinedetail: depositlinedetailSchema,
	profitandlossreportrows: profitandlossreportrowsSchema,
	agedreceivabledetailquery: agedreceivabledetailquerySchema,
	salesitemlinedetail: salesitemlinedetailSchema,
	reimbursechargeline: reimbursechargelineSchema,
	emailmessagetype: emailmessagetypeSchema,
	projectestimaterequest: projectestimaterequestSchema,
	agedreceivablestoplevel: agedreceivablestoplevelSchema,
	taxserviceresponse: taxserviceresponseSchema,
	taxservicerequest: taxservicerequestSchema,
	taxratelist: taxratelistSchema,
	discountline: discountlineSchema,
	agedreceivablesreportrows: agedreceivablesreportrowsSchema,
	categoryrequest: categoryrequestSchema,
	groupline: grouplineSchema,
	transferrequest: transferrequestSchema,
	accountinginfoprefs: accountinginfoprefsSchema,
	customerresponse: customerresponseSchema,
	recurringscheduleinfo: recurringscheduleinfoSchema,
	batchresponse: batchresponseSchema,
	customfieldboolsales: customfieldboolsalesSchema,
	taxprefs: taxprefsSchema,
	creditmemorequest: creditmemorequestSchema,
	inventoryadjustmentdeleterequest: inventoryadjustmentdeleterequestSchema,
	currencyprefs: currencyprefsSchema,
	salesitemline: salesitemlineSchema,
	customextensions: customextensionsSchema,
	deleterequest: deleterequestSchema,
	voidrequest: voidrequestSchema,
	transferresponse: transferresponseSchema,
	refundreceiptrequest: refundreceiptrequestSchema,
	creditmemo: creditmemoSchema,
	customerbalancequery: customerbalancequerySchema,
	generalledgerqueryFR: generalledgerqueryFRSchema,
	paymentrequest: paymentrequestSchema,
	itemgroupdetail: itemgroupdetailSchema,
	companyinforesponse: companyinforesponseSchema,
	emailaddress: emailaddressSchema,
	billpaymentrequest: billpaymentrequestSchema,
	timeactivityresponse: timeactivityresponseSchema,
	itemrequest: itemrequestSchema,
	physicaladdress: physicaladdressSchema,
	accountlistquery: accountlistquerySchema,
	budgetresponse: budgetresponseSchema,
	depositrequest: depositrequestSchema,
	profitandlossquery: profitandlossquerySchema,
	employeerequest: employeerequestSchema,
	itemgroupline: itemgrouplineSchema,
	line: lineSchema,
	inventoryadjustmentresponse: inventoryadjustmentresponseSchema,
	classrequest: classrequestSchema,
	profitandlossdetailquery: profitandlossdetailquerySchema,
	estimateresponse: estimateresponseSchema,
	grouplinedetail: grouplinedetailSchema,
	purchaseresponse: purchaseresponseSchema,
	agedpayabledetailquery: agedpayabledetailquerySchema,
	subtotallinedetail: subtotallinedetailSchema,
	vendorpaymentbankdetail: vendorpaymentbankdetailSchema,
	itemsalesquery: itemsalesquerySchema,
	bundleresponse: bundleresponseSchema,
	paymentresponse: paymentresponseSchema,
	reimbursechargeresponse: reimbursechargeresponseSchema,
	reporttoplevel: reporttoplevelSchema,
	creditcardpayment: creditcardpaymentSchema,
	accountresponse: accountresponseSchema,
	budgetdetail: budgetdetailSchema,
	balancesheetquery: balancesheetquerySchema,
	employeeresponse: employeeresponseSchema,
	customerincomequery: customerincomequerySchema,
	itemadjustmentline: itemadjustmentlineSchema,
	recurringtransactionresponse: recurringtransactionresponseSchema,
	linkedtxnBill: linkedtxnBillSchema,
	journalentryrequest: journalentryrequestSchema,
	currencyref: currencyrefSchema,
	itemresponse: itemresponseSchema,
	journalentryline: journalentrylineSchema,
	purchaseorderitemlinedetail: purchaseorderitemlinedetailSchema,
	billresponse: billresponseSchema,
	categoryupdaterequest: categoryupdaterequestSchema,
	vendorrequest: vendorrequestSchema,
	journalreportquery: journalreportquerySchema,
	salesreceiptrequest: salesreceiptrequestSchema,
	referencetype: referencetypeSchema,
	invoiceresponse: invoiceresponseSchema,
	depositresponse: depositresponseSchema,
	exchangerateresponse: exchangerateresponseSchema,
	pcesalesitemline: pcesalesitemlineSchema,
	purchaseorderresponse: purchaseorderresponseSchema,
	itembasedexpenseline: itembasedexpenselineSchema,
	vendorbalancedetailquery: vendorbalancedetailquerySchema,
	vendorcreditrequest: vendorcreditrequestSchema,
	transactionlistbycustomerquery: transactionlistbycustomerquerySchema,
	balancesheetreportrows: balancesheetreportrowsSchema,
	classsalesquery: classsalesquerySchema,
	paymentmethodresponse: paymentmethodresponseSchema,
	changeorderresponse: changeorderresponseSchema,
	invoicerequest: invoicerequestSchema,
	telephonenumber30: telephonenumber30Schema,
	customfield: customfieldSchema,
	customertyperef: customertyperefSchema,
	productandservicesprefs: productandservicesprefsSchema,
	recurringtransactionrequest: recurringtransactionrequestSchema,
	taxsummaryquery: taxsummaryquerySchema,
	taxclassification: taxclassificationSchema,
	taxline: taxlineSchema,
	agedpayablesreportrows: agedpayablesreportrowsSchema,
	date: dateSchema,
	descriptiononlyline: descriptiononlylineSchema,
	journalreportqueryUS: journalreportqueryUSSchema,
	journalreportqueryus: journalreportqueryUSSchema,
	salesreceiptresponse: salesreceiptresponseSchema,
	customersalesquery: customersalesquerySchema,
	emailmessagesprefs: emailmessagesprefsSchema,
	linkedtxn: linkedtxnSchema,
	estimaterequest: estimaterequestSchema,
	changeorderrequest: changeorderrequestSchema,
	accountbasedexpenselinebill: accountbasedexpenselinebillSchema,
	taxratedetail: taxratedetailSchema,
	reportcolumn: reportcolumnSchema,
	reportrow: reportrowSchema,
	reportrows: reportrowsSchema,
} as const;
