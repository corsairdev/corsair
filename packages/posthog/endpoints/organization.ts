import { defineApiEndpoint, PROJECT, pathId } from './api';

// `@current` is PostHog's alias for the key's current organization.
function orgPath(id?: string): string {
	return `/api/organizations/${id ? pathId(id) : '@current'}`;
}

export const organizationsList = defineApiEndpoint<'organizationsList'>(
	'organizationsList',
	'posthog.organizations.list',
	(input) => ({ path: '/api/organizations/', query: input, log: input }),
);

export const organizationsGet = defineApiEndpoint<'organizationsGet'>(
	'organizationsGet',
	'posthog.organizations.get',
	(input) => ({ path: `${orgPath(input.id)}/`, log: input }),
);

export const projectsList = defineApiEndpoint<'projectsList'>(
	'projectsList',
	'posthog.projects.list',
	({ organization_id, ...query }) => ({
		path: `${orgPath(organization_id)}/projects/`,
		query,
		log: { organization_id },
	}),
);

export const projectsGet = defineApiEndpoint<'projectsGet'>(
	'projectsGet',
	'posthog.projects.get',
	() => ({ path: `${PROJECT}/` }),
);
