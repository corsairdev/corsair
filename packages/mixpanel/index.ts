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
import type { MixpanelRegion } from './client';
import { packMixpanelKey, parseProjectId, parseRegion } from './client';
import {
	mixpanelEndpointMetaMap,
	mixpanelEndpointSchemaMap,
	mixpanelEndpointsNested,
} from './endpoints';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { MixpanelSchema } from './schema';

export type MixpanelPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/** Service account username; otherwise read from the account. */
	serviceAccountUsername?: string;
	/** Service account secret; otherwise the account's api_key. */
	serviceAccountSecret?: string;
	/** The Mixpanel project id every service-account request carries. */
	projectId?: number;
	/** Data residency of the project: us (default), eu or in. */
	region?: MixpanelRegion;
	/** Project token for /track, /engage, /groups, identity and GDPR calls. */
	projectToken?: string;
	/** GDPR API OAuth token (Personal Settings, Data & Privacy). */
	gdprToken?: string;
	hooks?: InternalMixpanelPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof mixpanelEndpointsNested>;
};

export type MixpanelContext = CorsairPluginContext<
	typeof MixpanelSchema,
	MixpanelPluginOptions,
	undefined,
	typeof mixpanelAuthConfig
>;

export type MixpanelKeyBuilderContext = KeyBuilderContext<
	MixpanelPluginOptions,
	typeof mixpanelAuthConfig
>;

export type MixpanelBoundEndpoints = BindEndpoints<
	typeof mixpanelEndpointsNested
>;

export const mixpanelEndpointSchemas =
	mixpanelEndpointSchemaMap satisfies RequiredPluginEndpointSchemas<
		typeof mixpanelEndpointsNested
	>;

const mixpanelEndpointMeta =
	mixpanelEndpointMetaMap satisfies RequiredPluginEndpointMeta<
		typeof mixpanelEndpointsNested
	>;

const defaultAuthType = 'api_key' as const;

/**
 * The account's `api_key` is the service account secret. Beside it:
 * - service_account_username: the service account username
 * - project_id: the project every service-account request names
 * - region: us (default), eu or in, for data residency hosts
 * - project_token: optional; needed for track, profile and group updates,
 *   identity calls and GDPR
 * - gdpr_token: optional; the OAuth token the GDPR API takes
 */
export const mixpanelAuthConfig = {
	api_key: {
		account: [
			'service_account_username',
			'project_id',
			'region',
			'project_token',
			'gdpr_token',
		] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseMixpanelPlugin<T extends MixpanelPluginOptions> = CorsairPlugin<
	'mixpanel',
	typeof MixpanelSchema,
	typeof mixpanelEndpointsNested,
	{},
	T,
	typeof defaultAuthType,
	typeof mixpanelAuthConfig
>;

export type InternalMixpanelPlugin = BaseMixpanelPlugin<MixpanelPluginOptions>;

export type ExternalMixpanelPlugin<T extends MixpanelPluginOptions> =
	BaseMixpanelPlugin<T>;

function present(value: string | null | undefined): string | undefined {
	return value === null || value === undefined || value.trim() === ''
		? undefined
		: value.trim();
}

export function mixpanel<const T extends MixpanelPluginOptions>(
	incomingOptions: MixpanelPluginOptions & T = {} as MixpanelPluginOptions & T,
): ExternalMixpanelPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'mixpanel',
		schema: MixpanelSchema,
		options: options,
		hooks: options.hooks,
		endpoints: mixpanelEndpointsNested,
		webhooks: {},
		authConfig: mixpanelAuthConfig,
		endpointMeta: mixpanelEndpointMeta,
		endpointSchemas: mixpanelEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: MixpanelKeyBuilderContext, source) => {
			if (source !== 'endpoint') {
				throw new AuthMissingError('mixpanel', ctx.authType ?? 'api_key');
			}
			const [secret, username, projectId, region, projectToken, gdprToken] =
				await Promise.all([
					options.serviceAccountSecret ?? ctx.keys.get_api_key(),
					options.serviceAccountUsername ??
						ctx.keys.get_service_account_username(),
					options.projectId ?? ctx.keys.get_project_id(),
					options.region ?? ctx.keys.get_region(),
					options.projectToken ?? ctx.keys.get_project_token(),
					options.gdprToken ?? ctx.keys.get_gdpr_token(),
				]);
			const parsedProjectId = parseProjectId(projectId);
			if (!present(secret) || !present(username) || !parsedProjectId) {
				throw new AuthMissingError('mixpanel', ctx.authType ?? 'api_key');
			}
			return packMixpanelKey({
				username: present(username) as string,
				secret: present(secret) as string,
				projectId: parsedProjectId,
				region: parseRegion(region) ?? 'us',
				projectToken: present(projectToken),
				gdprToken: present(gdprToken),
			});
		},
	} satisfies InternalMixpanelPlugin;
}

export type {
	MixpanelCredentials,
	MixpanelRegion,
	MixpanelService,
} from './client';
export {
	MixpanelConfigError,
	mixpanelHost,
	packMixpanelKey,
	parseMixpanelKey,
} from './client';

export type {
	MixpanelEndpointInputs,
	MixpanelEndpointOutputs,
	MixpanelOperationPath,
} from './endpoints/types';
