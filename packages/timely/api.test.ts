import { logEventFromContext } from 'corsair/core';
import { makeTimelyRequest } from './client';
import {
	Accounts,
	Clients,
	Projects,
	Reports,
	Tags,
	Teams,
	TimeEntries,
	Users,
} from './endpoints';
import { timely } from './index';

jest.mock('./client', () => {
	const actual = jest.requireActual('./client') as typeof import('./client');
	return {
		...actual,
		makeTimelyRequest: jest.fn(),
	};
});

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(async () => undefined),
}));

const mockContext = {
	key: 'test-api-key',
	provider: 'timely',
	authType: 'api_key',
} as any;

describe('Timely endpoints', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('lists accounts', async () => {
		const mockResponse = [{ id: 1, name: 'Account' }];
		(makeTimelyRequest as jest.Mock).mockResolvedValue(mockResponse);
		const result = await Accounts.list(mockContext, { page: 1, perPage: 50 });
		expect(makeTimelyRequest).toHaveBeenCalledWith(
			'/accounts',
			'test-api-key',
			{
				method: 'GET',
				query: { page: 1, per_page: 50 },
			},
		);
		expect(result).toEqual(mockResponse);
	});

	it('gets an account', async () => {
		const mockResponse = { id: 1, name: 'Account' };
		(makeTimelyRequest as jest.Mock).mockResolvedValue(mockResponse);
		const result = await Accounts.get(mockContext, { id: 1 });
		expect(makeTimelyRequest).toHaveBeenCalledWith(
			'/accounts/1',
			'test-api-key',
			{
				method: 'GET',
			},
		);
		expect(result).toEqual(mockResponse);
	});

	it('lists clients', async () => {
		const mockResponse = [{ id: 2, name: 'Client' }];
		(makeTimelyRequest as jest.Mock).mockResolvedValue(mockResponse);
		const result = await Clients.list(mockContext, {
			accountId: 1,
			page: 2,
			perPage: 10,
		});
		expect(makeTimelyRequest).toHaveBeenCalledWith(
			'/1/clients',
			'test-api-key',
			{
				method: 'GET',
				query: { page: 2, per_page: 10 },
			},
		);
		expect(result).toEqual(mockResponse);
	});

	it('gets a client', async () => {
		const mockResponse = { id: 2, name: 'Client' };
		(makeTimelyRequest as jest.Mock).mockResolvedValue(mockResponse);
		const result = await Clients.get(mockContext, { accountId: 1, id: 2 });
		expect(makeTimelyRequest).toHaveBeenCalledWith(
			'/1/clients/2',
			'test-api-key',
			{
				method: 'GET',
			},
		);
		expect(result).toEqual(mockResponse);
	});

	it('lists projects', async () => {
		const mockResponse = [{ id: 3, name: 'Project' }];
		(makeTimelyRequest as jest.Mock).mockResolvedValue(mockResponse);
		const result = await Projects.list(mockContext, { accountId: 1 });
		expect(makeTimelyRequest).toHaveBeenCalledWith(
			'/1/projects',
			'test-api-key',
			{
				method: 'GET',
				query: {},
			},
		);
		expect(result).toEqual(mockResponse);
	});

	it('gets a project', async () => {
		const mockResponse = { id: 3, name: 'Project' };
		(makeTimelyRequest as jest.Mock).mockResolvedValue(mockResponse);
		const result = await Projects.get(mockContext, { accountId: 1, id: 3 });
		expect(makeTimelyRequest).toHaveBeenCalledWith(
			'/1/projects/3',
			'test-api-key',
			{
				method: 'GET',
			},
		);
		expect(result).toEqual(mockResponse);
	});

	it('lists users', async () => {
		const mockResponse = [{ id: 4, name: 'User' }];
		(makeTimelyRequest as jest.Mock).mockResolvedValue(mockResponse);
		const result = await Users.list(mockContext, {
			accountId: 1,
			per_page: 25,
		});
		expect(makeTimelyRequest).toHaveBeenCalledWith('/1/users', 'test-api-key', {
			method: 'GET',
			query: { per_page: 25 },
		});
		expect(result).toEqual(mockResponse);
	});

	it('gets a user', async () => {
		const mockResponse = { id: 4, name: 'User' };
		(makeTimelyRequest as jest.Mock).mockResolvedValue(mockResponse);
		const result = await Users.get(mockContext, { accountId: 1, id: 4 });
		expect(makeTimelyRequest).toHaveBeenCalledWith(
			'/1/users/4',
			'test-api-key',
			{
				method: 'GET',
			},
		);
		expect(result).toEqual(mockResponse);
	});

	it('lists teams', async () => {
		const mockResponse = [{ id: 5, name: 'Team' }];
		(makeTimelyRequest as jest.Mock).mockResolvedValue(mockResponse);
		const result = await Teams.list(mockContext, { accountId: 1 });
		expect(makeTimelyRequest).toHaveBeenCalledWith('/1/teams', 'test-api-key', {
			method: 'GET',
			query: {},
		});
		expect(result).toEqual(mockResponse);
	});

	it('gets a team', async () => {
		const mockResponse = { id: 5, name: 'Team' };
		(makeTimelyRequest as jest.Mock).mockResolvedValue(mockResponse);
		const result = await Teams.get(mockContext, { accountId: 1, id: 5 });
		expect(makeTimelyRequest).toHaveBeenCalledWith(
			'/1/teams/5',
			'test-api-key',
			{
				method: 'GET',
			},
		);
		expect(result).toEqual(mockResponse);
	});

	it('lists tags (labels)', async () => {
		const mockResponse = [{ id: 6, name: 'Tag' }];
		(makeTimelyRequest as jest.Mock).mockResolvedValue(mockResponse);
		const result = await Tags.list(mockContext, { accountId: 1 });
		expect(makeTimelyRequest).toHaveBeenCalledWith(
			'/1/labels',
			'test-api-key',
			{
				method: 'GET',
				query: {},
			},
		);
		expect(result).toEqual(mockResponse);
	});

	it('gets a tag', async () => {
		const mockResponse = { id: 6, name: 'Tag' };
		(makeTimelyRequest as jest.Mock).mockResolvedValue(mockResponse);
		const result = await Tags.get(mockContext, { accountId: 1, id: 6 });
		expect(makeTimelyRequest).toHaveBeenCalledWith(
			'/1/labels/6',
			'test-api-key',
			{
				method: 'GET',
			},
		);
		expect(result).toEqual(mockResponse);
	});

	it('lists time entries (events)', async () => {
		const mockResponse = [{ id: 7, note: 'Work' }];
		(makeTimelyRequest as jest.Mock).mockResolvedValue(mockResponse);
		const result = await TimeEntries.list(mockContext, {
			accountId: 1,
			page: 1,
		});
		expect(makeTimelyRequest).toHaveBeenCalledWith(
			'/1/events',
			'test-api-key',
			{
				method: 'GET',
				query: { page: 1 },
			},
		);
		expect(result).toEqual(mockResponse);
	});

	it('gets a time entry', async () => {
		const mockResponse = { id: 7, note: 'Work' };
		(makeTimelyRequest as jest.Mock).mockResolvedValue(mockResponse);
		const result = await TimeEntries.get(mockContext, { accountId: 1, id: 7 });
		expect(makeTimelyRequest).toHaveBeenCalledWith(
			'/1/events/7',
			'test-api-key',
			{
				method: 'GET',
			},
		);
		expect(result).toEqual(mockResponse);
	});

	it('lists reports', async () => {
		const mockResponse = [{ id: 8, title: 'Report' }];
		(makeTimelyRequest as jest.Mock).mockResolvedValue(mockResponse);
		const result = await Reports.list(mockContext, { accountId: 1 });
		expect(makeTimelyRequest).toHaveBeenCalledWith(
			'/1/reports',
			'test-api-key',
			{
				method: 'GET',
				query: {},
			},
		);
		expect(result).toEqual(mockResponse);
	});

	it('gets a report', async () => {
		const mockResponse = { id: 8, title: 'Report' };
		(makeTimelyRequest as jest.Mock).mockResolvedValue(mockResponse);
		const result = await Reports.get(mockContext, { accountId: 1, id: 8 });
		expect(makeTimelyRequest).toHaveBeenCalledWith(
			'/1/reports/8',
			'test-api-key',
			{
				method: 'GET',
			},
		);
		expect(result).toEqual(mockResponse);
	});

	it('rejects invalid list input', async () => {
		await expect(Accounts.list(mockContext, { page: 0 })).rejects.toThrow();
		expect(makeTimelyRequest).not.toHaveBeenCalled();
	});

	it('plugin factory works', () => {
		const plugin = timely({ key: 'k' });
		expect(plugin.id).toBe('timely');
	});
});
