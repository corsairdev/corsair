import type { EndpointJob } from 'corsair/core';
import { z } from 'zod';
import { OpenaiEndpointOutputSchemas } from './endpoints/types';
import { openai, openaiEndpointSchemas } from './index';

const meta = openai().endpointMeta as Record<
	string,
	{ job?: EndpointJob } | undefined
>;

// Statuses each read answers with before its job ends.
const RUNNING: Record<string, string[]> = {
	'videos.retrieve': ['queued', 'in_progress'],
	'batches.retrieve': ['validating', 'in_progress', 'finalizing', 'cancelling'],
	'fineTuning.retrieveJob': ['validating_files', 'queued', 'running'],
};

const OUTPUT_FOR: Record<string, z.ZodType> = {
	'videos.create': OpenaiEndpointOutputSchemas.videosCreate,
	'videos.createRemix': OpenaiEndpointOutputSchemas.videosCreateRemix,
	'videos.retrieve': OpenaiEndpointOutputSchemas.videosRetrieve,
	'batches.create': OpenaiEndpointOutputSchemas.batchesCreate,
	'batches.retrieve': OpenaiEndpointOutputSchemas.batchesRetrieve,
	'fineTuning.createJob': OpenaiEndpointOutputSchemas.fineTuningCreateJob,
	'fineTuning.retrieveJob': OpenaiEndpointOutputSchemas.fineTuningRetrieveJob,
};

const unwrap = (schema: z.ZodType | undefined): z.ZodType | undefined => {
	let cur = schema;
	while (cur instanceof z.ZodOptional || cur instanceof z.ZodNullable) {
		cur = cur.unwrap() as z.ZodType;
	}
	return cur;
};

// The schema at a dot path in an operation's output, through optional and
// nullable fields; undefined when the path isn't there.
const schemaAt = (op: string, path: string): z.ZodType | undefined => {
	let cur = unwrap(OUTPUT_FOR[op]);
	for (const key of path.split('.')) {
		cur = unwrap(cur instanceof z.ZodObject ? cur.shape[key] : undefined);
	}
	return cur;
};

const jobs = Object.entries(meta).filter(
	(entry): entry is [string, { job: EndpointJob }] => Boolean(entry[1]?.job),
);

describe('OpenAI jobs', () => {
	it('declares a job on every operation that starts a video, batch or fine-tuning job', () => {
		expect(jobs.map(([op]) => op).sort()).toEqual([
			'batches.create',
			'fineTuning.createJob',
			'videos.create',
			'videos.createRemix',
		]);
	});

	it.each(jobs)(
		'%s reads back through an operation this plugin has',
		(op, { job }) => {
			expect(meta[job.status.op]).toBeDefined();
			expect(schemaAt(op, job.idPath)).toBeInstanceOf(z.ZodString);
			if (job.cancel) {
				expect(meta[job.cancel.op]).toBeDefined();
				const input = openaiEndpointSchemas[
					job.cancel.op as keyof typeof openaiEndpointSchemas
				].input as z.ZodObject;
				expect(input.shape[job.cancel.idArg]).toBeDefined();
			}
		},
	);

	it.each(jobs)(
		'%s: the status read takes the job id as its argument',
		(_op, { job }) => {
			const input = openaiEndpointSchemas[
				job.status.op as keyof typeof openaiEndpointSchemas
			].input as z.ZodObject;
			expect(input.shape[job.status.idArg]).toBeDefined();
			expect(
				input.safeParse({
					[job.status.idArg]: 'video_68d7512d07848190b3e45da0ecbebcde',
				}).success,
			).toBe(true);
		},
	);

	// A status the schema gains and this list doesn't sort would read as
	// "still running" forever, so every value must be placed.
	it.each(jobs)(
		'%s sorts every status the read can answer with',
		(_op, { job }) => {
			const status = schemaAt(job.status.op, job.status.statusPath);
			expect(status).toBeInstanceOf(z.ZodEnum);
			const values = (status as z.ZodEnum).options.map(String);
			for (const value of [...job.status.done, ...job.status.failed]) {
				expect(values).toContain(value);
			}
			expect(
				values.filter(
					(v) =>
						!RUNNING[job.status.op]?.includes(v) &&
						!job.status.done.includes(v) &&
						!job.status.failed.includes(v),
				),
			).toEqual([]);
		},
	);
});
