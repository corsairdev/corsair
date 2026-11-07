import { logEventFromContext } from 'corsair/core';
import { makeMixmaxRequest } from '../client';
import type { MixmaxEndpoints } from '../index';
import { mixmaxPathParameter } from './path';
import type { MixmaxEndpointOutputs } from './types';

export const teamsList: MixmaxEndpoints['teamsList'] = async (ctx, input) => {
	const result = await makeMixmaxRequest<MixmaxEndpointOutputs['teamsList']>(
		ctx,
		'/v1/teams',
		{
			method: 'GET',
			query: {
				expand: input.expand,
				accessThrough: input.accessThrough,
				limit: input.limit,
				next: input.next,
				previous: input.previous,
			},
		},
	);

	await logEventFromContext(
		ctx,
		'mixmax.teams.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const teamsCreate: MixmaxEndpoints['teamsCreate'] = async (
	ctx,
	input,
) => {
	const { name, orgId, members } = input;
	const result = await makeMixmaxRequest<MixmaxEndpointOutputs['teamsCreate']>(
		ctx,
		'/v1/teams',
		{
			method: 'POST',
			body: {
				name,
				orgId,
				members,
			},
		},
	);

	await logEventFromContext(
		ctx,
		'mixmax.teams.create',
		{ ...input },
		'completed',
	);
	return result;
};

export const teamsGet: MixmaxEndpoints['teamsGet'] = async (ctx, input) => {
	const result = await makeMixmaxRequest<MixmaxEndpointOutputs['teamsGet']>(
		ctx,
		mixmaxPathParameter('/v1/teams/{id}', 'id', input.id),
		{
			method: 'GET',
			query: {
				expand: input.expand,
			},
		},
	);

	await logEventFromContext(ctx, 'mixmax.teams.get', { ...input }, 'completed');
	return result;
};

export const teamsUpdate: MixmaxEndpoints['teamsUpdate'] = async (
	ctx,
	input,
) => {
	const { id, name } = input;
	const result = await makeMixmaxRequest<MixmaxEndpointOutputs['teamsUpdate']>(
		ctx,
		mixmaxPathParameter('/v1/teams/{id}', 'id', id),
		{
			method: 'PATCH',
			body: {
				name,
			},
		},
	);

	await logEventFromContext(
		ctx,
		'mixmax.teams.update',
		{ ...input },
		'completed',
	);
	return result;
};

export const teamsDelete: MixmaxEndpoints['teamsDelete'] = async (
	ctx,
	input,
) => {
	const result = await makeMixmaxRequest<MixmaxEndpointOutputs['teamsDelete']>(
		ctx,
		mixmaxPathParameter('/v1/teams/{id}', 'id', input.id),
		{
			method: 'DELETE',
		},
	);

	await logEventFromContext(
		ctx,
		'mixmax.teams.delete',
		{ ...input },
		'completed',
	);
	return result;
};

export const teamsMembersList: MixmaxEndpoints['teamsMembersList'] = async (
	ctx,
	input,
) => {
	const result = await makeMixmaxRequest<
		MixmaxEndpointOutputs['teamsMembersList']
	>(ctx, mixmaxPathParameter('/v1/teams/{id}/members', 'id', input.id), {
		method: 'GET',
		query: {
			expand: input.expand,
		},
	});

	await logEventFromContext(
		ctx,
		'mixmax.teams.members.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const teamsMembersAdd: MixmaxEndpoints['teamsMembersAdd'] = async (
	ctx,
	input,
) => {
	const { id, members } = input;
	const result = await makeMixmaxRequest<
		MixmaxEndpointOutputs['teamsMembersAdd']
	>(ctx, mixmaxPathParameter('/v1/teams/{id}/members', 'id', id), {
		method: 'POST',
		body: {
			members,
		},
	});

	await logEventFromContext(
		ctx,
		'mixmax.teams.members.add',
		{ ...input },
		'completed',
	);
	return result;
};

export const teamsMembersRemove: MixmaxEndpoints['teamsMembersRemove'] = async (
	ctx,
	input,
) => {
	const { id, memberId } = input;
	const result = await makeMixmaxRequest<
		MixmaxEndpointOutputs['teamsMembersRemove']
	>(
		ctx,
		mixmaxPathParameter(
			mixmaxPathParameter('/v1/teams/{id}/members/{memberId}', 'id', id),
			'memberId',
			memberId,
		),
		{
			method: 'DELETE',
		},
	);

	await logEventFromContext(
		ctx,
		'mixmax.teams.members.remove',
		{ ...input },
		'completed',
	);
	return result;
};

export const teamsMembersUpdate: MixmaxEndpoints['teamsMembersUpdate'] = async (
	ctx,
	input,
) => {
	const { id, memberId, role } = input;
	const result = await makeMixmaxRequest<
		MixmaxEndpointOutputs['teamsMembersUpdate']
	>(
		ctx,
		mixmaxPathParameter(
			mixmaxPathParameter('/v1/teams/{id}/members/{memberId}', 'id', id),
			'memberId',
			memberId,
		),
		{
			method: 'PATCH',
			body: {
				role,
			},
		},
	);

	await logEventFromContext(
		ctx,
		'mixmax.teams.members.update',
		{ ...input },
		'completed',
	);
	return result;
};
