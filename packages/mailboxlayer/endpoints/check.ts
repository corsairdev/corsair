import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { makeMailboxLayerRequest, redactEmail } from '../client';
import type { MailboxLayerEndpoints } from '../index';
import type { MailboxLayerEndpointOutputs } from './types';

/**
 * Validate and verify whether an email address is correctly formatted,
 * has valid MX records, and is deliverable via SMTP. Use after collecting
 * an email address to confirm deliverability before sending to it.
 *
 * API: GET apilayer.net/api/check
 * Docs: https://docs.apilayer.com/mailboxlayer/docs/api-documentation
 */
export const check: MailboxLayerEndpoints['check'] = async (ctx, input) => {
	if (!ctx.key) {
		throw new AuthMissingError('mailboxlayer', 'api_key');
	}

	const response = await makeMailboxLayerRequest<
		MailboxLayerEndpointOutputs['check']
	>('check', ctx.key, {
		query: {
			email: input.email,
			smtp: input.smtp === false ? 0 : 1,
			format: 1,
		},
	});

	if (ctx.db.emailChecks) {
		try {
			await ctx.db.emailChecks.upsertByEntityId(response.email, {
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
			});
		} catch (error) {
			console.warn('Failed to save email check result to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'mailboxlayer.email.check',
		{ email: redactEmail(input.email) },
		'completed',
	);

	return response;
};
