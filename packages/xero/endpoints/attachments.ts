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

	const response = await makeXeroRequest<
		XeroEndpointOutputs['attachmentsUpload']
	>(
		`${endpoint}/${entityId}/Attachments/${encodeURIComponent(fileName)}`,
		ctx.key,
		{
			method: 'POST',
			body: fileContent,
			mediaType: mimeType,
			tenantId,
		},
	);

	await logEventFromContext(
		ctx,
		'xero.attachments.upload',
		{ ...input },
		'completed',
	);
	return response;
};

export const Attachments = {
	list,
	upload,
};
