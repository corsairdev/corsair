import { z } from 'zod';
import maritimeManifestJson from '../maritime-manifest.json';

/**
 * maritime-manifest.json is Maritime's published OpenAPI spec
 * (https://api.maritime.sh/openapi.json) cut down to what this plugin uses: one entry per
 * operation with a flat input schema (path, query, header and body fields in
 * one object, each property marked with `x-corsair-in`), the request and
 * response kind and the response schema, plus the component schemas they
 * reference in `definitions`. Each operation's `id` is its Corsair name
 * (`sandboxes.commands.run`).
 *
 * The manifest is not run through zod at import: that would copy the JSON into
 * a second object graph on every load. `MaritimeManifestSchema` checks the file
 * in schema.test.ts instead.
 */

// `unknown` is necessary because OpenAPI schemas contain provider-defined JSON Schema keywords.
const OpenApiSchemaDocument = z.record(z.string(), z.unknown());

const OperationSchema = z
	.object({
		id: z.string().regex(/^[a-z][A-Za-z0-9]*(\.[a-z][A-Za-z0-9]*)+$/),
		method: z.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']),
		// `/api/v1/network/install/{token}/unix.sh`, hence the dot.
		path: z.string().regex(/^\/[A-Za-z0-9_/{}.-]*$/),
		tag: z.string(),
		summary: z.string(),
		/**
		 * `json`: a JSON body. `multipart`: a form with a file field. `raw`: the
		 * file itself (a file write). `none`: no body.
		 */
		request: z.enum(['json', 'multipart', 'raw', 'none']),
		/** `file`: bytes returned as a Files output. `text`: `{ text }`. `empty`: a 2xx with no body. */
		response: z.enum(['json', 'file', 'text', 'empty']),
		/** A JSON route that may also answer 204 (or 200) with no body. */
		emptyOk: z.literal(true).optional(),
		/**
		 * `data`: a virtual machine's data plane (its `dataPlaneUrl`, with its
		 * `secret` in X-Maritime-Token), not api.maritime.sh.
		 */
		plane: z.literal('data').optional(),
		/** An input field in seconds the call can run for: the request waits that long. */
		timeoutFromInput: z.string().optional(),
		input: OpenApiSchemaDocument,
		output: OpenApiSchemaDocument.optional(),
	})
	.strict();

export const MaritimeManifestSchema = z
	.object({
		source: z.string().url(),
		fetched: z.string(),
		operations: z.array(OperationSchema),
		definitions: z.record(z.string(), OpenApiSchemaDocument),
	})
	.strict();

export type MaritimeOperationDefinition = z.infer<typeof OperationSchema>;
export type MaritimeOpenApiSchema = z.infer<typeof OpenApiSchemaDocument>;
type MaritimeManifest = z.infer<typeof MaritimeManifestSchema>;

// Typed by MaritimeManifestSchema; schema.test.ts parses the file with it.
export const maritimeManifest =
	// `unknown` is necessary because a JSON import's inferred type is too wide to assign directly; schema.test.ts parses the file with MaritimeManifestSchema.
	maritimeManifestJson as unknown as MaritimeManifest;

export const maritimeOperations: readonly MaritimeOperationDefinition[] =
	maritimeManifest.operations;

export const maritimeDefinitions: Record<string, MaritimeOpenApiSchema> =
	maritimeManifest.definitions;
