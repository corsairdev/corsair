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
	let mailboxId: string | number | undefined;

	beforeAll(async () => {
		const created = ParserSchema.parse(
			await makeParseurRequest<unknown>('/parser', {
				apiKey: LIVE_KEY,
				method: 'POST',
				body: { name: 'corsair-parseur-live-read' },
			}),
		);
		mailboxId = created.id;
	});

	afterAll(async () => {
		if (mailboxId === undefined) return;
		await makeParseurRequest<unknown>(`/parser/${mailboxId}`, {
			apiKey: LIVE_KEY,
			method: 'DELETE',
		}).catch(() => undefined);
	});

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

	it('GET /parser lists the disposable mailbox', async () => {
		const raw = await makeParseurRequest<unknown>('/parser', {
			apiKey: LIVE_KEY,
			method: 'GET',
			query: { page_size: 25, search: 'corsair-parseur-live-read' },
		});
		const listed = ListMailboxesOutputSchema.parse(raw);
		expect(mailboxId).toBeDefined();
		expect(listed.results.length).toBeGreaterThan(0);
		const parser = ParseurParser.parse(
			listed.results.find((row) => row.id === mailboxId) ?? listed.results[0],
		);
		expect(parser.id).toBe(mailboxId);
	});

	it('GET mailbox, schema, documents, templates, exports', async () => {
		const mailbox = ParserSchema.parse(
			await makeParseurRequest<unknown>(`/parser/${mailboxId}`, {
				apiKey: LIVE_KEY,
				method: 'GET',
			}),
		);
		expect(mailbox.id).toBe(mailboxId);

		const schema = await makeParseurRequest<{ type: string }>(
			`/parser/${mailboxId}/schema`,
			{ apiKey: LIVE_KEY, method: 'GET' },
		);
		expect(schema.type).toBe('object');

		ListDocumentsOutputSchema.parse(
			await makeParseurRequest<unknown>(`/parser/${mailboxId}/document_set`, {
				apiKey: LIVE_KEY,
				method: 'GET',
				query: { page_size: 2 },
			}),
		);

		await makeParseurRequest<unknown>(`/parser/${mailboxId}/template_set`, {
			apiKey: LIVE_KEY,
			method: 'GET',
		});
		await makeParseurRequest<unknown>(`/parser/${mailboxId}/export_config`, {
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
		const writeMailboxId = created.id;
		const recipient = `${created.email_prefix}@in.parseur.com`;
		let webhookId: number | undefined;

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
					`/parser/${writeMailboxId}/export_config`,
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
				`/parser/${writeMailboxId}/export_config/${exportCfg.id}`,
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
			webhookId = webhook.id;
			expect(webhook.target).toContain('https://');

			await makeParseurRequest<unknown>(`/document/${documentId}`, {
				apiKey: LIVE_KEY,
				method: 'DELETE',
			});
		} finally {
			if (webhookId !== undefined) {
				await makeParseurRequest<unknown>(`/webhook/${webhookId}`, {
					apiKey: LIVE_KEY,
					method: 'DELETE',
				}).catch(() => undefined);
			}
			await makeParseurRequest<unknown>(`/parser/${writeMailboxId}`, {
				apiKey: LIVE_KEY,
				method: 'DELETE',
			}).catch(() => undefined);
		}
	});
});
