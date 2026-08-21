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
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import {
	Assistants,
	Batches,
	Billing,
	Chat,
	Luma,
	Messages,
	Models,
	Responses,
	RunSteps,
	Runs,
	Threads,
} from './endpoints';
import type {
	AimlApiEndpointInputs,
	AimlApiEndpointOutputs,
} from './endpoints/types';
import {
	AimlApiEndpointInputSchemas,
	AimlApiEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { AimlApiSchema } from './schema';

export type AimlApiPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalAimlApiPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof aimlApiEndpointsNested>;
};

export type AimlApiContext = CorsairPluginContext<
	typeof AimlApiSchema,
	AimlApiPluginOptions
>;

export type AimlApiKeyBuilderContext = KeyBuilderContext<AimlApiPluginOptions>;

export type AimlApiBoundEndpoints = BindEndpoints<
	typeof aimlApiEndpointsNested
>;

type AimlApiEndpoint<K extends keyof AimlApiEndpointOutputs> = CorsairEndpoint<
	AimlApiContext,
	AimlApiEndpointInputs[K],
	AimlApiEndpointOutputs[K]
>;

export type AimlApiEndpoints = {
	modelsList: AimlApiEndpoint<'modelsList'>;
	modelsListWithDetails: AimlApiEndpoint<'modelsListWithDetails'>;
	chatCreateCompletion: AimlApiEndpoint<'chatCreateCompletion'>;
	responsesGet: AimlApiEndpoint<'responsesGet'>;
	assistantsCreate: AimlApiEndpoint<'assistantsCreate'>;
	assistantsList: AimlApiEndpoint<'assistantsList'>;
	assistantsGet: AimlApiEndpoint<'assistantsGet'>;
	assistantsUpdate: AimlApiEndpoint<'assistantsUpdate'>;
	assistantsDelete: AimlApiEndpoint<'assistantsDelete'>;
	threadsCreate: AimlApiEndpoint<'threadsCreate'>;
	threadsGet: AimlApiEndpoint<'threadsGet'>;
	threadsUpdate: AimlApiEndpoint<'threadsUpdate'>;
	threadsDelete: AimlApiEndpoint<'threadsDelete'>;
	messagesCreate: AimlApiEndpoint<'messagesCreate'>;
	messagesList: AimlApiEndpoint<'messagesList'>;
	messagesGet: AimlApiEndpoint<'messagesGet'>;
	messagesUpdate: AimlApiEndpoint<'messagesUpdate'>;
	messagesDelete: AimlApiEndpoint<'messagesDelete'>;
	runsCreate: AimlApiEndpoint<'runsCreate'>;
	runsList: AimlApiEndpoint<'runsList'>;
	runsGet: AimlApiEndpoint<'runsGet'>;
	runsUpdate: AimlApiEndpoint<'runsUpdate'>;
	runsCancel: AimlApiEndpoint<'runsCancel'>;
	runsSubmitToolOutputs: AimlApiEndpoint<'runsSubmitToolOutputs'>;
	runStepsList: AimlApiEndpoint<'runStepsList'>;
	runStepsGet: AimlApiEndpoint<'runStepsGet'>;
	billingGetBalance: AimlApiEndpoint<'billingGetBalance'>;
	batchesList: AimlApiEndpoint<'batchesList'>;
	lumaGetGeneration: AimlApiEndpoint<'lumaGetGeneration'>;
};

const aimlApiEndpointsNested = {
	models: {
		list: Models.list,
		listWithDetails: Models.listWithDetails,
	},
	chat: {
		createCompletion: Chat.createCompletion,
	},
	responses: {
		get: Responses.get,
	},
	assistants: {
		create: Assistants.create,
		list: Assistants.list,
		get: Assistants.get,
		update: Assistants.update,
		delete: Assistants.delete_,
	},
	threads: {
		create: Threads.create,
		get: Threads.get,
		update: Threads.update,
		delete: Threads.delete_,
	},
	messages: {
		create: Messages.create,
		list: Messages.list,
		get: Messages.get,
		update: Messages.update,
		delete: Messages.delete_,
	},
	runs: {
		create: Runs.create,
		list: Runs.list,
		get: Runs.get,
		update: Runs.update,
		cancel: Runs.cancel,
		submitToolOutputs: Runs.submitToolOutputs,
	},
	runSteps: {
		list: RunSteps.list,
		get: RunSteps.get,
	},
	billing: {
		getBalance: Billing.getBalance,
	},
	batches: {
		list: Batches.list,
	},
	luma: {
		getGeneration: Luma.getGeneration,
	},
} as const;

export const aimlApiEndpointSchemas = {
	'models.list': {
		input: AimlApiEndpointInputSchemas.modelsList,
		output: AimlApiEndpointOutputSchemas.modelsList,
	},
	'models.listWithDetails': {
		input: AimlApiEndpointInputSchemas.modelsListWithDetails,
		output: AimlApiEndpointOutputSchemas.modelsListWithDetails,
	},
	'chat.createCompletion': {
		input: AimlApiEndpointInputSchemas.chatCreateCompletion,
		output: AimlApiEndpointOutputSchemas.chatCreateCompletion,
	},
	'responses.get': {
		input: AimlApiEndpointInputSchemas.responsesGet,
		output: AimlApiEndpointOutputSchemas.responsesGet,
	},
	'assistants.create': {
		input: AimlApiEndpointInputSchemas.assistantsCreate,
		output: AimlApiEndpointOutputSchemas.assistantsCreate,
	},
	'assistants.list': {
		input: AimlApiEndpointInputSchemas.assistantsList,
		output: AimlApiEndpointOutputSchemas.assistantsList,
	},
	'assistants.get': {
		input: AimlApiEndpointInputSchemas.assistantsGet,
		output: AimlApiEndpointOutputSchemas.assistantsGet,
	},
	'assistants.update': {
		input: AimlApiEndpointInputSchemas.assistantsUpdate,
		output: AimlApiEndpointOutputSchemas.assistantsUpdate,
	},
	'assistants.delete': {
		input: AimlApiEndpointInputSchemas.assistantsDelete,
		output: AimlApiEndpointOutputSchemas.assistantsDelete,
	},
	'threads.create': {
		input: AimlApiEndpointInputSchemas.threadsCreate,
		output: AimlApiEndpointOutputSchemas.threadsCreate,
	},
	'threads.get': {
		input: AimlApiEndpointInputSchemas.threadsGet,
		output: AimlApiEndpointOutputSchemas.threadsGet,
	},
	'threads.update': {
		input: AimlApiEndpointInputSchemas.threadsUpdate,
		output: AimlApiEndpointOutputSchemas.threadsUpdate,
	},
	'threads.delete': {
		input: AimlApiEndpointInputSchemas.threadsDelete,
		output: AimlApiEndpointOutputSchemas.threadsDelete,
	},
	'messages.create': {
		input: AimlApiEndpointInputSchemas.messagesCreate,
		output: AimlApiEndpointOutputSchemas.messagesCreate,
	},
	'messages.list': {
		input: AimlApiEndpointInputSchemas.messagesList,
		output: AimlApiEndpointOutputSchemas.messagesList,
	},
	'messages.get': {
		input: AimlApiEndpointInputSchemas.messagesGet,
		output: AimlApiEndpointOutputSchemas.messagesGet,
	},
	'messages.update': {
		input: AimlApiEndpointInputSchemas.messagesUpdate,
		output: AimlApiEndpointOutputSchemas.messagesUpdate,
	},
	'messages.delete': {
		input: AimlApiEndpointInputSchemas.messagesDelete,
		output: AimlApiEndpointOutputSchemas.messagesDelete,
	},
	'runs.create': {
		input: AimlApiEndpointInputSchemas.runsCreate,
		output: AimlApiEndpointOutputSchemas.runsCreate,
	},
	'runs.list': {
		input: AimlApiEndpointInputSchemas.runsList,
		output: AimlApiEndpointOutputSchemas.runsList,
	},
	'runs.get': {
		input: AimlApiEndpointInputSchemas.runsGet,
		output: AimlApiEndpointOutputSchemas.runsGet,
	},
	'runs.update': {
		input: AimlApiEndpointInputSchemas.runsUpdate,
		output: AimlApiEndpointOutputSchemas.runsUpdate,
	},
	'runs.cancel': {
		input: AimlApiEndpointInputSchemas.runsCancel,
		output: AimlApiEndpointOutputSchemas.runsCancel,
	},
	'runs.submitToolOutputs': {
		input: AimlApiEndpointInputSchemas.runsSubmitToolOutputs,
		output: AimlApiEndpointOutputSchemas.runsSubmitToolOutputs,
	},
	'runSteps.list': {
		input: AimlApiEndpointInputSchemas.runStepsList,
		output: AimlApiEndpointOutputSchemas.runStepsList,
	},
	'runSteps.get': {
		input: AimlApiEndpointInputSchemas.runStepsGet,
		output: AimlApiEndpointOutputSchemas.runStepsGet,
	},
	'billing.getBalance': {
		input: AimlApiEndpointInputSchemas.billingGetBalance,
		output: AimlApiEndpointOutputSchemas.billingGetBalance,
	},
	'batches.list': {
		input: AimlApiEndpointInputSchemas.batchesList,
		output: AimlApiEndpointOutputSchemas.batchesList,
	},
	'luma.getGeneration': {
		input: AimlApiEndpointInputSchemas.lumaGetGeneration,
		output: AimlApiEndpointOutputSchemas.lumaGetGeneration,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof aimlApiEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const aimlApiEndpointMeta = {
	'models.list': {
		riskLevel: 'read',
		description: 'List models currently available to the AIMLAPI account.',
	},
	'models.listWithDetails': {
		riskLevel: 'read',
		description: 'List models with pagination metadata and expanded details.',
	},
	'chat.createCompletion': {
		riskLevel: 'write',
		description:
			'Generate a chat completion using an AIMLAPI-compatible model.',
	},
	'responses.get': {
		riskLevel: 'read',
		description: 'Retrieve a response by ID.',
	},
	'assistants.create': {
		riskLevel: 'write',
		description: 'Create a new AIMLAPI assistant.',
	},
	'assistants.list': {
		riskLevel: 'read',
		description: 'List configured assistants.',
	},
	'assistants.get': {
		riskLevel: 'read',
		description: 'Retrieve an assistant by ID.',
	},
	'assistants.update': {
		riskLevel: 'write',
		description: 'Update an assistant definition.',
	},
	'assistants.delete': {
		riskLevel: 'write',
		description: 'Delete an assistant.',
	},
	'threads.create': {
		riskLevel: 'write',
		description: 'Create an AIMLAPI thread.',
	},
	'threads.get': {
		riskLevel: 'read',
		description: 'Retrieve a thread by ID.',
	},
	'threads.update': {
		riskLevel: 'write',
		description: 'Update thread metadata or resources.',
	},
	'threads.delete': {
		riskLevel: 'write',
		description: 'Delete a thread.',
	},
	'messages.create': {
		riskLevel: 'write',
		description: 'Create a message in a thread.',
	},
	'messages.list': {
		riskLevel: 'read',
		description: 'List messages in a thread.',
	},
	'messages.get': {
		riskLevel: 'read',
		description: 'Retrieve a message by ID.',
	},
	'messages.update': {
		riskLevel: 'write',
		description: 'Update a message.',
	},
	'messages.delete': {
		riskLevel: 'write',
		description: 'Delete a message.',
	},
	'runs.create': {
		riskLevel: 'write',
		description: 'Create a run for a thread and assistant.',
	},
	'runs.list': {
		riskLevel: 'read',
		description: 'List runs for a thread.',
	},
	'runs.get': {
		riskLevel: 'read',
		description: 'Retrieve a run by ID.',
	},
	'runs.update': {
		riskLevel: 'write',
		description: 'Update a run.',
	},
	'runs.cancel': {
		riskLevel: 'write',
		description: 'Cancel an in-progress run.',
	},
	'runs.submitToolOutputs': {
		riskLevel: 'write',
		description: 'Submit tool outputs for a run.',
	},
	'runSteps.list': {
		riskLevel: 'read',
		description: 'List run steps for a run.',
	},
	'runSteps.get': {
		riskLevel: 'read',
		description: 'Retrieve a single run step.',
	},
	'billing.getBalance': {
		riskLevel: 'read',
		description: 'Retrieve account billing balance.',
	},
	'batches.list': {
		riskLevel: 'read',
		description: 'List or retrieve batch processing status and results.',
	},
	'luma.getGeneration': {
		riskLevel: 'read',
		description: 'Retrieve a Luma video generation by ID.',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof aimlApiEndpointsNested>;

export const aimlApiAuthConfig = {
	api_key: {
		account: ['one'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseAimlApiPlugin<T extends AimlApiPluginOptions> = CorsairPlugin<
	'aimlapi',
	typeof AimlApiSchema,
	typeof aimlApiEndpointsNested,
	{},
	T,
	typeof defaultAuthType,
	typeof aimlApiAuthConfig
>;

export type InternalAimlApiPlugin = BaseAimlApiPlugin<AimlApiPluginOptions>;

export type ExternalAimlApiPlugin<T extends AimlApiPluginOptions> =
	BaseAimlApiPlugin<T>;

export function aimlapi<const T extends AimlApiPluginOptions>(
	incomingOptions: AimlApiPluginOptions & T = {} as AimlApiPluginOptions & T,
): ExternalAimlApiPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'aimlapi',
		schema: AimlApiSchema,
		options,
		hooks: options.hooks,
		endpoints: aimlApiEndpointsNested,
		webhooks: {},
		endpointMeta: aimlApiEndpointMeta,
		endpointSchemas: aimlApiEndpointSchemas,
		authConfig: aimlApiAuthConfig,
		pluginWebhookMatcher: () => false,
		errorHandlers: (() => {
			const { DEFAULT: defaultHandler, ...specificDefaults } = errorHandlers;
			return {
				...specificDefaults,
				...(options.errorHandlers || {}),
				DEFAULT: options.errorHandlers?.DEFAULT || defaultHandler,
			};
		})(),
		keyBuilder: async (ctx: AimlApiKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();
				if (!key) {
					throw new AuthMissingError('aimlapi', 'api_key');
				}
				return key;
			}

			throw new AuthMissingError('aimlapi', 'api_key');
		},
	} satisfies InternalAimlApiPlugin;
}

export type {
	AimlApiEndpointInputs,
	AimlApiEndpointOutputs,
} from './endpoints/types';

export {
	AimlApiEndpointInputSchemas,
	AimlApiEndpointOutputSchemas,
} from './endpoints/types';
