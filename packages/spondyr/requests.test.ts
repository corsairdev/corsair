import {
	BatchEndpoints,
	ConditionsEndpoints,
	CorrespondenceEndpoints,
	EventTypesEndpoints,
	RecipientsEndpoints,
	SearchFiltersEndpoints,
	TemplatesEndpoints,
	TransactionTypesEndpoints,
} from './endpoints';
import {
	batchAccepted,
	batchStatus,
	condition,
	conditionList,
	deleted,
	eventType,
	eventTypeList,
	recipient,
	recipientList,
	refusedInEnvelope,
	searchFilter,
	searchFilterList,
	searchResults,
	sendAccepted,
	statusSubmitted,
	template,
	templateContentAccepted,
	templateList,
	transactionType,
	transactionTypeList,
} from './test-fixtures';
import { captureError, invoke } from './test-helpers';

type Json = Record<string, string | number | boolean | undefined>;

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON; each test passes its own.
function respond(body: unknown, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json' },
		}),
	);
}

function lastRequest() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	const parsed = new URL(url);
	return {
		origin: parsed.origin,
		path: parsed.pathname,
		query: Object.fromEntries(parsed.searchParams),
		method: init.method,
		headers: new Headers(init.headers),
		// unknown: the request body is whatever the endpoint serialized.
		body: init.body ? (JSON.parse(String(init.body)) as unknown) : undefined, // unknown: asserted inline.
	};
}

function expectAuthenticated() {
	const sent = lastRequest();
	expect(sent.origin).toBe('https://client.spondyr.io');
	expect(sent.headers.get('apikey')).toBe('sp-test-key');
	expect(sent.headers.get('applicationtoken')).toBe('sp-test-token');
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('correspondence', () => {
	it('correspondence.send POSTs the event and data', async () => {
		respond(sendAccepted);

		const result = (await invoke(CorrespondenceEndpoints.send, {
			event_type: 'OrderPlaced',
			data: { OrderNumber: 12345 },
			is_generate_only: true,
		})) as { ReferenceID?: string | null };

		expectAuthenticated();
		expect(lastRequest().path).toBe('/api/v1.0.0/Spondyr');
		expect(lastRequest().method).toBe('POST');
		expect(lastRequest().body).toEqual({
			EventType: 'OrderPlaced',
			IsGenerateOnly: true,
			Data: { OrderNumber: 12345 },
		});
		expect(result.ReferenceID).toBe('c1a2b3-reference');
	});

	it('correspondence.send defaults is_generate_only to false', async () => {
		respond(sendAccepted);

		await invoke(CorrespondenceEndpoints.send, {
			event_type: 'OrderPlaced',
			data: {},
		});

		expect((lastRequest().body as Json).IsGenerateOnly).toBe(false);
	});

	it('correspondence.deliver PUTs the reference and the recipient selection', async () => {
		respond(sendAccepted);

		await invoke(CorrespondenceEndpoints.deliver, {
			reference_id: 'c1a2b3-reference',
			template: 'Order Confirmation',
			original_recipients: 'None',
			new_recipients: [
				{
					Email: 'john@acme.com',
					FirstName: 'John',
					TargetedDeliveryMethod: 'Email',
				},
			],
		});

		expectAuthenticated();
		expect(lastRequest().method).toBe('PUT');
		expect(lastRequest().body).toEqual({
			ReferenceID: 'c1a2b3-reference',
			Template: 'Order Confirmation',
			OriginalRecipients: 'None',
			NewRecipients: [
				{
					Email: 'john@acme.com',
					FirstName: 'John',
					TargetedDeliveryMethod: 'Email',
				},
			],
		});
	});

	it('correspondence.deliver rejects a targeted channel with no address', async () => {
		const error = await captureError(
			invoke(CorrespondenceEndpoints.deliver, {
				reference_id: 'r1',
				new_recipients: [
					{ FirstName: 'John', TargetedDeliveryMethod: 'Email' },
				],
			}),
		);

		expect((error as Error).name).toBe('ZodError');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('correspondence.deliver accepts a TargetedDeliveryMethod with its address', async () => {
		respond(sendAccepted);

		await invoke(CorrespondenceEndpoints.deliver, {
			reference_id: 'r1',
			new_recipients: [
				{ MobilePhone: '+15550001', TargetedDeliveryMethod: 'Text' },
			],
		});

		expect(
			(lastRequest().body as { NewRecipients: Json[] }).NewRecipients,
		).toHaveLength(1);
	});

	it('correspondence.status GETs the reference with IncludeData', async () => {
		respond(statusSubmitted);

		const result = (await invoke(CorrespondenceEndpoints.status, {
			reference_id: 'c1a2b3-reference',
			include_data: true,
		})) as { StatusCode?: string | null; Correspondence?: unknown[] }; // unknown: length only.

		expectAuthenticated();
		expect(lastRequest().path).toBe('/api/v1.0.0/Spondyr');
		expect(lastRequest().method).toBe('GET');
		expect(lastRequest().query).toEqual({
			ReferenceID: 'c1a2b3-reference',
			IncludeData: 'true',
		});
		expect(result.StatusCode).toBe('MATCH');
		expect(result.Correspondence).toHaveLength(1);
	});

	it('correspondence.retry POSTs the reference to Retry', async () => {
		respond(sendAccepted);

		await invoke(CorrespondenceEndpoints.retry, {
			reference_id: 'c1a2b3-reference',
			template: 'Order Confirmation',
		});

		expectAuthenticated();
		expect(lastRequest().path).toBe('/api/v1.0.0/Retry');
		expect(lastRequest().method).toBe('POST');
		expect(lastRequest().body).toEqual({
			ReferenceID: 'c1a2b3-reference',
			Template: 'Order Confirmation',
		});
	});

	it('correspondence.search GETs Spondyrs with paging', async () => {
		respond(searchResults);

		const result = (await invoke(CorrespondenceEndpoints.search, {
			event_type: 'OrderPlaced',
			search_name: 'OrderNumber',
			search_value: '12345',
			page: 1,
			page_size: 50,
			sort_order: 'DESC',
		})) as { Data: unknown[]; PageCount?: number | null }; // unknown: length only.

		expectAuthenticated();
		expect(lastRequest().path).toBe('/api/v1.0.0/Spondyrs');
		expect(lastRequest().query).toEqual({
			EventType: 'OrderPlaced',
			SearchName: 'OrderNumber',
			SearchValue: '12345',
			Page: '1',
			PageSize: '50',
			SortOrder: 'DESC',
		});
		expect(result.Data).toHaveLength(1);
		expect(result.PageCount).toBe(1);
	});

	it('correspondence.search rejects a page size above the documented 250', async () => {
		const error = await captureError(
			invoke(CorrespondenceEndpoints.search, { page_size: 251 }),
		);

		expect((error as Error).name).toBe('ZodError');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('correspondence.search accepts exactly 250', async () => {
		respond(searchResults);

		await invoke(CorrespondenceEndpoints.search, { page_size: 250 });

		expect(lastRequest().query.PageSize).toBe('250');
	});
});

describe('batch', () => {
	it('batch.send POSTs the array with SharedData', async () => {
		respond(batchAccepted);

		await invoke(BatchEndpoints.send, {
			event_type: 'OrderPlaced',
			data: [{ Recipient: 'a@acme.com' }, { Recipient: 'b@acme.com' }],
			shared_data: { Message: 'Hello World!' },
		});

		expectAuthenticated();
		expect(lastRequest().path).toBe('/api/v1.0.0/Batch');
		expect(lastRequest().body).toEqual({
			EventType: 'OrderPlaced',
			IsGenerateOnly: false,
			SharedData: { Message: 'Hello World!' },
			Data: [{ Recipient: 'a@acme.com' }, { Recipient: 'b@acme.com' }],
		});
	});

	it('batch.send rejects an empty data array', async () => {
		const error = await captureError(
			invoke(BatchEndpoints.send, { event_type: 'OrderPlaced', data: [] }),
		);

		expect((error as Error).name).toBe('ZodError');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('batch.status GETs the batch reference', async () => {
		respond(batchStatus);

		const result = (await invoke(BatchEndpoints.status, {
			reference_id: 'batch-reference',
		})) as { BatchSize?: number | null; TotalProcessed?: number | null };

		expectAuthenticated();
		expect(lastRequest().path).toBe('/api/v1.0.0/Batch');
		expect(lastRequest().query).toEqual({ ReferenceID: 'batch-reference' });
		expect(result.BatchSize).toBe(2);
		expect(result.TotalProcessed).toBe(2);
	});
});

describe('transactionTypes', () => {
	it('transactionTypes.list GETs TransactionTypes', async () => {
		respond(transactionTypeList);

		const result = (await invoke(TransactionTypesEndpoints.list, {})) as {
			Data: unknown[]; // unknown: length only.
		};

		expectAuthenticated();
		expect(lastRequest().path).toBe('/api/v1.0.0/TransactionTypes');
		expect(result.Data).toHaveLength(1);
	});

	it('transactionTypes.get GETs one by name', async () => {
		respond({ APIStatus: 'OK', ...transactionType });

		await invoke(TransactionTypesEndpoints.get, {
			transaction_type: 'Customer Orders',
		});

		expectAuthenticated();
		expect(lastRequest().path).toBe('/api/v1.0.0/TransactionType');
		expect(lastRequest().query).toEqual({
			TransactionType: 'Customer Orders',
		});
	});

	it('transactionTypes.create POSTs the name and JSON sample', async () => {
		respond({ APIStatus: 'OK', ReferenceID: 'tt-1' });

		await invoke(TransactionTypesEndpoints.create, {
			name: 'Customer Orders',
			template_json: '{"OrderNumber":12345}',
		});

		expectAuthenticated();
		expect(lastRequest().method).toBe('POST');
		expect(lastRequest().body).toEqual({
			Name: 'Customer Orders',
			TemplateJSON: '{"OrderNumber":12345}',
		});
	});

	it('transactionTypes.update PUTs the selector in the body', async () => {
		respond({ APIStatus: 'OK', ReferenceID: 'tt-1' });

		await invoke(TransactionTypesEndpoints.update, {
			transaction_type: 'Customer Orders',
			name: 'Orders',
			template_json: '{"OrderNumber":12345}',
		});

		expectAuthenticated();
		expect(lastRequest().method).toBe('PUT');
		expect(lastRequest().body).toEqual({
			TransactionType: 'Customer Orders',
			Name: 'Orders',
			TemplateJSON: '{"OrderNumber":12345}',
		});
	});

	it('transactionTypes.delete DELETEs with the name in the query', async () => {
		respond(deleted);

		await invoke(TransactionTypesEndpoints.delete, {
			transaction_type: 'Customer Orders',
		});

		expectAuthenticated();
		expect(lastRequest().method).toBe('DELETE');
		expect(lastRequest().query).toEqual({
			TransactionType: 'Customer Orders',
		});
		expect(lastRequest().body).toBeUndefined();
	});
});

describe('eventTypes', () => {
	it('eventTypes.list GETs with the Transaction Type filter', async () => {
		respond(eventTypeList);

		await invoke(EventTypesEndpoints.list, {
			transaction_type: 'Customer Orders',
		});

		expectAuthenticated();
		expect(lastRequest().path).toBe('/api/v1.0.0/EventTypes');
		expect(lastRequest().query).toEqual({
			TransactionType: 'Customer Orders',
		});
	});

	it('eventTypes.get GETs one by name', async () => {
		respond({ APIStatus: 'OK', ...eventType });

		await invoke(EventTypesEndpoints.get, { event_type: 'OrderPlaced' });

		expectAuthenticated();
		expect(lastRequest().query).toEqual({ EventType: 'OrderPlaced' });
	});

	it('eventTypes.create POSTs the Transaction Type and name', async () => {
		respond({ APIStatus: 'OK', ReferenceID: 'et-1' });

		await invoke(EventTypesEndpoints.create, {
			transaction_type: 'Customer Orders',
			name: 'OrderPlaced',
		});

		expectAuthenticated();
		expect(lastRequest().path).toBe('/api/v1.0.0/EventType');
		expect(lastRequest().body).toEqual({
			TransactionType: 'Customer Orders',
			Name: 'OrderPlaced',
		});
	});

	it('eventTypes.update PUTs with the selector', async () => {
		respond({ APIStatus: 'OK', ReferenceID: 'et-1' });

		await invoke(EventTypesEndpoints.update, {
			transaction_type: 'Customer Orders',
			event_type: 'OrderPlaced',
			name: 'OrderCreated',
		});

		expectAuthenticated();
		expect(lastRequest().method).toBe('PUT');
		expect(lastRequest().body).toEqual({
			TransactionType: 'Customer Orders',
			EventType: 'OrderPlaced',
			Name: 'OrderCreated',
		});
	});

	it('eventTypes.delete DELETEs by name', async () => {
		respond(deleted);

		await invoke(EventTypesEndpoints.delete, { event_type: 'OrderPlaced' });

		expectAuthenticated();
		expect(lastRequest().method).toBe('DELETE');
		expect(lastRequest().query).toEqual({ EventType: 'OrderPlaced' });
	});
});

describe('recipients', () => {
	it('recipients.list GETs with the Transaction Type', async () => {
		respond(recipientList);

		await invoke(RecipientsEndpoints.list, {
			transaction_type: 'Customer Orders',
		});

		expectAuthenticated();
		expect(lastRequest().path).toBe('/api/v1.0.0/Recipients');
		expect(lastRequest().query).toEqual({
			TransactionType: 'Customer Orders',
		});
	});

	it('recipients.get GETs one by name', async () => {
		respond({ APIStatus: 'OK', ...recipient });

		await invoke(RecipientsEndpoints.get, {
			transaction_type: 'Customer Orders',
			recipient: 'Customer',
		});

		expectAuthenticated();
		expect(lastRequest().query).toEqual({
			TransactionType: 'Customer Orders',
			Recipient: 'Customer',
		});
	});

	it('recipients.create POSTs every address field it was given', async () => {
		respond({ APIStatus: 'OK', ReferenceID: 'r-1' });

		await invoke(RecipientsEndpoints.create, {
			transaction_type: 'Customer Orders',
			name: 'Customer',
			remote_id: '{Customer.CustomerID}',
			first_name: '{Customer.FirstName}',
			email: '{Customer.Email}',
		});

		expectAuthenticated();
		expect(lastRequest().path).toBe('/api/v1.0.0/Recipient');
		expect(lastRequest().body).toEqual({
			TransactionType: 'Customer Orders',
			Name: 'Customer',
			RemoteID: '{Customer.CustomerID}',
			FirstName: '{Customer.FirstName}',
			Email: '{Customer.Email}',
		});
	});

	it('recipients.create leaves unset address fields out entirely', async () => {
		respond({ APIStatus: 'OK', ReferenceID: 'r-1' });

		await invoke(RecipientsEndpoints.create, {
			transaction_type: 'Customer Orders',
			name: 'Customer',
		});

		// An explicit null would clear the field on an update.
		expect(lastRequest().body).toEqual({
			TransactionType: 'Customer Orders',
			Name: 'Customer',
		});
	});

	it('recipients.update PUTs with the selector', async () => {
		respond({ APIStatus: 'OK', ReferenceID: 'r-1' });

		await invoke(RecipientsEndpoints.update, {
			transaction_type: 'Customer Orders',
			recipient: 'Customer',
			name: 'Customer',
			mobile_phone: '{Customer.Mobile}',
		});

		expectAuthenticated();
		expect(lastRequest().method).toBe('PUT');
		expect(lastRequest().body).toEqual({
			TransactionType: 'Customer Orders',
			Recipient: 'Customer',
			Name: 'Customer',
			MobilePhone: '{Customer.Mobile}',
		});
	});

	it('recipients.delete DELETEs with both the filter and the name', async () => {
		respond(deleted);

		await invoke(RecipientsEndpoints.delete, {
			transaction_type: 'Customer Orders',
			recipient: 'Customer',
		});

		expectAuthenticated();
		expect(lastRequest().method).toBe('DELETE');
		expect(lastRequest().query).toEqual({
			TransactionType: 'Customer Orders',
			Recipient: 'Customer',
		});
	});
});

describe('conditions', () => {
	it('conditions.list GETs with the Transaction Type', async () => {
		respond(conditionList);

		await invoke(ConditionsEndpoints.list, {
			transaction_type: 'Customer Orders',
		});

		expectAuthenticated();
		expect(lastRequest().path).toBe('/api/v1.0.0/Conditions');
	});

	it('conditions.get GETs one by name', async () => {
		respond({ APIStatus: 'OK', ...condition });

		await invoke(ConditionsEndpoints.get, {
			transaction_type: 'Customer Orders',
			condition: 'Is Express',
		});

		expectAuthenticated();
		expect(lastRequest().query).toEqual({
			TransactionType: 'Customer Orders',
			Condition: 'Is Express',
		});
	});

	it('conditions.create POSTs the inspected field and values', async () => {
		respond({ APIStatus: 'OK', ReferenceID: 'c-1' });

		await invoke(ConditionsEndpoints.create, {
			transaction_type: 'Customer Orders',
			name: 'Is Express',
			field_name: 'Shipping',
			possible_values: 'Express\nOvernight',
		});

		expectAuthenticated();
		expect(lastRequest().body).toEqual({
			TransactionType: 'Customer Orders',
			Name: 'Is Express',
			FieldName: 'Shipping',
			PossibleValues: 'Express\nOvernight',
		});
	});

	it('conditions.update PUTs with the selector', async () => {
		respond({ APIStatus: 'OK', ReferenceID: 'c-1' });

		await invoke(ConditionsEndpoints.update, {
			transaction_type: 'Customer Orders',
			condition: 'Is Express',
			name: 'Is Express',
			field_name: 'Shipping',
		});

		expectAuthenticated();
		expect(lastRequest().method).toBe('PUT');
		expect(lastRequest().body).toEqual({
			TransactionType: 'Customer Orders',
			Condition: 'Is Express',
			Name: 'Is Express',
			FieldName: 'Shipping',
		});
	});

	it('conditions.delete DELETEs by name', async () => {
		respond(deleted);

		await invoke(ConditionsEndpoints.delete, {
			transaction_type: 'Customer Orders',
			condition: 'Is Express',
		});

		expectAuthenticated();
		expect(lastRequest().query).toEqual({
			TransactionType: 'Customer Orders',
			Condition: 'Is Express',
		});
	});
});

describe('searchFilters', () => {
	it('searchFilters.list GETs Searches with the Transaction Type', async () => {
		respond(searchFilterList);

		await invoke(SearchFiltersEndpoints.list, {
			transaction_type: 'Customer Orders',
		});

		expectAuthenticated();
		expect(lastRequest().path).toBe('/api/v1.0.0/Searches');
		expect(lastRequest().query).toEqual({
			TransactionType: 'Customer Orders',
		});
	});

	it('searchFilters.get GETs one by name and Transaction Type', async () => {
		respond({ APIStatus: 'OK', ...searchFilter });

		await invoke(SearchFiltersEndpoints.get, {
			transaction_type: 'Customer Orders',
			search: 'OrderNumber',
		});

		expectAuthenticated();
		expect(lastRequest().path).toBe('/api/v1.0.0/Search');
		// The docs list only Search, but the live API answers "Transaction Type not specified!" without it.
		expect(lastRequest().query).toEqual({
			TransactionType: 'Customer Orders',
			Search: 'OrderNumber',
		});
	});

	it('searchFilters.create POSTs the tag template', async () => {
		respond({ APIStatus: 'OK', ReferenceID: 's-1' });

		await invoke(SearchFiltersEndpoints.create, {
			transaction_type: 'Customer Orders',
			name: 'OrderNumber',
			tag: '{OrderNumber}',
		});

		expectAuthenticated();
		expect(lastRequest().path).toBe('/api/v1.0.0/Search');
		expect(lastRequest().body).toEqual({
			TransactionType: 'Customer Orders',
			Name: 'OrderNumber',
			Tag: '{OrderNumber}',
		});
	});

	it('searchFilters.update PUTs with the selector', async () => {
		respond({ APIStatus: 'OK', ReferenceID: 's-1' });

		await invoke(SearchFiltersEndpoints.update, {
			transaction_type: 'Customer Orders',
			search: 'OrderNumber',
			name: 'OrderNumber',
			tag: '{OrderNumber}',
		});

		expectAuthenticated();
		expect(lastRequest().method).toBe('PUT');
		expect(lastRequest().body).toEqual({
			TransactionType: 'Customer Orders',
			Search: 'OrderNumber',
			Name: 'OrderNumber',
			Tag: '{OrderNumber}',
		});
	});

	it('searchFilters.delete DELETEs by name and Transaction Type', async () => {
		respond(deleted);

		await invoke(SearchFiltersEndpoints.delete, {
			transaction_type: 'Customer Orders',
			search: 'OrderNumber',
		});

		expectAuthenticated();
		expect(lastRequest().method).toBe('DELETE');
		expect(lastRequest().query).toEqual({
			TransactionType: 'Customer Orders',
			Search: 'OrderNumber',
		});
	});
});

describe('templates', () => {
	it('templates.list GETs with the Transaction Type', async () => {
		respond(templateList);

		const result = (await invoke(TemplatesEndpoints.list, {
			transaction_type: 'Customer Orders',
		})) as { Data: unknown[] }; // unknown: length only.

		expectAuthenticated();
		expect(lastRequest().path).toBe('/api/v1.0.0/Templates');
		expect(result.Data).toHaveLength(1);
	});

	it('templates.get GETs one by name', async () => {
		respond({ APIStatus: 'OK', ...template });

		await invoke(TemplatesEndpoints.get, {
			transaction_type: 'Customer Orders',
			template: 'Order Confirmation',
		});

		expectAuthenticated();
		expect(lastRequest().query).toEqual({
			TransactionType: 'Customer Orders',
			Template: 'Order Confirmation',
		});
	});

	it('templates.create POSTs the recipients and conditions in PascalCase', async () => {
		respond({ APIStatus: 'OK', ReferenceID: 't-1' });

		await invoke(TemplatesEndpoints.create, {
			transaction_type: 'Customer Orders',
			name: 'Order Confirmation',
			event_type: 'OrderPlaced',
			content_type: 'PDF',
			template_content_reference_id: '9f2c',
			recipients: [
				{
					name: 'Customer',
					delivery_method: 'Email',
					email_from_address: 'orders@acme.com',
					email_subject: 'Your order',
				},
			],
			conditions: [
				{
					name: 'Is Express',
					logical_operator: 'AND',
					compare_operator: '=',
					compare_value: 'Express',
				},
			],
			searches: ['OrderNumber'],
		});

		expectAuthenticated();
		expect(lastRequest().path).toBe('/api/v1.0.0/Template');
		expect(lastRequest().body).toEqual({
			Name: 'Order Confirmation',
			EventType: 'OrderPlaced',
			ContentType: 'PDF',
			TemplateContentReferenceID: '9f2c',
			Recipients: [
				{
					Name: 'Customer',
					DeliveryMethod: 'Email',
					EmailFromAddress: 'orders@acme.com',
					EmailSubject: 'Your order',
				},
			],
			Conditions: [
				{
					Name: 'Is Express',
					LogicalOperator: 'AND',
					CompareOperator: '=',
					CompareValue: 'Express',
				},
			],
			Searches: ['OrderNumber'],
		});
	});

	it('templates.create rejects DocuSign delivery with no signer', async () => {
		const error = await captureError(
			invoke(TemplatesEndpoints.create, {
				transaction_type: 'Customer Orders',
				name: 'Contract',
				event_type: 'OrderPlaced',
				content_type: 'PDF',
				template_content_reference_id: '9f2c',
				recipients: [{ name: 'Customer', delivery_method: 'DocuSign' }],
			}),
		);

		expect((error as Error).name).toBe('ZodError');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('templates.create accepts DocuSign delivery with a signer', async () => {
		respond({ APIStatus: 'OK', ReferenceID: 't-1' });

		await invoke(TemplatesEndpoints.create, {
			transaction_type: 'Customer Orders',
			name: 'Contract',
			event_type: 'OrderPlaced',
			content_type: 'PDF',
			template_content_reference_id: '9f2c',
			recipients: [
				{
					name: 'Customer',
					delivery_method: 'DocuSign',
					signers: [{ name: 'John', email: 'john@acme.com', role: 'Signer' }],
				},
			],
		});

		const recipients = (lastRequest().body as { Recipients: Json[] })
			.Recipients;
		expect(recipients[0]?.Signers).toHaveLength(1);
	});

	it('templates.update PUTs with the selector', async () => {
		respond({ APIStatus: 'OK', ReferenceID: 't-1' });

		await invoke(TemplatesEndpoints.update, {
			transaction_type: 'Customer Orders',
			template: 'Order Confirmation',
			name: 'Order Confirmation',
			event_type: 'OrderPlaced',
			content_type: 'PDF',
			template_content_reference_id: '9f2c',
			recipients: [{ name: 'Customer', delivery_method: 'Email' }],
		});

		expectAuthenticated();
		expect(lastRequest().method).toBe('PUT');
		expect((lastRequest().body as Json).Template).toBe('Order Confirmation');
	});

	it('templates.delete DELETEs with both the filter and the name', async () => {
		respond(deleted);

		await invoke(TemplatesEndpoints.delete, {
			transaction_type: 'Customer Orders',
			template: 'Order Confirmation',
		});

		expectAuthenticated();
		expect(lastRequest().method).toBe('DELETE');
		expect(lastRequest().query).toEqual({
			TransactionType: 'Customer Orders',
			Template: 'Order Confirmation',
		});
	});

	it('templates.uploadContent POSTs the base64 content', async () => {
		respond(templateContentAccepted);

		const result = (await invoke(TemplatesEndpoints.uploadContent, {
			content: 'JVBERi0xLjQK',
		})) as { ReferenceID?: string | null };

		expectAuthenticated();
		expect(lastRequest().path).toBe('/api/v1.0.0/TemplateContent');
		expect(lastRequest().body).toEqual({ Content: 'JVBERi0xLjQK' });
		expect(result.ReferenceID).toBe('9f2c-template-content');
	});
});

describe('a 200 is not proof the call worked', () => {
	it('throws when the envelope says ERROR', async () => {
		respond(refusedInEnvelope);

		const error = await captureError(
			invoke(CorrespondenceEndpoints.send, {
				event_type: 'OrderPlaced',
				data: {},
			}),
		);

		expect((error as Error).name).toBe('ApiError');
		expect((error as Error).message).toContain('No template matched the event');
	});

	it('throws for a refused delete too', async () => {
		respond({ APIStatus: 'ERROR', ErrorMessage: 'Template is in use' });

		const error = await captureError(
			invoke(TemplatesEndpoints.delete, {
				transaction_type: 'Customer Orders',
				template: 'Order Confirmation',
			}),
		);

		expect((error as Error).message).toContain('Template is in use');
	});

	it('reports a missing Application Token before sending anything', async () => {
		const error = await captureError(
			TemplatesEndpoints.list(
				{
					key: 'sp-test-key',
					authType: 'api_key',
					options: {},
					tenantId: 'default',
					keys: {
						get_api_key: async () => 'sp-test-key',
						get_application_token: async () => null,
					},
				} as never,
				{ transaction_type: 'Customer Orders' } as never,
			),
		);

		expect((error as Error).name).toBe('AuthMissingError');
		expect(fetchMock).not.toHaveBeenCalled();
	});
});
