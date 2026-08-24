import {
	CreateDocumentInputSchema,
	CreateTemplateInputSchema,
	DeleteDocumentInputSchema,
	DeleteTemplateInputSchema,
	DocumentCardSchema,
	DocumentSchema,
	DocumentTemplateCardSchema,
	GetDocumentCardInputSchema,
	GetTemplateInputSchema,
	ListDocumentCardsInputSchema,
	ListTemplateCardsInputSchema,
	PDFMonkeyEndpointInputSchemas,
	UpdateDocumentInputSchema,
	UpdateTemplateInputSchema,
} from './endpoints/types';
import { PDFMonkeySchema } from './schema';

describe('PDFMonkey schema', () => {
	it('declares a semver version', () => {
		expect(PDFMonkeySchema.version).toBeDefined();
		expect(PDFMonkeySchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof PDFMonkeySchema.entities).toBe('object');
		expect(PDFMonkeySchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(PDFMonkeySchema.entities))).toBe(true);
		for (const entity of Object.values(PDFMonkeySchema.entities)) {
			expect(entity).toBeDefined();
		}
	});

	it('validates DocumentTemplateCardSchema', () => {
		const obj = {
			id: 'test-id',
			app_id: 'test-app',
			created_at: '2024-01-01',
			updated_at: '2024-01-01',
		};
		const result = DocumentTemplateCardSchema.safeParse(obj);
		expect(result.success).toBe(true);
	});

	it('validates DocumentCardSchema', () => {
		const obj = {
			id: 'doc-id',
			app_id: 'test-app',
			status: 'draft',
			download_url: null,
			preview_url: null,
			public_share_link: null,
			created_at: '2024-01-01',
			updated_at: '2024-01-01',
		};
		const result = DocumentCardSchema.safeParse(obj);
		expect(result.success).toBe(true);
	});

	it('validates DocumentSchema', () => {
		const obj = {
			id: 'doc-id',
			app_id: 'test-app',
			document_template_id: 'template-id',
			document_template_identifier: 'temp-ident',
			status: 'pending',
			payload: null,
			meta: null,
			filename: null,
			download_url: null,
			preview_url: null,
			public_share_link: null,
			checksum: 'abc123',
			generation_logs: [],
			failure_cause: null,
			created_at: '2024-01-01',
			updated_at: '2024-01-01',
		};
		const result = DocumentSchema.safeParse(obj);
		expect(result.success).toBe(true);
	});

	it('validates ListTemplateCardsInputSchema', () => {
		const obj = {
			q_workspace_id: 'ws-123',
			page: 1,
		};
		const result = ListTemplateCardsInputSchema.safeParse(obj);
		expect(result.success).toBe(true);
	});

	it('validates ListDocumentCardsInputSchema', () => {
		const obj = {
			page: 1,
			q_status: 'pending',
		};
		const result = ListDocumentCardsInputSchema.safeParse(obj);
		expect(result.success).toBe(true);
	});

	it('validates GetTemplateInputSchema', () => {
		const obj = { id: 'template-123' };
		const result = GetTemplateInputSchema.safeParse(obj);
		expect(result.success).toBe(true);
	});

	it('validates GetDocumentCardInputSchema', () => {
		const obj = { id: 'doc-456' };
		const result = GetDocumentCardInputSchema.safeParse(obj);
		expect(result.success).toBe(true);
	});

	it('validates CreateTemplateInputSchema', () => {
		const obj = {
			document_template: {
				app_id: 'app-1',
				identifier: 'my-template',
				body: '<h1>Hello</h1>',
			},
		};
		const result = CreateTemplateInputSchema.safeParse(obj);
		expect(result.success).toBe(true);
	});

	it('validates CreateDocumentInputSchema', () => {
		const obj = {
			document: {
				document_template_id: 'temp-1',
				status: 'pending',
			},
		};
		const result = CreateDocumentInputSchema.safeParse(obj);
		expect(result.success).toBe(true);
	});

	it('validates UpdateTemplateInputSchema', () => {
		const obj = {
			document_template_id: 'temp-1',
			document_template: {
				identifier: 'updated',
			},
		};
		const result = UpdateTemplateInputSchema.safeParse(obj);
		expect(result.success).toBe(true);
	});

	it('validates UpdateDocumentInputSchema', () => {
		const obj = {
			document_id: 'doc-1',
			document: {
				status: 'pending',
			},
		};
		const result = UpdateDocumentInputSchema.safeParse(obj);
		expect(result.success).toBe(true);
	});

	it('validates DeleteTemplateInputSchema', () => {
		const obj = { id: 'temp-1' };
		const result = DeleteTemplateInputSchema.safeParse(obj);
		expect(result.success).toBe(true);
	});

	it('validates DeleteDocumentInputSchema', () => {
		const obj = { id: 'doc-1' };
		const result = DeleteDocumentInputSchema.safeParse(obj);
		expect(result.success).toBe(true);
	});

	it('PDFMonkeyEndpointInputSchemas contains required template and document schemas', () => {
		expect(PDFMonkeyEndpointInputSchemas.listTemplateCards).toBeDefined();
		expect(PDFMonkeyEndpointInputSchemas.getTemplate).toBeDefined();
		expect(PDFMonkeyEndpointInputSchemas.createTemplate).toBeDefined();
		expect(PDFMonkeyEndpointInputSchemas.updateTemplate).toBeDefined();
		expect(PDFMonkeyEndpointInputSchemas.deleteTemplate).toBeDefined();
		expect(PDFMonkeyEndpointInputSchemas.createDocument).toBeDefined();
		expect(PDFMonkeyEndpointInputSchemas.createDocumentSync).toBeDefined();
		expect(PDFMonkeyEndpointInputSchemas.getDocumentCard).toBeDefined();
		expect(PDFMonkeyEndpointInputSchemas.listDocumentCards).toBeDefined();
		expect(PDFMonkeyEndpointInputSchemas.getDocument).toBeDefined();
		expect(PDFMonkeyEndpointInputSchemas.updateDocument).toBeDefined();
		expect(PDFMonkeyEndpointInputSchemas.deleteDocument).toBeDefined();
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
