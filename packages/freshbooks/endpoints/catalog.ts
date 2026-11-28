// Generated with endpoints/operation-types.ts from FreshBooks's OpenAPI spec:
// one entry per operation in freshbooks-manifest.json. Risk levels follow
// .github/PLUGIN_PR_RULES.md (R8).
import type {
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { freshbooksSchemaEntry } from './openapi-schema';
import { createFreshBooksOperation as op } from './operations';

export const freshbooksEndpointsNested = {
	abilities: {
		list: op('abilities.list'),
	},
	accountGateways: {
		delete: op('accountGateways.delete'),
		list: op('accountGateways.list'),
	},
	adjustmentJournalEntries: {
		create: op('adjustmentJournalEntries.create'),
		list: op('adjustmentJournalEntries.list'),
		update: op('adjustmentJournalEntries.update'),
	},
	applications: {
		create: op('applications.create'),
		list: op('applications.list'),
		update: op('applications.update'),
	},
	billPayments: {
		create: op('billPayments.create'),
		delete: op('billPayments.delete'),
		get: op('billPayments.get'),
		list: op('billPayments.list'),
		update: op('billPayments.update'),
	},
	billVendors: {
		create: op('billVendors.create'),
		delete: op('billVendors.delete'),
		get: op('billVendors.get'),
		list: op('billVendors.list'),
		update: op('billVendors.update'),
	},
	bills: {
		archive: op('bills.archive'),
		create: op('bills.create'),
		delete: op('bills.delete'),
		get: op('bills.get'),
		list: op('bills.list'),
		update: op('bills.update'),
	},
	businesses: {
		create: op('businesses.create'),
		delete: op('businesses.delete'),
		listUsers: op('businesses.listUsers'),
	},
	callbacks: {
		create: op('callbacks.create'),
		delete: op('callbacks.delete'),
		get: op('callbacks.get'),
		list: op('callbacks.list'),
		resendVerification: op('callbacks.resendVerification'),
		verify: op('callbacks.verify'),
	},
	checkoutLinks: {
		create: op('checkoutLinks.create'),
		delete: op('checkoutLinks.delete'),
		setPaymentOptions: op('checkoutLinks.setPaymentOptions'),
		update: op('checkoutLinks.update'),
	},
	clients: {
		create: op('clients.create'),
		delete: op('clients.delete'),
		get: op('clients.get'),
		list: op('clients.list'),
		update: op('clients.update'),
	},
	contacts: {
		delete: op('contacts.delete'),
		update: op('contacts.update'),
	},
	creditNotes: {
		create: op('creditNotes.create'),
		delete: op('creditNotes.delete'),
		get: op('creditNotes.get'),
		list: op('creditNotes.list'),
		update: op('creditNotes.update'),
	},
	estimates: {
		accept: op('estimates.accept'),
		create: op('estimates.create'),
		delete: op('estimates.delete'),
		get: op('estimates.get'),
		list: op('estimates.list'),
		markSent: op('estimates.markSent'),
		sendEmail: op('estimates.sendEmail'),
		update: op('estimates.update'),
	},
	expenseCategories: {
		create: op('expenseCategories.create'),
		get: op('expenseCategories.get'),
		list: op('expenseCategories.list'),
	},
	expenseProfiles: {
		create: op('expenseProfiles.create'),
	},
	expenses: {
		create: op('expenses.create'),
		delete: op('expenses.delete'),
		get: op('expenses.get'),
		list: op('expenses.list'),
		listVendors: op('expenses.listVendors'),
		summaries: op('expenses.summaries'),
		update: op('expenses.update'),
	},
	gateways: {
		get: op('gateways.get'),
		provisionFreshBooksPayments: op('gateways.provisionFreshBooksPayments'),
	},
	invitationRates: {
		list: op('invitationRates.list'),
	},
	invitations: {
		create: op('invitations.create'),
	},
	invoicePaymentOptions: {
		create: op('invoicePaymentOptions.create'),
		get: op('invoicePaymentOptions.get'),
	},
	invoiceProfilePaymentOptions: {
		create: op('invoiceProfilePaymentOptions.create'),
	},
	invoiceProfiles: {
		create: op('invoiceProfiles.create'),
		delete: op('invoiceProfiles.delete'),
		get: op('invoiceProfiles.get'),
		list: op('invoiceProfiles.list'),
		update: op('invoiceProfiles.update'),
	},
	invoices: {
		create: op('invoices.create'),
		delete: op('invoices.delete'),
		downloadPdf: op('invoices.downloadPdf'),
		get: op('invoices.get'),
		getShareLink: op('invoices.getShareLink'),
		list: op('invoices.list'),
		listPresentations: op('invoices.listPresentations'),
		markSent: op('invoices.markSent'),
		sendEmail: op('invoices.sendEmail'),
		update: op('invoices.update'),
	},
	items: {
		create: op('items.create'),
		delete: op('items.delete'),
		get: op('items.get'),
		list: op('items.list'),
		update: op('items.update'),
	},
	journalEntries: {
		create: op('journalEntries.create'),
	},
	journalEntryAccounts: {
		list: op('journalEntryAccounts.list'),
	},
	journalEntryDetails: {
		list: op('journalEntryDetails.list'),
	},
	ledgerAccountSubTypes: {
		get: op('ledgerAccountSubTypes.get'),
		list: op('ledgerAccountSubTypes.list'),
	},
	ledgerAccountTypes: {
		list: op('ledgerAccountTypes.list'),
	},
	ledgerAccounts: {
		create: op('ledgerAccounts.create'),
		get: op('ledgerAccounts.get'),
		list: op('ledgerAccounts.list'),
		update: op('ledgerAccounts.update'),
	},
	ledgerReports: {
		accountEntryDetails: op('ledgerReports.accountEntryDetails'),
		balanceSheet: op('ledgerReports.balanceSheet'),
		cashFlow: op('ledgerReports.cashFlow'),
		chartOfAccounts: op('ledgerReports.chartOfAccounts'),
		expenseDetails: op('ledgerReports.expenseDetails'),
		generalLedger: op('ledgerReports.generalLedger'),
		manualJournalEntries: op('ledgerReports.manualJournalEntries'),
		profitAndLoss: op('ledgerReports.profitAndLoss'),
		trialBalance: op('ledgerReports.trialBalance'),
	},
	otherIncomes: {
		create: op('otherIncomes.create'),
		delete: op('otherIncomes.delete'),
		get: op('otherIncomes.get'),
		list: op('otherIncomes.list'),
		update: op('otherIncomes.update'),
	},
	paymentOptions: {
		getDefault: op('paymentOptions.getDefault'),
	},
	payments: {
		create: op('payments.create'),
		delete: op('payments.delete'),
		get: op('payments.get'),
		list: op('payments.list'),
		update: op('payments.update'),
	},
	projectThreads: {
		create: op('projectThreads.create'),
		list: op('projectThreads.list'),
	},
	projects: {
		create: op('projects.create'),
		delete: op('projects.delete'),
		get: op('projects.get'),
		list: op('projects.list'),
		update: op('projects.update'),
		updateServiceRate: op('projects.updateServiceRate'),
	},
	reports: {
		accountStatement: op('reports.accountStatement'),
		accountsAging: op('reports.accountsAging'),
		balanceSheet: op('reports.balanceSheet'),
		bankReconciliationSummary: op('reports.bankReconciliationSummary'),
		download: op('reports.download'),
		expenseDetails: op('reports.expenseDetails'),
		invoiceDetails: op('reports.invoiceDetails'),
		itemSales: op('reports.itemSales'),
		paymentsCollected: op('reports.paymentsCollected'),
		profitLossEntity: op('reports.profitLossEntity'),
		revenueByClient: op('reports.revenueByClient'),
		taxSummary: op('reports.taxSummary'),
		trialBalance: op('reports.trialBalance'),
	},
	retainers: {
		create: op('retainers.create'),
		delete: op('retainers.delete'),
		get: op('retainers.get'),
		list: op('retainers.list'),
		undelete: op('retainers.undelete'),
		update: op('retainers.update'),
	},
	serviceRates: {
		list: op('serviceRates.list'),
	},
	services: {
		create: op('services.create'),
		createRate: op('services.createRate'),
		get: op('services.get'),
		getRate: op('services.getRate'),
		list: op('services.list'),
		updateRate: op('services.updateRate'),
	},
	staff: {
		delete: op('staff.delete'),
		get: op('staff.get'),
		list: op('staff.list'),
		update: op('staff.update'),
	},
	systems: {
		get: op('systems.get'),
	},
	tasks: {
		create: op('tasks.create'),
		delete: op('tasks.delete'),
		get: op('tasks.get'),
		list: op('tasks.list'),
		update: op('tasks.update'),
	},
	taxes: {
		create: op('taxes.create'),
		delete: op('taxes.delete'),
		get: op('taxes.get'),
		list: op('taxes.list'),
		update: op('taxes.update'),
	},
	teamMemberRates: {
		list: op('teamMemberRates.list'),
		update: op('teamMemberRates.update'),
	},
	teamMembers: {
		get: op('teamMembers.get'),
		list: op('teamMembers.list'),
	},
	threadComments: {
		create: op('threadComments.create'),
	},
	timeEntries: {
		create: op('timeEntries.create'),
		delete: op('timeEntries.delete'),
		get: op('timeEntries.get'),
		list: op('timeEntries.list'),
		search: op('timeEntries.search'),
		update: op('timeEntries.update'),
	},
	tokens: {
		revoke: op('tokens.revoke'),
	},
	uploads: {
		attachment: op('uploads.attachment'),
		image: op('uploads.image'),
		publicImage: op('uploads.publicImage'),
	},
	users: {
		me: op('users.me'),
	},
} as const;

export const freshbooksEndpointSchemas = {
	'abilities.list': freshbooksSchemaEntry('abilities.list'),
	'accountGateways.delete': freshbooksSchemaEntry('accountGateways.delete'),
	'accountGateways.list': freshbooksSchemaEntry('accountGateways.list'),
	'adjustmentJournalEntries.create': freshbooksSchemaEntry(
		'adjustmentJournalEntries.create',
	),
	'adjustmentJournalEntries.list': freshbooksSchemaEntry(
		'adjustmentJournalEntries.list',
	),
	'adjustmentJournalEntries.update': freshbooksSchemaEntry(
		'adjustmentJournalEntries.update',
	),
	'applications.create': freshbooksSchemaEntry('applications.create'),
	'applications.list': freshbooksSchemaEntry('applications.list'),
	'applications.update': freshbooksSchemaEntry('applications.update'),
	'billPayments.create': freshbooksSchemaEntry('billPayments.create'),
	'billPayments.delete': freshbooksSchemaEntry('billPayments.delete'),
	'billPayments.get': freshbooksSchemaEntry('billPayments.get'),
	'billPayments.list': freshbooksSchemaEntry('billPayments.list'),
	'billPayments.update': freshbooksSchemaEntry('billPayments.update'),
	'billVendors.create': freshbooksSchemaEntry('billVendors.create'),
	'billVendors.delete': freshbooksSchemaEntry('billVendors.delete'),
	'billVendors.get': freshbooksSchemaEntry('billVendors.get'),
	'billVendors.list': freshbooksSchemaEntry('billVendors.list'),
	'billVendors.update': freshbooksSchemaEntry('billVendors.update'),
	'bills.archive': freshbooksSchemaEntry('bills.archive'),
	'bills.create': freshbooksSchemaEntry('bills.create'),
	'bills.delete': freshbooksSchemaEntry('bills.delete'),
	'bills.get': freshbooksSchemaEntry('bills.get'),
	'bills.list': freshbooksSchemaEntry('bills.list'),
	'bills.update': freshbooksSchemaEntry('bills.update'),
	'businesses.create': freshbooksSchemaEntry('businesses.create'),
	'businesses.delete': freshbooksSchemaEntry('businesses.delete'),
	'businesses.listUsers': freshbooksSchemaEntry('businesses.listUsers'),
	'callbacks.create': freshbooksSchemaEntry('callbacks.create'),
	'callbacks.delete': freshbooksSchemaEntry('callbacks.delete'),
	'callbacks.get': freshbooksSchemaEntry('callbacks.get'),
	'callbacks.list': freshbooksSchemaEntry('callbacks.list'),
	'callbacks.resendVerification': freshbooksSchemaEntry(
		'callbacks.resendVerification',
	),
	'callbacks.verify': freshbooksSchemaEntry('callbacks.verify'),
	'checkoutLinks.create': freshbooksSchemaEntry('checkoutLinks.create'),
	'checkoutLinks.delete': freshbooksSchemaEntry('checkoutLinks.delete'),
	'checkoutLinks.setPaymentOptions': freshbooksSchemaEntry(
		'checkoutLinks.setPaymentOptions',
	),
	'checkoutLinks.update': freshbooksSchemaEntry('checkoutLinks.update'),
	'clients.create': freshbooksSchemaEntry('clients.create'),
	'clients.delete': freshbooksSchemaEntry('clients.delete'),
	'clients.get': freshbooksSchemaEntry('clients.get'),
	'clients.list': freshbooksSchemaEntry('clients.list'),
	'clients.update': freshbooksSchemaEntry('clients.update'),
	'contacts.delete': freshbooksSchemaEntry('contacts.delete'),
	'contacts.update': freshbooksSchemaEntry('contacts.update'),
	'creditNotes.create': freshbooksSchemaEntry('creditNotes.create'),
	'creditNotes.delete': freshbooksSchemaEntry('creditNotes.delete'),
	'creditNotes.get': freshbooksSchemaEntry('creditNotes.get'),
	'creditNotes.list': freshbooksSchemaEntry('creditNotes.list'),
	'creditNotes.update': freshbooksSchemaEntry('creditNotes.update'),
	'estimates.accept': freshbooksSchemaEntry('estimates.accept'),
	'estimates.create': freshbooksSchemaEntry('estimates.create'),
	'estimates.delete': freshbooksSchemaEntry('estimates.delete'),
	'estimates.get': freshbooksSchemaEntry('estimates.get'),
	'estimates.list': freshbooksSchemaEntry('estimates.list'),
	'estimates.markSent': freshbooksSchemaEntry('estimates.markSent'),
	'estimates.sendEmail': freshbooksSchemaEntry('estimates.sendEmail'),
	'estimates.update': freshbooksSchemaEntry('estimates.update'),
	'expenseCategories.create': freshbooksSchemaEntry('expenseCategories.create'),
	'expenseCategories.get': freshbooksSchemaEntry('expenseCategories.get'),
	'expenseCategories.list': freshbooksSchemaEntry('expenseCategories.list'),
	'expenseProfiles.create': freshbooksSchemaEntry('expenseProfiles.create'),
	'expenses.create': freshbooksSchemaEntry('expenses.create'),
	'expenses.delete': freshbooksSchemaEntry('expenses.delete'),
	'expenses.get': freshbooksSchemaEntry('expenses.get'),
	'expenses.list': freshbooksSchemaEntry('expenses.list'),
	'expenses.listVendors': freshbooksSchemaEntry('expenses.listVendors'),
	'expenses.summaries': freshbooksSchemaEntry('expenses.summaries'),
	'expenses.update': freshbooksSchemaEntry('expenses.update'),
	'gateways.get': freshbooksSchemaEntry('gateways.get'),
	'gateways.provisionFreshBooksPayments': freshbooksSchemaEntry(
		'gateways.provisionFreshBooksPayments',
	),
	'invitationRates.list': freshbooksSchemaEntry('invitationRates.list'),
	'invitations.create': freshbooksSchemaEntry('invitations.create'),
	'invoicePaymentOptions.create': freshbooksSchemaEntry(
		'invoicePaymentOptions.create',
	),
	'invoicePaymentOptions.get': freshbooksSchemaEntry(
		'invoicePaymentOptions.get',
	),
	'invoiceProfilePaymentOptions.create': freshbooksSchemaEntry(
		'invoiceProfilePaymentOptions.create',
	),
	'invoiceProfiles.create': freshbooksSchemaEntry('invoiceProfiles.create'),
	'invoiceProfiles.delete': freshbooksSchemaEntry('invoiceProfiles.delete'),
	'invoiceProfiles.get': freshbooksSchemaEntry('invoiceProfiles.get'),
	'invoiceProfiles.list': freshbooksSchemaEntry('invoiceProfiles.list'),
	'invoiceProfiles.update': freshbooksSchemaEntry('invoiceProfiles.update'),
	'invoices.create': freshbooksSchemaEntry('invoices.create'),
	'invoices.delete': freshbooksSchemaEntry('invoices.delete'),
	'invoices.downloadPdf': freshbooksSchemaEntry('invoices.downloadPdf'),
	'invoices.get': freshbooksSchemaEntry('invoices.get'),
	'invoices.getShareLink': freshbooksSchemaEntry('invoices.getShareLink'),
	'invoices.list': freshbooksSchemaEntry('invoices.list'),
	'invoices.listPresentations': freshbooksSchemaEntry(
		'invoices.listPresentations',
	),
	'invoices.markSent': freshbooksSchemaEntry('invoices.markSent'),
	'invoices.sendEmail': freshbooksSchemaEntry('invoices.sendEmail'),
	'invoices.update': freshbooksSchemaEntry('invoices.update'),
	'items.create': freshbooksSchemaEntry('items.create'),
	'items.delete': freshbooksSchemaEntry('items.delete'),
	'items.get': freshbooksSchemaEntry('items.get'),
	'items.list': freshbooksSchemaEntry('items.list'),
	'items.update': freshbooksSchemaEntry('items.update'),
	'journalEntries.create': freshbooksSchemaEntry('journalEntries.create'),
	'journalEntryAccounts.list': freshbooksSchemaEntry(
		'journalEntryAccounts.list',
	),
	'journalEntryDetails.list': freshbooksSchemaEntry('journalEntryDetails.list'),
	'ledgerAccountSubTypes.get': freshbooksSchemaEntry(
		'ledgerAccountSubTypes.get',
	),
	'ledgerAccountSubTypes.list': freshbooksSchemaEntry(
		'ledgerAccountSubTypes.list',
	),
	'ledgerAccountTypes.list': freshbooksSchemaEntry('ledgerAccountTypes.list'),
	'ledgerAccounts.create': freshbooksSchemaEntry('ledgerAccounts.create'),
	'ledgerAccounts.get': freshbooksSchemaEntry('ledgerAccounts.get'),
	'ledgerAccounts.list': freshbooksSchemaEntry('ledgerAccounts.list'),
	'ledgerAccounts.update': freshbooksSchemaEntry('ledgerAccounts.update'),
	'ledgerReports.accountEntryDetails': freshbooksSchemaEntry(
		'ledgerReports.accountEntryDetails',
	),
	'ledgerReports.balanceSheet': freshbooksSchemaEntry(
		'ledgerReports.balanceSheet',
	),
	'ledgerReports.cashFlow': freshbooksSchemaEntry('ledgerReports.cashFlow'),
	'ledgerReports.chartOfAccounts': freshbooksSchemaEntry(
		'ledgerReports.chartOfAccounts',
	),
	'ledgerReports.expenseDetails': freshbooksSchemaEntry(
		'ledgerReports.expenseDetails',
	),
	'ledgerReports.generalLedger': freshbooksSchemaEntry(
		'ledgerReports.generalLedger',
	),
	'ledgerReports.manualJournalEntries': freshbooksSchemaEntry(
		'ledgerReports.manualJournalEntries',
	),
	'ledgerReports.profitAndLoss': freshbooksSchemaEntry(
		'ledgerReports.profitAndLoss',
	),
	'ledgerReports.trialBalance': freshbooksSchemaEntry(
		'ledgerReports.trialBalance',
	),
	'otherIncomes.create': freshbooksSchemaEntry('otherIncomes.create'),
	'otherIncomes.delete': freshbooksSchemaEntry('otherIncomes.delete'),
	'otherIncomes.get': freshbooksSchemaEntry('otherIncomes.get'),
	'otherIncomes.list': freshbooksSchemaEntry('otherIncomes.list'),
	'otherIncomes.update': freshbooksSchemaEntry('otherIncomes.update'),
	'paymentOptions.getDefault': freshbooksSchemaEntry(
		'paymentOptions.getDefault',
	),
	'payments.create': freshbooksSchemaEntry('payments.create'),
	'payments.delete': freshbooksSchemaEntry('payments.delete'),
	'payments.get': freshbooksSchemaEntry('payments.get'),
	'payments.list': freshbooksSchemaEntry('payments.list'),
	'payments.update': freshbooksSchemaEntry('payments.update'),
	'projectThreads.create': freshbooksSchemaEntry('projectThreads.create'),
	'projectThreads.list': freshbooksSchemaEntry('projectThreads.list'),
	'projects.create': freshbooksSchemaEntry('projects.create'),
	'projects.delete': freshbooksSchemaEntry('projects.delete'),
	'projects.get': freshbooksSchemaEntry('projects.get'),
	'projects.list': freshbooksSchemaEntry('projects.list'),
	'projects.update': freshbooksSchemaEntry('projects.update'),
	'projects.updateServiceRate': freshbooksSchemaEntry(
		'projects.updateServiceRate',
	),
	'reports.accountStatement': freshbooksSchemaEntry('reports.accountStatement'),
	'reports.accountsAging': freshbooksSchemaEntry('reports.accountsAging'),
	'reports.balanceSheet': freshbooksSchemaEntry('reports.balanceSheet'),
	'reports.bankReconciliationSummary': freshbooksSchemaEntry(
		'reports.bankReconciliationSummary',
	),
	'reports.download': freshbooksSchemaEntry('reports.download'),
	'reports.expenseDetails': freshbooksSchemaEntry('reports.expenseDetails'),
	'reports.invoiceDetails': freshbooksSchemaEntry('reports.invoiceDetails'),
	'reports.itemSales': freshbooksSchemaEntry('reports.itemSales'),
	'reports.paymentsCollected': freshbooksSchemaEntry(
		'reports.paymentsCollected',
	),
	'reports.profitLossEntity': freshbooksSchemaEntry('reports.profitLossEntity'),
	'reports.revenueByClient': freshbooksSchemaEntry('reports.revenueByClient'),
	'reports.taxSummary': freshbooksSchemaEntry('reports.taxSummary'),
	'reports.trialBalance': freshbooksSchemaEntry('reports.trialBalance'),
	'retainers.create': freshbooksSchemaEntry('retainers.create'),
	'retainers.delete': freshbooksSchemaEntry('retainers.delete'),
	'retainers.get': freshbooksSchemaEntry('retainers.get'),
	'retainers.list': freshbooksSchemaEntry('retainers.list'),
	'retainers.undelete': freshbooksSchemaEntry('retainers.undelete'),
	'retainers.update': freshbooksSchemaEntry('retainers.update'),
	'serviceRates.list': freshbooksSchemaEntry('serviceRates.list'),
	'services.create': freshbooksSchemaEntry('services.create'),
	'services.createRate': freshbooksSchemaEntry('services.createRate'),
	'services.get': freshbooksSchemaEntry('services.get'),
	'services.getRate': freshbooksSchemaEntry('services.getRate'),
	'services.list': freshbooksSchemaEntry('services.list'),
	'services.updateRate': freshbooksSchemaEntry('services.updateRate'),
	'staff.delete': freshbooksSchemaEntry('staff.delete'),
	'staff.get': freshbooksSchemaEntry('staff.get'),
	'staff.list': freshbooksSchemaEntry('staff.list'),
	'staff.update': freshbooksSchemaEntry('staff.update'),
	'systems.get': freshbooksSchemaEntry('systems.get'),
	'tasks.create': freshbooksSchemaEntry('tasks.create'),
	'tasks.delete': freshbooksSchemaEntry('tasks.delete'),
	'tasks.get': freshbooksSchemaEntry('tasks.get'),
	'tasks.list': freshbooksSchemaEntry('tasks.list'),
	'tasks.update': freshbooksSchemaEntry('tasks.update'),
	'taxes.create': freshbooksSchemaEntry('taxes.create'),
	'taxes.delete': freshbooksSchemaEntry('taxes.delete'),
	'taxes.get': freshbooksSchemaEntry('taxes.get'),
	'taxes.list': freshbooksSchemaEntry('taxes.list'),
	'taxes.update': freshbooksSchemaEntry('taxes.update'),
	'teamMemberRates.list': freshbooksSchemaEntry('teamMemberRates.list'),
	'teamMemberRates.update': freshbooksSchemaEntry('teamMemberRates.update'),
	'teamMembers.get': freshbooksSchemaEntry('teamMembers.get'),
	'teamMembers.list': freshbooksSchemaEntry('teamMembers.list'),
	'threadComments.create': freshbooksSchemaEntry('threadComments.create'),
	'timeEntries.create': freshbooksSchemaEntry('timeEntries.create'),
	'timeEntries.delete': freshbooksSchemaEntry('timeEntries.delete'),
	'timeEntries.get': freshbooksSchemaEntry('timeEntries.get'),
	'timeEntries.list': freshbooksSchemaEntry('timeEntries.list'),
	'timeEntries.search': freshbooksSchemaEntry('timeEntries.search'),
	'timeEntries.update': freshbooksSchemaEntry('timeEntries.update'),
	'tokens.revoke': freshbooksSchemaEntry('tokens.revoke'),
	'uploads.attachment': freshbooksSchemaEntry('uploads.attachment'),
	'uploads.image': freshbooksSchemaEntry('uploads.image'),
	'uploads.publicImage': freshbooksSchemaEntry('uploads.publicImage'),
	'users.me': freshbooksSchemaEntry('users.me'),
} satisfies RequiredPluginEndpointSchemas<typeof freshbooksEndpointsNested>;

export const freshbooksEndpointMeta = {
	'abilities.list': {
		riskLevel: 'read',
		description:
			"Read what the signed-in identity may do in the business's projects.",
	},
	'accountGateways.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Disconnect a payment gateway from the account.',
	},
	'accountGateways.list': {
		riskLevel: 'read',
		description:
			'List the payment gateways connected to the accounting account.',
	},
	'adjustmentJournalEntries.create': {
		riskLevel: 'write',
		description:
			'Create an adjustment journal entry: a description, a date and balanced debit and credit lines against ledger accounts.',
	},
	'adjustmentJournalEntries.list': {
		riskLevel: 'read',
		description:
			'List adjustment journal entries of the business (ledger API, version 2023-09-25).',
	},
	'adjustmentJournalEntries.update': {
		riskLevel: 'write',
		description:
			'Change an adjustment journal entry. (PUT /accounting/businesses/{businessUuid}/journal_entries/{journalEntryUuid})',
	},
	'applications.create': {
		riskLevel: 'write',
		description: 'Create an OAuth app (name, redirect URIs, scopes).',
	},
	'applications.list': {
		riskLevel: 'read',
		description: 'List the OAuth apps the signed-in developer owns.',
	},
	'applications.update': {
		riskLevel: 'write',
		description:
			'Change an OAuth app by its client id. (PUT /auth/api/v1/partners/applications/{clientId})',
	},
	'billPayments.create': {
		riskLevel: 'destructive',
		description:
			'Create a payment made on a bill. Fields go in `bill_payment`.',
	},
	'billPayments.delete': {
		riskLevel: 'destructive',
		description:
			'Delete a payment made on a bill (sets vis_state to 1). FreshBooks keeps it: an update with vis_state 0 restores it.',
	},
	'billPayments.get': {
		riskLevel: 'read',
		description:
			'Read one payment made on a bill. (GET /accounting/account/{accountId}/bill_payments/bill_payments/{billPaymentId})',
	},
	'billPayments.list': {
		riskLevel: 'read',
		description:
			'List payments made on bills, newest first, with search filters, includes and paging.',
	},
	'billPayments.update': {
		riskLevel: 'destructive',
		description:
			'Change fields of a payment made on a bill. FreshBooks updates one phase of fields per call: send vis_state on its own.',
	},
	'billVendors.create': {
		riskLevel: 'write',
		description: 'Create a bill vendor. Fields go in `bill_vendor`.',
	},
	'billVendors.delete': {
		riskLevel: 'destructive',
		description:
			'Delete a bill vendor (sets vis_state to 1). FreshBooks keeps it: an update with vis_state 0 restores it.',
	},
	'billVendors.get': {
		riskLevel: 'read',
		description:
			'Read one bill vendor. (GET /accounting/account/{accountId}/bill_vendors/bill_vendors/{vendorId})',
	},
	'billVendors.list': {
		riskLevel: 'read',
		description:
			'List bill vendors, newest first, with search filters, includes and paging.',
	},
	'billVendors.update': {
		riskLevel: 'write',
		description:
			'Change fields of a bill vendor. FreshBooks updates one phase of fields per call: send vis_state on its own.',
	},
	'bills.archive': {
		riskLevel: 'write',
		description:
			'Archive a bill (sets vis_state to 2): hidden from lists, still counted.',
	},
	'bills.create': {
		riskLevel: 'write',
		description: 'Create a bill from a vendor. Fields go in `bill`.',
	},
	'bills.delete': {
		riskLevel: 'destructive',
		description:
			'Delete a bill from a vendor (sets vis_state to 1). FreshBooks keeps it: an update with vis_state 0 restores it.',
	},
	'bills.get': {
		riskLevel: 'read',
		description:
			'Read one bill from a vendor. (GET /accounting/account/{accountId}/bills/bills/{billId})',
	},
	'bills.list': {
		riskLevel: 'read',
		description:
			'List bills from vendors, newest first, with search filters, includes and paging.',
	},
	'bills.update': {
		riskLevel: 'write',
		description:
			'Change fields of a bill from a vendor. FreshBooks updates one phase of fields per call: send vis_state on its own.',
	},
	'businesses.create': {
		riskLevel: 'write',
		description:
			'Add a business to the signed-in identity. Fields go in `business` (name, address...).',
	},
	'businesses.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a business from the signed-in identity, with its data. Cannot be undone.',
	},
	'businesses.listUsers': {
		riskLevel: 'read',
		description:
			'List the identities (owner, team members, clients) that belong to a business.',
	},
	'callbacks.create': {
		riskLevel: 'write',
		description:
			'Register a webhook: `callback.event` (invoice.create, or a noun like invoice for all its events) and `callback.uri`. FreshBooks then POSTs a verification code to the URI; send it back with callbacks.verify.',
	},
	'callbacks.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a webhook callback. (DELETE /events/account/{accountId}/events/callbacks/{callbackId})',
	},
	'callbacks.get': {
		riskLevel: 'read',
		description:
			'Read one webhook callback. (GET /events/account/{accountId}/events/callbacks/{callbackId})',
	},
	'callbacks.list': {
		riskLevel: 'read',
		description: 'List the webhook callbacks registered on the account.',
	},
	'callbacks.resendVerification': {
		riskLevel: 'write',
		description:
			'Ask FreshBooks to post the verification code to the webhook URI again (also re-enables a webhook it disabled).',
	},
	'callbacks.verify': {
		riskLevel: 'write',
		description:
			'Activate a webhook with the verifier FreshBooks posted to its URI (`callback.verifier`). The verifier is also the secret that signs every delivery.',
	},
	'checkoutLinks.create': {
		riskLevel: 'destructive',
		description:
			'Create a checkout link that takes card or bank payments for an amount.',
	},
	'checkoutLinks.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a checkout link: it stops taking payments.',
	},
	'checkoutLinks.setPaymentOptions': {
		riskLevel: 'destructive',
		description: 'Choose the payment gateway options of a checkout link.',
	},
	'checkoutLinks.update': {
		riskLevel: 'destructive',
		description:
			'Change a checkout link. (PUT /payments/account/{accountId}/checkout-links/{checkoutLinkId})',
	},
	'clients.create': {
		riskLevel: 'write',
		description:
			'Create a client. Fields go in `client`. (POST /accounting/account/{accountId}/users/clients)',
	},
	'clients.delete': {
		riskLevel: 'destructive',
		description:
			'Delete a client (sets vis_state to 1). FreshBooks keeps it: an update with vis_state 0 restores it.',
	},
	'clients.get': {
		riskLevel: 'read',
		description:
			'Read one client. (GET /accounting/account/{accountId}/users/clients/{clientId})',
	},
	'clients.list': {
		riskLevel: 'read',
		description:
			'List clients, newest first, with search filters, includes and paging.',
	},
	'clients.update': {
		riskLevel: 'write',
		description:
			'Change fields of a client. FreshBooks updates one phase of fields per call: send vis_state on its own.',
	},
	'contacts.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Delete a client's secondary contact. (DELETE /accounting/account/{accountId}/users/contacts/{contactId})",
	},
	'contacts.update': {
		riskLevel: 'write',
		description: "Change a client's secondary contact (email, name, phone).",
	},
	'creditNotes.create': {
		riskLevel: 'write',
		description:
			'Create a credit note (goodwill, prepayment or refund credit). Fields go in `credit_note`.',
	},
	'creditNotes.delete': {
		riskLevel: 'destructive',
		description:
			'Delete a credit note (goodwill, prepayment or refund credit) (sets vis_state to 1). FreshBooks keeps it: an update with vis_state 0 restores it.',
	},
	'creditNotes.get': {
		riskLevel: 'read',
		description:
			'Read one credit note (goodwill, prepayment or refund credit).',
	},
	'creditNotes.list': {
		riskLevel: 'read',
		description:
			'List credit notes, newest first, with search filters, includes and paging.',
	},
	'creditNotes.update': {
		riskLevel: 'write',
		description:
			'Change fields of a credit note (goodwill, prepayment or refund credit). FreshBooks updates one phase of fields per call: send vis_state on its own.',
	},
	'estimates.accept': {
		riskLevel: 'write',
		description: "Mark an estimate as accepted on the client's behalf.",
	},
	'estimates.create': {
		riskLevel: 'write',
		description: 'Create a estimate. Fields go in `estimate`.',
	},
	'estimates.delete': {
		riskLevel: 'destructive',
		description:
			'Delete a estimate (sets vis_state to 1). FreshBooks keeps it: an update with vis_state 0 restores it.',
	},
	'estimates.get': {
		riskLevel: 'read',
		description:
			'Read one estimate. (GET /accounting/account/{accountId}/estimates/estimates/{estimateId})',
	},
	'estimates.list': {
		riskLevel: 'read',
		description:
			'List estimates, newest first, with search filters, includes and paging.',
	},
	'estimates.markSent': {
		riskLevel: 'write',
		description: 'Mark an estimate as sent without emailing anyone.',
	},
	'estimates.sendEmail': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Email the estimate now, to `estimate.email_recipients` with an optional customized subject and body. Cannot be unsent.',
	},
	'estimates.update': {
		riskLevel: 'write',
		description:
			'Change fields of a estimate. FreshBooks updates one phase of fields per call: send vis_state on its own.',
	},
	'expenseCategories.create': {
		riskLevel: 'write',
		description: 'Create a custom expense category under a parent category.',
	},
	'expenseCategories.get': {
		riskLevel: 'read',
		description:
			'Read one expense category. (GET /accounting/account/{accountId}/expenses/categories/{categoryId})',
	},
	'expenseCategories.list': {
		riskLevel: 'read',
		description:
			'List expense categories (the chart of accounts entries expenses use).',
	},
	'expenseProfiles.create': {
		riskLevel: 'write',
		description:
			'Create a recurring expense (an expense profile with a frequency).',
	},
	'expenses.create': {
		riskLevel: 'write',
		description: 'Create a expense. Fields go in `expense`.',
	},
	'expenses.delete': {
		riskLevel: 'destructive',
		description:
			'Delete a expense (sets vis_state to 1). FreshBooks keeps it: an update with vis_state 0 restores it.',
	},
	'expenses.get': {
		riskLevel: 'read',
		description:
			'Read one expense. (GET /accounting/account/{accountId}/expenses/expenses/{expenseId})',
	},
	'expenses.list': {
		riskLevel: 'read',
		description:
			'List expenses, newest first, with search filters, includes and paging.',
	},
	'expenses.listVendors': {
		riskLevel: 'read',
		description:
			'List the vendor names used on expenses. (GET /accounting/account/{accountId}/expenses/vendors)',
	},
	'expenses.summaries': {
		riskLevel: 'read',
		description: 'Read expense totals grouped by category and period.',
	},
	'expenses.update': {
		riskLevel: 'write',
		description:
			'Change fields of a expense. FreshBooks updates one phase of fields per call: send vis_state on its own.',
	},
	'gateways.get': {
		riskLevel: 'read',
		description:
			"Read the account's online payment gateways (Stripe, FreshBooks Payments, PayPal) and their status.",
	},
	'gateways.provisionFreshBooksPayments': {
		riskLevel: 'destructive',
		description:
			'Start FreshBooks Payments for the account (the money-moving gateway).',
	},
	'invitationRates.list': {
		riskLevel: 'read',
		description: 'List the rates set on pending team invitations.',
	},
	'invitations.create': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Invite a person to the business (and optionally to projects). FreshBooks emails them the invitation.',
	},
	'invoicePaymentOptions.create': {
		riskLevel: 'destructive',
		description:
			'Turn on online payment options (gateway_name, has_credit_card, has_ach...) for an invoice.',
	},
	'invoicePaymentOptions.get': {
		riskLevel: 'read',
		description: 'Read which online payment gateways an invoice accepts.',
	},
	'invoiceProfilePaymentOptions.create': {
		riskLevel: 'destructive',
		description:
			'Turn on online payment options for a recurring invoice profile.',
	},
	'invoiceProfiles.create': {
		riskLevel: 'write',
		description:
			'Create a recurring invoice profile. Fields go in `invoice_profile`.',
	},
	'invoiceProfiles.delete': {
		riskLevel: 'destructive',
		description:
			'Delete a recurring invoice profile (sets vis_state to 1). FreshBooks keeps it: an update with vis_state 0 restores it.',
	},
	'invoiceProfiles.get': {
		riskLevel: 'read',
		description:
			'Read one recurring invoice profile. (GET /accounting/account/{accountId}/invoice_profiles/invoice_profiles/{invoiceProfileId})',
	},
	'invoiceProfiles.list': {
		riskLevel: 'read',
		description:
			'List recurring invoice profiles, newest first, with search filters, includes and paging.',
	},
	'invoiceProfiles.update': {
		riskLevel: 'write',
		description:
			'Change fields of a recurring invoice profile. FreshBooks updates one phase of fields per call: send vis_state on its own.',
	},
	'invoices.create': {
		riskLevel: 'write',
		description: 'Create a invoice. Fields go in `invoice`.',
	},
	'invoices.delete': {
		riskLevel: 'destructive',
		description:
			'Delete a invoice (sets vis_state to 1). FreshBooks keeps it: an update with vis_state 0 restores it.',
	},
	'invoices.downloadPdf': {
		riskLevel: 'read',
		description:
			'Download the invoice as a PDF. (GET /accounting/account/{accountId}/invoices/invoices/{invoiceId}/pdf)',
	},
	'invoices.get': {
		riskLevel: 'read',
		description:
			'Read one invoice. (GET /accounting/account/{accountId}/invoices/invoices/{invoiceId})',
	},
	'invoices.getShareLink': {
		riskLevel: 'read',
		description: 'Get a client-facing link to view and pay the invoice.',
	},
	'invoices.list': {
		riskLevel: 'read',
		description:
			'List invoices, newest first, with search filters, includes and paging.',
	},
	'invoices.listPresentations': {
		riskLevel: 'read',
		description:
			'Read the default invoice presentation styles (theme, fonts, logo, banner).',
	},
	'invoices.markSent': {
		riskLevel: 'write',
		description: 'Mark a draft invoice as sent without emailing anyone.',
	},
	'invoices.sendEmail': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Email the invoice now, to `invoice.email_recipients` (or the client) with an optional `invoice_customized_email` subject and body. Cannot be unsent.',
	},
	'invoices.update': {
		riskLevel: 'write',
		description:
			'Change fields of a invoice. FreshBooks updates one phase of fields per call: send vis_state on its own.',
	},
	'items.create': {
		riskLevel: 'write',
		description:
			'Create a item. Fields go in `item`. (POST /accounting/account/{accountId}/items/items)',
	},
	'items.delete': {
		riskLevel: 'destructive',
		description:
			'Delete a item (sets vis_state to 1). FreshBooks keeps it: an update with vis_state 0 restores it.',
	},
	'items.get': {
		riskLevel: 'read',
		description:
			'Read one item. (GET /accounting/account/{accountId}/items/items/{itemId})',
	},
	'items.list': {
		riskLevel: 'read',
		description:
			'List items, newest first, with search filters, includes and paging.',
	},
	'items.update': {
		riskLevel: 'write',
		description:
			'Change fields of a item. FreshBooks updates one phase of fields per call: send vis_state on its own.',
	},
	'journalEntries.create': {
		riskLevel: 'write',
		description: 'Add a journal entry with its debit and credit lines.',
	},
	'journalEntryAccounts.list': {
		riskLevel: 'read',
		description: 'List the accounts journal entries can post to.',
	},
	'journalEntryDetails.list': {
		riskLevel: 'read',
		description: 'List journal entry detail lines (the general ledger lines).',
	},
	'ledgerAccountSubTypes.get': {
		riskLevel: 'read',
		description:
			'Read one ledger account sub type. (GET /accounting/ledger_accounts/sub_types/{subTypeId})',
	},
	'ledgerAccountSubTypes.list': {
		riskLevel: 'read',
		description:
			'List the ledger account sub types. (GET /accounting/ledger_accounts/sub_types)',
	},
	'ledgerAccountTypes.list': {
		riskLevel: 'read',
		description:
			'List the ledger account types (asset, liability, equity, income, expense).',
	},
	'ledgerAccounts.create': {
		riskLevel: 'write',
		description: 'Create a ledger account (name, number, sub type, parent).',
	},
	'ledgerAccounts.get': {
		riskLevel: 'read',
		description:
			'Read one ledger account. (GET /accounting/businesses/{businessUuid}/ledger_accounts/accounts/{accountUuid})',
	},
	'ledgerAccounts.list': {
		riskLevel: 'read',
		description:
			'List the chart of accounts of the business (ledger accounts and sub-accounts).',
	},
	'ledgerAccounts.update': {
		riskLevel: 'write',
		description:
			'Change a ledger account. (PUT /accounting/businesses/{businessUuid}/ledger_accounts/accounts/{accountUuid})',
	},
	'ledgerReports.accountEntryDetails': {
		riskLevel: 'read',
		description: 'List the journal entries that posted to one ledger account.',
	},
	'ledgerReports.balanceSheet': {
		riskLevel: 'read',
		description: 'Run the balance sheet report from the ledger.',
	},
	'ledgerReports.cashFlow': {
		riskLevel: 'read',
		description:
			'Run the cash flow report. (GET /accounting/businesses/{businessUuid}/reports/cash_flow)',
	},
	'ledgerReports.chartOfAccounts': {
		riskLevel: 'read',
		description: 'Run the chart of accounts report with balances.',
	},
	'ledgerReports.expenseDetails': {
		riskLevel: 'read',
		description: 'Run the expense details report from the ledger.',
	},
	'ledgerReports.generalLedger': {
		riskLevel: 'read',
		description:
			'Run the general ledger report. (GET /accounting/businesses/{businessUuid}/reports/general_ledger)',
	},
	'ledgerReports.manualJournalEntries': {
		riskLevel: 'read',
		description:
			'Run the manual journal entry report. (GET /accounting/businesses/{businessUuid}/reports/manual_journal_entry_report)',
	},
	'ledgerReports.profitAndLoss': {
		riskLevel: 'read',
		description: 'Run the profit and loss report from the ledger.',
	},
	'ledgerReports.trialBalance': {
		riskLevel: 'read',
		description:
			'Run the trial balance from the ledger. (GET /accounting/businesses/{businessUuid}/reports/trial_balance)',
	},
	'otherIncomes.create': {
		riskLevel: 'write',
		description:
			'Create a other income entry (sales outside invoices). Fields go in `other_income`.',
	},
	'otherIncomes.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a other income entry (sales outside invoices).',
	},
	'otherIncomes.get': {
		riskLevel: 'read',
		description: 'Read one other income entry (sales outside invoices).',
	},
	'otherIncomes.list': {
		riskLevel: 'read',
		description:
			'List other income entries, newest first, with search filters, includes and paging.',
	},
	'otherIncomes.update': {
		riskLevel: 'write',
		description:
			'Change fields of a other income entry (sales outside invoices). FreshBooks updates one phase of fields per call: send vis_state on its own.',
	},
	'paymentOptions.getDefault': {
		riskLevel: 'read',
		description: "Read the account's default online payment options.",
	},
	'payments.create': {
		riskLevel: 'destructive',
		description: 'Create a payment record. Fields go in `payment`.',
	},
	'payments.delete': {
		riskLevel: 'destructive',
		description:
			'Delete a payment record (sets vis_state to 1). FreshBooks keeps it: an update with vis_state 0 restores it.',
	},
	'payments.get': {
		riskLevel: 'read',
		description:
			'Read one payment record. (GET /accounting/account/{accountId}/payments/payments/{paymentId})',
	},
	'payments.list': {
		riskLevel: 'read',
		description:
			'List payments recorded against invoices, newest first, with search filters, includes and paging.',
	},
	'payments.update': {
		riskLevel: 'destructive',
		description:
			'Change fields of a payment record. FreshBooks updates one phase of fields per call: send vis_state on its own.',
	},
	'projectThreads.create': {
		riskLevel: 'destructive',
		description:
			"Post a new message to a project's discussion. Project members are notified.",
	},
	'projectThreads.list': {
		riskLevel: 'read',
		description: "List the messages in a project's discussion.",
	},
	'projects.create': {
		riskLevel: 'write',
		description:
			'Create a project (title, client, billing method, fixed price or hourly rate). Fields go in `project`.',
	},
	'projects.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a project and its data. Cannot be undone.',
	},
	'projects.get': {
		riskLevel: 'read',
		description: 'Read one project with its services and group.',
	},
	'projects.list': {
		riskLevel: 'read',
		description:
			'List projects with filters and paging. (GET /projects/business/{businessId}/projects)',
	},
	'projects.update': {
		riskLevel: 'write',
		description:
			'Change a project. (PUT /projects/business/{businessId}/project/{projectId})',
	},
	'projects.updateServiceRate': {
		riskLevel: 'write',
		description:
			"Set a service's rate on one project. (PUT /comments/business/{businessId}/project/{projectId}/service/{serviceId}/rate)",
	},
	'reports.accountStatement': {
		riskLevel: 'read',
		description: "Run a client's account statement for a period.",
	},
	'reports.accountsAging': {
		riskLevel: 'read',
		description: 'Run the accounts aging report (what clients owe, by age).',
	},
	'reports.balanceSheet': {
		riskLevel: 'read',
		description: 'Run the balance sheet (account version).',
	},
	'reports.bankReconciliationSummary': {
		riskLevel: 'read',
		description: 'Run the bank reconciliation summary for a bank account.',
	},
	'reports.download': {
		riskLevel: 'read',
		description:
			'Download a report as CSV with the download token a report call returned (fileName like invoice_details.csv).',
	},
	'reports.expenseDetails': {
		riskLevel: 'read',
		description:
			'Run the expense details report for a period (account version).',
	},
	'reports.invoiceDetails': {
		riskLevel: 'read',
		description: 'Run the invoice details report for a period.',
	},
	'reports.itemSales': {
		riskLevel: 'read',
		description:
			'Run the item sales report. (GET /accounting/account/{accountId}/reports/accounting/item_sales)',
	},
	'reports.paymentsCollected': {
		riskLevel: 'read',
		description:
			'Run the payments collected report. (GET /accounting/account/{accountId}/reports/accounting/payments_collected)',
	},
	'reports.profitLossEntity': {
		riskLevel: 'read',
		description: 'Run the profit and loss report (account version).',
	},
	'reports.revenueByClient': {
		riskLevel: 'read',
		description:
			'Run the revenue by client report. (GET /accounting/account/{accountId}/reports/accounting/revenue_by_client)',
	},
	'reports.taxSummary': {
		riskLevel: 'read',
		description:
			'Run the sales tax summary report. (GET /accounting/account/{accountId}/reports/accounting/taxsummary)',
	},
	'reports.trialBalance': {
		riskLevel: 'read',
		description: 'Run the trial balance (account version).',
	},
	'retainers.create': {
		riskLevel: 'write',
		description:
			'Create a retainer for a client. (POST /comments/business/{businessId}/retainers)',
	},
	'retainers.delete': {
		riskLevel: 'destructive',
		description:
			'Delete a retainer (sets vis_state to 1; retainers.undelete restores it).',
	},
	'retainers.get': {
		riskLevel: 'read',
		description:
			'Read one retainer. (GET /comments/business/{businessId}/retainer/{retainerId})',
	},
	'retainers.list': {
		riskLevel: 'read',
		description: 'List retainers (recurring prepaid client agreements).',
	},
	'retainers.undelete': {
		riskLevel: 'write',
		description: 'Restore a deleted retainer (sets vis_state to 0).',
	},
	'retainers.update': {
		riskLevel: 'write',
		description:
			'Change a retainer. (PUT /comments/business/{businessId}/retainer/{retainerId})',
	},
	'serviceRates.list': {
		riskLevel: 'read',
		description:
			'List the hourly rates of all services. (GET /comments/business/{businessId}/service_rates)',
	},
	'services.create': {
		riskLevel: 'write',
		description:
			'Create a service (name, billable). (POST /comments/business/{businessId}/service)',
	},
	'services.createRate': {
		riskLevel: 'write',
		description:
			'Set the hourly rate of a service. (POST /comments/business/{businessId}/service/{serviceId}/rate)',
	},
	'services.get': {
		riskLevel: 'read',
		description:
			'Read one service. (GET /comments/business/{businessId}/service/{serviceId})',
	},
	'services.getRate': {
		riskLevel: 'read',
		description:
			"Read a service's hourly rate. (GET /comments/business/{businessId}/service/{serviceId}/rate)",
	},
	'services.list': {
		riskLevel: 'read',
		description: 'List services (the billable work types on projects).',
	},
	'services.updateRate': {
		riskLevel: 'write',
		description:
			"Change a service's hourly rate. (PUT /comments/business/{businessId}/service/{serviceId}/rate)",
	},
	'staff.delete': {
		riskLevel: 'destructive',
		description: 'Delete a staff record (sets vis_state to 1).',
	},
	'staff.get': {
		riskLevel: 'read',
		description:
			'Read one staff record. (GET /accounting/account/{accountId}/users/staffs/{staffId})',
	},
	'staff.list': {
		riskLevel: 'read',
		description:
			'List staff of the account (the legacy accounting staff records).',
	},
	'staff.update': {
		riskLevel: 'write',
		description:
			'Change a staff record. (PUT /accounting/account/{accountId}/users/staffs/{staffId})',
	},
	'systems.get': {
		riskLevel: 'read',
		description:
			"Read the account's system settings (company name, address, currency, date format...). The system id is the business id.",
	},
	'tasks.create': {
		riskLevel: 'write',
		description: 'Create a billable task. Fields go in `task`.',
	},
	'tasks.delete': {
		riskLevel: 'destructive',
		description:
			'Delete a billable task (sets vis_state to 1). FreshBooks keeps it: an update with vis_state 0 restores it.',
	},
	'tasks.get': {
		riskLevel: 'read',
		description:
			'Read one billable task. (GET /accounting/account/{accountId}/projects/tasks/{taskId})',
	},
	'tasks.list': {
		riskLevel: 'read',
		description:
			'List billable tasks, newest first, with search filters, includes and paging.',
	},
	'tasks.update': {
		riskLevel: 'write',
		description:
			'Change fields of a billable task. FreshBooks updates one phase of fields per call: send vis_state on its own.',
	},
	'taxes.create': {
		riskLevel: 'write',
		description:
			'Create a tax. Fields go in `tax`. (POST /accounting/account/{accountId}/taxes/taxes)',
	},
	'taxes.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a tax. (DELETE /accounting/account/{accountId}/taxes/taxes/{taxId})',
	},
	'taxes.get': {
		riskLevel: 'read',
		description:
			'Read one tax. (GET /accounting/account/{accountId}/taxes/taxes/{taxId})',
	},
	'taxes.list': {
		riskLevel: 'read',
		description:
			'List taxes, newest first, with search filters, includes and paging.',
	},
	'taxes.update': {
		riskLevel: 'write',
		description:
			'Change fields of a tax. FreshBooks updates one phase of fields per call: send vis_state on its own.',
	},
	'teamMemberRates.list': {
		riskLevel: 'read',
		description: 'List the billable and cost rates of team members.',
	},
	'teamMemberRates.update': {
		riskLevel: 'write',
		description: "Change a team member's billable or cost rate.",
	},
	'teamMembers.get': {
		riskLevel: 'read',
		description:
			'Read one team member by uuid. (GET /auth/api/v1/businesses/{businessId}/team_members/{teamMemberUuid})',
	},
	'teamMembers.list': {
		riskLevel: 'read',
		description: 'List the team members of a business with their roles.',
	},
	'threadComments.create': {
		riskLevel: 'destructive',
		description:
			'Reply to a project discussion message. Project members are notified.',
	},
	'timeEntries.create': {
		riskLevel: 'write',
		description:
			'Log a time entry (duration in seconds, started_at, project, service, client), or start a timer with is_logged false.',
	},
	'timeEntries.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a time entry. Cannot be undone. (DELETE /timetracking/business/{businessId}/time_entries/{timeEntryId})',
	},
	'timeEntries.get': {
		riskLevel: 'read',
		description:
			'Read one time entry. (GET /timetracking/business/{businessId}/time_entries/{timeEntryId})',
	},
	'timeEntries.list': {
		riskLevel: 'read',
		description:
			'List time entries with filters (billed, client, teammate, date range) and paging.',
	},
	'timeEntries.search': {
		riskLevel: 'read',
		description:
			'Search time entries across the business (the time entry details report).',
	},
	'timeEntries.update': {
		riskLevel: 'write',
		description:
			'Change a time entry. (PUT /timetracking/business/{businessId}/time_entries/{timeEntryId})',
	},
	'tokens.revoke': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Revoke an OAuth refresh or access token. The connection stops working until it is authorized again.',
	},
	'uploads.attachment': {
		riskLevel: 'write',
		description:
			'Upload an attachment (an expense receipt, an invoice attachment). Returns the jwt to reference it on the expense or invoice.',
	},
	'uploads.image': {
		riskLevel: 'write',
		description:
			'Upload an image (an invoice logo or banner, a proposal image). Returns the jwt to reference it and a link.',
	},
	'uploads.publicImage': {
		riskLevel: 'write',
		description:
			'Upload an image that belongs to no account (an app listing logo). Returns its jwt and link.',
	},
	'users.me': {
		riskLevel: 'read',
		description:
			'Read the signed-in identity: name, email, and business_memberships with each business id, business_uuid and accounting account_id the other operations need.',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof freshbooksEndpointsNested
>;
