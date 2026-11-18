import type { EndpointJob } from 'corsair/core';
import { z } from 'zod';
import { GladiaEndpointOutputSchemas } from './endpoints/types';
import { gladia, gladiaEndpointSchemas } from './index';

const meta = gladia().endpointMeta as Record<
	string,
	{ job?: EndpointJob } | undefined
>;

// Statuses a transcription passes through before it ends.
const RUNNING = ['queued', 'processing'];

const OUTPUT_FOR: Record<string, z.ZodType> = {
	'preRecorded.initiateTranscription':
		GladiaEndpointOutputSchemas.initiatePreRecordedTranscription,
	'preRecorded.getJob': GladiaEndpointOutputSchemas.getPreRecordedJob,
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

describe('Gladia jobs', () => {
	it('declares a job on the operation that starts a pre-recorded transcription', () => {
		expect(jobs.map(([op]) => op)).toEqual([
			'preRecorded.initiateTranscription',
		]);
	});

	it.each(jobs)(
		'%s reads back through an operation this plugin has',
		(op, { job }) => {
			expect(meta[job.status.op]).toBeDefined();
			expect(schemaAt(op, job.idPath)).toBeInstanceOf(z.ZodString);
		},
	);

	it.each(jobs)(
		'%s: the status read takes the job id as its argument',
		(_op, { job }) => {
			const input = gladiaEndpointSchemas[
				job.status.op as keyof typeof gladiaEndpointSchemas
			].input as z.ZodObject;
			expect(input.shape[job.status.idArg]).toBeDefined();
			expect(
				input.safeParse({
					[job.status.idArg]: '45463597-20b7-4af7-b3b3-f5fb778203ab',
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
						!RUNNING.includes(v) &&
						!job.status.done.includes(v) &&
						!job.status.failed.includes(v),
				),
			).toEqual([]);
		},
	);
});
