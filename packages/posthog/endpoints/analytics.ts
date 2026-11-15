import { defineApiEndpoint, PROJECT, pathId } from './api';

// PostHog deletes insights and dashboards by flagging them `deleted`; they
// can be restored from PostHog afterwards.

export const insightsList = defineApiEndpoint<'insightsList'>(
	'insightsList',
	'posthog.insights.list',
	(input) => ({ path: `${PROJECT}/insights/`, query: input, log: input }),
);

export const insightsGet = defineApiEndpoint<'insightsGet'>(
	'insightsGet',
	'posthog.insights.get',
	(input) => ({
		path: `${PROJECT}/insights/${pathId(input.id)}/`,
		query: { refresh: input.refresh },
		log: { id: input.id },
	}),
);

export const insightsCreate = defineApiEndpoint<'insightsCreate'>(
	'insightsCreate',
	'posthog.insights.create',
	(input) => ({
		path: `${PROJECT}/insights/`,
		method: 'POST',
		body: { ...input, saved: true },
		log: { name: input.name, kind: input.query.kind },
	}),
);

export const insightsUpdate = defineApiEndpoint<'insightsUpdate'>(
	'insightsUpdate',
	'posthog.insights.update',
	({ id, ...changes }) => ({
		path: `${PROJECT}/insights/${pathId(id)}/`,
		method: 'PATCH',
		body: changes,
		log: { id, fields: Object.keys(changes) },
	}),
);

export const insightsDelete = defineApiEndpoint<'insightsDelete'>(
	'insightsDelete',
	'posthog.insights.delete',
	({ id }) => ({
		path: `${PROJECT}/insights/${pathId(id)}/`,
		method: 'PATCH',
		body: { deleted: true },
		log: { id },
	}),
);

export const dashboardsList = defineApiEndpoint<'dashboardsList'>(
	'dashboardsList',
	'posthog.dashboards.list',
	(input) => ({ path: `${PROJECT}/dashboards/`, query: input, log: input }),
);

export const dashboardsGet = defineApiEndpoint<'dashboardsGet'>(
	'dashboardsGet',
	'posthog.dashboards.get',
	(input) => ({
		path: `${PROJECT}/dashboards/${pathId(input.id)}/`,
		log: { id: input.id },
	}),
);

export const dashboardsCreate = defineApiEndpoint<'dashboardsCreate'>(
	'dashboardsCreate',
	'posthog.dashboards.create',
	(input) => ({
		path: `${PROJECT}/dashboards/`,
		method: 'POST',
		body: input,
		log: { name: input.name },
	}),
);

export const dashboardsUpdate = defineApiEndpoint<'dashboardsUpdate'>(
	'dashboardsUpdate',
	'posthog.dashboards.update',
	({ id, ...changes }) => ({
		path: `${PROJECT}/dashboards/${pathId(id)}/`,
		method: 'PATCH',
		body: changes,
		log: { id, fields: Object.keys(changes) },
	}),
);

export const dashboardsDelete = defineApiEndpoint<'dashboardsDelete'>(
	'dashboardsDelete',
	'posthog.dashboards.delete',
	({ id, delete_insights }) => ({
		path: `${PROJECT}/dashboards/${pathId(id)}/`,
		method: 'PATCH',
		body: { deleted: true, delete_insights },
		log: { id, delete_insights },
	}),
);
