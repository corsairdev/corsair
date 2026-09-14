import { executionCompleted } from './executionCompleted';
import { executionFailed } from './executionFailed';
import { fileReady } from './fileReady';

export const ExecutionWebhooks = {
	completed: executionCompleted,
	failed: executionFailed,
};

export const FileWebhooks = {
	ready: fileReady,
};

export * from './types';
export * from './tenant-matcher';
export * from './oauth-tenant-link';
