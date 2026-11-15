/**
 * Shapes from Truvera's published OpenAPI document
 * (`https://swagger-api.truvera.io/openapi.yaml`) and from a live 401, which
 * returns the `{ status, type, message, errors }` envelope below.
 */

export const did = 'did:cheqd:mainnet:ac2b9027-ec1a-4ee2-aad1-1e316e7d6f59';

export const didDocument = {
	id: did,
	controller: did,
	alsoKnownAs: [],
	verificationMethod: [
		{
			id: `${did}#keys-1`,
			type: 'Ed25519VerificationKey2020',
			controller: did,
			publicKeyMultibase: 'z6Mk...',
		},
	],
	authentication: [`${did}#keys-1`],
	assertionMethod: [`${did}#keys-1`],
	service: [],
};

export const createdDid = {
	did,
	controller: did,
	didDocument,
	keyId: `${did}#keys-1`,
};

export const getDidEnvelope = {
	didDocument,
	didDocumentMetadata: {
		did,
		controller: did,
		created: '2026-01-01T00:00:00Z',
		updated: '2026-01-01T00:00:00Z',
		deactivated: false,
		versionId: '1',
	},
};

export const profile = {
	did,
	name: 'Truvera Issuer',
	description: 'Issues course certificates',
	logo: 'https://acme.com/logo.png',
	website: 'https://acme.com',
	email: 'issuer@acme.com',
};

export const credentialMetadata = {
	id: `https://creds.truvera.io/${did.split(':').pop()}`,
	issuerKey: 'did:key:z6Mk...dsmK',
	issuerName: 'Truvera Issuer',
	type: 'VerifiableCredential',
	revocationRegistry: 'e6d3...59d1',
	revoked: false,
	createdAt: '2026-05-02T11:13:03.445Z',
	expiryDate: '2027-05-02T11:13:03.445Z',
	expirationDate: '2027-05-02T11:13:03.445Z',
	issuanceDate: '2026-05-02T11:13:02.648Z',
	byteSize: 1003,
	persist: false,
	index: '1004',
	subjectRef: 'Acme Ref',
	subjectId: 'did:dock:5DDtWbr9C5HmK3mcz5HRXKbmf5sSCvAycqzWffVbvg9nq9fk',
	whitelabel: null,
	algorithm: 'dockbbs',
	credential: null,
};

export const signedCredential = {
	'@context': [
		'https://www.w3.org/2018/credentials/v1',
		'https://docknetwork.github.io/vc-schemas/basic-credential.json-ld',
	],
	id: 'https://creds.truvera.io/1234',
	type: ['VerifiableCredential', 'BasicCredential'],
	credentialSubject: {
		id: 'did:key:z6MkqBcwvYurNSSqyBkxavv4fkaq2iu3v3YGMbdyfa4bVNxD',
		name: 'A. Holder',
	},
	issuer: did,
	issuanceDate: '2026-05-02T00:00:00Z',
	expirationDate: '2030-09-20T00:13:59.270Z',
	credentialStatus: 'e6d3...59d1',
	proof: {
		type: 'Sr25519Signature2020',
		created: '2026-05-02T00:00:01Z',
		verificationMethod: `${did}#keys-1`,
		proofPurpose: 'assertionMethod',
		proofValue: 'z7zTs4pV...',
	},
};

export const schema = {
	id: 'https://acme.com/schemas/basic-credential.json',
	$schema: 'https://json-schema.org/draft/2020-12/schema',
	name: 'Basic Credential',
	description: 'A name on a credential',
	type: 'object',
	properties: { name: { type: 'string' } },
	required: ['name'],
	additionalProperties: false,
};

export const registry = {
	id: 'e6d3...59d1',
	addOnly: false,
	policy: [],
	type: 'dock',
	created: '2026-05-02T00:00:00Z',
};

export const revocationStatus = {
	status: 'revoked',
	type: 'StatusList2021',
	revoked: true,
};

export const verificationResult = {
	verified: true,
	results: [{ purpose: 'assertionMethod', verified: true }],
	errors: [],
};

export const job = {
	id: 'job-123',
	status: 'succeeded',
	result: { credentialId: 'https://creds.truvera.io/1234' },
	error: null,
};

/** A delete answers 200 with an empty object. */
export const deleted = {};

// ---------------------------------------------------------------------------
// error envelopes, copied from the live 401
// ---------------------------------------------------------------------------

export const unauthorized = {
	message: 'Cannot decode JWT: eyJhbGciOiJIUzUxMiJ9.x',
	errors: [
		{
			path: '/credentials',
			message: 'Cannot decode JWT: eyJhbGciOiJIUzUxMiJ9.x',
		},
	],
	status: 401,
	type: 'ServerError',
};

export const validationFailed = {
	message: 'Invalid credential parameters',
	errors: [
		{ path: 'credential.issuer', message: 'must be a DID you control' },
		{ path: 'credential.type', message: 'must not be empty' },
	],
	status: 400,
	type: 'ServerError',
};

export const paymentRequired = {
	message: 'Transaction limit reached',
	errors: [],
	status: 402,
	type: 'ServerError',
};
