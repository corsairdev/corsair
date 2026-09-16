import {
	CreateEmailDocumentInputSchema,
	CreateExportConfigInputSchema,
	CreateWebhookInputSchema,
	DocumentStatusEnumSchema,
	ListDocumentsInputSchema,
	ListMailboxesInputSchema,
	ParseurEndpointInputSchemas,
} from './endpoints/types';
import { ParseurParser, ParseurWebhook } from './schema';

describe('Parseur schemas', () => {
	it('exposes labeled database entities', () => {
		const parser = ParseurParser.parse({
			id: 210307,
			name: 'Mailbox',
			ai_engine: 'GCP_AI_2',
			email_prefix: 'sacred.zealous.tarantula',
		});
		expect(parser.id).toBe(210307);
		expect(
			ParseurWebhook.parse({
				id: 1,
				event: 'document.processed',
				target: 'https://example.com/hook',
				category: 'CUSTOM',
			}).target,
		).toBe('https://example.com/hook');
	});

	it('accepts official document statuses including INCOMING', () => {
		expect(DocumentStatusEnumSchema.parse('INCOMING')).toBe('INCOMING');
		expect(DocumentStatusEnumSchema.parse('PARSEDOK')).toBe('PARSEDOK');
		expect(
			ListDocumentsInputSchema.parse({ id: 1, status: 'INCOMING' }).status,
		).toBe('INCOMING');
		expect(() =>
			ListDocumentsInputSchema.parse({ id: 1, status: 'PROCESSED' }),
		).toThrow();
	});

	it('rejects invalid list mailbox ordering and webhook URLs', () => {
		expect(() =>
			ListMailboxesInputSchema.parse({ ordering: '-created' }),
		).toThrow();
		expect(() =>
			CreateWebhookInputSchema.parse({
				event: 'document.processed',
				target: 'not-a-url',
			}),
		).toThrow();
		expect(() =>
			CreateEmailDocumentInputSchema.parse({ subject: 'x' }),
		).toThrow();
		expect(() =>
			CreateExportConfigInputSchema.parse({ id: 1, name: 'x', format: 'csv' }),
		).toThrow();
	});

	it('covers every endpoint input schema', () => {
		expect(Object.keys(ParseurEndpointInputSchemas).length).toBe(30);
	});
});
