import type {
	BindEndpoints,
	BindWebhooks,
	CorsairEndpoint,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import { makeCampaignCleanerRequest } from './client';
import type {
	CampaignCleanerEndpointInputs,
	CampaignCleanerEndpointOutputs,
	CampaignCleanerEndpoints,
} from './endpoints';
import {
	CampaignCleanerEndpointInputSchemas,
	CampaignCleanerEndpointOutputSchemas,
} from './endpoints/types';

export type CampaignCleanerContext = CorsairPluginContext<
	typeof CampaignCleanerSchema,
	CampaignCleanerPluginOptions
>;

type CampaignCleanerEndpoint<K extends keyof CampaignCleanerEndpointOutputs> =
	CorsairEndpoint<
		CampaignCleanerContext,
		CampaignCleanerEndpointInputs[K],
		CampaignCleanerEndpointOutputs[K]
	>;

export type CampaignCleanerBoundEndpoints = BindEndpoints<
	typeof campaignCleanerEndpointsNested
>;

const campaignCleanerEndpointsNested = {
	sendCampaign: campaignCleanerEndpoints.sendCampaign,
	getCampaignList: campaignCleanerEndpoints.getCampaignList,
	getCampaignStatus: campaignCleanerEndpoints.getCampaignStatus,
	deleteCampaign: campaignCleanerEndpoints.deleteCampaign,
	downloadPdfAnalysis: campaignCleanerEndpoints.downloadPdfAnalysis,
	getCredits: campaignCleanerEndpoints.getCredits,
} as const;

export type CampaignCleanerEndpointSchemas = {
	'sendCampaign': {
		input: typeof CampaignCleanerEndpointInputSchemas.sendCampaign;
		output: typeof CampaignCleanerEndpointOutputSchemas.sendCampaign;
	},
	'getCampaignList': {
		input: typeof CampaignCleanerEndpointInputSchemas.getCampaignList;
		output: typeof CampaignCleanerEndpointOutputSchemas.getCampaignList;
	},
	'getCampaignStatus': {
		input: typeof CampaignCleanerEndpointInputSchemas.getCampaignStatus;
		output: typeof CampaignCleanerEndpointOutputSchemas.getCampaignStatus;
	},
	'deleteCampaign': {
		input: typeof CampaignCleanerEndpointInputSchemas.deleteCampaign;
		output: typeof CampaignCleanerEndpointOutputSchemas.deleteCampaign;
	},
	'downloadPdfAnalysis': {
		input: typeof CampaignCleanerEndpointInputSchemas.downloadPdfAnalysis;
		output: typeof CampaignCleanerEndpointOutputSchemas.downloadPdfAnalysis;
	},
	'getCredits': {
		input: typeof CampaignCleanerEndpointInputSchemas.getCredits;
		output: typeof CampaignCleanerEndpointOutputSchemas.getCredits;
	},
} as const;

const campaignCleanerEndpointSchemas = {
	'sendCampaign': {
		input: CampaignCleanerEndpointInputSchemas.sendCampaign,
		output: CampaignCleanerEndpointOutputSchemas.sendCampaign,
	},
	'getCampaignList': {
		input: CampaignCleanerEndpointInputSchemas.getCampaignList,
		output: CampaignCleanerEndpointOutputSchemas.getCampaignList,
	},
	'getCampaignStatus': {
		input: CampaignCleanerEndpointInputSchemas.getCampaignStatus,
		output: CampaignCleanerEndpointOutputSchemas.getCampaignStatus,
	},
	'deleteCampaign': {
		input: CampaignCleanerEndpointInputSchemas.deleteCampaign,
		output: CampaignCleanerEndpointOutputSchemas.deleteCampaign,
	},
	'downloadPdfAnalysis': {
		input: CampaignCleanerEndpointInputSchemas.downloadPdfAnalysis,
		output: CampaignCleanerEndpointOutputSchemas.downloadPdfAnalysis,
	},
	'getCredits': {
		input: CampaignCleanerEndpointInputSchemas.getCredits,
		output: CampaignCleanerEndpointOutputSchemas.getCredits,
	},
} as const;

export type CampaignCleanerPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	/**
	 * Permission configuration for the Campaign Cleaner plugin.
	 * Controls what the AI agent is allowed to do.
	 * Overuse dot-notation paths from the Campaign Cleaner endpoint tree — invalid paths are type errors.
	 */
	permissions?: PluginPermissionsConfig<typeof campaignCleanerEndpointsNested>;
};

export type CampaignKeyBuilderContext =
	KeyBuilderContext<CampaignCleanerPluginOptions>;

const defaultAuthType = 'api_key' as const;

export const campaignCleanerAuthConfig = {
	api_key: {
		account: ['key'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseCampaignCleanerPlugin<T extends CampaignCleanerPluginOptions> =
	CorsairPlugin<
		'campaigncleaner',
		typeof CampaignCleanerSchema,
		typeof campaignCleanerEndpointsNested,
		never,
		T,
		typeof defaultAuthType
	>;

export type InternalCampaignCleanerPlugin =
	BaseCampaignCleanerPlugin<CampaignCleanerPluginOptions>;

export type ExternalCampaignCleanerPlugin<
	T extends CampaignCleanerPluginOptions,
> = BaseCampaignCleanerPlugin<T>;

export function campaigncleaner<const T extends CampaignCleanerPluginOptions>(
	incomingOptions: CampaignCleanerPluginOptions & T = {} as CampaignCleanerPluginOptions & T,
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
		endpoints: campaignCleanerEndpointsNested,
		endpointSchemas: campaignCleanerEndpointSchemas,
		keyBuilder: async (ctx: CampaignKeyBuilderContext) => {
			const authType = ctx.authType;

			if (options.key) {
				return options.key;
			}

			if (ctx.authType === 'api_key') {
				const key = ctx.keys.get_api_key();
				if (!key) {
					throw new AuthMissingError('campaigncleaner', 'api_key');
				}
				return key;
			}

			throw new AuthMissingError('campaigncleaner', 'api_key');
		},
		pluginPermissions: {
			canSendCampaign: {
				description: 'Send a campaign',
				endpointPaths: ['sendCampaign'],
			},
			canGetCampaignList: {
				description: 'Get campaign list',
				endpointPaths: ['getCampaignList'],
			},
			canGetCampaignStatus: {
				description: 'Get campaign status',
				endpointPaths: ['getCampaignStatus'],
			},
			canDeleteCampaign: {
				description: 'Delete a campaign',
				endpointPaths: ['deleteCampaign'],
			},
			canDownloadPdfAnalysis: {
				description: 'Download campaign PDF analysis',
				endpointPaths: ['downloadPdfAnalysis'],
			},
			canGetCredits: {
				description: 'Get credits',
				endpointPaths: ['getCredits'],
			},
		},
	} satisfies InternalCampaignCleanerPlugin;
}
