import { logEventFromContext } from 'corsair/core';
import type { SendGridEndpoints } from '..';
import { makeSendGridRequest } from '../client';

export const send: SendGridEndpoints['mailSend'] = async (ctx, input) => {
	await makeSendGridRequest<unknown>('mail/send', ctx.key, {
		method: 'POST',
		body: input as unknown as Record<string, unknown>,
	});

	await logEventFromContext(
		ctx,
		'sendgrid.mail.send',
		{ ...input },
		'completed',
	);
	return { success: true };
};
