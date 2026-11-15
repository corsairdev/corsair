import { makePdfApiRequest } from './client';
import { PdfApiEndpointOutputSchemas } from './endpoints/types';

const apiKey = process.env.PDFAPI_API_KEY;

// The skip is never silent: when credentials are absent, the suite title in
// the jest listing states the reason, so live coverage cannot be omitted
// invisibly — without console noise on every unauthenticated run.
const describeLive = apiKey ? describe : describe.skip;

// One read-only smoke test: it proves authentication, transport, and schema
// parsing still work against the live API. Destructive and mutation
// operations are deliberately not exercised live; they are covered by the
// mocked route and schema suites instead.
describeLive(
	apiKey
		? 'PdfApi live API'
		: 'PdfApi live API — skipped: PDFAPI_API_KEY is missing',
	() => {
		it('authenticates and lists templates', async () => {
			const response = await makePdfApiRequest<unknown>(
				// unknown: the live smoke test only proves authentication, transport,
				// and envelope parsing; the response body itself is provider-defined
				// and only its documented shape is asserted.
				{ key: apiKey! },
				'/templates',
				{ method: 'GET' },
			);

			const templates =
				PdfApiEndpointOutputSchemas.listTemplates.parse(response);
			expect(Array.isArray(templates)).toBe(true);
		});
	},
);
