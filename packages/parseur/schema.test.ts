import {
	BootstrapSchema,
	CreateEmailDocumentInputSchema,
	CreateExportConfigInputSchema,
	CreateMailboxInputSchema,
	CreateWebhookInputSchema,
	DeleteDocumentInputSchema,
	DeleteMailboxInputSchema,
	DocumentSchema,
	ExportConfigSchema,
	GetDocumentInputSchema,
	GetMailboxInputSchema,
	GetTemplateInputSchema,
	ListDocumentsInputSchema,
	ListMailboxesInputSchema,
	ListTemplatesInputSchema,
	ParserSchema,
	TemplateSchema,
	UploadDocumentInputSchema,
	WebhookSchema,
} from './endpoints/types';
import { ParseurSchema } from './schema';

describe('Parseur Database & Zod Schemas', () => {
	it('defines database schema with version and entities', () => {
		expect(ParseurSchema.version).toBe('1.0.0');
		expect(ParseurSchema.entities).toBeDefined();
	});

	describe('ParserSchema', () => {
		it('validates a complete mailbox parser object', () => {
			const data = {
				id: 12345,
				name: 'Invoices Mailbox',
				slug: 'invoices-mb',
				description: 'Extracts invoices',
				created: '2026-01-01T00:00:00Z',
				updated: '2026-01-01T00:00:00Z',
				document_count: 42,
				email: 'invoices-mb@parseur.me',
			};
			const parsed = ParserSchema.parse(data);
			expect(parsed.id).toBe(12345);
			expect(parsed.name).toBe('Invoices Mailbox');
			expect(parsed.email).toBe('invoices-mb@parseur.me');
		});

		it('allows string or numeric id', () => {
			const p1 = ParserSchema.parse({ id: 'abc', name: 'Test' });
			const p2 = ParserSchema.parse({ id: 999, name: 'Test' });
			expect(p1.id).toBe('abc');
			expect(p2.id).toBe(999);
		});
	});

	describe('DocumentSchema', () => {
		it('validates document with extracted result fields', () => {
			const data = {
				id: 'doc_101',
				name: 'invoice_march.pdf',
				status: 'PROCESSED',
				received: '2026-03-01T12:00:00Z',
				processed: '2026-03-01T12:01:00Z',
				result: {
					InvoiceNumber: 'INV-2026-001',
					TotalAmount: 1450.5,
					VendorName: 'Acme Corp',
				},
			};
			const parsed = DocumentSchema.parse(data);
			expect(parsed.id).toBe('doc_101');
			expect(parsed.status).toBe('PROCESSED');
			expect(parsed.result?.InvoiceNumber).toBe('INV-2026-001');
		});
	});

	describe('TemplateSchema', () => {
		it('validates template structure', () => {
			const data = {
				id: 777,
				name: 'Acme Invoice Template',
				parser: 12345,
				status: 'ACTIVE',
				created: '2026-01-15T00:00:00Z',
			};
			const parsed = TemplateSchema.parse(data);
			expect(parsed.id).toBe(777);
			expect(parsed.name).toBe('Acme Invoice Template');
		});
	});

	describe('ExportConfigSchema', () => {
		it('validates export download configuration', () => {
			const data = {
				id: 'exp_55',
				name: 'Daily CSV Export',
				format: 'csv',
				include_headers: true,
				all_fields: true,
			};
			const parsed = ExportConfigSchema.parse(data);
			expect(parsed.id).toBe('exp_55');
			expect(parsed.format).toBe('csv');
			expect(parsed.include_headers).toBe(true);
		});
	});

	describe('WebhookSchema', () => {
		it('validates webhook endpoint definition', () => {
			const data = {
				id: 99,
				target_url: 'https://example.com/webhooks/parseur',
				event: 'document.processed',
				is_active: true,
				name: 'Webhook Production',
			};
			const parsed = WebhookSchema.parse(data);
			expect(parsed.id).toBe(99);
			expect(parsed.target_url).toBe('https://example.com/webhooks/parseur');
			expect(parsed.is_active).toBe(true);
		});
	});

	describe('BootstrapSchema', () => {
		it('validates bootstrap account response', () => {
			const data = {
				user: { email: 'test@example.com', first_name: 'Satirical' },
				account: { name: 'Dev Team', plan: 'growth' },
				mailboxes: [{ id: 1, name: 'Main Mailbox' }],
			};
			const parsed = BootstrapSchema.parse(data);
			expect(parsed.mailboxes?.length).toBe(1);
			expect(parsed.account?.name).toBe('Dev Team');
		});
	});

	describe('Input Schemas Validation', () => {
		it('validates ListMailboxesInputSchema query params', () => {
			const valid = ListMailboxesInputSchema.parse({
				page: 2,
				page_size: 50,
				search: 'invoice',
				ordering: '-created',
			});
			expect(valid.page).toBe(2);
			expect(valid.ordering).toBe('-created');
		});

		it('validates CreateMailboxInputSchema', () => {
			const valid = CreateMailboxInputSchema.parse({
				name: 'New Parser',
				description: 'AI document parser',
				timezone: 'UTC',
				decimal_separator: '.',
			});
			expect(valid.name).toBe('New Parser');
			expect(valid.decimal_separator).toBe('.');
		});

		it('validates ListDocumentsInputSchema with filtering', () => {
			const valid = ListDocumentsInputSchema.parse({
				id: 'mb_10',
				status: 'PROCESSED',
				received_after: '2026-01-01',
				with_result: true,
			});
			expect(valid.id).toBe('mb_10');
			expect(valid.status).toBe('PROCESSED');
			expect(valid.with_result).toBe(true);
		});

		it('validates UploadDocumentInputSchema', () => {
			const valid = UploadDocumentInputSchema.parse({
				id: 123,
				file: 'data:application/pdf;base64,JVBERi0xLjQK...',
				file_name: 'test.pdf',
			});
			expect(valid.id).toBe(123);
			expect(valid.file_name).toBe('test.pdf');
		});

		it('validates CreateEmailDocumentInputSchema', () => {
			const valid = CreateEmailDocumentInputSchema.parse({
				parser_id: 'mb_99',
				subject: 'Invoice Attached',
				body: 'Please process this attached invoice',
				from: 'sender@example.com',
				to: 'inbox@parseur.me',
			});
			expect(valid.parser_id).toBe('mb_99');
			expect(valid.subject).toBe('Invoice Attached');
		});

		it('validates CreateExportConfigInputSchema', () => {
			const valid = CreateExportConfigInputSchema.parse({
				id: 'parser_1',
				name: 'JSON Export',
				format: 'json',
				all_fields: true,
			});
			expect(valid.format).toBe('json');
		});

		it('validates CreateWebhookInputSchema', () => {
			const valid = CreateWebhookInputSchema.parse({
				target_url: 'https://webhook.site/test',
				event: 'document.processed',
				is_active: true,
			});
			expect(valid.target_url).toBe('https://webhook.site/test');
		});

		it('validates deletion inputs requiring id', () => {
			expect(DeleteMailboxInputSchema.parse({ id: 10 }).id).toBe(10);
			expect(DeleteDocumentInputSchema.parse({ id: 'doc-1' }).id).toBe('doc-1');
			expect(GetMailboxInputSchema.parse({ id: 'mb-1' }).id).toBe('mb-1');
			expect(GetDocumentInputSchema.parse({ id: 44 }).id).toBe(44);
			expect(GetTemplateInputSchema.parse({ id: 55 }).id).toBe(55);
			expect(ListTemplatesInputSchema.parse({ id: 1 }).id).toBe(1);
		});
	});
});
