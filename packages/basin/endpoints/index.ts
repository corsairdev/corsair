import * as DomainsEndpoints from './domains';
import * as FormViewsEndpoints from './form-views';
import * as FormsEndpoints from './forms';
import * as ProjectsEndpoints from './projects';
import * as SubmissionsEndpoints from './submissions';
import * as WebhooksEndpoints from './webhooks';

export const Forms = {
	list: FormsEndpoints.list,
	get: FormsEndpoints.get,
	create: FormsEndpoints.create,
	update: FormsEndpoints.update,
	delete: FormsEndpoints.deleteForm,
};

export const Submissions = {
	list: SubmissionsEndpoints.list,
	get: SubmissionsEndpoints.get,
	delete: SubmissionsEndpoints.deleteSubmission,
	update: SubmissionsEndpoints.update,
	markSpam: SubmissionsEndpoints.markSpam,
	markHam: SubmissionsEndpoints.markHam,
	refireWebhooks: SubmissionsEndpoints.refireWebhooks,
	refireWebhooksBulk: SubmissionsEndpoints.refireWebhooksBulk,
};

export const Projects = {
	list: ProjectsEndpoints.list,
	get: ProjectsEndpoints.get,
	create: ProjectsEndpoints.create,
	update: ProjectsEndpoints.update,
	delete: ProjectsEndpoints.deleteProject,
};

export const Webhooks = {
	list: WebhooksEndpoints.list,
	get: WebhooksEndpoints.get,
	create: WebhooksEndpoints.create,
	update: WebhooksEndpoints.update,
	delete: WebhooksEndpoints.deleteWebhook,
};

export const FormViews = {
	list: FormViewsEndpoints.list,
	get: FormViewsEndpoints.get,
};

export const Domains = {
	list: DomainsEndpoints.list,
};

export * from './types';
