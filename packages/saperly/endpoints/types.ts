import { z } from 'zod';

const id = z.string().min(1);
const nullable = <T extends z.ZodType>(schema: T) =>
	z.union([schema, z.null()]);

export const EmptyInputSchema = z.object({});

export const IdempotencyKeySchema = z.string().min(1).optional();

const ScopeSchema = z.enum(['read', 'write', 'admin']);

export const PhoneNumberSchema = z.looseObject({
	id: z.string(),
	phoneNumber: z.string(),
	connectionId: z.string().nullable(),
	webhookUrl: z.string().nullable(),
	smsSenderId: z.string().nullable().optional(),
	callerIdName: z.string().nullable().optional(),
	country: z.string().nullable(),
	numberType: z.string().nullable(),
	monthlyPriceCents: z.number().nullable(),
	currency: z.string().nullable(),
	nextChargeAt: z.string().nullable(),
	releasedAt: z.string().nullable(),
	createdAt: z.string(),
});

export const StatusSchema = z.looseObject({
	status: z.string(),
});

const BackgroundAudioSchema = z.union([
	z.strictObject({ type: z.literal('off') }),
	z.strictObject({ type: z.literal('office'), volume: z.number() }),
]);

const LlmSchema = z.strictObject({
	kind: z.literal('managed'),
	model: z.string().min(1),
});

const TtsInputSchema = z.strictObject({
	provider: z.string().nullable().optional(),
	voiceId: z.string().min(1),
});

const McpAuthSchema = z.strictObject({
	type: z.enum(['bearer', 'none']),
	token: z.string().nullable().optional(),
});

const McpServerSchema = z.strictObject({
	url: z.string().min(1),
	auth: nullable(McpAuthSchema).optional(),
	allowedTools: nullable(z.array(z.string())).optional(),
});

const TransferTargetsSchema = z.strictObject({
	targets: z.array(z.string()),
	from: z.string().nullable().optional(),
});

const CallControlSchema = z.strictObject({
	endCall: z.boolean().nullable().optional(),
	sendDtmf: z.boolean().nullable().optional(),
	transfer: nullable(TransferTargetsSchema).optional(),
});

const OpenAiRealtimeSchema = z.strictObject({
	model: z.string().min(1),
	voice: z.string().nullable().optional(),
});

const connectionFields = {
	name: z.string().min(1).max(120).nullable().optional(),
	mode: z.enum(['hosted', 'manual']).nullable().optional(),
	backend: z.enum(['network', 'openai_realtime']).nullable().optional(),
	instructions: z.string().nullable().optional(),
	llm: nullable(LlmSchema).optional(),
	tts: nullable(TtsInputSchema).optional(),
	backgroundAudio: nullable(BackgroundAudioSchema).optional(),
	language: z.string().nullable().optional(),
	mcpServers: nullable(z.array(McpServerSchema)).optional(),
	callControl: nullable(CallControlSchema).optional(),
	complianceEnabled: z.boolean().nullable().optional(),
	smsAutoReply: z.boolean().nullable().optional(),
	disclosure: z.string().nullable().optional(),
	openaiRealtime: nullable(OpenAiRealtimeSchema).optional(),
	manualWebhookUrl: z.string().nullable().optional(),
};

export const ConnectionSchema = z.looseObject({
	id: z.string(),
	name: z.string(),
	mode: z.enum(['hosted', 'manual']),
	instructions: z.string(),
	llm: z
		.looseObject({ kind: z.literal('managed'), model: z.string() })
		.nullable(),
	backgroundAudio: z
		.union([
			z.looseObject({ type: z.literal('off') }),
			z.looseObject({ type: z.literal('office'), volume: z.number() }),
		])
		.nullable()
		.optional(),
	language: z.string().nullable(),
	mcpServers: z
		.array(
			z.looseObject({
				url: z.string(),
				auth: z
					.looseObject({
						type: z.enum(['bearer', 'none']),
						token: z.string().nullable().optional(),
					})
					.nullable()
					.optional(),
				allowedTools: z.array(z.string()).nullable().optional(),
			}),
		)
		.nullable(),
	callControl: z
		.looseObject({
			endCall: z.boolean().nullable().optional(),
			sendDtmf: z.boolean().nullable().optional(),
			transfer: z
				.looseObject({
					targets: z.array(z.string()),
					from: z.string().nullable().optional(),
				})
				.nullable()
				.optional(),
		})
		.nullable(),
	complianceEnabled: z.boolean(),
	smsAutoReply: z.boolean(),
	disclosure: z.string(),
	recordingEnabled: z.boolean(),
	openaiRealtime: z
		.looseObject({
			model: z.string(),
			voice: z.string().nullable().optional(),
		})
		.nullable(),
	manualSecret: z.string().nullable(),
	manualWebhookUrl: z.string().nullable(),
	createdAt: z.string(),
	backend: z.enum(['network', 'openai_realtime']),
	tts: z.looseObject({ voiceId: z.string() }).nullable(),
});

export const MessageSchema = z.looseObject({
	id: z.string(),
	numberId: z.string(),
	direction: z.enum(['inbound', 'outbound']),
	to: z.string(),
	from: z.string(),
	body: z.string(),
	segments: z.number(),
	status: z.string(),
	createdAt: z.string(),
});

export const CallSchema = z.looseObject({
	id: z.string(),
	numberId: z.string(),
	direction: z.enum(['inbound', 'outbound']),
	to: z.string(),
	from: z.string(),
	status: z.string(),
	rateCentsPerMin: z.number().nullable(),
	durationSec: z.number().nullable(),
	costCents: z.number().nullable(),
	hasRecording: z.boolean(),
	hasTranscript: z.boolean(),
	createdAt: z.string(),
});

export const VoiceSchema = z.looseObject({
	id: z.string(),
	name: z.string(),
	gender: z.string(),
	language: z.string(),
});

export const CustomVoiceSchema = z.looseObject({
	id: z.string(),
	name: z.string(),
	language: z.string(),
	gender: z.enum(['male', 'female', 'neutral']),
	status: z.enum(['pending', 'active', 'failed', 'expired']),
	failureReason: z.string().nullable(),
	deletionPending: z.boolean().nullable().optional(),
	createdAt: z.string(),
	updatedAt: z.string(),
});

export const LanguageSchema = z.looseObject({
	code: z.string(),
	name: z.string(),
});

export const UsageSchema = z.looseObject({
	calls: z.looseObject({
		count: z.number(),
		totalCostCents: z.number(),
		totalDurationSec: z.number(),
	}),
	messages: z.looseObject({ count: z.number() }),
	balanceCents: z.number(),
});

export const ConsentSchema = z.looseObject({
	id: z.string(),
	numberId: z.string(),
	peerNumber: z.string(),
	consentType: z.enum(['implied_inbound', 'explicit_outbound']),
	source: z.string(),
	grantedAt: z.string(),
	revokedAt: z.string().nullable(),
});

export const ConsentCheckSchema = z.looseObject({
	hasConsent: z.boolean(),
	type: z.enum(['implied_inbound', 'explicit_outbound']).nullable().optional(),
});

export const QuoteSchema = z.looseObject({
	customerMonthlyCents: z.number(),
	customerUpfrontCents: z.number(),
});

export const ApiTokenSchema = z.looseObject({
	id: z.string(),
	name: z.string(),
	token: z.string(),
	prefix: z.string(),
	scopes: z.array(ScopeSchema),
	lastUsedAt: z.string().nullable(),
	createdAt: z.string(),
	numberScope: z.array(z.string()).nullable().optional(),
	spendLimitCents: z.number().nullable().optional(),
	spendLimitResetPeriod: z.enum(['monthly']).nullable().optional(),
	spentThisPeriodCents: z.number().nullable().optional(),
	canProvisionKeys: z.boolean().nullable().optional(),
	permissions: z.array(z.string()).nullable().optional(),
	mintedByTokenId: z.string().nullable().optional(),
});

export const MintedTokenSchema = z.looseObject({
	id: z.string(),
	name: z.string(),
	prefix: z.string(),
	scopes: z.array(ScopeSchema),
	lastUsedAt: z.string().nullable(),
	createdAt: z.string(),
	token: z.string(),
});

export const HealthSchema = z.looseObject({
	status: z.literal('ok'),
});

export const AssistantSchema = z.looseObject({
	answer: z.string(),
	provider: z.enum(['workers-ai', 'openai-compatible', 'mock']),
	modelId: z.string(),
	usedTools: z.array(z.string()),
	assistantConfigured: z.boolean(),
});

// OpenAPI leaves this response as `{}`. An array of turns and a loose object
// are both accepted so a documented-but-unspecified body does not throw.
export const TranscriptSchema = z.union([
	z.array(z.looseObject({})),
	z.looseObject({}),
]);

export const RecordingSchema = z.looseObject({
	url: z.string().min(1),
});

const GrantFields = {
	numberScope: nullable(z.array(z.string())).optional(),
	spendLimitCents: nullable(z.number().min(1)).optional(),
	spendLimitResetPeriod: nullable(z.enum(['monthly'])).optional(),
};

export const ListNumbersInputSchema = EmptyInputSchema;
export const ProvisionNumberInputSchema = z.strictObject({
	country: z.string().nullable().optional(),
	numberType: z.string().nullable().optional(),
	areaCode: z.string().nullable().optional(),
	expectedMonthlyPriceCents: z.number().nullable().optional(),
	expectedUpfrontPriceCents: z.number().nullable().optional(),
	approveHigherPrice: z.boolean().nullable().optional(),
	idempotencyKey: IdempotencyKeySchema,
});
export const NumberIdInputSchema = z.strictObject({ id });
export const AssignConnectionInputSchema = z.strictObject({
	id,
	connectionId: z.string().min(1),
	idempotencyKey: IdempotencyKeySchema,
});
export const SetWebhookInputSchema = z.strictObject({
	id,
	url: z.string().min(1),
	idempotencyKey: IdempotencyKeySchema,
});
export const SetSmsSenderInputSchema = z.strictObject({
	id,
	smsSenderId: z.union([z.string().regex(/^[A-Za-z0-9]{1,11}$/), z.null()]),
	idempotencyKey: IdempotencyKeySchema,
});
export const SetCallerIdInputSchema = z.strictObject({
	id,
	callerIdName: z.union([z.string().regex(/^[A-Za-z0-9 ]{1,15}$/), z.null()]),
	idempotencyKey: IdempotencyKeySchema,
});
export const ReleaseNumberInputSchema = z.strictObject({
	id,
	idempotencyKey: IdempotencyKeySchema,
});

export const ListConnectionsInputSchema = EmptyInputSchema;
export const CreateConnectionInputSchema = z.strictObject({
	...connectionFields,
	name: z.string().min(1).max(120),
	idempotencyKey: IdempotencyKeySchema,
});
export const UpdateConnectionInputSchema = z.strictObject({
	id,
	...connectionFields,
	idempotencyKey: IdempotencyKeySchema,
});
export const DeleteConnectionInputSchema = NumberIdInputSchema;

export const SendMessageInputSchema = z.strictObject({
	fromNumberId: z.string().min(1),
	to: z.string().min(1),
	body: z.string().min(1).max(1600),
	idempotencyKey: IdempotencyKeySchema,
});
export const ListMessagesInputSchema = z.strictObject({
	numberId: z.string().min(1).optional(),
});

export const PlaceCallInputSchema = z.strictObject({
	fromNumberId: z.string().min(1),
	to: z.string().min(1),
	connectionId: z.string().min(1).nullable().optional(),
	instructions: z.string().nullable().optional(),
	idempotencyKey: IdempotencyKeySchema,
});
export const ListCallsInputSchema = EmptyInputSchema;
export const EndCallInputSchema = z.strictObject({
	id,
	idempotencyKey: IdempotencyKeySchema,
});
export const TransferCallInputSchema = z.strictObject({
	id,
	to: z.string().min(1),
	idempotencyKey: IdempotencyKeySchema,
});

export const ListVoicesInputSchema = z.strictObject({
	language: z.string().min(1).optional(),
});
export const ListCustomVoicesInputSchema = EmptyInputSchema;
export const CreateCustomVoiceInputSchema = z.strictObject({
	name: z.string().min(1),
	language: z.string().min(1),
	gender: z.enum(['male', 'female', 'neutral']),
	audio: z.instanceof(Blob),
	idempotencyKey: z.string().min(1),
});
export const CustomVoiceIdInputSchema = NumberIdInputSchema;

export const ListLanguagesInputSchema = EmptyInputSchema;
export const UsageInputSchema = z.strictObject({
	since: z.string().min(1).optional(),
});

export const ListConsentInputSchema = EmptyInputSchema;
export const RecordConsentInputSchema = z.strictObject({
	numberId: z.string().min(1),
	peerNumber: z.string().min(1),
	consentType: z.enum(['implied_inbound', 'explicit_outbound']),
	source: z.string().min(1),
	idempotencyKey: IdempotencyKeySchema,
});
export const RevokeConsentInputSchema = z.strictObject({
	numberId: z.string().min(1),
	peerNumber: z.string().min(1),
	idempotencyKey: IdempotencyKeySchema,
});
export const CheckConsentInputSchema = z.strictObject({
	numberId: z.string().min(1),
	peerNumber: z.string().min(1),
});

export const QuoteInputSchema = z.strictObject({
	country: z.string().min(1),
	numberType: z.string().min(1),
});

export const ListKeysInputSchema = EmptyInputSchema;
export const MintKeyInputSchema = z.strictObject({
	name: z.string().min(1).max(100),
	scopes: z.array(ScopeSchema).min(1).max(3),
	...GrantFields,
	idempotencyKey: IdempotencyKeySchema,
});
export const RevokeKeyInputSchema = z.strictObject({
	id,
	idempotencyKey: IdempotencyKeySchema,
});

export const AssistantInputSchema = z.strictObject({
	workspaceSlug: z.string().min(1).max(100),
	question: z.string().min(1).max(2000),
	idempotencyKey: IdempotencyKeySchema,
});

export type ListNumbersInput = z.infer<typeof ListNumbersInputSchema>;
export type ProvisionNumberInput = z.infer<typeof ProvisionNumberInputSchema>;
export type NumberIdInput = z.infer<typeof NumberIdInputSchema>;
export type AssignConnectionInput = z.infer<typeof AssignConnectionInputSchema>;
export type SetWebhookInput = z.infer<typeof SetWebhookInputSchema>;
export type SetSmsSenderInput = z.infer<typeof SetSmsSenderInputSchema>;
export type SetCallerIdInput = z.infer<typeof SetCallerIdInputSchema>;
export type ReleaseNumberInput = z.infer<typeof ReleaseNumberInputSchema>;
export type ListConnectionsInput = z.infer<typeof ListConnectionsInputSchema>;
export type CreateConnectionInput = z.infer<typeof CreateConnectionInputSchema>;
export type UpdateConnectionInput = z.infer<typeof UpdateConnectionInputSchema>;
export type DeleteConnectionInput = z.infer<typeof DeleteConnectionInputSchema>;
export type SendMessageInput = z.infer<typeof SendMessageInputSchema>;
export type ListMessagesInput = z.infer<typeof ListMessagesInputSchema>;
export type PlaceCallInput = z.infer<typeof PlaceCallInputSchema>;
export type ListCallsInput = z.infer<typeof ListCallsInputSchema>;
export type EndCallInput = z.infer<typeof EndCallInputSchema>;
export type TransferCallInput = z.infer<typeof TransferCallInputSchema>;
export type ListVoicesInput = z.infer<typeof ListVoicesInputSchema>;
export type ListCustomVoicesInput = z.infer<typeof ListCustomVoicesInputSchema>;
export type CreateCustomVoiceInput = z.infer<
	typeof CreateCustomVoiceInputSchema
>;
export type CustomVoiceIdInput = z.infer<typeof CustomVoiceIdInputSchema>;
export type ListLanguagesInput = z.infer<typeof ListLanguagesInputSchema>;
export type UsageInput = z.infer<typeof UsageInputSchema>;
export type ListConsentInput = z.infer<typeof ListConsentInputSchema>;
export type RecordConsentInput = z.infer<typeof RecordConsentInputSchema>;
export type RevokeConsentInput = z.infer<typeof RevokeConsentInputSchema>;
export type CheckConsentInput = z.infer<typeof CheckConsentInputSchema>;
export type QuoteInput = z.infer<typeof QuoteInputSchema>;
export type ListKeysInput = z.infer<typeof ListKeysInputSchema>;
export type MintKeyInput = z.infer<typeof MintKeyInputSchema>;
export type RevokeKeyInput = z.infer<typeof RevokeKeyInputSchema>;
export type AssistantInput = z.infer<typeof AssistantInputSchema>;
export type EmptyInput = z.infer<typeof EmptyInputSchema>;

export type PhoneNumber = z.infer<typeof PhoneNumberSchema>;
export type StatusResult = z.infer<typeof StatusSchema>;
export type Connection = z.infer<typeof ConnectionSchema>;
export type Message = z.infer<typeof MessageSchema>;
export type Call = z.infer<typeof CallSchema>;
export type Voice = z.infer<typeof VoiceSchema>;
export type CustomVoice = z.infer<typeof CustomVoiceSchema>;
export type Language = z.infer<typeof LanguageSchema>;
export type Usage = z.infer<typeof UsageSchema>;
export type Consent = z.infer<typeof ConsentSchema>;
export type ConsentCheck = z.infer<typeof ConsentCheckSchema>;
export type Quote = z.infer<typeof QuoteSchema>;
export type ApiToken = z.infer<typeof ApiTokenSchema>;
export type MintedToken = z.infer<typeof MintedTokenSchema>;
export type Health = z.infer<typeof HealthSchema>;
export type AssistantAnswer = z.infer<typeof AssistantSchema>;
export type Transcript = z.infer<typeof TranscriptSchema>;
export type Recording = z.infer<typeof RecordingSchema>;

export type SaperlyEndpointInputs = {
	listNumbers: ListNumbersInput;
	provisionNumber: ProvisionNumberInput;
	getNumber: NumberIdInput;
	releaseNumber: ReleaseNumberInput;
	assignConnection: AssignConnectionInput;
	setNumberWebhook: SetWebhookInput;
	setSmsSender: SetSmsSenderInput;
	setCallerId: SetCallerIdInput;
	listConnections: ListConnectionsInput;
	createConnection: CreateConnectionInput;
	getConnection: NumberIdInput;
	updateConnection: UpdateConnectionInput;
	deleteConnection: DeleteConnectionInput;
	sendMessage: SendMessageInput;
	listMessages: ListMessagesInput;
	placeCall: PlaceCallInput;
	listCalls: ListCallsInput;
	getCall: NumberIdInput;
	endCall: EndCallInput;
	transferCall: TransferCallInput;
	getRecording: NumberIdInput;
	getTranscript: NumberIdInput;
	listVoices: ListVoicesInput;
	listCustomVoices: ListCustomVoicesInput;
	createCustomVoice: CreateCustomVoiceInput;
	getCustomVoice: CustomVoiceIdInput;
	deleteCustomVoice: CustomVoiceIdInput;
	listLanguages: ListLanguagesInput;
	getUsage: UsageInput;
	listConsent: ListConsentInput;
	recordConsent: RecordConsentInput;
	revokeConsent: RevokeConsentInput;
	checkConsent: CheckConsentInput;
	quotePrice: QuoteInput;
	listKeys: ListKeysInput;
	mintKey: MintKeyInput;
	revokeKey: RevokeKeyInput;
	checkHealth: EmptyInput;
	askAssistant: AssistantInput;
};

export type SaperlyEndpointOutputs = {
	listNumbers: PhoneNumber[];
	provisionNumber: PhoneNumber;
	getNumber: PhoneNumber;
	releaseNumber: StatusResult;
	assignConnection: PhoneNumber;
	setNumberWebhook: PhoneNumber;
	setSmsSender: PhoneNumber;
	setCallerId: PhoneNumber;
	listConnections: Connection[];
	createConnection: Connection;
	getConnection: Connection;
	updateConnection: Connection;
	deleteConnection: StatusResult;
	sendMessage: Message;
	listMessages: Message[];
	placeCall: Call;
	listCalls: Call[];
	getCall: Call;
	endCall: Call;
	transferCall: Call;
	getRecording: Recording;
	getTranscript: Transcript;
	listVoices: Voice[];
	listCustomVoices: CustomVoice[];
	createCustomVoice: CustomVoice;
	getCustomVoice: CustomVoice;
	deleteCustomVoice: StatusResult;
	listLanguages: Language[];
	getUsage: Usage;
	listConsent: Consent[];
	recordConsent: Consent;
	revokeConsent: StatusResult;
	checkConsent: ConsentCheck;
	quotePrice: Quote;
	listKeys: ApiToken[];
	mintKey: MintedToken;
	revokeKey: StatusResult;
	checkHealth: Health;
	askAssistant: AssistantAnswer;
};

export const SaperlyEndpointInputSchemas = {
	listNumbers: ListNumbersInputSchema,
	provisionNumber: ProvisionNumberInputSchema,
	getNumber: NumberIdInputSchema,
	releaseNumber: ReleaseNumberInputSchema,
	assignConnection: AssignConnectionInputSchema,
	setNumberWebhook: SetWebhookInputSchema,
	setSmsSender: SetSmsSenderInputSchema,
	setCallerId: SetCallerIdInputSchema,
	listConnections: ListConnectionsInputSchema,
	createConnection: CreateConnectionInputSchema,
	getConnection: NumberIdInputSchema,
	updateConnection: UpdateConnectionInputSchema,
	deleteConnection: DeleteConnectionInputSchema,
	sendMessage: SendMessageInputSchema,
	listMessages: ListMessagesInputSchema,
	placeCall: PlaceCallInputSchema,
	listCalls: ListCallsInputSchema,
	getCall: NumberIdInputSchema,
	endCall: EndCallInputSchema,
	transferCall: TransferCallInputSchema,
	getRecording: NumberIdInputSchema,
	getTranscript: NumberIdInputSchema,
	listVoices: ListVoicesInputSchema,
	listCustomVoices: ListCustomVoicesInputSchema,
	createCustomVoice: CreateCustomVoiceInputSchema,
	getCustomVoice: CustomVoiceIdInputSchema,
	deleteCustomVoice: CustomVoiceIdInputSchema,
	listLanguages: ListLanguagesInputSchema,
	getUsage: UsageInputSchema,
	listConsent: ListConsentInputSchema,
	recordConsent: RecordConsentInputSchema,
	revokeConsent: RevokeConsentInputSchema,
	checkConsent: CheckConsentInputSchema,
	quotePrice: QuoteInputSchema,
	listKeys: ListKeysInputSchema,
	mintKey: MintKeyInputSchema,
	revokeKey: RevokeKeyInputSchema,
	checkHealth: EmptyInputSchema,
	askAssistant: AssistantInputSchema,
} as const;

export const SaperlyEndpointOutputSchemas = {
	listNumbers: z.array(PhoneNumberSchema),
	provisionNumber: PhoneNumberSchema,
	getNumber: PhoneNumberSchema,
	releaseNumber: StatusSchema,
	assignConnection: PhoneNumberSchema,
	setNumberWebhook: PhoneNumberSchema,
	setSmsSender: PhoneNumberSchema,
	setCallerId: PhoneNumberSchema,
	listConnections: z.array(ConnectionSchema),
	createConnection: ConnectionSchema,
	getConnection: ConnectionSchema,
	updateConnection: ConnectionSchema,
	deleteConnection: StatusSchema,
	sendMessage: MessageSchema,
	listMessages: z.array(MessageSchema),
	placeCall: CallSchema,
	listCalls: z.array(CallSchema),
	getCall: CallSchema,
	endCall: CallSchema,
	transferCall: CallSchema,
	getRecording: RecordingSchema,
	getTranscript: TranscriptSchema,
	listVoices: z.array(VoiceSchema),
	listCustomVoices: z.array(CustomVoiceSchema),
	createCustomVoice: CustomVoiceSchema,
	getCustomVoice: CustomVoiceSchema,
	deleteCustomVoice: StatusSchema,
	listLanguages: z.array(LanguageSchema),
	getUsage: UsageSchema,
	listConsent: z.array(ConsentSchema),
	recordConsent: ConsentSchema,
	revokeConsent: StatusSchema,
	checkConsent: ConsentCheckSchema,
	quotePrice: QuoteSchema,
	listKeys: z.array(ApiTokenSchema),
	mintKey: MintedTokenSchema,
	revokeKey: StatusSchema,
	checkHealth: HealthSchema,
	askAssistant: AssistantSchema,
} as const;
