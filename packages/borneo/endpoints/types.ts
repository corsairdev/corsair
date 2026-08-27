import { z } from 'zod';

const AssetIdSchema = z.object({
	assetId: z.string().min(1),
});

const AssetWriteSchema = z
	.object({
		name: z.string().min(1),
		type: z.string().min(1),
	})
	.passthrough();

const AssetSchema = z.object({}).passthrough();

export const CreateAssetInputSchema = AssetWriteSchema;
export type CreateAssetInput = z.infer<typeof CreateAssetInputSchema>;

export const CreateAssetResponseSchema = AssetSchema;
export type CreateAssetResponse = z.infer<typeof CreateAssetResponseSchema>;

export const RetrieveAssetInputSchema = AssetIdSchema;
export type RetrieveAssetInput = z.infer<typeof RetrieveAssetInputSchema>;

export const RetrieveAssetResponseSchema = AssetSchema;
export type RetrieveAssetResponse = z.infer<typeof RetrieveAssetResponseSchema>;

export const UpdateAssetInputSchema = AssetIdSchema.extend({
	name: z.string().min(1),
	type: z.string().min(1),
}).passthrough();
export type UpdateAssetInput = z.infer<typeof UpdateAssetInputSchema>;

export const UpdateAssetResponseSchema = AssetSchema;
export type UpdateAssetResponse = z.infer<typeof UpdateAssetResponseSchema>;

export const DeleteAssetInputSchema = AssetIdSchema;
export type DeleteAssetInput = z.infer<typeof DeleteAssetInputSchema>;

export const DeleteAssetResponseSchema = z.unknown();
export type DeleteAssetResponse = z.infer<typeof DeleteAssetResponseSchema>;

export const PostSupportChatQueryInputSchema = z
	.object({
		query: z.string().min(1),
	})
	.passthrough();
export type PostSupportChatQueryInput = z.infer<
	typeof PostSupportChatQueryInputSchema
>;

export const PostSupportChatQueryResponseSchema = z.object({}).passthrough();
export type PostSupportChatQueryResponse = z.infer<
	typeof PostSupportChatQueryResponseSchema
>;

export type BorneoEndpointInputs = {
	createAsset: CreateAssetInput;
	retrieveAsset: RetrieveAssetInput;
	updateAsset: UpdateAssetInput;
	deleteAsset: DeleteAssetInput;
	postSupportChatQuery: PostSupportChatQueryInput;
};

export type BorneoEndpointOutputs = {
	createAsset: CreateAssetResponse;
	retrieveAsset: RetrieveAssetResponse;
	updateAsset: UpdateAssetResponse;
	deleteAsset: DeleteAssetResponse;
	postSupportChatQuery: PostSupportChatQueryResponse;
};

export const BorneoEndpointInputSchemas = {
	createAsset: CreateAssetInputSchema,
	retrieveAsset: RetrieveAssetInputSchema,
	updateAsset: UpdateAssetInputSchema,
	deleteAsset: DeleteAssetInputSchema,
	postSupportChatQuery: PostSupportChatQueryInputSchema,
} as const;

export const BorneoEndpointOutputSchemas = {
	createAsset: CreateAssetResponseSchema,
	retrieveAsset: RetrieveAssetResponseSchema,
	updateAsset: UpdateAssetResponseSchema,
	deleteAsset: DeleteAssetResponseSchema,
	postSupportChatQuery: PostSupportChatQueryResponseSchema,
} as const;
