import { z } from 'zod';

const ContactIdSchema = z.union([z.string(), z.number()]);
const ListIdSchema = z.union([z.string(), z.number()]);
const WebformIdSchema = z.union([z.string(), z.number()]);
const MessageIdSchema = z.union([z.string(), z.number()]);

const OptionalStringSchema = z.string().nullable().optional();

const ContactPhoneSchema = z
	.object({
		value: z.string(),
		type: z.string(),
	})
	.loose();

const ContactSiteSchema = z
	.object({
		value: z.string(),
		type: z.string(),
	})
	.loose();

const ContactSocialSchema = z
	.object({
		value: z.string(),
		type: z.string(),
		protocol: z.string(),
	})
	.loose();

const ContactCustomFieldSchema = z
	.object({
		field: z.string(),
		value: z.string().optional(),
		variable: z.string().optional(),
	})
	.loose();

const ContactSummarySchema = z
	.object({
		id: z.string(),
		email: z.string(),
		first_name: OptionalStringSchema,
		last_name: OptionalStringSchema,
		image_url: OptionalStringSchema,
	})
	.loose();

const ContactSchema = z
	.object({
		id: z.string(),
		email: z.string(),
		first_name: OptionalStringSchema,
		last_name: OptionalStringSchema,
		title: OptionalStringSchema,
		company: OptionalStringSchema,
		address: OptionalStringSchema,
		country_id: OptionalStringSchema,
		country: OptionalStringSchema,
		city: OptionalStringSchema,
		state: OptionalStringSchema,
		zip: OptionalStringSchema,
		birthday: OptionalStringSchema,
		tags: OptionalStringSchema,
		phones: z.array(ContactPhoneSchema).optional(),
		sites: z.array(ContactSiteSchema).optional(),
		social: z.array(ContactSocialSchema).optional(),
		custom_fields: z.array(ContactCustomFieldSchema).optional(),
		image_url: OptionalStringSchema,
	})
	.loose();

const ListSchema = z
	.object({
		id: z.string(),
		list_name: z.string(),
		tags: z.string().optional(),
		contact_count: z.number().or(z.string()),
	})
	.loose();

const MessageStatisticsSchema = z
	.object({
		id: z.string().optional(),
		name: z.string().optional(),
		scheduled_date: z.string().nullable().optional(),
		send_now: z.string().or(z.number()).optional(),
		send_count: z.string().or(z.number()).optional(),
		campaign_title: z.string().nullable().optional(),
		status: z.string().optional(),
		unique_views: z.number().or(z.string()).optional(),
		unique_responses: z.number().or(z.string()).optional(),
		percent_views: z.number().or(z.string()).optional(),
		percent_responses: z.number().or(z.string()).optional(),
		preview_url: z.string().optional(),
		preview_thumb: z.string().optional(),
		report_url: z.string().nullable().optional(),
	})
	.loose();

const ReportSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		scheduled_date: z.string().nullable(),
		status: z.string(),
		preview_url: z.string(),
		report_url: z.string().nullable(),
	})
	.loose();

const WebformSchema = z
	.object({
		id: z.string(),
		contact_list_id: z.string(),
		form_title: z.string(),
		form_type: z.string(),
		form_html: z.string(),
		signup_count: z.string().or(z.number()),
	})
	.loose();

const SuccessBooleanSchema = z
	.object({
		success: z.boolean().or(z.literal(1)).or(z.literal(0)),
	})
	.loose();

const UnsubscribeResponseSchema = z
	.union([
		z
			.object({
				success: z.boolean().or(z.literal(1)).or(z.literal(0)),
			})
			.loose(),
		z
			.object({
				contactCount: z.number().or(z.string()),
				success: z.boolean(),
				msg: z.string(),
				unsubscribeCount: z.number().or(z.string()),
			})
			.loose(),
	])
	.describe(
		'Campayn returns either { success: 1 } for id-based unsubscribe or an expanded object for email-based unsubscribe.',
	);

const SignupResponseSchema = z
	.object({
		success: z.number().or(z.boolean()),
		msg: z.string(),
		errorCode: z.string().optional(),
	})
	.loose();

export const GetListsInputSchema = z.object({});
export type GetListsInput = z.input<typeof GetListsInputSchema>;
export const GetListsResponseSchema = z.array(ListSchema);
export type GetListsResponse = z.infer<typeof GetListsResponseSchema>;

export const UpdateListInputSchema = z
	.object({
		listId: ListIdSchema,
		list_name: z.string().optional(),
		tags: z.string().optional(),
	})
	.refine(
		(value) => value.list_name !== undefined || value.tags !== undefined,
		{
			message: 'At least one of list_name or tags is required.',
		},
	);
export type UpdateListInput = z.input<typeof UpdateListInputSchema>;
export const UpdateListResponseSchema = ListSchema;
export type UpdateListResponse = z.infer<typeof UpdateListResponseSchema>;

export const DeleteListInputSchema = z.object({
	listId: ListIdSchema,
});
export type DeleteListInput = z.input<typeof DeleteListInputSchema>;
export const DeleteListResponseSchema = SuccessBooleanSchema;
export type DeleteListResponse = z.infer<typeof DeleteListResponseSchema>;

export const GetContactsInputSchema = z.object({
	listId: ListIdSchema,
	contactFilter: z.string().optional(),
});
export type GetContactsInput = z.input<typeof GetContactsInputSchema>;
export const GetContactsResponseSchema = z.array(ContactSummarySchema);
export type GetContactsResponse = z.infer<typeof GetContactsResponseSchema>;

export const GetContactInputSchema = z.object({
	contactId: ContactIdSchema,
});
export type GetContactInput = z.input<typeof GetContactInputSchema>;
export const GetContactResponseSchema = ContactSchema;
export type GetContactResponse = z.infer<typeof GetContactResponseSchema>;

export const CreateContactInputSchema = z.object({
	listId: ListIdSchema,
	email: z.string().email(),
	first_name: z.string().optional(),
	last_name: z.string().optional(),
	title: z.string().optional(),
	address: z.string().optional(),
	city: z.string().optional(),
	state: z.string().optional(),
	zip: z.string().optional(),
	company: z.string().optional(),
	country: z.string().optional(),
	phones: z.array(ContactPhoneSchema).optional(),
	sites: z.array(ContactSiteSchema).optional(),
	social: z.array(ContactSocialSchema).optional(),
	custom_fields: z.array(ContactCustomFieldSchema).optional(),
	failOnDuplicate: z.boolean().optional(),
});
export type CreateContactInput = z.input<typeof CreateContactInputSchema>;
export const CreateContactResponseSchema = SuccessBooleanSchema;
export type CreateContactResponse = z.infer<typeof CreateContactResponseSchema>;

export const DeleteContactInputSchema = z.object({
	contactId: ContactIdSchema,
});
export type DeleteContactInput = z.input<typeof DeleteContactInputSchema>;
export const DeleteContactResponseSchema = SuccessBooleanSchema;
export type DeleteContactResponse = z.infer<typeof DeleteContactResponseSchema>;

export const UnsubscribeContactInputSchema = z
	.object({
		listId: ListIdSchema,
		id: ContactIdSchema.optional(),
		email: z.string().email().optional(),
	})
	.refine((value) => value.id !== undefined || value.email !== undefined, {
		message: 'Either id or email is required.',
	});
export type UnsubscribeContactInput = z.input<
	typeof UnsubscribeContactInputSchema
>;
export const UnsubscribeContactResponseSchema = UnsubscribeResponseSchema;
export type UnsubscribeContactResponse = z.infer<
	typeof UnsubscribeContactResponseSchema
>;

export const GetMessagesInputSchema = z.object({});
export type GetMessagesInput = z.input<typeof GetMessagesInputSchema>;
export const GetMessagesResponseSchema = z.array(MessageStatisticsSchema);
export type GetMessagesResponse = z.infer<typeof GetMessagesResponseSchema>;

export const GetMessageStatisticsInputSchema = z.object({
	messageId: MessageIdSchema,
});
export type GetMessageStatisticsInput = z.input<
	typeof GetMessageStatisticsInputSchema
>;
export const GetMessageStatisticsResponseSchema = MessageStatisticsSchema;
export type GetMessageStatisticsResponse = z.infer<
	typeof GetMessageStatisticsResponseSchema
>;

export const GetReportsInputSchema = z.object({
	from: z.number().int().optional(),
	to: z.number().int().optional(),
});
export type GetReportsInput = z.input<typeof GetReportsInputSchema>;
export const GetReportsResponseSchema = z.array(ReportSchema);
export type GetReportsResponse = z.infer<typeof GetReportsResponseSchema>;

export const GetWebformsInputSchema = z.object({
	listId: ListIdSchema,
	form_type: z.enum(['0', '1', '2', '3']).optional(),
});
export type GetWebformsInput = z.input<typeof GetWebformsInputSchema>;
export const GetWebformsResponseSchema = z.array(WebformSchema);
export type GetWebformsResponse = z.infer<typeof GetWebformsResponseSchema>;

export const GetWebformInputSchema = z.object({
	listId: ListIdSchema,
	webformId: WebformIdSchema,
});
export type GetWebformInput = z.input<typeof GetWebformInputSchema>;
export const GetWebformResponseSchema = WebformSchema;
export type GetWebformResponse = z.infer<typeof GetWebformResponseSchema>;

export const DeleteWebformInputSchema = z.object({
	listId: ListIdSchema,
	webformId: WebformIdSchema,
});
export type DeleteWebformInput = z.input<typeof DeleteWebformInputSchema>;
export const DeleteWebformResponseSchema = SuccessBooleanSchema;
export type DeleteWebformResponse = z.infer<typeof DeleteWebformResponseSchema>;

export const SignupInputSchema = z.object({
	email: z.string().email(),
	first_name: z.string(),
	last_name: z.string(),
	password: z.string(),
	subdomain: z.string().optional(),
	site: z.string().optional(),
});
export type SignupInput = z.input<typeof SignupInputSchema>;
export const SignupResponseOutputSchema = SignupResponseSchema;
export type SignupResponseOutput = z.infer<typeof SignupResponseOutputSchema>;

export const CampaynEndpointInputSchemas = {
	getLists: GetListsInputSchema,
	updateList: UpdateListInputSchema,
	deleteList: DeleteListInputSchema,
	getContacts: GetContactsInputSchema,
	getContact: GetContactInputSchema,
	createContact: CreateContactInputSchema,
	deleteContact: DeleteContactInputSchema,
	unsubscribeContact: UnsubscribeContactInputSchema,
	getMessages: GetMessagesInputSchema,
	getMessageStatistics: GetMessageStatisticsInputSchema,
	getReports: GetReportsInputSchema,
	getWebforms: GetWebformsInputSchema,
	getWebform: GetWebformInputSchema,
	deleteWebform: DeleteWebformInputSchema,
	signup: SignupInputSchema,
};

export const CampaynEndpointOutputSchemas = {
	getLists: GetListsResponseSchema,
	updateList: UpdateListResponseSchema,
	deleteList: DeleteListResponseSchema,
	getContacts: GetContactsResponseSchema,
	getContact: GetContactResponseSchema,
	createContact: CreateContactResponseSchema,
	deleteContact: DeleteContactResponseSchema,
	unsubscribeContact: UnsubscribeContactResponseSchema,
	getMessages: GetMessagesResponseSchema,
	getMessageStatistics: GetMessageStatisticsResponseSchema,
	getReports: GetReportsResponseSchema,
	getWebforms: GetWebformsResponseSchema,
	getWebform: GetWebformResponseSchema,
	deleteWebform: DeleteWebformResponseSchema,
	signup: SignupResponseOutputSchema,
};

export type CampaynEndpointInputs = {
	[K in keyof typeof CampaynEndpointInputSchemas]: z.input<
		(typeof CampaynEndpointInputSchemas)[K]
	>;
};

export type CampaynEndpointOutputs = {
	[K in keyof typeof CampaynEndpointOutputSchemas]: z.infer<
		(typeof CampaynEndpointOutputSchemas)[K]
	>;
};
