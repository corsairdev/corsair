import { getMany, getSchema } from './bases';
import {
	create,
	createOrUpdate,
	deleteRecord,
	get,
	search,
	update,
} from './records';
import { getPayloads } from './webhook-payloads';

export const Bases = {
	getMany,
	getSchema,
};

export const Records = {
	create,
	createOrUpdate,
	delete: deleteRecord,
	get,
	search,
	update,
};

export const Webhooks = {
	getPayloads,
};

export * from './types';
