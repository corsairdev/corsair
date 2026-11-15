import { z } from 'zod';

// Inputs use the API's own parameter names. Outputs are `.loose()` and their
// optional fields nullish, because the API sends `null` for unset relations.
// Lists answer `{ type, items, meta }`, not a bare array.
// Field reference: https://workspace.vsco.co/api/v2

const EntityIdSchema = z
	.string()
	.min(1)
	.describe('A lowercase ULID entity ID.');

const IsoDateSchema = z
	.string()
	.regex(/^\d{4}-\d{2}-\d{2}$/, 'Expected YYYY-MM-DD.')
	.describe('A calendar date as "YYYY-MM-DD".');

/**
 * Paging is on the body (`meta`), not a header. `pageSize` has a minimum of 10
 * and a maximum of 100, and the API defaults it to 100.
 */
const PageSchema = z
	.number()
	.int()
	.min(1)
	.optional()
	.describe('Page of results, starting at 1. Defaults to 1.');
const PageSizeSchema = z
	.number()
	.int()
	.min(10)
	.max(100)
	.optional()
	.describe(
		'Results per page, from 10 to 100. The API defaults it to 100, so omit it unless you need smaller pages.',
	);
const SortBySchema = z
	.string()
	.optional()
	.describe(
		'A property to sort by, optionally followed by " asc" or " desc", e.g. "modified desc".',
	);

// ── Shared output pieces ──────────────────────────────────────────────────

const LinkSchema = z
	.object({
		href: z.string().nullish(),
		title: z.string().nullish(),
		type: z.string().nullish(),
	})
	.loose();

const LinksSchema = z.object({ self: LinkSchema.nullish() }).loose();

/**
 * A list answer. `meta` is present on every collection the API returns, but it
 * is typed nullish so a caller reading a single page without it still parses.
 */
function collection<T extends z.ZodType>(item: T) {
	return z
		.object({
			type: z.string(),
			items: z.array(item),
			meta: z
				.object({
					currentPage: z.number().nullish(),
					totalPages: z.number().nullish(),
					totalItems: z.number().nullish(),
					pageSize: z.number().nullish(),
				})
				.loose()
				.nullish(),
		})
		.loose();
}

// A 204 delete carries no body, so the endpoint reports what it did.
export const DeletedResponseSchema = z.object({ success: z.literal(true) });

export type DeletedResponse = z.infer<typeof DeletedResponseSchema>;

// ── jobs ──────────────────────────────────────────────────────────────────

export const JobSchema = z
	.object({
		id: z.string(),
		created: z.string().nullish(),
		modified: z.string().nullish(),
		hidden: z.boolean().nullish(),
		title: z.string().nullish(),
		name: z.string().nullish(),
		stage: z.string().nullish(),
		closed: z.boolean().nullish(),
		closedReasonId: z.string().nullish(),
		closedReasonName: z.string().nullish(),
		closedDate: z.string().nullish(),
		inquiryDate: z.string().nullish(),
		bookingDate: z.string().nullish(),
		eventDate: z.string().nullish(),
		completedDate: z.string().nullish(),
		fulfillmentDate: z.string().nullish(),
		clientContacts: z.array(z.string()).nullish(),
		// The docs type this as an open object keyed by contact ID.
		contacts: z.array(z.object({ id: z.string().nullish() }).loose()).nullish(),
		customNumber: z.string().nullish(),
		jobTypeId: z.string().nullish(),
		jobTypeName: z.string().nullish(),
		leadSourceId: z.string().nullish(),
		leadSourceName: z.string().nullish(),
		leadStatusId: z.string().nullish(),
		leadStatusName: z.string().nullish(),
		// Amounts are integers in the studio currency, not decimals.
		accountBalance: z.number().nullish(),
		creditBalance: z.number().nullish(),
		totalCost: z.number().nullish(),
		totalProfit: z.number().nullish(),
		totalRevenue: z.number().nullish(),
		guestCount: z.number().nullish(),
		brandId: z.string().nullish(),
		workflowId: z.string().nullish(),
		workflowName: z.string().nullish(),
		pinned: z.boolean().nullish(),
		sample: z.boolean().nullish(),
		webLead: z.boolean().nullish(),
		links: LinksSchema.nullish(),
	})
	.loose();

export type TaveJob = z.infer<typeof JobSchema>;

export const JobsListInputSchema = z.object({
	page: PageSchema,
	pageSize: PageSizeSchema,
	sortBy: SortBySchema,
	includeClosed: z
		.boolean()
		.optional()
		.describe('Include jobs that have been closed. Defaults to false.'),
	expand: z
		.string()
		.optional()
		.describe(
			'Entity-qualified dot paths to expand inline, comma-separated, e.g. "Job.clientContacts".',
		),
	stage: z
		.array(z.enum(['lead', 'booked', 'fulfillment', 'completed']))
		.min(1)
		.optional()
		.describe('Only jobs in these stages.'),
	leadStatusId: z
		.string()
		.optional()
		.describe('Only jobs with this lead status.'),
	eventDateFrom: IsoDateSchema.optional().describe(
		'Only jobs whose event date is on or after this date; jobs without an event date are excluded.',
	),
	eventDateTo: IsoDateSchema.optional().describe(
		'Only jobs whose event date is on or before this date; jobs without an event date are excluded.',
	),
	staleBefore: IsoDateSchema.optional().describe(
		'Only jobs whose stale date is on or before this date.',
	),
});

export type JobsListInput = z.infer<typeof JobsListInputSchema>;

export const JobsListResponseSchema = collection(JobSchema);

export type JobsListResponse = z.infer<typeof JobsListResponseSchema>;

export const JobsGetInputSchema = z.object({
	jobId: EntityIdSchema,
});

export type JobsGetInput = z.infer<typeof JobsGetInputSchema>;

export const JobsGetResponseSchema = JobSchema;

export type JobsGetResponse = z.infer<typeof JobsGetResponseSchema>;

export const JobsCreateInputSchema = z.object({
	title: z.string().max(160).optional().describe('The job title.'),
	name: z.string().max(160).optional().describe('The job name.'),
	stage: z
		.enum(['lead', 'booked', 'fulfillment', 'completed'])
		.optional()
		.describe('The pipeline stage.'),
	jobTypeId: EntityIdSchema.optional().describe('The job type.'),
	leadSourceId: EntityIdSchema.optional().describe('The lead source.'),
	leadStatusId: EntityIdSchema.optional().describe('The lead status.'),
	brandId: EntityIdSchema.optional().describe('The brand.'),
	eventDate: IsoDateSchema.optional().describe('The event date.'),
	inquiryDate: IsoDateSchema.optional().describe('The inquiry date.'),
	guestCount: z.number().int().min(0).optional().describe('The guest count.'),
	closedReasonId: EntityIdSchema.optional().describe('The closed reason.'),
});

export type JobsCreateInput = z.input<typeof JobsCreateInputSchema>;

export const JobsCreateResponseSchema = JobSchema;

export type JobsCreateResponse = z.infer<typeof JobsCreateResponseSchema>;

export const JobsUpdateInputSchema = z
	.object({
		jobId: EntityIdSchema,
		title: z.string().max(160).optional(),
		name: z.string().max(160).optional(),
		stage: z.enum(['lead', 'booked', 'fulfillment', 'completed']).optional(),
		jobTypeId: EntityIdSchema.nullable().optional(),
		leadSourceId: EntityIdSchema.nullable().optional(),
		leadStatusId: EntityIdSchema.nullable().optional(),
		brandId: EntityIdSchema.nullable().optional(),
		eventDate: IsoDateSchema.nullable().optional(),
		inquiryDate: IsoDateSchema.nullable().optional(),
		guestCount: z.number().int().min(0).optional(),
		closed: z.boolean().optional(),
		closedReasonId: EntityIdSchema.nullable().optional(),
		closedDate: IsoDateSchema.nullable().optional(),
	})
	.refine(
		(value) => Object.keys(value).some((key) => key !== 'jobId'),
		'Provide at least one field to change.',
	);

export type JobsUpdateInput = z.input<typeof JobsUpdateInputSchema>;

export const JobsUpdateResponseSchema = JobSchema;

export type JobsUpdateResponse = z.infer<typeof JobsUpdateResponseSchema>;

export const JobsRemoveInputSchema = z.object({ jobId: EntityIdSchema });

export type JobsRemoveInput = z.infer<typeof JobsRemoveInputSchema>;

export const JobsPaymentsInputSchema = z.object({ jobId: EntityIdSchema });

export type JobsPaymentsInput = z.infer<typeof JobsPaymentsInputSchema>;

// ── products ──────────────────────────────────────────────────────────────

export const ProductSchema = z
	.object({
		id: z.string(),
		created: z.string().nullish(),
		modified: z.string().nullish(),
		hidden: z.boolean().nullish(),
		name: z.string().nullish(),
		// Amounts are integers in the studio currency.
		price: z.number().nullish(),
		type: z.string().nullish(),
		sku: z.string().nullish(),
		descriptionHtml: z.string().nullish(),
		manualEntry: z.boolean().nullish(),
		taxable: z.boolean().nullish(),
		deliverable: z.boolean().nullish(),
		vendorId: z.string().nullish(),
		expenseCategoryId: z.string().nullish(),
	})
	.loose();

export type TaveProduct = z.infer<typeof ProductSchema>;

export const ProductsListInputSchema = z.object({
	// The API documents only sortBy on this route: it has no page or pageSize,
	// so asking for them would silently return the whole list.
	sortBy: SortBySchema,
});

export type ProductsListInput = z.infer<typeof ProductsListInputSchema>;

export const ProductsListResponseSchema = collection(ProductSchema);

export type ProductsListResponse = z.infer<typeof ProductsListResponseSchema>;

export const ProductsGetInputSchema = z.object({ productId: EntityIdSchema });

export type ProductsGetInput = z.infer<typeof ProductsGetInputSchema>;

export const ProductsGetResponseSchema = ProductSchema;

export type ProductsGetResponse = z.infer<typeof ProductsGetResponseSchema>;

export const ProductsCreateInputSchema = z.object({
	name: z.string().min(1).max(128).describe('The product name.'),
	price: z
		.number()
		.int()
		.min(0)
		.describe('The price as an integer in the studio currency, not a decimal.'),
	type: EntityIdSchema.optional().describe('The product type.'),
	sku: z.string().max(48).optional(),
	descriptionHtml: z.string().optional(),
	manualEntry: z.boolean().optional(),
	taxable: z.boolean().optional(),
	deliverable: z.boolean().optional(),
	vendorId: EntityIdSchema.optional(),
	expenseCategoryId: EntityIdSchema.optional(),
});

export type ProductsCreateInput = z.input<typeof ProductsCreateInputSchema>;

export const ProductsCreateResponseSchema = ProductSchema;

export type ProductsCreateResponse = z.infer<
	typeof ProductsCreateResponseSchema
>;

export const ProductsUpdateInputSchema = z
	.object({
		productId: EntityIdSchema,
		name: z.string().min(1).max(128).optional(),
		price: z.number().int().min(0).optional(),
		type: EntityIdSchema.nullable().optional(),
		sku: z.string().max(48).nullable().optional(),
		descriptionHtml: z.string().nullable().optional(),
		manualEntry: z.boolean().optional(),
		taxable: z.boolean().optional(),
		deliverable: z.boolean().optional(),
		vendorId: EntityIdSchema.nullable().optional(),
		expenseCategoryId: EntityIdSchema.nullable().optional(),
	})
	.refine(
		(value) => Object.keys(value).some((key) => key !== 'productId'),
		'Provide at least one field to change.',
	);

export type ProductsUpdateInput = z.input<typeof ProductsUpdateInputSchema>;

export const ProductsUpdateResponseSchema = ProductSchema;

export type ProductsUpdateResponse = z.infer<
	typeof ProductsUpdateResponseSchema
>;

export const ProductsRemoveInputSchema = z.object({
	productId: EntityIdSchema,
});

export type ProductsRemoveInput = z.infer<typeof ProductsRemoveInputSchema>;

// ── payments ──────────────────────────────────────────────────────────────

export const PaymentSchema = z
	.object({
		id: z.string(),
		created: z.string().nullish(),
		modified: z.string().nullish(),
		hidden: z.boolean().nullish(),
		jobId: z.string().nullish(),
		payerId: z.string().nullish(),
		paymentMethodId: z.string().nullish(),
		invoiceItemId: z.string().nullish(),
		status: z.string().nullish(),
		// Amounts are integers in the studio currency.
		amount: z.number().nullish(),
		refundedAmount: z.number().nullish(),
		memo: z.string().nullish(),
		checkNumber: z.string().nullish(),
		transactionId: z.string().nullish(),
		authCode: z.string().nullish(),
		received: z.string().nullish(),
		links: LinksSchema.nullish(),
	})
	.loose();

export type TavePayment = z.infer<typeof PaymentSchema>;

export const PaymentsListInputSchema = z.object({
	page: PageSchema,
	pageSize: PageSizeSchema,
	sortBy: SortBySchema,
});

export type PaymentsListInput = z.infer<typeof PaymentsListInputSchema>;

export const PaymentsListResponseSchema = collection(PaymentSchema);

export type PaymentsListResponse = z.infer<typeof PaymentsListResponseSchema>;

export const PaymentsGetInputSchema = z.object({ paymentId: EntityIdSchema });

export type PaymentsGetInput = z.infer<typeof PaymentsGetInputSchema>;

export const PaymentsGetResponseSchema = PaymentSchema;

export type PaymentsGetResponse = z.infer<typeof PaymentsGetResponseSchema>;

export const PaymentsCreateInputSchema = z.object({
	jobId: EntityIdSchema.describe('The job the payment belongs to.'),
	amount: z
		.number()
		.int()
		.min(1)
		.describe('The amount as an integer in the studio currency, above 0.'),
	status: z
		.enum(['future', 'confirmed-future', 'posted', 'failed', 'pending'])
		.optional()
		.describe('The payment status. The API defaults it to "posted".'),
	paymentMethodId: EntityIdSchema.optional(),
	payerId: EntityIdSchema.optional(),
	invoiceItemId: EntityIdSchema.optional(),
	memo: z.string().optional(),
	checkNumber: z.string().optional(),
	transactionId: z.string().optional(),
	authCode: z.string().optional(),
	received: z.string().optional().describe('When the payment was received.'),
});

export type PaymentsCreateInput = z.input<typeof PaymentsCreateInputSchema>;

export const PaymentsCreateResponseSchema = PaymentSchema;

export type PaymentsCreateResponse = z.infer<
	typeof PaymentsCreateResponseSchema
>;

export const PaymentsUpdateInputSchema = z
	.object({
		paymentId: EntityIdSchema,
		amount: z.number().int().min(1).optional(),
		status: z
			.enum(['future', 'confirmed-future', 'posted', 'failed', 'pending'])
			.optional(),
		paymentMethodId: EntityIdSchema.nullable().optional(),
		payerId: EntityIdSchema.nullable().optional(),
		memo: z.string().nullable().optional(),
		checkNumber: z.string().nullable().optional(),
		transactionId: z.string().nullable().optional(),
		authCode: z.string().nullable().optional(),
		received: z.string().nullable().optional(),
	})
	.refine(
		(value) => Object.keys(value).some((key) => key !== 'paymentId'),
		'Provide at least one field to change.',
	);

export type PaymentsUpdateInput = z.input<typeof PaymentsUpdateInputSchema>;

export const PaymentsUpdateResponseSchema = PaymentSchema;

export type PaymentsUpdateResponse = z.infer<
	typeof PaymentsUpdateResponseSchema
>;

export const PaymentsRemoveInputSchema = z.object({
	paymentId: EntityIdSchema,
});

export type PaymentsRemoveInput = z.infer<typeof PaymentsRemoveInputSchema>;

// ── tasks ─────────────────────────────────────────────────────────────────

// The docs mark `name` and `taskListId` required on a task create.
export const TaskSchema = z
	.object({
		id: z.string(),
		created: z.string().nullish(),
		modified: z.string().nullish(),
		hidden: z.boolean().nullish(),
		name: z.string().nullish(),
		taskListId: z.string().nullish(),
		jobId: z.string().nullish(),
		userId: z.string().nullish(),
		completed: z.boolean().nullish(),
		completedAt: z.string().nullish(),
		completedById: z.string().nullish(),
		dueDate: z.string().nullish(),
		links: LinksSchema.nullish(),
	})
	.loose();

export type TaveTask = z.infer<typeof TaskSchema>;

export const TasksListInputSchema = z.object({
	page: PageSchema,
	pageSize: PageSizeSchema,
});

export type TasksListInput = z.infer<typeof TasksListInputSchema>;

export const TasksListResponseSchema = collection(TaskSchema);

export type TasksListResponse = z.infer<typeof TasksListResponseSchema>;

export const TasksCreateInputSchema = z.object({
	name: z.string().min(1).describe('The task name.'),
	taskListId: EntityIdSchema.describe('The task list the task belongs to.'),
	jobId: EntityIdSchema.optional(),
	userId: EntityIdSchema.optional().describe(
		'The user the task is assigned to.',
	),
	dueDate: IsoDateSchema.optional(),
	completed: z.boolean().optional(),
});

export type TasksCreateInput = z.input<typeof TasksCreateInputSchema>;

export const TasksCreateResponseSchema = TaskSchema;

export type TasksCreateResponse = z.infer<typeof TasksCreateResponseSchema>;

export const TasksUpdateInputSchema = z
	.object({
		taskId: EntityIdSchema,
		name: z.string().min(1).optional(),
		completed: z.boolean().optional(),
		userId: EntityIdSchema.nullable().optional(),
		dueDate: IsoDateSchema.nullable().optional(),
	})
	.refine(
		(value) => Object.keys(value).some((key) => key !== 'taskId'),
		'Provide at least one field to change.',
	);

export type TasksUpdateInput = z.input<typeof TasksUpdateInputSchema>;

export const TasksUpdateResponseSchema = TaskSchema;

export type TasksUpdateResponse = z.infer<typeof TasksUpdateResponseSchema>;

export const TasksRemoveInputSchema = z.object({ taskId: EntityIdSchema });

export type TasksRemoveInput = z.infer<typeof TasksRemoveInputSchema>;

export const TaskListsListInputSchema = z.object({
	page: PageSchema,
	pageSize: PageSizeSchema,
});

export type TaskListsListInput = z.infer<typeof TaskListsListInputSchema>;

const TaskListSchema = z
	.object({
		id: z.string(),
		name: z.string().nullish(),
		created: z.string().nullish(),
		modified: z.string().nullish(),
	})
	.loose();

export const TaskListsListResponseSchema = collection(TaskListSchema);

export type TaskListsListResponse = z.infer<typeof TaskListsListResponseSchema>;

// ── notes ─────────────────────────────────────────────────────────────────

export const NoteSchema = z
	.object({
		id: z.string(),
		created: z.string().nullish(),
		modified: z.string().nullish(),
		hidden: z.boolean().nullish(),
		contentHtml: z.string().nullish(),
		date: z.string().nullish(),
		jobId: z.string().nullish(),
		contactId: z.string().nullish(),
		authorId: z.string().nullish(),
		author: z.string().nullish(),
	})
	.loose();

export type TaveNote = z.infer<typeof NoteSchema>;

export const NotesListInputSchema = z.object({
	page: PageSchema,
	pageSize: PageSizeSchema,
	jobId: EntityIdSchema.optional().describe('Only notes on this job.'),
});

export type NotesListInput = z.infer<typeof NotesListInputSchema>;

export const NotesListResponseSchema = collection(NoteSchema);

export type NotesListResponse = z.infer<typeof NotesListResponseSchema>;

export const NotesCreateInputSchema = z.object({
	contentHtml: z.string().min(1).describe('The note body as HTML.'),
	jobId: EntityIdSchema.optional(),
	contactId: EntityIdSchema.optional(),
	date: IsoDateSchema.optional(),
});

export type NotesCreateInput = z.input<typeof NotesCreateInputSchema>;

export const NotesCreateResponseSchema = NoteSchema;

export type NotesCreateResponse = z.infer<typeof NotesCreateResponseSchema>;

export const NotesRemoveInputSchema = z.object({ noteId: EntityIdSchema });

export type NotesRemoveInput = z.infer<typeof NotesRemoveInputSchema>;

// ── organization reference data ───────────────────────────────────────────

/** Job types, lead sources, lead statuses and brands all list the same way. */
export const NamedResourceSchema = z
	.object({
		id: z.string(),
		name: z.string().nullish(),
		alias: z.string().nullish(),
		created: z.string().nullish(),
		modified: z.string().nullish(),
		hidden: z.boolean().nullish(),
	})
	.loose();

export type TaveNamedResource = z.infer<typeof NamedResourceSchema>;

export const ListOnlyInputSchema = z.object({
	page: PageSchema,
	pageSize: PageSizeSchema,
});

export type ListOnlyInput = z.infer<typeof ListOnlyInputSchema>;

export const NamedResourceListResponseSchema = collection(NamedResourceSchema);

export type NamedResourceListResponse = z.infer<
	typeof NamedResourceListResponseSchema
>;

// ── studio ────────────────────────────────────────────────────────────────

export const StudioInputSchema = z.object({});

export type StudioInput = z.infer<typeof StudioInputSchema>;

export const StudioSchema = z
	.object({
		id: z.string().nullish(),
		name: z.string().nullish(),
		alias: z.string().nullish(),
		currency: z.string().nullish(),
		timezone: z.string().nullish(),
		email: z.string().nullish(),
		phone: z.string().nullish(),
		links: LinksSchema.nullish(),
	})
	.loose();

export type TaveStudio = z.infer<typeof StudioSchema>;

export const StudioResponseSchema = StudioSchema;

export type StudioResponse = z.infer<typeof StudioResponseSchema>;

// ── registry ──────────────────────────────────────────────────────────────

export type TaveEndpointInputs = {
	jobsList: JobsListInput;
	jobsGet: JobsGetInput;
	jobsCreate: JobsCreateInput;
	jobsUpdate: JobsUpdateInput;
	jobsRemove: JobsRemoveInput;
	jobsPayments: JobsPaymentsInput;
	productsList: ProductsListInput;
	productsGet: ProductsGetInput;
	productsCreate: ProductsCreateInput;
	productsUpdate: ProductsUpdateInput;
	productsRemove: ProductsRemoveInput;
	paymentsList: PaymentsListInput;
	paymentsGet: PaymentsGetInput;
	paymentsCreate: PaymentsCreateInput;
	paymentsUpdate: PaymentsUpdateInput;
	paymentsRemove: PaymentsRemoveInput;
	tasksList: TasksListInput;
	tasksCreate: TasksCreateInput;
	tasksUpdate: TasksUpdateInput;
	tasksRemove: TasksRemoveInput;
	taskListsList: TaskListsListInput;
	notesList: NotesListInput;
	notesCreate: NotesCreateInput;
	notesRemove: NotesRemoveInput;
	jobTypesList: ListOnlyInput;
	leadSourcesList: ListOnlyInput;
	leadStatusesList: ListOnlyInput;
	brandsList: ListOnlyInput;
	studioGet: StudioInput;
};

export type TaveEndpointOutputs = {
	jobsList: JobsListResponse;
	jobsGet: JobsGetResponse;
	jobsCreate: JobsCreateResponse;
	jobsUpdate: JobsUpdateResponse;
	jobsRemove: DeletedResponse;
	jobsPayments: PaymentsListResponse;
	productsList: ProductsListResponse;
	productsGet: ProductsGetResponse;
	productsCreate: ProductsCreateResponse;
	productsUpdate: ProductsUpdateResponse;
	productsRemove: DeletedResponse;
	paymentsList: PaymentsListResponse;
	paymentsGet: PaymentsGetResponse;
	paymentsCreate: PaymentsCreateResponse;
	paymentsUpdate: PaymentsUpdateResponse;
	paymentsRemove: DeletedResponse;
	tasksList: TasksListResponse;
	tasksCreate: TasksCreateResponse;
	tasksUpdate: TasksUpdateResponse;
	tasksRemove: DeletedResponse;
	taskListsList: TaskListsListResponse;
	notesList: NotesListResponse;
	notesCreate: NotesCreateResponse;
	notesRemove: DeletedResponse;
	jobTypesList: NamedResourceListResponse;
	leadSourcesList: NamedResourceListResponse;
	leadStatusesList: NamedResourceListResponse;
	brandsList: NamedResourceListResponse;
	studioGet: StudioResponse;
};

export const TaveEndpointInputSchemas = {
	jobsList: JobsListInputSchema,
	jobsGet: JobsGetInputSchema,
	jobsCreate: JobsCreateInputSchema,
	jobsUpdate: JobsUpdateInputSchema,
	jobsRemove: JobsRemoveInputSchema,
	jobsPayments: JobsPaymentsInputSchema,
	productsList: ProductsListInputSchema,
	productsGet: ProductsGetInputSchema,
	productsCreate: ProductsCreateInputSchema,
	productsUpdate: ProductsUpdateInputSchema,
	productsRemove: ProductsRemoveInputSchema,
	paymentsList: PaymentsListInputSchema,
	paymentsGet: PaymentsGetInputSchema,
	paymentsCreate: PaymentsCreateInputSchema,
	paymentsUpdate: PaymentsUpdateInputSchema,
	paymentsRemove: PaymentsRemoveInputSchema,
	tasksList: TasksListInputSchema,
	tasksCreate: TasksCreateInputSchema,
	tasksUpdate: TasksUpdateInputSchema,
	tasksRemove: TasksRemoveInputSchema,
	taskListsList: TaskListsListInputSchema,
	notesList: NotesListInputSchema,
	notesCreate: NotesCreateInputSchema,
	notesRemove: NotesRemoveInputSchema,
	jobTypesList: ListOnlyInputSchema,
	leadSourcesList: ListOnlyInputSchema,
	leadStatusesList: ListOnlyInputSchema,
	brandsList: ListOnlyInputSchema,
	studioGet: StudioInputSchema,
} as const;

export const TaveEndpointOutputSchemas = {
	jobsList: JobsListResponseSchema,
	jobsGet: JobsGetResponseSchema,
	jobsCreate: JobsCreateResponseSchema,
	jobsUpdate: JobsUpdateResponseSchema,
	jobsRemove: DeletedResponseSchema,
	jobsPayments: PaymentsListResponseSchema,
	productsList: ProductsListResponseSchema,
	productsGet: ProductsGetResponseSchema,
	productsCreate: ProductsCreateResponseSchema,
	productsUpdate: ProductsUpdateResponseSchema,
	productsRemove: DeletedResponseSchema,
	paymentsList: PaymentsListResponseSchema,
	paymentsGet: PaymentsGetResponseSchema,
	paymentsCreate: PaymentsCreateResponseSchema,
	paymentsUpdate: PaymentsUpdateResponseSchema,
	paymentsRemove: DeletedResponseSchema,
	tasksList: TasksListResponseSchema,
	tasksCreate: TasksCreateResponseSchema,
	tasksUpdate: TasksUpdateResponseSchema,
	tasksRemove: DeletedResponseSchema,
	taskListsList: TaskListsListResponseSchema,
	notesList: NotesListResponseSchema,
	notesCreate: NotesCreateResponseSchema,
	notesRemove: DeletedResponseSchema,
	jobTypesList: NamedResourceListResponseSchema,
	leadSourcesList: NamedResourceListResponseSchema,
	leadStatusesList: NamedResourceListResponseSchema,
	brandsList: NamedResourceListResponseSchema,
	studioGet: StudioResponseSchema,
} as const;
