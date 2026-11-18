import type { SurveymonkeyEndpoints } from '..';
import { segment } from '../client';
import { call, listBody, queryOf, unwrapList } from './call';
import {
	SurveymonkeyEndpointInputSchemas as Inputs,
	SurveymonkeyEndpointOutputSchemas as Outputs,
} from './types';

/** The survey, page and question ids are always the first three segments. */
function questionPath(
	surveyId: string,
	pageId: string,
	questionId?: string,
): string {
	const base = `/surveys/${segment(surveyId)}/pages/${segment(pageId)}/questions`;
	return questionId === undefined ? base : `${base}/${segment(questionId)}`;
}

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

export const list: SurveymonkeyEndpoints['questionsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'questions.list',
			input: Inputs.questionsList,
			output: Outputs.questionsList,
		},
		input,
		({ survey_id, page_id, page, per_page }) => ({
			method: 'GET',
			path: questionPath(survey_id, page_id),
			query: queryOf({ page, per_page }),
		}),
		{
			shape: (raw) => ({
				...listBody(raw, 'question list'),
				data: unwrapList(raw, 'question list'),
			}),
			log: (parsed, result) => ({
				surveyId: parsed.survey_id,
				pageId: parsed.page_id,
				count: result.data.length,
			}),
		},
	);

export const create: SurveymonkeyEndpoints['questionsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'questions.create',
			input: Inputs.questionsCreate,
			output: Outputs.questionsCreate,
		},
		input,
		({
			survey_id,
			page_id,
			family,
			subtype,
			headings,
			position,
			required,
			sorting,
			validation,
			forced_ranking,
			quiz_options,
			display_options,
			answers,
		}) => ({
			method: 'POST',
			path: questionPath(survey_id, page_id),
			body: bodyOf({
				family,
				subtype,
				headings,
				position,
				required,
				sorting,
				validation,
				forced_ranking,
				quiz_options,
				display_options,
				answers,
			}),
		}),
		{
			log: (parsed, result) => ({
				surveyId: parsed.survey_id,
				pageId: parsed.page_id,
				questionId: result.id,
			}),
		},
	);

export const get: SurveymonkeyEndpoints['questionsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'questions.get',
			input: Inputs.questionsGet,
			output: Outputs.questionsGet,
		},
		input,
		({ survey_id, page_id, question_id }) => ({
			method: 'GET',
			path: questionPath(survey_id, page_id, question_id),
		}),
		{
			log: (parsed) => ({
				surveyId: parsed.survey_id,
				questionId: parsed.question_id,
			}),
		},
	);

export const update: SurveymonkeyEndpoints['questionsUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'questions.update',
			input: Inputs.questionsUpdate,
			output: Outputs.questionsUpdate,
		},
		input,
		({
			survey_id,
			page_id,
			question_id,
			headings,
			position,
			required,
			visible,
			answers,
		}) => ({
			method: 'PATCH',
			path: questionPath(survey_id, page_id, question_id),
			body: bodyOf({ headings, position, required, visible, answers }),
		}),
		{
			log: (parsed) => ({
				surveyId: parsed.survey_id,
				questionId: parsed.question_id,
			}),
		},
	);

export const remove: SurveymonkeyEndpoints['questionsDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'questions.delete',
			input: Inputs.questionsDelete,
			output: Outputs.questionsDelete,
		},
		input,
		({ survey_id, page_id, question_id }) => ({
			method: 'DELETE',
			path: questionPath(survey_id, page_id, question_id),
		}),
		{
			shape: (_, parsed) => ({
				survey_id: parsed.survey_id,
				page_id: parsed.page_id,
				question_id: parsed.question_id,
				deleted: true,
			}),
			log: (parsed) => ({
				surveyId: parsed.survey_id,
				questionId: parsed.question_id,
			}),
		},
	);
