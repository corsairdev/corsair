import type { InternalPdf4mePlugin } from './index';
import { pdf4me } from './index';

/**
 * Live smoke: a read (GetPdfInformation) on a tiny generated PDF, few calls —
 * PDF4me charges credits per processing call. PDF4ME_API_KEY comes from the
 * PDF4me dashboard; without it the whole suite skips (a skipped run is not a
 * pass). Every answer goes through its output schema so a wrongly typed
 * field fails here rather than for a caller.
 */
const apiKey = process.env.PDF4ME_API_KEY;
const describeIfKey = apiKey ? describe : describe.skip;

if (!apiKey) {
	console.warn(
		'PDF4ME_API_KEY not set; skipping live smoke tests (create a key at https://www.pdf4me.com/dashboard/)',
	);
}

// A one-page PDF built inline; no fixture file needed.
const MINIMAL_PDF = Buffer.from(
	'%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 612 792]>>endobj\nxref\n0 4\ntrailer<</Size 4/Root 1 0 R>>\nstartxref\n9\n%%EOF',
	'utf8',
).toString('base64');

describeIfKey('pdf4me live smoke', () => {
	const plugin: InternalPdf4mePlugin = pdf4me({ key: apiKey as string });

	// The endpoints read the key off the context; a direct call supplies it
	// rather than going through the runtime.
	const ctx = { key: apiKey as string, options: {} } as never;

	it('reads PDF information through the output schema', async () => {
		const info = await plugin.endpoints!.pdf.getInfo(ctx, {
			docContent: MINIMAL_PDF,
			docName: 'probe.pdf',
		});
		expect(info.pageCount).toBeDefined();
	});
});
