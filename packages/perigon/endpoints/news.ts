import type { PerigonEndpoints } from '..';
import { call } from './call';
import {
	PerigonEndpointInputSchemas as Inputs,
	PerigonEndpointOutputSchemas as Outputs,
} from './types';

export const list: PerigonEndpoints['articlesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'articles.list',
			input: Inputs.articlesList,
			output: Outputs.articlesList,
		},
		input,
		(query) => ({ method: 'GET', path: '/v1/articles/all', query }),
		{ log: (_, page) => ({ count: page.articles.length }) },
	);
