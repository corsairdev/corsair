import { makeTodoistRequest } from '../client';
import type { TodoistContext } from '../index';
import { getMany } from './tasks';
import {
	TodoistEndpointInputSchemas,
	TodoistEndpointOutputSchemas,
} from './types';

jest.mock('../client', () => ({ makeTodoistRequest: jest.fn() }));

jest.mock('corsair/core', () => ({
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockRequest = makeTodoistRequest as jest.MockedFunction<
	typeof makeTodoistRequest
>;

describe('todoist tasks.getMany', () => {
	beforeEach(() => {
		mockRequest.mockReset();
	});

	it('forwards the page cursor and stores tasks from the v1 results envelope', async () => {
		const upsertByEntityId = jest.fn().mockResolvedValue(undefined);
		const ctx = {
			key: 'test-key',
			options: {},
			db: { tasks: { upsertByEntityId } },
		} as unknown as TodoistContext;
		const task = { id: '6XGgmFVcrG5RRjVr', content: 'Buy milk' };
		mockRequest.mockResolvedValueOnce({
			results: [task],
			next_cursor: 'CURSOR_3',
		});

		const input = { project_id: 'p1', cursor: 'CURSOR_2', limit: 1 };
		const result = await getMany(ctx, input);

		expect(mockRequest).toHaveBeenCalledWith('tasks', 'test-key', {
			method: 'GET',
			query: {
				project_id: 'p1',
				cursor: 'CURSOR_2',
				limit: 1,
				ids: undefined,
			},
		});
		expect(upsertByEntityId).toHaveBeenCalledWith('6XGgmFVcrG5RRjVr', task);
		expect(result).toEqual({ results: [task], next_cursor: 'CURSOR_3' });
		expect(TodoistEndpointInputSchemas.tasksGetMany.parse(input)).toEqual(
			input,
		);
		expect(TodoistEndpointOutputSchemas.tasksGetMany.parse(result)).toEqual({
			results: [task],
			next_cursor: 'CURSOR_3',
		});
	});
});
