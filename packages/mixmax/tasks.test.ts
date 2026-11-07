import type { MixmaxContext } from './index';
import { mixmax } from './index';

jest.mock('./client', () => ({
	...jest.requireActual('./client'),
	makeMixmaxRequest: jest.fn(),
}));

import { makeMixmaxRequest } from './client';

const request = jest.mocked(makeMixmaxRequest);

// The handlers under test read only `key` from the runtime context and log
// through logEventFromContext, which needs $getAccountId; every other
// context service is untouched by these code paths.
const ctx = {
	key: 'mixmax_test_key',
	$getAccountId: async () => 'account-1',
} as unknown as MixmaxContext;

// The factory always builds the validated endpoint tree, so the endpoints
// accessor is defined on every plugin instance.
const endpoints = mixmax({ key: 'mixmax_test_key' }).endpoints!;

const TASK = {
	_id: '66f3fb11f6b6a17fc80d2310',
	type: 'email',
	subject: 'Follow up with Ada',
	description: 'Sent the proposal',
	status: 'Open',
	isCompleted: false,
	due: '2026-09-24T13:00:00.000Z',
	priority: 'High',
	assignee: {
		id: '66f3f814f6b6a17fc80d2200',
		name: 'Grace Hopper',
		email: 'grace@example.com',
	},
	phoneTo: null,
	sequence: {
		id: '66f3f9d1f6b6a17fc80d22d8',
		name: 'Enterprise follow-up',
		stage: '66f3fa23f6b6a17fc80d22ea',
	},
};

describe('Mixmax tasks endpoints', () => {
	beforeEach(() => {
		request.mockReset();
		request.mockResolvedValue(undefined);
	});

	it('tasks.list sends GET /v1/tasks with documented query params', async () => {
		const page = {
			results: [TASK],
			total: 1,
			next: null,
			previous: null,
			hasNext: false,
			hasPrevious: false,
		};
		request.mockResolvedValue(page);
		const result = await endpoints.tasks.list(ctx, {
			search: 'all',
			query: 'type:email assignee:Myself status:open sortBy:due sortDir:asc',
			limit: 50,
		});

		expect(request).toHaveBeenCalledWith(ctx, '/v1/tasks', {
			method: 'GET',
			query: {
				search: 'all',
				query: 'type:email assignee:Myself status:open sortBy:due sortDir:asc',
				limit: 50,
				next: undefined,
				previous: undefined,
				tz: undefined,
			},
		});
		expect(result).toEqual(page);
	});
});
