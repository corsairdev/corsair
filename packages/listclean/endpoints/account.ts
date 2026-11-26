import type { ListcleanEndpoints } from '..';
import { envelopeData, envelopeMessage } from '../client';
import { call } from './call';
import {
	ListcleanEndpointInputSchemas as Inputs,
	ListcleanEndpointOutputSchemas as Outputs,
} from './types';

export const getCredits: ListcleanEndpoints['accountGetCredits'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'account.getCredits',
			input: Inputs.accountGetCredits,
			output: Outputs.accountGetCredits,
		},
		input,
		() => ({ method: 'GET', path: '/credits', replayable: true }),
		{
			shape: envelopeData,
			log: (_, result) => ({ credits: result.credits }),
		},
	);

export const getProfile: ListcleanEndpoints['accountGetProfile'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'account.getProfile',
			input: Inputs.accountGetProfile,
			output: Outputs.accountGetProfile,
		},
		input,
		// The documented path carries a trailing slash, as /lists/ does.
		() => ({ method: 'GET', path: '/account/profile/', replayable: true }),
		// The profile is the user's name, phone and address: nothing is logged.
		{ shape: envelopeData },
	);

export const updateProfile: ListcleanEndpoints['accountUpdateProfile'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'account.updateProfile',
			input: Inputs.accountUpdateProfile,
			output: Outputs.accountUpdateProfile,
		},
		input,
		(body) => ({
			method: 'POST',
			path: '/account/profile/',
			body,
			// Writing the same fields twice leaves the same profile.
			replayable: true,
		}),
		{
			// The answer is the bare ApiResponse: a message, no data.
			shape: (raw) => ({ message: envelopeMessage(raw) }),
			// Only which fields changed, never their values.
			log: (parsed) => ({ fields: Object.keys(parsed).sort().join(',') }),
		},
	);
