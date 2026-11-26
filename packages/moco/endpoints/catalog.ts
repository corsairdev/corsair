// Generated with endpoints/operation-types.ts from MOCO's OpenAPI spec:
// one entry per operation in moco-manifest.json. Risk levels follow
// .github/PLUGIN_PR_RULES.md (R8).
import type {
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { mocoSchemaEntry } from './openapi-schema';
import { createMocoOperation as op } from './operations';

export const mocoEndpointsNested = {
	account: {
		catalogServices: {
			create: op('account.catalogServices.create'),
			delete: op('account.catalogServices.delete'),
			get: op('account.catalogServices.get'),
			items: {
				create: op('account.catalogServices.items.create'),
				delete: op('account.catalogServices.items.delete'),
				get: op('account.catalogServices.items.get'),
				update: op('account.catalogServices.items.update'),
			},
			list: op('account.catalogServices.list'),
			update: op('account.catalogServices.update'),
		},
		customProperties: {
			create: op('account.customProperties.create'),
			delete: op('account.customProperties.delete'),
			get: op('account.customProperties.get'),
			list: op('account.customProperties.list'),
			update: op('account.customProperties.update'),
		},
		expenseTemplates: {
			create: op('account.expenseTemplates.create'),
			delete: op('account.expenseTemplates.delete'),
			get: op('account.expenseTemplates.get'),
			list: op('account.expenseTemplates.list'),
			update: op('account.expenseTemplates.update'),
		},
		fixedCosts: {
			list: op('account.fixedCosts.list'),
		},
		hourlyRates: {
			get: op('account.hourlyRates.get'),
		},
		internalHourlyRates: {
			get: op('account.internalHourlyRates.get'),
			update: op('account.internalHourlyRates.update'),
		},
		taskTemplates: {
			create: op('account.taskTemplates.create'),
			delete: op('account.taskTemplates.delete'),
			get: op('account.taskTemplates.get'),
			list: op('account.taskTemplates.list'),
			update: op('account.taskTemplates.update'),
		},
		webHooks: {
			create: op('account.webHooks.create'),
			delete: op('account.webHooks.delete'),
			disable: op('account.webHooks.disable'),
			enable: op('account.webHooks.enable'),
			get: op('account.webHooks.get'),
			list: op('account.webHooks.list'),
			update: op('account.webHooks.update'),
		},
	},
	activities: {
		bulkCreate: op('activities.bulkCreate'),
		create: op('activities.create'),
		delete: op('activities.delete'),
		disregard: op('activities.disregard'),
		get: op('activities.get'),
		list: op('activities.list'),
		startTimer: op('activities.startTimer'),
		stopTimer: op('activities.stopTimer'),
		update: op('activities.update'),
		updateBillableSeconds: op('activities.updateBillableSeconds'),
	},
	approvals: {
		approve: op('approvals.approve'),
		create: op('approvals.create'),
		delete: op('approvals.delete'),
		deny: op('approvals.deny'),
		get: op('approvals.get'),
		list: op('approvals.list'),
	},
	comments: {
		bulkCreate: op('comments.bulkCreate'),
		create: op('comments.create'),
		delete: op('comments.delete'),
		get: op('comments.get'),
		list: op('comments.list'),
		update: op('comments.update'),
	},
	companies: {
		archive: op('companies.archive'),
		create: op('companies.create'),
		delete: op('companies.delete'),
		get: op('companies.get'),
		list: op('companies.list'),
		unarchive: op('companies.unarchive'),
		update: op('companies.update'),
	},
	contacts: {
		create: op('contacts.create'),
		delete: op('contacts.delete'),
		get: op('contacts.get'),
		list: op('contacts.list'),
		update: op('contacts.update'),
	},
	dealCategories: {
		create: op('dealCategories.create'),
		delete: op('dealCategories.delete'),
		get: op('dealCategories.get'),
		list: op('dealCategories.list'),
		update: op('dealCategories.update'),
	},
	deals: {
		create: op('deals.create'),
		delete: op('deals.delete'),
		get: op('deals.get'),
		list: op('deals.list'),
		update: op('deals.update'),
	},
	invoiceReminders: {
		create: op('invoiceReminders.create'),
		delete: op('invoiceReminders.delete'),
		get: op('invoiceReminders.get'),
		list: op('invoiceReminders.list'),
		sendEmail: op('invoiceReminders.sendEmail'),
	},
	invoices: {
		attachments: {
			create: op('invoices.attachments.create'),
			delete: op('invoices.attachments.delete'),
			list: op('invoices.attachments.list'),
		},
		bookkeepingExports: {
			create: op('invoices.bookkeepingExports.create'),
			get: op('invoices.bookkeepingExports.get'),
			list: op('invoices.bookkeepingExports.list'),
		},
		create: op('invoices.create'),
		delete: op('invoices.delete'),
		get: op('invoices.get'),
		getPdf: op('invoices.getPdf'),
		getTimesheet: op('invoices.getTimesheet'),
		getTimesheetPdf: op('invoices.getTimesheetPdf'),
		list: op('invoices.list'),
		listExpenses: op('invoices.listExpenses'),
		listLocked: op('invoices.listLocked'),
		payments: {
			bulkCreate: op('invoices.payments.bulkCreate'),
			create: op('invoices.payments.create'),
			delete: op('invoices.payments.delete'),
			get: op('invoices.payments.get'),
			list: op('invoices.payments.list'),
			update: op('invoices.payments.update'),
		},
		sendEmail: op('invoices.sendEmail'),
		updateStatus: op('invoices.updateStatus'),
	},
	letterPapers: {
		list: op('letterPapers.list'),
	},
	offerConfirmations: {
		create: op('offerConfirmations.create'),
		delete: op('offerConfirmations.delete'),
		get: op('offerConfirmations.get'),
		getPdf: op('offerConfirmations.getPdf'),
		list: op('offerConfirmations.list'),
		update: op('offerConfirmations.update'),
	},
	offers: {
		assign: op('offers.assign'),
		attachments: {
			create: op('offers.attachments.create'),
			delete: op('offers.attachments.delete'),
			list: op('offers.attachments.list'),
		},
		create: op('offers.create'),
		customerApproval: {
			activate: op('offers.customerApproval.activate'),
			deactivate: op('offers.customerApproval.deactivate'),
			get: op('offers.customerApproval.get'),
		},
		delete: op('offers.delete'),
		get: op('offers.get'),
		getPdf: op('offers.getPdf'),
		list: op('offers.list'),
		sendEmail: op('offers.sendEmail'),
		update: op('offers.update'),
		updateStatus: op('offers.updateStatus'),
	},
	plannedPurchases: {
		create: op('plannedPurchases.create'),
		delete: op('plannedPurchases.delete'),
		get: op('plannedPurchases.get'),
		list: op('plannedPurchases.list'),
		update: op('plannedPurchases.update'),
	},
	planningEntries: {
		create: op('planningEntries.create'),
		delete: op('planningEntries.delete'),
		get: op('planningEntries.get'),
		list: op('planningEntries.list'),
		update: op('planningEntries.update'),
	},
	profile: {
		get: op('profile.get'),
		performanceReport: op('profile.performanceReport'),
	},
	projects: {
		archive: op('projects.archive'),
		assignProjectGroup: op('projects.assignProjectGroup'),
		contracts: {
			create: op('projects.contracts.create'),
			delete: op('projects.contracts.delete'),
			get: op('projects.contracts.get'),
			list: op('projects.contracts.list'),
			update: op('projects.contracts.update'),
		},
		create: op('projects.create'),
		delete: op('projects.delete'),
		disableShare: op('projects.disableShare'),
		expenses: {
			bulkCreate: op('projects.expenses.bulkCreate'),
			create: op('projects.expenses.create'),
			delete: op('projects.expenses.delete'),
			disregard: op('projects.expenses.disregard'),
			get: op('projects.expenses.get'),
			list: op('projects.expenses.list'),
			listAll: op('projects.expenses.listAll'),
			update: op('projects.expenses.update'),
		},
		get: op('projects.get'),
		groups: {
			get: op('projects.groups.get'),
			list: op('projects.groups.list'),
		},
		list: op('projects.list'),
		listAssigned: op('projects.listAssigned'),
		paymentSchedules: {
			create: op('projects.paymentSchedules.create'),
			delete: op('projects.paymentSchedules.delete'),
			get: op('projects.paymentSchedules.get'),
			list: op('projects.paymentSchedules.list'),
			listAll: op('projects.paymentSchedules.listAll'),
			update: op('projects.paymentSchedules.update'),
		},
		recurringExpenses: {
			create: op('projects.recurringExpenses.create'),
			delete: op('projects.recurringExpenses.delete'),
			get: op('projects.recurringExpenses.get'),
			list: op('projects.recurringExpenses.list'),
			recur: op('projects.recurringExpenses.recur'),
			update: op('projects.recurringExpenses.update'),
		},
		report: op('projects.report'),
		share: op('projects.share'),
		tasks: {
			create: op('projects.tasks.create'),
			delete: op('projects.tasks.delete'),
			deleteAll: op('projects.tasks.deleteAll'),
			get: op('projects.tasks.get'),
			list: op('projects.tasks.list'),
			update: op('projects.tasks.update'),
		},
		unarchive: op('projects.unarchive'),
		unassignProjectGroup: op('projects.unassignProjectGroup'),
		update: op('projects.update'),
	},
	purchases: {
		assignToProject: op('purchases.assignToProject'),
		bookkeepingExports: {
			create: op('purchases.bookkeepingExports.create'),
			get: op('purchases.bookkeepingExports.get'),
			list: op('purchases.bookkeepingExports.list'),
		},
		budgets: {
			create: op('purchases.budgets.create'),
			delete: op('purchases.budgets.delete'),
			list: op('purchases.budgets.list'),
			update: op('purchases.budgets.update'),
			updateTarget: op('purchases.budgets.updateTarget'),
		},
		categories: {
			get: op('purchases.categories.get'),
			list: op('purchases.categories.list'),
		},
		create: op('purchases.create'),
		delete: op('purchases.delete'),
		drafts: {
			create: op('purchases.drafts.create'),
			delete: op('purchases.drafts.delete'),
			get: op('purchases.drafts.get'),
			getPdf: op('purchases.drafts.getPdf'),
			list: op('purchases.drafts.list'),
		},
		get: op('purchases.get'),
		list: op('purchases.list'),
		payments: {
			bulkCreate: op('purchases.payments.bulkCreate'),
			create: op('purchases.payments.create'),
			delete: op('purchases.payments.delete'),
			get: op('purchases.payments.get'),
			list: op('purchases.payments.list'),
			update: op('purchases.payments.update'),
		},
		storeDocument: op('purchases.storeDocument'),
		update: op('purchases.update'),
		updateStatus: op('purchases.updateStatus'),
	},
	receipts: {
		create: op('receipts.create'),
		delete: op('receipts.delete'),
		get: op('receipts.get'),
		list: op('receipts.list'),
		update: op('receipts.update'),
	},
	recurringExpenses: {
		list: op('recurringExpenses.list'),
	},
	reports: {
		absences: op('reports.absences'),
		cashflow: op('reports.cashflow'),
		finance: op('reports.finance'),
		plannedVsTracked: op('reports.plannedVsTracked'),
		utilization: op('reports.utilization'),
	},
	revenueCategories: {
		create: op('revenueCategories.create'),
		delete: op('revenueCategories.delete'),
		get: op('revenueCategories.get'),
		list: op('revenueCategories.list'),
		update: op('revenueCategories.update'),
	},
	schedules: {
		create: op('schedules.create'),
		delete: op('schedules.delete'),
		get: op('schedules.get'),
		list: op('schedules.list'),
		update: op('schedules.update'),
	},
	session: {
		verify: op('session.verify'),
	},
	taggings: {
		add: op('taggings.add'),
		list: op('taggings.list'),
		remove: op('taggings.remove'),
		replace: op('taggings.replace'),
	},
	tags: {
		create: op('tags.create'),
		delete: op('tags.delete'),
		get: op('tags.get'),
		list: op('tags.list'),
		update: op('tags.update'),
	},
	todos: {
		get: op('todos.get'),
		list: op('todos.list'),
	},
	units: {
		create: op('units.create'),
		delete: op('units.delete'),
		get: op('units.get'),
		list: op('units.list'),
		update: op('units.update'),
	},
	users: {
		absenceRequests: {
			create: op('users.absenceRequests.create'),
			delete: op('users.absenceRequests.delete'),
			get: op('users.absenceRequests.get'),
			list: op('users.absenceRequests.list'),
		},
		create: op('users.create'),
		delete: op('users.delete'),
		employments: {
			create: op('users.employments.create'),
			delete: op('users.employments.delete'),
			get: op('users.employments.get'),
			list: op('users.employments.list'),
			update: op('users.employments.update'),
		},
		get: op('users.get'),
		holidays: {
			create: op('users.holidays.create'),
			delete: op('users.holidays.delete'),
			get: op('users.holidays.get'),
			list: op('users.holidays.list'),
			update: op('users.holidays.update'),
		},
		list: op('users.list'),
		performanceReport: op('users.performanceReport'),
		presences: {
			create: op('users.presences.create'),
			delete: op('users.presences.delete'),
			get: op('users.presences.get'),
			list: op('users.presences.list'),
			touch: op('users.presences.touch'),
			update: op('users.presences.update'),
		},
		roles: {
			list: op('users.roles.list'),
		},
		update: op('users.update'),
		workTimeAdjustments: {
			create: op('users.workTimeAdjustments.create'),
			delete: op('users.workTimeAdjustments.delete'),
			get: op('users.workTimeAdjustments.get'),
			list: op('users.workTimeAdjustments.list'),
			update: op('users.workTimeAdjustments.update'),
		},
	},
	vatCodePurchases: {
		get: op('vatCodePurchases.get'),
		list: op('vatCodePurchases.list'),
	},
	vatCodeSales: {
		get: op('vatCodeSales.get'),
		list: op('vatCodeSales.list'),
	},
} as const;

export const mocoEndpointSchemas = {
	'account.catalogServices.create': mocoSchemaEntry(
		'account.catalogServices.create',
	),
	'account.catalogServices.delete': mocoSchemaEntry(
		'account.catalogServices.delete',
	),
	'account.catalogServices.get': mocoSchemaEntry('account.catalogServices.get'),
	'account.catalogServices.items.create': mocoSchemaEntry(
		'account.catalogServices.items.create',
	),
	'account.catalogServices.items.delete': mocoSchemaEntry(
		'account.catalogServices.items.delete',
	),
	'account.catalogServices.items.get': mocoSchemaEntry(
		'account.catalogServices.items.get',
	),
	'account.catalogServices.items.update': mocoSchemaEntry(
		'account.catalogServices.items.update',
	),
	'account.catalogServices.list': mocoSchemaEntry(
		'account.catalogServices.list',
	),
	'account.catalogServices.update': mocoSchemaEntry(
		'account.catalogServices.update',
	),
	'account.customProperties.create': mocoSchemaEntry(
		'account.customProperties.create',
	),
	'account.customProperties.delete': mocoSchemaEntry(
		'account.customProperties.delete',
	),
	'account.customProperties.get': mocoSchemaEntry(
		'account.customProperties.get',
	),
	'account.customProperties.list': mocoSchemaEntry(
		'account.customProperties.list',
	),
	'account.customProperties.update': mocoSchemaEntry(
		'account.customProperties.update',
	),
	'account.expenseTemplates.create': mocoSchemaEntry(
		'account.expenseTemplates.create',
	),
	'account.expenseTemplates.delete': mocoSchemaEntry(
		'account.expenseTemplates.delete',
	),
	'account.expenseTemplates.get': mocoSchemaEntry(
		'account.expenseTemplates.get',
	),
	'account.expenseTemplates.list': mocoSchemaEntry(
		'account.expenseTemplates.list',
	),
	'account.expenseTemplates.update': mocoSchemaEntry(
		'account.expenseTemplates.update',
	),
	'account.fixedCosts.list': mocoSchemaEntry('account.fixedCosts.list'),
	'account.hourlyRates.get': mocoSchemaEntry('account.hourlyRates.get'),
	'account.internalHourlyRates.get': mocoSchemaEntry(
		'account.internalHourlyRates.get',
	),
	'account.internalHourlyRates.update': mocoSchemaEntry(
		'account.internalHourlyRates.update',
	),
	'account.taskTemplates.create': mocoSchemaEntry(
		'account.taskTemplates.create',
	),
	'account.taskTemplates.delete': mocoSchemaEntry(
		'account.taskTemplates.delete',
	),
	'account.taskTemplates.get': mocoSchemaEntry('account.taskTemplates.get'),
	'account.taskTemplates.list': mocoSchemaEntry('account.taskTemplates.list'),
	'account.taskTemplates.update': mocoSchemaEntry(
		'account.taskTemplates.update',
	),
	'account.webHooks.create': mocoSchemaEntry('account.webHooks.create'),
	'account.webHooks.delete': mocoSchemaEntry('account.webHooks.delete'),
	'account.webHooks.disable': mocoSchemaEntry('account.webHooks.disable'),
	'account.webHooks.enable': mocoSchemaEntry('account.webHooks.enable'),
	'account.webHooks.get': mocoSchemaEntry('account.webHooks.get'),
	'account.webHooks.list': mocoSchemaEntry('account.webHooks.list'),
	'account.webHooks.update': mocoSchemaEntry('account.webHooks.update'),
	'activities.bulkCreate': mocoSchemaEntry('activities.bulkCreate'),
	'activities.create': mocoSchemaEntry('activities.create'),
	'activities.delete': mocoSchemaEntry('activities.delete'),
	'activities.disregard': mocoSchemaEntry('activities.disregard'),
	'activities.get': mocoSchemaEntry('activities.get'),
	'activities.list': mocoSchemaEntry('activities.list'),
	'activities.startTimer': mocoSchemaEntry('activities.startTimer'),
	'activities.stopTimer': mocoSchemaEntry('activities.stopTimer'),
	'activities.update': mocoSchemaEntry('activities.update'),
	'activities.updateBillableSeconds': mocoSchemaEntry(
		'activities.updateBillableSeconds',
	),
	'approvals.approve': mocoSchemaEntry('approvals.approve'),
	'approvals.create': mocoSchemaEntry('approvals.create'),
	'approvals.delete': mocoSchemaEntry('approvals.delete'),
	'approvals.deny': mocoSchemaEntry('approvals.deny'),
	'approvals.get': mocoSchemaEntry('approvals.get'),
	'approvals.list': mocoSchemaEntry('approvals.list'),
	'comments.bulkCreate': mocoSchemaEntry('comments.bulkCreate'),
	'comments.create': mocoSchemaEntry('comments.create'),
	'comments.delete': mocoSchemaEntry('comments.delete'),
	'comments.get': mocoSchemaEntry('comments.get'),
	'comments.list': mocoSchemaEntry('comments.list'),
	'comments.update': mocoSchemaEntry('comments.update'),
	'companies.archive': mocoSchemaEntry('companies.archive'),
	'companies.create': mocoSchemaEntry('companies.create'),
	'companies.delete': mocoSchemaEntry('companies.delete'),
	'companies.get': mocoSchemaEntry('companies.get'),
	'companies.list': mocoSchemaEntry('companies.list'),
	'companies.unarchive': mocoSchemaEntry('companies.unarchive'),
	'companies.update': mocoSchemaEntry('companies.update'),
	'contacts.create': mocoSchemaEntry('contacts.create'),
	'contacts.delete': mocoSchemaEntry('contacts.delete'),
	'contacts.get': mocoSchemaEntry('contacts.get'),
	'contacts.list': mocoSchemaEntry('contacts.list'),
	'contacts.update': mocoSchemaEntry('contacts.update'),
	'dealCategories.create': mocoSchemaEntry('dealCategories.create'),
	'dealCategories.delete': mocoSchemaEntry('dealCategories.delete'),
	'dealCategories.get': mocoSchemaEntry('dealCategories.get'),
	'dealCategories.list': mocoSchemaEntry('dealCategories.list'),
	'dealCategories.update': mocoSchemaEntry('dealCategories.update'),
	'deals.create': mocoSchemaEntry('deals.create'),
	'deals.delete': mocoSchemaEntry('deals.delete'),
	'deals.get': mocoSchemaEntry('deals.get'),
	'deals.list': mocoSchemaEntry('deals.list'),
	'deals.update': mocoSchemaEntry('deals.update'),
	'invoiceReminders.create': mocoSchemaEntry('invoiceReminders.create'),
	'invoiceReminders.delete': mocoSchemaEntry('invoiceReminders.delete'),
	'invoiceReminders.get': mocoSchemaEntry('invoiceReminders.get'),
	'invoiceReminders.list': mocoSchemaEntry('invoiceReminders.list'),
	'invoiceReminders.sendEmail': mocoSchemaEntry('invoiceReminders.sendEmail'),
	'invoices.attachments.create': mocoSchemaEntry('invoices.attachments.create'),
	'invoices.attachments.delete': mocoSchemaEntry('invoices.attachments.delete'),
	'invoices.attachments.list': mocoSchemaEntry('invoices.attachments.list'),
	'invoices.bookkeepingExports.create': mocoSchemaEntry(
		'invoices.bookkeepingExports.create',
	),
	'invoices.bookkeepingExports.get': mocoSchemaEntry(
		'invoices.bookkeepingExports.get',
	),
	'invoices.bookkeepingExports.list': mocoSchemaEntry(
		'invoices.bookkeepingExports.list',
	),
	'invoices.create': mocoSchemaEntry('invoices.create'),
	'invoices.delete': mocoSchemaEntry('invoices.delete'),
	'invoices.get': mocoSchemaEntry('invoices.get'),
	'invoices.getPdf': mocoSchemaEntry('invoices.getPdf'),
	'invoices.getTimesheet': mocoSchemaEntry('invoices.getTimesheet'),
	'invoices.getTimesheetPdf': mocoSchemaEntry('invoices.getTimesheetPdf'),
	'invoices.list': mocoSchemaEntry('invoices.list'),
	'invoices.listExpenses': mocoSchemaEntry('invoices.listExpenses'),
	'invoices.listLocked': mocoSchemaEntry('invoices.listLocked'),
	'invoices.payments.bulkCreate': mocoSchemaEntry(
		'invoices.payments.bulkCreate',
	),
	'invoices.payments.create': mocoSchemaEntry('invoices.payments.create'),
	'invoices.payments.delete': mocoSchemaEntry('invoices.payments.delete'),
	'invoices.payments.get': mocoSchemaEntry('invoices.payments.get'),
	'invoices.payments.list': mocoSchemaEntry('invoices.payments.list'),
	'invoices.payments.update': mocoSchemaEntry('invoices.payments.update'),
	'invoices.sendEmail': mocoSchemaEntry('invoices.sendEmail'),
	'invoices.updateStatus': mocoSchemaEntry('invoices.updateStatus'),
	'letterPapers.list': mocoSchemaEntry('letterPapers.list'),
	'offerConfirmations.create': mocoSchemaEntry('offerConfirmations.create'),
	'offerConfirmations.delete': mocoSchemaEntry('offerConfirmations.delete'),
	'offerConfirmations.get': mocoSchemaEntry('offerConfirmations.get'),
	'offerConfirmations.getPdf': mocoSchemaEntry('offerConfirmations.getPdf'),
	'offerConfirmations.list': mocoSchemaEntry('offerConfirmations.list'),
	'offerConfirmations.update': mocoSchemaEntry('offerConfirmations.update'),
	'offers.assign': mocoSchemaEntry('offers.assign'),
	'offers.attachments.create': mocoSchemaEntry('offers.attachments.create'),
	'offers.attachments.delete': mocoSchemaEntry('offers.attachments.delete'),
	'offers.attachments.list': mocoSchemaEntry('offers.attachments.list'),
	'offers.create': mocoSchemaEntry('offers.create'),
	'offers.customerApproval.activate': mocoSchemaEntry(
		'offers.customerApproval.activate',
	),
	'offers.customerApproval.deactivate': mocoSchemaEntry(
		'offers.customerApproval.deactivate',
	),
	'offers.customerApproval.get': mocoSchemaEntry('offers.customerApproval.get'),
	'offers.delete': mocoSchemaEntry('offers.delete'),
	'offers.get': mocoSchemaEntry('offers.get'),
	'offers.getPdf': mocoSchemaEntry('offers.getPdf'),
	'offers.list': mocoSchemaEntry('offers.list'),
	'offers.sendEmail': mocoSchemaEntry('offers.sendEmail'),
	'offers.update': mocoSchemaEntry('offers.update'),
	'offers.updateStatus': mocoSchemaEntry('offers.updateStatus'),
	'plannedPurchases.create': mocoSchemaEntry('plannedPurchases.create'),
	'plannedPurchases.delete': mocoSchemaEntry('plannedPurchases.delete'),
	'plannedPurchases.get': mocoSchemaEntry('plannedPurchases.get'),
	'plannedPurchases.list': mocoSchemaEntry('plannedPurchases.list'),
	'plannedPurchases.update': mocoSchemaEntry('plannedPurchases.update'),
	'planningEntries.create': mocoSchemaEntry('planningEntries.create'),
	'planningEntries.delete': mocoSchemaEntry('planningEntries.delete'),
	'planningEntries.get': mocoSchemaEntry('planningEntries.get'),
	'planningEntries.list': mocoSchemaEntry('planningEntries.list'),
	'planningEntries.update': mocoSchemaEntry('planningEntries.update'),
	'profile.get': mocoSchemaEntry('profile.get'),
	'profile.performanceReport': mocoSchemaEntry('profile.performanceReport'),
	'projects.archive': mocoSchemaEntry('projects.archive'),
	'projects.assignProjectGroup': mocoSchemaEntry('projects.assignProjectGroup'),
	'projects.contracts.create': mocoSchemaEntry('projects.contracts.create'),
	'projects.contracts.delete': mocoSchemaEntry('projects.contracts.delete'),
	'projects.contracts.get': mocoSchemaEntry('projects.contracts.get'),
	'projects.contracts.list': mocoSchemaEntry('projects.contracts.list'),
	'projects.contracts.update': mocoSchemaEntry('projects.contracts.update'),
	'projects.create': mocoSchemaEntry('projects.create'),
	'projects.delete': mocoSchemaEntry('projects.delete'),
	'projects.disableShare': mocoSchemaEntry('projects.disableShare'),
	'projects.expenses.bulkCreate': mocoSchemaEntry(
		'projects.expenses.bulkCreate',
	),
	'projects.expenses.create': mocoSchemaEntry('projects.expenses.create'),
	'projects.expenses.delete': mocoSchemaEntry('projects.expenses.delete'),
	'projects.expenses.disregard': mocoSchemaEntry('projects.expenses.disregard'),
	'projects.expenses.get': mocoSchemaEntry('projects.expenses.get'),
	'projects.expenses.list': mocoSchemaEntry('projects.expenses.list'),
	'projects.expenses.listAll': mocoSchemaEntry('projects.expenses.listAll'),
	'projects.expenses.update': mocoSchemaEntry('projects.expenses.update'),
	'projects.get': mocoSchemaEntry('projects.get'),
	'projects.groups.get': mocoSchemaEntry('projects.groups.get'),
	'projects.groups.list': mocoSchemaEntry('projects.groups.list'),
	'projects.list': mocoSchemaEntry('projects.list'),
	'projects.listAssigned': mocoSchemaEntry('projects.listAssigned'),
	'projects.paymentSchedules.create': mocoSchemaEntry(
		'projects.paymentSchedules.create',
	),
	'projects.paymentSchedules.delete': mocoSchemaEntry(
		'projects.paymentSchedules.delete',
	),
	'projects.paymentSchedules.get': mocoSchemaEntry(
		'projects.paymentSchedules.get',
	),
	'projects.paymentSchedules.list': mocoSchemaEntry(
		'projects.paymentSchedules.list',
	),
	'projects.paymentSchedules.listAll': mocoSchemaEntry(
		'projects.paymentSchedules.listAll',
	),
	'projects.paymentSchedules.update': mocoSchemaEntry(
		'projects.paymentSchedules.update',
	),
	'projects.recurringExpenses.create': mocoSchemaEntry(
		'projects.recurringExpenses.create',
	),
	'projects.recurringExpenses.delete': mocoSchemaEntry(
		'projects.recurringExpenses.delete',
	),
	'projects.recurringExpenses.get': mocoSchemaEntry(
		'projects.recurringExpenses.get',
	),
	'projects.recurringExpenses.list': mocoSchemaEntry(
		'projects.recurringExpenses.list',
	),
	'projects.recurringExpenses.recur': mocoSchemaEntry(
		'projects.recurringExpenses.recur',
	),
	'projects.recurringExpenses.update': mocoSchemaEntry(
		'projects.recurringExpenses.update',
	),
	'projects.report': mocoSchemaEntry('projects.report'),
	'projects.share': mocoSchemaEntry('projects.share'),
	'projects.tasks.create': mocoSchemaEntry('projects.tasks.create'),
	'projects.tasks.delete': mocoSchemaEntry('projects.tasks.delete'),
	'projects.tasks.deleteAll': mocoSchemaEntry('projects.tasks.deleteAll'),
	'projects.tasks.get': mocoSchemaEntry('projects.tasks.get'),
	'projects.tasks.list': mocoSchemaEntry('projects.tasks.list'),
	'projects.tasks.update': mocoSchemaEntry('projects.tasks.update'),
	'projects.unarchive': mocoSchemaEntry('projects.unarchive'),
	'projects.unassignProjectGroup': mocoSchemaEntry(
		'projects.unassignProjectGroup',
	),
	'projects.update': mocoSchemaEntry('projects.update'),
	'purchases.assignToProject': mocoSchemaEntry('purchases.assignToProject'),
	'purchases.bookkeepingExports.create': mocoSchemaEntry(
		'purchases.bookkeepingExports.create',
	),
	'purchases.bookkeepingExports.get': mocoSchemaEntry(
		'purchases.bookkeepingExports.get',
	),
	'purchases.bookkeepingExports.list': mocoSchemaEntry(
		'purchases.bookkeepingExports.list',
	),
	'purchases.budgets.create': mocoSchemaEntry('purchases.budgets.create'),
	'purchases.budgets.delete': mocoSchemaEntry('purchases.budgets.delete'),
	'purchases.budgets.list': mocoSchemaEntry('purchases.budgets.list'),
	'purchases.budgets.update': mocoSchemaEntry('purchases.budgets.update'),
	'purchases.budgets.updateTarget': mocoSchemaEntry(
		'purchases.budgets.updateTarget',
	),
	'purchases.categories.get': mocoSchemaEntry('purchases.categories.get'),
	'purchases.categories.list': mocoSchemaEntry('purchases.categories.list'),
	'purchases.create': mocoSchemaEntry('purchases.create'),
	'purchases.delete': mocoSchemaEntry('purchases.delete'),
	'purchases.drafts.create': mocoSchemaEntry('purchases.drafts.create'),
	'purchases.drafts.delete': mocoSchemaEntry('purchases.drafts.delete'),
	'purchases.drafts.get': mocoSchemaEntry('purchases.drafts.get'),
	'purchases.drafts.getPdf': mocoSchemaEntry('purchases.drafts.getPdf'),
	'purchases.drafts.list': mocoSchemaEntry('purchases.drafts.list'),
	'purchases.get': mocoSchemaEntry('purchases.get'),
	'purchases.list': mocoSchemaEntry('purchases.list'),
	'purchases.payments.bulkCreate': mocoSchemaEntry(
		'purchases.payments.bulkCreate',
	),
	'purchases.payments.create': mocoSchemaEntry('purchases.payments.create'),
	'purchases.payments.delete': mocoSchemaEntry('purchases.payments.delete'),
	'purchases.payments.get': mocoSchemaEntry('purchases.payments.get'),
	'purchases.payments.list': mocoSchemaEntry('purchases.payments.list'),
	'purchases.payments.update': mocoSchemaEntry('purchases.payments.update'),
	'purchases.storeDocument': mocoSchemaEntry('purchases.storeDocument'),
	'purchases.update': mocoSchemaEntry('purchases.update'),
	'purchases.updateStatus': mocoSchemaEntry('purchases.updateStatus'),
	'receipts.create': mocoSchemaEntry('receipts.create'),
	'receipts.delete': mocoSchemaEntry('receipts.delete'),
	'receipts.get': mocoSchemaEntry('receipts.get'),
	'receipts.list': mocoSchemaEntry('receipts.list'),
	'receipts.update': mocoSchemaEntry('receipts.update'),
	'recurringExpenses.list': mocoSchemaEntry('recurringExpenses.list'),
	'reports.absences': mocoSchemaEntry('reports.absences'),
	'reports.cashflow': mocoSchemaEntry('reports.cashflow'),
	'reports.finance': mocoSchemaEntry('reports.finance'),
	'reports.plannedVsTracked': mocoSchemaEntry('reports.plannedVsTracked'),
	'reports.utilization': mocoSchemaEntry('reports.utilization'),
	'revenueCategories.create': mocoSchemaEntry('revenueCategories.create'),
	'revenueCategories.delete': mocoSchemaEntry('revenueCategories.delete'),
	'revenueCategories.get': mocoSchemaEntry('revenueCategories.get'),
	'revenueCategories.list': mocoSchemaEntry('revenueCategories.list'),
	'revenueCategories.update': mocoSchemaEntry('revenueCategories.update'),
	'schedules.create': mocoSchemaEntry('schedules.create'),
	'schedules.delete': mocoSchemaEntry('schedules.delete'),
	'schedules.get': mocoSchemaEntry('schedules.get'),
	'schedules.list': mocoSchemaEntry('schedules.list'),
	'schedules.update': mocoSchemaEntry('schedules.update'),
	'session.verify': mocoSchemaEntry('session.verify'),
	'taggings.add': mocoSchemaEntry('taggings.add'),
	'taggings.list': mocoSchemaEntry('taggings.list'),
	'taggings.remove': mocoSchemaEntry('taggings.remove'),
	'taggings.replace': mocoSchemaEntry('taggings.replace'),
	'tags.create': mocoSchemaEntry('tags.create'),
	'tags.delete': mocoSchemaEntry('tags.delete'),
	'tags.get': mocoSchemaEntry('tags.get'),
	'tags.list': mocoSchemaEntry('tags.list'),
	'tags.update': mocoSchemaEntry('tags.update'),
	'todos.get': mocoSchemaEntry('todos.get'),
	'todos.list': mocoSchemaEntry('todos.list'),
	'units.create': mocoSchemaEntry('units.create'),
	'units.delete': mocoSchemaEntry('units.delete'),
	'units.get': mocoSchemaEntry('units.get'),
	'units.list': mocoSchemaEntry('units.list'),
	'units.update': mocoSchemaEntry('units.update'),
	'users.absenceRequests.create': mocoSchemaEntry(
		'users.absenceRequests.create',
	),
	'users.absenceRequests.delete': mocoSchemaEntry(
		'users.absenceRequests.delete',
	),
	'users.absenceRequests.get': mocoSchemaEntry('users.absenceRequests.get'),
	'users.absenceRequests.list': mocoSchemaEntry('users.absenceRequests.list'),
	'users.create': mocoSchemaEntry('users.create'),
	'users.delete': mocoSchemaEntry('users.delete'),
	'users.employments.create': mocoSchemaEntry('users.employments.create'),
	'users.employments.delete': mocoSchemaEntry('users.employments.delete'),
	'users.employments.get': mocoSchemaEntry('users.employments.get'),
	'users.employments.list': mocoSchemaEntry('users.employments.list'),
	'users.employments.update': mocoSchemaEntry('users.employments.update'),
	'users.get': mocoSchemaEntry('users.get'),
	'users.holidays.create': mocoSchemaEntry('users.holidays.create'),
	'users.holidays.delete': mocoSchemaEntry('users.holidays.delete'),
	'users.holidays.get': mocoSchemaEntry('users.holidays.get'),
	'users.holidays.list': mocoSchemaEntry('users.holidays.list'),
	'users.holidays.update': mocoSchemaEntry('users.holidays.update'),
	'users.list': mocoSchemaEntry('users.list'),
	'users.performanceReport': mocoSchemaEntry('users.performanceReport'),
	'users.presences.create': mocoSchemaEntry('users.presences.create'),
	'users.presences.delete': mocoSchemaEntry('users.presences.delete'),
	'users.presences.get': mocoSchemaEntry('users.presences.get'),
	'users.presences.list': mocoSchemaEntry('users.presences.list'),
	'users.presences.touch': mocoSchemaEntry('users.presences.touch'),
	'users.presences.update': mocoSchemaEntry('users.presences.update'),
	'users.roles.list': mocoSchemaEntry('users.roles.list'),
	'users.update': mocoSchemaEntry('users.update'),
	'users.workTimeAdjustments.create': mocoSchemaEntry(
		'users.workTimeAdjustments.create',
	),
	'users.workTimeAdjustments.delete': mocoSchemaEntry(
		'users.workTimeAdjustments.delete',
	),
	'users.workTimeAdjustments.get': mocoSchemaEntry(
		'users.workTimeAdjustments.get',
	),
	'users.workTimeAdjustments.list': mocoSchemaEntry(
		'users.workTimeAdjustments.list',
	),
	'users.workTimeAdjustments.update': mocoSchemaEntry(
		'users.workTimeAdjustments.update',
	),
	'vatCodePurchases.get': mocoSchemaEntry('vatCodePurchases.get'),
	'vatCodePurchases.list': mocoSchemaEntry('vatCodePurchases.list'),
	'vatCodeSales.get': mocoSchemaEntry('vatCodeSales.get'),
	'vatCodeSales.list': mocoSchemaEntry('vatCodeSales.list'),
} satisfies RequiredPluginEndpointSchemas<typeof mocoEndpointsNested>;

export const mocoEndpointMeta = {
	'account.catalogServices.create': {
		riskLevel: 'write',
		description: 'Create account catalog service',
	},
	'account.catalogServices.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete account catalog service',
	},
	'account.catalogServices.get': {
		riskLevel: 'read',
		description: 'Get account catalog service',
	},
	'account.catalogServices.items.create': {
		riskLevel: 'write',
		description: 'Create account catalog service item',
	},
	'account.catalogServices.items.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete account catalog service item',
	},
	'account.catalogServices.items.get': {
		riskLevel: 'read',
		description: 'Get account catalog service item',
	},
	'account.catalogServices.items.update': {
		riskLevel: 'write',
		description: 'Update account catalog service item',
	},
	'account.catalogServices.list': {
		riskLevel: 'read',
		description: 'List account catalog services, one page at a time',
	},
	'account.catalogServices.update': {
		riskLevel: 'write',
		description: 'Update account catalog service',
	},
	'account.customProperties.create': {
		riskLevel: 'write',
		description: 'Create account custom property',
	},
	'account.customProperties.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete account custom property',
	},
	'account.customProperties.get': {
		riskLevel: 'read',
		description: 'Get account custom property',
	},
	'account.customProperties.list': {
		riskLevel: 'read',
		description:
			'List account custom properties: lists custom property definitions; can be filtered by `entity`, one page at a time',
	},
	'account.customProperties.update': {
		riskLevel: 'write',
		description: 'Update account custom property',
	},
	'account.expenseTemplates.create': {
		riskLevel: 'write',
		description: 'Create account expense template',
	},
	'account.expenseTemplates.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete account expense template',
	},
	'account.expenseTemplates.get': {
		riskLevel: 'read',
		description: 'Get account expense template',
	},
	'account.expenseTemplates.list': {
		riskLevel: 'read',
		description: 'List account expense templates, one page at a time',
	},
	'account.expenseTemplates.update': {
		riskLevel: 'write',
		description: 'Update account expense template',
	},
	'account.fixedCosts.list': {
		riskLevel: 'read',
		description: 'List account fixed costs, one page at a time',
	},
	'account.hourlyRates.get': {
		riskLevel: 'read',
		description: 'List account hourly rates',
	},
	'account.internalHourlyRates.get': {
		riskLevel: 'read',
		description: 'Get account internal hourly rates',
	},
	'account.internalHourlyRates.update': {
		riskLevel: 'write',
		description:
			'Update account internal hourly rates: upserts internal hourly rates for the provided year and users',
	},
	'account.taskTemplates.create': {
		riskLevel: 'write',
		description: 'Create account task template',
	},
	'account.taskTemplates.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete account task template',
	},
	'account.taskTemplates.get': {
		riskLevel: 'read',
		description: 'Get account task template',
	},
	'account.taskTemplates.list': {
		riskLevel: 'read',
		description: 'List account task templates, one page at a time',
	},
	'account.taskTemplates.update': {
		riskLevel: 'write',
		description: 'Update account task template',
	},
	'account.webHooks.create': {
		riskLevel: 'write',
		description: 'Create account web hook',
	},
	'account.webHooks.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete account web hook',
	},
	'account.webHooks.disable': {
		riskLevel: 'write',
		description: 'Disable account web hook',
	},
	'account.webHooks.enable': {
		riskLevel: 'write',
		description: 'Enable account web hook',
	},
	'account.webHooks.get': {
		riskLevel: 'read',
		description: 'Get account web hook',
	},
	'account.webHooks.list': {
		riskLevel: 'read',
		description: 'List account web hooks, one page at a time',
	},
	'account.webHooks.update': {
		riskLevel: 'write',
		description: 'Update account web hook: only `hook` can be changed',
	},
	'activities.bulkCreate': {
		riskLevel: 'write',
		description: 'Create activities in bulk',
	},
	'activities.create': {
		riskLevel: 'write',
		description:
			'Create a time entry on a project task for the authenticated user, in hours or seconds',
	},
	'activities.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a time entry; billed entries cannot be deleted this way',
	},
	'activities.disregard': {
		riskLevel: 'write',
		description:
			'Disregard activities for invoicing: marks selected activities as disregarded for billing calculations',
	},
	'activities.get': {
		riskLevel: 'read',
		description: 'Read one time entry',
	},
	'activities.list': {
		riskLevel: 'read',
		description:
			'List time entries with date, user, project, task, billable and billed filters, one page at a time',
	},
	'activities.startTimer': {
		riskLevel: 'write',
		description:
			'Start activity timer: starts the timer for an existing activity',
	},
	'activities.stopTimer': {
		riskLevel: 'write',
		description:
			'Stop activity timer: stops a running timer and writes tracked duration back to the activity',
	},
	'activities.update': {
		riskLevel: 'write',
		description: 'Update a time entry',
	},
	'activities.updateBillableSeconds': {
		riskLevel: 'write',
		description: 'Update activity billable seconds',
	},
	'approvals.approve': {
		riskLevel: 'write',
		description: 'Approve approval: approves a pending approval',
	},
	'approvals.create': {
		riskLevel: 'write',
		description: 'Create approval',
	},
	'approvals.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete approval',
	},
	'approvals.deny': {
		riskLevel: 'write',
		description: 'Deny approval: denies a pending approval',
	},
	'approvals.get': {
		riskLevel: 'read',
		description: 'Get approval',
	},
	'approvals.list': {
		riskLevel: 'read',
		description: 'List approvals, one page at a time',
	},
	'comments.bulkCreate': {
		riskLevel: 'write',
		description: 'Create comments in bulk',
	},
	'comments.create': {
		riskLevel: 'write',
		description: 'Create comment',
	},
	'comments.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete comment',
	},
	'comments.get': {
		riskLevel: 'read',
		description: 'Get comment',
	},
	'comments.list': {
		riskLevel: 'read',
		description: 'List comments, one page at a time',
	},
	'comments.update': {
		riskLevel: 'write',
		description: 'Update comment',
	},
	'companies.archive': {
		riskLevel: 'write',
		description: 'Archive a company; unarchive reverses it',
	},
	'companies.create': {
		riskLevel: 'write',
		description: 'Create a client, supplier or organization',
	},
	'companies.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete company',
	},
	'companies.get': {
		riskLevel: 'read',
		description: 'Read one company',
	},
	'companies.list': {
		riskLevel: 'read',
		description:
			'List clients, suppliers and organizations, one page at a time',
	},
	'companies.unarchive': {
		riskLevel: 'write',
		description: 'Unarchive a company',
	},
	'companies.update': {
		riskLevel: 'write',
		description: 'Update a company',
	},
	'contacts.create': {
		riskLevel: 'write',
		description: 'Create a contact person for a company',
	},
	'contacts.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a contact person',
	},
	'contacts.get': {
		riskLevel: 'read',
		description: 'Read one contact person',
	},
	'contacts.list': {
		riskLevel: 'read',
		description: 'List contact persons, one page at a time',
	},
	'contacts.update': {
		riskLevel: 'write',
		description: 'Update a contact person',
	},
	'dealCategories.create': {
		riskLevel: 'write',
		description: 'Create deal category',
	},
	'dealCategories.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete deal category',
	},
	'dealCategories.get': {
		riskLevel: 'read',
		description: 'Get deal category',
	},
	'dealCategories.list': {
		riskLevel: 'read',
		description: 'List deal categories, one page at a time',
	},
	'dealCategories.update': {
		riskLevel: 'write',
		description: 'Update deal category',
	},
	'deals.create': {
		riskLevel: 'write',
		description: 'Create a deal in a deal category',
	},
	'deals.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a deal',
	},
	'deals.get': {
		riskLevel: 'read',
		description: 'Read one deal',
	},
	'deals.list': {
		riskLevel: 'read',
		description:
			'List deals with status, close date, company and contact filters, one page at a time',
	},
	'deals.update': {
		riskLevel: 'write',
		description: 'Update a deal, including its status',
	},
	'invoiceReminders.create': {
		riskLevel: 'write',
		description: 'Create invoice reminder',
	},
	'invoiceReminders.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete invoice reminder',
	},
	'invoiceReminders.get': {
		riskLevel: 'read',
		description: 'Get invoice reminder',
	},
	'invoiceReminders.list': {
		riskLevel: 'read',
		description: 'List invoice reminders, one page at a time',
	},
	'invoiceReminders.sendEmail': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Email a payment reminder to the recipients given (sends real email from MOCO)',
	},
	'invoices.attachments.create': {
		riskLevel: 'write',
		description:
			'Create invoice attachment: uploads a file as invoice attachment using base64-encoded content',
	},
	'invoices.attachments.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete invoice attachment',
	},
	'invoices.attachments.list': {
		riskLevel: 'read',
		description: 'List invoice attachments',
	},
	'invoices.bookkeepingExports.create': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Create invoice bookkeeping export',
	},
	'invoices.bookkeepingExports.get': {
		riskLevel: 'read',
		description: 'Get invoice bookkeeping export',
	},
	'invoices.bookkeepingExports.list': {
		riskLevel: 'read',
		description: 'List invoice bookkeeping exports, one page at a time',
	},
	'invoices.create': {
		riskLevel: 'write',
		description: 'Create invoice',
	},
	'invoices.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete invoice',
	},
	'invoices.get': {
		riskLevel: 'read',
		description: 'Read one invoice with its line items, payments and reminders',
	},
	'invoices.getPdf': {
		riskLevel: 'read',
		description: 'Download invoice PDF (a PDF, saved to Files)',
	},
	'invoices.getTimesheet': {
		riskLevel: 'read',
		description: 'Get invoice timesheet entries',
	},
	'invoices.getTimesheetPdf': {
		riskLevel: 'read',
		description: 'Download invoice timesheet PDF (a PDF, saved to Files)',
	},
	'invoices.list': {
		riskLevel: 'read',
		description:
			'List invoices with status, date, client and project filters, one page at a time',
	},
	'invoices.listExpenses': {
		riskLevel: 'read',
		description: 'List invoice expenses',
	},
	'invoices.listLocked': {
		riskLevel: 'read',
		description: 'List locked invoices, one page at a time',
	},
	'invoices.payments.bulkCreate': {
		riskLevel: 'write',
		description:
			'Create invoice payments in bulk: requires `application/json` request body with `bulk_data` list',
	},
	'invoices.payments.create': {
		riskLevel: 'write',
		description: 'Create invoice payment',
	},
	'invoices.payments.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete invoice payment',
	},
	'invoices.payments.get': {
		riskLevel: 'read',
		description: 'Get invoice payment',
	},
	'invoices.payments.list': {
		riskLevel: 'read',
		description: 'List invoice payments, one page at a time',
	},
	'invoices.payments.update': {
		riskLevel: 'write',
		description: 'Update invoice payment',
	},
	'invoices.sendEmail': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Email an invoice to the recipients given (sends real email from MOCO)',
	},
	'invoices.updateStatus': {
		riskLevel: 'write',
		description:
			'Move an invoice to created, sent, overdue or ignored; locked invoices refuse the change',
	},
	'letterPapers.list': {
		riskLevel: 'read',
		description: 'List letter papers',
	},
	'offerConfirmations.create': {
		riskLevel: 'write',
		description: 'Create offer confirmation',
	},
	'offerConfirmations.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete offer confirmation',
	},
	'offerConfirmations.get': {
		riskLevel: 'read',
		description: 'Get offer confirmation',
	},
	'offerConfirmations.getPdf': {
		riskLevel: 'read',
		description: 'Download offer confirmation PDF (a PDF, saved to Files)',
	},
	'offerConfirmations.list': {
		riskLevel: 'read',
		description: 'List offer confirmations, one page at a time',
	},
	'offerConfirmations.update': {
		riskLevel: 'write',
		description: 'Update offer confirmation',
	},
	'offers.assign': {
		riskLevel: 'write',
		description:
			'Assign offer to company/project/deal: if `project_id` is set, project company overrides `company_id`',
	},
	'offers.attachments.create': {
		riskLevel: 'write',
		description: 'Create offer attachment',
	},
	'offers.attachments.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete offer attachment',
	},
	'offers.attachments.list': {
		riskLevel: 'read',
		description: 'List offer attachments',
	},
	'offers.create': {
		riskLevel: 'write',
		description: 'Create offer',
	},
	'offers.customerApproval.activate': {
		riskLevel: 'write',
		description: 'Activate customer approval',
	},
	'offers.customerApproval.deactivate': {
		riskLevel: 'write',
		description: 'Deactivate customer approval',
	},
	'offers.customerApproval.get': {
		riskLevel: 'read',
		description: 'Get customer approval state',
	},
	'offers.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete offer',
	},
	'offers.get': {
		riskLevel: 'read',
		description: 'Get offer',
	},
	'offers.getPdf': {
		riskLevel: 'read',
		description: 'Download offer PDF (a PDF, saved to Files)',
	},
	'offers.list': {
		riskLevel: 'read',
		description: 'List offers, one page at a time',
	},
	'offers.sendEmail': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Email an offer to the recipients given (sends real email from MOCO)',
	},
	'offers.update': {
		riskLevel: 'write',
		description: 'Update offer',
	},
	'offers.updateStatus': {
		riskLevel: 'write',
		description:
			'Update offer status: transitions the offer state; successful updates return no body',
	},
	'plannedPurchases.create': {
		riskLevel: 'write',
		description: 'Create planned purchase: create a new planned purchase',
	},
	'plannedPurchases.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete planned purchase',
	},
	'plannedPurchases.get': {
		riskLevel: 'read',
		description: 'Get planned purchase',
	},
	'plannedPurchases.list': {
		riskLevel: 'read',
		description: 'List planned purchases, one page at a time',
	},
	'plannedPurchases.update': {
		riskLevel: 'write',
		description: 'Update planned purchase: update an existing planned purchase',
	},
	'planningEntries.create': {
		riskLevel: 'write',
		description: 'Create planning entry',
	},
	'planningEntries.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete planning entry',
	},
	'planningEntries.get': {
		riskLevel: 'read',
		description: 'Get planning entry',
	},
	'planningEntries.list': {
		riskLevel: 'read',
		description: 'List planning entries, one page at a time',
	},
	'planningEntries.update': {
		riskLevel: 'write',
		description: 'Update planning entry',
	},
	'profile.get': {
		riskLevel: 'read',
		description: 'Read the profile of the authenticated user',
	},
	'profile.performanceReport': {
		riskLevel: 'read',
		description: "Get current user's performance report",
	},
	'projects.archive': {
		riskLevel: 'write',
		description: 'Archive a project; unarchive reverses it',
	},
	'projects.assignProjectGroup': {
		riskLevel: 'write',
		description:
			'Assign project to project group: assigns a project to a project group',
	},
	'projects.contracts.create': {
		riskLevel: 'write',
		description: 'Create project contract',
	},
	'projects.contracts.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete project contract',
	},
	'projects.contracts.get': {
		riskLevel: 'read',
		description: 'Get project contract',
	},
	'projects.contracts.list': {
		riskLevel: 'read',
		description: 'List project contracts, one page at a time',
	},
	'projects.contracts.update': {
		riskLevel: 'write',
		description: 'Update project contract',
	},
	'projects.create': {
		riskLevel: 'write',
		description: 'Create a project for a client',
	},
	'projects.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete project',
	},
	'projects.disableShare': {
		riskLevel: 'write',
		description:
			'Disable project report sharing: disables public customer report sharing for the selected project',
	},
	'projects.expenses.bulkCreate': {
		riskLevel: 'write',
		description: 'Create project expenses in bulk',
	},
	'projects.expenses.create': {
		riskLevel: 'write',
		description: 'Create project expense',
	},
	'projects.expenses.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete project expense',
	},
	'projects.expenses.disregard': {
		riskLevel: 'write',
		description:
			'Disregard project expenses: marks selected expenses as disregarded for billing calculations',
	},
	'projects.expenses.get': {
		riskLevel: 'read',
		description: 'Get project expense',
	},
	'projects.expenses.list': {
		riskLevel: 'read',
		description: 'List project expenses, one page at a time',
	},
	'projects.expenses.listAll': {
		riskLevel: 'read',
		description: 'List expenses across projects, one page at a time',
	},
	'projects.expenses.update': {
		riskLevel: 'write',
		description: 'Update project expense',
	},
	'projects.get': {
		riskLevel: 'read',
		description: 'Read one project, optionally embedding the client',
	},
	'projects.groups.get': {
		riskLevel: 'read',
		description: 'Get project group',
	},
	'projects.groups.list': {
		riskLevel: 'read',
		description: 'List project groups, one page at a time',
	},
	'projects.list': {
		riskLevel: 'read',
		description:
			'List projects with company, leader, tag, date and archive filters, one page at a time',
	},
	'projects.listAssigned': {
		riskLevel: 'read',
		description: 'List projects assigned to current user',
	},
	'projects.paymentSchedules.create': {
		riskLevel: 'write',
		description: 'Create project payment schedule',
	},
	'projects.paymentSchedules.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete project payment schedule',
	},
	'projects.paymentSchedules.get': {
		riskLevel: 'read',
		description: 'Get project payment schedule',
	},
	'projects.paymentSchedules.list': {
		riskLevel: 'read',
		description: 'List project payment schedules, one page at a time',
	},
	'projects.paymentSchedules.listAll': {
		riskLevel: 'read',
		description:
			'List project payment schedules (all projects), one page at a time',
	},
	'projects.paymentSchedules.update': {
		riskLevel: 'write',
		description: 'Update project payment schedule',
	},
	'projects.recurringExpenses.create': {
		riskLevel: 'write',
		description: 'Create project recurring expense',
	},
	'projects.recurringExpenses.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete project recurring expense',
	},
	'projects.recurringExpenses.get': {
		riskLevel: 'read',
		description: 'Get project recurring expense',
	},
	'projects.recurringExpenses.list': {
		riskLevel: 'read',
		description: 'List project recurring expenses, one page at a time',
	},
	'projects.recurringExpenses.recur': {
		riskLevel: 'write',
		description: 'Recur project recurring expense',
	},
	'projects.recurringExpenses.update': {
		riskLevel: 'write',
		description: 'Update project recurring expense',
	},
	'projects.report': {
		riskLevel: 'read',
		description:
			'Read a project business report: budget, invoiced totals, hours and costs',
	},
	'projects.share': {
		riskLevel: 'write',
		description:
			'Enable project report sharing: enables public customer report sharing for the selected project',
	},
	'projects.tasks.create': {
		riskLevel: 'write',
		description: 'Create project task',
	},
	'projects.tasks.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete project task',
	},
	'projects.tasks.deleteAll': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete all project tasks',
	},
	'projects.tasks.get': {
		riskLevel: 'read',
		description: 'Get project task',
	},
	'projects.tasks.list': {
		riskLevel: 'read',
		description: 'List project tasks, one page at a time',
	},
	'projects.tasks.update': {
		riskLevel: 'write',
		description: 'Update project task',
	},
	'projects.unarchive': {
		riskLevel: 'write',
		description: 'Unarchive a project',
	},
	'projects.unassignProjectGroup': {
		riskLevel: 'write',
		description:
			'Unassign project from project group: removes the project-group assignment from a project',
	},
	'projects.update': {
		riskLevel: 'write',
		description: 'Update a project',
	},
	'purchases.assignToProject': {
		riskLevel: 'write',
		description:
			'Assign purchase item to project: assigns one purchase item to a project expense',
	},
	'purchases.bookkeepingExports.create': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Create purchase bookkeeping export',
	},
	'purchases.bookkeepingExports.get': {
		riskLevel: 'read',
		description: 'Get purchase bookkeeping export',
	},
	'purchases.bookkeepingExports.list': {
		riskLevel: 'read',
		description: 'List purchase bookkeeping exports, one page at a time',
	},
	'purchases.budgets.create': {
		riskLevel: 'write',
		description: 'Create purchase budget: create a new purchase budget',
	},
	'purchases.budgets.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a purchase budget',
	},
	'purchases.budgets.list': {
		riskLevel: 'read',
		description: 'List purchase budgets',
	},
	'purchases.budgets.update': {
		riskLevel: 'write',
		description:
			'Update a purchase budget: update the title, cost category, or active status of a purchase budget',
	},
	'purchases.budgets.updateTarget': {
		riskLevel: 'write',
		description: 'Update budget target for a year',
	},
	'purchases.categories.get': {
		riskLevel: 'read',
		description: 'Get purchase category',
	},
	'purchases.categories.list': {
		riskLevel: 'read',
		description: 'List purchase categories, one page at a time',
	},
	'purchases.create': {
		riskLevel: 'write',
		description: 'Create purchase',
	},
	'purchases.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete purchase: deletion is possible only for pending purchases without payments',
	},
	'purchases.drafts.create': {
		riskLevel: 'write',
		description: 'Create purchase draft',
	},
	'purchases.drafts.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete purchase draft',
	},
	'purchases.drafts.get': {
		riskLevel: 'read',
		description: 'Get purchase draft',
	},
	'purchases.drafts.getPdf': {
		riskLevel: 'read',
		description: 'Download purchase draft PDF (a PDF, saved to Files)',
	},
	'purchases.drafts.list': {
		riskLevel: 'read',
		description: 'List purchase drafts, one page at a time',
	},
	'purchases.get': {
		riskLevel: 'read',
		description: 'Get purchase',
	},
	'purchases.list': {
		riskLevel: 'read',
		description: 'List purchases, one page at a time',
	},
	'purchases.payments.bulkCreate': {
		riskLevel: 'write',
		description:
			'Create purchase payments in bulk: requires `application/json` request body with `bulk_data` list',
	},
	'purchases.payments.create': {
		riskLevel: 'write',
		description: 'Create purchase payment',
	},
	'purchases.payments.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete purchase payment',
	},
	'purchases.payments.get': {
		riskLevel: 'read',
		description: 'Get purchase payment',
	},
	'purchases.payments.list': {
		riskLevel: 'read',
		description: 'List purchase payments, one page at a time',
	},
	'purchases.payments.update': {
		riskLevel: 'write',
		description: 'Update purchase payment',
	},
	'purchases.storeDocument': {
		riskLevel: 'destructive',
		description:
			'Store purchase document: replaces or adds document after purchase creation',
	},
	'purchases.update': {
		riskLevel: 'write',
		description: 'Update purchase',
	},
	'purchases.updateStatus': {
		riskLevel: 'write',
		description: 'Update purchase status',
	},
	'receipts.create': {
		riskLevel: 'write',
		description: 'Create receipt',
	},
	'receipts.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete receipt',
	},
	'receipts.get': {
		riskLevel: 'read',
		description: 'Get receipt',
	},
	'receipts.list': {
		riskLevel: 'read',
		description: 'List receipts, one page at a time',
	},
	'receipts.update': {
		riskLevel: 'write',
		description: 'Update receipt',
	},
	'recurringExpenses.list': {
		riskLevel: 'read',
		description: 'List recurring expenses, one page at a time',
	},
	'reports.absences': {
		riskLevel: 'read',
		description: 'Get absences report',
	},
	'reports.cashflow': {
		riskLevel: 'read',
		description: 'Get cashflow report, one page at a time',
	},
	'reports.finance': {
		riskLevel: 'read',
		description: 'Get finance report, one page at a time',
	},
	'reports.plannedVsTracked': {
		riskLevel: 'read',
		description: 'Get planned vs tracked report, one page at a time',
	},
	'reports.utilization': {
		riskLevel: 'read',
		description: 'Get utilization report',
	},
	'revenueCategories.create': {
		riskLevel: 'write',
		description: 'Create revenue category',
	},
	'revenueCategories.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete revenue category',
	},
	'revenueCategories.get': {
		riskLevel: 'read',
		description: 'Get revenue category',
	},
	'revenueCategories.list': {
		riskLevel: 'read',
		description: 'List revenue categories, one page at a time',
	},
	'revenueCategories.update': {
		riskLevel: 'write',
		description: 'Update revenue category',
	},
	'schedules.create': {
		riskLevel: 'write',
		description: 'Create schedule',
	},
	'schedules.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete schedule',
	},
	'schedules.get': {
		riskLevel: 'read',
		description: 'Get schedule',
	},
	'schedules.list': {
		riskLevel: 'read',
		description:
			'List schedules: retrieve all absences (paged), one page at a time',
	},
	'schedules.update': {
		riskLevel: 'write',
		description: 'Update schedule',
	},
	'session.verify': {
		riskLevel: 'read',
		description: 'Verify the API key and read the user identity it belongs to',
	},
	'taggings.add': {
		riskLevel: 'write',
		description: 'Add tags to a record, keeping the ones it has',
	},
	'taggings.list': {
		riskLevel: 'read',
		description: 'List the tags on one record',
	},
	'taggings.remove': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Remove the given tags from a record',
	},
	'taggings.replace': {
		riskLevel: 'destructive',
		description: 'Replace every tag on a record with the given list',
	},
	'tags.create': {
		riskLevel: 'write',
		description: 'Create tag',
	},
	'tags.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete tag',
	},
	'tags.get': {
		riskLevel: 'read',
		description: 'Get tag',
	},
	'tags.list': {
		riskLevel: 'read',
		description: 'List tags, one page at a time',
	},
	'tags.update': {
		riskLevel: 'write',
		description: 'Update tag',
	},
	'todos.get': {
		riskLevel: 'read',
		description: 'Get todo',
	},
	'todos.list': {
		riskLevel: 'read',
		description: 'List todos, one page at a time',
	},
	'units.create': {
		riskLevel: 'write',
		description: 'Create unit',
	},
	'units.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete unit',
	},
	'units.get': {
		riskLevel: 'read',
		description: 'Get unit',
	},
	'units.list': {
		riskLevel: 'read',
		description: 'List units, one page at a time',
	},
	'units.update': {
		riskLevel: 'write',
		description: 'Update unit',
	},
	'users.absenceRequests.create': {
		riskLevel: 'write',
		description: 'Create user absence request',
	},
	'users.absenceRequests.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete user absence request',
	},
	'users.absenceRequests.get': {
		riskLevel: 'read',
		description: 'Get user absence request',
	},
	'users.absenceRequests.list': {
		riskLevel: 'read',
		description: 'List user absence requests, one page at a time',
	},
	'users.create': {
		riskLevel: 'destructive',
		description:
			'Create a user (a billed seat); MOCO emails them a welcome message unless welcome_email is false',
	},
	'users.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete user',
	},
	'users.employments.create': {
		riskLevel: 'write',
		description: 'Create user employment',
	},
	'users.employments.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete user employment',
	},
	'users.employments.get': {
		riskLevel: 'read',
		description: 'Get user employment',
	},
	'users.employments.list': {
		riskLevel: 'read',
		description: 'List user employments, one page at a time',
	},
	'users.employments.update': {
		riskLevel: 'write',
		description: 'Update user employment',
	},
	'users.get': {
		riskLevel: 'read',
		description: 'Read one user',
	},
	'users.holidays.create': {
		riskLevel: 'write',
		description: 'Create user holiday',
	},
	'users.holidays.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete user holiday',
	},
	'users.holidays.get': {
		riskLevel: 'read',
		description: 'Get user holiday',
	},
	'users.holidays.list': {
		riskLevel: 'read',
		description: 'List user holidays, one page at a time',
	},
	'users.holidays.update': {
		riskLevel: 'write',
		description: 'Update user holiday',
	},
	'users.list': {
		riskLevel: 'read',
		description: 'List account users, one page at a time',
	},
	'users.performanceReport': {
		riskLevel: 'read',
		description: 'Get user performance report',
	},
	'users.presences.create': {
		riskLevel: 'write',
		description: 'Create user presence',
	},
	'users.presences.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete user presence',
	},
	'users.presences.get': {
		riskLevel: 'read',
		description: 'Get user presence',
	},
	'users.presences.list': {
		riskLevel: 'read',
		description: 'List user presences, one page at a time',
	},
	'users.presences.touch': {
		riskLevel: 'write',
		description: 'Touch user presence',
	},
	'users.presences.update': {
		riskLevel: 'write',
		description: 'Update user presence',
	},
	'users.roles.list': {
		riskLevel: 'read',
		description: 'List user roles',
	},
	'users.update': {
		riskLevel: 'write',
		description: 'Update user',
	},
	'users.workTimeAdjustments.create': {
		riskLevel: 'write',
		description: 'Create user work time adjustment',
	},
	'users.workTimeAdjustments.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete user work time adjustment',
	},
	'users.workTimeAdjustments.get': {
		riskLevel: 'read',
		description: 'Get user work time adjustment',
	},
	'users.workTimeAdjustments.list': {
		riskLevel: 'read',
		description: 'List user work time adjustments, one page at a time',
	},
	'users.workTimeAdjustments.update': {
		riskLevel: 'write',
		description: 'Update user work time adjustment',
	},
	'vatCodePurchases.get': {
		riskLevel: 'read',
		description: 'Get VAT code purchase',
	},
	'vatCodePurchases.list': {
		riskLevel: 'read',
		description: 'List VAT code purchases, one page at a time',
	},
	'vatCodeSales.get': {
		riskLevel: 'read',
		description: 'Get VAT code sale',
	},
	'vatCodeSales.list': {
		riskLevel: 'read',
		description: 'List VAT code sales, one page at a time',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof mocoEndpointsNested>;
