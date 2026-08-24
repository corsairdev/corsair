import { logEventFromContext } from 'corsair/core';
import type { HabiticaEndpoints } from '../index';
import { credentialAuditPayload } from './logging';
import { habiticaAnonymousCall } from './shared';
import type { HabiticaEndpointOutputs } from './types';

/**
 * The three operations that mint a credential rather than use one.
 *
 * Everything in this file is handled more strictly than the rest of the plugin,
 * because both the inputs and the outputs are secrets:
 *
 * - **Inputs are credentials.** A password, or a third-party OAuth response.
 * - **Outputs are credentials.** The response carries a live `apiToken`.
 *
 * Three rules follow, and they are the reason this is a separate file rather
 * than three functions in `user.ts`:
 *
 * 1. **Nothing is mirrored.** No entity store is touched by any of these.
 * 2. **Nothing is logged but the fact of the attempt.** Not the email, not the
 *    username, not the network. `credentialAuditPayload()` is used instead of
 *    `auditPayload()` precisely because the latter records the *names* of the
 *    supplied fields, and `fields: ["username","password"]` sitting in a
 *    retained log is an invitation to widen it into the values later.
 * 3. **They send no credential of their own.** These routes are
 *    `authOptional` - registration and social auth by necessity, since the
 *    caller has no account yet. They go through the anonymous transport, so a
 *    caller registering a brand-new account is not required to already hold a
 *    Habitica user id.
 *
 * The returned `apiToken` is handed back to the caller, which is the entire
 * point of the operation. What must not happen is it being written anywhere on
 * the way past.
 */

/** Registers a new account and returns its freshly minted credential. */
export const register: HabiticaEndpoints['authRegister'] = async (
	ctx,
	input,
) => {
	const result = await habiticaAnonymousCall<
		HabiticaEndpointOutputs['authRegister']
	>('user/auth/local/register', {
		method: 'POST',
		body: {
			username: input.username,
			email: input.email,
			password: input.password,
			confirmPassword: input.confirmPassword,
		},
	});

	await logEventFromContext(
		ctx,
		'habitica.auth.register',
		credentialAuditPayload(),
		'completed',
	);
	return result;
};

/** Exchanges a username or email and password for an API token. */
export const login: HabiticaEndpoints['authLogin'] = async (ctx, input) => {
	const result = await habiticaAnonymousCall<
		HabiticaEndpointOutputs['authLogin']
	>('user/auth/local/login', {
		method: 'POST',
		body: { username: input.username, password: input.password },
	});

	await logEventFromContext(
		ctx,
		'habitica.auth.login',
		credentialAuditPayload(),
		'completed',
	);
	return result;
};

/**
 * Authenticates through a social provider.
 *
 * `authResponse` is whatever the provider issued and is passed through
 * unexamined - this plugin does not need to understand it, and reading into it
 * would mean handling someone's OAuth material more than necessary.
 */
export const social: HabiticaEndpoints['authSocial'] = async (ctx, input) => {
	const result = await habiticaAnonymousCall<
		HabiticaEndpointOutputs['authSocial']
	>('user/auth/social', {
		method: 'POST',
		body: { network: input.network, authResponse: input.authResponse },
	});

	await logEventFromContext(
		ctx,
		'habitica.auth.social',
		credentialAuditPayload(),
		'completed',
	);
	return result;
};
