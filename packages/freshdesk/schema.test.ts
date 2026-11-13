import { FRESHDESK_OPERATIONS } from './endpoints/operations';
import {
	createFreshdeskRouteInputSchema,
	FreshdeskRouteInputSchema,
	FreshdeskRouteOutputSchema,
} from './endpoints/types';
import {
	freshdesk,
	freshdeskEndpointMeta,
	freshdeskEndpointSchemas,
} from './index';

describe('Freshdesk endpoint schemas', () => {
	it('registers input/output schemas and metadata for every documented v2 operation', () => {
		const operationNames = Object.keys(FRESHDESK_OPERATIONS);
		const schemaNames = Object.keys(freshdeskEndpointSchemas).map((key) =>
			key.replace(/^routes\./, '').replace(/\.run$/, ''),
		);
		const metadataNames = Object.keys(freshdeskEndpointMeta).map((key) =>
			key.replace(/^routes\./, '').replace(/\.run$/, ''),
		);
		expect(operationNames).toHaveLength(256);
		expect(schemaNames.sort()).toEqual(operationNames.sort());
		expect(metadataNames.sort()).toEqual(operationNames.sort());
		for (const operation of Object.values(FRESHDESK_OPERATIONS)) {
			const pathParams = Object.fromEntries(
				operation.pathParams.map((name) => [name, 'fixture-id']),
			);
			const query = {
				...operation.queryDefaults,
				...Object.fromEntries(
					operation.requiredQuery.map((name) => [name, 'fixture-value']),
				),
			};
			const inputSchema = createFreshdeskRouteInputSchema(operation);
			expect(inputSchema.safeParse({ pathParams, query }).success).toBe(true);
		}
		for (const schema of Object.values(freshdeskEndpointSchemas)) {
			expect(schema.input).toBeDefined();
			expect(schema.output).toBeDefined();
			if (schema.output) expect(schema.output.safeParse([]).success).toBe(true);
		}
	});

	it('keeps route inputs strict and enforces documented page bounds', () => {
		expect(
			FreshdeskRouteInputSchema.safeParse({ unexpected: true }).success,
		).toBe(false);
		expect(
			FreshdeskRouteInputSchema.safeParse({ query: { per_page: 101 } }).success,
		).toBe(false);
		expect(
			FreshdeskRouteInputSchema.safeParse({ query: { per_page: '101' } })
				.success,
		).toBe(false);
		expect(
			FreshdeskRouteInputSchema.safeParse({ query: { page: 0 } }).success,
		).toBe(false);
		expect(
			FreshdeskRouteInputSchema.safeParse({ query: { page: 1, per_page: 100 } })
				.success,
		).toBe(true);
		expect(
			createFreshdeskRouteInputSchema(
				FRESHDESK_OPERATIONS.viewATicketGet,
			).safeParse({}).success,
		).toBe(false);
		expect(
			createFreshdeskRouteInputSchema(
				FRESHDESK_OPERATIONS.filterTicketsGetTickets,
			).safeParse({}).success,
		).toBe(false);
		const ticketInputSchema = createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.createTicketPostTickets,
		);
		expect(
			ticketInputSchema.safeParse({
				body: { email: 'person@freshdesk.invalid' },
			}).success,
		).toBe(true);
		expect(
			ticketInputSchema.safeParse({
				body: { unsupported_field: 'no' },
			}).success,
		).toBe(false);
		expect(ticketInputSchema.safeParse({ body: { email: 123 } }).success).toBe(
			false,
		);
	});

	it('validates JSON response values and accepts documented empty responses', () => {
		expect(
			FreshdeskRouteOutputSchema.safeParse({ id: 1, status: 2 }).success,
		).toBe(true);
		expect(FreshdeskRouteOutputSchema.safeParse(undefined).success).toBe(true);
		expect(FreshdeskRouteOutputSchema.safeParse(() => 'not JSON').success).toBe(
			false,
		);
	});

	it('declares API-key auth, account domain setup, and no webhook surface', () => {
		const plugin = freshdesk({ domain: 'acme.freshdesk.com' });
		expect(plugin.authConfig).toEqual({ api_key: {} });
		expect(plugin.webhooks).toEqual({});
		expect(plugin.options?.domain).toBe('acme.freshdesk.com');
	});
});
