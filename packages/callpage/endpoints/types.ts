import { z } from 'zod';
import {
	CallPageCall,
	CallPageId,
	CallPageManager,
	CallPageSmsMessage,
	CallPageUser,
	CallPageVoiceMessage,
	CallPageWidget,
} from '../schema/database';

// Safe: only the outer object shape is enforced and the values are forwarded to CallPage as given.
// A narrower type is not practical because widget settings are a provider-defined map whose keys change with the configured features.
const WidgetSettingsSchema = z.record(z.string(), z.unknown());

const BusinessTimeInputSchema = z.object({
	day_of_week: z.number().int().min(0).max(6),
	enabled: z.boolean(),
	start_time: z.string().nullable(),
	end_time: z.string().nullable(),
});

const IdResponseSchema = z.object({ id: CallPageId }).loose();

const PaginationInput = {
	offset: z.number().int().nonnegative().optional(),
	limit: z.number().int().positive().max(1000).optional(),
};

const ManagerKeyInput = { user_id: CallPageId, widget_id: CallPageId };

const ManagerUpsertInputSchema = z.object({
	...ManagerKeyInput,
	enabled: z.boolean(),
	business_times: z.array(BusinessTimeInputSchema).optional(),
});

const SmsUpsertInputSchema = z.object({
	widget_id: CallPageId,
	message_id: z.string().min(1),
	text: z.string().min(1).max(240),
	enabled: z.boolean().optional(),
});

const VoiceUpsertInputSchema = z.object({
	widget_id: CallPageId,
	message_id: z.string().min(1),
	enabled: z.boolean(),
	file: z.string().url().optional(),
});

const ResetInputSchema = z.object({
	widget_id: CallPageId,
	message_id: z.string().min(1).optional(),
});

// The API wraps each call as { data: {...} }; accept that and the flat form.
export const CallRecordWireSchema = z.union([
	z
		.object({ data: CallPageCall })
		.loose()
		.transform((v) => v.data),
	CallPageCall,
]);
export const CallHistoryWireSchema = z.array(CallRecordWireSchema);
const CallRequestResultSchema = IdResponseSchema;
const NullResponseSchema = z.null();

export const CallPageEndpointInputSchemas = {
	callsGet: z.object({ callId: CallPageId }),
	callsHistory: z.object({
		display_hidden: z.number().int().optional(),
		call_id: z.array(CallPageId).optional(),
		phone_number: z.string().optional(),
		user_ids: z.array(CallPageId).optional(),
		statuses: z.array(z.string()).optional(),
		tag_ids: z.array(CallPageId).optional(),
		date_from: z.number().int().optional(),
		date_to: z.number().int().optional(),
		widget_ids: z.array(CallPageId).optional(),
		limit: z.number().int().positive().max(1000).optional(),
		offset: z.number().int().nonnegative().optional(),
		url: z.string().optional(),
		incoming_number_ids: z.array(CallPageId).optional(),
		tel: z.string().optional(),
		widget_id: CallPageId.optional(),
	}),
	rootGet: z.object({}),
	usersList: z.object(PaginationInput),
	usersGet: z
		.object({ id: CallPageId.optional(), email: z.string().email().optional() })
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
		id: CallPageId,
		name: z.string().min(1),
		tel: z.string().min(1),
		email: z.string().email().optional(),
		role: z.enum(['admin', 'manager']).optional(),
	}),
	usersDelete: z.object({ id: CallPageId }),
	widgetsList: z.object(PaginationInput),
	widgetsGet: z
		.object({
			id: CallPageId.optional(),
			widget_id: CallPageId.optional(),
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
		id: CallPageId,
		url: z.string().url(),
		description: z.string().optional(),
		settings: WidgetSettingsSchema.optional(),
		locale_code: z.string().optional(),
		enabled: z.boolean().optional(),
	}),
	widgetsDelete: z.object({ id: CallPageId }),
	widgetsCall: z
		.object({
			id: CallPageId,
			tel: z.string().min(1),
			department_id: CallPageId.optional(),
			manager_id: CallPageId.optional(),
		})
		.refine(
			(v) => !(v.department_id !== undefined && v.manager_id !== undefined),
		),
	widgetsCallOrSchedule: z.object({
		id: CallPageId,
		tel: z.string().min(1),
		department_id: CallPageId.optional(),
	}),
	widgetsAddUsers: z.object({
		id: CallPageId,
		user_id: z.union([CallPageId, z.array(CallPageId).min(1)]),
		business_times: z
			.union([
				z.array(BusinessTimeInputSchema),
				z.array(z.array(BusinessTimeInputSchema)),
			])
			.optional(),
	}),
	managersList: z.object({ widget_id: CallPageId, ...PaginationInput }),
	managersGet: z.object(ManagerKeyInput),
	managersCreate: ManagerUpsertInputSchema,
	managersUpdate: ManagerUpsertInputSchema,
	managersDelete: z.object(ManagerKeyInput),
	managersStatusStatistics: z.object({ widget_id: CallPageId }),
	smsList: z.object({ widget_id: CallPageId }),
	smsCreate: SmsUpsertInputSchema,
	smsUpdate: SmsUpsertInputSchema,
	smsReset: ResetInputSchema,
	voiceMessagesList: z.object({ widget_id: CallPageId }),
	voiceMessagesCreate: VoiceUpsertInputSchema,
	voiceMessagesUpdate: VoiceUpsertInputSchema,
	voiceMessagesReset: ResetInputSchema,
} as const;

export const CallPageEndpointOutputSchemas = {
	rootGet: z.object({ message: z.string() }).loose(),
	callsGet: CallPageCall,
	callsHistory: z.array(CallPageCall),
	usersList: z.array(CallPageUser),
	usersGet: CallPageUser,
	usersCreate: IdResponseSchema,
	usersUpdate: IdResponseSchema,
	usersDelete: NullResponseSchema,
	widgetsList: z.array(CallPageWidget),
	widgetsGet: CallPageWidget,
	widgetsCreate: IdResponseSchema,
	widgetsUpdate: IdResponseSchema,
	widgetsDelete: NullResponseSchema,
	widgetsCall: CallRequestResultSchema,
	widgetsCallOrSchedule: CallRequestResultSchema,
	widgetsAddUsers: z.array(
		z.object({ user_id: CallPageId, manager_id: CallPageId }).loose(),
	),
	managersList: z.array(CallPageManager),
	managersGet: CallPageManager,
	managersCreate: IdResponseSchema,
	managersUpdate: IdResponseSchema,
	managersDelete: NullResponseSchema,
	managersStatusStatistics: z.object({
		total: z.number().int(),
		enabled: z.number().int(),
		disabled: z.number().int(),
	}),
	smsList: z.array(CallPageSmsMessage),
	smsCreate: IdResponseSchema,
	smsUpdate: IdResponseSchema,
	smsReset: NullResponseSchema,
	voiceMessagesList: z.array(CallPageVoiceMessage),
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
