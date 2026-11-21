import { z } from 'zod';

const LapostaTimestampSchema = z.string();
const NullableTimestampSchema = LapostaTimestampSchema.nullable();
const LapostaDateTimeInputSchema = z.union([
	z.string().regex(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/),
	z.iso.datetime({ offset: true }),
]);

const ListResourceSchema = z.object({
	list_id: z.string(),
	timezone: z.string().optional(),
	created: LapostaTimestampSchema.optional(),
	created_iso: LapostaTimestampSchema.optional(),
	modified: LapostaTimestampSchema.optional(),
	modified_iso: LapostaTimestampSchema.optional(),
	state: z.enum(['active', 'deleted']),
	name: z.string(),
	locked: z.boolean().optional(),
	remarks: z.string().optional(),
	subscribe_notification_email: z.string().optional(),
	unsubscribe_notification_email: z.string().optional(),
	members: z
		.object({
			active: z.number(),
			unsubscribed: z.number(),
			cleaned: z.number(),
		})
		.optional(),
});

const MemberResourceSchema = z.object({
	member_id: z.string(),
	list_id: z.string(),
	email: z.string().email(),
	state: z.enum([
		'active',
		'unsubscribed',
		'unconfirmed',
		'cleaned',
		'deleted',
	]),
	timezone: z.string().optional(),
	signup_date: LapostaTimestampSchema.optional(),
	signup_date_iso: LapostaTimestampSchema.optional(),
	modified: NullableTimestampSchema.optional(),
	modified_iso: NullableTimestampSchema.optional(),
	confirm_date: NullableTimestampSchema.optional(),
	confirm_date_iso: NullableTimestampSchema.optional(),
	ip: z.string().optional(),
	source_url: z.string().nullable().optional(),
	// Custom fields are configured per list, so their values cannot have one fixed schema.
	custom_fields: z.record(z.string(), z.unknown()).optional(),
});

const FieldResourceSchema = z.object({
	field_id: z.string(),
	list_id: z.string(),
	timezone: z.string().optional(),
	created: LapostaTimestampSchema.optional(),
	created_iso: LapostaTimestampSchema.optional(),
	modified: NullableTimestampSchema.optional(),
	state: z.enum(['active', 'deleted']).optional(),
	name: z.string(),
	tag: z.string().optional(),
	custom_name: z.string().optional(),
	defaultvalue: z.string().optional(),
	datatype: z.enum([
		'text',
		'numeric',
		'date',
		'select_single',
		'select_multiple',
		'labels',
	]),
	datatype_display: z
		.enum(['select', 'radio', 'input', 'textarea'])
		.nullable()
		.optional(),
	options: z.array(z.string()).optional(),
	options_full: z
		.array(z.object({ id: z.number(), value: z.string() }))
		.optional(),
	required: z.boolean(),
	in_form: z.boolean(),
	in_list: z.boolean(),
	is_email: z.boolean().optional(),
	autocomplete: z.string().nullable().optional(),
});

const SegmentResourceSchema = z.object({
	segment_id: z.string(),
	list_id: z.string(),
	name: z.string(),
	definition: z.string(),
	timezone: z.string().optional(),
	created: LapostaTimestampSchema.optional(),
	created_iso: LapostaTimestampSchema.optional(),
	modified: NullableTimestampSchema.optional(),
	modified_iso: NullableTimestampSchema.optional(),
	state: z.enum(['active', 'deleted']).optional(),
});

const WebhookResourceSchema = z.object({
	webhook_id: z.string(),
	list_id: z.string(),
	timezone: z.string().optional(),
	created: LapostaTimestampSchema.optional(),
	created_iso: LapostaTimestampSchema.optional(),
	modified: NullableTimestampSchema.optional(),
	modified_iso: NullableTimestampSchema.optional(),
	state: z.enum(['active', 'deleted']),
	event: z.enum(['subscribed', 'modified', 'deactivated']),
	url: z.string().url(),
	blocked: z.boolean(),
	secret: z.string(),
});

const CampaignResourceSchema = z.object({
	account_id: z.string().optional(),
	campaign_id: z.string(),
	timezone: z.string().optional(),
	created: LapostaTimestampSchema.optional(),
	created_iso: LapostaTimestampSchema.optional(),
	modified: NullableTimestampSchema.optional(),
	modified_iso: NullableTimestampSchema.optional(),
	type: z.literal('regular').optional(),
	delivery_requested: NullableTimestampSchema.optional(),
	delivery_requested_iso: NullableTimestampSchema.optional(),
	delivery_started: NullableTimestampSchema.optional(),
	delivery_started_iso: NullableTimestampSchema.optional(),
	delivery_ended: NullableTimestampSchema.optional(),
	delivery_ended_iso: NullableTimestampSchema.optional(),
	name: z.string(),
	subject: z.string().optional(),
	previewtext: z.string().optional(),
	from: z.object({ name: z.string(), email: z.string().email() }).optional(),
	reply_to: z.string().email().nullable().optional(),
	list_ids: z.record(z.string(), z.array(z.string())).optional(),
	stats: z.object({ ga: z.string() }).optional(),
	web: z.string().url().optional(),
	screenshot: z.record(z.string(), z.string().url()).optional(),
	state: z.string().optional(),
});

const CampaignContentSchema = z.object({
	account_id: z.string().optional(),
	campaign_id: z.string(),
	plaintext: z.string().optional(),
	html: z.string().optional(),
	import_url: z.string().url().optional(),
	report: z
		.object({
			javascript: z.boolean().optional(),
			flash: z.boolean().optional(),
			no_unsubscribe: z.boolean().optional(),
			empty_unsubscribe: z.boolean().optional(),
			css: z.array(z.string()).optional(),
			images: z.array(z.string()).optional(),
		})
		.optional(),
});

const ReportResourceSchema = z.object({
	account_id: z.string(),
	campaign_id: z.string(),
	sent: z.number(),
	accepted: z.number(),
	cleaned: z.number(),
	complained: z.number(),
	hardbounced: z.number(),
	unsubscribed: z.number(),
	opened_unique: z.number(),
	clicked_unique: z.number(),
	webversion_unique: z.number(),
	accepted_ratio: z.number(),
	opened_ratio: z.number(),
	clicked_ratio: z.number(),
});

const PaginationSchema = z.object({
	limit: z.number(),
	has_more: z.boolean(),
	next_cursor: z.string().nullable(),
});

const HistoryDetailsSchema = z.object({
	source: z.string().optional(),
	source_url: z.string().url().optional(),
	unsubscribe_source: z.string().optional(),
	url: z.string().url().optional(),
	link_type: z.string().optional(),
	reason: z.string().optional(),
	automation_name: z.string().optional(),
	feedback_reason: z.string().optional(),
	feedback_comments: z.string().optional(),
	bounce_type: z.string().optional(),
	bounce_code: z.union([z.string(), z.number()]).optional(),
	softbounce_count: z.number().optional(),
	softbounce_max_count: z.number().optional(),
});

// List Schemas
export const GetListsInputSchema = z.object({}).strict();
export type GetListsInput = z.infer<typeof GetListsInputSchema>;

export const GetListsOutputSchema = z.object({
	data: z.array(z.object({ list: ListResourceSchema })),
});
export type GetListsOutput = z.infer<typeof GetListsOutputSchema>;

export const GetListInputSchema = z
	.object({
		list_id: z.string().min(1),
	})
	.strict();
export type GetListInput = z.infer<typeof GetListInputSchema>;

export const GetListOutputSchema = z.object({
	list: ListResourceSchema,
});
export type GetListOutput = z.infer<typeof GetListOutputSchema>;

export const CreateListInputSchema = z
	.object({
		name: z.string().min(1),
		locked: z.boolean().optional(),
		remarks: z.string().optional(),
		subscribe_notification_email: z.string().optional(),
		unsubscribe_notification_email: z.string().optional(),
	})
	.strict();
export type CreateListInput = z.infer<typeof CreateListInputSchema>;

export const CreateListOutputSchema = z.object({
	list: ListResourceSchema,
});
export type CreateListOutput = z.infer<typeof CreateListOutputSchema>;

export const UpdateListInputSchema = z
	.object({
		list_id: z.string().min(1),
		name: z.string().optional(),
		locked: z.boolean().optional(),
		remarks: z.string().optional(),
		subscribe_notification_email: z.string().optional(),
		unsubscribe_notification_email: z.string().optional(),
	})
	.strict()
	.refine(
		({
			name,
			locked,
			remarks,
			subscribe_notification_email,
			unsubscribe_notification_email,
		}) =>
			[
				name,
				locked,
				remarks,
				subscribe_notification_email,
				unsubscribe_notification_email,
			].some((value) => value !== undefined),
	);
export type UpdateListInput = z.infer<typeof UpdateListInputSchema>;

export const UpdateListOutputSchema = z.object({
	list: ListResourceSchema,
});
export type UpdateListOutput = z.infer<typeof UpdateListOutputSchema>;

export const DeleteListInputSchema = z
	.object({
		list_id: z.string().min(1),
	})
	.strict();
export type DeleteListInput = z.infer<typeof DeleteListInputSchema>;

export const DeleteListOutputSchema = z.object({
	list: ListResourceSchema,
});
export type DeleteListOutput = z.infer<typeof DeleteListOutputSchema>;

// Member Schemas
export const GetMembersInputSchema = z
	.object({
		list_id: z.string().min(1),
		state: z.enum(['active', 'unsubscribed', 'cleaned']).optional(),
		limit: z.number().int().min(1).max(1000).optional(),
		cursor: z.string().min(1).optional(),
		order_by: z.string().min(1).optional(),
		order: z.enum(['asc', 'desc']).optional(),
		search: z.string().max(255).optional(),
		label: z.string().min(1).optional(),
	})
	.strict();
export type GetMembersInput = z.infer<typeof GetMembersInputSchema>;

export const GetMembersOutputSchema = z.object({
	data: z.array(z.object({ member: MemberResourceSchema })),
	pagination: PaginationSchema.optional(),
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
	member: MemberResourceSchema,
});
export type GetMemberOutput = z.infer<typeof GetMemberOutputSchema>;

export const CreateMemberInputSchema = z
	.object({
		list_id: z.string().min(1),
		email: z.string().email(),
		ip: z.union([z.ipv4(), z.ipv6()]),
		source_url: z.string().url().optional(),
		user_agent: z.string().optional(),
		// `unknown` because subscriber custom fields vary per mailing list schema.
		custom_fields: z.record(z.string(), z.unknown()).optional(),
		options: z
			.object({
				upsert: z.boolean().optional(),
				suppress_reactivation: z.boolean().optional(),
				suppress_email_notification: z.boolean().optional(),
				ignore_doubleoptin: z.boolean().optional(),
				spam_check: z.boolean().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();
export type CreateMemberInput = z.infer<typeof CreateMemberInputSchema>;

export const CreateMemberOutputSchema = z.object({
	member: MemberResourceSchema,
});
export type CreateMemberOutput = z.infer<typeof CreateMemberOutputSchema>;

export const UpdateMemberInputSchema = z
	.object({
		list_id: z.string().min(1),
		member_id: z.string().min(1),
		email: z.string().email().optional(),
		state: z.enum(['active', 'unsubscribed']).optional(),
		// `unknown` because custom subscriber fields can be dynamically updated.
		custom_fields: z.record(z.string(), z.unknown()).optional(),
	})
	.strict()
	.refine(({ email, state, custom_fields }) =>
		[email, state, custom_fields].some((value) => value !== undefined),
	);
export type UpdateMemberInput = z.infer<typeof UpdateMemberInputSchema>;

export const UpdateMemberOutputSchema = z.object({
	member: MemberResourceSchema,
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
	member: MemberResourceSchema,
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
	data: z.array(z.object({ field: FieldResourceSchema })),
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
	field: FieldResourceSchema,
});
export type GetFieldOutput = z.infer<typeof GetFieldOutputSchema>;

export const CreateFieldInputSchema = z
	.object({
		list_id: z.string().min(1),
		name: z.string().min(1),
		datatype: z.enum([
			'text',
			'numeric',
			'date',
			'select_single',
			'select_multiple',
		]),
		datatype_display: z
			.enum(['select', 'radio', 'input', 'textarea'])
			.optional(),
		defaultvalue: z.string().optional(),
		options: z.array(z.string()).optional(),
		required: z.boolean(),
		in_form: z.boolean(),
		in_list: z.boolean(),
	})
	.strict()
	.superRefine((input, context) => {
		if (
			(input.datatype === 'select_single' ||
				input.datatype === 'select_multiple') &&
			(!input.options || input.options.length === 0)
		) {
			context.addIssue({
				code: 'custom',
				message: 'Select fields require at least one option',
				path: ['options'],
			});
		}
	});
export type CreateFieldInput = z.infer<typeof CreateFieldInputSchema>;

export const CreateFieldOutputSchema = z.object({
	field: FieldResourceSchema,
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
	field: FieldResourceSchema,
});
export type DeleteFieldOutput = z.infer<typeof DeleteFieldOutputSchema>;

// Campaign Schemas
export const GetCampaignsInputSchema = z
	.object({
		status: z.enum(['draft', 'sent']).optional(),
		limit: z.number().int().min(1).max(1000).optional(),
		cursor: z.string().min(1).optional(),
	})
	.strict();
export type GetCampaignsInput = z.infer<typeof GetCampaignsInputSchema>;

export const GetCampaignsOutputSchema = z.object({
	data: z.array(z.object({ campaign: CampaignResourceSchema })),
	pagination: PaginationSchema.optional(),
});
export type GetCampaignsOutput = z.infer<typeof GetCampaignsOutputSchema>;

export const GetCampaignInputSchema = z
	.object({
		campaign_id: z.string().min(1),
	})
	.strict();
export type GetCampaignInput = z.infer<typeof GetCampaignInputSchema>;

export const GetCampaignOutputSchema = z.object({
	campaign: CampaignResourceSchema,
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
	report: ReportResourceSchema,
});
export type GetReportOutput = z.infer<typeof GetReportOutputSchema>;

export const ListMembersInputSchema = z
	.object({
		list_id: z.string().min(1),
		actions: z
			.array(z.enum(['add', 'update', 'unsubscribe_excluded']))
			.min(1)
			.optional(),
		mode: z.enum(['edit', 'add', 'add_and_edit']).optional(),
		members: z
			.array(
				z
					.object({
						member_id: z.string().min(1).optional(),
						email: z.string().email().optional(),
						state: z.enum(['active', 'unsubscribed']).optional(),
						source_url: z.string().url().optional(),
						// Member custom fields are configured per list, so values vary by account.
						custom_fields: z.record(z.string(), z.unknown()).optional(),
					})
					.strict()
					.refine(
						(member) =>
							member.member_id !== undefined || member.email !== undefined,
					),
			)
			.min(1)
			.max(500000),
	})
	.strict()
	.superRefine((input, context) => {
		if (input.actions === undefined && input.mode === undefined) {
			context.addIssue({
				code: 'custom',
				message: 'Provide actions or the deprecated mode',
				path: ['actions'],
			});
		}
		if (input.actions !== undefined && input.mode !== undefined) {
			context.addIssue({
				code: 'custom',
				message: 'Do not combine actions and mode',
				path: ['mode'],
			});
		}
		if (input.members === undefined) {
			context.addIssue({
				code: 'custom',
				message: 'At least one member is required',
				path: ['members'],
			});
		}
	});
export type ListMembersInput = z.infer<typeof ListMembersInputSchema>;

export const ListMembersOutputSchema = z.object({
	report: z.object({
		provided_count: z.number(),
		errors_count: z.number(),
		skipped_count: z.number(),
		edited_count: z.number(),
		added_count: z.number(),
		unsubscribed_count: z.number().optional(),
	}),
	errors: z.array(
		z.object({
			provided_data: z.object({
				member_id: z.string().optional(),
				email: z.string().email().optional(),
				state: z.enum(['active', 'unsubscribed']).optional(),
				source_url: z.string().url().optional(),
				// Member custom fields are configured per list, so values vary by account.
				custom_fields: z.record(z.string(), z.unknown()).optional(),
			}),
			error: z.object({
				message: z.string(),
				code: z.number(),
				parameter: z.string().optional(),
				id: z.string().optional(),
				type: z.string().optional(),
			}),
		}),
	),
	skipped: z.array(
		z.object({
			provided_data: z.object({
				member_id: z.string().optional(),
				email: z.string().email().optional(),
				state: z.enum(['active', 'unsubscribed']).optional(),
				source_url: z.string().url().optional(),
				// Member custom fields are configured per list, so values vary by account.
				custom_fields: z.record(z.string(), z.unknown()).optional(),
			}),
			member: MemberResourceSchema.optional(),
		}),
	),
	edited: z.array(
		z.object({
			provided_data: z.object({
				member_id: z.string().optional(),
				email: z.string().email().optional(),
				state: z.enum(['active', 'unsubscribed']).optional(),
				source_url: z.string().url().optional(),
				// Member custom fields are configured per list, so values vary by account.
				custom_fields: z.record(z.string(), z.unknown()).optional(),
			}),
			member: MemberResourceSchema.optional(),
		}),
	),
	added: z.array(
		z.object({
			provided_data: z.object({
				member_id: z.string().optional(),
				email: z.string().email().optional(),
				state: z.enum(['active', 'unsubscribed']).optional(),
				source_url: z.string().url().optional(),
				// Member custom fields are configured per list, so values vary by account.
				custom_fields: z.record(z.string(), z.unknown()).optional(),
			}),
			member: MemberResourceSchema.optional(),
		}),
	),
});
export type ListMembersOutput = z.infer<typeof ListMembersOutputSchema>;

export const PurgeListMembersInputSchema = z
	.object({ list_id: z.string().min(1) })
	.strict();
export type PurgeListMembersInput = z.infer<typeof PurgeListMembersInputSchema>;
export const PurgeListMembersOutputSchema = z.object({
	list: ListResourceSchema,
});
export type PurgeListMembersOutput = z.infer<
	typeof PurgeListMembersOutputSchema
>;

export const GetMemberHistoryInputSchema = z
	.object({
		list_id: z.string().min(1),
		member_id: z.string().min(1),
		campaign_id: z.string().min(1).optional(),
		event_date_from: LapostaDateTimeInputSchema.optional(),
		event_date_to: LapostaDateTimeInputSchema.optional(),
		limit: z.number().int().min(1).max(1000).optional(),
		cursor: z.string().min(1).optional(),
		order_by: z.literal('event_date').optional(),
		order: z.enum(['desc', 'asc']).optional(),
	})
	.strict();
export type GetMemberHistoryInput = z.infer<typeof GetMemberHistoryInputSchema>;
const HistoryEventSchema = z.object({
	type: z.string(),
	timezone: z.string(),
	event_date: z.string(),
	event_date_iso: z.string(),
	campaign: z
		.object({
			campaign_id: z.string(),
			name: z.string(),
			from_automation: z.boolean().optional(),
			deleted: z.boolean().optional(),
		})
		.nullable(),
	details: HistoryDetailsSchema.nullable(),
});
export const GetMemberHistoryOutputSchema = z.object({
	pagination: PaginationSchema,
	order: z.object({ order_by: z.string(), order: z.enum(['desc', 'asc']) }),
	filters: z.record(z.string(), z.string().nullable()),
	data: z.array(z.object({ event: HistoryEventSchema })),
});
export type GetMemberHistoryOutput = z.infer<
	typeof GetMemberHistoryOutputSchema
>;

export const UpdateFieldInputSchema = z
	.object({
		list_id: z.string().min(1),
		field_id: z.string().min(1),
		name: z.string().min(1).optional(),
		datatype: z
			.enum(['text', 'numeric', 'date', 'select_single', 'select_multiple'])
			.optional(),
		datatype_display: z
			.enum(['select', 'radio', 'input', 'textarea'])
			.optional(),
		options_full: z
			.union([
				z.record(z.string(), z.string()),
				z.array(
					z.object({
						id: z.union([z.number(), z.string()]),
						value: z.string(),
					}),
				),
			])
			.optional(),
		defaultvalue: z.string().optional(),
		required: z.boolean().optional(),
		in_form: z.boolean().optional(),
		in_list: z.boolean().optional(),
	})
	.strict()
	.refine(
		({
			name,
			datatype,
			datatype_display,
			options_full,
			defaultvalue,
			required,
			in_form,
			in_list,
		}) =>
			[
				name,
				datatype,
				datatype_display,
				options_full,
				defaultvalue,
				required,
				in_form,
				in_list,
			].some((value) => value !== undefined),
	);
export type UpdateFieldInput = z.infer<typeof UpdateFieldInputSchema>;
export const UpdateFieldOutputSchema = z.object({ field: FieldResourceSchema });
export type UpdateFieldOutput = z.infer<typeof UpdateFieldOutputSchema>;

export const GetSegmentsInputSchema = z
	.object({ list_id: z.string().min(1) })
	.strict();
export type GetSegmentsInput = z.infer<typeof GetSegmentsInputSchema>;
export const GetSegmentsOutputSchema = z.object({
	data: z.array(z.object({ segment: SegmentResourceSchema })),
});
export type GetSegmentsOutput = z.infer<typeof GetSegmentsOutputSchema>;
export const GetSegmentInputSchema = z
	.object({ list_id: z.string().min(1), segment_id: z.string().min(1) })
	.strict();
export type GetSegmentInput = z.infer<typeof GetSegmentInputSchema>;
export const GetSegmentOutputSchema = z.object({
	segment: SegmentResourceSchema,
});
export type GetSegmentOutput = z.infer<typeof GetSegmentOutputSchema>;
export const CreateSegmentInputSchema = z
	.object({
		list_id: z.string().min(1),
		name: z.string().min(1),
		definition: z.string().min(1),
	})
	.strict();
export type CreateSegmentInput = z.infer<typeof CreateSegmentInputSchema>;
export const CreateSegmentOutputSchema = GetSegmentOutputSchema;
export type CreateSegmentOutput = z.infer<typeof CreateSegmentOutputSchema>;
export const UpdateSegmentInputSchema = z
	.object({
		list_id: z.string().min(1),
		segment_id: z.string().min(1),
		name: z.string().min(1).optional(),
		definition: z.string().min(1).optional(),
	})
	.strict()
	.refine(
		({ name, definition }) => name !== undefined || definition !== undefined,
	);
export type UpdateSegmentInput = z.infer<typeof UpdateSegmentInputSchema>;
export const UpdateSegmentOutputSchema = GetSegmentOutputSchema;
export type UpdateSegmentOutput = z.infer<typeof UpdateSegmentOutputSchema>;
export const DeleteSegmentInputSchema = GetSegmentInputSchema;
export type DeleteSegmentInput = z.infer<typeof DeleteSegmentInputSchema>;
export const DeleteSegmentOutputSchema = GetSegmentOutputSchema;
export type DeleteSegmentOutput = z.infer<typeof DeleteSegmentOutputSchema>;

export const GetWebhooksInputSchema = z
	.object({ list_id: z.string().min(1) })
	.strict();
export type GetWebhooksInput = z.infer<typeof GetWebhooksInputSchema>;
export const GetWebhooksOutputSchema = z.object({
	data: z.array(z.object({ webhook: WebhookResourceSchema })),
});
export type GetWebhooksOutput = z.infer<typeof GetWebhooksOutputSchema>;
export const GetWebhookInputSchema = z
	.object({ list_id: z.string().min(1), webhook_id: z.string().min(1) })
	.strict();
export type GetWebhookInput = z.infer<typeof GetWebhookInputSchema>;
export const GetWebhookOutputSchema = z.object({
	webhook: WebhookResourceSchema,
});
export type GetWebhookOutput = z.infer<typeof GetWebhookOutputSchema>;
export const CreateWebhookInputSchema = z
	.object({
		list_id: z.string().min(1),
		event: z.enum(['subscribed', 'modified', 'deactivated']),
		url: z.string().url(),
		blocked: z.boolean(),
	})
	.strict();
export type CreateWebhookInput = z.infer<typeof CreateWebhookInputSchema>;
export const CreateWebhookOutputSchema = GetWebhookOutputSchema;
export type CreateWebhookOutput = z.infer<typeof CreateWebhookOutputSchema>;
export const UpdateWebhookInputSchema = z
	.object({
		list_id: z.string().min(1),
		webhook_id: z.string().min(1),
		event: z.enum(['subscribed', 'modified', 'deactivated']).optional(),
		url: z.string().url().optional(),
		blocked: z.boolean().optional(),
	})
	.strict()
	.refine(
		({ event, url, blocked }) =>
			event !== undefined || url !== undefined || blocked !== undefined,
	);
export type UpdateWebhookInput = z.infer<typeof UpdateWebhookInputSchema>;
export const UpdateWebhookOutputSchema = GetWebhookOutputSchema;
export type UpdateWebhookOutput = z.infer<typeof UpdateWebhookOutputSchema>;
export const DeleteWebhookInputSchema = GetWebhookInputSchema;
export type DeleteWebhookInput = z.infer<typeof DeleteWebhookInputSchema>;
export const DeleteWebhookOutputSchema = GetWebhookOutputSchema;
export type DeleteWebhookOutput = z.infer<typeof DeleteWebhookOutputSchema>;

export const GetCampaignHistoryInputSchema = z
	.object({
		campaign_id: z.string().min(1),
		event_date_from: LapostaDateTimeInputSchema.optional(),
		event_date_to: LapostaDateTimeInputSchema.optional(),
		limit: z.number().int().min(1).max(1000).optional(),
		cursor: z.string().min(1).optional(),
		order_by: z.literal('event_date').optional(),
		order: z.enum(['desc', 'asc']).optional(),
	})
	.strict();
export type GetCampaignHistoryInput = z.infer<
	typeof GetCampaignHistoryInputSchema
>;
const CampaignHistoryEventSchema = z.object({
	type: z.string(),
	timezone: z.string(),
	event_date: z.string(),
	event_date_iso: z.string(),
	campaign: z.object({
		campaign_id: z.string(),
		name: z.string(),
		from_automation: z.boolean(),
		deleted: z.boolean(),
	}),
	list: z
		.object({ list_id: z.string(), name: z.string(), deleted: z.boolean() })
		.optional(),
	member: z
		.object({
			member_id: z.string().nullable(),
			email: z.string().email().nullable(),
			deleted: z.boolean(),
		})
		.optional(),
	details: HistoryDetailsSchema.nullable(),
});
export const GetCampaignHistoryOutputSchema = z.object({
	pagination: PaginationSchema,
	order: z.object({ order_by: z.string(), order: z.enum(['desc', 'asc']) }),
	filters: z.record(z.string(), z.string().nullable()),
	data: z.array(z.object({ event: CampaignHistoryEventSchema })),
});
export type GetCampaignHistoryOutput = z.infer<
	typeof GetCampaignHistoryOutputSchema
>;

export const CreateCampaignInputSchema = z
	.object({
		type: z.literal('regular'),
		name: z.string().min(1).max(255),
		subject: z.string().min(1).max(255),
		previewtext: z.string().max(120).optional(),
		from: z
			.object({ name: z.string().min(1).max(255), email: z.string().email() })
			.strict(),
		reply_to: z.string().email().optional(),
		list_ids: z.array(z.string().min(1)).min(1),
		stats: z.object({ ga: z.boolean() }).strict().optional(),
	})
	.strict();
export type CreateCampaignInput = z.infer<typeof CreateCampaignInputSchema>;
export const CreateCampaignOutputSchema = z.object({
	campaign: CampaignResourceSchema,
});
export type CreateCampaignOutput = z.infer<typeof CreateCampaignOutputSchema>;
export const UpdateCampaignInputSchema = z
	.object({
		campaign_id: z.string().min(1),
		name: z.string().min(1).max(255).optional(),
		subject: z.string().min(1).max(255).optional(),
		previewtext: z.string().max(120).optional(),
		from: z
			.object({
				name: z.string().min(1).max(255).optional(),
				email: z.string().email().optional(),
			})
			.strict()
			.refine(({ name, email }) => name !== undefined || email !== undefined)
			.optional(),
		reply_to: z.string().email().optional(),
		list_ids: z.array(z.string().min(1)).min(1).optional(),
		stats: z.object({ ga: z.boolean() }).strict().optional(),
	})
	.strict()
	.refine(({ name, subject, previewtext, from, reply_to, list_ids, stats }) =>
		[name, subject, previewtext, from, reply_to, list_ids, stats].some(
			(value) => value !== undefined,
		),
	);
export type UpdateCampaignInput = z.infer<typeof UpdateCampaignInputSchema>;
export const UpdateCampaignOutputSchema = CreateCampaignOutputSchema;
export type UpdateCampaignOutput = z.infer<typeof UpdateCampaignOutputSchema>;
export const DeleteCampaignInputSchema = z
	.object({ campaign_id: z.string().min(1) })
	.strict();
export type DeleteCampaignInput = z.infer<typeof DeleteCampaignInputSchema>;
export const DeleteCampaignOutputSchema = CreateCampaignOutputSchema;
export type DeleteCampaignOutput = z.infer<typeof DeleteCampaignOutputSchema>;
export const GetCampaignContentInputSchema = DeleteCampaignInputSchema;
export type GetCampaignContentInput = z.infer<
	typeof GetCampaignContentInputSchema
>;
export const GetCampaignContentOutputSchema = z.object({
	campaign: CampaignContentSchema,
});
export type GetCampaignContentOutput = z.infer<
	typeof GetCampaignContentOutputSchema
>;
export const UpdateCampaignContentInputSchema = z
	.object({
		campaign_id: z.string().min(1),
		html: z.string().optional(),
		import_url: z.string().url().optional(),
		inline_css: z.boolean().optional(),
	})
	.strict()
	.refine(
		({ html, import_url }) => html !== undefined || import_url !== undefined,
	);
export type UpdateCampaignContentInput = z.infer<
	typeof UpdateCampaignContentInputSchema
>;
export const UpdateCampaignContentOutputSchema = GetCampaignContentOutputSchema;
export type UpdateCampaignContentOutput = z.infer<
	typeof UpdateCampaignContentOutputSchema
>;
export const SendCampaignInputSchema = DeleteCampaignInputSchema;
export type SendCampaignInput = z.infer<typeof SendCampaignInputSchema>;
export const SendCampaignOutputSchema = CreateCampaignOutputSchema;
export type SendCampaignOutput = z.infer<typeof SendCampaignOutputSchema>;
export const ScheduleCampaignInputSchema = z
	.object({
		campaign_id: z.string().min(1),
		delivery_requested: LapostaDateTimeInputSchema,
	})
	.strict();
export type ScheduleCampaignInput = z.infer<typeof ScheduleCampaignInputSchema>;
export const ScheduleCampaignOutputSchema = CreateCampaignOutputSchema;
export type ScheduleCampaignOutput = z.infer<
	typeof ScheduleCampaignOutputSchema
>;
export const SendTestCampaignInputSchema = z
	.object({ campaign_id: z.string().min(1), email: z.string().email() })
	.strict();
export type SendTestCampaignInput = z.infer<typeof SendTestCampaignInputSchema>;
export const SendTestCampaignOutputSchema = CreateCampaignOutputSchema;
export type SendTestCampaignOutput = z.infer<
	typeof SendTestCampaignOutputSchema
>;

export const GetReportsInputSchema = z
	.object({
		limit: z.number().int().min(1).max(1000).optional(),
		cursor: z.string().min(1).optional(),
	})
	.strict();
export type GetReportsInput = z.infer<typeof GetReportsInputSchema>;
export const GetReportsOutputSchema = z.object({
	data: z.array(z.object({ report: ReportResourceSchema })),
	pagination: PaginationSchema.optional(),
});
export type GetReportsOutput = z.infer<typeof GetReportsOutputSchema>;

// Input Schemas Map
export const LapostaEndpointInputSchemas = {
	'lists.list': GetListsInputSchema,
	'lists.get': GetListInputSchema,
	'lists.create': CreateListInputSchema,
	'lists.update': UpdateListInputSchema,
	'lists.delete': DeleteListInputSchema,
	'lists.purge_members': PurgeListMembersInputSchema,
	'lists.sync_members': ListMembersInputSchema,
	'members.list': GetMembersInputSchema,
	'members.get': GetMemberInputSchema,
	'members.create': CreateMemberInputSchema,
	'members.update': UpdateMemberInputSchema,
	'members.delete': DeleteMemberInputSchema,
	'members.history': GetMemberHistoryInputSchema,
	'fields.list': GetFieldsInputSchema,
	'fields.get': GetFieldInputSchema,
	'fields.create': CreateFieldInputSchema,
	'fields.update': UpdateFieldInputSchema,
	'fields.delete': DeleteFieldInputSchema,
	'segments.list': GetSegmentsInputSchema,
	'segments.get': GetSegmentInputSchema,
	'segments.create': CreateSegmentInputSchema,
	'segments.update': UpdateSegmentInputSchema,
	'segments.delete': DeleteSegmentInputSchema,
	'webhooks.list': GetWebhooksInputSchema,
	'webhooks.get': GetWebhookInputSchema,
	'webhooks.create': CreateWebhookInputSchema,
	'webhooks.update': UpdateWebhookInputSchema,
	'webhooks.delete': DeleteWebhookInputSchema,
	'campaigns.list': GetCampaignsInputSchema,
	'campaigns.create': CreateCampaignInputSchema,
	'campaigns.get': GetCampaignInputSchema,
	'campaigns.update': UpdateCampaignInputSchema,
	'campaigns.delete': DeleteCampaignInputSchema,
	'campaigns.history': GetCampaignHistoryInputSchema,
	'campaigns.get_content': GetCampaignContentInputSchema,
	'campaigns.update_content': UpdateCampaignContentInputSchema,
	'campaigns.send': SendCampaignInputSchema,
	'campaigns.schedule': ScheduleCampaignInputSchema,
	'campaigns.send_test': SendTestCampaignInputSchema,
	'reports.list': GetReportsInputSchema,
	'reports.get': GetReportInputSchema,
} as const;

// Output Schemas Map
export const LapostaEndpointOutputSchemas = {
	'lists.list': GetListsOutputSchema,
	'lists.get': GetListOutputSchema,
	'lists.create': CreateListOutputSchema,
	'lists.update': UpdateListOutputSchema,
	'lists.delete': DeleteListOutputSchema,
	'lists.purge_members': PurgeListMembersOutputSchema,
	'lists.sync_members': ListMembersOutputSchema,
	'members.list': GetMembersOutputSchema,
	'members.get': GetMemberOutputSchema,
	'members.create': CreateMemberOutputSchema,
	'members.update': UpdateMemberOutputSchema,
	'members.delete': DeleteMemberOutputSchema,
	'members.history': GetMemberHistoryOutputSchema,
	'fields.list': GetFieldsOutputSchema,
	'fields.get': GetFieldOutputSchema,
	'fields.create': CreateFieldOutputSchema,
	'fields.update': UpdateFieldOutputSchema,
	'fields.delete': DeleteFieldOutputSchema,
	'segments.list': GetSegmentsOutputSchema,
	'segments.get': GetSegmentOutputSchema,
	'segments.create': CreateSegmentOutputSchema,
	'segments.update': UpdateSegmentOutputSchema,
	'segments.delete': DeleteSegmentOutputSchema,
	'webhooks.list': GetWebhooksOutputSchema,
	'webhooks.get': GetWebhookOutputSchema,
	'webhooks.create': CreateWebhookOutputSchema,
	'webhooks.update': UpdateWebhookOutputSchema,
	'webhooks.delete': DeleteWebhookOutputSchema,
	'campaigns.list': GetCampaignsOutputSchema,
	'campaigns.create': CreateCampaignOutputSchema,
	'campaigns.get': GetCampaignOutputSchema,
	'campaigns.update': UpdateCampaignOutputSchema,
	'campaigns.delete': DeleteCampaignOutputSchema,
	'campaigns.history': GetCampaignHistoryOutputSchema,
	'campaigns.get_content': GetCampaignContentOutputSchema,
	'campaigns.update_content': UpdateCampaignContentOutputSchema,
	'campaigns.send': SendCampaignOutputSchema,
	'campaigns.schedule': ScheduleCampaignOutputSchema,
	'campaigns.send_test': SendTestCampaignOutputSchema,
	'reports.list': GetReportsOutputSchema,
	'reports.get': GetReportOutputSchema,
} as const;

export type LapostaEndpointInputs = {
	'lists.list': GetListsInput;
	'lists.get': GetListInput;
	'lists.create': CreateListInput;
	'lists.update': UpdateListInput;
	'lists.delete': DeleteListInput;
	'lists.purge_members': PurgeListMembersInput;
	'lists.sync_members': ListMembersInput;
	'members.list': GetMembersInput;
	'members.get': GetMemberInput;
	'members.create': CreateMemberInput;
	'members.update': UpdateMemberInput;
	'members.delete': DeleteMemberInput;
	'members.history': GetMemberHistoryInput;
	'fields.list': GetFieldsInput;
	'fields.get': GetFieldInput;
	'fields.create': CreateFieldInput;
	'fields.update': UpdateFieldInput;
	'fields.delete': DeleteFieldInput;
	'segments.list': GetSegmentsInput;
	'segments.get': GetSegmentInput;
	'segments.create': CreateSegmentInput;
	'segments.update': UpdateSegmentInput;
	'segments.delete': DeleteSegmentInput;
	'webhooks.list': GetWebhooksInput;
	'webhooks.get': GetWebhookInput;
	'webhooks.create': CreateWebhookInput;
	'webhooks.update': UpdateWebhookInput;
	'webhooks.delete': DeleteWebhookInput;
	'campaigns.list': GetCampaignsInput;
	'campaigns.create': CreateCampaignInput;
	'campaigns.get': GetCampaignInput;
	'campaigns.update': UpdateCampaignInput;
	'campaigns.delete': DeleteCampaignInput;
	'campaigns.history': GetCampaignHistoryInput;
	'campaigns.get_content': GetCampaignContentInput;
	'campaigns.update_content': UpdateCampaignContentInput;
	'campaigns.send': SendCampaignInput;
	'campaigns.schedule': ScheduleCampaignInput;
	'campaigns.send_test': SendTestCampaignInput;
	'reports.list': GetReportsInput;
	'reports.get': GetReportInput;
};

export type LapostaEndpointOutputs = {
	'lists.list': GetListsOutput;
	'lists.get': GetListOutput;
	'lists.create': CreateListOutput;
	'lists.update': UpdateListOutput;
	'lists.delete': DeleteListOutput;
	'lists.purge_members': PurgeListMembersOutput;
	'lists.sync_members': ListMembersOutput;
	'members.list': GetMembersOutput;
	'members.get': GetMemberOutput;
	'members.create': CreateMemberOutput;
	'members.update': UpdateMemberOutput;
	'members.delete': DeleteMemberOutput;
	'members.history': GetMemberHistoryOutput;
	'fields.list': GetFieldsOutput;
	'fields.get': GetFieldOutput;
	'fields.create': CreateFieldOutput;
	'fields.update': UpdateFieldOutput;
	'fields.delete': DeleteFieldOutput;
	'segments.list': GetSegmentsOutput;
	'segments.get': GetSegmentOutput;
	'segments.create': CreateSegmentOutput;
	'segments.update': UpdateSegmentOutput;
	'segments.delete': DeleteSegmentOutput;
	'webhooks.list': GetWebhooksOutput;
	'webhooks.get': GetWebhookOutput;
	'webhooks.create': CreateWebhookOutput;
	'webhooks.update': UpdateWebhookOutput;
	'webhooks.delete': DeleteWebhookOutput;
	'campaigns.list': GetCampaignsOutput;
	'campaigns.create': CreateCampaignOutput;
	'campaigns.get': GetCampaignOutput;
	'campaigns.update': UpdateCampaignOutput;
	'campaigns.delete': DeleteCampaignOutput;
	'campaigns.history': GetCampaignHistoryOutput;
	'campaigns.get_content': GetCampaignContentOutput;
	'campaigns.update_content': UpdateCampaignContentOutput;
	'campaigns.send': SendCampaignOutput;
	'campaigns.schedule': ScheduleCampaignOutput;
	'campaigns.send_test': SendTestCampaignOutput;
	'reports.list': GetReportsOutput;
	'reports.get': GetReportOutput;
};
