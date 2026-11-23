import type { MocoEndpoints } from '..';
import { call } from './call';
import {
	MocoEndpointInputSchemas as Inputs,
	MocoEndpointOutputSchemas as Outputs,
} from './types';

/** Verifies the API key and returns the user identity behind it. */
export const verify: MocoEndpoints['sessionVerify'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'session.verify',
			input: Inputs.sessionVerify,
			output: Outputs.sessionVerify,
		},
		input,
		() => ({
			replayable: true,
			method: 'GET',
			path: '/session',
		}),
		{
			log: (_, result) => ({ id: result.id }),
		},
	);

/** Reads the profile of the authenticated user. */
export const get: MocoEndpoints['profileGet'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'profile.get',
			input: Inputs.profileGet,
			output: Outputs.profileGet,
		},
		input,
		() => ({
			replayable: true,
			method: 'GET',
			path: '/profile',
		}),
		{
			log: (_, result) => ({ id: result.id ?? undefined }),
		},
	);
