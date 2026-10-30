import { logEventFromContext } from 'corsair/core';
import type { DatabricksEndpoints } from '..';
import { makeDatabricksRequest } from '../client';
import { safeEncode } from '../utils';

export const addMemberToSecurityGroup: DatabricksEndpoints['addMemberToSecurityGroup'] =
	async (ctx, input) => {
		await makeDatabricksRequest<void>(
			`groups/${safeEncode(input.group_id)}/members`,
			ctx,
			{
				method: 'POST',
				body: { member_id: input.member_id },
			},
		);

		await logEventFromContext(
			ctx,
			'databricks.iam.add_member_to_security_group',
			input,
			'completed',
		);
		return { success: true };
	};

export const createIamGroupV2: DatabricksEndpoints['createIamGroupV2'] = async (
	ctx,
	input,
) => {
	const response = await makeDatabricksRequest<{
		id: string;
		displayName: string;
	}>('preview/scim/v2/Groups', ctx, { method: 'POST', body: input });

	await logEventFromContext(
		ctx,
		'databricks.iam.create_group_v2',
		input,
		'completed',
	);
	return response;
};

export const createIamServicePrincipalV2: DatabricksEndpoints['createIamServicePrincipalV2'] =
	async (ctx, input) => {
		const response = await makeDatabricksRequest<{
			id: string;
			applicationId: string;
		}>('preview/scim/v2/ServicePrincipals', ctx, {
			method: 'POST',
			body: input,
		});

		await logEventFromContext(
			ctx,
			'databricks.iam.create_service_principal_v2',
			input,
			'completed',
		);
		return response;
	};

export const createIamUserV2: DatabricksEndpoints['createIamUserV2'] = async (
	ctx,
	input,
) => {
	const response = await makeDatabricksRequest<{
		id: string;
		userName: string;
	}>('preview/scim/v2/Users', ctx, { method: 'POST', body: input });

	await logEventFromContext(
		ctx,
		'databricks.iam.create_user_v2',
		{ id: response.id },
		'completed',
	);
	return response;
};

export const createIpAccessList: DatabricksEndpoints['createIpAccessList'] =
	async (ctx, input) => {
		const response = await makeDatabricksRequest<{
			ip_access_list: { list_id: string };
		}>('ip-access-lists', ctx, { method: 'POST', body: input });

		await logEventFromContext(
			ctx,
			'databricks.iam.create_ip_access_list',
			input,
			'completed',
		);
		return response;
	};

export const deleteIamGroupV2: DatabricksEndpoints['deleteIamGroupV2'] = async (
	ctx,
	input,
) => {
	await makeDatabricksRequest<void>(
		`preview/scim/v2/Groups/${safeEncode(input.id)}`,
		ctx,
		{
			method: 'DELETE',
		},
	);

	await logEventFromContext(
		ctx,
		'databricks.iam.delete_group_v2',
		input,
		'completed',
	);
	return { success: true };
};

export const deleteIamServicePrincipalV2: DatabricksEndpoints['deleteIamServicePrincipalV2'] =
	async (ctx, input) => {
		await makeDatabricksRequest<void>(
			`preview/scim/v2/ServicePrincipals/${safeEncode(input.id)}`,
			ctx,
			{ method: 'DELETE' },
		);

		await logEventFromContext(
			ctx,
			'databricks.iam.delete_service_principal_v2',
			input,
			'completed',
		);
		return { success: true };
	};

export const deleteIamUserV2: DatabricksEndpoints['deleteIamUserV2'] = async (
	ctx,
	input,
) => {
	await makeDatabricksRequest<void>(
		`preview/scim/v2/Users/${safeEncode(input.id)}`,
		ctx,
		{
			method: 'DELETE',
		},
	);

	await logEventFromContext(
		ctx,
		'databricks.iam.delete_user_v2',
		input,
		'completed',
	);
	return { success: true };
};
