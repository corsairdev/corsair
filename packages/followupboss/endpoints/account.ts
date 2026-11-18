import type { FollowUpBossEndpoints } from '..';
import { call, envelopeOne } from './call';
import {
	FollowUpBossEndpointInputSchemas as Inputs,
	FollowUpBossEndpointOutputSchemas as Outputs,
} from './types';

// GET /me answers with the authenticated user as a flat object.
export const me: FollowUpBossEndpoints['meGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'account.me',
			input: Inputs.meGet,
			output: Outputs.meGet,
		},
		input,
		() => ({ method: 'GET', path: '/me' }),
		{
			shape: (raw) => envelopeOne(raw, 'me'),
		},
	);

// GET /identity answers with the account identity data.
export const identity: FollowUpBossEndpoints['identityGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'account.identity',
			input: Inputs.identityGet,
			output: Outputs.identityGet,
		},
		input,
		() => ({ method: 'GET', path: '/identity' }),
		{
			shape: (raw) => envelopeOne(raw, 'identity'),
		},
	);
