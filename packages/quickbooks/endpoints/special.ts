import type { CorsairContext } from 'corsair/core';
import { z } from 'zod';
import type { QuickBooksEnvironment } from '../client';
import { makeAuthenticatedQuickBooksRequest } from '../client';
import { lazySchema, lazySchemaEntry } from './lazy-schema';
import { QuickBooksModelSchemas } from './models';
import { responseSchema } from './schema-mode';

const RealmIdSchema = z.string().regex(/^\d+$/);
const IdSchema = z.string().min(1);
const SyncTokenSchema = z.string().min(1);
const DeleteBodySchema = z
	.object({ Id: IdSchema, SyncToken: SyncTokenSchema })
	.strict();
type SpecialContext = CorsairContext & {
	key: string;
	_refreshAuth?: () => Promise<string>;
	options: { environment: QuickBooksEnvironment };
};
const BatchFaultSchema = lazySchema(() =>
	z
		.object({
			type: z.string().optional(),
			Error: z
				.array(
					z
						.object({
							Message: z.string().optional(),
							Detail: z.string().optional(),
							code: z.string().optional(),
							element: z.string().optional(),
						})
						.strict(),
				)
				.optional(),
		})
		.strict(),
);
const BatchItemInputSchema = lazySchema(() =>
	z.union([
		z.object({ bId: z.string().min(1), Query: z.string().min(1) }).strict(),
		z
			.object({
				bId: z.string().min(1),
				operation: z.literal('create'),
				Account: QuickBooksModelSchemas['accountrequest'],
			})
			.strict(),
		z
			.object({
				bId: z.string().min(1),
				operation: z.literal('update'),
				Account: QuickBooksModelSchemas['accountresponse']
					.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
					.strict(),
			})
			.strict(),
		z
			.object({
				bId: z.string().min(1),
				operation: z.literal('create'),
				Attachable: QuickBooksModelSchemas['attachablerequest'],
			})
			.strict(),
		z
			.object({
				bId: z.string().min(1),
				operation: z.literal('update'),
				Attachable: QuickBooksModelSchemas['attachableresponse']
					.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
					.strict(),
			})
			.strict(),
		z
			.object({
				bId: z.string().min(1),
				operation: z.literal('delete'),
				Attachable: QuickBooksModelSchemas['attachableresponse']
					.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
					.strict(),
			})
			.strict(),
		z
			.object({
				bId: z.string().min(1),
				operation: z.literal('create'),
				Bill: QuickBooksModelSchemas['billrequest'],
			})
			.strict(),
		z
			.object({
				bId: z.string().min(1),
				operation: z.literal('update'),
				Bill: QuickBooksModelSchemas['billresponse']
					.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
					.strict(),
			})
			.strict(),
		z
			.object({
				bId: z.string().min(1),
				operation: z.literal('delete'),
				Bill: DeleteBodySchema,
			})
			.strict(),
		z
			.object({
				bId: z.string().min(1),
				operation: z.literal('create'),
				BillPayment: QuickBooksModelSchemas['billpaymentrequest'],
			})
			.strict(),
		z
			.object({
				bId: z.string().min(1),
				operation: z.literal('update'),
				BillPayment: QuickBooksModelSchemas['billpaymentresponse']
					.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
					.strict(),
			})
			.strict(),
		z
			.object({
				bId: z.string().min(1),
				operation: z.literal('delete'),
				BillPayment: QuickBooksModelSchemas['voidrequest']
					.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
					.strict(),
			})
			.strict(),
		z
			.object({
				bId: z.string().min(1),
				operation: z.literal('delete'),
				BillPayment: DeleteBodySchema,
			})
			.strict(),
		z
			.object({
				bId: z.string().min(1),
				operation: z.literal('update'),
				optionsData: z.literal('void'),
				BillPayment: QuickBooksModelSchemas['billpaymentresponse']
					.partial()
					.extend({
						Id: IdSchema,
						SyncToken: SyncTokenSchema,
						sparse: z.literal(true),
					})
					.strict(),
			})
			.strict(),
		z
			.object({
				bId: z.string().min(1),
				operation: z.literal('create'),
				Budget: QuickBooksModelSchemas['budgetrequest'],
			})
			.strict(),
		z
			.object({
				bId: z.string().min(1),
				operation: z.literal('update'),
				Budget: QuickBooksModelSchemas['budgetresponse']
					.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
					.strict(),
			})
			.strict(),
		z
			.object({
				bId: z.string().min(1),
				operation: z.literal('delete'),
				Budget: DeleteBodySchema,
			})
			.strict(),
		z
			.object({
				bId: z.string().min(1),
				operation: z.literal('create'),
				ChangeOrder: QuickBooksModelSchemas['changeorderrequest'],
			})
			.strict(),
		z
			.object({
				bId: z.string().min(1),
				operation: z.literal('update'),
				ChangeOrder: QuickBooksModelSchemas['changeorderresponse']
					.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
					.strict(),
			})
			.strict(),
		z
			.object({
				bId: z.string().min(1),
				operation: z.literal('delete'),
				ChangeOrder: DeleteBodySchema,
			})
			.strict(),
		z
			.object({
				bId: z.string().min(1),
				operation: z.literal('create'),
				Class: QuickBooksModelSchemas['classrequest'],
			})
			.strict(),
		z
			.object({
				bId: z.string().min(1),
				operation: z.literal('update'),
				Class: QuickBooksModelSchemas['classresponse']
					.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
					.strict(),
			})
			.strict(),
		z
			.object({
				bId: z.string().min(1),
				operation: z.literal('create'),
				CompanyCurrency: QuickBooksModelSchemas['companycurrencyrequest'],
			})
			.strict(),
		z
			.object({
				bId: z.string().min(1),
				operation: z.literal('update'),
				CompanyCurrency: QuickBooksModelSchemas['companycurrencyresponse']
					.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
					.strict(),
			})
			.strict(),
		z
			.object({
				bId: z.string().min(1),
				operation: z.literal('update'),
				CompanyInfo: QuickBooksModelSchemas['companyinforesponse']
					.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
					.strict(),
			})
			.strict(),
		z
			.object({
				bId: z.string().min(1),
				operation: z.literal('update'),
				CompanyInfo: QuickBooksModelSchemas['companyinforesponse']
					.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
					.strict(),
			})
			.strict(),
		z
			.object({
				bId: z.string().min(1),
				operation: z.literal('create'),
				CreditCardPayment: QuickBooksModelSchemas['creditcardpaymentrequest'],
			})
			.strict(),
		z
			.object({
				bId: z.string().min(1),
				operation: z.literal('update'),
				CreditCardPayment: QuickBooksModelSchemas['creditcardpaymentrequest']
					.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
					.strict(),
			})
			.strict(),
		z
			.object({
				bId: z.string().min(1),
				operation: z.literal('update'),
				CreditCardPayment: QuickBooksModelSchemas['creditcardpaymentrequest']
					.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
					.strict(),
			})
			.strict(),
		z
			.object({
				bId: z.string().min(1),
				operation: z.literal('delete'),
				CreditCardPayment: QuickBooksModelSchemas['creditcardpaymentresponse']
					.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
					.strict(),
			})
			.strict(),
		z
			.object({
				bId: z.string().min(1),
				operation: z.literal('create'),
				CreditMemo: QuickBooksModelSchemas['creditmemorequest'],
			})
			.strict(),
		z
			.object({
				bId: z.string().min(1),
				operation: z.literal('update'),
				CreditMemo: QuickBooksModelSchemas['creditmemoresponse']
					.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
					.strict(),
			})
			.strict(),
		z
			.object({
				bId: z.string().min(1),
				operation: z.literal('delete'),
				CreditMemo: DeleteBodySchema,
			})
			.strict(),
		z
			.object({
				bId: z.string().min(1),
				operation: z.literal('create'),
				Customer: QuickBooksModelSchemas['customerrequest'],
			})
			.strict(),
		z
			.object({
				bId: z.string().min(1),
				operation: z.literal('update'),
				Customer: QuickBooksModelSchemas['customerresponse']
					.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
					.strict(),
			})
			.strict(),
		z
			.object({
				bId: z.string().min(1),
				operation: z.literal('update'),
				Customer: QuickBooksModelSchemas['customerresponse']
					.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
					.strict(),
			})
			.strict(),
		z
			.object({
				bId: z.string().min(1),
				operation: z.literal('create'),
				Department: QuickBooksModelSchemas['departmentrequest'],
			})
			.strict(),
		z
			.object({
				bId: z.string().min(1),
				operation: z.literal('update'),
				Department: QuickBooksModelSchemas['departmentresponse']
					.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
					.strict(),
			})
			.strict(),
		z
			.object({
				bId: z.string().min(1),
				operation: z.literal('create'),
				Deposit: QuickBooksModelSchemas['depositrequest'],
			})
			.strict(),
		z
			.object({
				bId: z.string().min(1),
				operation: z.literal('update'),
				Deposit: QuickBooksModelSchemas['depositresponse']
					.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
					.strict(),
			})
			.strict(),
		z
			.object({
				bId: z.string().min(1),
				operation: z.literal('update'),
				Deposit: QuickBooksModelSchemas['depositresponse']
					.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
					.strict(),
			})
			.strict(),
		z
			.object({
				bId: z.string().min(1),
				operation: z.literal('delete'),
				Deposit: DeleteBodySchema,
			})
			.strict(),
		z
			.object({
				bId: z.string().min(1),
				operation: z.literal('create'),
				Employee: QuickBooksModelSchemas['employeerequest'],
			})
			.strict(),
		z
			.object({
				bId: z.string().min(1),
				operation: z.literal('update'),
				Employee: QuickBooksModelSchemas['employeeresponse']
					.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
					.strict(),
			})
			.strict(),
		z
			.object({
				bId: z.string().min(1),
				operation: z.literal('create'),
				Estimate: QuickBooksModelSchemas['estimaterequest'],
			})
			.strict(),
		z
			.object({
				bId: z.string().min(1),
				operation: z.literal('update'),
				Estimate: QuickBooksModelSchemas['estimateresponse']
					.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
					.strict(),
			})
			.strict(),
		z
			.object({
				bId: z.string().min(1),
				operation: z.literal('update'),
				Estimate: QuickBooksModelSchemas['estimateresponse']
					.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
					.strict(),
			})
			.strict(),
		z
			.object({
				bId: z.string().min(1),
				operation: z.literal('delete'),
				Estimate: DeleteBodySchema,
			})
			.strict(),
		z
			.object({
				bId: z.string().min(1),
				operation: z.literal('update'),
				Exchangerate: QuickBooksModelSchemas['exchangerateresponse']
					.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
					.strict(),
			})
			.strict(),
		z
			.object({
				bId: z.string().min(1),
				operation: z.literal('create'),
				InventoryAdjustment:
					QuickBooksModelSchemas['inventoryadjustmentcreaterequest'],
			})
			.strict(),
		z
			.object({
				bId: z.string().min(1),
				operation: z.literal('update'),
				InventoryAdjustment: QuickBooksModelSchemas[
					'inventoryadjustmentrequest'
				]
					.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
					.strict(),
			})
			.strict(),
		z
			.object({
				bId: z.string().min(1),
				operation: z.literal('delete'),
				InventoryAdjustment: QuickBooksModelSchemas[
					'inventoryadjustmentdeleterequest'
				]
					.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
					.strict(),
			})
			.strict(),
		z
			.object({
				bId: z.string().min(1),
				operation: z.literal('create'),
				Invoice: QuickBooksModelSchemas['invoicerequest'],
			})
			.strict(),
		z
			.object({
				bId: z.string().min(1),
				operation: z.literal('update'),
				Invoice: QuickBooksModelSchemas['invoiceresponse']
					.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
					.strict(),
			})
			.strict(),
		z
			.object({
				bId: z.string().min(1),
				operation: z.literal('update'),
				Invoice: QuickBooksModelSchemas['invoicerequest']
					.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
					.strict(),
			})
			.strict(),
		z
			.object({
				bId: z.string().min(1),
				operation: z.literal('delete'),
				Invoice: DeleteBodySchema,
			})
			.strict(),
		z
			.object({
				bId: z.string().min(1),
				operation: z.literal('delete'),
				Invoice: DeleteBodySchema,
			})
			.strict(),
		z
			.object({
				bId: z.string().min(1),
				operation: z.literal('update'),
				optionsData: z.literal('void'),
				Invoice: QuickBooksModelSchemas['invoiceresponse']
					.partial()
					.extend({
						Id: IdSchema,
						SyncToken: SyncTokenSchema,
						sparse: z.literal(true),
					})
					.strict(),
			})
			.strict(),
		z
			.object({
				bId: z.string().min(1),
				operation: z.literal('create'),
				Item: QuickBooksModelSchemas['itemrequest'],
			})
			.strict(),
		z
			.object({
				bId: z.string().min(1),
				operation: z.literal('create'),
				Item: QuickBooksModelSchemas['categoryrequest'],
			})
			.strict(),
		z
			.object({
				bId: z.string().min(1),
				operation: z.literal('update'),
				Item: QuickBooksModelSchemas['itemresponse']
					.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
					.strict(),
			})
			.strict(),
		z
			.object({
				bId: z.string().min(1),
				operation: z.literal('update'),
				Item: QuickBooksModelSchemas['categoryupdaterequest']
					.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
					.strict(),
			})
			.strict(),
		z
			.object({
				bId: z.string().min(1),
				operation: z.literal('create'),
				JournalEntry: QuickBooksModelSchemas['journalentryrequest'],
			})
			.strict(),
		z
			.object({
				bId: z.string().min(1),
				operation: z.literal('update'),
				JournalEntry: QuickBooksModelSchemas['journalentryresponse']
					.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
					.strict(),
			})
			.strict(),
		z
			.object({
				bId: z.string().min(1),
				operation: z.literal('update'),
				JournalEntry: QuickBooksModelSchemas['journalentryresponse']
					.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
					.strict(),
			})
			.strict(),
		z
			.object({
				bId: z.string().min(1),
				operation: z.literal('delete'),
				JournalEntry: DeleteBodySchema,
			})
			.strict(),
		z
			.object({
				bId: z.string().min(1),
				operation: z.literal('create'),
				Payment: QuickBooksModelSchemas['paymentrequest'],
			})
			.strict(),
		z
			.object({
				bId: z.string().min(1),
				operation: z.literal('update'),
				Payment: QuickBooksModelSchemas['paymentresponse']
					.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
					.strict(),
			})
			.strict(),
		z
			.object({
				bId: z.string().min(1),
				operation: z.literal('delete'),
				Payment: DeleteBodySchema,
			})
			.strict(),
		z
			.object({
				bId: z.string().min(1),
				operation: z.literal('delete'),
				Payment: QuickBooksModelSchemas['voidrequest']
					.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
					.strict(),
			})
			.strict(),
		z
			.object({
				bId: z.string().min(1),
				operation: z.literal('update'),
				optionsData: z.literal('void'),
				Payment: QuickBooksModelSchemas['paymentresponse']
					.partial()
					.extend({
						Id: IdSchema,
						SyncToken: SyncTokenSchema,
						sparse: z.literal(true),
					})
					.strict(),
			})
			.strict(),
		z
			.object({
				bId: z.string().min(1),
				operation: z.literal('create'),
				PaymentMethod: QuickBooksModelSchemas['paymentmethodrequest'],
			})
			.strict(),
		z
			.object({
				bId: z.string().min(1),
				operation: z.literal('update'),
				PaymentMethod: QuickBooksModelSchemas['paymentmethodresponse']
					.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
					.strict(),
			})
			.strict(),
		z
			.object({
				bId: z.string().min(1),
				operation: z.literal('update'),
				Preferences: QuickBooksModelSchemas['preferencesresponse']
					.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
					.strict(),
			})
			.strict(),
		z
			.object({
				bId: z.string().min(1),
				operation: z.literal('create'),
				Purchase: QuickBooksModelSchemas['purchaserequest'],
			})
			.strict(),
		z
			.object({
				bId: z.string().min(1),
				operation: z.literal('update'),
				Purchase: QuickBooksModelSchemas['purchaseresponse']
					.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
					.strict(),
			})
			.strict(),
		z
			.object({
				bId: z.string().min(1),
				operation: z.literal('delete'),
				Purchase: DeleteBodySchema,
			})
			.strict(),
		z
			.object({
				bId: z.string().min(1),
				operation: z.literal('create'),
				PurchaseOrder: QuickBooksModelSchemas['purchaseorderrequest'],
			})
			.strict(),
		z
			.object({
				bId: z.string().min(1),
				operation: z.literal('update'),
				PurchaseOrder: QuickBooksModelSchemas['purchaseorderresponse']
					.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
					.strict(),
			})
			.strict(),
		z
			.object({
				bId: z.string().min(1),
				operation: z.literal('delete'),
				PurchaseOrder: DeleteBodySchema,
			})
			.strict(),
		z
			.object({
				bId: z.string().min(1),
				operation: z.literal('create'),
				RecurringTransaction:
					QuickBooksModelSchemas['recurringtransactionrequest'],
			})
			.strict(),
		z
			.object({
				bId: z.string().min(1),
				operation: z.literal('delete'),
				RecurringTransaction: DeleteBodySchema,
			})
			.strict(),
		z
			.object({
				bId: z.string().min(1),
				operation: z.literal('create'),
				RefundReceipt: QuickBooksModelSchemas['refundreceiptrequest'],
			})
			.strict(),
		z
			.object({
				bId: z.string().min(1),
				operation: z.literal('update'),
				RefundReceipt: QuickBooksModelSchemas['refundreceiptresponse']
					.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
					.strict(),
			})
			.strict(),
		z
			.object({
				bId: z.string().min(1),
				operation: z.literal('update'),
				RefundReceipt: QuickBooksModelSchemas['refundreceiptrequest']
					.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
					.strict(),
			})
			.strict(),
		z
			.object({
				bId: z.string().min(1),
				operation: z.literal('delete'),
				RefundReceipt: DeleteBodySchema,
			})
			.strict(),
		z
			.object({
				bId: z.string().min(1),
				operation: z.literal('create'),
				SalesReceipt: QuickBooksModelSchemas['salesreceiptrequest'],
			})
			.strict(),
		z
			.object({
				bId: z.string().min(1),
				operation: z.literal('update'),
				SalesReceipt: QuickBooksModelSchemas['salesreceiptresponse']
					.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
					.strict(),
			})
			.strict(),
		z
			.object({
				bId: z.string().min(1),
				operation: z.literal('update'),
				SalesReceipt: QuickBooksModelSchemas['salesreceiptresponse']
					.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
					.strict(),
			})
			.strict(),
		z
			.object({
				bId: z.string().min(1),
				operation: z.literal('delete'),
				SalesReceipt: DeleteBodySchema,
			})
			.strict(),
		z
			.object({
				bId: z.string().min(1),
				operation: z.literal('delete'),
				SalesReceipt: QuickBooksModelSchemas['voidrequest']
					.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
					.strict(),
			})
			.strict(),
		z
			.object({
				bId: z.string().min(1),
				operation: z.literal('update'),
				optionsData: z.literal('void'),
				SalesReceipt: QuickBooksModelSchemas['salesreceiptresponse']
					.partial()
					.extend({
						Id: IdSchema,
						SyncToken: SyncTokenSchema,
						sparse: z.literal(true),
					})
					.strict(),
			})
			.strict(),
		z
			.object({
				bId: z.string().min(1),
				operation: z.literal('create'),
				TaxAgency: QuickBooksModelSchemas['taxagencyrequest'],
			})
			.strict(),
		z
			.object({
				bId: z.string().min(1),
				operation: z.literal('create'),
				TaxService: QuickBooksModelSchemas['taxservicerequest'],
			})
			.strict(),
		z
			.object({
				bId: z.string().min(1),
				operation: z.literal('create'),
				Term: QuickBooksModelSchemas['termrequest'],
			})
			.strict(),
		z
			.object({
				bId: z.string().min(1),
				operation: z.literal('update'),
				Term: QuickBooksModelSchemas['termrequest']
					.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
					.strict(),
			})
			.strict(),
		z
			.object({
				bId: z.string().min(1),
				operation: z.literal('create'),
				TimeActivity: QuickBooksModelSchemas['timeactivityrequest'],
			})
			.strict(),
		z
			.object({
				bId: z.string().min(1),
				operation: z.literal('update'),
				TimeActivity: QuickBooksModelSchemas['timeactivityresponse']
					.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
					.strict(),
			})
			.strict(),
		z
			.object({
				bId: z.string().min(1),
				operation: z.literal('delete'),
				TimeActivity: DeleteBodySchema,
			})
			.strict(),
		z
			.object({
				bId: z.string().min(1),
				operation: z.literal('create'),
				Transfer: QuickBooksModelSchemas['transferrequest'],
			})
			.strict(),
		z
			.object({
				bId: z.string().min(1),
				operation: z.literal('update'),
				Transfer: QuickBooksModelSchemas['transferrequest']
					.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
					.strict(),
			})
			.strict(),
		z
			.object({
				bId: z.string().min(1),
				operation: z.literal('update'),
				Transfer: QuickBooksModelSchemas['transferrequest']
					.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
					.strict(),
			})
			.strict(),
		z
			.object({
				bId: z.string().min(1),
				operation: z.literal('delete'),
				Transfer: QuickBooksModelSchemas['transferresponse']
					.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
					.strict(),
			})
			.strict(),
		z
			.object({
				bId: z.string().min(1),
				operation: z.literal('create'),
				Vendor: QuickBooksModelSchemas['vendorrequest'],
			})
			.strict(),
		z
			.object({
				bId: z.string().min(1),
				operation: z.literal('update'),
				Vendor: QuickBooksModelSchemas['vendorresponse']
					.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
					.strict(),
			})
			.strict(),
		z
			.object({
				bId: z.string().min(1),
				operation: z.literal('create'),
				VendorCredit: QuickBooksModelSchemas['vendorcreditrequest'],
			})
			.strict(),
		z
			.object({
				bId: z.string().min(1),
				operation: z.literal('update'),
				VendorCredit: QuickBooksModelSchemas['vendorcreditrequest']
					.extend({ Id: IdSchema, SyncToken: SyncTokenSchema })
					.strict(),
			})
			.strict(),
		z
			.object({
				bId: z.string().min(1),
				operation: z.literal('delete'),
				VendorCredit: DeleteBodySchema,
			})
			.strict(),
	]),
);
const BatchQueryResponseSchema = lazySchema(() =>
	z.union([
		z
			.object({
				Account: z.array(QuickBooksModelSchemas['accountresponse']).optional(),
				startPosition: z.number().optional(),
				maxResults: z.number().optional(),
				totalCount: z.number().optional(),
			})
			.strict(),
		z
			.object({
				Attachable: z
					.array(QuickBooksModelSchemas['attachableresponse'])
					.optional(),
				startPosition: z.number().optional(),
				maxResults: z.number().optional(),
				totalCount: z.number().optional(),
			})
			.strict(),
		z
			.object({
				Bill: z.array(QuickBooksModelSchemas['billresponse']).optional(),
				startPosition: z.number().optional(),
				maxResults: z.number().optional(),
				totalCount: z.number().optional(),
			})
			.strict(),
		z
			.object({
				BillPayment: z
					.array(QuickBooksModelSchemas['billpaymentresponse'])
					.optional(),
				startPosition: z.number().optional(),
				maxResults: z.number().optional(),
				totalCount: z.number().optional(),
			})
			.strict(),
		z
			.object({
				Budget: z.array(QuickBooksModelSchemas['budgetresponse']).optional(),
				startPosition: z.number().optional(),
				maxResults: z.number().optional(),
				totalCount: z.number().optional(),
			})
			.strict(),
		z
			.object({
				ChangeOrder: z
					.array(QuickBooksModelSchemas['changeorderresponse'])
					.optional(),
				startPosition: z.number().optional(),
				maxResults: z.number().optional(),
				totalCount: z.number().optional(),
			})
			.strict(),
		z
			.object({
				Class: z.array(QuickBooksModelSchemas['classresponse']).optional(),
				startPosition: z.number().optional(),
				maxResults: z.number().optional(),
				totalCount: z.number().optional(),
			})
			.strict(),
		z
			.object({
				CompanyCurrency: z
					.array(QuickBooksModelSchemas['companycurrencyresponse'])
					.optional(),
				startPosition: z.number().optional(),
				maxResults: z.number().optional(),
				totalCount: z.number().optional(),
			})
			.strict(),
		z
			.object({
				CompanyInfo: z
					.array(QuickBooksModelSchemas['companyinforesponse'])
					.optional(),
				startPosition: z.number().optional(),
				maxResults: z.number().optional(),
				totalCount: z.number().optional(),
			})
			.strict(),
		z
			.object({
				CreditCardPayment: z
					.array(QuickBooksModelSchemas['creditcardpaymentresponse'])
					.optional(),
				startPosition: z.number().optional(),
				maxResults: z.number().optional(),
				totalCount: z.number().optional(),
			})
			.strict(),
		z
			.object({
				CreditMemo: z
					.array(QuickBooksModelSchemas['creditmemoresponse'])
					.optional(),
				startPosition: z.number().optional(),
				maxResults: z.number().optional(),
				totalCount: z.number().optional(),
			})
			.strict(),
		z
			.object({
				Customer: z
					.array(QuickBooksModelSchemas['customerresponse'])
					.optional(),
				startPosition: z.number().optional(),
				maxResults: z.number().optional(),
				totalCount: z.number().optional(),
			})
			.strict(),
		z
			.object({
				CustomerType: z
					.array(QuickBooksModelSchemas['customertyperesponse'])
					.optional(),
				startPosition: z.number().optional(),
				maxResults: z.number().optional(),
				totalCount: z.number().optional(),
			})
			.strict(),
		z
			.object({
				Department: z
					.array(QuickBooksModelSchemas['departmentresponse'])
					.optional(),
				startPosition: z.number().optional(),
				maxResults: z.number().optional(),
				totalCount: z.number().optional(),
			})
			.strict(),
		z
			.object({
				Deposit: z.array(QuickBooksModelSchemas['depositresponse']).optional(),
				startPosition: z.number().optional(),
				maxResults: z.number().optional(),
				totalCount: z.number().optional(),
			})
			.strict(),
		z
			.object({
				Employee: z
					.array(QuickBooksModelSchemas['employeeresponse'])
					.optional(),
				startPosition: z.number().optional(),
				maxResults: z.number().optional(),
				totalCount: z.number().optional(),
			})
			.strict(),
		z
			.object({
				Estimate: z
					.array(QuickBooksModelSchemas['estimateresponse'])
					.optional(),
				startPosition: z.number().optional(),
				maxResults: z.number().optional(),
				totalCount: z.number().optional(),
			})
			.strict(),
		z
			.object({
				Exchangerate: z
					.array(QuickBooksModelSchemas['exchangerateresponse'])
					.optional(),
				startPosition: z.number().optional(),
				maxResults: z.number().optional(),
				totalCount: z.number().optional(),
			})
			.strict(),
		z
			.object({
				InventoryAdjustment: z
					.array(QuickBooksModelSchemas['inventoryadjustmentresponse'])
					.optional(),
				startPosition: z.number().optional(),
				maxResults: z.number().optional(),
				totalCount: z.number().optional(),
			})
			.strict(),
		z
			.object({
				Invoice: z.array(QuickBooksModelSchemas['invoiceresponse']).optional(),
				startPosition: z.number().optional(),
				maxResults: z.number().optional(),
				totalCount: z.number().optional(),
			})
			.strict(),
		z
			.object({
				Item: z.array(QuickBooksModelSchemas['itemresponse']).optional(),
				startPosition: z.number().optional(),
				maxResults: z.number().optional(),
				totalCount: z.number().optional(),
			})
			.strict(),
		z
			.object({
				JournalEntry: z
					.array(QuickBooksModelSchemas['journalentryresponse'])
					.optional(),
				startPosition: z.number().optional(),
				maxResults: z.number().optional(),
				totalCount: z.number().optional(),
			})
			.strict(),
		z
			.object({
				Payment: z.array(QuickBooksModelSchemas['paymentresponse']).optional(),
				startPosition: z.number().optional(),
				maxResults: z.number().optional(),
				totalCount: z.number().optional(),
			})
			.strict(),
		z
			.object({
				PaymentMethod: z
					.array(QuickBooksModelSchemas['paymentmethodresponse'])
					.optional(),
				startPosition: z.number().optional(),
				maxResults: z.number().optional(),
				totalCount: z.number().optional(),
			})
			.strict(),
		z
			.object({
				Preferences: z
					.array(QuickBooksModelSchemas['preferencesresponse'])
					.optional(),
				startPosition: z.number().optional(),
				maxResults: z.number().optional(),
				totalCount: z.number().optional(),
			})
			.strict(),
		z
			.object({
				Purchase: z
					.array(QuickBooksModelSchemas['purchaseresponse'])
					.optional(),
				startPosition: z.number().optional(),
				maxResults: z.number().optional(),
				totalCount: z.number().optional(),
			})
			.strict(),
		z
			.object({
				PurchaseOrder: z
					.array(QuickBooksModelSchemas['purchaseorderresponse'])
					.optional(),
				startPosition: z.number().optional(),
				maxResults: z.number().optional(),
				totalCount: z.number().optional(),
			})
			.strict(),
		z
			.object({
				RecurringTransaction: z
					.array(QuickBooksModelSchemas['recurringtransactionresponse'])
					.optional(),
				startPosition: z.number().optional(),
				maxResults: z.number().optional(),
				totalCount: z.number().optional(),
			})
			.strict(),
		z
			.object({
				RefundReceipt: z
					.array(QuickBooksModelSchemas['refundreceiptresponse'])
					.optional(),
				startPosition: z.number().optional(),
				maxResults: z.number().optional(),
				totalCount: z.number().optional(),
			})
			.strict(),
		z
			.object({
				ReimburseCharge: z
					.array(QuickBooksModelSchemas['reimbursechargeresponse'])
					.optional(),
				startPosition: z.number().optional(),
				maxResults: z.number().optional(),
				totalCount: z.number().optional(),
			})
			.strict(),
		z
			.object({
				SalesReceipt: z
					.array(QuickBooksModelSchemas['salesreceiptresponse'])
					.optional(),
				startPosition: z.number().optional(),
				maxResults: z.number().optional(),
				totalCount: z.number().optional(),
			})
			.strict(),
		z
			.object({
				TaxAgency: z
					.array(QuickBooksModelSchemas['taxagencyresponse'])
					.optional(),
				startPosition: z.number().optional(),
				maxResults: z.number().optional(),
				totalCount: z.number().optional(),
			})
			.strict(),
		z
			.object({
				TaxClassification: z
					.array(QuickBooksModelSchemas['taxclassification'])
					.optional(),
				startPosition: z.number().optional(),
				maxResults: z.number().optional(),
				totalCount: z.number().optional(),
			})
			.strict(),
		z
			.object({
				TaxCode: z.array(QuickBooksModelSchemas['taxcoderesponse']).optional(),
				startPosition: z.number().optional(),
				maxResults: z.number().optional(),
				totalCount: z.number().optional(),
			})
			.strict(),
		z
			.object({
				TaxPayment: z
					.array(QuickBooksModelSchemas['taxpaymentresponse'])
					.optional(),
				startPosition: z.number().optional(),
				maxResults: z.number().optional(),
				totalCount: z.number().optional(),
			})
			.strict(),
		z
			.object({
				TaxRate: z.array(QuickBooksModelSchemas['taxrateresponse']).optional(),
				startPosition: z.number().optional(),
				maxResults: z.number().optional(),
				totalCount: z.number().optional(),
			})
			.strict(),
		z
			.object({
				TaxService: z
					.array(QuickBooksModelSchemas['taxserviceresponse'])
					.optional(),
				startPosition: z.number().optional(),
				maxResults: z.number().optional(),
				totalCount: z.number().optional(),
			})
			.strict(),
		z
			.object({
				Term: z.array(QuickBooksModelSchemas['termresponse']).optional(),
				startPosition: z.number().optional(),
				maxResults: z.number().optional(),
				totalCount: z.number().optional(),
			})
			.strict(),
		z
			.object({
				TimeActivity: z
					.array(QuickBooksModelSchemas['timeactivityresponse'])
					.optional(),
				startPosition: z.number().optional(),
				maxResults: z.number().optional(),
				totalCount: z.number().optional(),
			})
			.strict(),
		z
			.object({
				Transfer: z
					.array(QuickBooksModelSchemas['transferresponse'])
					.optional(),
				startPosition: z.number().optional(),
				maxResults: z.number().optional(),
				totalCount: z.number().optional(),
			})
			.strict(),
		z
			.object({
				Vendor: z.array(QuickBooksModelSchemas['vendorresponse']).optional(),
				startPosition: z.number().optional(),
				maxResults: z.number().optional(),
				totalCount: z.number().optional(),
			})
			.strict(),
		z
			.object({
				VendorCredit: z
					.array(QuickBooksModelSchemas['vendorcreditresponse'])
					.optional(),
				startPosition: z.number().optional(),
				maxResults: z.number().optional(),
				totalCount: z.number().optional(),
			})
			.strict(),
	]),
);
const BatchItemOutputSchema = lazySchema(() =>
	z.union([
		z
			.object({
				bId: z.string(),
				QueryResponse: BatchQueryResponseSchema(),
				Fault: BatchFaultSchema().optional(),
			})
			.strict(),
		z
			.object({
				bId: z.string(),
				Account: QuickBooksModelSchemas['accountresponse'],
			})
			.strict(),
		z
			.object({
				bId: z.string(),
				Attachable: QuickBooksModelSchemas['attachableresponse'],
			})
			.strict(),
		z
			.object({ bId: z.string(), Bill: QuickBooksModelSchemas['billresponse'] })
			.strict(),
		z
			.object({
				bId: z.string(),
				BillPayment: QuickBooksModelSchemas['billpaymentresponse'],
			})
			.strict(),
		z
			.object({
				bId: z.string(),
				Budget: QuickBooksModelSchemas['budgetresponse'],
			})
			.strict(),
		z
			.object({
				bId: z.string(),
				ChangeOrder: QuickBooksModelSchemas['changeorderresponse'],
			})
			.strict(),
		z
			.object({
				bId: z.string(),
				Class: QuickBooksModelSchemas['classresponse'],
			})
			.strict(),
		z
			.object({
				bId: z.string(),
				CompanyCurrency: QuickBooksModelSchemas['companycurrencyresponse'],
			})
			.strict(),
		z
			.object({
				bId: z.string(),
				CompanyInfo: QuickBooksModelSchemas['companyinforesponse'],
			})
			.strict(),
		z
			.object({
				bId: z.string(),
				CreditCardPayment: QuickBooksModelSchemas['creditcardpaymentresponse'],
			})
			.strict(),
		z
			.object({
				bId: z.string(),
				CreditMemo: QuickBooksModelSchemas['creditmemoresponse'],
			})
			.strict(),
		z
			.object({
				bId: z.string(),
				Customer: QuickBooksModelSchemas['customerresponse'],
			})
			.strict(),
		z
			.object({
				bId: z.string(),
				CustomerType: QuickBooksModelSchemas['customertyperesponse'],
			})
			.strict(),
		z
			.object({
				bId: z.string(),
				Department: QuickBooksModelSchemas['departmentresponse'],
			})
			.strict(),
		z
			.object({
				bId: z.string(),
				Deposit: QuickBooksModelSchemas['depositresponse'],
			})
			.strict(),
		z
			.object({
				bId: z.string(),
				Employee: QuickBooksModelSchemas['employeeresponse'],
			})
			.strict(),
		z
			.object({
				bId: z.string(),
				Estimate: QuickBooksModelSchemas['estimateresponse'],
			})
			.strict(),
		z
			.object({
				bId: z.string(),
				Exchangerate: QuickBooksModelSchemas['exchangerateresponse'],
			})
			.strict(),
		z
			.object({
				bId: z.string(),
				InventoryAdjustment:
					QuickBooksModelSchemas['inventoryadjustmentresponse'],
			})
			.strict(),
		z
			.object({
				bId: z.string(),
				Invoice: QuickBooksModelSchemas['invoiceresponse'],
			})
			.strict(),
		z
			.object({ bId: z.string(), Item: QuickBooksModelSchemas['itemresponse'] })
			.strict(),
		z
			.object({
				bId: z.string(),
				JournalEntry: QuickBooksModelSchemas['journalentryresponse'],
			})
			.strict(),
		z
			.object({
				bId: z.string(),
				Payment: QuickBooksModelSchemas['paymentresponse'],
			})
			.strict(),
		z
			.object({
				bId: z.string(),
				PaymentMethod: QuickBooksModelSchemas['paymentmethodresponse'],
			})
			.strict(),
		z
			.object({
				bId: z.string(),
				Preferences: QuickBooksModelSchemas['preferencesresponse'],
			})
			.strict(),
		z
			.object({
				bId: z.string(),
				Purchase: QuickBooksModelSchemas['purchaseresponse'],
			})
			.strict(),
		z
			.object({
				bId: z.string(),
				PurchaseOrder: QuickBooksModelSchemas['purchaseorderresponse'],
			})
			.strict(),
		z
			.object({
				bId: z.string(),
				RecurringTransaction:
					QuickBooksModelSchemas['recurringtransactionresponse'],
			})
			.strict(),
		z
			.object({
				bId: z.string(),
				RefundReceipt: QuickBooksModelSchemas['refundreceiptresponse'],
			})
			.strict(),
		z
			.object({
				bId: z.string(),
				ReimburseCharge: QuickBooksModelSchemas['reimbursechargeresponse'],
			})
			.strict(),
		z
			.object({
				bId: z.string(),
				SalesReceipt: QuickBooksModelSchemas['salesreceiptresponse'],
			})
			.strict(),
		z
			.object({
				bId: z.string(),
				TaxAgency: QuickBooksModelSchemas['taxagencyresponse'],
			})
			.strict(),
		z
			.object({
				bId: z.string(),
				TaxClassification: QuickBooksModelSchemas['taxclassification'],
			})
			.strict(),
		z
			.object({
				bId: z.string(),
				TaxCode: QuickBooksModelSchemas['taxcoderesponse'],
			})
			.strict(),
		z
			.object({
				bId: z.string(),
				TaxPayment: QuickBooksModelSchemas['taxpaymentresponse'],
			})
			.strict(),
		z
			.object({
				bId: z.string(),
				TaxRate: QuickBooksModelSchemas['taxrateresponse'],
			})
			.strict(),
		z
			.object({
				bId: z.string(),
				TaxService: QuickBooksModelSchemas['taxserviceresponse'],
			})
			.strict(),
		z
			.object({ bId: z.string(), Term: QuickBooksModelSchemas['termresponse'] })
			.strict(),
		z
			.object({
				bId: z.string(),
				TimeActivity: QuickBooksModelSchemas['timeactivityresponse'],
			})
			.strict(),
		z
			.object({
				bId: z.string(),
				Transfer: QuickBooksModelSchemas['transferresponse'],
			})
			.strict(),
		z
			.object({
				bId: z.string(),
				Vendor: QuickBooksModelSchemas['vendorresponse'],
			})
			.strict(),
		z
			.object({
				bId: z.string(),
				VendorCredit: QuickBooksModelSchemas['vendorcreditresponse'],
			})
			.strict(),
		z.object({ bId: z.string(), Fault: BatchFaultSchema() }).strict(),
	]),
);
const BatchOutputSchema = lazySchema(() =>
	z.object({ BatchItemResponse: z.array(BatchItemOutputSchema()) }).strict(),
);
const CdcEntitySchema = lazySchema(() =>
	z.enum([
		'Account',
		'Attachable',
		'Bill',
		'BillPayment',
		'Budget',
		'ChangeOrder',
		'Class',
		'CompanyCurrency',
		'CompanyInfo',
		'CreditCardPayment',
		'CreditMemo',
		'Customer',
		'CustomerType',
		'Department',
		'Deposit',
		'Employee',
		'Estimate',
		'Exchangerate',
		'InventoryAdjustment',
		'Invoice',
		'Item',
		'JournalEntry',
		'Payment',
		'PaymentMethod',
		'Preferences',
		'Purchase',
		'PurchaseOrder',
		'RecurringTransaction',
		'RefundReceipt',
		'ReimburseCharge',
		'SalesReceipt',
		'TaxClassification',
		'TaxPayment',
		'TaxService',
		'Term',
		'Transfer',
		'Vendor',
		'VendorCredit',
	]),
);
const CdcDeletedEntitySchema = lazySchema(() =>
	z
		.object({
			Id: IdSchema.optional(),
			status: z.literal('Deleted'),
			domain: z.literal('QBO').optional(),
			MetaData: z
				.object({ LastUpdatedTime: z.string().optional() })
				.strict()
				.optional(),
		})
		.strict(),
);
const CdcQueryRowSchema = lazySchema(() =>
	z.union([
		z.object({}).strict(),
		z
			.object({
				Account: z
					.array(
						z.union([
							QuickBooksModelSchemas['accountresponse'],
							CdcDeletedEntitySchema(),
						]),
					)
					.optional(),
				startPosition: z.number().optional(),
				maxResults: z.number().optional(),
				totalCount: z.number().optional(),
			})
			.strict(),
		z
			.object({
				Attachable: z
					.array(
						z.union([
							QuickBooksModelSchemas['attachableresponse'],
							CdcDeletedEntitySchema(),
						]),
					)
					.optional(),
				startPosition: z.number().optional(),
				maxResults: z.number().optional(),
				totalCount: z.number().optional(),
			})
			.strict(),
		z
			.object({
				Bill: z
					.array(
						z.union([
							QuickBooksModelSchemas['billresponse'],
							CdcDeletedEntitySchema(),
						]),
					)
					.optional(),
				startPosition: z.number().optional(),
				maxResults: z.number().optional(),
				totalCount: z.number().optional(),
			})
			.strict(),
		z
			.object({
				BillPayment: z
					.array(
						z.union([
							QuickBooksModelSchemas['billpaymentresponse'],
							CdcDeletedEntitySchema(),
						]),
					)
					.optional(),
				startPosition: z.number().optional(),
				maxResults: z.number().optional(),
				totalCount: z.number().optional(),
			})
			.strict(),
		z
			.object({
				Budget: z
					.array(
						z.union([
							QuickBooksModelSchemas['budgetresponse'],
							CdcDeletedEntitySchema(),
						]),
					)
					.optional(),
				startPosition: z.number().optional(),
				maxResults: z.number().optional(),
				totalCount: z.number().optional(),
			})
			.strict(),
		z
			.object({
				ChangeOrder: z
					.array(
						z.union([
							QuickBooksModelSchemas['changeorderresponse'],
							CdcDeletedEntitySchema(),
						]),
					)
					.optional(),
				startPosition: z.number().optional(),
				maxResults: z.number().optional(),
				totalCount: z.number().optional(),
			})
			.strict(),
		z
			.object({
				Class: z
					.array(
						z.union([
							QuickBooksModelSchemas['classresponse'],
							CdcDeletedEntitySchema(),
						]),
					)
					.optional(),
				startPosition: z.number().optional(),
				maxResults: z.number().optional(),
				totalCount: z.number().optional(),
			})
			.strict(),
		z
			.object({
				CompanyCurrency: z
					.array(
						z.union([
							QuickBooksModelSchemas['companycurrencyresponse'],
							CdcDeletedEntitySchema(),
						]),
					)
					.optional(),
				startPosition: z.number().optional(),
				maxResults: z.number().optional(),
				totalCount: z.number().optional(),
			})
			.strict(),
		z
			.object({
				CompanyInfo: z
					.array(
						z.union([
							QuickBooksModelSchemas['companyinforesponse'],
							CdcDeletedEntitySchema(),
						]),
					)
					.optional(),
				startPosition: z.number().optional(),
				maxResults: z.number().optional(),
				totalCount: z.number().optional(),
			})
			.strict(),
		z
			.object({
				CreditCardPayment: z
					.array(
						z.union([
							QuickBooksModelSchemas['creditcardpaymentresponse'],
							CdcDeletedEntitySchema(),
						]),
					)
					.optional(),
				startPosition: z.number().optional(),
				maxResults: z.number().optional(),
				totalCount: z.number().optional(),
			})
			.strict(),
		z
			.object({
				CreditMemo: z
					.array(
						z.union([
							QuickBooksModelSchemas['creditmemoresponse'],
							CdcDeletedEntitySchema(),
						]),
					)
					.optional(),
				startPosition: z.number().optional(),
				maxResults: z.number().optional(),
				totalCount: z.number().optional(),
			})
			.strict(),
		z
			.object({
				Customer: z
					.array(
						z.union([
							QuickBooksModelSchemas['customerresponse'],
							CdcDeletedEntitySchema(),
						]),
					)
					.optional(),
				startPosition: z.number().optional(),
				maxResults: z.number().optional(),
				totalCount: z.number().optional(),
			})
			.strict(),
		z
			.object({
				CustomerType: z
					.array(
						z.union([
							QuickBooksModelSchemas['customertyperesponse'],
							CdcDeletedEntitySchema(),
						]),
					)
					.optional(),
				startPosition: z.number().optional(),
				maxResults: z.number().optional(),
				totalCount: z.number().optional(),
			})
			.strict(),
		z
			.object({
				Department: z
					.array(
						z.union([
							QuickBooksModelSchemas['departmentresponse'],
							CdcDeletedEntitySchema(),
						]),
					)
					.optional(),
				startPosition: z.number().optional(),
				maxResults: z.number().optional(),
				totalCount: z.number().optional(),
			})
			.strict(),
		z
			.object({
				Deposit: z
					.array(
						z.union([
							QuickBooksModelSchemas['depositresponse'],
							CdcDeletedEntitySchema(),
						]),
					)
					.optional(),
				startPosition: z.number().optional(),
				maxResults: z.number().optional(),
				totalCount: z.number().optional(),
			})
			.strict(),
		z
			.object({
				Employee: z
					.array(
						z.union([
							QuickBooksModelSchemas['employeeresponse'],
							CdcDeletedEntitySchema(),
						]),
					)
					.optional(),
				startPosition: z.number().optional(),
				maxResults: z.number().optional(),
				totalCount: z.number().optional(),
			})
			.strict(),
		z
			.object({
				Estimate: z
					.array(
						z.union([
							QuickBooksModelSchemas['estimateresponse'],
							CdcDeletedEntitySchema(),
						]),
					)
					.optional(),
				startPosition: z.number().optional(),
				maxResults: z.number().optional(),
				totalCount: z.number().optional(),
			})
			.strict(),
		z
			.object({
				Exchangerate: z
					.array(
						z.union([
							QuickBooksModelSchemas['exchangerateresponse'],
							CdcDeletedEntitySchema(),
						]),
					)
					.optional(),
				startPosition: z.number().optional(),
				maxResults: z.number().optional(),
				totalCount: z.number().optional(),
			})
			.strict(),
		z
			.object({
				InventoryAdjustment: z
					.array(
						z.union([
							QuickBooksModelSchemas['inventoryadjustmentresponse'],
							CdcDeletedEntitySchema(),
						]),
					)
					.optional(),
				startPosition: z.number().optional(),
				maxResults: z.number().optional(),
				totalCount: z.number().optional(),
			})
			.strict(),
		z
			.object({
				Invoice: z
					.array(
						z.union([
							QuickBooksModelSchemas['invoiceresponse'],
							CdcDeletedEntitySchema(),
						]),
					)
					.optional(),
				startPosition: z.number().optional(),
				maxResults: z.number().optional(),
				totalCount: z.number().optional(),
			})
			.strict(),
		z
			.object({
				Item: z
					.array(
						z.union([
							QuickBooksModelSchemas['itemresponse'],
							CdcDeletedEntitySchema(),
						]),
					)
					.optional(),
				startPosition: z.number().optional(),
				maxResults: z.number().optional(),
				totalCount: z.number().optional(),
			})
			.strict(),
		z
			.object({
				JournalEntry: z
					.array(
						z.union([
							QuickBooksModelSchemas['journalentryresponse'],
							CdcDeletedEntitySchema(),
						]),
					)
					.optional(),
				startPosition: z.number().optional(),
				maxResults: z.number().optional(),
				totalCount: z.number().optional(),
			})
			.strict(),
		z
			.object({
				Payment: z
					.array(
						z.union([
							QuickBooksModelSchemas['paymentresponse'],
							CdcDeletedEntitySchema(),
						]),
					)
					.optional(),
				startPosition: z.number().optional(),
				maxResults: z.number().optional(),
				totalCount: z.number().optional(),
			})
			.strict(),
		z
			.object({
				PaymentMethod: z
					.array(
						z.union([
							QuickBooksModelSchemas['paymentmethodresponse'],
							CdcDeletedEntitySchema(),
						]),
					)
					.optional(),
				startPosition: z.number().optional(),
				maxResults: z.number().optional(),
				totalCount: z.number().optional(),
			})
			.strict(),
		z
			.object({
				Preferences: z
					.array(
						z.union([
							QuickBooksModelSchemas['preferencesresponse'],
							CdcDeletedEntitySchema(),
						]),
					)
					.optional(),
				startPosition: z.number().optional(),
				maxResults: z.number().optional(),
				totalCount: z.number().optional(),
			})
			.strict(),
		z
			.object({
				Purchase: z
					.array(
						z.union([
							QuickBooksModelSchemas['purchaseresponse'],
							CdcDeletedEntitySchema(),
						]),
					)
					.optional(),
				startPosition: z.number().optional(),
				maxResults: z.number().optional(),
				totalCount: z.number().optional(),
			})
			.strict(),
		z
			.object({
				PurchaseOrder: z
					.array(
						z.union([
							QuickBooksModelSchemas['purchaseorderresponse'],
							CdcDeletedEntitySchema(),
						]),
					)
					.optional(),
				startPosition: z.number().optional(),
				maxResults: z.number().optional(),
				totalCount: z.number().optional(),
			})
			.strict(),
		z
			.object({
				RecurringTransaction: z
					.array(
						z.union([
							QuickBooksModelSchemas['recurringtransactionresponse'],
							CdcDeletedEntitySchema(),
						]),
					)
					.optional(),
				startPosition: z.number().optional(),
				maxResults: z.number().optional(),
				totalCount: z.number().optional(),
			})
			.strict(),
		z
			.object({
				RefundReceipt: z
					.array(
						z.union([
							QuickBooksModelSchemas['refundreceiptresponse'],
							CdcDeletedEntitySchema(),
						]),
					)
					.optional(),
				startPosition: z.number().optional(),
				maxResults: z.number().optional(),
				totalCount: z.number().optional(),
			})
			.strict(),
		z
			.object({
				ReimburseCharge: z
					.array(
						z.union([
							QuickBooksModelSchemas['reimbursechargeresponse'],
							CdcDeletedEntitySchema(),
						]),
					)
					.optional(),
				startPosition: z.number().optional(),
				maxResults: z.number().optional(),
				totalCount: z.number().optional(),
			})
			.strict(),
		z
			.object({
				SalesReceipt: z
					.array(
						z.union([
							QuickBooksModelSchemas['salesreceiptresponse'],
							CdcDeletedEntitySchema(),
						]),
					)
					.optional(),
				startPosition: z.number().optional(),
				maxResults: z.number().optional(),
				totalCount: z.number().optional(),
			})
			.strict(),
		z
			.object({
				TaxClassification: z
					.array(
						z.union([
							QuickBooksModelSchemas['taxclassification'],
							CdcDeletedEntitySchema(),
						]),
					)
					.optional(),
				startPosition: z.number().optional(),
				maxResults: z.number().optional(),
				totalCount: z.number().optional(),
			})
			.strict(),
		z
			.object({
				TaxPayment: z
					.array(
						z.union([
							QuickBooksModelSchemas['taxpaymentresponse'],
							CdcDeletedEntitySchema(),
						]),
					)
					.optional(),
				startPosition: z.number().optional(),
				maxResults: z.number().optional(),
				totalCount: z.number().optional(),
			})
			.strict(),
		z
			.object({
				TaxService: z
					.array(
						z.union([
							QuickBooksModelSchemas['taxserviceresponse'],
							CdcDeletedEntitySchema(),
						]),
					)
					.optional(),
				startPosition: z.number().optional(),
				maxResults: z.number().optional(),
				totalCount: z.number().optional(),
			})
			.strict(),
		z
			.object({
				Term: z
					.array(
						z.union([
							QuickBooksModelSchemas['termresponse'],
							CdcDeletedEntitySchema(),
						]),
					)
					.optional(),
				startPosition: z.number().optional(),
				maxResults: z.number().optional(),
				totalCount: z.number().optional(),
			})
			.strict(),
		z
			.object({
				Transfer: z
					.array(
						z.union([
							QuickBooksModelSchemas['transferresponse'],
							CdcDeletedEntitySchema(),
						]),
					)
					.optional(),
				startPosition: z.number().optional(),
				maxResults: z.number().optional(),
				totalCount: z.number().optional(),
			})
			.strict(),
		z
			.object({
				Vendor: z
					.array(
						z.union([
							QuickBooksModelSchemas['vendorresponse'],
							CdcDeletedEntitySchema(),
						]),
					)
					.optional(),
				startPosition: z.number().optional(),
				maxResults: z.number().optional(),
				totalCount: z.number().optional(),
			})
			.strict(),
		z
			.object({
				VendorCredit: z
					.array(
						z.union([
							QuickBooksModelSchemas['vendorcreditresponse'],
							CdcDeletedEntitySchema(),
						]),
					)
					.optional(),
				startPosition: z.number().optional(),
				maxResults: z.number().optional(),
				totalCount: z.number().optional(),
			})
			.strict(),
	]),
);
const CdcOutputSchema = lazySchema(() =>
	z
		.object({
			CDCResponse: z.array(
				z.object({ QueryResponse: z.array(CdcQueryRowSchema()) }).strict(),
			),
			time: z.string(),
		})
		.strict(),
);
const CdcInputSchema = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			entities: z.array(CdcEntitySchema()).min(1),
			changedSince: z.string().datetime({ offset: true }),
		})
		.strict()
		.refine(
			(input) => {
				const changedAt = Date.parse(input.changedSince);
				const now = Date.now();
				return changedAt <= now && now - changedAt <= 30 * 24 * 60 * 60 * 1000;
			},
			{
				message: 'changedSince must be within the previous 30 days.',
				path: ['changedSince'],
			},
		),
);
const BatchOutputInputSchema = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			items: z.array(BatchItemInputSchema()).min(1).max(30),
		})
		.strict(),
);

const BATCH_ITEM_FIELDS = new Set(['bId', 'operation', 'optionsData', 'Query']);
/*
 * Batch items are checked at runtime by their envelope: a unique bId and either
 * a Query or one entity payload with its operation. The per-entity union above
 * stays the documented contract; QuickBooks validates each payload and answers
 * per item, and a sparse update carries only the fields it changes.
 */
const BatchRuntimeInputSchema = lazySchema(() =>
	z
		.object({
			realmId: RealmIdSchema,
			items: z
				.array(
					z
						.looseObject({
							bId: z.string().min(1),
							operation: z.enum(['create', 'update', 'delete']).optional(),
							optionsData: z.string().optional(),
							Query: z.string().min(1).optional(),
						})
						.superRefine((item, ctx) => {
							const entities = Object.keys(item).filter(
								(key) => !BATCH_ITEM_FIELDS.has(key),
							);
							const valid =
								item.Query !== undefined
									? entities.length === 0 && item.operation === undefined
									: entities.length === 1 &&
										item.operation !== undefined &&
										typeof item[entities[0] as string] === 'object';
							const entity = item[entities[0] as string];
							if (
								valid &&
								item.optionsData === 'void' &&
								!(
									entity &&
									typeof entity === 'object' &&
									'sparse' in entity &&
									entity.sparse === true
								)
							) {
								ctx.addIssue({
									code: 'custom',
									message:
										'A void batch item is a sparse update: its entity needs Id, SyncToken and sparse: true.',
								});
							}
							if (!valid) {
								ctx.addIssue({
									code: 'custom',
									message:
										'Each batch item needs either Query, or operation plus exactly one entity object.',
								});
							}
						}),
				)
				.min(1)
				.max(30)
				.superRefine((items, ctx) => {
					const seen = new Set<string>();
					for (const [index, item] of items.entries()) {
						if (seen.has(item.bId)) {
							ctx.addIssue({
								code: 'custom',
								message: `Duplicate bId "${item.bId}"; each batch item needs its own.`,
								path: [index, 'bId'],
							});
						}
						seen.add(item.bId);
					}
				}),
		})
		.strict(),
);

export async function executeBatch(
	ctx: SpecialContext,
	rawInput: z.input<ReturnType<typeof BatchOutputInputSchema>>,
): Promise<z.output<ReturnType<typeof BatchOutputSchema>>> {
	const input = BatchRuntimeInputSchema().parse(rawInput) as z.output<
		ReturnType<typeof BatchOutputInputSchema>
	>;
	// unknown because the shared transport returns untrusted batch response JSON before the output schema validates it.
	const response: unknown = await makeAuthenticatedQuickBooksRequest<unknown>(
		ctx,
		`company/${encodeURIComponent(input.realmId)}/batch`,
		// Intuit lets a batch run up to 120 s server-side; core's default timeout is 20 s.
		{
			method: 'POST',
			body: { BatchItemRequest: input.items },
			timeoutMs: 120_000,
		},
		ctx.options.environment,
	);
	const result = responseSchema(BatchOutputSchema(), false).parse(
		response,
	) as z.output<ReturnType<typeof BatchOutputSchema>>;
	if (!Array.isArray(result?.BatchItemResponse)) {
		// No per-item results means nobody can tell which writes landed; never report that as success.
		throw new Error(
			'QuickBooks answered the batch without BatchItemResponse. Some items may have been applied; check them before retrying.',
		);
	}
	return result;
}
export async function getChangedData(
	ctx: SpecialContext,
	rawInput: z.input<ReturnType<typeof CdcInputSchema>>,
): Promise<z.output<ReturnType<typeof CdcOutputSchema>>> {
	const input = CdcInputSchema().parse(rawInput);
	// unknown because the shared transport returns heterogeneous provider entities before the CDC schema validates them.
	const response: unknown = await makeAuthenticatedQuickBooksRequest<unknown>(
		ctx,
		`company/${encodeURIComponent(input.realmId)}/cdc`,
		{
			method: 'GET',
			query: {
				entities: input.entities.join(','),
				changedSince: input.changedSince,
			},
		},
		ctx.options.environment,
	);
	return responseSchema(CdcOutputSchema()).parse(response) as z.output<
		ReturnType<typeof CdcOutputSchema>
	>;
}

export const QuickBooksSpecialEndpoints = {
	batch: { execute: executeBatch },
	changeDataCapture: { changes: getChangedData },
} as const;
// Typed loosely on purpose: the exact types live in QuickBooksSpecialEndpointInputs/Outputs.
export const QuickBooksSpecialEndpointSchemas: Record<
	string,
	{ readonly input: z.ZodType; readonly output: z.ZodType }
> = {
	'batch.execute': lazySchemaEntry(BatchOutputInputSchema, BatchOutputSchema),
	'changeDataCapture.changes': lazySchemaEntry(CdcInputSchema, CdcOutputSchema),
};
export const QuickBooksSpecialEndpointMeta = {
	'batch.execute': {
		riskLevel: 'destructive',
		description:
			'Execute documented QuickBooks Accounting batch items in one request',
	},
	'changeDataCapture.changes': {
		riskLevel: 'read',
		description:
			'List supported QuickBooks entities changed since a recent timestamp',
	},
} as const;
export type QuickBooksSpecialEndpointInputs = {
	batchExecute: z.input<ReturnType<typeof BatchOutputInputSchema>>;
	changeDataCaptureChanges: z.input<ReturnType<typeof CdcInputSchema>>;
};
export type QuickBooksSpecialEndpointOutputs = {
	batchExecute: z.output<ReturnType<typeof BatchOutputSchema>>;
	changeDataCaptureChanges: z.output<ReturnType<typeof CdcOutputSchema>>;
};
