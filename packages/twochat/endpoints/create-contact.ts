import { logEventFromContext } from 'corsair/core';
import { makeTwoChatRequest } from '../client';
import type { TwoChatContext } from '../index';
import { cacheContacts } from './persist';
import type { TwoChatEndpointOutputs } from './types';

export const createContact = async (
	ctx: TwoChatContext & { key: string },
	input: {
		first_name: string;
		last_name?: string;
		profile_pic_url?: string;
		channel_uuid?: string;
		contact_details: Array<{ type: 'E' | 'A' | 'PH' | 'WAPH'; value: string }>;
	},
): Promise<TwoChatEndpointOutputs['createContact']> => {
	const response = await makeTwoChatRequest<
		TwoChatEndpointOutputs['createContact']
	>('open/contacts', ctx.key, {
		method: 'POST',
		body: {
			first_name: input.first_name,
			last_name: input.last_name,
			profile_pic_url: input.profile_pic_url,
			channel_uuid: input.channel_uuid,
			contact_detail: input.contact_details,
		},
	});

	await cacheContacts(ctx, [response.contact]);
	await logEventFromContext(
		ctx,
		'twochat.contacts.createContact',
		{ first_name: input.first_name },
		'completed',
	);

	return response;
};
