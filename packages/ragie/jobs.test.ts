import type { EndpointJob } from 'corsair/core';
import { z } from 'zod';
import { DOCUMENT_STATUSES, RESPONSE_STATUSES } from './endpoints/types';
import { ragie, ragieEndpointSchemas } from './index';

const meta = ragie().endpointMeta as Record<
	string,
	{ job?: EndpointJob } | undefined
>;

const OUTPUT_FOR: Record<string, keyof typeof ragieEndpointSchemas> = {
	'documents.create': 'documents.get',
	'documents.createRaw': 'documents.get',
	'documents.createFromUrl': 'documents.get',
	'documents.updateFile': 'documents.get',
	'documents.updateFromUrl': 'documents.get',
	'documents.updateRaw': 'documents.get',
	'responses.create': 'responses.get',
};

const ID_PATH_FIELD: Record<string, string> = {
	'documents.create': 'documentsCreate',
	'documents.createRaw': 'documentsCreateRaw',
	'documents.createFromUrl': 'documentsCreateFromUrl',
	'documents.updateFile': 'documentsUpdateFile',
	'documents.updateFromUrl': 'documentsUpdateFromUrl',
	'documents.updateRaw': 'documentsUpdateRaw',
	'responses.create': 'responsesCreate',
};

const jobs = Object.entries(meta).filter(
	(entry): entry is [string, { job: EndpointJob }] => Boolean(entry[1]?.job),
);

describe('ragie jobs', () => {
	it('declares a job on every operation that starts asynchronous work', () => {
		expect(jobs.map(([op]) => op).sort()).toEqual([
			'documents.create',
			'documents.createFromUrl',
			'documents.createRaw',
			'documents.updateFile',
			'documents.updateFromUrl',
			'documents.updateRaw',
			'responses.create',
		]);
	});

	it.each(jobs)(
		'%s reads back through an operation this plugin has',
		(op, { job }) => {
			expect(meta[job.status.op]).toBeDefined();
			expect(
				ragieEndpointSchemas[
					job.status.op as keyof typeof ragieEndpointSchemas
				],
			).toBeDefined();
			const output = ragieEndpointSchemas[OUTPUT_FOR[op]!].output;
			// unknown: the registry's value type is a union of schema kinds; only
			// the object schemas here carry a shape.
			expect(
				(output as unknown as { shape: Record<string, z.ZodType> }).shape[
					job.idPath
				],
			).toBeDefined();
		},
	);

	it.each(jobs)(
		'%s: the status read takes the job id as its argument',
		(_op, { job }) => {
			const input = ragieEndpointSchemas[
				job.status.op as keyof typeof ragieEndpointSchemas
			].input as z.ZodObject;
			expect(input.shape[job.status.idArg]).toBeDefined();
			expect(
				input.safeParse({
					[job.status.idArg]: 'b5331205-e0ee-4bb9-9d01-6d9a01d9e882',
				}).success,
			).toBe(true);
		},
	);

	it('pins the document pipeline exactly as documented', () => {
		// research.md lists the values in processing order plus the two
		// terminal ones; a value the schema gains but this list misses would
		// read as "still running" forever.
		expect(DOCUMENT_STATUSES).toEqual([
			'pending',
			'partitioning',
			'partitioned',
			'refined',
			'chunked',
			'indexed',
			'summary_indexed',
			'keyword_indexed',
			'ready',
			'failed',
		]);
	});

	it('sorts every document status into done, failed or a pipeline step', () => {
		const documentJob = meta['documents.create']?.job as EndpointJob;
		const sorted = [
			...documentJob.status.done,
			...documentJob.status.failed,
			...DOCUMENT_STATUSES,
		];
		expect(new Set(sorted).size).toBe(DOCUMENT_STATUSES.length);
		expect(documentJob.status.done).toEqual(['ready']);
		expect(documentJob.status.failed).toEqual(['failed']);
	});

	it('sorts every response status into done, failed or running', () => {
		const responseJob = meta['responses.create']?.job as EndpointJob;
		// The documented statuses are in_progress, completed and failed
		// (research table); no spec enum exists beyond them.
		expect([...RESPONSE_STATUSES].sort()).toEqual(
			['in_progress', 'completed', 'failed'].sort(),
		);
		expect(responseJob.status.done).toEqual(['completed']);
		expect(responseJob.status.failed).toEqual(['failed']);
		// The one value left over is the still-running state.
		expect(
			RESPONSE_STATUSES.filter(
				(v) =>
					!responseJob.status.done.includes(v) &&
					!responseJob.status.failed.includes(v),
			),
		).toEqual(['in_progress']);
	});

	it.each(jobs)(
		'%s: the status field is the enum on the status-read output',
		(_op, { job }) => {
			const output = ragieEndpointSchemas[
				job.status.op as keyof typeof ragieEndpointSchemas
			].output as z.ZodObject;
			const statusField = output.shape[job.status.statusPath];
			expect(statusField).toBeInstanceOf(z.ZodEnum);
			const values = (statusField as z.ZodEnum).options.map(String);
			for (const value of [...job.status.done, ...job.status.failed]) {
				expect(values).toContain(value);
			}
		},
	);
});
