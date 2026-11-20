import type { EndpointJob } from 'corsair/core';
import { z } from 'zod';
import { BytedanceEndpointOutputSchemas } from './endpoints/types';
import { bytedance, bytedanceEndpointSchemas } from './index';

const meta = bytedance().endpointMeta as Record<
	string,
	{ job?: EndpointJob } | undefined
>;

// Statuses a task passes through before it ends.
const RUNNING = ['queued', 'running'];

const OUTPUT_FOR: Record<string, z.ZodType> = {
	'video.create': BytedanceEndpointOutputSchemas.videoCreate,
	'tasks.get': BytedanceEndpointOutputSchemas.tasksGet,
};

const shapeOf = (op: string): Record<string, z.ZodType> => {
	const schema = OUTPUT_FOR[op];
	return schema instanceof z.ZodObject ? schema.shape : {};
};

const jobs = Object.entries(meta).filter(
	(entry): entry is [string, { job: EndpointJob }] => Boolean(entry[1]?.job),
);

describe('ByteDance jobs', () => {
	it('declares a job on the operation that starts a video task', () => {
		expect(jobs.map(([op]) => op)).toEqual(['video.create']);
	});

	it.each(jobs)(
		'%s reads back through an operation this plugin has',
		(op, { job }) => {
			expect(meta[job.status.op]).toBeDefined();
			expect(job.cancel).toBeUndefined();
			expect(shapeOf(op)[job.idPath]).toBeDefined();
		},
	);

	it.each(jobs)(
		'%s: the status read takes the job id as its argument',
		(_op, { job }) => {
			const input = bytedanceEndpointSchemas[
				job.status.op as keyof typeof bytedanceEndpointSchemas
			].input as z.ZodObject;
			expect(input.shape[job.status.idArg]).toBeDefined();
			expect(
				input.safeParse({ [job.status.idArg]: 'cgt-20250101-abcd' }).success,
			).toBe(true);
		},
	);

	// A status the schema gains and this list doesn't sort would read as
	// "still running" forever, so every value must be placed.
	it.each(jobs)(
		'%s sorts every status the read can answer with',
		(_op, { job }) => {
			const status = shapeOf(job.status.op)[job.status.statusPath];
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
