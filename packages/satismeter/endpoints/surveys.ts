import type { SatisMeterEndpoints } from '..';
import { call } from './call';
import { segment } from './projects';
import {
	SatisMeterEndpointInputSchemas as Inputs,
	SatisMeterEndpointOutputSchemas as Outputs,
} from './types';

export const list: SatisMeterEndpoints['surveysList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'surveys.list',
			input: Inputs.surveysList,
			output: Outputs.surveysList,
		},
		input,
		({ projectId }) => ({
			method: 'GET',
			path: `/projects/${segment(projectId)}/campaigns`,
		}),
		{
			shape: (envelope) => ({ surveys: envelope.data }),
			log: (parsed, result) => ({
				projectId: parsed.projectId,
				count: result.surveys.length,
			}),
		},
	);

export const get: SatisMeterEndpoints['surveysGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'surveys.get',
			input: Inputs.surveysGet,
			output: Outputs.surveysGet,
		},
		input,
		({ projectId, surveyId }) => ({
			method: 'GET',
			path: `/projects/${segment(projectId)}/campaigns/${segment(surveyId)}`,
		}),
		{
			shape: (envelope) => ({ survey: envelope.data }),
			log: (parsed) => ({
				projectId: parsed.projectId,
				surveyId: parsed.surveyId,
			}),
		},
	);

export const statistics: SatisMeterEndpoints['statisticsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'statistics.get',
			input: Inputs.statisticsGet,
			output: Outputs.statisticsGet,
		},
		input,
		({ projectId, surveyId, startDate, endDate }) => ({
			method: 'GET',
			path: `/projects/${segment(projectId)}/campaigns/${segment(surveyId)}/statistics`,
			query: { startDate, endDate },
		}),
		{
			// The statistics payload is the whole `data` object, which keeps
			// `statistics` and `questions` as separate keys.
			shape: (envelope) => envelope.data,
			log: (parsed, result) => ({
				projectId: parsed.projectId,
				surveyId: parsed.surveyId,
				// LogFields rejects null, and these fields are nullish in the schema.
				responses: result.statistics.responses ?? undefined,
				questions: result.questions.length,
			}),
		},
	);
