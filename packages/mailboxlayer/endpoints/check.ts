import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { makeMailboxLayerRequest, redactEmail } from '../client';
import type { MailboxLayerEndpoints } from '../index';
import type { MailboxLayerEndpointOutputs } from './types';
import { CheckInputSchema, CheckResponseSchema } from './types';

export const check: MailboxLayerEndpoints['check'] = async (ctx, input) => {
	if (!ctx.key) {
		throw new AuthMissingError('mailboxlayer', 'api_key');
	}

	const { email, smtp } = CheckInputSchema.parse(input);

	const rawResponse = await makeMailboxLayerRequest<
		MailboxLayerEndpointOutputs['check']
	>('check', ctx.key, {
		query: {
			email,
			smtp: smtp === false ? 0 : 1,
			format: 1,
		},
	});

	const response = CheckResponseSchema.parse(rawResponse);

	if (ctx.db?.emailChecks) {
		await ctx.db.emailChecks
			.upsertByEntityId(response.email, {
				email: response.email,
				didYouMean: response.did_you_mean,
				user: response.user,
				domain: response.domain,
				formatValid: response.format_valid,
				mxFound: response.mx_found,
				smtpCheck: response.smtp_check,
				catchAll: response.catch_all,
				role: response.role,
				disposable: response.disposable,
				free: response.free,
				score: response.score,
				checkedAt: new Date(),
			})
			.catch(() => undefined);
	}

	await logEventFromContext(
		ctx,
		'mailboxlayer.email.check',
		{ email: redactEmail(email) },
		'completed',
	);

	return response;
};
