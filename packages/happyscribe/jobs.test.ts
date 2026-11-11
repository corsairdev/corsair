import type { EndpointJob } from 'corsair/core';
import { z } from 'zod';
import { HappyScribeEndpointOutputSchemas } from './endpoints/types';
import { happyScribeEndpointSchemas, happyscribe } from './index';

const meta = happyscribe().endpointMeta as Record<
	string,
	{ job?: EndpointJob } | undefined
>;

const OUTPUT_FOR = {
	'transcriptions.create':
		HappyScribeEndpointOutputSchemas.transcriptionsCreate,
	'exports.create': HappyScribeEndpointOutputSchemas.exportsCreate,
	'translations.createTask':
		HappyScribeEndpointOutputSchemas.translationsCreateTask,
	'meetings.create': HappyScribeEndpointOutputSchemas.meetingsCreate,
} as const;

const shapeOf = (op: keyof typeof OUTPUT_FOR): Record<string, z.ZodType> => {
	const schema = OUTPUT_FOR[op];
	return schema instanceof z.ZodObject ? schema.shape : {};
};

const jobs = Object.entries(meta).filter(
	(entry): entry is [string, { job: EndpointJob }] => Boolean(entry[1]?.job),
);

describe('happyscribe jobs', () => {
	it('declares a job on the four operations that leave work running', () => {
		expect(jobs.map(([op]) => op).sort()).toEqual([
			'exports.create',
			'meetings.create',
			'transcriptions.create',
			'translations.createTask',
		]);
	});

	it.each(jobs)(
		'%s reads back through an operation this plugin has',
		(op, { job }) => {
			expect(meta[job.status.op]).toBeDefined();
			expect(shapeOf(op as keyof typeof OUTPUT_FOR)[job.idPath]).toBeDefined();
		},
	);

	it.each(jobs)(
		'%s: the status read takes the job id as its argument',
		(_op, { job }) => {
			const input = happyScribeEndpointSchemas[
				job.status.op as keyof typeof happyScribeEndpointSchemas
			].input as z.ZodObject;
			expect(input.shape[job.status.idArg]).toBeDefined();
		},
	);

	it.each(jobs)(
		'%s: terminal states match the documented values exactly',
		(op, { job }) => {
			// Expected terminal values, from the docs, specified per job.
			const expected: Record<string, { done: string[]; failed: string[] }> = {
				'transcriptions.create': {
					done: ['automatic_done'],
					failed: ['failed', 'locked'],
				},
				'exports.create': { done: ['ready'], failed: ['failed', 'expired'] },
				'translations.createTask': { done: ['done'], failed: ['failed'] },
				'meetings.create': {
					done: ['completed'],
					failed: ['failed', 'cancelled'],
				},
			};
			expect(job.status.done).toEqual(expected[op]!.done);
			expect(job.status.failed).toEqual(expected[op]!.failed);
			// done and failed must not overlap.
			for (const status of job.status.done) {
				expect(job.status.failed.includes(status)).toBe(false);
			}
			// meetings report `status`; the other three report `state`.
			expect(job.status.statusPath).toBe(
				job.status.op === 'meetings.get' ? 'status' : 'state',
			);
		},
	);
});
