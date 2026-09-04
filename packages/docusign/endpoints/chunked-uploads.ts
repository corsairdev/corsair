import { z } from 'zod';
import { resolveClient } from './context';
import type { DocusignExecutionContext } from './types';

export const AddPartToChunkedUploadInputSchema = z.object({
	chunkedUploadId: z.string(),
	chunkedUploadPartSeq: z.string(),
	body: z.record(z.string(), z.unknown()).optional(),
});

export const AddPartToChunkedUploadOutputSchema = z.object({}).passthrough();

export type AddPartToChunkedUploadParams = z.infer<
	typeof AddPartToChunkedUploadInputSchema
>;

export const addPartToChunkedUpload = async (
	ctxOrClient: DocusignExecutionContext,
	params: AddPartToChunkedUploadParams,
) => {
	const input = AddPartToChunkedUploadInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/chunked_uploads/${encodeURIComponent(input.chunkedUploadId)}/${encodeURIComponent(input.chunkedUploadPartSeq)}`,
		{
			method: 'PUT',
			body: input.body === undefined ? undefined : JSON.stringify(input.body),
		},
	);
	return AddPartToChunkedUploadOutputSchema.parse(data);
};

export const CommitChunkedUploadForEnvelopesInputSchema = z.object({
	chunkedUploadId: z.string(),
	action: z.string().optional(),
	body: z.record(z.string(), z.unknown()).optional(),
});

export const CommitChunkedUploadForEnvelopesOutputSchema = z
	.object({})
	.passthrough();

export type CommitChunkedUploadForEnvelopesParams = z.infer<
	typeof CommitChunkedUploadForEnvelopesInputSchema
>;

export const commitChunkedUploadForEnvelopes = async (
	ctxOrClient: DocusignExecutionContext,
	params: CommitChunkedUploadForEnvelopesParams,
) => {
	const input = CommitChunkedUploadForEnvelopesInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const query = new URLSearchParams();
	if (input.action !== undefined) query.append('action', String(input.action));
	const qs = query.toString() ? `?${query.toString()}` : '';
	const data = await client.request(
		`/chunked_uploads/${encodeURIComponent(input.chunkedUploadId)}` + qs,
		{
			method: 'PUT',
			body: input.body === undefined ? undefined : JSON.stringify(input.body),
		},
	);
	return CommitChunkedUploadForEnvelopesOutputSchema.parse(data);
};

export const DeleteChunkedUploadInputSchema = z.object({
	chunkedUploadId: z.string(),
});

export const DeleteChunkedUploadOutputSchema = z.object({}).passthrough();

export type DeleteChunkedUploadParams = z.infer<
	typeof DeleteChunkedUploadInputSchema
>;

export const deleteChunkedUpload = async (
	ctxOrClient: DocusignExecutionContext,
	params: DeleteChunkedUploadParams,
) => {
	const input = DeleteChunkedUploadInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/chunked_uploads/${encodeURIComponent(input.chunkedUploadId)}`,
		{
			method: 'DELETE',
		},
	);
	return DeleteChunkedUploadOutputSchema.parse(data);
};

export const InitiateNewChunkedUploadInputSchema = z.object({
	body: z.record(z.string(), z.unknown()).optional(),
});

export const InitiateNewChunkedUploadOutputSchema = z.object({}).passthrough();

export type InitiateNewChunkedUploadParams = z.infer<
	typeof InitiateNewChunkedUploadInputSchema
>;

export const initiateNewChunkedUpload = async (
	ctxOrClient: DocusignExecutionContext,
	params: InitiateNewChunkedUploadParams,
) => {
	const input = InitiateNewChunkedUploadInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(`/chunked_uploads`, {
		method: 'POST',
		body: input.body === undefined ? undefined : JSON.stringify(input.body),
	});
	return InitiateNewChunkedUploadOutputSchema.parse(data);
};

export const RetrieveChunkedUploadMetadataInputSchema = z.object({
	chunkedUploadId: z.string(),
	include: z.string().optional(),
});

export const RetrieveChunkedUploadMetadataOutputSchema = z
	.object({})
	.passthrough();

export type RetrieveChunkedUploadMetadataParams = z.infer<
	typeof RetrieveChunkedUploadMetadataInputSchema
>;

export const retrieveChunkedUploadMetadata = async (
	ctxOrClient: DocusignExecutionContext,
	params: RetrieveChunkedUploadMetadataParams,
) => {
	const input = RetrieveChunkedUploadMetadataInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const query = new URLSearchParams();
	if (input.include !== undefined)
		query.append('include', String(input.include));
	const qs = query.toString() ? `?${query.toString()}` : '';
	const data = await client.request(
		`/chunked_uploads/${encodeURIComponent(input.chunkedUploadId)}` + qs,
		{
			method: 'GET',
		},
	);
	return RetrieveChunkedUploadMetadataOutputSchema.parse(data);
};

export const ChunkedUploadsInputSchemas = {
	addPartToChunkedUpload: AddPartToChunkedUploadInputSchema,
	commitChunkedUploadForEnvelopes: CommitChunkedUploadForEnvelopesInputSchema,
	deleteChunkedUpload: DeleteChunkedUploadInputSchema,
	initiateNewChunkedUpload: InitiateNewChunkedUploadInputSchema,
	retrieveChunkedUploadMetadata: RetrieveChunkedUploadMetadataInputSchema,
};

export const ChunkedUploadsOutputSchemas = {
	addPartToChunkedUpload: AddPartToChunkedUploadOutputSchema,
	commitChunkedUploadForEnvelopes: CommitChunkedUploadForEnvelopesOutputSchema,
	deleteChunkedUpload: DeleteChunkedUploadOutputSchema,
	initiateNewChunkedUpload: InitiateNewChunkedUploadOutputSchema,
	retrieveChunkedUploadMetadata: RetrieveChunkedUploadMetadataOutputSchema,
};
