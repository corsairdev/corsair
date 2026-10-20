import type { ReductoContext } from '../index';
import { rememberJob } from './persist';

type CacheTestContext = {
	db: {
		jobs: {
			findByEntityId: jest.Mock;
			upsertByEntityId: jest.Mock;
		};
		parseChunks: { upsertByEntityId: jest.Mock };
		parseBlocks: { upsertByEntityId: jest.Mock };
		parseOcrItems: { upsertByEntityId: jest.Mock };
		extractOutputs: { upsertByEntityId: jest.Mock };
		extractRecords: { upsertByEntityId: jest.Mock };
		extractCitations: { upsertByEntityId: jest.Mock };
		splitSegments: { upsertByEntityId: jest.Mock };
		classifyOutputs: { upsertByEntityId: jest.Mock };
		editOutputs: { upsertByEntityId: jest.Mock };
		editFormFields: { upsertByEntityId: jest.Mock };
		pipelineOutputs: { upsertByEntityId: jest.Mock };
	};
};

function createContext(): CacheTestContext {
	const upsert = jest.fn().mockResolvedValue(undefined);
	return {
		db: {
			jobs: {
				findByEntityId: jest.fn().mockResolvedValue(null),
				upsertByEntityId: upsert,
			},
			parseChunks: { upsertByEntityId: upsert },
			parseBlocks: { upsertByEntityId: upsert },
			parseOcrItems: { upsertByEntityId: upsert },
			extractOutputs: { upsertByEntityId: upsert },
			extractRecords: { upsertByEntityId: upsert },
			extractCitations: { upsertByEntityId: upsert },
			splitSegments: { upsertByEntityId: upsert },
			classifyOutputs: { upsertByEntityId: upsert },
			editOutputs: { upsertByEntityId: upsert },
			editFormFields: { upsertByEntityId: upsert },
			pipelineOutputs: { upsertByEntityId: upsert },
		},
	};
}

function asReductoContext(ctx: CacheTestContext): ReductoContext {
	return ctx as unknown as ReductoContext;
}

describe('rememberJob', () => {
	it('persists parse chunks, blocks, and ocr into entity tables', async () => {
		const ctx = createContext();
		const bbox = {
			left: 0.1,
			top: 0.2,
			width: 0.5,
			height: 0.3,
			page: 1,
			original_page: 1,
		};
		await rememberJob(asReductoContext(ctx), {
			job_id: 'job-parse',
			duration: 2.5,
			response_type: 'parse',
			usage: { num_pages: 3, credits: 4 },
			pdf_url: 'https://storage.example/out.pdf',
			document_properties: { title: 'Invoice' },
			result: {
				type: 'full',
				chunks: [
					{
						content: '# Title',
						embed: 'Title',
						enrichment_success: false,
						blocks: [
							{
								type: 'Title',
								content: 'Title',
								bbox,
								confidence: 'high',
								granular_confidence: { parse_confidence: 0.95 },
							},
						],
					},
				],
				ocr: {
					words: [{ text: 'Title', bbox, confidence: 0.99, chunk_index: 0 }],
				},
			},
		});

		expect(ctx.db.jobs.upsertByEntityId).toHaveBeenCalledWith(
			'job-parse',
			expect.objectContaining({
				jobId: 'job-parse',
				parseResultKind: 'full',
				pdfUrl: 'https://storage.example/out.pdf',
			}),
		);
		expect(ctx.db.parseBlocks.upsertByEntityId).toHaveBeenCalledWith(
			'job-parse#c0#b0',
			expect.objectContaining({ type: 'Title' }),
		);
	});

	it('persists extract, split, classify, edit, and pipeline entities', async () => {
		const ctx = createContext();

		await rememberJob(asReductoContext(ctx), {
			job_id: 'job-extract',
			type: 'Extract',
			usage: { num_pages: 1, num_fields: 2 },
			result: { total: 100 },
			citations: [{ block: 1 }],
		});
		expect(ctx.db.extractOutputs.upsertByEntityId).toHaveBeenCalledWith(
			'job-extract',
			expect.objectContaining({
				resultKind: 'inline',
				data: { total: 100 },
			}),
		);
		expect(ctx.db.extractCitations.upsertByEntityId).toHaveBeenCalledWith(
			'job-extract#cite0',
			expect.objectContaining({ citationIndex: 0 }),
		);

		await rememberJob(asReductoContext(ctx), {
			job_id: 'job-split',
			type: 'Split',
			result: { splits: [{ name: 'Intro', pages: [1, 2] }] },
		});
		expect(ctx.db.splitSegments.upsertByEntityId).toHaveBeenCalledWith(
			'job-split#split0',
			expect.objectContaining({ name: 'Intro', pages: [1, 2] }),
		);

		await rememberJob(asReductoContext(ctx), {
			job_id: 'job-classify',
			type: 'Classify',
			result: { category: 'invoice' },
		});
		expect(ctx.db.classifyOutputs.upsertByEntityId).toHaveBeenCalledWith(
			'job-classify',
			expect.objectContaining({ category: 'invoice', resultKind: 'inline' }),
		);

		await rememberJob(asReductoContext(ctx), {
			job_id: 'job-edit',
			document_url: 'https://storage.example/edited.pdf',
			form_schema: [{ field: 'name' }],
		});
		expect(ctx.db.editOutputs.upsertByEntityId).toHaveBeenCalledWith(
			'job-edit',
			expect.objectContaining({
				documentUrl: 'https://storage.example/edited.pdf',
			}),
		);
		expect(ctx.db.editFormFields.upsertByEntityId).toHaveBeenCalledWith(
			'job-edit#form0',
			expect.objectContaining({ fieldIndex: 0 }),
		);

		await rememberJob(asReductoContext(ctx), {
			job_id: 'job-pipeline',
			type: 'Pipeline',
			result: { step: 'done', ok: true },
		});
		expect(ctx.db.pipelineOutputs.upsertByEntityId).toHaveBeenCalledWith(
			'job-pipeline',
			expect.objectContaining({
				resultKind: 'inline',
				payload: { step: 'done', ok: true },
			}),
		);
	});

	it('merges with existing job rows instead of replacing them', async () => {
		const ctx = createContext();
		ctx.db.jobs.findByEntityId.mockResolvedValue({
			data: {
				jobId: 'job-1',
				type: 'Parse',
				numPages: 2,
				parseResultKind: 'full',
			},
		});

		await rememberJob(asReductoContext(ctx), {
			job_id: 'job-1',
			status: 'Completed',
		});

		expect(ctx.db.jobs.upsertByEntityId).toHaveBeenCalledWith(
			'job-1',
			expect.objectContaining({
				type: 'Parse',
				numPages: 2,
				status: 'Completed',
				parseResultKind: 'full',
			}),
		);
	});
});
