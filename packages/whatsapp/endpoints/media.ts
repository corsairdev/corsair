import { logEventFromContext } from 'corsair/core';
import { makeWhatsappRequest } from '../client';
import type { WhatsappEndpoints } from '../index';
import { resolvePhoneNumberId } from './messages';
import type { WhatsappEndpointOutputs } from './types';

export const uploadMedia: WhatsappEndpoints['mediaUpload'] = async (
	ctx,
	input,
) => {
	const phoneNumberId = await resolvePhoneNumberId(ctx, input.phoneNumberId);
	
	const result = await makeWhatsappRequest<
		WhatsappEndpointOutputs['mediaUpload']
	>(`${phoneNumberId}/media`, ctx.key, {
		method: 'POST',
		formData: {
			file: input.file,
			type: input.type,
			messaging_product: 'whatsapp',
		},
		mediaType: 'multipart/form-data',
	});

	await logEventFromContext(
		ctx,
		'whatsapp.media.upload',
		{ phoneNumberId, mediaId: result.id },
		'completed',
	);
	return result;
};

export const getMediaInfo: WhatsappEndpoints['mediaGetInfo'] = async (
	ctx,
	input,
) => {
	const result = await makeWhatsappRequest<
		WhatsappEndpointOutputs['mediaGetInfo']
	>(input.mediaId, ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'whatsapp.media.getInfo',
		{ mediaId: input.mediaId },
		'completed',
	);
	return result;
};
