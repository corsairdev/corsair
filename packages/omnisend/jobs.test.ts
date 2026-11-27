import { omnisend } from './index';

// unknown: the meta map is widened from a readonly const, and only the job
// entries are read.
type MetaView = Record<string, { job?: unknown }>;
type JobView = {
	idPath: string;
	status: {
		op: string;
		idArg: string;
		statusPath: string;
		done: readonly string[];
		failed: readonly string[];
	};
	cancel?: { op: string; idArg: string };
};

const BATCH_STATUSES = [
	'pending',
	'inProgress',
	'finished',
	'stopped',
] as const;

describe('batches.create job', () => {
	const plugin = omnisend();
	const meta = plugin.endpointMeta as unknown as MetaView; // unknown: see MetaView.

	const job = () => {
		const entry = meta['batches.create'];
		if (!entry?.job) throw new Error('batches.create declares no job');
		return entry.job as JobView;
	};

	it('declares the create-poll pair', () => {
		const declared = job();
		expect(declared.idPath).toBe('batchID');
		expect(declared.status.op).toBe('batches.get');
		expect(declared.status.idArg).toBe('id');
		expect(declared.status.statusPath).toBe('status');
	});

	it('sorts every documented batch status into done, failed or running', () => {
		const declared = job();
		// Terminal statuses are exactly finished and stopped.
		const terminal = [...declared.status.done, ...declared.status.failed];
		expect([...terminal].sort()).toEqual(['finished', 'stopped']);
		expect(declared.status.done).toEqual(['finished']);
		// stopped means the batch ended without finishing its items.
		expect(declared.status.failed).toEqual(['stopped']);
		// pending and inProgress sort as running: in neither list.
		for (const status of ['pending', 'inProgress'] as const) {
			expect(declared.status.done).not.toContain(status);
			expect(declared.status.failed).not.toContain(status);
		}
		// Every documented status is either terminal or running.
		expect([...BATCH_STATUSES].sort()).toEqual(
			['finished', 'inProgress', 'pending', 'stopped'].sort(),
		);
	});

	it('declares no cancel, because Omnisend documents none', () => {
		expect(job().cancel).toBeUndefined();
	});

	it('declares no other jobs', () => {
		const withJobs = Object.entries(meta)
			.filter((entry) => entry[1].job !== undefined)
			.map(([name]) => name);
		expect(withJobs).toEqual(['batches.create']);
	});
});
