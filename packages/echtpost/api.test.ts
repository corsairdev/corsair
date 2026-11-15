import type { EchtpostContext } from './context';
import { listTemplates } from './endpoints/list';

const apiKey = process.env.ECHTPOST_API_KEY;
if (!apiKey) {
	console.warn('ECHTPOST_API_KEY is not set. Skipping live Echtpost calls.');
}

const live = apiKey ? it : it.skip;

live('lists templates', async () => {
	const result = await listTemplates({ key: apiKey } as EchtpostContext, {});
	expect(Array.isArray(result.templates)).toBe(true);
});
