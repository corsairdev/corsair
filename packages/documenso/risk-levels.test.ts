import { documenso } from './index';

// Plugin rule R8: an operation that sends a message is destructive. These send
// signing emails to recipients (the `use` calls when `distributeDocument` is set).
describe('Documenso risk levels', () => {
	const meta = documenso().endpointMeta;
	it.each([
		'envelopes.distribute.post',
		'envelopes.redistribute.post',
		'documents.distribute.post',
		'documents.redistribute.post',
		'envelopes.use.post',
		'templates.use.post',
	] as const)('marks %s destructive', (path) => {
		expect(meta?.[path]?.riskLevel).toBe('destructive');
	});
});
