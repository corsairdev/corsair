import type { EndpointJob } from 'corsair/core';
import type { z } from 'zod';
import { ListcleanEndpointOutputSchemas } from './endpoints/types';
import { listclean } from './index';
import { SINGLE_LIST } from './test-fixtures';

const meta = listclean().endpointMeta as Record<
	string,
	{ job?: EndpointJob } | undefined
>;

const LIST_ID = 159261;

// The submit answer's data, and every status the /lists/{list_id} read can
// document. Statuses are uppercase in this flow.
const STATUSES = ['SUBMITTED', 'INPROCESS', 'COMPLETED'] as const;
const RUNNING = ['SUBMITTED', 'INPROCESS'] as const;

// unknown: the read's raw answer is untyped JSON; the output schema parses it.
const read = (status: string) =>
	JSON.parse(JSON.stringify([{ ...SINGLE_LIST[0], status }])) as unknown;

// unknown: walks a dot path (like a job's idPath or statusPath) through any
// operation's output, so no one output type fits; each step checks it holds an
// object or array before indexing it.
const at = (value: unknown, path: string): unknown =>
	path
		.split('.')
		.reduce<unknown>(
			(node, key) =>
				node !== null && typeof node === 'object'
					? (node as Record<string, unknown>)[key]
					: undefined,
			value,
		);

const jobs = Object.entries(meta).filter(
	(entry): entry is [string, { job: EndpointJob }] => Boolean(entry[1]?.job),
);

const outputs: Record<string, z.ZodType> = {
	'verify.startBatchVerification':
		ListcleanEndpointOutputSchemas.verifyStartBatchVerification,
	'lists.getList': ListcleanEndpointOutputSchemas.listsGetList,
};

describe('Listclean jobs', () => {
	it('declares a job on exactly the batch submit', () => {
		expect(jobs.map(([op]) => op)).toEqual(['verify.startBatchVerification']);
	});

	it('reads back through lists.getList, taking the list id as its argument', () => {
		const { job } = jobs[0]![1];
		expect(meta[job.status.op]).toBeDefined();
		expect(job.status.op).toBe('lists.getList');
		expect(job.status.idArg).toBe('list_id');
		expect(job.cancel).toBeUndefined();
	});

	it('finds the list id where the job says, in the documented submit answer', () => {
		const { job } = jobs[0]![1];
		const parsed = outputs['verify.startBatchVerification']!.parse({
			list_id: LIST_ID,
		});
		expect(at(parsed, job.idPath)).toBe(LIST_ID);
	});

	it('finds the status where the job says, in the documented read answer', () => {
		const { job } = jobs[0]![1];
		for (const status of STATUSES) {
			const parsed = outputs[job.status.op]!.parse(read(status));
			expect(at(parsed, job.status.statusPath)).toBe(status);
		}
	});

	// A status this list doesn't sort would read as "still running" forever,
	// so every documented value must be placed.
	it('sorts every documented status into done, failed or running', () => {
		const { job } = jobs[0]![1];
		expect(job.status.done).toEqual(['COMPLETED']);
		// Listclean documents no failed status for this flow; if one appears,
		// this test fails until it is placed.
		expect(job.status.failed).toEqual([]);
		expect(
			STATUSES.filter(
				(value) =>
					!RUNNING.includes(value as (typeof RUNNING)[number]) &&
					!job.status.done.includes(value) &&
					!job.status.failed.includes(value),
			),
		).toEqual([]);
	});
});
