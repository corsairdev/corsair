import type { SupabaseEndpoint } from './factory';
import { runSupabaseOperation } from './factory';
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
	return runSupabaseOperation(ctx, input, applyMigrationOperation);
};

const createLoginRoleOperation = getOperation('createLoginRole');
export const createLoginRole: SupabaseEndpoint = async (ctx, input = {}) => {
	return runSupabaseOperation(ctx, input, createLoginRoleOperation);
};

const deleteLoginRolesOperation = getOperation('deleteLoginRoles');
export const deleteLoginRoles: SupabaseEndpoint = async (ctx, input = {}) => {
	return runSupabaseOperation(ctx, input, deleteLoginRolesOperation);
};

const disableProjectReadonlyOperation = getOperation('disableProjectReadonly');
export const disableProjectReadonly: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	return runSupabaseOperation(ctx, input, disableProjectReadonlyOperation);
};

const enableDatabaseWebhooksOperation = getOperation('enableDatabaseWebhooks');
export const enableDatabaseWebhooks: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	return runSupabaseOperation(ctx, input, enableDatabaseWebhooksOperation);
};

const runSqlQueryOperation = getOperation('runSqlQuery');
export const runSqlQuery: SupabaseEndpoint = async (ctx, input = {}) => {
	return runSupabaseOperation(ctx, input, runSqlQueryOperation);
};

const runReadOnlyQueryOperation = getOperation('runReadOnlyQuery');
export const runReadOnlyQuery: SupabaseEndpoint = async (ctx, input = {}) => {
	return runSupabaseOperation(ctx, input, runReadOnlyQueryOperation);
};

const generateTypescriptTypesOperation = getOperation(
	'generateTypescriptTypes',
);
export const generateTypescriptTypes: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	return runSupabaseOperation(ctx, input, generateTypescriptTypesOperation);
};

const getDatabaseMetadataOperation = getOperation('getDatabaseMetadata');
export const getDatabaseMetadata: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	return runSupabaseOperation(ctx, input, getDatabaseMetadataOperation);
};

const getJitAccessConfigOperation = getOperation('getJitAccessConfig');
export const getJitAccessConfig: SupabaseEndpoint = async (ctx, input = {}) => {
	return runSupabaseOperation(ctx, input, getJitAccessConfigOperation);
};

const getTableSchemasOperation = getOperation('getTableSchemas');
export const getTableSchemas: SupabaseEndpoint = async (ctx, input = {}) => {
	return runSupabaseOperation(ctx, input, getTableSchemasOperation);
};

const getMigrationOperation = getOperation('getMigration');
export const getMigration: SupabaseEndpoint = async (ctx, input = {}) => {
	return runSupabaseOperation(ctx, input, getMigrationOperation);
};

const getSqlSnippetOperation = getOperation('getSqlSnippet');
export const getSqlSnippet: SupabaseEndpoint = async (ctx, input = {}) => {
	return runSupabaseOperation(ctx, input, getSqlSnippetOperation);
};

const getProjectPgbouncerConfigOperation = getOperation(
	'getProjectPgbouncerConfig',
);
export const getProjectPgbouncerConfig: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	return runSupabaseOperation(ctx, input, getProjectPgbouncerConfigOperation);
};

const getProjectSslEnforcementConfigOperation = getOperation(
	'getProjectSslEnforcementConfig',
);
export const getProjectSslEnforcementConfig: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	return runSupabaseOperation(
		ctx,
		input,
		getProjectSslEnforcementConfigOperation,
	);
};

const getProjectSupavisorConfigOperation = getOperation(
	'getProjectSupavisorConfig',
);
export const getProjectSupavisorConfig: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	return runSupabaseOperation(ctx, input, getProjectSupavisorConfigOperation);
};

const getProjectPostgresConfigOperation = getOperation(
	'getProjectPostgresConfig',
);
export const getProjectPostgresConfig: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	return runSupabaseOperation(ctx, input, getProjectPostgresConfigOperation);
};

const getProjectReadonlyModeStatusOperation = getOperation(
	'getProjectReadonlyModeStatus',
);
export const getProjectReadonlyModeStatus: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	return runSupabaseOperation(
		ctx,
		input,
		getProjectReadonlyModeStatusOperation,
	);
};

const listTablesOperation = getOperation('listTables');
export const listTables: SupabaseEndpoint = async (ctx, input = {}) => {
	return runSupabaseOperation(ctx, input, listTablesOperation);
};

const listSqlSnippetsOperation = getOperation('listSqlSnippets');
export const listSqlSnippets: SupabaseEndpoint = async (ctx, input = {}) => {
	return runSupabaseOperation(ctx, input, listSqlSnippetsOperation);
};

const listMigrationHistoryOperation = getOperation('listMigrationHistory');
export const listMigrationHistory: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	return runSupabaseOperation(ctx, input, listMigrationHistoryOperation);
};

const listBackupsOperation = getOperation('listBackups');
export const listBackups: SupabaseEndpoint = async (ctx, input = {}) => {
	return runSupabaseOperation(ctx, input, listBackupsOperation);
};

const patchMigrationOperation = getOperation('patchMigration');
export const patchMigration: SupabaseEndpoint = async (ctx, input = {}) => {
	return runSupabaseOperation(ctx, input, patchMigrationOperation);
};

const removeReadReplicaOperation = getOperation('removeReadReplica');
export const removeReadReplica: SupabaseEndpoint = async (ctx, input = {}) => {
	return runSupabaseOperation(ctx, input, removeReadReplicaOperation);
};

const restorePitrBackupOperation = getOperation('restorePitrBackup');
export const restorePitrBackup: SupabaseEndpoint = async (ctx, input = {}) => {
	return runSupabaseOperation(ctx, input, restorePitrBackupOperation);
};

const selectFromTableOperation = getOperation('selectFromTable');
export const selectFromTable: SupabaseEndpoint = async (ctx, input = {}) => {
	return runSupabaseOperation(ctx, input, selectFromTableOperation);
};

const createReadReplicaOperation = getOperation('createReadReplica');
export const createReadReplica: SupabaseEndpoint = async (ctx, input = {}) => {
	return runSupabaseOperation(ctx, input, createReadReplicaOperation);
};

const updateJitAccessConfigOperation = getOperation('updateJitAccessConfig');
export const updateJitAccessConfig: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	return runSupabaseOperation(ctx, input, updateJitAccessConfigOperation);
};

const updateSslEnforcementConfigOperation = getOperation(
	'updateSslEnforcementConfig',
);
export const updateSslEnforcementConfig: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	return runSupabaseOperation(ctx, input, updateSslEnforcementConfigOperation);
};

const updateDatabasePasswordOperation = getOperation('updateDatabasePassword');
export const updateDatabasePassword: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	return runSupabaseOperation(ctx, input, updateDatabasePasswordOperation);
};

const updateProjectSupavisorConfigOperation = getOperation(
	'updateProjectSupavisorConfig',
);
export const updateProjectSupavisorConfig: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	return runSupabaseOperation(
		ctx,
		input,
		updateProjectSupavisorConfigOperation,
	);
};

const updateProjectPostgresConfigOperation = getOperation(
	'updateProjectPostgresConfig',
);
export const updateProjectPostgresConfig: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	return runSupabaseOperation(ctx, input, updateProjectPostgresConfigOperation);
};

const upsertMigrationOperation = getOperation('upsertMigration');
export const upsertMigration: SupabaseEndpoint = async (ctx, input = {}) => {
	return runSupabaseOperation(ctx, input, upsertMigrationOperation);
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
