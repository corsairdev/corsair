import type {
	BindEndpoints,
	BindWebhooks,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	CorsairWebhook,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
	RequiredPluginWebhookSchemas,
} from 'corsair/core';
import type { AuthTypes } from 'corsair/core';
import type { CodeInterpreterEndpointInputs, CodeInterpreterEndpointOutputs } from './endpoints/types';
import { CodeInterpreterEndpointInputSchemas, CodeInterpreterEndpointOutputSchemas } from './endpoints/types';
import type {
	CodeInterpreterWebhookOutputs,
	ExecutionCompletedEvent,
	ExecutionFailedEvent,
	FileReadyEvent,
} from './webhooks/types';
import {
	ExecutionCompletedEventSchema,
	ExecutionFailedEventSchema,
	FileReadyEventSchema,
} from './webhooks/types';
import { Code, File } from './endpoints';
import { CodeInterpreterSchema } from './schema';
import { ExecutionWebhooks, FileWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';
import { matchCodeInterpreterTenantWebhook } from './webhooks/tenant-matcher';
import { resolveCodeInterpreterOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';

export type CodeInterpreterPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalCodeInterpreterPlugin['hooks'];
	webhookHooks?: InternalCodeInterpreterPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof codeInterpreterEndpointsNested>;
};

export type CodeInterpreterContext = CorsairPluginContext<
	typeof CodeInterpreterSchema,
	CodeInterpreterPluginOptions
>;

export type CodeInterpreterKeyBuilderContext = KeyBuilderContext<CodeInterpreterPluginOptions>;

export type CodeInterpreterBoundEndpoints = BindEndpoints<typeof codeInterpreterEndpointsNested>;

type CodeInterpreterEndpoint<
	K extends keyof CodeInterpreterEndpointOutputs,
> = CorsairEndpoint<
	CodeInterpreterContext,
	CodeInterpreterEndpointInputs[K],
	CodeInterpreterEndpointOutputs[K]
>;

export type CodeInterpreterEndpoints = {
	executeCode: CodeInterpreterEndpoint<'executeCode'>;
	uploadFile: CodeInterpreterEndpoint<'uploadFile'>;
	listFiles: CodeInterpreterEndpoint<'listFiles'>;
	downloadFile: CodeInterpreterEndpoint<'downloadFile'>;
	deleteFile: CodeInterpreterEndpoint<'deleteFile'>;
};

type CodeInterpreterWebhook<
	K extends keyof CodeInterpreterWebhookOutputs,
	TEvent,
> = CorsairWebhook<CodeInterpreterContext, TEvent, CodeInterpreterWebhookOutputs[K]>;

export type CodeInterpreterWebhooks = {
	executionCompleted: CodeInterpreterWebhook<'executionCompleted', ExecutionCompletedEvent>;
	executionFailed: CodeInterpreterWebhook<'executionFailed', ExecutionFailedEvent>;
	fileReady: CodeInterpreterWebhook<'fileReady', FileReadyEvent>;
};

export type CodeInterpreterBoundWebhooks = BindWebhooks<CodeInterpreterWebhooks>;

const codeInterpreterEndpointsNested = {
	code: {
		execute: Code.execute,
	},
	file: {
		upload: File.upload,
		list: File.list,
		download: File.download,
		delete: File.delete,
	},
} as const;

const codeInterpreterWebhooksNested = {
	execution: {
		completed: ExecutionWebhooks.completed,
		failed: ExecutionWebhooks.failed,
	},
	file: {
		ready: FileWebhooks.ready,
	},
} as const;

export const codeInterpreterEndpointSchemas = {
	'code.execute': {
		input: CodeInterpreterEndpointInputSchemas.executeCode,
		output: CodeInterpreterEndpointOutputSchemas.executeCode,
	},
	'file.upload': {
		input: CodeInterpreterEndpointInputSchemas.uploadFile,
		output: CodeInterpreterEndpointOutputSchemas.uploadFile,
	},
	'file.list': {
		input: CodeInterpreterEndpointInputSchemas.listFiles,
		output: CodeInterpreterEndpointOutputSchemas.listFiles,
	},
	'file.download': {
		input: CodeInterpreterEndpointInputSchemas.downloadFile,
		output: CodeInterpreterEndpointOutputSchemas.downloadFile,
	},
	'file.delete': {
		input: CodeInterpreterEndpointInputSchemas.deleteFile,
		output: CodeInterpreterEndpointOutputSchemas.deleteFile,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof codeInterpreterEndpointsNested>;

const codeInterpreterWebhookSchemas = {
	'execution.completed': {
		description: 'Code execution completed successfully',
		payload: ExecutionCompletedEventSchema,
		response: ExecutionCompletedEventSchema,
	},
	'execution.failed': {
		description: 'Code execution failed with an error',
		payload: ExecutionFailedEventSchema,
		response: ExecutionFailedEventSchema,
	},
	'file.ready': {
		description: 'A file is processed and ready in the sandbox',
		payload: FileReadyEventSchema,
		response: FileReadyEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof codeInterpreterWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const codeInterpreterEndpointMeta = {
	'code.execute': {
		riskLevel: 'write',
		description: 'Execute code in the sandbox',
	},
	'file.upload': {
		riskLevel: 'write',
		description: 'Upload a file to the sandbox',
	},
	'file.list': {
		riskLevel: 'read',
		description: 'List files in the sandbox',
	},
	'file.download': {
		riskLevel: 'read',
		description: 'Download a file from the sandbox',
	},
	'file.delete': {
		riskLevel: 'destructive',
		description: 'Delete a file from the sandbox',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof codeInterpreterEndpointsNested>;

export const codeInterpreterAuthConfig = {
	api_key: {
		account: ['session_id', 'tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['session_id', 'tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseCodeInterpreterPlugin<T extends CodeInterpreterPluginOptions> = CorsairPlugin<
	'codeinterpreter',
	typeof CodeInterpreterSchema,
	typeof codeInterpreterEndpointsNested,
	typeof codeInterpreterWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalCodeInterpreterPlugin = BaseCodeInterpreterPlugin<CodeInterpreterPluginOptions>;

export type ExternalCodeInterpreterPlugin<T extends CodeInterpreterPluginOptions> =
	BaseCodeInterpreterPlugin<T>;

export function codeinterpreter<const T extends CodeInterpreterPluginOptions>(
	incomingOptions: CodeInterpreterPluginOptions & T = {} as CodeInterpreterPluginOptions & T,
): ExternalCodeInterpreterPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'codeinterpreter',
		authConfig: codeInterpreterAuthConfig,
		schema: CodeInterpreterSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: codeInterpreterEndpointsNested,
		webhooks: codeInterpreterWebhooksNested,
		endpointMeta: codeInterpreterEndpointMeta,
		endpointSchemas: codeInterpreterEndpointSchemas,
		webhookSchemas: codeInterpreterWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			return 'x-webhook-signature' in headers || 'x-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchCodeInterpreterTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveCodeInterpreterOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: CodeInterpreterKeyBuilderContext, source) => {
			if (source === 'webhook' && options.webhookSecret) {
				return options.webhookSecret;
			}

			if (source === 'webhook') {
				const res = await ctx.keys.get_webhook_signature();
				return res ?? '';
			}

			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				return res ?? '';
			}

			if (source === 'endpoint' && ctx.authType === 'oauth_2') {
				const res = await ctx.keys.get_access_token();
				return res ?? '';
			}

			return '';
		},
	} satisfies InternalCodeInterpreterPlugin;
}

export type {
	ExecutionCompletedEvent,
	ExecutionFailedEvent,
	FileReadyEvent,
	CodeInterpreterWebhookOutputs,
} from './webhooks/types';

export type {
	CodeInterpreterEndpointInputs,
	CodeInterpreterEndpointOutputs,
	ExecuteCodeInput,
	ExecuteCodeResponse,
	UploadFileInput,
	UploadFileResponse,
	ListFilesInput,
	ListFilesResponse,
	DownloadFileInput,
	DownloadFileResponse,
	DeleteFileInput,
	DeleteFileResponse,
} from './endpoints/types';
