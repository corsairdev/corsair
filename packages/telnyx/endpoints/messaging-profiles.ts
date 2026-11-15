import type { TelnyxEndpoints } from '..';
import { call, paging } from './call';
import {
	MessagingProfilesCreateInputSchema,
	MessagingProfilesCreateResponseSchema,
	MessagingProfilesGetInputSchema,
	MessagingProfilesGetResponseSchema,
	MessagingProfilesListInputSchema,
	MessagingProfilesListResponseSchema,
	MessagingProfilesRemoveInputSchema,
	MessagingProfilesRemoveResponseSchema,
	MessagingProfilesUpdateInputSchema,
	MessagingProfilesUpdateResponseSchema,
} from './types';

export const list: TelnyxEndpoints['messagingProfilesList'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'messagingProfiles.list',
			input: MessagingProfilesListInputSchema,
			output: MessagingProfilesListResponseSchema,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/messaging_profiles',
			query: paging(parsed.pageNumber, parsed.pageSize),
		}),
	);
};

export const get: TelnyxEndpoints['messagingProfilesGet'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'messagingProfiles.get',
			input: MessagingProfilesGetInputSchema,
			output: MessagingProfilesGetResponseSchema,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/messaging_profiles/${parsed.profileId}`,
		}),
	);
};

export const create: TelnyxEndpoints['messagingProfilesCreate'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'messagingProfiles.create',
			input: MessagingProfilesCreateInputSchema,
			output: MessagingProfilesCreateResponseSchema,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/messaging_profiles',
			body: parsed,
		}),
	);
};

export const update: TelnyxEndpoints['messagingProfilesUpdate'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'messagingProfiles.update',
			input: MessagingProfilesUpdateInputSchema,
			output: MessagingProfilesUpdateResponseSchema,
		},
		input,
		(parsed) => {
			const { profileId, ...body } = parsed;
			return {
				method: 'PATCH',
				path: `/messaging_profiles/${profileId}`,
				body,
			};
		},
	);
};

export const remove: TelnyxEndpoints['messagingProfilesRemove'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'messagingProfiles.remove',
			input: MessagingProfilesRemoveInputSchema,
			output: MessagingProfilesRemoveResponseSchema,
		},
		input,
		(parsed) => ({
			method: 'DELETE',
			path: `/messaging_profiles/${parsed.profileId}`,
		}),
	);
};
