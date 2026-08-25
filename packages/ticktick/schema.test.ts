import {
	TickTickEndpointOutputSchemas,
	TickTickProjectSchema,
	TickTickTaskSchema,
} from './endpoints/types';
import { TickTickSchema } from './schema';

describe('TickTick schema', () => {
	it('declares a semver version', () => {
		expect(TickTickSchema.version).toBeDefined();
		expect(TickTickSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('parses a realistic task payload with nullable provider fields', () => {
		const parsed = TickTickTaskSchema.parse({
			id: 'task-1',
			projectId: 'proj-1',
			title: 'Review ticktick plugin',
			content: null,
			desc: null,
			priority: null,
			status: 0,
			dueDate: '2026-09-01T03:00:00+0000',
			startDate: null,
			completedTime: null,
			timeZone: 'Asia/Kolkata',
			isAllDay: false,
			columnId: null,
			parentId: null,
			sortOrder: -1099511627776,
			reminders: ['TRIGGER:P0DT9H0M0S'],
			tags: ['oss'],
			repeatFlag: null,
			items: [
				{ id: 'item-1', title: 'verify findings', status: 1 },
				{ title: 'fix findings', status: 0 },
			],
		});

		expect(parsed.status).toBe(0);
		expect(parsed.items?.[0]?.status).toBe(1);
		expect(parsed.tags).toEqual(['oss']);
	});

	it('accepts the documented abandoned/undone/completed status range', () => {
		for (const status of [-1, 0, 2]) {
			const parsed = TickTickTaskSchema.parse({
				id: 'task-1',
				title: 'Any',
				status,
			});
			expect(parsed.status).toBe(status);
		}
	});

	it('rejects undocumented task statuses', () => {
		for (const status of [1, 3, 2.5]) {
			expect(() =>
				TickTickTaskSchema.parse({ id: 'task-1', title: 'Any', status }),
			).toThrow();
		}
	});

	it('accepts every documented project view mode and kind', () => {
		for (const viewMode of ['list', 'kanban', 'timeline'] as const) {
			expect(
				TickTickProjectSchema.parse({ id: 'p', name: 'n', viewMode }).viewMode,
			).toBe(viewMode);
		}
		for (const kind of ['TASK', 'NOTE'] as const) {
			expect(
				TickTickProjectSchema.parse({ id: 'p', name: 'n', kind }).kind,
			).toBe(kind);
		}
	});

	it('parses a project payload carrying shared-project fields', () => {
		const parsed = TickTickEndpointOutputSchemas.getProject.parse({
			id: 'proj-1',
			name: 'Shared',
			closed: false,
			groupId: 'group-1',
			permission: 'write',
			viewMode: 'kanban',
			kind: 'TASK',
		});

		expect(parsed.groupId).toBe('group-1');
		expect(parsed.permission).toBe('write');
	});

	it('parses project-with-data responses including columns', () => {
		const parsed = TickTickEndpointOutputSchemas.getProjectWithData.parse({
			project: { id: 'proj-1', name: 'Board' },
			tasks: [{ id: 'task-1', title: 'Card' }],
			columns: [{ id: 'col-1', name: 'To Do', sortOrder: 0 }],
		});

		expect(parsed.columns?.[0]?.name).toBe('To Do');
		expect(parsed.tasks).toHaveLength(1);
	});

	it('accepts listAll arrays of tasks', () => {
		const parsed = TickTickEndpointOutputSchemas.listAllTasks.parse([
			{ id: 'task-1', title: 'a' },
			{ id: 'task-2', title: 'b' },
		]);

		expect(parsed).toHaveLength(2);
	});

	it('requires the OAuth url response to carry a state value', () => {
		expect(() =>
			TickTickEndpointOutputSchemas.generateAuthUrl.parse({ url: 'x' }),
		).toThrow();

		const parsed = TickTickEndpointOutputSchemas.generateAuthUrl.parse({
			url: 'https://ticktick.com/oauth/authorize?state=abc',
			state: 'abc',
		});
		expect(parsed.state).toBe('abc');
	});
});
