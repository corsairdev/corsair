import { z } from 'zod';
import railwayManifestJson from '../railway-manifest.json';

/**
 * railway-manifest.json is Railway's public GraphQL schema
 * (https://backboard.railway.com/graphql/v2, read by introspection) cut down
 * to what this plugin sends: one entry per root query or mutation field with
 * its GraphQL document (every argument a variable, a default selection of the
 * return type's fields), the arguments as JSON Schema and the selected fields
 * as JSON Schema, plus the input, enum and output definitions they reference.
 * Each operation's `id` is its Corsair name (`serviceInstances.deploy`).
 *
 * The manifest is not run through zod at import: that would copy the JSON into
 * a second object graph on every load. `RailwayManifestSchema` checks the file
 * in schema.test.ts instead.
 */

// `unknown` is necessary because JSON Schema documents carry arbitrary keywords.
const SchemaDocument = z.record(z.string(), z.unknown());

const OperationSchema = z
	.object({
		id: z.string().regex(/^[a-z][A-Za-z0-9]*(\.[a-z][A-Za-z0-9]*)+$/),
		kind: z.enum(['query', 'mutation']),
		/** The root field the document calls (`serviceInstanceDeploy`). */
		field: z.string().regex(/^[a-zA-Z][A-Za-z0-9]*$/),
		/** Railway's description of the field (often empty). */
		summary: z.string(),
		/** The GraphQL request sent as `query`. */
		document: z.string(),
		/** A Relay connection: returned as `{ items, pageInfo }`. */
		connection: z.literal(true).optional(),
		input: SchemaDocument,
		output: SchemaDocument,
	})
	.strict();

export const RailwayManifestSchema = z
	.object({
		source: z.string().url(),
		/** The API version in the endpoint path. */
		version: z.string(),
		fetched: z.string(),
		operations: z.array(OperationSchema),
		definitions: z.record(z.string(), SchemaDocument),
	})
	.strict();

export type RailwayOperationDefinition = z.infer<typeof OperationSchema>;
export type RailwayOpenApiSchema = z.infer<typeof SchemaDocument>;
type RailwayManifest = z.infer<typeof RailwayManifestSchema>;

// Typed by RailwayManifestSchema; schema.test.ts parses the file with it.
export const railwayManifest =
	// `unknown` is necessary because a JSON import's inferred type is too wide to assign directly; schema.test.ts parses the file with RailwayManifestSchema.
	railwayManifestJson as unknown as RailwayManifest;

export const railwayOperations: readonly RailwayOperationDefinition[] =
	railwayManifest.operations;

export const railwayDefinitions: Record<string, RailwayOpenApiSchema> =
	railwayManifest.definitions;
