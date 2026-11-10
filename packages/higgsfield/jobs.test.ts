import type { EndpointJob } from 'corsair/core';
import { z } from 'zod';
import {
	HiggsfieldEndpointOutputSchemas,
	REQUEST_STATUSES,
} from './endpoints/types';
import { higgsfield, higgsfieldEndpointSchemas } from './index';
import { REQUEST_ID } from './test-fixtures';

const meta = higgsfield().endpointMeta as Record<
	string,
	{ job?: EndpointJob } | undefined
>;

const OUTPUT_FOR: Record<string, z.ZodObject> = {
	'generations.submit': HiggsfieldEndpointOutputSchemas.generationsSubmit,
	'generations.run': HiggsfieldEndpointOutputSchemas.generationsRun,
};

const RUNNING = ['queued', 'in_progress'];

const jobs = Object.entries(meta).filter(
	(entry): entry is [string, { job: EndpointJob }] => Boolean(entry[1]?.job),
);

describe('higgsfield jobs', () => {
	it('declares a job on both operations that can leave a request running', () => {
		expect(jobs.map(([op]) => op).sort()).toEqual([
			'generations.run',
			'generations.submit',
		]);
	});

	it.each(jobs)(
		'%s reads back through operations this plugin has',
		(op, { job }) => {
			expect(meta[job.status.op]).toBeDefined();
			if (job.cancel) expect(meta[job.cancel.op]).toBeDefined();
			expect(OUTPUT_FOR[op]?.shape[job.idPath]).toBeDefined();
		},
	);

	it.each(jobs)(
		'%s: the status read takes the job id as its argument',
		(_op, { job }) => {
			const input = higgsfieldEndpointSchemas[
				job.status.op as keyof typeof higgsfieldEndpointSchemas
			].input as z.ZodObject;
			expect(input.shape[job.status.idArg]).toBeDefined();
			expect(input.safeParse({ [job.status.idArg]: REQUEST_ID }).success).toBe(
				true,
			);
		},
	);

	// A status the schema gains and this list doesn't sort would read as
	// "still running" forever, so every documented value must be placed.
	it.each(jobs)(
		'%s sorts every documented status the status read can answer with',
		(_op, { job }) => {
			const status =
				HiggsfieldEndpointOutputSchemas.requestsStatus.shape.status;
			expect(status).toBeInstanceOf(z.ZodUnion);
			// unknown: zod's own types don't reach a union's options from `shape`.
			const known = (status as unknown as z.ZodUnion).options[0];
			expect(known).toBeInstanceOf(z.ZodEnum);
			const values = (known as z.ZodEnum).options.map(String);
			expect(values).toEqual([...REQUEST_STATUSES]);
			expect(
				values.filter(
					(v) =>
						!RUNNING.includes(v) &&
						!job.status.done.includes(v) &&
						!job.status.failed.includes(v),
				),
			).toEqual([]);
			expect(job.status.done).toEqual(['completed']);
			expect([...job.status.failed].sort()).toEqual([
				'canceled',
				'failed',
				'nsfw',
			]);
		},
	);

	it('keeps a status added later readable instead of breaking', () => {
		expect(
			HiggsfieldEndpointOutputSchemas.requestsStatus.safeParse({
				status: 'something_new',
				request_id: REQUEST_ID,
			}).success,
		).toBe(true);
	});

	it('fits a job handle inside the 128 characters MCP Tasks allow', () => {
		const handle = `higgsfield:requests.status:${REQUEST_ID}`;
		expect(handle.length).toBeLessThan(128);
	});
});
