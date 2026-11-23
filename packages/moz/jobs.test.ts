import { moz } from './index';

const ASYNC_STATUSES = ['pending', 'processing', 'complete'] as const;

/**
 * Pins the job wiring: which operations declare jobs, that the status
 * operation is itself registered, and that every provider status value sorts
 * into exactly one of done/failed/running.
 */
describe('moz jobs', () => {
	const plugin = moz();

	it('declares a job only on competitors.fetch', () => {
		const jobs = Object.entries(plugin.endpointMeta ?? {}).filter(
			([, meta]) => meta.job !== undefined,
		);
		expect(jobs.map(([op]) => op)).toEqual(['competitors.fetch']);
	});

	it('reads the job status through the registered jobs.lookup operation', () => {
		const job = plugin.endpointMeta?.['competitors.fetch']?.job;
		expect(job?.status.op).toBe('jobs.lookup');
		expect(plugin.endpoints?.jobs).toBeDefined();
	});

	it('sorts every documented async status into done or running', () => {
		const job = plugin.endpointMeta?.['competitors.fetch']?.job;
		const done = job?.status.done ?? [];
		const failed = job?.status.failed ?? [];
		for (const status of ASYNC_STATUSES) {
			const terminal = done.includes(status) || failed.includes(status);
			// Moz reports failures inside a completed call (async_call.error),
			// so complete is the only terminal status.
			if (status === 'complete') {
				expect(done).toContain(status);
			} else {
				expect(terminal).toBe(false);
			}
		}
		expect(failed).toEqual([]);
	});

	it('takes the receipt id from async_call.id and passes it as id', () => {
		const job = plugin.endpointMeta?.['competitors.fetch']?.job;
		expect(job?.idPath).toBe('async_call.id');
		expect(job?.status.idArg).toBe('id');
	});
});
