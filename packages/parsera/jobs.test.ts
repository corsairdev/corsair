import { parsera } from './index';

/**
 * Pins which operations declare long jobs and that every status value the
 * docs list sorts into done or failed.
 */
describe('parsera jobs', () => {
	const meta = parsera({}).endpointMeta!;

	it('declares a job on agent.extract', () => {
		const entry = meta['agent.extract']!;
		expect(entry.job).toEqual({
			idPath: 'task_id',
			status: {
				op: 'agent.getTask',
				idArg: 'taskId',
				statusPath: 'status',
				done: ['completed'],
				failed: ['failed', 'stopped'],
			},
			cancel: { op: 'agent.stopTask', idArg: 'taskId' },
		});
	});

	it('declares a job on agent.generateScraper', () => {
		const entry = meta['agent.generateScraper']!;
		expect(entry.job).toEqual({
			idPath: 'template_id',
			status: {
				op: 'agent.getScraper',
				idArg: 'scraperId',
				statusPath: 'status',
				done: ['ready'],
				failed: ['failed'],
			},
		});
	});

	it('declares a job on scrapers.runAsync', () => {
		const entry = meta['scrapers.runAsync']!;
		expect(entry.job).toEqual({
			idPath: 'run_id',
			status: {
				op: 'scrapers.getRun',
				idArg: 'runId',
				statusPath: 'status',
				done: ['completed', 'completed_partial'],
				failed: ['failed'],
			},
		});
	});

	it('declares no other jobs', () => {
		const withJobs = Object.entries(meta)
			.filter(([, entry]) => entry.job !== undefined)
			.map(([key]) => key);
		expect(withJobs.sort()).toEqual(
			['agent.extract', 'agent.generateScraper', 'scrapers.runAsync'].sort(),
		);
	});

	it('sorts every documented status into done or failed', () => {
		// The docs' status vocabularies: agent tasks (pending, running,
		// completed, failed, stopped), scraper builds (generating, ready,
		// failed), runs (running, completed, completed_partial, failed).
		// Values not listed as done/failed (pending, running, generating) are
		// the in-progress states the job polls through.
		expect(meta['agent.extract']?.job?.status).toMatchObject({
			done: ['completed'],
			failed: ['failed', 'stopped'],
		});
		expect(meta['agent.generateScraper']?.job?.status).toMatchObject({
			done: ['ready'],
			failed: ['failed'],
		});
		expect(meta['scrapers.runAsync']?.job?.status).toMatchObject({
			done: ['completed', 'completed_partial'],
			failed: ['failed'],
		});
	});
});
