import { z } from 'zod';
import amikaManifestJson from '../amika-manifest.json';

/**
 * amika-manifest.json is Amika's published OpenAPI spec
 * (https://app.amika.dev/api/v0beta1/openapi.json) cut down to what this
 * plugin uses: one entry per operation with a flat input schema (path, query,
 * header and body fields in one object, each property marked with
 * `x-corsair-in`), the response kind and the response schema, plus the
 * component schemas they reference in `definitions`. Each operation's `id` is
 * its Corsair name (`rigs.create`), which follows Amika's TypeScript SDK.
 *
 * The manifest is not run through zod at import: that would copy the JSON into
 * a second object graph on every load. `AmikaManifestSchema` checks the file in
 * schema.test.ts instead.
 */

// `unknown` is necessary because OpenAPI schemas contain provider-defined JSON Schema keywords.
const OpenApiSchemaDocument = z.record(z.string(), z.unknown());

const OperationSchema = z
	.object({
		id: z.string().regex(/^[a-z][A-Za-z0-9]*(\.[a-z][A-Za-z0-9]*)+$/),
		method: z.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']),
		// `/rigs:slackMetadata` is a custom method (AIP-136), hence the colon.
		path: z.string().regex(/^\/[A-Za-z0-9_/{}:-]+$/),
		tag: z.string(),
		summary: z.string(),
		/** `json`: a JSON body. `none`: no body. */
		request: z.enum(['json', 'none']),
		/** `empty`: a 2xx with no body (204). */
		response: z.enum(['json', 'empty']),
		/** Body fields Amika sets itself (readOnly): dropped before sending. */
		serverSetFields: z.array(z.string()).optional(),
		input: OpenApiSchemaDocument,
		output: OpenApiSchemaDocument.optional(),
	})
	.strict();

export const AmikaManifestSchema = z
	.object({
		source: z.string().url(),
		fetched: z.string(),
		operations: z.array(OperationSchema),
		definitions: z.record(z.string(), OpenApiSchemaDocument),
	})
	.strict();

export type AmikaOperationDefinition = z.infer<typeof OperationSchema>;
export type AmikaOpenApiSchema = z.infer<typeof OpenApiSchemaDocument>;
type AmikaManifest = z.infer<typeof AmikaManifestSchema>;

// Typed by AmikaManifestSchema; schema.test.ts parses the file with it.
export const amikaManifest =
	// `unknown` is necessary because a JSON import's inferred type is too wide to assign directly; schema.test.ts parses the file with AmikaManifestSchema.
	amikaManifestJson as unknown as AmikaManifest;

export const amikaOperations: readonly AmikaOperationDefinition[] =
	amikaManifest.operations;

export const amikaDefinitions: Record<string, AmikaOpenApiSchema> =
	amikaManifest.definitions;
