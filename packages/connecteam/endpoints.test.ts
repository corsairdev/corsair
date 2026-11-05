import { logEventFromContext } from 'corsair/core';
import { makeConnecteamRequest } from './client';
import {
	archiveUsers,
	createUsers,
	generateUploadUrl,
	getChat,
	getCustomFieldCategories,
	getCustomFields,
	getForms,
	getJobs,
	getPerformanceIndicators,
	getPolicyTypes,
	getPublishers,
	getSchedulers,
	getSmartGroups,
	getTaskBoards,
	getUsers,
	listMe,
} from './endpoints';
import { connecteam } from './index';
import { ConnecteamSchema } from './schema';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return {
		...actual,
		logEventFromContext: jest.fn(),
	};
});

jest.mock('./client', () => ({
	makeConnecteamRequest: jest.fn(),
}));

const mockRequest = makeConnecteamRequest as jest.Mock;
const mockLog = jest.mocked(logEventFromContext);

function ctx() {
	return {
		key: 'test-key',
		pluginId: 'connecteam',
		authType: 'api_key' as const,
		options: {},
		schema: ConnecteamSchema,
		db: {},
	} as never;
}

describe('Connecteam endpoints', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockRequest.mockResolvedValue({ requestId: 'r1', data: {} });
	});

	it('lists account information', async () => {
		await listMe(ctx(), {});
		expect(mockRequest).toHaveBeenCalledWith('me', 'test-key', {
			method: 'GET',
		});
	});

	it('gets users with pagination query', async () => {
		const input = { limit: 10, offset: 0 };
		await getUsers(ctx(), input);
		expect(mockRequest).toHaveBeenCalledWith('users/v1/users', 'test-key', {
			method: 'GET',
			query: input,
		});
	});

	it('creates users without logging PII', async () => {
		const input = {
			users: [{ firstName: 'Ada', phoneNumber: '+15550001' }],
		};
		await createUsers(ctx(), input);
		expect(mockRequest).toHaveBeenCalledWith('users/v1/users', 'test-key', {
			method: 'POST',
			query: undefined,
			body: input.users,
		});
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'connecteam.users.create',
			{ count: 1 },
			'completed',
		);
	});

	it('archives users and never sends deletionType delete', async () => {
		await archiveUsers(ctx(), { userIds: [1, 2] });
		expect(mockRequest).toHaveBeenCalledWith('users/v1/users', 'test-key', {
			method: 'DELETE',
			query: { deletionType: 'archive' },
			body: { userIds: [1, 2] },
		});
	});

	it('generates an upload URL', async () => {
		await generateUploadUrl(ctx(), {
			fileName: 'note.pdf',
			featureType: 'chat',
			fileTypeHint: 'application/pdf',
		});
		expect(mockRequest).toHaveBeenCalledWith(
			'attachments/v1/files/generate-upload-url',
			'test-key',
			{
				method: 'POST',
				body: {
					fileName: 'note.pdf',
					featureType: 'chat',
					fileTypeHint: 'application/pdf',
				},
			},
		);
	});

	it.each([
		['chat', getChat, 'chat/v1/conversations', { limit: 1 }],
		[
			'customFieldCategories',
			getCustomFieldCategories,
			'users/v1/custom-field-categories',
			{},
		],
		['customFields', getCustomFields, 'users/v1/custom-fields', { limit: 20 }],
		['forms', getForms, 'forms/v1/forms', { limit: 1 }],
		['jobs', getJobs, 'jobs/v1/jobs', { instanceIds: [1], limit: 10 }],
		['smartGroups', getSmartGroups, 'users/v1/smart-groups', { name: 'Crew' }],
	] as const)('GET list %s', async (_name, fn, path, input) => {
		await fn(ctx(), input as never);
		expect(mockRequest).toHaveBeenCalledWith(path, 'test-key', {
			method: 'GET',
			query: input,
		});
	});

	it.each([
		[
			'performanceIndicators',
			getPerformanceIndicators,
			'users/v1/performance-indicators',
		],
		['policyTypes', getPolicyTypes, 'time-off/v1/policy-types'],
		['publishers', getPublishers, 'publishers/v1/publishers'],
		['schedulers', getSchedulers, 'scheduler/v1/schedulers'],
		['taskBoards', getTaskBoards, 'tasks/v1/taskboards'],
	] as const)('GET %s', async (_name, fn, path) => {
		await fn(ctx(), {});
		expect(mockRequest).toHaveBeenCalledWith(path, 'test-key', {
			method: 'GET',
		});
	});
});

describe('Connecteam plugin', () => {
	it('registers 16 operations and archive as write', () => {
		const plugin = connecteam({ key: 'k' });
		expect(Object.keys(plugin.endpointMeta ?? {})).toHaveLength(16);
		expect(plugin.endpointMeta?.['users.archive']?.riskLevel).toBe('write');
		expect(plugin.endpointMeta?.['users.create']?.riskLevel).toBe('write');
		expect(plugin.endpointMeta?.['me.list']?.riskLevel).toBe('read');
	});
});
