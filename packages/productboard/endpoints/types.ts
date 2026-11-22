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

export type ProductboardRequestBody = z.infer<
	typeof ProductboardRequestBodySchema
>;

export const ProductboardEmptyRequestBodySchema = z.object({}).strict();

export const ProductboardTeamSearchBodySchema = z
	.union([ProductboardRequestBodySchema, ProductboardEmptyRequestBodySchema])
	.superRefine((body, context) => {
		if (!('data' in body)) return;
		for (const field of ['filter', 'search']) {
			const value = body.data[field];
			if (
				value !== undefined &&
				(value === null || typeof value !== 'object' || Array.isArray(value))
			) {
				context.addIssue({
					code: 'custom',
					path: ['data', field],
					message: 'Search filters must be JSON objects',
				});
			}
		}
	});

export const ProductboardConnectionSearchBodySchema = z
	.union([ProductboardRequestBodySchema, ProductboardEmptyRequestBodySchema])
	.superRefine((body, context) => {
		if (!('data' in body)) return;
		const filter = body.data.filter;
		if (
			filter !== undefined &&
			(filter === null || typeof filter !== 'object' || Array.isArray(filter))
		) {
			context.addIssue({
				code: 'custom',
				path: ['data', 'filter'],
				message: 'Connection filters must be a JSON object',
			});
		}
	});

const ProductboardNoteFieldsSchema = z
	.object({ name: z.string().min(1) })
	.catchall(ProductboardJsonSchema);

const ProductboardNoteCustomerTargetSchema = z.union([
	z
		.object({
			id: z.string().uuid(),
			type: z.enum(['user', 'company']),
		})
		.strict(),
	z
		.object({
			email: z.string().email(),
			type: z.literal('user'),
		})
		.strict(),
]);

const ProductboardNoteRelationshipSchema = z.discriminatedUnion('type', [
	z
		.object({
			type: z.literal('customer'),
			target: ProductboardNoteCustomerTargetSchema,
		})
		.strict(),
	z
		.object({
			type: z.literal('link'),
			target: z
				.object({ id: z.string().uuid(), type: z.literal('link') })
				.strict(),
		})
		.strict(),
]);

export const ProductboardNoteCreateBodySchema = z
	.object({
		data: z
			.object({
				type: z.string().min(1),
				fields: ProductboardNoteFieldsSchema,
				metadata: ProductboardJsonObjectSchema.optional(),
				relationships: z.array(ProductboardNoteRelationshipSchema).optional(),
			})
			.strict(),
	})
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

// Webhook responses stay open (event types, formats and fields Productboard adds); the
// create body above keeps the strict spec. `notification` keeps stripping unknown keys so
// a stored authorization header is never returned to the caller.
const ProductboardWebhookReferenceSchema = z
	.object({
		id: z.string(),
		type: z.string(),
		links: z.object({ self: z.string() }).catchall(ProductboardJsonSchema),
	})
	.catchall(ProductboardJsonSchema);

const ProductboardWebhookSubscriptionSchema = z
	.object({
		id: z.string(),
		type: z.string(),
		createdAt: z.string().optional(),
		fields: z
			.object({
				name: z.string(),
				events: z.array(
					z.object({ eventType: z.string() }).catchall(ProductboardJsonSchema),
				),
				notification: z.object({ url: z.string(), version: z.number() }),
			})
			.catchall(ProductboardJsonSchema),
		links: z.object({ self: z.string() }).catchall(ProductboardJsonSchema),
	})
	.catchall(ProductboardJsonSchema);

export const ProductboardWebhookCreateOutputSchema = z.object({
	data: ProductboardWebhookReferenceSchema,
});

export const ProductboardWebhookGetOutputSchema = z.object({
	data: ProductboardWebhookSubscriptionSchema,
});

export const ProductboardWebhookListOutputSchema = z.object({
	data: z.array(ProductboardWebhookSubscriptionSchema),
	links: z
		.object({ next: z.string().nullable().optional() })
		.catchall(ProductboardJsonSchema)
		.optional(),
});

export const ProductboardWebhookDeleteOutputSchema = z.null();

const ProductboardResourceDataSchema = ProductboardJsonObjectSchema.refine(
	(data) => Object.keys(data).length > 0,
	{ message: 'Productboard resource response data must not be empty' },
);

export const ProductboardResourceOutputSchema = z
	.object({ data: ProductboardResourceDataSchema })
	.catchall(ProductboardJsonSchema);

export const ProductboardListOutputSchema = z
	.object({
		data: z.array(ProductboardJsonObjectSchema),
		links: ProductboardJsonObjectSchema.optional(),
	})
	.catchall(ProductboardJsonSchema);

// Response fields stay plain strings (no uuid, url, datetime or length checks) so a
// format Productboard varies doesn't fail the read; requests keep the strict spec.
const ProductboardTeamResourceSchema = z
	.object({
		id: z.string(),
		type: z.string(),
		fields: z
			.object({
				name: z.string(),
				handle: z.string(),
			})
			.catchall(ProductboardJsonSchema),
		createdAt: z.string(),
		updatedAt: z.string(),
		links: z.object({ self: z.string() }).catchall(ProductboardJsonSchema),
	})
	.catchall(ProductboardJsonSchema);

export const ProductboardTeamsListOutputSchema = z
	.object({
		data: z.array(ProductboardTeamResourceSchema),
		links: ProductboardJsonObjectSchema.optional(),
	})
	.catchall(ProductboardJsonSchema);

export const ProductboardNoContentOutputSchema = z.null();

export const ProductboardEnvelopeSchema = z
	.object({
		data: ProductboardJsonSchema,
		links: ProductboardJsonObjectSchema.optional(),
	})
	.passthrough();

export const ProductboardOutputSchema = ProductboardEnvelopeSchema;

export type ProductboardJson = z.infer<typeof ProductboardJsonSchema>;
export type ProductboardJsonObject = z.infer<
	typeof ProductboardJsonObjectSchema
>;
export type ProductboardOutput = z.infer<
	typeof ProductboardOutputSchema
> | null;

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
		body: z
			.union([
				ProductboardRequestBodySchema,
				ProductboardEmptyRequestBodySchema,
			])
			.optional(),
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
