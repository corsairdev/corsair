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
import { Translate } from './endpoints';
import type {
	YandexEndpointInputs,
	YandexEndpointOutputs,
} from './endpoints/types';
import {
	YandexEndpointInputSchemas,
	YandexEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { YandexSchema } from './schema';

export type YandexPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalYandexPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof yandexEndpointsNested>;
};

export type YandexContext = CorsairPluginContext<
	typeof YandexSchema,
	YandexPluginOptions
>;

export type YandexKeyBuilderContext = KeyBuilderContext<YandexPluginOptions>;

export type YandexBoundEndpoints = BindEndpoints<typeof yandexEndpointsNested>;

type YandexEndpoint<K extends keyof YandexEndpointOutputs> = CorsairEndpoint<
	YandexContext,
	YandexEndpointInputs[K],
	YandexEndpointOutputs[K]
>;

export type YandexEndpoints = {
	translate: YandexEndpoint<'translate'>;
	detectLanguages: YandexEndpoint<'detectLanguages'>;
	listLanguages: YandexEndpoint<'listLanguages'>;
};

const yandexEndpointsNested = {
	translate: {
		text: Translate.translate,
	},
	detectLanguages: {
		run: Translate.detect,
	},
	listLanguages: {
		run: Translate.languages,
	},
} as const;

export const yandexEndpointSchemas = {
	'translate.text': {
		input: YandexEndpointInputSchemas.translate,
		output: YandexEndpointOutputSchemas.translate,
	},
	'detectLanguages.run': {
		input: YandexEndpointInputSchemas.detectLanguages,
		output: YandexEndpointOutputSchemas.detectLanguages,
	},
	'listLanguages.run': {
		input: YandexEndpointInputSchemas.listLanguages,
		output: YandexEndpointOutputSchemas.listLanguages,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof yandexEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const yandexEndpointMeta = {
	'translate.text': {
		riskLevel: 'read',
		description:
			'Translate up to 1,000 passages into a target language, detecting the source per passage when it is not given',
	},
	'detectLanguages.run': {
		riskLevel: 'read',
		description:
			'Detect the language of each passage, one result per entry and in order',
	},
	'listLanguages.run': {
		riskLevel: 'read',
		description:
			'List the supported languages, with their codes and display names',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof yandexEndpointsNested>;

export type BaseYandexPlugin<T extends YandexPluginOptions> = CorsairPlugin<
	'yandex',
	typeof YandexSchema,
	typeof yandexEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalYandexPlugin = BaseYandexPlugin<YandexPluginOptions>;

export type ExternalYandexPlugin<T extends YandexPluginOptions> =
	BaseYandexPlugin<T>;

export function yandex<const T extends YandexPluginOptions>(
	incomingOptions: YandexPluginOptions & T = {} as YandexPluginOptions & T,
): ExternalYandexPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'yandex',
		schema: YandexSchema,
		options: options,
		hooks: options.hooks,
		endpoints: yandexEndpointsNested,
		webhooks: {},
		endpointMeta: yandexEndpointMeta,
		endpointSchemas: yandexEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: YandexKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('yandex', ctx.authType ?? 'api_key');
		},
	} satisfies InternalYandexPlugin;
}

export {
	authHeader,
	folderHeader,
	isYandexFailure,
	YANDEX_AUTH_SCHEME,
	YANDEX_TRANSLATE_BASE,
	YandexAPIError,
} from './client';

export type {
	DetectInput,
	DetectOutput,
	LanguagesInput,
	LanguagesOutput,
	TranslateInput,
	TranslateOutput,
	YandexEndpointInputs,
	YandexEndpointOutputs,
	YandexTranslation,
} from './endpoints/types';
