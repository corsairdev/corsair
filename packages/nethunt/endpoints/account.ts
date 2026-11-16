import type { NethuntEndpoints } from '..';
import { call } from './call';
import {
	NethuntEndpointInputSchemas as Inputs,
	NethuntEndpointOutputSchemas as Outputs,
	VerifyArraySchema,
} from './types';

/**
 * Confirms the email and key pair work and returns the user behind it. The
 * route answers a one-element array, so the user is lifted out of it.
 */
export const verify: NethuntEndpoints['accountVerify'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'account.verify',
			input: Inputs.accountVerify,
			output: Outputs.accountVerify,
		},
		input,
		() => ({ method: 'GET', path: '/zapier/triggers/auth-test' }),
		{
			shape: (raw) => {
				const parsed = VerifyArraySchema.safeParse(raw);
				if (!parsed.success || parsed.data.length === 0) {
					throw new Error(
						'Expected a one-element NetHunt auth array holding a user',
					);
				}
				const [first] = parsed.data;
				if (!first?.user) {
					throw new Error('NetHunt auth answer has no user object');
				}
				return { user: first.user };
			},
			log: (_, result) => ({
				email: result.user.emailAddress ?? undefined,
			}),
		},
	);
