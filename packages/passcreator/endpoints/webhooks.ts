import type { PasscreatorEndpoints } from '..';
import { withPasscreatorWebhookToken } from '../webhooks/types';
import { call, expectEmpty } from './call';
import {
	PasscreatorEndpointInputSchemas as Inputs,
	PasscreatorEndpointOutputSchemas as Outputs,
} from './types';

export const subscribe: PasscreatorEndpoints['webhooksSubscribe'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'webhooks.subscribe',
			input: Inputs.webhooksSubscribe,
			output: Outputs.webhooksSubscribe,
		},
		input,
		// A template-scoped subscription puts the template in the path; the
		// body has no pass_template field. The target URL gets this account's
		// delivery token: Passcreator signs every account's deliveries with one
		// platform key, so the token is what ties a delivery to this account.
		({ pass_template, target_url, ...body }) => ({
			method: 'POST',
			path: pass_template
				? `/api/hook/subscribe/${encodeURIComponent(pass_template)}`
				: '/api/hook/subscribe',
			body: {
				...body,
				target_url: withPasscreatorWebhookToken(target_url, ctx.key),
			},
		}),
		{
			log: ({ event, pass_template }) => ({
				event,
				scoped: Boolean(pass_template),
			}),
		},
	);

export const unsubscribe: PasscreatorEndpoints['webhooksUnsubscribe'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'webhooks.unsubscribe',
			input: Inputs.webhooksUnsubscribe,
			output: Outputs.webhooksUnsubscribe,
		},
		input,
		// Documented as POST or DELETE with a JSON target_url; POST keeps the
		// body (the client sends none on DELETE).
		({ target_url }) => ({
			method: 'POST',
			path: '/api/hook/unsubscribe',
			body: { target_url },
		}),
		{
			// The API answers 200 with {}.
			shape: (raw) => {
				expectEmpty(raw, 'webhooks.unsubscribe');
				return { success: true };
			},
			log: (_, result) => ({ success: result.success }),
		},
	);

export const list: PasscreatorEndpoints['webhooksList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'webhooks.list',
			input: Inputs.webhooksList,
			output: Outputs.webhooksList,
		},
		input,
		() => ({ method: 'GET', path: '/api/hook/list' }),
		{ log: (_, subscriptions) => ({ count: subscriptions.length }) },
	);

export const getPublicKey: PasscreatorEndpoints['webhooksGetPublicKey'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'webhooks.getPublicKey',
			input: Inputs.webhooksGetPublicKey,
			output: Outputs.webhooksGetPublicKey,
		},
		input,
		() => ({ method: 'GET', path: '/api/hook/publickey' }),
		{
			// The key itself is not logged, only that one was returned.
			log: (_, result) => ({ hasKey: result.publicKey.length > 0 }),
		},
	);
