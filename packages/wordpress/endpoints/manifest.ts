import { z } from 'zod';
import wordpressManifestJson from '../wordpress-manifest.json';

/**
 * wordpress-manifest.json is the site's own REST index
 * (`GET /wp-json/?context=help` on a fresh WordPress, version in `version`)
 * cut down to what this plugin uses: one entry per operation with a flat input
 * schema (path, query and body fields in one object, each path and query
 * property marked with `x-corsair-in`), the request kind and the response
 * schema, plus the route item schemas they reference in `definitions`. Each
 * operation's `id` is its Corsair name (`posts.revisions.list`).
 *
 * The manifest is not run through zod at import: that would copy the JSON into
 * a second object graph on every load. `WordpressManifestSchema` checks the
 * file in schema.test.ts instead.
 */

// `unknown` is necessary because route schemas contain provider-defined JSON Schema keywords.
const OpenApiSchemaDocument = z.record(z.string(), z.unknown());

const OperationSchema = z
	.object({
		id: z.string().regex(/^[a-z][A-Za-z0-9]*(\.[a-z][A-Za-z0-9]*)+$/),
		method: z.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']),
		path: z.string().regex(/^\/[A-Za-z0-9_/{}.-]*$/),
		/** The REST namespace the route belongs to (`wp/v2`, `wp-abilities/v1`). */
		tag: z.string(),
		/**
		 * `json`: a JSON body. `upload`: the `file` input is the raw body (its
		 * name in Content-Disposition) and every other field goes in the query
		 * string. `none`: no body.
		 */
		request: z.enum(['json', 'upload', 'none']),
		/** `file`: bytes returned as a Files output (the theme export zip). */
		response: z.enum(['json', 'file']),
		/** The route's item schema in `definitions`. */
		item: z.string().optional(),
		/**
		 * A list WordPress pages with `page` / `per_page`: returned as
		 * `{ items, next_page }`.
		 */
		paginated: z.literal(true).optional(),
		/** The route's default `per_page`. */
		pageSize: z.number().int().positive().optional(),
		input: OpenApiSchemaDocument,
		output: OpenApiSchemaDocument.optional(),
	})
	.strict();

export const WordpressManifestSchema = z
	.object({
		source: z.string().url(),
		/** The WordPress version the index came from. */
		version: z.string(),
		fetched: z.string(),
		operations: z.array(OperationSchema),
		webhooks: z.array(z.never()),
		definitions: z.record(z.string(), OpenApiSchemaDocument),
	})
	.strict();

export type WordpressOperationDefinition = z.infer<typeof OperationSchema>;
export type WordpressOpenApiSchema = z.infer<typeof OpenApiSchemaDocument>;
type WordpressManifest = z.infer<typeof WordpressManifestSchema>;

// Typed by WordpressManifestSchema; schema.test.ts parses the file with it.
export const wordpressManifest =
	// `unknown` is necessary because a JSON import's inferred type is too wide to assign directly; schema.test.ts parses the file with WordpressManifestSchema.
	wordpressManifestJson as unknown as WordpressManifest;

export const wordpressOperations: readonly WordpressOperationDefinition[] =
	wordpressManifest.operations;

export const wordpressDefinitions: Record<string, WordpressOpenApiSchema> =
	wordpressManifest.definitions;
