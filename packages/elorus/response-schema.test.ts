import { ElorusEndpoints } from './endpoints';
import { acceptUnknownResponseFields } from './endpoints/operation';
import { elorusOperationSchemas } from './endpoints/types';
import type { ElorusContext } from './index';

jest.mock('corsair/core', () => {
	const actual =
		jest.requireActual<typeof import('corsair/core')>('corsair/core');
	return {
		...actual,
		logEventFromContext: jest.fn().mockResolvedValue(null),
	};
});

const context = {
	endpoints: {},
	db: {},
	$getAccountId: async () => 'fixture-account',
	key: 'fixture-token',
	options: {},
	keys: {
		get_dek: async () => 'fixture-dek',
		issue_new_dek: async () => 'fixture-dek',
		get_api_key: async () => 'fixture-token',
		set_api_key: async (_value: string | null) => undefined,
		get_webhook_signature: async () => 'fixture-signature',
		set_webhook_signature: async (_value: string | null) => undefined,
		get_organization_id: async () => 'fixture-organization',
		set_organization_id: async (_value: string | null) => undefined,
	},
} satisfies ElorusContext;

// unknown: test payloads are arbitrary JSON, including shapes the schemas must reject.
function jsonResponse(body: unknown, status = 200): Response {
	return new Response(JSON.stringify(body), {
		status,
		headers: { 'content-type': 'application/json' },
	});
}

describe('Elorus responses with fields the OpenAPI document does not list', () => {
	it('keeps a list read working when Elorus adds a field at the top level and in nested objects', async () => {
		const fetchSpy = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			jsonResponse({
				count: 1,
				next: null,
				previous: null,
				results: [
					{
						id: '1050000300010040',
						number: 'A-1',
						billing_address: {
							address_line: '1 Test Street',
							city: 'Athens',
							zip: '10431',
							country: 'GR',
							new_address_field: 'added later',
						},
						new_invoice_field: 'added later',
					},
				],
				new_envelope_field: 'added later',
			}),
		);
		try {
			const result = await ElorusEndpoints.v12.invoices_list(context, {});
			expect(result.count).toBe(1);
			expect(result.results[0]?.number).toBe('A-1');
			expect(result.results[0]?.billing_address?.city).toBe('Athens');
			expect(result.results[0]).not.toHaveProperty('new_invoice_field');
		} finally {
			fetchSpy.mockRestore();
		}
	});

	it('still rejects a response that breaks a documented field', async () => {
		const fetchSpy = jest
			.spyOn(globalThis, 'fetch')
			.mockResolvedValue(jsonResponse({ count: 'one', results: [] }));
		try {
			await expect(
				ElorusEndpoints.v12.invoices_list(context, {}),
			).rejects.toMatchObject({ name: 'ZodError' });
		} finally {
			fetchSpy.mockRestore();
		}
	});

	it('leaves input schemas strict', () => {
		const strictOutput = elorusOperationSchemas['v12.invoices_list'].output;
		const relaxed = acceptUnknownResponseFields(strictOutput);
		const payload = { count: 0, results: [], extra: true };
		expect(strictOutput.safeParse(payload).success).toBe(false);
		expect(relaxed.safeParse(payload).success).toBe(true);
		expect(
			elorusOperationSchemas['v12.invoices_create'].input.safeParse({
				body: {},
				extra: true,
			}).success,
		).toBe(false);
	});
});
