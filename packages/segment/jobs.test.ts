import type { EndpointJob } from 'corsair/core';
import { z } from 'zod';
import {
	SEGMENT_REGULATION_STATUSES,
	SegmentEndpointOutputSchemas,
} from './endpoints/types';
import { segment } from './index';

const meta = segment().endpointMeta as Record<
	string,
	{ job?: EndpointJob } | undefined
>;

const jobs = Object.entries(meta).filter(
	(entry): entry is [string, { job: EndpointJob }] => Boolean(entry[1]?.job),
);

// The output schema the poll operation answers with, by its endpointMeta path.
const OUTPUT_FOR: Record<string, keyof typeof SegmentEndpointOutputSchemas> = {
	'regulations.get': 'regulationsGet',
};

// Walk the poll output schema to the enum the statusPath names; every
// wrapper on the way (loose objects, nullish fields) must be unwrapped.
function regulationStatusValues(): string[] {
	let current: z.ZodType =
		SegmentEndpointOutputSchemas[OUTPUT_FOR['regulations.get']!];
	for (const key of ['data', 'regulation', 'overallStatus']) {
		if (!(current instanceof z.ZodObject)) return [];
		let field: z.ZodType | undefined = current.shape[key];
		// The enum sits under .nullish() wrappers, unwrapped until it appears.
		while (field && !(field instanceof z.ZodEnum) && 'unwrap' in field) {
			field = (field as { unwrap: () => z.ZodType }).unwrap();
		}
		if (!field) return [];
		current = field;
	}
	return current instanceof z.ZodEnum ? current.options.map(String) : [];
}

describe('Segment jobs', () => {
	it('declares a job only on regulations.create', () => {
		expect(jobs.map(([op]) => op).sort()).toEqual(['regulations.create']);
	});

	it('reads back through an operation this plugin has', () => {
		for (const [, { job }] of jobs) {
			expect(meta[job.status.op]).toBeDefined();
			expect(job.cancel).toBeUndefined();
		}
	});

	// A status the schema gains and this list does not sort would read as
	// "still running" forever, so every documented value must be placed.
	it('sorts every documented regulation status', () => {
		const [, { job }] = jobs[0]!;
		const values = regulationStatusValues();
		expect(values.sort()).toEqual([...SEGMENT_REGULATION_STATUSES].sort());
		for (const value of [...job.status.done, ...job.status.failed]) {
			expect(values).toContain(value);
		}
		const unsorted = values.filter(
			(value) =>
				value !== 'RUNNING' &&
				value !== 'INITIALIZED' &&
				!job.status.done.includes(value) &&
				!job.status.failed.includes(value),
		);
		expect(unsorted).toEqual([]);
	});

	it('leaves the in-progress values RUNNING and INITIALIZED out of both terminals', () => {
		const [, { job }] = jobs[0]!;
		expect(job.status.done).not.toContain('RUNNING');
		expect(job.status.done).not.toContain('INITIALIZED');
		expect(job.status.failed).not.toContain('RUNNING');
		expect(job.status.failed).not.toContain('INITIALIZED');
	});
});
