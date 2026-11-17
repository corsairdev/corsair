import type { SurveymonkeyEndpoints } from '..';
import { segment } from '../client';
import { call, listBody, queryOf, unwrapList } from './call';
import {
	SurveymonkeyEndpointInputSchemas as Inputs,
	SurveymonkeyEndpointOutputSchemas as Outputs,
} from './types';

/**
 * Drops the fields a caller left out, so a PATCH leaves the rest alone. The
 * values come from the operation's input schema, which already validated them.
 * unknown: the field values are the schema's output, of mixed types.
 */
function bodyOf(fields: Record<string, unknown>): Record<string, unknown> {
	return Object.fromEntries(
		Object.entries(fields).filter(([, value]) => value !== undefined),
	);
}

export const list: SurveymonkeyEndpoints['collectorsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'collectors.list',
			input: Inputs.collectorsList,
			output: Outputs.collectorsList,
		},
		input,
		({
			survey_id,
			page,
			per_page,
			name,
			start_date,
			end_date,
			include,
			sort_by,
			sort_order,
		}) => ({
			method: 'GET',
			path: `/surveys/${segment(survey_id)}/collectors`,
			query: queryOf({
				page,
				per_page,
				name,
				start_date,
				end_date,
				include,
				sort_by,
				sort_order,
			}),
		}),
		{
			shape: (raw) => ({
				...listBody(raw, 'collector list'),
				data: unwrapList(raw, 'collector list'),
			}),
			log: (parsed, result) => ({
				surveyId: parsed.survey_id,
				count: result.data.length,
			}),
		},
	);

export const create: SurveymonkeyEndpoints['collectorsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'collectors.create',
			input: Inputs.collectorsCreate,
			output: Outputs.collectorsCreate,
		},
		input,
		({
			survey_id,
			type,
			name,
			thank_you_message,
			disqualification_message,
			disqualification_url,
			close_date,
			closed_page_message,
			redirect_url,
			display_survey_results,
			edit_response_type,
			anonymous_type,
			allow_multiple_responses,
			sender_email,
			response_limit,
			redirect_type,
			password,
			from_collector_id,
		}) => ({
			method: 'POST',
			path: `/surveys/${segment(survey_id)}/collectors`,
			body: bodyOf({
				type,
				name,
				thank_you_message,
				disqualification_message,
				disqualification_url,
				close_date,
				closed_page_message,
				redirect_url,
				display_survey_results,
				edit_response_type,
				anonymous_type,
				allow_multiple_responses,
				sender_email,
				response_limit,
				redirect_type,
				password,
				from_collector_id,
			}),
		}),
		{
			log: (parsed, result) => ({
				surveyId: parsed.survey_id,
				collectorId: result.id,
			}),
		},
	);

export const get: SurveymonkeyEndpoints['collectorsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'collectors.get',
			input: Inputs.collectorsGet,
			output: Outputs.collectorsGet,
		},
		input,
		({ collector_id }) => ({
			method: 'GET',
			path: `/collectors/${segment(collector_id)}`,
		}),
		{
			log: (parsed) => ({ collectorId: parsed.collector_id }),
		},
	);

export const update: SurveymonkeyEndpoints['collectorsUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'collectors.update',
			input: Inputs.collectorsUpdate,
			output: Outputs.collectorsUpdate,
		},
		input,
		({
			collector_id,
			status,
			name,
			thank_you_message,
			disqualification_message,
			disqualification_url,
			close_date,
			closed_page_message,
			redirect_url,
			display_survey_results,
			edit_response_type,
			anonymous_type,
			allow_multiple_responses,
			sender_email,
			response_limit,
			redirect_type,
			password,
		}) => ({
			method: 'PATCH',
			path: `/collectors/${segment(collector_id)}`,
			body: bodyOf({
				status,
				name,
				thank_you_message,
				disqualification_message,
				disqualification_url,
				close_date,
				closed_page_message,
				redirect_url,
				display_survey_results,
				edit_response_type,
				anonymous_type,
				allow_multiple_responses,
				sender_email,
				response_limit,
				redirect_type,
				password,
			}),
		}),
		{
			log: (parsed) => ({ collectorId: parsed.collector_id }),
		},
	);

export const remove: SurveymonkeyEndpoints['collectorsDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'collectors.delete',
			input: Inputs.collectorsDelete,
			output: Outputs.collectorsDelete,
		},
		input,
		({ collector_id }) => ({
			method: 'DELETE',
			path: `/collectors/${segment(collector_id)}`,
		}),
		{
			shape: (_, parsed) => ({
				collector_id: parsed.collector_id,
				deleted: true,
			}),
			log: (parsed) => ({ collectorId: parsed.collector_id }),
		},
	);
