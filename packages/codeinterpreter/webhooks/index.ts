import { executionCompleted } from './execution-completed';
import { executionFailed } from './execution-failed';
import { fileReady } from './file-ready';

export const ExecutionWebhooks = {
	completed: executionCompleted,
	failed: executionFailed,
};

export const FileWebhooks = {
	ready: fileReady,
};

export * from './oauth-tenant-link';
export * from './tenant-matcher';
export * from './types';
