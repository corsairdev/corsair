import type { IgnisignEndpointInputs } from './endpoints/types';
import {
	BinaryDataSchema,
	IgnisignEndpointInputSchemas,
	IgnisignEndpointOutputSchemas,
	SignatureProofTypeSchema,
} from './endpoints/types';
import {
	ignisignEndpointMeta,
	ignisignEndpointSchemas,
	ignisignEndpointsNested,
} from './index';
import { IgnisignSchema } from './schema';
import { ignisignEntities } from './schema/database';

describe('Ignisign schema', () => {
	it('declares a semver version', () => {
		expect(IgnisignSchema.version).toBeDefined();
		expect(IgnisignSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an empty entities map', () => {
		expect(IgnisignSchema.entities).toBe(ignisignEntities);
		expect(IgnisignSchema.entities).toEqual({});
	});

	it('keeps nested endpoint registry, schema map and metadata keys in sync', () => {
		const nestedKeys: string[] = [];
		for (const [groupName, groupObj] of Object.entries(
			ignisignEndpointsNested,
		)) {
			for (const actionName of Object.keys(groupObj)) {
				nestedKeys.push(`${groupName}.${actionName}`);
			}
		}

		const schemaKeys = Object.keys(ignisignEndpointSchemas);
		const metaKeys = Object.keys(ignisignEndpointMeta);

		expect(nestedKeys.sort()).toEqual(schemaKeys.sort());
		expect(nestedKeys.sort()).toEqual(metaKeys.sort());
		expect(nestedKeys.length).toBe(41);
	});
});

describe('Ignisign endpoint schemas validation', () => {
	it('accepts omitted defaulted fields in public input types and fills them when parsed', () => {
		const initInput: IgnisignEndpointInputs['signatureRequests.init'] = {
			appId: 'appId_abc',
		};
		const tokenInput: IgnisignEndpointInputs['bareSignatures.getProofToken'] = {
			appEnv: 'DEVELOPMENT',
			client_id: 'client_123',
			client_secret: 'secret',
			code_verifier: 'verifier',
			redirect_uri: 'https://example.com/callback',
			code: 'auth_code',
		};

		expect(
			IgnisignEndpointInputSchemas['signatureRequests.init'].parse(initInput)
				.appEnv,
		).toBe('DEVELOPMENT');
		expect(
			IgnisignEndpointInputSchemas['bareSignatures.getProofToken'].parse(
				tokenInput,
			).grant_type,
		).toBe('authorization_code');
	});

	it('validates signatureRequests.createInOneCall input and output', () => {
		const validInput = {
			title: 'Employment Agreement',
			signatureMethod: 'SIMPLE_STD',
			signers: [
				{
					email: 'john.doe@example.com',
					firstName: 'John',
					lastName: 'Doe',
				},
			],
			documents: [
				{
					originalName: 'contract.pdf',
					mimeType: 'application/pdf',
					base64: 'JVBERi0xLjQK...',
				},
			],
		};
		expect(
			IgnisignEndpointInputSchemas[
				'signatureRequests.createInOneCall'
			].safeParse(validInput).success,
		).toBe(true);

		// Invalid: empty signers array
		expect(
			IgnisignEndpointInputSchemas[
				'signatureRequests.createInOneCall'
			].safeParse({
				...validInput,
				signers: [],
			}).success,
		).toBe(false);

		// Invalid: bad email
		expect(
			IgnisignEndpointInputSchemas[
				'signatureRequests.createInOneCall'
			].safeParse({
				...validInput,
				signers: [{ email: 'not-an-email' }],
			}).success,
		).toBe(false);

		const validOutput = {
			_id: 'sig_req_123',
			appId: 'appId_abc',
			status: 'READY',
			title: 'Employment Agreement',
			signers: [
				{
					signerId: 'signer_1',
					email: 'john.doe@example.com',
				},
			],
			documents: [
				{
					_id: 'doc_1',
					fileName: 'contract.pdf',
				},
			],
		};
		expect(
			IgnisignEndpointOutputSchemas[
				'signatureRequests.createInOneCall'
			].safeParse(validOutput).success,
		).toBe(true);
	});

	it('validates signers.create input and output', () => {
		const validInput = {
			appId: 'appId_abc',
			appEnv: 'DEVELOPMENT' as const,
			firstName: 'Alice',
			lastName: 'Smith',
			email: 'alice.smith@example.com',
		};
		expect(
			IgnisignEndpointInputSchemas['signers.create'].safeParse(validInput)
				.success,
		).toBe(true);

		// Missing appId
		expect(
			IgnisignEndpointInputSchemas['signers.create'].safeParse({
				firstName: 'Alice',
			}).success,
		).toBe(false);

		const validOutput = {
			signerId: 'signer_123',
			entityType: 'NATURAL',
			success: true,
			alreadyExists: false,
			authSecret: 'secret_pin_code',
		};
		expect(
			IgnisignEndpointOutputSchemas['signers.create'].safeParse(validOutput)
				.success,
		).toBe(true);
	});

	it('validates documents.initialize input and output', () => {
		const validInput = {
			appId: 'appId_abc',
			appEnv: 'STAGING' as const,
			signatureRequestId: 'sig_req_123',
			label: 'NDA Document',
		};
		expect(
			IgnisignEndpointInputSchemas['documents.initialize'].safeParse(validInput)
				.success,
		).toBe(true);

		const validOutput = {
			documentId: 'doc_123',
		};
		expect(
			IgnisignEndpointOutputSchemas['documents.initialize'].safeParse(
				validOutput,
			).success,
		).toBe(true);
	});

	it('validates documents.downloadOriginalDoc binary output', () => {
		const validBinary = {
			kind: 'binary' as const,
			contentType: 'application/pdf',
			base64: 'JVBERi0xLjQK...',
			size: 1024,
		};
		expect(BinaryDataSchema.safeParse(validBinary).success).toBe(true);
		expect(
			BinaryDataSchema.safeParse({ kind: 'other', base64: '...' }).success,
		).toBe(false);
	});

	it('validates proofs.downloadSignatureByType input and output', () => {
		expect(
			SignatureProofTypeSchema.safeParse('PDF_WITH_SIGNATURES').success,
		).toBe(true);
		expect(
			SignatureProofTypeSchema.safeParse('INVALID_PROOF_TYPE').success,
		).toBe(false);

		const validInput = {
			documentId: 'doc_123',
			signatureType: 'PDF_WITH_SIGNATURES' as const,
		};
		expect(
			IgnisignEndpointInputSchemas['proofs.downloadSignatureByType'].safeParse(
				validInput,
			).success,
		).toBe(true);
	});

	it('validates seal.signM2M input and output', () => {
		const validInput = {
			appId: 'appId_abc',
			appEnv: 'PRODUCTION' as const,
			m2mId: 'm2m_123',
			documentHashSignedByM2MPrivateKey: 'hex_signature_bytes',
			document: {
				documentType: 'PDF',
				documentHash: 'sha256_hash_here',
				label: 'Invoice Seal',
			},
		};
		expect(
			IgnisignEndpointInputSchemas['seal.signM2M'].safeParse(validInput)
				.success,
		).toBe(true);

		const validOutput = {
			signatureRequestId: 'sig_req_1',
			documentId: 'doc_1',
			documentHash: 'sha256_hash_here',
			proofBase64: 'base64proof',
		};
		expect(
			IgnisignEndpointOutputSchemas['seal.signM2M'].safeParse(validOutput)
				.success,
		).toBe(true);
	});

	it('validates logCapsules.create input and output', () => {
		const validInput = {
			appId: 'appId_abc',
			appEnv: 'DEVELOPMENT' as const,
			hashSha256_b64: 'c2hhMjU2aGFzaA==',
		};
		expect(
			IgnisignEndpointInputSchemas['logCapsules.create'].safeParse(validInput)
				.success,
		).toBe(true);

		const validOutput = {
			hashSha256_b64: 'c2hhMjU2aGFzaA==',
			timestamp_b64: 'dGltZXN0YW1w',
		};
		expect(
			IgnisignEndpointOutputSchemas['logCapsules.create'].safeParse(validOutput)
				.success,
		).toBe(true);
	});
});
