import { z } from 'zod';

// ── Shared sub-schemas ────────────────────────────────────────────────────────

const TallyBlockSchema = z.object({}).passthrough();

const TallyFormSettingsSchema = z.object({}).passthrough();

const TallyFormSchema = z
	.object({
		id: z.string(),
		name: z.string().optional(),
		status: z.string().optional(),
		workspaceId: z.string().nullable().optional(),
		createdAt: z.string().optional(),
		updatedAt: z.string().optional(),
		blocks: z.array(TallyBlockSchema).optional(),
		settings: TallyFormSettingsSchema.optional(),
	})
	.passthrough();

const TallyQuestionSchema = z
	.object({
		key: z.string(),
		label: z.string().optional(),
		type: z.string().optional(),
	})
	.passthrough();

const TallyFieldResponseSchema = z
	.object({
		key: z.string(),
		label: z.string().optional(),
		type: z.string().optional(),
		value: z.unknown().optional(),
		options: z.array(z.unknown()).optional(),
	})
	.passthrough();

const TallySubmissionSchema = z
	.object({
		id: z.string(),
		respondentId: z.string().nullable().optional(),
		formId: z.string().optional(),
		createdAt: z.string().optional(),
		isCompleted: z.boolean().optional(),
		responses: z.array(TallyFieldResponseSchema).optional(),
	})
	.passthrough();

const TallyUserSchema = z
	.object({
		id: z.string(),
		email: z.string().optional(),
		name: z.string().nullable().optional(),
		subscriptionPlan: z.string().nullable().optional(),
	})
	.passthrough();

const TallyWorkspaceSchema = z
	.object({
		id: z.string(),
		name: z.string().optional(),
		createdAt: z.string().optional(),
		updatedAt: z.string().optional(),
		members: z.array(z.unknown()).optional(),
		invites: z.array(z.unknown()).optional(),
	})
	.passthrough();

const TallyInviteSchema = z
	.object({
		id: z.string(),
		organizationId: z.string().optional(),
		email: z.string().optional(),
		createdAt: z.string().optional(),
		updatedAt: z.string().optional(),
	})
	.passthrough();

const TallyWebhookSchema = z
	.object({
		id: z.string(),
		url: z.string().optional(),
		eventTypes: z.array(z.string()).optional(),
		isEnabled: z.boolean().optional(),
		signingSecret: z.string().nullable().optional(),
		createdAt: z.string().optional(),
	})
	.passthrough();

const TallyWebhookEventSchema = z
	.object({
		id: z.string().optional(),
		eventType: z.string().optional(),
		deliveryStatus: z.string().optional(),
		statusCode: z.number().nullable().optional(),
		response: z.string().nullable().optional(),
		retry: z.number().optional(),
		payload: z.record(z.unknown()).optional(),
		createdAt: z.string().optional(),
		updatedAt: z.string().optional(),
	})
	.passthrough();

const TallyHttpHeaderSchema = z.object({
	name: z.string(),
	value: z.string(),
});

// ── Input Schemas ─────────────────────────────────────────────────────────────

// Forms
const FormsListInputSchema = z.object({
	page: z.number().optional(),
	limit: z.number().optional(),
	workspaceIds: z.array(z.string()).optional(),
});

const FormsCreateInputSchema = z.object({
	workspaceId: z.string().optional(),
	templateId: z.string().optional(),
	status: z.string(),
	blocks: z.array(TallyBlockSchema),
	settings: TallyFormSettingsSchema.optional(),
});

const FormsGetInputSchema = z.object({
	formId: z.string(),
});

const FormsUpdateInputSchema = z.object({
	formId: z.string(),
	name: z.string().optional(),
	status: z.string().optional(),
	blocks: z.array(TallyBlockSchema).optional(),
	settings: TallyFormSettingsSchema.optional(),
});

const FormsDeleteInputSchema = z.object({
	formId: z.string(),
});

// Questions
const QuestionsListInputSchema = z.object({
	formId: z.string(),
});

// Submissions
const SubmissionsListInputSchema = z.object({
	formId: z.string(),
	page: z.number().optional(),
	limit: z.number().optional(),
	filter: z.enum(['all', 'completed', 'partial']).optional(),
	startDate: z.string().optional(),
	endDate: z.string().optional(),
	afterId: z.string().optional(),
});

const SubmissionsGetInputSchema = z.object({
	formId: z.string(),
	submissionId: z.string(),
});

const SubmissionsDeleteInputSchema = z.object({
	formId: z.string(),
	submissionId: z.string(),
});

// Users
const UsersGetMeInputSchema = z.object({});

// Organizations
const OrganizationsListUsersInputSchema = z.object({
	organizationId: z.string(),
});

const OrganizationsRemoveUserInputSchema = z.object({
	organizationId: z.string(),
	userId: z.string(),
});

const OrganizationsListInvitesInputSchema = z.object({
	organizationId: z.string(),
});

const OrganizationsCreateInviteInputSchema = z.object({
	organizationId: z.string(),
	workspaceIds: z.array(z.string()),
	emails: z.string(),
});

const OrganizationsCancelInviteInputSchema = z.object({
	organizationId: z.string(),
	inviteId: z.string(),
});

// Workspaces
const WorkspacesListInputSchema = z.object({
	page: z.number().optional(),
});

const WorkspacesCreateInputSchema = z.object({
	name: z.string(),
});

const WorkspacesGetInputSchema = z.object({
	workspaceId: z.string(),
});

const WorkspacesUpdateInputSchema = z.object({
	workspaceId: z.string(),
	name: z.string(),
});

const WorkspacesDeleteInputSchema = z.object({
	workspaceId: z.string(),
});

// Webhook Management
const WebhookManagementListInputSchema = z.object({
	page: z.number().optional(),
	limit: z.number().optional(),
});

const WebhookManagementCreateInputSchema = z.object({
	formId: z.string(),
	url: z.string(),
	eventTypes: z.array(z.string()),
	signingSecret: z.string().optional(),
	httpHeaders: z.array(TallyHttpHeaderSchema).optional(),
	externalSubscriber: z.string().optional(),
});

const WebhookManagementUpdateInputSchema = z.object({
	webhookId: z.string(),
	formId: z.string(),
	url: z.string(),
	eventTypes: z.array(z.string()),
	isEnabled: z.boolean(),
	signingSecret: z.string().optional(),
	httpHeaders: z.array(TallyHttpHeaderSchema).optional(),
});

const WebhookManagementDeleteInputSchema = z.object({
	webhookId: z.string(),
});

const WebhookManagementListEventsInputSchema = z.object({
	webhookId: z.string(),
	page: z.number().optional(),
});

const WebhookManagementRetryEventInputSchema = z.object({
	webhookId: z.string(),
	eventId: z.string(),
});

// ── Output Schemas ────────────────────────────────────────────────────────────

const FormsListResponseSchema = z
	.object({
		items: z.array(TallyFormSchema),
		page: z.number().optional(),
		limit: z.number().optional(),
		total: z.number().optional(),
		hasMore: z.boolean().optional(),
	})
	.passthrough();

const FormsCreateResponseSchema = TallyFormSchema;
const FormsGetResponseSchema = TallyFormSchema;
const FormsUpdateResponseSchema = TallyFormSchema;
const FormsDeleteResponseSchema = z.void();

const QuestionsListResponseSchema = z
	.object({
		questions: z.array(TallyQuestionSchema),
		hasResponses: z.boolean().optional(),
	})
	.passthrough();

const SubmissionsListResponseSchema = z
	.object({
		page: z.number().optional(),
		limit: z.number().optional(),
		hasMore: z.boolean().optional(),
		totalNumberOfSubmissionsPerFilter: z.record(z.number()).optional(),
		questions: z.array(TallyQuestionSchema).optional(),
		submissions: z.array(TallySubmissionSchema),
	})
	.passthrough();

const SubmissionsGetResponseSchema = z
	.object({
		questions: z.array(TallyQuestionSchema).optional(),
		submission: TallySubmissionSchema,
	})
	.passthrough();

const SubmissionsDeleteResponseSchema = z.void();

const UsersGetMeResponseSchema = TallyUserSchema;

const OrganizationsListUsersResponseSchema = z.array(TallyUserSchema);
const OrganizationsRemoveUserResponseSchema = z.void();
const OrganizationsListInvitesResponseSchema = z.array(TallyInviteSchema);
const OrganizationsCreateInviteResponseSchema = z.void();
const OrganizationsCancelInviteResponseSchema = z.void();

const WorkspacesListResponseSchema = z
	.object({
		items: z.array(TallyWorkspaceSchema),
		page: z.number().optional(),
		limit: z.number().optional(),
		total: z.number().optional(),
		hasMore: z.boolean().optional(),
	})
	.passthrough();

const WorkspacesCreateResponseSchema = TallyWorkspaceSchema;
const WorkspacesGetResponseSchema = TallyWorkspaceSchema;
const WorkspacesUpdateResponseSchema = z.void();
const WorkspacesDeleteResponseSchema = z.void();

const WebhookManagementListResponseSchema = z
	.object({
		webhooks: z.array(TallyWebhookSchema),
		page: z.number().optional(),
		limit: z.number().optional(),
		hasMore: z.boolean().optional(),
		totalCount: z.number().optional(),
	})
	.passthrough();

const WebhookManagementCreateResponseSchema = TallyWebhookSchema;
const WebhookManagementUpdateResponseSchema = z.void();
const WebhookManagementDeleteResponseSchema = z.void();

const WebhookManagementListEventsResponseSchema = z
	.object({
		events: z.array(TallyWebhookEventSchema),
		page: z.number().optional(),
		limit: z.number().optional(),
		hasMore: z.boolean().optional(),
		totalNumberOfEvents: z.number().optional(),
	})
	.passthrough();

const WebhookManagementRetryEventResponseSchema = z.void();

// ── Endpoint I/O Maps ─────────────────────────────────────────────────────────

export const TallyEndpointInputSchemas = {
	formsList: FormsListInputSchema,
	formsCreate: FormsCreateInputSchema,
	formsGet: FormsGetInputSchema,
	formsUpdate: FormsUpdateInputSchema,
	formsDelete: FormsDeleteInputSchema,
	questionsList: QuestionsListInputSchema,
	submissionsList: SubmissionsListInputSchema,
	submissionsGet: SubmissionsGetInputSchema,
	submissionsDelete: SubmissionsDeleteInputSchema,
	usersGetMe: UsersGetMeInputSchema,
	organizationsListUsers: OrganizationsListUsersInputSchema,
	organizationsRemoveUser: OrganizationsRemoveUserInputSchema,
	organizationsListInvites: OrganizationsListInvitesInputSchema,
	organizationsCreateInvite: OrganizationsCreateInviteInputSchema,
	organizationsCancelInvite: OrganizationsCancelInviteInputSchema,
	workspacesList: WorkspacesListInputSchema,
	workspacesCreate: WorkspacesCreateInputSchema,
	workspacesGet: WorkspacesGetInputSchema,
	workspacesUpdate: WorkspacesUpdateInputSchema,
	workspacesDelete: WorkspacesDeleteInputSchema,
	webhookManagementList: WebhookManagementListInputSchema,
	webhookManagementCreate: WebhookManagementCreateInputSchema,
	webhookManagementUpdate: WebhookManagementUpdateInputSchema,
	webhookManagementDelete: WebhookManagementDeleteInputSchema,
	webhookManagementListEvents: WebhookManagementListEventsInputSchema,
	webhookManagementRetryEvent: WebhookManagementRetryEventInputSchema,
} as const;

export type TallyEndpointInputs = {
	[K in keyof typeof TallyEndpointInputSchemas]: z.infer<
		(typeof TallyEndpointInputSchemas)[K]
	>;
};

export const TallyEndpointOutputSchemas = {
	formsList: FormsListResponseSchema,
	formsCreate: FormsCreateResponseSchema,
	formsGet: FormsGetResponseSchema,
	formsUpdate: FormsUpdateResponseSchema,
	formsDelete: FormsDeleteResponseSchema,
	questionsList: QuestionsListResponseSchema,
	submissionsList: SubmissionsListResponseSchema,
	submissionsGet: SubmissionsGetResponseSchema,
	submissionsDelete: SubmissionsDeleteResponseSchema,
	usersGetMe: UsersGetMeResponseSchema,
	organizationsListUsers: OrganizationsListUsersResponseSchema,
	organizationsRemoveUser: OrganizationsRemoveUserResponseSchema,
	organizationsListInvites: OrganizationsListInvitesResponseSchema,
	organizationsCreateInvite: OrganizationsCreateInviteResponseSchema,
	organizationsCancelInvite: OrganizationsCancelInviteResponseSchema,
	workspacesList: WorkspacesListResponseSchema,
	workspacesCreate: WorkspacesCreateResponseSchema,
	workspacesGet: WorkspacesGetResponseSchema,
	workspacesUpdate: WorkspacesUpdateResponseSchema,
	workspacesDelete: WorkspacesDeleteResponseSchema,
	webhookManagementList: WebhookManagementListResponseSchema,
	webhookManagementCreate: WebhookManagementCreateResponseSchema,
	webhookManagementUpdate: WebhookManagementUpdateResponseSchema,
	webhookManagementDelete: WebhookManagementDeleteResponseSchema,
	webhookManagementListEvents: WebhookManagementListEventsResponseSchema,
	webhookManagementRetryEvent: WebhookManagementRetryEventResponseSchema,
} as const;

export type TallyEndpointOutputs = {
	[K in keyof typeof TallyEndpointOutputSchemas]: z.infer<
		(typeof TallyEndpointOutputSchemas)[K]
	>;
};

// ── Individual Input type aliases ─────────────────────────────────────────────

export type FormsListInput = TallyEndpointInputs['formsList'];
export type FormsCreateInput = TallyEndpointInputs['formsCreate'];
export type FormsGetInput = TallyEndpointInputs['formsGet'];
export type FormsUpdateInput = TallyEndpointInputs['formsUpdate'];
export type FormsDeleteInput = TallyEndpointInputs['formsDelete'];
export type QuestionsListInput = TallyEndpointInputs['questionsList'];
export type SubmissionsListInput = TallyEndpointInputs['submissionsList'];
export type SubmissionsGetInput = TallyEndpointInputs['submissionsGet'];
export type SubmissionsDeleteInput = TallyEndpointInputs['submissionsDelete'];
export type UsersGetMeInput = TallyEndpointInputs['usersGetMe'];
export type OrganizationsListUsersInput =
	TallyEndpointInputs['organizationsListUsers'];
export type OrganizationsRemoveUserInput =
	TallyEndpointInputs['organizationsRemoveUser'];
export type OrganizationsListInvitesInput =
	TallyEndpointInputs['organizationsListInvites'];
export type OrganizationsCreateInviteInput =
	TallyEndpointInputs['organizationsCreateInvite'];
export type OrganizationsCancelInviteInput =
	TallyEndpointInputs['organizationsCancelInvite'];
export type WorkspacesListInput = TallyEndpointInputs['workspacesList'];
export type WorkspacesCreateInput = TallyEndpointInputs['workspacesCreate'];
export type WorkspacesGetInput = TallyEndpointInputs['workspacesGet'];
export type WorkspacesUpdateInput = TallyEndpointInputs['workspacesUpdate'];
export type WorkspacesDeleteInput = TallyEndpointInputs['workspacesDelete'];
export type WebhookManagementListInput =
	TallyEndpointInputs['webhookManagementList'];
export type WebhookManagementCreateInput =
	TallyEndpointInputs['webhookManagementCreate'];
export type WebhookManagementUpdateInput =
	TallyEndpointInputs['webhookManagementUpdate'];
export type WebhookManagementDeleteInput =
	TallyEndpointInputs['webhookManagementDelete'];
export type WebhookManagementListEventsInput =
	TallyEndpointInputs['webhookManagementListEvents'];
export type WebhookManagementRetryEventInput =
	TallyEndpointInputs['webhookManagementRetryEvent'];

// ── Individual Response type aliases ──────────────────────────────────────────

export type FormsListResponse = TallyEndpointOutputs['formsList'];
export type FormsCreateResponse = TallyEndpointOutputs['formsCreate'];
export type FormsGetResponse = TallyEndpointOutputs['formsGet'];
export type FormsUpdateResponse = TallyEndpointOutputs['formsUpdate'];
export type FormsDeleteResponse = TallyEndpointOutputs['formsDelete'];
export type QuestionsListResponse = TallyEndpointOutputs['questionsList'];
export type SubmissionsListResponse = TallyEndpointOutputs['submissionsList'];
export type SubmissionsGetResponse = TallyEndpointOutputs['submissionsGet'];
export type SubmissionsDeleteResponse =
	TallyEndpointOutputs['submissionsDelete'];
export type UsersGetMeResponse = TallyEndpointOutputs['usersGetMe'];
export type OrganizationsListUsersResponse =
	TallyEndpointOutputs['organizationsListUsers'];
export type OrganizationsRemoveUserResponse =
	TallyEndpointOutputs['organizationsRemoveUser'];
export type OrganizationsListInvitesResponse =
	TallyEndpointOutputs['organizationsListInvites'];
export type OrganizationsCreateInviteResponse =
	TallyEndpointOutputs['organizationsCreateInvite'];
export type OrganizationsCancelInviteResponse =
	TallyEndpointOutputs['organizationsCancelInvite'];
export type WorkspacesListResponse = TallyEndpointOutputs['workspacesList'];
export type WorkspacesCreateResponse = TallyEndpointOutputs['workspacesCreate'];
export type WorkspacesGetResponse = TallyEndpointOutputs['workspacesGet'];
export type WorkspacesUpdateResponse = TallyEndpointOutputs['workspacesUpdate'];
export type WorkspacesDeleteResponse = TallyEndpointOutputs['workspacesDelete'];
export type WebhookManagementListResponse =
	TallyEndpointOutputs['webhookManagementList'];
export type WebhookManagementCreateResponse =
	TallyEndpointOutputs['webhookManagementCreate'];
export type WebhookManagementUpdateResponse =
	TallyEndpointOutputs['webhookManagementUpdate'];
export type WebhookManagementDeleteResponse =
	TallyEndpointOutputs['webhookManagementDelete'];
export type WebhookManagementListEventsResponse =
	TallyEndpointOutputs['webhookManagementListEvents'];
export type WebhookManagementRetryEventResponse =
	TallyEndpointOutputs['webhookManagementRetryEvent'];
