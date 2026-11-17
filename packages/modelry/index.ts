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
	'products.list': {
		riskLevel: 'read',
		description:
			'List products in the workspace, with keyword, SKU, batch, tag and label filters. An empty result is returned as an empty list.',
	},
	'products.get': {
		riskLevel: 'read',
		description:
			'Get one product, with its assets and modeling requests under `included`.',
	},
	'products.create': {
		riskLevel: 'write',
		description: 'Create a product (title, SKU, tags, dimensions, links).',
	},
	'products.update': {
		riskLevel: 'write',
		description: 'Update the fields of an existing product.',
	},
	'products.delete': {
		riskLevel: 'destructive',
		description: 'Delete a product. This cannot be undone.',
	},
	'modelingRequests.list': {
		riskLevel: 'read',
		description:
			'List modeling requests (3D modelling orders), with workspace, SKU, batch and title filters.',
	},
	'modelingRequests.get': {
		riskLevel: 'read',
		description:
			'Get one modeling request by id or SKU: status, price, QA round and review categories.',
	},
	'modelingRequests.create': {
		riskLevel: 'destructive',
		description:
			'Order a custom 3D model from Modelry. Modelry quotes and bills per model, and the API has no cancel.',
	},
	'modelingRequests.approve': {
		riskLevel: 'destructive',
		description:
			'Accept a delivered model and finish customer QA. The API cannot undo an approval.',
	},
	'modelingRequests.reject': {
		riskLevel: 'destructive',
		description:
			'Reject a delivered model in customer QA and send it back to Modelry for adjustments. The API cannot undo a rejection.',
	},
	'modelingRequests.assets': {
		riskLevel: 'read',
		description:
			'List the files delivered for a modeling request (models, renders, textures) with download URLs.',
	},
	'productAssets.create': {
		riskLevel: 'write',
		description:
			'Attach an uploaded file to a product, using the signed blob id from `uploads.file` or `uploads.blob`.',
	},
	'productAssets.delete': {
		riskLevel: 'destructive',
		description: 'Delete a product asset. This cannot be undone.',
	},
	'embeds.list': {
		riskLevel: 'read',
		description:
			"List a product's 3D/AR web viewers (embeds). An empty result is returned as an empty list.",
	},
	'embeds.get': {
		riskLevel: 'read',
		description:
			'Get one embed, with its public viewer URL and loader script configuration.',
	},
	'embeds.publish': {
		riskLevel: 'write',
		description: 'Publish an embed so its viewer URL is publicly reachable.',
	},
	'embeds.delete': {
		riskLevel: 'destructive',
		description: 'Delete an embed. This cannot be undone.',
	},
	'reviews.create': {
		riskLevel: 'write',
		description:
			"Add review issues (comments for Modelry's artists) to a modeling request's current QA round.",
	},
	'uploads.blob': {
		riskLevel: 'write',
		description:
			'Start a direct upload: returns a signed blob id and a presigned URL to PUT the file to.',
	},
	'uploads.file': {
		riskLevel: 'write',
		description:
			'Upload a small file as base64 and get back its signed blob id.',
	},
	'workspaces.list': {
		riskLevel: 'read',
		description: 'List the workspaces the API token can access.',
	},
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
