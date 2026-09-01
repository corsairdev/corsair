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
			recipient_count: input.personalizations.reduce(
				(sum, p) => sum + p.to.length,
				0,
			),
			has_template: Boolean(input.template_id),
		},
		'completed',
	);

	return { x_message_id: xMessageId };
};
