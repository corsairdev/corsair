import { logEventFromContext } from 'corsair/core';
import type { MailcheckEndpoints } from '..';
import { makeMailcheckRequest } from '../client';
import {
	MailcheckEndpointInputSchemas,
	MailcheckEndpointOutputSchemas,
	VerificationResultSchema,
} from './types';

export const validateDomain: MailcheckEndpoints['validateDomain'] = async (
	ctx,
	input,
) => {
	const parsed = MailcheckEndpointInputSchemas.validateDomain.parse(input);
	const response = await makeMailcheckRequest<unknown>(
		'/v1/singleEmail:check',
		ctx.key,
		{
			method: 'POST',
			body: { email: `admin@${parsed.domain}` },
		},
	);
	const checked = VerificationResultSchema.parse(response ?? {});
	const output = MailcheckEndpointOutputSchemas.validateDomain.parse({
		domain: parsed.domain,
		mxExists: checked.mxExists,
		isNotDisposable: checked.isNotDisposable,
		isNotSmtpCatchAll: checked.isNotSmtpCatchAll,
	});
	await logEventFromContext(
		ctx,
		'mailcheck.domain.validate',
		{ domain: parsed.domain },
		'completed',
	);
	return output;
};
