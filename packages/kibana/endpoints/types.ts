import { z } from 'zod';

export const SavedObjectsFindInputSchema = z.object({
	type: z.union([z.string(), z.array(z.string())]),
	search: z.string().optional(),
	page: z.number().optional(),
	per_page: z.number().optional(),
});
export type SavedObjectsFindInput = z.infer<typeof SavedObjectsFindInputSchema>;

export const SavedObjectsFindResponseSchema = z
	.object({
		total: z.number(),
		saved_objects: z.array(z.any()),
	})
	.passthrough();
export type SavedObjectsFindResponse = z.infer<
	typeof SavedObjectsFindResponseSchema
>;

export const SavedObjectsGetInputSchema = z.object({
	type: z.string(),
	id: z.string(),
});
export type SavedObjectsGetInput = z.infer<typeof SavedObjectsGetInputSchema>;

export const SavedObjectsGetResponseSchema = z
	.object({
		id: z.string(),
		type: z.string(),
		attributes: z.record(z.string(), z.any()),
	})
	.passthrough();
export type SavedObjectsGetResponse = z.infer<
	typeof SavedObjectsGetResponseSchema
>;

export type KibanaEndpointInputs = {
	savedObjectsFind: SavedObjectsFindInput;
	savedObjectsGet: SavedObjectsGetInput;
};

export type KibanaEndpointOutputs = {
	savedObjectsFind: SavedObjectsFindResponse;
	savedObjectsGet: SavedObjectsGetResponse;
};

export const KibanaEndpointInputSchemas = {
	savedObjectsFind: SavedObjectsFindInputSchema,
	savedObjectsGet: SavedObjectsGetInputSchema,
} as const;

export const KibanaEndpointOutputSchemas = {
	savedObjectsFind: SavedObjectsFindResponseSchema,
	savedObjectsGet: SavedObjectsGetResponseSchema,
} as const;
