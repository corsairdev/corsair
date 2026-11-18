import { TinyFishSchema } from './schema';

describe('TinyFish schema', () => {
	it('declares a semver version', () => {
		expect(TinyFishSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares only the agentRuns entity', () => {
		expect(Object.keys(TinyFishSchema.entities)).toEqual(['agentRuns']);
	});

	it('accepts a stored run row and coerces its dates', () => {
		const parsed = TinyFishSchema.entities.agentRuns.parse({
			status: 'COMPLETED',
			goal: 'Extract the page title',
			createdAt: '2026-01-02T00:00:00.000Z',
			startedAt: '2026-01-02T00:00:01.000Z',
			numOfSteps: 3,
			result: { title: 'Example' },
			updatedAt: new Date(),
		});

		expect(parsed.status).toBe('COMPLETED');
		expect(parsed.startedAt).toBeInstanceOf(Date);
	});

	it('accepts a minimal queued row without a goal', () => {
		const parsed = TinyFishSchema.entities.agentRuns.parse({
			status: 'PENDING',
			updatedAt: new Date(),
		});

		expect(parsed.goal).toBeUndefined();
	});

	it('rejects rows without the required status', () => {
		expect(() =>
			TinyFishSchema.entities.agentRuns.parse({ goal: 'no status' }),
		).toThrow();
	});
});
