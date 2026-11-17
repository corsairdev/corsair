import { importContent } from './endpoints/read';

console.warn('Skipping the live NeuronWriter import in unit tests.');

const live = it.skip;

live('imports content when a key is present', async () => {
	const key = process.env.NEURONWRITER_API_KEY;
	if (!key) return;
	const result = await importContent({ key } as never, {
		query: 'abc123',
		html: '<p>Hello</p>',
	});
	expect(result.imported.id).toBe('abc123');
});
