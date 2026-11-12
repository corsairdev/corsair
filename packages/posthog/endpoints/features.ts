import { defineApiEndpoint, PROJECT, pathId } from './api';

export const featureFlagsList = defineApiEndpoint<'featureFlagsList'>(
	'posthog.featureFlags.list',
	({ active, ...rest }) => ({
		path: `${PROJECT}/feature_flags/`,
		query: {
			...rest,
			active: active === undefined ? undefined : String(active),
		},
		log: { ...rest, active },
	}),
);

export const featureFlagsGet = defineApiEndpoint<'featureFlagsGet'>(
	'posthog.featureFlags.get',
	(input) => ({
		path: `${PROJECT}/feature_flags/${pathId(input.id)}/`,
		log: { id: input.id },
	}),
);

export const featureFlagsCreate = defineApiEndpoint<'featureFlagsCreate'>(
	'posthog.featureFlags.create',
	({ rollout_percentage, filters, ...rest }) => ({
		path: `${PROJECT}/feature_flags/`,
		method: 'POST',
		body: {
			...rest,
			filters:
				filters ??
				(rollout_percentage !== undefined
					? { groups: [{ properties: [], rollout_percentage }] }
					: undefined),
		},
		log: { key: rest.key, active: rest.active },
	}),
);

export const featureFlagsUpdate = defineApiEndpoint<'featureFlagsUpdate'>(
	'posthog.featureFlags.update',
	({ id, ...changes }) => ({
		path: `${PROJECT}/feature_flags/${pathId(id)}/`,
		method: 'PATCH',
		body: changes,
		log: { id, fields: Object.keys(changes) },
	}),
);

export const featureFlagsDelete = defineApiEndpoint<'featureFlagsDelete'>(
	'posthog.featureFlags.delete',
	({ id }) => ({
		// Soft delete, as in PostHog's UI; the flag can be restored there.
		path: `${PROJECT}/feature_flags/${pathId(id)}/`,
		method: 'PATCH',
		body: { deleted: true },
		log: { id },
	}),
);

export const experimentsList = defineApiEndpoint<'experimentsList'>(
	'posthog.experiments.list',
	(input) => ({ path: `${PROJECT}/experiments/`, query: input, log: input }),
);

export const experimentsGet = defineApiEndpoint<'experimentsGet'>(
	'posthog.experiments.get',
	(input) => ({
		path: `${PROJECT}/experiments/${pathId(input.id)}/`,
		log: { id: input.id },
	}),
);

// No start/end dates in these inputs: experiments stay drafts until someone
// launches them in PostHog.
export const experimentsCreate = defineApiEndpoint<'experimentsCreate'>(
	'posthog.experiments.create',
	(input) => ({
		path: `${PROJECT}/experiments/`,
		method: 'POST',
		body: input,
		log: { name: input.name, feature_flag_key: input.feature_flag_key },
	}),
);

export const experimentsUpdate = defineApiEndpoint<'experimentsUpdate'>(
	'posthog.experiments.update',
	({ id, ...changes }) => ({
		path: `${PROJECT}/experiments/${pathId(id)}/`,
		method: 'PATCH',
		body: changes,
		log: { id, fields: Object.keys(changes) },
	}),
);

export const surveysList = defineApiEndpoint<'surveysList'>(
	'posthog.surveys.list',
	(input) => ({ path: `${PROJECT}/surveys/`, query: input, log: input }),
);

export const surveysGet = defineApiEndpoint<'surveysGet'>(
	'posthog.surveys.get',
	(input) => ({
		path: `${PROJECT}/surveys/${pathId(input.id)}/`,
		log: { id: input.id },
	}),
);

// Like experiments, surveys are created and edited as drafts (no start date).
export const surveysCreate = defineApiEndpoint<'surveysCreate'>(
	'posthog.surveys.create',
	(input) => ({
		path: `${PROJECT}/surveys/`,
		method: 'POST',
		body: { ...input, type: input.type ?? 'api' },
		log: { name: input.name, type: input.type ?? 'api' },
	}),
);

export const surveysUpdate = defineApiEndpoint<'surveysUpdate'>(
	'posthog.surveys.update',
	({ id, ...changes }) => ({
		path: `${PROJECT}/surveys/${pathId(id)}/`,
		method: 'PATCH',
		body: changes,
		log: { id, fields: Object.keys(changes) },
	}),
);

export const surveysDelete = defineApiEndpoint<'surveysDelete'>(
	'posthog.surveys.delete',
	({ id }) => ({
		path: `${PROJECT}/surveys/${pathId(id)}/`,
		method: 'DELETE',
		log: { id },
		// PostHog answers 204 with no body.
		transform: () => ({ id, deleted: true }),
	}),
);

export const earlyAccessFeaturesList =
	defineApiEndpoint<'earlyAccessFeaturesList'>(
		'posthog.earlyAccessFeatures.list',
		(input) => ({
			path: `${PROJECT}/early_access_feature/`,
			query: input,
			log: input,
		}),
	);
