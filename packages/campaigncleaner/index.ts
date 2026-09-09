import type {
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
import { CampaignCleanerEndpoints } from './endpoints';
import type {
	CampaignCleanerEndpointInputs,
	CampaignCleanerEndpointOutputs,
} from './endpoints/types';
import {
	CampaignCleanerEndpointInputSchemas,
	CampaignCleanerEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { CampaignCleanerSchema } from './schema';

export type CampaignCleanerPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalCampaignCleanerPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof campaignCleanerEndpointsNested>;
};

export type CampaignCleanerContext = CorsairPluginContext<
	typeof CampaignCleanerSchema,
	CampaignCleanerPluginOptions
>;
export type CampaignCleanerKeyBuilderContext =
	KeyBuilderContext<CampaignCleanerPluginOptions>;
export type CampaignCleanerBoundEndpoints = BindEndpoints<
	typeof campaignCleanerEndpointsNested
>;

type CampaignCleanerEndpoint<K extends keyof CampaignCleanerEndpointOutputs> = (
	ctx: CampaignCleanerContext,
	input: CampaignCleanerEndpointInputs[K],
) => Promise<CampaignCleanerEndpointOutputs[K]>;

export type CampaignCleanerEndpoints = {
	deleteCampaign: CampaignCleanerEndpoint<'deleteCampaign'>;
	getCampaignList: CampaignCleanerEndpoint<'getCampaignList'>;
	getCampaignStatus: CampaignCleanerEndpoint<'getCampaignStatus'>;
	getCampaignPdfAnalysis: CampaignCleanerEndpoint<'getCampaignPdfAnalysis'>;
	getCredits: CampaignCleanerEndpoint<'getCredits'>;
};

const campaignCleanerEndpointsNested = {
	campaign: {
		delete: CampaignCleanerEndpoints.deleteCampaign,
		list: CampaignCleanerEndpoints.getCampaignList,
		status: CampaignCleanerEndpoints.getCampaignStatus,
		pdfAnalysis: CampaignCleanerEndpoints.getCampaignPdfAnalysis,
	},
	credits: {
		get: CampaignCleanerEndpoints.getCredits,
	},
} as const;

export const campaignCleanerEndpointSchemas = {
	'campaign.delete': {
		input: CampaignCleanerEndpointInputSchemas.deleteCampaign,
		output: CampaignCleanerEndpointOutputSchemas.deleteCampaign,
	},
	'campaign.list': {
		input: CampaignCleanerEndpointInputSchemas.getCampaignList,
		output: CampaignCleanerEndpointOutputSchemas.getCampaignList,
	},
	'campaign.status': {
		input: CampaignCleanerEndpointInputSchemas.getCampaignStatus,
		output: CampaignCleanerEndpointOutputSchemas.getCampaignStatus,
	},
	'campaign.pdfAnalysis': {
		input: CampaignCleanerEndpointInputSchemas.getCampaignPdfAnalysis,
		output: CampaignCleanerEndpointOutputSchemas.getCampaignPdfAnalysis,
	},
	'credits.get': {
		input: CampaignCleanerEndpointInputSchemas.getCredits,
		output: CampaignCleanerEndpointOutputSchemas.getCredits,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof campaignCleanerEndpointsNested
>;

const campaignCleanerEndpointMeta = {
	'campaign.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a saved Campaign Cleaner campaign by ID',
	},
	'campaign.list': {
		riskLevel: 'read',
		description: 'List saved Campaign Cleaner campaigns',
	},
	'campaign.status': {
		riskLevel: 'read',
		description: 'Get processing status for a Campaign Cleaner campaign',
	},
	'campaign.pdfAnalysis': {
		riskLevel: 'read',
		description: 'Download PDF analysis for a processed campaign',
	},
	'credits.get': {
		riskLevel: 'read',
		description: 'Get remaining Campaign Cleaner credits',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof campaignCleanerEndpointsNested
>;

const defaultAuthType = 'api_key' as const;
export const campaignCleanerAuthConfig = {
	api_key: { account: ['tenant_external_id'] as const },
} as const satisfies PluginAuthConfig;

export type BaseCampaignCleanerPlugin<T extends CampaignCleanerPluginOptions> =
	CorsairPlugin<
		'campaigncleaner',
		typeof CampaignCleanerSchema,
		typeof campaignCleanerEndpointsNested,
		Record<string, never>,
		T,
		typeof defaultAuthType
	>;
export type InternalCampaignCleanerPlugin =
	BaseCampaignCleanerPlugin<CampaignCleanerPluginOptions>;
export type ExternalCampaignCleanerPlugin<
	T extends CampaignCleanerPluginOptions,
> = BaseCampaignCleanerPlugin<T>;

export function campaigncleaner<const T extends CampaignCleanerPluginOptions>(
	incomingOptions: CampaignCleanerPluginOptions &
		T = {} as CampaignCleanerPluginOptions & T,
): ExternalCampaignCleanerPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'campaigncleaner',
		authConfig: campaignCleanerAuthConfig,
		schema: CampaignCleanerSchema,
		options,
		hooks: options.hooks,
		endpoints: campaignCleanerEndpointsNested,
		webhooks: {},
		endpointMeta: campaignCleanerEndpointMeta,
		endpointSchemas: campaignCleanerEndpointSchemas,
		pluginWebhookMatcher: undefined,
		errorHandlers: { ...errorHandlers, ...options.errorHandlers },
		keyBuilder: async (ctx: CampaignCleanerKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) return options.key;
			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();
				if (key?.trim()) return key.trim();
			}
			throw new AuthMissingError('campaigncleaner', 'api_key');
		},
	} satisfies InternalCampaignCleanerPlugin;
}

export type {
	CampaignCleanerEndpointInputs,
	CampaignCleanerEndpointOutputs,
	DeleteCampaignInput,
	DeleteCampaignResponse,
	GetCampaignListInput,
	GetCampaignListResponse,
	GetCampaignPdfAnalysisInput,
	GetCampaignPdfAnalysisResponse,
	GetCampaignStatusInput,
	GetCampaignStatusResponse,
	GetCreditsInput,
	GetCreditsResponse,
} from './endpoints/types';
