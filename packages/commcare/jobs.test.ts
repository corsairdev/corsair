import type { EndpointJob } from 'corsair/core';
import { z } from 'zod';
import { CommCareEndpointOutputSchemas } from './endpoints/types';
import { commCareEndpointSchemas, commcare } from './index';

const meta = commcare().endpointMeta as Record<
	string,
	{ job?: EndpointJob } | undefined
>;

const OUTPUT_FOR = {
	'forms.bulkAction': CommCareEndpointOutputSchemas.formsBulkAction,
} as const;

const shapeOf = (op: keyof typeof OUTPUT_FOR): Record<string, z.ZodType> => {
	const schema = OUTPUT_FOR[op];
	return schema instanceof z.ZodObject ? schema.shape : {};
};

const jobs = Object.entries(meta).filter(
	(entry): entry is [string, { job: EndpointJob }] => Boolean(entry[1]?.job),
);

describe('commcare jobs', () => {
	it('declares a job on the bulk form action only', () => {
		expect(jobs.map(([op]) => op).sort()).toEqual(['forms.bulkAction']);
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
			const input = commCareEndpointSchemas[
				job.status.op as keyof typeof commCareEndpointSchemas
			].input as z.ZodObject;
			expect(input.shape[job.status.idArg]).toBeDefined();
		},
	);

	it.each(jobs)(
		'%s: terminal states match the documented values exactly',
		(_op, { job }) => {
			// Docs: status starts at pending, complete when finished, and a job
			// "is possible to be marked failed".
			expect(job.status.done).toEqual(['complete']);
			expect(job.status.failed).toEqual(['failed']);
			expect(job.status.statusPath).toBe('status');
		},
	);
});
