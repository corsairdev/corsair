import { docsetCreate, docsetDelete, docsetGet } from './docsets';
import {
	documentGet,
	documentGetBinary,
	documentPartition,
	documentSubmitAsyncAdd,
} from './documents';
import { queryGeneratePlan } from './queries';
import { asyncTasksList } from './tasks';

export const Aryn = {
	docsetCreate,
	docsetGet,
	docsetDelete,
	documentGet,
	documentGetBinary,
	documentPartition,
	documentSubmitAsyncAdd,
	queryGeneratePlan,
	asyncTasksList,
};

export * from './types';
