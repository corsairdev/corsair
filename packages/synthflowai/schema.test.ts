import { SynthflowAiSchema } from './schema';

describe('SynthflowAi schema', () => {
	it('declares a semver version', () => {
		expect(SynthflowAiSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof SynthflowAiSchema.entities).toBe('object');
		expect(SynthflowAiSchema.entities).not.toBeNull();
		expect(Array.isArray(SynthflowAiSchema.entities)).toBe(false);
		expect(Object.keys(SynthflowAiSchema.entities).sort()).toEqual([
			'actions',
			'assistants',
			'calls',
			'contacts',
			'knowledgeBases',
			'memoryStores',
			'phoneBooks',
			'voices',
		]);
	});
});
