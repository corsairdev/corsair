import { z } from 'zod';

// Messages (Core)
export const MessagesListInputSchema = z.object({
	data: z.array(z.record(z.string(), z.unknown())).optional(),
	hasNext: z.boolean().optional(),
	hasPrevious: z.boolean().optional(),
	next: z.string().optional(),
	previous: z.string().optional(),
});

export type MessagesListInput = z.infer<typeof MessagesListInputSchema>;

export const MessagesListOutputSchema = z.object({
	data: z.array(z.record(z.string(), z.unknown())).optional(),
	hasNext: z.boolean().optional(),
	hasPrevious: z.boolean().optional(),
	next: z.string().optional(),
	previous: z.string().optional(),
});

export type MessagesListOutput = z.infer<typeof MessagesListOutputSchema>;

export const MessagesCreateInputSchema = z.object({
	to: z.array(z.string()).optional(),
	from: z.string().optional(),
	subject: z.string().optional(),
	body: z.string().optional(),
});

export type MessagesCreateInput = z.infer<typeof MessagesCreateInputSchema>;

export const MessagesCreateOutputSchema = z.object({
	id: z.string().optional(),
});

export type MessagesCreateOutput = z.infer<typeof MessagesCreateOutputSchema>;

export const MessagesGetInputSchema = z.object({
	id: z.string(),
});

export type MessagesGetInput = z.infer<typeof MessagesGetInputSchema>;

export const MessagesGetOutputSchema = z.record(z.string(), z.unknown());

export type MessagesGetOutput = z.infer<typeof MessagesGetOutputSchema>;

export const MessagesUpdateInputSchema = z.object({
	id: z.string(),
	to: z.array(z.string()).optional(),
	from: z.string().optional(),
	subject: z.string().optional(),
	body: z.string().optional(),
});

export type MessagesUpdateInput = z.infer<typeof MessagesUpdateInputSchema>;

export const MessagesUpdateOutputSchema = z.record(z.string(), z.unknown());

export type MessagesUpdateOutput = z.infer<typeof MessagesUpdateOutputSchema>;

export const MessagesSendInputSchema = z.object({
	id: z.string(),
	to: z.array(z.string()).optional(),
	from: z.string().optional(),
	subject: z.string().optional(),
	body: z.string().optional(),
});

export type MessagesSendInput = z.infer<typeof MessagesSendInputSchema>;

export const MessagesSendOutputSchema = z.record(z.string(), z.unknown());

export type MessagesSendOutput = z.infer<typeof MessagesSendOutputSchema>;

export const MessagesScheduleInputSchema = z.object({
	id: z.string(),
	sendAt: z.string().optional(),
});

export type MessagesScheduleInput = z.infer<typeof MessagesScheduleInputSchema>;

export const MessagesScheduleOutputSchema = z.record(z.string(), z.unknown());

export type MessagesScheduleOutput = z.infer<typeof MessagesScheduleOutputSchema>;

export const MessagesUnscheduleInputSchema = z.object({
	id: z.string(),
});

export type MessagesUnscheduleInput = z.infer<typeof MessagesUnscheduleInputSchema>;

export const MessagesUnscheduleOutputSchema = z.record(z.string(), z.unknown());

export type MessagesUnscheduleOutput = z.infer<typeof MessagesUnscheduleOutputSchema>;

export const MessagesTestInputSchema = z.object({
	id: z.string(),
});

export type MessagesTestInput = z.infer<typeof MessagesTestInputSchema>;

export const MessagesTestOutputSchema = z.record(z.string(), z.unknown());

export type MessagesTestOutput = z.infer<typeof MessagesTestOutputSchema>;

export const MessagesSendPlainInputSchema = z.object({
	to: z.array(z.string()).optional(),
	from: z.string().optional(),
	subject: z.string().optional(),
	body: z.string().optional(),
});

export type MessagesSendPlainInput = z.infer<typeof MessagesSendPlainInputSchema>;

export const MessagesSendPlainOutputSchema = z.record(z.string(), z.unknown());

export type MessagesSendPlainOutput = z.infer<typeof MessagesSendPlainOutputSchema>;export const EnvVarsListInputSchema = z.object({
	cursor: z.string().optional(),
	limit: z.coerce.number().int().min(1).max(300).optional(),
});

export type EnvVarsListInput = z.infer<typeof EnvVarsListInputSchema>;

export const EnvVarsListOutputSchema = z.object({
	items: z.array(z.record(z.string(), z.unknown())).optional(),
	nextCursor: z.string().optional(),
});

export type EnvVarsListOutput = z.infer<typeof EnvVarsListOutputSchema>;

export const EnvVarsRetrieveInputSchema = z.object({
	name: z.string(),
});

export type EnvVarsRetrieveInput = z.infer<typeof EnvVarsRetrieveInputSchema>;

export const EnvVarsRetrieveOutputSchema = z.record(z.string(), z.unknown());

export type EnvVarsRetrieveOutput = z.infer<typeof EnvVarsRetrieveOutputSchema>;

export const EnvVarsUpsertInputSchema = z.object({
	name: z.string(),
	value: z.string(),
});

export type EnvVarsUpsertInput = z.infer<typeof EnvVarsUpsertInputSchema>;

export const EnvVarsUpsertOutputSchema = z.record(z.string(), z.unknown());

export type EnvVarsUpsertOutput = z.infer<typeof EnvVarsUpsertOutputSchema>;

export const EnvVarsDeleteInputSchema = z.object({
	name: z.string(),
});

export type EnvVarsDeleteInput = z.infer<typeof EnvVarsDeleteInputSchema>;

export const EnvVarsDeleteOutputSchema = z.record(z.string(), z.unknown());

export type EnvVarsDeleteOutput = z.infer<typeof EnvVarsDeleteOutputSchema>;

export const HeadersListInputSchema = z.object({
	cursor: z.string().optional(),
	limit: z.coerce.number().int().min(1).max(300).optional(),
});

export type HeadersListInput = z.infer<typeof HeadersListInputSchema>;

export const HeadersListOutputSchema = z.object({
	items: z.array(z.record(z.string(), z.unknown())).optional(),
	nextCursor: z.string().optional(),
});

export type HeadersListOutput = z.infer<typeof HeadersListOutputSchema>;

export const HeadersAddInputSchema = z.object({
	name: z.string(),
	value: z.string(),
});

export type HeadersAddInput = z.infer<typeof HeadersAddInputSchema>;

export const HeadersAddOutputSchema = z.record(z.string(), z.unknown());

export type HeadersAddOutput = z.infer<typeof HeadersAddOutputSchema>;

export const HeadersUpdateInputSchema = z.object({
	id: z.string(),
	name: z.string(),
	value: z.string(),
});

export type HeadersUpdateInput = z.infer<typeof HeadersUpdateInputSchema>;

export const HeadersUpdateOutputSchema = z.record(z.string(), z.unknown());

export type HeadersUpdateOutput = z.infer<typeof HeadersUpdateOutputSchema>;

export const HeadersDeleteInputSchema = z.object({
	id: z.string(),
});

export type HeadersDeleteInput = z.infer<typeof HeadersDeleteInputSchema>;

export const HeadersDeleteOutputSchema = z.record(z.string(), z.unknown());

export type HeadersDeleteOutput = z.infer<typeof HeadersDeleteOutputSchema>;export const CustomDomainsListInputSchema = z.object({
	cursor: z.string().optional(),
	limit: z.coerce.number().int().min(1).max(300).optional(),
});

export type CustomDomainsListInput = z.infer<typeof CustomDomainsListInputSchema>;

export const CustomDomainsListOutputSchema = z.object({
	items: z.array(z.record(z.string(), z.unknown())).optional(),
	nextCursor: z.string().optional(),
});

export type CustomDomainsListOutput = z.infer<typeof CustomDomainsListOutputSchema>;

export const CustomDomainsCreateInputSchema = z.object({
	tld: z.string(),
});

export type CustomDomainsCreateInput = z.infer<typeof CustomDomainsCreateInputSchema>;

export const CustomDomainsCreateOutputSchema = z.record(z.string(), z.unknown());

export type CustomDomainsCreateOutput = z.infer<typeof CustomDomainsCreateOutputSchema>;

export const CustomDomainsRetrieveInputSchema = z.object({
	id: z.string(),
});

export type CustomDomainsRetrieveInput = z.infer<typeof CustomDomainsRetrieveInputSchema>;

export const CustomDomainsRetrieveOutputSchema = z.record(z.string(), z.unknown());

export type CustomDomainsRetrieveOutput = z.infer<typeof CustomDomainsRetrieveOutputSchema>;

export const CustomDomainsVerifyInputSchema = z.object({
	id: z.string(),
	verificationCode: z.string(),
});

export type CustomDomainsVerifyInput = z.infer<typeof CustomDomainsVerifyInputSchema>;

export const CustomDomainsVerifyOutputSchema = z.record(z.string(), z.unknown());

export type CustomDomainsVerifyOutput = z.infer<typeof CustomDomainsVerifyOutputSchema>;

export const CustomDomainsDeleteInputSchema = z.object({
	id: z.string(),
});

export type CustomDomainsDeleteInput = z.infer<typeof CustomDomainsDeleteInputSchema>;

export const CustomDomainsDeleteOutputSchema = z.record(z.string(), z.unknown());

export type CustomDomainsDeleteOutput = z.infer<typeof CustomDomainsDeleteOutputSchema>;

export const SecretFilesListInputSchema = z.object({
	cursor: z.string().optional(),
	limit: z.coerce.number().int().min(1).max(300).optional(),
});

export type SecretFilesListInput = z.infer<typeof SecretFilesListInputSchema>;

export const SecretFilesListOutputSchema = z.object({
	items: z.array(z.record(z.string(), z.unknown())).optional(),
	nextCursor: z.string().optional(),
});

export type SecretFilesListOutput = z.infer<typeof SecretFilesListOutputSchema>;

export const SecretFilesRetrieveInputSchema = z.object({
	name: z.string(),
});

export type SecretFilesRetrieveInput = z.infer<typeof SecretFilesRetrieveInputSchema>;

export const SecretFilesRetrieveOutputSchema = z.record(z.string(), z.unknown());

export type SecretFilesRetrieveOutput = z.infer<typeof SecretFilesRetrieveOutputSchema>;

export const SecretFilesUpsertInputSchema = z.object({
	name: z.string(),
	content: z.string(),
});

export type SecretFilesUpsertInput = z.infer<typeof SecretFilesUpsertInputSchema>;

export const SecretFilesUpsertOutputSchema = z.record(z.string(), z.unknown());

export type SecretFilesUpsertOutput = z.infer<typeof SecretFilesUpsertOutputSchema>;

export const SecretFilesDeleteInputSchema = z.object({
	name: z.string(),
});

export type SecretFilesDeleteInput = z.infer<typeof SecretFilesDeleteInputSchema>;

export const SecretFilesDeleteOutputSchema = z.record(z.string(), z.unknown());

export type SecretFilesDeleteOutput = z.infer<typeof SecretFilesDeleteOutputSchema>;export const SequencesListInputSchema = z.object({
	name: z.string().optional(),
	folder: z.string().optional(),
	expand: z.string().optional(),
	fields: z.string().optional(),
	limit: z.coerce.number().int().min(1).max(100).default(100).optional(),
	next: z.string().optional(),
	previous: z.string().optional(),
});

export type SequencesListInput = z.infer<typeof SequencesListInputSchema>;

export const SequencesListOutputSchema = z.object({
	sequences: z.array(z.record(z.string(), z.unknown())).optional(),
	hasNext: z.boolean().optional(),
	hasPrevious: z.boolean().optional(),
	next: z.string().optional(),
	previous: z.string().optional(),
});

export type SequencesListOutput = z.infer<typeof SequencesListOutputSchema>;

export const SequencesGetRecipientsInputSchema = z.object({
	id: z.string(),
});

export type SequencesGetRecipientsInput = z.infer<typeof SequencesGetRecipientsInputSchema>;

export const SequencesGetRecipientsOutputSchema = z.array(z.record(z.string(), z.unknown())).optional();

export type SequencesGetRecipientsOutput = z.infer<typeof SequencesGetRecipientsOutputSchema>;

export const SequencesAddRecipientsInputSchema = z.object({
	id: z.string(),
	recipients: z.array(
		z.object({
			email: z.string().email(),
			name: z.string().optional(),
		}),
	),
});

export type SequencesAddRecipientsInput = z.infer<typeof SequencesAddRecipientsInputSchema>;

export const SequencesAddRecipientsOutputSchema = z.array(z.record(z.string(), z.unknown())).optional();

export type SequencesAddRecipientsOutput = z.infer<typeof SequencesAddRecipientsOutputSchema>;

export const SequencesGetInputSchema = z.object({
	id: z.string(),
});

export type SequencesGetInput = z.infer<typeof SequencesGetInputSchema>;

export const SequencesGetOutputSchema = z.record(z.string(), z.unknown());

export type SequencesGetOutput = z.infer<typeof SequencesGetOutputSchema>;

export const SequencesCreateInputSchema = z.object({
	name: z.string(),
	folder: z.string().optional(),
	expand: z.string().optional(),
	fields: z.string().optional(),
	limit: z.coerce.number().int().min(1).max(100).default(100).optional(),
	next: z.string().optional(),
	previous: z.string().optional(),
});

export type SequencesCreateInput = z.infer<typeof SequencesCreateInputSchema>;

export const SequencesCreateOutputSchema = z.record(z.string(), z.unknown());

export type SequencesCreateOutput = z.infer<typeof SequencesCreateOutputSchema>;

export const SequencesUpdateInputSchema = z.object({
	id: z.string(),
	name: z.string().optional(),
	folder: z.string().optional(),
	expand: z.string().optional(),
	fields: z.string().optional(),
	limit: z.coerce.number().int().min(1).max(100).optional(),
});

export type SequencesUpdateInput = z.infer<typeof SequencesUpdateInputSchema>;

export const SequencesUpdateOutputSchema = z.record(z.string(), z.unknown());

export type SequencesUpdateOutput = z.infer<typeof SequencesUpdateOutputSchema>;

export const SequencesDeleteInputSchema = z.object({
	id: z.string(),
});

export type SequencesDeleteInput = z.infer<typeof SequencesDeleteInputSchema>;

export const SequencesDeleteOutputSchema = z.record(z.string(), z.unknown());

export type SequencesDeleteOutput = z.infer<typeof SequencesDeleteOutputSchema>;

export const SequencesPauseInputSchema = z.object({
	id: z.string(),
});

export type SequencesPauseInput = z.infer<typeof SequencesPauseInputSchema>;

export const SequencesPauseOutputSchema = z.record(z.string(), z.unknown());

export type SequencesPauseOutput = z.infer<typeof SequencesPauseOutputSchema>;

export const SequencesResumeInputSchema = z.object({
	id: z.string(),
});

export type SequencesResumeInput = z.infer<typeof SequencesResumeInputSchema>;

export const SequencesResumeOutputSchema = z.record(z.string(), z.unknown());

export type SequencesResumeOutput = z.infer<typeof SequencesResumeOutputSchema>;export const SnippetsListInputSchema = z.object({
	search: z.string().optional(),
	isInline: z.coerce.boolean().optional(),
	deletedOnly: z.coerce.boolean().optional(),
	archivedOnly: z.coerce.boolean().optional(),
	sort: z.string().optional(),
	sortAscending: z.coerce.boolean().optional(),
	expand: z.string().optional(),
	limit: z.coerce.number().int().min(1).optional(),
	next: z.string().optional(),
	previous: z.string().optional(),
});

export type SnippetsListInput = z.infer<typeof SnippetsListInputSchema>;

export const SnippetsListOutputSchema = z.object({
	snippets: z.array(z.record(z.string(), z.unknown())).optional(),
	hasNext: z.boolean().optional(),
	hasPrevious: z.boolean().optional(),
	next: z.string().optional(),
	previous: z.string().optional(),
});

export type SnippetsListOutput = z.infer<typeof SnippetsListOutputSchema>;

export const SnippetsGetInputSchema = z.object({
	id: z.string(),
});

export type SnippetsGetInput = z.infer<typeof SnippetsGetInputSchema>;

export const SnippetsGetOutputSchema = z.record(z.string(), z.unknown());

export type SnippetsGetOutput = z.infer<typeof SnippetsGetOutputSchema>;

export const SnippetsCreateInputSchema = z.object({
	name: z.string(),
	content: z.string(),
});

export type SnippetsCreateInput = z.infer<typeof SnippetsCreateInputSchema>;

export const SnippetsCreateOutputSchema = z.object({
	id: z.string().optional(),
});

export type SnippetsCreateOutput = z.infer<typeof SnippetsCreateOutputSchema>;

export const SnippetsUpdateInputSchema = z.object({
	id: z.string(),
	name: z.string(),
	content: z.string(),
});

export type SnippetsUpdateInput = z.infer<typeof SnippetsUpdateInputSchema>;

export const SnippetsUpdateOutputSchema = z.object({
	id: z.string().optional(),
});

export type SnippetsUpdateOutput = z.infer<typeof SnippetsUpdateOutputSchema>;

export const SnippetsDeleteInputSchema = z.object({
	id: z.string(),
});

export type SnippetsDeleteInput = z.infer<typeof SnippetsDeleteInputSchema>;

export const SnippetsDeleteOutputSchema = z.object({
	success: z.boolean().optional(),
});

export type SnippetsDeleteOutput = z.infer<typeof SnippetsDeleteOutputSchema>;

export const UsersGetMeInputSchema = z.object({});

export type UsersGetMeInput = z.infer<typeof UsersGetMeInputSchema>;

export const UsersGetMeOutputSchema = z.record(z.string(), z.unknown());

export type UsersGetMeOutput = z.infer<typeof UsersGetMeOutputSchema>;

export const UsersGetInputSchema = z.object({
	id: z.string(),
});

export type UsersGetInput = z.infer<typeof UsersGetInputSchema>;

export const UsersGetOutputSchema = z.record(z.string(), z.unknown());

export type UsersGetOutput = z.infer<typeof UsersGetOutputSchema>;

export const UsersUpdatePasswordInputSchema = z.object({
	id: z.string(),
	password: z.string().min(8),
});

export type UsersUpdatePasswordInput = z.infer<typeof UsersUpdatePasswordInputSchema>;

export const UsersUpdatePasswordOutputSchema = z.record(z.string(), z.unknown());

export type UsersUpdatePasswordOutput = z.infer<typeof UsersUpdatePasswordOutputSchema>;

export const UsersUpdateSubscriptionInputSchema = z.object({
	id: z.string(),
	plan: z.string(),
});

export type UsersUpdateSubscriptionInput = z.infer<typeof UsersUpdateSubscriptionInputSchema>;

export const UsersUpdateSubscriptionOutputSchema = z.record(z.string(), z.unknown());

export type UsersUpdateSubscriptionOutput = z.infer<typeof UsersUpdateSubscriptionOutputSchema>;

export const UserPreferencesGetInputSchema = z.object({});

export type UserPreferencesGetInput = z.infer<typeof UserPreferencesGetInputSchema>;

export const UserPreferencesGetOutputSchema = z.record(z.string(), z.unknown());

export type UserPreferencesGetOutput = z.infer<typeof UserPreferencesGetOutputSchema>;

export const UserPreferencesUpdateInputSchema = z.object({
	autoBcc: z.boolean().optional(),
	autoBccExcludedEmails: z.array(z.string().email()).optional(),
	signature: z.string().optional(),
}).passthrough();

export type UserPreferencesUpdateInput = z.infer<typeof UserPreferencesUpdateInputSchema>;

export const UserPreferencesUpdateOutputSchema = z.record(z.string(), z.unknown());


export type MixmaxEndpointInputs = {
	messagesList: MessagesListInput;
	messagesCreate: MessagesCreateInput;
	messagesGet: MessagesGetInput;
	messagesUpdate: MessagesUpdateInput;
	messagesSend: MessagesSendInput;
	messagesSchedule: MessagesScheduleInput;
	messagesUnschedule: MessagesUnscheduleInput;
	messagesTest: MessagesTestInput;
	messagesSendPlain: MessagesSendPlainInput;
	sequencesList: SequencesListInput;
	sequencesGetRecipients: SequencesGetRecipientsInput;
	sequencesAddRecipients: SequencesAddRecipientsInput;
	sequencesGet: SequencesGetInput;
	sequencesCreate: SequencesCreateInput;
	sequencesUpdate: SequencesUpdateInput;
	sequencesDelete: SequencesDeleteInput;
	sequencesPause: SequencesPauseInput;
	sequencesResume: SequencesResumeInput;
	snippetsList: SnippetsListInput;
	snippetsGet: SnippetsGetInput;
	snippetsCreate: SnippetsCreateInput;
	snippetsUpdate: SnippetsUpdateInput;
	snippetsDelete: SnippetsDeleteInput;
	usersGetMe: UsersGetMeInput;
	userPreferencesGet: UserPreferencesGetInput;
	userPreferencesUpdate: UserPreferencesUpdateInput;
	usersGet: UsersGetInput;
	usersUpdatePassword: UsersUpdatePasswordInput;
	usersUpdateSubscription: UsersUpdateSubscriptionInput;
};

export type MixmaxEndpointOutputs = {
	messagesList: MessagesListOutput;
	messagesCreate: MessagesCreateOutput;
	messagesGet: MessagesGetOutput;
	messagesUpdate: MessagesUpdateOutput;
	messagesSend: MessagesSendOutput;
	messagesSchedule: MessagesScheduleOutput;
	messagesUnschedule: MessagesUnscheduleOutput;
	messagesTest: MessagesTestOutput;
	messagesSendPlain: MessagesSendPlainOutput;
	sequencesList: SequencesListOutput;
	sequencesGetRecipients: SequencesGetRecipientsOutput;
	sequencesAddRecipients: SequencesAddRecipientsOutput;
	sequencesGet: SequencesGetOutput;
	sequencesCreate: SequencesCreateOutput;
	sequencesUpdate: SequencesUpdateOutput;
	sequencesDelete: SequencesDeleteOutput;
	sequencesPause: SequencesPauseOutput;
	sequencesResume: SequencesResumeOutput;
	snippetsList: SnippetsListOutput;
	snippetsGet: SnippetsGetOutput;
	snippetsCreate: SnippetsCreateOutput;
	snippetsUpdate: SnippetsUpdateOutput;
	snippetsDelete: SnippetsDeleteOutput;
	usersGetMe: UsersGetMeOutput;
	userPreferencesGet: UserPreferencesGetOutput;
	userPreferencesUpdate: UserPreferencesUpdateOutput;
	usersGet: UsersGetOutput;
	usersUpdatePassword: UsersUpdatePasswordOutput;
	usersUpdateSubscription: UsersUpdateSubscriptionOutput;
};

export const MixmaxEndpointInputSchemas = {
	messagesList: MessagesListInputSchema,
	messagesCreate: MessagesCreateInputSchema,
	messagesGet: MessagesGetInputSchema,
	messagesUpdate: MessagesUpdateInputSchema,
	messagesSend: MessagesSendInputSchema,
	messagesSchedule: MessagesScheduleInputSchema,
	messagesUnschedule: MessagesUnscheduleInputSchema,
	messagesTest: MessagesTestInputSchema,
	messagesSendPlain: MessagesSendPlainInputSchema,
	sequencesList: SequencesListInputSchema,
	sequencesGetRecipients: SequencesGetRecipientsInputSchema,
	sequencesAddRecipients: SequencesAddRecipientsInputSchema,
	sequencesGet: SequencesGetInputSchema,
	sequencesCreate: SequencesCreateInputSchema,
	sequencesUpdate: SequencesUpdateInputSchema,
	sequencesDelete: SequencesDeleteInputSchema,
	sequencesPause: SequencesPauseInputSchema,
	sequencesResume: SequencesResumeInputSchema,
	snippetsList: SnippetsListInputSchema,
	snippetsGet: SnippetsGetInputSchema,
	snippetsCreate: SnippetsCreateInputSchema,
	snippetsUpdate: SnippetsUpdateInputSchema,
	snippetsDelete: SnippetsDeleteInputSchema,
	usersGetMe: UsersGetMeInputSchema,
	userPreferencesGet: UserPreferencesGetInputSchema,
	userPreferencesUpdate: UserPreferencesUpdateInputSchema,
	usersGet: UsersGetInputSchema,
	usersUpdatePassword: UsersUpdatePasswordInputSchema,
	usersUpdateSubscription: UsersUpdateSubscriptionInputSchema,
};

export const MixmaxEndpointOutputSchemas = {
	messagesList: MessagesListOutputSchema,
	messagesCreate: MessagesCreateOutputSchema,
	messagesGet: MessagesGetOutputSchema,
	messagesUpdate: MessagesUpdateOutputSchema,
	messagesSend: MessagesSendOutputSchema,
	messagesSchedule: MessagesScheduleOutputSchema,
	messagesUnschedule: MessagesUnscheduleOutputSchema,
	messagesTest: MessagesTestOutputSchema,
	messagesSendPlain: MessagesSendPlainOutputSchema,
	sequencesList: SequencesListOutputSchema,
	sequencesGetRecipients: SequencesGetRecipientsOutputSchema,
	sequencesAddRecipients: SequencesAddRecipientsOutputSchema,
	sequencesGet: SequencesGetOutputSchema,
	sequencesCreate: SequencesCreateOutputSchema,
	sequencesUpdate: SequencesUpdateOutputSchema,
	sequencesDelete: SequencesDeleteOutputSchema,
	sequencesPause: SequencesPauseOutputSchema,
	sequencesResume: SequencesResumeOutputSchema,
	snippetsList: SnippetsListOutputSchema,
	snippetsGet: SnippetsGetOutputSchema,
	snippetsCreate: SnippetsCreateOutputSchema,
	snippetsUpdate: SnippetsUpdateOutputSchema,
	snippetsDelete: SnippetsDeleteOutputSchema,
	usersGetMe: UsersGetMeOutputSchema,
	userPreferencesGet: UserPreferencesGetOutputSchema,
	userPreferencesUpdate: UserPreferencesUpdateOutputSchema,
	usersGet: UsersGetOutputSchema,
	usersUpdatePassword: UsersUpdatePasswordOutputSchema,
	usersUpdateSubscription: UsersUpdateSubscriptionOutputSchema,
};
