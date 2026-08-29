import { z } from 'zod';

export const SavedObjectsFindInputSchema = z.object({
	type: z.union([z.string(), z.array(z.string())]),
	search: z.string().optional(),
	page: z.number().optional(),
	per_page: z.number().optional(),
	sort_field: z.string().optional(),
	has_reference: z
		.object({
			type: z.string(),
			id: z.string(),
		})
		.optional(),
});
export type SavedObjectsFindInput = z.infer<typeof SavedObjectsFindInputSchema>;

export const SavedObjectsFindResponseSchema = z
	.object({
		page: z.number().optional(),
		per_page: z.number().optional(),
		total: z.number(),
		saved_objects: z.array(
			z.object({
				id: z.string(),
				type: z.string(),
				attributes: z.record(z.string(), z.any()),
				references: z.array(z.record(z.string(), z.any())).optional(),
				updated_at: z.string().optional(),
				version: z.string().optional(),
			}),
		),
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
		references: z.array(z.record(z.string(), z.any())).optional(),
		updated_at: z.string().optional(),
		version: z.string().optional(),
	})
	.passthrough();
export type SavedObjectsGetResponse = z.infer<
	typeof SavedObjectsGetResponseSchema
>;

export const SavedObjectsCreateInputSchema = z.object({
	type: z.string(),
	id: z.string().optional(),
	attributes: z.record(z.string(), z.any()),
	references: z.array(z.record(z.string(), z.any())).optional(),
	overwrite: z.boolean().optional(),
});
export type SavedObjectsCreateInput = z.infer<
	typeof SavedObjectsCreateInputSchema
>;

export const SavedObjectsCreateResponseSchema = z
	.object({
		id: z.string(),
		type: z.string(),
		attributes: z.record(z.string(), z.any()),
		references: z.array(z.record(z.string(), z.any())).optional(),
		updated_at: z.string().optional(),
		version: z.string().optional(),
	})
	.passthrough();
export type SavedObjectsCreateResponse = z.infer<
	typeof SavedObjectsCreateResponseSchema
>;

export const SavedObjectsDeleteInputSchema = z.object({
	type: z.string(),
	id: z.string(),
});
export type SavedObjectsDeleteInput = z.infer<
	typeof SavedObjectsDeleteInputSchema
>;

export const SavedObjectsDeleteResponseSchema = z.record(z.string(), z.any());
export type SavedObjectsDeleteResponse = z.infer<
	typeof SavedObjectsDeleteResponseSchema
>;

export const DataViewsGetInputSchema = z.object({
	id: z.string(),
});
export type DataViewsGetInput = z.infer<typeof DataViewsGetInputSchema>;

export const DataViewsGetResponseSchema = z
	.object({
		data_view: z.object({
			id: z.string(),
			title: z.string(),
			name: z.string().optional(),
			timeFieldName: z.string().optional(),
			sourceFilters: z.array(z.record(z.string(), z.any())).optional(),
		}),
	})
	.passthrough();
export type DataViewsGetResponse = z.infer<typeof DataViewsGetResponseSchema>;

export const StatusGetInputSchema = z.object({});
export type StatusGetInput = z.infer<typeof StatusGetInputSchema>;

export const StatusGetResponseSchema = z
	.object({
		name: z.string().optional(),
		version: z
			.object({
				number: z.string().optional(),
				build_hash: z.string().optional(),
				build_number: z.number().optional(),
				build_snapshot: z.boolean().optional(),
			})
			.optional(),
		status: z
			.object({
				overall: z
					.object({
						state: z.string().optional(),
						title: z.string().optional(),
						nickname: z.string().optional(),
					})
					.optional(),
			})
			.optional(),
	})
	.passthrough();
export type StatusGetResponse = z.infer<typeof StatusGetResponseSchema>;

export type KibanaEndpointInputs = {
	savedObjectsFind: SavedObjectsFindInput;
	savedObjectsGet: SavedObjectsGetInput;
	savedObjectsCreate: SavedObjectsCreateInput;
	savedObjectsDelete: SavedObjectsDeleteInput;
	dataViewsGet: DataViewsGetInput;
	statusGet: StatusGetInput;
};

export type KibanaEndpointOutputs = {
	savedObjectsFind: SavedObjectsFindResponse;
	savedObjectsGet: SavedObjectsGetResponse;
	savedObjectsCreate: SavedObjectsCreateResponse;
	savedObjectsDelete: SavedObjectsDeleteResponse;
	dataViewsGet: DataViewsGetResponse;
	statusGet: StatusGetResponse;
};

export const KibanaEndpointInputSchemas = {
	savedObjectsFind: SavedObjectsFindInputSchema,
	savedObjectsGet: SavedObjectsGetInputSchema,
	savedObjectsCreate: SavedObjectsCreateInputSchema,
	savedObjectsDelete: SavedObjectsDeleteInputSchema,
	dataViewsGet: DataViewsGetInputSchema,
	statusGet: StatusGetInputSchema,
} as const;

export const KibanaEndpointOutputSchemas = {
	savedObjectsFind: SavedObjectsFindResponseSchema,
	savedObjectsGet: SavedObjectsGetResponseSchema,
	savedObjectsCreate: SavedObjectsCreateResponseSchema,
	savedObjectsDelete: SavedObjectsDeleteResponseSchema,
	dataViewsGet: DataViewsGetResponseSchema,
	statusGet: StatusGetResponseSchema,
} as const;
