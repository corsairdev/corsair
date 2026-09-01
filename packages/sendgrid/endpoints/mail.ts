import { logEventFromContext } from 'corsair/core';
import type { SendGridEndpoints } from '..';
import { makeSendGridRequest } from '../client';

export const send: SendGridEndpoints['mailSend'] = async (ctx, input) => {
	const xMessageId = await makeSendGridRequest<string | undefined>(
		'mail/send',
		ctx.key,
		{
			method: 'POST',
			body: input,
			responseHeader: 'X-Message-Id',
		},
	);

	await logEventFromContext(
		ctx,
		'sendgrid.mail.send',
		{
			from_email: input.from.email,
			recipient_count: input.personalizations.reduce(
				(sum, p) => sum + p.to.length,
				0,
			),
			template_id: input.template_id,
		},
		'completed',
	);

	return { x_message_id: xMessageId };
};
