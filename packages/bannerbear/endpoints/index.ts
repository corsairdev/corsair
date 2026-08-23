import { getAccountInfo, getAuth } from './account';
import * as Animations from './animations';
import * as Collections from './collections';
import * as Images from './images';
import { getFonts, joinPdfs, listEffects } from './misc';
import * as Projects from './projects';
import * as Screenshots from './screenshots';
import { createSignedBase, getSignedBases } from './signed-urls';
import * as TemplateSets from './template-sets';
import * as Templates from './templates';
import { createVideoTemplate, listVideos, listVideoTemplates } from './videos';
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

export { Projects };
export { Templates };
export { TemplateSets };
export { Images };

export const Videos = {
	listVideos,
	listVideoTemplates,
	createVideoTemplate,
};

export { Animations };
export { Collections };
export { Screenshots };

export const SignedUrls = {
	getSignedBases,
	createSignedBase,
};

export { WebhooksApi };

export const Misc = {
	getFonts,
	listEffects,
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
