import { z } from 'zod';

const EntityLinkInput = z.object({
	id: z.string().optional(),
	name: z.string().optional(),
});

const CustomFieldInput = z.object({
	fieldName: z.string(),
	fieldValue: z.string(),
});

const PageQuery = {
	page: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('Official `Page`. Default 1.'),
	pageSize: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('Official `PageSize`. Default 250.'),
};

const EntityLinkSchema = z
	.object({
		id: z.string().nullable().optional(),
		name: z.string().nullable().optional(),
	})
	.loose();

export const AscoraCustomerSchema = z
	.object({
		customerId: z.string(),
		customerNumber: z.string().nullable().optional(),
		customerName: z.string().nullable().optional(),
		companyName: z.string().nullable().optional(),
		contactFirstName: z.string().nullable().optional(),
		contactLastName: z.string().nullable().optional(),
		emailAddress: z.string().nullable().optional(),
		phoneNumber: z.string().nullable().optional(),
		mobileNumber: z.string().nullable().optional(),
		onHold: z.boolean().optional(),
		billingCustomerOnHold: z.boolean().optional(),
		streetLine1: z.string().nullable().optional(),
		streetLine2: z.string().nullable().optional(),
		streetSuburb: z.string().nullable().optional(),
		streetPostcode: z.string().nullable().optional(),
		streetState: z.string().nullable().optional(),
		streetCountry: z.string().nullable().optional(),
		postalLine1: z.string().nullable().optional(),
		postalLine2: z.string().nullable().optional(),
		postalSuburb: z.string().nullable().optional(),
		postalState: z.string().nullable().optional(),
		postalPostcode: z.string().nullable().optional(),
		postalCountry: z.string().nullable().optional(),
		customerType: EntityLinkSchema.nullable().optional(),
		leadSource: EntityLinkSchema.nullable().optional(),
		billingCustomer: EntityLinkSchema.nullable().optional(),
		assignedUser: EntityLinkSchema.nullable().optional(),
		customFields: z
			.array(
				z
					.object({
						fieldName: z.string().optional(),
						fieldValue: z.string().optional(),
					})
					.loose(),
			)
			.optional(),
	})
	.loose();

export const AscoraContactSchema = z
	.object({
		contactId: z.string(),
		customerId: z.string().nullable().optional(),
		firstName: z.string().nullable().optional(),
		lastName: z.string().nullable().optional(),
		emailAddress: z.string().nullable().optional(),
		phoneNumber: z.string().nullable().optional(),
		mobileNumber: z.string().nullable().optional(),
		faxNumber: z.string().nullable().optional(),
		defaultContact: z.boolean().optional(),
		contactRole: z.string().nullable().optional(),
	})
	.loose();

export const AscoraJobSchema = z
	.object({
		jobId: z.string(),
		topLevelJobNumber: z.string().nullable().optional(),
		jobNumber: z.string().nullable().optional(),
		jobName: z.string().nullable().optional(),
		jobDescription: z.string().nullable().optional(),
		workUndertaken: z.string().nullable().optional(),
		jobStatus: z.number().optional(),
		jobStatusText: z.string().nullable().optional(),
		dateCreated: z.string().nullable().optional(),
		pricingMethod: z.string().nullable().optional(),
		totalIncTax: z.number().optional(),
		totalExTax: z.number().optional(),
		purchaseOrderNumber: z.string().nullable().optional(),
		clientOrderNumber: z.string().nullable().optional(),
		addressLine1: z.string().nullable().optional(),
		addressLine2: z.string().nullable().optional(),
		suburb: z.string().nullable().optional(),
		state: z.string().nullable().optional(),
		postcode: z.string().nullable().optional(),
		country: z.string().nullable().optional(),
		jobType: EntityLinkSchema.nullable().optional(),
		siteCustomer: EntityLinkSchema.nullable().optional(),
		billingCustomer: EntityLinkSchema.nullable().optional(),
	})
	.loose();

export const AscoraQuoteSchema = z
	.object({
		quoteId: z.string(),
		quoteNumber: z.string().nullable().optional(),
		quoteName: z.string().nullable().optional(),
		quoteDescription: z.string().nullable().optional(),
		quoteStatus: z.number().optional(),
		quotationDate: z.string().nullable().optional(),
		totalIncTax: z.number().optional(),
		totalExTax: z.number().optional(),
		pricingMethod: z.string().nullable().optional(),
		purchaseOrderNumber: z.string().nullable().optional(),
		clientOrderNumber: z.string().nullable().optional(),
		addressLine1: z.string().nullable().optional(),
		addressLine2: z.string().nullable().optional(),
		suburb: z.string().nullable().optional(),
		postcode: z.string().nullable().optional(),
		country: z.string().nullable().optional(),
		jobType: EntityLinkSchema.nullable().optional(),
		siteCustomer: EntityLinkSchema.nullable().optional(),
		billingCustomer: EntityLinkSchema.nullable().optional(),
	})
	.loose();

export const AscoraSupplySchema = z
	.object({
		supplyId: z.string(),
		partNumber: z.string().nullable().optional(),
		description: z.string().nullable().optional(),
		annotation: z.string().nullable().optional(),
		unitCostExTax: z.number().optional(),
		unitSellExTax: z.number().optional(),
		unitSellIncTax: z.number().optional(),
		averageCost: z.number().optional(),
		isTaxable: z.boolean().optional(),
		isFavourite: z.boolean().optional(),
		mustBeOrdered: z.boolean().optional(),
		packOrBoxQuantity: z.number().optional(),
		location: z.string().nullable().optional(),
		defaultSupplier: EntityLinkSchema.nullable().optional(),
		categoryOne: EntityLinkSchema.nullable().optional(),
		unitOfMeasure: z.string().nullable().optional(),
	})
	.loose();

export const AscoraKitSchema = z
	.object({
		kitId: z.string(),
		partNumber: z.string().nullable().optional(),
		description: z.string().nullable().optional(),
		annotation: z.string().nullable().optional(),
		markup: z.number().optional(),
		unitCostExTax: z.number().optional(),
		unitSellExTax: z.number().optional(),
		unitSellIncTax: z.number().optional(),
		isTaxable: z.boolean().optional(),
		isFavourite: z.boolean().optional(),
		pricingMethod: z.string().nullable().optional(),
		categoryOne: EntityLinkSchema.nullable().optional(),
		unitOfMeasure: z.string().nullable().optional(),
	})
	.loose();

export const AscoraCategorySchema = z
	.object({
		categoryId: z.string(),
		name: z.string().nullable().optional(),
		categoryNumber: z.number().optional(),
		parentCategoryId: z.string().nullable().optional(),
	})
	.loose();

export const AscoraSupplierSchema = z
	.object({
		supplierId: z.string(),
		supplierNumber: z.string().nullable().optional(),
		name: z.string().nullable().optional(),
		businessNumber: z.string().nullable().optional(),
		contactFirstName: z.string().nullable().optional(),
		contactLastName: z.string().nullable().optional(),
		notes: z.string().nullable().optional(),
		phone: z.string().nullable().optional(),
		fax: z.string().nullable().optional(),
		mobile: z.string().nullable().optional(),
		emailAddress: z.string().nullable().optional(),
		expenseAccount: z.string().nullable().optional(),
		streetLine1: z.string().nullable().optional(),
		streetLine2: z.string().nullable().optional(),
		streetSuburb: z.string().nullable().optional(),
		streetState: z.string().nullable().optional(),
		streetPostcode: z.string().nullable().optional(),
		postalLine1: z.string().nullable().optional(),
		postalLine2: z.string().nullable().optional(),
		postalSuburb: z.string().nullable().optional(),
		postalState: z.string().nullable().optional(),
		postalPostcode: z.string().nullable().optional(),
		invoiceDueDaysType: z.number().optional(),
	})
	.loose();

export const AscoraSupplierInvoiceSchema = z
	.object({
		supplierInvoiceId: z.string(),
		supplier: EntityLinkSchema.nullable().optional(),
		createdOn: z.string().nullable().optional(),
		invoiceDate: z.string().nullable().optional(),
		dueDate: z.string().nullable().optional(),
		trackingNumber: z.string().nullable().optional(),
		accepted: z.boolean().optional(),
		type: z.string().nullable().optional(),
		accountCode: z.string().nullable().optional(),
		isExpense: z.boolean().optional(),
		sentToAccounts: z.boolean().optional(),
		totalAmountExTax: z.number().optional(),
		totalAmountIncTax: z.number().optional(),
		lines: z.array(z.unknown()).optional(),
	})
	.loose();

export const AscoraLabourRoleSchema = z
	.object({
		labourRoleId: z.string(),
		name: z.string().nullable().optional(),
		hourlyRateExTax: z.number().optional(),
	})
	.loose();

export const AscoraStandardSectionSchema = z
	.object({
		name: z.string().optional(),
		displayOrder: z.number().optional(),
	})
	.loose();

function paged<T extends z.ZodType>(results: T) {
	return z
		.object({
			success: z.boolean(),
			message: z.string().nullable().optional(),
			results: z.array(results),
			totalPages: z.number().optional(),
			totalRecords: z.number().optional(),
		})
		.loose();
}

const SuccessEntitySchema = z
	.object({
		entityId: z.string().optional(),
		success: z.boolean(),
		message: z.string().nullable().optional(),
	})
	.loose();

const ListCustomersInputSchema = z.object({
	...PageQuery,
	filterText: z
		.string()
		.optional()
		.describe('Official `FilterText`. Customer number, email, phone, name.'),
	customerType: z.string().optional().describe('Official `CustomerType`.'),
	leadSource: z.string().optional().describe('Official `LeadSource`.'),
	assignedUser: z.string().optional().describe('Official `AssignedUser`.'),
	siteBillingType: z
		.string()
		.optional()
		.describe('Official `SiteBillingType`. Site / Billing / All.'),
	phoneNumber: z.string().optional().describe('Official `PhoneNumber`.'),
});

const GetCustomerInputSchema = z.object({
	customerId: z.string().min(1).describe('Official customer GUID.'),
});

const UpsertCustomerInputSchema = z.object({
	customerId: z
		.string()
		.optional()
		.describe('Set to update an existing customer.'),
	customerNumber: z.string().optional(),
	companyName: z.string().optional(),
	contactFirstName: z.string().optional(),
	contactLastName: z.string().optional(),
	emailAddress: z.string().optional(),
	phoneNumber: z.string().optional(),
	mobileNumber: z.string().optional(),
	onHold: z.boolean().optional(),
	billingCustomerOnHold: z.boolean().optional(),
	streetLine1: z.string().optional(),
	streetLine2: z.string().optional(),
	streetSuburb: z.string().optional(),
	streetPostcode: z.string().optional(),
	streetState: z.string().optional(),
	streetCountry: z.string().optional(),
	postalLine1: z.string().optional(),
	postalLine2: z.string().optional(),
	postalSuburb: z.string().optional(),
	postalState: z.string().optional(),
	postalPostcode: z.string().optional(),
	postalCountry: z.string().optional(),
	customerType: EntityLinkInput.optional(),
	leadSource: EntityLinkInput.optional(),
	customFields: z.array(CustomFieldInput).optional(),
});

const GetContactInputSchema = z.object({
	contactId: z.string().min(1).describe('Official contact GUID.'),
});

const UpsertContactInputSchema = z.object({
	customerId: z.string().min(1).describe('Official customer GUID.'),
	contactId: z
		.string()
		.optional()
		.describe('Set to update an existing contact.'),
	firstName: z.string().optional(),
	lastName: z.string().optional(),
	emailAddress: z.string().optional(),
	phoneNumber: z.string().optional(),
	mobileNumber: z.string().optional(),
	faxNumber: z.string().optional(),
	defaultContact: z.boolean().optional(),
	contactRole: z.string().optional(),
});

const CreateEnquiryInputSchema = z.object({
	companyName: z.string().optional(),
	firstName: z.string().optional(),
	lastName: z.string().optional(),
	email: z.string().optional(),
	mobile: z.string().optional(),
	phone: z.string().optional(),
	addressLine1: z.string().optional(),
	addressLine2: z.string().optional(),
	addressSuburb: z.string().optional(),
	addressState: z.string().optional(),
	addressPostcode: z.string().optional(),
	addressCountry: z.string().optional(),
	enquiryDescription: z.string().optional(),
	leadSource: z.string().optional(),
	customFields: z.array(CustomFieldInput).optional(),
});

const ListQuotesInputSchema = z.object({
	...PageQuery,
	filterText: z.string().optional().describe('Official `FilterText`.'),
	quoteStatus: z
		.string()
		.optional()
		.describe(
			'Official `QuoteStatus`. IN-PROGRESS, SENT-TO-CUSTOMER, OPEN, WON, LAST-7-DAYS, ALL, ACCEPTED.',
		),
	jobType: z.string().optional().describe('Official `JobType`.'),
	assignedUser: z.string().optional().describe('Official `AssignedUser`.'),
	customerName: z.string().optional().describe('Official `CustomerName`.'),
	startDate: z.string().optional().describe('Official `StartDate`.'),
	endDate: z.string().optional().describe('Official `EndDate`.'),
});

const EmptyInputSchema = z.object({});

const InventoryListInputSchema = z.object({
	...PageQuery,
	filterText: z.string().optional().describe('Official `FilterText`.'),
	favouriteOnly: z.boolean().optional().describe('Official `FavouriteOnly`.'),
	categoryOneId: z.string().optional().describe('Official `CategoryOneId`.'),
	categoryTwoId: z.string().optional().describe('Official `CategoryTwoId`.'),
});

const ListCategoriesInputSchema = z.object({
	...PageQuery,
	filterText: z.string().optional().describe('Official `FilterText`.'),
	parentOnly: z.boolean().optional().describe('Official `ParentOnly`.'),
	categoryNumber: z
		.number()
		.int()
		.optional()
		.describe('Official `CategoryNumber`.'),
});

const GetJobInputSchema = z.object({
	jobNumber: z.string().min(1).describe('Official full job number, e.g. J1.'),
});

const ListJobsInputSchema = z.object({
	...PageQuery,
	jobStatus: z
		.string()
		.optional()
		.describe(
			'Official `JobStatus`. NEW, IN-PROGRESS, COMPLETED, CANCELLED, BOOKED, ALL-OPEN, ALL, etc.',
		),
	jobType: z.string().optional().describe('Official `JobType`.'),
	assignedUser: z.string().optional().describe('Official `AssignedUser`.'),
	startDate: z.string().optional().describe('Official `StartDate`.'),
	endDate: z.string().optional().describe('Official `EndDate`.'),
	includeChildJobs: z
		.boolean()
		.optional()
		.describe('Official `IncludeChildJobs`.'),
});

const SearchJobsInputSchema = z.object({
	...PageQuery,
	filterText: z
		.string()
		.optional()
		.describe('Official `FilterText`. Job number, name, or address.'),
	customerName: z.string().optional().describe('Official `CustomerName`.'),
});

const ListSuppliersInputSchema = z.object({
	...PageQuery,
	supplierName: z.string().optional().describe('Official `SupplierName`.'),
	supplierNumber: z.string().optional().describe('Official `SupplierNumber`.'),
	businessNumber: z.string().optional().describe('Official `BusinessNumber`.'),
});

const GetSupplierInputSchema = z.object({
	supplierId: z.string().min(1).describe('Official supplier GUID.'),
});

const UpsertSupplierInputSchema = z.object({
	supplierId: z
		.string()
		.optional()
		.describe('Set to update an existing supplier.'),
	supplierNumber: z.string().optional(),
	name: z.string().optional(),
	businessNumber: z.string().optional(),
	notes: z.string().optional(),
	phone: z.string().optional(),
	fax: z.string().optional(),
	mobile: z.string().optional(),
	emailAddress: z.string().optional(),
	streetLine1: z.string().optional(),
	streetLine2: z.string().optional(),
	streetSuburb: z.string().optional(),
	streetState: z.string().optional(),
	streetPostcode: z.string().optional(),
	postalLine1: z.string().optional(),
	postalLine2: z.string().optional(),
	postalSuburb: z.string().optional(),
	postalState: z.string().optional(),
	postalPostcode: z.string().optional(),
	contactFirstName: z.string().optional(),
	contactLastName: z.string().optional(),
});

const ListSupplierInvoicesInputSchema = z.object({
	...PageQuery,
	supplierName: z.string().optional().describe('Official `SupplierName`.'),
	trackingNumber: z.string().optional().describe('Official `TrackingNumber`.'),
	toBeSentToAccounting: z
		.boolean()
		.optional()
		.describe('Official `ToBeSentToAccounting`.'),
	invoiceDateStart: z
		.string()
		.optional()
		.describe('Official `InvoiceDateStart`.'),
	invoiceDateEnd: z.string().optional().describe('Official `InvoiceDateEnd`.'),
});

const CreateNoteInputSchema = z.object({
	entityId: z.string().min(1).describe('Official entity GUID.'),
	entityType: z
		.enum(['Enquiry', 'Job', 'Quotation', 'Invoice', 'Customer'])
		.describe('Official `entityType`.'),
	noteContent: z.string().min(1).describe('Official `noteContent`.'),
	createdByName: z.string().optional().describe('Official `createdByName`.'),
});

const UploadAttachmentInputSchema = z.object({
	entityId: z.string().min(1).describe('Official entity GUID.'),
	entityType: z
		.enum([
			'Enquiry',
			'Job',
			'Quotation',
			'Task',
			'SupplierInvoice',
			'Invoice',
			'Supply',
			'Customer',
		])
		.describe('Official `EntityType`.'),
	fileName: z.string().min(1),
	fileBase64: z.string().min(1).describe('File contents as base64.'),
	contentType: z.string().optional(),
});

const GetCustomerResponseSchema = z
	.object({
		success: z.boolean(),
		message: z.string().nullable().optional(),
		customer: AscoraCustomerSchema.nullable().optional(),
	})
	.loose();

const GetContactResponseSchema = z
	.object({
		success: z.boolean(),
		message: z.string().nullable().optional(),
		contact: AscoraContactSchema.nullable().optional(),
	})
	.loose();

const GetJobResponseSchema = z
	.object({
		success: z.boolean(),
		message: z.string().nullable().optional(),
		job: AscoraJobSchema.nullable().optional(),
	})
	.loose();

const GetSupplierResponseSchema = z
	.object({
		success: z.boolean(),
		message: z.string().nullable().optional(),
		supplier: AscoraSupplierSchema.nullable().optional(),
	})
	.loose();

export type AscoraEndpointInputs = {
	listCustomers: z.infer<typeof ListCustomersInputSchema>;
	getCustomer: z.infer<typeof GetCustomerInputSchema>;
	upsertCustomer: z.infer<typeof UpsertCustomerInputSchema>;
	getContact: z.infer<typeof GetContactInputSchema>;
	upsertContact: z.infer<typeof UpsertContactInputSchema>;
	createEnquiry: z.infer<typeof CreateEnquiryInputSchema>;
	listQuotes: z.infer<typeof ListQuotesInputSchema>;
	getLabourRoles: z.infer<typeof EmptyInputSchema>;
	getStandardSections: z.infer<typeof EmptyInputSchema>;
	getStandardStages: z.infer<typeof EmptyInputSchema>;
	listSupplies: z.infer<typeof InventoryListInputSchema>;
	listKits: z.infer<typeof InventoryListInputSchema>;
	listCategories: z.infer<typeof ListCategoriesInputSchema>;
	getJob: z.infer<typeof GetJobInputSchema>;
	listJobs: z.infer<typeof ListJobsInputSchema>;
	searchJobs: z.infer<typeof SearchJobsInputSchema>;
	listSuppliers: z.infer<typeof ListSuppliersInputSchema>;
	getSupplier: z.infer<typeof GetSupplierInputSchema>;
	upsertSupplier: z.infer<typeof UpsertSupplierInputSchema>;
	listSupplierInvoices: z.infer<typeof ListSupplierInvoicesInputSchema>;
	createNote: z.infer<typeof CreateNoteInputSchema>;
	uploadAttachment: z.infer<typeof UploadAttachmentInputSchema>;
};

export type AscoraEndpointOutputs = {
	listCustomers: z.infer<ReturnType<typeof paged<typeof AscoraCustomerSchema>>>;
	getCustomer: z.infer<typeof GetCustomerResponseSchema>;
	upsertCustomer: z.infer<typeof GetCustomerResponseSchema>;
	getContact: z.infer<typeof GetContactResponseSchema>;
	upsertContact: z.infer<typeof GetContactResponseSchema>;
	createEnquiry: z.infer<typeof SuccessEntitySchema>;
	listQuotes: z.infer<ReturnType<typeof paged<typeof AscoraQuoteSchema>>>;
	getLabourRoles: z.infer<typeof AscoraLabourRoleSchema>[];
	getStandardSections: z.infer<typeof AscoraStandardSectionSchema>[];
	getStandardStages: z.infer<typeof AscoraStandardSectionSchema>[];
	listSupplies: z.infer<ReturnType<typeof paged<typeof AscoraSupplySchema>>>;
	listKits: z.infer<ReturnType<typeof paged<typeof AscoraKitSchema>>>;
	listCategories: z.infer<
		ReturnType<typeof paged<typeof AscoraCategorySchema>>
	>;
	getJob: z.infer<typeof GetJobResponseSchema>;
	listJobs: z.infer<ReturnType<typeof paged<typeof AscoraJobSchema>>>;
	searchJobs: z.infer<ReturnType<typeof paged<typeof AscoraJobSchema>>>;
	listSuppliers: z.infer<ReturnType<typeof paged<typeof AscoraSupplierSchema>>>;
	getSupplier: z.infer<typeof GetSupplierResponseSchema>;
	upsertSupplier: z.infer<typeof GetSupplierResponseSchema>;
	listSupplierInvoices: z.infer<
		ReturnType<typeof paged<typeof AscoraSupplierInvoiceSchema>>
	>;
	createNote: z.infer<typeof SuccessEntitySchema>;
	uploadAttachment: z.infer<typeof SuccessEntitySchema>;
};

export const AscoraEndpointInputSchemas = {
	listCustomers: ListCustomersInputSchema,
	getCustomer: GetCustomerInputSchema,
	upsertCustomer: UpsertCustomerInputSchema,
	getContact: GetContactInputSchema,
	upsertContact: UpsertContactInputSchema,
	createEnquiry: CreateEnquiryInputSchema,
	listQuotes: ListQuotesInputSchema,
	getLabourRoles: EmptyInputSchema,
	getStandardSections: EmptyInputSchema,
	getStandardStages: EmptyInputSchema,
	listSupplies: InventoryListInputSchema,
	listKits: InventoryListInputSchema,
	listCategories: ListCategoriesInputSchema,
	getJob: GetJobInputSchema,
	listJobs: ListJobsInputSchema,
	searchJobs: SearchJobsInputSchema,
	listSuppliers: ListSuppliersInputSchema,
	getSupplier: GetSupplierInputSchema,
	upsertSupplier: UpsertSupplierInputSchema,
	listSupplierInvoices: ListSupplierInvoicesInputSchema,
	createNote: CreateNoteInputSchema,
	uploadAttachment: UploadAttachmentInputSchema,
} as const;

export const AscoraEndpointOutputSchemas = {
	listCustomers: paged(AscoraCustomerSchema),
	getCustomer: GetCustomerResponseSchema,
	upsertCustomer: GetCustomerResponseSchema,
	getContact: GetContactResponseSchema,
	upsertContact: GetContactResponseSchema,
	createEnquiry: SuccessEntitySchema,
	listQuotes: paged(AscoraQuoteSchema),
	getLabourRoles: z.array(AscoraLabourRoleSchema),
	getStandardSections: z.array(AscoraStandardSectionSchema),
	getStandardStages: z.array(AscoraStandardSectionSchema),
	listSupplies: paged(AscoraSupplySchema),
	listKits: paged(AscoraKitSchema),
	listCategories: paged(AscoraCategorySchema),
	getJob: GetJobResponseSchema,
	listJobs: paged(AscoraJobSchema),
	searchJobs: paged(AscoraJobSchema),
	listSuppliers: paged(AscoraSupplierSchema),
	getSupplier: GetSupplierResponseSchema,
	upsertSupplier: GetSupplierResponseSchema,
	listSupplierInvoices: paged(AscoraSupplierInvoiceSchema),
	createNote: SuccessEntitySchema,
	uploadAttachment: SuccessEntitySchema,
} as const;
