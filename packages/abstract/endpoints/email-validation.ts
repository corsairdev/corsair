import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { makeAbstractRequest, redactEmail, tryGetStoredKey } from '../client';
import type { AbstractEndpoints } from '../index';
import type {
	AbstractEndpointOutputs,
	EmailReputationResponse,
	EmailValidateResponse,
} from './types';
import { EmailReputationResponseSchema } from './types';

/**
 * Maps an Email Reputation response down to a simple validation-shaped
 * result: is the address real, correctly formatted, and deliverable.
 *
 * Abstract's standalone Email Validation product isn't available on this
 * account/plan (it 401s), so this is built on top of the Email Reputation
 * API instead, which covers the same format/MX/SMTP checks plus more.
 */
export function mapEmailReputationToValidation(
	response: EmailReputationResponse,
): EmailValidateResponse {
	return {
		email: response.email_address,
		autocorrect: response.suggested_correction ?? '',
		deliverability: response.email_deliverability.status,
		quality_score: response.email_quality.score,
		is_valid_format: response.email_deliverability.is_format_valid,
		is_free_email: response.email_quality.is_free_email,
		is_disposable_email: response.email_quality.is_disposable,
		is_role_email: response.email_quality.is_role ?? false,
		is_catchall_email: response.email_quality.is_catchall,
		is_mx_found: response.email_deliverability.is_mx_valid,
		is_smtp_valid: response.email_deliverability.is_smtp_valid,
	};
}

/**
 * Validate whether an email address is real, correctly formatted, and
 * deliverable. Use after collecting an email address to confirm
 * deliverability before sending to it.
 *
 * API: GET emailreputation.abstractapi.com/v1 (see mapEmailReputationToValidation)
 * Docs: https://www.abstractapi.com/api/email-reputation-verification-api
 */
export const validate: AbstractEndpoints['emailValidate'] = async (
	ctx,
	input,
) => {
	const apiKey =
		ctx.options.emailReputationApiKey ??
		(await tryGetStoredKey(() => ctx.keys?.get_email_reputation_api_key())) ??
		ctx.key;

	if (!apiKey) {
		throw new AuthMissingError('abstract', 'api_key');
	}

	const rawReputationResponse = await makeAbstractRequest<
		AbstractEndpointOutputs['emailReputation']
	>('emailReputation', '', apiKey, {
		query: {
			email: input.email,
		},
	});

	// Abstract's response shape isn't guaranteed to match our types at
	// compile time — validate it at runtime before mapping/trusting it.
	const reputationResponse = EmailReputationResponseSchema.parse(
		rawReputationResponse,
	);

	const response = mapEmailReputationToValidation(reputationResponse);

	if (ctx.db.emailValidations) {
		try {
			await ctx.db.emailValidations.upsertByEntityId(response.email, {
				email: response.email,
				autocorrect: response.autocorrect,
				deliverability: response.deliverability,
				qualityScore: response.quality_score,
				isValidFormat: response.is_valid_format,
				isFreeEmail: response.is_free_email,
				isDisposableEmail: response.is_disposable_email,
				isRoleEmail: response.is_role_email,
				isCatchallEmail: response.is_catchall_email,
				isMxFound: response.is_mx_found,
				isSmtpValid: response.is_smtp_valid,
				checkedAt: new Date(),
			});
		} catch (error) {
			console.warn(
				'Failed to save email validation result to database:',
				error,
			);
		}
	}

	await logEventFromContext(
		ctx,
		'abstract.email.validate',
		{ email: redactEmail(input.email) },
		'completed',
	);

	return response;
};
