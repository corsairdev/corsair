import { logEventFromContext } from 'corsair/core';
import type { SendGridEndpoints } from '..';
import { makeSendGridRequest } from '../client';

export const send: SendGridEndpoints['mailSend'] = async (ctx, input) => {
	await makeSendGridRequest<unknown>('mail/send', ctx.key, {
		method: 'POST',
		body: input as unknown as Record<string, unknown>,
	});

	const totalRecipients = input.personalizations.reduce(
		(sum, p) => sum + p.to.length,
		0,
	);

	await logEventFromContext(
		ctx,
		'sendgrid.mail.send',
		{
			from_email: input.from.email,
			recipient_count: totalRecipients,
			template_id: input.template_id,
		},
		'completed',
	);

	return { success: true };
};
