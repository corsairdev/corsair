import { makeElorusRequest } from './client';
import { elorusOperationSchemas } from './endpoints/types';

const apiKey = process.env.ELORUS_API_KEY;
const organizationId = process.env.ELORUS_ORGANIZATION_ID;
if (!apiKey || !organizationId) {
	console.warn(
		'Skipping Elorus live test: ELORUS_API_KEY and ELORUS_ORGANIZATION_ID are required.',
	);
}
const liveTest = apiKey && organizationId ? it : it.skip;

liveTest(
	'performs a read-only Elorus v1.2 invoice-list smoke test',
	async () => {
		const response = await makeElorusRequest('/v1.2/invoices/', apiKey ?? '', {
			method: 'GET',
			organizationId: organizationId ?? '',
			mode: 'json',
			query: { page: 1, page_size: 1 },
		});
		expect(
			elorusOperationSchemas['v12.invoices_list'].output.safeParse(response)
				.success,
		).toBe(true);
	},
);
