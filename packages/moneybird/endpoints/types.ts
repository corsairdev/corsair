import { z } from 'zod';

// Moneybird serves ids as large integers and its docs recommend parsing them
// as strings, so every output id is a string and every id input accepts a
// digit string or a number. Outputs are `.loose()` and their documented
// fields nullish. Source: https://developer.moneybird.com/api and the
// introduction page (authentication, pagination, throttling, errors).

/** Moneybird's default page: 50 entries, up to 100 via per_page. */
export const MONEYBIRD_DEFAULT_PAGE_SIZE = 50;

const IdInputSchema = z.union([
	z.string().regex(/^\d+$/, 'Must be a digit string'),
	z.number().int().positive(),
]);

const IdOutputSchema = z.string().regex(/^\d+$/);

const PageSchema = z
	.number()
	.int()
	.positive()
	.optional()
	.describe('1-based page. Moco pages with 50 entries per default page.');

const PerPageSchema = z
	.number()
	.int()
	.min(1)
	.max(100)
	.optional()
	.describe(
		`Up to 100; the default page carries ${MONEYBIRD_DEFAULT_PAGE_SIZE} entries.`,
	);

const MoneybirdTimestampSchema = z.string().nullish();

// ── list wrapper ──────────────────────────────────────────────────────────

// unknown: raw is the bare array Moneybird returns for a list call.
export function wrapListPage(
	raw: unknown,
	page: number | undefined,
	perPage: number | undefined,
): { items: unknown[]; next_page: number | null } {
	if (!Array.isArray(raw)) {
		throw new Error('Moneybird list endpoint returned no array');
	}
	const effectivePerPage = perPage ?? MONEYBIRD_DEFAULT_PAGE_SIZE;
	const current = page ?? 1;
	return {
		items: raw,
		// The Link header with the next page sits in a response header the
		// client cannot return, so a full page is treated as "probably more".
		next_page: raw.length >= effectivePerPage ? current + 1 : null,
	};
}

// ── administrations ───────────────────────────────────────────────────────

const AdministrationSchema = z
	.object({
		id: IdOutputSchema,
		name: z.string().nullish(),
		language: z.string().nullish(),
		currency: z.string().nullish(),
		country: z.string().nullish(),
		time_zone: z.string().nullish(),
		access: z.string().nullish(),
		suspended: z.boolean().nullish(),
		period_locked_until: z.string().nullish(),
		period_start_date: z.string().nullish(),
	})
	.loose();

export type Administration = z.infer<typeof AdministrationSchema>;

const AdministrationsListResponseSchema = z.object({
	administrations: z.array(AdministrationSchema),
});

export type AdministrationsListResponse = z.infer<
	typeof AdministrationsListResponseSchema
>;

// ── contacts ──────────────────────────────────────────────────────────────

export const MONEYBIRD_DELIVERY_METHODS = [
	'Email',
	'Post',
	'Manual',
	'Simplerinvoicing',
	'Peppol',
] as const;

const DeliveryMethodSchema = z.enum(MONEYBIRD_DELIVERY_METHODS);

const ContactSchema = z
	.object({
		id: IdOutputSchema,
		administration_id: IdOutputSchema.nullish(),
		company_name: z.string().nullish(),
		firstname: z.string().nullish(),
		lastname: z.string().nullish(),
		attention: z.string().nullish(),
		address1: z.string().nullish(),
		address2: z.string().nullish(),
		zipcode: z.string().nullish(),
		city: z.string().nullish(),
		country: z.string().nullish(),
		phone: z.string().nullish(),
		delivery_method: DeliveryMethodSchema.nullish(),
		customer_id: z.string().nullish(),
		tax_number: z.string().nullish(),
		chamber_of_commerce: z.string().nullish(),
		bank_account: z.string().nullish(),
		email: z.string().nullish(),
		send_invoices_to_attention: z.string().nullish(),
		send_invoices_to_email: z.string().nullish(),
		send_estimates_to_attention: z.string().nullish(),
		send_estimates_to_email: z.string().nullish(),
		invoice_workflow_id: IdOutputSchema.nullish(),
		estimate_workflow_id: IdOutputSchema.nullish(),
		archived: z.boolean().nullish(),
		version: z.number().nullish(),
		created_at: MoneybirdTimestampSchema,
		updated_at: MoneybirdTimestampSchema,
	})
	.loose();

export type Contact = z.infer<typeof ContactSchema>;

const ContactsListInputSchema = z.object({
	page: PageSchema,
	per_page: PerPageSchema,
});

export type ContactsListInput = z.input<typeof ContactsListInputSchema>;

const ContactUpsertSchema = z.object({
	company_name: z.string().optional(),
	firstname: z.string().optional(),
	lastname: z.string().optional(),
	attention: z.string().optional(),
	address1: z.string().optional(),
	address2: z.string().optional(),
	zipcode: z.string().optional(),
	city: z.string().optional(),
	country: z
		.string()
		.length(2)
		.optional()
		.describe('An ISO 3166-1 alpha-2 country code, e.g. NL.'),
	phone: z.string().optional(),
	email: z.string().optional(),
	delivery_method: DeliveryMethodSchema.optional(),
	customer_id: z.string().optional(),
	tax_number: z.string().optional(),
	chamber_of_commerce: z.string().optional(),
	bank_account: z.string().optional(),
	invoice_workflow_id: IdInputSchema.optional(),
	estimate_workflow_id: IdInputSchema.optional(),
	send_invoices_to_attention: z.string().optional(),
	send_invoices_to_email: z.string().optional(),
	send_estimates_to_attention: z.string().optional(),
	send_estimates_to_email: z.string().optional(),
});

export type ContactUpsertInput = z.input<typeof ContactUpsertSchema>;

const IdInputWrapperSchema = z.object({
	id: IdInputSchema,
});

export type IdInput = z.input<typeof IdInputWrapperSchema>;

// ── sales invoices ────────────────────────────────────────────────────────

const SalesInvoiceLineSchema = z
	.object({
		id: IdOutputSchema.nullish(),
		description: z.string().nullish(),
		price_per_unit: z.string().nullish(),
		quantity: z.union([z.string(), z.number()]).nullish(),
		amount: z.string().nullish(),
		tax: z.string().nullish(),
		tax_rate_id: IdOutputSchema.nullish(),
		ledger_account_id: IdOutputSchema.nullish(),
	})
	.loose();

const SalesInvoiceSchema = z
	.object({
		id: IdOutputSchema,
		contact_id: IdOutputSchema.nullish(),
		contact: z
			.object({
				id: IdOutputSchema.nullish(),
				company_name: z.string().nullish(),
			})
			.loose()
			.nullish(),
		invoice_id: z
			.string()
			.nullish()
			.describe('The invoice number; null while the invoice is a draft.'),
		workflow_id: IdOutputSchema.nullish(),
		state: z.string().nullish(),
		invoice_date: z.string().nullish(),
		due_date: z.string().nullish(),
		currency: z.string().nullish(),
		total_price_excl_vat: z.string().nullish(),
		total_price_incl_vat: z.string().nullish(),
		total_unpaid_amount: z.string().nullish(),
		details: z.array(SalesInvoiceLineSchema).nullish(),
		created_at: MoneybirdTimestampSchema,
		updated_at: MoneybirdTimestampSchema,
	})
	.loose();

export type SalesInvoice = z.infer<typeof SalesInvoiceSchema>;

const SalesInvoicesListInputSchema = z.object({
	filter: z
		.string()
		.optional()
		.describe(
			"key:value terms separated by commas, e.g. 'state:open|paid' or 'period:this_year'. Passing a filter replaces the defaults entirely.",
		),
	page: PageSchema,
	per_page: PerPageSchema,
});

export type SalesInvoicesListInput = z.input<
	typeof SalesInvoicesListInputSchema
>;

const SalesInvoiceUpsertSchema = z.object({
	contact_id: IdInputSchema.optional(),
	invoice_date: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be a yyyy-mm-dd date')
		.optional(),
	due_date: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be a yyyy-mm-dd date')
		.optional(),
	workflow_id: IdInputSchema.optional(),
	reference: z.string().optional(),
	currency: z.string().optional(),
	prices_are_incl_tax: z.boolean().optional(),
	discount: z
		.union([z.string(), z.number()])
		.optional()
		.describe('A discount percentage.'),
	details_attributes: z
		.array(
			z.object({
				description: z.string().optional(),
				price_per_unit: z.union([z.string(), z.number()]).optional(),
				quantity: z.union([z.string(), z.number()]).optional(),
				tax_rate_id: IdInputSchema.optional(),
				ledger_account_id: IdInputSchema.optional(),
				unit: z.string().optional(),
			}),
		)
		.optional()
		.describe('The invoice lines; a line needs a price and a description.'),
});

export type SalesInvoiceUpsertInput = z.input<typeof SalesInvoiceUpsertSchema>;

export const MONEYBIRD_SEND_DELIVERY_METHODS = [
	'Email',
	'Post',
	'Manual',
	'Simplerinvoicing',
	'Peppol',
] as const;

const SalesInvoiceSendInputSchema = z
	.object({
		id: IdInputSchema,
		sending_scheduled: z
			.boolean()
			.optional()
			.describe(
				'True schedules the sending for invoice_date instead of sending now.',
			),
		invoice_date: z
			.string()
			.regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be a yyyy-mm-dd date')
			.optional()
			.describe('Required when sending_scheduled is true.'),
		delivery_method: z.enum(MONEYBIRD_SEND_DELIVERY_METHODS).optional(),
		email: z
			.string()
			.optional()
			.describe('Overrides the contact invoice email for this sending.'),
		message: z.string().optional(),
	})
	.superRefine((value, ctx) => {
		if (value.sending_scheduled && !value.invoice_date) {
			ctx.addIssue({
				code: 'custom',
				message: 'invoice_date is required when sending_scheduled is true',
			});
		}
	});

export type SalesInvoiceSendInput = z.input<typeof SalesInvoiceSendInputSchema>;

const SalesInvoiceGetResponseSchema = SalesInvoiceSchema;

const SalesInvoiceSendResponseSchema = SalesInvoiceSchema;

const DeleteResponseSchema = z.object({
	success: z.literal(true),
	id: z.string(),
});

export type DeleteResponse = z.infer<typeof DeleteResponseSchema>;

// ── time entries ──────────────────────────────────────────────────────────

const TimeEntrySchema = z
	.object({
		id: IdOutputSchema,
		contact_id: IdOutputSchema.nullish(),
		project_id: IdOutputSchema.nullish(),
		sales_invoice_id: IdOutputSchema.nullish(),
		user_id: IdOutputSchema.nullish(),
		started_at: z.string().nullish(),
		ended_at: z.string().nullish(),
		description: z.string().nullish(),
		paused_duration: z.number().nullish(),
		billable: z.boolean().nullish(),
		created_at: MoneybirdTimestampSchema,
		updated_at: MoneybirdTimestampSchema,
	})
	.loose();

export type TimeEntry = z.infer<typeof TimeEntrySchema>;

const TimeEntriesListInputSchema = z.object({
	filter: z.string().optional().describe("e.g. 'period:this_year'."),
	page: PageSchema,
	per_page: PerPageSchema,
});

export type TimeEntriesListInput = z.input<typeof TimeEntriesListInputSchema>;

const TimeEntryUpsertSchema = z.object({
	project_id: IdInputSchema.optional(),
	user_id: IdInputSchema.optional(),
	started_at: z
		.string()
		.optional()
		.describe(
			'ISO 8601 start. Moneybird rounds to full minutes with at least one minute between start and end.',
		),
	ended_at: z.string().optional().describe('ISO 8601 end.'),
	description: z.string().optional(),
	billable: z.boolean().optional(),
});

export type TimeEntryUpsertInput = z.input<typeof TimeEntryUpsertSchema>;

// ── products ──────────────────────────────────────────────────────────────

const ProductSchema = z
	.object({
		id: IdOutputSchema,
		description: z.string().nullish(),
		title: z.string().nullish(),
		identifier: z.string().nullish(),
		price: z.string().nullish(),
		currency: z.string().nullish(),
		frequency: z.number().nullish(),
		frequency_type: z.string().nullish(),
		tax_rate_id: IdOutputSchema.nullish(),
		ledger_account_id: IdOutputSchema.nullish(),
		created_at: MoneybirdTimestampSchema,
		updated_at: MoneybirdTimestampSchema,
	})
	.loose();

export type Product = z.infer<typeof ProductSchema>;

const ProductsListInputSchema = z.object({
	page: PageSchema,
	per_page: PerPageSchema,
});

export type ProductsListInput = z.input<typeof ProductsListInputSchema>;

const ProductUpsertSchema = z.object({
	description: z.string().min(1).optional().describe('The product name.'),
	title: z.string().optional(),
	identifier: z.string().optional(),
	price: z.union([z.string(), z.number()]).optional(),
	currency: z.string().optional(),
	tax_rate_id: IdInputSchema.optional(),
	ledger_account_id: IdInputSchema.optional(),
	frequency: z.number().optional(),
	frequency_type: z.string().optional(),
});

export type ProductUpsertInput = z.input<typeof ProductUpsertSchema>;

// ── projects ──────────────────────────────────────────────────────────────

const ProjectSchema = z
	.object({
		id: IdOutputSchema,
		name: z.string().nullish(),
		state: z.string().nullish(),
		budget: z.number().nullish(),
		created_at: MoneybirdTimestampSchema,
		updated_at: MoneybirdTimestampSchema,
	})
	.loose();

export type Project = z.infer<typeof ProjectSchema>;

const ProjectsListInputSchema = z.object({
	page: PageSchema,
	per_page: PerPageSchema,
});

export type ProjectsListInput = z.input<typeof ProjectsListInputSchema>;

const ProjectUpsertSchema = z.object({
	name: z
		.string()
		.min(1)
		.optional()
		.describe('Unique within the administration.'),
	budget: z.number().optional(),
});

export type ProjectUpsertInput = z.input<typeof ProjectUpsertSchema>;

// ── Registry ──────────────────────────────────────────────────────────────

export type MoneybirdEndpointInputs = {
	administrationsList: Record<string, never>;
	contactsList: ContactsListInput;
	contactsGet: IdInput;
	contactsCreate: ContactUpsertInput;
	contactsUpdate: ContactUpsertInput & IdInput;
	contactsDelete: IdInput;
	salesInvoicesList: SalesInvoicesListInput;
	salesInvoicesGet: IdInput;
	salesInvoicesCreate: SalesInvoiceUpsertInput;
	salesInvoicesUpdate: SalesInvoiceUpsertInput & IdInput;
	salesInvoicesDelete: IdInput;
	salesInvoicesSend: SalesInvoiceSendInput;
	timeEntriesList: TimeEntriesListInput;
	timeEntriesGet: IdInput;
	timeEntriesCreate: TimeEntryUpsertInput;
	timeEntriesUpdate: TimeEntryUpsertInput & IdInput;
	timeEntriesDelete: IdInput;
	productsList: ProductsListInput;
	productsGet: IdInput;
	productsCreate: ProductUpsertInput;
	productsUpdate: ProductUpsertInput & IdInput;
	productsDelete: IdInput;
	projectsList: ProjectsListInput;
	projectsGet: IdInput;
	projectsCreate: ProjectUpsertInput;
	projectsUpdate: ProjectUpsertInput & IdInput;
	projectsDelete: IdInput;
};

export type MoneybirdEndpointOutputs = {
	administrationsList: AdministrationsListResponse;
	contactsList: { items: Contact[]; next_page: number | null };
	contactsGet: Contact;
	contactsCreate: Contact;
	contactsUpdate: Contact;
	contactsDelete: DeleteResponse;
	salesInvoicesList: { items: SalesInvoice[]; next_page: number | null };
	salesInvoicesGet: SalesInvoice;
	salesInvoicesCreate: SalesInvoice;
	salesInvoicesUpdate: SalesInvoice;
	salesInvoicesDelete: DeleteResponse;
	salesInvoicesSend: SalesInvoice;
	timeEntriesList: { items: TimeEntry[]; next_page: number | null };
	timeEntriesGet: TimeEntry;
	timeEntriesCreate: TimeEntry;
	timeEntriesUpdate: TimeEntry;
	timeEntriesDelete: DeleteResponse;
	productsList: { items: Product[]; next_page: number | null };
	productsGet: Product;
	productsCreate: Product;
	productsUpdate: Product;
	productsDelete: DeleteResponse;
	projectsList: { items: Project[]; next_page: number | null };
	projectsGet: Project;
	projectsCreate: Project;
	projectsUpdate: Project;
	projectsDelete: DeleteResponse;
};

const ListOf = <T extends z.ZodType>(item: T) =>
	z.object({
		items: z.array(item),
		next_page: z.number().nullable(),
	});

export const MoneybirdEndpointInputSchemas = {
	administrationsList: z.object({}).loose(),
	contactsList: ContactsListInputSchema,
	contactsGet: IdInputWrapperSchema,
	contactsCreate: ContactUpsertSchema,
	contactsUpdate: ContactUpsertSchema.and(IdInputWrapperSchema),
	contactsDelete: IdInputWrapperSchema,
	salesInvoicesList: SalesInvoicesListInputSchema,
	salesInvoicesGet: IdInputWrapperSchema,
	salesInvoicesCreate: SalesInvoiceUpsertSchema,
	salesInvoicesUpdate: SalesInvoiceUpsertSchema.and(IdInputWrapperSchema),
	salesInvoicesDelete: IdInputWrapperSchema,
	salesInvoicesSend: SalesInvoiceSendInputSchema,
	timeEntriesList: TimeEntriesListInputSchema,
	timeEntriesGet: IdInputWrapperSchema,
	timeEntriesCreate: TimeEntryUpsertSchema,
	timeEntriesUpdate: TimeEntryUpsertSchema.and(IdInputWrapperSchema),
	timeEntriesDelete: IdInputWrapperSchema,
	productsList: ProductsListInputSchema,
	productsGet: IdInputWrapperSchema,
	productsCreate: ProductUpsertSchema,
	productsUpdate: ProductUpsertSchema.and(IdInputWrapperSchema),
	productsDelete: IdInputWrapperSchema,
	projectsList: ProjectsListInputSchema,
	projectsGet: IdInputWrapperSchema,
	projectsCreate: ProjectUpsertSchema,
	projectsUpdate: ProjectUpsertSchema.and(IdInputWrapperSchema),
	projectsDelete: IdInputWrapperSchema,
} as const;

export const MoneybirdEndpointOutputSchemas = {
	administrationsList: AdministrationsListResponseSchema,
	contactsList: ListOf(ContactSchema),
	contactsGet: ContactSchema,
	contactsCreate: ContactSchema,
	contactsUpdate: ContactSchema,
	contactsDelete: DeleteResponseSchema,
	salesInvoicesList: ListOf(SalesInvoiceSchema),
	salesInvoicesGet: SalesInvoiceGetResponseSchema,
	salesInvoicesCreate: SalesInvoiceSchema,
	salesInvoicesUpdate: SalesInvoiceSchema,
	salesInvoicesDelete: DeleteResponseSchema,
	salesInvoicesSend: SalesInvoiceSendResponseSchema,
	timeEntriesList: ListOf(TimeEntrySchema),
	timeEntriesGet: TimeEntrySchema,
	timeEntriesCreate: TimeEntrySchema,
	timeEntriesUpdate: TimeEntrySchema,
	timeEntriesDelete: DeleteResponseSchema,
	productsList: ListOf(ProductSchema),
	productsGet: ProductSchema,
	productsCreate: ProductSchema,
	productsUpdate: ProductSchema,
	productsDelete: DeleteResponseSchema,
	projectsList: ListOf(ProjectSchema),
	projectsGet: ProjectSchema,
	projectsCreate: ProjectSchema,
	projectsUpdate: ProjectSchema,
	projectsDelete: DeleteResponseSchema,
} as const;
