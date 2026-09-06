import { z } from 'zod';

// Customers
const CustomerSchema = z.object({
	id: z.string(),
	name: z.string(),
	email: z.string().optional(),
	status: z.string().optional(),
});

const ListCustomersInputSchema = z.object({
	page: z.number().int().positive().optional(),
	limit: z.number().int().positive().optional(),
});

const ListCustomersOutputSchema = z.object({
	data: z.array(CustomerSchema),
	total: z.number().int().optional(),
});

// Invoices
const InvoiceSchema = z.object({
	id: z.string(),
	customer_id: z.string(),
	amount: z.number(),
	currency: z.string(),
	status: z.string(),
	due_date: z.string().optional(),
});

const ListInvoicesInputSchema = z.object({
	page: z.number().int().positive().optional(),
	limit: z.number().int().positive().optional(),
	customer_id: z.string().optional(),
});

const ListInvoicesOutputSchema = z.object({
	data: z.array(InvoiceSchema),
	total: z.number().int().optional(),
});

const GetInvoiceInputSchema = z.object({
	id: z.string(),
});

// Credit Notes
const CreditNoteSchema = z.object({
	id: z.string(),
	customer_id: z.string(),
	amount: z.number(),
	currency: z.string(),
	status: z.string(),
});

const ListCreditNotesInputSchema = z.object({
	page: z.number().int().positive().optional(),
	limit: z.number().int().positive().optional(),
});

const ListCreditNotesOutputSchema = z.object({
	data: z.array(CreditNoteSchema),
	total: z.number().int().optional(),
});

// Organizations
const OrganizationSchema = z.object({
	id: z.string(),
	name: z.string(),
	email: z.string().optional(),
});

const GetOrganizationOutputSchema = OrganizationSchema;

export type ListCustomersInput = z.infer<typeof ListCustomersInputSchema>;
export type ListInvoicesInput = z.infer<typeof ListInvoicesInputSchema>;
export type GetInvoiceInput = z.infer<typeof GetInvoiceInputSchema>;
export type ListCreditNotesInput = z.infer<typeof ListCreditNotesInputSchema>;

export type ChaserEndpointInputs = {
	listCustomers: ListCustomersInput;
	listInvoices: ListInvoicesInput;
	getInvoice: GetInvoiceInput;
	listCreditNotes: ListCreditNotesInput;
	getOrganization: Record<string, never>;
};

export type ChaserEndpointOutputs = {
	listCustomers: z.infer<typeof ListCustomersOutputSchema>;
	listInvoices: z.infer<typeof ListInvoicesOutputSchema>;
	getInvoice: z.infer<typeof InvoiceSchema>;
	listCreditNotes: z.infer<typeof ListCreditNotesOutputSchema>;
	getOrganization: z.infer<typeof GetOrganizationOutputSchema>;
};

export const ChaserEndpointInputSchemas = {
	listCustomers: ListCustomersInputSchema,
	listInvoices: ListInvoicesInputSchema,
	getInvoice: GetInvoiceInputSchema,
	listCreditNotes: ListCreditNotesInputSchema,
	getOrganization: z.object({}),
} as const;

export const ChaserEndpointOutputSchemas = {
	listCustomers: ListCustomersOutputSchema,
	listInvoices: ListInvoicesOutputSchema,
	getInvoice: InvoiceSchema,
	listCreditNotes: ListCreditNotesOutputSchema,
	getOrganization: GetOrganizationOutputSchema,
} as const;
