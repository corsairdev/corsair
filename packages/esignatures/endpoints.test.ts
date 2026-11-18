import { logEventFromContext } from 'corsair/core';
import { ESignaturesAPIError } from './client';
import { Contracts, Templates } from './endpoints';
import {
	contract,
	contractCreated,
	contractId,
	errorBody,
	signer,
	signerId,
	template,
	templateCreated,
	templateId,
	templateRow,
} from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const API_KEY = 'es-test-key';

// unknown: negative cases pass values no schema accepts.
function invoke<T>(
	endpoint: (ctx: never, input: never) => Promise<T>,
	input: unknown,
): Promise<T> {
	// The fake context only carries what the endpoints read (ctx.key).
	return endpoint({ key: API_KEY } as never, input as never);
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON.
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
		body: init.body ? (JSON.parse(String(init.body)) as unknown) : undefined,
	};
}

function expectAuthenticated() {
	const sent = lastRequest();
	expect(sent.origin).toBe('https://esignatures.com');
	expect(sent.headers.get('authorization')).toBe(
		`Basic ${Buffer.from(`${API_KEY}:`).toString('base64')}`,
	);
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('contracts.create', () => {
	it('POSTs the create body and unwraps data.contract', async () => {
		respond(contractCreated);

		const input = {
			template_id: templateId,
			signers: [{ name: 'Sam Signer', email: signer.email }],
			title: 'Rental agreement',
			test: 'yes',
		} as const;
		const result = await invoke(Contracts.create, input);

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/api/contracts',
			body: input,
		});
		expect(result).toEqual({ status: 'queued', contract });
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'esignatures.contracts.create',
			{
				templateId,
				signers: 1,
				test: true,
				contractId,
				contractStatus: 'sent',
			},
			'completed',
		);
	});

	it("forwards signer_fields and the docs' email override names", async () => {
		respond(contractCreated);

		const input = {
			template_id: templateId,
			signers: [{ name: 'Sam Signer', email: signer.email }],
			signer_fields: [{ signer_field_id: 'city', default_value: 'Boston' }],
			emails: {
				signature_request_subject: 'Your document is ready to sign',
				signature_request_text: 'Hi __FULL_NAME__, please sign.',
				final_contract_subject: 'Your document is signed',
				final_contract_text: 'Hi __FULL_NAME__, it is signed.',
				cc_email_addresses: ['legal@tenants.example'],
				reply_to: 'support@tenants.example',
			},
		};
		await invoke(Contracts.create, input);

		// A top-level key the schema does not know is stripped, so this pins
		// that signer_fields reaches eSignatures with the email names intact.
		expect(lastRequest().body).toEqual(input);
	});

	it('rejects a create without template_id before any request', async () => {
		await expect(
			invoke(Contracts.create, { signers: [{ name: 'Sam Signer' }] }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('contracts.get', () => {
	it('GETs the contract and unwraps data.contract', async () => {
		respond({ data: { contract: contract } });

		const result = await invoke(Contracts.get, { contract_id: contractId });

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: `/api/contracts/${contractId}`,
			body: undefined,
		});
		expect(result.contract?.status).toBe('sent');
		expect(result.contract?.signers?.[0]?.sign_page_url).toContain(
			'https://esignatures.com/',
		);
	});

	it('keeps signer field values and an unknown status on a signed contract', async () => {
		respond({
			data: {
				contract: {
					...contract,
					status: 'co-signed',
					signers: [{ ...signer, signer_field_values: { city: 'Boston' } }],
				},
			},
		});

		const result = await invoke(Contracts.get, { contract_id: contractId });

		expect(result.contract?.status).toBe('co-signed');
		expect(result.contract?.signers?.[0]?.signer_field_values).toEqual({
			city: 'Boston',
		});
	});
});

describe('contracts.withdraw', () => {
	it('POSTs a bodyless withdraw and returns the status', async () => {
		respond({ status: 'withdrawn' });

		const result = await invoke(Contracts.withdraw, {
			contract_id: contractId,
		});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: `/api/contracts/${contractId}/withdraw`,
			body: undefined,
		});
		expect(result).toEqual({ status: 'withdrawn' });
	});

	it('does not replay a 400 for an already signed contract', async () => {
		respond(errorBody('Signed contracts cannot be withdrawn'), 400);

		await expect(
			invoke(Contracts.withdraw, { contract_id: contractId }),
		).rejects.toBeInstanceOf(ESignaturesAPIError);
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});
});

describe('contracts.sendDraft', () => {
	it('POSTs a bodyless send_draft and returns the queued status', async () => {
		respond({ status: 'queued' });

		const result = await invoke(Contracts.sendDraft, {
			contract_id: contractId,
		});

		expect(lastRequest().path).toBe(`/api/contracts/${contractId}/send_draft`);
		expect(result).toEqual({ status: 'queued' });
	});
});

describe('contracts.addSigner', () => {
	it('POSTs the signer object alone, not wrapped in an array', async () => {
		respond({ status: 'success' });

		const result = await invoke(Contracts.addSigner, {
			contract_id: contractId,
			signer: { name: 'Late Signer', email: 'late@tenants.example' },
		});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: `/api/contracts/${contractId}/signers`,
			body: { name: 'Late Signer', email: 'late@tenants.example' },
		});
		expect(result).toEqual({ status: 'success' });
	});
});

describe('contracts.updateSigner', () => {
	it('POSTs the new details to the signer path', async () => {
		respond({ status: 'updated' });

		const result = await invoke(Contracts.updateSigner, {
			contract_id: contractId,
			signer_id: signerId,
			signer: { name: 'Sam Signer-Smith' },
		});

		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: `/api/contracts/${contractId}/signers/${signerId}`,
			body: { name: 'Sam Signer-Smith' },
		});
		expect(result).toEqual({ status: 'updated' });
	});
});

describe('contracts.resendToSigner', () => {
	it('POSTs a bodyless send_contract to the signer path', async () => {
		respond({ status: 'queued' });

		const result = await invoke(Contracts.resendToSigner, {
			contract_id: contractId,
			signer_id: signerId,
		});

		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: `/api/contracts/${contractId}/signers/${signerId}/send_contract`,
			body: undefined,
		});
		expect(result).toEqual({ status: 'queued' });
	});
});

describe('contracts.deleteSigner', () => {
	it('POSTs a bodyless delete to the signer path', async () => {
		respond({ status: 'queued' });

		const result = await invoke(Contracts.deleteSigner, {
			contract_id: contractId,
			signer_id: signerId,
		});

		expect(lastRequest().path).toBe(
			`/api/contracts/${contractId}/signers/${signerId}/delete`,
		);
		expect(result).toEqual({ status: 'queued' });
	});
});

describe('templates.list', () => {
	it('GETs the templates and reshapes data into templates', async () => {
		respond({
			data: [templateRow, { ...templateRow, template_id: '4templ44-9999' }],
		});

		const result = await invoke(Templates.list, {});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/api/templates',
			body: undefined,
		});
		expect(result.templates).toHaveLength(2);
		expect(result.templates[0]).toEqual(templateRow);
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'esignatures.templates.list',
			{ count: 2 },
			'completed',
		);
	});

	it('returns an empty list when data is missing', async () => {
		respond({});

		const result = await invoke(Templates.list, {});
		expect(result.templates).toEqual([]);
	});
});

describe('templates.get', () => {
	it('GETs the template and unwraps data', async () => {
		respond({ data: template });

		const result = await invoke(Templates.get, { template_id: templateId });

		expect(lastRequest().path).toBe(`/api/templates/${templateId}`);
		expect(result.template?.template_id).toBe(templateId);
		expect(result.template?.signer_field_ids).toEqual([
			'city',
			'preferred_contact',
		]);
		expect(result.template?.placeholder_keys).toEqual(['tenant_name']);
	});

	it("accepts the docs' placeholder_fields list of key strings", async () => {
		respond({
			data: { template_id: templateId, placeholder_fields: ['interest_rate'] },
		});

		const result = await invoke(Templates.get, { template_id: templateId });

		expect(result.template?.placeholder_fields).toEqual(['interest_rate']);
	});
});

describe('templates.create', () => {
	it('POSTs the markdown and returns the new template ID', async () => {
		respond({ data: [{ template_id: templateId }] });

		const result = await invoke(Templates.create, {
			title: 'Rental agreement',
			markdown: '# Rental agreement\n\n{{tenant_name}} agrees.',
		});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/api/templates',
			body: {
				title: 'Rental agreement',
				markdown: '# Rental agreement\n\n{{tenant_name}} agrees.',
			},
		});
		expect(result).toEqual({ template_id: templateId });
	});

	it('reads the ID from the object the live API returns', async () => {
		respond(templateCreated);

		const result = await invoke(Templates.create, {
			title: 'Rental agreement',
			markdown: '# Rental agreement\n\n{{tenant_name}} agrees.',
		});

		expect(result).toEqual({ template_id: templateId });
	});
});

describe('templates.delete', () => {
	it('POSTs a bodyless delete and returns the status', async () => {
		respond({ status: 'deleted' });

		const result = await invoke(Templates.deleteTemplate, {
			template_id: templateId,
		});

		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: `/api/templates/${templateId}/delete`,
			body: undefined,
		});
		expect(result).toEqual({ status: 'deleted' });
	});
});
