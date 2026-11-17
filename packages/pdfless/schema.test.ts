import { PdfLessSchema } from './schema';
import {
	PdfLessTemplateEntity,
	PdfLessWorkspaceEntity,
} from './schema/database';

describe('PDFLess schema', () => {
	it('declares a semver version and the documented entities', () => {
		expect(PdfLessSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
		expect(Object.keys(PdfLessSchema.entities).sort()).toEqual([
			'templates',
			'workspaces',
		]);
	});

	it('accepts a workspace and rejects one with no name', () => {
		const parsed = PdfLessWorkspaceEntity.parse({
			name: 'Main',
			active: true,
			quota: 100,
			remainingQuota: 80,
		});
		expect(parsed.name).toBe('Main');
		expect(PdfLessWorkspaceEntity.safeParse({ active: true }).success).toBe(
			false,
		);
	});

	it('accepts a template and rejects one with no id', () => {
		const parsed = PdfLessTemplateEntity.parse({
			id: 'tpl_1',
			name: 'Invoice',
			imagePreviewUrl: 'https://cdn.pdfless.com/preview.png',
		});
		expect(parsed.id).toBe('tpl_1');
		expect(PdfLessTemplateEntity.safeParse({ name: 'Invoice' }).success).toBe(
			false,
		);
	});
});
