import { z } from 'zod';
import netlifyManifestJson from '../netlify-manifest.json';

/**
 * netlify-manifest.json is Netlify's swagger (github.com/netlify/open-api,
 * swagger.yml; version in `version`) cut down to what this plugin uses: one
 * entry per operation with a flat input schema (path, query, header and body
 * fields in one object, each non-body property marked with `x-corsair-in`),
 * the request and response kind and the response schema, plus the
 * definitions they reference in `definitions`. Each operation's `id` is its
 * Corsair name (`sites.deploys.create`).
 *
 * The manifest is not run through zod at import: that would copy the JSON into
 * a second object graph on every load. `NetlifyManifestSchema` checks the file
 * in schema.test.ts instead.
 */

// `unknown` is necessary because OpenAPI schemas contain provider-defined JSON Schema keywords.
const OpenApiSchemaDocument = z.record(z.string(), z.unknown());

const OperationSchema = z
	.object({
		id: z.string().regex(/^[a-z][A-Za-z0-9]*(\.[a-z][A-Za-z0-9]*)+$/),
		method: z.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']),
		path: z.string().regex(/^\/[A-Za-z0-9_/{}.-]+$/),
		tag: z.string(),
		summary: z.string(),
		/**
		 * `json`: a JSON body. `multipart`: a form with a file field (`zip`
		 * on sites.builds.create). `binary`: the `file` input's bytes are the
		 * whole body (deploy uploads). `none`: no body.
		 */
		request: z.enum(['json', 'multipart', 'binary', 'none']),
		/**
		 * `text`: a plain-text body returned as `{ text }` (a diff).
		 * `empty`: a 2xx with no body.
		 */
		response: z.enum(['json', 'text', 'empty']),
		/** A JSON route that may also answer 204 (or 201) with no body. */
		emptyOk: z.literal(true).optional(),
		/**
		 * A list Netlify pages with `page` / `per_page` (the next page is in a
		 * Link header): returned as `{ items, next_page }`.
		 */
		paginated: z.literal(true).optional(),
		/** A paged list without `per_page`: Netlify sizes its pages itself. */
		unsizedPages: z.literal(true).optional(),
		/** Body fields Netlify sets itself (readOnly): dropped before sending. */
		serverSetFields: z.array(z.string()).optional(),
		/** A route Netlify is slow to answer: its own request timeout. */
		timeoutMs: z.number().int().positive().optional(),
		input: OpenApiSchemaDocument,
		output: OpenApiSchemaDocument.optional(),
	})
	.strict();

const WebhookSchema = z
	.object({
		id: z.string().regex(/^[a-z][A-Za-z0-9]*$/),
		summary: z.string(),
		/** The X-Netlify-Event values this webhook handles. */
		eventTypes: z.array(z.string()).min(1),
		payload: OpenApiSchemaDocument,
	})
	.strict();

export const NetlifyManifestSchema = z
	.object({
		source: z.string().url(),
		/** The swagger's version (`info.version`). */
		version: z.string(),
		fetched: z.string(),
		operations: z.array(OperationSchema),
		webhooks: z.array(WebhookSchema),
		definitions: z.record(z.string(), OpenApiSchemaDocument),
	})
	.strict();

export type NetlifyOperationDefinition = z.infer<typeof OperationSchema>;
export type NetlifyWebhookDefinition = z.infer<typeof WebhookSchema>;
export type NetlifyOpenApiSchema = z.infer<typeof OpenApiSchemaDocument>;
type NetlifyManifest = z.infer<typeof NetlifyManifestSchema>;

// Typed by NetlifyManifestSchema; schema.test.ts parses the file with it.
export const netlifyManifest =
	// `unknown` is necessary because a JSON import's inferred type is too wide to assign directly; schema.test.ts parses the file with NetlifyManifestSchema.
	netlifyManifestJson as unknown as NetlifyManifest;

export const netlifyOperations: readonly NetlifyOperationDefinition[] =
	netlifyManifest.operations;

export const netlifyWebhookDefinitions: readonly NetlifyWebhookDefinition[] =
	netlifyManifest.webhooks;

export const netlifyDefinitions: Record<string, NetlifyOpenApiSchema> =
	netlifyManifest.definitions;
