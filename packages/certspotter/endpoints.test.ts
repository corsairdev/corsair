import { z } from 'zod';
import { CertSpotterEndpointOutputSchemas } from './endpoints/types';
import {
	bareIssuance,
	issuance,
	issuancePage,
	revokedIssuance,
	unknownRevocation,
} from './test-fixtures';

describe('output schemas keep the provider field names', () => {
	it('parses a full issuance with every expanded field', () => {
		const parsed = CertSpotterEndpointOutputSchemas.listIssuances.parse([
			issuance,
		]);
		expect(parsed[0]?.id).toBe('4326219514');
		expect(parsed[0]?.dns_names).toHaveLength(4);
		expect(parsed[0]?.issuer?.friendly_name).toBe('Sectigo');
		expect(parsed[0]?.pubkey?.bit_length).toBe(2048);
		expect(parsed[0]?.revocation?.checked_at).toBe('2022-12-19T18:47:39Z');
	});

	it('keeps snake_case: the field is tbs_sha256, not tbsSha256', () => {
		const parsed = CertSpotterEndpointOutputSchemas.listIssuances.parse([
			issuance,
		]);
		expect(parsed[0]?.tbs_sha256).toHaveLength(64);
		expect(parsed[0]).not.toHaveProperty('tbsSha256');
	});

	it('parses an unexpanded issuance, where the optional fields are absent', () => {
		const parsed = CertSpotterEndpointOutputSchemas.listIssuances.parse([
			bareIssuance,
		]);
		expect(parsed[0]?.dns_names).toBeUndefined();
		expect(parsed[0]?.issuer).toBeUndefined();
		expect(parsed[0]?.revoked).toBe(false);
	});

	it('accepts revoked as null, which means the status is unknown', () => {
		const parsed = CertSpotterEndpointOutputSchemas.listIssuances.parse([
			unknownRevocation,
		]);
		expect(parsed[0]?.revoked).toBeNull();
	});

	it('parses a revoked certificate with its reason code', () => {
		const parsed = CertSpotterEndpointOutputSchemas.listIssuances.parse([
			revokedIssuance,
		]);
		expect(parsed[0]?.revoked).toBe(true);
		expect(parsed[0]?.revocation?.reason).toBe(0);
	});

	it('keeps issuer.ca_domains, which the reference spells caa_domains', () => {
		const parsed = CertSpotterEndpointOutputSchemas.listIssuances.parse([
			issuance,
		]);
		expect(parsed[0]?.issuer?.caa_domains).toEqual([
			'sectigo.com',
			'comodo.com',
		]);
	});

	it('keeps an ecdsa key with its curve and no bit_length', () => {
		const parsed = CertSpotterEndpointOutputSchemas.listIssuances.parse([
			{ ...issuance, pubkey: { type: 'ecdsa', curve: 'P-256' } },
		]);
		expect(parsed[0]?.pubkey?.curve).toBe('P-256');
		expect(parsed[0]?.pubkey?.bit_length).toBeUndefined();
	});

	it('parses an empty page', () => {
		expect(
			CertSpotterEndpointOutputSchemas.listIssuances.parse([]),
		).toHaveLength(0);
	});

	it('parses the firehose through the same schema', () => {
		const parsed =
			CertSpotterEndpointOutputSchemas.firehose.parse(issuancePage);
		expect(parsed).toHaveLength(2);
	});
});

describe('wrong-shaped bodies fail loudly', () => {
	it('rejects a page that is an object, not an array', () => {
		expect(() =>
			CertSpotterEndpointOutputSchemas.listIssuances.parse({ issuances: [] }),
		).toThrow(z.ZodError);
	});

	it('rejects an issuance with no id', () => {
		const { id, ...withoutId } = bareIssuance;
		void id;
		expect(() =>
			CertSpotterEndpointOutputSchemas.listIssuances.parse([withoutId]),
		).toThrow(z.ZodError);
	});

	it('rejects a `revoked` that arrived as the string "false"', () => {
		expect(() =>
			CertSpotterEndpointOutputSchemas.listIssuances.parse([
				{ ...bareIssuance, revoked: 'false' },
			]),
		).toThrow(z.ZodError);
	});

	it('rejects an id sent as a number', () => {
		expect(() =>
			CertSpotterEndpointOutputSchemas.listIssuances.parse([
				{ ...bareIssuance, id: 17433287100 },
			]),
		).toThrow(z.ZodError);
	});

	it('rejects a not_before that is a date instead of a string', () => {
		expect(() =>
			CertSpotterEndpointOutputSchemas.listIssuances.parse([
				{ ...bareIssuance, not_before: new Date() },
			]),
		).toThrow(z.ZodError);
	});
});
