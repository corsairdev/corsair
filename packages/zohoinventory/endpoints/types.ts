import { z } from 'zod';

const orgId = z
	.string()
	.describe('Zoho Inventory organization_id (query on every org-scoped call).');

export const PageContextSchema = z
	.object({
		page: z.number().optional(),
		per_page: z.number().optional(),
		has_more_page: z.boolean().optional(),
		report_name: z.string().optional(),
		applied_filter: z.string().optional(),
		sort_column: z.string().optional(),
		sort_order: z.string().optional(),
	})
	.passthrough();

const envelope = <T extends z.ZodRawShape>(shape: T) =>
	z
		.object({
			code: z.number().optional(),
			message: z.string().optional(),
			...shape,
		})
		.passthrough();

const pageQuery = {
	organization_id: orgId,
	page: z.number().optional(),
	per_page: z.number().optional(),
	search_text: z.string().optional(),
};

const lineItem = z
	.object({
		item_id: z.coerce.string().optional(),
		name: z.string().optional(),
		description: z.string().optional(),
		rate: z.number().optional(),
		quantity: z.number().optional(),
		unit: z.string().optional(),
		tax_id: z.coerce.string().optional(),
	})
	.passthrough();

export const OrganizationSchema = z
	.object({
		organization_id: z.coerce.string(),
		name: z.string(),
		is_default_org: z.boolean().optional(),
		contact_name: z.string().optional(),
		email: z.string().optional(),
		is_org_active: z.boolean().optional(),
		currency_code: z.string().optional(),
		currency_id: z.coerce.string().optional(),
		currency_symbol: z.string().optional(),
		time_zone: z.string().optional(),
		language_code: z.string().optional(),
		fiscal_year_start_month: z.number().optional(),
	})
	.passthrough();

export const ItemSchema = z
	.object({
		item_id: z.coerce.string(),
		name: z.string(),
		sku: z.string().optional(),
		status: z.string().optional(),
		rate: z.number().optional(),
		purchase_rate: z.number().optional(),
		item_type: z.string().optional(),
		product_type: z.string().optional(),
		stock_on_hand: z.number().optional(),
		available_stock: z.number().optional(),
		description: z.string().optional(),
	})
	.passthrough();

export const ContactSchema = z
	.object({
		contact_id: z.coerce.string(),
		contact_name: z.string(),
		company_name: z.string().optional(),
		contact_type: z.string().optional(),
		status: z.string().optional(),
		email: z.string().optional(),
		currency_code: z.string().optional(),
		outstanding_receivable_amount: z.number().optional(),
		outstanding_payable_amount: z.number().optional(),
	})
	.passthrough();

export const SalesOrderSchema = z
	.object({
		salesorder_id: z.coerce.string(),
		salesorder_number: z.string().optional(),
		customer_id: z.coerce.string().optional(),
		customer_name: z.string().optional(),
		status: z.string().optional(),
		date: z.string().optional(),
		total: z.number().optional(),
	})
	.passthrough();

export const InvoiceSchema = z
	.object({
		invoice_id: z.coerce.string(),
		invoice_number: z.string().optional(),
		customer_id: z.coerce.string().optional(),
		customer_name: z.string().optional(),
		status: z.string().optional(),
		date: z.string().optional(),
		total: z.number().optional(),
		balance: z.number().optional(),
	})
	.passthrough();

export const CreditNoteSchema = z
	.object({
		creditnote_id: z.coerce.string(),
		creditnote_number: z.string().optional(),
		customer_id: z.coerce.string().optional(),
		status: z.string().optional(),
		total: z.number().optional(),
		balance: z.number().optional(),
	})
	.passthrough();

export const UserSchema = z
	.object({
		user_id: z.coerce.string(),
		name: z.string(),
		email: z.string(),
		user_role: z.string().optional(),
		status: z.string().optional(),
		is_current_user: z.boolean().optional(),
	})
	.passthrough();

const actionResponse = envelope({});
const pdfResponse = envelope({
	content_type: z.string().optional(),
	content_base64: z.string().optional(),
});

const emailBody = {
	to_mail_ids: z.array(z.string()).optional(),
	cc_mail_ids: z.array(z.string()).optional(),
	subject: z.string().optional(),
	body: z.string().optional(),
};

export const ZohoInventoryEndpointInputSchemas = {
	organizationsList: z.object({}).passthrough(),
	itemsList: z.object({ ...pageQuery }).passthrough(),
	itemsCreate: z
		.object({ organization_id: orgId, name: z.string() })
		.passthrough(),
	itemsDeactivate: z
		.object({ organization_id: orgId, item_id: z.string() })
		.passthrough(),
	itemsDelete: z
		.object({ organization_id: orgId, item_id: z.string() })
		.passthrough(),
	itemsDeleteImage: z
		.object({ organization_id: orgId, item_id: z.string() })
		.passthrough(),
	itemGroupsList: z.object({ ...pageQuery }).passthrough(),
	itemGroupsCreate: z
		.object({ organization_id: orgId, group_name: z.string() })
		.passthrough(),
	itemGroupsDeactivate: z
		.object({ organization_id: orgId, itemgroup_id: z.string() })
		.passthrough(),
	itemGroupsDelete: z
		.object({ organization_id: orgId, itemgroup_id: z.string() })
		.passthrough(),
	compositeItemsDelete: z
		.object({ organization_id: orgId, composite_item_id: z.string() })
		.passthrough(),
	contactsList: z
		.object({
			...pageQuery,
			contact_type: z.enum(['customer', 'vendor', 'all']).optional(),
		})
		.passthrough(),
	contactsCreate: z
		.object({ organization_id: orgId, contact_name: z.string() })
		.passthrough(),
	contactsGet: z
		.object({ organization_id: orgId, contact_id: z.string() })
		.passthrough(),
	contactsGetAddress: z
		.object({ organization_id: orgId, contact_id: z.string() })
		.passthrough(),
	contactsDeactivate: z
		.object({ organization_id: orgId, contact_id: z.string() })
		.passthrough(),
	contactsDelete: z
		.object({ organization_id: orgId, contact_id: z.string() })
		.passthrough(),
	contactsEmail: z
		.object({ organization_id: orgId, contact_id: z.string(), ...emailBody })
		.passthrough(),
	contactsEmailStatement: z
		.object({ organization_id: orgId, contact_id: z.string(), ...emailBody })
		.passthrough(),
	contactsCreatePerson: z
		.object({
			organization_id: orgId,
			contact_id: z.string(),
			first_name: z.string().optional(),
			last_name: z.string().optional(),
			email: z.string().optional(),
		})
		.passthrough(),
	contactsDeletePerson: z
		.object({ organization_id: orgId, contact_person_id: z.string() })
		.passthrough(),
	currenciesList: z.object({ organization_id: orgId }).passthrough(),
	usersGetCurrent: z.object({ organization_id: orgId }).passthrough(),
	salesOrdersList: z.object({ ...pageQuery }).passthrough(),
	salesOrdersGet: z
		.object({ organization_id: orgId, salesorder_id: z.string() })
		.passthrough(),
	salesOrdersCreate: z
		.object({
			organization_id: orgId,
			customer_id: z.string(),
			line_items: z.array(lineItem).optional(),
		})
		.passthrough(),
	salesOrdersDelete: z
		.object({ organization_id: orgId, salesorder_id: z.string() })
		.passthrough(),
	salesOrdersBulkDelete: z
		.object({
			organization_id: orgId,
			salesorder_ids: z.array(z.string()).min(1),
		})
		.passthrough(),
	invoicesList: z.object({ ...pageQuery }).passthrough(),
	invoicesCreate: z
		.object({
			organization_id: orgId,
			customer_id: z.string(),
			line_items: z.array(lineItem).optional(),
		})
		.passthrough(),
	invoicesDelete: z
		.object({ organization_id: orgId, invoice_id: z.string() })
		.passthrough(),
	invoicesAddComment: z
		.object({
			organization_id: orgId,
			invoice_id: z.string(),
			description: z.string(),
			show_comment_to_clients: z.boolean().optional(),
		})
		.passthrough(),
	invoicesDeleteComment: z
		.object({
			organization_id: orgId,
			invoice_id: z.string(),
			comment_id: z.string(),
		})
		.passthrough(),
	invoicesAddAttachment: z
		.object({
			organization_id: orgId,
			invoice_id: z.string(),
			filename: z.string(),
			content_base64: z.string(),
			content_type: z.string().optional(),
		})
		.passthrough(),
	invoicesDeleteAttachment: z
		.object({ organization_id: orgId, invoice_id: z.string() })
		.passthrough(),
	invoicesEmail: z
		.object({ organization_id: orgId, invoice_id: z.string(), ...emailBody })
		.passthrough(),
	invoicesBulkEmail: z
		.object({
			organization_id: orgId,
			invoice_ids: z.array(z.string()).min(1).max(10),
			contact_id: z.string().optional(),
		})
		.passthrough(),
	invoicesBulkExport: z
		.object({
			organization_id: orgId,
			invoice_ids: z.array(z.string()).min(1),
		})
		.passthrough(),
	invoicesBulkPrint: z
		.object({
			organization_id: orgId,
			invoice_ids: z.array(z.string()).min(1).max(25),
		})
		.passthrough(),
	invoicesCancelWriteOff: z
		.object({ organization_id: orgId, invoice_id: z.string() })
		.passthrough(),
	invoicesDisablePaymentReminder: z
		.object({ organization_id: orgId, invoice_id: z.string() })
		.passthrough(),
	invoicesEnablePaymentReminder: z
		.object({ organization_id: orgId, invoice_id: z.string() })
		.passthrough(),
	invoicesListPayments: z
		.object({ organization_id: orgId, invoice_id: z.string() })
		.passthrough(),
	creditNotesList: z
		.object({
			...pageQuery,
			status: z.string().optional(),
			customer_id: z.string().optional(),
		})
		.passthrough(),
	creditNotesGet: z
		.object({ organization_id: orgId, creditnote_id: z.string() })
		.passthrough(),
	creditNotesCreate: z
		.object({
			organization_id: orgId,
			customer_id: z.string(),
			line_items: z.array(lineItem).optional(),
		})
		.passthrough(),
	creditNotesAddComment: z
		.object({
			organization_id: orgId,
			creditnote_id: z.string(),
			description: z.string(),
		})
		.passthrough(),
	creditNotesEmail: z
		.object({
			organization_id: orgId,
			creditnote_id: z.string(),
			...emailBody,
		})
		.passthrough(),
	creditNotesGetEmailContent: z
		.object({ organization_id: orgId, creditnote_id: z.string() })
		.passthrough(),
	creditNotesApplyCredits: z
		.object({
			organization_id: orgId,
			creditnote_id: z.string(),
			invoices: z.array(
				z
					.object({
						invoice_id: z.string(),
						amount_applied: z.number(),
					})
					.passthrough(),
			),
		})
		.passthrough(),
	packagesCreate: z
		.object({
			organization_id: orgId,
			salesorder_id: z.string(),
			line_items: z.array(lineItem).optional(),
		})
		.passthrough(),
	packagesDelete: z
		.object({ organization_id: orgId, package_id: z.string() })
		.passthrough(),
	packagesBulkPrint: z
		.object({
			organization_id: orgId,
			package_ids: z.array(z.string()).min(1),
		})
		.passthrough(),
	purchaseOrdersList: z.object({ ...pageQuery }).passthrough(),
	purchaseOrdersCreate: z
		.object({
			organization_id: orgId,
			vendor_id: z.string(),
			line_items: z.array(lineItem).optional(),
		})
		.passthrough(),
	billsList: z.object({ ...pageQuery }).passthrough(),
	billsCreate: z
		.object({
			organization_id: orgId,
			vendor_id: z.string(),
			line_items: z.array(lineItem).optional(),
		})
		.passthrough(),
	customerPaymentsCreate: z
		.object({
			organization_id: orgId,
			customer_id: z.string(),
			amount: z.number(),
			invoices: z
				.array(
					z
						.object({
							invoice_id: z.string(),
							amount_applied: z.number().optional(),
						})
						.passthrough(),
				)
				.optional(),
		})
		.passthrough(),
} as const;

export const ZohoInventoryEndpointOutputSchemas = {
	organizationsList: envelope({ organizations: z.array(OrganizationSchema) }),
	itemsList: envelope({
		items: z.array(ItemSchema),
		page_context: PageContextSchema.optional(),
	}),
	itemsCreate: envelope({ item: ItemSchema.optional() }),
	itemsDeactivate: actionResponse,
	itemsDelete: actionResponse,
	itemsDeleteImage: actionResponse,
	itemGroupsList: envelope({
		itemgroups: z.array(z.object({}).passthrough()),
		page_context: PageContextSchema.optional(),
	}),
	itemGroupsCreate: envelope({
		itemgroup: z.object({}).passthrough().optional(),
	}),
	itemGroupsDeactivate: actionResponse,
	itemGroupsDelete: actionResponse,
	compositeItemsDelete: actionResponse,
	contactsList: envelope({
		contacts: z.array(ContactSchema),
		page_context: PageContextSchema.optional(),
	}),
	contactsCreate: envelope({ contact: ContactSchema.optional() }),
	contactsGet: envelope({ contact: ContactSchema.optional() }),
	contactsGetAddress: envelope({}).passthrough(),
	contactsDeactivate: actionResponse,
	contactsDelete: actionResponse,
	contactsEmail: actionResponse,
	contactsEmailStatement: actionResponse,
	contactsCreatePerson: envelope({
		contact_person: z.object({}).passthrough().optional(),
	}),
	contactsDeletePerson: actionResponse,
	currenciesList: envelope({ currencies: z.array(z.object({}).passthrough()) }),
	usersGetCurrent: envelope({ user: UserSchema.optional() }),
	salesOrdersList: envelope({
		salesorders: z.array(SalesOrderSchema),
		page_context: PageContextSchema.optional(),
	}),
	salesOrdersGet: envelope({ salesorder: SalesOrderSchema.optional() }),
	salesOrdersCreate: envelope({ salesorder: SalesOrderSchema.optional() }),
	salesOrdersDelete: actionResponse,
	salesOrdersBulkDelete: actionResponse,
	invoicesList: envelope({
		invoices: z.array(InvoiceSchema),
		page_context: PageContextSchema.optional(),
	}),
	invoicesCreate: envelope({ invoice: InvoiceSchema.optional() }),
	invoicesDelete: actionResponse,
	invoicesAddComment: envelope({
		comment: z.object({}).passthrough().optional(),
	}),
	invoicesDeleteComment: actionResponse,
	invoicesAddAttachment: actionResponse,
	invoicesDeleteAttachment: actionResponse,
	invoicesEmail: actionResponse,
	invoicesBulkEmail: actionResponse,
	invoicesBulkExport: pdfResponse,
	invoicesBulkPrint: pdfResponse,
	invoicesCancelWriteOff: actionResponse,
	invoicesDisablePaymentReminder: actionResponse,
	invoicesEnablePaymentReminder: actionResponse,
	invoicesListPayments: envelope({
		payments: z.array(z.object({}).passthrough()),
	}),
	creditNotesList: envelope({
		creditnotes: z.array(CreditNoteSchema),
		page_context: PageContextSchema.optional(),
	}),
	creditNotesGet: envelope({ creditnote: CreditNoteSchema.optional() }),
	creditNotesCreate: envelope({ creditnote: CreditNoteSchema.optional() }),
	creditNotesAddComment: envelope({
		comment: z.object({}).passthrough().optional(),
	}),
	creditNotesEmail: actionResponse,
	creditNotesGetEmailContent: envelope({}).passthrough(),
	creditNotesApplyCredits: actionResponse,
	packagesCreate: envelope({ package: z.object({}).passthrough().optional() }),
	packagesDelete: actionResponse,
	packagesBulkPrint: pdfResponse,
	purchaseOrdersList: envelope({
		purchaseorders: z.array(z.object({}).passthrough()),
		page_context: PageContextSchema.optional(),
	}),
	purchaseOrdersCreate: envelope({
		purchaseorder: z.object({}).passthrough().optional(),
	}),
	billsList: envelope({
		bills: z.array(z.object({}).passthrough()),
		page_context: PageContextSchema.optional(),
	}),
	billsCreate: envelope({ bill: z.object({}).passthrough().optional() }),
	customerPaymentsCreate: envelope({
		payment: z.object({}).passthrough().optional(),
	}),
} as const;

export type ZohoInventoryEndpointInputs = {
	[K in keyof typeof ZohoInventoryEndpointInputSchemas]: z.infer<
		(typeof ZohoInventoryEndpointInputSchemas)[K]
	>;
};

export type ZohoInventoryEndpointOutputs = {
	[K in keyof typeof ZohoInventoryEndpointOutputSchemas]: z.infer<
		(typeof ZohoInventoryEndpointOutputSchemas)[K]
	>;
};
