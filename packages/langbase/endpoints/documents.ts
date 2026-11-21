import { Buffer } from 'node:buffer';
import { z } from 'zod';
import { makeLangbaseRequest, uploadLangbaseDocument } from '../client';
import type { LangbasePluginContext } from '../index';
import type {
	DeleteDocumentInput,
	DeleteDocumentOutput,
	ListDocumentsInput,
	ListDocumentsOutput,
	RetryDocumentEmbeddingsInput,
	RetryDocumentEmbeddingsOutput,
	UploadDocumentInput,
	UploadDocumentOutput,
} from './types';
import {
	DeleteDocumentOutputSchema,
	LangbaseEndpointInputSchemas,
	ListDocumentsOutputSchema,
	RetryDocumentEmbeddingsOutputSchema,
	UploadDocumentOutputSchema,
} from './types';

const SignedUrlResponseSchema = z.object({ signedUrl: z.string().min(1) });

export const documents = {
	list: async (
		ctx: LangbasePluginContext,
		input: ListDocumentsInput,
	): Promise<ListDocumentsOutput> => {
		const parsedInput =
			LangbaseEndpointInputSchemas['documents.list'].parse(input);
		const path = `/memory/${encodeURIComponent(parsedInput.memoryName)}/documents`;
		// `unknown` because the provider response is untrusted until parsed below.
		const raw = await makeLangbaseRequest<unknown>(path, ctx.key, {
			method: 'GET',
		});
		return ListDocumentsOutputSchema.parse(raw);
	},

	upload: async (
		ctx: LangbasePluginContext,
		input: UploadDocumentInput,
	): Promise<UploadDocumentOutput> => {
		const parsedInput =
			LangbaseEndpointInputSchemas['documents.upload'].parse(input);
		// `unknown` because the signed URL response is untrusted until parsed below.
		const signedUrlResponse = await makeLangbaseRequest<unknown>(
			'/memory/documents',
			ctx.key,
			{
				method: 'POST',
				body: {
					memoryName: parsedInput.memoryName,
					documentName: parsedInput.documentName,
					...(parsedInput.meta === undefined ? {} : { meta: parsedInput.meta }),
				},
			},
		);
		const { signedUrl } = SignedUrlResponseSchema.parse(signedUrlResponse);
		const bytes = Buffer.from(parsedInput.contentBase64, 'base64');
		const content = new Blob([bytes], { type: parsedInput.contentType });
		const result = await uploadLangbaseDocument(
			signedUrl,
			content,
			parsedInput.contentType,
		);
		return UploadDocumentOutputSchema.parse(result);
	},

	delete: async (
		ctx: LangbasePluginContext,
		input: DeleteDocumentInput,
	): Promise<DeleteDocumentOutput> => {
		const parsedInput =
			LangbaseEndpointInputSchemas['documents.delete'].parse(input);
		const path = `/memory/${encodeURIComponent(parsedInput.memoryName)}/documents/${encodeURIComponent(parsedInput.documentName)}`;
		// `unknown` because the provider response is untrusted until parsed below.
		const raw = await makeLangbaseRequest<unknown>(path, ctx.key, {
			method: 'DELETE',
		});
		return DeleteDocumentOutputSchema.parse(raw);
	},

	retryEmbeddings: async (
		ctx: LangbasePluginContext,
		input: RetryDocumentEmbeddingsInput,
	): Promise<RetryDocumentEmbeddingsOutput> => {
		const parsedInput =
			LangbaseEndpointInputSchemas['documents.retryEmbeddings'].parse(input);
		const path = `/memory/${encodeURIComponent(parsedInput.memoryName)}/documents/${encodeURIComponent(parsedInput.documentName)}/embeddings/retry`;
		// `unknown` because the provider response is untrusted until parsed below.
		const raw = await makeLangbaseRequest<unknown>(path, ctx.key, {
			method: 'GET',
		});
		return RetryDocumentEmbeddingsOutputSchema.parse(raw);
	},
};
