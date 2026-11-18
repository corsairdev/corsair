import type { EndpointJob } from 'corsair/core';
import { z } from 'zod';
import { AlibabaEndpointOutputSchemas } from './endpoints/types';
import { alibaba, alibabaEndpointSchemas } from './index';

const meta = alibaba().endpointMeta as Record<
	string,
	{ job?: EndpointJob } | undefined
>;

// Statuses a task passes through before it ends.
const RUNNING = ['PENDING', 'RUNNING'];

const OUTPUT_FOR: Record<string, z.ZodType> = {
	'video.textToVideo': AlibabaEndpointOutputSchemas.videoTextToVideo,
	'video.imageToVideo': AlibabaEndpointOutputSchemas.videoImageToVideo,
	'video.referenceToVideo': AlibabaEndpointOutputSchemas.videoReferenceToVideo,
	'video.edit': AlibabaEndpointOutputSchemas.videoEdit,
	'tasks.get': AlibabaEndpointOutputSchemas.tasksGet,
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

describe('Alibaba jobs', () => {
	it('declares a job on every operation that starts a video task', () => {
		expect(jobs.map(([op]) => op).sort()).toEqual([
			'video.edit',
			'video.imageToVideo',
			'video.referenceToVideo',
			'video.textToVideo',
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
			const input = alibabaEndpointSchemas[
				job.status.op as keyof typeof alibabaEndpointSchemas
			].input as z.ZodObject;
			expect(input.shape[job.status.idArg]).toBeDefined();
			expect(
				input.safeParse({
					[job.status.idArg]: 'b4c0e5d3-4f2c-4a1e-9b7a-1c2d3e4f5a6b',
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
