import type { PdfLessContext } from './context';
import { listTemplates } from './endpoints/templates';

const apiKey = process.env.PDFLESS_API_KEY;
if (!apiKey) {
	console.warn('PDFLESS_API_KEY is not set. Skipping live PDFLess calls.');
}

const live = apiKey ? it : it.skip;

live('lists document templates', async () => {
	const result = await listTemplates({ key: apiKey } as PdfLessContext, {
		page: 1,
		pageSize: 1,
	});
	expect(Array.isArray(result.templates)).toBe(true);
});
