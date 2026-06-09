import { deploymentHandlers } from './deployments';
import { projectHandlers } from './projects';

export const WebhookHandlers = {
	...deploymentHandlers,
	...projectHandlers,
};

export * from './types';
