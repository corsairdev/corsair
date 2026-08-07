import { logEventFromContext } from 'corsair/core';
import { loginDockerHubJwt } from '../client';
import type { DockerHubEndpoints } from '../index';
import { pageQuery, req, summarize } from './helpers';

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
 * Create org. Prefer JWT from users/login when username is configured on the plugin.
 */
export const create: DockerHubEndpoints['organizationsCreate'] = async (
	ctx,
	input,
) => {
	let token = ctx.key;
	// Prefer short-lived JWT when username is available on plugin options
	const username =
		// cast: optional plugin option not on all context typings
		(ctx as { options?: { username?: string } }).options?.username;
	if (username && ctx.key) {
		try {
			token = await loginDockerHubJwt(username, ctx.key);
		} catch {
			// fall back to PAT Bearer
			token = ctx.key;
		}
	}
	const response = await req({ key: token }, '/orgs/', {
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

export const addMember: DockerHubEndpoints['organizationsAddMember'] = async (
	ctx,
	input,
) => {
	const response = await req(
		ctx,
		`/orgs/${encodeURIComponent(input.orgname)}/members/`,
		{
			method: 'POST',
			body: {
				member: input.member,
				role: input.role ?? 'member',
			},
		},
	);
	await logEventFromContext(
		ctx,
		'dockerhub.organizations.addMember',
		summarize(input),
		'completed',
	);
	return response;
};

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
