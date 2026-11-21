import { zohoBooksOperations } from './openapi';
import { ZohoBooksSchema } from './schema';
import {
	ZohoBooksEndpointInputSchemas,
	ZohoBooksEndpointOutputSchemas,
} from './schema/openapi-validation';

describe('Zoho Books OpenAPI schemas', () => {
	it('registers input and output schemas for all documented operations', () => {
		const operationIds = zohoBooksOperations
			.map((operation) => operation.id)
			.sort();
		expect(Object.keys(ZohoBooksEndpointInputSchemas).sort()).toEqual(
			operationIds,
		);
		expect(Object.keys(ZohoBooksEndpointOutputSchemas).sort()).toEqual(
			operationIds,
		);
		expect(operationIds).toHaveLength(884);
	});

	it('rejects undocumented top-level inputs and missing response values for every route', () => {
		for (const operation of zohoBooksOperations) {
			expect(
				ZohoBooksEndpointInputSchemas[operation.id]?.safeParse({
					undocumented: true,
				}).success,
			).toBe(false);
			expect(
				ZohoBooksEndpointOutputSchemas[operation.id]?.safeParse(undefined)
					.success,
			).toBe(false);
		}
	});

	it('requires organization_id on organization-scoped contact queries', () => {
		const listContacts = ZohoBooksEndpointInputSchemas.list_contacts;
		expect(listContacts?.safeParse({ query: {} }).success).toBe(false);
		expect(
			listContacts?.safeParse({ query: { organization_id: '999999999999999' } })
				.success,
		).toBe(true);
	});

	it('supports the documented organization discovery call without an organization ID', () => {
		expect(
			ZohoBooksEndpointInputSchemas.list_organizations?.safeParse({}).success,
		).toBe(true);
	});

	it('validates multipart binary upload adapters before creating a request', () => {
		const upload =
			ZohoBooksEndpointInputSchemas.add_attachment_to_delivery_challan;
		const base = {
			pathParams: { deliverychallan_id: '999999999999999' },
			query: { organization_id: '999999999999999' },
		};
		expect(
			upload?.safeParse({
				...base,
				body: {
					attachment: {
						filename: 'receipt.pdf',
						contentType: 'application/pdf',
						base64: 'JVBERi0xLjQK',
					},
				},
			}).success,
		).toBe(true);
		expect(
			upload?.safeParse({
				...base,
				body: {
					attachment: {
						filename: 'receipt.pdf',
						contentType: 'application/pdf',
						base64: 'not-base64!',
					},
				},
			}).success,
		).toBe(false);
	});

	it('keeps the plugin database schema empty because records remain in Zoho Books', () => {
		expect(ZohoBooksSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
		expect(ZohoBooksSchema.entities).toEqual({});
	});
});
