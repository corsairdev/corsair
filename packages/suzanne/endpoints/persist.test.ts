import type { SuzanneContext } from '../index';
import type { Job } from '../schema/database';
import { pendingJobSaves, rememberJob } from './persist';

const done: Job = {
	jobId: 'job_1',
	status: 'done',
	outputs: [{ format: 'glb', downloadUrl: 'https://example/mesh' }],
	updatedAt: '2026-06-02T00:00:00.000Z',
};

function context(jobs: {
	findByEntityId: (id: string) => Promise<{
		data: Job;
		updated_at: Date;
	} | null>;
	upsertByEntityId: (id: string, data: Job) => Promise<Job>;
}): SuzanneContext {
	// rememberJob only reads the database client. The rest of the plugin context is unused.
	return {
		database: {},
		$getAccountId: async () => 'acct_1',
		db: { jobs },
	} as unknown as SuzanneContext;
}

describe('suzanne job saves', () => {
	it('does not let a stale running read overwrite a finished job', async () => {
		const saved: Job[] = [];
		let reads = 0;
		await rememberJob(
			context({
				findByEntityId: async () => {
					reads += 1;
					if (reads === 1) {
						return {
							data: { jobId: 'job_1', status: 'running' },
							updated_at: new Date(1),
						};
					}
					return { data: done, updated_at: new Date(2) };
				},
				upsertByEntityId: async (_id, data) => {
					saved.push(data);
					return data;
				},
			}),
			{ jobId: 'job_1', status: 'queued', outputs: [] },
		);
		expect(saved).toEqual([done]);
		expect(pendingJobSaves()).toBe(0);
	});

	it('warns when the database write fails and still resolves', async () => {
		const warn = jest
			.spyOn(console, 'warn')
			.mockImplementation(() => undefined);
		await expect(
			rememberJob(
				context({
					findByEntityId: async () => null,
					upsertByEntityId: async () => {
						throw new Error('database down');
					},
				}),
				{ jobId: 'job_1', status: 'queued' },
			),
		).resolves.toBeUndefined();
		expect(warn).toHaveBeenCalledWith(
			'suzanne job save failed',
			'job_1',
			expect.any(Error),
		);
		expect(pendingJobSaves()).toBe(0);
		warn.mockRestore();
	});
});
