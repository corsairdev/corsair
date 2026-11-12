import type { PostHogEndpoints } from '../index';
import { callPostHogApi } from './api';
import type { PostHogEndpointOutputs } from './types';

const P = '/api/projects/{project_id}';

function id(value: string | number): string {
	return encodeURIComponent(String(value));
}

export const featureFlagsList: PostHogEndpoints['featureFlagsList'] = async (
	ctx,
	input,
) => {
	const { active, ...rest } = input;
	return callPostHogApi<PostHogEndpointOutputs['featureFlagsList']>(
		ctx,
		'posthog.featureFlags.list',
		`${P}/feature_flags/`,
		{
			query: {
				...rest,
				...(active !== undefined ? { active: String(active) } : {}),
			},
		},
		{ ...input },
	);
};

export const featureFlagsGet: PostHogEndpoints['featureFlagsGet'] = async (
	ctx,
	input,
) =>
	callPostHogApi<PostHogEndpointOutputs['featureFlagsGet']>(
		ctx,
		'posthog.featureFlags.get',
		`${P}/feature_flags/${id(input.id)}/`,
		{},
		{ id: input.id },
	);

export const featureFlagsUpdate: PostHogEndpoints['featureFlagsUpdate'] =
	async (ctx, input) => {
		const { id: flagId, ...changes } = input;
		return callPostHogApi<PostHogEndpointOutputs['featureFlagsUpdate']>(
			ctx,
			'posthog.featureFlags.update',
			`${P}/feature_flags/${id(flagId)}/`,
			{ method: 'PATCH', body: changes },
			{ id: flagId, fields: Object.keys(changes) },
		);
	};

export const experimentsList: PostHogEndpoints['experimentsList'] = async (
	ctx,
	input,
) =>
	callPostHogApi<PostHogEndpointOutputs['experimentsList']>(
		ctx,
		'posthog.experiments.list',
		`${P}/experiments/`,
		{ query: { ...input } },
		{ ...input },
	);

export const experimentsGet: PostHogEndpoints['experimentsGet'] = async (
	ctx,
	input,
) =>
	callPostHogApi<PostHogEndpointOutputs['experimentsGet']>(
		ctx,
		'posthog.experiments.get',
		`${P}/experiments/${id(input.id)}/`,
		{},
		{ id: input.id },
	);

export const surveysList: PostHogEndpoints['surveysList'] = async (
	ctx,
	input,
) =>
	callPostHogApi<PostHogEndpointOutputs['surveysList']>(
		ctx,
		'posthog.surveys.list',
		`${P}/surveys/`,
		{ query: { ...input } },
		{ ...input },
	);

export const surveysGet: PostHogEndpoints['surveysGet'] = async (ctx, input) =>
	callPostHogApi<PostHogEndpointOutputs['surveysGet']>(
		ctx,
		'posthog.surveys.get',
		`${P}/surveys/${id(input.id)}/`,
		{},
		{ id: input.id },
	);
