import { logEventFromContext } from 'corsair/core';
import type { DatabricksEndpoints } from '..';
import { makeDatabricksRequest } from '../client';
import { safeEncode } from '../utils';

export const createOAuthServicePrincipalSecret: DatabricksEndpoints['createOAuthServicePrincipalSecret'] =
	async (ctx, input) => {
		const response = await makeDatabricksRequest<{
			secret_id: string;
			secret_value?: string;
		}>(
			`accounts/${safeEncode(input.account_id)}/servicePrincipals/${safeEncode(input.service_principal_id)}/credentials/secrets`,
			ctx,
			{ method: 'POST' },
		);

		await logEventFromContext(
			ctx,
			'databricks.security.create_oauth_sp_secret',
			input,
			'completed',
		);
		return response;
	};

export const createPersonalAccessToken: DatabricksEndpoints['createPersonalAccessToken'] =
	async (ctx, input) => {
		const response = await makeDatabricksRequest<{
			token_value?: string;
			token_info?: Record<string, unknown>;
		}>('token/create', ctx, { method: 'POST', body: input });

		await logEventFromContext(
			ctx,
			'databricks.security.create_personal_access_token',
			input,
			'completed',
		);
		return response;
	};

export const createNotificationDestination: DatabricksEndpoints['createNotificationDestination'] =
	async (ctx, input) => {
		const response = await makeDatabricksRequest<{ id: string }>(
			'notification-destinations',
			ctx,
			{ method: 'POST', body: input },
		);

		await logEventFromContext(
			ctx,
			'databricks.security.create_notification_destination',
			{ display_name: input.display_name },
			'completed',
		);
		return response;
	};

export const deleteNotificationDestination: DatabricksEndpoints['deleteNotificationDestination'] =
	async (ctx, input) => {
		await makeDatabricksRequest<void>(
			`notification-destinations/${safeEncode(input.id)}`,
			ctx,
			{ method: 'DELETE' },
		);

		await logEventFromContext(
			ctx,
			'databricks.security.delete_notification_destination',
			input,
			'completed',
		);
		return { success: true };
	};

export const deleteOAuth2ServicePrincipalSecret: DatabricksEndpoints['deleteOAuth2ServicePrincipalSecret'] =
	async (ctx, input) => {
		await makeDatabricksRequest<void>(
			`accounts/${safeEncode(input.account_id)}/servicePrincipals/${safeEncode(input.service_principal_id)}/credentials/secrets/${safeEncode(input.secret_id)}`,
			ctx,
			{ method: 'DELETE' },
		);

		await logEventFromContext(
			ctx,
			'databricks.security.delete_oauth_sp_secret',
			input,
			'completed',
		);
		return { success: true };
	};

export const deleteTokenManagement: DatabricksEndpoints['deleteTokenManagement'] =
	async (ctx, input) => {
		await makeDatabricksRequest<void>(
			`token-management/tokens/${safeEncode(input.token_id)}`,
			ctx,
			{ method: 'DELETE' },
		);

		await logEventFromContext(
			ctx,
			'databricks.security.delete_token_management',
			input,
			'completed',
		);
		return { success: true };
	};
