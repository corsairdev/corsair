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
