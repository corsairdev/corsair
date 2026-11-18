import type { SurfContext } from '../index';
import { callSurf } from './call';
import type { SurfEndpointInputs } from './types';
import {
	HeatscoreDetailInput,
	HeatscoreDetailOutput,
	HeatscoreProjectsInput,
	HeatscoreProjectsOutput,
	HeatscoreTokenOfTheDayInput,
	HeatscoreTokenOfTheDayOutput,
	HeatscoreTokenOfWeekInput,
	HeatscoreTokenOfWeekOutput,
} from './types';

export const Heatscore = {
	detail: (ctx: SurfContext, input: SurfEndpointInputs['heatscoreDetail']) =>
		callSurf(
			ctx,
			'heatscore.detail',
			HeatscoreDetailInput,
			HeatscoreDetailOutput,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/heatscore/detail',
				query: omitEmpty({
					id: validated.id,
					project_slug: validated.project_slug,
					time_range: validated.time_range,
				}),
			}),
			(validated) => ({ id: String(validated.id ?? '') }),
		),
	projects: (
		ctx: SurfContext,
		input: SurfEndpointInputs['heatscoreProjects'],
	) =>
		callSurf(
			ctx,
			'heatscore.projects',
			HeatscoreProjectsInput,
			HeatscoreProjectsOutput,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/heatscore/projects',
				query: omitEmpty({
					time_range: validated.time_range,
					limit: validated.limit,
					offset: validated.offset,
				}),
			}),
			(validated) => ({ time_range: String(validated.time_range ?? '') }),
		),
	tokenOfTheDay: (
		ctx: SurfContext,
		input: SurfEndpointInputs['heatscoreTokenOfTheDay'],
	) =>
		callSurf(
			ctx,
			'heatscore.tokenOfTheDay',
			HeatscoreTokenOfTheDayInput,
			HeatscoreTokenOfTheDayOutput,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/heatscore/token-of-the-day',
				query: omitEmpty({ limit: validated.limit, offset: validated.offset }),
			}),
			(validated) => ({ limit: String(validated.limit ?? '') }),
		),
	tokenOfWeek: (
		ctx: SurfContext,
		input: SurfEndpointInputs['heatscoreTokenOfWeek'],
	) =>
		callSurf(
			ctx,
			'heatscore.tokenOfWeek',
			HeatscoreTokenOfWeekInput,
			HeatscoreTokenOfWeekOutput,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/heatscore/token-of-week',
				query: omitEmpty({ limit: validated.limit, offset: validated.offset }),
			}),
			(validated) => ({ limit: String(validated.limit ?? '') }),
		),
};

function omitEmpty<T extends Record<string, unknown>>(value: T): T {
	// Optional query and body fields are omitted. The helper is generic over that object.
	const next = { ...value };
	for (const key of Object.keys(next)) {
		if (next[key] === undefined) delete next[key];
	}
	return next;
}
