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
import * as Discovery from './endpoints/discovery';
import * as Files from './endpoints/files';
import * as Images from './endpoints/images';
import * as Operations from './endpoints/operations';
import * as ProductSets from './endpoints/product-sets';
import * as Products from './endpoints/products';
import * as ReferenceImages from './endpoints/reference-images';
import type {
	GoogleCloudVisionEndpointInputs,
	GoogleCloudVisionEndpointOutputs,
} from './endpoints/types';
import {
	GoogleCloudVisionEndpointInputSchemas,
	GoogleCloudVisionEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { GoogleCloudVisionSchema } from './schema';

export type GoogleCloudVisionPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	hooks?: InternalGoogleCloudVisionPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<
		typeof googleCloudVisionEndpointsNested
	>;
};

export type GoogleCloudVisionContext = CorsairPluginContext<
	typeof GoogleCloudVisionSchema,
	GoogleCloudVisionPluginOptions
>;

export type GoogleCloudVisionKeyBuilderContext =
	KeyBuilderContext<GoogleCloudVisionPluginOptions>;

export type GoogleCloudVisionBoundEndpoints = BindEndpoints<
	typeof googleCloudVisionEndpointsNested
>;

type GoogleCloudVisionEndpoint<
	K extends keyof GoogleCloudVisionEndpointOutputs,
> = CorsairEndpoint<
	GoogleCloudVisionContext,
	GoogleCloudVisionEndpointInputs[K],
	GoogleCloudVisionEndpointOutputs[K]
>;

export type GoogleCloudVisionEndpoints = {
	imagesAnnotate: GoogleCloudVisionEndpoint<'imagesAnnotate'>;
	imagesAsyncBatchAnnotate: GoogleCloudVisionEndpoint<'imagesAsyncBatchAnnotate'>;
	imagesLocationAnnotate: GoogleCloudVisionEndpoint<'imagesLocationAnnotate'>;
	filesAnnotate: GoogleCloudVisionEndpoint<'filesAnnotate'>;
	filesAsyncBatchAnnotate: GoogleCloudVisionEndpoint<'filesAsyncBatchAnnotate'>;
	productSetsCreate: GoogleCloudVisionEndpoint<'productSetsCreate'>;
	productSetsGet: GoogleCloudVisionEndpoint<'productSetsGet'>;
	productSetsList: GoogleCloudVisionEndpoint<'productSetsList'>;
	productSetsUpdate: GoogleCloudVisionEndpoint<'productSetsUpdate'>;
	productSetsDelete: GoogleCloudVisionEndpoint<'productSetsDelete'>;
	productSetsImport: GoogleCloudVisionEndpoint<'productSetsImport'>;
	productSetsAddProduct: GoogleCloudVisionEndpoint<'productSetsAddProduct'>;
	productSetsRemoveProduct: GoogleCloudVisionEndpoint<'productSetsRemoveProduct'>;
	productSetsListProducts: GoogleCloudVisionEndpoint<'productSetsListProducts'>;
	productsCreate: GoogleCloudVisionEndpoint<'productsCreate'>;
	productsGet: GoogleCloudVisionEndpoint<'productsGet'>;
	productsList: GoogleCloudVisionEndpoint<'productsList'>;
	productsUpdate: GoogleCloudVisionEndpoint<'productsUpdate'>;
	productsDelete: GoogleCloudVisionEndpoint<'productsDelete'>;
	productsPurge: GoogleCloudVisionEndpoint<'productsPurge'>;
	referenceImagesCreate: GoogleCloudVisionEndpoint<'referenceImagesCreate'>;
	referenceImagesGet: GoogleCloudVisionEndpoint<'referenceImagesGet'>;
	referenceImagesDelete: GoogleCloudVisionEndpoint<'referenceImagesDelete'>;
	referenceImagesList: GoogleCloudVisionEndpoint<'referenceImagesList'>;
	operationsGet: GoogleCloudVisionEndpoint<'operationsGet'>;
	operationsList: GoogleCloudVisionEndpoint<'operationsList'>;
	operationsCancel: GoogleCloudVisionEndpoint<'operationsCancel'>;
	operationsDelete: GoogleCloudVisionEndpoint<'operationsDelete'>;
	locationsList: GoogleCloudVisionEndpoint<'locationsList'>;
};

const googleCloudVisionEndpointsNested = {
	images: {
		annotate: Images.annotate,
		asyncBatchAnnotate: Images.asyncBatchAnnotate,
		locationAnnotate: Images.locationAnnotate,
	},
	files: {
		annotate: Files.annotate,
		asyncBatchAnnotate: Files.asyncBatchAnnotate,
	},
	productSets: {
		create: ProductSets.create,
		get: ProductSets.get,
		list: ProductSets.list,
		update: ProductSets.update,
		delete: ProductSets.deleteSet,
		import: ProductSets.importSets,
		addProduct: ProductSets.addProduct,
		removeProduct: ProductSets.removeProduct,
		listProducts: ProductSets.listProducts,
	},
	products: {
		create: Products.create,
		get: Products.get,
		list: Products.list,
		update: Products.update,
		delete: Products.deleteProduct,
		purge: Products.purge,
	},
	referenceImages: {
		create: ReferenceImages.create,
		get: ReferenceImages.get,
		delete: ReferenceImages.deleteImage,
		list: ReferenceImages.list,
	},
	operations: {
		get: Operations.get,
		list: Operations.list,
		cancel: Operations.cancel,
		delete: Operations.deleteOperation,
	},
	locations: {
		list: Discovery.listLocations,
	},
} as const;

export const googleCloudVisionEndpointSchemas = {
	'images.annotate': {
		input: GoogleCloudVisionEndpointInputSchemas.imagesAnnotate,
		output: GoogleCloudVisionEndpointOutputSchemas.imagesAnnotate,
	},
	'images.asyncBatchAnnotate': {
		input: GoogleCloudVisionEndpointInputSchemas.imagesAsyncBatchAnnotate,
		output: GoogleCloudVisionEndpointOutputSchemas.imagesAsyncBatchAnnotate,
	},
	'images.locationAnnotate': {
		input: GoogleCloudVisionEndpointInputSchemas.imagesLocationAnnotate,
		output: GoogleCloudVisionEndpointOutputSchemas.imagesLocationAnnotate,
	},
	'files.annotate': {
		input: GoogleCloudVisionEndpointInputSchemas.filesAnnotate,
		output: GoogleCloudVisionEndpointOutputSchemas.filesAnnotate,
	},
	'files.asyncBatchAnnotate': {
		input: GoogleCloudVisionEndpointInputSchemas.filesAsyncBatchAnnotate,
		output: GoogleCloudVisionEndpointOutputSchemas.filesAsyncBatchAnnotate,
	},
	'productSets.create': {
		input: GoogleCloudVisionEndpointInputSchemas.productSetsCreate,
		output: GoogleCloudVisionEndpointOutputSchemas.productSetsCreate,
	},
	'productSets.get': {
		input: GoogleCloudVisionEndpointInputSchemas.productSetsGet,
		output: GoogleCloudVisionEndpointOutputSchemas.productSetsGet,
	},
	'productSets.list': {
		input: GoogleCloudVisionEndpointInputSchemas.productSetsList,
		output: GoogleCloudVisionEndpointOutputSchemas.productSetsList,
	},
	'productSets.update': {
		input: GoogleCloudVisionEndpointInputSchemas.productSetsUpdate,
		output: GoogleCloudVisionEndpointOutputSchemas.productSetsUpdate,
	},
	'productSets.delete': {
		input: GoogleCloudVisionEndpointInputSchemas.productSetsDelete,
		output: GoogleCloudVisionEndpointOutputSchemas.productSetsDelete,
	},
	'productSets.import': {
		input: GoogleCloudVisionEndpointInputSchemas.productSetsImport,
		output: GoogleCloudVisionEndpointOutputSchemas.productSetsImport,
	},
	'productSets.addProduct': {
		input: GoogleCloudVisionEndpointInputSchemas.productSetsAddProduct,
		output: GoogleCloudVisionEndpointOutputSchemas.productSetsAddProduct,
	},
	'productSets.removeProduct': {
		input: GoogleCloudVisionEndpointInputSchemas.productSetsRemoveProduct,
		output: GoogleCloudVisionEndpointOutputSchemas.productSetsRemoveProduct,
	},
	'productSets.listProducts': {
		input: GoogleCloudVisionEndpointInputSchemas.productSetsListProducts,
		output: GoogleCloudVisionEndpointOutputSchemas.productSetsListProducts,
	},
	'products.create': {
		input: GoogleCloudVisionEndpointInputSchemas.productsCreate,
		output: GoogleCloudVisionEndpointOutputSchemas.productsCreate,
	},
	'products.get': {
		input: GoogleCloudVisionEndpointInputSchemas.productsGet,
		output: GoogleCloudVisionEndpointOutputSchemas.productsGet,
	},
	'products.list': {
		input: GoogleCloudVisionEndpointInputSchemas.productsList,
		output: GoogleCloudVisionEndpointOutputSchemas.productsList,
	},
	'products.update': {
		input: GoogleCloudVisionEndpointInputSchemas.productsUpdate,
		output: GoogleCloudVisionEndpointOutputSchemas.productsUpdate,
	},
	'products.delete': {
		input: GoogleCloudVisionEndpointInputSchemas.productsDelete,
		output: GoogleCloudVisionEndpointOutputSchemas.productsDelete,
	},
	'products.purge': {
		input: GoogleCloudVisionEndpointInputSchemas.productsPurge,
		output: GoogleCloudVisionEndpointOutputSchemas.productsPurge,
	},
	'referenceImages.create': {
		input: GoogleCloudVisionEndpointInputSchemas.referenceImagesCreate,
		output: GoogleCloudVisionEndpointOutputSchemas.referenceImagesCreate,
	},
	'referenceImages.get': {
		input: GoogleCloudVisionEndpointInputSchemas.referenceImagesGet,
		output: GoogleCloudVisionEndpointOutputSchemas.referenceImagesGet,
	},
	'referenceImages.delete': {
		input: GoogleCloudVisionEndpointInputSchemas.referenceImagesDelete,
		output: GoogleCloudVisionEndpointOutputSchemas.referenceImagesDelete,
	},
	'referenceImages.list': {
		input: GoogleCloudVisionEndpointInputSchemas.referenceImagesList,
		output: GoogleCloudVisionEndpointOutputSchemas.referenceImagesList,
	},
	'operations.get': {
		input: GoogleCloudVisionEndpointInputSchemas.operationsGet,
		output: GoogleCloudVisionEndpointOutputSchemas.operationsGet,
	},
	'operations.list': {
		input: GoogleCloudVisionEndpointInputSchemas.operationsList,
		output: GoogleCloudVisionEndpointOutputSchemas.operationsList,
	},
	'operations.cancel': {
		input: GoogleCloudVisionEndpointInputSchemas.operationsCancel,
		output: GoogleCloudVisionEndpointOutputSchemas.operationsCancel,
	},
	'operations.delete': {
		input: GoogleCloudVisionEndpointInputSchemas.operationsDelete,
		output: GoogleCloudVisionEndpointOutputSchemas.operationsDelete,
	},
	'locations.list': {
		input: GoogleCloudVisionEndpointInputSchemas.locationsList,
		output: GoogleCloudVisionEndpointOutputSchemas.locationsList,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof googleCloudVisionEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const googleCloudVisionEndpointMeta = {
	'images.annotate': { riskLevel: 'read', description: 'Annotate Images' },
	'images.asyncBatchAnnotate': {
		riskLevel: 'write',
		description: 'Annotate Images Async',
	},
	'images.locationAnnotate': {
		riskLevel: 'read',
		description: 'Annotate Location Images',
	},
	'files.annotate': { riskLevel: 'read', description: 'Annotate Files' },
	'files.asyncBatchAnnotate': {
		riskLevel: 'write',
		description: 'Annotate Files Async',
	},
	'productSets.create': {
		riskLevel: 'write',
		description: 'Create Product Set',
	},
	'productSets.get': { riskLevel: 'read', description: 'Get Product Set' },
	'productSets.list': { riskLevel: 'read', description: 'List Product Sets' },
	'productSets.update': {
		riskLevel: 'write',
		description: 'Update Product Set',
	},
	'productSets.delete': {
		riskLevel: 'write',
		description: 'Delete Product Set',
	},
	'productSets.import': {
		riskLevel: 'write',
		description: 'Import Product Sets',
	},
	'productSets.addProduct': {
		riskLevel: 'write',
		description: 'Add Product to Set',
	},
	'productSets.removeProduct': {
		riskLevel: 'write',
		description: 'Remove Product from Set',
	},
	'productSets.listProducts': {
		riskLevel: 'read',
		description: 'List Products in Set',
	},
	'products.create': { riskLevel: 'write', description: 'Create Product' },
	'products.get': { riskLevel: 'read', description: 'Get Product' },
	'products.list': { riskLevel: 'read', description: 'List Products' },
	'products.update': { riskLevel: 'write', description: 'Update Product' },
	'products.delete': { riskLevel: 'write', description: 'Delete Product' },
	'products.purge': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Purge Products',
	},
	'referenceImages.create': {
		riskLevel: 'write',
		description: 'Create Reference Image',
	},
	'referenceImages.get': {
		riskLevel: 'read',
		description: 'Get Reference Image',
	},
	'referenceImages.delete': {
		riskLevel: 'write',
		description: 'Delete Reference Image',
	},
	'referenceImages.list': {
		riskLevel: 'read',
		description: 'List Reference Images',
	},
	'operations.get': { riskLevel: 'read', description: 'Get Operation' },
	'operations.list': { riskLevel: 'read', description: 'List Operations' },
	'operations.cancel': { riskLevel: 'write', description: 'Cancel Operation' },
	'operations.delete': { riskLevel: 'write', description: 'Delete Operation' },
	'locations.list': { riskLevel: 'read', description: 'List Locations' },
} as const satisfies RequiredPluginEndpointMeta<
	typeof googleCloudVisionEndpointsNested
>;

export const googleCloudVisionAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseGoogleCloudVisionPlugin<
	T extends GoogleCloudVisionPluginOptions,
> = CorsairPlugin<
	'googlecloudvision',
	typeof GoogleCloudVisionSchema,
	typeof googleCloudVisionEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalGoogleCloudVisionPlugin =
	BaseGoogleCloudVisionPlugin<GoogleCloudVisionPluginOptions>;
export type ExternalGoogleCloudVisionPlugin<
	T extends GoogleCloudVisionPluginOptions,
> = BaseGoogleCloudVisionPlugin<T>;

export function googlecloudvision<
	const T extends GoogleCloudVisionPluginOptions,
>(
	incomingOptions: GoogleCloudVisionPluginOptions &
		T = {} as GoogleCloudVisionPluginOptions & T,
): ExternalGoogleCloudVisionPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'googlecloudvision',
		authConfig: googleCloudVisionAuthConfig,
		schema: GoogleCloudVisionSchema,
		options: options,
		hooks: options.hooks,
		endpoints: googleCloudVisionEndpointsNested,
		webhooks: {},
		endpointMeta: googleCloudVisionEndpointMeta,
		endpointSchemas: googleCloudVisionEndpointSchemas,
		webhookSchemas: {},
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: GoogleCloudVisionKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}
			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) {
					throw new AuthMissingError('googlecloudvision', 'api_key');
				}
				return res;
			}
			if (source === 'endpoint' && ctx.authType === 'oauth_2') {
				const res = await ctx.keys.get_access_token();
				if (!res) {
					throw new AuthMissingError('googlecloudvision', 'oauth_2');
				}
				return res;
			}
			throw new AuthMissingError(
				'googlecloudvision',
				ctx.authType ?? defaultAuthType,
			);
		},
	} satisfies InternalGoogleCloudVisionPlugin;
}

export type {
	GoogleCloudVisionEndpointInputs,
	GoogleCloudVisionEndpointOutputs,
} from './endpoints/types';
