import type { SurveymonkeyEndpoints } from '..';
import { segment } from '../client';
import { call, listBody, queryOf, unwrapList } from './call';
import {
	SurveymonkeyEndpointInputSchemas as Inputs,
	SurveymonkeyEndpointOutputSchemas as Outputs,
} from './types';

/** The response id is the last segment; the survey id comes before it. */
function surveyResponsePath(surveyId: string, responseId?: string): string {
	const base = `/surveys/${segment(surveyId)}/responses`;
	return responseId === undefined ? base : `${base}/${segment(responseId)}`;
}

export const list: SurveymonkeyEndpoints['responsesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'responses.list',
			input: Inputs.responsesList,
			output: Outputs.responsesList,
		},
		input,
		({
			survey_id,
			page,
			per_page,
			start_created_at,
			end_created_at,
			start_modified_at,
			end_modified_at,
			status,
			sort_by,
			sort_order,
		}) => ({
			method: 'GET',
			path: surveyResponsePath(survey_id),
			query: queryOf({
				page,
				per_page,
				start_created_at,
				end_created_at,
				start_modified_at,
				end_modified_at,
				status,
				sort_by,
				sort_order,
			}),
		}),
		{
			shape: (raw) => ({
				...listBody(raw, 'response list'),
				data: unwrapList(raw, 'response list'),
			}),
			log: (parsed, result) => ({
				surveyId: parsed.survey_id,
				count: result.data.length,
			}),
		},
	);

export const listBulk: SurveymonkeyEndpoints['responsesListBulk'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'responses.listBulk',
			input: Inputs.responsesListBulk,
			output: Outputs.responsesListBulk,
		},
		input,
		({
			survey_id,
			page,
			per_page,
			start_created_at,
			end_created_at,
			start_modified_at,
			end_modified_at,
			status,
			sort_by,
			sort_order,
			simple,
			collector_ids,
			page_ids,
			question_ids,
		}) => ({
			method: 'GET',
			path: `${surveyResponsePath(survey_id)}/bulk`,
			query: queryOf({
				page,
				per_page,
				start_created_at,
				end_created_at,
				start_modified_at,
				end_modified_at,
				status,
				sort_by,
				sort_order,
				simple,
				collector_ids,
				page_ids,
				question_ids,
			}),
		}),
		{
			shape: (raw) => ({
				...listBody(raw, 'bulk response list'),
				data: unwrapList(raw, 'bulk response list'),
			}),
			log: (parsed, result) => ({
				surveyId: parsed.survey_id,
				count: result.data.length,
			}),
		},
	);

export const get: SurveymonkeyEndpoints['responsesGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'responses.get',
			input: Inputs.responsesGet,
			output: Outputs.responsesGet,
		},
		input,
		({ survey_id, response_id }) => ({
			method: 'GET',
			path: surveyResponsePath(survey_id, response_id),
		}),
		{
			log: (parsed) => ({
				surveyId: parsed.survey_id,
				responseId: parsed.response_id,
			}),
		},
	);

export const getDetails: SurveymonkeyEndpoints['responsesGetDetails'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'responses.getDetails',
			input: Inputs.responsesGetDetails,
			output: Outputs.responsesGetDetails,
		},
		input,
		({ survey_id, response_id }) => ({
			method: 'GET',
			path: `${surveyResponsePath(survey_id, response_id)}/details`,
		}),
		{
			log: (parsed) => ({
				surveyId: parsed.survey_id,
				responseId: parsed.response_id,
			}),
		},
	);

export const create: SurveymonkeyEndpoints['responsesCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'responses.create',
			input: Inputs.responsesCreate,
			output: Outputs.responsesCreate,
		},
		input,
		({
			collector_id,
			response_status,
			custom_value,
			custom_variables,
			ip_address,
			recipient_id,
			pages,
		}) => ({
			method: 'POST',
			path: `/collectors/${segment(collector_id)}/responses`,
			body: {
				...(response_status === undefined ? {} : { response_status }),
				...(custom_value === undefined ? {} : { custom_value }),
				...(custom_variables === undefined ? {} : { custom_variables }),
				...(ip_address === undefined ? {} : { ip_address }),
				...(recipient_id === undefined ? {} : { recipient_id }),
				...(pages === undefined ? {} : { pages }),
			},
		}),
		{
			log: (parsed, result) => ({
				collectorId: parsed.collector_id,
				responseId: result.id,
			}),
		},
	);

export const remove: SurveymonkeyEndpoints['responsesDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'responses.delete',
			input: Inputs.responsesDelete,
			output: Outputs.responsesDelete,
		},
		input,
		({ survey_id, response_id }) => ({
			method: 'DELETE',
			path: surveyResponsePath(survey_id, response_id),
		}),
		{
			shape: (_, parsed) => ({
				survey_id: parsed.survey_id,
				response_id: parsed.response_id,
				deleted: true,
			}),
			log: (parsed) => ({
				surveyId: parsed.survey_id,
				responseId: parsed.response_id,
			}),
		},
	);

export const removeAll: SurveymonkeyEndpoints['responsesDeleteAll'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'responses.deleteAll',
			input: Inputs.responsesDeleteAll,
			output: Outputs.responsesDeleteAll,
		},
		input,
		({ collector_id }) => ({
			method: 'DELETE',
			path: `/collectors/${segment(collector_id)}/responses`,
		}),
		{
			shape: (_, parsed) => ({
				collector_id: parsed.collector_id,
				deleted: true,
			}),
			log: (parsed) => ({ collectorId: parsed.collector_id }),
		},
	);
