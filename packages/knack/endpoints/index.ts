import { applicationsGet, objectsGet, objectsList } from './applications';
import { create, get, list, remove, update } from './records';

export const Applications = {
	get: applicationsGet,
};

export const Objects = {
	list: objectsList,
	get: objectsGet,
};

export const Records = {
	list,
	get,
	create,
	update,
	// Registered under `delete`; the function is `remove` because `delete` is
	// reserved in TypeScript.
	delete: remove,
};

/** One flat map per group, in the shape `index.ts` registers. */
export const knackEndpoints = {
	applications: Applications,
	objects: Objects,
	records: Records,
} as const;

export * from './types';
