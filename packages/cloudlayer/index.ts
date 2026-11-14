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
	Account,
	Assets,
	Html,
	Jobs,
	Storage,
	Template,
	Url,
} from './endpoints';
import type {
	CloudlayerEndpointInputs,
	CloudlayerEndpointOutputs,
} from './endpoints/types';
import {
	CloudlayerEndpointInputSchemas,
	CloudlayerEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { CloudlayerSchema } from './schema';

export type CloudlayerPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalCloudlayerPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof cloudlayerEndpointsNested>;
};

export type CloudlayerContext = CorsairPluginContext<
	typeof CloudlayerSchema,
	CloudlayerPluginOptions
>;

export type CloudlayerKeyBuilderContext =
	KeyBuilderContext<CloudlayerPluginOptions>;

export type CloudlayerBoundEndpoints = BindEndpoints<
	typeof cloudlayerEndpointsNested
>;

type CloudlayerEndpoint<K extends keyof CloudlayerEndpointOutputs> =
	CorsairEndpoint<
		CloudlayerContext,
		CloudlayerEndpointInputs[K],
		CloudlayerEndpointOutputs[K]
	>;

export type CloudlayerEndpoints = {
	html: {
		toPdf: CloudlayerEndpoint<'html.toPdf'>;
		toPdfV1: CloudlayerEndpoint<'html.toPdfV1'>;
		toImage: CloudlayerEndpoint<'html.toImage'>;
		toImageV1: CloudlayerEndpoint<'html.toImageV1'>;
	};
	url: {
		toPdf: CloudlayerEndpoint<'url.toPdf'>;
		toPdfV1: CloudlayerEndpoint<'url.toPdfV1'>;
		toPdfQuick: CloudlayerEndpoint<'url.toPdfQuick'>;
		toPdfQuickV1: CloudlayerEndpoint<'url.toPdfQuickV1'>;
		toImage: CloudlayerEndpoint<'url.toImage'>;
		toImageV1: CloudlayerEndpoint<'url.toImageV1'>;
		toImageQuick: CloudlayerEndpoint<'url.toImageQuick'>;
		toImageQuickV1: CloudlayerEndpoint<'url.toImageQuickV1'>;
	};
	template: {
		toPdf: CloudlayerEndpoint<'template.toPdf'>;
		toPdfV1: CloudlayerEndpoint<'template.toPdfV1'>;
		toImage: CloudlayerEndpoint<'template.toImage'>;
		toImageV1: CloudlayerEndpoint<'template.toImageV1'>;
	};
	account: {
		get: CloudlayerEndpoint<'account.get'>;
	};
	assets: {
		list: CloudlayerEndpoint<'assets.list'>;
		get: CloudlayerEndpoint<'assets.get'>;
	};
	jobs: {
		list: CloudlayerEndpoint<'jobs.list'>;
		listV2: CloudlayerEndpoint<'jobs.listV2'>;
		get: CloudlayerEndpoint<'jobs.get'>;
	};
	storage: {
		create: CloudlayerEndpoint<'storage.create'>;
		getCurrent: CloudlayerEndpoint<'storage.getCurrent'>;
		get: CloudlayerEndpoint<'storage.get'>;
		remove: CloudlayerEndpoint<'storage.remove'>;
	};
};

const cloudlayerEndpointsNested = {
	html: Html,
	url: Url,
	template: Template,
	account: Account,
	assets: Assets,
	jobs: Jobs,
	storage: Storage,
} as const;

export const cloudlayerEndpointSchemas = {
	'html.toPdf': {
		input: CloudlayerEndpointInputSchemas['html.toPdf'],
		output: CloudlayerEndpointOutputSchemas['html.toPdf'],
	},
	'html.toPdfV1': {
		input: CloudlayerEndpointInputSchemas['html.toPdfV1'],
		output: CloudlayerEndpointOutputSchemas['html.toPdfV1'],
	},
	'html.toImage': {
		input: CloudlayerEndpointInputSchemas['html.toImage'],
		output: CloudlayerEndpointOutputSchemas['html.toImage'],
	},
	'html.toImageV1': {
		input: CloudlayerEndpointInputSchemas['html.toImageV1'],
		output: CloudlayerEndpointOutputSchemas['html.toImageV1'],
	},
	'url.toPdf': {
		input: CloudlayerEndpointInputSchemas['url.toPdf'],
		output: CloudlayerEndpointOutputSchemas['url.toPdf'],
	},
	'url.toPdfV1': {
		input: CloudlayerEndpointInputSchemas['url.toPdfV1'],
		output: CloudlayerEndpointOutputSchemas['url.toPdfV1'],
	},
	'url.toPdfQuick': {
		input: CloudlayerEndpointInputSchemas['url.toPdfQuick'],
		output: CloudlayerEndpointOutputSchemas['url.toPdfQuick'],
	},
	'url.toPdfQuickV1': {
		input: CloudlayerEndpointInputSchemas['url.toPdfQuickV1'],
		output: CloudlayerEndpointOutputSchemas['url.toPdfQuickV1'],
	},
	'url.toImage': {
		input: CloudlayerEndpointInputSchemas['url.toImage'],
		output: CloudlayerEndpointOutputSchemas['url.toImage'],
	},
	'url.toImageV1': {
		input: CloudlayerEndpointInputSchemas['url.toImageV1'],
		output: CloudlayerEndpointOutputSchemas['url.toImageV1'],
	},
	'url.toImageQuick': {
		input: CloudlayerEndpointInputSchemas['url.toImageQuick'],
		output: CloudlayerEndpointOutputSchemas['url.toImageQuick'],
	},
	'url.toImageQuickV1': {
		input: CloudlayerEndpointInputSchemas['url.toImageQuickV1'],
		output: CloudlayerEndpointOutputSchemas['url.toImageQuickV1'],
	},
	'template.toPdf': {
		input: CloudlayerEndpointInputSchemas['template.toPdf'],
		output: CloudlayerEndpointOutputSchemas['template.toPdf'],
	},
	'template.toPdfV1': {
		input: CloudlayerEndpointInputSchemas['template.toPdfV1'],
		output: CloudlayerEndpointOutputSchemas['template.toPdfV1'],
	},
	'template.toImage': {
		input: CloudlayerEndpointInputSchemas['template.toImage'],
		output: CloudlayerEndpointOutputSchemas['template.toImage'],
	},
	'template.toImageV1': {
		input: CloudlayerEndpointInputSchemas['template.toImageV1'],
		output: CloudlayerEndpointOutputSchemas['template.toImageV1'],
	},
	'account.get': {
		input: CloudlayerEndpointInputSchemas['account.get'],
		output: CloudlayerEndpointOutputSchemas['account.get'],
	},
	'assets.list': {
		input: CloudlayerEndpointInputSchemas['assets.list'],
		output: CloudlayerEndpointOutputSchemas['assets.list'],
	},
	'assets.get': {
		input: CloudlayerEndpointInputSchemas['assets.get'],
		output: CloudlayerEndpointOutputSchemas['assets.get'],
	},
	'jobs.list': {
		input: CloudlayerEndpointInputSchemas['jobs.list'],
		output: CloudlayerEndpointOutputSchemas['jobs.list'],
	},
	'jobs.listV2': {
		input: CloudlayerEndpointInputSchemas['jobs.listV2'],
		output: CloudlayerEndpointOutputSchemas['jobs.listV2'],
	},
	'jobs.get': {
		input: CloudlayerEndpointInputSchemas['jobs.get'],
		output: CloudlayerEndpointOutputSchemas['jobs.get'],
	},
	'storage.create': {
		input: CloudlayerEndpointInputSchemas['storage.create'],
		output: CloudlayerEndpointOutputSchemas['storage.create'],
	},
	'storage.getCurrent': {
		input: CloudlayerEndpointInputSchemas['storage.getCurrent'],
		output: CloudlayerEndpointOutputSchemas['storage.getCurrent'],
	},
	'storage.get': {
		input: CloudlayerEndpointInputSchemas['storage.get'],
		output: CloudlayerEndpointOutputSchemas['storage.get'],
	},
	'storage.remove': {
		input: CloudlayerEndpointInputSchemas['storage.remove'],
		output: CloudlayerEndpointOutputSchemas['storage.remove'],
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof cloudlayerEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const cloudlayerEndpointMeta = {
	'html.toPdf': {
		riskLevel: 'destructive',
		description:
			'Render base64 HTML to a PDF; v2 returns a job, including a completed job with async:false. Docs: https://cloudlayer.io/docs/html-to-pdf/',
	},
	'html.toPdfV1': {
		riskLevel: 'destructive',
		description:
			'Render base64 HTML to a PDF using the v1 route; returns a base64-encoded binary artifact. Docs: https://cloudlayer.io/docs/html-to-pdf/',
	},
	'html.toImage': {
		riskLevel: 'destructive',
		description:
			'Render base64 HTML to a PNG, JPG, WebP or SVG image; v2 returns a job, including a completed job with async:false. Docs: https://cloudlayer.io/docs/html-to-image/',
	},
	'html.toImageV1': {
		riskLevel: 'destructive',
		description:
			'Render base64 HTML to an image using the v1 route; returns a base64-encoded binary artifact. Docs: https://cloudlayer.io/docs/html-to-image/',
	},
	'url.toPdf': {
		riskLevel: 'destructive',
		description:
			'Capture a live web page (or a batch of URLs) as a PDF; v2 returns a job, including a completed job with async:false. Docs: https://cloudlayer.io/docs/url-to-pdf/',
	},
	'url.toPdfV1': {
		riskLevel: 'destructive',
		description:
			'Capture a URL (or batch) as a PDF using the v1 route; returns a base64-encoded binary artifact. Docs: https://cloudlayer.io/docs/url-to-pdf/',
	},
	'url.toPdfQuick': {
		riskLevel: 'destructive',
		description:
			'GET convenience route that captures a single URL as a PDF with only url and timeout. Docs: https://cloudlayer.io/docs/url-to-pdf/',
	},
	'url.toPdfQuickV1': {
		riskLevel: 'destructive',
		description:
			'GET v1 shortcut that captures one URL as a PDF and returns a base64-encoded binary artifact. Docs: https://cloudlayer.io/docs/url-to-pdf/',
	},
	'url.toImage': {
		riskLevel: 'destructive',
		description:
			'Screenshot a live web page with full viewport, cookie and auth control; v2 returns a job, including a completed job with async:false. Docs: https://cloudlayer.io/docs/url-to-image/',
	},
	'url.toImageV1': {
		riskLevel: 'destructive',
		description:
			'Screenshot a URL using the v1 POST route; returns a base64-encoded binary artifact. Docs: https://cloudlayer.io/docs/url-to-image/',
	},
	'url.toImageQuick': {
		riskLevel: 'destructive',
		description:
			'GET convenience route that creates a JSON job for one URL image with only url and timeout. Docs: https://cloudlayer.io/docs/url-to-image/',
	},
	'url.toImageQuickV1': {
		riskLevel: 'destructive',
		description:
			'GET v1 shortcut that screenshots one URL and returns a base64-encoded binary artifact. Docs: https://cloudlayer.io/docs/url-to-image/',
	},
	'template.toPdf': {
		riskLevel: 'destructive',
		description:
			'Render a gallery or base64 Nunjucks template with caller data to a PDF using JSON or multipart upload; v2 async:false returns a completed JSON job. Docs: https://cloudlayer.io/docs/template-to-pdf/',
	},
	'template.toPdfV1': {
		riskLevel: 'destructive',
		description:
			'Render a gallery or base64 Nunjucks template to a PDF using the v1 route; returns a base64-encoded binary artifact. Docs: https://cloudlayer.io/docs/template-to-pdf/',
	},
	'template.toImage': {
		riskLevel: 'destructive',
		description:
			'Render a gallery or base64 Nunjucks template with caller data to an image using JSON or multipart upload; v2 async:false returns a completed JSON job. Docs: https://cloudlayer.io/docs/template-to-image/',
	},
	'template.toImageV1': {
		riskLevel: 'destructive',
		description:
			'Render a gallery or base64 Nunjucks template to an image using the v1 route; returns a base64-encoded binary artifact. Docs: https://cloudlayer.io/docs/template-to-image/',
	},
	'account.get': {
		riskLevel: 'read',
		description:
			'Read account usage, plan limits, storage use and (on usage plans) the credit balance. Docs: https://cloudlayer.io/docs/account/',
	},
	'assets.list': {
		riskLevel: 'read',
		description:
			'List the most recent generated assets with cursor pagination. Docs: https://cloudlayer.io/docs/assets/',
	},
	'assets.get': {
		riskLevel: 'read',
		description:
			'Get one generated asset including its pre-authenticated download URL. Docs: https://cloudlayer.io/docs/assets/',
	},
	'jobs.list': {
		riskLevel: 'read',
		description:
			'List recent jobs using the documented v1 jobs endpoint with optional cursor parameters. Docs: https://cloudlayer.io/docs/jobs/',
	},
	'jobs.listV2': {
		riskLevel: 'read',
		description:
			'List recent jobs using the v2 jobs endpoint with optional cursor parameters. Docs: https://cloudlayer.io/docs/jobs/',
	},
	'jobs.get': {
		riskLevel: 'read',
		description:
			'Get one job to poll an async generation, including status, size and cost. Docs: https://cloudlayer.io/docs/jobs/',
	},
	'storage.create': {
		riskLevel: 'write',
		description:
			'Create an S3-compatible storage configuration for direct file delivery. Docs: https://cloudlayer.io/docs/storage/',
	},
	'storage.getCurrent': {
		riskLevel: 'read',
		description:
			'Read the current storage configuration with secrets masked. Docs: https://cloudlayer.io/docs/storage/',
	},
	'storage.get': {
		riskLevel: 'read',
		description:
			'Read one storage configuration by ID with secrets masked. Docs: https://cloudlayer.io/docs/storage/',
	},
	'storage.remove': {
		riskLevel: 'destructive',
		description:
			'Delete a storage configuration and revert to cloudlayer.io cloud storage. Docs: https://cloudlayer.io/docs/storage/',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof cloudlayerEndpointsNested
>;

export const cloudlayerAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseCloudlayerPlugin<T extends CloudlayerPluginOptions> =
	CorsairPlugin<
		'cloudlayer',
		typeof CloudlayerSchema,
		typeof cloudlayerEndpointsNested,
		Record<string, never>,
		T,
		typeof defaultAuthType
	>;

export type InternalCloudlayerPlugin =
	BaseCloudlayerPlugin<CloudlayerPluginOptions>;

export type ExternalCloudlayerPlugin<T extends CloudlayerPluginOptions> =
	BaseCloudlayerPlugin<T>;

export function cloudlayer<const T extends CloudlayerPluginOptions>(
	incomingOptions: CloudlayerPluginOptions & T = {} as CloudlayerPluginOptions &
		T,
): ExternalCloudlayerPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'cloudlayer',
		authConfig: cloudlayerAuthConfig,
		schema: CloudlayerSchema,
		options,
		hooks: options.hooks,
		endpoints: cloudlayerEndpointsNested,
		// Webhook support was not requested; callbacks and handlers are omitted.
		webhooks: {},
		endpointMeta: cloudlayerEndpointMeta,
		endpointSchemas: cloudlayerEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: CloudlayerKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const apiKey = await ctx.keys.get_api_key();
				// Core mints a connect link only for an AuthMissingError raised
				// here; the same error thrown later by the client reaches the
				// caller without one.
				if (!apiKey) {
					throw new AuthMissingError('cloudlayer', 'api_key');
				}
				return apiKey;
			}

			return '';
		},
	} satisfies InternalCloudlayerPlugin;
}

export type {
	AccountGetInput,
	AccountGetOutput,
	Asset,
	AssetsGetInput,
	AssetsGetOutput,
	AssetsListInput,
	AssetsListOutput,
	BinaryArtifact,
	CloudlayerEndpointInputs,
	CloudlayerEndpointOutputs,
	GenerationJob,
	GenerationOutput,
	HtmlToImageInput,
	HtmlToImageOutput,
	HtmlToImageV1Input,
	HtmlToImageV1Output,
	HtmlToPdfInput,
	HtmlToPdfOutput,
	HtmlToPdfV1Input,
	HtmlToPdfV1Output,
	Job,
	JobsGetInput,
	JobsGetOutput,
	JobsListInput,
	JobsListOutput,
	StorageConfig,
	StorageCreateInput,
	StorageCreateOutput,
	StorageGetCurrentInput,
	StorageGetCurrentOutput,
	StorageGetInput,
	StorageGetOutput,
	StorageRemoveInput,
	StorageRemoveOutput,
	TemplateToImageInput,
	TemplateToImageOutput,
	TemplateToImageV1Input,
	TemplateToImageV1Output,
	TemplateToPdfInput,
	TemplateToPdfOutput,
	TemplateToPdfV1Input,
	TemplateToPdfV1Output,
	UrlToImageInput,
	UrlToImageOutput,
	UrlToImageQuickInput,
	UrlToImageQuickOutput,
	UrlToImageQuickV1Input,
	UrlToImageQuickV1Output,
	UrlToImageV1Input,
	UrlToImageV1Output,
	UrlToPdfInput,
	UrlToPdfOutput,
	UrlToPdfQuickInput,
	UrlToPdfQuickOutput,
	UrlToPdfQuickV1Input,
	UrlToPdfQuickV1Output,
	UrlToPdfV1Input,
	UrlToPdfV1Output,
} from './endpoints/types';
