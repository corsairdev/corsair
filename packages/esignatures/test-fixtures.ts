// Response bodies built from the examples in https://esignatures.com/docs/api,
// with made-up people and companies. They were not captured from the live API.

export const contractId = '1contr11-2222';
export const signerId = '6signer6-9999';
export const templateId = '4templ44-8888';

export const signer = {
	id: signerId,
	name: 'Sam Signer',
	email: 'sam@tenants.example',
	mobile: '+1 541 754 3010',
	company_name: 'ACME Corp',
	sign_page_url:
		'https://esignatures.com/contracts/1contr11-2222/sign?signature_request=8af1a',
};

export const contract = {
	id: contractId,
	status: 'sent',
	title: 'Rental agreement',
	metadata: 'ID0001',
	source: 'api',
	test: 'no',
	labels: ['rentals'],
	signers: [signer],
};

export const contractCreated = { status: 'queued', data: { contract } };

export const signedContract = {
	...contract,
	status: 'signed',
	contract_pdf_url:
		'https://esignatures.com/contracts/1contr11-2222/pdf?expires=1793928000',
	signers: [{ ...signer, signer_field_values: { city: 'Boston' } }],
};

// GET /api/templates/<id> as the live API answered on 2026-11-06.
export const template = {
	template_id: templateId,
	title: 'Rental agreement',
	created_at: '2025-01-15T08:00:00Z',
	labels: ['rentals'],
	last_contract_created_at: null,
	placeholder_keys: ['tenant_name'],
	signer_field_ids: ['city', 'preferred_contact'],
};

// POST /api/templates as the live API answered on 2026-11-06: `data` is the
// template object, not the one-row array the docs show.
export const templateCreated = {
	status: 'created',
	data: {
		template_id: templateId,
		title: 'Rental agreement',
		created_at: '2026-11-05T22:32:47.212Z',
		labels: [],
		last_contract_created_at: null,
		placeholder_keys: ['tenant_name'],
		signer_field_ids: [],
	},
};

export const templateRow = {
	template_id: templateId,
	title: 'Rental agreement',
};

// eSignatures documents no error body shape; this is the one the live API
// sent for a missing token (403, error_code "forbidden").
export function errorBody(message: string, errorCode = 'forbidden') {
	return {
		status: 'error',
		data: { error_code: errorCode, error_message: message },
	};
}
