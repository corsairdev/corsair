import {
	CreateDocumentInputSchema,
	CreateDocumentSyncInputSchema,
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
	PDFMonkeyEndpointOutputSchemas,
	UpdateDocumentInputSchema,
	UpdateTemplateInputSchema,
} from './endpoints/types';
import { PDFMonkeySchema } from './schema';

describe('PDFMonkey schema', () => {
	it('declares a semver version and empty entities', () => {
		expect(PDFMonkeySchema.version).toMatch(/^\d+\.\d+\.\d+$/);
		expect(PDFMonkeySchema.entities).toEqual({});
	});

	it('validates DocumentTemplateCardSchema', () => {
		const result = DocumentTemplateCardSchema.safeParse({
			id: 'test-id',
			app_id: 'test-app',
			created_at: '2024-01-01',
			updated_at: '2024-01-01',
		});
		expect(result.success).toBe(true);
	});

	it('validates DocumentCardSchema', () => {
		const result = DocumentCardSchema.safeParse({
			id: 'doc-id',
			app_id: 'test-app',
			status: 'draft',
			download_url: null,
			preview_url: null,
			public_share_link: null,
			created_at: '2024-01-01',
			updated_at: '2024-01-01',
		});
		expect(result.success).toBe(true);
	});

	it('validates DocumentSchema', () => {
		const result = DocumentSchema.safeParse({
			id: 'doc-id',
			app_id: 'test-app',
			document_template_id: 'template-id',
			status: 'pending',
			payload: { clientName: 'Ada' },
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
		});
		expect(result.success).toBe(true);
	});

	it('validates nested list query inputs', () => {
		expect(
			ListTemplateCardsInputSchema.parse({
				q: { workspace_id: 'ws-123' },
			}),
		).toMatchObject({
			page: 1,
			q: { workspace_id: 'ws-123' },
		});
		expect(
			ListDocumentCardsInputSchema.parse({
				page: 2,
				q: { status: 'pending' },
			}),
		).toMatchObject({
			page: 2,
			q: { status: 'pending' },
		});
	});

	it('rejects list template cards without workspace_id', () => {
		expect(ListTemplateCardsInputSchema.safeParse({ page: 1 }).success).toBe(
			false,
		);
	});

	it('requires update bodies', () => {
		expect(
			UpdateTemplateInputSchema.safeParse({
				document_template_id: 'temp-1',
			}).success,
		).toBe(false);
		expect(
			UpdateDocumentInputSchema.safeParse({ document_id: 'doc-1' }).success,
		).toBe(false);
		expect(
			UpdateTemplateInputSchema.parse({
				document_template_id: 'temp-1',
				document_template: { identifier: 'updated' },
			}),
		).toMatchObject({
			document_template: { identifier: 'updated' },
		});
		expect(
			UpdateDocumentInputSchema.parse({
				document_id: 'doc-1',
				document: { status: 'pending' },
			}),
		).toMatchObject({
			document: { status: 'pending' },
		});
	});

	it('defaults createDocumentSync status to pending', () => {
		expect(
			CreateDocumentSyncInputSchema.parse({
				document: { document_template_id: 'temp-1' },
			}),
		).toMatchObject({
			document: { document_template_id: 'temp-1', status: 'pending' },
		});
	});

	it('validates remaining input schemas', () => {
		expect(GetTemplateInputSchema.parse({ id: 'template-123' }).id).toBe(
			'template-123',
		);
		expect(GetDocumentCardInputSchema.parse({ id: 'doc-456' }).id).toBe(
			'doc-456',
		);
		expect(
			CreateTemplateInputSchema.parse({
				document_template: {
					app_id: 'app-1',
					identifier: 'my-template',
					body: '<h1>Hello</h1>',
				},
			}).document_template.identifier,
		).toBe('my-template');
		expect(
			CreateDocumentInputSchema.parse({
				document: {
					document_template_id: 'temp-1',
					status: 'pending',
				},
			}).document.document_template_id,
		).toBe('temp-1');
		expect(DeleteTemplateInputSchema.parse({ id: 'temp-1' }).id).toBe('temp-1');
		expect(DeleteDocumentInputSchema.parse({ id: 'doc-1' }).id).toBe('doc-1');
	});

	it('registers input and output schemas for every operation', () => {
		const operations = [
			'listTemplateCards',
			'getTemplate',
			'createTemplate',
			'updateTemplate',
			'deleteTemplate',
			'createDocument',
			'createDocumentSync',
			'getDocumentCard',
			'listDocumentCards',
			'getDocument',
			'updateDocument',
			'deleteDocument',
		] as const;

		for (const operation of operations) {
			expect(PDFMonkeyEndpointInputSchemas[operation]).toBeDefined();
			expect(PDFMonkeyEndpointOutputSchemas[operation]).toBeDefined();
		}
	});
});
