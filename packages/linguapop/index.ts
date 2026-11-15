import type {
	BindEndpoints,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import { Invitations, Languages } from './endpoints';
import type {
	LinguapopEndpointInputs,
	LinguapopEndpointOutputs,
} from './endpoints/types';
import {
	LinguapopEndpointInputSchemas,
	LinguapopEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { LinguapopSchema } from './schema';

export type LinguapopPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalLinguapopPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof linguapopEndpointsNested>;
};

export type LinguapopContext = CorsairPluginContext<
	typeof LinguapopSchema,
	LinguapopPluginOptions
>;

export type LinguapopKeyBuilderContext =
	KeyBuilderContext<LinguapopPluginOptions>;

export type LinguapopBoundEndpoints = BindEndpoints<
	typeof linguapopEndpointsNested
>;

type LinguapopEndpoint<K extends keyof LinguapopEndpointOutputs> =
	CorsairEndpoint<
		LinguapopContext,
		LinguapopEndpointInputs[K],
		LinguapopEndpointOutputs[K]
	>;

export type LinguapopEndpoints = {
	languagesList: LinguapopEndpoint<'languagesList'>;
	invitationsCreate: LinguapopEndpoint<'invitationsCreate'>;
};

const linguapopEndpointsNested = {
	languages: {
		list: Languages.list,
	},
	invitations: {
		create: Invitations.create,
	},
} as const;

export const linguapopEndpointSchemas = {
	'languages.list': {
		input: LinguapopEndpointInputSchemas.languagesList,
		output: LinguapopEndpointOutputSchemas.languagesList,
	},
	'invitations.create': {
		input: LinguapopEndpointInputSchemas.invitationsCreate,
		output: LinguapopEndpointOutputSchemas.invitationsCreate,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof linguapopEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const linguapopEndpointMeta = {
	'languages.list': {
		riskLevel: 'read',
		description:
			'List the languages Linguapop can test, each with the code to pass as languageCode when creating an invitation',
	},
	'invitations.create': {
		riskLevel: 'write',
		irreversible: true,
		description:
			'Create a placement test invitation for a candidate and return the test link; with sendEmail true, Linguapop emails the invitation to the candidate. Needs a paid Linguapop subscription, the invitation cannot be cancelled through the API, and completed tests are billed',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof linguapopEndpointsNested
>;

export type BaseLinguapopPlugin<T extends LinguapopPluginOptions> =
	CorsairPlugin<
		'linguapop',
		typeof LinguapopSchema,
		typeof linguapopEndpointsNested,
		{},
		T,
		typeof defaultAuthType
	>;

export type InternalLinguapopPlugin =
	BaseLinguapopPlugin<LinguapopPluginOptions>;

export type ExternalLinguapopPlugin<T extends LinguapopPluginOptions> =
	BaseLinguapopPlugin<T>;

export function linguapop<const T extends LinguapopPluginOptions>(
	incomingOptions: LinguapopPluginOptions & T = {} as LinguapopPluginOptions &
		T,
): ExternalLinguapopPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'linguapop',
		schema: LinguapopSchema,
		options: options,
		hooks: options.hooks,
		endpoints: linguapopEndpointsNested,
		// Linguapop's result callback is an unsigned POST to a URL the caller
		// names in `callbackUrl`; nothing is delivered to Corsair.
		webhooks: {},
		endpointMeta: linguapopEndpointMeta,
		endpointSchemas: linguapopEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: LinguapopKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('linguapop', ctx.authType ?? 'api_key');
		},
	} satisfies InternalLinguapopPlugin;
}

export { LinguapopAPIError } from './client';

export type {
	InvitationsCreateInput,
	InvitationsCreateResponse,
	LanguagesListInput,
	LanguagesListResponse,
	LinguapopEndpointInputs,
	LinguapopEndpointOutputs,
	LinguapopLanguage,
} from './endpoints/types';
