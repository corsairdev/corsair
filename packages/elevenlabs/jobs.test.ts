import type { EndpointJob } from 'corsair/core';
import type { z } from 'zod';
import {
	DUBBING_STATES,
	ElevenLabsEndpointOutputSchemas,
} from './endpoints/types';
import { elevenLabsEndpointSchemas, elevenlabs } from './index';

const meta = elevenlabs().endpointMeta as Record<
	string,
	{ job?: EndpointJob } | undefined
>;

const jobs = Object.entries(meta).filter(
	(entry): entry is [string, { job: EndpointJob }] => Boolean(entry[1]?.job),
);

const RUNNING = ['queued', 'preparing', 'dubbing'];

describe('ElevenLabs jobs', () => {
	it('declares a job only on dubbing.create', () => {
		expect(jobs.map(([op]) => op)).toEqual(['dubbing.create']);
	});

	const job = meta['dubbing.create']!.job!;

	// unknown: the output schemas are typed loosely in their map; these two are objects.
	it('reads back through an operation this plugin has', () => {
		expect(meta[job.status.op]).toBeDefined();
		const shape = (
			ElevenLabsEndpointOutputSchemas.dubbingCreate as unknown as z.ZodObject
		).shape;
		expect(shape[job.idPath]).toBeDefined();
	});

	it('the status read takes the job id as its argument', () => {
		const input = elevenLabsEndpointSchemas[
			job.status.op as keyof typeof elevenLabsEndpointSchemas
		].input as z.ZodObject;
		expect(input.shape[job.status.idArg]).toBeDefined();
		expect(input.safeParse({ [job.status.idArg]: 'abc123' }).success).toBe(
			true,
		);
	});

	// unknown: as above, the schema map's type doesn't expose the object shape.
	it('finds the status where the status read puts it', () => {
		const shape = (
			ElevenLabsEndpointOutputSchemas.dubbingGet as unknown as z.ZodObject
		).shape;
		expect(shape[job.status.statusPath]).toBeDefined();
	});

	// A state this list misses would read as "still running" forever, so every
	// state the API can answer with must be placed.
	it('sorts every state a dub can be in', () => {
		expect(job.status.done).toEqual(['dubbed']);
		expect(job.status.failed).toEqual(['failed']);
		for (const value of [...job.status.done, ...job.status.failed]) {
			expect(DUBBING_STATES).toContain(value);
		}
		const unsorted = DUBBING_STATES.filter(
			(state) =>
				!RUNNING.includes(state) &&
				!job.status.done.includes(state) &&
				!job.status.failed.includes(state),
		);
		expect(unsorted).toEqual([]);
	});

	it('declares no cancel, because a running dub cannot be stopped', () => {
		expect(job.cancel).toBeUndefined();
	});
});
