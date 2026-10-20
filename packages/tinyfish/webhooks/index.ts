import { runCancelled, runCompleted, runFailed } from './run-lifecycle';

export const TinyFishRunWebhooks = {
	runCompleted,
	runFailed,
	runCancelled,
};

export * from './types';
