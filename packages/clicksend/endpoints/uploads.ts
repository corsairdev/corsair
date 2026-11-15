import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import { z } from 'zod';
import { getClickSendCredentials, makeClickSendRequest } from '../client';
import type { ClickSendContext } from '../index';

// JSON variant of the uploads endpoint: makeClickSendRequest only supports
// JSON bodies, so file bytes are supplied as a base64 `content` string and the
// target channel is passed via ?convert=. Uploaded files expire after
// 10 minutes.

// ── Upload file ───────────────────────────────────────────────────────────────

export const UploadFileInputSchema = z
	.object({
		convert: z.enum(['fax', 'mms', 'csv', 'post', 'postcard']),
		content: z.string().min(1).describe('Base64-encoded file content'),
	})
	.strict();
export type UploadFileInput = z.infer<typeof UploadFileInputSchema>;

export const UploadFileResponseSchema = z
	.object({
		file_name: z.string().optional(),
		upload_id: z.number().optional(),
		user_id: z.number().optional(),
		date_added: z.string().optional(),
		date_delete: z.string().optional(),
		_url: z.string().optional(),
	})
	.passthrough();
export type UploadFileResponse = z.infer<typeof UploadFileResponseSchema>;

// ── Upload document ───────────────────────────────────────────────────────────

export const UploadDocumentInputSchema = z
	.object({
		convert: z.enum(['fax', 'post', 'postcard']),
		content: z.string().min(1).describe('Base64-encoded file content'),
	})
	.strict();
export type UploadDocumentInput = z.infer<typeof UploadDocumentInputSchema>;

export const UploadDocumentResponseSchema = z
	.object({
		file_name: z.string().optional(),
		upload_id: z.number().optional(),
		user_id: z.number().optional(),
		date_added: z.string().optional(),
		date_delete: z.string().optional(),
		_url: z.string().optional(),
	})
	.passthrough();
export type UploadDocumentResponse = z.infer<
	typeof UploadDocumentResponseSchema
>;

// ── Endpoints ─────────────────────────────────────────────────────────────────

// Upload a file for use with fax, mms, csv, post or postcard; the uploaded
// file expires after 10 minutes.
export const uploadFile: CorsairEndpoint<
	ClickSendContext,
	UploadFileInput,
	UploadFileResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		'uploads?convert=' + input.convert,
		username,
		apiKey,
		{
			method: 'POST',
			body: {
				content: input.content,
			},
			responseSchema: UploadFileResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.uploads.upload',
		{ convert: input.convert },
		'completed',
	);

	return response;
};

// Upload a document for use with fax, post or postcard; the uploaded file
// expires after 10 minutes.
export const uploadDocument: CorsairEndpoint<
	ClickSendContext,
	UploadDocumentInput,
	UploadDocumentResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		'uploads?convert=' + input.convert,
		username,
		apiKey,
		{
			method: 'POST',
			body: {
				content: input.content,
			},
			responseSchema: UploadDocumentResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.uploads.uploadDocument',
		{ convert: input.convert },
		'completed',
	);

	return response;
};
