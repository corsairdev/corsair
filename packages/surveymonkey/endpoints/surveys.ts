import type { SurveymonkeyEndpoints } from '..';
import { segment } from '../client';
import { call, deletion, listBody, queryOf, unwrapList } from './call';
import {
	SurveymonkeyEndpointInputSchemas as Inputs,
	SurveymonkeyEndpointOutputSchemas as Outputs,
} from './types';

export const list: SurveymonkeyEndpoints['surveysList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'surveys.list',
			input: Inputs.surveysList,
			output: Outputs.surveysList,
		},
		input,
		({
			page,
			per_page,
			sort_by,
			sort_order,
			include,
			title,
			folder_id,
			start_modified_at,
			end_modified_at,
		}) => ({
			method: 'GET',
			path: '/surveys',
			query: queryOf({
				page,
				per_page,
				sort_by,
				sort_order,
				include,
				title,
				folder_id,
				start_modified_at,
				end_modified_at,
			}),
		}),
		{
			shape: (raw) => ({
				...listBody(raw, 'survey list'),
				data: unwrapList(raw, 'survey list'),
			}),
			log: (_, result) => ({ count: result.data.length }),
		},
	);

export const create: SurveymonkeyEndpoints['surveysCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'surveys.create',
			input: Inputs.surveysCreate,
			output: Outputs.surveysCreate,
		},
		input,
		({ title, from_template_id, from_survey_id }) => ({
			method: 'POST',
			path: '/surveys',
			body: {
				title,
				...(from_template_id === undefined ? {} : { from_template_id }),
				...(from_survey_id === undefined ? {} : { from_survey_id }),
			},
		}),
		{
			log: (_, result) => ({ surveyId: result.id }),
		},
	);

export const get: SurveymonkeyEndpoints['surveysGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'surveys.get',
			input: Inputs.surveysGet,
			output: Outputs.surveysGet,
		},
		input,
		({ survey_id }) => ({
			method: 'GET',
			path: `/surveys/${segment(survey_id)}`,
		}),
		{
			log: (parsed) => ({ surveyId: parsed.survey_id }),
		},
	);

export const getDetails: SurveymonkeyEndpoints['surveysGetDetails'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'surveys.getDetails',
			input: Inputs.surveysGetDetails,
			output: Outputs.surveysGetDetails,
		},
		input,
		({ survey_id }) => ({
			method: 'GET',
			path: `/surveys/${segment(survey_id)}/details`,
		}),
		{
			log: (parsed, result) => ({
				surveyId: parsed.survey_id,
				pageCount: result.pages?.length ?? 0,
			}),
		},
	);

export const update: SurveymonkeyEndpoints['surveysUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'surveys.update',
			input: Inputs.surveysUpdate,
			output: Outputs.surveysUpdate,
		},
		input,
		({
			survey_id,
			title,
			nickname,
			language,
			buttons_text,
			custom_variables,
			footer,
			folder_id,
		}) => ({
			method: 'PATCH',
			path: `/surveys/${segment(survey_id)}`,
			// Only the fields given are sent, so PATCH leaves the rest alone.
			body: {
				...(title === undefined ? {} : { title }),
				...(nickname === undefined ? {} : { nickname }),
				...(language === undefined ? {} : { language }),
				...(buttons_text === undefined ? {} : { buttons_text }),
				...(custom_variables === undefined ? {} : { custom_variables }),
				...(footer === undefined ? {} : { footer }),
				...(folder_id === undefined ? {} : { folder_id }),
			},
		}),
		{
			log: (parsed) => ({ surveyId: parsed.survey_id }),
		},
	);

export const replace: SurveymonkeyEndpoints['surveysReplace'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'surveys.replace',
			input: Inputs.surveysReplace,
			output: Outputs.surveysReplace,
		},
		input,
		({
			survey_id,
			title,
			nickname,
			language,
			buttons_text,
			custom_variables,
			footer,
			folder_id,
		}) => ({
			method: 'PUT',
			path: `/surveys/${segment(survey_id)}`,
			body: {
				...(title === undefined ? {} : { title }),
				...(nickname === undefined ? {} : { nickname }),
				...(language === undefined ? {} : { language }),
				...(buttons_text === undefined ? {} : { buttons_text }),
				...(custom_variables === undefined ? {} : { custom_variables }),
				...(footer === undefined ? {} : { footer }),
				...(folder_id === undefined ? {} : { folder_id }),
			},
		}),
		{
			log: (parsed) => ({ surveyId: parsed.survey_id }),
		},
	);

export const remove: SurveymonkeyEndpoints['surveysDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'surveys.delete',
			input: Inputs.surveysDelete,
			output: Outputs.surveysDelete,
		},
		input,
		({ survey_id }) => ({
			method: 'DELETE',
			path: `/surveys/${segment(survey_id)}`,
		}),
		{
			shape: (_, parsed) => deletion('survey_id', parsed.survey_id),
			log: (parsed) => ({ surveyId: parsed.survey_id }),
		},
	);

export const listCategories: SurveymonkeyEndpoints['surveysListCategories'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'surveys.listCategories',
			input: Inputs.surveysListCategories,
			output: Outputs.surveysListCategories,
		},
		input,
		({ page, per_page, language }) => ({
			method: 'GET',
			path: '/survey_categories',
			query: queryOf({ page, per_page, language }),
		}),
		{
			shape: (raw) => ({
				...listBody(raw, 'survey category list'),
				data: unwrapList(raw, 'survey category list'),
			}),
			log: (_, result) => ({ count: result.data.length }),
		},
	);

export const listTemplates: SurveymonkeyEndpoints['surveysListTemplates'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'surveys.listTemplates',
			input: Inputs.surveysListTemplates,
			output: Outputs.surveysListTemplates,
		},
		input,
		({ page, per_page, language, category }) => ({
			method: 'GET',
			path: '/survey_templates',
			query: queryOf({ page, per_page, language, category }),
		}),
		{
			shape: (raw) => ({
				...listBody(raw, 'survey template list'),
				data: unwrapList(raw, 'survey template list'),
			}),
			log: (_, result) => ({ count: result.data.length }),
		},
	);

export const listLanguages: SurveymonkeyEndpoints['surveysListLanguages'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'surveys.listLanguages',
			input: Inputs.surveysListLanguages,
			output: Outputs.surveysListLanguages,
		},
		input,
		({ page, per_page }) => ({
			method: 'GET',
			path: '/survey_languages',
			query: queryOf({ page, per_page }),
		}),
		{
			shape: (raw) => ({
				...listBody(raw, 'survey language list'),
				data: unwrapList(raw, 'survey language list'),
			}),
			log: (_, result) => ({ count: result.data.length }),
		},
	);
