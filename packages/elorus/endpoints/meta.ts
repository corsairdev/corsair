import type { ElorusOperationKey } from './types';

export const elorusEndpointMeta = {
	'v11.bills_list': {
		riskLevel: 'read',
		description: 'Get the list of bills.',
	},
	'v11.bills_create': { riskLevel: 'write', description: 'Create a new bill.' },
	'v11.bills_read': { riskLevel: 'read', description: 'Get a single bill.' },
	'v11.bills_update': { riskLevel: 'write', description: 'Update a bill.' },
	'v11.bills_partial_update': {
		riskLevel: 'write',
		description: 'Partially update a bill.',
	},
	'v11.bills_delete': {
		riskLevel: 'destructive',
		description: 'Delete a bill.',
	},
	'v11.bills_email_from_template': {
		riskLevel: 'destructive',
		description:
			"The subject and message are rendered from the template resolved via templateid, or the organization's default template if not provided.",
	},
	'v11.bills_email_read': {
		riskLevel: 'read',
		description: 'Get the default document email fields.',
	},
	'v11.bills_email_create': {
		riskLevel: 'destructive',
		description: 'Send the document by email.',
	},
	'v11.bills_pdf': {
		riskLevel: 'read',
		description: 'Get the document as PDF.',
	},
	'v11.bills_mark_void': {
		riskLevel: 'destructive',
		description:
			'Mark the document as void or convert it from "void" back to "issued".',
	},
	'v11.cashpayments_list': {
		riskLevel: 'read',
		description: 'Get the list of payments sent. ---',
	},
	'v11.cashpayments_create': {
		riskLevel: 'write',
		description: 'Create a new payment sent.',
	},
	'v11.cashpayments_read': {
		riskLevel: 'read',
		description: 'Get a single payment sent.',
	},
	'v11.cashpayments_update': {
		riskLevel: 'write',
		description: 'Update a payment sent.',
	},
	'v11.cashpayments_delete': {
		riskLevel: 'destructive',
		description: 'Delete a payment sent.',
	},
	'v11.cashpayments_pdf': {
		riskLevel: 'read',
		description: 'Get the document as PDF.',
	},
	'v11.cashreceipts_list': {
		riskLevel: 'read',
		description: 'Get the list of payments received.',
	},
	'v11.cashreceipts_create': {
		riskLevel: 'write',
		description: 'Create a new payment received.',
	},
	'v11.cashreceipts_read': {
		riskLevel: 'read',
		description: 'Get a single payment received.',
	},
	'v11.cashreceipts_update': {
		riskLevel: 'write',
		description: 'Update a payment received.',
	},
	'v11.cashreceipts_delete': {
		riskLevel: 'destructive',
		description: 'Delete a payment received.',
	},
	'v11.cashreceipts_pdf': {
		riskLevel: 'read',
		description: 'Get the document as PDF.',
	},
	'v11.contacts_list': {
		riskLevel: 'read',
		description: 'Get the list of contacts',
	},
	'v11.contacts_create': {
		riskLevel: 'write',
		description: 'Create a new contact.',
	},
	'v11.contacts_read': {
		riskLevel: 'read',
		description: 'Get the details of a single contact.',
	},
	'v11.contacts_update': {
		riskLevel: 'write',
		description: 'Update a contact.',
	},
	'v11.contacts_delete': {
		riskLevel: 'destructive',
		description: 'Delete a contact.',
	},
	'v11.creditnotes_list': {
		riskLevel: 'read',
		description: 'Get the list of credit notes.',
	},
	'v11.creditnotes_create': {
		riskLevel: 'write',
		description: 'Create a new credit note.',
	},
	'v11.creditnotes_read': {
		riskLevel: 'read',
		description: 'Get a single credit note.',
	},
	'v11.creditnotes_update': {
		riskLevel: 'write',
		description: 'Update a credit note.',
	},
	'v11.creditnotes_partial_update': {
		riskLevel: 'write',
		description: 'Partially update a credit note.',
	},
	'v11.creditnotes_delete': {
		riskLevel: 'destructive',
		description: 'Delete a credit note.',
	},
	'v11.creditnotes_email_from_template': {
		riskLevel: 'destructive',
		description:
			"The subject and message are rendered from the template resolved via templateid, or the organization's default template if not provided.",
	},
	'v11.creditnotes_email_read': {
		riskLevel: 'read',
		description: 'Get the default document email fields.',
	},
	'v11.creditnotes_email_create': {
		riskLevel: 'destructive',
		description: 'Send the document by email.',
	},
	'v11.creditnotes_pdf': {
		riskLevel: 'read',
		description: 'Get the document as PDF.',
	},
	'v11.creditnotes_mark_void': {
		riskLevel: 'destructive',
		description:
			'Mark the document as void or convert it from "void" back to "issued".',
	},
	'v11.creditnotes_applied-credit_list': {
		riskLevel: 'read',
		description: 'Get the applied credit.',
	},
	'v11.creditnotes_applied-credit_create': {
		riskLevel: 'write',
		description: 'Bulk apply credit.',
	},
	'v11.creditnotes_applied-credit_delete': {
		riskLevel: 'destructive',
		description: 'Delete applied credit.',
	},
	'v11.documenttypes_list': {
		riskLevel: 'read',
		description: 'Get the list of document types. ---',
	},
	'v11.documenttypes_read': {
		riskLevel: 'read',
		description: 'Get a single document type. ---',
	},
	'v11.emailtemplates_list': {
		riskLevel: 'read',
		description: 'Get the list of email templates. ---',
	},
	'v11.emailtemplates_create': {
		riskLevel: 'write',
		description: 'Create an email template. ---',
	},
	'v11.emailtemplates_read': {
		riskLevel: 'read',
		description: 'Get a single email template. ---',
	},
	'v11.emailtemplates_update': {
		riskLevel: 'write',
		description: 'Update an email template. ---',
	},
	'v11.emailtemplates_delete': {
		riskLevel: 'destructive',
		description: 'Destroy an email template. ---',
	},
	'v11.estimates_list': {
		riskLevel: 'read',
		description: 'Get the list of estimates.',
	},
	'v11.estimates_create': {
		riskLevel: 'write',
		description: 'Create a new estimate.',
	},
	'v11.estimates_read': {
		riskLevel: 'read',
		description: 'Get a single estimate.',
	},
	'v11.estimates_update': {
		riskLevel: 'write',
		description: 'Update an estimate.',
	},
	'v11.estimates_partial_update': {
		riskLevel: 'write',
		description: 'Partially update an estimate.',
	},
	'v11.estimates_delete': {
		riskLevel: 'destructive',
		description: 'Delete an estimate.',
	},
	'v11.estimates_email_from_template': {
		riskLevel: 'destructive',
		description:
			"The subject and message are rendered from the template resolved via templateid, or the organization's default template if not provided.",
	},
	'v11.estimates_email_read': {
		riskLevel: 'read',
		description: 'Get the default document email fields.',
	},
	'v11.estimates_email_create': {
		riskLevel: 'destructive',
		description: 'Send the document by email.',
	},
	'v11.estimates_pdf': {
		riskLevel: 'read',
		description: 'Get the document as PDF.',
	},
	'v11.expensecategories_list': {
		riskLevel: 'read',
		description: 'Get the list of expense categories. ---',
	},
	'v11.expensecategories_read': {
		riskLevel: 'read',
		description: 'Get a single expense category. ---',
	},
	'v11.expenses_list': {
		riskLevel: 'read',
		description: 'Get the list of expenses.',
	},
	'v11.expenses_create': {
		riskLevel: 'write',
		description: 'Create a new expense.',
	},
	'v11.expenses_read': {
		riskLevel: 'read',
		description: 'Get a single expense.',
	},
	'v11.expenses_update': {
		riskLevel: 'write',
		description:
			'To update the line items, the endpoint expects that you send a complete list of the new items. For existing lines you must send over their IDs (as returned by the retrieve endpoint',
	},
	'v11.expenses_delete': {
		riskLevel: 'destructive',
		description: 'Delete an expense. ---',
	},
	'v11.invoices_list': {
		riskLevel: 'read',
		description: 'Get the list of invoices.',
	},
	'v11.invoices_create': {
		riskLevel: 'write',
		description: 'Create a new invoice.',
	},
	'v11.invoices_read': {
		riskLevel: 'read',
		description: 'Get a single invoice.',
	},
	'v11.invoices_update': {
		riskLevel: 'write',
		description: 'Update an invoice.',
	},
	'v11.invoices_partial_update': {
		riskLevel: 'write',
		description: 'Partially update an invoice.',
	},
	'v11.invoices_delete': {
		riskLevel: 'destructive',
		description: 'Delete an invoice.',
	},
	'v11.invoices_email_from_template': {
		riskLevel: 'destructive',
		description:
			"The subject and message are rendered from the template resolved via templateid, or the organization's default template if not provided.",
	},
	'v11.invoices_email_read': {
		riskLevel: 'read',
		description: 'Get the default document email fields.',
	},
	'v11.invoices_email_create': {
		riskLevel: 'destructive',
		description: 'Send the document by email.',
	},
	'v11.invoices_pdf': {
		riskLevel: 'read',
		description: 'Get the document as PDF.',
	},
	'v11.invoices_mark_void': {
		riskLevel: 'destructive',
		description:
			'Mark the document as void or convert it from "void" back to "issued".',
	},
	'v11.invoices_applied-credit_list': {
		riskLevel: 'read',
		description: 'Get the applied credit.',
	},
	'v11.invoices_applied-credit_create': {
		riskLevel: 'write',
		description: 'Bulk apply credit.',
	},
	'v11.invoices_applied-credit_delete': {
		riskLevel: 'destructive',
		description: 'Delete applied credit.',
	},
	'v11.numberingsequence_list': {
		riskLevel: 'read',
		description: 'Get the list of numbering sequences. ---',
	},
	'v11.numberingsequence_create': {
		riskLevel: 'write',
		description: 'Create a numbering sequence. ---',
	},
	'v11.numberingsequence_read': {
		riskLevel: 'read',
		description: 'Get a single numbering sequence. ---',
	},
	'v11.numberingsequence_update': {
		riskLevel: 'write',
		description: 'Update a numbering sequence. ---',
	},
	'v11.numberingsequence_delete': {
		riskLevel: 'destructive',
		description: 'Delete a numbering sequence.',
	},
	'v11.paymentgateways_list': {
		riskLevel: 'read',
		description: 'Get the list of payment gateways. ---',
	},
	'v11.products_list': {
		riskLevel: 'read',
		description: 'Get the list of products / services.',
	},
	'v11.products_create': {
		riskLevel: 'write',
		description: 'Create a new product / service. ---',
	},
	'v11.products_read': {
		riskLevel: 'read',
		description: 'Get a single product / service.',
	},
	'v11.products_update': {
		riskLevel: 'write',
		description: 'Update a product / service.',
	},
	'v11.products_delete': {
		riskLevel: 'destructive',
		description: 'Delete a product / service.',
	},
	'v11.projects_list': {
		riskLevel: 'read',
		description: 'Get the list of projects. ---',
	},
	'v11.projects_read': {
		riskLevel: 'read',
		description: 'Get a single project. ---',
	},
	'v11.recurringinvoices_list': {
		riskLevel: 'read',
		description: 'Get the list of recurring invoices.',
	},
	'v11.recurringinvoices_create': {
		riskLevel: 'write',
		description: 'Create a new recurring invoice.',
	},
	'v11.recurringinvoices_read': {
		riskLevel: 'read',
		description: 'Get a single recurring invoice.',
	},
	'v11.recurringinvoices_update': {
		riskLevel: 'write',
		description:
			'When changing the invoice client, all client fields will be updated based on the new contact record, unless you explicitly specify their values.',
	},
	'v11.recurringinvoices_delete': {
		riskLevel: 'destructive',
		description: 'Delete a recurring invoice.',
	},
	'v11.suppliercredits_list': {
		riskLevel: 'read',
		description: 'Get the list of supplier credits.',
	},
	'v11.suppliercredits_create': {
		riskLevel: 'write',
		description: 'Create a new supplier credit.',
	},
	'v11.suppliercredits_read': {
		riskLevel: 'read',
		description: 'Get a single supplier credit.',
	},
	'v11.suppliercredits_update': {
		riskLevel: 'write',
		description: 'Update a supplier credit.',
	},
	'v11.suppliercredits_partial_update': {
		riskLevel: 'write',
		description: 'Partially update a supplier credit.',
	},
	'v11.suppliercredits_delete': {
		riskLevel: 'destructive',
		description: 'Delete a supplier credit.',
	},
	'v11.suppliercredits_email_from_template': {
		riskLevel: 'destructive',
		description:
			"The subject and message are rendered from the template resolved via templateid, or the organization's default template if not provided.",
	},
	'v11.suppliercredits_email_read': {
		riskLevel: 'read',
		description: 'Get the default document email fields.',
	},
	'v11.suppliercredits_email_create': {
		riskLevel: 'destructive',
		description: 'Send the document by email.',
	},
	'v11.suppliercredits_pdf': {
		riskLevel: 'read',
		description: 'Get the document as PDF.',
	},
	'v11.suppliercredits_mark_void': {
		riskLevel: 'destructive',
		description:
			'Mark the document as void or convert it from "void" back to "issued".',
	},
	'v11.suppliercredits_applied-credit_list': {
		riskLevel: 'read',
		description: 'Get the applied credit.',
	},
	'v11.suppliercredits_applied-credit_create': {
		riskLevel: 'write',
		description: 'Bulk apply credit.',
	},
	'v11.suppliercredits_applied-credit_delete': {
		riskLevel: 'destructive',
		description: 'Delete applied credit.',
	},
	'v11.taxes_list': {
		riskLevel: 'read',
		description: 'Get the list of taxes. ---',
	},
	'v11.taxes_read': { riskLevel: 'read', description: 'Get a single tax. ---' },
	'v11.templates_list': {
		riskLevel: 'read',
		description: 'Get the list of templates. ---',
	},
	'v11.templates_read': {
		riskLevel: 'read',
		description: 'Get a single template. ---',
	},
	'v11.trackingcategories_list': {
		riskLevel: 'read',
		description: 'Get the list of tracking categories. ---',
	},
	'v11.trackingcategories_read': {
		riskLevel: 'read',
		description: 'Get a single tracking category. ---',
	},
	'v11.warehouse_list': {
		riskLevel: 'read',
		description: 'Get the list of warehouses. ---',
	},
	'v11.warehouse_create': {
		riskLevel: 'write',
		description: 'Create a warehouse. ---',
	},
	'v11.warehouse_read': {
		riskLevel: 'read',
		description: 'Get a single warehouse. ---',
	},
	'v11.warehouse_update': {
		riskLevel: 'write',
		description: 'Update a warehouse. ---',
	},
	'v11.warehouse_partial_update': {
		riskLevel: 'write',
		description: 'Partially update a warehouse. ---',
	},
	'v11.warehouse_delete': {
		riskLevel: 'destructive',
		description: 'Delete a warehouse. ---',
	},
	'v12.bills_list': {
		riskLevel: 'read',
		description: 'Get the list of bills.',
	},
	'v12.bills_create': { riskLevel: 'write', description: 'Create a new bill.' },
	'v12.bills_read': { riskLevel: 'read', description: 'Get a single bill.' },
	'v12.bills_update': { riskLevel: 'write', description: 'Update a bill.' },
	'v12.bills_partial_update': {
		riskLevel: 'write',
		description: 'Partially update a bill.',
	},
	'v12.bills_delete': {
		riskLevel: 'destructive',
		description: 'Delete a bill.',
	},
	'v12.bills_email_from_template': {
		riskLevel: 'destructive',
		description:
			"The subject and message are rendered from the template resolved via templateid, or the organization's default template if not provided.",
	},
	'v12.bills_email_read': {
		riskLevel: 'read',
		description: 'Get the default document email fields.',
	},
	'v12.bills_email_create': {
		riskLevel: 'destructive',
		description: 'Send the document by email.',
	},
	'v12.bills_pdf': {
		riskLevel: 'read',
		description: 'Get the document as PDF.',
	},
	'v12.bills_mark_void': {
		riskLevel: 'destructive',
		description:
			'Mark the document as void or convert it from "void" back to "issued".',
	},
	'v12.bills_attachments_list': {
		riskLevel: 'read',
		description: 'Get the list of attachments.',
	},
	'v12.bills_attachments_create': {
		riskLevel: 'write',
		description: 'Create a new attachment.',
	},
	'v12.bills_attachments_read': {
		riskLevel: 'read',
		description: 'Get a single attachment. ---',
	},
	'v12.bills_attachments_partial_update': {
		riskLevel: 'write',
		description: 'Partially update an attachment.',
	},
	'v12.bills_attachments_delete': {
		riskLevel: 'destructive',
		description: 'Delete an attachment. ---',
	},
	'v12.bills_attachments_file': {
		riskLevel: 'read',
		description: 'Get the actual attachment file.',
	},
	'v12.bills_notes_list': {
		riskLevel: 'read',
		description: 'Get the list of private notes.',
	},
	'v12.bills_notes_create': {
		riskLevel: 'write',
		description: 'Create a new private note. ---',
	},
	'v12.bills_notes_update': {
		riskLevel: 'write',
		description: 'Update a private note.',
	},
	'v12.bills_notes_delete': {
		riskLevel: 'destructive',
		description: 'Delete a private note.',
	},
	'v12.bills_sent-email-messages_list': {
		riskLevel: 'read',
		description: 'Get the list of tracked email messages for this document.',
	},
	'v12.cashpayments_list': {
		riskLevel: 'read',
		description: 'Get the list of payments sent. ---',
	},
	'v12.cashpayments_create': {
		riskLevel: 'write',
		description: 'Create a new payment sent.',
	},
	'v12.cashpayments_read': {
		riskLevel: 'read',
		description: 'Get a single payment sent.',
	},
	'v12.cashpayments_update': {
		riskLevel: 'write',
		description: 'Update a payment sent.',
	},
	'v12.cashpayments_delete': {
		riskLevel: 'destructive',
		description: 'Delete a payment sent.',
	},
	'v12.cashpayments_pdf': {
		riskLevel: 'read',
		description: 'Get the document as PDF.',
	},
	'v12.cashpayments_attachments_list': {
		riskLevel: 'read',
		description: 'Get the list of attachments.',
	},
	'v12.cashpayments_attachments_create': {
		riskLevel: 'write',
		description: 'Create a new attachment.',
	},
	'v12.cashpayments_attachments_read': {
		riskLevel: 'read',
		description: 'Get a single attachment. ---',
	},
	'v12.cashpayments_attachments_partial_update': {
		riskLevel: 'write',
		description: 'Partially update an attachment.',
	},
	'v12.cashpayments_attachments_delete': {
		riskLevel: 'destructive',
		description: 'Delete an attachment. ---',
	},
	'v12.cashpayments_attachments_file': {
		riskLevel: 'read',
		description: 'Get the actual attachment file.',
	},
	'v12.cashpayments_notes_list': {
		riskLevel: 'read',
		description: 'Get the list of private notes.',
	},
	'v12.cashpayments_notes_create': {
		riskLevel: 'write',
		description: 'Create a new private note. ---',
	},
	'v12.cashpayments_notes_update': {
		riskLevel: 'write',
		description: 'Update a private note.',
	},
	'v12.cashpayments_notes_delete': {
		riskLevel: 'destructive',
		description: 'Delete a private note.',
	},
	'v12.cashreceipts_list': {
		riskLevel: 'read',
		description: 'Get the list of payments received.',
	},
	'v12.cashreceipts_create': {
		riskLevel: 'write',
		description: 'Create a new payment received.',
	},
	'v12.cashreceipts_read': {
		riskLevel: 'read',
		description: 'Get a single payment received.',
	},
	'v12.cashreceipts_update': {
		riskLevel: 'write',
		description: 'Update a payment received.',
	},
	'v12.cashreceipts_delete': {
		riskLevel: 'destructive',
		description: 'Delete a payment received.',
	},
	'v12.cashreceipts_pdf': {
		riskLevel: 'read',
		description: 'Get the document as PDF.',
	},
	'v12.cashreceipts_attachments_list': {
		riskLevel: 'read',
		description: 'Get the list of attachments.',
	},
	'v12.cashreceipts_attachments_create': {
		riskLevel: 'write',
		description: 'Create a new attachment.',
	},
	'v12.cashreceipts_attachments_read': {
		riskLevel: 'read',
		description: 'Get a single attachment. ---',
	},
	'v12.cashreceipts_attachments_partial_update': {
		riskLevel: 'write',
		description: 'Partially update an attachment.',
	},
	'v12.cashreceipts_attachments_delete': {
		riskLevel: 'destructive',
		description: 'Delete an attachment. ---',
	},
	'v12.cashreceipts_attachments_file': {
		riskLevel: 'read',
		description: 'Get the actual attachment file.',
	},
	'v12.cashreceipts_notes_list': {
		riskLevel: 'read',
		description: 'Get the list of private notes.',
	},
	'v12.cashreceipts_notes_create': {
		riskLevel: 'write',
		description: 'Create a new private note. ---',
	},
	'v12.cashreceipts_notes_update': {
		riskLevel: 'write',
		description: 'Update a private note.',
	},
	'v12.cashreceipts_notes_delete': {
		riskLevel: 'destructive',
		description: 'Delete a private note.',
	},
	'v12.contacts_list': {
		riskLevel: 'read',
		description: 'Get the list of contacts',
	},
	'v12.contacts_create': {
		riskLevel: 'write',
		description: 'Create a new contact.',
	},
	'v12.contacts_read': {
		riskLevel: 'read',
		description: 'Get the details of a single contact.',
	},
	'v12.contacts_update': {
		riskLevel: 'write',
		description: 'Update a contact.',
	},
	'v12.contacts_delete': {
		riskLevel: 'destructive',
		description: 'Delete a contact.',
	},
	'v12.contacts_attachments_list': {
		riskLevel: 'read',
		description: 'Get the list of attachments.',
	},
	'v12.contacts_attachments_create': {
		riskLevel: 'write',
		description: 'Create a new attachment.',
	},
	'v12.contacts_attachments_read': {
		riskLevel: 'read',
		description: 'Get a single attachment. ---',
	},
	'v12.contacts_attachments_partial_update': {
		riskLevel: 'write',
		description: 'Partially update an attachment.',
	},
	'v12.contacts_attachments_delete': {
		riskLevel: 'destructive',
		description: 'Delete an attachment. ---',
	},
	'v12.contacts_attachments_file': {
		riskLevel: 'read',
		description: 'Get the actual attachment file.',
	},
	'v12.contacts_notes_list': {
		riskLevel: 'read',
		description: 'Get the list of private notes.',
	},
	'v12.contacts_notes_create': {
		riskLevel: 'write',
		description: 'Create a new private note. ---',
	},
	'v12.contacts_notes_update': {
		riskLevel: 'write',
		description: 'Update a private note.',
	},
	'v12.contacts_notes_delete': {
		riskLevel: 'destructive',
		description: 'Delete a private note.',
	},
	'v12.creditnotes_list': {
		riskLevel: 'read',
		description: 'Get the list of credit notes.',
	},
	'v12.creditnotes_create': {
		riskLevel: 'write',
		description: 'Create a new credit note.',
	},
	'v12.creditnotes_read': {
		riskLevel: 'read',
		description: 'Get a single credit note.',
	},
	'v12.creditnotes_update': {
		riskLevel: 'write',
		description: 'Update a credit note.',
	},
	'v12.creditnotes_partial_update': {
		riskLevel: 'write',
		description: 'Partially update a credit note.',
	},
	'v12.creditnotes_delete': {
		riskLevel: 'destructive',
		description: 'Delete a credit note.',
	},
	'v12.creditnotes_email_from_template': {
		riskLevel: 'destructive',
		description:
			"The subject and message are rendered from the template resolved via templateid, or the organization's default template if not provided.",
	},
	'v12.creditnotes_email_read': {
		riskLevel: 'read',
		description: 'Get the default document email fields.',
	},
	'v12.creditnotes_email_create': {
		riskLevel: 'destructive',
		description: 'Send the document by email.',
	},
	'v12.creditnotes_pdf': {
		riskLevel: 'read',
		description: 'Get the document as PDF.',
	},
	'v12.creditnotes_mark_void': {
		riskLevel: 'destructive',
		description:
			'Mark the document as void or convert it from "void" back to "issued".',
	},
	'v12.creditnotes_applied-credit_list': {
		riskLevel: 'read',
		description: 'Get the applied credit.',
	},
	'v12.creditnotes_applied-credit_create': {
		riskLevel: 'write',
		description: 'Bulk apply credit.',
	},
	'v12.creditnotes_applied-credit_delete': {
		riskLevel: 'destructive',
		description: 'Delete applied credit.',
	},
	'v12.creditnotes_attachments_list': {
		riskLevel: 'read',
		description: 'Get the list of attachments.',
	},
	'v12.creditnotes_attachments_create': {
		riskLevel: 'write',
		description: 'Create a new attachment.',
	},
	'v12.creditnotes_attachments_read': {
		riskLevel: 'read',
		description: 'Get a single attachment. ---',
	},
	'v12.creditnotes_attachments_partial_update': {
		riskLevel: 'write',
		description: 'Partially update an attachment.',
	},
	'v12.creditnotes_attachments_delete': {
		riskLevel: 'destructive',
		description: 'Delete an attachment. ---',
	},
	'v12.creditnotes_attachments_file': {
		riskLevel: 'read',
		description: 'Get the actual attachment file.',
	},
	'v12.creditnotes_discussions_list': {
		riskLevel: 'read',
		description: 'Get the client discussion.',
	},
	'v12.creditnotes_discussions_create': {
		riskLevel: 'write',
		description: 'Create a new discussion message.',
	},
	'v12.creditnotes_discussions_update': {
		riskLevel: 'write',
		description: 'Update a discussion message.',
	},
	'v12.creditnotes_discussions_delete': {
		riskLevel: 'destructive',
		description: 'Delete a discussion message.',
	},
	'v12.creditnotes_notes_list': {
		riskLevel: 'read',
		description: 'Get the list of private notes.',
	},
	'v12.creditnotes_notes_create': {
		riskLevel: 'write',
		description: 'Create a new private note. ---',
	},
	'v12.creditnotes_notes_update': {
		riskLevel: 'write',
		description: 'Update a private note.',
	},
	'v12.creditnotes_notes_delete': {
		riskLevel: 'destructive',
		description: 'Delete a private note.',
	},
	'v12.creditnotes_sent-email-messages_list': {
		riskLevel: 'read',
		description: 'Get the list of tracked email messages for this document.',
	},
	'v12.deliverynotes_list': {
		riskLevel: 'read',
		description: 'Get the list of delivery notes.',
	},
	'v12.deliverynotes_create': {
		riskLevel: 'write',
		description: 'Create a new delivery note.',
	},
	'v12.deliverynotes_read': {
		riskLevel: 'read',
		description: 'Get a single delivery note.',
	},
	'v12.deliverynotes_update': {
		riskLevel: 'write',
		description: 'Update a delivery note.',
	},
	'v12.deliverynotes_partial_update': {
		riskLevel: 'write',
		description: 'Partially update a delivery note.',
	},
	'v12.deliverynotes_delete': {
		riskLevel: 'destructive',
		description: 'Delete a delivery note.',
	},
	'v12.deliverynotes_email_from_template': {
		riskLevel: 'destructive',
		description:
			"The subject and message are rendered from the template resolved via templateid, or the organization's default template if not provided.",
	},
	'v12.deliverynotes_email_read': {
		riskLevel: 'read',
		description: 'Get the default document email fields.',
	},
	'v12.deliverynotes_email_create': {
		riskLevel: 'destructive',
		description: 'Send the document by email.',
	},
	'v12.deliverynotes_pdf': {
		riskLevel: 'read',
		description: 'Get the document as PDF.',
	},
	'v12.deliverynotes_mark_void': {
		riskLevel: 'destructive',
		description:
			'Mark the document as void or convert it from "void" back to "issued".',
	},
	'v12.deliverynotes_attachments_list': {
		riskLevel: 'read',
		description: 'Get the list of attachments.',
	},
	'v12.deliverynotes_attachments_create': {
		riskLevel: 'write',
		description: 'Create a new attachment.',
	},
	'v12.deliverynotes_attachments_read': {
		riskLevel: 'read',
		description: 'Get a single attachment. ---',
	},
	'v12.deliverynotes_attachments_partial_update': {
		riskLevel: 'write',
		description: 'Partially update an attachment.',
	},
	'v12.deliverynotes_attachments_delete': {
		riskLevel: 'destructive',
		description: 'Delete an attachment. ---',
	},
	'v12.deliverynotes_attachments_file': {
		riskLevel: 'read',
		description: 'Get the actual attachment file.',
	},
	'v12.deliverynotes_notes_list': {
		riskLevel: 'read',
		description: 'Get the list of private notes.',
	},
	'v12.deliverynotes_notes_create': {
		riskLevel: 'write',
		description: 'Create a new private note. ---',
	},
	'v12.deliverynotes_notes_update': {
		riskLevel: 'write',
		description: 'Update a private note.',
	},
	'v12.deliverynotes_notes_delete': {
		riskLevel: 'destructive',
		description: 'Delete a private note.',
	},
	'v12.deliverynotes_sent-email-messages_list': {
		riskLevel: 'read',
		description: 'Get the list of tracked email messages for this document.',
	},
	'v12.documenttypes_list': {
		riskLevel: 'read',
		description: 'Get the list of document types. ---',
	},
	'v12.documenttypes_read': {
		riskLevel: 'read',
		description: 'Get a single document type. ---',
	},
	'v12.documenttypes_sequences_list': {
		riskLevel: 'read',
		description: 'Get the numbering sequences of a document type. ---',
	},
	'v12.documenttypes_sequences_create': {
		riskLevel: 'write',
		description: 'Create a numbering sequence. ---',
	},
	'v12.documenttypes_sequences_delete_sequence': {
		riskLevel: 'destructive',
		description: 'Delete a numbering sequence. ---',
	},
	'v12.documenttypes_sequences_rename_sequence': {
		riskLevel: 'write',
		description: 'Rename a numbering sequence. ---',
	},
	'v12.emailtemplates_list': {
		riskLevel: 'read',
		description: 'Get the list of email templates. ---',
	},
	'v12.emailtemplates_create': {
		riskLevel: 'write',
		description: 'Create an email template. ---',
	},
	'v12.emailtemplates_read': {
		riskLevel: 'read',
		description: 'Get a single email template. ---',
	},
	'v12.emailtemplates_update': {
		riskLevel: 'write',
		description: 'Update an email template. ---',
	},
	'v12.emailtemplates_delete': {
		riskLevel: 'destructive',
		description: 'Destroy an email template. ---',
	},
	'v12.estimates_list': {
		riskLevel: 'read',
		description: 'Get the list of estimates.',
	},
	'v12.estimates_create': {
		riskLevel: 'write',
		description: 'Create a new estimate.',
	},
	'v12.estimates_read': {
		riskLevel: 'read',
		description: 'Get a single estimate.',
	},
	'v12.estimates_update': {
		riskLevel: 'write',
		description: 'Update an estimate.',
	},
	'v12.estimates_partial_update': {
		riskLevel: 'write',
		description: 'Partially update an estimate.',
	},
	'v12.estimates_delete': {
		riskLevel: 'destructive',
		description: 'Delete an estimate.',
	},
	'v12.estimates_email_from_template': {
		riskLevel: 'destructive',
		description:
			"The subject and message are rendered from the template resolved via templateid, or the organization's default template if not provided.",
	},
	'v12.estimates_email_read': {
		riskLevel: 'read',
		description: 'Get the default document email fields.',
	},
	'v12.estimates_email_create': {
		riskLevel: 'destructive',
		description: 'Send the document by email.',
	},
	'v12.estimates_pdf': {
		riskLevel: 'read',
		description: 'Get the document as PDF.',
	},
	'v12.estimates_attachments_list': {
		riskLevel: 'read',
		description: 'Get the list of attachments.',
	},
	'v12.estimates_attachments_create': {
		riskLevel: 'write',
		description: 'Create a new attachment.',
	},
	'v12.estimates_attachments_read': {
		riskLevel: 'read',
		description: 'Get a single attachment. ---',
	},
	'v12.estimates_attachments_partial_update': {
		riskLevel: 'write',
		description: 'Partially update an attachment.',
	},
	'v12.estimates_attachments_delete': {
		riskLevel: 'destructive',
		description: 'Delete an attachment. ---',
	},
	'v12.estimates_attachments_file': {
		riskLevel: 'read',
		description: 'Get the actual attachment file.',
	},
	'v12.estimates_discussions_list': {
		riskLevel: 'read',
		description: 'Get the client discussion.',
	},
	'v12.estimates_discussions_create': {
		riskLevel: 'write',
		description: 'Create a new discussion message.',
	},
	'v12.estimates_discussions_update': {
		riskLevel: 'write',
		description: 'Update a discussion message.',
	},
	'v12.estimates_discussions_delete': {
		riskLevel: 'destructive',
		description: 'Delete a discussion message.',
	},
	'v12.estimates_notes_list': {
		riskLevel: 'read',
		description: 'Get the list of private notes.',
	},
	'v12.estimates_notes_create': {
		riskLevel: 'write',
		description: 'Create a new private note. ---',
	},
	'v12.estimates_notes_update': {
		riskLevel: 'write',
		description: 'Update a private note.',
	},
	'v12.estimates_notes_delete': {
		riskLevel: 'destructive',
		description: 'Delete a private note.',
	},
	'v12.estimates_sent-email-messages_list': {
		riskLevel: 'read',
		description: 'Get the list of tracked email messages for this document.',
	},
	'v12.expensecategories_list': {
		riskLevel: 'read',
		description: 'Get the list of expense categories. ---',
	},
	'v12.expensecategories_read': {
		riskLevel: 'read',
		description: 'Get a single expense category. ---',
	},
	'v12.expenses_list': {
		riskLevel: 'read',
		description: 'Get the list of expenses.',
	},
	'v12.expenses_create': {
		riskLevel: 'write',
		description: 'Create a new expense.',
	},
	'v12.expenses_read': {
		riskLevel: 'read',
		description: 'Get a single expense.',
	},
	'v12.expenses_update': {
		riskLevel: 'write',
		description:
			'To update the line items, the endpoint expects that you send a complete list of the new items. For existing lines you must send over their IDs (as returned by the retrieve endpoint',
	},
	'v12.expenses_delete': {
		riskLevel: 'destructive',
		description: 'Delete an expense. ---',
	},
	'v12.expenses_attachments_list': {
		riskLevel: 'read',
		description: 'Get the list of attachments.',
	},
	'v12.expenses_attachments_create': {
		riskLevel: 'write',
		description: 'Create a new attachment.',
	},
	'v12.expenses_attachments_read': {
		riskLevel: 'read',
		description: 'Get a single attachment. ---',
	},
	'v12.expenses_attachments_partial_update': {
		riskLevel: 'write',
		description: 'Partially update an attachment.',
	},
	'v12.expenses_attachments_delete': {
		riskLevel: 'destructive',
		description: 'Delete an attachment. ---',
	},
	'v12.expenses_attachments_file': {
		riskLevel: 'read',
		description: 'Get the actual attachment file.',
	},
	'v12.expenses_notes_list': {
		riskLevel: 'read',
		description: 'Get the list of private notes.',
	},
	'v12.expenses_notes_create': {
		riskLevel: 'write',
		description: 'Create a new private note. ---',
	},
	'v12.expenses_notes_update': {
		riskLevel: 'write',
		description: 'Update a private note.',
	},
	'v12.expenses_notes_delete': {
		riskLevel: 'destructive',
		description: 'Delete a private note.',
	},
	'v12.goodsreceipts_list': {
		riskLevel: 'read',
		description: 'goodsreceipts list',
	},
	'v12.goodsreceipts_create': {
		riskLevel: 'write',
		description: 'Create a new goods receipt.',
	},
	'v12.goodsreceipts_read': {
		riskLevel: 'read',
		description: 'Get a single goods receipt.',
	},
	'v12.goodsreceipts_update': {
		riskLevel: 'write',
		description: 'Update a goods receipt.',
	},
	'v12.goodsreceipts_partial_update': {
		riskLevel: 'write',
		description: 'Partially update a goods receipt.',
	},
	'v12.goodsreceipts_delete': {
		riskLevel: 'destructive',
		description: 'Delete a goods receipt.',
	},
	'v12.goodsreceipts_email_from_template': {
		riskLevel: 'destructive',
		description:
			"The subject and message are rendered from the template resolved via templateid, or the organization's default template if not provided.",
	},
	'v12.goodsreceipts_email_read': {
		riskLevel: 'read',
		description: 'Get the default document email fields.',
	},
	'v12.goodsreceipts_email_create': {
		riskLevel: 'destructive',
		description: 'Send the document by email.',
	},
	'v12.goodsreceipts_pdf': {
		riskLevel: 'read',
		description: 'Get the document as PDF.',
	},
	'v12.goodsreceipts_mark_void': {
		riskLevel: 'destructive',
		description:
			'Mark the document as void or convert it from "void" back to "issued".',
	},
	'v12.goodsreceipts_notes_list': {
		riskLevel: 'read',
		description: 'Get the list of private notes.',
	},
	'v12.goodsreceipts_notes_create': {
		riskLevel: 'write',
		description: 'Create a new private note. ---',
	},
	'v12.goodsreceipts_notes_update': {
		riskLevel: 'write',
		description: 'Update a private note.',
	},
	'v12.goodsreceipts_notes_delete': {
		riskLevel: 'destructive',
		description: 'Delete a private note.',
	},
	'v12.goodsreceipts_sent-email-messages_list': {
		riskLevel: 'read',
		description: 'Get the list of tracked email messages for this document.',
	},
	'v12.goodsreceiptsequences_list': {
		riskLevel: 'read',
		description: 'Get the list of goods receipt sequences. ---',
	},
	'v12.goodsreceiptsequences_create': {
		riskLevel: 'write',
		description: 'Create a goods receipt sequence. ---',
	},
	'v12.goodsreceiptsequences_delete_sequence': {
		riskLevel: 'destructive',
		description: 'Delete a numbering sequence. ---',
	},
	'v12.goodsreceiptsequences_rename_sequence': {
		riskLevel: 'write',
		description: 'Rename a numbering sequence. ---',
	},
	'v12.invoices_list': {
		riskLevel: 'read',
		description: 'Get the list of invoices.',
	},
	'v12.invoices_create': {
		riskLevel: 'write',
		description: 'Create a new invoice.',
	},
	'v12.invoices_read': {
		riskLevel: 'read',
		description: 'Get a single invoice.',
	},
	'v12.invoices_update': {
		riskLevel: 'write',
		description: 'Update an invoice.',
	},
	'v12.invoices_partial_update': {
		riskLevel: 'write',
		description: 'Partially update an invoice.',
	},
	'v12.invoices_delete': {
		riskLevel: 'destructive',
		description: 'Delete an invoice.',
	},
	'v12.invoices_email_from_template': {
		riskLevel: 'destructive',
		description:
			"The subject and message are rendered from the template resolved via templateid, or the organization's default template if not provided.",
	},
	'v12.invoices_email_read': {
		riskLevel: 'read',
		description: 'Get the default document email fields.',
	},
	'v12.invoices_email_create': {
		riskLevel: 'destructive',
		description: 'Send the document by email.',
	},
	'v12.invoices_pdf': {
		riskLevel: 'read',
		description: 'Get the document as PDF.',
	},
	'v12.invoices_mark_void': {
		riskLevel: 'destructive',
		description:
			'Mark the document as void or convert it from "void" back to "issued".',
	},
	'v12.invoices_applied-credit_list': {
		riskLevel: 'read',
		description: 'Get the applied credit.',
	},
	'v12.invoices_applied-credit_create': {
		riskLevel: 'write',
		description: 'Bulk apply credit.',
	},
	'v12.invoices_applied-credit_delete': {
		riskLevel: 'destructive',
		description: 'Delete applied credit.',
	},
	'v12.invoices_attachments_list': {
		riskLevel: 'read',
		description: 'Get the list of attachments.',
	},
	'v12.invoices_attachments_create': {
		riskLevel: 'write',
		description: 'Create a new attachment.',
	},
	'v12.invoices_attachments_read': {
		riskLevel: 'read',
		description: 'Get a single attachment. ---',
	},
	'v12.invoices_attachments_partial_update': {
		riskLevel: 'write',
		description: 'Partially update an attachment.',
	},
	'v12.invoices_attachments_delete': {
		riskLevel: 'destructive',
		description: 'Delete an attachment. ---',
	},
	'v12.invoices_attachments_file': {
		riskLevel: 'read',
		description: 'Get the actual attachment file.',
	},
	'v12.invoices_discussions_list': {
		riskLevel: 'read',
		description: 'Get the client discussion.',
	},
	'v12.invoices_discussions_create': {
		riskLevel: 'write',
		description: 'Create a new discussion message.',
	},
	'v12.invoices_discussions_update': {
		riskLevel: 'write',
		description: 'Update a discussion message.',
	},
	'v12.invoices_discussions_delete': {
		riskLevel: 'destructive',
		description: 'Delete a discussion message.',
	},
	'v12.invoices_notes_list': {
		riskLevel: 'read',
		description: 'Get the list of private notes.',
	},
	'v12.invoices_notes_create': {
		riskLevel: 'write',
		description: 'Create a new private note. ---',
	},
	'v12.invoices_notes_update': {
		riskLevel: 'write',
		description: 'Update a private note.',
	},
	'v12.invoices_notes_delete': {
		riskLevel: 'destructive',
		description: 'Delete a private note.',
	},
	'v12.invoices_sent-email-messages_list': {
		riskLevel: 'read',
		description: 'Get the list of tracked email messages for this document.',
	},
	'v12.organizationbranch_list': {
		riskLevel: 'read',
		description: 'Get the list of organization branches. ---',
	},
	'v12.organizationbranch_create': {
		riskLevel: 'write',
		description: 'Create an organization branch. ---',
	},
	'v12.organizationbranch_read': {
		riskLevel: 'read',
		description: 'Get a single organization branch. ---',
	},
	'v12.organizationbranch_update': {
		riskLevel: 'write',
		description: 'Update an organization branch. ---',
	},
	'v12.organizationbranch_partial_update': {
		riskLevel: 'write',
		description: 'Partially update an organization branch. ---',
	},
	'v12.organizationbranch_delete': {
		riskLevel: 'destructive',
		description: 'Delete an organization branch. ---',
	},
	'v12.paymentgateways_list': {
		riskLevel: 'read',
		description: 'Get the list of payment gateways. ---',
	},
	'v12.products_list': {
		riskLevel: 'read',
		description: 'Get the list of products / services.',
	},
	'v12.products_create': {
		riskLevel: 'write',
		description: 'Create a new product / service. ---',
	},
	'v12.products_read': {
		riskLevel: 'read',
		description: 'Get a single product / service.',
	},
	'v12.products_update': {
		riskLevel: 'write',
		description: 'Update a product / service.',
	},
	'v12.products_delete': {
		riskLevel: 'destructive',
		description: 'Delete a product / service.',
	},
	'v12.products_notes_list': {
		riskLevel: 'read',
		description: 'Get the list of private notes.',
	},
	'v12.products_notes_create': {
		riskLevel: 'write',
		description: 'Create a new private note. ---',
	},
	'v12.products_notes_update': {
		riskLevel: 'write',
		description: 'Update a private note.',
	},
	'v12.products_notes_delete': {
		riskLevel: 'destructive',
		description: 'Delete a private note.',
	},
	'v12.products_stockadjustments_list': {
		riskLevel: 'read',
		description:
			'Get the list of manual stock adjustments for the product / service.',
	},
	'v12.products_stockadjustments_create': {
		riskLevel: 'write',
		description: 'Create a new stock adjustment.',
	},
	'v12.products_stockadjustments_read': {
		riskLevel: 'read',
		description: 'Get a single manual stock adjustment.',
	},
	'v12.products_stockadjustments_delete': {
		riskLevel: 'destructive',
		description: 'Delete an existing stock adjustment.',
	},
	'v12.projects_list': {
		riskLevel: 'read',
		description: 'Get the list of projects. ---',
	},
	'v12.projects_create': {
		riskLevel: 'write',
		description: 'Create a new project.',
	},
	'v12.projects_read': {
		riskLevel: 'read',
		description: 'Get a single project. ---',
	},
	'v12.projects_update': {
		riskLevel: 'write',
		description: 'Update an existing project. ---',
	},
	'v12.projects_delete': {
		riskLevel: 'destructive',
		description: 'Delete a project. ---',
	},
	'v12.projects_attachments_list': {
		riskLevel: 'read',
		description: 'Get the list of attachments.',
	},
	'v12.projects_attachments_create': {
		riskLevel: 'write',
		description: 'Create a new attachment.',
	},
	'v12.projects_attachments_read': {
		riskLevel: 'read',
		description: 'Get a single attachment. ---',
	},
	'v12.projects_attachments_partial_update': {
		riskLevel: 'write',
		description: 'Partially update an attachment.',
	},
	'v12.projects_attachments_delete': {
		riskLevel: 'destructive',
		description: 'Delete an attachment. ---',
	},
	'v12.projects_attachments_file': {
		riskLevel: 'read',
		description: 'Get the actual attachment file.',
	},
	'v12.projects_discussions_list': {
		riskLevel: 'read',
		description: 'Get the client discussion.',
	},
	'v12.projects_discussions_create': {
		riskLevel: 'write',
		description: 'Create a new discussion message.',
	},
	'v12.projects_discussions_update': {
		riskLevel: 'write',
		description: 'Update a discussion message.',
	},
	'v12.projects_discussions_delete': {
		riskLevel: 'destructive',
		description: 'Delete a discussion message.',
	},
	'v12.projects_notes_list': {
		riskLevel: 'read',
		description: 'Get the list of private notes.',
	},
	'v12.projects_notes_create': {
		riskLevel: 'write',
		description: 'Create a new private note. ---',
	},
	'v12.projects_notes_update': {
		riskLevel: 'write',
		description: 'Update a private note.',
	},
	'v12.projects_notes_delete': {
		riskLevel: 'destructive',
		description: 'Delete a private note.',
	},
	'v12.projects_projectextrafees_list': {
		riskLevel: 'read',
		description: 'Get the list of project extra fees. ---',
	},
	'v12.projects_projectextrafees_create': {
		riskLevel: 'write',
		description: 'Create a new project extra fee. ---',
	},
	'v12.projects_projectextrafees_read': {
		riskLevel: 'read',
		description: 'Get a single project extra fee. ---',
	},
	'v12.projects_projectextrafees_update': {
		riskLevel: 'write',
		description: 'Update a project extra fee. ---',
	},
	'v12.projects_projectextrafees_partial_update': {
		riskLevel: 'write',
		description: 'Partially update a project extra fee. ---',
	},
	'v12.projects_projectextrafees_delete': {
		riskLevel: 'destructive',
		description: 'Delete a project extra fee. ---',
	},
	'v12.recurringinvoices_list': {
		riskLevel: 'read',
		description: 'Get the list of recurring invoices.',
	},
	'v12.recurringinvoices_create': {
		riskLevel: 'write',
		description: 'Create a new recurring invoice.',
	},
	'v12.recurringinvoices_read': {
		riskLevel: 'read',
		description: 'Get a single recurring invoice.',
	},
	'v12.recurringinvoices_update': {
		riskLevel: 'write',
		description:
			'When changing the invoice client, all client fields will be updated based on the new contact record, unless you explicitly specify their values.',
	},
	'v12.recurringinvoices_delete': {
		riskLevel: 'destructive',
		description: 'Delete a recurring invoice.',
	},
	'v12.recurringinvoices_notes_list': {
		riskLevel: 'read',
		description: 'Get the list of private notes.',
	},
	'v12.recurringinvoices_notes_create': {
		riskLevel: 'write',
		description: 'Create a new private note. ---',
	},
	'v12.recurringinvoices_notes_update': {
		riskLevel: 'write',
		description: 'Update a private note.',
	},
	'v12.recurringinvoices_notes_delete': {
		riskLevel: 'destructive',
		description: 'Delete a private note.',
	},
	'v12.suppliercredits_list': {
		riskLevel: 'read',
		description: 'Get the list of supplier credits.',
	},
	'v12.suppliercredits_create': {
		riskLevel: 'write',
		description: 'Create a new supplier credit. ---',
	},
	'v12.suppliercredits_read': {
		riskLevel: 'read',
		description: 'Get a single supplier credit.',
	},
	'v12.suppliercredits_update': {
		riskLevel: 'write',
		description: 'Update a supplier credit.',
	},
	'v12.suppliercredits_partial_update': {
		riskLevel: 'write',
		description:
			'Partially update a supplier credit. Note that you cannot delete supplier credits marked as issued (i.e. the draft field is set to false).',
	},
	'v12.suppliercredits_delete': {
		riskLevel: 'destructive',
		description: 'Delete a supplier credit.',
	},
	'v12.suppliercredits_email_from_template': {
		riskLevel: 'destructive',
		description:
			"The subject and message are rendered from the template resolved via templateid, or the organization's default template if not provided.",
	},
	'v12.suppliercredits_email_read': {
		riskLevel: 'read',
		description: 'Get the default document email fields.',
	},
	'v12.suppliercredits_email_create': {
		riskLevel: 'destructive',
		description: 'Send the document by email.',
	},
	'v12.suppliercredits_pdf': {
		riskLevel: 'read',
		description: 'Get the document as PDF.',
	},
	'v12.suppliercredits_mark_void': {
		riskLevel: 'destructive',
		description:
			'Mark the document as void or convert it from "void" back to "issued".',
	},
	'v12.suppliercredits_applied-credit_list': {
		riskLevel: 'read',
		description: 'Get the applied credit.',
	},
	'v12.suppliercredits_applied-credit_create': {
		riskLevel: 'write',
		description: 'Bulk apply credit.',
	},
	'v12.suppliercredits_applied-credit_delete': {
		riskLevel: 'destructive',
		description: 'Delete applied credit.',
	},
	'v12.suppliercredits_attachments_list': {
		riskLevel: 'read',
		description: 'Get the list of attachments.',
	},
	'v12.suppliercredits_attachments_create': {
		riskLevel: 'write',
		description: 'Create a new attachment.',
	},
	'v12.suppliercredits_attachments_read': {
		riskLevel: 'read',
		description: 'Get a single attachment. ---',
	},
	'v12.suppliercredits_attachments_partial_update': {
		riskLevel: 'write',
		description: 'Partially update an attachment.',
	},
	'v12.suppliercredits_attachments_delete': {
		riskLevel: 'destructive',
		description: 'Delete an attachment. ---',
	},
	'v12.suppliercredits_attachments_file': {
		riskLevel: 'read',
		description: 'Get the actual attachment file.',
	},
	'v12.suppliercredits_notes_list': {
		riskLevel: 'read',
		description: 'Get the list of private notes.',
	},
	'v12.suppliercredits_notes_create': {
		riskLevel: 'write',
		description: 'Create a new private note. ---',
	},
	'v12.suppliercredits_notes_update': {
		riskLevel: 'write',
		description: 'Update a private note.',
	},
	'v12.suppliercredits_notes_delete': {
		riskLevel: 'destructive',
		description: 'Delete a private note.',
	},
	'v12.suppliercredits_sent-email-messages_list': {
		riskLevel: 'read',
		description: 'Get the list of tracked email messages for this document.',
	},
	'v12.tasks_list': {
		riskLevel: 'read',
		description: 'Get the list of tasks. ---',
	},
	'v12.tasks_create': { riskLevel: 'write', description: 'Create a new task.' },
	'v12.tasks_read': {
		riskLevel: 'read',
		description: 'Get a single task. ---',
	},
	'v12.tasks_update': {
		riskLevel: 'write',
		description: 'Update an existing task. ---',
	},
	'v12.tasks_delete': {
		riskLevel: 'destructive',
		description: 'Delete a task. ---',
	},
	'v12.taxes_list': {
		riskLevel: 'read',
		description: 'Get the list of taxes. ---',
	},
	'v12.taxes_read': { riskLevel: 'read', description: 'Get a single tax. ---' },
	'v12.templates_list': {
		riskLevel: 'read',
		description: 'Get the list of templates. ---',
	},
	'v12.templates_read': {
		riskLevel: 'read',
		description: 'Get a single template. ---',
	},
	'v12.timeentries_list': {
		riskLevel: 'read',
		description: 'Get the list of time entries.',
	},
	'v12.timeentries_create': {
		riskLevel: 'write',
		description: 'Create a new time entry.',
	},
	'v12.timeentries_read': {
		riskLevel: 'read',
		description: 'Retrieve an existing time entry.',
	},
	'v12.timeentries_update': {
		riskLevel: 'write',
		description: 'Update an existing time entry.',
	},
	'v12.timeentries_delete': {
		riskLevel: 'destructive',
		description: 'Delete an existing time entry.',
	},
	'v12.timeentries_mark_billed': {
		riskLevel: 'write',
		description:
			'Set a billed time entry as forcibly billed. Ignore already billed time entries.',
	},
	'v12.timeentries_mark_unbilled': {
		riskLevel: 'write',
		description:
			'Set a billed time entry as unbilled. Ignore already unbilled time entries.',
	},
	'v12.trackingcategories_list': {
		riskLevel: 'read',
		description: 'Get the list of tracking categories. ---',
	},
	'v12.trackingcategories_read': {
		riskLevel: 'read',
		description: 'Get a single tracking category. ---',
	},
	'v12.unitofmeasurement_list': {
		riskLevel: 'read',
		description: 'Get list of units of measurement.',
	},
	'v12.unitofmeasurement_create': {
		riskLevel: 'write',
		description: 'Create a new unit of measurement.',
	},
	'v12.unitofmeasurement_read': {
		riskLevel: 'read',
		description: 'Get a single unit of measurement.',
	},
	'v12.unitofmeasurement_update': {
		riskLevel: 'write',
		description: 'Update an existing unit of measurement.',
	},
	'v12.unitofmeasurement_partial_update': {
		riskLevel: 'write',
		description: 'Partially update an existing unit of measurement.',
	},
	'v12.unitofmeasurement_delete': {
		riskLevel: 'destructive',
		description: 'Delete an existing unit of measurement.',
	},
	'v12.users_list': {
		riskLevel: 'read',
		description: 'Get the list of organization users.',
	},
	'v12.userteams_list': {
		riskLevel: 'read',
		description: 'Get the list of user teams. ---',
	},
	'v12.warehouse_list': {
		riskLevel: 'read',
		description: 'Get the list of warehouses. ---',
	},
	'v12.warehouse_create': {
		riskLevel: 'write',
		description: 'Create a warehouse. ---',
	},
	'v12.warehouse_read': {
		riskLevel: 'read',
		description: 'Get a single warehouse. ---',
	},
	'v12.warehouse_update': {
		riskLevel: 'write',
		description: 'Update a warehouse. ---',
	},
	'v12.warehouse_partial_update': {
		riskLevel: 'write',
		description: 'Partially update a warehouse. ---',
	},
	'v12.warehouse_delete': {
		riskLevel: 'destructive',
		description: 'Delete a warehouse. ---',
	},
} as const satisfies Record<
	ElorusOperationKey,
	{ riskLevel: 'read' | 'write' | 'destructive'; description: string }
>;
