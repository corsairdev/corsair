import type { ListcleanEndpoints } from '..';
import { envelopeData, segment } from '../client';
import { call } from './call';
import {
	ListcleanEndpointInputSchemas as Inputs,
	ListcleanEndpointOutputSchemas as Outputs,
} from './types';

export const verifyEmail: ListcleanEndpoints['verifyVerifyEmail'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'verify.verifyEmail',
			input: Inputs.verifyVerifyEmail,
			output: Outputs.verifyVerifyEmail,
		},
		input,
		({ email }) => ({
			method: 'GET',
			path: `/verify/email/${segment(email)}`,
			// Billed read: a replay after a lost answer may spend a second credit.
			replayable: false,
		}),
		{
			shape: envelopeData,
			// The domain only: the address itself is personal data.
			log: ({ email }) => ({ domain: domainOf(email) }),
		},
	);

export const startBatchVerification: ListcleanEndpoints['verifyStartBatchVerification'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'verify.startBatchVerification',
				input: Inputs.verifyStartBatchVerification,
				output: Outputs.verifyStartBatchVerification,
			},
			input,
			({ emails, filename }) => ({
				method: 'POST',
				path: '/verify/email/batch',
				body: { emails, filename },
				// A re-POST would create a second billed job, so this is never replayed.
				replayable: false,
			}),
			{
				shape: envelopeData,
				log: (_, result) => ({ listId: result.list_id }),
			},
		);

export const getVerificationLogs: ListcleanEndpoints['verifyGetVerificationLogs'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'verify.getVerificationLogs',
				input: Inputs.verifyGetVerificationLogs,
				output: Outputs.verifyGetVerificationLogs,
			},
			input,
			({ email, source, status, ...range }) => ({
				method: 'GET',
				path: '/logs',
				query: { ...range, email, source, status },
				replayable: true,
			}),
			{
				shape: envelopeData,
				log: (_, result) => ({ count: result.length }),
			},
		);

export const getAnalytics: ListcleanEndpoints['verifyGetAnalytics'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'verify.getAnalytics',
			input: Inputs.verifyGetAnalytics,
			output: Outputs.verifyGetAnalytics,
		},
		input,
		({ source, status, ...range }) => ({
			method: 'GET',
			path: '/analytics',
			query: { ...range, source, status },
			replayable: true,
		}),
		{ shape: envelopeData },
	);

/** The part after the last @, for logs; undefined when there is none. */
function domainOf(email: string): string | undefined {
	const at = email.lastIndexOf('@');
	return at === -1 ? undefined : email.slice(at + 1);
}
