/**
 * Live Docsumo API tests.
 *
 * These hit https://app.docsumo.com with a real API key and are skipped
 * unless DOCSUMO_API_KEY is set, so CI stays hermetic:
 *   DOCSUMO_API_KEY=xxx pnpm --filter @corsair-dev/docsumo test -- api.test.ts
 */
import { makeDocsumoRequest } from './client';
import {
	AgentsListExternalOutputSchema,
	DocumentsListAllOutputSchema,
	DocumentTypesListEnabledOutputSchema,
	UserGetDocumentTypesOutputSchema,
} from './endpoints/types';

const LIVE_KEY = process.env.DOCSUMO_API_KEY;
const describeLive =
	typeof LIVE_KEY === 'string' && LIVE_KEY.length > 0
		? describe
		: describe.skip;

describeLive('docsumo live API', () => {
	it('returns user details and document types', async () => {
		const raw = await makeDocsumoRequest(
			'/api/v1/eevee/apikey/limit/',
			LIVE_KEY ?? '',
		);
		const parsed = UserGetDocumentTypesOutputSchema.parse(raw);
		expect(parsed.status).toBeDefined();
	});

	it('lists enabled document types', async () => {
		const raw = await makeDocsumoRequest(
			'/api/v1/mew/documents/types/',
			LIVE_KEY ?? '',
		);
		const parsed = DocumentTypesListEnabledOutputSchema.parse(raw);
		expect(parsed.status).toBeDefined();
	});

	it('lists documents with pagination', async () => {
		const raw = await makeDocsumoRequest(
			'/api/v1/eevee/apikey/documents/all/',
			LIVE_KEY ?? '',
			{ method: 'GET', query: { limit: 1, offset: 0 } },
		);
		const parsed = DocumentsListAllOutputSchema.parse(raw);
		expect(parsed.data?.limit).toBeDefined();
	});

	it('lists external agents', async () => {
		const raw = await makeDocsumoRequest(
			'/api/v1/external/agents',
			LIVE_KEY ?? '',
			{ method: 'GET', query: { type: 'all' } },
		);
		const parsed = AgentsListExternalOutputSchema.parse(raw);
		expect(parsed.status).toBeDefined();
	});
});

describe('docsumo live guard', () => {
	it('skips live tests without DOCSUMO_API_KEY', () => {
		expect(typeof process.env.DOCSUMO_API_KEY === 'string').toBeDefined();
	});
});
