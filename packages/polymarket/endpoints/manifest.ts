import { z } from 'zod';
import polymarketManifestJson from '../polymarket-manifest.json';

/**
 * polymarket-manifest.json holds every operation with a flat input schema
 * (path, query, header and body fields in one object, each parameter marked
 * with `x-corsair-in`), the request and response kind and the response
 * schema, the host it's served from and the credential it needs. It comes
 * from the OpenAPI documents in Polymarket's API reference
 * (docs.polymarket.com). Each operation's `id` is its Corsair name
 * (`gamma.markets.list`).
 *
 * The manifest is not run through zod at import: that would copy the JSON into
 * a second object graph on every load. `PolymarketManifestSchema` checks the
 * file in schema.test.ts instead.
 */

// `unknown` is necessary because route schemas contain provider-defined JSON Schema keywords.
const OpenApiSchemaDocument = z.record(z.string(), z.unknown());

const OperationSchema = z
	.object({
		id: z.string().regex(/^[a-z][A-Za-z0-9]*(\.[a-z][A-Za-z0-9]*)+$/),
		method: z.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']),
		path: z.string().regex(/^\/[A-Za-z0-9_/{}.-]*$/),
		/** Which of Polymarket's APIs serves the route (client.ts POLYMARKET_HOSTS). */
		host: z.enum([
			'gamma',
			'data',
			'clob',
			'bridge',
			'relayer',
			'rfq',
			'combos',
			'perps',
		]),
		/** The credential the route needs (client.ts polymarketAuthHeaders). */
		auth: z.enum(['none', 'clob', 'clobL1', 'perps', 'rfq', 'relayer']),
		tag: z.string(),
		/** `json`: an object body from the fields. `json-raw`: the `body` field is the whole body (a list). `none`: no body. */
		request: z.enum(['json', 'json-raw', 'none']),
		/** `json`; `text`: returned as `{ text }`; `empty`: returned as `{ success: true }`. */
		response: z.enum(['json', 'text', 'empty']),
		/** A JSON route that may also answer with no body. */
		emptyOk: z.literal(true).optional(),
		input: OpenApiSchemaDocument,
		output: OpenApiSchemaDocument.optional(),
	})
	.strict();

export const PolymarketManifestSchema = z
	.object({
		source: z.string().url(),
		/** The date the API reference was fetched. */
		version: z.string(),
		fetched: z.string(),
		operations: z.array(OperationSchema),
		webhooks: z.array(z.never()),
		definitions: z.record(z.string(), OpenApiSchemaDocument),
	})
	.strict();

export type PolymarketOperationDefinition = z.infer<typeof OperationSchema>;
export type PolymarketOpenApiSchema = z.infer<typeof OpenApiSchemaDocument>;
type PolymarketManifest = z.infer<typeof PolymarketManifestSchema>;

// Typed by PolymarketManifestSchema; schema.test.ts parses the file with it.
export const polymarketManifest =
	// `unknown` is necessary because a JSON import's inferred type is too wide to assign directly; schema.test.ts parses the file with PolymarketManifestSchema.
	polymarketManifestJson as unknown as PolymarketManifest;

export const polymarketOperations: readonly PolymarketOperationDefinition[] =
	polymarketManifest.operations;

export const polymarketDefinitions: Record<string, PolymarketOpenApiSchema> =
	polymarketManifest.definitions;
