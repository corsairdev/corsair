import { z } from 'zod';

// Common sub-schemas
export const GeoLocationSchema = z
	.object({
		lat: z.number().optional(),
		lon: z.number().optional(),
	})
	.strict();

export const RelatedReferenceSchema = z
	.object({
		id: z.string(),
		type: z.string().optional(),
		name: z.string().optional(),
		number: z.string().optional(),
		email: z.string().nullable().optional(),
	})
	.strict();

export const PrimaryReferenceSchema = z
	.object({
		id: z.string(),
		type: z.string().optional(),
		name: z.string().optional(),
		number: z.string().optional(),
	})
	.strict();

export const OwnerReferenceSchema = z
	.object({
		id: z.string(),
	})
	.strict();

// Common pagination query schema
export const ListQuerySchema = z
	.object({
		size: z.number().min(1).max(1000).optional(),
		from: z.number().min(0).optional(),
		sort: z.string().optional(),
		direction: z.enum(['asc', 'desc']).optional(),
		actor: z.string().optional(),
	})
	.strict();

// -------------------------------------------------------------
// 1. Contacts Schemas
// -------------------------------------------------------------
export const ContactInputSchema = z
	.object({
		first_name: z.string().optional(),
		last_name: z.string().optional(),
		display_name: z.string().optional(),
		company_name: z.string().optional(),
		record_type_name: z.string().optional(),
		status_name: z.string().optional(),
		email: z.string().optional(),
		home_phone: z.string().optional(),
		mobile_phone: z.string().optional(),
		work_phone: z.string().optional(),
		fax_number: z.string().optional(),
		address_line1: z.string().optional(),
		address_line2: z.string().optional(),
		city: z.string().optional(),
		state_text: z.string().optional(),
		zip: z.string().optional(),
		country_name: z.string().optional(),
		description: z.string().optional(),
		sales_rep: z.string().optional(),
		source_name: z.string().optional(),
		is_active: z.boolean().optional(),
		geo: GeoLocationSchema.optional(),
		owners: z.array(OwnerReferenceSchema).optional(),
		related: z.array(RelatedReferenceSchema).optional(),
	})
	.strict();

export const ContactsCreateInputSchema = ContactInputSchema;

export const ContactsUpdateInputSchema = ContactInputSchema.extend({
	jnid: z.string(),
}).strict();

export const ContactsDeleteInputSchema = z
	.object({
		jnid: z.string(),
	})
	.strict();

export const ContactsGetInputSchema = z
	.object({
		jnid: z.string(),
	})
	.strict();

export const ContactsListInputSchema = ListQuerySchema;

// `unknown` in record because JobNimbus allows arbitrary custom fields defined by customers.
export const ContactResponseSchema = z
	.object({
		jnid: z.string().optional(),
		first_name: z.string().nullable().optional(),
		last_name: z.string().nullable().optional(),
		display_name: z.string().nullable().optional(),
		company_name: z.string().nullable().optional(),
		record_type_name: z.string().nullable().optional(),
		status_name: z.string().nullable().optional(),
		email: z.string().nullable().optional(),
		home_phone: z.string().nullable().optional(),
		mobile_phone: z.string().nullable().optional(),
		work_phone: z.string().nullable().optional(),
		fax_number: z.string().nullable().optional(),
		address_line1: z.string().nullable().optional(),
		address_line2: z.string().nullable().optional(),
		city: z.string().nullable().optional(),
		state_text: z.string().nullable().optional(),
		zip: z.string().nullable().optional(),
		country_name: z.string().nullable().optional(),
		is_active: z.boolean().optional(),
		date_created: z.number().optional(),
		date_updated: z.number().optional(),
	})
	// passthrough allows user-defined custom fields on JobNimbus contact records.
	.passthrough();

export const ContactsListResponseSchema = z.object({
	count: z.number().optional(),
	results: z.array(ContactResponseSchema).optional(),
});

// -------------------------------------------------------------
// 2. Jobs Schemas
// -------------------------------------------------------------
export const JobInputSchema = z
	.object({
		name: z.string().optional(),
		record_type_name: z.string().optional(),
		status_name: z.string().optional(),
		description: z.string().optional(),
		address_line1: z.string().optional(),
		address_line2: z.string().optional(),
		city: z.string().optional(),
		state_text: z.string().optional(),
		zip: z.string().optional(),
		country_name: z.string().optional(),
		sales_rep: z.string().optional(),
		source_name: z.string().optional(),
		is_active: z.boolean().optional(),
		geo: GeoLocationSchema.optional(),
		primary: PrimaryReferenceSchema.optional(),
		owners: z.array(OwnerReferenceSchema).optional(),
		related: z.array(RelatedReferenceSchema).optional(),
	})
	.strict();

export const JobsCreateInputSchema = JobInputSchema.extend({
	name: z.string(),
	record_type_name: z.string(),
	status_name: z.string(),
}).strict();

export const JobsUpdateInputSchema = JobInputSchema.extend({
	jnid: z.string(),
}).strict();

export const JobsDeleteInputSchema = z
	.object({
		jnid: z.string(),
	})
	.strict();

export const JobsGetInputSchema = z
	.object({
		jnid: z.string(),
	})
	.strict();

export const JobsListInputSchema = ListQuerySchema;

export const JobResponseSchema = z
	.object({
		jnid: z.string().optional(),
		name: z.string().optional(),
		record_type_name: z.string().nullable().optional(),
		status_name: z.string().nullable().optional(),
		number: z.string().nullable().optional(),
		description: z.string().nullable().optional(),
		is_active: z.boolean().optional(),
		date_created: z.number().optional(),
		date_updated: z.number().optional(),
	})
	// passthrough allows user-defined custom fields on JobNimbus job records.
	.passthrough();

export const JobsListResponseSchema = z.object({
	count: z.number().optional(),
	results: z.array(JobResponseSchema).optional(),
});

// -------------------------------------------------------------
// 3. Tasks Schemas
// -------------------------------------------------------------
export const TaskInputSchema = z
	.object({
		title: z.string().optional(),
		date_start: z.number().optional(),
		date_end: z.number().optional(),
		record_type: z.number().optional(),
		record_type_name: z.string().optional(),
		description: z.string().optional(),
		is_completed: z.boolean().optional(),
		is_active: z.boolean().optional(),
		primary: PrimaryReferenceSchema.optional(),
		related: z.array(RelatedReferenceSchema).optional(),
		assigned_to: z.array(OwnerReferenceSchema).optional(),
	})
	.strict();

export const TasksCreateInputSchema = TaskInputSchema.extend({
	title: z.string(),
	date_start: z.number(),
}).strict();

export const TasksUpdateInputSchema = TaskInputSchema.extend({
	jnid: z.string(),
}).strict();

export const TasksDeleteInputSchema = z
	.object({
		jnid: z.string(),
	})
	.strict();

export const TasksGetInputSchema = z
	.object({
		jnid: z.string(),
	})
	.strict();

export const TasksListInputSchema = ListQuerySchema;

export const TaskResponseSchema = z
	.object({
		jnid: z.string().optional(),
		title: z.string().optional(),
		date_start: z.number().optional(),
		date_end: z.number().optional(),
		record_type: z.number().optional(),
		record_type_name: z.string().nullable().optional(),
		description: z.string().nullable().optional(),
		is_completed: z.boolean().optional(),
		is_active: z.boolean().optional(),
		date_created: z.number().optional(),
		date_updated: z.number().optional(),
	})
	// passthrough allows user-defined custom fields on JobNimbus task records.
	.passthrough();

export const TasksListResponseSchema = z.object({
	count: z.number().optional(),
	results: z.array(TaskResponseSchema).optional(),
});

// -------------------------------------------------------------
// 4. Activities Schemas
// -------------------------------------------------------------
export const ActivitiesCreateInputSchema = z
	.object({
		note: z.string(),
		date_created: z.number().optional(),
		record_type_name: z.string().optional(),
		primary: PrimaryReferenceSchema.optional(),
		related: z.array(RelatedReferenceSchema).optional(),
	})
	.strict();

export const ActivitiesGetInputSchema = z
	.object({
		jnid: z.string(),
	})
	.strict();

export const ActivitiesListInputSchema = ListQuerySchema;

export const ActivityResponseSchema = z
	.object({
		jnid: z.string().optional(),
		note: z.string().optional(),
		record_type_name: z.string().nullable().optional(),
		date_created: z.number().optional(),
		date_updated: z.number().optional(),
		created_by: z.string().optional(),
		created_by_name: z.string().optional(),
	})
	// passthrough allows user-defined custom fields on JobNimbus activity records.
	.passthrough();

export const ActivitiesListResponseSchema = z.object({
	count: z.number().optional(),
	results: z.array(ActivityResponseSchema).optional(),
});

// -------------------------------------------------------------
// 5. Files Schemas
// -------------------------------------------------------------
export const FilesCreateInputSchema = z
	.object({
		data: z.string(),
		filename: z.string(),
		description: z.string().optional(),
		type: z.number().optional(),
		subtype: z.string().optional(),
		related: z.array(z.string()).optional(),
		is_private: z.boolean().optional(),
		date: z.number().optional(),
		persist: z.boolean().optional(),
	})
	.strict();

export const FilesCreateFromUrlInputSchema = z
	.object({
		url: z.string(),
		type: z.string().optional(),
		description: z.string().optional(),
		name: z.string().optional(),
		related: z.array(z.string()).optional(),
	})
	.strict();

export const FilesRequestSinglePartUploadInputSchema = z
	.object({
		filename: z.string(),
		type: z.number(),
		related: z.array(z.string()),
		isPrivate: z.boolean().optional(),
		description: z.string().max(1000).optional(),
	})
	.strict();

export const FilesCompleteSinglePartUploadInputSchema = z
	.object({
		jnid: z.string(),
		generateThumbnail: z.boolean().optional(),
	})
	.strict();

export const FilesRequestMultipartUploadInputSchema = z
	.object({
		partCount: z.number().min(1),
		fileSize: z.number().min(0),
		isPrivate: z.boolean(),
		related: z.array(z.string()),
		type: z.number(),
		filename: z.string(),
		description: z.string().optional(),
	})
	.strict();

export const MultipartPartItemSchema = z
	.object({
		partNumber: z.number(),
		etag: z.string(),
	})
	.strict();

export const FilesCompleteMultipartUploadInputSchema = z
	.object({
		jnid: z.string(),
		uploadId: z.string(),
		parts: z.array(MultipartPartItemSchema),
		generateThumbnail: z.boolean().optional(),
	})
	.strict();

export const FilesAbortMultipartUploadInputSchema = z
	.object({
		key: z.string(),
		uploadId: z.string(),
	})
	.strict();

export const FilesListInputSchema = ListQuerySchema;

export const FilesGetInputSchema = z
	.object({
		jnid: z.string(),
	})
	.strict();

export const FileItemSchema = z
	.object({
		jnid: z.string().optional(),
		filename: z.string().optional(),
		content_type: z.string().nullable().optional(),
		size: z.number().optional(),
		type: z.string().nullable().optional(),
		record_type: z.number().optional(),
		record_type_name: z.string().nullable().optional(),
		description: z.string().nullable().optional(),
		is_private: z.boolean().optional(),
		is_active: z.boolean().optional(),
		date_created: z.number().optional(),
		date_updated: z.number().optional(),
	})
	// passthrough allows provider metadata on files.
	.passthrough();

export const FilesListResponseSchema = z.object({
	count: z.number().optional(),
	files: z.array(FileItemSchema).optional(),
});

export const FileResponseSchema = FileItemSchema;

export const FileUploadUrlResponseSchema = z
	.object({
		data: z
			.object({
				presignedUrl: z.string().optional(),
				jnid: z.string().optional(),
				presignedUrls: z.array(z.string()).optional(),
				uploadId: z.string().optional(),
			})
			.passthrough()
			.optional(),
		presignedUrl: z.string().optional(),
		jnid: z.string().optional(),
	})
	// passthrough for provider upload envelopes.
	.passthrough();

export const FileUploadCompleteResponseSchema = z
	.object({
		data: z
			.object({
				jnid: z.string().optional(),
				thumbnailUrl: z.string().optional(),
			})
			.passthrough()
			.optional(),
		jnid: z.string().optional(),
		thumbnailUrl: z.string().optional(),
	})
	// passthrough for upload completion envelope.
	.passthrough();

export const FileAbortResponseSchema = z
	.object({
		success: z.boolean().optional(),
		message: z.string().optional(),
	})
	// passthrough for abort response payload.
	.passthrough();

// -------------------------------------------------------------
// 6. Products Schemas
// -------------------------------------------------------------
export const ProductUomItemSchema = z
	.object({
		uom: z.string().optional(),
		material: z.record(z.string(), z.unknown()).optional(),
		labor: z.record(z.string(), z.unknown()).optional(),
	})
	// passthrough for unit of measurement structure.
	.passthrough();

export const ProductInputSchema = z
	.object({
		name: z.string().optional(),
		description: z.string().optional(),
		suppliers: z.array(z.unknown()).optional(),
		location_id: z.number().optional(),
		is_active: z.boolean().optional(),
		tax_exempt: z.boolean().optional(),
		item_type: z.string().optional(),
		uoms: z.array(ProductUomItemSchema).optional(),
		external_id: z.string().optional(),
	})
	.strict();

export const ProductsCreateInputSchema = ProductInputSchema.extend({
	name: z.string(),
}).strict();

export const ProductsUpdateInputSchema = ProductInputSchema.extend({
	jnid: z.string(),
}).strict();

export const ProductsDeleteInputSchema = z
	.object({
		jnid: z.string(),
	})
	.strict();

export const ProductsGetInputSchema = z
	.object({
		jnid: z.string(),
	})
	.strict();

export const ProductsListInputSchema = ListQuerySchema;

export const ProductResponseSchema = z
	.object({
		type: z.string().optional(),
		jnid: z.string().optional(),
		name: z.string().optional(),
		description: z.string().nullable().optional(),
		is_active: z.boolean().optional(),
		tax_exempt: z.boolean().optional(),
		item_type: z.string().optional(),
		location_id: z.number().optional(),
		date_created: z.number().optional(),
		date_updated: z.number().optional(),
	})
	// passthrough for custom product properties.
	.passthrough();

export const ProductsListResponseSchema = z.object({
	count: z.number().optional(),
	results: z.array(ProductResponseSchema).optional(),
});

// -------------------------------------------------------------
// 7. MaterialOrders Schemas
// -------------------------------------------------------------
export const MaterialOrderItemSchema = z
	.object({
		category: z.string().optional(),
		color: z.string().nullable().optional(),
		cost: z.number().optional(),
		description: z.string().optional(),
		name: z.string().optional(),
		quantity: z.number().optional(),
		uom: z.string().optional(),
	})
	// passthrough for material order line items.
	.passthrough();

export const MaterialOrderAddressSchema = z
	.object({
		address_line1: z.string().optional(),
		address_line2: z.string().optional(),
		city: z.string().optional(),
		state_text: z.string().optional(),
		zip: z.string().optional(),
		geo: GeoLocationSchema.optional(),
	})
	.strict();

export const MaterialOrderInputSchema = z
	.object({
		customer_note: z.string().nullable().optional(),
		internal_note: z.string().nullable().optional(),
		external_id: z.string().nullable().optional(),
		is_active: z.boolean().optional(),
		is_archived: z.boolean().optional(),
		esigned: z.boolean().optional(),
		items: z.array(MaterialOrderItemSchema).optional(),
		address: MaterialOrderAddressSchema.optional(),
		related: z.array(RelatedReferenceSchema).optional(),
	})
	.strict();

export const MaterialOrdersCreateInputSchema = MaterialOrderInputSchema;

export const MaterialOrdersUpdateInputSchema = MaterialOrderInputSchema.extend({
	jnid: z.string(),
}).strict();

export const MaterialOrdersDeleteInputSchema = z
	.object({
		jnid: z.string(),
	})
	.strict();

export const MaterialOrdersGetInputSchema = z
	.object({
		jnid: z.string(),
	})
	.strict();

export const MaterialOrdersListInputSchema = ListQuerySchema;

export const MaterialOrderResponseSchema = z
	.object({
		type: z.string().optional(),
		jnid: z.string().optional(),
		customer_note: z.string().nullable().optional(),
		internal_note: z.string().nullable().optional(),
		is_active: z.boolean().optional(),
		date_created: z.number().optional(),
		date_updated: z.number().optional(),
	})
	// passthrough for custom material order fields.
	.passthrough();

export const MaterialOrdersListResponseSchema = z.object({
	count: z.number().optional(),
	results: z.array(MaterialOrderResponseSchema).optional(),
});

// -------------------------------------------------------------
// 8. WorkOrders Schemas
// -------------------------------------------------------------
export const WorkOrderInputSchema = z
	.object({
		customer: z.string().optional(),
		class_id: z.string().optional(),
		class_name: z.string().optional(),
		external_id: z.string().nullable().optional(),
		supplier: z.string().nullable().optional(),
		internal_note: z.string().optional(),
		is_active: z.boolean().optional(),
		related: z.array(RelatedReferenceSchema).optional(),
		items: z.array(z.unknown()).optional(),
	})
	.strict();

export const WorkOrdersCreateInputSchema = WorkOrderInputSchema;

export const WorkOrdersUpdateInputSchema = WorkOrderInputSchema.extend({
	id: z.string(),
}).strict();

export const WorkOrdersDeleteInputSchema = z
	.object({
		id: z.string(),
	})
	.strict();

export const WorkOrdersGetInputSchema = z
	.object({
		jnid: z.string(),
	})
	.strict();

export const WorkOrdersListInputSchema = ListQuerySchema;

export const WorkOrderResponseSchema = z
	.object({
		type: z.string().optional(),
		jnid: z.string().optional(),
		customer: z.string().optional(),
		is_active: z.boolean().optional(),
		date_created: z.number().optional(),
		date_updated: z.number().optional(),
	})
	// passthrough for custom work order properties.
	.passthrough();

export const WorkOrdersListResponseSchema = z.object({
	count: z.number().optional(),
	results: z.array(WorkOrderResponseSchema).optional(),
});

// -------------------------------------------------------------
// 9. Estimates Schemas
// -------------------------------------------------------------
export const EstimateInputSchema = z
	.object({
		type: z.string().optional(),
		date_estimate: z.number().optional(),
		date_created: z.number().optional(),
		date_updated: z.number().optional(),
		external_id: z.string().optional(),
		number: z.string().optional(),
		status: z.number().optional(),
		internal_note: z.string().optional(),
		is_active: z.boolean().optional(),
		related: z.array(RelatedReferenceSchema).optional(),
		items: z.array(z.unknown()).optional(),
	})
	.strict();

export const EstimatesCreateInputSchema = EstimateInputSchema;

export const EstimatesUpdateInputSchema = EstimateInputSchema.extend({
	jnid: z.string(),
}).strict();

export const EstimatesDeleteInputSchema = z
	.object({
		jnid: z.string(),
	})
	.strict();

export const EstimatesGetInputSchema = z
	.object({
		jnid: z.string(),
	})
	.strict();

export const EstimatesListInputSchema = ListQuerySchema;

export const EstimateResponseSchema = z
	.object({
		type: z.string().optional(),
		jnid: z.string().optional(),
		number: z.string().nullable().optional(),
		status: z.number().optional(),
		is_active: z.boolean().optional(),
		date_estimate: z.number().optional(),
		date_created: z.number().optional(),
		date_updated: z.number().optional(),
	})
	// passthrough for custom estimate properties.
	.passthrough();

export const EstimatesListResponseSchema = z.object({
	count: z.number().optional(),
	results: z.array(EstimateResponseSchema).optional(),
});

// -------------------------------------------------------------
// 10. Invoices Schemas
// -------------------------------------------------------------
export const InvoiceInputSchema = z
	.object({
		type: z.string().optional(),
		date_invoice: z.number().optional(),
		date_due: z.number().optional(),
		date_created: z.number().optional(),
		date_updated: z.number().optional(),
		external_id: z.string().optional(),
		number: z.string().optional(),
		status: z.number().optional(),
		internal_note: z.string().optional(),
		is_active: z.boolean().optional(),
		related: z.array(RelatedReferenceSchema).optional(),
		items: z.array(z.unknown()).optional(),
	})
	.strict();

export const InvoicesCreateInputSchema = InvoiceInputSchema;

export const InvoicesUpdateInputSchema = InvoiceInputSchema.extend({
	jnid: z.string(),
}).strict();

export const InvoicesDeleteInputSchema = z
	.object({
		jnid: z.string(),
	})
	.strict();

export const InvoicesGetInputSchema = z
	.object({
		jnid: z.string(),
	})
	.strict();

export const InvoicesListInputSchema = ListQuerySchema;

export const InvoiceResponseSchema = z
	.object({
		type: z.string().optional(),
		jnid: z.string().optional(),
		number: z.string().nullable().optional(),
		status: z.number().optional(),
		is_active: z.boolean().optional(),
		date_invoice: z.number().optional(),
		date_due: z.number().optional(),
		date_created: z.number().optional(),
		date_updated: z.number().optional(),
	})
	// passthrough for custom invoice properties.
	.passthrough();

export const InvoicesListResponseSchema = z.object({
	count: z.number().optional(),
	results: z.array(InvoiceResponseSchema).optional(),
});

// -------------------------------------------------------------
// 11. Payments Schemas
// -------------------------------------------------------------
export const PaymentInvoiceItemSchema = z
	.object({
		invoice_id: z.string(),
		amount: z.number(),
		invoice_no: z.string().optional(),
		date_created: z.number().optional(),
		created_by: z.string().optional(),
		is_active: z.boolean().optional(),
	})
	.strict();

export const PaymentsCreateInputSchema = z
	.object({
		customer: z.string(),
		date_payment: z.number(),
		total: z.number(),
		type: z.string().optional(),
		reference: z.string().optional(),
		is_active: z.boolean().optional(),
		invoices: z.array(PaymentInvoiceItemSchema).optional(),
		estimates: z.array(z.unknown()).optional(),
		primary: PrimaryReferenceSchema.optional(),
		owners: z.array(OwnerReferenceSchema).optional(),
	})
	.strict();

export const PaymentsListInputSchema = ListQuerySchema;

export const PaymentResponseSchema = z
	.object({
		jnid: z.string().optional(),
		customer: z.string().optional(),
		total: z.number().optional(),
		date_payment: z.number().optional(),
		type: z.string().optional(),
		is_active: z.boolean().optional(),
	})
	// passthrough for custom payment properties.
	.passthrough();

export const PaymentsCreateResponseSchema = z
	.object({
		jnid: z.string(),
		isSuccess: z.boolean().optional(),
		message: z.string().optional(),
		Detail: z.string().optional(),
	})
	// passthrough for payment creation response.
	.passthrough();

export const PaymentsListResponseSchema = z.object({
	count: z.number().optional(),
	results: z.array(PaymentResponseSchema).optional(),
});

// -------------------------------------------------------------
// 12. Budgets Schemas
// -------------------------------------------------------------
export const BudgetsListInputSchema = ListQuerySchema;

export const BudgetResponseSchema = z
	.object({
		jnid: z.string().optional(),
		type: z.string().optional(),
		date_created: z.number().optional(),
		date_updated: z.number().optional(),
	})
	// passthrough for custom budget properties.
	.passthrough();

export const BudgetsListResponseSchema = z.object({
	count: z.number().optional(),
	results: z.array(BudgetResponseSchema).optional(),
});

// -------------------------------------------------------------
// 13. Account Schemas
// -------------------------------------------------------------
export const AccountGetSettingsInputSchema = z
	.object({
		field: z.string().optional(),
	})
	.strict();

export const AccountGetGroupsInputSchema = z.object({}).strict();

export const AccountGetUsersInputSchema = z.object({}).strict();

export const AccountGetUomsInputSchema = z.object({}).strict();

export const AccountCreateWorkflowInputSchema = z
	.object({
		name: z.string(),
		object_type: z.enum(['contact', 'job', 'workorder']),
		is_sub_contractor: z.boolean().optional(),
		can_access_by_all: z.boolean().optional(),
		is_vendor: z.boolean().optional(),
		is_active: z.boolean().optional(),
		is_supplier: z.boolean().optional(),
	})
	.strict();

export const AccountCreateWorkflowStatusInputSchema = z
	.object({
		workflowid: z.string(),
		name: z.string(),
		is_lead: z.boolean().optional(),
		is_closed: z.boolean().optional(),
		is_archived: z.boolean().optional(),
		send_to_quickbooks: z.boolean().optional(),
		force_mobile_sync: z.boolean().optional(),
		is_active: z.boolean().optional(),
	})
	.strict();

export const AccountCreateLeadSourceInputSchema = z
	.object({
		SourceName: z.string(),
		IsActive: z.boolean().optional(),
	})
	.strict();

export const AccountCreateCustomFieldInputSchema = z
	.object({
		title: z.string(),
		object_type: z.enum(['contact', 'job', 'workorder']),
		type: z.enum(['date', 'double', 'long', 'string', 'boolean', 'dropdown']),
		is_required: z.boolean().optional(),
		is_currency: z.boolean().optional(),
		options: z.array(z.string()).optional(),
	})
	.strict();

export const AccountCreateFileTypeInputSchema = z
	.object({
		TypeName: z.string(),
		IsActive: z.boolean().optional(),
	})
	.strict();

export const AccountCreateTaskTypeInputSchema = z
	.object({
		TypeName: z.string(),
		IsActive: z.boolean().optional(),
		HideFromCalendarView: z.boolean().optional(),
		HideFromTaskList: z.boolean().optional(),
		DefaultName: z.string().optional(),
	})
	.strict();

export const AccountCreateActivityTypeInputSchema = z
	.object({
		TypeName: z.string(),
		IsActive: z.boolean().optional(),
		HideFromCalendarView: z.boolean().optional(),
		HideFromTaskList: z.boolean().optional(),
		DefaultName: z.string().optional(),
	})
	.strict();

export const AccountCreateLocationInputSchema = z
	.object({
		name: z.string(),
		address_line1: z.string().optional(),
		address_line2: z.string().optional(),
		code: z.string().optional(),
		city: z.string().optional(),
		zip: z.string().optional(),
		phone: z.string().optional(),
		is_active: z.boolean().optional(),
	})
	.strict();

export const AccountSettingsResponseSchema = z
	.object({
		workflows: z.array(z.unknown()).optional(),
		fileTypes: z.array(z.unknown()).optional(),
		taskTypes: z.array(z.unknown()).optional(),
		activityTypes: z.array(z.unknown()).optional(),
		sources: z.array(z.unknown()).optional(),
	})
	// passthrough for account settings dictionary.
	.passthrough();

export const AccountGroupSchema = z
	.object({
		name: z.string().optional(),
		managers: z.array(z.string()).optional(),
		members: z.array(z.string()).optional(),
	})
	// passthrough for group object.
	.passthrough();

export const AccountGroupsResponseSchema = z.array(AccountGroupSchema);

export const AccountUserSchema = z
	.object({
		id: z.string().optional(),
		first_name: z.string().optional(),
		last_name: z.string().optional(),
		email: z.string().optional(),
		calendar_color: z.string().optional(),
		is_active: z.boolean().optional(),
	})
	// passthrough for user profile fields.
	.passthrough();

export const AccountUsersResponseSchema = z
	.object({
		users: z.array(AccountUserSchema).optional(),
		date_updated: z.number().optional(),
	})
	// passthrough for account users wrapper.
	.passthrough();

export const AccountUomsResponseSchema = z.array(z.string());

export const AccountWorkflowResponseSchema = z
	.object({
		id: z.union([z.string(), z.number()]).optional(),
		name: z.string().optional(),
		object_type: z.string().optional(),
	})
	// passthrough for workflow metadata.
	.passthrough();

export const AccountWorkflowStatusResponseSchema = z
	.object({
		id: z.union([z.string(), z.number()]).optional(),
		name: z.string().optional(),
	})
	// passthrough for workflow status metadata.
	.passthrough();

export const AccountLeadSourceResponseSchema = z
	.object({
		JobSourceId: z.union([z.string(), z.number()]).optional(),
		SourceName: z.string().optional(),
		IsActive: z.boolean().optional(),
	})
	// passthrough for lead source metadata.
	.passthrough();

export const AccountCustomFieldResponseSchema = z
	.object({
		id: z.union([z.string(), z.number()]).optional(),
		title: z.string().optional(),
		object_type: z.string().optional(),
	})
	// passthrough for custom field metadata.
	.passthrough();

export const AccountFileTypeResponseSchema = z
	.object({
		FileTypeId: z.union([z.string(), z.number()]).optional(),
		TypeName: z.string().optional(),
		IsActive: z.boolean().optional(),
	})
	// passthrough for file type metadata.
	.passthrough();

export const AccountTaskTypeResponseSchema = z
	.object({
		TaskTypeId: z.union([z.string(), z.number()]).optional(),
		TypeName: z.string().optional(),
		IsActive: z.boolean().optional(),
	})
	// passthrough for task type metadata.
	.passthrough();

export const AccountActivityTypeResponseSchema = z
	.object({
		ActivityTypeId: z.union([z.string(), z.number()]).optional(),
		TypeName: z.string().optional(),
		IsActive: z.boolean().optional(),
	})
	// passthrough for activity type metadata.
	.passthrough();

export const AccountLocationResponseSchema = z
	.object({
		id: z.union([z.string(), z.number()]).optional(),
		name: z.string().optional(),
		is_active: z.boolean().optional(),
	})
	// passthrough for location metadata.
	.passthrough();

// -------------------------------------------------------------
// Endpoint input & output schemas map
// -------------------------------------------------------------
export const JobNimbusEndpointInputSchemas = {
	// Contacts
	contactsCreate: ContactsCreateInputSchema,
	contactsUpdate: ContactsUpdateInputSchema,
	contactsDelete: ContactsDeleteInputSchema,
	contactsGet: ContactsGetInputSchema,
	contactsList: ContactsListInputSchema,

	// Jobs
	jobsCreate: JobsCreateInputSchema,
	jobsUpdate: JobsUpdateInputSchema,
	jobsDelete: JobsDeleteInputSchema,
	jobsGet: JobsGetInputSchema,
	jobsList: JobsListInputSchema,

	// Tasks
	tasksCreate: TasksCreateInputSchema,
	tasksUpdate: TasksUpdateInputSchema,
	tasksDelete: TasksDeleteInputSchema,
	tasksGet: TasksGetInputSchema,
	tasksList: TasksListInputSchema,

	// Activities
	activitiesCreate: ActivitiesCreateInputSchema,
	activitiesGet: ActivitiesGetInputSchema,
	activitiesList: ActivitiesListInputSchema,

	// Files
	filesCreate: FilesCreateInputSchema,
	filesCreateFromUrl: FilesCreateFromUrlInputSchema,
	filesRequestSinglePartUpload: FilesRequestSinglePartUploadInputSchema,
	filesCompleteSinglePartUpload: FilesCompleteSinglePartUploadInputSchema,
	filesRequestMultipartUpload: FilesRequestMultipartUploadInputSchema,
	filesCompleteMultipartUpload: FilesCompleteMultipartUploadInputSchema,
	filesAbortMultipartUpload: FilesAbortMultipartUploadInputSchema,
	filesList: FilesListInputSchema,
	filesGet: FilesGetInputSchema,

	// Products
	productsCreate: ProductsCreateInputSchema,
	productsUpdate: ProductsUpdateInputSchema,
	productsDelete: ProductsDeleteInputSchema,
	productsGet: ProductsGetInputSchema,
	productsList: ProductsListInputSchema,

	// MaterialOrders
	materialOrdersCreate: MaterialOrdersCreateInputSchema,
	materialOrdersUpdate: MaterialOrdersUpdateInputSchema,
	materialOrdersDelete: MaterialOrdersDeleteInputSchema,
	materialOrdersGet: MaterialOrdersGetInputSchema,
	materialOrdersList: MaterialOrdersListInputSchema,

	// WorkOrders
	workOrdersCreate: WorkOrdersCreateInputSchema,
	workOrdersUpdate: WorkOrdersUpdateInputSchema,
	workOrdersDelete: WorkOrdersDeleteInputSchema,
	workOrdersGet: WorkOrdersGetInputSchema,
	workOrdersList: WorkOrdersListInputSchema,

	// Estimates
	estimatesCreate: EstimatesCreateInputSchema,
	estimatesUpdate: EstimatesUpdateInputSchema,
	estimatesDelete: EstimatesDeleteInputSchema,
	estimatesGet: EstimatesGetInputSchema,
	estimatesList: EstimatesListInputSchema,

	// Invoices
	invoicesCreate: InvoicesCreateInputSchema,
	invoicesUpdate: InvoicesUpdateInputSchema,
	invoicesDelete: InvoicesDeleteInputSchema,
	invoicesGet: InvoicesGetInputSchema,
	invoicesList: InvoicesListInputSchema,

	// Payments
	paymentsList: PaymentsListInputSchema,
	paymentsCreate: PaymentsCreateInputSchema,

	// Budgets
	budgetsList: BudgetsListInputSchema,

	// Account
	accountGetSettings: AccountGetSettingsInputSchema,
	accountGetGroups: AccountGetGroupsInputSchema,
	accountGetUsers: AccountGetUsersInputSchema,
	accountGetUoms: AccountGetUomsInputSchema,
	accountCreateWorkflow: AccountCreateWorkflowInputSchema,
	accountCreateWorkflowStatus: AccountCreateWorkflowStatusInputSchema,
	accountCreateLeadSource: AccountCreateLeadSourceInputSchema,
	accountCreateCustomField: AccountCreateCustomFieldInputSchema,
	accountCreateFileType: AccountCreateFileTypeInputSchema,
	accountCreateTaskType: AccountCreateTaskTypeInputSchema,
	accountCreateActivityType: AccountCreateActivityTypeInputSchema,
	accountCreateLocation: AccountCreateLocationInputSchema,
} as const;

export const JobNimbusEndpointOutputSchemas = {
	// Contacts
	contactsCreate: ContactResponseSchema,
	contactsUpdate: ContactResponseSchema,
	contactsDelete: ContactResponseSchema,
	contactsGet: ContactResponseSchema,
	contactsList: ContactsListResponseSchema,

	// Jobs
	jobsCreate: JobResponseSchema,
	jobsUpdate: JobResponseSchema,
	jobsDelete: JobResponseSchema,
	jobsGet: JobResponseSchema,
	jobsList: JobsListResponseSchema,

	// Tasks
	tasksCreate: TaskResponseSchema,
	tasksUpdate: TaskResponseSchema,
	tasksDelete: TaskResponseSchema,
	tasksGet: TaskResponseSchema,
	tasksList: TasksListResponseSchema,

	// Activities
	activitiesCreate: ActivityResponseSchema,
	activitiesGet: ActivityResponseSchema,
	activitiesList: ActivitiesListResponseSchema,

	// Files
	filesCreate: FilesListResponseSchema,
	filesCreateFromUrl: z.object({ id: z.string().optional() }).passthrough(),
	filesRequestSinglePartUpload: FileUploadUrlResponseSchema,
	filesCompleteSinglePartUpload: FileUploadCompleteResponseSchema,
	filesRequestMultipartUpload: FileUploadUrlResponseSchema,
	filesCompleteMultipartUpload: FileUploadCompleteResponseSchema,
	filesAbortMultipartUpload: FileAbortResponseSchema,
	filesList: FilesListResponseSchema,
	filesGet: FileResponseSchema,

	// Products
	productsCreate: ProductResponseSchema,
	productsUpdate: ProductResponseSchema,
	productsDelete: ProductResponseSchema,
	productsGet: ProductResponseSchema,
	productsList: ProductsListResponseSchema,

	// MaterialOrders
	materialOrdersCreate: MaterialOrderResponseSchema,
	materialOrdersUpdate: MaterialOrderResponseSchema,
	materialOrdersDelete: MaterialOrderResponseSchema,
	materialOrdersGet: MaterialOrderResponseSchema,
	materialOrdersList: MaterialOrdersListResponseSchema,

	// WorkOrders
	workOrdersCreate: WorkOrderResponseSchema,
	workOrdersUpdate: WorkOrderResponseSchema,
	workOrdersDelete: WorkOrderResponseSchema,
	workOrdersGet: WorkOrderResponseSchema,
	workOrdersList: WorkOrdersListResponseSchema,

	// Estimates
	estimatesCreate: EstimateResponseSchema,
	estimatesUpdate: EstimateResponseSchema,
	estimatesDelete: EstimateResponseSchema,
	estimatesGet: EstimateResponseSchema,
	estimatesList: EstimatesListResponseSchema,

	// Invoices
	invoicesCreate: InvoiceResponseSchema,
	invoicesUpdate: InvoiceResponseSchema,
	invoicesDelete: InvoiceResponseSchema,
	invoicesGet: InvoiceResponseSchema,
	invoicesList: InvoicesListResponseSchema,

	// Payments
	paymentsList: PaymentsListResponseSchema,
	paymentsCreate: PaymentsCreateResponseSchema,

	// Budgets
	budgetsList: BudgetsListResponseSchema,

	// Account
	accountGetSettings: AccountSettingsResponseSchema,
	accountGetGroups: AccountGroupsResponseSchema,
	accountGetUsers: AccountUsersResponseSchema,
	accountGetUoms: AccountUomsResponseSchema,
	accountCreateWorkflow: AccountWorkflowResponseSchema,
	accountCreateWorkflowStatus: AccountWorkflowStatusResponseSchema,
	accountCreateLeadSource: AccountLeadSourceResponseSchema,
	accountCreateCustomField: AccountCustomFieldResponseSchema,
	accountCreateFileType: AccountFileTypeResponseSchema,
	accountCreateTaskType: AccountTaskTypeResponseSchema,
	accountCreateActivityType: AccountActivityTypeResponseSchema,
	accountCreateLocation: AccountLocationResponseSchema,
} as const;

export type JobNimbusEndpointInputs = {
	[K in keyof typeof JobNimbusEndpointInputSchemas]: z.infer<
		(typeof JobNimbusEndpointInputSchemas)[K]
	>;
};

export type JobNimbusEndpointOutputs = {
	[K in keyof typeof JobNimbusEndpointOutputSchemas]: z.infer<
		(typeof JobNimbusEndpointOutputSchemas)[K]
	>;
};
