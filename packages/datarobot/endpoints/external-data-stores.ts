import { logEventFromContext } from 'corsair/core';
import type { DatarobotEndpoints } from '..';
import { makeDatarobotRequest } from '../client';
import { buildDatarobotPath, splitDatarobotInput } from '../utils';
import { DatarobotEndpointOutputSchemas } from './types';

/** Update the data store's access controls by data store ID */
/** Official: PATCH /api/v2/externalDataStores/{dataStoreId}/accessControl/ (`externalDataStoresAccessControl_patchMany`) */
export const externalDataStoresAccessControlPatchMany: DatarobotEndpoints['externalDataStoresAccessControlPatchMany'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/externalDataStores/{dataStoreId}/accessControl/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['dataStoreId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.externalDataStoresAccessControlPatchMany.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.externalDataStores.externalDataStoresAccessControlPatchMany',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieves a data store's data columns by data store ID */
/** Official: POST /api/v2/externalDataStores/{dataStoreId}/columns/ (`externalDataStoresColumns_create`) */
export const externalDataStoresColumnsCreate: DatarobotEndpoints['externalDataStoresColumnsCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/externalDataStores/{dataStoreId}/columns/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['dataStoreId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.externalDataStoresColumnsCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.externalDataStores.externalDataStoresColumnsCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieves a data store's column metadata by data store ID */
/** Official: POST /api/v2/externalDataStores/{dataStoreId}/columnsInfo/ (`externalDataStoresColumnsInfo_create`) */
export const externalDataStoresColumnsInfoCreate: DatarobotEndpoints['externalDataStoresColumnsInfoCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/externalDataStores/{dataStoreId}/columnsInfo/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['dataStoreId'],
			['offset', 'limit', 'types', 'orderBy'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.externalDataStoresColumnsInfoCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.externalDataStores.externalDataStoresColumnsInfoCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create a data store. */
/** Official: POST /api/v2/externalDataStores/ (`externalDataStores_create`) */
export const externalDataStoresCreate: DatarobotEndpoints['externalDataStoresCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/externalDataStores/', input);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.externalDataStoresCreate.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.externalDataStores.externalDataStoresCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List credentials associated by data store ID */
/** Official: GET /api/v2/externalDataStores/{dataStoreId}/credentials/ (`externalDataStoresCredentials_list`) */
export const externalDataStoresCredentialsList: DatarobotEndpoints['externalDataStoresCredentialsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/externalDataStores/{dataStoreId}/credentials/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['dataStoreId'],
			['offset', 'limit', 'types', 'orderBy'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.externalDataStoresCredentialsList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.externalDataStores.externalDataStoresCredentialsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Delete the data store by data store ID */
/** Official: DELETE /api/v2/externalDataStores/{dataStoreId}/ (`externalDataStores_delete`) */
export const externalDataStoresDelete: DatarobotEndpoints['externalDataStoresDelete'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/externalDataStores/{dataStoreId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['dataStoreId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'DELETE',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.externalDataStoresDelete.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.externalDataStores.externalDataStoresDelete',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List data stores. */
/** Official: GET /api/v2/externalDataStores/ (`externalDataStores_list`) */
export const externalDataStoresList: DatarobotEndpoints['externalDataStoresList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/externalDataStores/', input);
		const { query } = splitDatarobotInput(
			input,
			[],
			[
				'offset',
				'limit',
				'type',
				'databaseType',
				'connectorType',
				'showHidden',
				'name',
				'substituteUrlParameters',
				'dataType',
			],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.externalDataStoresList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.externalDataStores.externalDataStoresList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Update a data store configuration by data store ID */
/** Official: PATCH /api/v2/externalDataStores/{dataStoreId}/ (`externalDataStores_patch`) */
export const externalDataStoresPatch: DatarobotEndpoints['externalDataStoresPatch'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/externalDataStores/{dataStoreId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['dataStoreId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.externalDataStoresPatch.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.externalDataStores.externalDataStoresPatch',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Describe data store permissions by data store ID */
/** Official: GET /api/v2/externalDataStores/{dataStoreId}/permissions/ (`externalDataStoresPermissions_list`) */
export const externalDataStoresPermissionsList: DatarobotEndpoints['externalDataStoresPermissionsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/externalDataStores/{dataStoreId}/permissions/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['dataStoreId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.externalDataStoresPermissionsList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.externalDataStores.externalDataStoresPermissionsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Data store details by data store ID */
/** Official: GET /api/v2/externalDataStores/{dataStoreId}/ (`externalDataStores_retrieve`) */
export const externalDataStoresRetrieve: DatarobotEndpoints['externalDataStoresRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/externalDataStores/{dataStoreId}/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['dataStoreId'],
			['substituteUrlParameters'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.externalDataStoresRetrieve.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.externalDataStores.externalDataStoresRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieves a data store's data schemas by data store ID */
/** Official: POST /api/v2/externalDataStores/{dataStoreId}/schemas/ (`externalDataStoresSchemas_create`) */
export const externalDataStoresSchemasCreate: DatarobotEndpoints['externalDataStoresSchemasCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/externalDataStores/{dataStoreId}/schemas/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['dataStoreId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.externalDataStoresSchemasCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.externalDataStores.externalDataStoresSchemasCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Get the data store's access control list by data store ID */
/** Official: GET /api/v2/externalDataStores/{dataStoreId}/sharedRoles/ (`externalDataStoresSharedRoles_list`) */
export const externalDataStoresSharedRolesList: DatarobotEndpoints['externalDataStoresSharedRolesList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/externalDataStores/{dataStoreId}/sharedRoles/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['dataStoreId'],
			['id', 'offset', 'limit', 'name', 'shareRecipientType'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.externalDataStoresSharedRolesList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.externalDataStores.externalDataStoresSharedRolesList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Modify data store shared roles by data store ID */
/** Official: PATCH /api/v2/externalDataStores/{dataStoreId}/sharedRoles/ (`externalDataStoresSharedRoles_patchMany`) */
export const externalDataStoresSharedRolesPatchMany: DatarobotEndpoints['externalDataStoresSharedRolesPatchMany'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/externalDataStores/{dataStoreId}/sharedRoles/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['dataStoreId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.externalDataStoresSharedRolesPatchMany.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.externalDataStores.externalDataStoresSharedRolesPatchMany',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Start a job to create a standard user-defined function of the given type by data store ID */
/** Official: POST /api/v2/externalDataStores/{dataStoreId}/standardUserDefinedFunctions/ (`externalDataStoresStandardUserDefinedFunctions_create`) */
export const externalDataStoresStandardUserDefinedFunctionsCreate: DatarobotEndpoints['externalDataStoresStandardUserDefinedFunctionsCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/externalDataStores/{dataStoreId}/standardUserDefinedFunctions/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['dataStoreId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.externalDataStoresStandardUserDefinedFunctionsCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.externalDataStores.externalDataStoresStandardUserDefinedFunctionsCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Start the job that detects standard user-defined functions for the given data store, credentials by data store ID */
/** Official: POST /api/v2/externalDataStores/{dataStoreId}/standardUserDefinedFunctions/detect/ (`externalDataStoresStandardUserDefinedFunctionsDetect_create`) */
export const externalDataStoresStandardUserDefinedFunctionsDetectCreate: DatarobotEndpoints['externalDataStoresStandardUserDefinedFunctionsDetectCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/externalDataStores/{dataStoreId}/standardUserDefinedFunctions/detect/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['dataStoreId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.externalDataStoresStandardUserDefinedFunctionsDetectCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.externalDataStores.externalDataStoresStandardUserDefinedFunctionsDetectCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve detected standard user-defined functions by data store ID */
/** Official: GET /api/v2/externalDataStores/{dataStoreId}/standardUserDefinedFunctions/ (`externalDataStoresStandardUserDefinedFunctions_list`) */
export const externalDataStoresStandardUserDefinedFunctionsList: DatarobotEndpoints['externalDataStoresStandardUserDefinedFunctionsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/externalDataStores/{dataStoreId}/standardUserDefinedFunctions/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['dataStoreId'],
			['credentialId', 'functionType', 'schema', 'functionName'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.externalDataStoresStandardUserDefinedFunctionsList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.externalDataStores.externalDataStoresStandardUserDefinedFunctionsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieves a data store's database tables (including views) by data store ID */
/** Official: POST /api/v2/externalDataStores/{dataStoreId}/tables/ (`externalDataStoresTables_create`) */
export const externalDataStoresTablesCreate: DatarobotEndpoints['externalDataStoresTablesCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/externalDataStores/{dataStoreId}/tables/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['dataStoreId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.externalDataStoresTablesCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.externalDataStores.externalDataStoresTablesCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Test data store connection by data store ID */
/** Official: POST /api/v2/externalDataStores/{dataStoreId}/test/ (`externalDataStoresTest_create`) */
export const externalDataStoresTestCreate: DatarobotEndpoints['externalDataStoresTestCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/externalDataStores/{dataStoreId}/test/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['dataStoreId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.externalDataStoresTestCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.externalDataStores.externalDataStoresTestCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Verify a SQL query by data store ID */
/** Official: POST /api/v2/externalDataStores/{dataStoreId}/verifySQL/ (`externalDataStoresVerifySQL_create`) */
export const externalDataStoresVerifySQLCreate: DatarobotEndpoints['externalDataStoresVerifySQLCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/externalDataStores/{dataStoreId}/verifySQL/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['dataStoreId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.externalDataStoresVerifySQLCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.externalDataStores.externalDataStoresVerifySQLCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};
