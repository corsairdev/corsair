import { z } from 'zod';
import giteaManifestJson from '../gitea-manifest.json';

/**
 * gitea-manifest.json is Gitea's swagger (served by every instance at
 * /swagger.v1.json; this one from the gitea/gitea Docker image, API version in
 * `version`) cut down to what this plugin uses: one entry per operation with
 * a flat input schema (path, query and body fields in one object, each path
 * and query property marked with `x-corsair-in`), the request and response
 * kind and the response schema, plus the definitions they reference in
 * `definitions`. Each operation's `id` is its Corsair name
 * (`pulls.reviews.create`).
 *
 * The manifest is not run through zod at import: that would copy the JSON into
 * a second object graph on every load. `GiteaManifestSchema` checks the file
 * in schema.test.ts instead.
 */

// `unknown` is necessary because OpenAPI schemas contain provider-defined JSON Schema keywords.
const OpenApiSchemaDocument = z.record(z.string(), z.unknown());

const OperationSchema = z
	.object({
		id: z.string().regex(/^[a-z][A-Za-z0-9]*(\.[a-z][A-Za-z0-9]*)+$/),
		method: z.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']),
		// `/repos/{owner}/{repo}/pulls/{index}.{diffType}`, hence the dot.
		path: z.string().regex(/^\/[A-Za-z0-9_/{}.-]+$/),
		tag: z.string(),
		summary: z.string(),
		/**
		 * `json`: a JSON body. `multipart`: a form with a file field
		 * (`attachment`). `text`: the `text` input is the raw body
		 * (POST /markdown/raw). `none`: no body.
		 */
		request: z.enum(['json', 'multipart', 'text', 'none']),
		/**
		 * `file`: bytes returned as a Files output (an archive, a raw file, logs).
		 * `text`: a text, HTML or diff body returned as `{ text }`.
		 * `empty`: a 2xx with no body.
		 */
		response: z.enum(['json', 'file', 'text', 'empty']),
		/** A JSON route that may also answer 204 (or 201) with no body. */
		emptyOk: z.literal(true).optional(),
		/**
		 * A list Gitea pages with `page` / `limit` (the next page is in a Link
		 * header): returned as `{ items, next_page }`.
		 */
		paginated: z.literal(true).optional(),
		/** A paged list without `limit`: Gitea sizes its pages itself. */
		unsizedPages: z.literal(true).optional(),
		/** Body fields Gitea sets itself (readOnly): dropped before sending. */
		serverSetFields: z.array(z.string()).optional(),
		/** A route Gitea is slow to answer: its own request timeout. */
		timeoutMs: z.number().int().positive().optional(),
		input: OpenApiSchemaDocument,
		output: OpenApiSchemaDocument.optional(),
	})
	.strict();

const WebhookSchema = z
	.object({
		id: z.string().regex(/^[a-z][A-Za-z0-9]*$/),
		summary: z.string(),
		/** The X-Gitea-Event-Type values this webhook handles. */
		eventTypes: z.array(z.string()).min(1),
		payload: OpenApiSchemaDocument,
	})
	.strict();

export const GiteaManifestSchema = z
	.object({
		source: z.string().url(),
		/** The Gitea API version the swagger came from (`info.version`). */
		version: z.string(),
		fetched: z.string(),
		operations: z.array(OperationSchema),
		webhooks: z.array(WebhookSchema),
		definitions: z.record(z.string(), OpenApiSchemaDocument),
	})
	.strict();

export type GiteaOperationDefinition = z.infer<typeof OperationSchema>;
export type GiteaWebhookDefinition = z.infer<typeof WebhookSchema>;
export type GiteaOpenApiSchema = z.infer<typeof OpenApiSchemaDocument>;
type GiteaManifest = z.infer<typeof GiteaManifestSchema>;

// Typed by GiteaManifestSchema; schema.test.ts parses the file with it.
export const giteaManifest =
	// `unknown` is necessary because a JSON import's inferred type is too wide to assign directly; schema.test.ts parses the file with GiteaManifestSchema.
	giteaManifestJson as unknown as GiteaManifest;

export const giteaOperations: readonly GiteaOperationDefinition[] =
	giteaManifest.operations;

export const giteaWebhookDefinitions: readonly GiteaWebhookDefinition[] =
	giteaManifest.webhooks;

export const giteaDefinitions: Record<string, GiteaOpenApiSchema> =
	giteaManifest.definitions;
