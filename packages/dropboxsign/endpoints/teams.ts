import { logEventFromContext } from 'corsair/core';
import { makeDropboxSignRequest } from '../client';
import type { DropboxSignEndpoints } from '../index';
import type { DropboxSignEndpointOutputs } from './types';

export const getTeamInfo: DropboxSignEndpoints['getTeamInfo'] = async (
	ctx,
	input,
) => {
	const result = await makeDropboxSignRequest<
		DropboxSignEndpointOutputs['getTeamInfo']
	>('team/info', ctx.key, {
		method: 'GET',
		query: input,
		authType: ctx.authType,
	});
	await logEventFromContext(
		ctx,
		'dropboxsign.team.getInfo',
		input ?? {},
		'completed',
	);
	return result;
};

export const getCurrentTeam: DropboxSignEndpoints['getCurrentTeam'] = async (
	ctx,
) => {
	const result = await makeDropboxSignRequest<
		DropboxSignEndpointOutputs['getCurrentTeam']
	>('team', ctx.key, {
		method: 'GET',
		authType: ctx.authType,
	});
	await logEventFromContext(
		ctx,
		'dropboxsign.team.getCurrent',
		{},
		'completed',
	);
	return result;
};

export const listTeams: DropboxSignEndpoints['listTeams'] = async (
	ctx,
	input,
) => {
	const result = await makeDropboxSignRequest<
		DropboxSignEndpointOutputs['listTeams']
	>('team/list', ctx.key, {
		method: 'GET',
		query: input,
		authType: ctx.authType,
	});
	await logEventFromContext(
		ctx,
		'dropboxsign.team.list',
		input ?? {},
		'completed',
	);
	return result;
};

export const listSubTeams: DropboxSignEndpoints['listSubTeams'] = async (
	ctx,
	input,
) => {
	const { team_id, ...query } = input;
	const result = await makeDropboxSignRequest<
		DropboxSignEndpointOutputs['listSubTeams']
	>(`team/sub_teams/${encodeURIComponent(team_id)}`, ctx.key, {
		method: 'GET',
		query,
		authType: ctx.authType,
	});
	await logEventFromContext(
		ctx,
		'dropboxsign.team.listSubTeams',
		{ team_id },
		'completed',
	);
	return result;
};

export const listTeamMembers: DropboxSignEndpoints['listTeamMembers'] = async (
	ctx,
	input,
) => {
	const { team_id, ...query } = input;
	const result = await makeDropboxSignRequest<
		DropboxSignEndpointOutputs['listTeamMembers']
	>(`team/members/${encodeURIComponent(team_id)}`, ctx.key, {
		method: 'GET',
		query,
		authType: ctx.authType,
	});
	await logEventFromContext(
		ctx,
		'dropboxsign.team.listMembers',
		{ team_id },
		'completed',
	);
	return result;
};

export const addUserToTeam: DropboxSignEndpoints['addUserToTeam'] = async (
	ctx,
	input,
) => {
	const result = await makeDropboxSignRequest<
		DropboxSignEndpointOutputs['addUserToTeam']
	>('team/add_member', ctx.key, {
		method: 'POST',
		body: input,
		authType: ctx.authType,
	});
	await logEventFromContext(
		ctx,
		'dropboxsign.team.addMember',
		input,
		'completed',
	);
	return result;
};
