import 'dotenv/config';
import { makeAirtableRequest } from './client';
import type {
	BasesGetManyResponse,
	BasesGetSchemaResponse,
	RecordsSearchResponse,
} from './endpoints/types';
import { AirtableEndpointOutputSchemas } from './endpoints/types';

const TEST_API_KEY = process.env.AIRTABLE_API_KEY!;
let testBaseId: string;
let testTableIdOrName: string;

describe('Airtable API Type Tests', () => {
	beforeAll(async () => {
		const basesResponse = await makeAirtableRequest<BasesGetManyResponse>(
			'meta/bases',
			TEST_API_KEY,
			{ method: 'GET' },
		);

		AirtableEndpointOutputSchemas.basesGetMany.parse(basesResponse);

		const base = basesResponse.bases[0];
		if (!base) {
			throw new Error('No bases available for testing');
		}

		testBaseId = base.id;

		const schemaResponse = await makeAirtableRequest<BasesGetSchemaResponse>(
			`meta/bases/${testBaseId}/tables`,
			TEST_API_KEY,
			{ method: 'GET' },
		);

		AirtableEndpointOutputSchemas.basesGetSchema.parse(schemaResponse);

		const table = schemaResponse.tables[0];
		if (!table) {
			throw new Error('No tables available for testing');
		}

		testTableIdOrName = table.id;
	});

	describe('bases', () => {
		it('basesGetMany returns correct type', async () => {
			const response = await makeAirtableRequest<BasesGetManyResponse>(
				'meta/bases',
				TEST_API_KEY,
				{ method: 'GET' },
			);

			AirtableEndpointOutputSchemas.basesGetMany.parse(response);
		});

		it('basesGetSchema returns correct type', async () => {
			const response = await makeAirtableRequest<BasesGetSchemaResponse>(
				`meta/bases/${testBaseId}/tables`,
				TEST_API_KEY,
				{ method: 'GET' },
			);

			AirtableEndpointOutputSchemas.basesGetSchema.parse(response);
		});
	});

	describe('records', () => {
		it('recordsSearch returns correct type', async () => {
			const response = await makeAirtableRequest<RecordsSearchResponse>(
				`${testBaseId}/${testTableIdOrName}`,
				TEST_API_KEY,
				{ method: 'GET', query: { maxRecords: 1 } },
			);

			AirtableEndpointOutputSchemas.recordsSearch.parse(response);
		});
	});
});
