import type {
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
import { AuthMissingError, getOAuthAccessToken } from 'corsair/core';
import { TONEDEN_OAUTH_AUTHORIZE_URL, TONEDEN_OAUTH_TOKEN_URL } from './client';
import {
	AttachmentsEndpoints,
	CampaignsEndpoints,
	LinksEndpoints,
	OfflineConversionsEndpoints,
	PlaybooksEndpoints,
	UserListsEndpoints,
	UsersEndpoints,
} from './endpoints';
import type {
	ToneDenEndpointInputs,
	ToneDenEndpointOutputs,
} from './endpoints/types';
import {
	ToneDenEndpointInputSchemas,
	ToneDenEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { ToneDenSchema } from './schema';

export type ToneDenPluginOptions = {
	/**
	 * ToneDen only accepts a user access token obtained through its OAuth 2.0
	 * authorization-code flow, so `oauth_2` is the only supported auth type.
	 * `api_key` is accepted so a token can be supplied directly for testing.
	 */
	authType?: PickAuth<'oauth_2' | 'api_key'>;
	key?: string;
	hooks?: InternalToneDenPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof tonedenEndpointsNested>;
};

export const tonedenAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type ToneDenContext = CorsairPluginContext<
	typeof ToneDenSchema,
	ToneDenPluginOptions,
	undefined,
	typeof tonedenAuthConfig
>;

export type ToneDenKeyBuilderContext = KeyBuilderContext<
	ToneDenPluginOptions,
	typeof tonedenAuthConfig
>;

export type ToneDenBoundEndpoints = BindEndpoints<
	typeof tonedenEndpointsNested
>;

type ToneDenEndpoint<K extends keyof ToneDenEndpointOutputs> = CorsairEndpoint<
	ToneDenContext,
	ToneDenEndpointInputs[K],
	ToneDenEndpointOutputs[K]
>;

export type ToneDenEndpoints = {
	linksListForUser: ToneDenEndpoint<'listUserLinks'>;
	linksGet: ToneDenEndpoint<'getLink'>;
	linksCreate: ToneDenEndpoint<'createLink'>;
	linksUpdate: ToneDenEndpoint<'updateLink'>;
	linksDelete: ToneDenEndpoint<'deleteLink'>;
	linksExpand: ToneDenEndpoint<'expandLink'>;
	linksValidPath: ToneDenEndpoint<'validPath'>;
	linksInsights: ToneDenEndpoint<'linkInsights'>;
	linksInsightsOverview: ToneDenEndpoint<'linkInsightsOverview'>;
	attachmentsListForUser: ToneDenEndpoint<'listUserAttachments'>;
	attachmentsGet: ToneDenEndpoint<'getAttachment'>;
	attachmentsCreate: ToneDenEndpoint<'createAttachment'>;
	attachmentsUpdate: ToneDenEndpoint<'updateAttachment'>;
	attachmentsDelete: ToneDenEndpoint<'deleteAttachment'>;
	attachmentsEntries: ToneDenEndpoint<'attachmentEntries'>;
	attachmentsEntriesTotals: ToneDenEndpoint<'attachmentEntriesTotals'>;
	attachmentsUnlocks: ToneDenEndpoint<'attachmentUnlocks'>;
	attachmentsUnlocksTotals: ToneDenEndpoint<'attachmentUnlocksTotals'>;
	attachmentsUnlockPlatforms: ToneDenEndpoint<'attachmentUnlockPlatforms'>;
	campaignsList: ToneDenEndpoint<'listCampaigns'>;
	campaignsGet: ToneDenEndpoint<'getCampaign'>;
	campaignsCreate: ToneDenEndpoint<'createCampaign'>;
	campaignsUpdate: ToneDenEndpoint<'updateCampaign'>;
	campaignsDelete: ToneDenEndpoint<'deleteCampaign'>;
	campaignsInsights: ToneDenEndpoint<'campaignInsights'>;
	campaignsCreativeInsights: ToneDenEndpoint<'campaignCreativeInsights'>;
	userListsList: ToneDenEndpoint<'listUserLists'>;
	userListsCreate: ToneDenEndpoint<'createUserList'>;
	userListsUpdateContacts: ToneDenEndpoint<'updateUserListContacts'>;
	offlineConversions: ToneDenEndpoint<'offlineConversions'>;
	playbooksGet: ToneDenEndpoint<'getPlaybookCampaign'>;
	playbooksCreate: ToneDenEndpoint<'createPlaybookCampaign'>;
	playbooksUpdate: ToneDenEndpoint<'updatePlaybookCampaign'>;
	playbooksDelete: ToneDenEndpoint<'deletePlaybookCampaign'>;
	usersGet: ToneDenEndpoint<'getUser'>;
	usersUpdate: ToneDenEndpoint<'updateUser'>;
};

const tonedenEndpointsNested = {
	links: {
		listForUser: LinksEndpoints.listForUser,
		get: LinksEndpoints.get,
		create: LinksEndpoints.create,
		update: LinksEndpoints.update,
		delete: LinksEndpoints.delete,
		expand: LinksEndpoints.expand,
		validPath: LinksEndpoints.validPath,
		insights: LinksEndpoints.insights,
		insightsOverview: LinksEndpoints.insightsOverview,
	},
	attachments: {
		listForUser: AttachmentsEndpoints.listForUser,
		get: AttachmentsEndpoints.get,
		create: AttachmentsEndpoints.create,
		update: AttachmentsEndpoints.update,
		delete: AttachmentsEndpoints.delete,
		entries: AttachmentsEndpoints.entries,
		entriesTotals: AttachmentsEndpoints.entriesTotals,
		unlocks: AttachmentsEndpoints.unlocks,
		unlocksTotals: AttachmentsEndpoints.unlocksTotals,
		unlockPlatforms: AttachmentsEndpoints.unlockPlatforms,
	},
	campaigns: {
		list: CampaignsEndpoints.list,
		get: CampaignsEndpoints.get,
		create: CampaignsEndpoints.create,
		update: CampaignsEndpoints.update,
		delete: CampaignsEndpoints.delete,
		insights: CampaignsEndpoints.insights,
		creativeInsights: CampaignsEndpoints.creativeInsights,
	},
	userLists: {
		list: UserListsEndpoints.list,
		create: UserListsEndpoints.create,
		updateContacts: UserListsEndpoints.updateContacts,
	},
	offlineConversions: {
		upload: OfflineConversionsEndpoints.upload,
	},
	playbooks: {
		get: PlaybooksEndpoints.get,
		create: PlaybooksEndpoints.create,
		update: PlaybooksEndpoints.update,
		delete: PlaybooksEndpoints.delete,
	},
	users: {
		get: UsersEndpoints.get,
		update: UsersEndpoints.update,
	},
} as const;

export const tonedenEndpointSchemas = {
	'links.listForUser': {
		input: ToneDenEndpointInputSchemas.listUserLinks,
		output: ToneDenEndpointOutputSchemas.listUserLinks,
	},
	'links.get': {
		input: ToneDenEndpointInputSchemas.getLink,
		output: ToneDenEndpointOutputSchemas.getLink,
	},
	'links.create': {
		input: ToneDenEndpointInputSchemas.createLink,
		output: ToneDenEndpointOutputSchemas.createLink,
	},
	'links.update': {
		input: ToneDenEndpointInputSchemas.updateLink,
		output: ToneDenEndpointOutputSchemas.updateLink,
	},
	'links.delete': {
		input: ToneDenEndpointInputSchemas.deleteLink,
		output: ToneDenEndpointOutputSchemas.deleteLink,
	},
	'links.expand': {
		input: ToneDenEndpointInputSchemas.expandLink,
		output: ToneDenEndpointOutputSchemas.expandLink,
	},
	'links.validPath': {
		input: ToneDenEndpointInputSchemas.validPath,
		output: ToneDenEndpointOutputSchemas.validPath,
	},
	'links.insights': {
		input: ToneDenEndpointInputSchemas.linkInsights,
		output: ToneDenEndpointOutputSchemas.linkInsights,
	},
	'links.insightsOverview': {
		input: ToneDenEndpointInputSchemas.linkInsightsOverview,
		output: ToneDenEndpointOutputSchemas.linkInsightsOverview,
	},
	'attachments.listForUser': {
		input: ToneDenEndpointInputSchemas.listUserAttachments,
		output: ToneDenEndpointOutputSchemas.listUserAttachments,
	},
	'attachments.get': {
		input: ToneDenEndpointInputSchemas.getAttachment,
		output: ToneDenEndpointOutputSchemas.getAttachment,
	},
	'attachments.create': {
		input: ToneDenEndpointInputSchemas.createAttachment,
		output: ToneDenEndpointOutputSchemas.createAttachment,
	},
	'attachments.update': {
		input: ToneDenEndpointInputSchemas.updateAttachment,
		output: ToneDenEndpointOutputSchemas.updateAttachment,
	},
	'attachments.delete': {
		input: ToneDenEndpointInputSchemas.deleteAttachment,
		output: ToneDenEndpointOutputSchemas.deleteAttachment,
	},
	'attachments.entries': {
		input: ToneDenEndpointInputSchemas.attachmentEntries,
		output: ToneDenEndpointOutputSchemas.attachmentEntries,
	},
	'attachments.entriesTotals': {
		input: ToneDenEndpointInputSchemas.attachmentEntriesTotals,
		output: ToneDenEndpointOutputSchemas.attachmentEntriesTotals,
	},
	'attachments.unlocks': {
		input: ToneDenEndpointInputSchemas.attachmentUnlocks,
		output: ToneDenEndpointOutputSchemas.attachmentUnlocks,
	},
	'attachments.unlocksTotals': {
		input: ToneDenEndpointInputSchemas.attachmentUnlocksTotals,
		output: ToneDenEndpointOutputSchemas.attachmentUnlocksTotals,
	},
	'attachments.unlockPlatforms': {
		input: ToneDenEndpointInputSchemas.attachmentUnlockPlatforms,
		output: ToneDenEndpointOutputSchemas.attachmentUnlockPlatforms,
	},
	'campaigns.list': {
		input: ToneDenEndpointInputSchemas.listCampaigns,
		output: ToneDenEndpointOutputSchemas.listCampaigns,
	},
	'campaigns.get': {
		input: ToneDenEndpointInputSchemas.getCampaign,
		output: ToneDenEndpointOutputSchemas.getCampaign,
	},
	'campaigns.create': {
		input: ToneDenEndpointInputSchemas.createCampaign,
		output: ToneDenEndpointOutputSchemas.createCampaign,
	},
	'campaigns.update': {
		input: ToneDenEndpointInputSchemas.updateCampaign,
		output: ToneDenEndpointOutputSchemas.updateCampaign,
	},
	'campaigns.delete': {
		input: ToneDenEndpointInputSchemas.deleteCampaign,
		output: ToneDenEndpointOutputSchemas.deleteCampaign,
	},
	'campaigns.insights': {
		input: ToneDenEndpointInputSchemas.campaignInsights,
		output: ToneDenEndpointOutputSchemas.campaignInsights,
	},
	'campaigns.creativeInsights': {
		input: ToneDenEndpointInputSchemas.campaignCreativeInsights,
		output: ToneDenEndpointOutputSchemas.campaignCreativeInsights,
	},
	'userLists.list': {
		input: ToneDenEndpointInputSchemas.listUserLists,
		output: ToneDenEndpointOutputSchemas.listUserLists,
	},
	'userLists.create': {
		input: ToneDenEndpointInputSchemas.createUserList,
		output: ToneDenEndpointOutputSchemas.createUserList,
	},
	'userLists.updateContacts': {
		input: ToneDenEndpointInputSchemas.updateUserListContacts,
		output: ToneDenEndpointOutputSchemas.updateUserListContacts,
	},
	'offlineConversions.upload': {
		input: ToneDenEndpointInputSchemas.offlineConversions,
		output: ToneDenEndpointOutputSchemas.offlineConversions,
	},
	'playbooks.get': {
		input: ToneDenEndpointInputSchemas.getPlaybookCampaign,
		output: ToneDenEndpointOutputSchemas.getPlaybookCampaign,
	},
	'playbooks.create': {
		input: ToneDenEndpointInputSchemas.createPlaybookCampaign,
		output: ToneDenEndpointOutputSchemas.createPlaybookCampaign,
	},
	'playbooks.update': {
		input: ToneDenEndpointInputSchemas.updatePlaybookCampaign,
		output: ToneDenEndpointOutputSchemas.updatePlaybookCampaign,
	},
	'playbooks.delete': {
		input: ToneDenEndpointInputSchemas.deletePlaybookCampaign,
		output: ToneDenEndpointOutputSchemas.deletePlaybookCampaign,
	},
	'users.get': {
		input: ToneDenEndpointInputSchemas.getUser,
		output: ToneDenEndpointOutputSchemas.getUser,
	},
	'users.update': {
		input: ToneDenEndpointInputSchemas.updateUser,
		output: ToneDenEndpointOutputSchemas.updateUser,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof tonedenEndpointsNested
>;

const defaultAuthType = 'oauth_2' as const;

const tonedenEndpointMeta = {
	'links.listForUser': {
		riskLevel: 'read',
		description: "List one user's links",
	},
	'links.get': {
		riskLevel: 'read',
		description: 'Read one link with its services, pixels and social settings',
	},
	'links.create': {
		riskLevel: 'write',
		description:
			'Create a link with its target, artwork, services and social settings',
	},
	'links.update': {
		riskLevel: 'write',
		description:
			'Change the fields of one link; only the given fields are sent',
	},
	'links.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a link; there is no restore route',
	},
	'links.expand': {
		riskLevel: 'read',
		description:
			'Expand a music or podcast URL into the tracking pixels, affiliate codes and services a link would carry',
	},
	'links.validPath': {
		riskLevel: 'read',
		description:
			'Check whether a path and subdomain are still available; answers 200 with `valid: false` rather than failing',
	},
	'links.insights': {
		riskLevel: 'read',
		description: "Read one link's performance over a date window",
	},
	'links.insightsOverview': {
		riskLevel: 'read',
		description: "Read a summary of one link's performance",
	},
	'attachments.listForUser': {
		riskLevel: 'read',
		description: "List one user's contests and social unlocks",
	},
	'attachments.get': {
		riskLevel: 'read',
		description: 'Read one contest or unlock with its actions',
	},
	'attachments.create': {
		riskLevel: 'write',
		description: 'Create a contest or a social unlock',
	},
	'attachments.update': {
		riskLevel: 'write',
		description: 'Change the fields of one contest or unlock',
	},
	'attachments.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a contest or unlock; there is no restore route',
	},
	'attachments.entries': {
		riskLevel: 'read',
		description: 'Read a contest entry time series, by platform',
	},
	'attachments.entriesTotals': {
		riskLevel: 'read',
		description:
			'Read entry counts over the past day, week, month and lifetime',
	},
	'attachments.unlocks': {
		riskLevel: 'read',
		description: 'Read a social unlock time series',
	},
	'attachments.unlocksTotals': {
		riskLevel: 'read',
		description:
			'Read unlock counts over the past day, week, month and lifetime',
	},
	'attachments.unlockPlatforms': {
		riskLevel: 'read',
		description: 'Read unlock counts by platform',
	},
	'campaigns.list': {
		riskLevel: 'read',
		description: "List one user's ad campaigns",
	},
	'campaigns.get': {
		riskLevel: 'read',
		description: 'Read one ad campaign',
	},
	'campaigns.create': {
		riskLevel: 'destructive',
		description:
			'Create an ad campaign on Facebook or Google; creating one can start spend, so review the body before calling',
	},
	'campaigns.update': {
		riskLevel: 'destructive',
		description: 'Change an ad campaign; only the given fields are sent',
	},
	'campaigns.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete an ad campaign; there is no restore route',
	},
	'campaigns.insights': {
		riskLevel: 'read',
		description: 'Read one campaign performance data',
	},
	'campaigns.creativeInsights': {
		riskLevel: 'read',
		description: 'Read performance data for each ad within a campaign',
	},
	'userLists.list': {
		riskLevel: 'read',
		description: "List one user's advertising user lists",
	},
	'userLists.create': {
		riskLevel: 'write',
		description:
			'Create a user list for a Facebook custom audience; the feature requires access from ToneDen support',
	},
	'userLists.updateContacts': {
		riskLevel: 'write',
		description: 'Add or remove people in a user list',
	},
	'offlineConversions.upload': {
		riskLevel: 'write',
		description: 'Upload offline conversions for a user',
	},
	'playbooks.get': {
		riskLevel: 'read',
		description: 'Read one playbook campaign',
	},
	'playbooks.create': {
		riskLevel: 'destructive',
		description: 'Create a playbook campaign from a template',
	},
	'playbooks.update': {
		riskLevel: 'destructive',
		description: 'Change a playbook campaign title or archive state',
	},
	'playbooks.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a playbook campaign; there is no restore route',
	},
	'users.get': {
		riskLevel: 'read',
		description: 'Read a user profile',
	},
	'users.update': {
		riskLevel: 'write',
		description: "Change a user profile's name, email or location",
	},
} as const satisfies RequiredPluginEndpointMeta<typeof tonedenEndpointsNested>;

export type BaseToneDenPlugin<T extends ToneDenPluginOptions> = CorsairPlugin<
	'toneden',
	typeof ToneDenSchema,
	typeof tonedenEndpointsNested,
	{},
	T,
	typeof defaultAuthType,
	typeof tonedenAuthConfig
>;

export type InternalToneDenPlugin = BaseToneDenPlugin<ToneDenPluginOptions>;

export type ExternalToneDenPlugin<T extends ToneDenPluginOptions> =
	BaseToneDenPlugin<T>;

export function toneden<const T extends ToneDenPluginOptions>(
	incomingOptions: ToneDenPluginOptions & T = {} as ToneDenPluginOptions & T,
): ExternalToneDenPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'toneden',
		authConfig: tonedenAuthConfig,
		// ToneDen uses the authorization-code flow, documents no scopes, and
		// sends users only to redirect URIs registered on the app.
		oauthConfig: {
			providerName: 'ToneDen',
			authUrl: TONEDEN_OAUTH_AUTHORIZE_URL,
			tokenUrl: TONEDEN_OAUTH_TOKEN_URL,
			scopes: [],
			tokenAuthMethod: 'body' as const,
			requiresRegisteredRedirect: true,
		},
		schema: ToneDenSchema,
		options: options,
		hooks: options.hooks,
		endpoints: tonedenEndpointsNested,
		webhooks: {},
		endpointMeta: tonedenEndpointMeta,
		endpointSchemas: tonedenEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: ToneDenKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
				throw new AuthMissingError('toneden', 'api_key');
			}

			if (source === 'endpoint' && ctx.authType === 'oauth_2') {
				// Core mints, refreshes and caches the token, and retries a 401
				// once after a refresh.
				return getOAuthAccessToken(ctx, {
					plugin: 'toneden',
					tokenUrl: TONEDEN_OAUTH_TOKEN_URL,
				});
			}

			throw new AuthMissingError('toneden', ctx.authType ?? 'oauth_2');
		},
	} satisfies InternalToneDenPlugin;
}

export {
	TONEDEN_OAUTH_AUTHORIZE_URL,
	TONEDEN_OAUTH_TOKEN_URL,
} from './client';

export type {
	AdCampaignOutput,
	AttachmentOutput,
	CreateAttachmentInput,
	CreateLinkInput,
	ExpandedLinkOutput,
	InsightsOutput,
	LinkOutput,
	PlaybookCampaignOutput,
	ToneDenEndpointInputs,
	ToneDenEndpointOutputs,
	UpdateLinkInput,
	UpdateUserInput,
	UserOutput,
	ValidPathOutput,
} from './endpoints/types';
