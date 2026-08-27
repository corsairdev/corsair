import { logEventFromContext } from 'corsair/core';
import { makeDropboxSignRequest } from '../client';
import type { DropboxSignEndpoints } from '../index';
import type { DropboxSignEndpointOutputs } from './types';

export const bulkSendWithTemplate: DropboxSignEndpoints['bulkSendWithTemplate'] = async (ctx, input) => {
	const result = await makeDropboxSignRequest<DropboxSignEndpointOutputs['bulkSendWithTemplate']>(
		'signature_request/bulk_send_with_template',
		ctx.key,
		{ method: 'POST', body: input, authType: ctx.authType },
	);
	await logEventFromContext(ctx, 'dropbox_sign.bulkSend.sendWithTemplate', { title: input.title }, 'completed');
	return result;
};

export const bulkCreateEmbeddedSigReqWithTemplate: DropboxSignEndpoints['bulkCreateEmbeddedSigReqWithTemplate'] = async (ctx, input) => {
	const result = await makeDropboxSignRequest<DropboxSignEndpointOutputs['bulkCreateEmbeddedSigReqWithTemplate']>(
		'signature_request/bulk_create_embedded_with_template',
		ctx.key,
		{ method: 'POST', body: input, authType: ctx.authType },
	);
	await logEventFromContext(ctx, 'dropbox_sign.bulkSend.createEmbeddedWithTemplate', { client_id: input.client_id }, 'completed');
	return result;
};

export const getBulkSendJob: DropboxSignEndpoints['getBulkSendJob'] = async (ctx, input) => {
	const { bulk_send_job_id } = input;
	const result = await makeDropboxSignRequest<DropboxSignEndpointOutputs['getBulkSendJob']>(
		ulk_send_job/,
		ctx.key,
		{ method: 'GET', authType: ctx.authType },
	);
	await logEventFromContext(ctx, 'dropbox_sign.bulkSend.getJob', { bulk_send_job_id }, 'completed');
	return result;
};

export const listBulkSendJobs: DropboxSignEndpoints['listBulkSendJobs'] = async (ctx, input) => {
	const result = await makeDropboxSignRequest<DropboxSignEndpointOutputs['listBulkSendJobs']>(
		'bulk_send_job/list',
		ctx.key,
		{ method: 'GET', query: input, authType: ctx.authType },
	);
	await logEventFromContext(ctx, 'dropbox_sign.bulkSend.listJobs', input ?? {}, 'completed');
	return result;
};
