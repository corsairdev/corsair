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
import { tryGetStoredKey } from './client';
import {
	DeleteCampaign,
	GetCampaignList,
	GetCampaignPdfAnalysis,
	GetCampaignStatus,
	GetCredits,
} from './endpoints';
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
	CampaignCleanerPluginOptions,
	undefined,
	typeof campaignCleanerAuthConfig
>;

export type CampaignCleanerKeyBuilderContext = KeyBuilderContext<
	CampaignCleanerPluginOptions,
	typeof campaignCleanerAuthConfig
>;

export type CampaignCleanerBoundEndpoints = BindEndpoints<
	typeof campaignCleanerEndpointsNested
>;

type CampaignCleanerEndpoint<K extends keyof CampaignCleanerEndpointOutputs> =
	CorsairEndpoint<
		CampaignCleanerContext,
		CampaignCleanerEndpointInputs[K],
		CampaignCleanerEndpointOutputs[K]
	>;

export type CampaignCleanerEndpoints = {
	deleteCampaign: CampaignCleanerEndpoint<'deleteCampaign'>;
	getCampaignList: CampaignCleanerEndpoint<'getCampaignList'>;
	getCampaignStatus: CampaignCleanerEndpoint<'getCampaignStatus'>;
	getCampaignPdfAnalysis: CampaignCleanerEndpoint<'getCampaignPdfAnalysis'>;
	getCredits: CampaignCleanerEndpoint<'getCredits'>;
};

const campaignCleanerEndpointsNested = {
	campaign: {
		delete: DeleteCampaign.remove,
		list: GetCampaignList.list,
		status: GetCampaignStatus.status,
		pdfAnalysis: GetCampaignPdfAnalysis.pdfAnalysis,
	},
	credits: {
		get: GetCredits.credits,
	},
} as const;

const campaignCleanerWebhooksNested = {} as const;

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

const defaultAuthType: AuthTypes = 'api_key' as const;

const campaignCleanerEndpointMeta = {
	'campaign.delete': {
		riskLevel: 'destructive',
		description: 'Delete a specific campaign',
	},
	'campaign.list': {
		riskLevel: 'read',
		description: 'Get a list of all campaigns',
	},
	'campaign.status': {
		riskLevel: 'read',
		description: 'Get the status of a specific campaign',
	},
	'campaign.pdfAnalysis': {
		riskLevel: 'read',
		description: 'Get PDF analysis for a specific campaign',
	},
	'credits.get': {
		riskLevel: 'read',
		description: 'Get available credits',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof campaignCleanerEndpointsNested
>;

export const campaignCleanerAuthConfig = {
	api_key: {
		account: [] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseCampaignCleanerPlugin<T extends CampaignCleanerPluginOptions> =
	CorsairPlugin<
		'campaigncleaner',
		typeof CampaignCleanerSchema,
		typeof campaignCleanerEndpointsNested,
		typeof campaignCleanerWebhooksNested,
		T,
		typeof defaultAuthType,
		typeof campaignCleanerAuthConfig
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
		options: options,
		hooks: options.hooks,
		webhookHooks: undefined,
		endpoints: campaignCleanerEndpointsNested,
		webhooks: campaignCleanerWebhooksNested,
		endpointMeta: campaignCleanerEndpointMeta,
		endpointSchemas: campaignCleanerEndpointSchemas,
		pluginWebhookMatcher: undefined,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: CampaignCleanerKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint') {
				const res = await tryGetStoredKey(() => ctx.keys?.get_api_key());
				if (!res) {
					throw new AuthMissingError('campaigncleaner', 'api_key');
				}
				return res;
			}

			return '';
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
