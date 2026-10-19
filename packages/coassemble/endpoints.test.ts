import { logEventFromContext } from 'corsair/core';
import { makeCoassembleRequest } from './client';
import { getClients, getCourses, getTrackings, getUsers } from './endpoints';
import type { CoassembleContext } from './index';

jest.mock('./client', () => ({
	...jest.requireActual('./client'),
	makeCoassembleRequest: jest.fn(),
}));

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return {
		...actual,
		logEventFromContext: jest.fn(),
	};
});

const mockMakeRequest = jest.mocked(makeCoassembleRequest);
const mockLogEvent = jest.mocked(logEventFromContext);

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
		options: {
			workspaceId,
			...(storedWorkspaceId ? {} : { key: 'test-api-key' }),
		},
		keys: { get_workspace_id: async () => storedWorkspaceId },
	};
	// Justification for unknown: Unit test fixture only mocks the key, options, and keys manager fields accessed by endpoint handlers, casting through unknown to satisfy the full CorsairPluginContext interface.
	return fields as unknown as CoassembleContext;
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

	it('prefers the per-account workspace ID when using account-level authentication', async () => {
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

	it('uses options.workspaceId when options.key is explicitly provided', async () => {
		// When options.key is set, credentials come from options, not account storage
		const contextFields: TestContextFields = {
			key: 'options-api-key',
			options: { workspaceId: 'options-ws', key: 'options-api-key' },
			keys: { get_workspace_id: async () => 'stored-ws' },
		};
		// Justification for unknown: Unit test fixture casting through unknown to satisfy CoassembleContext interface.
		const customCtx = contextFields as unknown as CoassembleContext;

		await getClients(customCtx, {});

		expect(mockMakeRequest).toHaveBeenCalledWith(
			'v1/headless/clients',
			'options-api-key',
			'options-ws',
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

	describe('runtime schema enforcement', () => {
		it('rejects input with invalid pagination parameters', async () => {
			await expect(getClients(ctx, { length: 0 })).rejects.toThrow();
			await expect(getCourses(ctx, { length: -5 })).rejects.toThrow();
		});

		it('rejects input with non-integer course ID for trackings', async () => {
			await expect(getTrackings(ctx, { id: 1.5 })).rejects.toThrow();
		});

		it('rejects provider responses missing required entity fields without logging completed', async () => {
			// Courses require a numeric id
			mockMakeRequest.mockImplementationOnce(async () => [
				{ title: 'Course without id' },
			]);

			await expect(getCourses(ctx, {})).rejects.toThrow();
			expect(mockLogEvent).not.toHaveBeenCalled();
		});

		it('rejects provider responses that are not arrays without logging completed', async () => {
			mockMakeRequest.mockImplementationOnce(async () => ({
				error: 'malformed response',
			}));

			await expect(getClients(ctx, {})).rejects.toThrow();
			expect(mockLogEvent).not.toHaveBeenCalled();
		});
	});
});
