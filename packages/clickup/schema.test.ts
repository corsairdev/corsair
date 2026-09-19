import {
	TasksDeleteResponseSchema,
	TasksUpdateInputSchema,
} from './endpoints/types';
import { ClickupSchema } from './schema';

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
});
