import { givebutter } from './index';

const meta = givebutter().endpointMeta;

describe('Givebutter risk levels (PLUGIN_PR_RULES R8)', () => {
	it('marks operations that cannot be undone through the API as destructive', () => {
		// Transactions have no delete endpoint; sync replaces every tag on the contact.
		expect(meta['transactions.create'].riskLevel).toBe('destructive');
		expect(meta['contactTags.sync'].riskLevel).toBe('destructive');
		for (const op of [
			'campaigns.delete',
			'contacts.delete',
			'funds.delete',
			'webhooks.delete',
		] as const) {
			expect(meta[op].riskLevel).toBe('destructive');
		}
	});

	it('keeps reversible writes and reads at their level', () => {
		expect(meta['contactTags.add'].riskLevel).toBe('write');
		expect(meta['contacts.create'].riskLevel).toBe('write');
		expect(meta['transactions.list'].riskLevel).toBe('read');
	});
});
