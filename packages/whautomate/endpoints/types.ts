import { z } from 'zod';

const PaginationSchema = z.object({
	page: z.number().optional(),
	limit: z.number().optional(),
});

const DateRangeSchema = z.object({
	startDate: z.string().optional(),
	endDate: z.string().optional(),
});

const AddContactInputSchema = z.object({
	name: z.string(),
	phone: z.string().optional(),
	email: z.string().optional(),
	avatar: z.string().optional(),
	segmentId: z.string().optional(),
	customFields: z.record(z.string(), z.unknown()).optional(),
});

const DeleteSegmentInputSchema = z.object({
	id: z.string(),
});

const DeleteServiceCategoryInputSchema = z.object({
	id: z.string(),
});

const GetAccountInfoInputSchema = z.object({});

const GetAllWebhooksInputSchema = z.object({});

const GetBroadcastByIdInputSchema = z.object({
	id: z.string(),
});

const GetBroadcastsInputSchema = z.object({
	...PaginationSchema.shape,
	...DateRangeSchema.shape,
	status: z
		.enum(['draft', 'scheduled', 'sending', 'sent', 'failed'])
		.optional(),
});

const GetContactsInputSchema = z.object({
	...PaginationSchema.shape,
	search: z.string().optional(),
	segmentId: z.string().optional(),
});

const GetMessagesOfContactInputSchema = z.object({
	contactId: z.string(),
	...PaginationSchema.shape,
	...DateRangeSchema.shape,
});

const GetSegmentsInputSchema = z.object({
	...PaginationSchema.shape,
	name: z.string().optional(),
});

const GetServiceByIdInputSchema = z.object({
	id: z.string(),
});

const GetServiceCategoriesInputSchema = z.object({
	...PaginationSchema.shape,
});

const GetServicesInputSchema = z.object({
	...PaginationSchema.shape,
	categoryId: z.string().optional(),
	search: z.string().optional(),
	isActive: z.boolean().optional(),
});

const GetStaffAvailabilityBlocksInputSchema = z.object({
	staffId: z.string(),
	...DateRangeSchema.shape,
});

const GetStaffByIdInputSchema = z.object({
	id: z.string(),
});

const GetStaffsInputSchema = z.object({
	...PaginationSchema.shape,
	search: z.string().optional(),
});

const UpdateServiceInputSchema = z.object({
	id: z.string(),
	name: z.string().optional(),
	description: z.string().optional(),
	price: z.number().optional(),
	duration: z.number().optional(),
	categoryId: z.string().optional(),
	isActive: z.boolean().optional(),
});

export type AddContactInput = z.infer<typeof AddContactInputSchema>;
export type DeleteSegmentInput = z.infer<typeof DeleteSegmentInputSchema>;
export type DeleteServiceCategoryInput = z.infer<
	typeof DeleteServiceCategoryInputSchema
>;
export type GetAccountInfoInput = z.infer<typeof GetAccountInfoInputSchema>;
export type GetAllWebhooksInput = z.infer<typeof GetAllWebhooksInputSchema>;
export type GetBroadcastByIdInput = z.infer<typeof GetBroadcastByIdInputSchema>;
export type GetBroadcastsInput = z.infer<typeof GetBroadcastsInputSchema>;
export type GetContactsInput = z.infer<typeof GetContactsInputSchema>;
export type GetMessagesOfContactInput = z.infer<
	typeof GetMessagesOfContactInputSchema
>;
export type GetSegmentsInput = z.infer<typeof GetSegmentsInputSchema>;
export type GetServiceByIdInput = z.infer<typeof GetServiceByIdInputSchema>;
export type GetServiceCategoriesInput = z.infer<
	typeof GetServiceCategoriesInputSchema
>;
export type GetServicesInput = z.infer<typeof GetServicesInputSchema>;
export type GetStaffAvailabilityBlocksInput = z.infer<
	typeof GetStaffAvailabilityBlocksInputSchema
>;
export type GetStaffByIdInput = z.infer<typeof GetStaffByIdInputSchema>;
export type GetStaffsInput = z.infer<typeof GetStaffsInputSchema>;
export type UpdateServiceInput = z.infer<typeof UpdateServiceInputSchema>;

const ContactSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		phone: z.string().nullable().optional(),
		email: z.string().nullable().optional(),
		avatar: z.string().nullable().optional(),
		segmentId: z.string().nullable().optional(),
		customFields: z.record(z.string(), z.unknown()).nullable().optional(),
		createdAt: z.string().optional(),
		updatedAt: z.string().optional(),
	})
	.loose();

const SegmentSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		contactCount: z.number().optional(),
		createdAt: z.string().optional(),
		updatedAt: z.string().optional(),
	})
	.loose();

const ServiceCategorySchema = z
	.object({
		id: z.string(),
		name: z.string(),
		description: z.string().nullable().optional(),
		createdAt: z.string().optional(),
		updatedAt: z.string().optional(),
	})
	.loose();

const AccountInfoSchema = z
	.object({
		name: z.string(),
		ownerEmail: z.string(),
		apiHost: z.string().optional(),
	})
	.loose();

const WebhookSchema = z
	.object({
		id: z.string(),
		url: z.string(),
		events: z.array(z.string()),
		isActive: z.boolean(),
		createdAt: z.string().optional(),
	})
	.loose();

const BroadcastSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		status: z.string(),
		segmentId: z.string().nullable().optional(),
		messageTemplate: z.string().optional(),
		scheduledAt: z.string().nullable().optional(),
		sentAt: z.string().nullable().optional(),
		stats: z
			.object({
				total: z.number().optional(),
				sent: z.number().optional(),
				delivered: z.number().optional(),
				read: z.number().optional(),
				failed: z.number().optional(),
			})
			.optional(),
		createdAt: z.string().optional(),
		updatedAt: z.string().optional(),
	})
	.loose();

const MessageSchema = z
	.object({
		id: z.string(),
		contactId: z.string(),
		direction: z.enum(['inbound', 'outbound']),
		content: z.string(),
		type: z
			.enum([
				'text',
				'image',
				'document',
				'audio',
				'video',
				'location',
				'contact',
			])
			.optional(),
		status: z.enum(['sent', 'delivered', 'read', 'failed']).optional(),
		mediaUrl: z.string().nullable().optional(),
		timestamp: z.string(),
	})
	.loose();

const ServiceSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		description: z.string().nullable().optional(),
		price: z.number().optional(),
		duration: z.number().optional(),
		categoryId: z.string().nullable().optional(),
		isActive: z.boolean().optional(),
		createdAt: z.string().optional(),
		updatedAt: z.string().optional(),
	})
	.loose();

const StaffSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		email: z.string().nullable().optional(),
		phone: z.string().nullable().optional(),
		avatar: z.string().nullable().optional(),
		role: z.string().nullable().optional(),
		isActive: z.boolean().optional(),
		createdAt: z.string().optional(),
		updatedAt: z.string().optional(),
	})
	.loose();

const StaffAvailabilityBlockSchema = z
	.object({
		id: z.string(),
		staffId: z.string(),
		startTime: z.string(),
		endTime: z.string(),
		reason: z.string().nullable().optional(),
		recurring: z.boolean().optional(),
		createdAt: z.string().optional(),
		updatedAt: z.string().optional(),
	})
	.loose();

const WhautomateResponseSchema = z
	.object({
		success: z.boolean().optional(),
		data: z.unknown().optional(),
		message: z.string().optional(),
		error: z.string().optional(),
	})
	.loose();

const AddContactResponseSchema = WhautomateResponseSchema.extend({
	data: ContactSchema.optional(),
}).loose();

const DeleteSegmentResponseSchema = WhautomateResponseSchema.extend({
	data: z.object({ id: z.string() }).optional(),
}).loose();

const DeleteServiceCategoryResponseSchema = WhautomateResponseSchema.extend({
	data: z.object({ id: z.string() }).optional(),
}).loose();

const GetAccountInfoResponseSchema = WhautomateResponseSchema.extend({
	data: AccountInfoSchema.optional(),
}).loose();

const GetAllWebhooksResponseSchema = WhautomateResponseSchema.extend({
	data: z.array(WebhookSchema).optional(),
}).loose();

const GetBroadcastByIdResponseSchema = WhautomateResponseSchema.extend({
	data: BroadcastSchema.optional(),
}).loose();

const GetBroadcastsResponseSchema = WhautomateResponseSchema.extend({
	data: z.array(BroadcastSchema).optional(),
	pagination: z
		.object({
			page: z.number(),
			limit: z.number(),
			total: z.number(),
			totalPages: z.number(),
		})
		.optional(),
}).loose();

const GetContactsResponseSchema = WhautomateResponseSchema.extend({
	data: z.array(ContactSchema).optional(),
	pagination: z
		.object({
			page: z.number(),
			limit: z.number(),
			total: z.number(),
			totalPages: z.number(),
		})
		.optional(),
}).loose();

const GetMessagesOfContactResponseSchema = WhautomateResponseSchema.extend({
	data: z.array(MessageSchema).optional(),
	pagination: z
		.object({
			page: z.number(),
			limit: z.number(),
			total: z.number(),
			totalPages: z.number(),
		})
		.optional(),
}).loose();

const GetSegmentsResponseSchema = WhautomateResponseSchema.extend({
	data: z.array(SegmentSchema).optional(),
	pagination: z
		.object({
			page: z.number(),
			limit: z.number(),
			total: z.number(),
			totalPages: z.number(),
		})
		.optional(),
}).loose();

const GetServiceByIdResponseSchema = WhautomateResponseSchema.extend({
	data: ServiceSchema.optional(),
}).loose();

const GetServiceCategoriesResponseSchema = WhautomateResponseSchema.extend({
	data: z.array(ServiceCategorySchema).optional(),
	pagination: z
		.object({
			page: z.number(),
			limit: z.number(),
			total: z.number(),
			totalPages: z.number(),
		})
		.optional(),
}).loose();

const GetServicesResponseSchema = WhautomateResponseSchema.extend({
	data: z.array(ServiceSchema).optional(),
	pagination: z
		.object({
			page: z.number(),
			limit: z.number(),
			total: z.number(),
			totalPages: z.number(),
		})
		.optional(),
}).loose();

const GetStaffAvailabilityBlocksResponseSchema =
	WhautomateResponseSchema.extend({
		data: z.array(StaffAvailabilityBlockSchema).optional(),
	}).loose();

const GetStaffByIdResponseSchema = WhautomateResponseSchema.extend({
	data: StaffSchema.optional(),
}).loose();

const GetStaffsResponseSchema = WhautomateResponseSchema.extend({
	data: z.array(StaffSchema).optional(),
	pagination: z
		.object({
			page: z.number(),
			limit: z.number(),
			total: z.number(),
			totalPages: z.number(),
		})
		.optional(),
}).loose();

const UpdateServiceResponseSchema = WhautomateResponseSchema.extend({
	data: ServiceSchema.optional(),
}).loose();

export const WhautomateEndpointInputSchemas = {
	addContact: AddContactInputSchema,
	deleteSegment: DeleteSegmentInputSchema,
	deleteServiceCategory: DeleteServiceCategoryInputSchema,
	getAccountInfo: GetAccountInfoInputSchema,
	getAllWebhooks: GetAllWebhooksInputSchema,
	getBroadcastById: GetBroadcastByIdInputSchema,
	getBroadcasts: GetBroadcastsInputSchema,
	getContacts: GetContactsInputSchema,
	getMessagesOfContact: GetMessagesOfContactInputSchema,
	getSegments: GetSegmentsInputSchema,
	getServiceById: GetServiceByIdInputSchema,
	getServiceCategories: GetServiceCategoriesInputSchema,
	getServices: GetServicesInputSchema,
	getStaffAvailabilityBlocks: GetStaffAvailabilityBlocksInputSchema,
	getStaffById: GetStaffByIdInputSchema,
	getStaffs: GetStaffsInputSchema,
	updateService: UpdateServiceInputSchema,
} as const;

export type WhautomateEndpointInputs = {
	[K in keyof typeof WhautomateEndpointInputSchemas]: z.infer<
		(typeof WhautomateEndpointInputSchemas)[K]
	>;
};

export const WhautomateEndpointOutputSchemas = {
	addContact: AddContactResponseSchema,
	deleteSegment: DeleteSegmentResponseSchema,
	deleteServiceCategory: DeleteServiceCategoryResponseSchema,
	getAccountInfo: GetAccountInfoResponseSchema,
	getAllWebhooks: GetAllWebhooksResponseSchema,
	getBroadcastById: GetBroadcastByIdResponseSchema,
	getBroadcasts: GetBroadcastsResponseSchema,
	getContacts: GetContactsResponseSchema,
	getMessagesOfContact: GetMessagesOfContactResponseSchema,
	getSegments: GetSegmentsResponseSchema,
	getServiceById: GetServiceByIdResponseSchema,
	getServiceCategories: GetServiceCategoriesResponseSchema,
	getServices: GetServicesResponseSchema,
	getStaffAvailabilityBlocks: GetStaffAvailabilityBlocksResponseSchema,
	getStaffById: GetStaffByIdResponseSchema,
	getStaffs: GetStaffsResponseSchema,
	updateService: UpdateServiceResponseSchema,
} as const;

export type WhautomateEndpointOutputs = {
	[K in keyof typeof WhautomateEndpointOutputSchemas]: z.infer<
		(typeof WhautomateEndpointOutputSchemas)[K]
	>;
};

export type AddContactResponse = z.infer<typeof AddContactResponseSchema>;
export type DeleteSegmentResponse = z.infer<typeof DeleteSegmentResponseSchema>;
export type DeleteServiceCategoryResponse = z.infer<
	typeof DeleteServiceCategoryResponseSchema
>;
export type GetAccountInfoResponse = z.infer<
	typeof GetAccountInfoResponseSchema
>;
export type GetAllWebhooksResponse = z.infer<
	typeof GetAllWebhooksResponseSchema
>;
export type GetBroadcastByIdResponse = z.infer<
	typeof GetBroadcastByIdResponseSchema
>;
export type GetBroadcastsResponse = z.infer<typeof GetBroadcastsResponseSchema>;
export type GetContactsResponse = z.infer<typeof GetContactsResponseSchema>;
export type GetMessagesOfContactResponse = z.infer<
	typeof GetMessagesOfContactResponseSchema
>;
export type GetSegmentsResponse = z.infer<typeof GetSegmentsResponseSchema>;
export type GetServiceByIdResponse = z.infer<
	typeof GetServiceByIdResponseSchema
>;
export type GetServiceCategoriesResponse = z.infer<
	typeof GetServiceCategoriesResponseSchema
>;
export type GetServicesResponse = z.infer<typeof GetServicesResponseSchema>;
export type GetStaffAvailabilityBlocksResponse = z.infer<
	typeof GetStaffAvailabilityBlocksResponseSchema
>;
export type GetStaffByIdResponse = z.infer<typeof GetStaffByIdResponseSchema>;
export type GetStaffsResponse = z.infer<typeof GetStaffsResponseSchema>;
export type UpdateServiceResponse = z.infer<typeof UpdateServiceResponseSchema>;
