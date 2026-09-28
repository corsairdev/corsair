import { EndpointInputSchemas, EndpointOutputSchemas } from './endpoints/types';
import { AppVeyorSchema } from './schema';

describe('AppVeyor schemas', () => {
	it('declares a semantic version and entities', () => {
		expect(AppVeyorSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
		expect(Object.keys(AppVeyorSchema.entities)).toEqual([
			'projects',
			'builds',
		]);
	});

	it('rejects invalid build-by-version input', () => {
		expect(() => EndpointInputSchemas.buildsGetByVersion.parse({})).toThrow();
	});

	it('validates project-list output', () => {
		expect(() =>
			EndpointOutputSchemas.projectsList.parse([
				{ projectId: 1, name: 'demo', slug: 'demo' },
			]),
		).not.toThrow();
	});

	it('rejects malformed project-list output', () => {
		expect(() =>
			EndpointOutputSchemas.projectsList.parse([{ projectId: 'one' }]),
		).toThrow();
	});
});
