import {
	ClaidAiEndpointInputSchemas,
	ClaidAiEndpointOutputSchemas,
} from './endpoints/types';
import { ClaidAiSchema } from './schema';

describe('ClaidAi schema', () => {
	it('declares a semver version', () => {
		expect(ClaidAiSchema.version).toBeDefined();
		expect(ClaidAiSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof ClaidAiSchema.entities).toBe('object');
		expect(ClaidAiSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(ClaidAiSchema.entities))).toBe(true);
		for (const entity of Object.values(ClaidAiSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});

	it('validates storage input shapes', () => {
		expect(
			ClaidAiEndpointInputSchemas.createStorage.parse({
				name: 's3-playground',
				type: 's3',
				parameters: { bucket: 'playground' },
			}),
		).toBeDefined();
		expect(
			ClaidAiEndpointInputSchemas.deleteStorage.parse({ storage_id: 1 }),
		).toEqual({ storage_id: 1 });
		expect(() =>
			ClaidAiEndpointInputSchemas.deleteStorage.parse({ storage_id: -1 }),
		).toThrow();
	});

	it('validates image input constraints', () => {
		expect(
			ClaidAiEndpointInputSchemas.imageGenerate.parse({
				input: 'a red bicycle on a beach',
			}),
		).toBeDefined();
		expect(() =>
			ClaidAiEndpointInputSchemas.imageGenerate.parse({ input: 'ab' }),
		).toThrow();
	});

	it('parses typed output shapes', () => {
		const types = ClaidAiEndpointOutputSchemas.storageTypes.parse({
			data: ['web_folder', 's3', 'gcs'],
		});
		expect(types.data).toContain('gcs');
		const batch = ClaidAiEndpointOutputSchemas.imageEditBatch.parse({
			data: { id: 1, status: 'ACCEPTED', result_url: 'https://x/1' },
		});
		expect(batch.data?.status).toBe('ACCEPTED');
		const edit = ClaidAiEndpointOutputSchemas.backgroundRemove.parse({
			data: { output: { tmp_url: 'https://x/y.png' } },
		});
		expect(edit.data?.output).toBeDefined();
	});
});
