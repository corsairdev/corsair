import type {
	AuthTypes,
	BindEndpoints,
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
import { Account, Send } from './endpoints';
import {
	DocupostEndpointInputSchemas,
	DocupostEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { DocupostSchema } from './schema';

export type DocupostPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalDocupostPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof docupostEndpointsNested>;
};

export type DocupostContext = CorsairPluginContext<
	typeof DocupostSchema,
	DocupostPluginOptions
>;

export type DocupostKeyBuilderContext =
	KeyBuilderContext<DocupostPluginOptions>;

export type DocupostBoundEndpoints = BindEndpoints<
	typeof docupostEndpointsNested
>;

const docupostEndpointsNested = {
	account: Account,
	send: Send,
} as const;

export const docupostEndpointSchemas = {
	'account.balance': {
		input: DocupostEndpointInputSchemas.accountBalance,
		output: DocupostEndpointOutputSchemas.accountBalance,
	},
	'send.letter': {
		input: DocupostEndpointInputSchemas.sendLetter,
		output: DocupostEndpointOutputSchemas.sendLetter,
	},
	'send.postcard': {
		input: DocupostEndpointInputSchemas.sendPostcard,
		output: DocupostEndpointOutputSchemas.sendPostcard,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof docupostEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const docupostEndpointMeta = {
	'account.balance': {
		riskLevel: 'read',
		description: 'Fetch the remaining DocuPost account balance',
	},
	'send.letter': {
		riskLevel: 'write',
		description: 'Send a physical letter through DocuPost',
	},
	'send.postcard': {
		riskLevel: 'write',
		description: 'Send a physical postcard through DocuPost',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof docupostEndpointsNested>;

export const docupostAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseDocupostPlugin<T extends DocupostPluginOptions> = CorsairPlugin<
	'docupost',
	typeof DocupostSchema,
	typeof docupostEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalDocupostPlugin = BaseDocupostPlugin<DocupostPluginOptions>;

export type ExternalDocupostPlugin<T extends DocupostPluginOptions> =
	BaseDocupostPlugin<T>;

export function docupost<const T extends DocupostPluginOptions>(
	incomingOptions: DocupostPluginOptions & T = {} as DocupostPluginOptions & T,
): ExternalDocupostPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'docupost',
		authConfig: docupostAuthConfig,
		schema: DocupostSchema,
		options: options,
		hooks: options.hooks,
		endpoints: docupostEndpointsNested,
		webhooks: {},
		endpointMeta: docupostEndpointMeta,
		endpointSchemas: docupostEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: DocupostKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();
				if (key) return key;
			}

			throw new AuthMissingError('docupost', 'api_key');
		},
	} satisfies InternalDocupostPlugin;
}

export type {
	AccountBalanceInput,
	AccountBalanceResponse,
	DocupostEndpointInputs,
	DocupostEndpointOutputs,
	SendLetterInput,
	SendLetterResponse,
	SendPostcardInput,
	SendPostcardResponse,
} from './endpoints/types';
