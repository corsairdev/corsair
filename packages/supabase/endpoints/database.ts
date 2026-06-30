import type { SupabaseEndpoint } from './factory';
import {
	logSupabaseOperation,
	requestSupabaseOperation,
	syncSupabaseOperationResult,
} from './factory';
import { databaseOperations } from './operation-groups/database';

function getOperation(name: (typeof databaseOperations)[number]['name']) {
	const operation = databaseOperations.find(
		(candidate) => candidate.name === name,
	);
	if (!operation) {
		throw new Error(`[supabase] missing operation: ${name}`);
	}
	return operation;
}

const applyMigrationOperation = getOperation('applyMigration');
export const applyMigration: SupabaseEndpoint = async (ctx, input = {}) => {
	const result = await requestSupabaseOperation(
		ctx,
		input,
		applyMigrationOperation,
	);
	await syncSupabaseOperationResult(
		ctx,
		applyMigrationOperation,
		input,
		result,
	);
	await logSupabaseOperation(ctx, input, applyMigrationOperation);
	return result;
};

const createLoginRoleOperation = getOperation('createLoginRole');
export const createLoginRole: SupabaseEndpoint = async (ctx, input = {}) => {
	const result = await requestSupabaseOperation(
		ctx,
		input,
		createLoginRoleOperation,
	);
	await syncSupabaseOperationResult(
		ctx,
		createLoginRoleOperation,
		input,
		result,
	);
	await logSupabaseOperation(ctx, input, createLoginRoleOperation);
	return result;
};

const deleteLoginRolesOperation = getOperation('deleteLoginRoles');
export const deleteLoginRoles: SupabaseEndpoint = async (ctx, input = {}) => {
	const result = await requestSupabaseOperation(
		ctx,
		input,
		deleteLoginRolesOperation,
	);
	await syncSupabaseOperationResult(
		ctx,
		deleteLoginRolesOperation,
		input,
		result,
	);
	await logSupabaseOperation(ctx, input, deleteLoginRolesOperation);
	return result;
};

const disableProjectReadonlyOperation = getOperation('disableProjectReadonly');
export const disableProjectReadonly: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestSupabaseOperation(
		ctx,
		input,
		disableProjectReadonlyOperation,
	);
	await syncSupabaseOperationResult(
		ctx,
		disableProjectReadonlyOperation,
		input,
		result,
	);
	await logSupabaseOperation(ctx, input, disableProjectReadonlyOperation);
	return result;
};

const enableDatabaseWebhooksOperation = getOperation('enableDatabaseWebhooks');
export const enableDatabaseWebhooks: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestSupabaseOperation(
		ctx,
		input,
		enableDatabaseWebhooksOperation,
	);
	await syncSupabaseOperationResult(
		ctx,
		enableDatabaseWebhooksOperation,
		input,
		result,
	);
	await logSupabaseOperation(ctx, input, enableDatabaseWebhooksOperation);
	return result;
};

const runSqlQueryOperation = getOperation('runSqlQuery');
export const runSqlQuery: SupabaseEndpoint = async (ctx, input = {}) => {
	const result = await requestSupabaseOperation(
		ctx,
		input,
		runSqlQueryOperation,
	);
	await syncSupabaseOperationResult(ctx, runSqlQueryOperation, input, result);
	await logSupabaseOperation(ctx, input, runSqlQueryOperation);
	return result;
};

const runReadOnlyQueryOperation = getOperation('runReadOnlyQuery');
export const runReadOnlyQuery: SupabaseEndpoint = async (ctx, input = {}) => {
	const result = await requestSupabaseOperation(
		ctx,
		input,
		runReadOnlyQueryOperation,
	);
	await syncSupabaseOperationResult(
		ctx,
		runReadOnlyQueryOperation,
		input,
		result,
	);
	await logSupabaseOperation(ctx, input, runReadOnlyQueryOperation);
	return result;
};

const generateTypescriptTypesOperation = getOperation(
	'generateTypescriptTypes',
);
export const generateTypescriptTypes: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestSupabaseOperation(
		ctx,
		input,
		generateTypescriptTypesOperation,
	);
	await syncSupabaseOperationResult(
		ctx,
		generateTypescriptTypesOperation,
		input,
		result,
	);
	await logSupabaseOperation(ctx, input, generateTypescriptTypesOperation);
	return result;
};

const getDatabaseMetadataOperation = getOperation('getDatabaseMetadata');
export const getDatabaseMetadata: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestSupabaseOperation(
		ctx,
		input,
		getDatabaseMetadataOperation,
	);
	await syncSupabaseOperationResult(
		ctx,
		getDatabaseMetadataOperation,
		input,
		result,
	);
	await logSupabaseOperation(ctx, input, getDatabaseMetadataOperation);
	return result;
};

const getJitAccessConfigOperation = getOperation('getJitAccessConfig');
export const getJitAccessConfig: SupabaseEndpoint = async (ctx, input = {}) => {
	const result = await requestSupabaseOperation(
		ctx,
		input,
		getJitAccessConfigOperation,
	);
	await syncSupabaseOperationResult(
		ctx,
		getJitAccessConfigOperation,
		input,
		result,
	);
	await logSupabaseOperation(ctx, input, getJitAccessConfigOperation);
	return result;
};

const getTableSchemasOperation = getOperation('getTableSchemas');
export const getTableSchemas: SupabaseEndpoint = async (ctx, input = {}) => {
	const result = await requestSupabaseOperation(
		ctx,
		input,
		getTableSchemasOperation,
	);
	await syncSupabaseOperationResult(
		ctx,
		getTableSchemasOperation,
		input,
		result,
	);
	await logSupabaseOperation(ctx, input, getTableSchemasOperation);
	return result;
};

const getMigrationOperation = getOperation('getMigration');
export const getMigration: SupabaseEndpoint = async (ctx, input = {}) => {
	const result = await requestSupabaseOperation(
		ctx,
		input,
		getMigrationOperation,
	);
	await syncSupabaseOperationResult(ctx, getMigrationOperation, input, result);
	await logSupabaseOperation(ctx, input, getMigrationOperation);
	return result;
};

const getSqlSnippetOperation = getOperation('getSqlSnippet');
export const getSqlSnippet: SupabaseEndpoint = async (ctx, input = {}) => {
	const result = await requestSupabaseOperation(
		ctx,
		input,
		getSqlSnippetOperation,
	);
	await syncSupabaseOperationResult(ctx, getSqlSnippetOperation, input, result);
	await logSupabaseOperation(ctx, input, getSqlSnippetOperation);
	return result;
};

const getProjectPgbouncerConfigOperation = getOperation(
	'getProjectPgbouncerConfig',
);
export const getProjectPgbouncerConfig: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestSupabaseOperation(
		ctx,
		input,
		getProjectPgbouncerConfigOperation,
	);
	await syncSupabaseOperationResult(
		ctx,
		getProjectPgbouncerConfigOperation,
		input,
		result,
	);
	await logSupabaseOperation(ctx, input, getProjectPgbouncerConfigOperation);
	return result;
};

const getProjectSslEnforcementConfigOperation = getOperation(
	'getProjectSslEnforcementConfig',
);
export const getProjectSslEnforcementConfig: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestSupabaseOperation(
		ctx,
		input,
		getProjectSslEnforcementConfigOperation,
	);
	await syncSupabaseOperationResult(
		ctx,
		getProjectSslEnforcementConfigOperation,
		input,
		result,
	);
	await logSupabaseOperation(
		ctx,
		input,
		getProjectSslEnforcementConfigOperation,
	);
	return result;
};

const getProjectSupavisorConfigOperation = getOperation(
	'getProjectSupavisorConfig',
);
export const getProjectSupavisorConfig: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestSupabaseOperation(
		ctx,
		input,
		getProjectSupavisorConfigOperation,
	);
	await syncSupabaseOperationResult(
		ctx,
		getProjectSupavisorConfigOperation,
		input,
		result,
	);
	await logSupabaseOperation(ctx, input, getProjectSupavisorConfigOperation);
	return result;
};

const getProjectPostgresConfigOperation = getOperation(
	'getProjectPostgresConfig',
);
export const getProjectPostgresConfig: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestSupabaseOperation(
		ctx,
		input,
		getProjectPostgresConfigOperation,
	);
	await syncSupabaseOperationResult(
		ctx,
		getProjectPostgresConfigOperation,
		input,
		result,
	);
	await logSupabaseOperation(ctx, input, getProjectPostgresConfigOperation);
	return result;
};

const getProjectReadonlyModeStatusOperation = getOperation(
	'getProjectReadonlyModeStatus',
);
export const getProjectReadonlyModeStatus: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestSupabaseOperation(
		ctx,
		input,
		getProjectReadonlyModeStatusOperation,
	);
	await syncSupabaseOperationResult(
		ctx,
		getProjectReadonlyModeStatusOperation,
		input,
		result,
	);
	await logSupabaseOperation(ctx, input, getProjectReadonlyModeStatusOperation);
	return result;
};

const listTablesOperation = getOperation('listTables');
export const listTables: SupabaseEndpoint = async (ctx, input = {}) => {
	const result = await requestSupabaseOperation(
		ctx,
		input,
		listTablesOperation,
	);
	await syncSupabaseOperationResult(ctx, listTablesOperation, input, result);
	await logSupabaseOperation(ctx, input, listTablesOperation);
	return result;
};

const listSqlSnippetsOperation = getOperation('listSqlSnippets');
export const listSqlSnippets: SupabaseEndpoint = async (ctx, input = {}) => {
	const result = await requestSupabaseOperation(
		ctx,
		input,
		listSqlSnippetsOperation,
	);
	await syncSupabaseOperationResult(
		ctx,
		listSqlSnippetsOperation,
		input,
		result,
	);
	await logSupabaseOperation(ctx, input, listSqlSnippetsOperation);
	return result;
};

const listMigrationHistoryOperation = getOperation('listMigrationHistory');
export const listMigrationHistory: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestSupabaseOperation(
		ctx,
		input,
		listMigrationHistoryOperation,
	);
	await syncSupabaseOperationResult(
		ctx,
		listMigrationHistoryOperation,
		input,
		result,
	);
	await logSupabaseOperation(ctx, input, listMigrationHistoryOperation);
	return result;
};

const listBackupsOperation = getOperation('listBackups');
export const listBackups: SupabaseEndpoint = async (ctx, input = {}) => {
	const result = await requestSupabaseOperation(
		ctx,
		input,
		listBackupsOperation,
	);
	await syncSupabaseOperationResult(ctx, listBackupsOperation, input, result);
	await logSupabaseOperation(ctx, input, listBackupsOperation);
	return result;
};

const patchMigrationOperation = getOperation('patchMigration');
export const patchMigration: SupabaseEndpoint = async (ctx, input = {}) => {
	const result = await requestSupabaseOperation(
		ctx,
		input,
		patchMigrationOperation,
	);
	await syncSupabaseOperationResult(
		ctx,
		patchMigrationOperation,
		input,
		result,
	);
	await logSupabaseOperation(ctx, input, patchMigrationOperation);
	return result;
};

const removeReadReplicaOperation = getOperation('removeReadReplica');
export const removeReadReplica: SupabaseEndpoint = async (ctx, input = {}) => {
	const result = await requestSupabaseOperation(
		ctx,
		input,
		removeReadReplicaOperation,
	);
	await syncSupabaseOperationResult(
		ctx,
		removeReadReplicaOperation,
		input,
		result,
	);
	await logSupabaseOperation(ctx, input, removeReadReplicaOperation);
	return result;
};

const restorePitrBackupOperation = getOperation('restorePitrBackup');
export const restorePitrBackup: SupabaseEndpoint = async (ctx, input = {}) => {
	const result = await requestSupabaseOperation(
		ctx,
		input,
		restorePitrBackupOperation,
	);
	await syncSupabaseOperationResult(
		ctx,
		restorePitrBackupOperation,
		input,
		result,
	);
	await logSupabaseOperation(ctx, input, restorePitrBackupOperation);
	return result;
};

const selectFromTableOperation = getOperation('selectFromTable');
export const selectFromTable: SupabaseEndpoint = async (ctx, input = {}) => {
	const result = await requestSupabaseOperation(
		ctx,
		input,
		selectFromTableOperation,
	);
	await syncSupabaseOperationResult(
		ctx,
		selectFromTableOperation,
		input,
		result,
	);
	await logSupabaseOperation(ctx, input, selectFromTableOperation);
	return result;
};

const createReadReplicaOperation = getOperation('createReadReplica');
export const createReadReplica: SupabaseEndpoint = async (ctx, input = {}) => {
	const result = await requestSupabaseOperation(
		ctx,
		input,
		createReadReplicaOperation,
	);
	await syncSupabaseOperationResult(
		ctx,
		createReadReplicaOperation,
		input,
		result,
	);
	await logSupabaseOperation(ctx, input, createReadReplicaOperation);
	return result;
};

const updateJitAccessConfigOperation = getOperation('updateJitAccessConfig');
export const updateJitAccessConfig: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestSupabaseOperation(
		ctx,
		input,
		updateJitAccessConfigOperation,
	);
	await syncSupabaseOperationResult(
		ctx,
		updateJitAccessConfigOperation,
		input,
		result,
	);
	await logSupabaseOperation(ctx, input, updateJitAccessConfigOperation);
	return result;
};

const updateSslEnforcementConfigOperation = getOperation(
	'updateSslEnforcementConfig',
);
export const updateSslEnforcementConfig: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestSupabaseOperation(
		ctx,
		input,
		updateSslEnforcementConfigOperation,
	);
	await syncSupabaseOperationResult(
		ctx,
		updateSslEnforcementConfigOperation,
		input,
		result,
	);
	await logSupabaseOperation(ctx, input, updateSslEnforcementConfigOperation);
	return result;
};

const updateDatabasePasswordOperation = getOperation('updateDatabasePassword');
export const updateDatabasePassword: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestSupabaseOperation(
		ctx,
		input,
		updateDatabasePasswordOperation,
	);
	await syncSupabaseOperationResult(
		ctx,
		updateDatabasePasswordOperation,
		input,
		result,
	);
	await logSupabaseOperation(ctx, input, updateDatabasePasswordOperation);
	return result;
};

const updateProjectSupavisorConfigOperation = getOperation(
	'updateProjectSupavisorConfig',
);
export const updateProjectSupavisorConfig: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestSupabaseOperation(
		ctx,
		input,
		updateProjectSupavisorConfigOperation,
	);
	await syncSupabaseOperationResult(
		ctx,
		updateProjectSupavisorConfigOperation,
		input,
		result,
	);
	await logSupabaseOperation(ctx, input, updateProjectSupavisorConfigOperation);
	return result;
};

const updateProjectPostgresConfigOperation = getOperation(
	'updateProjectPostgresConfig',
);
export const updateProjectPostgresConfig: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestSupabaseOperation(
		ctx,
		input,
		updateProjectPostgresConfigOperation,
	);
	await syncSupabaseOperationResult(
		ctx,
		updateProjectPostgresConfigOperation,
		input,
		result,
	);
	await logSupabaseOperation(ctx, input, updateProjectPostgresConfigOperation);
	return result;
};

const upsertMigrationOperation = getOperation('upsertMigration');
export const upsertMigration: SupabaseEndpoint = async (ctx, input = {}) => {
	const result = await requestSupabaseOperation(
		ctx,
		input,
		upsertMigrationOperation,
	);
	await syncSupabaseOperationResult(
		ctx,
		upsertMigrationOperation,
		input,
		result,
	);
	await logSupabaseOperation(ctx, input, upsertMigrationOperation);
	return result;
};

export const DatabaseEndpoints = {
	applyMigration,
	createLoginRole,
	deleteLoginRoles,
	disableProjectReadonly,
	enableDatabaseWebhooks,
	runSqlQuery,
	runReadOnlyQuery,
	generateTypescriptTypes,
	getDatabaseMetadata,
	getJitAccessConfig,
	getTableSchemas,
	getMigration,
	getSqlSnippet,
	getProjectPgbouncerConfig,
	getProjectSslEnforcementConfig,
	getProjectSupavisorConfig,
	getProjectPostgresConfig,
	getProjectReadonlyModeStatus,
	listTables,
	listSqlSnippets,
	listMigrationHistory,
	listBackups,
	patchMigration,
	removeReadReplica,
	restorePitrBackup,
	selectFromTable,
	createReadReplica,
	updateJitAccessConfig,
	updateSslEnforcementConfig,
	updateDatabasePassword,
	updateProjectSupavisorConfig,
	updateProjectPostgresConfig,
	upsertMigration,
} as const;
