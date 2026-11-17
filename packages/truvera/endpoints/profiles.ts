import type { TruveraEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	TruveraEndpointInputSchemas,
	TruveraEndpointOutputSchemas,
} from './types';

export const list: TruveraEndpoints['profilesList'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'profiles.list',
			input: TruveraEndpointInputSchemas.listProfiles,
			output: TruveraEndpointOutputSchemas.listProfiles,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: 'profiles',
			query: { offset: parsed.offset, limit: parsed.limit },
		}),
		{ log: (_parsed, result) => ({ profiles: result.length }) },
	);

export const create: TruveraEndpoints['profilesCreate'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'profiles.create',
			input: TruveraEndpointInputSchemas.createProfile,
			output: TruveraEndpointOutputSchemas.createProfile,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: 'profiles',
			body: {
				did: parsed.did,
				name: parsed.name,
				...(parsed.description === undefined
					? {}
					: { description: parsed.description }),
				...(parsed.logo === undefined ? {} : { logo: parsed.logo }),
			},
		}),
		{ log: (parsed, result) => ({ did: result.did ?? parsed.did }) },
	);

export const get: TruveraEndpoints['profilesGet'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'profiles.get',
			input: TruveraEndpointInputSchemas.getProfile,
			output: TruveraEndpointOutputSchemas.getProfile,
		},
		input,
		(parsed) => ({ method: 'GET', path: `profiles/${segment(parsed.did)}` }),
		{ log: (parsed) => ({ did: parsed.did }) },
	);

export const update: TruveraEndpoints['profilesUpdate'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'profiles.update',
			input: TruveraEndpointInputSchemas.updateProfile,
			output: TruveraEndpointOutputSchemas.updateProfile,
		},
		input,
		(parsed) => ({
			method: 'PATCH',
			path: `profiles/${segment(parsed.did)}`,
			body: {
				did: parsed.did,
				name: parsed.name,
				...(parsed.description === undefined
					? {}
					: { description: parsed.description }),
				...(parsed.logo === undefined ? {} : { logo: parsed.logo }),
				...(parsed.website === undefined ? {} : { website: parsed.website }),
				...(parsed.email === undefined ? {} : { email: parsed.email }),
			},
		}),
		{ log: (parsed) => ({ did: parsed.did }) },
	);

export const remove: TruveraEndpoints['profilesDelete'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'profiles.delete',
			input: TruveraEndpointInputSchemas.deleteProfile,
			output: TruveraEndpointOutputSchemas.deleteProfile,
		},
		input,
		(parsed) => ({ method: 'DELETE', path: `profiles/${segment(parsed.did)}` }),
		{ log: (parsed) => ({ did: parsed.did }) },
	);
