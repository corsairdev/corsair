import { makeDocuSealRequest } from './client';
import { DocuSealEndpointOutputSchemas } from './endpoints/types';

// Read-only smoke: two list calls, one page each. DocuSeal gives every
// account a free sandbox with its own keys, so these stay runnable without a
// paid plan. No write runs, because every create sends real signature emails
// or mutates live templates.
const apiKey = process.env.DOCUSEAL_API_KEY;
if (!apiKey)
	console.warn(
		'Skipping DocuSeal live test: DOCUSEAL_API_KEY is not set, so no live request runs.',
	);

(apiKey ? it : it.skip)(
	'lists one page of templates through the output schema',
	async () => {
		if (!apiKey)
			throw new Error('DOCUSEAL_API_KEY is required for the live smoke test');
		const raw = await makeDocuSealRequest(apiKey, {
			method: 'GET',
			path: '/templates',
			query: { limit: 1 },
		});
		const parsed = DocuSealEndpointOutputSchemas.templatesList.parse(raw);
		expect(parsed.pagination.count).toBeGreaterThanOrEqual(0);
		expect(parsed.data.length).toBeLessThanOrEqual(1);
	},
);

(apiKey ? it : it.skip)(
	'lists one page of submitters through the output schema',
	async () => {
		if (!apiKey)
			throw new Error('DOCUSEAL_API_KEY is required for the live smoke test');
		const raw = await makeDocuSealRequest(apiKey, {
			method: 'GET',
			path: '/submitters',
			query: { limit: 1 },
		});
		const parsed = DocuSealEndpointOutputSchemas.submittersList.parse(raw);
		expect(parsed.pagination.count).toBeGreaterThanOrEqual(0);
		expect(parsed.data.length).toBeLessThanOrEqual(1);
	},
);
