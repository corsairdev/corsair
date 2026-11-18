import type { SimplesatEndpoints } from '..';
import { call, pageShape, parseNextLink } from './shared';
import type { SimplesatPage, SimplesatQuestion } from './types';
import {
	SimplesatEndpointInputSchemas as Inputs,
	SimplesatEndpointOutputSchemas as Outputs,
} from './types';

export const list: SimplesatEndpoints['questionsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'questions.list',
			input: Inputs.questionsList,
			output: Outputs.questionsList,
		},
		input,
		(parsed) => {
			const path = parsed.next ? parseNextLink(parsed.next) : null;
			if (parsed.next && !path) {
				throw new Error(
					'questions.list needs the `next` path Simplesat returned, such as /api/v1/questions?page=2.',
				);
			}
			return {
				method: 'GET',
				path: path ?? '/api/v1/questions',
				query: path
					? undefined
					: {
							survey_id: parsed.survey_id,
							metric: parsed.metric,
							page: parsed.page,
							page_size: parsed.page_size,
						},
			};
		},
		{
			shape: (raw) =>
				pageShape<SimplesatPage<SimplesatQuestion>>(raw, 'questions'),
			log: (_, result) => ({ count: result.results.length }),
		},
	);
