import { logEventFromContext } from 'corsair/core';

import { makeCoassembleRequest } from '../client';
import type { CoassembleContext } from '../index';
import { get as getClients } from './clients';
import { get as getCourses } from './courses';
import { get as getTrackings } from './tracking';
import { get as getUsers } from './user';

jest.mock('../client', () => ({
	...jest.requireActual('../client'),
	makeCoassembleRequest: jest.fn(),
}));

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return {
		...actual,
		logEventFromContext: jest.fn(),
	};
});

const mockMakeRequest = makeCoassembleRequest as jest.MockedFunction<
	typeof makeCoassembleRequest
>;

const mockLogEvent = logEventFromContext as jest.MockedFunction<
	typeof logEventFromContext
>;

// The endpoints only read `key`, `options` and `keys`, so the tests supply just those.
type TestContextFields = Pick<CoassembleContext, 'key' | 'options'> & {
	keys: { get_workspace_id: () => Promise<string | null | undefined> };
};

function makeCtx(
	workspaceId: string,
	storedWorkspaceId?: string,
): CoassembleContext {
	const fields: TestContextFields = {
		key: 'test-api-key',
		options: { workspaceId },
		keys: { get_workspace_id: async () => storedWorkspaceId },
	};
	return fields as CoassembleContext;
}

const ctx = makeCtx('workspace-123');

beforeEach(() => {
	jest.clearAllMocks();
	mockMakeRequest.mockResolvedValue([]);
});

describe('Coassemble endpoints', () => {
	it('gets clients with pagination parameters', async () => {
		const input = {
			page: 2,
			length: 25,
		};

		await getClients(ctx, input);

		expect(mockMakeRequest).toHaveBeenCalledWith(
			'v1/headless/clients',
			'test-api-key',
			'workspace-123',
			{
				method: 'GET',
				query: input,
			},
		);

		expect(mockLogEvent).toHaveBeenCalledWith(
			ctx,
			'coassemble.clients.get',
			input,
			'completed',
		);
	});

	it('gets courses with filters', async () => {
		const input = {
			page: 1,
			length: 10,
			identifier: 'course-123',
			clientIdentifier: 'client-123',
			title: 'Test Course',
			deleted: false,
		};

		await getCourses(ctx, input);

		expect(mockMakeRequest).toHaveBeenCalledWith(
			'v1/headless/courses',
			'test-api-key',
			'workspace-123',
			{
				method: 'GET',
				query: input,
			},
		);

		expect(mockLogEvent).toHaveBeenCalledWith(
			ctx,
			'coassemble.courses.get',
			input,
			'completed',
		);
	});

	it('gets trackings with required course ID and filters', async () => {
		const input = {
			id: 123,
			identifier: 'user-123',
			clientIdentifier: 'client-123',
			start: '2026-01-01',
			end: '2026-01-31',
		};

		await getTrackings(ctx, input);

		expect(mockMakeRequest).toHaveBeenCalledWith(
			'v1/headless/trackings',
			'test-api-key',
			'workspace-123',
			{
				method: 'GET',
				query: input,
			},
		);

		expect(mockLogEvent).toHaveBeenCalledWith(
			ctx,
			'coassemble.trackings.get',
			input,
			'completed',
		);
	});

	it('gets users with pagination and client filter', async () => {
		const input = {
			page: 3,
			length: 50,
			clientIdentifier: 'client-123',
		};

		await getUsers(ctx, input);

		expect(mockMakeRequest).toHaveBeenCalledWith(
			'v1/headless/users',
			'test-api-key',
			'workspace-123',
			{
				method: 'GET',
				query: input,
			},
		);

		expect(mockLogEvent).toHaveBeenCalledWith(
			ctx,
			'coassemble.users.get',
			input,
			'completed',
		);
	});

	it('prefers the per-account workspace ID over the plugin option', async () => {
		await getClients(makeCtx('workspace-123', 'tenant-ws'), {});

		expect(mockMakeRequest).toHaveBeenCalledWith(
			'v1/headless/clients',
			'test-api-key',
			'tenant-ws',
			{
				method: 'GET',
				query: {},
			},
		);
	});

	it('works with only a per-account workspace ID and no plugin option', async () => {
		await getClients(makeCtx('', 'tenant-ws'), {});

		expect(mockMakeRequest).toHaveBeenCalledWith(
			'v1/headless/clients',
			'test-api-key',
			'tenant-ws',
			{
				method: 'GET',
				query: {},
			},
		);
	});

	it('throws when no workspace ID is available anywhere', async () => {
		await expect(getClients(makeCtx(''), {})).rejects.toThrow(
			'Coassemble workspace ID is missing',
		);

		expect(mockMakeRequest).not.toHaveBeenCalled();
	});
});
