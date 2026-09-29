import { create, deleteForm, getAll, getById, getResponses } from './forms';

export const Forms = {
	create,
	delete: deleteForm,
	get: getById,
	list: getAll,
	responses: getResponses,
};

export * from './types';
