import {
	operations as bankAccountsOperations,
	schemas as bankAccountsSchemas,
} from './openapi/bank-accounts';
import {
	operations as bankRulesOperations,
	schemas as bankRulesSchemas,
} from './openapi/bank-rules';
import {
	operations as bankTransactionsOperations,
	schemas as bankTransactionsSchemas,
} from './openapi/bank-transactions';
import {
	operations as baseCurrencyAdjustmentOperations,
	schemas as baseCurrencyAdjustmentSchemas,
} from './openapi/base-currency-adjustment';
import {
	operations as billsOperations,
	schemas as billsSchemas,
} from './openapi/bills';
import {
	operations as categoriesOperations,
	schemas as categoriesSchemas,
} from './openapi/categories';
import {
	operations as chartOfAccountsOperations,
	schemas as chartOfAccountsSchemas,
} from './openapi/chart-of-accounts';
import {
	operations as contactPersonsOperations,
	schemas as contactPersonsSchemas,
} from './openapi/contact-persons';
import {
	operations as contactsOperations,
	schemas as contactsSchemas,
} from './openapi/contacts';
import {
	operations as creditNotesOperations,
	schemas as creditNotesSchemas,
} from './openapi/credit-notes';
import {
	operations as currencyOperations,
	schemas as currencySchemas,
} from './openapi/currency';
import {
	operations as customModulesOperations,
	schemas as customModulesSchemas,
} from './openapi/custom-modules';
import {
	operations as customerDebitNotesOperations,
	schemas as customerDebitNotesSchemas,
} from './openapi/customer-debit-notes';
import {
	operations as customerPaymentsOperations,
	schemas as customerPaymentsSchemas,
} from './openapi/customer-payments';
import {
	operations as deliveryChallansOperations,
	schemas as deliveryChallansSchemas,
} from './openapi/delivery-challans';
import {
	operations as estimatesOperations,
	schemas as estimatesSchemas,
} from './openapi/estimates';
import {
	operations as expensesOperations,
	schemas as expensesSchemas,
} from './openapi/expenses';
import {
	operations as fixedAssetsOperations,
	schemas as fixedAssetsSchemas,
} from './openapi/fixed-assets';
import {
	operations as integrationOperations,
	schemas as integrationSchemas,
} from './openapi/integration';
import {
	operations as invoicesOperations,
	schemas as invoicesSchemas,
} from './openapi/invoices';
import {
	operations as itemsOperations,
	schemas as itemsSchemas,
} from './openapi/items';
import {
	operations as journalsOperations,
	schemas as journalsSchemas,
} from './openapi/journals';
import {
	operations as locationsOperations,
	schemas as locationsSchemas,
} from './openapi/locations';
import {
	operations as openingBalanceOperations,
	schemas as openingBalanceSchemas,
} from './openapi/opening-balance';
import {
	operations as organizationsOperations,
	schemas as organizationsSchemas,
} from './openapi/organizations';
import {
	operations as pricelistsOperations,
	schemas as pricelistsSchemas,
} from './openapi/pricelists';
import {
	operations as projectsOperations,
	schemas as projectsSchemas,
} from './openapi/projects';
import {
	operations as purchaseOrderOperations,
	schemas as purchaseOrderSchemas,
} from './openapi/purchase-order';
import {
	operations as purchaseReturnsOperations,
	schemas as purchaseReturnsSchemas,
} from './openapi/purchase-returns';
import {
	operations as recurringBillsOperations,
	schemas as recurringBillsSchemas,
} from './openapi/recurring-bills';
import {
	operations as recurringExpensesOperations,
	schemas as recurringExpensesSchemas,
} from './openapi/recurring-expenses';
import {
	operations as recurringInvoicesOperations,
	schemas as recurringInvoicesSchemas,
} from './openapi/recurring-invoices';
import {
	operations as registersOperations,
	schemas as registersSchemas,
} from './openapi/registers';
import {
	operations as reportingTagsOperations,
	schemas as reportingTagsSchemas,
} from './openapi/reporting-tags';
import {
	operations as retainerInvoicesOperations,
	schemas as retainerInvoicesSchemas,
} from './openapi/retainer-invoices';
import {
	operations as salesOrderOperations,
	schemas as salesOrderSchemas,
} from './openapi/sales-order';
import {
	operations as salesReceiptOperations,
	schemas as salesReceiptSchemas,
} from './openapi/sales-receipt';
import {
	operations as selfBilledInvoicesOperations,
	schemas as selfBilledInvoicesSchemas,
} from './openapi/self-billed-invoices';
import {
	operations as tasksOperations,
	schemas as tasksSchemas,
} from './openapi/tasks';
import {
	operations as taxesOperations,
	schemas as taxesSchemas,
} from './openapi/taxes';
import {
	operations as timeEntriesOperations,
	schemas as timeEntriesSchemas,
} from './openapi/time-entries';
import {
	operations as transactionLockingOperations,
	schemas as transactionLockingSchemas,
} from './openapi/transaction-locking';
import {
	operations as usersOperations,
	schemas as usersSchemas,
} from './openapi/users';
import {
	operations as vendorCreditsOperations,
	schemas as vendorCreditsSchemas,
} from './openapi/vendor-credits';
import {
	operations as vendorPaymentsOperations,
	schemas as vendorPaymentsSchemas,
} from './openapi/vendor-payments';
import type {
	JsonValue,
	ZohoBooksExcludedOperationDefinition,
	ZohoBooksOperationDefinition,
} from './schema/openapi-types';

type OpenApiSchemaContracts = {
	bankAccounts: typeof bankAccountsSchemas;
	bankRules: typeof bankRulesSchemas;
	bankTransactions: typeof bankTransactionsSchemas;
	baseCurrencyAdjustment: typeof baseCurrencyAdjustmentSchemas;
	bills: typeof billsSchemas;
	categories: typeof categoriesSchemas;
	chartOfAccounts: typeof chartOfAccountsSchemas;
	contactPersons: typeof contactPersonsSchemas;
	contacts: typeof contactsSchemas;
	creditNotes: typeof creditNotesSchemas;
	currency: typeof currencySchemas;
	customModules: typeof customModulesSchemas;
	customerDebitNotes: typeof customerDebitNotesSchemas;
	customerPayments: typeof customerPaymentsSchemas;
	deliveryChallans: typeof deliveryChallansSchemas;
	estimates: typeof estimatesSchemas;
	expenses: typeof expensesSchemas;
	fixedAssets: typeof fixedAssetsSchemas;
	integration: typeof integrationSchemas;
	invoices: typeof invoicesSchemas;
	items: typeof itemsSchemas;
	journals: typeof journalsSchemas;
	locations: typeof locationsSchemas;
	openingBalance: typeof openingBalanceSchemas;
	organizations: typeof organizationsSchemas;
	pricelists: typeof pricelistsSchemas;
	projects: typeof projectsSchemas;
	purchaseOrder: typeof purchaseOrderSchemas;
	purchaseReturns: typeof purchaseReturnsSchemas;
	recurringBills: typeof recurringBillsSchemas;
	recurringExpenses: typeof recurringExpensesSchemas;
	recurringInvoices: typeof recurringInvoicesSchemas;
	registers: typeof registersSchemas;
	reportingTags: typeof reportingTagsSchemas;
	retainerInvoices: typeof retainerInvoicesSchemas;
	salesOrder: typeof salesOrderSchemas;
	salesReceipt: typeof salesReceiptSchemas;
	selfBilledInvoices: typeof selfBilledInvoicesSchemas;
	tasks: typeof tasksSchemas;
	taxes: typeof taxesSchemas;
	timeEntries: typeof timeEntriesSchemas;
	transactionLocking: typeof transactionLockingSchemas;
	users: typeof usersSchemas;
	vendorCredits: typeof vendorCreditsSchemas;
	vendorPayments: typeof vendorPaymentsSchemas;
};

export const openApiSchemaContracts: OpenApiSchemaContracts = {
	bankAccounts: bankAccountsSchemas,
	bankRules: bankRulesSchemas,
	bankTransactions: bankTransactionsSchemas,
	baseCurrencyAdjustment: baseCurrencyAdjustmentSchemas,
	bills: billsSchemas,
	categories: categoriesSchemas,
	chartOfAccounts: chartOfAccountsSchemas,
	contactPersons: contactPersonsSchemas,
	contacts: contactsSchemas,
	creditNotes: creditNotesSchemas,
	currency: currencySchemas,
	customModules: customModulesSchemas,
	customerDebitNotes: customerDebitNotesSchemas,
	customerPayments: customerPaymentsSchemas,
	deliveryChallans: deliveryChallansSchemas,
	estimates: estimatesSchemas,
	expenses: expensesSchemas,
	fixedAssets: fixedAssetsSchemas,
	integration: integrationSchemas,
	invoices: invoicesSchemas,
	items: itemsSchemas,
	journals: journalsSchemas,
	locations: locationsSchemas,
	openingBalance: openingBalanceSchemas,
	organizations: organizationsSchemas,
	pricelists: pricelistsSchemas,
	projects: projectsSchemas,
	purchaseOrder: purchaseOrderSchemas,
	purchaseReturns: purchaseReturnsSchemas,
	recurringBills: recurringBillsSchemas,
	recurringExpenses: recurringExpensesSchemas,
	recurringInvoices: recurringInvoicesSchemas,
	registers: registersSchemas,
	reportingTags: reportingTagsSchemas,
	retainerInvoices: retainerInvoicesSchemas,
	salesOrder: salesOrderSchemas,
	salesReceipt: salesReceiptSchemas,
	selfBilledInvoices: selfBilledInvoicesSchemas,
	tasks: tasksSchemas,
	taxes: taxesSchemas,
	timeEntries: timeEntriesSchemas,
	transactionLocking: transactionLockingSchemas,
	users: usersSchemas,
	vendorCredits: vendorCreditsSchemas,
	vendorPayments: vendorPaymentsSchemas,
};

export const openApiSchemas: Record<
	string,
	Record<string, JsonValue>
> = openApiSchemaContracts;

type ZohoBooksOperationContracts = readonly [
	...typeof bankAccountsOperations,
	...typeof bankRulesOperations,
	...typeof bankTransactionsOperations,
	...typeof baseCurrencyAdjustmentOperations,
	...typeof billsOperations,
	...typeof categoriesOperations,
	...typeof chartOfAccountsOperations,
	...typeof contactPersonsOperations,
	...typeof contactsOperations,
	...typeof creditNotesOperations,
	...typeof currencyOperations,
	...typeof customModulesOperations,
	...typeof customerDebitNotesOperations,
	...typeof customerPaymentsOperations,
	...typeof deliveryChallansOperations,
	...typeof estimatesOperations,
	...typeof expensesOperations,
	...typeof fixedAssetsOperations,
	...typeof integrationOperations,
	...typeof invoicesOperations,
	...typeof itemsOperations,
	...typeof journalsOperations,
	...typeof locationsOperations,
	...typeof openingBalanceOperations,
	...typeof organizationsOperations,
	...typeof pricelistsOperations,
	...typeof projectsOperations,
	...typeof purchaseOrderOperations,
	...typeof purchaseReturnsOperations,
	...typeof recurringBillsOperations,
	...typeof recurringExpensesOperations,
	...typeof recurringInvoicesOperations,
	...typeof registersOperations,
	...typeof reportingTagsOperations,
	...typeof retainerInvoicesOperations,
	...typeof salesOrderOperations,
	...typeof salesReceiptOperations,
	...typeof selfBilledInvoicesOperations,
	...typeof tasksOperations,
	...typeof taxesOperations,
	...typeof timeEntriesOperations,
	...typeof transactionLockingOperations,
	...typeof usersOperations,
	...typeof vendorCreditsOperations,
	...typeof vendorPaymentsOperations,
];

export const zohoBooksOperationContracts: ZohoBooksOperationContracts = [
	...bankAccountsOperations,
	...bankRulesOperations,
	...bankTransactionsOperations,
	...baseCurrencyAdjustmentOperations,
	...billsOperations,
	...categoriesOperations,
	...chartOfAccountsOperations,
	...contactPersonsOperations,
	...contactsOperations,
	...creditNotesOperations,
	...currencyOperations,
	...customModulesOperations,
	...customerDebitNotesOperations,
	...customerPaymentsOperations,
	...deliveryChallansOperations,
	...estimatesOperations,
	...expensesOperations,
	...fixedAssetsOperations,
	...integrationOperations,
	...invoicesOperations,
	...itemsOperations,
	...journalsOperations,
	...locationsOperations,
	...openingBalanceOperations,
	...organizationsOperations,
	...pricelistsOperations,
	...projectsOperations,
	...purchaseOrderOperations,
	...purchaseReturnsOperations,
	...recurringBillsOperations,
	...recurringExpensesOperations,
	...recurringInvoicesOperations,
	...registersOperations,
	...reportingTagsOperations,
	...retainerInvoicesOperations,
	...salesOrderOperations,
	...salesReceiptOperations,
	...selfBilledInvoicesOperations,
	...tasksOperations,
	...taxesOperations,
	...timeEntriesOperations,
	...transactionLockingOperations,
	...usersOperations,
	...vendorCreditsOperations,
	...vendorPaymentsOperations,
];

export const zohoBooksOperations: readonly ZohoBooksOperationDefinition[] =
	zohoBooksOperationContracts;

export const zohoBooksOAuthScopes: readonly string[] = [
	'ZohoBooks.accountants.CREATE',
	'ZohoBooks.accountants.DELETE',
	'ZohoBooks.accountants.READ',
	'ZohoBooks.accountants.UPDATE',
	'ZohoBooks.banking.CREATE',
	'ZohoBooks.banking.DELETE',
	'ZohoBooks.banking.READ',
	'ZohoBooks.banking.UPDATE',
	'ZohoBooks.bills.CREATE',
	'ZohoBooks.bills.DELETE',
	'ZohoBooks.bills.READ',
	'ZohoBooks.bills.UPDATE',
	'ZohoBooks.categories.CREATE',
	'ZohoBooks.categories.DELETE',
	'ZohoBooks.categories.READ',
	'ZohoBooks.categories.UPDATE',
	'ZohoBooks.contacts.CREATE',
	'ZohoBooks.contacts.DELETE',
	'ZohoBooks.contacts.READ',
	'ZohoBooks.contacts.UPDATE',
	'ZohoBooks.creditnotes.CREATE',
	'ZohoBooks.creditnotes.DELETE',
	'ZohoBooks.creditnotes.READ',
	'ZohoBooks.creditnotes.UPDATE',
	'ZohoBooks.customerpayments.CREATE',
	'ZohoBooks.customerpayments.DELETE',
	'ZohoBooks.customerpayments.READ',
	'ZohoBooks.customerpayments.UPDATE',
	'ZohoBooks.custommodules.ALL',
	'ZohoBooks.debitnotes.CREATE',
	'ZohoBooks.debitnotes.DELETE',
	'ZohoBooks.debitnotes.READ',
	'ZohoBooks.debitnotes.UPDATE',
	'ZohoBooks.deliverychallans.CREATE',
	'ZohoBooks.deliverychallans.DELETE',
	'ZohoBooks.deliverychallans.READ',
	'ZohoBooks.deliverychallans.UPDATE',
	'ZohoBooks.estimates.CREATE',
	'ZohoBooks.estimates.DELETE',
	'ZohoBooks.estimates.READ',
	'ZohoBooks.estimates.UPDATE',
	'ZohoBooks.expenses.CREATE',
	'ZohoBooks.expenses.DELETE',
	'ZohoBooks.expenses.READ',
	'ZohoBooks.expenses.UPDATE',
	'ZohoBooks.fixedasset.CREATE',
	'ZohoBooks.fixedasset.DELETE',
	'ZohoBooks.fixedasset.READ',
	'ZohoBooks.fixedasset.UPDATE',
	'ZohoBooks.invoices.CREATE',
	'ZohoBooks.invoices.DELETE',
	'ZohoBooks.invoices.READ',
	'ZohoBooks.invoices.UPDATE',
	'ZohoBooks.items.CREATE',
	'ZohoBooks.items.DELETE',
	'ZohoBooks.items.READ',
	'ZohoBooks.items.UPDATE',
	'ZohoBooks.projects.CREATE',
	'ZohoBooks.projects.DELETE',
	'ZohoBooks.projects.READ',
	'ZohoBooks.projects.UPDATE',
	'ZohoBooks.purchaseorders.CREATE',
	'ZohoBooks.purchaseorders.DELETE',
	'ZohoBooks.purchaseorders.READ',
	'ZohoBooks.purchaseorders.UPDATE',
	'ZohoBooks.purchasereturns.CREATE',
	'ZohoBooks.purchasereturns.DELETE',
	'ZohoBooks.purchasereturns.READ',
	'ZohoBooks.purchasereturns.UPDATE',
	'ZohoBooks.salesorders.CREATE',
	'ZohoBooks.salesorders.DELETE',
	'ZohoBooks.salesorders.READ',
	'ZohoBooks.salesorders.UPDATE',
	'ZohoBooks.settings.CREATE',
	'ZohoBooks.settings.DELETE',
	'ZohoBooks.settings.READ',
	'ZohoBooks.settings.UPDATE',
	'ZohoBooks.vendorpayments.CREATE',
	'ZohoBooks.vendorpayments.DELETE',
	'ZohoBooks.vendorpayments.READ',
	'ZohoBooks.vendorpayments.UPDATE',
];

export const zohoBooksExcludedOperations: readonly ZohoBooksExcludedOperationDefinition[] =
	[
		{
			id: 'all_tag_options',
			group: 'reportingTags',
			groupSlug: 'reporting-tags',
			name: 'allTagOptions',
			method: 'GET',
			path: '/reportingtags/(\\d+)/options/all',
			summary: 'Get all Options',
			description: 'Get all options for a reporting tag.',
			docsUrl: 'https://www.zoho.com/books/api/v3/reporting-tags/',
			parameters: [
				{
					name: 'organization_id',
					in: 'query',
					required: true,
					description: 'ID of the organization',
					schema: { type: 'string' },
				},
				{
					name: 'tag_id',
					in: 'query',
					required: true,
					description: 'ID of the reporting tag',
					schema: { type: 'string' },
				},
				{
					name: 'show_untagged',
					in: 'query',
					required: false,
					description:
						"'untagged' will be included in the response if this parameter is set to true.",
					schema: { type: 'boolean' },
				},
			],
			responses: [
				{
					status: '200',
					contentType: 'application/json',
					schema: { $ref: '#/components/schemas/all_options_response' },
				},
			],
			scopes: ['ZohoBooks.settings.READ'],
			riskLevel: 'read',
			exclusionReason:
				'Excluded: the official OpenAPI path uses a numeric regex segment but defines tag_id only as a query parameter and supplies no matching path parameter, so the actual path contract cannot be reconstructed without guessing.',
		},
	];
