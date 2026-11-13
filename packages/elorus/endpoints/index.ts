import { createElorusOperation } from './operation';
import { elorusOperationSchemas } from './types';

const v11Endpoints = {
	bills_list: createElorusOperation(
		'v11.bills_list',
		elorusOperationSchemas['v11.bills_list'],
	),
	bills_create: createElorusOperation(
		'v11.bills_create',
		elorusOperationSchemas['v11.bills_create'],
	),
	bills_read: createElorusOperation(
		'v11.bills_read',
		elorusOperationSchemas['v11.bills_read'],
	),
	bills_update: createElorusOperation(
		'v11.bills_update',
		elorusOperationSchemas['v11.bills_update'],
	),
	bills_partial_update: createElorusOperation(
		'v11.bills_partial_update',
		elorusOperationSchemas['v11.bills_partial_update'],
	),
	bills_delete: createElorusOperation(
		'v11.bills_delete',
		elorusOperationSchemas['v11.bills_delete'],
	),
	bills_email_from_template: createElorusOperation(
		'v11.bills_email_from_template',
		elorusOperationSchemas['v11.bills_email_from_template'],
	),
	bills_email_read: createElorusOperation(
		'v11.bills_email_read',
		elorusOperationSchemas['v11.bills_email_read'],
	),
	bills_email_create: createElorusOperation(
		'v11.bills_email_create',
		elorusOperationSchemas['v11.bills_email_create'],
	),
	bills_pdf: createElorusOperation(
		'v11.bills_pdf',
		elorusOperationSchemas['v11.bills_pdf'],
	),
	bills_mark_void: createElorusOperation(
		'v11.bills_mark_void',
		elorusOperationSchemas['v11.bills_mark_void'],
	),
	cashpayments_list: createElorusOperation(
		'v11.cashpayments_list',
		elorusOperationSchemas['v11.cashpayments_list'],
	),
	cashpayments_create: createElorusOperation(
		'v11.cashpayments_create',
		elorusOperationSchemas['v11.cashpayments_create'],
	),
	cashpayments_read: createElorusOperation(
		'v11.cashpayments_read',
		elorusOperationSchemas['v11.cashpayments_read'],
	),
	cashpayments_update: createElorusOperation(
		'v11.cashpayments_update',
		elorusOperationSchemas['v11.cashpayments_update'],
	),
	cashpayments_delete: createElorusOperation(
		'v11.cashpayments_delete',
		elorusOperationSchemas['v11.cashpayments_delete'],
	),
	cashpayments_pdf: createElorusOperation(
		'v11.cashpayments_pdf',
		elorusOperationSchemas['v11.cashpayments_pdf'],
	),
	cashreceipts_list: createElorusOperation(
		'v11.cashreceipts_list',
		elorusOperationSchemas['v11.cashreceipts_list'],
	),
	cashreceipts_create: createElorusOperation(
		'v11.cashreceipts_create',
		elorusOperationSchemas['v11.cashreceipts_create'],
	),
	cashreceipts_read: createElorusOperation(
		'v11.cashreceipts_read',
		elorusOperationSchemas['v11.cashreceipts_read'],
	),
	cashreceipts_update: createElorusOperation(
		'v11.cashreceipts_update',
		elorusOperationSchemas['v11.cashreceipts_update'],
	),
	cashreceipts_delete: createElorusOperation(
		'v11.cashreceipts_delete',
		elorusOperationSchemas['v11.cashreceipts_delete'],
	),
	cashreceipts_pdf: createElorusOperation(
		'v11.cashreceipts_pdf',
		elorusOperationSchemas['v11.cashreceipts_pdf'],
	),
	contacts_list: createElorusOperation(
		'v11.contacts_list',
		elorusOperationSchemas['v11.contacts_list'],
	),
	contacts_create: createElorusOperation(
		'v11.contacts_create',
		elorusOperationSchemas['v11.contacts_create'],
	),
	contacts_read: createElorusOperation(
		'v11.contacts_read',
		elorusOperationSchemas['v11.contacts_read'],
	),
	contacts_update: createElorusOperation(
		'v11.contacts_update',
		elorusOperationSchemas['v11.contacts_update'],
	),
	contacts_delete: createElorusOperation(
		'v11.contacts_delete',
		elorusOperationSchemas['v11.contacts_delete'],
	),
	creditnotes_list: createElorusOperation(
		'v11.creditnotes_list',
		elorusOperationSchemas['v11.creditnotes_list'],
	),
	creditnotes_create: createElorusOperation(
		'v11.creditnotes_create',
		elorusOperationSchemas['v11.creditnotes_create'],
	),
	creditnotes_read: createElorusOperation(
		'v11.creditnotes_read',
		elorusOperationSchemas['v11.creditnotes_read'],
	),
	creditnotes_update: createElorusOperation(
		'v11.creditnotes_update',
		elorusOperationSchemas['v11.creditnotes_update'],
	),
	creditnotes_partial_update: createElorusOperation(
		'v11.creditnotes_partial_update',
		elorusOperationSchemas['v11.creditnotes_partial_update'],
	),
	creditnotes_delete: createElorusOperation(
		'v11.creditnotes_delete',
		elorusOperationSchemas['v11.creditnotes_delete'],
	),
	creditnotes_email_from_template: createElorusOperation(
		'v11.creditnotes_email_from_template',
		elorusOperationSchemas['v11.creditnotes_email_from_template'],
	),
	creditnotes_email_read: createElorusOperation(
		'v11.creditnotes_email_read',
		elorusOperationSchemas['v11.creditnotes_email_read'],
	),
	creditnotes_email_create: createElorusOperation(
		'v11.creditnotes_email_create',
		elorusOperationSchemas['v11.creditnotes_email_create'],
	),
	creditnotes_pdf: createElorusOperation(
		'v11.creditnotes_pdf',
		elorusOperationSchemas['v11.creditnotes_pdf'],
	),
	creditnotes_mark_void: createElorusOperation(
		'v11.creditnotes_mark_void',
		elorusOperationSchemas['v11.creditnotes_mark_void'],
	),
	'creditnotes_applied-credit_list': createElorusOperation(
		'v11.creditnotes_applied-credit_list',
		elorusOperationSchemas['v11.creditnotes_applied-credit_list'],
	),
	'creditnotes_applied-credit_create': createElorusOperation(
		'v11.creditnotes_applied-credit_create',
		elorusOperationSchemas['v11.creditnotes_applied-credit_create'],
	),
	'creditnotes_applied-credit_delete': createElorusOperation(
		'v11.creditnotes_applied-credit_delete',
		elorusOperationSchemas['v11.creditnotes_applied-credit_delete'],
	),
	documenttypes_list: createElorusOperation(
		'v11.documenttypes_list',
		elorusOperationSchemas['v11.documenttypes_list'],
	),
	documenttypes_read: createElorusOperation(
		'v11.documenttypes_read',
		elorusOperationSchemas['v11.documenttypes_read'],
	),
	emailtemplates_list: createElorusOperation(
		'v11.emailtemplates_list',
		elorusOperationSchemas['v11.emailtemplates_list'],
	),
	emailtemplates_create: createElorusOperation(
		'v11.emailtemplates_create',
		elorusOperationSchemas['v11.emailtemplates_create'],
	),
	emailtemplates_read: createElorusOperation(
		'v11.emailtemplates_read',
		elorusOperationSchemas['v11.emailtemplates_read'],
	),
	emailtemplates_update: createElorusOperation(
		'v11.emailtemplates_update',
		elorusOperationSchemas['v11.emailtemplates_update'],
	),
	emailtemplates_delete: createElorusOperation(
		'v11.emailtemplates_delete',
		elorusOperationSchemas['v11.emailtemplates_delete'],
	),
	estimates_list: createElorusOperation(
		'v11.estimates_list',
		elorusOperationSchemas['v11.estimates_list'],
	),
	estimates_create: createElorusOperation(
		'v11.estimates_create',
		elorusOperationSchemas['v11.estimates_create'],
	),
	estimates_read: createElorusOperation(
		'v11.estimates_read',
		elorusOperationSchemas['v11.estimates_read'],
	),
	estimates_update: createElorusOperation(
		'v11.estimates_update',
		elorusOperationSchemas['v11.estimates_update'],
	),
	estimates_partial_update: createElorusOperation(
		'v11.estimates_partial_update',
		elorusOperationSchemas['v11.estimates_partial_update'],
	),
	estimates_delete: createElorusOperation(
		'v11.estimates_delete',
		elorusOperationSchemas['v11.estimates_delete'],
	),
	estimates_email_from_template: createElorusOperation(
		'v11.estimates_email_from_template',
		elorusOperationSchemas['v11.estimates_email_from_template'],
	),
	estimates_email_read: createElorusOperation(
		'v11.estimates_email_read',
		elorusOperationSchemas['v11.estimates_email_read'],
	),
	estimates_email_create: createElorusOperation(
		'v11.estimates_email_create',
		elorusOperationSchemas['v11.estimates_email_create'],
	),
	estimates_pdf: createElorusOperation(
		'v11.estimates_pdf',
		elorusOperationSchemas['v11.estimates_pdf'],
	),
	expensecategories_list: createElorusOperation(
		'v11.expensecategories_list',
		elorusOperationSchemas['v11.expensecategories_list'],
	),
	expensecategories_read: createElorusOperation(
		'v11.expensecategories_read',
		elorusOperationSchemas['v11.expensecategories_read'],
	),
	expenses_list: createElorusOperation(
		'v11.expenses_list',
		elorusOperationSchemas['v11.expenses_list'],
	),
	expenses_create: createElorusOperation(
		'v11.expenses_create',
		elorusOperationSchemas['v11.expenses_create'],
	),
	expenses_read: createElorusOperation(
		'v11.expenses_read',
		elorusOperationSchemas['v11.expenses_read'],
	),
	expenses_update: createElorusOperation(
		'v11.expenses_update',
		elorusOperationSchemas['v11.expenses_update'],
	),
	expenses_delete: createElorusOperation(
		'v11.expenses_delete',
		elorusOperationSchemas['v11.expenses_delete'],
	),
	invoices_list: createElorusOperation(
		'v11.invoices_list',
		elorusOperationSchemas['v11.invoices_list'],
	),
	invoices_create: createElorusOperation(
		'v11.invoices_create',
		elorusOperationSchemas['v11.invoices_create'],
	),
	invoices_read: createElorusOperation(
		'v11.invoices_read',
		elorusOperationSchemas['v11.invoices_read'],
	),
	invoices_update: createElorusOperation(
		'v11.invoices_update',
		elorusOperationSchemas['v11.invoices_update'],
	),
	invoices_partial_update: createElorusOperation(
		'v11.invoices_partial_update',
		elorusOperationSchemas['v11.invoices_partial_update'],
	),
	invoices_delete: createElorusOperation(
		'v11.invoices_delete',
		elorusOperationSchemas['v11.invoices_delete'],
	),
	invoices_email_from_template: createElorusOperation(
		'v11.invoices_email_from_template',
		elorusOperationSchemas['v11.invoices_email_from_template'],
	),
	invoices_email_read: createElorusOperation(
		'v11.invoices_email_read',
		elorusOperationSchemas['v11.invoices_email_read'],
	),
	invoices_email_create: createElorusOperation(
		'v11.invoices_email_create',
		elorusOperationSchemas['v11.invoices_email_create'],
	),
	invoices_pdf: createElorusOperation(
		'v11.invoices_pdf',
		elorusOperationSchemas['v11.invoices_pdf'],
	),
	invoices_mark_void: createElorusOperation(
		'v11.invoices_mark_void',
		elorusOperationSchemas['v11.invoices_mark_void'],
	),
	'invoices_applied-credit_list': createElorusOperation(
		'v11.invoices_applied-credit_list',
		elorusOperationSchemas['v11.invoices_applied-credit_list'],
	),
	'invoices_applied-credit_create': createElorusOperation(
		'v11.invoices_applied-credit_create',
		elorusOperationSchemas['v11.invoices_applied-credit_create'],
	),
	'invoices_applied-credit_delete': createElorusOperation(
		'v11.invoices_applied-credit_delete',
		elorusOperationSchemas['v11.invoices_applied-credit_delete'],
	),
	numberingsequence_list: createElorusOperation(
		'v11.numberingsequence_list',
		elorusOperationSchemas['v11.numberingsequence_list'],
	),
	numberingsequence_create: createElorusOperation(
		'v11.numberingsequence_create',
		elorusOperationSchemas['v11.numberingsequence_create'],
	),
	numberingsequence_read: createElorusOperation(
		'v11.numberingsequence_read',
		elorusOperationSchemas['v11.numberingsequence_read'],
	),
	numberingsequence_update: createElorusOperation(
		'v11.numberingsequence_update',
		elorusOperationSchemas['v11.numberingsequence_update'],
	),
	numberingsequence_delete: createElorusOperation(
		'v11.numberingsequence_delete',
		elorusOperationSchemas['v11.numberingsequence_delete'],
	),
	paymentgateways_list: createElorusOperation(
		'v11.paymentgateways_list',
		elorusOperationSchemas['v11.paymentgateways_list'],
	),
	products_list: createElorusOperation(
		'v11.products_list',
		elorusOperationSchemas['v11.products_list'],
	),
	products_create: createElorusOperation(
		'v11.products_create',
		elorusOperationSchemas['v11.products_create'],
	),
	products_read: createElorusOperation(
		'v11.products_read',
		elorusOperationSchemas['v11.products_read'],
	),
	products_update: createElorusOperation(
		'v11.products_update',
		elorusOperationSchemas['v11.products_update'],
	),
	products_delete: createElorusOperation(
		'v11.products_delete',
		elorusOperationSchemas['v11.products_delete'],
	),
	projects_list: createElorusOperation(
		'v11.projects_list',
		elorusOperationSchemas['v11.projects_list'],
	),
	projects_read: createElorusOperation(
		'v11.projects_read',
		elorusOperationSchemas['v11.projects_read'],
	),
	recurringinvoices_list: createElorusOperation(
		'v11.recurringinvoices_list',
		elorusOperationSchemas['v11.recurringinvoices_list'],
	),
	recurringinvoices_create: createElorusOperation(
		'v11.recurringinvoices_create',
		elorusOperationSchemas['v11.recurringinvoices_create'],
	),
	recurringinvoices_read: createElorusOperation(
		'v11.recurringinvoices_read',
		elorusOperationSchemas['v11.recurringinvoices_read'],
	),
	recurringinvoices_update: createElorusOperation(
		'v11.recurringinvoices_update',
		elorusOperationSchemas['v11.recurringinvoices_update'],
	),
	recurringinvoices_delete: createElorusOperation(
		'v11.recurringinvoices_delete',
		elorusOperationSchemas['v11.recurringinvoices_delete'],
	),
	suppliercredits_list: createElorusOperation(
		'v11.suppliercredits_list',
		elorusOperationSchemas['v11.suppliercredits_list'],
	),
	suppliercredits_create: createElorusOperation(
		'v11.suppliercredits_create',
		elorusOperationSchemas['v11.suppliercredits_create'],
	),
	suppliercredits_read: createElorusOperation(
		'v11.suppliercredits_read',
		elorusOperationSchemas['v11.suppliercredits_read'],
	),
	suppliercredits_update: createElorusOperation(
		'v11.suppliercredits_update',
		elorusOperationSchemas['v11.suppliercredits_update'],
	),
	suppliercredits_partial_update: createElorusOperation(
		'v11.suppliercredits_partial_update',
		elorusOperationSchemas['v11.suppliercredits_partial_update'],
	),
	suppliercredits_delete: createElorusOperation(
		'v11.suppliercredits_delete',
		elorusOperationSchemas['v11.suppliercredits_delete'],
	),
	suppliercredits_email_from_template: createElorusOperation(
		'v11.suppliercredits_email_from_template',
		elorusOperationSchemas['v11.suppliercredits_email_from_template'],
	),
	suppliercredits_email_read: createElorusOperation(
		'v11.suppliercredits_email_read',
		elorusOperationSchemas['v11.suppliercredits_email_read'],
	),
	suppliercredits_email_create: createElorusOperation(
		'v11.suppliercredits_email_create',
		elorusOperationSchemas['v11.suppliercredits_email_create'],
	),
	suppliercredits_pdf: createElorusOperation(
		'v11.suppliercredits_pdf',
		elorusOperationSchemas['v11.suppliercredits_pdf'],
	),
	suppliercredits_mark_void: createElorusOperation(
		'v11.suppliercredits_mark_void',
		elorusOperationSchemas['v11.suppliercredits_mark_void'],
	),
	'suppliercredits_applied-credit_list': createElorusOperation(
		'v11.suppliercredits_applied-credit_list',
		elorusOperationSchemas['v11.suppliercredits_applied-credit_list'],
	),
	'suppliercredits_applied-credit_create': createElorusOperation(
		'v11.suppliercredits_applied-credit_create',
		elorusOperationSchemas['v11.suppliercredits_applied-credit_create'],
	),
	'suppliercredits_applied-credit_delete': createElorusOperation(
		'v11.suppliercredits_applied-credit_delete',
		elorusOperationSchemas['v11.suppliercredits_applied-credit_delete'],
	),
	taxes_list: createElorusOperation(
		'v11.taxes_list',
		elorusOperationSchemas['v11.taxes_list'],
	),
	taxes_read: createElorusOperation(
		'v11.taxes_read',
		elorusOperationSchemas['v11.taxes_read'],
	),
	templates_list: createElorusOperation(
		'v11.templates_list',
		elorusOperationSchemas['v11.templates_list'],
	),
	templates_read: createElorusOperation(
		'v11.templates_read',
		elorusOperationSchemas['v11.templates_read'],
	),
	trackingcategories_list: createElorusOperation(
		'v11.trackingcategories_list',
		elorusOperationSchemas['v11.trackingcategories_list'],
	),
	trackingcategories_read: createElorusOperation(
		'v11.trackingcategories_read',
		elorusOperationSchemas['v11.trackingcategories_read'],
	),
	warehouse_list: createElorusOperation(
		'v11.warehouse_list',
		elorusOperationSchemas['v11.warehouse_list'],
	),
	warehouse_create: createElorusOperation(
		'v11.warehouse_create',
		elorusOperationSchemas['v11.warehouse_create'],
	),
	warehouse_read: createElorusOperation(
		'v11.warehouse_read',
		elorusOperationSchemas['v11.warehouse_read'],
	),
	warehouse_update: createElorusOperation(
		'v11.warehouse_update',
		elorusOperationSchemas['v11.warehouse_update'],
	),
	warehouse_partial_update: createElorusOperation(
		'v11.warehouse_partial_update',
		elorusOperationSchemas['v11.warehouse_partial_update'],
	),
	warehouse_delete: createElorusOperation(
		'v11.warehouse_delete',
		elorusOperationSchemas['v11.warehouse_delete'],
	),
} as const;

const v12Endpoints = {
	bills_list: createElorusOperation(
		'v12.bills_list',
		elorusOperationSchemas['v12.bills_list'],
	),
	bills_create: createElorusOperation(
		'v12.bills_create',
		elorusOperationSchemas['v12.bills_create'],
	),
	bills_read: createElorusOperation(
		'v12.bills_read',
		elorusOperationSchemas['v12.bills_read'],
	),
	bills_update: createElorusOperation(
		'v12.bills_update',
		elorusOperationSchemas['v12.bills_update'],
	),
	bills_partial_update: createElorusOperation(
		'v12.bills_partial_update',
		elorusOperationSchemas['v12.bills_partial_update'],
	),
	bills_delete: createElorusOperation(
		'v12.bills_delete',
		elorusOperationSchemas['v12.bills_delete'],
	),
	bills_email_from_template: createElorusOperation(
		'v12.bills_email_from_template',
		elorusOperationSchemas['v12.bills_email_from_template'],
	),
	bills_email_read: createElorusOperation(
		'v12.bills_email_read',
		elorusOperationSchemas['v12.bills_email_read'],
	),
	bills_email_create: createElorusOperation(
		'v12.bills_email_create',
		elorusOperationSchemas['v12.bills_email_create'],
	),
	bills_pdf: createElorusOperation(
		'v12.bills_pdf',
		elorusOperationSchemas['v12.bills_pdf'],
	),
	bills_mark_void: createElorusOperation(
		'v12.bills_mark_void',
		elorusOperationSchemas['v12.bills_mark_void'],
	),
	bills_attachments_list: createElorusOperation(
		'v12.bills_attachments_list',
		elorusOperationSchemas['v12.bills_attachments_list'],
	),
	bills_attachments_create: createElorusOperation(
		'v12.bills_attachments_create',
		elorusOperationSchemas['v12.bills_attachments_create'],
	),
	bills_attachments_read: createElorusOperation(
		'v12.bills_attachments_read',
		elorusOperationSchemas['v12.bills_attachments_read'],
	),
	bills_attachments_partial_update: createElorusOperation(
		'v12.bills_attachments_partial_update',
		elorusOperationSchemas['v12.bills_attachments_partial_update'],
	),
	bills_attachments_delete: createElorusOperation(
		'v12.bills_attachments_delete',
		elorusOperationSchemas['v12.bills_attachments_delete'],
	),
	bills_attachments_file: createElorusOperation(
		'v12.bills_attachments_file',
		elorusOperationSchemas['v12.bills_attachments_file'],
	),
	bills_notes_list: createElorusOperation(
		'v12.bills_notes_list',
		elorusOperationSchemas['v12.bills_notes_list'],
	),
	bills_notes_create: createElorusOperation(
		'v12.bills_notes_create',
		elorusOperationSchemas['v12.bills_notes_create'],
	),
	bills_notes_update: createElorusOperation(
		'v12.bills_notes_update',
		elorusOperationSchemas['v12.bills_notes_update'],
	),
	bills_notes_delete: createElorusOperation(
		'v12.bills_notes_delete',
		elorusOperationSchemas['v12.bills_notes_delete'],
	),
	'bills_sent-email-messages_list': createElorusOperation(
		'v12.bills_sent-email-messages_list',
		elorusOperationSchemas['v12.bills_sent-email-messages_list'],
	),
	cashpayments_list: createElorusOperation(
		'v12.cashpayments_list',
		elorusOperationSchemas['v12.cashpayments_list'],
	),
	cashpayments_create: createElorusOperation(
		'v12.cashpayments_create',
		elorusOperationSchemas['v12.cashpayments_create'],
	),
	cashpayments_read: createElorusOperation(
		'v12.cashpayments_read',
		elorusOperationSchemas['v12.cashpayments_read'],
	),
	cashpayments_update: createElorusOperation(
		'v12.cashpayments_update',
		elorusOperationSchemas['v12.cashpayments_update'],
	),
	cashpayments_delete: createElorusOperation(
		'v12.cashpayments_delete',
		elorusOperationSchemas['v12.cashpayments_delete'],
	),
	cashpayments_pdf: createElorusOperation(
		'v12.cashpayments_pdf',
		elorusOperationSchemas['v12.cashpayments_pdf'],
	),
	cashpayments_attachments_list: createElorusOperation(
		'v12.cashpayments_attachments_list',
		elorusOperationSchemas['v12.cashpayments_attachments_list'],
	),
	cashpayments_attachments_create: createElorusOperation(
		'v12.cashpayments_attachments_create',
		elorusOperationSchemas['v12.cashpayments_attachments_create'],
	),
	cashpayments_attachments_read: createElorusOperation(
		'v12.cashpayments_attachments_read',
		elorusOperationSchemas['v12.cashpayments_attachments_read'],
	),
	cashpayments_attachments_partial_update: createElorusOperation(
		'v12.cashpayments_attachments_partial_update',
		elorusOperationSchemas['v12.cashpayments_attachments_partial_update'],
	),
	cashpayments_attachments_delete: createElorusOperation(
		'v12.cashpayments_attachments_delete',
		elorusOperationSchemas['v12.cashpayments_attachments_delete'],
	),
	cashpayments_attachments_file: createElorusOperation(
		'v12.cashpayments_attachments_file',
		elorusOperationSchemas['v12.cashpayments_attachments_file'],
	),
	cashpayments_notes_list: createElorusOperation(
		'v12.cashpayments_notes_list',
		elorusOperationSchemas['v12.cashpayments_notes_list'],
	),
	cashpayments_notes_create: createElorusOperation(
		'v12.cashpayments_notes_create',
		elorusOperationSchemas['v12.cashpayments_notes_create'],
	),
	cashpayments_notes_update: createElorusOperation(
		'v12.cashpayments_notes_update',
		elorusOperationSchemas['v12.cashpayments_notes_update'],
	),
	cashpayments_notes_delete: createElorusOperation(
		'v12.cashpayments_notes_delete',
		elorusOperationSchemas['v12.cashpayments_notes_delete'],
	),
	cashreceipts_list: createElorusOperation(
		'v12.cashreceipts_list',
		elorusOperationSchemas['v12.cashreceipts_list'],
	),
	cashreceipts_create: createElorusOperation(
		'v12.cashreceipts_create',
		elorusOperationSchemas['v12.cashreceipts_create'],
	),
	cashreceipts_read: createElorusOperation(
		'v12.cashreceipts_read',
		elorusOperationSchemas['v12.cashreceipts_read'],
	),
	cashreceipts_update: createElorusOperation(
		'v12.cashreceipts_update',
		elorusOperationSchemas['v12.cashreceipts_update'],
	),
	cashreceipts_delete: createElorusOperation(
		'v12.cashreceipts_delete',
		elorusOperationSchemas['v12.cashreceipts_delete'],
	),
	cashreceipts_pdf: createElorusOperation(
		'v12.cashreceipts_pdf',
		elorusOperationSchemas['v12.cashreceipts_pdf'],
	),
	cashreceipts_attachments_list: createElorusOperation(
		'v12.cashreceipts_attachments_list',
		elorusOperationSchemas['v12.cashreceipts_attachments_list'],
	),
	cashreceipts_attachments_create: createElorusOperation(
		'v12.cashreceipts_attachments_create',
		elorusOperationSchemas['v12.cashreceipts_attachments_create'],
	),
	cashreceipts_attachments_read: createElorusOperation(
		'v12.cashreceipts_attachments_read',
		elorusOperationSchemas['v12.cashreceipts_attachments_read'],
	),
	cashreceipts_attachments_partial_update: createElorusOperation(
		'v12.cashreceipts_attachments_partial_update',
		elorusOperationSchemas['v12.cashreceipts_attachments_partial_update'],
	),
	cashreceipts_attachments_delete: createElorusOperation(
		'v12.cashreceipts_attachments_delete',
		elorusOperationSchemas['v12.cashreceipts_attachments_delete'],
	),
	cashreceipts_attachments_file: createElorusOperation(
		'v12.cashreceipts_attachments_file',
		elorusOperationSchemas['v12.cashreceipts_attachments_file'],
	),
	cashreceipts_notes_list: createElorusOperation(
		'v12.cashreceipts_notes_list',
		elorusOperationSchemas['v12.cashreceipts_notes_list'],
	),
	cashreceipts_notes_create: createElorusOperation(
		'v12.cashreceipts_notes_create',
		elorusOperationSchemas['v12.cashreceipts_notes_create'],
	),
	cashreceipts_notes_update: createElorusOperation(
		'v12.cashreceipts_notes_update',
		elorusOperationSchemas['v12.cashreceipts_notes_update'],
	),
	cashreceipts_notes_delete: createElorusOperation(
		'v12.cashreceipts_notes_delete',
		elorusOperationSchemas['v12.cashreceipts_notes_delete'],
	),
	contacts_list: createElorusOperation(
		'v12.contacts_list',
		elorusOperationSchemas['v12.contacts_list'],
	),
	contacts_create: createElorusOperation(
		'v12.contacts_create',
		elorusOperationSchemas['v12.contacts_create'],
	),
	contacts_read: createElorusOperation(
		'v12.contacts_read',
		elorusOperationSchemas['v12.contacts_read'],
	),
	contacts_update: createElorusOperation(
		'v12.contacts_update',
		elorusOperationSchemas['v12.contacts_update'],
	),
	contacts_delete: createElorusOperation(
		'v12.contacts_delete',
		elorusOperationSchemas['v12.contacts_delete'],
	),
	contacts_attachments_list: createElorusOperation(
		'v12.contacts_attachments_list',
		elorusOperationSchemas['v12.contacts_attachments_list'],
	),
	contacts_attachments_create: createElorusOperation(
		'v12.contacts_attachments_create',
		elorusOperationSchemas['v12.contacts_attachments_create'],
	),
	contacts_attachments_read: createElorusOperation(
		'v12.contacts_attachments_read',
		elorusOperationSchemas['v12.contacts_attachments_read'],
	),
	contacts_attachments_partial_update: createElorusOperation(
		'v12.contacts_attachments_partial_update',
		elorusOperationSchemas['v12.contacts_attachments_partial_update'],
	),
	contacts_attachments_delete: createElorusOperation(
		'v12.contacts_attachments_delete',
		elorusOperationSchemas['v12.contacts_attachments_delete'],
	),
	contacts_attachments_file: createElorusOperation(
		'v12.contacts_attachments_file',
		elorusOperationSchemas['v12.contacts_attachments_file'],
	),
	contacts_notes_list: createElorusOperation(
		'v12.contacts_notes_list',
		elorusOperationSchemas['v12.contacts_notes_list'],
	),
	contacts_notes_create: createElorusOperation(
		'v12.contacts_notes_create',
		elorusOperationSchemas['v12.contacts_notes_create'],
	),
	contacts_notes_update: createElorusOperation(
		'v12.contacts_notes_update',
		elorusOperationSchemas['v12.contacts_notes_update'],
	),
	contacts_notes_delete: createElorusOperation(
		'v12.contacts_notes_delete',
		elorusOperationSchemas['v12.contacts_notes_delete'],
	),
	creditnotes_list: createElorusOperation(
		'v12.creditnotes_list',
		elorusOperationSchemas['v12.creditnotes_list'],
	),
	creditnotes_create: createElorusOperation(
		'v12.creditnotes_create',
		elorusOperationSchemas['v12.creditnotes_create'],
	),
	creditnotes_read: createElorusOperation(
		'v12.creditnotes_read',
		elorusOperationSchemas['v12.creditnotes_read'],
	),
	creditnotes_update: createElorusOperation(
		'v12.creditnotes_update',
		elorusOperationSchemas['v12.creditnotes_update'],
	),
	creditnotes_partial_update: createElorusOperation(
		'v12.creditnotes_partial_update',
		elorusOperationSchemas['v12.creditnotes_partial_update'],
	),
	creditnotes_delete: createElorusOperation(
		'v12.creditnotes_delete',
		elorusOperationSchemas['v12.creditnotes_delete'],
	),
	creditnotes_email_from_template: createElorusOperation(
		'v12.creditnotes_email_from_template',
		elorusOperationSchemas['v12.creditnotes_email_from_template'],
	),
	creditnotes_email_read: createElorusOperation(
		'v12.creditnotes_email_read',
		elorusOperationSchemas['v12.creditnotes_email_read'],
	),
	creditnotes_email_create: createElorusOperation(
		'v12.creditnotes_email_create',
		elorusOperationSchemas['v12.creditnotes_email_create'],
	),
	creditnotes_pdf: createElorusOperation(
		'v12.creditnotes_pdf',
		elorusOperationSchemas['v12.creditnotes_pdf'],
	),
	creditnotes_mark_void: createElorusOperation(
		'v12.creditnotes_mark_void',
		elorusOperationSchemas['v12.creditnotes_mark_void'],
	),
	'creditnotes_applied-credit_list': createElorusOperation(
		'v12.creditnotes_applied-credit_list',
		elorusOperationSchemas['v12.creditnotes_applied-credit_list'],
	),
	'creditnotes_applied-credit_create': createElorusOperation(
		'v12.creditnotes_applied-credit_create',
		elorusOperationSchemas['v12.creditnotes_applied-credit_create'],
	),
	'creditnotes_applied-credit_delete': createElorusOperation(
		'v12.creditnotes_applied-credit_delete',
		elorusOperationSchemas['v12.creditnotes_applied-credit_delete'],
	),
	creditnotes_attachments_list: createElorusOperation(
		'v12.creditnotes_attachments_list',
		elorusOperationSchemas['v12.creditnotes_attachments_list'],
	),
	creditnotes_attachments_create: createElorusOperation(
		'v12.creditnotes_attachments_create',
		elorusOperationSchemas['v12.creditnotes_attachments_create'],
	),
	creditnotes_attachments_read: createElorusOperation(
		'v12.creditnotes_attachments_read',
		elorusOperationSchemas['v12.creditnotes_attachments_read'],
	),
	creditnotes_attachments_partial_update: createElorusOperation(
		'v12.creditnotes_attachments_partial_update',
		elorusOperationSchemas['v12.creditnotes_attachments_partial_update'],
	),
	creditnotes_attachments_delete: createElorusOperation(
		'v12.creditnotes_attachments_delete',
		elorusOperationSchemas['v12.creditnotes_attachments_delete'],
	),
	creditnotes_attachments_file: createElorusOperation(
		'v12.creditnotes_attachments_file',
		elorusOperationSchemas['v12.creditnotes_attachments_file'],
	),
	creditnotes_discussions_list: createElorusOperation(
		'v12.creditnotes_discussions_list',
		elorusOperationSchemas['v12.creditnotes_discussions_list'],
	),
	creditnotes_discussions_create: createElorusOperation(
		'v12.creditnotes_discussions_create',
		elorusOperationSchemas['v12.creditnotes_discussions_create'],
	),
	creditnotes_discussions_update: createElorusOperation(
		'v12.creditnotes_discussions_update',
		elorusOperationSchemas['v12.creditnotes_discussions_update'],
	),
	creditnotes_discussions_delete: createElorusOperation(
		'v12.creditnotes_discussions_delete',
		elorusOperationSchemas['v12.creditnotes_discussions_delete'],
	),
	creditnotes_notes_list: createElorusOperation(
		'v12.creditnotes_notes_list',
		elorusOperationSchemas['v12.creditnotes_notes_list'],
	),
	creditnotes_notes_create: createElorusOperation(
		'v12.creditnotes_notes_create',
		elorusOperationSchemas['v12.creditnotes_notes_create'],
	),
	creditnotes_notes_update: createElorusOperation(
		'v12.creditnotes_notes_update',
		elorusOperationSchemas['v12.creditnotes_notes_update'],
	),
	creditnotes_notes_delete: createElorusOperation(
		'v12.creditnotes_notes_delete',
		elorusOperationSchemas['v12.creditnotes_notes_delete'],
	),
	'creditnotes_sent-email-messages_list': createElorusOperation(
		'v12.creditnotes_sent-email-messages_list',
		elorusOperationSchemas['v12.creditnotes_sent-email-messages_list'],
	),
	deliverynotes_list: createElorusOperation(
		'v12.deliverynotes_list',
		elorusOperationSchemas['v12.deliverynotes_list'],
	),
	deliverynotes_create: createElorusOperation(
		'v12.deliverynotes_create',
		elorusOperationSchemas['v12.deliverynotes_create'],
	),
	deliverynotes_read: createElorusOperation(
		'v12.deliverynotes_read',
		elorusOperationSchemas['v12.deliverynotes_read'],
	),
	deliverynotes_update: createElorusOperation(
		'v12.deliverynotes_update',
		elorusOperationSchemas['v12.deliverynotes_update'],
	),
	deliverynotes_partial_update: createElorusOperation(
		'v12.deliverynotes_partial_update',
		elorusOperationSchemas['v12.deliverynotes_partial_update'],
	),
	deliverynotes_delete: createElorusOperation(
		'v12.deliverynotes_delete',
		elorusOperationSchemas['v12.deliverynotes_delete'],
	),
	deliverynotes_email_from_template: createElorusOperation(
		'v12.deliverynotes_email_from_template',
		elorusOperationSchemas['v12.deliverynotes_email_from_template'],
	),
	deliverynotes_email_read: createElorusOperation(
		'v12.deliverynotes_email_read',
		elorusOperationSchemas['v12.deliverynotes_email_read'],
	),
	deliverynotes_email_create: createElorusOperation(
		'v12.deliverynotes_email_create',
		elorusOperationSchemas['v12.deliverynotes_email_create'],
	),
	deliverynotes_pdf: createElorusOperation(
		'v12.deliverynotes_pdf',
		elorusOperationSchemas['v12.deliverynotes_pdf'],
	),
	deliverynotes_mark_void: createElorusOperation(
		'v12.deliverynotes_mark_void',
		elorusOperationSchemas['v12.deliverynotes_mark_void'],
	),
	deliverynotes_attachments_list: createElorusOperation(
		'v12.deliverynotes_attachments_list',
		elorusOperationSchemas['v12.deliverynotes_attachments_list'],
	),
	deliverynotes_attachments_create: createElorusOperation(
		'v12.deliverynotes_attachments_create',
		elorusOperationSchemas['v12.deliverynotes_attachments_create'],
	),
	deliverynotes_attachments_read: createElorusOperation(
		'v12.deliverynotes_attachments_read',
		elorusOperationSchemas['v12.deliverynotes_attachments_read'],
	),
	deliverynotes_attachments_partial_update: createElorusOperation(
		'v12.deliverynotes_attachments_partial_update',
		elorusOperationSchemas['v12.deliverynotes_attachments_partial_update'],
	),
	deliverynotes_attachments_delete: createElorusOperation(
		'v12.deliverynotes_attachments_delete',
		elorusOperationSchemas['v12.deliverynotes_attachments_delete'],
	),
	deliverynotes_attachments_file: createElorusOperation(
		'v12.deliverynotes_attachments_file',
		elorusOperationSchemas['v12.deliverynotes_attachments_file'],
	),
	deliverynotes_notes_list: createElorusOperation(
		'v12.deliverynotes_notes_list',
		elorusOperationSchemas['v12.deliverynotes_notes_list'],
	),
	deliverynotes_notes_create: createElorusOperation(
		'v12.deliverynotes_notes_create',
		elorusOperationSchemas['v12.deliverynotes_notes_create'],
	),
	deliverynotes_notes_update: createElorusOperation(
		'v12.deliverynotes_notes_update',
		elorusOperationSchemas['v12.deliverynotes_notes_update'],
	),
	deliverynotes_notes_delete: createElorusOperation(
		'v12.deliverynotes_notes_delete',
		elorusOperationSchemas['v12.deliverynotes_notes_delete'],
	),
	'deliverynotes_sent-email-messages_list': createElorusOperation(
		'v12.deliverynotes_sent-email-messages_list',
		elorusOperationSchemas['v12.deliverynotes_sent-email-messages_list'],
	),
	documenttypes_list: createElorusOperation(
		'v12.documenttypes_list',
		elorusOperationSchemas['v12.documenttypes_list'],
	),
	documenttypes_read: createElorusOperation(
		'v12.documenttypes_read',
		elorusOperationSchemas['v12.documenttypes_read'],
	),
	documenttypes_sequences_list: createElorusOperation(
		'v12.documenttypes_sequences_list',
		elorusOperationSchemas['v12.documenttypes_sequences_list'],
	),
	documenttypes_sequences_create: createElorusOperation(
		'v12.documenttypes_sequences_create',
		elorusOperationSchemas['v12.documenttypes_sequences_create'],
	),
	documenttypes_sequences_delete_sequence: createElorusOperation(
		'v12.documenttypes_sequences_delete_sequence',
		elorusOperationSchemas['v12.documenttypes_sequences_delete_sequence'],
	),
	documenttypes_sequences_rename_sequence: createElorusOperation(
		'v12.documenttypes_sequences_rename_sequence',
		elorusOperationSchemas['v12.documenttypes_sequences_rename_sequence'],
	),
	emailtemplates_list: createElorusOperation(
		'v12.emailtemplates_list',
		elorusOperationSchemas['v12.emailtemplates_list'],
	),
	emailtemplates_create: createElorusOperation(
		'v12.emailtemplates_create',
		elorusOperationSchemas['v12.emailtemplates_create'],
	),
	emailtemplates_read: createElorusOperation(
		'v12.emailtemplates_read',
		elorusOperationSchemas['v12.emailtemplates_read'],
	),
	emailtemplates_update: createElorusOperation(
		'v12.emailtemplates_update',
		elorusOperationSchemas['v12.emailtemplates_update'],
	),
	emailtemplates_delete: createElorusOperation(
		'v12.emailtemplates_delete',
		elorusOperationSchemas['v12.emailtemplates_delete'],
	),
	estimates_list: createElorusOperation(
		'v12.estimates_list',
		elorusOperationSchemas['v12.estimates_list'],
	),
	estimates_create: createElorusOperation(
		'v12.estimates_create',
		elorusOperationSchemas['v12.estimates_create'],
	),
	estimates_read: createElorusOperation(
		'v12.estimates_read',
		elorusOperationSchemas['v12.estimates_read'],
	),
	estimates_update: createElorusOperation(
		'v12.estimates_update',
		elorusOperationSchemas['v12.estimates_update'],
	),
	estimates_partial_update: createElorusOperation(
		'v12.estimates_partial_update',
		elorusOperationSchemas['v12.estimates_partial_update'],
	),
	estimates_delete: createElorusOperation(
		'v12.estimates_delete',
		elorusOperationSchemas['v12.estimates_delete'],
	),
	estimates_email_from_template: createElorusOperation(
		'v12.estimates_email_from_template',
		elorusOperationSchemas['v12.estimates_email_from_template'],
	),
	estimates_email_read: createElorusOperation(
		'v12.estimates_email_read',
		elorusOperationSchemas['v12.estimates_email_read'],
	),
	estimates_email_create: createElorusOperation(
		'v12.estimates_email_create',
		elorusOperationSchemas['v12.estimates_email_create'],
	),
	estimates_pdf: createElorusOperation(
		'v12.estimates_pdf',
		elorusOperationSchemas['v12.estimates_pdf'],
	),
	estimates_attachments_list: createElorusOperation(
		'v12.estimates_attachments_list',
		elorusOperationSchemas['v12.estimates_attachments_list'],
	),
	estimates_attachments_create: createElorusOperation(
		'v12.estimates_attachments_create',
		elorusOperationSchemas['v12.estimates_attachments_create'],
	),
	estimates_attachments_read: createElorusOperation(
		'v12.estimates_attachments_read',
		elorusOperationSchemas['v12.estimates_attachments_read'],
	),
	estimates_attachments_partial_update: createElorusOperation(
		'v12.estimates_attachments_partial_update',
		elorusOperationSchemas['v12.estimates_attachments_partial_update'],
	),
	estimates_attachments_delete: createElorusOperation(
		'v12.estimates_attachments_delete',
		elorusOperationSchemas['v12.estimates_attachments_delete'],
	),
	estimates_attachments_file: createElorusOperation(
		'v12.estimates_attachments_file',
		elorusOperationSchemas['v12.estimates_attachments_file'],
	),
	estimates_discussions_list: createElorusOperation(
		'v12.estimates_discussions_list',
		elorusOperationSchemas['v12.estimates_discussions_list'],
	),
	estimates_discussions_create: createElorusOperation(
		'v12.estimates_discussions_create',
		elorusOperationSchemas['v12.estimates_discussions_create'],
	),
	estimates_discussions_update: createElorusOperation(
		'v12.estimates_discussions_update',
		elorusOperationSchemas['v12.estimates_discussions_update'],
	),
	estimates_discussions_delete: createElorusOperation(
		'v12.estimates_discussions_delete',
		elorusOperationSchemas['v12.estimates_discussions_delete'],
	),
	estimates_notes_list: createElorusOperation(
		'v12.estimates_notes_list',
		elorusOperationSchemas['v12.estimates_notes_list'],
	),
	estimates_notes_create: createElorusOperation(
		'v12.estimates_notes_create',
		elorusOperationSchemas['v12.estimates_notes_create'],
	),
	estimates_notes_update: createElorusOperation(
		'v12.estimates_notes_update',
		elorusOperationSchemas['v12.estimates_notes_update'],
	),
	estimates_notes_delete: createElorusOperation(
		'v12.estimates_notes_delete',
		elorusOperationSchemas['v12.estimates_notes_delete'],
	),
	'estimates_sent-email-messages_list': createElorusOperation(
		'v12.estimates_sent-email-messages_list',
		elorusOperationSchemas['v12.estimates_sent-email-messages_list'],
	),
	expensecategories_list: createElorusOperation(
		'v12.expensecategories_list',
		elorusOperationSchemas['v12.expensecategories_list'],
	),
	expensecategories_read: createElorusOperation(
		'v12.expensecategories_read',
		elorusOperationSchemas['v12.expensecategories_read'],
	),
	expenses_list: createElorusOperation(
		'v12.expenses_list',
		elorusOperationSchemas['v12.expenses_list'],
	),
	expenses_create: createElorusOperation(
		'v12.expenses_create',
		elorusOperationSchemas['v12.expenses_create'],
	),
	expenses_read: createElorusOperation(
		'v12.expenses_read',
		elorusOperationSchemas['v12.expenses_read'],
	),
	expenses_update: createElorusOperation(
		'v12.expenses_update',
		elorusOperationSchemas['v12.expenses_update'],
	),
	expenses_delete: createElorusOperation(
		'v12.expenses_delete',
		elorusOperationSchemas['v12.expenses_delete'],
	),
	expenses_attachments_list: createElorusOperation(
		'v12.expenses_attachments_list',
		elorusOperationSchemas['v12.expenses_attachments_list'],
	),
	expenses_attachments_create: createElorusOperation(
		'v12.expenses_attachments_create',
		elorusOperationSchemas['v12.expenses_attachments_create'],
	),
	expenses_attachments_read: createElorusOperation(
		'v12.expenses_attachments_read',
		elorusOperationSchemas['v12.expenses_attachments_read'],
	),
	expenses_attachments_partial_update: createElorusOperation(
		'v12.expenses_attachments_partial_update',
		elorusOperationSchemas['v12.expenses_attachments_partial_update'],
	),
	expenses_attachments_delete: createElorusOperation(
		'v12.expenses_attachments_delete',
		elorusOperationSchemas['v12.expenses_attachments_delete'],
	),
	expenses_attachments_file: createElorusOperation(
		'v12.expenses_attachments_file',
		elorusOperationSchemas['v12.expenses_attachments_file'],
	),
	expenses_notes_list: createElorusOperation(
		'v12.expenses_notes_list',
		elorusOperationSchemas['v12.expenses_notes_list'],
	),
	expenses_notes_create: createElorusOperation(
		'v12.expenses_notes_create',
		elorusOperationSchemas['v12.expenses_notes_create'],
	),
	expenses_notes_update: createElorusOperation(
		'v12.expenses_notes_update',
		elorusOperationSchemas['v12.expenses_notes_update'],
	),
	expenses_notes_delete: createElorusOperation(
		'v12.expenses_notes_delete',
		elorusOperationSchemas['v12.expenses_notes_delete'],
	),
	goodsreceipts_list: createElorusOperation(
		'v12.goodsreceipts_list',
		elorusOperationSchemas['v12.goodsreceipts_list'],
	),
	goodsreceipts_create: createElorusOperation(
		'v12.goodsreceipts_create',
		elorusOperationSchemas['v12.goodsreceipts_create'],
	),
	goodsreceipts_read: createElorusOperation(
		'v12.goodsreceipts_read',
		elorusOperationSchemas['v12.goodsreceipts_read'],
	),
	goodsreceipts_update: createElorusOperation(
		'v12.goodsreceipts_update',
		elorusOperationSchemas['v12.goodsreceipts_update'],
	),
	goodsreceipts_partial_update: createElorusOperation(
		'v12.goodsreceipts_partial_update',
		elorusOperationSchemas['v12.goodsreceipts_partial_update'],
	),
	goodsreceipts_delete: createElorusOperation(
		'v12.goodsreceipts_delete',
		elorusOperationSchemas['v12.goodsreceipts_delete'],
	),
	goodsreceipts_email_from_template: createElorusOperation(
		'v12.goodsreceipts_email_from_template',
		elorusOperationSchemas['v12.goodsreceipts_email_from_template'],
	),
	goodsreceipts_email_read: createElorusOperation(
		'v12.goodsreceipts_email_read',
		elorusOperationSchemas['v12.goodsreceipts_email_read'],
	),
	goodsreceipts_email_create: createElorusOperation(
		'v12.goodsreceipts_email_create',
		elorusOperationSchemas['v12.goodsreceipts_email_create'],
	),
	goodsreceipts_pdf: createElorusOperation(
		'v12.goodsreceipts_pdf',
		elorusOperationSchemas['v12.goodsreceipts_pdf'],
	),
	goodsreceipts_mark_void: createElorusOperation(
		'v12.goodsreceipts_mark_void',
		elorusOperationSchemas['v12.goodsreceipts_mark_void'],
	),
	goodsreceipts_notes_list: createElorusOperation(
		'v12.goodsreceipts_notes_list',
		elorusOperationSchemas['v12.goodsreceipts_notes_list'],
	),
	goodsreceipts_notes_create: createElorusOperation(
		'v12.goodsreceipts_notes_create',
		elorusOperationSchemas['v12.goodsreceipts_notes_create'],
	),
	goodsreceipts_notes_update: createElorusOperation(
		'v12.goodsreceipts_notes_update',
		elorusOperationSchemas['v12.goodsreceipts_notes_update'],
	),
	goodsreceipts_notes_delete: createElorusOperation(
		'v12.goodsreceipts_notes_delete',
		elorusOperationSchemas['v12.goodsreceipts_notes_delete'],
	),
	'goodsreceipts_sent-email-messages_list': createElorusOperation(
		'v12.goodsreceipts_sent-email-messages_list',
		elorusOperationSchemas['v12.goodsreceipts_sent-email-messages_list'],
	),
	goodsreceiptsequences_list: createElorusOperation(
		'v12.goodsreceiptsequences_list',
		elorusOperationSchemas['v12.goodsreceiptsequences_list'],
	),
	goodsreceiptsequences_create: createElorusOperation(
		'v12.goodsreceiptsequences_create',
		elorusOperationSchemas['v12.goodsreceiptsequences_create'],
	),
	goodsreceiptsequences_delete_sequence: createElorusOperation(
		'v12.goodsreceiptsequences_delete_sequence',
		elorusOperationSchemas['v12.goodsreceiptsequences_delete_sequence'],
	),
	goodsreceiptsequences_rename_sequence: createElorusOperation(
		'v12.goodsreceiptsequences_rename_sequence',
		elorusOperationSchemas['v12.goodsreceiptsequences_rename_sequence'],
	),
	invoices_list: createElorusOperation(
		'v12.invoices_list',
		elorusOperationSchemas['v12.invoices_list'],
	),
	invoices_create: createElorusOperation(
		'v12.invoices_create',
		elorusOperationSchemas['v12.invoices_create'],
	),
	invoices_read: createElorusOperation(
		'v12.invoices_read',
		elorusOperationSchemas['v12.invoices_read'],
	),
	invoices_update: createElorusOperation(
		'v12.invoices_update',
		elorusOperationSchemas['v12.invoices_update'],
	),
	invoices_partial_update: createElorusOperation(
		'v12.invoices_partial_update',
		elorusOperationSchemas['v12.invoices_partial_update'],
	),
	invoices_delete: createElorusOperation(
		'v12.invoices_delete',
		elorusOperationSchemas['v12.invoices_delete'],
	),
	invoices_email_from_template: createElorusOperation(
		'v12.invoices_email_from_template',
		elorusOperationSchemas['v12.invoices_email_from_template'],
	),
	invoices_email_read: createElorusOperation(
		'v12.invoices_email_read',
		elorusOperationSchemas['v12.invoices_email_read'],
	),
	invoices_email_create: createElorusOperation(
		'v12.invoices_email_create',
		elorusOperationSchemas['v12.invoices_email_create'],
	),
	invoices_pdf: createElorusOperation(
		'v12.invoices_pdf',
		elorusOperationSchemas['v12.invoices_pdf'],
	),
	invoices_mark_void: createElorusOperation(
		'v12.invoices_mark_void',
		elorusOperationSchemas['v12.invoices_mark_void'],
	),
	'invoices_applied-credit_list': createElorusOperation(
		'v12.invoices_applied-credit_list',
		elorusOperationSchemas['v12.invoices_applied-credit_list'],
	),
	'invoices_applied-credit_create': createElorusOperation(
		'v12.invoices_applied-credit_create',
		elorusOperationSchemas['v12.invoices_applied-credit_create'],
	),
	'invoices_applied-credit_delete': createElorusOperation(
		'v12.invoices_applied-credit_delete',
		elorusOperationSchemas['v12.invoices_applied-credit_delete'],
	),
	invoices_attachments_list: createElorusOperation(
		'v12.invoices_attachments_list',
		elorusOperationSchemas['v12.invoices_attachments_list'],
	),
	invoices_attachments_create: createElorusOperation(
		'v12.invoices_attachments_create',
		elorusOperationSchemas['v12.invoices_attachments_create'],
	),
	invoices_attachments_read: createElorusOperation(
		'v12.invoices_attachments_read',
		elorusOperationSchemas['v12.invoices_attachments_read'],
	),
	invoices_attachments_partial_update: createElorusOperation(
		'v12.invoices_attachments_partial_update',
		elorusOperationSchemas['v12.invoices_attachments_partial_update'],
	),
	invoices_attachments_delete: createElorusOperation(
		'v12.invoices_attachments_delete',
		elorusOperationSchemas['v12.invoices_attachments_delete'],
	),
	invoices_attachments_file: createElorusOperation(
		'v12.invoices_attachments_file',
		elorusOperationSchemas['v12.invoices_attachments_file'],
	),
	invoices_discussions_list: createElorusOperation(
		'v12.invoices_discussions_list',
		elorusOperationSchemas['v12.invoices_discussions_list'],
	),
	invoices_discussions_create: createElorusOperation(
		'v12.invoices_discussions_create',
		elorusOperationSchemas['v12.invoices_discussions_create'],
	),
	invoices_discussions_update: createElorusOperation(
		'v12.invoices_discussions_update',
		elorusOperationSchemas['v12.invoices_discussions_update'],
	),
	invoices_discussions_delete: createElorusOperation(
		'v12.invoices_discussions_delete',
		elorusOperationSchemas['v12.invoices_discussions_delete'],
	),
	invoices_notes_list: createElorusOperation(
		'v12.invoices_notes_list',
		elorusOperationSchemas['v12.invoices_notes_list'],
	),
	invoices_notes_create: createElorusOperation(
		'v12.invoices_notes_create',
		elorusOperationSchemas['v12.invoices_notes_create'],
	),
	invoices_notes_update: createElorusOperation(
		'v12.invoices_notes_update',
		elorusOperationSchemas['v12.invoices_notes_update'],
	),
	invoices_notes_delete: createElorusOperation(
		'v12.invoices_notes_delete',
		elorusOperationSchemas['v12.invoices_notes_delete'],
	),
	'invoices_sent-email-messages_list': createElorusOperation(
		'v12.invoices_sent-email-messages_list',
		elorusOperationSchemas['v12.invoices_sent-email-messages_list'],
	),
	organizationbranch_list: createElorusOperation(
		'v12.organizationbranch_list',
		elorusOperationSchemas['v12.organizationbranch_list'],
	),
	organizationbranch_create: createElorusOperation(
		'v12.organizationbranch_create',
		elorusOperationSchemas['v12.organizationbranch_create'],
	),
	organizationbranch_read: createElorusOperation(
		'v12.organizationbranch_read',
		elorusOperationSchemas['v12.organizationbranch_read'],
	),
	organizationbranch_update: createElorusOperation(
		'v12.organizationbranch_update',
		elorusOperationSchemas['v12.organizationbranch_update'],
	),
	organizationbranch_partial_update: createElorusOperation(
		'v12.organizationbranch_partial_update',
		elorusOperationSchemas['v12.organizationbranch_partial_update'],
	),
	organizationbranch_delete: createElorusOperation(
		'v12.organizationbranch_delete',
		elorusOperationSchemas['v12.organizationbranch_delete'],
	),
	paymentgateways_list: createElorusOperation(
		'v12.paymentgateways_list',
		elorusOperationSchemas['v12.paymentgateways_list'],
	),
	products_list: createElorusOperation(
		'v12.products_list',
		elorusOperationSchemas['v12.products_list'],
	),
	products_create: createElorusOperation(
		'v12.products_create',
		elorusOperationSchemas['v12.products_create'],
	),
	products_read: createElorusOperation(
		'v12.products_read',
		elorusOperationSchemas['v12.products_read'],
	),
	products_update: createElorusOperation(
		'v12.products_update',
		elorusOperationSchemas['v12.products_update'],
	),
	products_delete: createElorusOperation(
		'v12.products_delete',
		elorusOperationSchemas['v12.products_delete'],
	),
	products_notes_list: createElorusOperation(
		'v12.products_notes_list',
		elorusOperationSchemas['v12.products_notes_list'],
	),
	products_notes_create: createElorusOperation(
		'v12.products_notes_create',
		elorusOperationSchemas['v12.products_notes_create'],
	),
	products_notes_update: createElorusOperation(
		'v12.products_notes_update',
		elorusOperationSchemas['v12.products_notes_update'],
	),
	products_notes_delete: createElorusOperation(
		'v12.products_notes_delete',
		elorusOperationSchemas['v12.products_notes_delete'],
	),
	products_stockadjustments_list: createElorusOperation(
		'v12.products_stockadjustments_list',
		elorusOperationSchemas['v12.products_stockadjustments_list'],
	),
	products_stockadjustments_create: createElorusOperation(
		'v12.products_stockadjustments_create',
		elorusOperationSchemas['v12.products_stockadjustments_create'],
	),
	products_stockadjustments_read: createElorusOperation(
		'v12.products_stockadjustments_read',
		elorusOperationSchemas['v12.products_stockadjustments_read'],
	),
	products_stockadjustments_delete: createElorusOperation(
		'v12.products_stockadjustments_delete',
		elorusOperationSchemas['v12.products_stockadjustments_delete'],
	),
	projects_list: createElorusOperation(
		'v12.projects_list',
		elorusOperationSchemas['v12.projects_list'],
	),
	projects_create: createElorusOperation(
		'v12.projects_create',
		elorusOperationSchemas['v12.projects_create'],
	),
	projects_read: createElorusOperation(
		'v12.projects_read',
		elorusOperationSchemas['v12.projects_read'],
	),
	projects_update: createElorusOperation(
		'v12.projects_update',
		elorusOperationSchemas['v12.projects_update'],
	),
	projects_delete: createElorusOperation(
		'v12.projects_delete',
		elorusOperationSchemas['v12.projects_delete'],
	),
	projects_attachments_list: createElorusOperation(
		'v12.projects_attachments_list',
		elorusOperationSchemas['v12.projects_attachments_list'],
	),
	projects_attachments_create: createElorusOperation(
		'v12.projects_attachments_create',
		elorusOperationSchemas['v12.projects_attachments_create'],
	),
	projects_attachments_read: createElorusOperation(
		'v12.projects_attachments_read',
		elorusOperationSchemas['v12.projects_attachments_read'],
	),
	projects_attachments_partial_update: createElorusOperation(
		'v12.projects_attachments_partial_update',
		elorusOperationSchemas['v12.projects_attachments_partial_update'],
	),
	projects_attachments_delete: createElorusOperation(
		'v12.projects_attachments_delete',
		elorusOperationSchemas['v12.projects_attachments_delete'],
	),
	projects_attachments_file: createElorusOperation(
		'v12.projects_attachments_file',
		elorusOperationSchemas['v12.projects_attachments_file'],
	),
	projects_discussions_list: createElorusOperation(
		'v12.projects_discussions_list',
		elorusOperationSchemas['v12.projects_discussions_list'],
	),
	projects_discussions_create: createElorusOperation(
		'v12.projects_discussions_create',
		elorusOperationSchemas['v12.projects_discussions_create'],
	),
	projects_discussions_update: createElorusOperation(
		'v12.projects_discussions_update',
		elorusOperationSchemas['v12.projects_discussions_update'],
	),
	projects_discussions_delete: createElorusOperation(
		'v12.projects_discussions_delete',
		elorusOperationSchemas['v12.projects_discussions_delete'],
	),
	projects_notes_list: createElorusOperation(
		'v12.projects_notes_list',
		elorusOperationSchemas['v12.projects_notes_list'],
	),
	projects_notes_create: createElorusOperation(
		'v12.projects_notes_create',
		elorusOperationSchemas['v12.projects_notes_create'],
	),
	projects_notes_update: createElorusOperation(
		'v12.projects_notes_update',
		elorusOperationSchemas['v12.projects_notes_update'],
	),
	projects_notes_delete: createElorusOperation(
		'v12.projects_notes_delete',
		elorusOperationSchemas['v12.projects_notes_delete'],
	),
	projects_projectextrafees_list: createElorusOperation(
		'v12.projects_projectextrafees_list',
		elorusOperationSchemas['v12.projects_projectextrafees_list'],
	),
	projects_projectextrafees_create: createElorusOperation(
		'v12.projects_projectextrafees_create',
		elorusOperationSchemas['v12.projects_projectextrafees_create'],
	),
	projects_projectextrafees_read: createElorusOperation(
		'v12.projects_projectextrafees_read',
		elorusOperationSchemas['v12.projects_projectextrafees_read'],
	),
	projects_projectextrafees_update: createElorusOperation(
		'v12.projects_projectextrafees_update',
		elorusOperationSchemas['v12.projects_projectextrafees_update'],
	),
	projects_projectextrafees_partial_update: createElorusOperation(
		'v12.projects_projectextrafees_partial_update',
		elorusOperationSchemas['v12.projects_projectextrafees_partial_update'],
	),
	projects_projectextrafees_delete: createElorusOperation(
		'v12.projects_projectextrafees_delete',
		elorusOperationSchemas['v12.projects_projectextrafees_delete'],
	),
	recurringinvoices_list: createElorusOperation(
		'v12.recurringinvoices_list',
		elorusOperationSchemas['v12.recurringinvoices_list'],
	),
	recurringinvoices_create: createElorusOperation(
		'v12.recurringinvoices_create',
		elorusOperationSchemas['v12.recurringinvoices_create'],
	),
	recurringinvoices_read: createElorusOperation(
		'v12.recurringinvoices_read',
		elorusOperationSchemas['v12.recurringinvoices_read'],
	),
	recurringinvoices_update: createElorusOperation(
		'v12.recurringinvoices_update',
		elorusOperationSchemas['v12.recurringinvoices_update'],
	),
	recurringinvoices_delete: createElorusOperation(
		'v12.recurringinvoices_delete',
		elorusOperationSchemas['v12.recurringinvoices_delete'],
	),
	recurringinvoices_notes_list: createElorusOperation(
		'v12.recurringinvoices_notes_list',
		elorusOperationSchemas['v12.recurringinvoices_notes_list'],
	),
	recurringinvoices_notes_create: createElorusOperation(
		'v12.recurringinvoices_notes_create',
		elorusOperationSchemas['v12.recurringinvoices_notes_create'],
	),
	recurringinvoices_notes_update: createElorusOperation(
		'v12.recurringinvoices_notes_update',
		elorusOperationSchemas['v12.recurringinvoices_notes_update'],
	),
	recurringinvoices_notes_delete: createElorusOperation(
		'v12.recurringinvoices_notes_delete',
		elorusOperationSchemas['v12.recurringinvoices_notes_delete'],
	),
	suppliercredits_list: createElorusOperation(
		'v12.suppliercredits_list',
		elorusOperationSchemas['v12.suppliercredits_list'],
	),
	suppliercredits_create: createElorusOperation(
		'v12.suppliercredits_create',
		elorusOperationSchemas['v12.suppliercredits_create'],
	),
	suppliercredits_read: createElorusOperation(
		'v12.suppliercredits_read',
		elorusOperationSchemas['v12.suppliercredits_read'],
	),
	suppliercredits_update: createElorusOperation(
		'v12.suppliercredits_update',
		elorusOperationSchemas['v12.suppliercredits_update'],
	),
	suppliercredits_partial_update: createElorusOperation(
		'v12.suppliercredits_partial_update',
		elorusOperationSchemas['v12.suppliercredits_partial_update'],
	),
	suppliercredits_delete: createElorusOperation(
		'v12.suppliercredits_delete',
		elorusOperationSchemas['v12.suppliercredits_delete'],
	),
	suppliercredits_email_from_template: createElorusOperation(
		'v12.suppliercredits_email_from_template',
		elorusOperationSchemas['v12.suppliercredits_email_from_template'],
	),
	suppliercredits_email_read: createElorusOperation(
		'v12.suppliercredits_email_read',
		elorusOperationSchemas['v12.suppliercredits_email_read'],
	),
	suppliercredits_email_create: createElorusOperation(
		'v12.suppliercredits_email_create',
		elorusOperationSchemas['v12.suppliercredits_email_create'],
	),
	suppliercredits_pdf: createElorusOperation(
		'v12.suppliercredits_pdf',
		elorusOperationSchemas['v12.suppliercredits_pdf'],
	),
	suppliercredits_mark_void: createElorusOperation(
		'v12.suppliercredits_mark_void',
		elorusOperationSchemas['v12.suppliercredits_mark_void'],
	),
	'suppliercredits_applied-credit_list': createElorusOperation(
		'v12.suppliercredits_applied-credit_list',
		elorusOperationSchemas['v12.suppliercredits_applied-credit_list'],
	),
	'suppliercredits_applied-credit_create': createElorusOperation(
		'v12.suppliercredits_applied-credit_create',
		elorusOperationSchemas['v12.suppliercredits_applied-credit_create'],
	),
	'suppliercredits_applied-credit_delete': createElorusOperation(
		'v12.suppliercredits_applied-credit_delete',
		elorusOperationSchemas['v12.suppliercredits_applied-credit_delete'],
	),
	suppliercredits_attachments_list: createElorusOperation(
		'v12.suppliercredits_attachments_list',
		elorusOperationSchemas['v12.suppliercredits_attachments_list'],
	),
	suppliercredits_attachments_create: createElorusOperation(
		'v12.suppliercredits_attachments_create',
		elorusOperationSchemas['v12.suppliercredits_attachments_create'],
	),
	suppliercredits_attachments_read: createElorusOperation(
		'v12.suppliercredits_attachments_read',
		elorusOperationSchemas['v12.suppliercredits_attachments_read'],
	),
	suppliercredits_attachments_partial_update: createElorusOperation(
		'v12.suppliercredits_attachments_partial_update',
		elorusOperationSchemas['v12.suppliercredits_attachments_partial_update'],
	),
	suppliercredits_attachments_delete: createElorusOperation(
		'v12.suppliercredits_attachments_delete',
		elorusOperationSchemas['v12.suppliercredits_attachments_delete'],
	),
	suppliercredits_attachments_file: createElorusOperation(
		'v12.suppliercredits_attachments_file',
		elorusOperationSchemas['v12.suppliercredits_attachments_file'],
	),
	suppliercredits_notes_list: createElorusOperation(
		'v12.suppliercredits_notes_list',
		elorusOperationSchemas['v12.suppliercredits_notes_list'],
	),
	suppliercredits_notes_create: createElorusOperation(
		'v12.suppliercredits_notes_create',
		elorusOperationSchemas['v12.suppliercredits_notes_create'],
	),
	suppliercredits_notes_update: createElorusOperation(
		'v12.suppliercredits_notes_update',
		elorusOperationSchemas['v12.suppliercredits_notes_update'],
	),
	suppliercredits_notes_delete: createElorusOperation(
		'v12.suppliercredits_notes_delete',
		elorusOperationSchemas['v12.suppliercredits_notes_delete'],
	),
	'suppliercredits_sent-email-messages_list': createElorusOperation(
		'v12.suppliercredits_sent-email-messages_list',
		elorusOperationSchemas['v12.suppliercredits_sent-email-messages_list'],
	),
	tasks_list: createElorusOperation(
		'v12.tasks_list',
		elorusOperationSchemas['v12.tasks_list'],
	),
	tasks_create: createElorusOperation(
		'v12.tasks_create',
		elorusOperationSchemas['v12.tasks_create'],
	),
	tasks_read: createElorusOperation(
		'v12.tasks_read',
		elorusOperationSchemas['v12.tasks_read'],
	),
	tasks_update: createElorusOperation(
		'v12.tasks_update',
		elorusOperationSchemas['v12.tasks_update'],
	),
	tasks_delete: createElorusOperation(
		'v12.tasks_delete',
		elorusOperationSchemas['v12.tasks_delete'],
	),
	taxes_list: createElorusOperation(
		'v12.taxes_list',
		elorusOperationSchemas['v12.taxes_list'],
	),
	taxes_read: createElorusOperation(
		'v12.taxes_read',
		elorusOperationSchemas['v12.taxes_read'],
	),
	templates_list: createElorusOperation(
		'v12.templates_list',
		elorusOperationSchemas['v12.templates_list'],
	),
	templates_read: createElorusOperation(
		'v12.templates_read',
		elorusOperationSchemas['v12.templates_read'],
	),
	timeentries_list: createElorusOperation(
		'v12.timeentries_list',
		elorusOperationSchemas['v12.timeentries_list'],
	),
	timeentries_create: createElorusOperation(
		'v12.timeentries_create',
		elorusOperationSchemas['v12.timeentries_create'],
	),
	timeentries_read: createElorusOperation(
		'v12.timeentries_read',
		elorusOperationSchemas['v12.timeentries_read'],
	),
	timeentries_update: createElorusOperation(
		'v12.timeentries_update',
		elorusOperationSchemas['v12.timeentries_update'],
	),
	timeentries_delete: createElorusOperation(
		'v12.timeentries_delete',
		elorusOperationSchemas['v12.timeentries_delete'],
	),
	timeentries_mark_billed: createElorusOperation(
		'v12.timeentries_mark_billed',
		elorusOperationSchemas['v12.timeentries_mark_billed'],
	),
	timeentries_mark_unbilled: createElorusOperation(
		'v12.timeentries_mark_unbilled',
		elorusOperationSchemas['v12.timeentries_mark_unbilled'],
	),
	trackingcategories_list: createElorusOperation(
		'v12.trackingcategories_list',
		elorusOperationSchemas['v12.trackingcategories_list'],
	),
	trackingcategories_read: createElorusOperation(
		'v12.trackingcategories_read',
		elorusOperationSchemas['v12.trackingcategories_read'],
	),
	unitofmeasurement_list: createElorusOperation(
		'v12.unitofmeasurement_list',
		elorusOperationSchemas['v12.unitofmeasurement_list'],
	),
	unitofmeasurement_create: createElorusOperation(
		'v12.unitofmeasurement_create',
		elorusOperationSchemas['v12.unitofmeasurement_create'],
	),
	unitofmeasurement_read: createElorusOperation(
		'v12.unitofmeasurement_read',
		elorusOperationSchemas['v12.unitofmeasurement_read'],
	),
	unitofmeasurement_update: createElorusOperation(
		'v12.unitofmeasurement_update',
		elorusOperationSchemas['v12.unitofmeasurement_update'],
	),
	unitofmeasurement_partial_update: createElorusOperation(
		'v12.unitofmeasurement_partial_update',
		elorusOperationSchemas['v12.unitofmeasurement_partial_update'],
	),
	unitofmeasurement_delete: createElorusOperation(
		'v12.unitofmeasurement_delete',
		elorusOperationSchemas['v12.unitofmeasurement_delete'],
	),
	users_list: createElorusOperation(
		'v12.users_list',
		elorusOperationSchemas['v12.users_list'],
	),
	userteams_list: createElorusOperation(
		'v12.userteams_list',
		elorusOperationSchemas['v12.userteams_list'],
	),
	warehouse_list: createElorusOperation(
		'v12.warehouse_list',
		elorusOperationSchemas['v12.warehouse_list'],
	),
	warehouse_create: createElorusOperation(
		'v12.warehouse_create',
		elorusOperationSchemas['v12.warehouse_create'],
	),
	warehouse_read: createElorusOperation(
		'v12.warehouse_read',
		elorusOperationSchemas['v12.warehouse_read'],
	),
	warehouse_update: createElorusOperation(
		'v12.warehouse_update',
		elorusOperationSchemas['v12.warehouse_update'],
	),
	warehouse_partial_update: createElorusOperation(
		'v12.warehouse_partial_update',
		elorusOperationSchemas['v12.warehouse_partial_update'],
	),
	warehouse_delete: createElorusOperation(
		'v12.warehouse_delete',
		elorusOperationSchemas['v12.warehouse_delete'],
	),
} as const;

export const ElorusEndpoints = {
	v11: v11Endpoints,
	v12: v12Endpoints,
} as const;
