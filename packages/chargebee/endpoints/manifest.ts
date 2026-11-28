import { z } from 'zod';
import chargebeeManifestJson from '../chargebee-manifest.json';

/**
 * chargebee-manifest.json is Chargebee's published OpenAPI spec (https://github.com/chargebee/openapi)
 * cut down to what this plugin uses: one entry per operation with a flat
 * input schema (path, query, header and body fields in one object, each
 * property marked with `x-corsair-in`), the request and response kind and the
 * response schema, plus the component schemas they reference in
 * `definitions`. Each operation's `id` is its Corsair name.
 *
 * The manifest is not run through zod at import: that would copy the JSON into
 * a second object graph on every load. `ChargebeeManifestSchema` checks the file
 * in schema.test.ts instead.
 */

// `unknown` is necessary because OpenAPI schemas contain provider-defined JSON Schema keywords.
const OpenApiSchemaDocument = z.record(z.string(), z.unknown());

const OperationSchema = z
	.object({
		id: z.string().regex(/^[a-z][A-Za-z0-9]*(\.[a-z][A-Za-z0-9]*)+$/),
		method: z.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']),
		path: z.string().regex(/^\/[A-Za-z0-9_/{}.-]*$/),
		tag: z.string(),
		summary: z.string(),
		/**
		 * `json`: a JSON body. `multipart`: a form (file fields as bytes).
		 * `form`: URL-encoded fields. `binary`: the file itself is the body.
		 * `none`: no body.
		 */
		request: z.enum(['json', 'multipart', 'form', 'binary', 'none']),
		/** `file`: bytes returned as a Files output. `text`: `{ text }`. `empty`: a 2xx with no body. */
		response: z.enum(['json', 'file', 'text', 'empty']),
		/** A JSON route that may also answer with no body. */
		emptyOk: z.literal(true).optional(),
		/** The input field that holds the whole body (a JSON array, a file). */
		bodyField: z.string().optional(),
		/** The content type a `binary` body is sent as. */
		bodyMediaType: z.string().optional(),
		/** The content types a `file` route documents. */
		fileTypes: z.array(z.string()).optional(),
		/** Body fields the vendor sets itself (readOnly): dropped before sending. */
		serverSetFields: z.array(z.string()).optional(),
		/** A route the vendor is slow to answer: its own request timeout. */
		timeoutMs: z.number().int().positive().optional(),
		/** A larger upload limit than the plugin's default, where the vendor documents one. */
		maxUploadBytes: z.number().int().positive().optional(),
		/** A route whose 429 means a daily quota is spent: sent once, never retried. */
		singleAttempt: z.literal(true).optional(),
		/**
		 * A JSON list route that sends its next-page token only in a response
		 * header: the output is `{ <items>: [...], nextCursor }`, and the
		 * token goes back in the `input` field.
		 */
		headerCursor: z
			.object({ header: z.string(), items: z.string(), input: z.string() })
			.strict()
			.optional(),
		/** A route the vendor marks deprecated but still serves. */
		deprecated: z.literal(true).optional(),
		input: OpenApiSchemaDocument,
		output: OpenApiSchemaDocument.optional(),
	})
	.strict();

export const ChargebeeManifestSchema = z
	.object({
		source: z.string().url(),
		fetched: z.string(),
		operations: z.array(OperationSchema),
		definitions: z.record(z.string(), OpenApiSchemaDocument),
	})
	.strict();

export type ChargebeeOperationDefinition = z.infer<typeof OperationSchema>;
export type ChargebeeOpenApiSchema = z.infer<typeof OpenApiSchemaDocument>;
type ChargebeeManifest = z.infer<typeof ChargebeeManifestSchema>;

export const chargebeeManifest =
	// `unknown` is necessary because a JSON import's inferred type is too wide to assign directly; schema.test.ts parses the file with ChargebeeManifestSchema.
	chargebeeManifestJson as unknown as ChargebeeManifest;

export const chargebeeOperations: readonly ChargebeeOperationDefinition[] =
	chargebeeManifest.operations;

export const chargebeeDefinitions: Record<string, ChargebeeOpenApiSchema> =
	chargebeeManifest.definitions;
