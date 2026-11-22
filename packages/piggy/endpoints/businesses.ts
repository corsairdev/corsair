import type { PiggyEndpoints } from '..';
import { call } from './call';
import {
	PiggyEndpointInputSchemas as Inputs,
	PiggyEndpointOutputSchemas as Outputs,
} from './types';

const CLIENT = '/api/v3/oauth/clients';

export const listProfiles: PiggyEndpoints['businessesListProfiles'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'businesses.listProfiles',
			input: Inputs.businessesListProfiles,
			output: Outputs.businessesListProfiles,
		},
		input,
		() => ({ method: 'GET', path: `${CLIENT}/business-profiles` }),
		{ log: (_, page) => ({ count: page.data.length }) },
	);

export const getProfile: PiggyEndpoints['businessesGetProfile'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'businesses.getProfile',
			input: Inputs.businessesGetProfile,
			output: Outputs.businessesGetProfile,
		},
		input,
		({ uuid }) => ({
			method: 'GET',
			path: `${CLIENT}/business-profiles/${encodeURIComponent(uuid)}`,
		}),
		{ log: (_, profile) => ({ profileUuid: profile.data.uuid ?? undefined }) },
	);
