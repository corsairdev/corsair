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
		'%s: every documented terminal status sorts into done or failed',
		(_op, { job }) => {
			// done and failed must not overlap, and both must be non-empty
			// unless the provider documents no failure state.
			for (const status of job.status.done) {
				expect(job.status.failed.includes(status)).toBe(false);
			}
			const all = [...job.status.done, ...job.status.failed];
			expect(all.length).toBeGreaterThan(0);
			// meetings report `status`; the other three report `state`.
			const meetingsJob = job.status.op === 'meetings.get';
			expect(job.status.statusPath).toBe(meetingsJob ? 'status' : 'state');
		},
	);
});
