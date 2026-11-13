import { elorusOperationSchemas } from './endpoints/types';

describe('Elorus OpenAPI schemas', () => {
	it('provides an input and output Zod schema for every operation', () => {
		expect(Object.keys(elorusOperationSchemas)).toHaveLength(457);
		for (const schema of Object.values(elorusOperationSchemas)) {
			expect(typeof schema.input.safeParse).toBe('function');
			expect(typeof schema.output.safeParse).toBe('function');
		}
	});

	it('validates pagination types and rejects unknown query parameters', () => {
		const schema = elorusOperationSchemas['v12.invoices_list'].input;
		expect(
			schema.safeParse({ query: { page: 2, page_size: 250 } }).success,
		).toBe(true);
		expect(schema.safeParse({ query: { page: 'two' } }).success).toBe(false);
		expect(schema.safeParse({ query: { undocumented: 'value' } }).success).toBe(
			false,
		);
	});

	it('rejects undocumented fields in a create request body', () => {
		const schema = elorusOperationSchemas['v12.contacts_create'].input;
		expect(
			schema.safeParse({ body: { undocumented_contact_field: 'value' } })
				.success,
		).toBe(false);
	});

	it('validates PDF and attachment results as bounded binary envelopes', () => {
		const schema = elorusOperationSchemas['v12.invoices_pdf'].output;
		expect(
			schema.safeParse({
				kind: 'binary',
				contentType: 'application/pdf',
				base64: 'JVBERi0=',
				sizeBytes: 5,
			}).success,
		).toBe(true);
		expect(schema.safeParse('not-a-binary-envelope').success).toBe(false);
	});

	it('validates empty responses only for documented 204 operations', () => {
		expect(
			elorusOperationSchemas['v12.invoices_delete'].output.safeParse(undefined)
				.success,
		).toBe(true);
		expect(
			elorusOperationSchemas['v12.invoices_delete'].output.safeParse({})
				.success,
		).toBe(false);
	});
});
