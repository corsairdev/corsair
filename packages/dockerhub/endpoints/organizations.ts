import { logEventFromContext } from 'corsair/core';
import { loginDockerHubJwt } from '../client';
import type { DockerHubEndpoints } from '../index';
import { pageQuery, req, summarize } from './helpers';

/**
 * List orgs for the authenticated user.
 * Live Hub REST: GET /v2/user/orgs/ (not in public OpenAPI).
 */
export const list: DockerHubEndpoints['organizationsList'] = async (
	ctx,
	input,
) => {
	const response = await req(ctx, '/user/orgs/', {
		method: 'GET',
		query: pageQuery(input),
	});
	await logEventFromContext(
		ctx,
		'dockerhub.organizations.list',
		summarize(input),
		'completed',
	);
	return response;
};

/**
 * Create org via Hub REST POST /v2/orgs/ (not in public OpenAPI).
 * Prefer JWT from users/login when username is configured on the plugin.
 */
export const create: DockerHubEndpoints['organizationsCreate'] = async (
	ctx,
	input,
) => {
	let token = ctx.key;
	const username =
		// cast: optional plugin option not on all context typings
		(ctx as { options?: { username?: string } }).options?.username;
	if (username && ctx.key) {
		try {
			token = await loginDockerHubJwt(username, ctx.key);
		} catch {
			token = ctx.key;
		}
	}
	const response = await req({ ...ctx, key: token }, '/orgs/', {
		method: 'POST',
		body: {
			orgname: input.orgname,
			full_name: input.fullName,
			company: input.company,
			location: input.location,
			profile_url: input.profileUrl,
			gravatar_email: input.gravatarEmail,
		},
	});
	await logEventFromContext(
		ctx,
		'dockerhub.organizations.create',
		summarize(input),
		'completed',
	);
	return response;
};

/**
 * Delete org. Hub REST DELETE /v2/orgs/{orgname}/ (not in public OpenAPI).
 */
export const deleteOrganization: DockerHubEndpoints['organizationsDelete'] =
	async (ctx, input) => {
		const response = await req(
			ctx,
			`/orgs/${encodeURIComponent(input.orgname)}/`,
			{ method: 'DELETE', okOn404: true },
		);
		await logEventFromContext(
			ctx,
			'dockerhub.organizations.delete',
			summarize(input),
			'completed',
		);
		return response;
	};

/** Official: GET /v2/orgs/{org_name}/members */
export const listMembers: DockerHubEndpoints['organizationsListMembers'] =
	async (ctx, input) => {
		const response = await req(
			ctx,
			`/orgs/${encodeURIComponent(input.orgname)}/members/`,
			{ method: 'GET', query: pageQuery(input) },
		);
		await logEventFromContext(
			ctx,
			'dockerhub.organizations.listMembers',
			summarize(input),
			'completed',
		);
		return response;
	};

/**
 * Official invite: POST /v2/invites/bulk
 * (PUT /orgs/{org}/members/{user} only updates an existing member's role).
 */
export const addMember: DockerHubEndpoints['organizationsAddMember'] = async (
	ctx,
	input,
) => {
	const response = await req(ctx, '/invites/bulk', {
		method: 'POST',
		body: {
			org: input.orgname,
			invitees: [input.member],
			role: input.role ?? 'member',
			...(input.team ? { team: input.team } : {}),
		},
	});
	await logEventFromContext(
		ctx,
		'dockerhub.organizations.addMember',
		summarize(input),
		'completed',
	);
	return response;
};

/** Official: DELETE /v2/orgs/{org_name}/members/{username} */
export const removeMember: DockerHubEndpoints['organizationsRemoveMember'] =
	async (ctx, input) => {
		const response = await req(
			ctx,
			`/orgs/${encodeURIComponent(input.orgname)}/members/${encodeURIComponent(input.username)}/`,
			{ method: 'DELETE', okOn404: true },
		);
		await logEventFromContext(
			ctx,
			'dockerhub.organizations.removeMember',
			summarize(input),
			'completed',
		);
		return response;
	};

/** Official: GET /v2/orgs/{name}/access-tokens */
export const listAccessTokens: DockerHubEndpoints['organizationsListAccessTokens'] =
	async (ctx, input) => {
		const response = await req(
			ctx,
			`/orgs/${encodeURIComponent(input.orgname)}/access-tokens/`,
			{ method: 'GET', query: pageQuery(input) },
		);
		await logEventFromContext(
			ctx,
			'dockerhub.organizations.listAccessTokens',
			summarize(input),
			'completed',
		);
		return response;
	};
