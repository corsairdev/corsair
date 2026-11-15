import type { AhrefsEndpoints } from '../index';
import { callAhrefs } from './request';

export const topics: AhrefsEndpoints['contentHelperTopics'] = (ctx, input) =>
	callAhrefs(
		ctx,
		{
			endpoint: 'contentHelperTopics',
			method: 'GET',
			path: '/content-helper/topics',
			event: 'ahrefs.contentHelper.topics',
			logKeys: ['keyword', 'country'],
		},
		input,
	);
