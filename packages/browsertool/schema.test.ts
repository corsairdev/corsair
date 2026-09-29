import { BrowserToolSchema } from './schema';
import { BrowserToolExecution, BrowserToolTask } from './schema/database';

describe('BrowserTool schema', () => {
	it('declares a semver version', () => {
		expect(BrowserToolSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares official execution and task entities', () => {
		expect(Object.keys(BrowserToolSchema.entities)).toEqual([
			'executions',
			'tasks',
		]);
	});

	it('accepts the documented toolkit envelope', () => {
		expect(
			BrowserToolExecution.parse({
				data: 'task started',
				error: null,
				successful: true,
			}),
		).toMatchObject({ successful: true });
	});

	it('accepts WatchTask fields from the official docs', () => {
		expect(
			BrowserToolTask.parse({
				taskId: 'task_1',
				sessionId: 'sess_1',
				status: 'finished',
				is_success: true,
				current_url: 'https://example.com',
				outputFiles: [{ fileId: 'f1' }],
			}).status,
		).toBe('finished');
	});
});
