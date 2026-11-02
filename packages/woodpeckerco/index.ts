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
import { Campaigns, Prospects, Webhooks } from './endpoints';
import type {
	WoodpeckerCoEndpointInputs,
	WoodpeckerCoEndpointOutputs,
} from './endpoints/types';
import {
	WoodpeckerCoEndpointInputSchemas,
	WoodpeckerCoEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { WoodpeckerCoSchema } from './schema';

export type WoodpeckerCoPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalWoodpeckerCoPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof woodpeckerCoEndpointsNested>;
};

export type WoodpeckerCoContext = CorsairPluginContext<
	typeof WoodpeckerCoSchema,
	WoodpeckerCoPluginOptions
>;

export type WoodpeckerCoKeyBuilderContext =
	KeyBuilderContext<WoodpeckerCoPluginOptions>;

export type WoodpeckerCoBoundEndpoints = BindEndpoints<
	typeof woodpeckerCoEndpointsNested
>;

type WoodpeckerCoEndpoint<K extends keyof WoodpeckerCoEndpointOutputs> =
	CorsairEndpoint<
		WoodpeckerCoContext,
		WoodpeckerCoEndpointInputs[K],
		WoodpeckerCoEndpointOutputs[K]
	>;

export type WoodpeckerCoEndpoints = {
	campaignsList: WoodpeckerCoEndpoint<'campaignsList'>;
	campaignsRun: WoodpeckerCoEndpoint<'campaignsRun'>;
	campaignsPause: WoodpeckerCoEndpoint<'campaignsPause'>;
	campaignsStop: WoodpeckerCoEndpoint<'campaignsStop'>;
	campaignsDeleteStep: WoodpeckerCoEndpoint<'campaignsDeleteStep'>;
	prospectsAddToCampaign: WoodpeckerCoEndpoint<'prospectsAddToCampaign'>;
	prospectsListInCampaigns: WoodpeckerCoEndpoint<'prospectsListInCampaigns'>;
	webhooksListEvents: WoodpeckerCoEndpoint<'webhooksListEvents'>;
};

const woodpeckerCoEndpointsNested = {
	campaigns: {
		list: Campaigns.list,
		run: Campaigns.run,
		pause: Campaigns.pause,
		stop: Campaigns.stop,
		deleteStep: Campaigns.deleteStep,
	},
	prospects: {
		addToCampaign: Prospects.addToCampaign,
		listInCampaigns: Prospects.listInCampaigns,
	},
	webhooks: {
		listEvents: Webhooks.listEvents,
	},
} as const;

export const woodpeckerCoEndpointSchemas = {
	'campaigns.list': {
		input: WoodpeckerCoEndpointInputSchemas.campaignsList,
		output: WoodpeckerCoEndpointOutputSchemas.campaignsList,
	},
	'campaigns.run': {
		input: WoodpeckerCoEndpointInputSchemas.campaignsRun,
		output: WoodpeckerCoEndpointOutputSchemas.campaignsRun,
	},
	'campaigns.pause': {
		input: WoodpeckerCoEndpointInputSchemas.campaignsPause,
		output: WoodpeckerCoEndpointOutputSchemas.campaignsPause,
	},
	'campaigns.stop': {
		input: WoodpeckerCoEndpointInputSchemas.campaignsStop,
		output: WoodpeckerCoEndpointOutputSchemas.campaignsStop,
	},
	'campaigns.deleteStep': {
		input: WoodpeckerCoEndpointInputSchemas.campaignsDeleteStep,
		output: WoodpeckerCoEndpointOutputSchemas.campaignsDeleteStep,
	},
	'prospects.addToCampaign': {
		input: WoodpeckerCoEndpointInputSchemas.prospectsAddToCampaign,
		output: WoodpeckerCoEndpointOutputSchemas.prospectsAddToCampaign,
	},
	'prospects.listInCampaigns': {
		input: WoodpeckerCoEndpointInputSchemas.prospectsListInCampaigns,
		output: WoodpeckerCoEndpointOutputSchemas.prospectsListInCampaigns,
	},
	'webhooks.listEvents': {
		input: WoodpeckerCoEndpointInputSchemas.webhooksListEvents,
		output: WoodpeckerCoEndpointOutputSchemas.webhooksListEvents,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof woodpeckerCoEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const woodpeckerCoEndpointMeta = {
	'campaigns.list': {
		riskLevel: 'read',
		description:
			'List campaigns, optionally filtered by status or ID; asking for exactly one ID also returns its statistics',
	},
	'campaigns.run': {
		riskLevel: 'write',
		description:
			'Start or resume a campaign: it becomes RUNNING and Woodpecker starts contacting its prospects',
	},
	'campaigns.pause': {
		riskLevel: 'write',
		description:
			'Pause a campaign: no further contact with prospects until it is run again',
	},
	'campaigns.stop': {
		riskLevel: 'write',
		description:
			'Stop a campaign: no further contact with prospects until it is run again',
	},
	'campaigns.deleteStep': {
		riskLevel: 'destructive',
		description:
			'Permanently delete an unused EMAIL or LINKEDIN step that is not the first step; the campaign must be DRAFT or EDITED',
	},
	'prospects.addToCampaign': {
		riskLevel: 'write',
		description:
			'Add up to 20,000 prospects to a campaign, also creating them in the global list; each result says if that prospect was a duplicate or rejected',
	},
	'prospects.listInCampaigns': {
		riskLevel: 'read',
		description:
			'List the prospects in one or more campaigns with their campaign status and interest level, with filters, sorting and paging',
	},
	'webhooks.listEvents': {
		riskLevel: 'read',
		description:
			"List the event types Woodpecker can send to a webhook, from Woodpecker's docs; makes no API call",
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof woodpeckerCoEndpointsNested
>;

export type BaseWoodpeckerCoPlugin<T extends WoodpeckerCoPluginOptions> =
	CorsairPlugin<
		'woodpeckerco',
		typeof WoodpeckerCoSchema,
		typeof woodpeckerCoEndpointsNested,
		{},
		T,
		typeof defaultAuthType
	>;

export type InternalWoodpeckerCoPlugin =
	BaseWoodpeckerCoPlugin<WoodpeckerCoPluginOptions>;

export type ExternalWoodpeckerCoPlugin<T extends WoodpeckerCoPluginOptions> =
	BaseWoodpeckerCoPlugin<T>;

export function woodpeckerco<const T extends WoodpeckerCoPluginOptions>(
	incomingOptions: WoodpeckerCoPluginOptions &
		T = {} as WoodpeckerCoPluginOptions & T,
): ExternalWoodpeckerCoPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'woodpeckerco',
		schema: WoodpeckerCoSchema,
		options: options,
		hooks: options.hooks,
		endpoints: woodpeckerCoEndpointsNested,
		webhooks: {},
		endpointMeta: woodpeckerCoEndpointMeta,
		endpointSchemas: woodpeckerCoEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: WoodpeckerCoKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('woodpeckerco', ctx.authType ?? 'api_key');
		},
	} satisfies InternalWoodpeckerCoPlugin;
}

export { WoodpeckerCoAPIError } from './client';

export type {
	CampaignActionInput,
	CampaignActionResponse,
	CampaignsDeleteStepInput,
	CampaignsDeleteStepResponse,
	CampaignsListInput,
	CampaignsListResponse,
	ProspectsAddToCampaignInput,
	ProspectsAddToCampaignResponse,
	ProspectsListInCampaignsInput,
	ProspectsListInCampaignsResponse,
	WebhooksListEventsInput,
	WebhooksListEventsResponse,
	WoodpeckerCoCampaign,
	WoodpeckerCoEndpointInputs,
	WoodpeckerCoEndpointOutputs,
	WoodpeckerCoProspect,
	WoodpeckerCoProspectInput,
	WoodpeckerCoWebhookEvent,
} from './endpoints/types';
