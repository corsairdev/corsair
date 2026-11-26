// Generated with endpoints/operation-types.ts from Moneybird's OpenAPI spec:
// one entry per operation in moneybird-manifest.json. Risk levels follow
// .github/PLUGIN_PR_RULES.md (R8).
import type {
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { moneybirdSchemaEntry } from './openapi-schema';
import { createMoneybirdOperation as op } from './operations';

export const moneybirdEndpointsNested = {
	administrations: {
		list: op('administrations.list'),
	},
	assets: {
		create: op('assets.create'),
		delete: op('assets.delete'),
		disposals: {
			create: op('assets.disposals.create'),
		},
		get: op('assets.get'),
		list: op('assets.list'),
		reinvestmentReservePurchase: {
			create: op('assets.reinvestmentReservePurchase.create'),
			delete: op('assets.reinvestmentReservePurchase.delete'),
		},
		reinvestmentReserveSale: {
			create: op('assets.reinvestmentReserveSale.create'),
			delete: op('assets.reinvestmentReserveSale.delete'),
		},
		sources: {
			create: op('assets.sources.create'),
			delete: op('assets.sources.delete'),
		},
		update: op('assets.update'),
		valueChanges: {
			createArbitrary: op('assets.valueChanges.createArbitrary'),
			createDivestment: op('assets.valueChanges.createDivestment'),
			createFullDepreciation: op('assets.valueChanges.createFullDepreciation'),
			createManual: op('assets.valueChanges.createManual'),
			createRetroactiveLinear: op(
				'assets.valueChanges.createRetroactiveLinear',
			),
		},
	},
	contacts: {
		additionalCharges: {
			create: op('contacts.additionalCharges.create'),
			list: op('contacts.additionalCharges.list'),
		},
		archive: op('contacts.archive'),
		contactPeople: {
			create: op('contacts.contactPeople.create'),
			delete: op('contacts.contactPeople.delete'),
			get: op('contacts.contactPeople.get'),
			update: op('contacts.contactPeople.update'),
		},
		create: op('contacts.create'),
		delete: op('contacts.delete'),
		fetchByIds: op('contacts.fetchByIds'),
		filter: op('contacts.filter'),
		get: op('contacts.get'),
		getByCustomerId: op('contacts.getByCustomerId'),
		list: op('contacts.list'),
		listDuplicates: op('contacts.listDuplicates'),
		listVersions: op('contacts.listVersions'),
		notes: {
			create: op('contacts.notes.create'),
			delete: op('contacts.notes.delete'),
		},
		paymentsMandate: {
			createUrl: op('contacts.paymentsMandate.createUrl'),
			delete: op('contacts.paymentsMandate.delete'),
			get: op('contacts.paymentsMandate.get'),
			request: op('contacts.paymentsMandate.request'),
		},
		update: op('contacts.update'),
	},
	customFields: {
		list: op('customFields.list'),
	},
	customerContactPortal: {
		get: op('customerContactPortal.get'),
		getSubscription: op('customerContactPortal.getSubscription'),
		listInvoices: op('customerContactPortal.listInvoices'),
	},
	documentStyles: {
		list: op('documentStyles.list'),
	},
	documents: {
		generalDocuments: {
			attachments: {
				create: op('documents.generalDocuments.attachments.create'),
				delete: op('documents.generalDocuments.attachments.delete'),
				download: op('documents.generalDocuments.attachments.download'),
			},
			create: op('documents.generalDocuments.create'),
			delete: op('documents.generalDocuments.delete'),
			fetchByIds: op('documents.generalDocuments.fetchByIds'),
			get: op('documents.generalDocuments.get'),
			list: op('documents.generalDocuments.list'),
			listVersions: op('documents.generalDocuments.listVersions'),
			notes: {
				create: op('documents.generalDocuments.notes.create'),
				delete: op('documents.generalDocuments.notes.delete'),
			},
			update: op('documents.generalDocuments.update'),
		},
		generalJournalDocuments: {
			attachments: {
				create: op('documents.generalJournalDocuments.attachments.create'),
				delete: op('documents.generalJournalDocuments.attachments.delete'),
				download: op('documents.generalJournalDocuments.attachments.download'),
			},
			create: op('documents.generalJournalDocuments.create'),
			delete: op('documents.generalJournalDocuments.delete'),
			fetchByIds: op('documents.generalJournalDocuments.fetchByIds'),
			get: op('documents.generalJournalDocuments.get'),
			list: op('documents.generalJournalDocuments.list'),
			listVersions: op('documents.generalJournalDocuments.listVersions'),
			notes: {
				create: op('documents.generalJournalDocuments.notes.create'),
				delete: op('documents.generalJournalDocuments.notes.delete'),
			},
			update: op('documents.generalJournalDocuments.update'),
		},
		purchaseInvoices: {
			attachments: {
				create: op('documents.purchaseInvoices.attachments.create'),
				delete: op('documents.purchaseInvoices.attachments.delete'),
				download: op('documents.purchaseInvoices.attachments.download'),
			},
			create: op('documents.purchaseInvoices.create'),
			delete: op('documents.purchaseInvoices.delete'),
			fetchByIds: op('documents.purchaseInvoices.fetchByIds'),
			get: op('documents.purchaseInvoices.get'),
			list: op('documents.purchaseInvoices.list'),
			listVersions: op('documents.purchaseInvoices.listVersions'),
			notes: {
				create: op('documents.purchaseInvoices.notes.create'),
				delete: op('documents.purchaseInvoices.notes.delete'),
			},
			payments: {
				create: op('documents.purchaseInvoices.payments.create'),
				delete: op('documents.purchaseInvoices.payments.delete'),
			},
			update: op('documents.purchaseInvoices.update'),
		},
		receipts: {
			attachments: {
				create: op('documents.receipts.attachments.create'),
				delete: op('documents.receipts.attachments.delete'),
				download: op('documents.receipts.attachments.download'),
			},
			create: op('documents.receipts.create'),
			delete: op('documents.receipts.delete'),
			fetchByIds: op('documents.receipts.fetchByIds'),
			get: op('documents.receipts.get'),
			list: op('documents.receipts.list'),
			listVersions: op('documents.receipts.listVersions'),
			notes: {
				create: op('documents.receipts.notes.create'),
				delete: op('documents.receipts.notes.delete'),
			},
			payments: {
				create: op('documents.receipts.payments.create'),
				delete: op('documents.receipts.payments.delete'),
			},
			update: op('documents.receipts.update'),
		},
		typelessDocuments: {
			attachments: {
				create: op('documents.typelessDocuments.attachments.create'),
				delete: op('documents.typelessDocuments.attachments.delete'),
				download: op('documents.typelessDocuments.attachments.download'),
			},
			create: op('documents.typelessDocuments.create'),
			delete: op('documents.typelessDocuments.delete'),
			fetchByIds: op('documents.typelessDocuments.fetchByIds'),
			get: op('documents.typelessDocuments.get'),
			list: op('documents.typelessDocuments.list'),
			listVersions: op('documents.typelessDocuments.listVersions'),
		},
	},
	downloads: {
		download: op('downloads.download'),
		list: op('downloads.list'),
	},
	estimates: {
		attachments: {
			create: op('estimates.attachments.create'),
			delete: op('estimates.attachments.delete'),
			download: op('estimates.attachments.download'),
		},
		bill: op('estimates.bill'),
		changeState: op('estimates.changeState'),
		create: op('estimates.create'),
		delete: op('estimates.delete'),
		downloadPdf: op('estimates.downloadPdf'),
		downloadSignedPdf: op('estimates.downloadSignedPdf'),
		fetchByIds: op('estimates.fetchByIds'),
		get: op('estimates.get'),
		getByEstimateId: op('estimates.getByEstimateId'),
		list: op('estimates.list'),
		listVersions: op('estimates.listVersions'),
		notes: {
			create: op('estimates.notes.create'),
			delete: op('estimates.notes.delete'),
		},
		send: op('estimates.send'),
		update: op('estimates.update'),
	},
	events: {
		list: op('events.list'),
	},
	externalSalesInvoices: {
		attachments: {
			create: op('externalSalesInvoices.attachments.create'),
			delete: op('externalSalesInvoices.attachments.delete'),
			download: op('externalSalesInvoices.attachments.download'),
		},
		create: op('externalSalesInvoices.create'),
		createFromAttachment: op('externalSalesInvoices.createFromAttachment'),
		delete: op('externalSalesInvoices.delete'),
		fetchByIds: op('externalSalesInvoices.fetchByIds'),
		get: op('externalSalesInvoices.get'),
		list: op('externalSalesInvoices.list'),
		listVersions: op('externalSalesInvoices.listVersions'),
		markAsDubious: op('externalSalesInvoices.markAsDubious'),
		markAsUncollectible: op('externalSalesInvoices.markAsUncollectible'),
		notes: {
			create: op('externalSalesInvoices.notes.create'),
			delete: op('externalSalesInvoices.notes.delete'),
		},
		payments: {
			create: op('externalSalesInvoices.payments.create'),
			delete: op('externalSalesInvoices.payments.delete'),
		},
		update: op('externalSalesInvoices.update'),
	},
	financialAccounts: {
		list: op('financialAccounts.list'),
	},
	financialMutations: {
		fetchByIds: op('financialMutations.fetchByIds'),
		get: op('financialMutations.get'),
		linkBooking: op('financialMutations.linkBooking'),
		list: op('financialMutations.list'),
		listVersions: op('financialMutations.listVersions'),
		unlinkBooking: op('financialMutations.unlinkBooking'),
	},
	financialStatements: {
		create: op('financialStatements.create'),
		delete: op('financialStatements.delete'),
		update: op('financialStatements.update'),
	},
	identities: {
		create: op('identities.create'),
		delete: op('identities.delete'),
		get: op('identities.get'),
		getDefault: op('identities.getDefault'),
		list: op('identities.list'),
		update: op('identities.update'),
		updateDefault: op('identities.updateDefault'),
	},
	ledgerAccounts: {
		create: op('ledgerAccounts.create'),
		delete: op('ledgerAccounts.delete'),
		get: op('ledgerAccounts.get'),
		list: op('ledgerAccounts.list'),
		update: op('ledgerAccounts.update'),
	},
	payments: {
		get: op('payments.get'),
	},
	products: {
		create: op('products.create'),
		createSalesLink: op('products.createSalesLink'),
		delete: op('products.delete'),
		get: op('products.get'),
		getByIdentifier: op('products.getByIdentifier'),
		list: op('products.list'),
		update: op('products.update'),
	},
	projects: {
		create: op('projects.create'),
		delete: op('projects.delete'),
		get: op('projects.get'),
		list: op('projects.list'),
		update: op('projects.update'),
	},
	purchaseTransactionBatches: {
		createFromSepaFile: op('purchaseTransactionBatches.createFromSepaFile'),
		download: op('purchaseTransactionBatches.download'),
		get: op('purchaseTransactionBatches.get'),
	},
	purchaseTransactions: {
		delete: op('purchaseTransactions.delete'),
		get: op('purchaseTransactions.get'),
		list: op('purchaseTransactions.list'),
	},
	recurringSalesInvoices: {
		create: op('recurringSalesInvoices.create'),
		deactivate: op('recurringSalesInvoices.deactivate'),
		delete: op('recurringSalesInvoices.delete'),
		fetchByIds: op('recurringSalesInvoices.fetchByIds'),
		get: op('recurringSalesInvoices.get'),
		list: op('recurringSalesInvoices.list'),
		listVersions: op('recurringSalesInvoices.listVersions'),
		notes: {
			create: op('recurringSalesInvoices.notes.create'),
			delete: op('recurringSalesInvoices.notes.delete'),
		},
		update: op('recurringSalesInvoices.update'),
	},
	reports: {
		assets: op('reports.assets'),
		balanceSheet: op('reports.balanceSheet'),
		bankBalance: op('reports.bankBalance'),
		cashFlow: op('reports.cashFlow'),
		creditors: op('reports.creditors'),
		creditorsAging: op('reports.creditorsAging'),
		debtors: op('reports.debtors'),
		debtorsAging: op('reports.debtorsAging'),
		expensesByContact: op('reports.expensesByContact'),
		expensesByProject: op('reports.expensesByProject'),
		exportAuditfile: op('reports.exportAuditfile'),
		exportBrugstaat: op('reports.exportBrugstaat'),
		exportLedgerAccounts: op('reports.exportLedgerAccounts'),
		generalLedger: op('reports.generalLedger'),
		journalEntries: op('reports.journalEntries'),
		profitLoss: op('reports.profitLoss'),
		revenueByContact: op('reports.revenueByContact'),
		revenueByProject: op('reports.revenueByProject'),
		subscriptions: op('reports.subscriptions'),
		tax: op('reports.tax'),
		workingCapital: op('reports.workingCapital'),
	},
	salesInvoices: {
		attachments: {
			create: op('salesInvoices.attachments.create'),
			delete: op('salesInvoices.attachments.delete'),
			download: op('salesInvoices.attachments.download'),
		},
		create: op('salesInvoices.create'),
		delete: op('salesInvoices.delete'),
		downloadPackingSlipPdf: op('salesInvoices.downloadPackingSlipPdf'),
		downloadPdf: op('salesInvoices.downloadPdf'),
		downloadUbl: op('salesInvoices.downloadUbl'),
		duplicateAsCreditInvoice: op('salesInvoices.duplicateAsCreditInvoice'),
		fetchByIds: op('salesInvoices.fetchByIds'),
		get: op('salesInvoices.get'),
		getByInvoiceId: op('salesInvoices.getByInvoiceId'),
		getByReference: op('salesInvoices.getByReference'),
		list: op('salesInvoices.list'),
		listVersions: op('salesInvoices.listVersions'),
		markAsDubious: op('salesInvoices.markAsDubious'),
		markAsUncollectible: op('salesInvoices.markAsUncollectible'),
		notes: {
			create: op('salesInvoices.notes.create'),
			delete: op('salesInvoices.notes.delete'),
		},
		pause: op('salesInvoices.pause'),
		payments: {
			create: op('salesInvoices.payments.create'),
			delete: op('salesInvoices.payments.delete'),
		},
		registerCreditInvoicePayment: op(
			'salesInvoices.registerCreditInvoicePayment',
		),
		resume: op('salesInvoices.resume'),
		send: op('salesInvoices.send'),
		sendReminders: op('salesInvoices.sendReminders'),
		update: op('salesInvoices.update'),
	},
	subscriptionTemplates: {
		createSalesLink: op('subscriptionTemplates.createSalesLink'),
		list: op('subscriptionTemplates.list'),
	},
	subscriptions: {
		additionalCharges: {
			create: op('subscriptions.additionalCharges.create'),
			list: op('subscriptions.additionalCharges.list'),
		},
		create: op('subscriptions.create'),
		createAndScheduleOneOffSalesInvoice: op(
			'subscriptions.createAndScheduleOneOffSalesInvoice',
		),
		delete: op('subscriptions.delete'),
		get: op('subscriptions.get'),
		list: op('subscriptions.list'),
		update: op('subscriptions.update'),
	},
	taskListGroups: {
		delete: op('taskListGroups.delete'),
		get: op('taskListGroups.get'),
		tasks: {
			create: op('taskListGroups.tasks.create'),
		},
		update: op('taskListGroups.update'),
	},
	taskListTasks: {
		assign: op('taskListTasks.assign'),
		complete: op('taskListTasks.complete'),
		delete: op('taskListTasks.delete'),
		get: op('taskListTasks.get'),
		notes: {
			create: op('taskListTasks.notes.create'),
		},
		reopen: op('taskListTasks.reopen'),
		unassign: op('taskListTasks.unassign'),
		update: op('taskListTasks.update'),
	},
	taskListTemplates: {
		create: op('taskListTemplates.create'),
		createTaskList: op('taskListTemplates.createTaskList'),
		delete: op('taskListTemplates.delete'),
		get: op('taskListTemplates.get'),
		groups: {
			create: op('taskListTemplates.groups.create'),
		},
		list: op('taskListTemplates.list'),
		update: op('taskListTemplates.update'),
	},
	taskLists: {
		create: op('taskLists.create'),
		delete: op('taskLists.delete'),
		get: op('taskLists.get'),
		groups: {
			create: op('taskLists.groups.create'),
		},
		list: op('taskLists.list'),
		update: op('taskLists.update'),
	},
	taxRates: {
		list: op('taxRates.list'),
	},
	timeEntries: {
		create: op('timeEntries.create'),
		delete: op('timeEntries.delete'),
		get: op('timeEntries.get'),
		list: op('timeEntries.list'),
		notes: {
			create: op('timeEntries.notes.create'),
			delete: op('timeEntries.notes.delete'),
		},
		resume: op('timeEntries.resume'),
		stop: op('timeEntries.stop'),
		update: op('timeEntries.update'),
	},
	users: {
		list: op('users.list'),
	},
	verifications: {
		list: op('verifications.list'),
	},
	webhooks: {
		activate: op('webhooks.activate'),
		create: op('webhooks.create'),
		deactivate: op('webhooks.deactivate'),
		delete: op('webhooks.delete'),
		list: op('webhooks.list'),
	},
	workflows: {
		get: op('workflows.get'),
		list: op('workflows.list'),
	},
} as const;

export const moneybirdEndpointSchemas = {
	'administrations.list': moneybirdSchemaEntry('administrations.list'),
	'assets.create': moneybirdSchemaEntry('assets.create'),
	'assets.delete': moneybirdSchemaEntry('assets.delete'),
	'assets.disposals.create': moneybirdSchemaEntry('assets.disposals.create'),
	'assets.get': moneybirdSchemaEntry('assets.get'),
	'assets.list': moneybirdSchemaEntry('assets.list'),
	'assets.reinvestmentReservePurchase.create': moneybirdSchemaEntry(
		'assets.reinvestmentReservePurchase.create',
	),
	'assets.reinvestmentReservePurchase.delete': moneybirdSchemaEntry(
		'assets.reinvestmentReservePurchase.delete',
	),
	'assets.reinvestmentReserveSale.create': moneybirdSchemaEntry(
		'assets.reinvestmentReserveSale.create',
	),
	'assets.reinvestmentReserveSale.delete': moneybirdSchemaEntry(
		'assets.reinvestmentReserveSale.delete',
	),
	'assets.sources.create': moneybirdSchemaEntry('assets.sources.create'),
	'assets.sources.delete': moneybirdSchemaEntry('assets.sources.delete'),
	'assets.update': moneybirdSchemaEntry('assets.update'),
	'assets.valueChanges.createArbitrary': moneybirdSchemaEntry(
		'assets.valueChanges.createArbitrary',
	),
	'assets.valueChanges.createDivestment': moneybirdSchemaEntry(
		'assets.valueChanges.createDivestment',
	),
	'assets.valueChanges.createFullDepreciation': moneybirdSchemaEntry(
		'assets.valueChanges.createFullDepreciation',
	),
	'assets.valueChanges.createManual': moneybirdSchemaEntry(
		'assets.valueChanges.createManual',
	),
	'assets.valueChanges.createRetroactiveLinear': moneybirdSchemaEntry(
		'assets.valueChanges.createRetroactiveLinear',
	),
	'contacts.additionalCharges.create': moneybirdSchemaEntry(
		'contacts.additionalCharges.create',
	),
	'contacts.additionalCharges.list': moneybirdSchemaEntry(
		'contacts.additionalCharges.list',
	),
	'contacts.archive': moneybirdSchemaEntry('contacts.archive'),
	'contacts.contactPeople.create': moneybirdSchemaEntry(
		'contacts.contactPeople.create',
	),
	'contacts.contactPeople.delete': moneybirdSchemaEntry(
		'contacts.contactPeople.delete',
	),
	'contacts.contactPeople.get': moneybirdSchemaEntry(
		'contacts.contactPeople.get',
	),
	'contacts.contactPeople.update': moneybirdSchemaEntry(
		'contacts.contactPeople.update',
	),
	'contacts.create': moneybirdSchemaEntry('contacts.create'),
	'contacts.delete': moneybirdSchemaEntry('contacts.delete'),
	'contacts.fetchByIds': moneybirdSchemaEntry('contacts.fetchByIds'),
	'contacts.filter': moneybirdSchemaEntry('contacts.filter'),
	'contacts.get': moneybirdSchemaEntry('contacts.get'),
	'contacts.getByCustomerId': moneybirdSchemaEntry('contacts.getByCustomerId'),
	'contacts.list': moneybirdSchemaEntry('contacts.list'),
	'contacts.listDuplicates': moneybirdSchemaEntry('contacts.listDuplicates'),
	'contacts.listVersions': moneybirdSchemaEntry('contacts.listVersions'),
	'contacts.notes.create': moneybirdSchemaEntry('contacts.notes.create'),
	'contacts.notes.delete': moneybirdSchemaEntry('contacts.notes.delete'),
	'contacts.paymentsMandate.createUrl': moneybirdSchemaEntry(
		'contacts.paymentsMandate.createUrl',
	),
	'contacts.paymentsMandate.delete': moneybirdSchemaEntry(
		'contacts.paymentsMandate.delete',
	),
	'contacts.paymentsMandate.get': moneybirdSchemaEntry(
		'contacts.paymentsMandate.get',
	),
	'contacts.paymentsMandate.request': moneybirdSchemaEntry(
		'contacts.paymentsMandate.request',
	),
	'contacts.update': moneybirdSchemaEntry('contacts.update'),
	'customFields.list': moneybirdSchemaEntry('customFields.list'),
	'customerContactPortal.get': moneybirdSchemaEntry(
		'customerContactPortal.get',
	),
	'customerContactPortal.getSubscription': moneybirdSchemaEntry(
		'customerContactPortal.getSubscription',
	),
	'customerContactPortal.listInvoices': moneybirdSchemaEntry(
		'customerContactPortal.listInvoices',
	),
	'documentStyles.list': moneybirdSchemaEntry('documentStyles.list'),
	'documents.generalDocuments.attachments.create': moneybirdSchemaEntry(
		'documents.generalDocuments.attachments.create',
	),
	'documents.generalDocuments.attachments.delete': moneybirdSchemaEntry(
		'documents.generalDocuments.attachments.delete',
	),
	'documents.generalDocuments.attachments.download': moneybirdSchemaEntry(
		'documents.generalDocuments.attachments.download',
	),
	'documents.generalDocuments.create': moneybirdSchemaEntry(
		'documents.generalDocuments.create',
	),
	'documents.generalDocuments.delete': moneybirdSchemaEntry(
		'documents.generalDocuments.delete',
	),
	'documents.generalDocuments.fetchByIds': moneybirdSchemaEntry(
		'documents.generalDocuments.fetchByIds',
	),
	'documents.generalDocuments.get': moneybirdSchemaEntry(
		'documents.generalDocuments.get',
	),
	'documents.generalDocuments.list': moneybirdSchemaEntry(
		'documents.generalDocuments.list',
	),
	'documents.generalDocuments.listVersions': moneybirdSchemaEntry(
		'documents.generalDocuments.listVersions',
	),
	'documents.generalDocuments.notes.create': moneybirdSchemaEntry(
		'documents.generalDocuments.notes.create',
	),
	'documents.generalDocuments.notes.delete': moneybirdSchemaEntry(
		'documents.generalDocuments.notes.delete',
	),
	'documents.generalDocuments.update': moneybirdSchemaEntry(
		'documents.generalDocuments.update',
	),
	'documents.generalJournalDocuments.attachments.create': moneybirdSchemaEntry(
		'documents.generalJournalDocuments.attachments.create',
	),
	'documents.generalJournalDocuments.attachments.delete': moneybirdSchemaEntry(
		'documents.generalJournalDocuments.attachments.delete',
	),
	'documents.generalJournalDocuments.attachments.download':
		moneybirdSchemaEntry(
			'documents.generalJournalDocuments.attachments.download',
		),
	'documents.generalJournalDocuments.create': moneybirdSchemaEntry(
		'documents.generalJournalDocuments.create',
	),
	'documents.generalJournalDocuments.delete': moneybirdSchemaEntry(
		'documents.generalJournalDocuments.delete',
	),
	'documents.generalJournalDocuments.fetchByIds': moneybirdSchemaEntry(
		'documents.generalJournalDocuments.fetchByIds',
	),
	'documents.generalJournalDocuments.get': moneybirdSchemaEntry(
		'documents.generalJournalDocuments.get',
	),
	'documents.generalJournalDocuments.list': moneybirdSchemaEntry(
		'documents.generalJournalDocuments.list',
	),
	'documents.generalJournalDocuments.listVersions': moneybirdSchemaEntry(
		'documents.generalJournalDocuments.listVersions',
	),
	'documents.generalJournalDocuments.notes.create': moneybirdSchemaEntry(
		'documents.generalJournalDocuments.notes.create',
	),
	'documents.generalJournalDocuments.notes.delete': moneybirdSchemaEntry(
		'documents.generalJournalDocuments.notes.delete',
	),
	'documents.generalJournalDocuments.update': moneybirdSchemaEntry(
		'documents.generalJournalDocuments.update',
	),
	'documents.purchaseInvoices.attachments.create': moneybirdSchemaEntry(
		'documents.purchaseInvoices.attachments.create',
	),
	'documents.purchaseInvoices.attachments.delete': moneybirdSchemaEntry(
		'documents.purchaseInvoices.attachments.delete',
	),
	'documents.purchaseInvoices.attachments.download': moneybirdSchemaEntry(
		'documents.purchaseInvoices.attachments.download',
	),
	'documents.purchaseInvoices.create': moneybirdSchemaEntry(
		'documents.purchaseInvoices.create',
	),
	'documents.purchaseInvoices.delete': moneybirdSchemaEntry(
		'documents.purchaseInvoices.delete',
	),
	'documents.purchaseInvoices.fetchByIds': moneybirdSchemaEntry(
		'documents.purchaseInvoices.fetchByIds',
	),
	'documents.purchaseInvoices.get': moneybirdSchemaEntry(
		'documents.purchaseInvoices.get',
	),
	'documents.purchaseInvoices.list': moneybirdSchemaEntry(
		'documents.purchaseInvoices.list',
	),
	'documents.purchaseInvoices.listVersions': moneybirdSchemaEntry(
		'documents.purchaseInvoices.listVersions',
	),
	'documents.purchaseInvoices.notes.create': moneybirdSchemaEntry(
		'documents.purchaseInvoices.notes.create',
	),
	'documents.purchaseInvoices.notes.delete': moneybirdSchemaEntry(
		'documents.purchaseInvoices.notes.delete',
	),
	'documents.purchaseInvoices.payments.create': moneybirdSchemaEntry(
		'documents.purchaseInvoices.payments.create',
	),
	'documents.purchaseInvoices.payments.delete': moneybirdSchemaEntry(
		'documents.purchaseInvoices.payments.delete',
	),
	'documents.purchaseInvoices.update': moneybirdSchemaEntry(
		'documents.purchaseInvoices.update',
	),
	'documents.receipts.attachments.create': moneybirdSchemaEntry(
		'documents.receipts.attachments.create',
	),
	'documents.receipts.attachments.delete': moneybirdSchemaEntry(
		'documents.receipts.attachments.delete',
	),
	'documents.receipts.attachments.download': moneybirdSchemaEntry(
		'documents.receipts.attachments.download',
	),
	'documents.receipts.create': moneybirdSchemaEntry(
		'documents.receipts.create',
	),
	'documents.receipts.delete': moneybirdSchemaEntry(
		'documents.receipts.delete',
	),
	'documents.receipts.fetchByIds': moneybirdSchemaEntry(
		'documents.receipts.fetchByIds',
	),
	'documents.receipts.get': moneybirdSchemaEntry('documents.receipts.get'),
	'documents.receipts.list': moneybirdSchemaEntry('documents.receipts.list'),
	'documents.receipts.listVersions': moneybirdSchemaEntry(
		'documents.receipts.listVersions',
	),
	'documents.receipts.notes.create': moneybirdSchemaEntry(
		'documents.receipts.notes.create',
	),
	'documents.receipts.notes.delete': moneybirdSchemaEntry(
		'documents.receipts.notes.delete',
	),
	'documents.receipts.payments.create': moneybirdSchemaEntry(
		'documents.receipts.payments.create',
	),
	'documents.receipts.payments.delete': moneybirdSchemaEntry(
		'documents.receipts.payments.delete',
	),
	'documents.receipts.update': moneybirdSchemaEntry(
		'documents.receipts.update',
	),
	'documents.typelessDocuments.attachments.create': moneybirdSchemaEntry(
		'documents.typelessDocuments.attachments.create',
	),
	'documents.typelessDocuments.attachments.delete': moneybirdSchemaEntry(
		'documents.typelessDocuments.attachments.delete',
	),
	'documents.typelessDocuments.attachments.download': moneybirdSchemaEntry(
		'documents.typelessDocuments.attachments.download',
	),
	'documents.typelessDocuments.create': moneybirdSchemaEntry(
		'documents.typelessDocuments.create',
	),
	'documents.typelessDocuments.delete': moneybirdSchemaEntry(
		'documents.typelessDocuments.delete',
	),
	'documents.typelessDocuments.fetchByIds': moneybirdSchemaEntry(
		'documents.typelessDocuments.fetchByIds',
	),
	'documents.typelessDocuments.get': moneybirdSchemaEntry(
		'documents.typelessDocuments.get',
	),
	'documents.typelessDocuments.list': moneybirdSchemaEntry(
		'documents.typelessDocuments.list',
	),
	'documents.typelessDocuments.listVersions': moneybirdSchemaEntry(
		'documents.typelessDocuments.listVersions',
	),
	'downloads.download': moneybirdSchemaEntry('downloads.download'),
	'downloads.list': moneybirdSchemaEntry('downloads.list'),
	'estimates.attachments.create': moneybirdSchemaEntry(
		'estimates.attachments.create',
	),
	'estimates.attachments.delete': moneybirdSchemaEntry(
		'estimates.attachments.delete',
	),
	'estimates.attachments.download': moneybirdSchemaEntry(
		'estimates.attachments.download',
	),
	'estimates.bill': moneybirdSchemaEntry('estimates.bill'),
	'estimates.changeState': moneybirdSchemaEntry('estimates.changeState'),
	'estimates.create': moneybirdSchemaEntry('estimates.create'),
	'estimates.delete': moneybirdSchemaEntry('estimates.delete'),
	'estimates.downloadPdf': moneybirdSchemaEntry('estimates.downloadPdf'),
	'estimates.downloadSignedPdf': moneybirdSchemaEntry(
		'estimates.downloadSignedPdf',
	),
	'estimates.fetchByIds': moneybirdSchemaEntry('estimates.fetchByIds'),
	'estimates.get': moneybirdSchemaEntry('estimates.get'),
	'estimates.getByEstimateId': moneybirdSchemaEntry(
		'estimates.getByEstimateId',
	),
	'estimates.list': moneybirdSchemaEntry('estimates.list'),
	'estimates.listVersions': moneybirdSchemaEntry('estimates.listVersions'),
	'estimates.notes.create': moneybirdSchemaEntry('estimates.notes.create'),
	'estimates.notes.delete': moneybirdSchemaEntry('estimates.notes.delete'),
	'estimates.send': moneybirdSchemaEntry('estimates.send'),
	'estimates.update': moneybirdSchemaEntry('estimates.update'),
	'events.list': moneybirdSchemaEntry('events.list'),
	'externalSalesInvoices.attachments.create': moneybirdSchemaEntry(
		'externalSalesInvoices.attachments.create',
	),
	'externalSalesInvoices.attachments.delete': moneybirdSchemaEntry(
		'externalSalesInvoices.attachments.delete',
	),
	'externalSalesInvoices.attachments.download': moneybirdSchemaEntry(
		'externalSalesInvoices.attachments.download',
	),
	'externalSalesInvoices.create': moneybirdSchemaEntry(
		'externalSalesInvoices.create',
	),
	'externalSalesInvoices.createFromAttachment': moneybirdSchemaEntry(
		'externalSalesInvoices.createFromAttachment',
	),
	'externalSalesInvoices.delete': moneybirdSchemaEntry(
		'externalSalesInvoices.delete',
	),
	'externalSalesInvoices.fetchByIds': moneybirdSchemaEntry(
		'externalSalesInvoices.fetchByIds',
	),
	'externalSalesInvoices.get': moneybirdSchemaEntry(
		'externalSalesInvoices.get',
	),
	'externalSalesInvoices.list': moneybirdSchemaEntry(
		'externalSalesInvoices.list',
	),
	'externalSalesInvoices.listVersions': moneybirdSchemaEntry(
		'externalSalesInvoices.listVersions',
	),
	'externalSalesInvoices.markAsDubious': moneybirdSchemaEntry(
		'externalSalesInvoices.markAsDubious',
	),
	'externalSalesInvoices.markAsUncollectible': moneybirdSchemaEntry(
		'externalSalesInvoices.markAsUncollectible',
	),
	'externalSalesInvoices.notes.create': moneybirdSchemaEntry(
		'externalSalesInvoices.notes.create',
	),
	'externalSalesInvoices.notes.delete': moneybirdSchemaEntry(
		'externalSalesInvoices.notes.delete',
	),
	'externalSalesInvoices.payments.create': moneybirdSchemaEntry(
		'externalSalesInvoices.payments.create',
	),
	'externalSalesInvoices.payments.delete': moneybirdSchemaEntry(
		'externalSalesInvoices.payments.delete',
	),
	'externalSalesInvoices.update': moneybirdSchemaEntry(
		'externalSalesInvoices.update',
	),
	'financialAccounts.list': moneybirdSchemaEntry('financialAccounts.list'),
	'financialMutations.fetchByIds': moneybirdSchemaEntry(
		'financialMutations.fetchByIds',
	),
	'financialMutations.get': moneybirdSchemaEntry('financialMutations.get'),
	'financialMutations.linkBooking': moneybirdSchemaEntry(
		'financialMutations.linkBooking',
	),
	'financialMutations.list': moneybirdSchemaEntry('financialMutations.list'),
	'financialMutations.listVersions': moneybirdSchemaEntry(
		'financialMutations.listVersions',
	),
	'financialMutations.unlinkBooking': moneybirdSchemaEntry(
		'financialMutations.unlinkBooking',
	),
	'financialStatements.create': moneybirdSchemaEntry(
		'financialStatements.create',
	),
	'financialStatements.delete': moneybirdSchemaEntry(
		'financialStatements.delete',
	),
	'financialStatements.update': moneybirdSchemaEntry(
		'financialStatements.update',
	),
	'identities.create': moneybirdSchemaEntry('identities.create'),
	'identities.delete': moneybirdSchemaEntry('identities.delete'),
	'identities.get': moneybirdSchemaEntry('identities.get'),
	'identities.getDefault': moneybirdSchemaEntry('identities.getDefault'),
	'identities.list': moneybirdSchemaEntry('identities.list'),
	'identities.update': moneybirdSchemaEntry('identities.update'),
	'identities.updateDefault': moneybirdSchemaEntry('identities.updateDefault'),
	'ledgerAccounts.create': moneybirdSchemaEntry('ledgerAccounts.create'),
	'ledgerAccounts.delete': moneybirdSchemaEntry('ledgerAccounts.delete'),
	'ledgerAccounts.get': moneybirdSchemaEntry('ledgerAccounts.get'),
	'ledgerAccounts.list': moneybirdSchemaEntry('ledgerAccounts.list'),
	'ledgerAccounts.update': moneybirdSchemaEntry('ledgerAccounts.update'),
	'payments.get': moneybirdSchemaEntry('payments.get'),
	'products.create': moneybirdSchemaEntry('products.create'),
	'products.createSalesLink': moneybirdSchemaEntry('products.createSalesLink'),
	'products.delete': moneybirdSchemaEntry('products.delete'),
	'products.get': moneybirdSchemaEntry('products.get'),
	'products.getByIdentifier': moneybirdSchemaEntry('products.getByIdentifier'),
	'products.list': moneybirdSchemaEntry('products.list'),
	'products.update': moneybirdSchemaEntry('products.update'),
	'projects.create': moneybirdSchemaEntry('projects.create'),
	'projects.delete': moneybirdSchemaEntry('projects.delete'),
	'projects.get': moneybirdSchemaEntry('projects.get'),
	'projects.list': moneybirdSchemaEntry('projects.list'),
	'projects.update': moneybirdSchemaEntry('projects.update'),
	'purchaseTransactionBatches.createFromSepaFile': moneybirdSchemaEntry(
		'purchaseTransactionBatches.createFromSepaFile',
	),
	'purchaseTransactionBatches.download': moneybirdSchemaEntry(
		'purchaseTransactionBatches.download',
	),
	'purchaseTransactionBatches.get': moneybirdSchemaEntry(
		'purchaseTransactionBatches.get',
	),
	'purchaseTransactions.delete': moneybirdSchemaEntry(
		'purchaseTransactions.delete',
	),
	'purchaseTransactions.get': moneybirdSchemaEntry('purchaseTransactions.get'),
	'purchaseTransactions.list': moneybirdSchemaEntry(
		'purchaseTransactions.list',
	),
	'recurringSalesInvoices.create': moneybirdSchemaEntry(
		'recurringSalesInvoices.create',
	),
	'recurringSalesInvoices.deactivate': moneybirdSchemaEntry(
		'recurringSalesInvoices.deactivate',
	),
	'recurringSalesInvoices.delete': moneybirdSchemaEntry(
		'recurringSalesInvoices.delete',
	),
	'recurringSalesInvoices.fetchByIds': moneybirdSchemaEntry(
		'recurringSalesInvoices.fetchByIds',
	),
	'recurringSalesInvoices.get': moneybirdSchemaEntry(
		'recurringSalesInvoices.get',
	),
	'recurringSalesInvoices.list': moneybirdSchemaEntry(
		'recurringSalesInvoices.list',
	),
	'recurringSalesInvoices.listVersions': moneybirdSchemaEntry(
		'recurringSalesInvoices.listVersions',
	),
	'recurringSalesInvoices.notes.create': moneybirdSchemaEntry(
		'recurringSalesInvoices.notes.create',
	),
	'recurringSalesInvoices.notes.delete': moneybirdSchemaEntry(
		'recurringSalesInvoices.notes.delete',
	),
	'recurringSalesInvoices.update': moneybirdSchemaEntry(
		'recurringSalesInvoices.update',
	),
	'reports.assets': moneybirdSchemaEntry('reports.assets'),
	'reports.balanceSheet': moneybirdSchemaEntry('reports.balanceSheet'),
	'reports.bankBalance': moneybirdSchemaEntry('reports.bankBalance'),
	'reports.cashFlow': moneybirdSchemaEntry('reports.cashFlow'),
	'reports.creditors': moneybirdSchemaEntry('reports.creditors'),
	'reports.creditorsAging': moneybirdSchemaEntry('reports.creditorsAging'),
	'reports.debtors': moneybirdSchemaEntry('reports.debtors'),
	'reports.debtorsAging': moneybirdSchemaEntry('reports.debtorsAging'),
	'reports.expensesByContact': moneybirdSchemaEntry(
		'reports.expensesByContact',
	),
	'reports.expensesByProject': moneybirdSchemaEntry(
		'reports.expensesByProject',
	),
	'reports.exportAuditfile': moneybirdSchemaEntry('reports.exportAuditfile'),
	'reports.exportBrugstaat': moneybirdSchemaEntry('reports.exportBrugstaat'),
	'reports.exportLedgerAccounts': moneybirdSchemaEntry(
		'reports.exportLedgerAccounts',
	),
	'reports.generalLedger': moneybirdSchemaEntry('reports.generalLedger'),
	'reports.journalEntries': moneybirdSchemaEntry('reports.journalEntries'),
	'reports.profitLoss': moneybirdSchemaEntry('reports.profitLoss'),
	'reports.revenueByContact': moneybirdSchemaEntry('reports.revenueByContact'),
	'reports.revenueByProject': moneybirdSchemaEntry('reports.revenueByProject'),
	'reports.subscriptions': moneybirdSchemaEntry('reports.subscriptions'),
	'reports.tax': moneybirdSchemaEntry('reports.tax'),
	'reports.workingCapital': moneybirdSchemaEntry('reports.workingCapital'),
	'salesInvoices.attachments.create': moneybirdSchemaEntry(
		'salesInvoices.attachments.create',
	),
	'salesInvoices.attachments.delete': moneybirdSchemaEntry(
		'salesInvoices.attachments.delete',
	),
	'salesInvoices.attachments.download': moneybirdSchemaEntry(
		'salesInvoices.attachments.download',
	),
	'salesInvoices.create': moneybirdSchemaEntry('salesInvoices.create'),
	'salesInvoices.delete': moneybirdSchemaEntry('salesInvoices.delete'),
	'salesInvoices.downloadPackingSlipPdf': moneybirdSchemaEntry(
		'salesInvoices.downloadPackingSlipPdf',
	),
	'salesInvoices.downloadPdf': moneybirdSchemaEntry(
		'salesInvoices.downloadPdf',
	),
	'salesInvoices.downloadUbl': moneybirdSchemaEntry(
		'salesInvoices.downloadUbl',
	),
	'salesInvoices.duplicateAsCreditInvoice': moneybirdSchemaEntry(
		'salesInvoices.duplicateAsCreditInvoice',
	),
	'salesInvoices.fetchByIds': moneybirdSchemaEntry('salesInvoices.fetchByIds'),
	'salesInvoices.get': moneybirdSchemaEntry('salesInvoices.get'),
	'salesInvoices.getByInvoiceId': moneybirdSchemaEntry(
		'salesInvoices.getByInvoiceId',
	),
	'salesInvoices.getByReference': moneybirdSchemaEntry(
		'salesInvoices.getByReference',
	),
	'salesInvoices.list': moneybirdSchemaEntry('salesInvoices.list'),
	'salesInvoices.listVersions': moneybirdSchemaEntry(
		'salesInvoices.listVersions',
	),
	'salesInvoices.markAsDubious': moneybirdSchemaEntry(
		'salesInvoices.markAsDubious',
	),
	'salesInvoices.markAsUncollectible': moneybirdSchemaEntry(
		'salesInvoices.markAsUncollectible',
	),
	'salesInvoices.notes.create': moneybirdSchemaEntry(
		'salesInvoices.notes.create',
	),
	'salesInvoices.notes.delete': moneybirdSchemaEntry(
		'salesInvoices.notes.delete',
	),
	'salesInvoices.pause': moneybirdSchemaEntry('salesInvoices.pause'),
	'salesInvoices.payments.create': moneybirdSchemaEntry(
		'salesInvoices.payments.create',
	),
	'salesInvoices.payments.delete': moneybirdSchemaEntry(
		'salesInvoices.payments.delete',
	),
	'salesInvoices.registerCreditInvoicePayment': moneybirdSchemaEntry(
		'salesInvoices.registerCreditInvoicePayment',
	),
	'salesInvoices.resume': moneybirdSchemaEntry('salesInvoices.resume'),
	'salesInvoices.send': moneybirdSchemaEntry('salesInvoices.send'),
	'salesInvoices.sendReminders': moneybirdSchemaEntry(
		'salesInvoices.sendReminders',
	),
	'salesInvoices.update': moneybirdSchemaEntry('salesInvoices.update'),
	'subscriptionTemplates.createSalesLink': moneybirdSchemaEntry(
		'subscriptionTemplates.createSalesLink',
	),
	'subscriptionTemplates.list': moneybirdSchemaEntry(
		'subscriptionTemplates.list',
	),
	'subscriptions.additionalCharges.create': moneybirdSchemaEntry(
		'subscriptions.additionalCharges.create',
	),
	'subscriptions.additionalCharges.list': moneybirdSchemaEntry(
		'subscriptions.additionalCharges.list',
	),
	'subscriptions.create': moneybirdSchemaEntry('subscriptions.create'),
	'subscriptions.createAndScheduleOneOffSalesInvoice': moneybirdSchemaEntry(
		'subscriptions.createAndScheduleOneOffSalesInvoice',
	),
	'subscriptions.delete': moneybirdSchemaEntry('subscriptions.delete'),
	'subscriptions.get': moneybirdSchemaEntry('subscriptions.get'),
	'subscriptions.list': moneybirdSchemaEntry('subscriptions.list'),
	'subscriptions.update': moneybirdSchemaEntry('subscriptions.update'),
	'taskListGroups.delete': moneybirdSchemaEntry('taskListGroups.delete'),
	'taskListGroups.get': moneybirdSchemaEntry('taskListGroups.get'),
	'taskListGroups.tasks.create': moneybirdSchemaEntry(
		'taskListGroups.tasks.create',
	),
	'taskListGroups.update': moneybirdSchemaEntry('taskListGroups.update'),
	'taskListTasks.assign': moneybirdSchemaEntry('taskListTasks.assign'),
	'taskListTasks.complete': moneybirdSchemaEntry('taskListTasks.complete'),
	'taskListTasks.delete': moneybirdSchemaEntry('taskListTasks.delete'),
	'taskListTasks.get': moneybirdSchemaEntry('taskListTasks.get'),
	'taskListTasks.notes.create': moneybirdSchemaEntry(
		'taskListTasks.notes.create',
	),
	'taskListTasks.reopen': moneybirdSchemaEntry('taskListTasks.reopen'),
	'taskListTasks.unassign': moneybirdSchemaEntry('taskListTasks.unassign'),
	'taskListTasks.update': moneybirdSchemaEntry('taskListTasks.update'),
	'taskListTemplates.create': moneybirdSchemaEntry('taskListTemplates.create'),
	'taskListTemplates.createTaskList': moneybirdSchemaEntry(
		'taskListTemplates.createTaskList',
	),
	'taskListTemplates.delete': moneybirdSchemaEntry('taskListTemplates.delete'),
	'taskListTemplates.get': moneybirdSchemaEntry('taskListTemplates.get'),
	'taskListTemplates.groups.create': moneybirdSchemaEntry(
		'taskListTemplates.groups.create',
	),
	'taskListTemplates.list': moneybirdSchemaEntry('taskListTemplates.list'),
	'taskListTemplates.update': moneybirdSchemaEntry('taskListTemplates.update'),
	'taskLists.create': moneybirdSchemaEntry('taskLists.create'),
	'taskLists.delete': moneybirdSchemaEntry('taskLists.delete'),
	'taskLists.get': moneybirdSchemaEntry('taskLists.get'),
	'taskLists.groups.create': moneybirdSchemaEntry('taskLists.groups.create'),
	'taskLists.list': moneybirdSchemaEntry('taskLists.list'),
	'taskLists.update': moneybirdSchemaEntry('taskLists.update'),
	'taxRates.list': moneybirdSchemaEntry('taxRates.list'),
	'timeEntries.create': moneybirdSchemaEntry('timeEntries.create'),
	'timeEntries.delete': moneybirdSchemaEntry('timeEntries.delete'),
	'timeEntries.get': moneybirdSchemaEntry('timeEntries.get'),
	'timeEntries.list': moneybirdSchemaEntry('timeEntries.list'),
	'timeEntries.notes.create': moneybirdSchemaEntry('timeEntries.notes.create'),
	'timeEntries.notes.delete': moneybirdSchemaEntry('timeEntries.notes.delete'),
	'timeEntries.resume': moneybirdSchemaEntry('timeEntries.resume'),
	'timeEntries.stop': moneybirdSchemaEntry('timeEntries.stop'),
	'timeEntries.update': moneybirdSchemaEntry('timeEntries.update'),
	'users.list': moneybirdSchemaEntry('users.list'),
	'verifications.list': moneybirdSchemaEntry('verifications.list'),
	'webhooks.activate': moneybirdSchemaEntry('webhooks.activate'),
	'webhooks.create': moneybirdSchemaEntry('webhooks.create'),
	'webhooks.deactivate': moneybirdSchemaEntry('webhooks.deactivate'),
	'webhooks.delete': moneybirdSchemaEntry('webhooks.delete'),
	'webhooks.list': moneybirdSchemaEntry('webhooks.list'),
	'workflows.get': moneybirdSchemaEntry('workflows.get'),
	'workflows.list': moneybirdSchemaEntry('workflows.list'),
} satisfies RequiredPluginEndpointSchemas<typeof moneybirdEndpointsNested>;

export const moneybirdEndpointMeta = {
	'administrations.list': {
		riskLevel: 'read',
		description:
			'List the administrations the token can access, with id, name, currency and access level',
	},
	'assets.create': {
		riskLevel: 'write',
		description: 'Create a new asset (scope: documents)',
	},
	'assets.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete an asset (scope: documents)',
	},
	'assets.disposals.create': {
		riskLevel: 'write',
		description: 'Create a disposal (scope: documents)',
	},
	'assets.get': {
		riskLevel: 'read',
		description: 'Get an asset by ID (scope: documents)',
	},
	'assets.list': {
		riskLevel: 'read',
		description: 'List all assets, one page at a time (scope: documents)',
	},
	'assets.reinvestmentReservePurchase.create': {
		riskLevel: 'write',
		description:
			'Create a reinvestment reserve purchase: records that part of the asset\'s purchase value is funded from the reinvestment reserve ("herinvesteringsreserve") (scope: documents)',
	},
	'assets.reinvestmentReservePurchase.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a reinvestment reserve purchase: removes the reinvestment reserve purchase from the asset (scope: documents)',
	},
	'assets.reinvestmentReserveSale.create': {
		riskLevel: 'write',
		description:
			'Create a reinvestment reserve sale: books the book result of the asset\'s disposal to the reinvestment reserve ("herinvesteringsreserve") (scope: documents)',
	},
	'assets.reinvestmentReserveSale.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Delete a reinvestment reserve sale: removes the reinvestment reserve sale from the asset's disposal (scope: documents)",
	},
	'assets.sources.create': {
		riskLevel: 'write',
		description:
			'Add a source to an asset: adds a detail or general journal document entry as a source to an asset (scope: documents)',
	},
	'assets.sources.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a source (scope: documents)',
	},
	'assets.update': {
		riskLevel: 'write',
		description: 'Update an asset (scope: documents)',
	},
	'assets.valueChanges.createArbitrary': {
		riskLevel: 'write',
		description: 'Create an arbitrary value change (scope: documents)',
	},
	'assets.valueChanges.createDivestment': {
		riskLevel: 'write',
		description: 'Create a divestment value change (scope: documents)',
	},
	'assets.valueChanges.createFullDepreciation': {
		riskLevel: 'write',
		description: 'Create a full depreciation value change (scope: documents)',
	},
	'assets.valueChanges.createManual': {
		riskLevel: 'write',
		description: 'Create a manual value change (scope: documents)',
	},
	'assets.valueChanges.createRetroactiveLinear': {
		riskLevel: 'write',
		description: 'Create linear value changes retroactively (scope: documents)',
	},
	'contacts.additionalCharges.create': {
		riskLevel: 'write',
		description:
			'Create an additional charge to be invoiced at start of next period: at the end of the current period, the additional charges for a contact are merged where possible and an invoice will be created for them (scope: sales_invoices)',
	},
	'contacts.additionalCharges.list': {
		riskLevel: 'read',
		description:
			'Get additional charges: get the additional charges of the given contact (scope: sales_invoices)',
	},
	'contacts.archive': {
		riskLevel: 'write',
		description:
			'Archive a contact: archives a contact (scope: estimates, sales_invoices, documents, bank, settings)',
	},
	'contacts.contactPeople.create': {
		riskLevel: 'write',
		description:
			'Create a new contact person: creating a new contact person in the administration requires at least a `contact_person` hash including `firstname` and `lastname` (scope: estimates, sales_invoices, documents, bank, settings)',
	},
	'contacts.contactPeople.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a contact person (scope: estimates, sales_invoices, documents, bank, settings)',
	},
	'contacts.contactPeople.get': {
		riskLevel: 'read',
		description:
			'Get contact person (scope: estimates, sales_invoices, documents, bank, settings)',
	},
	'contacts.contactPeople.update': {
		riskLevel: 'write',
		description:
			'Update a contact person: when updating a contact, you only need to provide the information you want to change (scope: estimates, sales_invoices, documents, bank, settings)',
	},
	'contacts.create': {
		riskLevel: 'write',
		description:
			'Create a new contact: creating a new contact in the administration requires at least a `company_name` or a `firstname` and `lastname` (scope: estimates, sales_invoices, documents, bank, settings)',
	},
	'contacts.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a contact (scope: estimates, sales_invoices, documents, bank, settings)',
	},
	'contacts.fetchByIds': {
		riskLevel: 'read',
		description:
			'Fetch contacts with given ids: given a list of contact ids, returns the contact information belonging to the contacts (scope: estimates, sales_invoices, documents, bank, settings)',
	},
	'contacts.filter': {
		riskLevel: 'read',
		description:
			'Filter contacts, one page at a time (scope: estimates, sales_invoices, documents, bank, settings)',
	},
	'contacts.get': {
		riskLevel: 'read',
		description:
			'Get contact (scope: estimates, sales_invoices, documents, bank, settings)',
	},
	'contacts.getByCustomerId': {
		riskLevel: 'read',
		description:
			'Get contact by customer id (scope: estimates, sales_invoices, documents, bank, settings)',
	},
	'contacts.list': {
		riskLevel: 'read',
		description:
			'List all contacts, one page at a time (scope: estimates, sales_invoices, documents, bank, settings)',
	},
	'contacts.listDuplicates': {
		riskLevel: 'read',
		description:
			'List possible duplicate contacts, one page at a time (scope: estimates, sales_invoices, documents, bank, settings)',
	},
	'contacts.listVersions': {
		riskLevel: 'read',
		description:
			'List all ids and versions (scope: estimates, sales_invoices, documents, bank, settings)',
	},
	'contacts.notes.create': {
		riskLevel: 'write',
		description:
			'Adds note to entity: adds a note to the contact (scope: estimates, sales_invoices, documents, bank, settings)',
	},
	'contacts.notes.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Destroys note from entity (scope: estimates, sales_invoices, documents, bank, settings)',
	},
	'contacts.paymentsMandate.createUrl': {
		riskLevel: 'write',
		description:
			'Request an URL for setting up a Moneybird Payments mandate: obtains an URL for setting up a Moneybird Payments mandate (scope: sales_invoices, settings)',
	},
	'contacts.paymentsMandate.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a stored Moneybird Payments mandate (scope: estimates, sales_invoices, documents, bank, settings)',
	},
	'contacts.paymentsMandate.get': {
		riskLevel: 'read',
		description:
			'Get Moneybird Payments mandate (scope: estimates, sales_invoices, documents, bank, settings)',
	},
	'contacts.paymentsMandate.request': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Email the contact a request to set up a Moneybird Payments direct debit mandate (they pay 15 cents to confirm) (scope: sales_invoices, settings)',
	},
	'contacts.update': {
		riskLevel: 'write',
		description:
			'Update a contact: when updating a contact, you only need to provide the information you want to change (scope: estimates, sales_invoices, documents, bank, settings)',
	},
	'customFields.list': {
		riskLevel: 'read',
		description:
			'List all custom fields: custom fields are used to add extra information to entities in the administration (scope: settings, sales_invoices, documents, estimates, bank)',
	},
	'customerContactPortal.get': {
		riskLevel: 'read',
		description:
			'Get a temporary link to the customer contact portal: generate a temporary link to the customer contact portal (scope: sales_invoices, estimates)',
	},
	'customerContactPortal.getSubscription': {
		riskLevel: 'read',
		description:
			'Get a temporary link to the subscriptions in the customer contact portal: generate a temporary link to the subscriptions in the customer contact portal (scope: sales_invoices, estimates)',
	},
	'customerContactPortal.listInvoices': {
		riskLevel: 'read',
		description:
			'Get a temporary link to the invoices in the customer contact portal: generate a temporary link to the invoices in the customer contact portal (scope: sales_invoices, estimates)',
	},
	'documentStyles.list': {
		riskLevel: 'read',
		description:
			'List all document styles (scope: settings, sales_invoices, estimates)',
	},
	'documents.generalDocuments.attachments.create': {
		riskLevel: 'write',
		description:
			'Add attachment to general document: add an attachment to a general document (scope: documents)',
	},
	'documents.generalDocuments.attachments.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete an attachment (scope: documents)',
	},
	'documents.generalDocuments.attachments.download': {
		riskLevel: 'read',
		description:
			'Download attachment: download the attachment (returned as a file) (scope: documents)',
	},
	'documents.generalDocuments.create': {
		riskLevel: 'write',
		description: 'Create a new general document (scope: documents)',
	},
	'documents.generalDocuments.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a general document (scope: documents)',
	},
	'documents.generalDocuments.fetchByIds': {
		riskLevel: 'read',
		description:
			'Fetch general documents with given ids: given a list of document ids, returns the document information belonging to the documents (scope: documents)',
	},
	'documents.generalDocuments.get': {
		riskLevel: 'read',
		description: 'Get general document (scope: documents)',
	},
	'documents.generalDocuments.list': {
		riskLevel: 'read',
		description: 'Get general documents, one page at a time (scope: documents)',
	},
	'documents.generalDocuments.listVersions': {
		riskLevel: 'read',
		description:
			'List ids and versions of general documents (scope: documents)',
	},
	'documents.generalDocuments.notes.create': {
		riskLevel: 'write',
		description:
			'Adds note to entity: adds a note to the general document (scope: documents)',
	},
	'documents.generalDocuments.notes.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Destroys note from entity (scope: documents)',
	},
	'documents.generalDocuments.update': {
		riskLevel: 'write',
		description: 'Update a general document (scope: documents)',
	},
	'documents.generalJournalDocuments.attachments.create': {
		riskLevel: 'write',
		description:
			'Add attachment to general journal document: add an attachment to a general journal document (scope: documents)',
	},
	'documents.generalJournalDocuments.attachments.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete an attachment (scope: documents)',
	},
	'documents.generalJournalDocuments.attachments.download': {
		riskLevel: 'read',
		description:
			'Download attachment: download the attachment (returned as a file) (scope: documents)',
	},
	'documents.generalJournalDocuments.create': {
		riskLevel: 'write',
		description: 'Create a new general journal document (scope: documents)',
	},
	'documents.generalJournalDocuments.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a general journal document (scope: documents)',
	},
	'documents.generalJournalDocuments.fetchByIds': {
		riskLevel: 'read',
		description:
			'Fetch general journal documents with given ids: given a list of document ids, returns the document information belonging to the documents (scope: documents)',
	},
	'documents.generalJournalDocuments.get': {
		riskLevel: 'read',
		description: 'Get general journal document (scope: documents)',
	},
	'documents.generalJournalDocuments.list': {
		riskLevel: 'read',
		description:
			'Get general journal documents, one page at a time (scope: documents)',
	},
	'documents.generalJournalDocuments.listVersions': {
		riskLevel: 'read',
		description:
			'List ids and versions of general journal documents (scope: documents)',
	},
	'documents.generalJournalDocuments.notes.create': {
		riskLevel: 'write',
		description:
			'Adds note to entity: adds a note to the general journal document (scope: documents)',
	},
	'documents.generalJournalDocuments.notes.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Destroys note from entity (scope: documents)',
	},
	'documents.generalJournalDocuments.update': {
		riskLevel: 'write',
		description: 'Update a general journal document (scope: documents)',
	},
	'documents.purchaseInvoices.attachments.create': {
		riskLevel: 'write',
		description:
			'Add attachment to purchase invoice: add an attachment to a purchase invoice (scope: documents)',
	},
	'documents.purchaseInvoices.attachments.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete an attachment (scope: documents)',
	},
	'documents.purchaseInvoices.attachments.download': {
		riskLevel: 'read',
		description:
			'Download attachment: download the attachment (returned as a file) (scope: documents)',
	},
	'documents.purchaseInvoices.create': {
		riskLevel: 'write',
		description: 'Create a new purchase invoice (scope: documents)',
	},
	'documents.purchaseInvoices.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a purchase invoices (scope: documents)',
	},
	'documents.purchaseInvoices.fetchByIds': {
		riskLevel: 'read',
		description:
			'Fetch purchase invoices with given ids: given a list of document ids, returns the document information belonging to the documents (scope: documents)',
	},
	'documents.purchaseInvoices.get': {
		riskLevel: 'read',
		description: 'Get purchase invoice (scope: documents)',
	},
	'documents.purchaseInvoices.list': {
		riskLevel: 'read',
		description: 'Get purchase invoices, one page at a time (scope: documents)',
	},
	'documents.purchaseInvoices.listVersions': {
		riskLevel: 'read',
		description:
			'List ids and versions of purchase invoices (scope: documents)',
	},
	'documents.purchaseInvoices.notes.create': {
		riskLevel: 'write',
		description:
			'Adds note to entity: adds a note to the purchase invoice (scope: documents)',
	},
	'documents.purchaseInvoices.notes.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Destroys note from entity (scope: documents)',
	},
	'documents.purchaseInvoices.payments.create': {
		riskLevel: 'write',
		description:
			'Create a payment: registers a payment for a purchase invoice (scope: documents)',
	},
	'documents.purchaseInvoices.payments.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a payment (scope: documents)',
	},
	'documents.purchaseInvoices.update': {
		riskLevel: 'write',
		description: 'Update purchase invoice (scope: documents)',
	},
	'documents.receipts.attachments.create': {
		riskLevel: 'write',
		description:
			'Add attachment to receipt: add an attachment to a receipt (scope: documents)',
	},
	'documents.receipts.attachments.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete an attachment (scope: documents)',
	},
	'documents.receipts.attachments.download': {
		riskLevel: 'read',
		description:
			'Download attachment: download the attachment (returned as a file) (scope: documents)',
	},
	'documents.receipts.create': {
		riskLevel: 'write',
		description: 'Create a new receipt (scope: documents)',
	},
	'documents.receipts.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a receipts (scope: documents)',
	},
	'documents.receipts.fetchByIds': {
		riskLevel: 'read',
		description:
			'Fetch receipts with given ids: given a list of document ids, returns the document information belonging to the documents (scope: documents)',
	},
	'documents.receipts.get': {
		riskLevel: 'read',
		description: 'Get a receipt (scope: documents)',
	},
	'documents.receipts.list': {
		riskLevel: 'read',
		description: 'List receipts, one page at a time (scope: documents)',
	},
	'documents.receipts.listVersions': {
		riskLevel: 'read',
		description: 'List ids and versions of receipts (scope: documents)',
	},
	'documents.receipts.notes.create': {
		riskLevel: 'write',
		description:
			'Adds note to entity: adds a note to the receipt (scope: documents)',
	},
	'documents.receipts.notes.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Destroys note from entity (scope: documents)',
	},
	'documents.receipts.payments.create': {
		riskLevel: 'write',
		description:
			'Create a payment: registers a payment for a receipt (scope: documents)',
	},
	'documents.receipts.payments.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a payment (scope: documents)',
	},
	'documents.receipts.update': {
		riskLevel: 'write',
		description: 'Update a receipt (scope: documents)',
	},
	'documents.typelessDocuments.attachments.create': {
		riskLevel: 'write',
		description:
			'Add attachment to typeless document: add an attachment to a typeless document (scope: documents)',
	},
	'documents.typelessDocuments.attachments.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete an attachment (scope: documents)',
	},
	'documents.typelessDocuments.attachments.download': {
		riskLevel: 'read',
		description:
			'Download attachment: download the attachment (returned as a file) (scope: documents)',
	},
	'documents.typelessDocuments.create': {
		riskLevel: 'write',
		description: 'Create a new typeless document (scope: documents)',
	},
	'documents.typelessDocuments.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a typeless document (scope: documents)',
	},
	'documents.typelessDocuments.fetchByIds': {
		riskLevel: 'read',
		description:
			'Fetch typeless documents with given ids: given a list of document ids, returns the document information belonging to the documents (scope: documents)',
	},
	'documents.typelessDocuments.get': {
		riskLevel: 'read',
		description: 'Get a typeless document (scope: documents)',
	},
	'documents.typelessDocuments.list': {
		riskLevel: 'read',
		description:
			'Get typeless documents, one page at a time (scope: documents)',
	},
	'documents.typelessDocuments.listVersions': {
		riskLevel: 'read',
		description:
			'List ids and versions of typeless documents (scope: documents)',
	},
	'downloads.download': {
		riskLevel: 'read',
		description: 'Download a file (returned as a file)',
	},
	'downloads.list': {
		riskLevel: 'read',
		description: 'List all downloads, one page at a time',
	},
	'estimates.attachments.create': {
		riskLevel: 'write',
		description:
			'Add attachment to estimate: add an attachment to an estimate (scope: estimates)',
	},
	'estimates.attachments.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete an attachment (scope: estimates)',
	},
	'estimates.attachments.download': {
		riskLevel: 'read',
		description:
			'Download attachment: download the attachment (returned as a file) (scope: estimates)',
	},
	'estimates.bill': {
		riskLevel: 'write',
		description:
			'Bills an estimate: an invoice is created based on the accepted estimate (scope: estimates, sales_invoices)',
	},
	'estimates.changeState': {
		riskLevel: 'write',
		description:
			'Changes the state of an estimate: not every state change is allowed (scope: estimates)',
	},
	'estimates.create': {
		riskLevel: 'write',
		description: 'Creates a new estimate (scope: estimates)',
	},
	'estimates.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Deletes an estimate (scope: estimates)',
	},
	'estimates.downloadPdf': {
		riskLevel: 'read',
		description:
			'Download estimate PDF by id: redirects to the download URL of the estimate as PDF (returned as a file) (scope: estimates)',
	},
	'estimates.downloadSignedPdf': {
		riskLevel: 'read',
		description:
			'Download signed estimate PDF by id: redirects to the download URL of the estimate PDF that the contact signed online (returned as a file) (scope: estimates)',
	},
	'estimates.fetchByIds': {
		riskLevel: 'read',
		description:
			'Fetch estimates with given ids: given a list of estimate ids, returns the estimate information belonging to the estimates (scope: estimates)',
	},
	'estimates.get': {
		riskLevel: 'read',
		description: 'Get an estimate by id (scope: estimates)',
	},
	'estimates.getByEstimateId': {
		riskLevel: 'read',
		description: 'Get an estimate by estimate_id (scope: estimates)',
	},
	'estimates.list': {
		riskLevel: 'read',
		description: 'List all estimates, one page at a time (scope: estimates)',
	},
	'estimates.listVersions': {
		riskLevel: 'read',
		description: 'List all ids and versions (scope: estimates)',
	},
	'estimates.notes.create': {
		riskLevel: 'write',
		description:
			'Adds note to entity: adds a note to the estimate (scope: estimates)',
	},
	'estimates.notes.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Destroys note from entity (scope: estimates)',
	},
	'estimates.send': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Send an estimate to the contact (sends real email) or schedule it (scope: estimates)',
	},
	'estimates.update': {
		riskLevel: 'write',
		description:
			'Updates an estimate: when updating an estimate, provide only the attributes you want to update (scope: estimates)',
	},
	'events.list': {
		riskLevel: 'read',
		description: 'List events',
	},
	'externalSalesInvoices.attachments.create': {
		riskLevel: 'write',
		description:
			'Add attachment to external sales invoice: add an attachment to an external sales invoice (scope: sales_invoices)',
	},
	'externalSalesInvoices.attachments.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete an attachment (scope: sales_invoices)',
	},
	'externalSalesInvoices.attachments.download': {
		riskLevel: 'read',
		description:
			'Download attachment: download the attachment (returned as a file) (scope: sales_invoices)',
	},
	'externalSalesInvoices.create': {
		riskLevel: 'write',
		description: 'Create an external sales invoice (scope: sales_invoices)',
	},
	'externalSalesInvoices.createFromAttachment': {
		riskLevel: 'write',
		description:
			'Create external sales invoice from attachment (scope: sales_invoices)',
	},
	'externalSalesInvoices.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete an external sales invoice (scope: sales_invoices)',
	},
	'externalSalesInvoices.fetchByIds': {
		riskLevel: 'read',
		description:
			'Fetch external sales invoices with given ids: given a list of external sales invoice ids, returns the external sales invoice information belonging to the external sales invoice (scope: sales_invoices)',
	},
	'externalSalesInvoices.get': {
		riskLevel: 'read',
		description: 'Get an external sales invoice by id (scope: sales_invoices)',
	},
	'externalSalesInvoices.list': {
		riskLevel: 'read',
		description:
			'List all external invoices, one page at a time (scope: sales_invoices)',
	},
	'externalSalesInvoices.listVersions': {
		riskLevel: 'read',
		description: 'List all ids and versions (scope: sales_invoices)',
	},
	'externalSalesInvoices.markAsDubious': {
		riskLevel: 'write',
		description:
			'Mark as dubious: this endpoint marks an external sales invoice as dubious (scope: sales_invoices)',
	},
	'externalSalesInvoices.markAsUncollectible': {
		riskLevel: 'write',
		description:
			'Mark as uncollectible: this endpoint marks an external sales invoice as uncollectible (scope: sales_invoices)',
	},
	'externalSalesInvoices.notes.create': {
		riskLevel: 'write',
		description:
			'Adds note to entity: adds a note to the external sales invoice (scope: sales_invoices)',
	},
	'externalSalesInvoices.notes.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Destroys note from entity (scope: sales_invoices)',
	},
	'externalSalesInvoices.payments.create': {
		riskLevel: 'write',
		description:
			'Create a payment: registers a payment for an external sales invoice (scope: sales_invoices)',
	},
	'externalSalesInvoices.payments.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a payment (scope: sales_invoices)',
	},
	'externalSalesInvoices.update': {
		riskLevel: 'write',
		description:
			'Update an external sales invoice: when updating an external sales invoice, provide only the attributes you want to update (scope: sales_invoices)',
	},
	'financialAccounts.list': {
		riskLevel: 'read',
		description:
			'Retrieve all available financial accounts for the administration: retrieve the financial accounts for the administration (scope: settings)',
	},
	'financialMutations.fetchByIds': {
		riskLevel: 'read',
		description:
			'Fetch financial mutations with given ids: given a list of financial mutation ids, returns the financial mutation information belonging to the financial mutation (scope: bank)',
	},
	'financialMutations.get': {
		riskLevel: 'read',
		description: 'Get a financial mutation by id (scope: bank)',
	},
	'financialMutations.linkBooking': {
		riskLevel: 'write',
		description:
			'Links a financial mutation to a booking: linking a booking to a financial mutation allows you to process financial mutations (scope: bank)',
	},
	'financialMutations.list': {
		riskLevel: 'read',
		description: 'List all financial mutations (scope: bank)',
	},
	'financialMutations.listVersions': {
		riskLevel: 'read',
		description: 'List all ids and versions (scope: bank)',
	},
	'financialMutations.unlinkBooking': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Unlinks a booking from a financial mutation (scope: bank)',
	},
	'financialStatements.create': {
		riskLevel: 'write',
		description: 'Create a new financial statement (scope: bank)',
	},
	'financialStatements.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a financial statement (scope: bank)',
	},
	'financialStatements.update': {
		riskLevel: 'write',
		description:
			'Update a financial statement: when updating a financial statement, you only need to provide the information you want to change (scope: bank)',
	},
	'identities.create': {
		riskLevel: 'write',
		description:
			'Creates an identity: most fields for an identity are required (scope: settings)',
	},
	'identities.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Deletes an identity (scope: settings)',
	},
	'identities.get': {
		riskLevel: 'read',
		description: 'Retrieve identity by given id (scope: settings)',
	},
	'identities.getDefault': {
		riskLevel: 'read',
		description: 'Retrieve the default identity (scope: settings)',
	},
	'identities.list': {
		riskLevel: 'read',
		description:
			'Retrieve identities: an administration can have multiple identities, for example to cover multiple tradenames or offices (scope: settings)',
	},
	'identities.update': {
		riskLevel: 'write',
		description: 'Updates an identity (scope: settings)',
	},
	'identities.updateDefault': {
		riskLevel: 'write',
		description: 'Updates the default identity (scope: settings)',
	},
	'ledgerAccounts.create': {
		riskLevel: 'write',
		description: 'Creates a new ledger account (scope: settings)',
	},
	'ledgerAccounts.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Deletes a ledger account (scope: settings)',
	},
	'ledgerAccounts.get': {
		riskLevel: 'read',
		description:
			'Returns information about a ledger account (scope: settings, sales_invoices, documents, estimates)',
	},
	'ledgerAccounts.list': {
		riskLevel: 'read',
		description:
			'List all ledger accounts of an administration (scope: settings, sales_invoices, documents, estimates)',
	},
	'ledgerAccounts.update': {
		riskLevel: 'write',
		description: 'Updates a ledger account (scope: settings)',
	},
	'payments.get': {
		riskLevel: 'read',
		description: 'Returns information about a payment',
	},
	'products.create': {
		riskLevel: 'write',
		description: 'Creates a new product (scope: settings)',
	},
	'products.createSalesLink': {
		riskLevel: 'write',
		description:
			'Create online sales link: this call generates an online sales link, and allows pre-setting the contact for a checkout page (scope: settings)',
	},
	'products.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Deletes a product (scope: settings)',
	},
	'products.get': {
		riskLevel: 'read',
		description: 'Returns information about a product (scope: settings)',
	},
	'products.getByIdentifier': {
		riskLevel: 'read',
		description:
			'Returns information about a product based on the identifier: finds the product by the identifier field of the product (scope: settings)',
	},
	'products.list': {
		riskLevel: 'read',
		description:
			'List all products of an administration, one page at a time (scope: settings)',
	},
	'products.update': {
		riskLevel: 'write',
		description: 'Updates a product (scope: settings)',
	},
	'projects.create': {
		riskLevel: 'write',
		description:
			'Create a project; the name must be unique within the administration (scope: settings)',
	},
	'projects.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Deletes a project (scope: settings)',
	},
	'projects.get': {
		riskLevel: 'read',
		description: 'Returns information about a project (scope: settings)',
	},
	'projects.list': {
		riskLevel: 'read',
		description:
			'List all projects of an administration, one page at a time (scope: settings)',
	},
	'projects.update': {
		riskLevel: 'write',
		description: 'Updates a project (scope: settings)',
	},
	'purchaseTransactionBatches.createFromSepaFile': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Upload a SEPA credit transfer file to create purchase transaction batches: upload a SEPA credit transfer file (pain.001.001.09/Version 2019) to create purchase transaction batches (scope: bank)',
	},
	'purchaseTransactionBatches.download': {
		riskLevel: 'read',
		description:
			'Download a purchase transaction batch as SEPA credit transfer file: download the purchase transaction batch as a SEPA credit transfer file (pain.001) (returned as a file) (scope: bank)',
	},
	'purchaseTransactionBatches.get': {
		riskLevel: 'read',
		description: 'Get a purchase transaction batch by id (scope: bank)',
	},
	'purchaseTransactions.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a purchase transaction (scope: bank)',
	},
	'purchaseTransactions.get': {
		riskLevel: 'read',
		description: 'Get a purchase transaction by id (scope: bank)',
	},
	'purchaseTransactions.list': {
		riskLevel: 'read',
		description:
			'List all purchase transactions, one page at a time (scope: bank)',
	},
	'recurringSalesInvoices.create': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Creates a new recurring sales invoice: a recurring sales invoice will create new sales invoices on set intervals (scope: sales_invoices)',
	},
	'recurringSalesInvoices.deactivate': {
		riskLevel: 'write',
		description:
			'Deactivate a recurring sales invoice: stops a recurring sales invoice from creating new sales invoices (scope: sales_invoices)',
	},
	'recurringSalesInvoices.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Destroy or deactivate a recurring sales invoice: a recurring sales invoice will be destroyed if it has not created any sales invoices (scope: sales_invoices)',
	},
	'recurringSalesInvoices.fetchByIds': {
		riskLevel: 'read',
		description:
			'Fetch recurring sales invoices with given IDs: given a list of recurring sales invoice IDs, returns the details of the recurring invoices (scope: sales_invoices)',
	},
	'recurringSalesInvoices.get': {
		riskLevel: 'read',
		description: 'Get a recurring sales invoice by id (scope: sales_invoices)',
	},
	'recurringSalesInvoices.list': {
		riskLevel: 'read',
		description:
			'List all recurring sales invoices, one page at a time (scope: sales_invoices)',
	},
	'recurringSalesInvoices.listVersions': {
		riskLevel: 'read',
		description: 'List all IDs and versions (scope: sales_invoices)',
	},
	'recurringSalesInvoices.notes.create': {
		riskLevel: 'write',
		description:
			'Adds note to entity: adds a note to the recurring sales invoice (scope: sales_invoices)',
	},
	'recurringSalesInvoices.notes.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Destroys note from entity (scope: sales_invoices)',
	},
	'recurringSalesInvoices.update': {
		riskLevel: 'write',
		description: 'Updates a recurring sales invoice (scope: sales_invoices)',
	},
	'reports.assets': {
		riskLevel: 'read',
		description:
			'Assets report: get the assets report for the administration (scope: documents)',
	},
	'reports.balanceSheet': {
		riskLevel: 'read',
		description:
			'Balance sheet report: get the balance sheet report for the administration showing the financial position at the end of the specified period (scope: bank)',
	},
	'reports.bankBalance': {
		riskLevel: 'read',
		description:
			'Bank balance report: get the booked balance of each financial account at the end of the specified period (scope: bank)',
	},
	'reports.cashFlow': {
		riskLevel: 'read',
		description:
			'Cash flow report: get the cash flow report for the administration showing cash received and cash paid during the specified period (scope: bank)',
	},
	'reports.creditors': {
		riskLevel: 'read',
		description: 'Creditors report (scope: documents)',
	},
	'reports.creditorsAging': {
		riskLevel: 'read',
		description: 'Creditors aging report (scope: documents)',
	},
	'reports.debtors': {
		riskLevel: 'read',
		description: 'Debtors report (scope: sales_invoices)',
	},
	'reports.debtorsAging': {
		riskLevel: 'read',
		description: 'Debtors aging report (scope: sales_invoices)',
	},
	'reports.expensesByContact': {
		riskLevel: 'read',
		description: 'Expenses by contact report (scope: documents)',
	},
	'reports.expensesByProject': {
		riskLevel: 'read',
		description: 'Expenses by project report (scope: documents)',
	},
	'reports.exportAuditfile': {
		riskLevel: 'write',
		description:
			'Export auditfile: queue the export of an auditfile (XAF XML format) for the specified year (scope: bank, documents, estimates, sales_invoices, settings)',
	},
	'reports.exportBrugstaat': {
		riskLevel: 'write',
		description:
			'Export brugstaat: queue the export of a brugstaat XML file for the specified year (scope: bank, documents, sales_invoices)',
	},
	'reports.exportLedgerAccounts': {
		riskLevel: 'write',
		description:
			'Export ledger accounts: queue the export of ledger accounts (grootboekkaarten) to an Excel file for the specified year (scope: documents, sales_invoices)',
	},
	'reports.generalLedger': {
		riskLevel: 'read',
		description:
			'General ledger report: get the general ledger report for the administration showing all ledger accounts with their balances and movements during the specified period (scope: bank)',
	},
	'reports.journalEntries': {
		riskLevel: 'read',
		description:
			'Journal entries report: get the journal entries report showing all bookings within the specified period, one page at a time (scope: documents, sales_invoices)',
	},
	'reports.profitLoss': {
		riskLevel: 'read',
		description:
			'Profit loss report: get the profit loss report for the administration (scope: documents, sales_invoices)',
	},
	'reports.revenueByContact': {
		riskLevel: 'read',
		description: 'Revenue by contact report (scope: sales_invoices)',
	},
	'reports.revenueByProject': {
		riskLevel: 'read',
		description: 'Revenue by project report (scope: sales_invoices)',
	},
	'reports.subscriptions': {
		riskLevel: 'read',
		description:
			'Subscriptions report: get the subscriptions report for the administration (scope: sales_invoices)',
	},
	'reports.tax': {
		riskLevel: 'read',
		description:
			'Tax report: get the tax report for the administration (scope: documents, sales_invoices)',
	},
	'reports.workingCapital': {
		riskLevel: 'read',
		description:
			'Working capital report: get the working capital of the administration at the end of the specified period, with the same figures as the balance card on the reports page (scope: bank)',
	},
	'salesInvoices.attachments.create': {
		riskLevel: 'write',
		description:
			'Add attachment to sales invoice: add an attachment to a sales invoice (scope: sales_invoices)',
	},
	'salesInvoices.attachments.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete an attachment (scope: sales_invoices)',
	},
	'salesInvoices.attachments.download': {
		riskLevel: 'read',
		description:
			'Download attachment: download the attachment (returned as a file) (scope: sales_invoices)',
	},
	'salesInvoices.create': {
		riskLevel: 'write',
		description:
			'Create a sales invoice: create a sales invoice with the parameters defined in the request body (scope: sales_invoices)',
	},
	'salesInvoices.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a sales invoice (scope: sales_invoices)',
	},
	'salesInvoices.downloadPackingSlipPdf': {
		riskLevel: 'read',
		description:
			'Download sales invoice packing slip PDF by id: redirects to the download URL of the sales invoice as packing slip PDF (returned as a file) (scope: sales_invoices)',
	},
	'salesInvoices.downloadPdf': {
		riskLevel: 'read',
		description:
			'Download sales invoice PDF by id: redirects to the download URL of the sales invoice as PDF (returned as a file) (scope: sales_invoices)',
	},
	'salesInvoices.downloadUbl': {
		riskLevel: 'read',
		description:
			'Download sales invoice UBL by id: download the sales invoice as UBL (returned as a file) (scope: sales_invoices)',
	},
	'salesInvoices.duplicateAsCreditInvoice': {
		riskLevel: 'write',
		description:
			'Duplicate to credit invoice: duplicate a sales invoice to a new credit invoice (scope: sales_invoices)',
	},
	'salesInvoices.fetchByIds': {
		riskLevel: 'read',
		description:
			'Fetch sales invoices with given ids: given a list of sales invoice ids, returns the sales invoice information belonging to the invoices (scope: sales_invoices)',
	},
	'salesInvoices.get': {
		riskLevel: 'read',
		description: 'Get an invoice by id (scope: sales_invoices)',
	},
	'salesInvoices.getByInvoiceId': {
		riskLevel: 'read',
		description:
			'Get an invoice by invoice_id: get a sales invoice by the invoice_id field of the sales invoice (scope: sales_invoices)',
	},
	'salesInvoices.getByReference': {
		riskLevel: 'read',
		description:
			'Get an invoice by reference: get a sales invoice by the reference field of the sales invoice (scope: sales_invoices)',
	},
	'salesInvoices.list': {
		riskLevel: 'read',
		description:
			"List sales invoices with a filter string such as 'state:open|paid' or 'period:this_year', one page at a time (scope: sales_invoices)",
	},
	'salesInvoices.listVersions': {
		riskLevel: 'read',
		description: 'List all ids and versions (scope: sales_invoices)',
	},
	'salesInvoices.markAsDubious': {
		riskLevel: 'write',
		description:
			'Mark as dubious: this endpoint marks a sales invoice as dubious (scope: sales_invoices)',
	},
	'salesInvoices.markAsUncollectible': {
		riskLevel: 'write',
		description:
			'Mark as uncollectible: this endpoint marks a sales invoice as uncollectible (scope: sales_invoices)',
	},
	'salesInvoices.notes.create': {
		riskLevel: 'write',
		description:
			'Adds note to entity: adds a note to the sales invoice (scope: sales_invoices)',
	},
	'salesInvoices.notes.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Destroys note from entity (scope: sales_invoices)',
	},
	'salesInvoices.pause': {
		riskLevel: 'write',
		description:
			'Pause sales invoice: this endpoint pauses a sales invoice (scope: sales_invoices)',
	},
	'salesInvoices.payments.create': {
		riskLevel: 'write',
		description:
			'Create a payment: registers a payment for a sales invoice (scope: sales_invoices)',
	},
	'salesInvoices.payments.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a payment: delete a payment from a sales invoice (scope: sales_invoices)',
	},
	'salesInvoices.registerCreditInvoicePayment': {
		riskLevel: 'write',
		description:
			'Register a payment for a creditinvoice: settles a credit invoice against the sales invoice it credits (scope: sales_invoices)',
	},
	'salesInvoices.resume': {
		riskLevel: 'write',
		description:
			'Resume sales invoice: this endpoint resumes the sales invoice (scope: sales_invoices)',
	},
	'salesInvoices.send': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Send the invoice to the customer now (email, Peppol, post or manual) or schedule it for a date; defaults come from the contact and workflow (scope: sales_invoices)',
	},
	'salesInvoices.sendReminders': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Send payment reminders for overdue sales invoices to their contacts (sends real email) (scope: sales_invoices)',
	},
	'salesInvoices.update': {
		riskLevel: 'write',
		description:
			'Update a sales invoice: when updating a sales invoice, provide only the attributes you want to update (scope: sales_invoices)',
	},
	'subscriptionTemplates.createSalesLink': {
		riskLevel: 'write',
		description:
			'Create online sales link: this call generates an online sales link, and allows pre-setting the contact and start date for a subscription (scope: settings)',
	},
	'subscriptionTemplates.list': {
		riskLevel: 'read',
		description:
			'List all subscription templates: this call retrieves a paginated list of all subscription templates available in the administration, one page at a time (scope: settings)',
	},
	'subscriptions.additionalCharges.create': {
		riskLevel: 'write',
		description:
			'Create an additional charge to be invoiced together with the subscription: at the end of the current subscription period, the additional charges are merged where possible and an invoice will be created for them (scope: sales_invoices)',
	},
	'subscriptions.additionalCharges.list': {
		riskLevel: 'read',
		description:
			'Get additional charges: get the additional charges of the given subscription (scope: sales_invoices)',
	},
	'subscriptions.create': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Create a new subscription: starts a new subscription for the given contact (scope: sales_invoices)',
	},
	'subscriptions.createAndScheduleOneOffSalesInvoice': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Create and schedule an invoice to be sent together with the subscription: besides the recurring sales invoice for the subscription, you sometimes need to bill separate costs like usage based charges (scope: sales_invoices)',
	},
	'subscriptions.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Cancel a subscription: cancels the subscription (scope: sales_invoices)',
	},
	'subscriptions.get': {
		riskLevel: 'read',
		description: 'Get subscription: get a subscription (scope: sales_invoices)',
	},
	'subscriptions.list': {
		riskLevel: 'read',
		description:
			'List subscriptions of a contact: lists the subscriptions of a single contact (scope: sales_invoices)',
	},
	'subscriptions.update': {
		riskLevel: 'write',
		description: 'Update a subscription (scope: sales_invoices)',
	},
	'taskListGroups.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Deletes a task list group: permanently deletes a task list group and all its tasks (scope: bank, documents, estimates, sales_invoices, settings, time_entries)',
	},
	'taskListGroups.get': {
		riskLevel: 'read',
		description:
			'Returns information about a task list group (scope: bank, documents, estimates, sales_invoices, settings, time_entries)',
	},
	'taskListGroups.tasks.create': {
		riskLevel: 'write',
		description:
			'Creates a new task in a group (scope: bank, documents, estimates, sales_invoices, settings, time_entries)',
	},
	'taskListGroups.update': {
		riskLevel: 'write',
		description:
			'Updates a task list group (scope: bank, documents, estimates, sales_invoices, settings, time_entries)',
	},
	'taskListTasks.assign': {
		riskLevel: 'write',
		description:
			'Assigns a user to a task: assigns a user to the specified task (scope: bank, documents, estimates, sales_invoices, settings, time_entries)',
	},
	'taskListTasks.complete': {
		riskLevel: 'write',
		description:
			'Completes a task: marks a task and all its subtasks as completed (scope: bank, documents, estimates, sales_invoices, settings, time_entries)',
	},
	'taskListTasks.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Deletes a task: permanently deletes a task and all its subtasks (scope: bank, documents, estimates, sales_invoices, settings, time_entries)',
	},
	'taskListTasks.get': {
		riskLevel: 'read',
		description:
			'Returns information about a task (scope: bank, documents, estimates, sales_invoices, settings, time_entries)',
	},
	'taskListTasks.notes.create': {
		riskLevel: 'write',
		description:
			'Creates a note on a task (scope: bank, documents, estimates, sales_invoices, settings, time_entries)',
	},
	'taskListTasks.reopen': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Reopens a task: reopens a completed task and possible parent tasks (scope: bank, documents, estimates, sales_invoices, settings, time_entries)',
	},
	'taskListTasks.unassign': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Unassigns the user from a task: removes the current assignment from the specified task (scope: bank, documents, estimates, sales_invoices, settings, time_entries)',
	},
	'taskListTasks.update': {
		riskLevel: 'write',
		description:
			'Updates a task (scope: bank, documents, estimates, sales_invoices, settings, time_entries)',
	},
	'taskListTemplates.create': {
		riskLevel: 'write',
		description:
			'Creates a new task list template (scope: bank, documents, estimates, sales_invoices, settings, time_entries)',
	},
	'taskListTemplates.createTaskList': {
		riskLevel: 'write',
		description:
			'Creates a task list from a template (scope: bank, documents, estimates, sales_invoices, settings, time_entries)',
	},
	'taskListTemplates.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Deletes a task list template: permanently deletes a task list template and all its groups and tasks (scope: bank, documents, estimates, sales_invoices, settings, time_entries)',
	},
	'taskListTemplates.get': {
		riskLevel: 'read',
		description:
			'Returns information about a task list template (scope: bank, documents, estimates, sales_invoices, settings, time_entries)',
	},
	'taskListTemplates.groups.create': {
		riskLevel: 'write',
		description:
			'Creates a new group in a task list template (scope: bank, documents, estimates, sales_invoices, settings, time_entries)',
	},
	'taskListTemplates.list': {
		riskLevel: 'read',
		description:
			'List all task list templates of an administration (scope: bank, documents, estimates, sales_invoices, settings, time_entries)',
	},
	'taskListTemplates.update': {
		riskLevel: 'write',
		description:
			'Updates a task list template (scope: bank, documents, estimates, sales_invoices, settings, time_entries)',
	},
	'taskLists.create': {
		riskLevel: 'write',
		description:
			'Creates a new task list (scope: bank, documents, estimates, sales_invoices, settings, time_entries)',
	},
	'taskLists.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Deletes a task list: permanently deletes a task list and all its groups and tasks (scope: bank, documents, estimates, sales_invoices, settings, time_entries)',
	},
	'taskLists.get': {
		riskLevel: 'read',
		description:
			'Returns information about a task list (scope: bank, documents, estimates, sales_invoices, settings, time_entries)',
	},
	'taskLists.groups.create': {
		riskLevel: 'write',
		description:
			'Creates a new group in a task list (scope: bank, documents, estimates, sales_invoices, settings, time_entries)',
	},
	'taskLists.list': {
		riskLevel: 'read',
		description:
			'List all task lists of an administration, one page at a time (scope: bank, documents, estimates, sales_invoices, settings, time_entries)',
	},
	'taskLists.update': {
		riskLevel: 'write',
		description:
			'Updates a task list (scope: bank, documents, estimates, sales_invoices, settings, time_entries)',
	},
	'taxRates.list': {
		riskLevel: 'read',
		description:
			'List all available tax rates for the administration, one page at a time (scope: settings, sales_invoices, documents, estimates)',
	},
	'timeEntries.create': {
		riskLevel: 'write',
		description:
			'Create a time entry from started_at to ended_at; Moneybird rounds to full minutes (scope: time_entries)',
	},
	'timeEntries.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a time entry: delete a time entry by id (scope: time_entries)',
	},
	'timeEntries.get': {
		riskLevel: 'read',
		description: 'Get a time entry by id (scope: time_entries)',
	},
	'timeEntries.list': {
		riskLevel: 'read',
		description:
			'List all time entries, one page at a time (scope: time_entries)',
	},
	'timeEntries.notes.create': {
		riskLevel: 'write',
		description:
			'Adds note to entity: adds a note to the time entry (scope: time_entries)',
	},
	'timeEntries.notes.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Destroys note from entity (scope: time_entries)',
	},
	'timeEntries.resume': {
		riskLevel: 'write',
		description:
			'Resume a stopped timer: resumes a stopped time entry (scope: time_entries)',
	},
	'timeEntries.stop': {
		riskLevel: 'write',
		description: 'Stops an active time entry (scope: time_entries)',
	},
	'timeEntries.update': {
		riskLevel: 'write',
		description:
			'Update a time entry: when updating a time entry, provide only the attributes you want to update (scope: time_entries)',
	},
	'users.list': {
		riskLevel: 'read',
		description: 'List all users (scope: settings)',
	},
	'verifications.list': {
		riskLevel: 'read',
		description:
			'Retrieve verifications: retrieve all the verifications within an administration (scope: settings)',
	},
	'webhooks.activate': {
		riskLevel: 'write',
		description:
			'Activate a webhook: activates a previously deactivated webhook (scope: settings)',
	},
	'webhooks.create': {
		riskLevel: 'write',
		description: 'Create a webhook (scope: settings)',
	},
	'webhooks.deactivate': {
		riskLevel: 'write',
		description:
			'Deactivate a webhook: deactivates a webhook (scope: settings)',
	},
	'webhooks.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a webhook: remove a registered webhook (scope: settings)',
	},
	'webhooks.list': {
		riskLevel: 'read',
		description:
			'List all webhooks: list all registered webhooks for the administration (scope: settings)',
	},
	'workflows.get': {
		riskLevel: 'read',
		description:
			'Get a workflow by id (scope: settings, sales_invoices, documents, estimates, bank)',
	},
	'workflows.list': {
		riskLevel: 'read',
		description:
			'Retrieve available workflows (scope: settings, sales_invoices, documents, estimates, bank)',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof moneybirdEndpointsNested
>;
