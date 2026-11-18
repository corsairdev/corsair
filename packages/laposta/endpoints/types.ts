import { z } from 'zod';

// List Schemas
export const GetListsInputSchema = z.object({}).strict();
export type GetListsInput = z.infer<typeof GetListsInputSchema>;

export const GetListsOutputSchema = z.object({
	// `unknown` because response list entries contain user-configurable fields.
	data: z.array(z.record(z.string(), z.unknown())),
});
export type GetListsOutput = z.infer<typeof GetListsOutputSchema>;

export const GetListInputSchema = z
	.object({
		list_id: z.string().min(1),
	})
	.strict();
export type GetListInput = z.infer<typeof GetListInputSchema>;

export const GetListOutputSchema = z.object({
	// `unknown` because list details are extensible with custom account attributes.
	list: z.record(z.string(), z.unknown()),
});
export type GetListOutput = z.infer<typeof GetListOutputSchema>;

export const CreateListInputSchema = z
	.object({
		name: z.string().min(1),
		remarks: z.string().optional(),
		subscribe_notification_email: z.string().optional(),
		unsubscribe_notification_email: z.string().optional(),
	})
	.strict();
export type CreateListInput = z.infer<typeof CreateListInputSchema>;

export const CreateListOutputSchema = z.object({
	// `unknown` because newly created list contains server-generated metadata.
	list: z.record(z.string(), z.unknown()),
});
export type CreateListOutput = z.infer<typeof CreateListOutputSchema>;

export const UpdateListInputSchema = z
	.object({
		list_id: z.string().min(1),
		name: z.string().optional(),
		remarks: z.string().optional(),
		subscribe_notification_email: z.string().optional(),
		unsubscribe_notification_email: z.string().optional(),
	})
	.strict();
export type UpdateListInput = z.infer<typeof UpdateListInputSchema>;

export const UpdateListOutputSchema = z.object({
	// `unknown` because updated list contains server-generated metadata.
	list: z.record(z.string(), z.unknown()),
});
export type UpdateListOutput = z.infer<typeof UpdateListOutputSchema>;

export const DeleteListInputSchema = z
	.object({
		list_id: z.string().min(1),
	})
	.strict();
export type DeleteListInput = z.infer<typeof DeleteListInputSchema>;

export const DeleteListOutputSchema = z.object({
	// `unknown` because deleted list payload returns final state info.
	list: z.record(z.string(), z.unknown()),
});
export type DeleteListOutput = z.infer<typeof DeleteListOutputSchema>;

// Member Schemas
export const GetMembersInputSchema = z
	.object({
		list_id: z.string().min(1),
		state: z.enum(['active', 'unsubscribed', 'cleaned']).optional(),
	})
	.strict();
export type GetMembersInput = z.infer<typeof GetMembersInputSchema>;

export const GetMembersOutputSchema = z.object({
	// `unknown` because member items contain arbitrary subscriber custom fields.
	data: z.array(z.record(z.string(), z.unknown())),
});
export type GetMembersOutput = z.infer<typeof GetMembersOutputSchema>;

export const GetMemberInputSchema = z
	.object({
		list_id: z.string().min(1),
		member_id: z.string().min(1),
	})
	.strict();
export type GetMemberInput = z.infer<typeof GetMemberInputSchema>;

export const GetMemberOutputSchema = z.object({
	// `unknown` because member details include user-defined subscriber fields.
	member: z.record(z.string(), z.unknown()),
});
export type GetMemberOutput = z.infer<typeof GetMemberOutputSchema>;

export const CreateMemberInputSchema = z
	.object({
		list_id: z.string().min(1),
		email: z.string().email(),
		ip: z.string().optional(),
		// `unknown` because subscriber custom fields vary per mailing list schema.
		custom_fields: z.record(z.string(), z.unknown()).optional(),
		// `unknown` because options allow configurable subscription flags.
		options: z.record(z.string(), z.unknown()).optional(),
	})
	.strict();
export type CreateMemberInput = z.infer<typeof CreateMemberInputSchema>;

export const CreateMemberOutputSchema = z.object({
	// `unknown` because created member response includes custom attributes.
	member: z.record(z.string(), z.unknown()),
});
export type CreateMemberOutput = z.infer<typeof CreateMemberOutputSchema>;

export const UpdateMemberInputSchema = z
	.object({
		list_id: z.string().min(1),
		member_id: z.string().min(1),
		email: z.string().email().optional(),
		state: z.enum(['active', 'unsubscribed', 'cleaned']).optional(),
		// `unknown` because custom subscriber fields can be dynamically updated.
		custom_fields: z.record(z.string(), z.unknown()).optional(),
	})
	.strict();
export type UpdateMemberInput = z.infer<typeof UpdateMemberInputSchema>;

export const UpdateMemberOutputSchema = z.object({
	// `unknown` because member update response includes customized subscriber data.
	member: z.record(z.string(), z.unknown()),
});
export type UpdateMemberOutput = z.infer<typeof UpdateMemberOutputSchema>;

export const DeleteMemberInputSchema = z
	.object({
		list_id: z.string().min(1),
		member_id: z.string().min(1),
	})
	.strict();
export type DeleteMemberInput = z.infer<typeof DeleteMemberInputSchema>;

export const DeleteMemberOutputSchema = z.object({
	// `unknown` because member deletion payload returns server status.
	member: z.record(z.string(), z.unknown()),
});
export type DeleteMemberOutput = z.infer<typeof DeleteMemberOutputSchema>;

// Field Schemas
export const GetFieldsInputSchema = z
	.object({
		list_id: z.string().min(1),
	})
	.strict();
export type GetFieldsInput = z.infer<typeof GetFieldsInputSchema>;

export const GetFieldsOutputSchema = z.object({
	// `unknown` because field configurations have dynamic data types and rules.
	data: z.array(z.record(z.string(), z.unknown())),
});
export type GetFieldsOutput = z.infer<typeof GetFieldsOutputSchema>;

export const GetFieldInputSchema = z
	.object({
		list_id: z.string().min(1),
		field_id: z.string().min(1),
	})
	.strict();
export type GetFieldInput = z.infer<typeof GetFieldInputSchema>;

export const GetFieldOutputSchema = z.object({
	// `unknown` because field details contain field-specific definitions.
	field: z.record(z.string(), z.unknown()),
});
export type GetFieldOutput = z.infer<typeof GetFieldOutputSchema>;

export const CreateFieldInputSchema = z
	.object({
		list_id: z.string().min(1),
		name: z.string().min(1),
		datatype: z
			.enum(['text', 'numeric', 'date', 'select_single', 'select_multiple'])
			.optional(),
		defaultvalue: z.string().optional(),
		options: z.array(z.string()).optional(),
		required: z.boolean().optional(),
		in_form: z.boolean().optional(),
		in_list: z.boolean().optional(),
	})
	.strict();
export type CreateFieldInput = z.infer<typeof CreateFieldInputSchema>;

export const CreateFieldOutputSchema = z.object({
	// `unknown` because created field returns server-computed metadata.
	field: z.record(z.string(), z.unknown()),
});
export type CreateFieldOutput = z.infer<typeof CreateFieldOutputSchema>;

export const DeleteFieldInputSchema = z
	.object({
		list_id: z.string().min(1),
		field_id: z.string().min(1),
	})
	.strict();
export type DeleteFieldInput = z.infer<typeof DeleteFieldInputSchema>;

export const DeleteFieldOutputSchema = z.object({
	// `unknown` because deleted field returns status object.
	field: z.record(z.string(), z.unknown()),
});
export type DeleteFieldOutput = z.infer<typeof DeleteFieldOutputSchema>;

// Campaign Schemas
export const GetCampaignsInputSchema = z.object({}).strict();
export type GetCampaignsInput = z.infer<typeof GetCampaignsInputSchema>;

export const GetCampaignsOutputSchema = z.object({
	// `unknown` because campaign list items include custom HTML content summaries and status flags.
	data: z.array(z.record(z.string(), z.unknown())),
});
export type GetCampaignsOutput = z.infer<typeof GetCampaignsOutputSchema>;

export const GetCampaignInputSchema = z
	.object({
		campaign_id: z.string().min(1),
	})
	.strict();
export type GetCampaignInput = z.infer<typeof GetCampaignInputSchema>;

export const GetCampaignOutputSchema = z.object({
	// `unknown` because campaign object includes delivery metrics, dates, and content blocks.
	campaign: z.record(z.string(), z.unknown()),
});
export type GetCampaignOutput = z.infer<typeof GetCampaignOutputSchema>;

// Report Schemas
export const GetReportInputSchema = z
	.object({
		campaign_id: z.string().min(1),
	})
	.strict();
export type GetReportInput = z.infer<typeof GetReportInputSchema>;

export const GetReportOutputSchema = z.object({
	// `unknown` because report object contains comprehensive opens, clicks, and bounce analytics.
	report: z.record(z.string(), z.unknown()),
});
export type GetReportOutput = z.infer<typeof GetReportOutputSchema>;

// Input Schemas Map
export const LapostaEndpointInputSchemas = {
	'lists.list': GetListsInputSchema,
	'lists.get': GetListInputSchema,
	'lists.create': CreateListInputSchema,
	'lists.update': UpdateListInputSchema,
	'lists.delete': DeleteListInputSchema,
	'members.list': GetMembersInputSchema,
	'members.get': GetMemberInputSchema,
	'members.create': CreateMemberInputSchema,
	'members.update': UpdateMemberInputSchema,
	'members.delete': DeleteMemberInputSchema,
	'fields.list': GetFieldsInputSchema,
	'fields.get': GetFieldInputSchema,
	'fields.create': CreateFieldInputSchema,
	'fields.delete': DeleteFieldInputSchema,
	'campaigns.list': GetCampaignsInputSchema,
	'campaigns.get': GetCampaignInputSchema,
	'reports.get': GetReportInputSchema,
} as const;

// Output Schemas Map
export const LapostaEndpointOutputSchemas = {
	'lists.list': GetListsOutputSchema,
	'lists.get': GetListOutputSchema,
	'lists.create': CreateListOutputSchema,
	'lists.update': UpdateListOutputSchema,
	'lists.delete': DeleteListOutputSchema,
	'members.list': GetMembersOutputSchema,
	'members.get': GetMemberOutputSchema,
	'members.create': CreateMemberOutputSchema,
	'members.update': UpdateMemberOutputSchema,
	'members.delete': DeleteMemberOutputSchema,
	'fields.list': GetFieldsOutputSchema,
	'fields.get': GetFieldOutputSchema,
	'fields.create': CreateFieldOutputSchema,
	'fields.delete': DeleteFieldOutputSchema,
	'campaigns.list': GetCampaignsOutputSchema,
	'campaigns.get': GetCampaignOutputSchema,
	'reports.get': GetReportOutputSchema,
} as const;

export type LapostaEndpointInputs = {
	'lists.list': GetListsInput;
	'lists.get': GetListInput;
	'lists.create': CreateListInput;
	'lists.update': UpdateListInput;
	'lists.delete': DeleteListInput;
	'members.list': GetMembersInput;
	'members.get': GetMemberInput;
	'members.create': CreateMemberInput;
	'members.update': UpdateMemberInput;
	'members.delete': DeleteMemberInput;
	'fields.list': GetFieldsInput;
	'fields.get': GetFieldInput;
	'fields.create': CreateFieldInput;
	'fields.delete': DeleteFieldInput;
	'campaigns.list': GetCampaignsInput;
	'campaigns.get': GetCampaignInput;
	'reports.get': GetReportInput;
};

export type LapostaEndpointOutputs = {
	'lists.list': GetListsOutput;
	'lists.get': GetListOutput;
	'lists.create': CreateListOutput;
	'lists.update': UpdateListOutput;
	'lists.delete': DeleteListOutput;
	'members.list': GetMembersOutput;
	'members.get': GetMemberOutput;
	'members.create': CreateMemberOutput;
	'members.update': UpdateMemberOutput;
	'members.delete': DeleteMemberOutput;
	'fields.list': GetFieldsOutput;
	'fields.get': GetFieldOutput;
	'fields.create': CreateFieldOutput;
	'fields.delete': DeleteFieldOutput;
	'campaigns.list': GetCampaignsOutput;
	'campaigns.get': GetCampaignOutput;
	'reports.get': GetReportOutput;
};
