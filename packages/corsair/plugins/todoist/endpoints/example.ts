import type { TodoistBoundEndpoints, TodoistEndpoints } from '..';
import type { TodoistEndpointOutputs } from './types';
import { logEventFromContext } from '../../utils/events';
import { makeTodoistRequest } from '../client';

export const get: TodoistEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeTodoistRequest<TodoistEndpointOutputs['exampleGet']>(
		`example/${input.id}`,
		ctx.key,
		{
			method: 'GET',
		},
	);

	await logEventFromContext(
		ctx,
		'todoist.example.get',
		{ ...input },
		'completed',
	);
	return response;
};
