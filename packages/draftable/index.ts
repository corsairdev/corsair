import type {
	AuthTypes,
	BindEndpoints,
	CorsairErrorHandler,
	CorsairPlugin,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import type { DraftableContext } from './context';
import { Comparisons, Exports } from './endpoints';
import * as T from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { DraftableSchema } from './schema';

export type { DraftableContext };

export type DraftablePluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalDraftablePlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof draftableEndpointsNested>;
};

export type DraftableKeyBuilderContext =
	KeyBuilderContext<DraftablePluginOptions>;

const draftableEndpointsNested = {
	comparisons: Comparisons,
	exports: Exports,
} as const;

const draftableWebhooksNested = {} as const;

export type DraftableBoundEndpoints = BindEndpoints<
	typeof draftableEndpointsNested
>;

export const draftableEndpointSchemas = {
	'comparisons.list': {
		input: T.ListComparisonsInputSchema,
		output: T.ListComparisonsResponseSchema,
	},
	'comparisons.get': {
		input: T.GetComparisonInputSchema,
		output: T.GetComparisonResponseSchema,
	},
	'comparisons.create': {
		input: T.CreateComparisonInputSchema,
		output: T.CreateComparisonResponseSchema,
	},
	'comparisons.delete': {
		input: T.DeleteComparisonInputSchema,
		output: T.DeleteComparisonResponseSchema,
	},
	'comparisons.getViewerUrl': {
		input: T.GetViewerUrlInputSchema,
		output: T.GetViewerUrlResponseSchema,
	},
	'exports.create': {
		input: T.CreateExportInputSchema,
		output: T.CreateExportResponseSchema,
	},
	'exports.get': {
		input: T.GetExportInputSchema,
		output: T.GetExportResponseSchema,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof draftableEndpointsNested
>;

const draftableEndpointMeta = {
	'comparisons.list': {
		riskLevel: 'read',
		description: 'List the comparisons on the Draftable account.',
	},
	'comparisons.get': {
		riskLevel: 'read',
		description:
			'Get one comparison: both documents, page counts, and whether it is ready or failed.',
	},
	'comparisons.create': {
		riskLevel: 'destructive',
		description:
			'Compare two documents given by URL (PDF, Word, PowerPoint, RTF or text). Uses one comparison from the plan quota.',
	},
	'comparisons.delete': {
		riskLevel: 'destructive',
		description: 'Delete a comparison and its documents from Draftable.',
	},
	'comparisons.getViewerUrl': {
		riskLevel: 'read',
		description:
			'Get a link to view a comparison in the Draftable viewer, signed for a limited time unless the comparison is public.',
	},
	'exports.create': {
		riskLevel: 'write',
		description:
			'Start a PDF export of a comparison. Poll exports.get until ready, then download its url.',
	},
	'exports.get': {
		riskLevel: 'read',
		description:
			'Get an export: whether it is ready and the URL to download the PDF.',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof draftableEndpointsNested
>;

const defaultAuthType = 'api_key' as const satisfies AuthTypes;

export const draftableAuthConfig = {
	api_key: {
		account: [] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseDraftablePlugin<T extends DraftablePluginOptions> =
	CorsairPlugin<
		'draftable',
		typeof DraftableSchema,
		typeof draftableEndpointsNested,
		typeof draftableWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalDraftablePlugin =
	BaseDraftablePlugin<DraftablePluginOptions>;

export type ExternalDraftablePlugin<T extends DraftablePluginOptions> =
	BaseDraftablePlugin<T>;

export function draftable<const T extends DraftablePluginOptions>(
	incomingOptions: DraftablePluginOptions & T = {} as DraftablePluginOptions &
		T,
): ExternalDraftablePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'draftable',
		authConfig: draftableAuthConfig,
		schema: DraftableSchema,
		options,
		hooks: options.hooks,
		endpoints: draftableEndpointsNested,
		webhooks: draftableWebhooksNested,
		endpointMeta: draftableEndpointMeta,
		endpointSchemas: draftableEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: DraftableKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();
				if (!key) {
					throw new AuthMissingError('draftable', 'api_key');
				}
				return key;
			}

			return '';
		},
	} satisfies InternalDraftablePlugin;
}
