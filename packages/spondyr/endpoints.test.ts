import { ApiError } from 'corsair/http';
import { z } from 'zod';
import { assertApiStatus, resolveCredentials } from './endpoints/call';
import {
	SpondyrEndpointInputSchemas as SpondyrEndpointInputSchemaFor,
	SpondyrEndpointOutputSchemas,
} from './endpoints/types';
import {
	batchStatus,
	batchStatusPartial,
	conditionList,
	deleted,
	eventTypeList,
	invalidReference,
	recipientList,
	searchFilterList,
	searchResults,
	statusNoMatch,
	statusSubmitted,
	template,
	templateList,
	transactionTypeList,
} from './test-fixtures';

describe('output schemas keep the provider field names', () => {
	it('parses a Transaction Type list', () => {
		const parsed =
			SpondyrEndpointOutputSchemas.listTransactionTypes.parse(
				transactionTypeList,
			);
		expect(parsed.Data[0]?.Name).toBe('Customer Orders');
		expect(parsed.Data[0]?.TemplateCSV).toBe('OrderNumber,Customer.FirstName');
	});

	it('parses recipients whose unset addresses are empty strings or null', () => {
		const parsed =
			SpondyrEndpointOutputSchemas.listRecipients.parse(recipientList);
		expect(parsed.Data[0]?.Address1).toBe('');
		expect(parsed.Data[0]?.City).toBeNull();
		expect(parsed.Data[0]?.Email).toBe('{Customer.Email}');
	});

	it('parses Event Types with their Transaction Type', () => {
		const parsed =
			SpondyrEndpointOutputSchemas.listEventTypes.parse(eventTypeList);
		expect(parsed.Data[0]?.TransactionType).toBe('Customer Orders');
	});

	it('parses Conditions whose values are newline separated', () => {
		const parsed =
			SpondyrEndpointOutputSchemas.listConditions.parse(conditionList);
		expect(parsed.Data[0]?.PossibleValues).toBe('Express\r\nOvernight');
	});

	it('parses Search Filters with their tag template', () => {
		const parsed =
			SpondyrEndpointOutputSchemas.listSearchFilters.parse(searchFilterList);
		expect(parsed.Data[0]?.Tag).toBe('{OrderNumber}');
	});

	it('parses a template with its recipients, conditions and searches', () => {
		const parsed =
			SpondyrEndpointOutputSchemas.listTemplates.parse(templateList);
		expect(parsed.Data[0]?.Recipients?.[0]?.DeliveryMethod).toBe('Email');
		expect(parsed.Data[0]?.Conditions?.[0]?.CompareOperator).toBe('=');
		expect(parsed.Data[0]?.Searches).toEqual(['OrderNumber']);
	});

	it('parses a single template whose TemplateContent is null', () => {
		const parsed = SpondyrEndpointOutputSchemas.getTemplate.parse({
			APIStatus: 'OK',
			...template,
		});
		expect(parsed.TemplateContent).toBeNull();
		expect(parsed.ContentType).toBe('PDF');
	});

	it('parses a MATCH status with one correspondence per template', () => {
		const parsed = SpondyrEndpointOutputSchemas.status.parse(statusSubmitted);
		expect(parsed.StatusCode).toBe('MATCH');
		expect(parsed.Correspondence).toHaveLength(1);
		expect(parsed.Correspondence?.[0]?.Recipients?.[0]?.IsSuccessful).toBe(
			true,
		);
	});

	it('parses a NOMATCH status whose correspondence array is empty', () => {
		const parsed = SpondyrEndpointOutputSchemas.status.parse(statusNoMatch);
		expect(parsed.StatusCode).toBe('NOMATCH');
		expect(parsed.Correspondence).toEqual([]);
	});

	it('parses a finished batch with no errors', () => {
		const parsed = SpondyrEndpointOutputSchemas.batchStatus.parse(batchStatus);
		expect(parsed.StatusCode).toBe('FINISH');
		expect(parsed.BatchErrors).toEqual([]);
	});

	it('parses a partial batch with one item error', () => {
		const parsed =
			SpondyrEndpointOutputSchemas.batchStatus.parse(batchStatusPartial);
		expect(parsed.StatusCode).toBe('FINISHPART');
		expect(parsed.BatchErrors?.[0]?.Index).toBe(1);
		expect(parsed.BatchErrors?.[0]?.ReferenceID).toBe('item-2');
	});

	it('parses search results with their paging fields', () => {
		const parsed = SpondyrEndpointOutputSchemas.search.parse(searchResults);
		expect(parsed.RecordCount).toBe(1);
		expect(parsed.PageSize).toBe(10);
		expect(parsed.SortOrder).toBe('DESC');
	});

	it('parses a 404 error envelope through the status schema', () => {
		// The status route answers 404 with an envelope instead of a body, so the
		// schema accepts it; `assertApiStatus` is what rejects it.
		const parsed = SpondyrEndpointOutputSchemas.status.parse(invalidReference);
		expect(parsed.APIStatus).toBe('ERROR');
		expect(parsed.ReferenceID).toBeNull();
	});

	it('parses a delete envelope that carries only the status', () => {
		const parsed = SpondyrEndpointOutputSchemas.deleteTemplate.parse(deleted);
		expect(parsed.APIStatus).toBe('OK');
	});
});

describe('wrong-shaped bodies fail loudly', () => {
	it('rejects a list whose Data is not an array', () => {
		expect(() =>
			SpondyrEndpointOutputSchemas.listTransactionTypes.parse({
				APIStatus: 'OK',
				Data: {},
			}),
		).toThrow(z.ZodError);
	});

	it('rejects an envelope with no APIStatus', () => {
		expect(() => SpondyrEndpointOutputSchemas.deleteTemplate.parse({})).toThrow(
			z.ZodError,
		);
	});

	it('rejects a list element that lost its Name', () => {
		expect(() =>
			SpondyrEndpointOutputSchemas.listConditions.parse({
				APIStatus: 'OK',
				Data: [{ TransactionType: 'Customer Orders' }],
			}),
		).toThrow(z.ZodError);
	});

	it('rejects a batch whose BatchSize arrived as a string', () => {
		expect(() =>
			SpondyrEndpointOutputSchemas.batchStatus.parse({
				...batchStatus,
				BatchSize: '2',
			}),
		).toThrow(z.ZodError);
	});

	it('rejects a search result with no paging fields at all', () => {
		// PageCount and friends are nullish, but Data is required.
		expect(() =>
			SpondyrEndpointOutputSchemas.search.parse({ APIStatus: 'OK' }),
		).toThrow(z.ZodError);
	});
});

const REQUEST = { method: 'GET', path: 'Templates' } as const;

describe('assertApiStatus', () => {
	it('throws with the provider message on an ERROR envelope', () => {
		expect(() =>
			assertApiStatus(
				{ APIStatus: 'ERROR', ErrorMessage: 'No template matched' },
				'correspondence.send',
				REQUEST,
			),
		).toThrow(ApiError);
	});

	it('names the operation that was refused', () => {
		expect(() =>
			assertApiStatus(
				{ APIStatus: 'ERROR', ErrorMessage: 'No template matched' },
				'correspondence.send',
				REQUEST,
			),
		).toThrow('correspondence.send was refused: No template matched');
	});

	it('passes an OK envelope', () => {
		expect(() =>
			assertApiStatus({ APIStatus: 'OK' }, 'templates.list', REQUEST),
		).not.toThrow();
	});

	it('passes a body with no APIStatus at all', () => {
		expect(() =>
			assertApiStatus({ Name: 'x' }, 'templates.list', REQUEST),
		).not.toThrow();
	});

	it('passes a non-object body', () => {
		expect(() =>
			assertApiStatus(null, 'templates.list', REQUEST),
		).not.toThrow();
		expect(() =>
			assertApiStatus('<html>', 'templates.list', REQUEST),
		).not.toThrow();
	});

	it('falls back to a plain message when ErrorMessage is missing', () => {
		expect(() =>
			assertApiStatus({ APIStatus: 'ERROR' }, 'templates.list', REQUEST),
		).toThrow('no message given');
	});
});

describe('resolveCredentials', () => {
	it('reads the Application Token from the account when the option is unset', async () => {
		await expect(
			resolveCredentials(
				{
					options: {},
					keys: {
						get_api_key: async () => 'k',
						get_application_token: async () => 'stored-token',
					},
				},
				'k',
			),
		).resolves.toEqual({ apiKey: 'k', applicationToken: 'stored-token' });
	});

	it('prefers the inline option', async () => {
		await expect(
			resolveCredentials(
				{
					options: { applicationToken: 'inline-token' },
					keys: {
						get_api_key: async () => 'k',
						get_application_token: async () => 'stored-token',
					},
				},
				'k',
			),
		).resolves.toEqual({ apiKey: 'k', applicationToken: 'inline-token' });
	});

	it('throws before the request when neither is set', async () => {
		await expect(
			resolveCredentials(
				{
					options: {},
					keys: {
						get_api_key: async () => 'k',
						get_application_token: async () => null,
					},
				},
				'k',
			),
		).rejects.toMatchObject({ name: 'AuthMissingError' });
	});
});

describe('credentials without a key manager', () => {
	it('raises the missing-token error, not a TypeError, when ctx.keys is absent', async () => {
		await expect(
			resolveCredentials({ options: {} }, 'k'),
		).rejects.toMatchObject({ name: 'AuthMissingError' });
		await expect(
			resolveCredentials({ options: { applicationToken: 't' } }, 'k'),
		).resolves.toEqual({ apiKey: 'k', applicationToken: 't' });
	});
});

describe('targeted Mail delivery', () => {
	it('needs a postal address', () => {
		const base = { reference_id: 'r1', original_recipients: 'None' };
		const without = SpondyrEndpointInputSchemaFor.deliver.safeParse({
			...base,
			new_recipients: [{ TargetedDeliveryMethod: 'Mail', FirstName: 'Pat' }],
		});
		expect(without.success).toBe(false);
		const withAddress = SpondyrEndpointInputSchemaFor.deliver.safeParse({
			...base,
			new_recipients: [
				{
					TargetedDeliveryMethod: 'Mail',
					Address1: '1 Main St',
					City: 'Springfield',
					State: 'IL',
					Zip: '62701',
				},
			],
		});
		expect(withAddress.success).toBe(true);
	});
});

describe('document data', () => {
	it("accepts Spondyr's own nested example: objects and loop arrays", () => {
		const parsed = SpondyrEndpointInputSchemaFor.send.safeParse({
			event_type: 'New Order',
			data: {
				OrderNumber: 'A-100',
				Customer: { CustomerID: 7, FirstName: 'Jane' },
				Details: [
					{ ProductID: 1, Price: 9.5, Options: [{ Name: 'Size', Value: 'M' }] },
				],
			},
		});
		expect(parsed.success).toBe(true);
	});
});
