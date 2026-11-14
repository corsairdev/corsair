import { makeDocumensoRequest } from './client';
import { DocumensoEndpointOutputSchemas } from './endpoints/types';

const apiKey = process.env.DOCUMENSO_API_KEY;
if (!apiKey)
	console.warn(
		'Skipping Documenso live test: DOCUMENSO_API_KEY is not set, so no live request runs.',
	);

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
