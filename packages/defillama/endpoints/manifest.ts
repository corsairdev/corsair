import { z } from 'zod';
import defillamaManifestJson from '../defillama-manifest.json';

/**
 * defillama-manifest.json holds every operation with a flat input schema
 * (path, query, header and body fields in one object, each parameter marked
 * with `x-corsair-in`), the request and response kind and the response
 * schema, the Pro route and, for the 73 routes DefiLlama also serves
 * without a key, the free host and route. It comes from DefiLlama's OpenAPI
 * specs (api-docs.defillama.com). Each operation's `id` is its Corsair name
 * (`tvl.protocols`).
 *
 * The manifest is not run through zod at import: that would copy the JSON into
 * a second object graph on every load. `DefillamaManifestSchema` checks the
 * file in schema.test.ts instead.
 */

// `unknown` is necessary because route schemas contain provider-defined JSON Schema keywords.
const OpenApiSchemaDocument = z.record(z.string(), z.unknown());

const OperationSchema = z
	.object({
		id: z.string().regex(/^[a-z][A-Za-z0-9]*(\.[a-z][A-Za-z0-9]*)+$/),
		method: z.literal('GET'),
		/** The Pro route at pro-api.llama.fi, with the key as `{api_key}`. */
		path: z.string().regex(/^\/[A-Za-z0-9_/{}.-]*$/),
		tag: z.string(),
		/** The free host and route serving the same data without a key. */
		free: z
			.object({
				base: z.string().url(),
				path: z.string().regex(/^\/[A-Za-z0-9_/{}.-]*$/),
			})
			.strict()
			.optional(),
		input: OpenApiSchemaDocument,
		output: OpenApiSchemaDocument.optional(),
	})
	.strict();

export const DefillamaManifestSchema = z
	.object({
		source: z.string().url(),
		version: z.string(),
		fetched: z.string(),
		operations: z.array(OperationSchema),
		webhooks: z.array(z.never()),
		definitions: z.record(z.string(), OpenApiSchemaDocument),
	})
	.strict();

export type DefillamaOperationDefinition = z.infer<typeof OperationSchema>;
export type DefillamaOpenApiSchema = z.infer<typeof OpenApiSchemaDocument>;
type DefillamaManifest = z.infer<typeof DefillamaManifestSchema>;

// Typed by DefillamaManifestSchema; schema.test.ts parses the file with it.
export const defillamaManifest =
	// `unknown` is necessary because a JSON import's inferred type is too wide to assign directly; schema.test.ts parses the file with DefillamaManifestSchema.
	defillamaManifestJson as unknown as DefillamaManifest;

export const defillamaOperations: readonly DefillamaOperationDefinition[] =
	defillamaManifest.operations;

export const defillamaDefinitions: Record<string, DefillamaOpenApiSchema> =
	defillamaManifest.definitions;
