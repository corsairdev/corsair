import { logEventFromContext } from 'corsair/core';
import { makeXataManagementRequest } from '../client';
import type { XataEndpoints } from '../index';
import type {
	OrganizationsGetLimitsResponse,
	OrganizationsGetProjectLimitsResponse,
	OrganizationsGetResponse,
	OrganizationsListApiKeysResponse,
	OrganizationsListResponse,
	OrganizationsUpdateResponse,
} from './types';

// GET /organizations
export const list: XataEndpoints['organizationsList'] = async (ctx, _input) => {
	const response = await makeXataManagementRequest<OrganizationsListResponse>(
		'/organizations',
		ctx.key,
	);
	await logEventFromContext(ctx, 'xata.organizations.list', {}, 'completed');
	return response;
};

// GET /organizations/{organizationID}
export const get: XataEndpoints['organizationsGet'] = async (ctx, input) => {
	const response = await makeXataManagementRequest<OrganizationsGetResponse>(
		`/organizations/${input.organizationId}`,
		ctx.key,
	);
	await logEventFromContext(
		ctx,
		'xata.organizations.get',
		{ ...input },
		'completed',
	);
	return response;
};

// PUT /organizations/{organizationID}
export const update: XataEndpoints['organizationsUpdate'] = async (
	ctx,
	input,
) => {
	const { organizationId, ...body } = input;
	const response = await makeXataManagementRequest<OrganizationsUpdateResponse>(
		`/organizations/${organizationId}`,
		ctx.key,
		{ method: 'PUT', body },
	);
	await logEventFromContext(
		ctx,
		'xata.organizations.update',
		{ ...input },
		'completed',
	);
	return response;
};

// GET /organizations/{organizationID}/limits
export const getLimits: XataEndpoints['organizationsGetLimits'] = async (
	ctx,
	input,
) => {
	const response =
		await makeXataManagementRequest<OrganizationsGetLimitsResponse>(
			`/organizations/${input.organizationId}/limits`,
			ctx.key,
		);
	await logEventFromContext(
		ctx,
		'xata.organizations.get-limits',
		{ ...input },
		'completed',
	);
	return response;
};

// GET /organizations/{organizationID}/projects/limits
export const getProjectLimits: XataEndpoints['organizationsGetProjectLimits'] =
	async (ctx, input) => {
		const response =
			await makeXataManagementRequest<OrganizationsGetProjectLimitsResponse>(
				`/organizations/${input.organizationId}/projects/limits`,
				ctx.key,
			);
		await logEventFromContext(
			ctx,
			'xata.organizations.get-project-limits',
			{ ...input },
			'completed',
		);
		return response;
	};

// GET /organizations/{organizationID}/api-keys
export const listApiKeys: XataEndpoints['organizationsListApiKeys'] = async (
	ctx,
	input,
) => {
	const response =
		await makeXataManagementRequest<OrganizationsListApiKeysResponse>(
			`/organizations/${input.organizationId}/api-keys`,
			ctx.key,
		);
	await logEventFromContext(
		ctx,
		'xata.organizations.list-api-keys',
		{ ...input },
		'completed',
	);
	return response;
};

export const Organizations = {
	list,
	get,
	update,
	getLimits,
	getProjectLimits,
	listApiKeys,
};
