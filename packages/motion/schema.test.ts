import { MotionEndpointOutputSchemas } from './endpoints/types';
import { MotionSchema } from './schema';

describe('Motion schema', () => {
	it('declares a semver version', () => {
		expect(MotionSchema.version).toBeDefined();
		expect(MotionSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof MotionSchema.entities).toBe('object');
		expect(MotionSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(MotionSchema.entities))).toBe(true);
		for (const entity of Object.values(MotionSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.

describe('Motion task output', () => {
	it('declares and parses the documented task fields', () => {
		const schema = MotionEndpointOutputSchemas.getTask;
		expect(Object.keys(schema.shape)).toEqual(
			expect.arrayContaining([
				'workspace',
				'status',
				'assignees',
				'priority',
				'labels',
				'scheduledStart',
				'scheduledEnd',
				'schedulingIssue',
				'createdTime',
				'chunks',
				'customFieldValues',
			]),
		);
		const task = schema.parse({
			id: 'task-1',
			name: 'Write report',
			workspace: {
				id: 'ws-1',
				name: 'Team',
				teamId: 'team-1',
				type: 'TEAM',
				labels: [],
				statuses: [{ name: 'Todo', isDefaultStatus: true }],
			},
			status: { name: 'Todo', isDefaultStatus: true, isResolvedStatus: false },
			assignees: [{ id: 'u-1', name: 'Ada', email: 'ada@example.com' }],
			priority: 'HIGH',
			labels: [{ name: 'Q4' }],
			scheduledStart: '2026-11-16T09:00:00.000Z',
			schedulingIssue: false,
			createdTime: '2026-11-14T09:00:00.000Z',
			chunks: [{ id: 'c-1', duration: 30, isFixed: false }],
		});
		expect(task.workspace?.id).toBe('ws-1');
		expect(task.assignees?.[0]?.email).toBe('ada@example.com');
		expect(task.chunks?.[0]?.duration).toBe(30);
	});

	it('rejects a malformed assignees list', () => {
		expect(
			MotionEndpointOutputSchemas.getTask.safeParse({
				id: 'task-1',
				assignees: 'ada@example.com',
			}).success,
		).toBe(false);
	});
});
