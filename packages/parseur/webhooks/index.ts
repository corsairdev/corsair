import {
	documentProcessed,
	processFailed,
	tableItemProcessed,
} from './documents';

export const DocumentWebhooks = {
	documentProcessed,
	tableItemProcessed,
	processFailed,
};

export * from './tenant-matcher';
export * from './types';
