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
import * as e from './endpoints';
import * as s from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { ModelrySchema } from './schema';

export type ModelryPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalModelryPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof nested>;
};
export type ModelryContext = CorsairPluginContext<
	typeof ModelrySchema,
	ModelryPluginOptions
>;
export type ModelryKeyBuilderContext = KeyBuilderContext<ModelryPluginOptions>;
const nested = {
	products: {
		list: e.products_list,
		get: e.products_get,
		create: e.products_create,
		update: e.products_update,
		delete: e.products_delete,
	},
	modelingRequests: {
		list: e.modelingRequests_list,
		get: e.modelingRequests_get,
		create: e.modelingRequests_create,
		approve: e.modelingRequests_approve,
		reject: e.modelingRequests_reject,
		assets: e.modelingRequests_assets,
	},
	productAssets: {
		create: e.productAssets_create,
		delete: e.productAssets_delete,
	},
	embeds: {
		list: e.embeds_list,
		get: e.embeds_get,
		publish: e.embeds_publish,
		delete: e.embeds_delete,
	},
	reviews: { create: e.reviews_create },
	uploads: { blob: e.uploads_blob, file: e.uploads_file },
	workspaces: { list: e.workspaces_list },
} as const;
export type ModelryBoundEndpoints = BindEndpoints<typeof nested>;
export const modelryEndpointSchemas = {
	'products.list': { input: s.products_listInput, output: s.list },
	'products.get': { input: s.products_getInput, output: s.single },
	'products.create': { input: s.products_createInput, output: s.single },
	'products.update': { input: s.products_updateInput, output: s.single },
	'products.delete': { input: s.products_deleteInput, output: s.empty },
	'modelingRequests.list': {
		input: s.modelingRequests_listInput,
		output: s.list,
	},
	'modelingRequests.get': {
		input: s.modelingRequests_getInput,
		output: s.single,
	},
	'modelingRequests.create': {
		input: s.modelingRequests_createInput,
		output: s.single,
	},
	'modelingRequests.approve': {
		input: s.modelingRequests_approveInput,
		output: s.single,
	},
	'modelingRequests.reject': {
		input: s.modelingRequests_rejectInput,
		output: s.single,
	},
	'modelingRequests.assets': {
		input: s.modelingRequests_assetsInput,
		output: s.list,
	},
	'productAssets.create': {
		input: s.productAssets_createInput,
		output: s.single,
	},
	'productAssets.delete': {
		input: s.productAssets_deleteInput,
		output: s.empty,
	},
	'embeds.list': { input: s.embeds_listInput, output: s.list },
	'embeds.get': { input: s.embeds_getInput, output: s.single },
	'embeds.publish': { input: s.embeds_publishInput, output: s.single },
	'embeds.delete': { input: s.embeds_deleteInput, output: s.empty },
	'reviews.create': { input: s.reviews_createInput, output: s.reviewOutput },
	'uploads.blob': { input: s.uploads_blobInput, output: s.blobOutput },
	'uploads.file': { input: s.uploads_fileInput, output: s.uploadOutput },
	'workspaces.list': { input: s.workspaces_listInput, output: s.list },
} as const satisfies RequiredPluginEndpointSchemas<typeof nested>;
const endpointMeta = {
	'products.list': { riskLevel: 'read', description: 'List products' },
	'products.get': { riskLevel: 'read', description: 'Get products' },
	'products.create': { riskLevel: 'write', description: 'Create products' },
	'products.update': { riskLevel: 'write', description: 'Update products' },
	'products.delete': {
		riskLevel: 'destructive',
		description: 'Delete products',
	},
	'modelingRequests.list': {
		riskLevel: 'read',
		description: 'List modeling requests',
	},
	'modelingRequests.get': {
		riskLevel: 'read',
		description: 'Get modeling requests',
	},
	'modelingRequests.create': {
		riskLevel: 'write',
		description: 'Create modeling requests',
	},
	'modelingRequests.approve': {
		riskLevel: 'write',
		description: 'Approve modeling requests',
	},
	'modelingRequests.reject': {
		riskLevel: 'write',
		description: 'Reject modeling requests',
	},
	'modelingRequests.assets': {
		riskLevel: 'read',
		description: 'List modeling request assets',
	},
	'productAssets.create': {
		riskLevel: 'write',
		description: 'Create product assets',
	},
	'productAssets.delete': {
		riskLevel: 'destructive',
		description: 'Delete product assets',
	},
	'embeds.list': { riskLevel: 'read', description: 'List embeds' },
	'embeds.get': { riskLevel: 'read', description: 'Get embeds' },
	'embeds.publish': { riskLevel: 'write', description: 'Publish embeds' },
	'embeds.delete': { riskLevel: 'destructive', description: 'Delete embeds' },
	'reviews.create': { riskLevel: 'write', description: 'Create reviews' },
	'uploads.blob': {
		riskLevel: 'write',
		description: 'Create a direct upload blob',
	},
	'uploads.file': { riskLevel: 'write', description: 'Upload a base64 file' },
	'workspaces.list': { riskLevel: 'read', description: 'List workspaces' },
} as const satisfies RequiredPluginEndpointMeta<typeof nested>;
export const modelryAuthConfig = {
	api_key: { account: ['tenant_external_id'] as const },
} as const satisfies PluginAuthConfig;
export type BaseModelryPlugin<T extends ModelryPluginOptions> = CorsairPlugin<
	'modelry',
	typeof ModelrySchema,
	typeof nested,
	Record<string, never>,
	T,
	'api_key'
>;
export type InternalModelryPlugin = BaseModelryPlugin<ModelryPluginOptions>;
export type ExternalModelryPlugin<T extends ModelryPluginOptions> =
	BaseModelryPlugin<T>;
export function modelry<const T extends ModelryPluginOptions>(
	incomingOptions: ModelryPluginOptions & T = {} as ModelryPluginOptions & T,
): ExternalModelryPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? ('api_key' as const),
	};
	const { DEFAULT, ...specificHandlers } = {
		...errorHandlers,
		...options.errorHandlers,
	};
	return {
		id: 'modelry',
		authConfig: modelryAuthConfig,
		schema: ModelrySchema,
		options,
		hooks: options.hooks,
		endpoints: nested,
		webhooks: {},
		endpointMeta,
		endpointSchemas: modelryEndpointSchemas,
		webhookSchemas: {},
		pluginWebhookMatcher: () => false,
		errorHandlers: { ...specificHandlers, DEFAULT },
		keyBuilder: async (ctx: ModelryKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key?.trim()) return options.key;
			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();
				if (key?.trim()) return key;
			}
			// The runtime does not expose single- vs multi-tenant mode here, so an
			// environment fallback could authenticate an unconnected tenant.
			throw new AuthMissingError('modelry', 'api_key');
		},
	} satisfies InternalModelryPlugin;
}
export * from './endpoints/types';
