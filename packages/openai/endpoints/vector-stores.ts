import { logEventFromContext } from 'corsair/core';
import { makeOpenaiRequest } from '../client';
import type { OpenaiEndpoints } from '../index';
import type {
	VectorStoreFileBatchesCreateResponse,
	VectorStoreFileBatchesListFilesResponse,
	VectorStoreFileBatchesRetrieveResponse,
	VectorStoreFilesCreateResponse,
	VectorStoreFilesDeleteResponse,
	VectorStoreFilesListResponse,
	VectorStoreFilesRetrieveContentResponse,
	VectorStoreFilesRetrieveResponse,
	VectorStoreFilesUpdateAttributesResponse,
	VectorStoresCreateResponse,
	VectorStoresDeleteResponse,
	VectorStoresListResponse,
	VectorStoresModifyResponse,
	VectorStoresRetrieveResponse,
	VectorStoresSearchResponse,
} from '../schema/vector-stores';

// --- Vector Stores ---

export const create: OpenaiEndpoints['vectorStoresCreate'] = async (
	ctx,
	input,
) => {
	const result = await makeOpenaiRequest<VectorStoresCreateResponse>(
		'vector_stores',
		ctx.key,
		{
			method: 'POST',
			body: {
				name: input.name,
				file_ids: input.fileIds,
				expires_after: input.expiresAfter,
				chunking_strategy: input.chunkingStrategy,
				metadata: input.metadata,
			},
		},
	);

	if (ctx.db.vectorStores) {
		try {
			await ctx.db.vectorStores.upsertByEntityId(result.id, {
				id: result.id,
				name: result.name,
				status: result.status,
				usageBytes: result.usage_bytes,
				createdAt: new Date(result.created_at * 1000),
			});
		} catch (error) {
			console.warn('Failed to save vector store to database:', error);
		}
	}

	await logEventFromContext(ctx, 'openai.vectorStores.create', {}, 'completed');
	return result;
};

export const list: OpenaiEndpoints['vectorStoresList'] = async (ctx, input) => {
	const result = await makeOpenaiRequest<VectorStoresListResponse>(
		'vector_stores',
		ctx.key,
		{ method: 'GET', query: { ...input } },
	);

	await logEventFromContext(
		ctx,
		'openai.vectorStores.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const retrieve: OpenaiEndpoints['vectorStoresRetrieve'] = async (
	ctx,
	input,
) => {
	const result = await makeOpenaiRequest<VectorStoresRetrieveResponse>(
		`vector_stores/${input.vectorStoreId}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'openai.vectorStores.retrieve',
		{ ...input },
		'completed',
	);
	return result;
};

export const modify: OpenaiEndpoints['vectorStoresModify'] = async (
	ctx,
	input,
) => {
	const result = await makeOpenaiRequest<VectorStoresModifyResponse>(
		`vector_stores/${input.vectorStoreId}`,
		ctx.key,
		{
			method: 'POST',
			body: {
				name: input.name,
				expires_after: input.expiresAfter,
				metadata: input.metadata,
			},
		},
	);

	await logEventFromContext(
		ctx,
		'openai.vectorStores.modify',
		{ vectorStoreId: input.vectorStoreId },
		'completed',
	);
	return result;
};

export const deleteVectorStore: OpenaiEndpoints['vectorStoresDelete'] = async (
	ctx,
	input,
) => {
	const result = await makeOpenaiRequest<VectorStoresDeleteResponse>(
		`vector_stores/${input.vectorStoreId}`,
		ctx.key,
		{ method: 'DELETE' },
	);

	await logEventFromContext(
		ctx,
		'openai.vectorStores.delete',
		{ ...input },
		'completed',
	);
	return result;
};

export const search: OpenaiEndpoints['vectorStoresSearch'] = async (
	ctx,
	input,
) => {
	const result = await makeOpenaiRequest<VectorStoresSearchResponse>(
		`vector_stores/${input.vectorStoreId}/search`,
		ctx.key,
		{
			method: 'POST',
			body: {
				query: input.query,
				filters: input.filters,
				max_num_results: input.maxNumResults,
				ranking_options: input.rankingOptions,
				rewrite_query: input.rewriteQuery,
			},
		},
	);

	await logEventFromContext(
		ctx,
		'openai.vectorStores.search',
		{ vectorStoreId: input.vectorStoreId },
		'completed',
	);
	return result;
};

// --- Vector Store Files ---

export const createFile: OpenaiEndpoints['vectorStoreFilesCreate'] = async (
	ctx,
	input,
) => {
	const result = await makeOpenaiRequest<VectorStoreFilesCreateResponse>(
		`vector_stores/${input.vectorStoreId}/files`,
		ctx.key,
		{
			method: 'POST',
			body: {
				file_id: input.fileId,
				chunking_strategy: input.chunkingStrategy,
				attributes: input.attributes,
			},
		},
	);

	await logEventFromContext(
		ctx,
		'openai.vectorStoreFiles.create',
		{ vectorStoreId: input.vectorStoreId, fileId: input.fileId },
		'completed',
	);
	return result;
};

export const listFiles: OpenaiEndpoints['vectorStoreFilesList'] = async (
	ctx,
	input,
) => {
	const { vectorStoreId, ...query } = input;
	const result = await makeOpenaiRequest<VectorStoreFilesListResponse>(
		`vector_stores/${vectorStoreId}/files`,
		ctx.key,
		{ method: 'GET', query: { ...query } },
	);

	await logEventFromContext(
		ctx,
		'openai.vectorStoreFiles.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const retrieveFile: OpenaiEndpoints['vectorStoreFilesRetrieve'] = async (
	ctx,
	input,
) => {
	const result = await makeOpenaiRequest<VectorStoreFilesRetrieveResponse>(
		`vector_stores/${input.vectorStoreId}/files/${input.fileId}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'openai.vectorStoreFiles.retrieve',
		{ ...input },
		'completed',
	);
	return result;
};

export const retrieveFileContent: OpenaiEndpoints['vectorStoreFilesRetrieveContent'] =
	async (ctx, input) => {
		const result =
			await makeOpenaiRequest<VectorStoreFilesRetrieveContentResponse>(
				`vector_stores/${input.vectorStoreId}/files/${input.fileId}/content`,
				ctx.key,
				{ method: 'GET' },
			);

		await logEventFromContext(
			ctx,
			'openai.vectorStoreFiles.retrieveContent',
			{ ...input },
			'completed',
		);
		return result;
	};

export const deleteFile: OpenaiEndpoints['vectorStoreFilesDelete'] = async (
	ctx,
	input,
) => {
	const result = await makeOpenaiRequest<VectorStoreFilesDeleteResponse>(
		`vector_stores/${input.vectorStoreId}/files/${input.fileId}`,
		ctx.key,
		{ method: 'DELETE' },
	);

	await logEventFromContext(
		ctx,
		'openai.vectorStoreFiles.delete',
		{ ...input },
		'completed',
	);
	return result;
};

export const updateFileAttributes: OpenaiEndpoints['vectorStoreFilesUpdateAttributes'] =
	async (ctx, input) => {
		const result =
			await makeOpenaiRequest<VectorStoreFilesUpdateAttributesResponse>(
				`vector_stores/${input.vectorStoreId}/files/${input.fileId}`,
				ctx.key,
				{ method: 'POST', body: { attributes: input.attributes } },
			);

		await logEventFromContext(
			ctx,
			'openai.vectorStoreFiles.updateAttributes',
			{ vectorStoreId: input.vectorStoreId, fileId: input.fileId },
			'completed',
		);
		return result;
	};

// --- Vector Store File Batches ---

export const createFileBatch: OpenaiEndpoints['vectorStoreFileBatchesCreate'] =
	async (ctx, input) => {
		const result =
			await makeOpenaiRequest<VectorStoreFileBatchesCreateResponse>(
				`vector_stores/${input.vectorStoreId}/file_batches`,
				ctx.key,
				{
					method: 'POST',
					body: {
						file_ids: input.fileIds,
						chunking_strategy: input.chunkingStrategy,
						attributes: input.attributes,
					},
				},
			);

		await logEventFromContext(
			ctx,
			'openai.vectorStoreFileBatches.create',
			{ vectorStoreId: input.vectorStoreId },
			'completed',
		);
		return result;
	};

export const retrieveFileBatch: OpenaiEndpoints['vectorStoreFileBatchesRetrieve'] =
	async (ctx, input) => {
		const result =
			await makeOpenaiRequest<VectorStoreFileBatchesRetrieveResponse>(
				`vector_stores/${input.vectorStoreId}/file_batches/${input.batchId}`,
				ctx.key,
				{ method: 'GET' },
			);

		await logEventFromContext(
			ctx,
			'openai.vectorStoreFileBatches.retrieve',
			{ ...input },
			'completed',
		);
		return result;
	};

export const listFileBatchFiles: OpenaiEndpoints['vectorStoreFileBatchesListFiles'] =
	async (ctx, input) => {
		const { vectorStoreId, batchId, ...query } = input;
		const result =
			await makeOpenaiRequest<VectorStoreFileBatchesListFilesResponse>(
				`vector_stores/${vectorStoreId}/file_batches/${batchId}/files`,
				ctx.key,
				{ method: 'GET', query: { ...query } },
			);

		await logEventFromContext(
			ctx,
			'openai.vectorStoreFileBatches.listFiles',
			{ ...input },
			'completed',
		);
		return result;
	};
