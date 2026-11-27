import { z } from 'zod';
import crawl4aiManifestJson from '../crawl4ai-manifest.json';

/**
 * crawl4ai-manifest.json holds every operation with a flat input schema
 * (path, query, header and body fields in one object, each parameter marked
 * with `x-corsair-in`), the request and response kind and the response
 * schema. `server.*` operations come from the OpenAPI the self-hosted server
 * serves (/openapi.json); `cloud.*` from Crawl4AI Cloud's API reference
 * (crawl4ai.com/llms.txt). Each operation's `id` is its Corsair name
 * (`cloud.tools.run`).
 *
 * The manifest is not run through zod at import: that would copy the JSON into
 * a second object graph on every load. `Crawl4aiManifestSchema` checks the
 * file in schema.test.ts instead.
 */

// `unknown` is necessary because route schemas contain provider-defined JSON Schema keywords.
const OpenApiSchemaDocument = z.record(z.string(), z.unknown());

const OperationSchema = z
	.object({
		id: z.string().regex(/^[a-z][A-Za-z0-9]*(\.[a-z][A-Za-z0-9]*)+$/),
		method: z.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']),
		path: z.string().regex(/^\/[A-Za-z0-9_/{}.-]*$/),
		/** `server`: the self-hosted server at the account's server_url. `cloud`: api.crawl4ai.com. */
		host: z.enum(['server', 'cloud']),
		tag: z.string(),
		/** `json`: a JSON object body. `none`: no body. */
		request: z.enum(['json', 'none']),
		/**
		 * `json`; `ndjson`: one JSON value per line, returned as `{ items }`;
		 * `text`: returned as `{ text }`; `file`: the bytes as a Files output;
		 * `base64:<field>:<content type>`: a JSON body whose field holds the
		 * file as base64 (a screenshot, a PDF), returned as a Files output.
		 */
		response: z.union([
			z.enum(['json', 'ndjson', 'text', 'file']),
			z.string().regex(/^base64:[a-z_]+:[a-z]+\/[a-z+.-]+$/),
		]),
		input: OpenApiSchemaDocument,
		output: OpenApiSchemaDocument.optional(),
	})
	.strict();

const WebhookSchema = z
	.object({
		id: z.string().regex(/^[a-z][A-Za-z0-9]*$/),
		summary: z.string(),
		/** The task types this webhook handles (`crawl`, `llm`). */
		eventTypes: z.array(z.string()).min(1),
		payload: OpenApiSchemaDocument,
	})
	.strict();

export const Crawl4aiManifestSchema = z
	.object({
		source: z.string().url(),
		/** The Crawl4AI version the index came from. */
		version: z.string(),
		fetched: z.string(),
		operations: z.array(OperationSchema),
		webhooks: z.array(WebhookSchema),
		definitions: z.record(z.string(), OpenApiSchemaDocument),
	})
	.strict();

export type Crawl4aiOperationDefinition = z.infer<typeof OperationSchema>;
export type Crawl4aiWebhookDefinition = z.infer<typeof WebhookSchema>;
export type Crawl4aiOpenApiSchema = z.infer<typeof OpenApiSchemaDocument>;
type Crawl4aiManifest = z.infer<typeof Crawl4aiManifestSchema>;

// Typed by Crawl4aiManifestSchema; schema.test.ts parses the file with it.
export const crawl4aiManifest =
	// `unknown` is necessary because a JSON import's inferred type is too wide to assign directly; schema.test.ts parses the file with Crawl4aiManifestSchema.
	crawl4aiManifestJson as unknown as Crawl4aiManifest;

export const crawl4aiOperations: readonly Crawl4aiOperationDefinition[] =
	crawl4aiManifest.operations;

export const crawl4aiWebhookDefinitions: readonly Crawl4aiWebhookDefinition[] =
	crawl4aiManifest.webhooks;

export const crawl4aiDefinitions: Record<string, Crawl4aiOpenApiSchema> =
	crawl4aiManifest.definitions;
