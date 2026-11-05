import { logEventFromContext } from 'corsair/core';
import { z } from 'zod';
import { makeRecallaiContextRequest } from '../client';
import type { RecallaiContext } from '../index';
import type { RecallaiJsonValue } from '../json';
import { RecallaiJsonObjectSchema } from '../json';

const uuid = z.string().uuid();
const dateTime = z.string().datetime();

// Recall's meeting recording configuration is a large, extensible contract
// shared with bot creation. Keep its known object envelope while preserving
// provider-specific configuration fields that are not enumerated here.
const opaqueObject = RecallaiJsonObjectSchema;

const PageSchema = <Item extends z.ZodType>(item: Item) =>
	z.object({
		next: z.string().nullable(),
		previous: z.string().nullable(),
		results: z.array(item),
	});

const EmptyInputSchema = z.object({});
const IdInputSchema = z.object({ id: uuid });

export const RetrieveBillingUsageInputSchema = z.object({
	start: dateTime.optional(),
	end: dateTime.optional(),
});
export const RetrieveBillingUsageResponseSchema = z.object({
	bot_total: z.number(),
});

export const ListMeetingDirectConnectsInputSchema = EmptyInputSchema;
export const CreateMeetingDirectConnectInputSchema = z
	.object({
		zoom_rtms: z
			.object({
				meeting_uuid: z.string().min(1),
				rtms_stream_id: z.string().min(1),
				server_urls: z
					.string()
					.regex(
						/^wss:\/\/(?:[a-zA-Z0-9-]+\.)*zoom(?:gov)?\.(?:[a-z]{2,4}(?:\.[a-z]{2})?)(?::\d{1,5})?(?:\/[^\s]*)?$/,
					),
				signature: z.string().min(1),
			})
			.passthrough()
			.nullable()
			.optional(),
		google_meet_media_api: z
			.object({
				space_name: z.string().min(1),
				access_token: z.string().min(1),
			})
			.passthrough()
			.nullable()
			.optional(),
		recording_config: opaqueObject.nullable().optional(),
		metadata: z.record(z.string(), z.string()).optional(),
	})
	.passthrough();

// Response enums below stay open (`.or(z.string())`) so a value Recall adds
// later does not fail a call that succeeded; inputs keep the documented values.
const DirectConnectStatusSchema = z.object({
	code: z
		.enum(['pending', 'connecting', 'processing', 'complete', 'failed'])
		.or(z.string()),
	sub_code: z.string().nullable(),
	updated_at: dateTime,
});
const DirectConnectRecordingSchema = z
	.object({
		id: uuid,
		created_at: dateTime,
		started_at: dateTime.nullable().optional(),
		completed_at: dateTime.nullable().optional(),
		expires_at: dateTime.nullable().optional(),
		status: opaqueObject.nullable(),
		media_shortcuts: opaqueObject.nullable(),
		metadata: z.record(z.string(), z.string()).optional(),
	})
	.passthrough();
export const MeetingDirectConnectResponseSchema = z
	.object({
		id: uuid,
		status: DirectConnectStatusSchema,
		zoom_rtms: opaqueObject.nullable().optional(),
		google_meet_media_api: opaqueObject.nullable().optional(),
		recording_config: opaqueObject.nullable().optional(),
		recordings: z.array(DirectConnectRecordingSchema),
		metadata: z.record(z.string(), z.string()).optional(),
		created_at: dateTime,
	})
	.passthrough();
export const ListMeetingDirectConnectsResponseSchema = z.array(
	MeetingDirectConnectResponseSchema,
);
export const CreateMeetingDirectConnectResponseSchema =
	MeetingDirectConnectResponseSchema;
export const RetrieveMeetingDirectConnectInputSchema = IdInputSchema;
export const RetrieveMeetingDirectConnectResponseSchema =
	MeetingDirectConnectResponseSchema;

export const ListZoomMeetingsToCredentialsInputSchema = z.object({
	credential: uuid.optional(),
	cursor: z.string().optional(),
	meeting_id: z.number().int().safe().optional(),
	ordering: z.string().optional(),
	synced_at_after: dateTime.optional(),
	synced_at_before: dateTime.optional(),
});
const ZoomMeetingToCredentialSchema = z.object({
	meeting_id: z.number().int().safe(),
	credential: uuid,
	synced_at: dateTime,
});
export const ListZoomMeetingsToCredentialsResponseSchema = PageSchema(
	ZoomMeetingToCredentialSchema,
);

const LogListInputSchema = z.object({
	created_at_after: dateTime.optional(),
	created_at_before: dateTime.optional(),
	cursor: z.string().optional(),
	ordering: z.string().optional(),
});
const OAuthAppLogSchema = z.object({
	oauth_app: uuid,
	message: z.string().max(2000),
	created_at: dateTime,
});
export const ListZoomOAuthAppLogsInputSchema = LogListInputSchema.extend({
	oauth_app: uuid.optional(),
});
export const ListZoomOAuthAppLogsResponseSchema = PageSchema(OAuthAppLogSchema);

const OAuthAppKindSchema = z.enum(['user_level', 'account_level']);
const OAuthAppSchema = z
	.object({
		id: uuid,
		kind: OAuthAppKindSchema.or(z.string()),
		client_id: z.string().max(200),
		client_secret: z.string().max(200),
		webhook_secret: z.string().max(200),
		webhook_last_validation: dateTime.nullable(),
		created_at: dateTime,
	})
	.passthrough();
export const ListZoomOAuthAppsInputSchema = z.object({
	client_id: z.string().optional(),
	created_at_after: dateTime.optional(),
	created_at_before: dateTime.optional(),
	cursor: z.string().optional(),
	kind: OAuthAppKindSchema.optional(),
	ordering: z.string().optional(),
	webhook_last_validation_after: dateTime.optional(),
	webhook_last_validation_before: dateTime.optional(),
});
export const ListZoomOAuthAppsResponseSchema = PageSchema(OAuthAppSchema);
export const CreateZoomOAuthAppInputSchema = z.object({
	kind: OAuthAppKindSchema,
	client_id: z.string().min(1).max(200),
	client_secret: z.string().min(1).max(200),
	webhook_secret: z.string().min(1).max(200),
});
export const CreateZoomOAuthAppResponseSchema = OAuthAppSchema;
export const RetrieveZoomOAuthAppInputSchema = IdInputSchema;
export const RetrieveZoomOAuthAppResponseSchema = OAuthAppSchema;
// Recall rejects any other field: "Only webhook_secret and client_secret can
// be updated."
export const UpdateZoomOAuthAppInputSchema = z
	.object({
		id: uuid,
		webhook_secret: z.string().min(1).optional(),
		client_secret: z.string().min(1).optional(),
	})
	.strict()
	.refine(
		({ webhook_secret, client_secret }) =>
			webhook_secret !== undefined || client_secret !== undefined,
		{ message: 'Pass webhook_secret, client_secret or both' },
	);
export const UpdateZoomOAuthAppResponseSchema = OAuthAppSchema;
export const DeleteZoomOAuthAppInputSchema = IdInputSchema;
export const DeleteZoomOAuthAppResponseSchema = z.undefined();

const CredentialLogSchema = z.object({
	credential: uuid,
	message: z.string().max(2000),
	created_at: dateTime,
});
export const ListZoomOAuthCredentialLogsInputSchema = LogListInputSchema.extend(
	{
		credential: uuid.optional(),
	},
);
export const ListZoomOAuthCredentialLogsResponseSchema =
	PageSchema(CredentialLogSchema);

const CredentialStatusSchema = z.enum(['healthy', 'unhealthy']);
const MeetingSyncStatusSchema = z.enum([
	'not_started',
	'in_progress',
	'completed',
	'failed',
]);
const ZoomOAuthCredentialSchema = z
	.object({
		id: uuid,
		oauth_app: uuid,
		status: CredentialStatusSchema.or(z.string()),
		user_id: z.string().nullable(),
		account_id: z.string().nullable(),
		access_token_callback_url: z.string().max(200).nullable(),
		created_at: dateTime,
		meeting_sync_status: MeetingSyncStatusSchema.or(z.string()),
	})
	.passthrough();
export const ListZoomOAuthCredentialsInputSchema = z.object({
	account_id: z.string().optional(),
	created_at_after: dateTime.optional(),
	created_at_before: dateTime.optional(),
	cursor: z.string().optional(),
	meeting_sync_status: MeetingSyncStatusSchema.optional(),
	oauth_app: uuid.optional(),
	ordering: z.string().optional(),
	status: CredentialStatusSchema.optional(),
	user_id: z.string().optional(),
});
export const ListZoomOAuthCredentialsResponseSchema = PageSchema(
	ZoomOAuthCredentialSchema,
);

const AuthorizationCodeSchema = z.object({
	code: z.string().min(1),
	redirect_uri: z.string().url().min(1),
	code_verifier: z.string().min(1).optional(),
});
export const CreateZoomOAuthCredentialInputSchema = z.object({
	oauth_app: uuid,
	authorization_code: AuthorizationCodeSchema.optional(),
	access_token_callback_url: z.string().min(1).max(200).nullable().optional(),
});
export const CreateZoomOAuthCredentialResponseSchema =
	ZoomOAuthCredentialSchema;
export const RetrieveZoomOAuthCredentialInputSchema = IdInputSchema;
export const RetrieveZoomOAuthCredentialResponseSchema =
	ZoomOAuthCredentialSchema;
export const DeleteZoomOAuthCredentialInputSchema = IdInputSchema;
export const DeleteZoomOAuthCredentialResponseSchema = z.undefined();
export const RetrieveZoomOAuthCredentialAccessTokenInputSchema = IdInputSchema;
export const RetrieveZoomOAuthCredentialAccessTokenResponseSchema = z.object({
	token: z.string(),
	expires_at: dateTime,
});
export const SyncZoomOAuthCredentialMeetingsInputSchema = IdInputSchema;
export const SyncZoomOAuthCredentialMeetingsResponseSchema = z.undefined();
export const ValidateZoomOAuthCredentialInputSchema = IdInputSchema;
export const ValidateZoomOAuthCredentialResponseSchema = z.undefined();

export const RecallaiWorkspaceOperationInputSchemas = {
	retrieveBillingUsage: RetrieveBillingUsageInputSchema,
	listMeetingDirectConnects: ListMeetingDirectConnectsInputSchema,
	createMeetingDirectConnect: CreateMeetingDirectConnectInputSchema,
	retrieveMeetingDirectConnect: RetrieveMeetingDirectConnectInputSchema,
	listZoomMeetingsToCredentials: ListZoomMeetingsToCredentialsInputSchema,
	listZoomOAuthAppLogs: ListZoomOAuthAppLogsInputSchema,
	listZoomOAuthApps: ListZoomOAuthAppsInputSchema,
	createZoomOAuthApp: CreateZoomOAuthAppInputSchema,
	retrieveZoomOAuthApp: RetrieveZoomOAuthAppInputSchema,
	updateZoomOAuthApp: UpdateZoomOAuthAppInputSchema,
	deleteZoomOAuthApp: DeleteZoomOAuthAppInputSchema,
	listZoomOAuthCredentialLogs: ListZoomOAuthCredentialLogsInputSchema,
	listZoomOAuthCredentials: ListZoomOAuthCredentialsInputSchema,
	createZoomOAuthCredential: CreateZoomOAuthCredentialInputSchema,
	retrieveZoomOAuthCredential: RetrieveZoomOAuthCredentialInputSchema,
	deleteZoomOAuthCredential: DeleteZoomOAuthCredentialInputSchema,
	retrieveZoomOAuthCredentialAccessToken:
		RetrieveZoomOAuthCredentialAccessTokenInputSchema,
	syncZoomOAuthCredentialMeetings: SyncZoomOAuthCredentialMeetingsInputSchema,
	validateZoomOAuthCredential: ValidateZoomOAuthCredentialInputSchema,
} as const;

export const RecallaiWorkspaceOperationOutputSchemas = {
	retrieveBillingUsage: RetrieveBillingUsageResponseSchema,
	listMeetingDirectConnects: ListMeetingDirectConnectsResponseSchema,
	createMeetingDirectConnect: CreateMeetingDirectConnectResponseSchema,
	retrieveMeetingDirectConnect: RetrieveMeetingDirectConnectResponseSchema,
	listZoomMeetingsToCredentials: ListZoomMeetingsToCredentialsResponseSchema,
	listZoomOAuthAppLogs: ListZoomOAuthAppLogsResponseSchema,
	listZoomOAuthApps: ListZoomOAuthAppsResponseSchema,
	createZoomOAuthApp: CreateZoomOAuthAppResponseSchema,
	retrieveZoomOAuthApp: RetrieveZoomOAuthAppResponseSchema,
	updateZoomOAuthApp: UpdateZoomOAuthAppResponseSchema,
	deleteZoomOAuthApp: DeleteZoomOAuthAppResponseSchema,
	listZoomOAuthCredentialLogs: ListZoomOAuthCredentialLogsResponseSchema,
	listZoomOAuthCredentials: ListZoomOAuthCredentialsResponseSchema,
	createZoomOAuthCredential: CreateZoomOAuthCredentialResponseSchema,
	retrieveZoomOAuthCredential: RetrieveZoomOAuthCredentialResponseSchema,
	deleteZoomOAuthCredential: DeleteZoomOAuthCredentialResponseSchema,
	retrieveZoomOAuthCredentialAccessToken:
		RetrieveZoomOAuthCredentialAccessTokenResponseSchema,
	syncZoomOAuthCredentialMeetings:
		SyncZoomOAuthCredentialMeetingsResponseSchema,
	validateZoomOAuthCredential: ValidateZoomOAuthCredentialResponseSchema,
} as const;

export const RecallaiWorkspaceOperationSchemas = {
	retrieveBillingUsage: {
		input: RetrieveBillingUsageInputSchema,
		output: RetrieveBillingUsageResponseSchema,
	},
	listMeetingDirectConnects: {
		input: ListMeetingDirectConnectsInputSchema,
		output: ListMeetingDirectConnectsResponseSchema,
	},
	createMeetingDirectConnect: {
		input: CreateMeetingDirectConnectInputSchema,
		output: CreateMeetingDirectConnectResponseSchema,
	},
	retrieveMeetingDirectConnect: {
		input: RetrieveMeetingDirectConnectInputSchema,
		output: RetrieveMeetingDirectConnectResponseSchema,
	},
	listZoomMeetingsToCredentials: {
		input: ListZoomMeetingsToCredentialsInputSchema,
		output: ListZoomMeetingsToCredentialsResponseSchema,
	},
	listZoomOAuthAppLogs: {
		input: ListZoomOAuthAppLogsInputSchema,
		output: ListZoomOAuthAppLogsResponseSchema,
	},
	listZoomOAuthApps: {
		input: ListZoomOAuthAppsInputSchema,
		output: ListZoomOAuthAppsResponseSchema,
	},
	createZoomOAuthApp: {
		input: CreateZoomOAuthAppInputSchema,
		output: CreateZoomOAuthAppResponseSchema,
	},
	retrieveZoomOAuthApp: {
		input: RetrieveZoomOAuthAppInputSchema,
		output: RetrieveZoomOAuthAppResponseSchema,
	},
	updateZoomOAuthApp: {
		input: UpdateZoomOAuthAppInputSchema,
		output: UpdateZoomOAuthAppResponseSchema,
	},
	deleteZoomOAuthApp: {
		input: DeleteZoomOAuthAppInputSchema,
		output: DeleteZoomOAuthAppResponseSchema,
	},
	listZoomOAuthCredentialLogs: {
		input: ListZoomOAuthCredentialLogsInputSchema,
		output: ListZoomOAuthCredentialLogsResponseSchema,
	},
	listZoomOAuthCredentials: {
		input: ListZoomOAuthCredentialsInputSchema,
		output: ListZoomOAuthCredentialsResponseSchema,
	},
	createZoomOAuthCredential: {
		input: CreateZoomOAuthCredentialInputSchema,
		output: CreateZoomOAuthCredentialResponseSchema,
	},
	retrieveZoomOAuthCredential: {
		input: RetrieveZoomOAuthCredentialInputSchema,
		output: RetrieveZoomOAuthCredentialResponseSchema,
	},
	deleteZoomOAuthCredential: {
		input: DeleteZoomOAuthCredentialInputSchema,
		output: DeleteZoomOAuthCredentialResponseSchema,
	},
	retrieveZoomOAuthCredentialAccessToken: {
		input: RetrieveZoomOAuthCredentialAccessTokenInputSchema,
		output: RetrieveZoomOAuthCredentialAccessTokenResponseSchema,
	},
	syncZoomOAuthCredentialMeetings: {
		input: SyncZoomOAuthCredentialMeetingsInputSchema,
		output: SyncZoomOAuthCredentialMeetingsResponseSchema,
	},
	validateZoomOAuthCredential: {
		input: ValidateZoomOAuthCredentialInputSchema,
		output: ValidateZoomOAuthCredentialResponseSchema,
	},
} as const;

export type RecallaiWorkspaceOperationInputs = {
	[K in keyof typeof RecallaiWorkspaceOperationInputSchemas]: z.infer<
		(typeof RecallaiWorkspaceOperationInputSchemas)[K]
	>;
};
export type RecallaiWorkspaceOperationOutputs = {
	[K in keyof typeof RecallaiWorkspaceOperationOutputSchemas]: z.infer<
		(typeof RecallaiWorkspaceOperationOutputSchemas)[K]
	>;
};

type RequestOptions = {
	method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
	query?: Record<string, string | number | boolean | undefined>;
	// Endpoint schemas validate provider-defined nested JSON before transport.
	body?: Record<string, unknown>;
};

const requestValidated = async <Output>(
	ctx: RecallaiContext,
	operation: string,
	path: string,
	options: RequestOptions,
	outputSchema: z.ZodType<Output>,
): Promise<Output> => {
	const response = await makeRecallaiContextRequest<RecallaiJsonValue>(
		ctx,
		path,
		options,
	);
	const parsed = outputSchema.parse(response);
	await logEventFromContext(ctx, operation, {}, 'completed');
	return parsed;
};

export const retrieveBillingUsage = async (
	ctx: RecallaiContext,
	input: RecallaiWorkspaceOperationInputs['retrieveBillingUsage'],
) => {
	const parsed = RetrieveBillingUsageInputSchema.parse(input);
	return requestValidated(
		ctx,
		'recallai.billing.usage.retrieve',
		'/api/v1/billing/usage/',
		{ method: 'GET', query: parsed },
		RetrieveBillingUsageResponseSchema,
	);
};

export const listMeetingDirectConnects = async (
	ctx: RecallaiContext,
	input: RecallaiWorkspaceOperationInputs['listMeetingDirectConnects'],
) => {
	ListMeetingDirectConnectsInputSchema.parse(input);
	return requestValidated(
		ctx,
		'recallai.meetingDirectConnect.list',
		'/api/v1/meeting_direct_connect/',
		{ method: 'GET' },
		ListMeetingDirectConnectsResponseSchema,
	);
};

export const createMeetingDirectConnect = async (
	ctx: RecallaiContext,
	input: RecallaiWorkspaceOperationInputs['createMeetingDirectConnect'],
) => {
	const parsed = CreateMeetingDirectConnectInputSchema.parse(input);
	return requestValidated(
		ctx,
		'recallai.meetingDirectConnect.create',
		'/api/v1/meeting_direct_connect/',
		{ method: 'POST', body: parsed },
		CreateMeetingDirectConnectResponseSchema,
	);
};

export const retrieveMeetingDirectConnect = async (
	ctx: RecallaiContext,
	input: RecallaiWorkspaceOperationInputs['retrieveMeetingDirectConnect'],
) => {
	const parsed = RetrieveMeetingDirectConnectInputSchema.parse(input);
	return requestValidated(
		ctx,
		'recallai.meetingDirectConnect.retrieve',
		`/api/v1/meeting_direct_connect/${encodeURIComponent(parsed.id)}/`,
		{ method: 'GET' },
		RetrieveMeetingDirectConnectResponseSchema,
	);
};

export const listZoomMeetingsToCredentials = async (
	ctx: RecallaiContext,
	input: RecallaiWorkspaceOperationInputs['listZoomMeetingsToCredentials'],
) => {
	const parsed = ListZoomMeetingsToCredentialsInputSchema.parse(input);
	return requestValidated(
		ctx,
		'recallai.zoomMeetingsToCredentials.list',
		'/api/v2/zoom-meetings-to-credentials/',
		{ method: 'GET', query: parsed },
		ListZoomMeetingsToCredentialsResponseSchema,
	);
};

export const listZoomOAuthAppLogs = async (
	ctx: RecallaiContext,
	input: RecallaiWorkspaceOperationInputs['listZoomOAuthAppLogs'],
) => {
	const parsed = ListZoomOAuthAppLogsInputSchema.parse(input);
	return requestValidated(
		ctx,
		'recallai.zoomOAuthAppLogs.list',
		'/api/v2/zoom-oauth-app-logs/',
		{ method: 'GET', query: parsed },
		ListZoomOAuthAppLogsResponseSchema,
	);
};

export const listZoomOAuthApps = async (
	ctx: RecallaiContext,
	input: RecallaiWorkspaceOperationInputs['listZoomOAuthApps'],
) => {
	const parsed = ListZoomOAuthAppsInputSchema.parse(input);
	return requestValidated(
		ctx,
		'recallai.zoomOAuthApps.list',
		'/api/v2/zoom-oauth-apps/',
		{ method: 'GET', query: parsed },
		ListZoomOAuthAppsResponseSchema,
	);
};

export const createZoomOAuthApp = async (
	ctx: RecallaiContext,
	input: RecallaiWorkspaceOperationInputs['createZoomOAuthApp'],
) => {
	const parsed = CreateZoomOAuthAppInputSchema.parse(input);
	return requestValidated(
		ctx,
		'recallai.zoomOAuthApps.create',
		'/api/v2/zoom-oauth-apps/',
		{ method: 'POST', body: parsed },
		CreateZoomOAuthAppResponseSchema,
	);
};

export const retrieveZoomOAuthApp = async (
	ctx: RecallaiContext,
	input: RecallaiWorkspaceOperationInputs['retrieveZoomOAuthApp'],
) => {
	const parsed = RetrieveZoomOAuthAppInputSchema.parse(input);
	return requestValidated(
		ctx,
		'recallai.zoomOAuthApps.retrieve',
		`/api/v2/zoom-oauth-apps/${encodeURIComponent(parsed.id)}/`,
		{ method: 'GET' },
		RetrieveZoomOAuthAppResponseSchema,
	);
};

export const updateZoomOAuthApp = async (
	ctx: RecallaiContext,
	input: RecallaiWorkspaceOperationInputs['updateZoomOAuthApp'],
) => {
	const parsed = UpdateZoomOAuthAppInputSchema.parse(input);
	const { id, ...body } = parsed;
	return requestValidated(
		ctx,
		'recallai.zoomOAuthApps.update',
		`/api/v2/zoom-oauth-apps/${encodeURIComponent(id)}/`,
		{ method: 'PATCH', body },
		UpdateZoomOAuthAppResponseSchema,
	);
};

export const deleteZoomOAuthApp = async (
	ctx: RecallaiContext,
	input: RecallaiWorkspaceOperationInputs['deleteZoomOAuthApp'],
) => {
	const parsed = DeleteZoomOAuthAppInputSchema.parse(input);
	return requestValidated(
		ctx,
		'recallai.zoomOAuthApps.delete',
		`/api/v2/zoom-oauth-apps/${encodeURIComponent(parsed.id)}/`,
		{ method: 'DELETE' },
		DeleteZoomOAuthAppResponseSchema,
	);
};

export const listZoomOAuthCredentialLogs = async (
	ctx: RecallaiContext,
	input: RecallaiWorkspaceOperationInputs['listZoomOAuthCredentialLogs'],
) => {
	const parsed = ListZoomOAuthCredentialLogsInputSchema.parse(input);
	return requestValidated(
		ctx,
		'recallai.zoomOAuthCredentialLogs.list',
		'/api/v2/zoom-oauth-credential-logs/',
		{ method: 'GET', query: parsed },
		ListZoomOAuthCredentialLogsResponseSchema,
	);
};

export const listZoomOAuthCredentials = async (
	ctx: RecallaiContext,
	input: RecallaiWorkspaceOperationInputs['listZoomOAuthCredentials'],
) => {
	const parsed = ListZoomOAuthCredentialsInputSchema.parse(input);
	return requestValidated(
		ctx,
		'recallai.zoomOAuthCredentials.list',
		'/api/v2/zoom-oauth-credentials/',
		{ method: 'GET', query: parsed },
		ListZoomOAuthCredentialsResponseSchema,
	);
};

export const createZoomOAuthCredential = async (
	ctx: RecallaiContext,
	input: RecallaiWorkspaceOperationInputs['createZoomOAuthCredential'],
) => {
	const parsed = CreateZoomOAuthCredentialInputSchema.parse(input);
	return requestValidated(
		ctx,
		'recallai.zoomOAuthCredentials.create',
		'/api/v2/zoom-oauth-credentials/',
		{ method: 'POST', body: parsed },
		CreateZoomOAuthCredentialResponseSchema,
	);
};

export const retrieveZoomOAuthCredential = async (
	ctx: RecallaiContext,
	input: RecallaiWorkspaceOperationInputs['retrieveZoomOAuthCredential'],
) => {
	const parsed = RetrieveZoomOAuthCredentialInputSchema.parse(input);
	return requestValidated(
		ctx,
		'recallai.zoomOAuthCredentials.retrieve',
		`/api/v2/zoom-oauth-credentials/${encodeURIComponent(parsed.id)}/`,
		{ method: 'GET' },
		RetrieveZoomOAuthCredentialResponseSchema,
	);
};

export const deleteZoomOAuthCredential = async (
	ctx: RecallaiContext,
	input: RecallaiWorkspaceOperationInputs['deleteZoomOAuthCredential'],
) => {
	const parsed = DeleteZoomOAuthCredentialInputSchema.parse(input);
	return requestValidated(
		ctx,
		'recallai.zoomOAuthCredentials.delete',
		`/api/v2/zoom-oauth-credentials/${encodeURIComponent(parsed.id)}/`,
		{ method: 'DELETE' },
		DeleteZoomOAuthCredentialResponseSchema,
	);
};

export const retrieveZoomOAuthCredentialAccessToken = async (
	ctx: RecallaiContext,
	input: RecallaiWorkspaceOperationInputs['retrieveZoomOAuthCredentialAccessToken'],
) => {
	const parsed = RetrieveZoomOAuthCredentialAccessTokenInputSchema.parse(input);
	return requestValidated(
		ctx,
		'recallai.zoomOAuthCredentials.accessToken.retrieve',
		`/api/v2/zoom-oauth-credentials/${encodeURIComponent(parsed.id)}/access-token/`,
		{ method: 'GET' },
		RetrieveZoomOAuthCredentialAccessTokenResponseSchema,
	);
};

/**
 * For calls Recall answers with an empty 200. The body is ignored, so an
 * empty text response (rather than JSON) cannot fail the call.
 */
const requestWithoutBody = async (
	ctx: RecallaiContext,
	operation: string,
	path: string,
): Promise<undefined> => {
	await makeRecallaiContextRequest<RecallaiJsonValue>(ctx, path, {
		method: 'POST',
	});
	await logEventFromContext(ctx, operation, {}, 'completed');
	return undefined;
};

export const syncZoomOAuthCredentialMeetings = async (
	ctx: RecallaiContext,
	input: RecallaiWorkspaceOperationInputs['syncZoomOAuthCredentialMeetings'],
) => {
	const parsed = SyncZoomOAuthCredentialMeetingsInputSchema.parse(input);
	return requestWithoutBody(
		ctx,
		'recallai.zoomOAuthCredentials.syncMeetings',
		`/api/v2/zoom-oauth-credentials/${encodeURIComponent(parsed.id)}/sync-meetings/`,
	);
};

export const validateZoomOAuthCredential = async (
	ctx: RecallaiContext,
	input: RecallaiWorkspaceOperationInputs['validateZoomOAuthCredential'],
) => {
	const parsed = ValidateZoomOAuthCredentialInputSchema.parse(input);
	return requestWithoutBody(
		ctx,
		'recallai.zoomOAuthCredentials.validate',
		`/api/v2/zoom-oauth-credentials/${encodeURIComponent(parsed.id)}/validate/`,
	);
};
