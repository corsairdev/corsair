import type { PostHogEndpoints } from '../index';
import { callPostHogApi } from './api';
import type { PostHogEndpointOutputs } from './types';

const P = '/api/projects/{project_id}';

function id(value: string | number): string {
	return encodeURIComponent(String(value));
}

export const insightsList: PostHogEndpoints['insightsList'] = async (
	ctx,
	input,
) =>
	callPostHogApi<PostHogEndpointOutputs['insightsList']>(
		ctx,
		'posthog.insights.list',
		`${P}/insights/`,
		{ query: { ...input } },
		{ ...input },
	);

export const insightsGet: PostHogEndpoints['insightsGet'] = async (
	ctx,
	input,
) =>
	callPostHogApi<PostHogEndpointOutputs['insightsGet']>(
		ctx,
		'posthog.insights.get',
		`${P}/insights/${id(input.id)}/`,
		{ query: { refresh: input.refresh } },
		{ id: input.id },
	);

export const dashboardsList: PostHogEndpoints['dashboardsList'] = async (
	ctx,
	input,
) =>
	callPostHogApi<PostHogEndpointOutputs['dashboardsList']>(
		ctx,
		'posthog.dashboards.list',
		`${P}/dashboards/`,
		{ query: { ...input } },
		{ ...input },
	);

export const dashboardsGet: PostHogEndpoints['dashboardsGet'] = async (
	ctx,
	input,
) =>
	callPostHogApi<PostHogEndpointOutputs['dashboardsGet']>(
		ctx,
		'posthog.dashboards.get',
		`${P}/dashboards/${id(input.id)}/`,
		{},
		{ id: input.id },
	);

export const personsList: PostHogEndpoints['personsList'] = async (
	ctx,
	input,
) =>
	callPostHogApi<PostHogEndpointOutputs['personsList']>(
		ctx,
		'posthog.persons.list',
		`${P}/persons/`,
		{ query: { ...input } },
		{ limit: input.limit, offset: input.offset },
	);

export const personsGet: PostHogEndpoints['personsGet'] = async (ctx, input) =>
	callPostHogApi<PostHogEndpointOutputs['personsGet']>(
		ctx,
		'posthog.persons.get',
		`${P}/persons/${id(input.id)}/`,
		{},
		{ id: input.id },
	);

export const cohortsList: PostHogEndpoints['cohortsList'] = async (
	ctx,
	input,
) =>
	callPostHogApi<PostHogEndpointOutputs['cohortsList']>(
		ctx,
		'posthog.cohorts.list',
		`${P}/cohorts/`,
		{ query: { ...input } },
		{ ...input },
	);

export const actionsList: PostHogEndpoints['actionsList'] = async (
	ctx,
	input,
) =>
	callPostHogApi<PostHogEndpointOutputs['actionsList']>(
		ctx,
		'posthog.actions.list',
		`${P}/actions/`,
		{ query: { ...input } },
		{ ...input },
	);

export const annotationsList: PostHogEndpoints['annotationsList'] = async (
	ctx,
	input,
) =>
	callPostHogApi<PostHogEndpointOutputs['annotationsList']>(
		ctx,
		'posthog.annotations.list',
		`${P}/annotations/`,
		{ query: { ...input } },
		{ ...input },
	);

export const annotationsCreate: PostHogEndpoints['annotationsCreate'] = async (
	ctx,
	input,
) =>
	callPostHogApi<PostHogEndpointOutputs['annotationsCreate']>(
		ctx,
		'posthog.annotations.create',
		`${P}/annotations/`,
		{
			method: 'POST',
			body: {
				content: input.content,
				date_marker: input.date_marker ?? new Date().toISOString(),
				scope: input.scope ?? 'project',
				...(input.dashboard_item !== undefined
					? { dashboard_item: input.dashboard_item }
					: {}),
			},
		},
		{ scope: input.scope ?? 'project', date_marker: input.date_marker },
	);

export const eventDefinitionsList: PostHogEndpoints['eventDefinitionsList'] =
	async (ctx, input) =>
		callPostHogApi<PostHogEndpointOutputs['eventDefinitionsList']>(
			ctx,
			'posthog.eventDefinitions.list',
			`${P}/event_definitions/`,
			{ query: { ...input } },
			{ ...input },
		);

export const propertyDefinitionsList: PostHogEndpoints['propertyDefinitionsList'] =
	async (ctx, input) => {
		const { event_names, ...rest } = input;
		return callPostHogApi<PostHogEndpointOutputs['propertyDefinitionsList']>(
			ctx,
			'posthog.propertyDefinitions.list',
			`${P}/property_definitions/`,
			{
				query: {
					...rest,
					...(event_names?.length
						? {
								event_names: JSON.stringify(event_names),
								filter_by_event_names: true,
							}
						: {}),
				},
			},
			{ ...input },
		);
	};

export const projectsGet: PostHogEndpoints['projectsGet'] = async (ctx) =>
	callPostHogApi<PostHogEndpointOutputs['projectsGet']>(
		ctx,
		'posthog.projects.get',
		`${P}/`,
		{},
		{},
	);
