import type { PaperformContext } from './context';
import { listForms } from './endpoints/read';

console.warn('Skipping the live Paperform forms call in unit tests.');

const live = it.skip;

live('lists forms', async () => {
	const result = await listForms(
		{ key: process.env.PAPERFORM_API_KEY } as PaperformContext,
		{},
	);
	expect(Array.isArray(result.forms)).toBe(true);
});
