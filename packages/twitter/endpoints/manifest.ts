import { z } from 'zod';
import twitterManifestJson from '../twitter-manifest.json';

/**
 * twitter-manifest.json is X's published OpenAPI spec
 * (https://api.x.com/2/openapi.json) cut down to what this plugin uses: one
 * entry per operation with a flat input schema (path, query and body fields in
 * one object, each parameter marked with `x-corsair-in`), the request and
 * response kind, the auth X accepts, the OAuth scopes and the response schema,
 * plus the component schemas they reference in `definitions`. Each
 * operation's `id` is its Corsair name (`posts.search.recent`).
 *
 * The manifest is not run through zod at import: that would copy the JSON into
 * a second object graph on every load. `TwitterManifestSchema` checks the file
 * in schema.test.ts instead.
 */

// `unknown` is necessary because OpenAPI schemas contain provider-defined JSON Schema keywords.
const OpenApiSchemaDocument = z.record(z.string(), z.unknown());

const OperationSchema = z
	.object({
		id: z.string().regex(/^[a-z][A-Za-z0-9]*(\.[a-z][A-Za-z0-9]*)+$/),
		method: z.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']),
		path: z.string().regex(/^\/2\/[A-Za-z0-9_/{}.-]+$/),
		tag: z.string(),
		summary: z.string(),
		/**
		 * `json`: a JSON body (media bytes go in it as base64). `binary`: one
		 * `file` field sent as the raw body. `none`: no body.
		 */
		request: z.enum(['json', 'binary', 'none']),
		/** `file`: bytes returned as a Files output. `empty`: a 2xx with no body. */
		response: z.enum(['json', 'file', 'empty']),
		/**
		 * `user`: an OAuth 2.0 user token. `app`: only the app's Bearer token.
		 * `any`: either.
		 */
		auth: z.enum(['user', 'app', 'any']),
		/** OAuth 2.0 scopes X asks for on this route. */
		scopes: z.array(z.string()).optional(),
		input: OpenApiSchemaDocument,
		output: OpenApiSchemaDocument.optional(),
	})
	.strict();

export const TwitterManifestSchema = z
	.object({
		source: z.string().url(),
		fetched: z.string(),
		/** Routes left out of the plugin, with the reason. */
		skipped: z.record(z.string(), z.string()),
		operations: z.array(OperationSchema),
		definitions: z.record(z.string(), OpenApiSchemaDocument),
	})
	.strict();

export type TwitterOperationDefinition = z.infer<typeof OperationSchema>;
export type TwitterOpenApiSchema = z.infer<typeof OpenApiSchemaDocument>;
type TwitterManifest = z.infer<typeof TwitterManifestSchema>;

// Typed by TwitterManifestSchema; schema.test.ts parses the file with it.
export const twitterManifest =
	// `unknown` is necessary because a JSON import's inferred type is too wide to assign directly; schema.test.ts parses the file with TwitterManifestSchema.
	twitterManifestJson as unknown as TwitterManifest;

export const twitterOperations: readonly TwitterOperationDefinition[] =
	twitterManifest.operations;

export const twitterDefinitions: Record<string, TwitterOpenApiSchema> =
	twitterManifest.definitions;
