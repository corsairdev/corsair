import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { makeMailboxLayerRequest, redactEmail } from '../client';
import type { MailboxLayerEndpoints } from '../index';
import type { MailboxLayerEndpointOutputs } from './types';
import { CheckInputSchema, CheckResponseSchema } from './types';

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

	// mailboxlayer's response shape isn't guaranteed to match our types at
	// compile time — validate it at runtime before trusting or persisting it.
	const response = CheckResponseSchema.parse(rawResponse);

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
		{ email: redactEmail(email) },
		'completed',
	);

	return response;
};
