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
import { Admin, Images, Templates } from './endpoints';
import type {
	DocmosisEndpointInputs,
	DocmosisEndpointOutputs,
} from './endpoints/types';
import {
	DocmosisEndpointInputSchemas,
	DocmosisEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { DocmosisSchema } from './schema';

export type DocmosisPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalDocmosisPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof docmosisEndpointsNested>;
};

export type DocmosisContext = CorsairPluginContext<
	typeof DocmosisSchema,
	DocmosisPluginOptions
>;

export type DocmosisKeyBuilderContext =
	KeyBuilderContext<DocmosisPluginOptions>;

export type DocmosisBoundEndpoints = BindEndpoints<
	typeof docmosisEndpointsNested
>;

type DocmosisEndpoint<K extends keyof DocmosisEndpointOutputs> =
	CorsairEndpoint<
		DocmosisContext,
		DocmosisEndpointInputs[K],
		DocmosisEndpointOutputs[K]
	>;

export type DocmosisEndpoints = {
	environmentReady: DocmosisEndpoint<'environmentReady'>;
	environmentSummary: DocmosisEndpoint<'environmentSummary'>;
	ping: DocmosisEndpoint<'ping'>;
	pingService: DocmosisEndpoint<'pingService'>;
	deleteImage: DocmosisEndpoint<'deleteImage'>;
	deleteTemplate: DocmosisEndpoint<'deleteTemplate'>;
	listImages: DocmosisEndpoint<'listImages'>;
	listTemplates: DocmosisEndpoint<'listTemplates'>;
	getImage: DocmosisEndpoint<'getImage'>;
	getTemplate: DocmosisEndpoint<'getTemplate'>;
	getBatchUploadStatus: DocmosisEndpoint<'getBatchUploadStatus'>;
	getRenderQueue: DocmosisEndpoint<'getRenderQueue'>;
	getTemplateDetails: DocmosisEndpoint<'getTemplateDetails'>;
	getTemplateStructure: DocmosisEndpoint<'getTemplateStructure'>;
	getRenderTags: DocmosisEndpoint<'getRenderTags'>;
	getSampleData: DocmosisEndpoint<'getSampleData'>;
	render: DocmosisEndpoint<'render'>;
};

const docmosisEndpointsNested = {
	admin: {
		environmentReady: Admin.environmentReady,
		environmentSummary: Admin.environmentSummary,
		ping: Admin.ping,
		pingService: Admin.pingService,
		getRenderQueue: Admin.getRenderQueue,
		getRenderTags: Admin.getRenderTags,
		getBatchUploadStatus: Admin.getBatchUploadStatus,
	},
	images: {
		delete: Images.deleteImage,
		list: Images.listImages,
		get: Images.getImage,
	},
	templates: {
		delete: Templates.deleteTemplate,
		list: Templates.listTemplates,
		get: Templates.getTemplate,
		getDetails: Templates.getTemplateDetails,
		getStructure: Templates.getTemplateStructure,
		getSampleData: Templates.getSampleData,
		render: Templates.render,
	},
} as const;

const docmosisWebhooksNested = {} as const;

export const docmosisEndpointSchemas = {
	'admin.environmentReady': {
		input: DocmosisEndpointInputSchemas.environmentReady,
		output: DocmosisEndpointOutputSchemas.environmentReady,
	},
	'admin.environmentSummary': {
		input: DocmosisEndpointInputSchemas.environmentSummary,
		output: DocmosisEndpointOutputSchemas.environmentSummary,
	},
	'admin.ping': {
		input: DocmosisEndpointInputSchemas.ping,
		output: DocmosisEndpointOutputSchemas.ping,
	},
	'admin.pingService': {
		input: DocmosisEndpointInputSchemas.pingService,
		output: DocmosisEndpointOutputSchemas.pingService,
	},
	'admin.getRenderQueue': {
		input: DocmosisEndpointInputSchemas.getRenderQueue,
		output: DocmosisEndpointOutputSchemas.getRenderQueue,
	},
	'admin.getRenderTags': {
		input: DocmosisEndpointInputSchemas.getRenderTags,
		output: DocmosisEndpointOutputSchemas.getRenderTags,
	},
	'admin.getBatchUploadStatus': {
		input: DocmosisEndpointInputSchemas.getBatchUploadStatus,
		output: DocmosisEndpointOutputSchemas.getBatchUploadStatus,
	},
	'images.delete': {
		input: DocmosisEndpointInputSchemas.deleteImage,
		output: DocmosisEndpointOutputSchemas.deleteImage,
	},
	'images.list': {
		input: DocmosisEndpointInputSchemas.listImages,
		output: DocmosisEndpointOutputSchemas.listImages,
	},
	'images.get': {
		input: DocmosisEndpointInputSchemas.getImage,
		output: DocmosisEndpointOutputSchemas.getImage,
	},
	'templates.delete': {
		input: DocmosisEndpointInputSchemas.deleteTemplate,
		output: DocmosisEndpointOutputSchemas.deleteTemplate,
	},
	'templates.list': {
		input: DocmosisEndpointInputSchemas.listTemplates,
		output: DocmosisEndpointOutputSchemas.listTemplates,
	},
	'templates.get': {
		input: DocmosisEndpointInputSchemas.getTemplate,
		output: DocmosisEndpointOutputSchemas.getTemplate,
	},
	'templates.getDetails': {
		input: DocmosisEndpointInputSchemas.getTemplateDetails,
		output: DocmosisEndpointOutputSchemas.getTemplateDetails,
	},
	'templates.getStructure': {
		input: DocmosisEndpointInputSchemas.getTemplateStructure,
		output: DocmosisEndpointOutputSchemas.getTemplateStructure,
	},
	'templates.getSampleData': {
		input: DocmosisEndpointInputSchemas.getSampleData,
		output: DocmosisEndpointOutputSchemas.getSampleData,
	},
	'templates.render': {
		input: DocmosisEndpointInputSchemas.render,
		output: DocmosisEndpointOutputSchemas.render,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof docmosisEndpointsNested
>;

const docmosisEndpointMeta = {
	'admin.environmentReady': {
		riskLevel: 'read',
		description: 'Check whether the environment is active and ready to render',
	},
	'admin.environmentSummary': {
		riskLevel: 'read',
		description: 'Get environment status, plan details, and quota usage',
	},
	'admin.ping': {
		riskLevel: 'read',
		description: 'Check basic connectivity to the Docmosis API',
	},
	'admin.pingService': {
		riskLevel: 'read',
		description: 'Verify that Docmosis service listeners are online',
	},
	'admin.getRenderQueue': {
		riskLevel: 'read',
		description: 'Get current render queue utilization and delay',
	},
	'admin.getRenderTags': {
		riskLevel: 'read',
		description: 'Get monthly render statistics grouped by custom tags',
	},
	'admin.getBatchUploadStatus': {
		riskLevel: 'read',
		description: 'Check status for a template batch upload job',
	},
	'images.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete one or more stored images',
	},
	'images.list': {
		riskLevel: 'read',
		description: 'List available stored images, optionally by folder',
	},
	'images.get': {
		riskLevel: 'read',
		description: 'Download one or more uploaded images',
	},
	'templates.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete one or more templates from the environment',
	},
	'templates.list': {
		riskLevel: 'read',
		description: 'List templates with optional folder and paging filters',
	},
	'templates.get': {
		riskLevel: 'read',
		description: 'Download one or more template files',
	},
	'templates.getDetails': {
		riskLevel: 'read',
		description: 'Get metadata details for a specific template',
	},
	'templates.getStructure': {
		riskLevel: 'read',
		description: 'Get parsed field and structure metadata for a template',
	},
	'templates.getSampleData': {
		riskLevel: 'read',
		description: 'Generate sample JSON or XML data from a template structure',
	},
	'templates.render': {
		riskLevel: 'write',
		description: 'Generate a document from a template and JSON/XML data',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof docmosisEndpointsNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

export const docmosisAuthConfig = {
	api_key: {
		account: ['api_key'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseDocmosisPlugin<T extends DocmosisPluginOptions> = CorsairPlugin<
	'docmosis',
	typeof DocmosisSchema,
	typeof docmosisEndpointsNested,
	typeof docmosisWebhooksNested,
	T,
	typeof defaultAuthType,
	typeof docmosisAuthConfig
>;

export type InternalDocmosisPlugin = BaseDocmosisPlugin<DocmosisPluginOptions>;

export type ExternalDocmosisPlugin<T extends DocmosisPluginOptions> =
	BaseDocmosisPlugin<T>;

export function docmosis<const T extends DocmosisPluginOptions>(
	incomingOptions: DocmosisPluginOptions & T = {} as DocmosisPluginOptions & T,
): ExternalDocmosisPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'docmosis',
		authConfig: docmosisAuthConfig,
		schema: DocmosisSchema,
		options,
		hooks: options.hooks,
		webhookHooks: undefined,
		endpoints: docmosisEndpointsNested,
		webhooks: docmosisWebhooksNested,
		endpointMeta: docmosisEndpointMeta,
		endpointSchemas: docmosisEndpointSchemas,
		pluginWebhookMatcher: undefined,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: DocmosisKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();

				if (!res) {
					throw new AuthMissingError('docmosis', 'api_key');
				}

				return res;
			}

			throw new AuthMissingError('docmosis', 'api_key');
		},
	} satisfies InternalDocmosisPlugin;
}

export type { DocmosisRegion } from './client';
export { DocmosisAPIError } from './client';
export type {
	DocmosisEndpointInputs,
	DocmosisEndpointOutputs,
} from './endpoints/types';
export {
	DocmosisEndpointInputSchemas,
	DocmosisEndpointOutputSchemas,
} from './endpoints/types';
export * from './error-handlers';
