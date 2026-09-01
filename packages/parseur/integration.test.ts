import { makeParseurRequest } from './client';
import {
	BootstrapSchema,
	CreateEmailDocumentOutputSchema,
	DocumentSchema,
	ExportConfigSchema,
	ListDocumentsOutputSchema,
	ListMailboxesOutputSchema,
	ParserSchema,
} from './endpoints/types';
import { ParseurParser } from './schema';

const LIVE_KEY = process.env.PARSEUR_API_KEY;
const describeIfKey = LIVE_KEY ? describe : describe.skip;

describe('Parseur live API', () => {
	it('rejects an invalid token on GET /parser', async () => {
		await expect(
			makeParseurRequest('/parser', {
				apiKey: 'invalid-token',
				method: 'GET',
			}),
		).rejects.toThrow();
	});
});

describeIfKey('Parseur live API (authenticated)', () => {
	it('GET /bootstrap matches official keys', async () => {
		const raw = await makeParseurRequest<unknown>('/bootstrap', {
			apiKey: LIVE_KEY,
			method: 'GET',
		});
		const boot = BootstrapSchema.parse(raw);
		expect(boot.email_domain.length).toBeGreaterThan(0);
		expect(boot.choices).toBeDefined();
		expect(boot.master_parser_set).toBeDefined();
	});

	it('GET /parser lists mailboxes that parse as Parser', async () => {
		const raw = await makeParseurRequest<unknown>('/parser', {
			apiKey: LIVE_KEY,
			method: 'GET',
			query: { page_size: 5 },
		});
		const listed = ListMailboxesOutputSchema.parse(raw);
		expect(listed.results.length).toBeGreaterThan(0);
		const parser = ParseurParser.parse(listed.results[0]);
		expect(parser.id).toBeGreaterThan(0);
	});

	it('GET mailbox, schema, documents, templates, exports, webhooks', async () => {
		const listed = ListMailboxesOutputSchema.parse(
			await makeParseurRequest<unknown>('/parser', {
				apiKey: LIVE_KEY,
				method: 'GET',
				query: { page_size: 1 },
			}),
		);
		const id = listed.results[0]?.id;
		expect(id).toBeDefined();

		const mailbox = ParserSchema.parse(
			await makeParseurRequest<unknown>(`/parser/${id}`, {
				apiKey: LIVE_KEY,
				method: 'GET',
			}),
		);
		expect(mailbox.id).toBe(id);

		const schema = await makeParseurRequest<{ type: string }>(
			`/parser/${id}/schema`,
			{ apiKey: LIVE_KEY, method: 'GET' },
		);
		expect(schema.type).toBe('object');

		ListDocumentsOutputSchema.parse(
			await makeParseurRequest<unknown>(`/parser/${id}/document_set`, {
				apiKey: LIVE_KEY,
				method: 'GET',
				query: { page_size: 2 },
			}),
		);

		await makeParseurRequest<unknown>(`/parser/${id}/template_set`, {
			apiKey: LIVE_KEY,
			method: 'GET',
		});
		await makeParseurRequest<unknown>(`/parser/${id}/export_config`, {
			apiKey: LIVE_KEY,
			method: 'GET',
		});
	});

	it('POST /email then skip/get/logs/delete on a test mailbox', async () => {
		const created = ParserSchema.parse(
			await makeParseurRequest<unknown>('/parser', {
				apiKey: LIVE_KEY,
				method: 'POST',
				body: { name: 'corsair-parseur-live-test' },
			}),
		);
		const mailboxId = created.id;
		const recipient = `${created.email_prefix}@in.parseur.com`;

		try {
			const uploaded = CreateEmailDocumentOutputSchema.parse(
				await makeParseurRequest<unknown>('/email', {
					apiKey: LIVE_KEY,
					method: 'POST',
					body: {
						subject: 'Corsair live test',
						from: 'Corsair <live@example.com>',
						recipient,
						body_plain: 'Invoice 1',
					},
				}),
			);
			const documentId =
				uploaded.DocumentID ??
				uploaded.DocumentIDs?.[0] ??
				uploaded.attachments?.[0]?.DocumentID;
			expect(documentId).toBeTruthy();

			const doc = DocumentSchema.parse(
				await makeParseurRequest<unknown>(`/document/${documentId}`, {
					apiKey: LIVE_KEY,
					method: 'GET',
				}),
			);
			expect(doc.id).toBeDefined();

			await makeParseurRequest<unknown>(`/document/${documentId}/log_set`, {
				apiKey: LIVE_KEY,
				method: 'GET',
			});

			const skipped = DocumentSchema.parse(
				await makeParseurRequest<unknown>(`/document/${documentId}/skip`, {
					apiKey: LIVE_KEY,
					method: 'POST',
				}),
			);
			expect(skipped.status).toBe('SKIPPED');

			const exportCfg = ExportConfigSchema.parse(
				await makeParseurRequest<unknown>(
					`/parser/${mailboxId}/export_config`,
					{
						apiKey: LIVE_KEY,
						method: 'POST',
						body: {
							name: 'Corsair export',
							type: 'PARSER',
							items: ['OriginalDocument'],
						},
					},
				),
			);
			expect(exportCfg.items?.length).toBeGreaterThan(0);

			await makeParseurRequest<unknown>(
				`/parser/${mailboxId}/export_config/${exportCfg.id}`,
				{ apiKey: LIVE_KEY, method: 'DELETE' },
			);

			const webhook = await makeParseurRequest<{ id: number; target: string }>(
				'/webhook',
				{
					apiKey: LIVE_KEY,
					method: 'POST',
					body: {
						event: 'document.processed',
						target: 'https://example.com/corsair-parseur',
						category: 'CUSTOM',
						name: 'corsair-live',
					},
				},
			);
			expect(webhook.target).toContain('https://');

			await makeParseurRequest<unknown>(`/webhook/${webhook.id}`, {
				apiKey: LIVE_KEY,
				method: 'DELETE',
			});

			await makeParseurRequest<unknown>(`/document/${documentId}`, {
				apiKey: LIVE_KEY,
				method: 'DELETE',
			});
		} finally {
			await makeParseurRequest<unknown>(`/parser/${mailboxId}`, {
				apiKey: LIVE_KEY,
				method: 'DELETE',
			});
		}
	});
});
