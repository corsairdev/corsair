import {
	ChatMessagesCreateInputSchema,
	ClickupEndpointInputSchemas,
	ClickupEndpointOutputSchemas,
	CustomFieldsSetValueInputSchema,
	DependenciesAddInputSchema,
	DocsCreateInputSchema,
	GuestsInviteInputSchema,
	KeyResultsCreateInputSchema,
	SpacesTagsGetResponseSchema,
	TasksAttachmentsCreateInputSchema,
	TasksDeleteResponseSchema,
	TasksGetResponseSchema,
	TasksUpdateInputSchema,
	TimeEntriesCreateInputSchema,
	WorkspaceAclUpdateInputSchema,
} from './endpoints/types';
import { ClickupSchema } from './schema';

type Parsable = {
	// unknown: registry holds heterogeneous schemas; safeParse accepts unknown.
	safeParse: (data: unknown) => { success: boolean };
};

type SchemaCase = {
	name: string;
	schema: Parsable;
	// unknown: fixtures intentionally cover many shapes; Zod validates each one.
	valid: unknown;
	// unknown: fixtures intentionally cover many shapes; Zod validates each one.
	invalid: unknown;
};

const INPUT_CASES: SchemaCase[] = [
	{
		name: 'tasksList',
		schema: ClickupEndpointInputSchemas.tasksList,
		valid: { list_id: 'list1', page: 0 },
		invalid: {},
	},
	{
		name: 'tasksFilteredTeam',
		schema: ClickupEndpointInputSchemas.tasksFilteredTeam,
		valid: { team_id: 'team1', list_ids: ['list1'] },
		invalid: {},
	},
	{
		name: 'tasksCreate',
		schema: ClickupEndpointInputSchemas.tasksCreate,
		valid: { list_id: 'list1', name: 'Task' },
		invalid: { list_id: 'list1' },
	},
	{
		name: 'tasksUpdate',
		schema: ClickupEndpointInputSchemas.tasksUpdate,
		valid: { task_id: 'task1', name: 'Renamed' },
		invalid: { task_id: 'task1' },
	},
	{
		name: 'dependenciesAdd',
		schema: DependenciesAddInputSchema,
		valid: { task_id: 'task1', depends_on: 'task2' },
		invalid: { task_id: 'task1' },
	},
	{
		name: 'chatMessagesCreate',
		schema: ChatMessagesCreateInputSchema,
		valid: {
			workspace_id: 'ws1',
			channel_id: 'ch1',
			type: 'message',
			content: 'hi',
		},
		invalid: {
			workspace_id: 'ws1',
			channel_id: 'ch1',
			type: 'shout',
			content: 'hi',
		},
	},
	{
		name: 'customFieldsSetValue',
		schema: CustomFieldsSetValueInputSchema,
		valid: { task_id: 'task1', field_id: 'f1', value: 'text' },
		invalid: { task_id: 'task1', field_id: 'f1' },
	},
	{
		name: 'keyResultsCreate',
		schema: KeyResultsCreateInputSchema,
		valid: { goal_id: 'goal1', name: 'KR', owners: [1], type: 'number' },
		invalid: { goal_id: 'goal1', name: 'KR', owners: [1], type: 'vibes' },
	},
	{
		name: 'timeEntriesCreate',
		schema: TimeEntriesCreateInputSchema,
		valid: { team_id: 'team1', duration: 60 },
		invalid: {},
	},
	{
		name: 'docsCreate',
		schema: DocsCreateInputSchema,
		valid: { workspace_id: 'ws1', name: 'Doc', visibility: 'PRIVATE' },
		invalid: { workspace_id: 'ws1', name: 'Doc', visibility: 'SECRET' },
	},
	{
		name: 'guestsInvite',
		schema: GuestsInviteInputSchema,
		valid: { team_id: 'team1', email: 'guest@example.com' },
		invalid: { team_id: 'team1' },
	},
	{
		name: 'workspaceAclUpdate',
		schema: WorkspaceAclUpdateInputSchema,
		valid: {
			workspace_id: 'ws1',
			object_type: 'list',
			object_id: 'list1',
			grants: [{ kind: 'user', id: 'u1', permission_level: 4 }],
		},
		invalid: {
			workspace_id: 'ws1',
			object_type: 'whitepaper',
			object_id: 'list1',
		},
	},
	{
		name: 'tasksAttachmentsCreate',
		schema: TasksAttachmentsCreateInputSchema,
		valid: { task_id: 'task1', filename: 'a.txt', file_base64: 'aGk=' },
		invalid: { task_id: 'task1', filename: 'a.txt' },
	},
];

describe('Clickup schema', () => {
	it('declares a semver version', () => {
		expect(ClickupSchema.version).toBeDefined();
		expect(ClickupSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof ClickupSchema.entities).toBe('object');
		expect(ClickupSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(ClickupSchema.entities))).toBe(true);
		for (const entity of Object.values(ClickupSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

describe('endpoint schema registry', () => {
	it('exposes matching input and output schemas for every operation', () => {
		const inputs = Object.keys(ClickupEndpointInputSchemas).sort();
		const outputs = Object.keys(ClickupEndpointOutputSchemas).sort();

		expect(inputs.length).toBeGreaterThan(100);
		expect(outputs).toEqual(inputs);
	});

	for (const entry of INPUT_CASES) {
		it(`validates ${entry.name} inputs`, () => {
			expect(entry.schema.safeParse(entry.valid).success).toBe(true);
			expect(entry.schema.safeParse(entry.invalid).success).toBe(false);
		});
	}
});

describe('endpoint schemas', () => {
	it('rejects task updates with only task_id', () => {
		expect(TasksUpdateInputSchema.safeParse({ task_id: 'task1' }).success).toBe(
			false,
		);
	});

	it('accepts task updates with at least one mutable field', () => {
		expect(
			TasksUpdateInputSchema.safeParse({
				task_id: 'task1',
				name: 'Renamed',
			}).success,
		).toBe(true);
	});

	it('declares delete responses as no content', () => {
		expect(TasksDeleteResponseSchema.safeParse(undefined).success).toBe(true);
		expect(TasksDeleteResponseSchema.safeParse({}).success).toBe(false);
	});

	it('rejects dependencies with both or neither link side', () => {
		expect(
			DependenciesAddInputSchema.safeParse({
				task_id: 'task1',
				depends_on: 'a',
				dependency_of: 'b',
			}).success,
		).toBe(false);
		expect(
			DependenciesAddInputSchema.safeParse({ task_id: 'task1' }).success,
		).toBe(false);
	});

	it('keeps forward-compatible fields on task responses', () => {
		const parsed = TasksGetResponseSchema.parse({
			id: 'task1',
			name: 'Task',
			status: 'open',
		});

		expect(parsed.id).toBe('task1');
		expect('status' in parsed).toBe(true);
	});

	it('accepts documented space tags without an id', () => {
		const parsed = SpacesTagsGetResponseSchema.parse({
			tags: [{ name: 'Tag name', tag_fg: '#000000', tag_bg: '#000000' }],
		});

		expect(parsed.tags?.[0]?.name).toBe('Tag name');
		expect(SpacesTagsGetResponseSchema.safeParse({ tags: [{}] }).success).toBe(
			false,
		);
	});
});
