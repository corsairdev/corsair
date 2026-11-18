import { z } from 'zod';

// Productboard's entity and note fields are workspace-configurable. The API
// documents arbitrary JSON values for those field maps, so JSON (rather than
// a guessed closed set of custom-field names) is the narrowest safe input.
export const ProductboardJsonSchema = z.json();
export const ProductboardJsonObjectSchema = z.record(
	z.string(),
	ProductboardJsonSchema,
);

// Every documented JSON request body uses the Public API's { data: ... }
// envelope. Keep that envelope closed so callback/webhook payloads cannot be
// supplied as undocumented sibling properties; fields/search filters inside
// `data` remain JSON because Productboard documents workspace-defined fields.
export const ProductboardRequestBodySchema = z
	.object({ data: ProductboardJsonObjectSchema })
	.strict();

const ProductboardWebhookEventTypeSchema = z.enum([
	'feature.created',
	'feature.updated',
	'feature.deleted',
	'component.created',
	'component.updated',
	'product.created',
	'product.updated',
	'release.created',
	'release.updated',
	'release.deleted',
	'feature-release-assignment.updated',
	'hierarchy-entity.custom-field-value.updated',
	'note.created',
	'note.updated',
	'note.deleted',
	'insight.created',
	'insight.deleted',
	'key-result.created',
	'key-result.updated',
	'key-result.deleted',
	'objective.created',
	'objective.updated',
	'objective.deleted',
	'initiative.created',
	'initiative.updated',
	'initiative.deleted',
]);

const ProductboardWebhookEventsSchema = z
	.array(z.object({ eventType: ProductboardWebhookEventTypeSchema }).strict())
	.min(1)
	.refine(
		(events) =>
			new Set(events.map(({ eventType }) => eventType)).size === events.length,
		{ message: 'Webhook events must be unique.' },
	);

export const ProductboardWebhookCreateBodySchema = z
	.object({
		data: z
			.object({
				fields: z
					.object({
						name: z.string().min(1).max(255),
						events: ProductboardWebhookEventsSchema,
						notification: z
							.object({
								url: z
									.string()
									.url()
									.max(1024)
									.refine((url) => url.startsWith('https://'), {
										message: 'Webhook notification URLs must use HTTPS.',
									}),
								version: z.literal(1),
								headers: z
									.object({
										authorization: z.string().max(2048).optional(),
									})
									.strict()
									.optional(),
							})
							.strict(),
					})
					.strict(),
			})
			.strict(),
	})
	.strict();

const ProductboardWebhookReferenceSchema = z.object({
	id: z.string().uuid(),
	type: z.literal('webhook'),
	links: z.object({ self: z.string().url() }),
});

const ProductboardWebhookSubscriptionSchema = z.object({
	id: z.string().uuid(),
	type: z.literal('webhook'),
	createdAt: z.string().datetime(),
	fields: z.object({
		name: z.string().min(1).max(255),
		events: ProductboardWebhookEventsSchema,
		notification: z.object({
			url: z.string().url().max(1024),
			version: z.literal(1),
		}),
	}),
	links: z.object({ self: z.string().url() }),
});

export const ProductboardWebhookCreateOutputSchema = z.object({
	data: ProductboardWebhookReferenceSchema,
});

export const ProductboardWebhookGetOutputSchema = z.object({
	data: ProductboardWebhookSubscriptionSchema,
});

export const ProductboardWebhookListOutputSchema = z.object({
	data: z.array(ProductboardWebhookSubscriptionSchema),
	links: z.object({ next: z.string().nullable() }),
});

export const ProductboardWebhookDeleteOutputSchema = z.null();

export const ProductboardEnvelopeSchema = z
	.object({
		data: ProductboardJsonSchema,
		links: ProductboardJsonObjectSchema.optional(),
	})
	.passthrough();

export const ProductboardOutputSchema = z.union([
	ProductboardEnvelopeSchema,
	z.null(),
]);

export type ProductboardJson = z.infer<typeof ProductboardJsonSchema>;
export type ProductboardJsonObject = z.infer<
	typeof ProductboardJsonObjectSchema
>;
export type ProductboardOutput = z.infer<typeof ProductboardOutputSchema>;

export const ProductboardOperationInputSchema = z
	.object({
		id: z.string().min(1).optional(),
		type: z.string().min(1).optional(),
		targetId: z.string().min(1).optional(),
		targetType: z.string().min(1).optional(),
		fieldId: z.string().min(1).optional(),
		valueId: z.string().min(1).optional(),
		integrationId: z.string().min(1).optional(),
		entityId: z.string().min(1).optional(),
		webhookId: z.string().min(1).optional(),
		query: ProductboardJsonObjectSchema.optional(),
		body: ProductboardRequestBodySchema.optional(),
	})
	.strict();

export type ProductboardOperationInput = z.infer<
	typeof ProductboardOperationInputSchema
>;

export type ProductboardEndpointInputs = Record<
	string,
	ProductboardOperationInput
>;
export type ProductboardEndpointOutputs = Record<string, ProductboardOutput>;

// Aggregate schemas for the shared endpoint JSON types; individual input
// schemas add each operation's required path and body fields in operations.ts.
export const ProductboardEndpointInputSchemas =
	ProductboardOperationInputSchema;
export const ProductboardEndpointOutputSchemas = ProductboardOutputSchema;
