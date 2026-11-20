import type { NeutrinoEndpoints } from '..';
import { call } from './call';
import {
	NeutrinoEndpointInputSchemas as Inputs,
	NeutrinoEndpointOutputSchemas as Outputs,
} from './types';

/**
 * Syntax, domain and MX checks, plus flags for disposable, free and personal
 * addresses. It does not contact the mailbox.
 */
export const validate: NeutrinoEndpoints['emailValidate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'email.validate',
			input: Inputs.emailValidate,
			output: Outputs.emailValidate,
		},
		input,
		({ email }) => ({
			method: 'GET',
			path: '/email-validate',
			query: { email },
		}),
		{
			log: ({ email }, result) => ({
				// Only the domain is safe to log; the mailbox is not.
				domain: result.domain ?? email.split('@')[1],
				valid: result.valid ?? undefined,
			}),
		},
	);

/**
 * The same checks as validate, plus an SMTP probe that reports whether the
 * mailbox exists. That probe can cost more and can be refused by the receiving
 * server, so it answers `verified` separately from `valid`.
 */
export const verify: NeutrinoEndpoints['emailVerify'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'email.verify',
			input: Inputs.emailVerify,
			output: Outputs.emailVerify,
		},
		input,
		({ email }) => ({
			method: 'GET',
			path: '/email-verify',
			query: { email },
			// Neutrino documents up to 60 s when the mail server is slow.
			timeoutMs: 75_000,
		}),
		{
			log: ({ email }, result) => ({
				domain: result.domain ?? email.split('@')[1],
				verified: result.verified ?? undefined,
				catchAll: result['is-catch-all'] ?? undefined,
			}),
		},
	);
