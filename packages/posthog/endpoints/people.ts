import { defineApiEndpoint, PROJECT, pathId } from './api';

export const personsList = defineApiEndpoint<'personsList'>(
	'posthog.persons.list',
	(input) => ({
		path: `${PROJECT}/persons/`,
		query: input,
		log: { limit: input.limit, offset: input.offset },
	}),
);

export const personsGet = defineApiEndpoint<'personsGet'>(
	'posthog.persons.get',
	(input) => ({
		path: `${PROJECT}/persons/${pathId(input.id)}/`,
		log: { id: input.id },
	}),
);

// PostHog answers both property calls with an empty 202 (applied
// asynchronously through ingestion), so the output echoes what was sent.

export const personsUpdateProperty = defineApiEndpoint<'personsUpdateProperty'>(
	'posthog.persons.updateProperty',
	({ id, key, value }) => ({
		path: `${PROJECT}/persons/${pathId(id)}/update_property/`,
		method: 'POST',
		body: { key, value },
		log: { id, key },
		transform: () => ({ id, key, success: true }),
	}),
);

export const personsDeleteProperty = defineApiEndpoint<'personsDeleteProperty'>(
	'posthog.persons.deleteProperty',
	({ id, key }) => ({
		path: `${PROJECT}/persons/${pathId(id)}/delete_property/`,
		method: 'POST',
		body: { $unset: key },
		log: { id, key },
		transform: () => ({ id, key, success: true }),
	}),
);

export const cohortsList = defineApiEndpoint<'cohortsList'>(
	'posthog.cohorts.list',
	(input) => ({ path: `${PROJECT}/cohorts/`, query: input, log: input }),
);

export const cohortsGet = defineApiEndpoint<'cohortsGet'>(
	'posthog.cohorts.get',
	(input) => ({
		path: `${PROJECT}/cohorts/${pathId(input.id)}/`,
		log: { id: input.id },
	}),
);

export const cohortsCreate = defineApiEndpoint<'cohortsCreate'>(
	'posthog.cohorts.create',
	(input) => ({
		path: `${PROJECT}/cohorts/`,
		method: 'POST',
		body: input,
		log: { name: input.name, is_static: input.is_static },
	}),
);

export const cohortsUpdate = defineApiEndpoint<'cohortsUpdate'>(
	'posthog.cohorts.update',
	({ id, ...changes }) => ({
		path: `${PROJECT}/cohorts/${pathId(id)}/`,
		method: 'PATCH',
		body: changes,
		log: { id, fields: Object.keys(changes) },
	}),
);
