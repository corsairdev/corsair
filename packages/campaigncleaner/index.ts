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
	CampaignCleanerPluginOptions
>;

export type CampaignCleanerKeyBuilderContext =
	KeyBuilderContext<CampaignCleanerPluginOptions>;

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
	deleteCampaign: {
		remove: DeleteCampaign.remove,
	},
	getCampaignList: {
		list: GetCampaignList.list,
	},
	getCampaignStatus: {
		status: GetCampaignStatus.status,
	},
	getCampaignPdfAnalysis: {
		pdfAnalysis: GetCampaignPdfAnalysis.pdfAnalysis,
	},
	getCredits: {
		credits: GetCredits.credits,
	},
} as const;

export const campaignCleanerEndpointSchemas = {
	'deleteCampaign.remove': {
		input: CampaignCleanerEndpointInputSchemas.deleteCampaign,
		output: CampaignCleanerEndpointOutputSchemas.deleteCampaign,
	},
	'getCampaignList.list': {
		input: CampaignCleanerEndpointInputSchemas.getCampaignList,
		output: CampaignCleanerEndpointOutputSchemas.getCampaignList,
	},
	'getCampaignStatus.status': {
		input: CampaignCleanerEndpointInputSchemas.getCampaignStatus,
		output: CampaignCleanerEndpointOutputSchemas.getCampaignStatus,
	},
	'getCampaignPdfAnalysis.pdfAnalysis': {
		input: CampaignCleanerEndpointInputSchemas.getCampaignPdfAnalysis,
		output: CampaignCleanerEndpointOutputSchemas.getCampaignPdfAnalysis,
	},
	'getCredits.credits': {
		input: CampaignCleanerEndpointInputSchemas.getCredits,
		output: CampaignCleanerEndpointOutputSchemas.getCredits,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof campaignCleanerEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const campaignCleanerEndpointMeta = {
	'deleteCampaign.remove': {
		riskLevel: 'write',
		description: 'Delete a saved Campaign Cleaner campaign',
	},
	'getCampaignList.list': {
		riskLevel: 'read',
		description: 'Get the list of saved Campaign Cleaner campaigns',
	},
	'getCampaignStatus.status': {
		riskLevel: 'read',
		description: 'Get the status of a Campaign Cleaner campaign',
	},
	'getCampaignPdfAnalysis.pdfAnalysis': {
		riskLevel: 'read',
		description: 'Download PDF analysis for a Campaign Cleaner campaign',
	},
	'getCredits.credits': {
		riskLevel: 'read',
		description: 'Get the remaining Campaign Cleaner credits',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof campaignCleanerEndpointsNested
>;

export const campaignCleanerAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseCampaignCleanerPlugin<T extends CampaignCleanerPluginOptions> =
	CorsairPlugin<
		'campaigncleaner',
		typeof CampaignCleanerSchema,
		typeof campaignCleanerEndpointsNested,
		{},
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
		authType: 'api_key' as const,
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
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: CampaignCleanerKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				return res ?? '';
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
