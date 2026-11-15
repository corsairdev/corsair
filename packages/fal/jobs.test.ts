import type { EndpointJob } from 'corsair/core';
import { z } from 'zod';
import { FalEndpointOutputSchemas, QUEUE_STATES } from './endpoints/types';
import { fal, falEndpointSchemas } from './index';

const meta = fal().endpointMeta as Record<
	string,
	{ job?: EndpointJob } | undefined
>;

const OUTPUT_FOR: Record<string, keyof typeof FalEndpointOutputSchemas> = {
	'models.run': 'modelsRun',
	'queue.submit': 'queueSubmit',
	'queue.status': 'queueStatus',
};

const shapeOf = (op: string): Record<string, z.ZodType> => {
	const schema = FalEndpointOutputSchemas[OUTPUT_FOR[op]!];
	return schema instanceof z.ZodObject ? schema.shape : {};
};

const RUNNING = ['IN_QUEUE', 'IN_PROGRESS'];

const jobs = Object.entries(meta).filter(
	(entry): entry is [string, { job: EndpointJob }] => Boolean(entry[1]?.job),
);

describe('fal jobs', () => {
	it('declares a job on both operations that can leave a request running', () => {
		expect(jobs.map(([op]) => op).sort()).toEqual([
			'models.run',
			'queue.submit',
		]);
	});

	it.each(jobs)(
		'%s reads back through operations this plugin has',
		(op, { job }) => {
			expect(meta[job.status.op]).toBeDefined();
			if (job.cancel) expect(meta[job.cancel.op]).toBeDefined();
			expect(shapeOf(op)[job.idPath]).toBeDefined();
		},
	);

	it.each(jobs)(
		'%s: the status read takes the job id as its argument',
		(_op, { job }) => {
			const input = falEndpointSchemas[
				job.status.op as keyof typeof falEndpointSchemas
			].input as z.ZodObject;
			expect(input.shape[job.status.idArg]).toBeDefined();
			expect(
				input.safeParse({
					[job.status.idArg]:
						'https://queue.fal.run/fal-ai/flux/requests/01a1b266-5b01-74f3-9ff7-03a43d7a2cc5',
				}).success,
			).toBe(true);
		},
	);

	// A state the schema gains and this list doesn't sort would read as
	// "still running" forever, so every value must be placed.
	it.each(jobs)(
		'%s sorts every state the status read can answer with',
		(_op, { job }) => {
			const state = shapeOf(job.status.op)[job.status.statusPath];
			expect(state).toBeInstanceOf(z.ZodEnum);
			const values = (state as z.ZodEnum).options.map(String);
			expect(values).toEqual([...QUEUE_STATES]);
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
