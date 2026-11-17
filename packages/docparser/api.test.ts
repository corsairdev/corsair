import { ping } from './endpoints/read';

console.warn('Skipping the live Docparser ping in unit tests.');

const live = it.skip;

live('pings Docparser when a key is present', async () => {
	const key = process.env.DOCPARSER_API_KEY;
	if (!key) return;
	const result = await ping({ key } as never, {});
	expect(result.ping.id).toBe('ping');
});
