import { z } from 'zod';
import { lazySchema } from './lazy-schema';

// Static QuickBooks Online model schemas generated from Intuit CodesModelsJsonObjects_v2.json and the v75 XSD.
// Primitive enums use values from the official v75 XSD; API payloads remain runtime-validated.
// unknown because Intuit marks these extension payloads as provider-defined and publishes no field contract.
const providerDefinedObjectSchema = lazySchema(() =>
	z.record(z.string(), z.unknown()),
);
const namevalueSchema = lazySchema(() =>
	z
		.object({ Name: z.string().optional(), Value: z.string().optional() })
		.strict(),
);
const reportCellSchema = lazySchema(() =>
	z
		.object({
			id: z.string().optional(),
			value: z.string().optional(),
			href: z.string().optional(),
		})
		.strict(),
);
export type ReportRow = {
	type?: 'Section' | 'Data';
	group?: string;
	ColData?: z.infer<typeof reportCellSchema>[];
	Summary?: ReportRow;
	Rows?: { Row?: ReportRow[] };
	Header?: ReportRow;
};
const reportRowSchema = lazySchema(
	(): z.ZodType<ReportRow> =>
		z.lazy(() =>
			z
				.object({
					type: z.enum(['Section', 'Data']).optional(),
					group: z.string().optional(),
					ColData: z.array(reportCellSchema()).optional(),
					Summary: reportRowSchema().optional(),
					Rows: z
						.object({ Row: z.array(reportRowSchema()).optional() })
						.strict()
						.optional(),
					Header: reportRowSchema().optional(),
				})
				.strict(),
		),
);
const reportRowsSchema = lazySchema(() =>
	z.object({ Row: z.array(reportRowSchema()).optional() }).strict(),
);
const reportrowSchema = lazySchema(() => reportRowSchema());
const reportrowsSchema = lazySchema(() => reportRowsSchema());

const reportoptionSchema = lazySchema(() =>
	z
		.object({
			name: z.string().optional(),
			value: z.string().optional(),
		})
		.strict(),
);

const datetimeSchema = lazySchema(() =>
	z
		.object({
			dateTime: z.string().optional(),
		})
		.strict(),
);

const reportheaderSchema = lazySchema(() =>
	z
		.object({
			Customer: z.string().optional(),
			ReportName: z.string().optional(),
			Vendor: z.string().optional(),
			Option: z.array(namevalueSchema()).optional(),
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
		.strict(),
);

const profitandlossreportrowsSchema = lazySchema(() =>
	z
		.object({
			Row: z.array(reportRowSchema()).optional(),
		})
		.strict(),
);

const reportcolumnSchema = lazySchema(() =>
	z
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
		.strict(),
);

const reportcolumnsSchema = lazySchema(() =>
	z
		.object({
			Column: z.array(reportcolumnSchema()).optional(),
		})
		.strict(),
);

const balancesheetreporttoplevelSchema = lazySchema(() =>
	z
		.object({
			Header: reportheaderSchema().optional(),
			Rows: profitandlossreportrowsSchema().optional(),
			Columns: reportcolumnsSchema().optional(),
		})
		.strict(),
);

const referencetypeSchema = lazySchema(() =>
	z
		.object({
			name: z.string().optional(),
			value: z.string(),
		})
		.strict(),
);

const modificationmetadataSchema = lazySchema(() =>
	z
		.object({
			CreateTime: z.string().optional(),
			LastUpdatedTime: z.string().optional(),
		})
		.strict(),
);

const classresponseSchema = lazySchema(() =>
	z
		.object({
			SyncToken: z.string().optional(),
			Name: z.string(),
			FullyQualifiedName: z.string().optional(),
			SubClass: z.boolean().optional(),
			ParentRef: referencetypeSchema().optional(),
			Active: z.boolean().optional(),
			Id: z.string(),
			MetaData: modificationmetadataSchema().optional(),
		})
		.strict(),
);

const cashflowquerySchema = lazySchema(() =>
	z
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
		.strict(),
);

const transactionlistwithsplitsquerySchema = lazySchema(() =>
	z
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
		.strict(),
);

const cashbackinfoSchema = lazySchema(() =>
	z
		.object({
			AccountRef: referencetypeSchema(),
			Amount: z.string(),
			Memo: z.string().optional(),
		})
		.strict(),
);

const itemadjustmentlinedetailSchema = lazySchema(() =>
	z
		.object({
			QtyDiff: z.number(),
			ItemRef: referencetypeSchema().optional(),
		})
		.strict(),
);

const customfieldSchema = lazySchema(() =>
	z
		.object({
			DefinitionId: z.string(),
			StringValue: z.string().optional(),
			Type: z
				.enum(['StringType', 'BooleanType', 'NumberType', 'DateType'])
				.optional(),
			Name: z.string().optional(),
		})
		.strict(),
);

const attachablerefSchema = lazySchema(() =>
	z
		.object({
			IncludeOnSend: z.boolean().optional(),
			LineInfo: z.string().optional(),
			NoRefOnly: z.boolean().optional(),
			CustomField: z.array(customfieldSchema()).optional(),
			Inactive: z.boolean().optional(),
			// An attachment's EntityRef names the record type it belongs to ({ type: 'Invoice', value: '95' }).
			EntityRef: z
				.object({
					type: z.string().optional(),
					value: z.string(),
					name: z.string().optional(),
				})
				.strict()
				.optional(),
		})
		.strict(),
);

const attachablerequestSchema = lazySchema(() =>
	z
		.object({
			Note: z.string().optional(),
			AttachableRef: z.array(attachablerefSchema()).optional(),
			FileName: z.string().optional(),
		})
		.strict(),
);

const emailmessagetypeSchema = lazySchema(() =>
	z
		.object({
			Message: z.string().optional(),
			Subject: z.string().optional(),
		})
		.strict(),
);

const emailmessagesprefsSchema = lazySchema(() =>
	z
		.object({
			InvoiceMessage: emailmessagetypeSchema().optional(),
			EstimateMessage: emailmessagetypeSchema().optional(),
			SalesReceiptMessage: emailmessagetypeSchema().optional(),
			StatementMessage: emailmessagetypeSchema().optional(),
		})
		.strict(),
);

const productandservicesprefsSchema = lazySchema(() =>
	z
		.object({
			RevenueRecognitionEnabled: z.boolean().optional(),
			RecognitionFrequencyType: z.string().optional(),
			ForSales: z.boolean().optional(),
			QuantityOnHand: z.boolean().optional(),
			QuantityWithPriceAndRate: z.boolean().optional(),
			ForPurchase: z.boolean().optional(),
		})
		.strict(),
);

const reportprefsSchema = lazySchema(() =>
	z
		.object({
			ReportBasis: z.enum(['Accrual', 'Cash']).optional(),
			CalcAgingReportFromTxnDate: z.boolean().optional(),
		})
		.strict(),
);

const dateSchema = lazySchema(() =>
	z
		.object({
			date: z.string().optional(),
		})
		.strict(),
);

const accountinginfoprefsSchema = lazySchema(() =>
	z
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
		.strict(),
);

const emailaddressSchema = lazySchema(() =>
	z
		.object({
			Address: z.string().optional(),
		})
		.strict(),
);

const salesformsprefSchema = lazySchema(() =>
	z
		.object({
			SalesEmailBcc: emailaddressSchema().optional(),
			AllowServiceDate: z.boolean().optional(),
			EstimateMessage: z.string().optional(),
			EmailCopyToCompany: z.boolean().optional(),
			DefaultCustomerMessage: z.string().optional(),
			AllowShipping: z.boolean().optional(),
			SalesEmailCc: emailaddressSchema().optional(),
			DefaultDiscountAccount: z.boolean().optional(),
			IPNSupportEnabled: z.boolean().optional(),
			ETransactionPaymentEnabled: z.boolean().optional(),
			DefaultTerms: referencetypeSchema().optional(),
			UsingProgressInvoicing: z.boolean().optional(),
			AllowDeposit: z.boolean().optional(),
			UsingPriceLevels: z.boolean().optional(),
			DefaultShippingAccount: z.boolean().optional(),
			ETransactionAttachPDF: z.boolean().optional(),
			CustomTxnNumbers: z.boolean().optional(),
			ETransactionEnabledStatus: z.string().optional(),
			AllowEstimates: z.boolean().optional(),
			AllowDiscount: z.boolean().optional(),
			CustomField: z.array(customfieldSchema()).optional(),
			AutoApplyCredit: z.boolean().optional(),
		})
		.strict(),
);

const vendorandpurchaseprefsSchema = lazySchema(() =>
	z
		.object({
			DefaultMarkupAccount: referencetypeSchema().optional(),
			TrackingByCustomer: z.boolean().optional(),
			POCustomField: z.array(customfieldSchema()).optional(),
			DefaultTerms: referencetypeSchema().optional(),
			BillableExpenseTracking: z.boolean().optional(),
			DefaultMarkup: z.number().optional(),
			TPAREnabled: z.boolean().optional(),
		})
		.strict(),
);

const taxprefsSchema = lazySchema(() =>
	z
		.object({
			PartnerTaxEnabled: z.boolean().optional(),
			TaxGroupCodeRef: z.string().optional(),
			UsingSalesTax: z.boolean().optional(),
		})
		.strict(),
);

const timetrackingprefsSchema = lazySchema(() =>
	z
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
		.strict(),
);

const currencyprefsSchema = lazySchema(() =>
	z
		.object({
			HomeCurrency: z.string().optional(),
			MultiCurrencyEnabled: z.boolean().optional(),
		})
		.strict(),
);

const preferencesresponseSchema = lazySchema(() =>
	z
		.object({
			EmailMessagesPrefs: emailmessagesprefsSchema().optional(),
			SyncToken: z.string().optional(),
			ProductAndServicesPrefs: productandservicesprefsSchema().optional(),
			ReportPrefs: reportprefsSchema().optional(),
			AccountingInfoPrefs: accountinginfoprefsSchema().optional(),
			SalesFormsPrefs: salesformsprefSchema().optional(),
			VendorAndPurchasesPrefs: vendorandpurchaseprefsSchema().optional(),
			TaxPrefs: taxprefsSchema().optional(),
			OtherPrefs: z
				.object({ NameValue: z.array(namevalueSchema()).optional() })
				.strict()
				.optional(),
			TimeTrackingPrefs: timetrackingprefsSchema().optional(),
			CurrencyPrefs: currencyprefsSchema().optional(),
			Id: z.string(),
			MetaData: modificationmetadataSchema().optional(),
		})
		.strict(),
);

const markupinfoSchema = lazySchema(() =>
	z
		.object({
			PriceLevelRef: referencetypeSchema().optional(),
			Percent: z.number().optional(),
			MarkUpIncomeAccountRef: referencetypeSchema().optional(),
		})
		.strict(),
);

const reimburselinedetailSchema = lazySchema(() =>
	z
		.object({
			ClassRef: referencetypeSchema().optional(),
			TaxCodeRef: referencetypeSchema().optional(),
			MarkupInfo: markupinfoSchema().optional(),
			ItemAccountRef: referencetypeSchema().optional(),
			ItemRef: referencetypeSchema().optional(),
		})
		.strict(),
);

const discountlinedetailSchema = lazySchema(() =>
	z
		.object({
			ClassRef: referencetypeSchema().optional(),
			TaxCodeRef: referencetypeSchema().optional(),
			DiscountAccountRef: referencetypeSchema().optional(),
			PercentBased: z.boolean().optional(),
			DiscountPercent: z.number().optional(),
		})
		.strict(),
);

const profitandlossreporttoplevelSchema = lazySchema(() =>
	z
		.object({
			Header: reportheaderSchema().optional(),
			Rows: profitandlossreportrowsSchema().optional(),
			Columns: reportcolumnsSchema().optional(),
		})
		.strict(),
);

const currencyrefSchema = lazySchema(() =>
	z
		.object({
			name: z.string().optional(),
			value: z.string(),
		})
		.strict(),
);

const associatedvaluesSchema = lazySchema(() =>
	z
		.object({
			Value: z.string(),
			Key: z.string(),
		})
		.strict(),
);

const customextensionsSchema = lazySchema(() =>
	z
		.object({
			AssociatedValues: associatedvaluesSchema(),
			ExtensionType: z.string(),
		})
		.strict(),
);

const accountbasedexpenselinedetailSchema = lazySchema(() =>
	z
		.object({
			TaxAmount: z.number().optional(),
			TaxInclusiveAmt: z.number().optional(),
			ClassRef: referencetypeSchema().optional(),
			TaxCodeRef: referencetypeSchema().optional(),
			MarkupInfo: markupinfoSchema().optional(),
			BillableStatus: z
				.enum(['Billable', 'NotBillable', 'HasBeenBilled'])
				.optional(),
			AccountRef: referencetypeSchema(),
			CustomerRef: referencetypeSchema().optional(),
		})
		.strict(),
);

const accountbasedexpenselineSchema = lazySchema(() =>
	z
		.object({
			Description: z.string().optional(),
			DetailType: z.literal('AccountBasedExpenseLineDetail'),
			CustomExtensions: customextensionsSchema().optional(),
			LineNum: z.number().optional(),
			Amount: z.number(),
			Id: z.string().optional(),
			AccountBasedExpenseLineDetail: accountbasedexpenselinedetailSchema(),
		})
		.strict(),
);

const linkedtxnSchema = lazySchema(() =>
	z
		.object({
			TxnLineId: z.string().optional(),
			TxnId: z.string(),
			TxnType: z.string(),
		})
		.strict(),
);

const linkedtxnBillSchema = lazySchema(() =>
	z
		.object({
			TxnLineId: z.string(),
			TxnId: z.string(),
			TxnType: z.string(),
		})
		.strict(),
);

const lineSchema = lazySchema(() =>
	z
		.object({
			Received: z.string().optional(),
			LinkedTxn: z.array(linkedtxnSchema()).optional(),
			Description: z.string().optional(),
			ProjectRef: referencetypeSchema().optional(),
			LineNum: z.number().optional(),
			Amount: z.number(),
			Id: z.string().optional(),
		})
		.strict(),
);

const purchaserequestSchema = lazySchema(() =>
	z
		.object({
			PaymentType: z.string(),
			AccountRef: referencetypeSchema(),
			CurrencyRef: currencyrefSchema().optional(),
			Line: z.array(
				z.union([
					accountbasedexpenselineSchema(),
					itembasedexpenselineSchema(),
				]),
			),
		})
		.strict(),
);

const billrequestSchema = lazySchema(() =>
	z
		.object({
			CurrencyRef: currencyrefSchema().optional(),
			VendorRef: referencetypeSchema(),
			Line: z.array(
				z.union([
					accountbasedexpenselineSchema(),
					itembasedexpenselineSchema(),
				]),
			),
		})
		.strict(),
);

const thresholdSchema = lazySchema(() =>
	z
		.object({
			currentCount: z.string().optional(),
			aboveThreshold: z.string().optional(),
			enforced: z.string().optional(),
			limit: z.string().optional(),
			name: z.string().optional(),
		})
		.strict(),
);

const itemadjustmentlineSchema = lazySchema(() =>
	z
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
			CustomExtensions: customextensionsSchema().optional(),
			ItemAdjustmentLineDetail: itemadjustmentlinedetailSchema(),
			Id: z.number().optional(),
		})
		.strict(),
);

const inventoryadjustmentrequestSchema = lazySchema(() =>
	z
		.object({
			DocNumber: z.string().optional(),
			AdjustAccountRef: referencetypeSchema(),
			PrivateNote: z.string().optional(),
			Line: z.array(itemadjustmentlineSchema()),
			TxnDate: z.string(),
		})
		.strict(),
);

const checkpaymentSchema = lazySchema(() =>
	z
		.object({
			CheckNum: z.string().optional(),
			Status: z.string().optional(),
			NameOnAcct: z.string().optional(),
			AcctNum: z.string().optional(),
			BankName: z.string().optional(),
		})
		.strict(),
);

const itembasedexpenselinedetailSchema = lazySchema(() =>
	z
		.object({
			TaxInclusiveAmt: z.number().optional(),
			ItemRef: referencetypeSchema().optional(),
			CustomerRef: referencetypeSchema().optional(),
			PriceLevelRef: referencetypeSchema().optional(),
			ClassRef: referencetypeSchema().optional(),
			TaxCodeRef: referencetypeSchema().optional(),
			MarkupInfo: markupinfoSchema().optional(),
			BillableStatus: z
				.enum(['Billable', 'NotBillable', 'HasBeenBilled'])
				.optional(),
			Qty: z.number().optional(),
			UnitPrice: z.number().optional(),
		})
		.strict(),
);

const itembasedexpenselinebillSchema = lazySchema(() =>
	z
		.object({
			LinkedTxn: z.array(linkedtxnBillSchema()).optional(),
			Description: z.string().optional(),
			ItemBasedExpenseLineDetail: itembasedexpenselinedetailSchema(),
			CustomExtensions: customextensionsSchema().optional(),
			LineNum: z.number().optional(),
			Amount: z.number(),
			DetailType: z.literal('ItemBasedExpenseLineDetail'),
			Id: z.string().optional(),
		})
		.strict(),
);

const accountbasedexpenselinebillSchema = lazySchema(() =>
	z
		.object({
			LinkedTxn: z.array(linkedtxnBillSchema()).optional(),
			Description: z.string().optional(),
			DetailType: z.literal('AccountBasedExpenseLineDetail'),
			CustomExtensions: customextensionsSchema().optional(),
			LineNum: z.number().optional(),
			Amount: z.number(),
			Id: z.string().optional(),
			AccountBasedExpenseLineDetail: accountbasedexpenselinedetailSchema(),
		})
		.strict(),
);

const deliveryinfoSchema = lazySchema(() =>
	z
		.object({
			DeliveryType: z.enum(['Email', 'Tradeshift']).optional(),
			DeliveryTime: z.string().optional(),
		})
		.strict(),
);

const discountoverrideSchema = lazySchema(() =>
	z
		.object({
			DiscountAccountRef: referencetypeSchema().optional(),
			DiscountRef: referencetypeSchema().optional(),
			PercentBased: z.boolean().optional(),
			DiscountPercent: z.number().optional(),
		})
		.strict(),
);

const salesitemlinedetailSchema = lazySchema(() =>
	z
		.object({
			TaxInclusiveAmt: z.number().optional(),
			ItemRef: referencetypeSchema().optional(),
			ClassRef: referencetypeSchema().optional(),
			TaxCodeRef: referencetypeSchema().optional(),
			MarkupInfo: markupinfoSchema().optional(),
			ItemAccountRef: referencetypeSchema().optional(),
			ServiceDate: z.string().optional(),
			Qty: z.number().optional(),
			UnitPrice: z.number().optional(),
			TaxClassificationRef: referencetypeSchema().optional(),
		})
		.strict(),
);

const salesitemlineSchema = lazySchema(() =>
	z
		.object({
			Description: z.string().optional(),
			DetailType: z.literal('SalesItemLineDetail'),
			SalesItemLineDetail: salesitemlinedetailSchema(),
			LineNum: z.number().optional(),
			Amount: z.number(),
			CustomExtensions: customextensionsSchema().optional(),
			Id: z.string().optional(),
		})
		.strict(),
);

const grouplinedetailSchema = lazySchema(() =>
	z
		.object({
			Quantity: z.number().optional(),
			Line: z.array(salesitemlineSchema()).optional(),
			GroupItemRef: referencetypeSchema().optional(),
		})
		.strict(),
);

const grouplineSchema = lazySchema(() =>
	z
		.object({
			Description: z.string().optional(),
			GroupLineDetail: grouplinedetailSchema(),
			DetailType: z.literal('GroupLineDetail'),
			CustomExtensions: customextensionsSchema().optional(),
			LineNum: z.number().optional(),
			Id: z.string().optional(),
		})
		.strict(),
);

const descriptiononlySchema = lazySchema(() =>
	z
		.object({
			TaxCodeRef: referencetypeSchema().optional(),
			ServiceDate: z.string().optional(),
		})
		.strict(),
);

const descriptiononlylineSchema = lazySchema(() =>
	z
		.object({
			Description: z.string().optional(),
			DetailType: z.literal('DescriptionOnly'),
			LineNum: z.number().optional(),
			Amount: z.number().optional(),
			DescriptionLineDetail: descriptiononlySchema().optional(),
			Id: z.string().optional(),
		})
		.strict(),
);

const discountlineSchema = lazySchema(() =>
	z
		.object({
			DiscountLineDetail: discountlinedetailSchema(),
			Description: z.string().optional(),
			DetailType: z.literal('DiscountLineDetail'),
			LineNum: z.number().optional(),
			// Percentage discounts (PercentBased, DiscountPercent) carry no line Amount.
			Amount: z.number().optional(),
			Id: z.string().optional(),
		})
		.strict(),
);

const subtotallinedetailSchema = lazySchema(() =>
	z
		.object({
			ItemRef: referencetypeSchema().optional(),
		})
		.strict(),
);

const subtotallineSchema = lazySchema(() =>
	z
		.object({
			Description: z.string().optional(),
			SubTotalLineDetail: subtotallinedetailSchema(),
			DetailType: z.literal('SubTotalLineDetail'),
			LineNum: z.number().optional(),
			Amount: z.number(),
			Id: z.string().optional(),
		})
		.strict(),
);

// Sales transactions mix item, subtotal, discount, description and group lines.
const saleslineSchema = lazySchema(() =>
	z.union([
		salesitemlineSchema(),
		subtotallineSchema(),
		discountlineSchema(),
		descriptiononlylineSchema(),
		grouplineSchema(),
	]),
);

const memorefSchema = lazySchema(() =>
	z
		.object({
			value: z.string(),
		})
		.strict(),
);

const taxlinedetailSchema = lazySchema(() =>
	z
		.object({
			NetAmountTaxable: z.number().optional(),
			PercentBased: z.boolean().optional(),
			TaxInclusiveAmount: z.number().optional(),
			OverrideDeltaAmount: z.number().optional(),
			TaxRateRef: referencetypeSchema(),
			TaxPercent: z.number().optional(),
		})
		.strict(),
);

const taxlineSchema = lazySchema(() =>
	z
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
			TaxLineDetail: taxlinedetailSchema(),
		})
		.strict(),
);

const txntaxdetailSchema = lazySchema(() =>
	z
		.object({
			TxnTaxCodeRef: referencetypeSchema().optional(),
			TotalTax: z.number().optional(),
			TaxLine: z.array(taxlineSchema()).optional(),
		})
		.strict(),
);

const physicaladdressSchema = lazySchema(() =>
	z
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
			Id: z.string().optional(),
		})
		.strict(),
);

const creditmemoresponseSchema = lazySchema(() =>
	z
		.object({
			TxnDate: z.string().optional(),
			CurrencyRef: currencyrefSchema().optional(),
			CustomField: z.array(customfieldSchema()).optional(),
			HomeBalance: z.number().optional(),
			ClassRef: referencetypeSchema().optional(),
			PrintStatus: z.string().optional(),
			SalesTermRef: referencetypeSchema().optional(),
			GlobalTaxCalculation: z
				.enum(['TaxInclusive', 'TaxExcluded', 'NotApplicable'])
				.optional(),
			TotalAmt: z.number().optional(),
			RemainingCredit: z.number().optional(),
			ApplyTaxAfterDiscount: z.boolean().optional(),
			DocNumber: z.string().optional(),
			PrivateNote: z.string().optional(),
			RecurDataRef: referencetypeSchema().optional(),
			Line: z.array(saleslineSchema()),
			CustomerMemo: memorefSchema().optional(),
			ProjectRef: referencetypeSchema().optional(),
			TaxExemptionRef: referencetypeSchema().optional(),
			Balance: z.number().optional(),
			CustomerRef: referencetypeSchema(),
			TxnTaxDetail: txntaxdetailSchema().optional(),
			SyncToken: z.string().optional(),
			PaymentMethodRef: referencetypeSchema().optional(),
			ExchangeRate: z.number().optional(),
			ShipAddr: physicaladdressSchema().optional(),
			HomeTotalAmt: z.number().optional(),
			DepartmentRef: referencetypeSchema().optional(),
			EmailStatus: z.string().optional(),
			BillAddr: physicaladdressSchema().optional(),
			MetaData: modificationmetadataSchema().optional(),
			BillEmail: emailaddressSchema().optional(),
			Id: z.string(),
		})
		.strict(),
);

const trialbalancequerySchema = lazySchema(() =>
	z
		.object({
			accounting_method: z.string().optional(),
			end_date: z.string().optional(),
			date_macro: z.string().optional(),
			sort_order: z.string().optional(),
			summarize_column_by: z.string().optional(),
			start_date: z.string().optional(),
		})
		.strict(),
);

const inventoryadjustmentcreaterequestSchema = lazySchema(() =>
	z
		.object({
			DocNumber: z.string(),
			AdjustAccountRef: referencetypeSchema(),
			PrivateNote: z.string().optional(),
			Line: z.array(itemadjustmentlineSchema()),
			TxnDate: z.string(),
		})
		.strict(),
);

const billpaymentcreditcardSchema = lazySchema(() =>
	z
		.object({
			CCAccountRef: referencetypeSchema(),
		})
		.strict(),
);

const entitySchema = lazySchema(() =>
	z
		.object({
			Type: z
				.enum(['Customer', 'Employee', 'Job', 'Other', 'Vendor'])
				.optional(),
			EntityRef: referencetypeSchema(),
		})
		.strict(),
);

const journalentrylinedetailSchema = lazySchema(() =>
	z
		.object({
			TaxAmount: z.number().optional(),
			TaxInclusiveAmt: z.number().optional(),
			ClassRef: referencetypeSchema().optional(),
			DepartmentRef: referencetypeSchema().optional(),
			TaxCodeRef: referencetypeSchema().optional(),
			BillableStatus: z
				.enum(['Billable', 'NotBillable', 'HasBeenBilled'])
				.optional(),
			TaxApplicableOn: z.enum(['Purchase', 'Sales']).optional(),
			PostingType: z.enum(['Credit', 'Debit']),
			AccountRef: referencetypeSchema(),
			Entity: entitySchema().optional(),
		})
		.strict(),
);

const creditchargeinfoSchema = lazySchema(() =>
	z
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
		.strict(),
);

const taxpaymentresponseSchema = lazySchema(() =>
	z
		.object({
			Refund: z.boolean().optional(),
			TxnDate: z.string().optional(),
			PaymentAccountRef: referencetypeSchema().optional(),
			Description: z.string().optional(),
			SyncToken: z.string().optional(),
			PaymentAmount: z.number().optional(),
			Id: z.string(),
			MetaData: modificationmetadataSchema().optional(),
		})
		.strict(),
);

const frenchpcgaccountlistSchema = lazySchema(() => z.object({}).strict());

const websiteaddressSchema = lazySchema(() =>
	z
		.object({
			URI: z.string().optional(),
		})
		.strict(),
);

const jobinfoSchema = lazySchema(() =>
	z
		.object({
			Status: z.string().optional(),
			StartDate: z.string().optional(),
			EndDate: z.string().optional(),
			Description: z.string().optional(),
			JobTypeRef: referencetypeSchema().optional(),
			ProjectedEndDate: z.string().optional(),
		})
		.strict(),
);

const telephonenumberSchema = lazySchema(() =>
	z
		.object({
			FreeFormNumber: z.string().optional(),
		})
		.strict(),
);

const contactinfoSchema = lazySchema(() =>
	z
		.object({
			Type: z.string().optional(),
			Telephone: telephonenumberSchema().optional(),
		})
		.strict(),
);

const journalentrylineSchema = lazySchema(() =>
	z
		.object({
			Description: z.string().optional(),
			JournalEntryLineDetail: journalentrylinedetailSchema(),
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
			ProjectRef: referencetypeSchema().optional(),
			CustomExtensions: customextensionsSchema().optional(),
			LineNum: z.number().optional(),
			Amount: z.number(),
			Id: z.string().optional(),
		})
		.strict(),
);

const journalentryresponseSchema = lazySchema(() =>
	z
		.object({
			DocNumber: z.string().optional(),
			SyncToken: z.string().optional(),
			PrivateNote: z.string().optional(),
			RecurDataRef: referencetypeSchema().optional(),
			TxnDate: z.string().optional(),
			TotalAmt: z.number().optional(),
			ExchangeRate: z.number().optional(),
			CurrencyRef: currencyrefSchema().optional(),
			TaxRateRef: referencetypeSchema().optional(),
			HomeTotalAmt: z.number().optional(),
			TxnTaxDetail: txntaxdetailSchema().optional(),
			GlobalTaxCalculation: z
				.enum(['TaxInclusive', 'TaxExcluded', 'NotApplicable'])
				.optional(),
			Adjustment: z.boolean().optional(),
			Id: z.string(),
			Line: z.array(journalentrylineSchema()),
			MetaData: modificationmetadataSchema().optional(),
		})
		.strict(),
);

const departmentresponseSchema = lazySchema(() =>
	z
		.object({
			SyncToken: z.string().optional(),
			Name: z.string(),
			FullyQualifiedName: z.string().optional(),
			SubDepartment: z.boolean().optional(),
			ParentRef: referencetypeSchema().optional(),
			Active: z.boolean().optional(),
			Id: z.string(),
			MetaData: modificationmetadataSchema().optional(),
		})
		.strict(),
);

const customerbalancedetailquerySchema = lazySchema(() =>
	z
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
		.strict(),
);

const customfieldstringpoSchema = lazySchema(() =>
	z
		.object({
			StringValue: z.string().optional(),
			Type: z
				.enum(['StringType', 'BooleanType', 'NumberType', 'DateType'])
				.optional(),
			Name: z.string().optional(),
		})
		.strict(),
);

const paymentlinedetailSchema = lazySchema(() =>
	z
		.object({
			ClassRef: referencetypeSchema().optional(),
			Discount: discountoverrideSchema().optional(),
			Balance: z.number().optional(),
			ItemRef: referencetypeSchema().optional(),
		})
		.strict(),
);

const transactionlistreportheaderSchema = lazySchema(() =>
	z
		.object({
			Customer: z.string().optional(),
			ReportName: z.string().optional(),
			Vendor: z.string().optional(),
			Option: z.array(namevalueSchema()).optional(),
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
		.strict(),
);

const transactionlistreporttoplevelSchema = lazySchema(() =>
	z
		.object({
			Header: transactionlistreportheaderSchema().optional(),
			Rows: reportRowsSchema().optional(),
			Columns: reportcolumnsSchema().optional(),
		})
		.strict(),
);

const trialbalancereportrowsSchema = lazySchema(() =>
	z
		.object({
			Row: z.array(reportRowSchema()).optional(),
		})
		.strict(),
);

const categoryresponseSchema = lazySchema(() =>
	z
		.object({
			SyncToken: z.string().optional(),
			Name: z.string().optional(),
			Level: z.number().int().optional(),
			FullyQualifiedName: z.string().optional(),
			SubItem: z.boolean().optional(),
			ParentRef: referencetypeSchema().optional(),
			Active: z.boolean().optional(),
			Type: z.string().optional(),
			Id: z.string(),
			MetaData: modificationmetadataSchema().optional(),
		})
		.strict(),
);

const trialbalancereporttoplevelSchema = lazySchema(() =>
	z
		.object({
			Header: reportheaderSchema().optional(),
			Rows: profitandlossreportrowsSchema().optional(),
			Columns: reportcolumnsSchema().optional(),
		})
		.strict(),
);

const transactionlistbyvendorquerySchema = lazySchema(() =>
	z
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
		.strict(),
);

const creditchargeresponseSchema = lazySchema(() =>
	z
		.object({
			Status: z.enum(['Completed', 'Voided', 'Unknown']).optional(),
			AuthCode: z.string().optional(),
			TxnAuthorizationTime: z.string().optional(),
			CCTransId: z.string().optional(),
		})
		.strict(),
);

const creditcardpaymentSchema = lazySchema(() =>
	z
		.object({
			CreditChargeResponse: creditchargeresponseSchema().optional(),
			CreditChargeInfo: creditchargeinfoSchema().optional(),
		})
		.strict(),
);

const refundreceiptresponseSchema = lazySchema(() =>
	z
		.object({
			TxnDate: z.string().optional(),
			CurrencyRef: currencyrefSchema().optional(),
			CustomField: z.array(customfieldSchema()).optional(),
			HomeBalance: z.number().optional(),
			ClassRef: referencetypeSchema().optional(),
			PrintStatus: z.string().optional(),
			PaymentRefNum: z.string().optional(),
			CheckPayment: checkpaymentSchema().optional(),
			TxnSource: z.string().optional(),
			RecurDataRef: referencetypeSchema().optional(),
			GlobalTaxCalculation: z
				.enum(['TaxInclusive', 'TaxExcluded', 'NotApplicable'])
				.optional(),
			TotalAmt: z.number().optional(),
			MetaData: modificationmetadataSchema().optional(),
			DocNumber: z.string().optional(),
			PrivateNote: z.string().optional(),
			DepositToAccountRef: referencetypeSchema(),
			Line: z.array(saleslineSchema()),
			CustomerMemo: memorefSchema().optional(),
			ProjectRef: referencetypeSchema().optional(),
			TaxExemptionRef: referencetypeSchema().optional(),
			CreditCardPayment: creditcardpaymentSchema().optional(),
			Balance: z.number().optional(),
			CustomerRef: referencetypeSchema().optional(),
			TxnTaxDetail: txntaxdetailSchema().optional(),
			SyncToken: z.string().optional(),
			PaymentMethodRef: referencetypeSchema().optional(),
			ExchangeRate: z.number().optional(),
			ShipAddr: physicaladdressSchema().optional(),
			Id: z.string(),
			DepartmentRef: referencetypeSchema().optional(),
			PaymentType: z
				.enum(['Cash', 'Check', 'CreditCard', 'Expense', 'Other'])
				.optional(),
			BillAddr: physicaladdressSchema().optional(),
			ApplyTaxAfterDiscount: z.boolean().optional(),
			BillEmail: emailaddressSchema().optional(),
			HomeTotalAmt: z.number().optional(),
		})
		.strict(),
);

const paymentmethodrequestSchema = lazySchema(() =>
	z
		.object({
			Name: z.string(),
		})
		.strict(),
);

const dataservicesextensionsSchema = lazySchema(() => z.object({}).strict());

const cashflowreportrowsSchema = lazySchema(() =>
	z
		.object({
			Row: z.array(reportRowSchema()).optional(),
		})
		.strict(),
);

const cashflowtoplevelSchema = lazySchema(() =>
	z
		.object({
			Header: reportheaderSchema().optional(),
			Rows: cashflowreportrowsSchema().optional(),
			Columns: reportcolumnsSchema().optional(),
		})
		.strict(),
);

const telephonenumber30Schema = lazySchema(() =>
	z
		.object({
			FreeFormNumber: z.string().optional(),
		})
		.strict(),
);

const vendorpaymentbankdetailSchema = lazySchema(() =>
	z
		.object({
			BankAccountName: z.string().optional(),
			BankBranchIdentifier: z.string().optional(),
			BankAccountNumber: z.string().optional(),
			StatementText: z.string().optional(),
		})
		.strict(),
);

const vendorresponseSchema = lazySchema(() =>
	z
		.object({
			PrimaryEmailAddr: emailaddressSchema().optional(),
			DisplayName: z.string().optional(),
			OtherContactInfo: contactinfoSchema().optional(),
			Title: z.string().optional(),
			TermRef: referencetypeSchema().optional(),
			Source: z.string().optional(),
			GivenName: z.string().optional(),
			T4AEligible: z.boolean().optional(),
			Fax: telephonenumber30Schema().optional(),
			CurrencyRef: currencyrefSchema().optional(),
			Mobile: telephonenumber30Schema().optional(),
			PrimaryPhone: telephonenumber30Schema().optional(),
			Active: z.boolean().optional(),
			AlternatePhone: telephonenumber30Schema().optional(),
			MetaData: modificationmetadataSchema().optional(),
			Vendor1099: z.boolean().optional(),
			CostRate: z.number().optional(),
			MiddleName: z.string().optional(),
			BillRate: z.number().optional(),
			WebAddr: websiteaddressSchema().optional(),
			T5018Eligible: z.boolean().optional(),
			Balance: z.number().optional(),
			SyncToken: z.string().optional(),
			Suffix: z.string().optional(),
			CompanyName: z.string().optional(),
			FamilyName: z.string().optional(),
			VendorPaymentBankDetail: vendorpaymentbankdetailSchema().optional(),
			TaxIdentifier: z.string().optional(),
			AcctNum: z.string().optional(),
			HasTPAR: z.boolean().optional(),
			PrintOnCheckName: z.string().optional(),
			BillAddr: physicaladdressSchema().optional(),
			Id: z.string(),
		})
		.strict(),
);

const accountrequestSchema = lazySchema(() =>
	z
		.object({
			AcctNum: z.string().optional(),
			TaxCodeRef: referencetypeSchema().optional(),
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
		.strict(),
);

const servicetypeenumSchema = lazySchema(() => z.object({}).strict());

const taxratedetailsSchema = lazySchema(() =>
	z
		.object({
			RateValue: z.string(),
			TaxRateId: z.string().optional(),
			TaxApplicableOn: z.enum(['Purchase', 'Sales']).optional(),
			TaxAgencyId: z.string().optional(),
			TaxRateName: z.string().optional(),
		})
		.strict(),
);

const effectivetaxratedataSchema = lazySchema(() =>
	z
		.object({
			RateValue: z.number().optional(),
			EndDate: z.string().optional(),
			EffectiveDate: z.string().optional(),
		})
		.strict(),
);

const taxrateresponseSchema = lazySchema(() =>
	z
		.object({
			RateValue: z.number().optional(),
			SyncToken: z.string().optional(),
			Name: z.string().optional(),
			AgencyRef: referencetypeSchema().optional(),
			SpecialTaxType: z.string().optional(),
			EffectiveTaxRate: effectivetaxratedataSchema().optional(),
			DisplayType: z.string().optional(),
			TaxReturnLineRef: referencetypeSchema().optional(),
			Active: z.boolean().optional(),
			MetaData: modificationmetadataSchema().optional(),
			Id: z.string(),
			OriginalTaxRate: z.string().optional(),
			Description: z.string().optional(),
		})
		.strict(),
);

const invoicevoidresponseSchema = lazySchema(() =>
	z
		.object({
			TxnDate: z.string().optional(),
			ShipFromAddr: physicaladdressSchema().optional(),
			CurrencyRef: currencyrefSchema().optional(),
			HomeBalance: z.number().optional(),
			ShipDate: z.string().optional(),
			TrackingNum: z.string().optional(),
			ClassRef: referencetypeSchema().optional(),
			PrintStatus: z.string().optional(),
			EmailStatus: z.string().optional(),
			SalesTermRef: referencetypeSchema().optional(),
			DeliveryInfo: deliveryinfoSchema().optional(),
			TxnSource: z.string().optional(),
			LinkedTxn: z.array(linkedtxnSchema()).optional(),
			GlobalTaxCalculation: z
				.enum(['TaxInclusive', 'TaxExcluded', 'NotApplicable'])
				.optional(),
			TotalAmt: z.number().optional(),
			AllowOnlineAffirmPayment: z.boolean().optional(),
			InvoiceLink: z.string().optional(),
			AllowOnlineACHPayment: z.boolean().optional(),
			DueDate: z.string().optional(),
			MetaData: modificationmetadataSchema().optional(),
			DocNumber: z.string().optional(),
			PrivateNote: z.string().optional(),
			DepositToAccountRef: referencetypeSchema().optional(),
			Line: z.array(saleslineSchema()).optional(),
			BillEmailCc: emailaddressSchema().optional(),
			CustomerMemo: memorefSchema().optional(),
			AllowOnlinePayPalPayment: z.boolean().optional(),
			ProjectRef: referencetypeSchema().optional(),
			ExchangeRate: z.number().optional(),
			TaxExemptionRef: referencetypeSchema().optional(),
			Deposit: z.number().optional(),
			Balance: z.number().optional(),
			CustomerRef: referencetypeSchema().optional(),
			TxnTaxDetail: txntaxdetailSchema().optional(),
			AllowOnlineCreditCardPayment: z.boolean().optional(),
			SyncToken: z.string().optional(),
			CustomField: z.array(customfieldSchema()).optional(),
			ShipAddr: physicaladdressSchema().optional(),
			HomeTotalAmt: z.number().optional(),
			DepartmentRef: referencetypeSchema().optional(),
			BillEmailBcc: emailaddressSchema().optional(),
			ShipMethodRef: referencetypeSchema().optional(),
			BillAddr: physicaladdressSchema().optional(),
			FreeFormAddress: z.boolean().optional(),
			ApplyTaxAfterDiscount: z.boolean().optional(),
			BillEmail: emailaddressSchema().optional(),
			Id: z.string(),
			AllowOnlinePayment: z.boolean().optional(),
			AllowIPNPayment: z.boolean().optional(),
		})
		.strict(),
);

const creditcardpaymentrequestSchema = lazySchema(() =>
	z
		.object({
			PrivateNote: z.string().optional(),
			TxnDate: z.string(),
			Amount: z.number(),
			BankAccountRef: referencetypeSchema(),
			CreditCardAccountRef: referencetypeSchema(),
		})
		.strict(),
);

const pcesalesitemlinedetailSchema = lazySchema(() =>
	z
		.object({
			ItemAccountRef: referencetypeSchema().optional(),
			ItemRef: referencetypeSchema().optional(),
			ClassRef: referencetypeSchema().optional(),
			TaxCodeRef: referencetypeSchema().optional(),
			MarkupInfo: markupinfoSchema().optional(),
			UnitCostPrice: z.number().optional(),
			ServiceDate: z.string().optional(),
			Qty: z.number().optional(),
			UnitPrice: z.number().optional(),
		})
		.strict(),
);

const itembasedexpenselineSchema = lazySchema(() =>
	z
		.object({
			LinkedTxn: z.array(linkedtxnSchema()).optional(),
			Description: z.string().optional(),
			ItemBasedExpenseLineDetail: itembasedexpenselinedetailSchema(),
			CustomExtensions: customextensionsSchema().optional(),
			LineNum: z.number().optional(),
			Amount: z.number(),
			DetailType: z.literal('ItemBasedExpenseLineDetail'),
			Id: z.string().optional(),
		})
		.strict(),
);

const vendorcreditresponseSchema = lazySchema(() =>
	z
		.object({
			DocNumber: z.string().optional(),
			SyncToken: z.string().optional(),
			PrivateNote: z.string().optional(),
			LinkedTxn: z.array(linkedtxnSchema()).optional(),
			VendorRef: referencetypeSchema(),
			RecurDataRef: referencetypeSchema().optional(),
			GlobalTaxCalculation: z
				.enum(['TaxInclusive', 'TaxExcluded', 'NotApplicable'])
				.optional(),
			TotalAmt: z.number().optional(),
			ExchangeRate: z.number().optional(),
			APAccountRef: referencetypeSchema().optional(),
			DepartmentRef: referencetypeSchema().optional(),
			TxnDate: z.string().optional(),
			IncludeInAnnualTPAR: z.boolean().optional(),
			Line: z.array(itembasedexpenselineSchema()),
			Balance: z.number().optional(),
			Id: z.string(),
			CurrencyRef: currencyrefSchema().optional(),
			MetaData: modificationmetadataSchema().optional(),
		})
		.strict(),
);

const budgetdetailSchema = lazySchema(() =>
	z
		.object({
			ClassRef: referencetypeSchema().optional(),
			DepartmentRef: referencetypeSchema().optional(),
			Amount: z.number().optional(),
			BudgetDate: z.string().optional(),
			AccountRef: referencetypeSchema().optional(),
			CustomerRef: referencetypeSchema().optional(),
		})
		.strict(),
);

const budgetrequestSchema = lazySchema(() =>
	z
		.object({
			BudgetDetail: z.array(budgetdetailSchema()).optional(),
			BudgetEntryType: z.enum(['Yearly', 'Quarterly', 'Monthly']).optional(),
			EndDate: z.string(),
			Name: z.string().optional(),
			StartDate: z.string(),
			BudgetType: z.enum(['ProfitAndLoss', 'BalanceSheet']).optional(),
			CustomExtensions: customextensionsSchema().optional(),
		})
		.strict(),
);

const recurringscheduleinfoSchema = lazySchema(() =>
	z
		.object({
			DayOfWeek: z.string().optional(),
			StartDate: z.string().optional(),
			MaxOccurrences: z.number().int().optional(),
			RemindDays: z.number().int().optional(),
			IntervalType: z.string().optional(),
			WeekOfMonth: z.string().optional(),
			MonthOfYear: z.string().optional(),
			DaysBefore: z.number().int().optional(),
			NextDate: z.string().optional(),
			NumInterval: z.number().int().optional(),
			EndDate: z.string().optional(),
			PreviousDate: z.string().optional(),
			DayOfMonth: z.number().int().optional(),
		})
		.strict(),
);

const recurringinfoSchema = lazySchema(() =>
	z
		.object({
			Active: z.boolean().optional(),
			RecurType: z.string().optional(),
			ScheduleInfo: recurringscheduleinfoSchema().optional(),
			Name: z.string().optional(),
		})
		.strict(),
);

const departmentrequestSchema = lazySchema(() =>
	z
		.object({
			Name: z.string(),
			ParentRef: referencetypeSchema().optional(),
		})
		.strict(),
);

const linelinkedtxnSchema = lazySchema(() =>
	z
		.object({
			Amount: z.number(),
			LinkedTxn: z.array(linkedtxnSchema()),
		})
		.strict(),
);

const billpaymentcheckSchema = lazySchema(() =>
	z
		.object({
			PrintStatus: z
				.enum(['NotSet', 'NeedToPrint', 'PrintComplete'])
				.optional(),
			BankAccountRef: referencetypeSchema(),
		})
		.strict(),
);

const billpaymentresponseSchema = lazySchema(() =>
	z
		.object({
			DocNumber: z.string().optional(),
			SyncToken: z.string().optional(),
			PrivateNote: z.string().optional(),
			VendorRef: referencetypeSchema(),
			Line: z.array(linelinkedtxnSchema()),
			TxnDate: z.string().optional(),
			TotalAmt: z.number(),
			ExchangeRate: z.number().optional(),
			APAccountRef: referencetypeSchema().optional(),
			PayType: z.enum(['Check', 'CreditCard']),
			DepartmentRef: referencetypeSchema().optional(),
			CheckPayment: billpaymentcheckSchema().optional(),
			CreditCardPayment: billpaymentcreditcardSchema().optional(),
			ProcessBillPayment: z.boolean().optional(),
			Id: z.string(),
			CurrencyRef: currencyrefSchema().optional(),
			MetaData: modificationmetadataSchema().optional(),
		})
		.strict(),
);

const taxratedetailSchema = lazySchema(() =>
	z
		.object({
			TaxTypeApplicable: z.string().optional(),
			TaxRateRef: referencetypeSchema(),
			TaxOrder: z.number().int().optional(),
		})
		.strict(),
);

const taxratelistSchema = lazySchema(() =>
	z
		.object({
			TaxRateDetail: z.array(taxratedetailSchema()).optional(),
		})
		.strict(),
);

const taxcoderesponseSchema = lazySchema(() =>
	z
		.object({
			SyncToken: z.string().optional(),
			TaxGroup: z.boolean().optional(),
			PurchaseTaxRateList: taxratelistSchema().optional(),
			TaxCodeConfigType: z.string().optional(),
			Taxable: z.boolean().optional(),
			Name: z.string(),
			Active: z.boolean().optional(),
			Description: z.string().optional(),
			Hidden: z.boolean().optional(),
			MetaData: modificationmetadataSchema().optional(),
			Id: z.string(),
			SalesTaxRateList: taxratelistSchema().optional(),
		})
		.strict(),
);

const transactionlistquerySchema = lazySchema(() =>
	z
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
		.strict(),
);

const vendorbalancequerySchema = lazySchema(() =>
	z
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
		.strict(),
);

const purchaseorderrequestSchema = lazySchema(() =>
	z
		.object({
			CurrencyRef: currencyrefSchema().optional(),
			APAccountRef: referencetypeSchema(),
			VendorRef: referencetypeSchema(),
			Line: z.array(itembasedexpenselineSchema()),
		})
		.strict(),
);

const profitandlossdetailstoplevelSchema = lazySchema(() =>
	z
		.object({
			Header: reportheaderSchema().optional(),
			Rows: reportRowsSchema().optional(),
			Columns: reportcolumnsSchema().optional(),
		})
		.strict(),
);

const companycurrencyrequestSchema = lazySchema(() =>
	z
		.object({
			Code: z.string(),
		})
		.strict(),
);

const customfieldstringsalesSchema = lazySchema(() =>
	z
		.object({
			StringValue: z.string().optional(),
			Type: z
				.enum(['StringType', 'BooleanType', 'NumberType', 'DateType'])
				.optional(),
			Name: z.string().optional(),
		})
		.strict(),
);

const inventoryvaluationdetailquerySchema = lazySchema(() =>
	z
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
		.strict(),
);

const departmentsalesquerySchema = lazySchema(() =>
	z
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
		.strict(),
);

const projectestimateresponseSchema = lazySchema(() =>
	z
		.object({
			TxnDate: z.string().optional(),
			ShipFromAddr: physicaladdressSchema().optional(),
			CurrencyRef: currencyrefSchema().optional(),
			ShipDate: z.string().optional(),
			ClassRef: referencetypeSchema().optional(),
			PrintStatus: z.string().optional(),
			HomeTotalCostAmount: z.number().optional(),
			CustomField: z.array(customfieldSchema()).optional(),
			SalesTermRef: referencetypeSchema().optional(),
			TxnStatus: z.string().optional(),
			LinkedTxn: z.array(linkedtxnSchema()).optional(),
			TotalAmt: z.number().optional(),
			AcceptedDate: z.string().optional(),
			ExpirationDate: z.string().optional(),
			DueDate: z.string().optional(),
			MetaData: modificationmetadataSchema().optional(),
			DocNumber: z.string().optional(),
			PrivateNote: z.string().optional(),
			RecurDataRef: referencetypeSchema().optional(),
			Line: z.array(saleslineSchema()).optional(),
			CustomerMemo: memorefSchema().optional(),
			EmailStatus: z.string().optional(),
			ProjectRef: referencetypeSchema().optional(),
			TaxExemptionRef: referencetypeSchema().optional(),
			CustomerRef: referencetypeSchema(),
			TxnTaxDetail: txntaxdetailSchema().optional(),
			SyncToken: z.string().optional(),
			AcceptedBy: z.string().optional(),
			ExchangeRate: z.number().optional(),
			TotalCostAmount: z.number().optional(),
			ShipAddr: physicaladdressSchema().optional(),
			HomeTotalAmt: z.number().optional(),
			DepartmentRef: referencetypeSchema().optional(),
			ShipMethodRef: referencetypeSchema().optional(),
			BillAddr: physicaladdressSchema().optional(),
			FreeFormAddress: z.boolean().optional(),
			ApplyTaxAfterDiscount: z.boolean().optional(),
			BillEmail: emailaddressSchema().optional(),
			Id: z.string(),
		})
		.strict(),
);

const taxagencyrequestSchema = lazySchema(() =>
	z
		.object({
			DisplayName: z.string(),
		})
		.strict(),
);

const companycurrencyresponseSchema = lazySchema(() =>
	z
		.object({
			SyncToken: z.string().optional(),
			Code: z.string(),
			Name: z.string().optional(),
			CustomField: z.array(customfieldSchema()).optional(),
			Active: z.boolean().optional(),
			Id: z.string(),
			MetaData: modificationmetadataSchema().optional(),
		})
		.strict(),
);

const reportsqueryallSchema = lazySchema(() =>
	z
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
		.strict(),
);

const vendorexpensesquerySchema = lazySchema(() =>
	z
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
		.strict(),
);

const itemreceiptlineSchema = lazySchema(() =>
	z
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
			Id: z.string().optional(),
		})
		.strict(),
);

const customfieldboolpoSchema = lazySchema(() =>
	z
		.object({
			BooleanValue: z.boolean().optional(),
			Type: z
				.enum(['StringType', 'BooleanType', 'NumberType', 'DateType'])
				.optional(),
			Name: z.string().optional(),
		})
		.strict(),
);

const agedpayablesquerySchema = lazySchema(() =>
	z
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
		.strict(),
);

const attachableresponseSchema = lazySchema(() =>
	z
		.object({
			Category: z.string().optional(),
			SyncToken: z.string().optional(),
			FileAccessUri: z.string().optional(),
			ContentType: z.string().optional(),
			PlaceName: z.string().optional(),
			Size: z.number().optional(),
			AttachableRef: z.array(attachablerefSchema()).optional(),
			Long: z.string().optional(),
			FileName: z.string().optional(),
			Note: z.string().optional(),
			Tag: z.string().optional(),
			Lat: z.string().optional(),
			ThumbnailFileAccessUri: z.string().optional(),
			TempDownloadUri: z.string().optional(),
			ThumbnailTempDownloadUri: z.string().optional(),
			Id: z.string(),
			MetaData: modificationmetadataSchema().optional(),
		})
		.strict(),
);

const agedpayablesreportrowsSchema = lazySchema(() =>
	z
		.object({
			Row: z.array(reportRowSchema()).optional(),
		})
		.strict(),
);

const agedpayablestoplevelSchema = lazySchema(() =>
	z
		.object({
			Header: reportheaderSchema().optional(),
			Rows: agedpayablesreportrowsSchema().optional(),
			Columns: reportcolumnsSchema().optional(),
		})
		.strict(),
);

const purchaseorderitemlinedetailSchema = lazySchema(() =>
	z
		.object({
			OpenQty: z.number().optional(),
			ItemRef: referencetypeSchema().optional(),
			ManuallyClosed: z.boolean().optional(),
			PriceLevelRef: referencetypeSchema().optional(),
			ClassRef: referencetypeSchema().optional(),
			TaxCodeRef: referencetypeSchema().optional(),
			MarkupInfo: markupinfoSchema().optional(),
			ServiceDate: dateSchema().optional(),
			Qty: z.number().optional(),
			UnitPrice: z.number().optional(),
		})
		.strict(),
);

const purchaseorderitemlineSchema = lazySchema(() =>
	z
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
			CustomField: z.array(customfieldSchema()).optional(),
			PurchaseOrderItemLineDetail: purchaseorderitemlinedetailSchema(),
			Id: z.string().optional(),
		})
		.strict(),
);

const agedreceivablesquerySchema = lazySchema(() =>
	z
		.object({
			customer: z.string().optional(),
			qzurl: z.string().optional(),
			date_macro: z.string().optional(),
			aging_method: z.string().optional(),
			report_date: z.string().optional(),
			sort_order: z.string().optional(),
			department: z.string().optional(),
		})
		.strict(),
);

const termrequestSchema = lazySchema(() =>
	z
		.object({
			DayOfMonthDue: z.number().int().optional(),
			DueDays: z.number().int().optional(),
			Name: z.string(),
		})
		.strict(),
);

const depositlinedetailSchema = lazySchema(() =>
	z
		.object({
			PaymentMethodRef: referencetypeSchema().optional(),
			ClassRef: referencetypeSchema().optional(),
			CheckNum: z.string().optional(),
			TaxCodeRef: referencetypeSchema().optional(),
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
			AccountRef: referencetypeSchema(),
			Entity: referencetypeSchema().optional(),
		})
		.strict(),
);

const depositlineSchema = lazySchema(() =>
	z
		.object({
			Description: z.string().optional(),
			DetailType: z.literal('DepositLineDetail'),
			ProjectRef: referencetypeSchema().optional(),
			CustomExtensions: customextensionsSchema().optional(),
			LineNum: z.number().optional(),
			Amount: z.number(),
			CustomField: z.array(customfieldSchema()).optional(),
			Id: z.string().optional(),
			DepositLineDetail: depositlinedetailSchema(),
		})
		.strict(),
);

const timeactivityrequestSchema = lazySchema(() =>
	z
		.object({
			TxnDate: z.string().optional(),
			EmployeeRef: referencetypeSchema().optional(),
			ProjectRef: referencetypeSchema().optional(),
			Hours: z.number().int().optional(),
			Minutes: z.number().int().min(0).max(59).optional(),
			StartTime: z.string().optional(),
			HourlyRate: z.number().optional(),
			VendorRef: referencetypeSchema().optional(),
			EndTime: z.string().optional(),
			CustomerRef: referencetypeSchema().optional(),
			NameOf: z.string(),
		})
		.strict(),
);

const creditcardpaymentresponseSchema = lazySchema(() =>
	z
		.object({
			SyncToken: z.string().optional(),
			PrivateNote: z.string().optional(),
			VendorRef: referencetypeSchema().optional(),
			CreditCardAccountRef: referencetypeSchema(),
			TxnDate: z.string().optional(),
			Memo: z.string().optional(),
			PrintStatus: z.string().optional(),
			CheckNum: z.string().optional(),
			Amount: z.number(),
			BankAccountRef: referencetypeSchema(),
			Id: z.string(),
			MetaData: modificationmetadataSchema().optional(),
		})
		.strict(),
);

const termresponseSchema = lazySchema(() =>
	z
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
			MetaData: modificationmetadataSchema().optional(),
		})
		.strict(),
);

const inventoryvaluationquerySchema = lazySchema(() =>
	z
		.object({
			qzurl: z.string().optional(),
			date_macro: z.string().optional(),
			item: z.string().optional(),
			report_date: z.string().optional(),
			sort_order: z.string().optional(),
			summarize_column_by: z.string().optional(),
		})
		.strict(),
);

const paymentlineSchema = lazySchema(() =>
	z
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
			PaymentLineDetail: paymentlinedetailSchema(),
			Id: z.string().optional(),
		})
		.strict(),
);

const customerrequestSchema = lazySchema(() =>
	z
		.object({
			DisplayName: z.string().optional(),
			Suffix: z.string().optional(),
			Title: z.string().optional(),
			MiddleName: z.string().optional(),
			FamilyName: z.string().optional(),
			GivenName: z.string().optional(),
		})
		.strict(),
);

const taxagencyresponseSchema = lazySchema(() =>
	z
		.object({
			SyncToken: z.string().optional(),
			TaxAgencyConfig: z.string().optional(),
			DisplayName: z.string(),
			TaxTrackedOnSales: z.boolean().optional(),
			TaxTrackedOnPurchases: z.boolean().optional(),
			LastFileDate: z.string().optional(),
			Id: z.string(),
			TaxRegistrationNumber: z.string().optional(),
			MetaData: modificationmetadataSchema().optional(),
		})
		.strict(),
);

const batchrequestSchema = lazySchema(() =>
	z
		.object({
			BatchItemRequest: z.string(),
		})
		.strict(),
);

const customertyperesponseSchema = lazySchema(() =>
	z
		.object({
			Active: z.boolean().optional(),
			SyncToken: z.string().optional(),
			MetaData: modificationmetadataSchema().optional(),
			Name: z.string().optional(),
			Id: z.string(),
		})
		.strict(),
);

const itemreftypeSchema = lazySchema(() =>
	z
		.object({
			type: z.string().optional(),
			name: z.string().optional(),
			value: z.string(),
		})
		.strict(),
);

const generalledgerquerySchema = lazySchema(() =>
	z
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
		.strict(),
);

const agedreceivabledetailquerySchema = lazySchema(() =>
	z
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
		.strict(),
);

const reimbursechargelineSchema = lazySchema(() =>
	z
		.object({
			LinkedTxn: z.array(linkedtxnSchema()).optional(),
			LineNum: z.number().optional(),
			ReimburseLineDetail: discountlinedetailSchema(),
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
		.strict(),
);

const projectestimaterequestSchema = lazySchema(() =>
	z
		.object({
			ProjectRef: referencetypeSchema().optional(),
			Line: z.array(saleslineSchema()),
			CustomerRef: referencetypeSchema(),
			CurrencyRef: currencyrefSchema().optional(),
		})
		.strict(),
);

const agedreceivablesreportrowsSchema = lazySchema(() =>
	z
		.object({
			Row: z.array(reportRowSchema()).optional(),
		})
		.strict(),
);

const agedreceivablestoplevelSchema = lazySchema(() =>
	z
		.object({
			Header: reportheaderSchema().optional(),
			Rows: agedreceivablesreportrowsSchema().optional(),
			Columns: reportcolumnsSchema().optional(),
		})
		.strict(),
);

const taxserviceresponseSchema = lazySchema(() =>
	z
		.object({
			TaxCodeId: z.string().optional(),
			TaxCode: z.string(),
			TaxRateDetails: z.array(taxratedetailsSchema()),
		})
		.strict(),
);

const taxservicerequestSchema = lazySchema(() =>
	z
		.object({
			TaxCode: z.string(),
			TaxRateDetails: z.array(taxratedetailsSchema()),
		})
		.strict(),
);

const categoryrequestSchema = lazySchema(() =>
	z
		.object({
			SubItem: z.boolean().optional(),
			// Any other Type creates an ordinary item through the same /item route.
			Type: z.literal('Category'),
			Name: z.string(),
			ParentRef: referencetypeSchema().optional(),
		})
		.strict(),
);

const transferrequestSchema = lazySchema(() =>
	z
		.object({
			Amount: z.number(),
			ToAccountRef: referencetypeSchema(),
			FromAccountRef: referencetypeSchema(),
		})
		.strict(),
);

const customertyperefSchema = lazySchema(() =>
	z
		.object({
			value: z.string(),
		})
		.strict(),
);

const customerresponseSchema = lazySchema(() =>
	z
		.object({
			PrimaryEmailAddr: emailaddressSchema().optional(),
			DisplayName: z.string().optional(),
			Title: z.string().optional(),
			ResaleNum: z.string().optional(),
			SecondaryTaxIdentifier: z.string().optional(),
			DefaultTaxCodeRef: referencetypeSchema().optional(),
			PreferredDeliveryMethod: z.string().optional(),
			GivenName: z.string().optional(),
			SalesTermRef: referencetypeSchema().optional(),
			CustomerTypeRef: customertyperefSchema().optional(),
			FullyQualifiedName: z.string().optional(),
			Fax: telephonenumber30Schema().optional(),
			BillWithParent: z.boolean().optional(),
			CurrencyRef: referencetypeSchema().optional(),
			Mobile: telephonenumber30Schema().optional(),
			Job: z.boolean().optional(),
			BalanceWithJobs: z.number().optional(),
			PrimaryPhone: telephonenumber30Schema().optional(),
			OpenBalanceDate: z.string().optional(),
			Taxable: z.boolean().optional(),
			AlternatePhone: telephonenumber30Schema().optional(),
			MetaData: modificationmetadataSchema().optional(),
			ParentRef: referencetypeSchema().optional(),
			Level: z.number().int().optional(),
			MiddleName: z.string().optional(),
			Notes: z.string().optional(),
			TaxExemptionReasonId: z.string().optional(),
			WebAddr: websiteaddressSchema().optional(),
			Active: z.boolean().optional(),
			CompanyName: z.string().optional(),
			Balance: z.number().optional(),
			SyncToken: z.string().optional(),
			ShipAddr: physicaladdressSchema().optional(),
			PaymentMethodRef: referencetypeSchema().optional(),
			Suffix: z.string().optional(),
			IsProject: z.boolean().optional(),
			Source: z.string().optional(),
			FamilyName: z.string().optional(),
			PrimaryTaxIdentifier: z.string().optional(),
			PrintOnCheckName: z.string().optional(),
			BillAddr: physicaladdressSchema().optional(),
			Id: z.string(),
		})
		.strict(),
);

const batchresponseSchema = lazySchema(() =>
	z
		.object({
			BatchItemResponse: z.string(),
		})
		.strict(),
);

const customfieldboolsalesSchema = lazySchema(() =>
	z
		.object({
			BooleanValue: z.boolean().optional(),
			Type: z
				.enum(['StringType', 'BooleanType', 'NumberType', 'DateType'])
				.optional(),
			Name: z.string().optional(),
		})
		.strict(),
);

const creditmemorequestSchema = lazySchema(() =>
	z
		.object({
			ProjectRef: referencetypeSchema().optional(),
			Line: z.array(saleslineSchema()),
			CustomerRef: referencetypeSchema(),
			CurrencyRef: currencyrefSchema().optional(),
		})
		.strict(),
);

const inventoryadjustmentdeleterequestSchema = lazySchema(() =>
	z
		.object({
			SyncToken: z.string(),
			id: z.string(),
		})
		.strict(),
);

const deleterequestSchema = lazySchema(() =>
	z
		.object({
			SyncToken: z.string(),
			id: z.string(),
		})
		.strict(),
);

const voidrequestSchema = lazySchema(() =>
	z
		.object({
			SyncToken: z.string(),
			id: z.string(),
			sparse: z.string(),
		})
		.strict(),
);

const transferresponseSchema = lazySchema(() =>
	z
		.object({
			SyncToken: z.string().optional(),
			PrivateNote: z.string().optional(),
			RecurDataRef: referencetypeSchema().optional(),
			TxnDate: z.string().optional(),
			ToAccountRef: referencetypeSchema(),
			Amount: z.number(),
			Id: z.string(),
			FromAccountRef: referencetypeSchema(),
			MetaData: modificationmetadataSchema().optional(),
		})
		.strict(),
);

const refundreceiptrequestSchema = lazySchema(() =>
	z
		.object({
			CurrencyRef: currencyrefSchema().optional(),
			ProjectRef: referencetypeSchema().optional(),
			DepositToAccountRef: referencetypeSchema(),
			Line: z.array(saleslineSchema()),
		})
		.strict(),
);

const creditmemoSchema = lazySchema(() =>
	z
		.object({
			TxnDate: z.string().optional(),
			CurrencyRef: z.string().optional(),
			HomeBalance: z.number().optional(),
			ShipDate: z.string().optional(),
			TrackingNum: z.string().optional(),
			PrintStatus: z.string().optional(),
			CustomField: z.array(customfieldSchema()).optional(),
			SalesTermRef: referencetypeSchema().optional(),
			GlobalTaxCalculation: z
				.enum(['TaxInclusive', 'TaxExcluded', 'NotApplicable'])
				.optional(),
			TotalAmt: z.number().optional(),
			DueDate: z.string().optional(),
			MetaData: modificationmetadataSchema().optional(),
			DocNumber: z.string().optional(),
			PrivateNote: z.string().optional(),
			DepositToAccountRef: referencetypeSchema().optional(),
			Line: z.array(saleslineSchema()).optional(),
			CustomerMemo: memorefSchema().optional(),
			EmailStatus: z.string().optional(),
			ProjectRef: referencetypeSchema().optional(),
			TaxExemptionRef: referencetypeSchema().optional(),
			Deposit: z.number().optional(),
			Balance: z.number().optional(),
			CustomerRef: referencetypeSchema(),
			TxnTaxDetail: txntaxdetailSchema().optional(),
			SyncToken: z.string().optional(),
			ExchangeRate: z.number().optional(),
			ShipAddr: physicaladdressSchema().optional(),
			HomeTotalAmt: z.number().optional(),
			DepartmentRef: referencetypeSchema().optional(),
			ShipMethodRef: referencetypeSchema().optional(),
			BillAddr: physicaladdressSchema().optional(),
			ApplyTaxAfterDiscount: z.boolean().optional(),
			BillEmail: emailaddressSchema().optional(),
			Id: z.string(),
		})
		.strict(),
);

const customerbalancequerySchema = lazySchema(() =>
	z
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
		.strict(),
);

const generalledgerqueryFRSchema = lazySchema(() =>
	z
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
		.strict(),
);

const paymentrequestSchema = lazySchema(() =>
	z
		.object({
			TotalAmt: z.number(),
			ProjectRef: referencetypeSchema().optional(),
			CustomerRef: referencetypeSchema(),
			CurrencyRef: currencyrefSchema().optional(),
			// Payment inherits Transaction.Line; the v75 XSD permits LinkedTxn allocations.
			Line: z.array(linelinkedtxnSchema()).optional(),
		})
		.strict(),
);

const itemgrouplineSchema = lazySchema(() =>
	z
		.object({
			Qty: z.string().optional(),
			ItemRef: itemreftypeSchema().optional(),
		})
		.strict(),
);

const itemgroupdetailSchema = lazySchema(() =>
	z
		.object({
			ItemGroupLine: z.array(itemgrouplineSchema()).optional(),
		})
		.strict(),
);

const companyinforesponseSchema = lazySchema(() =>
	z
		.object({
			SyncToken: z.string().optional(),
			LegalAddr: physicaladdressSchema().optional(),
			SupportedLanguages: z.string().optional(),
			CompanyName: z.string().optional(),
			Country: z.string().optional(),
			CompanyAddr: physicaladdressSchema().optional(),
			Email: emailaddressSchema().optional(),
			WebAddr: websiteaddressSchema().optional(),
			NameValue: z.array(namevalueSchema()).optional(),
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
			CustomerCommunicationAddr: physicaladdressSchema().optional(),
			PrimaryPhone: telephonenumberSchema().optional(),
			LegalName: z.string().optional(),
			CompanyStartDate: z.string().optional(),
			EmployerId: z.string().optional(),
			Id: z.string(),
			MetaData: modificationmetadataSchema().optional(),
		})
		.strict(),
);

const billpaymentrequestSchema = lazySchema(() =>
	z
		.object({
			VendorRef: referencetypeSchema(),
			CurrencyRef: currencyrefSchema().optional(),
			TotalAmt: z.number(),
			Line: z.array(linelinkedtxnSchema()),
			PayType: z.enum(['Check', 'CreditCard']),
			CreditCardPayment: billpaymentcreditcardSchema().optional(),
			CheckPayment: billpaymentcheckSchema().optional(),
		})
		.strict(),
);

const timeactivityresponseSchema = lazySchema(() =>
	z
		.object({
			TxnDate: z.string().optional(),
			NameOf: z.string(),
			ClassRef: referencetypeSchema().optional(),
			'BreakHours BreakMinutes': z.number().int().optional(),
			EndTime: z.string().optional(),
			Description: z.string().optional(),
			Hours: z.number().int().optional(),
			Taxable: z.boolean().optional(),
			MetaData: modificationmetadataSchema().optional(),
			VendorRef: referencetypeSchema().optional(),
			CostRate: z.number().optional(),
			ItemRef: referencetypeSchema().optional(),
			ProjectRef: referencetypeSchema().optional(),
			PayrollItemRef: referencetypeSchema().optional(),
			BillableStatus: z
				.enum(['Billable', 'NotBillable', 'HasBeenBilled'])
				.optional(),
			HourlyRate: z.number().optional(),
			CustomerRef: referencetypeSchema().optional(),
			SyncToken: z.string().optional(),
			EmployeeRef: referencetypeSchema().optional(),
			DepartmentRef: referencetypeSchema().optional(),
			StartTime: z.string().optional(),
			Id: z.string(),
		})
		.strict(),
);

const itemrequestSchema = lazySchema(() =>
	z
		.object({
			QtyOnHand: z.number().optional(),
			Name: z.string(),
			Type: z.string().optional(),
			IncomeAccountRef: referencetypeSchema().optional(),
			AssetAccountRef: referencetypeSchema().optional(),
			InvStartDate: z.string().optional(),
			CustomExtensions: customextensionsSchema().optional(),
			ExpenseAccountRef: referencetypeSchema().optional(),
		})
		.strict(),
);

const accountlistquerySchema = lazySchema(() =>
	z
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
		.strict(),
);

const budgetresponseSchema = lazySchema(() =>
	z
		.object({
			SyncToken: z.string().optional(),
			BudgetEntryType: z.enum(['Yearly', 'Quarterly', 'Monthly']).optional(),
			EndDate: z.string(),
			Name: z.string().optional(),
			BudgetDetail: z.array(budgetdetailSchema()).optional(),
			StartDate: z.string(),
			BudgetType: z.enum(['ProfitAndLoss', 'BalanceSheet']).optional(),
			CustomExtensions: customextensionsSchema().optional(),
			Active: z.boolean().optional(),
			Id: z.string(),
			MetaData: modificationmetadataSchema().optional(),
		})
		.strict(),
);

const depositrequestSchema = lazySchema(() =>
	z
		.object({
			ExchangeRate: z.number().optional(),
			CurrencyRef: currencyrefSchema().optional(),
			DepositToAccountRef: referencetypeSchema().optional(),
			Line: z
				.array(z.union([depositlineSchema(), linelinkedtxnSchema()]))
				.optional(),
		})
		.strict(),
);

const profitandlossquerySchema = lazySchema(() =>
	z
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
		.strict(),
);

const employeerequestSchema = lazySchema(() =>
	z
		.object({
			GivenName: z.string().optional(),
			PrimaryAddr: physicaladdressSchema().optional(),
			FamilyName: z.string().optional(),
		})
		.strict(),
);

const inventoryadjustmentresponseSchema = lazySchema(() =>
	z
		.object({
			DocNumber: z.string().optional(),
			TxnDate: z.string(),
			PrivateNote: z.string().optional(),
			SyncToken: z.string().optional(),
			Line: z.array(itemadjustmentlineSchema()),
			AdjustAccountRef: referencetypeSchema(),
			Id: z.string(),
			MetaData: modificationmetadataSchema().optional(),
		})
		.strict(),
);

const classrequestSchema = lazySchema(() =>
	z
		.object({
			Name: z.string(),
			ParentRef: referencetypeSchema().optional(),
		})
		.strict(),
);

const profitandlossdetailquerySchema = lazySchema(() =>
	z
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
		.strict(),
);

const estimateresponseSchema = lazySchema(() =>
	z
		.object({
			TxnDate: z.string().optional(),
			ShipFromAddr: physicaladdressSchema().optional(),
			CurrencyRef: currencyrefSchema().optional(),
			ShipDate: z.string().optional(),
			ClassRef: referencetypeSchema().optional(),
			PrintStatus: z.string().optional(),
			CustomField: z.array(customfieldSchema()).optional(),
			SalesTermRef: referencetypeSchema().optional(),
			TxnStatus: z.string().optional(),
			LinkedTxn: z.array(linkedtxnSchema()).optional(),
			GlobalTaxCalculation: z
				.enum(['TaxInclusive', 'TaxExcluded', 'NotApplicable'])
				.optional(),
			TotalAmt: z.number().optional(),
			AcceptedDate: z.string().optional(),
			ExpirationDate: z.string().optional(),
			DueDate: z.string().optional(),
			MetaData: modificationmetadataSchema().optional(),
			DocNumber: z.string().optional(),
			PrivateNote: z.string().optional(),
			RecurDataRef: referencetypeSchema().optional(),
			Line: z.array(saleslineSchema()).optional(),
			CustomerMemo: memorefSchema().optional(),
			EmailStatus: z.string().optional(),
			ProjectRef: referencetypeSchema().optional(),
			TaxExemptionRef: referencetypeSchema().optional(),
			CustomerRef: referencetypeSchema(),
			TxnTaxDetail: txntaxdetailSchema().optional(),
			SyncToken: z.string().optional(),
			AcceptedBy: z.string().optional(),
			ExchangeRate: z.number().optional(),
			ShipAddr: physicaladdressSchema().optional(),
			HomeTotalAmt: z.number().optional(),
			DepartmentRef: referencetypeSchema().optional(),
			ShipMethodRef: referencetypeSchema().optional(),
			BillAddr: physicaladdressSchema().optional(),
			FreeFormAddress: z.boolean().optional(),
			ApplyTaxAfterDiscount: z.boolean().optional(),
			BillEmail: emailaddressSchema().optional(),
			Id: z.string(),
		})
		.strict(),
);

const purchaseresponseSchema = lazySchema(() =>
	z
		.object({
			TxnDate: z.string().optional(),
			CurrencyRef: currencyrefSchema().optional(),
			PrintStatus: z.string().optional(),
			RemitToAddr: physicaladdressSchema().optional(),
			TxnSource: z.string().optional(),
			LinkedTxn: z.array(linkedtxnSchema()).optional(),
			GlobalTaxCalculation: z
				.enum(['TaxInclusive', 'TaxExcluded', 'NotApplicable'])
				.optional(),
			TotalAmt: z.number().optional(),
			MetaData: modificationmetadataSchema().optional(),
			DocNumber: z.string().optional(),
			PrivateNote: z.string().optional(),
			RecurDataRef: referencetypeSchema().optional(),
			Line: z.array(
				z.union([
					itembasedexpenselineSchema(),
					accountbasedexpenselineSchema(),
				]),
			),
			Credit: z.boolean().optional(),
			TxnTaxDetail: txntaxdetailSchema().optional(),
			SyncToken: z.string().optional(),
			PaymentMethodRef: referencetypeSchema().optional(),
			PurchaseEx: providerDefinedObjectSchema().optional(),
			ExchangeRate: z.number().optional(),
			DepartmentRef: referencetypeSchema().optional(),
			PaymentType: z.string(),
			EntityRef: referencetypeSchema().optional(),
			IncludeInAnnualTPAR: z.boolean().optional(),
			AccountRef: referencetypeSchema(),
			Id: z.string(),
		})
		.strict(),
);

const agedpayabledetailquerySchema = lazySchema(() =>
	z
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
		.strict(),
);

const itemsalesquerySchema = lazySchema(() =>
	z
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
		.strict(),
);

const bundleresponseSchema = lazySchema(() =>
	z
		.object({
			Sku: z.string().optional(),
			SyncToken: z.string().optional(),
			Name: z.string(),
			FullyQualifiedName: z.string().optional(),
			Type: z.string().optional(),
			PurchaseCost: z.number().optional(),
			Active: z.boolean().optional(),
			ItemGroupDetail: itemgroupdetailSchema().optional(),
			Taxable: z.boolean().optional(),
			Description: z.string().optional(),
			PrintGroupedItems: z.boolean().optional(),
			UnitPrice: z.number().optional(),
			Id: z.string(),
			MetaData: modificationmetadataSchema().optional(),
		})
		.strict(),
);

const paymentresponseSchema = lazySchema(() =>
	z
		.object({
			SyncToken: z.string().optional(),
			PrivateNote: z.string().optional(),
			PaymentMethodRef: referencetypeSchema().optional(),
			UnappliedAmt: z.number().optional(),
			DepositToAccountRef: referencetypeSchema().optional(),
			CurrencyRef: currencyrefSchema().optional(),
			// Optional: Intuit's Payment update sample omits it, and payment.update reuses this model.
			TotalAmt: z.number().optional(),
			ExchangeRate: z.number().optional(),
			Line: z.array(linelinkedtxnSchema()).optional(),
			ProjectRef: referencetypeSchema().optional(),
			TxnSource: z.string().optional(),
			PaymentRefNum: z.string().optional(),
			TxnDate: z.string().optional(),
			CreditCardPayment: creditcardpaymentSchema().optional(),
			TaxExemptionRef: referencetypeSchema().optional(),
			CustomerRef: referencetypeSchema(),
			Id: z.string(),
			MetaData: modificationmetadataSchema().optional(),
		})
		.strict(),
);

const reimbursechargeresponseSchema = lazySchema(() =>
	z
		.object({
			SyncToken: z.string().optional(),
			PrivateNote: z.string().optional(),
			LinkedTxn: z.array(linkedtxnSchema()).optional(),
			HasBeenInvoiced: z.boolean().optional(),
			CurrencyRef: currencyrefSchema().optional(),
			ExchangeRate: z.number().optional(),
			Line: z.array(reimbursechargelineSchema()),
			HomeTotalAmt: z.number().optional(),
			Amount: z.number(),
			CustomerRef: referencetypeSchema(),
			Id: z.string(),
			MetaData: modificationmetadataSchema().optional(),
		})
		.strict(),
);

const reporttoplevelSchema = lazySchema(() =>
	z
		.object({
			Header: reportheaderSchema().optional(),
			Rows: reportRowsSchema().optional(),
			Columns: reportcolumnsSchema().optional(),
		})
		.strict(),
);

const accountresponseSchema = lazySchema(() =>
	z
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
			CurrencyRef: currencyrefSchema().optional(),
			CurrentBalanceWithSubAccounts: z.number().optional(),
			AcctNum: z.string().optional(),
			TaxCodeRef: referencetypeSchema().optional(),
			ParentRef: referencetypeSchema().optional(),
			AccountSubType: z.string().optional(),
			CurrentBalance: z.number().optional(),
			Description: z.string().optional(),
			Active: z.boolean().optional(),
			MetaData: modificationmetadataSchema().optional(),
			Id: z.string(),
			Name: z.string(),
		})
		.strict(),
);

const balancesheetquerySchema = lazySchema(() =>
	z
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
		.strict(),
);

const employeeresponseSchema = lazySchema(() =>
	z
		.object({
			PrimaryEmailAddr: emailaddressSchema().optional(),
			DisplayName: z.string().optional(),
			Title: z.string().optional(),
			BillableTime: z.boolean().optional(),
			GivenName: z.string().optional(),
			V4IDPseudonym: z.string().optional(),
			BirthDate: z.string().optional(),
			MiddleName: z.string().optional(),
			SSN: z.string().optional(),
			PrimaryAddr: physicaladdressSchema().optional(),
			PrimaryPhone: telephonenumberSchema().optional(),
			Active: z.boolean().optional(),
			ReleasedDate: z.string().optional(),
			MetaData: modificationmetadataSchema().optional(),
			CostRate: z.number().optional(),
			Mobile: telephonenumberSchema().optional(),
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
		.strict(),
);

const customerincomequerySchema = lazySchema(() =>
	z
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
		.strict(),
);

// A recurring template comes back under its transaction type: { Invoice: { Id, RecurringInfo, ... } }.
const recurringtemplateSchema = lazySchema(() =>
	z.looseObject({
		Id: z.string(),
		SyncToken: z.string().optional(),
		RecurringInfo: recurringinfoSchema().optional(),
		MetaData: modificationmetadataSchema().optional(),
	}),
);

const recurringtransactionresponseSchema = lazySchema(() =>
	z
		.object({
			Bill: recurringtemplateSchema().optional(),
			CreditMemo: recurringtemplateSchema().optional(),
			Deposit: recurringtemplateSchema().optional(),
			Estimate: recurringtemplateSchema().optional(),
			Invoice: recurringtemplateSchema().optional(),
			JournalEntry: recurringtemplateSchema().optional(),
			Purchase: recurringtemplateSchema().optional(),
			PurchaseOrder: recurringtemplateSchema().optional(),
			RefundReceipt: recurringtemplateSchema().optional(),
			SalesReceipt: recurringtemplateSchema().optional(),
			Transfer: recurringtemplateSchema().optional(),
			VendorCredit: recurringtemplateSchema().optional(),
		})
		.strict(),
);

const journalentryrequestSchema = lazySchema(() =>
	z
		.object({
			CurrencyRef: currencyrefSchema().optional(),
			Line: z.array(journalentrylineSchema()),
		})
		.strict(),
);

const itemresponseSchema = lazySchema(() =>
	z
		.object({
			Sku: z.string().optional(),
			SalesTaxIncluded: z.boolean().optional(),
			TrackQtyOnHand: z.boolean().optional(),
			SalesTaxCodeRef: referencetypeSchema().optional(),
			CustomExtensions: customextensionsSchema().optional(),
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
			MetaData: modificationmetadataSchema().optional(),
			PrefVendorRef: referencetypeSchema().optional(),
			Name: z.string(),
			Level: z.number().int().optional(),
			IncomeAccountRef: referencetypeSchema().optional(),
			Active: z.boolean().optional(),
			ClassRef: referencetypeSchema().optional(),
			ExpenseAccountRef: referencetypeSchema().optional(),
			TaxClassificationRef: referencetypeSchema().optional(),
			PurchaseTaxCodeRef: referencetypeSchema().optional(),
			SyncToken: z.string().optional(),
			PurchaseCost: z.number().optional(),
			QtyOnHand: z.number().optional(),
			AssetAccountRef: referencetypeSchema().optional(),
			ParentRef: referencetypeSchema().optional(),
			UnitPrice: z.number().optional(),
			Id: z.string(),
		})
		.strict(),
);

const billresponseSchema = lazySchema(() =>
	z
		.object({
			TxnDate: z.string().optional(),
			CurrencyRef: currencyrefSchema().optional(),
			APAccountRef: referencetypeSchema().optional(),
			HomeBalance: z.number().optional(),
			SalesTermRef: referencetypeSchema().optional(),
			LinkedTxn: z.array(linkedtxnSchema()).optional(),
			GlobalTaxCalculation: z
				.enum(['TaxInclusive', 'TaxExcluded', 'NotApplicable'])
				.optional(),
			TotalAmt: z.number().optional(),
			DueDate: z.string().optional(),
			MetaData: modificationmetadataSchema().optional(),
			DocNumber: z.string().optional(),
			PrivateNote: z.string().optional(),
			VendorRef: referencetypeSchema(),
			RecurDataRef: referencetypeSchema().optional(),
			Line: z.array(
				z.union([
					itembasedexpenselinebillSchema(),
					accountbasedexpenselinebillSchema(),
				]),
			),
			Balance: z.number().optional(),
			TxnTaxDetail: txntaxdetailSchema().optional(),
			SyncToken: z.string().optional(),
			ExchangeRate: z.number().optional(),
			DepartmentRef: referencetypeSchema().optional(),
			IncludeInAnnualTPAR: z.boolean().optional(),
			Id: z.string(),
		})
		.strict(),
);

const categoryupdaterequestSchema = lazySchema(() =>
	z
		.object({
			SyncToken: z.string().optional(),
			Name: z.string(),
			Level: z.number().int().optional(),
			FullyQualifiedName: z.string().optional(),
			SubItem: z.boolean().optional(),
			ParentRef: referencetypeSchema().optional(),
			Active: z.boolean().optional(),
			Type: z.string(),
			Id: z.string(),
			MetaData: modificationmetadataSchema().optional(),
		})
		.strict(),
);

const vendorrequestSchema = lazySchema(() =>
	z
		.object({
			DisplayName: z.string().optional(),
			Suffix: z.string().optional(),
			Title: z.string().optional(),
			MiddleName: z.string().optional(),
			FamilyName: z.string().optional(),
			GivenName: z.string().optional(),
		})
		.strict(),
);

const journalreportquerySchema = lazySchema(() =>
	z
		.object({
			journal_code: z.string().optional(),
			end_date: z.string().optional(),
			date_macro: z.string().optional(),
			sort_by: z.string().optional(),
			sort_order: z.string().optional(),
			start_date: z.string().optional(),
			columns: z.string().optional(),
		})
		.strict(),
);

const salesreceiptrequestSchema = lazySchema(() =>
	z
		.object({
			CurrencyRef: currencyrefSchema().optional(),
			ProjectRef: referencetypeSchema().optional(),
			Line: z.array(saleslineSchema()),
		})
		.strict(),
);

const invoiceresponseSchema = lazySchema(() =>
	z
		.object({
			TxnDate: z.string().optional(),
			ShipFromAddr: physicaladdressSchema().optional(),
			CurrencyRef: currencyrefSchema().optional(),
			HomeBalance: z.number().optional(),
			ShipDate: z.string().optional(),
			TrackingNum: z.string().optional(),
			ClassRef: referencetypeSchema().optional(),
			PrintStatus: z.string().optional(),
			EmailStatus: z.string().optional(),
			SalesTermRef: referencetypeSchema().optional(),
			DeliveryInfo: deliveryinfoSchema().optional(),
			TxnSource: z.string().optional(),
			LinkedTxn: z.array(linkedtxnSchema()).optional(),
			DepositToAccountRef: referencetypeSchema().optional(),
			GlobalTaxCalculation: z
				.enum(['TaxInclusive', 'TaxExcluded', 'NotApplicable'])
				.optional(),
			TotalAmt: z.number().optional(),
			AllowOnlineAffirmPayment: z.boolean().optional(),
			InvoiceLink: z.string().optional(),
			AllowOnlineACHPayment: z.boolean().optional(),
			TransactionLocationType: z.string().optional(),
			DueDate: z.string().optional(),
			MetaData: modificationmetadataSchema().optional(),
			DocNumber: z.string().optional(),
			PrivateNote: z.string().optional(),
			RecurDataRef: referencetypeSchema().optional(),
			Line: z.array(saleslineSchema()),
			BillEmailCc: emailaddressSchema().optional(),
			CustomerMemo: memorefSchema().optional(),
			AllowOnlinePayPalPayment: z.boolean().optional(),
			ProjectRef: referencetypeSchema().optional(),
			ExchangeRate: z.number().optional(),
			TaxExemptionRef: referencetypeSchema().optional(),
			Deposit: z.number().optional(),
			Balance: z.number().optional(),
			CustomerRef: referencetypeSchema(),
			TxnTaxDetail: txntaxdetailSchema().optional(),
			AllowOnlineCreditCardPayment: z.boolean().optional(),
			SyncToken: z.string().optional(),
			CustomField: z.array(customfieldSchema()).optional(),
			ShipAddr: physicaladdressSchema().optional(),
			HomeTotalAmt: z.number().optional(),
			DepartmentRef: referencetypeSchema().optional(),
			BillEmailBcc: emailaddressSchema().optional(),
			ShipMethodRef: referencetypeSchema().optional(),
			BillAddr: physicaladdressSchema().optional(),
			FreeFormAddress: z.boolean().optional(),
			ApplyTaxAfterDiscount: z.boolean().optional(),
			BillEmail: emailaddressSchema().optional(),
			Id: z.string(),
			AllowOnlinePayment: z.boolean().optional(),
			AllowIPNPayment: z.boolean().optional(),
		})
		.strict(),
);

const depositresponseSchema = lazySchema(() =>
	z
		.object({
			SyncToken: z.string().optional(),
			PrivateNote: z.string().optional(),
			RecurDataRef: referencetypeSchema().optional(),
			DepositToAccountRef: referencetypeSchema(),
			GlobalTaxCalculation: z
				.enum(['TaxInclusive', 'TaxExcluded', 'NotApplicable'])
				.optional(),
			TotalAmt: z.number().optional(),
			ExchangeRate: z.number().optional(),
			CurrencyRef: currencyrefSchema().optional(),
			HomeTotalAmt: z.number().optional(),
			DepartmentRef: referencetypeSchema().optional(),
			TxnSource: z.string().optional(),
			TxnDate: z.string().optional(),
			Line: z.array(z.union([linelinkedtxnSchema(), depositlineSchema()])),
			CashBack: cashbackinfoSchema().optional(),
			Id: z.string(),
			TxnTaxDetail: txntaxdetailSchema().optional(),
			MetaData: modificationmetadataSchema().optional(),
		})
		.strict(),
);

const exchangerateresponseSchema = lazySchema(() =>
	z
		.object({
			SyncToken: z.string().optional(),
			AsOfDate: z.string().optional(),
			CustomField: z.array(customfieldSchema()).optional(),
			SourceCurrencyCode: z.string().optional(),
			Rate: z.number().optional(),
			TargetCurrencyCode: z.string().optional(),
			MetaData: modificationmetadataSchema().optional(),
		})
		.strict(),
);

const pcesalesitemlineSchema = lazySchema(() =>
	z
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
			SalesItemLineDetail: salesitemlinedetailSchema(),
			LineNum: z.number().optional(),
			Amount: z.number(),
			CostAmount: z.number(),
			HomeCostAmount: z.number(),
			Id: z.string().optional(),
		})
		.strict(),
);

const purchaseorderresponseSchema = lazySchema(() =>
	z
		.object({
			TxnDate: z.string().optional(),
			CurrencyRef: currencyrefSchema().optional(),
			CustomField: z.array(customfieldSchema()).optional(),
			APAccountRef: referencetypeSchema(),
			POEmail: emailaddressSchema().optional(),
			ClassRef: referencetypeSchema().optional(),
			SalesTermRef: referencetypeSchema().optional(),
			LinkedTxn: z.array(linkedtxnSchema()).optional(),
			GlobalTaxCalculation: z
				.enum(['TaxInclusive', 'TaxExcluded', 'NotApplicable'])
				.optional(),
			TotalAmt: z.number().optional(),
			Memo: z.string().optional(),
			POStatus: z.string().optional(),
			DueDate: z.string().optional(),
			MetaData: modificationmetadataSchema().optional(),
			DocNumber: z.string().optional(),
			PrivateNote: z.string().optional(),
			VendorRef: referencetypeSchema(),
			ShipMethodRef: referencetypeSchema().optional(),
			RecurDataRef: referencetypeSchema().optional(),
			Line: z.array(itembasedexpenselineSchema()),
			TxnTaxDetail: txntaxdetailSchema().optional(),
			SyncToken: z.string().optional(),
			ShipTo: referencetypeSchema().optional(),
			ExchangeRate: z.number().optional(),
			ShipAddr: physicaladdressSchema().optional(),
			VendorAddr: physicaladdressSchema().optional(),
			EmailStatus: z.string().optional(),
			Id: z.string(),
		})
		.strict(),
);

const vendorbalancedetailquerySchema = lazySchema(() =>
	z
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
		.strict(),
);

const vendorcreditrequestSchema = lazySchema(() =>
	z
		.object({
			CurrencyRef: currencyrefSchema().optional(),
			VendorRef: referencetypeSchema(),
			Line: z.array(
				z.union([
					accountbasedexpenselineSchema(),
					itembasedexpenselineSchema(),
				]),
			),
		})
		.strict(),
);

const transactionlistbycustomerquerySchema = lazySchema(() =>
	z
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
		.strict(),
);

const balancesheetreportrowsSchema = lazySchema(() =>
	z
		.object({
			Row: z.array(reportRowSchema()).optional(),
		})
		.strict(),
);

const classsalesquerySchema = lazySchema(() =>
	z
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
		.strict(),
);

const paymentmethodresponseSchema = lazySchema(() =>
	z
		.object({
			SyncToken: z.string().optional(),
			Name: z.string(),
			Active: z.boolean().optional(),
			Type: z.string().optional(),
			Id: z.string(),
			MetaData: modificationmetadataSchema().optional(),
		})
		.strict(),
);

const changeorderresponseSchema = lazySchema(() =>
	z
		.object({
			TxnDate: z.string().optional(),
			PrintStatus: z.string().optional(),
			TxnStatus: z.string().optional(),
			LinkedTxn: z.array(linkedtxnSchema()),
			TotalAmt: z.number().optional(),
			AcceptedDate: z.string().optional(),
			ExpirationDate: z.string().optional(),
			ApplyTaxAfterDiscount: z.boolean().optional(),
			DocNumber: z.string().optional(),
			PrivateNote: z.string().optional(),
			Line: z.array(saleslineSchema()),
			CustomerMemo: memorefSchema().optional(),
			ProjectRef: referencetypeSchema(),
			CustomerRef: referencetypeSchema(),
			TxnTaxDetail: txntaxdetailSchema().optional(),
			SyncToken: z.string().optional(),
			AcceptedBy: z.string().optional(),
			TotalCostAmount: z.number().optional(),
			EmailStatus: z.string().optional(),
			MetaData: modificationmetadataSchema().optional(),
			BillEmail: emailaddressSchema().optional(),
			Id: z.string(),
		})
		.strict(),
);

const invoicerequestSchema = lazySchema(() =>
	z
		.object({
			ProjectRef: referencetypeSchema().optional(),
			CurrencyRef: currencyrefSchema().optional(),
			CustomerRef: referencetypeSchema(),
			Line: z.array(saleslineSchema()),
		})
		.strict(),
);

// QuickBooks wraps a recurring template in its transaction type: { Invoice: { ..., RecurringInfo } }.
// Send exactly one type; the template body is the transaction's own create body.
const recurringtransactionrequestSchema = lazySchema(() =>
	z
		.object({
			Bill: z.looseObject({ RecurringInfo: recurringinfoSchema() }).optional(),
			CreditMemo: z
				.looseObject({ RecurringInfo: recurringinfoSchema() })
				.optional(),
			Deposit: z
				.looseObject({ RecurringInfo: recurringinfoSchema() })
				.optional(),
			Estimate: z
				.looseObject({ RecurringInfo: recurringinfoSchema() })
				.optional(),
			Invoice: z
				.looseObject({ RecurringInfo: recurringinfoSchema() })
				.optional(),
			JournalEntry: z
				.looseObject({ RecurringInfo: recurringinfoSchema() })
				.optional(),
			Purchase: z
				.looseObject({ RecurringInfo: recurringinfoSchema() })
				.optional(),
			PurchaseOrder: z
				.looseObject({ RecurringInfo: recurringinfoSchema() })
				.optional(),
			RefundReceipt: z
				.looseObject({ RecurringInfo: recurringinfoSchema() })
				.optional(),
			SalesReceipt: z
				.looseObject({ RecurringInfo: recurringinfoSchema() })
				.optional(),
			Transfer: z
				.looseObject({ RecurringInfo: recurringinfoSchema() })
				.optional(),
			VendorCredit: z
				.looseObject({ RecurringInfo: recurringinfoSchema() })
				.optional(),
		})
		.strict(),
);

const recurringtransactionidSchema = lazySchema(() =>
	z.object({ Id: z.string(), SyncToken: z.string() }).strict(),
);

// Delete names the template under its transaction type: { Invoice: { Id, SyncToken } }.
const recurringtransactiondeleterequestSchema = lazySchema(() =>
	z
		.object({
			Bill: recurringtransactionidSchema().optional(),
			CreditMemo: recurringtransactionidSchema().optional(),
			Deposit: recurringtransactionidSchema().optional(),
			Estimate: recurringtransactionidSchema().optional(),
			Invoice: recurringtransactionidSchema().optional(),
			JournalEntry: recurringtransactionidSchema().optional(),
			Purchase: recurringtransactionidSchema().optional(),
			PurchaseOrder: recurringtransactionidSchema().optional(),
			RefundReceipt: recurringtransactionidSchema().optional(),
			SalesReceipt: recurringtransactionidSchema().optional(),
			Transfer: recurringtransactionidSchema().optional(),
			VendorCredit: recurringtransactionidSchema().optional(),
		})
		.strict(),
);

const taxsummaryquerySchema = lazySchema(() =>
	z
		.object({
			accounting_method: z.string().optional(),
			end_date: z.string().optional(),
			date_macro: z.string().optional(),
			agency_id: z.string(),
			sort_order: z.string().optional(),
			start_date: z.string().optional(),
		})
		.strict(),
);

const taxclassificationSchema = lazySchema(() =>
	z
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
			ParentRef: referencetypeSchema(),
			Description: z.string().optional(),
		})
		.strict(),
);

const journalreportqueryUSSchema = lazySchema(() =>
	z
		.object({
			end_date: z.string().optional(),
			date_macro: z.string().optional(),
			sort_by: z.string().optional(),
			sort_order: z.string().optional(),
			start_date: z.string().optional(),
			columns: z.string().optional(),
		})
		.strict(),
);

const salesreceiptresponseSchema = lazySchema(() =>
	z
		.object({
			TxnDate: z.string().optional(),
			ShipFromAddr: physicaladdressSchema().optional(),
			CurrencyRef: currencyrefSchema().optional(),
			CustomField: z.array(customfieldSchema()).optional(),
			HomeBalance: z.number().optional(),
			ShipDate: z.string().optional(),
			TrackingNum: z.string().optional(),
			ClassRef: referencetypeSchema().optional(),
			PrintStatus: z.string().optional(),
			PaymentRefNum: z.string().optional(),
			DeliveryInfo: deliveryinfoSchema().optional(),
			TxnSource: z.string().optional(),
			LinkedTxn: z.array(linkedtxnSchema()).optional(),
			RecurDataRef: referencetypeSchema().optional(),
			GlobalTaxCalculation: z
				.enum(['TaxInclusive', 'TaxExcluded', 'NotApplicable'])
				.optional(),
			TotalAmt: z.number().optional(),
			ApplyTaxAfterDiscount: z.boolean().optional(),
			DocNumber: z.string().optional(),
			PrivateNote: z.string().optional(),
			DepositToAccountRef: referencetypeSchema().optional(),
			Line: z.array(saleslineSchema()),
			CustomerMemo: memorefSchema().optional(),
			EmailStatus: z.string().optional(),
			ProjectRef: referencetypeSchema().optional(),
			CreditCardPayment: creditcardpaymentSchema().optional(),
			Balance: z.number().optional(),
			CustomerRef: referencetypeSchema(),
			TxnTaxDetail: txntaxdetailSchema().optional(),
			SyncToken: z.string().optional(),
			PaymentMethodRef: referencetypeSchema().optional(),
			ExchangeRate: z.number().optional(),
			ShipAddr: physicaladdressSchema().optional(),
			HomeTotalAmt: z.number().optional(),
			DepartmentRef: referencetypeSchema().optional(),
			ShipMethodRef: referencetypeSchema().optional(),
			BillAddr: physicaladdressSchema().optional(),
			FreeFormAddress: z.boolean().optional(),
			MetaData: modificationmetadataSchema().optional(),
			BillEmail: emailaddressSchema().optional(),
			Id: z.string(),
		})
		.strict(),
);

const customersalesquerySchema = lazySchema(() =>
	z
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
		.strict(),
);

const estimaterequestSchema = lazySchema(() =>
	z
		.object({
			ProjectRef: referencetypeSchema().optional(),
			Line: z.array(saleslineSchema()),
			CustomerRef: referencetypeSchema(),
			CurrencyRef: currencyrefSchema().optional(),
		})
		.strict(),
);

const changeorderrequestSchema = lazySchema(() =>
	z
		.object({
			DocNumber: z.string().optional(),
			TxnStatus: z.string().optional(),
			PrivateNote: z.string().optional(),
			TxnDate: z.string().optional(),
			BillEmail: emailaddressSchema().optional(),
			CustomerMemo: memorefSchema().optional(),
			ProjectRef: referencetypeSchema(),
			PrintStatus: z.string().optional(),
			ExpirationDate: z.string().optional(),
			Line: z.array(saleslineSchema()),
			CustomerRef: referencetypeSchema(),
			EmailStatus: z.string().optional(),
		})
		.strict(),
);

// Each model is built on first read (then cached), so importing the plugin builds none.
export const QuickBooksModelSchemas = {
	get balancesheetreporttoplevel() {
		return balancesheetreporttoplevelSchema();
	},
	get classresponse() {
		return classresponseSchema();
	},
	get cashflowquery() {
		return cashflowquerySchema();
	},
	get transactionlistwithsplitsquery() {
		return transactionlistwithsplitsquerySchema();
	},
	get cashbackinfo() {
		return cashbackinfoSchema();
	},
	get itemadjustmentlinedetail() {
		return itemadjustmentlinedetailSchema();
	},
	get attachablerequest() {
		return attachablerequestSchema();
	},
	get preferencesresponse() {
		return preferencesresponseSchema();
	},
	get reimburselinedetail() {
		return reimburselinedetailSchema();
	},
	get discountlinedetail() {
		return discountlinedetailSchema();
	},
	get datetime() {
		return datetimeSchema();
	},
	get profitandlossreporttoplevel() {
		return profitandlossreporttoplevelSchema();
	},
	get purchaserequest() {
		return purchaserequestSchema();
	},
	get billrequest() {
		return billrequestSchema();
	},
	get threshold() {
		return thresholdSchema();
	},
	get inventoryadjustmentrequest() {
		return inventoryadjustmentrequestSchema();
	},
	get checkpayment() {
		return checkpaymentSchema();
	},
	get itembasedexpenselinebill() {
		return itembasedexpenselinebillSchema();
	},
	get deliveryinfo() {
		return deliveryinfoSchema();
	},
	get discountoverride() {
		return discountoverrideSchema();
	},
	get creditmemoresponse() {
		return creditmemoresponseSchema();
	},
	get trialbalancequery() {
		return trialbalancequerySchema();
	},
	get inventoryadjustmentcreaterequest() {
		return inventoryadjustmentcreaterequestSchema();
	},
	get modificationmetadata() {
		return modificationmetadataSchema();
	},
	get billpaymentcreditcard() {
		return billpaymentcreditcardSchema();
	},
	get journalentrylinedetail() {
		return journalentrylinedetailSchema();
	},
	get creditchargeinfo() {
		return creditchargeinfoSchema();
	},
	get taxpaymentresponse() {
		return taxpaymentresponseSchema();
	},
	get frenchpcgaccountlist() {
		return frenchpcgaccountlistSchema();
	},
	get websiteaddress() {
		return websiteaddressSchema();
	},
	get jobinfo() {
		return jobinfoSchema();
	},
	get contactinfo() {
		return contactinfoSchema();
	},
	get journalentryresponse() {
		return journalentryresponseSchema();
	},
	get associatedvalues() {
		return associatedvaluesSchema();
	},
	get departmentresponse() {
		return departmentresponseSchema();
	},
	get customerbalancedetailquery() {
		return customerbalancedetailquerySchema();
	},
	get customfieldstringpo() {
		return customfieldstringpoSchema();
	},
	get paymentlinedetail() {
		return paymentlinedetailSchema();
	},
	get taxlinedetail() {
		return taxlinedetailSchema();
	},
	get transactionlistreporttoplevel() {
		return transactionlistreporttoplevelSchema();
	},
	get trialbalancereportrows() {
		return trialbalancereportrowsSchema();
	},
	get categoryresponse() {
		return categoryresponseSchema();
	},
	get trialbalancereporttoplevel() {
		return trialbalancereporttoplevelSchema();
	},
	get transactionlistbyvendorquery() {
		return transactionlistbyvendorquerySchema();
	},
	get reportprefs() {
		return reportprefsSchema();
	},
	get reportoption() {
		return reportoptionSchema();
	},
	get refundreceiptresponse() {
		return refundreceiptresponseSchema();
	},
	get entity() {
		return entitySchema();
	},
	get reportheader() {
		return reportheaderSchema();
	},
	get transactionlistreportheader() {
		return transactionlistreportheaderSchema();
	},
	get accountbasedexpenselinedetail() {
		return accountbasedexpenselinedetailSchema();
	},
	get paymentmethodrequest() {
		return paymentmethodrequestSchema();
	},
	get dataservicesextensions() {
		return dataservicesextensionsSchema();
	},
	get cashflowtoplevel() {
		return cashflowtoplevelSchema();
	},
	get vendorresponse() {
		return vendorresponseSchema();
	},
	get accountrequest() {
		return accountrequestSchema();
	},
	get accountbasedexpenseline() {
		return accountbasedexpenselineSchema();
	},
	get servicetypeenum() {
		return servicetypeenumSchema();
	},
	get taxratedetails() {
		return taxratedetailsSchema();
	},
	get reportcolumns() {
		return reportcolumnsSchema();
	},
	get itembasedexpenselinedetail() {
		return itembasedexpenselinedetailSchema();
	},
	get taxrateresponse() {
		return taxrateresponseSchema();
	},
	get txntaxdetail() {
		return txntaxdetailSchema();
	},
	get memoref() {
		return memorefSchema();
	},
	get telephonenumber() {
		return telephonenumberSchema();
	},
	get invoicevoidresponse() {
		return invoicevoidresponseSchema();
	},
	get creditcardpaymentrequest() {
		return creditcardpaymentrequestSchema();
	},
	get pcesalesitemlinedetail() {
		return pcesalesitemlinedetailSchema();
	},
	get salesformspref() {
		return salesformsprefSchema();
	},
	get vendorcreditresponse() {
		return vendorcreditresponseSchema();
	},
	get budgetrequest() {
		return budgetrequestSchema();
	},
	get recurringinfo() {
		return recurringinfoSchema();
	},
	get departmentrequest() {
		return departmentrequestSchema();
	},
	get billpaymentresponse() {
		return billpaymentresponseSchema();
	},
	get taxcoderesponse() {
		return taxcoderesponseSchema();
	},
	get transactionlistquery() {
		return transactionlistquerySchema();
	},
	get vendorbalancequery() {
		return vendorbalancequerySchema();
	},
	get purchaseorderrequest() {
		return purchaseorderrequestSchema();
	},
	get profitandlossdetailstoplevel() {
		return profitandlossdetailstoplevelSchema();
	},
	get companycurrencyrequest() {
		return companycurrencyrequestSchema();
	},
	get subtotalline() {
		return subtotallineSchema();
	},
	get customfieldstringsales() {
		return customfieldstringsalesSchema();
	},
	get vendorandpurchaseprefs() {
		return vendorandpurchaseprefsSchema();
	},
	get attachableref() {
		return attachablerefSchema();
	},
	get effectivetaxratedata() {
		return effectivetaxratedataSchema();
	},
	get inventoryvaluationdetailquery() {
		return inventoryvaluationdetailquerySchema();
	},
	get markupinfo() {
		return markupinfoSchema();
	},
	get linelinkedtxn() {
		return linelinkedtxnSchema();
	},
	get departmentsalesquery() {
		return departmentsalesquerySchema();
	},
	get billpaymentcheck() {
		return billpaymentcheckSchema();
	},
	get creditchargeresponse() {
		return creditchargeresponseSchema();
	},
	get projectestimateresponse() {
		return projectestimateresponseSchema();
	},
	get taxagencyrequest() {
		return taxagencyrequestSchema();
	},
	get companycurrencyresponse() {
		return companycurrencyresponseSchema();
	},
	get reportsqueryall() {
		return reportsqueryallSchema();
	},
	get vendorexpensesquery() {
		return vendorexpensesquerySchema();
	},
	get itemreceiptline() {
		return itemreceiptlineSchema();
	},
	get customfieldboolpo() {
		return customfieldboolpoSchema();
	},
	get timetrackingprefs() {
		return timetrackingprefsSchema();
	},
	get agedpayablesquery() {
		return agedpayablesquerySchema();
	},
	get attachableresponse() {
		return attachableresponseSchema();
	},
	get cashflowreportrows() {
		return cashflowreportrowsSchema();
	},
	get agedpayablestoplevel() {
		return agedpayablestoplevelSchema();
	},
	get purchaseorderitemline() {
		return purchaseorderitemlineSchema();
	},
	get descriptiononly() {
		return descriptiononlySchema();
	},
	get agedreceivablesquery() {
		return agedreceivablesquerySchema();
	},
	get termrequest() {
		return termrequestSchema();
	},
	get depositline() {
		return depositlineSchema();
	},
	get timeactivityrequest() {
		return timeactivityrequestSchema();
	},
	get creditcardpaymentresponse() {
		return creditcardpaymentresponseSchema();
	},
	get termresponse() {
		return termresponseSchema();
	},
	get inventoryvaluationquery() {
		return inventoryvaluationquerySchema();
	},
	get paymentline() {
		return paymentlineSchema();
	},
	get customerrequest() {
		return customerrequestSchema();
	},
	get taxagencyresponse() {
		return taxagencyresponseSchema();
	},
	get batchrequest() {
		return batchrequestSchema();
	},
	get customertyperesponse() {
		return customertyperesponseSchema();
	},
	get itemreftype() {
		return itemreftypeSchema();
	},
	get generalledgerquery() {
		return generalledgerquerySchema();
	},
	get depositlinedetail() {
		return depositlinedetailSchema();
	},
	get profitandlossreportrows() {
		return profitandlossreportrowsSchema();
	},
	get agedreceivabledetailquery() {
		return agedreceivabledetailquerySchema();
	},
	get salesitemlinedetail() {
		return salesitemlinedetailSchema();
	},
	get reimbursechargeline() {
		return reimbursechargelineSchema();
	},
	get emailmessagetype() {
		return emailmessagetypeSchema();
	},
	get projectestimaterequest() {
		return projectestimaterequestSchema();
	},
	get agedreceivablestoplevel() {
		return agedreceivablestoplevelSchema();
	},
	get taxserviceresponse() {
		return taxserviceresponseSchema();
	},
	get taxservicerequest() {
		return taxservicerequestSchema();
	},
	get taxratelist() {
		return taxratelistSchema();
	},
	get discountline() {
		return discountlineSchema();
	},
	get agedreceivablesreportrows() {
		return agedreceivablesreportrowsSchema();
	},
	get categoryrequest() {
		return categoryrequestSchema();
	},
	get groupline() {
		return grouplineSchema();
	},
	get transferrequest() {
		return transferrequestSchema();
	},
	get accountinginfoprefs() {
		return accountinginfoprefsSchema();
	},
	get customerresponse() {
		return customerresponseSchema();
	},
	get recurringscheduleinfo() {
		return recurringscheduleinfoSchema();
	},
	get batchresponse() {
		return batchresponseSchema();
	},
	get customfieldboolsales() {
		return customfieldboolsalesSchema();
	},
	get taxprefs() {
		return taxprefsSchema();
	},
	get creditmemorequest() {
		return creditmemorequestSchema();
	},
	get inventoryadjustmentdeleterequest() {
		return inventoryadjustmentdeleterequestSchema();
	},
	get currencyprefs() {
		return currencyprefsSchema();
	},
	get salesitemline() {
		return salesitemlineSchema();
	},
	get customextensions() {
		return customextensionsSchema();
	},
	get deleterequest() {
		return deleterequestSchema();
	},
	get voidrequest() {
		return voidrequestSchema();
	},
	get transferresponse() {
		return transferresponseSchema();
	},
	get refundreceiptrequest() {
		return refundreceiptrequestSchema();
	},
	get creditmemo() {
		return creditmemoSchema();
	},
	get customerbalancequery() {
		return customerbalancequerySchema();
	},
	get generalledgerqueryFR() {
		return generalledgerqueryFRSchema();
	},
	get paymentrequest() {
		return paymentrequestSchema();
	},
	get itemgroupdetail() {
		return itemgroupdetailSchema();
	},
	get companyinforesponse() {
		return companyinforesponseSchema();
	},
	get emailaddress() {
		return emailaddressSchema();
	},
	get billpaymentrequest() {
		return billpaymentrequestSchema();
	},
	get timeactivityresponse() {
		return timeactivityresponseSchema();
	},
	get itemrequest() {
		return itemrequestSchema();
	},
	get physicaladdress() {
		return physicaladdressSchema();
	},
	get accountlistquery() {
		return accountlistquerySchema();
	},
	get budgetresponse() {
		return budgetresponseSchema();
	},
	get depositrequest() {
		return depositrequestSchema();
	},
	get profitandlossquery() {
		return profitandlossquerySchema();
	},
	get employeerequest() {
		return employeerequestSchema();
	},
	get itemgroupline() {
		return itemgrouplineSchema();
	},
	get line() {
		return lineSchema();
	},
	get inventoryadjustmentresponse() {
		return inventoryadjustmentresponseSchema();
	},
	get classrequest() {
		return classrequestSchema();
	},
	get profitandlossdetailquery() {
		return profitandlossdetailquerySchema();
	},
	get estimateresponse() {
		return estimateresponseSchema();
	},
	get grouplinedetail() {
		return grouplinedetailSchema();
	},
	get purchaseresponse() {
		return purchaseresponseSchema();
	},
	get agedpayabledetailquery() {
		return agedpayabledetailquerySchema();
	},
	get subtotallinedetail() {
		return subtotallinedetailSchema();
	},
	get vendorpaymentbankdetail() {
		return vendorpaymentbankdetailSchema();
	},
	get itemsalesquery() {
		return itemsalesquerySchema();
	},
	get bundleresponse() {
		return bundleresponseSchema();
	},
	get paymentresponse() {
		return paymentresponseSchema();
	},
	get reimbursechargeresponse() {
		return reimbursechargeresponseSchema();
	},
	get reporttoplevel() {
		return reporttoplevelSchema();
	},
	get creditcardpayment() {
		return creditcardpaymentSchema();
	},
	get accountresponse() {
		return accountresponseSchema();
	},
	get budgetdetail() {
		return budgetdetailSchema();
	},
	get balancesheetquery() {
		return balancesheetquerySchema();
	},
	get employeeresponse() {
		return employeeresponseSchema();
	},
	get customerincomequery() {
		return customerincomequerySchema();
	},
	get itemadjustmentline() {
		return itemadjustmentlineSchema();
	},
	get recurringtransactionresponse() {
		return recurringtransactionresponseSchema();
	},
	get linkedtxnBill() {
		return linkedtxnBillSchema();
	},
	get journalentryrequest() {
		return journalentryrequestSchema();
	},
	get currencyref() {
		return currencyrefSchema();
	},
	get itemresponse() {
		return itemresponseSchema();
	},
	get journalentryline() {
		return journalentrylineSchema();
	},
	get purchaseorderitemlinedetail() {
		return purchaseorderitemlinedetailSchema();
	},
	get billresponse() {
		return billresponseSchema();
	},
	get categoryupdaterequest() {
		return categoryupdaterequestSchema();
	},
	get vendorrequest() {
		return vendorrequestSchema();
	},
	get journalreportquery() {
		return journalreportquerySchema();
	},
	get salesreceiptrequest() {
		return salesreceiptrequestSchema();
	},
	get referencetype() {
		return referencetypeSchema();
	},
	get invoiceresponse() {
		return invoiceresponseSchema();
	},
	get depositresponse() {
		return depositresponseSchema();
	},
	get exchangerateresponse() {
		return exchangerateresponseSchema();
	},
	get pcesalesitemline() {
		return pcesalesitemlineSchema();
	},
	get purchaseorderresponse() {
		return purchaseorderresponseSchema();
	},
	get itembasedexpenseline() {
		return itembasedexpenselineSchema();
	},
	get vendorbalancedetailquery() {
		return vendorbalancedetailquerySchema();
	},
	get vendorcreditrequest() {
		return vendorcreditrequestSchema();
	},
	get transactionlistbycustomerquery() {
		return transactionlistbycustomerquerySchema();
	},
	get balancesheetreportrows() {
		return balancesheetreportrowsSchema();
	},
	get classsalesquery() {
		return classsalesquerySchema();
	},
	get paymentmethodresponse() {
		return paymentmethodresponseSchema();
	},
	get changeorderresponse() {
		return changeorderresponseSchema();
	},
	get invoicerequest() {
		return invoicerequestSchema();
	},
	get telephonenumber30() {
		return telephonenumber30Schema();
	},
	get customfield() {
		return customfieldSchema();
	},
	get customertyperef() {
		return customertyperefSchema();
	},
	get productandservicesprefs() {
		return productandservicesprefsSchema();
	},
	get recurringtransactionrequest() {
		return recurringtransactionrequestSchema();
	},
	get recurringtransactiondeleterequest() {
		return recurringtransactiondeleterequestSchema();
	},
	get taxsummaryquery() {
		return taxsummaryquerySchema();
	},
	get taxclassification() {
		return taxclassificationSchema();
	},
	get taxline() {
		return taxlineSchema();
	},
	get agedpayablesreportrows() {
		return agedpayablesreportrowsSchema();
	},
	get date() {
		return dateSchema();
	},
	get descriptiononlyline() {
		return descriptiononlylineSchema();
	},
	get journalreportqueryUS() {
		return journalreportqueryUSSchema();
	},
	get journalreportqueryus() {
		return journalreportqueryUSSchema();
	},
	get salesreceiptresponse() {
		return salesreceiptresponseSchema();
	},
	get customersalesquery() {
		return customersalesquerySchema();
	},
	get emailmessagesprefs() {
		return emailmessagesprefsSchema();
	},
	get linkedtxn() {
		return linkedtxnSchema();
	},
	get estimaterequest() {
		return estimaterequestSchema();
	},
	get changeorderrequest() {
		return changeorderrequestSchema();
	},
	get accountbasedexpenselinebill() {
		return accountbasedexpenselinebillSchema();
	},
	get taxratedetail() {
		return taxratedetailSchema();
	},
	get reportcolumn() {
		return reportcolumnSchema();
	},
	get reportrow() {
		return reportrowSchema();
	},
	get reportrows() {
		return reportrowsSchema();
	},
};
