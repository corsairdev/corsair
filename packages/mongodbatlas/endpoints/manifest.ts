import { z } from 'zod';
import mongodbatlasManifestJson from '../mongodbatlas-manifest.json';

/**
 * mongodbatlas-manifest.json is MongoDB's Atlas Admin API v2 OpenAPI document
 * (https://www.mongodb.com/docs/api/doc/atlas-admin-api-v2.json) cut down to
 * what this plugin uses: one entry per non-deprecated operation with a flat
 * input schema (path, query, header and body fields in one object, each
 * non-body property marked with `x-corsair-in`), the media-type version the
 * call is pinned to, the request and response kind and the response schema,
 * plus the component schemas they reference. Each operation's `id` is the
 * Atlas CLI's name for it (`clusters.listClusters`).
 *
 * The manifest is not run through zod at import: that would copy the JSON into
 * a second object graph on every load. `MongoDBAtlasManifestSchema` checks the
 * file in schema.test.ts instead.
 */

// `unknown` is necessary because OpenAPI schemas contain provider-defined JSON Schema keywords.
const OpenApiSchemaDocument = z.record(z.string(), z.unknown());

const OperationSchema = z
	.object({
		id: z.string().regex(/^[a-z][A-Za-z0-9]*(\.[a-z][A-Za-z0-9]*)+$/),
		method: z.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']),
		path: z.string().regex(/^\/api\/atlas\/v2[A-Za-z0-9_/{}:.-]*$/),
		tag: z.string(),
		summary: z.string(),
		/** The API version the call is pinned to (`2025-03-12`). */
		version: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
		/** The Accept header (and, with a body, its Content-Type). */
		accept: z.string(),
		/** `json`: a JSON body. `none`: no body. */
		request: z.enum(['json', 'none']),
		/** `file`: a CSV or gzipped log returned as a file. `empty`: no body. */
		response: z.enum(['json', 'file', 'empty']),
		/** A JSON route that may also answer 202/204 with no body. */
		emptyOk: z.literal(true).optional(),
		/** A list paged with pageNum / itemsPerPage (`{ results, totalCount, links }`). */
		paged: z.literal(true).optional(),
		input: OpenApiSchemaDocument,
		output: OpenApiSchemaDocument.optional(),
	})
	.strict();

export const MongoDBAtlasManifestSchema = z
	.object({
		source: z.string().url(),
		version: z.string(),
		fetched: z.string(),
		operations: z.array(OperationSchema),
		definitions: z.record(z.string(), OpenApiSchemaDocument),
	})
	.strict();

export type MongoDBAtlasOperationDefinition = z.infer<typeof OperationSchema>;
export type MongoDBAtlasOpenApiSchema = z.infer<typeof OpenApiSchemaDocument>;
type MongoDBAtlasManifest = z.infer<typeof MongoDBAtlasManifestSchema>;

// Typed by MongoDBAtlasManifestSchema; schema.test.ts parses the file with it.
export const mongodbatlasManifest =
	// `unknown` is necessary because a JSON import's inferred type is too wide to assign directly; schema.test.ts parses the file with MongoDBAtlasManifestSchema.
	mongodbatlasManifestJson as unknown as MongoDBAtlasManifest;

export const mongodbatlasOperations: readonly MongoDBAtlasOperationDefinition[] =
	mongodbatlasManifest.operations;

export const mongodbatlasDefinitions: Record<
	string,
	MongoDBAtlasOpenApiSchema
> = mongodbatlasManifest.definitions;
