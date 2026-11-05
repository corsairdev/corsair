import { logEventFromContext } from 'corsair/core';
import { makeXeroRequest } from '../client';
import type { XeroEndpoints } from '../index';
import type { XeroEndpointOutputs } from './types';

export const list: XeroEndpoints['attachmentsList'] = async (ctx, input) => {
	const { tenantId = ctx.options.tenantId, endpoint, entityId } = input;
	const response = await makeXeroRequest<
		XeroEndpointOutputs['attachmentsList']
	>(`${endpoint}/${entityId}/Attachments`, ctx.key, {
		method: 'GET',
		tenantId,
	});

	await logEventFromContext(
		ctx,
		'xero.attachments.list',
		{ ...input },
		'completed',
	);
	return response;
};

export const upload: XeroEndpoints['attachmentsUpload'] = async (
	ctx,
	input,
) => {
	const {
		tenantId = ctx.options.tenantId,
		endpoint,
		entityId,
		fileName,
		mimeType = 'application/octet-stream',
		fileContent,
	} = input;

	// Use Blob so the HTTP request serializer treats it as raw bytes/stream
	// instead of calling JSON.stringify when mimeType includes '/json'.
	const bodyPayload =
		typeof Blob !== 'undefined'
			? new Blob([fileContent], { type: mimeType })
			: fileContent;

	const response = await makeXeroRequest<
		XeroEndpointOutputs['attachmentsUpload']
	>(
		`${endpoint}/${entityId}/Attachments/${encodeURIComponent(fileName)}`,
		ctx.key,
		{
			method: 'POST',
			body: bodyPayload,
			mediaType: mimeType,
			tenantId,
		},
	);

	// Redact raw fileContent to avoid persisting sensitive accounting documents in event logs
	await logEventFromContext(
		ctx,
		'xero.attachments.upload',
		{
			endpoint,
			entityId,
			fileName,
			mimeType,
			contentLength: fileContent.length,
		},
		'completed',
	);
	return response;
};

export const Attachments = {
	list,
	upload,
};
