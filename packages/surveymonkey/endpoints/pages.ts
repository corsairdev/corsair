import type { SurveymonkeyEndpoints } from '..';
import { segment } from '../client';
import { call, listBody, queryOf, unwrapList } from './call';
import {
	SurveymonkeyEndpointInputSchemas as Inputs,
	SurveymonkeyEndpointOutputSchemas as Outputs,
} from './types';

/** The survey and page ids are always the first two path segments. */
function pagePath(surveyId: string, pageId: string): string {
	return `/surveys/${segment(surveyId)}/pages/${segment(pageId)}`;
}

export const list: SurveymonkeyEndpoints['pagesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'pages.list',
			input: Inputs.pagesList,
			output: Outputs.pagesList,
		},
		input,
		({ survey_id, page, per_page }) => ({
			method: 'GET',
			path: `/surveys/${segment(survey_id)}/pages`,
			query: queryOf({ page, per_page }),
		}),
		{
			shape: (raw) => ({
				...listBody(raw, 'page list'),
				data: unwrapList(raw, 'page list'),
			}),
			log: (parsed, result) => ({
				surveyId: parsed.survey_id,
				count: result.data.length,
			}),
		},
	);

export const create: SurveymonkeyEndpoints['pagesCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'pages.create',
			input: Inputs.pagesCreate,
			output: Outputs.pagesCreate,
		},
		input,
		({ survey_id, title, description, position }) => ({
			method: 'POST',
			path: `/surveys/${segment(survey_id)}/pages`,
			body: {
				...(title === undefined ? {} : { title }),
				...(description === undefined ? {} : { description }),
				...(position === undefined ? {} : { position }),
			},
		}),
		{
			log: (parsed, result) => ({
				surveyId: parsed.survey_id,
				pageId: result.id,
			}),
		},
	);

export const get: SurveymonkeyEndpoints['pagesGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'pages.get',
			input: Inputs.pagesGet,
			output: Outputs.pagesGet,
		},
		input,
		({ survey_id, page_id }) => ({
			method: 'GET',
			path: pagePath(survey_id, page_id),
		}),
		{
			log: (parsed) => ({
				surveyId: parsed.survey_id,
				pageId: parsed.page_id,
			}),
		},
	);

export const update: SurveymonkeyEndpoints['pagesUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'pages.update',
			input: Inputs.pagesUpdate,
			output: Outputs.pagesUpdate,
		},
		input,
		({ survey_id, page_id, title, description, position }) => ({
			method: 'PATCH',
			path: pagePath(survey_id, page_id),
			body: {
				...(title === undefined ? {} : { title }),
				...(description === undefined ? {} : { description }),
				...(position === undefined ? {} : { position }),
			},
		}),
		{
			log: (parsed) => ({
				surveyId: parsed.survey_id,
				pageId: parsed.page_id,
			}),
		},
	);

export const remove: SurveymonkeyEndpoints['pagesDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'pages.delete',
			input: Inputs.pagesDelete,
			output: Outputs.pagesDelete,
		},
		input,
		({ survey_id, page_id }) => ({
			method: 'DELETE',
			path: pagePath(survey_id, page_id),
		}),
		{
			shape: (_, parsed) => ({
				survey_id: parsed.survey_id,
				page_id: parsed.page_id,
				deleted: true,
			}),
			log: (parsed) => ({
				surveyId: parsed.survey_id,
				pageId: parsed.page_id,
			}),
		},
	);
