import type { FilloutFormsEndpoints } from '../index';
import type { FilloutFormsEndpointOutputs } from './types';

const UNSUPPORTED_MESSAGE =
	'This operation is not supported by the Fillout REST API. Fillout does not expose database, table, or field management endpoints. These are Zite features.';

export const getDatabases: FilloutFormsEndpoints['getDatabases'] = async () => {
	return { supported: false as const, message: UNSUPPORTED_MESSAGE };
};

export const getDatabaseById: FilloutFormsEndpoints['getDatabaseById'] =
	async () => {
		return { supported: false as const, message: UNSUPPORTED_MESSAGE };
	};

export const createDatabase: FilloutFormsEndpoints['createDatabase'] =
	async () => {
		return { supported: false as const, message: UNSUPPORTED_MESSAGE };
	};

export const deleteDatabase: FilloutFormsEndpoints['deleteDatabase'] =
	async () => {
		return { supported: false as const, message: UNSUPPORTED_MESSAGE };
	};

export const createTable: FilloutFormsEndpoints['createTable'] = async () => {
	return { supported: false as const, message: UNSUPPORTED_MESSAGE };
};

export const updateTable: FilloutFormsEndpoints['updateTable'] = async () => {
	return { supported: false as const, message: UNSUPPORTED_MESSAGE };
};

export const deleteTable: FilloutFormsEndpoints['deleteTable'] = async () => {
	return { supported: false as const, message: UNSUPPORTED_MESSAGE };
};

export const createField: FilloutFormsEndpoints['createField'] = async () => {
	return { supported: false as const, message: UNSUPPORTED_MESSAGE };
};

export const updateField: FilloutFormsEndpoints['updateField'] = async () => {
	return { supported: false as const, message: UNSUPPORTED_MESSAGE };
};

export const deleteField: FilloutFormsEndpoints['deleteField'] = async () => {
	return { supported: false as const, message: UNSUPPORTED_MESSAGE };
};

export const updateSubmission: FilloutFormsEndpoints['updateSubmission'] =
	async () => {
		return { supported: false as const, message: UNSUPPORTED_MESSAGE };
	};

export const listDatabaseWebhooks: FilloutFormsEndpoints['listDatabaseWebhooks'] =
	async () => {
		return { supported: false as const, message: UNSUPPORTED_MESSAGE };
	};

export const deleteDatabaseWebhook: FilloutFormsEndpoints['deleteDatabaseWebhook'] =
	async () => {
		return { supported: false as const, message: UNSUPPORTED_MESSAGE };
	};
