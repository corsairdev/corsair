import {
	SevdeskEndpointInputSchemas,
	SevdeskEndpointOutputSchemas,
	SevdeskRequestComponents,
} from './endpoints/types';

const inputKeys = Object.keys(SevdeskEndpointInputSchemas).sort();
const outputKeys = Object.keys(SevdeskEndpointOutputSchemas).sort();

describe('Sevdesk OpenAPI schemas', () => {
	it('registers strict request and response schemas for every JSON operation', () => {
		expect(inputKeys).toHaveLength(152);
		expect(outputKeys).toEqual(inputKeys);
	});
	it('rejects undocumented request fields for all operations', () => {
		for (const schema of Object.values(SevdeskEndpointInputSchemas))
			expect(schema.safeParse({ unexpectedField: true }).success).toBe(false);
	});
	it('rejects non-JSON values from all response schemas', () => {
		for (const schema of Object.values(SevdeskEndpointOutputSchemas))
			expect(schema.safeParse(Number.NaN).success).toBe(false);
	});
	it('enforces pagination bounds and tax-rule enums', () => {
		expect(
			SevdeskEndpointInputSchemas['contact.getContacts'].safeParse({
				query: { limit: 0 },
			}).success,
		).toBe(false);
		expect(
			SevdeskEndpointInputSchemas['contact.getContacts'].safeParse({
				query: { limit: 1001 },
			}).success,
		).toBe(false);
		expect(
			SevdeskEndpointInputSchemas['contact.getContacts'].safeParse({
				resourceVersion: 'latest',
			}).success,
		).toBe(false);
		expect(
			SevdeskEndpointInputSchemas['contact.getContacts'].safeParse({
				resourceVersion: '1.0',
			}).success,
		).toBe(true);
		const validInvoice = {
			contact: { id: 1, objectName: 'Contact' },
			contactPerson: { id: 1, objectName: 'SevUser' },
			invoiceDate: '2026-01-01',
			discount: 0,
			addressCountry: { id: 1, objectName: 'StaticCountry' },
			status: '100',
			taxRate: 19,
			taxRule: { id: '1', objectName: 'TaxRule' },
			taxText: 'VAT',
			taxType: 'default',
			invoiceType: 'RE',
			currency: 'EUR',
			mapAll: true,
		};
		expect(
			SevdeskRequestComponents.Model_Invoice.safeParse(validInvoice).success,
		).toBe(true);
		expect(
			SevdeskRequestComponents.Model_Invoice.safeParse({
				...validInvoice,
				taxRule: { id: '999', objectName: 'TaxRule' },
			}).success,
		).toBe(false);
	});
});
