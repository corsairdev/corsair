import type { ZohoDeskEndpoints } from '..';
import { zohoDeskCall } from './call';
import {
	ZohoDeskEndpointInputSchemas,
	ZohoDeskEndpointOutputSchemas,
} from './types';

export const updateMany: ZohoDeskEndpoints['tasksUpdateMany'] = (ctx, input) =>
	zohoDeskCall(ctx, input, {
		event: 'zohodesk.tasks.updateMany',
		input: ZohoDeskEndpointInputSchemas.tasksUpdateMany,
		output: ZohoDeskEndpointOutputSchemas.tasksUpdateMany,
		toRequest: (body) => ({ method: 'POST', path: '/tasks/updateMany', body }),
		logFields: ({ ids, fieldName, isCustomField }) => ({
			taskCount: ids.length,
			fieldName,
			isCustomField,
		}),
	});
