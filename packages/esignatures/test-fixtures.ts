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

export const template = {
	template_id: templateId,
	title: 'Rental agreement',
	created_at: '2025-01-15T08:00:00Z',
	placeholder_fields: [{ placeholder_key: 'tenant_name' }],
	signer_field_ids: ['city', 'preferred_contact'],
};

export const templateRow = {
	template_id: templateId,
	title: 'Rental agreement',
};

// eSignatures documents no error body shape; this is the field the client
// reads first.
export function errorBody(message: string) {
	return { error: message };
}
