import { z } from 'zod';
import kernelManifestJson from '../kernel-manifest.json';

/**
 * kernel-manifest.json is Kernel's published OpenAPI spec
 * (https://api.onkernel.com/openapi.json) cut down to what this plugin uses:
 * one entry per operation with a flat input schema (path, query, header and
 * body fields in one object, each property marked with `x-corsair-in`), the
 * response kind, and the response schema, plus the component schemas they
 * reference in `definitions`. Each operation's `id` is its Corsair name
 * (`browsers.create`), which follows Kernel's Node SDK resource tree.
 *
 * The manifest is not run through zod at import: that would copy ~0.8 MB of
 * JSON into a second object graph on every load. `KernelManifestSchema`
 * checks the file in schema.test.ts instead.
 */

// `unknown` is necessary because OpenAPI schemas contain provider-defined JSON Schema keywords.
const OpenApiSchemaDocument = z.record(z.string(), z.unknown());

const OperationSchema = z
	.object({
		id: z.string().regex(/^[a-z][A-Za-z0-9]*(\.[a-z][A-Za-z0-9]*)+$/),
		method: z.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']),
		path: z.string().regex(/^\/[a-z0-9_/{}-]+$/),
		tag: z.string(),
		summary: z.string(),
		/** How the body is sent: JSON, multipart form (file fields), raw bytes, or none. */
		request: z.enum(['json', 'multipart', 'binary', 'none']),
		/** `file`: bytes returned as a Files output. `empty`: a 2xx with no body. */
		response: z.enum(['json', 'file', 'empty']),
		/** The response header that pages the list: X-Next-Offset, X-Next-Page-Token or X-Next-Cursor. */
		paging: z.enum(['offset', 'page_token', 'cursor']).optional(),
		/** A 204 (no browser free before the poll ended) comes back as null. */
		emptyMeansNone: z.literal(true).optional(),
		input: OpenApiSchemaDocument,
		output: OpenApiSchemaDocument.optional(),
	})
	.strict();

export const KernelManifestSchema = z
	.object({
		source: z.string().url(),
		fetched: z.string(),
		operations: z.array(OperationSchema),
		definitions: z.record(z.string(), OpenApiSchemaDocument),
	})
	.strict();

export type KernelOperationDefinition = z.infer<typeof OperationSchema>;
export type KernelOpenApiSchema = z.infer<typeof OpenApiSchemaDocument>;
type KernelManifest = z.infer<typeof KernelManifestSchema>;

// Typed by KernelManifestSchema; schema.test.ts parses the file with it.
export const kernelManifest =
	// `unknown` is necessary because a JSON import's inferred type is too wide to assign directly; schema.test.ts parses the file with KernelManifestSchema.
	kernelManifestJson as unknown as KernelManifest;

export const kernelOperations: readonly KernelOperationDefinition[] =
	kernelManifest.operations;

export const kernelDefinitions: Record<string, KernelOpenApiSchema> =
	kernelManifest.definitions;
