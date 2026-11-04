import type { TinyFishEndpoints } from '..';
import { makeTinyFishRequest } from '../client';
import { callTinyFish } from './call';
import {
	TinyFishEndpointInputSchemas,
	TinyFishEndpointOutputSchemas,
} from './types';

export const list: TinyFishEndpoints['listProfiles'] = async (ctx) => {
	return callTinyFish(
		ctx,
		'tinyfish.profiles.list',
		TinyFishEndpointInputSchemas.listProfiles,
		TinyFishEndpointOutputSchemas.listProfiles,
		{},
		() =>
			makeTinyFishRequest('agent', '/v1/profiles', ctx.key, { method: 'GET' }),
		(_validated, response) => ({
			count: response.profiles.length,
			defaultProfileId: response.profiles.find(
				(profile) => profile.is_default === true,
			)?.id,
		}),
	);
};

export const create: TinyFishEndpoints['createProfile'] = async (
	ctx,
	input,
) => {
	return callTinyFish(
		ctx,
		'tinyfish.profiles.create',
		TinyFishEndpointInputSchemas.createProfile,
		TinyFishEndpointOutputSchemas.createProfile,
		input,
		(validated) =>
			makeTinyFishRequest('agent', '/v1/profiles', ctx.key, {
				method: 'POST',
				body: validated,
			}),
		(_validated, response) => ({
			profileId: response.id,
			name: response.name,
			isDefault: response.is_default ?? false,
		}),
	);
};

export const get: TinyFishEndpoints['getProfile'] = async (ctx, input) => {
	return callTinyFish(
		ctx,
		'tinyfish.profiles.get',
		TinyFishEndpointInputSchemas.getProfile,
		TinyFishEndpointOutputSchemas.getProfile,
		input,
		(validated) =>
			makeTinyFishRequest(
				'agent',
				`/v1/profiles/${encodeURIComponent(validated.profileId)}`,
				ctx.key,
				{ method: 'GET' },
			),
		(_validated, response) => ({
			profileId: response.id,
			domainCount: response.domains.length,
		}),
	);
};

export const update: TinyFishEndpoints['updateProfile'] = async (
	ctx,
	input,
) => {
	return callTinyFish(
		ctx,
		'tinyfish.profiles.update',
		TinyFishEndpointInputSchemas.updateProfile,
		TinyFishEndpointOutputSchemas.updateProfile,
		input,
		(validated) =>
			makeTinyFishRequest(
				'agent',
				`/v1/profiles/${encodeURIComponent(validated.profileId)}`,
				ctx.key,
				{
					method: 'PATCH',
					// profileId travels in the path; an explicit null clears the
					// country while an absent key leaves it alone.
					body: {
						name: validated.name,
						set_as_default: validated.set_as_default,
						proxy_country_code: validated.proxy_country_code,
					},
				},
			),
		(_validated, response) => ({
			profileId: response.id,
			name: response.name,
			isDefault: response.is_default ?? false,
		}),
	);
};

export const remove: TinyFishEndpoints['deleteProfile'] = async (
	ctx,
	input,
) => {
	return callTinyFish(
		ctx,
		'tinyfish.profiles.delete',
		TinyFishEndpointInputSchemas.deleteProfile,
		TinyFishEndpointOutputSchemas.deleteProfile,
		input,
		(validated) =>
			makeTinyFishRequest(
				'agent',
				`/v1/profiles/${encodeURIComponent(validated.profileId)}`,
				ctx.key,
				{ method: 'DELETE' },
			),
		(validated, response) => ({
			profileId: validated.profileId,
			deleted: response.deleted,
		}),
	);
};
