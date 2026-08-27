import { logEventFromContext } from 'corsair/core';
import { makeDropboxSignRequest } from '../client';
import type { DropboxSignEndpoints } from '../index';
import type { DropboxSignEndpointOutputs } from './types';

export const getEmbeddedSignUrl: DropboxSignEndpoints['getEmbeddedSignUrl'] = async (ctx, input) => {
	const { signature_id } = input;
	const result = await makeDropboxSignRequest<DropboxSignEndpointOutputs['getEmbeddedSignUrl']>(
		embedded/sign_url/,
		ctx.key,
		{ method: 'GET', authType: ctx.authType },
	);
	await logEventFromContext(ctx, 'dropbox_sign.embedded.getSignUrl', { signature_id }, 'completed');
	return result;
};

export const getEmbeddedTemplateEditUrl: DropboxSignEndpoints['getEmbeddedTemplateEditUrl'] = async (ctx, input) => {
	const { template_id, skip_signer_roles, skip_subject_message } = input;
	const body: Record<string, any> = {};
	if (skip_signer_roles !== undefined) body.force_signer_roles = !skip_signer_roles;
	if (skip_subject_message !== undefined) body.force_subject_message = !skip_subject_message;

	const result = await makeDropboxSignRequest<DropboxSignEndpointOutputs['getEmbeddedTemplateEditUrl']>(
		embedded/edit_url/,
		ctx.key,
		{ method: 'POST', body, authType: ctx.authType },
	);
	await logEventFromContext(ctx, 'dropbox_sign.embedded.getTemplateEditUrl', { template_id }, 'completed');
	return result;
};
