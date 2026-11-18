import { define } from './define';

export const Comments = {
	list: define('listComments', {
		method: 'GET',
		path: () => '/v1/comments',
		query: ({ taskId, cursor }) => ({ taskId, cursor }),
	}),
	create: define('createComment', {
		method: 'POST',
		path: () => '/v1/comments',
		body: (input) => input,
	}),
} as const;
