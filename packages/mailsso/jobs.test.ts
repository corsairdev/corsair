import type { EndpointJob } from 'corsair/core';
import { z } from 'zod';
import {
	BATCH_STATUSES,
	MailssoEndpointOutputSchemas,
} from './endpoints/types';
import { mailsso, mailssoEndpointSchemas } from './index';
import {
	batchCompletedFixture,
	batchCreatedFixture,
	batchProcessingFixture,
} from './test-fixtures';

const meta = mailsso().endpointMeta as Record<
	string,
	{ job?: EndpointJob } | undefined
>;

const jobs = Object.entries(meta).filter(
	(entry): entry is [string, { job: EndpointJob }] => Boolean(entry[1]?.job),
);

function batchJob(): EndpointJob {
	const entry = jobs[0];
	if (!entry) throw new Error('validations.batch declares no job');
	return entry[1].job;
}

describe('mailsso jobs', () => {
	it('declares a job only on the operation that starts one', () => {
		expect(jobs.map(([op]) => op)).toEqual(['validations.batch']);
	});

	it('reads the job back through an operation this plugin has', () => {
		const job = batchJob();

		expect(meta[job.status.op]).toBeDefined();
		expect(job.status.op).toBe('validations.getBatch');
		// Mails.so documents no cancel route, so none is declared.
		expect(job.cancel).toBeUndefined();
	});

	it('finds the job id in what the starting operation returns', () => {
		const job = batchJob();

		const output = MailssoEndpointOutputSchemas.validationsBatch;
		expect(output.shape[job.idPath as keyof typeof output.shape]).toBeDefined();
		expect(
			batchCreatedFixture[job.idPath as keyof typeof batchCreatedFixture],
		).toEqual(expect.any(String));
	});

	it('hands the id to an input that exists and accepts it', () => {
		const job = batchJob();

		const input = mailssoEndpointSchemas['validations.getBatch'].input;
		expect(
			input.shape[job.status.idArg as keyof typeof input.shape],
		).toBeDefined();
		expect(
			input.safeParse({ [job.status.idArg]: batchCreatedFixture.id }).success,
		).toBe(true);
	});

	it('reads the status from a field the status operation returns', () => {
		const job = batchJob();

		const output = MailssoEndpointOutputSchemas.validationsGetBatch;
		expect(
			output.shape[job.status.statusPath as keyof typeof output.shape],
		).toBeInstanceOf(z.ZodString);
	});

	it('sorts every status seen live into running or done', () => {
		const job = batchJob();

		expect(job.status.done).toEqual(BATCH_STATUSES.done);
		expect(BATCH_STATUSES.running).toContain(batchCreatedFixture.status);
		expect(job.status.done).toContain(batchCompletedFixture.status);
		expect(job.status.done).not.toContain(batchCreatedFixture.status);
		// Mails.so documents no failed status, so none is claimed.
		expect(job.status.failed).toEqual([]);
	});

	it('treats the processing status the status read reports as running', () => {
		const job = batchJob();

		expect(BATCH_STATUSES.running).toContain(
			batchProcessingFixture.data.status,
		);
		expect(job.status.done).not.toContain(batchProcessingFixture.data.status);
		expect(job.status.failed).not.toContain(batchProcessingFixture.data.status);
	});

	it('marks a finished job by status and by finished_at together', () => {
		expect(batchCreatedFixture.finished_at).toBeNull();
		expect(batchCompletedFixture.finished_at).toEqual(expect.any(String));
	});
});
