import type {
	AuthTypes,
	BindEndpoints,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
	RequiredPluginWebhookSchemas,
} from 'corsair/core';
import {
	Agents,
	Audio,
	AudioAgents,
	Batch,
	Chat,
	Classifiers,
	Embeddings,
	Files,
	Fim,
	Models,
	Ocr,
	Responses,
	Voices,
} from './endpoints';
import type {
	MistralAiEndpointInputs,
	MistralAiEndpointOutputs,
	MistralAiOperation,
} from './endpoints/types';
import {
	MistralAiEndpointInputSchemas as In,
	MistralAiEndpointOutputSchemas as Out,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { MistralAiSchema } from './schema';

export type MistralAiPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalMistralAiPlugin['hooks'];
	webhookHooks?: InternalMistralAiPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof mistralAiEndpointsNested>;
};

export type MistralAiContext = CorsairPluginContext<
	typeof MistralAiSchema,
	MistralAiPluginOptions
>;

export type MistralAiKeyBuilderContext =
	KeyBuilderContext<MistralAiPluginOptions>;

export type MistralAiBoundEndpoints = BindEndpoints<
	typeof mistralAiEndpointsNested
>;

type MistralAiEndpoint<K extends MistralAiOperation> = CorsairEndpoint<
	MistralAiContext,
	MistralAiEndpointInputs[K],
	MistralAiEndpointOutputs[K]
>;

export type MistralAiEndpoints = {
	chatComplete: MistralAiEndpoint<'chatComplete'>;
	fimComplete: MistralAiEndpoint<'fimComplete'>;
	agentsComplete: MistralAiEndpoint<'agentsComplete'>;
	embeddingsCreate: MistralAiEndpoint<'embeddingsCreate'>;
	classifiersModerate: MistralAiEndpoint<'classifiersModerate'>;
	classifiersModerateChat: MistralAiEndpoint<'classifiersModerateChat'>;
	classifiersClassify: MistralAiEndpoint<'classifiersClassify'>;
	classifiersClassifyChat: MistralAiEndpoint<'classifiersClassifyChat'>;
	ocrProcess: MistralAiEndpoint<'ocrProcess'>;
	audioSpeech: MistralAiEndpoint<'audioSpeech'>;
	audioTranscribe: MistralAiEndpoint<'audioTranscribe'>;
	voicesList: MistralAiEndpoint<'voicesList'>;
	voicesGet: MistralAiEndpoint<'voicesGet'>;
	voicesCreate: MistralAiEndpoint<'voicesCreate'>;
	voicesUpdate: MistralAiEndpoint<'voicesUpdate'>;
	voicesDelete: MistralAiEndpoint<'voicesDelete'>;
	audioAgentsList: MistralAiEndpoint<'audioAgentsList'>;
	audioAgentsGet: MistralAiEndpoint<'audioAgentsGet'>;
	audioAgentsCreate: MistralAiEndpoint<'audioAgentsCreate'>;
	audioAgentsUpdate: MistralAiEndpoint<'audioAgentsUpdate'>;
	audioAgentsDelete: MistralAiEndpoint<'audioAgentsDelete'>;
	audioAgentsListVersions: MistralAiEndpoint<'audioAgentsListVersions'>;
	audioAgentsListSessions: MistralAiEndpoint<'audioAgentsListSessions'>;
	modelsList: MistralAiEndpoint<'modelsList'>;
	modelsGet: MistralAiEndpoint<'modelsGet'>;
	modelsDelete: MistralAiEndpoint<'modelsDelete'>;
	modelsUpdate: MistralAiEndpoint<'modelsUpdate'>;
	modelsArchive: MistralAiEndpoint<'modelsArchive'>;
	modelsUnarchive: MistralAiEndpoint<'modelsUnarchive'>;
	filesList: MistralAiEndpoint<'filesList'>;
	filesUpload: MistralAiEndpoint<'filesUpload'>;
	filesGet: MistralAiEndpoint<'filesGet'>;
	filesDelete: MistralAiEndpoint<'filesDelete'>;
	filesGetSignedUrl: MistralAiEndpoint<'filesGetSignedUrl'>;
	batchList: MistralAiEndpoint<'batchList'>;
	batchCreate: MistralAiEndpoint<'batchCreate'>;
	batchGet: MistralAiEndpoint<'batchGet'>;
	batchDelete: MistralAiEndpoint<'batchDelete'>;
	batchCancel: MistralAiEndpoint<'batchCancel'>;
	responsesCreate: MistralAiEndpoint<'responsesCreate'>;
	responsesCountInputTokens: MistralAiEndpoint<'responsesCountInputTokens'>;
	agentsCreate: MistralAiEndpoint<'agentsCreate'>;
	agentsList: MistralAiEndpoint<'agentsList'>;
	agentsGet: MistralAiEndpoint<'agentsGet'>;
	agentsUpdate: MistralAiEndpoint<'agentsUpdate'>;
	agentsDelete: MistralAiEndpoint<'agentsDelete'>;
	agentsSetVersion: MistralAiEndpoint<'agentsSetVersion'>;
	agentsListVersions: MistralAiEndpoint<'agentsListVersions'>;
	agentsGetVersion: MistralAiEndpoint<'agentsGetVersion'>;
	agentsListAliases: MistralAiEndpoint<'agentsListAliases'>;
	agentsUpsertAlias: MistralAiEndpoint<'agentsUpsertAlias'>;
	agentsDeleteAlias: MistralAiEndpoint<'agentsDeleteAlias'>;
};

export type MistralAiWebhooks = Record<string, never>;

export type MistralAiBoundWebhooks = Record<string, never>;

const mistralAiEndpointsNested = {
	chat: Chat,
	fim: Fim,
	agents: Agents,
	embeddings: Embeddings,
	classifiers: Classifiers,
	ocr: Ocr,
	audio: Audio,
	voices: Voices,
	audioAgents: AudioAgents,
	models: Models,
	files: Files,
	batch: Batch,
	responses: Responses,
} as const;

const mistralAiWebhooksNested = {} as const;

export const mistralAiEndpointSchemas = {
	'chat.complete': { input: In.chatComplete, output: Out.chatComplete },
	'fim.complete': { input: In.fimComplete, output: Out.fimComplete },
	'agents.complete': { input: In.agentsComplete, output: Out.agentsComplete },
	'agents.create': { input: In.agentsCreate, output: Out.agentsCreate },
	'agents.list': { input: In.agentsList, output: Out.agentsList },
	'agents.get': { input: In.agentsGet, output: Out.agentsGet },
	'agents.update': { input: In.agentsUpdate, output: Out.agentsUpdate },
	'agents.delete': { input: In.agentsDelete, output: Out.agentsDelete },
	'agents.setVersion': {
		input: In.agentsSetVersion,
		output: Out.agentsSetVersion,
	},
	'agents.listVersions': {
		input: In.agentsListVersions,
		output: Out.agentsListVersions,
	},
	'agents.getVersion': {
		input: In.agentsGetVersion,
		output: Out.agentsGetVersion,
	},
	'agents.listAliases': {
		input: In.agentsListAliases,
		output: Out.agentsListAliases,
	},
	'agents.upsertAlias': {
		input: In.agentsUpsertAlias,
		output: Out.agentsUpsertAlias,
	},
	'agents.deleteAlias': {
		input: In.agentsDeleteAlias,
		output: Out.agentsDeleteAlias,
	},
	'embeddings.create': {
		input: In.embeddingsCreate,
		output: Out.embeddingsCreate,
	},
	'classifiers.moderate': {
		input: In.classifiersModerate,
		output: Out.classifiersModerate,
	},
	'classifiers.moderateChat': {
		input: In.classifiersModerateChat,
		output: Out.classifiersModerateChat,
	},
	'classifiers.classify': {
		input: In.classifiersClassify,
		output: Out.classifiersClassify,
	},
	'classifiers.classifyChat': {
		input: In.classifiersClassifyChat,
		output: Out.classifiersClassifyChat,
	},
	'ocr.process': { input: In.ocrProcess, output: Out.ocrProcess },
	'audio.speech': { input: In.audioSpeech, output: Out.audioSpeech },
	'audio.transcribe': {
		input: In.audioTranscribe,
		output: Out.audioTranscribe,
	},
	'voices.list': { input: In.voicesList, output: Out.voicesList },
	'voices.get': { input: In.voicesGet, output: Out.voicesGet },
	'voices.create': { input: In.voicesCreate, output: Out.voicesCreate },
	'voices.update': { input: In.voicesUpdate, output: Out.voicesUpdate },
	'voices.delete': { input: In.voicesDelete, output: Out.voicesDelete },
	'audioAgents.list': {
		input: In.audioAgentsList,
		output: Out.audioAgentsList,
	},
	'audioAgents.get': { input: In.audioAgentsGet, output: Out.audioAgentsGet },
	'audioAgents.create': {
		input: In.audioAgentsCreate,
		output: Out.audioAgentsCreate,
	},
	'audioAgents.update': {
		input: In.audioAgentsUpdate,
		output: Out.audioAgentsUpdate,
	},
	'audioAgents.delete': {
		input: In.audioAgentsDelete,
		output: Out.audioAgentsDelete,
	},
	'audioAgents.listVersions': {
		input: In.audioAgentsListVersions,
		output: Out.audioAgentsListVersions,
	},
	'audioAgents.listSessions': {
		input: In.audioAgentsListSessions,
		output: Out.audioAgentsListSessions,
	},
	'models.list': { input: In.modelsList, output: Out.modelsList },
	'models.get': { input: In.modelsGet, output: Out.modelsGet },
	'models.delete': { input: In.modelsDelete, output: Out.modelsDelete },
	'models.update': { input: In.modelsUpdate, output: Out.modelsUpdate },
	'models.archive': { input: In.modelsArchive, output: Out.modelsArchive },
	'models.unarchive': {
		input: In.modelsUnarchive,
		output: Out.modelsUnarchive,
	},
	'files.list': { input: In.filesList, output: Out.filesList },
	'files.upload': { input: In.filesUpload, output: Out.filesUpload },
	'files.get': { input: In.filesGet, output: Out.filesGet },
	'files.delete': { input: In.filesDelete, output: Out.filesDelete },
	'files.getSignedUrl': {
		input: In.filesGetSignedUrl,
		output: Out.filesGetSignedUrl,
	},
	'batch.list': { input: In.batchList, output: Out.batchList },
	'batch.create': { input: In.batchCreate, output: Out.batchCreate },
	'batch.get': { input: In.batchGet, output: Out.batchGet },
	'batch.delete': { input: In.batchDelete, output: Out.batchDelete },
	'batch.cancel': { input: In.batchCancel, output: Out.batchCancel },
	'responses.create': {
		input: In.responsesCreate,
		output: Out.responsesCreate,
	},
	'responses.countInputTokens': {
		input: In.responsesCountInputTokens,
		output: Out.responsesCountInputTokens,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof mistralAiEndpointsNested
>;

const mistralAiWebhookSchemas =
	{} as const satisfies RequiredPluginWebhookSchemas<
		typeof mistralAiWebhooksNested
	>;

const defaultAuthType: AuthTypes = 'api_key' as const;

// A batch job runs on Mistral after batch.create returns. Statuses are the
// spec's BatchJobStatus (endpoints/types.ts BATCH_JOB_STATUSES); QUEUED,
// RUNNING and CANCELLATION_REQUESTED mean it is still going. jobs.test.ts
// keeps the lists in step with the enum.
const BATCH_JOB = {
	idPath: 'id',
	status: {
		op: 'batch.get',
		idArg: 'job_id',
		statusPath: 'status',
		done: ['SUCCESS'],
		failed: ['FAILED', 'TIMEOUT_EXCEEDED', 'CANCELLED'],
	},
	cancel: { op: 'batch.cancel', idArg: 'job_id' },
} as const;

export const mistralAiEndpointMeta = {
	'chat.complete': {
		riskLevel: 'write',
		description:
			'Generate a chat answer from a list of messages, with optional tools and JSON output; spends Mistral credits',
	},
	'fim.complete': {
		riskLevel: 'write',
		description:
			'Fill in code between a prompt and a suffix with a Codestral model; spends Mistral credits',
	},
	'agents.complete': {
		riskLevel: 'write',
		description:
			"Run an agent on a list of messages with the agent's instructions and tools; spends Mistral credits",
	},
	'agents.create': {
		riskLevel: 'write',
		description:
			'Create an agent: a model with instructions, tools and default settings (beta). Mistral refuses agent creation for some organizations with 403 "Use Managed Agents instead"; existing agents can still be listed, read, versioned and deleted',
	},
	'agents.list': {
		riskLevel: 'read',
		description:
			'List agents, filtered by name, search text or metadata; page with page_token (beta)',
	},
	'agents.get': {
		riskLevel: 'read',
		description:
			'Get an agent, at its current version or at a given version or alias (beta)',
	},
	'agents.update': {
		riskLevel: 'write',
		description: 'Change an agent; each update creates a new version (beta)',
	},
	'agents.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete an agent; cannot be undone (beta)',
	},
	'agents.setVersion': {
		riskLevel: 'write',
		description: 'Switch an agent to another of its versions (beta)',
	},
	'agents.listVersions': {
		riskLevel: 'read',
		description:
			"List an agent's versions; page with page and page_size (beta)",
	},
	'agents.getVersion': {
		riskLevel: 'read',
		description: 'Get one version of an agent by number or alias (beta)',
	},
	'agents.listAliases': {
		riskLevel: 'read',
		description: "List an agent's version aliases (beta)",
	},
	'agents.upsertAlias': {
		riskLevel: 'write',
		description:
			'Point a version alias such as production at an agent version, creating it if needed (beta)',
	},
	// Destructive, not irreversible: agents.upsertAlias recreates the alias.
	'agents.deleteAlias': {
		riskLevel: 'destructive',
		description:
			'Remove a version alias from an agent; the version itself stays (beta)',
	},
	'embeddings.create': {
		riskLevel: 'write',
		description:
			'Turn one or more texts into embedding vectors; spends Mistral credits',
	},
	'classifiers.moderate': {
		riskLevel: 'write',
		description:
			'Score texts against moderation categories (sexual, hate, violence, self-harm…); spends Mistral credits',
	},
	'classifiers.moderateChat': {
		riskLevel: 'write',
		description:
			'Score a conversation against moderation categories; spends Mistral credits',
	},
	'classifiers.classify': {
		riskLevel: 'write',
		description:
			'Classify texts with a fine-tuned classifier model; spends Mistral credits',
	},
	'classifiers.classifyChat': {
		riskLevel: 'write',
		description:
			'Classify conversations with a fine-tuned classifier model; spends Mistral credits',
	},
	'ocr.process': {
		riskLevel: 'write',
		description:
			'Read a PDF or image (URL or uploaded file) into markdown per page, with optional structured annotations; spends Mistral credits',
	},
	'audio.speech': {
		riskLevel: 'write',
		description:
			'Turn text into speech; returns base64 audio (mp3 by default); spends Mistral credits',
	},
	'audio.transcribe': {
		riskLevel: 'write',
		description:
			'Transcribe audio from base64 content, a URL or an uploaded file, optionally with speakers and timestamps; spends Mistral credits',
	},
	'voices.list': {
		riskLevel: 'read',
		description:
			'List preset and custom voices for audio.speech; page with page_token',
	},
	'voices.get': { riskLevel: 'read', description: 'Get a voice' },
	'voices.create': {
		riskLevel: 'write',
		description: 'Create a custom voice from a base64 audio sample',
	},
	'voices.update': {
		riskLevel: 'write',
		description: "Change a custom voice's name, languages, tags or details",
	},
	'voices.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a custom voice; cannot be undone',
	},
	'audioAgents.list': {
		riskLevel: 'read',
		description: 'List voice agents; page with page_token',
	},
	'audioAgents.get': {
		riskLevel: 'read',
		description: 'Get a voice agent, optionally at a given version',
	},
	'audioAgents.create': {
		riskLevel: 'write',
		description:
			'Create a voice agent: speech-to-text, LLM and text-to-speech settings, instructions and tools',
	},
	'audioAgents.update': {
		riskLevel: 'write',
		description: "Replace a voice agent's name, description and configuration",
	},
	'audioAgents.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a voice agent; cannot be undone',
	},
	'audioAgents.listVersions': {
		riskLevel: 'read',
		description: "List a voice agent's versions; page with page_token",
	},
	'audioAgents.listSessions': {
		riskLevel: 'read',
		description: "List a voice agent's sessions; page with page_token",
	},
	'models.list': {
		riskLevel: 'read',
		description:
			'List the base and fine-tuned models this key can use, with their capabilities',
	},
	'models.get': {
		riskLevel: 'read',
		description: "Get a model's details and capabilities",
	},
	'models.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a fine-tuned model; cannot be undone',
	},
	'models.update': {
		riskLevel: 'write',
		description: 'Rename a fine-tuned model or change its description',
	},
	'models.archive': {
		riskLevel: 'write',
		description: 'Archive a fine-tuned model; models.unarchive restores it',
	},
	// HTTP DELETE, but it undoes models.archive and loses nothing: write.
	'models.unarchive': {
		riskLevel: 'write',
		description: 'Restore an archived fine-tuned model',
	},
	'files.list': {
		riskLevel: 'read',
		description:
			'List uploaded files, filtered by purpose or name; page with page and page_size',
	},
	'files.upload': {
		riskLevel: 'write',
		description:
			'Upload a file (base64, up to 512 MB) for batch jobs, fine-tuning or OCR; returns its id',
	},
	'files.get': { riskLevel: 'read', description: "Get a file's details" },
	'files.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete an uploaded file; cannot be undone',
	},
	'files.getSignedUrl': {
		riskLevel: 'read',
		description:
			"A temporary download URL for a file's content, such as a batch job's output_file",
	},
	'batch.list': {
		riskLevel: 'read',
		description:
			'List batch jobs, filtered by status, model or date; page with page and page_size',
	},
	'batch.create': {
		riskLevel: 'write',
		description:
			'Start a batch job that runs many requests to one endpoint, from uploaded .jsonl files or inline; spends Mistral credits and needs a Mistral plan with billing enabled (402 otherwise). Follow it with batch.get until status is SUCCESS, FAILED, TIMEOUT_EXCEEDED or CANCELLED',
		job: BATCH_JOB,
	},
	'batch.get': {
		riskLevel: 'read',
		description:
			"Where a batch job stands: status, request counts, and output_file once it's done",
	},
	'batch.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Ask Mistral to delete a batch job; cannot be undone',
	},
	'batch.cancel': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Ask Mistral to cancel a batch job: status goes to CANCELLATION_REQUESTED, then CANCELLED; there is no way to resume it',
	},
	'responses.create': {
		riskLevel: 'write',
		description:
			'Generate a response with the Responses API (input items, tools, reasoning); spends Mistral credits',
	},
	'responses.countInputTokens': {
		riskLevel: 'read',
		description:
			'Count the input tokens a responses.create call would use, without running it',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof mistralAiEndpointsNested
>;

export const mistralAiAuthConfig = {
	api_key: {
		// Only the API key: no webhooks, so no account field to collect.
		account: [] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseMistralAiPlugin<T extends MistralAiPluginOptions> =
	CorsairPlugin<
		'mistralai',
		typeof MistralAiSchema,
		typeof mistralAiEndpointsNested,
		typeof mistralAiWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalMistralAiPlugin =
	BaseMistralAiPlugin<MistralAiPluginOptions>;

export type ExternalMistralAiPlugin<T extends MistralAiPluginOptions> =
	BaseMistralAiPlugin<T>;

/**
 * The plugin's handlers with the caller's merged in. Core uses the first
 * handler that matches, and DEFAULT matches everything, so DEFAULT is taken
 * out of both and added last: built-in specific handlers, then the caller's,
 * then the caller's DEFAULT or the built-in one. Re-assigning DEFAULT after
 * spreading the caller's object would keep its key where the caller put it.
 */
function mergeErrorHandlers(
	custom: CorsairErrorHandler | undefined,
): CorsairErrorHandler {
	const { DEFAULT: builtInDefault, ...builtIn } = errorHandlers;
	const { DEFAULT: customDefault, ...customSpecific } = custom ?? {};
	return {
		...builtIn,
		...customSpecific,
		DEFAULT: customDefault ?? builtInDefault,
	};
}

export function mistralai<const T extends MistralAiPluginOptions>(
	incomingOptions: MistralAiPluginOptions & T = {} as MistralAiPluginOptions &
		T,
): ExternalMistralAiPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'mistralai',
		authConfig: mistralAiAuthConfig,
		schema: MistralAiSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: mistralAiEndpointsNested,
		webhooks: mistralAiWebhooksNested,
		endpointMeta: mistralAiEndpointMeta,
		endpointSchemas: mistralAiEndpointSchemas,
		webhookSchemas: mistralAiWebhookSchemas,
		// This plugin declares no webhooks.
		pluginWebhookMatcher: () => false,
		pluginTenantWebhookMatcher: () => null,
		oauthWebhookTenantLinkResolver: () => null,
		errorHandlers: mergeErrorHandlers(options.errorHandlers),
		keyBuilder: async (ctx: MistralAiKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				return res ?? '';
			}

			return '';
		},
	} satisfies InternalMistralAiPlugin;
}

export { MistralAiAPIError } from './client';
export type {
	MistralAiEndpointInputs,
	MistralAiEndpointOutputs,
	MistralAiOperation,
} from './endpoints/types';
export {
	BATCH_JOB_STATUSES,
	MistralAiEndpointInputSchemas,
	MistralAiEndpointOutputSchemas,
} from './endpoints/types';
