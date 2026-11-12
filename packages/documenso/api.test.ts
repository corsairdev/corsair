import { makeDocumensoRequest } from './client';
import { DocumensoEndpointOutputSchemas } from './endpoints/types';

const apiKey = process.env.DOCUMENSO_API_KEY;

(apiKey ? it : it.skip)(
	'reads one envelope page from the configured Documenso v2 API',
	async () => {
		if (!apiKey)
			throw new Error('DOCUMENSO_API_KEY is required for the live smoke test');
		const response = await makeDocumensoRequest(
			'envelopeFind',
			{ key: apiKey },
			{ perPage: 1 },
		);
		const parsed = DocumensoEndpointOutputSchemas.envelopeFind.parse(response);
		expect(parsed.currentPage).toBeGreaterThanOrEqual(1);
		expect(parsed.data.length).toBeLessThanOrEqual(1);
	},
);
