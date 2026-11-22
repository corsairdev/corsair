import { z } from 'zod';
import tailscaleManifestJson from '../tailscale-manifest.json';

/**
 * tailscale-manifest.json is Tailscale's published OpenAPI spec
 * (https://api.tailscale.com/api/v2?outputOpenapiSchema=true) cut down to what
 * this plugin uses: one entry per operation with a flat input schema (path,
 * query, header and body fields in one object, each property marked with
 * `x-corsair-in`), the response kind, the response schema and the OAuth scopes
 * the route needs, plus the component schemas they reference in `definitions`.
 * Each operation's `id` is its Corsair name (`devices.list`), which follows
 * the resource groups of Tailscale's Go client.
 *
 * The manifest is not run through zod at import: that would copy the JSON into
 * a second object graph on every load. `TailscaleManifestSchema` checks the
 * file in schema.test.ts instead.
 */

// `unknown` is necessary because OpenAPI schemas contain provider-defined JSON Schema keywords.
const OpenApiSchemaDocument = z.record(z.string(), z.unknown());

const OperationSchema = z
	.object({
		id: z.string().regex(/^[a-z][A-Za-z0-9]*(\.[a-z][A-Za-z0-9]*)+$/),
		method: z.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']),
		path: z.string().regex(/^\/[A-Za-z0-9_/{}-]+$/),
		tag: z.string(),
		summary: z.string(),
		/** `json`: a JSON body (HuJSON text for a policy file). `none`: no body. */
		request: z.enum(['json', 'none']),
		/** `policy`: the policy file as text or JSON plus its ETag. `empty`: a 2xx with no body. */
		response: z.enum(['json', 'policy', 'empty']),
		/** The OAuth client scopes the route needs (from the spec's descriptions). */
		scopes: z.array(z.string()).optional(),
		/** Body fields Tailscale sets itself (readOnly): dropped before sending. */
		serverSetFields: z.array(z.string()).optional(),
		/** A 200 with no body means "nothing to report" and comes back as null. */
		emptyMeansNone: z.literal(true).optional(),
		input: OpenApiSchemaDocument,
		output: OpenApiSchemaDocument.optional(),
	})
	.strict();

export const TailscaleManifestSchema = z
	.object({
		source: z.string().url(),
		fetched: z.string(),
		operations: z.array(OperationSchema),
		definitions: z.record(z.string(), OpenApiSchemaDocument),
	})
	.strict();

export type TailscaleOperationDefinition = z.infer<typeof OperationSchema>;
export type TailscaleOpenApiSchema = z.infer<typeof OpenApiSchemaDocument>;
type TailscaleManifest = z.infer<typeof TailscaleManifestSchema>;

// Typed by TailscaleManifestSchema; schema.test.ts parses the file with it.
export const tailscaleManifest =
	// `unknown` is necessary because a JSON import's inferred type is too wide to assign directly; schema.test.ts parses the file with TailscaleManifestSchema.
	tailscaleManifestJson as unknown as TailscaleManifest;

export const tailscaleOperations: readonly TailscaleOperationDefinition[] =
	tailscaleManifest.operations;

export const tailscaleDefinitions: Record<string, TailscaleOpenApiSchema> =
	tailscaleManifest.definitions;
