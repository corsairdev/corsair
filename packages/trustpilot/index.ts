import type {
	AuthTypes,
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
import { AuthMissingError, getOAuthAccessToken } from 'corsair/core';
import {
	BusinessUnits,
	ConsumerProfiles,
	Consumers,
	DataSolutions,
	Invitations,
	ProductReviews,
	Reviews,
} from './endpoints';
import {
	TrustpilotEndpointInputSchemas,
	TrustpilotEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { TrustpilotSchema } from './schema';

export type TrustpilotPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	apiKey?: string;
	hooks?: InternalTrustpilotPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof trustpilotEndpointsNested>;
};

export type TrustpilotContext = CorsairPluginContext<
	typeof TrustpilotSchema,
	TrustpilotPluginOptions
>;
export type TrustpilotKeyBuilderContext =
	KeyBuilderContext<TrustpilotPluginOptions>;

const trustpilotEndpointsNested = {
	businessUnits: BusinessUnits,
	reviews: Reviews,
	consumers: Consumers,
	consumerProfiles: ConsumerProfiles,
	productReviews: ProductReviews,
	invitations: Invitations,
	dataSolutions: DataSolutions,
} as const;

const trustpilotWebhooksNested = {} as const;
export type TrustpilotBoundEndpoints = BindEndpoints<
	typeof trustpilotEndpointsNested
>;
export type TrustpilotEndpoints = typeof trustpilotEndpointsNested;

const trustpilotEndpointSchemas = {
	'businessUnits.find': {
		input: TrustpilotEndpointInputSchemas['businessUnits.find'],
		output: TrustpilotEndpointOutputSchemas['businessUnits.find'],
	},
	'businessUnits.get': {
		input: TrustpilotEndpointInputSchemas['businessUnits.get'],
		output: TrustpilotEndpointOutputSchemas['businessUnits.get'],
	},
	'businessUnits.search': {
		input: TrustpilotEndpointInputSchemas['businessUnits.search'],
		output: TrustpilotEndpointOutputSchemas['businessUnits.search'],
	},
	'businessUnits.profileInfo': {
		input: TrustpilotEndpointInputSchemas['businessUnits.profileInfo'],
		output: TrustpilotEndpointOutputSchemas['businessUnits.profileInfo'],
	},
	'businessUnits.webLinks': {
		input: TrustpilotEndpointInputSchemas['businessUnits.webLinks'],
		output: TrustpilotEndpointOutputSchemas['businessUnits.webLinks'],
	},
	'businessUnits.logo': {
		input: TrustpilotEndpointInputSchemas['businessUnits.logo'],
		output: TrustpilotEndpointOutputSchemas['businessUnits.logo'],
	},
	'businessUnits.promotionBoxImage': {
		input: TrustpilotEndpointInputSchemas['businessUnits.promotionBoxImage'],
		output: TrustpilotEndpointOutputSchemas['businessUnits.promotionBoxImage'],
	},
	'businessUnits.headerImage': {
		input: TrustpilotEndpointInputSchemas['businessUnits.headerImage'],
		output: TrustpilotEndpointOutputSchemas['businessUnits.headerImage'],
	},
	'businessUnits.listCategories': {
		input: TrustpilotEndpointInputSchemas['businessUnits.listCategories'],
		output: TrustpilotEndpointOutputSchemas['businessUnits.listCategories'],
	},
	'businessUnits.publicAll': {
		input: TrustpilotEndpointInputSchemas['businessUnits.publicAll'],
		output: TrustpilotEndpointOutputSchemas['businessUnits.publicAll'],
	},
	'businessUnits.customerGuarantee': {
		input: TrustpilotEndpointInputSchemas['businessUnits.customerGuarantee'],
		output: TrustpilotEndpointOutputSchemas['businessUnits.customerGuarantee'],
	},
	'businessUnits.profilePromotion': {
		input: TrustpilotEndpointInputSchemas['businessUnits.profilePromotion'],
		output: TrustpilotEndpointOutputSchemas['businessUnits.profilePromotion'],
	},
	'businessUnits.publicPromotionBox': {
		input: TrustpilotEndpointInputSchemas['businessUnits.publicPromotionBox'],
		output: TrustpilotEndpointOutputSchemas['businessUnits.publicPromotionBox'],
	},
	'businessUnits.reviews': {
		input: TrustpilotEndpointInputSchemas['businessUnits.reviews'],
		output: TrustpilotEndpointOutputSchemas['businessUnits.reviews'],
	},
	'businessUnits.allReviews': {
		input: TrustpilotEndpointInputSchemas['businessUnits.allReviews'],
		output: TrustpilotEndpointOutputSchemas['businessUnits.allReviews'],
	},
	'businessUnits.privateReviews': {
		input: TrustpilotEndpointInputSchemas['businessUnits.privateReviews'],
		output: TrustpilotEndpointOutputSchemas['businessUnits.privateReviews'],
	},
	'reviews.get': {
		input: TrustpilotEndpointInputSchemas['reviews.get'],
		output: TrustpilotEndpointOutputSchemas['reviews.get'],
	},
	'reviews.getPrivate': {
		input: TrustpilotEndpointInputSchemas['reviews.getPrivate'],
		output: TrustpilotEndpointOutputSchemas['reviews.getPrivate'],
	},
	'reviews.latest': {
		input: TrustpilotEndpointInputSchemas['reviews.latest'],
		output: TrustpilotEndpointOutputSchemas['reviews.latest'],
	},
	'reviews.getTags': {
		input: TrustpilotEndpointInputSchemas['reviews.getTags'],
		output: TrustpilotEndpointOutputSchemas['reviews.getTags'],
	},
	'reviews.webLinks': {
		input: TrustpilotEndpointInputSchemas['reviews.webLinks'],
		output: TrustpilotEndpointOutputSchemas['reviews.webLinks'],
	},
	'reviews.likes': {
		input: TrustpilotEndpointInputSchemas['reviews.likes'],
		output: TrustpilotEndpointOutputSchemas['reviews.likes'],
	},
	'consumers.reviews': {
		input: TrustpilotEndpointInputSchemas['consumers.reviews'],
		output: TrustpilotEndpointOutputSchemas['consumers.reviews'],
	},
	'consumerProfiles.get': {
		input: TrustpilotEndpointInputSchemas['consumerProfiles.get'],
		output: TrustpilotEndpointOutputSchemas['consumerProfiles.get'],
	},
	'consumerProfiles.getWithReviews': {
		input: TrustpilotEndpointInputSchemas['consumerProfiles.getWithReviews'],
		output: TrustpilotEndpointOutputSchemas['consumerProfiles.getWithReviews'],
	},
	'consumerProfiles.webLinks': {
		input: TrustpilotEndpointInputSchemas['consumerProfiles.webLinks'],
		output: TrustpilotEndpointOutputSchemas['consumerProfiles.webLinks'],
	},
	'consumerProfiles.bulk': {
		input: TrustpilotEndpointInputSchemas['consumerProfiles.bulk'],
		output: TrustpilotEndpointOutputSchemas['consumerProfiles.bulk'],
	},
	'consumerProfiles.createDisplayName': {
		input: TrustpilotEndpointInputSchemas['consumerProfiles.createDisplayName'],
		output:
			TrustpilotEndpointOutputSchemas['consumerProfiles.createDisplayName'],
	},
	'consumerProfiles.validateDisplayName': {
		input:
			TrustpilotEndpointInputSchemas['consumerProfiles.validateDisplayName'],
		output:
			TrustpilotEndpointOutputSchemas['consumerProfiles.validateDisplayName'],
	},
	'productReviews.summary': {
		input: TrustpilotEndpointInputSchemas['productReviews.summary'],
		output: TrustpilotEndpointOutputSchemas['productReviews.summary'],
	},
	'productReviews.list': {
		input: TrustpilotEndpointInputSchemas['productReviews.list'],
		output: TrustpilotEndpointOutputSchemas['productReviews.list'],
	},
	'productReviews.privateList': {
		input: TrustpilotEndpointInputSchemas['productReviews.privateList'],
		output: TrustpilotEndpointOutputSchemas['productReviews.privateList'],
	},
	'productReviews.privateGet': {
		input: TrustpilotEndpointInputSchemas['productReviews.privateGet'],
		output: TrustpilotEndpointOutputSchemas['productReviews.privateGet'],
	},
	'productReviews.summaries': {
		input: TrustpilotEndpointInputSchemas['productReviews.summaries'],
		output: TrustpilotEndpointOutputSchemas['productReviews.summaries'],
	},
	'productReviews.batchSummaries': {
		input: TrustpilotEndpointInputSchemas['productReviews.batchSummaries'],
		output: TrustpilotEndpointOutputSchemas['productReviews.batchSummaries'],
	},
	'productReviews.invitationLink': {
		input: TrustpilotEndpointInputSchemas['productReviews.invitationLink'],
		output: TrustpilotEndpointOutputSchemas['productReviews.invitationLink'],
	},
	'productReviews.createComment': {
		input: TrustpilotEndpointInputSchemas['productReviews.createComment'],
		output: TrustpilotEndpointOutputSchemas['productReviews.createComment'],
	},
	'productReviews.getConversation': {
		input: TrustpilotEndpointInputSchemas['productReviews.getConversation'],
		output: TrustpilotEndpointOutputSchemas['productReviews.getConversation'],
	},
	'productReviews.getComment': {
		input: TrustpilotEndpointInputSchemas['productReviews.getComment'],
		output: TrustpilotEndpointOutputSchemas['productReviews.getComment'],
	},
	'productReviews.updateComment': {
		input: TrustpilotEndpointInputSchemas['productReviews.updateComment'],
		output: TrustpilotEndpointOutputSchemas['productReviews.updateComment'],
	},
	'productReviews.publicConversation': {
		input: TrustpilotEndpointInputSchemas['productReviews.publicConversation'],
		output:
			TrustpilotEndpointOutputSchemas['productReviews.publicConversation'],
	},
	'productReviews.createConversation': {
		input: TrustpilotEndpointInputSchemas['productReviews.createConversation'],
		output:
			TrustpilotEndpointOutputSchemas['productReviews.createConversation'],
	},
	'productReviews.attributeSummaries': {
		input: TrustpilotEndpointInputSchemas['productReviews.attributeSummaries'],
		output:
			TrustpilotEndpointOutputSchemas['productReviews.attributeSummaries'],
	},
	'productReviews.importedSummary': {
		input: TrustpilotEndpointInputSchemas['productReviews.importedSummary'],
		output: TrustpilotEndpointOutputSchemas['productReviews.importedSummary'],
	},
	'productReviews.importedReviews': {
		input: TrustpilotEndpointInputSchemas['productReviews.importedReviews'],
		output: TrustpilotEndpointOutputSchemas['productReviews.importedReviews'],
	},
	'invitations.templates': {
		input: TrustpilotEndpointInputSchemas['invitations.templates'],
		output: TrustpilotEndpointOutputSchemas['invitations.templates'],
	},
	'invitations.link': {
		input: TrustpilotEndpointInputSchemas['invitations.link'],
		output: TrustpilotEndpointOutputSchemas['invitations.link'],
	},
	'dataSolutions.searchBusinessUnits': {
		input: TrustpilotEndpointInputSchemas['dataSolutions.searchBusinessUnits'],
		output:
			TrustpilotEndpointOutputSchemas['dataSolutions.searchBusinessUnits'],
	},
	'dataSolutions.findBusinessUnits': {
		input: TrustpilotEndpointInputSchemas['dataSolutions.findBusinessUnits'],
		output: TrustpilotEndpointOutputSchemas['dataSolutions.findBusinessUnits'],
	},
	'dataSolutions.businessUnitDetails': {
		input: TrustpilotEndpointInputSchemas['dataSolutions.businessUnitDetails'],
		output:
			TrustpilotEndpointOutputSchemas['dataSolutions.businessUnitDetails'],
	},
	'dataSolutions.latestReviews': {
		input: TrustpilotEndpointInputSchemas['dataSolutions.latestReviews'],
		output: TrustpilotEndpointOutputSchemas['dataSolutions.latestReviews'],
	},
	'dataSolutions.serviceReviews': {
		input: TrustpilotEndpointInputSchemas['dataSolutions.serviceReviews'],
		output: TrustpilotEndpointOutputSchemas['dataSolutions.serviceReviews'],
	},
	'dataSolutions.categories': {
		input: TrustpilotEndpointInputSchemas['dataSolutions.categories'],
		output: TrustpilotEndpointOutputSchemas['dataSolutions.categories'],
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof trustpilotEndpointsNested
>;

const trustpilotEndpointMeta = {
	'businessUnits.find': {
		riskLevel: 'read',
		description: 'Find a public business unit by domain name',
	},
	'businessUnits.get': {
		riskLevel: 'read',
		description: 'Get a business unit public profile and TrustScore',
	},
	'businessUnits.search': {
		riskLevel: 'read',
		description: 'Search public business units by name or domain',
	},
	'businessUnits.profileInfo': {
		riskLevel: 'read',
		description: 'Get a business unit company profile and contact details',
	},
	'businessUnits.webLinks': {
		riskLevel: 'read',
		description:
			'Get localized public profile and invitation links for a business unit',
	},
	'businessUnits.logo': {
		riskLevel: 'read',
		description: 'Get a business unit or location logo URL',
	},
	'businessUnits.promotionBoxImage': {
		riskLevel: 'read',
		description: 'Get a business unit promotion-box image URL',
	},
	'businessUnits.headerImage': {
		riskLevel: 'read',
		description: 'Get a business unit profile-header image URL',
	},
	'businessUnits.listCategories': {
		riskLevel: 'read',
		description: 'List the categories associated with a business unit',
	},
	'businessUnits.publicAll': {
		riskLevel: 'read',
		description: 'List public business units with cursor pagination',
	},
	'businessUnits.customerGuarantee': {
		riskLevel: 'read',
		description: 'Get customer guarantee content for a business unit',
	},
	'businessUnits.profilePromotion': {
		riskLevel: 'read',
		description: 'Get a business unit profile promotion and key brand messages',
	},
	'businessUnits.publicPromotionBox': {
		riskLevel: 'read',
		description: 'Get public promotion-box content for a business unit',
	},
	'businessUnits.reviews': {
		riskLevel: 'read',
		description: 'List public reviews for a business unit with filters',
	},
	'businessUnits.allReviews': {
		riskLevel: 'read',
		description:
			'Page through public business unit reviews without private contact data',
	},
	'businessUnits.privateReviews': {
		riskLevel: 'read',
		description: 'List private business unit reviews and customer details',
	},
	'reviews.get': {
		riskLevel: 'read',
		description: 'Get the public details of a service review',
	},
	'reviews.getPrivate': {
		riskLevel: 'read',
		description: 'Get private review information including customer data',
	},
	'reviews.latest': {
		riskLevel: 'read',
		description: 'Get the latest service reviews for selected languages',
	},
	'reviews.getTags': {
		riskLevel: 'read',
		description: 'Get tags assigned to a service review',
	},
	'reviews.webLinks': {
		riskLevel: 'read',
		description: 'Get localized links to a public service review',
	},
	'reviews.likes': {
		riskLevel: 'read',
		description: 'List consumers who liked a service review',
	},
	'consumers.reviews': {
		riskLevel: 'read',
		description: 'List reviews written by a Trustpilot consumer',
	},
	'consumerProfiles.get': {
		riskLevel: 'read',
		description: 'Get a consumer profile by consumer ID',
	},
	'consumerProfiles.getWithReviews': {
		riskLevel: 'read',
		description: 'Get a consumer profile and review count',
	},
	'consumerProfiles.webLinks': {
		riskLevel: 'read',
		description: 'Get localized links to a consumer profile',
	},
	'consumerProfiles.bulk': {
		riskLevel: 'read',
		description: 'Get multiple consumer profiles in one request',
	},
	'consumerProfiles.createDisplayName': {
		riskLevel: 'read',
		description: 'Create a valid consumer display name from input text',
	},
	'consumerProfiles.validateDisplayName': {
		riskLevel: 'read',
		description: 'Validate a consumer display name',
	},
	'productReviews.summary': {
		riskLevel: 'read',
		description: 'Get product review rating counts and average stars',
	},
	'productReviews.list': {
		riskLevel: 'read',
		description: 'List public product reviews by SKU or product URL',
	},
	'productReviews.privateList': {
		riskLevel: 'read',
		description: 'List private product reviews including customer details',
	},
	'productReviews.privateGet': {
		riskLevel: 'read',
		description: 'Get one private product review and customer details',
	},
	'productReviews.summaries': {
		riskLevel: 'read',
		description: 'List private product review summaries for a business unit',
	},
	'productReviews.batchSummaries': {
		riskLevel: 'read',
		description: 'Get public product review summaries for several SKUs',
	},
	'productReviews.invitationLink': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Create a product review invitation link and consume invitation allowance',
	},
	'productReviews.createComment': {
		riskLevel: 'destructive',
		description:
			'Publish a business comment on a product review conversation (public, seen by the reviewer)',
	},
	'productReviews.getConversation': {
		riskLevel: 'read',
		description: 'Get a private product review conversation and comments',
	},
	'productReviews.getComment': {
		riskLevel: 'read',
		description: 'Get one comment from a product review conversation',
	},
	'productReviews.updateComment': {
		riskLevel: 'destructive',
		description:
			'Replace the text of a published business comment on a product review conversation',
	},
	'productReviews.publicConversation': {
		riskLevel: 'read',
		description: 'Get a public product review conversation and comments',
	},
	'productReviews.createConversation': {
		riskLevel: 'write',
		description: 'Create a conversation for a product review',
	},
	'productReviews.attributeSummaries': {
		riskLevel: 'read',
		description: 'Get aggregated product attribute ratings for SKUs',
	},
	'productReviews.importedSummary': {
		riskLevel: 'read',
		description: 'Get rating counts for imported product reviews',
	},
	'productReviews.importedReviews': {
		riskLevel: 'read',
		description: 'List imported product reviews for one or more SKUs',
	},
	'invitations.templates': {
		riskLevel: 'read',
		description: 'List invitation templates available to a business unit',
	},
	'invitations.link': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Create a service review invitation link and consume invitation allowance',
	},
	'dataSolutions.searchBusinessUnits': {
		riskLevel: 'read',
		description: 'Search Data Solutions business units by name or domain',
	},
	'dataSolutions.findBusinessUnits': {
		riskLevel: 'read',
		description: 'Find Data Solutions business units by domain or category',
	},
	'dataSolutions.businessUnitDetails': {
		riskLevel: 'read',
		description: 'Get Data Solutions business details and review statistics',
	},
	'dataSolutions.latestReviews': {
		riskLevel: 'read',
		description: 'Get up to five recent Data Solutions service reviews',
	},
	'dataSolutions.serviceReviews': {
		riskLevel: 'read',
		description: 'Page through Data Solutions service reviews',
	},
	'dataSolutions.categories': {
		riskLevel: 'read',
		description: 'List Data Solutions business categories',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof trustpilotEndpointsNested
>;

const publicOperations = new Set<string>([
	'businessUnits.find',
	'businessUnits.get',
	'businessUnits.search',
	'businessUnits.profileInfo',
	'businessUnits.webLinks',
	'businessUnits.logo',
	'businessUnits.promotionBoxImage',
	'businessUnits.headerImage',
	'businessUnits.listCategories',
	'businessUnits.publicAll',
	'businessUnits.customerGuarantee',
	'businessUnits.profilePromotion',
	'businessUnits.publicPromotionBox',
	'businessUnits.reviews',
	'businessUnits.allReviews',
	'reviews.get',
	'reviews.latest',
	'reviews.webLinks',
	'reviews.likes',
	'consumers.reviews',
	'consumerProfiles.get',
	'consumerProfiles.getWithReviews',
	'consumerProfiles.webLinks',
	'consumerProfiles.bulk',
	'consumerProfiles.createDisplayName',
	'consumerProfiles.validateDisplayName',
	'productReviews.summary',
	'productReviews.list',
	'productReviews.batchSummaries',
	'productReviews.publicConversation',
	'productReviews.attributeSummaries',
	'productReviews.importedSummary',
	'productReviews.importedReviews',
	'dataSolutions.searchBusinessUnits',
	'dataSolutions.findBusinessUnits',
	'dataSolutions.businessUnitDetails',
	'dataSolutions.latestReviews',
	'dataSolutions.serviceReviews',
	'dataSolutions.categories',
]);

const defaultAuthType: AuthTypes = 'api_key' as const;
export const trustpilotAuthConfig = {
	api_key: { account: ['tenant_external_id'] as const },
	oauth_2: { account: ['tenant_external_id'] as const },
} as const satisfies PluginAuthConfig;

export type BaseTrustpilotPlugin<T extends TrustpilotPluginOptions> =
	CorsairPlugin<
		'trustpilot',
		typeof TrustpilotSchema,
		typeof trustpilotEndpointsNested,
		typeof trustpilotWebhooksNested,
		T,
		typeof defaultAuthType
	>;
export type InternalTrustpilotPlugin =
	BaseTrustpilotPlugin<TrustpilotPluginOptions>;
export type ExternalTrustpilotPlugin<T extends TrustpilotPluginOptions> =
	BaseTrustpilotPlugin<T>;

export function trustpilot<const T extends TrustpilotPluginOptions>(
	incomingOptions: TrustpilotPluginOptions & T = {} as TrustpilotPluginOptions &
		T,
): ExternalTrustpilotPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	const { DEFAULT: builtInDefault, ...builtIns } = errorHandlers;
	const { DEFAULT: callerDefault, ...callers } = options.errorHandlers ?? {};
	return {
		id: 'trustpilot',
		authConfig: trustpilotAuthConfig,
		schema: TrustpilotSchema,
		options,
		hooks: options.hooks,
		endpoints: trustpilotEndpointsNested,
		webhooks: trustpilotWebhooksNested,
		endpointMeta: trustpilotEndpointMeta,
		endpointSchemas: trustpilotEndpointSchemas,
		oauthConfig: {
			providerName: 'Trustpilot',
			authUrl: 'https://authenticate.trustpilot.com',
			tokenUrl:
				'https://api.trustpilot.com/v1/oauth/oauth-business-users-for-applications/accesstoken',
			tokenAuthMethod: 'basic',
			scopes: [],
		},
		pluginWebhookMatcher: undefined,
		errorHandlers: {
			...callers,
			...builtIns,
			...callers,
			DEFAULT: callerDefault ?? builtInDefault,
		},
		keyBuilder: async (ctx: TrustpilotKeyBuilderContext, source) => {
			if (source !== 'endpoint') return '';
			const operation = ctx.meteredOperationId;
			if (operation && publicOperations.has(operation)) {
				let key = options.apiKey;
				if (!key && ctx.authType === 'api_key') {
					key = (await ctx.keys.get_api_key()) ?? undefined;
				}
				if (!key && ctx.authType === 'oauth_2') {
					// Trustpilot's API key is the OAuth app's client id, so an
					// oauth_2 connection calls the public APIs with it.
					key =
						(await ctx.keys.get_integration_credentials()).client_id ??
						undefined;
				}
				if (key) return key;
				throw new AuthMissingError('trustpilot', 'api_key');
			}
			const token =
				ctx.authType === 'oauth_2'
					? await resolveTrustpilotOAuthToken(ctx)
					: undefined;
			if (token) return token;
			throw new AuthMissingError('trustpilot', 'oauth_2');
		},
	} satisfies InternalTrustpilotPlugin;
}

async function resolveTrustpilotOAuthToken(
	ctx: TrustpilotKeyBuilderContext & { authType: 'oauth_2' },
): Promise<string> {
	const credentials = await ctx.keys.get_integration_credentials();
	if (!credentials.client_secret && !ctx.hub) {
		const [accessToken, expiresAt] = await Promise.all([
			ctx.keys.get_access_token(),
			ctx.keys.get_expires_at(),
		]);
		const expiresAtSeconds = expiresAt ? Number(expiresAt) : undefined;
		const tokenIsFresh =
			Boolean(accessToken) &&
			(expiresAtSeconds === undefined ||
				(Number.isFinite(expiresAtSeconds) &&
					expiresAtSeconds > Math.floor(Date.now() / 1000) + 300));
		if (tokenIsFresh && accessToken) return accessToken;
		throw new AuthMissingError('trustpilot', 'oauth_2');
	}
	return getOAuthAccessToken(ctx, {
		plugin: 'trustpilot',
		tokenUrl:
			'https://api.trustpilot.com/v1/oauth/oauth-business-users-for-applications/accesstoken',
		tokenAuthMethod: 'basic',
		bodyFormat: 'form',
	});
}

export type { TrustpilotCredential, TrustpilotHost } from './client';
export type {
	TrustpilotEndpointInputs,
	TrustpilotEndpointOutputs,
	TrustpilotOperation,
} from './endpoints/types';
