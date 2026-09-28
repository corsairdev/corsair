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
import { AuthMissingError } from 'corsair/core';
import {
	RenderEndpoints,
	StatusEndpoints,
	TemplatesEndpoints,
	VersionEndpoints,
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
	version?: string;
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

type CarboneEndpoint<K extends keyof CarboneEndpointOutputs> = (
	ctx: CarboneContext,
	input: CarboneEndpointInputs[K],
) => Promise<CarboneEndpointOutputs[K]>;

export type CarboneEndpoints = {
	getStatus: CarboneEndpoint<'getStatus'>;
	uploadTemplate: CarboneEndpoint<'uploadTemplate'>;
	listTemplates: CarboneEndpoint<'listTemplates'>;
	downloadTemplate: CarboneEndpoint<'downloadTemplate'>;
	updateTemplate: CarboneEndpoint<'updateTemplate'>;
	deleteTemplate: CarboneEndpoint<'deleteTemplate'>;
	listCategories: CarboneEndpoint<'listCategories'>;
	listTags: CarboneEndpoint<'listTags'>;
	generateReport: CarboneEndpoint<'generateReport'>;
	renderDirect: CarboneEndpoint<'renderDirect'>;
	setApiVersion: CarboneEndpoint<'setApiVersion'>;
};

const carboneEndpointsNested = {
	status: {
		get: StatusEndpoints.getStatus,
	},
	templates: {
		upload: TemplatesEndpoints.uploadTemplate,
		list: TemplatesEndpoints.listTemplates,
		download: TemplatesEndpoints.downloadTemplate,
		update: TemplatesEndpoints.updateTemplate,
		delete: TemplatesEndpoints.deleteTemplate,
		listCategories: TemplatesEndpoints.listCategories,
		listTags: TemplatesEndpoints.listTags,
	},
	render: {
		generateReport: RenderEndpoints.generateReport,
		renderDirect: RenderEndpoints.renderDirect,
	},
	version: {
		set: VersionEndpoints.setApiVersion,
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
	'templates.list': {
		input: CarboneEndpointInputSchemas.listTemplates,
		output: CarboneEndpointOutputSchemas.listTemplates,
	},
	'templates.download': {
		input: CarboneEndpointInputSchemas.downloadTemplate,
		output: CarboneEndpointOutputSchemas.downloadTemplate,
	},
	'templates.update': {
		input: CarboneEndpointInputSchemas.updateTemplate,
		output: CarboneEndpointOutputSchemas.updateTemplate,
	},
	'templates.delete': {
		input: CarboneEndpointInputSchemas.deleteTemplate,
		output: CarboneEndpointOutputSchemas.deleteTemplate,
	},
	'templates.listCategories': {
		input: CarboneEndpointInputSchemas.listCategories,
		output: CarboneEndpointOutputSchemas.listCategories,
	},
	'templates.listTags': {
		input: CarboneEndpointInputSchemas.listTags,
		output: CarboneEndpointOutputSchemas.listTags,
	},
	'render.generateReport': {
		input: CarboneEndpointInputSchemas.generateReport,
		output: CarboneEndpointOutputSchemas.generateReport,
	},
	'render.renderDirect': {
		input: CarboneEndpointInputSchemas.renderDirect,
		output: CarboneEndpointOutputSchemas.renderDirect,
	},
	'version.set': {
		input: CarboneEndpointInputSchemas.setApiVersion,
		output: CarboneEndpointOutputSchemas.setApiVersion,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof carboneEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const carboneEndpointMeta = {
	'status.get': {
		riskLevel: 'read',
		description:
			'Tool to retrieve the current status and health of the Carbone server. Use before generating reports to ensure the service is operational.',
	},
	'templates.upload': {
		riskLevel: 'write',
		description:
			'Upload a template file to the Carbone server to obtain a template ID for document generation. Supported template formats: DOCX, XLSX, PPTX, ODT, ODS, ODP, ODG, XHTML, IDML, HTML, or XML. Templates can contain placeholders like {d.fieldname} that will be replaced with data during report generation.',
	},
	'templates.list': {
		riskLevel: 'read',
		description:
			'Tool to retrieve a list of templates from Carbone storage with filtering, search, and cursor-based pagination. Use when you need to find templates, search by name or ID, or iterate through all deployed templates.',
	},
	'templates.download': {
		riskLevel: 'read',
		description:
			'Tool to download a template from Carbone by template ID. Use when you need to retrieve the original template file.',
	},
	'templates.update': {
		riskLevel: 'write',
		description:
			'Tool to update metadata and attributes of an existing Carbone template. Use when you need to modify template name, comment, tags, category, or control version deployment and lifecycle.',
	},
	'templates.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Permanently delete a template from the Carbone server by its 64-character hexadecimal template ID. This action is irreversible. Ensure you have the correct template ID before deleting.',
	},
	'templates.listCategories': {
		riskLevel: 'read',
		description:
			'Tool to retrieve a list of all categories used in templates. Categories function like folders for organizing templates. Use when you need to see available template groupings.',
	},
	'templates.listTags': {
		riskLevel: 'read',
		description:
			'Tool to list all tags currently used in templates. Use when you need to discover available tags for categorizing or filtering templates by document type or version.',
	},
	'render.generateReport': {
		riskLevel: 'write',
		description:
			'Tool to generate a Carbone report from a template and JSON data. Use when you need to render documents in various formats.',
	},
	'render.renderDirect': {
		riskLevel: 'write',
		description:
			'Tool to generate a document by uploading a base64-encoded template and data in a single API call. Use when you need to render documents without uploading templates separately.',
	},
	'version.set': {
		riskLevel: 'write',
		description:
			'Tool to set the Carbone API version to be used for subsequent requests. Use before rendering or managing templates to ensure correct version is applied.',
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
	DownloadTemplateInput,
	DownloadTemplateOutput,
	GenerateReportInput,
	GenerateReportOutput,
	GetStatusInput,
	GetStatusOutput,
	ListTemplateCategoriesInput,
	ListTemplateCategoriesOutput,
	ListTemplatesInput,
	ListTemplatesOutput,
	ListTemplateTagsInput,
	ListTemplateTagsOutput,
	RenderTemplateDirectInput,
	RenderTemplateDirectOutput,
	SetApiVersionInput,
	SetApiVersionOutput,
	UpdateTemplateInput,
	UpdateTemplateOutput,
	UploadTemplateInput,
	UploadTemplateOutput,
} from './endpoints/types';

export {
	CarboneEndpointInputSchemas,
	CarboneEndpointOutputSchemas,
	DeleteTemplateInputSchema,
	DeleteTemplateOutputSchema,
	DownloadTemplateInputSchema,
	DownloadTemplateOutputSchema,
	GenerateReportInputSchema,
	GenerateReportOutputSchema,
	GetStatusInputSchema,
	GetStatusOutputSchema,
	ListTemplateCategoriesInputSchema,
	ListTemplateCategoriesOutputSchema,
	ListTemplatesInputSchema,
	ListTemplatesOutputSchema,
	ListTemplateTagsInputSchema,
	ListTemplateTagsOutputSchema,
	RenderTemplateDirectInputSchema,
	RenderTemplateDirectOutputSchema,
	SetApiVersionInputSchema,
	SetApiVersionOutputSchema,
	UpdateTemplateInputSchema,
	UpdateTemplateOutputSchema,
	UploadTemplateInputSchema,
	UploadTemplateOutputSchema,
} from './endpoints/types';
