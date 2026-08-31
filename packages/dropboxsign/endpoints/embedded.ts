import { logEventFromContext } from 'corsair/core';
import { makeDropboxSignRequest } from '../client';
import type { DropboxSignEndpoints } from '../index';
import type { DropboxSignEndpointOutputs } from './types';

export const getEmbeddedSignUrl: DropboxSignEndpoints['getEmbeddedSignUrl'] =
	async (ctx, input) => {
		const { signature_id } = input;
		const result = await makeDropboxSignRequest<
			DropboxSignEndpointOutputs['getEmbeddedSignUrl']
		>(`embedded/sign_url/${encodeURIComponent(signature_id)}`, ctx, {
			method: 'GET',
		});
		await logEventFromContext(
			ctx,
			'dropboxsign.embedded.getSignUrl',
			{ signature_id },
			'completed',
		);
		return result;
	};

export const getEmbeddedTemplateEditUrl: DropboxSignEndpoints['getEmbeddedTemplateEditUrl'] =
	async (ctx, input) => {
		const { template_id, ...body } = input;

		const result = await makeDropboxSignRequest<
			DropboxSignEndpointOutputs['getEmbeddedTemplateEditUrl']
		>(`embedded/edit_url/${encodeURIComponent(template_id)}`, ctx, {
			method: 'POST',
			body,
		});
		await logEventFromContext(
			ctx,
			'dropboxsign.embedded.getTemplateEditUrl',
			{ template_id },
			'completed',
		);
		return result;
	};
