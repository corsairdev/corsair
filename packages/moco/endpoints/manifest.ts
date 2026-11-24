import { z } from 'zod';
import mocoManifestJson from '../moco-manifest.json';

/**
 * moco-manifest.json is MOCO's published OpenAPI spec
 * (https://docs.mocoapp.com/api/docs/v1/openapi.json and the path and schema
 * files it references) cut down to what this plugin uses: one entry per
 * operation with a flat input schema (path, query, header and body fields in
 * one object, each property marked with `x-corsair-in`), the request and
 * response kind and the response schema, plus the component schemas they
 * reference in `definitions`. Each operation's `id` is its Corsair name
 * (`projects.tasks.create`).
 *
 * The manifest is not run through zod at import: that would copy the JSON into
 * a second object graph on every load. `MocoManifestSchema` checks the file
 * in schema.test.ts instead.
 */

// `unknown` is necessary because OpenAPI schemas contain provider-defined JSON Schema keywords.
const OpenApiSchemaDocument = z.record(z.string(), z.unknown());

const OperationSchema = z
	.object({
		id: z.string().regex(/^[a-z][A-Za-z0-9]*(\.[a-z][A-Za-z0-9]*)+$/),
		method: z.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']),
		// `/invoices/{id}.pdf`, hence the dot.
		path: z.string().regex(/^\/[A-Za-z0-9_/{}.-]+$/),
		tag: z.string(),
		summary: z.string(),
		/** `json`: a JSON body. `multipart`: a form with a `file` field. `none`: no body. */
		request: z.enum(['json', 'multipart', 'none']),
		/** `file`: a PDF returned as a Files output. `empty`: a 2xx with no body. */
		response: z.enum(['json', 'file', 'empty']),
		/** A JSON route that may also answer 204 (or 200) with no body. */
		emptyOk: z.literal(true).optional(),
		/**
		 * A list MOCO pages with `page` / `per_page` (the page numbers are in
		 * response headers): returned as `{ items, next_page }`.
		 */
		paginated: z.literal(true).optional(),
		/** Body fields MOCO sets itself (readOnly): dropped before sending. */
		serverSetFields: z.array(z.string()).optional(),
		/** A route MOCO is slow to answer (seen live): its own request timeout. */
		timeoutMs: z.number().int().positive().optional(),
		input: OpenApiSchemaDocument,
		output: OpenApiSchemaDocument.optional(),
	})
	.strict();

export const MocoManifestSchema = z
	.object({
		source: z.string().url(),
		fetched: z.string(),
		operations: z.array(OperationSchema),
		definitions: z.record(z.string(), OpenApiSchemaDocument),
	})
	.strict();

export type MocoOperationDefinition = z.infer<typeof OperationSchema>;
export type MocoOpenApiSchema = z.infer<typeof OpenApiSchemaDocument>;
type MocoManifest = z.infer<typeof MocoManifestSchema>;

// Typed by MocoManifestSchema; schema.test.ts parses the file with it.
export const mocoManifest =
	// `unknown` is necessary because a JSON import's inferred type is too wide to assign directly; schema.test.ts parses the file with MocoManifestSchema.
	mocoManifestJson as unknown as MocoManifest;

export const mocoOperations: readonly MocoOperationDefinition[] =
	mocoManifest.operations;

export const mocoDefinitions: Record<string, MocoOpenApiSchema> =
	mocoManifest.definitions;
