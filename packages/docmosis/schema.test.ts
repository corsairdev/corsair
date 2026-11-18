import { DocmosisSchema } from './schema';
import {
	DocmosisBatchUploadJob,
	DocmosisEnvironment,
	DocmosisImage,
	DocmosisRender,
	DocmosisTemplate,
} from './schema/database';

describe('Docmosis schema', () => {
	it('declares a semver version', () => {
		expect(DocmosisSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('registers the persisted entities', () => {
		expect(DocmosisSchema.entities).toEqual({
			templates: DocmosisTemplate,
			images: DocmosisImage,
			batchUploadJobs: DocmosisBatchUploadJob,
			environments: DocmosisEnvironment,
			renders: DocmosisRender,
		});
	});

	it('parses a listTemplates item from the provider docs', () => {
		const parsed = DocmosisTemplate.parse({
			id: 'a.docx',
			name: 'a.docx',
			lastModifiedMillisSinceEpoch: 1700000000000,
			lastModifiedISO8601: '2023-11-14T22:13:20+0000',
			sizeBytes: 1024,
			templateDevMode: false,
			templateHasErrors: false,
			md5: 'abc',
		});
		expect(parsed.sizeBytes).toBe(1024);
	});

	it('rejects a render without its output metadata', () => {
		expect(DocmosisRender.safeParse({ id: 'r1' }).success).toBe(false);
	});
});
