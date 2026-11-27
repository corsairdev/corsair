import { z } from 'zod';
import paypalManifestJson from '../paypal-manifest.json';

/**
 * paypal-manifest.json is PayPal's 13 OpenAPI specs
 * (github.com/paypal/paypal-rest-api-specifications, commit in `version`) cut
 * down to what this plugin uses: one entry per operation with a flat input
 * schema (path, query, header and body fields in one object, each parameter
 * marked with `x-corsair-in`), the request and response kind and the response
 * schema, plus the schemas they reference in `definitions` (named
 * `<api>.<schema>`, `checkout.order`). Each operation's `id` is its Corsair
 * name (`payments.captures.refund`).
 *
 * The manifest is not run through zod at import: that would copy the JSON into
 * a second object graph on every load. `PaypalManifestSchema` checks the
 * file in schema.test.ts instead.
 */

// `unknown` is necessary because route schemas contain provider-defined JSON Schema keywords.
const OpenApiSchemaDocument = z.record(z.string(), z.unknown());

const OperationSchema = z
	.object({
		id: z.string().regex(/^[a-z][A-Za-z0-9]*(\.[a-z][A-Za-z0-9]*)+$/),
		method: z.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']),
		path: z.string().regex(/^\/[A-Za-z0-9_/{}.-]*$/),
		/** The PayPal API the operation belongs to (`checkout`, `invoicing`). */
		tag: z.string(),
		/**
		 * `json`: a JSON object body. `json-array`: the `patch` input is the
		 * body (JSON Patch). `multipart`: a form (dispute evidence and files).
		 * `none`: no body.
		 */
		request: z.enum(['json', 'json-array', 'multipart', 'none']),
		/** `empty`: 204 with no body. `file`: an image returned as a Files output. */
		response: z.enum(['json', 'empty', 'file']),
		/** A JSON route that may also answer 204 with no body. */
		emptyOk: z.literal(true).optional(),
		input: OpenApiSchemaDocument,
		output: OpenApiSchemaDocument.optional(),
	})
	.strict();

const WebhookSchema = z
	.object({
		id: z.string().regex(/^[a-z][A-Za-z0-9]*$/),
		summary: z.string(),
		/** The event_type prefixes this webhook handles (`PAYMENT.CAPTURE.*`; `*` for the catch-all). */
		eventTypes: z.array(z.string()).min(1),
		payload: OpenApiSchemaDocument,
	})
	.strict();

export const PaypalManifestSchema = z
	.object({
		source: z.string().url(),
		/** The PayPal version the index came from. */
		version: z.string(),
		fetched: z.string(),
		operations: z.array(OperationSchema),
		webhooks: z.array(WebhookSchema),
		definitions: z.record(z.string(), OpenApiSchemaDocument),
	})
	.strict();

export type PaypalOperationDefinition = z.infer<typeof OperationSchema>;
export type PaypalWebhookDefinition = z.infer<typeof WebhookSchema>;
export type PaypalOpenApiSchema = z.infer<typeof OpenApiSchemaDocument>;
type PaypalManifest = z.infer<typeof PaypalManifestSchema>;

// Typed by PaypalManifestSchema; schema.test.ts parses the file with it.
export const paypalManifest =
	// `unknown` is necessary because a JSON import's inferred type is too wide to assign directly; schema.test.ts parses the file with PaypalManifestSchema.
	paypalManifestJson as unknown as PaypalManifest;

export const paypalOperations: readonly PaypalOperationDefinition[] =
	paypalManifest.operations;

export const paypalWebhookDefinitions: readonly PaypalWebhookDefinition[] =
	paypalManifest.webhooks;

export const paypalDefinitions: Record<string, PaypalOpenApiSchema> =
	paypalManifest.definitions;
