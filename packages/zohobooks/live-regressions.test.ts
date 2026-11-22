import { ApiError } from 'corsair/http';
import { makeZohoBooksRequest } from './client';
import { zohoBooksEndpointMeta } from './endpoints/generated';
import { zohobooks } from './index';
import { zohoBooksOperations } from './openapi';
import type { ZohoBooksOperationDefinition } from './schema/openapi-types';
import {
	ZohoBooksEndpointInputSchemas,
	ZohoBooksEndpointOutputSchemas,
} from './schema/openapi-validation';
import type { ZohoBooksOperationOutputFor } from './schema/operation-types';

// Regressions found running the plugin against a Zoho Books trial organization (India DC, 11-22).

function operation(id: string): ZohoBooksOperationDefinition {
	const found = zohoBooksOperations.find((candidate) => candidate.id === id);
	if (!found) throw new Error(`Missing operation ${id}`);
	return found;
}

const org = { organization_id: '999999999999999' };

describe('Zoho Books live-run regressions', () => {
	it('accepts real list responses that differ from the published response schemas', () => {
		// Trimmed from live responses: page_context is an object, creditnotes an array,
		// chart-of-accounts depth a number and is_child_present a boolean.
		const pageContext = { page: 1, per_page: 200, has_more_page: false };
		// `unknown`: each fixture is a different operation's response body, checked by its own schema.
		const cases: [string, Record<string, unknown>][] = [
			['list_invoices', { invoices: [], page_context: pageContext }],
			['list_estimates', { estimates: [], page_context: pageContext }],
			['list_expenses', { expenses: [], page_context: pageContext }],
			['list_projects', { projects: [], page_context: pageContext }],
			['list_credit_notes', { creditnotes: [], page_context: pageContext }],
			[
				'list_chart_of_accounts',
				{
					chartofaccounts: [
						{
							account_id: '999999999999999',
							account_name: 'Advance Tax',
							depth: 0,
							is_child_present: false,
						},
					],
				},
			],
			['get_current_user', { user: { user_id: '1', custom_fields: [] } }],
		];
		for (const [id, body] of cases) {
			expect(
				ZohoBooksEndpointOutputSchemas[id]?.safeParse({
					code: 0,
					message: 'success',
					...body,
				}).success,
			).toBe(true);
		}
	});

	it('names each parameter in the input schema so agents see what to send', () => {
		const missingOrg = ZohoBooksEndpointInputSchemas.create_invoice?.safeParse({
			query: {},
			body: { customer_id: '1', line_items: [] },
		});
		expect(missingOrg?.success).toBe(false);
		expect(missingOrg?.error?.issues[0]?.path).toEqual([
			'query',
			'organization_id',
		]);
		const missingCustomer =
			ZohoBooksEndpointInputSchemas.create_invoice?.safeParse({
				query: org,
				body: { line_items: [] },
			});
		expect(missingCustomer?.error?.issues[0]?.path).toEqual([
			'body',
			'customer_id',
		]);
	});

	it('builds schemas lazily, one operation at a time', () => {
		expect(
			Object.getOwnPropertyDescriptor(
				ZohoBooksEndpointInputSchemas,
				'list_contacts',
			)?.get,
		).toBeInstanceOf(Function);
		const schemas = zohobooks().endpointSchemas ?? {};
		const entry = schemas['contacts.listContacts'];
		expect(
			entry && Object.getOwnPropertyDescriptor(entry, 'input')?.get,
		).toBeInstanceOf(Function);
		expect(entry?.input).toBe(entry?.input);
	});

	it('declares the ids Zoho requires on routes where its OpenAPI leaves them out', () => {
		const cases: [string, string][] = [
			['list_bank_account_match_filters', 'account_id'],
			['list_all_contact_bank_accounts', 'contact_ids'],
			['get_contact_card_count', 'contact_ids'],
			['list_credit_notes_einvoice', 'creditnote_ids'],
			['list_invoices_einvoice', 'invoice_ids'],
			['bulk_export_sales_orders_as_pdf', 'salesorder_ids'],
			['bulk_print_sales_orders', 'salesorder_ids'],
		];
		for (const [id, name] of cases) {
			const schema = ZohoBooksEndpointInputSchemas[id];
			expect(
				schema?.safeParse({ query: { ...org, [name]: '999999999999999' } })
					.success,
			).toBe(true);
			expect(schema?.safeParse({ query: org }).success).toBe(false);
		}
	});

	it('marks invitations, payment reminders and payment collection destructive', () => {
		for (const key of [
			'invoices.remindCustomerForInvoicePayment',
			'invoices.bulkInvoiceReminder',
			'contacts.inviteContactPersonToPortal',
			'contacts.enableContactPortal',
			'projects.inviteProjectUser',
			'users.inviteUser',
			'users.createUser',
			'retainerInvoices.createRetainerInvoiceAsyncOnlinePayment',
			'customerPayments.createCustomerPayment',
			'vendorPayments.createVendorPayment',
		] as const) {
			expect(zohoBooksEndpointMeta[key].riskLevel).toBe('destructive');
		}
	});

	describe('HTTP', () => {
		let fetchSpy: jest.SpyInstance<Promise<Response>, Parameters<typeof fetch>>;
		beforeEach(() => {
			fetchSpy = jest.spyOn(globalThis, 'fetch');
		});
		afterEach(() => fetchSpy.mockRestore());

		it("keeps Zoho's error code and message, masking email addresses", async () => {
			fetchSpy.mockResolvedValueOnce(
				new Response(
					JSON.stringify({
						code: 4,
						message:
							'Invalid value passed for account_id (owner private.person@sample.invalid)',
					}),
					{ status: 400, headers: { 'content-type': 'application/json' } },
				),
			);
			const failure = await makeZohoBooksRequest(
				{ key: 'test-access-token', options: { region: 'in' } },
				operation('list_bank_account_match_filters'),
				{ query: { ...org, account_id: '1' } },
				// `unknown`: a rejected promise can carry any value; narrowed by instanceof below.
			).catch((error: unknown) => error);
			expect(failure).toBeInstanceOf(ApiError);
			if (!(failure instanceof ApiError)) return;
			expect(failure.status).toBe(400);
			expect(failure.body).toEqual({
				code: 4,
				message: 'Invalid value passed for account_id (owner [email])',
			});
			expect(failure.message).toContain('Invalid value passed for account_id');
			expect(failure.message).not.toContain('private.person');
			expect(failure.request.body).toBeUndefined();
		});

		it('downloads bulk invoice, estimate and sales order PDFs as binary', async () => {
			for (const [id, ids] of [
				['bulk_export_invoices_as_pdf', 'invoice_ids'],
				['bulk_print_invoices', 'invoice_ids'],
				['bulk_export_estimates_as_pdf', 'estimate_ids'],
				['bulk_print_estimates', 'estimate_ids'],
				['bulk_export_sales_orders_as_pdf', 'salesorder_ids'],
				['bulk_print_sales_orders', 'salesorder_ids'],
			] as const) {
				fetchSpy.mockResolvedValueOnce(
					new Response(new Uint8Array([37, 80, 68, 70]), {
						status: 200,
						headers: { 'content-type': 'application/pdf' },
					}),
				);
				const output = await makeZohoBooksRequest(
					{ key: 'test-access-token', options: { region: 'in' } },
					operation(id),
					{ query: { ...org, [ids]: '999999999999999' } },
				);
				expect(output).toEqual({
					kind: 'binary',
					contentType: 'application/pdf',
					base64: 'JVBERg==',
					byteLength: 4,
				});
				// Zoho answers 406 when the request asks for JSON only.
				const init = fetchSpy.mock.calls.at(-1)?.[1];
				expect(new Headers(init?.headers).get('accept')).toBeNull();
			}
		});
	});
});

describe('Zoho Books review-round fixes (live-checked 11-22)', () => {
	it('creates and updates credit notes without the number or the UAE-only reason', () => {
		// Zoho numbers credit notes itself and asks for the reason only in the UAE edition.
		const body = {
			customer_id: '999999999999999',
			date: '2026-11-22',
			line_items: [{ item_id: '999999999999999', quantity: 1 }],
		};
		expect(
			ZohoBooksEndpointInputSchemas.create_credit_note?.safeParse({
				query: org,
				body,
			}).success,
		).toBe(true);
		expect(
			ZohoBooksEndpointInputSchemas.update_credit_note?.safeParse({
				pathParams: { creditnote_id: '999999999999999' },
				query: org,
				body,
			}).success,
		).toBe(true);
	});

	it('requires the debit-note filter on the shared invoices list route', () => {
		const schema = ZohoBooksEndpointInputSchemas.list_customer_debit_notes;
		expect(schema?.safeParse({ query: org }).success).toBe(false);
		expect(
			schema?.safeParse({ query: { ...org, filter_by: 'Type.Invoice' } })
				.success,
		).toBe(false);
		expect(
			schema?.safeParse({ query: { ...org, filter_by: 'Type.DebitNote' } })
				.success,
		).toBe(true);
	});

	it('accepts the PDF and HTML documents that accept=pdf|html returns', () => {
		for (const id of [
			'get_invoice',
			'get_estimate',
			'get_sales_order',
			'get_credit_note',
		]) {
			for (const contentType of [
				'application/pdf',
				'text/html; charset=UTF-8',
			]) {
				expect(
					ZohoBooksEndpointOutputSchemas[id]?.safeParse({
						kind: 'binary',
						contentType,
						base64: 'JVBERg==',
						byteLength: 4,
					}).success,
				).toBe(true);
			}
		}
	});

	it('marks e-invoice pushes, signature requests and bank-account charges destructive', () => {
		for (const key of [
			'creditNotes.pushCreditNotesEinvoice',
			'creditNotes.pushCreditNoteEinvoice',
			'invoices.pushInvoicesEinvoice',
			'invoices.pushInvoiceEinvoice',
			'selfBilledInvoices.pushSelfBilledInvoiceEinvoice',
			'invoices.addInvoiceDigitalSignature',
			'creditNotes.addCreditNoteDigitalSignature',
			'invoices.addInvoiceOnlinePaymentBankAccount',
		] as const) {
			expect(zohoBooksEndpointMeta[key].riskLevel).toBe('destructive');
		}
	});
});

describe('Zoho Books bot-round fixes (live-checked 11-22)', () => {
	it('types page_context as the object Zoho returns and creditnotes as an array', () => {
		// Compile-time checks: these fail to type-check if the types follow the old contract.
		const invoices: ZohoBooksOperationOutputFor<'list_invoices'> = {
			code: 0,
			message: 'success',
			invoices: [],
			page_context: { page: 1, per_page: 200, has_more_page: false },
		};
		const creditNotes: ZohoBooksOperationOutputFor<'list_credit_notes'> = {
			code: 0,
			message: 'success',
			creditnotes: [{ creditnote_id: '1' }],
		};
		expect(
			typeof invoices === 'object' &&
				invoices !== null &&
				'page_context' in invoices &&
				invoices.page_context?.has_more_page,
		).toBe(false);
		expect(creditNotes).toBeDefined();
	});

	it('accepts the debit note list filters the shared invoices route takes', () => {
		expect(
			ZohoBooksEndpointInputSchemas.list_customer_debit_notes?.safeParse({
				query: {
					...org,
					filter_by: 'Type.DebitNote',
					date_start: '2026-01-01',
					date_end: '2026-12-31',
				},
			}).success,
		).toBe(true);
	});

	it('pages through a recurring invoice child list', () => {
		expect(
			ZohoBooksEndpointInputSchemas.list_recurring_invoice_child_invoices?.safeParse(
				{
					pathParams: { recurring_invoice_id: '1' },
					query: { ...org, page: 2, per_page: 50 },
				},
			).success,
		).toBe(true);
	});

	it('takes a file on contact and bank reconciliation attachments', () => {
		const file = {
			filename: 'note.txt',
			contentType: 'text/plain',
			base64: 'bm90ZQ==',
		};
		expect(
			ZohoBooksEndpointInputSchemas.add_contact_attachment?.safeParse({
				pathParams: { contact_id: '1' },
				query: { ...org, attachment: file },
			}).success,
		).toBe(true);
		expect(
			ZohoBooksEndpointInputSchemas.add_bank_reconciliation_attachment?.safeParse(
				{
					pathParams: { account_id: '1', reconciliation_id: '1' },
					query: { ...org, attachment: file },
				},
			).success,
		).toBe(true);
	});

	it('marks recurring invoice autobill destructive', () => {
		expect(
			zohoBooksEndpointMeta['recurringInvoices.enableRecurringInvoiceAutobill']
				.riskLevel,
		).toBe('destructive');
	});
});
