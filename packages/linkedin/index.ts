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
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';

import {
	attachLinkedInRefreshAuth,
	getValidLinkedInAccessToken,
} from './client';
import {
	AdsEndpoints,
	CommentsEndpoints,
	ImagesEndpoints,
	OrganizationsEndpoints,
	PostsEndpoints,
	ProfileEndpoints,
	ReactionsEndpoints,
	VideosEndpoints,
} from './endpoints/index';
import type {
	LinkedInEndpointInputs,
	LinkedInEndpointOutputs,
} from './endpoints/types';
import {
	LinkedInEndpointInputSchemas,
	LinkedInEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { LinkedInSchema } from './schema';

export const linkedinAuthConfig = {
	oauth_2: {
		// client_id and client_secret are provided by the base framework and must not
		// be declared in the integration array.
		integration: [] as const,
	},
} as const satisfies PluginAuthConfig;

type LinkedInEndpoint<K extends keyof LinkedInEndpointOutputs> =
	CorsairEndpoint<
		LinkedInContext,
		LinkedInEndpointInputs[K],
		LinkedInEndpointOutputs[K]
	>;

export type LinkedInEndpoints = {
	GetMyInfo: LinkedInEndpoint<'GetMyInfo'>;
	GetPerson: LinkedInEndpoint<'GetPerson'>;
	CreatePost: LinkedInEndpoint<'CreatePost'>;
	CreateArticleShare: LinkedInEndpoint<'CreateArticleShare'>;
	GetPostContent: LinkedInEndpoint<'GetPostContent'>;
	DeletePost: LinkedInEndpoint<'DeletePost'>;
	DeleteSharePost: LinkedInEndpoint<'DeleteSharePost'>;
	DeleteUgcPost: LinkedInEndpoint<'DeleteUgcPost'>;
	CreateComment: LinkedInEndpoint<'CreateComment'>;
	ListReactions: LinkedInEndpoint<'ListReactions'>;
	GetImage: LinkedInEndpoint<'GetImage'>;
	GetImages: LinkedInEndpoint<'GetImages'>;
	InitializeImageUpload: LinkedInEndpoint<'InitializeImageUpload'>;
	RegisterImageUpload: LinkedInEndpoint<'RegisterImageUpload'>;
	GetVideos: LinkedInEndpoint<'GetVideos'>;
	GetCompanyInfo: LinkedInEndpoint<'GetCompanyInfo'>;
	GetNetworkSize: LinkedInEndpoint<'GetNetworkSize'>;
	GetOrgPageStats: LinkedInEndpoint<'GetOrgPageStats'>;
	GetShareStats: LinkedInEndpoint<'GetShareStats'>;
	GetAdTargetingFacets: LinkedInEndpoint<'GetAdTargetingFacets'>;
	GetAudienceCounts: LinkedInEndpoint<'GetAudienceCounts'>;
	SearchAdTargetingEntities: LinkedInEndpoint<'SearchAdTargetingEntities'>;
};

export const LinkedInEndpointsNested = {
	profile: {
		getMyInfo: ProfileEndpoints.getMyInfo,
		getPerson: ProfileEndpoints.getPerson,
	},

	posts: {
		create: PostsEndpoints.create,
		createArticleShare: PostsEndpoints.createArticleShare,
		getContent: PostsEndpoints.getContent,
		delete: PostsEndpoints.delete,
		deleteShare: PostsEndpoints.deleteShare,
		deleteUgc: PostsEndpoints.deleteUgc,
	},

	comments: {
		create: CommentsEndpoints.create,
	},

	reactions: {
		list: ReactionsEndpoints.list,
	},

	images: {
		get: ImagesEndpoints.get,
		list: ImagesEndpoints.list,
		initializeUpload: ImagesEndpoints.initializeUpload,
		registerUpload: ImagesEndpoints.registerUpload,
	},

	videos: {
		list: VideosEndpoints.list,
	},

	organizations: {
		getCompanyInfo: OrganizationsEndpoints.getCompanyInfo,
		getNetworkSize: OrganizationsEndpoints.getNetworkSize,
		getPageStats: OrganizationsEndpoints.getPageStats,
		getShareStats: OrganizationsEndpoints.getShareStats,
	},

	ads: {
		getTargetingFacets: AdsEndpoints.getTargetingFacets,
		getAudienceCounts: AdsEndpoints.getAudienceCounts,
		searchTargetingEntities: AdsEndpoints.searchTargetingEntities,
	},
} as const;

export type LinkedInBoundEndpoints = BindEndpoints<
	typeof LinkedInEndpointsNested
>;

export const LinkedInEndpointSchemas = {
	'profile.getMyInfo': {
		input: LinkedInEndpointInputSchemas.GetMyInfo,
		output: LinkedInEndpointOutputSchemas.GetMyInfo,
	},
	'profile.getPerson': {
		input: LinkedInEndpointInputSchemas.GetPerson,
		output: LinkedInEndpointOutputSchemas.GetPerson,
	},
	'posts.create': {
		input: LinkedInEndpointInputSchemas.CreatePost,
		output: LinkedInEndpointOutputSchemas.CreatePost,
	},
	'posts.createArticleShare': {
		input: LinkedInEndpointInputSchemas.CreateArticleShare,
		output: LinkedInEndpointOutputSchemas.CreateArticleShare,
	},
	'posts.getContent': {
		input: LinkedInEndpointInputSchemas.GetPostContent,
		output: LinkedInEndpointOutputSchemas.GetPostContent,
	},
	'posts.delete': {
		input: LinkedInEndpointInputSchemas.DeletePost,
		output: LinkedInEndpointOutputSchemas.DeletePost,
	},
	'posts.deleteShare': {
		input: LinkedInEndpointInputSchemas.DeleteSharePost,
		output: LinkedInEndpointOutputSchemas.DeleteSharePost,
	},
	'posts.deleteUgc': {
		input: LinkedInEndpointInputSchemas.DeleteUgcPost,
		output: LinkedInEndpointOutputSchemas.DeleteUgcPost,
	},
	'comments.create': {
		input: LinkedInEndpointInputSchemas.CreateComment,
		output: LinkedInEndpointOutputSchemas.CreateComment,
	},
	'reactions.list': {
		input: LinkedInEndpointInputSchemas.ListReactions,
		output: LinkedInEndpointOutputSchemas.ListReactions,
	},
	'images.get': {
		input: LinkedInEndpointInputSchemas.GetImage,
		output: LinkedInEndpointOutputSchemas.GetImage,
	},
	'images.list': {
		input: LinkedInEndpointInputSchemas.GetImages,
		output: LinkedInEndpointOutputSchemas.GetImages,
	},
	'images.initializeUpload': {
		input: LinkedInEndpointInputSchemas.InitializeImageUpload,
		output: LinkedInEndpointOutputSchemas.InitializeImageUpload,
	},
	'images.registerUpload': {
		input: LinkedInEndpointInputSchemas.RegisterImageUpload,
		output: LinkedInEndpointOutputSchemas.RegisterImageUpload,
	},
	'videos.list': {
		input: LinkedInEndpointInputSchemas.GetVideos,
		output: LinkedInEndpointOutputSchemas.GetVideos,
	},
	'organizations.getCompanyInfo': {
		input: LinkedInEndpointInputSchemas.GetCompanyInfo,
		output: LinkedInEndpointOutputSchemas.GetCompanyInfo,
	},
	'organizations.getNetworkSize': {
		input: LinkedInEndpointInputSchemas.GetNetworkSize,
		output: LinkedInEndpointOutputSchemas.GetNetworkSize,
	},
	'organizations.getPageStats': {
		input: LinkedInEndpointInputSchemas.GetOrgPageStats,
		output: LinkedInEndpointOutputSchemas.GetOrgPageStats,
	},
	'organizations.getShareStats': {
		input: LinkedInEndpointInputSchemas.GetShareStats,
		output: LinkedInEndpointOutputSchemas.GetShareStats,
	},
	'ads.getTargetingFacets': {
		input: LinkedInEndpointInputSchemas.GetAdTargetingFacets,
		output: LinkedInEndpointOutputSchemas.GetAdTargetingFacets,
	},
	'ads.getAudienceCounts': {
		input: LinkedInEndpointInputSchemas.GetAudienceCounts,
		output: LinkedInEndpointOutputSchemas.GetAudienceCounts,
	},
	'ads.searchTargetingEntities': {
		input: LinkedInEndpointInputSchemas.SearchAdTargetingEntities,
		output: LinkedInEndpointOutputSchemas.SearchAdTargetingEntities,
	},
};

const linkedinEndpointMeta = {
	'profile.getMyInfo': {
		riskLevel: 'read',
		description: "Fetch the authenticated LinkedIn member's profile.",
	},
	'profile.getPerson': {
		riskLevel: 'read',
		description: 'Retrieve a LinkedIn member profile by person ID.',
	},
	'posts.create': {
		riskLevel: 'write',
		description: 'Create a new LinkedIn post for a member or organization.',
	},
	'posts.createArticleShare': {
		riskLevel: 'write',
		description: 'Create an article or URL share on LinkedIn.',
	},
	'posts.getContent': {
		riskLevel: 'read',
		description: 'Retrieve detailed content of a specific LinkedIn post.',
	},
	'posts.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a LinkedIn post via the Posts API.',
	},
	'posts.deleteShare': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a LinkedIn post (share) by its share_id.',
	},
	'posts.deleteUgc': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a UGC post via the legacy v2/ugcPosts endpoint.',
	},
	'comments.create': {
		riskLevel: 'write',
		description: 'Create a comment on a LinkedIn share, UGC post, or comment.',
	},
	'reactions.list': {
		riskLevel: 'read',
		description: 'List reactions on a LinkedIn entity.',
	},
	'images.get': {
		riskLevel: 'read',
		description: 'Retrieve details of a single LinkedIn image by URN.',
	},
	'images.list': {
		riskLevel: 'read',
		description: 'Retrieve LinkedIn image metadata.',
	},
	'images.initializeUpload': {
		riskLevel: 'write',
		description: 'Initialize a LinkedIn image upload and return an upload URL.',
	},
	'images.registerUpload': {
		riskLevel: 'write',
		description: 'Register a native image upload for feed shares.',
	},
	'videos.list': {
		riskLevel: 'read',
		description: 'Retrieve LinkedIn video metadata.',
	},
	'organizations.getCompanyInfo': {
		riskLevel: 'read',
		description: 'Retrieve organizations where the user has roles.',
	},
	'organizations.getNetworkSize': {
		riskLevel: 'read',
		description: 'Retrieve the follower count for a LinkedIn organization.',
	},
	'organizations.getPageStats': {
		riskLevel: 'read',
		description: 'Retrieve page statistics for a LinkedIn organization.',
	},
	'organizations.getShareStats': {
		riskLevel: 'read',
		description: 'Retrieve share statistics for an organization.',
	},
	'ads.getTargetingFacets': {
		riskLevel: 'read',
		description: 'Retrieve available LinkedIn ad targeting facets.',
	},
	'ads.getAudienceCounts': {
		riskLevel: 'read',
		description: 'Retrieve audience size counts for targeting criteria.',
	},
	'ads.searchTargetingEntities': {
		riskLevel: 'read',
		description: 'Search LinkedIn ad targeting entities via typeahead.',
	},
} satisfies RequiredPluginEndpointMeta<typeof LinkedInEndpointsNested>;

export type LinkedInPluginOptions = {
	authType?: PickAuth<'oauth_2'>;
	key?: string;
	hooks?: InternalLinkedInPlugin['hooks'];
	permissions?: PluginPermissionsConfig<typeof LinkedInEndpointsNested>;
	errorHandlers?: CorsairErrorHandler;
};

export type LinkedInContext = CorsairPluginContext<
	typeof LinkedInSchema,
	LinkedInPluginOptions,
	undefined,
	typeof linkedinAuthConfig
>;

export type LinkedInKeyBuilderContext = KeyBuilderContext<
	LinkedInPluginOptions,
	typeof linkedinAuthConfig
>;

const defaultAuthType = 'oauth_2' as const;

const LinkedInWebhooksNested = {} as const;

export type BaseLinkedInPlugin<T extends LinkedInPluginOptions> = CorsairPlugin<
	'linkedin',
	typeof LinkedInSchema,
	typeof LinkedInEndpointsNested,
	typeof LinkedInWebhooksNested,
	T,
	typeof defaultAuthType,
	typeof linkedinAuthConfig
>;

export type InternalLinkedInPlugin = BaseLinkedInPlugin<LinkedInPluginOptions>;

export type ExternalLinkedInPlugin<T extends LinkedInPluginOptions> =
	BaseLinkedInPlugin<T>;

export function linkedin<const T extends LinkedInPluginOptions>(
	// Default to empty options; the assertion satisfies the `& T` intersection for
	// the generic default, matching the shared plugin factory pattern.
	incomingOptions: LinkedInPluginOptions & T = {} as LinkedInPluginOptions & T,
): ExternalLinkedInPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'linkedin',
		schema: LinkedInSchema,
		options,
		authConfig: linkedinAuthConfig,
		oauthConfig: {
			providerName: 'LinkedIn',
			authUrl: 'https://www.linkedin.com/oauth/v2/authorization',
			tokenUrl: 'https://www.linkedin.com/oauth/v2/accessToken',
			tokenAuthMethod: 'body',
			scopes: [
				'openid',
				'profile',
				'email',
				'r_basicprofile',
				'r_member_social',
				'w_member_social',
				'r_organization_social',
				'w_organization_social',
				'rw_organization_admin',
				'r_organization_admin',
				'r_organization_relationships',
				'r_ads',
				'rw_ads',
				'r_1st_connections_size',
			],
		},
		hooks: options.hooks,
		endpoints: LinkedInEndpointsNested,
		endpointSchemas: LinkedInEndpointSchemas,
		endpointMeta: linkedinEndpointMeta,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: LinkedInKeyBuilderContext) => {
			if (options.key) {
				return options.key;
			}

			if (ctx.authType !== 'oauth_2') {
				throw new AuthMissingError('linkedin', 'oauth_2');
			}

			const [
				storedAccessToken,
				expiresAt,
				refreshToken,
				integrationCredentials,
			] = await Promise.all([
				ctx.keys.get_access_token(),
				ctx.keys.get_expires_at(),
				ctx.keys.get_refresh_token(),
				ctx.keys.get_integration_credentials(),
			]);

			const clientId = integrationCredentials.client_id;
			const clientSecret = integrationCredentials.client_secret;

			if (!clientId || !clientSecret) {
				throw new Error('[corsair:linkedin] No client id or client secret');
			}

			if (!refreshToken) {
				throw new AuthMissingError('linkedin', 'oauth_2');
			}

			let result: Awaited<ReturnType<typeof getValidLinkedInAccessToken>>;
			try {
				result = await getValidLinkedInAccessToken({
					accessToken: storedAccessToken ?? null,
					refreshToken,
					expiresAt: expiresAt ? Number(expiresAt) : null,
					clientId,
					clientSecret,
				});
			} catch (error) {
				throw new Error(
					`[corsair:linkedin] Failed to obtain access token: ${error instanceof Error ? error.message : String(error)}`,
				);
			}

			if (result.refreshed) {
				try {
					await ctx.keys.set_access_token(result.accessToken);
					await ctx.keys.set_expires_at(String(result.expiresAt));
					// LinkedIn may rotate the refresh token; persist the latest one.
					await ctx.keys.set_refresh_token(result.refreshToken);
				} catch (error) {
					throw new Error(
						`[corsair:linkedin] Token was refreshed but failed to persist new credentials: ${error instanceof Error ? error.message : String(error)}`,
					);
				}
			}

			attachLinkedInRefreshAuth(ctx, async () => {
				const currentRefreshToken =
					(await ctx.keys.get_refresh_token()) ?? refreshToken;

				const fresh = await getValidLinkedInAccessToken({
					accessToken: null,
					refreshToken: currentRefreshToken,
					expiresAt: null,
					clientId,
					clientSecret,
					forceRefresh: true,
				});

				await ctx.keys.set_access_token(fresh.accessToken);
				await ctx.keys.set_expires_at(String(fresh.expiresAt));
				if (fresh.refreshToken !== currentRefreshToken) {
					await ctx.keys.set_refresh_token(fresh.refreshToken);
				}

				return fresh.accessToken;
			});

			return result.accessToken;
		},
	} satisfies InternalLinkedInPlugin;
}
