import type { EndpointJob, EndpointMetaEntry } from 'corsair/core';
import { z } from 'zod';
import {
	BATCH_JOB_STATUSES,
	MistralAiEndpointOutputSchemas,
} from './endpoints/types';
import { mistralAiEndpointMeta, mistralAiEndpointSchemas } from './index';

const meta: Record<string, EndpointMetaEntry | undefined> =
	mistralAiEndpointMeta;

const OUTPUT_FOR: Record<string, keyof typeof MistralAiEndpointOutputSchemas> =
	{
		'batch.create': 'batchCreate',
		'batch.get': 'batchGet',
	};

const shapeOf = (op: string): Record<string, z.ZodType> => {
	const key = OUTPUT_FOR[op];
	const schema = key ? MistralAiEndpointOutputSchemas[key] : undefined;
	return schema instanceof z.ZodObject ? schema.shape : {};
};

// Statuses that mean the job is still going (the spec's BatchJobStatus).
const PENDING = ['QUEUED', 'RUNNING', 'CANCELLATION_REQUESTED'];

const jobs = Object.entries(meta).flatMap(
	([op, entry]): Array<[string, { job: EndpointJob }]> =>
		entry?.job ? [[op, { job: entry.job }]] : [],
);

describe('Mistral AI jobs', () => {
	it('declares a job on batch.create only', () => {
		expect(jobs.map(([op]) => op)).toEqual(['batch.create']);
	});

	it.each(jobs)(
		'%s reads back and cancels through operations this plugin has',
		(op, { job }) => {
			expect(meta[job.status.op]).toBeDefined();
			expect(job.cancel && meta[job.cancel.op]).toBeDefined();
			expect(shapeOf(op)[job.idPath]).toBeDefined();
		},
	);

	it.each(jobs)(
		'%s: the status and cancel reads take the job id',
		(_op, { job }) => {
			for (const { op, idArg } of [
				job.status,
				...(job.cancel ? [job.cancel] : []),
			]) {
				const input =
					mistralAiEndpointSchemas[op as keyof typeof mistralAiEndpointSchemas]
						.input;
				expect(input).toBeInstanceOf(z.ZodObject);
				expect(
					input.safeParse({
						[idArg]: 'b2f4a1c8-1e0d-4a8e-9c3b-5d6e7f809a1b',
					}).success,
				).toBe(true);
			}
		},
	);

	// A status the spec adds and these lists don't place would read as
	// "still running" forever, so every value must be placed exactly once.
	it.each(jobs)(
		'%s places every status batch.get can report',
		(_op, { job }) => {
			const status = shapeOf(job.status.op)[job.status.statusPath];
			expect(status).toBeInstanceOf(z.ZodEnum);
			const values = (status as z.ZodEnum).options.map(String);
			expect(values).toEqual([...BATCH_JOB_STATUSES]);

			const placed = [...PENDING, ...job.status.done, ...job.status.failed];
			expect([...placed].sort()).toEqual([...values].sort());
			expect(new Set(placed).size).toBe(placed.length);
			expect(job.status.done).toEqual(['SUCCESS']);
		},
	);
});
