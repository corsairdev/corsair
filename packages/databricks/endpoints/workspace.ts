import { logEventFromContext } from 'corsair/core';
import type { DatabricksEndpoints } from '..';
import { makeDatabricksRequest } from '../client';
import { safeEncode } from '../utils';

export const createSecretScope: DatabricksEndpoints['createSecretScope'] =
	async (ctx, input) => {
		await makeDatabricksRequest<void>('secrets/scopes/create', ctx, {
			method: 'POST',
			body: input,
		});

		await logEventFromContext(
			ctx,
			'databricks.workspace.create_secret_scope',
			input,
			'completed',
		);
		return { success: true };
	};

export const createTagPolicy: DatabricksEndpoints['createTagPolicy'] = async (
	ctx,
	input,
) => {
	const response = await makeDatabricksRequest<{ tag_key: string }>(
		'tags/tag-policies',
		ctx,
		{ method: 'POST', body: input },
	);

	await logEventFromContext(
		ctx,
		'databricks.workspace.create_tag_policy',
		input,
		'completed',
	);
	return response;
};

export const createWorkspaceDirectory: DatabricksEndpoints['createWorkspaceDirectory'] =
	async (ctx, input) => {
		await makeDatabricksRequest<void>('workspace/mkdirs', ctx, {
			method: 'POST',
			body: input,
		});

		await logEventFromContext(
			ctx,
			'databricks.workspace.create_directory',
			input,
			'completed',
		);
		return { success: true };
	};

export const createWorkspaceGitCredentials: DatabricksEndpoints['createWorkspaceGitCredentials'] =
	async (ctx, input) => {
		const response = await makeDatabricksRequest<{ credential_id?: number }>(
			'git-credentials',
			ctx,
			{ method: 'POST', body: input },
		);

		await logEventFromContext(
			ctx,
			'databricks.workspace.create_git_credentials',
			input,
			'completed',
		);
		return response;
	};

export const createWorkspaceRepo: DatabricksEndpoints['createWorkspaceRepo'] =
	async (ctx, input) => {
		const response = await makeDatabricksRequest<{ id?: number }>(
			'repos',
			ctx,
			{ method: 'POST', body: input },
		);

		await logEventFromContext(
			ctx,
			'databricks.workspace.create_repo',
			input,
			'completed',
		);
		return response;
	};

export const deleteAibiDashboardEmbeddingAccessPolicy: DatabricksEndpoints['deleteAibiDashboardEmbeddingAccessPolicy'] =
	async (ctx, input) => {
		await makeDatabricksRequest<void>(
			'settings/aibi-dashboard-embedding-access-policy',
			ctx,
			{ method: 'DELETE' },
		);

		await logEventFromContext(
			ctx,
			'databricks.workspace.delete_aibi_embedding_access_policy',
			input,
			'completed',
		);
		return { success: true };
	};

export const deleteAibiDashboardEmbeddingApprovedDomains: DatabricksEndpoints['deleteAibiDashboardEmbeddingApprovedDomains'] =
	async (ctx, input) => {
		await makeDatabricksRequest<void>(
			'settings/aibi-dashboard-embedding-approved-domains',
			ctx,
			{ method: 'DELETE' },
		);

		await logEventFromContext(
			ctx,
			'databricks.workspace.delete_aibi_embedding_approved_domains',
			input,
			'completed',
		);
		return { success: true };
	};

export const deleteCustomLlmAgent: DatabricksEndpoints['deleteCustomLlmAgent'] =
	async (ctx, input) => {
		await makeDatabricksRequest<void>(
			`agent-bricks/custom-llms/${safeEncode(input.agent_id)}`,
			ctx,
			{ method: 'DELETE' },
		);

		await logEventFromContext(
			ctx,
			'databricks.workspace.delete_custom_llm_agent',
			input,
			'completed',
		);
		return { success: true };
	};

export const deleteDashboardEmailSubscriptionsSetting: DatabricksEndpoints['deleteDashboardEmailSubscriptionsSetting'] =
	async (ctx, input) => {
		await makeDatabricksRequest<void>(
			'settings/dashboard-email-subscriptions',
			ctx,
			{ method: 'DELETE' },
		);

		await logEventFromContext(
			ctx,
			'databricks.workspace.delete_dashboard_email_subs_setting',
			input,
			'completed',
		);
		return { success: true };
	};

export const deleteDatabricksPipeline: DatabricksEndpoints['deleteDatabricksPipeline'] =
	async (ctx, input) => {
		await makeDatabricksRequest<void>(
			`pipelines/${safeEncode(input.pipeline_id)}`,
			ctx,
			{ method: 'DELETE' },
		);

		await logEventFromContext(
			ctx,
			'databricks.workspace.delete_pipeline',
			input,
			'completed',
		);
		return { success: true };
	};

export const deleteDefaultNamespaceSetting: DatabricksEndpoints['deleteDefaultNamespaceSetting'] =
	async (ctx, input) => {
		await makeDatabricksRequest<void>('settings/default-namespace', ctx, {
			method: 'DELETE',
		});

		await logEventFromContext(
			ctx,
			'databricks.workspace.delete_default_namespace_setting',
			input,
			'completed',
		);
		return { success: true };
	};

export const deleteDefaultWarehouseIdSetting: DatabricksEndpoints['deleteDefaultWarehouseIdSetting'] =
	async (ctx, input) => {
		await makeDatabricksRequest<void>('settings/default-warehouse-id', ctx, {
			method: 'DELETE',
		});

		await logEventFromContext(
			ctx,
			'databricks.workspace.delete_default_warehouse_id_setting',
			input,
			'completed',
		);
		return { success: true };
	};

export const deleteDisableLegacyAccessSetting: DatabricksEndpoints['deleteDisableLegacyAccessSetting'] =
	async (ctx, input) => {
		await makeDatabricksRequest<void>('settings/disable-legacy-access', ctx, {
			method: 'DELETE',
		});

		await logEventFromContext(
			ctx,
			'databricks.workspace.delete_disable_legacy_access_setting',
			input,
			'completed',
		);
		return { success: true };
	};

export const deleteDisableLegacyDbfsSetting: DatabricksEndpoints['deleteDisableLegacyDbfsSetting'] =
	async (ctx, input) => {
		await makeDatabricksRequest<void>('settings/disable-legacy-dbfs', ctx, {
			method: 'DELETE',
		});

		await logEventFromContext(
			ctx,
			'databricks.workspace.delete_disable_legacy_dbfs_setting',
			input,
			'completed',
		);
		return { success: true };
	};

export const deleteLlmProxyPartnerSetting: DatabricksEndpoints['deleteLlmProxyPartnerSetting'] =
	async (ctx, input) => {
		await makeDatabricksRequest<void>('settings/llm-proxy-partner', ctx, {
			method: 'DELETE',
		});

		await logEventFromContext(
			ctx,
			'databricks.workspace.delete_llm_proxy_partner_setting',
			input,
			'completed',
		);
		return { success: true };
	};

export const deleteRestrictWorkspaceAdminsSetting: DatabricksEndpoints['deleteRestrictWorkspaceAdminsSetting'] =
	async (ctx, input) => {
		await makeDatabricksRequest<void>(
			'settings/restrict-workspace-admins',
			ctx,
			{ method: 'DELETE' },
		);

		await logEventFromContext(
			ctx,
			'databricks.workspace.delete_restrict_workspace_admins_setting',
			input,
			'completed',
		);
		return { success: true };
	};

export const deleteSqlResultsDownloadSetting: DatabricksEndpoints['deleteSqlResultsDownloadSetting'] =
	async (ctx, input) => {
		await makeDatabricksRequest<void>('settings/sql-results-download', ctx, {
			method: 'DELETE',
		});

		await logEventFromContext(
			ctx,
			'databricks.workspace.delete_sql_results_download_setting',
			input,
			'completed',
		);
		return { success: true };
	};

export const deleteSecretScope: DatabricksEndpoints['deleteSecretScope'] =
	async (ctx, input) => {
		await makeDatabricksRequest<void>('secrets/scopes/delete', ctx, {
			method: 'POST',
			body: input,
		});

		await logEventFromContext(
			ctx,
			'databricks.workspace.delete_secret_scope',
			input,
			'completed',
		);
		return { success: true };
	};

export const deleteSecretsAcl: DatabricksEndpoints['deleteSecretsAcl'] = async (
	ctx,
	input,
) => {
	await makeDatabricksRequest<void>('secrets/acls/delete', ctx, {
		method: 'POST',
		body: input,
	});

	await logEventFromContext(
		ctx,
		'databricks.workspace.delete_secrets_acl',
		input,
		'completed',
	);
	return { success: true };
};

export const deleteTagPolicy: DatabricksEndpoints['deleteTagPolicy'] = async (
	ctx,
	input,
) => {
	await makeDatabricksRequest<void>(
		`tags/tag-policies/${safeEncode(input.tag_key)}`,
		ctx,
		{ method: 'DELETE' },
	);

	await logEventFromContext(
		ctx,
		'databricks.workspace.delete_tag_policy',
		input,
		'completed',
	);
	return { success: true };
};

export const deleteWorkspaceGitCredentials: DatabricksEndpoints['deleteWorkspaceGitCredentials'] =
	async (ctx, input) => {
		await makeDatabricksRequest<void>(
			`git-credentials/${input.credential_id}`,
			ctx,
			{ method: 'DELETE' },
		);

		await logEventFromContext(
			ctx,
			'databricks.workspace.delete_git_credentials',
			input,
			'completed',
		);
		return { success: true };
	};

export const deleteWorkspaceObject: DatabricksEndpoints['deleteWorkspaceObject'] =
	async (ctx, input) => {
		await makeDatabricksRequest<void>('workspace/delete', ctx, {
			method: 'POST',
			body: input,
		});

		await logEventFromContext(
			ctx,
			'databricks.workspace.delete_object',
			input,
			'completed',
		);
		return { success: true };
	};

export const deleteWorkspaceRepo: DatabricksEndpoints['deleteWorkspaceRepo'] =
	async (ctx, input) => {
		await makeDatabricksRequest<void>(`repos/${input.repo_id}`, ctx, {
			method: 'DELETE',
		});

		await logEventFromContext(
			ctx,
			'databricks.workspace.delete_repo',
			input,
			'completed',
		);
		return { success: true };
	};

export const deleteWorkspaceSecret: DatabricksEndpoints['deleteWorkspaceSecret'] =
	async (ctx, input) => {
		await makeDatabricksRequest<void>('secrets/delete', ctx, {
			method: 'POST',
			body: input,
		});

		await logEventFromContext(
			ctx,
			'databricks.workspace.delete_secret',
			input,
			'completed',
		);
		return { success: true };
	};
