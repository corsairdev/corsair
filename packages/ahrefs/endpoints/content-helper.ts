import type { AhrefsEndpoints } from '../index';
import { callAhrefs } from './request';
import type { ContentHelperTopicsResponse } from './types';

export const topics: AhrefsEndpoints['contentHelperTopics'] = (ctx, input) =>
	callAhrefs<ContentHelperTopicsResponse>(
		ctx,
		{
			method: 'GET',
			path: '/content-helper/topics',
			event: 'ahrefs.contentHelper.topics',
			logKeys: ['keyword', 'country'],
		},
		input,
	);
