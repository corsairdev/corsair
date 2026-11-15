import type { SimplesatEndpoints } from '..';
import { segment } from '../client';
import { call, pageShape, parseNextLink } from './shared';
import type { SimplesatPage, SimplesatSurvey } from './types';
import {
	SimplesatEndpointInputSchemas as Inputs,
	SimplesatEndpointOutputSchemas as Outputs,
} from './types';

export const list: SimplesatEndpoints['surveysList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'surveys.list',
			input: Inputs.surveysList,
			output: Outputs.surveysList,
		},
		input,
		(parsed) => {
			const path = parsed.next ? parseNextLink(parsed.next) : null;
			if (parsed.next && !path) {
				throw new Error(
					'surveys.list needs the `next` path Simplesat returned, such as /api/v1/surveys?page=2.',
				);
			}
			return {
				method: 'GET',
				path: path ?? '/api/v1/surveys',
				query: path
					? undefined
					: {
							name: parsed.name,
							page: parsed.page,
							page_size: parsed.page_size,
						},
			};
		},
		{
			shape: (raw) => pageShape<SimplesatPage<SimplesatSurvey>>(raw, 'surveys'),
			log: (_, result) => ({ count: result.results.length }),
		},
	);

/**
 * Sends the survey to one customer by email. This notifies a real person, so it
 * is a write, and the survey is identified by its token rather than its id.
 */
export const email: SimplesatEndpoints['surveysEmail'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'surveys.email',
			input: Inputs.surveysEmail,
			output: Outputs.surveysEmail,
		},
		input,
		({ survey_token, customer }) => ({
			method: 'POST',
			path: `/api/v1/surveys/${segment(survey_token)}/email`,
			body: { customer },
		}),
		{
			log: ({ survey_token }, result) => ({
				surveyToken: survey_token,
				detail: result.detail ?? undefined,
			}),
		},
	);
