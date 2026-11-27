import { z } from 'zod';
import woocommerceManifestJson from '../woocommerce-manifest.json';

/**
 * woocommerce-manifest.json is the site's own REST index
 * (`GET /wp-json/?context=help` on a fresh WordPress with WooCommerce, version in `version`)
 * cut down to what this plugin uses: one entry per operation with a flat input
 * schema (path, query and body fields in one object, each path and query
 * property marked with `x-corsair-in`), the request kind and the response
 * schema, plus the route item schemas they reference in `definitions`. Each
 * operation's `id` is its Corsair name (`orders.refunds.create`).
 *
 * The manifest is not run through zod at import: that would copy the JSON into
 * a second object graph on every load. `WoocommerceManifestSchema` checks the
 * file in schema.test.ts instead.
 */

// `unknown` is necessary because route schemas contain provider-defined JSON Schema keywords.
const OpenApiSchemaDocument = z.record(z.string(), z.unknown());

const OperationSchema = z
	.object({
		id: z.string().regex(/^[a-z][A-Za-z0-9]*(\.[a-z][A-Za-z0-9]*)+$/),
		method: z.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']),
		path: z.string().regex(/^\/[A-Za-z0-9_/{}.-]*$/),
		/** The REST namespace the route belongs to (`wc/v3`). */
		tag: z.string(),
		/** `json`: a JSON body. `none`: no body. */
		request: z.enum(['json', 'none']),
		response: z.literal('json'),
		/** The route's item schema in `definitions`. */
		item: z.string().optional(),
		/**
		 * A list WooCommerce pages with `page` / `per_page`: returned as
		 * `{ items, next_page }`.
		 */
		paginated: z.literal(true).optional(),
		/** The route's default `per_page`. */
		pageSize: z.number().int().positive().optional(),
		input: OpenApiSchemaDocument,
		output: OpenApiSchemaDocument.optional(),
	})
	.strict();

const WebhookSchema = z
	.object({
		id: z.string().regex(/^[a-z][A-Za-z0-9]*$/),
		summary: z.string(),
		/** The X-WC-Webhook-Topic values this webhook handles (`action` covers every action.<hook>). */
		eventTypes: z.array(z.string()).min(1),
		payload: OpenApiSchemaDocument,
	})
	.strict();

export const WoocommerceManifestSchema = z
	.object({
		source: z.string().url(),
		/** The WooCommerce version the index came from. */
		version: z.string(),
		fetched: z.string(),
		operations: z.array(OperationSchema),
		webhooks: z.array(WebhookSchema),
		definitions: z.record(z.string(), OpenApiSchemaDocument),
	})
	.strict();

export type WoocommerceOperationDefinition = z.infer<typeof OperationSchema>;
export type WoocommerceWebhookDefinition = z.infer<typeof WebhookSchema>;
export type WoocommerceOpenApiSchema = z.infer<typeof OpenApiSchemaDocument>;
type WoocommerceManifest = z.infer<typeof WoocommerceManifestSchema>;

// Typed by WoocommerceManifestSchema; schema.test.ts parses the file with it.
export const woocommerceManifest =
	// `unknown` is necessary because a JSON import's inferred type is too wide to assign directly; schema.test.ts parses the file with WoocommerceManifestSchema.
	woocommerceManifestJson as unknown as WoocommerceManifest;

export const woocommerceOperations: readonly WoocommerceOperationDefinition[] =
	woocommerceManifest.operations;

export const woocommerceWebhookDefinitions: readonly WoocommerceWebhookDefinition[] =
	woocommerceManifest.webhooks;

export const woocommerceDefinitions: Record<string, WoocommerceOpenApiSchema> =
	woocommerceManifest.definitions;
