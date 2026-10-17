import { SuzanneSchema } from './schema';
import { Job, mergeJob } from './schema/database';

const rich = {
	jobId: 'job_1',
	status: 'done' as const,
	model: 'sculptor',
	providerCreatedAt: '2026-06-01T00:00:00.000Z',
	outputs: [{ format: 'glb', downloadUrl: 'https://example/mesh' }],
	billableAmountCents: 25,
	errorCode: null,
	errorMessage: null,
};

describe('Suzanne job schema', () => {
	it('round-trips a finished job', () => {
		expect(Job.parse(rich)).toEqual(rich);
		expect(SuzanneSchema.entities.jobs.parse(rich).jobId).toBe('job_1');
	});

	it('keeps a finished mesh when a later write is only queued', () => {
		const merged = mergeJob(rich, { jobId: 'job_1', status: 'queued' });
		expect(merged.status).toBe('done');
		expect(merged.outputs).toEqual(rich.outputs);
		expect(merged.model).toBe('sculptor');
	});

	it('keeps the mesh when a cancel discovers the job already finished', () => {
		const merged = mergeJob(rich, { jobId: 'job_1' });
		expect(merged.status).toBe('done');
		expect(merged.outputs).toEqual(rich.outputs);
	});

	it('records a real failure over a queued row', () => {
		const merged = mergeJob(
			{ jobId: 'job_1', status: 'running', model: 'sculptor' },
			{
				jobId: 'job_1',
				status: 'failed',
				errorCode: 'vendor_timeout',
				errorMessage: 'timed out',
			},
		);
		expect(merged.status).toBe('failed');
		expect(merged.model).toBe('sculptor');
		expect(merged.errorCode).toBe('vendor_timeout');
	});
});
