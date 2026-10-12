import { z } from 'zod';

const IdSchema = z.coerce.number().int().positive();
// Widget settings are a provider-defined map whose keys change with the
// widget's configured features, so only the outer object shape is enforced.
const WidgetSettingsSchema = z.record(z.string(), z.unknown());

const UserSchema = z
	.object({
		id: IdSchema.optional(),
		name: z.string().optional(),
		tel: z.string().optional(),
		email: z.string().optional(),
		role: z
			.union([z.string(), z.object({ slug: z.string() }).loose()])
			.optional(),
	})
	.loose();

const WidgetSchema = z
	.object({
		id: IdSchema.optional(),
		url: z.string().optional(),
		description: z.string().optional(),
		locale_code: z.string().optional(),
		enabled: z.boolean().optional(),
		settings: WidgetSettingsSchema.optional(),
	})
	.loose();

const BusinessTimeInputSchema = z.object({
	day_of_week: z.number().int().min(0).max(6),
	enabled: z.boolean(),
	start_time: z.string().nullable(),
	end_time: z.string().nullable(),
});

const ManagerSchema = z
	.object({
		id: IdSchema,
		enabled: z.boolean().optional(),
		user: UserSchema.optional(),
		departments: z
			.array(z.object({ id: IdSchema, name: z.string() }).loose())
			.optional(),
		business_times: z
			.array(
				BusinessTimeInputSchema.extend({
					timezone: z.string().optional(),
				}).loose(),
			)
			.optional(),
	})
	.loose();

const IdResponseSchema = z.object({ id: IdSchema }).loose();

const SmsMessageSchema = z
	.object({
		message_id: z.string(),
		text: z.string(),
		enabled: z.union([z.boolean(), z.number()]).optional(),
		updated_at: z.string().nullable().optional(),
	})
	.loose();

const VoiceMessageSchema = z
	.object({
		message_id: z.string(),
		enabled: z.union([z.boolean(), z.number()]).optional(),
		updated_at: z.string().nullable().optional(),
		recording: z.object({ full_url: z.string() }).loose().nullable().optional(),
	})
	.loose();

const PaginationInput = {
	offset: z.number().int().nonnegative().optional(),
	limit: z.number().int().positive().max(1000).optional(),
};

const ManagerKeyInput = { user_id: IdSchema, widget_id: IdSchema };

const ManagerUpsertInputSchema = z.object({
	...ManagerKeyInput,
	enabled: z.boolean(),
	business_times: z.array(BusinessTimeInputSchema).optional(),
});

const SmsUpsertInputSchema = z.object({
	widget_id: IdSchema,
	message_id: z.string().min(1),
	text: z.string().min(1).max(240),
	enabled: z.boolean().optional(),
});

const VoiceUpsertInputSchema = z.object({
	widget_id: IdSchema,
	message_id: z.string().min(1),
	enabled: z.boolean(),
	file: z.string().url().optional(),
});

const ResetInputSchema = z.object({
	widget_id: IdSchema,
	message_id: z.string().min(1).optional(),
});

const NullableIdSchema = z
	.union([z.number(), z.string()])
	.nullable()
	.optional();
const TimestampSchema = z.union([z.string(), z.number()]).nullable().optional();

const CallRecordSchema = z
	.object({
		id: IdSchema,
		status: z.string().optional(),
		tel: z.string().nullable().optional(),
		widget_id: NullableIdSchema,
		user_id: NullableIdSchema,
		created_at: TimestampSchema,
		scheduled_at: TimestampSchema,
	})
	.loose();
const CallHistorySchema = z.array(CallRecordSchema);
const CallRequestResultSchema = z
	.object({
		id: IdSchema.optional(),
		status: z.string().optional(),
	})
	.loose();
const NullResponseSchema = z.null();

export const CallPageEndpointInputSchemas = {
	callsGet: z.object({ callId: IdSchema }),
	callsHistory: z.object({
		display_hidden: z.number().int().optional(),
		call_id: z.array(IdSchema).optional(),
		phone_number: z.string().optional(),
		user_ids: z.array(IdSchema).optional(),
		statuses: z.array(z.string()).optional(),
		tag_ids: z.array(IdSchema).optional(),
		date_from: z.number().int().optional(),
		date_to: z.number().int().optional(),
		widget_ids: z.array(IdSchema).optional(),
		limit: z.number().int().positive().max(1000).optional(),
		offset: z.number().int().nonnegative().optional(),
		url: z.string().optional(),
		incoming_number_ids: z.array(IdSchema).optional(),
		tel: z.string().optional(),
		widget_id: IdSchema.optional(),
	}),
	rootGet: z.object({}),
	usersList: z.object(PaginationInput),
	usersGet: z
		.object({ id: IdSchema.optional(), email: z.string().email().optional() })
		.refine((v) => v.id !== undefined || v.email !== undefined, {
			message: 'Provide either id or email',
		}),
	usersCreate: z.object({
		name: z.string().min(1),
		tel: z.string().min(1),
		email: z.string().email().optional(),
		role: z.enum(['admin', 'manager']).optional(),
	}),
	usersUpdate: z.object({
		id: IdSchema,
		name: z.string().min(1),
		tel: z.string().min(1),
		email: z.string().email().optional(),
		role: z.enum(['admin', 'manager']).optional(),
	}),
	usersDelete: z.object({ id: IdSchema }),
	widgetsList: z.object(PaginationInput),
	widgetsGet: z
		.object({
			id: IdSchema.optional(),
			widget_id: IdSchema.optional(),
			encrypted_id: z.string().optional(),
		})
		.refine(
			(v) =>
				v.id !== undefined ||
				v.widget_id !== undefined ||
				v.encrypted_id !== undefined,
		),
	widgetsCreate: z.object({
		url: z.string().url(),
		description: z.string().optional(),
		settings: WidgetSettingsSchema.optional(),
		locale_code: z.string().optional(),
		enabled: z.boolean().optional(),
	}),
	widgetsUpdate: z.object({
		id: IdSchema,
		url: z.string().url(),
		description: z.string().optional(),
		settings: WidgetSettingsSchema.optional(),
		locale_code: z.string().optional(),
		enabled: z.boolean().optional(),
	}),
	widgetsDelete: z.object({ id: IdSchema }),
	widgetsCall: z
		.object({
			id: IdSchema,
			tel: z.string().min(1),
			department_id: IdSchema.optional(),
			manager_id: IdSchema.optional(),
		})
		.refine(
			(v) => !(v.department_id !== undefined && v.manager_id !== undefined),
		),
	widgetsCallOrSchedule: z.object({
		id: IdSchema,
		tel: z.string().min(1),
		department_id: IdSchema.optional(),
	}),
	widgetsAddUsers: z.object({
		id: IdSchema,
		user_id: z.union([IdSchema, z.array(IdSchema).min(1)]),
		business_times: z
			.union([
				z.array(BusinessTimeInputSchema),
				z.array(z.array(BusinessTimeInputSchema)),
			])
			.optional(),
	}),
	managersList: z.object({ widget_id: IdSchema, ...PaginationInput }),
	managersGet: z.object(ManagerKeyInput),
	managersCreate: ManagerUpsertInputSchema,
	managersUpdate: ManagerUpsertInputSchema,
	managersDelete: z.object(ManagerKeyInput),
	managersStatusStatistics: z.object({ widget_id: IdSchema }),
	smsList: z.object({ widget_id: IdSchema }),
	smsCreate: SmsUpsertInputSchema,
	smsUpdate: SmsUpsertInputSchema,
	smsReset: ResetInputSchema,
	voiceMessagesList: z.object({ widget_id: IdSchema }),
	voiceMessagesCreate: VoiceUpsertInputSchema,
	voiceMessagesUpdate: VoiceUpsertInputSchema,
	voiceMessagesReset: ResetInputSchema,
} as const;

export const CallPageEndpointOutputSchemas = {
	rootGet: z.object({ message: z.string() }).loose(),
	callsGet: CallRecordSchema,
	callsHistory: CallHistorySchema,
	usersList: z.array(UserSchema),
	usersGet: UserSchema,
	usersCreate: UserSchema,
	usersUpdate: UserSchema,
	usersDelete: NullResponseSchema,
	widgetsList: z.array(WidgetSchema),
	widgetsGet: WidgetSchema,
	widgetsCreate: WidgetSchema,
	widgetsUpdate: WidgetSchema,
	widgetsDelete: NullResponseSchema,
	widgetsCall: CallRequestResultSchema,
	widgetsCallOrSchedule: CallRequestResultSchema,
	widgetsAddUsers: z.array(
		z.object({ user_id: IdSchema, manager_id: IdSchema }).loose(),
	),
	managersList: z.array(ManagerSchema),
	managersGet: ManagerSchema,
	managersCreate: IdResponseSchema,
	managersUpdate: IdResponseSchema,
	managersDelete: NullResponseSchema,
	managersStatusStatistics: z.object({
		total: z.number().int(),
		enabled: z.number().int(),
		disabled: z.number().int(),
	}),
	smsList: z.array(SmsMessageSchema),
	smsCreate: IdResponseSchema,
	smsUpdate: IdResponseSchema,
	smsReset: NullResponseSchema,
	voiceMessagesList: z.array(VoiceMessageSchema),
	voiceMessagesCreate: IdResponseSchema,
	voiceMessagesUpdate: IdResponseSchema,
	voiceMessagesReset: NullResponseSchema,
} as const;

export type CallPageEndpointInputs = {
	[K in keyof typeof CallPageEndpointInputSchemas]: z.infer<
		(typeof CallPageEndpointInputSchemas)[K]
	>;
};
export type CallPageEndpointOutputs = {
	[K in keyof typeof CallPageEndpointOutputSchemas]: z.infer<
		(typeof CallPageEndpointOutputSchemas)[K]
	>;
};
