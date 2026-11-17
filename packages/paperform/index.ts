import type {
	AuthTypes,
	CorsairErrorHandler,
	CorsairPlugin,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import type { PaperformContext } from './context';
import {
	getSpace,
	listForms,
	listSpaceForms,
	listSpaces,
	listTranslations,
} from './endpoints';
import {
	EmptyInputSchema,
	FormListResponseSchema,
	IdInputSchema,
	SpaceListResponseSchema,
	SpaceResponseSchema,
	TranslationListResponseSchema,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { PaperformSchema } from './schema';

export type { PaperformContext };

export type PaperformPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalPaperformPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof paperformEndpointsNested>;
};

export type PaperformKeyBuilderContext =
	KeyBuilderContext<PaperformPluginOptions>;

const paperformEndpointsNested = {
	forms: { list: listForms },
	spaces: { list: listSpaces, get: getSpace, forms: listSpaceForms },
	translations: { list: listTranslations },
} as const;

const paperformWebhooksNested = {} as const;

export const paperformEndpointSchemas = {
	'forms.list': { input: EmptyInputSchema, output: FormListResponseSchema },
	'spaces.list': { input: EmptyInputSchema, output: SpaceListResponseSchema },
	'spaces.get': { input: IdInputSchema, output: SpaceResponseSchema },
	'spaces.forms': { input: IdInputSchema, output: FormListResponseSchema },
	'translations.list': {
		input: EmptyInputSchema,
		output: TranslationListResponseSchema,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof paperformEndpointsNested
>;

const read = (description: string) =>
	({ riskLevel: 'read', description }) as const;

const paperformEndpointMeta = {
	'forms.list': read('List forms. Submission answers are not read.'),
	'spaces.list': read('List spaces.'),
	'spaces.get': read('Read one space.'),
	'spaces.forms': read('List forms in one space.'),
	'translations.list': read(
		'List translations. The mapping text is not stored.',
	),
} as const satisfies RequiredPluginEndpointMeta<
	typeof paperformEndpointsNested
>;

const defaultAuthType = 'api_key' as const satisfies AuthTypes;

export const paperformAuthConfig = {
	api_key: { account: [] as const },
} as const satisfies PluginAuthConfig;

export type BasePaperformPlugin<T extends PaperformPluginOptions> =
	CorsairPlugin<
		'paperform',
		typeof PaperformSchema,
		typeof paperformEndpointsNested,
		typeof paperformWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalPaperformPlugin =
	BasePaperformPlugin<PaperformPluginOptions>;
export type ExternalPaperformPlugin<T extends PaperformPluginOptions> =
	BasePaperformPlugin<T>;

export function paperform<const T extends PaperformPluginOptions>(
	incomingOptions: PaperformPluginOptions & T = {} as PaperformPluginOptions &
		T,
): ExternalPaperformPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'paperform',
		authConfig: paperformAuthConfig,
		schema: PaperformSchema,
		options,
		hooks: options.hooks,
		endpoints: paperformEndpointsNested,
		webhooks: paperformWebhooksNested,
		endpointMeta: paperformEndpointMeta,
		endpointSchemas: paperformEndpointSchemas,
		errorHandlers: { ...errorHandlers, ...options.errorHandlers },
		keyBuilder: async (ctx: PaperformKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) return options.key;
			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();
				return key ?? '';
			}
			return '';
		},
	} satisfies InternalPaperformPlugin;
}
