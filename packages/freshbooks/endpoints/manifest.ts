import { z } from 'zod';
import freshbooksManifestJson from '../freshbooks-manifest.json';

/**
 * freshbooks-manifest.json is FreshBooks's published OpenAPI spec (https://www.freshbooks.com/api/start)
 * cut down to what this plugin uses: one entry per operation with a flat
 * input schema (path, query, header and body fields in one object, each
 * property marked with `x-corsair-in`), the request and response kind and the
 * response schema, plus the component schemas they reference in
 * `definitions`. Each operation's `id` is its Corsair name.
 *
 * The manifest is not run through zod at import: that would copy the JSON into
 * a second object graph on every load. `FreshBooksManifestSchema` checks the file
 * in schema.test.ts instead.
 */

// `unknown` is necessary because OpenAPI schemas contain provider-defined JSON Schema keywords.
const OpenApiSchemaDocument = z.record(z.string(), z.unknown());

const OperationSchema = z
	.object({
		id: z.string().regex(/^[a-z][A-Za-z0-9]*(\.[a-z][A-Za-z0-9]*)+$/),
		method: z.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']),
		path: z.string().regex(/^\/[A-Za-z0-9_/{}.@$-]*$/),
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
		/** The content type a `binary` body, or a JSON body of another JSON type (JSON Patch), is sent as. */
		bodyMediaType: z.string().optional(),
		/** The content types a `file` route documents. */
		fileTypes: z.array(z.string()).optional(),
		/** Body fields the vendor sets itself (readOnly): dropped before sending. */
		serverSetFields: z.array(z.string()).optional(),
		/** A route the vendor is slow to answer: its own request timeout. */
		timeoutMs: z.number().int().positive().optional(),
		/** A larger upload limit than the plugin's default, where the vendor documents one. */
		maxUploadBytes: z.number().int().positive().optional(),
		/** A raw upload the vendor reads as base64 text, not bytes (Azure DevOps wiki attachments). */
		base64Body: z.literal(true).optional(),
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
		/** The key a JSON body is sent under, as a one-item list: `{ <key>: [body] }` (Ghost's format). */
		bodyEnvelope: z.string().optional(),
		/**
		 * A route whose answer also carries a response header the caller needs
		 * (a page's `ETag`, sent back as `If-Match`): it comes back as `field`.
		 */
		responseHeader: z
			.object({ header: z.string(), field: z.string() })
			.strict()
			.optional(),
		/**
		 * Body fields every call of the route sends (`{ invoice: { action_email: true } }`):
		 * FreshBooks runs delete, send and mark-as-sent through the update route.
		 */
		fixedBody: z
			.record(z.string(), z.record(z.string(), z.unknown()))
			.optional(),
		/**
		 * Body fields the route refuses (`{ invoice: ['action_email'] }`): an
		 * update must not send email; the send operation does that.
		 */
		refusedBody: z.record(z.string(), z.array(z.string())).optional(),
		/** Headers every call of the route sends (the ledger API's x-api-version). */
		fixedHeaders: z.record(z.string(), z.string()).optional(),
		/** Query values every call sends (an API version the route is documented at). */
		fixedQuery: z.record(z.string(), z.string()).optional(),
		/** The API host the route lives on, where the vendor splits routes across hosts. */
		host: z.string().optional(),
		/** A route the vendor marks deprecated but still serves. */
		deprecated: z.literal(true).optional(),
		input: OpenApiSchemaDocument,
		output: OpenApiSchemaDocument.optional(),
	})
	.strict();

export const FreshBooksManifestSchema = z
	.object({
		source: z.string().url(),
		fetched: z.string(),
		operations: z.array(OperationSchema),
		definitions: z.record(z.string(), OpenApiSchemaDocument),
	})
	.strict();

export type FreshBooksOperationDefinition = z.infer<typeof OperationSchema>;
export type FreshBooksOpenApiSchema = z.infer<typeof OpenApiSchemaDocument>;
type FreshBooksManifest = z.infer<typeof FreshBooksManifestSchema>;

export const freshbooksManifest =
	// `unknown` is necessary because a JSON import's inferred type is too wide to assign directly; schema.test.ts parses the file with FreshBooksManifestSchema.
	freshbooksManifestJson as unknown as FreshBooksManifest;

export const freshbooksOperations: readonly FreshBooksOperationDefinition[] =
	freshbooksManifest.operations;

export const freshbooksDefinitions: Record<string, FreshBooksOpenApiSchema> =
	freshbooksManifest.definitions;
