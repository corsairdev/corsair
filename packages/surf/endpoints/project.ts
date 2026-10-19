import type { SurfContext } from '../index';
import { callSurf } from './call';
import type { SurfEndpointInputs } from './types';
import {
	ProjectAiNewsInput,
	ProjectDefiMetricsInput,
	ProjectDefiRankingInput,
	ProjectDetailInput,
	SurfResponse,
} from './types';

export const Project = {
	aiNews: (ctx: SurfContext, input: SurfEndpointInputs['projectAiNews']) =>
		callSurf(
			ctx,
			'project.aiNews',
			ProjectAiNewsInput,
			SurfResponse,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/project/ai-news',
				query: omitEmpty({
					id: validated.id,
					q: validated.q,
					limit: validated.limit,
					offset: validated.offset,
					lang: validated.lang,
				}),
			}),
			(validated) => ({ id: String(validated.id ?? '') }),
		),
	defiMetrics: (
		ctx: SurfContext,
		input: SurfEndpointInputs['projectDefiMetrics'],
	) =>
		callSurf(
			ctx,
			'project.defiMetrics',
			ProjectDefiMetricsInput,
			SurfResponse,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/project/defi/metrics',
				query: omitEmpty({
					id: validated.id,
					q: validated.q,
					metric: validated.metric,
					from: validated.from,
					to: validated.to,
					chain: validated.chain,
					limit: validated.limit,
					offset: validated.offset,
				}),
			}),
			(validated) => ({ id: String(validated.id ?? '') }),
		),
	defiRanking: (
		ctx: SurfContext,
		input: SurfEndpointInputs['projectDefiRanking'],
	) =>
		callSurf(
			ctx,
			'project.defiRanking',
			ProjectDefiRankingInput,
			SurfResponse,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/project/defi/ranking',
				query: omitEmpty({
					metric: validated.metric,
					limit: validated.limit,
					offset: validated.offset,
				}),
			}),
			(validated) => ({ metric: String(validated.metric ?? '') }),
		),
	detail: (ctx: SurfContext, input: SurfEndpointInputs['projectDetail']) =>
		callSurf(
			ctx,
			'project.detail',
			ProjectDetailInput,
			SurfResponse,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/project/detail',
				query: omitEmpty({
					id: validated.id,
					x_id: validated.x_id,
					handle: validated.handle,
					q: validated.q,
					fields: validated.fields,
				}),
			}),
			(validated) => ({ id: String(validated.id ?? '') }),
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
