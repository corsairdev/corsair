import { getAccountInfo, getAuth } from './account';
import * as AnimationTemplates from './animation-templates';
import * as Animations from './animations';
import * as Images from './images';
import { joinPdfs } from './misc';
import * as InstantUrlHandlers from './signed-urls';
import * as Templates from './templates';
import * as WebhooksApi from './webhooks-api';
import {
	createWorkflowRun,
	getWorkflow,
	getWorkflowRun,
	listWorkflowRuns,
	listWorkflows,
} from './workflows';

export const Account = {
	getAccountInfo,
	getAuth,
};

export { Templates };
export { Images };
export { Animations };
export { AnimationTemplates };

export const InstantUrls = {
	list: InstantUrlHandlers.list,
	create: InstantUrlHandlers.create,
};

export { WebhooksApi };

export const Misc = {
	joinPdfs,
};

export const Workflows = {
	listWorkflows,
	getWorkflow,
	createWorkflowRun,
	getWorkflowRun,
	listWorkflowRuns,
};

export * from './types';
