import { logEventFromContext } from 'corsair/core';
import type { DockerHubEndpoints } from '../index';
import { pageQuery, req, summarize } from './helpers';

/** Teams are "groups" in the Docker Hub API. */
export const list: DockerHubEndpoints['teamsList'] = async (ctx, input) => {
	const response = await req(
		ctx,
		`/orgs/${encodeURIComponent(input.orgname)}/groups/`,
		{ method: 'GET', query: pageQuery(input) },
	);
	await logEventFromContext(
		ctx,
		'dockerhub.teams.list',
		summarize(input),
		'completed',
	);
	return response;
};

export const get: DockerHubEndpoints['teamsGet'] = async (ctx, input) => {
	const response = await req(
		ctx,
		`/orgs/${encodeURIComponent(input.orgname)}/groups/${encodeURIComponent(input.teamname)}/`,
		{ method: 'GET' },
	);
	await logEventFromContext(
		ctx,
		'dockerhub.teams.get',
		summarize(input),
		'completed',
	);
	return response;
};

export const deleteTeam: DockerHubEndpoints['teamsDelete'] = async (
	ctx,
	input,
) => {
	const response = await req(
		ctx,
		`/orgs/${encodeURIComponent(input.orgname)}/groups/${encodeURIComponent(input.teamname)}/`,
		{ method: 'DELETE', okOn404: true },
	);
	await logEventFromContext(
		ctx,
		'dockerhub.teams.delete',
		summarize(input),
		'completed',
	);
	return response;
};

export const listMembers: DockerHubEndpoints['teamsListMembers'] = async (
	ctx,
	input,
) => {
	const response = await req(
		ctx,
		`/orgs/${encodeURIComponent(input.orgname)}/groups/${encodeURIComponent(input.teamname)}/members/`,
		{ method: 'GET', query: pageQuery(input) },
	);
	await logEventFromContext(
		ctx,
		'dockerhub.teams.listMembers',
		summarize(input),
		'completed',
	);
	return response;
};

export const removeMember: DockerHubEndpoints['teamsRemoveMember'] = async (
	ctx,
	input,
) => {
	const response = await req(
		ctx,
		`/orgs/${encodeURIComponent(input.orgname)}/groups/${encodeURIComponent(input.teamname)}/members/${encodeURIComponent(input.username)}/`,
		{ method: 'DELETE', okOn404: true },
	);
	await logEventFromContext(
		ctx,
		'dockerhub.teams.removeMember',
		summarize(input),
		'completed',
	);
	return response;
};
