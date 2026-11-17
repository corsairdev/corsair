import type {
	AuthTypes,
	CorsairErrorHandler,
	CorsairPlugin,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import type { PdfLessContext } from './context';
import { generatePdf, getWorkspace, listTemplates } from './endpoints';
import {
	GeneratePdfInputSchema,
	GeneratePdfResponseSchema,
	GetWorkspaceInputSchema,
	GetWorkspaceResponseSchema,
	ListTemplatesInputSchema,
	ListTemplatesResponseSchema,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { PdfLessSchema } from './schema';

export type { PdfLessContext };

export type PdfLessPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalPdfLessPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof pdfLessEndpointsNested>;
};

export type PdfLessKeyBuilderContext = KeyBuilderContext<PdfLessPluginOptions>;

const pdfLessEndpointsNested = {
	workspace: { get: getWorkspace },
	templates: { list: listTemplates },
	pdfs: { generate: generatePdf },
} as const;

const pdfLessWebhooksNested = {} as const;

export const pdfLessEndpointSchemas = {
	'workspace.get': {
		input: GetWorkspaceInputSchema,
		output: GetWorkspaceResponseSchema,
	},
	'templates.list': {
		input: ListTemplatesInputSchema,
		output: ListTemplatesResponseSchema,
	},
	'pdfs.generate': {
		input: GeneratePdfInputSchema,
		output: GeneratePdfResponseSchema,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof pdfLessEndpointsNested
>;

const pdfLessEndpointMeta = {
	'workspace.get': {
		riskLevel: 'read',
		description: 'Read the PDFLess workspace for the connected API key.',
	},
	'templates.list': {
		riskLevel: 'read',
		description: 'List document templates in the PDFLess workspace.',
	},
	'pdfs.generate': {
		riskLevel: 'destructive',
		description:
			'Render a PDF from a document template and return its download link. Uses one document from the workspace quota.',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof pdfLessEndpointsNested>;

const defaultAuthType = 'api_key' as const satisfies AuthTypes;

export const pdfLessAuthConfig = {
	api_key: {
		account: [] as const,
	},
} as const satisfies PluginAuthConfig;

export type BasePdfLessPlugin<T extends PdfLessPluginOptions> = CorsairPlugin<
	'pdfless',
	typeof PdfLessSchema,
	typeof pdfLessEndpointsNested,
	typeof pdfLessWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalPdfLessPlugin = BasePdfLessPlugin<PdfLessPluginOptions>;

export type ExternalPdfLessPlugin<T extends PdfLessPluginOptions> =
	BasePdfLessPlugin<T>;

export function pdfless<const T extends PdfLessPluginOptions>(
	incomingOptions: PdfLessPluginOptions & T = {} as PdfLessPluginOptions & T,
): ExternalPdfLessPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'pdfless',
		authConfig: pdfLessAuthConfig,
		schema: PdfLessSchema,
		options,
		hooks: options.hooks,
		endpoints: pdfLessEndpointsNested,
		webhooks: pdfLessWebhooksNested,
		endpointMeta: pdfLessEndpointMeta,
		endpointSchemas: pdfLessEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: PdfLessKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}
			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();
				if (!key) {
					throw new AuthMissingError('pdfless', 'api_key');
				}
				return key;
			}
			return '';
		},
	} satisfies InternalPdfLessPlugin;
}
