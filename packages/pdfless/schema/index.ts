import { PdfLessTemplateEntity, PdfLessWorkspaceEntity } from './database';

export const PdfLessSchema = {
	version: '1.0.0',
	entities: {
		workspaces: PdfLessWorkspaceEntity,
		templates: PdfLessTemplateEntity,
	},
} as const;
