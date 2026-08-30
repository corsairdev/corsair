import {
	bulkCreate,
	create,
	get,
	list,
	remove,
	replace,
	update,
} from './things';
import { run } from './workflows';

/** Data API operations for Bubble things (database records). */
export const Things = {
	get,
	list,
	create,
	bulkCreate,
	update,
	replace,
	delete: remove,
};

/** Workflow API operations. */
export const Workflows = {
	run,
};

export * from './types';
