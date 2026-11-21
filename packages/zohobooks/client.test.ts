import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import {
	MAX_BINARY_RESPONSE_BYTES,
	makeZohoBooksRequest,
	zohoBooksApiBase,
	zohoBooksOAuthAuthUrl,
	zohoBooksOAuthTokenUrl,
} from './client';
import { openApiSchemas, zohoBooksOperations } from './openapi';
import type {
	JsonValue,
	ZohoBooksOperationDefinition,
	ZohoBooksOperationInput,
	ZohoBooksRegion,
} from './schema/openapi-types';

const regions: ZohoBooksRegion[] = [
	'us',
	'eu',
	'in',
	'au',
	'jp',
	'ca',
	'cn',
	'sa',
	'ae',
];
const domains: Record<ZohoBooksRegion, string> = {
	us: 'com',
	eu: 'eu',
	in: 'in',
	au: 'com.au',
	jp: 'jp',
	ca: 'ca',
	cn: 'com.cn',
	sa: 'sa',
	ae: 'ae',
};
const accountsDomains: Record<ZohoBooksRegion, string> = {
	us: 'accounts.zoho.com',
	eu: 'accounts.zoho.eu',
	in: 'accounts.zoho.in',
	au: 'accounts.zoho.com.au',
	jp: 'accounts.zoho.jp',
	ca: 'accounts.zohocloud.ca',
	cn: 'accounts.zoho.com.cn',
	sa: 'accounts.zoho.sa',
	ae: 'accounts.zoho.ae',
};

type JsonObject = { readonly [key: string]: JsonValue };

function isJsonObject(value: JsonValue | undefined): value is JsonObject {
	return (
		value !== undefined &&
		typeof value === 'object' &&
		value !== null &&
		!Array.isArray(value)
	);
}

function valueForSchema(
	parameter: ZohoBooksOperationDefinition['parameters'][number],
): JsonValue {
	const schema = parameter.schema;
	if (isJsonObject(schema)) {
		const enumValues = schema.enum;
		if (Array.isArray(enumValues) && enumValues.length > 0)
			return enumValues[0] ?? null;
		if (schema.type === 'boolean') return false;
		if (schema.type === 'integer' || schema.type === 'number') return 1;
		if (schema.type === 'array') return [];
	}
	if (parameter.name === 'organization_id' || parameter.name.endsWith('_id'))
		return '999999999999999';
	return 'sample';
}

function resolveSchema(
	operation: ZohoBooksOperationDefinition,
	schemaInput: JsonValue | undefined,
): JsonValue | undefined {
	if (schemaInput === undefined || !isJsonObject(schemaInput))
		return schemaInput;
	const reference = schemaInput.$ref;
	if (typeof reference !== 'string') return schemaInput;
	const name = reference.match(/^#\/components\/schemas\/([^/]+)$/)?.[1];
	return name ? openApiSchemas[operation.group]?.[name] : undefined;
}

function isBinarySchema(
	operation: ZohoBooksOperationDefinition,
	schemaInput: JsonValue | undefined,
	depth = 0,
): boolean {
	if (depth > 12 || schemaInput === undefined) return false;
	const schema = resolveSchema(operation, schemaInput);
	if (!isJsonObject(schema)) return false;
	if (schema.format === 'binary') return true;
	if (isBinarySchema(operation, schema.items, depth + 1)) return true;
	for (const key of ['oneOf', 'anyOf', 'allOf']) {
		const branches = schema[key];
		if (
			Array.isArray(branches) &&
			branches.some((branch) => isBinarySchema(operation, branch, depth + 1))
		)
			return true;
	}
	return false;
}

function binaryBodyFieldNames(
	operation: ZohoBooksOperationDefinition,
): string[] {
	const schema = resolveSchema(operation, operation.request?.schema);
	if (!isJsonObject(schema) || !isJsonObject(schema.properties)) return [];
	return Object.entries(schema.properties)
		.filter(([, propertySchema]) => isBinarySchema(operation, propertySchema))
		.map(([key]) => key);
}

function makeInput(
	operation: ZohoBooksOperationDefinition,
): ZohoBooksOperationInput {
	const input: ZohoBooksOperationInput = {};
	for (const location of ['path', 'query', 'header'] as const) {
		const params = operation.parameters.filter(
			(parameter) => parameter.in === location && parameter.required,
		);
		if (params.length === 0) continue;
		const target =
			location === 'path'
				? 'pathParams'
				: location === 'header'
					? 'headers'
					: 'query';
		input[target] = Object.fromEntries(
			params.map((parameter) => [parameter.name, valueForSchema(parameter)]),
		);
	}
	if (operation.request) {
		input.body =
			operation.request.mediaType === 'multipart/form-data'
				? {
						attachment: {
							filename: 'receipt.pdf',
							contentType: 'application/pdf',
							base64: 'JVBERi0xLjQK',
						},
					}
				: {};
	}
	const binaryBodyFields = binaryBodyFieldNames(operation);
	if (binaryBodyFields.length > 0) {
		input.body = {
			...(isJsonObject(input.body) ? input.body : {}),
			...Object.fromEntries(
				binaryBodyFields.map((name) => [
					name,
					{
						filename: 'receipt.pdf',
						contentType: 'application/pdf',
						base64: 'JVBERi0xLjQK',
					},
				]),
			),
		};
	}
	const binaryQueryParameters = operation.parameters.filter(
		(parameter) =>
			parameter.in === 'query' && isBinarySchema(operation, parameter.schema),
	);
	if (binaryQueryParameters.length > 0) {
		input.query = {
			...(input.query ?? {}),
			...Object.fromEntries(
				binaryQueryParameters.map((parameter) => [
					parameter.name,
					{
						filename: 'receipt.pdf',
						contentType: 'application/pdf',
						base64: 'JVBERi0xLjQK',
					},
				]),
			),
		};
	}
	return input;
}

function requiresBinary(operation: ZohoBooksOperationDefinition): boolean {
	return operation.responses.some(
		(response) =>
			response.contentType === '*/*' ||
			(response.contentType !== 'application/x-empty' &&
				!response.contentType.includes('json')),
	);
}

function binaryQueryParameterNames(
	operation: ZohoBooksOperationDefinition,
): string[] {
	return operation.parameters
		.filter(
			(parameter) =>
				parameter.in === 'query' && isBinarySchema(operation, parameter.schema),
		)
		.map((parameter) => parameter.name);
}

function mockResponse(operation: ZohoBooksOperationDefinition): Response {
	if (
		operation.responses.some(
			(response) => response.contentType === 'application/x-empty',
		)
	)
		return new Response(null, { status: 204 });
	if (requiresBinary(operation)) {
		const mediaType = operation.responses.find(
			(response) =>
				response.contentType !== 'application/json' &&
				response.contentType !== 'application/x-empty',
		)?.contentType;
		return new Response('%PDF-1.4\n', {
			status: 200,
			headers: {
				'content-type':
					mediaType === '*/*'
						? 'application/octet-stream'
						: (mediaType ?? 'application/pdf'),
			},
		});
	}
	return new Response(JSON.stringify({ code: 0, message: 'success' }), {
		status: 200,
		headers: { 'content-type': 'application/json' },
	});
}

describe('Zoho Books HTTP client', () => {
	let fetchSpy: jest.SpyInstance<Promise<Response>, Parameters<typeof fetch>>;
	let activeOperation: ZohoBooksOperationDefinition | undefined;

	beforeEach(() => {
		activeOperation = undefined;
		fetchSpy = jest.spyOn(globalThis, 'fetch').mockImplementation(async () => {
			if (!activeOperation) throw new Error('No active operation fixture.');
			return mockResponse(activeOperation);
		});
	});

	afterEach(() => {
		fetchSpy.mockRestore();
	});

	it('uses the documented API and OAuth hosts for every data center', () => {
		for (const region of regions) {
			expect(zohoBooksApiBase(region)).toBe(
				`https://www.zohoapis.${domains[region]}/books/v3`,
			);
			expect(zohoBooksOAuthAuthUrl(region)).toBe(
				`https://${accountsDomains[region]}/oauth/v2/auth`,
			);
			expect(zohoBooksOAuthTokenUrl(region)).toBe(
				`https://${accountsDomains[region]}/oauth/v2/token`,
			);
		}
	});

	it('sends the exact documented method, regional host, route, parameters, headers, and body for all operations', async () => {
		for (const operation of zohoBooksOperations) {
			activeOperation = operation;
			const input = makeInput(operation);
			const result = await makeZohoBooksRequest(
				{ key: 'test-access-token', options: { region: 'us' } },
				operation,
				input,
			);
			expect(result).toBeDefined();
			if (requiresBinary(operation)) {
				const mediaType = operation.responses.find(
					(response) =>
						response.contentType !== 'application/json' &&
						response.contentType !== 'application/x-empty',
				)?.contentType;
				expect(result).toEqual({
					kind: 'binary',
					contentType:
						mediaType === '*/*'
							? 'application/octet-stream'
							: (mediaType ?? 'application/pdf'),
					base64: 'JVBERi0xLjQK',
					byteLength: 9,
				});
			} else if (
				operation.responses.some(
					(response) => response.contentType === 'application/x-empty',
				)
			) {
				expect(result).toBeNull();
			} else {
				expect(result).toEqual({ code: 0, message: 'success' });
			}
			expect(fetchSpy).toHaveBeenCalledTimes(1);
			const [requestUrl, requestInit] = fetchSpy.mock.calls[0] ?? [];
			const url = new URL(String(requestUrl));
			const expectedPath = operation.path.replace(
				/{([^}]+)}/g,
				(_match, name: string) =>
					encodeURIComponent(String(input.pathParams?.[name] ?? '')),
			);
			expect(url.origin).toBe('https://www.zohoapis.com');
			expect(url.pathname).toBe(`/books/v3${expectedPath}`);
			expect(requestInit?.method).toBe(operation.method);
			expect(new Headers(requestInit?.headers).get('authorization')).toBe(
				'Zoho-oauthtoken test-access-token',
			);
			const binaryQueryNames = binaryQueryParameterNames(operation);
			const binaryBodyNames = binaryBodyFieldNames(operation);
			for (const key of Object.keys(input.query ?? {})) {
				if (binaryQueryNames.includes(key)) {
					expect(url.searchParams.has(key)).toBe(false);
				} else {
					expect(url.searchParams.has(key)).toBe(true);
				}
			}
			const multipart =
				operation.request?.mediaType === 'multipart/form-data' ||
				binaryQueryNames.some((name) => input.query?.[name] !== undefined) ||
				binaryBodyNames.some(
					(name) => isJsonObject(input.body) && input.body[name] !== undefined,
				);
			if (multipart) {
				expect(requestInit?.body).toBeInstanceOf(FormData);
				expect(
					new Headers(requestInit?.headers).get('content-type'),
				).toBeNull();
				const form = requestInit?.body;
				if (form instanceof FormData) {
					const fileNames = [
						...binaryQueryNames.filter(
							(name) => input.query?.[name] !== undefined,
						),
						...binaryBodyNames.filter(
							(name) =>
								isJsonObject(input.body) && input.body[name] !== undefined,
						),
					];
					for (const name of fileNames) {
						const file = form.get(name);
						expect(file).toBeInstanceOf(Blob);
						if (file instanceof Blob) {
							expect(file.size).toBe(9);
							expect(file.type).toBe('application/pdf');
							expect(
								Array.from(new Uint8Array(await file.arrayBuffer())),
							).toEqual([37, 80, 68, 70, 45, 49, 46, 52, 10]);
						}
					}
					if (operation.request?.mediaType === 'multipart/form-data')
						expect(form.has('attachment')).toBe(true);
					if (
						operation.request?.mediaType !== 'multipart/form-data' &&
						isJsonObject(input.body)
					) {
						const jsonBody = Object.fromEntries(
							Object.entries(input.body).filter(
								([name]) => !binaryBodyNames.includes(name),
							),
						);
						if (Object.keys(jsonBody).length > 0)
							expect(form.get('JSONString')).toBe(JSON.stringify(jsonBody));
					}
				}
			} else if (input.body !== undefined) {
				expect(requestInit?.body).toBe(JSON.stringify(input.body));
			}
			fetchSpy.mockClear();
		}
	});

	it('sends file bytes as multipart parts and preserves JSON arguments in JSONString', async () => {
		const file = {
			filename: 'receipt.pdf',
			contentType: 'application/pdf',
			base64: 'JVBERi0xLjQK',
		};
		const createBill = zohoBooksOperations.find(
			(operation) => operation.id === 'create_bill',
		);
		if (!createBill) throw new Error('The bill creation operation is missing.');
		activeOperation = createBill;
		const billBody = { vendor_id: '999999999999999', bill_number: 'BILL-42' };
		await makeZohoBooksRequest(
			{ key: 'test-access-token', options: { region: 'us' } },
			createBill,
			{
				query: {
					organization_id: '999999999999999',
					attachment: file,
				},
				body: billBody,
			},
		);
		let requestInit = fetchSpy.mock.calls.at(-1)?.[1];
		let form = requestInit?.body;
		expect(form).toBeInstanceOf(FormData);
		if (!(form instanceof FormData))
			throw new Error('Zoho Books did not receive a multipart bill request.');
		expect(form.get('JSONString')).toBe(JSON.stringify(billBody));
		let upload = form.get('attachment');
		expect(upload).toBeInstanceOf(Blob);
		if (!(upload instanceof Blob))
			throw new Error('The bill file part is missing.');
		expect(Array.from(new Uint8Array(await upload.arrayBuffer()))).toEqual([
			37, 80, 68, 70, 45, 49, 46, 52, 10,
		]);
		expect(new Headers(requestInit?.headers).get('content-type')).toBeNull();

		fetchSpy.mockClear();
		const emailContact = zohoBooksOperations.find(
			(operation) => operation.id === 'email_contact',
		);
		if (!emailContact)
			throw new Error('The contact email operation is missing.');
		activeOperation = emailContact;
		const emailBody = {
			to_mail_ids: ['agent@sample.invalid'],
			subject: 'Receipt',
			body: 'Please see the attached receipt.',
			attachments: file,
		};
		await makeZohoBooksRequest(
			{ key: 'test-access-token', options: { region: 'us' } },
			emailContact,
			{
				pathParams: { contact_id: '999999999999999' },
				query: { organization_id: '999999999999999' },
				body: emailBody,
			},
		);
		requestInit = fetchSpy.mock.calls.at(-1)?.[1];
		form = requestInit?.body;
		expect(form).toBeInstanceOf(FormData);
		if (!(form instanceof FormData))
			throw new Error('Zoho Books did not receive a multipart email request.');
		expect(form.get('JSONString')).toBe(
			JSON.stringify({
				to_mail_ids: emailBody.to_mail_ids,
				subject: emailBody.subject,
				body: emailBody.body,
			}),
		);
		upload = form.get('attachments');
		expect(upload).toBeInstanceOf(Blob);
		if (!(upload instanceof Blob))
			throw new Error('The email file part is missing.');
		expect(Array.from(new Uint8Array(await upload.arrayBuffer()))).toEqual([
			37, 80, 68, 70, 45, 49, 46, 52, 10,
		]);
		expect(new Headers(requestInit?.headers).get('content-type')).toBeNull();

		fetchSpy.mockClear();
		const addRetainerAttachment = zohoBooksOperations.find(
			(operation) => operation.id === 'add_retainer_invoice_attachment',
		);
		if (!addRetainerAttachment)
			throw new Error('The retainer invoice attachment operation is missing.');
		activeOperation = addRetainerAttachment;
		await makeZohoBooksRequest(
			{ key: 'test-access-token', options: { region: 'us' } },
			addRetainerAttachment,
			{
				pathParams: { retainerinvoice_id: '999999999999999' },
				query: { organization_id: '999999999999999' },
				body: { can_send_in_mail: true, attachment: file },
			},
		);
		requestInit = fetchSpy.mock.calls.at(-1)?.[1];
		form = requestInit?.body;
		expect(form).toBeInstanceOf(FormData);
		if (!(form instanceof FormData))
			throw new Error(
				'Zoho Books did not receive a multipart attachment request.',
			);
		expect(form.get('JSONString')).toBe(
			JSON.stringify({ can_send_in_mail: true }),
		);
		upload = form.get('attachment');
		expect(upload).toBeInstanceOf(Blob);
		if (!(upload instanceof Blob))
			throw new Error('The retainer file part is missing.');
		expect(Array.from(new Uint8Array(await upload.arrayBuffer()))).toEqual([
			37, 80, 68, 70, 45, 49, 46, 52, 10,
		]);
		expect(new Headers(requestInit?.headers).get('content-type')).toBeNull();
	});

	it('accepts both binary files and documented JSON metadata from bill attachment reads', async () => {
		const operation = zohoBooksOperations.find(
			(candidate) => candidate.id === 'get_bill_attachment',
		);
		if (!operation) throw new Error('The bill attachment read is missing.');
		activeOperation = operation;
		fetchSpy.mockResolvedValueOnce(
			new Response(JSON.stringify({ code: 0, message: 'success' }), {
				status: 200,
				headers: { 'content-type': 'application/json' },
			}),
		);
		const output = await makeZohoBooksRequest(
			{ key: 'test-access-token', options: { region: 'us' } },
			operation,
			{
				pathParams: { bill_id: '999999999999999' },
				query: { organization_id: '999999999999999' },
			},
		);
		expect(output).toEqual({ code: 0, message: 'success' });
	});

	it('stops reading a binary response once it exceeds the plugin size limit', async () => {
		const operation = zohoBooksOperations.find(
			(candidate) => candidate.id === 'get_invoice_document_details',
		);
		if (!operation)
			throw new Error('The documented invoice document operation is missing.');
		activeOperation = operation;
		fetchSpy.mockResolvedValueOnce(
			new Response(new Uint8Array(MAX_BINARY_RESPONSE_BYTES + 1), {
				status: 200,
				headers: { 'content-type': 'application/pdf' },
			}),
		);
		const input: ZohoBooksOperationInput = {
			pathParams: {
				invoice_id: '999999999999999',
				document_id: '999999999999999',
			},
			query: { organization_id: '999999999999999' },
		};
		// `unknown` because a failed stream may reject with any JavaScript value.
		const failure = await makeZohoBooksRequest(
			{ key: 'test-access-token', options: { region: 'us' } },
			operation,
			input,
		).catch((error: unknown) => error);
		expect(failure).toBeInstanceOf(Error);
		if (failure instanceof Error)
			expect(failure.message).toContain(
				'exceeded the 10485760-byte plugin limit',
			);
	});

	it('uses the Books OAuth token prefix and sends no implicit organization selection', async () => {
		const operation = zohoBooksOperations.find(
			(candidate) => candidate.id === 'list_organizations',
		);
		if (!operation)
			throw new Error(
				'The documented organization listing operation is missing.',
			);
		activeOperation = operation;
		await makeZohoBooksRequest(
			{ key: 'scope-token', options: {} },
			operation,
			{},
		);
		const [requestUrl, requestInit] = fetchSpy.mock.calls[0] ?? [];
		expect(String(requestUrl)).toBe(
			'https://www.zohoapis.com/books/v3/organizations',
		);
		expect(new Headers(requestInit?.headers).get('authorization')).toBe(
			'Zoho-oauthtoken scope-token',
		);
		expect(new URL(String(requestUrl)).search).toBe('');
	});

	it('sanitizes personal request and response data on propagated API errors', async () => {
		const operation = zohoBooksOperations.find(
			(candidate) => candidate.id === 'create_contact',
		);
		if (!operation)
			throw new Error('The documented contact creation operation is missing.');
		fetchSpy.mockResolvedValueOnce(
			new Response(
				JSON.stringify({
					code: 1001,
					message: 'Rejected private.person@sample.invalid',
				}),
				{
					status: 400,
					headers: { 'content-type': 'application/json' },
				},
			),
		);
		const input: ZohoBooksOperationInput = {
			query: { organization_id: '999999999999999' },
			body: {
				contact_name: 'Private Person',
				email: 'private.person@sample.invalid',
			},
		};
		// `unknown` because a failed request may reject with any JavaScript value.
		const failure = await makeZohoBooksRequest(
			{ key: 'test-access-token', options: { region: 'us' } },
			operation,
			input,
		).catch((error: unknown) => error);
		expect(failure).toBeInstanceOf(ApiError);
		if (failure instanceof ApiError) {
			expect(failure.status).toBe(400);
			expect(failure.request.body).toBeUndefined();
			expect(JSON.stringify(failure.body)).not.toContain(
				'private.person@sample.invalid',
			);
			expect(failure.message).not.toContain('Private Person');
		}
	});

	it('does not propagate personal data embedded in transport exception messages', async () => {
		const operation = zohoBooksOperations.find(
			(candidate) => candidate.id === 'list_contacts',
		);
		if (!operation)
			throw new Error('The documented contact listing operation is missing.');
		fetchSpy.mockRejectedValueOnce(
			new TypeError(
				'fetch failed for https://provider.invalid/?email=private.person@sample.invalid',
			),
		);
		const input: ZohoBooksOperationInput = {
			query: {
				organization_id: '999999999999999',
				email: 'private.person@sample.invalid',
			},
		};
		// `unknown` because a failed request may reject with any JavaScript value.
		const failure = await makeZohoBooksRequest(
			{ key: 'test-access-token', options: { region: 'us' } },
			operation,
			input,
		).catch((error: unknown) => error);
		expect(failure).toBeInstanceOf(Error);
		if (failure instanceof Error) {
			expect(failure.message).not.toContain('private.person@sample.invalid');
			expect(failure.message).toBe(
				'Zoho Books request failed (GET /contacts).',
			);
		}
	});

	it('extracts Retry-After from the real transport without multiplying retries', async () => {
		fetchSpy.mockResolvedValueOnce(
			new Response(JSON.stringify({ code: 44, message: 'Rate limited' }), {
				status: 429,
				headers: { 'content-type': 'application/json', 'retry-after': '4' },
			}),
		);
		const config: OpenAPIConfig = {
			BASE: zohoBooksApiBase('us'),
			VERSION: '3',
			WITH_CREDENTIALS: false,
			CREDENTIALS: 'omit',
			TOKEN: undefined,
		};
		const options: ApiRequestOptions = { method: 'GET', url: '/organizations' };
		// `unknown` because a rejected request can contain any JavaScript value.
		const failure = await request<unknown>(config, options, {
			rateLimitConfig: {
				enabled: true,
				maxRetries: 0,
				initialRetryDelay: 0,
				backoffMultiplier: 1,
				headerNames: { retryAfter: 'retry-after' },
			},
		}).catch((error: unknown) => error);
		expect(failure).toBeInstanceOf(ApiError);
		if (failure instanceof ApiError) expect(failure.retryAfter).toBe(4000);
		expect(fetchSpy).toHaveBeenCalledTimes(1);
	});
});
