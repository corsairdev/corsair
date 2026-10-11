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
import { Code, File } from './endpoints';
import type {
	CodeInterpreterEndpointInputs,
	CodeInterpreterEndpointOutputs,
} from './endpoints/types';
import {
	CodeInterpreterEndpointInputSchemas,
	CodeInterpreterEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { CodeInterpreterSchema } from './schema';

// The provider exposes no webhook surface, so this plugin ships no webhooks.
// Auth is api_key only: the provider accepts the key in the `x-api-key`
// header on API-key-compatible deployments (see client.ts).
export type CodeInterpreterPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	baseUrl?: string;
	hooks?: InternalCodeInterpreterPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof codeInterpreterEndpointsNested>;
};

export type CodeInterpreterContext = CorsairPluginContext<
	typeof CodeInterpreterSchema,
	CodeInterpreterPluginOptions
>;

export type CodeInterpreterKeyBuilderContext =
	KeyBuilderContext<CodeInterpreterPluginOptions>;

export type CodeInterpreterBoundEndpoints = BindEndpoints<
	typeof codeInterpreterEndpointsNested
>;

type CodeInterpreterEndpoint<K extends keyof CodeInterpreterEndpointOutputs> =
	CorsairEndpoint<
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
} as const satisfies RequiredPluginEndpointSchemas<
	typeof codeInterpreterEndpointsNested
>;

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
} as const satisfies RequiredPluginEndpointMeta<
	typeof codeInterpreterEndpointsNested
>;

export const codeInterpreterAuthConfig = {
	api_key: {
		account: ['session_id', 'tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseCodeInterpreterPlugin<T extends CodeInterpreterPluginOptions> =
	CorsairPlugin<
		'codeinterpreter',
		typeof CodeInterpreterSchema,
		typeof codeInterpreterEndpointsNested,
		Record<string, never>,
		T,
		typeof defaultAuthType
	>;

export type InternalCodeInterpreterPlugin =
	BaseCodeInterpreterPlugin<CodeInterpreterPluginOptions>;

export type ExternalCodeInterpreterPlugin<
	T extends CodeInterpreterPluginOptions,
> = BaseCodeInterpreterPlugin<T>;

export function codeinterpreter<const T extends CodeInterpreterPluginOptions>(
	incomingOptions: CodeInterpreterPluginOptions &
		T = {} as CodeInterpreterPluginOptions & T,
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
		endpoints: codeInterpreterEndpointsNested,
		webhooks: {},
		endpointMeta: codeInterpreterEndpointMeta,
		endpointSchemas: codeInterpreterEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: CodeInterpreterKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				return res ?? '';
			}

			return '';
		},
	} satisfies InternalCodeInterpreterPlugin;
}

export type {
	CodeInterpreterEndpointInputs,
	CodeInterpreterEndpointOutputs,
	DeleteFileInput,
	DeleteFileResponse,
	DownloadFileInput,
	DownloadFileResponse,
	ExecuteCodeInput,
	ExecuteCodeResponse,
	ListFilesInput,
	ListFilesResponse,
	UploadFileInput,
	UploadFileResponse,
} from './endpoints/types';
