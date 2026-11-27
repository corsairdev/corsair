import { z } from 'zod';
import daytonaManifestJson from '../daytona-manifest.json';

/**
 * daytona-manifest.json is Daytona's published OpenAPI spec
 * (https://www.daytona.io/docs/openapi.json, with the Toolbox and Analytics specs joined in) cut down to what this plugin uses: one entry per
 * operation with a flat input schema (path, query, header and body fields in
 * one object, each property marked with `x-corsair-in`), the request and
 * response kind and the response schema, plus the component schemas they
 * reference in `definitions`. Each operation's `id` is its Corsair name
 * (`machines.exec`).
 *
 * The manifest is not run through zod at import: that would copy the JSON into
 * a second object graph on every load. `DaytonaManifestSchema` checks the file
 * in schema.test.ts instead.
 */

// `unknown` is necessary because OpenAPI schemas contain provider-defined JSON Schema keywords.
const OpenApiSchemaDocument = z.record(z.string(), z.unknown());

const OperationSchema = z
	.object({
		id: z.string().regex(/^[a-z][A-Za-z0-9]*(\.[a-z][A-Za-z0-9]*)+$/),
		method: z.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']),
		// Paths are `/v1/...` with `{name}` placeholders.
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
		 * `toolbox`: the sandbox's Toolbox API, behind Daytona's proxy.
		 * `analytics`: the Analytics API. Both take the same key.
		 */
		plane: z.enum(['toolbox', 'analytics']).optional(),
		/** An input field in seconds the call can run for: the request waits that long. */
		timeoutFromInput: z.string().optional(),
		input: OpenApiSchemaDocument,
		output: OpenApiSchemaDocument.optional(),
	})
	.strict();

export const DaytonaManifestSchema = z
	.object({
		source: z.string().url(),
		fetched: z.string(),
		operations: z.array(OperationSchema),
		definitions: z.record(z.string(), OpenApiSchemaDocument),
	})
	.strict();

export type DaytonaOperationDefinition = z.infer<typeof OperationSchema>;
export type DaytonaOpenApiSchema = z.infer<typeof OpenApiSchemaDocument>;
type DaytonaManifest = z.infer<typeof DaytonaManifestSchema>;

// Typed by DaytonaManifestSchema; schema.test.ts parses the file with it.
export const daytonaManifest =
	// `unknown` is necessary because a JSON import's inferred type is too wide to assign directly; schema.test.ts parses the file with DaytonaManifestSchema.
	daytonaManifestJson as unknown as DaytonaManifest;

export const daytonaOperations: readonly DaytonaOperationDefinition[] =
	daytonaManifest.operations;

export const daytonaDefinitions: Record<string, DaytonaOpenApiSchema> =
	daytonaManifest.definitions;
