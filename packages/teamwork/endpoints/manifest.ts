import { z } from 'zod';
import teamworkOpenApiV1 from '../openapi-manifest-v1.json';
import teamworkOpenApiV2 from '../openapi-manifest-v2.json';
import teamworkOpenApiV3 from '../openapi-manifest-v3.json';

/**
 * The manifests are Teamwork's published V1, V2 and V3 OpenAPI specs, cut down
 * to the operations this plugin exposes and the definitions they reference.
 * Each operation's `id` is its Corsair name (`tasks.list`). They are plain JSON
 * so they can be read and edited by hand; nothing generates them.
 *
 * The manifest is not run through zod at import: that copied ~2 MB of JSON
 * into a second object graph on every load. `TeamworkManifestSchema` checks
 * the files in schema.test.ts instead.
 */

// `unknown` is necessary because OpenAPI schemas contain provider-defined JSON Schema keywords.
const OpenApiSchemaDocument = z.record(z.string(), z.unknown());

const OperationParameterSchema = z.object({
	name: z.string(),
	in: z.enum(['path', 'query']),
	type: z.string().optional(),
	format: z.string().optional(),
	// `unknown` is necessary because OpenAPI enum members may be strings, numbers, or booleans.
	enum: z.array(z.unknown()).optional(),
	items: OpenApiSchemaDocument.optional(),
	required: z.boolean(),
	// `unknown` is necessary because a documented query default may be any JSON scalar.
	default: z.unknown().optional(),
	collectionFormat: z.string().optional(),
	minimum: z.number().optional(),
	maximum: z.number().optional(),
	minLength: z.number().optional(),
	maxLength: z.number().optional(),
});

const OperationSchema = z.object({
	id: z.string().regex(/^[a-z][A-Za-z]+\.[a-z][A-Za-z]+$/),
	version: z.enum(['v1', 'v2', 'v3']),
	method: z.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']),
	path: z.string(),
	summary: z.string(),
	tag: z.string(),
	parameters: z.array(OperationParameterSchema),
	// `unknown` is necessary because request bodies may be objects or arrays before schema validation.
	body: z.unknown().optional(),
	bodyRequired: z.boolean(),
	response: OpenApiSchemaDocument.nullable(),
	responseCode: z.string(),
});

export const TeamworkManifestFileSchema = z
	.object({
		operations: z.array(OperationSchema),
		// `unknown` is necessary because OpenAPI definitions contain arbitrary JSON Schema keywords.
		definitions: z.record(z.string(), OpenApiSchemaDocument),
	})
	.strict();

export type TeamworkOperationDefinition = z.infer<typeof OperationSchema>;
export type TeamworkOpenApiSchema = z.infer<typeof OpenApiSchemaDocument>;
type TeamworkManifestFile = z.infer<typeof TeamworkManifestFileSchema>;

// The JSON files are typed by TeamworkManifestFileSchema; schema.test.ts parses each one with it.
const manifests = {
	v1: teamworkOpenApiV1 as unknown as TeamworkManifestFile,
	v2: teamworkOpenApiV2 as unknown as TeamworkManifestFile,
	v3: teamworkOpenApiV3 as unknown as TeamworkManifestFile,
};

export const teamworkManifestFiles = manifests;

export const teamworkOperations: readonly TeamworkOperationDefinition[] = [
	...manifests.v1.operations,
	...manifests.v2.operations,
	...manifests.v3.operations,
];

export const teamworkDefinitions: Record<
	TeamworkOperationDefinition['version'],
	Record<string, TeamworkOpenApiSchema>
> = {
	v1: manifests.v1.definitions,
	v2: manifests.v2.definitions,
	v3: manifests.v3.definitions,
};
