import { logEventFromContext } from 'corsair/core';
import * as client from './client';
import {
	Bookings,
	Categories,
	CustomFields,
	Events,
	Milestones,
	Projects,
	Resources,
	TimeEntries,
} from './endpoints';
import type { HubPlannerContext } from './index';
import { hubplanner } from './index';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn() };
});

jest.mock('./client', () => {
	const actual = jest.requireActual('./client');
	return { ...actual, makeHubPlannerRequest: jest.fn() };
});

const mockedRequest = jest.mocked(client.makeHubPlannerRequest);
const mockedLogEvent = jest.mocked(logEventFromContext);

function buildCtx(): HubPlannerContext {
	const ctx: HubPlannerContext = {
		endpoints: {},
		$getAccountId: () => Promise.resolve('test-account'),
		key: 'test-hubplanner-key',
		options: {},
		keys: {
			get_dek: () => Promise.resolve('test-dek'),
			issue_new_dek: () => Promise.resolve('test-dek'),
			get_api_key: () => Promise.resolve('test-api-key'),
			set_api_key: () => Promise.resolve(),
			get_webhook_signature: () => Promise.resolve(null),
			set_webhook_signature: () => Promise.resolve(),
		},
		db: {},
	};
	return ctx;
}

const ctx = buildCtx();

beforeEach(() => {
	mockedRequest.mockReset();
	mockedLogEvent.mockReset();
});

describe('Projects Endpoints', () => {
	it('projects.list queries projects with pagination and sorting', async () => {
		const mockProjects = [{ _id: 'p1', name: 'Alpha' }];
		mockedRequest.mockResolvedValueOnce(mockProjects);

		const result = await Projects.list(ctx, {
			page: 1,
			limit: 10,
			sort: 'name',
		});
		expect(result).toEqual(mockProjects);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/project',
			'test-hubplanner-key',
			{
				method: 'GET',
				query: { page: 1, limit: 10, sort: 'name' },
			},
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'hubplanner.projects.list',
			{ count: 1 },
			'completed',
		);
	});

	it('projects.get retrieves project by ID', async () => {
		const mockProject = { _id: 'p1', name: 'Alpha' };
		mockedRequest.mockResolvedValueOnce(mockProject);

		const result = await Projects.get(ctx, { projectId: 'p1' });
		expect(result).toEqual(mockProject);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/project/p1',
			'test-hubplanner-key',
			{
				method: 'GET',
			},
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'hubplanner.projects.get',
			{ projectId: 'p1' },
			'completed',
		);
	});

	it('projects.create posts new project', async () => {
		const input = { name: 'New Project', budgetHours: 100 };
		const mockProject = { _id: 'p2', name: 'New Project', budgetHours: 100 };
		mockedRequest.mockResolvedValueOnce(mockProject);

		const result = await Projects.create(ctx, input);
		expect(result).toEqual(mockProject);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/project',
			'test-hubplanner-key',
			{
				method: 'POST',
				body: input,
			},
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'hubplanner.projects.create',
			{ projectId: 'p2' },
			'completed',
		);
	});

	it('projects.update patches project array', async () => {
		const updates = [{ _id: 'p1', name: 'Updated' }];
		mockedRequest.mockResolvedValueOnce(updates);

		const result = await Projects.update(ctx, { projects: updates });
		expect(result).toEqual(updates);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/project',
			'test-hubplanner-key',
			{
				method: 'PATCH',
				body: updates,
			},
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'hubplanner.projects.update',
			{ count: 1 },
			'completed',
		);
	});

	it('projects.delete removes project by ID', async () => {
		mockedRequest.mockResolvedValueOnce({ success: true });

		const result = await Projects.delete(ctx, { projectId: 'p1' });
		expect(result).toEqual({ success: true });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/project/p1',
			'test-hubplanner-key',
			{
				method: 'DELETE',
			},
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'hubplanner.projects.delete',
			{ projectId: 'p1' },
			'completed',
		);
	});

	it('projects.deleteBulk removes multiple projects', async () => {
		mockedRequest.mockResolvedValueOnce({ success: true });

		const result = await Projects.deleteBulk(ctx, { projectIds: ['p1', 'p2'] });
		expect(result).toEqual({ success: true });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/project',
			'test-hubplanner-key',
			{
				method: 'DELETE',
				body: ['p1', 'p2'],
			},
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'hubplanner.projects.deleteBulk',
			{ count: 2 },
			'completed',
		);
	});

	it('projects.search queries matching projects', async () => {
		const mockProjects = [{ _id: 'p1', name: 'Alpha' }];
		mockedRequest.mockResolvedValueOnce(mockProjects);

		const result = await Projects.search(ctx, {
			query: { name: 'Alpha' },
			page: 0,
			limit: 20,
		});
		expect(result).toEqual(mockProjects);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/project/search',
			'test-hubplanner-key',
			{
				method: 'POST',
				body: { name: 'Alpha' },
				query: { page: 0, limit: 20, sort: undefined },
			},
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'hubplanner.projects.search',
			{ count: 1 },
			'completed',
		);
	});

	it('projects.addResources and removeResource manage assignments', async () => {
		mockedRequest.mockResolvedValueOnce({ success: true });
		await Projects.addResources(ctx, {
			projectId: 'p1',
			resourceIds: ['r1', 'r2'],
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/project/addResourcesToProject/p1',
			'test-hubplanner-key',
			{
				method: 'POST',
				body: { resourceIds: ['r1', 'r2'] },
			},
		);

		mockedRequest.mockResolvedValueOnce({ success: true });
		await Projects.removeResource(ctx, {
			resourceId: 'r1',
			projectIds: ['p1'],
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/project/removeResourceFromProjects/r1',
			'test-hubplanner-key',
			{
				method: 'POST',
				body: { projectIds: ['p1'] },
			},
		);
	});

	it('projects.addClients and removeClient manage client associations', async () => {
		mockedRequest.mockResolvedValueOnce({ success: true });
		await Projects.addClients(ctx, { projectId: 'p1', clientIds: ['c1'] });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/project/p1/client',
			'test-hubplanner-key',
			{
				method: 'POST',
				body: { clientIds: ['c1'] },
			},
		);

		mockedRequest.mockResolvedValueOnce({ success: true });
		await Projects.removeClient(ctx, { clientId: 'c1', projectIds: ['p1'] });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/project/client/c1',
			'test-hubplanner-key',
			{
				method: 'POST',
				body: { projectIds: ['p1'] },
			},
		);
	});

	it('projects.setProjectManagers updates managers array', async () => {
		const mockUpdated = { _id: 'p1', name: 'Alpha', projectManagers: ['m1'] };
		mockedRequest.mockResolvedValueOnce(mockUpdated);

		const result = await Projects.setProjectManagers(ctx, {
			projectId: 'p1',
			managerIds: ['m1'],
		});
		expect(result).toEqual(mockUpdated);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/project/p1/project-managers',
			'test-hubplanner-key',
			{
				method: 'PUT',
				body: ['m1'],
			},
		);
	});

	it('projects.getTags, addTags, and removeTag manage project tags', async () => {
		const tags = [{ tagId: 't1', value: 'urgent' }];
		mockedRequest.mockResolvedValueOnce(tags);
		const getResult = await Projects.getTags(ctx, { projectId: 'p1' });
		expect(getResult).toEqual(tags);

		mockedRequest.mockResolvedValueOnce({ _id: 'p1', name: 'Alpha', tags });
		await Projects.addTags(ctx, { projectId: 'p1', tags: ['t1'] });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/project/p1/tag',
			'test-hubplanner-key',
			{
				method: 'PATCH',
				body: { tags: ['t1'] },
			},
		);

		mockedRequest.mockResolvedValueOnce({ success: true });
		await Projects.removeTag(ctx, { projectId: 'p1', tagId: 't1' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/project/p1/tag/t1',
			'test-hubplanner-key',
			{
				method: 'DELETE',
			},
		);
	});
});

describe('Resources Endpoints', () => {
	it('resources.list queries resources', async () => {
		const mockResources = [{ _id: 'r1', firstName: 'John', lastName: 'Doe' }];
		mockedRequest.mockResolvedValueOnce(mockResources);

		const result = await Resources.list(ctx, { page: 0, limit: 10 });
		expect(result).toEqual(mockResources);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/resource',
			'test-hubplanner-key',
			{
				method: 'GET',
				query: { page: 0, limit: 10, sort: undefined },
			},
		);
	});

	it('resources.get retrieves a resource', async () => {
		const mockResource = { _id: 'r1', firstName: 'John', lastName: 'Doe' };
		mockedRequest.mockResolvedValueOnce(mockResource);

		const result = await Resources.get(ctx, { resourceId: 'r1' });
		expect(result).toEqual(mockResource);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/resource/r1',
			'test-hubplanner-key',
			{
				method: 'GET',
			},
		);
	});

	it('resources.create creates a new resource', async () => {
		const input = {
			firstName: 'Alice',
			lastName: 'Wonder',
			email: 'alice@example.com',
		};
		const mockCreated = { _id: 'r2', ...input };
		mockedRequest.mockResolvedValueOnce(mockCreated);

		const result = await Resources.create(ctx, input);
		expect(result).toEqual(mockCreated);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/resource',
			'test-hubplanner-key',
			{
				method: 'POST',
				body: input,
			},
		);
	});

	it('resources.update updates resources', async () => {
		const updates = [{ _id: 'r1', firstName: 'Jonathan', lastName: 'Doe' }];
		mockedRequest.mockResolvedValueOnce(updates);

		const result = await Resources.update(ctx, { resources: updates });
		expect(result).toEqual(updates);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/resource',
			'test-hubplanner-key',
			{
				method: 'PATCH',
				body: updates,
			},
		);
	});

	it('resources.delete and deleteBulk remove resources', async () => {
		mockedRequest.mockResolvedValueOnce({ success: true });
		await Resources.delete(ctx, { resourceId: 'r1' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/resource/r1',
			'test-hubplanner-key',
			{
				method: 'DELETE',
			},
		);

		mockedRequest.mockResolvedValueOnce({ success: true });
		await Resources.deleteBulk(ctx, { resourceIds: ['r1', 'r2'] });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/resource',
			'test-hubplanner-key',
			{
				method: 'DELETE',
				body: ['r1', 'r2'],
			},
		);
	});

	it('resources.search queries resources with filter', async () => {
		const mockResources = [{ _id: 'r1', firstName: 'John', lastName: 'Doe' }];
		mockedRequest.mockResolvedValueOnce(mockResources);

		const result = await Resources.search(ctx, {
			query: { firstName: 'John' },
		});
		expect(result).toEqual(mockResources);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/resource/search',
			'test-hubplanner-key',
			{
				method: 'POST',
				body: { firstName: 'John' },
				query: { page: undefined, limit: undefined, sort: undefined },
			},
		);
	});

	it('resources.getTags, addTags, and removeTag manage tags', async () => {
		const tags = [{ tagId: 'rt1', value: 'frontend' }];
		mockedRequest.mockResolvedValueOnce(tags);
		const getTagsRes = await Resources.getTags(ctx, { resourceId: 'r1' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/resource/r1/tag',
			'test-hubplanner-key',
			{ method: 'GET' },
		);
		expect(getTagsRes).toEqual(tags);

		mockedRequest.mockResolvedValueOnce({
			_id: 'r1',
			firstName: 'John',
			lastName: 'Doe',
			tags,
		});
		const addTagsRes = await Resources.addTags(ctx, {
			resourceId: 'r1',
			tags: ['rt1'],
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/resource/r1/tag',
			'test-hubplanner-key',
			{ method: 'PATCH', body: { tags: ['rt1'] } },
		);
		expect(addTagsRes._id).toBe('r1');

		mockedRequest.mockResolvedValueOnce({ success: true });
		const removeTagRes = await Resources.removeTag(ctx, {
			resourceId: 'r1',
			tagId: 'rt1',
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/resource/r1/tag/rt1',
			'test-hubplanner-key',
			{ method: 'DELETE' },
		);
		expect(removeTagRes.success).toBe(true);
	});
});

describe('Bookings Endpoints', () => {
	it('bookings.list, get, create, update, patch, search, delete, and deleteBulk', async () => {
		const mockBooking = {
			_id: 'b1',
			resource: 'r1',
			project: 'p1',
			start: '2026-11-01',
			end: '2026-11-05',
		};

		mockedRequest.mockResolvedValueOnce([mockBooking]);
		await Bookings.list(ctx, { page: 0, limit: 20 });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/booking',
			'test-hubplanner-key',
			{
				method: 'GET',
				query: expect.objectContaining({ page: 0, limit: 20 }),
			},
		);

		mockedRequest.mockResolvedValueOnce(mockBooking);
		await Bookings.get(ctx, { bookingId: 'b1' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/booking/b1',
			'test-hubplanner-key',
			{
				method: 'GET',
			},
		);

		mockedRequest.mockResolvedValueOnce(mockBooking);
		await Bookings.create(ctx, {
			resource: 'r1',
			project: 'p1',
			start: '2026-11-01',
			end: '2026-11-05',
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/booking',
			'test-hubplanner-key',
			{
				method: 'POST',
				body: expect.objectContaining({ resource: 'r1', project: 'p1' }),
			},
		);

		mockedRequest.mockResolvedValueOnce(mockBooking);
		await Bookings.update(ctx, {
			bookingId: 'b1',
			resource: 'r1',
			project: 'p1',
			start: '2026-11-01',
			end: '2026-11-06',
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/booking/b1',
			'test-hubplanner-key',
			{
				method: 'PUT',
				body: expect.objectContaining({ resource: 'r1', project: 'p1' }),
			},
		);

		mockedRequest.mockResolvedValueOnce(mockBooking);
		await Bookings.patch(ctx, {
			bookingId: 'b1',
			type: 'APPROVED',
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/booking/b1',
			'test-hubplanner-key',
			{
				method: 'PATCH',
				body: { type: 'APPROVED' },
			},
		);

		mockedRequest.mockResolvedValueOnce([mockBooking]);
		await Bookings.search(ctx, { query: { resource: 'r1' } });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/booking/search',
			'test-hubplanner-key',
			{
				method: 'POST',
				body: { resource: 'r1' },
				query: expect.any(Object),
			},
		);

		mockedRequest.mockResolvedValueOnce({ success: true });
		await Bookings.delete(ctx, { bookingId: 'b1' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/booking/b1',
			'test-hubplanner-key',
			{
				method: 'DELETE',
			},
		);

		mockedRequest.mockResolvedValueOnce({ success: true });
		await Bookings.deleteBulk(ctx, { ids: ['b1', 'b2'] });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/booking',
			'test-hubplanner-key',
			{
				method: 'DELETE',
				body: ['b1', 'b2'],
				query: { ids: 'b1,b2' },
			},
		);
	});
});

describe('TimeEntries Endpoints', () => {
	it('timeEntries.list, get, create, search, update, delete, and deleteBulk', async () => {
		const mockEntry = {
			_id: 'te1',
			resource: 'r1',
			project: 'p1',
			date: '2026-11-02',
			minutes: 240,
		};

		mockedRequest.mockResolvedValueOnce([mockEntry]);
		await TimeEntries.list(ctx, { page: 0, limit: 10 });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/timeentry',
			'test-hubplanner-key',
			{
				method: 'GET',
				query: expect.objectContaining({ page: 0, limit: 10 }),
			},
		);

		mockedRequest.mockResolvedValueOnce(mockEntry);
		await TimeEntries.get(ctx, { timeEntryId: 'te1' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/timeentry/te1',
			'test-hubplanner-key',
			{
				method: 'GET',
			},
		);

		mockedRequest.mockResolvedValueOnce(mockEntry);
		await TimeEntries.create(ctx, {
			resource: 'r1',
			project: 'p1',
			date: '2026-11-02',
			minutes: 240,
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/timeentry',
			'test-hubplanner-key',
			{
				method: 'POST',
				body: expect.objectContaining({ minutes: 240 }),
			},
		);

		mockedRequest.mockResolvedValueOnce([mockEntry]);
		await TimeEntries.search(ctx, { query: { resource: 'r1' } });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/timeentry/search',
			'test-hubplanner-key',
			{
				method: 'POST',
				body: { resource: 'r1' },
				query: expect.any(Object),
			},
		);

		mockedRequest.mockResolvedValueOnce(mockEntry);
		await TimeEntries.update(ctx, {
			timeEntryId: 'te1',
			resource: 'r1',
			project: 'p1',
			date: '2026-11-02',
			minutes: 300,
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/timeentry/te1',
			'test-hubplanner-key',
			{
				method: 'PUT',
				body: expect.objectContaining({ minutes: 300 }),
			},
		);

		mockedRequest.mockResolvedValueOnce({ success: true });
		await TimeEntries.delete(ctx, { timeEntryId: 'te1' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/timeentry/te1',
			'test-hubplanner-key',
			{
				method: 'DELETE',
			},
		);

		mockedRequest.mockResolvedValueOnce({ success: true });
		await TimeEntries.deleteBulk(ctx, { ids: ['te1', 'te2'] });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/timeentry',
			'test-hubplanner-key',
			{
				method: 'DELETE',
				body: ['te1', 'te2'],
			},
		);
	});
});

describe('Categories Endpoints', () => {
	it('categories booking and cost operations', async () => {
		const mockCategory = { _id: 'cat1', name: 'Design' };
		const mockCostCategory = { _id: 'cc1', name: 'Travel' };

		mockedRequest.mockResolvedValueOnce([mockCategory]);
		await Categories.list(ctx, {});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/categories',
			'test-hubplanner-key',
			{ method: 'GET' },
		);

		mockedRequest.mockResolvedValueOnce(mockCategory);
		await Categories.get(ctx, { categoryId: 'cat1' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/categories/cat1',
			'test-hubplanner-key',
			{ method: 'GET' },
		);

		mockedRequest.mockResolvedValueOnce(mockCategory);
		await Categories.create(ctx, { groupId: 'g1', name: 'Design' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/categories',
			'test-hubplanner-key',
			{
				method: 'POST',
				body: { groupId: 'g1', name: 'Design' },
			},
		);

		mockedRequest.mockResolvedValueOnce(mockCategory);
		await Categories.update(ctx, {
			categoryId: 'cat1',
			name: 'Design Updated',
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/categories/cat1',
			'test-hubplanner-key',
			{
				method: 'PUT',
				body: { name: 'Design Updated' },
			},
		);

		mockedRequest.mockResolvedValueOnce([mockCategory]);
		await Categories.search(ctx, { query: { name: 'Design' } });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/categories/search',
			'test-hubplanner-key',
			{
				method: 'POST',
				body: { name: 'Design' },
			},
		);

		mockedRequest.mockResolvedValueOnce([{ _id: 'g1', name: 'Group 1' }]);
		await Categories.listGroups(ctx, {});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/category-groups',
			'test-hubplanner-key',
			{ method: 'GET' },
		);

		mockedRequest.mockResolvedValueOnce([mockCostCategory]);
		await Categories.listCostCategories(ctx, {});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/costCategories',
			'test-hubplanner-key',
			{ method: 'GET' },
		);

		mockedRequest.mockResolvedValueOnce(mockCostCategory);
		await Categories.getCostCategory(ctx, { costCategoryId: 'cc1' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/costCategories/cc1',
			'test-hubplanner-key',
			{ method: 'GET' },
		);

		mockedRequest.mockResolvedValueOnce(mockCostCategory);
		await Categories.createCostCategory(ctx, { name: 'Travel' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/costCategories',
			'test-hubplanner-key',
			{
				method: 'POST',
				body: { name: 'Travel' },
			},
		);

		mockedRequest.mockResolvedValueOnce(mockCostCategory);
		await Categories.updateCostCategory(ctx, {
			costCategoryId: 'cc1',
			name: 'Airfare',
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/costCategories/cc1',
			'test-hubplanner-key',
			{
				method: 'PUT',
				body: { name: 'Airfare' },
			},
		);

		mockedRequest.mockResolvedValueOnce([mockCostCategory]);
		await Categories.searchCostCategories(ctx, { query: { name: 'Travel' } });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/costCategories/search',
			'test-hubplanner-key',
			{
				method: 'POST',
				body: { name: 'Travel' },
			},
		);

		mockedRequest.mockResolvedValueOnce({ success: true });
		await Categories.deleteCostCategory(ctx, { costCategoryId: 'cc1' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/costCategories/cc1',
			'test-hubplanner-key',
			{ method: 'DELETE' },
		);
	});
});

describe('CustomFields Endpoints', () => {
	it('customFields operations for resource and project entities', async () => {
		const mockTemplate = { _id: 'cf1', type: 'TEXT', label: 'Field 1' };

		mockedRequest.mockResolvedValueOnce([mockTemplate]);
		await CustomFields.list(ctx, { entityType: 'project' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/project/customField/template',
			'test-hubplanner-key',
			{ method: 'GET' },
		);

		mockedRequest.mockResolvedValueOnce(mockTemplate);
		await CustomFields.get(ctx, { entityType: 'resource', id: 'cf1' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/resource/customField/template/cf1',
			'test-hubplanner-key',
			{ method: 'GET' },
		);

		mockedRequest.mockResolvedValueOnce(mockTemplate);
		await CustomFields.create(ctx, {
			entityType: 'project',
			type: 'TEXT',
			label: 'Field 1',
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/project/customField/template',
			'test-hubplanner-key',
			{
				method: 'POST',
				body: { type: 'TEXT', label: 'Field 1' },
			},
		);

		mockedRequest.mockResolvedValueOnce(mockTemplate);
		await CustomFields.update(ctx, {
			entityType: 'resource',
			id: 'cf1',
			type: 'TEXT',
			label: 'Updated',
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/resource/customField/template/cf1',
			'test-hubplanner-key',
			{
				method: 'PUT',
				body: { _id: 'cf1', type: 'TEXT', label: 'Updated' },
			},
		);

		mockedRequest.mockResolvedValueOnce({ success: true });
		await CustomFields.delete(ctx, { entityType: 'project', id: 'cf1' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/project/customField/template/cf1',
			'test-hubplanner-key',
			{ method: 'DELETE' },
		);

		mockedRequest.mockResolvedValueOnce([mockTemplate]);
		await CustomFields.search(ctx, { entityType: 'resource', query: {} });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/resource/customField/template/search',
			'test-hubplanner-key',
			{
				method: 'POST',
				body: {},
			},
		);

		mockedRequest.mockResolvedValueOnce(mockTemplate);
		await CustomFields.addChoices(ctx, {
			entityType: 'project',
			id: 'cf1',
			choices: [{ value: 'A' }],
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/project/customField/template/cf1/addChoices',
			'test-hubplanner-key',
			{
				method: 'POST',
				body: [{ value: 'A' }],
			},
		);
	});
});

describe('Milestones Endpoints', () => {
	it('milestones.list, get, create, update, delete, search', async () => {
		const mockMilestone = {
			_id: 'm1',
			name: 'Launch',
			date: '2026-12-01',
			project: 'p1',
		};

		mockedRequest.mockResolvedValueOnce([mockMilestone]);
		await Milestones.list(ctx, { page: 0, limit: 10 });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/milestone',
			'test-hubplanner-key',
			{
				method: 'GET',
				query: expect.any(Object),
			},
		);

		mockedRequest.mockResolvedValueOnce(mockMilestone);
		await Milestones.get(ctx, { milestoneId: 'm1' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/milestone/m1',
			'test-hubplanner-key',
			{ method: 'GET' },
		);

		mockedRequest.mockResolvedValueOnce(mockMilestone);
		await Milestones.create(ctx, {
			name: 'Launch',
			date: '2026-12-01',
			project: 'p1',
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/milestone',
			'test-hubplanner-key',
			{
				method: 'POST',
				body: expect.objectContaining({ name: 'Launch' }),
			},
		);

		mockedRequest.mockResolvedValueOnce(mockMilestone);
		await Milestones.update(ctx, {
			milestoneId: 'm1',
			name: 'Launch Final',
			date: '2026-12-01',
			project: 'p1',
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/milestone/m1',
			'test-hubplanner-key',
			{
				method: 'PUT',
				body: expect.objectContaining({ name: 'Launch Final' }),
			},
		);

		mockedRequest.mockResolvedValueOnce({ success: true });
		await Milestones.delete(ctx, { milestoneId: 'm1' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/milestone/m1',
			'test-hubplanner-key',
			{ method: 'DELETE' },
		);

		mockedRequest.mockResolvedValueOnce([mockMilestone]);
		await Milestones.search(ctx, { query: { project: 'p1' } });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/milestone/search',
			'test-hubplanner-key',
			{
				method: 'POST',
				body: { project: 'p1' },
				query: expect.any(Object),
			},
		);
	});
});

describe('Events Endpoints', () => {
	it('events.list, get, create, update, delete, search', async () => {
		const mockEvent = { _id: 'e1', name: 'Holiday Party' };

		mockedRequest.mockResolvedValueOnce([mockEvent]);
		await Events.list(ctx, { page: 0, limit: 10 });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/event',
			'test-hubplanner-key',
			{
				method: 'GET',
				query: expect.any(Object),
			},
		);

		mockedRequest.mockResolvedValueOnce(mockEvent);
		await Events.get(ctx, { eventId: 'e1' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/event/e1',
			'test-hubplanner-key',
			{ method: 'GET' },
		);

		mockedRequest.mockResolvedValueOnce(mockEvent);
		await Events.create(ctx, { name: 'Holiday Party' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/event',
			'test-hubplanner-key',
			{
				method: 'POST',
				body: { name: 'Holiday Party' },
			},
		);

		mockedRequest.mockResolvedValueOnce(mockEvent);
		await Events.update(ctx, { eventId: 'e1', name: 'Holiday Party 2026' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/event/e1',
			'test-hubplanner-key',
			{
				method: 'PUT',
				body: { _id: 'e1', name: 'Holiday Party 2026' },
			},
		);

		mockedRequest.mockResolvedValueOnce({ success: true });
		await Events.delete(ctx, { eventId: 'e1' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/event/e1',
			'test-hubplanner-key',
			{ method: 'DELETE' },
		);

		mockedRequest.mockResolvedValueOnce([mockEvent]);
		await Events.search(ctx, { query: { name: 'Holiday' } });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/event/search',
			'test-hubplanner-key',
			{
				method: 'POST',
				body: { name: 'Holiday' },
				query: expect.any(Object),
			},
		);
	});
});

describe('Invalid input rejection before network I/O', () => {
	it('rejects invalid inputs before calling makeHubPlannerRequest', async () => {
		let caughtError: unknown;
		try {
			await Projects.get(ctx, { projectId: '' });
		} catch (err: unknown) {
			// `unknown` because caught rejection is untyped at runtime; narrowed by expect/assertions below.
			caughtError = err;
		}
		expect(caughtError).toBeDefined();
		expect(mockedRequest).not.toHaveBeenCalled();

		caughtError = undefined;
		try {
			await Resources.create(ctx, { firstName: '', lastName: 'Doe' });
		} catch (err: unknown) {
			// `unknown` because caught rejection is untyped at runtime; narrowed by expect/assertions below.
			caughtError = err;
		}
		expect(caughtError).toBeDefined();
		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('Hub Planner plugin metadata and registry synchronization', () => {
	it('matches nested endpoint operations with schemas and metadata entries', () => {
		const plugin = hubplanner({});
		const registeredKeys: string[] = [];

		for (const [groupKey, groupEndpoints] of Object.entries(
			plugin.endpoints ?? {},
		)) {
			// `unknown` because plugin endpoint groups are dynamically iterated over runtime records
			const endpointsGroup = groupEndpoints as Record<string, unknown>;
			for (const actionKey of Object.keys(endpointsGroup)) {
				registeredKeys.push(`${groupKey}.${actionKey}`);
			}
		}

		const schemaKeys = Object.keys(plugin.endpointSchemas ?? {});
		const metaKeys = Object.keys(plugin.endpointMeta ?? {});

		registeredKeys.sort();
		schemaKeys.sort();
		metaKeys.sort();

		expect(schemaKeys).toEqual(registeredKeys);
		expect(metaKeys).toEqual(registeredKeys);
	});

	it('configures api_key auth and empty webhooks', () => {
		const plugin = hubplanner({ key: 'test-key' });
		expect(plugin.authConfig).toEqual({ api_key: {} });
		expect(plugin.webhooks).toEqual({});
	});
});
