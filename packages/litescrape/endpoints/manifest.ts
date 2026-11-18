import { z } from 'zod';
import litescrapeManifestJson from '../litescrape-manifest.json';

/**
 * litescrape-manifest.json is Litescrape's published OpenAPI spec
 * (https://api.litescrape.com/api/openapi.json) cut down to what this plugin
 * uses: one entry per data operation with its request body schema inlined and
 * its response pointing into `definitions` (identical response models merged).
 * Each operation's `id` is its Corsair name (`amazon.search`).
 *
 * The manifest is not run through zod at import: that would copy ~1.3 MB of
 * JSON into a second object graph on every load. `LitescrapeManifestSchema`
 * checks the file in schema.test.ts instead.
 */

// `unknown` is necessary because OpenAPI schemas contain provider-defined JSON Schema keywords.
const OpenApiSchemaDocument = z.record(z.string(), z.unknown());

const OperationSchema = z
	.object({
		id: z.string().regex(/^[a-z][A-Za-z0-9]*\.[a-z][A-Za-z0-9]*$/),
		method: z.literal('POST'),
		path: z.string().regex(/^\/api\/[a-z0-9/-]+$/),
		tag: z.string(),
		summary: z.string(),
		description: z.string(),
		alpha: z.boolean(),
		input: OpenApiSchemaDocument,
		output: z.object({ $ref: z.string() }).strict(),
	})
	.strict();

export const LitescrapeManifestSchema = z
	.object({
		source: z.string().url(),
		operations: z.array(OperationSchema),
		definitions: z.record(z.string(), OpenApiSchemaDocument),
	})
	.strict();

export type LitescrapeOperationDefinition = z.infer<typeof OperationSchema>;
export type LitescrapeOpenApiSchema = z.infer<typeof OpenApiSchemaDocument>;
type LitescrapeManifest = z.infer<typeof LitescrapeManifestSchema>;

// Typed by LitescrapeManifestSchema; schema.test.ts parses the file with it.
export const litescrapeManifest =
	// `unknown` is necessary because a JSON import's inferred type is too wide to assign directly; schema.test.ts parses the file with LitescrapeManifestSchema.
	litescrapeManifestJson as unknown as LitescrapeManifest;

export const litescrapeOperations: readonly LitescrapeOperationDefinition[] =
	litescrapeManifest.operations;

export const litescrapeDefinitions: Record<string, LitescrapeOpenApiSchema> =
	litescrapeManifest.definitions;
