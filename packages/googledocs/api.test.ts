import 'dotenv/config';
import { request } from 'corsair/http';
import { makeGoogleDocsRequest, makeGoogleDriveRequest } from './client';
import {
	DocumentsEndpoints,
	StructureEndpoints,
	TablesEndpoints,
	TextEndpoints,
} from './endpoints';
import {
	GoogleDocsEndpointInputSchemas,
	GoogleDocsEndpointOutputSchemas,
} from './endpoints/types';
import type { GoogleDocsContext } from './index';
import { googledocs, googledocsEndpointSchemas } from './index';
import type { Document, DriveFileList } from './types';
import { __testOnly as changesTestOnly } from './webhooks/changes';

jest.mock('corsair/http', () => {
	const original = jest.requireActual('corsair/http');
	return {
		...original,
		request: jest.fn(),
	};
});

const mockRequest = request as jest.Mock;

const DOCS_BASE = 'https://docs.googleapis.com/v1';
const DRIVE_BASE = 'https://www.googleapis.com/drive/v3';
const SHEETS_BASE = 'https://sheets.googleapis.com/v4';

// Endpoint handlers only read key, db, options, and $getAccountId at runtime;
// the full CorsairPluginContext carries runtime-bound members a hand-built
// literal cannot satisfy, so widen through unknown once here.
function testContext(
	overrides: Record<string, unknown> = {},
): GoogleDocsContext {
	return {
		key: 'test-token',
		$getAccountId: async () => 'test-account-id',
		options: {},
		db: {},
		...overrides,
	} as unknown as GoogleDocsContext;
}

const ctx = testContext();

function lastCall() {
	const call = mockRequest.mock.calls[mockRequest.mock.calls.length - 1];
	return { config: call?.[0], options: call?.[1] };
}

function countLeaves(tree: Record<string, unknown>): number {
	return Object.values(tree).reduce<number>((count, value) => {
		if (typeof value === 'function') return count + 1;
		if (value && typeof value === 'object') {
			return count + countLeaves(value as Record<string, unknown>);
		}
		return count;
	}, 0);
}

describe('Google Docs plugin shape', () => {
	it('exposes all 35 operations with schemas and meta in lockstep', () => {
		const plugin = googledocs();
		const endpoints = plugin.endpoints as unknown as Record<string, unknown>;

		expect(countLeaves(endpoints)).toBe(35);
		expect(Object.keys(plugin.endpointMeta ?? {})).toHaveLength(35);
		expect(Object.keys(googledocsEndpointSchemas)).toHaveLength(35);
	});

	it('requests the documents, drive, and sheets-read OAuth scopes', () => {
		const plugin = googledocs();
		expect(plugin.oauthConfig?.scopes).toEqual([
			'https://www.googleapis.com/auth/documents',
			'https://www.googleapis.com/auth/drive',
			// required by listSpreadsheetCharts, which reads via the Sheets API
			'https://www.googleapis.com/auth/spreadsheets.readonly',
		]);
	});

	it('ships rate-limit and auth error handlers', () => {
		const plugin = googledocs();
		const handlers = plugin.errorHandlers ?? {};
		expect(Object.keys(handlers)).toEqual(
			expect.arrayContaining(['RATE_LIMIT_ERROR', 'AUTH_ERROR', 'DEFAULT']),
		);
	});

	it('rejects webhooks that are not Google Drive push notifications', () => {
		const plugin = googledocs();
		expect(plugin.pluginWebhookMatcher?.({ headers: {}, body: '' })).toBe(
			false,
		);
		expect(
			plugin.pluginWebhookMatcher?.({
				headers: { from: 'someone@example.com' },
				body: { message: { data: 'x' } },
			}),
		).toBe(false);
	});
});

describe('Google Docs endpoint routing (mocked HTTP)', () => {
	const emptyBatchResponse = { documentId: 'doc1', replies: [] };
	const minimalDocument: Document = {
		documentId: 'doc1',
		title: 'Test Doc',
		revisionId: 'rev1',
		body: { content: [{ endIndex: 25 }] },
	};

	beforeEach(() => {
		mockRequest.mockReset();
		mockRequest.mockResolvedValue(emptyBatchResponse);
	});

	function expectBatchUpdate(requestKey: string) {
		const { config, options } = lastCall();
		expect(config.BASE).toBe(DOCS_BASE);
		expect(options.method).toBe('POST');
		expect(options.url).toBe('/documents/doc1:batchUpdate');
		expect(options.body.requests[0]).toHaveProperty(requestKey);
	}

	describe('documents', () => {
		it('createDocument POSTs /documents with the title', async () => {
			mockRequest.mockResolvedValue(minimalDocument);
			await DocumentsEndpoints.createDocument(ctx, { title: 'Test Doc' });

			const call = mockRequest.mock.calls[0];
			expect(call?.[0].BASE).toBe(DOCS_BASE);
			expect(call?.[1]).toMatchObject({
				method: 'POST',
				url: '/documents',
				body: { title: 'Test Doc' },
			});
		});

		it('createDocument with text follows up with an insertText batchUpdate', async () => {
			mockRequest.mockResolvedValue(minimalDocument);
			await DocumentsEndpoints.createDocument(ctx, {
				title: 'Test Doc',
				text: 'hello',
			});

			expect(mockRequest).toHaveBeenCalledTimes(2);
			const { options } = lastCall();
			expect(options.url).toBe('/documents/doc1:batchUpdate');
			expect(options.body.requests[0].insertText).toMatchObject({
				location: { index: 1 },
				text: 'hello',
			});
		});

		it('createBlankDocument POSTs /documents', async () => {
			mockRequest.mockResolvedValue(minimalDocument);
			await DocumentsEndpoints.createBlankDocument(ctx, { title: 'Blank' });

			expect(lastCall().options).toMatchObject({
				method: 'POST',
				url: '/documents',
				body: { title: 'Blank' },
			});
		});

		it('createDocumentMarkdown creates then inserts the markdown body', async () => {
			mockRequest.mockResolvedValue(minimalDocument);
			await DocumentsEndpoints.createDocumentMarkdown(ctx, {
				markdown: '# Title',
			});

			expect(mockRequest.mock.calls[0]?.[1].body).toEqual({
				title: 'Untitled',
			});
			expect(lastCall().options.body.requests[0].insertText.text).toBe(
				'# Title',
			);
		});

		it('copyDocument POSTs the Drive copy route', async () => {
			mockRequest.mockResolvedValue({ id: 'copy1', name: 'Copy' });
			await DocumentsEndpoints.copyDocument(ctx, {
				fileId: 'file9',
				name: 'Copy',
			});

			const { config, options } = lastCall();
			expect(config.BASE).toBe(DRIVE_BASE);
			expect(options).toMatchObject({
				method: 'POST',
				url: '/files/file9/copy',
				body: { name: 'Copy' },
			});
		});

		it('getDocument GETs /documents/{id}', async () => {
			mockRequest.mockResolvedValue(minimalDocument);
			await DocumentsEndpoints.getDocument(ctx, { documentId: 'doc1' });

			const { config, options } = lastCall();
			expect(config.BASE).toBe(DOCS_BASE);
			expect(options).toMatchObject({ method: 'GET', url: '/documents/doc1' });
		});

		it('getDocumentPlaintext flattens the fetched document body', async () => {
			mockRequest.mockResolvedValue({
				...minimalDocument,
				body: {
					content: [
						{
							paragraph: {
								elements: [{ textRun: { content: 'hello world' } }],
							},
						},
					],
				},
			});
			const result = await DocumentsEndpoints.getDocumentPlaintext(ctx, {
				documentId: 'doc1',
			});

			expect(result.text).toBe('hello world');
			expect(result.wordCount).toBe(2);
		});

		it('updateDocumentMarkdown deletes the body then inserts new content', async () => {
			mockRequest
				.mockResolvedValueOnce(minimalDocument)
				.mockResolvedValueOnce(emptyBatchResponse);
			await DocumentsEndpoints.updateDocumentMarkdown(ctx, {
				documentId: 'doc1',
				markdown: 'new content',
			});

			const { options } = lastCall();
			expect(options.url).toBe('/documents/doc1:batchUpdate');
			expect(options.body.requests[0].deleteContentRange.range).toEqual({
				startIndex: 1,
				endIndex: 25,
			});
			expect(options.body.requests[1].insertText.text).toBe('new content');
			// The rewrite must be pinned to the revision the endIndex was read
			// from, otherwise a concurrent edit between the GET and this POST
			// would silently leave stale tail content in the document.
			expect(options.body.writeControl).toEqual({
				requiredRevisionId: 'rev1',
			});
		});

		it('updateDocumentSectionMarkdown scopes the delete to the section range', async () => {
			await DocumentsEndpoints.updateDocumentSectionMarkdown(ctx, {
				documentId: 'doc1',
				startIndex: 5,
				endIndex: 10,
				markdown: 'section',
			});

			const { options } = lastCall();
			expect(options.body.requests[0].deleteContentRange.range).toEqual({
				startIndex: 5,
				endIndex: 10,
			});
			expect(options.body.requests[1].insertText.location.index).toBe(5);
		});

		it('updateDocumentStyle issues an updateDocumentStyle request', async () => {
			await DocumentsEndpoints.updateDocumentStyle(ctx, {
				documentId: 'doc1',
				documentStyle: { marginTop: { magnitude: 72, unit: 'PT' } },
				fields: 'marginTop',
			});
			expectBatchUpdate('updateDocumentStyle');
		});

		it('updateExistingDocument passes raw requests and writeControl through', async () => {
			await DocumentsEndpoints.updateExistingDocument(ctx, {
				documentId: 'doc1',
				requests: [{ insertText: { location: { index: 1 }, text: 'x' } }],
				writeControl: { requiredRevisionId: 'rev1' },
			});

			const { options } = lastCall();
			expect(options.body.writeControl).toEqual({
				requiredRevisionId: 'rev1',
			});
			expect(options.body.requests).toHaveLength(1);
		});

		it('updateDocumentBatch (deprecated alias) routes to batchUpdate', async () => {
			await DocumentsEndpoints.updateDocumentBatch(ctx, {
				documentId: 'doc1',
				requests: [{ insertText: { location: { index: 1 }, text: 'x' } }],
			});
			expectBatchUpdate('insertText');
		});

		it('searchDocuments GETs Drive /files scoped to the Docs mime type', async () => {
			mockRequest.mockResolvedValue({ files: [] });
			await DocumentsEndpoints.searchDocuments(ctx, { q: "name contains 'x'" });

			const { config, options } = lastCall();
			expect(config.BASE).toBe(DRIVE_BASE);
			expect(options.method).toBe('GET');
			expect(options.url).toBe('/files');
			expect(options.query.q).toBe(
				"mimeType='application/vnd.google-apps.document' and (name contains 'x')",
			);
		});

		it('listSpreadsheetCharts GETs the Sheets API chart fields', async () => {
			mockRequest.mockResolvedValue({ sheets: [] });
			await DocumentsEndpoints.listSpreadsheetCharts(ctx, {
				spreadsheetId: 'sheet1',
			});

			const { config, options } = lastCall();
			expect(config.BASE).toBe(SHEETS_BASE);
			expect(options).toMatchObject({
				method: 'GET',
				url: '/spreadsheets/sheet1',
				query: { fields: 'sheets(charts(chartId,spec,position))' },
			});
		});

		it('exportDocumentAsPdf fetches the Drive export URL and base64-encodes', async () => {
			const pdfBytes = Buffer.from('pdf-data');
			const fetchMock = jest.spyOn(globalThis, 'fetch').mockResolvedValue({
				ok: true,
				status: 200,
				arrayBuffer: async () => pdfBytes,
			} as unknown as Response);

			const result = await DocumentsEndpoints.exportDocumentAsPdf(ctx, {
				fileId: 'file9',
			});

			expect(fetchMock).toHaveBeenCalledWith(
				`${DRIVE_BASE}/files/file9/export?mimeType=application/pdf`,
				expect.objectContaining({
					method: 'GET',
					headers: { Authorization: 'Bearer test-token' },
				}),
			);
			expect(result).toEqual({
				fileId: 'file9',
				mimeType: 'application/pdf',
				data: pdfBytes.toString('base64'),
			});
			fetchMock.mockRestore();
		});

		it('exportDocumentAsPdf force-refreshes the token once on 401', async () => {
			const pdfBytes = Buffer.from('pdf-data');
			const fetchMock = jest
				.spyOn(globalThis, 'fetch')
				.mockResolvedValueOnce({
					ok: false,
					status: 401,
					text: async () => 'unauthorized',
				} as unknown as Response)
				.mockResolvedValueOnce({
					ok: true,
					status: 200,
					arrayBuffer: async () => pdfBytes,
				} as unknown as Response);

			const refreshCtx = testContext({
				_refreshAuth: jest.fn().mockResolvedValue('fresh-token'),
			});
			await DocumentsEndpoints.exportDocumentAsPdf(refreshCtx, {
				fileId: 'file9',
			});

			expect(fetchMock).toHaveBeenCalledTimes(2);
			expect(fetchMock.mock.calls[1]?.[1]).toMatchObject({
				headers: { Authorization: 'Bearer fresh-token' },
			});
			fetchMock.mockRestore();
		});
	});

	describe('text', () => {
		it('insertText targets a location index', async () => {
			await TextEndpoints.insertText(ctx, {
				documentId: 'doc1',
				text: 'hi',
				insertionIndex: 3,
			});
			expectBatchUpdate('insertText');
			expect(
				lastCall().options.body.requests[0].insertText.location.index,
			).toBe(3);
		});

		it('insertText appendToEnd uses endOfSegmentLocation', async () => {
			await TextEndpoints.insertText(ctx, {
				documentId: 'doc1',
				text: 'hi',
				appendToEnd: true,
			});
			expect(
				lastCall().options.body.requests[0].insertText.endOfSegmentLocation,
			).toEqual({});
		});

		it('insertText without a position rejects', async () => {
			await expect(
				TextEndpoints.insertText(ctx, { documentId: 'doc1', text: 'hi' }),
			).rejects.toThrow('insertionIndex or appendToEnd');
		});

		it('replaceAllText nests find/replace under containsText', async () => {
			await TextEndpoints.replaceAllText(ctx, {
				documentId: 'doc1',
				find: 'a',
				replace: 'b',
			});
			expect(lastCall().options.body.requests[0].replaceAllText).toEqual({
				containsText: { text: 'a', matchCase: false },
				replaceText: 'b',
			});
		});

		it('deleteContentRange sends the range', async () => {
			await TextEndpoints.deleteContentRange(ctx, {
				documentId: 'doc1',
				startIndex: 1,
				endIndex: 5,
			});
			expectBatchUpdate('deleteContentRange');
		});

		it('insertInlineImage sends the image uri', async () => {
			await TextEndpoints.insertInlineImage(ctx, {
				documentId: 'doc1',
				uri: 'https://example.com/img.png',
				insertionIndex: 2,
			});
			expectBatchUpdate('insertInlineImage');
			expect(lastCall().options.body.requests[0].insertInlineImage.uri).toBe(
				'https://example.com/img.png',
			);
		});

		it('replaceImage defaults to CENTER_CROP', async () => {
			await TextEndpoints.replaceImage(ctx, {
				documentId: 'doc1',
				imageObjectId: 'img1',
				uri: 'https://example.com/img.png',
			});
			expect(
				lastCall().options.body.requests[0].replaceImage.imageReplaceMethod,
			).toBe('CENTER_CROP');
		});

		it('insertPageBreak sets pageBreakBefore at the insertion index', async () => {
			await TextEndpoints.insertPageBreak(ctx, {
				documentId: 'doc1',
				insertionIndex: 7,
			});
			expectBatchUpdate('updateParagraphStyle');
			expect(
				lastCall().options.body.requests[0].updateParagraphStyle,
			).toMatchObject({
				range: { startIndex: 7, endIndex: 8 },
				fields: 'pageBreakBefore',
			});
		});

		it('insertPageBreak with appendToEnd pins the write to the fetched revision', async () => {
			mockRequest
				.mockResolvedValueOnce(minimalDocument)
				.mockResolvedValueOnce(emptyBatchResponse);
			await TextEndpoints.insertPageBreak(ctx, {
				documentId: 'doc1',
				appendToEnd: true,
			});

			const { options } = lastCall();
			// endIndex 25 from the fixture -> paragraph start at 24
			expect(options.body.requests[0].updateParagraphStyle.range).toEqual({
				startIndex: 24,
				endIndex: 25,
			});
			// same TOCTOU guard as updateDocumentMarkdown: a concurrent edit
			// between the GET and this POST must fail, not misplace the break
			expect(options.body.writeControl).toEqual({
				requiredRevisionId: 'rev1',
			});
		});
	});

	describe('structure', () => {
		it('createHeader defaults to the DEFAULT type', async () => {
			await StructureEndpoints.createHeader(ctx, { documentId: 'doc1' });
			expectBatchUpdate('createHeader');
			expect(lastCall().options.body.requests[0].createHeader.type).toBe(
				'DEFAULT',
			);
		});

		it('createFooter defaults to the DEFAULT type', async () => {
			await StructureEndpoints.createFooter(ctx, { documentId: 'doc1' });
			expectBatchUpdate('createFooter');
		});

		it('createFootnote defaults to end-of-segment', async () => {
			await StructureEndpoints.createFootnote(ctx, { documentId: 'doc1' });
			expect(
				lastCall().options.body.requests[0].createFootnote.endOfSegmentLocation,
			).toEqual({});
		});

		it('createNamedRange sends name and range', async () => {
			await StructureEndpoints.createNamedRange(ctx, {
				documentId: 'doc1',
				name: 'section-a',
				startIndex: 1,
				endIndex: 4,
			});
			expect(lastCall().options.body.requests[0].createNamedRange).toEqual({
				name: 'section-a',
				range: { startIndex: 1, endIndex: 4 },
			});
		});

		it('createParagraphBullets defaults the bullet preset', async () => {
			await StructureEndpoints.createParagraphBullets(ctx, {
				documentId: 'doc1',
				startIndex: 1,
				endIndex: 4,
			});
			expect(
				lastCall().options.body.requests[0].createParagraphBullets.bulletPreset,
			).toBe('BULLET_DISC_CIRCLE_SQUARE');
		});

		it('deleteParagraphBullets sends the range', async () => {
			await StructureEndpoints.deleteParagraphBullets(ctx, {
				documentId: 'doc1',
				startIndex: 1,
				endIndex: 4,
			});
			expectBatchUpdate('deleteParagraphBullets');
		});

		it('deleteHeader sends the header id', async () => {
			await StructureEndpoints.deleteHeader(ctx, {
				documentId: 'doc1',
				headerId: 'h1',
			});
			expect(lastCall().options.body.requests[0].deleteHeader.headerId).toBe(
				'h1',
			);
		});

		it('deleteFooter sends the footer id', async () => {
			await StructureEndpoints.deleteFooter(ctx, {
				documentId: 'doc1',
				footerId: 'f1',
			});
			expect(lastCall().options.body.requests[0].deleteFooter.footerId).toBe(
				'f1',
			);
		});

		it('deleteNamedRange sends the named range id', async () => {
			await StructureEndpoints.deleteNamedRange(ctx, {
				documentId: 'doc1',
				namedRangeId: 'nr1',
			});
			expect(
				lastCall().options.body.requests[0].deleteNamedRange.namedRangeId,
			).toBe('nr1');
		});

		it('deleteHeader input schema requires headerId', () => {
			expect(
				GoogleDocsEndpointInputSchemas.deleteHeader.safeParse({
					documentId: 'doc1',
				}).success,
			).toBe(false);
			expect(
				GoogleDocsEndpointInputSchemas.deleteHeader.safeParse({
					documentId: 'doc1',
					headerId: 'h1',
				}).success,
			).toBe(true);
		});

		it('deleteFooter input schema requires footerId', () => {
			expect(
				GoogleDocsEndpointInputSchemas.deleteFooter.safeParse({
					documentId: 'doc1',
				}).success,
			).toBe(false);
		});

		it('deleteNamedRange input schema requires namedRangeId or name', () => {
			expect(
				GoogleDocsEndpointInputSchemas.deleteNamedRange.safeParse({
					documentId: 'doc1',
				}).success,
			).toBe(false);
			expect(
				GoogleDocsEndpointInputSchemas.deleteNamedRange.safeParse({
					documentId: 'doc1',
					name: 'MyRange',
				}).success,
			).toBe(true);
		});
	});

	describe('tables', () => {
		it('insertTable places rows/columns at the insertion index', async () => {
			await TablesEndpoints.insertTable(ctx, {
				documentId: 'doc1',
				rows: 2,
				columns: 3,
				insertionIndex: 5,
			});
			expect(lastCall().options.body.requests[0].insertTable).toEqual({
				rows: 2,
				columns: 3,
				location: { index: 5 },
			});
		});

		it('insertTable requires a position', async () => {
			await expect(
				TablesEndpoints.insertTable(ctx, {
					documentId: 'doc1',
					rows: 2,
					columns: 3,
				}),
			).rejects.toThrow('insertionIndex or appendToEnd');
		});

		it('insertTableColumn defaults to inserting left', async () => {
			await TablesEndpoints.insertTableColumn(ctx, {
				documentId: 'doc1',
				tableCellLocation: {
					tableStartLocation: { index: 2 },
					rowIndex: 0,
					columnIndex: 0,
				},
			});
			expect(
				lastCall().options.body.requests[0].insertTableColumn.insertRight,
			).toBe(false);
		});

		it('deleteTableColumn sends the cell location', async () => {
			await TablesEndpoints.deleteTableColumn(ctx, {
				documentId: 'doc1',
				tableCellLocation: {
					tableStartLocation: { index: 2 },
					rowIndex: 0,
					columnIndex: 0,
				},
			});
			expectBatchUpdate('deleteTableColumn');
		});

		it('deleteTableRow sends the cell location', async () => {
			await TablesEndpoints.deleteTableRow(ctx, {
				documentId: 'doc1',
				tableCellLocation: {
					tableStartLocation: { index: 2 },
					rowIndex: 0,
					columnIndex: 0,
				},
			});
			expectBatchUpdate('deleteTableRow');
		});

		it('unmergeTableCells sends the table range', async () => {
			await TablesEndpoints.unmergeTableCells(ctx, {
				documentId: 'doc1',
				tableRange: {
					tableCellLocation: {
						tableStartLocation: { index: 2 },
						rowIndex: 0,
						columnIndex: 0,
					},
					rowSpan: 1,
					columnSpan: 2,
				},
			});
			expectBatchUpdate('unmergeTableCells');
		});

		it('updateTableRowStyle defaults the field mask', async () => {
			await TablesEndpoints.updateTableRowStyle(ctx, {
				documentId: 'doc1',
				tableStartLocation: { index: 2 },
				rowIndices: [0],
			});
			expect(
				lastCall().options.body.requests[0].updateTableRowStyle.fields,
			).toBe('minRowHeight,tableHeader,preventOverflow');
		});
	});

	describe('cache resilience', () => {
		it('endpoints survive a failing documents cache', async () => {
			mockRequest.mockResolvedValue(minimalDocument);
			const failingCtx = testContext({
				db: {
					documents: {
						upsertByEntityId: jest.fn().mockRejectedValue(new Error('db down')),
					},
				},
			});

			await expect(
				DocumentsEndpoints.getDocument(failingCtx, { documentId: 'doc1' }),
			).resolves.toMatchObject({ documentId: 'doc1' });
		});

		it('persistDocument merges prior cached fields instead of replacing them', async () => {
			mockRequest.mockResolvedValue(minimalDocument);
			const upsert = jest.fn().mockResolvedValue({ id: 'entity-1' });
			const mergeCtx = testContext({
				db: {
					documents: {
						// the webhook wrote this placeholder baseline; an endpoint
						// refresh must not wipe it with a full-replacement upsert
						findByEntityId: jest.fn().mockResolvedValue({
							data: { hasPlaceholder: true, url: 'https://docs.example/doc1' },
						}),
						upsertByEntityId: upsert,
					},
				},
			});

			await DocumentsEndpoints.getDocument(mergeCtx, { documentId: 'doc1' });

			expect(upsert).toHaveBeenCalledWith(
				'doc1',
				expect.objectContaining({
					hasPlaceholder: true,
					url: 'https://docs.example/doc1',
					title: 'Test Doc',
				}),
			);
		});

		it('persistDocument refreshes the placeholder baseline when configured', async () => {
			mockRequest.mockResolvedValue({
				...minimalDocument,
				body: {
					content: [
						{
							paragraph: {
								elements: [{ textRun: { content: 'fill {{name}} here' } }],
							},
						},
					],
				},
			});
			const upsert = jest.fn().mockResolvedValue({ id: 'entity-1' });
			const placeholderCtx = testContext({
				options: { triggers: { placeholder: '{{name}}' } },
				db: {
					documents: {
						findByEntityId: jest
							.fn()
							.mockResolvedValue({ data: { hasPlaceholder: false } }),
						upsertByEntityId: upsert,
					},
				},
			});

			await DocumentsEndpoints.getDocument(placeholderCtx, {
				documentId: 'doc1',
			});

			expect(upsert).toHaveBeenCalledWith(
				'doc1',
				expect.objectContaining({ hasPlaceholder: true }),
			);
		});

		it('persistDocument refreshes the keyword baseline when configured', async () => {
			mockRequest.mockResolvedValue({
				...minimalDocument,
				body: {
					content: [
						{
							paragraph: {
								elements: [{ textRun: { content: 'shipping the LAUNCH now' } }],
							},
						},
					],
				},
			});
			const upsert = jest.fn().mockResolvedValue({ id: 'entity-1' });
			const keywordCtx = testContext({
				options: { triggers: { keyword: 'launch' } },
				db: {
					documents: {
						findByEntityId: jest
							.fn()
							.mockResolvedValue({ data: { hasKeyword: false } }),
						upsertByEntityId: upsert,
					},
				},
			});

			await DocumentsEndpoints.getDocument(keywordCtx, { documentId: 'doc1' });

			// matching is case-insensitive, mirroring the webhook trigger
			expect(upsert).toHaveBeenCalledWith(
				'doc1',
				expect.objectContaining({ hasKeyword: true }),
			);
		});

		it('persistDocument refreshes the searchMatch baseline when configured', async () => {
			mockRequest.mockResolvedValue({
				...minimalDocument,
				title: 'Quarterly PLAN review',
				body: {
					content: [
						{
							paragraph: {
								elements: [{ textRun: { content: 'plain body' } }],
							},
						},
					],
				},
			});
			const upsert = jest.fn().mockResolvedValue({ id: 'entity-1' });
			const searchCtx = testContext({
				options: { triggers: { searchQuery: 'plan' } },
				db: {
					documents: {
						findByEntityId: jest
							.fn()
							.mockResolvedValue({ data: { hasSearchMatch: false } }),
						upsertByEntityId: upsert,
					},
				},
			});

			await DocumentsEndpoints.getDocument(searchCtx, { documentId: 'doc1' });

			// title match is enough; mirrors webhook title-or-body matching
			expect(upsert).toHaveBeenCalledWith(
				'doc1',
				expect.objectContaining({ hasSearchMatch: true }),
			);
		});

		it('searchDocuments merges prior cached fields instead of replacing them', async () => {
			mockRequest.mockResolvedValue({
				files: [{ id: 'doc1', name: 'Found Doc' }],
			});
			const upsert = jest.fn().mockResolvedValue({ id: 'entity-1' });
			const searchCtx = testContext({
				db: {
					documents: {
						// baselines written by the webhook; a search result carries only
						// id and name and must not wipe them
						findByEntityId: jest.fn().mockResolvedValue({
							data: { headerCount: 2, wordCount: 40, hasPlaceholder: true },
						}),
						upsertByEntityId: upsert,
					},
				},
			});

			await DocumentsEndpoints.searchDocuments(searchCtx, {
				q: "name contains 'Found'",
			});

			expect(upsert).toHaveBeenCalledWith(
				'doc1',
				expect.objectContaining({
					headerCount: 2,
					wordCount: 40,
					hasPlaceholder: true,
					title: 'Found Doc',
				}),
			);
		});
	});
});

describe('Drive changes pagination (mocked HTTP)', () => {
	beforeEach(() => {
		mockRequest.mockReset();
	});

	it('fetchChanges follows nextPageToken until the list is complete', async () => {
		mockRequest
			.mockResolvedValueOnce({
				changes: [{ fileId: 'a' }, { fileId: 'b' }],
				nextPageToken: 'page-2',
			})
			.mockResolvedValueOnce({
				changes: [{ fileId: 'c' }],
				nextPageToken: 'page-3',
			})
			.mockResolvedValueOnce({
				changes: [{ fileId: 'd' }],
				newStartPageToken: 'start-next',
			});

		const result = await changesTestOnly.fetchChanges('tok', 'page-1');

		expect(result.changes?.map((c) => c.fileId)).toEqual(['a', 'b', 'c', 'd']);
		expect(result.newStartPageToken).toBe('start-next');
		expect(mockRequest).toHaveBeenCalledTimes(3);
		expect(mockRequest.mock.calls.map((c) => c[1].query.pageToken)).toEqual([
			'page-1',
			'page-2',
			'page-3',
		]);
		// pageSize uses the API maximum so busy Drives need fewer round-trips
		expect(mockRequest.mock.calls[0]?.[1].query.pageSize).toBe(1000);
	});

	it('fetchChanges stops if Drive repeats a pageToken', async () => {
		mockRequest.mockResolvedValue({
			changes: [{ fileId: 'a' }],
			nextPageToken: 'loop',
		});

		const result = await changesTestOnly.fetchChanges('tok', 'loop');

		expect(result.changes?.map((c) => c.fileId)).toEqual(['a']);
		expect(mockRequest).toHaveBeenCalledTimes(1);
	});
});

// ─────────────────────────────────────────────────────────────────────────────
// Live API tests — only run when GOOGLE_ACCESS_TOKEN is provided.
// ─────────────────────────────────────────────────────────────────────────────

const TEST_TOKEN = process.env.GOOGLE_ACCESS_TOKEN;
const describeMaybe = TEST_TOKEN ? describe : describe.skip;

let createdDocumentIds: string[] = [];

async function cleanupLiveDocs() {
	for (const documentId of createdDocumentIds) {
		try {
			await makeGoogleDriveRequest(`/files/${documentId}`, TEST_TOKEN!, {
				method: 'DELETE',
			});
		} catch (error) {
			console.warn(`Failed to cleanup document ${documentId}:`, error);
		}
	}
}

describeMaybe('Google Docs API type tests (live)', () => {
	beforeAll(() => {
		// The live tests must hit the real network, not the routing mock.
		mockRequest.mockImplementation((...args: unknown[]) => {
			const original = jest.requireActual('corsair/http');
			return original.request(...args);
		});
	});

	afterAll(async () => {
		await cleanupLiveDocs();
	});

	it('createDocument returns a parseable Document', async () => {
		const document = await makeGoogleDocsRequest<Document>(
			'/documents',
			TEST_TOKEN!,
			{ method: 'POST', body: { title: 'Corsair Docs API Test' } },
		);

		if (document.documentId) {
			createdDocumentIds.push(document.documentId);
		}

		GoogleDocsEndpointOutputSchemas.createDocument.parse(document);
	});

	it('searchDocuments returns a parseable DriveFileList', async () => {
		const result = await makeGoogleDriveRequest<DriveFileList>(
			'/files',
			TEST_TOKEN!,
			{
				method: 'GET',
				query: {
					q: "mimeType='application/vnd.google-apps.document'",
					pageSize: 5,
					fields: 'nextPageToken,files(id,name,mimeType,modifiedTime)',
				},
			},
		);

		GoogleDocsEndpointOutputSchemas.searchDocuments.parse(result);
	});
});
