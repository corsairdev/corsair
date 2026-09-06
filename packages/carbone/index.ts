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
import {
	RenderEndpoints,
	StatusEndpoints,
	TemplatesEndpoints,
} from './endpoints';
import type {
	CarboneEndpointInputs,
	CarboneEndpointOutputs,
} from './endpoints/types';
import {
	CarboneEndpointInputSchemas,
	CarboneEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { CarboneSchema } from './schema';

export type CarbonePluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalCarbonePlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof carboneEndpointsNested>;
};

export type CarboneContext = CorsairPluginContext<
	typeof CarboneSchema,
	CarbonePluginOptions
>;

export type CarboneKeyBuilderContext = KeyBuilderContext<CarbonePluginOptions>;

export type CarboneBoundEndpoints = BindEndpoints<
	typeof carboneEndpointsNested
>;

type CarboneEndpoint<K extends keyof CarboneEndpointOutputs> = CorsairEndpoint<
	CarboneContext,
	CarboneEndpointInputs[K],
	CarboneEndpointOutputs[K]
>;

export type CarboneEndpoints = {
	getStatus: CarboneEndpoint<'getStatus'>;
	uploadTemplate: CarboneEndpoint<'uploadTemplate'>;
	getTemplate: CarboneEndpoint<'getTemplate'>;
	deleteTemplate: CarboneEndpoint<'deleteTemplate'>;
	render: CarboneEndpoint<'render'>;
	renderInline: CarboneEndpoint<'renderInline'>;
	getRender: CarboneEndpoint<'getRender'>;
};

const carboneEndpointsNested = {
	status: {
		get: StatusEndpoints.getStatus,
	},
	templates: {
		upload: TemplatesEndpoints.uploadTemplate,
		get: TemplatesEndpoints.getTemplate,
		delete: TemplatesEndpoints.deleteTemplate,
	},
	render: {
		render: RenderEndpoints.renderTemplate,
		renderInline: RenderEndpoints.renderInline,
		get: RenderEndpoints.getRender,
	},
} as const;

const carboneWebhooksNested = {} as const;

export const carboneEndpointSchemas = {
	'status.get': {
		input: CarboneEndpointInputSchemas.getStatus,
		output: CarboneEndpointOutputSchemas.getStatus,
	},
	'templates.upload': {
		input: CarboneEndpointInputSchemas.uploadTemplate,
		output: CarboneEndpointOutputSchemas.uploadTemplate,
	},
	'templates.get': {
		input: CarboneEndpointInputSchemas.getTemplate,
		output: CarboneEndpointOutputSchemas.getTemplate,
	},
	'templates.delete': {
		input: CarboneEndpointInputSchemas.deleteTemplate,
		output: CarboneEndpointOutputSchemas.deleteTemplate,
	},
	'render.render': {
		input: CarboneEndpointInputSchemas.render,
		output: CarboneEndpointOutputSchemas.render,
	},
	'render.renderInline': {
		input: CarboneEndpointInputSchemas.renderInline,
		output: CarboneEndpointOutputSchemas.renderInline,
	},
	'render.get': {
		input: CarboneEndpointInputSchemas.getRender,
		output: CarboneEndpointOutputSchemas.getRender,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof carboneEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const carboneEndpointMeta = {
	'status.get': {
		riskLevel: 'read',
		description: 'Check Carbone API operational health status',
	},
	'templates.upload': {
		riskLevel: 'write',
		description: 'Upload a document template (base64) to Carbone',
	},
	'templates.get': {
		riskLevel: 'read',
		description: 'Get download URL for a stored template',
	},
	'templates.delete': {
		riskLevel: 'write',
		description: 'Delete a template from Carbone storage',
	},
	'render.render': {
		riskLevel: 'write',
		description: 'Render a document from a stored template and dataset',
	},
	'render.renderInline': {
		riskLevel: 'write',
		description: 'Render a document with an inline template and dataset',
	},
	'render.get': {
		riskLevel: 'read',
		description: 'Get download URL for a rendered document',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof carboneEndpointsNested>;

export const carboneAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseCarbonePlugin<T extends CarbonePluginOptions> = CorsairPlugin<
	'carbone',
	typeof CarboneSchema,
	typeof carboneEndpointsNested,
	typeof carboneWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalCarbonePlugin = BaseCarbonePlugin<CarbonePluginOptions>;

export type ExternalCarbonePlugin<T extends CarbonePluginOptions> =
	BaseCarbonePlugin<T>;

export function carbone<const T extends CarbonePluginOptions>(
	incomingOptions: CarbonePluginOptions & T = {} as CarbonePluginOptions & T,
): ExternalCarbonePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'carbone',
		authConfig: carboneAuthConfig,
		schema: CarboneSchema,
		options,
		hooks: options.hooks,
		webhookHooks: undefined,
		endpoints: carboneEndpointsNested,
		webhooks: carboneWebhooksNested,
		endpointMeta: carboneEndpointMeta,
		endpointSchemas: carboneEndpointSchemas,
		pluginWebhookMatcher: undefined,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: CarboneKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) {
					throw new AuthMissingError('carbone', 'api_key');
				}
				return res;
			}

			throw new AuthMissingError('carbone', 'api_key');
		},
	} satisfies InternalCarbonePlugin;
}

export type {
	CarboneEndpointInputs,
	CarboneEndpointOutputs,
	DeleteTemplateInput,
	DeleteTemplateOutput,
	GetRenderInput,
	GetRenderOutput,
	GetStatusInput,
	GetStatusOutput,
	GetTemplateInput,
	GetTemplateOutput,
	RenderInlineInput,
	RenderInlineOutput,
	RenderTemplateInput,
	RenderTemplateOutput,
	UploadTemplateInput,
	UploadTemplateOutput,
} from './endpoints/types';

export {
	CarboneEndpointInputSchemas,
	CarboneEndpointOutputSchemas,
	DeleteTemplateInputSchema,
	DeleteTemplateOutputSchema,
	GetRenderInputSchema,
	GetRenderOutputSchema,
	GetStatusInputSchema,
	GetStatusOutputSchema,
	GetTemplateInputSchema,
	GetTemplateOutputSchema,
	RenderInlineInputSchema,
	RenderInlineOutputSchema,
	RenderTemplateInputSchema,
	RenderTemplateOutputSchema,
	UploadTemplateInputSchema,
	UploadTemplateOutputSchema,
} from './endpoints/types';
