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
import { Organization, Render, Templates } from './endpoints';
import type {
	RenderformEndpointInputs,
	RenderformEndpointOutputs,
} from './endpoints/types';
import {
	RenderformEndpointInputSchemas,
	RenderformEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { RenderformSchema } from './schema';

export type RenderformPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalRenderformPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof renderformEndpointsNested>;
};

export type RenderformContext = CorsairPluginContext<
	typeof RenderformSchema,
	RenderformPluginOptions
>;

export type RenderformKeyBuilderContext =
	KeyBuilderContext<RenderformPluginOptions>;

export type RenderformBoundEndpoints = BindEndpoints<
	typeof renderformEndpointsNested
>;

type RenderformEndpoint<K extends keyof RenderformEndpointOutputs> =
	CorsairEndpoint<
		RenderformContext,
		RenderformEndpointInputs[K],
		RenderformEndpointOutputs[K]
	>;

export type RenderformEndpoints = {
	render: RenderformEndpoint<'render'>;
	templatesList: RenderformEndpoint<'templatesList'>;
	templatesGet: RenderformEndpoint<'templatesGet'>;
	templatesCreate: RenderformEndpoint<'templatesCreate'>;
	templatesUpdate: RenderformEndpoint<'templatesUpdate'>;
	templatesDelete: RenderformEndpoint<'templatesDelete'>;
	templateContentGet: RenderformEndpoint<'templateContentGet'>;
	templateContentUpdate: RenderformEndpoint<'templateContentUpdate'>;
	resultsList: RenderformEndpoint<'resultsList'>;
	resultsGet: RenderformEndpoint<'resultsGet'>;
	resultsDelete: RenderformEndpoint<'resultsDelete'>;
	screenshot: RenderformEndpoint<'screenshot'>;
	pdf: RenderformEndpoint<'pdf'>;
	usage: RenderformEndpoint<'usage'>;
	fonts: RenderformEndpoint<'fonts'>;
};

const renderformEndpointsNested = {
	render: Render.render,
	results: {
		list: Render.results,
		get: Render.result,
		delete: Render.deleteResult,
	},
	templates: {
		list: Templates.list,
		get: Templates.get,
		create: Templates.create,
		update: Templates.update,
		delete: Templates.remove,
		content: Templates.content,
		updateContent: Templates.updateContent,
	},
	screenshot: Render.screenshot,
	pdf: Render.pdf,
	usage: Organization.usage,
	fonts: Organization.fonts,
} as const;

export const renderformEndpointSchemas = {
	render: {
		input: RenderformEndpointInputSchemas.render,
		output: RenderformEndpointOutputSchemas.render,
	},
	'results.list': {
		input: RenderformEndpointInputSchemas.resultsList,
		output: RenderformEndpointOutputSchemas.resultsList,
	},
	'results.get': {
		input: RenderformEndpointInputSchemas.resultsGet,
		output: RenderformEndpointOutputSchemas.resultsGet,
	},
	'results.delete': {
		input: RenderformEndpointInputSchemas.resultsDelete,
		output: RenderformEndpointOutputSchemas.resultsDelete,
	},
	'templates.list': {
		input: RenderformEndpointInputSchemas.templatesList,
		output: RenderformEndpointOutputSchemas.templatesList,
	},
	'templates.get': {
		input: RenderformEndpointInputSchemas.templatesGet,
		output: RenderformEndpointOutputSchemas.templatesGet,
	},
	'templates.create': {
		input: RenderformEndpointInputSchemas.templatesCreate,
		output: RenderformEndpointOutputSchemas.templatesCreate,
	},
	'templates.update': {
		input: RenderformEndpointInputSchemas.templatesUpdate,
		output: RenderformEndpointOutputSchemas.templatesUpdate,
	},
	'templates.delete': {
		input: RenderformEndpointInputSchemas.templatesDelete,
		output: RenderformEndpointOutputSchemas.templatesDelete,
	},
	'templates.content': {
		input: RenderformEndpointInputSchemas.templateContentGet,
		output: RenderformEndpointOutputSchemas.templateContentGet,
	},
	'templates.updateContent': {
		input: RenderformEndpointInputSchemas.templateContentUpdate,
		output: RenderformEndpointOutputSchemas.templateContentUpdate,
	},
	screenshot: {
		input: RenderformEndpointInputSchemas.screenshot,
		output: RenderformEndpointOutputSchemas.screenshot,
	},
	pdf: {
		input: RenderformEndpointInputSchemas.pdf,
		output: RenderformEndpointOutputSchemas.pdf,
	},
	usage: {
		input: RenderformEndpointInputSchemas.usage,
		output: RenderformEndpointOutputSchemas.usage,
	},
	fonts: {
		input: RenderformEndpointInputSchemas.fonts,
		output: RenderformEndpointOutputSchemas.fonts,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof renderformEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const renderformEndpointMeta = {
	render: {
		riskLevel: 'write',
		description:
			'Render a template to an image, PDF or video, merging your data into its fields; costs a credit unless the answer is served from the cache, and a video render is asynchronous',
	},
	'results.list': {
		riskLevel: 'read',
		description:
			'List render history, optionally filtered to one template or batch',
	},
	'results.get': {
		riskLevel: 'read',
		description:
			'Read one render result; this is how an asynchronous video render is polled until it is done or failed',
	},
	'results.delete': {
		riskLevel: 'destructive',
		description: 'Delete one render result',
	},
	'templates.list': {
		riskLevel: 'read',
		description:
			'List your templates with their preview, format, size and tags',
	},
	'templates.get': {
		riskLevel: 'read',
		description: "Read one template's metadata",
	},
	'templates.create': {
		riskLevel: 'write',
		description:
			'Create a template in the html-editor, canvas-editor or canvas-html editor, with a size, tags and an output format',
	},
	'templates.update': {
		riskLevel: 'write',
		description:
			"Update a template's metadata; tags replace the whole set rather than merging",
	},
	'templates.delete': {
		riskLevel: 'destructive',
		description: 'Delete a template',
	},
	'templates.content': {
		riskLevel: 'read',
		description:
			"Read an html-editor template's raw HTML, CSS and sample data, which lists the merge fields a render should fill",
	},
	'templates.updateContent': {
		riskLevel: 'write',
		description:
			"Replace an html-editor template's raw HTML, CSS and sample data",
	},
	screenshot: {
		riskLevel: 'write',
		description:
			'Capture a URL as a screenshot at a chosen size; costs a credit',
	},
	pdf: {
		riskLevel: 'write',
		description:
			'Capture a URL as a PDF in a chosen page format, optionally self-deleting after a set time; costs a credit',
	},
	usage: {
		riskLevel: 'read',
		description:
			'Read the plan, the credits used against the total, and the next renewal',
	},
	fonts: {
		riskLevel: 'read',
		description:
			'List the fonts available to a template, with their variants and whether each is Google or custom',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof renderformEndpointsNested
>;

export type BaseRenderformPlugin<T extends RenderformPluginOptions> =
	CorsairPlugin<
		'renderform',
		typeof RenderformSchema,
		typeof renderformEndpointsNested,
		{},
		T,
		typeof defaultAuthType
	>;

export type InternalRenderformPlugin =
	BaseRenderformPlugin<RenderformPluginOptions>;

export type ExternalRenderformPlugin<T extends RenderformPluginOptions> =
	BaseRenderformPlugin<T>;

export function renderform<const T extends RenderformPluginOptions>(
	incomingOptions: RenderformPluginOptions & T = {} as RenderformPluginOptions &
		T,
): ExternalRenderformPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'renderform',
		schema: RenderformSchema,
		options: options,
		hooks: options.hooks,
		endpoints: renderformEndpointsNested,
		webhooks: {},
		endpointMeta: renderformEndpointMeta,
		endpointSchemas: renderformEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: RenderformKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('renderform', ctx.authType ?? 'api_key');
		},
	} satisfies InternalRenderformPlugin;
}

export { RenderformAPIError } from './client';

export type {
	EmptyResponse,
	FontsResponse,
	PdfInput,
	PdfResponse,
	RenderformEndpointInputs,
	RenderformEndpointOutputs,
	RenderformTemplate,
	RenderInput,
	RenderResponse,
	ResultDeleteInput,
	ResultGetInput,
	ResultGetResponse,
	ResultsListInput,
	ResultsListResponse,
	ScreenshotInput,
	ScreenshotResponse,
	TemplateContent,
	TemplateContentGetResponse,
	TemplateContentInput,
	TemplateContentUpdateInput,
	TemplateContentUpdateResponse,
	TemplateCreateInput,
	TemplateCreateResponse,
	TemplateDeleteInput,
	TemplateGetInput,
	TemplateGetResponse,
	TemplatesListInput,
	TemplatesListResponse,
	TemplateUpdateInput,
	TemplateUpdateResponse,
	UsageResponse,
} from './endpoints/types';
