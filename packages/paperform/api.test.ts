import type { PaperformContext } from './context';
import { listForms } from './endpoints/read';

const key = process.env.PAPERFORM_API_KEY;
const live = key ? it : it.skip;
if (!key) {
	console.warn('Skipping live Paperform tests: PAPERFORM_API_KEY is not set.');
}

live('lists forms', async () => {
	const result = await listForms({ key } as PaperformContext, { limit: 5 });
	expect(Array.isArray(result.forms)).toBe(true);
	expect(typeof result.page.total).toBe('number');
});
