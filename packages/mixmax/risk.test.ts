import { mixmaxEndpointMeta } from './index';

// Risk levels follow the precedent in the other email plugins (gmail
// `messages.send`, resend `emails.send`): sending is `write`, and
// `destructive` is kept for calls that lose or overwrite data and cannot be
// undone. A send says what it does in its description instead.
describe('Mixmax risk levels', () => {
	it.each([
		'messages.send',
		'messages.sendPlain',
		'messages.schedule',
		'snippets.send',
		'sequences.recipients.add',
		'teams.members.add',
	] as const)('%s is a write whose description says email goes out', (operation) => {
		const meta = mixmaxEndpointMeta[operation];
		expect(meta.riskLevel).toBe('write');
		expect(meta.description).toMatch(/email/i);
	});

	it('rates every delete, removal and one-way cancel as destructive', () => {
		const destructive = Object.entries(mixmaxEndpointMeta)
			.filter(([, meta]) => meta.riskLevel === 'destructive')
			.map(([operation]) => operation);
		const deletes = Object.keys(mixmaxEndpointMeta).filter((operation) =>
			/\.(delete|deleteBulk|remove|deleteOpportunity|deleteTask|cancel|cancelAll)$/.test(
				operation,
			),
		);
		expect(deletes.length).toBeGreaterThan(0);
		expect(destructive.sort()).toEqual(deletes.sort());
	});
});
