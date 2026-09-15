import { z } from 'zod';

export const XeroContact = z
	.object({
		ContactID: z.string(),
		ContactNumber: z.string().optional(),
		AccountNumber: z.string().optional(),
		ContactStatus: z.string().optional(),
		Name: z.string(),
		FirstName: z.string().optional(),
		LastName: z.string().optional(),
		EmailAddress: z.string().optional(),
		BankAccountDetails: z.string().optional(),
		TaxNumber: z.string().optional(),
		IsSupplier: z.boolean().optional(),
		IsCustomer: z.boolean().optional(),
		UpdatedDateUTC: z.string().optional(),
	})
	.loose();

export const XeroInvoice = z
	.object({
		InvoiceID: z.string(),
		Type: z.string(),
		InvoiceNumber: z.string().optional(),
		Reference: z.string().optional(),
		Status: z.string().optional(),
		Date: z.string().optional(),
		DueDate: z.string().optional(),
		CurrencyCode: z.string().optional(),
		CurrencyRate: z.number().optional(),
		SubTotal: z.number().optional(),
		TotalTax: z.number().optional(),
		Total: z.number().optional(),
		AmountDue: z.number().optional(),
		AmountPaid: z.number().optional(),
		Contact: z
			.object({
				ContactID: z.string(),
				Name: z.string().optional(),
			})
			.loose()
			.optional(),
		LineItems: z.array(z.record(z.string(), z.unknown())).optional(),
		UpdatedDateUTC: z.string().optional(),
	})
	.loose();

export const XeroBankTransaction = z
	.object({
		BankTransactionID: z.string(),
		Type: z.enum(['SPEND', 'RECEIVE', 'RECEIVE-TRANSFER', 'SPEND-TRANSFER']),
		Contact: z
			.object({
				ContactID: z.string().optional(),
				Name: z.string().optional(),
			})
			.loose()
			.optional(),
		BankAccount: z
			.object({
				AccountID: z.string(),
				Code: z.string().optional(),
				Name: z.string().optional(),
			})
			.loose(),
		Date: z.string().optional(),
		Status: z.string().optional(),
		LineAmountTypes: z.string().optional(),
		SubTotal: z.number().optional(),
		TotalTax: z.number().optional(),
		Total: z.number().optional(),
		UpdatedDateUTC: z.string().optional(),
	})
	.loose();

export const XeroAccount = z
	.object({
		AccountID: z.string(),
		Code: z.string().optional(),
		Name: z.string(),
		Type: z.string(),
		Status: z.string().optional(),
		Description: z.string().optional(),
		TaxType: z.string().optional(),
		Class: z.string().optional(),
		BankAccountNumber: z.string().optional(),
		CurrencyCode: z.string().optional(),
	})
	.loose();

export const XeroItem = z
	.object({
		ItemID: z.string(),
		Code: z.string(),
		Name: z.string().optional(),
		Description: z.string().optional(),
		PurchaseDescription: z.string().optional(),
		PurchaseDetails: z.record(z.string(), z.unknown()).optional(),
		SalesDetails: z.record(z.string(), z.unknown()).optional(),
		IsSold: z.boolean().optional(),
		IsPurchased: z.boolean().optional(),
		IsTrackedAsInventory: z.boolean().optional(),
		TotalCostPool: z.number().optional(),
		QuantityOnHand: z.number().optional(),
		UpdatedDateUTC: z.string().optional(),
	})
	.loose();

export const XeroPayment = z
	.object({
		PaymentID: z.string(),
		Date: z.string().optional(),
		Amount: z.number().optional(),
		Reference: z.string().optional(),
		CurrencyRate: z.number().optional(),
		PaymentType: z.string().optional(),
		Status: z.string().optional(),
		UpdatedDateUTC: z.string().optional(),
		Invoice: z
			.object({
				InvoiceID: z.string(),
				InvoiceNumber: z.string().optional(),
			})
			.loose()
			.optional(),
		Account: z
			.object({
				AccountID: z.string(),
				Code: z.string().optional(),
			})
			.loose()
			.optional(),
	})
	.loose();

export const XeroPurchaseOrder = z
	.object({
		PurchaseOrderID: z.string(),
		PurchaseOrderNumber: z.string().optional(),
		Date: z.string().optional(),
		DeliveryDate: z.string().optional(),
		Reference: z.string().optional(),
		Status: z.string().optional(),
		Total: z.number().optional(),
		SubTotal: z.number().optional(),
		TotalTax: z.number().optional(),
		Contact: z
			.object({
				ContactID: z.string(),
				Name: z.string().optional(),
			})
			.loose()
			.optional(),
		UpdatedDateUTC: z.string().optional(),
	})
	.loose();

export const XeroCreditNote = z
	.object({
		CreditNoteID: z.string(),
		CreditNoteNumber: z.string().optional(),
		Type: z.string().optional(),
		Status: z.string().optional(),
		Total: z.number().optional(),
		RemainingCredit: z.number().optional(),
		Contact: z
			.object({
				ContactID: z.string(),
				Name: z.string().optional(),
			})
			.loose()
			.optional(),
		UpdatedDateUTC: z.string().optional(),
	})
	.loose();

export const XeroQuote = z
	.object({
		QuoteID: z.string(),
		QuoteNumber: z.string().optional(),
		Reference: z.string().optional(),
		Status: z.string().optional(),
		Total: z.number().optional(),
		SubTotal: z.number().optional(),
		TotalTax: z.number().optional(),
		Date: z.string().optional(),
		ExpiryDate: z.string().optional(),
		Contact: z
			.object({
				ContactID: z.string(),
				Name: z.string().optional(),
			})
			.loose()
			.optional(),
		UpdatedDateUTC: z.string().optional(),
	})
	.loose();

export type XeroContact = z.infer<typeof XeroContact>;
export type XeroInvoice = z.infer<typeof XeroInvoice>;
export type XeroBankTransaction = z.infer<typeof XeroBankTransaction>;
export type XeroAccount = z.infer<typeof XeroAccount>;
export type XeroItem = z.infer<typeof XeroItem>;
export type XeroPayment = z.infer<typeof XeroPayment>;
export type XeroPurchaseOrder = z.infer<typeof XeroPurchaseOrder>;
export type XeroCreditNote = z.infer<typeof XeroCreditNote>;
export type XeroQuote = z.infer<typeof XeroQuote>;
