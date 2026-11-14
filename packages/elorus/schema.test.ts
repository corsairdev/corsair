import type { ElorusOperationInputs } from './endpoints/operation';
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
		const typedPagination: ElorusOperationInputs['v12.invoices_list'] = {
			query: { page: 2, page_size: 250, tc_12345: 'priority' },
		};
		expect(schema.safeParse(typedPagination).success).toBe(true);
		expect(
			schema.safeParse({ query: { page: 2, page_size: 250 } }).success,
		).toBe(true);
		expect(schema.safeParse({ query: { page: 'two' } }).success).toBe(false);
		expect(schema.safeParse({ query: { undocumented: 'value' } }).success).toBe(
			false,
		);
	});

	it('accepts documented tc_<category ID> filters on all 22 applicable lists only', () => {
		const trackingFilterLists = [
			'v11.bills_list',
			'v11.cashpayments_list',
			'v11.cashreceipts_list',
			'v11.contacts_list',
			'v11.creditnotes_list',
			'v11.expenses_list',
			'v11.invoices_list',
			'v11.products_list',
			'v11.projects_list',
			'v11.recurringinvoices_list',
			'v11.suppliercredits_list',
			'v12.bills_list',
			'v12.cashpayments_list',
			'v12.cashreceipts_list',
			'v12.contacts_list',
			'v12.creditnotes_list',
			'v12.expenses_list',
			'v12.invoices_list',
			'v12.products_list',
			'v12.projects_list',
			'v12.recurringinvoices_list',
			'v12.suppliercredits_list',
		] as const;

		expect(trackingFilterLists).toHaveLength(22);
		for (const key of trackingFilterLists) {
			const schema = elorusOperationSchemas[key].input;
			expect(
				schema.safeParse({ query: { tc_12345: 'priority' } }).success,
			).toBe(true);
			expect(
				schema.safeParse({ query: { 'tc_<trackingcategory_id>': 'priority' } })
					.success,
			).toBe(false);
			expect(schema.safeParse({ query: { tc_12345: 12345 } }).success).toBe(
				false,
			);
			expect(schema.safeParse({ query: { unrelated: 'value' } }).success).toBe(
				false,
			);
			expect(schema.safeParse({ query: { tc_invalid: 'value' } }).success).toBe(
				false,
			);
		}
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
