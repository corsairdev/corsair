import { z } from 'zod';

// ServiceM8 allows account-defined customfield_* properties on resource objects.
// Keep those provider-defined values while validating documented fields.
const text = z.string().nullish();
const number = z.number().nullish();
const flag = z.union([z.literal(0), z.literal(1)]).nullish();
const common = { uuid: text, active: flag, edit_date: text };

export const JobSchema = z
	.object({
		...common,
		created_by_staff_uuid: text,
		date: text,
		company_uuid: text,
		billing_address: text,
		status: z.enum(['Quote', 'Work Order', 'Unsuccessful', 'Completed']),
		lng: number,
		lat: number,
		payment_date: text,
		payment_actioned_by_uuid: text,
		payment_method: text,
		payment_amount: text,
		category_uuid: text,
		payment_note: text,
		geo_is_valid: flag,
		purchase_order_number: text,
		invoice_sent: flag,
		invoice_sent_stamp: text,
		invoice_date: text,
		geo_country: text,
		geo_postcode: text,
		geo_state: text,
		geo_city: text,
		geo_street: text,
		geo_number: text,
		queue_uuid: text,
		queue_expiry_date: text,
		queue_assigned_staff_uuid: text,
		badges: text,
		quote_date: text,
		quote_sent: flag,
		quote_sent_stamp: text,
		work_order_date: text,
		job_address: text,
		job_description: text,
		work_done_description: text,
		generated_job_id: text,
		total_invoice_amount: text,
		payment_processed: flag,
		payment_processed_stamp: text,
		payment_received: flag,
		payment_received_stamp: text,
		completion_date: text,
		completion_actioned_by_uuid: text,
		unsuccessful_date: text,
		job_is_scheduled_until_stamp: text,
	})
	.loose();
export const ClientSchema = z
	.object({
		...common,
		name: z.string(),
		abn_number: text,
		address: text,
		billing_address: text,
		is_individual: flag,
		parent_company_uuid: text,
		website: text,
		address_street: text,
		address_city: text,
		address_state: text,
		address_postcode: text,
		address_country: text,
		fax_number: text,
		badges: text,
		tax_rate_uuid: text,
		billing_attention: text,
		payment_terms: text,
		deposit_percent: number,
	})
	.loose();
export const AssetSchema = z
	.object({
		...common,
		company_uuid: text,
		asset_code: text,
		asset_type_uuid: text,
		name: text,
		lat: number,
		lng: number,
		geo_timestamp: text,
		altitude: number,
		field_data: z
			.array(
				z
					.object({
						uuid: z.string(),
						fieldType: z.string(),
						fieldName: z.string(),
						fieldValue: z.string(),
						sortOrder: z.number(),
					})
					.loose(),
			)
			.nullish(),
	})
	.loose();
export const DocumentTemplateSchema = z
	.object({
		...common,
		template_type: text,
		related_object: text,
		name: text,
	})
	.loose();
export const FormSchema = z
	.object({
		...common,
		name: text,
		document_template_uuid: text,
		can_be_used_independently: text,
		badge_mandatory_state: text,
		badge_name: text,
		template_fields: z
			.array(
				z
					.object({
						name: z.string(),
						fieldType: z.literal('Text'),
						value: z.string(),
						sortOrder: z.number().int(),
					})
					.loose(),
			)
			.nullish(),
	})
	.loose();
export const NoteSchema = z
	.object({
		...common,
		related_object: text,
		related_object_uuid: text,
		note: text,
		action_required: text,
		action_completed_by_staff_uuid: text,
		edit_by_staff_uuid: text,
		create_date: text,
	})
	.loose();
export const QueueSchema = z
	.object({
		...common,
		name: text,
		default_timeframe: number,
		subscribed_staff: text,
		requires_assignment: flag,
	})
	.loose();
export const LocationSchema = z
	.object({
		...common,
		name: z.string(),
		state: z.string(),
		line1: text,
		line2: text,
		line3: text,
		city: text,
		country: text,
		post_code: text,
		phone_1: text,
		lng: number,
		lat: number,
	})
	.loose();
export const MaterialSchema = z
	.object({
		...common,
		name: z.string(),
		item_number: text,
		price: text,
		cost: text,
		quantity_in_stock: number,
		price_includes_taxes: flag,
		barcode: text,
		item_is_inventoried: flag,
		item_description: text,
		use_description_for_invoicing: text,
		tax_rate_uuid: text,
	})
	.loose();
export const TaskSchema = z
	.object({
		...common,
		name: z.string(),
		due_date: text,
		task_details: text,
		related_object: text,
		related_object_uuid: text,
		task_complete: text,
		completed_timestamp: text,
		completed_by_staff_uuid: text,
		assigned_to_staff_uuid: text,
		created_by_staff_uuid: text,
		create_date: text,
	})
	.loose();
export const JobActivitySchema = z
	.object({
		...common,
		job_uuid: text,
		staff_uuid: text,
		start_date: text,
		end_date: text,
		activity_was_scheduled: text,
		activity_was_recorded: text,
		activity_was_automated: text,
		has_been_opened: text,
		has_been_opened_timestamp: text,
		travel_time_in_seconds: number,
		travel_distance_in_meters: number,
		material_uuid: text,
		edit_by_staff_uuid: text,
	})
	.loose();
export const JobPaymentSchema = z
	.object({
		...common,
		job_uuid: text,
		actioned_by_uuid: text,
		timestamp: text,
		amount: text,
		method: text,
		note: text,
		attachment_uuid: text,
		is_deposit: flag,
	})
	.loose();
export const StaffSchema = z
	.object({
		...common,
		first: z.string(),
		last: z.string(),
		email: text,
		mobile: text,
		lng: number,
		lat: number,
		geo_timestamp: text,
		job_title: text,
		navigating_to_job_uuid: text,
		navigating_timestamp: text,
		navigating_expiry_timestamp: text,
		color: text,
		custom_icon_url: text,
		status_message: text,
		status_message_timestamp: text,
		hide_from_schedule: flag,
		can_receive_push_notification: text,
		security_role_uuid: text,
		labour_material_uuid: text,
	})
	.loose();

export const safeUuid = z
	.string()
	.uuid()
	.refine((value) => !/[\\/\"']/.test(value));
export const ListInput = z.object({
	$filter: z.string().optional(),
	cursor: z.string().min(1).optional(),
});
export const RetrieveInput = z.object({ uuid: safeUuid });
export const JobCreateInput = z
	.object({
		status: z.enum(['Quote', 'Work Order', 'Unsuccessful', 'Completed']),
		created_by_staff_uuid: z.string().optional(),
		date: z.string().optional(),
		company_uuid: z.string().optional(),
		billing_address: z.string().max(500).optional(),
		payment_date: z.string().optional(),
		payment_actioned_by_uuid: z.string().optional(),
		payment_method: z.string().optional(),
		payment_amount: z.string().optional(),
		category_uuid: z.string().optional(),
		payment_note: z.string().optional(),
		invoice_sent: z.union([z.literal(0), z.literal(1)]).optional(),
		invoice_date: z.string().optional(),
		purchase_order_number: z.string().max(100).optional(),
		uuid: z.string().optional(),
		job_address: z.string().max(500).optional(),
		job_description: z.string().optional(),
		work_done_description: z.string().optional(),
		queue_uuid: z.string().optional(),
		queue_expiry_date: z.string().optional(),
		queue_assigned_staff_uuid: z.string().optional(),
		badges: z.string().optional(),
		quote_date: z.string().optional(),
		quote_sent: z.union([z.literal(0), z.literal(1)]).optional(),
		work_order_date: z.string().optional(),
		payment_processed: z.union([z.literal(0), z.literal(1)]).optional(),
		payment_received: z.union([z.literal(0), z.literal(1)]).optional(),
		completion_date: z.string().optional(),
		unsuccessful_date: z.string().optional(),
	})
	.loose();
export const NoteCreateInput = z
	.object({
		uuid: z.string().optional(),
		related_object: z.string().optional(),
		related_object_uuid: z.string().optional(),
		note: z.string().optional(),
		action_required: z.string().optional(),
		action_completed_by_staff_uuid: z.string().optional(),
		edit_by_staff_uuid: z.string().optional(),
		create_date: z.string().optional(),
	})
	.loose();
export const JobPaymentCreateInput = z
	.object({
		job_uuid: z.string().optional(),
		actioned_by_uuid: z.string().optional(),
		timestamp: z.string().optional(),
		amount: z.string().optional(),
		method: z.string().optional(),
		note: z.string().optional(),
		attachment_uuid: z.string().optional(),
		uuid: z.string().optional(),
	})
	.loose();
export const ResultSchema = z
	.object({
		errorCode: z.number().optional(),
		message: z.string().optional(),
		UUID: z.string().optional(),
	})
	.loose();
export const CreateResultSchema = z.object({
	result: ResultSchema,
	recordUuid: z.string().optional(),
});
export const page = <T extends z.ZodType>(resource: T) =>
	z.object({ data: z.array(resource), nextCursor: z.string().optional() });

export const EndpointInputSchemas = {
	'jobs.list': ListInput,
	'jobs.retrieve': RetrieveInput,
	'jobs.create': JobCreateInput,
	'clients.list': ListInput,
	'clients.retrieve': RetrieveInput,
	'assets.list': ListInput,
	'documentTemplates.list': ListInput,
	'forms.list': ListInput,
	'forms.retrieve': RetrieveInput,
	'notes.list': ListInput,
	'notes.retrieve': RetrieveInput,
	'notes.create': NoteCreateInput,
	'notes.update': z.object({ uuid: safeUuid, body: NoteCreateInput }),
	'notes.delete': RetrieveInput,
	'queues.list': ListInput,
	'queues.retrieve': RetrieveInput,
	'locations.list': ListInput,
	'locations.retrieve': RetrieveInput,
	'materials.list': ListInput,
	'materials.retrieve': RetrieveInput,
	'tasks.list': ListInput,
	'jobActivities.retrieve': RetrieveInput,
	'jobPayments.retrieve': RetrieveInput,
	'jobPayments.create': JobPaymentCreateInput,
	'jobPayments.update': z.object({
		uuid: safeUuid,
		body: JobPaymentCreateInput,
	}),
	'jobPayments.delete': RetrieveInput,
	'staff.retrieve': RetrieveInput,
	'customFields.delete': z.object({ UUID: safeUuid }),
} as const;

export const EndpointOutputSchemas = {
	'jobs.list': page(JobSchema),
	'jobs.retrieve': JobSchema,
	'jobs.create': CreateResultSchema,
	'clients.list': page(ClientSchema),
	'clients.retrieve': ClientSchema,
	'assets.list': page(AssetSchema),
	'documentTemplates.list': page(DocumentTemplateSchema),
	'forms.list': page(FormSchema),
	'forms.retrieve': FormSchema,
	'notes.list': page(NoteSchema),
	'notes.retrieve': NoteSchema,
	'notes.create': CreateResultSchema,
	'notes.update': ResultSchema,
	'notes.delete': ResultSchema,
	'queues.list': page(QueueSchema),
	'queues.retrieve': QueueSchema,
	'locations.list': page(LocationSchema),
	'locations.retrieve': LocationSchema,
	'materials.list': page(MaterialSchema),
	'materials.retrieve': MaterialSchema,
	'tasks.list': page(TaskSchema),
	'jobActivities.retrieve': JobActivitySchema,
	'jobPayments.retrieve': JobPaymentSchema,
	'jobPayments.create': CreateResultSchema,
	'jobPayments.update': ResultSchema,
	'jobPayments.delete': ResultSchema,
	'staff.retrieve': StaffSchema,
	'customFields.delete': ResultSchema,
} as const satisfies Record<keyof typeof EndpointInputSchemas, z.ZodType>;
