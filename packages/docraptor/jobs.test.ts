import { docraptor } from './index';

// The async flow: createAsync answers status_id, documents.status reads it
// back with a `status` field of queued / working / completed / failed.
describe('async document job', () => {
	const job = docraptor().endpointMeta?.['documents.createAsync']?.job;

	it('points at the status endpoint through statusId and the status field', () => {
		expect(job?.idPath).toBe('status_id');
		expect(job?.status.op).toBe('documents.status');
		expect(job?.status.idArg).toBe('statusId');
		expect(job?.status.statusPath).toBe('status');
		expect(job?.cancel).toBeUndefined();
	});

	it('sorts every documented status value into done, failed or running', () => {
		// DocRaptor documents exactly four values; a cancelled job does not
		// exist. queued and working are the running values and sit in neither
		// terminal list, so core keeps waiting.
		for (const value of ['queued', 'working']) {
			expect(job?.status.done.includes(value)).toBe(false);
			expect(job?.status.failed.includes(value)).toBe(false);
		}
		expect(job?.status.done).toEqual(['completed']);
		expect(job?.status.failed).toEqual(['failed']);
	});

	it('keeps the same job on the hosted async create', () => {
		expect(
			docraptor().endpointMeta?.['documents.createHostedAsync']?.job,
		).toEqual(job);
	});
});
