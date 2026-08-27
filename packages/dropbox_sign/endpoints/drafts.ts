import { logEventFromContext } from 'corsair/core';
import { makeDropboxSignRequest } from '../client';
import type { DropboxSignEndpoints } from '../index';
import type { DropboxSignEndpointOutputs } from './types';

export const createUnclaimedDraft: DropboxSignEndpoints['createUnclaimedDraft'] = async (ctx, input) => {
	const result = await makeDropboxSignRequest<DropboxSignEndpointOutputs['createUnclaimedDraft']>(
		'unclaimed_draft/create',
		ctx.key,
		{ method: 'POST', body: input, authType: ctx.authType },
	);
	await logEventFromContext(ctx, 'dropbox_sign.draft.createUnclaimed', {}, 'completed');
	return result;
};

export const createEmbeddedUnclaimedDraftWithTemplate: DropboxSignEndpoints['createEmbeddedUnclaimedDraftWithTemplate'] = async (ctx, input) => {
	const result = await makeDropboxSignRequest<DropboxSignEndpointOutputs['createEmbeddedUnclaimedDraftWithTemplate']>(
		'unclaimed_draft/create_embedded_with_template',
		ctx.key,
		{ method: 'POST', body: input, authType: ctx.authType },
	);
	await logEventFromContext(ctx, 'dropbox_sign.draft.createEmbeddedUnclaimedWithTemplate', { client_id: input.client_id }, 'completed');
	return result;
};

export const editAndResendUnclaimedDraft: DropboxSignEndpoints['editAndResendUnclaimedDraft'] = async (ctx, input) => {
	const { signature_request_id, ...body } = input;
	const result = await makeDropboxSignRequest<DropboxSignEndpointOutputs['editAndResendUnclaimedDraft']>(
		unclaimed_draft/edit_and_resend/,
		ctx.key,
		{ method: 'POST', body, authType: ctx.authType },
	);
	await logEventFromContext(ctx, 'dropbox_sign.draft.editAndResendUnclaimed', { signature_request_id }, 'completed');
	return result;
};
