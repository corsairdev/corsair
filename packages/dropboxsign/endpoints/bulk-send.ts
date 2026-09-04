import { logEventFromContext } from 'corsair/core';
import { makeDropboxSignRequest } from '../client';
import type { DropboxSignEndpoints } from '../index';
import type { DropboxSignEndpointOutputs } from './types';

export const bulkSendWithTemplate: DropboxSignEndpoints['bulkSendWithTemplate'] =
	async (ctx, input) => {
		const result = await makeDropboxSignRequest<
			DropboxSignEndpointOutputs['bulkSendWithTemplate']
		>('signature_request/bulk_send_with_template', ctx, {
			method: 'POST',
			body: input,
		});
		await logEventFromContext(
			ctx,
			'dropboxsign.bulkSend.sendWithTemplate',
			{ title: input.title },
			'completed',
		);
		return result;
	};

export const bulkCreateEmbeddedSigReqWithTemplate: DropboxSignEndpoints['bulkCreateEmbeddedSigReqWithTemplate'] =
	async (ctx, input) => {
		const result = await makeDropboxSignRequest<
			DropboxSignEndpointOutputs['bulkCreateEmbeddedSigReqWithTemplate']
		>('signature_request/bulk_create_embedded_with_template', ctx, {
			method: 'POST',
			body: input,
		});
		await logEventFromContext(
			ctx,
			'dropboxsign.bulkSend.createEmbeddedWithTemplate',
			{ client_id: input.client_id },
			'completed',
		);
		return result;
	};

export const getBulkSendJob: DropboxSignEndpoints['getBulkSendJob'] = async (
	ctx,
	input,
) => {
	const { bulk_send_job_id } = input;
	const result = await makeDropboxSignRequest<
		DropboxSignEndpointOutputs['getBulkSendJob']
	>(`bulk_send_job/${encodeURIComponent(bulk_send_job_id)}`, ctx, {
		method: 'GET',
	});
	await logEventFromContext(
		ctx,
		'dropboxsign.bulkSend.getJob',
		{ bulk_send_job_id },
		'completed',
	);
	return result;
};

export const listBulkSendJobs: DropboxSignEndpoints['listBulkSendJobs'] =
	async (ctx, input) => {
		const result = await makeDropboxSignRequest<
			DropboxSignEndpointOutputs['listBulkSendJobs']
		>('bulk_send_job/list', ctx, {
			method: 'GET',
			query: input,
		});
		await logEventFromContext(
			ctx,
			'dropboxsign.bulkSend.listJobs',
			input ?? {},
			'completed',
		);
		return result;
	};
