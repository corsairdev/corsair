import { logEventFromContext } from 'corsair/core';
import { makeDropboxSignRequest } from '../client';
import type { DropboxSignEndpoints } from '../index';
import type { DropboxSignEndpointOutputs } from './types';

export const getSignatureRequest: DropboxSignEndpoints['getSignatureRequest'] =
	async (ctx, input) => {
		const { signature_request_id } = input;
		const result = await makeDropboxSignRequest<
			DropboxSignEndpointOutputs['getSignatureRequest']
		>(`signature_request/${encodeURIComponent(signature_request_id)}`, ctx, {
			method: 'GET',
		});
		await logEventFromContext(
			ctx,
			'dropboxsign.signatureRequest.get',
			{ signature_request_id },
			'completed',
		);
		return result;
	};

export const listSignatureRequests: DropboxSignEndpoints['listSignatureRequests'] =
	async (ctx, input) => {
		const result = await makeDropboxSignRequest<
			DropboxSignEndpointOutputs['listSignatureRequests']
		>('signature_request/list', ctx, {
			method: 'GET',
			query: input,
		});
		await logEventFromContext(
			ctx,
			'dropboxsign.signatureRequest.list',
			input ?? {},
			'completed',
		);
		return result;
	};

export const sendSignatureRequest: DropboxSignEndpoints['sendSignatureRequest'] =
	async (ctx, input) => {
		const result = await makeDropboxSignRequest<
			DropboxSignEndpointOutputs['sendSignatureRequest']
		>('signature_request/send', ctx, {
			method: 'POST',
			body: input,
		});
		await logEventFromContext(
			ctx,
			'dropboxsign.signatureRequest.send',
			{ title: input.title },
			'completed',
		);
		return result;
	};

export const createEmbeddedSignatureRequest: DropboxSignEndpoints['createEmbeddedSignatureRequest'] =
	async (ctx, input) => {
		const result = await makeDropboxSignRequest<
			DropboxSignEndpointOutputs['createEmbeddedSignatureRequest']
		>('signature_request/create_embedded', ctx, {
			method: 'POST',
			body: input,
		});
		await logEventFromContext(
			ctx,
			'dropboxsign.signatureRequest.createEmbedded',
			{ client_id: input.client_id },
			'completed',
		);
		return result;
	};

export const createEmbeddedSignatureRequestWithTemplate: DropboxSignEndpoints['createEmbeddedSignatureRequestWithTemplate'] =
	async (ctx, input) => {
		const result = await makeDropboxSignRequest<
			DropboxSignEndpointOutputs['createEmbeddedSignatureRequestWithTemplate']
		>('signature_request/create_embedded_with_template', ctx, {
			method: 'POST',
			body: input,
		});
		await logEventFromContext(
			ctx,
			'dropboxsign.signatureRequest.createEmbeddedWithTemplate',
			{ client_id: input.client_id },
			'completed',
		);
		return result;
	};

export const cancelSignatureRequest: DropboxSignEndpoints['cancelSignatureRequest'] =
	async (ctx, input) => {
		const { signature_request_id } = input;
		const result = await makeDropboxSignRequest<
			DropboxSignEndpointOutputs['cancelSignatureRequest']
		>(
			`signature_request/cancel/${encodeURIComponent(signature_request_id)}`,
			ctx,
			{ method: 'POST' },
		);
		await logEventFromContext(
			ctx,
			'dropboxsign.signatureRequest.cancel',
			{ signature_request_id },
			'completed',
		);
		return result;
	};

export const sendRequestReminder: DropboxSignEndpoints['sendRequestReminder'] =
	async (ctx, input) => {
		const { signature_request_id, ...body } = input;
		const result = await makeDropboxSignRequest<
			DropboxSignEndpointOutputs['sendRequestReminder']
		>(
			`signature_request/remind/${encodeURIComponent(signature_request_id)}`,
			ctx,
			{ method: 'POST', body },
		);
		await logEventFromContext(
			ctx,
			'dropboxsign.signatureRequest.remind',
			{ signature_request_id },
			'completed',
		);
		return result;
	};

export const updateSignatureRequest: DropboxSignEndpoints['updateSignatureRequest'] =
	async (ctx, input) => {
		const { signature_request_id, ...body } = input;
		const result = await makeDropboxSignRequest<
			DropboxSignEndpointOutputs['updateSignatureRequest']
		>(
			`signature_request/update/${encodeURIComponent(signature_request_id)}`,
			ctx,
			{ method: 'POST', body },
		);
		await logEventFromContext(
			ctx,
			'dropboxsign.signatureRequest.update',
			{ signature_request_id },
			'completed',
		);
		return result;
	};

export const downloadSignatureRequestFiles: DropboxSignEndpoints['downloadSignatureRequestFiles'] =
	async (ctx, input) => {
		const { signature_request_id, ...query } = input;
		const result = await makeDropboxSignRequest<
			DropboxSignEndpointOutputs['downloadSignatureRequestFiles']
		>(
			`signature_request/files/${encodeURIComponent(signature_request_id)}`,
			ctx,
			{ method: 'GET', query },
		);
		await logEventFromContext(
			ctx,
			'dropboxsign.signatureRequest.downloadFiles',
			{ signature_request_id },
			'completed',
		);
		return result;
	};

export const getSignatureRequestFilesAsFileUrl: DropboxSignEndpoints['getSignatureRequestFilesAsFileUrl'] =
	async (ctx, input) => {
		const { signature_request_id } = input;
		const result = await makeDropboxSignRequest<
			DropboxSignEndpointOutputs['getSignatureRequestFilesAsFileUrl']
		>(
			`signature_request/files_as_file_url/${encodeURIComponent(signature_request_id)}`,
			ctx,
			{ method: 'GET' },
		);
		await logEventFromContext(
			ctx,
			'dropboxsign.signatureRequest.getFilesAsFileUrl',
			{ signature_request_id },
			'completed',
		);
		return result;
	};

export const getSignatureRequestFilesAsDataUri: DropboxSignEndpoints['getSignatureRequestFilesAsDataUri'] =
	async (ctx, input) => {
		const { signature_request_id } = input;
		const result = await makeDropboxSignRequest<
			DropboxSignEndpointOutputs['getSignatureRequestFilesAsDataUri']
		>(
			`signature_request/files_as_data_uri/${encodeURIComponent(signature_request_id)}`,
			ctx,
			{ method: 'GET' },
		);
		await logEventFromContext(
			ctx,
			'dropboxsign.signatureRequest.getFilesAsDataUri',
			{ signature_request_id },
			'completed',
		);
		return result;
	};

export const releaseSignatureRequestHold: DropboxSignEndpoints['releaseSignatureRequestHold'] =
	async (ctx, input) => {
		const { signature_request_id } = input;
		const result = await makeDropboxSignRequest<
			DropboxSignEndpointOutputs['releaseSignatureRequestHold']
		>(
			`signature_request/release_hold/${encodeURIComponent(signature_request_id)}`,
			ctx,
			{ method: 'POST' },
		);
		await logEventFromContext(
			ctx,
			'dropboxsign.signatureRequest.releaseHold',
			{ signature_request_id },
			'completed',
		);
		return result;
	};

export const editAndResendSignatureRequest: DropboxSignEndpoints['editAndResendSignatureRequest'] =
	async (ctx, input) => {
		const { signature_request_id, ...body } = input;
		const result = await makeDropboxSignRequest<
			DropboxSignEndpointOutputs['editAndResendSignatureRequest']
		>(
			`signature_request/edit/${encodeURIComponent(signature_request_id)}`,
			ctx,
			{ method: 'PUT', body },
		);
		await logEventFromContext(
			ctx,
			'dropboxsign.signatureRequest.editAndResend',
			{ signature_request_id },
			'completed',
		);
		return result;
	};

export const editAndResendEmbeddedSignatureRequest: DropboxSignEndpoints['editAndResendEmbeddedSignatureRequest'] =
	async (ctx, input) => {
		const { signature_request_id, ...body } = input;
		const result = await makeDropboxSignRequest<
			DropboxSignEndpointOutputs['editAndResendEmbeddedSignatureRequest']
		>(
			`signature_request/edit_embedded/${encodeURIComponent(signature_request_id)}`,
			ctx,
			{ method: 'PUT', body },
		);
		await logEventFromContext(
			ctx,
			'dropboxsign.signatureRequest.editAndResendEmbedded',
			{ signature_request_id },
			'completed',
		);
		return result;
	};

export const editAndResendEmbeddedSignatureRequestTemplate: DropboxSignEndpoints['editAndResendEmbeddedSignatureRequestTemplate'] =
	async (ctx, input) => {
		const { signature_request_id, ...body } = input;
		const result = await makeDropboxSignRequest<
			DropboxSignEndpointOutputs['editAndResendEmbeddedSignatureRequestTemplate']
		>(
			`signature_request/edit_embedded_with_template/${encodeURIComponent(signature_request_id)}`,
			ctx,
			{ method: 'PUT', body },
		);
		await logEventFromContext(
			ctx,
			'dropboxsign.signatureRequest.editAndResendEmbeddedTemplate',
			{ signature_request_id },
			'completed',
		);
		return result;
	};
