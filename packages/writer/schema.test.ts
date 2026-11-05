import {
	WriterEndpointInputSchemas,
	WriterEndpointOutputSchemas,
} from './endpoints/types';
import { WriterSchema } from './schema';

describe('Writer schema', () => {
	it('declares a semver version', () => {
		expect(WriterSchema.version).toBeDefined();
		expect(WriterSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof WriterSchema.entities).toBe('object');
		expect(WriterSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(WriterSchema.entities))).toBe(true);
		for (const entity of Object.values(WriterSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});

	it('accepts string or string[] stop for completions', () => {
		expect(() =>
			WriterEndpointInputSchemas.createCompletion.parse({
				model: 'palmyra-x5',
				prompt: 'hello',
				stop: 'END',
			}),
		).not.toThrow();
		expect(() =>
			WriterEndpointInputSchemas.createCompletion.parse({
				model: 'palmyra-x5',
				prompt: 'hello',
				stop: ['END'],
			}),
		).not.toThrow();
	});

	it('rejects stream=true for completion and chat inputs', () => {
		expect(() =>
			WriterEndpointInputSchemas.createCompletion.parse({
				model: 'palmyra-x5',
				prompt: 'hello',
				stream: true,
			}),
		).toThrow();
		expect(() =>
			WriterEndpointInputSchemas.createChat.parse({
				model: 'palmyra-x5',
				messages: [{ role: 'user', content: 'hello' }],
				stream: true,
			}),
		).toThrow();
	});

	it('parses listModels and listApplications response envelopes', () => {
		expect(() =>
			WriterEndpointOutputSchemas.listModels.parse({
				models: [{ id: 'palmyra-x5', name: 'Palmyra X5' }],
			}),
		).not.toThrow();
		expect(() =>
			WriterEndpointOutputSchemas.listApplications.parse({
				data: [{ id: 'app_1', name: 'Writer App' }],
				has_more: false,
			}),
		).not.toThrow();
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
