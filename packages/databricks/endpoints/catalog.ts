import { logEventFromContext } from 'corsair/core';
import type { DatabricksEndpoints } from '..';
import { DatabricksAPIError, makeDatabricksRequest } from '../client';
import { redactCredentialSecrets, safeEncode } from '../utils';

export const assignMetastoreToWorkspace: DatabricksEndpoints['assignMetastoreToWorkspace'] =
	async (ctx, input) => {
		await makeDatabricksRequest<void>(
			`unity-catalog/metastores/${safeEncode(input.metastore_id)}/workspaces/${input.workspace_id}`,
			ctx,
			{
				method: 'PUT',
				body: { default_catalog_name: input.default_catalog_name },
			},
		);

		await logEventFromContext(
			ctx,
			'databricks.catalog.assign_metastore',
			input,
			'completed',
		);
		return { success: true };
	};

export const batchCreateAccessRequests: DatabricksEndpoints['batchCreateAccessRequests'] =
	async (ctx, input) => {
		const response = await makeDatabricksRequest<{ responses?: unknown[] }>(
			'unity-catalog/access-requests/batch-create',
			ctx,
			{ method: 'POST', body: input },
		);

		await logEventFromContext(
			ctx,
			'databricks.catalog.batch_create_access_requests',
			input,
			'completed',
		);
		return response;
	};

export const checkTableExists: DatabricksEndpoints['checkTableExists'] = async (
	ctx,
	input,
) => {
	const fullName = `${safeEncode(input.catalog_name)}.${safeEncode(input.schema_name)}.${safeEncode(input.table_name)}`;
	try {
		await makeDatabricksRequest<unknown>(
			`unity-catalog/tables/${fullName}`,
			ctx,
			{ method: 'GET' },
		);
		await logEventFromContext(
			ctx,
			'databricks.catalog.check_table_exists',
			input,
			'completed',
		);
		return { exists: true };
	} catch (error) {
		const isNotFound =
			error instanceof DatabricksAPIError &&
			(error.status === 404 ||
				error.code === 'RESOURCE_DOES_NOT_EXIST' ||
				error.code === 'TABLE_DOES_NOT_EXIST' ||
				error.message.includes('404') ||
				error.message.includes('RESOURCE_DOES_NOT_EXIST') ||
				error.message.includes('TABLE_DOES_NOT_EXIST'));

		if (isNotFound) {
			await logEventFromContext(
				ctx,
				'databricks.catalog.check_table_exists',
				input,
				'completed',
			);
			return { exists: false };
		}
		throw error;
	}
};

export const createCatalogConnection: DatabricksEndpoints['createCatalogConnection'] =
	async (ctx, input) => {
		const response = await makeDatabricksRequest<{ name: string }>(
			'unity-catalog/connections',
			ctx,
			{ method: 'POST', body: input },
		);

		await logEventFromContext(
			ctx,
			'databricks.catalog.create_connection',
			input,
			'completed',
		);
		return response;
	};

export const createCatalogCredential: DatabricksEndpoints['createCatalogCredential'] =
	async (ctx, input) => {
		const response = await makeDatabricksRequest<{ name: string }>(
			'unity-catalog/credentials',
			ctx,
			{ method: 'POST', body: input },
		);

		await logEventFromContext(
			ctx,
			'databricks.catalog.create_credential',
			redactCredentialSecrets(input),
			'completed',
		);
		return response;
	};

export const createExternalLocation: DatabricksEndpoints['createExternalLocation'] =
	async (ctx, input) => {
		const response = await makeDatabricksRequest<{ name: string }>(
			'unity-catalog/external-locations',
			ctx,
			{ method: 'POST', body: input },
		);

		await logEventFromContext(
			ctx,
			'databricks.catalog.create_external_location',
			input,
			'completed',
		);
		return response;
	};

export const createMetastore: DatabricksEndpoints['createMetastore'] = async (
	ctx,
	input,
) => {
	const response = await makeDatabricksRequest<{ metastore_id: string }>(
		'unity-catalog/metastores',
		ctx,
		{ method: 'POST', body: input },
	);

	await logEventFromContext(
		ctx,
		'databricks.catalog.create_metastore',
		input,
		'completed',
	);
	return response;
};

export const createStorageCredential: DatabricksEndpoints['createStorageCredential'] =
	async (ctx, input) => {
		const response = await makeDatabricksRequest<{ name: string }>(
			'unity-catalog/storage-credentials',
			ctx,
			{ method: 'POST', body: input },
		);

		await logEventFromContext(
			ctx,
			'databricks.catalog.create_storage_credential',
			redactCredentialSecrets(input),
			'completed',
		);
		return response;
	};

export const deleteCatalog: DatabricksEndpoints['deleteCatalog'] = async (
	ctx,
	input,
) => {
	await makeDatabricksRequest<void>(
		`unity-catalog/catalogs/${safeEncode(input.name)}`,
		ctx,
		{ method: 'DELETE', query: { force: input.force } },
	);

	await logEventFromContext(
		ctx,
		'databricks.catalog.delete_catalog',
		input,
		'completed',
	);
	return { success: true };
};

export const deleteCatalogConnection: DatabricksEndpoints['deleteCatalogConnection'] =
	async (ctx, input) => {
		await makeDatabricksRequest<void>(
			`unity-catalog/connections/${safeEncode(input.name)}`,
			ctx,
			{ method: 'DELETE' },
		);

		await logEventFromContext(
			ctx,
			'databricks.catalog.delete_connection',
			input,
			'completed',
		);
		return { success: true };
	};

export const deleteCatalogCredential: DatabricksEndpoints['deleteCatalogCredential'] =
	async (ctx, input) => {
		await makeDatabricksRequest<void>(
			`unity-catalog/credentials/${safeEncode(input.name)}`,
			ctx,
			{ method: 'DELETE', query: { force: input.force } },
		);

		await logEventFromContext(
			ctx,
			'databricks.catalog.delete_credential',
			input,
			'completed',
		);
		return { success: true };
	};

export const deleteCatalogTable: DatabricksEndpoints['deleteCatalogTable'] =
	async (ctx, input) => {
		await makeDatabricksRequest<void>(
			`unity-catalog/tables/${safeEncode(input.full_name)}`,
			ctx,
			{ method: 'DELETE' },
		);

		await logEventFromContext(
			ctx,
			'databricks.catalog.delete_table',
			input,
			'completed',
		);
		return { success: true };
	};

export const deleteExternalLocation: DatabricksEndpoints['deleteExternalLocation'] =
	async (ctx, input) => {
		await makeDatabricksRequest<void>(
			`unity-catalog/external-locations/${safeEncode(input.name)}`,
			ctx,
			{ method: 'DELETE', query: { force: input.force } },
		);

		await logEventFromContext(
			ctx,
			'databricks.catalog.delete_external_location',
			input,
			'completed',
		);
		return { success: true };
	};

export const deleteMetastore: DatabricksEndpoints['deleteMetastore'] = async (
	ctx,
	input,
) => {
	await makeDatabricksRequest<void>(
		`unity-catalog/metastores/${safeEncode(input.id)}`,
		ctx,
		{ method: 'DELETE', query: { force: input.force } },
	);

	await logEventFromContext(
		ctx,
		'databricks.catalog.delete_metastore',
		input,
		'completed',
	);
	return { success: true };
};

export const deleteOnlineTable: DatabricksEndpoints['deleteOnlineTable'] =
	async (ctx, input) => {
		await makeDatabricksRequest<void>(
			`unity-catalog/online-tables/${safeEncode(input.name)}`,
			ctx,
			{ method: 'DELETE' },
		);

		await logEventFromContext(
			ctx,
			'databricks.catalog.delete_online_table',
			input,
			'completed',
		);
		return { success: true };
	};

export const deleteStorageCredential: DatabricksEndpoints['deleteStorageCredential'] =
	async (ctx, input) => {
		await makeDatabricksRequest<void>(
			`unity-catalog/storage-credentials/${safeEncode(input.name)}`,
			ctx,
			{ method: 'DELETE', query: { force: input.force } },
		);

		await logEventFromContext(
			ctx,
			'databricks.catalog.delete_storage_credential',
			input,
			'completed',
		);
		return { success: true };
	};

export const disableSystemSchema: DatabricksEndpoints['disableSystemSchema'] =
	async (ctx, input) => {
		await makeDatabricksRequest<void>(
			`unity-catalog/metastores/${safeEncode(input.metastore_id)}/system-schemas/${safeEncode(input.schema_name)}`,
			ctx,
			{ method: 'DELETE' },
		);

		await logEventFromContext(
			ctx,
			'databricks.catalog.disable_system_schema',
			input,
			'completed',
		);
		return { success: true };
	};
