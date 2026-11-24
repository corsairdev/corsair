import { z } from 'zod';
import inkboxManifestJson from '../inkbox-manifest.json';

/**
 * inkbox-manifest.json is Inkbox's published OpenAPI spec
 * (https://inkbox.ai/api/openapi.json) cut down to what this plugin uses: one
 * entry per operation with a flat input schema (path, query, header and body
 * fields in one object, each property marked with `x-corsair-in`), the request
 * and response kind and the response schema, plus the component schemas they
 * reference in `definitions`. Each operation's `id` is its Corsair name
 * (`mail.messages.send`), which follows Inkbox's TypeScript SDK.
 *
 * The manifest is not run through zod at import: that would copy the JSON into
 * a second object graph on every load. `InkboxManifestSchema` checks the file
 * in schema.test.ts instead.
 */

// `unknown` is necessary because OpenAPI schemas contain provider-defined JSON Schema keywords.
const OpenApiSchemaDocument = z.record(z.string(), z.unknown());

const OperationSchema = z
	.object({
		id: z.string().regex(/^[a-z][A-Za-z0-9]*(\.[a-z][A-Za-z0-9]*)+$/),
		method: z.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']),
		// `/contacts/{contact_id}.vcf`, hence the dot.
		path: z.string().regex(/^\/[A-Za-z0-9_/{}.-]+$/),
		tag: z.string(),
		summary: z.string(),
		/**
		 * `json`: a JSON body. `multipart`: a form with a `file` field. `text`:
		 * one string field sent as the raw body (`bodyMediaType`). `none`: no body.
		 */
		request: z.enum(['json', 'multipart', 'text', 'none']),
		/** The Content-Type of a `text` body (`text/vcard; charset=utf-8`). */
		bodyMediaType: z.string().optional(),
		/** `file`: bytes returned as a Files output. `empty`: a 2xx with no body. */
		response: z.enum(['json', 'file', 'empty']),
		/** Body fields Inkbox sets itself (readOnly): dropped before sending. */
		serverSetFields: z.array(z.string()).optional(),
		/** Query values the plugin always sends (not caller inputs). */
		fixedQuery: z
			.record(z.string(), z.union([z.string(), z.number(), z.boolean()]))
			.optional(),
		input: OpenApiSchemaDocument,
		output: OpenApiSchemaDocument.optional(),
	})
	.strict();

const WebhookSchema = z
	.object({
		/** Corsair webhook name (`mail.messageEvent`). */
		id: z.string().regex(/^[a-z][A-Za-z0-9]*(\.[a-z][A-Za-z0-9]*)+$/),
		/** The spec's webhook key (`/mail-event`). */
		route: z.string(),
		summary: z.string(),
		description: z.string(),
		/** Every `event_type` this payload carries (`message.received`, …). */
		events: z.array(z.string()).min(1),
		payload: OpenApiSchemaDocument,
	})
	.strict();

export const InkboxManifestSchema = z
	.object({
		source: z.string().url(),
		fetched: z.string(),
		operations: z.array(OperationSchema),
		webhooks: z.array(WebhookSchema),
		definitions: z.record(z.string(), OpenApiSchemaDocument),
	})
	.strict();

export type InkboxOperationDefinition = z.infer<typeof OperationSchema>;
export type InkboxWebhookDefinition = z.infer<typeof WebhookSchema>;
export type InkboxOpenApiSchema = z.infer<typeof OpenApiSchemaDocument>;
type InkboxManifest = z.infer<typeof InkboxManifestSchema>;

// Typed by InkboxManifestSchema; schema.test.ts parses the file with it.
export const inkboxManifest =
	// `unknown` is necessary because a JSON import's inferred type is too wide to assign directly; schema.test.ts parses the file with InkboxManifestSchema.
	inkboxManifestJson as unknown as InkboxManifest;

export const inkboxOperations: readonly InkboxOperationDefinition[] =
	inkboxManifest.operations;

export const inkboxWebhookDefinitions: readonly InkboxWebhookDefinition[] =
	inkboxManifest.webhooks;

export const inkboxDefinitions: Record<string, InkboxOpenApiSchema> =
	inkboxManifest.definitions;
