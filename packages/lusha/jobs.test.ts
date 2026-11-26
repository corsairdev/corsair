import type { EndpointJob } from 'corsair/core';
import { z } from 'zod';
import {
	LUSHA_ENRICH_STATUSES,
	LUSHA_JOB_STATUSES,
	LushaEndpointOutputSchemas,
} from './endpoints/types';
import { lusha, lushaEndpointSchemas } from './index';

const meta = lusha().endpointMeta as Record<
	string,
	{ job?: EndpointJob } | undefined
>;

const RUNNING = ['processing'];

const jobs = Object.entries(meta).filter(
	(entry): entry is [string, { job: EndpointJob }] => Boolean(entry[1]?.job),
);

const OUTPUT_FOR: Record<string, keyof typeof LushaEndpointOutputSchemas> = {
	'person.enrichContacts': 'personEnrichContacts',
	'jobs.getContactsEnrichJob': 'jobsGetContactsEnrichJob',
};

const shapeOf = (op: string): Record<string, z.ZodType> => {
	// unknown: the schema union has no common object type, so the instanceof
	// check narrows it instead of a cast to ZodObject.
	const schema = LushaEndpointOutputSchemas[OUTPUT_FOR[op]!] as unknown;
	return schema instanceof z.ZodObject ? schema.shape : {};
};

describe('lusha jobs', () => {
	it('declares a job on the one operation that can leave work running', () => {
		expect(jobs.map(([op]) => op).sort()).toEqual(['person.enrichContacts']);
	});

	it.each(jobs)(
		'%s reads back through an operation this plugin has',
		(op, { job }) => {
			expect(meta[job.status.op]).toBeDefined();
			// The enrich response carries the job id at `job.id`.
			expect(shapeOf(op)[job.idPath.split('.')[0]!]).toBeDefined();
		},
	);

	it.each(jobs)(
		'%s: the status read takes the job id as its argument',
		(_op, { job }) => {
			const input = lushaEndpointSchemas[
				job.status.op as keyof typeof lushaEndpointSchemas
			].input as z.ZodObject;
			expect(input.shape[job.status.idArg]).toBeDefined();
			expect(
				input.safeParse({
					[job.status.idArg]: 'wf_3f2b9c1e-4a7d-4f3b-9c2e-1d6a5b8c7e90',
				}).success,
			).toBe(true);
		},
	);

	// A status the schema gains and this list doesn't sort would read as
	// "still running" forever, so every value must be placed.
	it.each(jobs)(
		'%s sorts every status the status read can answer with',
		(_op, { job }) => {
			const status = shapeOf(job.status.op)[job.status.statusPath];
			expect(status).toBeInstanceOf(z.ZodEnum);
			const values = (status as z.ZodEnum).options.map(String);
			expect(values).toEqual([...LUSHA_JOB_STATUSES]);
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

	it('pins the enrich response status to the documented waterfall outcomes', () => {
		// Omitted when the waterfall did not run, so the schema wraps the
		// enum nullish; unwrap the wrappers to check the members.
		// unknown: unwrap() returns zod's core type across the wrapper chain,
		// so the loop narrows with instanceof rather than a static type.
		let inner: unknown = shapeOf('person.enrichContacts').status;
		while (
			inner instanceof z.ZodOptional ||
			inner instanceof z.ZodNullable ||
			inner instanceof z.ZodDefault
		) {
			inner = (inner as z.ZodOptional).unwrap();
		}
		expect(inner).toBeInstanceOf(z.ZodEnum);
		expect((inner as z.ZodEnum).options.map(String)).toEqual([
			...LUSHA_ENRICH_STATUSES,
		]);
	});
});
