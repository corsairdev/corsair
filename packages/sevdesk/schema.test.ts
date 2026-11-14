import {
	SevdeskEndpointInputSchemas,
	SevdeskEndpointOutputSchemas,
	SevdeskRequestComponents,
	SevdeskResponseComponents,
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
	it('enforces pagination bounds, accounting tax rules, and position quantities', () => {
		expect(
			SevdeskEndpointInputSchemas['invoice.createInvoiceByFactory'].safeParse(
				{},
			).success,
		).toBe(false);
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
		const pathPaginationCases = [
			{
				key: 'invoice.getInvoicePositionsById',
				path: { invoiceId: 1 },
			},
			{
				key: 'order.getOrderPositionsById',
				path: { orderId: 1 },
			},
			{ key: 'order.getDiscounts', path: { orderId: 1 } },
		] as const;
		for (const operation of pathPaginationCases) {
			expect(
				SevdeskEndpointInputSchemas[operation.key].safeParse({
					path: operation.path,
					query: { limit: 1001 },
				}).success,
			).toBe(false);
			expect(
				SevdeskEndpointInputSchemas[operation.key].safeParse({
					path: operation.path,
					query: { offset: -1 },
				}).success,
			).toBe(false);
		}
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
		const voucher = {
			objectName: 'Voucher',
			mapAll: true,
			status: 50,
			taxRule: { id: '9', objectName: 'TaxRule' },
			taxType: 'default',
			creditDebit: 'D',
			voucherType: 'VOU',
		};
		expect(
			SevdeskRequestComponents.Model_Voucher.safeParse(voucher).success,
		).toBe(true);
		expect(
			SevdeskRequestComponents.Model_VoucherUpdate.safeParse({
				taxRule: { id: '14', objectName: 'TaxRule' },
			}).success,
		).toBe(true);
		expect(
			SevdeskResponseComponents.Model_VoucherResponse.safeParse({
				taxRule: { id: '9', objectName: 'TaxRule' },
			}).success,
		).toBe(true);
		expect(
			SevdeskResponseComponents.Model_VoucherResponse.safeParse({
				taxRule: { id: '21', objectName: 'TaxRule' },
			}).success,
		).toBe(false);
		expect(
			SevdeskEndpointOutputSchemas['invoicePos.getInvoicePos'].safeParse({
				objects: [{ quantity: '2' }],
			}).success,
		).toBe(true);
		expect(
			SevdeskEndpointOutputSchemas['invoicePos.getInvoicePos'].safeParse({
				objects: [{ quantity: 2 }],
			}).success,
		).toBe(true);
		expect(
			SevdeskEndpointOutputSchemas['invoicePos.getInvoicePos'].safeParse({
				objects: [{ quantity: true }],
			}).success,
		).toBe(false);
		expect(
			SevdeskResponseComponents.Model_InvoicePosResponse.safeParse({
				quantity: '2',
			}).success,
		).toBe(true);
		expect(
			SevdeskResponseComponents.Model_InvoicePosResponse.safeParse({
				quantity: 2,
			}).success,
		).toBe(true);
		expect(
			SevdeskResponseComponents.Model_InvoicePosResponse.safeParse({
				quantity: true,
			}).success,
		).toBe(false);
	});
});
