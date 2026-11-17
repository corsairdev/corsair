import type { DocparserContext } from './context';
import { ping } from './endpoints/read';

const key = process.env.DOCPARSER_API_KEY;
const live = key ? it : it.skip;
if (!key) {
	console.warn('Skipping live Docparser tests: DOCPARSER_API_KEY is not set.');
}

live('pings Docparser', async () => {
	const result = await ping({ key } as DocparserContext, {});
	expect(result.ping.msg).toBe('pong');
});
