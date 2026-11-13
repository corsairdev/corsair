import type { SatisMeterEndpoints } from '..';
import { call } from './call';
import { segment } from './projects';
import {
	SatisMeterEndpointInputSchemas as Inputs,
	SatisMeterEndpointOutputSchemas as Outputs,
} from './types';

/**
 * Both listings answer `{ data, page }` and page by cursor. The `page` object is
 * passed straight through for the output schema to validate, so a missing
 * cursor makes the parse fail loudly rather than reading as a last page.
 */
export const list: SatisMeterEndpoints['responsesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'responses.list',
			input: Inputs.responsesList,
			output: Outputs.responsesList,
		},
		input,
		({ projectId, startDate, endDate, pageCursor, pageSize }) => ({
			method: 'GET',
			path: `/projects/${segment(projectId)}/responses`,
			query: { startDate, endDate, pageCursor, pageSize },
		}),
		{
			shape: (envelope) => ({
				responses: envelope.data,
				page: envelope.page,
			}),
			log: (parsed, result) => ({
				projectId: parsed.projectId,
				count: result.responses.length,
				hasNextPage: result.page.hasNextPage,
			}),
		},
	);

export const listForSurvey: SatisMeterEndpoints['surveyResponsesList'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'responses.listForSurvey',
			input: Inputs.surveyResponsesList,
			output: Outputs.surveyResponsesList,
		},
		input,
		({ projectId, surveyId, startDate, endDate, pageCursor, pageSize }) => ({
			method: 'GET',
			path: `/projects/${segment(projectId)}/campaigns/${segment(surveyId)}/responses`,
			query: { startDate, endDate, pageCursor, pageSize },
		}),
		{
			shape: (envelope) => ({
				responses: envelope.data,
				page: envelope.page,
			}),
			log: (parsed, result) => ({
				projectId: parsed.projectId,
				surveyId: parsed.surveyId,
				count: result.responses.length,
				hasNextPage: result.page.hasNextPage,
			}),
		},
	);
