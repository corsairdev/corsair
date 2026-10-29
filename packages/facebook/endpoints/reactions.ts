import {
	FacebookAPIError,
	makePageFacebookRequest,
	resolvePageId,
} from '../client';
import type { FacebookEndpoints } from '../index';
import { logFacebookEvent } from './shared';
import type { FacebookEndpointOutputs } from './types';

/**
 * Graph only supports adding LIKE reactions programmatically for Page content.
 * Non-LIKE types are rejected rather than silently falling back.
 */
export const add: FacebookEndpoints['addReaction'] = async (ctx, input) => {
	const { object_id, page_id, type } = input;
	if (type && type !== 'LIKE') {
		throw new FacebookAPIError(
			`Facebook Graph API only supports adding LIKE reactions programmatically. Received type="${type}".`,
		);
	}

	const pageId = resolvePageId(page_id, object_id);
	const result = await makePageFacebookRequest<
		FacebookEndpointOutputs['addReaction']
	>(`/${object_id}/likes`, ctx, pageId, {
		method: 'POST',
	});

	await logFacebookEvent(ctx, 'facebook.reactions.add', { ...input });
	return result;
};

export const unlike: FacebookEndpoints['unlikePostOrComment'] = async (
	ctx,
	input,
) => {
	const pageId = resolvePageId(input.page_id, input.object_id);
	const result = await makePageFacebookRequest<
		FacebookEndpointOutputs['unlikePostOrComment']
	>(`/${input.object_id}/likes`, ctx, pageId, {
		method: 'DELETE',
	});

	await logFacebookEvent(ctx, 'facebook.reactions.unlike', { ...input });
	return result;
};
