import { z } from 'zod';

// ==========================================
// Common & Reusable Schemas
// ==========================================

export const PageSortSchema = z.object({
	property: z.string().optional(),
	direction: z.string().optional(),
	ignoreCase: z.boolean().optional(),
	nullHandling: z.string().optional(),
	ascending: z.boolean().optional(),
});

export const ResourceMutationResponseSchema = z.object({
	id: z.string(),
	resourceUri: z.string().optional(),
	createdDate: z.string().optional(),
	updatedDate: z.string().optional(),
	version: z.number().optional(),
});
export type ResourceMutationResponse = z.infer<
	typeof ResourceMutationResponseSchema
>;

// ==========================================
// Contacts Schemas
// ==========================================

export const ContactAddressSchema = z.object({
	name: z.string().optional(),
	supplement: z.string().optional(),
	street: z.string().optional(),
	city: z.string().optional(),
	zip: z.string().optional(),
	countryCode: z.string(),
});
export type ContactAddress = z.infer<typeof ContactAddressSchema>;

export const ContactPersonSchema = z.object({
	salutation: z.string().optional(),
	firstName: z.string().optional(),
	lastName: z.string(),
	primary: z.boolean().optional(),
	emailAddress: z.string().optional(),
	phoneNumber: z.string().optional(),
});
export type ContactPerson = z.infer<typeof ContactPersonSchema>;

export const ContactCompanySchema = z.object({
	name: z.string(),
	taxNumber: z.string().optional(),
	vatRegistrationId: z.string().optional(),
	allowTaxFreeInvoices: z.boolean().optional(),
	contactPersons: z.array(ContactPersonSchema).optional(),
});
export type ContactCompany = z.infer<typeof ContactCompanySchema>;

export const ContactRoleCustomerSchema = z.object({
	number: z.number().int().optional(),
});

export const ContactRoleVendorSchema = z.object({
	number: z.number().int().optional(),
});

export const ContactRolesSchema = z.object({
	customer: ContactRoleCustomerSchema.optional(),
	vendor: ContactRoleVendorSchema.optional(),
});
export type ContactRoles = z.infer<typeof ContactRolesSchema>;

export const ContactSchema = z.object({
	id: z.string(),
	organizationId: z.string().optional(),
	version: z.number(),
	roles: ContactRolesSchema.optional(),
	person: z
		.object({
			salutation: z.string().optional(),
			firstName: z.string().optional(),
			lastName: z.string(),
		})
		.optional(),
	company: ContactCompanySchema.optional(),
	addresses: z
		.object({
			billing: z.array(ContactAddressSchema).optional(),
			shipping: z.array(ContactAddressSchema).optional(),
		})
		.optional(),
	emailAddresses: z
		.object({
			business: z.array(z.string()).optional(),
			office: z.array(z.string()).optional(),
			private: z.array(z.string()).optional(),
			other: z.array(z.string()).optional(),
		})
		.optional(),
	phoneNumbers: z
		.object({
			business: z.array(z.string()).optional(),
			office: z.array(z.string()).optional(),
			mobile: z.array(z.string()).optional(),
			private: z.array(z.string()).optional(),
			fax: z.array(z.string()).optional(),
			other: z.array(z.string()).optional(),
		})
		.optional(),
	note: z.string().optional(),
	archived: z.boolean().optional(),
});
export type Contact = z.infer<typeof ContactSchema>;

export const ContactsListInputSchema = z
	.object({
		email: z.string().optional(),
		name: z.string().optional(),
		number: z.number().int().optional(),
		customer: z.boolean().optional(),
		vendor: z.boolean().optional(),
		page: z.number().int().min(0).optional(),
		size: z.number().int().min(1).max(250).optional(),
	})
	.strict();
export type ContactsListInput = z.infer<typeof ContactsListInputSchema>;

export const ContactsListResponseSchema = z.object({
	content: z.array(ContactSchema),
	first: z.boolean(),
	last: z.boolean(),
	totalPages: z.number(),
	totalElements: z.number(),
	numberOfElements: z.number(),
	size: z.number(),
	number: z.number(),
	sort: z.array(PageSortSchema).optional(),
});
export type ContactsListResponse = z.infer<typeof ContactsListResponseSchema>;

export const ContactsGetInputSchema = z
	.object({
		id: z.string().min(1, 'Contact ID is required'),
	})
	.strict();
export type ContactsGetInput = z.infer<typeof ContactsGetInputSchema>;

export const ContactCreateInputSchema = z
	.object({
		version: z.number().int().default(0),
		roles: ContactRolesSchema,
		person: z
			.object({
				salutation: z.string().optional(),
				firstName: z.string().optional(),
				lastName: z.string(),
			})
			.optional(),
		company: ContactCompanySchema.optional(),
		addresses: z
			.object({
				billing: z.array(ContactAddressSchema).optional(),
				shipping: z.array(ContactAddressSchema).optional(),
			})
			.optional(),
		emailAddresses: z
			.object({
				business: z.array(z.string()).optional(),
				office: z.array(z.string()).optional(),
				private: z.array(z.string()).optional(),
				other: z.array(z.string()).optional(),
			})
			.optional(),
		phoneNumbers: z
			.object({
				business: z.array(z.string()).optional(),
				office: z.array(z.string()).optional(),
				mobile: z.array(z.string()).optional(),
				private: z.array(z.string()).optional(),
				fax: z.array(z.string()).optional(),
				other: z.array(z.string()).optional(),
			})
			.optional(),
		note: z.string().optional(),
		archived: z.boolean().optional(),
	})
	.strict();
export type ContactCreateInput = z.infer<typeof ContactCreateInputSchema>;

export const ContactUpdateInputSchema = z
	.object({
		id: z.string().min(1, 'Contact ID is required'),
		version: z.number().int(),
		roles: ContactRolesSchema,
		person: z
			.object({
				salutation: z.string().optional(),
				firstName: z.string().optional(),
				lastName: z.string(),
			})
			.optional(),
		company: ContactCompanySchema.optional(),
		addresses: z
			.object({
				billing: z.array(ContactAddressSchema).optional(),
				shipping: z.array(ContactAddressSchema).optional(),
			})
			.optional(),
		emailAddresses: z
			.object({
				business: z.array(z.string()).optional(),
				office: z.array(z.string()).optional(),
				private: z.array(z.string()).optional(),
				other: z.array(z.string()).optional(),
			})
			.optional(),
		phoneNumbers: z
			.object({
				business: z.array(z.string()).optional(),
				office: z.array(z.string()).optional(),
				mobile: z.array(z.string()).optional(),
				private: z.array(z.string()).optional(),
				fax: z.array(z.string()).optional(),
				other: z.array(z.string()).optional(),
			})
			.optional(),
		note: z.string().optional(),
		archived: z.boolean().optional(),
	})
	.strict();
export type ContactUpdateInput = z.infer<typeof ContactUpdateInputSchema>;

// ==========================================
// Invoices Schemas
// ==========================================

export const LineItemSchema = z.object({
	id: z.string().optional(),
	type: z.string(),
	name: z.string(),
	description: z.string().optional(),
	quantity: z.number().optional(),
	unitName: z.string().optional(),
	unitPrice: z
		.object({
			currency: z.string(),
			netAmount: z.number(),
			grossAmount: z.number().optional(),
			taxRatePercentage: z.number(),
		})
		.optional(),
	discountPercentage: z.number().optional(),
	lineItemAmount: z.number().optional(),
});
export type LineItem = z.infer<typeof LineItemSchema>;

export const TaxAmountSchema = z.object({
	taxRatePercentage: z.number(),
	taxAmount: z.number(),
	netAmount: z.number(),
});

export const InvoicesListInputSchema = z
	.object({
		page: z.number().int().min(0).optional(),
		size: z.number().int().min(1).max(250).optional(),
	})
	.strict();
export type InvoicesListInput = z.infer<typeof InvoicesListInputSchema>;

export const InvoiceSummarySchema = z.object({
	id: z.string(),
	voucherStatus: z.string(),
	voucherNumber: z.string().optional(),
	voucherDate: z.string(),
	createdDate: z.string().optional(),
	updatedDate: z.string().optional(),
	dueDate: z.string().nullable().optional(),
	address: z
		.object({
			name: z.string().optional(),
			city: z.string().optional(),
			countryCode: z.string().optional(),
			contactId: z.string().optional(),
		})
		.optional(),
	totalPrice: z
		.object({
			currency: z.string(),
			totalNetAmount: z.number().optional(),
			totalGrossAmount: z.number().optional(),
			totalTaxAmount: z.number().optional(),
		})
		.optional(),
});
export type InvoiceSummary = z.infer<typeof InvoiceSummarySchema>;

export const InvoicesListResponseSchema = z.object({
	content: z.array(InvoiceSummarySchema),
	first: z.boolean(),
	last: z.boolean(),
	totalPages: z.number(),
	totalElements: z.number(),
	numberOfElements: z.number(),
	size: z.number(),
	number: z.number(),
	sort: z.array(PageSortSchema).optional(),
});
export type InvoicesListResponse = z.infer<typeof InvoicesListResponseSchema>;

export const InvoicesGetInputSchema = z
	.object({
		id: z.string().min(1, 'Invoice ID is required'),
	})
	.strict();
export type InvoicesGetInput = z.infer<typeof InvoicesGetInputSchema>;

export const InvoiceDetailsSchema = z.object({
	id: z.string(),
	organizationId: z.string().optional(),
	createdDate: z.string().optional(),
	updatedDate: z.string().optional(),
	version: z.number(),
	language: z.string().optional(),
	archived: z.boolean().optional(),
	voucherStatus: z.string(),
	voucherNumber: z.string().optional(),
	voucherDate: z.string(),
	dueDate: z.string().nullable().optional(),
	address: z
		.object({
			contactId: z.string().optional(),
			name: z.string().optional(),
			supplement: z.string().optional(),
			street: z.string().optional(),
			city: z.string().optional(),
			zip: z.string().optional(),
			countryCode: z.string().optional(),
		})
		.optional(),
	lineItems: z.array(LineItemSchema).optional(),
	totalPrice: z.object({
		currency: z.string(),
		totalNetAmount: z.number().optional(),
		totalGrossAmount: z.number().optional(),
		totalTaxAmount: z.number().optional(),
	}),
	taxAmounts: z.array(TaxAmountSchema).optional(),
	taxConditions: z
		.object({
			taxType: z.string(),
			taxTypeNote: z.string().optional(),
		})
		.optional(),
	title: z.string().optional(),
	introduction: z.string().optional(),
	remark: z.string().optional(),
	files: z
		.object({
			documentFileId: z.string().optional(),
		})
		.optional(),
});
export type InvoiceDetails = z.infer<typeof InvoiceDetailsSchema>;

export const InvoiceCreateLineItemSchema = z
	.object({
		type: z.enum(['custom', 'text']),
		name: z.string(),
		description: z.string().optional(),
		quantity: z.number().positive().optional(),
		unitName: z.string().optional(),
		unitPrice: z
			.object({
				currency: z.string().length(3),
				netAmount: z.number(),
				grossAmount: z.number().optional(),
				taxRatePercentage: z.number().min(0),
			})
			.optional(),
		discountPercentage: z.number().min(0).max(100).optional(),
	})
	.strict();

export const InvoiceCreateInputSchema = z
	.object({
		finalize: z.boolean().optional(),
		voucherDate: z.string().min(1, 'voucherDate is required'),
		address: z
			.object({
				contactId: z.string().optional(),
				name: z.string().optional(),
				supplement: z.string().optional(),
				street: z.string().optional(),
				city: z.string().optional(),
				zip: z.string().optional(),
				countryCode: z.string().length(2).optional(),
			})
			.strict(),
		lineItems: z.array(InvoiceCreateLineItemSchema).min(1),
		totalPrice: z
			.object({
				currency: z.string().length(3),
			})
			.strict(),
		taxConditions: z
			.object({
				taxType: z.enum(['net', 'gross', 'vatfree']),
				taxTypeNote: z.string().optional(),
			})
			.strict(),
		title: z.string().optional(),
		introduction: z.string().optional(),
		remark: z.string().optional(),
		shippingConditions: z
			.object({
				shippingDate: z.string().optional(),
				shippingType: z.enum(['service', 'delivery']).optional(),
			})
			.strict()
			.optional(),
	})
	.strict();
export type InvoiceCreateInput = z.infer<typeof InvoiceCreateInputSchema>;

export const InvoicesRenderInputSchema = z
	.object({
		id: z.string().min(1, 'Invoice ID is required'),
	})
	.strict();
export type InvoicesRenderInput = z.infer<typeof InvoicesRenderInputSchema>;

export const InvoicesRenderResponseSchema = z.object({
	documentFileId: z.string(),
});
export type InvoicesRenderResponse = z.infer<
	typeof InvoicesRenderResponseSchema
>;

// ==========================================
// Vouchers Schemas
// ==========================================

export const VoucherItemSchema = z.object({
	amount: z.number(),
	taxAmount: z.number().optional(),
	taxRatePercent: z.number(),
	categoryId: z.string(),
});
export type VoucherItem = z.infer<typeof VoucherItemSchema>;

export const VouchersListInputSchema = z
	.object({
		voucherNumber: z.string().optional(),
		page: z.number().int().min(0).optional(),
		size: z.number().int().min(1).max(250).optional(),
	})
	.strict();
export type VouchersListInput = z.infer<typeof VouchersListInputSchema>;

export const VoucherSummarySchema = z.object({
	id: z.string(),
	voucherType: z.string().optional(),
	voucherStatus: z.string().optional(),
	voucherNumber: z.string().optional(),
	voucherDate: z.string(),
	totalAmount: z.number().optional(),
	currency: z.string().optional(),
	createdDate: z.string().optional(),
	updatedDate: z.string().optional(),
});
export type VoucherSummary = z.infer<typeof VoucherSummarySchema>;

export const VouchersListResponseSchema = z.object({
	content: z.array(VoucherSummarySchema),
	first: z.boolean(),
	last: z.boolean(),
	totalPages: z.number(),
	totalElements: z.number(),
	numberOfElements: z.number(),
	size: z.number(),
	number: z.number(),
	sort: z.array(PageSortSchema).optional(),
});
export type VouchersListResponse = z.infer<typeof VouchersListResponseSchema>;

export const VouchersGetInputSchema = z
	.object({
		id: z.string().min(1, 'Voucher ID is required'),
	})
	.strict();
export type VouchersGetInput = z.infer<typeof VouchersGetInputSchema>;

export const VoucherDetailsSchema = z.object({
	id: z.string(),
	organizationId: z.string().optional(),
	type: z.string(),
	voucherStatus: z.string(),
	voucherNumber: z.string().optional(),
	voucherDate: z.string(),
	dueDate: z.string().nullable().optional(),
	totalNetAmount: z.number().optional(),
	totalGrossAmount: z.number().optional(),
	totalTaxAmount: z.number().optional(),
	taxType: z.string().optional(),
	useCollectiveContact: z.boolean().optional(),
	contactId: z.string().optional(),
	contactName: z.string().optional(),
	remark: z.string().optional(),
	voucherItems: z.array(VoucherItemSchema),
	files: z
		.array(
			z.object({
				id: z.string().optional(),
			}),
		)
		.optional(),
	version: z.number(),
});
export type VoucherDetails = z.infer<typeof VoucherDetailsSchema>;

export const VoucherCreateItemSchema = z
	.object({
		amount: z.number(),
		taxAmount: z.number().optional(),
		taxRatePercent: z.number(),
		categoryId: z.string().min(1, 'categoryId is required'),
	})
	.strict();

export const VoucherCreateInputSchema = z
	.object({
		type: z.enum([
			'salesinvoice',
			'salescreditnote',
			'purchaseinvoice',
			'purchasecreditnote',
		]),
		voucherNumber: z.string().optional(),
		voucherDate: z.string().min(1, 'voucherDate is required'),
		dueDate: z.string().optional(),
		totalNetAmount: z.number(),
		totalGrossAmount: z.number(),
		taxType: z.enum(['net', 'gross', 'vatfree']),
		useCollectiveContact: z.boolean().optional(),
		contactId: z.string().optional(),
		remark: z.string().optional(),
		voucherItems: z.array(VoucherCreateItemSchema).min(1),
		version: z.number().int().default(0),
	})
	.strict();
export type VoucherCreateInput = z.infer<typeof VoucherCreateInputSchema>;

// ==========================================
// Profile Schemas
// ==========================================

export const ProfileGetInputSchema = z.object({}).strict();
export type ProfileGetInput = z.infer<typeof ProfileGetInputSchema>;

export const ProfileGetResponseSchema = z.object({
	organizationId: z.string(),
	companyName: z.string().optional(),
	created: z
		.object({
			userId: z.string().optional(),
			userName: z.string().optional(),
			userEmail: z.string().optional(),
		})
		.optional(),
	connectionId: z.string().optional(),
});
export type ProfileGetResponse = z.infer<typeof ProfileGetResponseSchema>;

// ==========================================
// Credit Notes Schemas
// ==========================================

export const CreditNotesListInputSchema = z
	.object({
		page: z.number().int().min(0).optional(),
		size: z.number().int().min(1).max(250).optional(),
	})
	.strict();
export type CreditNotesListInput = z.infer<typeof CreditNotesListInputSchema>;

export const CreditNoteSummarySchema = z.object({
	id: z.string(),
	voucherStatus: z.string(),
	voucherNumber: z.string().optional(),
	voucherDate: z.string(),
	createdDate: z.string().optional(),
	updatedDate: z.string().optional(),
	address: z
		.object({
			name: z.string().optional(),
			city: z.string().optional(),
			countryCode: z.string().optional(),
			contactId: z.string().optional(),
		})
		.optional(),
	totalPrice: z
		.object({
			currency: z.string(),
			totalNetAmount: z.number().optional(),
			totalGrossAmount: z.number().optional(),
			totalTaxAmount: z.number().optional(),
		})
		.optional(),
});
export type CreditNoteSummary = z.infer<typeof CreditNoteSummarySchema>;

export const CreditNotesListResponseSchema = z.object({
	content: z.array(CreditNoteSummarySchema),
	first: z.boolean(),
	last: z.boolean(),
	totalPages: z.number(),
	totalElements: z.number(),
	numberOfElements: z.number(),
	size: z.number(),
	number: z.number(),
	sort: z.array(PageSortSchema).optional(),
});
export type CreditNotesListResponse = z.infer<
	typeof CreditNotesListResponseSchema
>;

export const CreditNotesGetInputSchema = z
	.object({
		id: z.string().min(1, 'Credit note ID is required'),
	})
	.strict();
export type CreditNotesGetInput = z.infer<typeof CreditNotesGetInputSchema>;

export const CreditNoteDetailsSchema = z.object({
	id: z.string(),
	organizationId: z.string().optional(),
	createdDate: z.string().optional(),
	updatedDate: z.string().optional(),
	version: z.number(),
	language: z.string().optional(),
	archived: z.boolean().optional(),
	voucherStatus: z.string(),
	voucherNumber: z.string().optional(),
	voucherDate: z.string(),
	address: z
		.object({
			contactId: z.string().optional(),
			name: z.string().optional(),
			supplement: z.string().optional(),
			street: z.string().optional(),
			city: z.string().optional(),
			zip: z.string().optional(),
			countryCode: z.string().optional(),
		})
		.optional(),
	lineItems: z.array(LineItemSchema).optional(),
	totalPrice: z.object({
		currency: z.string(),
		totalNetAmount: z.number().optional(),
		totalGrossAmount: z.number().optional(),
		totalTaxAmount: z.number().optional(),
	}),
	taxAmounts: z.array(TaxAmountSchema).optional(),
	taxConditions: z
		.object({
			taxType: z.string(),
			taxTypeNote: z.string().optional(),
		})
		.optional(),
	title: z.string().optional(),
	introduction: z.string().optional(),
	remark: z.string().optional(),
	files: z
		.object({
			documentFileId: z.string().optional(),
		})
		.optional(),
});
export type CreditNoteDetails = z.infer<typeof CreditNoteDetailsSchema>;

// ==========================================
// Endpoint Schemas Mappings
// ==========================================

export const LexofficeEndpointInputSchemas = {
	contactsList: ContactsListInputSchema,
	contactsGet: ContactsGetInputSchema,
	contactsCreate: ContactCreateInputSchema,
	contactsUpdate: ContactUpdateInputSchema,
	invoicesList: InvoicesListInputSchema,
	invoicesGet: InvoicesGetInputSchema,
	invoicesCreate: InvoiceCreateInputSchema,
	invoicesRender: InvoicesRenderInputSchema,
	vouchersList: VouchersListInputSchema,
	vouchersGet: VouchersGetInputSchema,
	vouchersCreate: VoucherCreateInputSchema,
	profileGet: ProfileGetInputSchema,
	creditNotesList: CreditNotesListInputSchema,
	creditNotesGet: CreditNotesGetInputSchema,
} as const;

export const LexofficeEndpointOutputSchemas = {
	contactsList: ContactsListResponseSchema,
	contactsGet: ContactSchema,
	contactsCreate: ResourceMutationResponseSchema,
	contactsUpdate: ResourceMutationResponseSchema,
	invoicesList: InvoicesListResponseSchema,
	invoicesGet: InvoiceDetailsSchema,
	invoicesCreate: ResourceMutationResponseSchema,
	invoicesRender: InvoicesRenderResponseSchema,
	vouchersList: VouchersListResponseSchema,
	vouchersGet: VoucherDetailsSchema,
	vouchersCreate: ResourceMutationResponseSchema,
	profileGet: ProfileGetResponseSchema,
	creditNotesList: CreditNotesListResponseSchema,
	creditNotesGet: CreditNoteDetailsSchema,
} as const;

export type LexofficeEndpointInputs = {
	contactsList: ContactsListInput;
	contactsGet: ContactsGetInput;
	contactsCreate: ContactCreateInput;
	contactsUpdate: ContactUpdateInput;
	invoicesList: InvoicesListInput;
	invoicesGet: InvoicesGetInput;
	invoicesCreate: InvoiceCreateInput;
	invoicesRender: InvoicesRenderInput;
	vouchersList: VouchersListInput;
	vouchersGet: VouchersGetInput;
	vouchersCreate: VoucherCreateInput;
	profileGet: ProfileGetInput;
	creditNotesList: CreditNotesListInput;
	creditNotesGet: CreditNotesGetInput;
};

export type LexofficeEndpointOutputs = {
	contactsList: ContactsListResponse;
	contactsGet: Contact;
	contactsCreate: ResourceMutationResponse;
	contactsUpdate: ResourceMutationResponse;
	invoicesList: InvoicesListResponse;
	invoicesGet: InvoiceDetails;
	invoicesCreate: ResourceMutationResponse;
	invoicesRender: InvoicesRenderResponse;
	vouchersList: VouchersListResponse;
	vouchersGet: VoucherDetails;
	vouchersCreate: ResourceMutationResponse;
	profileGet: ProfileGetResponse;
	creditNotesList: CreditNotesListResponse;
	creditNotesGet: CreditNoteDetails;
};
