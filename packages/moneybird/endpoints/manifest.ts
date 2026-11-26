import { z } from 'zod';
import moneybirdManifestJson from '../moneybird-manifest.json';

/**
 * moneybird-manifest.json is Moneybird's published OpenAPI spec
 * (https://github.com/moneybird/openapi) cut down to what this plugin uses: one entry per
 * operation with a flat input schema (path, query, header and body fields in
 * one object, each property marked with `x-corsair-in`), the request and
 * response kind and the response schema, plus the component schemas they
 * reference in `definitions`. Each operation's `id` is its Corsair name
 * (`contacts.contactPeople.create`).
 *
 * The manifest is not run through zod at import: that would copy the JSON into
 * a second object graph on every load. `MoneybirdManifestSchema` checks the file
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
		 * A list Moneybird pages with `page` / `per_page` (the page numbers are in
		 * response headers): returned as `{ items, next_page }`.
		 */
		paginated: z.literal(true).optional(),
		/** Body fields Moneybird sets itself (readOnly): dropped before sending. */
		serverSetFields: z.array(z.string()).optional(),
		/** A route above the administration scope (administrations.list). */
		global: z.literal(true).optional(),
		/** A route Moneybird is slow to answer: its own request timeout. */
		timeoutMs: z.number().int().positive().optional(),
		input: OpenApiSchemaDocument,
		output: OpenApiSchemaDocument.optional(),
	})
	.strict();

export const MoneybirdManifestSchema = z
	.object({
		source: z.string().url(),
		fetched: z.string(),
		operations: z.array(OperationSchema),
		definitions: z.record(z.string(), OpenApiSchemaDocument),
	})
	.strict();

export type MoneybirdOperationDefinition = z.infer<typeof OperationSchema>;
export type MoneybirdOpenApiSchema = z.infer<typeof OpenApiSchemaDocument>;
type MoneybirdManifest = z.infer<typeof MoneybirdManifestSchema>;

// Typed by MoneybirdManifestSchema; schema.test.ts parses the file with it.
export const moneybirdManifest =
	// `unknown` is necessary because a JSON import's inferred type is too wide to assign directly; schema.test.ts parses the file with MoneybirdManifestSchema.
	moneybirdManifestJson as unknown as MoneybirdManifest;

export const moneybirdOperations: readonly MoneybirdOperationDefinition[] =
	moneybirdManifest.operations;

export const moneybirdDefinitions: Record<string, MoneybirdOpenApiSchema> =
	moneybirdManifest.definitions;
