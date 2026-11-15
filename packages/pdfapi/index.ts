import type {
	AuthTypes,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext as KeyBuilderContextBase,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import {
	listTemplates,
	mergeTemplates,
	renderTemplate,
	retrieveTemplate,
} from './endpoints/templates';
import type {
	PdfApiEndpointInputs,
	PdfApiEndpointOutputs,
} from './endpoints/types';
import {
	PdfApiEndpointInputSchemas,
	PdfApiEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { PdfApiSchema } from './schema';

export type PdfApiPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalPdfApiPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof pdfApiEndpointsNested>;
};

const defaultAuthType: AuthTypes = 'api_key';

export type PdfApiContext = CorsairPluginContext<
	typeof PdfApiSchema,
	PdfApiPluginOptions
>;

export type PdfApiKeyBuilderContext =
	KeyBuilderContextBase<PdfApiPluginOptions>;

export const pdfApiAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BasePdfApiPlugin<T extends PdfApiPluginOptions> = CorsairPlugin<
	'pdfapi',
	typeof PdfApiSchema,
	typeof pdfApiEndpointsNested,
	Record<string, never>,
	T,
	typeof defaultAuthType
>;

export type InternalPdfApiPlugin = BasePdfApiPlugin<PdfApiPluginOptions>;

export type ExternalPdfApiPlugin<T extends PdfApiPluginOptions> =
	BasePdfApiPlugin<T>;

export type PdfApiEndpoints = {
	[K in keyof PdfApiEndpointInputs]: CorsairEndpoint<
		PdfApiContext,
		PdfApiEndpointInputs[K],
		PdfApiEndpointOutputs[K]
	>;
};

// Binds every PDF-API.io endpoint to its declared input and output schemas.
// Calls use this validated tree at runtime; the schemas registry stays as
// introspection metadata. The runtime context and per-operation shapes are
// intentional opacity: each unknown below carries its own justification.
function withPdfApiSchemas<
	T extends Record<string, unknown>, // unknown: the tree mixes endpoint functions with family objects at any depth
>(tree: T, prefix = ''): T {
	const validatedEntries = Object.entries(tree).map(([key, value]) => {
		const operation = prefix ? `${prefix}.${key}` : key;
		if (typeof value === 'function') {
			const schema =
				pdfApiEndpointSchemas[operation as keyof typeof pdfApiEndpointSchemas];
			if (!schema) {
				throw new Error(`Missing PdfApi endpoint schema for ${operation}`);
			}
			const endpoint = value as (
				ctx: unknown, // unknown: the Corsair runtime context varies by deployment; passed through untouched
				input: unknown, // unknown: parsed by schema.input.parse before the call
			) => Promise<unknown>; // unknown: each operation returns its own documented shape, parsed by schema.output.parse
			const validated = async (
				ctx: unknown, // unknown: same runtime context as above; only the schema boundary wraps the call
				input: unknown, // unknown: caller-supplied payload, parsed before transport
			) => {
				const parsedInput = schema.input.parse(input ?? {});
				const result = await endpoint(ctx, parsedInput);
				return schema.output.parse(result);
			};
			return [key, validated];
		}
		if (value && typeof value === 'object') {
			return [
				key,
				// unknown: family group nodes are plain objects at arbitrary
				// depth; the wrapper recurses so every nested leaf gets a
				// contract from the registry.
				withPdfApiSchemas(
					value as Record<string, unknown>, // unknown: a family group object, recursed one level deeper
					operation,
				),
			];
		}
		return [key, value];
	});
	// unknown: the rebuild keeps the caller's tree shape while every leaf is
	// replaced by its schema-validated wrapper; TypeScript cannot express the
	// mixed function/object remap structurally, and the satisfies-checked
	// tree definition plus the endpoint schemas registry keep it honest.
	return Object.fromEntries(validatedEntries) as T; // unknown: same tree shape, leaves wrapped by their contracts
}

const pdfApiEndpointsNested = {
	templates: {
		listTemplates: listTemplates,
		retrieveTemplate: retrieveTemplate,
		renderTemplate: renderTemplate,
		mergeTemplates: mergeTemplates,
	},
} as const;

export const pdfApiEndpointMeta = {
	'templates.listTemplates': {
		riskLevel: 'read',
		description: 'Returns the templates in the PDF-API.io account',
	},
	'templates.retrieveTemplate': {
		riskLevel: 'read',
		description: 'Returns one template with its variables by its template id',
	},
	'templates.renderTemplate': {
		// R8: each render spends one PDF from the plan's monthly quota.
		riskLevel: 'destructive',
		description:
			'Renders a template into a PDF document from placeholder values',
	},
	'templates.mergeTemplates': {
		// R8: each merge spends PDF generations from the plan's monthly quota.
		riskLevel: 'destructive',
		description: 'Renders and merges multiple templates into one PDF document',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof pdfApiEndpointsNested>;

export const pdfApiEndpointSchemas = {
	'templates.listTemplates': {
		input: PdfApiEndpointInputSchemas.listTemplates,
		output: PdfApiEndpointOutputSchemas.listTemplates,
	},
	'templates.retrieveTemplate': {
		input: PdfApiEndpointInputSchemas.retrieveTemplate,
		output: PdfApiEndpointOutputSchemas.retrieveTemplate,
	},
	'templates.renderTemplate': {
		input: PdfApiEndpointInputSchemas.renderTemplate,
		output: PdfApiEndpointOutputSchemas.renderTemplate,
	},
	'templates.mergeTemplates': {
		input: PdfApiEndpointInputSchemas.mergeTemplates,
		output: PdfApiEndpointOutputSchemas.mergeTemplates,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof pdfApiEndpointsNested
>;

const validatedPdfApiEndpointsNested = withPdfApiSchemas(pdfApiEndpointsNested);

export function pdfapi<const T extends PdfApiPluginOptions>(
	incomingOptions: PdfApiPluginOptions & T = {} as PdfApiPluginOptions & T,
): ExternalPdfApiPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'pdfapi',
		authConfig: pdfApiAuthConfig,
		schema: PdfApiSchema,
		options,
		hooks: options.hooks,
		endpoints: validatedPdfApiEndpointsNested,
		webhooks: {},
		endpointMeta: pdfApiEndpointMeta,
		endpointSchemas: pdfApiEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: PdfApiKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) return options.key;
			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}
			throw new AuthMissingError('pdfapi', 'api_key');
		},
	} satisfies InternalPdfApiPlugin;
}
