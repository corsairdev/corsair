import { logEventFromContext } from 'corsair/core';
import { makeAbstractRequest } from '../client';
import type { AbstractEndpoints } from '../index';
import type { AbstractEndpointOutputs } from './types';

/**
 * Assess the deliverability and quality of an email address. Returns
 * comprehensive validation data including format checks, disposable/free
 * provider detection, role-based email detection, MX record verification,
 * and SMTP validation. Use this to verify addresses before sending, filter
 * out risky or low-quality emails, and improve deliverability rates.
 *
 * API: GET emailreputation.abstractapi.com/v1
 * Docs: https://www.abstractapi.com/api/email-reputation-verification-api
 */
export const get: AbstractEndpoints['emailReputation'] = async (ctx, input) => {
	const apiKey =
		ctx.options.emailReputationApiKey ??
		(await ctx.keys.get_email_reputation_api_key()) ??
		ctx.key;

	const response = await makeAbstractRequest<
		AbstractEndpointOutputs['emailReputation']
	>('emailReputation', '', apiKey, {
		query: {
			email: input.email,
		},
	});

	if (ctx.db.emailReputations) {
		try {
			await ctx.db.emailReputations.upsertByEntityId(response.email_address, {
				emailAddress: response.email_address,
				deliverabilityStatus: response.email_deliverability.status,
				qualityScore: response.email_quality.score,
				isFreeEmail: response.email_quality.is_free_email,
				isDisposable: response.email_quality.is_disposable,
				isCatchall: response.email_quality.is_catchall,
				addressRiskStatus: response.email_risk.address_risk_status,
				domainRiskStatus: response.email_risk.domain_risk_status,
				checkedAt: new Date(),
			});
		} catch (error) {
			console.warn(
				'Failed to save email reputation result to database:',
				error,
			);
		}
	}

	await logEventFromContext(
		ctx,
		'abstract.email.reputation',
		{ ...input },
		'completed',
	);

	return response;
};
