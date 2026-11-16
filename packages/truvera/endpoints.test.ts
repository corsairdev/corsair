import { z } from 'zod';
import { TruveraEndpointOutputSchemas } from './endpoints/types';
import {
	createdDid,
	credentialMetadata,
	deleted,
	didDocument,
	getDidEnvelope,
	job,
	registry,
	revocationStatus,
	schema,
	signedCredential,
	verificationResult,
} from './test-fixtures';

describe('output schemas keep the provider field names', () => {
	it('parses a DID document', () => {
		const parsed = TruveraEndpointOutputSchemas.getDid.parse(getDidEnvelope);
		expect(parsed.didDocument?.id).toContain('did:cheqd:mainnet:');
		expect(parsed.didDocumentMetadata?.deactivated).toBe(false);
	});

	it('keeps camelCase: the field is verificationMethod', () => {
		const parsed = TruveraEndpointOutputSchemas.getDid.parse(getDidEnvelope);
		expect(parsed.didDocument?.verificationMethod).toHaveLength(1);
		expect(parsed.didDocument).not.toHaveProperty('verification_method');
	});

	it('parses a created DID with its key id', () => {
		const parsed = TruveraEndpointOutputSchemas.createDid.parse(createdDid);
		expect(parsed.keyId).toContain('#keys-1');
		expect(parsed.did).toBeDefined();
	});

	it('parses a DID list of documents', () => {
		const parsed = TruveraEndpointOutputSchemas.listDids.parse([didDocument]);
		expect(parsed).toHaveLength(1);
	});

	it('parses a signed credential with its proof and context', () => {
		const parsed =
			TruveraEndpointOutputSchemas.issueCredential.parse(signedCredential);
		expect(parsed.type).toEqual(['VerifiableCredential', 'BasicCredential']);
		expect(parsed.issuer).toBeDefined();
		expect(parsed.credentialSubject).toBeDefined();
	});

	it('keeps the @context key exactly as JSON-LD spells it', () => {
		const parsed =
			TruveraEndpointOutputSchemas.issueCredential.parse(signedCredential);
		expect(parsed['@context']).toBeDefined();
		expect(parsed).not.toHaveProperty('context');
	});

	it('parses credential metadata whose credential body is null', () => {
		const parsed =
			TruveraEndpointOutputSchemas.getCredential.parse(credentialMetadata);
		expect(parsed.credential).toBeNull();
		expect(parsed.revoked).toBe(false);
		expect(parsed.algorithm).toBe('dockbbs');
	});

	it('parses a credential list', () => {
		const parsed = TruveraEndpointOutputSchemas.listCredentials.parse([
			credentialMetadata,
			{ ...credentialMetadata, revoked: true },
		]);
		expect(parsed).toHaveLength(2);
		expect(parsed[1]?.revoked).toBe(true);
	});

	it('parses a schema with its properties and required list', () => {
		const parsed = TruveraEndpointOutputSchemas.createSchema.parse(schema);
		expect(parsed.required).toEqual(['name']);
		expect(parsed.additionalProperties).toBe(false);
	});

	it('parses a registry in the live shape', () => {
		const parsed = TruveraEndpointOutputSchemas.getRegistry.parse(registry);
		expect(parsed.policy_and_type?.addOnly).toBe(true);
		expect(parsed.registry_type).toBe('StatusList2021Entry');
		expect(parsed.latest_credential_index).toBe(0);
	});

	it('parses a revocation status', () => {
		const parsed =
			TruveraEndpointOutputSchemas.getRevocationStatus.parse(revocationStatus);
		expect(parsed.revoked).toBe(true);
		expect(parsed.status).toBe('revoked');
	});

	it('parses a verification result', () => {
		const parsed =
			TruveraEndpointOutputSchemas.verify.parse(verificationResult);
		expect(parsed.verified).toBe(true);
		expect(parsed.errors).toEqual([]);
	});

	it('parses a job with a null error', () => {
		const parsed = TruveraEndpointOutputSchemas.getJob.parse(job);
		expect(parsed.status).toBe('succeeded');
		expect(parsed.error).toBeNull();
	});

	it('parses a delete that answered with an empty object', () => {
		expect(() =>
			TruveraEndpointOutputSchemas.deleteDid.parse(deleted),
		).not.toThrow();
	});
});

describe('wrong-shaped bodies fail loudly', () => {
	it('rejects a credential list that is an object', () => {
		expect(() =>
			TruveraEndpointOutputSchemas.listCredentials.parse({ items: [] }),
		).toThrow(z.ZodError);
	});

	it('rejects a DID list whose element is a number', () => {
		expect(() => TruveraEndpointOutputSchemas.listDids.parse([42])).toThrow(
			z.ZodError,
		);
	});

	it('rejects a verification result whose verified is a string', () => {
		expect(() =>
			TruveraEndpointOutputSchemas.verify.parse({ verified: 'true' }),
		).toThrow(z.ZodError);
	});

	it('rejects a registry whose addOnly is a number', () => {
		expect(() =>
			TruveraEndpointOutputSchemas.getRegistry.parse({
				...registry,
				addOnly: 1,
			}),
		).toThrow(z.ZodError);
	});

	it('rejects a credential metadata whose byteSize is a string', () => {
		expect(() =>
			TruveraEndpointOutputSchemas.getCredential.parse({
				...credentialMetadata,
				byteSize: '1003',
			}),
		).toThrow(z.ZodError);
	});
});
